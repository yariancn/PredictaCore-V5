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
        return res.status(500).json({ content: "Error: Configura la API_KEY en Railway." });
    }

    const promptFinal = `${PERSONA}\n\nACTIVO BAJO ANÁLISIS: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;

    try {
        // Probamos con el endpoint v1beta y el modelo flash estándar
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        const data = await response.json();

        // Si el modelo Flash falla por nombre, intentamos con Gemini Pro como respaldo instantáneo
        if (data.error && data.error.code === 404) {
            console.log(`Flash no encontrado en v1beta, intentando con Gemini Pro...`);
            const fallback = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${api_key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptFinal }] }]
                })
            });
            const fallbackData = await fallback.json();
            
            if (fallbackData.error) throw new Error(fallbackData.error.message);
            
            return res.json({ content: fallbackData.candidates[0].content.parts[0].text });
        }

        if (data.error) {
            throw new Error(data.error.message);
        }

        res.json({ content: data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error(`FALLO EN ${etapaId}:`, error.message);
        res.status(500).json({ content: "Error de conexión con el núcleo. Reintentando..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.8 [ULTRA-RESILIENT] activo en puerto ${port}`);
});
