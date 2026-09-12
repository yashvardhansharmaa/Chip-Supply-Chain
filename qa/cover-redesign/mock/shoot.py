#!/usr/bin/env python3
"""Render a cover mock (HTML, 1240 x 1754 px sheet) to PNG with headless Chrome. Chrome invocation copied from build/shoot.py.
usage: python3 qa/cover-redesign/mock/shoot.py <mock.html> <out.png>"""
import base64, json, os, subprocess, sys, time, urllib.request
import websocket
src, out = os.path.abspath(sys.argv[1]), sys.argv[2]
W, H, port = 1240, 1754, 9337
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                         '--force-device-scale-factor=1', f'--remote-debugging-port={port}', f'--user-data-dir=/tmp/cp-cover-profile-{os.getpid()}', 'about:blank'],
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
    send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 1, 'mobile': False})
    send('Page.enable'); send('Page.navigate', {'url': 'file://' + src})
    time.sleep(1.5)
    r = send('Runtime.evaluate', {'expression': 'document.fonts.ready.then(function(){return Array.from(document.fonts).filter(function(f){return f.status==="loaded"}).length})', 'awaitPromise': True, 'returnByValue': True})
    print('fonts loaded:', r.get('result', {}).get('value'))
    time.sleep(1.0)
    shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
    if 'data' not in shot: sys.exit('capture failed: ' + json.dumps(shot)[:300])
    open(out, 'wb').write(base64.b64decode(shot['data']))
    print('wrote', out, os.path.getsize(out), 'bytes')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', f'/tmp/cp-cover-profile-{os.getpid()}'])
