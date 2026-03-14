const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// RUTA MAESTRA DE DISECCIÓN
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });

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
                        content: `SÉ MI ESPEJO: Analiza ${dna} bajo mis leyes de pensamiento forense. 
                        No busques errores de código; busca errores de NEGOCIO y PSICOLOGÍA. 
                        ¿Qué información VITAL falta para que yo, como cliente, confíe y pague hoy? 
                        Sé brutalmente directo, denso y útil. 15 hallazgos únicos.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // RIGOR TOTAL PARA EVITAR POESÍA
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar de PredictaCore.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));

app.listen(port, () => {
    console.log(`PredictaCore v150.0 Autonomous Titan Online en puerto ${port}`);
});
