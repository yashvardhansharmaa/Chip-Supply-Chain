#!/usr/bin/env python3
"""Social-card mocks, designer key "light": three directions (plate, ledger, title) on the site's warm white,
for the home card and the Lithography card. Adapted from build/cards.py; renders through headless Chrome on
DevTools port 9421 and writes into this folder. usage: python3 qa/cards-redesign-2/light/cards.py [--keep]

The specimen cloud is dumped by the sibling cards-art.js (light-ground colours) and drawn with Pillow in the
site's ink over a transparent box, accent points in the specimen's own colours, at the tilt the site opens it at.
"""
import base64, json, math, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
from string import Template
import websocket  # websocket-client

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = HERE
ART_JS = os.path.join(HERE, 'cards-art.js')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9421
W, H = 1200, 630
LIMIT = 150 * 1024
COLORS = 256
keep = '--keep' in sys.argv
only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None

# light tokens, qa/brand-build.md
T = dict(bg='#f7f6f2', bg2='#f1efea', ink='#14181f', ink2='#3b424c', muted='#5c636d', line='#d8d4cc', line2='#bfb9af', accent='#7a1f2b')
HOST = 'chipsupplychain.org'
SUBWORD = {'Very hard': 'Very hard to substitute', 'Hard': 'Hard to substitute', 'Moderate': 'Moderately hard to substitute', 'Easy': 'Easy to substitute'}
BANDS = {'Extreme': 4, 'High': 3, 'Moderate': 2, 'Low': 1}
BAR_W = {4: 100, 3: 66, 2: 38, 1: 16, 0: 16}


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def chapters():
    out = []
    cdir = os.path.join(ROOT, 'content')
    for f in sorted(os.listdir(cdir)):
        if not re.match(r'^\d\d-.*\.md$', f):
            continue
        m = re.match(r'^---json\s*\n([\s\S]*?)\n---', open(os.path.join(cdir, f)).read())
        if m:
            out.append(json.loads(m.group(1)))
    return out


CH = chapters()
STAGES = [c for c in CH if (c.get('card') or {}).get('concentration')][:15]
LITHO = next(c for c in CH if c['id'] == 'lithography')
NEXT = next(c for c in STAGES if c['number'] == LITHO['number'] + 1)

PAGES = {
    'home': dict(kind='view', slug='home', title='How AI chips are made', title_br='How AI chips<br>are made', lede='An introduction to the entire semiconductor supply chain.',
                 specimen='die-floorplan', spec_no='01', spec_name='Chip Design, EDA and IP', eyebrow='The AI chip supply chain'),
    'lithography': dict(kind='chapter', slug='lithography', number=LITHO['number'], title=LITHO['title'], lede=' '.join(re.split(r'(?<=\.) ', LITHO['oneLiner'])[:2]),  # the first two sentences of the chapter's lede
                        specimen=LITHO['specimen'], spec_no='%02d' % LITHO['number'], spec_name=LITHO['title'],
                        tags=[LITHO['card']['concentration'] + ' concentration', SUBWORD[LITHO['card']['substitutability']['band']]],
                        stage=LITHO['number'], next_title=NEXT['title'], next_no='%02d' % NEXT['number'],
                        eyebrow='Chapter %02d · Stage %d of 15' % (LITHO['number'], LITHO['number'])),
}

