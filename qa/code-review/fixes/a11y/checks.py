#!/usr/bin/env python3
"""Before/after proofs for the a11y fixes (qa/code-review/fixes/a11y-notes.md).
usage: python3 checks.py <label> [--only item,item] [--vp 1440,1024,390,320] [--theme light,dark] [--base URL] [--port 10340]
Writes <label>-<vp>-<theme>.json beside this file. Items: obscured skip search sheet contrast focus spin home axe."""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Page

HERE = os.path.dirname(os.path.abspath(__file__))
PROBE = open(os.path.join(HERE, 'probe.js')).read()
args = sys.argv[1:]
label = args[0]
def opt(n, d): return args[args.index(n) + 1] if n in args else d
ONLY = set(opt('--only', 'obscured,chips,skip,search,sheet,contrast,focus,spin,home,axe').split(','))
VPS = opt('--vp', '1440,1024,390,320').split(',')
THEMES = opt('--theme', 'light,dark').split(',')
BASE = opt('--base', 'http://127.0.0.1:8765/')
PORT = int(opt('--port', '10340'))
SIZES = {'1440': (1440, 900, False), '1024': (1024, 768, False), '390': (390, 844, True), '320': (320, 640, True)}


def url(route, theme):
    return BASE + ('?theme=dark' if theme == 'dark' else '') + route


def load(p, route, theme, wait=5.0):
    p.goto('about:blank', 0.3)  # a hash change alone would keep the old document, its focus and its state
    p.goto(url(route, theme), wait)
    p.ev(PROBE)
    p.ev("document.documentElement.style.scrollBehavior = 'auto'; 0")  # the reviewer's walks ran with smooth scrolling off


def tabwalk(p, n, shift=False):
    out = []
    for _ in range(n):
        p.key('Tab', shift=shift, pause=0.05)
        out.append(p.ev('__a.where()'))
    return out


def summarize(walk):
    s = {}
    for w in walk: s[w['state']] = s.get(w['state'], 0) + 1
    return s


