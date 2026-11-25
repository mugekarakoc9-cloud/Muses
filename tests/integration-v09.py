from pathlib import Path
from playwright.sync_api import sync_playwright
h=(Path(__file__).resolve().parents[1] / 'index.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page(timezone_id="America/Los_Angeles",viewport={'width':1280,'height':900});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.route('**/*',lambda r:r.abort());pg.set_content(h.replace('<script>','<script>const __mock={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>__mock[k]||null,setItem:(k,v)=>__mock[k]=v}});</script><script>',1),wait_until='domcontentloaded');pg.wait_for_timeout(120)
 pg.evaluate('''(()=>{let r=readerMap9['reader-sherlock-holmes-two-plays'];startSource9(r);lastInput9=Date.now();clockTick9();clock9.last-=11000;clockTick9();return seconds9(today(),'resource',r)})()''');assert pg.evaluate('seconds9(today(),"resource",readerMap9["reader-sherlock-holmes-two-plays"])')>=10
 pg.evaluate('openReader9("reader-sherlock-holmes-two-plays");readerPage9(4);readerMark9()');assert pg.evaluate('leafDone(scope6(readerMap9["reader-sherlock-holmes-two-plays"]).items[4])');assert pg.evaluate('v2().reading.filter(x=>x.id==="reader-sherlock-holmes-two-plays"&&x.readerUnit===4).length')==1
 pg.evaluate('''(()=>{let id=readerMap9['reader-sherlock-holmes-two-plays'];sourceSelected=id;go('resources');markNode(readerLeaf9(id,5),true)})()''');assert pg.evaluate('!!readerState9("reader-sherlock-holmes-two-plays").done[5]');assert pg.evaluate('v2().reading.filter(x=>x.id==="reader-sherlock-holmes-two-plays"&&x.readerUnit===5).length')==1
 pg.evaluate('''(()=>{let id=readerMap9['reader-sherlock-holmes-two-plays'];let r=resourceRows().find(x=>x.id===id),t=sourceTree(r)[0];let g={id:'read-goal',module:'resource',target:id+'~'+t.id,title:'reader',kind:'total',start:today(),end:add(today(),6),amount:7,rhythm:'all'};v5().challenges.push(g);schedule9(g);save();return g.id})()''');assert pg.evaluate('Object.values(v9().plans["read-goal"].dates).flatMap(p=>p.ids).every(id=>id.includes("-reader9-"))');assert pg.evaluate('challengeInfo5(v5().challenges.find(g=>g.id==="read-goal")).count')==0
 assert pg.evaluate('Object.keys(DATA9.tech).length')==319;assert pg.evaluate('Object.keys(DATA9.refs).length')==59
 pg.evaluate("""() => {
  addTime9('resource','test-clock',Date.parse('2026-11-15T20:59:55Z'),Date.parse('2026-11-15T21:00:05Z'));
 }""")
 for date in ('2026-11-15', '2026-11-16'):
  assert pg.evaluate("(date)=>seconds9(date,'resource','test-clock')", date)==5
  assert pg.evaluate("(date)=>agendaRows5(date).filter(row=>row.id==='time9:resource:test-clock').length", date)==1
  assert pg.evaluate("(date)=>!filtered5(date,'plan').some(row=>row.id==='time9:resource:test-clock')", date)
  assert pg.evaluate("(date)=>metricRows5(date).studyTime===5/60", date)
 pg.evaluate("go('home'); selected='2026-11-15'; v5().mode='day'; openTimeDetail9('resource')")
 pg.locator('.timeRow9').first.click()
 assert pg.evaluate("view==='calendar' && selected==='2026-11-15' && v5().mode==='day'")
 assert pg.locator("#nav .subnav9 [aria-current=page]").inner_text().endswith("Ajanda")
 assert not pg.locator(".areaTabs9").is_visible()
 pg.set_viewport_size({"width":390,"height":844})
 assert pg.get_by_role("navigation",name="Bu alanın sayfaları").is_visible()
 pg.get_by_role("navigation",name="Bu alanın sayfaları").get_by_role("button",name="Yol Haritam").click()
 assert pg.evaluate("view==='english'")
 assert pg.locator(".areaTabs9 [aria-current=page]").inner_text()=="Yol Haritam"
 pg.evaluate("""() => {
  const monday=parseSmart6('Her pazartesi 20:00 İngilizce','2026-11-16');
  const twoDays=parseSmart6('every Monday and Thursday Study','2026-11-16');
  if(monday.time!=='20:00'||monday.days6.join()!=='1'||twoDays.days6.join()!=='1,4')throw Error('Repeat parsing');
  const series={id:'test-repeat',start:monday.date,repeat:twoDays.repeat,days6:twoDays.days6,
    template:{title:'Test repeat',module:'task',time:monday.time,alarm:'0',series:'test-repeat'},
    until:'2026-11-15',excluded:['2026-11-19']};
  v6().series.push(series);
  materialize6('2027-11-15');
  materialize6('2027-11-15');
  const tasks=S.tasks.filter(t=>t.series===series.id);
  if(tasks.length!==104||new Set(tasks.map(t=>t.date)).size!==104)throw Error('Repeat materialization');
  if(scheduledTime5(tasks[0].date,tasks[0].time)!==Date.parse('2026-11-16T17:00:00Z'))throw Error('Istanbul reminder');
  go('calendar'); daySelect5('2026-11-16','day');
 }""")
 assert pg.evaluate("""() => {
  const planned=filtered5(selected,'plan').length;
  return document.querySelector('.calstats5 b').textContent===String(planned) &&
         agendaRows5(selected).some(row=>row.id==='time9:resource:test-clock');
 }""")
 assert pg.evaluate("""async () => {
  S.tasks.push({id:'ics-test',title:'Export test',date:'2099-01-12',time:'20:00',alarm:'0'});
  const original=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;
  let calendar;
  try{
   URL.createObjectURL=blob=>{calendar=blob;return 'blob:preview'};
   HTMLAnchorElement.prototype.click=()=>{};
   exportAlarms5();
   return (await calendar.text()).includes('DTSTART:20990112T170000Z');
  }finally{
   URL.createObjectURL=original;
   HTMLAnchorElement.prototype.click=click;
  }
 }""")
 print('PASS: resource clock, reader->resource, resource->reader, unique reading log, reader scoped goal, source coverage',errors);assert not errors;b.close()
