function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v24.0</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
        <style>
            body { background: #050505; color: #e5e5e5; font-family: 'Inter', sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #0a0a0a; border: 1px solid #1a1a1a; }
            .border-gold { border-color: #d4af37; }
            .font-mono { font-family: 'JetBrains Mono', monospace; }
        </style>
    </head>
    <body class="p-4 md:p-12">
        <div class="max-w-6xl mx-auto">
            <header class="mb-16 border-b border-zinc-800 pb-8 flex justify-between items-end">
                <div>
                    <h1 class="text-4xl font-bold tracking-tighter text-white">PREDICTACORE <span class="gold-text italic text-3xl">TITÁN</span></h1>
                    <p class="text-zinc-500 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">Unidad de Auditoría Forense Estratégica</p>
                </div>
                <div class="text-right text-[10px] text-zinc-600 font-mono uppercase tracking-widest text-emerald-600">v24.0_SYSTEM_SECURE</div>
            </header>

            <section class="terminal-box p-10 rounded-xl mb-16 shadow-2xl">
                <div class="flex flex-col gap-6">
                    <label class="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold ml-1">DNA DEL ACTIVO (URL O CONCEPTO DE NEGOCIO)</label>
                    <textarea id="targetData" placeholder="Ingrese el activo para iniciar la disección..." 
                              class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full text-white focus:outline-none focus:border-gold h-28 transition-all text-lg"></textarea>
                    <button onclick="iniciar()" id="btnRun" class="bg-zinc-100 hover:bg-white text-black font-black py-5 px-8 rounded-lg transition-all text-sm tracking-[0.3em] uppercase shadow-lg">
                        EJECUTAR DISECCIÓN DE CAPITAL
                    </button>
                </div>
            </section>

            <div id="status" class="text-[10px] font-mono text-zinc-500 mb-12 px-2 text-center uppercase tracking-[0.5em]"></div>
            <div id="contenedorReporte" class="space-y-16"></div>
        </div>

        <script>
            const etapas = [
                { id: 'INTRO', title: 'I. DIAGNÓSTICO DE VISIBILIDAD' },
                { id: 'GEMELOS', title: 'II. PERFILES PSICOLÓGICOS (GEMELOS)' },
                { id: 'SCORECARD', title: 'III. SCORECARD DE RENDIMIENTO' },
                { id: 'BENCHMARK', title: 'IV. ANÁLISIS DE COMPETENCIA' },
                { id: 'SWOT', title: 'V. MATRIZ DE ESTRATEGIA (FODA)' },
                { id: 'WISHLIST', title: 'VI. LISTA DE DESEOS DEL CLIENTE' },
                { id: 'FUGAS', title: 'VII. 15 FUGAS DE CAPITAL DETECTADAS' },
                { id: 'ACCIONES', title: 'VIII. 15 ACCIONES DE EJECUCIÓN INMEDIATA' },
                { id: 'HERRAMIENTAS', title: 'IX. HERRAMIENTAS DE ESCALAMIENTO' },
                { id: 'OMNI', title: 'X. BLOQUES DE AUTORIDAD Y HOJA DE RUTA' }
            ];

            async function iniciar() {
                const dataRaw = document.getElementById('targetData').value;
                if(!dataRaw) return alert("DNA REQUERIDO");
                
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                
                btn.disabled = true;
                contenedor.innerHTML = "";
                status.innerText = "ACCEDIENDO A GOOGLE SEARCH PARA VALIDACIÓN EXTERNA...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: dataRaw })
                    });
                    const { dna } = await resDna.json();
                    
                    for (const etapa of etapas) {
                        status.innerText = "PROCESANDO SECCIÓN: " + etapa.id;
                        const div = document.createElement('div');
                        div.className = "terminal-box p-12 rounded-xl border-l-2 border-zinc-800 mb-12 shadow-2xl";
                        div.innerHTML = "<h3 class='gold-text font-bold mb-6 uppercase text-xs tracking-[0.4em]'>" + etapa.title + "</h3><div class='text-zinc-700 text-sm italic font-mono'>Analizando activos y reputación externa...</div>";
                        contenedor.appendChild(div);

                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        
                        div.classList.remove('border-zinc-800');
                        div.classList.add('border-gold');
                        div.innerHTML = "<h3 class='gold-text font-bold mb-10 uppercase text-xs tracking-[0.4em]'>" + etapa.title + "</h3>" + 
                                       "<div class='prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap text-[16px]'>" + data.content + "</div>";
                        
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                    status.innerText = "DISECCIÓN FINALIZADA. ACTIVO AUDITADO.";
                    status.className = "text-[10px] font-mono text-emerald-500 mb-12 px-2 text-center uppercase tracking-[0.5em]";
                    btn.disabled = false;
                } catch (e) {
                    status.innerText = "ERROR EN PROTOCOLO: " + e.message;
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
