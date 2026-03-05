const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const promptFinal = `${PERSONA}\n\nACTIVO: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        res.json({ content: response.text() });
    } catch (error) {
        console.error("Error en etapa " + etapaId + ":", error);
        res.status(500).json({ content: "Error en esta fase. El sistema continúa con la siguiente..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v32.0 activo en puerto ${port}`);
});
