#!/usr/bin/env python3
"""The phone strip's thumbnail at several point densities, side by side (speed fix, 21 Oct 2026).
usage: strip_density.py <out.png> [--port 10307] [--theme light|dark]
Loads #/chain at 390 x 844 (2x, phone) with reduced motion, so every specimen is drawn at rest, and for each specimen draws
it at THUMB = 1.0 (today's density, 0.55 on a phone) and at lower factors, capturing the 116 px canvas each time."""
import sys, os, json, time, base64, io
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'perf'))
from cdp import Browser, Session
from PIL import Image, ImageDraw
out = sys.argv[1]; args = sys.argv[2:]
port = int(args[args.index('--port') + 1]) if '--port' in args else 10307
theme = args[args.index('--theme') + 1] if '--theme' in args else 'light'
FACTORS = [1.0, 0.5, 0.4, 0.3]
NAMES = ['die-floorplan', 'euv-scanner', 'wafer', 'hbm-stack', 'globe', 'rack', 'gaa-transistor', 'cowos-exploded']
b = Browser(port)
try:
    s = Session(b.page_ws())
    s.send('Page.enable'); s.send('Runtime.enable')
    s.send('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 2, 'mobile': True})
    s.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
    s.send('Page.navigate', {'url': f'http://127.0.0.1:8765/?theme={theme}#/chain'}); time.sleep(6)
    rect = s.eval('(function(){var r=document.getElementById("stage-canvas").getBoundingClientRect();return [r.left,r.top,r.width,r.height];})()')
    tiles = {}
    for n in NAMES:
        for f in FACTORS:
            pts = s.eval(f'(function(){{var S=CP.Stage;S.THUMB={f};S.cache={{}};S.cur=null;S.prev=null;S.show("{n}",null,"","");return S.cur?S.cur.n:0;}})()')
            time.sleep(0.5)
            shot = s.send('Page.captureScreenshot', {'format': 'png', 'clip': {'x': rect[0], 'y': rect[1], 'width': rect[2], 'height': rect[3], 'scale': 2}})
            tiles[(n, f)] = (Image.open(io.BytesIO(base64.b64decode(shot['data']))).convert('RGB'), pts)
    tw, th = tiles[(NAMES[0], 1.0)][0].size
    sheet = Image.new('RGB', (tw * len(FACTORS) + 10 * (len(FACTORS) + 1), (th + 30) * len(NAMES) + 30), 'white' if theme == 'light' else (20, 22, 24))
    d = ImageDraw.Draw(sheet)
    ink = (60, 60, 60) if theme == 'light' else (200, 200, 200)
    for j, f in enumerate(FACTORS): d.text((10 + j * (tw + 10), 8), f'THUMB {f} (density {0.55 * f:.2f})', fill=ink)
    for i, n in enumerate(NAMES):
        for j, f in enumerate(FACTORS):
            im, pts = tiles[(n, f)]; x, y = 10 + j * (tw + 10), 30 + i * (th + 30)
            sheet.paste(im, (x, y)); d.text((x, y + th + 4), f'{n}  {pts:,} pts', fill=ink)
    sheet.save(out); print('wrote', out, sheet.size)
finally:
    b.close()
