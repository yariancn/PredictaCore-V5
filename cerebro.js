const PERSONA = `Eres el Gerente de PredictaCore, una unidad de Ingeniería Forense de Conversión. 
Tu lenguaje es de consultoría de alta gama pero con "lenguaje a pie de calle": directo, emprendedor, sin tecnicismos vacíos y con una responsabilidad absoluta sobre el valor del reporte.
ESTÁ PROHIBIDO: Resumir, acortar, usar consejos genéricos o ser "escolástico".
REGLA DE ORO: Cada punto de análisis debe tener entre 3 y 5 líneas de profundidad técnica y psicológica.
METODOLOGÍA: Usas Jobs-To-Be-Done (JTBD) y Auditoría de Semiótica Visual.
CONTEXTO: Analizas el negocio basándote en 9,000 gemelos sintéticos que buscan, compran y se frustran en el activo.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la Introducción de PredictaCore para el activo ${dna}. 
    Explica: ¿Quiénes somos?, ¿Qué hacemos?, ¿Cómo lo hacemos? y ¿Por qué somos mejores que los demás? (Sin mencionar marcas externas como Organic Nails). 
    Usa un tono de autoridad soberana.`,

    DNA: (dna) => `Realiza el Diagnóstico de Ingeniería (DNA del Activo) para ${dna}. 
    Analiza la posición de mercado, el entorno digital y la Misión Real de Compra (JTBD). 
    Aplica Auditoría de Semiótica Visual sobre la paleta de colores y tipografía.`,

    GEMELOS: (dna) => `Describe a los 2 Gemelos Sintéticos principales para ${dna}: 
    1. ANA (Madre Primeriza/Emocional) y 2. ROBERTO (El Padrino/Estatus). 
    Define solo su perfil psicológico e identidad. (Sus hallazgos van en otras secciones).`,

    SCORECARD: (dna) => `Genera el SCORECARD PREDICTACORE con exactamente 10 PUNTOS: 
    1. Gancho, 2. Precios, 3. Misión de Compra, 4. Jerarquía Visual, 5. Confianza, 6. Navegación (UX), 7. Prueba Social, 8. Facilidad de Pago, 9. Autoridad de Marca, 10. Soporte. 
    Califica de 1 a 10 y da el diagnóstico forense de 3 a 5 líneas por cada uno.`,

    GOOGLE: (dna) => `Realiza la Auditoría de Visibilidad Externa en Google y Maps para ${dna}. 
    Analiza SEO Local, presencia en Maps y la soberanía del dominio frente a marketplaces como Etsy.`,

    BENCHMARK: (dna) => `Realiza el Benchmarking Local para ${dna}. 
    Compara contra competidores reales del nicho (Caden Lane, Pottery Barn Kids, Etsy). 
    Identifica la ventaja de ellos y la debilidad que vamos a atacar.`,

    FODA: (dna) => `Genera la Matriz Estratégica (FODA) para ${dna}. 
    3 a 5 líneas por cada Fortificación, Oportunidad, Debilidad y Amenaza. Sin rellenos académicos.`,

    DESEOS: (dna) => `Lista de Deseos (La Voz del Cliente) para ${dna}. 
    Identifica 5 deseos profundos de los gemelos (Control, Certeza, Estatus, Cercanía, Seguridad).`,

    FUGAS: (dna) => `Identifica exactamente 15 FUGAS DE CAPITAL para ${dna}. 
    Cada fuga debe explicar dónde se pierde el dinero y por qué (incertidumbre, errores técnicos, falta de botones, tallas invisibles, etc.). 
    Mínimo 3 líneas por fuga.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. 
    Usa lógica condicional: "Si el cliente busca X, entonces haz Y". 
    Deben ser acciones inmediatas, desde la higiene técnica hasta la estrategia de ventas.`,

    HERRAMIENTAS: (dna) => `Lista 5 HERRAMIENTAS DE ESCALA (Software real) para ${dna}. 
    Explica para qué sirve cada una (Zakeke, Loox, Klaviyo, Gorgias, Lucky Orange) y su beneficio financiero.`,

    ROADMAP: (dna) => `Autoridad y Hoja de Ruta de 21 días para ${dna}. 
    Divide en 3 semanas de implementación técnica y estratégica.`
};

module.exports = { PERSONA, PROMPTS };
