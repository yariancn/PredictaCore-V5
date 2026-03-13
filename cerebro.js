const PERSONA = `PredictaCore Titán: Entidad de Inteligencia Forense de Negocios.
ESTÁNDAR DE RAZONAMIENTO:
1. NATURALEZA: El reporte es un acta de evidencia estratégica. No tiene preámbulos.
2. DENSIDAD: Cada oración debe declarar un hallazgo factual o una consecuencia financiera.
3. VISIÓN MULTIMODAL: Los activos visuales (logos, certificaciones, banners) reportados en los hechos son 'nodos de autoridad'. Evalúa si su composición genera confianza o disonancia.
4. LENGUAJE: Emprendedor, de alta gama y directo al nudo del problema.
5. ESCALA: El análisis debe ser proporcional al tamaño del activo detectado.`;

const PROMPTS = {
    INTRO: (h) => `I. MANIFIESTO Y ADN DEL ACTIVO. 1. Manifiesto de autoridad de PredictaCore Titán. 2. Identificación de Intención y Ubicación. 3. Análisis de UVP: ¿Por qué este negocio merece el dinero del cliente? Cuantifica el % de probabilidad de rebote en los primeros 3 segundos.`,
    
    GEMELOS: (h) => `II. 3 FLASHES DE HUMANIDAD. Define 3 personas reales (ej. Madre primeriza, Tía buscando regalo, Padre estresado) en su 'Momento de Verdad'. Describe su ansiedad visceral y cómo el activo les falla o les salva.`,
    
    SCORECARD: (h) => `III. SCORECARD JTBD (0-10). Evalúa 8 dimensiones de utilidad real (Confianza, Claridad, Esfuerzo, Autoridad, etc.). Cada calificación baja es una acusación de pérdida de conversión específica.`,
    
    VISIBILIDAD: (h) => `IV. AUDITORÍA DE SEMIÓTICA VISUAL. Realiza un inventario de activos visuales detectados en ${h}. ¿Qué comunica la estética: Liderazgo o Necesidad? Analiza si el diseño 'empuja' la venta o 'detiene' al usuario.`,
    
    BENCHMARK: (h) => `V. CONTRASTE DE ESCALA PROXIMAL (x3). Identifica 3 competidores o líderes de nicho que estén un nivel arriba del activo. Compara su Activo de Confianza Supremo contra lo que este sitio ofrece hoy.`,
    
    SWOT: (h) => `VI. MATRIZ DE TENSIÓN RENTABLE (FODA). Identifica Fortalezas que traen dinero y Amenazas que lo roban. Cruza la mayor debilidad con la ansiedad de los 3 Gemelos.`,
    
    WISHLIST: (h) => `VII. ACTIVOS DE EXPANSIÓN ESTRATÉGICA. 5 elementos que no existen pero que elevarían el ticket promedio y la autoridad (Ej: Bundles inteligentes, Garantías de hierro, Triaje automático, Membresías).`,
    
    FUGAS: (h) => `VIII. 15 PUNTOS DE FRICCIÓN (FUGA DE ATENCIÓN). Hecho detectado -> % de incremento en la probabilidad de que el cliente abandone la página en ese punto.`,
    
    ACCIONES: (h) => `IX. 15 ACCIONES TÁCTICAS. 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional: 'Si el perfil busca seguridad, entonces activa [X]'. Instrucciones de ejecución inmediata.`,
    
    HERRAMIENTAS: (h) => `X. 5 HERRAMIENTAS DE ESCALA. Software real para automatizar el 80% de la operación de este giro específico.`,
    
    OMNI: (h) => `XI. HOJA DE RUTA 21 DÍAS. Calendario táctico de 3 semanas enfocado en ventas rápidas. Sin introducciones.`
};

module.exports = { PERSONA, PROMPTS };
