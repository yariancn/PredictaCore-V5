// ... (mismos imports)
app.post('/diseccion', async (req, res) => {
    // ... (lógica de scraping)
    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
        // ... (headers)
        body: JSON.stringify({
            model: "grok-3", 
            messages: [
                { role: "system", content: PERSONA },
                { 
                    role: "system", 
                    content: `INSTRUCCIÓN DE ALTA GAMA: 
                    - Prohibido empezar con "Bajo la ley de..." o lenguaje de profesor. 
                    - Sé un socio pragmático. Habla de tú a tú al emprendedor.
                    - Si no ves un dato técnico (tallas, materiales, peso), denúncialo como el error #1.
                    - No inventes imágenes; audita la falta de descripción visual.
                    - 15 puntos únicos (3-5 líneas). Brutal, denso, útil.` 
                },
                { role: "user", content: promptFinal }
            ],
            temperature: 0.1 
        })
    });
    // ...
});
