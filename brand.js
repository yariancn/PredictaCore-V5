/** PredictaCore shared brand assets (favicon matches nav lightning icon). */

const FAVICON_VERSION = '2';

function publicSiteUrl() {
    return (process.env.PUBLIC_BASE_URL || 'https://predictacore.ai').replace(/\/$/, '');
}

function mailDomain() {
    try {
        return new URL(publicSiteUrl()).hostname.replace(/^www\./, '');
    } catch {
        return 'predictacore.ai';
    }
}

/** Contact / support address shown in legal pages and error copy */
function getSupportEmail() {
    return process.env.SUPPORT_EMAIL || `audit@${mailDomain()}`;
}

/** Inbox for internal sale / ops alerts (not customer-facing). */
function getSalesNotifyEmail() {
    return process.env.SALES_NOTIFY_EMAIL || 'yarianc@yahoo.com';
}

/** Resend "from" header — must match a verified domain in Resend */
function getResendFrom() {
    if (process.env.RESEND_FROM) return process.env.RESEND_FROM;
    return `PredictaCore <audit@${mailDomain()}>`;
}

/** Neutral subscription cancellation disclosure (legal notice — not a marketing CTA). */
function getSubscriptionCancellationNotice(lang = 'en', monitoringUsd = 25, titanUsd = 199) {
    const support = getSupportEmail();
    const site = publicSiteUrl();
    if (lang === 'es' || String(lang).startsWith('es')) {
        return `El monitoreo mensual (USD $${monitoringUsd}/mes, desde el día 30) se renueva salvo cancelación. `
            + `Para solicitar la cancelación del monitoreo recurrente, escriba a <a href="mailto:${support}" class="text-emerald-500 hover:underline">${support}</a> `
            + `desde el correo de compra o use el portal de facturación Stripe enviado en su correo de confirmación de pago. `
            + `Debe cancelar al menos <strong>5 días hábiles</strong> antes de la renovación para evitar el siguiente cobro. `
            + `El Reporte Titán (USD $${titanUsd}) es venta final. Ver <a href="${site}/terms" class="text-emerald-500 hover:underline">Términos</a>.`;
    }
    return `Monthly monitoring (USD $${monitoringUsd}/mo, starting day 30) renews unless cancelled. `
        + `To request cancellation of recurring monitoring, email <a href="mailto:${support}" class="text-emerald-500 hover:underline">${support}</a> `
        + `from your purchase email or use the Stripe billing portal sent in your activation email. `
        + `Cancel at least <strong>5 business days</strong> before renewal to avoid the next charge. `
        + `The Titan Report (USD $${titanUsd}) is a final sale. See <a href="${site}/terms" class="text-emerald-500 hover:underline">Terms</a>.`;
}

function getSubscriptionCancellationPlain(lang = 'en', monitoringUsd = 25, titanUsd = 199) {
    const support = getSupportEmail();
    const site = publicSiteUrl();
    if (lang === 'es' || String(lang).startsWith('es')) {
        return `Monitoreo USD $${monitoringUsd}/mes se renueva salvo cancelación. Cancelación del monitoreo recurrente: ${support} o portal Stripe en correo de confirmación de pago. Mínimo 5 días hábiles antes de renovación. Reporte Titán (USD $${titanUsd}) venta final. ${site}/terms`;
    }
    return `Monitoring USD $${monitoringUsd}/mo renews unless cancelled. Recurring monitoring cancellation: ${support} or Stripe portal in payment confirmation email. At least 5 business days before renewal. Titan Report (USD $${titanUsd}) final sale. ${site}/terms`;
}

