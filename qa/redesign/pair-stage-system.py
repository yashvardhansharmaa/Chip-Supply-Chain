#!/usr/bin/env python3
"""Join each before and after shot of qa/redesign/shots-stage-system.sh side by side, with a label over each half.
usage: python3 qa/redesign/pair-stage-system.py [shots dir, default qa/redesign/shots/stage-system]
Writes <dir>/pairs/<name>.png for every <name>-before.png that has a <name>-after.png."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

D = sys.argv[1] if len(sys.argv) > 1 else 'qa/redesign/shots/stage-system'
OUT = os.path.join(D, 'pairs')
os.makedirs(OUT, exist_ok=True)
try:
    FONT = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 28)
except OSError:
    FONT = ImageFont.load_default()
GAP, HEAD = 40, 64
n = 0
for f in sorted(os.listdir(D)):
    if not f.endswith('-before.png'):
        continue
    name = f[:-len('-before.png')]
    after = os.path.join(D, name + '-after.png')
    if not os.path.exists(after):
        continue
    a, b = Image.open(os.path.join(D, f)).convert('RGB'), Image.open(after).convert('RGB')
    w, h = a.width + GAP + b.width, max(a.height, b.height) + HEAD
    sheet = Image.new('RGB', (w, h), (255, 255, 255))
    sheet.paste(a, (0, HEAD))
    sheet.paste(b, (a.width + GAP, HEAD))
    d = ImageDraw.Draw(sheet)
    d.text((0, 16), f'{name}: before (8766)', fill=(23, 23, 22), font=FONT)
    d.text((a.width + GAP, 16), f'{name}: after (this branch)', fill=(122, 31, 43), font=FONT)
    sheet.save(os.path.join(OUT, name + '.png'), optimize=True)
    n += 1
print(f'{n} pairs in {OUT}')
