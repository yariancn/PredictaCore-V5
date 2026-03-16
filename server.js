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
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192, topP: 0.95 } 
    });
} catch (e) { console.error("Error de conexión:", e.message); }

// MEMORIA VIVA: Objeto para almacenar los hallazgos de cada etapa durante la sesión
let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    try {
        if (!auditoriaContexto[dna]) auditoriaContexto[dna] = [];

        const result = await captureAndScrape(dna);
        
        // Construimos el historial para que Gemini no sufra amnesia
        const historialPrevio = auditoriaContexto[dna].join("\n\n");
        const promptFinal = PROMPTS[etapaId](result.texto, historialPrevio);

        const request = {
            contents: [{
                role: 'user',
                parts: [
                    { text: `${PERSONA}\n\nREPORTE ACUMULADO HASTA EL MOMENTO:\n${historialPrevio}\n\nINSTRUCCIÓN DE ETAPA ACTUAL:\n${promptFinal}` }
                ]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();

        // GUARDAMOS EN MEMORIA PARA LA SIGUIENTE ETAPA
        auditoriaContexto[dna].push(`[${etapaId.toUpperCase()}]: ${content}`);

        return res.json({ content });
    } catch (error) {
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v2.0: Sovereignty Intelligence Online"));
