const express = require('express');
const cors = require('cors');
const { PERSONA, PROMPTS } = require('./cerebro');
const { llamarIA, extraerDNA } = require('./motor');
const { getHTML } = require('./visual');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/get-dna', async (req, res) => {
    try {
        const dna = await extraerDNA(req.body.targetData);
        res.status(200).json({ dna });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const promptFinal = PROMPTS[etapaId] ? PROMPTS[etapaId](dna) : PROMPTS.TEASER_PUNTO(dna, etapaId);
        const respuesta = await llamarIA(PERSONA, promptFinal);
        res.status(200).json({ content: respuesta });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.send(getHTML()));
app.listen(process.env.PORT || 3000);
