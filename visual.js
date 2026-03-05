function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v27.0</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
        <style>
            body { background: #050505; color: #a1a1aa; font-family: 'Inter', sans-serif; letter-spacing: -0.01em; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .border-gold { border-color: #d4af37; }
            .report-section { border-bottom: 1px solid #18181b; padding-bottom: 4rem; margin-bottom: 4rem; }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-4xl mx-auto">
            <header class="mb-24 flex justify-between items-end">
                <div>
                    <h1 class="text-2xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                    <p class="text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.5em] font-medium">Auditoría de Ingeniería de Conversión</p>
                </div>
                <div class="text-[9px] text-zinc-700 font-mono tracking-widest uppercase">Standard_Protocol_v27.0</div>
            </header>

            <section class="terminal-box p-12 rounded-lg mb-24 shadow-2xl">
                <div class="flex flex-col gap-10">
                    <label class="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">DNA del Activo Bajo Análisis</label>
                    <textarea id="targetData" placeholder="Ingrese URL, idea o activo digital..." 
                              class="bg-transparent border-b border-zinc-800 p-2 w-full text-white focus:outline-none focus:border-gold h-16 transition-all text-2xl font-light"></textarea>
                    <button onclick="iniciar()" id="btnRun" class="bg-white hover:bg-zinc-200 text-black font-bold py-5 px-10 rounded-sm transition-all text-[11px] tracking-[0.4em] uppercase self-start">
                        Ejecutar Auditoría Forense
                    </button>
                </div>
            </section>

            <div id="status" class="text-[10px] font-mono text-zinc-600 mb-20 text-center uppercase tracking-[0.6em]"></div>
            <div id="contenedorReporte" class="space-y-4"></div>
        </div>

        <script>
            const etapas = [
                { id: 'INTRO', title: 'I. Diagnóstico de Ingeniería de Conversión' },
                { id: 'GEMELOS', title: 'II. Perfiles Psicológicos (Gemelos)' },
                { id: 'SCORECARD', title: 'III. Scorecard PredictaCore' },
                { id: 'BENCHMARK', title: 'IV. Benchmarking Local' },
                { id: 'SWOT', title: 'V. Matriz Estratégica' },
                { id: 'WISHLIST', title: 'VI. Lista de Deseos del Cliente' },
                { id: 'FUGAS', title: 'VII. 15 Fugas de Capital Detectadas' },
                { id: 'ACCIONES', title: 'VIII. 15 Acciones de Ejecución Inmediata' },
                { id: 'HERRAMIENTAS', title: 'IX. Herramientas de Escalamiento' },
                { id: 'OMNI', title: 'X. Bloques de Autoridad y Ruta' }
            ];

            async function iniciar() {
                const dataRaw = document.getElementById('targetData').value;
                if(!dataRaw) return;
                
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                
                btn.disabled = true;
                contenedor.innerHTML = "";
                status.innerText = "Sincronizando motores de búsqueda y análisis de activos...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: dataRaw })
                    });
                    const { dna } = await resDna.json();
                    
                    for (const etapa of etapas) {
                        status.innerText = "Generando " + etapa.title;
                        const div = document.createElement('div');
                        div.className = "report-section opacity-0 transition-opacity duration-1000";
                        div.innerHTML = "<h3 class='gold-text font-bold mb-12 uppercase text-[10px] tracking-[0.5em]'>" + etapa.title + "</h3>" + 
                                       "<div id='content-" + etapa.id + "' class='text-zinc-300 leading-relaxed text-[16px] font-light whitespace-pre-wrap'></div>";
                        contenedor.appendChild(div);
                        setTimeout(() => div.style.opacity = "1", 100);

                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        document.getElementById('content-' + etapa.id).innerHTML = data.content;
                        
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                    status.innerText = "Auditoría Finalizada.";
                    btn.disabled = false;
                } catch (e) {
                    status.innerText = "Fallo en el protocolo de análisis.";
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
