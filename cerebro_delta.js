// cerebro_delta.js — Seguimiento mensual (web + redes sociales)
// Independiente de cerebro.js y cerebro_social.js — no modificar esos archivos para DELTA.

const { IDIOMA_DELTA } = require('./idioma');

const IDIOMA = IDIOMA_DELTA;

const REGLA_NUCLEAR = 'REGLA NUCLEAR: PredictaCore en modo SEGUIMIENTO MENSUAL. Comparas el reporte Titán inicial vs el estado actual del mismo activo (sitio web o perfil social). Concreto y ejecutivo. Máximo 2 párrafos por sección. PDF total: 2-3 páginas. PROHIBIDO $, USD, ROI%.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

const REGLA_DIFF = `REGLA CAMBIOS VERIFICADOS: Usa el bloque === CAMBIOS_VERIFICADOS === del dossier como fuente de verdad.
- SIN_CAMBIO = NO hubo cambio real entre scrapes — PROHIBIDO decir que se implementó o empeoró.
- MEJORAS_IMPLEMENTACION = solo cambios estructurales verificados (H1, Schema, sitemap). NO incluye scores ni meta/title que ya existían.
- REGRESIONES_VERIFICADAS = empeoras medidas (carga, alt text).
- SEO/AI pueden variar ±12 pts entre mediciones sin cambio real en el sitio — NO son "implementaciones".`;

function deltaHeaders(locale) {
    const es = locale?.code?.startsWith('es');
    if (es) {
        return {
            scorecard: '### SCORECARD DE SEGUIMIENTO',
            resumen: '### I. RESUMEN EJECUTIVO DEL MES',
            implementadas: '### II. ACCIONES IMPLEMENTADAS',
            pendientes: '### III. ACCIONES PENDIENTES (ALTA PRIORIDAD)',
            nuevas: '### IV. NUEVAS FRICCIONES DETECTADAS',
            acciones: '### V. ACCIONES NUEVAS — CÓMO RESOLVER LAS FRICCIONES',
            sinImplementacion: 'Sin evidencia de implementación verificable.',
            sinPendientes: 'Sin pendientes críticos adicionales identificados.',
        };
    }
    return {
        scorecard: '### MONTHLY SCORECARD',
        resumen: '### I. MONTHLY EXECUTIVE SUMMARY',
        implementadas: '### II. IMPLEMENTED ACTIONS',
        pendientes: '### III. PENDING ACTIONS (HIGH PRIORITY)',
        nuevas: '### IV. NEW FRICTIONS DETECTED',
        acciones: '### V. NEW ACTIONS — HOW TO RESOLVE THE FRICTIONS',
        sinImplementacion: 'No verifiable implementation evidence.',
        sinPendientes: 'No additional critical pending items identified.',
    };
}

function tipoActivo(isSocial, locale) {
    const es = locale?.code?.startsWith('es');
    if (isSocial) return es ? 'perfil social (Instagram, Facebook, TikTok, etc.)' : 'social profile (Instagram, Facebook, TikTok, etc.)';
    return es ? 'sitio web' : 'website';
}

function bloqueEvidencia(isSocial) {
    if (isSocial) {
        return 'Usa SIMULATION_RESULTS, SEO_FORENSICS/AI_VISIBILITY del dossier y señales del perfil (bio, enlaces externos, contacto, CTAs).';
    }
    return 'Usa SIMULATION_RESULTS, SEO_FORENSICS y señales técnicas del sitio (H1, meta, Schema, contacto, velocidad).';
}

