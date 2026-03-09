const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore.
Tu lenguaje es corporativo-emprendedor: serio, simple, accesible. Explica términos técnicos brevemente la primera vez (ej: LTV = valor total que un cliente deja en el negocio). Evita jerga excesiva y repeticiones.
PROHIBICIÓN: No inventes datos, no asumas, no uses análisis anteriores. Usa SOLO datos reales del scrape proporcionado.
REGLA DE ORO: Cada sección 3-5 líneas claras, ejemplos prácticos. Si no hay número exacto (ej: ventas), usa porcentajes de benchmarks públicos (Shopify, Statista para nicho). Adapta todo al giro del negocio (web/red/idea). Genera 3-4 perfiles psicológicos dinámicos basados en condiciones diarias reales del scrape (ej: para wellness: persona activa con rutina, profesional estresado).`;

const PROMPTS = {
    INTRO: (dna) => `Genera introducción simple y corporativa para ${dna} (web, red o idea). Explica brevemente Gemelos Sintéticos (modelos virtuales de usuarios) y JTBD (tareas que el cliente quiere resolver) una sola vez. Usa lenguaje accesible.`,
    GEMELOS: (dna) => `Genera 3-4 perfiles psicológicos dinámicos para ${dna}, basados SOLO en el giro del negocio del scrape (condiciones diarias reales). Ejemplos: para wellness TX: persona activa con rutina diaria, profesional con estrés laboral. Solo identidad básica + cómo alinean con clientes reales del nicho.`,
    SCORECARD: (dna) => `Scorecard de 10 puntos para ${dna}. Califica 1-10 y da 3-5 líneas simples. Explica términos una vez. Usa datos scrape reales (ej: reseñas repetidas, imágenes pesadas). Analiza desde perfiles generados. Nada inventado.`,
    VISIBILIDAD: (dna) => `Auditoría de visibilidad externa para ${dna}. Analiza SEO local, Google Maps/GBP (verifica si existe o no con datos reales) y competencia local. Usa lenguaje simple, incluye links o datos verificables si aparecen en scrape.`,
    BENCHMARK: (dna) => `Benchmarking del nicho para ${dna}. Compara contra líderes reales del sector (basado en scrape o datos públicos). Identifica activos omitidos en lenguaje claro. Usa % de benchmarks públicos (ej: conversión promedio Shopify nicho).`,
    SWOT: (dna) => `Matriz estratégica simple para ${dna}: Fortalezas, Oportunidades, Debilidades, Amenazas. 3-4 puntos por sección, lenguaje práctico, con perfiles generados.`,
    WISHLIST: (dna) => `Lista de 5 deseos estratégicos para ${dna}. Solo activos alcanzables y razonables dentro del giro real del scrape. Explica beneficio simple.`,
    FUGAS: (dna) => `Identifica 15 fugas de capital para ${dna}. Explica error en lenguaje fácil (ej: reseñas repetidas confunden). Impacto en % o $ estimado con benchmark público (no inventes ventas). 3-5 líneas por punto.`,
    ACCIONES: (dna) => `Genera 15 acciones tácticas simples y viables para ${dna}. Formato: [Acción concreta y alcanzable]. Prioriza por impacto/tiempo bajo (ej: arreglar reseñas repetidas en 1 día). Nada fuera del giro real.`,
    HERRAMIENTAS: (dna) => `5 herramientas de escala para ${dna}. Software real con beneficio financiero directo en términos simples (ej: "aumenta reservas 20-30%").`,
    OMNI: (dna) => `Autoridad y hoja de ruta de 21 días para ${dna}. Plan semanal simple, acciones viables, ROI estimado con % benchmarks. Lenguaje práctico.`
};

module.exports = { PERSONA, PROMPTS };
