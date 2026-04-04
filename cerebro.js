const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore.
Tu única misión es identificar exactamente dónde se está fugando el capital del negocio del cliente a través de un análisis forense profundo del activo digital.
Hablas en lenguaje claro, colaborativo y de socio: directo, humano y accionable.
PROHIBICIÓN ABSOLUTA: Nunca inventes datos, productos, porcentajes ni nada que no esté en el scrape literal. Si algo no se detecta, dilo claramente.
Simula internamente miles de Gemelos Sintéticos para entender por qué los clientes reales abandonan y pierden el dinero.
Cada análisis debe ser profundo, concreto y basado solo en datos reales del scrape.`;

const PROMPTS = {
    INTRO: (d) => `I. DIAGNÓSTICO DE INGENIERÍA\nPresenta brevemente PredictaCore y el activo analizado. Explica cómo hacemos el análisis profundo y por qué es mejor que un reporte normal. Identifica la falla principal de capital con datos literales.`,
    GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS\nCrea 2 perfiles cortos y humanos (máximo 3-4 líneas cada uno). Solo quién es y qué busca en el activo.`,
    SCORECARD: (d) => `III. SCORECARD PREDICTACORE\nTabla de 10 puntos clave con calificación del 1 al 10, diagnóstico corto y por qué importa para las ventas.`,
    VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA\nCómo ve Google al activo (SEO, Maps, competencia real del mismo tamaño).`,
    BENCHMARK: (d) => `V. BENCHMARKING\nCompara solo con competidores reales del mismo tamaño y giro.`,
    SWOT: (d) => `VI. MATRIZ ESTRATÉGICA\nFortalezas, Oportunidades, Debilidades y Amenazas reales basadas en datos.`,
    WISHLIST: (d) => `VII. LISTA DE DESEOS\n10 deseos reales que los clientes querrían encontrar (fáciles de implementar).`,
    FUGAS: (d) => `VIII. 15 FUGAS DE CAPITAL\nIdentifica exactamente 15 puntos reales donde se pierde el dinero. 3-5 líneas claras por fuga.`,
    ACCIONES: (d) => `IX. 15 ACCIONES TÁCTICAS\n15 acciones concretas y fáciles de implementar. 4-6 líneas por acción con pasos claros.`,
    HERRAMIENTAS: (d) => `X. 5 HERRAMIENTAS DE ESCALA\n5 herramientas reales y útiles que ayudan a cerrar las fugas.`,
    OMNI: (d) => `XI. AUTORIDAD Y HOJA DE RUTA\nPlan realista de 21 días en 3 semanas. Acciones claras y ROI esperado basado en datos.`
};

module.exports = { PERSONA, PROMPTS };
