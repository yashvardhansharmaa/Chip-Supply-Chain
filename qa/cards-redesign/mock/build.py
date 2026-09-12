#!/usr/bin/env python3
"""Card redesign mockups: five directions x (home, lithography) -> qa/cards-redesign/*.png + sheet.png.

Mock only. Chrome invocation copied from build/cards.py. Point clouds are drawn with PIL the way
qa/cover/render.py does it (die-floorplan.bin, plus euv-scanner.bin dumped by dump-specimen.js).
usage: python3 build.py [--only floorplan,route] [--skip-art]
"""
import base64, json, math, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import websocket

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(OUTDIR))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9335
W, H = 1200, 630
HOST = 'chipsupplychain.org'
args = sys.argv[1:]
ONLY = args[args.index('--only') + 1].split(',') if '--only' in args else None
SKIP_ART = '--skip-art' in args

LIGHT = dict(bg='#edeff0', bg2='#e4e7e9', bg3='#d9dde0', ink='#12161a', ink2='#3a434c', muted='#5b646d', line='#cbd0d4', line2='#b6bcc1', accent='#c98a12', accent_ink='#7a5406', accent_soft='rgba(201,138,18,0.14)')
DARK = dict(bg='#101315', bg2='#171b1e', bg3='#1f2529', ink='#e7e9ea', ink2='#c0c7cc', muted='#8b959d', line='#2a3137', line2='#3a434a', accent='#e6ad2f', accent_ink='#f0c25a', accent_soft='rgba(230,173,47,0.16)')

# ---------- content, from content/*.md front matter ----------
SUBWORD = {'Very hard': 'Very hard to substitute', 'Hard': 'Hard to substitute', 'Moderate': 'Moderately hard to substitute', 'Easy': 'Easy to substitute'}

def chapters():
    out = []
    for f in sorted(os.listdir(os.path.join(ROOT, 'content'))):
        if not re.match(r'^\d\d-.*\.md$', f): continue
        src = open(os.path.join(ROOT, 'content', f)).read()
        m = re.match(r'^---json\s*\n([\s\S]*?)\n---', src)
        if not m: continue
        out.append(json.loads(m.group(1)))
    return sorted(out, key=lambda c: c['number'])

CH = chapters()
STAGES = [c for c in CH if 1 <= c['number'] <= 15]
SUPPLIERS = len(json.load(open(os.path.join(ROOT, 'data', 'suppliers.json'))))

def town(c):
    # first listed country; the town is the last comma clause when the note carries one (Lithography: Veldhoven)
    co = c['card']['countries'][0]
    note = co['note']
    t = note.split(',')[-1].strip() if ',' in note and len(note.split(',')[-1].strip().split()) <= 2 else ''
    return (t + ', ' if t else '') + co['code']

litho = next(c for c in CH if c['id'] == 'lithography')
PAGES = [
    dict(slug='home', kind='view', eyebrow='The AI chip supply chain', title='Chip Supply Chain',
         line='How AI chips are made, and who controls each stage.',
         numeral='15', numeral_of='stages', tag='17 chapters', tag2='%d firms' % SUPPLIERS,
         headline='15', headline_unit='stages between a chip design and a data centre. This site walks every one, and names who controls it.',
         specimen='die-floorplan', stage=None),
    dict(slug='lithography', kind='chapter', number=4, eyebrow='Chip Supply Chain · Chapter 04 · Stage 4 of 15', title=litho['title'],
         conc=litho['card']['concentration'], sub=SUBWORD[litho['card']['substitutability']['band']],
         line='%s concentration · %s' % (litho['card']['concentration'], SUBWORD[litho['card']['substitutability']['band']]),
         numeral='04', numeral_of='15', tag=litho['card']['concentration'] + ' concentration', tag2=SUBWORD[litho['card']['substitutability']['band']],
         headline='48', headline_unit='EUV scanners booked as revenue in 2025. Every one of them built by a single firm.',
         specimen=litho['specimen'], stage=4, town=town(litho)),
]

# ---------- point clouds (after qa/cover/render.py) ----------
def hexcol(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

def rot(rx, ry, rz):
    cx, sx = math.cos(rx), math.sin(rx); cy, sy = math.cos(ry), math.sin(ry); cz, sz = math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]]); Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]]); Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx

