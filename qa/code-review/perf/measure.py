#!/usr/bin/env python3
"""First-visit measurement on an emulated mid-range phone.
usage: measure.py <port> <url> <out.json> [--runs 3] [--trace trace.json] [--net slow4g|none] [--cpu 4] [--desktop]
       [--wait 14] [--variant <file.html>] [--fonts-css-ms 600] [--scroll]
Network: Slow 4G, 150 ms RTT, 1.6 Mbps down, 750 kbps up. The local server sends no gzip, so each HTML document is given
throughput scaled by its own raw/gzip ratio: its bytes arrive in the time GitHub Pages' gzip would take at 1.6 Mbps.
Everything else (media, JSON, images) gets 1.6 Mbps as is.
--variant serves a modified copy of the page (fulfilled through the Fetch domain at ?v=variant), for CPU-only what-ifs.
"""
import json, sys, time, gzip, os, base64, threading
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser, Session

args = sys.argv[1:]
port, url, out = int(args[0]), args[1], args[2]
def opt(name, default):
    if name in args:
        v = args[args.index(name) + 1]
        return type(default)(v) if default is not None else v
    return default
runs = opt('--runs', 3); trace_out = opt('--trace', None); net = opt('--net', 'slow4g'); cpu = opt('--cpu', 4.0)
desktop = '--desktop' in args; wait = opt('--wait', 14.0); variant = opt('--variant', None); fonts_ms = opt('--fonts-css-ms', 600.0)
do_scroll = '--scroll' in args; prof_out = opt('--profile', None)
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'dist')  # the repository's dist/, found from this file's place in qa/code-review/perf/
HERE = os.path.dirname(os.path.abspath(__file__))
# local server only: the page under test must be the repository's dist/ served at 127.0.0.1:8765 (every other host is
# unresolvable inside Chrome, see FLAGS in cdp.py, and the font and counter requests are answered or failed locally)
if not url.startswith('http://127.0.0.1:8765/'): sys.exit('measure.py measures the local server only: give a http://127.0.0.1:8765/ URL')
OBS = open(os.path.join(HERE, 'observe.js')).read()

def ratio(path):
    b = open(path, 'rb').read(); return len(b) / len(gzip.compress(b, 9)), len(b), len(gzip.compress(b, 9))
R_INDEX = ratio(os.path.join(DIST, 'index.html'))
R_LITHO = ratio(os.path.join(DIST, 'lithography', 'index.html'))
DOWN, UP, RTT = 200000, 93750, 150

def rules():
    if net == 'none': return []
    base = {'latency': RTT, 'uploadThroughput': UP}
    r = []
    for pat, rt in [('http://127.0.0.1:8765/', R_INDEX[0]), ('http://127.0.0.1:8765/index.html', R_INDEX[0]),
                    ('http://127.0.0.1:8765/lithography/', R_LITHO[0]), ('http://127.0.0.1:8765/data/*', 4.0)]:
        d = dict(base); d['urlPattern'] = pat; d['downloadThroughput'] = DOWN * rt; r.append(d)
    d = dict(base); d['urlPattern'] = ''; d['downloadThroughput'] = DOWN; r.append(d)
    return r