def run(vp, theme):
    w, h, mob = SIZES[vp]
    R = {'vp': vp, 'theme': theme}
    holder = {'p': None}
    def fresh():
        if holder['p']: holder['p'].close()
        holder['p'] = Page(PORT, w, h, mob); return holder['p']
    try:
        if 'obscured' in ONLY:
            p = fresh()  # 2.4.11: focus fully under the masthead, the walk rail or the phone strip
            res = {}
            for route in ('#/chain', '#/'):
                load(p, route, theme)
                p.ev('window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); 0')
                fwd = tabwalk(p, 70)
                back = tabwalk(p, 40, shift=True)
                res[route] = {'forward': summarize(fwd), 'back': summarize(back),
                              'hidden': [x for x in fwd + back if x['state'] in ('hidden', 'invisible', 'part')][:8]}
            R['obscured'] = res
        if 'chips' in ONLY:  # AI Chips with three chips in: the Comparing bar under the masthead must not cover a focused control
            p = fresh()
            load(p, '#/landscape', theme, 6)
            p.ev("(function(){var ids=CP.DATA.landscape.map(function(c){return c.id;}); CP.Landscape.select(ids[0]); CP.Landscape.select(ids[3]); CP.Landscape.select(ids[6]);})(); 0"); time.sleep(0.6)
            p.ev("(function(){var t=document.getElementById('cx-table-wrap'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY + t.offsetHeight - innerHeight / 2); })(); 0"); time.sleep(0.6)
            p.ev("(function(){var as=[].slice.call(document.querySelectorAll('#cx-table-wrap a[href], #cx-table-wrap button, #cx-foot a[href], #cx-notes summary, #cx-notes a[href]')); var a=as[as.length-1]; if (a) a.focus({preventScroll:true}); })(); 0"); time.sleep(0.3)
            back = tabwalk(p, 30, shift=True)
            R['chips'] = {'picked': p.ev('CP.Landscape.picked.length'), 'barShown': p.ev("!document.getElementById('cx-sticky').hidden"), 'cxSticky': p.ev("getComputedStyle(document.documentElement).getPropertyValue('--cx-sticky')"),
                          'paddingTop': p.ev("getComputedStyle(document.documentElement).scrollPaddingTop"), 'back': summarize(back), 'stepsWithBar': sum(1 for x in back if x.get('cxBar')), 'hidden': [x for x in back if x['state'] in ('hidden', 'part')][:6]}
        if 'skip' in ONLY:
            p = fresh()  # 2.4.1: the skip link is the first stop, lands in main, and leaves the route alone
            res = {}
            for route in ('#/suppliers', '#/chain', '#/'):
                load(p, route, theme)
                p.key('Tab'); first = p.ev('__a.desc(document.activeElement)')
                p.key('Enter'); time.sleep(0.4)
                after = p.ev('({hash: location.hash, active: __a.desc(document.activeElement)})')
                p.key('Tab'); nxt = p.ev('({active: __a.desc(document.activeElement), inMain: !!(document.activeElement && document.activeElement.closest("main")), view: (document.querySelector(".view:not([hidden])") || {}).getAttribute ? document.querySelector(".view:not([hidden])").getAttribute("data-view") : null})')
                res[route] = {'firstTab': first, 'afterEnter': after, 'nextTab': nxt}
            R['skip'] = res
        if 'search' in ONLY:
            p = fresh()  # the search dialog as a modal
            res = {}
            load(p, '#/chain', theme)
            p.ev("document.querySelector('.search-btn').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            res['open'] = p.ev("(function(){var b=document.getElementById('cp-search');return {open: b && !b.hidden, modal: b && b.getAttribute('aria-modal'), appInert: !!document.getElementById('app').inert, active: __a.desc(document.activeElement), inputRing: getComputedStyle(document.activeElement).boxShadow};})()")
            p.type('lithography'); time.sleep(1.0)
            res['status'] = p.ev("(function(){var s=document.querySelector('#cp-search [role=status]');return s ? s.textContent : null;})()")
            walk = []
            for _ in range(24):
                p.key('Tab', pause=0.04); walk.append(p.ev("document.activeElement.closest('#cp-search') ? 1 : __a.desc(document.activeElement)"))
            res['tab24_inside'] = sum(1 for x in walk if x == 1); res['tab24_outside'] = sum(1 for x in walk if x != 1); res['outside'] = sorted(set(x for x in walk if x != 1))
            p.ev("document.activeElement.blur(); 0"); p.key('Escape'); time.sleep(0.3)
            res['escFromBody'] = p.ev("({closed: document.getElementById('cp-search').hidden, active: __a.desc(document.activeElement), appInert: !!document.getElementById('app').inert})")
            if not res['escFromBody']['closed']:
                p.ev("CP.Tools.close(); 0")
            p.ev("document.querySelector('.search-btn').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            p.type('lithography'); time.sleep(0.6); p.key('Tab'); p.key('Escape'); time.sleep(0.3)
            res['escFromResult'] = p.ev("({closed: document.getElementById('cp-search').hidden, active: __a.desc(document.activeElement)})")
            if not res['escFromResult']['closed']:
                p.ev("CP.Tools.close(); 0")
            picks = {}
            for q, kind in (('lithography', 'Chapter'), ('high-NA', None), ('TSMC', 'Supplier'), ('H100', 'Chip'), ('Entity List', 'Term'), ('Entity List', 'Event'), ('ASML 2023', 'China revenue')):
                p.ev("document.querySelector('.search-btn').focus(); 0"); p.key('Enter'); time.sleep(0.3)
                p.type(q); time.sleep(0.7)
                ok = p.ev("(function(k){var as=[].slice.call(document.querySelectorAll('#cp-search ol a'));var a=k?as.filter(function(x){return (x.querySelector('.k')||{}).textContent.indexOf(k)===0;})[0]:as[1];if(!a)return null;a.focus();return a.querySelector('.k').textContent+' | '+a.querySelector('b').textContent;})(%s)" % json.dumps(kind))
                if not ok:
                    picks[q + '/' + str(kind)] = 'no result'; p.ev("CP.Tools.close(); 0"); continue
                p.key('Enter'); time.sleep(1.6)
                picks[q + '/' + str(kind)] = p.ev("(function(){var a=document.activeElement;return {pick: %s, hash: location.hash, active: __a.desc(a), heading: !!a && /^H[1-6]$/.test(a.tagName), inView: !!a && !!a.closest && !!a.closest('.view:not([hidden])'), where: __a.where().state};})()" % json.dumps(ok))
            res['picks'] = picks
            R['search'] = res
        if 'sheet' in ONLY and mob:
            p = fresh()  # the phone Contents sheet
            res = {}
            load(p, '#/chain', theme)
            p.ev("document.querySelector('.stage-menu').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            res['open'] = p.ev("(function(){var s=document.getElementById('sheet');return {open: !s.hidden, modal: s.getAttribute('aria-modal'), appInert: !!document.getElementById('app').inert, active: __a.desc(document.activeElement)};})()")
            walk = []
            for _ in range(40):
                p.key('Tab', pause=0.04); walk.append(p.ev("document.activeElement.closest('#sheet') ? 1 : __a.desc(document.activeElement)"))
            res['tab40_inside'] = sum(1 for x in walk if x == 1); res['tab40_outside'] = sum(1 for x in walk if x != 1); res['outside'] = sorted(set(x for x in walk if x != 1))
            p.key('Escape'); time.sleep(0.3)
            res['escape'] = p.ev("({closed: document.getElementById('sheet').hidden, active: __a.desc(document.activeElement), appInert: !!document.getElementById('app').inert})")
            p.ev("document.querySelector('.stage-menu').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            p.ev("document.querySelector('.sheet-close').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            res['closeBtn'] = p.ev("({closed: document.getElementById('sheet').hidden, active: __a.desc(document.activeElement)})")
            p.ev("document.querySelector('.stage-menu').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            p.ev("document.querySelector('.sheet-chapters a[href=\"#lithography\"]').focus(); 0"); p.key('Enter'); time.sleep(1.6)
            res['chapter'] = p.ev("({closed: document.getElementById('sheet').hidden, hash: location.hash, active: __a.desc(document.activeElement), where: __a.where().state})")
            p.ev("document.querySelector('.stage-menu').focus(); 0"); p.key('Enter'); time.sleep(0.3)
            p.ev("document.querySelector('.sheet-pages a[href=\"#/suppliers\"]').focus(); 0"); p.key('Enter'); time.sleep(1.6)
            res['page'] = p.ev("({closed: document.getElementById('sheet').hidden, hash: location.hash, active: __a.desc(document.activeElement)})")
            R['sheet'] = res
        if 'contrast' in ONLY:
            p = fresh()
            res = {}
            load(p, '#/chain', theme)
            res['animStepN'] = p.ev("(function(){var all=[].slice.call(document.querySelectorAll('.anim-steps button .n'));var r=all.map(function(n){return __a.text(n).ratio;});return {n: all.length, min: Math.min.apply(null,r), max: Math.max.apply(null,r), sample: all[1] ? __a.text(all[1]) : null};})()")
            load(p, '#/suppliers', theme)
            res['atlasStops'] = p.ev("(function(){var all=[].slice.call(document.querySelectorAll('.atlas .sa-stop:not(.is-on)'));var r=all.map(function(n){return __a.text(n).ratio;});return {n: all.length, min: Math.min.apply(null,r), max: Math.max.apply(null,r), sample: all[0] ? __a.text(all[0]) : null};})()")
            res['edges'] = p.ev("(function(){var o={};[['#sup-search','supSearch'],['#sup-country','supCountry'],['#sup-chk','supChk']].forEach(function(x){var e=document.querySelector(x[0]); if(e) o[x[1]]=__a.edge(e);});var c=document.querySelector('.sa-chip'); if(c) o.countryChip=__a.edge(c);var g=document.querySelector('.btn.ghost:not([hidden])'); if(g) o.ghostBtn=__a.edge(g);return o;})()")
            load(p, '#/glossary', theme)
            res['edges']['glSearch'] = p.ev("__a.edge(document.getElementById('gl-search'))")
            load(p, '#/controls', theme, 6)
            res['edges']['filterChip'] = p.ev("(function(){var b=document.querySelector('#tl-filters button[aria-pressed=\"false\"]');return b?__a.edge(b):null;})()")
            load(p, '#/landscape', theme)
            res['edges']['chipSquare'] = p.ev("(function(){var d=document.getElementById('cxa-browse'); if(d) d.open=true; var b=document.querySelector('.cx-picker button[aria-pressed=\"false\"]'); return b?__a.edge(b,'::before'):null;})()")
            load(p, '#/exposure', theme, 6)
            res['peaks'] = p.ev("(function(){var d=document.querySelector('[data-sub=exposure] details.table-view'); if(d) d.open=true; var all=[].slice.call(document.querySelectorAll('#exposure-table td .cell.is-peak'));var r=all.map(function(n){return __a.text(n).ratio;});return {n: all.length, min: r.length?Math.min.apply(null,r):null, under45: r.filter(function(x){return x<4.5;}).length, sample: all[0]?__a.text(all[0]):null};})()")
            load(p, '#/chain', theme)
            p.ev("CP.Tools.open(); 0"); time.sleep(0.3)
            res['placeholder'] = p.ev("(function(){var i=document.querySelector('#cp-search input');var cs=getComputedStyle(i,'::placeholder');var fg=__a.rgb(cs.color), bg=__a.rgb(getComputedStyle(i).backgroundColor);return {color: cs.color, ratio: __a.ratio(fg,bg)};})()")
            R['contrast'] = res
        if 'focus' in ONLY:
            p = fresh()  # Back to top out of the tab order while hidden; the two outline: none rules
            res = {}
            load(p, '#/chain', theme)
            p.ev('window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); 0')
            stops = []
            for _ in range(14):
                p.key('Tab', pause=0.04); stops.append(p.ev("({el: __a.desc(document.activeElement), toTopHidden: document.activeElement.classList.contains('to-top') && document.activeElement.getAttribute('data-show') === '0'})"))
            res['toTopHiddenStops'] = sum(1 for s in stops if s['toTopHidden'])
            res['toTopShown'] = p.ev("(function(){window.scrollTo(0, 9000); return new Promise(function(r){setTimeout(function(){var t=document.querySelector('.to-top'); r({show: t.getAttribute('data-show'), vis: getComputedStyle(t).visibility, display: getComputedStyle(t).display});}, 500);});})()")
            load(p, '#/', theme)
            p.key('Shift')
            res['wkTabs'] = p.ev("(function(){var a=document.querySelector('.wk-tabs a'); if(!a) return null; a.focus(); var cs=getComputedStyle(a); return {fv: a.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor};})()")
            if not mob:
                p.ev("(function(){var a=document.querySelector('.wk-tabs a'); a.scrollIntoView({block:'center'}); a.focus(); })(); 0"); time.sleep(0.3)
                r = p.ev("(function(){var b=document.querySelector('.wk-tabs a').getBoundingClientRect();return {x:b.left-12,y:b.top-12+scrollY,width:Math.min(b.width+24, innerWidth-b.left+12),height:b.height+24};})()")
                p.shot(os.path.join(HERE, f'{label}-wktabs-focus-{vp}-{theme}.png'), r)
            load(p, '#/controls', theme, 6)
            p.key('Shift')
            res['cfJump'] = p.ev("(function(){var a=document.querySelector('.cf-jump-btn'); if(!a) return null; a.focus(); var cs=getComputedStyle(a); return {fv: a.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor};})()")
            if not mob:
                r = p.ev("(function(){var b=document.querySelector('.cf-jump-btn').getBoundingClientRect();return {x:b.left-12,y:b.top-12+scrollY,width:b.width+24,height:b.height+24};})()")
                p.shot(os.path.join(HERE, f'{label}-cfjump-focus-{vp}-{theme}.png'), r)
            R['focus'] = res
        if 'spin' in ONLY:
            p = fresh()  # 2.2.2: a way to stop the turn
            res = {}
            load(p, '#/chain', theme, 6)
            res['control'] = p.ev("(function(){var b=document.querySelector('.stage-pause'); if(!b) return null; var r=b.getBoundingClientRect(); return {text: b.textContent, label: b.getAttribute('aria-label'), pressed: b.getAttribute('aria-pressed'), w: Math.round(r.width), h: Math.round(r.height), shown: r.width > 0 && getComputedStyle(b).visibility !== 'hidden'};})()")
            res['turn2s'] = p.ev("(function(){var a=CP.Stage.spin; return new Promise(function(r){setTimeout(function(){r(Math.round((CP.Stage.spin-a)*1000)/1000);}, 2000);});})()")
            if res['control']:
                p.ev("document.querySelector('.stage-pause').focus(); 0"); p.key('Enter'); time.sleep(0.3)
                res['afterPress'] = p.ev("(function(){var b=document.querySelector('.stage-pause'); var a=CP.Stage.spin; return new Promise(function(r){setTimeout(function(){r({text: b.textContent, pressed: b.getAttribute('aria-pressed'), turn2s: Math.round((CP.Stage.spin-a)*1000)/1000, saved: (function(){try{return localStorage.getItem('cp-still');}catch(e){return 'x';}})()});}, 2000);});})()")
                load(p, '#/chain', theme, 6)
                res['afterReload'] = p.ev("(function(){var b=document.querySelector('.stage-pause'); var a=CP.Stage.spin; return new Promise(function(r){setTimeout(function(){r({text: b.textContent, pressed: b.getAttribute('aria-pressed'), turn2s: Math.round((CP.Stage.spin-a)*1000)/1000});}, 2000);});})()")
                p.ev("document.querySelector('.stage-pause').focus(); 0"); p.key('Enter'); time.sleep(0.3)
                res['resumed'] = p.ev("(function(){var b=document.querySelector('.stage-pause'); var a=CP.Stage.spin; return new Promise(function(r){setTimeout(function(){r({text: b.textContent, turn2s: Math.round((CP.Stage.spin-a)*1000)/1000});}, 2000);});})()")
                p.shot(os.path.join(HERE, f'{label}-stage-{vp}-{theme}.png'))
            res['hscroll'] = p.ev("document.documentElement.scrollWidth - innerWidth")
            R['spin'] = res
        if 'home' in ONLY:
            p = fresh()  # the Home tab on the home page
            load(p, '#/', theme, 6)
            p.ev('window.scrollTo(0, 6000); 0'); time.sleep(1.5)
            before = p.ev('({y: Math.round(scrollY), hash: location.hash})')
            shown = p.ev("getComputedStyle(document.querySelector('.tabs a[data-view=walk]')).display !== 'none'")
            if shown: p.ev("document.querySelector('.tabs a[data-view=walk]').focus(); 0"); p.key('Enter')
            else: p.ev("document.querySelector('.tabs a[data-view=walk]').click(); 0")  # phones hide the Home tab (the wordmark goes home), so the tab is clicked
            time.sleep(1.5)
            after = p.ev('({y: Math.round(scrollY), hash: location.hash, active: __a.desc(document.activeElement)})')
            R['home'] = {'before': before, 'after': after, 'how': 'Enter' if shown else 'click (tab hidden on phones)'}
        if 'axe' in ONLY:
            p = fresh()
            res = {}
            for route in ('#/', '#/chain', '#/suppliers', '#/glossary', '#/controls', '#/exposure', '#/landscape'):
                load(p, route, theme, 6)
                if route == '#/exposure': p.ev("(function(){var d=document.querySelector('[data-sub=exposure] details.table-view'); if(d) d.open=true;})(); 0")
                v = p.axe() or []
                res[route] = {'total': sum(x['n'] for x in v) if isinstance(v, list) else v, 'rules': {x['id']: x['n'] for x in v} if isinstance(v, list) else None,
                              'nodes': {x['id']: x['nodes'] for x in v} if isinstance(v, list) else None}
            p.ev("CP.Tools.open(); 0"); time.sleep(0.3); p.type('litho'); time.sleep(0.6)
            v = p.axe(include={'include': [['#cp-search']]}) or []
            res['search-open'] = {'total': sum(x['n'] for x in v), 'rules': {x['id']: x['n'] for x in v}, 'nodes': {x['id']: x['nodes'] for x in v}}
            R['axe'] = res
    finally:
        if holder['p']: holder['p'].close()
    return R


for vp in VPS:
    for th in THEMES:
        r = run(vp, th)
        out = os.path.join(HERE, f'{label}-{vp}-{th}.json')
        json.dump(r, open(out, 'w'), indent=1)
        print('wrote', out)
