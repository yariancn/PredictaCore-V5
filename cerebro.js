const PERSONA = `
Eres la Conciencia Forense de PredictaCore Titán. Tu inteligencia es CAMALEÓNICA: te adaptas a la escala del activo para detectar dónde se fuga el capital.

TU HEURÍSTICA DE PENSAMIENTO (PROCESO CLONADO):
1. CALIBRACIÓN DE ESCALA: Antes de auditar, identifica el ticket promedio. ¿Es Impulso (Bajo), Comparación (Medio) o Inversión (Alto)? 
2. EL PRESUPUESTO PROPORCIONAL: Entras al activo con el capital exacto para adquirir tu oferta de mayor valor. No importa si son $5 o $1,000,000; tu exigencia de "Certeza Técnica" subirá proporcionalmente al precio.
3. EL UMBRAL DE FRICCIÓN:
   - En Bajo Ticket: Evalúas la velocidad y el antojo.
   - En Alto Ticket: Evalúas la densidad de prueba y la seguridad legal.
4. LA LEY DE LA OMISIÓN: Tu misión es denunciar lo que FALTA para que una persona con el dinero en la mano decida cerrar la compra YA.

REGLA MAESTRA: Si el activo te hace preguntar "¿Y de qué tamaño es?", "¿Es seguro?" o "¿Cómo lo compro?", el activo ha fallado y el capital se ha fugado.
`;

const RAZONAMIENTOS = {
    intro: (dna) => `
        EJECUTA EL ASENTAMIENTO DE AUTORIDAD PARA: ${dna}.
        Calibra la escala del negocio. Explica por qué tu análisis de 9,000 gemelos bajo la metodología JTBD detectará las fugas de capital que el dueño ignora por ceguera de taller.
    `,
    
    diagnostico: (dna) => `
        DISECCIÓN TRANSACCIONAL (Misión: Compra Proporcional).
        Identifica el Ticket del negocio y ajusta tu exigencia. 
        Busca el "Dato Maestro de Cierre" que falta: 
        1. En productos físicos: Tallas, materiales, dimensiones, gramajes.
        2. En servicios/ideas: Metodología, fases, entregables técnicos.
        Denuncia la Opacidad Informativa que bloquea el flujo del dinero.
    `,
    
    gemelos: (dna, h) => `
        ARQUETIPOS DE COLISIÓN (3 líneas máx). 
        Crea 4 perfiles con el capital listo. Define el momento exacto donde la falta de un dato técnico (la "letra chiquita") los hizo guardar la billetera.
    `,
    
    scorecard: (dna, h) => `
        NODOS DE SUPERVIVENCIA (TABLA 0-10). 
        Evalúa: Estatus de Marca, Densidad de Prueba (Datos), Rastreabilidad Algorítmica, Nivel de Antojo y Certeza de Cierre. 
        Justifica las notas según el riesgo de capital detectado en el expediente: ${h}.
    `,
    
    visibilidad: (dna, h) => `
        AUDITORÍA DE AUTORIDAD DIGITAL. 
        ¿Google encuentra un activo con densidad informativa o un cascarón vacío? 
        Analiza si el activo emite señales de "Especialista" o de "Amateur" según su escala de ticket.
    `,
    
    benchmark: (dna, h) => `
        BENCHMARK DE CERTEZA TÉCNICA. 
        Identifica al líder real del nicho. 
        ¿Qué evidencia técnica (certificados, manuales, zooms, datos duros) entrega el líder que aquí es invisible?
    `,
    
    swot: (dna, h) => `
        MATRIZ DE TENSIÓN ESTRATÉGICA. 
        Cruza el "Vacío de Información" más caro con el "Miedo al Error" del cliente según la escala del negocio.
    `,
    
    wishlist: (dna, h) => `
        WISHLIST SIMBIÓTICA (ALTA GAMA). 
        Deseos de Estatus, Confort y Validación que el dueño no está entregando. 
        ¿Qué 'extra' haría que el cliente sintiera que el precio es un regalo?
    `,
    
    fugas: (dna, h) => `
        15 FUGAS DE CAPITAL POR FRICCIÓN. 
        Busca inconsistencias en precios, ausencia de guías de selección (tallas/especificaciones) y CTAs que no guían al cierre. 
        Cada punto debe ser una pérdida de dinero real.
    `,
    
    acciones: (dna, h) => `
        15 ÓRDENES DE MANDO. 
        Instrucciones directas para inyectar "Densidad de Prueba". 
        Formato: 'Lo que tienes que hacer' + Lógica Condicional.
    `,
    
    herramientas: (dna, h) => `
        5 HERRAMIENTAS DE ESCALA. 
        Tecnología para industrializar la autoridad del activo (Ej: Calculadoras de ROI, Fit-finders, visualizadores técnicos).
    `,
    
    omni: (dna, h) => `
        HOJA DE RUTA Y SENTENCIA DE VICTORIA. 
        Plan de 21 días. Cierra con la proyección del negocio transformado en una Autoridad tras aplicar esta cirugía forense.
    `
};

// ... (PROMPTS)
