#!/usr/bin/env node
/* The hybrid's type check (28 Oct 2026, MAIN/qa/design9/BUILD-SYSTEM.md): Fraunces for display, Source Serif 4 for text,
   seven steps of the serif. For every page at each width and theme it reads each element that holds visible text and checks:
     - its first face is one of the site's four (Fraunces, Source Serif 4, Hanken Grotesk, Fragment Mono), and that face is
       loaded at its weight (document.fonts.check), so nothing falls back to Georgia or a system face;
     - text in Source Serif 4 carries no "opsz" 48 of its own or inherited from a Fraunces parent (it would set the text thin);
   and it lists the serif sizes in use, each with its count, against the steps (title, section, block, lead, text, small,
   note; the large numbers and the home's title keep their own sizes).
   usage: node qa/redesign/type-hybrid.js [--base http://127.0.0.1:8777] [--widths 1440,390] [--themes light,dark] [--out file] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const B = opt('base', 'http://127.0.0.1:8777');
const WIDTHS = opt('widths', '1440,390').split(',').map(Number);
const THEMES = opt('themes', 'light,dark').split(',');
const OUT = opt('out', path.join(__dirname, 'type-hybrid.txt'));
const PAGES = [['home', '/#/'], ['chain', '/#/chain'], ['lithography', '/#lithography'], ['ai-chips', '/#/landscape'], ['suppliers', '/#/suppliers'],
  ['export-controls', '/#/controls'], ['glossary', '/#/glossary'], ['static-lithography', '/lithography/'], ['static-suppliers', '/suppliers/'],
  ['static-glossary', '/glossary/'], ['static-export-controls', '/export-controls/'], ['summary', '/summary/']];
const FACES = ['Fraunces', 'Source Serif 4', 'Hanken Grotesk', 'Fragment Mono'];

const PROBE = `(() => {
  const out = { bad: [], opsz: [], sizes: {}, faces: {} };
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    const shut = el.closest('details:not([open])'); if (shut && !el.closest('summary')) continue; // a closed details draws none of its body
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const w = cs.fontWeight, size = parseFloat(cs.fontSize);
    const key = fam + ' ' + w;
    out.faces[key] = (out.faces[key] || 0) + 1;
    if (!seen.has(key)) { seen.add(key); if (FACES.indexOf(fam) < 0 || !document.fonts.check(w + ' 16px "' + fam + '"')) out.bad.push(key + ' <' + el.tagName.toLowerCase() + '.' + String(el.className || '').split(' ')[0] + '>'); }
    if (fam === 'Source Serif 4' && /opsz/.test(cs.fontVariationSettings)) out.opsz.push(el.tagName.toLowerCase() + '.' + String(el.className || '').split(' ')[0] + ' ' + cs.fontVariationSettings);
    if (fam === 'Fraunces' || fam === 'Source Serif 4') { const k = fam.charAt(0) + ' ' + (Math.round(size * 10) / 10); out.sizes[k] = (out.sizes[k] || 0) + 1; }
  }
  return out;
})()`.replace('FACES', JSON.stringify(FACES));

(async () => {
  const chrome = launch();
  const lines = [];
  let problems = 0;
  try {
    for (const [name, route] of PAGES) for (const w of WIDTHS) for (const th of THEMES) {
      const t = await open(chrome, B + route, { width: w, theme: th, wait: 2500 });
      await t.ev('document.fonts ? document.fonts.ready.then(() => 1) : 1');
      const r = await t.ev(PROBE);
      await t.close();
      const tag = `${name} ${w} ${th}`;
      const sizes = Object.entries(r.sizes).sort((a, b) => a[0].localeCompare(b[0]) || parseFloat(a[0].slice(2)) - parseFloat(b[0].slice(2))).map(([k, n]) => `${k}×${n}`).join('  ');
      lines.push(`${tag}: ${r.bad.length ? 'FALLBACK ' + r.bad.join(', ') : 'faces ok'}${r.opsz.length ? '; OPSZ ON TEXT ' + [...new Set(r.opsz)].slice(0, 6).join(', ') : ''}`);
      lines.push(`  serif sizes (F Fraunces, S Source Serif 4): ${sizes}`);
      problems += r.bad.length + r.opsz.length;
    }
  } finally { await chrome.close(); }
  lines.push(`\n${problems} problems`);
  fs.writeFileSync(OUT, lines.join('\n') + '\n');
  console.log(lines.join('\n'));
  process.exit(problems ? 1 : 0);
})();
