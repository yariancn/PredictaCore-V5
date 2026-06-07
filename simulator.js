/** Simulaciones medibles: perfiles psicológicos por giro — sin contar visitas ni inflar números */

const { detectGiro, buildClientProfiles, formatGiroBlock } = require('./giro');

const TRUST_WORDS = /garant|devoluc|reseñ|review|testimon|certif|segur|confian|años|experiencia|clientes|licencia|certified|certific/i;
const PRICE_WORDS = /\$|usd|mxn|precio|desde|tarifa|plan|costo|€|£|price/i;
const CTA_WORDS = /reserv|agenda|cita|contact|whatsapp|wa\.me|compr|buy|shop|cart|carrito|quote|cotiz|llama|call|book|signup|registr/i;
const LOCATION_WORDS = /ubicación|dirección|location|address|map|google maps|horario|hours|abierto|cdmx|guadalajara|monterrey|mexico|méxico|street|avenida| Blvd/i;

function runWebSimulation(ctx) {
    const findings = [];
    let ruleId = 0;
    const giroText = `${ctx.title || ''} ${ctx.h1Text || ''} ${ctx.bodySample || ''}`;
    const giro = detectGiro(giroText, false);

    const add = (persona, rule, pass, evidence, severity = 'media') => {
        ruleId += 1;
        findings.push({
            id: ruleId, persona, rule, pass,
            evidence: String(evidence || 'NO_DETECTADO').slice(0, 200),
            severity: pass ? 'ok' : severity,
        });
    };

    const text = giroText;
    const ctas = ctx.ctas || '';
    const load = parseFloat(ctx.loadTimeSec) || 99;
    const altPct = ctx.imgsAltPct ?? 0;
    const robotsNoIndex = String(ctx.robotsMeta || '').toLowerCase().includes('noindex');

    // Escéptico — confianza
    add('escéptico', 'Señales de confianza en copy', TRUST_WORDS.test(text),
        TRUST_WORDS.test(text) ? 'Términos de confianza en texto' : 'Sin garantías/credenciales visibles');
    add('escéptico', 'Schema.org / datos estructurados', (ctx.jsonLdCount || 0) > 0,
        `JSON-LD: ${ctx.jsonLdCount || 0} bloques`, 'alta');
    add('escéptico', 'Contacto verificable (email/tel)', ctx.hasContact,
        ctx.hasContact ? 'Contacto en página' : 'Sin email/tel detectado', 'alta');
    add('escéptico', 'Canonical definido', ctx.canonical && ctx.canonical !== 'AUSENTE',
        `Canonical: ${ctx.canonical || 'AUSENTE'}`, 'media');

    // Apurado — velocidad y acción
    add('apurado', 'Tiempo de carga ≤ 4s', load <= 4, `TIEMPO_CARGA_SEG: ${load}`, load > 6 ? 'critica' : 'alta');
    add('apurado', 'CTA de acción visible', CTA_WORDS.test(ctas) || CTA_WORDS.test(text.slice(0, 800)),
        `CTAS: ${ctas.slice(0, 100) || 'VACIO'}`, 'critica');
    add('apurado', 'Título claro (≥ 20 chars)', (ctx.title || '').length >= 20,
        `Title: ${(ctx.title || '').slice(0, 80)}`, 'media');
    add('apurado', 'Meta description útil (≥ 50 chars)', (ctx.metaDescription || '').length >= 50,
        `Meta: ${(ctx.metaDescription || '').length} chars`, 'media');

    // Mobile
    add('mobile', 'Viewport mobile', ctx.viewport === 'OK', `Viewport: ${ctx.viewport || 'AUSENTE'}`, 'alta');
    add('mobile', 'H1 único', ctx.h1Count === 1, `H1_COUNT: ${ctx.h1Count}`, ctx.h1Count === 0 ? 'critica' : 'media');
    add('mobile', 'Alt en imágenes (≥ 50%)', altPct >= 50, `Alt coverage: ${altPct}%`, 'media');
    add('mobile', 'Enlaces internos de navegación (≥ 5)', (ctx.internalLinks || 0) >= 5,
        `Enlaces internos: ${ctx.internalLinks || 0}`, 'media');

    // Comparador — oferta
    add('comparador', 'Propuesta de valor en H1', (ctx.h1Text || '').length > 10,
        `H1: ${ctx.h1Text || 'AUSENTE'}`, 'alta');
    add('comparador', 'Precio u oferta señalada', PRICE_WORDS.test(text) || PRICE_WORDS.test(ctas),
        PRICE_WORDS.test(text) ? 'Precio/oferta detectada' : 'Sin precio ni rango visible', 'alta');
    add('comparador', 'Contenido suficiente (≥ 300 palabras)', (ctx.wordCount || 0) >= 300,
        `Palabras: ${ctx.wordCount || 0}`, 'media');
    add('comparador', 'Ubicación u horario (si negocio local)', LOCATION_WORDS.test(text),
        LOCATION_WORDS.test(text) ? 'Señales de ubicación/horario' : 'Sin ubicación/horario claro', 'media');

    // SEO / IA transversal
    add('escéptico', 'Visibilidad en IAs (score técnico)', (ctx.aiScore || 0) >= 50,
        `AI_SCORE: ${ctx.aiScore ?? 'N/A'}/100`, 'alta');
    add('apurado', 'SEO técnico base', (ctx.seoScore || 0) >= 50,
        `SEO_SCORE: ${ctx.seoScore ?? 'N/A'}/100`, 'media');
    add('mobile', 'Indexable (sin noindex)', !robotsNoIndex,
        `Robots meta: ${ctx.robotsMeta || 'AUSENTE'}`, robotsNoIndex ? 'critica' : 'ok');
    add('comparador', 'Sitemap accesible', ctx.sitemapFound === true,
        ctx.sitemapFound ? 'Sitemap encontrado' : 'Sitemap no detectado', 'media');

    // Reglas por giro
    if (giro.id === 'ecommerce') {
        add('apurado', 'Botón de compra en producto', ctx.botonesProducto !== 'NO_DETECTADO' && ctx.botonesProducto !== 'ERROR_AL_SONDEAR_PRODUCTO',
            `BOTONES_PRODUCTO: ${(ctx.botonesProducto || '').slice(0, 80)}`, 'critica');
        add('escéptico', 'Política envío/devolución mencionada', /envío|envio|shipping|devoluc|return|refund/i.test(text),
            /envío|shipping|devoluc/i.test(text) ? 'Política detectada' : 'Sin política envío/devolución visible', 'alta');
    }
    if (giro.id === 'salud' || giro.id === 'restaurante') {
        add('apurado', 'CTA reserva/cita/contacto', /reserv|cita|agenda|whatsapp|wa\.me|llamar|call/i.test(ctas + text.slice(0, 1000)),
            'CTA de reserva/contacto', 'critica');
    }
    if (giro.id === 'servicios') {
        add('comparador', 'Propuesta de servicio explícita', /servicio|service|solución|solution|metod|proceso|package|paquete/i.test(text),
            'Descripción de servicio en copy', 'alta');
    }

    const failed = findings.filter((f) => !f.pass && f.severity !== 'ok');
    const profiles = buildClientProfiles(giro.id, false);

    return {
        giro,
        profiles,
        findings,
        failed,
        critical: failed.filter((f) => f.severity === 'critica'),
    };
}

