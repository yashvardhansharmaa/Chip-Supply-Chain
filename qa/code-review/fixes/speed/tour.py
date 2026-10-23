#!/usr/bin/env python3
"""Headless tour of every route and deep link after the speed fixes (21 to 23 Oct 2026). Local server only.
usage: tour.py <outdir> [--port 10312] [--widths 1440,1024,390,320] [--themes light,dark] [--only <substring>]
For each width, theme and address, a cold load: which view the router opened and which views are displayed, boot, console
errors, horizontal scroll, where an anchor landed against where it should (CP.landAt), the stage and its specimen, the
clouds built, and a screenshot. Then, per width, interactions: a Contents link and a ledger link glide on The Chain, the
phone strip's Expand and Collapse (the specimen rebuilt for the bigger canvas), and the phone Contents sheet."""
import sys, os, json, time, base64
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', '..', 'perf'))
from cdp import Browser, Session
args = sys.argv[1:]; out = args.pop(0); os.makedirs(out, exist_ok=True)
def opt(n, d):
    return args[args.index(n) + 1] if n in args else d
port = int(opt('--port', '10312')); widths = [int(w) for w in opt('--widths', '1440,1024,390,320').split(',')]
themes = opt('--themes', 'light,dark').split(','); only = opt('--only', '')
BASE = 'http://127.0.0.1:8765/'
ROUTES = [('#/', 'walk', None), ('#/chain', 'stack', None), ('#lithography', 'stack', 'lithography'), ('#geopolitics', 'stack', 'geopolitics'),
          ('#lithography--high-na-euv', 'stack', 'lithography--high-na-euv'), ('#/suppliers', 'suppliers', None), ('#/suppliers?country=JP', 'suppliers', None),
          ('#/suppliers?tab=country', 'suppliers', None), ('#/controls', 'controls', None), ('#/exposure/asml', 'controls', None),
          ('#/controls/2019-05-16-huawei-listed', 'controls', None), ('#/glossary', 'glossary', None), ('#gl-euv', 'glossary', None),
          ('#/landscape', 'landscape', None), ('#/walk/lithography', 'walk', '/walk/lithography')]
STATE = """(function(anchor){var r=document.documentElement,el=anchor?document.getElementById(anchor):null,st=document.querySelector('.stage'),S=CP.Stage;
 var vis=[].slice.call(document.querySelectorAll('main > .view')).filter(function(v){return getComputedStyle(v).display!=='none';}).map(function(v){return v.getAttribute('data-view');});
 return {view:CP.Router.current,vis:vis,booted:r.classList.contains('booted'),hscroll:r.scrollWidth-r.clientWidth,
  land:el?[Math.round(el.getBoundingClientRect().top),Math.round(CP.landAt(el))]:null,
  stage:st?st.getAttribute('data-hidden'):null,collapsed:st?st.getAttribute('data-collapsed'):null,spec:S.cur?{name:S.cur.name,lvl:S.cur.lvl,pts:S.cur.n}:null,lvl:S.lvl,built:Object.keys(S.cache).length,
  canvas:document.getElementById('stage-canvas')?[document.getElementById('stage-canvas').width,document.getElementById('stage-canvas').height]:null,
  sized:[].slice.call(document.querySelectorAll('article.chapter')).filter(function(c){return c._sized;}).length,art:!!(document.querySelector('img.pt-art')||{}).src};})"""
def shot(s, path):
    d = s.send('Page.captureScreenshot', {'format': 'png'}); open(path, 'wb').write(base64.b64decode(d['data']))
