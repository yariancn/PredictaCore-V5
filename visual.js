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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --pc-green: #10b981; /* Verde esmeralda digital, elegante y moderno */
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #111827;
                --pc-gray: #6b7280;
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
            .gold-text { color: var(--pc-green); }
            
            .report-section { 
                border-left: 2px solid #1e293b; 
                padding-left: 2rem; 
                margin-bottom: 4rem; 
                transition: all 0.5s; 
            }
            .border-pc { border-color: var(--pc-green) !important; }

            /* --- TABLAS WEB --- */
            table { width: 100%; border-collapse: collapse; margin: 2rem 0; background: #0f172a; border-radius: 8px; overflow: hidden; }
            th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #1e293b; }
            th { background: #1e293b; color: var(--pc-green); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }

            /* --- ESTILO DE IMPRESIÓN EJECUTIVO --- */
            @media print {
                @page { size: A4; margin: 0; }
                
                body { background: #ffffff !important; color: var(--pc-dark) !important; padding: 0; }
                .no-print { display: none !important; }

                /* Contenedor Principal con Margen Derecho (Ralla) */
                .print-container {
                    padding: 3cm 2cm 2cm 2.5cm;
                    position: relative;
                    min-height: 297mm;
                }

                /* La Ralla de la Derecha Estilo PredictaCore */
                .print-container::after {
                    content: "";
                    position: fixed;
                    right: 1.5cm;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--pc-border);
                    z-index: -1;
                }

                /* Portada Pro */
                .cover-page { 
                    height: 100vh; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center;
                    page-break-after: always;
                    padding-right: 3rem;
                }
                .cover-title { font-size: 3.5rem; font-weight: 800; line-height: 1; color: var(--pc-dark) !important; margin-bottom: 1rem; }
                .cover-accent { width: 80px; height: 6px; background: var(--pc-green); margin-bottom: 2rem; }

                /* Títulos de Sección: Limpios, sin cuadros negros */
                .markdown-content h3 { 
                    color: var(--pc-dark) !important;
                    font-size: 1.5rem !important;
                    font-weight: 800 !important;
                    border-bottom: 1px solid var(--pc-dark);
                    padding-bottom: 0.5rem;
                    margin: 2.5rem 0 1.5rem 0 !important;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    page-break-after: avoid;
                }

                /* Texto */
                .markdown-content p { font-size: 11pt; line-height: 1.6; text-align: justify; margin-bottom: 1.2rem; color: #374151 !important; }
                .markdown-content li { font-size: 11pt; margin-bottom: 0.8rem; }

                /* Tablas Ejecutivas: Modernas */
                table { background: transparent !important; border: 1px solid var(--pc-border) !important; border-radius: 0; margin: 1.5rem 0; page-break-inside: auto; }
                th { background: #f9fafb !important; color: var(--pc-dark) !important; border-bottom: 2px solid var(--pc-dark) !important; font-size: 9pt !important; }
                td { border-bottom: 1px solid var(--pc-border) !important; color: #4b5563 !important; font-size: 10pt !important; background: transparent !important; }
                tr:nth-child(even) { background: #fcfcfc !important; }
                tr { page-break-inside: avoid; }

                /* Hemorragia: Rojo Diluido Elegant */
                .hemorragia-critica {
                    background-color: var(--pc-crimson-bg) !important;
                    color: var(--pc-crimson) !important;
                    padding: 2px 8px !important;
                    border-radius: 4px !important;
                    font-weight: 700 !important;
                    border: 1px solid #fecaca !important;
                }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        
        <div class="max-w-5xl mx-auto">
            <!-- Header Web -->
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tighter text-white">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                    <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1">Surgical Conversion Audit</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border border-emerald-500 text-emerald-500 px-8 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                    Exportar PDF Titán
                </button>
            </header>

            <div class="print-container">
                <!-- Portada Impresión -->
                <div class="hidden print:flex cover-page">
                    <div class="text-emerald-500 font-bold uppercase tracking-[0.3em] mb-4">Forensic Conversion Report</div>
                    <div class="cover-accent"></div>
                    <div class="cover-title">Auditoría<br>PredictaCore</div>
                    <div class="text-2xl text-gray-500 mb-12" id="pdf-domain">Asset Analysis</div>
                    
                    <div class="mt-auto pt-8 border-t border-gray-200 flex justify-between items-end">
                        <div>
                            <div class="text-xs uppercase tracking-widest text-gray-400">Classification</div>
                            <div class="font-bold text-gray-900">CONFIDENCIAL / TITÁN</div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs uppercase tracking-widest text-gray-400">Date Issued</div>
                            <div id="pdf-date" class="font-bold text-gray-900"></div>
                        </div>
                    </div>
                </div>

                <!-- Contenido del Reporte -->
                <div id="reporte" class="space-y-12"></div>
            </div>

            <!-- Input Web -->
            <div class="terminal-box p-8 mt-12 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio (ej. google.com)..." class="w-full bg-transparent text-xl text-white border-b border-zinc-800 pb-2 focus:outline-none focus:border-emerald-500 placeholder-zinc-700 font-light">
                <div class="flex gap-4">
                    <button onclick="ejecutar()" id="btn-ejecutar" class="mt-8 bg-emerald-600 text-white font-bold py-4 px-8 text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex-1">Iniciar Escaneo Forense</button>
                </div>
                <div id="status" class="mt-6 text-[10px] text-zinc-500 uppercase tracking-widest">Esperando instrucciones...</div>
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
                status.innerText = '>>> Estableciendo conexión simbióptica...';
                paintedEtapas.clear();

                const etapas = [
                    {id: 'INTRO', title: 'I. Diagnóstico de Ingeniería'},
                    {id: 'GEMELOS', title: 'II. Perfiles Psicológicos'},
                    {id: 'SCORECARD', title: 'III. Scorecard PredictaCore'},
                    {id: 'VISIBILIDAD', title: 'IV. Visibilidad Externa'},
                    {id: 'BENCHMARK', title: 'V. Benchmarking Local'},
                    {id: 'SWOT', title: 'VI. Matriz Estratégica'},
                    {id: 'WISHLIST', title: 'VII. Lista de Deseos'},
                    {id: 'FUGAS', title: 'VIII. 15 Fugas de Capital'},
                    {id: 'ACCIONES', title: 'IX. 15 Acciones Tácticas'},
                    {id: 'HERRAMIENTAS', title: 'X. Herramientas de Escala'},
                    {id: 'OMNI', title: 'XI. Hoja de Ruta Ejecutiva'}
                ];

                etapas.forEach(etapa => {
                    const div = document.createElement('div');
                    div.className = 'report-section';
                    div.id = 'section-' + etapa.id;
                    div.innerHTML = '<div id="content-' + etapa.id + '" class="text-zinc-600 italic text-xs animate-pulse">Procesando nodo...</div>';
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
                            status.innerText = '>>> Auditoría completada.';
                            btn.disabled = false;
                            btnPdf.classList.remove('hidden');
                        }
                    }, 4000);
                } catch (e) {
                    status.innerText = '>>> Error de red.';
                    btn.disabled = false;
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
                const sectionDiv = document.getElementById('section-' + etapaId);
                if(!contentDiv) return;

                sectionDiv.classList.add('border-pc');
                let textoSuavizado = suavizarMayusculas(content);
                let htmlLimpio = marked.parse(textoSuavizado);
                if(htmlLimpio.includes('table')) htmlLimpio = aplicarSemaforos(htmlLimpio);
                
                htmlLimpio = htmlLimpio.replace(/\\[HEMORRAGIA CRÍTICA\\]/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');
                
                contentDiv.innerHTML = '<div class="markdown-content">' + htmlLimpio + '</div>';
                contentDiv.classList.remove('animate-pulse', 'italic', 'text-xs', 'text-zinc-600');
                contentDiv.classList.add('text-zinc-300');
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }

            async function descargarPDFBackend() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "Preparando PDF...";
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
                a.download = 'PredictaCore_Auditoria_' + document.getElementById('dna').value + '.pdf';
                a.click();
                btn.innerText = "Exportar PDF Titán";
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