function runSocialSimulation(ctx) {
    const findings = [];
    let ruleId = 0;
    const giroText = `${ctx.bioSnippet || ''} ${ctx.title || ''} ${ctx.textSample || ''}`;
    const giro = detectGiro(giroText, true);

    const add = (persona, rule, pass, evidence, severity = 'media') => {
        ruleId += 1;
        findings.push({
            id: ruleId, persona, rule, pass,
            evidence: String(evidence || '').slice(0, 200),
            severity: pass ? 'ok' : severity,
        });
    };

    const bio = ctx.bioSnippet || '';
    const links = bio + (ctx.externalLinks || '');

    add('escéptico', 'Bio describe el negocio (≥ 40 chars)', bio.length >= 40, `Bio: ${bio.slice(0, 100)}`, 'alta');
    add('escéptico', 'Contacto en bio (email/tel)', ctx.hasEmail || ctx.hasPhone,
        `Email:${ctx.hasEmail ? 'SI' : 'NO'} Tel:${ctx.hasPhone ? 'SI' : 'NO'}`, 'alta');
    add('escéptico', 'Score visibilidad IA del perfil', (ctx.aiScore || 0) >= 45,
        `AI_SCORE: ${ctx.aiScore}/100`, 'media');

    add('apurado', 'Web propia o link externo', (ctx.externalLinkCount || 0) > 0,
        `Links externos: ${ctx.externalLinkCount || 0}`, 'critica');
    add('apurado', 'CTA claro (reserva/compra/web/DM)', CTA_WORDS.test(links),
        CTA_WORDS.test(links) ? 'CTA detectado' : 'Sin CTA claro en bio/links', 'critica');

    add('mobile', 'Bio legible y accionable', bio.length >= 25 && CTA_WORDS.test(links),
        'Bio + CTA para móvil', 'alta');
    add('mobile', 'Contenido público suficiente', (ctx.wordCount || 0) >= 100,
        `Palabras visibles: ${ctx.wordCount || 0}`, 'media');

    add('comparador', 'Propuesta de valor en bio', /servicio|product|shop|clinic|studio|coach|restaurant|salon|tienda|marca|brand/i.test(bio),
        `Bio comercial: ${bio.slice(0, 80)}`, 'alta');
    add('comparador', 'Ubicación o nicho identificable', LOCATION_WORDS.test(giroText) || giroText.length > 50,
        'Señales de nicho/ubicación en perfil', 'media');

    add('escéptico', 'Entidad fuera de plataforma (web/NAP)', (ctx.externalLinkCount || 0) > 0 && (ctx.hasEmail || ctx.hasPhone || /http/i.test(ctx.externalLinks || '')),
        'Prueba de entidad externa', 'alta');

    if (giro.id === 'ecommerce_social') {
        add('apurado', 'Señal de venta/catálogo en bio', /shop|tienda|envío|precio|catalog|catálogo|dm|whatsapp/i.test(bio),
            'Bio orientada a venta', 'alta');
    }

    const failed = findings.filter((f) => !f.pass);
    const profiles = buildClientProfiles(giro.id, true);

    return {
        giro,
        profiles,
        findings,
        failed,
        critical: failed.filter((f) => f.severity === 'critica'),
        platform: ctx.platform,
    };
}

