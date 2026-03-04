function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v18.0</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background: #050505; color: #e5e5e5; font-family: 'Inter', sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #0a0a0a; border: 1px solid #1a1a1a; }
            .border-gold { border-color: #d4af37; }
        </style>
    </head>
    <body class="p-4 md:p-8">
        <div class="max-w-6xl mx-auto">
            <header class="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold tracking-tighter gold-text text-white">PREDICTACORE <span class="gold-text">TITÁN</span></h1>
                    <p class="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest text-emerald-500 font-bold italic">AUDITORÍA FORENSE UNIVERSAL</p>
                </div>
                <div class="text-right text-[10px] text-zinc-600 font-mono">STATUS: 2026_UNIVERSAL_V18</div>
            </header>

            <section class="terminal-box p-6 rounded-lg mb-8">
                <div class="flex flex-col gap-4">
                    <textarea id="targetData" placeholder="Ingresa URL, descripción del negocio, idea o perfil de red social..." 
                              class="bg-zinc-900 border border-zinc-800 rounded p-4 w-full text-white focus:outline-none focus:border-gold h-32"></textarea>
                    <button onclick="iniciar()" id="btnRun" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded transition-all text-sm tracking-widest">EJECUTAR DISECCIÓN TITÁN</button>
                </div>
            </section>

            <div id="status" class="text-[10px] font-mono text-zinc-500 mb-4 px-2 text-center uppercase tracking-widest"></div>
            <div id="contenedorReporte" class="space-y-8"></div>
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
                if(!dataRaw) return alert("Ingresa DNA del activo");
                
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                
                btn.disabled = true;
                contenedor.innerHTML = "";
                status.innerText = "Iniciando escaneo forense del DNA...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: dataRaw })
                    });
                    const { dna } = await resDna.json();
                    
                    for (const etapa of etapas) {
                        status.innerText = "PROCESANDO " + etapa.id + "...";
                        const div = document.createElement('div');
                        div.className = "terminal-box p-8 rounded-lg border-l-4 border-zinc-800 animate-pulse mb-6";
                        div.innerHTML = "<h3 class='gold-text font-bold mb-4 uppercase text-xs tracking-widest'>" + etapa.title + "</h3><div class='text-zinc-600 text-sm'>Ejecutando algoritmos PredictaCore...</div>";
                        contenedor.appendChild(div);

                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        
                        div.classList.remove('animate-pulse', 'border-zinc-800');
                        div.classList.add('border-gold');
                        div.innerHTML = "<h3 class='gold-text font-bold mb-4 uppercase text-xs tracking-widest'>" + etapa.title + "</h3>" + 
                                       "<div class='prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm'>" + data.content + "</div>";
                    }
                    status.innerText = "AUDITORÍA TITÁN FINALIZADA.";
                    btn.disabled = false;
                } catch (e) {
                    status.innerText = "FALLO DE SISTEMA: " + e.message;
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
