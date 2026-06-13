// cerebro_delta.js — Seguimiento mensual (web + redes sociales)
// Independiente de cerebro.js y cerebro_social.js — no modificar esos archivos para DELTA.

const { IDIOMA_DELTA } = require('./idioma');

const IDIOMA = IDIOMA_DELTA;

const REGLA_NUCLEAR = 'REGLA NUCLEAR: PredictaCore en modo SEGUIMIENTO MENSUAL. Comparas el reporte Titán inicial vs el estado actual del mismo activo. Concreto y ejecutivo. Máximo 2 párrafos por sección LLM. PDF total: 2-3 páginas. PROHIBIDO $, USD, ROI%.';

const FORMATO_LISTAS = "FORMATO: Numera cada punto. Ejemplo: '1. [Texto]'.";

const REGLA_DIFF = `REGLA CAMBIOS VERIFICADOS: Usa === CAMBIOS_VERIFICADOS === como única fuente de verdad.
- MEJORAS_IMPLEMENTACION = solo H1, JSON-LD o Sitemap verificados. NUNCA title, meta, email ni SEO score.
- REGRESIONES_VERIFICADAS = empeoras medidas entre scrapes.
- Si MEJORAS_IMPLEMENTACION: NINGUNA → no afirmes progreso, rebranding ni "implementaron".`;

/** Solo estas secciones pasan por LLM — el resto es determinístico */
const DELTA_LLM_SECTIONS = new Set(['PENDIENTES', 'ACCIONES_NUEVAS']);

function deltaHeaders(locale) {
    const es = locale?.code?.startsWith('es');
    if (es) {
        return {
            scorecard: 'SCORECARD DE SEGUIMIENTO',
            resumen: 'I. RESUMEN DEL MES',
            implementadas: 'II. CAMBIOS VERIFICADOS DESDE EL TITÁN',
            pendientes: 'III. PENDIENTES DEL TITÁN (TOP 4)',
            nuevas: 'IV. REGRESIONES DE ESTE MES',
            acciones: 'V. ACCIONES PARA ESTE MES',
            sinImplementacion: 'Sin cambios estructurales verificables entre el scrape del Titán y el de hoy.',
            sinPendientes: 'Sin pendientes adicionales del Titán fuera de las regresiones listadas.',
            sinRegresiones: 'Sin regresiones medibles este mes.',
        };
    }
    return {
        scorecard: 'MONTHLY SCORECARD',
        resumen: 'I. MONTH AT A GLANCE',
        implementadas: 'II. VERIFIED CHANGES SINCE TITAN',
        pendientes: 'III. STILL OPEN FROM TITAN (TOP 4)',
        nuevas: 'IV. REGRESSIONS THIS MONTH',
        acciones: 'V. ACTIONS FOR THIS MONTH',
        sinImplementacion: 'No verifiable structural changes between the Titan baseline scrape and today.',
        sinPendientes: 'No additional Titan items beyond the regressions listed above.',
        sinRegresiones: 'No measurable regressions this month.',
    };
}

function tipoActivo(isSocial, locale) {
    const es = locale?.code?.startsWith('es');
    if (isSocial) return es ? 'perfil social' : 'social profile';
    return es ? 'sitio web' : 'website';
}

