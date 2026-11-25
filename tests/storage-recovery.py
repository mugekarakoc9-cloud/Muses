"""Verify startup recovery with real browser storage on a localhost origin."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


root = Path(__file__).resolve().parents[1]
with ThreadingHTTPServer(
    ("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(root))
) as server:
    Thread(target=server.serve_forever, daemon=True).start()
    origin = f"http://127.0.0.1:{server.server_port}"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium")
        page = browser.new_page(service_workers="block")
        page.route("**/*", lambda route: route.continue_() if
                   route.request.url.startswith(origin + "/") else route.abort())
        page.goto(origin)
        page.wait_for_function("db6 !== null")
        page.evaluate("""async () => {
            S.tasks.push({id:'recovery-test', title:'Recovery test', date:'2026-11-25'});
            await put6('state', 'snapshot', {savedAt:'', state:S});
        }""")

        for broken_copy in ("{broken", '{"tasks":null}'):
            page.evaluate("(raw) => localStorage.setItem('muses-life-v1', raw)", broken_copy)
            page.reload()
            page.wait_for_function("S.tasks.some(task => task.id === 'recovery-test')")
            assert page.evaluate("""JSON.parse(localStorage.getItem('muses-life-v1'))
                .tasks.some(task => task.id === 'recovery-test')""")

        page.evaluate("""async () => {
            const wrong = {...S, words: null, tasks: []};
            await put6('state', 'snapshot', {savedAt:'2099-01-01', state:wrong});
        }""")
        page.reload()
        page.wait_for_function("db6 !== null")
        assert page.evaluate("S.tasks.some(task => task.id === 'recovery-test')")
        page.on("dialog", lambda dialog: dialog.accept())
        page.evaluate("""async () => {
            await put6('media','p90-1',new File(['existing'],'existing.mp4',{type:'video/mp4'}));
            await new Promise(resolve=>{
                const tx=db6.transaction('media','readwrite');
                tx.objectStore('media').put(null,'p90-2');
                tx.oncomplete=resolve;
            });
            window.exported=null;
            downloadBackup8=value=>{window.exported=structuredClone(value)};
            await backupWithMedia8();
            if(exported.media.length!==1 || exported.media[0].data!==btoa('existing')){
                throw Error('The export did not retain video bytes');
            }
        }""")
        page.evaluate("""async () => {
            window.testBackup=exported;
            testBackup.state.tasks.push({id:'imported',title:'Imported',date:'2026-11-25'});
            testBackup.media[0].data=btoa('replacement');
            testBackup.media.push({key:'p90-2',name:'new.mp4',type:'video/mp4',data:btoa('new')});
            await importFile(new File([JSON.stringify(testBackup)],'full.json'));
        }""")
        page.reload()
        page.wait_for_function("db6 && S.tasks.some(task => task.id === 'imported')")
        assert page.evaluate("async () => (await get6('media','p90-1')).text()") == "replacement"
        assert page.evaluate("async () => (await get6('media','p90-2')).text()") == "new"
        page.evaluate("recover8()")
        assert not page.evaluate("S.tasks.some(task => task.id === 'imported')")
        assert page.evaluate("async () => (await get6('media','p90-1')).text()") == "existing"
        assert page.evaluate("async () => !!(await get6('media','p90-2'))") is False

        page.evaluate("""async () => {
            const original=db6.transaction.bind(db6);
            db6.transaction=(stores,mode)=>{
                const tx=original(stores,mode);
                if(mode==='readwrite'){
                    const store=tx.objectStore('media');
                    const put=store.put.bind(store);
                    store.put=(...args)=>{put(...args);throw Error('Simulated write failure')};
                    tx.objectStore=name=>name==='media'?store:IDBTransaction.prototype.objectStore.call(tx,name);
                }
                return tx;
            };
            const state=structuredClone(S);
            state.tasks=[];
            const media=[['p90-1',new Blob(['bad'])]];
            try{await applyBackup8({state,media})}catch(error){
                if(error.message!=='Simulated write failure')throw error;
            }finally{delete db6.transaction}
        }""")
        assert page.evaluate("S.tasks.some(task => task.id === 'recovery-test')")
        assert page.evaluate("async () => (await get6('media','p90-1')).text()") == "existing"
        page.reload()
        page.wait_for_function("db6 && S.tasks.some(task => task.id === 'recovery-test')")
        page.evaluate("""async () => {
            const invalid=structuredClone(S);
            invalid.tasks=[...invalid.tasks,invalid.tasks[0]];
            await importFile(new File([JSON.stringify(invalid)],'invalid.json'));
        }""")
        assert page.evaluate("S.tasks.filter(task => task.id === 'recovery-test').length")==1
        page.evaluate("""async () => {
            const legacy=structuredClone(S);
            legacy.tasks.push({id:'legacy',title:'Legacy import',date:'2026-11-25'});
            await importFile(new File([JSON.stringify(legacy)],'legacy.json'));
        }""")
        page.reload()
        page.wait_for_function("db6 && S.tasks.some(task => task.id === 'legacy')")
        assert page.evaluate("async () => (await get6('media','p90-1')).text()") == "existing"
        page.evaluate("removeLocalVideo6(1)")
        assert page.evaluate("async () => (await get6('media','p90-1')) === undefined")
        browser.close()
    server.shutdown()

print("PASS: real IndexedDB recovery from corrupt snapshots, media round trip, undo and aborted restore")
