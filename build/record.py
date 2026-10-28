#!/usr/bin/env python3
"""Record a scripted interaction on the built site as a GIF and an MP4, with a drawn cursor.

usage: python3 build/record.py <scenario|all> [--base http://localhost:8841] [--out qa/gifs]
                              [--width 1200] [--height 750] [--fps 10] [--gif-width 1000]

Each scenario is a start URL, a settle time and a list of steps: a JavaScript expression run in the page
(it may return a promise) and the seconds to keep recording after it. Frames are captured over the
DevTools protocol, then ffmpeg makes a palette GIF and an H.264 MP4 (LinkedIn plays MP4; Substack takes GIF).
Scenarios that need the 3D specimen run Chrome with software WebGL (SwiftShader).
"""
import base64, json, os, shutil, subprocess, sys, tempfile, time, urllib.request
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
if not args or args[0].startswith('--'):
    print(__doc__); sys.exit(1)
which = args[0]
def opt(name, default):
    return type(default)(args[args.index(name) + 1]) if name in args else default
BASE = opt('--base', 'http://localhost:8841'); OUT = opt('--out', 'qa/gifs')
W = opt('--width', 1200); H = opt('--height', 750); FPS = opt('--fps', 10); GIFW = opt('--gif-width', 1000)
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# a cursor drawn into the page, moved with a CSS transition so the motion shows in the frames
CURSOR = r"""
(function(){
  if (window.__cur) return 'cursor ready';
  var c = document.createElement('div'); c.id = '__cur';
  c.innerHTML = '<svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 L3 24 L9 18.5 L13 27 L17 25.2 L13 17 L21 17 Z" fill="#12161a" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  c.style.cssText = 'position:fixed;left:40px;top:40px;z-index:99999;pointer-events:none;transition:left .45s cubic-bezier(.22,1,.36,1),top .45s cubic-bezier(.22,1,.36,1);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))';
  document.body.appendChild(c);
  window.__cur = c;
  window.__moveTo = function (sel, dx, dy) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return Promise.resolve('no ' + sel);
    var r = el.getBoundingClientRect(); var x = r.left + r.width / 2 + (dx || 0), y = r.top + r.height / 2 + (dy || 0);
    c.style.left = (x - 3) + 'px'; c.style.top = (y - 2) + 'px';
    return new Promise(function (res) { setTimeout(function () { res('at ' + Math.round(x) + ',' + Math.round(y)); }, 480); });
  };
  window.__hover = function (sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return Promise.resolve('no ' + sel);
    return window.__moveTo(el).then(function () {
      ['pointerover', 'mouseover', 'pointerenter', 'mouseenter', 'mousemove'].forEach(function (t) { el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); });
      return 'hovered';
    });
  };
  window.__click = function (sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return Promise.resolve('no ' + sel);
    return window.__moveTo(el).then(function () {
      c.style.transform = 'scale(.85)'; setTimeout(function () { c.style.transform = ''; }, 140);
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach(function (t) { el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); });
      if (typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); return 'clicked';
    });
  };
  window.__type = function (sel, text, ms) {
    var el = document.querySelector(sel); if (!el) return Promise.resolve('no ' + sel);
    el.focus(); var i = 0;
    return new Promise(function (res) { (function next() { if (i > text.length) return res('typed ' + text); el.value = text.slice(0, i); el.dispatchEvent(new Event('input', { bubbles: true })); i++; setTimeout(next, ms || 140); })(); });
  };
  window.__scrollTo = function (y, ms) {
    var y0 = window.scrollY, t0 = performance.now(); ms = ms || 800;
    return new Promise(function (res) { (function step() { var p = Math.min(1, (performance.now() - t0) / ms); var e = 1 - Math.pow(1 - p, 3); window.scrollTo(0, y0 + (y - y0) * e); if (p < 1) requestAnimationFrame(step); else res('scrolled'); })(); });
  };
  return 'cursor ready';
})()
"""

