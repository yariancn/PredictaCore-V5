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
        // 1. ESCÁNER DE HECHOS (JINA AI) - Optimizado para velocidad
        let hechos = "DNA: " + dna;
        if (JINA_API_KEY) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos max
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
            } catch (e) { console.log("Jina omitido por tiempo."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO]: ${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. CARRUSEL DE MODELOS 2026 (Nombres Actualizados)
        // Probamos los 3 'caballos de batalla' que Google tiene activos HOY
        const intentos = [
            { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}` },
            { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}` },
            { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}` }
        ];

        let respuesta = null;

        for (const i of intentos) {
            try {
                const gFetch = await fetch(i.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                const gData = await gFetch.json();
                if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
                    respuesta = gData.candidates[0].content.parts[0].text;
                    break;
                }
            } catch (e) { continue; }
        }

        // 3. RESPALDO XAI (GROK-2) - Con tus 20 USD de saldo
        if (!respuesta && XAI_API_KEY) {
            console.log("Google falló. Usando saldo de Grok...");
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${XAI_API_KEY}`,
                    "User-Agent": "PredictaCore/1.0" 
                },
                body: JSON.stringify({
                    model: "grok-2", // Modelo estable marzo 2026
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xData = await xRes.json();
            respuesta = xData.choices?.[0]?.message?.content;
        }

        if (respuesta) return res.json({ content: respuesta });
        
        throw new Error("Ningún núcleo respondió. Verifica que tus llaves no tengan espacios extras en Railway.");

    } catch (error) {
        res.status(500).json({ content: `[ESTADO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v54.0 [TITÁN] activo.`));
