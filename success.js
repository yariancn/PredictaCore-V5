const { getFaviconHeadTags } = require('./brand');

function getSuccessHTML(lang = 'en') {
    const t = lang === 'es' ? {
        title: 'Pago confirmado',
        headline: 'PROTECCIÓN TITÁN ACTIVADA',
        body: 'Tu pago de USD $349 fue procesado con éxito. Nuestro motor forense ya está analizando tu activo digital.',
        email: 'Recibirás el Reporte Titán completo en tu correo en los próximos minutos.',
        sub: 'El monitoreo PredictaCore ($25/mes) ya está activo. El primer cobro mensual será en aproximadamente 30 días. En tu estado de cuenta verás PREDICTACORE.',
        portalNote: 'Cuando llegue el correo con tu reporte, encontrarás un enlace para gestionar tu suscripción si lo necesitas más adelante.',
        home: 'Volver al inicio',
        terms: 'Términos',
        privacy: 'Privacidad',
    } : {
        title: 'Payment confirmed',
        headline: 'TITAN PROTECTION ACTIVATED',
        body: 'Your USD $349 payment was processed successfully. Our forensic engine is now analyzing your digital asset.',
        email: 'YOU WILL RECEIVE THE FULL TITAN REPORT IN YOUR EMAIL WITHIN THE NEXT FEW MINUTES.',
        sub: 'Your PredictaCore monitoring ($25/mo) is active. First charge in ~30 days. Your statement should show PREDICTACORE.',
        portalNote: 'When your report email arrives, it will include a link to manage your subscription if you ever need it.',
        home: 'Back to home',
        terms: 'Terms',
        privacy: 'Privacy',
    };

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${getFaviconHeadTags()}
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
        <p class="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4 leading-relaxed">${t.email}</p>
        <p class="text-zinc-500 text-[10px] mb-4 leading-relaxed">${t.sub}</p>
        <p class="text-zinc-600 text-[9px] mb-8 leading-relaxed">${t.portalNote}</p>
        <a href="/" class="inline-block w-full bg-emerald-600 text-white py-3 rounded text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors">${t.home}</a>
        <p class="text-[9px] text-zinc-600 pt-6">
            <a href="/terms" class="text-emerald-600 hover:underline">${t.terms}</a> · <a href="/privacy" class="text-emerald-600 hover:underline">${t.privacy}</a>
        </p>
    </div>
    <script>
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const sessionId = params.get('session_id');
        if (email) localStorage.setItem('pc_email', email.trim().toLowerCase());
        if (sessionId && sessionId.startsWith('cs_')) {
            fetch('/fulfill-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId }),
            }).catch(function() {});
        }
    </script>
</body>
</html>`;
}

module.exports = { getSuccessHTML };
