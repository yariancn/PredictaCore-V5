const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// 1. CONEXIÓN CON EL CEREBRO DE GOOGLE
let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({
        project: creds.project_id, 
        location: 'us-central1',
        googleAuthOptions: { credentials: creds }
    });

    model = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: { temperature: 0.1 }
    });
    console.log("[SISTEMA]: Motor Gemini 1.5 Pro Vinculado.");
} catch (error) {
    console.error("[ERROR]: Falla al cargar credenciales de Google:", error.message);
}

// 2. RUTA DE ANÁLISIS FORENSE
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;

    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: "Etapa inválida." });

        // EL TITÁN ACTIVA SUS OJOS (Captura de pantalla y Texto)
        const { screenshot, texto } = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](texto);

        // CONSTRUCCIÓN DEL PEDIDO MULTIMODAL
        const request = {
            contents: [{
                role: 'user',
                parts: [
                    { text: `${PERSONA}\n\nANÁLISIS DE: ${dna}\n\n${promptFinal}` },
                    { inlineData: { mimeType: 'image/png', data: screenshot } }
                ]
            }]
        };

        const result = await model.generateContent(request);
        const response = await result.response;
        let content = response.candidates[0].content.parts[0].text;

        // Limpieza de preámbulos de IA
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido|Analizando el sitio).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Falla en la disección:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));

app.listen(port, () => {
    console.log(`PredictaCore v153.0 Sovereignty Online en puerto ${port}`);
});
