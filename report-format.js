/** Post-procesado y UI del PDF según idioma del activo */

const { resolveReportLocale, parseLocaleFromDossier } = require('./idioma');
const { TITAN_PRICE_USD, MONITORING_PRICE_USD } = require('./stripe-predictacore');
const { getSubscriptionCancellationPlain, getSubscriptionCancellationEmailHtml } = require('./brand');
const {
    buildFugasFromDossier,
    stripPlaceholderLeaks,
    hasPlaceholderLeaks,
    PLACEHOLDER_RE,
} = require('./fugas-builder');

function getLocaleFromDossier(dossier) {
    return parseLocaleFromDossier(dossier);
}

function getLanguageLockInstruction(locale) {
    if (locale.code.startsWith('es')) {
        return 'BLOQUEO DE IDIOMA: Redacta TODA esta sección en español latinoamericano. PROHIBIDO mezclar inglés (salvo marcas: Google, Stripe, Shopify). Traduce encabezados, diagnósticos y acciones.';
    }
    if (locale.code.startsWith('en')) {
        return 'LANGUAGE LOCK: Write this entire section in US business English. Do not mix Spanish except proper nouns.';
    }
    return 'Detect language from IDIOMA_REPORTE block and write consistently in ONE language only.';
}

function countNumberedItems(text) {
    return ((text || '').match(/^\s*\d+\.\s+/gm) || []).length;
}

const PRIORITY_START_RE = /^(?:\*\*)?(?:\[)?(Critical|Crítico|High|Alto|Medium|Medio|Low|Bajo)(?:\])?\]?\*?\*?\s*(.*)$/i;
const PRIORITY_ONLY_RE = /^(?:\*\*)?(?:\[)?(Critical|Crítico|High|Alto|Medium|Medio|Low|Bajo)(?:\])?\]?\*?\*?\s*$/i;

function normalizePriorityPrefix(item) {
    return String(item || '')
        .replace(/^P1\s*[—\-]?\s*(?:CRITICAL HEMORRHAGE|HEMORRAGIA CRÍTICA)\s*/i, '**Critical:** ')
        .replace(/^P2\s*[—\-]?\s*(?:SEVERE LEAK|FUGA GRAVE)\s*/i, '**High:** ')
        .replace(/^P3\s*[—\-]?\s*(?:MODERATE LEAK|FUGA MODERADA)\s*/i, '**Medium:** ')
        .replace(/^P4\s*[—\-]?\s*(?:MINOR FRICTION|FRICCIÓN MENOR)\s*/i, '**Low:** ')
        .replace(/^\*\*\[P[1-4][^\]]*\]\*\*\s*/i, '')
        .replace(/^(Critical|Crítico)\]\*?\*?\s*/i, '**Critical:** ')
        .replace(/^(Critical|Crítico)\s+(?!:\*\*)/i, '**Critical:** ')
        .replace(/^(High|Alto)\]\*?\*?\s*/i, '**High:** ')
        .replace(/^(Medium|Medio)\]\*?\*?\s*/i, '**Medium:** ')
        .replace(/^(Low|Bajo)\]\*?\*?\s*/i, '**Low:** ')
        .replace(/^(High|Alto)\s+(?!:\*\*)/i, '**High:** ')
        .replace(/^(Medium|Medio)\s+(?!:\*\*)/i, '**Medium:** ')
        .replace(/^(Low|Bajo)\s+(?!:\*\*)/i, '**Low:** ')
        .replace(/^\*\*(Critical|High|Medium|Low|Crítico|Alto|Medio|Bajo):\*\*\s*/i, (m, p) => {
            const map = { crítico: 'Critical', alto: 'High', medio: 'Medium', bajo: 'Low' };
            const key = p.toLowerCase();
            return `**${map[key] || p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()}:** `;
        })
        .trim();
}

function extractPriorityItems(body) {
    const items = [];
    let current = null;

    for (const rawLine of body.split('\n')) {
        const line = rawLine.trim();
        if (!line) continue;
        if (PLACEHOLDER_RE.test(line)) continue;

        const m = line.match(PRIORITY_START_RE);
        const solo = line.match(PRIORITY_ONLY_RE);
        if (m && (m[2] || solo)) {
            if (current) items.push(normalizePriorityPrefix(current));
            current = solo ? `${m[1]} ` : `${m[1]} ${m[2]}`.trim();
        } else if (current) {
            current += ` ${line}`;
        }
    }
    if (current) items.push(normalizePriorityPrefix(current));
    return items;
}

function extractWishItems(body) {
    const items = [];
    let current = null;

    for (const rawLine of body.split('\n')) {
        const line = rawLine.trim();
        if (!line) continue;
        const m = line.match(/^(?:\d+\.\s*)?(?:\*\*)?(?:Deseo|Wish):\*?\*?\s*(.*)$/i);
        if (m) {
            if (current) items.push(current.trim());
            const label = /^des/i.test(line) ? 'Deseo' : 'Wish';
            current = `**${label}:** ${m[1].trim()}`;
        } else if (current) {
            current += ` ${line}`;
        }
    }
    if (current) items.push(current.trim());
    return items.filter((p) => p.length > 15);
}

