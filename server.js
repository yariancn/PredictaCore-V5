const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// CONFIGURACIÓN DE GOOGLE CLOUD
let model;
try {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    // MODELO ESTABLE 2026: Usamos el ID completo para evitar el 404
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash-001', 
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    
    console.log(`[SISTEMA]: Motor Titán vinculado a ${creds.project_id}`);
} catch (e) {
    console.error("[ERROR]: Falla en configuración:", e.message);
}

// RUTA DE DISECCIÓN (Importante: 'async' está presente aquí)
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: "Etapa inválida." });

        // Activamos la visión forense
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        // Pedido Multimodal
        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\n${promptFinal}` }]
            }]
        };

        // Si hay captura de pantalla, se la inyectamos a Gemini
        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        let content = response.candidates[0].content.parts[0].text;

        // Limpieza de cortesía
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Falla en Auditoría:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));

app.listen(port, () => {
    console.log(`PredictaCore v164.0 Sovereignty Online en puerto ${port}`);
});
