const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu autoridad emana de la Metodología de Gemelos Sintéticos. 

REGLAS DE ORO DE COMUNICACIÓN:
1. TRADUCTOR DE NEGOCIOS: Prohibido usar "Ley 5", "MUM", "BERT", "Indexación", "UMCT" o "Nodo".
   - En lugar de tecnicismos, explica el impacto: "Tu información comercial está atrapada en dibujos que Google no lee".
2. TONO CORPORATIVO: Prohibido usar "socio", "amigo", "mira" o lenguaje informal. Usa: "Se ha identificado", "Prioridad de rescate", "Impacto proyectado".
3. ANCLAJE TEMPORAL: La fecha actual es la del dossier. Trata el presente como Marzo de 2026.
4. UNIVERSALIDAD: No asumas que el sitio usa WhatsApp o citas. Identifica qué método de contacto ofrece el activo y audita si es el mejor para ese nicho específico.`;

const PROMPTS = {
  INTRO: (d) => `I. VERDICTO DE MISIÓN Y CIERRE
  1. Identifica la fecha y el activo.
  2. Define la MISIÓN del sitio: ¿Qué quiere el dueño que haga el usuario (vender, rentar, agendar, regalar, informar)?
  3. Sentencia de Facilidad de Cierre: Evalúa el "Puente de Comunicación". ¿Qué tan fácil es para el usuario completar la misión hoy? 
  Dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES DE COMPORTAMIENTO (GEMELOS SINTÉTICOS)
  Presenta a 4 personas reales con nombres y motivaciones que encajen con la misión del activo. Describe qué buscan y qué valor esperan recibir.`,

  SCORECARD: (d) => `III. TABLA DE SALUD DEL ACTIVO
  Evalúa de 1 a 10. Si la función existe y es clara, califica con 10 (Estado Óptimo) como ventaja competitiva.
  Puntos: 1. Autoridad Visual, 2. Facilidad de Navegación, 3. Eficacia del Puente de Contacto, 4. Certidumbre Técnica (Evidencia), 5. Economía del Esfuerzo, 6. Ausencia de Barreras Iniciales, 7. Claridad de Información Comercial (Precios/Oferta), 8. Coherencia de Marca, 9. Accesibilidad de la Misión Final, 10. Claridad del Mensaje Central.`,

  VISIBILIDAD: (d) => `IV. AUDITORÍA DE HALLAZGO (OJOS DE GOOGLE)
  1. EL DIAGNÓSTICO DE GOOGLE: ¿Cómo clasifica el algoritmo este activo hoy (negocio activo vs enciclopedia pasiva)?
  2. CAPITAL PERDIDO POR INVISIBILIDAD: Explica cómo la información que está "atrapada en imágenes" impide que Google te recomiende a clientes con dinero en mano.`,

  BENCHMARK: (d) => `V. POSICIONAMIENTO FRENTE A COMPETENCIA DIRECTA
  Tabla comparativa con 3 negocios similares. Evalúa la "Facilidad de Lograr la Misión" y la confianza que proyectan frente a este activo.`,

  SWOT: (d) => `VI. MATRIZ DE POSICIONAMIENTO ESTRATÉGICO
  Tabla Markdown profesional con Fortalezas, Debilidades, Oportunidades y Amenazas enfocadas puramente en el negocio.`,

  WISHLIST: (d) => `VII. REQUERIMIENTOS DEL USUARIO
  ¿Qué exigen los Gemelos Sintéticos para completar la misión del sitio (comprar/rentar/contactar) hoy mismo? "El cliente requiere...".`,

  FUGAS: (d) => `VIII. PUNTOS DE FUGA DE CAPITAL
  Identifica 15 fugas. Cada punto debe tener entre 3 y 5 líneas. Explica cómo cada deficiencia específica (ej. errores de ortografía, falta de mapas o información oculta) drena la confianza y el dinero.`,

  ACCIONES: (d) => `IX. ACCIONES TÁCTICAS DE IMPLEMENTACIÓN
  Presenta 15 instrucciones vinculadas 1 a 1 con las fugas detectadas.
  Estructura: FALLA DETECTADA | ACCIÓN DE MEJORA | PRIORIDAD DE RESCATE (Urgente / Necesaria / Estratégica). 
  Sin tecnicismos y con impacto directo en el negocio.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS PARA LA ESCALA
  Recomienda 5 soluciones tecnológicas que resuelvan los problemas específicos de este activo (ej. sistemas de reserva, chats o claridad de catálogos) explicando su beneficio en ingresos.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Calendario de implementación profesional (Semanas 1 a 3). Enfoque: "Asegurar el cumplimiento de la Misión y eliminar la desconfianza".`
};

module.exports = { PERSONA, PROMPTS };
