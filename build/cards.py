#!/usr/bin/env python3
"""Render the social cards (1200 x 630 PNG, one per chapter and per view) with headless Chrome.

usage: python3 build/cards.py [--only <slug>[,<slug>]] [--keep]

Run by hand, like build/pdf.py, not on every build. The list of pages (slug, eyebrow, title, line) is
build/modules/social.js's manifest(), read through node so the card and the unfurl page never disagree.
Output: build/assets/cards/<slug>.png; `node build/build.js` copies the folder to dist/cards/.

The template below is the site's own palette and type: paper ground, ink text, the amber accent
(--accent from src/styles.css), IBM Plex Sans Condensed for the title, Newsreader for the line,
IBM Plex Mono for the eyebrow, loaded from Google Fonts. A title that runs past two lines is shrunk
until it fits; the line is clamped to two lines. Every PNG is checked against 150 KB and quantised
to a palette (Pillow) when it is over.
"""
import base64, json, os, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'cards')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9334
W, H = 1200, 630
LIMIT = 150 * 1024

args = sys.argv[1:]
only = args[args.index('--only') + 1].split(',') if '--only' in args else None
keep = '--keep' in args  # keep the temporary HTML files for inspection

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,400&display=block">
<style>
:root { --bg: #edeff0; --ink: #12161a; --ink-2: #3a434c; --muted: #5b646d; --accent: #c98a12; --line: #cbd0d4; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; padding: 76px 84px 72px; display: flex; flex-direction: column; }
.eyebrow { font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 500; font-size: 22px; line-height: 1.3; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0; white-space: nowrap; }
.eyebrow b { font-weight: 600; color: var(--ink-2); }
.mid { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 8px 0 24px; }
.title { font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; font-weight: 600; font-size: %(title_px)spx; line-height: 1.02; letter-spacing: -0.012em; margin: 0; max-width: 1032px; overflow-wrap: normal; }
.rule { flex: 0 0 auto; width: 132px; height: 6px; background: var(--accent); margin: 34px 0 30px; border-radius: 1px; }
.line { font-family: "Newsreader", "Source Serif 4", Georgia, "Times New Roman", serif; font-weight: 400; font-size: 36px; line-height: 1.3; color: var(--ink-2); margin: 0; max-width: 940px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.foot { font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; line-height: 1; letter-spacing: 0.04em; color: var(--muted); margin: 0; display: flex; justify-content: space-between; align-items: baseline; }
.foot i { display: block; flex: 1 1 auto; height: 1px; background: var(--line); margin: 0 20px 4px 0; }
</style>
</head>
<body>
<div class="card">
  <p class="eyebrow">%(eyebrow)s</p>
  <div class="mid">
    <h1 class="title" id="title">%(title)s</h1>
    <div class="rule"></div>
    <p class="line">%(line)s</p>
  </div>
  <p class="foot"><i></i><span>yashvardhansharmaa.github.io/chokepoints</span></p>
</div>
</body>
</html>
"""

# shrink the title until it sits on at most two lines, then report whether anything still overflows
FIT_JS = """
(async () => {
  await document.fonts.ready;
  const t = document.getElementById('title');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lines = () => Math.round(t.getBoundingClientRect().height / (px * 1.02));
  while (lines() > 2 && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const card = document.querySelector('.card');
  const over = card.scrollHeight > 630 || t.scrollWidth > t.clientWidth + 1;
  const fam = (spec) => document.fonts.check(spec);  // check the weights the template uses; a weight not in the sheet reads as false
  return JSON.stringify({ px, lines: lines(), over, fonts: [fam('600 20px "IBM Plex Sans Condensed"'), fam('400 20px "Newsreader"'), fam('500 20px "IBM Plex Mono"')] });
})()
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def eyebrow_html(s):
    # the site name in the eyebrow sits a shade darker than the rest
    parts = s.split(' · ')
    return ' · '.join(['<b>%s</b>' % esc(parts[0])] + [esc(p) for p in parts[1:]])


def manifest():
    js = "process.stdout.write(JSON.stringify(require(%s).manifest()))" % json.dumps(os.path.join(ROOT, 'build', 'modules', 'social.js'))
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def shrink(path):
    """Quantise a PNG to a 256-colour palette with Pillow; flat cards lose nothing visible."""
    try:
        from PIL import Image
    except ImportError:
        return False
    im = Image.open(path).convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return True


def main():
    pages = manifest()
    if only:
        pages = [p for p in pages if p['slug'] in only]
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix='cp-cards-')
    profile = tempfile.mkdtemp(prefix='cp-cards-profile-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             '--force-device-scale-factor=1', f'--remote-debugging-port={PORT}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    fonts_ok = True
    try:
        targets = None
        for _ in range(50):
            try:
                targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list')); break
            except Exception:
                time.sleep(0.2)
        if not targets:
            sys.exit('Chrome did not answer on port %d' % PORT)
        page = next(t for t in targets if t['type'] == 'page')
        ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
        mid = [0]

        def send(method, params=None):
            mid[0] += 1
            ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get('id') == mid[0]:
                    return msg.get('result', {})

        send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 1, 'mobile': False})
        send('Page.enable')
        for i, p in enumerate(pages):
            html = TEMPLATE % {'eyebrow': eyebrow_html(p['eyebrow']), 'title': esc(p['title']), 'line': esc(p['line']), 'title_px': 104}
            src = os.path.join(tmp, p['slug'] + '.html')
            open(src, 'w').write(html)
            send('Page.navigate', {'url': 'file://' + src})
            time.sleep(2.5 if i == 0 else 0.6)  # the first page fetches the fonts; the rest find them cached
            r = send('Runtime.evaluate', {'expression': FIT_JS, 'awaitPromise': True, 'returnByValue': True})
            fit = json.loads(r.get('result', {}).get('value') or '{}')
            time.sleep(0.3)
            shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
            if 'data' not in shot:
                sys.exit('capture failed for %s: %s' % (p['slug'], json.dumps(shot)[:300]))
            out = os.path.join(OUT, p['slug'] + '.png')
            open(out, 'wb').write(base64.b64decode(shot['data']))
            size = os.path.getsize(out)
            note = ''
            if size > LIMIT:
                if shrink(out):
                    size = os.path.getsize(out); note = ' (quantised)'
                else:
                    note = ' OVER 150 KB, install Pillow, optipng or pngquant'
            if fit.get('over'):
                note += ' OVERFLOW: check the title'
            if not all(fit.get('fonts', [])):
                fonts_ok = False
            print('%-32s %4d KB  title %3spx, %s line%s%s' % (p['slug'] + '.png', size // 1024, fit.get('px', '?'), fit.get('lines', '?'), 's' if fit.get('lines') != 1 else '', note))
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()
        shutil.rmtree(profile, ignore_errors=True)
        if keep:
            print('kept', tmp)
        else:
            shutil.rmtree(tmp, ignore_errors=True)
    if not fonts_ok:
        print('warning: Google Fonts did not load; the cards fell back to system fonts', file=sys.stderr)
    print('wrote %d cards to %s' % (len(pages), OUT))


if __name__ == '__main__':
    main()
