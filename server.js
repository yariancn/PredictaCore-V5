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
        // 1. ESCÁNER DE HECHOS (JINA AI) - Truncado para no saturar la llave
        let hechosData = "Sin acceso a web. Análisis forense por ADN.";
        if (JINA_API_KEY) {
            try {
                const jinaRes = await fetch(`https://r.jina.ai/${dna}`, { headers: { "Authorization": `Bearer ${JINA_API_KEY}` } });
                if (jinaRes.ok) {
                    const texto = await jinaRes.text();
                    hechosData = texto.substring(0, 2500); // Reducimos a 2500 para asegurar paso por la API
                }
            } catch (e) { console.log("Jina Offline."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechosData}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. MOTOR PRINCIPAL: GOOGLE (Ruta Estándar v1)
        // Usamos el endpoint v1 (producción) y el alias estable.
        const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
        });

        const dataG = await googleRes.json();
        
        if (dataG.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.json({ content: dataG.candidates[0].content.parts[0].text });
        }

        // 3. RESPALDO: XAI (GROK-2)
        if (XAI_API_KEY) {
            console.log(`Google rechazó ${etapaId}. Activando Grok-2...`);
            const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
                body: JSON.stringify({
                    model: "grok-2", 
                    messages: [
                        { role: "system", content: PERSONA },
                        { role: "user", content: promptFinal }
                    ]
                })
            });

            const dataX = await xaiRes.json();
            if (dataX.choices?.[0]?.message?.content) {
                return res.json({ content: dataX.choices[0].message.content });
            }
        }

        // Si llegamos aquí, ambos fallaron. Devolvemos el error real para leerlo.
        const msgError = dataG.error?.message || "Error desconocido en ambos núcleos.";
        throw new Error(msgError);

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[FALLO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v46.0 [STABLE] activo.`));
