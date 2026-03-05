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
        return res.status(500).json({ content: "Error: Faltan llaves en Railway (API_KEY o JINA_API_KEY)." });
    }

    let contextoReal = "No se pudo extraer data. Usa análisis forense deductivo.";

    // 1. ESCÁNER DE HECHOS (JINA AI)
    // Solo investigamos en etapas críticas para no saturar el sistema
    if (["INTRO", "VISIBILIDAD", "BENCHMARK"].includes(etapaId)) {
        try {
            const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
            });
            if (jinaRes.ok) {
                const rawData = await jinaRes.text();
                contextoReal = rawData.substring(0, 4000); // Solo los primeros 4k caracteres
            }
        } catch (e) {
            console.error("Jina offline: ", e.message);
        }
    }

    const promptFinal = `${PERSONA}
    
    [CONTEXTO REAL DEL ACTIVO]:
    ${contextoReal}

    [ACTIVO]: ${dna}
    [FASE]: ${PROMPTS[etapaId](dna)}`;

    // 2. NÚCLEO DE INTELIGENCIA (GOOGLE GEMINI)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        const data = await response.json();

        // VALIDACIÓN DE RESPUESTA (Evita el error de 'undefined')
        if (data.candidates && data.candidates.length > 0) {
            const textOutput = data.candidates[0].content.parts[0].text;
            return res.json({ content: textOutput });
        } else {
            // Si Google responde con error, lo exponemos en el log
            const errorMsg = data.error ? data.error.message : "Respuesta de IA vacía o bloqueada.";
            console.error(`ERROR DE GOOGLE EN ${etapaId}:`, errorMsg);
            throw new Error(errorMsg);
        }

    } catch (error) {
        console.error(`FALLO TÉCNICO EN ${etapaId}:`, error.message);
        res.status(500).json({ content: "Error de comunicación con el núcleo técnico. Reintentando..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore v36.0 [FACTS-ONLY] activo en puerto ${port}`);
});