HEAD = Template("""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Instrument+Sans:wght@400;500;600&family=Jost:wght@400&display=block">
<style>
:root { --bg: $bg; --bg-2: $bg2; --ink: $ink; --ink-2: $ink2; --muted: $muted; --line: $line; --line-2: $line2; --accent: $accent;
  --display: "Fraunces", Georgia, serif; --body: "Source Serif 4", Georgia, serif; --label: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; --caption: "Jost", "Instrument Sans", sans-serif; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: var(--label); -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
.art { position: absolute; background-repeat: no-repeat; background-size: 100% 100%; }
.label { font-family: var(--label); font-weight: 500; font-size: 17px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); line-height: 1.3; margin: 0; white-space: nowrap; }
.label b { font-weight: 600; color: var(--ink-2); }
.label i { font-style: normal; display: inline-block; width: 1px; height: 0.9em; background: var(--line-2); margin: 0 14px -2px; }
.wordmark { font-family: var(--display); font-weight: 500; font-size: 26px; letter-spacing: 0.075em; font-variant-caps: small-caps; font-variation-settings: "opsz" 36, "SOFT" 0, "WONK" 0; color: var(--ink); margin: 0; line-height: 1; white-space: nowrap; }
.wordmark span { font-family: var(--body); font-style: italic; font-variant-caps: normal; font-size: 18px; letter-spacing: 0; color: var(--muted); margin-left: 16px; font-weight: 400; }
.title { font-family: var(--display); font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; line-height: 1.0; letter-spacing: -0.015em; margin: 0; color: var(--ink); overflow-wrap: normal; }
.lede { flex: none; font-family: var(--body); font-weight: 400; font-variation-settings: "opsz" 24; line-height: 1.32; color: var(--ink-2); margin: 0; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.tags { display: flex; gap: 10px; margin: 0; padding: 0; list-style: none; }
.tags li { font-family: var(--label); font-weight: 500; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1.2; padding: 7px 11px; border: 1px solid var(--accent); color: var(--accent); white-space: nowrap; }
.host { font-family: var(--label); font-weight: 500; font-size: 18px; letter-spacing: 0.04em; color: var(--muted); margin: 0; white-space: nowrap; }
.plate-line { position: absolute; text-align: center; font-family: var(--caption); font-weight: 400; font-size: 14.5px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-2); padding-top: 16px; margin: 0; white-space: nowrap; }
.plate-line::before { content: ""; position: absolute; top: 0; left: 50%; width: 28px; height: 1px; margin-left: -14px; background: var(--ink); }
.plate-line b { color: var(--accent); font-weight: 400; }
$css
</style></head><body><div class="card">$body</div></body></html>
""")

# ---------- direction 1: Plate ----------
PLATE = dict(css="""
.art { right: 36px; top: 30px; width: 600px; height: 500px; }
.plate-line { right: 36px; width: 600px; top: 536px; }
.text { position: absolute; left: 72px; top: 60px; bottom: 56px; width: 500px; display: flex; flex-direction: column; }
.mid { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 8px 0 24px; }
.title { font-size: 116px; }
.tags { margin-top: 30px; }
.lede { font-size: 25px; margin-top: 28px; -webkit-line-clamp: 5; max-width: 500px; }
.tags + .lede { margin-top: 26px; }
.foot { display: flex; justify-content: space-between; align-items: baseline; }
""", body="""
<div class="art" style="background-image:url($art)"></div>
<p class="plate-line">Specimen <b>$spec_no</b> · $spec_name</p>
<div class="text">
  $head
  <div class="mid">
    <h1 class="title" id="title">$title</h1>
    $tags
    <p class="lede" id="lede">$lede</p>
  </div>
  <div class="foot"><p class="host">$host</p></div>
</div>
""")

