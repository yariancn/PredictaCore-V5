const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { captureAndScrape } = require('./motor');
const { getHTML } = require('./visual');

const app = express();
app.use(express.json());

let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-south1', googleAuthOptions: { credentials: creds } });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error de conexión:", e.message); }

let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase(); // Normalización
    
    try {
        // Reiniciamos memoria si es una nueva auditoría
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];

        if (typeof PROMPTS[etapaId] !== 'function') {
            console.error(`Etapa no encontrada: ${etapaId}`);
            return res.status(400).json({ content: `[ERROR]: La etapa "${etapaId}" no está configurada.` });
        }

        const result = await captureAndScrape(dna);
        const historialPrevio = auditoriaContexto[dna].join("\n\n");
        
        const promptFinal = PROMPTS[etapaId](result.texto, historialPrevio);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nCONTEXTO ACUMULADO:\n${historialPrevio}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();

        // Alimentamos la hebra de memoria
        auditoriaContexto[dna].push(`[LOGRO ${etapaId.toUpperCase()}]: ${content}`);

        return res.json({ content });
    } catch (error) {
        console.error("Falla en etapa:", etapaId, error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v2.1: Contextual Intelligence Ready"));
