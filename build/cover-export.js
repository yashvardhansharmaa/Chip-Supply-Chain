// Dump a specimen's point cloud (float32 rows of x, y, z, w) for build/cover-art.py.
// usage: node build/cover-export.js <specimen> <out.bin> [density]
// src/kit.js runs in Node and the specimen registers on the global PC, the route qa/die-floorplan.bin
// and the cover mocks (qa/cover-redesign/mock/export.js) took. w in [0,1] is ink, w in [2,3] is the accent,
// w in (3,4] the second accent. Also writes <out>.json: {"colors": {accent, accent2}} as 0..255 triplets, the
// specimen's own light-ground colours (null when it declares none), so cover-art.py draws what the page draws.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.PC = require(path.join(ROOT, 'src', 'kit.js'));
const [name, out, density] = process.argv.slice(2);
if (!name || !out) { console.error('usage: node build/cover-export.js <specimen> <out.bin> [density]'); process.exit(2); }
if (density) PC.density = parseFloat(density);
require(path.join(ROOT, 'specimens', name + '.js'));
const s = PC.build(name, {});
fs.writeFileSync(out, Buffer.from(s.cloud.buffer, s.cloud.byteOffset, s.cloud.byteLength));
fs.writeFileSync(out + '.json', JSON.stringify({ name, points: PC.count(s.cloud), colors: PC.resolveColors(s, false) }) + '\n');
console.log(name, PC.count(s.cloud), 'points ->', out);
