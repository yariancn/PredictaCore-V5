const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// CONFIGURACIÓN DE NÚCLEO PREDICTACORE
let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    // USANDO EL ID CONFIRMADO POR TI
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', 
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    
    console.log(`[SISTEMA]: Motor Titán 2.5 Flash conectado en ${creds.project_id}`);
} catch (e) {
    console.error("[ERROR CRÍTICO]:", e.message);
}

// RUTA DE AUDITORÍA
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: "Etapa inválida." });

        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\n${promptFinal}` }]
            }]
        };

        // Inyección de Visión Forense
        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        
        if (!response.candidates) throw new Error("Google Vertex no generó respuesta.");

        let content = response.candidates[0].content.parts[0].text;
        
        // Limpiamos ruidos de la IA
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Falla en el proceso:", error.message);
        res.status(500).json({ content: `[FALLA TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v165.0 Sovereignty Online`));
