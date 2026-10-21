#!/usr/bin/env python3
"""Load a page (phone, CPU x4, no network throttling), then run measurement snippets in it.
usage: probe.py <port> <url> [--variant file.html] [--desktop]"""
import json, sys, time, os, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser, Session
args = sys.argv[1:]; port, url = int(args[0]), args[1]
variant = args[args.index('--variant') + 1] if '--variant' in args else None
desktop = '--desktop' in args
if not url.startswith('http://127.0.0.1:8765/'): sys.exit('probe.py measures the local server only')
b = Browser(port)
try:
    s = Session(b.page_ws())
    vbody = base64.b64encode(open(variant, 'rb').read()).decode() if variant else None
    def paused(p):
        u = p['request']['url']; rid = p['requestId']
        if 'fonts.googleapis.com' in u:
            s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/css'}], 'body': ''})
        elif vbody and '?v=variant' in u:
            s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/html; charset=utf-8'}], 'body': vbody})
        else:
            s.send_nowait('Fetch.failRequest', {'requestId': rid, 'errorReason': 'BlockedByClient'})
    s.on('Fetch.requestPaused', paused)
    s.send('Page.enable'); s.send('Runtime.enable')
    s.send('Fetch.enable', {'patterns': [{'urlPattern': '*fonts.googleapis.com*'}, {'urlPattern': '*gc.zgo.at*'}] + ([{'urlPattern': '*?v=variant*'}] if variant else [])})
    if desktop:
        s.send('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
    else:
        s.send('Emulation.setDeviceMetricsOverride', {'width': 412, 'height': 823, 'deviceScaleFactor': 1.75, 'mobile': True})
        s.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
    target = url.replace('http://127.0.0.1:8765/', 'http://127.0.0.1:8765/?v=variant', 1) if variant else url
    s.send('Page.navigate', {'url': target}); time.sleep(6)
    s.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    snippets = {
      'fonts_in_first_screen': """(function(){ var seen={}, all={}; var w=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          var vh=innerHeight, n; while((n=w.nextNode())){ if(!n.nodeValue.trim()) continue; var el=n.parentElement; if(!el||el.closest('[hidden]')) continue; var cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
            var r=el.getBoundingClientRect(); if(!r.width) continue; var fam=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(); var k=fam+' '+cs.fontWeight+(cs.fontStyle==='italic'?' italic':'');
            all[k]=(all[k]||0)+1; if(r.top<vh && r.bottom>0) seen[k]=(seen[k]||0)+1; } return {firstScreen:seen, wholeView:all}; })()""",
      # style recalc cost of the attribute Sections.update() sets on every scroll (.to-top data-show feeds body:has(...))
      'has_toggle_ms': """(function(){ var t=document.querySelector('.to-top'), s=document.querySelector('.stage-top')||document.body; var N=20, t0=performance.now();
          for(var i=0;i<N;i++){ t.setAttribute('data-show', i%2?'1':'0'); getComputedStyle(s).display; } return Math.round((performance.now()-t0)/N*100)/100; })()""",
      # the same attribute set to the value it already has, as every scroll event does
      'has_same_value_ms': """(function(){ var t=document.querySelector('.to-top'), s=document.querySelector('.stage-top')||document.body; var v=t.getAttribute('data-show'); var N=20, t0=performance.now();
          for(var i=0;i<N;i++){ t.setAttribute('data-show', v); getComputedStyle(s).display; } return Math.round((performance.now()-t0)/N*100)/100; })()""",
      # an unrelated DOM change in the visible view (a caption text), forced to style
      'unrelated_mutation_ms': """(function(){ var p=document.querySelector('.view:not([hidden]) p'); if(!p) return null; var N=20, t0=performance.now();
          for(var i=0;i<N;i++){ p.classList.toggle('x-probe'); getComputedStyle(p).color; } return Math.round((performance.now()-t0)/N*100)/100; })()""",
      'sections_update_ms': """(function(){ if(!window.CP||!CP.Sections) return null; document.body.offsetTop; var N=20, t0=performance.now(); for(var i=0;i<N;i++){ CP.Sections.update(); } return Math.round((performance.now()-t0)/N*100)/100; })()""",
      'forced_layout_ms': """(function(){ var N=5, out=[]; for(var i=0;i<N;i++){ document.body.style.setProperty('--probe', String(i)); document.documentElement.classList.toggle('x-probe2'); var t0=performance.now(); document.body.offsetHeight; out.push(performance.now()-t0);} out.sort(function(a,b){return a-b}); return Math.round(out[2]*10)/10; })()""",
      'search_first_ms': "(function(){ if(!window.CP||!CP.Tools) return null; var t0=performance.now(); var r=CP.Tools.search('euv'); var t1=performance.now(); CP.Tools.search('hbm'); var t2=performance.now(); return {first: Math.round(t1-t0), second: Math.round(t2-t1), entries: CP.Tools.index.length}; })()",
      'routes_ms': """(async function(){ var out={}; var views=['#/landscape','#/suppliers','#/controls','#/exposure','#/glossary','#/chain','#/']; for (var i=0;i<views.length;i++){ var t0=performance.now(); location.hash=views[i];
          await new Promise(function(r){ requestAnimationFrame(function(){ setTimeout(r,0); }); }); out[views[i]]=Math.round(performance.now()-t0); await new Promise(function(r){ setTimeout(r,400); }); } return out; })()""",
      'dom': "document.getElementsByTagName('*').length",
      'visible_nodes': "(function(){ var v=document.querySelector('.view:not([hidden])'); return v ? v.getElementsByTagName('*').length : 0; })()",
      'docH': 'document.documentElement.scrollHeight',
    }
    out = {}
    for k, js in snippets.items():
        try: out[k] = s.eval(js)
        except Exception as e: out[k] = 'ERR ' + str(e)[:200]
    s.send('Emulation.setCPUThrottlingRate', {'rate': 1})
    print(json.dumps(out, indent=1))
finally:
    b.close()
