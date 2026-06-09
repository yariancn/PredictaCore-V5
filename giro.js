/** Detección de giro + perfiles psicológicos de cliente ideal (sin IA — cero tokens extra) */

const GIROS = {
    ecommerce: {
        label: 'E-commerce / Tienda online',
        signals: /shop|tienda|cart|carrito|product|producto|buy|comprar|checkout|collection|woocommerce|shopify/i,
    },
    salud: {
        label: 'Salud / Clínica / Bienestar',
        signals: /clinic|clínica|doctor|médic|medical|health|salud|dental|spa|therapy|terapia|wellness|hiperbáric|hyperbaric|oxigen/i,
    },
    servicios: {
        label: 'Servicios profesionales / B2B',
        signals: /consultor|agency|agencia|abogad|legal|contab|marketing|software|saas|servicio|professional|consulting|asesor/i,
    },
    restaurante: {
        label: 'Restaurante / Hospitalidad / Reservas',
        signals: /restaurant|restaurante|menu|menú|reserv|booking|hotel|café|cafe|bar|food|comida|delivery/i,
    },
    educacion: {
        label: 'Educación / Cursos / Formación',
        signals: /curso|course|academy|academia|learn|aprend|training|formación|bootcamp|certific/i,
    },
    inmobiliario: {
        label: 'Inmobiliario / Propiedades',
        signals: /inmobiliar|real estate|propiedad|property|renta|alquiler|vivienda|casas|homes/i,
    },
    general: {
        label: 'Negocio local / Servicios generales',
        signals: null,
    },
};

const SOCIAL_GIROS = {
    marca_personal: {
        label: 'Marca personal / Creador de contenido',
        signals: /creator|creador|influencer|coach|speaker|author|autor|portfolio/i,
    },
    negocio_local: {
        label: 'Negocio local en red social',
        signals: /restaurant|salon|spa|clinic|shop|tienda|studio|gym|fitness|barber|beauty|belleza/i,
    },
    ecommerce_social: {
        label: 'Venta / Catálogo en red social',
        signals: /shop|tienda|envío|shipping|catalog|catálogo|precio|whatsapp|dm para|link in bio/i,
    },
    general_social: {
        label: 'Perfil comercial en red social',
        signals: null,
    },
};

const PERSONA_ARQUETIPOS = [
    { id: 'escéptico', label: 'Cliente escéptico' },
    { id: 'apurado', label: 'Cliente con prisa' },
    { id: 'mobile', label: 'Cliente desde móvil' },
    { id: 'comparador', label: 'Cliente comparador' },
];

const GIRO_PERSONA_FOCUS = {
    ecommerce: {
        escéptico: 'Necesita prueba social, políticas claras y señales de tienda segura antes de añadir al carrito.',
        apurado: 'Busca producto, precio y botón de compra en pocos clics; abandona si la carga o el checkout confunden.',
        mobile: 'Compra desde el teléfono; exige CTAs visibles, imágenes legibles y checkout móvil sin fricción.',
        comparador: 'Compara precio, envío y valor vs otras tiendas; necesita oferta clara y diferenciador visible.',
    },
    salud: {
        escéptico: 'Exige credenciales, resultados y contacto humano antes de agendar; desconfía de promesas vagas.',
        apurado: 'Quiere reservar cita o WhatsApp inmediato; pierde interés si no hay CTA de contacto claro.',
        mobile: 'Busca desde móvil la dirección, horario y botón de cita; falla si la info clave no está arriba.',
        comparador: 'Evalúa tratamiento, precio o paquetes vs otras clínicas; necesita claridad de servicio y ubicación.',
    },
    servicios: {
        escéptico: 'Necesita casos, metodología y prueba de expertise antes de solicitar propuesta.',
        apurado: 'Quiere entender el servicio y contactar rápido; abandona si el menú o la propuesta no son claros.',
        mobile: 'Consulta desde móvil entre reuniones; necesita propuesta de valor y CTA de contacto inmediatos.',
        comparador: 'Contrasta paquetes, resultados y autoridad vs otras agencias o consultores del nicho.',
    },
    restaurante: {
        escéptico: 'Mira reseñas, menú y ubicación antes de reservar; desconfía si la info está desactualizada.',
        apurado: 'Quiere menú, horario y reserva rápida; abandona si hay que buscar mucho para actuar.',
        mobile: 'Busca desde móvil dirección, horario y botón de reserva o pedido.',
        comparador: 'Compara menú, precio y experiencia vs otros locales del mismo tipo.',
    },
    educacion: {
        escéptico: 'Necesita temario, instructor y resultados antes de inscribirse.',
        apurado: 'Quiere ver precio, modalidad e inscripción en pocos clics.',
        mobile: 'Consulta el curso desde móvil; necesita CTA de inscripción visible.',
        comparador: 'Compara contenido, precio y certificación vs otras formaciones.',
    },
    inmobiliario: {
        escéptico: 'Exige datos verificables, ubicación y contacto de agente antes de solicitar visita.',
        apurado: 'Quiere filtros claros y contacto rápido con asesor.',
        mobile: 'Busca propiedades y contacto desde móvil en terreno.',
        comparador: 'Compara ubicación, precio y condiciones vs listados similares.',
    },
    general: {
        escéptico: 'Necesita confianza, contacto verificable y claridad sobre qué ofrece el negocio.',
        apurado: 'Quiere entender la oferta y actuar (llamar, escribir, reservar) sin rodeos.',
        mobile: 'Navega desde móvil; necesita legibilidad, velocidad y CTA visible.',
        comparador: 'Compara propuesta, precio señalado y autoridad vs alternativas del rubro.',
    },
};

