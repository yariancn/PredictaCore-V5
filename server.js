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

    const fechaHoy = "Marzo de 2026"; // Forzado para consistencia total

    const ejecutarGrok = async (prompt, retry = false) => {
        return await fetch("https://api.x.ai/v1/chat/completions", {
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
                        content: `AUDITORÍA CRÍTICA: ${dna}. TIEMPO: ${fechaHoy}. 
                        REGLA DE ORO: Cero poesía. Cero redundancia. Si el análisis es descriptivo y no acusatorio, bórralo.` 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: retry ? 0.2 : 0.3 
            })
        });
    };

    try {
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' inválida.`);

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);

        let xRes = await ejecutarGrok(promptFinal);

        // REINTENTO AUTOMÁTICO SI EL FETCH FALLA (Cura para Punto XI)
        if (!xRes.ok) {
            console.log("Reintentando conexión para etapa:", etapaId);
            xRes = await ejecutarGrok(promptFinal, true);
        }

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok no respondió al estándar.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR FORENSE]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v119.0 Titanium Sovereign Online.`));
