#!/usr/bin/env node
/* Preview a specimen as a PNG contact sheet (three views).
 * usage: node build/preview.js <specimen-name> [paramsJSON]
 * Loads src/kit.js and every file in specimens/, builds the specimen,
 * writes qa/<name>.bin and calls build/render_preview.py to make qa/<name>.png
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const PC = require(path.join(root, 'src', 'kit.js'));
global.PC = PC;

const specDir = path.join(root, 'specimens');
for (const f of fs.readdirSync(specDir)) {
  if (!f.endsWith('.js')) continue;
  const src = fs.readFileSync(path.join(specDir, f), 'utf8');
  try { new Function('PC', src)(PC); }
  catch (e) { console.error('failed to load ' + f + ': ' + e.message); process.exit(1); }
}

const name = process.argv[2];
if (!name) { console.log('specimens: ' + Object.keys(PC.specimens).join(', ')); process.exit(0); }
const params = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const t0 = Date.now();
const s = PC.build(name, params);
const n = PC.count(s.cloud);
const b = PC.bounds(s.cloud);
console.log(`${name}: ${n} points, built in ${Date.now() - t0} ms, size ${b.size.map(v => v.toFixed(2)).join(' x ')}`);
if (n < 15000) console.log('WARNING: fewer than 15k points; the specimen will look thin. Increase density or surface area.');
if (n > 220000) console.log('WARNING: more than 220k points; trim it (thin() or lower n) to keep phones happy.');

fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
const bin = path.join(root, 'qa', name + '.bin');
fs.writeFileSync(bin, Buffer.from(s.cloud.buffer, s.cloud.byteOffset, s.cloud.byteLength));
const png = path.join(root, 'qa', name + '.png');
const tilt = s.tilt || [0.35, -0.6, 0];
execFileSync('python3', [path.join(__dirname, 'render_preview.py'), bin, png, String(tilt[0]), String(tilt[1]), String(tilt[2])], { stdio: 'inherit' });
console.log('wrote ' + png);
