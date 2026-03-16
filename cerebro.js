const PERSONA = `
Eres el Auditor Senior de PredictaCore Titán. Tu mente opera bajo los principios de la Auditoría Forense, la Semiótica Visual y la metodología JTBD.
Tu asertividad del 98% es el estándar de oro. No resumes; diseccionas. No comentas; dictaminas.

PRINCIPIOS INAMOVIBLES:
1. EL VALIDADOR DE VALOR: Entiendes que cada nicho tiene un "ADN de Autoridad". En un activo de lujo, buscas certificaciones y origen; en uno de servicios, buscas casos de éxito y licencias. Identificas qué falta para que el precio se sienta barato para el cliente.
2. AUDITORÍA DE BASURA TÉCNICA: Escaneas elementos que ensucian la experiencia (códigos visibles, botones que se enciman, enlaces técnicos fuera de lugar) y los traduces en pérdida de confianza.
3. PSICOLOGÍA DEL GEMELO: Los perfiles son identidades vivas. 3 líneas máximo. Nombre, contexto de dolor y el miedo técnico que lo hace abandonar el sitio.
4. LENGUAJE DE ALTA GAMA: Tono de consultoría internacional pero con instrucciones "a pie de calle". Directo, crudo y altamente ejecutable.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `
        PROTOCOLO PREDICTACORE: ASENTAMIENTO DE AUTORIDAD.
        Explica la infraestructura Titán: Simulación masiva de 9,000 Gemelos Sintéticos para el activo: ${dna}.
        Justifica el 98% de asertividad: Por qué la disección de fricción psicológica en milisegundos es superior a cualquier estudio de mercado.
    `,
    diagnostico: (dna) => `
        DISECCIÓN DE INGENIERÍA Y ADN TÉCNICO.
        Barrido visual forense: Detecta "Basura Técnica" y falta de "Prueba de Autoridad" (datos que validen la promesa de valor). 
        Identifica la Disonancia de Status: ¿El precio y el nombre del activo están respaldados por lo que el ojo ve?
    `,
    perfiles: (dna) => `
        ARQUETIPOS DE GEMELOS SINTÉTICOS.
        Genera 4 perfiles psicológicos. Máximo 3 líneas por perfil. 
        Formato: [Identidad] + [Contexto de Vida] + [Miedo técnico que lo detiene en este activo].
    `,
    scorecard: (dna) => `
        SCORECARD DE RENDIMIENTO (Tabla 0-10).
        Evalúa: Confianza, Prueba Técnica, Claridad de Oferta, Visibilidad de Acción y Antojo.
        Sin preámbulos, justifica el impacto económico de cada nota.
    `,
    visibilidad: (dna) => `
        AUTORIDAD DIGITAL (ALGORITMO GOOGLE).
        Analiza cómo Google rastrea el activo. ¿Es una autoridad o un "fantasma"? 
        Detecta si el contenido técnico es suficiente para que el algoritmo lo posicione como líder de nicho.
    `,
    benchmark: (dna) => `
        COMPARATIVA DE LÍDER DE CUADRANTE.
        Identifica al competidor real que domina la autoridad en esta escala. 
        Compara la "Entrega de Prueba Técnica": ¿Qué hace el líder para que el cliente no dude y que este activo aún no ha resuelto?
    `,
    swot: (dna) => `
        MATRIZ ESTRATÉGICA DE TENSIÓN.
        Cruza el "Vacío Informativo" más costoso con el "Miedo Primario" del Gemelo. 
        Define el nudo gordiano que bloquea la escala de ${dna}.
    `,
    wishlist: (dna) => `
        WISHLIST SIMBIÓTICA (VALOR AGREGADO).
        Lo que los 9,000 gemelos desearían encontrar para sentir un deseo irresistible. 
        Deseos de status, comodidad y certeza absoluta.
    `,
    fugas: (dna) => `
        15 FUGAS DE CAPITAL (MÉTRICA DE CONVERSIÓN).
        Analiza errores de lógica, redundancia, "Fricción de Pulgar" (móvil) y botones invisibles. 
        Cada hallazgo debe ser un drenaje financiero.
    `,
    acciones: (dna) => `
        15 ACCIONES TÁCTICAS DE EJECUCIÓN.
        Consolida los hallazgos en mandos directos. 
        Formato: 'Lo que tienes que hacer' + lógica condicional (Si pasa A, haz B para ganar C).
    `,
    herramientas: (dna) => `
        5 HERRAMIENTAS DE ESCALA.
        Tecnología o sistemas para industrializar la autoridad y automatizar la confianza.
    `,
    omni: (dna) => `
        HOJA DE RUTA Y PROYECCIÓN DE VICTORIA.
        Plan de 21 días (Urgencia, Autoridad, Escala). 
        Sentencia Final: Visión estratégica de éxito si se aplica esta ingeniería hoy.
    `
};

const PROMPTS = {
    intro: RAZONAMIENTOS.intro,
    diagnostico: RAZONAMIENTOS.diagnostico,
    gemelos: RAZONAMIENTOS.perfiles,
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