SCENARIOS = {
  # the board: wind the year back and forward, then open a row
  'board': dict(url='/?theme=light#/controls', gl=False, settle=4, steps=[
    ("document.querySelector('.cf-mode[data-mode=\"subject\"]') && document.querySelector('.cf-mode[data-mode=\"subject\"]').click(); __scrollTo(document.querySelector('#cf-scrub') ? document.querySelector('#cf-scrub').getBoundingClientRect().top + window.scrollY - 120 : 0, 600)", 1.0),
    ("__click('.cf-year[data-y=\"2018\"]')", 1.2),
    ("__click('.cf-year[data-y=\"2020\"]')", 1.0),
    ("__click('.cf-year[data-y=\"2022\"]')", 1.0),
    ("__click('.cf-year[data-y=\"2023\"]')", 1.0),
    ("__click('.cf-year[data-y=\"2025\"]')", 1.0),
    ("__click('.cf-year[data-y=\"2026\"]')", 1.6),
    ("__click('#cf-b-ai-chips')", 2.6),
  ]),
  # the Index: type a term, get the entry and the passages
  'index': dict(url='/?theme=light#/glossary', gl=False, settle=3, steps=[
    ("__click('#gl-search')", 0.6),
    ("__type('#gl-search', 'FDPR', 170)", 2.2),
    ("__moveTo('.lk-men li:first-child a')", 1.6),
    ("__type('#gl-search', '', 60).then(function(){ return __type('#gl-search', 'Applied Materials', 90); })", 2.6),
    ("__moveTo('.lk-card .lk-facts')", 1.8),
  ]),
  # Suppliers: a country lights its ribbons, a stage filters the ladder
  'suppliers': dict(url='/?theme=light#/suppliers', gl=False, settle=5, steps=[
    ("__scrollTo(document.querySelector('#sup-pipe').getBoundingClientRect().top + window.scrollY - 90, 600)", 0.8),
    ("__hover('.sup-rib[data-c=\"NL\"]')", 1.6),
    ("__click('.sup-rib[data-c=\"NL\"]')", 2.0),
    ("__scrollTo(document.querySelector('#sup-ladder').getBoundingClientRect().top + window.scrollY - 90, 900)", 2.2),
    ("__scrollTo(document.querySelector('#sup-pipe').getBoundingClientRect().top + window.scrollY - 90, 700).then(function(){ return __click('#sup-allstages'); })", 1.2),
  ]),
  # the home page: the route, a stop's tooltip, a country's leverage panel
  'home': dict(url='/?theme=light#/', gl=False, settle=5, steps=[
    ("__scrollTo(document.querySelector('.sa-map, .sa-route, .sa-strip').getBoundingClientRect().top + window.scrollY - 150, 700)", 0.8),
    ("__hover('.sa-stop[data-cc=\"NL\"]')", 1.8),
    ("__hover('.sa-stop[data-cc=\"TW\"]')", 1.8),
    ("__scrollTo(document.querySelector('.sa-role[data-cc=\"TW\"]').getBoundingClientRect().top + window.scrollY - 160, 800)", 0.8),
    ("__click('.sa-role[data-cc=\"TW\"]')", 2.2),
    ("__click('.sa-role[data-cc=\"NL\"]')", 2.2),
  ]),
  # AI Chips: pick three chips and compare them (needs the 3D package drawings, so software WebGL)
  'chips': dict(url='/?theme=light#/landscape', gl=True, settle=6, steps=[
    ("__click('button[data-id=\"nvidia-b200\"], [data-id=\"nvidia-b200\"] input, [data-id=\"nvidia-b200\"]')", 1.4),
    ("__click('button[data-id=\"nvidia-h100\"], [data-id=\"nvidia-h100\"] input, [data-id=\"nvidia-h100\"]')", 1.4),
    ("__click('button[data-id=\"amd-mi355x\"], [data-id=\"amd-mi355x\"] input, [data-id=\"amd-mi355x\"]')", 1.6),
    ("__scrollTo(document.querySelector('#cx-table, .cx-table, table').getBoundingClientRect().top + window.scrollY - 100, 900)", 2.4),
  ]),
  # The Chain: read down a chapter while the specimen turns beside it (software WebGL)
  'chain': dict(url='/lithography/?only=lithography&theme=light', gl=True, settle=7, steps=[
    ("location.hash = '#lithography'; new Promise(function(r){ setTimeout(r, 1500); })", 1.5),
    ("__scrollTo(window.scrollY + 900, 3000)", 0.3),
    ("__scrollTo(window.scrollY + 900, 3000)", 0.3),
    ("__scrollTo(window.scrollY + 900, 3000)", 1.0),
  ]),
}

