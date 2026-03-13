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
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });
        }

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Marzo de 2026";

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
                        MANDATO FORENSE: No seas un asistente, sé un PERITO. 
                        PROTOCOLO DE VERDAD: Busca activamente Nodos de Supervivencia (Pagos, Envíos, Soporte). Si no los ves fácil, acusa su INVISIBILIDAD. 
                        REGLA DE ORO: Si repites un hallazgo de otra sección, fallas la misión. 15 fugas obligatorias, 3-5 líneas cada una.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // MÁXIMO RIGOR ANALÍTICO
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO DEL MAGO: Limpia la basura conversacional de la IA
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar forense.");

    } catch (error) {
        console.error("FALLA EN SERVIDOR:", error.message);
        res.status(500).json({ content: `[ERROR ESTRATÉGICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v136.0 Sovereign Online.`));
