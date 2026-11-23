/* =====================================================================================================
   10 Advanced Packaging: a CoWoS-L package as used for Nvidia's B200, pulled apart along its stacking axis, in millimetres.
   Footprints are this site's own estimate for the B200 (data/landscape-layouts.json, marked estimated): logic dies 26 x 32.5
   at x +-13.5, HBM stacks 11 x 11 at x +-33.5 and z +-5.9 and +-17.7, interposer 78 x 50, substrate 95 x 68. The caption
   says they are estimates. Thicknesses and gaps are exaggerated, as the caption says.
   22 Nov 2026 review:
   - the interposer of CoWoS-L is redistribution wiring with small silicon bridges set in it (chapter 10, TSMC's 2025 annual
     report), so it is drawn in ink with its copper wiring, and the bridges, the "L", are drawn in silicon slate and labelled;
   - no dots in mid-air: the microbumps are pad grids on the interposer's face under each chip, the C4 bumps a pad grid on the
     substrate's face under the interposer, and the solder balls one row of ring dots along the substrate's visible foot;
   - the footprints were 26 x 32, 11 x 12, 82 x 53 and 100 x 72 under "to scale".
   Colours (the set's legend): silicon slate (the bridges), copper (wiring and pads).
   22 Nov 2026 plates refine: the layers stand as far apart as the first plates had them (interposer 32, chips 56), so the
   package fills its slot; each bridge stands over its pocket, the pocket dashed in ink with trace lines from the bridge's
   corners down to it; the wiring is straight parallel bundles of copper traces, die to memory across each bridge and a dense
   bundle across the seam between the dies; the pad grids keep to the chips' footprints, thinner. */
