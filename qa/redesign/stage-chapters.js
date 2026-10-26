#!/usr/bin/env node
/* One chapter per address (design round three, recommendation 1): the checks, on the redesign's preview (127.0.0.1:8766).
   Each check drives the app as a reader would, by its links, buttons and the browser's Back and Forward (DevTools mouse
   events, not script clicks), and prints PASS or FAIL with what it measured:
     1. every chapter opens alone at its address, at its top, under its own tab title, and before boot no other chapter
        paints (the page arrives slowly, so src/preroute.js has frames to get wrong);
     2. a section and a figure address in another chapter open that chapter at that place, by a link and on a fresh load;
        a link in a chapter's text to another chapter opens it at its top;
     3. the door goes to the next chapter's top, Back returns to the place left, Forward to the next chapter again; the same
        through the rail, and Back from another view;
     4. a search result inside another chapter lands on its section;
     5. a Glossary passage link lands on its passage;
     6. a Suppliers link to a stage lands on that chapter (AI Chips has no link to a stage);
     7. print emulation of #/chain (and of a chapter's address) shows all 17 chapters, the head and the contents;
     8. the page's height at 1440 for one chapter, against the whole chain's;
   and every other way in: the home page, a look-up card, Export Controls, the phone's contents sheet and slim bar, the
   specimen strip's Top, and #/chain from a chapter.
   usage: node qa/redesign/stage-chapters.js [--base http://127.0.0.1:8766] [--only 1,3] > qa/redesign/stage-chapters.txt
   Nothing leaves this machine (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8766').replace(/\/$/, '');
const ONLY = (opt('only', '') || '').split(',').filter(Boolean);
const results = [];
const report = (n, name, pass, detail) => { results.push({ n, name, pass }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${n}. ${name}${detail ? '\n        ' + detail : ''}`); };

// before boot: which of The Chain's chapters (and its contents) paint, frame by frame, until the router takes over
const WATCH = `(function () {
  var seen = window.__seen = {};
  var look = function () {
    var html = document.documentElement;
    document.querySelectorAll('.view[data-view="stack"] > article.chapter').forEach(function (a) { if (a.getClientRects().length) seen[a.id] = 1; });
    var c = document.getElementById('contents'); if (c && c.getClientRects().length && !html.classList.contains('booted')) seen.contents = 1;
    if (!html.classList.contains('booted')) requestAnimationFrame(look);
  };
  requestAnimationFrame(look);
  document.addEventListener('DOMContentLoaded', look);
})();`;

async function tab(chrome, url, o = {}) {
  const width = o.width || 1440, phone = width < 768, height = o.height || (phone ? 844 : 900);
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => chrome.send(m, p, sessionId);
  const errors = []; let loaded = false;
  const onMsg = (m) => {
    if (m.sessionId !== sessionId) return;
    const p = m.params || {};
    if (m.method === 'Page.loadEventFired') loaded = true;
    else if (m.method === 'Runtime.exceptionThrown') { const d = p.exceptionDetails || {}; errors.push(`uncaught: ${(d.exception && d.exception.description) || d.text}`.split('\n')[0]); }
    else if (m.method === 'Runtime.consoleAPICalled' && (p.type === 'error' || (p.type === 'warning' && /preroute|failed/.test(JSON.stringify(p.args))))) errors.push('console.' + p.type + ': ' + (p.args || []).map((a) => a.value || a.description || '').join(' '));
  };
  chrome.on(onMsg);
  await Promise.all([s('Page.enable'), s('Runtime.enable'), s('Network.enable')]);
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: phone });
  if (phone) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  if (o.watch) await s('Page.addScriptToEvaluateOnNewDocument', { source: WATCH });
  // a slow line, so the page arrives over many frames and the route before boot is put to the test
  if (o.slow) await s('Network.emulateNetworkConditions', { offline: false, latency: 20, downloadThroughput: 1.5e6, uploadThroughput: 1e6 });
  await s('Page.navigate', { url: BASE + url });
  for (let t = 0; !loaded && t < 400; t++) await sleep(100);
  if (o.slow) await s('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  const ev = async (expr) => {
    const r = await s('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval failed: ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text));
    return r.result.value;
  };
  await ev('document.fonts ? document.fonts.ready.then(() => 1) : 1');
  await sleep(o.wait || 1200);
  const until = async (expr, ms = 6000) => { for (let t = 0; t < ms / 100; t++) { if (await ev(`!!(${expr})`)) return true; await sleep(100); } return false; };
  // a real click on a selector (or a document.* expression): the element brought into view if asked, then the mouse pressed
  // and released near its middle
  const click = async (sel, into = true) => {
    const r = await ev(`(function () { var e = ${/^document\./.test(sel) ? sel : `document.querySelector(${JSON.stringify(sel)})`}; if (!e) return null;
      ${into ? "var de = document.documentElement, sb = de.style.scrollBehavior; de.style.scrollBehavior = 'auto'; e.scrollIntoView({ block: 'center' }); de.style.scrollBehavior = sb;" : ''}
      var b = e.getBoundingClientRect(); return { x: b.left + Math.min(b.width / 2, 60), y: b.top + Math.min(b.height / 2, 20), w: b.width, h: b.height }; })()`);
    if (!r || !r.w) return false;
    await sleep(250);
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await s('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    return true;
  };
  const jump = (y) => ev(`(function(){ var de = document.documentElement, sb = de.style.scrollBehavior; de.style.scrollBehavior = 'auto'; window.scrollTo(0, ${y}); de.style.scrollBehavior = sb; return window.pageYOffset; })()`);
  const back = async () => { await ev('history.back(), 1'); await sleep(1200); };
  const forward = async () => { await ev('history.forward(), 1'); await sleep(1200); };
  const close = async () => { chrome.off(onMsg); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); };
  return { ev, until, click, jump, back, forward, close, errors, s };
}

// what The Chain shows now: the chapters laid out, the contents, the address, the scroll, the title
const STATE = `(function () {
  var shown = [].filter.call(document.querySelectorAll('.view[data-view="stack"] > article.chapter'), function (a) { return a.getClientRects().length > 0; }).map(function (a) { return a.id; });
  var c = document.getElementById('contents');
  return { shown: shown, contents: !!(c && c.getClientRects().length), view: CP.Router.current, chain: document.documentElement.getAttribute('data-chain'),
    hash: location.hash, y: Math.round(window.pageYOffset), title: document.title, height: document.documentElement.scrollHeight,
    focus: (document.activeElement && (document.activeElement.id || document.activeElement.className || document.activeElement.tagName)) || '' };
})()`;
// where an element's top sits against where the router lands it (src/app.js landAt): 0 is exact
const OFF = (sel) => `(function () { var e = ${sel}; if (!e) return null; return Math.round(e.getBoundingClientRect().top - CP.landAt(e)) || 0; })()`; // || 0: a -0 would come back as no value
const want = (n) => !ONLY.length || ONLY.includes(String(n));

(async () => {
  const chrome = launch();
  try {
    // the chapters, their titles and their doors, as the page itself knows them
    const t0 = await tab(chrome, '/#/chain');
    const meta = await t0.ev(`(function () {
      var T = JSON.parse(document.querySelector('meta[name="cp-titles"]').getAttribute('content'));
      return [].map.call(document.querySelectorAll('.view[data-view="stack"] > article.chapter'), function (a) {
        var n = a.querySelector('.prevnext .next'), p = a.querySelector('.prevnext .prev');
        return { id: a.id, num: a.getAttribute('data-number'), title: T['/' + a.id + '/'] || '', next: n ? (n.getAttribute('data-route') || n.getAttribute('href')) : '', nextLabel: n ? n.querySelector('.label').textContent : '', prev: p ? p.getAttribute('data-route') : '' };
      });
    })()`);
    const contentsState = await t0.ev(STATE);
    await t0.close();
    const ids = meta.map((m) => m.id);
    console.log(`${ids.length} chapters on ${BASE}/#/chain\n`);

    // 1. every chapter alone at its address, on a fresh load over a slow line
    if (want(1)) {
      const bad = [];
      let pre = 0;
      for (const m of meta) {
        const t = await tab(chrome, '/#' + m.id, { watch: true, slow: true });
        const st = await t.ev(STATE), seen = await t.ev('Object.keys(window.__seen || {})');
        const doorOk = m.id === 'geopolitics' ? m.next === '#/chain' : !!m.next && ids.indexOf(m.next.slice(1)) === ids.indexOf(m.id) + 1;
        const problems = [];
        if (st.shown.length !== 1 || st.shown[0] !== m.id) problems.push('shows ' + JSON.stringify(st.shown));
        if (st.contents) problems.push('the contents show too');
        if (st.y > 4) problems.push('opens at y ' + st.y);
        if (st.title !== m.title) problems.push(`title "${st.title}", expected "${m.title}"`);
        if (seen.some((x) => x !== m.id)) problems.push('before boot painted ' + JSON.stringify(seen));
        if (seen.length) pre++;
        if (!doorOk) problems.push('door leads to ' + m.next);
        if (t.errors.length) problems.push(t.errors.join(' | '));
        if (problems.length) bad.push(m.id + ': ' + problems.join('; '));
        await t.close();
      }
      report(1, 'every chapter opens alone at its address', !bad.length,
        bad.length ? bad.join('\n        ') : `${meta.length} of ${meta.length}: one chapter shown, at its top (y 0), under its own title; before boot ${pre} of them had painted, each only itself; doors run 01 to 17, then to the contents. #/chain shows the contents and no chapter (${JSON.stringify(contentsState.shown)}, contents ${contentsState.contents}, title "${contentsState.title}")`);
      if (contentsState.shown.length || !contentsState.contents) report('1b', '#/chain is the contents page', false, JSON.stringify(contentsState));
    }

    // 2. a section and a figure in another chapter, by a link and on a fresh load; a link in the text to another chapter
    if (want(2)) {
      const t = await tab(chrome, '/#lithography');
      const pick = await t.ev(`(function () {
        var sec = document.querySelectorAll('#memory-and-hbm > .prose > h3[id]')[2], fig = document.querySelector('#advanced-packaging .figure[id]');
        var link = null; document.querySelectorAll('.view[data-view="stack"] article.chapter .prose a[href^="#"]').forEach(function (a) {
          var h = a.getAttribute('href').slice(1), ch = a.closest('article.chapter'), to = document.getElementById(h);
          if (!link && to && to.matches('article.chapter') && to !== ch && !a.closest('.prevnext')) link = { from: ch.id, to: h, text: a.textContent };
        });
        return { sec: sec && sec.id, fig: fig && fig.id, link: link };
      })()`);
      const out = [];
      let ok = true;
      for (const [kind, id, chap] of [['section', pick.sec, 'memory-and-hbm'], ['figure', pick.fig, 'advanced-packaging']]) {
        // by a link on the page, as the search, the glossary and the cards make one
        await t.ev(`(function () { var a = document.createElement('a'); a.href = '#${id}'; a.id = 'qa-link'; a.textContent = 'qa'; a.style.cssText = 'position:fixed;left:200px;top:200px;z-index:99;background:#fff'; document.body.appendChild(a); return 1; })()`);
        await t.click('#qa-link', false); await sleep(1800);
        const st = await t.ev(STATE), off = await t.ev(OFF(`document.getElementById('${id}')`));
        await t.ev(`document.getElementById('qa-link').remove(), 1`);
        const pass = st.shown.length === 1 && st.shown[0] === chap && off !== null && Math.abs(off) <= 3;
        ok = ok && pass;
        out.push(`${kind} #${id} by a link from Lithography: shows ${st.shown.join(',')}, its top ${off} px from where it lands${pass ? '' : ' (FAIL)'}`);
      }
      await t.close();
      for (const [kind, id, chap] of [['section', pick.sec, 'memory-and-hbm'], ['figure', pick.fig, 'advanced-packaging']]) {
        const f = await tab(chrome, '/#' + id, { watch: true, slow: true, wait: 2500 });
        const st = await f.ev(STATE), off = await f.ev(OFF(`document.getElementById('${id}')`)), seen = await f.ev('Object.keys(window.__seen || {})');
        const pass = st.shown.length === 1 && st.shown[0] === chap && Math.abs(off) <= 3 && !seen.some((x) => x !== chap);
        ok = ok && pass;
        out.push(`${kind} #${id} on a fresh load: shows ${st.shown.join(',')}, ${off} px from where it lands, painted before boot ${JSON.stringify(seen)}${pass ? '' : ' (FAIL)'}`);
        await f.close();
      }
      if (pick.link) {
        const l = await tab(chrome, '/#' + pick.link.from);
        await l.click(`document.querySelector('#${pick.link.from} .prose a[href="#${pick.link.to}"]')`); await sleep(1500);
        const st = await l.ev(STATE), off = await l.ev(OFF(`document.getElementById('${pick.link.to}')`));
        const pass = st.shown[0] === pick.link.to && st.shown.length === 1 && st.y <= 4;
        ok = ok && pass;
        out.push(`the link "${pick.link.text}" in ${pick.link.from}'s text: shows ${st.shown.join(',')} at y ${st.y} (its top ${off} px from where it lands)${pass ? '' : ' (FAIL)'}`);
        await l.close();
      } else out.push('no link in a chapter\'s text to another chapter was found');
      report(2, 'a section and a figure address in another chapter open the right chapter at the right place', ok, out.join('\n        '));
    }

    // 3. the door, Back and Forward; the rail; Back from another view
    if (want(3)) {
      const t = await tab(chrome, '/#lithography');
      const out = []; let ok = true;
      await t.ev(`(function(){ var d = document.querySelector('#lithography .prevnext .next'), de = document.documentElement; de.style.scrollBehavior = 'auto'; d.scrollIntoView({ block: 'center' }); de.style.scrollBehavior = ''; return 1; })()`);
      await sleep(500);
      const left = (await t.ev(STATE)).y;
      await t.click('#lithography .prevnext .next', false); await sleep(1500);
      let st = await t.ev(STATE);
      let pass = st.hash === '#photomasks-and-pellicles' && st.shown.join() === 'photomasks-and-pellicles' && st.y <= 4;
      ok = ok && pass; out.push(`door from Lithography (left at y ${left}): ${st.hash}, shows ${st.shown.join(',')} at y ${st.y}, focus on ${st.focus}${pass ? '' : ' (FAIL)'}`);
      await t.back(); st = await t.ev(STATE);
      pass = st.shown.join() === 'lithography' && Math.abs(st.y - left) <= 2;
      ok = ok && pass; out.push(`Back: ${st.hash}, shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      await t.forward(); st = await t.ev(STATE);
      pass = st.shown.join() === 'photomasks-and-pellicles' && st.y <= 4;
      ok = ok && pass; out.push(`Forward: ${st.hash}, shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      // in chapter 05, part way down, the rail's chain list to chapter 09, then Back and Forward
      await t.jump(3000); await sleep(400);
      const at05 = (await t.ev(STATE)).y;
      await t.click('#photomasks-and-pellicles .rail-chain a[data-route="#foundries-and-fabs"]', false); await sleep(1500);
      st = await t.ev(STATE);
      pass = st.shown.join() === 'foundries-and-fabs' && st.y <= 4;
      ok = ok && pass; out.push(`the rail's chain list to chapter 09 from y ${at05}: shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      await t.jump(2200); await sleep(400);
      await t.back(); st = await t.ev(STATE);
      pass = st.shown.join() === 'photomasks-and-pellicles' && Math.abs(st.y - at05) <= 2;
      ok = ok && pass; out.push(`Back: shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      await t.forward(); st = await t.ev(STATE);
      pass = st.shown.join() === 'foundries-and-fabs' && Math.abs(st.y - 2200) <= 2;
      ok = ok && pass; out.push(`Forward: shows ${st.shown.join(',')} at y ${st.y}, the place left in it${pass ? '' : ' (FAIL)'}`);
      // Back from another view: the Glossary tab, then Back
      await t.click('.tabs a[data-view="glossary"]', false); await sleep(1500);
      const gv = (await t.ev(STATE)).view;
      await t.back(); st = await t.ev(STATE);
      pass = gv === 'glossary' && st.view === 'stack' && st.shown.join() === 'foundries-and-fabs' && Math.abs(st.y - 2200) <= 2;
      ok = ok && pass; out.push(`the Glossary tab (${gv}), then Back: shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      // The Chain's tab from a chapter: the contents at the top; Back to the chapter's place
      await t.click('.tabs a[data-view="stack"]', false); await sleep(1500);
      st = await t.ev(STATE);
      pass = st.hash === '#/chain' && !st.shown.length && st.contents && st.y === 0 && /^The Chain/.test(st.title);
      ok = ok && pass; out.push(`The Chain's tab from chapter 09: ${st.hash}, contents ${st.contents}, chapters shown ${st.shown.length}, y ${st.y}, title "${st.title}"${pass ? '' : ' (FAIL)'}`);
      await t.click(`document.querySelector('#contents a[href="#data-centers-and-power"]')`); await sleep(1500);
      st = await t.ev(STATE);
      pass = st.shown.join() === 'data-centers-and-power' && st.y <= 4;
      ok = ok && pass; out.push(`a contents row to chapter 15: shows ${st.shown.join(',')} at y ${st.y}${pass ? '' : ' (FAIL)'}`);
      // the last chapter's door leads to the contents
      await t.ev(`location.hash = '#geopolitics', 1`); await sleep(1500);
      await t.click('#geopolitics .prevnext .next'); await sleep(1500);
      st = await t.ev(STATE);
      pass = st.hash === '#/chain' && st.contents && !st.shown.length && st.y === 0;
      ok = ok && pass; out.push(`chapter 17's door: ${st.hash}, contents ${st.contents}, y ${st.y}${pass ? '' : ' (FAIL)'}`);
      if (t.errors.length) { ok = false; out.push('errors: ' + t.errors.join(' | ')); }
      await t.close();
      report(3, 'the door goes to the next chapter\'s top, and Back returns to the place left', ok, out.join('\n        '));
    }

    // 4. a search result inside another chapter
    if (want(4)) {
      const t = await tab(chrome, '/#design-and-eda');
      await t.jump(2500);
      const h = await t.ev(`(function () { var h = document.querySelectorAll('#lithography > .prose > h3[id]')[3]; return { id: h.id, text: h.textContent.replace(/#$/, '').trim() }; })()`);
      await t.click('.search-btn', false); await sleep(400);
      await t.s('Input.insertText', { text: h.text }); await sleep(700);
      const k = await t.ev(`(function () { var a = [].filter.call(document.querySelectorAll('#cp-search ol a'), function (a) { return a.getAttribute('href') === '#${h.id}'; })[0]; return a ? a.getAttribute('data-k') : null; })()`);
      let pass = k !== null, detail = '';
      if (pass) {
        await t.click(`document.querySelector('#cp-search ol a[data-k="${k}"]')`, false); await sleep(1800);
        const st = await t.ev(STATE), off = await t.ev(OFF(`document.getElementById('${h.id}')`)), foc = await t.ev(`document.activeElement === document.getElementById('${h.id}')`);
        pass = st.shown.join() === 'lithography' && Math.abs(off) <= 3 && st.hash === '#' + h.id;
        detail = `searched "${h.text}" from Chip Design (y 2500), result ${+k + 1}: shows ${st.shown.join(',')}, the heading ${off} px from where it lands, focus on it ${foc}`;
      } else detail = `no result for "${h.text}" leads to #${h.id}`;
      if (t.errors.length) { pass = false; detail += '; errors: ' + t.errors.join(' | '); }
      await t.close();
      report(4, 'a search result inside a chapter lands', pass, detail);
    }

    // 5. a Glossary passage link
    if (want(5)) {
      const t = await tab(chrome, '/#/glossary', { wait: 2500 });
      await t.until(`document.querySelector('#gl-dict .gl-de[data-kind="term"] button[data-open]')`);
      const term = await t.ev(`(function () { var b = [].filter.call(document.querySelectorAll('#gl-dict .gl-de[data-kind="term"] button[data-open]'), function (b) { return /^EUV|^Extreme ultraviolet/i.test(b.textContent); })[0] || document.querySelector('#gl-dict .gl-de[data-kind="term"] button[data-open]'); b.id = 'qa-term'; return b.textContent; })()`);
      await t.click('#qa-term'); await sleep(900);
      const has = await t.until(`document.querySelector('#gl-sheet:not([hidden]) .lk-men a[data-para]')`, 4000);
      let pass = has, detail = '';
      if (has) {
        const link = await t.ev(`(function () { var a = document.querySelectorAll('#gl-sheet .lk-men a[data-para]')[1] || document.querySelector('#gl-sheet .lk-men a[data-para]'); a.id = 'qa-pass'; return { href: a.getAttribute('href'), para: +a.getAttribute('data-para'), text: a.textContent.slice(0, 90) }; })()`);
        await t.click('#qa-pass'); await sleep(2200);
        const st = await t.ev(STATE);
        const p = await t.ev(`(function () { var p = CP.Lookup.paras[${link.para}], r = p.el.getBoundingClientRect(); return { top: Math.round(r.top), land: Math.round(CP.landAt(p.el)), flash: p.el.classList.contains('lk-flash'), chapter: p.chapter }; })()`);
        pass = st.view === 'stack' && st.shown.join() === p.chapter && Math.abs(p.top - p.land) <= 3;
        detail = `"${term}", its passage in ${p.chapter} ("${link.text.replace(/\s+/g, ' ')}…"): shows ${st.shown.join(',')}, the passage ${p.top - p.land} px from where it lands, flashed ${p.flash}`;
      } else detail = `the entry "${term}" listed no passage`;
      if (t.errors.length) { pass = false; detail += '; errors: ' + t.errors.join(' | '); }
      await t.close();
      report(5, 'a Glossary passage link lands', pass, detail);
    }

    // 6. a Suppliers link to a stage (a country's panel on the atlas names the stages it supplies)
    if (want(6)) {
      const t = await tab(chrome, '/#/suppliers?country=JP', { wait: 2500 });
      const a = await t.ev(`(function () { var a = [].filter.call(document.querySelectorAll('.sa-panel a[href^="#"]'), function (a) { return a.getClientRects().length && document.getElementById(a.getAttribute('href').slice(1)) && document.getElementById(a.getAttribute('href').slice(1)).matches('article.chapter'); })[0]; if (!a) return null; a.id = 'qa-sup'; return { href: a.getAttribute('href'), text: a.textContent.replace(/\\s+/g, ' ').slice(0, 60) }; })()`);
      let pass = !!a, detail = 'no link from the Japan panel to a chapter';
      if (a) {
        await t.click('#qa-sup'); await sleep(1600);
        const st = await t.ev(STATE);
        pass = st.view === 'stack' && st.shown.join() === a.href.slice(1) && st.y <= 4;
        detail = `Japan's panel, "${a.text}": shows ${st.shown.join(',')} at y ${st.y}`;
        await t.back(); const b = await t.ev(STATE);
        detail += `; Back: ${b.view} ${b.hash}`;
      }
      const chips = await t.ev(`(function () { var ids = CP_DATA.chapters.map(function (c) { return '#' + c.id; }); return [].filter.call(document.querySelectorAll('.view[data-view="landscape"] a[href]'), function (a) { return ids.indexOf(a.getAttribute('href')) >= 0; }).length; })()`);
      detail += `. AI Chips: ${chips} links to a stage on the page, so nothing to follow there`;
      if (t.errors.length) { pass = false; detail += '; errors: ' + t.errors.join(' | '); }
      await t.close();
      report(6, 'a Suppliers or AI Chips stage link lands', pass, detail);
    }

    // 7. print emulation: every chapter, the head and the contents
    if (want(7)) {
      const out = []; let ok = true;
      for (const u of ['/#/chain', '/#lithography']) {
        const t = await tab(chrome, u);
        await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(600);
        const st = await t.ev(`(function () { var s = ${STATE}; s.howto = !!document.querySelector('#howto').getClientRects().length; s.doors = [].filter.call(document.querySelectorAll('.prevnext'), function (d) { return d.getClientRects().length; }).length; return s; })()`);
        const pass = st.shown.length === 17 && st.contents && st.howto && st.doors === 0;
        ok = ok && pass; out.push(`${u}: ${st.shown.length} chapters print, the head ${st.howto}, the contents ${st.contents}, doors printed ${st.doors}${pass ? '' : ' (FAIL)'}`);
        await t.close();
      }
      report(7, 'print emulation of #/chain shows all 17 chapters', ok, out.join('\n        '));
    }

    // 8. the page's height at 1440: each chapter alone, against the whole chain laid out as before
    if (want(8)) {
      const t = await tab(chrome, '/#lithography');
      const hs = {};
      for (const id of ids) { await t.ev(`location.hash = '#${id}', 1`); await sleep(350); hs[id] = await t.ev('document.documentElement.scrollHeight'); }
      await t.ev(`document.documentElement.removeAttribute('data-chain'), document.head.insertAdjacentHTML('beforeend', '<style>article.chapter{content-visibility:visible!important}</style>'), 1`); await sleep(800);
      const whole = await t.ev('document.documentElement.scrollHeight');
      await t.close();
      const v = Object.values(hs), min = Math.min(...v), max = Math.max(...v);
      const minId = ids.find((i) => hs[i] === min), maxId = ids.find((i) => hs[i] === max);
      report(8, 'page height at 1440 for one chapter', hs.lithography < whole / 8,
        `Lithography ${hs.lithography.toLocaleString('en-US')} px (scroll thumb ${Math.round(900 * 900 / hs.lithography)} px on a 900 px window); chapters run ${min.toLocaleString('en-US')} (${minId}) to ${max.toLocaleString('en-US')} px (${maxId}); the whole chain laid out as one page is ${whole.toLocaleString('en-US')} px`);
    }

    // every other way in
    if (want(9)) {
      const out = []; let ok = true;
      const go = async (t, label, sel, chap, opts = {}) => {
        const clicked = await t.click(sel, opts.into !== false); await sleep(opts.wait || 1600);
        const st = await t.ev(STATE);
        const pass = clicked && st.view === 'stack' && st.shown.join() === chap && (opts.anyY || st.y <= 4);
        ok = ok && pass; out.push(`${label}: ${clicked ? `shows ${st.shown.join(',')} at y ${st.y}` : 'nothing to click'}${pass ? '' : ' (FAIL)'}`);
        return st;
      };
      let t = await tab(chrome, '/#/');
      await go(t, 'the home page, a stage in its chain', `document.querySelector('.view[data-view="walk"] a[data-route="#memory-and-hbm"]')`, 'memory-and-hbm');
      await t.close();
      t = await tab(chrome, '/#lk-country-nl', { wait: 2500 });
      await t.until(`document.querySelector('#gl-sheet:not([hidden]) .lk-cards a')`, 4000);
      const card = await t.ev(`(function () { var a = document.querySelector('#gl-sheet .lk-cards a'); return a ? a.getAttribute('href').slice(1) : null; })()`);
      if (card) await go(t, `a look-up card (the Netherlands, its chokepoint card ${card})`, '#gl-sheet .lk-cards a', card.replace(/^\//, '') === 'geopolitics' ? 'geopolitics' : card);
      else { ok = false; out.push('a look-up card: the Netherlands card listed no chapter (FAIL)'); }
      await t.close();
      t = await tab(chrome, '/#/controls', { wait: 2500 });
      // a board row whose flow names a chapter: a click opens its history, which ends on Read the chapter
      const cf = await t.ev(`(function () { var fl = CP_DATA.flows.flows || CP_DATA.flows || []; var f = fl.filter(function (f) { return f.chapter && document.querySelector('.cf-row[data-f="' + f.id + '"] .cf-btn'); })[0]; return f ? { id: f.id, chapter: f.chapter } : null; })()`);
      if (cf) {
        await t.click(`.cf-row[data-f="${cf.id}"] .cf-btn`); await sleep(1200);
        await t.until(`document.querySelector('.cf-row[data-f="${cf.id}"] .cf-chapter a')`, 3000);
        await go(t, `Export Controls, a board row's Read the chapter (${cf.chapter})`, `.cf-row[data-f="${cf.id}"] .cf-chapter a`, cf.chapter);
      } else { ok = false; out.push('Export Controls: no board row names a chapter (FAIL)'); }
      await t.close();
      // the phone: the contents sheet, the slim bar, the strip's Top
      t = await tab(chrome, '/#lithography', { width: 390 });
      await t.click('.stage-menu', false); await sleep(500);
      await go(t, 'the phone\'s contents sheet', '#sheet .sheet-chapters a[href="#memory-and-hbm"]', 'memory-and-hbm');
      const sheetShut = await t.ev(`document.getElementById('sheet').hidden`);
      if (!sheetShut) { ok = false; out.push('the sheet stayed open (FAIL)'); }
      await t.jump(4000); await sleep(300); await t.jump(4300); await sleep(500);
      const slim = await t.ev(`document.documentElement.classList.contains('slim-on') && document.querySelector('.ch-slim').getAttribute('href')`);
      await go(t, `the phone's slim bar (${slim})`, '.ch-slim', 'memory-and-hbm', { into: false });
      await t.jump(5000); await sleep(400);
      const tag = await t.ev(`document.getElementById('stage-tag-text').textContent`);
      await go(t, `the specimen strip's Top (the strip reads "${tag}")`, '.stage-top', 'memory-and-hbm', { into: false });
      if (!/10/.test(tag)) { ok = false; out.push('the strip does not show chapter 10\'s specimen (FAIL)'); }
      if (t.errors.length) { ok = false; out.push('errors: ' + t.errors.join(' | ')); }
      await t.close();
      report(9, 'every other way in lands', ok, out.join('\n        '));
    }
  } finally { await chrome.close(); }
  const fails = results.filter((r) => !r.pass);
  console.log(`\n${results.length - fails.length} of ${results.length} pass${fails.length ? '; failing: ' + fails.map((r) => r.n).join(', ') : ''}`);
  process.exit(fails.length ? 1 : 0);
})();
