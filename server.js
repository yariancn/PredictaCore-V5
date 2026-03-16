app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];
        if (!PROMPTS[etapaId]) throw new Error(`Etapa '${etapaId}' no configurada.`);

        const result = await captureAndScrape(dna);
        const expedienteForense = auditoriaContexto[dna].join("\n");
        const promptFinal = PROMPTS[etapaId](result.texto, expedienteForense);

        const request = {
            contents: [{
                role: 'user',
                parts: [{ text: `${PERSONA}\n\nEXPEDIENTE ACUMULADO:\n${expedienteForense}\n\nORDEN ACTUAL:\n${promptFinal}` }]
            }]
        };

        if (result.screenshot) {
            request.contents[0].parts.push({ inlineData: { mimeType: 'image/png', data: result.screenshot } });
        }

        // LÓGICA ANTI-SATURACIÓN (429)
        let response;
        let intentos = 0;
        while (intentos < 3) {
            try {
                const geminiRes = await model.generateContent(request);
                response = await geminiRes.response;
                break; 
            } catch (e) {
                if (e.message.includes('429') || e.message.includes('exhausted')) {
                    intentos++;
                    await new Promise(r => setTimeout(r, 4000)); // Espera 4 seg antes de reintentar
                } else { throw e; }
            }
        }

        const content = response.candidates[0].content.parts[0].text.trim();
        auditoriaContexto[dna].push(`- [${etapaId.toUpperCase()}]: ${content.substring(0, 400)}`);
        return res.json({ content });

    } catch (error) {
        res.status(500).json({ content: `[ERROR TITÁN]: ${error.message}` });
    }
});
