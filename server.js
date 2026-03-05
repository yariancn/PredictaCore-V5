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

    // 1. INVESTIGACIÓN DE HECHOS (JINA AI) - Los datos no mienten
    let hechos = "Investigando activos...";
    try {
        const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
            headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        if (jinaRes.ok) hechos = (await jinaRes.text()).substring(0, 4500);
    } catch (e) { console.error("Fallo Jina:", e.message); }

    const promptFinal = `${PERSONA}
    
    [CONTEXTO FORENSE]:
    ${hechos}

    [ACTIVO]: ${dna}
    [FASE]: ${PROMPTS[etapaId](dna)}
    
    REGLA: Máximo 5 líneas, tono clínico, asertividad absoluta.`;

    // 2. ORQUESTACIÓN DE MOTOR (Prioridad: Gemini Estable)
    // Probamos con los nombres de modelos confirmados para 2026
    const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
    ];

    for (const url of endpoints) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
            });
            const data = await res.json();
            if (data.candidates && data.candidates[0].content) {
                return res.json({ content: data.candidates[0].content.parts[0].text });
            }
        } catch (e) { console.error("Error en endpoint:", e.message); }
    }

    // 3. FALLBACK DE EMERGENCIA (Misma Personalidad)
    if (XAI_API_KEY) {
        try {
            const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xaiData = await xaiRes.json();
            return res.json({ content: xaiData.choices[0].message.content });
        } catch (e) { console.error("Fallo Respaldo:", e.message); }
    }

    res.status(500).json({ content: "Error de sincronización con el núcleo técnico." });
});

app.listen(port, () => console.log(`PredictaCore v39.0 [SINGLE-IDENTITY] activo.`));
