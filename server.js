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
                        content: `AUDITORÍA CRÍTICA: ${dna}. FECHA: ${fechaActual}.
                        MANDATO JUDICIAL: El dueño afirma que los activos críticos (Envíos, Chat, PayPal) son visibles. 
                        REGLA DE VERDAD: Busca en las primeras 50 líneas del texto. Si están ahí, NO digas que faltan; acusa su 'Fuga de Jerarquía Visual'.
                        REGLA DE HIERRO: Cada hallazgo debe ser ÚNICO. Si repites, el reporte pierde su valor de $1,000 USD. 
                        Sé un perito agresivo, seco y táctico.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.1 
            })
        });

        const xData = await xRes.json();
        if (xData.choices && xData.choices[0].message) {
            let content = xData.choices[0].message.content;
            // FILTRO DE BASURA: Dejamos solo la sentencia
            content = content.replace(/^(Claro|Aquí tienes|Entendido|Analizando|Vamos a|Perfecto|Directo|Excelente|En este reporte).*/gi, '').trim();
            return res.json({ content: content });
        }
        throw new Error("Grok falló el estándar de oro.");
    } catch (error) {
        res.status(500).json({ content: `[FALLA FORENSE]: ${error.message}` });
    }
});
// ...
