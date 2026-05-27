// cerebro_delta.js — Reporte mensual comparativo (seguimiento)

const IDIOMA = 'INSTRUCCIÓN CRÍTICA: Detecta el idioma principal del sitio web. Redacta TODO el reporte en ese idioma.';

const REGLA_NUCLEAR = 'REGLA NUCLEAR: Eres PredictaCore Titán en modo SEGUIMIENTO MENSUAL. Comparas el reporte inicial con el estado actual del sitio. Sé concreto, directo y ejecutivo. Máximo 2 párrafos por sección.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

const PROMPTS_DELTA = {
    RESUMEN: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### I. RESUMEN EJECUTIVO DEL MES\nCompara el estado actual vs el reporte Titán inicial.\nRedacta 2 párrafos: (1) progreso general — ¿mejoró, estancó o empeoró la conversión? (2) la acción #1 más urgente este mes.\n\nREPORTE INICIAL (extracto):\n${inicial}\n\nESTADO ACTUAL (dossier):\n${d}`,

    IMPLEMENTADAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### II. ACCIONES IMPLEMENTADAS\nDel reporte Titán inicial, identifica ÚNICAMENTE las acciones/recomendaciones que el cliente YA aplicó en su sitio (evidencia en el dossier actual).\n${FORMATO_LISTAS}\nMáximo 5 puntos. Si no hay evidencia de implementación, escribe un párrafo breve indicándolo.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### III. ACCIONES PENDIENTES (ALTA PRIORIDAD)\nDel reporte Titán inicial, lista las recomendaciones críticas que AÚN NO se han implementado.\n${FORMATO_LISTAS}\nMáximo 7 puntos. Por cada una, 1 línea de impacto financiero si sigue sin corregirse.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### IV. NUEVAS FRICCIONES DETECTADAS\nIdentifica hasta 5 problemas NUEVOS que no estaban en el reporte inicial o que empeoraron.\n${FORMATO_LISTAS}\nSé específico con evidencia del dossier actual.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

    ROADMAP: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n### V. PLAN DE ACCIÓN — PRÓXIMOS 30 DÍAS\n3 acciones concretas priorizadas para el próximo mes.\n${FORMATO_LISTAS}\nExactamente 3 puntos. Cada uno con instrucción copy-paste cuando aplique.\n\nREPORTE INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,
};

function extractInitialSummary(seccionesJson) {
    if (!seccionesJson || typeof seccionesJson !== 'object') return 'Sin reporte inicial disponible.';
    const keys = ['FUGAS', 'ACCIONES', 'SCORECARD', 'INTRO', 'FUGAS_LITE'];
    const parts = [];
    for (const k of keys) {
        if (seccionesJson[k]) parts.push(`[${k}]\n${seccionesJson[k]}`);
    }
    if (parts.length === 0) {
        for (const k in seccionesJson) {
            parts.push(`[${k}]\n${seccionesJson[k]}`);
            if (parts.join('').length > 12000) break;
        }
    }
    return parts.join('\n\n').substring(0, 15000);
}

module.exports = { PROMPTS_DELTA, extractInitialSummary, IDIOMA, REGLA_NUCLEAR };
