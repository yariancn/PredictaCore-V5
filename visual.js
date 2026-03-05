const etapas = [
    { id: 'INTRO', title: 'I. Diagnóstico de Ingeniería de Conversión' },
    { id: 'GEMELOS', title: 'II. Perfiles Psicológicos (Gemelos)' },
    { id: 'SCORECARD', title: 'III. Scorecard PredictaCore' },
    { id: 'VISIBILIDAD', title: 'IV. Visibilidad y Reputación Externa' },
    { id: 'BENCHMARK', title: 'V. Benchmarking Local' },
    { id: 'SWOT', title: 'VI. Matriz Estratégica (FODA)' },
    { id: 'WISHLIST', title: 'VII. Lista de Deseos del Cliente' },
    { id: 'FUGAS', title: 'VIII. 15 Fugas de Capital Detectadas' },
    { id: 'ACCIONES', title: 'IX. 15 Acciones de Ejecución Inmediata' },
    { id: 'HERRAMIENTAS', title: 'X. 5 Herramientas de Escalamiento' },
    { id: 'OMNI', title: 'XI. Bloques de Autoridad y Ruta' }
];

async function iniciarAuditoria() {
    const dna = document.getElementById('targetData').value;
    const contenedor = document.getElementById('contenedorReporte');
    contenedor.innerHTML = ""; // Limpieza total
    
    for (const etapa of etapas) {
        // Crear el contenedor de la etapa ANTES de la llamada
        const div = document.createElement('div');
        div.className = "report-section border-l-2 border-zinc-800 pl-6 mb-16 animate-pulse";
        div.innerHTML = `<h3 class="gold-text uppercase text-[10px] tracking-widest mb-4">${etapa.title}</h3>
                         <div id="content-${etapa.id}" class="text-zinc-500 italic">Procesando hallazgos...</div>`;
        contenedor.appendChild(div);

        try {
            const res = await fetch('/diseccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dna, etapaId: etapa.id })
            });
            
            const data = await res.json();
            const contentDiv = document.getElementById(`content-${etapa.id}`);
            
            // Inyectar el Oro Molido
            div.classList.remove('animate-pulse', 'border-zinc-800');
            div.classList.add('border-gold');
            contentDiv.classList.remove('text-zinc-500', 'italic');
            contentDiv.classList.add('text-zinc-300');
            contentDiv.innerHTML = data.content;

            // Auto-scroll suave para mantener el engagement
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        } catch (e) {
            document.getElementById(`content-${etapa.id}`).innerHTML = "Error en la disección de esta fase. El sistema intentará recuperar el hilo.";
        }
    }
}
