// ... (imports igual)
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
                    content: `SÉ MI ESPEJO: Analiza ${dna} como lo haría un consultor de $1,000 USD. 
                    - Si no conoces el dinero del cliente, NO inventes cifras. Habla de impacto y riesgo.
                    - Desprecia lo técnico (nombres de archivos, alt-text). Busca la ESENCIA.
                    - Cada punto de las fugas debe ser un 'Aja!' para el dueño. 
                    - Un párrafo por punto (3-5 líneas). Brutal, seco, forense.` 
                },
                { role: "user", content: promptFinal }
            ],
            temperature: 0.1 
        })
    });
    // ...
});
