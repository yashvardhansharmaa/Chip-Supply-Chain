// Dump a specimen's point cloud for build/cards.py, which draws it with Pillow on the social card.
// usage: node build/cards-art.js <specimen> <out.bin>
// Writes float32 rows of x, y, z, w (w >= 2 marks an accent point, as in src/kit.js) and prints one
// JSON line: {"name", "points", "tilt": [rx, ry, rz], "spin"}. The tilt is the one the site itself opens
// the specimen at, so the card shows the same view a reader meets on the page.
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
process.stdout.write(JSON.stringify({ name, points: PC.count(s.cloud), tilt: s.tilt, spin: s.spin }) + '\n');
