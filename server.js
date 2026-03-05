const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CONFIGURACIÓN DE MOTOR ÚNICO (PredictaCore Standard)
// Usamos la versión v1 estable para eliminar errores de 'modelo no encontrado'
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const promptFinal = `${PERSONA}\n\nACTIVO BAJO ANÁLISIS: ${dna}\n\nFASE ESPECÍFICA: ${PROMPTS[etapaId](dna)}`;

    try {
        // Ejecución única y pura con Gemini
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();

        return res.json({ content: text });

    } catch (error) {
        // Log forense para el dueño en Railway
        console.error(`FALLO CRÍTICO EN ${etapaId}:`, error.message);
        
        // Respuesta de seguridad si la API de Google tiene un micro-corte
        res.status(500).json({ content: "Error de comunicación con el núcleo. Reintentando sección..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.4 (Motor Único) activo en puerto ${port}`);
});
