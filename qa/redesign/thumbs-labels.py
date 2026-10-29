#!/usr/bin/env python3
"""The phone strip's 52 px thumbnail of each HBM version (29 Oct 2026): each version's annotated still made into The Chain's
line drawing exactly as build/line-stills.py makes it (the stills, made by qa/redesign/stills-parts.js --suffix, in qa/redesign/labels/), then set in a 52 px box as the strip sets it (object-fit: contain),
shown at 1x and at 3x beside today's. Writes qa/redesign/labels/thumbs-hbm.png (and line-memory-and-hbm-<v>.webp there).
usage: python3 -I qa/redesign/thumbs-labels.py"""
import importlib.util, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
spec = importlib.util.spec_from_file_location('ls', os.path.join(ROOT, 'build', 'line-stills.py'))
ls = importlib.util.module_from_spec(spec); spec.loader.exec_module(ls)
OUT = os.path.join(ROOT, 'qa', 'redesign', 'labels')
os.makedirs(OUT, exist_ok=True)

def line(src):
    im = Image.open(src).convert('RGB')
    box = im.convert('L').point(lambda v: 255 if v < 235 else 0).getbbox()
    if box: im = im.crop(box)
    im.thumbnail((ls.MAX, ls.MAX), Image.LANCZOS)
    g = ls.solve_gamma(im.convert('L'))
    return im.point([round(255 * ((v / 255) ** g)) for v in range(256)] * 3)

def tile(im, px, bg=(252, 252, 250)):
    t = Image.new('RGB', (px, px), bg)
    c = im.copy(); c.thumbnail((px, px), Image.LANCZOS)
    t.paste(c, ((px - c.width) // 2, (px - c.height) // 2))
    return t

rows = [('today', Image.open(os.path.join(ROOT, 'build', 'assets', 'line', 'memory-and-hbm.webp')).convert('RGB'))]
for v in ('a', 'b'):
    f = os.path.join(OUT, 'memory-and-hbm-annotated-%s.webp' % v)  # node qa/redesign/stills-parts.js --only memory-and-hbm --query hbm=<v> --suffix -<v>, moved here
    if os.path.exists(f):
        im = line(f); im.save(os.path.join(OUT, 'line-memory-and-hbm-%s.webp' % v), 'WEBP', quality=84, method=6); rows.append((v, im))
sheet = Image.new('RGB', (len(rows) * 230, 230), (255, 255, 255))
for i, (k, im) in enumerate(rows):
    sheet.paste(tile(im, 52), (i * 230 + 10, 10))
    sheet.paste(tile(im, 156), (i * 230 + 66, 10))
sheet.save(os.path.join(OUT, 'thumbs-hbm.png'))
print('wrote', os.path.join(OUT, 'thumbs-hbm.png'), [k for k, _ in rows])
