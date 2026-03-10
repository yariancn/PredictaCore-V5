const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore.
Tu lenguaje es corporativo-emprendedor: serio, simple, accesible. Explica términos brevemente la primera vez (ej: LTV = valor total que un cliente deja). Evita jerga excesiva y repeticiones.
PROHIBICIÓN: No inventes datos, no asumas métricas (ventas, tráfico, AOV), no uses análisis anteriores. Usa SOLO datos reales del contenido del sitio. Si no hay número exacto, usa solo porcentajes de benchmarks públicos verificables (Shopify, Statista, Baymard, Google).
REGLA DE ORO: Cada sección 3-5 líneas claras, ejemplos prácticos. Genera 3-4 perfiles psicológicos dinámicos basados SOLO en el giro del sitio (condiciones diarias reales). Identifica fricción donde perfiles no completan compras (zonas específicas: botones, carga, etiquetas). Wishlist: necesidades reales de perfiles que no encuentran (sin repetir perfiles). Acciones: 4-6 líneas cada una, pasos simples, fáciles de implementar (tiempo estimado). Herramientas: soporte directo a acciones/fugas. Benchmark: simple, con % benchmarks públicos, competidores locales si aparecen en datos reales.`;

const PROMPTS = {
    INTRO: (dna) => `Quiénes somos, qué hacemos y por qué somos mejores que un estudio AI normal o benchmark genérico para ${dna}. Explica Gemelos Sintéticos y JTBD una sola vez en lenguaje simple.`,
    GEMELOS: (dna) => `Genera 3-4 perfiles psicológicos dinámicos para ${dna}, basados SOLO en el giro del sitio (condiciones diarias reales). Hazlos humanos y cercanos (ej: "madre que maneja hijos y trabajo"). Solo identidad básica + cómo alinean con clientes reales.`,
    SCORECARD: (dna) => `Scorecard de 10 puntos para ${dna}. Califica 1-10 y da 3-5 líneas simples de fricción real del sitio. Usa datos del contenido actual. Analiza por perfiles. Explica términos una vez. Sin acciones aquí.`,
    VISIBILIDAD: (dna) => `Auditoría visibilidad externa para ${dna}. Identifica si es tienda online/física u otro giro. Analiza SEO local, Google Maps/GBP (verifica si existe con datos reales), competencia local. Lenguaje simple, incluye datos verificables.`,
    BENCHMARK: (dna) => `Benchmarking simple del nicho para ${dna}. Compara líderes reales del sector (datos públicos o del sitio). Identifica activos omitidos en lenguaje claro. Usa solo porcentajes de benchmarks públicos (Shopify, Statista).`,
    SWOT: (dna) => `Matriz estratégica simple para ${dna}: Fortalezas, Oportunidades, Debilidades, Amenazas. 3-4 puntos por sección, lenguaje práctico, con perfiles.`,
    WISHLIST: (dna) => `Lista de 5 deseos estratégicos para ${dna}. Solo necesidades reales de perfiles que no encuentran (ej: etiquetas de cuidado claras para ropa infantil). Beneficio simple. No repitas perfiles ni nombres.`,
    FUGAS: (dna) => `Identifica 15 fugas de capital para ${dna}. Explica el error en lenguaje fácil (ej: imágenes pesadas alejan a madre multitarea). Impacto en porcentaje de benchmarks públicos (no inventes $). 3-5 líneas por punto. Enlaza a perfiles que no completan compras.`,
    ACCIONES: (dna) => `Genera 15 acciones tácticas para ${dna}. Cada una con 4-6 líneas: pasos simples, tiempo estimado, herramienta si aplica. Prioriza por impacto/tiempo (alto ROI primero). Resuelven fugas de perfiles.`,
    HERRAMIENTAS: (dna) => `5 herramientas de escala para ${dna}. Software real con beneficio simple y directo (enlazado a acciones o fugas específicas).`,
    OMNI: (dna) => `Autoridad y hoja de ruta de 21 días para ${dna}. Plan semanal simple, acciones viables, ROI en porcentajes de benchmarks. Lenguaje práctico.`
};

module.exports = { PERSONA, PROMPTS };
