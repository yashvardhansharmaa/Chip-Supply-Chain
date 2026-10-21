"""Minimal DevTools-protocol client with an event thread, for the performance review (scratchpad only)."""
import json, subprocess, time, urllib.request, os, threading, queue, shutil, tempfile
import websocket

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# Every host except the local server resolves to nothing, so the page cannot reach the internet (fonts, the counter,
# preconnects). Background networking is off so Chrome itself stays quiet.
FLAGS = ['--headless=new', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist',
         '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
         '--disable-component-update', '--disable-sync', '--disable-default-apps', '--disable-extensions',
         '--disable-domain-reliability', '--disable-client-side-phishing-detection', '--no-pings',
         '--metrics-recording-only', '--disable-features=Translate,MediaRouter,OptimizationHints,AutofillServerCommunication',
         '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1']


class Browser:
    def __init__(self, port):
        self.port = port
        self.dir = tempfile.mkdtemp(prefix='cp-perf-')
        self.proc = subprocess.Popen([CHROME] + FLAGS + [f'--remote-debugging-port={port}', f'--user-data-dir={self.dir}', 'about:blank'],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                self.targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
            except Exception:
                time.sleep(0.1)

    def page_ws(self):
        t = next(t for t in self.targets if t['type'] == 'page')
        return t['webSocketDebuggerUrl']

    def close(self):
        self.proc.terminate()
        try: self.proc.wait(timeout=5)
        except Exception: self.proc.kill()
        shutil.rmtree(self.dir, ignore_errors=True)


class Session:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(ws_url, suppress_origin=True, max_size=None)
        self.mid = 0
        self.pending = {}
        self.lock = threading.Lock()
        self.handlers = {}
        self.events = []
        self.alive = True
        self.t = threading.Thread(target=self._reader, daemon=True)
        self.t.start()

    def _reader(self):
        while self.alive:
            try:
                msg = json.loads(self.ws.recv())
            except Exception:
                break
            if 'id' in msg:
                q = self.pending.pop(msg['id'], None)
                if q: q.put(msg)
            else:
                m = msg.get('method')
                h = self.handlers.get(m)
                if h:
                    try: h(msg.get('params', {}))
                    except Exception as e: print('handler error', m, e)
                if m and (m.startswith('Network.') or m.startswith('Tracing.')):
                    self.events.append(msg)

    def send(self, method, params=None, timeout=120):
        with self.lock:
            self.mid += 1; i = self.mid
            q = queue.Queue(); self.pending[i] = q
            self.ws.send(json.dumps({'id': i, 'method': method, 'params': params or {}}))
        msg = q.get(timeout=timeout)
        if 'error' in msg: raise RuntimeError(f'{method}: {msg["error"]}')
        return msg.get('result', {})

    def send_nowait(self, method, params=None):
        with self.lock:
            self.mid += 1
            self.ws.send(json.dumps({'id': self.mid, 'method': method, 'params': params or {}}))

    def on(self, method, fn): self.handlers[method] = fn

    def eval(self, expr, await_promise=True):
        r = self.send('Runtime.evaluate', {'expression': expr, 'awaitPromise': await_promise, 'returnByValue': True})
        if 'exceptionDetails' in r: raise RuntimeError(json.dumps(r['exceptionDetails'])[:500])
        return r.get('result', {}).get('value')

    def close(self):
        self.alive = False
        try: self.ws.close()
        except Exception: pass
