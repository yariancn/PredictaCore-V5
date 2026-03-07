const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY, JINA_API_KEY } = process.env;

    try {
        // Redirección de seguridad para el punto final
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        if (!PROMPTS[idFinal]) throw new Error(`Etapa [${etapaId}] no definida.`);

        let hechos = "DNA base: " + dna;
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 5000);
            } catch (e) { console.log("Lector Offline"); }
        }

        const promptFinal = PROMPTS[idFinal](dna);

        // CONEXIÓN DIRECTA A X.AI (GROK)
        const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-2-latest",
                messages: [
                    { role: "system", content: PERSONA },
                    { role: "system", content: `CONTEXTO DEL NEGOCIO:\n${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 // Mantenemos precisión forense
            })
        });

        const xData = await xRes.json();

        if (xData.error) {
            throw new Error(`xAI Grok Error: ${xData.error.message}`);
        }

        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }

        throw new Error("Grok no devolvió contenido útil.");

    } catch (error) {
        console.error("LOG:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore Online con GROK Core en puerto ${port}`));
