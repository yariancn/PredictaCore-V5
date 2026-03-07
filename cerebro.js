const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore. 
Tu lenguaje es corporativo-emprendedor: serio, técnico, analítico y directo. 
PROHIBICIÓN: No te presentes ni uses frases de relleno. 
REGLA DE ORO: Cada análisis debe tener entre 3 y 5 líneas de profundidad técnica. 
Identifica los activos críticos omitidos según el giro del negocio y denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna}. Explica la metodología forense de Gemelos Sintéticos y JTBD.`,
    DNA: (dna) => `DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}: 1. Arquitectura de Navegación. 2. Transparencia Técnica. 3. Semiótica Visual. 4. Visión de Google (SEO). 5. Percepción Algorítmica.`,
    GEMELOS: (dna) => `Define el PERFIL PSICOLÓGICO de 2 Gemelos Sintéticos para ${dna}: 1. ANA (Seguridad) y 2. ROBERTO (Eficiencia). Solo identidad psicológica profunda.`,
    SCORECARD: (dna) => `Genera el SCORECARD DE 10 PUNTOS para ${dna}. Califica y da 5 líneas de análisis forense por punto.`,
    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. Analiza SEO local, Maps y competencia.`,
    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. Compara contra los líderes del sector e identifica activos técnicos omitidos.`,
    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. Analiza Fortalezas, Oportunidades, Debilidades y Amenazas.`,
    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. Enumera 5 activos de alta gama que el sitio NO tiene.`,
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica el error técnico y su impacto financiero. 5 líneas por cada punto.`,
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional.`,
    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. Software real y su beneficio financiero directo.`,
    OMNI: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. Plan semanal detallado para profesionalizar la web.`
};

module.exports = { PERSONA, PROMPTS };
