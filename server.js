const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROTOCOLOS_IA } = require('./protocolos');
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
        // AQUÍ UNIMOS EL ALMA Y LA LUPA
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS + "\n" + PROTOCOLOS_IA }] }
    });
};
initModel();

let cacheDossier = {};

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        if (!cacheDossier[dna]) {
            cacheDossier[dna] = await captureAndScrape(dna);
        }
        
        const dossier = cacheDossier[dna];
        const prompt = PROMPTS[etapaId.toLowerCase()](dossier.texto);

        const request = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        };

        if (dossier.screenshot && etapaId.toLowerCase() === 'intro') {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: dossier.screenshot } });
        }

        const result = await model.generateContent(request);
        res.json({ content: result.response.candidates[0].content.parts[0].text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 8080);
