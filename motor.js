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
            // 1. Limpieza de elementos irrelevantes
            const scripts = document.querySelectorAll('script, style, noscript, iframe:not([src*="maps"])');
            scripts.forEach(s => s.remove());

            // 2. Detección de Canales de Cierre Directo (Objetivo Primario)
            const tieneWhatsApp = !!document.querySelector('a[href*="wa.me"], a[href*="whatsapp"], [class*="whatsapp"], [id*="whatsapp"]');
            const tieneMaps = !!document.querySelector('a[href*="maps.google"], a[href*="goo.gl/maps"], iframe[src*="google.com/maps"]');
            
            // 3. Escáner de Botones y CTAs (Identificación de Intenciones)
            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(texto => texto.length > 2 && texto.length < 50)
                .slice(0, 20);

            // 4. Extracción de Atributos de Imagen (Buscando Precios/Info en ALT)
            const imagenesDescritas = Array.from(document.querySelectorAll('img'))
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
                    imagenes: imagenesDescritas.join(' | ')
                }
            };
        });

        const fechaHoy = new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });

        await browser.close();

        return `
            FECHA_EJECUCION_REPORTE: ${fechaHoy}
            TITULO_SEO: ${dataForense.titulo}
            DESCRIPCION_SEO: ${dataForense.descripcion}
            EVIDENCIA_CIERRE: WhatsApp(${dataForense.evidencia.canales.whatsapp}), GoogleMaps(${dataForense.evidencia.canales.maps})
            BOTONES_ACCION_DETECTADOS: ${dataForense.evidencia.ctas}
            CONTENIDO_VISUAL_DESCRITO: ${dataForense.evidencia.imagenes}
            CONTENIDO_TEXTUAL_LITERAL: ${dataForense.cuerpo}
        `;
    } catch (error) {
        if (browser) await browser.close();
        return `ERROR_CRITICO_MOTOR: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
