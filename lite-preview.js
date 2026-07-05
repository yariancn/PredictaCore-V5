/**
 * Instant Lite preview — scrape + deterministic score (no LLM). PLG entry point.
 */
const { parseSimulationFindings, localizeRule, localizeEvidence } = require('./fugas-builder');

const previewJobs = new Map();
const PREVIEW_TTL_MS = 45 * 60 * 1000;

function prunePreviewJobs() {
    const now = Date.now();
    for (const [id, job] of previewJobs.entries()) {
        if (now - job.createdAt > PREVIEW_TTL_MS) previewJobs.delete(id);
    }
}

function computeConversionScore({ seoScore, aiScore, loadTimeSec, findings }) {
    const seo = Number(seoScore) || 52;
    const ai = Number(aiScore) || 52;
    const load = Number(loadTimeSec) || 5;
    const loadScore =
        load <= 2.5 ? 92 : load <= 4 ? 74 : load <= 6 ? 48 : load <= 8 ? 32 : 18;
    const critical = (findings || []).filter((f) =>
        /crit|alta|high/i.test(String(f.severity || '')),
    ).length;
    const failPenalty = Math.min(35, critical * 8 + Math.max(0, findings.length - critical) * 3);
    const raw = seo * 0.34 + loadScore * 0.26 + ai * 0.2 + Math.max(0, 100 - failPenalty) * 0.2;
    return Math.max(18, Math.min(86, Math.round(raw)));
}

function scoreVerdict(score, locale) {
    const es = locale?.code?.startsWith('es');
    if (score >= 72) {
        return es
            ? 'Base sólida — aún hay fugas que frenan ventas pagadas.'
            : 'Solid base — leaks still slow paid traffic from buying.';
    }
    if (score >= 55) {
        return es
            ? 'Riesgo medio — estás perdiendo compradores que ya llegaron.'
            : 'Medium risk — you are losing buyers who already landed.';
    }
    return es
        ? 'Alto riesgo — cada clic pagado probablemente se va sin comprar.'
        : 'High risk — each paid click likely leaves without buying.';
}

function buildTopLeak(findings, locale) {
    const es = locale?.code?.startsWith('es');
    if (findings?.length) {
        const f = findings[0];
        const rule = localizeRule(f.rule, locale);
        const evidence = localizeEvidence(f.evidence, locale);
        return {
            index: 1,
            title: rule,
            impact: es
                ? `Por qué cuesta ventas: ${evidence}`
                : `Why it costs sales: ${evidence}`,
            severity: f.severity || 'ALTA',
        };
    }
    return {
        index: 1,
        title: es ? 'Propuesta de valor poco clara arriba del fold' : 'Value proposition unclear above the fold',
        impact: es
            ? 'Por qué cuesta ventas: un visitante nuevo no entiende qué comprar en los primeros 5 segundos.'
            : 'Why it costs sales: a new visitor cannot tell what to buy in the first 5 seconds.',
        severity: 'ALTA',
    };
}

function buildPreviewPayload(capture, dossierTexto) {
    const locale = capture.reportLocale || { code: 'en' };
    const findings = parseSimulationFindings(dossierTexto || capture.texto || '');
    const score = computeConversionScore({
        seoScore: capture.seoScore,
        aiScore: capture.aiScore,
        loadTimeSec: capture.loadTimeSec,
        findings,
    });
    const topLeak = buildTopLeak(findings, locale);
    const es = locale.code?.startsWith('es');
    const lockedCount = Math.max(12, findings.length > 3 ? findings.length - 3 : 12);

    return {
        status: 'ready',
        score,
        verdict: scoreVerdict(score, locale),
        topLeak,
        lockedFlaws: lockedCount,
        totalFlaws: Math.max(15, findings.length || 15),
        metrics: {
            seoScore: capture.seoScore ?? null,
            aiScore: capture.aiScore ?? null,
            loadTimeSec: capture.loadTimeSec ?? null,
        },
        target: capture.targetUrl || null,
        locale: locale.code || 'en',
        upsellLine: es
            ? `Viste la fuga #1. Las otras 2 + el desglose completo llegan gratis a tu email.`
            : `You saw leak #1. The other 2 + full breakdown arrive free in your email.`,
    };
}

function createPreviewJob(url) {
    prunePreviewJobs();
    const previewId = `PREVIEW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    previewJobs.set(previewId, {
        previewId,
        url,
        status: 'running',
        createdAt: Date.now(),
        capture: null,
        error: null,
    });
    return previewId;
}

function getPreviewJob(previewId) {
    prunePreviewJobs();
    return previewJobs.get(String(previewId || '').trim()) || null;
}

function setPreviewReady(previewId, capture, dossierTexto) {
    const job = getPreviewJob(previewId);
    if (!job) return null;
    job.status = 'ready';
    job.capture = { ...capture, targetUrl: job.url, texto: dossierTexto || capture.texto };
    job.payload = buildPreviewPayload(job.capture, dossierTexto || capture.texto);
    return job.payload;
}

function setPreviewFailed(previewId, message) {
    const job = getPreviewJob(previewId);
    if (!job) return;
    job.status = 'failed';
    job.error = message;
}

function consumePreviewCapture(previewId) {
    const job = getPreviewJob(previewId);
    if (!job || job.status !== 'ready' || !job.capture) return null;
    const capture = job.capture;
    previewJobs.delete(previewId);
    return capture;
}

module.exports = {
    previewJobs,
    createPreviewJob,
    getPreviewJob,
    setPreviewReady,
    setPreviewFailed,
    consumePreviewCapture,
    buildPreviewPayload,
    computeConversionScore,
};
