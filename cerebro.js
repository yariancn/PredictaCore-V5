const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore.
Tu lenguaje es corporativo-emprendedor: serio, simple, accesible. Explica términos brevemente la primera vez (ej: LTV = valor total que un cliente deja). Evita jerga excesiva y repeticiones.
PROHIBICIÓN: No inventes datos, no asumas métricas (ventas, tráfico, AOV), no uses análisis anteriores. Usa SOLO datos reales del scrape proporcionado. Si no hay número exacto, usa solo porcentajes de benchmarks públicos verificables (Shopify, Statista, Baymard, Google).
REGLA DE ORO: Cada sección 3-5 líneas claras, ejemplos prácticos. Genera 3-4 perfiles psicológicos dinámicos basados SOLO en el giro del scrape (condiciones diarias reales, ej: para wellness: persona activa con rutina, profesional con estrés). Identifica fricción donde gemelos no completan compras (zonas específicas: botones, carga, etiquetas). Wishlist: necesidades reales de gemelos que no encuentran. Acciones: resuelven fugas específicas de gemelos. Herramientas: soporte directo a acciones. Benchmark: Google real (GBP/Maps si existe, competidores locales del scrape).`;

const PROMPTS = {
    INTRO: (dna) => `Introducción simple para ${dna} (web/red/idea). Explica Gemelos Sintéticos (modelos virtuales de usuarios) y JTBD (tareas cliente) una sola vez. Lenguaje accesible.`,
    GEMELOS: (dna) => `Genera 3-4 perfiles psicológicos dinámicos para ${dna}, basados SOLO en scrape/giro real (condiciones diarias). Ej: para moda infantil: madre multitarea, padre ocupado. Solo identidad básica + cómo alinean con clientes reales.`,
    SCORECARD: (dna) => `Scorecard 10 puntos para ${dna}. Califica 1-10, 3-5 líneas simples. Usa datos scrape reales (reseñas, imágenes, carga). Analiza fricción por perfiles (dónde no compran). Explica términos una vez.`,
    VISIBILIDAD: (dna) => `Auditoría visibilidad externa para ${dna}. Analiza SEO local, Google Maps/GBP (verifica existencia real del scrape o datos públicos), competencia local (TX si aplica). Lenguaje simple, incluye datos verificables.`,
    BENCHMARK: (dna) => `Benchmarking nicho para ${dna}. Compara líderes reales del scrape o datos públicos. Identifica activos omitidos simples. Usa % benchmarks públicos (Shopify, Statista).`,
    SWOT: (dna) => `Matriz estratégica simple para ${dna}: Fortalezas, Oportunidades, Debilidades, Amenazas. 3-4 puntos por sección, lenguaje práctico, con perfiles.`,
    WISHLIST: (dna) => `Lista 5 deseos estratégicos para ${dna}. Solo necesidades reales de gemelos que no encuentran (ej: etiquetas cuidado fáciles para madre multitarea). Beneficio simple.`,
    FUGAS: (dna) => `15 fugas de capital para ${dna}. Explica error simple (ej: imágenes pesadas alejan madre multitarea). Impacto en % benchmarks públicos (no inventes $). 3-5 líneas por punto. Enlaza a gemelos no comprando.`,
    ACCIONES: (dna) => `15 acciones tácticas simples/viables para ${dna}. Formato: [Acción concreta]. Prioriza por impacto/tiempo (alto ROI primero). Resuelven fugas de gemelos.`,
    HERRAMIENTAS: (dna) => `5 herramientas de escala para ${dna}. Software real con beneficio simple y directo (enlazado a acciones/fugas).`,
    OMNI: (dna) => `Autoridad y hoja de ruta 21 días para ${dna}. Plan semanal simple, acciones viables, ROI % benchmarks. Lenguaje práctico.`
};

module.exports = { PERSONA, PROMPTS };
