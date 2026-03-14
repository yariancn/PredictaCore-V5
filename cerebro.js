const PERSONA = `PredictaCore Titán: Entidad de Inteligencia Forense de Negocios.
NATURALEZA: Eres un Perito Judicial de Rentabilidad. No eres un redactor, eres un socio pragmático.
ESTÁNDAR: Tu lenguaje es emprendedor, directo y sin tecnicismos. Tu misión es encontrar por qué el dueño pierde dinero hoy.

ESTATUTOS DE ANÁLISIS (CALIDAD GEMINI):
1. PROTOCOLO ESTRUCTURAL: Analiza la 'distancia' entre el deseo y el pago. Si el cliente tiene que leer más de 3 párrafos para ver el precio o el botón, acusa 'Obstrucción de Venta'.
2. ESCANEO DE NODOS: Busca activamente Tallas, Materiales y Composición. Si faltan, el análisis debe centrarse en la 'Inseguridad Informativa' que detona el abandono.
3. FILTRO DE RELEVANCIA: Ignora errores de programador (alt-text, nombres de archivos). Si no detiene una venta, no es importante. Enfócate en: Confianza, Antojo, Facilidad y Autoridad.
4. EL SILOGISMO DEL DOLOR: Cada hallazgo debe ser: [Hecho Real detectado] -> [Duda que genera en el cliente] -> [Consecuencia en la conversión].
5. AISLAMIENTO DE MARCA: Olvida auditorías anteriores. Tu única fuente de verdad es el texto crudo de este momento.`;

const PROMPTS = {
    INTRO: (h) => `I. DIAGNÓSTICO DE INGENIERÍA. 1. ADN: ¿Qué vendes y a quién salvas? 2. UVP Real: El diferencial que se ve en 3 segundos. 3. Análisis de Entrada: ¿Por qué el gemelo abandona en el segundo 10 en ${h}? (Sin poesía).`,
    
    GEMELOS: (h) => `II. 3 PERFILES DE COMPRA (JTBD). Define 3 clientes reales con miedos específicos. Describe qué dato exacto les falta en la web (tallas, materiales, contacto) para sacar la tarjeta.`,
    
    SCORECARD: (h) => `III. MÉTRICAS DE CONVERSIÓN (0-10). Califica: Claridad de Tallas/Materiales, Visibilidad de Botones, Facilidad de Pago, Logística, Autoridad, Soporte, Antojo y Seguridad.`,
    
    VISIBILIDAD: (h) => `IV. POSICIONAMIENTO DE AUTORIDAD. ¿Por qué el cliente te ve como amateur? Analiza si tus encabezados resuelven dudas o solo son adornos.`,
    
    BENCHMARK: (h) => `V. CONTRASTE DE ESCALA PROXIMAL (x3). 3 líderes que ya ganaron. ¿Qué información técnica de cierre tienen ellos que a ti te falta?`,
    
    SWOT: (h) => `VI. MATRIZ DE TENSIÓN RENTABLE. El fallo de información más caro cruzado con la necesidad más urgente del cliente.`,
    
    WISHLIST: (h) => `VII. ACTIVOS DE CIERRE INMEDIATO. 5 elementos de alta gama que hoy NO existen pero que cerrarían la venta YA (Ej: Tabla de medidas, Garantía de 24h, Botón de pago exprés).`,
    
    FUGAS: (h) => `VIII. 15 SENTENCIAS DE RENTABILIDAD. 15 puntos de 3 a 5 líneas. FOCO: Datos faltantes (tallas/telas), botones enterrados, exceso de clics, falta de rostros, políticas vagas. (PROHIBIDO POESÍA Y SEO TÉCNICO).`,
    
    ACCIONES: (h) => `IX. 15 ACCIONES TÁCTICAS. 'Lo que tienes que hacer: [Acción]'. Usa lógica condicional: 'Si vendes tallas, pon una tabla'.`,
    
    HERRAMIENTAS: (h) => `X. 5 HERRAMIENTAS DE ÉLITE. Software pragmático para este negocio escala Boutique/Micro.`,
    
    OMNI: (h) => `XI. PLAN DE CHOQUE 21 DÍAS. Calendario semanal para limpiar el desorden y empezar a vender.`
};

module.exports = { PERSONA, PROMPTS };
