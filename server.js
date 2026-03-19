const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// CONFIGURACIÓN DE VERTEX AI (USANDO TUS CREDS DE GCP)
const project = process.env.GOOGLE_PROJECT_ID; 
const location = process.env.GOOGLE_LOCATION || 'us-central1';
const vertex_ai = new VertexAI({ project: project, location: location });

const model = vertex_ai.getGenerativeModel({
    model: 'gemini-2.5-pro',
});

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        let contextoForense = "";
        const esURL = dna.trim().includes('.') && !dna.includes(' ');
        
        if (esURL) {
            const dataWeb = await captureAndScrape(dna);
            contextoForense = dataWeb.texto;
        } else {
            contextoForense = dna;
        }

        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        const instruccionFinal = `
            ${PROTOCOLOS_IA}
            SENTENCIA PREDICTACORE (SOCIO SENIOR):
            Estándar: 'Organic Nails' / 'La Fortuna'.
            No expliques conceptos. Dicta sentencias financieras quirúrgicas.
            Fase: ${etapaId}
            DNA del activo: ${contextoForense}
        `;

        const result = await model.generateContent(instruccionFinal);
        const response = await result.response;
        const text = response.candidates[0].content.parts[0].text;

        res.json({ content: text });
    } catch (error) {
        res.status(500).json({ content: `### FALLA CRÍTICA EN VERTEX\nDetalle: ${error.message}` });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`PREDICTACORE TITÁN - VERTEX AI 2.5 PRO - ONLINE`));
