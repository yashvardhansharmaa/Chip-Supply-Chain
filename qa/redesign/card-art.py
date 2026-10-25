#!/usr/bin/env python3
"""Prepare the share cards' drawings: build/assets/cards-art/<chapter-id>.png, one per chapter.

usage: python3 qa/redesign/card-art.py [--src <checkout with qa/design3>]

build/cards.py draws every card from these files. Each is the chapter's specimen as the redesign shows it, in ink only:
the drawing's coverage as an 8-bit gray image (255 is full ink), cropped to its ink, at the resolution it was rendered.
- Stages 01 to 15: the alpha of qa/design3/directions/hybrid/assets/spec-<id>.png, the renders the approved home card
  (qa/design3/cards/chain/build.py) draws its row of drawings from, so the cards and the home card share every pixel.
- Chapters 16 and 17: the hybrid has only night renders of these two, so the light renders in
  qa/design3/kit/specimens/<id>.png are turned into coverage the way the hybrid made its own
  (qa/design3/directions/exhibition/ref/darken.py: darker than the ground, a little spread, a 1.9 gain).
qa/design3 is not in git (it lives in the main checkout only), so --src names the checkout that holds it.
"""
import os, re, json, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
args = sys.argv[1:]
SRC = os.path.abspath(args[args.index('--src') + 1]) if '--src' in args else ROOT
HYBRID = os.path.join(SRC, 'qa', 'design3', 'directions', 'hybrid', 'assets')
KIT = os.path.join(SRC, 'qa', 'design3', 'kit', 'specimens')
OUT = os.path.join(ROOT, 'build', 'assets', 'cards-art')


def chapters():
    out = []
    for f in sorted(os.listdir(os.path.join(ROOT, 'content'))):
        if re.match(r'^\d\d-.*\.md$', f):
            m = json.loads(re.match(r'^---json\s*\n(.*?)\n---', open(os.path.join(ROOT, 'content', f), encoding='utf8').read(), re.S).group(1))
            out.append((m['number'], m['id']))
    return sorted(out)


def from_hybrid(cid):
    im = Image.open(os.path.join(HYBRID, 'spec-%s.png' % cid)).convert('RGBA')
    return np.asarray(im)[:, :, 3]


def from_light(cid):
    """darken.py's coverage: how much darker than the ground each pixel is, spread by a 3 px max filter at 0.42, times 1.9."""
    im = np.asarray(Image.open(os.path.join(KIT, '%s.png' % cid)).convert('RGB')).astype(float)
    bg = np.median(np.concatenate([im[:6].reshape(-1, 3), im[-6:].reshape(-1, 3)]), axis=0)
    d = np.clip(bg - im, 0, None).max(axis=2)
    dm = np.asarray(Image.fromarray(np.clip(d, 0, 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))).astype(float)
    d = np.maximum(d, dm * 0.42)
    src = im.copy()
    dark = np.clip(bg - (bg - src) * 1.6, 0, 255)
    grey = (dark.max(axis=2) - dark.min(axis=2)) < 18
    a = np.clip(d * 1.9 / 255.0, 0, 1)
    a[~grey] = np.clip(a[~grey] * 1.5, 0, 1)  # the colored parts (the globe's pins, the cost bar's memory) a little stronger, as darken.py does
    return np.round(a * 255).astype(np.uint8)


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for n, cid in chapters():
        a = from_hybrid(cid) if n <= 15 else from_light(cid)
        ys, xs = np.nonzero(a > 12)
        crop = Image.fromarray(a[ys.min():ys.max() + 1, xs.min():xs.max() + 1], 'L')
        p = os.path.join(OUT, cid + '.png')
        crop.save(p, optimize=True)
        total += os.path.getsize(p)
        print('%02d %-34s %4d x %-4d %4d KB' % (n, cid, crop.width, crop.height, os.path.getsize(p) // 1024))
    print('wrote %s, %d KB in all' % (OUT, total // 1024))


if __name__ == '__main__':
    main()
