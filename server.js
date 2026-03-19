const express = require('express');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// RUTA 1: Entrega el panel de control (Visual)
app.get('/', (req, res) => {
    res.send(getHTML());
});

// RUTA 2: Ejecuta la disección por etapas
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    try {
        // 1. El Motor extrae el DNA del activo
        const dataActivo = await captureAndScrape(dna);
        
        // 2. Aquí es donde Gemini (o tu IA) procesaría el prompt
        // Para esta versión, simulamos la respuesta basada en el prompt del Cerebro
        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        const instruccionForense = promptTemplate(dataActivo.texto);

        // NOTA: Aquí deberías llamar a Vertex AI o Gemini API 
        // Por ahora, devolvemos un mensaje de éxito para confirmar que el puente funciona
        res.json({ 
            content: `[AUDITORÍA EN CURSO]\n\nSe ha recibido el DNA de: ${dna}\nProtocolo aplicado: ${etapaId}\n\n*Simulación de análisis PredictaCore basada en ${dataActivo.texto.substring(0, 100)}...*` 
        });

    } catch (error) {
        res.status(500).json({ content: "ERROR DE DISECCIÓN: El activo bloqueó el acceso." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PREDICTACORE TITÁN V32.0 OPERATIVO EN PUERTO ${PORT}`);
});
