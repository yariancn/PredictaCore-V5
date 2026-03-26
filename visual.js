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

            @media print {
                /* Aumentamos el margen superior para que no se pegue */
                @page { size: A4; margin: 2.5cm 2cm 2cm 2cm; }
                body { background: #ffffff !important; color: #1f2937 !important; font-size: 10pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
                .no-print { display: none !important; }
                
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid #b8860b; padding-bottom: 1rem; margin-bottom: 2rem; }
                .cover-subtitle { font-size: 1.25rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.2em; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
                
                /* Agregamos padding superior a las secciones para separarlas del margen */
                .report-section { page-break-before: always; border-left: 3px solid #b8860b !important; padding-left: 1.5rem; margin-bottom: 2.5rem; padding-top: 1rem; }
                #section-INTRO { page-break-before: auto; }

                .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #000000 !important; page-break-after: avoid; }
                .markdown-content h3 { color: #b8860b !important; font-size: 13pt; margin-top: 0; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem; }
                .markdown-content p { line-height: 1.7; text-align: justify; orphans: 3; widows: 3; margin-bottom: 1.2rem; }
                .markdown-content li { line-height: 1.7; text-align: justify; margin-bottom: 1.2rem; page-break-inside: avoid; }
                .markdown-content strong { color: #000000 !important; }
                
                /* BLINDAJE AGRESIVO DE TABLAS PARA EVITAR CORTES Y REPETIR ENCABEZADOS */
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                tr { page-break-inside: avoid !important; page-break-after: auto; }
                td, th { page-break-inside: avoid !important; }
                th, td { border: 1px solid #d1d5db !important; color: #111827 !important; background: #ffffff !important; padding: 12px; vertical-align: top; }
                th { background: #f9fafb !important; color: #b8860b !important; font-size: 9pt; text-transform: uppercase; }
                td { font-size: 9.5pt; }
                
                .badge-red { color: #dc2626 !important; font-weight: bold; }
                .badge-yellow { color: #d97706 !important; font-weight: bold; }
                .badge-green { color: #16a34a !important; font-weight: bold; }
            }
        </style>
