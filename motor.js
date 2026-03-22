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
            // 1. Limpieza de scripts
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());

            // 2. Escáner de Botones de Cierre (CTAs)
            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => ({ texto: b.innerText.trim(), link: b.href || '' }))
                .filter(b => b.texto.length > 2)
                .slice(0, 15);

            // 3. Detección de Canales Directos
            const tieneWhatsApp = !!document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
            const tieneMaps = !!document.querySelector('a[href*="maps.google"], a[href*="google.com/maps"]');
            
            // 4. Extracción de Atributos de Imagen (Buscando precios ocultos en ALT)
            const imagenes = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.title || "Imagen sin descripción técnica")
                .filter(alt => alt !== "Imagen sin descripción técnica")
                .slice(0, 10);

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 40000),
                evidencia: {
                    canales: { whatsapp: tieneWhatsApp, maps: tieneMaps },
                    botones: botones.map(b => b.texto).join(' | '),
                    imagenesMetadata: imagenes.join(' | ')
                }
            };
        });

        await browser.close();
        return `
            FECHA_AUDITORIA: 22 de marzo de 2026
            TITULO_SEO: ${dataForense.titulo}
            DESCRIPCION_SEO: ${dataForense.descripcion}
            EVIDENCIA_CIERRE: WhatsApp(${dataForense.evidencia.canales.whatsapp}), Maps(${dataForense.evidencia.canales.maps})
            ACCIONES_DETECTADAS: ${dataForense.evidencia.botones}
            METADATOS_IMAGENES: ${dataForense.evidencia.imagenesMetadata}
            CONTENIDO_LITERAL: ${dataForense.cuerpo}
        `;
    } catch (error) {
        if (browser) await browser.close();
        return `ERROR_CRITICO: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