# ---------- direction 2: Ledger ----------
LEDGER = dict(css="""
.mast { position: absolute; left: 64px; right: 64px; top: 40px; height: 44px; border-bottom: 1px solid var(--line-2); display: flex; align-items: baseline; justify-content: space-between; }
.ledger { position: absolute; left: 64px; top: 108px; width: 104px; text-align: right; }
.ledger .k { display: block; font-family: var(--label); font-weight: 500; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.ledger .v { display: block; font-family: var(--display); font-weight: 300; font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; font-size: 92px; line-height: 0.95; letter-spacing: -0.03em; font-variant-numeric: tabular-nums lining-nums; color: var(--ink); margin: 8px 0 6px; }
.ledger .of { display: block; font-family: var(--label); font-weight: 500; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.idx { list-style: none; margin: 22px 0 0; padding: 0; border-top: 1px solid var(--ink); }
.idx li { position: relative; display: flex; align-items: center; gap: 8px; height: 16px; border-bottom: 1px solid var(--line); }
.idx li .n { width: 18px; font-family: var(--label); font-size: 11px; letter-spacing: 0; color: var(--muted); text-align: left; font-variant-numeric: tabular-nums; }
.idx li .bar { flex: 1 1 auto; height: 6px; display: flex; }
.idx li .bar i { display: block; height: 100%; background: var(--line-2); }
.idx li[data-band="4"] .bar i { background: var(--accent); }
.idx li[data-band="3"] .bar i { background: var(--ink-2); }
.idx li.cur .n { color: var(--accent); font-weight: 600; }
.idx li.cur::after { content: ""; position: absolute; left: -16px; top: 3px; bottom: 3px; width: 2px; background: var(--accent); }
.foot-note { margin: 10px 0 0; text-align: left; font-family: var(--label); font-weight: 500; font-size: 10.5px; line-height: 1.5; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); }
.foot-note b { color: var(--accent); font-weight: 600; }
.foot-note span { display: block; color: var(--muted); margin-top: 4px; }
.text { position: absolute; left: 200px; top: 108px; width: 532px; bottom: 56px; display: flex; flex-direction: column; }
.title { font-size: 96px; font-variation-settings: "opsz" 96, "SOFT" 0, "WONK" 0; letter-spacing: -0.012em; }
.lede { font-size: 26px; margin-top: 22px; -webkit-line-clamp: 5; }
.meta { margin-top: 26px; }
.meta .label { font-size: 13px; }
.text .host { margin-top: auto; }
.art { right: 44px; top: 110px; width: 420px; height: 380px; }
.plate-line { right: 44px; width: 420px; top: 500px; font-size: 13px; }
""", body="""
<div class="mast"><p class="wordmark">Chip Supply Chain<span>Every stage, and who controls it</span></p><p class="label" style="font-size:13px">$mast_right</p></div>
<aside class="ledger">
  <span class="k">$led_k</span><span class="v">$led_v</span><span class="of">$led_of</span>
  <ol class="idx">$rows</ol>
  $note
</aside>
<div class="text">
  <h1 class="title" id="title">$title</h1>
  <p class="lede" id="lede">$lede</p>
  <p class="meta label">$meta</p>
  <p class="host">$host</p>
</div>
<div class="art" style="background-image:url($art)"></div>
<p class="plate-line">Specimen <b>$spec_no</b> · $spec_name</p>
""")

# ---------- direction 3: Title ----------
TITLE = dict(css="""
.top { position: absolute; left: 72px; right: 72px; top: 52px; display: flex; justify-content: space-between; align-items: baseline; }
.text { position: absolute; left: 72px; right: 72px; top: 118px; bottom: 56px; display: flex; flex-direction: column; }
.title { font-weight: 300; font-size: 190px; letter-spacing: -0.02em; line-height: 0.96; }
.hair { width: calc(100% - 300px); height: 1px; background: var(--accent); margin: 30px 0 26px; flex: 0 0 auto; }
.lede { font-size: 30px; -webkit-line-clamp: 4; max-width: 840px; margin-bottom: 28px; }
.foot { margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; }
.art { right: 88px; bottom: 82px; width: 230px; height: 230px; }
.mark { position: absolute; right: 88px; width: 230px; bottom: 52px; text-align: center; font-family: var(--caption); font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--muted); margin: 0; white-space: nowrap; }
.mark b { color: var(--accent); font-weight: 400; }
""", body="""
<div class="top">$top_left<p class="label" style="font-size:14px">$top_right</p></div>
<div class="text">
  <h1 class="title" id="title">$title</h1>
  <div class="hair"></div>
  <p class="lede" id="lede">$lede</p>
  <div class="foot"><p class="host">$host</p></div>
</div>
<div class="art" style="background-image:url($art)"></div>
<p class="mark">Specimen <b>$spec_no</b></p>
""")

DIRECTIONS = dict(plate=PLATE, ledger=LEDGER, title=TITLE)
# art box per direction (w, h) and the drawing scale for the dots
ART_BOX = dict(plate=(600, 500), ledger=(420, 380), title=(230, 230))
ART_DOT = dict(plate=1.0, ledger=0.85, title=0.55)
ART_DENSITY = dict(plate=0.8, ledger=0.7, title=0.45)
FRAME = {'euv-scanner': dict(zoom=0.94), 'die-floorplan': dict(zoom=0.92)}

