"""Exercise P1 features over a localhost origin with real browser storage."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
artifacts = root / 'tests' / 'artifacts'
artifacts.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server, sync_playwright() as playwright:
    Thread(target=server.serve_forever, daemon=True).start()
    origin = f'http://127.0.0.1:{server.server_port}'
    browser = playwright.chromium.launch(executable_path='/usr/bin/chromium')
    page = browser.new_page(viewport={'width': 1440, 'height': 960}, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(origin + '/') else route.abort())
    page.goto(origin)
    page.wait_for_function("db6 !== null")
    assert not errors, errors
    page.keyboard.press('Control+k')
    page.get_by_role('textbox', name='Arama veya yeni görev').fill('Yarın 18:30 piyano')
    page.get_by_role('button', name='Görev taslağı oluştur').click()
    assert page.locator('#quick5 [name=title]').input_value() == 'piyano'
    assert page.locator('#quick5 [name=time]').input_value() == '18:30'
    assert page.locator('#quick5 [name=date]').input_value() == page.evaluate('add(today(),1)')
    page.locator('#quick5 button.primary').click()
    page.evaluate("daySelect5(add(today(),1),'day');go('calendar')")
    page.get_by_role('button', name='Ertele', exact=True).last.click()
    next_date = page.evaluate('add(today(),3)')
    page.locator('#dialog5 [name=date]').fill(next_date)
    page.get_by_role('button', name='Yeni tarihe taşı').click()
    assert page.evaluate("S.tasks.find(t=>t.title==='piyano').date") == next_date
    page.evaluate("daySelect5(add(today(),1),'week')")
    assert page.locator('.p1-deferred').inner_text().startswith('Ertelenenler')
    page.evaluate("daySelect5(today(),'week')")
    drag_row = page.locator(f'[data-p1-date="{next_date}"] [data-p1-task]').filter(has_text='piyano')
    # The next week can begin before the deadline near the weekend.
    if not drag_row.count():
        page.evaluate("daySelect5(add(today(),3),'month')")
        drag_row = page.locator(f'[data-p1-date="{next_date}"] [data-p1-task]').filter(has_text='piyano')
    drop_date = page.evaluate('add(today(),4)')
    if page.locator(f'[data-p1-date="{drop_date}"]').count() == 0:
        page.evaluate("daySelect5(add(today(),3),'month')")
        drag_row = page.locator(f'[data-p1-date="{next_date}"] [data-p1-task]').filter(has_text='piyano')
    drag_row.drag_to(page.locator(f'[data-p1-date="{drop_date}"] .cellhead5'))
    assert page.evaluate("S.tasks.find(t=>t.title==='piyano').date") == drop_date

    page.evaluate("""() => {
        selected = today();
        const resource = resourceRows().find(x => x.title.includes('Fono'));
        go('goals');
        resourceGoal6(resource.id);
    }""")
    form = page.locator('#challenge5')
    form.locator('[name=end]').fill(page.evaluate('add(today(),1)'))
    form.locator('[name=amount]').fill('5')
    form.get_by_text('Süreye göre planla').click()
    form.locator('[name=dailyMinutes]').fill('20')
    form.locator('[name=minutesPerUnit]').fill('10')
    form.locator('button.primary').click()
    page.evaluate("window.goalP1 = v5().challenges.at(-1)")
    assert page.evaluate('schedule9(goalP1).unallocated.length') == 1
    assert page.evaluate('Object.values(schedule9(goalP1).dates).map(x=>x.amount)') == [2, 2]
    page.evaluate("go('english')")
    page.get_by_role('button', name='Yakınlaştır').click()
    assert page.locator('.treeStudio10').evaluate('(el)=>parseFloat(el.style.zoom)') > 1
    page.evaluate("treeDay10(goalP1.id,today())")
    page.locator('.planLeaf9 input').first.check()
    page.evaluate("close5();go('goals')")
    page.get_by_role('button', name='Kalan programı düzenle').click()
    page.locator('#dialog5 [name=end]').fill(page.evaluate('add(today(),4)'))
    page.get_by_role('button', name='Kalanı yeniden planla').click()
    assert page.evaluate('schedule9(goalP1).unallocated.length') == 0
    assert page.evaluate('planStat9(goalP1,today()).ok')
    assert page.evaluate("""() => {
        const id = schedule9(goalP1).dates[add(today(),1)].ids[0];
        const other = {...goalP1, id:'capacity-test', start:add(today(),1), end:add(today(),3), amount:1};
        v5().challenges.push(other);
        const plan = schedule9(other);
        v5().challenges.pop();
        delete v9().plans[other.id];
        return id && !plan.dates[add(today(),1)] && !!plan.dates[add(today(),3)];
    }""")

    page.evaluate("""() => {
        const date = add(v2().p90Start, 14);
        const goal = {id:'p90-test-goal', title:'P90X test', module:'p90', target:'all',
            amount:1, start:date, end:date, kind:'total', rhythm:'all'};
        v5().challenges.push(goal);
        v10().treeDate = date;
        v10().treeScale = 'week';
        v10().treeOpen[goal.id] = true;
        go('english');
    }""")
    page.locator(".treeDay10[onclick*='p90-test-goal']").click()
    assert page.evaluate("view === 'p90' && pday === 15")
    assert page.get_by_role('heading', name='Günün video oynatıcısı').count() == 1
    page.get_by_role('button', name='P90X süresini başlat').click()
    page.wait_for_timeout(1300)
    page.get_by_role('button', name='Süreyi kaydet ve durdur').click()
    assert page.evaluate("seconds9(today(),'p90','15')") >= 1
    page.evaluate("p90Move('1-0','reps',12)")
    page.evaluate("route5('vocab','All',today())")
    page.wait_for_timeout(1250)
    page.evaluate("go('calendar')")
    assert page.evaluate("seconds9(today(),'vocab')") >= 1
    for mode in ['day','week','month','year']:
        page.evaluate("(mode)=>daySelect5(today(),mode)", mode)
        assert 'P90X' in page.locator('.timeSummary9').inner_text()
        assert 'Flashcard' in page.locator('.timeSummary9').inner_text()

    page.evaluate("setStudioP1('theme','dark')")
    for screen in page.evaluate('nav.map(x=>x[0])'):
        page.evaluate('(screen)=>go(screen)', screen)
        assert page.locator('body').get_attribute('data-theme') == 'dark'
    for width, height in [(390,844), (820,1180), (1440,960)]:
        page.set_viewport_size({'width':width,'height':height})
        for screen in ['home','calendar','english','settings']:
            page.evaluate('(screen)=>go(screen)', screen)
            assert page.evaluate('document.documentElement.scrollWidth-innerWidth') <= 1, (screen,width)
            if screen in ['home','english']:
                page.wait_for_timeout(300)
                page.screenshot(path=str(artifacts / f'p1-{screen}-{width}.png'))
    page.reload()
    page.wait_for_function("db6 !== null")
    assert page.evaluate("S.tasks.find(t=>t.title==='piyano').date") == drop_date
    assert page.evaluate("seconds9(today(),'p90','15')") >= 1
    assert page.evaluate("seconds9(today(),'vocab')") >= 1
    assert page.evaluate("v2().p90[p90key(15)].moves['1-0'].reps") == 12
    assert page.locator('body').get_attribute('data-theme') == 'dark'
    assert not errors, errors
    offline = browser.new_context()
    offline_page = offline.new_page()
    offline_page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(origin + '/') else route.abort())
    offline_page.goto(origin)
    offline_page.wait_for_function("navigator.serviceWorker.controller !== null")
    offline.set_offline(True)
    offline_page.reload()
    assert offline_page.get_by_role('button', name='Ara veya görev ekle').is_visible()
    assert offline_page.evaluate("typeof installPlanningP1 === 'function' && typeof installActivityP1 === 'function'")
    browser.close()
print('PASS: palette, task defer/drag, capacity planning, tree, P90X, four calendar views, theme, viewport and reload')
