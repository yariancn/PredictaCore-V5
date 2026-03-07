const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY, JINA_API_KEY } = process.env;
    if (!XAI_API_KEY) {
        return res.status(500).json({ content: '[ERROR]: XAI_API_KEY no configurada.' });
    }
    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        if (!PROMPTS[idFinal]) throw new Error(`Etapa [${etapaId}] no definida.`);
        
        let hechos = "DNA base: " + dna;
        let visualsData = {};
        
        try {
            const deepData = await scrapeDeep(dna, 5);  // max 5 páginas/subpáginas
            hechos = deepData.text;
            visualsData = deepData.visuals;
            console.log("Scraped deep content length:", hechos.length);
        } catch (e) {
            console.error("Playwright error, fallback to Jina:", e.message);
            try {
                const headers = JINA_API_KEY ? { "Authorization": `Bearer ${JINA_API_KEY}` } : {};
                const jRes = await fetch(`https://r.jina.ai/${encodeURIComponent(dna)}`, { headers });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 15000);
            } catch (jErr) {
                console.log("Jina fallback failed");
            }
        }
        
        const promptFinal = PROMPTS[idFinal](dna);
        
        const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-4-1-fast-reasoning",
                messages: [
                    { role: "system", content: PERSONA },
                    { role: "system", content: `CONTEXTO REAL DEL SITIO:\n${hechos}` },
                    { role: "system", content: `VISUALS EXTRAÍDOS (colores de fondo, botones):\n${JSON.stringify(visualsData)}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2
            })
        });
        
        if (!xRes.ok) {
            const errorData = await xRes.json();
            throw new Error(`xAI Error: ${errorData.error?.message || xRes.statusText}`);
        }
        
        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no devolvió respuesta válida.");
    } catch (error) {
        console.error("CRÍTICO:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v90.0 [GROK-4] activo en puerto ${port}`));
