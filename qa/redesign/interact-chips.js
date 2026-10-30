#!/usr/bin/env node
/* AI Chips, the shelves (design round seven, option B, built 28 Oct 2026 from qa/design7/BUILD-SHELVES.md; the mockup's own
   check is qa/design7/b/build/check.js in the main checkout). Drives the page in headless Chrome at 1440 (mouse) and 390
   (touch) with real input, counts every click or tap, and reads the result back from the address:
     - the two comparison tasks (the H100 with the H20; the B300, Instinct MI355X, Rubin and Instinct MI455X) and the memory
       leader, each with its click count;
     - Remove, the measure select and Back; a fifth chip refused in words; ?pick= from a shared link, light and dark;
     - the field chart: 1 to 3 labels, every dot reached by the arrow keys and by a tap, "Open the …" opening one chip, and
       nothing on either chart adding to a comparison;
     - the shelves: every chip on a shelf, the wafer inside its own row, a card on a lower shelf landing in view, and every
       chip's card opening, with no "undefined" or "NaN";
     - sideways scroll, text under 11 px and text under 4.5:1 against its ground, in light and dark;
     - /chips/: the full table, and its intro without the lines on how to click and scroll.
   usage: node qa/redesign/interact-chips.js [--base http://127.0.0.1:8775] [--out qa/redesign/interact-chips.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8775'), OUT = opt('out', path.join(__dirname, 'interact-chips.txt'));
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/landscape.json'), 'utf8'));

const lines = [], tasks = []; let fails = 0;
const say = (ok, msg) => { lines.push((ok ? 'ok   ' : 'FAIL ') + msg); console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

// a tab with real input: a click (a tap on a phone) at an element's center; every one is counted
async function tab(chrome, hash, o) {
  const t = await open(chrome, BASE + (o.query || '') + '/' + hash, Object.assign({ wait: 2000 }, o));
  t.clicks = 0; t.phone = (o.width || 1440) < 768;
  t.box = (expr) => t.ev(`(function(){var e=(${expr}); if(!e) return null; e.scrollIntoView({block:'center',inline:'nearest'}); var r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2};})()`);
  t.at = async (x, y) => {
    if (t.phone) {
      await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await t.s('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    t.clicks++; await sleep(450);
  };
  t.click = async (expr) => {
    const b = await t.box(expr); if (!b) throw new Error('nothing to click: ' + expr);
    await sleep(150);
    const b2 = await t.ev(`(function(){var r=(${expr}).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`);
    await t.at(b2.x, b2.y);
  };
  t.pick = () => t.ev(`(function(){var m=/[?&]pick=([^&#]+)/.exec(location.hash);return m?decodeURIComponent(m[1]):'';})()`);
  return t;
}
const shelf = (id) => `document.querySelector('#aic .it-b[data-open="${id}"]')`;
const opt1 = (name) => `[].slice.call(document.querySelectorAll('#aic .cxp-o')).filter(function(o){return o.querySelector('.n').textContent===${JSON.stringify(name)} && !o.hidden;})[0]`;
const sug = (name) => `[].slice.call(document.querySelectorAll('#aic .cxp-sug button')).filter(function(b){return b.textContent===${JSON.stringify(name)};})[0]`;
const compareBtn = `document.querySelector('#aic [data-compare]')`;

// sideways scroll, text under 11 px, and text under 4.5:1 against the ground it sits on (a dash for a missing value is a mark)
const AUDIT = `(function () {
  function rgb(c) { var m = c.match(/[\\d.]+/g).map(Number); return { v: m.slice(0, 3), a: m[3] == null ? 1 : m[3] }; }
  function lum(v) { var f = function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(v[0]) + 0.7152 * f(v[1]) + 0.0722 * f(v[2]); }
  function bgOf(el) { while (el && el.nodeType === 1) { var b = getComputedStyle(el).backgroundColor; if (b && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(b)) return b; el = el.parentElement; } return getComputedStyle(document.body).backgroundColor; }
  var small = [], low = [], walker = document.createTreeWalker(document.querySelector('#aic'), NodeFilter.SHOW_TEXT), n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue; var el = n.parentElement; if (!el || el.closest('[hidden], .sr-only, option, select, svg')) continue;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    var r = el.getBoundingClientRect(); if (!r.width) continue;
    var fs = parseFloat(cs.fontSize); if (fs < 11) small.push(fs + 'px ' + n.textContent.trim().slice(0, 30));
    var fg = rgb(cs.color), bg = rgb(bgOf(el)), a = lum(fg.v), b = lum(bg.v), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (fg.a > 0.99 && ratio < 4.5 && !el.closest('.nil')) low.push(ratio.toFixed(2) + ' ' + n.textContent.trim().slice(0, 30));
  }
  [].slice.call(document.querySelectorAll('#aic svg text')).forEach(function (t) { if (parseFloat(getComputedStyle(t).fontSize) < 11) small.push('svg ' + t.textContent.slice(0, 20)); });
  return { overflow: document.documentElement.scrollWidth > window.innerWidth + 1, small: small.slice(0, 4), smallN: small.length, low: low.slice(0, 4), lowN: low.length };
})()`;
const audited = async (t, tag) => { const a = await t.ev(AUDIT); say(!a.overflow && !a.smallN && !a.lowN, `${tag}: no sideways scroll (${a.overflow}), ${a.smallN} texts under 11 px ${a.small.join('|')}, ${a.lowN} under 4.5:1 ${a.low.join('|')}`); };

(async () => {
  const chrome = launch();
  try {
    for (const w of [1440, 390]) {
      const tag = String(w), word = w < 768 ? 'taps' : 'clicks';

      /* ---------- arrival: the field, the chart, the shelves ---------- */
      let t = await tab(chrome, '#/landscape', { width: w });
      const arr = await t.ev(`({ items: document.querySelectorAll('#aic .shelf .it-b').length, plans: document.querySelectorAll('#aic .shelf svg.plan').length, card: !!document.getElementById('aic-card'),
        stage: (function(){ var s=document.querySelector('.stage'); return !!s && s.getAttribute('data-hidden') !== '1' && getComputedStyle(s).display !== 'none'; })(),
        labs: document.querySelectorAll('#aic-c-head svg.chart text.lab:not(.hov text):not(.foc text)').length, chartTop: Math.round(document.querySelector('#aic-c-head svg').getBoundingClientRect().top),
        lines: [].slice.call(document.querySelectorAll('#aic .head p, #aic .head figcaption, #aic .sh-foot, #aic .own-scale')).map(function(p){return p.textContent.trim();}) })`);
      say(arr.items === DATA.length && arr.plans === 36 && !arr.card && t.ev && (await t.pick()) === '', `${tag}: arrival lists all ${arr.items} chips on the shelves, ${arr.plans} drawn, nothing open`);
      say(!arr.stage, `${tag}: the specimen stage does not show`);
      say(arr.labs >= 1 && arr.labs <= 3, `${tag}: the field chart carries ${arr.labs} label(s)`);
      say(arr.chartTop > 0 && arr.chartTop < (w < 768 ? 1400 : 900), `${tag}: the field chart sits at the head, ${arr.chartTop} px down`);
      const cut = ['Below, each maker', 'Select a dot', 'oldest first', 'Open a chip', 'drawn from above, at one scale'];
      say(!arr.lines.some((l) => cut.some((c) => l.indexOf(c) >= 0)), `${tag}: the cut lines are gone from the head and the shelves`);
      say(arr.lines.some((l) => /^A whole wafer, drawn smaller than the rest\./.test(l)) && arr.lines.some((l) => l === 'The TPU 8t and the Ascend 950DT have no drawing, because their package layouts are not published.') && arr.lines.some((l) => /Logic die.*Memory stack.*Package.*\d+ mm/.test(l)),
        `${tag}: the kept lines are there (the wafer's scale, the two chips with no drawing, the key; the chart names no chip it leaves off, 28 Oct 2026)`);
      await audited(t, `${tag} arrival, light`);
      // the wafer in its own row: inside the Cerebras shelf, clear of the row above and of the maker's name
      const wafer = await t.ev(`(function(){ var li=document.getElementById('aic-sh-cerebras'), svg=li.querySelector('svg.plan'), prev=li.previousElementSibling, mk=li.querySelector('.sh-mk h2'), r=svg.getBoundingClientRect(), L=li.getBoundingClientRect(), P=prev.getBoundingClientRect(), M=mk.getBoundingClientRect(); return { inside: r.top >= L.top && r.bottom <= L.bottom, clearPrev: r.top >= P.bottom, overMk: r.left < M.right && r.right > M.left && r.top < M.bottom && r.bottom > M.top }; })()`);
      say(wafer.inside && wafer.clearPrev && !wafer.overMk, `${tag}: the wafer stays inside its own row ${JSON.stringify(wafer)}`);
      // every dot reached by the arrow keys, and by a tap on it
      const withFig = await t.ev(`CP.Landscape.fieldOf('fp16').pts.length`);
      const keys = await t.ev(`(function(){ var s=document.querySelector('#aic-c-head svg.chart'), host=s.parentNode, seen={}; s.focus(); s.dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true})); for (var i=0;i<45;i++){ var tp=host.querySelector('.ctip'); if(tp && !tp.hidden) seen[tp.querySelector('.ct-n').firstChild.textContent]=1; s.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})); } s.blur(); return Object.keys(seen).length; })()`);
      say(keys === withFig, `${tag}: the arrow keys reach ${keys} of ${withFig} dots`);
      // quick win B (29 Oct 2026): a tap on a dot of the head's chart marks that chip's package on its shelf, in place of the tip.
      // The dots are drawn in fieldOf's order; where two dots share a place, the package of either one counts
      const taps = await t.ev(`(function(){ document.documentElement.style.scrollBehavior='auto'; var s=document.querySelector('#aic-c-head svg.chart'), host=s.parentNode, ok=0, F=CP.Landscape.fieldOf(CP.Landscape.S.measure||'fp16'); var cs=[].slice.call(s.querySelectorAll('circle.dot, path.off')), at={};
        var mid=function(c){ var r=c.getBoundingClientRect(); return { x:r.left+r.width/2, y:r.top+r.height/2 }; }; cs.forEach(function(c,i){ at[F.pts[i].c.id]=c; });
        cs.forEach(function(c){ var m=mid(c); s.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:m.x,clientY:m.y})); m=mid(c); var li=document.querySelector('#aic li.it.is-lit .it-b'), tp=host.querySelector('.ctip'), q=li&&at[li.getAttribute('data-open')]&&mid(at[li.getAttribute('data-open')]); if(q && Math.abs(q.x-m.x)<1 && Math.abs(q.y-m.y)<1 && (!tp || tp.hidden)) ok++; });
        window.scrollTo(0,0); return { ok: ok, n: cs.length }; })()`);
      say(taps.ok === taps.n && taps.n === withFig, `${tag}: a tap on each of ${taps.n} dots marks its package on its shelf, with no tip (${taps.ok})`);
      // the memory leader: open the select, choose Memory (a native select: one press opens it, one choice)
      await t.ev(`(function(){ var s=document.getElementById('aic-m-head'); s.focus(); s.value='mem'; s.dispatchEvent(new Event('change',{bubbles:true})); })()`);
      await sleep(300);
      const lead = await t.ev(`document.querySelector('#aic .head .finding').textContent`), mh = await t.ev('location.hash');
      say(/^The Instinct MI455X has the highest published memory, 432 gigabytes\./.test(lead) && /measure=mem/.test(mh) && (await t.pick()) === '', `${tag}: the memory leader in 2 ${word} (open the select, choose Memory): "${lead}" (${mh})`);
      tasks.push(`${tag}  which chip leads on memory: 2 ${word} (the select at the head, then Memory)`);
      // "Open the …" in a tip opens one chip and adds nothing (the head's tip now opens from the keys, quick win B, 29 Oct 2026)
      await t.ev(`(function(){ document.querySelector('#aic-c-head svg.chart').focus(); })()`);
      await t.click(`document.querySelector('#aic-c-head .ctip a[data-open]')`);
      const opened = await t.pick();
      say(opened && opened.split(',').length === 1 && !!(await t.ev(`!!document.getElementById('aic-card')`)), `${tag}: "Open the …" in a tip opens one chip and adds nothing (${opened})`);
      await t.click(`document.querySelector('#aic [data-home]')`);
      say((await t.pick()) === '' && !(await t.ev(`!!document.getElementById('aic-card')`)), `${tag}: Close puts the card away`);
      // cards on lower shelves land in view, from the field and from an open card
      for (const id of ['huawei-ascend-910c', 'amd-mi300x', 'moore-threads-mtt-s5000', 'cerebras-wse3-turbo']) {
        await t.click(shelf(id)); await sleep(200);
        const v = await t.ev(`(function(){ var c=document.getElementById('aic-card'), r=c.getBoundingClientRect(), b=document.querySelector('#aic .it-b[data-open="${id}"]').getBoundingClientRect(), m=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||64; return { cardTop: Math.round(r.top), chipTop: Math.round(b.top), h: innerHeight, m: m }; })()`);
        say((await t.pick()) === id && v.cardTop > 0 && v.cardTop < v.h * 0.75 && v.chipTop > v.m, `${tag}: opening ${id} lands in view (card at ${v.cardTop} px, chip at ${v.chipTop} px, screen ${v.h})`);
      }
      // the wafer's card keeps it to its own scale, beside a B200 at the same scale
      say(/whole wafer, so it is drawn at a smaller scale/.test(await t.ev(`document.querySelector('#aic-card .cap-t').textContent`)), `${tag}: the WSE-3 Turbo's card says its drawing is at a smaller scale`);
      say(!t.errors.length, `${tag}: console clean ${t.errors.join(' | ')}`);
      await t.close();

      /* ---------- task 1: the H100 with the H20 ---------- */
      t = await tab(chrome, '#/landscape', { width: w });
      await t.click(shelf('nvidia-h100'));
      say((await t.pick()) === 'nvidia-h100', `${tag}: a name on a shelf opens that one chip (${await t.pick()})`);
      await t.click(compareBtn);
      say(await t.ev(`!document.querySelector('#aic .cxp').hidden && document.activeElement === document.querySelector('#aic .cxp-in')`), `${tag}: Compare opens the picker${w < 768 ? ' as a bottom sheet' : ''}, its field focused`);
      if (w < 768) say(await t.ev(`(function(){ var r=document.querySelector('#aic .cxp').getBoundingClientRect(); return getComputedStyle(document.querySelector('#aic .cxp')).position === 'fixed' && Math.abs(r.bottom - innerHeight) < 2 && r.left === 0; })()`), `${tag}: the picker is a sheet at the foot of the screen`);
      await t.click(sug('H20'));
      let p = await t.pick();
      const ok1 = p === 'nvidia-h100,nvidia-h20' && (await t.ev(`document.querySelectorAll('#aic .cmp-heads .cmp-head').length`)) === 2;
      say(ok1, `${tag}: the H100 with the H20 in ${t.clicks} ${word} (${p})`);
      tasks.push(`${tag}  H100 with H20: ${t.clicks} ${word} (H100 on the Nvidia shelf, Compare with another chip, H20 under "Often set beside the H100")`);
      await audited(t, `${tag} two chips, light`);
      await t.close();

      /* ---------- task 2: the B300, Instinct MI355X, Rubin and Instinct MI455X ---------- */
      t = await tab(chrome, '#/landscape', { width: w });
      await t.click(shelf('nvidia-b300'));
      await t.click(compareBtn); await t.click(sug('Instinct MI355X'));
      for (const name of ['Rubin', 'Instinct MI455X']) { await t.click(compareBtn); await t.click(opt1(name)); }
      p = await t.pick();
      say(p === 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x' && (await t.ev(`document.querySelectorAll('#aic .cmp-heads .cmp-head').length`)) === 4, `${tag}: four chips in ${t.clicks} ${word} (${p})`);
      tasks.push(`${tag}  B300, Instinct MI355X, Rubin and Instinct MI455X: ${t.clicks} ${word} (B300, Compare with another chip, Instinct MI355X suggested, Add a chip, Rubin, Add a chip, Instinct MI455X${w < 768 ? '; the last one swipe down the sheet' : ''})`);
      const four = await t.ev(`({ add: !!document.querySelector('#aic [data-compare]'), note: (document.querySelector('#aic .card-top .four')||{}).textContent || '' })`);
      say(!four.add && four.note === 'A comparison holds up to four chips.', `${tag}: at four there is no Add control, and the card says "${four.note}"`);
      await audited(t, `${tag} four chips, light`);
      // a fifth chip is refused in words
      await t.ev(`CP.Landscape.add('nvidia-b200')`); await sleep(200);
      const live = await t.ev(`document.getElementById('aic-live').textContent`);
      say((await t.pick()).split(',').length === 4 && /holds four chips/.test(live), `${tag}: a fifth chip is refused in words ("${live}")`);
      // nothing on either chart adds to a comparison: a press on every dot and on each chart's middle
      const before = await t.pick();
      await t.ev(`[].slice.call(document.querySelectorAll('#aic svg.chart')).forEach(function(s){ [].slice.call(s.querySelectorAll('circle, path.off, rect.hit')).forEach(function(c){ var r=c.getBoundingClientRect(); s.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2})); }); })`);
      await sleep(250);
      say((await t.pick()) === before, `${tag}: presses on every dot of both charts choose nothing (${await t.pick()})`);
      // Remove, the select, Back
      await t.click(`document.querySelector('#aic [data-remove="nvidia-vr200"]')`);
      say((await t.pick()) === 'nvidia-b300,amd-mi355x,amd-mi455x', `${tag}: Remove takes the Rubin out (${await t.pick()})`);
      await t.ev(`(function(){ var s=document.getElementById('aic-m-card'); s.focus(); s.value='mem'; s.dispatchEvent(new Event('change',{bubbles:true})); })()`); await sleep(300);
      const m2 = await t.ev('location.hash');
      say(/measure=mem/.test(m2) && (await t.pick()) === 'nvidia-b300,amd-mi355x,amd-mi455x' && /highest published memory/.test(await t.ev(`document.querySelector('#aic .head .finding').textContent`)), `${tag}: the card's select changes the figure for both charts and chooses nothing (${m2})`);
      await t.ev('history.back()'); await sleep(600);
      say((await t.pick()) === 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x' && (await t.ev(`document.querySelectorAll('#aic .cmp-heads .cmp-head').length`)) === 4, `${tag}: Back brings the Rubin back (${await t.pick()})`);
      await t.click(`document.querySelector('#aic [data-home]')`);
      say((await t.pick()) === '' && !(await t.ev(`!!document.getElementById('aic-card')`)), `${tag}: Close returns to the field`);
      await t.ev('history.back()'); await sleep(600);
      say((await t.pick()) === 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x', `${tag}: Back after Close reopens the comparison (${await t.pick()})`);
      say(!t.errors.length, `${tag}: console clean ${t.errors.join(' | ')}`);
      await t.close();

      /* ---------- a shared link, in dark ---------- */
      t = await tab(chrome, '#/landscape?pick=nvidia-b200,huawei-ascend-910c', { width: w, theme: 'dark' });
      const sh = await t.ev(`({ heads: document.querySelectorAll('#aic .cmp-heads .cmp-head').length, theme: document.documentElement.getAttribute('data-theme'), top: Math.round(document.getElementById('aic-card').getBoundingClientRect().top), h: innerHeight })`);
      say(sh.heads === 2 && sh.theme === 'dark' && (await t.pick()) === 'nvidia-b200,huawei-ascend-910c' && sh.top > 0 && sh.top < sh.h, `${tag}: ?pick= opens the B200 and the Ascend 910C, in dark, the card in view (${sh.top} px)`);
      await audited(t, `${tag} two chips from a shared link, dark`);
      await t.click(`document.querySelector('#aic [data-remove="huawei-ascend-910c"]')`);
      await t.ev('history.back()'); await sleep(600);
      say((await t.pick()) === 'nvidia-b200,huawei-ascend-910c', `${tag}: Back after Remove restores the shared pair (${await t.pick()})`);
      await t.close();
      for (const [name, hash] of [['arrival', '#/landscape'], ['one chip', '#/landscape?pick=nvidia-b200'], ['four chips', '#/landscape?pick=nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x']]) {
        t = await tab(chrome, hash, { width: w, theme: 'dark' });
        await audited(t, `${tag} ${name}, dark`); await t.close();
      }

      /* ---------- every chip's card opens from its shelf ---------- */
      t = await tab(chrome, '#/landscape', { width: w });
      const bad = [];
      for (const c of DATA) {
        await t.click(shelf(c.id));
        const r = await t.ev(`(function(){ var c=document.getElementById('aic-card'); return { pick: (/[?&]pick=([^&#]+)/.exec(location.hash)||[])[1] || '', h: c ? c.querySelector('h2').textContent : '', text: c ? c.textContent : '' }; })()`);
        const want = String(c.name).replace(/\s*\(.*\)\s*$/, '');
        if (r.pick !== c.id || r.h !== want || /undefined|NaN|\[object/.test(r.text)) bad.push(c.id + ' ' + JSON.stringify({ pick: r.pick, h: r.h }));
        await t.click(`document.querySelector('#aic [data-home]')`);
      }
      say(!bad.length, `${tag}: all ${DATA.length} chips' cards open from their shelves, each named, with no undefined or NaN ${bad.slice(0, 3).join(' | ')}`);
      await audited(t, `${tag} after every card, light`);
      say(!t.errors.length, `${tag}: console clean ${t.errors.join(' | ')}`);
      await t.close();
    }

    /* ---------- a chip found elsewhere: a search result, and the Glossary's "On AI Chips" ---------- */
    {
      let s = await tab(chrome, '#/suppliers', { width: 1440 });
      await s.click(`document.querySelector('.search-btn')`); await s.s('Input.insertText', { text: 'H20' }); await sleep(600);
      await s.click(`[].slice.call(document.querySelectorAll('.cp-search-results a')).filter(function(a){return a.getAttribute('href')==='#/landscape?pick=nvidia-h20';})[0]`); await sleep(500);
      let r = await s.ev(`({ hash: location.hash, h: (document.querySelector('#aic-card h2')||{}).textContent, top: document.getElementById('aic-card') ? Math.round(document.getElementById('aic-card').getBoundingClientRect().top) : -1 })`);
      say(r.hash === '#/landscape?pick=nvidia-h20' && r.h === 'H20' && r.top > 0 && r.top < 900, `search: the H20's result opens its card on AI Chips, in view (${JSON.stringify(r)})`);
      say(!s.errors.length, `search: console clean ${s.errors.join(' | ')}`);
      await s.close();
      s = await tab(chrome, '#/glossary', { width: 1440 });
      // the Glossary is search first (Kinds and letters, 30 Oct 2026): "H100" typed, the H100's suggestion opens its entry
      await s.ev(`(document.getElementById('gl-search').focus(), 1)`); await s.s('Input.insertText', { text: 'H100' }); await sleep(500);
      await s.click(`[].slice.call(document.querySelectorAll('#gl-sugg .gl-opt')).filter(function(o){return o.querySelector('.gl-opt-n').textContent===CP.Lookup.byId['lk-chip-nvidia-h100'].title;})[0]`); await sleep(600);
      await s.click(`document.querySelector('a[data-chip="nvidia-h100"]')`); await sleep(500);
      r = await s.ev(`({ hash: location.hash, h: (document.querySelector('#aic-card h2')||{}).textContent, top: document.getElementById('aic-card') ? Math.round(document.getElementById('aic-card').getBoundingClientRect().top) : -1 })`);
      say(r.hash === '#/landscape?pick=nvidia-h100' && r.h === 'H100' && r.top > 0 && r.top < 900, `Glossary: "On AI Chips" opens the H100's card, in view (${JSON.stringify(r)})`);
      say(!s.errors.length, `Glossary: console clean ${s.errors.join(' | ')}`);
      await s.close();
    }

    /* ---------- /chips/ ---------- */
    const t = await open(chrome, BASE + '/chips/', { width: 1440, wait: 1200 });
    const r = await t.ev(`({ rows: document.querySelectorAll('table tbody tr').length, dots: document.querySelectorAll('.ctl-dot').length, top: document.querySelectorAll('.ctl-dot.top').length,
      lede: (document.querySelector('.ch-lede')||{}).textContent, text: document.querySelector('main').textContent, buttons: document.querySelectorAll('main button').length })`);
    say(r.rows === DATA.length && r.dots === 30 && r.top === 1 && r.buttons === 0, `/chips/: the full table (${r.rows} rows), the FP16 chart (${r.dots} dots, one the largest)`);
    say(r.lede === 'The chips that train and run AI models, from 2020 to 2026, and who makes each of their parts.' && !/Each dot links to|Scroll the table sideways|Each dot is a chip/.test(r.text), `/chips/: the intro carries the page's standfirst and no line on how to click or scroll`);
    await t.close();
  } finally { await chrome.close(); }
  const out = lines.concat(['', 'Clicks and taps for the tasks:'], tasks.map((x) => '  ' + x), '', fails ? fails + ' failed' : 'all ' + lines.length + ' checks pass');
  fs.writeFileSync(OUT, out.join('\n') + '\n');
  console.log('\n' + out.slice(lines.length).join('\n'));
  process.exit(fails ? 1 : 0);
})();
