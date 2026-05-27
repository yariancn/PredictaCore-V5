function getSuccessHTML(lang = 'en') {
    const t = lang === 'es' ? {
        title: 'Pago confirmado',
        headline: 'PROTECCIÓN TITÁN ACTIVADA',
        body: 'Tu pago fue procesado con éxito. Nuestro motor forense ya está analizando tu activo digital.',
        email: 'Recibirás el reporte completo en tu correo en los próximos minutos.',
        sub: 'La suscripción de monitoreo mensual ($25/mes) también quedó activa.',
        portal: 'Gestionar suscripción',
        home: 'Volver al inicio',
    } : {
        title: 'Payment confirmed',
        headline: 'TITAN PROTECTION ACTIVATED',
        body: 'Your payment was processed successfully. Our forensic engine is now analyzing your digital asset.',
        email: 'You will receive the full report in your email within the next few minutes.',
        sub: 'Your monthly monitoring subscription ($25/mo) is also active.',
        portal: 'Manage subscription',
        home: 'Back to home',
    };

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title} | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #050505; color: #d1d5db; font-family: Inter, sans-serif; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-lg w-full border border-emerald-500/30 bg-black/80 p-10 rounded-lg text-center">
        <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-black text-white mb-4 tracking-tighter">${t.headline}</h1>
        <p class="text-zinc-300 text-sm mb-4 leading-relaxed">${t.body}</p>
        <p class="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">${t.email}</p>
        <p class="text-zinc-500 text-[10px] mb-8">${t.sub}</p>
        <div class="space-y-3">
            <button onclick="abrirPortal()" class="w-full bg-zinc-900 border border-zinc-700 text-white py-3 rounded text-xs uppercase tracking-widest hover:border-emerald-500 transition-colors">${t.portal}</button>
            <a href="/" class="block w-full text-zinc-500 text-[10px] uppercase tracking-widest hover:text-emerald-500">${t.home}</a>
        </div>
    </div>
    <script>
        const email = new URLSearchParams(window.location.search).get('email') || localStorage.getItem('pc_email') || '';
        if (email) localStorage.setItem('pc_email', email);
        async function abrirPortal() {
            if (!email) { window.location.href = '/'; return; }
            try {
                const res = await fetch('/portal-cliente', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else alert('${lang === 'es' ? 'No se encontró suscripción activa.' : 'No active subscription found.'}');
            } catch (e) { alert('Error'); }
        }
    </script>
</body>
</html>`;
}

module.exports = { getSuccessHTML };
