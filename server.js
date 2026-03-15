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
    
    // El sistema usará 'predictacore' automáticamente desde tu JSON
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1', 
        googleAuthOptions: { credentials: creds } 
    });

    // Cambiamos a FLASH: Más rápido, más disponible, mismo razonamiento
    model = vertexAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash-002', 
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192
        } 
    });
    
    console.log(`[SISTEMA]: Conectado a Proyecto: ${creds.project_id}`);
    console.log("[SISTEMA]: Motor Titán Flash listo.");
} catch (e) {
    console.error("[ERROR]: Falla en configuración inicial:", e.message);
}

// RUTA DE DISECCIÓN
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

        // Si tenemos visión (captura), se la pasamos al modelo
        if (result.screenshot) {
            request.contents[0].parts.push({ 
                inlineData: { mimeType: 'image/png', data: result.screenshot } 
            });
        }

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("Google no devolvió respuesta. Verifica cuotas.");
        }

        let content = response.candidates[0].content.parts[0].text;
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Error en el proceso:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v160.0 Online`));
