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

module.exports = {
    getFaviconHeadTags,
    FAVICON_VERSION,
    publicSiteUrl,
    buildTitanUpgradeUrl,
};
