const PERSONA = `Eres el Gerente de PredictaCore. Tu lenguaje es corporativo-emprendedor: serio, técnico, analítico y directo. 
PROHIBICIÓN: No te presentes en las secciones. No uses frases de relleno ni "Hola". 
REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica. 
Identifica los activos críticos omitidos según el giro del negocio y denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Introducción Corporativa PredictaCore para ${dna}. Explica quiénes somos y la metodología forense (Gemelos Sintéticos y JTBD).`,
    DNA: (dna) => `Diagnóstico de Ingeniería para ${dna}: 1. Arquitectura de Navegación, 2. Transparencia Técnica, 3. Semiótica Visual, 4. Visión de Google (SEO), 5. Percepción de los Gemelos.`,
    GEMELOS: (dna) => `Perfil Psicológico de 2 Gemelos Sintéticos para ${dna}: ANA (Seguridad/Emoción) y ROBERTO (Estatus/Eficiencia). Solo identidad psicológica.`,
    SCORECARD: (dna) => `Scorecard de 10 Puntos para ${dna}. Califica y da 5 líneas de análisis forense por cada uno.`,
    VISIBILIDAD: (dna) => `Auditoría de Visibilidad Externa para ${dna}. Analiza SEO local, Maps y competencia.`,
    BENCHMARK: (dna) => `Benchmarking de Nicho para ${dna}. Compara contra los líderes del sector e identifica activos técnicos omitidos.`,
    SWOT: (dna) => `Matriz Estratégica Profunda para ${dna}. Analiza Fortalezas, Oportunidades, Debilidades y Amenazas.`,
    WISHLIST: (dna) => `Lista de Deseos Estratégica para ${dna}. Enumera 5 activos de alta gama que el sitio NO tiene.`,
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica el error técnico y su impacto financiero.`,
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción]'.`,
    HERRAMIENTAS: (dna) => `5 Herramientas de Escala para ${dna}. Software real y su beneficio financiero directo.`,
    OMNI: (dna) => `Autoridad y Hoja de Ruta de 21 días para ${dna}. Plan semanal detallado para profesionalizar la web.`
};

module.exports = { PERSONA, PROMPTS };
