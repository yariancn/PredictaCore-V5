const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR TITÁN]: Iniciando disección forense en: ${url}`);
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--disable-gpu']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const dataForense = await page.evaluate(() => {
            // 1. Limpieza de ruidos técnicos
            const scripts = document.querySelectorAll('script, style, noscript, iframe:not([src*="maps"])');
            scripts.forEach(s => s.remove());

            // 2. Detección de Nodos de Cierre (WhatsApp y Mapas)
            const tieneWhatsApp = !!document.querySelector('a[href*="wa.me"], a[href*="whatsapp"], [class*="whatsapp"], [id*="whatsapp"]');
            const tieneMaps = !!document.querySelector('a[href*="maps.google"], a[href*="goo.gl/maps"], iframe[src*="google.com/maps"]');
            
            // 3. Extracción de Llamados a la Acción (Botones reales)
            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(texto => texto.length > 2 && texto.length < 50)
                .slice(0, 20);

            // 4. Extracción de textos en imágenes (Evita nombres de archivos basura)
            const descripcionesImagenes = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.title)
                .filter(alt => alt && alt.length > 5)
                .slice(0, 15);

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 40000),
                evidencia: {
                    canales: { whatsapp: tieneWhatsApp, maps: tieneMaps },
                    ctas: botones.join(' | '),
                    imagenes: descripcionesImagenes.join(' | ')
                }
            };
        });

        // Captura de fecha dinámica
        const fechaHoy = new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        await browser.close();

        return `
            FECHA_EJECUCION: ${fechaHoy}
            TITULO_SEO: ${dataForense.titulo}
            DESCRIPCION_SEO: ${dataForense.descripcion}
            CANALES_CIERRE: WhatsApp(${dataForense.evidencia.canales.whatsapp}), GoogleMaps(${dataForense.evidencia.canales.maps})
            ACCIONES_DISPONIBLES: ${dataForense.evidencia.ctas}
            CONTENIDO_EN_GRAFICOS: ${dataForense.evidencia.imagenes}
            TEXTO_LITERAL: ${dataForense.cuerpo}
        `;
    } catch (error) {
        if (browser) await browser.close();
        return `ERROR_MOTOR: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
