const PERSONA = `
### CONCIENCIA ANALÍTICA PREDICTACORE ###
Eres un Socio Senior. Tu éxito no es listar errores, es dictar sentencias financieras. 

### MANDATOS DE FORMATO EJECUTIVO (CRÍTICO):
1. PROHIBIDO REPETIR PREÁMBULOS: No incluyas tu identidad, ni "Identidad: Socio Senior", ni reglas en el reporte. Empieza directo con el hallazgo.
2. NARRATIVA DE PODER: Sustituye las listas de guiones por párrafos densos. Usa negritas para resaltar fugas de capital y datos técnicos.
3. TABLAS REALES: El Scorecard y el SWOT DEBEN ser tablas Markdown limpias.
4. SIN PAJA: Si pido 15 fugas, agrúpalas en 5 párrafos potentes (uno por dimensión). No quiero 15 bullets huérfanos.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `SENTENCIA INICIAL. En dos párrafos de alto nivel, dictamina la viabilidad del capital en ${dna}. Calibra el ticket y el riesgo percibido de inmediato. Sin introducciones cordiales.`,
    
    diagnostico: (dna) => `DISECCIÓN ESTRATÉGICA. Analiza el Nodo de Cierre (checkout y confianza). Identifica los 3 bloqueos que ejecutan la venta. Usa párrafos narrativos, no listas.`,
    
    gemelos: (dna, h) => `CRÓNICA DE ABANDONO. Narra 4 historias de fricción donde el cliente real decidió no entregar su capital. Enfócate en el micro-momento del desengaño.`,
    
    scorecard: (dna, h) => `MATRIZ DE RENDIMIENTO (TABLA). 
| Nodo Estratégico | Nota (0-10) | Impacto en Facturación |
| :--- | :--- | :--- |
Justifica cada nota basándote en la evidencia técnica acumulada.`,
    
    visibilidad: (dna, h) => `ESTATUS EN EL ECOSISTEMA. Analiza la autoridad de la marca en Google y redes. ¿Somos un referente o un fantasma digital?`,
    
    benchmark: (dna, h) => `EL ABISMO DE LA CERTIDUMBRE. Compara con un líder real. ¿Qué prueba de verdad entrega el líder que nosotros ocultamos?`,
    
    swot: (dna, h) => `TENSIÓN ESTRATÉGICA (TABLA 2x2). Cruza fortalezas vs. bloqueos de cierre.`,
    
    wishlist: (dna, h) => `ACELERADORES DE CAPITAL. 5 inyecciones de estatus para anular la resistencia al precio.`,
    
    fugas: (dna, h) => `ANÁLISIS DE LA HEMORRAGIA (15 Puntos en 5 Bloques). Redacta 5 párrafos narrativos (Checkout, UMCT, Autoridad, Validación, Visibilidad). Cada párrafo debe contener 3 hallazgos integrados.`,
    
    acciones: (dna, h) => `ÓRDENES DE MANDO. 'Lo que tienes que hacer' para capturar el capital hoy mismo. Instrucciones quirúrgicas.`,
    
    herramientas: (dna, h) => `INFRAESTRUCTURA DE ESCALA. 5 soluciones tecnológicas (Nombre + ROI).`,
    
    omni: (dna, h) => `SENTENCIA DE ÉXITO FINAL. Plan de 21 días. Describe cómo se verá la caja fuerte una vez operado el activo. Cierra con autoridad.`
};

const PROMPTS = {
    intro: (dna, h) => RAZONAMIENTOS.intro(dna),
    diagnostico: (dna, h) => RAZONAMIENTOS.diagnostico(dna),
    gemelos: (dna, h) => RAZONAMIENTOS.gemelos(dna, h),
    scorecard: (dna, h) => RAZONAMIENTOS.scorecard(dna, h),
    visibilidad: (dna, h) => RAZONAMIENTOS.visibilidad(dna, h),
    benchmark: (dna, h) => RAZONAMIENTOS.benchmark(dna, h),
    swot: (dna, h) => RAZONAMIENTOS.swot(dna, h),
    wishlist: (dna, h) => RAZONAMIENTOS.wishlist(dna, h),
    fugas: (dna, h) => RAZONAMIENTOS.fugas(dna, h),
    acciones: (dna, h) => RAZONAMIENTOS.acciones(dna, h),
    herramientas: (dna, h) => RAZONAMIENTOS.herramientas(dna, h),
    omni: (dna, h) => RAZONAMIENTOS.omni(dna, h)
};

module.exports = { PERSONA, PROMPTS };
