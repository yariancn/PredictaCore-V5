const axios = require('axios');

async function llamarIA(instruccion, prompt) {
    const r = await axios.post('https://api.x.ai/v1/chat/completions', {
        model: "grok-2-1212",
        messages: [{ role: "system", content: instruccion }, { role: "user", content: prompt }],
        temperature: 0.1
    }, { headers: { 'Authorization': "Bearer " + process.env.XAI_API_KEY.trim() }, timeout: 90000 });
    return r.data.choices[0].message.content;
}

async function extraerDNA(url) {
    const r = await axios.get("https://r.jina.ai/" + url, { timeout: 20000 });
    return r.data.substring(0, 12000);
}

module.exports = { llamarIA, extraerDNA };
