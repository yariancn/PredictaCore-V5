const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

// FUNCIÓN DE PRUEBA DE CONEXIÓN (Startup Check)
const testNucleo = async () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) return console.log("⚠️ ALERTA: No hay API_KEY configurada.");
    try {
        const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hola" }] }] })
        });
        const data = await testRes.json();
        if (data.candidates) console.log("✅ CONEXIÓN EXITOSA: El núcleo Gemini 3 está activo.");
        else console.log("❌ FALLO DE NÚCLEO: Google respondió pero no hay candidatos. Revisa cuota.");
    } catch (e) { console.log("❌ ERROR CRÍTICO: No se pudo contactar a Google."); }
};

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY, XAI_API_KEY } = process.env;

    try {
        // 1. ESCÁNER DE HECHOS (JINA AI) - Con Timeout agresivo
        let hechos = "DNA base: " + dna;
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` },
                    signal: AbortSignal.timeout(7000) // 7 seg max para Jina
                });
                if (jRes.ok) hechos = (await jRes.text()).substring(0, 3000);
            } catch (e) { console.log("Jina omitido."); }
        }

        const promptFinal = `${PERSONA}\n\n[HECHOS]: ${hechos}\n\n[ADN]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. MOTOR DE INTELIGENCIA 2026 (CARRUSEL)
        const modelos2026 = ["gemini-3-flash-preview", "gemini-3.1-flash-lite-preview"];
        let respuesta = null;

        for (const modelName of modelos2026) {
            try {
                const gFetch = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                const gData = await gFetch.json();
                if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
                    respuesta = gData.candidates[0].content.parts[0].text;
                    break;
                }
            } catch (e) { continue; }
        }

        // 3. RESPALDO XAI (GROK-2)
        if (!respuesta && XAI_API_KEY) {
            console.log("Activando saldo de Grok...");
            const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-2", 
                    messages: [{ role: "system", content: PERSONA }, { role: "user", content: promptFinal }]
                })
            });
            const xData = await xRes.json();
            respuesta = xData.choices?.[0]?.message?.content;
        }

        if (respuesta) return res.json({ content: respuesta });
        throw new Error("Ningún núcleo respondió. Posible bloqueo de IP en Railway o cuota agotada.");

    } catch (error) {
        res.status(500).json({ content: `[ESTADO]: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore v55.0 [TITÁN 2026] activo en puerto ${port}`);
    testNucleo(); // Prueba automática al arrancar
});
