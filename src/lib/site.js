// Business facts come only from content/*.json. Pages read them through here.
import business from '../../content/business.json';
import servicesData from '../../content/services.json';
import reviewsData from '../../content/reviews.json';
import faqData from '../../content/faq.json';

// Preview builds highlight unconfirmed items; production builds leave them out.
export const PREVIEW = import.meta.env.PUBLIC_PREVIEW === '1' || import.meta.env.DEV;

export const biz = {
  name: business.name.value,
  phone: business.phone.value,          // +12398887001
  phoneDisplay: business.phone.display, // (239) 888-7001
  sms: business.sms.value,
  email: business.email.value,
  hours: business.hours.value,
  areas: business.service_area.value,
  primaryAreas: business.service_area.primary,
  founded: business.trust.founded,
  insurance: business.trust.insurance,
  payment: business.payment.value,
};

// "card, cash and Zelle": payment methods as they read mid-sentence.
export const paymentText = biz.payment
  .map((p) => (p === 'Zelle' ? p : p.toLowerCase()))
  .join(', ').replace(/, ([^,]*)$/, ' and $1');

export const tel = `tel:${biz.phone}`;
export const sms = (body) => `sms:${biz.sms}${body ? `?&body=${encodeURIComponent(body)}` : ''}`;

export const services = servicesData.services;
export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

// Reviews waiting on Yordan's confirmation only appear in preview builds.
export const reviews = reviewsData.reviews.filter((r) => PREVIEW || !r.pending);
export const featuredReviews = reviewsData.featured.map((id) => reviews.find((r) => r.id === id));

// FAQ items: pending answers only appear in preview builds.
export const faqGroups = faqData.groups.map((g) => ({
  ...g,
  items: g.items.filter((i) => PREVIEW || !i.pending),
}));
export const homeFaq = faqGroups.flatMap((g) => g.items).filter((i) => i.home);

export const SITE_DESCRIPTION =
  '24/7 towing and roadside assistance in Cape Coral, Fort Myers and anywhere in Florida. Call or text (239) 888-7001.';
