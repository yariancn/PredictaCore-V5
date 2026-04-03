function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Auditoría Forense</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; }
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; }
            .report-section { page-break-before: always; padding-top: 2rem; border-top: 1px solid #1e293b; margin-bottom: 4rem; }
            h3 { color: #10b981; font-weight: 800; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: #09090b; }
            th { background: #1e293b; color: white; padding: 1rem; text-align: left; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; }
            td { border: 1px solid #27272a; padding: 1rem; font-size: 0.875rem; text-align: justify; }
            .capsula-contexto { background: #1e293b; border-left: 4px solid #10b981; padding: 1rem; margin-bottom: 2rem; font-size: 0.875rem; color: #94a3b8; font-style: italic; border-radius: 0 8px 8px 0; }
            #btn-pdf { background: #10b981; transition: 0.3s; }
            #btn-pdf:hover { background: #059669; transform: translateY(-2px); }
        </style>
    </head>
    <body class="p-4 md:p-8">
        <div class="max-w-5xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-800 text-white tracking-widest">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                <button id="btn-pdf" onclick="descargarPDF()" class="hidden px-6 py-2 rounded-lg text-white font-bold text-sm uppercase">Exportar Reporte Titán</button>
            </div>

            <div id="setup-area" class="terminal-box p-8 mb-8">
                <input type="text" id="dna" placeholder="Introduce la URL del activo digital..." class="w-full bg-slate-900 border border-slate-700 p-4 rounded-lg text-white mb-4 outline-none focus:border-emerald-500">
                <button onclick="iniciarAuditoria()" class="w-full bg-emerald-600 p-4 rounded-lg text-white font-bold uppercase hover:bg-emerald-500">Disparar Auditoría Forense</button>
            </div>

            <div id="progress-area" class="hidden mb-8">
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div id="bar" class="bg-emerald-500 h-full w-0 transition-all duration-500"></div>
                </div>
                <p id="status" class="text-center mt-4 text-sm font-mono text-emerald-400">INICIALIZANDO SONDA...</p>
            </div>

            <div id="impresion-area" class="markdown-content"></div>
        </div>

        <script>
            const etapasDesc = {
                INTRO: "I. RADIOGRAFÍA INICIAL", GEMELOS: "II. GEMELOS SINTÉTICOS", SCORECARD: "III. COMERCIAL HEALTH SCORECARD",
                VISIBILIDAD: "IV. FORENSIC SEO", BENCHMARK: "V. BENCHMARK", SWOT: "VI. SWOT",
                WISHLIST: "VII. WISH LIST", FUGAS: "VIII. 15 PUNTOS DE FUGA", ACCIONES: "IX. 15 ACCIONES",
                HERRAMIENTAS: "X. ARSENAL TECNOLÓGICO", OMNI: "XI. HOJA DE RUTA"
            };

            const contextos = {
                INTRO: "Radiografía inicial: Quiénes somos y cómo desmantelamos la arquitectura de tu negocio.",
                GEMELOS: "Psicología de Compra: Identificamos los 4 perfiles mentales que visitan tu sitio y qué necesitan ver para decir 'sí'.",
                SCORECARD: "Signos Vitales: Una calificación cruda de los 10 pilares que sostienen (o hunden) tu rentabilidad.",
                FUGAS: "Detección de Hemorragias: Los 15 puntos exactos donde tu dinero se está escapando hoy mismo.",
                OMNI: "Hoja de Ruta (21 Días): El plan de ejecución inmediata. Sin teoría, solo acción día por día."
            };

            async function iniciarAuditoria() {
                const dna = document.getElementById('dna').value;
                if(!dna) return;
                document.getElementById('setup-area').classList.add('hidden');
                document.getElementById('progress-area').classList.remove('hidden');
                
                const res = await fetch('/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dna })
                });
                const { jobId } = await res.json();
                poll(jobId);
            }

            async function poll(jobId) {
                const res = await fetch('/poll?jobId=' + jobId);
                const data = await res.json();
                
                if(data.status === 'running') {
                    const completadas = Object.keys(data.progress).length;
                    document.getElementById('bar').style.width = (completadas / 11 * 100) + '%';
                    document.getElementById('status').innerText = "PROCESANDO: " + (etapasDesc[data.currentEtapa] || data.currentEtapa);
                    setTimeout(() => poll(jobId), 3000);
                } else if(data.status === 'done') {
                    document.getElementById('progress-area').classList.add('hidden');
                    document.getElementById('btn-pdf').classList.remove('hidden');
                    renderizar(data.progress);
                }
            }

            function renderizar(progress) {
                const area = document.getElementById('impresion-area');
                let html = "";
                const orden = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
                
                orden.forEach(id => {
                    if(progress[id]) {
                        let contenido = marked.parse(progress[id]);
                        let contexto = contextos[id] ? \`<div class="capsula-contexto">\${contextos[id]}</div>\` : "";
                        html += \`<div class="report-section">\${contexto}\${contenido}</div>\`;
                    }
                });
                area.innerHTML = html;
            }

            async function descargarPDF() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "GENERANDO PDF..."; btn.disabled = true;
                const html = document.documentElement.outerHTML;
                const res = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html })
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'PredictaCore_Reporte_' + Date.now() + '.pdf'; a.click();
                btn.innerText = "Exportar Reporte Titán"; btn.disabled = false;
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
