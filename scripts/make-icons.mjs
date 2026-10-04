// Renders the favicon PNGs and the social-share images (public/og.png, public/og-es.png).
// Icons come from public/favicon.svg via sharp; the share image is rendered in Chromium
// so it uses the site's real fonts. Run: node scripts/make-icons.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import { chromium } from 'playwright';

const svg = fs.readFileSync('public/favicon.svg');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(svg, { density: 600 }).resize(size, size).png().toFile(`public/${name}`);
}

const font = (p) => fs.readFileSync(p).toString('base64');
const overpass = font('node_modules/@fontsource-variable/overpass/files/overpass-latin-wght-normal.woff2');
const publicSans = font('node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2');
// The hero photo, as on the home page: the red truck on a highway shoulder.
const photo = (await sharp('src/assets/photos/truck-highway-front.jpg').resize(1000).jpeg({ quality: 84 }).toBuffer()).toString('base64');

// One share image per language (public/og.png and public/og-es.png); Base.astro picks by page language.
const COPY = {
  en: { file: 'og.png', h1: 'Stuck on the road? <em>Alejos</em> is on the way.', size: 74, p: '24/7 towing &amp; roadside help · Cape Coral, Fort Myers &amp; all of Florida', exit: 'Help ahead' },
  es: { file: 'og-es.png', h1: '¿Varado en la carretera? <em>Alejos</em> va en camino.', size: 66, p: 'Grúa y asistencia 24/7 · Cape Coral, Fort Myers y toda la Florida', exit: 'Ayuda en camino' },
};
const page_ = (c) => `<!doctype html><html><head><style>
@font-face{font-family:Overpass;src:url(data:font/woff2;base64,${overpass}) format('woff2');font-weight:100 900}
@font-face{font-family:'Public Sans';src:url(data:font/woff2;base64,${publicSans}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#f3f5f1;font-family:'Public Sans';display:grid;grid-template-columns:1fr 470px;gap:52px;align-items:center;padding:44px 60px;color:#0d1912}
h1{font:900 ${c.size}px/1 Overpass;letter-spacing:-.02em;text-wrap:balance}
h1 em{font-style:normal;color:#00653a}
p{font-size:28px;color:#45554b;margin-top:22px;line-height:1.35}
.call{display:inline-block;margin-top:28px;background:#00653a;color:#fff;font:800 38px/1 'Public Sans';padding:20px 28px;border-radius:12px}
.sign{background:#00653a;border-radius:20px;padding:10px;box-shadow:0 18px 40px rgba(13,25,18,.18)}
.in{position:relative;overflow:hidden;border:4px solid #fff;border-radius:12px}
.in img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-bottom:4px solid #fff}
.shield{position:absolute;top:14px;left:14px;background:#ffc81a;color:#1a1400;font:900 30px/1 Overpass;padding:13px 15px 15px;border-radius:9px 9px 22px 22px;box-shadow:0 3px 10px rgba(0,0,0,.3)}
.plate{display:flex;justify-content:space-between;align-items:center;padding:16px 22px 18px;color:#fff}
.name{font:900 46px/1 Overpass;text-transform:uppercase}
.exit{font:800 17px/1 Overpass;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;opacity:.92}
.arrow{width:62px;height:62px;flex:none;stroke:#fff;fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transform:rotate(-45deg)}
</style></head><body>
<div><h1>${c.h1}</h1><p>${c.p}</p><div class="call">(239) 888-7001</div></div>
<div class="sign"><div class="in"><img src="data:image/jpeg;base64,${photo}" alt=""><span class="shield">24/7</span>
<div class="plate"><div><div class="name">Alejos Towing</div><div class="exit">${c.exit}</div></div><svg class="arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div></div></div>
</body></html>`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of Object.values(COPY)) {
  await page.setContent(page_(c));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/${c.file}` });
}
await browser.close();
console.log('icons, og.png and og-es.png written');
