/* Specimen: a CoWoS package pulled apart.
 *
 * Real object: a Blackwell-class accelerator. Two reticle-sized logic dies side
 * by side with a die-to-die seam down the middle, four HBM stacks to the left and
 * four to the right, all sitting on one slab of silicon, which sits on an organic
 * build-up substrate, which lands on the board through a ball grid. TechInsights'
 * B200 teardown gives the two-die, eight-stack arrangement; TSMC's CoWoS roadmap
 * coverage gives the size limits (3.3x reticle of chip area today, 80 x 80 mm of
 * substrate, nine reticles promised by 2027).
 *
 * Drawing decisions:
 *  - Footprints are to scale (1 mm = 1/60 unit). The interposer hugs the chips
 *    with a 1.5 mm margin, as a real one does; the old drawing floated the chips
 *    in the middle of a square interposer twice the size it should be.
 *  - Layer thicknesses and the gaps between them are exaggerated. The gaps are
 *    now about the thickness of the substrate rather than half the package width,
 *    so the layers read as one assembly instead of five separate plates.
 *  - The interposer is the chokepoint, so it is the only copper part. Its wiring
 *    is drawn: the dense bundle across the die-to-die seam and the bundles that
 *    fan out to each HBM site are the whole reason this slab of silicon exists.
 */
