import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,ignoreHTTPSErrors:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/design/preview/_wrapped.html#highway',{waitUntil:'networkidle'});
const ok=(c,m)=>console.log(c?'PASS':'FAIL',m);
ok(await p.$eval('#actionbar',e=>e.classList.contains('away')),'action bar hidden while hero buttons visible');
await p.mouse.wheel(0,900); await p.waitForTimeout(500);
ok(!(await p.$eval('#actionbar',e=>e.classList.contains('away'))),'action bar shows after scrolling past hero');
await p.tap('#menu-open'); ok(await p.isVisible('#sheet'),'menu opens'); await p.keyboard.press('Escape'); ok(!(await p.isVisible('#sheet')),'Escape closes menu');
await p.tap('.chip[data-issue="Flat tire"]'); await p.waitForTimeout(900);
ok(await p.$eval('#f-issue',e=>e.value)==='Flat tire','chip prefills issue');
ok(await p.evaluate(()=>document.activeElement.id)==='f-loc','focus moves to location');
await p.click('#submit-btn'); await p.waitForTimeout(200);
ok(await p.isVisible('#err-summary'),'empty submit shows error summary');
ok(await p.$$eval('.field.invalid',e=>e.length)===3,'3 invalid fields flagged');
await p.screenshot({path:'screenshots/j-errors.png'});
await p.fill('#f-loc','I-35 exit 150'); await p.fill('#f-name','Test Driver'); await p.fill('#f-phone','5125550199');
ok(await p.$eval('#f-phone',e=>e.value)==='(512) 555-0199','phone auto-formats');
await p.click('#loc-btn'); await p.waitForTimeout(400); console.log('   (location with no permission answer: hint =',JSON.stringify(await p.textContent('#loc-hint')),')');
{const g=await b.newContext({viewport:{width:390,height:844},geolocation:{latitude:26.5629,longitude:-81.9495},permissions:['geolocation'],ignoreHTTPSErrors:true});const gp=await g.newPage();await gp.goto('file://'+process.cwd()+'/design/preview/_wrapped.html');await gp.click('#loc-btn');await gp.waitForTimeout(800);
 ok((await gp.$eval('#f-loc',e=>e.value)).includes('GPS'),'location granted fills the field');
 await gp.selectOption('#f-issue','Dead battery');await gp.fill('#f-name','G');await gp.fill('#f-phone','2395550100');await gp.click('#submit-btn');await gp.waitForTimeout(1200);
 ok((await gp.textContent('#msg-text')).includes('maps.google.com/?q=26.56290,-81.94950'),'GPS map link included in the text');await g.close();}
{const g=await b.newContext({viewport:{width:390,height:844},ignoreHTTPSErrors:true});const gp=await g.newPage();await gp.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(s,e)=>e({code:1})});await gp.goto('file://'+process.cwd()+'/design/preview/_wrapped.html');await gp.click('#loc-btn');await gp.waitForTimeout(300);
 ok((await gp.textContent('#loc-hint')).includes("Couldn't"),'location denied shows fallback hint');await g.close();}
const nav=[]; p.on('request',r=>{}); await p.route('sms:*',r=>r.abort()).catch(()=>{});
await p.evaluate(()=>{window.__hrefs=[];const d=Object.getOwnPropertyDescriptor(Location.prototype,'href');});
await p.click('#submit-btn'); await p.waitForTimeout(150);
ok((await p.textContent('#submit-btn')).includes('Opening'),'loading state');
await p.waitForTimeout(1200); ok(await p.isVisible('#res-ok'),'send-by-text state shows'); await p.screenshot({path:'screenshots/j-success.png'});
const msg=await p.textContent('#msg-text'); console.log('   message:',JSON.stringify(msg));
ok(msg.includes('Flat tire')&&msg.includes('I-35 exit 150')&&msg.includes('(512) 555-0199'),'message contains the request details');
const href=await p.getAttribute('#sms-again','href'); ok(href.startsWith('sms:+12398887001?&body=')&&decodeURIComponent(href).includes('Test Driver'),'Messages link addressed to 239-888-7001 with body');
ok(await p.getAttribute('a.btn-call[data-call]','href')==='tel:+12398887001','call buttons dial 239-888-7001');
ok(await p.$$eval('a[href^="tel:"]',as=>as.every(a=>a.getAttribute('href')==='tel:+12398887001')),'every call link uses the same number');
// Headless Chromium holds real input after the page hands sms: to the OS (there is no Messages app here), so press the button from script.
await p.$eval('[data-reset]',e=>e.click()); await p.waitForTimeout(300); console.log('   after reset:',await p.isVisible('#qf'),JSON.stringify(await p.$eval('#f-loc',e=>e.value))); ok(await p.isVisible('#qf')&&await p.$eval('#f-loc',e=>e.value)==='','new request resets the form');
console.log('page errors:',errs.length?errs:'none');
// keyboard: first tabs
const k=await b.newPage({viewport:{width:1440,height:900}}); await k.goto('file://'+process.cwd()+'/design/preview/_wrapped.html');
const seq=[];for(let i=0;i<8;i++){await k.keyboard.press('Tab');seq.push(await k.evaluate(()=>{const a=document.activeElement;return (a.textContent||a.getAttribute('aria-label')||a.tagName).trim().replace(/\s+/g,' ').slice(0,30)}))}
console.log('tab order:',seq.join(' > '));
await b.close();
