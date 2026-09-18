#!/usr/bin/env python3
"""Round-2 card mocks for the "contrast" designer: three directions (night, split, garnet) for the home and
Lithography cards. An adapted copy of build/cards.py; the originals are untouched.

usage: python3 qa/cards-redesign-2/contrast/cards.py [--direction night,split,garnet] [--only home,lithography] [--keep]

Output: qa/cards-redesign-2/contrast/<direction>-<slug>.png. Chrome on DevTools port 9422.
"""
import base64, json, math, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket  # websocket-client

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = HERE
ART_JS = os.path.join(HERE, 'cards-art.js')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9422
W, H = 1200, 630
LIMIT = 150 * 1024
DENSITY = 0.55
COLORS = 256

args = sys.argv[1:]
only = args[args.index('--only') + 1].split(',') if '--only' in args else ['home', 'lithography']
directions = args[args.index('--direction') + 1].split(',') if '--direction' in args else ['night', 'split', 'garnet']
keep = '--keep' in args

# tokens from qa/brand-build.md; the dark ground is the brief's #0f1216
LIGHT = dict(bg='#f7f6f2', ink='#14181f', ink2='#3b424c', muted='#5c636d', line='#d8d4cc', line2='#bfb9af', accent='#7a1f2b')
DARK = dict(bg='#0f1216', ink='#ece9e2', ink2='#c3c7cd', muted='#939aa3', line='#2c3138', line2='#3d434b', accent='#d4667b')
GARNET = dict(bg='#7a1f2b', ink='#f7f6f2', ink2='#f1e4e2', muted='#e4bfc3', line='#9a4a55', line2='#b0666f', accent='#f7f6f2')

VIEW_SPECIMEN = {'home': 'die-floorplan'}
PLATE = {'die-floorplan': ('01', 'Chip design, EDA and IP'), 'euv-scanner': ('04', 'Lithography')}
FRAME = {'euv-scanner': dict(zoom=0.96), 'die-floorplan': dict(zoom=1.0)}

# the home card carries what the home page shows: the wordmark, the page title, its dek
HOME = dict(title='How AI chips are made', line='An introduction to the entire semiconductor supply chain.')

FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Instrument+Sans:wght@400;500;600&family=Jost:wght@400;500&display=block'

CSS = """
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
.wordmark { font-family: "Fraunces", Georgia, serif; font-weight: 500; font-variation-settings: "opsz" 36, "SOFT" 0, "WONK" 0; font-variant-caps: small-caps; letter-spacing: 0.075em; font-size: 26px; line-height: 1; margin: 0; color: var(--ink); }
.wordmark i { font-family: "Source Serif 4", Georgia, serif; font-style: italic; font-variant-caps: normal; letter-spacing: 0; font-weight: 400; font-size: 19px; color: var(--muted); margin-left: 16px; }
.eyebrow { font-family: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; font-weight: 500; font-size: 17px; line-height: 1.3; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0; white-space: nowrap; }
.eyebrow b { font-weight: 500; color: var(--ink); }
.eyebrow em { font-style: normal; color: var(--accent); }
.text { position: absolute; left: %(text_left)spx; top: 60px; bottom: 54px; width: %(col_w)spx; display: flex; flex-direction: column; }
.mid { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 8px 0 24px; }
.title { font-family: "Fraunces", Georgia, serif; font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; font-weight: 400; font-size: %(title_px)spx; line-height: 1.0; letter-spacing: -0.012em; margin: 0; color: var(--ink); overflow-wrap: normal; }
.line { font-family: "Source Serif 4", Georgia, serif; font-weight: 400; font-size: 27px; line-height: 1.32; color: var(--ink2); margin: 22px 0 0; max-width: %(line_w)spx; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.tags { display: flex; gap: 10px; margin: 26px 0 0; flex-wrap: wrap; }
.tags span { font-family: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; font-weight: 500; font-size: 15px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); border: 1px solid var(--accent); padding: 7px 11px 6px; line-height: 1; white-space: nowrap; }
.foot { font-family: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; font-weight: 500; font-size: 18px; line-height: 1; letter-spacing: 0.04em; color: var(--ink2); margin: 0; white-space: nowrap; }
.spec { position: absolute; left: %(art_x)spx; top: %(art_y)spx; width: %(art_w)spx; }
.spec .art { width: %(art_w)spx; height: %(art_h)spx; background: url(%(art)s) 0 0 / %(art_w)spx %(art_h)spx no-repeat; }
.spec .rule { width: 28px; height: 1px; background: var(--ink); margin: 22px auto 0; }
.spec .plate { font-family: "Jost", "Instrument Sans", sans-serif; font-weight: 400; font-size: 13px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink2); text-align: center; margin: 14px 0 0; padding-left: 0.28em; white-space: nowrap; }
.spec .plate em { font-style: normal; color: var(--accent); }
"""

