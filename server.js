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
        // Validación de llaves para evitar el error 'undefined'
        if (!PROMPTS[etapaId]) {
            console.error(`Etapa no encontrada: ${etapaId}`);
            return res.status(400).json({ content: `[ERROR]: El Cerebro no reconoce la etapa '${etapaId}'.` });
        }

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
                        content: `AUDITORÍA CRÍTICA: ${dna}. FECHA: ${fechaActual}. 
                        REGLA DE ORO: No saludes. No te presentes. Sé factual y agresivo. 
                        Las 15 fugas deben ser de 3 a 5 líneas cada una obligatoriamente.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 
            })
        });

        if (!xRes.ok) throw new Error(`Falla en API xAI: ${xRes.statusText}`);

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO FORENSE: Limpieza de frases de relleno
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no generó contenido.");

    } catch (error) {
        console.error("Error en proceso:", error.message);
        res.status(500).json({ content: `[ERROR FORENSE]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v121.0 Titan Active.`));
