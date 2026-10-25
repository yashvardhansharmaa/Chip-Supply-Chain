#!/usr/bin/env python3
"""A contact sheet of the share cards: every card at half size, home first, then the chapters in order, then the views.

usage: python3 qa/redesign/cards-sheet.py [--dir build/assets/cards] [--out qa/redesign/cards-sheet.png] [--scale 0.5]
Each card is labeled with its file name and its size in KB.
"""
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
a = sys.argv[1:]
opt = lambda n, d: a[a.index(n) + 1] if n in a else d
DIR = os.path.abspath(opt('--dir', os.path.join(ROOT, 'build', 'assets', 'cards')))
OUT = os.path.abspath(opt('--out', os.path.join(ROOT, 'qa', 'redesign', 'cards-sheet.png')))
SCALE = float(opt('--scale', '0.5'))
COLS = 3

chapters = []
for f in sorted(os.listdir(os.path.join(ROOT, 'content'))):
    if re.match(r'^\d\d-.*\.md$', f):
        m = json.loads(re.match(r'^---json\s*\n(.*?)\n---', open(os.path.join(ROOT, 'content', f), encoding='utf8').read(), re.S).group(1))
        chapters.append(m['id'])
order = ['home'] + chapters + ['intro', 'chain', 'chips', 'suppliers', 'export-controls', 'glossary']
order = [s for s in order if os.path.exists(os.path.join(DIR, s + '.png'))]

w, h = round(1200 * SCALE), round(630 * SCALE)
pad, label = 24, 26
sheet = Image.new('RGB', (pad + COLS * (w + pad), pad + -(-len(order) // COLS) * (h + label + pad)), (226, 226, 222))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 15)
except Exception:
    font = ImageFont.load_default()
for i, slug in enumerate(order):
    p = os.path.join(DIR, slug + '.png')
    x, y = pad + (i % COLS) * (w + pad), pad + (i // COLS) * (h + label + pad)
    d.text((x, y + 4), '%s.png, %d KB' % (slug, os.path.getsize(p) // 1024), fill=(69, 68, 63), font=font)
    sheet.paste(Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS), (x, y + label))
    d.rectangle((x - 1, y + label - 1, x + w, y + label + h), outline=(180, 179, 174))
sheet = sheet.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
sheet.save(OUT, optimize=True)
print('wrote %s, %d cards, %d KB' % (OUT, len(order), os.path.getsize(OUT) // 1024))
