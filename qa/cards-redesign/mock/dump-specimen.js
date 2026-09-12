// Dump a specimen's point cloud (x,y,z,w float32 rows) so the card mock can draw it with PIL.
// usage: node dump-specimen.js <name> <out.bin>
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
global.PC = require(path.join(root, 'src', 'kit.js'));
global.window = { PC: global.PC };
require(path.join(root, 'specimens', process.argv[2] + '.js'));
const s = PC.build(process.argv[2], {});
fs.writeFileSync(process.argv[3], Buffer.from(s.cloud.buffer, s.cloud.byteOffset, s.cloud.byteLength));
console.log(process.argv[2], PC.count(s.cloud), 'points; tilt', JSON.stringify(s.tilt), 'spin', s.spin);
