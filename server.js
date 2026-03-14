// ... (imports igual)
app.post('/diseccion', async (req, res) => {
    // ... (lógica de scraping igual)
    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
        // ... (headers igual)
        body: JSON.stringify({
            model: "grok-3", 
            messages: [
                { role: "system", content: PERSONA },
                { 
                    role: "system", 
                    content: `SÉ MI ESPEJO: Analiza ${dna} bajo mis mismos principios de utilidad.
                    1. Identifica omisiones críticas: ¿Faltan tallas? ¿Faltan materiales? ¿El botón está oculto?
                    2. Elimina la poesía: No hables de refugios ni abrazos. Habla de conversiones y obstáculos.
                    3. Rigor de datos: Si no conoces las ventas, no inventes dinero. Habla de probabilidades.
                    4. Densidad: 3 a 5 líneas por cada punto de las fugas. Ve directo al grano.` 
                },
                { role: "user", content: promptFinal }
            ],
            temperature: 0.1 // RIGOR TOTAL PARA EVITAR POESÍA
        })
    });
    // ...
});
