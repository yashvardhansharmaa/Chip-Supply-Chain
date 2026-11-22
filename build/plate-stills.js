#!/usr/bin/env node
/* Draw each chapter's plate as the small stills the pages show where the live plate is not (21 Nov 2026), from the built kit in
   a local preview, light and dark, in headless Chrome:
   - <id>-thumb: the phone's collapsed strip, 52 px square (src/app.js Stage.thumb);
   - <id>-line: The Chain's contents, in its row's 94 x 66 px box (build/build.js contentsItem);
   - <id>-door: the door that leads to the chapter, up to 386 x 180 px (build/build.js chapterDoor).
   Each is drawn with no labels or dimensions, at twice the pixels shown, on a clear ground (WebP with its alpha), the small two
   at the plate's simplified weights (lod "thumb"), the door's at its own. The line and door stills are trimmed to the drawing.
   The small two are held to 10 to 25 percent ink over the drawing's box (22 Nov 2026, plates critique system 10): each is drawn,
   measured on the light ground, and drawn again with its lines and fills lighter or heavier (the kit's inkK) until it is in
   range; the dark still takes the light one's weight.
   Writes build/assets/plates/<id>-<kind>[-dark].webp and plates.json (each still's size in pixels, and the hash of the plate's
   code it was drawn from, src/plate.js and plates/<specimen>.js, which build/build.js checks), then build again to copy them.
   usage: node build/plate-stills.js [base]   (default http://127.0.0.1:8802, a static server on dist/)
   Nothing leaves this machine but the font requests (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { launch, open } = require('../qa/redesign/cdp.js');

const root = path.resolve(__dirname, '..');
const BASE = (process.argv[2] || 'http://127.0.0.1:8802').replace(/\/$/, '');
const OUT = path.join(root, 'build', 'assets', 'plates');
const read = (f) => fs.readFileSync(f, 'utf8');
const hash = (spec) => crypto.createHash('sha256').update(read(path.join(root, 'src', 'plate.js')) + read(path.join(root, 'plates', spec + '.js'))).digest('hex').slice(0, 16);
// each chapter and its specimen, from its front matter
const chapters = fs.readdirSync(path.join(root, 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => {
  const m = JSON.parse(/^---json\s*\n([\s\S]*?)\n---/.exec(read(path.join(root, 'content', f)))[1]);
  return { id: m.id, spec: m.specimen };
}).filter((c) => c.spec && fs.existsSync(path.join(root, 'plates', c.spec + '.js')));

const KINDS = { thumb: { w: 52, h: 52, lod: 'thumb', trim: false }, line: { w: 94, h: 66, lod: 'thumb', trim: true }, door: { w: 386, h: 180, lod: 'full', trim: true } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const out = {};
  const chrome = launch();
  try {
    let inks = {};
    for (const theme of ['light', 'dark']) {
      const t = await open(chrome, BASE + '/lithography/', { width: 1200, theme, wait: 1200 });
      const res = await t.ev(`(function (list, kinds, inks) {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark', got = {};
        // the share of the drawing's box that is ink: each pixel's cover times its darkness, over the box
        var inkOf = function (ctx, W, H) {
          var d = ctx.getImageData(0, 0, W, H).data, x0 = W, y0 = H, x1 = 0, y1 = 0, s = 0, x, y, i;
          for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
          if (x1 < x0) return 0;
          for (y = y0; y <= y1; y++) for (x = x0; x <= x1; x++) { i = (y * W + x) * 4; s += d[i + 3] / 255 * (1 - (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255); }
          return s / ((x1 - x0 + 1) * (y1 - y0 + 1));
        };
        list.forEach(function (c) {
          got[c.id] = {};
          Object.keys(kinds).forEach(function (k) {
            var K = kinds[k], cv = document.createElement('canvas'); cv.width = K.w * 2; cv.height = K.h * 2;
            var pl = new PLATE.Plate(c.spec, { lod: K.lod }), ctx = cv.getContext('2d');
            var draw = function (ik) { pl.render(ctx, K.w, K.h, 2, { k: 1, mode: { noLabels: true, noDims: true }, dark: dark, el: document.documentElement, inkK: ik }); };
            var ik = (inks[c.id] || {})[k] || 1, ink = null;
            if (K.lod === 'thumb' && !dark) {
              // light: find the weight that puts the still between 10 and 25 percent ink, aiming at 17
              var lo = 0.3, hi = 2.4;
              for (var it = 0; it < 9; it++) { draw(ik); ink = inkOf(ctx, cv.width, cv.height); if (ink >= 0.14 && ink <= 0.20) break; if (ink > 0.20) hi = ik; else lo = ik; ik = (lo + hi) / 2; }
            }
            draw(ik);
            if (ink == null) ink = inkOf(ctx, cv.width, cv.height);
            var x0 = 0, y0 = 0, x1 = cv.width, y1 = cv.height;
            if (K.trim) {
              var d = ctx.getImageData(0, 0, cv.width, cv.height).data; x0 = cv.width; y0 = cv.height; x1 = 0; y1 = 0;
              for (var y = 0; y < cv.height; y++) for (var x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
              var m = 4; x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(cv.width, x1 + m + 1); y1 = Math.min(cv.height, y1 + m + 1);
              // an even size, so half of it is a whole number of css pixels
              if ((x1 - x0) % 2) { if (x1 < cv.width) x1++; else x0--; }
              if ((y1 - y0) % 2) { if (y1 < cv.height) y1++; else y0--; }
            }
            var o = document.createElement('canvas'); o.width = x1 - x0; o.height = y1 - y0; o.getContext('2d').drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
            got[c.id][k] = { w: o.width, h: o.height, url: o.toDataURL('image/webp', 0.92), ik: ik, ink: ink };
          });
        });
        return got;
      })(${JSON.stringify(chapters)}, ${JSON.stringify(KINDS)}, ${JSON.stringify(inks)})`);
      if (theme === 'light') { inks = {}; for (const id of Object.keys(res)) { inks[id] = {}; for (const k of Object.keys(KINDS)) inks[id][k] = res[id][k].ik; } }
      if (t.errors.length) console.log(theme, 'page errors:', t.errors.join(' | '));
      await t.close();
      for (const c of chapters) {
        const r = res[c.id]; out[c.id] = out[c.id] || { specimen: c.spec, src: hash(c.spec) };
        for (const k of Object.keys(KINDS)) {
          const f = path.join(OUT, `${c.id}-${k}${theme === 'dark' ? '-dark' : ''}.webp`);
          fs.writeFileSync(f, Buffer.from(r[k].url.split(',')[1], 'base64'));
          if (theme === 'light') { out[c.id][k] = [r[k].w, r[k].h]; if (KINDS[k].lod === 'thumb') (out[c.id].ink || (out[c.id].ink = {}))[k] = Math.round(r[k].ink * 1000) / 1000; }
        }
      }
      console.log(`${theme}: ${chapters.length} chapters, ${Object.keys(KINDS).length} stills each`);
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(path.join(OUT, 'plates.json'), JSON.stringify(out, null, 1) + '\n');
  const total = fs.readdirSync(OUT).filter((f) => f.endsWith('.webp')).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`wrote ${path.relative(root, OUT)}/: ${chapters.length * 6} stills, ${(total / 1024).toFixed(0)} KB, and plates.json`);
})().catch((e) => { console.error(e); process.exit(1); });