/** Inline HTML block for report / transactional emails (Resend). */
function getSubscriptionCancellationEmailHtml(lang = 'en', monitoringUsd = 25, titanUsd = 199, portalUrl = null) {
    const support = getSupportEmail();
    const site = publicSiteUrl();
    const es = lang === 'es' || String(lang).startsWith('es');
    const portalBlock = portalUrl
        ? (es
            ? `<br/>Portal de facturación: <a href="${portalUrl}" style="color:#10b981;text-decoration:underline;">gestionar suscripción</a>`
            : `<br/>Billing portal: <a href="${portalUrl}" style="color:#10b981;text-decoration:underline;">manage subscription</a>`)
        : '';
    if (es) {
        return `<p style="margin:20px 0 0 0;font-size:11px;color:#71717a;line-height:1.55;border-top:1px solid rgba(113,113,122,0.35);padding-top:16px;">`
            + `El monitoreo mensual (USD $${monitoringUsd}/mes) se renueva salvo cancelación. `
            + `Para solicitar la cancelación del monitoreo recurrente, escriba a `
            + `<a href="mailto:${support}" style="color:#10b981;text-decoration:underline;">${support}</a> `
            + `desde el correo de compra o use el portal de facturación Stripe.${portalBlock} `
            + `Debe cancelar al menos <strong>5 días hábiles</strong> antes de la renovación. `
            + `Reporte Titán (USD $${titanUsd}) venta final. `
            + `<a href="${site}/terms" style="color:#10b981;text-decoration:underline;">Términos</a>.</p>`;
    }
    return `<p style="margin:20px 0 0 0;font-size:11px;color:#71717a;line-height:1.55;border-top:1px solid rgba(113,113,122,0.35);padding-top:16px;">`
        + `Monthly monitoring (USD $${monitoringUsd}/mo) renews unless cancelled. `
        + `To request cancellation of recurring monitoring, email `
        + `<a href="mailto:${support}" style="color:#10b981;text-decoration:underline;">${support}</a> `
        + `from your purchase email or use the Stripe billing portal.${portalBlock} `
        + `Cancel at least <strong>5 business days</strong> before renewal. `
        + `Titan Report (USD $${titanUsd}) is a final sale. `
        + `<a href="${site}/terms" style="color:#10b981;text-decoration:underline;">Terms</a>.</p>`;
}

/** Deep link to Titan upsell page — email + URL prefilled, one-click checkout */
function buildTitanUpgradeUrl({ email, dna, lang = 'en' }) {
    const params = new URLSearchParams();
    if (email) params.set('email', String(email).trim().toLowerCase());
    if (dna) params.set('dna', String(dna).trim());
    if (lang === 'es') params.set('lang', 'es');
    return `${publicSiteUrl()}/titan?${params.toString()}`;
}

function getFaviconHeadTags() {
    const v = FAVICON_VERSION;
    return `<link rel="icon" href="/favicon.ico?v=${v}" sizes="any">
    <link rel="icon" type="image/png" href="/static/favicon-32.png?v=${v}" sizes="32x32">
    <link rel="icon" type="image/svg+xml" href="/static/favicon.svg?v=${v}">
    <link rel="apple-touch-icon" href="/static/apple-touch-icon.png?v=${v}">`;
}

/** Logo + wordmark block for dark email backgrounds (use inside wrapPredictaCoreEmail). */
function getEmailBrandHeaderBlock(lang = 'en') {
    const tagline = lang === 'es' ? 'Inteligencia de Negocios' : 'Business Intelligence';
    const logoUrl = `${publicSiteUrl()}/apple-touch-icon.png`;
    return `<div style="text-align:center;">
  <img src="${logoUrl}" width="56" height="56" alt="PredictaCore" style="display:inline-block;border-radius:50%;margin-bottom:14px;" />
  <div style="font-family:Inter,Arial,sans-serif;font-size:24px;font-weight:900;letter-spacing:-0.04em;line-height:1;color:#ffffff;text-transform:uppercase;">
    PREDICTA<span style="color:#10b981;">CORE</span>
  </div>
  <div style="font-family:Inter,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.32em;text-transform:uppercase;color:#71717a;margin-top:8px;">
    ${tagline}
  </div>
</div>`;
}

