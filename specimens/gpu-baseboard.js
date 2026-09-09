/* Specimen: an eight-GPU baseboard.
 * Eight accelerator packages in two rows of four, each drawn in the same visual
 * language as the `package` specimen (substrate, interposer, two logic dies,
 * eight HBM stacks with copper tops), four NVSwitch chips in copper down the
 * spine between the rows, connectors, power stages and mounting holes.
 */
PC.register('gpu-baseboard', function (p) {
  var parts = [];
  var BW = 1.94, BD = 1.30, BH = 0.055;        // board: roughly 600 x 400 mm
  var yBoard = 0, boardTop = BH / 2;

  // ---------- board ----------
  parts.push(PC.T(PC.plane({ w: BW, d: BD, n: 17000, tone: 0.27 }), { pos: [0, boardTop, 0] }));
  parts.push(PC.box({ w: BW, h: BH, d: BD, faces: ['px', 'nx', 'pz', 'nz'], n: 3400, tone: 0.42 }));
  parts.push(PC.boxEdges({ w: BW, h: BH, d: BD, perUnit: 300, tone: 1 }));

  // ---------- one accelerator package, drawn the way `package` draws it ----------
  // mm -> units, then vertical dimensions exaggerated ~4x so the stack reads at this size
  var S = 0.00327, E = 4;                      // mm -> units; E exaggerates the heights
  function pkg(px, pz) {
    var sub = 110 * S, ip = 85 * S;
    var subH = 1.8 * E * S, ipH = 0.9 * E * S, dieH = 1.1 * E * S, hbmH = 1.6 * E * S;
    var y0 = boardTop, ySubTop = y0 + subH;
    var g = [];
    // substrate slab
    g.push(PC.T(PC.box({ w: sub, h: subH, d: sub, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1200, tone: 0.4 }), { pos: [0, y0 + subH / 2, 0] }));
    g.push(PC.T(PC.boxEdges({ w: sub, h: subH, d: sub, perUnit: 230, tone: 1 }), { pos: [0, y0 + subH / 2, 0] }));
    // interposer
    var yIp = ySubTop + ipH / 2;
    g.push(PC.T(PC.box({ w: ip, h: ipH, d: ip, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 700, tone: 0.46 }), { pos: [0, yIp, 0] }));
    g.push(PC.T(PC.boxEdges({ w: ip, h: ipH, d: ip, perUnit: 240, tone: 1 }), { pos: [0, yIp, 0] }));
    var yTop = ySubTop + ipH;
    // two logic dies
    [-13, 13].forEach(function (dx) {
      var w = 26 * S, d = 32 * S;
      g.push(PC.T(PC.box({ w: w, h: dieH, d: d, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 300, tone: 0.58 }), { pos: [dx * S, yTop + dieH / 2, 0] }));
      g.push(PC.T(PC.boxEdges({ w: w, h: dieH, d: d, perUnit: 280, tone: 1 }), { pos: [dx * S, yTop + dieH / 2, 0] }));
      g.push(PC.T(PC.polyline({ pts: [[-w * 0.36, 0, -d * 0.38], [w * 0.36, 0, -d * 0.38], [w * 0.36, 0, d * 0.38], [-w * 0.36, 0, d * 0.38]], closed: true, perUnit: 240, tone: 0.9 }), { pos: [dx * S, yTop + dieH + 0.0012, 0] }));
    });
    // decoupling capacitors scattered on the substrate around the interposer
    g.push(PC.T(PC.dots({ nx: 13, nz: 2, sx: sub * 0.072, sz: 0.018, per: 2, tone: 0.8 }), { pos: [0, y0 + subH + 0.001, -sub * 0.42] }));
    g.push(PC.T(PC.dots({ nx: 13, nz: 2, sx: sub * 0.072, sz: 0.018, per: 2, tone: 0.8 }), { pos: [0, y0 + subH + 0.001, sub * 0.42] }));
    // eight HBM stacks, four each side, copper tops
    [-34, 34].forEach(function (hx) {
      [31, 10.4, -10.4, -31].forEach(function (hz) {
        var w = 11 * S, d = 12 * S, x = hx * S, z = -hz * S, yc = yTop + hbmH / 2;
        var ring = [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
        g.push(PC.T(PC.box({ w: w, h: hbmH, d: d, faces: ['px', 'nx', 'pz', 'nz'], n: 150, tone: 0.5 }), { pos: [x, yc, z] }));
        for (var k = 1; k <= 3; k++) {
          g.push(PC.T(PC.polyline({ pts: ring, closed: true, perUnit: 170, tone: 0.9 }), { pos: [x, yTop + hbmH * k / 4, z] }));
        }
        g.push(PC.T(PC.accent(PC.plane({ w: w * 0.9, d: d * 0.9, n: 40 }), 0.55), { pos: [x, yTop + hbmH, z] }));
        g.push(PC.T(PC.accent(PC.polyline({ pts: ring, closed: true, perUnit: 300 }), 1), { pos: [x, yTop + hbmH + 0.001, z] }));
      });
    });
    return PC.T(PC.merge.apply(null, g), { pos: [px, 0, pz] });
  }

  var colX = [-0.675, -0.225, 0.225, 0.675], rowZ = [-0.415, 0.415];
  for (var c = 0; c < 4; c++) for (var r = 0; r < 2; r++) parts.push(pkg(colX[c], rowZ[r]));

  // ---------- four NVSwitch chips down the spine, in copper ----------
  var swW = 0.185, swH = 0.028, swX = [-0.5175, -0.1725, 0.1725, 0.5175];
  swX.forEach(function (x) {
    parts.push(PC.T(PC.box({ w: swW, h: swH, d: swW, faces: ['px', 'nx', 'pz', 'nz'], n: 700, tone: 0.5 }), { pos: [x, boardTop + swH / 2, 0] }));
    parts.push(PC.T(PC.boxEdges({ w: swW, h: swH, d: swW, perUnit: 320, tone: 1 }), { pos: [x, boardTop + swH / 2, 0] }));
    parts.push(PC.T(PC.accent(PC.plane({ w: swW * 0.82, d: swW * 0.82, n: 620 }), 0.8), { pos: [x, boardTop + swH, 0] }));
    parts.push(PC.T(PC.accent(PC.polyline({ pts: [[-swW * 0.41, 0, -swW * 0.41], [swW * 0.41, 0, -swW * 0.41], [swW * 0.41, 0, swW * 0.41], [-swW * 0.41, 0, swW * 0.41]], closed: true, perUnit: 420 }), 1), { pos: [x, boardTop + swH + 0.001, 0] }));
    // the switch die and its port rows, drawn in ink over the copper lid
    parts.push(PC.T(PC.polyline({ pts: [[-swW * 0.26, 0, -swW * 0.3], [swW * 0.26, 0, -swW * 0.3], [swW * 0.26, 0, swW * 0.3], [-swW * 0.26, 0, swW * 0.3]], closed: true, perUnit: 400, tone: 1 }), { pos: [x, boardTop + swH + 0.002, 0] }));
    parts.push(PC.T(PC.dots({ nx: 4, nz: 6, sx: swW * 0.14, sz: swW * 0.1, per: 2, tone: 0.9 }), { pos: [x, boardTop + swH + 0.002, 0] }));
  });

  // NVLink traces fanning from each switch out to the package rows
  var traces = [];
  swX.forEach(function (x) {
    for (var i = 0; i < 5; i++) {
      var o = (i - 2) * 0.022;
      traces.push(PC.polyline({ pts: [[x + o, boardTop + 0.002, -swW / 2], [x + o, boardTop + 0.002, -0.24], [x + o * 3.2, boardTop + 0.002, -0.30]], perUnit: 220, tone: 0.45 }));
      traces.push(PC.polyline({ pts: [[x + o, boardTop + 0.002, swW / 2], [x + o, boardTop + 0.002, 0.24], [x + o * 3.2, boardTop + 0.002, 0.30]], perUnit: 220, tone: 0.45 }));
    }
  });
  parts.push(PC.merge.apply(null, traces));

  // ---------- connectors along the front edge ----------
  var cw = 0.20, ch = 0.075, cd = 0.055, cz = BD / 2 - 0.055;
  for (var i2 = 0; i2 < 6; i2++) {
    var x2 = (i2 - 2.5) * 0.27;
    parts.push(PC.T(PC.box({ w: cw, h: ch, d: cd, n: 620, tone: 0.5 }), { pos: [x2, boardTop + ch / 2, cz] }));
    parts.push(PC.T(PC.boxEdges({ w: cw, h: ch, d: cd, perUnit: 320, tone: 1 }), { pos: [x2, boardTop + ch / 2, cz] }));
    for (var k2 = 0; k2 < 16; k2++) {
      var px2 = x2 + (k2 - 7.5) * (cw * 0.9 / 15);
      parts.push(PC.line({ a: [px2, boardTop + 0.008, cz + cd / 2], b: [px2, boardTop + ch - 0.012, cz + cd / 2], perUnit: 300, tone: 0.7 }));
    }
  }

  // ---------- power stages along the back edge and the two ends ----------
  function stage(x, z) {
    parts.push(PC.T(PC.box({ w: 0.058, h: 0.042, d: 0.05, n: 230, tone: 0.55 }), { pos: [x, boardTop + 0.021, z] }));
    parts.push(PC.T(PC.boxEdges({ w: 0.058, h: 0.042, d: 0.05, perUnit: 320, tone: 1 }), { pos: [x, boardTop + 0.021, z] }));
  }
  for (i2 = 0; i2 < 14; i2++) stage((i2 - 6.5) * 0.075, -BD / 2 + 0.05);
  for (i2 = 0; i2 < 5; i2++) { stage(-BW / 2 + 0.048, (i2 - 2) * 0.085); stage(BW / 2 - 0.048, (i2 - 2) * 0.085); }

  // ---------- mounting holes ----------
  var holes = [];
  [-1, 1].forEach(function (sx) {
    [-1, 1].forEach(function (sz) {
      holes.push(PC.T(PC.circle({ r: 0.034, perUnit: 460, tone: 1 }), { pos: [sx * (BW / 2 - 0.06), boardTop + 0.002, sz * (BD / 2 - 0.055)] }));
      holes.push(PC.T(PC.circle({ r: 0.034, perUnit: 460, tone: 1 }), { pos: [sx * 0.45, boardTop + 0.002, sz * (BD / 2 - 0.055)] }));
    });
  });
  parts.push(PC.merge.apply(null, holes));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.55, -0.6, 0],
    caption: 'An eight-GPU baseboard: eight accelerator packages in two rows of four, each with two logic dies and eight HBM stacks (copper tops), wired through four NVSwitch chips down the middle, also in copper. Connectors run along the front edge and power stages around the rim.'
  };
});
