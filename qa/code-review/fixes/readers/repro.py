#!/usr/bin/env python3
"""Repros for the readers fixes. Each test prints what a reader would meet and a verdict.
  python3 qa/code-review/fixes/readers/repro.py after  [test ...]   # the live build at 127.0.0.1:8765
  python3 qa/code-review/fixes/readers/repro.py before <saved index.html> [test ...]   # the build as it was, answered in place of the page
Results go to qa/code-review/fixes/readers/<label>.json. Ports 10320 to 10339."""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Page

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'http://127.0.0.1:8765/'
label = sys.argv[1]
stand_in = sys.argv[2] if label == 'before' else None
only = sys.argv[3:] if label == 'before' else sys.argv[2:]
PORT = [10320]


def page(**kw):
    PORT[0] += 1
    if PORT[0] > 10339: PORT[0] = 10321
    if kw.get('mobile') and 'width' not in kw: kw.update(width=390, height=844)
    return Page(PORT[0], stand_in=stand_in, **kw)


SLEEP = "const sl=ms=>new Promise(r=>setTimeout(r,ms));"
TESTS = {}
def test(fn): TESTS[fn.__name__] = fn; return fn


@test
def board_now():
    """P1-3: the board's Now on 11 Nov 2026 (faked clock) and on the real today"""
    out = {}
    for day in ('2026-11-11T12:00:00', None):
        p = page(fake_date=day)
        try:
            p.go(BASE + '#/controls', 6)
            r = p.ev(SLEEP + """(async()=>{document.querySelector('.cf-mode[data-mode="subject"]').click();await sl(400);
              const row=f=>{const r=document.querySelector('.cf-row[data-f="'+f+'"] .cf-state');return r?r.textContent.replace(/\\s+/g,' ').trim():null};
              return {today:new Date().toDateString(),asOf:document.getElementById('cf-asof').textContent,entity:row('entity'),minerals:row('minerals'),mineralsWorld:row('minerals-world'),
                suspendedShown:[...document.querySelectorAll('#cf-board .cf-row .cf-state .cf-susp')].map(x=>x.textContent)};})()""")
            out['11 Nov 2026' if day else 'real today'] = r
        finally:
            out.setdefault('errors', []).extend(p.errors); p.close()
    fk = out['11 Nov 2026']
    out['pass'] = fk['asOf'] == '11 Nov 2026' and not any('9 Nov' in s or '10 Nov' in s for s in fk['suspendedShown']) and any('27 Nov' in s for s in fk['suspendedShown']) \
        and out['real today']['asOf'] != '7 Sept 2026'
    return out


@test
def board_status():
    """a11y #5: a year press, the arrow keys and Now are announced in a polite status"""
    p = page()
    try:
        p.go(BASE + '#/controls', 6)
        r = p.ev(SLEEP + """(async()=>{document.querySelector('.cf-mode[data-mode="subject"]').click();await sl(300);
          const st=()=>{const s=document.querySelector('#cf-side [role="status"], #cf-side [aria-live], #cf-status, #cf [role="status"]');return s?{role:s.getAttribute('role'),live:s.getAttribute('aria-live')||'polite (role)',text:s.textContent}:null};
          const b=document.querySelector('.cf-year[data-y="2022"]');b.click();await sl(300);const a=st();
          b.focus();b.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await sl(300);const k=st();
          document.getElementById('cf-now').click();await sl(300);const n=st();
          document.querySelectorAll('#tl-filters button')[1].click();await sl(300);const c=st();
          return {afterYear:a,afterArrow:k,afterNow:n,afterChip:c};})()""")
    finally:
        errs = p.errors; p.close()
    ok = all(r.get(k) and r[k]['text'] for k in ('afterYear', 'afterArrow', 'afterNow', 'afterChip'))
    return {'result': r, 'errors': errs, 'pass': bool(ok)}