results = []
b = Browser(port)
try:
    s = Session(b.page_ws()); logs = []
    s.on('Runtime.consoleAPICalled', lambda p: logs.append([p['type'], ' '.join(str(a.get('value', a.get('description', ''))) for a in p['args'])[:240]]))
    s.on('Runtime.exceptionThrown', lambda p: logs.append(['exception', (p['exceptionDetails'].get('exception') or {}).get('description', p['exceptionDetails'].get('text', ''))[:240]]))
    s.send('Page.enable'); s.send('Runtime.enable')
    for w in widths:
        mob = w < 900; h = {1440: 900, 1024: 768, 390: 844, 320: 640}.get(w, 900)
        s.send('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': 2 if mob else 1, 'mobile': mob})
        s.send('Emulation.setTouchEmulationEnabled', {'enabled': mob})
        for theme in themes:
            for hsh, want, anchor in ROUTES:
                if only and only not in hsh: continue
                if theme == 'dark' and hsh not in ('#/', '#/chain', '#lithography', '#/suppliers', '#/controls', '#/glossary', '#/landscape'): continue
                logs.clear()
                s.send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.2)
                s.send('Page.navigate', {'url': BASE + '?theme=' + theme + hsh})
                for _ in range(60):
                    time.sleep(0.25)
                    try:
                        if s.eval('document.readyState==="complete"&&!!(window.CP&&CP.Router&&CP.Router.routed)', False): break
                    except Exception: pass
                time.sleep(2.2)
                st = s.eval(STATE + '(%s)' % json.dumps(anchor), False)
                name = f'{w}-{theme}-' + (hsh.replace('#', '').replace('/', '_').replace('?', '_').replace('=', '-') or 'home')
                shot(s, os.path.join(out, name + '.png'))
                errs = [l for l in logs if l[0] in ('error', 'exception', 'assert') or (l[0] == 'warning' and 'preroute' in l[1])]
                ok = st['view'] == want and st['vis'] == [want] and st['booted'] and not errs and st['hscroll'] <= 0 \
                    and (st['land'] is None or abs(st['land'][0] - st['land'][1]) <= 3) \
                    and ((st['stage'] == '0' and st['spec']) if want in ('walk', 'stack', 'landscape') else st['stage'] == '1')
                rec = {'width': w, 'theme': theme, 'hash': hsh, 'ok': ok, 'state': st, 'errors': errs}
                results.append(rec)
                print(f"{'ok  ' if ok else 'FAIL'} {w:4d} {theme:5s} {hsh:36s} view={st['view']} vis={st['vis']} land={st['land']} stage={st['stage']} spec={st['spec']} built={st['built']} sized={st['sized']} hscroll={st['hscroll']} art={st['art']} errs={errs[:2]}", flush=True)
        # interactions on The Chain at this width
        logs.clear()
        s.send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.2)
        s.send('Page.navigate', {'url': BASE + '#/chain'}); time.sleep(4)
        inter = {}
        # a Contents link: glide to chapter 10, then check the landing
        inter['contents'] = s.eval("""(async function(){var a=document.querySelector('#contents a[href="#memory-and-hbm"]');if(!a)return 'no link';a.click();
          await new Promise(function(r){setTimeout(r,3500);});var el=document.getElementById('memory-and-hbm');return [location.hash,Math.round(el.getBoundingClientRect().top),Math.round(CP.landAt(el)),CP.Stage.cur&&CP.Stage.cur.name];})()""")
        # a ledger link inside a chapter (on a phone the ledger shows the chapter number only, so the prev/next link instead)
        inter['ledger'] = s.eval("""(async function(){var a=document.querySelector('#memory-and-hbm .ch-ledger a[href="#foundries-and-fabs"]')||document.querySelector('#memory-and-hbm .prevnext a.prev');if(!a)return 'no link';var to=a.getAttribute('href').slice(1);a.click();
          await new Promise(function(r){setTimeout(r,3500);});var el=document.getElementById(to);return [to,Math.round(el.getBoundingClientRect().top),Math.round(CP.landAt(el)),CP.Stage.cur&&CP.Stage.cur.name];})()""")
        if w < 900:
            # the strip: Expand rebuilds the specimen for the bigger canvas; Collapse goes back to the thumbnail's cloud
            inter['expand'] = s.eval("""(async function(){var S=CP.Stage,b=document.querySelector('.stage-toggle'),before={lvl:S.cur&&S.cur.lvl,pts:S.cur&&S.cur.n};b.click();
              await new Promise(function(r){setTimeout(r,900);});var mid={lvl:S.cur&&S.cur.lvl,pts:S.cur&&S.cur.n,collapsed:document.querySelector('.stage').getAttribute('data-collapsed'),canvas:document.getElementById('stage-canvas').height};b.click();
              await new Promise(function(r){setTimeout(r,900);});return {before:before,expanded:mid,after:{lvl:S.cur&&S.cur.lvl,pts:S.cur&&S.cur.n,collapsed:document.querySelector('.stage').getAttribute('data-collapsed')},top:getComputedStyle(document.querySelector('.stage-top')).visibility};})()""")
            shot(s, os.path.join(out, f'{w}-strip.png'))
            # the Contents sheet: open it, pick chapter 3, land there
            inter['sheet'] = s.eval("""(async function(){document.querySelector('.stage-menu').click();await new Promise(function(r){setTimeout(r,400);});var open=!document.getElementById('sheet').hidden;
              var a=document.querySelector('#sheet a[href="#chemicals-gases-and-photoresist"]');a.click();await new Promise(function(r){setTimeout(r,3500);});var el=document.getElementById('chemicals-gases-and-photoresist');
              return {opened:open,closed:document.getElementById('sheet').hidden,land:[Math.round(el.getBoundingClientRect().top),Math.round(CP.landAt(el))]};})()""")
        inter['errors'] = [l for l in logs if l[0] in ('error', 'exception')]
        results.append({'width': w, 'interactions': inter})
        print(f'     {w:4d} interactions {json.dumps(inter)}', flush=True)
    json.dump(results, open(os.path.join(out, 'tour.json'), 'w'), indent=1)
    fails = [r for r in results if 'ok' in r and not r['ok']]
    print(f'{len([r for r in results if "ok" in r])} loads, {len(fails)} failed')
finally:
    b.close()
