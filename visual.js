// visual.js - MASTER VISUAL (UNIFICADO)
const getHTML = (content = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        /* ESTILO EJECUTIVO UNIFICADO */
        body { 
            text-align: justify !important; 
            line-height: 1.6; 
            color: #1e293b; 
            font-family: 'Inter', system-ui, sans-serif;
            max-width: 800px;
            margin: auto;
            padding: 20px;
        }
        
        h3 { 
            color: #1e293b !important; 
            border-bottom: 2px solid #f1f5f9; 
            padding-bottom: 10px; 
            margin-top: 40px !important; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .capsula-contexto { 
            background: #f8fafc; 
            border-left: 5px solid #1e293b; 
            padding: 15px; 
            margin: 10px 0 25px 0; 
            font-size: 10pt; 
            color: #64748b; 
            font-style: italic;
        }

        /* TABLAS LIMPIAS Y JUSTIFICADAS */
        table { 
            width: 100% !important; 
            border-collapse: collapse !important; 
            margin: 20px 0 !important; 
            table-layout: auto !important;
        }
        th { 
            background-color: #f1f5f9 !important; 
            color: #1e293b !important; 
            border: 1px solid #cbd5e1 !important; 
            padding: 12px !important; 
            text-align: left !important;
        }
        td { 
            border: 1px solid #e2e8f0 !important; 
            padding: 12px !important; 
            text-align: justify !important; 
            vertical-align: top !important;
            font-size: 9.5pt !important;
        }

        /* VIÑETAS ALINEADAS */
        ul, ol { padding-left: 25px !important; }
        li { margin-bottom: 10px !important; list-style-position: outside !important; }

        @media print {
            .no-print { display: none; }
            table { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <h1>PredictaCore Titán</h1>
        <input type="text" id="dna" placeholder="URL del activo..." style="width:70%; padding:10px;">
        <button onclick="start()" style="padding:10px 20px; cursor:pointer;">Disparar Auditoría</button>
        <div id="status" style="margin-top:20px; font-weight:bold; color:#64748b;"></div>
    </div>
    <div id="reporte-final">${content}</div>
    
    <script>
        // Lógica de polling y visualización intacta...
    </script>
</body>
</html>
`;

module.exports = { getHTML };
