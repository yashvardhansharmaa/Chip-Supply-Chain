#!/usr/bin/env node
/* The home page and the Introduction, driven as a reader would (23 Nov 2026: the home is the owner's "V", the drawing alone,
   src/modules/frontispiece.js; the walk that ran under the old home's hero is the Introduction's page, /introduction/; until
   then this script drove the old hero's chain at a glance). Checked with DevTools mouse, touch and key events rather than
   script clicks:
   The home (1440 and 390):
     - the title, the subtitle and the one link to the Introduction, its minutes the walk's own;
     - the menu: Intro first, no Home, no tab marked on the home, the wordmark named "Chip Supply Chain, home";
     - sixteen objects drawn (the fourteen stages and, since 24 Nov 2026, the two chapters across the chain), a numbered callout
       for each and a label for final test, each linking to its chapter; the solid balloons are the stages the data rates
       Extreme (seven since the owner kept the 65 percent rule), and the key counts them in the approved short form of the
       cards' note, ending "of its market" (design review, 23 Nov 2026; the reader test, 24 Nov 2026);
     - final test: its label reads "12 · Final test" with no numbered circle, its leader leaves from the label's edge nearest
       the station, and a click opens Test and Assembly;
     - the two chapters across the chain (home option A, 24 Nov 2026): drawn in the top-right corner under the "Across the
       chain" label and its rule (on a phone after the rack, side by side under the rule), balloons 15 and 16 linked and named as
       the chapters are; pointing at one (or a tap on a phone) lights it, its one-line summary in the lit row and the whole line
       lit, a drag turns it and it settles back, a click opens its chapter;
     - the list of stages the drawing is made from (the page without scripts) stays out of sight, and no stage, rail or Back to
       top shows beside the drawing;
     - a laptop: pointing at a callout lights its stage (the object lifts, the lit row names it, marks a chokepoint, lists its
       first three firms and one sentence its chapter states), the arrow keys walk the stages and turn the lit object, a drag
       turns it and it eases back, a click opens the chapter;
     - a phone: a first tap on a callout lights its stage and the lit row rides at the foot of the screen; the second opens it;
     - the thin footer: one row, its "How to cite" toggle opens the citation and Escape closes it.
   The Introduction (1440 and 390): its title and the read's length, the sixteen steps with the chokepoint mark on the
   chokepoints alone, the flashcards and Other pages (no Home), Intro marked in the menu, the specimen beside the walk with its
   chapter's labels and parts' names, and the old addresses: /#/walk/<chapter>, /#/intro, /intro/ and /summary/ land on it,
   /home/ on the home.
   usage: node qa/redesign/interact.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8766').replace(/\/$/, '');
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`); if (!ok) bad++; };
  try {
    for (const width of [1440, 390]) {
      const phone = width < 900;
      const t = await open(chrome, BASE + '/?shot=1', { width, wait: 3000 });
      const key = async (k, code, vk) => {
        await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk });
        await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); await sleep(300);
      };
      const mouse = async (type, p, extra) => t.s('Input.dispatchMouseEvent', Object.assign({ type, x: p.x, y: p.y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 }, extra || {}));
      const tap = async (p) => { await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] }); await sleep(60); await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
      // the centre of a callout's balloon, brought on screen first
      const ball = async (n) => t.ev(`(function(){var b=document.querySelector('.fx-co[data-n="${n}"] .fx-co-b'),r=b.getBoundingClientRect();if(r.top<120||r.bottom>innerHeight-200){b.scrollIntoView({block:'center'});r=b.getBoundingClientRect();}return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()`);

      // the centre of final test's label (it has no balloon), brought on screen first
      const ftLab = async () => t.ev(`(function(){var b=document.querySelector('.fx-co[data-n="12f"] .fx-co-nm'),r=b.getBoundingClientRect();if(r.top<120||r.bottom>innerHeight-200){b.scrollIntoView({block:'center'});r=b.getBoundingClientRect();}return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()`);

      // the home as built
      const facts = await t.ev(`(function(){
        var D = window.CP_DATA || {}, st = (D.chapters || []).filter(function (c) { return c.stage; });
        var cos = [].slice.call(document.querySelectorAll('.fx-co')), solid = cos.filter(function (c) { return c.querySelector('.fx-co-b') && getComputedStyle(c.querySelector('.fx-co-b')).backgroundColor === getComputedStyle(document.body).color; });
        var want = st.filter(function (c) { return c.concentration === 'Extreme'; }).map(function (c, i) { return c.id; });
        var tabs = [].slice.call(document.querySelectorAll('.masthead .tabs a')).map(function (a) { return a.textContent.trim(); });
        var intro = document.querySelector('.fx-intro a'), meta = null;
        return { title: (document.querySelector('.fx-head .wk-title') || {}).textContent, dek: (document.querySelector('.fx-head .wk-dek') || {}).textContent,
          intro: intro ? [intro.textContent, intro.getAttribute('href')] : null, tabs: tabs, current: document.querySelectorAll('.masthead .tabs a[aria-current]').length,
          wordmark: document.querySelector('.wordmark').getAttribute('aria-label'), objs: document.querySelectorAll('.fx-objs canvas.fx-o').length,
          objSized: [].slice.call(document.querySelectorAll('.fx-objs canvas.fx-o')).filter(function (c) { return c.width > 10 && c.height > 10; }).length,
          cos: cos.length, links: cos.map(function (c) { return c.querySelector('a').getAttribute('href'); }),
          solid: solid.map(function (c) { var a = c.querySelector('a').getAttribute('href'); return a.replace(/\\/$/, ''); }), want: want, stages: st.map(function (c) { return [c.id, c.title]; }),
          key: (document.querySelector('.fx-key') || {}).textContent || '',
          across: ['15', '16'].map(function (n) { var a = document.querySelector('.fx-co[data-n="' + n + '"] a'); return a ? [a.getAttribute('href'), (a.getAttribute('aria-label') || '').split('. ')[0], (a.querySelector('.fx-co-b') || {}).textContent] : null; }),
          acrossWant: (D.chapters || []).filter(function (c) { return !c.stage && c.number; }).sort(function (a, b) { return a.number - b.number; }).map(function (c) { return [c.id + '/', c.title, String(c.number)]; }),
          acrossLab: (function () { var l = document.querySelector('.fx-in > .fx-across-lab'); return l ? [l.textContent, getComputedStyle(l).borderBottomStyle, Math.round(l.getBoundingClientRect().width)] : null; })(),
          acrossLinks: document.querySelectorAll('.fx-across a').length,
          ft: (function () { var c = document.querySelector('.fx-co[data-n="12f"]'), a = c && c.querySelector('a'), nm = c && c.querySelector('.fx-co-nm'), ld = document.querySelector('.fx-ld[data-n="12f"] path'), st = document.querySelector('.fx-ft');
            if (!c || !nm || !ld || !st) return null;
            var q = nm.getBoundingClientRect(), s = st.getBoundingClientRect(), d = ld.getAttribute('d').match(/-?[\\d.]+/g).map(Number), base = document.querySelector('.fx-leads').getBoundingClientRect();
            var p0 = [d[0] + base.left, d[1] + base.top], sc = [s.left + s.width / 2, s.top + s.height / 2];
            // the leader's start: on or just off the label's box, at the box's point nearest the station
            var nx = Math.max(q.left, Math.min(q.right, sc[0])), ny = Math.max(q.top, Math.min(q.bottom, sc[1]));
            return { text: nm.textContent, ball: !!c.querySelector('.fx-co-b'), href: a.getAttribute('href'), off: Math.round(Math.hypot(p0[0] - nx, p0[1] - ny)),
              toward: Math.hypot(sc[0] - p0[0], sc[1] - p0[1]) < Math.hypot(sc[0] - (q.left + q.right) / 2, sc[1] - (q.top + q.bottom) / 2) }; })(),
          place: (function () { var b = function (n) { var r = window.FX.objs[n].cv.getBoundingClientRect(), o = window.FX.objs[n].box, ir = document.querySelector('.fx-in').getBoundingClientRect(); return { x0: Math.round(o.x0 + ir.left), x1: Math.round(o.x1 + ir.left), y0: Math.round(o.y0 + ir.top), y1: Math.round(o.y1 + ir.top) }; };
            var l = document.querySelector('.fx-in > .fx-across-lab').getBoundingClientRect(), hd = document.querySelector('.fx-head').getBoundingClientRect();
            return { rack: b(13), x15: b(14), x16: b(15), lab: { x0: Math.round(l.left), x1: Math.round(l.right), y0: Math.round(l.top), y1: Math.round(l.bottom) }, head: Math.round(hd.right), sheetR: Math.round(document.querySelector('.fx-in').getBoundingClientRect().right) }; })(),
          glance: getComputedStyle(document.querySelector('#wk-hero .wk-gl')).display, stage: getComputedStyle(document.querySelector('.stage')).display,
          rail: !!document.querySelector('#wk-rail'), toTop: getComputedStyle(document.querySelector('.to-top')).display };
      })()`);
      check(`${width}: the title, the subtitle and the link to the Introduction`, facts.title === 'How AI chips are made' && facts.dek === 'An introduction to the entire semiconductor supply chain.' && !!facts.intro && /^Read the \d+-minute introduction$/.test(facts.intro[0]) && facts.intro[1] === 'introduction/', JSON.stringify(facts.intro));
      check(`${width}: the menu has Intro first and no Home, nothing marked on the home, and the wordmark is the way home`, facts.tabs[0] === 'Intro' && facts.tabs.indexOf('Home') < 0 && facts.tabs.join('|') === 'Intro|Supply Chain|AI Chips|Suppliers|Export Controls|Glossary' && facts.current === 0 && facts.wordmark === 'Chip Supply Chain, home', JSON.stringify({ tabs: facts.tabs, current: facts.current, wordmark: facts.wordmark }));
      check(`${width}: sixteen objects drawn, the fourteen stages and the two chapters across the chain`, facts.objs === 16 && facts.objSized === 16, `${facts.objs} canvases, ${facts.objSized} drawn`);
      const wantLinks = facts.stages.map((s) => s[0] + '/'); wantLinks.splice(12, 0, 'test-and-assembly/'); facts.acrossWant.forEach((c) => wantLinks.push(c[0]));
      check(`${width}: a callout for each stage, for final test and for the two across the chain, each linking to its chapter`, facts.cos === 17 && JSON.stringify(facts.links) === JSON.stringify(wantLinks), facts.links.join(' '));
      check(`${width}: final test reads "12 · Final test" with no numbered circle, links to Test and Assembly, and its leader leaves from the label's edge nearest the station`,
        !!facts.ft && facts.ft.text === '12 · Final test' && !facts.ft.ball && facts.ft.href === 'test-and-assembly/' && facts.ft.off <= 4 && facts.ft.toward, JSON.stringify(facts.ft));
      const solidIds = facts.solid.filter((h, i, a) => a.indexOf(h) === i);
      check(`${width}: the solid balloons are the stages the data rates Extreme (seven)`, JSON.stringify(solidIds) === JSON.stringify(facts.want) && facts.want.length === 7, solidIds.join(' '));
      check(`${width}: the key counts the chokepoints in the approved short form of the cards' note`, facts.key.indexOf(`${facts.want.length} of the ${facts.stages.length} stages are chokepoints: three or fewer firms, or one with more than 65 percent of its market.`) === 0 && /Objects drawn at different scales\.$/.test(facts.key), facts.key);
      check(`${width}: the two chapters across the chain, drawn with balloons 15 and 16, linked and named as the chapters are, the corner's text links gone`, JSON.stringify(facts.across) === JSON.stringify(facts.acrossWant) && facts.acrossLinks === 0, JSON.stringify(facts.across));
      const P = facts.place;
      check(`${width}: "Across the chain" stands over its thin rule, as wide as the two`, !!facts.acrossLab && facts.acrossLab[0] === 'Across the chain' && facts.acrossLab[1] === 'solid'
        && P.lab.x0 <= Math.min(P.x15.x0, P.x16.x0) + 40 && P.lab.x1 >= Math.max(P.x15.x1, P.x16.x1) - 4 && P.lab.y1 <= Math.min(P.x15.y0, P.x16.y0) + 4, JSON.stringify({ lab: facts.acrossLab, P }));
      if (!phone) check(`${width}: the two stand in the top-right corner, past the rack, above it and clear of the title`, P.x15.y1 < P.rack.y0 && P.x16.y1 < P.rack.y0 && P.x15.x0 > P.head && P.x16.x1 <= P.sheetR + 2 && P.x15.x1 <= P.x16.x0 && Math.abs(P.x15.y1 - P.x16.y1) <= 3, JSON.stringify(P));
      else check(`${width}: on a phone the two sit after the rack, side by side under the rule`, P.x15.y0 > P.rack.y1 && P.x16.y0 > P.rack.y1 && P.x15.x1 <= P.x16.x0 && Math.abs(P.x15.y1 - P.x16.y1) <= 3 && P.lab.y0 > P.rack.y1, JSON.stringify(P));
      check(`${width}: the list of stages stays out of sight, and no stage, rail or Back to top shows beside the drawing`, facts.glance === 'none' && facts.stage === 'none' && !facts.rail && facts.toTop === 'none', JSON.stringify({ glance: facts.glance, stage: facts.stage, rail: facts.rail, toTop: facts.toTop }));

      // lighting a stage: the object lifts, the lit row names it, marks a chokepoint, lists its firms and one sentence its chapter states
      const lit = (i) => t.ev(`(function(){
        var D = window.CP_DATA || {}, st = (D.chapters || []).filter(function (c) { return c.stage; }), c = st[${i}], f = document.querySelector('.fx-facts');
        var line = (document.querySelector('.fx-f1-one') || {}).textContent || '', norm = function (s) { return String(s || '').replace(/[’‘]/g, "'"); };
        return { n: f.getAttribute('data-n'), t: (document.querySelector('.fx-f1-t') || {}).textContent, href: (document.querySelector('.fx-f1-t') || { getAttribute: function () { return ''; } }).getAttribute('href'),
          mark: !!document.querySelector('.fx-f1-m .fx-f1-w'), choke: c.concentration === 'Extreme', firms: (document.querySelector('.fx-f1-firms') || {}).textContent,
          want: (c.leaders || []).slice(0, 3).map(function (l) { return l.name; }).join(', '), title: c.title, id: c.id, line: line,
          stated: !!line && (norm(c.oneLiner).indexOf(norm(line)) >= 0 || norm(c.plain).indexOf(norm(line)) >= 0),
          lift: window.FX ? window.FX.objs[${i}].lift : null, sticky: getComputedStyle(f).position, fb: Math.round(f.getBoundingClientRect().bottom), vh: innerHeight };
      })()`);
      if (!phone) {
        const wrongLit = [];
        for (let i = 0; i < 14; i++) {
          const n = String(i + 1).padStart(2, '0');
          await mouse('mouseMoved', await ball(n)); await sleep(i ? 300 : 900);
          const L = await lit(i);
          if (L.n !== n || L.t !== L.title || L.href !== L.id + '/' || L.mark !== L.choke || L.firms !== L.want || !L.stated) wrongLit.push(`${n} ${JSON.stringify(L)}`);
          if (i === 0) check(`${width}: pointing at a callout lifts its object`, L.lift > 0.5, String(L.lift));
        }
        check(`${width}: each stage lights its row: name and link, the chokepoint mark on chokepoints alone, its first three firms, one sentence its chapter states`, !wrongLit.length, wrongLit.slice(0, 3).join(' | '));
        // the keyboard: focus a callout, Down walks the stages, Right turns the lit object, which eases back
        await t.ev("(document.querySelector('.fx-co[data-n=\"04\"] a').focus(), 1)"); await sleep(900);
        check(`${width}: a focused callout lights its stage`, (await lit(3)).n === '04');
        await key('ArrowDown', 'ArrowDown', 40); await sleep(600);
        check(`${width}: Down walks to the next stage`, (await lit(4)).n === '05' && await t.ev("document.activeElement === document.querySelector('.fx-co[data-n=\"05\"] a')"));
        await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 }); await sleep(200);
        const yawK = await t.ev('window.FX.objs[4].yaw');
        await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 }); await sleep(2200);
        check(`${width}: Right turns the lit object and it eases back`, Math.abs(yawK) > 0.05 && Math.abs(await t.ev('window.FX.objs[4].yaw')) < 0.01, `turned ${yawK.toFixed ? yawK.toFixed(3) : yawK}`);
        // a drag on the lit object turns it, and it eases back on release (the labels-free sheet: the object itself)
        await t.ev('(document.activeElement.blur(), 1)');
        const objP = await t.ev("(function(){var o=window.FX.objs[7],r=o.cv.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height*0.6)};})()");
        await mouse('mouseMoved', objP); await sleep(900);
        await mouse('mousePressed', objP); await sleep(60);
        for (let k = 1; k <= 6; k++) { await mouse('mouseMoved', { x: objP.x + k * 14, y: objP.y }, { buttons: 1 }); await sleep(40); }
        const yawD = await t.ev('window.FX.objs[7].yaw');
        await mouse('mouseReleased', { x: objP.x + 84, y: objP.y }); await sleep(1200);
        check(`${width}: a drag turns the lit object and it eases back on release`, Math.abs(yawD) > 0.1 && Math.abs(await t.ev('window.FX.objs[7].yaw')) < 0.01 && (await lit(7)).n === '08', `turned ${typeof yawD === 'number' ? yawD.toFixed(3) : yawD}`);
        // the two across the chain: pointing lights each, its row gives its title, "Across the chain" and its one-line summary,
        // and the whole line lights; a drag turns it and it settles back
        const litX = (n) => t.ev(`(function(){
          var D = window.CP_DATA || {}, c = (D.chapters || []).filter(function (x) { return x.number === ${+n}; })[0] || {}, f = document.querySelector('.fx-facts'), norm = function (s) { return String(s || '').replace(/[’‘]/g, "'"); };
          return { n: f.getAttribute('data-n'), t: (document.querySelector('.fx-f1-t') || {}).textContent, href: (document.querySelector('.fx-f1-t') || { getAttribute: function () { return ''; } }).getAttribute('href'),
            x: (document.querySelector('.fx-f1-x') || {}).textContent, line: norm((document.querySelector('.fx-f1-one') || {}).textContent), want: norm(c.oneLiner), title: c.title, id: c.id,
            all: document.querySelector('.fx-ground').classList.contains('is-all'), lift: window.FX.objs[${+n - 1}].lift, backs: [].slice.call(document.querySelectorAll('.fx-objs canvas.is-back')).length };
        })()`);
        for (const n of ['15', '16']) {
          await mouse('mouseMoved', { x: 5, y: 500 }); await sleep(600);
          await mouse('mouseMoved', await ball(n)); await sleep(1000);
          const X = await litX(n);
          check(`${width}: pointing at ${n} lights it: its title, "Across the chain", its one-line summary, the whole line lit`, X.n === n && X.t === X.title && X.href === X.id + '/' && X.x === 'Across the chain' && X.line === X.want && X.all && X.lift > 0.5 && X.backs === 1, JSON.stringify(X));
          const oP = await t.ev(`(function(){var o=window.FX.objs[${+n - 1}],b=o.box,r=document.querySelector('.fx-in').getBoundingClientRect();return {x:Math.round(r.left+(b.x0+b.x1)/2),y:Math.round(r.top+b.y0*0.4+b.y1*0.6-o.lift*12)};})()`);
          await mouse('mouseMoved', oP); await sleep(500);
          await mouse('mousePressed', oP); await sleep(60);
          for (let k = 1; k <= 6; k++) { await mouse('mouseMoved', { x: oP.x - k * 12, y: oP.y }, { buttons: 1 }); await sleep(40); }
          const yawX = await t.ev(`window.FX.objs[${+n - 1}].yaw`);
          await mouse('mouseReleased', { x: oP.x - 72, y: oP.y }); await sleep(1200);
          check(`${width}: a drag turns ${n} and it settles back on release`, Math.abs(yawX) > 0.1 && Math.abs(await t.ev(`window.FX.objs[${+n - 1}].yaw`)) < 0.01, `turned ${typeof yawX === 'number' ? yawX.toFixed(3) : yawX}`);
        }
        const p15 = await ball('15');
        await mouse('mouseMoved', p15); await sleep(300); await mouse('mousePressed', p15); await mouse('mouseReleased', p15); await sleep(2500);
        check(`${width}: a click on 15 opens its chapter`, await t.ev("location.pathname === '/component-costs/'"), await t.ev('location.pathname'));
        await t.ev('(history.back(), 1)'); await sleep(2500);
        const pft = await ftLab();
        await mouse('mouseMoved', pft); await sleep(300); await mouse('mousePressed', pft); await mouse('mouseReleased', pft); await sleep(2500);
        check(`${width}: a click on "12 · Final test" opens Test and Assembly`, await t.ev("location.pathname === '/test-and-assembly/'"), await t.ev('location.pathname'));
        await t.ev('(history.back(), 1)'); await sleep(2500);
        // a click on a callout opens its chapter
        const p = await ball('09');
        await mouse('mouseMoved', p); await sleep(300); await mouse('mousePressed', p); await mouse('mouseReleased', p); await sleep(2500);
        check(`${width}: a click on a callout opens its chapter`, await t.ev("location.pathname === '/memory-and-hbm/'"), await t.ev('location.pathname'));
        await t.ev('(history.back(), 1)'); await sleep(2500);
      } else {
        // a phone: a first tap lights the stage, the lit row rides at the foot of the screen; a second tap opens the chapter
        const p = await ball('04'); await sleep(300);
        await tap(p); await sleep(1200);
        const L = await lit(3);
        check(`${width}: a first tap on a callout lights its stage and stays on the home`, L.n === '04' && L.t === L.title && L.mark === L.choke && L.stated && await t.ev("location.pathname === '/'"), JSON.stringify({ n: L.n, t: L.t }));
        check(`${width}: the lit row rides at the foot of the screen`, L.sticky === 'sticky' && Math.abs(L.fb - L.vh) <= 2, `${L.sticky}, bottom ${L.fb} of ${L.vh}`);
        const hit = await t.ev("(function(){var a=document.querySelector('.fx-co[data-n=\"06\"] .fx-co-a'),s=getComputedStyle(a,'::before'),r=a.getBoundingClientRect();return Math.round(r.height+parseFloat(s.getPropertyValue('--hit-t')||14)+parseFloat(s.getPropertyValue('--hit-b')||14));})()");
        check(`${width}: a callout's target is at least 44 px tall where nothing stands close above or below it`, hit >= 44, hit + ' px');
        await tap(await ball('04')); await sleep(2500);
        check(`${width}: a second tap opens its chapter`, await t.ev("location.pathname === '/lithography/'"), await t.ev('location.pathname'));
        await t.ev('(history.back(), 1)'); await sleep(2500);
        // the two across the chain: a first tap on 16 lights it and its one-line summary rides at the foot; a second opens it
        await tap(await ball('16')); await sleep(1200);
        const X16 = await t.ev(`(function(){var D = window.CP_DATA || {}, c = (D.chapters || []).filter(function (x) { return x.number === 16; })[0] || {}, f = document.querySelector('.fx-facts'), norm = function (s) { return String(s || '').replace(/[’‘]/g, "'"); };
          return { n: f.getAttribute('data-n'), t: (document.querySelector('.fx-f1-t') || {}).textContent, title: c.title, line: norm((document.querySelector('.fx-f1-one') || {}).textContent) === norm(c.oneLiner), sticky: getComputedStyle(f).position, path: location.pathname };})()`);
        check(`${width}: a first tap on 16 lights it, its one-line summary in the lit row, and stays on the home`, X16.n === '16' && X16.t === X16.title && X16.line && X16.sticky === 'sticky' && X16.path === '/', JSON.stringify(X16));
        await tap(await ball('16')); await sleep(2500);
        check(`${width}: a second tap on 16 opens its chapter`, await t.ev("location.pathname === '/geopolitics/'"), await t.ev('location.pathname'));
        await t.ev('(history.back(), 1)'); await sleep(2500);
      }

      // the thin footer: one row, How to cite opens the citation, Escape closes it
      await t.ev('(document.documentElement.style.scrollBehavior="auto", window.scrollTo(0, document.documentElement.scrollHeight), 1)'); await sleep(600);
      const ft = await t.ev("(function(){var f=document.querySelector('.view[data-view=\"walk\"] .site-footer'),b=f.querySelector('.ft-cite-btn'),r=b.getBoundingClientRect();return {row:f.classList.contains('ft-row'),label:b.textContent,shown:!b.hidden,x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),h:Math.round(f.getBoundingClientRect().height)};})()");
      check(`${width}: the thin footer, its toggle named and shown`, ft.row && ft.label === 'How to cite' && ft.shown && ft.h <= (phone ? 120 : 64), JSON.stringify(ft));
      await mouse('mousePressed', ft); await mouse('mouseReleased', ft); await sleep(400);
      check(`${width}: How to cite opens the citation under it`, await t.ev("(function(){var f=document.querySelector('.view[data-view=\"walk\"] .site-footer'),b=f.querySelector('.ft-cite-btn'),p=document.getElementById(b.getAttribute('aria-controls'));return b.getAttribute('aria-expanded')==='true'&&!p.hidden&&p.querySelectorAll('pre').length===2&&/Sharma, Yashvardhan/.test(p.textContent);})()"));
      await key('Escape', 'Escape', 27);
      check(`${width}: Escape closes it`, await t.ev("document.querySelector('.view[data-view=\"walk\"] .ft-cite-btn').getAttribute('aria-expanded')==='false'"));
      t.errors.forEach((e) => check(`${width}: page error on the home`, false, e));
      await t.close();

      // the Introduction
      const u = await open(chrome, BASE + '/introduction/', { width, wait: 3000 });
      const intro = await u.ev(`(function(){
        var steps = [].slice.call(document.querySelectorAll('.wk-step')), marks = steps.filter(function (s) { return !!s.querySelector('.wk-foot .cpk'); }).map(function (s) { return s.id.replace('/walk/', ''); });
        var tabs = [].slice.call(document.querySelectorAll('.masthead .tabs a')).map(function (a) { return a.textContent.trim(); });
        return { title: document.querySelector('.wk-title').textContent, meta: document.querySelector('.wk-meta').textContent, steps: steps.length, marks: marks,
          deck: !!document.getElementById('intro--flashcards'), other: [].slice.call(document.querySelectorAll('.wk-tabs a .wk-tab')).map(function (b) { return b.textContent; }),
          tabs: tabs, cur: (document.querySelector('.masthead .tabs a[aria-current]') || {}).textContent, doc: document.title, view: document.documentElement.getAttribute('data-view'),
          stage: CP.Stage.cur && CP.Stage.cur.name, labels: CP.Stage.cur ? CP.Stage.cur.pl.m.callouts.length : 0, mode: JSON.stringify(CP.Stage.mode()) };
      })()`);
      check(`${width}: the Introduction's title and the read's length`, intro.title === 'Introduction' && /^[\d,]+ wordsabout \d+ min$/.test(intro.meta) && intro.doc === 'Introduction · Chip Supply Chain', `${intro.meta} / ${intro.doc}`);
      check(`${width}: sixteen steps, the chokepoint mark on the seven chokepoints alone`, intro.steps === 16 && JSON.stringify(intro.marks) === JSON.stringify(facts.want), intro.marks.join(' '));
      check(`${width}: the flashcards and Other pages, with no Home`, intro.deck && intro.other.join('|') === 'Supply Chain|AI Chips|Suppliers|Export Controls|Glossary', intro.other.join('|'));
      check(`${width}: Intro is marked in the menu`, intro.cur === 'Intro' && intro.tabs.indexOf('Home') < 0, intro.cur);
      if (!phone) {
        check(`${width}: the specimen beside the walk opens on chip design, with its labels`, intro.view === 'walk' && intro.stage === 'die-floorplan' && intro.labels > 0 && !/noLabels/.test(intro.mode), JSON.stringify({ stage: intro.stage, mode: intro.mode }));
        await u.ev("(function(){var e=document.getElementById('/walk/lithography');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+scrollY-120);window.dispatchEvent(new Event('scroll'));return 1;})()"); await sleep(1800);
        const litho = await u.ev("({name:CP.Stage.cur.name, names:CP.Stage.cur.pl.m.callouts.map(function(c){return c.text;}).join('|')})");
        check(`${width}: at step 04 the EUV scanner shows, its numbered parts named as the chapter names them`, litho.name === 'euv-scanner' && /Light source/i.test(litho.names), litho.names);
      }
      u.errors.forEach((e) => check(`${width}: page error on the Introduction`, false, e));
      await u.close();
    }

    // the old addresses
    for (const [from, want] of [['/#/walk/lithography', '/introduction/#/walk/lithography'], ['/#/intro', '/introduction/'], ['/intro/', '/introduction/'], ['/summary/', '/introduction/'], ['/home/', '/']]) {
      const v = await open(chrome, BASE + from, { width: 1440, wait: 3000 });
      const at = await v.ev('location.pathname + location.hash');
      let landed = true;
      if (/walk\/lithography/.test(want)) landed = await v.ev("(function(){var e=document.getElementById('/walk/lithography'),t=e.getBoundingClientRect().top;return t>40&&t<260;})()");
      check(`${from} lands on ${want}`, at === want && landed, at);
      await v.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n')); console.log(bad ? `\n${bad} failed` : '\nall passed'); process.exit(bad ? 1 : 0);
})();
