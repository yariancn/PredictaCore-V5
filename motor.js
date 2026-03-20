const axios = require('axios');
const { chromium } = require('playwright');

async function llamarIA(instruccion, prompt) {
  const key = (process.env.XAI_API_KEY || "").trim();
  if (!key) throw new Error("FALTA_LLAVE_XAI");
  try {
    const r = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: "grok-4-latest",
      messages: [
        { role: "system", content: instruccion },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      timeout: 90000
    });
    return r.data.choices[0].message.content;
  } catch (e) {
    throw new Error("XAI_FAIL: " + e.message);
  }
}

async function extraerDNA(url) {
  try {
    const jinaKey = (process.env.JINA_API_KEY || "").trim();
    const headers = jinaKey ? { 'Authorization': `Bearer ${jinaKey}` } : {};
    const r = await axios.get("https://r.jina.ai/" + url, { headers, timeout: 25000 });
    return r.data.substring(0, 15000);
  } catch (e) { throw new Error("JINA_FAIL: " + e.message); }
}

// BARRIDO PROFUNDO: Navega, hace clic en menú hamburguesa, entra categorías, llega a checkout
async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(input, { timeout: 30000 });

  // Clic en menú hamburguesa (ícono típico)
  try {
    await page.click('button[aria-label="Menu"], .hamburger, [class*="menu"], [class*="nav-toggle"]', { timeout: 10000 });
  } catch (e) { console.log("Menú hamburguesa no encontrado"); }

  // Espera carga categorías
  await page.waitForTimeout(2000);

  // Extrae todo
  let text = await page.content();
  const visuals = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a.btn, [class*="button"]')).map(el => el.innerText.trim());
    const mainColor = window.getComputedStyle(document.body).backgroundColor;
    const location = document.querySelector('[itemprop="address"], .address, footer address')?.innerText || 'No ubicación';
    return { buttons, mainColor, location };
  });

  await browser.close();
  return { text, visuals };
}

module.exports = { llamarIA, extraerDNA, scrapeDeep };
