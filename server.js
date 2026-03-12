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
                        content: `AUDITORÍA CRÍTICA: ${dna}. 
                        NO TE PRESENTES. NO USES RELLENO. 
                        Analiza las imágenes y el texto con rigor científico:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2 // Rigor absoluto
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL FILTRO DEL MAGO: Limpieza profunda de basura conversacional
            const basura = [
                /^Claro.*/gi, /^Aquí tienes.*/gi, /^Entendido.*/gi, 
                /^Vamos al grano.*/gi, /^Como gerente.*/gi, 
                /^Basado en.*/gi, /^Directo a.*/gi, /^Perfecto.*/gi
            ];
            basura.forEach(regex => { content = content.replace(regex, ''); });

            return res.json({ content: content.trim() });
        }
        throw new Error("Grok falló el estándar de calidad.");

    } catch (error) {
        res.status(500).json({ content: `[FALLA FORENSE]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v112.0 Master active.`));
