app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        
        // LLAMADA AL NUEVO MOTOR DE EXPLORACIÓN
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text;

        const promptFinal = PROMPTS[idFinal](hechos);

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
                    { role: "system", content: `FECHA ACTUAL: ${new Date().toISOString()}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2 // Rigor forense
            })
        });

        const xData = await xRes.json();
        if (xData.choices) {
            return res.json({ content: xData.choices[0].message.content });
        }
        throw new Error("Grok no devolvió datos.");

    } catch (error) {
        res.status(500).json({ content: `[ERROR]: ${error.message}` });
    }
});
