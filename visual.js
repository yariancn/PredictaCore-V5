function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v20.0</title>
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
    <body class="p-4 md:p-8">
        <div class="max-w-6xl mx-auto">
            <header class="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 class="text-4xl font-bold tracking-tighter text-white">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                    <p class="text-zinc-500 text-[10px] mt-2 uppercase tracking-[0.3em] text-emerald-500 font-bold">Auditoría Forense Universal de Alta Gama</p>
                </div>
                <div class="text-right text-[10px] text-zinc-600 font-mono uppercase tracking-widest">v20.0_System_Live</div>
            </header>

            <section class="terminal-box p-8 rounded-xl mb-12 shadow-2xl">
                <div class="flex flex-col gap-6">
                    <label class="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Ingresa el DNA del Activo (URL o Concepto)</label>
                    <textarea id="targetData" placeholder="Ej: oxyhyperbaric.com" 
                              class="bg-zinc-900 border border-zinc-800 rounded-lg p-5 w-full text-white focus:outline-none focus:border-gold h-24 transition-all"></textarea>
                    <button onclick="iniciar()" id="btnRun" class="bg-emerald-600 hover:bg-emerald-400 text-black font-black py-5 px-8 rounded-lg transition-all text-sm tracking-[0.2em] uppercase shadow-lg shadow-emerald-900/20">
                        EJECUTAR DISECCIÓN FORENSE
                    </button>
                </div>
            </section>

            <div id="status" class="text-[10px] font-mono text-zinc-500 mb-8 px-2 text-center uppercase tracking-[0.4em]"></div>
            <div id="contenedorReporte" class="space-y-12"></div>
        </div>

        <script>
            const etapas = [
                { id: 'INTRO', title: '1. MANIFIESTO ESTRATÉGICO' },
                { id: 'GEMELOS', title: '2. CONSENSO DE GEMELOS SINTÉTICOS' },
                { id: 'SCORECARD', title: '3. SCORECARD DETALLADO' },
                { id: 'BENCHMARK', title: '4. BENCHMARK COMPETITIVO' },
                { id: 'SWOT', title: '5. ANÁLISIS SWOT ESTRATÉGICO' },
                { id: 'WISHLIST', title: '6. WISHLIST DE GEMELOS' },
                { id: 'FUGAS', title: '7. LAS 15 FUGAS DE CAPITAL' },
                { id: 'ACCIONES', title: '8. LAS 15 ACCIONES TÁCTICAS' },
                { id: 'HERRAMIENTAS', title: '9. HERRAMIENTAS DE MEJORA' },
                { id: 'OMNI', title: '10. BLOQUES DE AUTORIDAD Y RUTA' }
            ];

            async function iniciar() {
                const dataRaw = document.getElementById('targetData').value;
                if(!dataRaw) return alert("DNA REQUERIDO");
                
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                
                btn.disabled = true;
                contenedor.innerHTML = "";
                status.innerText = "Sincronizando Gemelos Sintéticos...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: dataRaw })
                    });
                    const { dna } = await resDna.json();
                    
                    for (const etapa of etapas) {
                        status.innerText = "Extrayendo: " + etapa.id;
                        const div = document.createElement('div');
                        div.className = "terminal-box p-10 rounded-xl border-l-4 border-zinc-800 animate-pulse mb-10";
                        div.innerHTML = "<h3 class='gold-text font-bold mb-6 uppercase text-xs tracking-widest'>" + etapa.title + "</h3><div class='text-zinc-700 text-sm italic'>Analizando flujos de capital...</div>";
                        contenedor.appendChild(div);

                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        
                        div.classList.remove('animate-pulse', 'border-zinc-800');
                        div.classList.add('border-gold');
                        div.innerHTML = "<h3 class='gold-text font-bold mb-8 uppercase text-xs tracking-[0.3em]'>" + etapa.title + "</h3>" + 
                                       "<div class='prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap text-[15px]'>" + data.content + "</div>";
                        
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                    status.innerText = "AUDITORÍA COMPLETADA. ACTIVO DISECCIONADO.";
                    btn.disabled = false;
                } catch (e) {
                    status.innerText = "FALLO CRÍTICO: " + e.message;
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
