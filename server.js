const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// 1. CONFIGURACIÓN VERTEX AI (GCP)
const project = process.env.GOOGLE_PROJECT_ID; 
const location = process.env.GOOGLE_LOCATION || 'us-central1';

const vertex_ai = new VertexAI({ project: project, location: location });

// Invocar al modelo quirúrgico definido por el proyecto
const model = vertex_ai.getGenerativeModel({
    model: 'gemini-2.5-pro',
});

// 2. RUTAS DE AUTORIDAD
app.get('/', (req, res) => {
    res.send(getHTML());
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        let contextoForense = "";
        const esURL = dna.trim().includes('.') && !dna.includes(' ');
        
        if (esURL) {
            console.log(`[MOTOR]: Disección web activa en ${dna}`);
            const dataWeb = await captureAndScrape(dna);
            contextoForense = dataWeb.texto;
        } else {
            console.log(`[CEREBRO]: Disección de Idea o Red Social`);
            contextoForense = dna;
        }

        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        const instruccionFinal = `
            ${PROTOCOLOS_IA}
            SENTENCIA DE SOCIO SENIOR:
            Analista forense de PredictaCore. 
            Estándar de calidad: 'Organic Nails' / 'La Fortuna'.
            Dicta sentencias financieras, no expliques conceptos.
            Uso estricto de lógica de capital.
            
            FASE: ${etapaId}
            DOSSIER: ${contextoForense}
        `;

        const result = await model.generateContent(instruccionFinal);
        const response = await result.response;
        const text = response.candidates[0].content.parts[0].text;

        res.json({ content: text });
    } catch (error) {
        console.error(`[FALLA CRÍTICA]: ${error.message}`);
        res.status(500).json({ content: `### ERROR DE INFRAESTRUCTURA\nFalla en el Nodo Vertex 2.5 Pro.\nDetalle: ${error.message}` });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`PREDICTACORE TITÁN - ESTATUS: ONLINE (VERTEX AI 2.5 PRO)`);
});
