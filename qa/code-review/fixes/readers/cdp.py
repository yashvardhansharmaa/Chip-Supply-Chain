#!/usr/bin/env python3
"""A small headless-Chrome harness for the readers fixes (21 Oct 2026), modelled on
qa/design/shots/design-chapter/proof/dc_shoot.py. It adds what the repros need:
  - external hosts blocked (fonts, analytics), so a run reaches only the local server;
  - a faked clock (Date shifted to a given day, from the first script on);
  - an optional stand-in page: the document request is answered from a saved index.html,
    so a "before" run can replay the build as it was without a second server;
  - real key events (Input.dispatchKeyEvent) for Tab and Enter counts;
  - console errors and page exceptions, collected for the whole run.
Ports: readers use 10320 to 10339.
"""
import base64, json, os, subprocess, time, urllib.request
import websocket  # websocket-client

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

FAKE_DATE = """(function(){var T=new Date('%s').getTime(),D=Date,off=T-D.now();
function FD(){var a=arguments;if(!(this instanceof FD))return new D(D.now()+off).toString();
var d=a.length===0?new D(D.now()+off):new (Function.prototype.bind.apply(D,[null].concat([].slice.call(a))))();Object.setPrototypeOf(d,FD.prototype);return d;}
FD.prototype=D.prototype;FD.now=function(){return D.now()+off;};FD.UTC=D.UTC;FD.parse=D.parse;window.Date=FD;})();"""


