/* =====================================================================================================
   10 Advanced Packaging: a CoWoS-L package, pulled apart along its stacking axis. Millimetres.
   Footprints to scale (dies 26 x 32, HBM 11 x 12, interposer 82 x 53, substrate 100 x 72); thicknesses and gaps
   exaggerated, as the caption says. The interposer is silver with copper wiring and its embedded bridges dashed. */
R('cowos-exploded', function (m) {
  var dieW = 26, dieD = 32, dieX = 13.3, hbmW = 11, hbmD = 12, hbmX = 34, hbmZ = [-19, -6.4, 6.4, 19];
  var ipW = 82, ipD = 53, subW = 100, subD = 72;
  var subH = 5, ipH = 3, dieH = 2.2, hbmH = 2.8, frH = 2.6;
  var dies = [[-dieX, 0], [dieX, 0]], hbm = [];
  hbmZ.forEach(function (z) { hbm.push([-hbmX, z]); hbm.push([hbmX, z]); });

  // 1 the ball grid, under the substrate
  var pB = m.part('balls', { ex: [0, -15, 0], seq: 0 });
  m.dots(gridPts(39, 28, 2.5, 2.5, 0, 0, 0), { r: 1.05, ring: true, alpha: 0.7, c: [0, 0, 0] });
  // 2 the substrate, with the capacitors round the interposer's seat and the seat drawn on it
  var pS = m.part('substrate', { ex: [0, 0, 0], seq: 1 });
  var capItems = [];
  for (var q = 0; q < 30; q++) {
    var cu = (q - 14.5) * (subW * 0.94 / 30);
    if (Math.abs(cu) > ipW / 2 + 2) continue;
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(cu - 0.9, sg * (ipD / 2 + 3.2) - 1.1, cu + 0.9, sg * (ipD / 2 + 3.2) + 1.1, subH / 2, { fill: 'dark', lw: 0.4 })); });
  }
  for (q = 0; q < 18; q++) {
    var cv = (q - 8.5) * (subD * 0.92 / 18);
    if (Math.abs(cv) > ipD / 2 + 2) continue;
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(sg * (ipW / 2 + 3.2) - 1.1, cv - 0.9, sg * (ipW / 2 + 3.2) + 1.1, cv + 0.9, subH / 2, { fill: 'dark', lw: 0.4 })); });
  }
  capItems.push(D.rect(-ipW / 2, -ipD / 2, ipW / 2, ipD / 2, subH / 2, { dash: [3, 2], lw: 0.6, alpha: 0.8 }));
  capItems.push(D.rect(-subW / 2 + 2.5, -subD / 2 + 2.5, subW / 2 - 2.5, subD / 2 - 2.5, subH / 2, { lw: 0.45, alpha: 0.5 }));
  m.box({ c: [0, subH / 2, 0], s: [subW, subH, subD], decals: { py: capItems } }, 'steel');
  m.anchor(4, 'Substrate', [-subW / 2 + 16, subH * 0.15, subD / 2]);
  // 3 the C4 bumps that carry the interposer down to the substrate
  var pC = m.part('c4', { ex: [0, 17, 0], seq: 2 });
  m.dots(gridPts(29, 18, 2.8, 2.8, subH + 0.6, 0, 0), { r: 0.8, alpha: 0.7 });
  // 4 the interposer: silver, with its copper wiring, its vias and, dashed, its embedded silicon bridges
  var pI = m.part('interposer', { ex: [0, 32, 0], seq: 3 });
  var y0 = subH + 1.2, yT = ipH / 2, wiring = [];
  for (q = 0; q < 14; q++) { var rz = (q - 6.5) * (dieD * 0.8 / 14); wiring.push(D.line([-3.4, yT, rz], [3.4, yT, rz], { col: 'acc2', lw: 0.7 })); }
  hbm.forEach(function (h) {
    var sg = h[0] < 0 ? -1 : 1;
    for (var i = 0; i < 4; i++) {
      var z0 = h[1] + (i - 1.5) * 1.4;
      wiring.push(D.line([sg * (hbmX - hbmW * 0.32), yT, z0], [sg * (dieX + dieW / 2 - 1.4), yT, z0 * 0.92], { col: 'acc2', lw: 0.6 }));
    }
  });
  wiring.push({ dots: gridPts(22, 14, 3.6, 3.6, yT, 0, 0, function (x, z) { return Math.abs(x) > 4 && (Math.abs(x) < dieX - dieW / 2 + 1 || Math.abs(x) > dieX + dieW / 2 + 5); }), r: 0.38, col: 'acc2', alpha: 0.45 });
  // the chips' seats on the interposer
  dies.forEach(function (d) { wiring.push(D.rect(d[0] - dieW / 2, d[1] - dieD / 2, d[0] + dieW / 2, d[1] + dieD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); });
  hbm.forEach(function (h) { wiring.push(D.rect(h[0] - hbmW / 2, h[1] - hbmD / 2, h[0] + hbmW / 2, h[1] + hbmD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); });
  m.box({ c: [0, y0 + ipH / 2, 0], s: [ipW, ipH, ipD], decals: { py: wiring.map(function (it) { return it; }) } }, 'acc');
  // fix: decal coordinates are in the box frame (centre at y0 + ipH / 2), so yT = ipH / 2 lies on its top face
  // the embedded bridges: one under the seam between the dies, one under each memory joint
  m.box({ c: [0, y0 + ipH * 0.62, 0], s: [9, ipH * 0.4, dieD * 0.82] }, 'phantomAcc');
  hbm.forEach(function (h) { var sg = h[0] < 0 ? -1 : 1; m.box({ c: [sg * (dieX + dieW / 2 + 1.6), y0 + ipH * 0.62, h[1] * 0.8], s: [6, ipH * 0.4, 5] }, 'phantomAcc'); });
  m.anchor(3, 'Interposer', [ipW / 2, y0 + ipH, ipD / 4]);
  // 5 the micro-bumps, a field under every chip
  var pU = m.part('ubumps', { ex: [0, 45, 0], seq: 4 });
  var yU = y0 + ipH + 0.5;
  dies.forEach(function (d) { m.dots(gridPts(10, 12, 2.4, 2.5, yU, d[0], d[1]), { r: 0.62, col: 'acc2', alpha: 0.85 }); });
  hbm.forEach(function (h) { m.dots(gridPts(4, 4, 2.2, 2.4, yU, h[0], h[1]), { r: 0.6, col: 'acc2', alpha: 0.85 }); });
  // 6 the chips: two logic dies with a hint of their floorplan, eight HBM stacks with their twelve layers
  var pK = m.part('chips', { ex: [0, 56, 0], seq: 5 });
  var yK = yU + 0.6;
  m.tag('logic');
  dies.forEach(function (d) {
    var fp = [], sg = d[0] < 0 ? -1 : 1;
    for (var a = 0; a < 4; a++) for (var b = 0; b < 7; b++) fp.push(D.rect((a - 1.5) * dieW * 0.205 - dieW * 0.09 - sg * dieW * 0.05, (b - 3) * dieD * 0.13 - dieD * 0.055, (a - 1.5) * dieW * 0.205 + dieW * 0.09 - sg * dieW * 0.05, (b - 3) * dieD * 0.13 + dieD * 0.055, dieH / 2, { lw: 0.45, alpha: 0.75 }));
    fp.push(D.rect(sg * dieW * 0.38, -dieD * 0.45, sg * dieW * 0.47, dieD * 0.45, dieH / 2, { lw: 0.55, fill: 'mid' }));
    m.box({ c: [d[0], yK + dieH / 2, d[1]], s: [dieW, dieH, dieD], decals: { py: fp } }, 'steel');
  });
  m.tag('hbm');
  hbm.forEach(function (h) {
    var side = [];
    for (var k = 1; k < 12; k++) {
      var yy = -hbmH / 2 + hbmH * (k + 0.6) / 12.6;
      side.push(D.line([-hbmW / 2, yy, hbmD / 2], [hbmW / 2, yy, hbmD / 2], { lw: 0.35, alpha: 0.75 }));
    }
    var sideX = side.map(function (it) { return { pts: [[hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNX = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [-hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNZ = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], -hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    m.box({ c: [h[0], yK + hbmH / 2, h[1]], s: [hbmW, hbmH, hbmD], decals: { pz: side, px: sideX, nx: sideNX, nz: sideNZ, py: [D.rect(-hbmW / 2 + 1.2, -hbmD / 2 + 1.2, hbmW / 2 - 1.2, hbmD / 2 - 1.2, hbmH / 2, { lw: 0.4, alpha: 0.6 })] } }, 'steel');
  });
  m.tag(null);
  // review: the label moves to the right and its dot to the far corner of the right-hand die, so its leader runs clear
  // above the memory stacks; from the left die's centre it crossed the top of a stack on its way in
  m.anchor(1, 'Logic dies', [dieX - dieW * 0.38, yK + dieH, -dieD * 0.36]);
  m.anchor(2, 'HBM stacks', [hbmX, yK + hbmH, hbmZ[2]]);
  // 7 the stiffener frame, lifted clear above the chips
  // guides between the layers: the substrate's corners up to the frame's, the interposer's down to its seat
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (dieX + dieW / 2), y0 + ipH, c[1] * dieD / 2, pI.idx], [c[0] * (dieX + dieW / 2), yK, c[1] * dieD / 2, pK.idx]], { alpha: 0.9 });
    m.guide([[c[0] * ipW / 2, subH, c[1] * ipD / 2, pS.idx], [c[0] * ipW / 2, y0, c[1] * ipD / 2, pI.idx]], { alpha: 0.9 });
    m.guide([[c[0] * ipW / 2, y0 + ipH, c[1] * ipD / 2, pI.idx], [c[0] * (dieX + dieW / 2) * (c[0] < 0 ? 1 : 1), yK, c[1] * dieD / 2, pK.idx]], { alpha: 0.0 });
  });
  m.guide([[0, -8, 0, pB.idx], [0, yK + 12, 0, pK.idx]], { style: 'axis', alpha: 0.9 });
  return {
    elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], thumbX: 0.75,
    calloutOpts: { 1: { tag: 'logic', side: 'r' }, 2: { tag: 'hbm', side: 'r' }, 3: { side: 'r' }, 4: { side: 'l' } },
    accent: [111, 139, 166], accentDark: [195, 211, 226], accent2: [176, 102, 44], accent2Dark: [224, 154, 92]
  };
});
