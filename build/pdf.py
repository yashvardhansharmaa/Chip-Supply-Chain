#!/usr/bin/env python3
"""Print a view of the built site to a PDF with headless Chrome over the DevTools protocol.

usage: python3 build/pdf.py <url> <out.pdf> [--wait 6] [--eval <js>] [--title <running header>]
                            [--only N] [--chapter <id>] [--edition YYYY-MM-DD] [--port 9334]
                            [--timeout 420] [--no-paged]

The chain:     python3 build/pdf.py "http://127.0.0.1:8765/?theme=light#/chain" dist/chip-supply-chain-the-chain.pdf --wait 8
One chapter:   python3 build/pdf.py "http://127.0.0.1:8765/?theme=light#/chain" dist/pdf/lithography.pdf --chapter lithography
               (build/chapter_pdfs.py runs this for every chapter)

The page is laid out by Paged.js, injected from here because the site has no bundler. It is pinned
at build/vendor/paged.polyfill.js: v0.4.3, https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js,
sha256 f59f361802416c770d549a647958649af2cf6601999924bc00e4f507dad5269f.
Paged.js is what makes the two things Chrome cannot do alone:
each source printed as a footnote at the foot of the page its superscript falls on, and running
heads and folios in the page margins. src/modules/print.css is the stylesheet; src/modules/print.js
writes each note at print time from the data-* fields already on every citation.

--only N paginates the first N chapters only, for iterating on the design.
--chapter <id> lays that chapter out alone: a compact title block (site, chapter, edition, the chapter's own page,
how to cite it) in place of the cover and contents, with the same footnotes, running heads and folios.
--edition YYYY-MM-DD dates the PDF; the default is today. "Edition of 20 October 2026" goes on the title block, in
the foot of every page and in the citation.
--port is the DevTools port (9334); if another run holds it, this one waits for it to come free.
After each layout print.js reports how the pages came out (short pages, a card or figure that left a gap, text run into
the notes or left off the page, a chapter's last sources alone on a page); lay_out() below lays the document out again,
up to six times, with those figures and cards moved down the text, those cards or source lists set closer, and prints
the best layout. "TEXT OFF THE PAGE" in the log means some
text would not print; build/chapter_pdfs.py refuses such a file.
--no-paged falls back to Chrome's own pagination, with each chapter's notes at its end; the same
fallback runs by itself if Paged.js cannot lay the document out.
"""
import json, subprocess, sys, time, urllib.request, os, base64, socket, datetime
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
url, out = args[0], args[1]
def site_info():
    js = 'var s=require(%s);process.stdout.write(JSON.stringify({url:s.url,host:s.host}))' % json.dumps(os.path.join(ROOT, 'build', 'site.js'))
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)
SITE = site_info()
def site_host():
    return SITE['host']

def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
def flag(name):
    return name in args
wait = opt('--wait', 6.0); ev = opt('--eval', ''); only = opt('--only', 0); chapter = opt('--chapter', '')
budget = opt('--timeout', 420.0); use_paged = not flag('--no-paged')
port = opt('--port', 9334)
# the edition is the day the PDF is made, unless --edition pins it (so a set made across midnight shares one)
try:
    day = datetime.date.fromisoformat(opt('--edition', '')) if '--edition' in args else datetime.date.today()
except ValueError:
    sys.exit('--edition takes a date as YYYY-MM-DD')
edition = f'{day.day} {day.strftime("%B")} {day.year}'

# one Chrome to a port: if another run (or another agent) holds it, wait for it to finish rather than talk to its browser
def port_busy(p):
    with socket.socket() as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', p)) == 0
for i in range(144):
    if not port_busy(port): break
    if i == 0: print(f'port {port} is in use (another PDF run?): waiting for it to come free', flush=True)
    time.sleep(5)
