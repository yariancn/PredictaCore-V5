// ... (imports y configuración igual)
app.post('/diseccion', async (req, res) => {
    // ... (lógica de scraping igual)
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
                    content: `SÉ MI ESPEJO: Analiza ${dna} bajo mis leyes de pensamiento forense. 
                    No busques errores de código; busca errores de NEGOCIO. 
                    ¿Qué información falta para que yo, como cliente, confíe y pague? 
                    Sé brutalmente directo, denso y útil. 15 hallazgos únicos.` 
                },
                { role: "user", content: promptFinal }
            ],
            temperature: 0.1 
        })
    });
    // ...
});
