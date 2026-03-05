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
        return res.status(500).json({ content: "Error: Faltan llaves (API_KEY o JINA_API_KEY) en Railway." });
    }

    let hechosReales = "Investigando datos en tiempo real...";

    // 1. INVESTIGACIÓN OBLIGATORIA CON JINA (10 PASOS ADELANTE)
    // PredictaCore ya no supone nada. Jina lee el DNA en cada etapa crítica.
    try {
        const jinaUrl = dna.startsWith('http') ? dna : `https://www.google.com/search?q=${encodeURIComponent(dna)}`;
        const jinaRes = await fetch(`https://r.jina.ai/${jinaUrl}`, {
            headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        
        if (jinaRes.ok) {
            const fullData = await jinaRes.text();
            hechosReales = fullData.substring(0, 5000); // Capturamos la esencia forense
        }
    } catch (e) {
        console.error("Fallo en Jina:", e.message);
        hechosReales = "Data no disponible por bloqueo de sitio. Usar lógica deductiva.";
    }

    const promptFinal = `${PERSONA}
    
    [HECHOS REALES EXTRAÍDOS POR JINA AI]:
    ${hechosReales}

    [ACTIVO A ANALIZAR]: ${dna}
    [FASE ACTUAL]: ${PROMPTS[etapaId](dna)}`;

    // 2. PROCESAMIENTO CON NÚCLEO ESTABLE (V1)
    try {
        // Forzamos la versión v1 que es la estándar estable en 2026
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            return res.json({ content: data.candidates[0].content.parts[0].text });
        } else {
            // Log detallado para auditoría técnica
            const detail = data.error ? data.error.message : "Sin candidatos en la respuesta.";
            console.error(`DETALLE DE FALLO EN ${etapaId}:`, detail);
            throw new Error(detail);
        }

    } catch (error) {
        console.error(`ERROR FINAL EN ${etapaId}:`, error.message);
        res.status(500).json({ content: "Error de comunicación con el núcleo. Reintentando..." });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore v37.0 [STABLE-FACTS] activo en puerto ${port}`);
});
