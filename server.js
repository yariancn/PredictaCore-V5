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
        // Redirección de seguridad para el punto final XI
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

        // CONEXIÓN CORREGIDA: Usando grok-3 (confirmado en tu consola)
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
                    { role: "system", content: `CONTEXTO REAL DEL SITIO:\n${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2
            })
        });

        const xData = await xRes.json();

        // Manejo de errores robusto para evitar el mensaje "undefined"
        if (xData.error) {
            const errorMsg = xData.error.message || JSON.stringify(xData.error);
            throw new Error(`xAI Error: ${errorMsg}`);
        }

        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }

        throw new Error("Grok no devolvió una respuesta válida.");

    } catch (error) {
        console.error("CRÍTICO:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v90.0 [GROK-3] activo en puerto ${port}`));
