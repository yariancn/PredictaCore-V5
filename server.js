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
        let hechos = "DNA base.";
        if (JINA_API_KEY) {
            const jRes = await fetch(`https://r.jina.ai/${dna}`, { headers: { "Authorization": `Bearer ${JINA_API_KEY}` } });
            if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO]: ${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // INTENTO GOOGLE
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });
        const gData = await gRes.json();

        if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: gData.candidates[0].content.parts[0].text });
        }

        // SI GOOGLE FALLA, PROBAMOS GROK Y CAPTURAMOS SU ERROR REAL
        if (XAI_API_KEY) {
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({ model: "grok-2", messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }] })
            });
            const xData = await xRes.json();
            if (xData.choices?.[0]?.message?.content) {
                return res.json({ content: xData.choices[0].message.content });
            }
            // Si Grok también falla, exponemos su queja
            throw new Error(`Google: ${gData.error?.message || "Error 404"}. Grok: ${xData.error?.message || "Sin saldo o llave inválida"}`);
        }

        throw new Error(gData.error?.message || "Google no respondió y no hay llave de Grok configurada.");

    } catch (error) {
        res.status(500).json({ content: `[DETALLE]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v51.0 activo.`));