DIRECTION_CSS = {
    'night': "",
    'split': """
.panel { position: absolute; top: 0; bottom: 0; left: %(panel_x)spx; right: 0; background: #0f1216; border-left: 1px solid #bfb9af; }
.spec .rule { background: #ece9e2; }
.spec .plate { color: #c3c7cd; }
.spec .plate em { color: #d4667b; }
""",
    'garnet': """
.eyebrow { color: var(--muted); }
.eyebrow b { color: var(--ink); }
.tags span { color: var(--ink); border-color: var(--line2); }
.spec .rule { background: var(--ink); }
.spec .plate { color: var(--muted); }
.spec .plate em { color: var(--ink); }
""",
}

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="%(fonts)s">
<style>
:root { --bg: %(bg)s; --ink: %(ink)s; --ink2: %(ink2)s; --muted: %(muted)s; --line: %(line)s; --line2: %(line2)s; --accent: %(accent)s; }
%(css)s
%(dcss)s
</style>
</head>
<body>
<div class="card">
  %(panel)s
  <div class="spec">
    <div class="art"></div>
    <div class="rule"></div>
    <p class="plate">Specimen <em>%(plate_n)s</em> · %(plate_t)s</p>
  </div>
  <div class="text">
    %(head)s
    <div class="mid">
      <h1 class="title" id="title">%(title)s</h1>
      <p class="line" id="line">%(line)s</p>
      %(tags)s
    </div>
    <p class="foot">%(host)s</p>
  </div>
</div>
</body>
</html>
"""

FIT_JS = """
(async () => {
  await document.fonts.ready;
  const t = document.getElementById('title');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lines = () => Math.round(t.getBoundingClientRect().height / (px * 1.0));
  const wide = () => t.scrollWidth > t.clientWidth + 1;
  while ((lines() > 2 || wide()) && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const l = document.getElementById('line');
  let lpx = parseFloat(getComputedStyle(l).fontSize);
  while (l.scrollHeight > l.clientHeight + 2 && lpx > 20) { lpx -= 1; l.style.fontSize = lpx + 'px'; }
  const text = document.querySelector('.text');
  const over = text.scrollHeight > text.clientHeight + 4 || wide() || l.scrollHeight > l.clientHeight + 2;
  const fam = (spec) => document.fonts.check(spec);
  return JSON.stringify({ px, lpx, lines: lines(), over, fonts: [fam('400 20px "Fraunces"'), fam('400 20px "Source Serif 4"'), fam('500 20px "Instrument Sans"'), fam('400 20px "Jost"')] });
})()
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def site_host():
    js = "process.stdout.write(require(%s).host)" % json.dumps(os.path.join(ROOT, 'build', 'site.js'))
    return subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout.strip()


def manifest():
    js = "process.stdout.write(JSON.stringify(require(%s).manifest()))" % json.dumps(os.path.join(ROOT, 'build', 'modules', 'social.js'))
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def chapter_specimens():
    out = {}
    cdir = os.path.join(ROOT, 'content')
    for f in sorted(os.listdir(cdir)):
        if not re.match(r'^\d\d-.*\.md$', f):
            continue
        m = re.match(r'^---json\s*\n([\s\S]*?)\n---', open(os.path.join(cdir, f)).read())
        if m:
            fm = json.loads(m.group(1))
            if fm.get('specimen'):
                out[fm['id']] = fm
    return out


def dump_cloud(name, folder):
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


def render_art(binpath, tilt, out, density, box, ink, acc1, acc2, zoom=0.92, ox=0.0, oy=0.0, S=2, alpha_range=(34, 170), acc_boost=1.35):
    """The cloud drawn as the page draws it: fine dots, ink for the body, the specimen's own colours on its accent channels.
    S = 2 supersamples so the dots come out under a pixel wide, the grain the site's canvas has."""
    import numpy as np
    from PIL import Image, ImageDraw
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
    is_acc2 = wo > 3.0
    is_acc = (wo >= 2.0) & ~is_acc2
    strength = np.where(is_acc2, np.clip(wo - 3.0, 0, 1), np.where(is_acc, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1)))
    amin, amax = alpha_range
    alpha = amin + (amax - amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_acc | is_acc2, np.clip(alpha * acc_boost, 0, 255), alpha)
    rad = (0.7 + 0.6 * zr) * S
    for x, y, r, a, c1, c2 in zip(uo, vo, rad, alpha, is_acc, is_acc2):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(acc2 if c2 else acc1 if c1 else ink) + (int(a),))
    if S > 1:
        img = img.resize(box, Image.LANCZOS)
    img.save(out, optimize=False)
    return len(data)


