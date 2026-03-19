const RAZONAMIENTOS = {
    // PUNTO I: SENTENCIA DE NEGOCIO
    intro: (dna, h, today) => `FECHA: ${today}. ACTIVO: ${dna}. 
    Analiza el sitio como si fueras el socio del dueño. Dictamina la salud del negocio enfocándote en la Confianza, la Facilidad de Compra y la Seguridad Técnica. Explica dónde están los bloqueos que impiden que el dinero fluya. 
    REGLA: Escribe 3 párrafos de prosa clara y profesional. Sé directo pero siempre respetuoso con el trabajo del cliente.`,

    // PUNTO II: QUIÉN ES TU CLIENTE (ORGÁNICO)
    gemelos: (dna, h, today) => `CRÓNICA DE ABANDONO (4 PERFILES) AL ${today}.
    Describe a 4 personas reales que entrarían a este sitio. Cuéntame en 3 o 4 líneas quiénes son, cómo se sienten hoy (cansados, emocionados, con prisa) y qué es lo que más les urge comprar. 
    REGLA: Usa lenguaje natural. No menciones fallas del sitio aquí, solo retrata al ser humano.`,
    
    // PUNTO IX: PLAN DE RESCATE (15 ÓRDENES)
    acciones: (dna, h, today) => `15 ACCIONES PARA RESCATAR VENTAS AL ${today}.
    Entrega 15 instrucciones sencillas para mejorar el sitio. Enfócate en la navegación, la visibilidad de los botones (que nada estorbe) y la claridad de las ofertas. 
    REGLA: Usa la lógica "SI pasa esto... ENTONCES haz aquello". Usa un lenguaje que un emprendedor pueda entender y ejecutar mañana mismo.`,

    // ... los demás puntos se mantienen con esta misma tónica de lenguaje sencillo y directo ...
    scorecard: (dna, h, today) => `TABLA DE SALUD DEL NEGOCIO AL ${today}. Explica el impacto en dinero de cada punto de forma sencilla.`,
    omni: (dna, h, today) => `HOJA DE RUTA DE 21 DÍAS. Un cierre motivador con los pasos exactos para que el negocio despegue.`
};

module.exports = { PERSONA: "", PROMPTS: RAZONAMIENTOS }; // La PERSONA ya está en System Instructions
