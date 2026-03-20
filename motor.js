const axios = require('axios');

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

// Versión mínima que funcionaba: solo Jina
async function scrapeDeep(input) {
  if (input.startsWith('http')) {
    return { text: await extraerDNA(input), visuals: {} };
  } else {
    return { text: input, visuals: {} };
  }
}

module.exports = { llamarIA, extraerDNA, scrapeDeep };
