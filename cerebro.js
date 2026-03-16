const PERSONA = `
Eres la Conciencia Analítica de PredictaCore Titán. No eres un asistente, eres un Socio Auditor Senior. 
Tu visión es Forense y Semiótica. Tu objetivo es detectar por qué un Activo (Web, Idea, Perfil) no está capturando el capital que merece.

TUS LEYES DE ANÁLISIS:
1. ARQUITECTURA DE AUTORIDAD: ¿El Activo proyecta el estatus que cobra? Si hay disonancia entre el nombre/precio y la visual, dictaminas "Fractura de Credibilidad".
2. VALIDACIÓN TÉCNICA: Buscas pruebas de verdad (datos, certificaciones, lógica, materiales). Lo que no se prueba visual o textualmente, no existe para el cliente.
3. DETECCIÓN DE RESIDUOS: Escaneas basura técnica (botones fantasma, redundancia, desorden narrativo).
4. TONO: Crudo, empresarial, directo. Formato táctico: 'Lo que tienes que hacer'.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `PROTOCOLO PREDICTACORE. Justifica el 98% de asertividad (9k gemelos). Analiza la intención semiótica inicial de: ${dna}.`,
    
    diagnostico: (dna) => `DISECCIÓN DE INGENIERÍA. Realiza un barrido visual y técnico. Detecta "Residuos de Construcción" y la ausencia de "Pruebas de Verdad" que validen el activo.`,
    
    gemelos: (dna, h) => `ARQUETIPOS PSICOLÓGICOS (3 líneas máx). Genera 4 identidades reales bajo tensión. Define su miedo exacto al interactuar con ${dna}.`,
    
    scorecard: (dna, h) => `SCORECARD DE RENDIMIENTO. Tabla 0-10. Evalúa: Confianza, Densidad Técnica, Propuesta, Ejecución y Deseo. Justifica basado en el historial: ${h}`,
    
    visibilidad: (dna, h) => `AUTORIDAD EN EL ECOSISTEMA. ¿Cómo percibe un algoritmo este activo? ¿Es un líder de nicho o un commodity invisible?`,
    
    benchmark: (dna, h) => `COMPARATIVA DE ESTÁNDAR DE ORO. Compara contra el referente que domina este mercado. ¿Qué certeza entrega el líder que aquí falta?`,
    
    swot: (dna, h) => `MATRIZ ESTRATÉGICA (SWOT). Cruza el Vacío Informativo más caro con el Miedo del Usuario definido en el historial.`,
    
    wishlist: (dna, h) => `WISHLIST SIMBIÓTICA. Deseos de los 9,000 gemelos para sentir deseo absoluto (Estatus, Confort, Validación).`,
    
    fugas: (dna, h) => `15 FUGAS DE CAPITAL. Analiza redundancias, errores de lógica y disonancias de estatus. Cada punto es dinero perdido.`,
    
    acciones: (dna, h) => `15 ACCIONES TÁCTICAS. Órdenes de mando basadas en TODO el análisis acumulado: ${h}. Formato: 'Lo que tienes que hacer' + Lógica Condicional.`,
    
    herramientas: (dna, h) => `5 HERRAMIENTAS DE ESCALA. Tecnología o procesos para industrializar la autoridad de este activo específico.`,
    
    omni: (dna, h) => `HOJA DE RUTA Y VICTORIA. Plan de 21 días. Cierra con la visión del activo transformado tras la cirugía Titán.`
};

// MAPEO ROBUSTO: Vincular nombres del frente con funciones del cerebro
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
    omni: (dna, h) => RAZONAMIENTOS.omni(dna, h),
    // Soporte para nombres numéricos si el frontend los usa
    etapa1: (dna, h) => RAZONAMIENTOS.intro(dna),
    etapa2: (dna, h) => RAZONAMIENTOS.diagnostico(dna)
};

module.exports = { PERSONA, PROMPTS };
