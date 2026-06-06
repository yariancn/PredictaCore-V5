function getTitanInternalHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Titan Internal | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #050505; color: #d1d5db; font-family: Inter, sans-serif; }
        .terminal-box {
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(16, 185, 129, 0.35);
            border-radius: 0.5rem;
        }
        .hidden-flow { display: none !important; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full terminal-box p-8 md:p-10 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
        <p class="text-[10px] text-emerald-600 uppercase tracking-[0.25em] mb-2 font-mono">Internal // No billing</p>
        <h1 class="text-xl font-black text-white mb-1 tracking-tighter">TITAN REPORT</h1>
        <p class="text-zinc-500 text-[11px] mb-8 leading-relaxed">Full forensic audit. PDF delivered by email in ~10–20 min.</p>

        <div class="space-y-4 text-left">
            <div>
                <label class="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Website URL</label>
                <input id="dna-url" type="text" placeholder="yourbusiness.com"
                    class="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-emerald-500 outline-none">
            </div>
            <div>
                <label class="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Delivery email</label>
                <input id="user-email" type="email" placeholder="you@company.com"
                    class="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-emerald-500 outline-none">
            </div>
            <div>
                <label class="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Access key</label>
                <input id="access-key" type="password" placeholder="•••••"
                    class="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-emerald-500 outline-none">
            </div>
        </div>

        <p id="form-error" class="hidden-flow text-[10px] text-red-400 mt-4 leading-relaxed" role="alert"></p>
        <p id="form-success" class="hidden-flow text-[10px] text-emerald-400 mt-4 leading-relaxed font-mono" role="status"></p>

        <button id="btn-run" onclick="runTitan()"
            class="w-full mt-6 bg-emerald-600 text-white font-black py-3 rounded text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-wait">
            Run Titan Report
        </button>

        <p class="text-[9px] text-zinc-600 text-center mt-6">
            <a href="/" class="text-emerald-600 hover:underline">predictacore.ai</a>
        </p>
    </div>

    <script>
        function setMsg(err, ok) {
            const errEl = document.getElementById('form-error');
            const okEl = document.getElementById('form-success');
            errEl.innerText = err || '';
            okEl.innerText = ok || '';
            errEl.classList.toggle('hidden-flow', !err);
            okEl.classList.toggle('hidden-flow', !ok);
        }

        async function runTitan() {
            const dna = document.getElementById('dna-url').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const key = document.getElementById('access-key').value;
            const btn = document.getElementById('btn-run');

            if (!dna || !email || !key) {
                setMsg('URL, email and access key are required.', '');
                return;
            }

            setMsg('', '');
            btn.disabled = true;
            btn.innerText = 'Starting…';

            try {
                const res = await fetch('/titan-interno', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dna, email, key }),
                });
                const data = await res.json().catch(function() { return {}; });

                if (res.ok && data.status === 'started') {
                    setMsg('', data.message || 'Titan audit started. Check your email.');
                    btn.innerText = 'Report queued';
                    return;
                }

                setMsg(data.error || 'Could not start audit.', '');
                btn.disabled = false;
                btn.innerText = 'Run Titan Report';
            } catch (e) {
                setMsg('Network error. Try again.', '');
                btn.disabled = false;
                btn.innerText = 'Run Titan Report';
            }
        }
    </script>
</body>
</html>`;
}

module.exports = { getTitanInternalHTML };
