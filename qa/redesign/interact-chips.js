#!/usr/bin/env node
/* AI Chips (design round five, option B "the tick list"): runs the reader's tasks with real mouse clicks, taps, typing and keys
   in headless Chrome, counts every click, and reads the result back from the page. Then it checks every control the page
   has: the chart (dots by mouse and keyboard, the six measures, rule B, highest first, the chips with no figure), a chip's
   card (its figure, parts and marks, the one box that ticks), the list (ticks, Find with Enter, the fifth refused, Clear), the
   comparison (pairs, Try with, numbers kept on a swap, the figures table with its letters and marks, parts, packages, words,
   the copy line, notes), the address (a shared link, a reload, Back and Forward), the stage, search, the phone's sheet and
   tray, and /chips/.
   usage: node qa/redesign/interact-chips.js [--base http://127.0.0.1:8772] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const BASE = (args.indexOf('--base') >= 0 ? args[args.indexOf('--base') + 1] : 'http://127.0.0.1:8772');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/landscape.json'), 'utf8'));
const byId = (id) => DATA.find((c) => c.id === id);

const results = [], tasks = [];
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'ok   ' : 'FAIL ') + name + (info !== undefined && !ok ? '  ' + JSON.stringify(info).slice(0, 600) : '')); };
let lastState = null;
const task = (name, width, clicks, ok, note) => { tasks.push({ name, width, clicks, ok: !!ok, note }); check(`task at ${width}: ${name} (${clicks} ${width < 768 ? 'taps' : 'clicks'}${note ? ', ' + note : ''})`, ok, ok ? undefined : lastState); };

// a tab with real input: a click (or a tap on a phone) at an element's centre, typing, keys; every click is counted
async function tab(chrome, url, o) {
  const t = await open(chrome, url, Object.assign({ wait: 2200 }, o));
  t.clicks = 0; t.phone = (o.width || 1440) < 768;
  t.box = (expr) => t.ev(`(function(){var e=(${expr}); if(!e) return null; e.scrollIntoView({block:'center',inline:'nearest'}); var r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};})()`);
  t.at = async (x, y) => {
    if (t.phone) {
      await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await t.s('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    t.clicks++; await sleep(380);
  };
  t.click = async (expr) => { const b = await t.box(expr); if (!b) throw new Error('nothing to click: ' + expr); await sleep(120); const b2 = await t.ev(`(function(){var r=(${expr}).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`); await t.at(b2.x, b2.y); };
  t.hover = async (x, y) => { await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await sleep(60); };
  t.type = async (text) => { await t.s('Input.insertText', { text }); await sleep(250); };
  t.key = async (key) => {
    const codes = { Enter: 13, Escape: 27, ArrowRight: 39, ArrowLeft: 37, ArrowDown: 40, ArrowUp: 38, Tab: 9, ' ': 32, Home: 36, End: 35 };
    const k = { key, code: key === ' ' ? 'Space' : key, windowsVirtualKeyCode: codes[key] || 0, nativeVirtualKeyCode: codes[key] || 0 };
    if (key === 'Enter') k.text = '\r'; if (key === ' ') k.text = ' ';
    await t.s('Input.dispatchKeyEvent', Object.assign({ type: 'keyDown' }, k)); await t.s('Input.dispatchKeyEvent', Object.assign({ type: 'keyUp' }, k)); await sleep(250);
  };
  t.st = () => t.ev('JSON.stringify({picked:CP.Landscape.picked,no:CP.Landscape.no,sel:CP.Landscape.sel,open:CP.Landscape.open,crowd:CP.Landscape.crowdIds,hash:location.hash,measure:CP.Landscape.measure,view:CP.Landscape.view})').then((j) => (lastState = JSON.parse(j)));
  t.reset = async (hash) => { await t.ev(`(document.getElementById('cx-find').value='', CP.Landscape.filterList(), history.replaceState(null,'',location.pathname+location.search+${JSON.stringify(hash || '#/landscape')}), CP.Landscape.initSelection(), CP.Landscape.measure='fp16', CP.Landscape.view='year', CP.Landscape.closeCard(false,true), CP.Landscape.listOpen(false,true), CP.Landscape.activate(), window.scrollTo(0,0), 1)`); await sleep(300); t.clicks = 0; };
  return t;
}
const box = (id) => `document.querySelector('#cx-list input[data-tick="${id}"]').closest('label')`;

(async () => {
  const chrome = launch();
  try {
    /* ================= the reader's tasks, at 1440 ================= */
    let t = await tab(chrome, BASE + '/#/landscape', { width: 1440 });
    let s = await t.st();
    const arrive = await t.ev(`({rows:document.querySelectorAll('#cx-list .aic-rl-o').length,head:document.getElementById('cx-title').textContent,pairs:document.querySelectorAll('#cx-cmp [data-pair]').length,
      hatch:document.querySelectorAll('.cx-plan--ghost,.cx-ghost,.sl.ghost,.cxa-add').length,dots:document.querySelectorAll('#cx-chart .pt').length,stage:document.getElementById('cx-spec-text').textContent})`);
    check('arrival: nothing ticked, the list of all 38 chips beside the chart, the comparison asks for ticks and offers the five pairs, no empty slots or hatching',
      s.picked.length === 0 && arrive.rows === 38 && arrive.head === 'Tick two to four chips to compare them.' && arrive.pairs === 5 && arrive.hatch === 0 && arrive.dots === 30 && s.hash === '#/landscape', { s, arrive });

    // 1. H100 with H20
    await t.click(box('nvidia-h100')); await t.click(box('nvidia-h20')); s = await t.st();
    let head = await t.ev(`document.getElementById('cx-title').textContent`);
    task('compare the H100 with the H20', 1440, t.clicks, s.picked.join() === 'nvidia-h100,nvidia-h20' && head === 'H100 and H20' && s.hash === '#/landscape?pick=nvidia-h100,nvidia-h20', 'two ticks in the list');
    await t.reset();
    await t.click(`document.querySelector('#cx-cmp [data-pair="1"]')`); s = await t.st();
    task('compare the H100 with the H20 by its suggested pair', 1440, t.clicks, s.picked.join() === 'nvidia-h100,nvidia-h20');
    // and by Find with Enter: one click into the field, then the keyboard
    await t.reset();
    await t.click(`document.getElementById('cx-find')`); await t.type('h100'); await t.key('Enter');
    await t.ev(`(function(){var f=document.getElementById('cx-find');f.select();return 1;})()`); await t.type('h20'); await t.key('Enter'); s = await t.st();
    task('compare the H100 with the H20 by Find and Enter', 1440, t.clicks, s.picked.join() === 'nvidia-h100,nvidia-h20', 'one click, then typing and Enter twice');

    // 2. four chips
    await t.reset();
    for (const id of ['nvidia-b300', 'amd-mi355x', 'nvidia-vr200', 'amd-mi455x']) await t.click(box(id));
    s = await t.st();
    const four = await t.ev(`({rows:[].slice.call(document.querySelectorAll('table.cx-fig tbody tr')).length,nums:[].slice.call(document.querySelectorAll('#cx-list .aic-rl-o.is-on .aic-box')).map(function(b){return b.textContent;}).join(),title:document.getElementById('cx-title').textContent,
      rings:[].slice.call(document.querySelectorAll('#cx-chart .pt.mine')).length,labs:[].slice.call(document.querySelectorAll('#cx-chart .lab.mine')).map(function(l){return l.textContent;}).sort().join('|')})`);
    task('compare the B300, Instinct MI355X, Rubin and Instinct MI455X', 1440, t.clicks, s.picked.join() === 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x' && four.title === 'B300, Instinct MI355X, Rubin and Instinct MI455X' && four.rings === 4, 'four ticks in the list');
    check('four: the boxes carry 1 to 4, the chart rings the four with their numbers, the figures table has one row per chip', four.nums === '1,3,2,4' && four.labs === '1 B300|2 Instinct MI355X|3 Rubin|4 Instinct MI455X, 5,033' && four.rows === 4, four);
    const fifth = await t.ev(`({dis:document.querySelectorAll('#cx-list input[data-tick]:disabled').length,foot:document.getElementById('cx-rl-foot').textContent})`);
    check('four: the other 34 boxes are disabled and the list says why', fifth.dis === 34 && /Four chips are ticked, the most the comparison holds\. Untick one to add another\./.test(fifth.foot), fifth);
    await t.ev(`document.getElementById('cx-find').value='h100',document.getElementById('cx-find').dispatchEvent(new Event('input')),document.getElementById('cx-find').focus(),1`); await t.key('Enter'); s = await t.st();
    check('four: Enter in Find on a disabled chip adds nothing', s.picked.length === 4 && s.picked.indexOf('nvidia-h100') < 0, s);
    await t.ev(`document.getElementById('cx-find').value='',document.getElementById('cx-find').dispatchEvent(new Event('input')),1`);

    // 5. remove one, then swap one (from the four)
    t.clicks = 0;
    await t.click(box('nvidia-vr200')); s = await t.st();
    const rem = s.picked.join() === 'nvidia-b300,amd-mi355x,amd-mi455x' && s.no['nvidia-b300'] === 1 && s.no['amd-mi355x'] === 2 && s.no['amd-mi455x'] === 4;
    task('remove one chip (Rubin)', 1440, t.clicks, rem, 'the others keep their numbers 1, 2 and 4');
    t.clicks = 0;
    await t.click(box('amd-mi355x')); await t.click(box('nvidia-h100')); s = await t.st();
    task('swap one chip (the Instinct MI355X for the H100)', 1440, t.clicks, s.no['nvidia-h100'] === 2 && s.no['nvidia-b300'] === 1 && s.no['amd-mi455x'] === 4 && s.picked.join() === 'nvidia-b300,nvidia-h100,amd-mi455x' && s.hash === '#/landscape?pick=nvidia-b300,nvidia-h100,amd-mi455x', 'the H100 takes the freed number 2');

    // 6. share by address, then reload
    const link = await t.ev('CP.Landscape.shareURL()');
    check('share: the Link the copy line copies is the address with the ticks', /#\/landscape\?pick=nvidia-b300,nvidia-h100,amd-mi455x$/.test(link), link);
    let t2 = await tab(chrome, BASE + '/#/landscape?pick=nvidia-b300,nvidia-h100,amd-mi455x&measure=mem', { width: 1440 });
    let s2 = await t2.st();
    const sh = await t2.ev(`({title:document.getElementById('cx-title').textContent,m:document.querySelector('#cx-measures [aria-pressed="true"]').textContent,nums:[].slice.call(document.querySelectorAll('table.cx-fig')[0].querySelectorAll('tbody .cx-no')).map(function(e){return e.textContent;}).join()})`);
    task('open a shared address', 1440, 0, s2.picked.join() === 'nvidia-b300,nvidia-h100,amd-mi455x' && sh.title === 'B300, H100 and Instinct MI455X' && sh.m === 'Memory' && sh.nums === '1,2,3', 'the ticks, their order and the measure come back' + (s2.picked.join() === 'nvidia-b300,nvidia-h100,amd-mi455x' ? '' : JSON.stringify(sh)));
    if (!(sh.title === 'B300, H100 and Instinct MI455X' && sh.m === 'Memory' && sh.nums === '1,2,3')) console.log('  shared:', JSON.stringify(sh));
    await t2.close();
    await t.s('Page.reload', {}); await sleep(3000); s = await t.st();
    task('reload', 1440, 0, s.picked.join() === 'nvidia-b300,nvidia-h100,amd-mi455x' && s.hash === '#/landscape?pick=nvidia-b300,nvidia-h100,amd-mi455x');

    // 7. Back and Forward
    await t.reset('#/landscape?pick=nvidia-h100,nvidia-h20'); s = await t.st();
    await t.click(`document.querySelector('.tabs a[data-view="suppliers"]')`); await sleep(400);
    const atSup = await t.ev('CP.Router.current');
    await t.ev('history.back(),1'); await sleep(900); s = await t.st();
    const backOk = atSup === 'suppliers' && s.picked.join() === 'nvidia-h100,nvidia-h20' && s.hash === '#/landscape?pick=nvidia-h100,nvidia-h20';
    await t.ev('history.forward(),1'); await sleep(900);
    const fwd = await t.ev('CP.Router.current');
    await t.ev('history.back(),1'); await sleep(900);
    await t.ev(`location.hash='#/landscape?pick=nvidia-b200,huawei-ascend-910c',1`); await sleep(700); s = await t.st();
    const linked = s.picked.join() === 'nvidia-b200,huawei-ascend-910c';
    await t.ev('history.back(),1'); await sleep(900); s = await t.st();
    const back2 = s.picked.join() === 'nvidia-h100,nvidia-h20';
    await t.ev('history.forward(),1'); await sleep(900); s = await t.st();
    const fwd2 = s.picked.join() === 'nvidia-b200,huawei-ascend-910c';
    check('Back from Suppliers returns to AI Chips with its ticks; Forward goes to Suppliers again', backOk && fwd === 'suppliers', { atSup, s, fwd });
    check('Back and Forward between two AI Chips addresses bring back each one\'s ticks', linked && back2 && fwd2, { linked, back2, fwd2 });
    const h0 = await t.ev('history.length');
    t.clicks = 0; await t.click(box('amd-mi300x')); await t.click(box('amd-mi325x')); await t.click(box('amd-mi300x')); await t.click(`document.querySelector('#cx-measures [data-m="bw"]')`);
    const h1 = await t.ev('history.length'); s = await t.st();
    check('ticks and measures are written in place: the history keeps pages, not ticks', h0 === h1 && s.hash === '#/landscape?pick=nvidia-b200,huawei-ascend-910c,amd-mi325x&measure=bw', { h0, h1, s });
    check('task at 1440: Back and Forward', backOk && fwd === 'suppliers' && linked && back2 && fwd2);
    tasks.push({ name: 'Back and Forward', width: 1440, clicks: 1, ok: backOk && linked && back2 && fwd2, note: 'one click on Suppliers, then the browser\'s Back and Forward' });

    // 3. who leads on memory
    await t.reset();
    await t.click(`document.querySelector('#cx-measures [data-m="mem"]')`);
    const maxMem = Math.max(...DATA.map((c) => (c.memory || {}).capacityGB).filter((v) => typeof v === 'number')), lead = DATA.filter((c) => (c.memory || {}).capacityGB === maxMem).map((c) => c.name.replace(/\s*\(.*\)\s*$/, ''));
    let sent = await t.ev(`document.getElementById('cx-atlas-s').textContent`); s = await t.st();
    task('find who leads on memory', 1440, t.clicks, sent.indexOf('The ' + lead[0] + ' is the highest, at ' + maxMem + ' gigabytes.') === 0 && s.picked.length === 0 && s.hash === '#/landscape?measure=mem', 'the Memory pill; the sentence under the heading names it');
    await t.click(`document.querySelector('#cx-view [data-v="rank"]')`);
    const rk = await t.ev(`({first:document.querySelector('.aic-rk .aic-rk-n').textContent,v:document.querySelector('.aic-rk .cx-v').textContent,top:document.querySelectorAll('.aic-rk-b i.is-top').length,ink:getComputedStyle(document.querySelector('.aic-rk-b i.is-top')).backgroundColor,rest:[...new Set([].slice.call(document.querySelectorAll('.aic-rk-b i:not(.is-top)')).map(function(i){return getComputedStyle(i).backgroundColor;}))],n:document.querySelectorAll('.aic-rk').length,marks:[].slice.call(document.querySelectorAll('.aic-rk')).filter(function(r){return !r.querySelector('sup.cite');}).length,h:document.getElementById('cx-atlas-t').textContent})`);
    check('highest first: the leader on top, its bar ink and the rest the tint (rule B), every figure with its mark, 36 chips at Memory', rk.first === lead[0] && rk.v === String(maxMem) && rk.top === lead.length && rk.ink === 'rgb(23, 23, 22)' && rk.rest.join() === 'rgb(210, 209, 204)' && rk.n === 36 && rk.marks === 0 && rk.h === 'Memory, highest first', rk);
    await t.click(`document.querySelector('.aic-rk-n[data-card="nvidia-h100"]')`); s = await t.st();
    check('highest first: a name opens its chip\'s card and ticks nothing', s.open === 'nvidia-h100' && s.picked.length === 0 && s.hash === '#/landscape?measure=mem&view=rank', s);

    // 4. who makes the 910C's HBM and who packages it
    await t.reset();
    await t.click(`document.querySelector('#cx-chart .pt[data-id="huawei-ascend-910c"] .dot')`); s = await t.st();
    let card = await t.ev(`(function(){var c=document.getElementById('cx-card');if(!c||c.hidden)return null;var o={};[].slice.call(c.querySelectorAll('dt')).forEach(function(dt){o[dt.textContent]=dt.nextElementSibling.textContent;});o.name=document.getElementById('cx-card-n').textContent;return o;})()`);
    if (!card && s.crowd) { await t.click(`document.querySelector('#cx-card [data-card-open="huawei-ascend-910c"]')`); card = await t.ev(`(function(){var c=document.getElementById('cx-card');var o={};[].slice.call(c.querySelectorAll('dt')).forEach(function(dt){o[dt.textContent]=dt.nextElementSibling.textContent;});o.name=document.getElementById('cx-card-n').textContent;return o;})()`); }
    const c910 = byId('huawei-ascend-910c');
    task('find who makes the HBM and who packages the Ascend 910C', 1440, t.clicks, card && card.name === c910.name && card['Memory supplier'] === c910.memory.suppliers.join(', ') && card['Assembled by'] === 'not published' && card.Package.indexOf(c910.package.type) === 0 && s.picked.length === 0,
      'its dot opens the card: "' + (card ? card['Memory supplier'] : '') + '", assembled by "' + (card ? card['Assembled by'] : '') + '"');
    check('card: the figure, the foundry and node, the package each carry their source mark', card && /781 TFLOPS\d/.test(card['Speed at FP16']) && /\d$|all$/.test(card['Foundry, node']), card);

    // 8. explore the chart: hover every dot, click several, walk by keys, change every measure and view, open the pills: nothing is ticked
    await t.reset();
    const centres = await t.ev(`(function(){document.querySelector('#cx-chart').scrollIntoView({block:'center'});return [].slice.call(document.querySelectorAll('#cx-chart .pt .dot')).map(function(d){var r=d.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});})()`);
    let tips = 0;
    for (const [x, y] of centres) { await t.hover(x, y); if (await t.ev(`!document.getElementById('cx-tip').hidden`)) tips++; }
    let opened = 0;
    for (const id of ['nvidia-b200', 'nvidia-a100', 'amd-mi455x', 'google-tpu-v4', 'nvidia-h800']) { const ex = `document.querySelector('#cx-chart .pt[data-id="${id}"] .dot')`; await t.click(ex); const st = await t.st(); if (st.open === id || (st.crowd && st.crowd.indexOf(id) >= 0)) opened++; await t.ev('CP.Landscape.closeCard(false),1'); }
    await t.ev(`document.querySelector('#cx-chart .pt[tabindex="0"]').focus(),1`);
    for (let i = 0; i < 6; i++) await t.key('ArrowRight');
    const kid = await t.ev('document.activeElement.getAttribute("data-id")');
    await t.key('Enter');
    const kcard = await t.ev(`({open:CP.Landscape.open,focus:document.activeElement&&document.activeElement.matches('#cx-card input[data-tick]')})`);
    await t.key('Escape');
    const kback = await t.ev('document.activeElement.getAttribute("data-id")');
    await t.key(' ');
    const kspace = await t.ev('CP.Landscape.open');
    await t.key('Escape');
    for (const m of ['fp8', 'fp4', 'mem', 'bw', 'tdp', 'fp16']) await t.click(`document.querySelector('#cx-measures [data-m="${m}"]')`);
    await t.click(`document.querySelector('#cx-gutter [data-card]')`);
    await t.click(`document.querySelector('#cx-view [data-v="rank"]')`); await t.click(`document.querySelector('.aic-rk-n')`); await t.click(`document.querySelector('#cx-view [data-v="year"]')`);
    s = await t.st();
    task('explore the chart with no accidental choice', 1440, t.clicks, s.picked.length === 0 && tips === centres.length && opened === 5 && kid && kcard.open === kid && kcard.focus && kback === kid && kspace === kid && s.hash === '#/landscape',
      `hovered ${centres.length} dots (${tips} tips), clicked 5 dots, walked 6 by arrows with Enter, Escape and Space, pressed every measure, a pill and both views: ${s.picked.length} ticked`);

    // the card's own box: the one control on the chart that ticks
    await t.reset();
    await t.click(`document.querySelector('#cx-chart .pt[data-id="nvidia-b200"] .dot')`);
    await t.click(`document.querySelector('#cx-card .aic-cbx')`); s = await t.st();
    const cb = await t.ev(`({box:document.querySelector('#cx-card .aic-box').textContent,go:!!document.querySelector('#cx-card [data-go]'),cap:document.getElementById('cx-spec-text').textContent,list:document.querySelector('#cx-list input[data-tick="nvidia-b200"]').checked})`);
    check('card: its box ticks the chip as chip 1, the list follows, the card offers Go to the comparison', s.picked.join() === 'nvidia-b200' && cb.box === '1' && cb.go && cb.list, { s, cb });
    check('stage: the chip whose card is open is on the stage', /^B200: 2 logic dies and 8 HBM3E stacks on CoWoS-L\.$/.test(cb.cap), cb.cap);
    await t.click(`document.querySelector('#cx-card [data-go]')`);
    const go = await t.ev(`({open:CP.Landscape.open,top:Math.round(document.getElementById('cx-compare').getBoundingClientRect().top)})`);
    check('card: Go to the comparison closes the card and brings the comparison up', !go.open && go.top >= 0 && go.top < 200, go);
    // Try with, then the stage follows the last tick
    await t.click(`document.querySelector('#cx-cmp [data-tickbtn]')`); s = await t.st();
    const tw = await t.ev(`({cap:document.getElementById('cx-spec-text').textContent,on:(document.querySelector('.cx-plan.is-on .cx-on')||{}).textContent,open:[].slice.call(document.querySelectorAll('#cx-notes details[open]')).map(function(d){return d.id;})})`);
    check('Try with ticks a partner as chip 2; the stage, the package line and the open notes follow the last tick', s.picked.length === 2 && s.no[s.picked[1]] === 2 && s.sel === s.picked[1] && tw.cap.indexOf(byId(s.picked[1]).name + ':') === 0 && tw.on === 'On the stage' && tw.open.join() === 'cx-note-' + s.picked[1], { s, tw });
    await t.click(`document.querySelector('#cx-cmp .cx-plan-hit[data-onstage="nvidia-b200"]')`); s = await t.st();
    check('packages: a drawing puts its chip on the stage', s.sel === 'nvidia-b200' && (await t.ev(`document.getElementById('cx-spec-text').textContent`)).indexOf('B200:') === 0, s);
    await t.click(`document.querySelector('#cx-cmp [data-clear]')`); s = await t.st();
    check('Clear: nothing ticked, the pairs come back, the stage shows the package', s.picked.length === 0 && await t.ev(`document.querySelectorAll('#cx-cmp [data-pair]').length`) === 5 && await t.ev(`document.getElementById('cx-spec-text').textContent`) === 'An AI accelerator package, drawn from above.', s);

    // the comparison in full, for the four
    await t.reset('#/landscape?pick=nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x');
    const cmp = await t.ev(`(function(){var ink='rgb(23, 23, 22)',ctx='rgb(210, 209, 204)',bad=[],tb=[].slice.call(document.querySelectorAll('table.cx-fig'));
      tb.forEach(function(table){var cols=table.querySelectorAll('tbody tr')[0].querySelectorAll('td').length;for(var k=0;k<cols;k++){var cells=[].slice.call(table.querySelectorAll('tbody tr')).map(function(tr){return tr.querySelectorAll('td')[k];});
        var vals=cells.map(function(td){var v=td.querySelector('.cx-v');return v?parseFloat(v.textContent.replace(/,/g,'')):null;}),have=vals.filter(function(v){return v!=null;}),max=Math.max.apply(null,have);
        cells.forEach(function(td,i){var v=td.querySelector('.cx-v');if(!v)return;if(!td.querySelector('sup.cite'))bad.push('no mark '+k+':'+i);var b=td.querySelector('.cx-bar i');if(have.length>1){var top=vals[i]===max,col=getComputedStyle(b).backgroundColor;if((top&&col!==ink)||(!top&&col!==ctx)||top!==v.classList.contains('is-top'))bad.push('rule B '+k+':'+i);}});}});
      var letters=[].slice.call(document.querySelectorAll('table.cx-fig .cx-fnl a')).map(function(a){return a.textContent;});
      return {bad:bad,tables:tb.length,letters:[...new Set(letters)].join(),fns:document.querySelectorAll('.cx-fns li').length,said:(document.querySelector('.cx-said')||{}).textContent,
        parts:document.querySelectorAll('table.cx-parts tbody tr').length,words:document.querySelectorAll('table.cx-words tbody').length,plans:document.querySelectorAll('.cx-plan').length,
        copy:[].slice.call(document.querySelectorAll('#cx-cmp [data-copy]')).map(function(b){return b.textContent.replace(/Copy (the comparison as a |the comparison as |a )/,'').replace(' to this comparison','');}).join('|'),
        notes:document.querySelectorAll('#cx-notes details').length,openN:document.querySelectorAll('#cx-notes details[open]').length,
        asm:[].slice.call(document.querySelectorAll('table.cx-parts tbody tr')).map(function(tr){return tr.querySelectorAll('td')[1].textContent;})};})()`);
    check('figures: one table, rule B in every column, a mark on every figure', cmp.tables === 1 && !cmp.bad.length, cmp.bad);
    check('figures: each speed figure carries its chip\'s note letter, a to d, with the four notes under the table', cmp.letters === 'a,b,c,d' && cmp.fns === 4, cmp);
    check('figures: a figure no chip has is said once under the table', cmp.said === 'The area of each die is not published for any of these four chips.', cmp.said);
    check('parts, packages at one scale, In words (seven attributes), the copy line (Table, JSON, Link), the notes with one open', cmp.parts === 4 && cmp.plans === 4 && cmp.words === 7 && cmp.copy === 'Table|JSON|Link' && cmp.notes === 4 && cmp.openN === 1, cmp);
    await t.click(`document.querySelector('table.cx-fig .cx-fnl a')`);
    const fnTop = await t.ev(`Math.round(document.getElementById('cx-sn-nvidia-b300').getBoundingClientRect().top)`); s = await t.st();
    check('a note letter scrolls to its note and leaves the address alone', fnTop > 60 && fnTop < 800 && s.hash === '#/landscape?pick=nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x', { fnTop, s });
    await t.click(`document.querySelector('table.cx-parts [data-notes="amd-mi455x"]')`);
    const nt = await t.ev(`({open:document.getElementById('cx-note-amd-mi455x').open,top:Math.round(document.getElementById('cx-note-amd-mi455x').getBoundingClientRect().top),sel:CP.Landscape.sel})`);
    check('Notes in a row head opens that chip\'s notes, in view, and puts it on the stage', nt.open && nt.top > 0 && nt.top < 400 && nt.sel === 'amd-mi455x', nt);
    await t.ev(`document.querySelector('table.cx-parts').scrollIntoView({block:'center'}),1`); await sleep(300);
    const rail = await t.ev(`(function(){var r=document.querySelector('.aic-rail-in').getBoundingClientRect();return {top:Math.round(r.top),hosted:!!document.querySelector('.aic-spec-draw canvas'),stage:getComputedStyle(document.querySelector('.stage')).display};})()`);
    check('the list stays in view while the comparison scrolls, with the specimen at its foot; the stage beside the page stands down', rail.top === 64 && rail.hosted && rail.stage === 'none', rail);
    // how many chips the list shows before it scrolls, at 900 high, with nothing ticked
    await t.reset(); await t.ev(`window.scrollTo(0, document.querySelector('.aic-ws').getBoundingClientRect().top + scrollY - 63), 1`); await sleep(300);
    const shown = await t.ev(`(function(){var l=document.getElementById('cx-list').getBoundingClientRect();return [].slice.call(document.querySelectorAll('#cx-list .aic-rl-o')).filter(function(o){var r=o.getBoundingClientRect();return r.top>=l.top&&r.bottom<=l.bottom+1;}).length;})()`);
    check('the list shows at least 14 chips before it scrolls, at 1440 by 900', shown >= 14, shown);
    tasks.push({ name: 'chips the list shows before it scrolls, 1440 by 900', width: 1440, clicks: shown, ok: shown >= 14, note: 'a count of rows, not clicks' });

    // 10. search "910C" and land on its card, keeping the ticks
    await t.reset('#/landscape?pick=nvidia-h100,nvidia-h20');
    await t.ev(`location.hash='#/suppliers',1`); await sleep(700); t.clicks = 0;
    await t.click(`document.querySelector('.search-btn')`); await t.type('910C');
    const hits = await t.ev(`[].slice.call(document.querySelectorAll('#cp-search ol a')).map(function(a){return a.querySelector('.k').textContent+' | '+a.querySelector('b').textContent;})`);
    const first = hits[0] || '';
    if (/^Chip \| Huawei Ascend 910C/.test(first)) await t.key('Enter'); else await t.click(`[].slice.call(document.querySelectorAll('#cp-search ol a')).filter(function(a){return /Ascend 910C/.test(a.textContent)&&a.querySelector('.k').textContent==='Chip';})[0]`);
    await sleep(900); s = await t.st();
    const sr = await t.ev(`({v:CP.Router.current,card:!document.getElementById('cx-card').hidden&&document.getElementById('cx-card-n').textContent,focus:document.activeElement&&document.activeElement.matches('#cx-card input[data-tick]'),inView:(function(){var r=document.getElementById('cx-card').getBoundingClientRect();return r.top>=60&&r.bottom<=innerHeight;})()})`);
    task('search "910C" and land on its card', 1440, t.clicks, sr.v === 'landscape' && sr.card === c910.name && s.picked.join() === 'nvidia-h100,nvidia-h20' && sr.inView, `the first result is "${first}"; the card opens in view, focus on its box, the ticks kept`);
    check('no errors in the console at 1440', !t.errors.length, t.errors);
    // leaving the view hands the canvas back to the stage
    await t.ev(`location.hash = '#/', 1`); await sleep(600);
    const back = await t.ev(`({inStage:!!document.querySelector('.stage canvas'),inRail:!!document.querySelector('.aic-spec-draw canvas'),tray:document.getElementById('cx-tray').hidden})`);
    check('leaving AI Chips: the drawing goes back to the stage', back.inStage && !back.inRail && back.tray, back);
    await t.close();

    /* ================= 9. every dot reachable, at 1440 and 390, at all six measures ================= */
    for (const w of [1440, 390]) {
      const tr = await tab(chrome, BASE + '/#/landscape', { width: w });
      const out = { dots: 0, direct: 0, viaList: 0, miss: [], chips: new Set() };
      for (const m of ['fp16', 'fp8', 'fp4', 'mem', 'bw', 'tdp']) {
        await tr.ev(`(CP.Landscape.measure='${m}', CP.Landscape.closeCard(false,true), CP.Landscape.renderChart(), 1)`); await sleep(150);
        const ids = await tr.ev(`[].slice.call(document.querySelectorAll('#cx-chart .pt')).map(function(g){return g.getAttribute('data-id');})`);
        for (const id of ids) {
          out.dots++;
          await tr.ev(`(CP.Landscape.closeCard(false), document.activeElement && document.activeElement.blur && document.activeElement.blur(), 1)`);
          const b = await tr.box(`document.querySelector('#cx-chart .pt[data-id="${id}"] .dot')`);
          await tr.at(b.x, b.y);
          let st = await tr.st();
          if (st.open === id) { out.direct++; out.chips.add(id); continue; }
          if (st.crowd && st.crowd.indexOf(id) >= 0) {
            await tr.click(`document.querySelector('#cx-card [data-card-open="${id}"]')`); st = await tr.st();
            if (st.open === id) { out.viaList++; out.chips.add(id); continue; }
          }
          out.miss.push(m + ':' + id + '->' + JSON.stringify({ open: st.open, crowd: st.crowd }));
        }
      }
      const pick = await tr.ev('CP.Landscape.picked.length');
      // a chip with no figure at any measure is reached by its pill under the chart
      const noDot = DATA.filter((c) => !out.chips.has(c.id)).map((c) => c.id);
      for (const id of noDot) { await tr.ev(`(CP.Landscape.closeCard(false),1)`); await tr.click(`document.querySelector('#cx-gutter [data-card="${id}"]')`); const st = await tr.st(); if (st.open === id) out.chips.add(id); else out.miss.push('pill:' + id); }
      task('every dot reachable by a ' + (w < 768 ? 'tap' : 'click') + ' at its centre, at all six measures', w, out.dots, !out.miss.length && pick === 0 && out.chips.size === 38,
        `${out.dots} dots: ${out.direct} open their card at once, ${out.viaList} through the short list where dots crowd; ${noDot.length} chip with no figure (${noDot.join(', ')}) by its pill; all ${out.chips.size} chips reached, ${pick} ticked`);
      if (out.miss.length) console.log('  unreachable:', out.miss.slice(0, 12));
      check(`no errors in the console, the reach test at ${w}`, !tr.errors.length, tr.errors);
      await tr.close();
    }

    /* ================= the phone ================= */
    t = await tab(chrome, BASE + '/#/landscape', { width: 390 });
    const p0 = await t.ev(`({strip:!!document.querySelector('.stage canvas'),rail:getComputedStyle(document.getElementById('cx-rail')).display,sw:document.documentElement.scrollWidth,labels:document.querySelectorAll('#cx-chart .lab').length,btn:document.getElementById('cx-open-list').textContent})`);
    check('phone: the specimen stays in the strip, the list waits behind its button, nothing scrolls sideways, the chart names only the largest', p0.strip && p0.rail === 'none' && p0.sw <= 390 && p0.labels === 1 && p0.btn === 'Tick chips to compare0 of 4 ticked', p0);
    await t.click(`document.getElementById('cx-open-list')`);
    const p1 = await t.ev(`({open:document.getElementById('cx-rail').classList.contains('is-open'),focus:document.activeElement&&document.activeElement.id,scrim:!document.getElementById('cx-scrim').hidden,done:(document.querySelector('#cx-rl-foot [data-done]')||{}).textContent})`);
    check('phone: Tick chips to compare opens the list as a sheet, Find focused, Done at its foot', p1.open && p1.focus === 'cx-find' && p1.scrim && p1.done === 'Done', p1);
    await t.click(box('nvidia-h100'));
    const p2 = await t.ev(`({tray:!document.getElementById('cx-tray').hidden,txt:document.getElementById('cx-tray').textContent})`);
    await t.click(box('nvidia-h20'));
    const p3 = await t.ev(`({tray:document.getElementById('cx-tray').textContent,x:document.getElementById('cx-rl-close').hidden,done:(document.querySelector('#cx-rl-foot [data-done]')||{}).textContent})`);
    check('phone: each tick shows in the tray above the sheet at once; at two the sheet\'s only way out is Show the comparison', p2.tray && p2.txt === '1H100' && p3.tray === '1H1002H20' && p3.x && p3.done === 'Show the comparison', { p2, p3 });
    await t.click(`document.querySelector('#cx-rl-foot [data-done]')`); await sleep(600); s = await t.st();
    const p4 = await t.ev(`({open:document.getElementById('cx-rail').classList.contains('is-open'),top:Math.round(document.getElementById('cx-compare').getBoundingClientRect().top),tray:!document.getElementById('cx-tray').hidden,sticky:getComputedStyle(document.documentElement).getPropertyValue('--cx-sticky').trim(),sw:document.documentElement.scrollWidth})`);
    task('compare the H100 with the H20', 390, t.clicks, s.picked.join() === 'nvidia-h100,nvidia-h20' && !p4.open && p4.top > 100 && p4.top < 300 && p4.tray && p4.sw <= 390, 'Tick chips to compare, two ticks, Show the comparison');
    await t.reset();
    await t.click(`document.getElementById('cx-open-list')`);
    for (const id of ['nvidia-b300', 'amd-mi355x', 'nvidia-vr200', 'amd-mi455x']) await t.click(box(id));
    await t.click(`document.querySelector('#cx-rl-foot [data-done]')`); await sleep(500); s = await t.st();
    task('compare the B300, Instinct MI355X, Rubin and Instinct MI455X', 390, t.clicks, s.picked.join() === 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x' && await t.ev('document.documentElement.scrollWidth') <= 390, 'the sheet, four ticks, Show the comparison');
    t.clicks = 0;
    await t.click(`document.querySelector('#cx-tray [data-openlist]')`);
    await t.click(box('nvidia-vr200')); await t.click(`document.querySelector('#cx-rl-foot [data-done]')`); s = await t.st();
    task('remove one chip', 390, t.clicks, s.picked.join() === 'nvidia-b300,amd-mi355x,amd-mi455x' && s.no['amd-mi455x'] === 4, 'Change in the tray, untick, Show the comparison');
    t.clicks = 0;
    await t.click(`document.querySelector('#cx-tray [data-openlist]')`);
    await t.click(box('amd-mi355x')); await t.click(box('nvidia-h100')); await t.click(`document.querySelector('#cx-rl-foot [data-done]')`); s = await t.st();
    task('swap one chip', 390, t.clicks, s.no['nvidia-h100'] === 2 && s.picked.join() === 'nvidia-b300,nvidia-h100,amd-mi455x', 'Change, untick, tick, Show the comparison');
    // the crowded B300 at Memory: a tap lists the chips there, and each opens its own card
    await t.reset('#/landscape?measure=mem');
    const b300 = await t.box(`document.querySelector('#cx-chart .pt[data-id="nvidia-b300"] .dot')`);
    await t.at(b300.x, b300.y); s = await t.st();
    const crowdList = s.crowd ? s.crowd.slice() : null;
    if (s.crowd) await t.click(`document.querySelector('#cx-card [data-card-open="nvidia-b300"]')`);
    s = await t.st();
    check('phone: a tap on the crowded B300 at Memory lists the chips there, then opens the B300\'s card; nothing is ticked', crowdList && crowdList.indexOf('nvidia-b300') >= 0 && crowdList.length > 1 && s.open === 'nvidia-b300' && s.picked.length === 0, { crowdList, s });
    // search on a phone, from another page: the card lands clear of the masthead and of the strip, which is still growing as the view arrives
    await t.reset('#/landscape?pick=nvidia-h100,nvidia-h20');
    await t.ev(`location.hash='#/suppliers',1`); await sleep(700); t.clicks = 0;
    await t.click(`document.querySelector('.search-btn')`); await t.type('B300');
    await t.click(`[].slice.call(document.querySelectorAll('#cp-search ol a')).filter(function(a){return a.querySelector('.k').textContent==='Chip';})[0]`);
    await sleep(1200); s = await t.st();
    const sp = await t.ev(`(function(){var c=document.getElementById('cx-card'),r=c.getBoundingClientRect(),st=document.querySelector('.stage').getBoundingClientRect(),b=c.querySelector('.aic-card-act input').getBoundingClientRect();return {card:!c.hidden&&document.getElementById('cx-card-n').textContent,top:Math.round(r.top),bottom:Math.round(r.bottom),strip:Math.round(st.top),box:Math.round(b.bottom),focus:document.activeElement&&document.activeElement.matches('#cx-card input[data-tick]')};})()`);
    task('search "B300" and land on its card', 390, t.clicks, s.open === 'nvidia-b300' && s.picked.join() === 'nvidia-h100,nvidia-h20' && sp.top >= 60 && sp.bottom <= sp.strip && sp.focus, `the card's foot at ${sp.bottom} px, the strip's top at ${sp.strip} px; focus on its box, the ticks kept`);
    check('phone: no errors in the console', !t.errors.length, t.errors);
    await t.close();

    /* ================= /chips/ ================= */
    t = await open(chrome, BASE + '/chips/', { width: 1440, wait: 1500 });
    const r = await t.ev(`(function(){var rows=[].slice.call(document.querySelectorAll('.chips-t tbody tr[id]')),dots=[].slice.call(document.querySelectorAll('.ctl-dot'));
      var miss=dots.filter(function(a){return !document.getElementById(a.getAttribute('href').slice(1));}).length;
      var heads=[].slice.call(document.querySelectorAll('.chips-t thead th')).map(function(th){return th.textContent;});
      return {rows:rows.length,srcs:rows.filter(function(tr){return document.getElementById(tr.id+'-sources');}).length,dots:dots.length,top:document.querySelectorAll('.ctl-dot.top').length,miss:miss,heads:heads,
        labels:[].slice.call(document.querySelectorAll('.ctl-lab')).filter(function(l){return getComputedStyle(l).display!=='none';}).length,before:!!document.querySelector('.ctl')&&document.querySelector('.ctl').compareDocumentPosition(document.querySelector('.chips-t'))&4,
        buttons:document.querySelectorAll('button').length,a100bw:(document.querySelector('#nvidia-a100 td:nth-child(9)')||{}).textContent,sub:[].slice.call(document.querySelectorAll('.ref-sub')).map(function(p){return p.textContent;}).filter(function(t){return /^TFLOPS/.test(t);}).length};})()`);
    check('/chips/: 38 rows with their anchors and source lists (the Glossary and the card\'s "all" link to them)', r.rows === 38 && r.srcs === 38, r);
    check('/chips/: the FP16 chart above the table, 30 dots, one solid, each a link to its row', r.dots === 30 && r.top === 1 && r.miss === 0 && r.before && r.labels >= 20, r);
    check('/chips/: the figures as published (the A100\'s bandwidth reads 2.039), the column says Memory supplier, the TFLOPS note is kept', /^2\.039/.test(r.a100bw || '') && r.heads.indexOf('Memory supplier') >= 0 && r.sub === 1, r);
    check('/chips/: no button from the app', r.buttons === 0, r.buttons);
    await t.close();
  } finally { await chrome.close(); }
  const bad = results.filter((x) => !x.ok);
  console.log('\nTasks, with the clicks each took:');
  tasks.forEach((x) => console.log(`  ${x.ok ? 'pass' : 'FAIL'}  ${x.width}  ${x.name}: ${x.clicks}${x.note ? '  (' + x.note + ')' : ''}`));
  console.log(`\n${results.length - bad.length} of ${results.length} checks pass`);
  process.exit(bad.length ? 1 : 0);
})();
