#!/usr/bin/env python3
"""Render the social cards (1200 x 630 PNG, one per chapter and per view) with headless Chrome.

usage: python3 build/cards.py [--only <slug>[,<slug>]] [--keep]

Run by hand, like build/pdf.py, not on every build. The list of pages (slug, eyebrow, title, line, lede, tags) is
build/modules/social.js's manifest(), read through node so the card and the unfurl page never disagree.
Output: build/assets/cards/<slug>.png; `node build/build.js` copies the folder to dist/cards/.

The card is the "Plate" direction from qa/cards-redesign-2/light: the page itself at card size. The site's light
tokens (qa/brand-build.md: warm white ground, blue-black ink, garnet as the only accent), no gradient and no
vignette. At the right, large on the bare ground, the chapter's own specimen: the point cloud the page shows,
dumped from src/kit.js by build/cards-art.js and drawn here with Pillow in ink with its accent points in the
colors the specimen declares for the light ground (qa/specimen-colors.md), at the tilt the site opens it at, over
the centered 28 px rule and the tracked plate line ("SPECIMEN 04 · LITHOGRAPHY", Jost, the number in garnet). The
left column is the chapter head reduced to its essentials: the eyebrow ("CHIP SUPPLY CHAIN | CHAPTER 04 · STAGE 4
OF 15", Instrument Sans), the title in Fraunces at 116 px (opsz 144, SOFT and WONK at 0), the two ratings as
garnet-ruled tags in the site's .ptag style, and the lede in Source Serif 4: the first two sentences of the
chapter's oneLiner, the second cut to its first clause when it runs long. A view swaps the eyebrow for the
wordmark in small caps with the italic tagline, carries no tags, and shows its dek; the home card is the site's
hero, "How AI chips are made", over the GPU die. A chapter names its specimen in its front matter; a view takes
one from VIEW_SPECIMEN below. The foot carries the domain.

The fit script shrinks the title while it runs past two lines, then while the whole text column overflows, so the
title never reaches the art; the lede is shrunk until five lines hold it. Every PNG is quantized to a palette and
must come in under 150 KB; if it does not, the cloud is thinned and the card drawn again. No em dashes anywhere.
"""
import base64, json, math, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'cards')
ART_JS = os.path.join(ROOT, 'build', 'cards-art.js')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9334
W, H = 1200, 630
ART_BOX = (600, 500)        # the art box, at right: 36px; top: 30px, with the plate line beneath it
COL_W = 500                 # the text column, from x = 72
LIMIT = 150 * 1024
DENSITY = 0.8               # share of each cloud's points drawn; thinned further when a PNG is over the limit
COLORS = 256
SUPERSAMPLE = 1             # 1 keeps the dots crisp, as on the page, and halves the PNG against 2
TITLE_PX = 116
LEDE_PX = 25
LEDE_LINES = 5
LONG_SENTENCE = 120         # a second sentence past this is cut to its first clause

args = sys.argv[1:]
only = args[args.index('--only') + 1].split(',') if '--only' in args else None
keep = '--keep' in args  # keep the temporary HTML and art files for inspection

# the light sheet, qa/brand-build.md (:root in src/styles.css)
# (the two rule colors are named rule_line and rule_line2 so they never collide with the card's `line` text in the template dict)
LIGHT = dict(bg='#f7f6f2', ink='#14181f', ink2='#3b424c', muted='#5c636d', rule_line='#d8d4cc', rule_line2='#bfb9af', accent='#7a1f2b')
SITE = 'Chip Supply Chain'
TAGLINE = 'Every stage, and who controls it'  # the wordmark's tagline, src/template.html

# the specimen a view shows; chapters name theirs in content/*.md front matter
VIEW_SPECIMEN = {'home': 'die-floorplan', 'intro': 'boule-and-wafer', 'chain': 'cowos-exploded', 'chips': 'package',
                 'suppliers': 'globe', 'export-controls': 'globe', 'glossary': 'wafer'}

