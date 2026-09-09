/* Specimen: a CoWoS package pulled apart.
 * The same object as the `package` specimen — two reticle-sized logic dies and
 * eight HBM stacks, on an 85 mm silicon interposer, on a 110 mm build-up
 * substrate — lifted into its layers: ball grid, substrate, C4 bumps,
 * interposer (copper), micro-bumps, the dies and stacks, and the stiffener
 * frame above. Footprints are to scale (1 mm = 1/60 unit); the layer
 * thicknesses and the gaps between them are exaggerated so the stack reads.
 */
PC.register('cowos-exploded', function (p) {
  var S = 1 / 60;
  var L = {
    interposer: [85, 85],
    dies: [{ x: -13, y: 0, w: 26, h: 32 }, { x: 13, y: 0, w: 26, h: 32 }],
    hbm: [{ x: -34, y: 24, w: 11, h: 12 }, { x: -34, y: 8, w: 11, h: 12 }, { x: -34, y: -8, w: 11, h: 12 }, { x: -34, y: -24, w: 11, h: 12 },
          { x: 34, y: 24, w: 11, h: 12 }, { x: 34, y: 8, w: 11, h: 12 }, { x: 34, y: -8, w: 11, h: 12 }, { x: 34, y: -24, w: 11, h: 12 }],
    substrate: [110, 110]
  };
  var subW = L.substrate[0] * S, subD = L.substrate[1] * S, subH = 2.6 * S;
  var ipW = L.interposer[0] * S, ipD = L.interposer[1] * S, ipH = 1.7 * S;
  var dieH = 2.2 * S, hbmH = 3.4 * S;
  var ySub = 0, yC4 = 0.30, yIp = 0.60, yUb = 0.88, yTop = 1.12, yLid = 1.45;
  var parts = [];
  function add(c) { parts.push(c); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- 1. build-up substrate with its ball grid below ----------
  add(PC.T(PC.box({ w: subW, h: subH, d: subD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 15000, tone: 0.42 }), { pos: [0, ySub, 0] }));
  add(PC.T(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 300, tone: 0.9 }), { pos: [0, ySub, 0] }));
  var pitch = 3.6 * S;
  add(PC.T(PC.dots({ nx: Math.floor(subW / pitch) - 1, nz: Math.floor(subD / pitch) - 1, sx: pitch, sz: pitch, per: 3, tone: 0.6 }),
    { pos: [0, ySub - subH / 2 - 0.35 * S, 0] }));
  // the interposer's footprint marked on the substrate, where it will land
  add(rect(ipW, ipD, ySub + subH / 2 + 0.004, 260, 0.75));

  // ---------- 2. C4 bumps between substrate and interposer ----------
  var c4 = 3.4 * S, nc4 = Math.floor(ipW / c4) - 1;
  add(PC.T(PC.dots({ nx: nc4, nz: nc4, sx: c4, sz: c4, per: 4, tone: 0.8 }), { pos: [0, yC4, 0] }));
  add(rect(ipW, ipD, yC4, 200, 0.4));

  // ---------- 3. the silicon interposer (accent) ----------
  add(PC.T(PC.plane({ w: ipW, d: ipD, n: 7000, tone: 0.34 }), { pos: [0, yIp + ipH / 2, 0] }));
  add(PC.T(PC.accent(PC.box({ w: ipW, h: ipH, d: ipD, faces: ['px', 'nx', 'pz', 'nz'], n: 4200 }), 0.62), { pos: [0, yIp, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: ipW, h: ipH, d: ipD, perUnit: 340 }), 1), { pos: [0, yIp, 0] }));
  // the TSV field that carries every signal through the interposer
  var tv = 2.2 * S;
  add(PC.T(PC.accent(PC.dots({ nx: Math.floor(ipW / tv), nz: Math.floor(ipD / tv), sx: tv, sz: tv }), 0.35), { pos: [0, yIp + ipH / 2 + 0.004, 0] }));

  // ---------- 4. micro-bumps: the shadow of everything that sits on top ----------
  function footprints(fn) {
    (L.dies || []).forEach(function (d) { fn(d.x * S, -d.y * S, d.w * S, d.h * S, true); });
    (L.hbm || []).forEach(function (h) { fn(h.x * S, -h.y * S, h.w * S, h.h * S, false); });
  }
  footprints(function (x, z, w, d, isDie) {
    var s = 1.5 * S;
    add(PC.T(PC.dots({ nx: Math.max(3, Math.round(w / s)), nz: Math.max(3, Math.round(d / s)), sx: s, sz: s, per: 2, tone: 0.7 }), { pos: [x, yUb, z] }));
    add(PC.T(rect(w, d, yUb, 200, isDie ? 0.5 : 0.4), { pos: [x, 0, z] }));
  });

  // ---------- 5. the top layer: two logic dies and eight HBM stacks ----------
  (L.dies || []).forEach(function (d) {
    var w = d.w * S, dd = d.h * S, x = d.x * S, z = -d.y * S;
    add(PC.T(PC.box({ w: w, h: dieH, d: dd, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 4400, tone: 0.72 }), { pos: [x, yTop + dieH / 2, z] }));
    add(PC.T(PC.boxEdges({ w: w, h: dieH, d: dd, perUnit: 360, tone: 1 }), { pos: [x, yTop + dieH / 2, z] }));
    add(PC.T(PC.polyline({ pts: [[-w * 0.42, 0, -dd * 0.42], [w * 0.42, 0, -dd * 0.42], [w * 0.42, 0, dd * 0.42], [-w * 0.42, 0, dd * 0.42]], closed: true, perUnit: 220, tone: 0.9 }),
      { pos: [x, yTop + dieH + 0.003, z] }));
    add(PC.T(PC.dots({ nx: 6, nz: 8, sx: w * 0.13, sz: dd * 0.1, tone: 0.5 }), { pos: [x, yTop + dieH + 0.003, z] }));
  });
  (L.hbm || []).forEach(function (h) {
    var w = h.w * S, dd = h.h * S, x = h.x * S, z = -h.y * S;
    add(PC.T(PC.box({ w: w, h: hbmH, d: dd, faces: ['px', 'nx', 'pz', 'nz'], n: 1400, tone: 0.55 }), { pos: [x, yTop + hbmH / 2, z] }));
    for (var k = 1; k <= 12; k++) add(PC.T(rect(w, dd, yTop + hbmH * k / 13, 240, 0.95), { pos: [x, 0, z] }));
    add(PC.T(PC.accent(PC.plane({ w: w, d: dd }), 0.85), { pos: [x, yTop + hbmH, z] }));
    add(PC.T(PC.accent(rect(w, dd, yTop + hbmH + 0.002, 320, 1), 1), { pos: [x, 0, z] }));
  });

  // ---------- 6. the stiffener frame, lifted off the top ----------
  var ringW = 5 * S, ringH = 3 * S, gap = 3 * S;
  var rx = ipW / 2 + gap, rz = ipD / 2 + gap;
  [[2 * rx + 2 * ringW, ringW, 0, rz + ringW / 2], [2 * rx + 2 * ringW, ringW, 0, -rz - ringW / 2],
   [ringW, 2 * rz, rx + ringW / 2, 0], [ringW, 2 * rz, -rx - ringW / 2, 0]].forEach(function (b) {
    add(PC.T(PC.box({ w: b[0], h: ringH, d: b[1], n: 2600, tone: 0.45 }), { pos: [b[2], yLid, b[3]] }));
    add(PC.T(PC.boxEdges({ w: b[0], h: ringH, d: b[1], perUnit: 280, tone: 0.95 }), { pos: [b[2], yLid, b[3]] }));
  });

  // ---------- corner guide lines, so the layers read as one assembly ----------
  var g = [];
  for (var c = 0; c < 4; c++) {
    var sx = (c === 0 || c === 3) ? -1 : 1, sz = (c < 2) ? -1 : 1;
    g.push(PC.line({ a: [sx * subW / 2, ySub + subH / 2, sz * subD / 2], b: [sx * subW / 2, yLid, sz * subD / 2], perUnit: 130, tone: 0.22 }));
    g.push(PC.line({ a: [sx * ipW / 2, ySub + subH / 2, sz * ipD / 2], b: [sx * ipW / 2, yIp - ipH / 2, sz * ipD / 2], perUnit: 150, tone: 0.32 }));
  }
  add(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.45, -0.6, 0],
    caption: 'A CoWoS package pulled apart: the ball grid and build-up substrate at the bottom, then the C4 bumps, the copper-coloured silicon interposer with its through-silicon vias, the micro-bumps, the two logic dies and eight HBM stacks, and the stiffener frame lifted clear above. Footprints are to scale; layer thicknesses and gaps are exaggerated.'
  };
});
