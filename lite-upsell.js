/**
 * Lite → Titan upsell: leak extraction, personalized emails, follow-up queue.
 */

const { parseSimulationFindings } = require('./fugas-builder');
const { TITAN_PRICE_USD, MONITORING_PRICE_USD } = require('./stripe-predictacore');
const {
    buildTitanUpgradeUrl,
    getSubscriptionCancellationEmailHtml,
    getSubscriptionCancellationPlain,
} = require('./brand');

function stripMarkdownInline(text) {
    return String(text || '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#+\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function truncateLeak(text, max = 140) {
    const clean = stripMarkdownInline(text);
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1).trim()}…`;
}

/** Parse numbered leaks from FUGAS_LITE LLM section */
function parseLeaksFromFugasSection(sectionText) {
    const leaks = [];
    for (const line of String(sectionText || '').split('\n')) {
        const m = line.match(/^\s*(\d+)\.\s+(.+)$/);
        if (!m) continue;
        const body = truncateLeak(m[2]);
        if (body.length < 12) continue;
        leaks.push({ index: Number(m[1]), text: body });
        if (leaks.length >= 3) break;
    }
    return leaks;
}

/** Top 3 simulation findings as short leak summaries */
function leaksFromDossier(dossier, locale) {
    const es = locale?.code?.startsWith('es');
    const findings = parseSimulationFindings(dossier).slice(0, 3);
    return findings.map((f, i) => ({
        index: i + 1,
        text: truncateLeak(
            es
                ? `${f.rule} — ${f.evidence}`
                : `${f.rule} — ${f.evidence}`,
        ),
    }));
}

function extractLiteLeaksForUpsell(progress, dossier, locale) {
    const fromSection = parseLeaksFromFugasSection(progress?.FUGAS_LITE);
    if (fromSection.length >= 2) return fromSection.slice(0, 3);
    const fromSim = leaksFromDossier(dossier, locale);
    if (fromSim.length >= 2) return fromSim;
    const es = locale?.code?.startsWith('es');
    return [
        {
            index: 1,
            text: es
                ? 'Fricción detectada en la propuesta de valor o titular principal — los visitantes no entienden qué comprar en los primeros segundos.'
                : 'Friction on your main headline or value proposition — visitors do not understand what to buy in the first seconds.',
        },
        {
            index: 2,
            text: es
                ? 'Señales de confianza o datos técnicos insuficientes para Google e IAs — pierdes visibilidad y credibilidad.'
                : 'Insufficient trust signals or technical data for Google and AI engines — you lose visibility and credibility.',
        },
        {
            index: 3,
            text: es
                ? 'Fricción en checkout, envío o CTA — el comprador duda antes de pagar.'
                : 'Checkout, shipping, or CTA friction — buyers hesitate before paying.',
        },
    ];
}

function buildUpsellTitanUrl({ email, dna, lang, campaign }) {
    const base = buildTitanUpgradeUrl({ email, dna, lang });
    const u = new URL(base);
    if (campaign) u.searchParams.set('from', campaign);
    return u.toString();
}

function formatMetricsLine(metrics, lang) {
    const es = lang === 'es';
    const parts = [];
    if (metrics?.seoScore != null) parts.push(es ? `SEO ${metrics.seoScore}/100` : `SEO ${metrics.seoScore}/100`);
    if (metrics?.aiScore != null) parts.push(es ? `IA ${metrics.aiScore}/100` : `AI ${metrics.aiScore}/100`);
    if (metrics?.loadTimeSec != null) parts.push(es ? `Carga ${metrics.loadTimeSec}s` : `Load ${metrics.loadTimeSec}s`);
    return parts.join(' · ');
}

function leaksHtmlBlock(leaks, lang) {
    const es = lang === 'es';
    const title = es
        ? 'Fallas detectadas en tu Lite — siguen activas hasta que las corrijas:'
        : 'Issues found in your Lite scan — still active until you fix them:';
    const items = (leaks || []).slice(0, 3).map((leak) => {
        const label = es ? `Fuga #${leak.index}` : `Leak #${leak.index}`;
        return `<li style="margin:0 0 10px 0;padding:10px 12px;background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;border-radius:4px;list-style:none;">
      <strong style="color:#fca5a5;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">${label}</strong>
      <p style="margin:6px 0 0 0;font-size:14px;line-height:1.55;color:#e4e4e7;">${leak.text}</p>
    </li>`;
    }).join('');
    const foot = es
        ? '<p style="font-size:13px;color:#a1a1aa;margin:12px 0 0 0;line-height:1.5;">El Lite solo mostró 3. El Reporte Titán rankea las <strong style="color:#34d399;">15 fugas</strong> y da <strong style="color:#34d399;">15 acciones</strong> paso a paso — sin relleno.</p>'
        : '<p style="font-size:13px;color:#a1a1aa;margin:12px 0 0 0;line-height:1.5;">Lite showed 3 only. The Titan Report ranks all <strong style="color:#34d399;">15 leaks</strong> with <strong style="color:#34d399;">15 step-by-step fixes</strong> — no fluff.</p>';
    return `<p style="font-size:14px;font-weight:700;color:#fff;margin:0 0 12px 0;">${title}</p><ul style="margin:0;padding:0;">${items}</ul>${foot}`;
}

