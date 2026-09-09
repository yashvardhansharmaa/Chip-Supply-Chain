/* Specimen: an eight-GPU baseboard, drawn from the HGX B200 layout.
 *
 * Reference: Nvidia's HGX B200 universal baseboard as photographed by
 * ServeTheHome at Computex 2024. Eight SXM modules in two rows of four,
 * the two rows flipped so their land grids face inward, and TWO NVLink
 * switch chips (not four, as on H100) sitting in the middle of the board
 * to shorten the traces. Each module is a bolted retention frame with a
 * bare metal lid inside it, a land-grid array beside it and printed
 * corner fiducials; voltage-regulator banks line the long edges and the
 * high-density connectors run along the front.
 *
 * The two switch chips are in copper: they are the part of this board
 * that has exactly one supplier.
 */
PC.register('gpu-baseboard', function (p) {
  var parts = [];
  // ~510 x 400 mm board. Vertical relief is true to scale: the module
  // frames stand about 30 mm proud of a 6 mm board.
  var BW = 1.52, BD = 1.18, BH = 0.046;
  var top = BH / 2;

  function rect(w, d) {
    return [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
  }
  function outline(w, d, y, x, z, per, tn) {
    return PC.T(PC.polyline({ pts: rect(w, d), closed: true, perUnit: per, tone: tn }), { pos: [x, y, z] });
  }

  // ---------- the board ----------
  parts.push(PC.T(PC.plane({ w: BW, d: BD, n: 15000, tone: 0.2 }), { pos: [0, top, 0] }));
  parts.push(PC.box({ w: BW, h: BH, d: BD, faces: ['px', 'nx', 'pz', 'nz'], n: 3200, tone: 0.44 }));
  parts.push(PC.boxEdges({ w: BW, h: BH, d: BD, perUnit: 300, tone: 1 }));

  // ---------- one SXM module ----------
  var MW = 0.31, MD = 0.30, MH = 0.066;        // retention frame
  var LW = 0.175, LD = 0.205;                  // the bare lid inside it
  function module(mx, mz, sideSign) {
    var g = [], y0 = top, yc = y0 + MH / 2, yT = y0 + MH;
    // the frame: a low kerbed box, open in the middle
    g.push(PC.T(PC.box({ w: MW, h: MH, d: MD, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.5 }), { pos: [0, yc, 0] }));
    g.push(PC.T(PC.boxEdges({ w: MW, h: MH, d: MD, perUnit: 300, tone: 1 }), { pos: [0, yc, 0] }));
    // the top face of the frame, with its inner opening left dark
    var kerb = 0.032;
    [[0, (MD - kerb) / 2, MW, kerb], [0, -(MD - kerb) / 2, MW, kerb],
     [(MW - kerb) / 2, 0, kerb, MD - 2 * kerb], [-(MW - kerb) / 2, 0, kerb, MD - 2 * kerb]].forEach(function (b) {
      g.push(PC.T(PC.plane({ w: b[2], d: b[3], tone: 0.42 }), { pos: [b[0], yT, b[1]] }));
    });
    g.push(outline(MW - 2 * kerb, MD - 2 * kerb, yT + 0.001, 0, 0, 340, 1));
    // the package lid: a pale plate standing a little above the frame's floor
    var yL = yT - 0.014;
    g.push(PC.T(PC.box({ w: LW, h: 0.02, d: LD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 620, tone: 0.26 }), { pos: [0, yL, 0] }));
    g.push(PC.T(PC.boxEdges({ w: LW, h: 0.02, d: LD, perUnit: 380, tone: 1 }), { pos: [0, yL, 0] }));
    g.push(outline(LW * 0.62, LD * 0.5, yL + 0.011, 0, 0, 300, 0.55));
    // eight retention screws around the frame
    var sc = [];
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        sc.push([sx * (MW / 2 - 0.017), sz * (MD / 2 - 0.017)]);
        sc.push([sx * (MW / 2 - 0.017), sz * (MD * 0.15)]);
      });
    });
    sc.forEach(function (s) {
      g.push(PC.T(PC.circle({ r: 0.011, perUnit: 620, tone: 1 }), { pos: [s[0], yT + 0.002, s[1]] }));
      g.push(PC.T(PC.disc({ r: 0.006, n: 26, tone: 0.8 }), { pos: [s[0], yT + 0.002, s[1]] }));
    });
    // printed corner fiducials on the board, just outside the frame
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        var fx = sx * (MW / 2 + 0.013), fz = sz * (MD / 2 + 0.013);
        g.push(PC.line({ a: [fx, y0 + 0.001, fz], b: [fx - sx * 0.030, y0 + 0.001, fz], perUnit: 620, tone: 0.95 }));
        g.push(PC.line({ a: [fx, y0 + 0.001, fz], b: [fx, y0 + 0.001, fz - sz * 0.030], perUnit: 620, tone: 0.95 }));
      });
    });
    // the land-grid array, on the inboard side: the two rows of four are
    // flipped so every module's connector faces the switches
    var gz = sideSign * (MD / 2 + 0.055);
    g.push(PC.T(PC.plane({ w: 0.20, d: 0.052, n: 300, tone: 0.34 }), { pos: [0, y0 + 0.001, gz] }));
    g.push(outline(0.20, 0.052, y0 + 0.002, 0, gz, 380, 0.9));
    g.push(PC.T(PC.dots({ nx: 22, nz: 6, sx: 0.0082, sz: 0.0073, per: 2, tone: 0.85 }), { pos: [0, y0 + 0.003, gz] }));
    return PC.T(PC.merge.apply(null, g), { pos: [mx, 0, mz] });
  }

  var colX = [-0.525, -0.175, 0.175, 0.525], rowZ = 0.318;
  for (var c = 0; c < 4; c++) {
    parts.push(module(colX[c], -rowZ, 1));
    parts.push(module(colX[c], rowZ, -1));
  }

  // ---------- two NVLink switch chips in the middle, in copper ----------
  var SW = 0.30, SD = 0.235, SH = 0.05, swX = [-0.175, 0.175];
  swX.forEach(function (x) {
    var yc = top + SH / 2, yT = top + SH;
    parts.push(PC.T(PC.box({ w: SW, h: SH, d: SD, faces: ['px', 'nx', 'pz', 'nz'], n: 1100, tone: 0.5 }), { pos: [x, yc, 0] }));
    parts.push(PC.T(PC.boxEdges({ w: SW, h: SH, d: SD, perUnit: 320, tone: 1 }), { pos: [x, yc, 0] }));
    // copper lid: the switch package's heat spreader
    parts.push(PC.T(PC.accent(PC.plane({ w: SW - 0.05, d: SD - 0.05, n: 1650 }), 0.72), { pos: [x, yT, 0] }));
    parts.push(PC.accent(outline(SW - 0.05, SD - 0.05, yT + 0.002, x, 0, 460, 1), 1));
    parts.push(PC.accent(outline(SW - 0.10, SD - 0.10, yT + 0.003, x, 0, 340, 1), 0.85));
    // the die footprint drawn in ink over the copper, with its port rows
    parts.push(outline(SW * 0.42, SD * 0.44, yT + 0.004, x, 0, 460, 1));
    for (var q = 0; q < 5; q++) {
      var qz = (q - 2) * SD * 0.082;
      parts.push(PC.line({ a: [x - SW * 0.19, yT + 0.004, qz], b: [x + SW * 0.19, yT + 0.004, qz], perUnit: 420, tone: 0.85 }));
    }
    // retention screws
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        parts.push(PC.T(PC.circle({ r: 0.011, perUnit: 600, tone: 1 }), { pos: [x + sx * (SW / 2 - 0.017), yT + 0.002, sz * (SD / 2 - 0.017)] }));
      });
    });
  });
  // fan-out traces from each switch to the land grids of both rows
  var traces = [];
  swX.forEach(function (x) {
    for (var i = 0; i < 7; i++) {
      var o = (i - 3) * 0.020;
      [1, -1].forEach(function (s) {
        traces.push(PC.polyline({
          pts: [[x + o, top + 0.002, s * SD / 2], [x + o, top + 0.002, s * 0.132], [x + o * 1.9 + (x > 0 ? 0.09 : -0.09), top + 0.002, s * 0.163]],
          perUnit: 260, tone: 0.4
        }));
      });
    }
  });
  parts.push(PC.merge.apply(null, traces));

  // ---------- voltage-regulator banks down the long edges ----------
  function stage(x, z, w, h, d) {
    parts.push(PC.T(PC.box({ w: w, h: h, d: d, n: 150, tone: 0.55 }), { pos: [x, top + h / 2, z] }));
    parts.push(PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: 320, tone: 1 }), { pos: [x, top + h / 2, z] }));
  }
  var vz = BD / 2 - 0.052;
  for (var i2 = 0; i2 < 22; i2++) {
    var vx = (i2 - 10.5) * 0.066;
    stage(vx, -vz, 0.042, 0.030, 0.042);
    stage(vx, vz, 0.042, 0.030, 0.042);
  }
  // bulk capacitors: two clusters of cans at the power end
  for (i2 = 0; i2 < 18; i2++) {
    var cx = -BW / 2 + 0.028 + (i2 % 2) * 0.040, cz = (Math.floor(i2 / 2) - 4) * 0.056;
    parts.push(PC.T(PC.cylinder({ r: 0.015, h: 0.036, caps: false, n: 150, tone: 0.5 }), { pos: [cx, top + 0.018, cz] }));
    parts.push(PC.T(PC.circle({ r: 0.015, perUnit: 520, tone: 1 }), { pos: [cx, top + 0.036, cz] }));
  }

  // ---------- power blades and the high-density edge connectors ----------
  // Two power blades at the left end, six signal connectors along the front.
  [-1, 1].forEach(function (s) {
    var px = -BW / 2 + 0.115, pz = s * 0.20;
    parts.push(PC.T(PC.box({ w: 0.07, h: 0.052, d: 0.14, n: 460, tone: 0.5 }), { pos: [px, top + 0.026, pz] }));
    parts.push(PC.T(PC.boxEdges({ w: 0.07, h: 0.052, d: 0.14, perUnit: 340, tone: 1 }), { pos: [px, top + 0.026, pz] }));
    for (var k = 0; k < 5; k++) {
      var kz = pz + (k - 2) * 0.026;
      parts.push(PC.line({ a: [px - 0.03, top + 0.053, kz], b: [px + 0.03, top + 0.053, kz], perUnit: 420, tone: 0.9 }));
    }
  });
  var cw = 0.155, ch = 0.048, cd = 0.038, cz2 = BD / 2 - 0.108;
  for (i2 = 0; i2 < 6; i2++) {
    var x2 = (i2 - 2.5) * 0.212;
    parts.push(PC.T(PC.box({ w: cw, h: ch, d: cd, n: 420, tone: 0.5 }), { pos: [x2, top + ch / 2, cz2] }));
    parts.push(PC.T(PC.boxEdges({ w: cw, h: ch, d: cd, perUnit: 340, tone: 1 }), { pos: [x2, top + ch / 2, cz2] }));
    for (var k2 = 0; k2 < 18; k2++) {
      var px2 = x2 + (k2 - 8.5) * (cw * 0.88 / 17);
      parts.push(PC.line({ a: [px2, top + 0.007, cz2 + cd / 2], b: [px2, top + ch - 0.009, cz2 + cd / 2], perUnit: 280, tone: 0.72 }));
    }
  }

  // ---------- mounting holes and a silkscreen border ----------
  var holes = [];
  [-1, 1].forEach(function (sx) {
    [-1, 1].forEach(function (sz) {
      holes.push(PC.T(PC.circle({ r: 0.028, perUnit: 520, tone: 1 }), { pos: [sx * (BW / 2 - 0.042), top + 0.002, sz * (BD / 2 - 0.030)] }));
      holes.push(PC.T(PC.circle({ r: 0.028, perUnit: 520, tone: 1 }), { pos: [sx * 0.352, top + 0.002, sz * (BD / 2 - 0.030)] }));
    });
  });
  parts.push(PC.merge.apply(null, holes));
  parts.push(outline(BW - 0.016, BD - 0.016, top + 0.001, 0, 0, 240, 0.5));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.55, -0.6, 0],
    caption: 'An eight-GPU baseboard, about 510 by 400 mm: eight accelerator modules bolted into retention frames in two rows of four, flipped so their land grids face the middle, where the two NVLink switch chips sit in copper. Voltage-regulator banks line the long edges; the high-density connectors run along the front.'
  };
});
