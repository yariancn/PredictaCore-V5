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
        let hechos = "DNA base. Análisis deductivo PredictaCore.";
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` } 
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
            } catch (e) { console.log("Jina no disponible."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. NÚCLEO DE PRODUCCIÓN (GOOGLE v1)
        // Entramos por la ruta estable 'v1' que es la que tu llave exige
        const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });

        const dataG = await googleRes.json();

        if (dataG.candidates && dataG.candidates[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: dataG.candidates[0].content.parts[0].text });
        }

        // 3. RESPALDO XAI (Solo si hay saldo)
        if (XAI_API_KEY) {
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-2",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const dataX = await xRes.json();
            if (dataX.choices && dataX.choices[0]?.message?.content) {
                return res.json({ content: dataX.choices[0].message.content });
            }
        }

        // Si llegamos aquí, mostramos el error real de producción para no adivinar
        const errorMsg = dataG.error?.message || "Error de conexión. Verifica el saldo en Grok o cuota en Google.";
        throw new Error(errorMsg);

    } catch (error) {
        console.error("LOG:", error.message);
        res.status(500).json({ content: `[ESTADO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v52.0 [PRODUCTION-READY] activo.`));
