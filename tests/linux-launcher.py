"""Isolated HTTP contract test; never uses the user's browser or storage."""
import functools
import http.client
import http.server
import importlib.util
from pathlib import Path
import threading

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('launcher', root / 'linux-wrapper/app.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
with http.server.ThreadingHTTPServer(('127.0.0.1', 0),
        functools.partial(module.Handler, directory=str(root))) as server:
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    assert module.health(server.server_port)['root'] == str(root)
    for path, expected in [('/',200),('/sw.js',200),('/assets/mimo/idle.json',200),
                           ('/AGENTS.md',404),('/../README.md',404),('/assets/mimo/',404),
                           ('/assets/mimo/../../README.md',404)]:
        connection = http.client.HTTPConnection('127.0.0.1',server.server_port)
        connection.request('GET',path)
        response=connection.getresponse()
        assert response.status == expected,(path,response.status)
        response.read();connection.close()
    connection = http.client.HTTPConnection('127.0.0.1',server.server_port)
    connection.request('GET','/',headers={'Host':'untrusted.example'})
    assert connection.getresponse().status == 403
    connection.close()
    server.shutdown()
print('PASS: local app assets, health check, private file isolation and Host validation')
