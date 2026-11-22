/* The plate kit (the chapters' specimens, drawn as exploded technical plates since 21 Nov 2026): src/plate.js, the renderer,
   then the globe's coast and towns, then every plates/<name>.js, in one file the pages load (dist/assets/kit.js). Each plate
   is wrapped with the locals the models share (R, D, H and the helpers) and keeps its own try, so one that throws as it loads
   leaves the others drawing; each is parsed here first, so one with a syntax error is left out with a warning.
   load() runs the same code in Node, where build/build.js draws the stills from it: the phone strip's thumbnail, the door's
   still and The Chain's contents (SVG, light and dark), the print still's size and each chapter's slot height.
   The globe's coast (LAND, ANT, HOLES) and its towns (SITES, SUBS) are read from specimens/globe.js, the file the summary's
   map reads too (build/modules/summary-a.js), so the two never drift. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function plates(root, warn) {
  warn = warn || ((m) => console.warn(m));
  const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
  const kit = read(path.join(root, 'src', 'plate.js'));

  // the globe's data, parsed from the old specimen file
  const gsrc = read(path.join(root, 'specimens', 'globe.js'));
  const block = (name) => {
    const i = gsrc.indexOf('var ' + name + ' = ['); if (i < 0) return null;
    const start = gsrc.indexOf('[', i); let d = 0, j = start;
    for (; j < gsrc.length; j++) { if (gsrc[j] === '[') d++; else if (gsrc[j] === ']') { d--; if (!d) { j++; break; } } }
    try { return JSON.parse(gsrc.slice(start, j).replace(/\/\/[^\n]*/g, '').replace(/'/g, '"')); } catch (e) { return null; }
  };
  const globe = { LAND: block('LAND'), ANT: block('ANT'), HOLES: block('HOLES') || [1, 2], SITES: block('SITES'), SUBS: block('SUBS') };
  if (!globe.LAND || globe.LAND.length < 20 || !globe.ANT) warn('plates: could not read the globe\'s coast from specimens/globe.js');
  if (!globe.SITES || globe.SITES.length !== 19 || !globe.SUBS || globe.SUBS.length !== 5) warn(`plates: specimens/globe.js lists ${(globe.SITES || []).length} chokepoint towns and ${(globe.SUBS || []).length} alternatives (the caption says 19 and 5)`);

  const dir = path.join(root, 'plates');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort() : [];
  const head = 'var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;';
  const parts = files.map((f) => {
    const code = `/* plates/${f} */\ntry{(function(PLATE){'use strict';${head}\n${read(path.join(dir, f))}\n})(window.PLATE);}catch(e){console.warn('plate ${f} failed to load', e);}`;
    try { new vm.Script(code, { filename: f }); } catch (e) { warn(`plate ${f} does not parse, so it is left out: ${e.message}`); return ''; }
    return code;
  }).filter(Boolean);
  const code = kit + '\n' + `window.PLATE_GLOBE = ${JSON.stringify(globe)};\n` + parts.join('\n') + '\n';
  const names = parts.map((c) => (/R\('([\w-]+)'/.exec(c) || [])[1]).filter(Boolean);

  // the same kit in Node: a context of its own, where window and self are the context
  let loaded = null;
  const load = () => {
    if (loaded) return loaded;
    const ctx = { console };
    ctx.window = ctx; ctx.self = ctx;
    vm.createContext(ctx);
    vm.runInContext(code, ctx, { filename: 'kit.js' });
    loaded = ctx.PLATE;
    return loaded;
  };
  return { code, names, load, globe };
};
