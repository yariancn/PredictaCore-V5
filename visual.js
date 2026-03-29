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
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: #18181b; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            
            .badge-red { color: #f87171; font-weight: 800; font-size: 1.2rem;}
            .badge-yellow { color: #facc15; font-weight: 800; font-size: 1.2rem;}
            .badge-green { color: #4ade80; font-weight: 800; font-size: 1.2rem;}
            
            .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #e4e4e7; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; }
            .markdown-content h3 { font-size: 1.1rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; }
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; }
            .markdown-content ul { list-style-type: disc; }
            .markdown-content ol { list-style-type: decimal; }
            .markdown-content li { margin-bottom: 0.8rem; line-height: 1.6; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            /* HEMORRAGIA WEB */
            .hemorragia-critica { background-color: rgba(248, 113, 113, 0.2); color: #f87171; font-weight: 900; padding: 2px 6px; border-radius: 4px; display: inline-block; }

            /* REGLAS AGRESIVAS DE IMPRESIÓN PARA EL FORMATO TITÁN EJECUTIVO */
            @media print {
                @page { size: A4; margin: 2.5cm 2cm 2.5cm 2cm; }
                
                :root {
                    --black-core: #0A0A0A;
                    --green-electric: #39FF14;
                    --text-main: #1F2937;
                    --bg-light: #F9FAFB;
                    --alerta-suave-text: #991B1B; /* Rojo diluido y elegante */
                    --alerta-suave-bg: #FEE2E2; /* Fondo tenue para resaltar sin gritar */
                }
                
                body { background: #ffffff !important; color: var(--text-main) !important; font-size: 11pt; font-weight: 400; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.65; }
                .no-print { display: none !important; }
                
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid var(--black-core); padding-bottom: 1rem; margin-bottom: 2rem; color: var(--black-core) !important; }
                .cover-subtitle { font-size: 1.25rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: var(--black-core) !important; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; font-weight: bold; border-top: 2px solid var(--black-core); padding-top: 1rem; color: var(--black-core) !important; }
                
                .report-section { page-break-before: always; border-left: none !important; padding-left: 0; margin-bottom: 2.5rem; padding-top: 0; }
                #section-INTRO { page-break-before: auto; }

                .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: 800; page-break-after: avoid; }
                
                /* TÍTULOS EJECUTIVOS: FONDO NEGRO, ACENTO VERDE ELÉCTRICO, LETRA BLANCA */
                .markdown-content h3 { 
                    background-color: var(--black-core) !important; 
                    color: #FFFFFF !important; 
                    padding: 12px 20px !important; 
                    border-left: 6px solid var(--green-electric) !important; 
                    margin-top: 30px !important; 
                    margin-bottom: 20px !important; 
                    font-size: 13pt !important; 
                    text-transform: uppercase !important; 
                    letter-spacing: 0.5px !important;
                    border-bottom: none !important;
                }
                
                .markdown-content p { line-height: 1.65; text-align: justify; orphans: 3; widows: 3; margin-bottom: 18px; color: var(--text-main) !important; }
                .markdown-content li { line-height: 1.65; text-align: justify; margin-bottom: 12px; page-break-inside: avoid; color: var(--text-main) !important; }
                .markdown-content strong { font-weight: 800; color: var(--black-core) !important; }
                
                /* TABLAS EJECUTIVAS */
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px; background: transparent !important; border: none !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                tr { page-break-inside: avoid !important; page-break-after: auto; border-bottom: 1px solid #E5E7EB !important; }
                tr:nth-child(even) td { background-color: var(--bg-light) !important; }
                td, th { page-break-inside: avoid !important; }
                th { background-color: var(--black-core) !important; color: var(--green-electric) !important; padding: 14px !important; text-align: left !important; font-weight: 600 !important; text-transform: uppercase !important; border: none !important; }
                td { border: none !important; padding: 12px 14px !important; vertical-align: top !important; font-size: 10.5pt; color: var(--text-main) !important; }
                
                .badge-red { font-weight: 900; text-decoration: underline; color: var(--black-core) !important; }
                .badge-yellow { font-weight: 800; color: var(--black-core) !important; }
                .badge-green { font-weight: bold; color: var(--black-core) !important; }

                /* ETIQUETA HEMORRAGIA CRÍTICA IMPRESIÓN (Rojo Diluido) */
                .hemorragia-critica {
                    background-color: var(--alerta-suave-bg) !important;
                    color: var(--alerta-suave-text) !important;
                    font-weight: 900 !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                    display: inline-block;
                }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        
        <div class="hidden print:block fixed top-0 right-0 pt-4 pr-8 z-50">
            <img src="https://predictacore.com/tu-logo.png" alt="PredictaCore" style="height: 40px; width: auto;" onerror="this.style.display='none';">
            <span style="font-weight: 900; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 2px solid #000000; padding-bottom: 2px;">
                PREDICTACORE TITÁN
            </span>
        </div>

        <div class="max-w-4xl mx-auto">
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                    <p class="text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.3em]">Auditoría Forense de Conversión</p>
                </div>
                <button id="btn-pdf" onclick="descargarPDFBackend()" class="hidden border border-[#d4af37] text-[#d4af37] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors duration-300">
                    Exportar PDF
                </button>
            </header>

            <div class="hidden print:flex cover-page">
                <div>
                    <div class="cover-subtitle mb-4">Reporte Forense de Conversión</div>
                    <div class="cover-title">Auditoría PredictaCore</div>
                    <div class="text-lg mb-8 font-bold" id="pdf-domain">Documento Estratégico</div>
                </div>
                <div class="cover-meta flex justify-between w-full">
                    <span class="font-bold">CLASIFICACIÓN: CONFIDENCIAL</span>
                    <span id="pdf-date" class="font-bold"></span>
                </div>
            </div>

            <div class="terminal-box p-6 mb-12 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio o activo..." class="w-full bg-transparent text-white border-b border-zinc-800 p-2 focus:outline-none focus:border-gold placeholder-zinc-700">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-6 bg-zinc-900 text-gold-text border border-zinc-800 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold transition-all w-full">Ejecutar Auditoría</button>
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
                    const letras = linea.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
                    if (letras.length > 20) {
                        const mayusculas = linea.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
                        if (mayusculas / letras.length > 0.45) {
                            return linea.charAt(0).toUpperCase() + linea.slice(1).toLowerCase();
                        }
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
                        if (calif <= 5) td.innerHTML = '<span class="badge-red">' + td.innerHTML + '</span>';
                        else if (calif <= 7) td.innerHTML = '<span class="badge-yellow">' + td.innerHTML + '</span>';
                        else td.innerHTML = '<span class="badge-green">' + td.innerHTML + '</span>';
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
                    div.innerHTML = '<h3 id="load-title-' + etapa.id + '" class="text-zinc-600 text-[10px] tracking-[0.5em] mb-4 uppercase no-print">' + etapa.title + '</h3>' +
                                     '<div id="content-' + etapa.id + '" class="markdown-content text-zinc-400 font-light italic">En cola de procesamiento...</div>';
                    reporte.appendChild(div);
                });

                try {
                    const startRes = await fetch('/start', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ dna: dna })
                    });
                    
                    const startData = await startRes.json();
                    
                    if (!startRes.ok) {
                        throw new Error(startData.error || "Error al iniciar auditoría");
                    }
                    
                    const jobId = startData.jobId;

                    status.innerText = 'AUDITORÍA CORRIENDO EN SEGUNDO PLANO (PUEDES CAMBIAR DE PESTAÑA)';

                    pollingInterval = setInterval(async () => {
                        try {
                            const pollRes = await fetch('/poll?jobId=' + encodeURIComponent(jobId));
                            const jobInfo = await pollRes.json();

                            if (jobInfo.status === 'not_found') return;

                            for (const etapaId in jobInfo.progress) {
                                if (!paintedEtapas.has(etapaId)) {
                                    pintarSeccion(etapaId, jobInfo.progress[etapaId]);
                                    paintedEtapas.add(etapaId);
                                }
                            }

                            if (jobInfo.currentEtapa && !paintedEtapas.has(jobInfo.currentEtapa)) {
                                const contentDiv = document.getElementById('content-' + jobInfo.currentEtapa);
                                if (contentDiv && contentDiv.innerText === 'En cola de procesamiento...') {
                                     contentDiv.innerText = 'Analizando nodos...';
                                }
                            }

                            if (jobInfo.status === 'done' || jobInfo.status === 'error') {
                                clearInterval(pollingInterval);
                                status.innerText = jobInfo.status === 'done' ? 'AUDITORÍA FINALIZADA. LISTO PARA EXPORTACIÓN EJECUTIVA.' : 'ERROR CRÍTICO: FALLO EN MOTOR DE FONDO.';
                                btn.disabled = false;
                                if(jobInfo.status === 'done') btnPdf.classList.remove('hidden');

                                etapas.forEach(etapa => {
                                    const sectionDiv = document.getElementById('section-' + etapa.id);
                                    if(sectionDiv) sectionDiv.classList.remove('animate-pulse');
                                });
                            }
                        } catch (e) {
                            console.error("Error en el radar de actualización:", e);
                        }
                    }, 5000);

                } catch (e) {
                    console.error("Fallo al iniciar el servidor:", e);
                    if (e.message.includes('ERR_NAME_NOT_RESOLVED')) {
                        status.innerText = 'ERROR CRÍTICO: EL DOMINIO INGRESADO NO EXISTE O NO ES ACCESIBLE.';
                    } else {
                        status.innerText = 'ERROR DE CONEXIÓN CON EL MOTOR.';
                    }
                    btn.disabled = false;
                    reporte.innerHTML = ''; 
                }
            }

            function pintarSeccion(etapaId, content) {
                const contentDiv = document.getElementById('content-' + etapaId);
                const sectionDiv = document.getElementById('section-' + etapaId);
                const loadTitle = document.getElementById('load-title-' + etapaId);

                if(!contentDiv || !sectionDiv) return;

                if(loadTitle) loadTitle.style.display = 'none';

                sectionDiv.classList.remove('animate-pulse');
                sectionDiv.classList.add('border-gold');
                contentDiv.classList.remove('italic', 'text-zinc-400');
                contentDiv.classList.add('text-zinc-300');

                let textoSuavizado = suavizarMayusculas(content);
                let htmlLimpio = marked.parse(textoSuavizado);

                if(htmlLimpio.includes('table')) {
                    htmlLimpio = aplicarSemaforos(htmlLimpio);
                }

                // --- INYECCIÓN DE ESTILO PARA HEMORRAGIAS (Visual Web y PDF) ---
                // Reemplaza tanto la versión con formato bold como la normal que genera Markdown
                htmlLimpio = htmlLimpio.replace(/(<strong>)?\\[HEMORRAGIA CRÍTICA\\](<\\/strong>)?/gi, '<span class="hemorragia-critica">[HEMORRAGIA CRÍTICA]</span>');

                contentDiv.innerHTML = htmlLimpio;
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }

            async function descargarPDFBackend() {
                const btnPdf = document.getElementById('btn-pdf');
                const btnOriginalText = btnPdf.innerText;
                
                btnPdf.innerText = 'GENERANDO PDF EJECUTIVO...';
                btnPdf.disabled = true;

                const htmlContent = document.documentElement.outerHTML;

                try {
                    const response = await fetch('/generate-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ html: htmlContent })
                    });

                    if (!response.ok) throw new Error("Fallo en la generación del PDF");

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'PredictaCore_Auditoria_' + document.getElementById('dna').value + '.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                } catch (error) {
                    console.error("Error al descargar:", error);
                    alert("Ocurrió un error al generar el PDF de alta calidad. Reintenta en unos segundos.");
                } finally {
                    btnPdf.innerText = btnOriginalText;
                    btnPdf.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    \`;
}
module.exports = { getHTML };
