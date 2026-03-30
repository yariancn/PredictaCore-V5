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
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #111827;
                --pc-gray: #4b5563;
                --pc-border: #e5e7eb;
            }

            body { 
                background: #050505; 
                color: #d1d5db; 
                font-family: 'Inter', sans-serif;
                -webkit-font-smoothing: antialiased;
            }

            /* --- INTERFAZ WEB DARK --- */
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; }
            .report-section { border-left: 2px solid #1e293b; padding-left: 2rem; margin-bottom: 4rem; }

            /* --- ESTILO DE IMPRESIÓN EJECUTIVO --- */
            @media print {
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                
                body { 
                    background: #ffffff !important; 
                    color: var(--pc-dark) !important; 
                    padding: 0; 
                }
                
                .no-print { display: none !important; }

                /* Contenedor con Margen Ejecutivo */
                .print-container {
                    padding: 2.5cm 3cm 2.5cm 2.5cm; /* Margen derecho más amplio para la ralla */
                    position: relative;
                }

                /* Ralla de Autoridad Derecha */
                .print-container::after {
                    content: "";
                    position: fixed;
                    right: 1.5cm;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--pc-border);
                    z-index: 10;
                }

                /* Portada Pro */
                .cover-page { 
                    height: 100vh; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center;
                    page-break-after: always;
                    padding-right: 2cm;
                }
                
                .cover-title { 
                    font-size: 3.5rem; 
                    font-weight: 800; 
                    color: var(--pc-dark) !important; 
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                }
                
                .cover-accent { 
                    width: 100px; 
                    height: 8px; 
                    background: var(--pc-green); 
                    margin-bottom: 2.5rem; 
                }

                /* Títulos de Sección: Sin cuadros, con aire */
                .markdown-content h3 { 
                    color: var(--pc-dark) !important;
                    font-size: 1.6rem !important;
                    font-weight: 800 !important;
                    border-bottom: 2px solid var(--pc-dark);
                    padding-bottom: 0.6rem;
                    margin: 3.5rem 0 1.8rem 0 !important;
                    text-transform: uppercase;
                    page-break-after: avoid;
                }

                /* Bloques de Texto */
                .markdown-content p { 
                    font-size: 11pt; 
                    line-height: 1.7; 
                    text-align: justify; 
                    margin-bottom: 1.5rem; 
                    color: #1f2937 !important; 
                }
                
                .markdown-content li { 
                    font-size: 11pt; 
                    line-height: 1.6;
                    margin-bottom: 1rem; 
                }

                /* Tablas: Espaciado Interno Real */
                table { 
                    width: 100%;
                    background: transparent !important; 
                    border: 1px solid var(--pc-border) !important; 
                    margin: 2rem 0; 
                    page-break-inside: auto; 
                }
                
                th { 
                    background: #f3f4f6 !important; 
                    color: var(--pc-dark) !important; 
                    padding: 14px !important;
                    font-weight: 700 !important;
                    font-size: 9pt !important;
                    border-bottom: 2px solid var(--pc-dark) !important;
                }
                
                td { 
                    padding: 12px 14px !important;
                    border-bottom: 1px solid var(--pc-border) !important; 
                    color: #374151 !important; 
                    font-size: 10pt !important; 
                }

                /* Hemorragia: Rojo PredictaCore */
                .hemorragia-critica {
                    background-color: var(--pc-crimson-bg) !important;
                    color: var(--pc-crimson) !important;
                    padding: 3px 10px !important;
                    border-radius: 4px !important;
                    font-weight: 800 !important;
                    border: 1px solid #fecaca !important;
                    display: inline-block;
                }
                
                .report-section { page-break-before: always; }
                #section-INTRO { page-break-before: auto; }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-6xl mx-auto">
            <!-- Header Web -->
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tighter text-white">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                    <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1">Forensic Conversion Intelligence</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border border-emerald-500 text-emerald-500 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                    Generar Reporte Titán
                </button>
            </header>

            <div class="print-container">
                <!-- Portada Impresión -->
                <div class="hidden print:flex cover-page">
                    <div class="text-emerald-500 font-bold uppercase tracking-[0.4em] mb-6">Auditoría Forense de Conversión</div>
                    <div class="cover-accent"></div>
                    <div class="cover-title">PredictaCore<br>Titán Report</div>
                    <div class="text-3xl text-gray-400 font-light mb-16" id="pdf-domain">Análisis de Activo Digital</div>
                    
                    <div class="mt-auto pt-10 border-t-2 border-gray-900 flex justify-between items-end">
                        <div>
                            <div class="text-xs uppercase tracking-widest text-gray-500 mb-1">Classification</div>
                            <div class="font-bold text-gray-900 text-lg">ALTAMENTE CONFIDENCIAL</div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs uppercase tracking-widest text-gray-500 mb-1">Audit Date</div>
                            <div id="pdf-date" class="font-bold text-gray-900 text-lg"></div>
                        </div>
                    </div>
                </div>

                <!-- Contenido Dinámico -->
                <div id="reporte"></div>
            </div>

            <!-- Panel de Control Web -->
            <div class="terminal-box p-10 mt-20 no-print">
                <label class="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4 block">Dossier DNA Input</label>
                <input type="text" id="dna" placeholder="https://dominio.com" class="w-full bg-transparent text-2xl text-white border-b border-zinc-800 pb-4 focus:outline-none focus:border-emerald-500 placeholder-zinc-800 transition-all">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-10 bg-emerald-600 text-white font-bold py-5 px-10 text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all w-full md:w-auto">Ejecutar Simulación Forense</button>
                <div id="status" class="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Esperando secuencia de inicio...</div>
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
                            let textoCelda = celda.trim();
                            const letras = textoCelda.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
                            if (letras.length > 15) {
                                const mayusculas = textoCelda.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
                                if (mayusculas / letras.length > 0.45) { 
                                    return ' ' + textoCelda.charAt(0).toUpperCase() + textoCelda.slice(1).toLowerCase() + ' ';
                                }
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
                    const textoOriginal = td.textContent.trim();
                    const matchNumero = textoOriginal.match(/^(\\d+)(?:\\/10)?$/);
                    if (matchNumero) {
                        const calif = parseInt(matchNumero[1], 10);
                        td.style.fontWeight = '800';
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
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                const btnPdf = document.getElementById('btn-pdf');
                
                btn.disabled = true;
                btnPdf.classList.add('hidden'); 
                reporte.innerHTML = '';
                status.innerText = '>>> INICIANDO PROCESO SIMBIÓPTICO...';
                paintedEtapas.clear();

                const etapas = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

                etapas.forEach(etapa => {
                    const div = document.createElement('div');
                    div.className = 'report-section';
                    div.id = 'section-' + etapa;
                    div.innerHTML = '<div id="content-' + etapa + '" class="text-zinc-700 italic text-xs animate-pulse">Procesando nodo...</div>';
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
                            status.innerText = '>>> AUDITORÍA TITÁN FINALIZADA.';
                            btn.disabled = false;
                            btnPdf.classList.remove('hidden');
                        }
                    }, 4000);
                } catch (e) {
                    status.innerText = '>>> ERROR DE COMUNICACIÓN.';
                    btn.disabled = false;
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
                const sectionDiv = document.getElementById('section-' + etapaId);
                if(!contentDiv) return;

                let textoSuavizado = suavizarMayusculas(content);
                let htmlLimpio = marked.parse(textoSuavizado);
                if(htmlLimpio.includes('table')) htmlLimpio = aplicarSemaforos(htmlLimpio);
                
                htmlLimpio = htmlLimpio.replace(/\\[HEMORRAGIA CRÍTICA\\]/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');
                
                contentDiv.innerHTML = '<div class="markdown-content">' + htmlLimpio + '</div>';
                contentDiv.classList.remove('animate-pulse', 'italic', 'text-xs', 'text-zinc-700');
                contentDiv.classList.add('text-zinc-300');
            }

            async function descargarPDFBackend() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "CRISTALIZANDO PDF...";
                const html = document.documentElement.outerHTML;
                const res = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ html: html })
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'PredictaCore_TITAN_' + document.getElementById('dna').value + '.pdf';
                a.click();
                btn.innerText = "Generar Reporte Titán";
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
