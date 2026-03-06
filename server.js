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
        // 1. ESCÁNER FORENSE (JINA AI) - Hechos en tiempo real
        let hechosReales = "Data externa no disponible. Análisis deductivo basado en ADN.";
        if (JINA_API_KEY) {
            try {
                const jRes = await fetch(`https://r.jina.ai/${dna}`, { 
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` } 
                });
                if (jRes.ok) {
                    const textoRaw = await jRes.text();
                    hechosReales = textoRaw.substring(0, 3000); 
                }
            } catch (e) { console.log("Jina Error: " + e.message); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechosReales}\n\n[ADN]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. CARRUSEL DE INTELIGENCIA GOOGLE (Auto-Descubrimiento 2026)
        const rutasGoogle = [
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
        ];

        let ultimoErrorGoogle = "";

        for (const url of rutasGoogle) {
            try {
                const gFetch = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
                });
                const gData = await gFetch.json();
                
                if (gData.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return res.json({ content: gData.candidates[0].content.parts[0].text });
                }
                ultimoErrorGoogle = gData.error?.message || "Respuesta vacía";
            } catch (e) { 
                ultimoErrorGoogle = e.message;
            }
        }

        console.log(`Google agotado en ${etapaId}. Razón: ${ultimoErrorGoogle}. Pasando a Grok...`);

        // 3. RESPALDO TITÁN: XAI (GROK)
        if (XAI_API_KEY) {
            const xFetch = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${XAI_API_KEY}` 
                },
                body: JSON.stringify({
                    model: "grok-2", // Modelo estándar estable en 2026
                    messages: [
                        { role: "system", content: PERSONA },
                        { role: "user", content: promptFinal }
                    ]
                })
            });
            const xData = await xFetch.json();
            
            if (xData.choices?.[0]?.message?.content) {
                return res.json({ content: xData.choices[0].message.content });
            }
            throw new Error(`Grok falló: ${xData.error?.message || "Error desconocido"}`);
        }

        throw new Error(`Fallo multicanal. Google dice: ${ultimoErrorGoogle}`);

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[CRÍTICO]: ${error.message}` });
    }
});

app.listen(port, () => console.log(`PredictaCore v47.0 [SOVEREIGN-ENGINE] activo.`));
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
