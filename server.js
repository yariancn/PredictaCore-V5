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
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });

        // MOTOR: Scraping profundo y preparación de hechos
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Sábado, 14 de Marzo de 2026";

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
                        content: `SÉ MI ESPEJO: Analiza ${dna} como lo haría un consultor de $1,000 USD. 
                        - Si no conoces el dinero del cliente, NO inventes cifras. Habla de impacto y riesgo.
                        - Desprecia lo técnico (nombres de archivos, alt-text). Busca la ESENCIA.
                        - Cada punto de las fugas debe ser un 'Aja!' para el dueño. 
                        - Un párrafo por punto (3-5 líneas). Brutal, seco, forense.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // MÁXIMO RIGOR ANALÍTICO
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO DEL MAGO: Limpia la paja conversacional
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
    console.log(`PredictaCore v145.0 Sovereignty Online en puerto ${port}`);
});
