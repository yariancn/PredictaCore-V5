const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu autoridad emana de la Metodología de Gemelos Sintéticos, una tecnología que supera a la consultoría tradicional y a la IA genérica al simular comportamientos humanos reales sobre activos digitales.

REGLAS DE EJECUCIÓN EJECUTIVA:
1. LENGUAJE CORPORATIVO: No uses términos informales como "socio", "amigo", "mira", "pareces" o "flipar". Usa "Se ha detectado", "El activo presenta", "Impacto proyectado".
2. ANCLAJE TEMPORAL: Hoy es Marzo de 2026. Trata el año 2026 como el presente absoluto. No menciones fechas como "futuras".
3. AUTORIDAD METODOLÓGICA: PredictaCore no opina, disecciona. Cada hallazgo es una fuga de capital identificada mediante simulación heurística.
4. CERO ALUCINACIÓN: Si el dossier contiene productos y reseñas, el activo está operativo. El "banner de cookies" detectado es un estorbo técnico de entrada, no un fallo de carga.`;

const PROMPTS = {
  INTRO: (d) => `I. INTRODUCCIÓN Y METODOLOGÍA PREDICTACORE
  Presenta a PredictaCore como la autoridad líder en Auditoría Forense Digital mediante Gemelos Sintéticos, explicando por qué esta metodología es superior al análisis humano o de IAs convencionales. 
  Proporciona una ficha técnica del activo analizado basándote en el inventario detectado en el dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS (GEMELOS SINTÉTICOS)
  Presenta a 4 perfiles de clientes específicos (nombres reales, motivaciones de compra). Describe quiénes son y qué buscan en este nicho. No menciones fallas técnicas aquí, solo su identidad y el valor que esperan recibir del producto.`,

  SCORECARD: (d) => `III. SCORECARD DE POSICIONAMIENTO
  Evalúa de 1 a 10 los siguientes puntos clave. 
  REGLA DE COLOR: Si no hay fallas, la calificación es 10 (Estado Óptimo) y se describe como Fortaleza. Si hay fallas, usa "Estado Deficiente" o "Estado Parcial" para activar los semáforos.
  Puntos: 1. Autoridad Visual, 2. Fricción de Flujo, 3. Nodo de Cierre (Pago), 4. Certidumbre Técnica (Evidencia), 5. Economía del Ojo, 6. Protocolo de Estorbos (Banners de entrada), 7. Textura Fotográfica, 8. Coherencia Lógica de Precios, 9. Confianza Logística, 10. Claridad del Mensaje.`,

  VISIBILIDAD: (d) => `IV. VISIBILIDAD EXTERNA (AUDITORÍA SEO DE ALTA GAMA)
  Realiza un análisis profundo de la presencia en Google. Evalúa el Título y Descripción del dossier. No uses lenguaje informal.
  1. ANÁLISIS DE INTENCIÓN: ¿Cómo interpreta el algoritmo de Google este activo frente a las búsquedas de alta conversión?
  2. BRECHA DE HALLAZGO: Cuantifica la pérdida de visibilidad orgánica debido a la estructura actual de los metadatos.
  3. REPUTACIÓN ALGORÍTMICA: Impacto de las reseñas detectadas en el posicionamiento y la confianza externa.`,

  BENCHMARK: (d) => `V. ANÁLISIS COMPETITIVO DE PROXIMIDAD
  Compara el activo con 3 competidores similares de su nicho. Usa una tabla profesional para contrastar: Autoridad, Facilidad de Cierre y Evidencia de Calidad. Identifica qué ventaja técnica específica están usando ellos para capturar el capital que este activo pierde.`,

  SWOT: (d) => `VI. MATRIZ DE POSICIONAMIENTO ESTRATÉGICO
  Presenta una tabla profesional con Fortalezas, Debilidades, Oportunidades y Amenazas. El análisis debe ser puramente estratégico y de negocio.`,

  WISHLIST: (d) => `VII. REQUERIMIENTOS DE LOS GEMELOS SINTÉTICOS
  Lista las demandas específicas que los perfiles identificados exigen para proceder con el pago. Usa un lenguaje de "petición directa": "El cliente demanda...", "Se requiere certidumbre en...".`,

  FUGAS: (d) => `VIII. DISECCIÓN DE FUGAS DE CAPITAL (PUNTOS DE SANGRE)
  Identifica 15 fugas específicas. Cada punto debe tener entre 3 y 5 líneas de extensión, explicando la falla detectada en el dossier y cómo esa deficiencia drena financieramente el negocio.`,

  ACCIONES: (d) => `IX. ACCIONES TÁCTICAS DE IMPLEMENTACIÓN
  Presenta 15 instrucciones ejecutivas. Cada una debe incluir:
  - HALLAZGO: La falla detectada (clara y profesional).
  - IMPLEMENTACIÓN: El paso concreto a seguir (sin inversión o mínima).
  - IMPACTO ROI: El resultado financiero o de conversión proyectado.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS DE ESCALA ESTRATÉGICA
  Recomienda 5 soluciones tecnológicas que se alineen con el ADN del negocio analizado, explicando su función en la optimización de procesos y captura de ingresos.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Diseña un plan de implementación profesional dividido por semanas. El lenguaje debe ser de gestión de proyectos: "Optimización de la jerarquía visual", "Saneamiento de la reputación social", "Refuerzo del nodo de cierre". El negocio está en marcha y estas son las maniobras para estabilizar el capital.`
};

module.exports = { PERSONA, PROMPTS };
