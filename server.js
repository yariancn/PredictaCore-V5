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
    
    // Cambiamos a us-east4 que es el puerto de mayor disponibilidad
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-east4', 
        googleAuthOptions: { credentials: creds } 
    });

    // Usamos Gemini 1.5 Flash (Nombre base) para máxima compatibilidad
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash', 
        generationConfig: { temperature: 0.1 } 
    });
    
    console.log(`[TITÁN]: Operando en ${creds.project_id} (Región: us-east4)`);
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
        return res.json({ content: response.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Falla:", error.message);
        res.status(500).json({ content: `[BLOQUEO DE GOOGLE]: ${error.message}. Verifica que el proyecto esté vinculado a la cuenta de facturación en el panel de Billing.` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore Online`));
