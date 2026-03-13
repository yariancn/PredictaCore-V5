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
        // Validación de existencia de PROMPTS para evitar el error 'undefined'
        if (!PROMPTS[etapaId]) {
            throw new Error(`Etapa '${etapaId}' no definida en el cerebro.`);
        }

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 

        const promptFinal = PROMPTS[etapaId](hechos);
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
                        content: `HOY ES: ${fechaHoy}. ESTÁS AUDITANDO: ${dna}. 
                        REGLA DE ORO: Si el reporte no es denso, factual y agresivo, fallas la misión. 
                        No te presentes. No uses preámbulos. 
                        Contexto real detectado:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL POLICÍA DE AI: Limpieza de escapes conversacionales
            const basura = [
                /^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo).*/gi,
                /En este reporte.*/gi, /Como gerente.*/gi
            ];
            basura.forEach(regex => { content = content.replace(regex, ''); });

            return res.json({ content: content.trim() });
        }
        throw new Error("Grok no alcanzó el estándar de calidad PredictaCore.");

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ content: `[ERROR ESTRATÉGICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v117.0 Sovereign online.`));
