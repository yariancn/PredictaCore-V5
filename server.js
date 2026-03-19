const express = require('express');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROTOCOLOS_IA } = require('./protocolos');
const { PROMPTS } = require('./cerebro');
const { captureAndScrape } = require('./motor');

const app = express();
app.use(express.json());

// --- ¡ESTO ARREGLA EL 404! ---
// Sirve tus archivos HTML, CSS y JS desde la carpeta donde estén
app.use(express.static(__dirname)); 

let model;
const initModel = () => {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-central1' });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash', // O el modelo que estés usando
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS + "\n" + PROTOCOLOS_IA }] }
    });
};
initModel();

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        // Obtenemos los datos del sitio
        const dossier = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId.toLowerCase()](dossier.texto);

        const request = {
            contents: [{ role: 'user', parts: [{ text: promptFinal }] }]
        };

        // Si es la intro, le pasamos la "vista" del sitio
        if (dossier.screenshot && etapaId.toLowerCase() === 'intro') {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: dossier.screenshot } });
        }

        const result = await model.generateContent(request);
        res.json({ content: result.response.candidates[0].content.parts[0].text });
    } catch (e) {
        console.error("Error:", e.message);
        res.status(500).json({ content: "[ERROR TITÁN]: Fallo en la disección." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`--- PREDICTACORE TITÁN v70.0 ---`);
    console.log(`ESTADO: ONLINE en puerto ${PORT}`);
});