function formatSimulationBlock(result, assetType) {
    const lines = result.findings.map((f) => {
        const status = f.pass ? 'PASS' : f.severity.toUpperCase();
        return `#${f.id} | persona=${f.persona} | ${status} | ${f.rule} | evidencia=${f.evidence}`;
    });
    const failedLines = result.failed.map((f) => `#${f.id} [${f.persona}] ${f.rule} → ${f.evidence}`);

    const giroBlock = formatGiroBlock({
        giro: result.giro,
        profiles: result.profiles,
        isSocial: assetType === 'social',
        platform: result.platform,
    });

    return `${giroBlock}
=== SIMULATION_RESULTS (DATOS REALES — USAR EN GEMELOS Y FUGAS) ===
TIPO: ${assetType}
REGLA_IA: Prioriza FALLAS_PRIORITARIAS en Sección VIII. Cada fuga debe citar #id. PROHIBIDO inventar fallos no listados. PROHIBIDO mencionar cantidad de simulaciones o visitas.
${lines.join('\n')}
FALLAS_PRIORITARIAS:
${failedLines.length ? failedLines.join('\n') : 'NINGUNA_FALLA_CRITICA_EN_REGLAS'}
=== FIN SIMULATION_RESULTS ===`;
}

module.exports = {
    runWebSimulation,
    runSocialSimulation,
    formatSimulationBlock,
    detectGiro,
};
