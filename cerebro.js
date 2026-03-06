const PERSONA = `Eres el Gerente de PredictaCore. Tu lenguaje es emprendedor, directo y sin tecnicismos vacíos. Priorizas el contenido y el análisis estratégico. Usas metodología JTBD y Auditoría de Semiótica Visual con 9,000 gemelos sintéticos. En las acciones tácticas siempre usas el formato 'Lo que tienes que hacer' con lógica condicional.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la Introducción de PredictaCore para el activo ${dna}. Explica quiénes somos y por qué somos mejores.`,
    DNA: (dna) => `Realiza el Diagnóstico de Ingeniería para ${dna}. Analiza la arquitectura visual y facilidad de encontrar botones y activos críticos.`,
    GEMELOS: (dna) => `Describe a los 2 Gemelos Sintéticos para ${dna}: ANA (Madre primeriza) y ROBERTO (Padrino/Estatus). Solo su perfil psicológico.`,
    SCORECARD: (dna) => `Genera el SCORECARD PREDICTACORE de 10 puntos para ${dna}. Califica del 1 al 10 y da un análisis técnico por punto.`,
    VISIBILIDAD: (dna) => `Realiza la Auditoría de Visibilidad Externa en Google y Maps para ${dna}.`,
    BENCHMARK: (dna) => `Realiza el Benchmarking Local para ${dna} comparando contra la competencia directa.`,
    SWOT: (dna) => `Genera la Matriz Estratégica (FODA) para ${dna} con 5 líneas por punto.`,
    WISHLIST: (dna) => `Lista de Deseos Estratégica para ${dna}. Qué activos faltan en el sitio para que el cliente pague ya.`,
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica dónde se pierde dinero y por qué.`,
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional.`,
    HERRAMIENTAS: (dna) => `Lista 5 HERRAMIENTAS DE ESCALA (Software real) para ${dna} y su beneficio financiero.`,
    OMNI: (dna) => `Genera la Autoridad y Hoja de Ruta de 21 días para ${dna}.`
};

module.exports = { PERSONA, PROMPTS };