function buildPromptsDelta(isSocial = false, locale = { code: 'en-US' }) {
    const activo = tipoActivo(isSocial, locale);
    const evidencia = bloqueEvidencia(isSocial);
    const H = deltaHeaders(locale);
    const copyPaste = locale?.code?.startsWith('es') ? '**[COPIAR Y PEGAR]:**' : '**[COPY & PASTE]:**';

    return {
        IMPLEMENTADAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.implementadas}\nLista SOLO si CAMBIOS_VERIFICADOS incluye el campo en MEJORAS_IMPLEMENTACION.\n${FORMATO_LISTAS}\nMáximo 5 puntos. Si MEJORAS_IMPLEMENTACION: NINGUNA, escribe exactamente: "${H.sinImplementacion}"\nPROHIBIDO afirmar meta, title, contacto o SEO score como implementación si no están en MEJORAS_IMPLEMENTACION.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.pendientes}\nRecomendaciones del Titán AÚN NO implementadas (no listadas en MEJORAS_IMPLEMENTACION).\n${FORMATO_LISTAS}\nMáximo 7 puntos. Por cada una, 1 línea de impacto cualitativo (sin $).\nNo repitas como pendiente algo ya listado en IMPLEMENTADAS.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        RESUMEN: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.resumen}\nCompara estado actual vs reporte Titán inicial del mismo ${activo}.\nUsa SCORECARD y CAMBIOS_VERIFICADOS — no inventes progreso.\nSi MEJORAS_IMPLEMENTACION: NINGUNA, di claramente que no hay cambios estructurales verificados (variaciones de score no cuentan).\n2 párrafos: (1) progreso real (2) acción #1 más urgente.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nESTADO ACTUAL (dossier):\n${d}`,

        NUEVAS: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n${H.nuevas}\nLista SOLO fricciones con CAMBIOS_VERIFICADOS = EMPEORA o hallazgos nuevos en SIMULATION_RESULTS no presentes en el Titán.\n${evidencia}\n${FORMATO_LISTAS}\nOBLIGATORIO: exactamente 3 puntos numerados (máximo 5).\nFormato: 1. **[Critical|High|Medium]** — [fricción] (evidencia: campo CAMBIOS_VERIFICADOS o SIMULATION_RESULTS).\nPROHIBIDO listar como nueva una fricción que el Titán ya reportó y sigue SIN_CAMBIO.\nPROHIBIDO listar MEJORA aquí.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER ACTUAL:\n${d}`,

        ACCIONES_NUEVAS: (d, inicial, nuevasIv = '') => `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n${H.acciones}\nResuelve EXACTAMENTE las fricciones de la sección IV — misma numeración (acción 1 → fricción 1, etc.).\n${FORMATO_LISTAS}\nOBLIGATORIO: mismo número de acciones que puntos en sección IV (${Math.max(3, (nuevasIv.match(/^\s*\d+\.\s+/gm) || []).length) || 3} acciones).\nFormato: 1. **Resolver fricción #1:** pasos concretos (2-3 líneas). ${copyPaste} texto listo cuando aplique.\nPROHIBIDO proponer acciones para fugas del Titán que no estén en la sección IV.\n\nSECCIÓN IV (fricciones a resolver):\n${nuevasIv || '(generar después de IV)'}\n\nDOSSIER ACTUAL:\n${d}`,
    };
}

/** Prompts web (default export para compatibilidad) */
const PROMPTS_DELTA = buildPromptsDelta(false);

