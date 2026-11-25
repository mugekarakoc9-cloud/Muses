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
 await page.evaluate(()=>go('home'));
 await page.waitForSelector('.mx-floating-cat',{state:'visible'});const cat=page.locator('.mx-floating-cat');await cat.hover();const cb=await cat.boundingBox();await page.mouse.move(cb.x+cb.width/2,cb.y+cb.height/2);await page.mouse.down();await page.mouse.move(cb.x+cb.width/2-75,cb.y+cb.height/2-100,{steps:10});await page.mouse.up();assert.equal(await cat.getAttribute('data-mx-pinned'),'yes');await page.evaluate(()=>mxResumeCatWalk());
 await page.evaluate(()=>{go('library');mxImportLibrary();});await page.locator('#mx-lib-form [name=file]').setInputFiles({name:'test.txt',mimeType:'text/plain',buffer:Buffer.from('Türkçe karakterler: ğüşiöç. English text.')});await page.locator('#mx-lib-form button.primary').click();await page.waitForSelector('.mx-quiet-bar');assert.match(await page.locator('.readerPage9').innerText(),/Türkçe/);await page.locator('.mx-quiet-bar button').first().click();await page.evaluate(()=>go('home'));

 await page.locator('.mx-focus-grip').waitFor();
 const grip=page.locator('.mx-focus-grip'),dock=page.locator('.mx-focus-dock');
 const pos=await grip.boundingBox();await page.mouse.move(pos.x+pos.width/2,pos.y+pos.height/2);await page.mouse.down();await page.mouse.move(pos.x-125,pos.y-110,{steps:10});await page.mouse.up();
 assert(await dock.evaluate(el=>Boolean(el.style.left)),'Focus dock position should be draggable');
 await dock.locator('.mx-time').click();assert(await dock.evaluate(el=>el.classList.contains('mx-focus-mini')));await dock.locator('.mx-time').click();
 await page.evaluate(()=>mxFocusSoundSettings());assert.equal(await page.locator('[data-event-theme]').count(),6);await page.evaluate(()=>close5());
 await page.evaluate(()=>mxCelebrate('task','Test',true));assert(await page.locator('.mx-celebrate-task').count());await page.evaluate(()=>mxCelebrate('trophy','Test',true));assert(await page.locator('.mx-celebrate-trophy').count());
 await page.evaluate(()=>go('english'));assert(await page.locator('.mx-palace').count(),'New journey should be the default');await page.evaluate(()=>go('home'));

 await page.waitForFunction(()=>[...document.querySelectorAll('img.mx-real-cat')].some(img=>img.complete&&img.naturalWidth>0),{},{timeout:20000});
 assert.match(await page.locator('#app').innerText(),/0\.15\.0/);
 await page.evaluate(()=>openPaletteP1());
 await page.locator('#paletteKindP1').waitFor();
 const kinds=await page.locator('#paletteKindP1 option').allTextContents();
 for(const kind of ['Ekran','Kaynak','Alt bölüm','Kelime','Kitap','P90X'])assert(kinds.includes(kind),'Missing search category: '+kind);
 await page.locator('#paletteP1 [name=query]').fill('P90X');
 assert.match(await page.locator('#resultsP1').innerText(),/P90X/i);
 await page.evaluate(()=>close5());
 await page.evaluate(()=>focusOpen7());
 await page.locator('#mx-focus-form').waitFor();
 await page.locator('#mx-focus-form [name=kind]').selectOption('goal');
 assert.equal(await page.locator('#mx-focus-form [name=target] option').count(),await page.evaluate(()=>v5().challenges.length));
 await page.locator('#mx-focus-form [name=kind]').selectOption('resource');
 assert(await page.locator('#mx-focus-form [name=target] option').count()>0);
 assert(await page.locator('#mx-focus-form [name=leaf] option').count()>0);
 await page.locator('#mx-focus-form [name=targetSearch]').fill('zzzz-no-such-target-12345');
 assert.equal(await page.locator('#mx-focus-form [name=target] option').count(),0);
 assert(await page.locator('#mx-focus-form button.primary').isDisabled());
 await page.evaluate(()=>close5());
 await page.evaluate(()=>{go('calendar');mxHourlyMode('week');});assert.equal(await page.locator('[data-mx-drop-date]').count(),175);await page.evaluate(()=>mxHourlyMode('day'));assert.equal(await page.locator('[data-mx-drop-date]').count(),25);await page.evaluate(()=>mxHourlyMode('month'));assert(await page.locator('.cell5').count()>=28);await page.locator('.calendar5 button[onclick="mxHourlyMode(\'day\')"]').first().click();assert.equal(await page.locator('[data-mx-drop-date]').count(),25);await page.evaluate(()=>mxMimoGallery());assert.equal(await page.locator('[data-mimo-pose]').count(),11);await page.evaluate(()=>close5());
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
