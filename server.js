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
        project: creds.project_id, 
        location: 'us-central1', // Volvemos a central1, es la base de Gemini 3
        googleAuthOptions: { credentials: creds } 
    });

    // ACTUALIZACIÓN 2026: Usamos la serie Gemini 3.1
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-3.1-flash', 
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    
    console.log(`[SISTEMA]: Titán G3 conectado a ${creds.project_id}`);
} catch (e) {
    console.error("[ERROR]:", e.message);
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
        
        if (!response.candidates) throw new Error("Sin respuesta del modelo G3.");

        return res.json({ content: response.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Falla:", error.message);
        res.status(500).json({ content: `[FALLA G3]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v162.0 (G3 Edition) Ready`));
