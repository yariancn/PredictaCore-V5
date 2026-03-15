const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// CONFIGURACIÓN DE IDENTIDAD GOOGLE
let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ 
        project: 'predictacore', // Tu ID confirmado
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-002', // Versión exacta para evitar error 404
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    console.log("[SISTEMA]: Motor Gemini 1.5 Pro-002 conectado con éxito.");
} catch (e) {
    console.error("[ERROR]: Falla crítica en credenciales:", e.message);
}

// RUTA PRINCIPAL DE DISECCIÓN
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: "Etapa inválida." });

        // EL TITÁN ACTIVA SUS OJOS
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        // PREPARAMOS EL PEDIDO MULTIMODAL (Visión + ADN)
        const request = {
            contents: [{
                role: 'user',
                parts: [
                    { text: `${PERSONA}\n\nMODO: ${result.isUrl ? 'AUDITORÍA WEB' : 'AUDITORÍA DE CONCEPTO'}\n\nINPUT: ${dna}\n\n${promptFinal}` }
                ]
            }]
        };

        // Si tenemos imagen, se la inyectamos a Gemini para el análisis visual
        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        let content = response.candidates[0].content.parts[0].text;

        // Limpiamos preámbulos innecesarios de la IA
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido|Analizando el sitio).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Falla en el proceso Titán:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));

app.listen(port, () => {
    console.log(`PredictaCore v157.0 Universal Sovereignty Online en puerto ${port}`);
});
