#!/usr/bin/env python3
"""Contact sheet of candidate cover views, composited on the wafer-grey ground.
usage: python3 qa/cover/views.py qa/cover/views.png
"""
import os, subprocess, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'views.png')
TMP = os.path.join(HERE, 'tmp')
os.makedirs(TMP, exist_ok=True)

VIEWS = [
    ('plan',            ['--rx', '1.5708', '--ry', '0', '--rz', '0', '--persp', '0']),
    ('plan-landscape',  ['--rx', '1.5708', '--ry', '0', '--rz', '1.5708', '--persp', '0']),
    ('current 3/4',     ['--rx', '0.62', '--ry', '-0.55']),
    ('low 3/4',         ['--rx', '0.26', '--ry', '-0.42']),
    ('near-plan tilt',  ['--rx', '1.32', '--ry', '-0.16', '--rz', '1.5708']),
    ('edge-on',         ['--rx', '0.10', '--ry', '-0.10', '--rz', '0']),
]

S = 560
tiles = []
for name, flags in VIEWS:
    png = os.path.join(TMP, name.replace('/', '').replace(' ', '-') + '.png')
    subprocess.run([sys.executable, os.path.join(HERE, 'render.py'), png,
                    '--size', str(S), '--rmin', '1.0', '--rmax', '1.7'] + flags, check=True)
    tiles.append((name, Image.open(png)))

cols = 3
rows = (len(tiles) + cols - 1) // cols
CW, CH = S + 40, S + 70
sheet = Image.new('RGB', (cols * CW, rows * CH), (237, 239, 240))
d = ImageDraw.Draw(sheet)
for i, (name, im) in enumerate(tiles):
    c, r = i % cols, i // cols
    im.thumbnail((S, S), Image.LANCZOS)
    x = c * CW + (CW - im.size[0]) // 2
    y = r * CH + 20 + (S - im.size[1]) // 2
    sheet.paste(im, (x, y), im)
    d.text((c * CW + 20, r * CH + CH - 34), '%s  %dx%d' % (name, im.size[0], im.size[1]), fill=(18, 22, 26))
sheet.save(OUT)
print('wrote', OUT, sheet.size)
