import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';
const root=resolve('.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),p=resolve(root,'.'+(name==='/'?'/index.html':name));if(!p.startsWith(root+sep))throw Error('Path');const b=await readFile(p);res.writeHead(200,{'Content-Type':types[extname(p)]||'application/octet-stream'});res.end(b);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.mxRootInteraction&&window.mxTrainingWorkspace&&window.mxMimoRewardsInstalled&&window.mxDailyLearningReady,{},{timeout:30000});
 await page.waitForFunction(()=>document.querySelector('img.mx-real-cat'),{},{timeout:30000});
 assert.equal(await page.locator('img.mx-real-cat').count()>0,true);
 const views=['home','resources','flash','library','english','goals','calendar','p90','atlas','habits','journal'];
 for(const view of views){await page.evaluate(v=>go(v),view);await page.waitForTimeout(100);assert(await page.locator('#app').innerText());assert.equal(errors.length,0,view+': '+errors.join('; '));}
 await page.evaluate(()=>{go('p90');playDVD6(1);});await page.locator('#mx-training-workspace').waitFor();
 const field=page.locator('#mx-training-workspace [data-field="right"]').first();await field.fill('7');await field.blur();
 assert.equal(await page.evaluate(()=>Number(p90entry(pday).moves['1-0'].right)),7);
 await page.evaluate(()=>close5());
 await page.setViewportSize({width:390,height:844});
 for(const view of ['home','resources','flash','library','english','p90']){await page.evaluate(v=>go(v),view);assert(await page.locator('#app').innerText());assert.equal(errors.length,0,view+': '+errors.join('; '));}
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.mxTrainingWorkspace,{},{timeout:30000});
 assert.equal(await page.evaluate(()=>Number(v2().p90[String(v2().p90Run)+'-1']?.moves?.['1-0']?.right)),7);
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS: real browser startup, navigation, bundled Mimo, P90 record persistence and mobile render');
 await context.close();
}finally{await browser?.close();await new Promise(r=>server.close(r));}
