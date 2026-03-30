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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --pc-green: #10b981;
                --pc-gold: #d4af37;
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #0f172a;
                --pc-gray-text: #374151;
                --pc-border: #e5e7eb;
            }

            body { 
                background: #050505; 
                color: #d1d5db; 
                font-family: 'Inter', sans-serif;
                -webkit-font-smoothing: antialiased;
            }

            /* --- INTERFAZ WEB --- */
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; }
            .report-section { border-left: 2px solid #1e293b; padding-left: 2rem; margin-bottom: 5rem; }

            /* --- REGLAS DE IMPRESIÓN TITÁN --- */
            @media print {
                @page { 
                    size: A4; 
                    margin: 1in; /* Margen de 1 pulgada en todos los lados según requerimiento */
                }
                
                body { 
                    background: #ffffff !important; 
                    color: var(--pc-dark) !important; 
                    padding: 0 !important;
                }
                
                .no-print { display: none !important; }

                /* Contenedor Principal: Respiración y Estructura */
                .print-container {
                    position: relative;
                    padding: 0 !important;
                }

                /* Ralla de Autoridad Derecha (Margen de Color) */
                .print-container::after {
                    content: "";
                    position: fixed;
                    right: -0.5in; /* Ajustado para que quede en el borde del papel */
                    top: -1in;
                    bottom: -1in;
                    width: 8px;
                    background: var(--pc-gold);
                    z-index: 100;
                }

                /* Portada Ejecutiva */
                .cover-page { 
                    height: 9in; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center;
                    page-break-after: always;
                }
                
                .cover-title { 
                    font-size: 3.5rem; 
                    font-weight: 800; 
                    color: var(--pc-dark) !important; 
                    margin-bottom: 1.5rem;
                    line-height: 1.1;
                    text-transform: uppercase;
                }
                
                .cover-accent { 
                    width: 100px; 
                    height: 10px; 
                    background: var(--pc-green); 
                    margin-bottom: 3rem; 
                }

                /* Títulos PredictaCore: Sin cuadros negros, con elegancia */
                .markdown-content h3 { 
                    color: var(--pc-dark) !important;
                    font-size: 1.7rem !important;
                    font-weight: 800 !important;
                    border-bottom: 3px solid var(--pc-green);
                    padding-bottom: 0.5rem;
                    margin: 4rem 0 2rem 0 !important;
                    text-transform: uppercase;
                    page-break-after: avoid;
                }

                /* Cuerpo de Texto Ejecutivos (Sin grises claros) */
                .markdown-content p { 
                    font-size: 11pt; 
                    line-height: 1.8; 
                    text-align: justify; 
                    margin-bottom: 1.5rem; 
                    color: var(--pc-dark) !important; /* Texto en negro para máxima legibilidad */
                }
                
                .markdown-content li { 
                    font-size: 11pt; 
                    line-height: 1.7;
                    margin-bottom: 1rem; 
                    color: var(--pc-dark) !important;
                }

                /* Tablas: Eliminación de recuadros negros y mejora de colores */
                table { 
                    width: 100%;
                    background: transparent !important; 
                    border: 1px solid var(--pc-border) !important; 
                    margin: 2rem 0; 
                    page-break-inside: auto; 
                    border-collapse: collapse;
                }
                
                th { 
                    background: var(--pc-dark) !important; 
                    color: #ffffff !important; 
                    padding: 15px !important;
                    font-weight: 700 !important;
                    font-size: 10pt !important;
                    text-transform: uppercase;
                    border: none !important;
                    -webkit-print-color-adjust: exact;
                }
                
                td { 
                    padding: 12px 15px !important;
                    border-bottom: 1px solid var(--pc-border) !important; 
                    color: var(--pc-gray-text) !important; 
                    font-size: 10.5pt !important; 
                    vertical-align: top !important;
                    border-left: none !important;
                    border-right: none !important;
                }

                tr:nth-child(even) td {
                    background: #f9fafb !important;
                    -webkit-print-color-adjust: exact;
                }

                /* Hemorragia: Carmesí Diluido con Borde */
                .hemorragia-critica {
                    background-color: var(--pc-crimson-bg) !important;
                    color: var(--pc-crimson) !important;
                    padding: 4px 10px !important;
                    border-radius: 4px !important;
                    font-weight: 800 !important;
                    border: 1px solid #fecaca !important;
                    display: inline-block;
                    -webkit-print-color-adjust: exact;
                }
                
                .report-section { 
                    page-break-before: always; 
                    border: none !important;
                    padding: 0 !important;
                }
                #section-INTRO { page-break-before: avoid; }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-6xl mx-auto">
            <header class="mb-20 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-4xl font-extrabold tracking-tighter text-white">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                    <p class="text-zinc-500 text-xs uppercase tracking-[0.4em] mt-2">Surgical Conversion Intelligence</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border-2 border-emerald-500 text-emerald-500 px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all rounded-full">
                    Exportar Reporte Titán
                </button>
            </header>

            <div class="print-container">
                <div class="hidden print:flex cover-page">
                    <div class="text-emerald-500 font-bold uppercase tracking-[0.5em] mb-8">Auditoría Forense de Conversión</div>
                    <div class="cover-accent"></div>
                    <div class="cover-title">PredictaCore<br>Titán Intelligence</div>
                    <div class="text-3xl text-gray-400 font-light mb-20" id="pdf-domain">Análisis de Activo Digital</div>
                    
                    <div class="mt-auto pt-12 border-t-2 border-gray-900 flex justify-between items-end">
                        <div>
                            <div class="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Classification</div>
                            <div class="font-bold text-gray-900 text-xl uppercase">Altamente Confidencial</div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Issue Date</div>
                            <div id="pdf-date" class="font-bold text-gray-900 text-xl"></div>
                        </div>
                    </div>
                </div>
                <div id="reporte"></div>
            </div>

            <div class="terminal-box p-12 mt-24 no-print">
                <span class="text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-6 block font-bold">Inyectar Dossier DNA</span>
                <input type="text" id="dna" placeholder="https://activo-analizado.com" class="w-full bg-transparent text-3xl text-white border-b-2 border-zinc-800 pb-4 focus:outline-none focus:border-emerald-500 placeholder-zinc-800 transition-all font-light">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-12 bg-emerald-600 text-white font-bold py-6 px-12 text-xs uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all w-full md:w-auto rounded-lg">Ejecutar Simulación Forense</button>
                <div id="status" class="mt-10 text-[11px] text-zinc-600 uppercase tracking-widest font-mono">Esperando secuencia de inicio...</div>
            </div>
        </div>

        <script>
            document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            function suavizarMayusculas(texto) {
                const lineas = texto.split('\\n');
                return lineas.map(linea => {
                    if (linea.startsWith('###')) return linea; 
                    if (linea.trim().startsWith('|')) {
                        let celdas = linea.split('|');
                        celdas = celdas.map(celda => {
                            let tc = celda.trim();
                            const le = tc.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
                            if (le.length > 15) {
                                const ma = tc.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
                                if (ma / le.length > 0.45) return ' ' + tc.charAt(0).toUpperCase() + tc.slice(1).toLowerCase() + ' ';
                            }
                            return celda;
                        });
                        return celdas.join('|');
                    }
                    return linea;
                }).join('\\n');
            }

            function aplicarSemaforos(htmlContent) {
                const div = document.createElement('div');
                div.innerHTML = htmlContent;
                const celdas = div.querySelectorAll('td');
                celdas.forEach(td => {
                    const to = td.textContent.trim();
                    const mn = to.match(/^(\\d+)(?:\\/10)?$/);
                    if (mn) {
                        const calif = parseInt(mn[1], 10);
                        td.style.fontWeight = '900';
                        if (calif <= 5) td.style.color = '#ef4444';
                        else if (calif <= 7) td.style.color = '#f59e0b';
                        else td.style.color = '#10b981';
                    }
                });
                return div.innerHTML;
            }

            let paintedEtapas = new Set();
            let pollingInterval = null;

            async function ejecutar() {
                const dna = document.getElementById('dna').value;
                if (!dna) return;
                document.getElementById('pdf-domain').innerText = 'Analysis: ' + dna;
                const btn = document.getElementById('btn-ejecutar');
                const btnPdf = document.getElementById('btn-pdf');
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                btn.disabled = true;
                btnPdf.classList.add('hidden'); 
                reporte.innerHTML = '';
                status.innerText = '>>> ESTABLECIENDO CONEXIÓN SIMBIÓPTICA...';
                paintedEtapas.clear();

                const etapas = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
                etapas.forEach(etapa => {
                    const div = document.createElement('div');
                    div.id = 'section-' + etapa;
                    div.innerHTML = '<div id="content-' + etapa + '" class="text-zinc-700 italic text-xs animate-pulse">Procesando nodo forense...</div>';
                    reporte.appendChild(div);
                });

                try {
                    const res = await fetch('/start', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ dna: dna })
                    });
                    const data = await res.json();
                    pollingInterval = setInterval(async () => {
                        const poll = await fetch('/poll?jobId=' + encodeURIComponent(data.jobId));
                        const info = await poll.json();
                        for (const eid in info.progress) {
                            if (!paintedEtapas.has(eid)) {
                                pintarSeccion(eid, info.progress[eid]);
                                paintedEtapas.add(eid);
                            }
                        }
                        if (info.status === 'done') {
                            clearInterval(pollingInterval);
                            status.innerText = '>>> AUDITORÍA TITÁN SELLADA.';
                            btn.disabled = false;
                            btnPdf.classList.remove('hidden');
                        }
                    }, 4000);
                } catch (e) {
                    status.innerText = '>>> ERROR DE ENLACE.';
                    btn.disabled = false;
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
                if(!contentDiv) return;
                let ts = suavizarMayusculas(content);
                let hl = marked.parse(ts);
                if(hl.includes('table')) hl = aplicarSemaforos(hl);
                hl = hl.replace(/\\[HEMORRAGIA CRÍTICA\\]/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');
                contentDiv.innerHTML = '<div class="markdown-content">' + hl + '</div>';
                contentDiv.classList.remove('animate-pulse', 'italic', 'text-xs', 'text-zinc-700');
                contentDiv.classList.add('text-zinc-300');
            }

            async function descargarPDFBackend() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "CRISTALIZANDO TITÁN...";
                btn.disabled = true;
                const html = document.documentElement.outerHTML;
                try {
                    const res = await fetch('/generate-pdf', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ html: html })
                    });
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'PREDICTACORE_TITAN_REPORT.pdf';
                    a.click();
                } catch (e) {
                    alert("Error al cristalizar el documento.");
                } finally {
                    btn.innerText = "Exportar Reporte Titán";
                    btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
