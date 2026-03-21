// ... importaciones ...

app.post('/diseccion', async (req, res) => {
  const { dna, etapaId } = req.body;
  const { XAI_API_KEY } = process.env;

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let hechos = "";
    let visualsData = {};

    if (dna.startsWith('http')) {
      const deepData = await scrapeDeep(dna);
      hechos = deepData.text;
      visualsData = deepData.visuals;
    } else {
      hechos = dna;
    }

    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          // Enviamos los visuales como contexto de alta prioridad
          { role: "system", content: `EVIDENCIA VISUAL DETECTADA: ${JSON.stringify(visualsData)}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.2
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

// ... resto del código ...
