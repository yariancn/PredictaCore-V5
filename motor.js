const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
        });
        const page = await browser.newPage();
        
        // --- MANIOBRA QUIRÚRGICA: BLOQUEO DE RUIDO ---
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const basura = ['google-analytics', 'facebook', 'hotjar', 'pixel', 'ads', 'doubleclick'];
            if (basura.some(s => req.url().includes(s)) || ['font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setViewport({ width: 1280, height: 1600 });
        
        // Carga y espera dinámica
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 4000)); // 4s para que carguen precios dinámicos

        // --- MANIOBRA DE REVELACIÓN: SCROLL ---
        await page.evaluate(async () => {
            window.scrollBy(0, window.innerHeight);
            await new Promise(r => setTimeout(r, 800));
            window.scrollTo(0, 0);
        });

        const data = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript');
            scripts.forEach(s => s.remove());

            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => `[Imagen: ${img.alt || img.title || 'Sin etiqueta'}]`)
                .join(' | ');

            const btns = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(t => t.length > 2)
                .join(' | ');

            return {
                titulo: document.title,
                cuerpo: document.body.innerText.substring(0, 50000),
                graficos: imgs,
                acciones: btns
            };
        });

        await browser.close();
        const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        return `FECHA: ${fecha} | TITULO: ${data.titulo} | CTAS: ${data.acciones} | IMAGENES: ${data.graficos} | TEXTO: ${data.cuerpo}`;
    } catch (error) {
        if (browser) await browser.close();
        return `FALLO_FORENSE: ${error.message}`;
    }
}

module.exports = captureAndScrape;
