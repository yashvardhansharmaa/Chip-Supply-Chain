#!/usr/bin/env python3
"""Render the share cards (1200 x 630 PNG, one per chapter and per view) with headless Chrome.

usage: python3 build/cards.py [--only <slug>[,<slug>]] [--keep] [--port <devtools port, default 9334>] [--out <dir>]

Run by hand, like build/pdf.py, not on every build. The list of pages is build/modules/social.js's manifest(), read
through node, so the cards and the pages share one list. Output: build/assets/cards/<slug>.png (--out writes them to
another folder, for a trial); `node build/build.js` copies the folder to dist/cards/ and bumps a card's version in
versions.json when its bytes change. The home card is drawn by build/home_card.py and is skipped here.

The style is "The whole chain", the home card the owner chose on 25 October 2026 (qa/design3/cards/chain/ in the main
checkout): white ground, ink, Fraunces for the titles and the wordmark and Source Serif 4 for the line under them (the hybrid
of 28 Oct 2026; Source Serif 4 for both from 27 Oct, Fraunces and Literata before; the line is set 8 percent larger than it was
in Literata, the site's text scale), and the wine logo tile as the
only color. Every card stands on the shelf of the stage drawings, one per stage, in the order a chip is made (14 since the
merge of chapters 8 and 9 on 27 Oct 2026; the stages are social.js manifest()'s, by build/stages.js).
- A chapter follows that folder's Lithography sketch: the wordmark, the chapter's title and its one-line summary at the
  left, its own drawing large at the right, and the stage drawings small along the foot, pale but for the chapter's own
  stage, which is in ink with an ink rule under it on the shelf. The last two chapters are not stages: their rows are all
  in ink and no stage is marked, since each covers the whole chain.
- A view (Start here, The Chain, AI Chips, Suppliers, Export Controls, Glossary) follows the home card: the wordmark,
  the view's short title and one line centered over the stage drawings at the home card's size. The row is copied from
  build/assets/home-card/card.html, so it matches the home card to the pixel.

The drawings come from build/assets/cards-art/<chapter-id>.png (made by qa/redesign/card-art.py from the redesign's
specimen renders): each chapter's specimen as ink coverage, cropped. The small ones are drawn as qa/design3/cards/chain/
build.py draws them (same area each, the lines kept crisp, the haze dropped, the weights evened out); the large one keeps
its stipple. The fit script shrinks a long title until it takes at most two lines in its column, then drops the
summary's last sentence while the text would run into the row of drawings. Every PNG is quantized to a palette and must
come in under 150 KB.
"""
import base64, io, json, os, re, shutil, subprocess, sys, tempfile, time, urllib.request
import numpy as np
from PIL import Image
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'assets', 'cards')
ART = os.path.join(ROOT, 'build', 'assets', 'cards-art')
HOME_CARD = os.path.join(ROOT, 'build', 'assets', 'home-card', 'card.html')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PORT = 9334
W, H = 1200, 630
LIMIT = 150 * 1024
INK = (23, 23, 22)          # --ink #171716

args = sys.argv[1:]
only = args[args.index('--only') + 1].split(',') if '--only' in args else None
keep = '--keep' in args  # keep the temporary HTML for inspection
if '--port' in args:
    PORT = int(args[args.index('--port') + 1])
if '--out' in args:
    OUT = os.path.abspath(args[args.index('--out') + 1])

# a view's card: its own short title and one line. Start here's page title is the site's hero, which the home card
# already carries, so its card is named for the page. Suppliers and Export Controls take the first sentence of their
# page's own description (build/page-titles.json), Suppliers' cut to fit; the others keep the line social.js gives them.
VIEW_TITLE = {'intro': 'Start here', 'chain': 'Supply Chain', 'chips': 'AI Chips', 'suppliers': 'Suppliers',
              'export-controls': 'Export Controls', 'glossary': 'Glossary', 'summary': 'Summary'}
VIEW_LINE = {
    'suppliers': 'What each of the {firms} firms makes, where it is based and how hard it would be to replace.',
    'export-controls': 'A timeline of the main chip export rules since 2018 and what can still be sold to China.',
}

