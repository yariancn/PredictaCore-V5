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
        location: 'us-south1', 
        googleAuthOptions: { credentials: creds } 
    });

    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 } 
    });
    console.log(`[SISTEMA]: Motor Titán 2.5 Flash conectado.`);
} catch (e) {
    console.error("[ERROR]:", e.message);
}

app.post('/diseccion', async (req, res) => {
    // Normalizamos la etapa para que no haya errores de dedo
    const dna = req.body.dna;
    const etapaIdRaw = req.body.etapaId || "";
    const etapaId = etapaIdRaw.trim().toLowerCase();

    console.log(`[RECIBIDO]: Analizando etapa: "${etapaId}" para el DNA: ${dna}`);

    try {
        if (!PROMPTS[etapaId]) {
            console.error(`[FALLA]: La etapa "${etapaId}" no existe en cerebro.js`);
            return res.json({ content: `Etapa inválida: ${etapaId}. Revisa la vinculación.` });
        }

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
        return res.json({ content: response.candidates[0].content.parts[0].text.trim() });

    } catch (error) {
        console.error(`[ERROR]: Falla en ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v173.0 Sovereignty Online`));
