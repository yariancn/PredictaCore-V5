const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

const creds = JSON.parse(process.env.GOOGLE_CREDS);
const vertexAI = new VertexAI({ project: creds.project_id, location: 'us-central1', googleAuthOptions: { credentials: creds } });
const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro', generationConfig: { temperature: 0.1 } });

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: "Etapa inválida." });

        // EL TITÁN DECIDE: ¿Es URL o es IDEA?
        const result = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](result.texto);

        // Preparamos el pedido para Gemini
        let parts = [{ text: `${PERSONA}\n\nMODO: ${result.isUrl ? 'AUDITORÍA WEB' : 'AUDITORÍA DE CONCEPTO'}\n\nENTRADA: ${dna}\n\n${promptFinal}` }];
        
        // Si hay foto, se la pasamos. Si es una IDEA, Gemini analizará solo el texto con su base de datos.
        if (result.screenshot) {
            parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        const request = { contents: [{ role: 'user', parts }] };
        const geminiRes = await model.generateContent(request);
        let content = geminiRes.response.candidates[0].content.parts[0].text;
        
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido).*/gi, '').trim();
        return res.json({ content });

    } catch (error) {
        res.status(500).json({ content: `[FALLA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v155.0 Universal Sovereign Online.`));
