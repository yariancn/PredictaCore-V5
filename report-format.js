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
            coverTag: 'Reporte forense de conversión',
            coverTitle: 'Inteligencia Titán',
            evidenceTitle: 'Evidencia visual forense',
            desktop: 'Escritorio',
            mobile: 'Móvil',
            assetDefault: 'Análisis del activo',
            liteTitle: 'Reporte Lite',
            liteCtaTitle: 'Activa el Reporte Titán',
            liteCtaBody: `Auditoría forense completa de 11 secciones (USD $${TITAN_PRICE_USD}, precio introductorio). Tu correo y URL ya están listos:`,
            brandTagline: 'Inteligencia de Negocios',
        };
    }
    return {
        coverTag: 'Forensic conversion report',
        coverTitle: 'Titan Intelligence',
        evidenceTitle: 'Forensic visual evidence',
        desktop: 'Desktop',
        mobile: 'Mobile',
        assetDefault: 'Asset analysis',
        liteTitle: 'Lite Intelligence Report',
        liteCtaTitle: 'Upgrade to Titan Report',
        liteCtaBody: `Full 11-section forensic audit (USD $${TITAN_PRICE_USD} introductory price). Your email and URL are pre-filled:`,
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

function buildReportDeliveryEmailHtml(lang, { title, intro, portalUrl }) {
    const cancelHtml = getSubscriptionCancellationEmailHtml(
        lang,
        MONITORING_PRICE_USD,
        TITAN_PRICE_USD,
        portalUrl,
    );
    return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#050505;color:#d1d5db;">
  <h1 style="color:#fff;font-size:18px;text-align:center;margin:0 0 16px 0;">${title}</h1>
  <p style="font-size:14px;line-height:1.6;margin:0 0 12px 0;">${intro}</p>
  ${cancelHtml}
  <p style="font-size:11px;color:#71717a;text-align:center;margin-top:20px;">PredictaCore · predictacore.ai</p>
</div>`;
}

function getReportEmailCopy(modo, locale, { titanUrl, portalUrl, social, targetUrl } = {}) {
    const es = locale.code.startsWith('es');
    if (modo === 'LITE') {
        const url = titanUrl || '';
        return {
            subject: es ? 'PredictaCore — Tu auditoría Lite' : 'PredictaCore — Your Lite audit',
            filename: buildReportFilename('LITE', targetUrl),
            text: es
                ? `Tu auditoría Lite PredictaCore va adjunta.\n\nReporte Titán completo (11 secciones, USD $${TITAN_PRICE_USD}):\n${url}`
                : `Your PredictaCore Lite audit is attached.\n\nFull Titan Report (11 sections, USD $${TITAN_PRICE_USD}):\n${url}`,
            html: es ? `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#050505;color:#d1d5db;">
  <h1 style="color:#fff;font-size:18px;text-align:center;">Tu auditoría Lite va adjunta</h1>
  <p style="font-size:14px;line-height:1.6;">El procesamiento puede tardar hasta 60 minutos. Revisa spam si no llega pronto.</p>
  <p style="font-size:14px;line-height:1.6;">Incluye snapshot SEO + visibilidad IA. Activa el Reporte Titán completo (USD $${TITAN_PRICE_USD}):</p>
  <p style="margin:24px 0;text-align:center;"><a href="${url}" style="background:#10b981;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">Activar Reporte Titán — $${TITAN_PRICE_USD}</a></p>
  <p style="font-size:11px;color:#71717a;text-align:center;">PredictaCore · predictacore.ai</p></div>`
                : `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#050505;color:#d1d5db;">
  <h1 style="color:#fff;font-size:18px;text-align:center;">Your Lite audit is attached</h1>
  <p style="font-size:14px;line-height:1.6;">Processing can take up to 60 minutes. Check spam if you don't see this message soon.</p>
  <p style="font-size:14px;line-height:1.6;">Includes real SEO + AI visibility snapshot. Upgrade to the full Titan Report (USD $${TITAN_PRICE_USD}):</p>
  <p style="margin:24px 0;text-align:center;"><a href="${url}" style="background:#10b981;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">Activate Titan Report — $${TITAN_PRICE_USD}</a></p>
  <p style="font-size:11px;color:#71717a;text-align:center;">PredictaCore · predictacore.ai</p></div>`,
        };
    }
    if (modo === 'DELTA') {
        const lang = es ? 'es' : 'en';
        const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
        const portalLine = portalUrl ? (es ? `\nPortal: ${portalUrl}` : `\nPortal: ${portalUrl}`) : '';
        const intro = es
            ? 'Tu reporte mensual de monitoreo PredictaCore va adjunto.'
            : 'Your monthly PredictaCore monitoring report is attached.';
        return {
            subject: es ? 'PredictaCore — Reporte mensual de seguimiento' : 'PredictaCore — Monthly monitoring report',
            filename: buildReportFilename('DELTA', targetUrl),
            text: `${intro}\n\n${cancelPlain}${portalLine}`,
            html: buildReportDeliveryEmailHtml(lang, { title: intro, intro, portalUrl }),
        };
    }
    const subject = social
        ? (es ? 'PredictaCore — Reporte Titán (perfil social)' : 'PredictaCore — Titan Social Audit')
        : (es ? 'PredictaCore — Reporte Titán forense' : 'PredictaCore — Titan forensic report');
    const lang = es ? 'es' : 'en';
    const cancelPlain = getSubscriptionCancellationPlain(lang, MONITORING_PRICE_USD, TITAN_PRICE_USD);
    const intro = es
        ? 'Tu Reporte Titán PredictaCore va adjunto. La entrega puede tardar hasta 60 minutos; revisa spam si no lo ves pronto.'
        : 'Your PredictaCore Titan report is attached. Delivery may take up to 60 minutes; check spam if you do not see it soon.';
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
    WISHLIST: 10,
    FUGAS_LITE: 3,
    OMNI: 9,
};

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
        const after = countNumberedItems(out.replace(/^###[^\n]+\n?/, ''));
        if (after < targetCount - 1) {
            out = normalizeNumberedList(cleaned, { minItems: 2, targetItems: targetCount, mode: 'auto' });
        }
        return out;
    }

    if (target) {
        const mode = SECTION_EXTRACT_MODE[etapaId] || 'auto';
        out = normalizeNumberedList(out, { minItems: Math.min(target, 3), targetItems: target, mode });
        const after = countNumberedItems(out.replace(/^###[^\n]+\n?/, ''));
        if (after < target - 1) {
            out = normalizeNumberedList(out, { minItems: 2, targetItems: target, mode: 'auto' });
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
    PLACEHOLDER_RE,
};