# ---------------------------------------------------------------- layout (qa/design3/cards/chain/build.py)
SHELF_GAP = 7               # the shelf rule sits this far below the drawings
CH_ROOT_AREA, CH_MAX_W, CH_MAX_H = 34.0, 56, 56   # the chapter row: each drawing about 34 x 34 px, none over 56 px
CH_X, CH_BASE = 64, 584     # the chapter row runs from x = 64 to 1136 and stands on y = 584
WEIGHT_RANGE = (0.62, 1.5)
INK_GAIN = 1.2
OFF_TONE = 0.30             # the stages that are not this chapter's
BIG_AREA = 150000           # the large drawing covers about this many px (Lithography: 345 x 424, as in the sketch)
BIG_BOX = (456, 440)        # and fits a box at right: 64, top: 52
BIG_RIGHT, BIG_TOP = 64, 52
TEXT_GAP = 48               # at least this much between the text column and the large drawing
COL_MAX = 600               # the text column, from x = 64
TITLE_PX, LINE_PX = 104, 27  # the line was 25 px in Literata: Source Serif 4 reads at 20 / 18.5 of its size
TWO_LINE_PX = 88           # a chapter title that takes two lines is set at most this large
TEXT_BOTTOM = 630 - CH_BASE + CH_MAX_H + 24   # the text stops 24 px above the tallest drawing in the row
VIEW_TITLE_PX = 104
VIEW_COL = 560              # a view's title and line stay inside the center 630 x 630 square, as the home card's do

TILE = ('<svg class="tile" viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="3.2" fill="#7a1f2b"/><path fill="#ffffff" '
        'transform="translate(3.3324 11.8693) scale(0.009179 -0.009179)" d="M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 '
        'L653 720 Q653 786 623 823 Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 Q609 229 697 229 '
        'Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 '
        '563 -26 Q417 -26 301 33 Q185 91 118 198 Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 Q1011 765 '
        '1011 683 Z"/></svg>')

TEMPLATE = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,400&display=block">
<style>
:root{--wall:#ffffff;--ink:#171716;--ink2:#45443f;--rule:#dcdbd6;
  --f-serif:"Fraunces",Georgia,serif;--f-read:"Source Serif 4",Georgia,serif}
*{box-sizing:border-box}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--wall)}
.card{position:relative;width:1200px;height:630px;overflow:hidden;background:var(--wall);color:var(--ink);-webkit-font-smoothing:antialiased}
.wm{display:flex;align-items:center;gap:14px;margin:0}
.wm .tile{display:block;flex:none;width:38px;height:38px}
.wm span{font-family:var(--f-serif);font-size:28px;line-height:1;white-space:nowrap;color:var(--ink);font-weight:540;font-variation-settings:"opsz" 28,"SOFT" 0,"WONK" 0;letter-spacing:-.005em}
h1{margin:0;color:var(--ink);font-family:var(--f-serif);font-weight:400;font-variation-settings:"opsz" 48,"SOFT" 0,"WONK" 0;line-height:1;text-wrap:balance}
.line{margin:0;font-family:var(--f-read);font-weight:400;color:var(--ink2)}
.frieze{position:absolute;left:0;right:0}
.frieze img{position:absolute;bottom:0;display:block}
.shelf{position:absolute;height:2px;background:var(--rule)}
.here{position:absolute;height:2px;background:var(--ink)}

/* a chapter: the Lithography sketch */
.chapter .wm{position:absolute;left:64px;top:54px}
.chapter .text{position:absolute;left:64px;top:122px;width:{{COL}}px;bottom:{{TEXT_BOTTOM}}px;overflow:hidden}
.chapter h1{margin-left:-2px;font-size:{{TITLE_PX}}px;letter-spacing:-.012em}
.chapter .line{margin-top:42px;font-size:{{LINE_PX}}px;line-height:1.42;text-wrap:pretty}
.chapter .big{position:absolute;display:block}
.chapter .frieze{bottom:{{FRIEZE_BOTTOM}}px;height:{{FRIEZE_H}}px}
.chapter .shelf{left:64px;right:64px;top:{{SHELF_TOP}}px}

