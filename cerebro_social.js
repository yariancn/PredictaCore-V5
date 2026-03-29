// cerebro_social.js - CEREBRO EXCLUSIVO PARA REDES SOCIALES

const IDIOMA = "INSTRUCCIÓN CRÍTICA: Detecta el idioma de la biografía del negocio. IGNORA los textos genéricos de la plataforma como 'Iniciar sesión', 'Log in', 'Publicaciones', etc. Escribe TODO el reporte estrictamente en el idioma del negocio.";

const REGLA_ANTI_LORO = "REGLA NUCLEAR DE REDES SOCIALES: Tienes ESTRICTAMENTE PROHIBIDO auditar a la plataforma (Instagram, Facebook o TikTok). Estás auditando ÚNICAMENTE el perfil del cliente/negocio. Si el dossier contiene textos del muro de registro de Meta ('Crea una cuenta para ver fotos', 'Iniciar sesión'), IGNÓRALOS POR COMPLETO. Tu objetivo es auditar la biografía, el contenido y la fricción de venta del cliente.";

const FORMATO_LISTAS = "INSTRUCCIÓN DE FORMATO FATAL: TIENES ESTRICTAMENTE PROHIBIDO usar viñetas simples (bullets como • o -). DEBES iniciar cada punto OBLIGATORIAMENTE con un NÚMERO seguido de un PUNTO y un ESPACIO. Ejemplo CORRECTO: '1. [Texto]'.";

const PROMPTS = {
  INTRO: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### I. INTRODUCCIÓN Y RADIOGRAFÍA DEL PERFIL\nRedacta en dos partes:\nPÁRRAFO 1: Explica con autoridad quiénes somos (PredictaCore) y que simulamos fricción transaccional.\nPÁRRAFOS 2 y 3: Describe profundamente el negocio del cliente basado en su biografía y contenido visual. ¿Qué venden y a quién? Dossier: ${d}`,

  GEMELOS: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### II. PERFILES PSICOLÓGICOS DE AUDIENCIA\nDiseña 4 perfiles de seguidores enfocados en sus motivaciones de compra. EXACTAMENTE 2 oraciones por perfil. Sé directo y letal. Dossier: ${d}`,

  SCORECARD: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### III. SCORECARD DE CONVERSIÓN SOCIAL\nPresenta una tabla Markdown. Traduce esta cabecera: | Punto de Salud | Calificación (1-10) | Diagnóstico Forense |\nREGLAS: 10 filas exactas. Evalúa puntos MACRO de un perfil social (Claridad de Bio, Fricción en el Enlace, Cohesión Visual, Tangibilidad). Diagnósticos de 3 líneas. Dossier: ${d}`,

  VISIBILIDAD: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### IV. AUTORIDAD Y EMBUDO SOCIAL\nRealiza un ensayo profundo evaluando:\n- Hemorragia de Atención: ¿El contenido retiene al usuario o lo pierde?\n- Fricción del Link in Bio: Analiza qué tan difícil es pasar de ser un seguidor a ser un comprador.\n- Arrendamiento Digital: Advierte al cliente sobre el peligro de depender 100% del algoritmo de Meta sin derivar tráfico a una web propia. Dossier: ${d}`,

  BENCHMARK: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)\nElige a 3 competidores reales del nicho del cliente. Presenta una tabla Markdown. Traduce cabecera: | Criterio de Análisis | Perfil Analizado | [Comp 1] | [Comp 2] | [Comp 3] |\nREGLAS: NO usar saltos de línea en celdas. Máximo 2 oraciones por celda. Dossier: ${d}`,

  SWOT: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### VI. MATRIZ ESTRATÉGICA\nDesarrolla Fortalezas, Debilidades, Oportunidades y Amenazas de este perfil (3 a 5 líneas cada una). ${FORMATO_LISTAS} Dossier: ${d}`,

  WISHLIST: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### VII. LISTA DE DESEOS\n10 tácticas de alto valor para mejorar el perfil (3 a 5 líneas). ${FORMATO_LISTAS} (Numera del 1 al 10). Dossier: ${d}`,

  FUGAS: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### VIII. 15 PUNTOS DE FUGA\nIdentifica 15 errores críticos en la biografía, el link, los textos de las imágenes o la falta de llamadas a la acción. Marca las peores como **[HEMORRAGIA CRÍTICA]**. REGLAS:\n1. ${FORMATO_LISTAS} (Numera del 1 al 15).\n2. Explica la pérdida de ventas de cada fuga. Dossier: ${d}`,

  ACCIONES: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### IX. 15 ACCIONES TÁCTICAS\nProporciona la solución exacta a las 15 fugas. REGLA: ${FORMATO_LISTAS} (Numera del 1 al 15). Dossier: ${d}`,

  HERRAMIENTAS: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### X. HERRAMIENTAS DE CRECIMIENTO\n5 soluciones SaaS para redes sociales (programadores, auto-DMs, link-in-bio) justificando ROI. ${FORMATO_LISTAS} (Numera del 1 al 5). Dossier: ${d}`,

  OMNI: (d) => `${IDIOMA}\n${REGLA_ANTI_LORO}\nEscribe este encabezado traducido: ### XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)\n3 fases de 7 días. DEBES generar EXACTAMENTE 3 pasos por cada fase enfocados en optimizar el perfil. ${FORMATO_LISTAS} Dossier: ${d}`
};

module.exports = { PROMPTS, IDIOMA, REGLA_ANTI_LORO };