function buildPromptsDelta(isSocial = false, locale = { code: 'en-US' }) {
    const activo = tipoActivo(isSocial, locale);
    const H = deltaHeaders(locale);
    const copyPaste = locale?.code?.startsWith('es') ? '**[COPIAR Y PEGAR]:**' : '**[COPY & PASTE]:**';

    return {
        PENDIENTES: (d, inicial) => `${IDIOMA}\n${REGLA_NUCLEAR}\n${REGLA_DIFF}\nACTIVO: ${activo}\n### ${H.pendientes}\nDel Titán inicial: máximo 4 recomendaciones AÚN sin resolver. NO repitas regresiones de la sección IV.\n${FORMATO_LISTAS}\n1 línea de impacto por punto. PROHIBIDO meta/title/contacto si CAMBIOS_VERIFICADOS no los marca como MEJORA.\n\nREPORTE TITÁN INICIAL:\n${inicial}\n\nDOSSIER:\n${d}`,

        ACCIONES_NUEVAS: (d, _inicial, nuevasIv = '') => {
            const count = (nuevasIv.match(/^\s*\d+\.\s+/gm) || []).length;
            const focus = count > 0
                ? `Resuelve EXACTAMENTE las ${count} fricciones de la sección IV (acción 1 → fricción 1).`
                : 'Sin regresiones medidas este mes. Da 2 acciones concretas para el pendiente #1 del Titán aún abierto (prioriza H1 o Schema).';
            return `${IDIOMA}\n${REGLA_NUCLEAR}\nACTIVO: ${activo}\n### ${H.acciones}\n${focus}\n${FORMATO_LISTAS}\n${count > 0 ? `Exactamente ${count} acciones.` : 'Exactamente 2 acciones.'}\nFormato: 1. **Acción #1:** pasos (2-3 líneas). ${copyPaste} cuando aplique.\n\nSECCIÓN IV:\n${nuevasIv}\n\nDOSSIER:\n${d}`;
        },
    };
}

const PROMPTS_DELTA = buildPromptsDelta(false);

function extractInitialSummary(seccionesJson) {
    if (!seccionesJson || typeof seccionesJson !== 'object') return 'Sin reporte Titán inicial disponible.';
    const keys = ['FUGAS', 'ACCIONES', 'VISIBILIDAD', 'INTRO'];
    const parts = [];
    for (const k of keys) {
        if (seccionesJson[k]) parts.push(`[${k}]\n${seccionesJson[k]}`);
    }
    return parts.join('\n\n').substring(0, 12000);
}

function extractForensicSnapshot(dossier) {
    const pick = (re) => {
        const m = (dossier || '').match(re);
        return m ? m[1].trim() : null;
    };
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
    };
}

