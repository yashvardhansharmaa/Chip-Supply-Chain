#!/usr/bin/env node
/* The page revisions of 28 Oct 2026 (MAIN/qa/design9/BUILD-PAGES.md, revisions 4 and 5): every changed figure's values read
   back from the page and compared with its data in content/*.md. For each figure it checks
   - each mark the page draws (bars, columns, change rows) against the data's rows, value by value, and its label;
   - which mark is wine (the chart rule as amended: the mark the figure names, else the largest, else the largest change) and
     that wine is on that one mark only, by the computed colour;
   - the Table (the screen-reader table the Table button shows) and the CSV against the data, row by row;
   - the PNG: the export runs, is 1,600 px wide, and is saved to the shots folder so the new forms can be seen on it.
   usage: node qa/redesign/check-figs.js [base] [outdir]   (base http://127.0.0.1:8778)
   Prints one line per check and a count of mismatches; exits 1 on any. */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const root = path.resolve(__dirname, '..', '..');
const base = (process.argv[2] || 'http://127.0.0.1:8778').replace(/\/$/, '');
const outdir = process.argv[3] || path.join(root, 'qa', 'redesign', 'shots', 'stage-pages');
const FIGS = [['lithography', 'tool-price'], ['lithography', 'euv-shipments'], ['memory-and-hbm', 'hbm-bandwidth'], ['data-centers-and-power', 'us-dc-electricity'],
  ['geopolitics', 'china-tool-revenue'], ['chemicals-gases-and-photoresist', 'germanium-price'], ['deposition-and-etch', 'equipment-billings'], ['memory-and-hbm', 'hbm-revenue'],
  ['advanced-packaging', 'cowos-reticles'], ['substrates-and-pcbs', 'abf-layers'], ['test-and-assembly', 'ase-testers'], ['systems-and-networking', 'nvlink-bandwidth'],
  ['systems-and-networking', 'switch-bandwidth'], ['data-centers-and-power', 'turbine-output']];

function figData(ch, id) {
  const file = fs.readdirSync(path.join(root, 'content')).find((f) => f.replace(/^\d+-/, '').replace(/\.md$/, '') === ch);
  const src = fs.readFileSync(path.join(root, 'content', file), 'utf8'), a = src.indexOf('---json\n') + 8, b = src.indexOf('\n---', a);
  return JSON.parse(src.slice(a, b)).figures.find((f) => f.id === id);
}
const near = (a, b) => Math.abs(+a - +b) < 1e-9;
const num = (s) => (s == null || s === '' ? null : +s);

