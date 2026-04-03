// motor.js - CAPTURA DE DATOS Y LENTITUD
const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        const startTime = Date.now();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);

        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });
        const text = await page.evaluate(() => document.body.innerText.substring(0, 40000));
        await browser.close();
        
        return { texto: `TIEMPO DE CARGA: ${loadTime}s. DOSSIER: ${text}`, desktopBase64 };
    } catch (e) { if(browser) await browser.close(); throw e; }
}
module.exports = { captureAndScrape };
