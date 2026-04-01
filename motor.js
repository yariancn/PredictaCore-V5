// motor.js - BÚNKER 6.3: BIFURCACIÓN EXACTA (RESTAURADO)
const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        const isSocialMedia = url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com');

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', 
                '--single-process', '--disable-gpu', '--disable-blink-features=AutomationControlled'
            ]
        });
        
        const startTime = Date.now();
        const page = await browser.newPage();
        
        if (isSocialMedia) {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8' });
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });
        }
        
        let consoleErrors = [];
        page.on('pageerror', err => consoleErrors.push(err.message));

        await page.setViewport({ width: 1280, height: 900 });
        
        if (isSocialMedia) {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 4000)); 
            await page.evaluate(() => window.scrollBy(0, 800));
            await new Promise(r => setTimeout(r, 1500));
        } else {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        }
        
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await new Promise(r => setTimeout(r, 1000)); 
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            const metaDesc = document.querySelector('meta[name="description"]')?.content || "";
            const metaTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
            const imgs = Array.from(document.querySelectorAll('img')).map(img => `[Img: ${img.alt || 'Sin alt'}]`).join(' | ');
            const botones = Array.from(document.querySelectorAll('a, button')).map(b => b.innerText.trim()).filter(t => t.length > 2).join(' | ');
            return { titulo: metaTitle, descripcion: metaDesc, cuerpo: document.body.innerText.substring(0, 45000), interactores: botones, visual: imgs };
        });

        await browser.close();
        const fechaHoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const dossierTexto = `FECHA: ${fechaHoy} | TITULO: ${dataForense.titulo} | CTAS: ${dataForense.interactores} | IMAGENES: ${dataForense.visual} | TEXTO: ${dataForense.cuerpo}`;

        return { isUrl: true, texto: dossierTexto, desktopBase64, mobileBase64 };
    } catch (error) {
        if (browser) await browser.close();
        return { isUrl: false, texto: `ERROR_MOTOR: ${error.message}` };
    }
}
module.exports = { captureAndScrape };