R('cowos-exploded', function (m) {
  var dieW = 26, dieD = 32.5, dieX = 13.5, hbmW = 11, hbmD = 11, hbmX = 33.5, hbmZ = [-17.7, -5.9, 5.9, 17.7];
  var ipW = 78, ipD = 50, subW = 95, subD = 68;
  var subH = 5, ipH = 3, dieH = 2.2, hbmH = 2.8;
  var dies = [[-dieX, 0], [dieX, 0]], hbm = [];
  hbmZ.forEach(function (z) { hbm.push([-hbmX, z]); hbm.push([hbmX, z]); });

  // 1 the substrate, with the capacitors round the interposer's seat, the C4 pads on the seat, and a row of solder balls along
  // its two near edges, underneath
  var pS = m.part('substrate', { ex: [0, 0, 0], seq: 0 });
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
  capItems.push({ dots: gridPts(18, 11, 3.8, 3.8, subH / 2, 0, 0), r: 0.5, col: 'acc2', alpha: 0.75, tag: 'c4' });
  capItems.push(D.rect(-subW / 2 + 2.5, -subD / 2 + 2.5, subW / 2 - 2.5, subD / 2 - 2.5, subH / 2, { lw: 0.45, alpha: 0.5 }));
  m.box({ c: [0, subH / 2, 0], s: [subW, subH, subD], decals: { py: capItems } }, 'steel');
  var balls = [];
  for (var bx = -subW / 2 + 2; bx <= subW / 2 - 1.9; bx += 2.5) balls.push([bx, -0.75, subD / 2 - 1.5]);
  for (var bz = -subD / 2 + 2; bz <= subD / 2 - 3.9; bz += 2.5) balls.push([subW / 2 - 1.5, -0.75, bz]);
  m.dots(balls, { r: 1.0, ring: true, alpha: 0.75, front: true, c: [subW / 2, -0.75, subD / 2] });
  m.anchor(4, 'Substrate', [-subW / 2 + 16, subH * 0.15, subD / 2]);
  // 2 the interposer: redistribution wiring in ink, its copper lines, the microbump pads under each chip and, set into it, the
  // silicon bridges
  var pI = m.part('interposer', { ex: [0, 32, 0], seq: 1 });
  var y0 = subH, yT = ipH / 2, wiring = [];
  // the bridges: one under the seam between the dies, one under each memory joint
  var BR = [[0, 0, 9, dieD * 0.82]];
  hbm.forEach(function (h) { var sg = h[0] < 0 ? -1 : 1; BR.push([sg * (dieX + dieW / 2 + 1.6), h[1] * 0.8, 6, 5]); });
  // the wiring: a dense bundle of parallel traces across the seam, die to die, and a bundle die to memory across each memory
  // bridge, straight and parallel
  for (q = 0; q < 26; q++) { var rz = (q - 12.5) * (dieD * 0.78 / 25); wiring.push(D.line([-6.5, yT, rz], [6.5, yT, rz], { col: 'acc2', lw: 0.55 })); }
  BR.slice(1).forEach(function (b) {
    var sg = b[0] < 0 ? -1 : 1;
    for (var i = 0; i < 6; i++) { var z0 = b[1] + (i - 2.5) * 0.62; wiring.push(D.line([sg * (hbmX - hbmW * 0.22), yT, z0], [sg * (dieX + dieW / 2 - 3.6), yT, z0], { col: 'acc2', lw: 0.5 })); }
  });
  // the chips' seats, each with its pad grid
  // (the pad grids keep inside each chip's footprint, clear of the bridges' pockets and the bundles, and thinner)
  var clear = function (x, z) { return !BR.some(function (b) { return Math.abs(x - b[0]) < b[2] / 2 + 1.2 && Math.abs(z - b[1]) < b[3] / 2 + 1.2; }) && Math.abs(x) > 7.5; };
  dies.forEach(function (d) { wiring.push(D.rect(d[0] - dieW / 2, d[1] - dieD / 2, d[0] + dieW / 2, d[1] + dieD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(6, 8, 3.4, 3.6, yT, d[0], d[1], clear), r: 0.45, col: 'acc2', alpha: 0.8, tag: 'ubump' }); });
  hbm.forEach(function (h) { wiring.push(D.rect(h[0] - hbmW / 2, h[1] - hbmD / 2, h[0] + hbmW / 2, h[1] + hbmD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(3, 3, 2.6, 2.6, yT, h[0] + (h[0] < 0 ? -1 : 1) * 1.2, h[1], clear), r: 0.45, col: 'acc2', alpha: 0.8, tag: 'ubump' }); });
  // each bridge's pocket in the interposer's face, dashed in ink
  BR.forEach(function (b) { wiring.push(D.rect(b[0] - b[2] / 2, b[1] - b[3] / 2, b[0] + b[2] / 2, b[1] + b[3] / 2, yT, { lw: 0.55, dash: [1.6, 1.2], alpha: 0.9 })); });
  m.tag('ip');
  m.box({ c: [0, y0 + ipH / 2, 0], s: [ipW, ipH, ipD], decals: { py: wiring } }, 'light');
  m.tag(null);
  m.anchor(3, 'Interposer', [ipW / 2, y0 + ipH, ipD / 4]);
  var pB = m.part('bridges', { ex: [0, 44, 0], seq: 2 });
  m.tag('bridge');
  BR.forEach(function (b) { m.box({ c: [b[0], y0 + ipH - 0.6, b[1]], s: [b[2], 1.2, b[3]] }, 'acc'); });
  m.tag(null);
  m.anchor(5, 'Silicon bridges', [BR[5][0] - BR[5][2] / 2, y0 + ipH - 0.6, BR[5][1]], pB.idx);
  // 3 the chips: two logic dies with a hint of their floorplan, eight HBM stacks with their twelve layers
  var pK = m.part('chips', { ex: [0, 56, 0], seq: 3 });
  var yK = y0 + ipH;
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
  m.anchor(1, 'Logic dies', [dieX - dieW * 0.38, yK + dieH, -dieD * 0.36]);
  m.anchor(2, 'HBM stacks', [hbmX, yK + hbmH, hbmZ[2]]);
  // guides between the layers: the chips' corners down to their seats, the interposer's down to its seat
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (dieX + dieW / 2), y0 + ipH, c[1] * dieD / 2, pI.idx], [c[0] * (dieX + dieW / 2), yK, c[1] * dieD / 2, pK.idx]], { alpha: 0.9 });
    m.guide([[c[0] * ipW / 2, subH, c[1] * ipD / 2, pS.idx], [c[0] * ipW / 2, y0, c[1] * ipD / 2, pI.idx]], { alpha: 0.9 });
  });
  // and each bridge's two front corners down to its pocket
  BR.forEach(function (b) { [[-1, 1], [1, 1]].forEach(function (c) { var bx2 = b[0] + c[0] * b[2] / 2, bz2 = b[1] + c[1] * b[3] / 2; m.guide([[bx2, y0 + ipH, bz2, pI.idx], [bx2, y0 + ipH - 1.2, bz2, pB.idx]], { alpha: 0.9 }); }); });
  m.guide([[0, -6, 0, pS.idx], [0, yK + 12, 0, pK.idx]], { style: 'axis', alpha: 0.9 });
  return {
    elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], thumbX: 0.75,
    calloutOpts: { 1: { tag: 'logic', side: 'r' }, 2: { tag: 'hbm', side: 'r' }, 3: { tag: 'ip', side: 'r' }, 4: { side: 'l' }, 5: { tag: 'bridge', side: 'l' } },
    accent: [111, 139, 166], accentDark: [195, 211, 226], accent2: [176, 102, 44], accent2Dark: [224, 154, 92]
  };
});
