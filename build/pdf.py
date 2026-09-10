#!/usr/bin/env python3
"""Print a view of the built site to a PDF with headless Chrome over the DevTools protocol.
usage: python3 build/pdf.py <url> <out.pdf> [--wait 6] [--eval <js>] [--title <running header>]
The site's print stylesheet (src/modules/print.css) does the layout: screen furniture off, one chapter per page, sources open.
"""
import json, subprocess, sys, time, urllib.request, os, base64
import websocket  # websocket-client

args = sys.argv[1:]
url, out = args[0], args[1]
def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
wait = opt('--wait', 6.0); ev = opt('--eval', '')
port = 9334
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
                         f'--remote-debugging-port={port}', f'--user-data-dir=/tmp/cp-pdf-profile-{os.getpid()}', 'about:blank'],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try:
            targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
        except Exception: time.sleep(0.2)
    page = next(t for t in targets if t['type'] == 'page')
    ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
    ws.settimeout(120)
    mid = [0]
    def send(method, params=None):
        mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get('id') == mid[0]: return msg.get('result', {})
    send('Emulation.setDeviceMetricsOverride', {'width': 1100, 'height': 1400, 'deviceScaleFactor': 1, 'mobile': False})
    send('Page.enable'); send('Page.navigate', {'url': url})
    time.sleep(wait)
    if ev:
        send('Runtime.evaluate', {'expression': ev, 'awaitPromise': True, 'returnByValue': True}); time.sleep(0.8)
    title = opt('--title', 'Compute Chokepoints · The Chain')
    style = "font-family: Menlo, 'DejaVu Sans Mono', monospace; font-size: 7.5px; letter-spacing: 0.04em; color: #5b646d; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center;"
    header = '<div style="' + style + ' margin-top: 6mm;"><span>' + title + '</span><span>' + time.strftime('%-d %B %Y') + '</span></div>'
    footer = '<div style="' + style + ' margin-bottom: 6mm;"><span>yashvardhansharmaa.github.io/chokepoints</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'
    pdf = send('Page.printToPDF', {'printBackground': True, 'preferCSSPageSize': False, 'paperWidth': 8.27, 'paperHeight': 11.69,
                                   'marginTop': 0.75, 'marginBottom': 0.72, 'marginLeft': 0.79, 'marginRight': 0.79,
                                   'displayHeaderFooter': True, 'headerTemplate': header, 'footerTemplate': footer, 'transferMode': 'ReturnAsBase64'})
    if 'data' not in pdf: sys.exit('print failed: ' + json.dumps(pdf)[:300])
    open(out, 'wb').write(base64.b64decode(pdf['data']))
    print('wrote', out, round(os.path.getsize(out) / 1e6, 2), 'MB')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', f'/tmp/cp-pdf-profile-{os.getpid()}'])
