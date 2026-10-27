#!/usr/bin/env python3
"""Print the short summary (dist/summary/index.html, written by build/modules/summary-brief.js) to a PDF.

usage: python3 build/summary_pdf.py [<url>] [<out.pdf>] [--port 9761] [--wait 4] [--edition YYYY-MM-DD] [--force] [--dark]
defaults: http://127.0.0.1:8765/summary/ and dist/pdf/summary.pdf

Chrome's own pagination is enough here: the page is A4 with its own @page rules, and the stage blocks do not break
across pages. The script refuses to write a file that is not 2 to 5 pages (--force skips that test), or one under 30 KB
(a page that failed to load).

The summary is dated as an edition, the day it is printed unless --edition pins it: "Edition of 20 October 2026" takes
the place of "Updated <day>" on its title block and in its closing line, a citation for the edition follows that line,
and the foot of every page carries the edition and the folio. Any other page (a readable chapter page, the main page)
is printed exactly as the browser would print it, which makes this the check for the browser's own print; --dark
prints it as a computer set to dark mode would.
"""
import base64, datetime, json, os, re, subprocess, sys, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:]]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return type(default)(v)
    return default
port = opt('--port', 9761); wait = opt('--wait', 4.0)
try:
    day = datetime.date.fromisoformat(opt('--edition', datetime.date.today().isoformat()))
except ValueError:
    sys.exit('--edition takes a date as YYYY-MM-DD')
edition = f'Edition of {day.day} {day.strftime("%B")} {day.year}'
force = '--force' in args
if force: args.remove('--force')
dark = '--dark' in args
if dark: args.remove('--dark')
url = args[0] if len(args) > 0 else 'http://127.0.0.1:8765/summary/'
out = args[1] if len(args) > 1 else os.path.join(ROOT, 'dist', 'pdf', 'summary.pdf')
site = json.loads(subprocess.run(['node', '-e', 'var s=require(%s);process.stdout.write(JSON.stringify({url:s.url,host:s.host}))'
                                  % json.dumps(os.path.join(ROOT, 'build', 'site.js'))], capture_output=True, text=True, check=True).stdout)

# the summary's edition, written into its print layout (.prt, build/modules/summary-brief.js) just before it is printed
EDITION_JS = r'''(function (edition, host, pdf) {
  var prt = document.querySelector('.prt'); if (!prt) return 'not the summary';
  var day = /(?:Summary )?[Uu]pdated \d{1,2} [A-Z][a-z]+ \d{4}/;
  var meta = prt.querySelector('header .meta');
  if (meta) { if (day.test(meta.innerHTML)) meta.innerHTML = meta.innerHTML.replace(day, edition); else meta.insertAdjacentText('afterbegin', edition + ' · '); }
  var end = prt.querySelector('.foot'), h = prt.querySelector('h1');
  if (end) {
    if (day.test(end.innerHTML)) end.innerHTML = end.innerHTML.replace(day, edition);
    var c = document.createElement('p'); c.className = 'foot foot-cite';
    c.textContent = 'Cite as: Sharma, Yashvardhan. ' + (h ? '“' + h.textContent.trim() + '.” ' : '') + 'Chip Supply Chain: How AI Chips Are Made. ' + edition + '. ' + pdf;
    end.insertAdjacentElement('afterend', c);
  }
  var box = 'font: 500 7pt "Hanken Grotesk", system-ui, sans-serif; color: var(--ink-2, #45443f);';
  var s = document.createElement('style');
  s.textContent = '@page { @bottom-left { content: ' + JSON.stringify(host + ' · ' + edition) + '; ' + box + ' }'
    + ' @bottom-right { content: counter(page) " / " counter(pages); ' + box + ' } }'
    + ' @media print { .prt .foot-cite { border-top: 0; margin-top: 3pt; padding-top: 0; } }'
    + ' @page { @bottom-right { font-family: "Fragment Mono", ui-monospace, monospace; font-weight: 400; } }';
  document.head.appendChild(s);
  return 'dated';
})'''

