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

            /* REGLAS AGRESIVAS DE IMPRESIÓN PARA EL MOTOR BACKEND */
            @media print {
                @page { size: A4; margin: 2.5cm 2cm 2cm 2cm; }
                /* INCREMENTO DE TAMAÑO DE FUENTE Y LECTURABILIDAD */
                body { background: #ffffff !important; color: #1f2937 !important; font-size: 11.5pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.5; }
                .no-print { display: none !important; }
                
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid #b8860b; padding-bottom: 1rem; margin-bottom: 2rem; }
                .cover-subtitle { font-size: 1.25rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.2em; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
                
                .report-section { page-break-before: always; border-left: 3px solid #b8860b !important; padding-left: 1.5rem; margin-bottom: 2.5rem; padding-top: 1rem; }
                #section-INTRO { page-break-before: auto; }

                .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #000000 !important; page-break-after: avoid; }
                .markdown-content h3 { color: #b8860b !important; font-size: 14pt; margin-top: 0; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem; }
                .markdown-content p { line-height: 1.6; text-align: justify; orphans: 3; widows: 3; margin-bottom: 1.2rem; }
                .markdown-content li { line-height: 1.6; text-align: justify; margin-bottom: 1.2rem; page-break-inside: avoid; }
                .markdown-content strong { color: #000000 !important; }
                
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                tr { page-break-inside: avoid !important; page-break-after: auto; }
                td, th { page-break-inside: avoid !important; }
                /* AJUSTE DE TAMAÑO EN TABLAS PARA MANTENER PROPORCIÓN */
                th, td { border: 1px solid #d1d5db !important; color: #111827 !important; background: #ffffff !important; padding: 12px; vertical-align: top; }
                th { background: #f9fafb !important; color: #b8860b !important; font-size: 10pt; text-transform: uppercase; }
                td { font-size: 10.5pt; }
                
                .badge-red { color: #dc2626 !important; font-weight: bold; }
                .badge-yellow { color: #d97706 !important; font-weight: bold; }
                .badge-green { color: #16a34a !important; font-weight: bold; }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
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
                    <div class="text-lg text-gray-600 mb-8" id="pdf-domain">Documento Estratégico</div>
                </div>
                <div class="cover-meta flex justify-between w-full">
                    <span>CLASIFICACIÓN: CONFIDENCIAL</span>
                    <span id="pdf-date"></span>
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
                    status.innerText = 'ERROR DE CONEXIÓN CON EL MOTOR.';
                    btn.disabled = false;
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
    `;
}
module.exports = { getHTML };
