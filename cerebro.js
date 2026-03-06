const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore. Tu lenguaje es corporativo-emprendedor: serio, técnico, analítico y directo. PROHIBICIÓN: No te presentes en las secciones. No uses frases de relleno ni "Hola". REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica. Identifica activos críticos omitidos según el giro del negocio y denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna}. Define a la empresa como una unidad de ingeniería forense de conversión. Explica brevemente el uso de Gemelos Sintéticos y la metodología JTBD.`,
    
    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}. 
    Puntos obligatorios: 
    1. Arquitectura de Navegación y flujo. 
    2. Transparencia Técnica (Activos omitidos). 
    3. Semiótica Visual (Autoridad vs Desconfianza). 
    4. Visión de Google (SEO local, autoridad de dominio vs marketplaces). 
    5. Percepción Algorítmica de los Gemelos (Cómo el ranking afecta la confianza inicial).`,
    
    GEMELOS: (dna) => `Define el PERFIL PSICOLÓGICO de 2 Gemelos Sintéticos para ${dna}: 1. ANA (Seguridad/Emoción) y 2. ROBERTO (Estatus/Eficiencia). Limítate estrictamente a su identidad y motivaciones psicológicas profundas.`,
    
    SCORECARD: (dna) => `Genera el SCORECARD DE 10 PUNTOS para ${dna}. Califica de 1 a 10 y da 5 líneas de análisis forense por punto (Gancho, Pricing, UX, Tallas/Activos, Confianza, etc.).`,
    
    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. Analiza SEO de intención, canibalización de plataformas externas y presencia local desde la autoridad de marca.`,
    
    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. Compara contra los líderes del sector e identifica qué activos técnicos tienen ellos que este sitio omite.`,
    
    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. Analiza Fortalezas, Oportunidades, Debilidades y Amenazas con enfoque financiero.`,
    
    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. Enumera 5 activos de alta gama que el sitio NO tiene y que el cliente desea para pagar ya.`,
    
    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. Explica el error técnico y su impacto financiero. 5 líneas por cada punto.`,
    
    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. Formato: 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional.`,
    
    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. Software real y su beneficio financiero directo en la conversión.`,
    
    OMNI: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. Plan semanal detallado para profesionalizar la web y cerrar ventas.`
};

module.exports = { PERSONA, PROMPTS };
