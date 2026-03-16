// ... (mismos imports y credenciales)

let auditoriaContexto = {};

app.post('/diseccion', async (req, res) => {
    const { dna } = req.body;
    const etapaId = (req.body.etapaId || "").toLowerCase();
    
    try {
        // Inicialización y limpieza de memoria por sesión
        if (etapaId === 'intro' || !auditoriaContexto[dna]) auditoriaContexto[dna] = [];

        const result = await captureAndScrape(dna);
        
        // El historial ahora es el "EXPEDIENTE FORENSE"
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

        const geminiRes = await model.generateContent(request);
        const response = await geminiRes.response;
        const content = response.candidates[0].content.parts[0].text.trim();

        // Guardamos el veredicto para que la siguiente etapa construya sobre él
        auditoriaContexto[dna].push(`[DICTAMEN ${etapaId.toUpperCase()}]: ${content.substring(0, 1000)}`);

        return res.json({ content });
    } catch (error) {
        res.status(500).json({ content: `[FALLA DE SISTEMA]: El Titán requiere un momento para procesar la magnitud del activo. Reintenta en 3 segundos.` });
    }
});
