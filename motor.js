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

            // 2. Extracción de Puntos de Interacción (CTAs)
            // Identifica CUALQUIER elemento de acción para que el cerebro decida su función
            const interactores = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]'))
                .map(el => ({
                    texto: el.innerText.trim() || el.value || "Elemento sin etiqueta",
                    destino: el.href || "Acción de sistema",
                    posicion: el.getBoundingClientRect().top
                }))
                .filter(el => el.texto.length > 2)
                .slice(0, 30);

            // 3. Captura de Metadatos de Imagen (Buscando info comercial oculta)
            const graficos = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.title)
                .filter(alt => alt && alt.length > 5)
                .slice(0, 15);

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 48000), // Expandido a 48k para mayor profundidad
                puntosDeAccion: interactores.map(i => `[${i.texto} en pos ${Math.round(i.posicion)}px -> ${i.destino}]`).join(' | '),
                descripcionesGraficas: graficos.join(' | ')
            };
        });

        const fechaHoy = new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        await browser.close();

        return `
            FECHA_AUDITORIA: ${fechaHoy}
            TITULO_SEO: ${dataForense.titulo}
            DESCRIPCION_SEO: ${dataForense.descripcion}
            MAPA_DE_INTERACCION: ${dataForense.puntosDeAccion}
            EVIDENCIA_EN_GRAFICOS: ${dataForense.descripcionesGraficas}
            TEXTO_LITERAL_EXTRAIDO: ${dataForense.cuerpo}
        `;
    } catch (error) {
        if (browser) await browser.close();
        return `ERROR_MOTOR_CRITICO: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
