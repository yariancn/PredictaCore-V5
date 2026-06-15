const { getFaviconHeadTags } = require('./brand');

function getPlaygroundHTML() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    ${getFaviconHeadTags()}
    <title>PredictaCore Playground</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #050505; color: #d1d5db; font-family: ui-monospace, monospace; font-size: 12px; }
        pre { background: #0f172a; border: 1px solid #1e293b; padding: 12px; border-radius: 8px; overflow: auto; max-height: 240px; }
    </style>
</head>
<body class="p-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <div>
            <h1 class="text-emerald-500 font-black text-lg tracking-tighter">PREDICTA<span class="text-white">CORE</span> // PLAYGROUND</h1>
            <p class="text-zinc-500 text-[10px] mt-1">Entorno de pruebas — no indexado</p>
        </div>
        <span class="text-[10px] text-amber-500 border border-amber-500/30 px-2 py-1 rounded">STAGING ONLY</span>
    </div>

    <section class="mb-8">
        <h2 class="text-emerald-600 text-[10px] uppercase tracking-widest mb-3">01 — System Health</h2>
        <button onclick="runHealth()" class="bg-emerald-600 text-black px-4 py-2 rounded text-[10px] font-bold uppercase">Run /health</button>
        <pre id="out-health" class="mt-3 text-emerald-400">—</pre>
    </section>

    <div class="grid gap-2 mb-8">
        <input id="pg-url" placeholder="URL (ej. example.com)" class="bg-black border border-zinc-700 p-3 rounded text-white w-full">
        <input id="pg-email" placeholder="Email de prueba" class="bg-black border border-zinc-700 p-3 rounded text-white w-full">
    </div>

    <section class="mb-8">
        <h2 class="text-emerald-600 text-[10px] uppercase tracking-widest mb-3">02 — Lite Scan (sin pago)</h2>
        <p class="text-zinc-500 text-[10px] mb-2">Teaser PDF — 5 secciones. ~5 min.</p>
        <button onclick="runLite()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">POST /start-lite</button>
        <pre id="out-lite" class="mt-3 text-zinc-400">—</pre>
    </section>

    <section class="mb-8 border border-amber-500/30 bg-amber-950/10 p-4 rounded">
        <h2 class="text-amber-500 text-[10px] uppercase tracking-widest mb-3">02c — Estado del job (email)</h2>
        <p class="text-zinc-500 text-[10px] mb-2">Si no llegó el PDF: revisa si falló, sigue en progreso, o completó.</p>
        <button onclick="runJobStatus()" class="bg-amber-600 text-black px-4 py-2 rounded text-[10px] font-bold uppercase">GET /playground/job-status</button>
        <pre id="out-job-status" class="mt-3 text-amber-300">—</pre>
    </section>
    <section class="mb-8 border border-emerald-500/30 bg-emerald-950/10 p-4 rounded">
        <h2 class="text-emerald-500 text-[10px] uppercase tracking-widest mb-3">02b — Titán completo (sin pago)</h2>
        <p class="text-zinc-400 text-[10px] mb-2">Reporte forense completo — 11 secciones. Mismo motor que producción. ~10-20 min. Revisa el PDF y luego ajusta código en GitHub.</p>
        <button onclick="runTitan()" class="bg-emerald-600 text-black px-4 py-2 rounded text-[10px] font-bold uppercase">POST /playground/titan</button>
        <pre id="out-titan" class="mt-3 text-emerald-400">—</pre>
    </section>

    <section class="mb-8 border border-cyan-500/30 bg-cyan-950/10 p-4 rounded">
        <h2 class="text-cyan-400 text-[10px] uppercase tracking-widest mb-3">02d — Seguimiento mensual DELTA ($25 simulado)</h2>
        <p class="text-zinc-500 text-[10px] mb-3">Solo clientes con reporte Titán guardado en Postgres. Compara vs baseline y genera PDF comprimido (~2-3 hojas).</p>
        <div class="flex flex-wrap gap-2 mb-2">
            <button onclick="loadTitanClients()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">Cargar clientes Titán</button>
            <button onclick="runDelta()" class="bg-cyan-600 text-black px-4 py-2 rounded text-[10px] font-bold uppercase">POST /playground/delta</button>
        </div>
        <select id="pg-delta-client" class="bg-black border border-zinc-700 p-3 rounded text-white w-full mb-2 text-[11px]">
            <option value="">— Carga clientes primero —</option>
        </select>
        <p id="pg-delta-hint" class="text-zinc-600 text-[10px]">Selecciona un cliente con Titán en BD.</p>
        <pre id="out-delta" class="mt-3 text-cyan-300">—</pre>
    </section>

    <section class="mb-8">
        <h2 class="text-emerald-600 text-[10px] uppercase tracking-widest mb-3">03 — Checkout Stripe (test)</h2>
        <p class="text-zinc-500 text-[10px] mb-2">Usa tarjeta test 4242 4242 4242 4242 en modo test de Stripe.</p>
        <button onclick="runCheckout()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">POST /start</button>
        <pre id="out-checkout" class="mt-3 text-zinc-400">—</pre>
    </section>

    <section class="mb-8">
        <h2 class="text-emerald-600 text-[10px] uppercase tracking-widest mb-3">04 — Portal Cliente</h2>
        <button onclick="runPortal()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">POST /portal-cliente</button>
        <pre id="out-portal" class="mt-3 text-zinc-400">—</pre>
    </section>

    <section class="mb-8 border border-amber-500/30 bg-amber-950/10 p-4 rounded">
        <h2 class="text-amber-500 text-[10px] uppercase tracking-widest mb-3">06 — Re-procesar pago (session_id)</h2>
        <p class="text-zinc-500 text-[10px] mb-2">Si el webhook falló: Stripe → Payments → Checkout session → copia el ID (cs_test_...).</p>
        <input id="pg-session" placeholder="cs_test_..." class="bg-black border border-zinc-700 p-3 rounded text-white w-full mb-2">
        <div class="flex flex-wrap gap-2">
            <button onclick="runFulfill()" class="bg-amber-600 text-black px-4 py-2 rounded text-[10px] font-bold uppercase">POST /fulfill-checkout</button>
            <button onclick="runReplay()" class="bg-emerald-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">POST /playground/replay-delivery</button>
            <button onclick="runCheckoutStatus()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">GET /checkout-status</button>
        </div>
        <pre id="out-fulfill" class="mt-3 text-amber-400">—</pre>
    </section>

    <section class="mb-8 border border-violet-500/30 bg-violet-950/10 p-4 rounded">
        <h2 class="text-violet-400 text-[10px] uppercase tracking-widest mb-3">07 — Vista previa de correos (sin reporte)</h2>
        <p class="text-zinc-500 text-[10px] mb-3">Envía el HTML del correo a tu bandeja. Sin PDF, sin IA, sin cobro. Asunto: [PREVIEW].</p>
        <div class="grid gap-2 mb-3 sm:grid-cols-2">
            <select id="pg-email-type" class="bg-black border border-zinc-700 p-3 rounded text-white w-full">
                <option value="all">Todos (activación + titán + delta + lite)</option>
                <option value="activation">Confirmación de pago (post-checkout)</option>
                <option value="titan">Entrega Reporte Titán</option>
                <option value="delta">Reporte mensual DELTA</option>
                <option value="lite">Entrega Lite + upsell</option>
            </select>
            <select id="pg-lang" class="bg-black border border-zinc-700 p-3 rounded text-white w-full">
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </div>
        <button onclick="runEmailPreview()" class="bg-violet-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">POST /playground/preview-email</button>
        <pre id="out-email-preview" class="mt-3 text-violet-300">—</pre>
    </section>

    <section>
        <h2 class="text-emerald-600 text-[10px] uppercase tracking-widest mb-3">05 — DB Snapshot</h2>
        <button onclick="runDb()" class="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">GET /playground/db</button>
        <pre id="out-db" class="mt-3 text-zinc-400">—</pre>
    </section>

    <script>
        const apiKey = new URLSearchParams(window.location.search).get('key') || '';
        const headers = { 'Content-Type': 'application/json', 'X-API-Key': apiKey };

        async function api(path, opts = {}) {
            const url = path + (path.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(apiKey);
            const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
            const text = await res.text();
            try { return { status: res.status, data: JSON.parse(text) }; }
            catch { return { status: res.status, data: text }; }
        }

        async function runHealth() {
            const r = await api('/health');
            document.getElementById('out-health').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runLite() {
            const dna = document.getElementById('pg-url').value;
            const email = document.getElementById('pg-email').value;
            const r = await api('/start-lite', { method: 'POST', body: JSON.stringify({ dna, email }) });
            document.getElementById('out-lite').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runJobStatus() {
            const email = document.getElementById('pg-email').value;
            if (!email) {
                document.getElementById('out-job-status').textContent = 'Ingresa email arriba';
                return;
            }
            const r = await api('/playground/job-status?email=' + encodeURIComponent(email));
            document.getElementById('out-job-status').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runTitan() {
            const dna = document.getElementById('pg-url').value;
            const email = document.getElementById('pg-email').value;
            if (!dna || !email) {
                document.getElementById('out-titan').textContent = 'URL y email requeridos';
                return;
            }
            const r = await api('/playground/titan', { method: 'POST', body: JSON.stringify({ dna, email }) });
            document.getElementById('out-titan').textContent = JSON.stringify(r.data, null, 2);
        }

        let titanClientsCache = [];

        async function loadTitanClients() {
            const sel = document.getElementById('pg-delta-client');
            const hint = document.getElementById('pg-delta-hint');
            sel.innerHTML = '<option value="">Cargando…</option>';
            const r = await api('/playground/titan-clients');
            titanClientsCache = r.data?.clientes || [];
            if (!titanClientsCache.length) {
                sel.innerHTML = '<option value="">Sin clientes con Titán en BD</option>';
                hint.textContent = 'Ejecuta Titán desde el playground primero (se guarda al completar).';
                return;
            }
            sel.innerHTML = titanClientsCache.map(c => {
                const fecha = c.titan_en ? new Date(c.titan_en).toLocaleDateString('es') : '?';
                const deltas = c.deltas > 0 ? ' · ' + c.deltas + ' delta(s)' : '';
                const label = c.email + ' — ' + (c.url_sitio || 'sin url') + ' (Titán ' + fecha + deltas + ')';
                return '<option value="' + c.cliente_id + '">' + label + '</option>';
            }).join('');
            hint.textContent = titanClientsCache.length + ' cliente(s) con baseline Titán.';
            const first = titanClientsCache[0];
            if (first) {
                document.getElementById('pg-email').value = first.email;
                if (first.url_sitio) document.getElementById('pg-url').value = first.url_sitio.replace(/^https?:\\/\\//, '');
            }
        }

        async function runDelta() {
            const clienteId = document.getElementById('pg-delta-client').value;
            if (!clienteId) {
                document.getElementById('out-delta').textContent = 'Selecciona un cliente (carga la lista primero)';
                return;
            }
            const r = await api('/playground/delta', { method: 'POST', body: JSON.stringify({ cliente_id: Number(clienteId) }) });
            document.getElementById('out-delta').textContent = JSON.stringify(r.data, null, 2);
            const picked = titanClientsCache.find(c => String(c.cliente_id) === String(clienteId));
            if (picked?.email) document.getElementById('pg-email').value = picked.email;
        }

        async function runCheckout() {
            const dna = document.getElementById('pg-url').value;
            const email = document.getElementById('pg-email').value;
            localStorage.setItem('pc_email', email);
            const r = await api('/start', { method: 'POST', body: JSON.stringify({ dna, email, refCode: '' }) });
            document.getElementById('out-checkout').textContent = JSON.stringify(r.data, null, 2);
            if (r.data?.url) window.open(r.data.url, '_blank');
        }

        async function runPortal() {
            const email = document.getElementById('pg-email').value;
            const r = await api('/portal-cliente', { method: 'POST', body: JSON.stringify({ email }) });
            document.getElementById('out-portal').textContent = JSON.stringify(r.data, null, 2);
            if (r.data?.url) window.open(r.data.url, '_blank');
        }

        async function runFulfill() {
            const session_id = document.getElementById('pg-session').value.trim();
            const r = await api('/fulfill-checkout', { method: 'POST', body: JSON.stringify({ session_id }) });
            document.getElementById('out-fulfill').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runReplay() {
            const session_id = document.getElementById('pg-session').value.trim();
            const r = await api('/playground/replay-delivery', { method: 'POST', body: JSON.stringify({ session_id }) });
            document.getElementById('out-fulfill').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runCheckoutStatus() {
            const session_id = document.getElementById('pg-session').value.trim();
            const r = await fetch('/checkout-status?session_id=' + encodeURIComponent(session_id));
            const data = await r.json();
            document.getElementById('out-fulfill').textContent = JSON.stringify(data, null, 2);
        }

        async function runEmailPreview() {
            const email = document.getElementById('pg-email').value;
            const type = document.getElementById('pg-email-type').value;
            const lang = document.getElementById('pg-lang').value;
            const dna = document.getElementById('pg-url').value || 'https://example.com';
            if (!email) {
                document.getElementById('out-email-preview').textContent = 'Ingresa email arriba';
                return;
            }
            const r = await api('/playground/preview-email', {
                method: 'POST',
                body: JSON.stringify({ email, type, lang, dna }),
            });
            document.getElementById('out-email-preview').textContent = JSON.stringify(r.data, null, 2);
        }

        async function runDb() {
            const r = await api('/playground/db');
            document.getElementById('out-db').textContent = JSON.stringify(r.data, null, 2);
        }
    </script>
</body>
</html>`;
}

module.exports = { getPlaygroundHTML };
