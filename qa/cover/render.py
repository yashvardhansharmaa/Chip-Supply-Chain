#!/usr/bin/env python3
"""Render the die-floorplan point cloud as cover art: transparent RGBA PNG.

usage:
  python3 qa/cover/render.py out.png [--rx 0.62] [--ry -0.55] [--rz 0]
                                     [--size 2400] [--persp 0|1]
                                     [--rmin 1.5] [--rmax 2.6]
                                     [--amin 90] [--amax 230]
                                     [--ink 12161a] [--amber c98a12]
                                     [--pad 0] [--fit width|height]
                                     [--aspect W:H]   crop to this ratio about the centre
                                     [--gamma 1.0]    weight -> alpha curve
                                     [--supersample 1]

Reads qa/die-floorplan.bin (float32 rows of x, y, z, w; w >= 2 marks amber).
Points are depth-sorted far-to-near and drawn as small ellipses with PIL onto a
transparent canvas, then cropped to the ink bounding box (or to --aspect).
"""
import argparse, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def hexcol(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def rot(rx, ry, rz):
    cx, sx = math.cos(rx), math.sin(rx)
    cy, sy = math.cos(ry), math.sin(ry)
    cz, sz = math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--bin', default=os.path.join(ROOT, 'qa', 'die-floorplan.bin'))
    ap.add_argument('--rx', type=float, default=0.62)
    ap.add_argument('--ry', type=float, default=-0.55)
    ap.add_argument('--rz', type=float, default=0.0)
    ap.add_argument('--size', type=int, default=2400)      # long edge of the drawing box, px
    ap.add_argument('--persp', type=int, default=1)
    ap.add_argument('--rmin', type=float, default=1.5)
    ap.add_argument('--rmax', type=float, default=2.6)
    ap.add_argument('--amin', type=float, default=90)
    ap.add_argument('--amax', type=float, default=230)
    ap.add_argument('--ink', default='12161a')
    ap.add_argument('--amber', default='c98a12')
    ap.add_argument('--gamma', type=float, default=1.0)
    ap.add_argument('--aspect', default='')                # e.g. 16:9 -> crop/pad to this ratio
    ap.add_argument('--fill', type=int, default=0)          # with --aspect: cover the box, not fit it
    ap.add_argument('--zoom', type=float, default=1.0)      # >1 pushes the art past the crop edges
    ap.add_argument('--ox', type=float, default=0.0)        # crop offset, fraction of canvas width
    ap.add_argument('--oy', type=float, default=0.0)
    ap.add_argument('--supersample', type=int, default=1)
    ap.add_argument('--ambergain', type=float, default=1.0)
    args = ap.parse_args()

    ink, amber = hexcol(args.ink), hexcol(args.amber)
    data = np.fromfile(args.bin, dtype=np.float32).reshape(-1, 4)
    xyz, w = data[:, :3].astype(np.float64), data[:, 3].astype(np.float64)

    R = rot(args.rx, args.ry, args.rz)
    p = xyz @ R.T
    z = p[:, 2]
    if args.persp:
        f = 1.55 / (3.2 - z)
        u, v = p[:, 0] * f, -p[:, 1] * f
    else:
        u, v = p[:, 0], -p[:, 1]

    # normalise into a box whose long edge is --size
    du, dv = u.max() - u.min(), v.max() - v.min()
    S = args.supersample
    if args.aspect and args.fill:
        # the canvas is the crop window; scale the art to COVER it, so it runs off the edges
        aw, ah = (float(t) for t in args.aspect.split(':'))
        if aw >= ah:
            Wpx, Hpx = int(args.size * S), int(round(args.size * S * ah / aw))
        else:
            Hpx, Wpx = int(args.size * S), int(round(args.size * S * aw / ah))
        scale = args.zoom * max(Wpx / du, Hpx / dv)
        u = (u - (u.min() + u.max()) / 2) * scale
        v = (v - (v.min() + v.max()) / 2) * scale
    else:
        scale = args.size * S * args.zoom / max(du, dv)
        u = (u - (u.min() + u.max()) / 2) * scale
        v = (v - (v.min() + v.max()) / 2) * scale
        Wpx = int(math.ceil(du * scale)) + 8 * S
        Hpx = int(math.ceil(dv * scale)) + 8 * S
        if args.aspect:
            aw, ah = (float(t) for t in args.aspect.split(':'))
            # canvas is the crop window, centred on the art
            if Wpx / Hpx < aw / ah:
                Wpx = int(round(Hpx * aw / ah))
            else:
                Hpx = int(round(Wpx * ah / aw))
    cx = Wpx / 2.0 + args.ox * Wpx
    cy = Hpx / 2.0 + args.oy * Hpx
    u, v = u + cx, v + cy

    img = Image.new('RGBA', (Wpx, Hpx), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    order = np.argsort(z)                      # far first, near last
    uo, vo, wo, zo = u[order], v[order], w[order], z[order]
    # depth 0 (far) .. 1 (near) drives radius and alpha so the near face reads crisper
    zr = (zo - zo.min()) / max(1e-6, (zo.max() - zo.min()))
    keep = (uo > -20 * S) & (uo < Wpx + 20 * S) & (vo > -20 * S) & (vo < Hpx + 20 * S)
    uo, vo, wo, zr = uo[keep], vo[keep], wo[keep], zr[keep]

    is_amber = wo >= 2.0
    strength = np.where(is_amber, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1))
    strength = np.power(np.clip(strength, 0, 1), args.gamma)
    alpha = (args.amin + (args.amax - args.amin) * (0.45 * strength + 0.55 * zr))
    alpha = np.where(is_amber, np.clip(alpha * args.ambergain, 0, 255), alpha)
    rad = (args.rmin + (args.rmax - args.rmin) * zr) * S

    for x, y, r, a, amb in zip(uo, vo, rad, alpha, is_amber):
        col = amber if amb else ink
        d.ellipse((x - r, y - r, x + r, y + r), fill=col + (int(a),))

    if S > 1:
        img = img.resize((Wpx // S, Hpx // S), Image.LANCZOS)

    if not args.aspect:
        bb = img.getbbox()
        if bb:
            img = img.crop(bb)
    img.save(args.out, optimize=True)
    print('wrote %s  %dx%d  %d bytes  (%d pts drawn)'
          % (args.out, img.size[0], img.size[1], os.path.getsize(args.out), len(uo)))


if __name__ == '__main__':
    main()