function extractActionItems(body) {
    const numbered = [];
    for (const line of body.split('\n')) {
        const m = line.match(/^\s*\d+\.\s+(.+)$/);
        if (m) numbered.push(m[1].trim());
    }
    if (numbered.length >= 3) return numbered;

    const blocks = body
        .split(/\n+(?=[A-Z][^\n]{8,90}(?::\s|\s+(?:Implement|Add|Establish|Improve|Create|Optimize|Clarify|Shorten|Integrate|Build|Fix|Enable|Remove|Move|Update|Include|Highlight|Rewrite|Deploy|Configure|Install|Set up|Write|Design|Launch|Reduce|Increase|Expand|Audit|Review|Test|Monitor|Track|Register|Submit|Connect|Migrate|Refactor|Restructure|Reorganize|Consolidate|Standardize|Automate|Schedule|Publish|Promote|Segment|Personalize|Localize|Translate|Validate|Verify|Document|Train|Educate|Inform|Notify|Remind|Follow|Respond|Engage|Convert|Capture|Collect|Display|Show|Hide|Replace|Swap|Switch|Upgrade|Downgrade|Refresh|Reload|Restore|Recover|Backup|Export|Import|Sync|Link|Unlink|Merge|Split|Filter|Sort|Search|Index|Cache|Compress|Minify|Lazy-load|Preload|Prefetch|Defer|Async|Inline|Embed|Inject|Append|Prepend|Insert|Delete|Clear|Reset|Undo|Redo|Copy|Paste|Paste|Print|Share|Post|Tweet|Pin|Tag|Label|Categorize|Group|Ungroup|Bundle|Unbundle|Discount|Price|Charge|Bill|Invoice|Refund|Cancel|Pause|Resume|Stop|Start|Begin|End|Finish|Complete|Close|Open|Lock|Unlock|Grant|Revoke|Assign|Unassign|Delegate|Escalate|Prioritize|Deprioritize|Archive|Unarchive|Flag|Unflag|Mark|Unmark|Star|Unstar|Favorite|Unfavorite|Like|Unlike|Vote|Rate|Rank|Score|Grade|Measure|Calculate|Estimate|Forecast|Predict|Analyze|Diagnose|Debug|Troubleshoot|Resolve|Mitigate|Prevent|Avoid|Eliminate|Minimize|Maximize|Optimize)))/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 25 && !/^#{1,3}\s/.test(p));
    if (blocks.length >= 3) return blocks;

    const paragraphs = body
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 30 && !/^#{1,3}\s/.test(p));
    return paragraphs;
}

function extractListItems(body, { mode = 'auto' } = {}) {
    const items = [];

    for (const line of body.split('\n')) {
        const itemMatch = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.+)$/);
        if (itemMatch) items.push(normalizePriorityPrefix(itemMatch[1].trim()));
    }
    if (items.length >= 3) return items;

    if (mode === 'fugas' || mode === 'auto') {
        const priorityItems = extractPriorityItems(body);
        if (priorityItems.length >= 3) return priorityItems;
    }

    if (mode === 'wishlist' || mode === 'auto') {
        const wishItems = extractWishItems(body);
        if (wishItems.length >= 3) return wishItems;
    }

    if (mode === 'acciones' || mode === 'auto') {
        const actionItems = extractActionItems(body);
        if (actionItems.length >= 3) return actionItems;
    }

    for (const line of body.split('\n')) {
        const titleMatch = line.match(/^\s*(\*{0,2}[A-Za-zÁÉÍÓÚáéíóú][^*\n:]{2,72}\*{0,2}):\s*(.+)$/);
        if (titleMatch) items.push(`${titleMatch[1]}: ${titleMatch[2]}`.trim());
    }
    if (items.length >= 3) return items;

    const paragraphs = body
        .split(/\n\s*\n/)
        .map((p) => normalizePriorityPrefix(p.replace(/\s+/g, ' ').trim()))
        .filter((p) => p.length > 20 && !/^#{1,3}\s/.test(p));
    if (paragraphs.length >= 3) return paragraphs;

    const lines = body.split('\n').map((l) => normalizePriorityPrefix(l.trim())).filter((l) => l.length > 30);
    if (lines.length >= 3) return lines;

    return items;
}

const SECTION_EXTRACT_MODE = {
    FUGAS: 'fugas',
    FUGAS_LITE: 'fugas',
    WISHLIST: 'wishlist',
    ACCIONES: 'acciones',
};

