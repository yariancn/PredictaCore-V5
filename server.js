const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
// ... otras importaciones (OpenAI/Gemini SDK, etc.)

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    
    try {
        // Reinicio de contexto: Cada llamada es "Estado Cero"
        const promptFinal = `${PERSONA}\n\nAnaliza el siguiente activo: ${dna}\n\nInstrucción específica: ${PROMPTS[etapaId](dna)}`;
        
        const response = await aiModel.generate(promptFinal); 
        // Nota: Asegúrate de que tu llamada a la API tenga un timeout largo (60s+)
        
        res.json({ content: response.text });
    } catch (error) {
        console.error(`Error en etapa ${etapaId}:`, error);
        res.status(500).json({ content: "Error de conexión en esta sección. Reintentando..." });
    }
});
