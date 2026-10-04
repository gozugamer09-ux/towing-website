// Two languages: English at the site root, Spanish under /es/ with translated page addresses.
// Shared interface wording lives here. Each page keeps its own wording, in both languages, at the
// top of its file in src/views/. Services and FAQ answers carry their Spanish in content/*.json ("es").
import servicesData from '../../content/services.json';

export const LANGS = ['en', 'es'];
export const langOf = (url) => (/^\/es(\/|$)/.test(url.pathname) ? 'es' : 'en');

const PAGES = {
  home: { en: '/', es: '/es/' },
  services: { en: '/services/', es: '/es/servicios/' },
  area: { en: '/service-area/', es: '/es/zona-de-servicio/' },
  reviews: { en: '/reviews/', es: '/es/resenas/' },
  faq: { en: '/faq/', es: '/es/preguntas/' },
  request: { en: '/request/', es: '/es/pedir-grua/' },
  privacy: { en: '/privacy/', es: '/es/privacidad/' },
};
for (const s of servicesData.services) {
  PAGES[`service:${s.slug}`] = { en: `/services/${s.slug}/`, es: `/es/servicios/${s.es.slug}/` };
}

/** A page's address in a language: href('request', 'es') is '/es/pedir-grua/'; services use 'service:<slug>'. */
export const href = (page, lang) => PAGES[page][lang];

/** The current page in both languages, for the language switch and hreflang. Pages without a pair (404) map to the homes. */
export function alternates(pathname) {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return Object.values(PAGES).find((pair) => pair.en === p || pair.es === p) || PAGES.home;
}

