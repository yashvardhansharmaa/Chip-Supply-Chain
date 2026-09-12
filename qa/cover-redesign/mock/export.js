// Export a specimen's point cloud (x, y, z, w float32 rows) for the cover renderer.
// usage: node qa/cover-redesign/mock/export.js <specimen> <out.bin> [density]
// Same route qa/die-floorplan.bin took: src/kit.js runs in Node, the specimen registers on the global PC.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
global.PC = require(path.join(ROOT, 'src', 'kit.js'));
const [name, out, density] = process.argv.slice(2);
if (density) PC.density = parseFloat(density);
require(path.join(ROOT, 'specimens', name + '.js'));
const s = PC.build(name, {});
fs.writeFileSync(out, Buffer.from(s.cloud.buffer, s.cloud.byteOffset, s.cloud.byteLength));
console.log(name, PC.count(s.cloud), 'points ->', out, 'tilt', s.tilt);
