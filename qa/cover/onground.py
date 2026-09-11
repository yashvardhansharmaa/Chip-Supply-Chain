#!/usr/bin/env python3
"""Composite cover art over the wafer-grey ground and report where the amber sits.
usage: python3 qa/cover/onground.py in.png out.png [band_width_mm]
"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
mm = float(sys.argv[3]) if len(sys.argv) > 3 else 210.0
im = Image.open(src).convert('RGBA')
g = Image.new('RGBA', im.size, (237, 239, 240, 255))
g.alpha_composite(im)
g.convert('RGB').save(out)

a = np.asarray(im).astype(int)
r, gg, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
amber = (al > 20) & (r > gg + 20) & (gg > b + 20)
cols = amber.sum(0)
hit = np.nonzero(cols > im.size[1] * 0.15)[0]
print('wrote', out, im.size)
if len(hit):
    print('amber columns px %d..%d  =  %.1fmm..%.1fmm from the left edge'
          % (hit[0], hit[-1], hit[0] * mm / im.size[0], hit[-1] * mm / im.size[0]))
else:
    print('no strong amber column')
ink_cov = ((al > 20) & ~amber).mean()
print('ink coverage %.1f%%   amber coverage %.2f%%' % (ink_cov * 100, amber.mean() * 100))
