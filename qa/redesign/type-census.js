#!/usr/bin/env node
/* The type switch's size check (redesign-type, 27 Oct 2026): Source Serif 4 replaces Fraunces and Literata.
   For every view and static page at 1440 and 390, it records each element that holds visible text: its face, size, weight
   and line height, on the redesign as it stood (A, 127.0.0.1:8766) and on this branch (B, 127.0.0.1:8773). Then it checks:
     - every element A set in Literata is in Source Serif 4 on B, at A's size times the text scale (20 / 18.5 = 1.081);
     - every element A set in Fraunces is in Source Serif 4 on B, at A's size (the titles keep their sizes);
     - every element in Hanken Grotesk or Fragment Mono keeps its face and size.
   The DOM is the same on both sides (the words are identical), so elements are paired in document order. A must be the
   redesign at this branch's base: once the redesign moves on (8766 took new chapter 8 and 9 text after 6c3ffd2), serve
   `git archive 6c3ffd2 dist` from a scratch folder and pass it as --a, or the pairing slips.
   Expected after the switch (27 Oct 2026, 23 kinds): AI Chips' text sizes (src/modules/chips.css, scaled after the merge);
   the citation marks, which are 0.62 em of the text they sit in and so grow with it; and elements hidden at that width
   (the walk's phone-only previous and next, the phone sheet's head, the print-only tile), which inherit the body's size.
   usage: node qa/redesign/type-census.js [--a url] [--b url] [--widths 1440,390] [--only walk,lithography] [--out file] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const A = opt('a', 'http://127.0.0.1:8766'), B = opt('b', 'http://127.0.0.1:8773');
const WIDTHS = opt('widths', '1440,390').split(',').map(Number);
const ONLY = (opt('only', '') || '').split(',').filter(Boolean);
const OUT = opt('out', path.join(__dirname, 'type-census.txt'));
const K = 20 / 18.5;
const DIST = path.resolve(__dirname, '..', '..', 'dist');
const FORWARD = ['home', 'intro', 'chain'];
const VIEWS = [['walk', '/#/'], ['chain', '/#/chain'], ['lithography', '/#lithography'], ['ai-chips', '/#/landscape'], ['suppliers', '/#/suppliers'], ['suppliers-by-country', '/#/suppliers?tab=country'],
  ['export-controls', '/#/controls'], ['china-revenue', '/#/exposure'], ['glossary', '/#/glossary']];
const statics = fs.readdirSync(DIST).filter((d) => fs.existsSync(path.join(DIST, d, 'index.html')) && !FORWARD.includes(d)).sort();
const PAGES = VIEWS.concat(statics.map((d) => ['/' + d + '/', '/' + d + '/'])).filter(([n]) => !ONLY.length || ONLY.includes(n));

const READ = `(async () => {
  const st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st);
  await new Promise((r) => setTimeout(r, 300));
  const name = (el) => (el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''));
  const sig = (el) => { const p = el.parentElement; return (p ? name(p) + ' > ' : '') + name(el); };
  const out = [], seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (/^(SCRIPT|STYLE|NOSCRIPT|TITLE|OPTION)$/.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    out.push([sig(el), cs.fontFamily.split(',')[0].replace(/"/g, '').trim(), +parseFloat(cs.fontSize).toFixed(2), cs.fontWeight, cs.lineHeight, cs.fontVariationSettings, n.nodeValue.trim().slice(0, 40)]);
  }
  return out;
})()`;

(async () => {
  const chrome = launch();
  const lines = [], bad = new Map(); let total = 0, nbad = 0;
  try {
    for (const w of WIDTHS) for (const [name, url] of PAGES) {
      const read = async (base) => { const t = await open(chrome, base + url, { width: w, wait: 1200 }); try { return await t.ev(READ); } finally { await t.close(); } };
      const a = await read(A), b = await read(B);
      if (a.length !== b.length) { lines.push(`${w} ${name}: element count differs, A ${a.length}, B ${b.length}`); nbad++; }
      const n = Math.min(a.length, b.length);
      for (let i = 0; i < n; i++) {
        const [sa, fa, za, wa] = a[i], [sb, fb, zb, wb, lhb, vb] = b[i]; total++;
        let want, wantFace;
        if (/^(Literata)$/.test(fa)) { want = za * K; wantFace = 'Source Serif 4'; }
        else if (/^(Fraunces)$/.test(fa)) { want = za; wantFace = 'Source Serif 4'; }
        else { want = za; wantFace = fa; }
        const why = [];
        if (sa !== sb) why.push('element differs: ' + sb);
        if (fb !== wantFace) why.push(`face ${fb}, want ${wantFace}`);
        if (Math.abs(zb - want) > 0.3) why.push(`size ${zb}, want ${want.toFixed(2)} (A ${za} ${fa})`);
        if (/opsz|SOFT|WONK/.test(vb || '')) why.push('variation settings ' + vb);
        if (why.length) {
          nbad++;
          const key = `${w} ${sa} | ${why.join('; ')}`;
          if (!bad.has(key)) bad.set(key, { n: 0, pages: new Set(), text: a[i][6] });
          const e = bad.get(key); e.n++; e.pages.add(name);
        }
      }
      process.stdout.write(`${w} ${name} ${a.length}\n`);
    }
  } finally { await chrome.close(); }
  for (const [k, e] of bad) lines.push(`${k}  x${e.n} [${[...e.pages].slice(0, 4).join(', ')}${e.pages.size > 4 ? ', ...' : ''}] "${e.text}"`);
  const head = `type census: A ${A}, B ${B}, widths ${WIDTHS.join(',')}, ${PAGES.length} pages, ${total} text elements, ${nbad} off (${bad.size} kinds)`;
  fs.writeFileSync(OUT, head + '\n' + lines.join('\n') + '\n');
  console.log(head);
})();
