#!/usr/bin/env python3
"""The page revisions of 28 Oct 2026: each before (8766) and after (8778) shot in qa/redesign/shots/stage-pages/ side by
side, before on the left, as pair-<name>.png in the same folder. usage: python3 qa/redesign/pair-stage-pages.py"""
import glob, os
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots', 'stage-pages')
n = 0
for b in sorted(glob.glob(os.path.join(D, '*-before.png'))):
    a = b.replace('-before.png', '-after.png')
    if not os.path.exists(a): continue
    L, R = Image.open(b).convert('RGB'), Image.open(a).convert('RGB')
    gap, head = 24, 40
    W, H = L.width + R.width + gap, max(L.height, R.height) + head
    out = Image.new('RGB', (W, H), '#ecebe7')
    g = ImageDraw.Draw(out)
    g.text((8, 12), 'BEFORE (8766)', fill='#45443f'); g.text((L.width + gap + 8, 12), 'AFTER (8778)', fill='#7a1f2b')
    out.paste(L, (0, head)); out.paste(R, (L.width + gap, head))
    name = os.path.basename(b).replace('-before.png', '')
    out.save(os.path.join(D, 'pair-' + name + '.png')); n += 1
print(f'{n} pairs in {D}')