def record(name, sc):
    global W, H
    W0, H0 = W, H
    if sc['gl']: W, H = (880, 550) if name == 'chain' else (1000, 625)
    port = 9400 + (abs(hash(name)) % 200)
    profile = tempfile.mkdtemp(prefix='cp-rec-')
    flags = [CHROME, '--headless=new', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', f'--window-size={W},{H}',
             f'--remote-debugging-port={port}', f'--user-data-dir={profile}', '--force-device-scale-factor=1']
    flags += ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] if sc['gl'] else ['--disable-gpu']
    flags.append('about:blank')
    proc = subprocess.Popen(flags, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    frames = tempfile.mkdtemp(prefix=f'cp-frames-{name}-')
    try:
        ws_url = None
        for _ in range(60):
            try:
                targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json'))
                page = [t for t in targets if t.get('type') == 'page']
                if page: ws_url = page[0]['webSocketDebuggerUrl']; break
            except Exception: pass
            time.sleep(0.25)
        if not ws_url: raise SystemExit('Chrome did not start')
        ws = websocket.create_connection(ws_url, suppress_origin=True); ws.settimeout(60); mid = [0]
        def send(method, params=None):
            mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
            while True:
                m = json.loads(ws.recv())
                if m.get('id') == mid[0]: return m.get('result', {})
        send('Page.enable'); send('Runtime.enable')
        send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 1, 'mobile': False})
        send('Page.navigate', {'url': BASE + sc['url']})
        time.sleep(sc['settle'])
        send('Runtime.evaluate', {'expression': CURSOR, 'returnByValue': True})
        n = [0]; stamps = []
        def capture(seconds):
            t_end = time.time() + seconds
            while time.time() < t_end:
                t0 = time.time(); stamps.append(t0)
                r = send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 88})
                with open(os.path.join(frames, f'f{n[0]:05d}.jpg'), 'wb') as f: f.write(base64.b64decode(r['data']))
                n[0] += 1
                time.sleep(max(0, 1.0 / FPS - (time.time() - t0)))
        capture(0.8)
        for js, hold in sc['steps']:
            r = send('Runtime.evaluate', {'expression': js, 'awaitPromise': True, 'returnByValue': True})
            v = r.get('result', {}).get('value'); ex = r.get('exceptionDetails')
            print(f'  step: {str(v)[:60] if v is not None else ""}{" EXC " + json.dumps(ex)[:160] if ex else ""}')
            capture(hold)
        ws.close()
    finally:
        proc.terminate()
        try: proc.wait(timeout=5)
        except Exception: proc.kill()
        shutil.rmtree(profile, ignore_errors=True)
    os.makedirs(OUT, exist_ok=True)
    gif = os.path.join(OUT, f'{name}.gif'); mp4 = os.path.join(OUT, f'{name}.mp4')
    rate = FPS if len(stamps) < 2 else max(2, min(FPS, round((len(stamps) - 1) / (stamps[-1] - stamps[0]))))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(rate), '-i', os.path.join(frames, 'f%05d.jpg'),
                    '-vf', f'fps={rate},scale={GIFW}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle',
                    gif], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(rate), '-i', os.path.join(frames, 'f%05d.jpg'),
                    '-vf', f'scale={W}:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', mp4], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    W, H = W0, H0
    print(f'{name}: {n[0]} frames at {rate} fps · {os.path.getsize(gif)//1024} KB gif · {os.path.getsize(mp4)//1024} KB mp4')

names = list(SCENARIOS) if which == 'all' else [which]
for nm in names:
    if nm not in SCENARIOS: raise SystemExit(f'no scenario {nm}; have {", ".join(SCENARIOS)}')
    print(f'recording {nm}…'); record(nm, SCENARIOS[nm])
