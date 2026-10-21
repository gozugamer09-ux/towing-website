// "What happened?" choices shared by the quick picker and the request form.
// `id` goes in links (/request/?issue=accident) and is the same in both languages.
// `label` is the form's wording, `chip` a shorter one for the quick-pick buttons (two lines on phones),
// and `value` the wording that goes into the text message.
const ISSUES = [
  { id: 'breakdown', icon: 'truck',
    en: { label: "Won't start or broke down", chip: 'Broke down', value: 'Breakdown, needs a tow' },
    es: { label: 'No arranca o se averió', chip: 'Avería', value: 'Avería, necesita grúa' } },
  { id: 'accident', icon: 'alert',
    en: { label: 'Accident', value: 'Accident' },
    es: { label: 'Accidente', value: 'Accidente' } },
  { id: 'flat-tire', icon: 'tire',
    en: { label: 'Flat tire', value: 'Flat tire' },
    es: { label: 'Goma o llanta ponchada', chip: 'Goma ponchada', value: 'Goma ponchada' } },
  { id: 'battery', icon: 'battery',
    en: { label: 'Dead battery', value: 'Dead battery' },
    es: { label: 'Batería descargada', value: 'Batería descargada' } },
  { id: 'lockout', icon: 'key',
    en: { label: 'Locked out', value: 'Locked out' },
    es: { label: 'Llaves dentro del carro', chip: 'Llaves adentro', value: 'Llaves dentro del carro' } },
  { id: 'fuel', icon: 'fuel',
    en: { label: 'Out of fuel', value: 'Out of fuel' },
    es: { label: 'Sin gasolina', value: 'Sin gasolina' } },
  { id: 'stuck', icon: 'hill',
    en: { label: 'Stuck or off the road', value: 'Stuck in a ditch, sand or mud' },
    es: { label: 'Atascado o fuera de la vía', chip: 'Atascado', value: 'Atascado en zanja, arena o lodo' } },
  { id: 'long-distance', icon: 'route',
    en: { label: 'Planned or long-distance', chip: 'Long distance', value: 'Planned or long-distance tow' },
    es: { label: 'Planificado o larga distancia', chip: 'Larga distancia', value: 'Remolque planificado o de larga distancia' } },
];
// Extra choices in the form only.
const OTHER_ISSUES = [
  { id: 'motorcycle', en: 'Motorcycle tow', es: 'Remolque de moto' },
  { id: 'equipment', en: 'Equipment hauling', es: 'Transporte de maquinaria' },
  { id: 'junk-car', en: 'Junk car removal', es: 'Retiro de carro chatarra' },
  { id: 'other', en: 'Something else', es: 'Otra cosa' },
];

export const issuesFor = (lang) => ISSUES.map((i) => ({ id: i.id, icon: i.icon, ...i[lang], chip: i[lang].chip || i[lang].label }));
export const otherIssuesFor = (lang) => OTHER_ISSUES.map((i) => ({ id: i.id, label: i[lang], value: i[lang] }));

// The request form's preselected answer for each service page (by English slug).
export const ISSUE_FOR_SERVICE = {
  towing: 'breakdown', 'flatbed-towing': 'breakdown', winching: 'stuck', 'accident-recovery': 'accident',
  'motorcycle-towing': 'motorcycle', 'long-distance-towing': 'long-distance', 'equipment-hauling': 'equipment',
  'junk-car-removal': 'junk-car',
};
