const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

// DIAGNÓSTICO INICIAL: Esto aparecerá en tus logs de Railway
if (!process.env.API_KEY) {
    console.error("ALERTA: La variable API_KEY está VACÍA. Revisa las variables en Railway.");
} else {
    console.log("SISTEMA: API_KEY detectada correctamente.");
}

// Configuración de la IA
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
// Usamos el nombre base del modelo para evitar errores de versión beta
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const promptFinal = `${PERSONA}\n\nACTIVO: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;
        
        // Llamada con manejo de error específico
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();

        res.json({ content: text });
    } catch (error) {
        // Esto te dirá exactamente qué dice Google si falla
        console.error("ERROR DE IA en " + etapaId + ":", error.message);
        res.status(500).json({ content: "Error de comunicación con el cerebro. El sistema intentará recuperar la siguiente fase." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.1 activo en puerto ${port}`);
});
