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

    // Lista de modelos actualizada a estándares de 2026
    const MODELOS = ["gemini-3-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    for (const modelName of MODELOS) {
        try {
            // Intentamos por la vía estable v1 primero
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${api_key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptFinal }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.log(`Modelo ${modelName} no respondió bien, intentando siguiente...`);
                continue; // Salta al siguiente modelo si hay error
            }

            // Si llegamos aquí, tenemos ORO MOLIDO
            const textOutput = data.candidates[0].content.parts[0].text;
            return res.json({ content: textOutput });

        } catch (err) {
            console.error(`Error con ${modelName}:`, err.message);
        }
    }

    // Si después de recorrer todos los modelos nada funciona:
    res.status(500).json({ content: "Error de sincronización con el núcleo. Reintentando..." });
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.9 [Sincronización 2026] activo en puerto ${port}`);
});
