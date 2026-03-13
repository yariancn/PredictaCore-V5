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

        // OBTENEMOS FECHA REAL PARA EVITAR Hallucinaciones de "Fechas Futuras"
        const fechaActual = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

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
                        content: `HOY ES: ${fechaActual}. 
                        ESTÁS AUDITANDO: ${dna}. 
                        REGLA SUPREMA: Ignora datos técnicos de imágenes (px, formatos). 
                        Concéntrate en la PSICOLOGÍA y el PRODUCTO. 
                        Contexto:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.4 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar.");

    } catch (error) {
        res.status(500).json({ content: `[FALLA ESTRATÉGICA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v115.0 Sovereign active.`));
