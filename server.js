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
        const fechaHoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

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
                        content: `FECHA ACTUAL: ${fechaHoy}. ESTÁS AUDITANDO: ${dna}. 
                        MISIÓN: Detectar fugas de dinero. 
                        PROHIBIDO: Usar lenguaje poético o soñador. Sé factual. 
                        REGLA DE LAS 15 FUGAS: Cada fuga debe tener entre 3 y 5 líneas de análisis.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL POLICÍA DE IA: Limpieza de preámbulos y poesía barata
            const basura = [
                /^Claro.*/gi, /^Aquí tienes.*/gi, /^Analizando.*/gi, /^Vamos a.*/gi,
                /refugio emocional/gi, /catálogo de caricias/gi, /abrazo textil/gi
            ];
            basura.forEach(regex => { content = content.replace(regex, ''); });

            return res.json({ content: content.trim() });
        }
        throw new Error("Calidad de reporte rechazada.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR ESTRATÉGICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v116.0 Sovereign online.`));
