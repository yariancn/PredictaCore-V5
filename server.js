const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ 
        project: creds.project_id, // Usamos el ID del JSON automáticamente
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    // Usamos el nombre genérico para evitar el 404
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro', 
        generationConfig: { temperature: 0.1 } 
    });
    console.log("[SISTEMA]: Motor Titán listo para la acción.");
} catch (e) {
    console.error("Error en configuración inicial:", e.message);
}

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\n${promptFinal}` }]
            }]
        };

        // Si hay captura de pantalla, se la pasamos a Gemini
        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        let content = response.candidates[0].content.parts[0].text;

        return res.json({ content: content.trim() });
    } catch (error) {
        console.error("Falla detectada:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore Online en puerto ${port}`));
