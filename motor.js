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

            // 2. Identificación de Puntos de Interacción (CTAs)
            // Extrae texto y contexto de cualquier elemento con el que se pueda interactuar
            const interactores = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]'))
                .map(el => ({
                    texto: el.innerText.trim() || el.value || "Botón sin texto",
                    destino: el.href || "Acción interna",
                    esVisible: el.offsetParent !== null
                }))
                .filter(el => el.texto.length > 2 && el.esVisible)
                .slice(0, 25);

            // 3. Extracción de Metadatos Visuales (Buscando información en imágenes)
            const contenidoGrafico = Array.from(document.querySelectorAll('img'))
                .map(img => img.alt || img.title)
                .filter(texto => texto && texto.length > 4)
                .slice(0, 15);

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 40000),
                interactores: interactores.map(i => `[${i.texto} -> ${i.destino}]`).join(' | '),
                graficos: contenidoGrafico.join(' | ')
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
        if (browser) await browser.close();
        return `ERROR_MOTOR: ${error.message}`;
    }
}

module.exports = { captureAndScrape };
