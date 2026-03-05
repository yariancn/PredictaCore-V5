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
        // 1. INVESTIGACIÓN REAL (JINA AI)
        let hechos = "Analizando DNA...";
        if (JINA_API_KEY) {
            const jRes = await fetch(`https://r.jina.ai/${dna}`, { headers: { "Authorization": `Bearer ${JINA_API_KEY}` } });
            if (jRes.ok) hechos = (await jRes.text()).substring(0, 3500);
        }

        const promptFinal = `${PERSONA}\n\nHECHOS: ${hechos}\n\nACTIVO: ${dna}\nFASE: ${PROMPTS[etapaId](dna)}`;

        // 2. MOTOR GOOGLE (Sincronizado a 2026)
        // Probamos con la serie 2.0 y el alias 'latest'
        const modelosGoogle = ["gemini-2.0-flash", "gemini-1.5-flash-latest"];
        for (const m of modelosGoogle) {
            const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
            });
            const gData = await gRes.json();
            if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
                return res.json({ content: gData.candidates[0].content.parts[0].text });
            }
        }

        // 3. MOTOR X.AI (Actualizado a Grok-2)
        if (XAI_API_KEY) {
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-2", // Actualizado de grok-beta
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xData = await xRes.json();
            if (xData.choices?.[0]?.message?.content) {
                return res.json({ content: xData.choices[0].message.content });
            }
        }

        throw new Error("Ningún modelo (Gemini 2.0 o Grok 2) reconoció la petición.");

    } catch (error) {
        console.error("LOG FINAL:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}. Intenta con un DNA más corto.` });
    }
});

app.listen(port, () => console.log(`PredictaCore v45.0 [MODERN-CORE] activo.`));
