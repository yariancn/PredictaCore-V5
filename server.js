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
    const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-south1', googleAuthOptions: { credentials: creds } });
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 } 
    });
} catch (e) { console.error("Error inicialización:", e.message); }

let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' no configurada.`);

        const result = await captureAndScrape(dna);
        const expedienteForense = auditoriaContexto[dna].join("\n");
        const promptFinal = PROMPTS[etapaId](result.texto, expedienteForense);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nEXPEDIENTE ACUMULADO:\n${expedienteForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        // --- SISTEMA DE REINTENTO PARA ERROR 429 ---
        let response;
        let intentos = 0;
        while (intentos < 3) {
            try {
                const geminiRes = await model.generateContent(request);
                response = await geminiRes.response;
                break; 
            } catch (e) {
                if (e.message.includes('429') || e.message.includes('Resource exhausted')) {
                    intentos++;
                    console.log(`Saturación (429). Reintento ${intentos}/3 en 5s...`);
                    await new Promise(r => setTimeout(r, 5000));
                } else { throw e; }
            }
        }

        if (!response) throw new Error("Google Cloud saturado tras 3 intentos.");
        const content = response.candidates[0].content.parts[0].text.trim();
        
        auditoriaContexto[dna].push(`- [${etapaId.toUpperCase()}]: ${content.substring(0, 500)}`);
        return res.json({ content });

    } catch (error) {
        console.error(`Error en etapa ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 8080, () => console.log("PredictaCore v32.0.0 Online"));
