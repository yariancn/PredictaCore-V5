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
                content: `SÉ MI ESPEJO: Analiza ${dna} como un Perito Judicial de Rentabilidad.
                
                1. BÚSQUEDA DE OBSTÁCULOS: Tu prioridad es hallar lo que DETIENE la venta. Si no hay tallas, materiales, medidas o el botón de compra no es obvio, denúncialo como 'Herida Grave'.
                2. CERO POESÍA: Prohibido usar metáforas. No hables de 'abrazos' o 'refugios'. Habla de 'Fricción', 'Duda' y 'Abandono'.
                3. RIGOR DE DATOS: No inventes dinero. Habla de 'Probabilidad de Rebote' e 'Impacto en Confianza'.
                4. INFERENCIA ESTRUCTURAL: Si el texto es desordenado, sentencia 'Caos Visual'. Si el botón está tras mucho texto, sentencia 'Botón Enterrado'.
                5. DENSIDAD: 3 a 5 líneas por punto. Directo, seco y útil para un dueño de negocio.` 
            },
            { role: "user", content: promptFinal }
        ],
        temperature: 0.1 // RIGOR TOTAL PARA EVITAR ALUCINACIONES
    })
});
