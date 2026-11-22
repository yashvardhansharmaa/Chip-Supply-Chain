#!/usr/bin/env node
/* The share cards' drawings from the plates (21 Nov 2026): build/assets/cards-art/<chapter-id>.png, one per chapter, which
   build/cards.py draws every card from (the chapter's own drawing large, the stages small on the shelf). Each is the chapter's
   plate as the page draws it at rest, with no labels or dimensions, in the light theme, turned into the coverage cards.py
   reads: an 8-bit gray image, 255 full ink, cropped to the drawing. Coverage is how far a pixel is from the white ground
   towards the site's ink (#171716), so a line is full ink and a face's tone a light gray; the colours become grays, since the
   cards are drawn in ink alone. Until 21 Nov 2026 qa/redesign/card-art.py made these files from the point-cloud renders.
   Then: python3 build/cards.py (the chapter and view cards) and node build/plate-home-card.js with python3 build/home_card.py.
   usage: node build/plate-card-art.js [base]   (default http://127.0.0.1:8802, a static server on dist/)
   Nothing leaves this machine but the font requests (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('../qa/redesign/cdp.js');

const root = path.resolve(__dirname, '..');
const BASE = (process.argv[2] || 'http://127.0.0.1:8802').replace(/\/$/, '');
const OUT = path.join(root, 'build', 'assets', 'cards-art');
const read = (f) => fs.readFileSync(f, 'utf8');
const chapters = fs.readdirSync(path.join(root, 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => {
  const m = JSON.parse(/^---json\s*\n([\s\S]*?)\n---/.exec(read(path.join(root, 'content', f)))[1]);
  return { id: m.id, spec: m.specimen };
}).filter((c) => c.spec && fs.existsSync(path.join(root, 'plates', c.spec + '.js')));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const chrome = launch();
  try {
    const t = await open(chrome, BASE + '/lithography/', { width: 1200, theme: 'light', wait: 1200 });
    const res = await t.ev(`(function (list) {
      var got = {}, S = 480, D = 2;
      list.forEach(function (c) {
        var cv = document.createElement('canvas'); cv.width = S * D; cv.height = S * D;
        var ctx = cv.getContext('2d'), pl = new PLATE.Plate(c.spec, {});
        pl.render(ctx, S, S, D, { k: 1, mode: { noLabels: true, noDims: true, pad: 0.02 }, dark: false, el: document.documentElement });
        var im = ctx.getImageData(0, 0, cv.width, cv.height), d = im.data, x0 = cv.width, y0 = cv.height, x1 = 0, y1 = 0;
        for (var i = 0; i < d.length; i += 4) {
          var a = d[i + 3] / 255, lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // over white, then how far towards the ink
          var over = 255 - a * (255 - lum), cov = Math.max(0, Math.min(1, (255 - over) / (255 - 23))), v = Math.round(cov * 255);
          d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
          if (v > 6) { var p = i / 4, x = p % cv.width, y = (p - x) / cv.width; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
        ctx.putImageData(im, 0, 0);
        var o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
        var ox = o.getContext('2d'); ox.drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
        got[c.id] = o.toDataURL('image/png');
      });
      return got;
    })(${JSON.stringify(chapters)})`);
    if (t.errors.length) console.log('page errors:', t.errors.join(' | '));
    await t.close();
    for (const c of chapters) fs.writeFileSync(path.join(OUT, c.id + '.png'), Buffer.from(res[c.id].split(',')[1], 'base64'));
    console.log(`wrote ${chapters.length} drawings to ${path.relative(root, OUT)}/`);
  } finally { await chrome.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
