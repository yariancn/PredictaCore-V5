const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Headers para evitar remanentes de caché
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

    if (!XAI_API_KEY) return res.status(500).json({ content: '[ERROR]: Falta XAI_API_KEY.' });

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // 1. Obtención de hechos reales
        let hechos = "";
        try {
            const deepData = await scrapeDeep(dna);
            hechos = (deepData.text && deepData.text.length > 100) 
                ? deepData.text.substring(0, 12000) 
                : "URL: " + dna + ". El sitio no permitió lectura. Analiza por contexto visual/dominio.";
        } catch (e) { 
            hechos = "URL: " + dna; 
        }

        const promptFinal = PROMPTS[idFinal](hechos);

        // 2. Conexión a Grok-3 (Temperatura 0.4 para calidad humana)
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
                    { role: "system", content: `HECHOS REALES DEL SITIO (Prohibido inventar):\n${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.4
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no respondió.");

    } catch (error) {
        console.error("LOG ERROR:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v103.0 Online.`));