/* a view: the home card, with the view's title and line */
.view .wm{position:absolute;left:0;right:0;top:52px;justify-content:center}
.view .text{position:absolute;left:0;right:0;top:96px;bottom:{{VIEW_TEXT_BOTTOM}}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.view h1{max-width:{{VIEW_COL}}px;font-size:{{VIEW_TITLE_PX}}px;letter-spacing:-.014em}
.view .line{max-width:{{VIEW_COL}}px;margin-top:34px;font-size:26px;line-height:33px;text-wrap:balance}
.view .frieze{bottom:{{FRIEZE_BOTTOM}}px;height:{{FRIEZE_H}}px}
.view .shelf{left:{{SHELF_X}}px;right:{{SHELF_X}}px;top:{{SHELF_TOP}}px}
</style></head><body><div class="card {{KIND}}">
<p class="wm">{{TILE}}<span>Chip Supply Chain</span></p>
<div class="text" data-two="{{TWO_PX}}"><h1 id="title">{{TITLE}}</h1><p class="line" id="line" data-sentences="{{SENTENCES}}">{{LINE}}</p></div>
{{BIG}}
<div class="shelf"></div>{{HERE}}
<div class="frieze">
{{FRIEZE}}
</div>
</div></body></html>
"""

# a chapter: shrink the title until it takes at most two lines and fits its column; then drop the summary's last
# sentence while the text runs past its box, and last shrink the summary a little. A view: shrink its title while it
# runs past two lines. Reports what it did and whether each face loaded.
FIT_JS = r"""
(async () => {
  await document.fonts.ready;
  for (const s of ['400 40px "Fraunces"', '540 28px "Fraunces"', '400 20px "Source Serif 4"']) { try { await document.fonts.load(s); } catch (e) {} }
  await document.fonts.ready;
  const t = document.getElementById('title'), l = document.getElementById('line'), box = document.querySelector('.text');
  let px = parseFloat(getComputedStyle(t).fontSize);
  const lines = (el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
  const wide = () => t.scrollWidth > t.clientWidth + 1;
  const setT = (v) => { px = v; t.style.fontSize = px + 'px'; };
  while ((lines(t) > 2 || wide()) && px > 56) setT(px - 2);
  const two = +(box.dataset.two || 0);
  if (two && lines(t) === 2 && px > two) setT(two);  // a title on two lines is set smaller, so the summary keeps its room
  const over = () => box.scrollHeight > box.clientHeight + 1;
  const ss = JSON.parse(l.dataset.sentences || '[]');
  let n = ss.length, lpx = parseFloat(getComputedStyle(l).fontSize);
  const setL = (v) => { lpx = v; l.style.fontSize = lpx + 'px'; };
  // while the text runs into the row of drawings: the summary to 25 px, then the title to 80 px, then the summary's
  // last sentence goes, and last the summary to 23 px (the Literata sizes were 23 and 21)
  while (over() && lpx > 25) setL(lpx - 1);
  while (over() && two && px > 80) setT(px - 2);
  while (over() && n > 1) { n -= 1; l.textContent = ss.slice(0, n).join(' '); }
  while (over() && lpx > 23) setL(lpx - 1);
  const fonts = [document.fonts.check('400 40px "Fraunces"'), document.fonts.check('400 20px "Source Serif 4"')];
  // the smallest text on the card, in px, and how close the text comes to the large drawing
  const sizes = [...document.querySelectorAll('h1, .line, .wm span')].map((e) => parseFloat(getComputedStyle(e).fontSize));
  const big = document.querySelector('.big'), tr = Math.max(...[...document.querySelectorAll('h1, .line')].map((e) => {
    const r = document.createRange(); r.selectNodeContents(e); return Math.max(...[...r.getClientRects()].map((q) => q.right), 0); }));
  return JSON.stringify({ px, lines: lines(t), lpx, kept: n, of: ss.length, over: over() || wide(), fonts, smallest: Math.min(...sizes),
    clear: big ? Math.round(big.getBoundingClientRect().left - tr) : null, text: l.textContent });
})()
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def sentences(text):
    """The summary's sentences, with a no-break space between a number and its unit, so "474 GW" never breaks."""
    text = re.sub(r'(\d) (GW|MW|nm|mm|percent|billion|million)\b', '\\1\u00a0\\2', str(text or '').replace('\n', ' '))
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=["A-Z0-9])', text) if s.strip()]


def manifest():
    js = "process.stdout.write(JSON.stringify(require(%s).manifest()))" % json.dumps(os.path.join(ROOT, 'build', 'modules', 'social.js'))
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def chapters():
    """number -> {id, title, one}, from the JSON front matter of content/NN-*.md."""
    out = {}
    for f in sorted(os.listdir(os.path.join(ROOT, 'content'))):
        if re.match(r'^\d\d-.*\.md$', f):
            m = json.loads(re.match(r'^---json\s*\n(.*?)\n---', open(os.path.join(ROOT, 'content', f), encoding='utf8').read(), re.S).group(1))
            out[m['number']] = dict(id=m['id'], title=m['title'], one=m.get('oneLiner') or '')
    return out


def stage_ids(pages):
    """The stages' chapter ids in the order a chip is made, from the manifest (each chapter's stage, 1 on, or None)."""
    st = sorted((p for p in pages if p['kind'] == 'chapter' and p.get('stage')), key=lambda p: p['stage'])
    assert [p['stage'] for p in st] == list(range(1, len(st) + 1)) and len(st) > 1, 'expected stages 1 to N in the manifest'
    return [p['slug'] for p in st]


def supplier_count():
    try:
        return len(json.load(open(os.path.join(ROOT, 'data', 'suppliers.json'), encoding='utf8')))
    except Exception:
        return None


# ---------------------------------------------------------------- the drawings (qa/design3/cards/chain/build.py)

def load(cid):
    """The chapter's drawing as an 8-bit coverage image (L), already cropped to its ink."""
    p = os.path.join(ART, cid + '.png')
    if not os.path.exists(p):
        sys.exit('missing %s: run python3 qa/redesign/card-art.py' % os.path.relpath(p, ROOT))
    return Image.open(p).convert('L')


def coverage(im, w, h, k=3):
    return np.asarray(im.resize((w * k, h * k), Image.LANCZOS, reducing_gap=3.0)).astype(np.float32) / 255.0


def lines(a):
    """Keep the drawing's lines and drop its haze (see build.py): dense stipple goes to full ink on a smooth step set by
    the drawing's own 93rd percentile, the open stipple stays a light gray capped at 35 percent."""
    p = float(np.percentile(a[a > 0.03], 93))
    lo, hi = 0.22 * p, 0.50 * p
    t = np.clip((a - lo) / (hi - lo), 0, 1)
    t = t * t * (3 - 2 * t)
    return np.maximum(t, np.clip(a / p * 0.32, 0, 0.35))


def rgba(alpha):
    out = np.zeros(alpha.shape + (4,), np.uint8)
    out[:, :, 0], out[:, :, 1], out[:, :, 2] = INK
    out[:, :, 3] = np.round(np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def draw(im, w, h, tone=1.0, weight=1.0, k=3):
    a = np.clip(lines(coverage(im, w, h, k)) * weight, 0, 1)
    m = np.asarray(Image.fromarray(np.round(a * 255).astype(np.uint8), 'L').resize((w, h), Image.LANCZOS)).astype(np.float32) / 255.0
    return rgba(m * tone)


def soft(im, w, h, gain=1.6, gamma=0.9):
    """The large drawing keeps its stipple: a plain resample with a mild lift."""
    a = np.asarray(im.resize((w, h), Image.LANCZOS, reducing_gap=3.0)).astype(np.float32) / 255.0
    return rgba(np.clip(a * gain, 0, 1) ** gamma)


def weights(ims, sz, strength=0.5, lo=0.75, hi=1.5):
    means = [float(lines(coverage(im, w, h)).mean()) for im, (w, h) in zip(ims, sz)]
    med = float(np.median(means))
    return [min(hi, max(lo, (med / m) ** strength)) for m in means]


def place(widths, left, right):
    gap = (1200 - left - right - sum(widths)) / (len(widths) - 1)
    xs, x = [], float(left)
    for w in widths:
        xs.append(int(round(x)))
        x += w + gap
    return xs


def sizes(ims, root_area, max_w, max_h):
    out = []
    for im in ims:
        r = im.width / im.height
        w, h = root_area * r ** 0.5, root_area / r ** 0.5
        k = min(1.0, max_w / w, max_h / h)
        out.append((max(1, round(w * k)), max(1, round(h * k))))
    return out


def uri(im):
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def img(im, x, extra=''):
    return '<img style="left:%dpx%s" src="%s" width="%d" height="%d" alt="">' % (x, extra, uri(im), im.width, im.height)


class Row:
    """The stage drawings at the chapter cards' size, in ink and pale, with their places on the shelf."""
    def __init__(self, ids):
        self.n = len(ids)
        ims = [load(i) for i in ids]
        self.sz = sizes(ims, CH_ROOT_AREA, CH_MAX_W, CH_MAX_H)
        wt = weights(ims, self.sz, lo=WEIGHT_RANGE[0], hi=WEIGHT_RANGE[1])
        self.on = [draw(im, w, h, weight=k * INK_GAIN) for im, (w, h), k in zip(ims, self.sz, wt)]
        self.off = [draw(im, w, h, weight=k * INK_GAIN, tone=OFF_TONE) for im, (w, h), k in zip(ims, self.sz, wt)]
        self.xs = place([w for w, h in self.sz], CH_X, CH_X)
        self.h = max(h for w, h in self.sz)

    def html(self, stage):
        """stage: 1 to N marks that stage; None draws them all in ink and marks none."""
        items = [self.on[i] if stage is None or i == stage - 1 else self.off[i] for i in range(self.n)]
        return '\n'.join(img(d, x) for d, x in zip(items, self.xs))


def home_row(n):
    """The home card's own row of drawings and shelf, copied from its card.html (n drawings, one per stage)."""
    s = open(HOME_CARD, encoding='utf8').read()
    sec = s[s.index('<section class="page home">'):]
    sec = sec[:sec.index('</section>')]
    imgs = re.findall(r'<img class="s[^"]*" style="left:(\d+)px" src="(data:image/png;base64,[^"]+)" width="(\d+)" height="(\d+)" alt="">', sec)
    assert len(imgs) == n, 'expected %d drawings in the home card, one per stage, found %d' % (n, len(imgs))
    fr = re.search(r'\.home \.frieze\{bottom:(\d+)px;height:(\d+)px\}', s)
    sh = re.search(r'\.home \.shelf\{left:(\d+)px;right:\d+px;top:(\d+)px\}', s)
    html = '\n'.join('<img style="left:%spx" src="%s" width="%s" height="%s" alt="">' % (x, u, w, h) for x, u, w, h in imgs)
    return dict(html=html, bottom=int(fr.group(1)), h=int(fr.group(2)), shelf_x=int(sh.group(1)), shelf_top=int(sh.group(2)))


def big_size(im):
    """Same area for every large drawing, clipped to the box: a tall drawing stands 440 px high, a wide one 456 px across."""
    r = im.width / im.height
    w, h = (BIG_AREA * r) ** 0.5, (BIG_AREA / r) ** 0.5
    k = min(1.0, BIG_BOX[0] / w, BIG_BOX[1] / h)
    return max(1, round(w * k)), max(1, round(h * k))


def page_html(p, ch, row, home):
    rep = {'{{TWO_PX}}': str(TWO_LINE_PX) if p['kind'] == 'chapter' else '0', '{{TILE}}': TILE, '{{TITLE_PX}}': str(TITLE_PX), '{{LINE_PX}}': str(LINE_PX), '{{TEXT_BOTTOM}}': str(TEXT_BOTTOM),
           '{{VIEW_COL}}': str(VIEW_COL), '{{VIEW_TITLE_PX}}': str(VIEW_TITLE_PX)}
    if p['kind'] == 'chapter':
        c = ch[p['number']]
        im = load(c['id'])
        bw, bh = big_size(im)
        bx = 1200 - BIG_RIGHT - bw
        by = BIG_TOP + (BIG_BOX[1] - bh) // 2  # a short drawing sits at the middle of the box
        ss = sentences(c['one'])
        rep.update({'{{KIND}}': 'chapter', '{{TITLE}}': esc(c['title']),
                    '{{LINE}}': esc(' '.join(ss)), '{{SENTENCES}}': esc(json.dumps(ss)),
                    '{{COL}}': str(min(COL_MAX, bx - TEXT_GAP - 64)),
                    '{{BIG}}': '<img class="big" style="left:%dpx;top:%dpx" src="%s" width="%d" height="%d" alt="">' % (bx, by, uri(soft(im, bw, bh)), bw, bh),
                    '{{FRIEZE}}': row.html(p.get('stage')),
                    '{{FRIEZE_BOTTOM}}': str(630 - CH_BASE), '{{FRIEZE_H}}': str(row.h), '{{SHELF_TOP}}': str(CH_BASE + SHELF_GAP),
                    '{{HERE}}': ('<div class="here" style="left:%dpx;width:%dpx;top:%dpx"></div>' % (row.xs[p['stage'] - 1], row.sz[p['stage'] - 1][0], CH_BASE + SHELF_GAP)) if p.get('stage') else '',
                    '{{SHELF_X}}': '64', '{{VIEW_TEXT_BOTTOM}}': '0'})
    else:
        line = VIEW_LINE.get(p['slug'], p['line']).replace('{firms}', str(supplier_count() or 226))
        rep.update({'{{KIND}}': 'view', '{{TITLE}}': esc(VIEW_TITLE.get(p['slug'], p['title'])), '{{LINE}}': esc(line), '{{SENTENCES}}': '[]',
                    '{{COL}}': '0', '{{BIG}}': '', '{{HERE}}': '', '{{FRIEZE}}': home['html'],
                    '{{FRIEZE_BOTTOM}}': str(home['bottom']), '{{FRIEZE_H}}': str(home['h']), '{{SHELF_TOP}}': str(home['shelf_top']),
                    '{{SHELF_X}}': str(home['shelf_x']), '{{VIEW_TEXT_BOTTOM}}': str(home['bottom'] + home['h'] + 16)})
    html = TEMPLATE
    for k, v in rep.items():
        html = html.replace(k, v)
    assert '{{' not in html, 'a template slot is left unfilled'
    return html


def shrink(path, colors=256):
    """Quantize a PNG to a palette with Pillow, median cut, no dither: ink and gray drawings over a flat white ground."""
    im = Image.open(path).convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(path, optimize=True)
    return os.path.getsize(path)


def main():
    every = manifest()
    pages = [p for p in every if p['slug'] != 'home']  # build/home_card.py draws the home card
    if only:
        pages = [p for p in pages if p['slug'] in only]
    ch = chapters()
    ids = stage_ids(every)
    row = Row(ids) if any(p['kind'] == 'chapter' for p in pages) else None
    home = home_row(len(ids))
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix='cp-cards-')
    profile = tempfile.mkdtemp(prefix='cp-cards-profile-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             '--force-device-scale-factor=1', f'--remote-debugging-port={PORT}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    problems, total = [], 0
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
            src = os.path.join(tmp, p['slug'] + '.html')
            open(src, 'w', encoding='utf8').write(page_html(p, ch, row, home))
            out = os.path.join(OUT, p['slug'] + '.png')
            for attempt in range(3):
                send('Page.navigate', {'url': 'file://' + src})
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
                if all(fit['fonts']):
                    break
                time.sleep(1.0)  # a face did not arrive in time; load the page again
            time.sleep(0.3)
            shot = send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1}})
            if 'data' not in shot or len(shot['data']) < 4000:
                sys.exit('capture failed for %s: %s' % (p['slug'], json.dumps(shot)[:300]))
            open(out, 'wb').write(base64.b64decode(shot['data']))
            size = shrink(out)
            for n in (192, 128, 96, 64):
                if size <= LIMIT:
                    break
                size = shrink(out, n)
            note = ''
            if size > LIMIT:
                note += ' OVER 150 KB'
            if fit['over']:
                note += ' OVERFLOW'
            if not all(fit['fonts']):
                note += ' FONTS DID NOT LOAD'
            if fit['smallest'] < 11:
                note += ' TEXT UNDER 11 PX'
            if note:
                problems.append(p['slug'] + note)
            total += size
            kept = '' if fit['kept'] == fit['of'] else ', summary %d of %d sentences' % (fit['kept'], fit['of'])
            clear = '' if fit['clear'] is None else ', %d px clear of the drawing' % fit['clear']
            print('%-38s %4d KB  title %3dpx, %d line%s, line %dpx%s%s%s' % (p['slug'] + '.png', size // 1024, fit['px'], fit['lines'],
                                                                         '' if fit['lines'] == 1 else 's', fit['lpx'], kept, clear, note))
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
    print('wrote %d cards to %s, %d KB in all' % (len(pages), OUT, total // 1024))
    if problems:
        sys.exit('problems: ' + '; '.join(problems))


if __name__ == '__main__':
    main()
