// ... (inicio igual)
    try {
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' inválida.`);

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
                        MANDATO DE VERACIDAD: Si el texto menciona 'Envío gratis', 'PayPal' o 'Chat', PROHIBIDO decir que no están. 
                        Si son difíciles de hallar, acusa 'Opacidad de Diseño'. 
                        REGLA DE LAS 15 FUGAS: Obligatorio 3 a 5 líneas por punto. 
                        No seas un asistente amigable, sé un PERITO FORENSE.` 
                    },
                    { role: "user", content: promptFinal }
                ],
                temperature: 0.2 // Rigor absoluto para evitar 'cuentos'
            })
        });
// ... (limpieza final igual)
