const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY } = process.env;

    try {
        // FIX PUNTO XI: Si el front pide OMNI o AUTORIDAD, usamos el prompt ROADMAP
        let idReal = etapaId;
        if (etapaId === 'OMNI' || etapaId === 'AUTORIDAD') idReal = 'ROADMAP';

        if (!PROMPTS[idReal]) {
            throw new Error(`Etapa [${etapaId}] no encontrada en cerebro.js`);
        }

        let hechos = "DNA base: " + dna;
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 4000);
            } catch (e) { console.log("Jina Offline"); }
        }

        const promptFinal = `${PERSONA}\n\n[INFO REAL DE LA WEB]:\n${hechos}\n\n[TAREA]: ${PROMPTS[idReal](dna)}`;

        // LLAMADA ORIGINAL AL MODELO 1.5 FLASH
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });
        
        const gData = await gRes.json();

        if (gData.candidates && gData.candidates[0].content && gData.candidates[0].content.parts[0].text) {
            return res.json({ content: gData.candidates[0].content.parts[0].text });
        }

        throw new Error(gData.error?.message || "Sin respuesta de los núcleos de IA.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore Online.`));
