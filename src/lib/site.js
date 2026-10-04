// Business facts come only from content/*.json. Pages read them through here.
import business from '../../content/business.json';
import servicesData from '../../content/services.json';
import reviewsData from '../../content/reviews.json';
import faqData from '../../content/faq.json';
import { href } from './i18n';

// Preview builds highlight unconfirmed items; production builds leave them out.
export const PREVIEW = import.meta.env.PUBLIC_PREVIEW === '1' || import.meta.env.DEV;

export const biz = {
  name: business.name.value,
  phone: business.phone.value,          // +12398887001
  phoneDisplay: business.phone.display, // (239) 888-7001
  sms: business.sms.value,
  email: business.email.value,
  founded: business.trust.founded,
  insurer: business.trust.insurer,
  payment: business.payment.value,
};

export const tel = `tel:${biz.phone}`;
export const sms = (body) => `sms:${biz.sms}${body ? `?&body=${encodeURIComponent(body)}` : ''}`;

// "card, cash and Zelle" / "tarjeta, efectivo y Zelle": payment methods as they read mid-sentence.
const PAYMENT_WORDS = { en: { Card: 'card', Cash: 'cash', Zelle: 'Zelle' }, es: { Card: 'tarjeta', Cash: 'efectivo', Zelle: 'Zelle' } };
export const paymentText = (lang) =>
  biz.payment.map((p) => PAYMENT_WORDS[lang][p]).join(', ').replace(/, ([^,]*)$/, lang === 'es' ? ' y $1' : ' and $1');

// Content items keep their Spanish wording in an "es" object next to the English.
const localize = (item, lang) => (lang === 'es' && item.es ? { ...item, ...item.es } : item);

// Services in a language. `id` is the English slug (stable across languages); `href` is the page address.
export const servicesFor = (lang) =>
  servicesData.services.map((s) => ({ ...localize(s, lang), id: s.slug, href: href(`service:${s.slug}`, lang) }));

// Reviews waiting on Yordan's confirmation only appear in preview builds.
export const reviews = reviewsData.reviews.filter((r) => PREVIEW || !r.pending);
export const featuredReviews = reviewsData.featured.map((id) => reviews.find((r) => r.id === id));

// FAQ items: pending answers only appear in preview builds; "only" limits an item to one language.
export const faqFor = (lang) =>
  faqData.groups.map((g) => ({
    title: localize(g, lang).title,
    items: g.items.filter((i) => (PREVIEW || !i.pending) && (!i.only || i.only === lang)).map((i) => localize(i, lang)),
  }));
export const homeFaqFor = (lang) => faqFor(lang).flatMap((g) => g.items).filter((i) => i.home);

export const DESCRIPTION = {
  en: '24/7 towing and roadside assistance in Cape Coral, Fort Myers and anywhere in Florida. Call or text (239) 888-7001.',
  es: 'Grúa y asistencia en carretera 24/7 en Cape Coral, Fort Myers y toda la Florida. Llame o escriba al (239) 888-7001.',
};
