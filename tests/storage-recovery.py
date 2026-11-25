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
        browser.close()
    server.shutdown()

print("PASS: real IndexedDB recovery from corrupt local snapshots and invalid mirror")
