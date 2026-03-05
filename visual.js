function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v26.0</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
        <style>
            body { background: #070707; color: #d1d1d1; font-family: 'Inter', sans-serif; }
            .gold-text { color: #c5a059; }
            .terminal-box { background: #0d0d0d; border: 1px solid #1a1a1a; }
            .border-gold { border-color: #c5a059; }
        </style>
    </head>
    <body class="p-6 md:p-16">
        <div class="max-w-5xl mx-auto">
            <header class="mb-20 border-b border-zinc-800 pb-10 flex justify-between items-end">
                <div>
                    <h1 class="text-3xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                    <p class="text-zinc-600 text-[9px] mt-3 uppercase tracking-[0.5em] font-black">Intelligence & Forensic Audit Systems</p>
                </div>
                <div class="text-[9px] text-zinc-700 font-mono tracking-widest uppercase">Global_Standard_v26.0</div>
            </header>

            <section class="terminal-box p-10 rounded-sm mb-20 shadow-2xl">
                <div class="flex flex-col gap-8">
                    <label class="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Ingreso de DNA del Activo</label>
                    <textarea id="targetData" placeholder="URL, Idea de Negocio o Perfil Social..." 
                              class="bg-transparent border-b border-zinc-800 p-2 w-full text-white focus:outline-none focus:border-gold h-20 transition-all text-xl font-light"></textarea>
                    <button onclick="iniciar()" id="btnRun" class="bg-zinc-100 hover:bg-white text-black font-black py-6 px-10 rounded-sm transition-all text-xs tracking-[0.4em] uppercase">
                        Iniciar Auditoría Forense
                    </button>
                </div>
            </section>

            <div id="status" class="text-[9px] font-mono text-zinc-600 mb-16 text-center uppercase tracking-[0.6em]"></div>
            <div id="contenedorReporte" class="space-y-24 pb-40"></div>
        </div>

        <script>
            const etapas = [
                { id: 'INTRO', title: 'I. Manifiesto y Visibilidad' },
                { id: 'GEMELOS', title: 'II. Perfiles Psicológicos' },
                { id: 'SCORECARD', title: 'III. Scorecard PredictaCore' },
                { id: 'BENCHMARK', title: 'IV. Benchmarking Local' },
                { id: 'SWOT', title: 'V. Matriz Estratégica' },
                { id: 'WISHLIST', title: 'VI. Lista de Deseos (Gemelos)' },
                { id: 'FUGAS', title: 'VII. 15 Fugas de Capital' },
                { id: 'ACCIONES', title: 'VIII. 15 Acciones Tácticas' },
                { id: 'HERRAMIENTAS', title: 'IX. Herramientas de Escala' },
                { id: 'OMNI', title: 'X. Autoridad y Hoja de Ruta' }
            ];

            async function iniciar() {
                const dataRaw = document.getElementById('targetData').value;
                if(!dataRaw) return;
                
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                
                btn.disabled = true;
                contenedor.innerHTML = "";
                status.innerText = "Sincronizando Motores de Búsqueda y Análisis...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: dataRaw })
                    });
                    const { dna } = await resDna.json();
                    
                    for (const etapa of etapas) {
                        status.innerText = "Ejecutando Fase: " + etapa.id;
                        const div = document.createElement('div');
                        div.className = "mb-20 opacity-0 transition-opacity duration-1000";
                        div.innerHTML = "<h3 class='gold-text font-bold mb-10 uppercase text-[10px] tracking-[0.5em] border-b border-zinc-900 pb-4'>" + etapa.title + "</h3>" + 
                                       "<div id='content-" + etapa.id + "' class='text-zinc-400 leading-relaxed text-[15px] font-light whitespace-pre-wrap'></div>";
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
                    status.innerText = "Error en el Sistema.";
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
