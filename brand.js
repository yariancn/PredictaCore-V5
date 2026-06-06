/** PredictaCore shared brand assets (favicon matches nav lightning icon). */

function getFaviconHeadTags() {
    return `<link rel="icon" type="image/svg+xml" href="/static/favicon.svg">
    <link rel="shortcut icon" href="/static/favicon.svg">
    <link rel="apple-touch-icon" href="/static/favicon.svg">`;
}

module.exports = { getFaviconHeadTags };
