const express = require('express');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROTOCOLOS_IA } = require('./protocolos');
const { PROMPTS } = require('./cerebro');
const { captureAndScrape } = require('./motor');

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- CORRECCIÓN CRÍTICA DE RUTA ---
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let model;
const initModel = () => {
    try {
        const creds = JSON.parse(process.env.GOOGLE_CREDS);
        const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-central1' });
        model = vertexAI.getGenerativeModel({ 
            model: 'gemini-1.5-pro', // Asegúrate de usar el modelo que tienes contratado
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS + "\n" + PROTOCOLOS_IA }] }
        });
        console.log("--- MODELO CONECTADO: BRAZO PREDICTACORE ACTIVO ---");
    } catch (e) {
        console.error("Error inicializando modelo:", e.message);
    }
};
initModel();

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const dossier = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId.toLowerCase()](dossier.texto);

        const request = {
            contents: [{ role: 'user', parts: [{ text: promptFinal }] }]
        };

        if (dossier.screenshot && etapaId.toLowerCase() === 'intro') {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: dossier.screenshot } });
        }

        const result = await model.generateContent(request);
        res.json({ content: result.response.candidates[0].content.parts[0].text });
    } catch (e) {
        console.error(`Error en etapa ${etapaId}:`, e.message);
        res.status(500).json({ content: "[ERROR TITÁN]: Fallo en la comunicación forense." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`--- PREDICTACORE ONLINE | PUERTO ${PORT} ---`);
});
