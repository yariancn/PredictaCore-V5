const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log("[MOTOR] Barrido profundo iniciado - URL: " + input);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle', timeout: 45000 });

    // Clic en cualquier menú hamburguesa (izquierdo o superior)
    const menuSelectors = ['button[aria-label*="menu"]', 'button[aria-label*="Menú"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(2000);
        console.log(`[MOTOR] Menú clickeado: ${sel}`);
        break;
      }
    }

    // Scroll y extracción
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    let fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'sin alt' }))),
      buttons: await page.$$eval('button, .btn', els => els.map(el => el.textContent.trim()))
    };

    await browser.close();
    console.log(`[MOTOR] Barrido completado - Texto: ${fullText.length} caracteres`);
    return { text: fullText.substring(0, 60000), visuals };
  } catch (e) {
    console.error(`[MOTOR] Playwright falló: ${e.message}`);
    if (browser) await browser.close();
    // Fallback Jina seguro
    try {
      const r = await axios.get("https://r.jina.ai/" + input, { timeout: 30000 });
      return { text: r.data.substring(0, 50000), visuals: {} };
    } catch {
      return { text: input, visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
