#!/usr/bin/env python3
"""Render the social cards (1200 x 630 PNG, one per chapter and per view) with headless Chrome.

usage: python3 build/cards.py [--only <slug>[,<slug>]] [--keep]

Run by hand, like build/pdf.py, not on every build. The list of pages (slug, eyebrow, title, line) is
build/modules/social.js's manifest(), read through node so the card and the unfurl page never disagree.
Output: build/assets/cards/<slug>.png; `node build/build.js` copies the folder to dist/cards/.

The card is the "Dark" direction from qa/cards-redesign: the site's dark tokens (:root[data-theme="dark"]
in src/styles.css), the amber rule, IBM Plex Sans Condensed for the title, Newsreader for the line,
IBM Plex Mono for the eyebrow and the domain at the foot, and on the right the chapter's own specimen,
the point cloud the page itself shows, dumped from src/kit.js by build/cards-art.js and drawn here with
Pillow in pale ink with its accent points in amber, at the tilt the site opens it at. A chapter names its
specimen in its front matter; a view takes one from VIEW_SPECIMEN below.

A title that runs past two lines is shrunk until it fits in the text column, so it never reaches the art;
the line is shrunk until two lines hold it. Every PNG is quantised to a palette and must come in under 150 KB; if it
does not, the cloud is thinned and the card drawn again.
"""
import base64, json, math, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'cards')
ART_JS = os.path.join(ROOT, 'build', 'cards-art.js')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9334
W, H = 1200, 630
ART_W = 640                 # the art box, flush right, faded under the text column where they overlap
COL_W = 600                 # the text column, from x = 72
LIMIT = 150 * 1024
DENSITY = 0.8               # share of each cloud's points drawn; thinned further when a PNG is over the limit
COLORS = 256

args = sys.argv[1:]
only = args[args.index('--only') + 1].split(',') if '--only' in args else None
keep = '--keep' in args  # keep the temporary HTML and art files for inspection

# :root[data-theme="dark"] in src/styles.css
DARK = dict(bg='#101315', bg2='#171b1e', ink='#e7e9ea', ink2='#c0c7cc', muted='#8b959d', rule_line='#2a3137', accent='#e6ad2f')

# the specimen a view shows; chapters name theirs in content/*.md front matter
VIEW_SPECIMEN = {'home': 'die-floorplan', 'intro': 'die-floorplan', 'chain': 'die-floorplan', 'chips': 'package',
                 'suppliers': 'globe', 'export-controls': 'globe', 'glossary': 'wafer'}

# the short label at the foot; the kit's captions run to a paragraph
LABEL = {
    'die-floorplan': 'GPU die, one reticle field', 'boule-and-wafer': 'Silicon ingot and wafer', 'gas-cabinet': 'Specialty gas cabinet',
    'euv-scanner': 'EUV scanner, in section', 'photomask': 'EUV reticle and pellicle', 'process-chamber': 'Plasma etch chamber, in section',
    'sem-column': 'Electron-beam inspection column', 'gaa-transistor': 'Gate-all-around transistor', 'foup': 'FOUP, 25 wafers',
    'hbm-stack': 'HBM stack, twelve high', 'cowos-exploded': 'CoWoS package, exploded', 'substrate-layers': 'Flip-chip substrate, cut away',
    'probe-card': 'Probe card over a wafer', 'gpu-baseboard': 'Eight-GPU baseboard', 'rack': 'Liquid-cooled rack, 72 accelerators',
    'wafer-cost': 'Cost of one B200, to scale', 'globe': 'Chokepoint towns', 'package': 'Wafer-scale processor', 'wafer': '300 mm wafer',
}

