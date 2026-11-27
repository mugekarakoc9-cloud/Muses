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
 await page.waitForFunction(()=>window.mxR39Studio);
 await page.evaluate(()=>{go('home');mxHourlyCreate(today());});
 assert.equal(await page.locator('#quick5 .mx39-time').count(),1);
 assert.equal(await page.locator('#quick5 .mx39-unit').count(),1);
 await page.locator('#quick5 [name=repeat]').selectOption('custom39');
 assert.equal(await page.locator('#quick5 .mx39-days button').count(),7);
 await page.evaluate(()=>{close5();go('home');});
 assert.equal(await page.locator('.mx39-today-metrics button').count(),6);
 console.log('PASS: R39 themed time and unit controls, first-entry weekday selector, daily metrics');


 // Generate a real, short local video in the test browser. No private media is published.
 await page.evaluate(async()=>{
  const canvas=document.createElement('canvas');canvas.width=160;canvas.height=90;
  const ctx=canvas.getContext('2d');const stream=canvas.captureStream(15);
  const recorder=new MediaRecorder(stream,{mimeType:'video/webm'}),chunks=[];
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  const stopped=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=reject;});
  recorder.start();for(let i=0;i<18;i++){ctx.fillStyle=i%2?'#285b72':'#794e86';ctx.fillRect(0,0,160,90);ctx.fillStyle='#fff';ctx.fillRect(i*5,30,20,20);await new Promise(r=>setTimeout(r,75));}
  recorder.stop();await stopped;stream.getTracks().forEach(t=>t.stop());
  const blob=new Blob(chunks,{type:'video/webm'});if(!blob.size)throw Error('Video fixture empty');
  await put6('media','p90-1',blob);window.mxTestVideoBlob=blob;
 });
 // Owner-only Drive settings are exposed without storing credentials in source.
 await page.evaluate(()=>mxDriveSettings());
 assert.match(await page.locator('[data-drive-status]').innerText(),/Bağlı değil/);
 assert(await page.locator('[data-drive-connect]').isVisible());
 assert(await page.locator('[data-drive-sync]').isDisabled());
 await page.evaluate(()=>close5());
 // P90X day navigation: no duplicate daily player; scheduled DVD opens the set workspace.
 await page.evaluate(()=>{pday=1;go('p90');});
 assert.equal(await page.getByRole('heading',{name:'Günün video oynatıcısı',exact:true}).count(),0);
 assert.equal(await page.getByRole('heading',{name:'12 DVD · Medya ve set stüdyosu',exact:true}).count(),0);
 assert.deepEqual(await page.locator('[data-p90-dvd]').evaluateAll(els=>els.map(el=>Number(el.dataset.p90Dvd))),[1,12]);
 await page.locator('[data-p90-dvd="1"] .mx-p90-dvd-open').click();
 await page.locator('#mx-training-workspace').waitFor();assert.match(await page.locator('#dialog5 h2').innerText(),/Chest & Back/);
 const realVideo=page.locator('#mx-training-workspace video');await realVideo.waitFor();
 await realVideo.evaluate(async v=>{v.muted=true;await v.play();});
 await page.waitForFunction(()=>{const v=document.querySelector('#mx-training-workspace video');return v&&v.videoWidth>0&&v.currentTime>0.2&&!v.error;},{},{timeout:12000});
 console.log('PASS: actual local video frames decoded and playback time advanced inside DVD workspace (generated fixture, not private P90X footage)');

 await page.evaluate(()=>{close5();pday=2;render();});
 assert.deepEqual(await page.locator('[data-p90-dvd]').evaluateAll(els=>els.map(el=>Number(el.dataset.p90Dvd))),[2]);
 await page.locator('[data-p90-dvd="2"] .mx-p90-dvd-open').click();
 await page.locator('#mx-training-workspace').waitFor();assert.match(await page.locator('#dialog5 h2').innerText(),/DVD 2/);
 await page.evaluate(()=>{close5();mxTrainingSettings(2);});
 const fixture=Buffer.from(await page.evaluate(async()=>Array.from(new Uint8Array(await window.mxTestVideoBlob.arrayBuffer()))));
 await page.locator('#mx-training-file').setInputFiles({name:'02 - Plyometrics.webm',mimeType:'video/webm',buffer:fixture});
 await page.locator('#mx-training-workspace video').waitFor({timeout:30000});
 assert.equal(await page.evaluate(async()=> (await get6('media','p90-2')).size),fixture.length);
 const imported=page.locator('#mx-training-workspace video');
 await imported.evaluate(async v=>{v.muted=true;await v.play();});
 await page.waitForFunction(()=>{const v=document.querySelector('#mx-training-workspace video');return v&&v.videoWidth>0&&v.currentTime>0.2&&!v.error;},{},{timeout:12000});
 await page.evaluate(()=>{close5();mxTrainingSettings(3);});
 const linkInput=page.locator('#mx-training-link input[name=url]'),saveLink=page.locator('#mx-training-link-save');
 assert(await linkInput.isVisible());assert(await saveLink.isVisible());
 const fakeDrive='https://drive.google.com/open?id=fixture_drive_video_03&resourcekey=0-testkey';
 await linkInput.fill(fakeDrive);await saveLink.click();
 await page.waitForFunction(()=>document.querySelector('#mx-training-drive-status')?.textContent.includes('Bağlantı kaydedildi'));
 const canonicalDrive='https://drive.google.com/file/d/fixture_drive_video_03/view?resourcekey=0-testkey';
 assert.equal(await page.evaluate(()=>v6().videoLinks[3]),canonicalDrive);
 await page.evaluate(()=>{close5();mxTrainingSettings(3);});
 assert.equal(await page.locator('#mx-training-link input[name=url]').inputValue(),canonicalDrive);
 await page.evaluate(()=>close5());
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.mxTrainingWorkspace,{},{timeout:30000});
 await page.evaluate(()=>mxTrainingSettings(3));
 assert.equal(await page.locator('#mx-training-link input[name=url]').inputValue(),canonicalDrive);
 // Shared Drive links restore the visible embedded media surface without OAuth.
 // Google preview is mocked, but the fixture video must actually decode and play.
 const previewURL='https://drive.google.com/file/d/fixture_drive_video_03/preview?resourcekey=0-testkey';
 await page.route('https://drive.google.com/file/d/fixture_drive_video_03/preview*',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><video controls muted playsinline src="data:video/webm;base64,'+fixture.toString('base64')+'"></video>'}));
 await page.locator('#mx-training-link-open').click();
 const stage=page.locator('#mx-training-workspace [data-player]');
 const preview=stage.locator('iframe');await preview.waitFor();
 assert.equal(await preview.getAttribute('src'),previewURL);
 assert((await stage.boundingBox()).height>90);
 const embeddedVideo=page.frameLocator('#mx-training-workspace [data-player] iframe').locator('video');
 await embeddedVideo.waitFor();await embeddedVideo.evaluate(async v=>{await v.play();});
 await embeddedVideo.evaluate(v=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Preview fixture did not advance')),12000);const check=()=>{if(v.videoWidth>0&&v.currentTime>0.2&&!v.error){clearTimeout(timer);v.removeEventListener('timeupdate',check);resolve();}};v.addEventListener('timeupdate',check);check();}));
 console.log('PASS: R23 visible Drive preview surface plays a real fixture; actual Google preview not verified');
 // Movement entry is usable and saved even when the DVD has no authorized media.
 const noMediaSet=page.locator('#mx-training-workspace .mx-training-set').first();
 await noMediaSet.locator('[data-field="reps"]').fill('9');
 await page.locator('[data-training-save]').click();
 await page.waitForFunction(()=>document.querySelector('[data-record-status]')?.textContent==='Kaydedildi ✓');
 assert.equal(await page.evaluate(()=>Number(v2().p90[v2().p90Run+'-'+pday].moves['3-0'].reps)),9);
 await page.evaluate(()=>{close5();pday=1;go('home');});
 await page.unroute('https://drive.google.com/file/d/fixture_drive_video_03/preview*');
 // Test actual nested resource navigation before unrelated calendar assertions.
 const nested=await page.evaluate(()=>{for(const r of resourceRows()){const tree=sourceTree(r);const group=tree.find(x=>x.children?.length);if(group)return {rid:r.id,id:group.id,children:group.children.map(x=>x.id)};}return null;});
 assert(nested,'A nested resource must exist');await page.evaluate(r=>mxPalaceOpen(enc5(r)),nested.rid);
 const groupStop=page.locator('.mx-stop').filter({has:page.locator('.mx-subpath-open')}).first();await groupStop.locator('.mx-node').click();await page.getByRole('button',{name:'Alt durakları aç',exact:true}).click();
 assert.deepEqual(await page.locator('.mx-road-view .mx-stop').evaluateAll(els=>els.map(e=>e.dataset.stopId)),nested.children,'Child path must contain only immediate children');
 await page.getByRole('button',{name:'Üst yola dön',exact:true}).click();assert(await page.locator('.mx-road-view .mx-subpath-open').count()>0);
 await page.evaluate(()=>go('home'));
 await page.waitForSelector('.mx-floating-cat',{state:'visible'});const cat=page.locator('.mx-floating-cat');await cat.hover();const cb=await cat.boundingBox();await page.mouse.move(cb.x+cb.width/2,cb.y+cb.height/2);await page.mouse.down();await page.mouse.move(cb.x+cb.width/2-75,cb.y+cb.height/2-100,{steps:10});await page.mouse.up();assert.equal(await cat.getAttribute('data-mx-pinned'),'yes');await page.evaluate(()=>mxResumeCatWalk());
 await cat.click();const catPanel=page.locator('#mx-cat-panel');await catPanel.waitFor({state:'visible'});assert.equal(await cat.getAttribute('aria-expanded'),'true');assert.equal(await cat.getAttribute('data-pose'),'love');
 await catPanel.getByRole('button',{name:'Oyna',exact:true}).click();assert.equal(await cat.getAttribute('data-pose'),'play');
 await catPanel.getByRole('button',{name:'Uygulama'}).click();await catPanel.getByRole('button',{name:'Ajanda',exact:true}).click();assert.equal(await page.evaluate(()=>view),'calendar');assert.equal(await catPanel.count(),0);
 await page.evaluate(()=>go('home'));await cat.click();await catPanel.waitFor({state:'visible'});await page.keyboard.press('Escape');assert.equal(await catPanel.count(),0);assert.equal(await cat.getAttribute('aria-expanded'),'false');
 await page.setViewportSize({width:390,height:844});await cat.click();await catPanel.waitFor({state:'visible'});const panelBox=await catPanel.boundingBox();assert(panelBox.x>=0&&panelBox.y>=0&&panelBox.x+panelBox.width<=391&&panelBox.y+panelBox.height<=845,'Mimo panel fits mobile viewport');await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:900});

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
 assert.match(await page.locator('#app').innerText(),/0\.16\.11/);
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
 await page.evaluate(()=>{go('calendar');mxHourlyMode('week');});assert.equal(await page.locator('[data-mx-drop-date]').count(),175);await page.evaluate(()=>mxHourlyMode('day'));assert.equal(await page.locator('[data-mx-drop-date]').count(),25);
 const slot=page.locator('.mx-hour-cell:not(:has(.mx-hour-task)):not([data-mx-drop-hour="-1"])').first();
 const expectedDate=await slot.getAttribute('data-mx-drop-date'),expectedHour=await slot.getAttribute('data-mx-drop-hour');
 const hit=slot.locator('.mx-hour-add');assert.equal(await hit.textContent(),'');
 await hit.click({position:{x:12,y:12}});
 assert.equal(await page.evaluate(()=>q5Draft.date),expectedDate);
 assert.equal(await page.evaluate(()=>q5Draft.time),expectedHour.padStart(2,'0')+':00');
 await page.evaluate(()=>close5());

 await page.evaluate(()=>{S.tasks.push({id:'mx-test-drag-task',title:'Test agenda drag',module:'general',date:selected,time:'10:00',done:false,priority:'Orta',note:'',amount:1});render();});
 const dragCard=page.locator('[data-mx-hour-task]').filter({hasText:'Test agenda drag'});await dragCard.waitFor();
 await page.evaluate(()=>{const s=document.querySelector('.mx-hour-scroll'),cell=s.querySelector('[data-mx-drop-hour="10"]');s.scrollTop=cell.offsetTop-s.querySelector('.mx-hour-grid').offsetTop-100;});
 await dragCard.scrollIntoViewIfNeeded();const startBox=await dragCard.boundingBox(),targetBox=await page.locator('[data-mx-drop-hour="11"]').boundingBox();
 await page.mouse.move(startBox.x+startBox.width/2,startBox.y+startBox.height/2);await page.mouse.down();await page.mouse.move(targetBox.x+targetBox.width/2,targetBox.y+targetBox.height/2,{steps:8});await page.mouse.up();
 assert.equal(await page.evaluate(()=>S.tasks.find(t=>t.id==='mx-test-drag-task').time),'11:00','Mouse drag persists exact target hour');
 await page.evaluate(()=>{S.tasks=S.tasks.filter(t=>t.id!=='mx-test-drag-task');save();render();});
 await page.evaluate(()=>{mxHourlyCreate(today(),'12:00');mxResourceTaskPicker();});
 const sourceTask=page.locator('#mx-source-task');
 const fono=await page.evaluate(()=>resourceRows().find(r=>r.title.includes('Fono')).id);
 await sourceTask.locator('[name=source]').selectOption(fono);
 await sourceTask.locator('[name=search]').fill('47');
 assert.equal(await sourceTask.locator('[name=leaf] option').count(),0,'Completed Fono 47 must stay hidden');
 await sourceTask.locator('[name=search]').fill('46');
 assert(await sourceTask.locator('[name=leaf] option').count()>0,'Unfinished Fono 46 must be selectable');
 assert(await sourceTask.locator('.mx-source-checks input').count()>0);
 await sourceTask.locator('[name=search]').fill('');
 const choices=sourceTask.locator('.mx-source-checks input[type=checkbox]:enabled');
 assert(await choices.count()>=2);
 await choices.nth(0).check();await choices.nth(1).check();
 assert(await sourceTask.locator('.mx-source-checks input:checked').count()>=2);
 await page.evaluate(()=>close5());
 await page.evaluate(()=>go('flash'));
 await page.waitForSelector('#mxv-root .mxv-sidebar');
 const themes=await page.evaluate(()=>{
   const body=document.body,old=body.getAttribute('data-theme'),side=document.querySelector('#mxv-root .mxv-sidebar'),out={};
   for(const mode of ['light','dark']){body.dataset.theme=mode;out[mode]={bg:getComputedStyle(side).backgroundColor,fg:getComputedStyle(side).color};}
   if(old===null)body.removeAttribute('data-theme');else body.setAttribute('data-theme',old);
   return out;
 });
 assert.equal(themes.light.bg,'rgb(255, 255, 255)');
 assert.equal(themes.dark.bg,'rgb(38, 42, 56)');
 assert.notEqual(themes.light.fg,themes.dark.fg);
 const contrast=await page.evaluate(()=>{
   const lum=c=>{const values=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{const q=v/255;return q<=.04045?q/12.92:((q+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;};
   const root=document.body,old=root.dataset.theme,side=document.querySelector('#mxv-root .mxv-sidebar'),out={};
   for(const mode of ['light','dark']){root.dataset.theme=mode;const c=getComputedStyle(side),a=lum(c.color),b=lum(c.backgroundColor);out[mode]=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
   if(old)root.dataset.theme=old;else delete root.dataset.theme;return out;
 });
 assert(contrast.light>=4.5&&contrast.dark>=4.5,'Folder sidebar text contrast');
 assert(await page.locator('#mxv-root [data-mx-touch-drag]').count(),'Touch list drag handles available');

 await page.locator('#mxv-root [data-act="map"]').click();
 await page.locator('#mxv-root [data-map-key]').first().click();
 assert.equal(await page.locator('#mxv-root').getAttribute('data-mxv-page'),'map');
 assert(await page.locator('#mxv-root .mxv-map-info').innerText());
 await page.locator('#mxv-root [data-act="listLibrary"]').click();
 await page.evaluate(()=>{
   S.words??=[];
   S.words.push(...['alpha','beta','gamma','delta'].map((word,i)=>({'Word / Phrase':'mx-test-'+word,'Türkçe Anlam':'Test anlam '+i,POS:'noun',Source:'English File Test '+(i<2?'1':'2')})));
   S.mxVocabularyV2.session=null;S.mxVocabularyV2.cfg.limit=1;S.mxVocabularyV2.cfg.voice=false;
   S.mxVocabularyV2.cfg.prompt='Türkçe Anlam';S.mxVocabularyV2.cfg.answer='Word / Phrase';render();
 });
 await page.locator('#mxv-root [data-act="allGroups"]').click();
 assert(await page.locator('#mxv-root [data-group-check]').evaluateAll(els=>els.every(el=>el.checked)));
 if(!(await page.locator('#mxv-root [data-act="chooseList"]').isVisible())){if(await page.locator('#mxv-root [data-act="listLibrary"]').isVisible())await page.locator('#mxv-root [data-act="listLibrary"]').click();await page.locator('#mxv-root [data-group="src:English File"]').first().click();}
 await page.locator('#mxv-root [data-act="chooseList"]').click();
 await page.locator('#mxv-root [data-act="chooseMode:flash"]').click();
 await page.locator('#mxv-root [data-act="full"]').click();
 await page.setViewportSize({width:360,height:640});
 await page.locator('#mxv-root.mxv-full-study').waitFor();
 const cardBox=await page.locator('#mxv-root .mxv-card').boundingBox();
 assert(cardBox.y>=0&&cardBox.y+cardBox.height<=641,'Card stays within phone viewport');
 assert.equal(await page.locator('#mxv-root .mxv-flag').count(),5);
 await page.locator('#mxv-root [data-act="flip"]').click();
 await page.locator('#mxv-root [data-act="rate2"]').click();
 await page.locator('#mxv-root .mxv-recap').waitFor();
 assert.equal(await page.locator('#mxv-root [data-act="finishPractice"]').isVisible(),true);
 await page.locator('#mxv-root .mxv-recap [data-act="finishPractice"]').click();
 assert.equal(await page.evaluate(()=>S.mxVocabularyV2.session),null,'Review does not force writing');
 if(!(await page.locator('#mxv-root [data-act="chooseList"]').isVisible())){if(await page.locator('#mxv-root [data-act="listLibrary"]').isVisible())await page.locator('#mxv-root [data-act="listLibrary"]').click();await page.locator('#mxv-root [data-group="src:English File"]').first().click();}
 await page.locator('#mxv-root [data-act="chooseList"]').click();
 await page.locator('#mxv-root [data-act="chooseMode:quiz"]').click();
 await page.locator('#mxv-root [data-quiz]').first().waitFor();
 const correct=await page.evaluate(()=>{const s=S.mxVocabularyV2.session,k=s.keys[s.index];return s.quiz.options.indexOf([...S.words,...(typeof all4==='undefined'?[]:all4)].find(w=>key4(w)===k)?.['Word / Phrase']);});
 if(correct>=0){await page.locator('#mxv-root [data-quiz="'+correct+'"]').click();assert.equal(await page.evaluate(()=>S.mxVocabularyV2.session.result.ok),true);await page.locator('#mxv-root [data-act="next"]').click();await page.locator('#mxv-root [data-act="finishPractice"]').click();}
 else{await page.evaluate(()=>{S.mxVocabularyV2.session=null;});await page.locator('#mxv-root [data-act="pause"]').click();}
 if(!(await page.locator('#mxv-root [data-act="chooseList"]').isVisible())){if(await page.locator('#mxv-root [data-act="listLibrary"]').isVisible())await page.locator('#mxv-root [data-act="listLibrary"]').click();await page.locator('#mxv-root [data-group="src:English File"]').first().click();}
 await page.locator('#mxv-root [data-act="chooseList"]').click();
 await page.locator('#mxv-root [data-act="chooseMode:match"]').click();
 const match=page.locator('#mxv-root .mxv-match-grid');await match.waitFor();
 const key=await match.locator('[data-match-col="0"]').first().getAttribute('data-match-key');
 await match.locator('[data-match-col="0"]').first().click();
 await match.locator('[data-match-col="1"]').first().click();
 await page.locator('#mxv-root [data-act="matchNext"]').click();await page.locator('#mxv-root [data-act="finishPractice"]').click();
 await page.setViewportSize({width:1440,height:900});
 await page.evaluate(()=>go('calendar'));
 await page.evaluate(()=>mxHourlyMode('month'));assert(await page.locator('.cell5').count()>=28);await page.locator('.calendar5 button[onclick="mxHourlyMode(\'day\')"]').first().click();assert.equal(await page.locator('[data-mx-drop-date]').count(),25);await page.evaluate(()=>mxMimoGallery());assert.equal(await page.locator('[data-mimo-pose]').count(),12);await page.evaluate(()=>close5());
 await page.evaluate(()=>{v5().challenges.push({id:'mx-test-edit-goal',title:'Goal menu test',module:'habit',target:'Su',kind:'daily',amount:2,start:today(),end:add(today(),9),rhythm:'all',time:'',alarm:''});go('goals');});
 const editCard=page.locator('.challengecard5').filter({hasText:'Goal menu test'}).first();
 await editCard.locator('.mx-goal-menu summary').click();
 assert.equal(await page.locator('#dialog5').evaluate(el=>el.open),false,'Opening the ellipsis must not delete or open a dialog');
 assert.equal(await editCard.locator('.mx-goal-menu-items button').count(),4);
 await editCard.getByRole('button',{name:'✎ Düzenle'}).click();
 await page.locator('#mx-goal-edit [name=title]').fill('Updated goal menu test');
 await page.locator('#mx-goal-edit button.primary').click();
 assert.equal(await page.evaluate(()=>v5().challenges.find(g=>g.id==='mx-test-edit-goal').title),'Updated goal menu test');
 await page.evaluate(()=>{v5().challenges=v5().challenges.filter(g=>g.id!=='mx-test-edit-goal');delete v9().plans['mx-test-edit-goal'];render();});
 const views=['home','resources','flash','library','english','goals','calendar','p90','atlas','habits','journal'];
 for(const view of views){await page.evaluate(v=>go(v),view);await page.waitForTimeout(100);assert(await page.locator('#app').innerText());assert.equal(errors.length,0,view+': '+errors.join('; '));}
 await page.evaluate(()=>{go('p90');playDVD6(1);});await page.locator('#mx-training-workspace').waitFor();
 const training=page.locator('#mx-training-workspace');
 await page.setViewportSize({width:390,height:844});
 const set=training.locator('.mx-training-set').first();
 assert(await set.locator('[data-field="reps"]').isVisible());
 assert(await set.locator('[data-field="kg"]').isVisible());
 assert(!(await set.locator('[data-field="right"]').isVisible()));
 await set.locator('[data-field="reps"]').fill('12');await set.locator('[data-field="reps"]').blur();
 assert.equal(await page.evaluate(()=>Number(p90entry(pday).moves['1-0'].reps)),12);
 // Live persistence before blur and same-DVD history across days.
 await set.locator('[data-field="kg"]').fill('4.5');
 assert.equal(await page.evaluate(()=>Number(p90entry(pday).moves['1-0'].kg)),4.5);
 await page.evaluate(()=>{const run=v2().p90Run;const entry=v2().p90[run+'-8']??={};(entry.moves??={})['1-0']={reps:14,kg:6,date:today()};save();});
 await training.locator('[data-training-progress] summary').first().click();
 await training.locator('[data-history-metric]').selectOption('kg');
 assert.equal(await training.locator('[data-history-chart] svg circle').count(),2);
 assert.match(await training.locator('[data-history-chart]').innerText(),/6/);
 await training.locator('[data-training-start]').click();
 await page.waitForTimeout(1200);
 assert.match(await training.locator('[data-training-clock]').innerText(),/Çalışma/);
 await training.locator('[data-training-stop]').click();
 assert.match(await training.locator('[data-training-status]').innerText(),/Süre kaydedildi/);
 assert(await page.evaluate(()=>S.mxFocus.history.some(x=>x.module==='p90'&&x.target===String(pday)&&x.seconds>0)));
 assert.equal(await training.locator('[data-player] a').count(),0);

 assert(await set.evaluate(el=>el.scrollWidth<=el.clientWidth+2),'Compact P90X row must not overflow');
 await set.locator('summary').click();
 const field=set.locator('[data-field="right"]');await field.fill('7');await field.blur();
 await page.setViewportSize({width:1440,height:900});
 assert.equal(await page.evaluate(()=>Number(p90entry(pday).moves['1-0'].right)),7);
 await page.evaluate(()=>close5());
 await page.setViewportSize({width:390,height:844});
 for(const view of ['home','resources','flash','library','english','p90']){await page.evaluate(v=>go(v),view);assert(await page.locator('#app').innerText());assert.equal(errors.length,0,view+': '+errors.join('; '));}
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.mxTrainingWorkspace,{},{timeout:30000});
 assert.equal(await page.evaluate(()=>Number(v2().p90[String(v2().p90Run)+'-1']?.moves?.['1-0']?.right)),7);
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS: real browser startup, navigation, bundled Mimo, P90 record persistence and mobile render');
 // Mock only Google's responses: verify a real settings action pins owner A and rejects owner B.
 let account='owner-a';
 await page.route('https://www.googleapis.com/drive/v3/**',route=>{
  const url=new URL(route.request().url()),p=url.pathname;
  const headers={'access-control-allow-origin':origin,'access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':'authorization, x-goog-drive-resource-keys'};
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});
  if(p.endsWith('/files/fixture_drive_video_03')&&url.searchParams.get('alt')==='media'){
   assert.equal(route.request().headers()['authorization'],'Bearer fixture-token');
   assert.equal(route.request().headers()['x-goog-drive-resource-keys'],'fixture_drive_video_03/0-testkey');
   return route.fulfill({status:200,headers,contentType:'video/webm',body:fixture});
  }
  const json=p.endsWith('/about')?{user:{permissionId:account,emailAddress:'fixture@example.invalid'}}:p.endsWith('/files/fixture_folder_123')?{id:'fixture_folder_123',mimeType:'application/vnd.google-apps.folder',ownedByMe:true}:p.endsWith('/files/fixture_drive_video_03')?{id:'fixture_drive_video_03',name:'03 - fixture.webm',mimeType:'video/webm',size:String(fixture.length),ownedByMe:true,capabilities:{canDownload:true}}:p.endsWith('/files')?{files:[]}:null;
  return route.fulfill({status:json?200:404,headers,contentType:'application/json',body:JSON.stringify(json||{})});
 });
 await page.evaluate(()=>{window.google={accounts:{oauth2:{initTokenClient:cfg=>({requestAccessToken:()=>cfg.callback({access_token:'fixture-token',expires_in:600})})}}};mxDriveSettings();});
 await page.locator('[data-drive-client]').fill('123456-test.apps.googleusercontent.com');
 await page.locator('[data-drive-folder]').fill('fixture_folder_123');
 page.once('dialog',d=>d.accept());
 await page.locator('[data-drive-connect]').click();
 await page.waitForFunction(()=>document.querySelector('[data-drive-status]')?.textContent==='Bağlı · 0 DVD');
 const pin=await page.evaluate(()=>JSON.parse(localStorage.getItem('muses.drive.owner.v1')));
 assert.equal(pin.owner,'owner-a');assert(!JSON.stringify(pin).includes('fixture-token'));
 await page.evaluate(()=>{close5();playDVD6(3);});
 const driveVideo=page.locator('#mx-training-workspace [data-player] video');
 try{await driveVideo.waitFor({timeout:30000});}catch(e){throw Error('Drive fixture playback: '+await page.locator('[data-media-status]').textContent()+' / '+await page.locator('[data-player]').textContent(),{cause:e});}
 assert.equal(await page.locator('#mx-training-workspace [data-player] iframe').count(),0);
 await driveVideo.evaluate(async v=>{v.muted=true;await v.play();});
 await page.waitForFunction(()=>{const v=document.querySelector('#mx-training-workspace [data-player] video');return v&&v.videoWidth>0&&v.currentTime>0.2&&!v.error;},{},{timeout:12000});
 assert.equal(await page.evaluate(async()=> (await get6('media','p90-3')).size),fixture.length);
 console.log('PASS: authorized Drive API response is decoded in the real app video player; Google responses mocked, real owner footage not tested');
 // Simulate a full cache while importing another DVD: validated media still plays.
 await page.evaluate(()=>{close5();v6().videoLinks[4]='https://drive.google.com/file/d/fixture_drive_video_04/view';save();window.mxOriginalPut6=put6;put6=async function(store,key,value){if(store==='media'&&key==='p90-4')throw Error('quota');return window.mxOriginalPut6(store,key,value);};});
 await page.route('https://www.googleapis.com/drive/v3/files/fixture_drive_video_04*',route=>{const url=new URL(route.request().url()),headers={'access-control-allow-origin':origin,'access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':'authorization, x-goog-drive-resource-keys'};if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});return url.searchParams.get('alt')==='media'?route.fulfill({status:200,headers,contentType:'video/webm',body:fixture}):route.fulfill({status:200,headers,contentType:'application/json',body:JSON.stringify({id:'fixture_drive_video_04',name:'04 - fixture.webm',mimeType:'video/webm',size:String(fixture.length),ownedByMe:true,capabilities:{canDownload:true}})});});
 await page.evaluate(()=>playDVD6(4));const quotaVideo=page.locator('#mx-training-workspace [data-player] video');await quotaVideo.waitFor({timeout:30000});
 await quotaVideo.evaluate(async v=>{v.muted=true;await v.play();});
 await page.waitForFunction(()=>{const v=document.querySelector('#mx-training-workspace [data-player] video');return v&&v.videoWidth>0&&v.currentTime>0.2&&!v.error;});
 assert.match(await page.locator('[data-media-status]').innerText(),/çevrimdışı kopya kaydedilemedi/);
 await page.evaluate(()=>{put6=window.mxOriginalPut6;delete window.mxOriginalPut6;});
 await page.unroute('https://www.googleapis.com/drive/v3/files/fixture_drive_video_04*');
 await page.evaluate(()=>{close5();mxDriveSettings();});
 await page.locator('[data-drive-disconnect]').click();
 account='owner-b';
 await page.locator('[data-drive-connect]').click();
 await page.waitForFunction(()=>document.querySelector('[data-drive-status]')?.textContent.includes('MUSES sahibi değil'));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('muses.drive.owner.v1')).owner),'owner-a');
 assert(await page.locator('[data-drive-sync]').isDisabled());
 console.log('PASS: mocked Drive account owner pin, mismatch rejection and token excluded from persistent profile (not real Google OAuth)');
 await context.close();
}finally{await browser?.close();await new Promise(r=>server.close(r));}
