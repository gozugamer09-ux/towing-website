// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// SITE_URL is the live address (e.g. https://alejostowing.com). Until the domain is chosen,
// builds leave out canonical URLs and the sitemap rather than guess.
const SITE_URL = process.env.SITE_URL;

// Cloudflare Pages answers a missing address with the closest 404.html, so the Spanish
// "page not found" (built at es/404/) moves to es/404.html.
const spanish404 = {
  name: 'spanish-404',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const page = new URL('es/404/index.html', dir);
      if (!fs.existsSync(page)) return;
      fs.renameSync(page, new URL('es/404.html', dir));
      fs.rmdirSync(new URL('es/404/', dir));
    },
  },
};

export default defineConfig({
  ...(SITE_URL && { site: SITE_URL }),
  integrations: [...(SITE_URL ? [sitemap({ filter: (page) => !page.includes('/404') })] : []), spanish404],
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Overpass',
      cssVariable: '--font-overpass',
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
      options: { variants: [{ src: ['./node_modules/@fontsource-variable/overpass/files/overpass-latin-wght-normal.woff2'], weight: '100 900', style: 'normal' }] },
    },
    {
      provider: fontProviders.local(),
      name: 'Public Sans',
      cssVariable: '--font-public-sans',
      fallbacks: ['Arial', 'sans-serif'],
      options: { variants: [{ src: ['./node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2'], weight: '100 900', style: 'normal' }] },
    },
  ],
});
