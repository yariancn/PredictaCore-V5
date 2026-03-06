const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY } = process.env;

    try {
        // Redirección de seguridad: Cualquier ID desconocido al final dispara OMNI
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';

        if (!PROMPTS[idFinal]) {
            throw new Error(`Etapa [${etapaId}] no encontrada en cerebro.js`);
        }

        let hechos = "DNA base: " + dna;
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 4500);
            } catch (e) { console.log("Lector Offline"); }
        }

        const promptFinal = `${PERSONA}\n\n[INFO]: ${hechos}\n\n[TAREA]: ${PROMPTS[idFinal](dna)}`;

        // RUTA DE PRODUCCIÓN ESTABLE v1 (Certificada Marzo 2026)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const gRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });
        
        const gData = await gRes.json();

        // Manejo de errores de la API de Google
        if (gData.error) {
            throw new Error(`Google API: ${gData.error.message} (Status: ${gData.error.status})`);
        }

        if (gData.candidates && gData.candidates[0].content) {
            return res.json({ content: gData.candidates[0].content.parts[0].text });
        }

        throw new Error("La IA no devolvió contenido útil.");

    } catch (error) {
        console.error("LOG:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore Online puerto ${port}`));
