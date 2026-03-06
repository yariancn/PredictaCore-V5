const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Interfaz Principal
app.get('/', (req, res) => {
    res.send(getHTML());
});

// NÚCLEO ESTRATÉGICO: Procesamiento de Auditoría
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY, XAI_API_KEY } = process.env;

    if (!API_KEY) return res.status(500).json({ content: "[ERROR]: API_KEY de Google no encontrada." });

    try {
        // 1. ESCÁNER DE HECHOS (JINA AI)
        let hechos = "DNA base. Análisis forense PredictaCore activado.";
        if (JINA_API_KEY) {
            try {
                const jinaFetch = await fetch(`https://r.jina.ai/${dna}`, {
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jinaFetch.ok) {
                    const textoRaw = await jinaFetch.text();
                    hechos = textoRaw.substring(0, 3000); 
                }
            } catch (e) { console.log("Jina no disponible en esta fase."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. MOTOR DE INTELIGENCIA (GOOGLE)
        // Probamos las dos rutas de producción más estables de 2026
        const modelos = ["gemini-1.5-flash", "gemini-1.5-pro"];
        let respuestaIA = null;

        for (const m of modelos) {
            try {
                const gFetch = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                
                const gData = await gFetch.json();
                if (gData.candidates && gData.candidates[0]?.content?.parts[0]?.text) {
                    respuestaIA = gData.candidates[0].content.parts[0].text;
                    break; // Salimos si Google responde
                }
            } catch (e) { console.log(`Google ${m} rechazó la llamada.`); }
        }

        // 3. RESPALDO DE IDENTIDAD ÚNICA (XAI)
        // Si Google falla, Grok-2 mantiene el mismo rigor estratégico
        if (!respuestaIA && XAI_API_KEY) {
            console.log("Activando respaldo Grok...");
            const xaiFetch = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${XAI_API_KEY}` 
                },
                body: JSON.stringify({
                    model: "grok-2",
                    messages: [
                        { role: "system", content: PERSONA },
                        { role: "user", content: promptFinal }
                    ]
                })
            });
            const xData = await xaiFetch.json();
            respuestaIA = xData.choices?.[0]?.message?.content;
        }

        // SALIDA FINAL
        if (respuestaIA) {
            res.json({ content: respuestaIA });
        } else {
            res.status(500).json({ content: "[FALLO]: Ninguna IA respondió. Revisa cuotas o API_KEY." });
        }

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[CRÍTICO]: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v50.0 activo en puerto ${port}`);
});
