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
        // 1. OBTENCIÓN DE HECHOS (JINA AI) - Esencial para que no haya suposiciones
        let hechos = "Sin data externa. Análisis basado en ADN.";
        if (JINA_API_KEY) {
            try {
                const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jinaRes.ok) hechos = (await jinaRes.text()).substring(0, 3500);
            } catch (e) { console.log("Jina no disponible."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechos}\n\n[ADN]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. ORQUESTACIÓN DE INTELIGENCIA (Bucle de Supervivencia)
        // Probamos todas las rutas posibles de Google para 2026
        const intentosGoogle = [
            { ver: "v1", mod: "gemini-1.5-flash" },
            { ver: "v1beta", mod: "gemini-1.5-flash-latest" },
            { ver: "v1", mod: "gemini-pro" }
        ];

        for (const i of intentosGoogle) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/${i.ver}/models/${i.mod}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                const data = await res.json();
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return res.json({ content: data.candidates[0].content.parts[0].text });
                }
            } catch (e) { continue; }
        }

        // 3. SALVAGUARDA TOTAL: GROK (xAI)
        // Si Google parpadea, Grok ejecuta la orden sin preguntar.
        if (XAI_API_KEY) {
            const resXai = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const dataXai = await resXai.json();
            if (dataXai.choices?.[0]?.message?.content) {
                return res.json({ content: dataXai.choices[0].message.content });
            }
        }

        throw new Error("Ningún núcleo de IA respondió. Revisa cuotas.");

    } catch (error) {
        res.status(500).json({ content: `[CRÍTICO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v41.0 [THE EXECUTIONER] activo.`));
