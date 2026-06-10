/**
 * PredictaCore legal pages (predictacore.ai only).
 */

const { getFaviconHeadTags } = require('./brand');

const UPDATED = 'May 27, 2026';

function wrapPredictacorePage({ title, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-emerald-500 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${getFaviconHeadTags()}
    <title>${title} | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#050505;color:#d1d5db;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <header class="border-b border-zinc-800 pb-4 mb-6">
        <a href="/" class="text-emerald-500 text-xs uppercase tracking-widest font-black">PredictaCore</a>
        <p class="text-[10px] text-zinc-600 mt-1">AI website audits · predictacore.ai</p>
    </header>
    <h1 class="text-2xl font-black text-white mb-2">${title}</h1>
    <p class="text-zinc-500 text-xs mb-6">Last updated: ${UPDATED}</p>
    ${intro || ''}
    <section class="space-y-6 text-zinc-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-zinc-800 text-zinc-600 text-xs">${links}</footer>
</body>
</html>`;
}

function getTerminosHTML() {
    return wrapPredictacorePage({
        title: 'Terms of Service',
        intro: `<div class="border border-emerald-900/50 bg-emerald-950/30 p-4 rounded mb-8 text-xs text-emerald-100/90">
            These terms apply only to <strong>PredictaCore</strong> products purchased on predictacore.ai
            (Titan Report and optional monthly monitoring).
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Provider</h2>
            <p>PredictaCore is provided at predictacore.ai. Support: reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Service</h2>
            <p>AI-powered website and digital profile audits delivered as PDF reports. We do not edit your website or guarantee revenue outcomes.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Pricing</h2>
            <p><strong>Titan Report:</strong> USD $349.00 — charged at purchase.</p>
            <p class="mt-2"><strong>Monthly monitoring (subscription):</strong> USD $25.00/month — starts 30 days after purchase.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Card charges</h2>
            <p>Charges should appear on your statement as <strong>PREDICTACORE</strong> (or similar PredictaCore descriptor). If you do not recognize a charge, contact reportes@predictacore.ai before disputing with your bank.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. No refunds</h2>
            <p><strong>ALL SALES ARE FINAL.</strong> USD $349 and processed USD $25 monthly charges are non-refundable.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Cancellation</h2>
            <p>Cancel monitoring via the Stripe customer portal linked from predictacore.ai. Cancel at least <strong>5 business days</strong> before renewal to avoid the next monthly charge.</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, liability is limited to amounts you paid in the prior 12 months. AI output may contain errors.</p></div>
        <div><h2 class="text-white font-bold mb-2">8. Intellectual property</h2>
            <p>Reports are for your internal use. No resale without permission.</p></div>
        <div><h2 class="text-white font-bold mb-2">9. Governing law</h2>
            <p>State of Delaware, USA.</p></div>`,
        footerLinks: [{ href: '/privacy', label: 'Privacy Policy' }],
    });
}

function getPrivacidadHTML() {
    return wrapPredictacorePage({
        title: 'Privacy Policy',
        intro: `<div class="border border-zinc-800 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            This policy applies only to <strong>PredictaCore</strong> at predictacore.ai.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Controller</h2>
            <p>PredictaCore — reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Data we collect</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li>Email address</li>
                <li>URL analyzed</li>
                <li>Payment data (processed by Stripe; we do not store card numbers)</li>
                <li>Public content scraped for reports</li>
                <li>Technical logs</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Use</h2>
            <p>Deliver reports, billing, monthly follow-ups, support, compliance.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Processors</h2>
            <p>Stripe, Resend, Google Cloud / Vertex AI, Railway, PostgreSQL.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Retention</h2>
            <p>While subscribed and up to 24 months after cancellation.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Your rights</h2>
            <p>Contact reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Security</h2>
            <p>HTTPS and reasonable safeguards.</p></div>`,
        footerLinks: [{ href: '/terms', label: 'Terms of Service' }],
    });
}

module.exports = {
    getTerminosHTML,
    getPrivacidadHTML,
};
