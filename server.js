const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // 1. OBTENCIÓN DE DATOS REALES (MÁXIMA PROFUNDIDAD)
        let hechos = "";
        try {
            const deepData = await scrapeDeep(dna);
            hechos = deepData.text.substring(0, 10000); // 10k caracteres de verdad
        } catch (e) { hechos = "URL del activo: " + dna; }

        // 2. CONSTRUCCIÓN DEL PROMPT CON GROUNDING
        const promptFinal = PROMPTS[idFinal](hechos);

        const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-3", // Usamos el motor más potente disponible
                messages: [
                    { role: "system", content: PERSONA },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // MÁXIMA PRECISIÓN, CERO ALUCINACIÓN
            })
        });

        const xData = await xRes.json();
        if (xData.choices) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no respondió. Revisa conexión API.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v100.0 [Executive] Online.`));
