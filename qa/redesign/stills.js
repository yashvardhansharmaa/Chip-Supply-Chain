#!/usr/bin/env node
/* The specimen stills the readable chapter pages show where the app draws the live specimen (stage 3, from the stage 2 review:
   a readable page opened on a lone caption). For each chapter but those with an annotated still of their own (data/specimen-parts.json
   "still": Lithography, and since 29 Oct 2026 Silicon and Wafers, Memory and HBM and Advanced Packaging, made by
   qa/redesign/stills-parts.js), it opens the
   chapter in The Chain on the local preview, waits for the drawing to land in the chapter's slot, and shoots the slot at twice
   the pixels, with motion reduced so the drawing holds the angle it opens on. Chapters 16 and 17 are shot on their night ground,
   as the app sets them. Then each shot is trimmed to the drawing with a margin and written as build/assets/specimens/<id>.webp
   with its size in build/assets/specimens/stills.json (build/modules/social.js shows it and copies it to dist/media/spec-<id>.webp).
   usage: node qa/redesign/stills.js [base] [--only id,id]   (base defaults to http://127.0.0.1:8766) */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const BASE = args[0] && !args[0].startsWith('--') ? args[0] : 'http://127.0.0.1:8766';
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : [];
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'build', 'assets', 'specimens');
const PARTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'specimen-parts.json'), 'utf8'));
const ids = fs.readdirSync(path.join(ROOT, 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort()
  .map((f) => { const m = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8').match(/"id":\s*"([^"]+)"/); return m ? m[1] : f.replace(/^\d\d-|\.md$/g, ''); })
  .filter((id) => !((PARTS[id] || {}).still) && id !== 'introduction-and-goals' && (!ONLY.length || ONLY.includes(id)));
const TRIM = `
import sys
from PIL import Image, ImageChops
src, dst, night = sys.argv[1], sys.argv[2], sys.argv[3] == '1'
im = Image.open(src).convert('RGB')
bg = im.getpixel((4, 4))
diff = ImageChops.difference(im, Image.new('RGB', im.size, bg)).convert('L').point(lambda v: 255 if v > 14 else 0)
box = diff.getbbox() or (0, 0, im.width, im.height)
w, h = box[2] - box[0], box[3] - box[1]
pad = int(max(w, h) * 0.05)
box = (max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad))
im = im.crop(box)
if im.width > 1400: im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
im.save(dst, 'WEBP', quality=72, method=6)
print(dst, im.size)
print('SIZE', im.width, im.height)
`;
(async () => {
  const chrome = launch(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-stills-'));
  const py = path.join(tmp, 'trim.py'); fs.writeFileSync(py, TRIM);
  const sizesFile = path.join(OUT, 'stills.json'), sizes = fs.existsSync(sizesFile) ? JSON.parse(fs.readFileSync(sizesFile, 'utf8')) : {};
  try {
    for (const id of ids) {
      const t = await open(chrome, `${BASE}/#${id}`, { width: 1440, height: 1100, scale: 2, wait: 3000 });
      await t.ev(`(function(){var s=document.querySelector('#${id} .ch-spec');if(s)window.scrollTo(0,s.getBoundingClientRect().top+scrollY-80);return 1;})()`);
      await sleep(2500);
      const r = await t.ev(`(function(){var d=document.querySelector('#${id} .ch-spec-draw'),c=d&&d.querySelector('canvas');if(!c)return null;var b=d.getBoundingClientRect();return {x:b.left+scrollX,y:b.top+scrollY,w:b.width,h:b.height,night:!!d.closest('[data-night]')};})()`);
      if (!r) { console.log('no drawing in the slot for', id); await t.close(); continue; }
      const shot = await t.s('Page.captureScreenshot', { format: 'png', clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      const png = path.join(tmp, id + '.png'); fs.writeFileSync(png, Buffer.from(shot.data, 'base64'));
      const said = execFileSync('python3', ['-I', py, png, path.join(OUT, id + '.webp'), r.night ? '1' : '0'], { encoding: 'utf8' }).trim();
      const m = /SIZE (\d+) (\d+)/.exec(said); if (m) sizes[id] = [+m[1], +m[2]];
      console.log(said.replace(/\nSIZE.*/, ''), t.errors.length ? 'ERRORS ' + t.errors.join(' | ') : '');
      await t.close();
    }
    fs.writeFileSync(sizesFile, JSON.stringify(sizes, null, 1) + '\n');
  } finally { await chrome.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  process.exit(0);
})();
