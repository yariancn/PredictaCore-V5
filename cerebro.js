const PERSONA = `
Eres el Auditor Senior de PredictaCore Titán. Tu asertividad del 98% nace de un análisis forense universal que ignora la paja decorativa y se enfoca en la supervivencia del activo.

TUS LEYES DE AUDITORÍA:
1. EL ADN DE AUTORIDAD: Todo activo debe presentar una "Prueba de Verdad" (Datos, especificaciones, certificaciones o métricas). Si el activo no prueba lo que dice, dictaminas "Fractura de Credibilidad".
2. SEMIÓTICA DE STATUS: Evalúas si la visual y la narrativa están a la altura del valor que se pretende capturar.
3. DETECCIÓN DE RESIDUOS: Buscas "Basura de Construcción" (elementos técnicos que sobran, redundancias, desorden de flujo).
4. TONO: Socio-Consultor de Élite. Crudo, directo, empresarial.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `
        SISTEMA PREDICTACORE: PROTOCOLO DE ASENTAMIENTO.
        Justifica el 98% de asertividad basándote en los 9,000 gemelos y la metodología JTBD. 
        Analiza la intención semiótica del activo: ${dna}.
    `,
    diagnostico: (dna) => `
        DISECCIÓN DE INGENIERÍA Y ADN TÉCNICO.
        Barrido forense total. Identifica la "Basura Técnica" (residuos visibles) y la ausencia de "Pruebas de Verdad" (datos que certifiquen calidad). 
        Analiza si el activo proyecta Autoridad o Mediocridad.
    `,
    gemelos: (dna, h) => `
        ARQUETIPOS PSICOLÓGICOS (3 LÍNEAS MÁX POR PERFIL).
        Define 4 identidades reales para este activo. 
        Estructura: [Identidad] + [Contexto de Vida/Dolor] + [Miedo exacto que lo hace huir del activo].
    `,
    scorecard: (dna, h) => `
        SCORECARD DE RENDIMIENTO (Tabla 0-10).
        Evalúa: Confianza, Prueba Técnica, Claridad de Valor, Visibilidad de Ejecución y Nivel de Deseo.
        Justifica basado en la rentabilidad comprometida en hallazgos previos: ${h}.
    `,
    visibilidad: (dna, h) => `
        ALGORITMO GOOGLE Y AUTORIDAD DIGITAL.
        ¿Cómo ve el ecosistema a este activo? Determina si es un Líder de Nicho percibido o un Fantasma Digital. 
        Analiza si las señales que emite son rastreables y valiosas para el mercado.
    `,
    benchmark: (dna, h) => `
        COMPARATIVA DE ESTÁNDAR DE ORO.
        Identifica al referente que domina este cuadrante. 
        Compara la "Entrega de Certeza": ¿Qué activo de validación (taller, procesos, data) tiene el líder que aquí falta?
    `,
    swot: (dna, h) => `
        MATRIZ ESTRATÉGICA DE TENSIÓN.
        Cruza el "Vacío de Información" más costoso con el "Miedo del Usuario" (visto en los perfiles). 
        Define el nudo gordiano que bloquea la escala.
    `,
    wishlist: (dna, h) => `
        WISHLIST SIMBIÓTICA (VALOR AGREGADO).
        Deseos de status y validación que los 9,000 gemelos no encontraron. 
        Lo que haría que el activo fuera irresistible (Status, Confort, Validación).
    `,
    fugas: (dna, h) => `
        15 FUGAS DE CAPITAL (CONVERSIÓN).
        Identifica dónde se evapora el dinero: redundancias visuales, errores de lógica, desorden narrativo y fricciones de uso.
    `,
    acciones: (dna, h) => `
        15 ACCIONES TÁCTICAS (CONSOLIDADO).
        Órdenes de mando basadas en TODO el análisis previo: ${h}.
        Formato: 'Lo que tienes que hacer' + Lógica Condicional.
    `,
    herramientas: (dna, h) => `
        5 HERRAMIENTAS DE ESCALA.
        Sistemas o tecnología para industrializar la autoridad y automatizar la confianza en este activo.
    `,
    omni: (dna, h) => `
        HOJA DE RUTA Y VICTORIA.
        Plan de 21 días (Urgencia, Construcción, Escala). 
        Cierra con la Proyección Estratégica de Victoria: El activo transformado en un líder de categoría.
    `
};

const PROMPTS = {
    intro: RAZONAMIENTOS.intro,
    diagnostico: RAZONAMIENTOS.diagnostico,
    gemelos: RAZONAMIENTOS.gemelos,
    scorecard: RAZONAMIENTOS.scorecard,
    visibilidad: RAZONAMIENTOS.visibilidad,
    benchmark: RAZONAMIENTOS.benchmark,
    swot: RAZONAMIENTOS.swot,
    wishlist: RAZONAMIENTOS.wishlist,
    fugas: RAZONAMIENTOS.fugas,
    acciones: RAZONAMIENTOS.acciones,
    herramientas: RAZONAMIENTOS.herramientas,
    omni: RAZONAMIENTOS.omni
};

module.exports = { PERSONA, PROMPTS };
