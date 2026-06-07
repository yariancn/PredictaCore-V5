/**
 * Generate PNG favicons from static/favicon.svg (run locally: node scripts/generate-favicon.js)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'static', 'favicon.svg');

async function renderPng(size, outPath) {
    const svg = fs.readFileSync(SVG_PATH, 'utf8');
    const b64 = Buffer.from(svg).toString('base64');
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">
<img src="data:image/svg+xml;base64,${b64}" width="${size}" height="${size}" style="display:block;">
</body></html>`;

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({
        path: outPath,
        type: 'png',
        clip: { x: 0, y: 0, width: size, height: size },
        omitBackground: false,
    });
    await browser.close();
    console.log('Wrote', outPath);
}

async function main() {
    await renderPng(32, path.join(ROOT, 'static', 'favicon-32.png'));
    await renderPng(180, path.join(ROOT, 'static', 'apple-touch-icon.png'));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
