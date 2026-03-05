const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY, XAI_API_KEY } = process.env;

    if (!API_KEY) return res.status(500).json({ content: "[ERROR]: API_KEY de Google no encontrada en Railway." });

    try {
        // 1. INVESTIGACIÓN EN TIEMPO REAL (JINA AI)
        // Usamos el Reader de Jina para alimentar el reporte con HECHOS.
        let hechos = "Data local no disponible. Usar análisis forense de ADN.";
        if (JINA_API_KEY) {
            try {
                const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jinaRes.ok) hechos = (await jinaRes.text()).substring(0, 5000);
            } catch (e) { console.log("Jina inalcanzable."); }
        }

        const promptFinal = `${PERSONA}
        
        [EVIDENCIA REAL EXTRAÍDA]:
        ${hechos}

        [ACTIVO ANALIZADO]: ${dna}
        [FASE]: ${PROMPTS[etapaId](dna)}
        
        REGLA DE ORO: 3 a 5 líneas máximo por punto. Asertividad quirúrgica.`;

        // 2. ADAPTACIÓN A INFRAESTRUCTURA 2026 (GOOGLE)
        // Intentamos con Gemini 3 Flash (El más avanzado hoy) y Gemini 2.5 (La nueva estabilidad)
        const modelos2026 = [
            { ver: "v1beta", mod: "gemini-3-flash-preview" },
            { ver: "v1beta", mod: "gemini-2.5-flash" }
        ];

        for (const i of modelos2026) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/${i.ver}/models/${i.mod}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                
                const data = await res.json();
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return res.json({ content: data.candidates[0].content.parts[0].text });
                }
            } catch (e) { continue; }
        }

        // 3. RESPALDO BALÍSTICO (XAI - GROK)
        // Si Google falla en su migración, Grok 4 entrega el resultado.
        if (XAI_API_KEY) {
            const resXai = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const dataXai = await resXai.json();
            if (dataXai.choices?.[0]?.message?.content) {
                return res.json({ content: dataXai.choices[0].message.content });
            }
        }

        throw new Error("Ningún núcleo de IA respondió. Revisa la vigencia de tus API Keys.");

    } catch (error) {
        console.error("FALLO EN ETAPA:", error.message);
        res.status(500).json({ content: `[FALLO DE NÚCLEO]: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore v42.0 [2026-READY] activo en puerto ${port}`);
});
