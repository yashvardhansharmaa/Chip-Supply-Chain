#!/usr/bin/env python3
"""Render the PDF cover art: the 300 mm wafer specimen in plan view, one reticle field picked out in
the specimen's own colour (the wafer declares the faint blue of anti-reflective film), on transparent ground. Writes build/assets/print-title.png; the build copies it into dist/.

usage: python3 build/cover-art.py [out.png] [--bin wafer.bin] [--width-mm 164] [--dpi 240]
                                  [--rmin 0.9] [--rmax 1.6] [--amin 85] [--amax 220]
                                  [--ink 12161a] [--accent 5a86b4] [--accent2 <hex>] [--accentgain 1.25]
                                  [--ring-mm 0.35] [--no-ring] [--supersample 2] [--no-quantize]

The point cloud comes from `node build/cover-export.js wafer <bin>` (run here unless --bin is
given): float32 rows of x, y, z, w, where w in [0,1] is ink weight, w in [2,3] is the accent and
w in (3,4] the second accent. The colours come from the <bin>.json sidecar cover-export.js writes
(the specimen's declared light-ground colours, as on the page); --accent/--accent2 override them.
The view is orthographic from directly above (rx pi/2): the notch falls at the foot, the polished
face is nearest. Points are depth-sorted far-to-near and drawn as small discs with PIL, then the
image is cropped to the ink and sized so the wafer prints --width-mm wide at --dpi.

The accent field is a twenty-level margin in greyscale, so it carries a second cue that survives a
mono printer: a heavier seal ring, solid ink --ring-mm wide, inset 10 % like every other field's
ring but drawn as a line rather than a row of dots. Its rectangle is the bounding box of the accent
points, so it follows the specimen if the accent cell moves.
"""
import argparse, json, math, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT = os.path.join(ROOT, 'build', 'assets', 'print-title.png')


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


