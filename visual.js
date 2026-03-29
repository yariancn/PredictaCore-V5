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
            /* --- VARIABLES DE IDENTIDAD TITÁN --- */
            :root {
                --black-core: #0A0A0A;
                --green-electric: #39FF14;
                --text-main: #a1a1aa;
                --bg-dark: #050505;
                --alerta-suave-text: #991B1B;
                --alerta-suave-bg: #FEE2E2;
            }

            body { background: var(--bg-dark); color: var(--text-main); font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: var(--green-electric) !important; }
            
            /* --- TABLAS IDENTIDAD --- */
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; border: 1px solid #27272a; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: var(--black-core); color: var(--green-electric); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            
            .badge-red { color: #f87171; font-weight: 800; font-size: 1.2rem;}
            .badge-yellow { color: #facc15; font-weight: 800; font-size: 1.2rem;}
            .badge-green { color: var(--green-electric); font-weight: 800; font-size: 1.2rem;}
            
            /* --- TITULARES Y MARKDOWN --- */
            .markdown-content h1, .markdown-content h2, .markdown-content h3 { 
                color: #FFFFFF; 
                background: var(--black-core); 
                padding: 10px 15px; 
                border-left: 4px solid var(--green-electric);
                margin-top: 2rem; 
                margin-bottom: 1rem; 
                font-weight: 800; 
                text-transform: uppercase;
            }
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            /* --- HEMORRAGIAS (Visual Web) --- */
            .hemorragia-critica { 
                background-color: var(--alerta-suave-bg); 
                color: var(--alerta-suave-text); 
                font-weight: 900; 
                padding: 2px 8px; 
                border-radius: 4px; 
                display: inline-block; 
                border: 1px solid var(--alerta-suave-text);
            }

            /* --- REGLAS EXCLUSIVAS DE IMPRESIÓN PDF --- */
            @media print {
                @page { size: A4; margin: 2.5cm 2cm 2.5cm 2cm; }
                
                body { background: #ffffff !important; color: #1F2937 !important; font-size: 11pt; line-height: 1.65; }
                .no-print { display: none !important; }
                
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; color: var(--black-core) !important; }
                .cover-title { font-size: 2.5rem; font-weight: 900; border-bottom: 4px solid var(--black-core); padding-bottom: 1rem; margin-bottom: 2rem; }
                
                .report-section { page-break-before: always; border-left: none !important; padding-left: 0; }
                
                .markdown-content h3 { 
                    background-color: var(--black-core) !important; 
                    color: #FFFFFF !important; 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                table { background: transparent !important; border: 1px solid #E5E7EB !important; page-break-inside: auto; }
                th { 
                    background-color: var(--black-core) !important; 
                    color: var(--green-electric) !important; 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                td { background: #FFFFFF !important; color: #1F2937 !important; border: 1px solid #E5E7EB !important; }
                tr:nth-child(even) td { background-color: #F9FAFB !important; }

                .hemorragia-critica {
                    background-color: var(--alerta-suave-bg) !important;
                    color: var(--alerta-suave-text) !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        
        <div class="hidden print:block fixed top-0 right-0 pt-4 pr-8 z-50">
            <span style="font-weight: 900; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 2px solid var(--black-core); padding-bottom: 2px; color: black;">
                PREDICTACORE TITÁN
            </span>
        </div>

        <div class="max-w-4xl mx-auto">
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="italic" style="color: var(--green-electric)">TITÁN</span></h1>
                    <p class="text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.3em]">Auditoría Forense de Conversión</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border border-[#39FF14] text-[#39FF14] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-colors duration-300">
                    Exportar PDF
                </button>
            </header>

            <div class="hidden print:flex cover-page">
                <div>
                    <div class="text-xl font-bold mb-4 uppercase tracking-widest">Reporte Forense de Conversión</div>
                    <div class="cover-title uppercase">Auditoría PredictaCore</div>
                    <div class="text-lg mb-8 font-bold" id="pdf-domain">Documento Estratégico</div>
                </div>
                <div class="mt-auto flex justify-between w-full border-top pt-4 border-black">
                    <span class="font-bold">CLASIFICACIÓN: CONFIDENCIAL</span>
                    <span id="pdf-date" class="font-bold text-black"></span>
                </div>
            </div>

            <div class="terminal-box p-6 mb-12 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio o activo..." class="w-full bg-transparent text-white border-b border-zinc-800 p-2 focus:outline-none focus:border-green-500 placeholder-zinc-700">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-6 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-[#39FF14] transition-all w-full">Ejecutar Auditoría</button>
            </div>
            
            <div id="status" class="text-[10px] tracking-[0.3em] text-zinc-500 mb-8 uppercase no-print"></div>
            <div id="reporte" class="space-y-4"></div>
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
                        if (calif <= 5) td.style.color = '#f87171';
                        else if (calif <= 7) td.style.color = '#facc15';
                        else td.style.color = '#39FF14';
                        td.style.fontWeight = '800';
                    }
                });
                return div.innerHTML;
            }

            let pollingInterval = null;
            let paintedEtapas = new Set();

            async function ejecutar() {
                const dna = document.getElementById('dna').value;
                if (!dna) return;
                document.getElementById('pdf-domain').innerText = 'Activo analizado: ' + dna;
                const btn = document.getElementById('btn-ejecutar');
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                const btnPdf = document.getElementById('btn-pdf');
                btn.disabled = true;
                btnPdf.classList.add('hidden'); 
                reporte.innerHTML = '';
                status.innerText = 'CONECTANDO CON EL MOTOR AUTÓNOMO...';
                paintedEtapas.clear();
                if (pollingInterval) clearInterval(pollingInterval);

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
                    {id: 'OMNI', title: 'XI. Autoridad y Hoja de Ruta'}
                ];

                etapas.forEach(etapa => {
                    const div = document.createElement('div');
                    div.className = 'report-section animate-pulse';
                    div.id = 'section-' + etapa.id;
                    div.innerHTML = '<div id="content-' + etapa.id + '" class="markdown-content text-zinc-400 font-light italic">Procesando nodo...</div>';
                    reporte.appendChild(div);
                });

                try {
                    const startRes = await fetch('/start', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ dna: dna })
                    });
                    const startData = await startRes.json();
                    const jobId = startData.jobId;
                    status.innerText = 'AUDITORÍA CORRIENDO EN SEGUNDO PLANO...';

                    pollingInterval = setInterval(async () => {
                        const pollRes = await fetch('/poll?jobId=' + encodeURIComponent(jobId));
                        const jobInfo = await pollRes.json();
                        for (const etapaId in jobInfo.progress) {
                            if (!paintedEtapas.has(etapaId)) {
                                pintarSeccion(etapaId, jobInfo.progress[etapaId]);
                                paintedEtapas.add(etapaId);
                            }
                        }
                        if (jobInfo.status === 'done') {
                            clearInterval(pollingInterval);
                            status.innerText = 'AUDITORÍA FINALIZADA.';
                            btn.disabled = false;
                            btnPdf.classList.remove('hidden');
                        }
                    }, 5000);
                } catch (e) {
                    btn.disabled = false;
                    status.innerText = 'FALLO DE CONEXIÓN.';
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
                const sectionDiv = document.getElementById('section-' + etapaId);
                if(!contentDiv) return;
                sectionDiv.classList.remove('animate-pulse');
                sectionDiv.style.borderColor = 'var(--green-electric)';
                let textoSuavizado = suavizarMayusculas(content);
                let htmlLimpio = marked.parse(textoSuavizado);
                if(htmlLimpio.includes('table')) htmlLimpio = aplicarSemaforos(htmlLimpio);
                htmlLimpio = htmlLimpio.replace(/\\[HEMORRAGIA CRÍTICA\\]/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');
                contentDiv.innerHTML = htmlLimpio;
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }

            async function descargarPDFBackend() {
                const htmlContent = document.documentElement.outerHTML;
                const response = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html: htmlContent })
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'PredictaCore_Auditoria.pdf';
                a.click();
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
