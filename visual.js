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
                --pc-green: #10b981; /* Verde esmeralda digital */
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #0f172a;
                --pc-gray: #4b5563;
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

            /* --- REGLAS DE IMPRESIÓN TITÁN (ALTA GAMA) --- */
            @media print {
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                
                body { 
                    background: #ffffff !important; 
                    color: var(--pc-dark) !important; 
                    padding: 0 !important; 
                }
                
                .no-print { display: none !important; }

                /* Contenedor Principal: Respiración y Estructura */
                .print-container {
                    padding: 3cm 3.5cm 3cm 3cm !important;
                    position: relative;
                }

                /* La Ralla de Autoridad Derecha */
                .print-container::after {
                    content: "";
                    position: fixed;
                    right: 1.8cm;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: #f1f5f9;
                    z-index: 5;
                }

                /* Portada Ejecutiva */
                .cover-page { 
                    height: 100vh; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center;
                    page-break-after: always;
                    padding-right: 4cm;
                }
                
                .cover-title { 
                    font-size: 3.8rem; 
                    font-weight: 800; 
                    color: var(--pc-dark) !important; 
                    margin-bottom: 1.5rem;
                    line-height: 1;
                    text-transform: uppercase;
                    letter-spacing: -0.04em;
                }
                
                .cover-accent { 
                    width: 120px; 
                    height: 10px; 
                    background: var(--pc-green); 
                    margin-bottom: 3rem; 
                }

                /* Títulos PredictaCore: Elegantes y Legibles */
                .markdown-content h3 { 
                    color: var(--pc-dark) !important;
                    font-size: 1.8rem !important;
                    font-weight: 800 !important;
                    border-bottom: 3px solid var(--pc-dark);
                    padding-bottom: 0.8rem;
                    margin: 4.5rem 0 2rem 0 !important;
                    text-transform: uppercase;
                    page-break-after: avoid;
                    letter-spacing: -0.02em;
                }

                /* Cuerpo de Texto Forense */
                .markdown-content p { 
                    font-size: 11.5pt; 
                    line-height: 1.8; 
                    text-align: justify; 
                    margin-bottom: 1.8rem; 
                    color: #1e293b !important; 
                }
                
                .markdown-content li { 
                    font-size: 11.5pt; 
                    line-height: 1.7;
                    margin-bottom: 1.2rem; 
                }

                /* Tablas: Identidad Recuperada */
                table { 
                    width: 100%;
                    background: transparent !important; 
                    border: 1px solid var(--pc-border) !important; 
                    margin: 2.5rem 0; 
                    page-break-inside: auto; 
                }
                
                th { 
                    background: var(--pc-dark) !important; 
                    color: var(--pc-green) !important; 
                    padding: 18px !important;
                    font-weight: 700 !important;
                    font-size: 9.5pt !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: none !important;
                    -webkit-print-color-adjust: exact;
                }
                
                td { 
                    padding: 14px 18px !important;
                    border-bottom: 1px solid var(--pc-border) !important; 
                    color: #334155 !important; 
                    font-size: 10.5pt !important; 
                    vertical-align: top !important;
                }

                tr:nth-child(even) td {
                    background: #f8fafc !important;
                    -webkit-print-color-adjust: exact;
                }

                /* Alerta de Hemorragia: Carmesí Diluido */
                .hemorragia-critica {
                    background-color: var(--pc-crimson-bg) !important;
                    color: var(--pc-crimson) !important;
                    padding: 4px 12px !important;
                    border-radius: 6px !important;
                    font-weight: 800 !important;
                    border: 1px solid #fecaca !important;
                    display: inline-block;
                    -webkit-print-color-adjust: exact;
                }
                
                .report-section { page-break-before: always; }
                #section-INTRO { page-break-before: auto; }
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
                <!-- Portada Impresión -->
                <div class="hidden print:flex cover-page">
                    <div class="text-emerald-500 font-bold uppercase tracking-[0.5em] mb-8">Auditoría Forense de Conversión</div>
                    <div class="cover-accent"></div>
                    <div class="cover-title">PredictaCore<br>Titán Intelligence</div>
                    <div class="text-3xl text-gray-400 font-light mb-20" id="pdf-domain">Asset Analysis</div>
                    
                    <div class="mt-auto pt-12 border-t-4 border-gray-900 flex justify-between items-end">
                        <div>
                            <div class="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Classification</div>
                            <div class="font-bold text-gray-900 text-xl">ALTAMENTE CONFIDENCIAL</div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Issue Date</div>
                            <div id="pdf-date" class="font-bold text-gray-900 text-xl"></div>
                        </div>
                    </div>
                </div>

                <!-- Contenido Dinámico -->
                <div id="reporte"></div>
            </div>

            <!-- Panel de Entrada Web -->
            <div class="terminal-box p-12 mt-24 no-print">
                <span class="text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-6 block font-bold">Inyectar Dossier DNA</span>
                <input type="text" id="dna" placeholder="https://activo-analizado.com" class="w-full bg-transparent text-3xl text-white border-b-2 border-zinc-800 pb-4 focus:outline-none focus:border-emerald-500 placeholder-zinc-800 transition-all font-light">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-12 bg-emerald-600 text-white font-bold py-6 px-12 text-xs uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all w-full md:w-auto rounded-lg shadow-2xl shadow-emerald-900/20">Ejecutar Simulación Forense</button>
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
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                const btnPdf = document.getElementById('btn-pdf');
                
                btn.disabled = true;
                btnPdf.classList.add('hidden'); 
                reporte.innerHTML = '';
                status.innerText = '>>> ESTABLECIENDO CONEXIÓN SIMBIÓPTICA...';
                paintedEtapas.clear();

                const etapas = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

                etapas.forEach(etapa => {
                    const div = document.createElement('div');
                    div.className = 'report-section';
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
                    status.innerText = '>>> ERROR CRÍTICO DE ENLACE.';
                    btn.disabled = false;
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
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
                btn.innerText = "CRISTALIZANDO TITÁN...";
                const html = document.documentElement.outerHTML;
                const res = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ html: html })
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'PREDICTACORE_TITAN_' + document.getElementById('dna').value + '.pdf';
                a.click();
                btn.innerText = "Exportar Reporte Titán";
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
