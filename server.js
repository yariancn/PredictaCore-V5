// ... (imports igual)
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' inválida.` });

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Sábado, 14 de Marzo de 2026";

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
                        content: `AUDITORÍA CRÍTICA: ${dna}. FECHA: ${fechaActual}.
                        MANDATO DE CALIDAD: Evita la palabrería genérica. Ve directo a la herida económica. 
                        REGLA DE LOS GEMELOS: Tu reporte es el resultado de 9,000 simulaciones. Habla con esa autoridad.
                        VERACIDAD: Si el texto menciona Pagos o Envíos, no digas que faltan; acusa su INVISIBILIDAD. 
                        ESTRUCTURA: Un punto por párrafo. 3 a 5 líneas de pura carne forense.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // EL FILTRO DEL MAGO: Limpia la paja
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar de PredictaCore.");

    } catch (error) {
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});
// ...                        MANDATO DE ESTILO: Un párrafo por punto, seco, denso, sin amabilidades. 15 fugas obligatorias de 3 a 5 líneas.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 // MÁXIMO RIGOR ANALÍTICO. Cero creatividad, pura evidencia.
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            
            // FILTRO DE BASURA CONVERSACIONAL
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            
            return res.json({ content: content });
        }
        throw new Error("Grok no alcanzó el estándar forense.");

    } catch (error) {
        console.error("Falla en Servidor:", error.message);
        res.status(500).json({ content: `[FALLA CRÍTICA]: ${error.message}` });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(port, () => console.log(`PredictaCore v141.0 Iron Sovereignty Online.`));
