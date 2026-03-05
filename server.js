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

    try {
        // 1. OBTENCIÓN DE HECHOS (JINA AI)
        let hechos = "No se pudo extraer data. Usar lógica forense.";
        if (JINA_API_KEY) {
            const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
            });
            if (jinaRes.ok) hechos = (await jinaRes.text()).substring(0, 4000);
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. INTENTO CON GOOGLE GEMINI (Ruta de Producción 2026)
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const resGoogle = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });

        const dataGoogle = await resGoogle.json();

        // VALIDACIÓN QUIRÚRGICA DE GOOGLE
        if (dataGoogle.candidates && dataGoogle.candidates[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: dataGoogle.candidates[0].content.parts[0].text });
        }

        // 3. SI GOOGLE FALLA -> INTENTO CON X.AI (GROK)
        if (XAI_API_KEY) {
            console.log(`Google falló en ${etapaId}. Activando Grok...`);
            const resXai = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [
                        { role: "system", content: PERSONA },
                        { role: "user", content: promptFinal }
                    ]
                })
            });

            const dataXai = await resXai.json();
            
            // VALIDACIÓN QUIRÚRGICA DE X.AI
            if (dataXai.choices && dataXai.choices[0]?.message?.content) {
                return res.json({ content: dataXai.choices[0].message.content });
            }
        }

        // Si ambos fallan, devolvemos el error real para diagnóstico
        const errorFinal = dataGoogle.error?.message || "Fallo multicanal de IA.";
        throw new Error(errorFinal);

    } catch (error) {
        console.error(`DETALLE DEL FALLO EN ${etapaId}:`, error.message);
        res.status(500).json({ content: `[ERROR TÉCNICO]: ${error.message}. Verifica tu API_KEY y Cuota en Google Cloud.` });
    }
});

app.listen(port, () => console.log(`PredictaCore v40.0 activo en puerto ${port}`));
