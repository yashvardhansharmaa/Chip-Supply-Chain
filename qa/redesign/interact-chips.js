#!/usr/bin/env node
/* AI Chips (redesign, option C "The timeline"): drives every control of the view and of /chips/ in headless Chrome and checks
   what each one does. The chart (dots by mouse and keyboard, the measures, rule B, the picks ringed in wine, the chips with no
   figure), the specimen beside the chart (a phone keeps it in the strip), the picks (pairs, Try with, the picker with a filter
   and Enter, the folded list, the fifth refused in words, Change and Remove), the comparison (packages at one scale, the figures
   as bars with rule B in each row, the table of words with Change, × and Read the notes, a source on every figure, the speed
   notes, the copy line, the notes with numbered sources), the bar that follows the reader, and /chips/ (its chart and the
   per-chip anchors the Glossary links to).
   usage: node qa/redesign/interact-chips.js [--base http://127.0.0.1:8768] */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const BASE = (args.indexOf('--base') >= 0 ? args[args.indexOf('--base') + 1] : 'http://127.0.0.1:8768');

const results = [];
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'ok   ' : 'FAIL ') + name + (info !== undefined && !ok ? '  ' + JSON.stringify(info) : '')); };

(async () => {
  const chrome = launch();
  try {
    /* ---------------- the view on a wide screen ---------------- */
    let t = await open(chrome, BASE + '/#/landscape', { width: 1440, wait: 2500 });
    const ev = t.ev;
    const st = () => ev('JSON.stringify({ picked: CP.Landscape.picked, sel: CP.Landscape.sel })').then(JSON.parse);
    const click = (sel) => ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return 0;e.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1;})()`);
    const key = async (k) => { const code = { Enter: 'Enter', ArrowRight: 'ArrowRight', ' ': 'Space' }[k] || k; await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: { Enter: 13, ArrowRight: 39 }[k] || 0 }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code }); await sleep(120); };

    // the chart, empty
    const c0 = await ev(`(function(){var pts=[].slice.call(document.querySelectorAll('#cx-chart .pt'));var cs=function(e){return getComputedStyle(e).fill;};
      var ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();var top=pts.filter(function(p){return p.classList.contains('top');});
      var acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return {n:pts.length,top:top.map(function(p){return p.getAttribute('data-id');}),topFill:top.length?cs(top[0].querySelector('.dot')):'',restFills:[...new Set(pts.filter(function(p){return !p.classList.contains('top');}).map(function(p){return cs(p.querySelector('.dot'));}))],
        k:document.getElementById('cx-atlas-k').textContent,t:document.getElementById('cx-atlas-t').textContent,s:document.getElementById('cx-atlas-s').textContent,
        gut:[].slice.call(document.querySelectorAll('#cx-gutter button')).length,gutK:[].slice.call(document.querySelectorAll('.aic-gut-k')).map(function(e){return e.textContent;}),
        tabStops:pts.filter(function(p){return p.getAttribute('tabindex')==='0';}).length,labels:document.querySelectorAll('#cx-chart .lab').length,
        hosted:!!document.querySelector('.aic-spec-draw canvas'),stage:getComputedStyle(document.querySelector('.stage')).display,cap:document.getElementById('cx-spec-text').textContent};})()`);
    check('chart: 30 of 38 chips have an FP16 figure', c0.n === 30 && c0.k === '30 of 38 chips have a published figure', c0);
    check('chart: the largest (Instinct MI455X) is the one solid dot, in ink', c0.top.length === 1 && c0.top[0] === 'amd-mi455x' && c0.topFill === 'rgb(23, 23, 22)', c0);
    check('chart: every other dot takes the light tint', c0.restFills.length === 1 && c0.restFills[0] === 'rgb(210, 209, 204)', c0.restFills);
    check('chart: heading and finding', c0.t === 'Speed at FP16, by the year each chip was announced' && /^The Instinct MI455X is the highest, at 5,033 TFLOPS\. Choose a dot/.test(c0.s), c0);
    check('chart: 8 chips with no figure, as pills', c0.gut === 8 && c0.gutK.join('|') === 'Not published at FP16', c0);
    check('chart: one Tab stop among the dots', c0.tabStops === 1, c0.tabStops);
    check('chart: labels placed', c0.labels >= 20, c0.labels);
    check('specimen: drawn beside the chart, the stage beside the page stands down', c0.hosted && c0.stage === 'none', c0);
    check('specimen: the generic package caption', c0.cap === 'An AI accelerator package, drawn from above.', c0.cap);

    // the measures
    await click('#cx-measures [data-m="mem"]'); await sleep(200);
    let m = await ev(`({t:document.getElementById('cx-atlas-t').textContent,p:document.querySelector('#cx-measures [data-m="mem"]').getAttribute('aria-pressed'),f:document.querySelector('#cx-measures [data-m="fp16"]').getAttribute('aria-pressed'),n:document.querySelectorAll('#cx-chart .pt').length})`);
    check('measure: Memory redraws the chart and is pressed alone', m.t === 'Memory, by the year each chip was announced' && m.p === 'true' && m.f === 'false', m);
    await click('#cx-measures [data-m="bw"]'); await sleep(200);
    m = await ev(`({s:document.getElementById('cx-atlas-s').textContent,arr:document.querySelectorAll('#cx-chart .arr').length,top:(document.querySelector('#cx-chart .pt.top')||{}).getAttribute&&document.querySelector('#cx-chart .pt.top').getAttribute('data-id')})`);
    check('measure: Bandwidth sets the wafer-scale chip over the scale, with its arrow', /above the top of the scale/.test(m.s) && m.arr === 1 && m.top === 'cerebras-wse3-turbo', m);
    await click('#cx-measures [data-m="fp8"]'); await sleep(200);
    m = await ev(`[].slice.call(document.querySelectorAll('.aic-gut-k')).map(function(e){return e.textContent;})`);
    check('measure: FP8 parts the chips with no figure into not published and not supported', m.join('|') === 'Not published at FP8|Not supported at FP8', m);
    await click('#cx-measures [data-m="fp16"]'); await sleep(200);

    // a dot picks its chip
    await click('#cx-chart .pt[data-id="nvidia-b200"]'); await sleep(300);
    let s = await st();
    const d1 = await ev(`({ring:!!document.querySelector('#cx-chart .pt[data-id="nvidia-b200"] .ring'),ringStroke:getComputedStyle(document.querySelector('#cx-chart .pt[data-id="nvidia-b200"] .ring')).stroke,lab:(document.querySelector('#cx-chart .lab.mine')||{}).textContent,
      tries:[].slice.call(document.querySelectorAll('#cxa-pairs [data-try]')).map(function(b){return b.textContent;}),pairs:document.querySelectorAll('#cxa-pairs [data-pair]').length,ask:document.getElementById('cxa-ask').textContent,cap:document.getElementById('cx-spec-text').textContent})`);
    check('dot: a press adds its chip', s.picked.join() === 'nvidia-b200', s);
    check('dot: the pick is ringed in red wine and labelled with its number', d1.ring && d1.ringStroke === 'rgb(122, 31, 43)' && d1.lab === '1 B200', d1);
    check('picks: Try with offers three partners after the first pick, the pairs go', d1.tries.length === 3 && d1.pairs === 0 && d1.ask === 'Choose one more chip to compare.', d1);
    check('specimen: the chip goes on the stage', /^B200: 2 logic dies and 8 HBM3E stacks on CoWoS-L\.$/.test(d1.cap), d1.cap);
    await click('#cxa-pairs [data-try]'); await sleep(300); s = await st();
    check('Try with: fills chip 2', s.picked.length === 2 && s.picked[0] === 'nvidia-b200', s);
    // the keyboard on the chart
    await ev(`document.querySelector('#cx-chart .pt[tabindex="0"]').focus(),1`);
    const f0 = await ev('document.activeElement.getAttribute("data-id")');
    await key('ArrowRight');
    const f1 = await ev('document.activeElement.getAttribute("data-id")');
    const ft = await ev(`({tip:!document.getElementById('cx-tip').hidden,txt:document.getElementById('cx-tip').textContent})`);
    check('chart keys: an arrow moves to the next dot, its card shows', f0 && f1 && f0 !== f1 && ft.tip, { f0, f1, ft });
    const before = (await st()).picked.length;
    await key('Enter'); s = await st();
    check('chart keys: Enter adds the dot\'s chip and focus stays on it', s.picked.length === before + 1 && s.picked.indexOf(f1) >= 0 && await ev('document.activeElement.getAttribute("data-id")') === f1, s);
    await key('Enter'); s = await st();
    check('chart keys: Enter again takes it out', s.picked.length === before && s.picked.indexOf(f1) < 0, s);

    // Clear, then the pairs
    await click('#cx-clear'); await sleep(200); s = await st();
    const pr = await ev(`({n:document.querySelectorAll('#cxa-pairs [data-pair]').length,labels:[].slice.call(document.querySelectorAll('#cxa-pairs [data-pair]')).map(function(b){return b.textContent;})})`);
    check('Clear: nothing picked, the five pairs come back', s.picked.length === 0 && pr.n === 5, pr);
    await click('#cxa-pairs [data-pair="0"]'); await sleep(300); s = await st();
    check('pair: B200 and Ascend 910C', s.picked.join() === 'nvidia-b200,huawei-ascend-910c', s);
    const title = await ev('document.getElementById("cx-title").textContent');
    check('comparison: its title names the pair', title === 'B200 and Ascend 910C, side by side', title);

    // the picker: a filter and Enter
    await click('#cxa-row .cxa-slot[data-i="2"] [data-act="choose"]'); await sleep(250);
    const pk = await ev(`({open:!document.getElementById('cxp').hidden,t:document.getElementById('cxp-t').textContent,focus:document.activeElement&&document.activeElement.id,mark:(document.querySelector('#cxp-o-nvidia-b200 .cxp-s')||{}).textContent})`);
    check('picker: opens on the empty pick, the field focused, chips marked "In chip 1"', pk.open && pk.t === 'Choose chip 3' && pk.focus === 'cxp-in' && pk.mark === 'In chip 1', pk);
    await t.s('Input.insertText', { text: 'mi355' }); await sleep(200);
    await key('Enter'); await sleep(300); s = await st();
    check('picker: typing and Enter take the first match', s.picked[2] === 'amd-mi355x' && await ev('document.getElementById("cxp").hidden'), s);
    // the folded list: a fourth, then the fifth refused in words
    await ev(`document.getElementById('cxa-browse').open = true, 1`);
    await click('#picker button[data-id="google-tpu-v7-ironwood"]'); await sleep(250);
    await click('#picker button[data-id="nvidia-h100"]'); await sleep(250); s = await st();
    const ask = await ev('document.getElementById("cxa-ask").textContent');
    check('list: a fourth chip, then the fifth is refused in words', s.picked.length === 4 && s.picked.indexOf('nvidia-h100') < 0 && ask === 'Compare up to four. Remove one to add another.', { s, ask });
    const dis = await ev(`document.querySelectorAll('#picker button[aria-disabled="true"]').length`);
    check('list: at four the others say they are unavailable', dis === 34, dis);

    // the comparison
    const cmp = await ev(`(function(){var ink='rgb(23, 23, 22)',ctx='rgb(210, 209, 204)',bad=[],rows=[].slice.call(document.querySelectorAll('#cx-strips .srow'));
      rows.forEach(function(r){var vals=[].slice.call(r.querySelectorAll('.sl')).map(function(l){var v=l.querySelector('.cx-v');return v?parseFloat(v.textContent.replace(/,/g,'')):null;});
        var max=Math.max.apply(null,vals.filter(function(v){return v!=null;}));
        [].slice.call(r.querySelectorAll('.sl')).forEach(function(l,i){var b=l.querySelector('.sl-b i');if(!b)return;var top=vals[i]===max,col=getComputedStyle(b).backgroundColor;if(top!==b.classList.contains('top')||(top&&col!==ink)||(!top&&col!==ctx))bad.push(r.querySelector('.srow-h').textContent+' '+i+' '+col);
          var v=l.querySelector('.cx-v');if(v&&!l.querySelector('sup.cite'))bad.push('no source: '+r.querySelector('.srow-h').textContent+' '+i);});});
      var cells=[].slice.call(document.querySelectorAll('#cx-table tbody td')),nosrc=cells.filter(function(td){return !td.querySelector('.cx-nil')&&!td.querySelector('sup.cite');}).length;
      var plans=[].slice.call(document.querySelectorAll('#cx-plans .cx-plan:not(.cx-plan--ghost)')),hbm=[...new Set([].slice.call(document.querySelectorAll('#cx-plans .cx-hbm')).map(function(e){return getComputedStyle(e).fill;}))];
      return {rows:rows.length,bad:bad,trs:document.querySelectorAll('#cx-table tbody tr').length,cols:document.querySelectorAll('#cx-table thead th.cx-col').length,nosrc:nosrc,
        heads:[].slice.call(document.querySelectorAll('#cx-table thead th.cx-col')).map(function(th){return !!th.querySelector('[data-act="change"]')&&!!th.querySelector('[data-act="remove"]')&&!!th.querySelector('[data-notes]');}),
        plans:plans.length,on:[].slice.call(document.querySelectorAll('#cx-plans .cx-on')).map(function(e){return e.textContent;}).filter(Boolean),hbm:hbm,key:document.getElementById('cx-key').textContent,
        fns:document.querySelectorAll('#cx-foot li').length,copy:(document.querySelector('.export-bar.xq')||{}).textContent,notes:document.querySelectorAll('#cx-notes details').length,open:document.querySelectorAll('#cx-notes details[open]').length,
        srcs:[].slice.call(document.querySelectorAll('#cx-notes .cx-srcs')).map(function(o){return o.children.length;})};})()`);
    check('figures: 8 rows of bars, rule B in each (the largest ink, the rest the tint), a source on every figure', cmp.rows === 8 && !cmp.bad.length, cmp.bad);
    check('words: 11 rows, a column per chip, every cell with a value carries a source', cmp.trs === 11 && cmp.cols === 4 && cmp.nosrc === 0, cmp);
    check('words: every column head has Change, × and Read the notes', cmp.heads.length === 4 && cmp.heads.every(Boolean), cmp.heads);
    check('packages: four drawn at one scale, the one on the stage says so, memory gray', cmp.plans === 4 && cmp.on.length === 1 && cmp.hbm.length === 1 && cmp.hbm[0] === 'rgb(140, 138, 132)' && /Logic die.*mm/.test(cmp.key), cmp);
    check('speed notes, the copy line, the notes with numbered sources', cmp.fns >= 3 && /Copy the comparison/.test(cmp.copy || '') && cmp.notes === 4 && cmp.open === 1 && cmp.srcs.every(function (n) { return n > 0; }), cmp);
    // Change from a column head, then × from a column head, then Read the notes
    await click('#cx-table thead th.cx-col [data-act="change"][data-slot="3"]'); await sleep(250);
    const ch = await ev(`({open:!document.getElementById('cxp').hidden,t:document.getElementById('cxp-t').textContent})`);
    check('column head: Change opens the picker for that chip', ch.open && ch.t === 'Change chip 4', ch);
    await key('Escape'); await sleep(150);
    await click('#cx-table thead th.cx-col [data-act="remove"][data-slot="3"]'); await sleep(250); s = await st();
    check('column head: × removes that chip', s.picked.length === 3 && s.picked.indexOf('google-tpu-v7-ironwood') < 0, s);
    await click('#cx-table [data-notes="huawei-ascend-910c"]'); await sleep(900);
    const rn = await ev(`({open:document.getElementById('cx-note-huawei-ascend-910c').open,top:Math.round(document.getElementById('cx-note-huawei-ascend-910c').getBoundingClientRect().top),sel:CP.Landscape.sel})`);
    check('Read the notes: opens that chip\'s notes, in view, and puts it on the stage', rn.open && rn.top > 0 && rn.top < 400 && rn.sel === 'huawei-ascend-910c', rn);
    const bar = await ev(`({shown:!document.getElementById('cx-sticky').hidden,chips:document.querySelectorAll('#cxs-in .cxs-chip').length})`);
    check('the bar follows the reader once the picks scroll away', bar.shown && bar.chips === 3, bar);
    // a pick's Remove, and a chip's name on the stage
    await t.scrollTo(0);
    await click('#cxa-row .cxa-slot[data-i="0"] .cxa-name'); await sleep(250); s = await st();
    check('pick: the name puts the chip on the stage', s.sel === 'nvidia-b200', s);
    await click('#cxa-row .cxa-slot[data-i="2"] [data-act="remove"]'); await sleep(250); s = await st();
    check('pick: Remove empties it', s.picked.join() === 'nvidia-b200,huawei-ascend-910c', s);
    // search's way in
    await ev(`CP.Landscape.select('nvidia-h100'), 1`); await sleep(250); s = await st();
    check('search: a chip found by search joins the comparison and goes on the stage', s.picked.indexOf('nvidia-h100') >= 0 && s.sel === 'nvidia-h100', s);
    check('no errors in the console', !t.errors.length, t.errors);
    // leaving the view hands the canvas back to the stage
    await ev(`location.hash = '#/', 1`); await sleep(600);
    const back = await ev(`({inStage:!!document.querySelector('.stage canvas'),inAside:!!document.querySelector('.aic-spec-draw canvas')})`);
    check('leaving AI Chips: the drawing goes back to the stage', back.inStage && !back.inAside, back);
    await t.close();

    /* ---------------- the phone ---------------- */
    t = await open(chrome, BASE + '/#/landscape', { width: 390, wait: 2500 });
    const p0 = await t.ev(`({strip:!!document.querySelector('.stage canvas'),aside:getComputedStyle(document.querySelector('.aic-spec')).display,sw:document.documentElement.scrollWidth,labels:document.querySelectorAll('#cx-chart .lab').length})`);
    check('phone: the specimen stays in the strip, nothing scrolls sideways, the chart names only the largest', p0.strip && p0.aside === 'none' && p0.sw <= 390 && p0.labels === 1, p0);
    await t.ev(`document.querySelector('#cxa-row .cxa-slot[data-i="0"] [data-act="choose"]').click(), 1`); await sleep(300);
    const p1 = await t.ev(`({sheet:document.getElementById('cxp').classList.contains('is-sheet'),open:!document.getElementById('cxp').hidden})`);
    check('phone: the picker rises as a sheet', p1.sheet && p1.open, p1);
    check('phone: no errors in the console', !t.errors.length, t.errors);
    await t.close();

    /* ---------------- /chips/ ---------------- */
    t = await open(chrome, BASE + '/chips/', { width: 1440, wait: 1500 });
    const r = await t.ev(`(function(){var rows=[].slice.call(document.querySelectorAll('.chips-t tbody tr[id]')),dots=[].slice.call(document.querySelectorAll('.ctl-dot'));
      var miss=dots.filter(function(a){return !document.getElementById(a.getAttribute('href').slice(1));}).length;
      return {rows:rows.length,srcs:rows.filter(function(tr){return document.getElementById(tr.id+'-sources');}).length,dots:dots.length,top:document.querySelectorAll('.ctl-dot.top').length,miss:miss,
        labels:[].slice.call(document.querySelectorAll('.ctl-lab')).filter(function(l){return getComputedStyle(l).display!=='none';}).length,before:!!document.querySelector('.ctl')&&document.querySelector('.ctl').compareDocumentPosition(document.querySelector('.chips-t'))&4,
        buttons:document.querySelectorAll('button').length};})()`);
    check('/chips/: 38 rows with their anchors and source lists (the Glossary links to them)', r.rows === 38 && r.srcs === 38, r);
    check('/chips/: the FP16 chart above the table, 30 dots, one solid, each a link to its row', r.dots === 30 && r.top === 1 && r.miss === 0 && r.before && r.labels >= 20, r);
    check('/chips/: no button from the app', r.buttons === 0, r.buttons);
    await t.close();
  } finally { await chrome.close(); }
  const bad = results.filter((x) => !x.ok);
  console.log(`\n${results.length - bad.length} of ${results.length} checks pass`);
  process.exit(bad.length ? 1 : 0);
})();
