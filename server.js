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
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-central1', googleAuthOptions: { credentials: creds } });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-pro', 
        generationConfig: { temperature: 0.5, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error inicialización:", e.message); }

let auditoriaContexto = {};
let masterDossier = {}; // El expediente compartido
let lockEscaneo = {}; // El semáforo

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        // PROCESO SIMBIÓTICO: Solo un escaneo para alimentar a todos
        if (!masterDossier[dna]) {
            if (!lockEscaneo[dna]) {
                lockEscaneo[dna] = captureAndScrape(dna);
            }
            masterDossier[dna] = await lockEscaneo[dna];
            delete lockEscaneo[dna];
        }

        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];

        const result = masterDossier[dna];
        const historial = auditoriaContexto[dna].join("\n\n");
        const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        
        // Enviamos el Dossier de Entrañas al Cerebro
        const promptFinal = PROMPTS[etapaId](result.texto, historial, today);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nDOSSIER COMPARTIDO POR LOS 9000 SIMBIÓTICOS:\n${result.texto}\n\nEXPEDIENTE MAESTRO ACUMULADO:\n${historial}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot && etapaId === 'intro') {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();
        
        auditoriaContexto[dna].push(`### RESULTADO ${etapaId.toUpperCase()} ###\n${content}`);
        return res.json({ content });

    } catch (error) {
        console.error(`Error en etapa ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR CRÍTICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v58.0 - Centralized Symbiotic Intelligence"));
