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
        // Validación radical: Si la etapa no existe en cerebro.js, lanzamos error claro
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida por el Cerebro.` });
        }

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "13 de Marzo de 2026"; // Grounding temporal absoluto

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
                    { 
                        role: "system", 
                        content: `AUDITORÍA CRÍTICA: ${dna}. FECHA: ${fechaActual}. 
                        REGLA DE HIERRO: No saludes. No expliques qué vas a hacer. 
                        Sé un estratega agresivo. Las 15 fugas deben ser de 3 a 5 líneas cada una.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // Limpieza quirúrgica de preámbulos de IA
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("La API de Grok no devolvió contenido válido.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[ERROR FORENSE]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v120.0 Titan Active.`));
