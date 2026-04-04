const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Barrido profundo: clic en menú hamburguesa
        const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="menú"]', '.hamburger', 'nav button', '[data-testid*="menu"]', '.menu-toggle'];
        for (const selector of menuSelectors) {
            try {
                const btn = await page.$(selector);
                if (btn) {
                    await btn.click();
                    await page.waitForTimeout(1500);
                    break;
                }
            } catch (e) {}
        }

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);

        const dataForense = await page.evaluate(() => ({
            titulo: document.title,
            descripcion: document.querySelector('meta[name="description"]')?.content || '',
            cuerpo: document.body.innerText.substring(0, 60000),
            interactores: Array.from(document.querySelectorAll('button, a, input')).map(el => ({
                tipo: el.tagName,
                texto: el.textContent.trim() || el.getAttribute('aria-label') || ''
            })),
            visuales: Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt || ''
            }))
        }));

        const desktopScreenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 75 });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto(url, { waitUntil: 'networkidle2' });
        const mobileScreenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 75 });

        await browser.close();

        return {
            texto: `TÍTULO: ${dataForense.titulo}\nDESCRIPCIÓN: ${dataForense.descripcion}\nCONTENIDO: ${dataForense.cuerpo}`,
            visuals: dataForense,
            desktopScreenshot,
            mobileScreenshot
        };
    } catch (error) {
        if (browser) await browser.close();
        console.error('[MOTOR] Error:', error.message);
        throw new Error("FALLA_TOTAL_SCRAPE");
    }
}

module.exports = { captureAndScrape };
