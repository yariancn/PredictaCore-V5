const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

// Inicialización con Reintento Automático
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Probamos la versión estable más reciente
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    // Verificación de Seguridad
    if (!process.env.API_KEY) {
        return res.status(500).json({ content: "ERROR: No hay API_KEY configurada en Railway." });
    }

    try {
        const promptFinal = `${PERSONA}\n\nACTIVO: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;
        
        // Ejecución de la IA
        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const text = response.text();

        res.json({ content: text });
    } catch (error) {
        console.error(`FALLO EN ${etapaId}:`, error.message);
        
        // Si falla el modelo Flash, PredictaCore no se detiene.
        res.status(500).json({ content: "Fase en mantenimiento técnico. Saltando al siguiente bloque de valor..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.2 rugiendo en el puerto ${port}`);
});
