import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
const body = fs.readFileSync('design/preview/alejos-preview.html','utf8');
fs.writeFileSync('design/preview/_wrapped.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${body}</body></html>`);
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}).catch(()=>chromium.launch());
const url = 'file://'+process.cwd()+'/design/preview/_wrapped.html';
const sizes = {phone:[390,844],tablet:[820,1180],desktop:[1440,900]};
for (const dir of (process.argv[2]||'highway,night,door').split(',')) for (const [n,[w,h]] of Object.entries(sizes)) {
  const ctx = await b.newContext({viewport:{width:w,height:h}, deviceScaleFactor:1, hasTouch:n!=='desktop', ignoreHTTPSErrors:true}); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto(url+'#'+dir, {waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
  const fonts = await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i));
  await p.screenshot({path:`screenshots/${dir}-${n}-top.png`});
  await p.screenshot({path:`screenshots/${dir}-${n}-full.png`, fullPage:true});
  let axe='';
  if (n==='phone'||n==='desktop'){ const r = await new AxeBuilder({page:p}).analyze(); axe = r.violations.map(v=>`${v.id}(${v.nodes.length}): ${v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')}`).join('\n   '); }
  console.log(dir,n,'overflow',ov,'errors',errs.length?errs:'none','fonts',fonts.join(','),'\n   axe:',axe||'clean');
  await ctx.close();
}
await b.close();