# per-specimen framing: zoom (1 = fit the box), horizontal and vertical offset as a share of the box
FRAME = {'globe': dict(zoom=0.88), 'wafer-cost': dict(zoom=0.97), 'rack': dict(zoom=1.0), 'boule-and-wafer': dict(zoom=0.94), 'sem-column': dict(zoom=1.0),
         'euv-scanner': dict(zoom=0.94)}

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,400&display=block">
<style>
:root { --bg: %(bg)s; --bg-2: %(bg2)s; --ink: %(ink)s; --ink-2: %(ink2)s; --muted: %(muted)s; --line: %(rule_line)s; --accent: %(accent)s; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
.art { position: absolute; right: 0; top: 0; width: %(art_w)spx; height: 630px; background: url(%(art)s) 0 0 / %(art_w)spx 630px no-repeat; }
.art::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, var(--bg) 0%%, rgba(16,19,21,0.86) 14%%, rgba(16,19,21,0) 42%%); }
.text { position: absolute; left: 72px; top: 64px; bottom: 56px; width: %(col_w)spx; display: flex; flex-direction: column; }
.eyebrow { font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 500; font-size: 19px; line-height: 1.3; letter-spacing: 0.09em; text-transform: uppercase; color: var(--muted); margin: 0; white-space: nowrap; }
.eyebrow b { font-weight: 600; color: var(--ink-2); }
.mid { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 6px 0 20px; }
.title { font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; font-weight: 600; font-size: %(title_px)spx; line-height: 1.02; letter-spacing: -0.012em; margin: 0; color: var(--ink); overflow-wrap: normal; }
.rule { flex: 0 0 auto; width: 120px; height: 6px; background: var(--accent); margin: 30px 0 26px; border-radius: 1px; }
.line { font-family: "Newsreader", "Source Serif 4", Georgia, "Times New Roman", serif; font-weight: 400; font-size: 32px; line-height: 1.28; color: var(--ink-2); margin: 0; max-width: 540px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.foot { font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; line-height: 1; letter-spacing: 0.04em; color: var(--muted); margin: 0; white-space: nowrap; }
.foot span { margin-left: 28px; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.8; }
</style>
</head>
<body>
<div class="card">
  <div class="art"></div>
  <div class="text">
    <p class="eyebrow">%(eyebrow)s</p>
    <div class="mid">
      <h1 class="title" id="title">%(title)s</h1>
      <div class="rule"></div>
      <p class="line" id="line">%(line)s</p>
    </div>
    <p class="foot">%(host)s<span>%(label)s</span></p>
  </div>
</div>
</body>
</html>
"""

# shrink the title until it sits on at most two lines inside the text column, and the line until its two lines hold the whole
# sentence (a chapter without a chokepoint card carries its first plain sentence), then report whether anything still overflows
FIT_JS = """
(async () => {
  await document.fonts.ready;
  const t = document.getElementById('title');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lines = () => Math.round(t.getBoundingClientRect().height / (px * 1.02));
  const wide = () => t.scrollWidth > t.clientWidth + 1;
  while ((lines() > 2 || wide()) && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const l = document.getElementById('line');
  let lpx = parseFloat(getComputedStyle(l).fontSize);
  while (l.scrollHeight > l.clientHeight + 2 && lpx > 22) { lpx -= 1; l.style.fontSize = lpx + 'px'; }
  const text = document.querySelector('.text');
  const over = text.scrollHeight > text.clientHeight + 4 || wide() || l.scrollHeight > l.clientHeight + 2;
  const fam = (spec) => document.fonts.check(spec);  // check the weights the template uses; a weight not in the sheet reads as false
  return JSON.stringify({ px, lpx, lines: lines(), over, fonts: [fam('600 20px "IBM Plex Sans Condensed"'), fam('400 20px "Newsreader"'), fam('500 20px "IBM Plex Mono"')] });
})()
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def eyebrow_html(s):
    # the site name in the eyebrow sits a shade lighter than the rest
    parts = s.split(' · ')
    return ' · '.join(['<b>%s</b>' % esc(parts[0])] + [esc(p) for p in parts[1:]])


def site_host():
    js = "process.stdout.write(require(%s).host)" % json.dumps(os.path.join(ROOT, 'build', 'site.js'))
    return subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout.strip()


def manifest():
    js = "process.stdout.write(JSON.stringify(require(%s).manifest()))" % json.dumps(os.path.join(ROOT, 'build', 'modules', 'social.js'))
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def chapter_specimens():
    """chapter id -> specimen name, from the JSON front matter of content/NN-*.md."""
    out = {}
    cdir = os.path.join(ROOT, 'content')
    for f in sorted(os.listdir(cdir)):
        if not re.match(r'^\d\d-.*\.md$', f):
            continue
        m = re.match(r'^---json\s*\n([\s\S]*?)\n---', open(os.path.join(cdir, f)).read())
        if m:
            fm = json.loads(m.group(1))
            if fm.get('specimen'):
                out[fm['id']] = fm['specimen']
    return out


def specimen_for(p, chapters):
    if p['kind'] == 'chapter':
        return chapters.get(p['slug'], 'die-floorplan')
    return VIEW_SPECIMEN.get(p['slug'], 'die-floorplan')


# ---------- the art: a point cloud drawn with Pillow ----------

def dump_cloud(name, folder):
    """Run build/cards-art.js once per specimen; returns (bin path, meta)."""
    binpath = os.path.join(folder, name + '.bin')
    if not os.path.exists(binpath):
        r = subprocess.run(['node', ART_JS, name, binpath], capture_output=True, text=True, cwd=ROOT)
        if r.returncode:
            sys.exit('cards-art.js failed for %s: %s' % (name, r.stderr.strip()[-400:]))
        open(binpath + '.json', 'w').write(r.stdout.strip().splitlines()[-1])
    return binpath, json.load(open(binpath + '.json'))


def hexcol(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def rot(rx, ry, rz):
    import numpy as np
    cx, sx = math.cos(rx), math.sin(rx)
    cy, sy = math.cos(ry), math.sin(ry)
    cz, sz = math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def render_art(binpath, tilt, out, density, box=(ART_W, H), zoom=0.92, ox=0.0, oy=0.0, S=1):
    """Draw the cloud into a transparent box: pale ink points, accent points (w >= 2) in amber, far to near, the way
    qa/cover/render.py does it. density is the share of points kept (a fixed subsample, so a re-render is repeatable).
    S is the supersample; 1 keeps the dots crisp, as on the page, and halves the PNG against S = 2."""
    import numpy as np
    from PIL import Image, ImageDraw
    inkc, ambc = hexcol(DARK['ink']), hexcol(DARK['accent'])
    data = np.fromfile(binpath, dtype=np.float32).reshape(-1, 4)
    if density < 1:
        rng = np.random.default_rng(7)
        data = data[rng.random(len(data)) < density]
    xyz, w = data[:, :3].astype(np.float64), data[:, 3].astype(np.float64)
    p = xyz @ rot(*tilt).T
    z = p[:, 2]
    f = 1.55 / (3.2 - z)
    u, v = p[:, 0] * f, -p[:, 1] * f
    du, dv = u.max() - u.min(), v.max() - v.min()
    Wpx, Hpx = box[0] * S, box[1] * S
    scale = zoom * min(Wpx / du, Hpx / dv)
    u = (u - (u.min() + u.max()) / 2) * scale + Wpx / 2 + ox * Wpx
    v = (v - (v.min() + v.max()) / 2) * scale + Hpx / 2 + oy * Hpx
    img = Image.new('RGBA', (Wpx, Hpx), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    order = np.argsort(z)
    uo, vo, wo, zo = u[order], v[order], w[order], z[order]
    zr = (zo - zo.min()) / max(1e-6, zo.max() - zo.min())
    is_amber = wo >= 2.0
    strength = np.where(is_amber, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1))
    amin, amax = 30, 150
    alpha = amin + (amax - amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_amber, np.clip(alpha * 1.35, 0, 255), alpha)
    rad = (1.2 + 0.8 * zr) * S
    for x, y, r, a, amb in zip(uo, vo, rad, alpha, is_amber):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(ambc if amb else inkc) + (int(a),))
    if S > 1:
        img = img.resize(box, Image.LANCZOS)
    img.save(out, optimize=False)
    return len(data)


def shrink(path, colors=COLORS):
    """Quantise a PNG to a palette with Pillow; the cloud is already a two-colour drawing over a flat ground."""
    from PIL import Image
    im = Image.open(path).convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return os.path.getsize(path)


def main():
    pages = manifest()
    host = site_host()
    chapters = chapter_specimens()
    if only:
        pages = [p for p in pages if p['slug'] in only]
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix='cp-cards-')
    profile = tempfile.mkdtemp(prefix='cp-cards-profile-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             '--force-device-scale-factor=1', f'--remote-debugging-port={PORT}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    fonts_ok = True
    total = 0
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
        first = True
        for p in pages:
            name = specimen_for(p, chapters)
            binpath, meta = dump_cloud(name, tmp)
            frame = FRAME.get(name, {})
            density = DENSITY
            out = os.path.join(OUT, p['slug'] + '.png')
            for attempt in range(4):
                art = os.path.join(tmp, '%s-%s.png' % (p['slug'], attempt))
                drawn = render_art(binpath, meta['tilt'], art, density, zoom=frame.get('zoom', 0.92), ox=frame.get('ox', 0.0), oy=frame.get('oy', 0.0))
                html = TEMPLATE % dict(DARK, art_w=ART_W, col_w=COL_W, art='file://' + art, eyebrow=eyebrow_html(p['eyebrow']),
                                       title=esc(p['title']), line=esc(p['line']), title_px=104, host=host, label=esc(LABEL.get(name, name)))
                src = os.path.join(tmp, p['slug'] + '.html')
                open(src, 'w').write(html)
                send('Page.navigate', {'url': 'file://' + src})
                # wait until this page, not the last one, is the document Chrome answers for; the first page also fetches the fonts
                ready = "document.readyState === 'complete' && location.href.endsWith(%s) && !!document.getElementById('title')" % json.dumps('/' + p['slug'] + '.html')
                for _ in range(100):
                    if send('Runtime.evaluate', {'expression': ready, 'returnByValue': True}).get('result', {}).get('value') is True:
                        break
                    time.sleep(0.1)
                else:
                    sys.exit('page did not load for %s' % p['slug'])
                time.sleep(2.0 if first else 0.3)
                first = False
                r = send('Runtime.evaluate', {'expression': FIT_JS, 'awaitPromise': True, 'returnByValue': True})
                val = r.get('result', {}).get('value')
                if not isinstance(val, str):
                    sys.exit('fit script failed for %s: %s' % (p['slug'], json.dumps(r.get('exceptionDetails') or r)[:400]))
                fit = json.loads(val)
                time.sleep(0.3)
                shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
                if 'data' not in shot or len(shot['data']) < 4000:
                    sys.exit('capture failed for %s: %s' % (p['slug'], json.dumps(shot)[:300]))
                open(out, 'wb').write(base64.b64decode(shot['data']))
                size = shrink(out)
                if size <= LIMIT:
                    break
                density *= 0.72  # thin the cloud and draw again
            note = ' (%d of %d points)' % (drawn, meta['points'])
            if size > LIMIT:
                note += ' OVER 150 KB'
            if fit.get('over'):
                note += ' OVERFLOW: check the title'
            if not all(fit.get('fonts', [])):
                fonts_ok = False
            total += size
            print('%-32s %4d KB  %-16s title %3spx, %s line%s, line %2spx%s' % (p['slug'] + '.png', size // 1024, name, fit.get('px', '?'), fit.get('lines', '?'),
                                                                                's' if fit.get('lines') != 1 else '', fit.get('lpx', '?'), note))
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
    print('wrote %d cards to %s, %d KB in all' % (len(pages), OUT, total // 1024))


if __name__ == '__main__':
    main()
