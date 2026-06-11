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

/** Resend "from" header — must match a verified domain in Resend */
function getResendFrom() {
    if (process.env.RESEND_FROM) return process.env.RESEND_FROM;
    return `PredictaCore <audit@${mailDomain()}>`;
}

/** Deep link to landing upsell with email + URL prefilled for Titan checkout */
function buildTitanUpgradeUrl({ email, dna, lang = 'en' }) {
    const params = new URLSearchParams();
    if (email) params.set('email', String(email).trim().toLowerCase());
    if (dna) params.set('dna', String(dna).trim());
    if (lang === 'es') params.set('lang', 'es');
    params.set('titan', '1');
    return `${publicSiteUrl()}/?${params.toString()}#terminal-section`;
}

function getFaviconHeadTags() {
    const v = FAVICON_VERSION;
    return `<link rel="icon" href="/favicon.ico?v=${v}" sizes="any">
    <link rel="icon" type="image/png" href="/static/favicon-32.png?v=${v}" sizes="32x32">
    <link rel="icon" type="image/svg+xml" href="/static/favicon.svg?v=${v}">
    <link rel="apple-touch-icon" href="/static/apple-touch-icon.png?v=${v}">`;
}

/** Branded header for transactional emails (Resend). Uses hosted logo + wordmark. */
function getEmailBrandHeader(lang = 'en') {
    const tagline = lang === 'es' ? 'Business Intelligence' : 'Business Intelligence';
    const logoUrl = `${publicSiteUrl()}/apple-touch-icon.png`;
    return `<div style="text-align:center;margin:0 0 28px 0;padding-bottom:24px;border-bottom:1px solid rgba(16,185,129,0.25);">
  <img src="${logoUrl}" width="56" height="56" alt="PredictaCore" style="display:inline-block;border-radius:50%;margin-bottom:14px;" />
  <div style="font-family:Inter,Arial,sans-serif;font-size:24px;font-weight:900;letter-spacing:-0.04em;line-height:1;color:#ffffff;text-transform:uppercase;">
    PREDICTA<span style="color:#10b981;">CORE</span>
  </div>
  <div style="font-family:Inter,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.32em;text-transform:uppercase;color:#71717a;margin-top:8px;">
    ${tagline}
  </div>
</div>`;
}

/** Branded header for PDF cover (Lite / Titán) — logo PNG embebido para Puppeteer */
function getPdfCoverBrandHtml() {
    const fs = require('fs');
    const path = require('path');
    let logoImg = '';
    try {
        const logoPath = path.join(__dirname, 'static', 'apple-touch-icon.png');
        if (fs.existsSync(logoPath)) {
            const b64 = fs.readFileSync(logoPath).toString('base64');
            logoImg = `<img src="data:image/png;base64,${b64}" width="56" height="56" alt="PredictaCore" class="pc-logo-img" />`;
        }
    } catch { /* fallback below */ }
    if (!logoImg) {
        logoImg = `<div class="pc-logo-circle">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#050505" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
  </div>`;
    }
    return `<div class="pc-brand-cover">
  ${logoImg}
  <div class="pc-wordmark">PREDICTA<span class="pc-accent">CORE</span></div>
  <div class="pc-tagline">Business Intelligence</div>
</div>`;
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
    return `.pc-brand-cover { margin-bottom: 18px; }
.pc-logo-img { width: 56px; height: 56px; border-radius: 50%; margin-bottom: 12px; display: block; object-fit: cover; -webkit-print-color-adjust: exact; }
.pc-logo-circle { width: 52px; height: 52px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.pc-wordmark { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; color: #0f172a; line-height: 1; }
.pc-accent { color: #10b981; }
.pc-tagline { font-size: 8pt; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: #64748b; margin-top: 6px; }
.pc-metrics { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 8px 0; page-break-inside: avoid; }
.pc-metric { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; min-width: 100px; background: #f8fafc; }
.pc-metric-k { display: block; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; }
.pc-metric-v { display: block; font-size: 11pt; font-weight: 800; color: #0f172a; margin-top: 2px; }
.forensic-evidence { page-break-inside: avoid; margin: 0 0 24px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
.forensic-evidence h3 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.15em; color: #0f172a; margin: 0 0 12px 0; border: none; }
.forensic-shots { display: flex; gap: 12px; flex-wrap: wrap; }
.forensic-shots figure { margin: 0; flex: 1; min-width: 200px; }
.forensic-shots img { width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; }
.forensic-shots figcaption { font-size: 7pt; text-transform: uppercase; color: #64748b; margin-top: 4px; text-align: center; }`;
}

module.exports = {
    getFaviconHeadTags,
    getEmailBrandHeader,
    getPdfCoverBrandHtml,
    getPdfCoverMetricsHtml,
    getPdfBrandStyles,
    FAVICON_VERSION,
    publicSiteUrl,
    getSupportEmail,
    getResendFrom,
    buildTitanUpgradeUrl,
};
