#!/usr/bin/env python3
"""Screenshot a page with headless Chrome over the DevTools protocol, with real device emulation.
usage: python3 build/shoot.py <url> <out.png> [--mobile] [--width 1366] [--height 900] [--full] [--wait 4] [--eval <js>]
--mobile emulates a 390x844 phone at 2x with touch; --full captures the whole document height.
"""
import json, subprocess, sys, time, urllib.request, os, signal
import websocket  # websocket-client

args = sys.argv[1:]
url, out = args[0], args[1]
mobile = '--mobile' in args
def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
width = opt('--width', 390 if mobile else 1366); height = opt('--height', 844 if mobile else 900)
full = '--full' in args; printmedia = '--print' in args; wait = opt('--wait', 4.0); ev = opt('--eval', '')  # --eval runs a script (may return a promise) before the shot, e.g. to hover a footnote
port = opt("--port", 9333)
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                         f'--remote-debugging-port={port}', f'--user-data-dir=/tmp/cp-shoot-profile-{os.getpid()}', 'about:blank'],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try:
            targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
        except Exception: time.sleep(0.2)
    page = next(t for t in targets if t['type'] == 'page')
    ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
    mid = [0]
    def send(method, params=None):
        mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get('id') == mid[0]: return msg.get('result', {})
    send('Emulation.setDeviceMetricsOverride', {'width': width, 'height': height, 'deviceScaleFactor': 2 if mobile else 1, 'mobile': mobile})
    if mobile:
        send('Emulation.setTouchEmulationEnabled', {'enabled': True})
        send('Emulation.setUserAgentOverride', {'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'})
    send('Page.enable'); send('Page.navigate', {'url': url})
    if printmedia: send('Emulation.setEmulatedMedia', {'media': 'print'})
    time.sleep(wait)
    if full:
        h = send('Runtime.evaluate', {'expression': 'document.documentElement.scrollHeight', 'returnByValue': True})['result']['value']
        h = min(int(h), 12000)
        send('Emulation.setDeviceMetricsOverride', {'width': width, 'height': h, 'deviceScaleFactor': 2 if mobile else 1, 'mobile': mobile})
        time.sleep(1.0)
    if ev:
        send('Runtime.evaluate', {'expression': ev, 'awaitPromise': True, 'returnByValue': True}); time.sleep(0.6)
    shot = send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': bool(full)})
    if 'data' not in shot: sys.exit('capture failed: ' + json.dumps(shot)[:300])
    import base64; open(out, 'wb').write(base64.b64decode(shot['data']))
    print('wrote', out, os.path.getsize(out), 'bytes')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', f'/tmp/cp-shoot-profile-{os.getpid()}'])
