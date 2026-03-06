const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore. 
Tu lenguaje es corporativo-emprendedor: técnico, analítico, directo y empoderador. 
PROHIBICIÓN: No te presentes en las secciones. No uses "Hola", "Soy tu estratega" ni frases de relleno. 
REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica. 
Identifica los activos críticos omitidos según el giro del negocio (tallas, certificaciones, fichas técnicas, etc.) y denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna}. 
    Define la empresa como una unidad de ingeniería forense de conversión. Explica el uso de Gemelos Sintéticos y la metodología JTBD. Es la única sección de presentación.`,

    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}. 
    1. Arquitectura de Navegación y flujo. 
    2. Transparencia Técnica (Activos omitidos según giro del negocio). 
    3. Semiótica Visual (Señales de autoridad vs desconfianza). 
    4. Visión de Google (SEO local, autoridad de dominio vs marketplaces). 
    5. Percepción Algorítmica de los Gemelos (Cómo el posicionamiento afecta su confianza inicial).`,

    GEMELOS: (dna) => `Define el PERFIL PSICOLÓGICO de 2 Gemelos Sintéticos para ${dna}. 
    1. ANA: Compradora emocional y de seguridad. 
    2. ROBERTO: Comprador de estatus y eficiencia. 
    Nota: Limítate estrictamente a su identidad y motivaciones psicológicas. No incluyas críticas técnicas del sitio aquí.`,

    SCORECARD: (dna) => `Genera el SCORECARD DE 10 PUNTOS para ${dna}: 
    1. Gancho, 2. Pricing, 3. Misión de Compra, 4. Jerarquía de Botones, 5. Visibilidad de Activos Técnicos, 6. Confianza, 7. Prueba Social, 8. Navegación Móvil, 9. Autoridad, 10. Soporte. 
    Califica de 1 a 10 y da 5 líneas de análisis forense por punto.`,

    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. 
    Analiza SEO de intención, canibalización de plataformas externas y presencia local (Maps/Google Business) desde la perspectiva de autoridad de marca.`,

    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. 
    Compara contra los 3 líderes del sector. Analiza por qué ellos retienen al cliente con información técnica que este activo omite.`,

    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. 
    Analiza 4 puntos: Fortalezas, Oportunidades, Debilidades (fugas de navegación) e Amenazas (commodities). 5 líneas por punto.`,

    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. 
    Enumera 5 activos de alta gama que el sitio NO tiene y que el cliente sueña encontrar para pagar sin dudar.`,

    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. 
    Analiza errores técnicos, falta de información específica del giro, fallas de pricing y botones invisibles. 5 líneas de análisis por cada fuga.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. 
    Formato obligatorio: 'Lo que tienes que hacer: [Acción]'. 
    Usa lógica condicional: 'Si el cliente no encuentra X, entonces instala Y'.`,

    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. 
    Menciona software real (ej. Zakeke, Loox, Klaviyo, Gorgias, Lucky Orange) y explica su beneficio financiero directo en la conversión.`,

    OMNI: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. 
    Plan semanal (Semana 1, 2 y 3) de ejecución técnica y estratégica para blindar la conversión.`
};

module.exports = { PERSONA, PROMPTS };