# the plate line of a view names the specimen; a chapter's names the chapter. The kit's captions run to a paragraph.
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
         'euv-scanner': dict(zoom=0.94), 'die-floorplan': dict(zoom=0.92)}

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Instrument+Sans:wght@400;500;600&family=Jost:wght@400&display=block">
<style>
:root { --bg: %(bg)s; --ink: %(ink)s; --ink-2: %(ink2)s; --muted: %(muted)s; --line: %(rule_line)s; --line-2: %(rule_line2)s; --accent: %(accent)s;
  --display: "Fraunces", Georgia, serif; --body: "Source Serif 4", Georgia, serif; --label: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; --caption: "Jost", "Instrument Sans", sans-serif; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: var(--label); -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
.art { position: absolute; right: 36px; top: 30px; width: %(art_w)spx; height: %(art_h)spx; background: url(%(art)s) 0 0 / %(art_w)spx %(art_h)spx no-repeat; }
.plate-line { position: absolute; right: 36px; width: %(art_w)spx; top: 536px; text-align: center; font-family: var(--caption); font-weight: 400; font-size: 14.5px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-2); padding-top: 16px; margin: 0; white-space: nowrap; }
.plate-line::before { content: ""; position: absolute; top: 0; left: 50%%; width: 28px; height: 1px; margin-left: -14px; background: var(--ink); }
.plate-line b { color: var(--accent); font-weight: 400; }
.text { position: absolute; left: 72px; top: 60px; bottom: 56px; width: %(col_w)spx; display: flex; flex-direction: column; }
.label { flex: none; font-family: var(--label); font-weight: 500; font-size: 17px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); line-height: 1.3; margin: 0; white-space: nowrap; }
.label b { font-weight: 600; color: var(--ink-2); }
.label i { font-style: normal; display: inline-block; width: 1px; height: 0.9em; background: var(--line-2); margin: 0 14px -2px; }
.wordmark { flex: none; font-family: var(--display); font-weight: 500; font-size: 26px; letter-spacing: 0.075em; font-variant-caps: small-caps; font-variation-settings: "opsz" 36, "SOFT" 0, "WONK" 0; color: var(--ink); margin: 0; line-height: 1; white-space: nowrap; }
.wordmark span { font-family: var(--body); font-style: italic; font-variant-caps: normal; font-size: 18px; letter-spacing: 0; color: var(--muted); margin-left: 16px; font-weight: 400; }
.mid { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 8px 0 24px; }
.title { font-family: var(--display); font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; font-size: %(title_px)spx; line-height: 1.0; letter-spacing: -0.015em; margin: 0; color: var(--ink); overflow-wrap: normal; }
.tags { display: flex; flex: none; gap: 10px; margin: 30px 0 0; padding: 0; list-style: none; }
.tags li { font-family: var(--label); font-weight: 500; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1.2; padding: 7px 11px; border: 1px solid var(--accent); color: var(--accent); white-space: nowrap; }
.line { flex: none; font-family: var(--body); font-weight: 400; font-variation-settings: "opsz" 24; font-size: %(lede_px)spx; line-height: 1.32; color: var(--ink-2); margin: 28px 0 0; max-width: %(col_w)spx; display: -webkit-box; -webkit-line-clamp: %(lede_lines)s; -webkit-box-orient: vertical; overflow: hidden; }
.tags + .line { margin-top: 26px; }
.foot { flex: none; font-family: var(--label); font-weight: 500; font-size: 18px; line-height: 1; letter-spacing: 0.04em; color: var(--muted); margin: 0; white-space: nowrap; }
</style>
</head>
<body>
<div class="card">
  <div class="art"></div>
  <p class="plate-line">%(plate)s</p>
  <div class="text">
    %(head)s
    <div class="mid">
      <h1 class="title" id="title">%(title)s</h1>
      %(tags)s
      <p class="line" id="line">%(line)s</p>
    </div>
    <p class="foot">%(host)s</p>
  </div>