(async () => {
  const chrome = launch();
  let bad = 0, n = 0;
  const check = (name, pass, info) => { n++; if (!pass) bad++; console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${!pass && info ? '  ' + info : ''}`); };
  try {
    for (const [ch, id] of FIGS) {
      const f = figData(ch, id), fid = `fig-${ch}-${id}`, rows = f.data;
      const t = await open(chrome, `${base}/#${ch}`, { width: 1440, wait: 2000 });
      await t.ev(`(function(){var e=document.getElementById('${fid}');document.documentElement.style.scrollBehavior='auto';e.scrollIntoView({block:'center'});return 1;})()`); await sleep(500);
      const got = await t.ev(`(function(){var f=document.getElementById('${fid}');var T=function(n){return n?n.textContent.replace(/\\s+/g,' ').trim():'';};
        var wine=function(el){var c=getComputedStyle(el);return c.backgroundColor==='rgb(122, 31, 43)'||/rgb\\(122, 31, 43\\)/.test(c.backgroundImage)||/rgb\\(122, 31, 43\\)/.test(c.boxShadow);};
        var marks=[].map.call(f.querySelectorAll('.hbars .hb'),function(r){return {kind:'bars',label:T(r.querySelector('.hb-l')),v:r.getAttribute('data-v'),hi:r.getAttribute('data-hi'),ref:r.getAttribute('data-ref'),text:T(r.querySelector('.hb-r > b')),top:r.classList.contains('top'),wine:wine(r.querySelector('.hb-r i'))};})
          .concat([].map.call(f.querySelectorAll('.cols-plot .col'),function(r,i){return {kind:'columns',label:T(f.querySelectorAll('.cols-lab span')[i]),v:r.getAttribute('data-v'),hi:r.getAttribute('data-hi'),ref:r.getAttribute('data-ref'),text:T(r.querySelector('b')),top:r.classList.contains('top'),wine:wine(r.querySelector('i'))};}))
          .concat([].map.call(f.querySelectorAll('.cg-row:not(.cg-axis)'),function(r){var a=r.querySelector('.cg-arrow');return {kind:'change',label:T(r.querySelector('.cg-l b')),when:T(r.querySelector('.cg-l small')),a:r.getAttribute('data-a'),b:r.getAttribute('data-b'),text:T(r.querySelector('.cg-v')),top:r.classList.contains('top'),wine:getComputedStyle(a).backgroundColor==='rgb(122, 31, 43)',from:parseFloat(r.querySelector('.cg-from').style.left),to:parseFloat(a.style.left)+(a.getAttribute('data-dir')==='down'?0:parseFloat(a.style.width)),lo:+r.getAttribute('data-lo'),hi:+r.getAttribute('data-hi')};}));
        var table=[].map.call(f.querySelectorAll('table.fig-table tr'),function(tr){return [T(tr.querySelector('th')),T(tr.querySelector('td'))];});
        var csv=decodeURIComponent((f.querySelector('.fs-csv')||{}).href||'').replace(/^data:text\\/csv;charset=utf-8,\\uFEFF?/,'');
        return {marks:marks,table:table,csv:csv,sub:T(f.querySelector('.fig-sub')),title:T(f.querySelector('.fig-title'))};})()`);
      const tag = `${id} (${f.type})`;
      const kind = f.type === 'stack' ? 'bars' : f.type;
      check(`${tag}: drawn as ${kind}`, got.marks.length && got.marks.every((m) => m.kind === kind), got.marks.map((m) => m.kind).join(','));
      // the marks the data asks for
      const want = [];
      if (f.type === 'change') {
        for (let i = 0; i < rows.length; i += 2) want.push({ label: String(rows[i][0]).split(', ')[0], a: rows[i][1], b: rows[i + 1][1], when: `${String(rows[i][0]).split(', ')[1]} to ${String(rows[i + 1][0]).split(', ')[1]}` });
      } else {
        const rg = f.range, joined = rg ? [rg.low, rg.high, rg.ref].filter(Boolean) : []; let placed = false;
        rows.forEach((d) => {
          if (joined.includes(d[0])) { if (!placed) { placed = true; const r = (l) => rows.find((x) => x[0] === l)[1]; want.push({ label: rg.label, v: r(rg.low), hi: r(rg.high), ref: rg.ref ? r(rg.ref) : null }); } return; }
          want.push({ label: d[0], v: d[1], hi: typeof d[2] === 'number' ? d[2] : null, ref: null });
        });
      }
      check(`${tag}: ${want.length} marks for ${rows.length} data rows`, got.marks.length === want.length, `${got.marks.length} drawn`);
      let mism = 0; const notes = [];
      want.forEach((w, i) => {
        const g = got.marks[i] || {};
        if (g.label !== w.label) { mism++; notes.push(`label ${i}: ${g.label} vs ${w.label}`); }
        if (f.type === 'change') {
          if (!near(g.a, w.a) || !near(g.b, w.b)) { mism++; notes.push(`${w.label}: ${g.a}->${g.b} vs ${w.a}->${w.b}`); }
          if (g.when !== w.when) { mism++; notes.push(`${w.label} years: ${g.when} vs ${w.when}`); }
          // the circle and the arrow's tip sit at the values on the axis
          const pos = (v) => (v - g.lo) / (g.hi - g.lo) * 100;
          if (Math.abs(g.from - pos(w.a)) > 0.05 || Math.abs(g.to - pos(w.b)) > 0.05) { mism++; notes.push(`${w.label} drawn at ${g.from}%->${g.to}%, want ${pos(w.a).toFixed(2)}%->${pos(w.b).toFixed(2)}%`); }
          // the written change carries both numbers
          if (!g.text.includes(String(w.a)) || !g.text.includes(String(w.b))) { mism++; notes.push(`${w.label} text "${g.text}"`); }
        } else {
          if (!near(g.v, w.v)) { mism++; notes.push(`${w.label}: ${g.v} vs ${w.v}`); }
          if ((w.hi == null) !== (num(g.hi) == null) || (w.hi != null && !near(g.hi, w.hi))) { mism++; notes.push(`${w.label} high: ${g.hi} vs ${w.hi}`); }
          if ((w.ref == null) !== (num(g.ref) == null) || (w.ref != null && !near(g.ref, w.ref))) { mism++; notes.push(`${w.label} ref: ${g.ref} vs ${w.ref}`); }
          // the value text names the value (and the range's high end), as the data gives it
          const digits = (x) => String(x).replace(/[^0-9.]/g, '');
          const fmt = (x) => (Math.abs(x) >= 1000 ? x.toLocaleString('en-US') : String(x)).replace(/[^0-9.]/g, '');
          const tx = g.text.replace(/,/g, '');
          if (!digits(tx).includes(fmt(w.v).replace(/,/g, '')) || (w.hi != null && !digits(tx).includes(fmt(w.hi)))) { mism++; notes.push(`${w.label} text "${g.text}"`); }
        }
      });
      check(`${tag}: every mark's values match the data`, mism === 0, notes.join('; '));
      // which mark is wine
      let expect;
      if (f.type === 'change') {
        const ch2 = want.map((w) => Math.abs(w.b - w.a)), top = Math.max(...ch2);
        expect = f.mark ? want.map((w) => w.label === f.mark) : ch2.map((c) => c === top);
      } else if (f.mark) expect = want.map((w) => w.label === f.mark);
      else { const tops = want.map((w) => (w.hi != null ? w.hi : w.v)), top = Math.max(...tops); expect = tops.map((v) => v === top); }
      check(`${tag}: wine on ${want.filter((w, i) => expect[i]).map((w) => w.label).join(', ')} only`, got.marks.every((m, i) => m.top === expect[i] && m.wine === expect[i]),
        got.marks.map((m) => `${m.label}:${m.top ? 'top' : '-'}/${m.wine ? 'wine' : '-'}`).join(' '));
      // the Table and the CSV hold the data's own rows
      const tOK = got.table.length === rows.length && rows.every((d, i) => got.table[i][0] === String(d[0]) && got.table[i][1].replace(/[^0-9.]/g, '').startsWith(String(d[1]).replace(/[^0-9.]/g, '')));
      check(`${tag}: Table rows match the data (${rows.length})`, tOK, JSON.stringify(got.table));
      // fix-d D11: the CSV's table comes first, then a blank row and what the file is (figure, title, source, date, note, address)
      const lines = got.csv.trim().split(/\r?\n\r?\n/)[0].split(/\r?\n/).slice(1);
      const cOK = lines.length === rows.length && rows.every((d, i) => { const cells = []; let s = lines[i], m; while (s.length) { if (s[0] === '"') { m = s.match(/^"((?:[^"]|"")*)"(,|$)/); cells.push(m[1].replace(/""/g, '"')); s = s.slice(m[0].length); } else { m = s.match(/^([^,]*)(,|$)/); cells.push(m[1]); s = s.slice(m[0].length); } if (!m[2]) break; } return cells[0] === String(d[0]) && near(cells[1], d[1]) && (typeof d[2] !== 'number' || near(cells[2], d[2])); });
      check(`${tag}: CSV rows match the data`, cOK, got.csv.slice(0, 300));
      // the PNG export draws the figure (its new form) at 1,600 px wide; saved for a look
      const png = await t.ev(`new Promise(function(res){var orig=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(cb,type){HTMLCanvasElement.prototype.toBlob=orig;res({w:this.width,h:this.height,type:type,url:this.toDataURL('image/png')});};var b=document.querySelector('#${fid} .fs-png');if(!b)return res(null);b.click();setTimeout(function(){res(null)},4000);})`);
      check(`${tag}: PNG exports at 1,600 px wide`, png && png.w === 1600 && png.type === 'image/png', png ? `${png.w}x${png.h}` : 'no PNG');
      if (png && png.url) { fs.mkdirSync(outdir, { recursive: true }); fs.writeFileSync(path.join(outdir, `png-${id}.png`), Buffer.from(png.url.split(',')[1], 'base64')); }
      check(`${tag}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(`\n${n - bad} of ${n} checks pass; ${bad} mismatch${bad === 1 ? '' : 'es'}`);
  process.exit(bad ? 1 : 0);
})();