@test
def passage_link():
    """P1-1 (A1): a Where it appears passage link lands on the passage and stays there"""
    p = page()
    try:
        p.go(BASE, 6)
        r = p.ev(SLEEP + """(async()=>{location.hash='#/glossary';await sl(800);let a=null;
          for(const x of document.querySelectorAll('#lk-items li[data-kind="term"]')){CP.Lookup.select(x.id,true);await sl(20);
            for(const c of document.querySelectorAll('#lk-mentions a[data-para]')){const q=CP.Lookup.paras[+c.dataset.para];if(q&&q.el.closest('.prose')&&[...document.getElementById(q.chapter).querySelectorAll('.prose > p')].indexOf(q.el)>25){a=c;break;}}if(a)break;}
          const p=CP.Lookup.paras[+a.dataset.para];a.click();const out=[];let t0=0;
          for(const t of [250,1000,1600,2600]){await sl(t-t0);t0=t;const r=p.el.getBoundingClientRect();out.push({t,passageTop:Math.round(r.top),onScreen:r.bottom>0&&r.top<innerHeight,chapterTop:Math.round(document.getElementById(p.chapter).getBoundingClientRect().top)});}
          return {term:CP.Lookup.selected,chapter:p.chapter,text:p.text.slice(0,70),samples:out};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': all(s['onScreen'] for s in r['samples'][1:])}


@test
def popover_close():
    """P1-5 (A5): Look it up closes the popover; the Glossary opens with the entry in view; entry to entry lands below the masthead"""
    out = {}
    for mob in (False, True):
        p = page(mobile=mob) if mob else page()
        try:
            p.go(BASE + '#lithography', 7)
            r = p.ev(SLEEP + """(async()=>{const b=document.querySelector('#lithography .prose button.gl-term');b.scrollIntoView({block:'center',behavior:'instant'});await sl(200);
              const y0=scrollY;b.click();await sl(300);const a=document.querySelector('#gl-tip a');const href=a.getAttribute('href');a.click();await sl(1200);
              const t=document.getElementById('gl-tip'),tr=t.getBoundingClientRect(),mast=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||56;
              const head=document.querySelector('#glossary .gl-entry:not([hidden]) dt')||document.querySelector('#lk-card h3');const hr=head?head.getBoundingClientRect():null;
              const one={from:y0,href,hash:location.hash,tipHidden:t.hidden,tipRect:t.hidden?null:[tr.left,tr.top,tr.width,tr.height].map(Math.round),scrollY:Math.round(scrollY),
                entryHeadTop:hr?Math.round(hr.top):null,entryHeadVisible:hr?hr.top>=mast-2&&hr.bottom<=innerHeight:false,focus:document.activeElement.tagName+(document.activeElement.id?'#'+document.activeElement.id:'')};
              location.hash='#lk-country-jp';await sl(700);scrollTo(0,373);await sl(200);location.hash='#gl-hbm';await sl(900);
              const h2=document.querySelector('#glossary .gl-entry:not([hidden]) dt'),r2=h2.getBoundingClientRect();
              one.entryToEntry={scrollY:Math.round(scrollY),headTop:Math.round(r2.top),mast:Math.round(mast),visible:r2.top>=mast-2&&r2.bottom<=innerHeight};return one;})()""")
            out['phone' if mob else 'desktop'] = r
        finally:
            out.setdefault('errors', []).extend(p.errors); p.close()
    ok = all(out[k]['tipHidden'] and out[k]['entryHeadVisible'] and out[k]['entryToEntry']['visible'] for k in ('desktop', 'phone'))
    out['pass'] = ok
    return out


@test
def non_passages():
    """P1-4: word-count lines, citation text and card furniture are not passages"""
    p = page()
    try:
        p.go(BASE + '#/glossary', 6)
        r = p.ev("""(()=>{const ps=CP.Lookup.corpus();const bad=ps.filter(p=>p.el.closest('.ch-meta, .ch-cite, .chapter-nav, .chapter-sources'));
          const kinds={};bad.forEach(p=>{const k=p.el.closest('.ch-meta')?'ch-meta':p.el.closest('.ch-cite')?'ch-cite':'other';kinds[k]=(kinds[k]||0)+1});
          const words=ps.filter(p=>/\\d[\\d,]* words \\/ \\d+ min/.test(p.text)).length, yash=ps.filter(p=>/Yashvardhan/.test(p.text)).length;
          document.getElementById('gl-search').value='Yashvardhan';CP.Lookup.filter('Yashvardhan');const n=document.querySelector('#lk-mentions .lk-n');
          return {indexed:ps.length,nonPassages:bad.length,byKind:kinds,wordCountLines:words,citationLines:yash,rawSearchYashvardhan:n?n.textContent:'(none)',sample:bad.slice(0,3).map(p=>p.text.slice(0,90))};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': r['nonPassages'] == 0 and r['wordCountLines'] == 0 and r['citationLines'] == 0}


@test
def card_focus():
    """a11y #1: Enter on the 5th list entry; Tab presses from there to the card's first link"""
    p = page()
    try:
        p.go(BASE + '#/glossary', 6)
        p.ev("(()=>{const b=document.querySelectorAll('#lk-items li:not([hidden]) button')[4];b.focus();return b.textContent})()")
        p.key('Enter'); p.pump(0.4)
        r = {'afterEnter': p.ev("(()=>{const a=document.activeElement;return a.tagName+' '+(a.textContent||'').trim().slice(0,40)+' in card: '+!!a.closest('#lk-entry')})()")}
        n = 0
        for n in range(1, 701):
            p.key('Tab', gap=0)
            if p.ev("(()=>{const a=document.activeElement;return !!(a&&a.closest('#lk-entry')&&a.matches('a,button'))})()"): break
        r['tabsToFirstCardLink'] = n
        r['landedOn'] = p.ev("document.activeElement.textContent.trim().slice(0,60)")
        # the list as one tab stop: Tab from the search box into the list, then on out of it
        p.ev("document.getElementById('gl-search').focus()")
        stops = []
        for _ in range(4):
            p.key('Tab', gap=0)
            stops.append(p.ev("(()=>{const a=document.activeElement;return (a.closest('#lk-items')?'list: ':a.closest('#lk-entry')?'card: ':'')+a.tagName+' '+(a.textContent||a.id||'').trim().slice(0,30)})()"))
        r['tabFromSearch'] = stops
        p.ev("document.querySelector('#lk-items li:not([hidden]) button[tabindex=\"0\"], #lk-items li:not([hidden]) button').focus()")
        p.key('ArrowDown'); p.key('ArrowDown')
        r['arrowDownTwice'] = p.ev("document.activeElement.closest('#lk-items')?document.activeElement.textContent.trim().slice(0,40):'left the list'")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': r['tabsToFirstCardLink'] <= 3}


@test
def search_enter():
    """a11y #1 / QA: Enter in the Glossary search moves focus to the chosen entry, not to the page; the count is a polite status"""
    p = page()
    try:
        p.go(BASE + '#/glossary', 6)
        p.ev("document.getElementById('gl-search').focus()")
        p.type('hbm'); p.pump(0.4)
        whileTyping = p.ev("document.activeElement.id")
        p.key('Enter'); p.pump(0.5)
        r = p.ev("""(()=>{const a=document.activeElement,c=document.getElementById('lk-count');return {whileTyping:%s,active:a.tagName+(a.id?'#'+a.id:'')+' '+(a.textContent||'').trim().slice(0,30),
          inCard:!!a.closest('#lk-entry'),countRole:c.getAttribute('role'),countLive:c.getAttribute('aria-live'),count:c.textContent,selected:CP.Lookup.selected}})()""" % json.dumps(whileTyping))
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': r['inCard'] and r['whileTyping'] == 'gl-search' and r['countRole'] == 'status'}


@test
def company_links():
    """P1 #6: the Company page links for Lam Research and Wistron"""
    p = page()
    try:
        p.go(BASE + '#/glossary', 6)
        r = p.ev("""(()=>{const o={};for(const n of ['lam research','wistron']){const li=[...document.querySelectorAll('#lk-items li[data-kind="firm"]')].find(l=>l.querySelector('.lk-name').textContent.toLowerCase()===n);
          CP.Lookup.select(li.id,true);const a=[...document.querySelectorAll('#lk-card a')].find(x=>/Company page/.test(x.textContent));o[n]=a?a.getAttribute('href'):null;}return o;})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': all(v and '&amp;' not in v and '&' in v for v in r.values())}


@test
def supplier_ribbons():
    """P1-2 (A2): two Japan ribbons in a row keep the Japan filter"""
    p = page()
    try:
        p.go(BASE + '#/suppliers?tab=country', 6)
        r = p.ev(SLEEP + """(async()=>{const c=()=>document.getElementById('sup-count').textContent,o=[];
          const r=[...document.querySelectorAll('.sup-rib[data-c="JP"]')];r[0].dispatchEvent(new MouseEvent('click',{bubbles:true}));await sl(500);o.push(c());
          document.querySelector('.sup-tabs a[data-tab="country"]').click();await sl(700);const i=r.find(x=>x.dataset.i!==r[0].dataset.i).dataset.i;
          document.querySelector('.sup-rib[data-c="JP"][data-i="'+i+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));await sl(500);o.push(c());
          const s=document.getElementById('sup-count');return {counts:o,countRole:s.getAttribute('role'),countLive:s.getAttribute('aria-live')};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': all('Japan' in x for x in r['counts']) and r['countRole'] == 'status'}


@test
def supplier_glossary_links():
    """P1-2 (A3): ASML's 'In the supplier list', then Japan's 'Its firms in the supplier list'"""
    p = page()
    try:
        p.go(BASE, 6)
        r = p.ev(SLEEP + """(async()=>{location.hash='#/glossary';await sl(700);CP.Lookup.select('lk-firm-asml',true);await sl(100);
          document.querySelector('#lk-card a[data-sup]').click();await sl(900);const first=document.getElementById('sup-count').textContent,q1=document.getElementById('sup-search').value;
          location.hash='#/glossary';await sl(700);CP.Lookup.select('lk-country-jp',true);await sl(100);document.querySelector('#lk-card a[data-supcc]').click();await sl(900);
          const jp=CP.DATA.suppliers.filter(r=>r.country==='JP').length;
          return {asml:first,searchAfterAsml:q1,japan:document.getElementById('sup-count').textContent,searchAfterJapan:document.getElementById('sup-search').value,japanFirms:jp};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': r['japan'].startswith(str(r['japanFirms']) + ' of') and r['searchAfterJapan'] == '' and 'asml' in r['asml'].lower()}


@test
def table_sort_focus():
    """a11y #12: focus after pressing a sort header in Table mode"""
    p = page()
    try:
        p.go(BASE + '#/suppliers', 6)
        p.ev(SLEEP + "(async()=>{document.querySelector('.sup-mode[data-mode=\"table\"]').click();await sl(300);document.querySelector('#sup-table button[data-sort=\"country\"]').focus();})()")
        p.key('Enter'); p.pump(0.3)
        a = p.ev("(()=>{const a=document.activeElement,th=document.querySelector('#sup-table button[data-sort=\"country\"]').closest('th');return {active:a.tagName+' '+(a.getAttribute('data-sort')||''),thSort:th.getAttribute('aria-sort'),btnSort:document.querySelector('#sup-table button[data-sort=\"country\"]').getAttribute('aria-sort')}})()")
        p.key('Enter'); p.pump(0.3)
        b = p.ev("(()=>{const a=document.activeElement,th=document.querySelector('#sup-table button[data-sort=\"country\"]').closest('th');return {active:a.tagName+' '+(a.getAttribute('data-sort')||''),thSort:th.getAttribute('aria-sort')}})()")
        p.ev("document.querySelector('.sup-mode[data-mode=\"ladder\"]').click()")  # leave the saved mode as it was
    finally:
        errs = p.errors; p.close()
    return {'result': {'first': a, 'second': b}, 'errors': errs, 'pass': a['active'] == 'BUTTON country' and b['active'] == 'BUTTON country' and a['thSort'] == 'ascending' and b['thSort'] == 'descending'}


@test
def timeline_mentions():
    """P1-6: the Entity List card's Export Controls mentions link to their entries"""
    p = page()
    try:
        p.go(BASE + '#/glossary', 6)
        r = p.ev("""(()=>{CP.Lookup.select('gl-entity-list',true);const more=document.querySelector('#lk-mentions .lk-more button');if(more)more.click();
          const a=[...document.querySelectorAll('#lk-mentions a')].filter(x=>/Export Controls/.test(x.textContent));
          return {n:a.length,hrefs:[...new Set(a.map(x=>x.getAttribute('href')))].slice(0,8),resolve:a.map(x=>x.getAttribute('href')).filter(h=>h.indexOf('#/controls/')===0).every(h=>CP.DATA.timeline.some(e=>'#/controls/'+encodeURIComponent(e.id)===h))};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': r['n'] > 0 and all(h.startswith('#/controls/') for h in r['hrefs']) and r['resolve']}


@test
def popover_keyboard():
    """P1-7a / a11y #18: Tab from a glossary term reaches the popover's link; Tab again moves on; Shift+Tab and Escape come back"""
    out = {}
    for mob in (False, True):
        p = page(mobile=mob) if mob else page()
        try:
            p.go(BASE + '#lithography', 7)
            p.ev("(()=>{const b=document.querySelector('#lithography .prose button.gl-term');b.scrollIntoView({block:'center',behavior:'instant'});b.focus();})()")
            p.pump(0.3)
            where = "(()=>{const a=document.activeElement,t=document.getElementById('gl-tip');return (a.closest('#gl-tip')?'tip link: ':a.classList.contains('gl-term')?'term: ':'')+(a.textContent||'').trim().slice(0,30)+' | tip '+(t&&!t.hidden?'open':'closed')})()"
            r = {'start': p.ev(where)}
            p.key('Tab'); r['tab1'] = p.ev(where)
            p.key('Tab', shift=True); r['shiftTab'] = p.ev(where)
            p.key('Tab'); p.key('Tab'); r['tabFromLink'] = p.ev(where)
            p.key('Tab'); p.key('Escape'); r['escapeFromLink'] = p.ev(where)
            out['phone' if mob else 'desktop'] = r
        finally:
            out.setdefault('errors', []).extend(p.errors); p.close()
    d = out['desktop']
    out['pass'] = all(out[k]['tab1'].startswith('tip link') and out[k]['shiftTab'].startswith('term') and out[k]['escapeFromLink'].startswith('term') and out[k]['escapeFromLink'].endswith('closed')
                      and not out[k]['tabFromLink'].startswith('tip link') and out[k]['tabFromLink'] != out[k]['shiftTab'] for k in ('desktop', 'phone'))
    return out


@test
def stale_search():
    """P1-9: search has no Essay entry that opens Export Controls"""
    p = page()
    try:
        p.go(BASE, 6)
        r = p.ev("""(()=>{const idx=CP.Tools.buildIndex();const res=CP.Tools.search('who controls the chain');
          return {essayEntries:idx.filter(i=>i.kind==='Essay').map(i=>i.title+' -> '+i.href),top:res.hits.slice(0,4).map(i=>i.kind+' · '+i.title+' -> '+i.href)};})()""")
    finally:
        errs = p.errors; p.close()
    return {'result': r, 'errors': errs, 'pass': not r['essayEntries'] and not any(h.endswith('-> #/controls') for h in r['top'])}


@test
def tooltips():
    """a11y #10 (WCAG 1.4.13): the ribbon, China revenue and atlas tips close with Escape and can be hovered"""
    p = page()
    out = {}
    try:
        p.go(BASE + '#/suppliers?tab=country', 6)
        vis = "(()=>{const t=document.querySelector('%s');return t?{shown:!t.hidden,pe:getComputedStyle(t).pointerEvents}:null})()"
        # the ribbons: focus a stage, Escape
        p.ev("(()=>{document.getElementById('sup-pipe').scrollIntoView({block:'center',behavior:'instant'});const h=document.querySelector('.sup-hit[tabindex=\"0\"]');h.focus({preventScroll:true});})()"); p.pump(0.3)
        a = p.ev(vis % '#sup-tip'); p.key('Escape'); p.pump(0.2); b = p.ev(vis % '#sup-tip')
        # hover a ribbon, then move onto the tip itself
        pt = p.ev("(()=>{document.activeElement.blur();const h=document.querySelector('#sup-pipe');h.scrollIntoView({block:'center',behavior:'instant'});const r=[...document.querySelectorAll('.sup-rib[data-c=\"US\"]')][2].getBoundingClientRect();return [Math.round(r.left+r.width/2),Math.round(r.top+r.height/2)]})()")
        p.pump(0.4); p.mouse(pt[0], pt[1]); p.pump(0.3)
        tipr = p.ev("(()=>{const t=document.getElementById('sup-tip');if(t.hidden)return null;const r=t.getBoundingClientRect();return [Math.round(r.left+r.width/2),Math.round(r.top+r.height/2)]})()")
        hov = None
        if tipr:
            p.mouse((pt[0] + tipr[0]) // 2, (pt[1] + tipr[1]) // 2); p.mouse(tipr[0], tipr[1]); p.pump(0.6); hov = p.ev(vis % '#sup-tip')
        p.key('Escape'); p.pump(0.2); esc_hover = p.ev(vis % '#sup-tip')
        out['ribbons'] = {'onFocus': a, 'afterEscape': b, 'pointerOnTip': hov, 'escapeWhileHovered': esc_hover}
        # the atlas stops
        p.ev("(()=>{document.querySelector('.sa-stop').scrollIntoView({block:'center',behavior:'instant'});})()"); p.pump(0.4)
        p.ev("document.querySelector('.sa-stop').focus({preventScroll:true})"); p.pump(0.3)
        a = p.ev(vis % '.sa-stop-tip'); p.key('Escape'); p.pump(0.2); b = p.ev(vis % '.sa-stop-tip')
        out['atlas'] = {'onFocus': a, 'afterEscape': b}
        # the China revenue bars
        p.ev("location.hash='#/exposure'"); p.pump(1.5)
        p.ev("(()=>{const a=document.querySelector('#exposure-viz a [data-firm]').closest('a');a.scrollIntoView({block:'center',behavior:'instant'});a.focus();})()"); p.pump(0.3)
        a = p.ev(vis % '.ex-tip'); p.key('Escape'); p.pump(0.2); b = p.ev(vis % '.ex-tip')
        pt = p.ev("(()=>{document.activeElement.blur();const bars=[...document.querySelectorAll('#exposure-viz [data-firm]')].slice(0,40);bars.sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height);const el=bars[0];el.scrollIntoView({block:'center',behavior:'instant'});const r=el.getBoundingClientRect();return [Math.round(r.left+r.width/2),Math.round(r.top+r.height/2)]})()")
        p.pump(0.3)
        p.mouse(pt[0], pt[1]); p.pump(0.3)
        tipr = p.ev("(()=>{const t=document.querySelector('.ex-tip');if(t.hidden)return null;const r=t.getBoundingClientRect();return [Math.round(r.left+r.width/2),Math.round(r.top+r.height/2)]})()")
        hov = None
        if tipr:
            p.mouse(pt[0], (pt[1] + tipr[1]) // 2); p.mouse(tipr[0], tipr[1]); p.pump(0.6); hov = p.ev(vis % '.ex-tip')
        out['china'] = {'onFocus': a, 'afterEscape': b, 'pointerOnTip': hov}
    finally:
        out['errors'] = p.errors; p.close()
    ok = all(out[k]['onFocus'] and out[k]['onFocus']['shown'] and not out[k]['afterEscape']['shown'] for k in ('ribbons', 'atlas', 'china'))
    ok = ok and all(out[k]['pointerOnTip'] and out[k]['pointerOnTip']['shown'] for k in ('ribbons', 'china')) and not out['ribbons']['escapeWhileHovered']['shown']
    out['pass'] = ok
    return out


@test
def ribbon_click_real():
    """the tips take a mouse pointer now: a real click on a ribbon (and a tap on a phone) still reaches the ribbon"""
    out = {}
    for mob in (False, True):
        p = page(mobile=mob) if mob else page()
        try:
            p.go(BASE + '#/suppliers?tab=country', 6)
            pt = p.ev("""(()=>{document.getElementById('sup-pipe').scrollIntoView({block:'center',behavior:'instant'});
              const rs=[...document.querySelectorAll('.sup-rib[data-c="JP"]')];for(const r of rs){const b=r.getBoundingClientRect();
              for(let fx=0.15;fx<0.9;fx+=0.05){for(let fy=0.1;fy<0.95;fy+=0.1){const x=b.left+b.width*fx,y=b.top+b.height*fy;const el=document.elementFromPoint(x,y);if(el===r)return [Math.round(x),Math.round(y),r.dataset.i];}}}return null})()""")
            p.pump(0.4)
            if mob:
                p.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': pt[0], 'y': pt[1]}]})
                p.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                p.mouse(pt[0], pt[1]); p.pump(0.3); p.click(pt[0], pt[1])
            p.pump(0.8)
            out['phone' if mob else 'desktop'] = p.ev("(()=>({count:document.getElementById('sup-count').textContent,stage:CP.Suppliers.stage,country:CP.Suppliers.country}))()")
        finally:
            out.setdefault('errors', []).extend(p.errors); p.close()
    out['pass'] = all(out[k]['country'] == 'JP' and out[k]['stage'] for k in ('desktop', 'phone'))
    return out


if __name__ == '__main__':
    names = only or list(TESTS)
    res = {}
    path = os.path.join(HERE, label + '.json')
    if os.path.exists(path):
        try: res = json.load(open(path))
        except Exception: res = {}
    for n in names:
        t0 = time.time()
        try:
            res[n] = TESTS[n]()
        except Exception as e:
            res[n] = {'crash': repr(e)[:400], 'pass': False}
        res[n]['doc'] = TESTS[n].__doc__
        print(f"{n:24s} {'PASS' if res[n].get('pass') else 'FAIL'}  ({time.time() - t0:.0f}s)")
        print('   ', json.dumps({k: v for k, v in res[n].items() if k not in ('doc',)})[:900])
        json.dump(res, open(path, 'w'), indent=1)
