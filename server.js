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
        // 1. VALIDACIÓN DE ETAPA
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });
        }

        // 2. SCRAPING PROFUNDO
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Viernes, 13 de Marzo de 2026";

        // 3. EJECUCIÓN GROK CON PROTOCOLO DE VERDAD
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
                        content: `AUDITORÍA FORENSE: ${dna}. TIEMPO REAL: ${fechaActual}.
                        MANDATO DE VERACIDAD: Si el texto menciona 'Envío gratis', 'PayPal', 'WhatsApp' o 'Bebés', PROHIBIDO decir que no están. 
                        Si están pero cuestan hallarlos, acusa 'INVISIBILIDAD ESTRATÉGICA'.
                        Si el texto no dice 'lencería', no hables de lencería. Sé un perito judicial.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // Máximo rigor, mínima alucinación
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO DE CALIDAD: Limpieza absoluta
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok no devolvió datos.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v129.0 Sovereign Active.`));
