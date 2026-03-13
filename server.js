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
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' inválida.`);

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Viernes, 13 de Marzo de 2026";

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
                        content: `HOY ES: ${fechaActual}. ANALIZA: ${dna}. 
                        REGLA DE ORO: No seas un asistente, sé un PERITO. 
                        BÚSQUEDA SEMÁNTICA: Antes de negar un activo (Pagos/Soporte), rastrea sinónimos en el texto. Si no es obvio, acusa su INVISIBILIDAD. 
                        15 fugas obligatorias de 3-5 líneas cada una.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL FILTRO DEL MAGO: Limpiamos la basura conversacional
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Calidad insuficiente en el motor forense.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR ESTRATÉGICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v127.0 Sovereignty active.`));
