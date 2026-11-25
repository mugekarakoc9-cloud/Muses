"""Exercise import, undo, real WebM playback, and dated sets on a localhost origin."""
import json
import subprocess
from datetime import date, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright
from fixture_app import ROOT, example_pack, import_pack, open_app, wait_ready


def replace_catalog(page, action):
    with page.expect_navigation():
        action()
    wait_ready(page)


def capture_layout(page, name):
    out = ROOT / 'tests/artifacts'
    out.mkdir(exist_ok=True)
    for width, height in ((390, 844), (820, 1180), (1440, 960)):
        page.set_viewport_size({'width': width, 'height': height})
        for theme in ('light', 'dark'):
            page.evaluate("(theme)=>{document.body.dataset.theme=theme}", theme)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
            page.screenshot(path=str(out / f'{name}-{theme}-{width}.png'))


with TemporaryDirectory() as tmp, sync_playwright() as playwright:
    video = Path(tmp) / 'exercise.webm'
    subprocess.run(['ffmpeg','-loglevel','error','-f','lavfi','-i','testsrc2=size=160x90:rate=8',
                    '-t','9','-c:v','libvpx','-threads','1',str(video)],check=True)
    browser = playwright.chromium.launch(executable_path='/usr/bin/chromium')
    page = browser.new_page()
    errors = []
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('dialog',lambda dialog:dialog.accept())
    open_app(page)
    page.wait_for_function('navigator.serviceWorker.controller')
    assert page.evaluate('!MusesCatalog.active && !all4.length && !S.tasks.length')
    page.evaluate("go('settings')")
    page.locator('.catalog-card input').set_input_files({
        'name':'invalid.json','mimeType':'application/json','buffer':b'{"format":"wrong"}'})
    assert page.get_by_text('Bu dosya desteklenen bir MUSES kaynak paketi değil.').is_visible()
    assert page.locator('[data-apply-catalog]').is_hidden()

    pack = example_pack()
    start = date(2024,1,1)
    end = (start + timedelta(weeks=116, days=-1)).isoformat()
    pack['data']['curriculum'] = {'phases':[{'title':'Test aşaması','start':start.isoformat(),'end':end}],
        'resources':[{'id':'test-lessons','title':'Test modülü','start':start.isoformat(),'end':end,
                      'quantity':2,'unit':'bölüm','minutes':25,'method':'Test yöntemi'}]}
    import_pack(page,pack)
    page.evaluate("go('english')")
    page.locator('#curriculum-week').select_option('116')
    assert '25 dk plan' in page.locator('[data-week-content]').inner_text()
    assert page.locator('[data-week-next]').is_disabled()
    page.locator('.curriculum-week summary').click()
    page.locator('[data-plan]').click()
    assert page.locator('#challenge5 [name=start]').input_value() == (start + timedelta(weeks=115)).isoformat()
    assert page.locator('#challenge5 [name=end]').input_value() == end
    page.evaluate('close5()')
    page.locator('[data-study]').click()
    assert page.evaluate("view==='resources' && sourceSelected==='test-lessons'")

    page.evaluate("go('p90');setDVD6(1)")
    with page.expect_file_chooser() as chooser:
        page.get_by_label('Yerel video dosyası').click()
    chooser.value.set_files(video)
    page.wait_for_function("v6().mediaNames[1] === 'exercise.webm' && !document.querySelector('#dialog5').open")
    page.evaluate('playDVD6(1)')
    page.wait_for_function("document.querySelector('video')?.readyState>=2")
    page.evaluate("window.playing=document.querySelector('video');playing.muted=true;playing.play()")
    panel = page.locator('.training-log')
    panel.get_by_label('Taraf').select_option('left')
    panel.get_by_label('Tekrar',exact=True).fill('0')
    panel.get_by_label('Taraf').select_option('right')
    panel.get_by_label('Tekrar',exact=True).fill('8')
    assert page.evaluate("playing===document.querySelector('video') && !playing.paused")
    panel.get_by_label('Set',exact=True).fill('2')
    panel.get_by_label('Set',exact=True).press('Tab')
    panel.get_by_label('Tekrar',exact=True).fill('5')
    previous = page.evaluate('add(today(),-1)')
    panel.get_by_label('Antrenman tarihi').fill(previous)
    assert panel.get_by_label('Tekrar',exact=True).input_value() == ''
    panel.get_by_label('Tekrar',exact=True).fill('4')
    page.get_by_role('button',name='Sonraki hareket').click()
    assert panel.get_by_label('Tekrar',exact=True).input_value() == ''
    assert page.evaluate("p90entry(1).moves['1-0'].left===0 && p90entry(1).moves['1-0'].right===8")
    assert page.evaluate("p90entry(1).trainingSets[today()+'/1-0/2/right'].reps===5")
    assert page.evaluate("(d)=>p90entry(1).trainingSets[d+'/1-0/2/right'].reps===4",previous)
    page.evaluate('playing.pause();playing.currentTime=4')
    page.wait_for_function("p90entry(1).playback?.[1]?.time>=4")
    capture_layout(page,'training')
    page.evaluate("close5()")
    page.context.set_offline(True)
    page.reload()
    wait_ready(page)
    page.evaluate("go('p90');playDVD6(1)")
    page.wait_for_function("document.querySelector('video')?.currentTime>=3.9")
    assert panel.get_by_label('Hareket',exact=True).input_value()=='1'
    page.evaluate("close5();go('settings')")
    with page.expect_download() as download:
        page.evaluate('backupWithMedia8()')
    full = json.loads(Path(download.value.path()).read_text())
    assert full['version']==2 and full['catalog']==pack and len(full['media'])==1
    replace_catalog(page,lambda:page.evaluate('MusesCatalog.change(true)'))
    assert page.evaluate('!MusesCatalog.active && !all4.length')
    restore = {'name':'full.json','mimeType':'application/json','buffer':json.dumps(full).encode()}
    replace_catalog(page,lambda:page.locator('#file').set_input_files(restore))
    assert page.evaluate('all4.length===4 && MusesCatalog.active.data.curriculum.resources.length===1')
    assert page.evaluate("async()=>await (await get6('media','p90-1')).size") == video.stat().st_size
    replace_catalog(page,lambda:page.evaluate('recover8()'))
    assert page.evaluate("!MusesCatalog.active && p90entry(1).moves['1-0'].right===8")
    assert not errors, errors
    browser.close()
print('PASS: local catalog validation/restore, 116-week navigation, offline video, seek and dated per-side sets')
