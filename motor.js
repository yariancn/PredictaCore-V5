const axios = require('axios');
const { chromium } = require('playwright');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    let technicalErrors = [];
    page.on('pageerror', err => technicalErrors.push(err.message));

    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'load', timeout: 45000 });
    const loadTime = (Date.now() - startTime) / 1000;
    
    await page.waitForTimeout(3000); // Carga de scripts dinámicos

    // BARRIDO 360: Menús
    const menuSelectors = ['button[aria-label*="menu"]', '.hamburger', '.menu-toggle', 'nav button', '[class*="hamburger"]'];
    for (const sel of menuSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn && await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(1000);
          break; 
        }
      } catch (e) {}
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ 
        src: img.src, 
        alt: img.alt || 'fuga de SEO' 
      })).filter(i => i.src.startsWith('http')).slice(0, 20)),
      buttons: await page.$$eval('button, .btn, a.button', els => els.map(el => el.textContent.trim())),
      loadTime,
      technicalErrors: technicalErrors.slice(0, 5)
    };

    await browser.close();
    if (fullText.length < 500) throw new Error("Acceso denegado o página vacía");
    return { text: fullText.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR] Activando Fallback Jina.`);
    const res = await axios.get(`https://r.jina.ai/${input}`);
    return { text: res.data, visuals: { images: [], buttons: [], loadTime: 'N/A', technicalErrors: [e.message] } };
  }
}

module.exports = { scrapeDeep };
