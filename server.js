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
        
        // Enviamos un bloque robusto de datos (15k caracteres)
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
                        content: `AUDITORÍA PARA EL ACTIVO: ${dna}. 
                        INSTRUCCIÓN CRÍTICA: Analiza descripciones de imágenes y logos. 
                        Si ves un logo de certificación en el texto alternativo o banners, úsalo como prueba de autoridad. 
                        No ignores la semiótica visual reportada en este contenido:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no respondió. Revisa logs de API.");

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v107.0 Visionary Engine online.`));
