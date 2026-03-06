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
        // SEGURIDAD: Mapeo de la etapa final
        const idReal = (etapaId === 'OMNI' || etapaId === 'AUTORIDAD') ? 'OMNI' : etapaId;

        if (!PROMPTS[idReal]) {
            throw new Error(`Etapa [${etapaId}] no encontrada en el cerebro.`);
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

        const promptFinal = `${PERSONA}\n\n[CONTEXTO]: ${hechos}\n\n[TAREA]: ${PROMPTS[idReal](dna)}`;

        // LLAMADA PURA AL MODELO ESTABLE (gemini-1.5-flash)
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });
        
        const gData = await gRes.json();

        // REPORTE DE ERROR REAL DE GOOGLE
        if (gData.error) {
            throw new Error(`Google API: ${gData.error.message}`);
        }

        if (gData.candidates && gData.candidates[0].content) {
            const respuesta = gData.candidates[0].content.parts[0].text;
            return res.json({ content: respuesta });
        }

        throw new Error("La IA no devolvió contenido útil.");

    } catch (error) {
        console.error("LOG DE ERROR:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v80.0 Activo en puerto ${port}`));
