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
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // 1. OBTENCIÓN DE DATOS REALES
        let hechos = "";
        try {
            const deepData = await scrapeDeep(dna);
            hechos = deepData.text && deepData.text.length > 100 
                ? deepData.text.substring(0, 12000) 
                : "URL: " + dna + ". El sitio no permitió lectura profunda. Analiza por dominio y contexto visual.";
        } catch (e) { hechos = "URL del activo: " + dna; }

        const promptFinal = PROMPTS[idFinal](hechos);

        // 2. CONEXIÓN A GROK CON ALTA TEMPERATURA PARA EL ALMA (0.4)
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
                    { role: "system", content: `CONTEXTO REAL DEL SITIO (No inventar): \n${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.4 // Subimos un poco para recuperar la humanidad de los reportes iniciales
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no respondió.");

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore Online.`));        const xData = await xRes.json();
        if (xData.choices) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Sin respuesta de Grok.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v102.0 Polish activo.`));
