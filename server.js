const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// CONFIGURACIÓN DINÁMICA DE GOOGLE
let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    
    // El sistema lee el ID directamente de tu llave para evitar errores de dedo
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    // Usamos el nombre técnico completo de Vertex AI
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-002', 
        generationConfig: { temperature: 0.1 } 
    });
    
    console.log(`[SISTEMA]: Conectado a Proyecto: ${creds.project_id}`);
    console.log("[SISTEMA]: Motor Titán v.002 listo.");
} catch (e) {
    console.error("[ERROR]: Falla en configuración:", e.message);
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
        console.error("Falla en Auditoría:", error.message);
        // Si sigue dando 404, este mensaje nos dirá exactamente por qué
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v159.0 Online`));
