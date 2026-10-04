// Turns the preview build (dist-preview/) into a self-contained bundle (dist-artifact/) that can be
// shared as a Claude artifact: links become relative ("services/towing/index.html"), fonts and
// scripts are inlined, and the home page loses its <html>/<head>/<body> wrapper because the
// artifact host adds its own. Run: npm run build:preview && node scripts/make-share-preview.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'dist-preview', OUT = 'dist-artifact';
const TITLE = 'Alejos Towing Preview'; // the artifact's name; keep it stable across updates

const read = (p) => fs.readFileSync(path.join(SRC, p));
const fonts = new Map();
const font = (p) => {
  if (!fonts.has(p)) fonts.set(p, `data:font/woff2;base64,${read(p).toString('base64')}`);
  return fonts.get(p);
};

const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(path.join(SRC, dir))) {
    const rel = path.join(dir, f);
    if (fs.statSync(path.join(SRC, rel)).isDirectory()) { if (f !== '_astro') walk(rel); }
    else if (f === 'index.html') pages.push(rel);
  }
})('');

fs.rmSync(OUT, { recursive: true, force: true });
for (const page of pages) {
  const depth = page.split('/').length - 1;
  const up = '../'.repeat(depth);
  let html = read(page).toString('utf8');

  // Head links the bundle can't or needn't serve (icons, manifest, font preloads).
  html = html.replace(/<link rel="(?:icon|apple-touch-icon|manifest|preload|canonical)"[^>]*>/g, '');
  // Fonts and the request-form script, inlined.
  html = html.replace(/url\("\/(_astro\/fonts\/[^"]+\.woff2)"\)/g, (_, p) => `url("${font(p)}")`);
  html = html.replace(/<script type="module" src="\/(_astro\/[^"]+\.js)"><\/script>/g, (_, p) => `<script type="module">${read(p).toString('utf8')}</script>`);
  // Site links: "/services/towing/?x#y" -> "../services/towing/index.html?x#y" (relative to this page).
  html = html.replace(/href="\/([^"#?]*)([^"]*)"/g, (_, p, rest) => {
    const target = p === '' || p.endsWith('/') ? `${p}index.html` : p;
    return `href="${up}${target}${rest}"`;
  });

  if (page === 'index.html') {
    // The artifact host wraps the main page in its own document, so keep only what goes inside it:
    // the title first, then the page's styles and data, then the body content.
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
    const keep = head.match(/<style[\s\S]*?<\/style>|<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
    html = `<title>${TITLE}</title>\n${keep.join('\n')}\n${body}`;
  }
  const out = path.join(OUT, page);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(page.padEnd(40), `${(html.length / 1024).toFixed(0)} KB`);
}
