#!/usr/bin/env node
/* The share cards' drawings from the plates (21 Nov 2026): build/assets/cards-art/<chapter-id>.png, one per chapter, which
   build/cards.py draws every card from (the chapter's own drawing large, the stages small on the shelf). Each is the chapter's
   plate as the page draws it at rest, with no labels or dimensions, in the light theme and in its colours (treatment C, since
   24 Nov 2026), on a clear ground and cropped to the drawing: <id>.png at full detail for the large drawing, and
   <id>-small.png at the small stills' level of detail (lod "thumb") for the stages along the shelf. Until 24 Nov 2026 these were
   8-bit gray coverage images, the cards being drawn in ink alone; until 21 Nov 2026 qa/redesign/card-art.py made them from the
   point-cloud renders.
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
      var got = {};
      // a plate drawn at rest, S css px square at D, in colour on a clear ground, cropped to what is drawn (the large one at 720 px,
      // about one and a half times the card's largest drawing, the small one at 240)
      var draw = function (c, S, lod, D) {
        var cv = document.createElement('canvas'); cv.width = S * D; cv.height = S * D;
        var ctx = cv.getContext('2d'), pl = new PLATE.Plate(c.spec, lod ? { lod: lod } : {});
        pl.render(ctx, S, S, D, { k: 1, mode: { noLabels: true, noDims: true, pad: 0.02 }, dark: false, el: document.documentElement });
        var d = ctx.getImageData(0, 0, cv.width, cv.height).data, x0 = cv.width, y0 = cv.height, x1 = 0, y1 = 0;
        for (var i = 3; i < d.length; i += 4) if (d[i] > 8) { var p = (i - 3) / 4, x = p % cv.width, y = (p - x) / cv.width; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        var o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
        o.getContext('2d').drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
        return o.toDataURL('image/png');
      };
      list.forEach(function (c) { got[c.id] = { big: draw(c, 480, null, 1.5), small: draw(c, 120, 'thumb', 2) }; });
      return got;
    })(${JSON.stringify(chapters)})`);
    if (t.errors.length) console.log('page errors:', t.errors.join(' | '));
    await t.close();
    for (const c of chapters) {
      fs.writeFileSync(path.join(OUT, c.id + '.png'), Buffer.from(res[c.id].big.split(',')[1], 'base64'));
      fs.writeFileSync(path.join(OUT, c.id + '-small.png'), Buffer.from(res[c.id].small.split(',')[1], 'base64'));
    }
    console.log(`wrote ${chapters.length} drawings, each large and small, to ${path.relative(root, OUT)}/`);
  } finally { await chrome.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
