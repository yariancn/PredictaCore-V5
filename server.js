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
        model: 'gemini-1.5-pro', // CAMBIO A PRO PARA CALIDAD SENIOR
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error inicialización:", e.message); }

let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' no configurada.`);

        const result = await captureAndScrape(dna);
        const expedienteForense = auditoriaContexto[dna].join("\n\n"); // EXPEDIENTE COMPLETO
        const promptFinal = PROMPTS[etapaId](result.texto, expedienteForense);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nEXPEDIENTE ACUMULADO:\n${expedienteForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        let geminiRes = await model.generateContent(request);
        let response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();
        
        // ELIMINADO EL SUBSTRING(0, 500). AHORA RECUERDA TODO.
        auditoriaContexto[dna].push(`### SECCIÓN ${etapaId.toUpperCase()} ###\n${content}`);
        
        return res.json({ content });

    } catch (error) {
        console.error(`Error en etapa ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v33.0 Online"));
