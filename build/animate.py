#!/usr/bin/env python3
"""Render an explainer animation (animations/<name>.html) to the site's media files.

usage: python3 build/animate.py <name> [--fps 24] [--gif] [--themes light,dark]
       python3 build/animate.py --print-stills [<name> ...]

For each theme it writes media/<name>-<theme>.mp4, a first-frame poster media/<name>-<theme>-start.jpg and a
last-frame still media/<name>-<theme>-end.jpg (the poster for reduced motion). The light theme also writes the print
still, media/<name>-print-end.jpg: the same last frame with the site's paper ground (246, 247, 241) taken to white, each
channel scaled by 255 over the ground's value, so on a white PDF page the drawing sits on the page and not in a grey
panel (build.js points img.anim-print at it; the screen never loads it). It also writes media/<name>.json with
the duration and the steps, which build.js turns into the step list and captions under the video.
--print-stills writes only the print stills, from the light last-frame stills already in media/ (every animation, or
the names given), without rendering the video again.
--gif also writes qa/explainer-gifs/<name>-<theme>.gif for sharing outside the site.
Frames are drawn at exact times with window.draw(t), so the result does not depend on machine speed.
Run it alone: it starts its own headless Chrome on DevTools port 9412.
"""
import base64, json, os, shutil, subprocess, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
media = os.path.join(ROOT, 'media'); os.makedirs(media, exist_ok=True)
GROUND = (246, 247, 241)  # the light theme's paper, PAL.bg in animations/*.html

def print_still(src, dst):
    """the last frame for paper: the light ground taken to white, channel by channel, everything darker scaled with it"""
    lut = ':'.join(f"{c}='clip(val*255/{g},0,255)'" for c, g in zip('rgb', GROUND))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-vf', 'format=rgb24,lutrgb=' + lut, '-q:v', '3', dst], check=True)

if args and args[0] == '--print-stills':
    names = args[1:] or sorted(f[:-5] for f in os.listdir(media) if f.endswith('.json'))
    for n in names:
        src = os.path.join(media, n + '-light-end.jpg')
        if not os.path.exists(src): sys.exit(f'no {src}: render the animation first (python3 build/animate.py {n})')
        print_still(src, os.path.join(media, n + '-print-end.jpg'))
        print(f'{n}-print-end.jpg {os.path.getsize(os.path.join(media, n + "-print-end.jpg")) // 1024} KB')
    sys.exit(0)

import websocket  # websocket-client
name = args[0]
def opt(k, d):
    return type(d)(args[args.index(k) + 1]) if k in args else d
fps = opt('--fps', 24)
themes = opt('--themes', 'light,dark').split(',')
page = os.path.join(ROOT, 'animations', name + '.html')
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
port = opt("--port", 9412)  # --port lets two renders run side by side

def run_theme(theme):
    frames = os.path.join('/tmp', f'cp-anim-{name}-{theme}-{os.getpid()}'); shutil.rmtree(frames, ignore_errors=True); os.makedirs(frames)
    profile = f'/tmp/cp-anim-profile-{os.getpid()}'
    proc = subprocess.Popen([chrome, '--headless=new', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
                             f'--remote-debugging-port={port}', f'--user-data-dir={profile}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try: targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
            except Exception: time.sleep(0.2)
        pg = next(t for t in targets if t['type'] == 'page')
        ws = websocket.create_connection(pg['webSocketDebuggerUrl'], suppress_origin=True)
        mid = [0]
        def send(method, params=None):
            mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get('id') == mid[0]: return msg.get('result', {})
        def ev(expr):
            return send('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True}).get('result', {}).get('value')
        send('Page.enable'); send('Page.navigate', {'url': f'file://{page}?theme={theme}'})
        for _ in range(150):
            if ev('window.READY === true'): break
            time.sleep(0.1)
        else: sys.exit('page never set window.READY')
        w, h = ev('window.SIZE'); dur = ev('window.DURATION'); fade = ev('window.FADE'); steps = ev('window.STEPS')
        send('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': 1, 'mobile': False})
        n = int(round(dur * fps))
        for i in range(n):
            ev(f'window.draw({i / fps})')
            shot = send('Page.captureScreenshot', {'format': 'png'})
            open(os.path.join(frames, f'f{i:04d}.png'), 'wb').write(base64.b64decode(shot['data']))
        ev(f'window.draw({dur - fade - 0.001})')
        open(os.path.join(frames, 'end.png'), 'wb').write(base64.b64decode(send('Page.captureScreenshot', {'format': 'png'})['data']))
    finally:
        proc.terminate()
        try: proc.wait(timeout=5)
        except Exception: proc.kill()
        shutil.rmtree(profile, ignore_errors=True)
    pat = os.path.join(frames, 'f%04d.png')
    base = os.path.join(media, f'{name}-{theme}')
    # convert with the BT.709 matrix and tag it: browsers read untagged HD video as BT.709, and a BT.601 file shows a color cast
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', pat, '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
                    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', str(opt('--crf', 20)), '-colorspace', 'bt709', '-color_primaries', 'bt709',
                    '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', base + '.mp4'], check=True)
    for src, dst in ((os.path.join(frames, 'f0000.png'), base + '-start.jpg'), (os.path.join(frames, 'end.png'), base + '-end.jpg')):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-q:v', '3', dst], check=True)
    if theme == 'light':
        print_still(os.path.join(frames, 'end.png'), os.path.join(media, f'{name}-print-end.jpg'))
    if '--gif' in args:
        gdir = os.path.join(ROOT, 'qa', 'explainer-gifs'); os.makedirs(gdir, exist_ok=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', pat, '-vf',
                        'scale=iw/2:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=sierra2_4a',
                        '-loop', '0', os.path.join(gdir, f'{name}-{theme}.gif')], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    print(f'{name}-{theme}: {n} frames, {w}x{h}, mp4 {os.path.getsize(base + ".mp4") / 1e6:.2f} MB')
    return {'duration': dur, 'fade': fade, 'width': w // 2, 'height': h // 2, 'steps': [{'k': s['k'], 't0': s['t0'], 'cap': s['cap']} for s in steps]}

meta = None
for th in themes:
    m = run_theme(th); meta = meta or m
json.dump(meta, open(os.path.join(media, name + '.json'), 'w'), indent=1)
print('wrote', os.path.join('media', name + '.json'))
