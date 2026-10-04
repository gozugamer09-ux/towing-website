// Yordan's own photos of his trucks on real jobs (sent 2026-10-04), in src/assets/photos/.
// Each file is named by what it shows; this table gives its description in both languages.
// `alt` is read by screen readers, `caption` labels it in the job gallery, and `pos` is the
// part to keep in view when a layout crops it (CSS object-position).
// Rules for adding photos are in docs/DESIGN.md ("Photos").
const files = import.meta.glob('../assets/photos/*.jpg', { eager: true, import: 'default' });

const PHOTOS = {
  'truck-highway-front': {
    en: { alt: 'Alejos Towing red flatbed tow truck on a highway shoulder, carrying a white pickup' },
    es: { alt: 'La grúa de plataforma roja de Alejos Towing a la orilla de una carretera, con una pickup blanca encima' },
  },
  'truck-highway-side': {
    en: { alt: 'Red flatbed tow truck stopped at the side of a highway with a pickup loaded' },
    es: { alt: 'Grúa de plataforma roja detenida a la orilla de la carretera con una pickup cargada' },
  },
  'jeep-wrangler': {
    en: { alt: 'Red flatbed tow truck carrying a white Jeep Wrangler under a blue sky' },
    es: { alt: 'Grúa de plataforma roja con un Jeep Wrangler blanco bajo un cielo azul' },
  },
  'jeep-wrangler-side': {
    en: { alt: 'Side view of the red flatbed with a white Jeep Wrangler on the bed', caption: 'Jeep Wrangler' },
    es: { alt: 'Vista de lado de la grúa roja con un Jeep Wrangler blanco en la plataforma', caption: 'Jeep Wrangler' },
  },
  'ford-model-t': {
    en: { alt: 'Antique Ford Model T strapped down on the flatbed', caption: 'Ford Model T' },
    es: { alt: 'Un Ford Modelo T antiguo asegurado sobre la plataforma', caption: 'Ford Modelo T' },
  },
  'classic-car-loading': {
    en: { alt: 'Classic car being pulled up the tilted bed of the flatbed', caption: 'Classic car, loading up' },
    es: { alt: 'Un carro clásico subiendo por la plataforma inclinada de la grúa', caption: 'Carro clásico, subiendo' },
  },
  'wrecked-car': {
    en: { alt: 'Badly damaged car loaded on the red flatbed after a crash' },
    es: { alt: 'Un carro muy dañado cargado en la grúa roja después de un choque' },
  },
  'flatbed-empty': {
    en: { alt: 'Red flatbed tow truck with an empty bed, ready for the next job' },
    es: { alt: 'Grúa de plataforma roja con la plataforma vacía, lista para el próximo trabajo' },
  },
  'truck-palm-tree': {
    en: { alt: 'Red flatbed carrying a white pickup on a Florida street with a palm tree' },
    es: { alt: 'Grúa roja con una pickup blanca en una calle de la Florida con una palma' },
  },
  'old-pickup': {
    en: { alt: 'Old black pickup loaded on the flatbed' },
    es: { alt: 'Una pickup negra vieja cargada en la plataforma' },
  },
  'box-truck': {
    pos: '30% 50%',
    en: { alt: 'Box truck loaded on the red flatbed', caption: 'Box truck' },
    es: { alt: 'Un camión de caja cargado en la grúa roja', caption: 'Camión de caja' },
  },
  backhoe: {
    pos: '62% 50%',
    en: { alt: 'Yellow backhoe loader on the red flatbed', caption: 'Backhoe' },
    es: { alt: 'Una retroexcavadora amarilla sobre la grúa roja', caption: 'Retroexcavadora' },
  },
  forklift: {
    en: { alt: 'Orange forklift on the red flatbed outside a warehouse', caption: 'Forklift' },
    es: { alt: 'Un montacargas anaranjado sobre la grúa roja frente a un almacén', caption: 'Montacargas' },
  },
  'track-loader': {
    en: { alt: 'Compact track loader on the red flatbed', caption: 'Track loader' },
    es: { alt: 'Una minicargadora de orugas sobre la grúa roja', caption: 'Minicargadora' },
  },
  'nissan-titan': {
    en: { alt: 'Gray Nissan Titan pickup on the flatbed', caption: 'Full-size pickup' },
    es: { alt: 'Una pickup Nissan Titan gris sobre la plataforma', caption: 'Pickup grande' },
  },
  'sports-car': {
    en: { alt: 'Red sports car strapped down on the flatbed', caption: 'Sports car' },
    es: { alt: 'Un carro deportivo rojo asegurado en la plataforma', caption: 'Carro deportivo' },
  },
  'door-red': {
    pos: '0% 50%',
    en: { alt: 'Door of the red tow truck lettered with the company name, USDOT number, Cape Coral, FL and 239-888-7001' },
    es: { alt: 'Puerta de la grúa roja con el nombre de la compañía, el número USDOT, Cape Coral, FL y el 239-888-7001' },
  },
};

/** A photo in a language: { id, src (the imported image), pos, alt, caption }. */
export function photo(id, lang) {
  const p = PHOTOS[id], src = files[`../assets/photos/${id}.jpg`];
  if (!p || !src) throw new Error(`Unknown photo "${id}": add it to src/assets/photos/ and src/lib/photos.js`);
  return { id, src, pos: p.pos, ...p[lang] };
}

// The crops (`pos`) as CSS for the page's <head> (src/layouts/Base.astro): the HTML check allows
// no inline styles. Photo.astro marks each cropped photo with data-photo.
export const PHOTO_CSS = Object.entries(PHOTOS)
  .filter(([, p]) => p.pos)
  .map(([id, p]) => `.photo[data-photo="${id}"]{object-position:${p.pos}}`)
  .join('');

// The home page's job gallery, in order. The first one is shown large on wide screens.
export const GALLERY = ['classic-car-loading', 'ford-model-t', 'box-truck', 'backhoe', 'forklift', 'track-loader', 'nissan-titan', 'sports-car', 'jeep-wrangler-side'];
