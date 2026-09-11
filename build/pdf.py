#!/usr/bin/env python3
"""Print a view of the built site to a PDF with headless Chrome over the DevTools protocol.

usage: python3 build/pdf.py <url> <out.pdf> [--wait 6] [--eval <js>] [--title <running header>]
                            [--only N] [--timeout 420] [--no-paged]

The page is laid out by Paged.js, injected from here because the site has no bundler. It is pinned
at build/vendor/paged.polyfill.js: v0.4.3, https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js,
sha256 f59f361802416c770d549a647958649af2cf6601999924bc00e4f507dad5269f.
Paged.js is what makes the two things Chrome cannot do alone:
each source printed as a footnote at the foot of the page its superscript falls on, and running
heads and folios in the page margins. src/modules/print.css is the stylesheet; src/modules/print.js
writes each note at print time from the data-* fields already on every citation.

--only N paginates the first N chapters only, for iterating on the design.
--no-paged falls back to Chrome's own pagination, with each chapter's notes at its end; the same
fallback runs by itself if Paged.js cannot lay the document out.
"""
import json, subprocess, sys, time, urllib.request, os, base64
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
url, out = args[0], args[1]
def site_host():
    js = 'process.stdout.write(require(%s).host)' % json.dumps(os.path.join(ROOT, 'build', 'site.js'))
    return subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout.strip()

def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
def flag(name):
    return name in args
wait = opt('--wait', 6.0); ev = opt('--eval', ''); only = opt('--only', 0)
budget = opt('--timeout', 420.0); use_paged = not flag('--no-paged')
port = 9334
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
proc = subprocess.Popen([chrome, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
                         '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
                         '--js-flags=--max-old-space-size=8192',
                         f'--remote-debugging-port={port}', f'--user-data-dir=/tmp/cp-pdf-profile-{os.getpid()}', 'about:blank'],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
started = time.time()
def say(msg):
    print(f'[{time.time() - started:6.1f}s] {msg}', flush=True)
try:
    for _ in range(50):
        try:
            targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
        except Exception: time.sleep(0.2)
    page = next(t for t in targets if t['type'] == 'page')
    ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
    ws.settimeout(180)
    mid = [0]
    def send(method, params=None, timeout=None):
        if timeout: ws.settimeout(timeout)
        mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get('id') == mid[0]: return msg.get('result', {})
    def js(expression, await_promise=False, timeout=None):
        r = send('Runtime.evaluate', {'expression': expression, 'awaitPromise': await_promise,
                                      'returnByValue': True}, timeout=timeout)
        if 'exceptionDetails' in r:
            raise RuntimeError(json.dumps(r['exceptionDetails'])[:600])
        return r.get('result', {}).get('value')

    def load():
        send('Emulation.setDeviceMetricsOverride', {'width': 1100, 'height': 1400, 'deviceScaleFactor': 1, 'mobile': False})
        send('Page.enable')
        send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.4)  # a second load must be a real one, hash and all
        send('Page.navigate', {'url': url})
        time.sleep(wait)
        if ev:
            js(ev, await_promise=True); time.sleep(0.8)
        try: js('document.fonts.ready.then(function(){return 1;})', await_promise=True, timeout=60)
        except Exception as e: say(f'fonts: {e}')
        # the page carries print.js when it was built with it; a stale dist gets it from source
        if js('typeof window.CP_PRINT') != 'object':
            say('print.js is not in this build; injecting it from src/modules/print.js')
            js(open(os.path.join(ROOT, 'src', 'modules', 'print.js'), encoding='utf-8').read())
        if js('typeof window.CP_PRINT') != 'object':
            sys.exit('print.js did not load: no window.CP_PRINT')

    def prepare(mode):
        opts = {'mode': mode}
        if only: opts['only'] = int(only)
        summary = js(f'JSON.stringify(window.CP_PRINT.prepare({json.dumps(opts)}))', timeout=180)
        say(f'prepared: {summary}')
        time.sleep(0.8)  # let the specimen's animation loops die before Paged.js takes the frames
        return summary

    def print_pdf(css_page_size):
        title = opt('--title', 'Chip Supply Chain · The Chain')
        style = ("font-family: Menlo, 'DejaVu Sans Mono', monospace; font-size: 7.5px; letter-spacing: 0.04em;"
                 " color: #5b646d; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center;")
        header = '<div style="' + style + ' margin-top: 6mm;"><span>' + title + '</span><span>' + time.strftime('%-d %B %Y') + '</span></div>'
        footer = ('<div style="' + style + ' margin-bottom: 6mm;"><span>' + site_host() + '</span>'
                  '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
        params = {'printBackground': True, 'transferMode': 'ReturnAsBase64'}
        if css_page_size:
            # Paged.js has already drawn the sheets, the heads and the folios: Chrome adds nothing
            params.update({'preferCSSPageSize': True, 'displayHeaderFooter': False,
                           'marginTop': 0, 'marginBottom': 0, 'marginLeft': 0, 'marginRight': 0})
        else:
            params.update({'preferCSSPageSize': False, 'paperWidth': 8.27, 'paperHeight': 11.69,
                           'marginTop': 0.75, 'marginBottom': 0.72, 'marginLeft': 0.79, 'marginRight': 0.79,
                           'displayHeaderFooter': True, 'headerTemplate': header, 'footerTemplate': footer})
        pdf = send('Page.printToPDF', params, timeout=600)
        if 'data' not in pdf: sys.exit('print failed: ' + json.dumps(pdf)[:300])
        open(out, 'wb').write(base64.b64decode(pdf['data']))
        say(f'wrote {out} {round(os.path.getsize(out) / 1e6, 2)} MB')

    def run_paged():
        src = open(os.path.join(ROOT, 'build', 'vendor', 'paged.polyfill.js'), encoding='utf-8').read()
        js(src, timeout=180)
        if not js('!!window.PagedPolyfill'):
            raise RuntimeError('Paged.js did not define window.PagedPolyfill')
        js("window.__cp = {state: 'running'};"
           "window.PagedPolyfill.preview().then(function (f) {"
           "  window.__cp = {state: 'done', pages: (f.pages || []).length, ms: Math.round(f.performance || 0)};"
           "}).catch(function (e) { window.__cp = {state: 'error', err: String((e && e.stack) || e)}; }); 'started'")
        t0 = time.time(); last = -1
        while True:
            st = json.loads(js("JSON.stringify(Object.assign({laid: document.querySelectorAll('.pagedjs_page').length},"
                               " window.__cp))", timeout=120))
            if st['state'] != 'running':
                break
            if st['laid'] != last:
                say(f"paginating: {st['laid']} pages"); last = st['laid']
            if time.time() - t0 > budget:
                raise RuntimeError(f"Paged.js still running after {budget}s at {st['laid']} pages")
            time.sleep(3)
        if st['state'] == 'error':
            raise RuntimeError('Paged.js: ' + st.get('err', '?')[:600])
        say(f"paginated {st['pages']} pages in {round(time.time() - t0, 1)}s (Paged.js reports {st.get('ms')} ms)")
        say('footnotes: ' + js('JSON.stringify(window.CP_PRINT.finish())', timeout=120))

    load()
    if use_paged:
        try:
            prepare('footnotes')
            run_paged()
            print_pdf(css_page_size=True)
        except Exception as e:
            say(f'PAGED.JS FAILED: {e}')
            say('falling back to Chrome pagination with the notes at the end of each chapter')
            load(); prepare('endnotes'); print_pdf(css_page_size=False)
    else:
        prepare('endnotes'); print_pdf(css_page_size=False)
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', f'/tmp/cp-pdf-profile-{os.getpid()}'])
