#!/usr/bin/env python3
"""Does content-visibility clip or change anything in a chapter? (speed fix, 21 to 23 Oct 2026). Local server only.
usage: cv_diff.py <outdir> [--port 10313] [--width 1440]
Loads #/chain with reduced motion, then steps through every chapter one window at a time. At each step it captures the
text column as shipped (content-visibility: auto, which also contains the chapter's paint), then again with the chapters
on screen set to content-visibility: visible (.cv-open, no containment), and compares the two. Any step that differs is
saved as a before/after pair."""
import sys, os, json, time, base64, io
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', '..', 'perf'))
from cdp import Browser, Session
from PIL import Image, ImageChops
args = sys.argv[1:]; out = args.pop(0); os.makedirs(out, exist_ok=True)
port = int(args[args.index('--port') + 1]) if '--port' in args else 10313
W = int(args[args.index('--width') + 1]) if '--width' in args else 1440
mob = W < 900; H = 844 if mob else 900
b = Browser(port)
try:
    s = Session(b.page_ws()); s.send('Page.enable'); s.send('Runtime.enable')
    s.send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 1, 'mobile': mob})
    s.send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
    s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/#/chain'}); time.sleep(9)
    geo = s.eval("""(function(){var col=document.querySelector('.view[data-view=stack]').getBoundingClientRect();var mh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||56;
      return {x:0,w:Math.round(%s),top:Math.ceil(mh)+2,bottom:%d,chapters:[].slice.call(document.querySelectorAll('article.chapter')).map(function(c){var r=c.getBoundingClientRect();return [c.id,Math.round(r.top+pageYOffset),Math.round(r.height)];})};})()""" % ('window.innerWidth' if mob else 'col.right', H - (140 if mob else 0)), False)
    clip = {'x': 0, 'y': geo['top'], 'width': geo['w'], 'height': geo['bottom'] - geo['top'], 'scale': 1}
    step = clip['height'] - 40
    diffs, steps = [], 0
    def cap():
        d = s.send('Page.captureScreenshot', {'format': 'png', 'clip': clip}); return Image.open(io.BytesIO(base64.b64decode(d['data']))).convert('RGB')
    for cid, top, hgt in geo['chapters']:
        y = top - geo['top']
        while y < top + hgt:
            s.eval("(function(y){var r=document.documentElement,sb=r.style.scrollBehavior;r.style.scrollBehavior='auto';window.scrollTo(0,y);r.style.scrollBehavior=sb;})(%d)" % y, False)
            time.sleep(0.35)
            a = cap()
            s.eval("(function(){[].slice.call(document.querySelectorAll('article.chapter')).forEach(function(c){var r=c.getBoundingClientRect();if(r.bottom>-50&&r.top<innerHeight+50)c.classList.add('cv-diff','cv-open');});})()", False)
            time.sleep(0.25)
            bb = cap()
            s.eval("(function(){[].slice.call(document.querySelectorAll('article.chapter.cv-diff')).forEach(function(c){c.classList.remove('cv-diff','cv-open');});})()", False)
            steps += 1
            box = ImageChops.difference(a, bb).getbbox()
            if box:
                n = f'{W}-{cid}-{y}'
                a.save(os.path.join(out, n + '-auto.png')); bb.save(os.path.join(out, n + '-visible.png'))
                diffs.append({'chapter': cid, 'y': y, 'box': box})
                print('DIFF', cid, y, box, flush=True)
            y += step
    json.dump({'width': W, 'steps': steps, 'diffs': diffs}, open(os.path.join(out, f'cv-diff-{W}.json'), 'w'), indent=1)
    print(f'{W}: {steps} screens compared, {len(diffs)} differ')
finally:
    b.close()
