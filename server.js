const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Configuración de Headers para evitar basura de caché en Railway
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Ruta principal (Interfaz Visual)
app.get('/', (req, res) => res.send(getHTML()));

// Motor de Disección Forense
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    if (!XAI_API_KEY) {
        return res.status(500).json({ content: '[ERROR]: XAI_API_KEY no configurada en el entorno.' });
    }

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // 1. BARRIDO DE DATOS REALES (Aumentamos a 15k caracteres de visión)
        let hechos = "";
        try {
            const deepData = await scrapeDeep(dna);
            hechos = (deepData.text && deepData.text.length > 200) 
                ? deepData.text.substring(0, 15000) 
                : "URL del activo: " + dna + ". El sitio no permitió lectura profunda.";
        } catch (e) { 
            console.error("Fallo en el motor de lectura:", e.message);
            hechos = "URL del activo: " + dna; 
        }

        const promptFinal = PROMPTS[idFinal](hechos);

        // 2. CONEXIÓN A GROK CON ANCLA DE IDENTIDAD DOBLE
        const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-3", 
                messages: [
                    { role: "system", content: PERSONA },
                    { 
                        role: "system", 
                        content: `ESTÁS ANALIZANDO EL SITIO: ${dna}. 
                        REGLA MÁXIMA: Prohibido inventar. Si el sitio es de servicios médicos, no hables de e-commerce. 
                        Este es el único contexto real:\n${hechos}` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 // Punto exacto entre rigor de datos e intuición de negocios
            })
        });

        // Manejo de errores de conexión con la API
        if (!xRes.ok) {
            const errData = await xRes.json();
            throw new Error(`Error de xAI: ${errData.error?.message || xRes.statusText}`);
        }

        const xData = await xRes.json();
        
        if (xData.choices && xData.choices[0].message) {
            return res.json({ content: xData.choices[0].message.content });
        }
        
        throw new Error("Grok devolvió una respuesta vacía.");

    } catch (error) {
        console.error("ERROR CRÍTICO:", error.message);
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});

// Inicio de Servidor
app.listen(port, () => {
    console.log(`PredictaCore v105.0 [Executive Engine] online en puerto ${port}`);
});
