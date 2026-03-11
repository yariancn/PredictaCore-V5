// ... (mismo inicio de Express)

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    const { XAI_API_KEY } = process.env;

    try {
        const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
        const deepData = await scrapeDeep(dna);
        const hechos = deepData.text.substring(0, 15000); // Ampliamos visión a 15k

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
                    { role: "system", content: `EL NEGOCIO QUE ANALIZAS ES: ${dna}. OLVIDA TODO LO DEMÁS. Solo existe este contexto: ${hechos}` },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.3 // El punto justo entre rigor e intuición
            })
        });

        // ... (resto de la lógica de respuesta)
