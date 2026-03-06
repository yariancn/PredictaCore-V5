const PERSONA = `Eres el estratega de PredictaCore. Tu lenguaje es emprendedor, directo y empático con el dueño del negocio. 
No eres directivo ni regañón. Eres un aliado técnico que identifica dónde se pierde el dinero.
REGLA DE ORO: No inventes datos. Si no ves información de materiales, precios, tallas,colores o segun lo esencial que necesite el negocio para vender en el DNA, denúncialo como una falla.
PROHIBICIÓN: No te presentes en cada sección. No uses el término JTBD después de la introducción.
CADA PUNTO: 3 a 5 líneas de análisis profundo y táctico.`;

const PROMPTS = {
    INTRO: (dna) => `Genera la INTRODUCCIÓN ÚNICA para ${dna}. 
    Explica quién es PredictaCore (ingeniería de conversión), qué hacemos (auditoría forense con gemelos sintéticos) y por qué somos el aliado que el emprendedor necesita para dejar de adivinar. Menciona la metodología de 'trabajo contratado' (JTBD) una sola vez aquí.`,

    DNA: (dna) => `DIAGNÓSTICO DE INGENIERÍA para ${dna}. 
    Analiza la arquitectura visual y la facilidad de encontrar botones. Si el sitio no muestra claramente guías de tallas o etiquetas de composición, documéntalo como un error estructural de ventas. Sé realista con lo que hay en pantalla.`,

    GEMELOS: (dna) => `Identidad de los Gemelos Sintéticos para ${dna}. 
    1. ANA: Define su perfil (madre primeriza, busca seguridad). 
    2. ROBERTO: Define su perfil (padrino/comprador de regalos, busca rapidez). 
    Limítate a su identidad psicológica; sus problemas van en las secciones siguientes.`,

    SCORECARD: (dna) => `SCORECARD DE 10 PUNTOS para ${dna}. 
    Puntos: 1. Gancho, 2. Precios, 3. Flujo de Compra, 4. Jerarquía Visual, 5. Visibilidad de Tallas/Etiquetas, 6. Confianza, 7. Prueba Social, 8. Navegación Móvil, 9. Autoridad, 10. Soporte. 
    Califica y da 5 líneas de análisis por punto.`,

    VISIBILIDAD: (dna) => `AUDITORÍA DE VISIBILIDAD para ${dna}. 
    Analiza por qué el cliente encuentra antes a Etsy que a tu web en Google. Analiza la falta de ficha local en Texas y cómo eso mata la confianza en US/Canada.`,

    BENCHMARK: (dna) => `BENCHMARKING DE NICHO para ${dna}. 
    Compara objetivamente contra Caden Lane y Pottery Barn Kids. ¿Qué hacen ellos con sus guías de tallas y botones de personalización que tú no estás haciendo?`,

    SWOT: (dna) => `MATRIZ ESTRATÉGICA para ${dna}. 
    Fortalezas (producto real), Oportunidades (bundles), Debilidades (navegación ciega) y Amenazas (competencia masiva). 5 líneas por punto.`,

    WISHLIST: (dna) => `LISTA DE DESEOS (Lo que el cliente sueña) para ${dna}. 
    Sugerencias de lo que NO hay: Visualizador de nombres, empaque premium grabado, certificaciones textiles, guías de medidas en 3D.`,

    FUGAS: (dna) => `Identifica 15 FUGAS DE CAPITAL en ${dna}. 
    Enfoque en: Botones que no resaltan, falta de etiquetas de cuidado, errores de precio (-0%), incertidumbre de medidas y dependencia de marcas externas. Impacto financiero por cada punto.`,

    ACCIONES: (dna) => `15 ACCIONES TÁCTICAS para ${dna}. 
    Formato: "Lo que tienes que hacer: [Acción]". 
    Usa lógica: 'Si el cliente no sabe si la cobija cabe en la cuna, instala una guía visual'. Acciones directas y sin rodeos.`,

    HERRAMIENTAS: (dna) => `5 HERRAMIENTAS DE ESCALA para ${dna}. 
    Zakeke (personalización), Loox (reseñas con fotos), Klaviyo (retención), Gorgias (soporte), Lucky Orange (mapas de calor).`,

    ROADMAP: (dna) => `HOJA DE RUTA DE 21 DÍAS para ${dna}. 
    Plan semanal para profesionalizar la web, limpiar errores de Shopify y activar la conversión.`
};

module.exports = { PERSONA, PROMPTS };