def export(name):
    fd, path = tempfile.mkstemp(prefix='cover-%s-' % name, suffix='.bin')
    os.close(fd)
    subprocess.run(['node', os.path.join(ROOT, 'build', 'cover-export.js'), name, path], check=True)
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out', nargs='?', default=DEFAULT_OUT)
    ap.add_argument('--bin', default='')
    ap.add_argument('--specimen', default='wafer')
    ap.add_argument('--width-mm', type=float, default=164.0)   # printed width of the wafer
    ap.add_argument('--dpi', type=float, default=240.0)
    ap.add_argument('--rx', type=float, default=math.pi / 2)
    ap.add_argument('--ry', type=float, default=0.0)
    ap.add_argument('--rz', type=float, default=0.0)
    ap.add_argument('--rmin', type=float, default=0.9)          # dot radius, px at --dpi
    ap.add_argument('--rmax', type=float, default=1.6)
    ap.add_argument('--amin', type=float, default=85)           # dot alpha
    ap.add_argument('--amax', type=float, default=220)
    ap.add_argument('--ink', default='12161a')
    ap.add_argument('--accent', default='')                    # override the specimen's own colour
    ap.add_argument('--accent2', default='')
    ap.add_argument('--amber', default='', help=argparse.SUPPRESS)  # old name for --accent
    ap.add_argument('--accentgain', type=float, default=1.25)
    ap.add_argument('--ambergain', type=float, default=None, help=argparse.SUPPRESS)
    ap.add_argument('--ring-mm', type=float, default=0.35)      # the heavy seal ring's line width
    ap.add_argument('--ring-inset', type=float, default=0.10)   # as a fraction of the field, like the others
    ap.add_argument('--no-ring', action='store_true')
    ap.add_argument('--supersample', type=int, default=2)
    ap.add_argument('--no-quantize', action='store_true')       # keep the full RGBA PNG
    args = ap.parse_args()

    ink = hexcol(args.ink)
    bin_path = args.bin or export(args.specimen)
    # the specimen's own colours, from the sidecar cover-export.js writes; the site's accent if it declares none
    declared = None
    if os.path.exists(bin_path + '.json'):
        declared = json.load(open(bin_path + '.json')).get('colors')
    accent = hexcol(args.accent or args.amber) if (args.accent or args.amber) else (tuple(declared['accent']) if declared else hexcol('7a1f2b'))
    accent2 = hexcol(args.accent2) if args.accent2 else (tuple(declared['accent2']) if declared else accent)
    gain = args.ambergain if args.ambergain is not None else args.accentgain
    data = np.fromfile(bin_path, dtype=np.float32).reshape(-1, 4)
    xyz, w = data[:, :3].astype(np.float64), data[:, 3].astype(np.float64)

    p = xyz @ rot(args.rx, args.ry, args.rz).T
    u, v, z = p[:, 0], -p[:, 1], p[:, 2]

    S = args.supersample
    px_per_unit = args.width_mm / 25.4 * args.dpi / (u.max() - u.min())
    scale = px_per_unit * S
    Wpx = int(math.ceil((u.max() - u.min()) * scale)) + 8 * S
    Hpx = int(math.ceil((v.max() - v.min()) * scale)) + 8 * S
    cu, cv = (u.min() + u.max()) / 2, (v.min() + v.max()) / 2
    U = (u - cu) * scale + Wpx / 2.0
    V = (v - cv) * scale + Hpx / 2.0

    img = Image.new('RGBA', (Wpx, Hpx), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    order = np.argsort(z)                       # far first, near last
    Uo, Vo, wo, zo = U[order], V[order], w[order], z[order]
    zr = (zo - zo.min()) / max(1e-6, zo.max() - zo.min())
    is_acc2 = wo > 3.0
    is_acc = (wo >= 2.0) & ~is_acc2
    strength = np.where(is_acc2, np.clip(wo - 3.0, 0, 1), np.where(is_acc, np.clip(wo - 2.0, 0, 1), np.clip(wo, 0, 1)))
    alpha = args.amin + (args.amax - args.amin) * (0.45 * strength + 0.55 * zr)
    alpha = np.where(is_acc | is_acc2, np.clip(alpha * gain, 0, 255), alpha)
    rad = (args.rmin + (args.rmax - args.rmin) * zr) * S

    for x, y, r, a, c1, c2 in zip(Uo, Vo, rad, alpha, is_acc, is_acc2):
        d.ellipse((x - r, y - r, x + r, y + r), fill=(accent2 if c2 else accent if c1 else ink) + (int(a),))

    # The second cue: a solid, heavier seal ring inside the accent field.
    if not args.no_ring and is_acc.any():
        ax0, ax1 = Uo[is_acc].min(), Uo[is_acc].max()
        ay0, ay1 = Vo[is_acc].min(), Vo[is_acc].max()
        fw, fh = ax1 - ax0, ay1 - ay0
        i = args.ring_inset
        lw = max(1, int(round(args.ring_mm / 25.4 * args.dpi * S)))
        d.rectangle((ax0 + fw * i, ay0 + fh * i, ax1 - fw * i, ay1 - fh * i),
                    outline=ink + (255,), width=lw)

    if S > 1:
        img = img.resize((Wpx // S, Hpx // S), Image.LANCZOS)
    bb = img.getbbox()
    if bb:
        img = img.crop(bb)
    if not args.no_quantize:
        # two inks and an alpha ramp fit in 256 entries; the palette PNG is a seventh the size
        img = img.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
    img.save(args.out, optimize=True)
    print('wrote %s  %dx%d px  %.1f x %.1f mm at %d dpi  %d KB  (%d pts)'
          % (args.out, img.size[0], img.size[1], img.size[0] / args.dpi * 25.4, img.size[1] / args.dpi * 25.4,
             args.dpi, os.path.getsize(args.out) // 1024, len(Uo)))
    if not args.bin:
        os.unlink(bin_path)
        if os.path.exists(bin_path + '.json'):
            os.unlink(bin_path + '.json')


if __name__ == '__main__':
    main()