/** Convierte viñetas, párrafos o "Título:" en lista numerada 1..N */
function normalizeNumberedList(text, { minItems = 1, targetItems = null, mode = 'auto' } = {}) {
    if (!text || typeof text !== 'string') return text;

    const headerMatch = text.match(/^(###[^\n]+\n?)/);
    const header = headerMatch ? headerMatch[1] : '';
    const body = headerMatch ? text.slice(header.length) : text;

    const existing = countNumberedItems(body);
    if (targetItems && existing >= targetItems) {
        return text;
    }

    const items = extractListItems(body, { mode });
    if (items.length < minItems) return text;

    const trimmed = targetItems ? items.slice(0, targetItems) : items;
    const numbered = trimmed.map((item, i) => `${i + 1}. ${item}`).join('\n');
    return `${header}${header ? '\n\n' : ''}${numbered}`;
}

function detectMixedLanguage(text, locale) {
    if (!text || text.length < 80) return null;

    const esMarkers = (text.match(/\b(el|la|los|las|de|que|para|con|por|una|del|más|sitio|cliente|página|acción|fuga|visibilidad)\b/gi) || []).length;
    const enMarkers = (text.match(/\b(the|and|your|website|customer|should|however|action|leak|visibility|page)\b/gi) || []).length;
    const esDossier = /\b(AUSENTE|ENCONTRADO|PRESENTE|CAPTURA FORENSE|NO_ENCONTRADO|precio|cerca de mi|contratar|mejor)\b/i.test(text);

    if (locale.code.startsWith('es') && enMarkers >= 4 && enMarkers > esMarkers * 0.35) {
        return 'Mezcla inglés/español detectada — reescribe todo en español latinoamericano';
    }
    if (locale.code.startsWith('en') && (esMarkers >= 6 && esMarkers > enMarkers * 0.5 || esDossier)) {
        return 'Mixed Spanish/English detected — rewrite entirely in US English; translate dossier labels (ABSENT/FOUND/PRESENT, not AUSENTE/ENCONTRADO)';
    }
    return null;
}

function getVisionPromptLabels(locale) {
    if (locale?.code?.startsWith('es')) {
        return {
            desktop: 'CAPTURA FORENSE DESKTOP — analiza layout, CTAs, jerarquía visual, fricción:',
            mobile: 'CAPTURA FORENSE MOBILE — analiza usabilidad móvil:',
        };
    }
    return {
        desktop: 'FORENSIC DESKTOP SCREENSHOT — analyze layout, CTAs, visual hierarchy, friction:',
        mobile: 'FORENSIC MOBILE SCREENSHOT — analyze mobile usability:',
    };
}

function getPdfUiStrings(locale) {
    if (locale.code.startsWith('es')) {
        return {
            coverTag: 'Reporte de análisis de conversión',
            liteInsightsTitle: 'Lo que saltó a la vista de inmediato',
            coverTitle: 'Inteligencia Titán',
            evidenceTitle: 'Capturas de tu página',
            desktop: 'Escritorio',
            mobile: 'Móvil',
            assetDefault: 'Análisis del activo',
            liteTitle: 'Reporte Lite',
            liteCtaTitle: '¿Quieres el mapa completo?',
            liteCtaBody: `Titán incluye las 15 fugas principales + 15 recomendaciones paso a paso. USD $${TITAN_PRICE_USD}:`,
            brandTagline: 'Inteligencia de Negocios',
        };
    }
    return {
        coverTag: 'Conversion analysis report',
        liteInsightsTitle: 'What stood out immediately',
        coverTitle: 'Titan Intelligence',
        evidenceTitle: 'Page screenshots',
        desktop: 'Desktop',
        mobile: 'Mobile',
        assetDefault: 'Asset analysis',
        liteTitle: 'Lite Intelligence Report',
        liteCtaTitle: 'Want the full map?',
        liteCtaBody: `Titan includes all 15 main leaks + 15 step-by-step fix recommendations. USD $${TITAN_PRICE_USD}:`,
        brandTagline: 'Business Intelligence',
    };
}

function buildReportFilename(modo, targetUrl, { social } = {}) {
    let hostSlug = 'activo';
    try {
        hostSlug = new URL(targetUrl).hostname.replace(/^www\./, '');
    } catch { /* keep default */ }
    hostSlug = hostSlug.replace(/[^a-zA-Z0-9.-]+/g, '-').slice(0, 80);
    if (modo === 'LITE') return `PREDICTACORE_LITE_${hostSlug}.pdf`;
    if (modo === 'DELTA') return `PREDICTACORE_MONITORING_${hostSlug}.pdf`;
    if (social) return `PREDICTACORE_TITAN_SOCIAL_${hostSlug}.pdf`;
    return `PREDICTACORE_TITAN_${hostSlug}.pdf`;
}

function getTitanReportIntro(lang, { social = false } = {}) {
    if (lang === 'es') {
        if (social) {
            return 'Aquí está tu Reporte Titán. Encontrarás dónde pierdes clientes en tu perfil, cómo te perciben los compradores y acciones tácticas para recuperar conversiones.';
        }
        return 'Aquí está tu Reporte Titán. Encontrarás dónde pierdes clientes, cómo te ven tus compradores y correcciones concretas para aumentar ingresos.';
    }
    if (social) {
        return 'Here is your Titan Report. Inside you\'ll find where your profile loses customers, how buyers perceive you, and concrete fixes to recover conversions.';
    }
    return 'Here is your Titan Report. Inside you\'ll find where you\'re losing customers, how buyers see your page, and concrete, actionable fixes to increase revenue.';
}

function getDeltaReportIntro(lang) {
    return lang === 'es'
        ? 'Aquí está tu reporte mensual de monitoreo. Revisa qué cambió en tu página y qué acciones priorizar este mes.'
        : 'Here is your monthly monitoring report. See what changed on your page and which actions to prioritize this month.';
}

function getLiteReportIntro(lang) {
    return lang === 'es'
        ? 'Adjunto va tu auditoría Lite: 3 fallas básicas (sin plan de corrección). Para las 15 principales y cómo resolver cada una, corre el Reporte Titán — el enlace va en este mismo correo.'
        : 'Attached is your Lite audit: 3 basic flaws (no fix playbook). For all 15 main failures and how to fix each, run the Titan Report — link is in this same email.';
}

function getLiteEmailPreheader(lang) {
    return lang === 'es'
        ? 'PDF Lite adjunto — 3 fallas. Titán: 15 fallas + 15 recomendaciones para resolverlas.'
        : 'Lite PDF attached — 3 flaws. Titan: 15 flaws + 15 fix recommendations.';
}

function buildLiteUpsellEmailHtml(lang, { titanUrl, targetUrl }) {
    const es = lang === 'es';
    const title = es ? 'Encontramos fugas — te faltan 12 más' : 'We found leaks — 12 more are still hidden';
    const pdfBanner = es
        ? '<strong style="color:#10b981;">PDF Lite adjunto</strong> — ábrelo primero. Luego desbloquea el Reporte Titán completo abajo.'
        : '<strong style="color:#10b981;">Lite PDF attached</strong> — open it first. Then unlock the full Titan Report below.';
    const hook = es
        ? `Tu escaneo Lite de <strong style="color:#fff;">${targetUrl || 'tu página'}</strong> detectó fricción real. Pero cada día que pasa sin arreglar <strong style="color:#10b981;">las 15 fugas principales</strong>, sigues perdiendo visitantes que ya llegaron y se van en silencio.`
        : `Your Lite scan of <strong style="color:#fff;">${targetUrl || 'your page'}</strong> found real friction. But every day you leave <strong style="color:#10b981;">all 15 major drop-off points</strong> unfixed, you keep losing visitors who already arrived and leave in silence.`;
    const bullets = es
        ? [
            'Las <strong>15 fugas</strong> que ahuyentan compradores (no solo 3)',
            '<strong>15 acciones tácticas</strong> listas para implementar hoy',
            'PDF completo de 11 secciones · benchmark · roadmap 21 días',
            'Tu correo y URL ya están listos — un clic y pagas',
        ]
        : [
            'All <strong>15 leaks</strong> driving customers away (not just 3)',
            '<strong>15 tactical actions</strong> ready to implement today',
            'Full 11-section PDF · benchmark · 21-day roadmap',
            'Your email and URL are pre-filled — one click to pay',
        ];
    const ctaLabel = es ? `Pagar $${TITAN_PRICE_USD} — Reporte Titán` : `Pay $${TITAN_PRICE_USD} — Titan Report`;
    const pdfNote = es
        ? 'El Reporte Titán llega por correo tras el pago (hasta 60 min).'
        : 'The Titan Report arrives by email after payment (up to 60 min).';
    const cancelHtml = getSubscriptionCancellationEmailHtml(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const bulletHtml = bullets.map((b) => `<li style="margin:0 0 8px 0;">${b}</li>`).join('');

    return `<p style="margin:0 0 18px 0;padding:12px 14px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:6px;font-size:13px;line-height:1.5;color:#d1d5db;text-align:center;">${pdfBanner}</p>
  <h1 style="color:#fff;font-size:20px;text-align:center;margin:0 0 12px 0;line-height:1.3;">${title}</h1>
  <p style="font-size:14px;line-height:1.65;margin:0 0 16px 0;color:#d1d5db;">${getLiteReportIntro(lang)}</p>
  <p style="font-size:14px;line-height:1.65;margin:0 0 16px 0;color:#d1d5db;">${hook}</p>
  <ul style="font-size:13px;line-height:1.55;margin:0 0 20px 0;padding-left:18px;color:#a1a1aa;">${bulletHtml}</ul>
  <p style="margin:28px 0;text-align:center;"><a href="${titanUrl}" style="background:#10b981;color:#000;padding:14px 28px;text-decoration:none;font-weight:900;border-radius:6px;display:inline-block;font-size:14px;text-transform:uppercase;letter-spacing:0.04em;">${ctaLabel}</a></p>
  <p style="font-size:11px;color:#71717a;text-align:center;margin:0 0 8px 0;">${pdfNote}</p>
  ${cancelHtml}
  <p style="font-size:11px;color:#71717a;text-align:center;margin-top:16px;">PredictaCore · predictacore.ai</p>`;
}

function buildLiteUpsellEmailText(lang, { titanUrl, targetUrl }) {
    const es = lang === 'es';
    const lines = es
        ? [
            getLiteReportIntro(lang),
            '',
            `Tu Lite de ${targetUrl || 'tu página'} solo muestra 3 fugas. El Reporte Titán encuentra las 15 principales que ahuyentan clientes, más 15 acciones tácticas y el PDF completo de 11 secciones (USD $${TITAN_PRICE_USD}).`,
            '',
            `Un clic — tu correo y URL ya están listos:`,
            titanUrl,
            '',
            getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD),
        ]
        : [
            getLiteReportIntro(lang),
            '',
            `Your Lite for ${targetUrl || 'your page'} shows only 3 leaks. The Titan Report finds all 15 major drop-off points driving customers away, plus 15 tactical actions and the full 11-section PDF (USD $${TITAN_PRICE_USD}).`,
            '',
            `One click — your email and URL are pre-filled:`,
            titanUrl,
            '',
            getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD),
        ];
    return lines.join('\n');
}

function buildReportDeliveryEmailHtml(lang, { title, intro, portalUrl }) {
    const cancelHtml = getSubscriptionCancellationEmailHtml(
        lang,
        MONITORING_PRICE_USD,
        TITAN_PRICE_USD,
        portalUrl,
    );
    return `<h1 style="color:#fff;font-size:18px;text-align:center;margin:0 0 16px 0;">${title}</h1>
  <p style="font-size:14px;line-height:1.6;margin:0 0 12px 0;color:#d1d5db;">${intro}</p>
  ${cancelHtml}
  <p style="font-size:11px;color:#71717a;text-align:center;margin-top:20px;">PredictaCore · predictacore.ai</p>`;
}

function getReportEmailCopy(modo, locale, { titanUrl, portalUrl, social, targetUrl, leaks, metrics, variant } = {}) {
    const es = locale.code.startsWith('es');
    if (modo === 'LITE') {
        const lang = es ? 'es' : 'en';
        const { getLiteReportEmailCopy } = require('./lite-upsell');
        const mail = getLiteReportEmailCopy({
            lang,
            titanUrl: titanUrl || '',
            targetUrl,
            leaks: leaks || [],
            metrics: metrics || {},
            variant: variant || 'initial',
        });
        return {
            subject: mail.subject,
            preheader: mail.preheader,
            filename: buildReportFilename('LITE', targetUrl),
            text: mail.text,
            html: mail.html,
        };
    }
    if (modo === 'DELTA') {
        const lang = es ? 'es' : 'en';
        const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
        const portalLine = portalUrl ? `\nPortal: ${portalUrl}` : '';
        const intro = getDeltaReportIntro(lang);
        const title = es ? 'Reporte mensual de monitoreo' : 'Monthly monitoring report';
        return {
            subject: es ? 'PredictaCore — Reporte mensual de seguimiento' : 'PredictaCore — Monthly monitoring report',
            filename: buildReportFilename('DELTA', targetUrl),
            text: `${intro}\n\n${cancelPlain}${portalLine}`,
            html: buildReportDeliveryEmailHtml(lang, { title, intro, portalUrl }),
        };
    }
    const subject = social
        ? (es ? 'PredictaCore — Reporte Titán (perfil social)' : 'PredictaCore — Titan Social Audit')
        : (es ? 'PredictaCore — Reporte Titán forense' : 'PredictaCore — Titan forensic report');
    const lang = es ? 'es' : 'en';
    const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const intro = getTitanReportIntro(lang, { social });
    const title = social
        ? (es ? 'Reporte Titán — perfil social' : 'Titan Report — social profile')
        : (es ? 'Reporte Titán forense' : 'Titan forensic report');
    const portalLine = portalUrl ? `\nPortal: ${portalUrl}` : '';
    const text = `${intro}\n\n${cancelPlain}${portalLine}`;
    return {
        subject,
        filename: buildReportFilename('TITAN', targetUrl, { social }),
        text,
        html: buildReportDeliveryEmailHtml(lang, { title, intro, portalUrl }),
    };
}

const NUMBERED_SECTIONS = {
    FUGAS: 15,
    ACCIONES: 15,
    WISHLIST: 7,
    FUGAS_LITE: 3,
    OMNI: 9,
};

const LITE_SECTION_HEADERS = {
    INTRO: {
        es: '### I. RESUMEN EJECUTIVO',
        en: '### I. EXECUTIVE SUMMARY',
    },
    SEO_IA_LITE: {
        es: '### II. SEO E IA — RESUMEN',
        en: '### II. SEO & AI SNAPSHOT',
    },
    FUGAS_LITE: {
        es: '### III. LAS 3 FUGAS CRÍTICAS',
        en: '### III. 3 CRITICAL LEAKS',
    },
    UPSELL: {
        es: '### IV. SIGUIENTE PASO — REPORTE TITÁN',
        en: '### IV. NEXT STEP — TITAN REPORT',
    },
};

const LITE_SECTION_ORDER = ['INTRO', 'SEO_IA_LITE', 'FUGAS_LITE', 'UPSELL'];

function pickDossierValue(dossier, re, fallback = '') {
    const m = String(dossier || '').match(re);
    return m ? String(m[1]).trim() : fallback;
}

function litePriorityLabel(level, es) {
    const map = {
        critical: es ? 'Crítica' : 'Critical',
        high: es ? 'Alta' : 'High',
        medium: es ? 'Media' : 'Medium',
        low: es ? 'Baja' : 'Low',
    };
    return map[level] || map.medium;
}

/** Deterministic SEO + AI block — no LLM, always uses real scrape metrics */
function buildLiteSeoAiSnapshot(dossier, locale, captures = {}) {
    const es = locale?.code?.startsWith('es');
    const hdr = es ? LITE_SECTION_HEADERS.SEO_IA_LITE.es : LITE_SECTION_HEADERS.SEO_IA_LITE.en;

    const loadSec = captures.loadTimeSec ?? pickDossierValue(dossier, /TIEMPO_CARGA_SEG:\s*([\d.]+)/);
    const seoScore = captures.seoScore ?? pickDossierValue(dossier, /SEO_TECNICO_SCORE:\s*(\d+)/);
    const aiScore = captures.aiScore ?? pickDossierValue(dossier, /AI_DISCOVERABILITY_SCORE:\s*(\d+)/);
    const h1Count = pickDossierValue(dossier, /H1_COUNT:\s*(\d+)/, '0');
    const jsonLd = pickDossierValue(dossier, /JSON_LD:\s*(\d+)/, '0');
    const altPct = pickDossierValue(dossier, /IMAGENES_ALT_COVERAGE:\s*(\d+)/, '0');
    const sitemap = pickDossierValue(dossier, /SITEMAP_XML:\s*(\S+)/, '');
    const robots = pickDossierValue(dossier, /ROBOTS_TXT:\s*(\S+)/, '');
    const llms = pickDossierValue(dossier, /LLMS_TXT:\s*(\S+)/, '');

    const h1Finding = Number(h1Count) === 0
        ? (es ? 'No encontrado' : 'Not found')
        : (es ? 'Presente' : 'Found');
    const schemaFinding = Number(jsonLd) === 0
        ? (es ? 'Sin Schema.org' : 'No Schema.org')
        : `${jsonLd} ${es ? 'bloque(s)' : 'block(s)'}`;
    const altFinding = `${altPct}%`;
    const loadFinding = loadSec ? `${loadSec}s` : '—';
    const seoFinding = seoScore ? `${seoScore}/100` : '—';
    const aiFinding = aiScore ? `${aiScore}/100` : '—';

    const rows = [
        [es ? 'Titular principal (H1)' : 'Primary headline (H1)', h1Finding, Number(h1Count) === 0 ? 'critical' : 'low'],
        [es ? 'Datos estructurados (Schema)' : 'Structured data (Schema)', schemaFinding, Number(jsonLd) === 0 ? 'high' : 'low'],
        [es ? 'Texto alternativo en imágenes' : 'Image alt text coverage', altFinding, Number(altPct) < 50 ? 'high' : 'medium'],
        [es ? 'Tiempo de carga medido' : 'Measured load time', loadFinding, Number(loadSec) > 4 ? 'high' : 'medium'],
        [es ? 'Puntaje SEO técnico' : 'Technical SEO score', seoFinding, Number(seoScore) < 70 ? 'medium' : 'low'],
        [es ? 'Visibilidad ante IA' : 'AI discoverability score', aiFinding, 'low'],
    ];

    const th1 = es ? 'Qué revisamos' : 'What we checked';
    const th2 = es ? 'Hallazgo' : 'What we found';
    const th3 = es ? 'Prioridad' : 'Priority';

    let table = `| ${th1} | ${th2} | ${th3} |\n| --- | --- | --- |\n`;
    for (const [label, value, pri] of rows) {
        table += `| ${label} | ${value} | ${litePriorityLabel(pri, es)} |\n`;
    }

    const seoTakeaway = Number(seoScore) < 70
        ? (es
            ? `El SEO técnico está en **${seoScore}/100** — faltan piezas básicas (H1, Schema, alt en imágenes) que limitan cómo Google entiende y posiciona tu tienda.`
            : `Technical SEO is **${seoScore}/100** — basic building blocks (H1, Schema, image alt text) are missing, so Google has a harder time understanding and ranking your store.`)
        : (es
            ? `El SEO técnico está en **${seoScore}/100** — la base es aceptable, pero aún hay fugas de confianza y claridad que frenan la conversión.`
            : `Technical SEO is **${seoScore}/100** — the foundation is acceptable, but trust and clarity gaps still slow conversion.`);

    const aiTakeaway = Number(jsonLd) === 0
        ? (es
            ? `La visibilidad IA mide **${aiScore}/100**, pero sin Schema.org los motores de IA no pueden mostrar productos, precios ni reseñas con contexto — pierdes descubrimiento y credibilidad.`
            : `AI visibility scores **${aiScore}/100**, but without Schema.org, AI engines cannot surface products, prices, or reviews with context — you lose discoverability and credibility.`)
        : (es
            ? `Visibilidad IA **${aiScore}/100** — robots.txt${robots ? ` (${robots})` : ''} y llms.txt${llms ? ` (${llms})` : ''} influyen en si ChatGPT y buscadores pueden citar tu tienda con precisión.`
            : `AI visibility is **${aiScore}/100** — robots.txt${robots ? ` (${robots})` : ''} and llms.txt${llms ? ` (${llms})` : ''} affect whether ChatGPT and search engines can cite your store accurately.`);

  const titanTease = es
        ? '_Titán desglosa cada señal con recomendaciones paso a paso y benchmark vs tu categoría._'
        : '_Titan breaks down each signal with step-by-step fixes and a category benchmark._';

    return `${hdr}\n\n${table}\n${seoTakeaway}\n\n${aiTakeaway}\n\n${titanTease}`;
}

/** HTML bullets injected under page screenshots on Lite PDF page 2 */
function buildLitePageInsightsHtml(dossier, locale, captures = {}) {
    const es = locale?.code?.startsWith('es');
    const ui = getPdfUiStrings(locale);
    const title = ui.liteInsightsTitle || (es ? 'Lo que saltó a la vista' : 'What stood out immediately');

    const loadSec = captures.loadTimeSec ?? pickDossierValue(dossier, /TIEMPO_CARGA_SEG:\s*([\d.]+)/);
    const seoScore = captures.seoScore ?? pickDossierValue(dossier, /SEO_TECNICO_SCORE:\s*(\d+)/);
    const aiScore = captures.aiScore ?? pickDossierValue(dossier, /AI_DISCOVERABILITY_SCORE:\s*(\d+)/);
    const h1Count = Number(pickDossierValue(dossier, /H1_COUNT:\s*(\d+)/, '0'));
    const jsonLd = Number(pickDossierValue(dossier, /JSON_LD:\s*(\d+)/, '0'));
    const altPct = pickDossierValue(dossier, /IMAGENES_ALT_COVERAGE:\s*(\d+)/, '0');

    const bullets = [];
    if (h1Count === 0) {
        bullets.push(es
            ? '<strong>Sin H1 principal</strong> — un visitante nuevo no sabe en 3 segundos qué vendes.'
            : '<strong>No primary H1</strong> — a new visitor cannot tell what you sell within 3 seconds.');
    }
    if (jsonLd === 0) {
        bullets.push(es
            ? '<strong>Sin Schema.org</strong> — Google e IA no pueden mostrar productos con contexto (precio, reseñas).'
            : '<strong>No Schema.org</strong> — Google and AI cannot show products with context (price, reviews).');
    }
    if (loadSec && Number(loadSec) > 4) {
        bullets.push(es
            ? `<strong>Carga ${loadSec}s</strong> — por encima del umbral de 4s; alto riesgo de abandono en móvil.`
            : `<strong>Load ${loadSec}s</strong> — above the 4s threshold; high mobile bounce risk.`);
    }
    if (Number(altPct) < 50) {
        bullets.push(es
            ? `<strong>Alt en imágenes ${altPct}%</strong> — casi invisible en búsqueda de imágenes y peor accesibilidad.`
            : `<strong>Image alt coverage ${altPct}%</strong> — weak image search visibility and accessibility.`);
    }
    if (seoScore) {
        bullets.push(es
            ? `<strong>SEO técnico ${seoScore}/100</strong> — hay brechas estructurales antes de escalar ads.`
            : `<strong>Technical SEO ${seoScore}/100</strong> — structural gaps exist before scaling ads.`);
    }
    if (aiScore) {
        bullets.push(es
            ? `<strong>Visibilidad IA ${aiScore}/100</strong> — buena señal técnica, pero sin Schema el contexto de producto se pierde.`
            : `<strong>AI visibility ${aiScore}/100</strong> — solid technical signal, but without Schema product context is lost.`);
    }

    const top = bullets.slice(0, 4);
    if (!top.length) {
        top.push(es
            ? 'Revisamos HTML público, velocidad y señales de confianza — ver fugas detalladas abajo.'
            : 'We reviewed public HTML, speed, and trust signals — see detailed leaks below.');
    }

    const lis = top.map((b) => `<li>${b}</li>`).join('');
    return `<div class="pc-lite-insights"><p class="pc-lite-insights-title">${title}</p><ul>${lis}</ul></div>`;
}

/** Remove internal simulator IDs from client-facing Lite PDF copy */
function stripInternalEvidenceRefs(text) {
    return String(text || '')
        .replace(/\s*\(Evidence:\s*#[\d,\s#]+\)/gi, '')
        .replace(/\s*\(Evidencia:\s*#[\d,\s#]+\)/gi, '')
        .replace(/\s*\(evidence:\s*evaluation\s*#\d+\)/gi, '')
        .replace(/\s*\(evidencia:\s*evaluación\s*#\d+\)/gi, '')
        .replace(/\s*\(#\d+(?:,\s*#\d+)*\)/g, '')
        .replace(/\s+#\d+(?:,\s*#\d+)*\s*(?=[.);]|$)/g, '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/ \./g, '.')
        .trim();
}

function normalizeLiteSeoTable(text, locale) {
    const es = locale?.code?.startsWith('es');
    let out = text;
    out = out.replace(
        /\|\s*(?:Señal|Signal|SIGNAL)\s*\|\s*(?:Valor|Value|VALUE)\s*\|\s*(?:Riesgo|Risk|RISK)\s*\|/gi,
        es ? '| Qué revisamos | Hallazgo | Prioridad |' : '| What we checked | What we found | Priority |',
    );
    out = out.replace(/\b0\s+Blocks\b/gi, es ? 'No encontrado' : 'Not found');
    out = out.replace(/\b0\s+Found\b/gi, es ? 'No encontrado' : 'Not found');
    return out;
}

function forceLiteSectionHeader(etapaId, text, locale) {
    const headers = LITE_SECTION_HEADERS[etapaId];
    if (!headers) return text;
    const es = locale?.code?.startsWith('es');
    const canonical = es ? headers.es : headers.en;
    const body = String(text || '').replace(/^###[^\n]+\n+/, '').trim();
    return `${canonical}\n\n${body}`;
}

function sanitizeLiteSection(etapaId, text, locale) {
    let out = stripInternalEvidenceRefs(text);
    out = normalizeLiteSeoTable(out, locale);
    out = forceLiteSectionHeader(etapaId, out, locale);
    return out;
}

function postProcessSection(etapaId, text, locale, dossier = '', opts = {}) {
    let out = stripPlaceholderLeaks(text || '');
    const target = NUMBERED_SECTIONS[etapaId];

    if (opts.modo === 'DELTA') {
        if (etapaId === 'ACCIONES_NUEVAS') {
            const ivCount = countNumberedItems((opts.nuevasSection || '').replace(/^###[^\n]+\n?/, ''));
            const targetActions = ivCount > 0 ? ivCount : 2;
            out = normalizeNumberedList(out, { minItems: targetActions, targetItems: targetActions, mode: 'auto' });
        }
        return out;
    }

    if (etapaId === 'FUGAS' || etapaId === 'FUGAS_LITE') {
        const targetCount = etapaId === 'FUGAS_LITE' ? 3 : 15;
        if (hasPlaceholderLeaks(text) && dossier.includes('SIMULATION_RESULTS')) {
            const headerMatch = (text || '').match(/^(###[^\n]+)/);
            return buildFugasFromDossier(dossier, locale, {
                target: targetCount,
                header: headerMatch?.[1] || undefined,
            });
        }
        const cleaned = stripPlaceholderLeaks(out);
        out = normalizeNumberedList(cleaned, { minItems: Math.min(targetCount, 3), targetItems: targetCount, mode: 'fugas' });
        let after = countNumberedItems(out.replace(/^###[^\n]+\n?/, ''));
        if (after < targetCount - 1) {
            out = normalizeNumberedList(cleaned, { minItems: 2, targetItems: targetCount, mode: 'auto' });
            after = countNumberedItems(out.replace(/^###[^\n]+\n?/, ''));
        }
        if (after < targetCount && dossier.includes('SIMULATION_RESULTS')) {
            const hdr = locale?.code?.startsWith('es')
                ? LITE_SECTION_HEADERS.FUGAS_LITE.es
                : LITE_SECTION_HEADERS.FUGAS_LITE.en;
            out = buildFugasFromDossier(dossier, locale, { target: targetCount, header: hdr });
        }
        if (opts.modo === 'LITE' && etapaId === 'FUGAS_LITE') {
            out = sanitizeLiteSection(etapaId, out, locale);
        }
        return out;
    }

    if (target) {
        const mode = SECTION_EXTRACT_MODE[etapaId] || 'auto';
        const wishTarget = etapaId === 'WISHLIST' && opts.modo === 'LITE' ? 5 : target;
        out = normalizeNumberedList(out, { minItems: Math.min(wishTarget, 3), targetItems: wishTarget, mode });
        const after = countNumberedItems(out.replace(/^###[^\n]+\n?/, ''));
        if (after < wishTarget - 1) {
            out = normalizeNumberedList(out, { minItems: 2, targetItems: wishTarget, mode: 'auto' });
        }
    }

    if (opts.modo === 'LITE' && etapaId === 'SEO_IA_LITE') {
        return out;
    }

    if (opts.modo === 'LITE') {
        out = sanitizeLiteSection(etapaId, out, locale);
        if (etapaId === 'INTRO') {
            const es = locale?.code?.startsWith('es');
            const bodyOnly = out.replace(/^###[^\n]+\n?/, '').trim();
            if (bodyOnly.length < 80) {
                const fallback = es
                    ? 'Revisamos tu página pública como la vería un visitante nuevo. En las siguientes secciones verás las 3 fugas que más probablemente te están costando ventas hoy.'
                    : 'We reviewed your public page the way a first-time visitor would see it. The next sections show the 3 leaks most likely costing you sales today.';
                const hdr = es ? LITE_SECTION_HEADERS.INTRO.es : LITE_SECTION_HEADERS.INTRO.en;
                out = `${hdr}\n\n${fallback}`;
            }
        }
        if (etapaId === 'UPSELL') {
            const es = locale?.code?.startsWith('es');
            const bodyOnly = out.replace(/^###[^\n]+\n?/, '').trim();
            if (bodyOnly.length < 60) {
                const fallback = es
                    ? 'Estas 3 fugas son solo la punta del iceberg — quedan **12 más ocultas**. Titán entrega las **15 principales**, **15 recomendaciones paso a paso**, benchmark vs tu categoría y plan de 21 días.'
                    : 'These 3 leaks are only the tip — **12 more are still hidden**. Titan delivers all **15 main flaws**, **15 step-by-step fix recommendations**, a category benchmark, and a 21-day plan.';
                const hdr = es ? LITE_SECTION_HEADERS.UPSELL.es : LITE_SECTION_HEADERS.UPSELL.en;
                out = `${hdr}\n\n${fallback}`;
            }
        }
    }
    return out;
}

module.exports = {
    getLocaleFromDossier,
    getLanguageLockInstruction,
    countNumberedItems,
    normalizeNumberedList,
    detectMixedLanguage,
    getVisionPromptLabels,
    getPdfUiStrings,
    getReportEmailCopy,
    buildReportFilename,
    postProcessSection,
    NUMBERED_SECTIONS,
    LITE_SECTION_ORDER,
    buildLiteSeoAiSnapshot,
    buildLitePageInsightsHtml,
    PLACEHOLDER_RE,
    stripInternalEvidenceRefs,
    sanitizeLiteSection,
};