class Page:
    def __init__(self, port, width=1440, height=900, mobile=False, fake_date=None, stand_in=None):
        self.port, self.width, self.height, self.mobile = port, width, height, mobile
        self.stand_in = open(stand_in, 'rb').read() if stand_in else None
        self.errors, self.mid = [], 0
        self.dir = f'/tmp/cp-readers-{port}-{os.getpid()}'
        self.proc = subprocess.Popen([CHROME, '--headless=new', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars',
                                      '--no-first-run', '--no-default-browser-check', f'--remote-debugging-port={port}',
                                      '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1', f'--user-data-dir={self.dir}', 'about:blank'],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(60):
            try:
                targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
            except Exception:
                time.sleep(0.2)
        page = next(t for t in targets if t['type'] == 'page')
        self.ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True, timeout=60)
        self.send('Runtime.enable'); self.send('Log.enable'); self.send('Page.enable')
        self.send('Emulation.setFocusEmulationEnabled', {'enabled': True})  # a headless page never has focus, so focus() would fire no focus events
        self.send('Emulation.setDeviceMetricsOverride', {'width': width, 'height': height, 'deviceScaleFactor': 2 if mobile else 1, 'mobile': mobile})
        if mobile:
            self.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
            self.send('Emulation.setUserAgentOverride', {'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'})
        if fake_date:
            self.send('Page.addScriptToEvaluateOnNewDocument', {'source': FAKE_DATE % fake_date})
        if self.stand_in:
            self.send('Fetch.enable', {'patterns': [{'urlPattern': 'http://127.0.0.1:8765/', 'resourceType': 'Document', 'requestStage': 'Request'},
                                                    {'urlPattern': 'http://127.0.0.1:8765/?*', 'resourceType': 'Document', 'requestStage': 'Request'}]})

    # every message that is not the answer we wait for is an event: note errors, answer paused requests
    def _event(self, msg):
        m, p = msg.get('method'), msg.get('params', {})
        if m == 'Runtime.exceptionThrown':
            d = p.get('exceptionDetails', {}); self.errors.append('exception: ' + (d.get('exception', {}).get('description') or d.get('text', ''))[:300])
        elif m == 'Runtime.consoleAPICalled' and p.get('type') == 'error':
            self.errors.append('console.error: ' + ' '.join(str(a.get('value', a.get('description', ''))) for a in p.get('args', []))[:300])
        elif m == 'Log.entryAdded':
            e = p.get('entry', {})
            if e.get('level') == 'error' and 'ERR_NAME_NOT_RESOLVED' not in e.get('text', '') and 'ERR_NAME_NOT_RESOLVED' not in str(e.get('url', '')) \
                    and not any(h in str(e.get('url', '')) for h in ('googleapis', 'gstatic', 'goatcounter')):
                self.errors.append('log: ' + e.get('text', '')[:200] + ' ' + str(e.get('url', ''))[:120])
        elif m == 'Fetch.requestPaused':
            self.mid += 1
            self.ws.send(json.dumps({'id': self.mid, 'method': 'Fetch.fulfillRequest', 'params': {
                'requestId': p['requestId'], 'responseCode': 200,
                'responseHeaders': [{'name': 'Content-Type', 'value': 'text/html; charset=utf-8'}],
                'body': base64.b64encode(self.stand_in).decode()}}))

    def send(self, method, params=None):
        self.mid += 1; want = self.mid
        self.ws.send(json.dumps({'id': want, 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get('id') == want:
                return msg.get('result', msg.get('error', {}))
            if 'method' in msg: self._event(msg)

    def pump(self, secs):  # wait, but keep answering events
        end = time.time() + secs
        while time.time() < end:
            self.ws.settimeout(max(0.05, end - time.time()))
            try:
                msg = json.loads(self.ws.recv())
                if 'method' in msg: self._event(msg)
            except websocket.WebSocketTimeoutException:
                pass
        self.ws.settimeout(60)

    def go(self, url, wait=5.0):
        self.send('Page.navigate', {'url': url}); self.pump(wait)

    def ev(self, js):
        r = self.send('Runtime.evaluate', {'expression': js, 'awaitPromise': True, 'returnByValue': True})
        if 'exceptionDetails' in r:
            return {'__error': r['exceptionDetails'].get('exception', {}).get('description', r['exceptionDetails'].get('text'))}
        return r.get('result', {}).get('value')

    KEYS = {'Tab': (9, 'Tab'), 'Enter': (13, 'Enter'), 'Escape': (27, 'Escape'), 'ArrowDown': (40, 'ArrowDown'), 'ArrowUp': (38, 'ArrowUp'),
            'ArrowRight': (39, 'ArrowRight'), 'ArrowLeft': (37, 'ArrowLeft'), ' ': (32, 'Space'), 'Home': (36, 'Home'), 'End': (35, 'End')}

    def key(self, key, shift=False, times=1, gap=0.03):
        code, name = self.KEYS[key]
        for _ in range(times):
            base = {'key': key, 'code': name, 'windowsVirtualKeyCode': code, 'nativeVirtualKeyCode': code, 'modifiers': 8 if shift else 0}
            down = dict(base, type='keyDown')
            if key == 'Enter': down['text'] = '\r'
            if key == ' ': down['text'] = ' '
            self.send('Input.dispatchKeyEvent', down)
            self.send('Input.dispatchKeyEvent', dict(base, type='keyUp'))
            if gap: self.pump(gap)

    def type(self, text):
        self.send('Input.insertText', {'text': text})

    def mouse(self, x, y, kind='mouseMoved', button='none', clicks=0):
        self.send('Input.dispatchMouseEvent', {'type': kind, 'x': x, 'y': y, 'button': button, 'clickCount': clicks})

    def click(self, x, y):
        self.mouse(x, y); self.mouse(x, y, 'mousePressed', 'left', 1); self.mouse(x, y, 'mouseReleased', 'left', 1)

    def shot(self, out):
        r = self.send('Page.captureScreenshot', {'format': 'png'})
        open(out, 'wb').write(base64.b64decode(r['data']))
        return out

    def close(self):
        try: self.ws.close()
        except Exception: pass
        self.proc.terminate()
        try: self.proc.wait(timeout=5)
        except Exception: self.proc.kill()
        subprocess.run(['rm', '-rf', self.dir])
