/** PredictaCore shared brand assets (favicon matches nav lightning icon). */

const FAVICON_VERSION = '2';

function getFaviconHeadTags() {
    const v = FAVICON_VERSION;
    return `<link rel="icon" href="/favicon.ico?v=${v}" sizes="any">
    <link rel="icon" type="image/png" href="/static/favicon-32.png?v=${v}" sizes="32x32">
    <link rel="icon" type="image/svg+xml" href="/static/favicon.svg?v=${v}">
    <link rel="apple-touch-icon" href="/static/apple-touch-icon.png?v=${v}">`;
}

module.exports = { getFaviconHeadTags, FAVICON_VERSION };
