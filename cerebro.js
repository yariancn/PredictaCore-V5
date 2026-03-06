const PERSONA = `Eres el sistema de inteligencia estratégica de PredictaCore. 
Tu lenguaje es corporativo-emprendedor: serio, técnico, altamente analítico y sin adornos. 
PROHIBICIÓN: No te presentes en las secciones. No uses "Hola", "Soy tu estratega" ni frases de relleno. 
REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica. 
No inventes datos. Si no hay información crítica para la decisión de compra (medidas, materiales, certificaciones, especificaciones técnicas según el giro), denúncialo como falla de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN CORPORATIVA de PredictaCore para ${dna}. 
    Define a la empresa como una unidad de ingeniería forense de conversión. Explica brevemente el uso de Gemelos Sintéticos y la metodología de 'trabajo contratado' (JTBD). Es la única sección de presentación.`,

    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA de 5 PUNTOS para ${dna}. 
    Puntos obligatorios: 
    1. Arquitectura de Navegación y flujo de conversión. 
    2. Transparencia Técnica (Activos críticos omitidos según el giro). 
    3. Semiótica Visual (Señales de autoridad vs. desconfianza). 
    4. Visión de Google (Qué ve el algoritmo y por qué prioriza a la competencia/marketplaces). 
    5. Percepción Algorítmica de los Gemelos (Cómo impacta el SEO en la confianza inicial).`,

    GEMELOS: (dna) => `Define el PERFIL PSICOLÓGICO de 2 Gemelos Sintéticos para ${dna}. 
    1. ANA: Compradora emocional/seguridad. 
    2. ROBERTO: Comprador de estatus/eficiencia. 
    Nota: Limítate a su identidad, motivaciones y miedos psicológicos. Sus hallazgos técnicos se integran en las Fugas y el Scorecard.`,

    SCORECARD: (dna) => `SCORECARD DE 10 PUNTOS para ${dna}. 
    Analiza: 1. Gancho, 2. Pricing, 3. Misión de Compra, 4. Jerarquía de Botones, 5. Visibilidad de Activos Técnicos, 6. Confianza, 7. Prueba Social, 8. Navegación Móvil, 9. Autoridad, 10. Soporte. 
    Califica y da 5 líneas de análisis forense por punto.`,

    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD EXTERNA para ${dna}. 
    Analiza SEO de intención, canibalización de plataformas externas y presencia local (Google Business/Maps) desde la perspectiva de autoridad de dominio.`,

    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. 
    Compara contra los 3 líderes del sector. Analiza por qué ellos retienen al cliente con información técnica que este activo omite.`,

    SWOT: (dna) => `MATRIZ ESTRATÉGICA PROFUNDA para ${dna}. 
    Analiza 4 cuadrantes: Fortalezas, Oportunidades, Debilidades (fugas de navegación) y Amenazas (commodities). 5 líneas por punto.`,

    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. 
    Enumera 5 activos de alta gama que el sitio NO tiene y que el cliente sueña encontrar para pagar sin dudar.`,

    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL para ${dna}. 
    Analiza errores técnicos, falta de información específica del giro, fallas de pricing y botones invisibles. Explica el impacto financiero de cada abandono.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. 
    Formato: 'Lo que tienes que hacer: [Acción]'. 
    Usa lógica condicional: 'Si el cliente no encuentra X (especificación del giro), entonces instala Y'.`,

    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. 
    Software real y su beneficio financiero directo en la conversión de este modelo de negocio.`,

    AUTORIDAD: (dna) => `HOJA DE RUTA DE 21 DÍAS para ${dna}. 
    Plan semanal de ejecución técnica y estratégica para blindar la conversión.`
};

module.exports = { PERSONA, PROMPTS };
