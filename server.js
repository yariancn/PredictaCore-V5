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
        // Redirección de seguridad para el punto 11
        const idFinal = (etapaId === 'AUTORIDAD' || etapaId === 'ROADMAP') ? 'OMNI' : etapaId;

        if (!PROMPTS[idFinal]) {
            throw new Error(`La etapa [${etapaId}] no está configurada en cerebro.js`);
        }

        let hechos = "DNA base: " + dna;
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 4000);
            } catch (e) { console.log("Jina no disponible."); }
        }

        const promptFinal = `${PERSONA}\n\n[INFO]: ${hechos}\n\n[TAREA]: ${PROMPTS[idFinal](dna)}`;

        // CONEXIÓN LIMPIA A GOOGLE
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });
        
        const gData = await gRes.json();

        if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: gData.candidates[0].content.parts[0].text });
        }

        // RESPALDO XAI (GROK) - Solo si Google falla y tienes saldo
        if (XAI_API_KEY) {
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-2",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xData = await xRes.json();
            if (xData.choices?.[0]?.message?.content) return res.json({ content: xData.choices[0].message.content });
        }

        throw new Error("La IA no respondió. Revisa la cuota de tu API Key.");

    } catch (error) {
        console.error("LOG:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v74.0 [ESTABLE] activo.`));
