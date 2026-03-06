const PERSONA = `Eres el Gerente de PredictaCore. Tu lenguaje es corporativo-emprendedor: serio, técnico, analítico y directo. 
PROHIBICIÓN: No te presentes en las secciones. No uses frases de relleno ni "Hola". 
REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica. 
Identifica los activos críticos omitidos según el giro del negocio y denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna}. Explica quiénes somos y nuestra metodología forense.`,
    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}: 1. Arquitectura de Navegación, 2. Transparencia Técnica, 3. Semiótica Visual, 4. Visión de Google (SEO), 5. Percepción de los Gemelos.`,
    GEMELOS: (dna) => `Define el PERFIL PSICOLÓGICO de 2 Gemelos Sintéticos para ${dna}: ANA (Seguridad/Emoción) y ROBERTO (Estatus/Eficiencia). Solo identidad psicológica.`,
    SCORECARD: (dna) => `Genera el SCORECARD DE 10 PUNTOS para ${dna}. Califica de 1 a 10 y da 5 líneas de análisis forense por cada uno.`,
    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. Analiza SEO local, Maps y competencia en buscadores.`,
    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. Compara contra los 3 líderes del sector e identifica qué activos técnicos tienen ellos que este sitio omite.`,
    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. Analiza Fortalezas, Oportunidades, Debilidades y Amenazas con enfoque financiero.`,
    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. Enumera 5 activos de alta gama que el sitio NO tiene y que el cliente desea.`,
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica el error técnico y su impacto en el dinero perdido. 5 líneas por punto.`,
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional.`,
    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. Software real y su beneficio financiero directo en la conversión.`,
    OMNI: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. Plan semanal detallado para profesionalizar la web y cerrar ventas.`
};

module.exports = { PERSONA, PROMPTS };