def shrink(path, colors=COLORS):
    from PIL import Image
    im = Image.open(path).convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return os.path.getsize(path)


# ---------- the three directions ----------

def layout(direction):
    """Text column and specimen box for each direction."""
    if direction == 'split':
        panel_x = 690
        return dict(tokens=LIGHT, text_left=64, col_w=560, line_w=520, panel_x=panel_x, art_x=panel_x + 36, art_y=54, art_w=W - panel_x - 72, art_h=430, title_px=92)
    tokens = DARK if direction == 'night' else GARNET
    return dict(tokens=tokens, text_left=72, col_w=560, line_w=520, panel_x=0, art_x=680, art_y=54, art_w=460, art_h=430, title_px=96)


def art_colors(direction, meta):
    """ink and the two accent channels, as 0..255 triplets."""
    c = meta.get('colors')
    if direction == 'garnet':
        ink = hexcol(GARNET['ink'])
        # one bright tone on the garnet ground: the specimen's dark-ground accent, both channels
        acc = tuple(c['accent']) if c else ink
        return ink, acc, acc, (24, 130), 2.1
    ink = hexcol(DARK['ink'])
    acc1 = tuple(c['accent']) if c else hexcol(DARK['accent'])
    acc2 = tuple(c['accent2']) if c else acc1
    return ink, acc1, acc2, (20, 120), 1.5


def head_html(p):
    if p['slug'] == 'home':
        return '<p class="wordmark">Chip Supply Chain<i>Every stage, and who controls it</i></p>'
    parts = p['eyebrow'].split(' · ')
    return '<p class="eyebrow">' + ' · '.join(['<b>%s</b>' % esc(parts[0])] + [esc(x) for x in parts[1:]]) + '</p>'


def tags_html(p, fm):
    if p['kind'] != 'chapter':
        return ''
    card = fm.get('card', {})
    tags = []
    if card.get('concentration'):
        tags.append('%s concentration' % card['concentration'])
    sub = card.get('substitutability')
    if isinstance(sub, dict):
        sub = sub.get('band')
    if sub:
        tags.append('%s to substitute' % sub)
    return '<div class="tags">' + ''.join('<span>%s</span>' % esc(t) for t in tags) + '</div>'


def texts(p, fm):
    if p['slug'] == 'home':
        return HOME['title'], HOME['line']
    one = fm.get('oneLiner', p['line'])
    # the lede: the first two sentences of the chapter's one-liner
    sents = re.split(r'(?<=\.)\s+', one)
    lede = sents[0]
    if len(sents) > 1:
        second = sents[1]
        if len(lede) + len(second) > 135 and ',' in second:
            second = second.split(',')[0].rstrip() + '.'  # the sentence to its first clause
        if len(lede) + len(second) <= 135:
            lede += ' ' + second
    return p['title'], lede


