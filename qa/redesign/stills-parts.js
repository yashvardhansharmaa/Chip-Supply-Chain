#!/usr/bin/env node
/* The annotated stills of the chapters whose drawing carries numbered parts (data/specimen-parts.json), but Lithography's,
   which is the hybrid mockup's render (29 Oct 2026). Each is made as Lithography's is: a square still of the site's own
   specimen at the angle it opens on, 772 px a side, on white, with no balloons on it, and each part's points on it in still
   pixels, so build/modules/social.js stillSVG draws the balloons over it for print, and the door to the chapter and The
   Chain's contents (build/line-stills.py) show it.
   For each chapter it opens the chapter's page on the local preview at 1440 with motion reduced, so the drawing holds its
   opening angle, waits for it to land in the slot, reads where the runtime projects each part's points (src/app.js
   Stage.drawBalloons), hides everything on the page but the drawing (the balloons, and the text the canvas runs under) and
   shoots it at twice the pixels on a white ground. The shot is trimmed to
   the drawing, given 5 percent of its size as margin, centered in a square and scaled to 772 px; the points go the same way.
   It writes build/assets/specimens/<id>-annotated.webp and the chapter's "still" in data/specimen-parts.json.
   With --query a=b the page opens with ?a=b (the HBM drawing's two versions, ?hbm=a and ?hbm=b), and with --suffix -x the file
   is <id>-annotated-x.webp and the data file is left alone (its points are printed).
   usage: node qa/redesign/stills-parts.js [base] [--only id,id] [--query k=v] [--suffix -x]   (base defaults to http://127.0.0.1:8786) */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : '');
const BASE = args[0] && !args[0].startsWith('--') ? args[0] : 'http://127.0.0.1:8786';
const ONLY = opt('--only') ? opt('--only').split(',') : [];
const QUERY = opt('--query'), SUFFIX = opt('--suffix');
const S = 772;
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'build', 'assets', 'specimens');
const DATA = path.join(ROOT, 'data', 'specimen-parts.json');
const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const ids = Object.keys(data).filter((id) => id !== '_about' && id !== 'lithography' && (!ONLY.length || ONLY.includes(id)));
const SQUARE = `
import sys, json
from PIL import Image, ImageChops
src, dst, S = sys.argv[1], sys.argv[2], int(sys.argv[3])
pts = json.loads(sys.argv[4])
im = Image.open(src).convert('RGB')
diff = ImageChops.difference(im, Image.new('RGB', im.size, (255, 255, 255))).convert('L').point(lambda v: 255 if v > 14 else 0)
box = diff.getbbox() or (0, 0, im.width, im.height)
w, h = box[2] - box[0], box[3] - box[1]
side = round(max(w, h) * 1.1)
x0, y0 = round((box[0] + box[2]) / 2 - side / 2), round((box[1] + box[3]) / 2 - side / 2)
sq = Image.new('RGB', (side, side), (255, 255, 255))
sq.paste(im.crop((max(0, x0), max(0, y0), min(im.width, x0 + side), min(im.height, y0 + side))), (max(0, -x0), max(0, -y0)))
sq = sq.resize((S, S), Image.LANCZOS)
sq.save(dst, 'WEBP', quality=72, method=6)
k = S / side
print(json.dumps([[[round((q[0] * 2 - x0) * k, 1), round((q[1] * 2 - y0) * k, 1)] for q in p] for p in pts]))
`;
(async () => {
  const chrome = launch(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-stills-parts-'));
  const py = path.join(tmp, 'square.py'); fs.writeFileSync(py, SQUARE);
  try {
    for (const id of ids) {
      const t = await open(chrome, `${BASE}/${id}/${QUERY ? '?' + QUERY : ''}`, { width: 1440, height: 1100, scale: 2, wait: 3000 });
      // a white ground (the page's is a barely off-white), the drawing in full view under the masthead
      await t.ev(`(function(){document.documentElement.style.setProperty('--bg','#fff');var c=document.querySelector('.ch-spec-draw canvas');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,c.getBoundingClientRect().top+scrollY-120);return 1;})()`);
      await sleep(3000);
      const r = await t.ev(`(function(){var c=document.querySelector('.ch-spec-draw canvas'),s=document.querySelector('.ch-balloons');if(!c||!s||!CP.Stage.parts)return null;var b=c.getBoundingClientRect(),st=document.createElement('style');st.textContent='body *{visibility:hidden!important}.ch-spec-draw canvas{visibility:visible!important}';document.head.appendChild(st);
        return {x:b.left+scrollX,y:b.top+scrollY,w:b.width,h:b.height,pts:CP.Stage.parts.map(function(p){return (p.pts||[]).map(function(q){return [q[0],q[1]];});})};})()`);
      if (!r) { console.log('no drawing or no balloons in the slot for', id); await t.close(); continue; }
      await sleep(300);
      const shot = await t.s('Page.captureScreenshot', { format: 'png', clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      const png = path.join(tmp, id + '.png'); fs.writeFileSync(png, Buffer.from(shot.data, 'base64'));
      const file = `${id}-annotated${SUFFIX}.webp`;
      const points = JSON.parse(execFileSync('python3', ['-I', py, png, path.join(OUT, file), String(S), JSON.stringify(r.pts)], { encoding: 'utf8' }).trim());
      console.log(`${file}: ${S} px, points ${JSON.stringify(points)}`, t.errors.length ? 'ERRORS ' + t.errors.join(' | ') : '');
      if (!SUFFIX) data[id].still = { file, size: S, points };
      await t.close();
    }
    if (!SUFFIX) {
      fs.writeFileSync(DATA, JSON.stringify(data));
      execFileSync('python3', ['-I', path.join(__dirname, 'parts-json.py')], { stdio: 'inherit' });
    }
  } finally { await chrome.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  process.exit(0);
})();
