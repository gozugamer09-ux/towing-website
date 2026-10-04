// Full-site check of a built folder: every page at phone, tablet and desktop sizes.
// Usage: node tests/site.mjs [dist-preview|dist] [--shots]
// Checks: page loads without errors, no sideways scrolling, one <h1>, title and description,
// valid JSON-LD, every internal link resolves, every call/text link uses the company number,
// touch targets are at least 44px on phones, axe accessibility scan, page language and the
// language switch (English at /, Spanish under /es/), and the request journey in both languages.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { serve } from './serve.mjs';

const root = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist-preview';
const SHOTS = process.argv.includes('--shots');
const TEL = 'tel:+12398887001', SMS = 'sms:+12398887001';
const { server, url } = await serve(root);
// Use CHROME_PATH or the build environment's Chromium when present; otherwise Playwright's own browser (CI).
const LOCAL_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.CHROME_PATH || (fs.existsSync(LOCAL_CHROME) ? LOCAL_CHROME : undefined);
const browser = await chromium.launch({ executablePath });

const pages = [];
(function walk(dir, base = '') {
  for (const f of fs.readdirSync(dir)) {
    const p = `${dir}/${f}`;
    if (fs.statSync(p).isDirectory()) { if (f !== '_astro') walk(p, `${base}/${f}`); }
    else if (f === 'index.html') pages.push(`${base}/`);
  }
})(root);
pages.sort();

let failures = 0;
const fail = (msg) => { failures++; console.log('  FAIL', msg); };
const pass = (msg) => console.log('  ok  ', msg);
const sizes = { phone: [390, 844], small: [360, 740], tablet: [820, 1180], desktop: [1440, 900] };
if (SHOTS) fs.mkdirSync('screenshots/site', { recursive: true });

const linkTargets = new Set();
const titles = new Map();

