#!/usr/bin/env node
/* The look gate's shots for the Glossary (redesign option B), each at 1440 and 390 unless named, into qa/redesign/shots/glossary/
   (not committed). The faces are awaited, and again 1.5 s after any scroll or press (cdp.js scrollTo).
   usage: node qa/redesign/shots-glossary.js [base] (default http://127.0.0.1:8769) */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8769';
const OUT = path.join(__dirname, 'shots', 'glossary');
fs.mkdirSync(OUT, { recursive: true });
const settle = async (t) => { await t.ev('document.fonts ? document.fonts.ready.then(() => 1) : 1'); await sleep(1500); };
const type = async (t, text) => { await t.ev("(document.getElementById('gl-search').focus(), 1)"); await t.s('Input.insertText', { text }); await sleep(600); await settle(t); };
const SHOTS = [
  ['glossary', '/#/glossary'],
  ['glossary-search', '/#/glossary', (t) => type(t, 'hbm')],
  ['glossary-nomatch', '/#/glossary', (t) => type(t, 'zzqxv')],
  ['glossary-didyoumean', '/#/glossary', (t) => type(t, 'nvidai')],
  ['glossary-term', '/#gl-euv'],
  ['glossary-firm', '/#lk-firm-asml'],
  ['glossary-chip', '/#lk-chip-nvidia-b200'],
  ['glossary-country', '/#lk-country-nl'],
  ['glossary-country-firms', '/#lk-country-nl', async (t) => { await t.ev("(document.getElementById('gl-sheet-body').scrollTop = document.querySelector('#gl-sheet-body .lk-stages').offsetTop - 120, 1)"); await settle(t); }],
  ['glossary-letter-s', '/#/glossary', async (t) => { await t.ev("(document.querySelector('#gl-letters [data-l=\"S\"]').click(), 1)"); await sleep(1200); await settle(t); }],
  ['page-glossary', '/glossary/'],
  ['page-glossary-columns', '/glossary/', (t) => t.scrollTo(2600)],
];
(async () => {
  const chrome = launch();
  try {
    for (const [name, url, fn] of SHOTS) for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + url, { width, wait: 2500 });
      if (fn) await fn(t);
      await t.shot(path.join(OUT, `${name}-${width}.png`)); await t.close();
    }
    for (const [name, url, o] of [['glossary-1440-dark', '/#/glossary', { width: 1440, theme: 'dark' }], ['glossary-term-1440-dark', '/#gl-euv', { width: 1440, theme: 'dark' }],
      ['glossary-term-390-dark', '/#gl-euv', { width: 390, theme: 'dark' }], ['glossary-term-768', '/#gl-euv', { width: 768 }], ['glossary-term-1024', '/#gl-euv', { width: 1024 }],
      ['glossary-1024', '/#/glossary', { width: 1024 }], ['glossary-768', '/#/glossary', { width: 768 }], ['glossary-320', '/#/glossary', { width: 320 }], ['page-glossary-390-dark', '/glossary/', { width: 390, theme: 'dark' }]]) {
      const t = await open(chrome, BASE + url, Object.assign({ wait: 2500 }, o));
      await t.shot(path.join(OUT, `${name}.png`)); await t.close();
    }
  } finally { await chrome.close(); }
  console.log('wrote', fs.readdirSync(OUT).length, 'shots to', OUT);
})();
