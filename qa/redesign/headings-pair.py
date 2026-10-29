#!/usr/bin/env python3
"""Compares the before and after shots of qa/redesign/headings-proof.js shots pixel by pixel (29 Oct 2026). For each frame: the
share of pixels that differ and the box round them, and whether every differing pixel is one the brief allows: inside a
renamed heading's box on either side, or below the top of a renamed heading whose box changed height (its words reflowed and
moved what follows), or on the facts line, whose "Updated" day moves when a chapter's words change (build/build.js page
dates). A frame with no renamed heading must not differ at all. A side-by-side sheet (before | after | the difference in red)
is written for any frame that differs.

usage: python3 qa/redesign/headings-pair.py <shots dir> > <report>"""
import json, os, sys
from PIL import Image, ImageChops

d = sys.argv[1]
frames = json.load(open(os.path.join(d, 'shots.json')))
same = allowed = wrong = 0
for f in frames:
    n = f['name']
    a, b = os.path.join(d, f'{n}-before.png'), os.path.join(d, f'{n}-after.png')
    A, B = Image.open(a).convert('RGB'), Image.open(b).convert('RGB')
    if A.size != B.size:
        print(f'{n}: sizes differ {A.size} {B.size}'); wrong += 1; continue
    diff = ImageChops.difference(A, B)
    box = diff.getbbox()
    if not box:
        same += 1; print(f'{n}: same'); continue
    mask = diff.convert('L').point(lambda v: 255 if v > 0 else 0)
    W, H = A.size
    # the allowed region: each renamed heading's box on either side, everything below a heading whose height changed, and
    # the facts line
    ok = Image.new('L', A.size, 0)
    sb, sa = f['sides']['before'], f['sides']['after']
    heads = {}
    for side in (sb, sa):
        for hid, r in side['heads']:
            if r: heads.setdefault(hid, []).append(r)
    notes = []
    for hid, rs in heads.items():
        for r in rs:
            ok.paste(255, (max(0, r[0]), max(0, r[1]), min(W, r[2]), min(H, r[3])))
        if len(rs) == 2 and (rs[0][3] - rs[0][1]) != (rs[1][3] - rs[1][1]):
            top = max(0, min(rs[0][1], rs[1][1]))
            ok.paste(255, (0, top, W, H))
            notes.append(f'{hid} reflows from y={top}')
    for side in (sb, sa) if heads else ():  # only a chapter whose words changed may show a new day
        r = side.get('meta')
        if r: ok.paste(255, (max(0, r[0]), max(0, r[1]), min(W, r[2]), min(H, r[3])))
    outside = ImageChops.multiply(mask, ok.point(lambda v: 0 if v else 255))
    stray = outside.getbbox()
    share = sum(1 for v in mask.getdata() if v) / (W * H) * 100
    red = Image.new('RGB', A.size, (255, 255, 255)); red.paste((200, 0, 0), mask=mask)
    sheet = Image.new('RGB', (W * 3 + 20, H), 'white')
    for i, im in enumerate((A, B, red)): sheet.paste(im, (i * (W + 10), 0))
    sheet.save(os.path.join(d, f'{n}-pair.png'))
    if stray:
        wrong += 1; print(f'{n}: DIFFERS OUTSIDE THE RENAMED HEADINGS in {share:.3f}% of pixels, within {box}; stray pixels within {stray}')
    else:
        allowed += 1; print(f'{n}: differs in {share:.3f}% of pixels, within {box}, all of it in the renamed headings or the facts line' + (f' ({"; ".join(notes)})' if notes else ''))
print(f'\n{same} frames the same, {allowed} differ only where allowed, {wrong} differ elsewhere')
sys.exit(1 if wrong else 0)
