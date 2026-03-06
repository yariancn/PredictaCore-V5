const PERSONA = `Eres el Gerente de PredictaCore, un consultor de alta gama que habla "lenguaje a pie de calle": directo, honesto y empoderador para el dueño del negocio. 
Tu misión es el ANÁLISIS FORENSE de www.pamandander.com. 
ESTRICTAMENTE PROHIBIDO: 
1. Ser grosero o arrogante. 
2. Mencionar marcas como Organic Nails o Corazondealgodon (son confidenciales). 
3. Confundir la ubicación (Pam and Ander opera en Texas, para US/Canada).
REGLA DE ORO: Cada punto analizado DEBE tener entre 3 y 5 líneas de profundidad. 
No resumas. No cortes. Si el cliente busca una guía de tallas y no la ve, es una falla crítica de ingeniería.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la Introducción Soberana de PredictaCore para ${dna}. 
    Define: 
    1. ¿Quiénes somos? (PredictaCore, auditores de conversión). 
    2. ¿Qué hacemos? (Ingeniería forense de activos). 
    3. ¿Cómo lo hacemos? (Metodología JTBD y Gemelos Sintéticos). 
    4. ¿Por qué somos mejores? (Análisis de comportamiento real vs. consejos genéricos).`,

    DNA: (dna) => `Realiza el DIAGNÓSTICO DE INGENIERÍA para ${dna}. 
    Analiza la arquitectura visual, la facilidad de encontrar el botón de compra y la ubicación de activos críticos (etiquetas de cuidado, materiales). 
    Si la navegación es confusa para encontrar tallas, documéntalo como una falla de diseño estructural. Mínimo 5 líneas.`,

    GEMELOS: (dna) => `Describe a los 2 Gemelos Sintéticos (ANA y ROBERTO) integrando sus hallazgos en ${dna}. 
    No solo definas quiénes son, explica qué buscaron en la web, qué etiquetas NO encontraron y por qué eso detuvo su compra. 
    Ana busca suavidad y tallas; Roberto busca empaque de regalo y rapidez.`,

    SCORECARD: (dna) => `Genera el SCORECARD con 10 PUNTOS CRÍTICOS (Calificación y 5 líneas de análisis cada uno): 
    1. Gancho, 2. Pricing, 3. Misión de Compra, 4. Jerarquía de Botones, 5. Visibilidad de Tallas/Etiquetas, 6. Confianza, 7. Prueba Social, 8. Navegación Móvil, 9. Autoridad, 10. Soporte.`,

    VISIBILIDAD: (dna) => `Auditoría Profunda de Google y Maps para ${dna}. 
    Analiza el SEO de intención (keywords de maternidad) y por qué la marca pierde visibilidad frente a Etsy en el buscador. 
    Analiza la ficha de Google Business (o su ausencia) y su impacto en la autoridad local en Texas.`,

    BENCHMARK: (dna) => `BENCHMARKING LOCAL EXTREMO para ${dna}. 
    Compara contra Caden Lane, Pottery Barn Kids y Etsy. 
    Analiza por qué sus botones de compra o guías de tallas son mejores y qué debe copiar/superar Pam and Ander hoy mismo.`,

    SWOT: (dna) => `MATRIZ ESTRATÉGICA (FODA) PROFUNDA para ${dna}. 
    Analiza Fortalezas, Oportunidades, Debilidades (falla de navegación) y Amenazas (commodities). 
    Mínimo 5 líneas por cada punto.`,

    WISHLIST: (dna) => `LISTA DE DESEOS ESTRATÉGICA para ${dna}. 
    5 puntos de 5 líneas cada uno. ¿Qué es lo que el cliente sueña encontrar en tu web para pagar sin dudar? 
    (Visualizador en vivo, empaque de lujo, claridad absoluta de medidas).`,

    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL en ${dna}. 
    Analiza: botones invisibles, falta de guía de tallas, errores de precio (-0%), falta de etiquetas de lavado, etc. 
    Cada fuga debe tener 5 líneas explicando el impacto financiero del abandono.`,

    ACCIONES: (dna) => `Genera 15 ACCIONES TÁCTICAS para ${dna}. 
    Usa lógica: "Si el gemelo no encuentra X, entonces instala Y". 
    Deben ser órdenes directas para corregir la navegación y la jerarquía visual de inmediato.`,

    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA (Software Real) para ${dna}. 
    Explica el beneficio financiero de Zakeke (visualización), Loox (prueba social), etc.`,

    ROADMAP: (dna) => `AUTORIDAD Y HOJA DE RUTA DE 21 DÍAS para ${dna}. 
    Plan de ejecución semanal para limpiar la navegación y optimizar la conversión.`
};

module.exports = { PERSONA, PROMPTS };
