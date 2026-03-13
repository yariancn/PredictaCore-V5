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
                        content: `HOY ES: ${fechaActual}. ANALIZA: ${dna}. 
                        MANDATO DE MANO DE HIERRO: No seas un asistente, sé un PERITO FORENSE. 
                        REGLA DE VERDAD: Si el texto menciona 'Envío', 'WhatsApp', 'PayPal' o 'Chat', PROHIBIDO decir que no están. Acusa su invisibilidad si no son obvios. 
                        PROHIBICIÓN DE REPETICIÓN: Cada hallazgo debe ser ÚNICO. Si repites temas, el reporte no vale. 
                        15 fugas obligatorias de 3 a 5 líneas cada una.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // RIGOR ABSOLUTO: Cero creatividad, pura evidencia.
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL FILTRO DEL MAGO: Borramos cualquier rastro de amabilidad de la IA
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar de calidad forense.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v134.0 Iron Mind Active.`));