def render_cloud(binpath, out, rx, ry, rz=0.0, box=(700, 630), zoom=1.0, ox=0.0, oy=0.0, persp=True, rmin=1.4, rmax=2.4,
                 amin=80, amax=225, ink='12161a', amber='c98a12', ambergain=1.0, S=2, recolour=None, fit='cover'):
    """Draw the cloud into a box (px) of the given size; the art covers (or fits) the box. recolour(xyz, w) -> w'."""
    inkc, ambc = hexcol(ink), hexcol(amber)
    data = np.fromfile(binpath, dtype=np.float32).reshape(-1, 4)
    xyz, w = data[:, :3].astype(np.float64), data[:, 3].astype(np.float64)
    if recolour: w = recolour(xyz, w)
    p = xyz @ rot(rx, ry, rz).T
    z = p[:, 2]
    if persp:
        f = 1.55 / (3.2 - z); u, v = p[:, 0] * f, -p[:, 1] * f
    else:
        u, v = p[:, 0], -p[:, 1]
    du, dv = u.max() - u.min(), v.max() - v.min()
    Wpx, Hpx = box[0] * S, box[1] * S
    scale = zoom * (max if fit == 'cover' else min)(Wpx / du, Hpx / dv)
    u = (u - (u.min() + u.max()) / 2) * scale + Wpx / 2 + ox * Wpx
    v = (v - (v.min() + v.max()) / 2) * scale + Hpx / 2 + oy * Hpx
    img = Image.new('RGBA', (Wpx, Hpx), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    order = np.argsort(z)
    uo, vo, wo, zo = u[order], v[order], w[order], z[order]
    zr = (zo - zo.min()) / max(1e-6, zo.max() - zo.min())
    keep = (uo > -20 * S) & (uo < Wpx + 20 * S) & (vo > -20 * S) & (vo < Hpx + 20 * S)
    uo, vo, wo, zr = uo[keep], vo[keep], wo[keep], zr[keep]
    is_amber = wo >= 2.0
    strength = np.where(is_amber, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1))
    alpha = amin + (amax - amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_amber, np.clip(alpha * ambergain, 0, 255), alpha)
    rad = (rmin + (rmax - rmin) * zr) * S
    for x, y, r, a, amb in zip(uo, vo, rad, alpha, is_amber):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(ambc if amb else inkc) + (int(a),))
    img = img.resize((box[0], box[1]), Image.LANCZOS)
    img.save(out, optimize=True)
    print('  art', os.path.basename(out), img.size, os.path.getsize(out) // 1024, 'KB')

def stage_slice(k, n=15):
    """Recolour the die floorplan: only the k-th of n slices along the die's long axis (z) keeps or gains amber."""
    def f(xyz, w):
        z = xyz[:, 2]; lo, hi = z.min(), z.max()
        t = (z - lo) / (hi - lo + 1e-9)
        t = 1 - t  # count slices from the near edge in the cover's view, so a low stage number sits close to the viewer
        inside = (t >= (k - 1) / n) & (t < k / n)
        base = np.where(w >= 2, np.clip(w - 2, 0, 1), np.clip(w, 0, 1))
        return np.where(inside, 2.0 + np.clip(base * 1.25, 0.35, 1.0), base * 0.9)
    return f

def art():
    FLOOR = os.path.join(ROOT, 'qa', 'die-floorplan.bin')
    EUV = os.path.join(HERE, 'euv-scanner.bin')
    SPEC_FLOOR = os.path.join(HERE, 'die-floorplan-spec.bin')
    # direction 1: floorplan bleed at right, the cover's angle; home keeps the die-to-die strip amber, the chapter lights its slice
    render_cloud(FLOOR, os.path.join(HERE, 'art-floor-home.png'), rx=0.62, ry=-0.55, box=(720, 630), zoom=1.25, ox=0.06, oy=0.0)
    render_cloud(FLOOR, os.path.join(HERE, 'art-floor-litho.png'), rx=0.62, ry=-0.55, box=(720, 630), zoom=1.25, ox=0.06, oy=0.0, recolour=stage_slice(4))
    # direction 4: dark specimen silhouettes, the app's own tilt, pale ink and amber on graphite
    render_cloud(EUV, os.path.join(HERE, 'art-dark-litho.png'), rx=0.16, ry=-0.38, box=(640, 630), fit='fit', zoom=0.92, ink='e7e9ea', amber='e6ad2f', amin=28, amax=150, ambergain=1.35, rmin=1.2, rmax=2.0)
    render_cloud(SPEC_FLOOR, os.path.join(HERE, 'art-dark-home.png'), rx=1.02, ry=-0.32, box=(640, 630), fit='fit', zoom=0.94, ink='e7e9ea', amber='e6ad2f', amin=28, amax=150, ambergain=1.35, rmin=1.2, rmax=2.0)

# ---------- templates ----------
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,400&display=block">'

def base_css(t):
    return """
:root { --bg:%(bg)s; --bg-2:%(bg2)s; --bg-3:%(bg3)s; --ink:%(ink)s; --ink-2:%(ink2)s; --muted:%(muted)s; --line:%(line)s; --line-2:%(line2)s; --accent:%(accent)s; --accent-ink:%(accent_ink)s; --accent-soft:%(accent_soft)s; }
* { box-sizing: border-box; } html, body { margin:0; width:1200px; height:630px; overflow:hidden; }
body { background: var(--bg); color: var(--ink); font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.card { position: relative; width:1200px; height:630px; overflow:hidden; }
.mono { font-family: "IBM Plex Mono", Menlo, monospace; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.mono b { font-weight: 600; color: var(--ink-2); }
.serif { font-family: "Newsreader", Georgia, serif; font-weight: 400; color: var(--ink-2); }
.title { font-family: "IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.012em; margin: 0; }
.host { position:absolute; font-family: "IBM Plex Mono", Menlo, monospace; font-size: 18px; letter-spacing: 0.04em; color: var(--muted); }
""" % t

def esc(s): return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def eyebrow_html(s):
    parts = s.split(' · '); return ' · '.join(['<b>%s</b>' % esc(parts[0])] + [esc(p) for p in parts[1:]])
def doc(css, body): return '<!doctype html><html lang="en"><head><meta charset="utf-8">%s<style>%s</style></head><body><div class="card">%s</div></body></html>' % (FONTS, css, body)

# 1 floorplan bleed
def tpl_floorplan(p):
    t = LIGHT
    art_file = 'art-floor-home.png' if p['slug'] == 'home' else 'art-floor-litho.png'
    css = base_css(t) + """
.art { position:absolute; right:0; top:0; width:720px; height:630px; background: url(%s) 0 0 / 720px 630px no-repeat; }
.art::before { content:""; position:absolute; inset:0; background: linear-gradient(90deg, var(--bg) 0%%, rgba(237,239,240,0.92) 14%%, rgba(237,239,240,0) 46%%); }
.eyebrow { position:absolute; left:72px; top:64px; font-size:21px; white-space:nowrap; }
.title { position:absolute; left:72px; top:136px; width:700px; font-size:%dpx; }
.rule { position:absolute; left:72px; width:120px; height:6px; background: var(--accent); border-radius:1px; }
.line { position:absolute; left:72px; width:560px; font-size:31px; line-height:1.28; }
.host { left:72px; bottom:56px; white-space:nowrap; }
.host span { margin-left:28px; text-transform:uppercase; letter-spacing:0.08em; font-size:15px; }
.host span i { display:inline-block; width:9px; height:9px; background:var(--accent); border-radius:50%%; margin-right:9px; }
""" % (art_file, 112 if p['slug'] != 'home' else 104)
    stage = '<span><i></i>%s · %s</span>' % (esc(litho['card']['leaders'][0]['name']), esc(p['town'])) if p['stage'] else '<span>17 chapters · 15 stages · %d firms</span>' % SUPPLIERS
    body = '<div class="art"></div><p class="mono eyebrow">%s</p><h1 class="title" id="title">%s</h1><div class="rule" id="rule"></div><p class="serif line" id="line">%s</p><p class="host">%s%s</p>' % (eyebrow_html(p['eyebrow']), esc(p['title']), esc(p['line']), HOST, stage)
    return doc(css, body)

# 2 route strip along the foot
def tpl_route(p):
    t = LIGHT
    css = base_css(t) + """
.eyebrow { position:absolute; left:72px; top:64px; font-size:21px; white-space:nowrap; }
.title { position:absolute; left:72px; top:132px; width:1056px; font-size:118px; }
.line { position:absolute; left:72px; top:290px; width:900px; font-size:34px; line-height:1.28; }
.strip { position:absolute; left:72px; right:72px; bottom:120px; height:96px; }
.strip .rail { position:absolute; left:0; right:0; top:56px; height:3px; background: var(--line-2); }
.stop { position:absolute; top:48px; width:19px; height:19px; margin-left:-9.5px; border-radius:2px; background: var(--bg); border:3px solid var(--ink-2); }
.stop.done { background: var(--ink-2); }
.stop.lit { width:34px; height:34px; margin-left:-17px; top:40px; background: var(--accent); border-color: var(--accent); box-shadow: 0 0 0 9px var(--accent-soft); }
.num { position:absolute; top:82px; font-size:14px; letter-spacing:0.06em; transform: translateX(-50%); color: var(--muted); }
.num.lit { color: var(--accent-ink); font-weight:600; }
.label { position:absolute; top:-6px; transform: translateX(-50%); white-space:nowrap; font-size:21px; letter-spacing:0.08em; color: var(--accent-ink); font-weight:600; }
.label.left { transform:none; } .label.right { transform: translateX(-100%); }
.ends { position:absolute; left:72px; right:72px; bottom:186px; display:flex; justify-content:space-between; font-size:15px; letter-spacing:0.08em; }
.host { left:72px; bottom:60px; } .foot2 { position:absolute; right:72px; bottom:60px; font-size:18px; letter-spacing:0.06em; }
"""
    n = 15; parts = ['<div class="rail"></div>']
    k = p['stage']
    for i in range(1, n + 1):
        x = (i - 1) / (n - 1) * 100
        cls = 'stop' + (' lit' if i == k else (' done' if k and i < k else ''))
        parts.append('<div class="%s" style="left:%.2f%%"></div><span class="mono num%s" style="left:%.2f%%">%02d</span>' % (cls, x, ' lit' if i == k else '', x, i))
    if k:
        x = (k - 1) / (n - 1) * 100
        side = ' left' if x < 12 else (' right' if x > 88 else '')
        parts.append('<span class="mono label%s" style="left:%.2f%%">%02d %s · %s</span>' % (side, x, k, esc(p['title']), esc(p['town'])))
    strip = '<div class="strip">%s</div>' % ''.join(parts)
    ends = '' if k else '<div class="mono ends"><span>%s</span><span>%s</span></div>' % (esc(STAGES[0]['title']), esc(STAGES[-1]['title']))
    foot2 = '<p class="mono foot2">Stage %d of 15</p>' % k if k else '<p class="mono foot2">15 stages · 17 chapters</p>'
    body = '<p class="mono eyebrow">%s</p><h1 class="title" id="title">%s</h1><p class="serif line">%s</p>%s%s<p class="host">%s</p>%s' % (eyebrow_html(p['eyebrow']), esc(p['title']), esc(p['line']), ends, strip, HOST, foot2)
    return doc(css, body)

# 3 large numeral with the band as a tag
def tpl_numeral(p):
    t = LIGHT
    home = p['slug'] == 'home'
    css = base_css(t) + """
.eyebrow { position:absolute; left:72px; top:64px; font-size:21px; white-space:nowrap; }
.big { position:absolute; left:64px; top:112px; font-family:"IBM Plex Sans Condensed"; font-weight:700; font-size:400px; line-height:0.86; letter-spacing:-0.04em; color: var(--ink); }
.of { position:absolute; left:72px; top:462px; font-family:"IBM Plex Sans Condensed"; font-weight:500; font-size:64px; line-height:1; letter-spacing:-0.01em; color: var(--muted); }
.right { position:absolute; left:540px; right:72px; top:150px; }
.title { font-size:96px; }
.tags { position:absolute; left:540px; top:380px; display:flex; gap:14px; flex-wrap:wrap; width:600px; }
.tag { font-family:"IBM Plex Mono", Menlo, monospace; font-weight:600; font-size:20px; letter-spacing:0.08em; text-transform:uppercase; padding:12px 18px 11px; border-radius:3px; white-space:nowrap; }
.tag.band { background: var(--accent); color: var(--ink); }
.tag.band.high { background: var(--ink-2); color: var(--bg); }
.tag.sub { border: 2px solid var(--line-2); color: var(--ink-2); }
.host { left:72px; bottom:56px; }
.line { position:absolute; left:540px; top:460px; width:560px; font-size:27px; line-height:1.3; }
"""
    band_cls = 'band' + ('' if p.get('conc') == 'Extreme' else ' high')
    tags = '<span class="tag %s">%s</span><span class="tag sub">%s</span>' % (band_cls if not home else 'sub', esc(p['tag']), esc(p['tag2']))
    of = '/ 15' if not home else 'stages'
    line = p['line'] if home else litho['oneLiner'].split('. ')[0] + '.'  # the tags already carry the bands; the line is the chapter's first sentence
    body = '<p class="mono eyebrow">%s</p><div class="big">%s</div><div class="of">%s</div><div class="right"><h1 class="title" id="title">%s</h1></div><div class="tags" id="tags">%s</div><p class="serif line" id="line">%s</p><p class="host">%s</p>' % (eyebrow_html(p['eyebrow']), p['numeral'], of, esc(p['title']), tags, esc(line), HOST)
    return doc(css, body)

# 4 dark card with one specimen silhouette
def tpl_dark(p):
    t = DARK
    art_file = 'art-dark-home.png' if p['slug'] == 'home' else 'art-dark-litho.png'
    css = base_css(t) + """
.art { position:absolute; right:0; top:0; width:640px; height:630px; background: url(%s) center / 640px 630px no-repeat; }
.art::before { content:""; position:absolute; inset:0; background: linear-gradient(90deg, var(--bg) 0%%, rgba(16,19,21,0.85) 10%%, rgba(16,19,21,0) 40%%); }
.eyebrow { position:absolute; left:72px; top:64px; font-size:21px; white-space:nowrap; }
.title { position:absolute; left:72px; top:136px; width:640px; font-size:%dpx; color: var(--ink); }
.rule { position:absolute; left:72px; width:120px; height:6px; background: var(--accent); border-radius:1px; }
.line { position:absolute; left:72px; width:520px; font-size:31px; line-height:1.28; color: var(--ink-2); }
.host { left:72px; bottom:56px; color: var(--muted); }
.host span { margin-left:28px; opacity:0.8; text-transform:uppercase; letter-spacing:0.08em; font-size:15px; }
""" % (art_file, 112 if p['slug'] != 'home' else 104)
    spec = {'euv-scanner': 'EUV scanner, in section', 'die-floorplan': 'GPU die, one reticle field'}[p['specimen']]
    body = '<div class="art"></div><p class="mono eyebrow">%s</p><h1 class="title" id="title">%s</h1><div class="rule" id="rule"></div><p class="serif line" id="line">%s</p><p class="host">%s<span>%s</span></p>' % (eyebrow_html(p['eyebrow']), esc(p['title']), esc(p['line']), HOST, spec)
    return doc(css, body)

# 5 data card: the number is the composition
def tpl_data(p):
    t = LIGHT
    css = base_css(t) + """
.eyebrow { position:absolute; left:72px; top:64px; font-size:21px; white-space:nowrap; }
.title { position:absolute; left:72px; top:108px; font-size:56px; font-weight:600; color: var(--ink); }
.num { position:absolute; left:58px; top:176px; font-family:"IBM Plex Sans Condensed"; font-weight:700; font-size:340px; line-height:0.86; letter-spacing:-0.05em; color: var(--ink); font-variant-numeric: lining-nums tabular-nums; }
.unit { position:absolute; left:%dpx; top:244px; width:%dpx; font-size:38px; line-height:1.25; color: var(--ink-2); }
.unit b { font-weight:500; color: var(--accent-ink); }
.rule { position:absolute; left:72px; bottom:118px; width:1056px; height:2px; background: var(--line); }
.rule i { position:absolute; left:0; top:-2px; width:120px; height:6px; background: var(--accent); border-radius:1px; }
.host { left:72px; bottom:56px; }
.src { position:absolute; right:72px; bottom:56px; font-size:16px; letter-spacing:0.06em; }
""" % ((470, 640) if p['slug'] != 'home' else (420, 700))
    src = 'ASML annual report 2025' if p['slug'] != 'home' else 'chip design to the data centre'
    unit = esc(p['headline_unit']).replace('single firm', '<b>single firm</b>').replace('every one', '<b>every one</b>')
    body = '<p class="mono eyebrow">%s</p><h1 class="title" id="title">%s</h1><div class="num">%s</div><p class="serif unit">%s</p><div class="rule"><i></i></div><p class="host">%s</p><p class="mono src">%s</p>' % (eyebrow_html(p['eyebrow']), esc(p['title']), p['headline'], unit, HOST, src)
    return doc(css, body)

DIRECTIONS = [('floorplan', tpl_floorplan), ('route', tpl_route), ('numeral', tpl_numeral), ('dark', tpl_dark), ('data', tpl_data)]

# after the title sits, place the rule and line under it (the floorplan and dark templates)
FIT_JS = """
(async () => {
  await document.fonts.ready;
  const t = document.getElementById('title'), r = document.getElementById('rule'), l = document.getElementById('line');
  if (t && t.classList.contains('title') && getComputedStyle(t).position === 'absolute') {
    let px = parseFloat(getComputedStyle(t).fontSize);
    while (t.getBoundingClientRect().height > px * 2.1 && px > 64) { px -= 2; t.style.fontSize = px + 'px'; }
  }
  if (t && r && l) { const b = t.getBoundingClientRect(); r.style.top = (b.bottom + 30) + 'px'; l.style.top = (b.bottom + 62) + 'px'; }
  const tags = document.getElementById('tags');
  if (t && tags && l) { const b = t.getBoundingClientRect(); tags.style.top = (b.bottom + 28) + 'px'; l.style.top = (tags.getBoundingClientRect().bottom + 26) + 'px'; }
  return JSON.stringify({ fonts: [document.fonts.check('600 20px "IBM Plex Sans Condensed"'), document.fonts.check('400 20px "Newsreader"'), document.fonts.check('500 20px "IBM Plex Mono"')] });
})()
"""

def render_cards():
    profile = tempfile.mkdtemp(prefix='cp-mock-profile-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             '--force-device-scale-factor=1', f'--remote-debugging-port={PORT}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        targets = None
        for _ in range(50):
            try: targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list')); break
            except Exception: time.sleep(0.2)
        if not targets: sys.exit('Chrome did not answer')
        page = next(x for x in targets if x['type'] == 'page')
        ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True); mid = [0]
        def send(method, params=None):
            mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get('id') == mid[0]: return msg.get('result', {})
        send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 1, 'mobile': False}); send('Page.enable')
        first = True
        for name, tpl in DIRECTIONS:
            if ONLY and name not in ONLY: continue
            for p in PAGES:
                src = os.path.join(HERE, '%s-%s.html' % (name, p['slug']))
                open(src, 'w').write(tpl(p))
                send('Page.navigate', {'url': 'file://' + src}); time.sleep(2.5 if first else 0.7); first = False
                r = send('Runtime.evaluate', {'expression': FIT_JS, 'awaitPromise': True, 'returnByValue': True})
                fit = json.loads(r.get('result', {}).get('value') or '{}'); time.sleep(0.3)
                shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
                out = os.path.join(OUTDIR, '%s-%s.png' % (name, p['slug']))
                open(out, 'wb').write(base64.b64decode(shot['data']))
                raw = os.path.getsize(out); note = ''
                if raw > 150 * 1024:  # the same 256-colour quantise cards.py applies over 150 KB
                    im = Image.open(out).convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
                    im.save(out, optimize=True); note = ' (raw %d KB, quantised)' % (raw // 1024)
                print('%-28s %4d KB  fonts %s%s' % (os.path.basename(out), os.path.getsize(out) // 1024, fit.get('fonts'), note))
    finally:
        proc.terminate()
        try: proc.wait(timeout=5)
        except Exception: proc.kill()
        shutil.rmtree(profile, ignore_errors=True)

def sheet():
    cw, ch, pad, lab = 600, 315, 28, 34
    cols = 2; rows = len(DIRECTIONS)
    im = Image.new('RGB', (pad + cols * (cw + pad), pad + rows * (ch + lab + pad)), (255, 255, 255)); d = ImageDraw.Draw(im)
    try: font = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 15)
    except Exception: font = ImageFont.load_default()
    for r, (name, _) in enumerate(DIRECTIONS):
        for c, p in enumerate(PAGES):
            f = os.path.join(OUTDIR, '%s-%s.png' % (name, p['slug']))
            if not os.path.exists(f): continue
            x, y = pad + c * (cw + pad), pad + r * (ch + lab + pad)
            d.text((x, y + 6), '%d %s / %s' % (r + 1, name, p['slug']), fill=(60, 60, 60), font=font)
            im.paste(Image.open(f).convert('RGB').resize((cw, ch), Image.LANCZOS), (x, y + lab))
            d.rectangle((x - 1, y + lab - 1, x + cw, y + lab + ch), outline=(200, 200, 200))
    im.save(os.path.join(OUTDIR, 'sheet.png'), optimize=True); print('sheet.png', im.size)

if __name__ == '__main__':
    if not SKIP_ART: art()
    render_cards(); sheet()
