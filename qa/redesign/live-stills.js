#!/usr/bin/env node
/* The print stills of the live explainers (29 Oct 2026): media/<live>-print-end.jpg, which paper and the PDF show in place of
   the live drawing (build/build.js points img.anim-print at it; src/modules/live.css hides the live parts in print). For each
   live figure it opens the chapter on the local preview in the light theme with motion reduced, so the figure opens on its
   last step (04.2 after the cut; 07.1 at the chapter's inputs, 49.2, 11.3 and 20.1), takes the page's ground to white so the
   drawing sits on the paper and not in a grey panel (as build/animate.py does for the videos), and shoots the stage alone at
   twice the pixels. Rebuild afterwards (node build/build.js) so dist/media carries the new stills.
   usage: node qa/redesign/live-stills.js [base]   (base defaults to http://127.0.0.1:8789) */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8789').replace(/\/$/, '');
const ROOT = path.resolve(__dirname, '..', '..');
const LIVE = [['saqp', 'lithography', 'several-passes'], ['yield', 'metrology-and-inspection', 'defect-yield']];

(async () => {
  const chrome = launch();
  let bad = 0;
  try {
    for (const [live, ch, id] of LIVE) {
      const fid = `fig-${ch}-${id}`;
      const t = await open(chrome, `${BASE}/${ch}/`, { width: 1440, theme: 'light', scale: 2, wait: 2500 });
      const box = await t.ev(`(function () {
        var st = document.querySelector('#${fid} .anim-stage[data-live="${live}"]'); if (!st || !st.querySelector('.lv-screen')) return null;
        document.documentElement.style.setProperty('--bg', '#ffffff');
        st.style.border = '0'; st.style.background = '#ffffff';
        document.documentElement.style.scrollBehavior = 'auto'; st.scrollIntoView({ block: 'center' });
        return 1; })()`);
      if (!box) { console.log(`FAIL ${live}: no live stage in #${fid}`); bad++; await t.close(); continue; }
      await sleep(900);
      const r = await t.ev(`(function () { var b = document.querySelector('#${fid} .anim-stage').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`);
      const shot = await t.s('Page.captureScreenshot', { format: 'jpeg', quality: 90, captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      const file = path.join(ROOT, 'media', `${live}-print-end.jpg`);
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      console.log(`wrote media/${live}-print-end.jpg, ${Math.round(r.w * 2)} x ${Math.round(r.h * 2)} px, ${Math.round(fs.statSync(file).size / 1024)} KB${t.errors.length ? '  ERRORS ' + t.errors.join(' | ') : ''}`);
      if (t.errors.length) bad++;
      await t.close();
    }
  } finally { await chrome.close(); }
  process.exit(bad ? 1 : 0);
})();
