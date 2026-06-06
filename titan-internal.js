function getTitanInternalHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Titan Lab | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root { --pc-emerald: #10b981; --pc-dark-bg: #050505; }
        body { background: var(--pc-dark-bg); color: #d1d5db; font-family: Inter, sans-serif; overflow-x: hidden; }
        .mesh-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-image: radial-gradient(circle at 50% -20%, #1e293b 0%, transparent 50%);
            z-index: -1;
        }
        .terminal-box {
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(16, 185, 129, 0.35);
            border-radius: 0.5rem;
        }
        .hidden-flow { display: none !important; }
        .scan-line { width: 100%; height: 2px; background: var(--pc-emerald); position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.3; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .asset-pill { cursor: pointer; transition: all 0.2s; opacity: 0.45; border: 1px solid #3f3f46; }
        .asset-pill.active { opacity: 1; border-color: var(--pc-emerald); color: var(--pc-emerald); background: rgba(16,185,129,0.08); }
        .platform-pill { cursor: pointer; transition: all 0.2s; border: 1px solid #3f3f46; opacity: 0.5; }
        .platform-pill.active { opacity: 1; border-color: var(--pc-emerald); color: #fff; background: rgba(16,185,129,0.12); }
    </style>
</head>
<body class="antialiased min-h-screen">
    <div class="mesh-bg"></div>

    <header class="py-8 text-center border-b border-zinc-900/80">
        <p class="text-[10px] text-emerald-600 uppercase tracking-[0.3em] font-mono mb-2">Internal lab // No billing</p>
        <h1 class="text-2xl font-black text-white tracking-tighter">PREDICTA<span class="text-emerald-500">CORE</span> TITAN</h1>
        <p class="text-zinc-500 text-[11px] mt-2">Website or social profile — one full forensic report per run</p>
    </header>

    <section class="py-16 px-6">
        <div class="max-w-2xl mx-auto">

            <div id="setup-stage" class="terminal-box p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-zinc-800 bg-black/80 relative">
                <div class="absolute top-4 right-4 text-[10px] text-emerald-500 font-mono animate-pulse">// LAB NODE</div>
                <h2 class="text-xl font-black text-white mt-4 mb-6 uppercase tracking-tighter text-center">Run Titan Report</h2>

                <p class="text-[9px] text-zinc-500 uppercase tracking-widest mb-2 text-center">Asset type</p>
                <div class="grid grid-cols-2 gap-2 mb-6">
                    <button type="button" id="pill-web" class="asset-pill active py-3 rounded text-[10px] font-bold uppercase tracking-widest" onclick="setAssetType('web')">Website</button>
                    <button type="button" id="pill-social" class="asset-pill py-3 rounded text-[10px] font-bold uppercase tracking-widest" onclick="setAssetType('social')">Social profile</button>
                </div>

                <div id="panel-web" class="space-y-4 mb-4">
                    <input type="text" id="dna-url" placeholder="yourbusiness.com"
                        class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs uppercase tracking-widest">
                </div>

                <div id="panel-social" class="hidden-flow space-y-4 mb-4">
                    <p class="text-[9px] text-zinc-500 uppercase tracking-widest text-center">Platform (scrapable)</p>
                    <div class="grid grid-cols-3 gap-2">
                        <button type="button" class="platform-pill active py-2 rounded text-[9px] font-bold uppercase" data-platform="instagram" onclick="setPlatform('instagram')">Instagram</button>
                        <button type="button" class="platform-pill py-2 rounded text-[9px] font-bold uppercase" data-platform="facebook" onclick="setPlatform('facebook')">Facebook</button>
                        <button type="button" class="platform-pill py-2 rounded text-[9px] font-bold uppercase" data-platform="tiktok" onclick="setPlatform('tiktok')">TikTok</button>
                    </div>
                    <input type="text" id="social-handle" placeholder="@brand"
                        class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs tracking-widest">
                    <p id="social-hint" class="text-[9px] text-zinc-600 text-center">Public profile URL or username</p>
                </div>

                <div class="space-y-4">
                    <input type="email" id="user-email" placeholder="Delivery email"
                        class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs tracking-widest">
                    <input type="password" id="access-key" placeholder="Access key"
                        class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs tracking-widest">
                </div>

                <p id="form-error" class="hidden-flow text-[10px] text-red-400 mt-4 text-center" role="alert"></p>

                <button id="btn-run" onclick="runTitan()"
                    class="w-full mt-6 bg-emerald-600 text-white font-black py-4 rounded hover:bg-emerald-500 transition-all uppercase tracking-[0.2em] text-xs">
                    Execute Titan Audit
                </button>
            </div>

            <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-black border border-emerald-500 mt-0">
                <div class="scan-line"></div>
                <p class="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 text-center font-mono" id="scan-label">Forensic engine</p>
                <div id="terminal-output" class="font-mono text-[10px] text-emerald-500 space-y-1 h-64 overflow-y-auto">
                    <p id="log-init">&gt;&gt; INITIALIZING PREDICTACORE CORE...</p>
                </div>
            </div>

            <div id="done-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center relative border border-emerald-500/50 bg-black mt-0">
                <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Titan Queued</h2>
                <p class="text-zinc-400 text-xs mb-2">Full report shipping to <span id="sent-email" class="text-white font-bold"></span></p>
                <p id="done-detail" class="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6">11-section forensic PDF in ~10–20 min</p>
                <button onclick="resetLab()" class="text-zinc-500 text-[10px] uppercase tracking-widest hover:text-emerald-500">Run another audit</button>
            </div>

        </div>
    </section>

    <footer class="py-8 text-center border-t border-zinc-900">
        <p class="text-[9px] text-zinc-700 font-mono">© 2026 PREDICTACORE // TITAN LAB</p>
    </footer>

    <script>
        let assetType = 'web';
        let platform = 'instagram';

        const platformHints = {
            instagram: 'instagram.com/username or @username',
            facebook: 'facebook.com/pagename or page slug',
            tiktok: 'tiktok.com/@handle or @handle',
        };

        const logsWeb = [
            '&gt;&gt; Connecting nodes...',
            '&gt;&gt; Scraping website (desktop + mobile)...',
            '&gt;&gt; Probing checkout friction...',
            '&gt;&gt; Injecting Synthetic Twins...',
            '&gt;&gt; Running 11 Titan sections (Gemini)...',
            '&gt;&gt; Crystallizing PDF...',
            '&gt;&gt; Queuing email delivery...',
        ];

        const logsSocial = {
            instagram: [
                '&gt;&gt; Connecting nodes...',
                '&gt;&gt; Scraping Instagram profile...',
                '&gt;&gt; Analyzing bio, link-in-bio, content grid...',
                '&gt;&gt; Social conversion scorecard...',
                '&gt;&gt; Running 11 social Titan sections...',
                '&gt;&gt; Crystallizing PDF...',
                '&gt;&gt; Queuing email delivery...',
            ],
            facebook: [
                '&gt;&gt; Connecting nodes...',
                '&gt;&gt; Scraping Facebook page...',
                '&gt;&gt; Analyzing page CTAs and authority...',
                '&gt;&gt; Running 11 social Titan sections...',
                '&gt;&gt; Crystallizing PDF...',
                '&gt;&gt; Queuing email delivery...',
            ],
            tiktok: [
                '&gt;&gt; Connecting nodes...',
                '&gt;&gt; Scraping TikTok profile...',
                '&gt;&gt; Analyzing bio link and content hooks...',
                '&gt;&gt; Running 11 social Titan sections...',
                '&gt;&gt; Crystallizing PDF...',
                '&gt;&gt; Queuing email delivery...',
            ],
        };

        function setAssetType(type) {
            assetType = type;
            document.getElementById('pill-web').classList.toggle('active', type === 'web');
            document.getElementById('pill-social').classList.toggle('active', type === 'social');
            document.getElementById('panel-web').classList.toggle('hidden-flow', type !== 'web');
            document.getElementById('panel-social').classList.toggle('hidden-flow', type !== 'social');
            setError('');
        }

        function setPlatform(p) {
            platform = p;
            document.querySelectorAll('.platform-pill').forEach(function(el) {
                el.classList.toggle('active', el.dataset.platform === p);
            });
            document.getElementById('social-handle').placeholder = p === 'tiktok' ? '@brand' : (p === 'instagram' ? '@brand' : 'pagename');
            document.getElementById('social-hint').innerText = platformHints[p];
            setError('');
        }

        function setError(msg) {
            const el = document.getElementById('form-error');
            el.innerText = msg || '';
            el.classList.toggle('hidden-flow', !msg);
        }

        function resetLab() {
            document.getElementById('setup-stage').classList.remove('hidden-flow');
            document.getElementById('scanner-stage').classList.add('hidden-flow');
            document.getElementById('done-stage').classList.add('hidden-flow');
            document.getElementById('btn-run').disabled = false;
            document.getElementById('btn-run').innerText = 'Execute Titan Audit';
            setError('');
        }

        async function runTitan() {
            const email = document.getElementById('user-email').value.trim();
            const key = document.getElementById('access-key').value;
            const dna = document.getElementById('dna-url').value.trim();
            const handle = document.getElementById('social-handle').value.trim();

            if (!email || !key) {
                setError('Email and access key required.');
                return;
            }
            if (assetType === 'web' && !dna) {
                setError('Website URL required.');
                return;
            }
            if (assetType === 'social' && !handle) {
                setError('Social profile handle or URL required.');
                return;
            }

            setError('');
            document.getElementById('setup-stage').classList.add('hidden-flow');
            document.getElementById('scanner-stage').classList.remove('hidden-flow');
            document.getElementById('done-stage').classList.add('hidden-flow');
            document.getElementById('sent-email').innerText = email;

            const scanLabel = assetType === 'social'
                ? 'Social Titan — ' + platform.charAt(0).toUpperCase() + platform.slice(1)
                : 'Website Titan';
            document.getElementById('scan-label').innerText = scanLabel;

            const terminal = document.getElementById('terminal-output');
            terminal.innerHTML = '<p id="log-init">&gt;&gt; INITIALIZING PREDICTACORE CORE...</p>';
            const logs = assetType === 'social' ? logsSocial[platform] : logsWeb;

            const payload = {
                key,
                email,
                assetType,
                dna: assetType === 'web' ? dna : undefined,
                platform: assetType === 'social' ? platform : undefined,
                handle: assetType === 'social' ? handle : undefined,
            };

            let apiOk = false;
            let apiMessage = '';

            const apiPromise = fetch('/titan-interno', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(function(r) {
                return r.json().then(function(d) {
                    apiOk = r.ok && d.status === 'started';
                    apiMessage = d.message || d.error || 'Could not start audit.';
                    if (!apiOk) setError(apiMessage);
                    return d;
                });
            }).catch(function() {
                apiMessage = 'Network error.';
                setError(apiMessage);
            });

            let i = 0;
            const interval = setInterval(function() {
                if (i < logs.length) {
                    const p = document.createElement('p');
                    p.innerHTML = logs[i];
                    terminal.appendChild(p);
                    terminal.scrollTop = terminal.scrollHeight;
                    i++;
                }
                if (i >= logs.length) {
                    clearInterval(interval);
                    Promise.resolve(apiPromise).then(function() {
                        setTimeout(function() {
                            document.getElementById('scanner-stage').classList.add('hidden-flow');
                            if (apiOk) {
                                document.getElementById('done-detail').innerText = apiMessage;
                                document.getElementById('done-stage').classList.remove('hidden-flow');
                            } else {
                                document.getElementById('setup-stage').classList.remove('hidden-flow');
                            }
                        }, 1500);
                    });
                }
            }, 900);
        }
    </script>
</body>
</html>`;
}

module.exports = { getTitanInternalHTML };
