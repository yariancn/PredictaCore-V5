function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore v5.5 - Industrial</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background: #050505; color: #e5e5e5; font-family: 'Inter', sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #0a0a0a; border: 1px solid #1a1a1a; }
            .loader { border-top-color: #d4af37; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </head>
    <body class="p-4 md:p-8">
        <div class="max-w-5xl mx-auto">
            <header class="mb-12 border-b border-zinc-800 pb-6">
                <h1 class="text-3xl font-bold tracking-tighter gold-text">PREDICTACORE <span class="text-white">v5.5</span></h1>
                <p class="text-zinc-500 text-sm mt-2 uppercase tracking-widest text-emerald-500">Unidad de Inteligencia Estratégica</p>
            </header>

            <div class="grid grid-cols-1 gap-6">
                <section class="terminal-box p-6 rounded-lg">
                    <label class="block text-xs uppercase tracking-widest text-zinc-500 mb-4">Ingresa la URL del Activo</label>
                    <div class="flex gap-4">
                        <input type="text" id="targetUrl" placeholder="https://ejemplo.com" 
                               class="bg-zinc-900 border border-zinc-800 rounded p-3 w-full focus:outline-none focus:border-emerald-500 transition-all text-white">
                        <button onclick="iniciarAnalisis()" id="btnRun"
                                class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded transition-all uppercase text-xs tracking-tighter">
                            Correr Teaser
                        </button>
                    </div>
                </section>

                <div id="statusOutput" class="text-xs font-mono text-zinc-500 px-2"></div>
                <div id="reportContainer" class="space-y-6"></div>
            </div>
        </div>

        <script>
            const etapas = ["INTRO", "GEMELOS", "ACTIVOS", "SWOT", "FUGAS", "ACCIONES"];
            
            async function iniciarAnalisis() {
                const url = document.getElementById('targetUrl').value;
                const btn = document.getElementById('btnRun');
                const output = document.getElementById('statusOutput');
                const container = document.getElementById('reportContainer');
                
                if(!url) return alert("Ingresa una URL");

                btn.disabled = true;
                btn.innerText = "EXTRAYENDO ADN...";
                container.innerHTML = "";
                output.innerText = "Iniciando protocolos de disección...";

                try {
                    const resDna = await fetch('/get-dna', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ targetData: url })
                    });
                    const { dna } = await resDna.json();
                    output.innerText = "ADN obtenido. Procesando Inteligencia...";

                    for (const etapa of etapas) {
                        btn.innerText = "GENERANDO: " + etapa;
                        
                        const section = document.createElement('div');
                        section.className = "terminal-box p-8 rounded-lg animate-pulse border-l-4 border-emerald-900";
                        section.innerHTML = "<h3 class='gold-text font-bold mb-4 uppercase tracking-widest text-xs'>" + etapa + "</h3><div class='text-zinc-400'>Procesando cerebro...</div>";
                        container.prepend(section);

                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa })
                        });

                        const data = await res.json();
                        if(data.error) throw new Error(data.error);

                        section.classList.remove('animate-pulse', 'border-emerald-900');
                        section.classList.add('border-emerald-500');
                        section.innerHTML = "<h3 class='gold-text font-bold mb-4 uppercase tracking-widest text-xs'>" + etapa + "</h3>" + 
                                          "<div class='prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap'>" + data.content + "</div>";
                    }

                    btn.innerText = "ANÁLISIS COMPLETADO";
                    output.innerText = "Misión cumplida.";
                    btn.disabled = false;

                } catch (e) {
                    output.innerText = "ERROR: " + e.message;
                    btn.disabled = false;
                    btn.innerText = "REINTENTAR";
                }
            }
        </script>
    </body>
    </html>`;
}

module.exports = { getHTML };
