#!/usr/bin/env python3
"""Before and after shots of the readers fixes: <label>-<scene>.png in this folder.
  python3 qa/code-review/fixes/readers/shots.py after
  python3 qa/code-review/fixes/readers/shots.py before <saved index.html>"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Page

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'http://127.0.0.1:8765/'
label = sys.argv[1]
stand_in = sys.argv[2] if label == 'before' else None
SL = "const sl=ms=>new Promise(r=>setTimeout(r,ms));"


def run(scene, url, js, wait=6, keys=(), **kw):
    if kw.get('mobile'): kw.setdefault('width', 390); kw.setdefault('height', 844)
    p = Page(10329, stand_in=stand_in, **kw)
    try:
        p.go(BASE + url, wait)
        if js: print(scene, p.ev(SL + js))
        for k in keys: p.key(k)
        p.pump(0.5)
        p.shot(os.path.join(HERE, f'{label}-{scene}.png'))
    finally:
        if p.errors: print(scene, 'errors', p.errors)
        p.close()


# the board on 11 Nov 2026, By subject: the two stays that ended on 9 and 10 Nov
run('board-11nov', '#/controls', "(async()=>{document.querySelector('.cf-mode[data-mode=\"subject\"]').click();await sl(500);document.getElementById('cf-scrub').scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-90);await sl(300);return document.getElementById('cf-asof').textContent})()", fake_date='2026-11-11T12:00:00')
# Look it up from a chapter: the popover and the landing in the Glossary
for mob in (False, True):
    run('lookitup-' + ('phone' if mob else 'desktop'), '#lithography', "(async()=>{const b=document.querySelector('#lithography .prose button.gl-term');b.scrollIntoView({block:'center',behavior:'instant'});await sl(200);b.click();await sl(300);document.querySelector('#gl-tip a').click();await sl(1400);return [scrollY,document.getElementById('gl-tip').hidden]})()", wait=7, mobile=mob)
# a Where it appears passage link, 1.6 s after the click
run('passage', '', "(async()=>{location.hash='#/glossary';await sl(800);let a=null;for(const x of document.querySelectorAll('#lk-items li[data-kind=\"term\"]')){CP.Lookup.select(x.id,true);await sl(20);for(const c of document.querySelectorAll('#lk-mentions a[data-para]')){const q=CP.Lookup.paras[+c.dataset.para];if(q&&q.el.closest('.prose')&&[...document.getElementById(q.chapter).querySelectorAll('.prose > p')].indexOf(q.el)>25){a=c;break;}}if(a)break;}a.click();await sl(1600);return location.hash})()")
# Japan's firms after ASML's link set a search
run('japan', '', "(async()=>{location.hash='#/glossary';await sl(700);CP.Lookup.select('lk-firm-asml',true);await sl(100);document.querySelector('#lk-card a[data-sup]').click();await sl(900);location.hash='#/glossary';await sl(700);CP.Lookup.select('lk-country-jp',true);await sl(100);document.querySelector('#lk-card a[data-supcc]').click();await sl(900);document.getElementById('sup-toolbar').scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-160);await sl(200);return document.getElementById('sup-count').textContent})()")
# Tab from a glossary term
run('popover-tab', '#lithography', "(async()=>{const b=document.querySelector('#lithography .prose button.gl-term');b.scrollIntoView({block:'center',behavior:'instant'});await sl(200);b.focus();await sl(200);return 1})()", wait=7, keys=('Tab',))
