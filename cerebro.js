const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu enfoque es puramente ejecutivo: traduces fallas en pérdidas de dinero. 

REGLAS INQUEBRANTABLES:
1. TRADUCTOR DE NEGOCIOS: Prohibido usar "Ley 5", "UMCT", "SEO", "Indexable" o "Algoritmo". 
   - Mal: "Fricción en el nodo de cierre".
   - Bien: "El cliente se pierde al intentar contactar; el proceso es confuso y lento".
2. ANCLAJE TEMPORAL: La fecha actual es la del dossier. Trata el año 2026 como el presente absoluto.
3. UNIVERSALIDAD DE MISIÓN: No asumas que el sitio vende. Identifica si la misión es rentar, agendar, regalar o informar, y audita la facilidad de lograrlo.
4. TONO CORPORATIVO: Sin "socio" ni "amigo". Usa: "Se ha detectado", "Impacto financiero", "Prioridad de rescate".`;

const PROMPTS = {
  INTRO: (d) => `I. VERDICTO DE MISIÓN Y FACILIDAD DE CIERRE
  1. Identifica la fecha y el activo analizado.
  2. Define la MISIÓN DEL ACTIVO: ¿Qué resultado final busca el dueño (rentar, vender, captar datos, informar)?
  3. Sentencia de Facilidad de Cierre: ¿Qué tan fácil es para el usuario lograr esa misión hoy? Evalúa la distancia y claridad del "Puente de Comunicación" detectado en el dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES DE COMPORTAMIENTO (GEMELOS SINTÉTICOS)
  Presenta a 4 personas con nombres y motivaciones que encajen con la misión del activo. Describe qué buscan y qué valor esperan recibir antes de soltar el dinero o sus datos.`,

  SCORECARD: (d) => `III. TABLA DE SALUD DEL ACTIVO
  Evalúa de 1 a 10. Si la función existe y es clara, califica con 10 (Estado Óptimo) como Fortaleza.
  Puntos: 1. Orden Visual, 2. Fluidez de Navegación, 3. Eficacia del Puente de Contacto, 4. Pruebas de Calidad (Evidencia), 5. Economía del Esfuerzo, 6. Ausencia de Estorbos Iniciales, 7. Claridad de Información Comercial (Precios/Oferta), 8. Coherencia de Marca, 9. Accesibilidad de la Misión Final, 10. Claridad del Mensaje Central.`,

  VISIBILIDAD: (d) => `IV. ¿CÓMO TE CLASIFICA GOOGLE REALMENTE?
  Analiza el Título y Descripción SEO. 
  1. DIAGNÓSTICO DE GOOGLE: ¿Te clasifica como un negocio activo listo para transaccionar o como una página de información pasiva?
  2. CAPITAL PERDIDO POR INVISIBILIDAD: Explica cómo la información que está "atrapada en imágenes" impide que los clientes te encuentren cuando buscan soluciones inmediatas.`,

  BENCHMARK: (d) => `V. POSICIONAMIENTO FRENTE A COMPETENCIA DIRECTA
  Tabla comparativa con 3 negocios que pelean por el mismo cliente. Compara la "Facilidad de Lograr la Misión". ¿Por qué el cliente preferiría al vecino?`,

  SWOT: (d) => `VI. MATRIZ DE POSICIONAMIENTO ESTRATÉGICO
  Genera una tabla Markdown profesional con Fortalezas, Debilidades, Oportunidades y Amenazas enfocadas en el ROI.`,

  WISHLIST: (d) => `VII. REQUERIMIENTOS DEL USUARIO
  Lista de peticiones directas de los clientes para completar la misión (comprar/rentar) hoy mismo. "El cliente requiere...".`,

  FUGAS: (d) => `VIII. PUNTOS DE FUGA DE CAPITAL
  Identifica 15 fugas. Cada punto debe tener entre 3 y 5 líneas. Explica la falla y cómo esa deficiencia específica (ej. errores de ortografía, falta de mapas o información oculta) drena la confianza y el capital.`,

  ACCIONES: (d) => `IX. ACCIONES TÁCTICAS DE RESCATE
  Presenta 15 instrucciones vinculadas 1 a 1 con las fugas anteriores.
  Estructura: FALLA DETECTADA | ACCIÓN DE MEJORA | PRIORIDAD DE RESCATE (Urgente / Necesaria / Estratégica). 
  Sin tecnicismos: instrucciones claras para el dueño del negocio.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS PARA LA ESCALA
  Recomienda 5 soluciones que resuelvan los problemas específicos de la misión de este activo (ej. sistemas de reserva, catálogos claros o chats) explicando su beneficio directo en ingresos.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Calendario de implementación profesional (Semanas 1 a 3). Marzo 2026. Enfoque: "Eliminar el ruido y asegurar el cumplimiento de la Misión".`
};

module.exports = { PERSONA, PROMPTS };
