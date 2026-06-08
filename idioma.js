/** Español = latinoamericano. Siempre. Reportes, emails y copy al cliente. */

const ES_REGLAS = `Si el reporte va en ESPAÑOL:
- Español latinoamericano neutro (México / LATAM). Tono directo para emprendedor.
- Usa: sitio web, celular, correo, negocio, cliente, página, reservar, carrito, contacto.`;

const EN_REGLAS = `Si el reporte va en INGLÉS:
- Inglés americano neutro para negocios (website, email, apply).`;

const IDIOMA_REPORTE = `INSTRUCCIÓN CRÍTICA DE IDIOMA:
1. Detecta el idioma del activo (Dossier + capturas). Redacta TODO el reporte en ese idioma. Cero mezclas.
2. Español = latinoamericano. Sin excepciones. Obedece el bloque IDIOMA_REPORTE del dossier.
${ES_REGLAS}
${EN_REGLAS}`;

const IDIOMA_SOCIAL_EXTRA = `PERFIL SOCIAL: Idioma desde la bio y contenido del negocio. Ignora textos de la plataforma ('Iniciar sesión', 'Log in', 'Publicaciones', 'Meta').`;

const IDIOMA_SOCIAL = `${IDIOMA_REPORTE}\n${IDIOMA_SOCIAL_EXTRA}`;

const IDIOMA_LITE = IDIOMA_REPORTE;
const IDIOMA_DELTA = IDIOMA_REPORTE;

function looksSpanish(text) {
    const sample = String(text || '').toLowerCase().slice(0, 2500);
    if (!sample.trim()) return false;
    const markers = /\b(el|la|los|las|de|que|para|con|por|una|del|más|sitio|contacto|servicio|empresa|tienda|clínica|reservar|nosotros|tu|bienvenido)\b/g;
    return (sample.match(markers) || []).length >= 6;
}

function resolveReportLocale(htmlLang, textSample) {
    const lang = String(htmlLang || '').toLowerCase();
    if (lang.startsWith('es') || looksSpanish(textSample)) {
        return { code: 'es-LATAM', label: 'Español latinoamericano' };
    }
    if (lang.startsWith('en')) {
        return { code: 'en-US', label: 'English (US business)' };
    }
    return { code: 'auto', label: 'Detectar del dossier; si es español → latinoamericano' };
}

function formatIdiomaBlock(htmlLang, textSample) {
    const locale = resolveReportLocale(htmlLang, textSample);
    const note = locale.code.startsWith('es')
        ? 'REGLA: Español latinoamericano en todo el PDF.'
        : locale.code.startsWith('en')
            ? 'REGLA: Inglés americano de negocios.'
            : 'REGLA: Si el activo es español → latinoamericano.';

    return `
=== IDIOMA_REPORTE (OBLIGATORIO EN TODO EL PDF) ===
HTML_LANG: ${htmlLang || 'NO_DETECTADO'}
IDIOMA_APLICAR: ${locale.label}
CODIGO: ${locale.code}
${note}
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
