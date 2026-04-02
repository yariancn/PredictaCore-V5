// visual.js - DASHBOARD CON BARRA DE PROGRESO
const getHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PredictaCore Titán</title>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; padding: 40px; text-align: center; }
        .container { max-width: 800px; margin: auto; background: #1e293b; padding: 50px; border-radius: 20px; border: 1px solid #334155; }
        h1 { color: #10b981; letter-spacing: 3px; text-transform: uppercase; }
        input { width: 85%; padding: 18px; border-radius: 10px; border: none; margin-bottom: 30px; font-size: 16px; background: #f8fafc; color: #1e293b; outline: none; }
        button { background: #10b981; color: white; border: none; padding: 18px 45px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; text-transform: uppercase; }
        #progress-wrapper { display: none; margin-top: 40px; }
        #progress-container { width: 100%; background: #334155; height: 12px; border-radius: 10px; overflow: hidden; margin-bottom: 15px; }
        #progress-bar { width: 0%; background: #10b981; height: 100%; transition: width 0.8s ease; }
        #status-text { color: #94a3b8; font-family: monospace; font-size: 13px; }
        #download-zone { display: none; margin-top: 50px; border-top: 1px solid #334155; padding-top: 30px; }
        .btn-pdf { background: #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>PREDICTACORE TITÁN</h1>
        <div id="ui-input">
            <input type="text" id="dna" placeholder="URL del activo (ej. pamandander.com)">
            <br>
            <button onclick="start()">LANZAR AUDITORÍA</button>
        </div>
        <div id="progress-wrapper">
            <div id="progress-container"><div id="progress-bar"></div></div>
            <div id="status-text">Iniciando...</div>
        </div>
        <div id="download-zone">
            <h2 style="color: #10b981;">AUDITORÍA FINALIZADA</h2>
            <button class="btn-pdf" onclick="getPDF()">DESCARGAR REPORTE PDF</button>
        </div>
    </div>
    <script>
        let reportHTML = "";
        async function start() {
            const dna = document.getElementById('dna').value;
            if(!dna) return alert("Falta URL");
            document.getElementById('ui-input').style.display = 'none';
            document.getElementById('progress-wrapper').style.display = 'block';
            const res = await fetch('/start', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({dna}) });
            const { jobId } = await res.json();
            poll(jobId);
        }
        async function poll(jobId) {
            const res = await fetch('/poll?jobId=' + jobId);
            const data = await res.json();
            if(data.status === 'running') {
                const done = Object.keys(data.progress).length;
                const pc = Math.round((done / 11) * 100);
                document.getElementById('progress-bar').style.width = pc + "%";
                document.getElementById('status-text').innerText = "Analizando: " + data.currentEtapa + " (" + pc + "%)";
                setTimeout(() => poll(jobId), 3500);
            } else if(data.status === 'done') {
                buildReport(data.progress);
            }
        }
        function buildReport(progress) {
            let html = "<html><body>";
            const etapas = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
            etapas.forEach(id => {
                if(progress[id]) {
                    let txt = progress[id].replace(/### (.*)/g, '<h3>$1</h3>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\n/g, '<br>');
                    html += '<section>' + txt + '</section>';
                }
            });
            html += "</body></html>";
            reportHTML = html;
            document.getElementById('progress-wrapper').style.display = 'none';
            document.getElementById('download-zone').style.display = 'block';
        }
        async function getPDF() {
            const res = await fetch('/generate-pdf', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({html: reportHTML}) });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'PredictaCore_Report.pdf'; a.click();
        }
    </script>
</body>
</html>
`;
module.exports = { getHTML };