PC.register('cowos-exploded', function (p) {
  var S = 1 / 60;
  var dieW = 26 * S, dieD = 32 * S, dieX = 13.3 * S;
  var hbmW = 11 * S, hbmD = 12 * S, hbmX = 34 * S;
  var hbmZ = [-19 * S, -6.4 * S, 6.4 * S, 19 * S];
  var ipW = 82 * S, ipD = 53 * S;
  var subW = 100 * S, subD = 72 * S;
  var subH = 0.10, ipH = 0.048, dieH = 0.068, hbmH = 0.082, frH = 0.055;
  var gap = 0.075;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function rect(w, d, per, tn) {
    return PC.polyline({ pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]], closed: true, perUnit: per, tone: tn });
  }
  var dies = [{ x: -dieX, z: 0 }, { x: dieX, z: 0 }];
  var hbm = [];
  for (var q = 0; q < 4; q++) { hbm.push({ x: -hbmX, z: hbmZ[q] }); hbm.push({ x: hbmX, z: hbmZ[q] }); }

  // ---------- levels, bottom to top ----------
  var ySub = 0, subTop = subH / 2;
  var yC4 = subTop + gap;
  var ipBot = yC4 + gap, ipTop = ipBot + ipH;
  var yUb = ipTop + gap * 0.75;
  var yChip = yUb + gap * 0.75;
  var yFr = yChip + hbmH + gap * 1.15;

  // ---------- 1. the build-up substrate, with its ball grid underneath ----------
  add(PC.T(PC.plane({ w: subW, d: subD, n: 8000, tone: 0.3 }), { pos: [0, subTop, 0] }));
  add(PC.T(PC.box({ w: subW, h: subH, d: subD, faces: ['px', 'nx', 'pz', 'nz'], n: 3200, tone: 0.48 }), { pos: [0, ySub, 0] }));
  add(PC.T(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 280, tone: 0.9 }), { pos: [0, ySub, 0] }));
  var bp = 2.0 * S;
  add(PC.T(PC.dots({ nx: Math.floor(subW / bp) - 1, nz: Math.floor(subD / bp) - 1, sx: bp, sz: bp, per: 3, tone: 0.55 }),
    { pos: [0, ySub - subH / 2 - 0.028, 0] }));
  // where the interposer will land, and the ring of capacitors around it
  add(PC.T(rect(ipW, ipD, 240, 0.7), { pos: [0, subTop + 0.003, 0] }));
  var caps = [];
  for (q = 0; q < 34; q++) {
    var cu = (q - 16.5) * (subW * 0.97 / 34);
    if (Math.abs(cu) > ipW / 2 + 1.5 * S) continue;
    [-1, 1].forEach(function (sg) {
      caps.push(PC.line({ a: [cu, subTop + 0.004, sg * (ipD / 2 + 2.6 * S)], b: [cu, subTop + 0.004, sg * (ipD / 2 + 4.6 * S)], perUnit: 520, tone: 0.85 }));
    });
  }
  for (q = 0; q < 22; q++) {
    var cv = (q - 10.5) * (subD * 0.95 / 22);
    if (Math.abs(cv) > ipD / 2 + 1.5 * S) continue;
    [-1, 1].forEach(function (sg) {
      caps.push(PC.line({ a: [sg * (ipW / 2 + 2.6 * S), subTop + 0.004, cv], b: [sg * (ipW / 2 + 4.6 * S), subTop + 0.004, cv], perUnit: 520, tone: 0.85 }));
    });
  }
  add(PC.merge.apply(null, caps));

  // ---------- 2. the C4 bumps that carry the interposer down to the substrate ----------
  var c4 = 2.8 * S;
  add(PC.T(PC.dots({ nx: Math.floor(ipW / c4) - 1, nz: Math.floor(ipD / c4) - 1, sx: c4, sz: c4, per: 4, tone: 0.72 }), { pos: [0, yC4, 0] }));
  add(PC.T(rect(ipW, ipD, 150, 0.3), { pos: [0, yC4, 0] }));

  // ---------- 3. the silicon interposer: the chokepoint, in copper ----------
  var ipY = ipBot + ipH / 2;
  add(PC.T(PC.plane({ w: ipW, d: ipD, n: 5200, tone: 0.26 }), { pos: [0, ipTop, 0] }));
  add(PC.T(PC.accent(PC.box({ w: ipW, h: ipH, d: ipD, faces: ['px', 'nx', 'pz', 'nz'], n: 2600 }), 0.55), { pos: [0, ipY, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: ipW, h: ipH, d: ipD, perUnit: 320 }), 1), { pos: [0, ipY, 0] }));
  // the through-silicon vias, a field of them across the whole slab
  var tv = 3.4 * S;
  add(PC.T(PC.accent(PC.dots({ nx: Math.floor(ipW / tv), nz: Math.floor(ipD / tv), sx: tv, sz: tv }), 0.3), { pos: [0, ipTop + 0.003, 0] }));
  // the wiring: a dense bundle across the die-to-die seam, and a bundle out to
  // every HBM site. This is what the interposer is for.
  var rdl = [], yR = ipTop + 0.004;
  for (q = 0; q < 34; q++) {
    var rz = (q - 16.5) * (dieD * 0.94 / 34);
    rdl.push(PC.line({ a: [-dieX + dieW / 2 - 3 * S, yR, rz], b: [dieX - dieW / 2 + 3 * S, yR, rz], perUnit: 210, tone: 1 }));
  }
  hbm.forEach(function (h) {
    var sg = h.x < 0 ? -1 : 1;
    for (var i = 0; i < 13; i++) {
      var z0 = h.z + (i - 6) * hbmD * 0.062;
      var z1 = h.z * 0.55 + (i - 6) * hbmD * 0.05;
      rdl.push(PC.polyline({ pts: [[sg * (hbmX - hbmW * 0.36), yR, z0], [sg * (dieX + dieW / 2 + 2.4 * S), yR, z0], [sg * (dieX + dieW / 2 - 2.5 * S), yR, z1]], perUnit: 300, tone: 1 }));
    }
  });
  add(PC.accent(PC.merge.apply(null, rdl), 0.75));

  // ---------- 4. the micro-bumps, one field under every chip ----------
  function chips(fn) {
    dies.forEach(function (d) { fn(d.x, d.z, dieW, dieD, true); });
    hbm.forEach(function (h) { fn(h.x, h.z, hbmW, hbmD, false); });
  }
  chips(function (x, z, w, d, isDie) {
    var s = isDie ? 1.4 * S : 1.2 * S;
    add(PC.T(PC.dots({ nx: Math.round(w / s), nz: Math.round(d / s), sx: s, sz: s, per: 2, tone: 0.62 }), { pos: [x, yUb, z] }));
    add(PC.T(rect(w, d, 170, isDie ? 0.5 : 0.42), { pos: [x, yUb, z] }));
  });

  // ---------- 5. the chips: two logic dies and eight HBM stacks ----------
  dies.forEach(function (d) {
    var yc = yChip + dieH / 2;
    add(PC.T(PC.plane({ w: dieW, d: dieD, n: 2200, tone: 0.28 }), { pos: [d.x, yChip + dieH, d.z] }));
    add(PC.T(PC.box({ w: dieW, h: dieH, d: dieD, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.5 }), { pos: [d.x, yc, d.z] }));
    add(PC.T(PC.boxEdges({ w: dieW, h: dieH, d: dieD, perUnit: 300, tone: 1 }), { pos: [d.x, yc, d.z] }));
    // a hint of the floorplan: a block grid with the memory interface facing outward
    var fp = [], sg = d.x < 0 ? -1 : 1;
    for (var a = 0; a < 4; a++) for (var b = 0; b < 7; b++) {
      fp.push(PC.T(rect(dieW * 0.19, dieD * 0.115, 150, 0.75), { pos: [d.x + (a - 1.5) * dieW * 0.215, yChip + dieH + 0.003, d.z + (b - 3) * dieD * 0.132] }));
    }
    fp.push(PC.T(rect(dieW * 0.1, dieD * 0.9, 190, 0.9), { pos: [d.x + sg * dieW * 0.43, yChip + dieH + 0.003, d.z] }));
    add(PC.merge.apply(null, fp));
  });
  hbm.forEach(function (h) {
    var yc = yChip + hbmH / 2;
    add(PC.T(PC.box({ w: hbmW, h: hbmH, d: hbmD, faces: ['px', 'nx', 'pz', 'nz'], n: 900, tone: 0.45 }), { pos: [h.x, yc, h.z] }));
    for (var k = 1; k <= 12; k++) add(PC.T(rect(hbmW, hbmD, 150, 0.85), { pos: [h.x, yChip + hbmH * k / 12.6, h.z] }));
    add(PC.T(PC.plane({ w: hbmW, d: hbmD, n: 420, tone: 0.24 }), { pos: [h.x, yChip + hbmH, h.z] }));
    add(PC.T(rect(hbmW, hbmD, 320, 1), { pos: [h.x, yChip + hbmH, h.z] }));
  });

  // ---------- 6. the stiffener frame, lifted clear of the chips ----------
  var frIn = [ipW + 6 * S, ipD + 6 * S], frOut = [subW, subD];
  var barX = (frOut[0] - frIn[0]) / 2, barZ = (frOut[1] - frIn[1]) / 2;
  [[frOut[0], barZ, 0, (frIn[1] + barZ) / 2], [frOut[0], barZ, 0, -(frIn[1] + barZ) / 2],
   [barX, frIn[1], (frIn[0] + barX) / 2, 0], [barX, frIn[1], -(frIn[0] + barX) / 2, 0]].forEach(function (b) {
    add(PC.T(PC.box({ w: b[0], h: frH, d: b[1], n: 2000, tone: 0.4 }), { pos: [b[2], yFr, b[3]] }));
    add(PC.T(PC.boxEdges({ w: b[0], h: frH, d: b[1], perUnit: 260, tone: 0.95 }), { pos: [b[2], yFr, b[3]] }));
  });

  // ---------- guide lines, so the layers read as one assembly ----------
  var g = [];
  for (q = 0; q < 4; q++) {
    var sx = (q === 0 || q === 3) ? -1 : 1, sz = (q < 2) ? -1 : 1;
    g.push(PC.line({ a: [sx * subW / 2, subTop, sz * subD / 2], b: [sx * subW / 2, yFr - frH / 2, sz * subD / 2], perUnit: 110, tone: 0.2 }));
    g.push(PC.line({ a: [sx * ipW / 2, subTop, sz * ipD / 2], b: [sx * ipW / 2, ipBot, sz * ipD / 2], perUnit: 150, tone: 0.3 }));
    g.push(PC.line({ a: [sx * ipW / 2, ipTop, sz * ipD / 2], b: [sx * ipW / 2, yChip, sz * ipD / 2], perUnit: 130, tone: 0.24 }));
  }
  add(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.52, -0.68, 0],
    caption: 'A CoWoS package pulled apart: a ball grid and a build-up substrate ringed with capacitors at the bottom, then the C4 bumps, then the silicon interposer in copper with its through-silicon vias and the wiring that stitches the two logic dies together and fans out to the memory, then the micro-bumps, then two reticle-sized dies and eight HBM stacks, with the stiffener frame lifted clear above. Footprints are to scale: the chips cover about 2,700 mm2, a little over three reticles. Thicknesses and gaps are exaggerated.'
  };
});