for (const path of pages) {
  console.log(path);
  for (const [name, [w, h]] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: name !== 'desktop', isMobile: name === 'phone' || name === 'small' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
    const res = await page.goto(url + path, { waitUntil: 'networkidle' });
    if (res.status() !== 200) fail(`${name}: HTTP ${res.status()}`);
    await page.waitForTimeout(300);
    // Compare with the intended width: phone emulation widens innerWidth to fit content that overflows.
    const overflow = await page.evaluate((width) => document.documentElement.scrollWidth - width, w);
    if (overflow > 0) fail(`${name}: page scrolls sideways by ${overflow}px`);
    if (errors.length) fail(`${name}: errors ${JSON.stringify(errors)}`);

    if (name === 'phone') {
      const info = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
        switchTo: document.querySelector('.langbar a')?.getAttribute('href'),
        title: document.title,
        desc: document.querySelector('meta[name=description]')?.content || '',
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
        small: [...document.querySelectorAll('.btn, .chip, .icon-btn, .loc-btn, .faq summary, .nav a, .navlink, .langbar a')]
          .filter((el) => el.offsetParent !== null)
          .map((el) => ({ t: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width }))
          .filter((r) => r.h < 44 || r.w < 44),
      }));
      if (info.h1 !== 1) fail(`expected one h1, found ${info.h1}`);
      const es = path.startsWith('/es/');
      if (info.lang !== (es ? 'es' : 'en')) fail(`page language is "${info.lang}"`);
      if (!info.switchTo || info.switchTo.startsWith('/es/') === es) fail(`language switch goes to ${info.switchTo}`);
      if (!info.title || !info.desc) fail('missing title or description');
      if (titles.has(info.title)) fail(`duplicate title with ${titles.get(info.title)}`); else titles.set(info.title, path);
      for (const s of info.ld) { try { JSON.parse(s); } catch { fail('invalid JSON-LD'); } }
      for (const l of info.links) {
        if (l.startsWith('tel:') && l !== TEL) fail(`wrong call link ${l}`);
        if (l.startsWith('sms:') && !l.startsWith(SMS)) fail(`wrong text link ${l}`);
        if (l.startsWith('/')) linkTargets.add(l.split('#')[0].split('?')[0]);
      }
      if (info.small.length) fail(`touch targets under 44px: ${JSON.stringify(info.small)}`);
    }
    if (name === 'phone' || name === 'desktop') {
      const axe = await new AxeBuilder({ page }).analyze();
      for (const v of axe.violations) fail(`${name}: axe ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    }
    if (SHOTS && name !== 'small') {
      const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '_');
      // animations: 'disabled' shows entrance animations in their settled state. (A full-page capture
      // briefly resizes the page, which would otherwise restart the service-page sign's drop-in.)
      if (name === 'phone') {
        // What a visitor sees on arrival.
        await page.screenshot({ path: `screenshots/site/${slug}-phone-first.png`, animations: 'disabled' });
      }
      // The fixed action bar would be drawn mid-page in a full-page capture, so leave it out there.
      await page.addStyleTag({ content: '#actionbar { visibility: hidden !important; }' });
      await page.screenshot({ path: `screenshots/site/${slug}-${name}.png`, fullPage: true, animations: 'disabled' });
    }
    await ctx.close();
  }
}

console.log('internal links');
{
  const ctx = await browser.newContext();
  for (const l of linkTargets) {
    const r = await ctx.request.get(url + l, { maxRedirects: 0 });
    if (r.status() !== 200) fail(`link ${l} -> HTTP ${r.status()}`);
  }
  const missing = await ctx.request.get(url + '/no-such-page/');
  if (missing.status() !== 404 || !(await missing.text()).includes('<html lang="en"')) fail('unknown page should return the English 404');
  const missingEs = await ctx.request.get(url + '/es/no-existe/');
  if (missingEs.status() !== 404 || !(await missingEs.text()).includes('<html lang="es"')) fail('unknown Spanish page should return the Spanish 404');
  pass(`${linkTargets.size} internal link targets checked`);
  await ctx.close();
}

console.log('request journey (phone)');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, geolocation: { latitude: 26.5629, longitude: -81.9495 }, permissions: ['geolocation'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(url + '/', { waitUntil: 'networkidle' });
  const ok = (c, m) => (c ? pass(m) : fail(m));
  ok(await p.$eval('#actionbar', (e) => e.classList.contains('away')), 'action bar hidden while hero buttons are visible');
  await p.mouse.wheel(0, 1000); await p.waitForTimeout(500);
  ok(!(await p.$eval('#actionbar', (e) => e.classList.contains('away'))), 'action bar appears after scrolling past the hero');
  await p.tap('[data-menu-open]'); ok(await p.isVisible('#sheet'), 'menu opens');
  await p.keyboard.press('Escape'); ok(!(await p.isVisible('#sheet')), 'Escape closes the menu');
  await p.tap('.chip[data-issue="flat-tire"]'); await p.waitForTimeout(900);
  ok((await p.$eval('#rf-issue', (e) => e.value)) === 'Flat tire', 'quick-pick fills in what happened');
  ok((await p.evaluate(() => document.activeElement.id)) === 'rf-loc', 'focus moves to the location field');
  ok(await p.$eval('#actionbar', (e) => e.classList.contains('away')), 'action bar hides while the form is on screen');
  await p.click('#rf-submit'); await p.waitForTimeout(200);
  ok(await p.isVisible('#rf-errors'), 'sending an incomplete form lists what to fix');
  ok((await p.$$eval('.field.invalid', (e) => e.length)) === 3, 'three missing fields are flagged');
  ok((await p.evaluate(() => document.activeElement.id)) === 'rf-errors', 'focus moves to the error list');
  await p.click('#rf-locbtn'); await p.waitForTimeout(600);
  ok((await p.$eval('#rf-loc', (e) => e.value)).includes('GPS'), 'Use my location fills the location');
  ok((await p.textContent('#rf-lochint')).includes('Location added'), 'location success message shows');
  await p.fill('#rf-name', 'Test Driver'); await p.fill('#rf-phone', '2395550199');
  ok((await p.$eval('#rf-phone', (e) => e.value)) === '(239) 555-0199', 'phone number formats as you type');
  ok((await p.$$eval('.field.invalid', (e) => e.length)) === 0, 'errors clear once fixed');
  await p.click('#rf-submit'); await p.waitForTimeout(150);
  ok((await p.textContent('#rf-submit')).includes('Opening'), 'button shows a sending state');
  await p.waitForTimeout(1200);
  ok(await p.isVisible('#rf-done'), 'press-Send screen appears');
  const msg = await p.textContent('#rf-msg');
  ok(msg.includes('Flat tire') && msg.includes('maps.google.com/?q=26.56290,-81.94950') && msg.includes('(239) 555-0199'), 'text includes the issue, map pin and callback number');
  const smsHref = await p.getAttribute('#rf-sms', 'href');
  ok(smsHref.startsWith('sms:+12398887001?&body=') && decodeURIComponent(smsHref).includes('Test Driver'), 'Messages link is addressed to (239) 888-7001 with the text');
  ok(decodeURIComponent(await p.getAttribute('#rf-mail', 'href')).startsWith('mailto:alejostowing85@gmail.com?subject=Tow request: Flat tire'), 'email fallback is addressed to the company');
  if (SHOTS) await p.screenshot({ path: 'screenshots/site/journey-done-phone.png' });
  // Headless Chromium holds real input after handing sms: to the OS (no Messages app here), so press from script.
  await p.$eval('#rf-new', (e) => e.click()); await p.waitForTimeout(200);
  ok(await p.isVisible('#rf') && (await p.$eval('#rf-loc', (e) => e.value)) === '', 'Start a new request clears the form');
  ok(!errors.length, `no script errors during the journey ${errors.join(' ')}`);
  await ctx.close();

  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await ctx2.newPage();
  await p2.addInitScript(() => { navigator.geolocation.getCurrentPosition = (s, e) => e({ code: 1 }); });
  await p2.goto(url + '/request/?issue=accident', { waitUntil: 'networkidle' });
  ok((await p2.$eval('#rf-issue', (e) => e.value)) === 'Accident', 'links from other pages preselect what happened');
  await p2.click('#rf-locbtn'); await p2.waitForTimeout(300);
  ok((await p2.textContent('#rf-lochint')).includes("Couldn't"), 'denied location explains what to type instead');
  await ctx2.close();
}

console.log('request journey in Spanish (phone)');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, geolocation: { latitude: 26.5629, longitude: -81.9495 }, permissions: ['geolocation'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const ok = (c, m) => (c ? pass(m) : fail(m));
  await p.goto(url + '/es/', { waitUntil: 'networkidle' });
  await p.tap('.chip[data-issue="flat-tire"]'); await p.waitForTimeout(900);
  ok((await p.$eval('#rf-issue', (e) => e.value)) === 'Goma ponchada', 'quick-pick fills in what happened, in Spanish');
  await p.click('#rf-submit'); await p.waitForTimeout(200);
  ok((await p.textContent('#rf-errors')).includes('Corrija estos 3 datos'), 'the list of what to fix is in Spanish');
  await p.click('#rf-locbtn'); await p.waitForTimeout(600);
  ok((await p.textContent('#rf-lochint')).includes('Ubicación agregada'), 'location message is in Spanish');
  await p.fill('#rf-name', 'Prueba'); await p.fill('#rf-phone', '2395550199');
  await p.click('#rf-submit'); await p.waitForTimeout(1400);
  const msg = await p.textContent('#rf-msg');
  ok(msg.startsWith('Solicitud de grúa') && msg.includes('Qué pasó: Goma ponchada') && msg.includes('Mapa: https://maps.google.com/?q=26.56290,-81.94950'), 'the text is written in Spanish with the map pin');
  ok((await p.getAttribute('#rf-sms', 'href')).startsWith('sms:+12398887001?&body='), 'Messages link is addressed to (239) 888-7001');
  ok(decodeURIComponent(await p.getAttribute('#rf-mail', 'href')).includes('subject=Solicitud de grúa: Goma ponchada'), 'email fallback subject is in Spanish');
  ok(!errors.length, `no script errors during the Spanish journey ${errors.join(' ')}`);
  await p.goto(url + '/es/pedir-grua/?issue=accident', { waitUntil: 'networkidle' });
  ok((await p.$eval('#rf-issue', (e) => e.value)) === 'Accidente', 'links from Spanish pages preselect what happened');
  await ctx.close();
}

console.log('keyboard (desktop)');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(url + '/', { waitUntil: 'networkidle' });
  const seq = [];
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => (document.activeElement.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28))); }
  console.log('  tab order:', seq.join(' > '));
  if (!seq[0].includes('Skip')) fail('first Tab should reach "Skip to content"');
  await ctx.close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} problem(s) found` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
