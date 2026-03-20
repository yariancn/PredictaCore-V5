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
    return r.data.substring(0, 45000);
  } catch (e) { throw new Error("JINA_FAIL: " + e.message); }
}

// HYBRID: Jina para texto profundo + Playwright solo para visuals (rápido, sin timeout)
async function scrapeDeep(input, maxPages = 12) {
  const timestamp = new Date().toISOString();
  let text = "";
  let visuals = {};

  if (input.startsWith('http')) {
    // 1. Texto profundo con Jina (rápido y estable)
    text = await extraerDNA(input);

    // 2. Visuals + ubicación con Playwright (solo lo necesario, <2s)
    try {
      const browser = await chromium.launch({ headless: true, timeout: 15000 });
      const page = await browser.newPage();
      await page.goto(input, { timeout: 15000 });

      visuals = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a.btn, [class*="button"], [class*="btn"]')).map(el => ({
          text: el.innerText.trim(),
          color: window.getComputedStyle(el).backgroundColor,
          position: el.getBoundingClientRect()
        }));
        const mainColor = window.getComputedStyle(document.body).backgroundColor;
        const location = document.querySelector('[itemprop="address"], .address, footer address')?.innerText || 'No ubicación detectada';
        return { buttons, mainColor, location };
      });

      await browser.close();
    } catch (e) {
      console.log("Visuals fallback:", e.message);
      visuals = {};
    }
  } else {
    text = input;
  }

  return { 
    text: text + `\n(Timestamp fresco: ${timestamp})`, 
    visuals 
  };
}

module.exports = { llamarIA, extraerDNA, scrapeDeep };