/** Full HTML email shell — dark card so wordmark is never on a white client canvas. */
function wrapPredictaCoreEmail(lang, bodyHtml, preheader = '') {
    const langAttr = lang === 'es' ? 'es' : 'en';
    const header = getEmailBrandHeaderBlock(lang);
    const preheaderBlock = preheader
        ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;font-size:1px;line-height:1px;">${preheader}</div>`
        : '';
    return `<!DOCTYPE html>
<html lang="${langAttr}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px 12px;background:#e4e4e7;font-family:Inter,Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  ${preheaderBlock}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#050505;border-radius:10px;border:1px solid #3f3f46;padding:0;">
        <div style="padding:24px 24px 16px;border-bottom:1px solid rgba(16,185,129,0.3);">
          ${header}
        </div>
        <div style="padding:24px;color:#d1d5db;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** @deprecated Prefer wrapPredictaCoreEmail — standalone header breaks on white inboxes (Yahoo, Gmail). */
function getEmailBrandHeader(lang = 'en') {
    return getEmailBrandHeaderBlock(lang);
}

/** Branded header for PDF cover (Lite / Titán) — logo PNG embebido para Puppeteer */
function getPdfCoverBrandHtml(lang = 'en') {
    const es = lang === 'es' || String(lang).startsWith('es');
    const tagline = es ? 'Inteligencia de Negocios' : 'Business Intelligence';
    const fs = require('fs');
    const path = require('path');
    let logoImg = '';
    try {
        const logoPath = path.join(__dirname, 'static', 'apple-touch-icon.png');
        if (fs.existsSync(logoPath)) {
            const b64 = fs.readFileSync(logoPath).toString('base64');
            logoImg = `<img src="data:image/png;base64,${b64}" width="52" height="52" alt="PredictaCore" class="pc-logo-img" />`;
        }
    } catch { /* fallback below */ }
    if (!logoImg) {
        logoImg = `<div class="pc-logo-circle">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#050505" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
  </div>`;
    }
    return `<div class="pc-brand-cover">
  <div class="pc-brand-mark">${logoImg}</div>
  <div class="pc-brand-text">
    <div class="pc-wordmark">PREDICTA<span class="pc-accent">CORE</span></div>
    <div class="pc-tagline">${tagline}</div>
  </div>
</div>`;
}

/** Cierre institucional al final del PDF Titán / Seguimiento */
function getPdfClosingHtml(lang = 'en', modo = 'TITAN') {
    const es = lang === 'es' || String(lang).startsWith('es');
    const support = getSupportEmail();
    const site = publicSiteUrl().replace(/^https?:\/\//, '');
    const isDelta = modo === 'DELTA';
    const lead = es
        ? (isDelta ? 'Fin del reporte de seguimiento PredictaCore' : 'Fin del reporte forense PredictaCore Titán')
        : (isDelta ? 'End of PredictaCore monitoring report' : 'End of PredictaCore Titan forensic report');
    const disclaimer = es
        ? 'Aviso legal: PredictaCore no garantiza resultados comerciales, de tráfico, posicionamiento ni ingresos. Las recomendaciones se basan únicamente en información pública disponible al momento del análisis (sitio web, metadatos, señales técnicas visibles) y pueden contener errores u omisiones. Los scores pueden variar entre mediciones sin que el sitio haya cambiado. Verifique cada hallazgo antes de implementar.'
        : 'Legal notice: PredictaCore does not guarantee business results, traffic, rankings, or revenue. Recommendations are based solely on publicly available information at the time of analysis (website, metadata, visible technical signals) and may contain errors or omissions. Scores may vary between measurements without site changes. Verify each finding before implementing.';
    const scope = es
        ? 'Este documento se elaboró exclusivamente a partir de datos públicos del activo analizado. PredictaCore no accede a analytics internos, paneles de administración ni información privada del negocio. La implementación de las recomendaciones queda a criterio del titular del activo.'
        : 'This document was prepared exclusively from publicly available data on the analyzed asset. PredictaCore does not access internal analytics, admin panels, or private business data. Implementation of recommendations remains at the asset owner\'s discretion.';
    return `<div class="pc-report-closing">
  <div class="pc-closing-rule"></div>
  <p class="pc-closing-lead">${lead}</p>
  <p class="pc-disclaimer"><strong>${es ? 'Descargo de responsabilidad' : 'Disclaimer'}:</strong> ${disclaimer}</p>
  <p>${scope}</p>
  <p class="pc-closing-meta">PredictaCore · ${site} · ${support}</p>
</div>`;
}

/** Aviso breve bajo el encabezado del PDF */
function getPdfHeaderDisclaimerHtml(lang = 'en') {
    const es = lang === 'es' || String(lang).startsWith('es');
    const text = es
        ? 'Análisis basado en información pública. No garantizamos resultados. Puede contener errores — verifique antes de actuar.'
        : 'Analysis based on public information. No results guaranteed. May contain errors — verify before acting.';
    return `<p class="pc-header-disclaimer">${text}</p>`;
}

function getPdfCoverMetricsHtml({ loadTimeSec, seoScore, aiScore, assetType, lang = 'es' }) {
    const load = loadTimeSec != null ? `${loadTimeSec}s` : '—';
    const seo = seoScore != null ? `${seoScore}/100` : '—';
    const ai = aiScore != null ? `${aiScore}/100` : '—';
    const es = lang === 'es' || String(lang).startsWith('es');
    const label = assetType === 'social'
        ? (es ? 'Perfil social' : 'Social profile')
        : (es ? 'Sitio web' : 'Website');
    const kActivo = es ? 'Activo' : 'Asset';
    const kCarga = es ? 'Carga' : 'Load';
    const kSeo = 'SEO';
    const kIa = es ? 'Visibilidad IA' : 'AI visibility';
    return `<div class="pc-metrics">
  <div class="pc-metric"><span class="pc-metric-k">${kActivo}</span><span class="pc-metric-v">${label}</span></div>
  <div class="pc-metric"><span class="pc-metric-k">${kCarga}</span><span class="pc-metric-v">${load}</span></div>
  <div class="pc-metric"><span class="pc-metric-k">${kSeo}</span><span class="pc-metric-v">${seo}</span></div>
  <div class="pc-metric"><span class="pc-metric-k">${kIa}</span><span class="pc-metric-v">${ai}</span></div>
</div>`;
}

/** Shared CSS for PDF brand blocks */
function getPdfBrandStyles() {
    return `.pc-brand-cover { display: flex; align-items: center; gap: 14px; margin: 0 0 28px 0; page-break-inside: avoid; }
.pc-brand-mark { flex-shrink: 0; line-height: 0; }
.pc-brand-text { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.pc-logo-img { width: 52px; height: 52px; border-radius: 50%; display: block; object-fit: cover; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pc-logo-circle { width: 52px; height: 52px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.pc-wordmark { font-size: 1.65rem; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; color: #0f172a; line-height: 1.05; }
.pc-accent { color: #10b981; }
.pc-tagline { font-size: 7.5pt; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: #64748b; margin-top: 4px; }
.pc-metrics { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 8px 0; page-break-inside: avoid; }
.pc-metric { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; min-width: 100px; background: #f8fafc; }
.pc-metric-k { display: block; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; }
.pc-metric-v { display: block; font-size: 11pt; font-weight: 800; color: #0f172a; margin-top: 2px; }
.pc-report-closing { margin-top: 28px; padding-top: 18px; page-break-inside: avoid; color: #475569; font-size: 9pt; line-height: 1.55; }
.pc-closing-rule { width: 72px; height: 4px; background: #10b981; margin-bottom: 14px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pc-closing-lead { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 0 0 10px 0; }
.pc-report-closing p { margin: 0 0 10px 0; color: #475569 !important; text-align: left; }
.pc-closing-meta { font-size: 8pt !important; font-weight: 700; letter-spacing: 0.06em; color: #64748b !important; margin-top: 14px !important; }
.pc-disclaimer { font-size: 8.5pt !important; background: #f8fafc; border-left: 3px solid #f59e0b; padding: 8px 10px; margin: 0 0 10px 0 !important; }
.pc-header-disclaimer { font-size: 7.5pt; color: #64748b; line-height: 1.4; margin: 8px 0 0 0; padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
.forensic-evidence { page-break-inside: avoid; margin: 0 0 24px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
.forensic-evidence h3 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.15em; color: #0f172a; margin: 0 0 12px 0; border: none; }
.forensic-shots { display: flex; gap: 12px; flex-wrap: wrap; }
.forensic-shots figure { margin: 0; flex: 1; min-width: 200px; }
.forensic-shots img { width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
.forensic-shots figcaption { font-size: 7pt; text-transform: uppercase; color: #64748b; margin-top: 4px; text-align: center; }`;
}

module.exports = {
    getFaviconHeadTags,
    getEmailBrandHeader,
    getEmailBrandHeaderBlock,
    wrapPredictaCoreEmail,
    getPdfCoverBrandHtml,
    getPdfCoverMetricsHtml,
    getPdfClosingHtml,
    getPdfHeaderDisclaimerHtml,
    getPdfBrandStyles,
    FAVICON_VERSION,
    publicSiteUrl,
    getSupportEmail,
    getSalesNotifyEmail,
    getResendFrom,
    getSubscriptionCancellationNotice,
    getSubscriptionCancellationPlain,
    getSubscriptionCancellationEmailHtml,
    buildTitanUpgradeUrl,
};
