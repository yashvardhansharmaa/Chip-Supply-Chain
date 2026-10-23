#!/usr/bin/env python3
"""A small headless-Chrome driver for the a11y fix proofs (modelled on qa/design/shots/design-chapter/proof/dc_shoot.py).
It adds real key presses (Input.dispatchKeyEvent), so Tab walks and Escape behave as a keyboard does, and it can inject a
local axe-core read-only (AXE below). Ports 10340 to 10359 belong to the a11y builder."""
import base64, json, os, subprocess, time, urllib.request
import websocket  # websocket-client

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
AXE = '/Users/yashvardhansharma/medical-bot/frontend/node_modules/axe-core/axe.min.js'  # axe-core 4.10.3, read only
KEYS = {'Tab': 9, 'Enter': 13, 'Escape': 27, 'Shift': 16, 'ArrowDown': 40, 'ArrowUp': 38, 'End': 35, 'Home': 36, ' ': 32}


class Page:
    def __init__(self, port, width=1440, height=900, mobile=False, scale=None):
        self.port, self.width, self.height, self.mobile = port, width, height, mobile
        self.dir = f'/tmp/cp-a11y-{port}-{os.getpid()}'
        self.proc = subprocess.Popen([CHROME, '--headless=new', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars',
                                      '--no-first-run', '--no-default-browser-check', f'--remote-debugging-port={port}',
                                      f'--user-data-dir={self.dir}', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        targets = None
        for _ in range(60):
            try:
                targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
            except Exception:
                time.sleep(0.2)
        page = next(t for t in targets if t['type'] == 'page')
        self.ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
        self.mid = 0
        dsf = scale or (2 if mobile else 1)
        self.send('Emulation.setDeviceMetricsOverride', {'width': width, 'height': height, 'deviceScaleFactor': dsf, 'mobile': mobile})
        if mobile:
            self.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
            self.send('Emulation.setUserAgentOverride', {'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'})
        self.send('Page.enable')

    def send(self, method, params=None):
        self.mid += 1
        self.ws.send(json.dumps({'id': self.mid, 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get('id') == self.mid:
                return msg.get('result', {})

    def media(self, features):
        self.send('Emulation.setEmulatedMedia', {'features': [{'name': k, 'value': v} for k, v in features.items()]})

    def goto(self, url, wait=5.0):
        self.send('Page.navigate', {'url': url}); time.sleep(wait)

    def ev(self, js):
        r = self.send('Runtime.evaluate', {'expression': js, 'awaitPromise': True, 'returnByValue': True})
        if 'exceptionDetails' in r:
            return {'error': json.dumps(r['exceptionDetails'])[:400]}
        return r.get('result', {}).get('value')

    def key(self, name, shift=False, pause=0.06):
        code = KEYS.get(name, 0)
        mods = 8 if shift else 0
        base = {'key': name, 'code': name if len(name) > 1 else 'Key' + name.upper(), 'windowsVirtualKeyCode': code, 'nativeVirtualKeyCode': code, 'modifiers': mods}
        if name == 'Enter': base['text'] = '\r'
        self.send('Input.dispatchKeyEvent', dict(base, type='keyDown'))  # keyDown with text makes the keypress itself
        self.send('Input.dispatchKeyEvent', dict(base, type='keyUp'))
        time.sleep(pause)

    def type(self, text):
        self.send('Input.insertText', {'text': text}); time.sleep(0.2)

    def click(self, x, y):
        for t in ('mousePressed', 'mouseReleased'):
            self.send('Input.dispatchMouseEvent', {'type': t, 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})
        time.sleep(0.2)

    def shot(self, path, clip=None):
        p = {'format': 'png'}
        if clip: p['clip'] = dict(clip, scale=1)
        r = self.send('Page.captureScreenshot', p)
        open(path, 'wb').write(base64.b64decode(r['data']))
        return path

    def axe(self, rules=None, include=None):
        src = open(AXE).read()
        self.ev(src + ';0')
        opts = {'runOnly': {'type': 'tag', 'values': ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']}, 'resultTypes': ['violations']}
        if rules: opts = {'runOnly': {'type': 'rule', 'values': rules}, 'resultTypes': ['violations']}
        ctx = json.dumps(include) if include else 'document'
        return self.ev('axe.run(%s, %s).then(function (r) { return r.violations.map(function (v) { return { id: v.id, impact: v.impact, n: v.nodes.length, nodes: v.nodes.slice(0, 6).map(function (n) { return n.target.join(" ") + " | " + (n.any[0] ? n.any[0].message : "").slice(0, 160); }) }; }); })' % (ctx, json.dumps(opts)))

    def close(self):
        try: self.ws.close()
        except Exception: pass
        self.proc.terminate()
        try: self.proc.wait(timeout=5)
        except Exception: self.proc.kill()
        subprocess.run(['rm', '-rf', self.dir])
