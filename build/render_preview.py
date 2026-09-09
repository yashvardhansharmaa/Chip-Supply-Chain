#!/usr/bin/env python3
"""Render a stride-4 float32 point cloud (x,y,z,w) to a 3-view PNG contact sheet.
usage: render_preview.py cloud.bin out.png tiltX tiltY tiltZ
Views: (1) the specimen's own tilt, as the site will first show it; (2) front; (3) top.
Ink points are drawn dark on paper; accent points (w>=2) in copper.
"""
import sys, math, struct
import numpy as np
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
tilt = [float(a) for a in sys.argv[3:6]] if len(sys.argv) >= 6 else [0.35, -0.6, 0]
data = np.fromfile(src, dtype=np.float32).reshape(-1, 4)
xyz, w = data[:, :3], data[:, 3]

def rot(rx, ry, rz):
    cx, sx, cy, sy, cz, sz = math.cos(rx), math.sin(rx), math.cos(ry), math.sin(ry), math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx

S = 520
paper = (244, 243, 238)
ink = (21, 23, 26)
copper = (181, 98, 46)
sheet = Image.new("RGB", (S * 3 + 40, S + 60), paper)
draw = ImageDraw.Draw(sheet)
views = [("site tilt", rot(*tilt)), ("front", rot(0.0, 0.0, 0.0)), ("top", rot(math.pi / 2, 0.0, 0.0))]

for k, (label, R) in enumerate(views):
    p = xyz @ R.T
    # simple perspective
    z = p[:, 2]
    f = 1.55 / (3.2 - z)
    u = p[:, 0] * f
    v = -p[:, 1] * f
    u = (u * 0.92 + 0.5) * S
    v = (v * 0.92 + 0.5) * S
    img = np.zeros((S, S, 3), dtype=np.float32)
    img[:] = paper
    order = np.argsort(z)  # far first
    ui = np.clip(u[order].astype(int), 0, S - 1)
    vi = np.clip(v[order].astype(int), 0, S - 1)
    ww = w[order]
    for (x, y, wt) in zip(ui, vi, ww):
        if wt >= 2.0:
            col, a = copper, min(1.0, wt - 2.0)
        else:
            col, a = ink, min(1.0, max(0.0, wt))
        a *= 0.85
        img[y, x] = img[y, x] * (1 - a) + np.array(col) * a
    tile = Image.fromarray(img.astype(np.uint8))
    sheet.paste(tile, (10 + k * (S + 10), 10))
    draw.text((14 + k * (S + 10), S + 20), f"{label}  ({len(xyz)} pts)", fill=ink)

sheet.save(out)