function leaksTextBlock(leaks, lang) {
    const es = lang === 'es';
    const head = es
        ? 'Fallas detectadas en tu Lite (siguen activas — sigues perdiendo ventas):'
        : 'Issues found in your Lite scan (still active — you are still losing sales):';
    const lines = (leaks || []).slice(0, 3).map((l) => `${l.index}. ${l.text}`);
    const foot = es
        ? 'Lite = 3 fugas. Titán = 15 fugas rankeadas + 15 acciones + PDF completo.'
        : 'Lite = 3 leaks. Titan = 15 ranked leaks + 15 actions + full PDF.';
    return [head, ...lines, '', foot].join('\n');
}

function getLiteEmailContent({ variant, lang, targetUrl, titanUrl, leaks, metrics, daysSinceLite }) {
    const es = lang === 'es';
    const metricsLine = formatMetricsLine(metrics, lang);
    const ctaLabel = es ? `Pagar $${TITAN_PRICE_USD} — Reporte Titán` : `Pay $${TITAN_PRICE_USD} — Titan Report`;
    const cancelHtml = getSubscriptionCancellationEmailHtml(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);

    let subject;
    let headline;
    let intro;

    if (variant === 'day1') {
        subject = es
            ? `PredictaCore — Tus 3 fugas siguen activas en ${targetUrl || 'tu página'}`
            : `PredictaCore — Your 3 leaks are still live on ${targetUrl || 'your page'}`;
        headline = es
            ? 'Ayer recibiste el Lite. Las fugas no se arreglan solas.'
            : 'You got your Lite yesterday. These leaks do not fix themselves.';
        intro = es
            ? `Cada día que <strong style="color:#fff;">${targetUrl || 'tu página'}</strong> sigue igual, visitantes entran, ven la fricción y se van sin comprar. Tu Lite ya identificó problemas reales — el Reporte Titán muestra las <strong style="color:#10b981;">15 fugas completas</strong> y qué hacer en cada una.`
            : `Every day <strong style="color:#fff;">${targetUrl || 'your page'}</strong> stays unchanged, visitors hit friction and leave without buying. Your Lite already flagged real issues — the Titan Report shows all <strong style="color:#10b981;">15 leaks</strong> and exactly what to do about each one.`;
    } else if (variant === 'weekly') {
        const weeks = Math.max(1, Math.round((daysSinceLite || 7) / 7));
        subject = es
            ? `PredictaCore — Semana ${weeks}: sigues perdiendo ventas por las mismas fugas`
            : `PredictaCore — Week ${weeks}: you are still losing sales to the same leaks`;
        headline = es
            ? `Llevas ${weeks} semana${weeks > 1 ? 's' : ''} con las mismas fugas sin el plan completo`
            : `${weeks} week${weeks > 1 ? 's' : ''} with the same leaks and no full fix plan`;
        intro = es
            ? `Tu escaneo Lite de <strong style="color:#fff;">${targetUrl || 'tu página'}</strong> no era opinión — eran datos duros${metricsLine ? ` (${metricsLine})` : ''}. Esas fallas <strong style="color:#ef4444;">siguen presentes</strong> hasta que las corrijas. Titán te da el mapa completo: 15 fugas, 15 acciones, benchmark y plan 21 días.`
            : `Your Lite scan of <strong style="color:#fff;">${targetUrl || 'your page'}</strong> was not opinion — it was hard data${metricsLine ? ` (${metricsLine})` : ''}. Those failures are <strong style="color:#ef4444;">still present</strong> until you fix them. Titan gives you the full map: 15 leaks, 15 actions, benchmark, and a 21-day plan.`;
    } else {
        subject = es
            ? 'PredictaCore — Encontramos fugas en tu página (12 más ocultas en Titán)'
            : 'PredictaCore — We found leaks on your page (12 more hidden in Titan)';
        headline = es ? 'Encontramos fugas — te faltan 12 más' : 'We found leaks — 12 more are still hidden';
        intro = es
            ? `Adjunto va tu PDF Lite de <strong style="color:#fff;">${targetUrl || 'tu página'}</strong>. Abre el adjunto primero — luego usa el botón de abajo para desbloquear el Reporte Titán completo.`
            : `Your Lite PDF for <strong style="color:#fff;">${targetUrl || 'your page'}</strong> is attached. Open the PDF first — then use the button below to unlock the full Titan Report.`;
    }

    const whyTitan = es
        ? '<p style="font-size:14px;line-height:1.65;margin:16px 0;color:#d1d5db;">Sin Titán solo ves 3 puntos. Con Titán obtienes las <strong>15 fugas rankeadas</strong>, <strong>15 acciones tácticas</strong>, capturas desktop/móvil, comparativa con competencia y hoja de ruta de 21 días — entregado en ~60 minutos.</p>'
        : '<p style="font-size:14px;line-height:1.65;margin:16px 0;color:#d1d5db;">Without Titan you only see 3 issues. With Titan you get <strong>15 ranked leaks</strong>, <strong>15 tactical actions</strong>, desktop/mobile captures, competitor benchmark, and a 21-day roadmap — delivered in ~60 minutes.</p>';

    const pdfBanner = variant === 'initial'
        ? (es
            ? '<p style="margin:0 0 18px 0;padding:12px 14px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:6px;font-size:14px;line-height:1.5;color:#d1d5db;text-align:center;"><strong style="color:#10b981;">PDF Lite adjunto</strong> — ábrelo primero. Las fugas abajo siguen activas en tu página.</p>'
            : '<p style="margin:0 0 18px 0;padding:12px 14px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:6px;font-size:14px;line-height:1.5;color:#d1d5db;text-align:center;"><strong style="color:#10b981;">Lite PDF attached</strong> — open it first. The leaks below are still live on your page.</p>')
        : '';

    const html = `${pdfBanner}
  <h1 style="color:#fff;font-size:20px;text-align:center;margin:0 0 12px 0;line-height:1.35;">${headline}</h1>
  <p style="font-size:14px;line-height:1.65;margin:0 0 16px 0;color:#d1d5db;">${intro}</p>
  ${metricsLine && variant !== 'initial' ? `<p style="font-size:13px;color:#71717a;margin:0 0 14px 0;text-align:center;">${metricsLine}</p>` : ''}
  <div style="margin:0 0 20px 0;padding:14px;background:rgba(0,0,0,0.35);border:1px solid rgba(63,63,70,0.6);border-radius:8px;">
    ${leaksHtmlBlock(leaks, lang)}
  </div>
  ${whyTitan}
  <p style="margin:28px 0;text-align:center;"><a href="${titanUrl}" style="background:#10b981;color:#000;padding:14px 28px;text-decoration:none;font-weight:900;border-radius:6px;display:inline-block;font-size:14px;text-transform:uppercase;letter-spacing:0.04em;">${ctaLabel}</a></p>
  <p style="font-size:13px;color:#71717a;text-align:center;margin:0 0 8px 0;">${es ? 'Tu correo y URL ya están listos — un clic para pagar.' : 'Your email and URL are pre-filled — one click to pay.'}</p>
  ${cancelHtml}
  <p style="font-size:11px;color:#71717a;text-align:center;margin-top:16px;">PredictaCore · predictacore.ai</p>`;

    const text = [
        stripMarkdownInline(headline),
        '',
        stripMarkdownInline(intro.replace(/<[^>]+>/g, '')),
        '',
        leaksTextBlock(leaks, lang),
        '',
        es ? `Obtener Titán: ${titanUrl}` : `Get Titan: ${titanUrl}`,
        '',
        cancelPlain,
    ].join('\n');

    const preheader = variant === 'day1'
        ? (es ? 'Tus fugas del Lite siguen activas — desbloquea las 15 con Titán' : 'Your Lite leaks are still active — unlock all 15 with Titan')
        : variant === 'weekly'
            ? (es ? 'Sigues perdiendo ventas — el plan completo está a un clic' : 'You are still losing sales — full plan one click away')
            : (es ? 'PDF Lite adjunto + 3 fugas detectadas' : 'Lite PDF attached + 3 leaks found');

    return { subject, preheader, html, text, ctaLabel };
}

