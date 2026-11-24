#!/usr/bin/env node
/* One masthead on every page (design round nine, revision 6, 28 Oct 2026): on a chapter's page (the app itself since 28 Oct),
   the Introduction's and Suppliers' pages (the app itself since 23 Nov 2026), a reference page, /summary/ and the 404 page,
   the bar is the app's: the wordmark at the page's margin (64 px at 1440, as the app's), named "Chip Supply Chain, home",
   since it is the way home; Intro first and no Home tab (owner, 23 Nov 2026); the section the page belongs to on the wine
   rule, search and the theme as two 34 px round buttons; the theme button turns the page dark and back and keeps the choice;
   search lands in the app with its dialog open and the flag gone from the address. On every page the Intro tab goes to
   /introduction/, Suppliers to /suppliers/ and the Glossary to /glossary/. A phone fits the six tabs on one line at 390 and
   375 px, and its Contents sheet lists Intro first, with no Home.
   usage: node qa/redesign/interact-masthead.js [base] (default http://127.0.0.1:8777) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8777';
let fails = 0;
const check = (name, ok, info) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? ': ' + info : ''}`); if (!ok) fails++; };
const BAR = `(function(){var m=document.querySelector('.masthead'),w=m.querySelector('.wordmark'),cur=m.querySelector('.tabs a[aria-current="page"]'),s=m.querySelector('.search-btn'),t=m.querySelector('.theme-toggle');
  return {h:Math.round(m.getBoundingClientRect().height),x:Math.round(w.getBoundingClientRect().left),first:(m.querySelector('.tabs a')||{}).textContent,cur:cur?cur.textContent:'',rule:cur?getComputedStyle(cur).borderBottomColor:'',
    s:s?Math.round(s.getBoundingClientRect().width):0,t:t?Math.round(t.getBoundingClientRect().width):0,name:getComputedStyle(m.querySelector('.wm-name')).fontFamily.split(',')[0],
    home:[].some.call(m.querySelectorAll('.tabs a'),function(x){return x.textContent.trim()==='Home';}),wm:w.getAttribute('aria-label')};})()`;
(async () => {
  const chrome = launch();
  try {
    const app = await open(chrome, BASE + '/#lithography', { width: 1440 });
    const a = await app.ev(BAR); await app.close();
    for (const [name, url, cur] of [['chapter page', '/lithography/', 'Supply Chain'], ['Glossary page', '/glossary/', 'Glossary'], ['Suppliers page', '/suppliers/', 'Suppliers'], ['Introduction page', '/introduction/', 'Intro'], ['reference page', '/chips/', 'AI Chips'], ['summary', '/summary/?print', ''], ['404 page', '/404.html', '']]) {
      const t = await open(chrome, BASE + url, { width: 1440, wait: 2000 });
      const b = await t.ev(BAR);
      check(`${name}: the app's bar, at the app's margin and height, Intro first, no Home, the wordmark named for home`, b.x === a.x && b.h === a.h && b.first === 'Intro' && !b.home && b.wm === 'Chip Supply Chain, home' && b.name === a.name, JSON.stringify({ app: a, page: b }));
      check(`${name}: the current section on the wine rule`, cur ? b.cur === cur && b.rule === 'rgb(122, 31, 43)' : b.cur === '', b.cur + ' ' + b.rule);
      check(`${name}: search and theme are 34 px round buttons`, b.s === 34 && b.t === 34, b.s + ' / ' + b.t);
      await t.ev("document.querySelector('.masthead .theme-toggle').click(),1"); await sleep(200);
      const dark = await t.ev("[document.documentElement.getAttribute('data-theme'),getComputedStyle(document.body).backgroundColor,localStorage.getItem('cp-theme'),document.querySelector('.theme-toggle').getAttribute('aria-label')]");
      await t.ev("document.querySelector('.masthead .theme-toggle').click(),1"); await sleep(200);
      const light = await t.ev("[document.documentElement.getAttribute('data-theme'),getComputedStyle(document.body).backgroundColor,localStorage.getItem('cp-theme')]");
      check(`${name}: the theme button turns the page dark and back, and keeps the choice`, dark[0] === 'dark' && dark[1] === 'rgb(18, 18, 17)' && dark[2] === 'dark' && dark[3] === 'Switch to light mode' && light[0] === 'light' && light[1] === 'rgb(252, 252, 250)' && light[2] === 'light', JSON.stringify({ dark, light }));
      await t.close();
    }
    // a phone: the six tabs, Intro first, on one line with nothing to scroll, the two buttons on the first row (app and static pages)
    const PH = "(function(){var m=document.querySelector('.masthead'),tb=m.querySelector('.tabs'),as=[].slice.call(tb.querySelectorAll('a[data-view]')),r=function(e){var b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width)]};return {first:as[0].textContent.trim(),shown:as.filter(function(x){return getComputedStyle(x).display!=='none';}).length,over:tb.scrollWidth-tb.clientWidth,row:as.every(function(x){return Math.abs(x.getBoundingClientRect().top-as[0].getBoundingClientRect().top)<2;}),s:r(m.querySelector('.search-btn')),t:r(m.querySelector('.theme-toggle')),sw:document.documentElement.scrollWidth,vw:innerWidth};})()";
    for (const [url, w] of [['/lithography/', 390], ['/lithography/', 375], ['/', 390], ['/chips/', 390], ['/chips/', 375]]) {
      const q = await open(chrome, BASE + url, { width: w, wait: 1500 });
      const ph = await q.ev(PH);
      check(`${w} ${url}: six tabs, Intro first, on one line with nothing to scroll; the two buttons on the first row; no sideways scroll`, ph.first === 'Intro' && ph.shown === 6 && ph.over <= 0 && ph.row && ph.s[1] < 20 && ph.t[1] < 20 && ph.sw <= ph.vw, JSON.stringify(ph));
      await q.close();
    }
    const p = await open(chrome, BASE + '/lithography/', { width: 390 });
    const sheet = await p.ev("[].map.call(document.querySelectorAll('#sheet .sheet-pages a'),function(a){return a.textContent+' '+new URL(a.getAttribute('href'),location.href).pathname;})");
    check('390: the Contents sheet lists Intro first and no Home', /^Intro \/introduction\/$/.test(sheet[0]) && !sheet.some((x) => /^Home/.test(x)) && sheet.length === 6, JSON.stringify(sheet));
    // the chapter page is the app since 28 Oct 2026: its search button opens the dialog in place
    await p.ev("document.querySelector('.masthead .search-btn').click(),1"); await sleep(400);
    check('chapter page: search opens its dialog in place', await p.ev("!!document.querySelector('#cp-search') && !document.querySelector('#cp-search').hidden && location.pathname === '/lithography/'"));
    await p.close();
    // the Introduction, Suppliers and the Glossary are one address each from every page's masthead (30 Oct and 23 Nov 2026)
    const to = [];
    for (const url of ['/', '/#/controls', '/lithography/', '/supply-chain/', '/glossary/#gl-euv', '/introduction/', '/suppliers/', '/chips/', '/export-controls/', '/summary/?print', '/404.html']) {
      const t = await open(chrome, BASE + url, { width: 1440, wait: 800 });
      let got = null;
      for (let k = 0; k < 20 && !got; k++) { try { got = await t.ev("(function(){var g=function(v){var a=document.querySelector('.masthead .tabs a[data-view=\"'+v+'\"]');return a?new URL(a.getAttribute('href'),location.href).pathname:null;};var o={walk:g('walk'),suppliers:g('suppliers'),glossary:g('glossary')};return o.glossary?o:null;})()"); } catch (e) { } if (!got) await sleep(200); }
      to.push([url, got]);
      await t.close();
    }
    const wrongTo = to.filter((x) => !x[1] || x[1].walk !== '/introduction/' || x[1].suppliers !== '/suppliers/' || x[1].glossary !== '/glossary/');
    check("every page's Intro tab goes to /introduction/, Suppliers to /suppliers/, the Glossary to /glossary/", !wrongTo.length, JSON.stringify(wrongTo));
    // a static page's search is a link to the app with ?search=1
    const r = await open(chrome, BASE + '/chips/', { width: 1440 });
    const href = await r.ev("document.querySelector('.masthead .search-btn').getAttribute('href')"); await r.close();
    const s = await open(chrome, new URL(href, BASE + '/chips/').href, { width: 1440, wait: 2500 });
    const st = await s.ev("[!!document.querySelector('#cp-search') && !document.querySelector('#cp-search').hidden, location.search, document.activeElement && document.activeElement.tagName]");
    check('search: the link opens the app with its search dialog open, and drops ?search=1 from the address', st[0] === true && !/search=1/.test(st[1]), JSON.stringify(st));
    await s.close();
  } finally { await chrome.close(); }
  console.log(fails ? `\n${fails} failed` : '\nall passed');
  process.exit(fails ? 1 : 0);
})();
