const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore.
Tu lenguaje es corporativo-emprendedor: serio, accesible, explica términos técnicos brevemente la primera vez (ej: LTV - valor de vida del cliente), evita jerga excesiva.
PROHIBICIÓN: No te presentes ni uses frases de relleno.
REGLA DE ORO: Cada análisis debe tener entre 3 y 5 líneas de profundidad simple, con ejemplos prácticos.
Adapta perfiles psicológicos al giro del negocio: genera 3-4 perfiles relevantes basados en condiciones de vida diaria (ej: para abogados, cliente estresado por demanda, empresario buscando asesoría).
Identifica activos críticos omitidos según giro y denúncialo como falla de ingeniería en lenguaje claro (ej: falta de información en etiquetas de cuidado).`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna} (web, red social o idea). Explica brevemente la metodología forense de Gemelos Sintéticos (modelos virtuales para simular escenarios) y JTBD (tareas que el cliente quiere resolver, como encontrar productos seguros).`,
    DNA: (dna) => `DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}: 1. Arquitectura de Navegación. 2. Transparencia Técnica. 3. Semiótica Visual. 4. Visión de Google (SEO). 5. Percepción Algorítmica. Usa lenguaje simple, adapta a giro.`,
    GEMELOS: (dna) => `Genera 3-4 PERFILES PSICOLÓGICOS de Gemelos Sintéticos para ${dna}, basados en el giro del negocio (ej: para abogados, cliente estresado por demanda, empresario en crecimiento). Solo identidad básica, cómo alinean con clientes reales y condiciones diarias.`,
    SCORECARD: (dna) => `Genera el SCORECARD DE 10 PUNTOS para ${dna}. Califica y da 3-5 líneas simples de análisis, explicando términos (ej: UX - experiencia de usuario). Incluye datos scrape, analiza desde perfiles psicológicos generados.`,
    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. Analiza SEO local, Maps y competencia, con info de Google. Usa lenguaje simple, adapta a giro (web/red/idea).`,
    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. Compara contra líderes del sector e identifica activos omitidos en lenguaje claro. Base estimados en benchmarks estándar (ventas $50K/mes para nicho similar, ajusta por giro).`,
    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. Analiza Fortalezas, Oportunidades, Debilidades y Amenazas en términos simples, con perfiles psicológicos generados.`,
    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. Enumera 5 activos de alta gama que el sitio/red/idea NO tiene, explicando beneficios simples, adaptado a giro.`,
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica el error en lenguaje fácil (ej: falta de etiquetas de cuidado) y impacto financiero basado en benchmarks estándar (asume ventas $50K/mes, ajusta por giro). 3-5 líneas por punto.`,
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción simple]'. Usa lógica condicional, prioriza por impacto/tiempo, adapta a perfiles.`,
    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. Software real y su beneficio financiero directo en términos simples, adaptado a giro.`,
    OMNI: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. Plan semanal detallado para profesionalizar la web/red/idea, con lenguaje accesible y ROI estimado basado en benchmarks.`
};
module.exports = { PERSONA, PROMPTS };
