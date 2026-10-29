#!/usr/bin/env node
/* AI Chips, the shelves (design round seven, built 28 Oct 2026): every figure the page prints, read back from the page and
   matched to the data files. The expected values are worked out here from data/landscape.json and data/landscape-layouts.json
   alone (each figure's source is the chip's own "cite" in the data, since 28 Oct 2026: "4, 12" is sources 4 and 12, and a
   figure the data sources nowhere carries the list mark "all"), never from the page's own code. Figures print the data's own
   digits, thousands grouped.
   It reads:
     - every chip's card: the six figures (each label and value, none for a missing figure), the sentence that names each
       missing figure as "not published" or "not supported" by compute.support, each figure's source mark, the line naming
       the figures' basis (the Nvidia racks) and no basis line on any other chip, the parts' numbers
       (die count and area, transistors, memory stacks, the package's size) and the plan's size;
     - four comparisons: every cell of every figure row (the value, or a dash marked "Not published" or "Not supported"), a row
       left out only when no chip has it, which values are set in wine (the largest, ties included, when two or more have a
       figure), and each column's package size;
     - the field chart at each of the six figures: the finding (the leader and its value), the dots set in wine, and a
       caption that names no chip it leaves off (28 Oct 2026).
   usage: node qa/redesign/datacheck-chips.js [--base http://127.0.0.1:8775] [--out qa/redesign/datacheck-chips.json] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8775'), OUT = opt('out', path.join(__dirname, 'datacheck-chips.json'));
const ROOT = path.join(__dirname, '../..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/landscape.json'), 'utf8'));
const LAYOUTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/landscape-layouts.json'), 'utf8'));
DATA.forEach((c) => { if (LAYOUTS[c.id]) c.layout = LAYOUTS[c.id]; });

// expected values, from the data alone
const grp = (v) => { const t = String(v), p = t.split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
const short = (c) => String(c.name).replace(/\s*\(.*\)\s*$/, '');
const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const cap1 = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const M = [
  { key: 'fp16', label: 'Speed at FP16', stat: 'TFLOPS at FP16', unit: 'TFLOPS', fmt: 'fp16', word: 'FP16', get: (c) => (c.compute || {}).fp16TFLOPS },
  { key: 'fp8', label: 'Speed at FP8', stat: 'TFLOPS at FP8', unit: 'TFLOPS', fmt: 'fp8', word: 'FP8', get: (c) => (c.compute || {}).fp8TFLOPS },
  { key: 'fp4', label: 'Speed at FP4', stat: 'TFLOPS at FP4', unit: 'TFLOPS', fmt: 'fp4', word: 'FP4', get: (c) => (c.compute || {}).fp4TFLOPS },
  { key: 'mem', label: 'Memory', stat: 'GB of memory', unit: 'gigabytes', word: 'memory', get: (c) => (c.memory || {}).capacityGB },
  { key: 'bw', label: 'Bandwidth', stat: 'TB/s of bandwidth', unit: 'terabytes a second', word: 'bandwidth', get: (c) => (c.memory || {}).bandwidthTBs },
  { key: 'tdp', label: 'Power', stat: 'Watts of power', unit: 'watts', word: 'power', get: (c) => c.tdpW },
];
const kind = (c, m) => (m.get(c) != null ? '' : m.fmt && ((c.compute || {}).support || {})[m.fmt] === 'no' ? 'not supported' : 'not published');
// a figure's expected mark, from the data: its sources' numbers in order ("4,12"), or "all" where the data names none
const srcMark = (c, key) => { const v = (c.cite || {})[key], n = (c.sources || []).length; const i = v == null ? [] : String(v).split(/\s*,\s*/).map(Number).filter((x) => x >= 1 && x <= n); return i.length ? i.sort((a, b) => a - b).join(',') : 'all'; };
const planSize = (c) => { const L = c.layout || {}, p = c.package || {}; if (L.waferScale) return (L.squareMm ? L.squareMm + ' × ' + L.squareMm + ' mm, ' : '') + 'cut from a ' + (L.diameterMm || 300) + ' mm wafer'; if (L.substrate) return L.substrate[0] + ' × ' + L.substrate[1] + ' mm' + (L.estimated ? ', estimated' : ''); if (p.sizeMm) return String(p.sizeMm) + ' mm'; return ''; };
const tOf = (c) => { const m = /^(\d{4})(?:-(\d{2}))?/.exec(String(c.announced || '')); return m ? 1 : null; };