FIT_JS = """
(async () => {
  await document.fonts.ready;
  const t = document.getElementById('title');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lh = parseFloat(getComputedStyle(t).lineHeight) / px;
  const lines = () => Math.round(t.getBoundingClientRect().height / (px * lh));
  const wide = () => t.scrollWidth > t.clientWidth + 1;
  const max = %(maxlines)d;
  while ((lines() > max || wide()) && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const box = document.querySelector('.text');
  while (box.scrollHeight > box.clientHeight + 2 && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const l = document.getElementById('lede');
  let lpx = parseFloat(getComputedStyle(l).fontSize);
  while (l.scrollHeight > l.clientHeight + 2 && lpx > 20) { lpx -= 1; l.style.fontSize = lpx + 'px'; }
  const text = document.querySelector('.text');
  const over = text.scrollHeight > text.clientHeight + 4 || wide() || l.scrollHeight > l.clientHeight + 2;
  const fam = (spec) => document.fonts.check(spec);
  return JSON.stringify({ px, lpx, lines: lines(), over, fonts: [fam('300 20px "Fraunces"'), fam('400 20px "Source Serif 4"'), fam('500 20px "Instrument Sans"'), fam('400 20px "Jost"')] });
})()
"""


def rows_html(current):
    out = []
    for c in STAGES:
        band = BANDS.get(c['card']['concentration'], 0)
        out.append('<li data-band="%d"%s><span class="n">%02d</span><span class="bar"><i style="width:%d%%"></i></span></li>'
                   % (band, ' class="cur"' if c['number'] == current else '', c['number'], BAR_W[band]))
    return ''.join(out)


def fill(direction, p, art):
    d = DIRECTIONS[direction]
    v = dict(art='file://' + art, title=esc(p['title']), lede=esc(p['lede']), host=HOST, spec_no=p['spec_no'], spec_name=esc(p['spec_name']))
    chapter = p['kind'] == 'chapter'
    if direction == 'plate':
        v['head'] = ('<p class="label"><b>Chip Supply Chain</b><i></i>%s</p>' % esc(p['eyebrow'])) if chapter else \
            '<p class="wordmark">Chip Supply Chain</p>'
        v['tags'] = ('<ul class="tags">%s</ul>' % ''.join('<li>%s</li>' % esc(t) for t in p['tags'])) if chapter else ''
    elif direction == 'ledger':
        if chapter:
            v.update(led_k='Chapter', led_v='%02d' % p['number'], led_of='Stage %d of 15' % p['stage'], rows=rows_html(p['stage']),
                     mast_right='The Chain', meta='<i></i>'.join(esc(t) for t in p['tags']),
                     note='<p class="foot-note"><b>%s</b>, stage %d of 15<span>Next: %s %s</span></p>' % (esc(p['title']), p['stage'], p['next_no'], esc(p['next_title'])))
        else:
            v.update(led_k='The Chain', led_v='15', led_of='Stages', rows=rows_html(0), mast_right='Home',
                     meta='17 chapters<i></i>220 suppliers<i></i>35 AI chips', note='<p class="foot-note"><b>Concentration</b> by stage<span>Extreme in garnet, High in ink</span></p>')
    else:
        if p.get('title_br'):
            v['title'] = p['title_br']  # the site's own hero break
        v['top_left'] = ('<p class="label"><b>Chip Supply Chain</b><i></i>%s</p>' % esc(p['eyebrow'])) if chapter else '<p class="wordmark">Chip Supply Chain</p>'
        v['top_right'] = ' · '.join(p['tags']).upper() if chapter else 'The AI chip supply chain'
    return HEAD.substitute(T, css=d['css'], body=Template(d['body']).substitute(v))


# ---------- the art ----------

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


def col(c):
    return hexcol(c) if isinstance(c, str) else tuple(int(x) for x in c)


