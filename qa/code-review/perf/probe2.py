#!/usr/bin/env python3
"""Cost of each part of dist/index.html on the main thread at CPU x4, phone metrics:
   1. parse + DOM build of each markup part (createContextualFragment, median of 5), JSON.parse of CP_DATA, compile of the scripts;
   2. the layout when The Chain is revealed: as shipped, with content-visibility on chapters, with only two chapters (fresh page each)."""
import json, sys, time, os, re, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser, Session
port = int(sys.argv[1])
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'dist', 'index.html')  # the repository's dist/, found from this file's place in qa/code-review/perf/
h = open(DIST, encoding='utf-8').read()
body = h[h.index('<body>') + 6: h.index('<script>', h.index('</main>'))]
def view(v):
    m = re.search(r'<section class="view[^"]*" data-view="%s"[^>]*>' % v, body); depth = 0
    for t in re.finditer(r'<(/?)section\b[^>]*>', body[m.start():]):
        depth += -1 if t.group(1) else 1
        if depth == 0: return body[m.start(): m.start() + t.end()]
parts = {'whole body (all views)': body}
for v in ['stack', 'walk', 'glossary', 'controls', 'suppliers']: parts['view: ' + v] = view(v)
g = view('glossary')
parts['glossary LOOKUP_LIST'] = re.search(r'<ul id="lk-items"[^>]*>[\s\S]*?</ul>', g).group(0)
parts['glossary GLOSSARY dl'] = re.search(r'<dl class="glossary" id="glossary">[\s\S]*?</dl>', g).group(0)
cites = re.findall(r'<sup class="cite">[\s\S]*?</sup>', view('stack'))
parts['1,514 cite marks as shipped'] = ''.join(cites)
parts['1,514 cite marks slimmed'] = ''.join(re.sub(r' (data-t|data-p|data-d|aria-label)="[^"]*"', '', c) for c in cites)
data_js = re.search(r'<script>window\.CP_DATA = ([\s\S]*?);</script>', h).group(1)
tail = h[h.index('<script>', h.index('</main>')):]
scripts = re.findall(r'<script>([\s\S]*?)</script>', tail)
spec = '\n'.join(s for s in scripts[1:] if s.startswith('</script>') or '/* ' in s[:40] and '.js */' in s[:60])
app = next(s for s in scripts if 'CHIP SUPPLY CHAIN runtime' in s[:200])

b = Browser(port)
def page():
    s = Session(b.page_ws()); s.send('Page.enable'); s.send('Runtime.enable')
    s.send('Emulation.setDeviceMetricsOverride', {'width': 412, 'height': 823, 'deviceScaleFactor': 1.75, 'mobile': True})
    return s
try:
    s = page()
    s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/robots.txt'}); time.sleep(1)
    s.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    s.eval('window.__parts = {}')
    for k, v in parts.items():
        s.send('Runtime.evaluate', {'expression': 'window.__parts[%s] = %s' % (json.dumps(k), json.dumps(v))})
    s.send('Runtime.evaluate', {'expression': 'window.__data = %s; window.__spec = %s; window.__app = %s' % (json.dumps(data_js), json.dumps(spec), json.dumps(app))})
    res = s.eval("""(function(){ var out={}, r=document.createRange(); r.selectNode(document.body);
      function med(f){ var a=[]; for(var i=0;i<5;i++){ var t0=performance.now(); f(); a.push(performance.now()-t0);} a.sort(function(x,y){return x-y}); return Math.round(a[2]*10)/10; }
      Object.keys(window.__parts).forEach(function(k){ var html=window.__parts[k]; var n=0; out[k]={ms: med(function(){ var f=r.createContextualFragment(html); n=f.querySelectorAll('*').length; }), elements:n, kb: Math.round(html.length/1024)}; });
      out['JSON.parse CP_DATA'] = {ms: med(function(){ JSON.parse(window.__data); }), kb: Math.round(window.__data.length/1024)};
      out['compile specimens (new Function)'] = {ms: med(function(){ new Function(window.__spec); }), kb: Math.round(window.__spec.length/1024)};
      out['compile app.js + modules (new Function)'] = {ms: med(function(){ new Function(window.__app); }), kb: Math.round(window.__app.length/1024)};
      return out; })()""")
    s.send('Emulation.setCPUThrottlingRate', {'rate': 1}); s.close()
    print(json.dumps(res, indent=1))
    # reveal layout of The Chain, from the home page, in fresh pages
    css = {'as shipped': '', 'content-visibility on chapters': 'section.view[data-view="stack"] article.chapter{content-visibility:auto;contain-intrinsic-size:auto 9000px}',
           'only chapters 1-2 in the DOM': None}
    out = {}
    for name, rule in css.items():
        vals = []
        for rep in range(4):
            s = page()
            s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/?r=%d%d#/' % (rep, len(name))}); time.sleep(5)
            if rule: s.eval('(function(){var st=document.createElement("style");st.textContent=%s;document.head.appendChild(st);})()' % json.dumps(rule))
            if rule is None: s.eval('[].slice.call(document.querySelectorAll(\'section.view[data-view="stack"] article.chapter\')).slice(2).forEach(function(a){a.remove();})')
            s.eval('document.body.offsetHeight')
            s.send('Emulation.setCPUThrottlingRate', {'rate': 4})
            v = s.eval("""(function(){ var st=document.querySelector('section.view[data-view="stack"]'), w=document.querySelector('section.view[data-view="walk"]'); var t0=performance.now(); w.hidden=true; st.hidden=false; document.body.offsetHeight; var t1=performance.now(); return [Math.round(t1-t0), document.documentElement.scrollHeight]; })()""")
            s.send('Emulation.setCPUThrottlingRate', {'rate': 1}); s.close()
            vals.append(v)
        out[name] = vals
    print(json.dumps(out))
finally:
    b.close()
