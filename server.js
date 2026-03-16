const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { captureAndScrape } = require('./motor');
const { getHTML } = require('./visual');

const app = express(); // Línea restaurada indispensable
app.use(express.json()); // Línea restaurada indispensable

let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-south1', googleAuthOptions: { credentials: creds } });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error de conexión Vertex:", e.message); }

// MEMORIA DINÁMICA DE LA AUDITORÍA
let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];

        const result = await captureAndScrape(dna);
        
        // Mantenemos el historial compacto para no saturar al modelo
        const resumenForense = auditoriaContexto[dna].slice(-3).join("\n"); 
        
        const promptFinal = PROMPTS[etapaId] ? PROMPTS[etapaId](result.texto, resumenForense) : null;

        if (!promptFinal) return res.status(400).json({ content: "Etapa inválida." });

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nRESUMEN FORENSE ACUMULADO:\n${resumenForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();

        // Guardamos el hallazgo clave para que la siguiente etapa tenga contexto
        auditoriaContexto[dna].push(`- Hallazgo en ${etapaId}: ${content.substring(0, 300)}...`);

        return res.json({ content });
    } catch (error) {
        console.error(`Falla en ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: Saturación de motor o tiempo de espera agotado.` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v2.2: Universal Forensic System Ready"));
