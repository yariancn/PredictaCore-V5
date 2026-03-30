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

            :root {
                --pc-green: #10b981;
                --pc-gold: #d4af37;
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #0f172a;
                --pc-border: #e5e7eb;
            }

            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; }
            .report-section { border-left: 2px solid #1e293b; padding-left: 2rem; margin-bottom: 4rem; }

            @media print {
                @page { size: A4; margin: 1in; }
                body { background: #ffffff !important; color: var(--pc-dark) !important; padding: 0 !important; }
                .no-print { display: none !important; }

                /* Ralla de Autoridad Derecha */
                body::after {
                    content: ""; position: fixed; right: -0.5in; top: -1in; bottom: -1in; width: 10px;
                    background: var(--pc-gold); z-index: 999; -webkit-print-color-adjust: exact;
                }

                .cover-page { height: 9in; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
                .cover-title { font-size: 3.5rem; font-weight: 800; color: var(--pc-dark) !important; text-transform: uppercase; line-height: 1.1; }
                .cover-accent { width: 100px; height: 10px; background: var(--pc-green); margin: 2rem 0; -webkit-print-color-adjust: exact; }

                .markdown-content h3 { 
                    color: var(--pc-dark) !important; font-size: 1.7rem !important; font-weight: 800 !important;
                    border-bottom: 3px solid var(--pc-green); padding-bottom: 0.5rem; margin: 3rem 0 1.5rem 0 !important;
                    text-transform: uppercase; page-break-after: avoid; -webkit-print-color-adjust: exact;
                }

                .markdown-content p, .markdown-content li { font-size: 11pt; line-height: 1.6; color: var(--pc-dark) !important; text-align: justify; }

                table { width: 100%; border-collapse: collapse; margin: 2rem 0; border: 1px solid var(--pc-border) !important; }
                th { background: var(--pc-dark) !important; color: #ffffff !important; padding: 12px !important; text-transform: uppercase; -webkit-print-color-adjust: exact; }
                td { padding: 10px !important; border-bottom: 1px solid var(--pc-border) !important; color: var(--pc-dark) !important; }
                tr:nth-child(even) td { background: #f9fafb !important; -webkit-print-color-adjust: exact; }

                .hemorragia-critica {
                    background-color: var(--pc-crimson-bg) !important; color: var(--pc-crimson) !important;
                    padding: 4px 10px !important; border-radius: 4px !important; font-weight: 800 !important;
                    border: 1px solid #fecaca !important; -webkit-print-color-adjust: exact;
                }
                .report-section { page-break-before: always; }
                #section-INTRO { page-break-before: avoid; }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-6xl mx-auto">
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-extrabold text-white">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                    <p class="text-zinc-500 text-[10px] uppercase tracking-[0.4em]">Forensic Audit Intelligence</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border border-emerald-500 text-emerald-500 px-6 py-2 text-xs uppercase hover:bg-emerald-500 hover:text-black transition-all">
                    Exportar Reporte Titán
                </button>
            </header>

            <div id="impresion-area">
                <div class="hidden print:flex cover-page">
                    <div class="text-emerald-500 font-bold uppercase tracking-[0.5em] mb-4">Forensic Conversion Report</div>
                    <div class="cover-accent"></div>
                    <div class="cover-title">PredictaCore<br>Titán Intelligence</div>
                    <div class="text-2xl text-gray-500 mt-8" id="pdf-domain">Asset Analysis</div>
                    <div class="mt-auto pt-10 border-t border-gray-200 flex justify-between">
                        <span class="font-bold text-gray-900">ALTAMENTE CONFIDENCIAL</span>
                        <span id="pdf-date" class="font-bold text-gray-900"></span>
                    </div>
                </div>
                <div id="reporte"></div>
            </div>

            <div class="terminal-box p-10 mt-20 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio..." class="w-full bg-transparent text-2xl text-white border-b border-zinc-800 pb-2 focus:outline-none focus:border-emerald-500">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-8 bg-emerald-600 text-white font-bold py-4 px-8 text-xs uppercase hover:bg-emerald-400 w-full md:w-auto">Ejecutar Escaneo</button>
                <div id="status" class="mt-6 text-[10px] text-zinc-500 uppercase tracking-widest">Esperando...</div>
            </div>
        </div>

        <script>
            document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            function suavizarMayusculas(texto) {
                const lineas = texto.split('\\n');
                return lineas.map(linea => {
                    if (linea.startsWith('###')) return linea; 
                    if (linea.trim().startsWith('|')) {
                        let celdas = linea.split('|').map(c => {
                            let t = c.trim();
                            if (t.length > 15 && (t.replace(/[^A-Z]/g, '').length / t.length) > 0.45) return ' ' + t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() + ' ';
                            return c;
                        });
                        return celdas.join('|');
                    }
                    return linea;
                }).join('\\n');
            }

            function aplicarSemaforos(html) {
                const d = document.createElement('div'); d.innerHTML = html;
                d.querySelectorAll('td').forEach(td => {
                    const m = td.textContent.trim().match(/^(\\d+)/);
                    if (m) {
                        const v = parseInt(m[1]);
                        td.style.fontWeight = '800';
                        td.style.color = v <= 5 ? '#ef4444' : v <= 7 ? '#f59e0b' : '#10b981';
                    }
                });
                return d.innerHTML;
            }

            let paintedEtapas = new Set();
            async function ejecutar() {
                const dna = document.getElementById('dna').value; if (!dna) return;
                document.getElementById('pdf-domain').innerText = 'Analysis: ' + dna;
                const btn = document.getElementById('btn-ejecutar');
                const btnPdf = document.getElementById('btn-pdf');
                const reporte = document.getElementById('reporte');
                btn.disabled = true; btnPdf.classList.add('hidden'); reporte.innerHTML = '';
                document.getElementById('status').innerText = '>>> INICIANDO ESCANEO...';
                
                const etapas = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
                etapas.forEach(e => {
                    const d = document.createElement('div'); d.id = 'section-' + e;
                    d.innerHTML = '<div id="content-'+e+'" class="text-zinc-700 italic text-xs animate-pulse p-4">Procesando...</div>';
                    reporte.appendChild(d);
                });

                const res = await fetch('/start', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ dna: dna }) });
                const data = await res.json();
                
                const interval = setInterval(async () => {
                    const pRes = await fetch('/poll?jobId=' + encodeURIComponent(data.jobId));
                    const info = await pRes.json();
                    for (const eid in info.progress) {
                        if (!paintedEtapas.has(eid)) {
                            const cDiv = document.getElementById('content-' + eid);
                            let h = marked.parse(suavizarMayusculas(info.progress[eid]));
                            if (h.includes('table')) h = aplicarSemaforos(h);
                            h = h.replace(/\\[HEMORRAGIA CRÍTICA\\]/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');
                            cDiv.innerHTML = '<div class="markdown-content">' + h + '</div>';
                            cDiv.classList.remove('animate-pulse', 'italic', 'text-xs');
                            cDiv.classList.add('text-zinc-300');
                            paintedEtapas.add(eid);
                        }
                    }
                    if (info.status === 'done') { clearInterval(interval); document.getElementById('status').innerText = '>>> SELLADO.'; btn.disabled = false; btnPdf.classList.remove('hidden'); }
                }, 4000);
            }

            async function descargarPDFBackend() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "CRISTALIZANDO..."; btn.disabled = true;
                const area = document.getElementById('impresion-area').innerHTML;
                const htmlFull = \`<html><head><style>\${document.querySelector('style').innerHTML}</style></head><body><div class="print-container">\${area}</div></body></html>\`;
                
                try {
                    const res = await fetch('/generate-pdf', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ html: htmlFull }) });
                    if (!res.ok) throw new Error();
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'PREDICTACORE_TITAN.pdf'; a.click();
                } catch (e) {
                    alert("Error al cristalizar el documento.");
                } finally {
                    btn.innerText = "Exportar Reporte Titán"; btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