const SOCIAL_PERSONA_FOCUS = {
    marca_personal: {
        escéptico: 'Evalúa coherencia, prueba social y link externo antes de seguir o contactar.',
        apurado: 'Quiere bio clara y CTA directo (web, DM, link) en segundos.',
        mobile: 'Consume desde el feed móvil; necesita bio legible y enlace accionable.',
        comparador: 'Compara valor del contenido y autoridad vs otros creadores del nicho.',
    },
    negocio_local: {
        escéptico: 'Busca ubicación, horario y prueba de negocio real en bio y publicaciones.',
        apurado: 'Quiere reservar o escribir ya; abandona si solo hay fotos sin CTA.',
        mobile: 'Descubre el negocio desde móvil; necesita link a maps, WhatsApp o web.',
        comparador: 'Compara oferta y presencia vs otros negocios locales en la plataforma.',
    },
    ecommerce_social: {
        escéptico: 'Necesita ver catálogo, envíos y forma de pago antes de comprar por DM o link.',
        apurado: 'Quiere precio, disponibilidad y link de compra inmediato en bio o destacados.',
        mobile: 'Compra impulsiva desde móvil; necesita link-in-bio funcional y CTA de compra.',
        comparador: 'Compara precio, envío y catálogo vs otras tiendas del mismo rubro en redes.',
    },
    general_social: {
        escéptico: 'Necesita bio clara, prueba de actividad real y enlace fuera de la plataforma.',
        apurado: 'Quiere saber qué hace el perfil y cómo contactar en una mirada.',
        mobile: 'Evalúa el perfil desde móvil; bio y link deben ser accionables.',
        comparador: 'Compara propuesta de valor del perfil vs competidores visibles en el nicho.',
    },
};

const SIMULATION_GOALS_WEB = [
    'Detectar fricción que impide contactar, comprar o reservar.',
    'Medir claridad de oferta para el giro detectado.',
    'Evaluar confianza percibida (contacto, prueba social, datos estructurados).',
    'Verificar usabilidad móvil y velocidad de decisión.',
    'Identificar brechas de visibilidad en buscadores e IAs (GEO/AIO).',
];

const SIMULATION_GOALS_SOCIAL = [
    'Detectar si la bio convierte visitas del feed en acción (link, DM, reserva).',
    'Evaluar si el perfil es citables/recomendable fuera de la plataforma (web, NAP, entidad).',
    'Medir claridad de propuesta para el giro del negocio en redes.',
    'Identificar dependencia del algoritmo vs activo propio (web, link-in-bio).',
    'Priorizar fugas en embudo social → web → conversión.',
];

function detectGiro(text, isSocial = false) {
    const corpus = String(text || '').toLowerCase();
    const map = isSocial ? SOCIAL_GIROS : GIROS;
    for (const [key, cfg] of Object.entries(map)) {
        if (key.endsWith('general')) continue;
        if (cfg.signals && cfg.signals.test(corpus)) return { id: key, label: cfg.label };
    }
    return isSocial
        ? { id: 'general_social', label: SOCIAL_GIROS.general_social.label }
        : { id: 'general', label: GIROS.general.label };
}

function buildClientProfiles(giroId, isSocial = false) {
    const focusMap = isSocial ? SOCIAL_PERSONA_FOCUS : GIRO_PERSONA_FOCUS;
    const profiles = focusMap[giroId] || focusMap[isSocial ? 'general_social' : 'general'];
    return PERSONA_ARQUETIPOS.map((p) => ({
        id: p.id,
        label: p.label,
        focus: profiles[p.id],
    }));
}

function formatGiroBlock({ giro, profiles, isSocial, platform }) {
    const goals = isSocial ? SIMULATION_GOALS_SOCIAL : SIMULATION_GOALS_WEB;
    const profileLines = profiles.map(
        (p) => `PERFIL_${p.id.toUpperCase()}: ${p.label} — ${p.focus}`
    );
    return `
=== PREDICTACORE_MISION (CONTEXTO — USAR EN INTRO SECCIÓN I) ===
AUDIENCIA: Emprendedor / PYME que vende en línea — NO enterprise ni equipos con data warehouse
ALCANCE: SOLO activo público (URL) — PROHIBIDO pedir o inferir analytics internos, GA4, ventas reales
OBJETIVO_FINAL: Explicar por qué la página/perfil está perdiendo clientes y cómo mejorarlo con acciones concretas
VENTAJA: Más denso y accionable que consultoría que solo revise la misma URL; más riguroso que IA genérica en chat
=== FIN PREDICTACORE_MISION ===

=== GIRO_CLIENTE (DATOS REALES — USAR EN SECCIÓN II) ===
GIRO_DETECTADO: ${giro.label}
${isSocial ? `PLATAFORMA: ${platform || 'Social'}` : 'TIPO_ACTIVO: Sitio web'}
METODO: Gemelos sintéticos = perfiles psicológicos de clientes ideales según el giro del negocio, evaluados contra el activo público (solo URL).
OBJETIVO_SIMULACIONES: ${goals.join(' | ')}
REGLA_IA: En Sección II describe estos 4 perfiles (2 oraciones c/u) alineados al giro. PROHIBIDO citar cantidad de simulaciones o visitas. En Sección VIII prioriza fallos de SIMULATION_RESULTS.
${profileLines.join('\n')}
=== FIN GIRO_CLIENTE ===`;
}

module.exports = {
    detectGiro,
    buildClientProfiles,
    formatGiroBlock,
    PERSONA_ARQUETIPOS,
};
