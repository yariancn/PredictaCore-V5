/** PredictaCore shared brand assets (favicon matches nav lightning icon). */

const FAVICON_VERSION = '2';

function publicSiteUrl() {
    return (process.env.PUBLIC_BASE_URL || 'https://predictacore.ai').replace(/\/$/, '');
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

module.exports = {
    getFaviconHeadTags,
    getEmailBrandHeader,
    FAVICON_VERSION,
    publicSiteUrl,
    buildTitanUpgradeUrl,
};