# Static fonts for the summary's print, as src/modules/print.js does for the chapters: Chrome puts a variable font into
# a PDF as Type 3 shapes, which copy and search as broken words, so the page's variable families give way to fixed
# instances of the same OFL families, one Google Fonts request per instance (several weights in one request come back
# as one variable file), each at a named weight (a weight between them prints as Type 3 again). The site's three (design
# round five, 27 Oct 2026; Fraunces and Literata before it): Source Serif 4 for the heads, the text and the wordmark, its
# optical size fixed at 9, near the summary's printed text, at 400, 500 and 600 and an italic at 400; Hanken Grotesk for
# the labels and Fragment Mono for numbers, codes and dates. No bold or italic is made up by the browser
# (font-synthesis), for the same reason.
FONTS_JS = r"""(function () {
  if (!document.querySelector('.prt')) return Promise.resolve('as is');
  var fams = ['Source+Serif+4:ital,opsz,wght@0,9,400', 'Source+Serif+4:ital,opsz,wght@0,9,500', 'Source+Serif+4:ital,opsz,wght@0,9,600',
    'Source+Serif+4:ital,opsz,wght@1,9,400',
    'Hanken+Grotesk:wght@400', 'Hanken+Grotesk:wght@500', 'Hanken+Grotesk:wght@600', 'Hanken+Grotesk:wght@700', 'Fragment+Mono'];
  Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]'), function (l) { l.remove(); });
  var loads = fams.map(function (f) {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + f + '&display=block';
    var p = new Promise(function (done) { l.onload = done; l.onerror = done; });
    document.head.appendChild(l); return p;
  });
  var s = document.createElement('style');
  s.textContent = '@media print { *, *::before, *::after { font-variation-settings: normal !important; font-optical-sizing: none; font-synthesis: none; } }';
  document.head.appendChild(s);
  var faces = ['400 22pt "Source Serif 4"', '500 14pt "Source Serif 4"', '400 9pt "Source Serif 4"', '600 9pt "Source Serif 4"', 'italic 400 9pt "Source Serif 4"',
    '400 8pt "Hanken Grotesk"', '500 8pt "Hanken Grotesk"', '600 8pt "Hanken Grotesk"', '700 8pt "Hanken Grotesk"', '400 8pt "Fragment Mono"'];
  return Promise.all(loads).then(function () {
    return Promise.all(faces.map(function (f) { return document.fonts.load(f).catch(function () { return []; }); }));
  }).then(function () { return document.fonts.ready; }).then(function () { return 'static fonts'; });
})()"""

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
    if dark: send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-color-scheme', 'value': 'dark'}]})
    send('Page.enable'); send('Page.navigate', {'url': url})
    time.sleep(wait)
    send('Runtime.evaluate', {'expression': 'document.fonts.ready.then(() => true)', 'awaitPromise': True, 'returnByValue': True})
    dated = send('Runtime.evaluate', {'expression': EDITION_JS + '(%s, %s, %s)' % (json.dumps(edition), json.dumps(site['host']),
                 json.dumps(site['url'] + 'pdf/summary.pdf')), 'returnByValue': True}).get('result', {}).get('value')
    send('Runtime.evaluate', {'expression': FONTS_JS, 'awaitPromise': True, 'returnByValue': True})
    pdf = send('Page.printToPDF', {'preferCSSPageSize': True, 'printBackground': True, 'displayHeaderFooter': False})
    data = base64.b64decode(pdf['data'])
    pages = len(re.findall(rb'/Type\s*/Page[^s]', data))
    if len(data) < 30000: sys.exit(f'refusing to write: only {len(data)} bytes, so the page probably failed to load ({url})')
    if not force and not 2 <= pages <= 5: sys.exit(f'refusing to write: {pages} pages, the summary must run 2 to 5')
    open(out, 'wb').write(data)
    print(f'wrote {out}: {pages} pages, {len(data) / 1e6:.2f} MB' + (f', {edition}' if dated == 'dated' else ', as the browser prints it') + (' (dark mode)' if dark else ''))
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', profile])
