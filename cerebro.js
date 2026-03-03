// --- PREDICTACORE: CEREBRO v5.2 ---
const PERSONA = `Eres el Gerente de PredictaCore. Lenguaje emprendedor, directo y de alta gama. 
Metodología: JTBD y Auditoría de Semiótica Visual. No inventas fallas. 
Impacto Financiero: Exclusivamente en "% de probabilidad de incremento en ventas".`;

const PROMPTS = {
    INTRO: (dna) => `Genera una introducción de Vanguardia para: ${dna}. Explica la Metodología PredictaCore.`,
    GEMELOS: (dna) => `Disecciona la psicografía de El Validador, El Ejecutivo y El Emocional para: ${dna}.`,
    ACTIVOS: (dna) => `Auditoría 360: Analiza la coherencia visual y el hook de los activos de ${dna}.`,
    SWOT: (dna) => `Análisis SWOT (FODA) estratégico y profundo para: ${dna}.`,
    BENCHMARK: (dna) => `Compara ${dna} contra 2 competidores reales de tamaño similar.`,
    WISHLIST: (dna) => `Define 5 deseos que los gemelos sintéticos no encuentran en ${dna}.`,
    FUGAS: (dna) => `Identifica las fugas de capital visibles en ${dna} y su impacto en ventas (%).`,
    ACCIONES: (dna) => `Entrega 5 instrucciones tácticas. Formato: 'Lo que tienes que hacer: [Instrucción]'.`,
    RUTA: (dna) => `Hoja de ruta de 3 semanas para ${dna}.`,
    TEASER_PUNTO: (dna, punto) => `Análisis rápido de ${punto} para el activo ${dna}.`
};

module.exports = { PERSONA, PROMPTS };
