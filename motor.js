const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR TITÁN]: Iniciando disección de: ${url}`);
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
        await page.setViewport({ width: 1280, height: 800 });
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // 1. ABRIR MENÚS VISIBLES (HAMBURGUESAS)
        const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
        for (const sel of menuSelectors) {
            try {
                const btn = await page.$(sel);
                if (btn) {
                    await page.evaluate(b => b.click(), btn); // Clic seguro
                    await page.waitForTimeout(1500); // Esperar a que el menú se despliegue
                    break;
                }
            } catch(e) { } // Si falla un botón, intenta el siguiente
        }
        
        const textoExtraido = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            
            // 2. CAPTURAR IMÁGENES PARA ANÁLISIS DE TEXTURA
            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.src.split('/').pop())
                .filter(text => text.length > 2)
                .slice(0, 20); // Tomamos las primeras 20 imágenes
            
            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 45000),
                imagenes: imgs.join(' | ')
            };
        });

        await browser.close();
        console.log(`[MOTOR TITÁN]: Disección finalizada con éxito.`);
        
        // Enviamos todo empacado en un solo texto para la IA
        return `TÍTULO (SEO): ${textoExtraido.titulo}\nDESCRIPCIÓN (SEO): ${textoExtraido.descripcion}\nIMÁGENES DETECTADAS: ${textoExtraido.imagenes}\nCONTENIDO: ${textoExtraido.cuerpo}`;
        
    } catch (error) {
        console.error(`[FALLA DE MOTOR]: ${error.message}`);
        if (browser) await browser.close();
        return `ERROR CRÍTICO: Imposible extraer datos de ${url}.`;
    }
}

module.exports = { captureAndScrape };