// what the page shows, read in the page
const READ_CARD = `(function () {
  var card = document.getElementById('aic-card'); if (!card) return null;
  var tx = function (e) { return e ? e.textContent.replace(/\\s+/g, ' ').trim() : ''; };
  var bare = function (e) { if (!e) return ''; var x = e.cloneNode(true); [].slice.call(x.querySelectorAll('sup')).forEach(function (s) { s.remove(); }); return tx(x); };
  var stats = [].slice.call(card.querySelectorAll('.st')).map(function (s) { var dt = s.querySelector('dt'), m = dt.querySelector('sup.cm'); return { k: bare(dt), v: tx(s.querySelector('dd')), m: m ? tx(m) : '' }; });
  var parts = [].slice.call(card.querySelectorAll('.parts li')).map(function (li) { return { k: tx(li.querySelector('.k')), l1: tx(li.querySelector('.l1')), l2: tx(li.querySelector('.l2')) }; });
  var sl = card.querySelector('.card-stats .srcline');
  return { h: tx(card.querySelector('h2')), stats: stats, said: tx(card.querySelector('.card-stats .said')), basis: sl ? bare(sl) : '', parts: parts, cap: tx(card.querySelector('.ci-pic .cap-t')), nopic: tx(card.querySelector('.nopic')) };
})()`;
const READ_CMP = `(function () {
  var tx = function (e) { return e ? e.textContent.replace(/\\s+/g, ' ').trim() : ''; };
  var rows = {}; [].slice.call(document.querySelectorAll('#aic .cmp-row')).forEach(function (r) { var cp = r.querySelector(':scope > .cap'); if (!cp) return;
    rows[tx(cp)] = [].slice.call(r.querySelectorAll('.cmp-v')).map(function (p) { var q = p.cloneNode(true), mk = q.querySelector('sup.cm'), mt = mk ? tx(mk) : ''; if (mk) mk.remove(); var s = q.querySelector('.sn'), t = tx(q), n = s ? tx(s) : ''; if (n && t.indexOf(n) === 0) t = t.slice(n.length).trim(); var d = q.querySelector('span[aria-label]'); return { v: t, m: mt, top: p.classList.contains('top'), nil: d ? d.getAttribute('aria-label') : '' }; }); });
  var heads = [].slice.call(document.querySelectorAll('#aic .cmp-heads .cmp-head')).map(function (h) { return { name: tx(h.querySelector('h3')), sz: tx(h.querySelector('.sz')) }; });
  return { rows: rows, heads: heads, said: [].slice.call(document.querySelectorAll('#aic .cmp-sec .said')).map(tx).join(' ') };
})()`;
const READ_FIELD = `(function () {
  var tx = function (e) { return e ? e.textContent.replace(/\\s+/g, ' ').trim() : ''; };
  var s = document.querySelector('#aic-c-head svg.chart');
  return { finding: tx(document.querySelector('#aic .head .finding')), cap: tx(document.querySelector('#aic .head .fcap')), wine: s.querySelectorAll('circle.dot.top, path.off.top').length, dots: s.querySelectorAll('circle.dot, path.off').length };
})()`;

