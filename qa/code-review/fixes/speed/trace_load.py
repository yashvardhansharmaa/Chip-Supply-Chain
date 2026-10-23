#!/usr/bin/env python3
"""Frame-by-frame trace of a throttled cold load (speed fix, 21 Oct 2026): scroll, the anchor's top, document height,
boot, chapters held open, and each layout shift as it happens. usage: trace_load.py <hash> [--port 10310] [--desktop]"""
import sys, os, json, time, gzip, base64, threading
HERE = os.path.dirname(os.path.abspath(__file__)); PERF = os.path.join(HERE, '..', '..', 'perf'); sys.path.insert(0, PERF)
from cdp import Browser, Session
args = sys.argv[1:]; hsh = args[0]
port = int(args[args.index('--port') + 1]) if '--port' in args else 10310
desktop = '--desktop' in args
raw = open(os.path.join(HERE, '..', '..', '..', '..', 'dist', 'index.html'), 'rb').read(); ratio = len(raw) / len(gzip.compress(raw, 9))
OBS = open(os.path.join(PERF, 'observe.js')).read()
POLL = """(function(){var r=document.documentElement,t=null;try{t=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch(e){}
 var cs=[].slice.call(document.querySelectorAll('article.chapter')),P=window.__perf||{ls:[]};
 return {t:Math.round(performance.now()),b:r.classList.contains('booted')?1:0,y:Math.round(pageYOffset),top:t?Math.round(t.getBoundingClientRect().top):null,h:r.scrollHeight,
  open:cs.filter(function(c){return c.classList.contains('cv-open');}).map(function(c){return c.id.slice(0,8);}),sized:cs.filter(function(c){return c._sized;}).length,n:cs.length,
  ls:P.ls.map(function(e){return [Math.round(e.t),Math.round(e.v*10000)/10000,(e.src[0]||{}).n];})};})()"""
b = Browser(port)
try:
    s = Session(b.page_ws())
    def paused(p):
        u = p['request']['url']; rid = p['requestId']
        if 'fonts.googleapis.com' in u:
            def later(): time.sleep(0.6); s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/css'}], 'body': base64.b64encode(b'/* */').decode()})
            threading.Thread(target=later, daemon=True).start()
        elif '127.0.0.1' in u: s.send_nowait('Fetch.continueRequest', {'requestId': rid})
        else: s.send_nowait('Fetch.failRequest', {'requestId': rid, 'errorReason': 'BlockedByClient'})
    s.on('Fetch.requestPaused', paused)
    s.send('Page.enable'); s.send('Network.enable'); s.send('Runtime.enable'); s.send('Network.setCacheDisabled', {'cacheDisabled': True})
    s.send('Fetch.enable', {'patterns': [{'urlPattern': '*fonts.googleapis.com*'}, {'urlPattern': '*gc.zgo.at*'}, {'urlPattern': '*fonts.gstatic.com*'}]})
    if desktop: s.send('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
    else: s.send('Emulation.setDeviceMetricsOverride', {'width': 412, 'height': 823, 'deviceScaleFactor': 1.75, 'mobile': True}); s.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
    s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/robots.txt'}); time.sleep(1.0)
    s.send('Page.addScriptToEvaluateOnNewDocument', {'source': OBS})
    base = {'latency': 150, 'uploadThroughput': 93750}
    s.send('Network.emulateNetworkConditionsByRule', {'matchedNetworkConditions': [dict(base, urlPattern='http://127.0.0.1:8765/', downloadThroughput=200000 * ratio), dict(base, urlPattern='', downloadThroughput=200000)]})
    if not desktop: s.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/' + hsh})
    last = None; t0 = time.time(); seen = 0
    while time.time() - t0 < 13:
        try: p = s.eval(POLL, False)
        except Exception: p = None
        if p:
            key = (p['b'], p['y'], p['top'], p['h'], tuple(p['open']), p['sized'], len(p['ls']))
            if key != last:
                new = p['ls'][seen:]; seen = len(p['ls'])
                print(f"{p['t']:6d} boot={p['b']} y={p['y']:7d} top={p['top']} docH={p['h']} open={p['open']} sized={p['sized']}/{p['n']} shifts+={new}", flush=True)
                last = key
        time.sleep(0.04)
finally:
    b.close()
