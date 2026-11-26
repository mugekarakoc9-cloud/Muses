#!/usr/bin/env python3
"""MUSES local launcher. No remote host, third-party modules or data migration."""
import argparse
import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import time
import urllib.request
import urllib.parse
import webbrowser

PORT = 8765
FILES = {'index.html', 'p1-activity.js', 'p1-planning.js', 'p1-studio.js',
         'p1-studio.css', 'sw.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'}


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.headers.get('Host') not in {f'127.0.0.1:{self.server.server_port}',
                                         f'localhost:{self.server.server_port}'}:
            self.send_error(403)
            return
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path).lstrip('/')
        if path == '__muses_health':
            body = json.dumps({'app': 'MUSES', 'root': str(Path(self.directory).resolve())}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        relative = Path(path or 'index.html')
        target = (Path(self.directory) / relative).resolve()
        root = Path(self.directory).resolve()
        allowed = path in FILES or not path or (
            path.startswith('assets/mimo/') and relative.suffix == '.json')
        if not allowed or root not in target.parents or not target.is_file():
            self.send_error(404)
            return
        super().do_GET()

    do_HEAD = do_GET

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()


def health(port):
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/__muses_health', timeout=1) as response:
            result = json.load(response)
            return result if result.get('app') == 'MUSES' else None
    except (OSError, ValueError):
        return None


def open_app(url):
    for browser in ('google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'):
        executable = shutil.which(browser)
        if executable:
            subprocess.Popen([executable, '--app=' + url], stdout=subprocess.DEVNULL,
                             stderr=subprocess.DEVNULL, start_new_session=True)
            return
    if not webbrowser.open(url):
        raise RuntimeError('Bir tarayıcı bulunamadı. Chrome, Chromium veya Firefox yükleyin.')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--serve', action='store_true')
    parser.add_argument('--no-browser', action='store_true')
    parser.add_argument('--port', type=int, default=PORT)
    parser.add_argument('--root', type=Path)
    args = parser.parse_args()
    root = args.root or Path(__file__).resolve().parent / 'www'
    root = root.resolve()
    if not all((root / name).is_file() for name in FILES):
        raise RuntimeError('Uygulama dosyaları eksik. MUSES paketini yeniden kurun.')
    if args.serve:
        with http.server.ThreadingHTTPServer(('127.0.0.1', args.port),
                functools.partial(Handler, directory=str(root))) as server:
            server.serve_forever()
        return
    existing = health(args.port)
    if existing and existing['root'] != str(root):
        raise RuntimeError('Başka bir MUSES kopyası çalışıyor. Bilgisayarı yeniden başlatıp tekrar açın.')
    if not existing:
        with socket.socket() as probe:
            try:
                probe.bind(('127.0.0.1', args.port))
            except OSError:
                raise RuntimeError(f'{args.port} portu başka bir uygulamada açık. Mevcut adres değiştirilmedi.')
        state = Path(os.environ.get('XDG_STATE_HOME', str(Path.home() / '.local/state'))) / 'muses'
        state.mkdir(parents=True, exist_ok=True)
        with (state / 'launcher.log').open('ab') as log:
            child = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), '--serve',
                '--root', str(root), '--port', str(args.port)], stdin=subprocess.DEVNULL,
                stdout=log, stderr=log, start_new_session=True)
        for _ in range(50):
            if health(args.port):
                break
            if child.poll() is not None:
                raise RuntimeError('MUSES yerel sunucusu başlatılamadı.')
            time.sleep(.1)
        else:
            raise RuntimeError('MUSES açılışı zaman aşımına uğradı.')
    url = f'http://127.0.0.1:{args.port}/'
    print(url)
    if not args.no_browser:
        open_app(url)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        message = str(error)
        print(message, file=sys.stderr)
        if shutil.which('zenity'):
            subprocess.run(['zenity', '--error', '--title=MUSES', '--text=' + message])
        sys.exit(1)
