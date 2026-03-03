// --- PREDICTACORE: INTERFAZ VISUAL v5.0 ---
function getHTML() {
    return `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@700&display=swap');
    body { background: #050505; color: #fff; font-family: 'Inter', sans-serif; }
    .report-card { background: #ffffff; color: #111; padding: 2.5rem; border-radius: 1.5rem; margin-bottom: 2.5rem; border-left: 10px solid #10b981; animation: fadeIn 0.8s ease-out; }
    .title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #000; margin-bottom: 1.5rem; text-transform: uppercase; font-weight: 900; }
    .content { font-size: 1.15rem; line-height: 1.8; color: #1e293b; white-space: pre-wrap; }
    .content b { color: #000; font-weight: 800; }
    </style></head>
    <body class="p-6 md:p-24 bg-black">
        <header class="text-center mb-16"><h1 class="text-6xl md:text-8xl font-black italic tracking-tighter">PREDICTA<span class="text-green-500">CORE</span></h1><p class="text-zinc-500 tracking-[1em] text-xs uppercase mt-4">Vanguard Intelligence Unit</p></header>
        <div id="report" class="max-w-4xl mx-auto"></div>
        <div id="input-container" class="max-w-xl mx-auto text-center">
            <input id="url" class="w-full p-5 bg-zinc-900 border border-white/10 rounded-full mb-4 text-white outline-none" placeholder="URL para Disección Teaser...">
            <button onclick="runTeaser()" class="w-full bg-white text-black py-5 rounded-full font-black text-xl hover:bg-green-500 transition-all">CORRER TEASER</button>
        </div>
        <div id="loader" class="hidden text-center text-green-500 font-black py-10 animate-pulse uppercase tracking-widest">Analizando Activos...</div>
        <script>
            const etapas = ["INTRO", "GEMELOS", "ACTIVOS", "SWOT", "BENCHMARK", "WISHLIST", "FUGAS", "ACCIONES", "RUTA"];
            async function runTeaser() {
                const url = document.getElementById('url').value; if(!url) return;
                document.getElementById('input-container').classList.add('hidden');
                document.getElementById('report').innerHTML = '';
                try {
                    const dnaRes = await fetch('/get-dna', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ targetData: url }) });
                    const { dna } = await dnaRes.json();
                    for (let etapa of etapas) {
                        document.getElementById('loader').classList.remove('hidden');
                        const res = await fetch('/diseccion', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ dna, etapaId: etapa }) });
                        const data = await res.json();
                        let clean = data.content.replace(/\\*\\*/g, '<b>').replace(/\\*/g, '').replace(/###/g, '').replace(/##/g, '').replace(/#/g, '');
                        document.getElementById('report').innerHTML += '<div class="report-card"><h2 class="title">'+etapa+'</h2><div class="content">'+clean+'</div></div>';
                    }
                } catch(e) { alert("Error de conexión."); }
                finally { document.getElementById('loader').classList.add('hidden'); }
            }
        </script></body></html>`;
}
module.exports = { getHTML };
