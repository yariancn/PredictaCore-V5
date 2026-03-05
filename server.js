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
        // 1. ESCÁNER JINA (HECHOS)
        let hechos = "DNA base.";
        if (JINA_API_KEY) {
            const jRes = await fetch(`https://r.jina.ai/${dna}`, { headers: { "Authorization": `Bearer ${JINA_API_KEY}` } });
            if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
        }

        const promptFinal = `${PERSONA}\n\n[HECHOS]: ${hechos}\n\n[ADN]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. DIAGNÓSTICO GOOGLE
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });

        const gData = await gRes.json();

        // SI GOOGLE RESPONDE ÉXITO
        if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: gData.candidates[0].content.parts[0].text });
        }

        // SI GOOGLE RESPONDE ERROR (LO CAPTURAMOS TODO)
        console.error(`--- RECHAZO DE GOOGLE EN ${etapaId} ---`);
        console.error(JSON.stringify(gData, null, 2));

        // 3. INTENTO GROK (SI GOOGLE FALLA)
        if (XAI_API_KEY) {
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xData = await xRes.json();
            
            if (xData.choices?.[0]?.message?.content) {
                return res.json({ content: xData.choices[0].message.content });
            }
            console.error(`--- RECHAZO DE XAI EN ${etapaId} ---`);
            console.error(JSON.stringify(xData, null, 2));
        }

        throw new Error("Ambos núcleos rechazaron la petición. Revisa los logs de Railway.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v44.0 [DIAGNOSTIC] activo.`));
