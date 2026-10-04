// Renders the favicon PNGs and the social-share image (public/og.png).
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
const html = `<!doctype html><html><head><style>
@font-face{font-family:Overpass;src:url(data:font/woff2;base64,${overpass}) format('woff2');font-weight:100 900}
@font-face{font-family:'Public Sans';src:url(data:font/woff2;base64,${publicSans}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#f3f5f1;font-family:'Public Sans';display:grid;grid-template-columns:1fr 520px;gap:48px;align-items:center;padding:60px 64px;color:#0d1912}
h1{font:900 76px/1 Overpass;letter-spacing:-.02em}
h1 em{font-style:normal;color:#00653a}
p{font-size:30px;color:#45554b;margin-top:22px;line-height:1.35}
.call{display:inline-block;margin-top:30px;background:#00653a;color:#fff;font:800 38px/1 'Public Sans';padding:20px 28px;border-radius:12px}
.sign{background:#00653a;color:#fff;border-radius:22px;padding:14px}
.in{border:5px solid #fff;border-radius:14px;padding:34px;display:grid;gap:20px}
.top{display:flex;justify-content:space-between;align-items:center}
.shield{background:#ffc81a;color:#1a1400;font:900 34px/1 Overpass;padding:16px 18px 18px;border-radius:10px 10px 26px 26px}
.sub{font:800 22px/1.3 Overpass;letter-spacing:.08em;text-transform:uppercase;text-align:right}
.name{font:900 92px/.92 Overpass;text-transform:uppercase}
.exit{border-top:3px solid rgba(255,255,255,.6);padding-top:18px;font:800 26px/1 Overpass;letter-spacing:.08em;text-transform:uppercase}
</style></head><body>
<div><h1>Stuck on the road? <em>Alejos</em> is on the way.</h1><p>24/7 towing &amp; roadside help · Cape Coral, Fort Myers &amp; all of Florida</p><div class="call">(239) 888-7001</div></div>
<div class="sign"><div class="in"><div class="top"><span class="shield">24/7</span><span class="sub">Towing · Roadside<br>Recovery</span></div><div class="name">Alejos<br>Towing</div><div class="exit">Help ahead →</div></div></div>
</body></html>`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('icons and og.png written');