function normVal(val) {
    return String(val || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function isAbsent(val) {
    const v = normVal(val);
    return !v || ['ausente', 'absent', 'no_encontrado', 'not found', 'ninguno', 'none'].includes(v);
}

function h1Effective(snap) {
    const count = Number(snap.h1Count || 0);
    const text = normVal(snap.h1Text);
    if (count === 0) return 'missing';
    if (isAbsent(snap.h1Text) || text.length < 3) return 'empty';
    return 'ok';
}

function compareNumeric(label, prev, cur, { higherIsBetter = true, tolerance = 0, measurementOnly = false } = {}) {
    const p = Number(prev);
    const c = Number(cur);
    if (Number.isNaN(p) || Number.isNaN(c)) return { label, status: 'N/A', prev, cur, measurementOnly };
    if (Math.abs(c - p) <= tolerance) return { label, status: 'SIN_CAMBIO', prev, cur, measurementOnly };
    const improved = higherIsBetter ? c > p : c < p;
    return { label, status: improved ? 'MEJORA' : 'EMPEORA', prev, cur, measurementOnly };
}

function compareH1(prevSnap, curSnap) {
    const prev = h1Effective(prevSnap);
    const cur = h1Effective(curSnap);
    if (prev === cur) {
        return { label: 'H1', status: 'SIN_CAMBIO', prev: `${prevSnap.h1Count ?? '?'}`, cur: `${curSnap.h1Count ?? '?'}` };
    }
    if (prev !== 'ok' && cur === 'ok') return { label: 'H1', status: 'MEJORA', prev: 'missing/empty', cur: curSnap.h1Text || 'present' };
    if (prev === 'ok' && cur !== 'ok') return { label: 'H1', status: 'EMPEORA', prev: prevSnap.h1Text, cur: 'missing/empty' };
    return { label: 'H1', status: 'SIN_CAMBIO', prev: prev, cur: cur };
}

function compareSitemap(prev, cur) {
    const p = normVal(prev);
    const c = normVal(cur);
    if (p === c || (!p && !c)) return { label: 'SITEMAP', status: 'SIN_CAMBIO', prev, cur };
    if (isAbsent(prev) && !isAbsent(cur)) return { label: 'SITEMAP', status: 'MEJORA', prev, cur };
    if (!isAbsent(prev) && isAbsent(cur)) return { label: 'SITEMAP', status: 'EMPEORA', prev, cur };
    if (p !== c) return { label: 'SITEMAP', status: 'EMPEORA', prev, cur };
    return { label: 'SITEMAP', status: 'SIN_CAMBIO', prev, cur };
}

function buildStructuralDiff(prevDossier, currentDossier) {
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const rows = [
        compareNumeric('SEO_TECNICO', prev.seo, cur.seo, { higherIsBetter: true, tolerance: 12, measurementOnly: true }),
        compareNumeric('AI_VISIBILITY', prev.ai, cur.ai, { higherIsBetter: true, tolerance: 5, measurementOnly: true }),
        compareNumeric('TIEMPO_CARGA_SEG', prev.load, cur.load, { higherIsBetter: false, tolerance: 0.5 }),
        compareH1(prev, cur),
        compareNumeric('ALT_TEXT_PCT', prev.altPct, cur.altPct, { higherIsBetter: true }),
        compareNumeric('JSON_LD_BLOCKS', prev.jsonLd, cur.jsonLd, { higherIsBetter: true }),
        compareSitemap(prev.sitemap, cur.sitemap),
    ];

    const lines = rows.map((r) => {
        const tag = r.measurementOnly && r.status !== 'SIN_CAMBIO' ? 'VARIANZA_MEDICION' : r.status;
        return `${r.label}: ${r.prev ?? '?'} → ${r.cur ?? '?'} | ${tag}`;
    });

    const IMPLEMENTATION_LABELS = new Set(['H1', 'JSON_LD_BLOCKS', 'SITEMAP']);
    const mejoras = rows.filter((r) => r.status === 'MEJORA' && IMPLEMENTATION_LABELS.has(r.label)).map((r) => r.label);
    const empeoras = rows.filter((r) => r.status === 'EMPEORA').map((r) => r.label);
    const variaciones = rows.filter((r) => r.measurementOnly && r.status !== 'SIN_CAMBIO').map((r) => r.label);

    return {
        rows,
        prev,
        cur,
        mejoras,
        empeoras,
        variaciones,
        block: `
=== CAMBIOS_VERIFICADOS (DIFF REAL — OBLIGATORIO) ===
${lines.join('\n')}
TITLE/META/EMAIL: no comparados como implementación — suelen ser iguales entre scrapes.
MEJORAS_IMPLEMENTACION: ${mejoras.length ? mejoras.join(', ') : 'NINGUNA'}
REGRESIONES_VERIFICADAS: ${empeoras.length ? empeoras.join(', ') : 'NINGUNA'}
VARIANZA_MEDICION: ${variaciones.length ? variaciones.join(', ') : 'NINGUNA'}
=== FIN CAMBIOS_VERIFICADOS ===`,
    };
}

function formatScoreDiffBlock(prevDossier, currentDossier) {
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const diff = (a, b) => {
        if (a == null || b == null) return 'N/A';
        const d = Number(b) - Number(a);
        return d > 0 ? `+${d}` : String(d);
    };
    return `
=== SCORE_DIFF_MENSUAL ===
SEO: ${prev.seo ?? '?'} → ${cur.seo ?? '?'} (${diff(prev.seo, cur.seo)})
AI: ${prev.ai ?? '?'} → ${cur.ai ?? '?'} (${diff(prev.ai, cur.ai)})
CARGA: ${prev.load ?? '?'} → ${cur.load ?? '?'} (${diff(prev.load, cur.load)})
=== FIN SCORE_DIFF ===`;
}

const FRICTION_COPY = {
    TIEMPO_CARGA_SEG: {
        en: { label: 'Page load time increased', pri: 'High', detail: (p, c) => `from ${p}s to ${c}s — adds friction for mobile and hurried visitors.` },
        es: { label: 'El tiempo de carga empeoró', pri: 'Alto', detail: (p, c) => `de ${p}s a ${c}s — más fricción en móvil y visitantes apurados.` },
    },
    ALT_TEXT_PCT: {
        en: { label: 'Image alt text coverage dropped', pri: 'Medium', detail: (p, c) => `from ${p}% to ${c}% — hurts accessibility and image search.` },
        es: { label: 'Cobertura de alt text bajó', pri: 'Medio', detail: (p, c) => `de ${p}% a ${c}% — perjudica accesibilidad e imagen en buscadores.` },
    },
    SITEMAP: {
        en: { label: 'Sitemap status changed', pri: 'Medium', detail: (p, c) => `from "${p}" to "${c}" — may affect indexation.` },
        es: { label: 'Estado del sitemap cambió', pri: 'Medio', detail: (p, c) => `de "${p}" a "${c}" — puede afectar indexación.` },
    },
    H1: {
        en: { label: 'Main H1 heading regressed', pri: 'High', detail: () => 'visible heading lost or still missing — weak value proposition.' },
        es: { label: 'El H1 principal empeoró', pri: 'Alto', detail: () => 'encabezado perdido o sigue ausente — propuesta de valor débil.' },
    },
    JSON_LD_BLOCKS: {
        en: { label: 'Structured data decreased', pri: 'Medium', detail: (p, c) => `from ${p} to ${c} JSON-LD blocks.` },
        es: { label: 'Datos estructurados disminuyeron', pri: 'Medio', detail: (p, c) => `de ${p} a ${c} bloques JSON-LD.` },
    },
};

function buildDeltaNuevasMarkdown(diff, locale) {
    const H = deltaHeaders(locale);
    const es = locale?.code?.startsWith('es');
    const lang = es ? 'es' : 'en';
    const lines = [`### ${H.nuevas}`];

    if (!diff.empeoras.length) {
        lines.push('', H.sinRegresiones);
        return lines.join('\n');
    }

    diff.empeoras.forEach((key, i) => {
        const row = diff.rows.find((r) => r.label === key);
        const copy = FRICTION_COPY[key]?.[lang];
        if (copy && row) {
            lines.push(`${i + 1}. **[${copy.pri}]** ${copy.label}: ${copy.detail(row.prev, row.cur)} *(evidence: CAMBIOS_VERIFICADOS · ${key})*`);
        } else if (row) {
            lines.push(`${i + 1}. **[Medium]** ${key}: ${row.prev} → ${row.cur} *(evidence: CAMBIOS_VERIFICADOS)*`);
        }
    });
    return lines.join('\n\n');
}

function buildDeltaImplementadasMarkdown(diff, locale) {
    const H = deltaHeaders(locale);
    const es = locale?.code?.startsWith('es');
    const labels = {
        H1: es ? 'Encabezado H1 principal implementado o corregido' : 'Main H1 heading implemented or fixed',
        JSON_LD_BLOCKS: es ? 'Datos estructurados (JSON-LD) añadidos' : 'Structured data (JSON-LD) added',
        SITEMAP: es ? 'Sitemap corregido o publicado' : 'Sitemap fixed or published',
    };

    if (!diff.mejoras.length) {
        return `### ${H.implementadas}

${H.sinImplementacion}

_${es
    ? 'Comparación automática entre scrapes. Title, meta description y email no cambiaron de forma verificable.'
    : 'Automated scrape comparison. Title, meta description, and contact email did not verifiably change.'}_`;
    }

    const items = diff.mejoras.map((k, i) => `${i + 1}. ${labels[k] || k} *(CAMBIOS_VERIFICADOS · ${k})*`);
    return `### ${H.implementadas}\n\n${items.join('\n\n')}`;
}

function buildDeltaResumenMarkdown(diff, locale) {
    const H = deltaHeaders(locale);
    const es = locale?.code?.startsWith('es');
    const { prev, cur } = diff;

    let p1;
    if (diff.mejoras.length) {
        p1 = es
            ? `Este mes se verificaron ${diff.mejoras.length} cambio(s) estructural(es): ${diff.mejoras.join(', ')}.`
            : `This month verified ${diff.mejoras.length} structural change(s): ${diff.mejoras.join(', ')}.`;
    } else {
        p1 = es
            ? '**Sin cambios estructurales verificables** entre el scrape del Titán y el de hoy. Title, meta y contacto permanecen equivalentes; variaciones de score SEO/IA son ruido de medición (±12 pts), no progreso del sitio.'
            : '**No verifiable structural changes** between the Titan baseline scrape and today. Title, meta, and contact remain equivalent; SEO/AI score shifts are measurement noise (±12 pts), not site progress.';
    }

    if (diff.empeoras.length) {
        p1 += es
            ? ` **Regresiones medidas:** ${diff.empeoras.join(', ')}.`
            : ` **Measured regressions:** ${diff.empeoras.join(', ')}.`;
    }

    let p2;
    if (diff.empeoras.includes('TIEMPO_CARGA_SEG')) {
        p2 = es
            ? `**Prioridad #1:** Revertir la regresión de carga (${prev.load}s → ${cur.load}s). Revisa apps Shopify, imágenes pesadas y scripts recientes antes que cambios de copy.`
            : `**Priority #1:** Reverse the load regression (${prev.load}s → ${cur.load}s). Audit Shopify apps, heavy images, and new scripts before copy changes.`;
    } else if (h1Effective(cur) !== 'ok') {
        p2 = es
            ? '**Prioridad #1:** Implementar un H1 claro con la propuesta de valor — pendiente desde el Titán y sin cambio verificable este mes.'
            : '**Priority #1:** Add a clear H1 with your value proposition — open since Titan with no verified change this month.';
    } else if (diff.empeoras.includes('ALT_TEXT_PCT')) {
        p2 = es
            ? `**Prioridad #1:** Recuperar alt text en imágenes clave (cayó de ${prev.altPct}% a ${cur.altPct}%).`
            : `**Priority #1:** Restore alt text on key images (dropped from ${prev.altPct}% to ${cur.altPct}%).`;
    } else {
        p2 = es
            ? '**Prioridad #1:** Mantener lo implementado y cerrar el pendiente #1 del Titán (ver sección III).'
            : '**Priority #1:** Hold verified gains and close Titan item #1 (see section III).';
    }

    return `### ${H.resumen}\n\n${p1}\n\n${p2}`;
}

function trendLabel(delta, locale, invert = false) {
    const es = locale?.code?.startsWith('es');
    const d = Number(delta);
    if (Number.isNaN(d) || delta === 'N/A' || delta === '—') return es ? 'N/D' : 'N/A';
    if (Math.abs(d) < 0.01) return es ? 'Sin cambio' : 'No change';
    const up = invert ? d < 0 : d > 0;
    return up ? (es ? 'Mejora' : 'Improved') : (es ? 'Empeora' : 'Declined');
}

function buildDeltaScorecardHtml(prevDossier, currentDossier, locale = { code: 'en-US' }) {
    const H = deltaHeaders(locale);
    const prev = extractForensicSnapshot(prevDossier);
    const cur = extractForensicSnapshot(currentDossier);
    const es = locale?.code?.startsWith('es');
    const diff = buildStructuralDiff(prevDossier, currentDossier);

    const fmtDelta = (a, b) => {
        const p = Number(a);
        const c = Number(b);
        if (Number.isNaN(p) || Number.isNaN(c)) return '—';
        const d = c - p;
        if (Math.abs(d) < 0.01) return '0';
        return (d > 0 ? '+' : '') + (Number.isInteger(d) ? String(d) : d.toFixed(2));
    };

    const h1Prev = h1Effective(prev) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');
    const h1Cur = h1Effective(cur) === 'ok' ? (es ? 'Presente' : 'Present') : (es ? 'Ausente/vacío' : 'Missing/empty');

    const rows = [
        [es ? 'SEO técnico' : 'Technical SEO', `${prev.seo ?? '—'}/100`, `${cur.seo ?? '—'}/100`, fmtDelta(prev.seo, cur.seo), trendLabel(fmtDelta(prev.seo, cur.seo), locale)],
        [es ? 'Visibilidad IA' : 'AI visibility', `${prev.ai ?? '—'}/100`, `${cur.ai ?? '—'}/100`, fmtDelta(prev.ai, cur.ai), trendLabel(fmtDelta(prev.ai, cur.ai), locale)],
        [es ? 'Carga (seg)' : 'Load (sec)', prev.load ?? '—', cur.load ?? '—', fmtDelta(prev.load, cur.load), trendLabel(fmtDelta(prev.load, cur.load), locale, true)],
        [es ? 'Alt text (%)' : 'Alt text (%)', prev.altPct != null ? `${prev.altPct}%` : '—', cur.altPct != null ? `${cur.altPct}%` : '—', fmtDelta(prev.altPct, cur.altPct), trendLabel(fmtDelta(prev.altPct, cur.altPct), locale)],
        ['H1', h1Prev, h1Cur, '—', h1Effective(prev) === h1Effective(cur) ? (es ? 'Sin cambio' : 'No change') : (es ? 'Cambió' : 'Changed')],
        ['JSON-LD', prev.jsonLd ?? '0', cur.jsonLd ?? '0', '—', Number(prev.jsonLd) === Number(cur.jsonLd) ? (es ? 'Sin cambio' : 'No change') : (es ? 'Cambió' : 'Changed')],
    ];

    const th = es
        ? ['Métrica', 'Titán (baseline)', 'Hoy', 'Δ', 'Tendencia']
        : ['Metric', 'Titan (baseline)', 'Today', 'Δ', 'Trend'];

    const glance = es
        ? `<ul class="delta-glance">
<li><strong>Cambios verificados:</strong> ${diff.mejoras.length ? diff.mejoras.join(', ') : 'Ninguno'}</li>
<li><strong>Regresiones:</strong> ${diff.empeoras.length ? diff.empeoras.join(', ') : 'Ninguna'}</li>
<li><strong>Variación de medición (ignorar como progreso):</strong> ${diff.variaciones.length ? diff.variaciones.join(', ') : 'Ninguna'}</li>
</ul>`
        : `<ul class="delta-glance">
<li><strong>Verified changes:</strong> ${diff.mejoras.length ? diff.mejoras.join(', ') : 'None'}</li>
<li><strong>Regressions:</strong> ${diff.empeoras.length ? diff.empeoras.join(', ') : 'None'}</li>
<li><strong>Measurement noise (not progress):</strong> ${diff.variaciones.length ? diff.variaciones.join(', ') : 'None'}</li>
</ul>`;

    const legend = es
        ? '<p class="delta-scorecard-note"><strong>Qué mide cada fila:</strong> SEO = puntaje técnico compuesto; IA = señales de citabilidad; Carga = segundos en nuestra medición; Alt = % imágenes con alt; H1 = encabezado principal; JSON-LD = Schema.org.</p>'
        : '<p class="delta-scorecard-note"><strong>What each row measures:</strong> SEO = composite technical score; AI = citability signals; Load = seconds in our test; Alt = % images with alt text; H1 = main heading; JSON-LD = Schema.org blocks.</p>';

    const tableRows = rows.map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');

    return `<div class="delta-scorecard">
<h3>${H.scorecard}</h3>
${glance}
<table class="delta-table">
<thead><tr>${th.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${tableRows}</tbody>
</table>
${legend}
</div>`;
}

function buildDeltaScorecard(prevDossier, currentDossier, locale) {
    return buildDeltaScorecardHtml(prevDossier, currentDossier, locale);
}

function buildDeterministicDeltaSections(prevDossier, currentDossier, locale) {
    const diff = buildStructuralDiff(prevDossier, currentDossier);
    return {
        diff,
        SCORECARD: buildDeltaScorecardHtml(prevDossier, currentDossier, locale),
        SCORECARD_IS_HTML: true,
        RESUMEN: buildDeltaResumenMarkdown(diff, locale),
        IMPLEMENTADAS: buildDeltaImplementadasMarkdown(diff, locale),
        NUEVAS: buildDeltaNuevasMarkdown(diff, locale),
    };
}

const DELTA_SECTION_ORDER = ['SCORECARD', 'RESUMEN', 'IMPLEMENTADAS', 'NUEVAS', 'PENDIENTES', 'ACCIONES_NUEVAS'];

module.exports = {
    PROMPTS_DELTA,
    buildPromptsDelta,
    extractInitialSummary,
    extractForensicSnapshot,
    buildStructuralDiff,
    buildDeltaScorecard,
    buildDeltaScorecardHtml,
    buildDeterministicDeltaSections,
    buildDeltaResumenMarkdown,
    buildDeltaImplementadasMarkdown,
    buildDeltaNuevasMarkdown,
    formatScoreDiffBlock,
    deltaHeaders,
    DELTA_SECTION_ORDER,
    DELTA_LLM_SECTIONS,
    IDIOMA,
    REGLA_NUCLEAR,
};
