const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CONFIGURACIÓN DE MOTOR RESILIENTE
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Lista de modelos disponibles en orden de prioridad para 2026
const MODELOS_DISPONIBLES = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-001"];

app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const promptFinal = `${PERSONA}\n\nACTIVO: ${dna}\n\nFASE: ${PROMPTS[etapaId](dna)}`;

    // Intentamos conectar con los modelos hasta que uno responda
    for (const modelName of MODELOS_DISPONIBLES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(promptFinal);
            const response = await result.response;
            const text = response.text();

            // Si llegamos aquí, el modelo funcionó. Enviamos la respuesta.
            return res.json({ content: text });
        } catch (error) {
            console.error(`INTENTO FALLIDO con ${modelName} en ${etapaId}:`, error.message);
            // Si es el último modelo y falló, enviamos el error final
            if (modelName === MODELOS_DISPONIBLES[MODELOS_DISPONIBLES.length - 1]) {
                return res.status(500).json({ content: "Error de comunicación con el núcleo. Reintentando..." });
            }
        }
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.5 (Resilience Mode) activo en puerto ${port}`);
});        res.status(500).json({ content: "Error de comunicación con el núcleo. Reintentando sección..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v33.4 (Motor Único) activo en puerto ${port}`);
});
