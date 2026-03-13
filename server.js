// ... (imports igual)

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        if (!PROMPTS[etapaId]) return res.status(400).json({ content: `[ERROR]: Etapa '${etapaId}' inválida.` });

        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); 
        const promptFinal = PROMPTS[etapaId](hechos);
        const fechaActual = "Viernes, 13 de Marzo de 2026";

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
                        content: `HOY ES: ${fechaActual}. ANALIZA: ${dna}.
                        MANDATO DE ORO MOLIDO: Analiza la 'presentación' a través de los metadatos de las imágenes y la jerarquía de los links. 
                        REGLA DE HIERRO: Si el dueño dice que los envíos están en el banner, búscalos en el texto de cabecera. No mientas. 
                        ESTRUCTURA: Un párrafo por hallazgo. Sin introducciones. Sé un perito de alta gama, seco y denso.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok falló el estándar de oro molido.");
    } catch (error) {
        res.status(500).json({ content: `[FALLA FORENSE]: ${error.message}` });
    }
});

// ...
