const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROMPTS } = require('./cerebro');
const { captureAndScrape } = require('./motor');

const app = express();
app.use(express.json());

let model;
const initModel = () => {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-central1' });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-pro',
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] }
    });
};
initModel();

let cacheDossier = {}; // Aquí guardamos el barrido profundo
let lockEscaneo = {}; // Para que no escanee 11 veces a la vez

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        // --- BARRIDO ÚNICO SIMBIÓTICO ---
        if (!cacheDossier[dna]) {
            if (!lockEscaneo[dna]) {
                console.log(`[BARRIDO PROFUNDO]: Entrando a las entrañas de ${dna}...`);
                lockEscaneo[dna] = captureAndScrape(dna);
            }
            cacheDossier[dna] = await lockEscaneo[dna];
            delete lockEscaneo[dna];
        }

        const dossier = cacheDossier[dna];
        const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        
        // Verificamos que la etapa exista en cerebro.js
        if (!PROMPTS[etapaId]) {
            throw new Error(`La etapa ${etapaId} no está definida en el cerebro.`);
        }

        const promptFinal = PROMPTS[etapaId](dossier.texto, "", today);

        const request = {
            contents: [{ role: 'user', parts: [{ text: promptFinal }] }]
        };

        // Solo mandamos la imagen en la intro para ahorrar memoria
        if (dossier.screenshot && etapaId === 'intro') {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: dossier.screenshot } });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();
        
        return res.json({ content });

    } catch (error) {
        console.error(`Error en etapa ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v67.0 - Symbiotic Engine Active"));
