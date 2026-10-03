import { chromium } from 'playwright'; import AxeBuilder from '@axe-core/playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for (const dir of ['highway','night','door']){
const ctx=await b.newContext({viewport:{width:390,height:844},ignoreHTTPSErrors:true}); const p=await ctx.newPage();
await p.goto('file://'+process.cwd()+'/design/preview/_wrapped.html#'+dir,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const r=await new AxeBuilder({page:p}).withRules(['color-contrast']).analyze();
for(const v of r.violations) for(const n of v.nodes) console.log(dir, n.target.join(' '),'::',n.any[0]?.message);
await ctx.close();}
await b.close();
