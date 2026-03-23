const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR TITÁN]: Iniciando disección forense en: ${url}`);
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
        
        // Bloqueamos recursos pesados (imágenes/fuentes) para que no consuman RAM, solo leemos el código
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setViewport({ width: 1280, height: 900 });
        
        // Ajuste de espera: 'domcontentloaded' es el punto dulce entre velocidad y datos
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe:not([src*="maps"])');
            scripts.forEach(s => s.remove());

            // Identificación de Puntos de Interacción
            const interactores = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]'))
                .map(el => ({
                    texto: el.innerText.trim() || el.value || "Elemento sin etiqueta",
                    destino: el.href || "Acción de sistema",
                    posicion: el.getBoundingClientRect().top
                }))
                .filter(el => el.texto.length > 2)
                .slice(0, 25);

            const graficos = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.title)
                .filter(alt => alt && alt.length > 5)
                .slice(0, 15);

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 40000), // 40k para estabilidad en Railway
                puntosDeAccion: interactores.map(i => `[${i.texto} en pos ${Math.round(i.posicion)}px -> ${i.destino}]`).join(' | '),
                descripcionesGraficas: graficos.join(' | ')
            };
        });

        const fechaHoy = new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        await browser.close();

        return `
            FECHA_EJECUCION_REPORTE: ${fechaHoy}
            TITULO_SEO: ${dataForense.titulo}
            DESCRIPCION_SEO: ${dataForense.descripcion}
            PUNTOS_INTERACCION_DETECTADOS: ${dataForense.interactores}
            CONTENIDO_DENTRO_DE_IMAGENES: ${dataForense.graficos}
            CONTENIDO_LITERAL_TEXTUAL: ${dataForense.cuerpo}
        `;
    } catch (error) {
        if (browser) {
            const pages = await browser.pages();
            await Promise.all(pages.map(p => p.close()));
            await browser.close();
        }
        return `ERROR_MOTOR_STABILITY: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
