const PERSONA = `Eres el Consultor Senior de PredictaCore. Tu autoridad emana de la Metodología de Gemelos Sintéticos. 

REGLAS DE ORO DE EJECUCIÓN:
1. VALOR PREDICTACORE: El reporte debe iniciar con la superioridad de nuestra metodología sobre la consultoría tradicional y la IA genérica.
2. LENGUAJE CORPORATIVO: Prohibido usar términos informales. Usa: "Se ha identificado", "Impacto financiero", "Prioridad de rescate".
3. ANCLAJE TEMPORAL: La fecha actual es la del dossier. Trata el año 2026 como el presente absoluto.
4. MAPEO 1:1: Cada acción táctica debe ser la respuesta directa a una fuga de capital identificada.
5. CERO ALUCINACIÓN: Si un elemento (WhatsApp/Maps/Precios) está presente, es una FORTALEZA. No menciones el banner de cookies como falla crítica si es estándar de ley.`;

const PROMPTS = {
  INTRO: (d) => `I. INTRODUCCIÓN Y VALOR METODOLÓGICO DE PREDICTACORE
  1. Presentación de PredictaCore como la autoridad líder en Auditoría Forense Digital.
  2. Explicación de la Metodología de Gemelos Sintéticos: Por qué nuestro reporte vale más que cualquier análisis humano o de IA tradicional (simulación de comportamiento real vs. opinión).
  3. Ficha técnica del activo analizado basada estrictamente en el dossier: ${d}`,

  GEMELOS: (d) => `II. PERFILES PSICOLÓGICOS (GEMELOS SINTÉTICOS)
  Genera 4 perfiles basados en la misión del activo. 
  ESTRUCTURA POR PERFIL: 
  - Nombre del perfil.
  - Motivación Primaria (Por qué está en el sitio).
  - Valor Esperado (Qué beneficio específico busca obtener para cerrar la transacción).
  (Prohibido agregar secciones de "decisión en 10 segundos" o "necesidades humanas" no acordadas).`,

  SCORECARD: (d) => `III. TABLA DE SALUD COMERCIAL (SCORECARD)
  Calificación de 1 a 10. Si el elemento existe y es funcional, la calificación es 10 (Estado Óptimo).
  Puntos: 1. Orden Visual, 2. Fluidez de Navegación, 3. Eficacia del Puente de Contacto (Cierre), 4. Certidumbre Técnica (Evidencia), 5. Economía del Esfuerzo, 6. Ausencia de Estorbos, 7. Claridad de Información Comercial, 8. Coherencia de Marca, 9. Accesibilidad de la Misión Final, 10. Claridad del Mensaje Central.`,

  VISIBILIDAD: (d) => `IV. AUDITORÍA SEO DE ALTA CALIDAD (EL FILTRO DE GOOGLE)
  1. DIAGNÓSTICO DE VISIBILIDAD: ¿Cómo clasifica Google el activo (Negocio transaccional vs. Blog informativo)?
  2. CAPITAL PERDIDO: Cuantifica la brecha de intención. ¿Cuántos clientes se pierden porque la información clave está atrapada en imágenes o por títulos que no capturan la búsqueda real?`,

  BENCHMARK: (d) => `V. RADIOGRAFÍA ESTRATÉGICA (BENCHMARK)
  Tabla profesional comparando el activo contra 3 competidores. Analiza la "Facilidad de Cierre" y la "Autoridad de Marca". ¿Por qué el cliente elegiría al competidor hoy?`,

  SWOT: (d) => `VI. MATRIZ ESTRATÉGICA (FODA)
  Tabla Markdown profesional con Fortalezas, Debilidades, Oportunidades y Amenazas enfocadas en el retorno de inversión (ROI).`,

  WISHLIST: (d) => `VII. LISTA DE DESEOS DE TUS CLIENTES
  Lista de requerimientos específicos que los Gemelos Sintéticos demandan para completar la misión del sitio. "El cliente requiere...", "Se requiere certidumbre en...".`,

  FUGAS: (d) => `VIII. PUNTOS DE FUGA DE CAPITAL
  Identifica 15 fugas reales. 
  REGLA DE EXTENSIÓN: Cada punto debe tener de 3 a 5 líneas de descripción. Explica la falla técnica/visual y el impacto financiero exacto (drenaje de capital) que provoca.`,

  ACCIONES: (d) => `IX. ACCIONES TÁCTICAS DE IMPLEMENTACIÓN (EL RESCATE)
  Presenta 15 instrucciones ejecutivas vinculadas 1:1 con las fugas anteriores.
  FORMATO: HALLAZGO | IMPLEMENTACIÓN (Paso a paso detallado para el dueño) | PRIORIDAD DE RESCATE (Urgente / Necesaria / Estratégica).
  FECHA: Usa la fecha de ejecución del reporte para todas las acciones.`,

  HERRAMIENTAS: (d) => `X. HERRAMIENTAS Y ESCALA
  Recomienda 5 soluciones tecnológicas que resuelvan los problemas de cierre y comunicación detectados en el activo.`,

  OMNI: (d) => `XI. HOJA DE RUTA EJECUTIVA (21 DÍAS)
  Plan de implementación profesional dividido en 3 semanas. Enfoque: "Eliminar Fricción, Generar Confianza y Asegurar el Cierre de la Misión".`
};

module.exports = { PERSONA, PROMPTS };
