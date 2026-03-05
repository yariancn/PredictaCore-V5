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

    if (!API_KEY || !JINA_API_KEY) {
        return res.status(500).json({ content: "Error: Faltan llaves (Google o Jina) en Railway." });
    }

    let contextoReal = "";

    // ACCIÓN FORENSE: Si la etapa requiere hechos (Benchmark, Visibilidad, SWOT)
    // Jina entra a investigar primero.
    if (["INTRO", "VISIBILIDAD", "BENCHMARK", "SWOT"].includes(etapaId)) {
        try {
            const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
            });
            contextoReal = await jinaRes.text();
            // Recortamos para no saturar el prompt, manteniendo lo esencial
            contextoReal = contextoReal.substring(0, 5000); 
        } catch (e) {
            console.error("Jina no pudo leer el sitio, procediendo con base de datos interna.");
        }
    }

    const promptFinal = `${PERSONA}
    
    CONTEXTO REAL EXTRAÍDO (HECHOS):
    ${contextoReal || "No se pudo extraer data en tiempo real. Usa análisis forense deductivo."}

    ACTIVO BAJO ANÁLISIS: ${dna}
    FASE ESPECÍFICA: ${PROMPTS[etapaId](dna)}`;

    // Motor de Generación (Gemini 1.5 Flash - Estándar estable 2026)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        const data = await response.json();
        const textOutput = data.candidates[0].content.parts[0].text;
        res.json({ content: textOutput });

    } catch (error) {
        console.error(`FALLO EN ${etapaId}:`, error.message);
        res.status(500).json({ content: "Error de comunicación con el núcleo técnico." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore v35.0 [JINA-REAL-TIME] activo en puerto ${port}`);
});
