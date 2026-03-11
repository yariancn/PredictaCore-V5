const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Headers para evitar cache y remanentes de sesiones anteriores
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    if (!XAI_API_KEY) {
        return res.status(500).json({ content: '[ERROR]: XAI_API_KEY no configurada en Railway.' });
    }

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // 1. OBTENCIÓN DE DATOS (Barrido profundo de Jina)
        let hechos = "";
        try {
            const deepData = await scrapeDeep(dna);
            hechos = deepData.text && deepData.text.length > 200 
                ? deepData.text.substring(0, 12000) 
                : "URL: " + dna + ". El sitio no devolvió suficiente texto.";
        } catch (e) { 
            console.error("Error en scrapeo:", e.message);
            hechos = "URL: " + dna; 
        }

        const promptFinal = PROMPTS[idFinal](hechos);

        // 2. LLAMADA A GROK-3 CON ALTA PRECISIÓN
        const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-3", 
                messages: [
                    { role: "system", content: PERSONA },
                    { role: "system", content: `CONTEXTO REAL DEL ACTIVO (Timestamp: ${new Date().toISOString()}):\n${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 // Soul estratégico sin inventos
            })
        });

        if (!xRes.ok) {
            const errData = await xRes.json();
            throw new Error(`xAI Error: ${errData.error?.message || xRes.statusText}`);
        }

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no devolvió contenido.");

    } catch (error) {
        console.error("CRÍTICO:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore Titán v101.0 activo en puerto ${port}`));
