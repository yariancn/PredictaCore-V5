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

    const promptFinal = `${PERSONA}\n\n[INVESTIGACIÓN DE HECHOS]:\n(Extrayendo data real...)\n\n[DNA]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

    try {
        // 1. OBTENER HECHOS REALES CON JINA
        let hechos = "";
        const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
            headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        if (jinaRes.ok) hechos = (await jinaRes.text()).substring(0, 4000);

        // 2. INTENTO INTELIGENTE: GOOGLE (Detección Dinámica)
        // Probamos los 3 nombres de modelo más probables en 2026
        const modelosGoogle = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        for (const modelName of modelosGoogle) {
            const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `HECHOS:\n${hechos}\n\n${promptFinal}` }] }] })
            });
            
            const data = await googleRes.json();
            if (data.candidates && data.candidates[0].content) {
                return res.json({ content: data.candidates[0].content.parts[0].text });
            }
        }

        // 3. SI GOOGLE FALLA -> ACTIVAR GROK (xAI) AUTOMÁTICAMENTE
        if (XAI_API_KEY) {
            console.log("Google Offline. Activando Grok...");
            const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: `HECHOS:\n${hechos}\n\n${promptFinal}` }]
                })
            });
            const xaiData = await xaiRes.json();
            return res.json({ content: xaiData.choices[0].message.content });
        }

        throw new Error("Ningún núcleo respondió.");

    } catch (error) {
        console.error("Fallo Total:", error.message);
        res.status(500).json({ content: "Error en la red neuronal. Reintentando..." });
    }
});

app.listen(port, () => console.log(`PredictaCore v38.0 [SOVEREIGN] activo en puerto ${port}`));
