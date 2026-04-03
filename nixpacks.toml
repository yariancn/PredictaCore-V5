// visual.js - INTERFAZ DE MANDO LIMPIA
const getHTML = () => `
<!DOCTYPE html>
<html>
<head>
    <title>PredictaCore Titán B31</title>
    <style>
        body { background: #050505; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .bunker { background: #0f172a; padding: 60px; border-radius: 24px; border: 1px solid #1e293b; text-align: center; width: 600px; }
        h1 { color: #10b981; letter-spacing: 4px; }
        input { width: 100%; padding: 15px; border-radius: 10px; border: none; margin: 20px 0; background: #f8fafc; font-size: 16px; }
        button { background: #10b981; color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-weight: bold; width: 100%; }
        #bar-container { display: none; margin-top: 30px; width: 100%; background: #334155; height: 10px; border-radius: 5px; overflow: hidden; }
        #bar-fill { width: 0%; background: #10b981; height: 100%; transition: 0.5s; }
    </style>
</head>
<body>
    <div class="bunker">
        <h1>TITÁN B31</h1>
        <div id="ui">
            <input type="text" id="dna" placeholder="URL o Idea de Negocio">
            <button onclick="deploy()">DISPARAR AUDITORÍA</button>
        </div>
        <div id="bar-container"><div id="bar-fill"></div></div>
    </div>
    <script>
        async function deploy() {
            const val = document.getElementById('dna').value;
            document.getElementById('ui').style.display = 'none';
            document.getElementById('bar-container').style.display = 'block';
            const res = await fetch('/start', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({dna: val}) });
            const { jobId } = await res.json();
            poll(jobId);
        }
        async function poll(jobId) {
            const res = await fetch('/poll?jobId=' + jobId);
            const data = await res.json();
            if(data.status === 'running') {
                const done = Object.keys(data.progress).length;
                document.getElementById('bar-fill').style.width = (done / 11 * 100) + "%";
                setTimeout(() => poll(jobId), 3000);
            } else if(data.status === 'done') {
                window.location.href = '/download?jobId=' + jobId;
            }
        }
    </script>
</body>
</html>
`;
module.exports = { getHTML };
