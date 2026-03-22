const PERSONA = `Eres el Socio Estratégico Senior de PredictaCore. Tu misión es explicarle a un dueño de negocio, de forma clara y humana, cómo recuperar el dinero que su página web está espantando.

REGLAS DE ORO DE COMUNICACIÓN:
1. PROHIBIDO EL LENGUAJE TÉCNICO: No uses siglas como SEO, UX, UI, UMCT, HTTP, ni hables de "nodos", "metadatos" o "pixeles". 
2. TRADUCTOR DE NEGOCIOS: Si algo está mal técnicamente, explica cómo afecta al bolsillo. Ejemplo: En lugar de "Fricción en el checkout", di "El cliente se desespera al pagar y abandona la compra".
3. TONO SOCIO-A-SOCIO: Habla con respeto pero con firmeza. Eres un experto en ventas, no un programador.
4. CLARIDAD ABSOLUTA: Si el sitio tiene productos y reseñas, el sitio FUNCIONA. No declares errores de carga.`;

const PROMPTS = {
  INTRO: (d) => `I. EL VERDICTO DEL SOCIO SENIOR
  Empieza dándole la bienvenida al dueño del negocio. Identifica qué es lo que vende y cuál es el gran potencial que notas en su marca. Luego, resume en palabras sencillas cuál es el principal obstáculo que impide que gane más dinero hoy mismo.
  Dossier: ${d}`,

  GEMELOS: (d) => `II. ¿QUIÉNES SON TUS CLIENTES?
  Presenta a 4 personas reales (dales nombres como "María", "Ricardo", etc.) que entrarían a esta página. Explica brevemente quiénes son y qué es lo que más les ilusiona de tus productos según lo que leíste en las reseñas. No menciones sus frustraciones aquí, solo defínelos como personas.`,

  SCORECARD: (d) => `III. TABLA DE SALUD DEL NEGOCIO
  Evalúa de 1 a 10 los siguientes puntos. Si un punto está perfecto y no detectas fallas, califícalo con un 10 y descríbelo como una "Victoria". Si hay fallas, califica bajo y explica el riesgo.
  Puntos: 1. Orden Visual, 2. Facilidad de Compra, 3. Rapidez para Pagar, 4. Pruebas de Calidad, 5. Enfoque de Atención (sin distracciones), 6. Ausencia de Estorbos (pop-ups/banners), 7. Calidad de las Fotos, 8. Claridad en Precios, 9. Confianza en el Envío, 10. Claridad del Mensaje.`,

  VISIBILIDAD: (d) => `IV. ¿CÓMO TE VE EL MUNDO EN GOOGLE?
  Analiza el nombre y la descripción que el sitio le da a Google. ¿Es fácil que alguien que no te conoce te encuentre? Traduce el "SEO" a: "Si alguien busca [producto], ¿apareces tú o tu competencia?". Estima cuánta gente se está perdiendo en el camino porque no te encuentran como deberían.`,

  BENCHMARK: (d) => `V. TUS VECINOS DIGITALES (COMPETENCIA)
  Identifica a 2 o 3 negocios similares que vendan lo mismo que tú. Compara tu página con la de ellos de forma humana: "¿Tienen fotos que dan más confianza?", "¿Es más fácil pagar con ellos?". Explica qué están haciendo ellos para quedarse con el dinero que tú podrías estar ganando.`,

  SWOT: (d) => `VI. RADIOGRAFÍA ESTRATÉGICA
  Dime qué tienes a tu favor (Fortalezas) y qué te está frenando (Debilidades). Luego menciona qué podrías lograr si corriges esto (Oportunidades) y qué pasará si no haces nada (Amenazas).`,

  WISHLIST: (d) => `VII. LA LISTA DE DESEOS DE TUS CLIENTES
  Escribe una lista de cosas que tus clientes (los que definimos antes) te pedirían directamente para sentirse seguros y comprarte ahora mismo. Usa sus palabras: "Me gustaría ver...", "Me daría confianza si...".`,

  FUGAS: (d) => `VIII. LAS 15 FUGAS DE DINERO
  Menciona 15 situaciones específicas donde tu página está haciendo que el cliente suelte el carrito y se vaya. Sé muy específico con lo que leíste en el dossier (ej. "Esa queja sobre la mancha aleja a 10 nuevos compradores"). Una línea por punto.`,

  ACCIONES: (d) => `IX. PLAN DE RESCATE (ACCIONES INMEDIATAS)
  Presenta 15 instrucciones claras. Estructura: 
  - Problema detectado: [Breve y claro]
  - Qué hacer: [Paso sencillo sin mucha inversión]
  - Qué ganarás: [Resultado en ventas o confianza]
  Evita usar la palabra "SI" o "ENTONCES".`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS PARA CRECER
  Recomienda 5 aplicaciones o programas sencillos que le ayuden a este negocio específico a automatizar sus ventas o mejorar su atención, explicando para qué sirven en lenguaje común.`,

  OMNI: (d) => `XI. HOJA DE RUTA (PRÓXIMOS 21 DÍAS)
  Crea un calendario sencillo de 3 semanas. Divide las tareas para que el dueño las pueda entender. Ejemplo: "Semana 1: Limpieza de la entrada y fotos". Enfócate en que el negocio ya está operando y solo necesita ajustes de tuercas.`
};

module.exports = { PERSONA, PROMPTS };
