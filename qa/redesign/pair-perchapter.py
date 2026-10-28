#!/usr/bin/env python3
"""Compares the before and after shots of qa/redesign/shots-perchapter.js pixel by pixel: for each page, width, theme and screen,
the share of pixels that differ and the box around them, and a side-by-side sheet (before | after | the difference in red) for
any pair that differs. A pair is the same when no pixel differs.

usage: python3 qa/redesign/pair-perchapter.py <shots dir> > qa/redesign/shots-perchapter.txt"""
import os, sys
from PIL import Image, ImageChops

d = sys.argv[1]
names = [l.strip() for l in open(os.path.join(d, 'list.txt')) if l.strip()]
same = differ = 0
for n in names:
    for k in ('0', '1'):
        a, b = os.path.join(d, f'{n}-{k}-before.png'), os.path.join(d, f'{n}-{k}-after.png')
        if not (os.path.exists(a) and os.path.exists(b)):
            print(f'{n} screen {k}: missing'); differ += 1; continue
        A, B = Image.open(a).convert('RGB'), Image.open(b).convert('RGB')
        if A.size != B.size:
            print(f'{n} screen {k}: sizes differ {A.size} {B.size}'); differ += 1; continue
        diff = ImageChops.difference(A, B)
        box = diff.getbbox()
        if not box:
            same += 1; print(f'{n} screen {k}: same'); continue
        differ += 1
        mask = diff.convert('L').point(lambda v: 255 if v > 0 else 0)
        share = sum(1 for v in mask.getdata() if v) / (A.size[0] * A.size[1]) * 100
        red = Image.new('RGB', A.size, (255, 255, 255)); red.paste((200, 0, 0), mask=mask)
        sheet = Image.new('RGB', (A.size[0] * 3 + 20, A.size[1]), 'white')
        for i, im in enumerate((A, B, red)): sheet.paste(im, (i * (A.size[0] + 10), 0))
        sheet.save(os.path.join(d, f'{n}-{k}-pair.png'))
        print(f'{n} screen {k}: differs in {share:.3f}% of pixels, within {box}')
print(f'\n{same} pairs the same, {differ} differ')
