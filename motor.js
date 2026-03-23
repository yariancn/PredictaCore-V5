const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR]: Iniciando análisis en: ${url}`);
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--single-process', 
                '--disable-gpu',
                '--no-zygote'
            ]
        });
        const page = await browser.newPage();
        
        // Intercepción selectiva para acelerar la carga sin perder metadata
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const blacklist = ['google-analytics', 'facebook', 'hotjar', 'pixel', 'ads'];
            if (blacklist.some(script => req.url().includes(script)) || ['font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setViewport({ width: 1280, height: 1600 });
        
        // Carga el contenido esencial
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

        // Scroll rápido para activar contenido dinámico
        await page.evaluate(async () => {
            window.scrollBy(0, window.innerHeight);
            await new Promise(r => setTimeout(r, 1000));
            window.scrollTo(0, 0);
        });

        const data = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => `[Imagen: ${img.alt || img.title || 'Sin descripción'}]`)
                .join(' | ');

            const buttons = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(t => t.length > 2)
                .join(' | ');

            return {
                titulo: document.title,
                cuerpo: document.body.innerText.substring(0, 50000),
                imagenes: imgs,
                interactores: buttons
            };
        });

        await browser.close();
        
        const fechaHoy = new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        return `
            FECHA_EJECUCION: ${fechaHoy}
            TITULO_SEO: ${data.titulo}
            PUNTOS_INTERACCION: ${data.interactores}
            CONTENIDO_VISUAL: ${data.imagenes}
            TEXTO_LITERAL: ${data.cuerpo}
        `;
    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}

// EXPORTACIÓN DIRECTA: Esto corrige el error "is not a function"
module.exports = captureAndScrape;
