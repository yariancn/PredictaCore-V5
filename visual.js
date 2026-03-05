function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán v32.0</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-4xl mx-auto">
            <header class="mb-24">
                <h1 class="text-2xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                <p class="text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.5em]">Auditoría Forense de Conversión</p>
            </header>

            <section class="terminal-box p-12 rounded-lg mb-24 shadow-2xl">
                <textarea id="targetData" placeholder="DNA del activo..." class="bg-transparent border-b border-zinc-800 p-2 w-full text-white focus:outline-none focus:border-gold h-16 mb-10 text-xl font-light"></textarea>
                <button onclick="iniciar()" id="btnRun" class="bg-white hover:bg-zinc-200 text-black font-bold py-5 px-10 rounded-sm transition-all text-[11px] tracking-[0.4em] uppercase">Ejecutar Auditoría</button>
            </section>

            <div id="status" class="text-[10px] font-mono text-zinc-600 mb-20 text-center uppercase tracking-[0.6em]"></div>
            <div id="contenedorReporte" class="space-y-4"></div>
        </div>

        <script>
            const etapas = [
                { id: 'INTRO', title: 'I. Diagnóstico de Ingeniería' },
                { id: 'GEMELOS', title: 'II. Perfiles Psicológicos' },
                { id: 'SCORECARD', title: 'III. Scorecard PredictaCore' },
                { id: 'VISIBILIDAD', title: 'IV. Visibilidad Externa' },
                { id: 'BENCHMARK', title: 'V. Benchmarking Local' },
                { id: 'SWOT', title: 'VI. Matriz Estratégica' },
                { id: 'WISHLIST', title: 'VII. Lista de Deseos' },
                { id: 'FUGAS', title: 'VIII. 15 Fugas de Capital' },
                { id: 'ACCIONES', title: 'IX. 15 Acciones Tácticas' },
                { id: 'HERRAMIENTAS', title: 'X. 5 Herramientas de Escala' },
                { id: 'OMNI', title: 'XI. Autoridad y Hoja de Ruta' }
            ];

            async function iniciar() {
                const dna = document.getElementById('targetData').value;
                if(!dna) return;
                const btn = document.getElementById('btnRun');
                const status = document.getElementById('status');
                const contenedor = document.getElementById('contenedorReporte');
                btn.disabled = true;
                contenedor.innerHTML = "";
                
                for (const etapa of etapas) {
                    status.innerText = "PROCESANDO: " + etapa.title;
                    const div = document.createElement('div');
                    div.className = "report-section animate-pulse";
                    div.id = "section-" + etapa.id;
                    div.innerHTML = '<h3 class="gold-text font-bold mb-8 uppercase text-[10px] tracking-[0.5em]">' + etapa.title + '</h3>' +
                                     '<div id="content-' + etapa.id + '" class="text-zinc-400 leading-relaxed text-[16px] font-light whitespace-pre-wrap italic">Analizando...</div>';
                    contenedor.appendChild(div);

                    try {
                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        const contentDiv = document.getElementById("content-" + etapa.id);
                        const sectionDiv = document.getElementById("section-" + etapa.id);
                        sectionDiv.classList.remove('animate-pulse');
                        sectionDiv.classList.add('border-gold');
                        contentDiv.classList.remove('italic');
                        contentDiv.innerHTML = data.content;
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    } catch (e) {
                        console.error(e);
                    }
                }
                status.innerText = "AUDITORÍA FINALIZADA";
                btn.disabled = false;
            }
        </script>
    </body>
    </html>`;
}
module.exports = { getHTML };
