#!/usr/bin/env python3
"""The readers pages at 1440, 1024, 390 and 320, light and dark: console errors, sideways scroll, and the state each fix
leaves on screen. Writes sweep.json and a few shots (sweep-<route>-<width>-<theme>.jpg).
  python3 qa/code-review/fixes/readers/sweep.py"""
import base64, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Page

HERE = os.path.dirname(os.path.abspath(__file__))
ROUTES = [
    ('controls', '#/controls', "document.querySelector('.cf-mode[data-mode=\"subject\"]').click();document.querySelector('.cf-year[data-y=\"2022\"]').click();"),
    ('glossary', '#/glossary', "document.getElementById('gl-search').focus();"),
    ('entry', '#gl-hbm', ''),
    ('country', '#lk-country-jp', ''),
    ('suppliers', '#/suppliers', ''),
    ('ribbons', '#/suppliers?tab=country', "document.getElementById('sup-pipe').scrollIntoView({block:'center',behavior:'instant'});"),
    ('exposure', '#/exposure', ''),
    ('chapter', '#lithography', "(()=>{const b=document.querySelector('#lithography .prose button.gl-term');b.scrollIntoView({block:'center',behavior:'instant'});b.focus();})()"),
]
SIZES = [(1440, 900, False), (1024, 768, False), (390, 844, True), (320, 640, True)]
SHOOT = {(1440, 'light'), (390, 'dark'), (320, 'light')}

out, port = {}, 10330
for w, h, mob in SIZES:
    for theme in ('light', 'dark'):
        port = port + 1 if port < 10339 else 10330
        p = Page(port, width=w, height=h, mobile=mob)
        try:
            for name, route, act in ROUTES:
                p.go('http://127.0.0.1:8765/?theme=' + theme + route, 5.5)
                if act: p.ev(act); p.pump(0.6)
                if name == 'chapter': p.key('Tab'); p.pump(0.3)  # into the popover's link
                r = p.ev("""(()=>({sideways:document.documentElement.scrollWidth-innerWidth,theme:document.documentElement.getAttribute('data-theme')||'light',
                    active:(document.activeElement.className||document.activeElement.tagName).toString().slice(0,40),
                    supCount:(document.getElementById('sup-count')||{}).textContent||'',asOf:(document.getElementById('cf-asof')||{}).textContent||'',
                    status:(document.getElementById('cf-status')||{}).textContent||'',lkCount:(document.getElementById('lk-count')||{}).textContent||''}))()""")
                key = f'{name} {w} {theme}'
                out[key] = r
                if (w, theme) in SHOOT:
                    s = p.send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 62})
                    open(os.path.join(HERE, f'sweep-{name}-{w}-{theme}.jpg'), 'wb').write(base64.b64decode(s['data']))
        finally:
            out[f'errors {w} {theme}'] = p.errors
            p.close()
        print(w, theme, 'errors:', len(out[f'errors {w} {theme}']), 'sideways:', [k for k, v in out.items() if isinstance(v, dict) and v.get('sideways', 0) > 0 and k.endswith(f'{w} {theme}')])
json.dump(out, open(os.path.join(HERE, 'sweep.json'), 'w'), indent=1)
bad = [k for k, v in out.items() if (k.startswith('errors') and v) or (isinstance(v, dict) and v.get('sideways', 0) > 0)]
print('problems:', bad or 'none')