(async () => {
  const chrome = launch(); const report = { base: BASE, widths: {} }; let total = 0, totalBad = 0;
  try {
    for (const w of [1440, 390]) {
      const t = await open(chrome, BASE + '/#/landscape', { width: w, wait: 1800 });
      const bad = []; let n = 0;
      const eq = (what, want, got) => { n++; if (want !== got) bad.push(`${what}: want ${JSON.stringify(want)} got ${JSON.stringify(got)}`); };
      const pick = async (ids) => { await t.ev(`CP.Landscape.setPicked(${JSON.stringify(ids)}, { push: false })`); await sleep(120); };

      /* every chip's card */
      for (const c of DATA) {
        await pick([c.id]);
        const r = await t.ev(READ_CARD);
        if (!r) { bad.push(c.id + ': no card'); continue; }
        eq(c.id + ' name', short(c), r.h);
        const have = M.filter((m) => m.get(c) != null);
        eq(c.id + ' figures', have.map((m) => m.stat + ' ' + grp(m.get(c))).join(' | '), r.stats.map((s) => s.k + ' ' + s.v).join(' | '));
        // each figure's own source, as the data names it
        eq(c.id + ' figure sources', have.map((m) => m.key + ' ' + srcMark(c, m.key)).join(' | '), r.stats.map((s, i) => ((have[i] || {}).key || '?') + ' ' + s.m).join(' | '));
        // each missing figure named once, as the data says it is missing
        const sents = r.said.split(/(?<=\.)\s+/);
        M.filter((m) => m.get(c) == null).forEach((m) => {
          n++; const k = kind(c, m);
          if (!sents.some((s) => s.indexOf(m.word) >= 0 && s.indexOf(k) >= 0) && !(k === 'not published' && !have.length && /^No figure is published for /.test(r.said))) bad.push(`${c.id} ${m.key}: "${k}" not said in "${r.said}"`);
          eq(`${c.id} ${m.key} never said the other way`, false, sents.some((s) => s.indexOf(m.word) >= 0 && s.indexOf(k === 'not supported' ? 'not published' : 'not supported') >= 0));
        });
        // the basis line, for the chips whose data names one (the Nvidia racks), and none on any other
        if (have.length) eq(c.id + ' basis line', c.basis || '', r.basis);
        // the parts' numbers
        const d = c.die || {}, die = r.parts[0] || {}, mem = r.parts[1] || {}, pkg = r.parts[2] || {};
        if (d.areaMm2Each != null) eq(c.id + ' die area', true, die.l2.indexOf(grp(d.areaMm2Each) + ' mm²') >= 0);
        if (d.transistorsB) eq(c.id + ' transistors', true, die.l2.indexOf(grp(d.transistorsB) + ' billion transistors') >= 0);
        if (d.count) eq(c.id + ' dies', true, die.l2.indexOf(d.count > 1 ? cap1(WORD[d.count] || String(d.count)) + ' dies' : 'One die') === 0);
        const st = (c.memory || {}).stacks; if (st) eq(c.id + ' stacks', cap1(WORD[st] || String(st)) + ' stacks', mem.l2);
        const ps = planSize(c); if (ps) { eq(c.id + ' package size', cap1(ps), pkg.l2); if (r.cap) eq(c.id + ' plan size', true, r.cap.indexOf(cap1(ps) + '.') >= 0); }
        if (!c.layout) eq(c.id + ' no drawing said', true, /has not published the layout/.test(r.nopic));
      }

      /* four comparisons */
      const sets = [['nvidia-b300', 'amd-mi355x', 'nvidia-vr200', 'amd-mi455x'], ['nvidia-h100', 'nvidia-h20'], ['nvidia-a100', 'meta-mtia-v2', 'cerebras-wse3-turbo', 'huawei-ascend-910c'], ['google-tpu-8t', 'groq-lpu', 'nvidia-a800', 'meta-mtia-400']];
      for (const ids of sets) {
        await pick(ids);
        const r = await t.ev(READ_CMP), sel = ids.map((id) => DATA.find((c) => c.id === id)), tag = ids.join('+');
        eq(tag + ' columns', sel.map((c) => short(c) + ' ' + cap1(planSize(c))).join(' | '), r.heads.map((h) => h.name + ' ' + h.sz).join(' | '));
        M.forEach((m) => {
          const vals = sel.map((c) => m.get(c)), have = vals.filter((v) => v != null), row = r.rows[m.label + ', ' + m.unit];
          if (!have.length) { eq(tag + ' ' + m.key + ' row left out', undefined, row && 'shown'); return; }
          if (!row) { bad.push(tag + ' ' + m.key + ': row missing'); return; }
          const max = Math.max(...have);
          vals.forEach((v, i) => {
            const cell = row[i] || {};
            eq(`${tag} ${m.key} ${ids[i]}`, v == null ? '–' : grp(v), cell.v);
            if (v != null) eq(`${tag} ${m.key} ${ids[i]} source`, srcMark(sel[i], m.key), cell.m);
            if (v == null) eq(`${tag} ${m.key} ${ids[i]} dash`, kind(sel[i], m) === 'not supported' ? 'Not supported' : 'Not published', cell.nil);
            eq(`${tag} ${m.key} ${ids[i]} wine`, v != null && have.length > 1 && v === max, !!cell.top);
          });
        });
      }

      /* the field chart at each figure */
      await pick([]);
      for (const m of M) {
        await t.ev(`CP.Landscape.setMeasure(${JSON.stringify(m.key)})`); await sleep(150);
        const r = await t.ev(READ_FIELD);
        const pts = DATA.filter((c) => m.get(c) != null && tOf(c)), max = Math.max(...pts.map((c) => m.get(c))), tops = pts.filter((c) => m.get(c) === max);
        const lead = tops.map((c) => 'the ' + short(c));
        const want = cap1(lead.length < 2 ? lead[0] : lead.slice(0, -1).join(', ') + ' and ' + lead[lead.length - 1]) + (tops.length > 1 ? ' share' : ' has') + ' the highest published ' + (m.fmt ? m.label.charAt(0).toLowerCase() + m.label.slice(1) : m.label.toLowerCase()) + ', ' + grp(max) + ' ' + m.unit;
        eq('field ' + m.key + ' finding', true, r.finding.indexOf(want) === 0);
        eq('field ' + m.key + ' dots', pts.length, r.dots);
        eq('field ' + m.key + ' wine dots', tops.length, r.wine);
        // the chart names no chip it leaves off (owner, 28 Oct 2026), so its caption is empty unless a value sits above the scale
        eq('field ' + m.key + ' caption names no missing chip', true, !/not published|not supported/.test(r.cap));
      }
      await t.ev(`CP.Landscape.setMeasure('')`);
      report.widths[w] = { checked: n, mismatches: bad };
      total += n; totalBad += bad.length;
      console.log(`${w}: ${n} values checked, ${bad.length} mismatches` + (bad.length ? '\n  ' + bad.slice(0, 12).join('\n  ') : ''));
      await t.close();
    }
  } finally { await chrome.close(); }
  report.checked = total; report.mismatches = totalBad;
  fs.writeFileSync(OUT, JSON.stringify(report, null, 1) + '\n');
  console.log(`${total} values checked at 1440 and 390, ${totalBad} mismatches`);
  process.exit(totalBad ? 1 : 0);
})();
