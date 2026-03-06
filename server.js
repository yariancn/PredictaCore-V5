const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY, XAI_API_KEY } = process.env;

    try {
        // 1. ESCÁNER DE HECHOS (JINA AI)
        let hechos = "DNA base. Análisis PredictaCore.";
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` } 
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
            } catch (e) { console.log("Jina no disponible."); }
        }

        const promptFinal = `${PERSONA}\n\n[HECHOS]:\n${hechos}\n\n[ADN]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. CARRUSEL DE GOOGLE (Probamos 3 configuraciones)
        const configsGoogle = [
            { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}` },
            { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}` },
            { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}` }
        ];

        let respuestaFinal = null;

        for (const config of configsGoogle) {
            try {
                const gFetch = await fetch(config.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                const dataG = await gFetch.json();
                if (dataG.candidates?.[0]?.content?.parts?.[0]?.text) {
                    respuestaFinal = dataG.candidates[0].content.parts[0].text;
                    break; 
                }
            } catch (e) { console.log("Ruta de Google fallida, intentando siguiente..."); }
        }

        // 3. RESPALDO XAI (GROK-2) - Si tienes saldo, este es el seguro de vida
        if (!respuestaFinal && XAI_API_KEY) {
            console.log(`Google falló. Activando Grok-2 para ${etapaId}...`);
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${XAI_API_KEY}` 
                },
                body: JSON.stringify({
                    model: "grok-2", 
                    messages: [
                        { role: "system", content: PERSONA },
                        { role: "user", content: promptFinal }
                    ]
                })
            });
            const dataX = await xRes.json();
            if (dataX.choices?.[0]?.message?.content) {
                respuestaFinal = dataX.choices[0].message.content;
            }
        }

        if (respuestaFinal) {
            return res.json({ content: respuestaFinal });
        }

        throw new Error("Ninguna IA respondió. Revisa tus llaves en Railway.");

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v53.0 [ULTRA-RESILIENT] activo.`));
