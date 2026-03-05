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
        // 1. ESCÁNER FORENSE (JINA AI)
        let hechosReales = "Data no disponible. Aplicar lógica forense PredictaCore.";
        if (JINA_API_KEY) {
            try {
                const jinaFetch = await fetch(`https://r.jina.ai/${dna}`, {
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jinaFetch.ok) hechosReales = (await jinaFetch.text()).substring(0, 4500);
            } catch (e) { console.log("Fallo en escáner Jina."); }
        }

        const promptFinal = `${PERSONA}
        [EVIDENCIA]: ${hechosReales}
        [ACTIVO]: ${dna}
        [FASE]: ${PROMPTS[etapaId](dna)}
        REGLA: 3 a 5 líneas de alto valor estratégico.`;

        // 2. MOTOR DE INTELIGENCIA (GOOGLE)
        const modelos = [
            { v: "v1beta", m: "gemini-1.5-flash" },
            { v: "v1", m: "gemini-1.5-flash" },
            { v: "v1beta", m: "gemini-pro" }
        ];

        for (const i of modelos) {
            try {
                const googleFetch = await fetch(`https://generativelanguage.googleapis.com/${i.v}/models/${i.m}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });

                const data = await googleFetch.json();
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    // AQUÍ ESTABA EL ERROR: Usamos 'res' (Express) para responderte a ti
                    return res.json({ content: data.candidates[0].content.parts[0].text });
                }
            } catch (e) { continue; }
        }

        // 3. RESPALDO DE SEGURIDAD (XAI)
        if (XAI_API_KEY) {
            const xaiFetch = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const dataXai = await xaiFetch.json();
            if (dataXai.choices?.[0]?.message?.content) {
                return res.json({ content: dataXai.choices[0].message.content });
            }
        }

        throw new Error("Sin respuesta de núcleos IA.");

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ content: `[FALLO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v43.0 rugiendo en puerto ${port}`));
