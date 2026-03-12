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
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 

        const promptFinal = PROMPTS[idFinal](hechos);

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
                        content: `MISIÓN CRÍTICA: Actúa como un Inspector de Valor. 
                        Si el texto tiene relleno, bórralo. 
                        Si no analizas las imágenes de ${dna}, fallas la misión. 
                        Contexto real:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2 // Rigor absoluto para evitar 'creatividad' innecesaria
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            // Limpieza final de posibles escapes de la IA (frases amigables)
            let content = xData.choices[0].message.content;
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Directo a|Vamos a).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok falló el estándar de calidad.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR ESTRATÉGICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v111.0 Sovereign active.`));
