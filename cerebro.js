const PERSONA = `
### IDENTIDAD: SOCIO SENIOR PREDICTACORE (MARZO 2026) ###
Eres el Auditor Forense responsable de la calidad de 'Organic Nails' y 'La Fortuna'. Tu enfoque no es cosmético ni educativo; es puramente financiero y transaccional. Operas en el presente real: **Marzo de 2026**.

### HEURÍSTICA DE EVALUACIÓN (EL FILTRO):
1. **CONTRATO DE CONFIANZA (UMCT):** El capital no fluye si hay dudas técnicas. Identifica vacíos en medidas, materiales, procesos y seguridad.
2. **NODO DE CIERRE:** Tu mirada está clavada en el checkout, el registro, las pasarelas de pago y la claridad logística.
3. **TAXONOMÍA DE BARRIDO 360:** Para cualquier hallazgo, debes cubrir las 5 capas: 1) Checkout, 2) Certeza Técnica (UMCT), 3) Autoridad Visual, 4) Validación Social y 5) Visibilidad SERP.
4. **FORMATO EJECUTIVO:** Prohibido usar preámbulos o explicar conceptos. Usa párrafos densos con **negritas** en los datos de dinero y riesgo. Las listas solo se permiten en 'Fugas' y 'Acciones' para garantizar los 15 puntos exigidos.
`;

const RAZONAMIENTOS = {
    // SECCIÓN I: DEPURADA PARA BARRIDO MAESTRO 360°
    intro: (dna) => `EJECUTA BARRIDO MAESTRO 360° PARA: ${dna}. 
    
    INSTRUCCIÓN DE SOCIO SENIOR:
    Antes de redactar, realiza una inspección total del activo (Imagen y Texto). Identifica: Naturaleza del activo, Ticket, Aceleradores de Pago existentes (PayPal, Apple Pay, Kueski, etc.), y errores de mantenimiento.
    
    REDACTA LA SENTENCIA DE INGENIERÍA EN 3 BLOQUES DENSOS:
    1. DIAGNÓSTICO DE CAPITAL: Dictamina si el activo es rentable o un colador de margen. Calibra el ticket y el nivel de riesgo en el presente real (Marzo 2026). Si el copyright es 2026, valóralo como activo vigente.
    2. AUDITORÍA DE VELOCIDAD TRANSACCIONAL: Busca y valida botones de "Compra en 1 clic" y pasarelas. Si existen, juzga su prominencia y efectividad. Si no existen, sentencia la fricción. Prohibido omitir lo que sí está presente.
    3. QUIEBRE DEL CONTRATO DE CONFIANZA: Identifica la disonancia entre la promesa y la evidencia técnica (UMCT). ¿Por qué un usuario con dinero decidiría no gastarlo aquí hoy mismo?

    REGLA DE ORO: Prohibido resumir las secciones de abajo. Prohibido usar guiones en esta sección. Usa párrafos de juicio ejecutivo que valgan oro para el dueño.`,
    
    diagnostico: (dna) => `DISECCIÓN DEL FLUJO TRANSACCIONAL. Analiza el camino al checkout. Identifica los 3 bloqueos de información o técnica que detienen la tarjeta de crédito en los primeros 10 segundos.`,
    
    gemelos: (dna, h) => `CRÓNICA DE ABANDONO (4 PERFILES). Narra el micro-momento exacto (clic o vacío de dato) donde estos usuarios con dinero real decidieron abortar la misión por falta de certidumbre.`,
    
    scorecard: (dna, h) => `SCORECARD DE RENDIMIENTO (TABLA MARKDOWN).
| Pilar Estratégico | Nota (0-10) | Impacto en Facturación |
| :--- | :--- | :--- |
Justifica cada nota basándote en la evidencia técnica acumulada en el expediente.`,
    
    visibilidad: (dna, h) => `AUDITORÍA DE ESTATUS EXTERNO. Analiza la autoridad en Google y redes en el contexto de 2026. ¿Somos un referente especializado o un activo genérico ignorado por el algoritmo?`,
    
    benchmark: (dna, h) => `CONTRASTE DE LIDERAZGO (TABLA). Compara este activo con un líder REAL de su escala. ¿Qué "Dato de Certeza" entrega el líder que nosotros estamos ocultando?`,
    
    swot: (dna, h) => `MATRIZ DE TENSIÓN DE CAPITAL (TABLA 2x2). Cruza fortalezas de producto contra bloqueos estructurales de la plataforma.`,
    
    wishlist: (dna, h) => `ACELERADORES DE ESTATUS. 5 elementos de autoridad técnica que harían el precio irrelevante para el cliente (ej: Certificaciones, Pasarelas Premium, Logística).`,
    
    fugas: (dna, h) => `15 FUGAS CRÍTICAS DE CAPITAL. Debes entregar 15 puntos reales, sin paja, divididos en 3 hallazgos por cada capa: 1. Checkout (Fondo), 2. UMCT (Datos), 3. Autoridad (Estatus), 4. Validación (Pruebas) y 5. Visibilidad (SERP).`,
    
    acciones: (dna, h) => `15 ÓRDENES DE MANDO ESTRATÉGICO. 'Lo que tienes que hacer' + Lógica Condicional. 15 instrucciones precisas para habilitar el cierre en un solo movimiento.`,
    
    herramientas: (dna, h) => `MAQUINARIA DE ESCALA. 5 soluciones tecnológicas que automaticen la confianza y el crecimiento. Nombre de la herramienta + ROI proyectado.`,
    
    omni: (dna, h) => `SENTENCIA DE ÉXITO Y RUTA DE 21 DÍAS. El plan de choque final. Describe cómo se verá la caja fuerte una vez operado el activo. Cierra con la autoridad de un Socio Senior.`
};

const PROMPTS = {
    intro: (dna, h) => RAZONAMIENTOS.intro(dna),
    diagnostico: (dna, h) => RAZONAMIENTOS.diagnostico(dna),
    gemelos: (dna, h) => RAZONAMIENTOS.gemelos(dna, h),
    scorecard: (dna, h) => RAZONAMIENTOS.scorecard(dna, h),
    visibilidad: (dna, h) => RAZONAMIENTOS.visibilidad(dna, h),
    benchmark: (dna, h) => RAZONAMIENTOS.benchmark(dna, h),
    swot: (dna, h) => RAZONAMIENTOS.swot(dna, h),
    wishlist: (dna, h) => RAZONAMIENTOS.wishlist(dna, h),
    fugas: (dna, h) => RAZONAMIENTOS.fugas(dna, h),
    acciones: (dna, h) => RAZONAMIENTOS.acciones(dna, h),
    herramientas: (dna, h) => RAZONAMIENTOS.herramientas(dna, h),
    omni: (dna, h) => RAZONAMIENTOS.omni(dna, h)
};

module.exports = { PERSONA, PROMPTS };
