#!/usr/bin/env node
/* Export Controls, driven as a reader would (24 Nov 2026): the head the owner chose from the first-screen mocks (option A) and
   the board while it scrolls (qa/builds-nov/ux/REPORT.md shortlist item 1). Headless Chrome, at the sizes named below.
   The head, on the interactive page (#/controls) and on /export-controls/:
     - the order: title, standfirst, the history strip, one Latest line, one Next date line, then the timeline (on the
       interactive page under its two tabs), and no list of dates ahead ("Coming up") anywhere;
     - the strip from 760 px: drawn, its marks in date order from left to right, the latest rule last, in the accent, at the
       right end; no label covers another label, and no leader runs through a label; under 760 px an upright list in date order;
     - the Japanese and Dutch chipmaking-tool controls of 2023 are on it (owner, 24 Nov 2026), each mark links to its entry.
   The board beside the timeline (1440 x 900 and 1280 x 800):
     - pressing a year scrolls the list to that year's first entry, and the board reads that entry's date;
     - while the board shows a past date it says "Past state" beside the date;
     - "Board as of" stays in view under the masthead in the middle of the list and at the very end of the page;
     - the last entry reaches the reading line, where the board shows today with no past mark and no lapsed stay;
     - all eleven rows sit inside the panel there and at the page's end;
     - in By subject, an opened history keeps each review policy on its own line, clear of the date column.
   usage: node qa/redesign/interact-controls.js [--base http://127.0.0.1:8812] [--out qa/redesign/interact-controls.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8812').replace(/\/$/, '');
const OUT = opt('out', path.join(__dirname, 'interact-controls.txt'));
const lines = []; let fails = 0;
const say = (ok, msg) => { const l = (ok ? 'ok   ' : 'FAIL ') + msg; lines.push(l); console.log(l); if (!ok) fails++; };

// the strip read back: marks with their dates, dot centres, label boxes and leader boxes
const STRIP = (scope) => `(function(){var f=document.querySelector(${JSON.stringify(scope + ' figure.ec-a')});if(!f)return null;
  var R=function(e){var r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom];};
  var ms=[].map.call(f.querySelectorAll('.ec-m'),function(m){var d=m.querySelector('.ec-dot'),l=m.querySelector('.ec-lab'),ld=m.querySelector('.ec-lead'),a=m.querySelector('a');
    var lab=getComputedStyle(l).display==='contents'?R(m.querySelector('.ec-mt')):R(l);
    return {date:m.getAttribute('data-date'),latest:m.classList.contains('is-latest'),href:a.getAttribute('href'),title:a.getAttribute('title'),dot:R(d),lab:lab,lead:getComputedStyle(ld).display==='none'?null:R(ld),dotBg:getComputedStyle(d).backgroundColor};});
  var acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();var probe=document.createElement('i');probe.style.color=acc;document.body.appendChild(probe);var accRGB=getComputedStyle(probe).color;probe.remove();
  return {drawn:f.classList.contains('is-drawn'),ms:ms,accent:accRGB,top:R(f)[1],bottom:R(f)[3]};})()`;
const hit = (a, b, pad) => a[0] < b[2] + (pad || 0) && b[0] < a[2] + (pad || 0) && a[1] < b[3] && b[1] < a[3];
function checkStrip(where, s, drawn) {
  if (!s) { say(false, `${where}: no history strip`); return; }
  say(s.drawn === drawn, `${where}: the strip is ${drawn ? 'drawn as a line' : 'an upright list'}`);
  const ms = s.ms, dates = ms.map((m) => m.date);
  say(dates.every((d, i) => !i || d >= dates[i - 1]), `${where}: ${ms.length} marks in date order`);
  say(ms.length && ms[ms.length - 1].latest && ms.filter((m) => m.latest).length === 1, `${where}: the latest rule is the last mark, and the only one marked latest`);
  say(['2023-07-23', '2023-09-01'].every((d) => dates.includes(d)), `${where}: the Japanese (Jul 2023) and Dutch (Sep 2023) tool controls are on the strip`);
  say(ms.every((m) => /^#/.test(m.href) && m.title), `${where}: every mark links to its entry and carries the full title`);
  const L = ms[ms.length - 1];
  say(L && L.dotBg === s.accent, `${where}: the latest rule's dot is in the accent (${L && L.dotBg})`);
  if (drawn) {
    const xs = ms.map((m) => (m.dot[0] + m.dot[2]) / 2);
    say(xs.every((x, i) => !i || x >= xs[i - 1] - 0.5), `${where}: the dots run left to right in date order, the latest at the right end`);
    let clash = [];
    for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) if (hit(ms[i].lab, ms[j].lab, 2)) clash.push(ms[i].date + '/' + ms[j].date);
    say(!clash.length, `${where}: no label covers another${clash.length ? ': ' + clash.join(', ') : ''}`);
    let cross = [];
    ms.forEach((m) => { if (!m.lead) return; ms.forEach((o) => { if (o !== m && hit(m.lead, o.lab, 0)) cross.push(m.date + ' through ' + o.date); }); });
    say(!cross.length, `${where}: no leader runs through a label${cross.length ? ': ' + cross.join(', ') : ''}`);
  } else {
    const ys = ms.map((m) => m.lab[1]);
    say(ys.every((y, i) => !i || y > ys[i - 1]), `${where}: one row per rule, top to bottom in date order`);
  }
}

const BOARD = `(function(){var side=document.querySelector('#cf-side').getBoundingClientRect(),a=document.querySelector('#cf-asof').getBoundingClientRect();
  var mast=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||56,probe=mast+Math.round((innerHeight-mast)*0.3);
  var it=[].slice.call(document.querySelectorAll('.tl-e')),at=it.filter(function(e){return e.getBoundingClientRect().bottom>probe;})[0]||it[it.length-1];
  var rows=[].map.call(document.querySelectorAll('#cf-board .cf-row'),function(r){return r.getBoundingClientRect();});
  return {asof:document.querySelector('#cf-asof').textContent,past:!document.querySelector('#cf-past').hidden,asofTop:a.top,asofBottom:a.bottom,mast:mast,probe:probe,
    atDate:at&&at.getAttribute('data-date'),lastTop:it[it.length-1].getBoundingClientRect().top,sideTop:side.top,sideBottom:side.bottom,
    rowsIn:rows.every(function(r){return r.top>=side.top-0.5&&r.bottom<=side.bottom+0.5;}),nRows:rows.length,
    lapsed:(document.querySelector('#cf-board').innerText.match(/until \\d+ [A-Za-z]+ 20\\d\\d/g)||[]).filter(function(s){return /until 10 Nov 2026/.test(s);}).length};})()`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dstr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MON[m - 1]} ${y}`; };

(async () => {
  const chrome = launch();
  try {
    // ---------- the head and the board, on a laptop ----------
    for (const [w, h] of [[1440, 900], [1280, 800]]) {
      const W = `#/controls ${w}x${h}`;
      const t = await open(chrome, BASE + '/#/controls', { width: w, height: h, wait: 3000 });
      const order = await t.ev(`(function(){var v=document.querySelector('.view[data-view="controls"]');var y=function(s){var e=v.querySelector(s);return e?e.getBoundingClientRect().top+scrollY:null;};
        var lis=[].filter.call(v.querySelectorAll('.view-head .cf-latest > li'),function(li){var r=li.getBoundingClientRect();return r.height>0;});
        return {t:y('.vt'),dek:y('.dek'),strip:y('.ec-a'),latest:lis[0]?lis[0].getBoundingClientRect().top+scrollY:null,next:lis[1]?lis[1].getBoundingClientRect().top+scrollY:null,kick:lis.map(function(li){return li.querySelector('.cf-latest-k').textContent.trim();}),
          tabs:y('#controls-subtabs'),tl:y('.tl-e'),board:y('#cf-board'),up:!!document.getElementById('cf-upcoming'),comingUp:/Coming up/.test(v.innerText),jump:!!v.querySelector('.cf-jump-btn')};})()`);
      const seq = [order.t, order.dek, order.strip, order.latest, order.next, order.tabs, order.tl];
      say(seq.every((v, i) => v != null && (!i || v > seq[i - 1])), `${W}: title, standfirst, strip, Latest, Next date, tabs, then the timeline (${seq.map((v) => Math.round(v)).join(' < ')})`);
      say(order.kick.join('|') === 'Latest rule|Next date', `${W}: one Latest line and one Next date line (${order.kick.join(', ')})`);
      say(!order.up && !order.comingUp && !order.jump, `${W}: no Coming up list and no jump line`);
      say(order.board != null && Math.abs(order.board - order.tl) < 260, `${W}: the board sits beside the timeline from its start`);
      checkStrip(W, await t.ev(STRIP('.view[data-view="controls"]')), true);

      // a year pressed: the list goes there and the board follows
      await t.ev(`(function(){var e=document.querySelector('.tl-e');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-200);return 1})()`); await sleep(1200);
      let b = await t.ev(BOARD);
      say(b.past && b.asof === dstr(b.atDate), `${W}: at the first entry the board reads ${b.asof} and says "Past state"`);
      await t.ev(`(document.querySelector('.cf-year[data-y="2022"]').click(),1)`); await sleep(2200);
      b = await t.ev(BOARD);
      say(/^2022/.test(b.atDate) && b.asof === dstr(b.atDate), `${W}: pressing 2022 brings ${b.atDate} to the reading line and the board to ${b.asof}`);
      say(b.past, `${W}: the 2022 board says "Past state"`);
      say(b.asofTop >= b.mast - 0.5 && b.asofBottom <= h, `${W}: "Board as of" in view under the masthead mid-list (top ${Math.round(b.asofTop)})`);
      await t.ev(`(document.querySelector('.cf-year[data-y="2019"]').click(),1)`); await sleep(2200);
      b = await t.ev(BOARD);
      say(/^2019/.test(b.atDate), `${W}: pressing 2019 goes back to ${b.atDate}`);

      // the last entry on the reading line, then the very end of the page
      await t.ev(`(function(){var it=document.querySelectorAll('.tl-e'),l=it[it.length-1];var mast=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||56;window.scrollTo(0,l.getBoundingClientRect().top+scrollY-(mast+Math.round((innerHeight-mast)*0.3))+6);return 1})()`); await sleep(1600);
      b = await t.ev(BOARD);
      say(b.lastTop <= b.probe, `${W}: the last entry reaches the reading line (${Math.round(b.lastTop)} <= ${b.probe})`);
      say(!b.past && !b.lapsed, `${W}: there the board shows today (${b.asof}), with no past mark and no lapsed stay`);
      say(b.rowsIn && b.nRows === 11, `${W}: all ${b.nRows} rows sit inside the panel (${Math.round(b.sideTop)} to ${Math.round(b.sideBottom)})`);
      await t.ev('(window.scrollTo(0,document.documentElement.scrollHeight),1)'); await sleep(1600);
      b = await t.ev(BOARD);
      say(b.asofTop >= b.mast - 0.5 && b.rowsIn, `${W}: at the page's end "Board as of" stays under the masthead and every row still fits (${Math.round(b.asofTop)}, ${Math.round(b.sideBottom)})`);
      // Now goes back to the last entry
      await t.ev(`(document.querySelector('.cf-year[data-y="2020"]').click(),1)`); await sleep(2000);
      await t.ev(`(document.getElementById('cf-now').click(),1)`); await sleep(2200);
      b = await t.ev(BOARD);
      say(!b.past, `${W}: Now returns the list to its end and the board to today (${b.asof})`);

      // By subject: the tools row's history keeps each policy on its own line, clear of the date column
      await t.ev(`(document.querySelector('.cf-mode[data-mode="subject"]').click(),1)`); await sleep(600);
      await t.ev(`(document.querySelector('.cf-row[data-f="us-tools"] .cf-btn').click(),1)`); await sleep(900);
      const hist = await t.ev(`(function(){var r=document.querySelector('.cf-row[data-f="us-tools"]');var bad=[],multi=0,stacked=0;[].forEach.call(r.querySelectorAll('.cf-ev'),function(e){var p=e.querySelector('.cf-ev-p'),d=e.querySelector('.cf-ev-d');var dl=d.getBoundingClientRect().left;
        [].forEach.call(p.querySelectorAll('.cf-pill,.cf-for,.cf-ev-lab'),function(c){var cr=c.getBoundingClientRect();if(cr.width&&cr.right>dl+0.5)bad.push(c.textContent.trim());});
        var pols=[].map.call(p.querySelectorAll('.cf-pol'),function(x){return x.getBoundingClientRect();});if(pols.length>1){multi++;if(pols.every(function(x,i){return !i||x.top>=pols[i-1].bottom-0.5;}))stacked++;}});return {bad:bad,multi:multi,stacked:stacked};})()`);
      say(!hist.bad.length, `${W}: in the opened tools history no pill or scope runs into the date column${hist.bad.length ? ': ' + hist.bad.slice(0, 3).join(' | ') : ''}`);
      say(hist.multi > 0 && hist.stacked === hist.multi, `${W}: each of ${hist.multi} stacked policies takes a line of its own`);
      await t.ev(`(document.querySelector('.cf-mode[data-mode="date"]').click(),1)`); await sleep(300); // the reader's choice is remembered: back to By date for the next size
      say(!t.errors.length, `${W}: no script errors${t.errors.length ? ': ' + t.errors.join(' | ') : ''}`);
      await t.close();
    }
    // ---------- the strip at the other widths ----------
    for (const w of [1920, 1024]) {
      const t = await open(chrome, BASE + '/#/controls', { width: w, height: 900, wait: 3000 });
      checkStrip(`#/controls ${w}`, await t.ev(STRIP('.view[data-view="controls"]')), true);
      await t.close();
    }
    {
      const t = await open(chrome, BASE + '/#/controls', { width: 390, height: 844, wait: 3000 });
      checkStrip('#/controls 390', await t.ev(STRIP('.view[data-view="controls"]')), false);
      say(await t.ev('document.documentElement.scrollWidth <= innerWidth'), '#/controls 390: no sideways scroll');
      const k = await t.ev(`[].filter.call(document.querySelectorAll('.view-head .cf-latest > li'),function(li){return li.getBoundingClientRect().height>0;}).map(function(li){return li.querySelector('.cf-latest-k').textContent.trim();}).join('|')`);
      say(k === 'Next date', `#/controls 390: under the upright strip, the one Next date line (${k})`);
      await t.close();
    }
    // ---------- the static page ----------
    for (const w of [1440, 390]) {
      const t = await open(chrome, BASE + '/export-controls/', { width: w, height: w < 768 ? 844 : 900, wait: 2000 });
      const o = await t.ev(`(function(){var y=function(s){var e=document.querySelector(s);return e?e.getBoundingClientRect().top+scrollY:null;};var lis=document.querySelectorAll('.ch-head .latest > li');
        var missing=[].filter.call(document.querySelectorAll('.ec-m a'),function(a){return !document.getElementById(a.getAttribute('href').slice(1));}).length;
        return {h1:y('.ch-title'),lede:y('.ch-lede'),strip:y('.ch-head .ec-a'),latest:lis[0]?lis[0].getBoundingClientRect().top+scrollY:null,next:lis[1]?lis[1].getBoundingClientRect().top+scrollY:null,tl:y('#timeline'),missing:missing,coming:/Coming up/.test(document.body.innerText)};})()`);
      const seq = [o.h1, o.lede, o.strip, o.latest, o.next, o.tl];
      say(seq.every((v, i) => v != null && (!i || v > seq[i - 1])), `/export-controls/ ${w}: title, standfirst, strip, Latest, Next date, then the body (${seq.map((v) => Math.round(v)).join(' < ')})`);
      say(!o.coming && !o.missing, `/export-controls/ ${w}: no Coming up list, and every mark lands on an entry on the page`);
      checkStrip(`/export-controls/ ${w}`, await t.ev(STRIP('.ch-head')), w >= 768);
      await t.close();
    }
  } finally { await chrome.close(); }
  lines.push(fails ? `interact-controls: ${fails} failure(s)` : 'interact-controls: ok');
  console.log(lines[lines.length - 1]);
  try { fs.writeFileSync(OUT, lines.join('\n') + '\n'); } catch (e) { }
  process.exit(fails ? 1 : 0);
})();
