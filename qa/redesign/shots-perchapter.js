#!/usr/bin/env node
/* Before and after for each chapter at its own address (28 Oct 2026): every page the reader sees, shot on the current site
   (before, where a chapter is /#<id>) and on this branch's preview (after, where it is /<id>/), at 390, 1024 and 1440, light
   and dark, the first screen and two screens down, then compared pixel by pixel (pair-perchapter.py). The same view at both
   addresses must look the same.
   usage: node qa/redesign/shots-perchapter.js <before base> <after base> <out dir>
   e.g.   node qa/redesign/shots-perchapter.js http://127.0.0.1:8766 http://127.0.0.1:8779 qa/redesign/shots/perchapter */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const [BEFORE, AFTER, OUT] = process.argv.slice(2);
if (!BEFORE || !AFTER || !OUT) { console.error('usage: node qa/redesign/shots-perchapter.js <before base> <after base> <out dir>'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
// [name, the address before, the address after]
const PAGES = [['home', '/#/', '/#/'], ['contents', '/#/chain', '/#/chain'], ['chips', '/#/landscape', '/#/landscape'], ['suppliers', '/#/suppliers', '/#/suppliers'],
  ['controls', '/#/controls', '/#/controls'], ['glossary', '/#/glossary', '/#/glossary'],
  ['lithography', '/#lithography', '/lithography/'], ['memory-and-hbm', '/#memory-and-hbm', '/memory-and-hbm/'], ['foundries-and-fabs', '/#foundries-and-fabs', '/foundries-and-fabs/'],
  ['geopolitics', '/#geopolitics', '/geopolitics/'], ['lithography-section', '/#lithography--who-makes-it', '/lithography/#lithography--who-makes-it']];
const withTheme = (u, dark) => { if (!dark) return u; const i = u.indexOf('#'); const b = i < 0 ? u : u.slice(0, i), h = i < 0 ? '' : u.slice(i); return b + (b.includes('?') ? '&' : '?') + 'theme=dark' + h; };
(async () => {
  const chrome = launch();
  const list = [];
  try {
    for (const [name, before, after] of PAGES) {
      for (const width of [390, 1024, 1440]) {
        for (const dark of [false, true]) {
          for (const [side, base, url] of [['before', BEFORE, before], ['after', AFTER, after]]) {
            const t = await open(chrome, base + withTheme(url, dark), { width, wait: 2600 });
            // the masthead's search button and the rail's toggles come at boot on both; the drawing has settled in 2.6 s
            const tag = `${name}-${width}-${dark ? 'dark' : 'light'}`;
            await t.shot(path.join(OUT, `${tag}-0-${side}.png`));
            const y0 = await t.ev('Math.round(scrollY)');
            await t.scrollTo(y0 + (width < 768 ? 1600 : 1800));
            await t.shot(path.join(OUT, `${tag}-1-${side}.png`));
            if (t.errors.length) console.log(`${tag} ${side}: ${t.errors.join(' | ')}`);
            await t.close();
          }
          list.push(`${name}-${width}-${dark ? 'dark' : 'light'}`);
        }
      }
      console.log(`${name}: shot`);
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(path.join(OUT, 'list.txt'), list.join('\n') + '\n');
})();
