const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const api_key = process.env.API_KEY;

    if (!api_key) {
        return res.status(500).json({ content: "Error: No se detectó la API_KEY en Railway." });
    }

    const promptFinal = `${PERSONA}\n\nACTIVO BAJO ANÁLISIS: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;

    try {
        // Llamada DIRECTA a la API de Google (Saltando el SDK problemático)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${api_key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Extraemos el texto del Oro Molido
        const textOutput = data.candidates[0].content.parts[0].text;
        res.json({ content: textOutput });

    } catch (error) {
        console.error(`FALLO FORENSE EN ${etapaId}:`, error.message);
        res.status(500).json({ content: "Error de comunicación con el núcleo técnico. El sistema continúa..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.7 [DIRECT-CORE] activo en puerto ${port}`);
});
