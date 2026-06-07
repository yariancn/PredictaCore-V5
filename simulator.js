/** Rule-based friction simulation — gemelos sintéticos como evaluaciones medibles (solo URL) */

const PERSONAS = [
    { id: 'escéptico', label: 'Comprador escéptico', focus: 'confianza y prueba social' },
    { id: 'apurado', label: 'Comprador apurado', focus: 'CTA y velocidad' },
    { id: 'mobile', label: 'Usuario móvil', focus: 'usabilidad móvil' },
    { id: 'comparador', label: 'Comparador de precio', focus: 'claridad de oferta' },
];

const TRUST_WORDS = /garant|devoluc|reseñ|review|testimon|certif|segur|confian|años|experiencia|clientes/i;
const PRICE_WORDS = /\$|usd|mxn|precio|desde|tarifa|plan|costo|€|£/i;
const URGENCY_WORDS = /hoy|ahora|limitad|últim|24\s*h|gratis|descuento|promo/i;

function runWebSimulation(ctx) {
    const findings = [];
    let ruleId = 0;

    const add = (persona, rule, pass, evidence, severity = 'media') => {
        ruleId += 1;
        findings.push({
            id: ruleId,
            persona,
            rule,
            pass,
            evidence: String(evidence || 'NO_DETECTADO').slice(0, 200),
            severity: pass ? 'ok' : severity,
        });
    };

    const text = `${ctx.title || ''} ${ctx.metaDescription || ''} ${ctx.bodySample || ''}`;
    const ctas = ctx.ctas || '';
    const load = parseFloat(ctx.loadTimeSec) || 99;
    const altPct = ctx.imgsAltPct ?? 0;

    // Escéptico
    add('escéptico', 'Señales de confianza en copy público', TRUST_WORDS.test(text),
        TRUST_WORDS.test(text) ? 'Términos de confianza detectados en texto' : 'Sin garantías/reseñas/testimonios visibles en scrape');
    add('escéptico', 'Schema.org / datos estructurados', (ctx.jsonLdCount || 0) > 0,
        `JSON-LD bloques: ${ctx.jsonLdCount || 0}`, 'alta');
    add('escéptico', 'Canonical definido', ctx.canonical && ctx.canonical !== 'AUSENTE',
        `Canonical: ${ctx.canonical || 'AUSENTE'}`, 'media');
    add('escéptico', 'Contacto verificable (email/tel en página)', ctx.hasContact,
        ctx.hasContact ? 'Email o teléfono en texto público' : 'Sin email/tel detectado', 'alta');

    // Apurado
    add('apurado', 'Tiempo de carga ≤ 4s', load <= 4,
        `TIEMPO_CARGA_SEG: ${load}`, load > 6 ? 'critica' : 'alta');
    add('apurado', 'CTA visible en scrape inicial', ctas.length > 15,
        `CTAS_INICIO: ${ctas.slice(0, 120) || 'VACIO'}`, 'critica');
    add('apurado', 'Título de página claro (≥ 20 chars)', (ctx.title || '').length >= 20,
        `Title: ${(ctx.title || 'AUSENTE').slice(0, 80)}`, 'media');
    add('apurado', 'Meta description presente', (ctx.metaDescription || '').length >= 50,
        `Meta (${(ctx.metaDescription || '').length} chars)`, 'media');

    // Mobile
    add('mobile', 'Viewport mobile configurado', ctx.viewport === 'OK',
        `Viewport: ${ctx.viewport || 'AUSENTE'}`, 'alta');
    add('mobile', 'H1 único (jerarquía clara)', ctx.h1Count === 1,
        `H1_COUNT: ${ctx.h1Count}`, ctx.h1Count === 0 ? 'critica' : 'media');
    add('mobile', 'Imágenes con alt descriptivo (≥ 50%)', altPct >= 50,
        `IMAGENES_ALT_COVERAGE: ${altPct}%`, 'media');

    // Comparador
    add('comparador', 'Precio u oferta visible en texto/CTA', PRICE_WORDS.test(text) || PRICE_WORDS.test(ctas),
        PRICE_WORDS.test(text) ? 'Precio/oferta en contenido' : 'Sin precio ni rango detectado en scrape', 'alta');
    add('comparador', 'Propuesta de valor en H1', (ctx.h1Text || '').length > 10,
        `H1_TEXT: ${ctx.h1Text || 'AUSENTE'}`, 'alta');
    add('comparador', 'Profundidad de contenido (≥ 300 palabras)', (ctx.wordCount || 0) >= 300,
        `PALABRAS_EN_PAGINA: ${ctx.wordCount || 0}`, 'media');
    add('comparador', 'Botón de compra en producto (si e-commerce)', ctx.botonesProducto !== 'NO_DETECTADO' && ctx.botonesProducto !== 'ERROR_AL_SONDEAR_PRODUCTO',
        `BOTONES_PRODUCTO: ${(ctx.botonesProducto || 'NO_DETECTADO').slice(0, 100)}`, 'media');

    // Transversal
    add('escéptico', 'Visibilidad en IAs (score técnico)', (ctx.aiScore || 0) >= 50,
        `AI_DISCOVERABILITY_SCORE: ${ctx.aiScore ?? 'N/A'}/100`, 'alta');
    add('apurado', 'SEO técnico base', (ctx.seoScore || 0) >= 50,
        `SEO_TECNICO_SCORE: ${ctx.seoScore ?? 'N/A'}/100`, 'media');

    const failed = findings.filter((f) => !f.pass && f.severity !== 'ok');
    const critical = failed.filter((f) => f.severity === 'critica');

    return { findings, failed, critical, evaluationCount: findings.length };
}