function extractInitialSummary(seccionesJson) {
    if (!seccionesJson || typeof seccionesJson !== 'object') return 'Sin reporte Titán inicial disponible.';
    const keys = ['FUGAS', 'ACCIONES', 'SCORECARD', 'INTRO', 'GEMELOS', 'VISIBILIDAD', 'FUGAS_LITE'];
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

function extractScoreSnapshot(dossier) {
    const pick = (re) => {
        const m = (dossier || '').match(re);
        return m ? m[1] : null;
    };
    return {
        seo: pick(/SEO_TECNICO_SCORE:\s*(\d+)/),
        ai: pick(/AI_DISCOVERABILITY_SCORE:\s*(\d+)/),
        load: pick(/TIEMPO_CARGA_SEG:\s*([\d.]+)/),
    };
}

function extractForensicSnapshot(dossier) {
    const pick = (re) => {
        const m = (dossier || '').match(re);
        return m ? m[1].trim() : null;
    };
    const text = dossier || '';
    const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    return {
        seo: pick(/SEO_TECNICO_SCORE:\s*(\d+)/),
        ai: pick(/AI_DISCOVERABILITY_SCORE:\s*(\d+)/),
        load: pick(/TIEMPO_CARGA_SEG:\s*([\d.]+)/),
        title: pick(/TITLE \(\d+ chars\): (.+)/),
        meta: pick(/META_DESCRIPTION \(\d+ chars\): (.+)/),
        h1Count: pick(/H1_COUNT:\s*(\d+)/),
        h1Text: pick(/H1_TEXT:\s*(.+)/),
        altPct: pick(/IMAGENES_ALT_COVERAGE:\s*(\d+)/),
        jsonLd: pick(/JSON_LD:\s*(\d+)/),
        sitemap: pick(/SITEMAP_XML:\s*(\S+)/),
        email: emailMatch ? emailMatch[0] : null,
    };
}

function normVal(val) {
    return String(val || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function isAbsent(val) {
    const v = normVal(val);
    return !v
        || v === 'ausente'
        || v === 'absent'
        || v === 'no_encontrado'
        || v === 'not found'
        || v === 'ninguno'
        || v === 'none';
}

function h1Effective(snap) {
    const count = Number(snap.h1Count || 0);
    const text = normVal(snap.h1Text);
    if (count === 0) return 'missing';
    if (isAbsent(snap.h1Text) || text.length < 3) return 'empty';
    return 'ok';
}

function hasSubstantiveContent(val) {
    if (isAbsent(val)) return false;
    return normVal(val).replace(/[^a-z0-9]/g, '').length >= 10;
}

function compareNumeric(label, prev, cur, { higherIsBetter = true, tolerance = 0, measurementOnly = false } = {}) {
    const p = Number(prev);
    const c = Number(cur);
    if (Number.isNaN(p) || Number.isNaN(c)) {
        return { label, status: 'N/A', prev, cur, measurementOnly };
    }
    if (Math.abs(c - p) <= tolerance) {
        return { label, status: 'SIN_CAMBIO', prev, cur, measurementOnly };
    }
    const improved = higherIsBetter ? c > p : c < p;
    const status = improved ? 'MEJORA' : 'EMPEORA';
    return { label, status, prev, cur, measurementOnly };
}

function compareTextField(label, prev, cur) {
    const pSub = hasSubstantiveContent(prev);
    const cSub = hasSubstantiveContent(cur);
    if (pSub && cSub) {
        if (normVal(prev) === normVal(cur)) {
            return { label, status: 'SIN_CAMBIO', prev, cur };
        }
        return { label, status: 'SIN_CAMBIO', prev, cur, note: 'both_present' };
    }
    if (!pSub && !cSub) {
        return { label, status: 'SIN_CAMBIO', prev, cur };
    }
    if (!pSub && cSub) {
        return { label, status: 'MEJORA', prev: prev || 'AUSENTE', cur };
    }
    return { label, status: 'EMPEORA', prev, cur: cur || 'AUSENTE' };
}

function compareH1(prevSnap, curSnap) {
    const prev = h1Effective(prevSnap);
    const cur = h1Effective(curSnap);
    if (prev === cur) {
        return {
            label: 'H1',
            status: prev === 'ok' ? 'SIN_CAMBIO' : 'SIN_CAMBIO',
            prev: `${prevSnap.h1Count ?? '?'} (${prevSnap.h1Text || 'AUSENTE'})`,
            cur: `${curSnap.h1Count ?? '?'} (${curSnap.h1Text || 'AUSENTE'})`,
        };
    }
    if (prev !== 'ok' && cur === 'ok') {
        return { label: 'H1', status: 'MEJORA', prev: prevSnap.h1Text, cur: curSnap.h1Text };
    }
    if (prev === 'ok' && cur !== 'ok') {
        return { label: 'H1', status: 'EMPEORA', prev: prevSnap.h1Text, cur: curSnap.h1Text };
    }
    return { label: 'H1', status: 'SIN_CAMBIO', prev: prevSnap.h1Text, cur: curSnap.h1Text };
}

function buildStructuralDiff(prevDossier, currentDossier) {
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const rows = [
        compareNumeric('SEO_TECNICO', prev.seo, cur.seo, { higherIsBetter: true, tolerance: 12, measurementOnly: true }),
        compareNumeric('AI_VISIBILITY', prev.ai, cur.ai, { higherIsBetter: true, tolerance: 5, measurementOnly: true }),
        compareNumeric('TIEMPO_CARGA_SEG', prev.load, cur.load, { higherIsBetter: false, tolerance: 0.5 }),
        compareTextField('TITLE', prev.title, cur.title),
        compareTextField('META_DESCRIPTION', prev.meta, cur.meta),
        compareH1(prev, cur),
        compareNumeric('ALT_TEXT_PCT', prev.altPct, cur.altPct, { higherIsBetter: true }),
        compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd, { higherIsBetter: true }),
        compareTextField('SITEMAP', prev.sitemap, cur.sitemap),
    ];

    const lines = rows.map((r) => {
        const tag = r.measurementOnly && r.status !== 'SIN_CAMBIO' ? 'VARIANZA_MEDICION' : r.status;
        return `${r.label}: ${r.prev ?? '?'} → ${r.cur ?? '?'} | ${tag}`;
    });

    const IMPLEMENTATION_LABELS = new Set(['H1', 'JSON_LD_BLOCKS', 'SITEMAP', 'META_DESCRIPTION', 'TITLE']);
    const mejorasImplementacion = rows
        .filter((r) => r.status === 'MEJORA' && IMPLEMENTATION_LABELS.has(r.label) && !r.note)
        .map((r) => r.label);
    const empeoras = rows.filter((r) => r.status === 'EMPEORA').map((r) => r.label);
    const variaciones = rows.filter((r) => r.measurementOnly && r.status !== 'SIN_CAMBIO').map((r) => r.label);

    return {
        rows,
        mejoras: mejorasImplementacion,
        empeoras,
        variaciones,
        block: `
=== CAMBIOS_VERIFICADOS (DIFF REAL ENTRE SCRAPES — OBLIGATORIO) ===
${lines.join('\n')}
MEJORAS_IMPLEMENTACION: ${mejorasImplementacion.length ? mejorasImplementacion.join(', ') : 'NINGUNA'}
REGRESIONES_VERIFICADAS: ${empeoras.length ? empeoras.join(', ') : 'NINGUNA'}
VARIANZA_MEDICION (no cuenta como cambio del sitio): ${variaciones.length ? variaciones.join(', ') : 'NINGUNA'}
REGLA: SIN_CAMBIO o VARIANZA_MEDICION = no afirmes implementación. Title/meta/contacto iguales = SIN_CAMBIO.
=== FIN CAMBIOS_VERIFICADOS ===`,
    };
}

function formatScoreDiffBlock(prevDossier, currentDossier) {
    const prev = extractScoreSnapshot(prevDossier);
    const cur = extractScoreSnapshot(currentDossier);
    const diff = (a, b) => {
        if (a == null || b == null) return 'N/A';
        const d = Number(b) - Number(a);
        return d > 0 ? `+${d}` : String(d);
    };
    return `
=== SCORE_DIFF_MENSUAL (DATOS REALES) ===
SEO_TECNICO: ${prev.seo ?? '?'} → ${cur.seo ?? '?'} (${diff(prev.seo, cur.seo)})
AI_VISIBILITY: ${prev.ai ?? '?'} → ${cur.ai ?? '?'} (${diff(prev.ai, cur.ai)})
TIEMPO_CARGA_SEG: ${prev.load ?? '?'} → ${cur.load ?? '?'} (${diff(prev.load, cur.load)})
=== FIN SCORE_DIFF_MENSUAL ===`;
}

function trendLabel(delta, locale, invert = false) {
    const es = locale?.code?.startsWith('es');
    const d = Number(delta);
    if (Number.isNaN(d) || delta === 'N/A') return es ? 'N/D' : 'N/A';
    if (Math.abs(d) < 0.01) return es ? 'Sin cambio' : 'No change';
    const up = invert ? d < 0 : d > 0;
    if (up) return es ? 'Mejora' : 'Improved';
    return es ? 'Empeora' : 'Declined';
}

function buildDeltaScorecardHtml(prevDossier, currentDossier, locale = { code: 'en-US' }) {
    const H = deltaHeaders(locale);
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const es = locale?.code?.startsWith('es');
    const diff = buildStructuralDiff(prevDossier, currentDossier);

    const fmtDelta = (a, b, invert = false) => {
        const p = Number(a);
        const c = Number(b);
        if (Number.isNaN(p) || Number.isNaN(c)) return '—';
        const d = c - p;
        if (Math.abs(d) < 0.01) return '0';
        const sign = d > 0 ? '+' : '';
        return `${sign}${Number.isInteger(d) ? d : d.toFixed(2)}`;
    };

    const h1Prev = h1Effective(prev) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');
    const h1Cur = h1Effective(cur) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');
    const h1Trend = h1Effective(prev) === h1Effective(cur)
        ? (es ? 'Sin cambio' : 'No change')
        : (h1Effective(cur) === 'ok' ? (es ? 'Mejora' : 'Improved') : (es ? 'Empeora' : 'Declined'));

    const rows = [
        [es ? 'SEO técnico' : 'Technical SEO', `${prev.seo ?? '—'}/100`, `${cur.seo ?? '—'}/100`, fmtDelta(prev.seo, cur.seo), trendLabel(fmtDelta(prev.seo, cur.seo), locale)],
        [es ? 'Visibilidad IA' : 'AI visibility', `${prev.ai ?? '—'}/100`, `${cur.ai ?? '—'}/100`, fmtDelta(prev.ai, cur.ai), trendLabel(fmtDelta(prev.ai, cur.ai), locale)],
        [es ? 'Carga (seg)' : 'Load (sec)', prev.load ?? '—', cur.load ?? '—', fmtDelta(prev.load, cur.load), trendLabel(fmtDelta(prev.load, cur.load), locale, true)],
        [es ? 'Alt text (%)' : 'Alt text (%)', prev.altPct != null ? `${prev.altPct}%` : '—', cur.altPct != null ? `${cur.altPct}%` : '—', fmtDelta(prev.altPct, cur.altPct), trendLabel(fmtDelta(prev.altPct, cur.altPct), locale)],
        ['H1', h1Prev, h1Cur, '—', h1Trend],
        ['JSON-LD', prev.jsonLd ?? '0', cur.jsonLd ?? '0', '—', compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd).status === 'SIN_CAMBIO' ? (es ? 'Sin cambio' : 'No change') : (es ? 'Cambió' : 'Changed')],
    ];

    const th = es
        ? ['Métrica', 'Titán (baseline)', 'Actual', 'Δ', 'Tendencia']
        : ['Metric', 'Titan (baseline)', 'Current', 'Δ', 'Trend'];

    const legend = es ? `
<p class="delta-scorecard-note"><strong>Qué mide cada fila:</strong></p>
<ul class="delta-scorecard-legend">
<li><strong>SEO técnico:</strong> Puntaje compuesto 0–100 (title, meta, H1, canonical, etc.). Puede variar ±12 pts sin cambios reales.</li>
<li><strong>Visibilidad IA:</strong> Señales de citabilidad (Schema, robots, texto indexable). Proxy técnico, no prueba en ChatGPT.</li>
<li><strong>Carga:</strong> Segundos para cargar la homepage en nuestra medición. Varía por red/servidor.</li>
<li><strong>Alt text:</strong> % de imágenes con texto alternativo descriptivo.</li>
<li><strong>H1:</strong> Encabezado principal visible con texto claro.</li>
<li><strong>JSON-LD:</strong> Bloques de datos estructurados (Schema.org).</li>
</ul>` : `
<p class="delta-scorecard-note"><strong>What each row measures:</strong></p>
<ul class="delta-scorecard-legend">
<li><strong>Technical SEO:</strong> Composite 0–100 score (title, meta, H1, canonical, etc.). May vary ±12 pts without real site changes.</li>
<li><strong>AI visibility:</strong> Citability signals (Schema, robots, indexable text). Technical proxy — not a live AI test.</li>
<li><strong>Load:</strong> Seconds to load the homepage in our measurement. Varies by network/server.</li>
<li><strong>Alt text:</strong> % of images with descriptive alt text.</li>
<li><strong>H1:</strong> Main heading visible with clear text.</li>
<li><strong>JSON-LD:</strong> Structured data blocks (Schema.org).</li>
</ul>`;

    const summary = es
        ? `<p class="delta-scorecard-summary"><strong>Resumen:</strong> ${diff.mejoras.length ? diff.mejoras.join(', ') : 'Sin cambios estructurales verificados'}. Regresiones: ${diff.empeoras.length ? diff.empeoras.join(', ') : 'ninguna'}.${diff.variaciones.length ? ` Variación de medición: ${diff.variaciones.join(', ')}.` : ''}</p>`
        : `<p class="delta-scorecard-summary"><strong>Summary:</strong> ${diff.mejoras.length ? diff.mejoras.join(', ') : 'No verified structural changes'}. Regressions: ${diff.empeoras.length ? diff.empeoras.join(', ') : 'none'}.${diff.variaciones.length ? ` Measurement variance: ${diff.variaciones.join(', ')}.` : ''}</p>`;

    const tableRows = rows.map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');

    return `<div class="delta-scorecard">
<h3>${H.scorecard.replace('### ', '')}</h3>
${summary}
<table class="delta-table">
<thead><tr>${th.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${tableRows}</tbody>
</table>
${legend}
</div>`;
}

function buildDeltaScorecard(prevDossier, currentDossier, locale = { code: 'en-US' }) {
    return buildDeltaScorecardHtml(prevDossier, currentDossier, locale);
}

const DELTA_SECTION_ORDER = ['SCORECARD', 'RESUMEN', 'IMPLEMENTADAS', 'PENDIENTES', 'NUEVAS', 'ACCIONES_NUEVAS'];

module.exports = {
    PROMPTS_DELTA,
    buildPromptsDelta,
    extractInitialSummary,
    extractScoreSnapshot,
    extractForensicSnapshot,
    buildStructuralDiff,
    buildDeltaScorecard,
    buildDeltaScorecardHtml,
    formatScoreDiffBlock,
    deltaHeaders,
    DELTA_SECTION_ORDER,
    IDIOMA,
    REGLA_NUCLEAR,
};
