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
        // Validación de etapa para evitar errores de referencia
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida por el Cerebro.` });
        }

        // Ejecución del Scraper
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Viernes, 13 de Marzo de 2026";

        // Llamada a la API con Mandato de Veracidad
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
                        MANDATO DE VERDAD: Si el texto menciona pagos (PayPal, MSI, etc.), chat, WhatsApp o envíos gratis, NO digas que no existen. 
                        Si el activo existe pero no es obvio, acusa 'INVISIBILIDAD ESTRATÉGICA'. 
                        REGLA DE LAS 15 FUGAS: Cada punto DEBE tener entre 3 y 5 líneas de profundidad forense. 
                        Sé un PERITO, no un asistente amigable.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // Rigor absoluto para evitar invenciones poéticas
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // Limpieza de preámbulos de IA para reporte limpio
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar forense esperado.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA FORENSE]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v130.0 Universal Online.`));