/** Fills {name} placeholders: fill('Call {name}', { name: 'Alejos' }). */
export const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export const UI = {
  en: {
    locale: 'en_US',
    skip: 'Skip to content',
    previewBar: ['Preview build.', "Highlighted items still need Yordan's confirmation and are left out of the live site."],
    // The language bar's label is in the page's language; its note and link are in the language it offers.
    langBar: { label: 'Language', lang: 'es', note: 'Hablamos español.', link: 'Ver en español' },
    tagline: 'Towing & roadside · 24/7',
    nav: { home: 'Home', services: 'Services', area: 'Service area', reviews: 'Reviews', faq: 'FAQ', request: 'Request a tow', privacy: 'Privacy' },
    mainNav: 'Main', menu: 'Menu', openMenu: 'Open menu', closeMenu: 'Close menu', breadcrumb: 'Breadcrumb', quickActions: 'Quick actions',
    call: 'Call', callNow: 'Call now', callAt: 'Call {name} at {phone}', request: 'Request a tow',
    footer: {
      blurb: '24/7 towing and roadside assistance in Cape Coral, Fort Myers and anywhere in Florida. Serving drivers since {year}.',
      contact: 'Call or text, any hour', text: 'Send a text', city: 'Cape Coral & Fort Myers, FL',
      services: 'Services', help: 'Help', hours: 'Hours & payment',
      open: 'Open 24/7', hoursText: 'Towing and roadside help, nights, weekends and holidays included.',
      accept: 'We accept {payment}.', licensed: 'Licensed', usdot: 'USDOT #{usdot}', insured: 'Insured through {insurer}',
    },
    final: { title: 'Need a tow right now?', text: 'Call or text any hour of the day or night. We cover Cape Coral, Fort Myers and anywhere in Florida.' },
    sign: { exit: 'Help ahead' },
    facts: [
      ['Since {year}', 'Towing in Southwest Florida'],
      ['24/7', 'Day, night, weekends and holidays'],
      ['Licensed', 'USDOT #{usdot}'],
      ['Insured', 'Covered through {insurer}'],
    ],
    steps: [
      ['Call or send a request', "Tell us where you are and what happened. A photo helps if it's safe to take one."],
      ['We confirm and head out', 'We confirm your location and the job, and tell you when to expect the truck.'],
      ['We load up and deliver', 'Your vehicle is secured and taken where you choose, across town or across the state.'],
    ],
    picker: { heading: 'What happened?', sub: "Tap one and we'll start your request." },
    review: { original: 'Read the original in Spanish', source: 'Google review, translated from Spanish' },
    map: {
      title: '{name} service area',
      desc: 'Map of Florida. The main area is Lee County, around Cape Coral and Fort Myers. Routes reach Tampa, Orlando, Miami, Jacksonville, Tallahassee, Pensacola and the rest of the state.',
      legend: ['Lee County, our main area', 'Cape Coral & Fort Myers', 'Long-distance, anywhere in Florida'],
    },
  },
  es: {
    locale: 'es_US',
    skip: 'Saltar al contenido',
    previewBar: ['Versión de prueba.', 'Lo resaltado aún espera la confirmación de Yordan y no aparece en el sitio real.'],
    langBar: { label: 'Idioma', lang: 'en', note: '', link: 'View in English' },
    tagline: 'Grúa y asistencia · 24/7',
    nav: { home: 'Inicio', services: 'Servicios', area: 'Zona de servicio', reviews: 'Reseñas', faq: 'Preguntas', request: 'Pedir grúa', privacy: 'Privacidad' },
    mainNav: 'Principal', menu: 'Menú', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', breadcrumb: 'Ruta de navegación', quickActions: 'Acciones rápidas',
    call: 'Llamar', callNow: 'Llamar ahora', callAt: 'Llamar a {name} al {phone}', request: 'Pedir grúa',
    footer: {
      blurb: 'Grúa y asistencia en carretera 24/7 en Cape Coral, Fort Myers y toda la Florida. Al servicio de los conductores desde {year}.',
      contact: 'Llame o escriba, a cualquier hora', text: 'Enviar un texto', city: 'Cape Coral y Fort Myers, FL',
      services: 'Servicios', help: 'Ayuda', hours: 'Horario y pago',
      open: 'Abierto 24/7', hoursText: 'Grúa y asistencia en carretera, con noches, fines de semana y días festivos incluidos.',
      accept: 'Aceptamos {payment}.', licensed: 'Con licencia', usdot: 'USDOT #{usdot}', insured: 'Asegurados con {insurer}',
    },
    final: { title: '¿Necesita una grúa ahora mismo?', text: 'Llame o escriba a cualquier hora del día o de la noche. Cubrimos Cape Coral, Fort Myers y toda la Florida.' },
    sign: { exit: 'Ayuda en camino' },
    facts: [
      ['Desde {year}', 'Remolcando en el suroeste de la Florida'],
      ['24/7', 'Día, noche, fines de semana y festivos'],
      ['Con licencia', 'USDOT #{usdot}'],
      ['Asegurados', 'Con seguro de {insurer}'],
    ],
    steps: [
      ['Llame o envíe su solicitud', 'Díganos dónde está y qué pasó. Una foto ayuda, si es seguro tomarla.'],
      ['Confirmamos y salimos', 'Confirmamos su ubicación y el trabajo, y le decimos cuándo esperar la grúa.'],
      ['Cargamos y entregamos', 'Aseguramos su vehículo y lo llevamos a donde usted elija, al otro lado de la ciudad o del estado.'],
    ],
    picker: { heading: '¿Qué pasó?', sub: 'Toque una opción y empezamos su solicitud.' },
    review: { original: '', source: 'Reseña de Google' },
    map: {
      title: 'Zona de servicio de {name}',
      desc: 'Mapa de la Florida. La zona principal es el condado de Lee, alrededor de Cape Coral y Fort Myers. Las rutas llegan a Tampa, Orlando, Miami, Jacksonville, Tallahassee, Pensacola y el resto del estado.',
      legend: ['Condado de Lee, nuestra zona principal', 'Cape Coral y Fort Myers', 'Larga distancia, en toda la Florida'],
    },
  },
};
