// visual.js - DASHBOARD DE CONTROL
const getHTML = (content = "") => `
<!DOCTYPE html>
<html>
<head>
    <title>PredictaCore Titán</title>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; padding: 40px; text-align: center; }
        .container { max-width: 800px; margin: auto; background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        input { width: 80%; padding: 15px; border-radius: 6px; border: none; margin-bottom: 20px; font-size: 16px; background: #f8fafc; color: #1e293b; }
        button { background: #10b981; color: white; border: none; padding: 15px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.3s; }
        button:hover { background: #059669; }
        #status { margin-top: 30px; color: #94a3b8; font-family: monospace; }
        #reporte-final { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color:#10b981">PREDICTACORE TITÁN</h1>
        <p>Búnker 28 - Inteligencia Forense de Activos</p>
        <input type="text" id="dna" placeholder="Introduce la URL del activo (ej. pamandander.com)">
        <br>
        <button onclick="start()">DISPARAR AUDITORÍA</button>
        <div id="status">Esperando órdenes...</div>
    </div>
    <div id="reporte-final">${content}</div>
    <script>
        async function start() {
            const dna = document.getElementById('dna').value;
            if(!dna) return alert("Falta URL");
            document.getElementById('status').innerText = "Iniciando secuencia de abordaje...";
            const res = await fetch('/start', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({dna}) });
            const { jobId } = await res.json();
            poll(jobId);
        }

        async function poll(jobId) {
            const res = await fetch('/poll?jobId=' + jobId);
            const data = await res.json();
            if(data.status === 'running') {
                document.getElementById('status').innerText = "Procesando etapa: " + data.currentEtapa;
                setTimeout(() => poll(jobId), 3000);
            } else if(data.status === 'done') {
                document.getElementById('status').innerText = "Auditoría completada. Generando Reporte Ejecutivo...";
                // Lógica de visualización y PDF...
            }
        }
    </script>
</body>
</html>
`;
module.exports = { getHTML };
