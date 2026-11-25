from fixture_app import open_app, import_pack
from playwright.sync_api import sync_playwright
from pathlib import Path
D=Path(__file__).resolve().parent.parent; w=D/'tests'/'screenshots'; w.mkdir(exist_ok=True); html=(D/'index.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage']); pg=b.new_page(viewport={'width':1440,'height':960}); errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));open_app(pg);import_pack(pg);pg.wait_for_timeout(200);print('initial',errors,flush=True);assert not errors
 assert pg.evaluate('all4.length') == 4 and pg.evaluate('p90count()') == 0
 pg.screenshot(path=str(w/'dashboard.png'));pg.evaluate('selected="2026-11-25";calMonth="2026-11";go("calendar")');pg.screenshot(path=str(w/'calendar.png'));assert pg.get_by_role('button',name='Yıl',exact=True).count()==1;pg.get_by_role('button',name='Yıl',exact=True).click();assert pg.locator('.yearMonth8').count()==12;pg.screenshot(path=str(w/'year.png'));print('year PASS',flush=True)
 pg.evaluate("""() => {
  const target = 'test-lessons~' + scope6('test-lessons').items[0].id;
  S.tasks.push({id:'linked-task',title:'Test dersi',module:'resource',target,date:today(),amount:1});
  daySelect5(today(),'day');rowAction5(today(),enc5('linked-task'));
 }""")
 pg.locator('#resourceRecord8 input[name=part]').check()
 pg.locator('#resourceRecord8 button.primary').click()
 assert pg.evaluate("agendaRows5(today()).find(x=>x.id==='linked-task').done")
 pg.evaluate('go("library")');assert pg.locator('.bookDots8 button').count()==4;pg.screenshot(path=str(w/'library.png'));pg.evaluate('go("journal")');assert pg.locator('.photoTile8').count()==12;pg.screenshot(path=str(w/'journal.png'));pg.evaluate('photoOpen8("2026-11")');pg.locator('#dialog5 textarea[name=note]').fill('Test notu');pg.locator('#dialog5 button.primary').click();assert pg.evaluate('v8().photos.length')==1;print('photo log PASS',flush=True)
 pg.evaluate('go("flash");tab4="study";render()');pg.keyboard.press('f');assert pg.evaluate('full4');pg.keyboard.press('ArrowRight');assert pg.evaluate('full4');pg.evaluate('fullscreen4()');print('flash fullscreen PASS',flush=True)
 for v in pg.evaluate('nav.map(x=>x[0])'):
  pg.evaluate('(v)=>go(v)',v);print(v,pg.evaluate('document.documentElement.scrollWidth-innerWidth'),flush=True)
 pg.set_viewport_size({'width':390,'height':844});pg.evaluate('go("home")');pg.screenshot(path=str(w/'mobile.png'));print('mobile home overflow',pg.evaluate('document.documentElement.scrollWidth-innerWidth'),flush=True);pg.evaluate('go("calendar");v5().mode="year";render()');pg.screenshot(path=str(w/'year-mobile.png'));print('mobile year overflow',pg.evaluate('document.documentElement.scrollWidth-innerWidth'),flush=True);print('errors',errors,flush=True);assert not errors;b.close()