def one_run(b, k):
    s = Session(b.page_ws())
    reqs = {}
    s.on('Network.requestWillBeSent', lambda p: reqs.setdefault(p['requestId'], {}).update({'url': p['request']['url'], 'type': p.get('type'), 'start': p['timestamp'], 'prio': p['request'].get('initialPriority')}))
    s.on('Network.responseReceived', lambda p: reqs.setdefault(p['requestId'], {}).update({'status': p['response']['status'], 'mime': p['response'].get('mimeType'), 'timing': p['response'].get('timing')}))
    s.on('Network.loadingFinished', lambda p: reqs.setdefault(p['requestId'], {}).update({'bytes': p['encodedDataLength'], 'end': p['timestamp']}))
    s.on('Network.loadingFailed', lambda p: reqs.setdefault(p['requestId'], {}).update({'failed': p.get('errorText'), 'blocked': p.get('blockedReason'), 'end': p['timestamp']}))
    # the font stylesheet: held for fonts_ms (about four round trips on a fresh origin at 150 ms) and answered empty, so it
    # still blocks rendering as the real one does; no font file is fetched. Variant pages are fulfilled here too.
    vbody = base64.b64encode(open(variant, 'rb').read()).decode() if variant else None
    def paused(p):
        u = p['request']['url']; rid = p['requestId']
        if 'fonts.googleapis.com' in u:
            def later():
                time.sleep(fonts_ms / 1000.0)
                s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/css'}], 'body': base64.b64encode(b'/* simulated Google Fonts response */').decode()})
            threading.Thread(target=later, daemon=True).start()
        elif vbody and '?v=variant' in u:
            s.send_nowait('Fetch.fulfillRequest', {'requestId': rid, 'responseCode': 200, 'responseHeaders': [{'name': 'Content-Type', 'value': 'text/html; charset=utf-8'}], 'body': vbody})
        elif '127.0.0.1' in u or u.startswith('data:'):
            s.send_nowait('Fetch.continueRequest', {'requestId': rid})
        else:
            s.send_nowait('Fetch.failRequest', {'requestId': rid, 'errorReason': 'BlockedByClient'})
    s.on('Fetch.requestPaused', paused)
    s.send('Page.enable'); s.send('Network.enable'); s.send('Runtime.enable')
    s.send('Network.setCacheDisabled', {'cacheDisabled': True})
    s.send('Network.clearBrowserCache')
    s.send('Fetch.enable', {'patterns': [{'urlPattern': '*fonts.googleapis.com*'}, {'urlPattern': '*gc.zgo.at*'}, {'urlPattern': '*fonts.gstatic.com*'}] + ([{'urlPattern': '*?v=variant*'}] if variant else [])})
    if desktop:
        s.send('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
    else:
        # Lighthouse's mid-range phone: 412 x 823 CSS px at 1.75x
        s.send('Emulation.setDeviceMetricsOverride', {'width': 412, 'height': 823, 'deviceScaleFactor': 1.75, 'mobile': True})
        s.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
        s.send('Emulation.setUserAgentOverride', {'userAgent': 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36'})
    # warm the renderer on a tiny local file first, unthrottled, so the first paint is not the process start-up
    s.send('Page.navigate', {'url': 'http://127.0.0.1:8765/robots.txt'}); time.sleep(1.2)
    s.send('Page.addScriptToEvaluateOnNewDocument', {'source': OBS})
    if net != 'none':
        s.send('Network.emulateNetworkConditionsByRule', {'matchedNetworkConditions': rules()})
    s.send('Emulation.setCPUThrottlingRate', {'rate': cpu})
    tracing = bool(trace_out) and k == 0
    chunks = []
    if tracing:
        done = threading.Event(); hold = {}
        s.on('Tracing.tracingComplete', lambda p: (hold.update(p), done.set()))
        s.send('Tracing.start', {'transferMode': 'ReturnAsStream', 'traceConfig': {'recordMode': 'recordAsMuchAsPossible',
               'includedCategories': ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'v8', 'blink', 'loading', 'blink.user_timing', 'disabled-by-default-devtools.timeline.frame', 'toplevel']}})
    profiling = bool(prof_out) and k == 0
    if profiling:
        s.send('Profiler.enable'); s.send('Profiler.setSamplingInterval', {'interval': 200}); s.send('Profiler.start')
    target = url.replace('http://127.0.0.1:8765/', 'http://127.0.0.1:8765/?v=variant', 1) if variant else url
    t_nav = time.time()
    s.send('Page.navigate', {'url': target})
    # wait for load, then the idle period
    for _ in range(int(120 / 0.25)):
        try:
            st = s.eval('window.__perf && window.__perf.marks.load ? 1 : 0', False)
        except Exception:
            st = 0
        if st: break
        time.sleep(0.25)
    scrolled = None
    if do_scroll:
        # read for a moment, then jump down the chain chapter by chapter the way a thumb flick would, one every 700 ms
        time.sleep(1.0)
        scrolled = s.eval("""(async function(){ var out=[]; var els=[].slice.call(document.querySelectorAll('[data-view="stack"] article.chapter')).slice(0,8);
          for (var i=0;i<els.length;i++){ var t0=performance.now(); window.scrollTo(0, els[i].getBoundingClientRect().top + pageYOffset + 200); window.dispatchEvent(new Event('scroll'));
            await new Promise(function(r){ requestAnimationFrame(function(){ requestAnimationFrame(r); }); }); out.push([els[i].id, Math.round(t0), Math.round(performance.now()-t0)]); await new Promise(function(r){ setTimeout(r,700); }); }
          return out; })()""")
    time.sleep(wait)
    res = s.eval("""(function(){ var P=window.__perf, n=performance.getEntriesByType('navigation')[0]||{}; return { perf:P, nav:{ttfb:n.responseStart, respEnd:n.responseEnd, domInteractive:n.domInteractive, dcl:n.domContentLoadedEventEnd, load:n.loadEventEnd, transfer:n.transferSize, decoded:n.decodedBodySize},
      dom: document.getElementsByTagName('*').length, stage: (function(){ var f=document.querySelector('.stage'); return f ? {hidden:f.getAttribute('data-hidden'), collapsed:f.getAttribute('data-collapsed'), w: (document.getElementById('stage-canvas')||{}).width, h:(document.getElementById('stage-canvas')||{}).height} : null; })(),
      heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize/1048576*10)/10 : null, view: window.CP && CP.Router ? CP.Router.current : null, docH: document.documentElement.scrollHeight, density: window.PC ? PC.density : null }; })()""")
    res['scroll'] = scrolled
    if profiling:
        prof = s.send('Profiler.stop')['profile']; json.dump(prof, open(prof_out, 'w'))
    if tracing:
        s.send('Tracing.end')
        done.wait(120)
        h = hold.get('stream')
        while True:
            r = s.send('IO.read', {'handle': h, 'size': 4 * 1024 * 1024})
            chunks.append(base64.b64decode(r['data']) if r.get('base64Encoded') else r['data'].encode())
            if r.get('eof'): break
        s.send('IO.close', {'handle': h})
        open(trace_out, 'wb').write(b''.join(chunks))
    # network log
    t0 = min([v['start'] for v in reqs.values() if 'start' in v and v['url'].startswith('http')] or [0])
    res['requests'] = [{'url': v.get('url', '')[:140], 'type': v.get('type'), 'status': v.get('status'), 'bytes': v.get('bytes'), 'failed': v.get('failed'),
                        'start_ms': round((v['start'] - t0) * 1000) if 'start' in v else None, 'end_ms': round((v['end'] - t0) * 1000) if 'end' in v else None}
                       for v in reqs.values() if v.get('url', '').startswith('http')]
    s.send('Emulation.setCPUThrottlingRate', {'rate': 1})
    s.send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.5)
    s.close()
    return res

def summarize(r):
    P = r['perf']; fcp = next((t for n, t in P['paint'] if n == 'first-contentful-paint'), None)
    fp = next((t for n, t in P['paint'] if n == 'first-paint'), None)
    lcp = P['lcp'][-1] if P['lcp'] else None
    lts = P['lt']
    tbt = sum(max(0, d - 50) for t, d in lts if fcp is None or t >= fcp)
    cls = 0; win = []; best = 0
    # session windows: gap < 1 s, window < 5 s
    for e in sorted(P['ls'], key=lambda e: e['t']):
        if e['input']: continue
        if win and (e['t'] - win[-1]['t'] > 1000 or e['t'] - win[0]['t'] > 5000): win = []
        win.append(e); best = max(best, sum(x['v'] for x in win))
    builds = P['builds']
    return {'fp': fp, 'fcp': fcp, 'lcp': lcp['t'] if lcp else None, 'lcp_el': lcp['el'] if lcp else None, 'tbt': round(tbt), 'longtasks': len(lts), 'lt_total': round(sum(d for t, d in lts)),
            'lt_max': round(max([d for t, d in lts] or [0])), 'cls': round(best, 4), 'draw': P['draw'], 'ttfb': r['nav']['ttfb'], 'respEnd': r['nav']['respEnd'], 'domInteractive': r['nav']['domInteractive'],
            'dcl': r['nav']['dcl'], 'load': r['nav']['load'], 'dom': r['dom'], 'heap': r['heap'], 'view': r['view'], 'first_build': builds[0] if builds else None, 'n_builds': len(builds),
            'build_ms_total': sum(b[2] for b in builds), 'stage': r['stage'], 'density': r['density']}

b = Browser(port)
try:
    results = []
    for k in range(runs):
        r = one_run(b, k)
        r['summary'] = summarize(r)
        results.append(r)
        sm = r['summary']
        print(f"run {k}: ttfb {sm['ttfb']:.0f} respEnd {sm['respEnd']:.0f} fcp {sm['fcp']} lcp {sm['lcp']} ({sm['lcp_el']}) dcl {sm['dcl']:.0f} load {sm['load']:.0f} tbt {sm['tbt']} lt {sm['longtasks']} max {sm['lt_max']} cls {sm['cls']} draw {sm['draw']} build1 {sm['first_build']} builds {sm['n_builds']} ({sm['build_ms_total']} ms) dom {sm['dom']} heap {sm['heap']}", flush=True)
    json.dump({'url': url, 'net': net, 'cpu': cpu, 'desktop': desktop, 'variant': variant, 'ratio_index': R_INDEX, 'ratio_litho': R_LITHO, 'runs': results}, open(out, 'w'), indent=1)
finally:
    b.close()
