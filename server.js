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
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });
    
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro', // Alias estable para evitar errores 404
        generationConfig: { temperature: 0.5, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error inicialización:", e.message); }

let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];
        
        // Ejecutamos el motor con capacidad de 50,000 caracteres
        const result = await captureAndScrape(dna);
        const expedienteForense = auditoriaContexto[dna].join("\n\n");
        const today = new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
        
        const promptFinal = PROMPTS[etapaId](result.texto, expedienteForense, today);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nEXPEDIENTE MAESTRO:\n${expedienteForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
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
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v40.2 Online - Full Vision Mode"));
