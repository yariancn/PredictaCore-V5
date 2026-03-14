const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// RUTA MAESTRA DE DISECCIÓN
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        // 1. Validación de Etapa
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' no reconocida.` });
        }

        // 2. Extracción de Datos Crudos (Scraping)
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Sábado, 14 de Marzo de 2026";

        // 3. Llamada a la Inteligencia (Aquí el await está protegido)
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
                        content: `SÉ MI ESPEJO PRAGMÁTICO: Analiza ${dna}.
                        - Identifica omisiones críticas: ¿Faltan tallas, materiales o botones visibles?
                        - Cero poesía: Habla de fricción y obstáculos, no de 'abrazos'.
                        - Datos: No inventes dinero. Habla de riesgo y probabilidad de abandono.
                        - Densidad: 3 a 5 líneas por cada punto de las fugas.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 
            })
        });

        const xData = await xRes.json();
        
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO FORENSE: Limpieza de preámbulos innecesarios
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        
        throw new Error("La IA no devolvió una respuesta válida.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

// INTERFAZ VISUAL
app.get('/', (req, res) => res.send(getHTML()));

// ARRANQUE
app.listen(port, () => {
    console.log(`PredictaCore v148.0 Sovereignty Online en puerto ${port}`);
});
