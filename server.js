const express = require('express');
const path = require('path');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para entender JSON (Vital para recibir el DNA)
app.use(express.json());

// RUTA 1: Servir la interfaz visual (visual.js)
app.get('/', (req, res) => {
    res.send(getHTML());
});

// RUTA 2: El Corazón de la Disección (v32.0)
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;

    if (!dna || !etapaId) {
        return res.status(400).json({ content: "Falta DNA o etapaId" });
    }

    try {
        // Construcción del Prompt con Aislamiento Total
        const promptFinal = `${PERSONA}\n\nACTIVO A ANALIZAR: ${dna}\n\nINSTRUCCIÓN DE ETAPA: ${PROMPTS[etapaId](dna)}`;

        // --- AQUÍ CONECTA CON TU IA (Ejemplo genérico, ajusta según tu modelo) ---
        // Si usas OpenAI: const completion = await openai.chat.completions.create({...})
        // Si usas Gemini: const result = await model.generateContent(promptFinal);
        
        // Simulación de respuesta para que el flujo no se detenga mientras configuras tu API Key
        // Reemplaza esto con tu llamada real a la IA
        const respuestaIA = await llamarALaIA(promptFinal); 

        res.json({ content: respuestaIA });

    } catch (error) {
        console.error(`Error en fase ${etapaId}:`, error);
        res.status(500).json({ content: "Error de procesamiento en esta fase. El motor sigue intentando..." });
    }
});

// Función placeholder para tu IA
async function llamarALaIA(prompt) {
    // Aquí es donde pegas tu lógica de OpenAI o Gemini
    // Por ahora, devolvemos un texto para validar que el sistema corre
    return "Analizando datos forenses..."; 
}

app.listen(port, () => {
    console.log(`PredictaCore Titán corriendo en puerto ${port}`);
});
