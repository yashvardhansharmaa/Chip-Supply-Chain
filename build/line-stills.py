#!/usr/bin/env python3
"""The drawings on The Chain's contents page (design round six, "The line", chosen 28 Oct 2026; MAIN/qa/design6/a).

Each stage's specimen still (build/assets/specimens/<id>.webp, Lithography's annotated still from data/specimen-parts.json)
is trimmed to its drawing, made at most 300 px on its long side, and darkened by a gamma of its own so the gray of its lines
is the same for all fourteen. Gamma only moves tones: no line is added, moved or removed, and a still is never lightened.
Each drawing also gets the share of its cell it fills at the page's three layouts (one row of fourteen, two rows of seven,
the phone's route down the page), so every drawing covers the same area of the same box and none outweighs its neighbors.

Writes build/assets/line/<id>.webp and build/assets/line/line.json ({ id: { w, h, w1, w2, w3, gamma, src } }, src the
sha256 of the still it was made from). build/build.js copies the files to dist/media/line-<id>.webp, reads the shares,
and warns when a still has changed since this ran. The two chapters that are not stages are not drawn on the line.

usage: python3 build/line-stills.py        (run again whenever a specimen still changes)"""
import hashlib, io, json, os, re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'content')
SPEC = os.path.join(ROOT, 'build', 'assets', 'specimens')
OUT = os.path.join(ROOT, 'build', 'assets', 'line')

AREA = 0.5                       # the share of its cell's box each drawing covers
BOXES = {'w1': 82 / 104,         # one row of fourteen: the box's width over its height (src/modules/chapter.css .ln-sp)
         'w2': 1.15,             # two rows of seven
         'w3': 52 / 36}          # the phone's route down the page
LINE = 130                       # the gray (0 black, 255 white) every drawing's lines average
MAX = 300                        # the long side, in pixels: twice the largest cell a drawing fills


def fit(r, box):
    """the width of a drawing of aspect r as a share of a box of aspect box (width 1, height 1 / box)"""
    W, H = 1.0, 1.0 / box
    w = (AREA * W * H * r) ** 0.5
    h = w / r
    if w > W: w, h = W, W / r
    if h > H: h, w = H, H * r
    return w


def linegray(hist, g):
    """the mean gray of the line pixels (every pixel darker than the white ground) after a gamma of g"""
    tot = sum(hist[:235])
    return sum(255 * ((i / 255) ** g) * hist[i] for i in range(235)) / max(1, tot)


def solve_gamma(gray):
    hist = gray.histogram()
    if linegray(hist, 1.0) <= LINE: return 1.0
    lo, hi = 1.0, 4.0
    for _ in range(30):
        mid = (lo + hi) / 2
        if linegray(hist, mid) > LINE: lo = mid
        else: hi = mid
    return (lo + hi) / 2


def stages():
    """the stage chapters, in order: those whose card rates a concentration"""
    out = []
    for fn in sorted(os.listdir(CONTENT)):
        if not fn.endswith('.md'): continue
        text = open(os.path.join(CONTENT, fn), encoding='utf-8').read()
        m = re.match(r'---json\n(.*?)\n---', text, re.S)
        if not m: continue
        d = json.loads(m.group(1))
        if (d.get('card') or {}).get('concentration'): out.append((d['number'], d['id']))
    return [i for _, i in sorted(out)]


def source(cid, parts):
    still = ((parts.get(cid) or {}).get('still') or {}).get('file')
    return os.path.join(SPEC, still or cid + '.webp')


def main():
    os.makedirs(OUT, exist_ok=True)
    parts = json.load(open(os.path.join(ROOT, 'data', 'specimen-parts.json'), encoding='utf-8'))
    meta = {}
    for cid in stages():
        f = source(cid, parts)
        raw = open(f, 'rb').read()
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        box = im.convert('L').point(lambda v: 255 if v < 235 else 0).getbbox()  # the drawing: every pixel darker than the ground
        if box: im = im.crop(box)
        im.thumbnail((MAX, MAX), Image.LANCZOS)
        g = solve_gamma(im.convert('L'))
        im = im.point([round(255 * ((v / 255) ** g)) for v in range(256)] * 3)
        im.save(os.path.join(OUT, cid + '.webp'), 'WEBP', quality=84, method=6)
        r = im.width / im.height
        meta[cid] = {'w': im.width, 'h': im.height, **{k: round(fit(r, b) * 100, 1) for k, b in BOXES.items()},
                     'gamma': round(g, 2), 'src': hashlib.sha256(raw).hexdigest()[:16]}
        print(f"{cid:34} {im.width:3} x {im.height:3}  gamma {g:.2f}  {os.path.getsize(os.path.join(OUT, cid + '.webp')) // 1024} KB")
    json.dump(meta, open(os.path.join(OUT, 'line.json'), 'w', encoding='utf-8'), indent=1)
    print(len(meta), 'drawings written to', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
