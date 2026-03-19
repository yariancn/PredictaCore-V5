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
let cacheScraping = {}; // CACHÉ PARA EVITAR SCRAPING REPETITIVO

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        // Inicializamos contexto si es la intro
        if (etapaId === 'intro' || !auditoriaContexto[dna]) {
            auditoriaContexto[dna] = [];
            console.log(`[LOG]: Iniciando escaneo maestro para ${dna}...`);
            // Escaneamos UNA SOLA VEZ y guardamos en caché
            cacheScraping[dna] = await captureAndScrape(dna);
        }

        const result = cacheScraping[dna];
        const expedienteForense = auditoriaContexto[dna].join("\n\n");
        const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        
        const promptFinal = PROMPTS[etapaId](result.texto, expedienteForense, today);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nORDEN ESTRICTA: VE DIRECTO AL GRANO. PROHIBIDO REPETIR TU IDENTIDAD O LAS REGLAS EN TU RESPUESTA.\n\nEXPEDIENTE MAESTRO:\n${expedienteForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        // Solo enviamos la imagen en la intro para no saturar el contexto en cada paso
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
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v56.0 - High Performance Engine"));
