#!/usr/bin/env python3
"""Print the short summary (dist/summary/index.html, written by build/modules/summary-brief.js) to a PDF.

usage: python3 build/summary_pdf.py [<url>] [<out.pdf>] [--port 9761] [--wait 4]
defaults: http://127.0.0.1:8765/summary/ and dist/chip-supply-chain-summary.pdf

Chrome's own pagination is enough here: the page is A4 with its own @page rules, and the stage blocks do not break
across pages. The script refuses to write a file that is not 2 to 5 pages, or one under 30 KB (a page that failed to load).
"""
import base64, json, os, re, subprocess, sys, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:]]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return type(default)(v)
    return default
port = opt('--port', 9761); wait = opt('--wait', 4.0)
force = '--force' in args
if force: args.remove('--force')
url = args[0] if len(args) > 0 else 'http://127.0.0.1:8765/summary/'
out = args[1] if len(args) > 1 else os.path.join(ROOT, 'dist', 'chip-supply-chain-summary.pdf')

chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
profile = f'/tmp/cp-summary-pdf-{os.getpid()}'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
                         f'--remote-debugging-port={port}', f'--user-data-dir={profile}', 'about:blank'],
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
            if msg.get('id') == mid[0]:
                if 'error' in msg: sys.exit(f'{method} failed: {msg["error"]}')
                return msg.get('result', {})
    send('Page.enable'); send('Page.navigate', {'url': url})
    time.sleep(wait)
    send('Runtime.evaluate', {'expression': 'document.fonts.ready.then(() => true)', 'awaitPromise': True, 'returnByValue': True})
    pdf = send('Page.printToPDF', {'preferCSSPageSize': True, 'printBackground': True, 'displayHeaderFooter': False})
    data = base64.b64decode(pdf['data'])
    pages = len(re.findall(rb'/Type\s*/Page[^s]', data))
    if len(data) < 30000: sys.exit(f'refusing to write: only {len(data)} bytes, so the page probably failed to load ({url})')
    if not force and not 2 <= pages <= 5: sys.exit(f'refusing to write: {pages} pages, the summary must run 2 to 5')
    open(out, 'wb').write(data)
    print(f'wrote {out}: {pages} pages, {len(data) / 1e6:.2f} MB')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', profile])
