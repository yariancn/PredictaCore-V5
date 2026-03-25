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
            /* TEMA OSCURO (PANTALLA DASHBOARD) */
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
            
            /* ESTILOS DE TABLAS (PANTALLA) */
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: #18181b; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            
            /* SEMÁFOROS UNIVERSALES (PANTALLA) */
            .badge-red { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid #7f1d1d; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            .badge-yellow { background: rgba(234, 179, 8, 0.1); color: #facc15; border: 1px solid #713f12; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            .badge-green { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid #14532d; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            
            /* FORMATO DE TEXTO (PANTALLA) */
            .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #e4e4e7; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; }
            .markdown-content h3 { font-size: 1.1rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; }
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
            .markdown-content li { margin-bottom: 0.5rem; line-height: 1.6; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            /* TEMA IMPRESIÓN (PDF EJECUTIVO ALTA GAMA) */
            @media print {
                @page { size: A4; margin: 2cm; }
                body { background: #ffffff !important; color: #1f2937 !important; font-size: 10pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
                .no-print { display: none !important; }
                
                /* Portada Ejecutiva */
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid #b8860b; padding-bottom: 1rem; margin-bottom: 2rem; }
                .cover-subtitle { font-size: 1.25rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.2em; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
                
                /* Estructura del Reporte */
                .report-section { 
                    page-break-before: always; 
                    break-before: page;
                    border-left: 3px solid #b8860b !important; 
                    padding-left: 1.5rem; 
                    margin-bottom: 2.5rem; 
                }
                
                #section-INTRO {
                    page-break-before: auto;
                    break-before: auto;
                }

                .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #000000 !important; page-break-after: avoid; }
                .markdown-content h3 { 
                    color: #b8860b !important; 
                    font-size: 13pt; 
                    margin-top: 0; 
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e5e7eb; 
                    margin-bottom: 1.5rem;
                }
                
                /* Blindaje de Párrafos y VIÑETAS (No se cortan a la mitad) */
                .markdown-content p { 
                    line-height: 1.7; 
                    text-align: justify; 
                    orphans: 3; 
                    widows: 3; 
                    margin-bottom: 1.2rem;
                }
                .markdown-content li {
                    line-height: 1.7;
                    text-align: justify;
                    margin-bottom: 1.2rem;
                    page-break-inside: avoid; /* OBLIGA A PASAR EL PUNTO ENTERO A LA OTRA HOJA */
                }
                .markdown-content strong { color: #000000 !important; }
                
                /* Tablas PDF Blindadas y Títulos Repetidos */
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; }
                thead { display: table-header-group; } /* REPITE LOS ENCABEZADOS EN CADA PÁGINA */
                tr { page-break-inside: avoid; page-break-after: auto; } /* LA FILA NO SE PARTE A LA MITAD */
                th, td { border: 1px solid #d1d5db !important; color: #111827 !important; background: #ffffff !important; padding: 12px; vertical-align: top; }
                th { background: #f9fafb !important; color: #b8860b !important; font-size: 9pt; text-transform: uppercase; }
                td { font-size: 9.5pt; }
                
                ul, ol { page-break-inside: auto; }
                
                .badge-red { background: transparent !important; color: #dc2626 !important; border: 1px solid #dc2626 !important; }
                .badge-yellow { background: transparent !important; color: #d97706 !important; border: 1px solid #d97706 !important; }
                .badge-green { background: transparent !important; color: #16a34a !important; border: 1px solid #16a34a !important; }
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
                <button id="btn-pdf" onclick="window.print()" class="hidden border border-[#d4af37] text-[#d4af37] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors duration-300">
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
                <input type="text" id="dna" placeholder="Ingresa dominio o activo (ej. marca.com)..." class="w-full bg-transparent text-white border-b border-zinc-800 p-2 focus:outline-none focus:border-gold placeholder-zinc-700">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-6 bg-zinc-900 text-gold-text border border-zinc-800 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold transition-all w-full">Ejecutar Auditoría</button>
            </div>
            
            <div id="status" class="text-[10px] tracking-[0.3em] text-zinc-500 mb-8 uppercase no-print"></div>
            
            <div id="reporte" class="space-y-4"></div>
        </div>

        <script>
            document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            function aplicarSemaforos(htmlContent) {
                const div = document.createElement('div');
                div.innerHTML = htmlContent;
                
                const celdas = div.querySelectorAll('td');
                celdas.forEach(td => {
                    const textoOriginal = td.textContent.trim();
                    const texto = textoOriginal.toLowerCase();
                    
                    const matchNumero = textoOriginal.match(/^(\\d+)(?:\\/10)?$/);
                    if (matchNumero) {
                        const calif = parseInt(matchNumero[1], 10);
                        if (calif <= 5) {
                            td.innerHTML = \`<span class="badge-red">\${td.innerHTML}</span>\`;
                        } else if (calif <= 7) {
                            td.innerHTML = \`<span class="badge-yellow">\${td.innerHTML}</span>\`;
                        } else {
                            td.innerHTML = \`<span class="badge-green">\${td.innerHTML}</span>\`;
                        }
                        return; 
                    }
                    
                    const keywordsRojas = ['deficiente', 'alto', 'fuga', 'riesgo', 'negativo', 'crítico', 'amenaza', 'ausente', 'pobre', 'nulo'];
                    const keywordsAmarillas = ['parcial', 'medio', 'no evaluable', 'no detectado', 'presente', 'moderado', 'regular'];
                    const keywordsVerdes = ['óptimo', 'adecuada', 'coherente', 'positivo', 'excelente', 'fuerte', 'fortaleza', 'bajo', 'adecuado'];

                    if (keywordsRojas.some(kw => texto.includes(kw)) || texto === 'no') {
                        td.innerHTML = \`<span class="badge-red">\${td.innerHTML}</span>\`;
                    } else if (keywordsAmarillas.some(kw => texto.includes(kw))) {
                        td.innerHTML = \`<span class="badge-yellow">\${td.innerHTML}</span>\`;
                    } else if (keywordsVerdes.some(kw => texto.includes(kw)) || texto === 'sí' || texto === 'si') {
                        td.innerHTML = \`<span class="badge-green">\${td.innerHTML}</span>\`;
                    }
                });
                return div.innerHTML;
            }

            async function ejecutar() {
                const dna = document.getElementById('dna').value;
                if (!dna) return;
                
                document.getElementById('pdf-domain').innerText = "Activo analizado: " + dna;
                
                const btn = document.getElementById('btn-ejecutar');
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                const btnPdf = document.getElementById('btn-pdf');
                
                btn.disabled = true;
                btnPdf.classList.add('hidden'); 
                reporte.innerHTML = "";
                status.innerText = "EXTRAYENDO DOSSIER Y PROCESANDO HEURÍSTICAS...";

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
                    {id: 'HERRAMIENTAS', title: 'X. Herramientas de