else:
    sys.exit(f'port {port} is still in use after 12 minutes')
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
        if chapter and not js(f'!!document.querySelector("article.chapter#" + CSS.escape({json.dumps(chapter)}))'):
            sys.exit(f'no chapter "{chapter}" on {url}')

    def prepare(mode, fit=None):
        opts = {'mode': mode, 'edition': edition, 'site': SITE['url']}
        if only: opts['only'] = int(only)
        if chapter: opts['chapter'] = chapter
        opts.update({k: v for k, v in (fit or {}).items() if v})  # moves and tight, from lay_out()
        summary = js(f'JSON.stringify(window.CP_PRINT.prepare({json.dumps(opts)}))', timeout=180)
        say(f'prepared: {summary}')
        # prepare() swaps the variable web fonts for static ones (they embed as text, not Type 3 shapes): wait for them
        if js("typeof window.CP_PRINT.fontsReady") == 'function':
            try: say(f"print fonts: {js('window.CP_PRINT.fontsReady()', await_promise=True, timeout=90)} faces loaded")
            except Exception as e: say(f'print fonts: {e}')
        time.sleep(0.8)  # let the specimen's animation loops die before Paged.js takes the frames
        return summary

    def print_pdf(css_page_size):
        # the fallback's own head and foot (Chrome's templates): the title and the edition, the site and the folio
        title = opt('--title', js('document.title') if chapter else 'Chip Supply Chain · The Chain')
        style = ("font-family: Menlo, 'DejaVu Sans Mono', monospace; font-size: 7.5px; letter-spacing: 0.04em;"
                 " color: #5b646d; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center;")
        header = '<div style="' + style + ' margin-top: 6mm;"><span>' + title + '</span><span>Edition of ' + edition + '</span></div>'
        footer = ('<div style="' + style + ' margin-bottom: 6mm;"><span>' + site_host() + '</span>'
                  '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
        params = {'printBackground': True, 'transferMode': 'ReturnAsBase64'}
        if css_page_size:
            # Paged.js has already drawn the sheets, the heads and the folios: Chrome adds nothing
            params.update({'preferCSSPageSize': True, 'displayHeaderFooter': False,
                           'marginTop': 0, 'marginBottom': 0, 'marginLeft': 0, 'marginRight': 0})
        else:
            # Chrome now draws print.css's margin boxes itself, in its default type: this path prints its own head and
            # foot, so those boxes are emptied, or every page would carry both
            js("(function () { var s = document.createElement('style'); s.textContent = '@page { @top-left { content: none; }"
               " @top-right { content: none; } @bottom-left { content: none; } @bottom-right { content: none; } }';"
               " document.head.appendChild(s); })()")
            params.update({'preferCSSPageSize': False, 'paperWidth': 8.27, 'paperHeight': 11.69,
                           'marginTop': 0.75, 'marginBottom': 0.72, 'marginLeft': 0.79, 'marginRight': 0.79,
                           'displayHeaderFooter': True, 'headerTemplate': header, 'footerTemplate': footer})
        pdf = send('Page.printToPDF', params, timeout=600)
        if 'data' not in pdf: sys.exit('print failed: ' + json.dumps(pdf)[:300])
        os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
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
        report = js('JSON.stringify(window.CP_PRINT.finish())', timeout=120)
        say('footnotes: ' + report)
        return json.loads(report or '{}')

    # A block kept whole that opens a page the page before could not hold leaves a gap there. print.js finish() names
    # them: a figure or a card (floats) goes as far down the text as the text needs to fill the gap; a chapter whose card
    # did it and cannot move (tight) has its head and card set closer; a chapter whose last sources ran onto a page of
    # their own (sources) has its source list set closer. A card that runs into the notes of its page (crowded) is set closer, and if
    # it still does, may break between its parts (split). The document is laid out again with those, up to six times; a
    # layout is kept only if it leaves less text off the page (lost, which must be none), or runs into the notes on fewer
    # pages, or leaves fewer headings at the foot of a page, or has fewer short pages, or fewer pages, or fewer cards that
    # do not head their page (one that could still move up under its opening paragraph, so the opener is left short; or,
    # counted twice, one moved past a paragraph that then did not fit the page before, failed), or less room left empty,
    # in that order. A failed move is undone and not tried again. The last layout made is the one printed, so after a
    # worse one the best is laid out again.
    def lay_out():
        fit, seen, tried, pinned, tried_tight = {'moves': {}, 'tight': {}, 'split': {}, 'sources': {}, 'nudge': {}, 'breaks': {}}, [], set(), set(), set()
        prepare('footnotes'); best = run_paged()
        score = lambda r: (len(r.get('lost') or []), len(r.get('overlap') or []), len(r.get('stranded') or []),
                           len(r.get('short') or []), r.get('pages') or 0,
                           len([f for f in r.get('floats') or [] if str(f.get('id', '')).startswith('card-')]) + 2 * len(r.get('failed') or []),
                           r.get('gap') or 0)
        current = True
        for _ in range(6):
            trial = {'moves': dict(fit['moves']), 'tight': dict(fit['tight']), 'split': dict(fit['split']), 'sources': dict(fit['sources']),
                     'nudge': dict(fit['nudge']), 'breaks': dict(fit['breaks'])}
            # a heading left at the foot of a page opens the next one instead
            for t in best.get('strandedIds') or []: trial['breaks'][t] = 1
            for c in best.get('failed') or []: trial['moves'].pop(c, None); pinned.add(c)
            for f in best.get('floats') or []:
                if f['id'] not in pinned: trial['moves'][f['id']] = trial['moves'].get(f['id'], 0) + int(f['k'])
            # a card that opens a page after a short one: its chapter set closer; if that was tried and the page before
            # is still short, the card may also break between its parts, so it can start on that page
            for t in best.get('tight') or []:
                trial['tight'][t] = 1
                if t in tried_tight: trial['split'][t] = 1
                tried_tight.add(t)
            for t in best.get('sources') or []: trial['sources'][t] = 1
            for t in best.get('crowded') or []:
                if t in trial['tight'] or t in tried: trial['split'][t] = 1
                else: trial['tight'][t] = 1
                tried.add(t)
            # Paged.js now and then cuts a page at the wrong line when a footnote's call falls near its foot, and the lines
            # between are lost (lost, lostIn): that chapter is laid out again set closer, so its lines fall elsewhere
            for t in best.get('lostIn') or []:
                if t not in trial['tight']: trial['tight'][t] = 1
                else: trial['sources'][t] = 1
            if trial == fit or trial in seen: break
            seen.append(trial)
            say('laying out again: ' + ', '.join([f'{i} down {n}' for i, n in trial['moves'].items() if n != fit['moves'].get(i)]
                                                 + [f'{i} back' for i in fit['moves'] if i not in trial['moves']]
                                                 + [f'{i} closer' for i in trial['tight'] if i not in fit['tight']]
                                                 + [f'{i} card may break' for i in trial['split'] if i not in fit['split']]
                                                 + [f'{i} sources closer' for i in trial['sources'] if i not in fit['sources']]
                                                 + [f'{i} to the next page' for i in trial['breaks'] if i not in fit['breaks']]))
            load(); prepare('footnotes', trial); again = run_paged()
            # a layout that lost lines to that Paged.js habit is tried once more with the chapter's lines set a little
            # closer (print.js .cp-nudge), so they fall elsewhere: otherwise a layout that mends the rest would be thrown out
            if again.get('lost') and any(t not in trial['nudge'] for t in again.get('lostIn') or []):
                nudged = dict(trial, nudge=dict(trial['nudge'], **{t: 1 for t in again['lostIn']}))
                say('laying out again: ' + ', '.join(f'{t} lines closer' for t in again['lostIn'] if t not in trial['nudge']))
                load(); prepare('footnotes', nudged); again2 = run_paged()
                if score(again2) < score(again): trial, again = nudged, again2
                seen.append(trial)
            pinned.update(again.get('failed') or [])  # a card move that failed is not tried again, whichever layout is kept
            if score(again) < score(best):
                fit, best, current = trial, again, True
            else:
                say('no better than the layout before'); current = False
        if not current:
            load(); prepare('footnotes', fit); run_paged()
        return best

    load()
    if use_paged:
        try:
            laid = lay_out()
            if laid.get('lost'):  # build/chapter_pdfs.py refuses a file whose log says this
                say(f"TEXT OFF THE PAGE on page(s) {', '.join(laid['lost'])}: a block kept whole was taller than its page")
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