</div>
</body>
</html>
"""

# shrink the title until it sits on at most two lines inside the text column, then further while the whole column overflows
# (the lede is flex: none, so a squeezed column shows as overflow instead of a silently clipped lede); then shrink the lede
# until its clamp holds the whole text, and report whether anything still overflows and whether each face loaded
FIT_JS = """
(async () => {
  await document.fonts.ready;
  // fonts.ready can resolve before a face the page uses has been requested; ask for each face the template uses
  const specs = ['400 20px "Fraunces"', '500 20px "Fraunces"', '400 20px "Source Serif 4"', 'italic 400 20px "Source Serif 4"', '500 20px "Instrument Sans"', '600 20px "Instrument Sans"', '400 20px "Jost"'];
  for (const s of specs) { try { await document.fonts.load(s); } catch (e) {} }
  await document.fonts.ready;
  const t = document.getElementById('title');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lh = parseFloat(getComputedStyle(t).lineHeight) / px;
  const lines = () => Math.round(t.getBoundingClientRect().height / (px * lh));
  const wide = () => t.scrollWidth > t.clientWidth + 1;
  while ((lines() > 2 || wide()) && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const text = document.querySelector('.text');
  const overflow = () => text.scrollHeight > text.clientHeight + 2;
  while (overflow() && px > 56) { px -= 2; t.style.fontSize = px + 'px'; }
  const l = document.getElementById('line');
  let lpx = parseFloat(getComputedStyle(l).fontSize);
  while (l.scrollHeight > l.clientHeight + 2 && lpx > 20) { lpx -= 1; l.style.fontSize = lpx + 'px'; }
  const over = overflow() || wide() || l.scrollHeight > l.clientHeight + 2;
  const fam = (spec) => document.fonts.check(spec);  // check the weights the template uses; a weight not in the sheet reads as false
  const faces = [...document.fonts].map((f) => f.family.replace(/"/g, '') + ' ' + f.style + ' ' + f.weight + ' ' + f.status);
  return JSON.stringify({ px, lpx, lines: lines(), over, fonts: [fam('400 20px "Fraunces"'), fam('400 20px "Source Serif 4"'), fam('500 20px "Instrument Sans"'), fam('400 20px "Jost"')], faces });
})()
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def lede(text):
    """The first two sentences of a chapter's lede; a long second sentence is cut to its first clause."""
    ss = [s.strip() for s in re.split(r'(?<=[.!?]) ', str(text or '').replace('\n', ' ')) if s.strip()][:2]
    if len(ss) == 2 and len(ss[1]) > LONG_SENTENCE:
        m = re.match(r'(.{30,}?)[,;:] ', ss[1])
        if m:
            ss[1] = m.group(1).rstrip() + '.'
    return ' '.join(ss)


def head_html(p):
    """A chapter's eyebrow, "Chip Supply Chain | Chapter 04 · Stage 4 of 15" with a hairline tick; a view's wordmark and tagline."""
    if p['kind'] == 'chapter':
        parts = p['eyebrow'].split(' · ')
        return '<p class="label"><b>%s</b><i></i>%s</p>' % (esc(parts[0]), esc(' · '.join(parts[1:])))
    return '<p class="wordmark">%s<span>%s</span></p>' % (esc(SITE), esc(TAGLINE))


def tags_html(p):
    tags = p.get('tags') or []
    return ('<ul class="tags">%s</ul>' % ''.join('<li>%s</li>' % esc(t) for t in tags)) if tags else ''


def plate_html(p, name, specimen_no):
    """"Specimen 04 · Lithography" for a chapter; for a view, the specimen's number (when a chapter owns it) and its label."""
    no = ('%02d' % p['number']) if p['kind'] == 'chapter' else specimen_no.get(name)
    text = p['title'] if p['kind'] == 'chapter' else LABEL.get(name, name)
    return ('Specimen <b>%s</b> · %s' % (no, esc(text))) if no else esc(text)


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


def render_art(binpath, tilt, out, density, box=ART_BOX, zoom=0.92, ox=0.0, oy=0.0, S=SUPERSAMPLE, dot=1.0, colors=None):
    """Draw the cloud into a transparent box: ink points, accent points (w in [2,3]) and second-accent points (w in (3,4])
    in the specimen's own light-ground colors (`colors` = {accent, accent2} as 0..255 triplets from cards-art.js, else the
    card's garnet for both), far to near, the way qa/cover/render.py does it. density is the share of points kept (a fixed
    subsample, so a re-render is repeatable). S is the supersample; 1 keeps the dots crisp, as on the page. The alpha runs
    28 to 140 so the cloud reads as the page's gray stipple on the warm white, with accent points at 1.4 times."""
    import numpy as np
    from PIL import Image, ImageDraw
    inkc = hexcol(LIGHT['ink'])
    acc1 = col(colors['accent']) if colors else hexcol(LIGHT['accent'])
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
    amin, amax = 28, 140
    alpha = amin + (amax - amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_acc | is_acc2, np.clip(alpha * 1.4, 0, 255), alpha)
    rad = (1.2 + 0.8 * zr) * S * dot
    for x, y, r, a, c1, c2 in zip(uo, vo, rad, alpha, is_acc, is_acc2):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(acc2 if c2 else acc1 if c1 else inkc) + (int(a),))
    if S > 1:
        img = img.resize(box, Image.LANCZOS)
    img.save(out, optimize=False)
    return len(data)


def shrink(path, colors=COLORS):
    """Quantize a PNG to a palette with Pillow; the cloud is a two- or three-color drawing over a flat ground."""
    from PIL import Image
    im = Image.open(path).convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return os.path.getsize(path)


def main():
    pages = manifest()
    host = site_host()
    chapters = chapter_specimens()
    specimen_no = {name: '%02d' % p['number'] for p in pages if p['kind'] == 'chapter' for name in [chapters.get(p['slug'])] if name}
    pages = [p for p in pages if p['slug'] != 'home']  # the home card is centered for LinkedIn's crops; build/home_card.py draws it
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
            font_tries = 0
            name = specimen_for(p, chapters)
            binpath, meta = dump_cloud(name, tmp)
            frame = FRAME.get(name, {})
            density = DENSITY
            out = os.path.join(OUT, p['slug'] + '.png')
            text = lede(p['lede']) if p['kind'] == 'chapter' else p['line']
            for attempt in range(6):
                art = os.path.join(tmp, '%s-%s.png' % (p['slug'], attempt))
                drawn = render_art(binpath, meta['tilt'], art, density, zoom=frame.get('zoom', 0.92), ox=frame.get('ox', 0.0), oy=frame.get('oy', 0.0),
                                   colors=meta.get('colors'))
                html = TEMPLATE % dict(LIGHT, art_w=ART_BOX[0], art_h=ART_BOX[1], col_w=COL_W, art='file://' + art, head=head_html(p), tags=tags_html(p),
                                       plate=plate_html(p, name, specimen_no), title=esc(p['title']), line=esc(text), title_px=TITLE_PX,
                                       lede_px=LEDE_PX, lede_lines=LEDE_LINES, host=host)
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
                time.sleep(2.5 if first else 0.3)
                first = False
                r = send('Runtime.evaluate', {'expression': FIT_JS, 'awaitPromise': True, 'returnByValue': True})
                val = r.get('result', {}).get('value')
                if not isinstance(val, str):
                    sys.exit('fit script failed for %s: %s' % (p['slug'], json.dumps(r.get('exceptionDetails') or r)[:400]))
                fit = json.loads(val)
                if os.environ.get('CARDS_DEBUG'):
                    print(p['slug'], 'attempt', attempt, fit['fonts'], [f for f in fit['faces'] if 'loaded' not in f] or 'all faces loaded')
                if not all(fit.get('fonts', [])) and font_tries < 2:
                    font_tries += 1  # a face did not arrive in time; load the page again at the same density
                    time.sleep(1.0)
                    continue
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
                note += ' FONTS %s' % ','.join(n for n, ok in zip(('Fraunces', 'Source Serif 4', 'Instrument Sans', 'Jost'), fit['fonts']) if not ok)
            total += size
            print('%-32s %4d KB  %-16s title %3spx, %s line%s, lede %2spx%s' % (p['slug'] + '.png', size // 1024, name, fit.get('px', '?'), fit.get('lines', '?'),
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
