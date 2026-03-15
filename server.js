const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    
    // MOVIMIENTO MAESTRO: Usamos la región de Dallas (us-south1)
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-south1', 
        googleAuthOptions: { credentials: creds } 
    });

    // MODELO DE ÉLITE 2026: Gemini 2.5 Flash (Estable)
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    
    console.log(`[TITÁN]: Conectado a ${creds.project_id} en Dallas (us-south1)`);
    console.log("[TITÁN]: Motor 2.5 Flash activado y listo.");
} catch (e) {
    console.error("[ERROR]:", e.message);
}

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        return res.json({ content: response.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Falla:", error.message);
        res.status(500).json({ content: `[ERROR DE INFRAESTRUCTURA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore Online - Dallas Engine`));    try {
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        
        if (!response.candidates) throw new Error("Sin respuesta del modelo G3.");

        return res.json({ content: response.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Falla:", error.message);
        res.status(500).json({ content: `[FALLA G3]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v162.0 (G3 Edition) Ready`));