function runSocialSimulation(ctx) {
    const findings = [];
    let ruleId = 0;
    const add = (persona, rule, pass, evidence, severity = 'media') => {
        ruleId += 1;
        findings.push({ id: ruleId, persona, rule, pass, evidence: String(evidence || '').slice(0, 200), severity: pass ? 'ok' : severity });
    };

    const bio = ctx.bioSnippet || '';
    add('escéptico', 'Bio descriptiva (≥ 40 chars)', bio.length >= 40, `BIO: ${bio.slice(0, 100)}`, 'alta');
    add('escéptico', 'Contacto en bio', ctx.hasEmail || ctx.hasPhone, `Email: ${ctx.hasEmail ? 'SI' : 'NO'} | Tel: ${ctx.hasPhone ? 'SI' : 'NO'}`, 'alta');
    add('apurado', 'Link externo / web propia', (ctx.externalLinkCount || 0) > 0, `LINKS_EXTERNOS: ${ctx.externalLinkCount || 0}`, 'critica');
    add('mobile', 'Contenido público suficiente', (ctx.wordCount || 0) >= 100, `Palabras: ${ctx.wordCount || 0}`, 'media');
    add('comparador', 'CTA claro en bio o links', /reserv|cita|compr|shop|link|web|whatsapp|wa\.me|http/i.test(bio + (ctx.externalLinks || '')),
        'CTA/link detectado en perfil', 'alta');
    add('escéptico', 'Score visibilidad IA perfil', (ctx.aiScore || 0) >= 45, `AI_SCORE: ${ctx.aiScore}/100`, 'media');

    const failed = findings.filter((f) => !f.pass);
    return { findings, failed, critical: failed.filter((f) => f.severity === 'critica'), evaluationCount: findings.length };
}

function formatSimulationBlock(result, assetType) {
    const lines = result.findings.map((f) => {
        const status = f.pass ? 'PASS' : f.severity.toUpperCase();
        return `#${f.id} | persona=${f.persona} | ${status} | ${f.rule} | evidencia=${f.evidence}`;
    });
    const failedLines = result.failed.map((f) => `#${f.id} [${f.persona}] ${f.rule} → ${f.evidence}`);

    return `
=== SIMULATION_RESULTS (DATOS REALES — USAR EN GEMELOS Y FUGAS) ===
TIPO: ${assetType}
EVALUACIONES_EJECUTADAS: ${result.evaluationCount} (${PERSONAS.length} perfiles × reglas medibles)
FALLAS_DETECTADAS: ${result.failed.length} | CRITICAS: ${result.critical.length}
REGLA_IA: Las secciones II (Perfiles) y VIII (Fugas) DEBEN basarse en estas evaluaciones. Cada fuga crítica debe citar #id de simulación. PROHIBIDO inventar fallos no listados aquí.
${lines.join('\n')}
FALLAS_PRIORITARIAS:
${failedLines.length ? failedLines.join('\n') : 'NINGUNA_FALLA_CRITICA_EN_REGLAS'}
=== FIN SIMULATION_RESULTS ===`;
}

module.exports = { runWebSimulation, runSocialSimulation, formatSimulationBlock, PERSONAS };
