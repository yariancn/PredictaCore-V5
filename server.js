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
    console.log("--> Iniciando extracción de ADN para:", req.body.targetData);
    try {
        const dna = await extraerDNA(req.body.targetData);
        console.log("OK: ADN extraído.");
        res.status(200).json({ dna });
    } catch (e) {
        console.error("ERROR DNA:", e.message);
        res.status(500).json({ error: e.message });
    }
});

app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    console.log(`--> Procesando Etapa: ${etapaId}`);
    try {
        const promptFn = PROMPTS[etapaId] || PROMPTS.TEASER_PUNTO;
        const promptFinal = promptFn(dna, etapaId);
        const respuesta = await llamarIA(PERSONA, promptFinal);
        console.log(`OK: Etapa ${etapaId} completada.`);
        res.status(200).json({ content: respuesta });
    } catch (e) {
        console.error(`FALLO EN ${etapaId}:`, e.message);
        res.status(500).json({ error: e.message });
    }
});

app.get('/', (req, res) => res.send(getHTML()));
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`PredictaCore v5.2 Online en puerto ${PORT}`));
