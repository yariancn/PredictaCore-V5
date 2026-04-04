const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        const isSocialMedia = url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com');

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        if (isSocialMedia) {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8' });
        }

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Clic en menú hamburguesa (izquierdo o superior)
        const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
        for (const sel of menuSelectors) {
            const btn = await page.$(sel);
            if (btn) {
                await btn.click();
                await page.waitForTimeout(2000);
                break;
            }
        }

        // Scroll y extracción
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1500);

        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 60000),
                interactores: Array.from(document.querySelectorAll('a, button')).map(b => b.innerText.trim()).filter(t => t.length > 2).join(' | '),
                visual: Array.from(document.querySelectorAll('img')).map(img => `[Img: ${img.alt || 'Sin alt'}]`).join(' | ')
            };
        });

        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.waitForTimeout(1000);
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

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
