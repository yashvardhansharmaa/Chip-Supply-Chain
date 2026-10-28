#!/usr/bin/env node
/* One element's picture, clipped to its box (the page revisions of 28 Oct 2026: each changed figure before and after).
   usage: node qa/redesign/shots-el.js <outdir> "<name>|<url>|<width>|<theme>|<selector>[|<js>]" ...
   The element is scrolled to the middle of the window, the faces are awaited and 1.5 s passes, then only its box is taken,
   with 12 px of the page round it. A last field of script runs first, as in shots.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');

(async () => {
  const [outdir, ...specs] = process.argv.slice(2);
  if (!outdir || !specs.length) { console.error('usage: shots-el.js <outdir> "<name>|<url>|<width>|<theme>|<selector>[|<js>]" ...'); process.exit(1); }
  fs.mkdirSync(outdir, { recursive: true });
  const chrome = launch();
  let bad = 0;
  try {
    for (const spec of specs) {
      const [name, url, w, theme, sel, js] = spec.split('|');
      const t = await open(chrome, url, { width: +w || 1440, theme: theme || '', wait: 2500 });
      if (js) { await t.ev(`(async () => { ${js} })()`); await sleep(800); }
      const box = await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;document.documentElement.style.scrollBehavior='auto';e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};})()`);
      if (!box) { console.log('MISSING', name, sel); bad++; await t.close(); continue; }
      await t.ev('document.fonts ? document.fonts.ready.then(() => 1) : 1'); await sleep(1500);
      const again = await t.ev(`(function(){var r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};})()`);
      const pad = 12, W = await t.ev('document.documentElement.clientWidth');
      const x = Math.max(0, again.x - pad), y = Math.max(0, again.y - pad);
      const clip = { x, y, width: Math.min(W - x, again.w + 2 * pad), height: again.h + 2 * pad, scale: 1 };
      const r = await t.s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
      const file = path.join(outdir, name + '.png');
      fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
      console.log('wrote', file, t.errors.length ? 'ERRORS: ' + t.errors.join(' | ') : '');
      await t.close();
    }
  } finally { await chrome.close(); }
  process.exit(bad ? 1 : 0);
})();
