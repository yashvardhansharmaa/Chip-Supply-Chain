#!/usr/bin/env python3
"""Evaluate a JavaScript expression on a page in headless Chrome and print the result.
usage: python3 qa/suppliers-redesign/mock/grab.py <url> <js expression> [--wait 6] [--width 1440]
Mock-only helper: used to pull the ladder the site renders at runtime into a static copy."""
import json, subprocess, sys, time, urllib.request, os
import websocket

args = sys.argv[1:]
url, expr = args[0], args[1]
def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
wait = opt('--wait', 6.0); width = opt('--width', 1440)
port = 9337
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                         f'--remote-debugging-port={port}', f'--user-data-dir=/tmp/cp-grab-profile-{os.getpid()}', 'about:blank'],
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
    send('Emulation.setDeviceMetricsOverride', {'width': width, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
    send('Page.enable'); send('Page.navigate', {'url': url})
    time.sleep(wait)
    r = send('Runtime.evaluate', {'expression': expr, 'awaitPromise': True, 'returnByValue': True})
    v = r.get('result', {}).get('value')
    sys.stdout.write(v if isinstance(v, str) else json.dumps(v))
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', f'/tmp/cp-grab-profile-{os.getpid()}'])