def rot(rx, ry, rz):
    import numpy as np
    cx, sx = math.cos(rx), math.sin(rx)
    cy, sy = math.cos(ry), math.sin(ry)
    cz, sz = math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def render_art(binpath, tilt, out, density, box, zoom=0.92, dot=1.0, colors=None):
    """Ink points on a transparent box, accent points in the specimen's light-ground colours, far to near."""
    import numpy as np
    from PIL import Image, ImageDraw
    inkc = hexcol(T['ink'])
    acc1 = col(colors['accent']) if colors else hexcol(T['accent'])
    acc2 = col(colors['accent2']) if colors else acc1
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
    Wpx, Hpx = box
    scale = zoom * min(Wpx / du, Hpx / dv)
    u = (u - (u.min() + u.max()) / 2) * scale + Wpx / 2
    v = (v - (v.min() + v.max()) / 2) * scale + Hpx / 2
    img = Image.new('RGBA', (Wpx, Hpx), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    order = np.argsort(z)
    uo, vo, wo, zo = u[order], v[order], w[order], z[order]
    zr = (zo - zo.min()) / max(1e-6, zo.max() - zo.min())
    is_acc2 = wo > 3.0
    is_acc = (wo >= 2.0) & ~is_acc2
    strength = np.where(is_acc2, np.clip(wo - 3.0, 0, 1), np.where(is_acc, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1)))
    amin, amax = 28, 140  # ink on the warm white: a touch stronger than the pale ink on the dark ground
    alpha = amin + (amax - amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_acc | is_acc2, np.clip(alpha * 1.4, 0, 255), alpha)
    rad = (1.2 + 0.8 * zr) * dot
    for x, y, r, a, c1, c2 in zip(uo, vo, rad, alpha, is_acc, is_acc2):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(acc2 if c2 else acc1 if c1 else inkc) + (int(a),))
    img.save(out, optimize=False)
    return len(data)


def shrink(path, colors=COLORS):
    from PIL import Image
    im = Image.open(path).convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return os.path.getsize(path)


def main():
    jobs = [(d, s) for d in ('plate', 'ledger', 'title') for s in ('home', 'lithography')]
    if only:
        jobs = [j for j in jobs if '%s-%s' % j in only or j[0] in only]
    tmp = tempfile.mkdtemp(prefix='cp-light-')
    profile = tempfile.mkdtemp(prefix='cp-light-profile-')
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
        for direction, slug in jobs:
            p = PAGES[slug]
            name = p['specimen']
            binpath, meta = dump_cloud(name, tmp)
            density = ART_DENSITY[direction]
            key = '%s-%s' % (direction, slug)
            out = os.path.join(OUT, key + '.png')
            for attempt in range(4):
                art = os.path.join(tmp, '%s-%d.png' % (key, attempt))
                drawn = render_art(binpath, meta['tilt'], art, density, ART_BOX[direction], zoom=FRAME.get(name, {}).get('zoom', 0.92),
                                   dot=ART_DOT[direction], colors=meta.get('colors'))
                src = os.path.join(tmp, key + '.html')
                open(src, 'w').write(fill(direction, p, art))
                send('Page.navigate', {'url': 'file://' + src})
                ready = "document.readyState === 'complete' && location.href.endsWith(%s) && !!document.getElementById('title')" % json.dumps('/' + key + '.html')
                for _ in range(100):
                    if send('Runtime.evaluate', {'expression': ready, 'returnByValue': True}).get('result', {}).get('value') is True:
                        break
                    time.sleep(0.1)
                else:
                    sys.exit('page did not load for %s' % key)
                time.sleep(2.5 if first else 0.3)
                first = False
                r = send('Runtime.evaluate', {'expression': FIT_JS % dict(maxlines=2), 'awaitPromise': True, 'returnByValue': True})
                val = r.get('result', {}).get('value')
                if not isinstance(val, str):
                    sys.exit('fit script failed for %s: %s' % (key, json.dumps(r.get('exceptionDetails') or r)[:400]))
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
            if not all(fit['fonts']):
                note += ' FONTS MISSING %s' % fit['fonts']
            print('%-24s %4d KB  title %3spx, %s line(s), lede %2spx%s' % (key + '.png', size // 1024, fit['px'], fit['lines'], fit['lpx'], note))
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
