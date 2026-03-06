const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal para cargar la interfaz
app.get('/', (req, res) => {
    res.send(getHTML());
});

// NÚCLEO ESTRATÉGICO: Procesamiento de Auditoría
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { API_KEY, JINA_API_KEY, XAI_API_KEY } = process.env;

    try {
        // 1. ESCÁNER DE HECHOS (JINA AI)
        // PredictaCore no especula, analiza realidades.
        let hechos = "DNA base. Análisis deductivo activado.";
        if (JINA_API_KEY) {
            try {
                const jinaRes = await fetch(`https://r.jina.ai/${dna}`, {
                    headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
                });
                if (jinaRes.ok) {
                    const texto = await jinaRes.text();
                    hechos = texto.substring(0, 3000); 
                }
            } catch (e) { console.log("Jina no disponible."); }
        }

        const promptFinal = `${PERSONA}\n\n[CONTEXTO REAL]:\n${hechos}\n\n[ACTIVO]: ${dna}\n[FASE]: ${PROMPTS[etapaId](dna)}`;

        // 2. MOTOR DE INTELIGENCIA (GOOGLE)
        // Probamos el modelo estándar y el más avanzado de 2026.
        const modelos = ["gemini-1.5-flash", "gemini-2.0-flash"];
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
                    break; 
                }
            } catch (e) { console.log(`Fallo con ${m}, probando siguiente...`); }
        }

        // 3. RESPALDO DE IDENTIDAD ÚNICA (XAI)
        // Si Google falla, Grok-2 mantiene el mismo tono y rigor.
        if (!respuestaIA && XAI_API_KEY) {
            const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
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
            const xData = await xaiRes.json();
            respuestaIA = xData.choices?.[0]?.message?.content;
        }

        if (respuestaIA) {
            return res.json({ content: respuestaIA });
        } else {
            throw new Error("Ningún núcleo de IA respondió correctamente.");
        }

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[FALLO]: ${error.message}. Revisa tus API Keys.` });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v48.0 rugiendo en el puerto ${port}`);
});
        // 2. MOTOR DE INTELIGENCIA (GOOGLE)
        // Probamos el modelo estándar y el más avanzado de 2026.
        const modelos = ["gemini-1.5-flash", "gemini-2.0-flash"];
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
                    break; 
                }
            } catch (e) { console.log(`Fallo con ${m}, probando siguiente...`); }
        }

        // 3. RESPALDO DE IDENTIDAD ÚNICA (XAI)
        // Si Google falla, Grok-2 mantiene el mismo tono y rigor.
        if (!respuestaIA && XAI_API_KEY) {
            const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
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
            const xData = await xaiRes.json();
            respuestaIA = xData.choices?.[0]?.message?.content;
        }

        if (respuestaIA) {
            return res.json({ content: respuestaIA });
        } else {
            throw new Error("Ningún núcleo de IA respondió correctamente.");
        }

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[FALLO]: ${error.message}. Revisa tus API Keys.` });
    }
});

app.listen(port, () => {
    console.log(`PredictaCore Titán v48.0 rugiendo en el puerto ${port}`);
});        ];

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
