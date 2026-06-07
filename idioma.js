/** Reglas de idioma para reportes — español latinoamericano cuando el activo está en español */

const ES_LATAM_REGLAS = `Si el idioma detectado es ESPAÑOL:
- OBLIGATORIO: español latinoamericano neutro (México / LATAM). Tono ejecutivo directo para emprendedor.
- PROHIBIDO español de España: vosotros, ordenador, móvil (UK), coger, enchufe, currículum vítae, gestoría, billete (UK).
- PREFERIR: sitio web, celular, computadora, correo, aplicar, negocio, cliente, página, reservar, contacto, checkout/carrito según contexto e-commerce.
- PROHIBIDO tuteo excesivo coloquial ("che", "wey") salvo que el sitio del cliente use ese registro.`;

const EN_US_REGLAS = `Si el idioma detectado es INGLÉS:
- Usa inglés americano neutro para negocios (website, cell phone, email, apply).`;

const IDIOMA_REPORTE = `INSTRUCCIÓN CRÍTICA Y ABSOLUTA DE IDIOMA:
1. Detecta el idioma principal del activo analizado (Dossier + capturas). Redacta TODO el reporte COMPLETO en ese idioma — encabezados, tablas, análisis, listas. Cero mezclas.
2. Si IDIOMA_REPORTE en el dossier indica es-LATAM, aplica obligatoriamente español latinoamericano aunque haya duda menor.
${ES_LATAM_REGLAS}
${EN_US_REGLAS}`;

const IDIOMA_SOCIAL_EXTRA = `INSTRUCCIÓN SOCIAL: Detecta idioma desde la BIO y contenido del negocio. IGNORA textos genéricos de la plataforma ('Iniciar sesión', 'Log in', 'Publicaciones', 'Meta').`;

const IDIOMA_SOCIAL = `${IDIOMA_REPORTE}\n${IDIOMA_SOCIAL_EXTRA}`;

const IDIOMA_LITE = IDIOMA_REPORTE;

const IDIOMA_DELTA = IDIOMA_REPORTE;

function looksSpanish(text) {
    const sample = String(text || '').toLowerCase().slice(0, 2500);
    if (!sample.trim()) return false;
    const markers = /\b(el|la|los|las|de|que|para|con|por|una|del|más|sitio|contacto|servicio|empresa|tienda|clínica|reservar|nosotros|tu|bienvenido)\b/g;
    const hits = (sample.match(markers) || []).length;
    return hits >= 6;
}

function resolveReportLocale(htmlLang, textSample) {
    const lang = String(htmlLang || '').toLowerCase();
    if (lang.startsWith('es') || lang.includes('spanish')) {
        return { code: 'es-LATAM', label: 'Español latinoamericano' };
    }
    if (lang.startsWith('en')) {
        return { code: 'en-US', label: 'English (US business)' };
    }
    if (looksSpanish(textSample)) {
        return { code: 'es-LATAM', label: 'Español latinoamericano (inferido del contenido)' };
    }
    return { code: 'auto', label: 'Detectar del dossier y capturas' };
}

function formatIdiomaBlock(htmlLang, textSample) {
    const locale = resolveReportLocale(htmlLang, textSample);
    const latamNote = locale.code.startsWith('es')
        ? 'REGLA_OBLIGATORIA: Redactar en ESPAÑOL LATINOAMERICANO NEUTRO. No usar español de España.'
        : locale.code.startsWith('en')
            ? 'REGLA: Redactar en inglés americano de negocios.'
            : 'REGLA: Detectar idioma del activo; si es español → latinoamericano.';

    return `
=== IDIOMA_REPORTE (DATOS REALES — OBLIGATORIO EN TODO EL PDF) ===
HTML_LANG: ${htmlLang || 'NO_DETECTADO'}
IDIOMA_APLICAR: ${locale.label}
CODIGO: ${locale.code}
${latamNote}
=== FIN IDIOMA_REPORTE ===`;
}

module.exports = {
    IDIOMA_REPORTE,
    IDIOMA_SOCIAL,
    IDIOMA_LITE,
    IDIOMA_DELTA,
    formatIdiomaBlock,
    resolveReportLocale,
};
