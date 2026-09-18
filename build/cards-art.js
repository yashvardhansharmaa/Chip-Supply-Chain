// Dump a specimen's point cloud for build/cards.py, which draws it with Pillow on the social card.
// usage: node build/cards-art.js <specimen> <out.bin>
// Writes float32 rows of x, y, z, w (w in [2,3] marks an accent point, w in (3,4] a second-accent point, as in
// src/kit.js) and prints one JSON line: {"name", "points", "tilt": [rx, ry, rz], "spin", "colors"}. The tilt is the
// one the site itself opens the specimen at, so the card shows the same view a reader meets on the page. "colors" is
// {accent, accent2} as 0..255 triplets, the specimen's own colours resolved for the dark ground (accentDark or the
// PC.lift rule), or null when the specimen declares none and the card should use its own accent.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const name = process.argv[2], out = process.argv[3];
if (!name || !out) { console.error('usage: node build/cards-art.js <specimen> <out.bin>'); process.exit(2); }
global.PC = require(path.join(root, 'src', 'kit.js'));
global.window = { PC: global.PC };
require(path.join(root, 'specimens', name + '.js'));
const s = PC.build(name, {});
fs.writeFileSync(out, Buffer.from(s.cloud.buffer, s.cloud.byteOffset, s.cloud.byteLength));
process.stdout.write(JSON.stringify({ name, points: PC.count(s.cloud), tilt: s.tilt, spin: s.spin, colors: PC.resolveColors(s, true) }) + '\n');
