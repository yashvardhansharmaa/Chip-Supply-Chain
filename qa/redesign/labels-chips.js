#!/usr/bin/env node
/* AI Chips, the shelves (28 Oct 2026): every label on the field charts against every other text on the chart. The charts label
   the largest value and the reader's chips, so 1 to 5 labels; where dots crowd a label may lie over a dot, on its halo, but it
   must never run into another label, an axis figure, a year or the unit, nor leave the chart. For five choices (none; B300 and
   Instinct MI355X; those two with Rubin and Instinct MI455X; B200 and Ascend 910C; H100, H20, Instinct MI300X and H200), at all
   six figures, at 1440, 1024, 390 and 320 px, it reads both charts (the head's and the card's) and lists every collision. It
   also counts the labels that lie over a dot, for the record.
   usage: node qa/redesign/labels-chips.js [--base http://127.0.0.1:8775] [--out qa/redesign/labels-chips.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8775'), OUT = opt('out', path.join(__dirname, 'labels-chips.txt'));
const SETS = { none: [], two: ['nvidia-b300', 'amd-mi355x'], four: ['nvidia-b300', 'amd-mi355x', 'nvidia-vr200', 'amd-mi455x'], pair: ['nvidia-b200', 'huawei-ascend-910c'], mix: ['nvidia-h100', 'nvidia-h20', 'amd-mi300x', 'nvidia-h200-china'] };
const MEASURES = ['fp16', 'fp8', 'fp4', 'mem', 'bw', 'tdp'], WIDTHS = [1440, 1024, 390, 320];
const READ = `(function () {
  var out = { bad: [], onDot: 0, labels: 0 };
  [].slice.call(document.querySelectorAll('#aic svg.chart')).forEach(function (svg, si) {
    var W = +svg.getAttribute('width'), H = +svg.getAttribute('height');
    var box = function (e) { var b = e.getBBox(); return [b.x, b.y + 2, b.x + b.width, b.y + b.height - 2]; };
    var labs = [].slice.call(svg.querySelectorAll(':scope > text.lab')).map(function (e) { return { t: e.textContent, b: box(e) }; });
    var axis = [].slice.call(svg.querySelectorAll(':scope > text.tick, :scope > text.unit')).filter(function (e) { return e.textContent; }).map(function (e) { return { t: e.textContent, b: box(e) }; });
    var dots = [].slice.call(svg.querySelectorAll(':scope > circle.dot')).map(function (c) { var r = +c.getAttribute('r'), x = +c.getAttribute('cx'), y = +c.getAttribute('cy'); return [x - r, y - r, x + r, y + r]; });
    var d = function (a, b) { return Math.min(Math.min(a[2], b[2]) - Math.max(a[0], b[0]), Math.min(a[3], b[3]) - Math.max(a[1], b[1])); };
    var name = si ? 'card chart' : 'head chart';
    labs.forEach(function (A, i) {
      out.labels++;
      if (A.b[0] < 0 || A.b[2] > W || A.b[1] < 0 || A.b[3] > H) out.bad.push(name + ': "' + A.t + '" leaves the chart');
      axis.forEach(function (X) { var v = d(A.b, X.b); if (v > 0) out.bad.push(name + ': "' + A.t + '" into the axis text "' + X.t + '" by ' + Math.round(v * 10) / 10 + ' px'); });
      labs.forEach(function (B, j) { var v = d(A.b, B.b); if (j > i && v > 0) out.bad.push(name + ': "' + A.t + '" into the label "' + B.t + '" by ' + Math.round(v * 10) / 10 + ' px'); });
      if (dots.some(function (D) { return d(A.b, D) > 1; })) out.onDot++;
    });
  });
  return out;
})()`;

(async () => {
  const chrome = launch(), lines = [];
  let charts = 0, labels = 0, bad = 0, onDot = 0;
  try {
    for (const width of WIDTHS) {
      const t = await open(chrome, BASE + '/#/landscape', { width, wait: 1600 });
      for (const [set, ids] of Object.entries(SETS)) {
        await t.ev(`CP.Landscape.setPicked(${JSON.stringify(ids)}, { push: false })`); await sleep(100);
        for (const m of MEASURES) {
          await t.ev(`CP.Landscape.setMeasure(${JSON.stringify(m)})`); await sleep(80);
          const r = await t.ev(READ);
          charts += ids.length ? 2 : 1; labels += r.labels; onDot += r.onDot; bad += r.bad.length;
          r.bad.forEach((b) => lines.push(`${width} ${set} ${m}: ${b}`));
        }
      }
      if (t.errors.length) lines.push(`${width}: console ${t.errors.join(' | ')}`), bad++;
      await t.close();
    }
  } finally { await chrome.close(); }
  const head = `labels-chips: ${charts} charts, ${labels} labels, ${bad} collisions with another label, an axis text or the chart's edge; ${onDot} labels lie over a dot, on their halo`;
  fs.writeFileSync(OUT, head + '\n' + (lines.length ? '\n' + lines.join('\n') + '\n' : ''));
  console.log((lines.length ? lines.join('\n') + '\n\n' : '') + head);
  process.exit(bad ? 1 : 0);
})();