def main():
    pages = [p for p in manifest() if p['slug'] in only]
    host = site_host()
    chapters = chapter_specimens()
    tmp = tempfile.mkdtemp(prefix='cp-cards2-')
    profile = tempfile.mkdtemp(prefix='cp-cards2-profile-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             '--force-device-scale-factor=1', f'--remote-debugging-port={PORT}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
        for direction in directions:
            L = layout(direction)
            for p in pages:
                fm = chapters.get(p['slug'], {}) if p['kind'] == 'chapter' else {}
                name = fm.get('specimen') if fm else VIEW_SPECIMEN.get(p['slug'], 'die-floorplan')
                binpath, meta = dump_cloud(name, tmp)
                ink, a1, a2, arange, boost = art_colors(direction, meta)
                frame = FRAME.get(name, {})
                density = DENSITY
                stem = '%s-%s' % (direction, p['slug'])
                out = os.path.join(OUT, stem + '.png')
                title, line = texts(p, fm)
                plate_n, plate_t = PLATE.get(name, ('', name))
                for attempt in range(4):
                    art = os.path.join(tmp, '%s-%s.png' % (stem, attempt))
                    drawn = render_art(binpath, meta['tilt'], art, density, (L['art_w'], L['art_h']), ink, a1, a2,
                                       zoom=frame.get('zoom', 0.92), ox=frame.get('ox', 0.0), oy=frame.get('oy', 0.0), alpha_range=arange, acc_boost=boost)
                    fill = dict(L['tokens'], fonts=FONTS, art='file://' + art, text_left=L['text_left'], col_w=L['col_w'], line_w=L['line_w'],
                                art_x=L['art_x'], art_y=L['art_y'], art_w=L['art_w'], art_h=L['art_h'], title_px=L['title_px'], panel_x=L['panel_x'])
                    fill['css'] = CSS % fill
                    fill['dcss'] = DIRECTION_CSS[direction] % fill
                    fill.update(panel='<div class="panel"></div>' if direction == 'split' else '', head=head_html(p), title=esc(title), line=esc(line),
                                tags=tags_html(p, fm), host=host, plate_n=plate_n, plate_t=esc(plate_t))
                    html = TEMPLATE % fill
                    src = os.path.join(tmp, stem + '.html')
                    open(src, 'w').write(html)
                    send('Page.navigate', {'url': 'file://' + src})
                    ready = "document.readyState === 'complete' && location.href.endsWith(%s) && !!document.getElementById('title')" % json.dumps('/' + stem + '.html')
                    for _ in range(100):
                        if send('Runtime.evaluate', {'expression': ready, 'returnByValue': True}).get('result', {}).get('value') is True:
                            break
                        time.sleep(0.1)
                    else:
                        sys.exit('page did not load for %s' % stem)
                    time.sleep(2.5 if first else 0.4)
                    first = False
                    r = send('Runtime.evaluate', {'expression': FIT_JS, 'awaitPromise': True, 'returnByValue': True})
                    val = r.get('result', {}).get('value')
                    if not isinstance(val, str):
                        sys.exit('fit script failed for %s: %s' % (stem, json.dumps(r.get('exceptionDetails') or r)[:400]))
                    fit = json.loads(val)
                    time.sleep(0.3)
                    shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
                    open(out, 'wb').write(base64.b64decode(shot['data']))
                    size = shrink(out)
                    if size <= LIMIT:
                        break
                    density *= 0.72
                note = ' (%d of %d points)' % (drawn, meta['points'])
                if size > LIMIT:
                    note += ' OVER 150 KB'
                if fit.get('over'):
                    note += ' OVERFLOW'
                if not all(fit.get('fonts', [])):
                    note += ' FONTS MISSING %s' % fit.get('fonts')
                print('%-28s %4d KB  %-14s title %3spx, %s line(s), line %2spx%s' % (stem + '.png', size // 1024, name, fit.get('px'), fit.get('lines'), fit.get('lpx'), note))
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


if __name__ == '__main__':
    main()
