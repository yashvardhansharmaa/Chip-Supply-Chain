#!/usr/bin/env node
/* AI Chips (the tick list): every value the page renders, for all 38 chips, against the data files. It works out each expected
   value here, from data/landscape.json, data/landscape-layouts.json and the source hints in src/app.js's Landscape.rows (the
   site's rule: the first source whose label carries one of the row's words, else "all"), and never from the page's own code.
   It reads, for every chip:
     - the figures table (each figure as the data's own digits, its source mark, its speed letter, "not published" or "not
       supported" by compute.support, rule B's bold, and the rows said once);
     - the makers and parts table (foundry and node, package and assembler, memory type and stacks, memory supplier with the
       mark of the source that names each supplier), the packages' sizes, and each attribute in words;
     - the chip's card at every measure, highest first at every measure, each dot's label, the list's names and years;
     - /chips/ (every cell of the table and its marks).
   usage: node qa/redesign/datacheck-chips.js [--base http://127.0.0.1:8772] [--out qa/redesign/datacheck-chips.json] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8772'), OUT = opt('out', path.join(__dirname, 'datacheck-chips.json'));
const ROOT = path.join(__dirname, '../..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/landscape.json'), 'utf8'));
const LAYOUTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/landscape-layouts.json'), 'utf8'));
DATA.forEach((c) => { if (LAYOUTS[c.id]) c.layout = LAYOUTS[c.id]; });
const APP = fs.readFileSync(path.join(ROOT, 'src/app.js'), 'utf8');
const HINT = {}; APP.replace(/\{ label: '([^']+)', hint: (\[[^\]]*\]), key: '([a-z0-9]+)'/g, (m, l, h, k) => { HINT[k] = eval(h); return m; });
const COUNTRY = eval('(' + /var COUNTRY = (\{[^;]*?\});/.exec(APP)[1] + ')'), cname = (c) => COUNTRY[c] || c;

// expected values, from the data alone
const fmt = (v) => { const t = String(v), p = t.split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
const short = (c) => String(c.name).replace(/\s*\(.*\)\s*$/, '');
const src = (c, key) => { const s = c.sources || []; if (!s.length) return ''; for (const h of HINT[key] || []) for (let i = 0; i < s.length; i++) if (String(s[i].label || '').toLowerCase().indexOf(h) >= 0) return String(i + 1); return 'all'; };
const NUM = { fp16: (c) => (c.compute || {}).fp16TFLOPS, fp8: (c) => (c.compute || {}).fp8TFLOPS, fp4: (c) => (c.compute || {}).fp4TFLOPS, mem: (c) => (c.memory || {}).capacityGB, bw: (c) => (c.memory || {}).bandwidthTBs, tdp: (c) => c.tdpW, transistors: (c) => (c.die || {}).transistorsB, dies: (c) => (c.die || {}).count, area: (c) => (c.die || {}).areaMm2Each };
const nilOf = (c, key) => (/^fp/.test(key) && ((c.compute || {}).support || {})[key] === 'no' ? 'not supported' : 'not published');
const UNIT = { fp16: 'TFLOPS', fp8: 'TFLOPS', fp4: 'TFLOPS', mem: 'gigabytes', bw: 'terabytes a second', tdp: 'watts' };
const SHORTNAME = { fp16: 'Speed at FP16', fp8: 'Speed at FP8', fp4: 'Speed at FP4', mem: 'Memory', bw: 'Bandwidth', tdp: 'Power' };
let NOTES = {};
// the sources that name a memory supplier (the rule written in the mockup's notes): a sentence of the chip's notes that names
// the supplier and its memory and cites a source, else a source whose label names the supplier (not the chip's own maker); one
// that also names the chip comes first. Returns the expected mark, or '' for none
const supMark = (c, sup) => {
  const srcs = c.sources || [], at = {}, low = sup.toLowerCase(), found = [];
  srcs.forEach((x, i) => { at[x.url] = i; });
  String(NOTES[c.id] || '').split(/\.\s+/).forEach((sent) => { const plain = sent.replace(/<[^>]+>/g, ''); if (plain.toLowerCase().indexOf(low) < 0 || !/HBM|memory|stack/i.test(plain)) return; sent.replace(/<a href="([^"]+)"/g, (m, u) => { u = u.replace(/&amp;/g, '&'); if (at[u] != null && found.indexOf(at[u]) < 0) found.push(at[u]); return m; }); });
  if (!found.length && sup !== c.vendor) srcs.forEach((x, i) => { if (String(x.label || '').toLowerCase().indexOf(low) >= 0) found.push(i); });
  const tag = short(c).toLowerCase(), named = found.filter((i) => String(srcs[i].label || '').toLowerCase().indexOf(tag) >= 0), order = named.concat(found.filter((i) => named.indexOf(i) < 0));
  return order.length ? String(order[0] + 1) : '';
};
const PARTS = {
  process: (c) => { const p = c.process || {}; if (!p.foundry && !p.node) return { nil: 'not published' }; return { text: (p.foundry || 'foundry not published') + (p.node || 'node not published') + (p.country ? ' · ' + cname(p.country) : ''), marks: [src(c, 'process')] }; },
  package: (c) => { const p = c.package || {}; if (!p.type && !p.assembler) return { nil: 'not published' }; return { text: (p.type || 'type not published') + (p.assembler ? 'assembled by ' + p.assembler : 'assembler not published'), marks: [src(c, 'package')] }; },
  memtype: (c) => { const m = c.memory || {}; return m.type ? { text: m.type + (m.stacks ? m.stacks + ' stacks' : ''), marks: [src(c, 'memtype')] } : { nil: 'not published' }; },
  memsup: (c) => { const s = (c.memory || {}).suppliers || []; return s.length ? { text: s.join(', '), marks: s.map((x) => supMark(c, x)).filter(Boolean) } : { nil: 'not published' }; },
};
const WORDS = {
  status: (c) => (c.status ? c.status + (c.shipping ? 'from ' + c.shipping : '') : null), target: (c) => c.target || null, c2c: (c) => (c.interconnect || {}).chipToChip || null,
  scale: (c) => (c.interconnect || {}).scaleUp || null, price: (c) => c.priceEstimate || null, bom: (c) => c.bomEstimate || null, export: (c) => c.exportStatus || null,
};
const WLABEL = { status: 'Availability', target: 'Built for', c2c: 'Chip-to-chip links', scale: 'Scale-up, in one rack', price: 'Price estimate', bom: 'Cost to make, estimate', export: 'Export-control status' };
const planSize = (c) => { const L = c.layout || {}, p = c.package || {}; if (L.waferScale) return (L.squareMm ? L.squareMm + ' × ' + L.squareMm + ' mm, ' : '') + 'cut from a ' + (L.diameterMm || 300) + ' mm wafer'; if (L.substrate) return L.substrate[0] + ' × ' + L.substrate[1] + ' mm' + (L.estimated ? ', estimated' : ''); if (p.sizeMm) return String(p.sizeMm); return 'size not published'; };

const problems = [], counts = {};
const bad = (where, msg, got, want) => problems.push({ where, msg, got, want });
const cnt = (k, n) => { counts[k] = (counts[k] || 0) + (n || 1); };
const same = (where, got, want) => { cnt(where.split(':')[0]); if (got !== want) bad(where, 'differs', got, want); };

// in the page: a cell's text without its marks and letters, the marks in order, the letter, the nil words, bold
const CELL = `function cell(td){var k=td.cloneNode(true);var marks=[].slice.call(k.querySelectorAll('sup.cite')).map(function(s){return s.textContent.trim();});var let=[].slice.call(k.querySelectorAll('.cx-fnl')).map(function(s){return s.textContent.trim();}).join('');
  k.querySelectorAll('sup').forEach(function(s){s.remove();});var nil=k.querySelector('.cx-nil');var only=nil&&k.textContent.trim()===nil.textContent.trim();var v=k.querySelector('.cx-v');
  return {text:k.textContent.replace(/\\s+/g,' ').trim(),marks:marks,letter:let,nil:only?nil.textContent.trim():'',top:!!(v&&v.classList.contains('is-top')),bar:!!td.querySelector('.cx-bar')};}`;

(async () => {
  const chrome = launch();
  try {
    const t = await open(chrome, BASE + '/#/landscape', { width: 1440, wait: 2200 });
    NOTES = await t.ev('CP_DATA.landscapeNotes');
    const byName = {}; DATA.forEach((c) => { byName[c.name] = c; });
    // ten sets of up to four, in the list's order, so every chip is in one comparison
    const order = await t.ev(`[].slice.call(document.querySelectorAll('#cx-list .aic-rl-o')).map(function(o){return o.getAttribute('data-id');})`);
    const sets = []; for (let i = 0; i < order.length; i += 4) sets.push(order.slice(i, i + 4));
    // the list: each chip's short name and year
    const list = await t.ev(`[].slice.call(document.querySelectorAll('#cx-list .aic-rl-o')).map(function(o){return [o.getAttribute('data-id'),o.querySelector('.aic-rl-n').textContent,o.querySelector('.aic-rl-y').textContent];})`);
    list.forEach(([id, n, y]) => { const c = DATA.find((x) => x.id === id); same('list:' + id + ' name', n, short(c)); same('list:' + id + ' year', y, String(c.announced || '').slice(0, 4)); });
    for (const set of sets) {
      await t.ev(`(history.replaceState(null,'',location.pathname+'#/landscape?pick=${set.join(',')}'), CP.Landscape.activate(), 1)`); await sleep(250);
      const sel = set.map((id) => DATA.find((c) => c.id === id)), n = sel.length;
      const page = await t.ev(`(function(){${CELL}
        var figs=[].slice.call(document.querySelectorAll('table.cx-fig')).map(function(tb){var heads=[].slice.call(tb.querySelectorAll('thead tr:first-child th:not(.c0):not(.grp)')).map(function(th){return th.textContent;}),speed=[].slice.call(tb.querySelectorAll('thead tr.u th')).slice(0,tb.querySelectorAll('thead th.grp').length?tb.querySelector('thead th.grp').colSpan:0).map(function(th){return th.textContent;});
          return {cols:speed.concat(heads),rows:[].slice.call(tb.querySelectorAll('tbody tr')).map(function(tr){return {name:tr.querySelector('.cx-wn').textContent,no:tr.querySelector('.cx-no').textContent,cells:[].slice.call(tr.querySelectorAll('td')).map(cell)};})};});
        var parts=[].slice.call(document.querySelectorAll('table.cx-parts tbody tr')).map(function(tr){var w=tr.querySelector('.cx-who').cloneNode(true);var vm=[].slice.call(w.querySelectorAll('sup.cite')).map(function(s){return s.textContent.trim();});return {name:tr.querySelector('.cx-wn').textContent,vendorMark:vm.join(','),cells:[].slice.call(tr.querySelectorAll('td')).map(cell)};});
        var words=[].slice.call(document.querySelectorAll('table.cx-words tbody')).map(function(tb){var at=tb.querySelector('th.at').textContent;var span=tb.querySelector('td.span');return {at:at,span:span?span.textContent.trim():'',rows:[].slice.call(tb.querySelectorAll('tr')).filter(function(tr){return tr.querySelector('td.wt');}).map(function(tr){return {name:tr.querySelector('td.wc .cx-wn').textContent,cell:cell(tr.querySelector('td.wt'))};})};});
        var plans=[].slice.call(document.querySelectorAll('.cx-plan')).map(function(p){return [p.querySelector('.cx-plan-hit').getAttribute('data-onstage'),p.querySelector('.cx-plan-size').textContent];});
        var said=(document.querySelector('.cx-said')||{}).textContent||'';
        var fns=[].slice.call(document.querySelectorAll('.cx-fns li')).map(function(li){return [li.id.replace('cx-sn-',''),li.querySelector('.cx-fn-l').textContent,li.lastElementChild.textContent];});
        return {figs:figs,parts:parts,words:words,plans:plans,said:said,fns:fns,title:document.getElementById('cx-title').textContent};})()`);
      const tag = set.join('+');
      // the speed notes: lettered a to d in the order of the chips that have one
      const withNote = sel.filter((c) => (c.compute || {}).precisionNote);
      same('speednotes:' + tag + ' count', page.fns.length, withNote.length);
      page.fns.forEach(([id, l, txt], j) => { same('speednotes:' + id + ' letter', l, 'abcd'.charAt(j)); same('speednotes:' + id + ' text', txt, (DATA.find((c) => c.id === id).compute || {}).precisionNote); });
      const letterOf = (c) => { const j = withNote.indexOf(c); return j >= 0 ? 'abcd'.charAt(j) : ''; };
      // the figures
      const shown = new Set(), COLKEY = { FP16: 'fp16', FP8: 'fp8', FP4: 'fp4', Memory: 'mem', Bandwidth: 'bw', Power: 'tdp', Transistors: 'transistors', 'Logic dies': 'dies', 'Area of each die': 'area' };
      page.figs.forEach((tb) => tb.cols.forEach((h, k) => {
        const key = COLKEY[h]; if (!key) { bad('figures:' + tag, 'unknown column', h, ''); return; }
        shown.add(key);
        const vals = sel.map((c) => NUM[key](c)).filter((v) => typeof v === 'number'), max = Math.max(...vals);
        tb.rows.forEach((r) => {
          const c = byName[r.name], got = r.cells[k], v = NUM[key](c), where = 'figures:' + c.id + ' ' + key;
          if (v == null) { same(where + ' nil', got.nil, nilOf(c, key)); if (got.marks.length) bad(where, 'a mark on a missing figure', got.marks, []); return; }
          same(where + ' value', got.text, fmt(v));
          same(where + ' mark', got.marks.join(','), src(c, key));
          same(where + ' letter', got.letter, /^fp/.test(key) ? letterOf(c) : '');
          same(where + ' bold (rule B)', got.top, vals.length > 1 && v === max && max > 0);
          same(where + ' bar', got.bar, vals.length > 1 && max > 0);
        });
      }));
      // a figure no chip in the set has is left out of the table and said once
      Object.keys(NUM).forEach((key) => {
        const kinds = new Set(sel.map((c) => (NUM[key](c) == null ? nilOf(c, key) : 'has')));
        const all = !kinds.has('has') && kinds.size === 1 && n > 1;
        cnt('figures said once');
        if (all && shown.has(key)) bad('figures:' + tag + ' ' + key, 'a column no chip has is still drawn', '', '');
        if (!all && !shown.has(key)) bad('figures:' + tag + ' ' + key, 'a column with a figure is missing', '', '');
        if (all) { const name = { fp16: 'speed at FP16', fp8: 'speed at FP8', fp4: 'speed at FP4', mem: 'memory', bw: 'bandwidth', tdp: 'power', transistors: 'transistors', dies: 'logic dies', area: 'area of each die' }[key]; if (page.said.toLowerCase().indexOf(name.toLowerCase()) < 0 || page.said.indexOf([...kinds][0] === 'not supported' ? 'not supported' : 'not published') < 0) bad('figures:' + tag + ' ' + key, 'not said once', page.said, name); }
      });
      // the numbers: in the order ticked, 1 to n
      page.figs[0].rows.forEach((r, i) => same('numbers:' + byName[r.name].id, r.no, String(i + 1)));
      // makers and parts
      page.parts.forEach((r) => {
        const c = byName[r.name];
        same('parts:' + c.id + ' vendor mark', r.vendorMark, src(c, 'vendor'));
        ['process', 'package', 'memtype', 'memsup'].forEach((key, k) => {
          const want = PARTS[key](c), got = r.cells[k], where = 'parts:' + c.id + ' ' + key;
          if (want.nil) { same(where + ' nil', got.nil, want.nil); return; }
          same(where + ' text', got.text, want.text); same(where + ' marks', got.marks.join(','), want.marks.join(','));
        });
      });
      // packages at one scale: each size line
      page.plans.forEach(([id, size]) => same('packages:' + id + ' size', size, planSize(DATA.find((c) => c.id === id))));
      // in words
      Object.keys(WORDS).forEach((key) => {
        const blk = page.words.find((w) => w.at === WLABEL[key]); cnt('words');
        if (!blk) { bad('words:' + tag + ' ' + key, 'attribute missing', '', WLABEL[key]); return; }
        const allNil = sel.every((c) => WORDS[key](c) == null);
        if (allNil && n > 1) { same('words:' + tag + ' ' + key + ' said once', blk.span, n === 2 ? 'Not published for either chip' : 'Not published for any of these ' + ['', '', 'two', 'three', 'four'][n] + ' chips'); return; }
        blk.rows.forEach((r) => {
          const c = DATA.find((x) => short(x) === r.name), want = WORDS[key](c), where = 'words:' + c.id + ' ' + key;
          if (want == null) { same(where + ' nil', r.cell.nil, 'not published'); return; }
          same(where + ' text', r.cell.text, want); same(where + ' mark', r.cell.marks.join(','), src(c, key));
        });
      });
    }
    // every chip's card, at every measure; highest first at every measure; each dot's label
    await t.ev(`(history.replaceState(null,'',location.pathname+'#/landscape'), CP.Landscape.initSelection(), CP.Landscape.activate(), 1)`);
    for (const m of ['fp16', 'fp8', 'fp4', 'mem', 'bw', 'tdp']) {
      await t.ev(`(CP.Landscape.measure='${m}', CP.Landscape.view='year', CP.Landscape.renderChart(), 1)`);
      const dots = await t.ev(`[].slice.call(document.querySelectorAll('#cx-chart .pt')).map(function(g){return [g.getAttribute('data-id'),g.getAttribute('aria-label')];})`);
      const have = DATA.filter((c) => typeof NUM[m](c) === 'number');
      same('chart:' + m + ' dots', dots.length, have.length);
      dots.forEach(([id, lab]) => { const c = DATA.find((x) => x.id === id); same('chart:' + id + ' ' + m + ' label', lab.indexOf(', ' + fmt(NUM[m](c)) + ' ' + UNIT[m]) > 0, true); });
      const max = Math.max(...have.map((c) => NUM[m](c))), top = have.filter((c) => NUM[m](c) === max);
      const sent = await t.ev(`document.getElementById('cx-atlas-s').textContent`);
      same('chart:' + m + ' finding', sent.indexOf('The ' + short(top[0]) + ' is the highest, at ' + fmt(max) + ' ' + UNIT[m] + '.') === 0, true);
      const pills = await t.ev(`[].slice.call(document.querySelectorAll('#cx-gutter .aic-gut')).map(function(p){return [p.querySelector('.aic-gut-k').textContent,[].slice.call(p.querySelectorAll('[data-card]')).map(function(b){return b.getAttribute('data-card');})];})`);
      const none = DATA.filter((c) => NUM[m](c) == null), at = /^fp/.test(m) ? ' at ' + m.toUpperCase() : ' for this measure';
      const wantNo = none.filter((c) => nilOf(c, m) === 'not supported').map((c) => c.id), wantNp = none.filter((c) => nilOf(c, m) !== 'not supported').map((c) => c.id);
      same('chart:' + m + ' not published', JSON.stringify((pills.find((p) => p[0] === 'Not published' + at) || [0, []])[1]), JSON.stringify(wantNp));
      same('chart:' + m + ' not supported', JSON.stringify((pills.find((p) => p[0] === 'Not supported' + at) || [0, []])[1]), JSON.stringify(wantNo));
      for (const c of DATA) {
        await t.ev(`(CP.Landscape.openCard('${c.id}'), 1)`);
        const card = await t.ev(`(function(){var o={};[].slice.call(document.querySelectorAll('#cx-card dt')).forEach(function(dt){var dd=dt.nextElementSibling,k=dd.cloneNode(true);var marks=[].slice.call(k.querySelectorAll('sup.cite')).map(function(s){return s.textContent.trim();});k.querySelectorAll('sup').forEach(function(s){s.remove();});o[dt.textContent]={text:k.textContent.trim(),marks:marks.join(',')};});o.name=document.getElementById('cx-card-n').textContent;o.meta=document.querySelector('#cx-card .aic-card-m').textContent;return o;})()`);
        const w = 'card:' + c.id + ' ' + m, v = NUM[m](c);
        same(w + ' name', card.name, c.name);
        same(w + ' meta', card.meta, [c.vendor, cname(c.vendorCountry), String(c.announced || '').slice(0, 4)].filter(Boolean).join(' · '));
        const f = card[SHORTNAME[m]];
        if (v == null) same(w + ' figure nil', f.text, nilOf(c, m)); else { same(w + ' figure', f.text, fmt(v) + ' ' + UNIT[m]); same(w + ' figure mark', f.marks, src(c, m)); }
        if (m !== 'fp16') continue; // the parts lines do not change with the measure
        const p = c.process || {}, pk = c.package || {}, s = (c.memory || {}).suppliers || [];
        if (p.foundry || p.node) { same(w + ' foundry', card['Foundry, node'].text, (p.foundry || 'foundry not published') + ', ' + (p.node || 'node not published')); same(w + ' foundry mark', card['Foundry, node'].marks, src(c, 'process')); } else same(w + ' foundry nil', card['Foundry, node'].text, 'not published');
        if (s.length) { same(w + ' supplier', card['Memory supplier'].text, s.join(', ')); same(w + ' supplier marks', card['Memory supplier'].marks, s.map((x) => supMark(c, x)).filter(Boolean).join(',')); } else same(w + ' supplier nil', card['Memory supplier'].text, 'not published');
        if (pk.type) { same(w + ' package', card.Package.text, pk.type); same(w + ' package mark', card.Package.marks, src(c, 'package')); } else same(w + ' package nil', card.Package.text, 'not published');
        if (pk.assembler) { same(w + ' assembler', card['Assembled by'].text, pk.assembler); same(w + ' assembler mark', card['Assembled by'].marks, src(c, 'package')); } else same(w + ' assembler nil', card['Assembled by'].text, 'not published');
      }
      await t.ev(`(CP.Landscape.closeCard(false,true), CP.Landscape.view='rank', CP.Landscape.renderChart(), 1)`);
      const rank = await t.ev(`[].slice.call(document.querySelectorAll('.aic-rk')).map(function(r){return [r.querySelector('[data-card]').getAttribute('data-card'),r.querySelector('.cx-v').textContent,[].slice.call(r.querySelectorAll('sup.cite')).map(function(s){return s.textContent.trim();}).join(','),r.querySelector('.cx-v').classList.contains('is-top'),r.querySelector('.aic-rk-m').textContent];})`);
      same('rank:' + m + ' rows', rank.length, have.length);
      let prev = Infinity;
      rank.forEach(([id, v, mk, topped, meta]) => { const c = DATA.find((x) => x.id === id), want = NUM[m](c); same('rank:' + id + ' ' + m + ' value', v, fmt(want)); same('rank:' + id + ' ' + m + ' mark', mk, src(c, m)); same('rank:' + id + ' ' + m + ' bold', topped, want === max); same('rank:' + id + ' ' + m + ' meta', meta, [c.vendor, String(c.announced || '').slice(0, 4)].filter(Boolean).join(' · ')); if (want > prev) bad('rank:' + m, 'out of order', id, ''); prev = want; });
      await t.ev(`(CP.Landscape.view='year', 1)`);
    }
    if (t.errors.length) bad('console', 'errors', t.errors, []);
    await t.close();

    // /chips/
    const p = await open(chrome, BASE + '/chips/', { width: 1440, wait: 1200 });
    const rows = await p.ev(`(function(){var heads=[].slice.call(document.querySelectorAll('.chips-t thead th')).map(function(th){return th.textContent;});return {heads:heads,rows:[].slice.call(document.querySelectorAll('.chips-t tbody tr')).map(function(tr){return {id:tr.id,cells:[].slice.call(tr.querySelectorAll('td')).map(function(td){var k=td.cloneNode(true);var marks=[].slice.call(k.querySelectorAll('sup.cite')).map(function(s){return s.textContent.replace(/[\\[\\]]/g,'').trim();});k.querySelectorAll('sup').forEach(function(s){s.remove();});return {text:k.textContent.replace(/\\s+/g,' ').trim(),marks:marks.join(',')};})};})};})()`);
    const H = rows.heads.slice(1), COL = { 'Memory, gigabytes': 'mem', 'Bandwidth, terabytes/s': 'bw', 'Speed at FP16, TFLOPS': 'fp16', 'Speed at FP8, TFLOPS': 'fp8', 'Speed at FP4, TFLOPS': 'fp4', 'Power, watts': 'tdp' };
    same('/chips/: rows', rows.rows.length, 38);
    rows.rows.forEach((r) => {
      const c = DATA.find((x) => x.id === r.id); if (!c) { bad('/chips/:' + r.id, 'no chip', r.id, ''); return; }
      H.forEach((h, k) => {
        const got = r.cells[k], w = '/chips/:' + c.id + ' ' + h;
        if (COL[h]) { const v = NUM[COL[h]](c); if (v == null) same(w + ' nil', got.text, nilOf(c, COL[h])); else { same(w + ' value', got.text, fmt(v)); same(w + ' mark', got.marks, src(c, COL[h])); } return; }
        if (h === 'Memory supplier') { const s = (c.memory || {}).suppliers || []; if (!s.length) same(w + ' nil', got.text, 'not published'); else { same(w + ' text', got.text, s.join(', ')); same(w + ' marks', got.marks, s.map((x) => supMark(c, x)).filter(Boolean).join(',')); } return; }
        if (h === 'Foundry, process node' || h === 'Package') { const want = PARTS[h === 'Package' ? 'package' : 'process'](c); if (want.nil) same(w + ' nil', got.text, 'not published'); else { same(w + ' text', got.text.replace(/ · /g, ' · '), want.text.replace(/assembled by/, 'assembled by')); same(w + ' mark', got.marks, want.marks.join(',')); } return; }
        if (h === 'Memory type') { const want = PARTS.memtype(c); if (want.nil) same(w + ' nil', got.text, 'not published'); else { same(w + ' text', got.text, want.text); same(w + ' mark', got.marks, want.marks.join(',')); } return; }
        if (h === 'Vendor') { same(w + ' text', got.text, c.vendor + cname(c.vendorCountry)); same(w + ' mark', got.marks, src(c, 'vendor')); return; }
        if (h === 'Announced') { same(w + ' text', got.text, String(c.announced || '').slice(0, 4)); same(w + ' mark', got.marks, src(c, 'status')); return; }
        bad(w, 'unknown column', h, '');
      });
    });
    await p.close();
  } finally { await chrome.close(); }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  fs.writeFileSync(OUT, JSON.stringify({ base: BASE, checked: total, counts, problems }, null, 1) + '\n');
  console.log(`checked ${total} values: ` + Object.keys(counts).map((k) => k + ' ' + counts[k]).join(', '));
  console.log(problems.length ? problems.length + ' problems:\n' + problems.slice(0, 40).map((x) => '  ' + x.where + ': ' + x.msg + ' ' + JSON.stringify(x.got) + ' vs ' + JSON.stringify(x.want)).join('\n') : '0 problems');
  process.exit(problems.length ? 1 : 0);
})();
