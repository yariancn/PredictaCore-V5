/** Post-procesado y UI del PDF según idioma del activo */

const { resolveReportLocale, parseLocaleFromDossier } = require('./idioma');

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

/** Convierte viñetas en lista numerada 1..N (para FUGAS, ACCIONES, etc.) */
function normalizeNumberedList(text, { minItems = 1 } = {}) {
    if (!text || typeof text !== 'string') return text;

    const headerMatch = text.match(/^(###[^\n]+\n?)/);
    const header = headerMatch ? headerMatch[1] : '';
    const body = headerMatch ? text.slice(header.length) : text;

    const items = [];
    const prefix = [];

    for (const line of body.split('\n')) {
        const itemMatch = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.+)$/);
        if (itemMatch) {
            items.push(itemMatch[1].trim());
        } else if (items.length === 0 && line.trim()) {
            prefix.push(line);
        } else if (items.length === 0 && !line.trim()) {
            prefix.push(line);
        }
    }

    if (items.length < minItems) return text;

    const numbered = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    const prefixText = prefix.join('\n').trim();
    return prefixText ? `${header}${prefixText}\n\n${numbered}` : `${header}${numbered}`;
}

function detectMixedLanguage(text, locale) {
    if (!text || text.length < 80) return null;

    const esMarkers = (text.match(/\b(el|la|los|las|de|que|para|con|por|una|del|más|sitio|cliente|página|acción|fuga|visibilidad)\b/gi) || []).length;
    const enMarkers = (text.match(/\b(the|and|your|website|customer|should|however|action|leak|visibility|page)\b/gi) || []).length;

    if (locale.code.startsWith('es') && enMarkers >= 4 && enMarkers > esMarkers * 0.35) {
        return 'Mezcla inglés/español detectada — reescribe todo en español latinoamericano';
    }
    if (locale.code.startsWith('en') && esMarkers >= 6 && esMarkers > enMarkers * 0.5) {
        return 'Mixed Spanish/English detected — rewrite entirely in US English';
    }
    return null;
}

function getPdfUiStrings(locale) {
    if (locale.code.startsWith('es')) {
        return {
            coverTag: 'Reporte forense de conversión',
            coverTitle: 'Inteligencia Titán',
            confidential: 'Altamente confidencial',
            evidenceTitle: 'Evidencia visual forense',
            desktop: 'Escritorio',
            mobile: 'Móvil',
            assetDefault: 'Análisis del activo',
            liteTitle: 'Reporte Lite',
            liteCtaTitle: 'Activa el Reporte Titán',
            liteCtaBody: 'Auditoría forense completa de 11 secciones (USD $349). Tu correo y URL ya están listos:',
        };
    }
    return {
        coverTag: 'Forensic conversion report',
        coverTitle: 'Titan Intelligence',
        confidential: 'Highly confidential',
        evidenceTitle: 'Forensic visual evidence',
        desktop: 'Desktop',
        mobile: 'Mobile',
        assetDefault: 'Asset analysis',
        liteTitle: 'Lite Intelligence Report',
        liteCtaTitle: 'Upgrade to Titan Report',
        liteCtaBody: 'Full 11-section forensic audit (USD $349). Your email and URL are pre-filled:',
    };
}

function getReportEmailCopy(modo, locale, { titanUrl, portalUrl, social } = {}) {
    const es = locale.code.startsWith('es');
    if (modo === 'LITE') {
        const url = titanUrl || '';
        return {
            subject: es ? 'PredictaCore — Tu auditoría Lite' : 'PredictaCore — Your Lite audit',
            filename: 'PREDICTACORE_LITE.pdf',
            text: es
                ? `Tu auditoría Lite PredictaCore va adjunta.\n\nReporte Titán completo (11 secciones, USD $349):\n${url}`
                : `Your PredictaCore Lite audit is attached.\n\nFull Titan Report (11 sections, USD $349):\n${url}`,
            html: es ? `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#050505;color:#d1d5db;">
  <h1 style="color:#fff;font-size:18px;text-align:center;">Tu auditoría Lite va adjunta</h1>
  <p style="font-size:14px;line-height:1.6;">El procesamiento puede tardar hasta 60 minutos. Revisa spam si no llega pronto.</p>
  <p style="font-size:14px;line-height:1.6;">Incluye snapshot SEO + visibilidad IA. Activa el Reporte Titán completo (USD $349):</p>
  <p style="margin:24px 0;text-align:center;"><a href="${url}" style="background:#10b981;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">Activar Reporte Titán — $349</a></p>
  <p style="font-size:11px;color:#71717a;text-align:center;">PredictaCore · predictacore.ai</p></div>`
                : `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#050505;color:#d1d5db;">
  <h1 style="color:#fff;font-size:18px;text-align:center;">Your Lite audit is attached</h1>
  <p style="font-size:14px;line-height:1.6;">Processing can take up to 60 minutes. Check spam if you don't see this message soon.</p>
  <p style="font-size:14px;line-height:1.6;">Includes real SEO + AI visibility snapshot. Upgrade to the full Titan Report (USD $349):</p>
  <p style="margin:24px 0;text-align:center;"><a href="${url}" style="background:#10b981;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">Activate Titan Report — $349</a></p>
  <p style="font-size:11px;color:#71717a;text-align:center;">PredictaCore · predictacore.ai</p></div>`,
        };
    }
    if (modo === 'DELTA') {
        return {
            subject: es ? 'PredictaCore — Reporte mensual de seguimiento' : 'PredictaCore — Monthly monitoring report',
            filename: 'PREDICTACORE_MONITORING.pdf',
            text: es ? 'Tu reporte mensual de monitoreo PredictaCore va adjunto.' : 'Your monthly PredictaCore monitoring report is attached.',
            html: null,
        };
    }
    const subject = social
        ? (es ? 'PredictaCore — Reporte Titán (perfil social)' : 'PredictaCore — Titan Social Audit')
        : (es ? 'PredictaCore — Reporte Titán forense' : 'PredictaCore — Titan forensic report');
    const text = es
        ? (portalUrl
            ? `Tu Reporte Titán PredictaCore va adjunto.\n\nNota: la entrega puede tardar hasta 60 minutos.\n\nGestionar suscripción: ${portalUrl}`
            : 'Tu Reporte Titán PredictaCore va adjunto.\n\nNota: la entrega puede tardar hasta 60 minutos.')
        : (portalUrl
            ? `Your PredictaCore Titan report is attached.\n\nDelivery may take up to 60 minutes.\n\nManage subscription: ${portalUrl}`
            : 'Your PredictaCore Titan report is attached.\n\nDelivery may take up to 60 minutes.');
    return {
        subject,
        filename: social ? 'PREDICTACORE_TITAN_SOCIAL.pdf' : 'PREDICTACORE_TITAN.pdf',
        text,
        html: null,
    };
}

const NUMBERED_SECTIONS = {
    FUGAS: 15,
    ACCIONES: 15,
    WISHLIST: 10,
    FUGAS_LITE: 3,
    OMNI: 9,
};

function postProcessSection(etapaId, text, locale) {
    let out = text || '';
    const min = NUMBERED_SECTIONS[etapaId];
    if (min) out = normalizeNumberedList(out, { minItems: Math.min(min, 3) });
    return out;
}

module.exports = {
    getLocaleFromDossier,
    getLanguageLockInstruction,
    countNumberedItems,
    normalizeNumberedList,
    detectMixedLanguage,
    getPdfUiStrings,
    getReportEmailCopy,
    postProcessSection,
    NUMBERED_SECTIONS,
};
