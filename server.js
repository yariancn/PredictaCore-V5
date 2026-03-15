const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

// 1. CONFIGURACIÓN DE IDENTIDAD GOOGLE (USANDO TU VARIABLE DE RAILWAY)
let model;
try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDS);
    const vertex_ai = new VertexAI({
        project: 'predictacore', // Tu Project ID confirmado
        location: 'us-central1',
        googleAuthOptions: { credentials }
    });

    model = vertex_ai.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: { 
            temperature: 0.1,
            maxOutputTokens: 8192 
        }
    });
} catch (e) {
    console.error("Error cargando credenciales de Google:", e.message);
}

// 2. RUTA DE DISECCIÓN MULTIMODAL
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;

    try {
        if (!PROMPTS[etapaId]) {
            return res.status(400).json({ content: "Etapa no válida." });
        }

        // EL TITÁN TRABAJA: Captura imagen y extrae texto simultáneamente
        const { screenshot, texto } = await captureAndScrape(dna);
        const promptFinal = PROMPTS[etapaId](texto);

        // CONFIGURACIÓN DE LA LLAMADA A GEMINI (Ojos + Cerebro)
        const request = {
            contents: [{
                role: 'user',
                parts: [
                    { text: `${PERSONA}\n\nAUDITORÍA SOBRE: ${dna}\n\n${promptFinal}` },
                    { inlineData: { mimeType: 'image/png', data: screenshot } }
                ]
            }]
        };

        const result = await model.generateContent(request);
        const response = await result.response;
        let content = response.candidates[0].content.parts[0].text;

        // Limpieza de cortesía de IA
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido|Excelente|Perfecto).*/gi, '').trim();

        return res.json({ content: content });

    } catch (error) {
        console.error("Falla en el motor Titán:", error.message);
        res.status(500).json({ content: `[ERROR CRÍTICO]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));

app.listen(port, () => {
    console.log(`PredictaCore v152.0 Visionary Online en puerto ${port}`);
});                role: 'user',
                parts: [
                    { text: `${PERSONA}\n\nAUDITORÍA: ${dna}\n\n${promptFinal}` },
                    { inlineData: { mimeType: 'image/png', data: screenshot } }
                ]
            }]
        };

        const result = await model.generateContent(request);
        const response = await result.response;
        let content = response.candidates[0].content.parts[0].text;

        // Limpieza de paja de IA
        content = content.replace(/^(Claro|Analizando|Aquí tienes|Entendido).*/gi, '').trim();

        return res.json({ content });

    } catch (error) {
        console.error("Falla Crítica:", error.message);
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v152.0 Visionary Online.`));                        role: "system", 
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
