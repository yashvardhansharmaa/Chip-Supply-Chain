#!/usr/bin/env node
/* The labels on the specimens of Silicon and Wafers, Memory and HBM and Advanced Packaging, beside Lithography's (29 Oct 2026):
   - at 1440, four balloons ride on each drawing, every name inside the drawing's box at 11 px or more, and on a side whose
     names stand under their balloons the balloons keep 58 px apart (CoWoS), elsewhere 34;
   - the parts list under the caption reads as data/specimen-parts.json says, with its links;
   - each chapter carries its annotated still for print (a <template> holding the still, its picture and a balloon per part);
   - without WebGL the drawing's slot goes and the caption and the parts list stay, as for Lithography;
   - the HBM drawing's two versions (?hbm=a, ?hbm=b) both draw, with all four balloons, and the default is the one the
     specimen names.
   usage: node qa/redesign/check-labels.js [base] (default http://127.0.0.1:8786) */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8786';
const PARTS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'specimen-parts.json'), 'utf8'));
const IDS = ['silicon-and-wafers', 'lithography', 'memory-and-hbm', 'advanced-packaging'];
const BAL = `(function(){var s=document.querySelector('.ch-balloons'),d=document.querySelector('.ch-spec-draw');if(!s||!d)return null;var c=d.getBoundingClientRect();
  return [].map.call(s.querySelectorAll('g'),function(g){var b=g.querySelector('.bal'),n=g.querySelector('.nm'),nb=n.getBoundingClientRect();
  return {n:+g.querySelector('.num').textContent,name:n.textContent,x:+b.getAttribute('cx'),y:+b.getAttribute('cy'),under:n.getAttribute('text-anchor')==='middle',
  inside:nb.left>=c.left-1&&nb.right<=c.right+1&&nb.top>=c.top-60&&nb.bottom<=c.bottom+40,fs:parseFloat(getComputedStyle(n).fontSize)};});})()`;
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail != null && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
  try {
    for (const id of IDS) {
      const e = PARTS[id];
      const t = await open(chrome, `${BASE}/${id}/`, { width: 1440, wait: 2500 });
      await t.ev(`(function(){var c=document.querySelector('.ch-spec-draw');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,c.getBoundingClientRect().top+scrollY-140);return 1;})()`);
      await sleep(2500);
      const bal = await t.ev(BAL);
      check(`${id} 1440: ${e.parts.length} balloons on the drawing`, bal && bal.length === e.parts.length, bal && bal.map((b) => `${b.n} ${b.name} (${Math.round(b.x)},${Math.round(b.y)})`).join(', '));
      check(`${id} 1440: each balloon carries its part's short name`, bal && bal.every((b, i) => b.name === (e.parts[i].label || e.parts[i].name)));
      check(`${id} 1440: every name inside the drawing's box, at 11 px or more`, bal && bal.every((b) => b.inside && b.fs >= 11));
      for (const side of ['left', 'right']) {
        const l = (bal || []).filter((b) => (side === 'left') === (b.x < 333)).sort((a, b) => a.y - b.y);
        if (l.length < 2) continue;
        const min = l.some((b) => b.under) ? 58 : 34, gaps = l.slice(1).map((b, i) => Math.round(b.y - l[i].y));
        check(`${id} 1440: the ${side} balloons keep ${min} px apart${min === 58 ? ', since a name there stands under its balloon' : ''}`, gaps.every((g) => g >= min - 0.5), gaps.join(', '));
      }
      const list = await t.ev(`[].map.call(document.querySelectorAll('.ch-spec .ch-parts li'),function(li){var a=li.querySelector('a');return li.querySelector('span').textContent+(a?' -> '+a.getAttribute('href'):'');})`);
      const want = e.parts.map((p) => p.stage ? null : `${p.name}: ${p.maker}${p.link ? ', ' + p.link[1] + ' -> ' + p.link[0] : ''}`);
      check(`${id}: the parts list reads as the data file says`, list.length === e.parts.length && list.every((s, i) => want[i] === null ? /: see stage \d\d, .* -> \.\.\/[a-z-]+\/$/.test(s) : s === want[i]), list.join(' | '));
      const tpl = await t.ev(`(function(){var tp=document.querySelector('.ch-spec template.cp-still-src');if(!tp)return null;var s=tp.content.querySelector('svg.ch-still--wide');return {img:s.querySelector('image').getAttribute('href'),n:s.querySelectorAll('g').length,label:s.getAttribute('aria-label')};})()`);
      check(`${id}: the print still waits in its template, a balloon per part`, tpl && tpl.n === e.parts.length && tpl.img === `../media/${e.still.file}`, tpl && `${tpl.img}, ${tpl.n} balloons, "${tpl.label}"`);
      const img = await t.ev(`fetch(${JSON.stringify(`../media/${e.still.file}`)}).then(function(r){return r.ok&&r.headers.get('content-type');})`);
      check(`${id}: the still's picture is served`, /image\/webp/.test(img || ''), img);
      if (t.errors.length) check(`${id}: no errors`, false, t.errors.join(' | '));
      await t.close();
    }
    // without WebGL: the slot goes, the caption and the parts list stay
    for (const id of IDS) {
      const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
      const s = (m, p) => chrome.send(m, p, sessionId);
      await s('Page.enable'); await s('Runtime.enable');
      await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
      await s('Page.addScriptToEvaluateOnNewDocument', { source: `(function(){var g=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(k){return /webgl/.test(k)?null:g.apply(this,arguments);};})();` });
      await s('Page.navigate', { url: `${BASE}/${id}/` }); await sleep(3000);
      const r = (await s('Runtime.evaluate', { expression: `(function(){var d=document.querySelector('.ch-spec-draw'),p=document.querySelector('.ch-spec .ch-parts');return {noStage:document.documentElement.classList.contains('no-stage'),slot:getComputedStyle(d).display,parts:p?p.querySelectorAll('li').length:0,shown:!!p&&p.getBoundingClientRect().height>0,cap:!!document.querySelector('.ch-spec-cap p')};})()`, returnByValue: true })).result.value;
      check(`${id}, no WebGL: the slot goes, the caption and its ${PARTS[id].parts.length} parts stay`, r.noStage && r.slot === 'none' && r.parts === PARTS[id].parts.length && r.shown && r.cap, JSON.stringify(r));
      await chrome.send('Target.closeTarget', { targetId });
    }
    // the HBM drawing's two versions
    const def = (/var DEFAULT = '([ab])'/.exec(fs.readFileSync(path.join(__dirname, '..', '..', 'specimens', 'hbm-stack.js'), 'utf8')) || [])[1];
    const pts = {};
    for (const v of ['', 'a', 'b']) {
      const t = await open(chrome, `${BASE}/memory-and-hbm/${v ? '?hbm=' + v : ''}`, { width: 1440, wait: 2500 });
      await t.ev(`(function(){var c=document.querySelector('.ch-spec-draw');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,c.getBoundingClientRect().top+scrollY-140);return 1;})()`);
      await sleep(2500);
      const r = await t.ev(`(function(){var s=CP.Stage.cur;return {name:s&&s.name,n:s&&s.n,turntable:s&&s.turntable,pts:(CP.Stage.parts||[]).map(function(p){return (p.pts||[]).map(function(q){return q.map(Math.round).join(',');}).join(' ');}).join(' | ')};})()`);
      const bal = await t.ev(BAL);
      pts[v || 'default'] = r.pts;
      check(`HBM ${v ? '?hbm=' + v : 'default'}: the stack draws (${r.n} points) and turns on its own axis, four balloons on it`, r.name === 'hbm-stack' && r.n > 10000 && r.turntable && bal && bal.length === 4 && bal.every((b) => b.inside), `${r.n} points; ${r.pts}`);
      if (t.errors.length) check(`HBM ${v || 'default'}: no errors`, false, t.errors.join(' | '));
      await t.close();
    }
    check(`HBM: the default is version ${def}`, pts.default === pts[def] && pts.a !== pts.b);
  } finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(`\n${bad ? bad + ' failed' : 'all passed'}`);
  process.exit(bad ? 1 : 0);
})();
