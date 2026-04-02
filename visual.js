// visual.js - INTERFAZ DE MANDO
const getHTML = () => `
<!DOCTYPE html>
<html>
<head>
    <title>PredictaCore Titán</title>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .bunker { background: #1e293b; padding: 50px; border-radius: 20px; border: 1px solid #334155; text-align: center; width: 500px; }
        h1 { color: #10b981; letter-spacing: 4px; }
        input { width: 100%; padding: 15px; border-radius: 10px; border: none; margin: 20px 0; background: #f8fafc; font-size: 16px; box-sizing: border-box; }
        button { background: #10b981; color: white; border: none; padding: 15px 40px; border-radius: 10px; cursor: pointer; font-weight: bold; width: 100%; }
        #bar-container { display: none; margin-top: 30px; width: 100%; background: #334155; height: 10px; border-radius: 5px; }
        #bar-fill { width: 0%; background: #10b981; height: 100%; transition: 0.5s; }
        #status { margin-top: 10px; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="bunker">
        <h1>TITÁN B31</h1>
        <div id="control">
            <input type="text" id="target" placeholder="URL, Red Social o Idea de Negocio">
            <button onclick="deploy()">EJECUTAR AUDITORÍA</button>
        </div>
        <div id="bar-container"><div id="bar-fill"></div></div>
        <div id="status">Esperando coordenadas...</div>
    </div>
    <script>
        async function deploy() {
            const val = document.getElementById('target').value;
            if(!val) return;
            document.getElementById('control').style.display = 'none';
            document.getElementById('bar-container').style.display = 'block';
            
            const res = await fetch('/start', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({dna: val}) });
            const { jobId } = await res.json();
            poll(jobId);
        }
        async function poll(jobId) {
            const res = await fetch('/poll?jobId=' + jobId);
            const data = await res.json();
            if(data.status === 'running') {
                const step = Object.keys(data.progress).length;
                document.getElementById('bar-fill').style.width = (step / 11 * 100) + "%";
                document.getElementById('status').innerText = "Sonda en: " + data.currentEtapa;
                setTimeout(() => poll(jobId), 3000);
            } else if(data.status === 'done') {
                document.getElementById('status').innerText = "Crystallization Complete.";
                window.location.href = '/download?jobId=' + jobId;
            }
        }
    </script>
</body>
</html>
`;
module.exports = { getHTML };
