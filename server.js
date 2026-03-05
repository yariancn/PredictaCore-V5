const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la IA (Usa tu API Key de Google AI Studio)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;

    if (!dna || !etapaId) {
        return res.status(400).json({ content: "Error: Falta DNA o Identificador de Etapa." });
    }

    try {
        // Construcción del Prompt con el estándar PredictaCore
        const promptFinal = `${PERSONA}\n\nACTIVO BAJO ANÁLISIS: ${dna}\n\nFASE ESPECÍFICA: ${PROMPTS[etapaId](dna)}`;

        // Llamada Real a la IA
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();

        // Enviamos el Oro Molido de regreso al visual.js
        res.json({ content: text });

    } catch (error) {
        console.error(`Error Crítico en Fase ${etapaId}:`, error);
        res.status(500).json({ content: "Fallo de conexión con el núcleo de inteligencia. Reintentando fase..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v32.0 activo en puerto ${port}`);
});
