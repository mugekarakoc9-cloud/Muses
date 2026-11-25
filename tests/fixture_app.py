"""Synthetic source material, shared by localhost Chromium regression suites."""
import atexit
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

ROOT = Path(__file__).resolve().parents[1]
_server = None


def example_pack():
    words = ('amazing', 'spark', 'sparks', 'sparkling')
    data = {
        'DB4': [{'Word / Phrase': word, 'POS': 'test', 'Türkçe Anlam': 'Deneme',
                 'Lists': ['ROOT A — Test family'], 'Levels': ['A1'],
                 '_key': word + '|test'} for word in words],
        'RESOURCE_SEED': [{'id': 'test-lessons', 'title': 'Alıştırmalar', 'unit': 'Ders', 'count': 20},
                          {'id': 'test-reader', 'title': 'Okuma çalışması', 'count': 6}],
        'DATA9': {'books': [{'id': 'test-book', 'title': 'Test reader', 'kind': 'EPUB bölümü',
                             'pages': [{'title': f'Lesson {n}', 'text': 'The amazing little spark moved slowly over the dark water. We could see it from our window across the quiet street.'} for n in range(6)]}],
                  'refs': {}, 'tech': {}},
        'readerMap9': {'test-book': 'test-reader'},
        'P90_MOVES': {'1': ['Hareket A', 'Hareket B', 'Hareket A']},
        'habits': [['Su', 1, 'bardak', 1, '◉']],
    }
    return {'format': 'muses-local-catalog', 'version': 1, 'data': data}


def open_app(page, origin=None):
    global _server
    if origin is None:
        if _server is None:
            _server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
            Thread(target=_server.serve_forever, daemon=True).start()
            atexit.register(_server.server_close)
        origin = f'http://127.0.0.1:{_server.server_port}'
    page.route('**/*', lambda r: r.continue_() if r.request.url.startswith(origin + '/') else r.abort())
    page.goto(origin)
    wait_ready(page)


def wait_ready(page):
    page.wait_for_function("typeof db6 !== 'undefined' && db6 !== null && document.querySelector('#nav button')")


def import_pack(page, pack=None):
    page.evaluate("go('settings')")
    page.locator('.catalog-card input').set_input_files({
        'name': 'synthetic.catalog.json', 'mimeType': 'application/json',
        'buffer': json.dumps(pack or example_pack()).encode()
    })
    with page.expect_navigation():
        page.locator('[data-apply-catalog]').click()
    wait_ready(page)
