const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CONFIGURACIÓN DE MOTOR ÚNICO
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Usamos el alias 'latest' para asegurar que encuentre la versión activa en 2026
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    if (!dna || !etapaId) {
        return res.status(400).json({ content: "Error: Faltan parámetros." });
    }

    const promptFinal = `${PERSONA}\n\nACTIVO BAJO ANÁLISIS: ${dna}\n\nFASE ESPECÍFICA: ${PROMPTS[etapaId](dna)}`;

    try {
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();
        res.json({ content: text });
    } catch (error) {
        console.error("FALLO CRÍTICO EN " + etapaId + ":", error.message);
        res.status(500).json({ content: "Error de comunicación con el núcleo técnico. El sistema continúa..." });
    }
});

app.listen(port, () => {
    console.log("PredictaCore Titán v33.6 activo en puerto " + port);
});
