#!/usr/bin/env node
/* One masthead on every page (design round nine, revision 6, 28 Oct 2026): on a chapter's page (the app itself since 28 Oct), a reference page and
   /summary/, the bar is the app's: the wordmark at the page's margin (64 px at 1440, as the app's), Home first, the section the
   page belongs to on the wine rule, search and the theme as two 34 px round buttons; the theme button turns the page dark
   and back and keeps the choice; search lands in the app with its dialog open and the flag gone from the address.
   usage: node qa/redesign/interact-masthead.js [base] (default http://127.0.0.1:8777) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8777';
let fails = 0;
const check = (name, ok, info) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? ': ' + info : ''}`); if (!ok) fails++; };
const BAR = `(function(){var m=document.querySelector('.masthead'),w=m.querySelector('.wordmark'),cur=m.querySelector('.tabs a[aria-current="page"]'),s=m.querySelector('.search-btn'),t=m.querySelector('.theme-toggle');
  return {h:Math.round(m.getBoundingClientRect().height),x:Math.round(w.getBoundingClientRect().left),first:(m.querySelector('.tabs a')||{}).textContent,cur:cur?cur.textContent:'',rule:cur?getComputedStyle(cur).borderBottomColor:'',
    s:s?Math.round(s.getBoundingClientRect().width):0,t:t?Math.round(t.getBoundingClientRect().width):0,name:getComputedStyle(m.querySelector('.wm-name')).fontFamily.split(',')[0]};})()`;
(async () => {
  const chrome = launch();
  try {
    const app = await open(chrome, BASE + '/#lithography', { width: 1440 });
    const a = await app.ev(BAR); await app.close();
    for (const [name, url, cur] of [['chapter page', '/lithography/', 'Supply Chain'], ['reference page', '/suppliers/', 'Suppliers'], ['summary', '/summary/?print', '']]) {
      const t = await open(chrome, BASE + url, { width: 1440 });
      const b = await t.ev(BAR);
      check(`${name}: the app's bar, at the app's margin and height, Home first`, b.x === a.x && b.h === a.h && b.first === 'Home' && b.name === a.name, JSON.stringify({ app: a, page: b }));
      check(`${name}: the current section on the wine rule`, cur ? b.cur === cur && b.rule === 'rgb(122, 31, 43)' : b.cur === '', b.cur + ' ' + b.rule);
      check(`${name}: search and theme are 34 px round buttons`, b.s === 34 && b.t === 34, b.s + ' / ' + b.t);
      await t.ev("document.querySelector('.masthead .theme-toggle').click(),1"); await sleep(200);
      const dark = await t.ev("[document.documentElement.getAttribute('data-theme'),getComputedStyle(document.body).backgroundColor,localStorage.getItem('cp-theme'),document.querySelector('.theme-toggle').getAttribute('aria-label')]");
      await t.ev("document.querySelector('.masthead .theme-toggle').click(),1"); await sleep(200);
      const light = await t.ev("[document.documentElement.getAttribute('data-theme'),getComputedStyle(document.body).backgroundColor,localStorage.getItem('cp-theme')]");
      check(`${name}: the theme button turns the page dark and back, and keeps the choice`, dark[0] === 'dark' && dark[1] === 'rgb(18, 18, 17)' && dark[2] === 'dark' && dark[3] === 'Switch to light mode' && light[0] === 'light' && light[1] === 'rgb(252, 252, 250)' && light[2] === 'light', JSON.stringify({ dark, light }));
      await t.close();
    }
    const p = await open(chrome, BASE + '/lithography/', { width: 390 });
    const ph = await p.ev("(function(){var m=document.querySelector('.masthead'),r=function(e){var b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width)]};return {home:getComputedStyle(m.querySelector('.tabs a')).display,s:r(m.querySelector('.search-btn')),t:r(m.querySelector('.theme-toggle')),sw:document.documentElement.scrollWidth};})()");
    check('390: Home gives way to the wordmark, the two buttons pin to the first row, no sideways scroll', ph.home === 'none' && ph.s[1] < 20 && ph.t[1] < 20 && ph.sw <= 390, JSON.stringify(ph));
    // the chapter page is the app since 28 Oct 2026: its search button opens the dialog in place
    await p.ev("document.querySelector('.masthead .search-btn').click(),1"); await sleep(400);
    check('chapter page: search opens its dialog in place', await p.ev("!!document.querySelector('#cp-search') && !document.querySelector('#cp-search').hidden && location.pathname === '/lithography/'"));
    await p.close();
    // a static page's search is a link to the app with ?search=1
    const r = await open(chrome, BASE + '/suppliers/', { width: 1440 });
    const href = await r.ev("document.querySelector('.masthead .search-btn').getAttribute('href')"); await r.close();
    const s = await open(chrome, new URL(href, BASE + '/suppliers/').href, { width: 1440, wait: 2500 });
    const st = await s.ev("[!!document.querySelector('#cp-search') && !document.querySelector('#cp-search').hidden, location.search, document.activeElement && document.activeElement.tagName]");
    check('search: the link opens the app with its search dialog open, and drops ?search=1 from the address', st[0] === true && !/search=1/.test(st[1]), JSON.stringify(st));
    await s.close();
  } finally { await chrome.close(); }
  console.log(fails ? `\n${fails} failed` : '\nall passed');
  process.exit(fails ? 1 : 0);
})();
