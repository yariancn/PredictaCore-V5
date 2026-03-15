const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// RUTA MAESTRA: DISECCIÓN PREDICTACORE v151.0
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });

        // 1. Scraping del ADN del sitio
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Domingo, 15 de Marzo de 2026";

        // 2. Llamada al motor de Grok con el "Espejo de Criterio"
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
                        content: `AUDITORÍA DE ÉLITE: Analiza ${dna}. 
                        - No eres un redactor, eres un PERITO judicial de rentabilidad.
                        - Prohibido el lenguaje de profesor ("Bajo la ley de..."). Habla de tú a tú al dueño.
                        - No inventes imágenes: si el texto no describe el material o tamaño, castiga la 'Ceguera Informativa'.
                        - 15 puntos únicos de 3 a 5 líneas. Ve directo a la herida económica.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // Frío y preciso, sin alucinaciones.
            })
        });

        const xData = await xRes.json();
        
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // Limpieza de cortesía de IA
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        
        throw new Error("Grok no devolvió una respuesta válida.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

// INTERFAZ VISUAL
app.get('/', (req, res) => res.send(getHTML()));

// ARRANQUE DEL SISTEMA
app.listen(port, () => {
    console.log(`PredictaCore v151.0 Truth Seeker Online en puerto ${port}`);
});