function getLiteReportEmailCopy({ lang, titanUrl, targetUrl, leaks, metrics, variant = 'initial', daysSinceLite }) {
    const content = getLiteEmailContent({
        variant,
        lang,
        targetUrl,
        titanUrl,
        leaks: leaks || [],
        metrics: metrics || {},
        daysSinceLite,
    });
    return {
        subject: content.subject,
        preheader: content.preheader,
        html: content.html,
        text: content.text,
    };
}

/** Sample leaks for email previews (baby bedding Shopify — no brand names) */
function getSamplePreviewLeaks(lang) {
    const es = lang === 'es';
    return es
        ? [
            { index: 1, text: 'Google corta tu descripción en resultados — el comprador no ve tus keywords de productos personalizados antes de que termine el snippet.' },
            { index: 2, text: 'Sin fecha de entrega visible en pedidos hechos a medida — dudan en artículos personalizados.' },
            { index: 3, text: 'Falta encabezado H1 principal — Google y visitantes no entienden la propuesta de valor en segundos.' },
        ]
        : [
            { index: 1, text: 'Google cuts off your search description — shoppers never see your personalized product keywords before the snippet ends.' },
            { index: 2, text: 'No delivery date on custom orders — buyers hesitate on made-to-order items.' },
            { index: 3, text: 'Missing primary H1 headline — Google and visitors cannot grasp your value proposition in seconds.' },
        ];
}

module.exports = {
    extractLiteLeaksForUpsell,
    buildUpsellTitanUrl,
    getLiteReportEmailCopy,
    getLiteEmailContent,
    getSamplePreviewLeaks,
    leaksHtmlBlock,
    parseLeaksFromFugasSection,
};
