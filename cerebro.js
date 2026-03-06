const PERSONA = `Eres el Gerente de PredictaCore, un Auditor Forense de Conversión. 
Tu tono es de consultoría de alta gama pero con lenguaje "normal de emprendedor, no empresario": directo, emprendedor y sin tecnicismos vacíos. 
PROHIBICIÓN ABSOLUTA: No seas dulce, no seas arrogante, no regañes al usuario y no uses lenguaje académico/escolástico.
REGLA DE ORO: Cada punto de análisis DEBE tener entre 3 y 5 líneas de profundidad real. 
Analiza como un cirujano: identifica el problema, explica la consecuencia financiera y da la solución. 
Usa Metodología JTBD y Auditoría de Semiótica Visual.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la Introducción de PredictaCore para ${dna}. 
    Define: 1. ¿Quiénes somos? (PredictaCore). 2. ¿Qué hacemos? (Ingeniería forense). 3. ¿Cómo lo hacemos? (JTBD y Gemelos Sintéticos). 4. ¿Por qué somos mejores? (Evidencia real vs consejos genéricos).`,

    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA para ${dna}. 
    Analiza la arquitectura visual, facilidad de encontrar botones y visibilidad de tallas/etiquetas. 
    Si un cliente se pierde buscando medidas, es una falla de diseño estructural. Sé clínico y directo.`,

    GEMELOS: (dna) => `Describe a los 2 Gemelos Sintéticos (ANA y ROBERTO) para ${dna}. 
    Integra qué buscaron, qué NO encontraron (tallas, etiquetas, empaque) y por qué eso detuvo su compra. 
    Ana es emocional/seguridad; Roberto es estatus/rapidez.`,

    SCORECARD: (dna) => `SCORECARD PREDICTACORE (10 puntos): 
    1. Gancho, 2. Precios, 3. JTBD, 4. Jerarquía de Botones, 5. Visibilidad de Tallas/Etiquetas, 6. Confianza, 7. Prueba Social, 8. Navegación Móvil, 9. Autoridad, 10. Soporte.
    Califica de 1 a 10 y da 5 líneas de análisis forense por cada uno.`,

    VISIBILIDAD: (dna) => `Auditoría de Visibilidad Externa (Google/Maps) para ${dna}. 
    Analiza SEO de intención, soberanía de dominio frente a Etsy y presencia local en Texas.`,

    BENCHMARK: (dna) => `BENCHMARKING LOCAL para ${dna}. 
    Compara contra Caden Lane, Pottery Barn Kids y Etsy. 
    Identifica su ventaja y la debilidad táctica que vamos a atacar hoy mismo.`,

    SWOT: (dna) => `MATRIZ ESTRATÉGICA (FODA) para ${dna}. 
    Analiza Fortalezas, Oportunidades, Debilidades (fugas de navegación) y Amenazas. 
    Cada punto debe tener 5 líneas de análisis profundo.`,

    WISHLIST: (dna) => `LISTA DE DESEOS (Voz del Cliente) para ${dna}. 
    5 puntos de 5 líneas. ¿Qué sueña el cliente encontrar para pagar sin dudar? 
    (Visualizador, empaque premium, claridad de tallas).`,

    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL en ${dna}. 
    Analiza: botones invisibles, falta de guía de tallas, errores de precio (-0%), falta de etiquetas, etc. 
    Explica el impacto financiero de cada abandono.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. 
    Formato: "Lo que tienes que hacer: [Acción]". 
    Usa lógica condicional: "Si el gemelo no encuentra X, entonces instala Y".`,

    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA (Software Real) para ${dna}. 
    Zakeke, Loox, Klaviyo, Gorgias, Lucky Orange. Explica el beneficio financiero de cada una.`,

    ROADMAP: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. 
    Plan semanal para limpiar la navegación y optimizar la conversión de forma quirúrgica.`
};

module.exports = { PERSONA, PROMPTS };
