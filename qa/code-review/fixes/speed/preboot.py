#!/usr/bin/env python3
"""What paints before boot (speed fix, 21 Oct 2026). For each address, a cold load over Slow 4G (each HTML document at its
gzip-equivalent rate, as qa/code-review/perf/measure.py does) on the perf harness's phone (CPU x4) or a desktop, polling
every 100 ms which views are displayed, whether boot has run, the stage strip, and the scroll position; then the layout
shifts (with their sources), LCP and console errors.
usage: preboot.py <out.json> [--port 10308] [--desktop] <hash> [<hash> ...]     (local server only)"""
import sys, os, json, time, gzip, base64, threading
HERE = os.path.dirname(os.path.abspath(__file__))
PERF = os.path.join(HERE, '..', '..', 'perf')
sys.path.insert(0, PERF)
from cdp import Browser, Session
args = sys.argv[1:]; out = args.pop(0)
port = 10308
if '--port' in args: i = args.index('--port'); port = int(args[i + 1]); del args[i:i + 2]
desktop = '--desktop' in args; args = [a for a in args if a != '--debug']
hashes = [a for a in args if not a.startswith('--')]
DIST = os.path.join(HERE, '..', '..', '..', '..', 'dist')
raw = open(os.path.join(DIST, 'index.html'), 'rb').read(); ratio = len(raw) / len(gzip.compress(raw, 9))
OBS = open(os.path.join(PERF, 'observe.js')).read()
POLL = """(function(){var r=document.documentElement,st=document.querySelector('.stage');
 var vis=[].slice.call(document.querySelectorAll('main > .view')).filter(function(v){return getComputedStyle(v).display!=='none';}).map(function(v){return v.getAttribute('data-view');});
 var sub=[].slice.call(document.querySelectorAll('.view[data-view=controls] .sub, .view[data-view=suppliers] .sup-tab')).filter(function(v){return getComputedStyle(v).display!=='none';}).map(function(v){return v.getAttribute('data-sub')||v.getAttribute('data-tab');});
 return {t:Math.round(performance.now()),booted:r.classList.contains('booted'),route:r.getAttribute('data-route'),vis:vis,sub:sub,stage:st?st.getAttribute('data-hidden'):'-',y:Math.round(pageYOffset),n:document.getElementsByTagName('*').length};})()"""
res = {}
b = Browser(port)
try:
    for hsh in hashes:
        s = Session(b.page_ws())
        logs = []
        s.on('Runtime.consoleAPICalled', lambda p: logs.append([p['type'], ' '.join(str(a.get('value', a.get('description', ''))) for a in p['args'])[:300]]))
        s.on('Runtime.exceptionThrown', lambda p: logs.append(['exception', json.dumps(p['exceptionDetails'])[:300]]))
        def paused(p, s=s):
            u = p['request']['url']; rid = p['requestId']
            if 'fonts.googleapis.com' in u:
                def later():
                    time.sleep(0.6); s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/css'}], 'body': base64.b64encode(b'/* */').decode()})
                threading.Thread(target=later, daemon=True).start()
            elif '127.0.0.1' in u: s.send_nowait('Fetch.continueRequest', {'requestId': rid})
            else: s.send_nowait('Fetch.failRequest', {'requestId': rid, 'errorReason': 'BlockedByClient'})
        s.on('Fetch.requestPaused', paused)
        s.send('Page.enable'); s.send('Network.enable'); s.send('Runtime.enable')
        s.send('Network.setCacheDisabled', {'cacheDisabled': True})
        s.send('Fetch.enable', {'patterns': [{'urlPattern': '*fonts.googleapis.com*'}, {'urlPattern': '*gc.zgo.at*'}, {'urlPattern': '*fonts.gstatic.com*'}]})
        if desktop: s.send('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
        else:
            s.send('Emulation.setDeviceMetricsOverride', {'width': 412, 'height': 823, 'deviceScaleFactor': 1.75, 'mobile': True})
            s.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
        s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/robots.txt'}); time.sleep(1.0)
        s.send('Page.addScriptToEvaluateOnNewDocument', {'source': OBS})
        base = {'latency': 150, 'uploadThroughput': 93750}
        rules = [dict(base, urlPattern='http://127.0.0.1:8765/', downloadThroughput=200000 * ratio), dict(base, urlPattern='', downloadThroughput=200000)]
        s.send('Network.emulateNetworkConditionsByRule', {'matchedNetworkConditions': rules})
        if not desktop: s.send('Emulation.setCPUThrottlingRate', {'rate': 4})
        s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/' + hsh})
        polls = []; t0 = time.time()
        while time.time() - t0 < 14:
            try: polls.append(s.eval(POLL, False))
            except Exception as e: pass
            if polls and polls[-1] and polls[-1]['booted'] and len([p for p in polls if p and p['booted']]) > 25: break
            time.sleep(0.1)
        time.sleep(2)
        print([ (p["t"], p["booted"], p["vis"], p["y"], p["n"]) for p in polls if p][::4][:40]) if "--debug" in sys.argv else None
        perf = s.eval('(function(){var P=window.__perf;return {ls:P.ls,lcp:P.lcp.slice(-1)[0]||null,fcp:(P.paint.filter(function(p){return p[0]=="first-contentful-paint"})[0]||[])[1],cur:window.CP&&CP.Router?CP.Router.current:null,y:Math.round(pageYOffset)};})()', False)
        pre = [p for p in polls if p and not p['booted'] and p['n'] > 200]
        res[hsh] = {'preboot_views': sorted({','.join(p['vis']) for p in pre}), 'preboot_subs': sorted({','.join(p['sub']) for p in pre}), 'preboot_stage': sorted({str(p['stage']) for p in pre}),
                    'postboot_views': sorted({','.join(p['vis']) for p in polls if p and p['booted']}), 'router': perf['cur'], 'first_poll_with_view': next((p['t'] for p in pre if p['vis']), None),
                    'boot_at': next((p['t'] for p in polls if p and p['booted']), None), 'fcp': perf['fcp'], 'lcp': perf['lcp'], 'cls': round(sum(e['v'] for e in perf['ls'] if not e['input']), 4),
                    'shifts': [e for e in perf['ls'] if e['v'] > 0.0005][:6], 'console': [l for l in logs if l[0] in ('error', 'warning', 'exception')]}
        r = res[hsh]
        print(f"{hsh:32s} pre {r['preboot_views']} sub {r['preboot_subs']} stage {r['preboot_stage']} | post {r['postboot_views']} router {r['router']} | view@{r['first_poll_with_view']} boot@{r['boot_at']} lcp {round(r['lcp']['t']) if r['lcp'] else None} ({r['lcp']['el'] if r['lcp'] else ''}) cls {r['cls']} console {len(r['console'])}", flush=True)
        s.send('Emulation.setCPUThrottlingRate', {'rate': 1})
        s.send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.4); s.close()
    json.dump(res, open(out, 'w'), indent=1)
finally:
    b.close()
