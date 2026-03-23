const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        });
        const page = await browser.newPage();
        
        // --- MANIOBRA 1: EL FRANCOTIRADOR ---
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const listaNegra = ['google-analytics', 'facebook', 'hotjar', 'pixel', 'ads'];
            if (listaNegra.some(script => req.url().includes(script)) || req.resourceType() === 'media') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setViewport({ width: 1280, height: 1600 });
        
        // --- MANIOBRA 2: CARGA Y ESPERA INTELIGENTE ---
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Espera manual de 5 segundos para que los scripts de precios/imágenes carguen
        await new Promise(r => setTimeout(r, 5000));

        // --- MANIOBRA 3: SCROLL PARA ACTIVAR LAZY LOADING ---
        await page.evaluate(async () => {
            window.scrollBy(0, window.innerHeight);
            await new Promise(r => setTimeout(r, 1000));
            window.scrollTo(0, 0);
        });

        const dataForense = await page.evaluate(() => {
            // Extraemos TODO lo visual y textual
            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => `[Imagen: ${img.alt || img.title || 'Sin descripción'}]`)
                .join(' | ');

            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(t => t.length > 2)
                .join(' | ');

            return {
                titulo: document.title,
                cuerpo: document.body.innerText.substring(0, 50000), // Mantenemos los 50k
                imagenes: imgs,
                interactores: botones
            };
        });

        await browser.close();
        return `CONTENIDO_VISUAL: ${dataForense.imagenes} | TEXTO: ${dataForense.cuerpo}`;

    } catch (error) {
        if (browser) await browser.close();
        return `FALLO_FORENSE: ${error.message}`;
    }
}
