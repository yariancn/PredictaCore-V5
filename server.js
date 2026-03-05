const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY } = process.env;

    if (!API_KEY) return res.status(500).json({ content: "Error: API_KEY no configurada." });

    // 10 PASOS ADELANTE: Lógica de Motor Dinámico
    // Intentamos Gemini 3 Flash (2026) -> Gemini 2.0 -> Gemini 1.5
    const MODELOS = ["gemini-3-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let textOutput = "";

    for (const model of MODELOS) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `${PERSONA}\n\nACTIVO: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}` }] }] })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                textOutput = data.candidates[0].content.parts[0].text;
                break; // Éxito, salimos del bucle
            }
        } catch (e) {
            console.error(`Fallo con ${model}, probando siguiente...`);
        }
    }

    if (!textOutput) {
        return res.status(500).json({ content: "Error: Los núcleos de IA no responden. Reintenta en 5 segundos." });
    }

    res.json({ content: textOutput });
});

app.listen(port, () => {
    console.log(`PredictaCore v34.0 [NEXT-GEN] activo en puerto ${port}`);
});
