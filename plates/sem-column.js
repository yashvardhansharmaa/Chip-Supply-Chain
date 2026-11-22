/* =====================================================================================================
   07 Metrology: an electron-beam inspection column cut in half down its axis, standing over a wafer, in the units of
   specimens/sem-column.js. The column comes apart along the beam: gun, condenser lenses, scan coils, objective, detector and
   stage, with the beam running on through every gap.
   22 Nov 2026 review: the column's height (about a metre) had no allowed source, so the caption no longer calls it to scale
   and says the column is simplified; the wafer is drawn 300 mm across (the stage's units) and labelled without its size.
   The detector is labelled: chapter 7 says the picture is built from the electrons the beam knocks loose. Colours (the set's
   legend): the beam in the beam hue the EUV light takes on plate 04, the wafer in silicon slate (acc2); the lens coils,
   copper before, are ink, since a plate has two accents and the wafer's colour is the one kept the same everywhere. */
R('sem-column', function (m) {
  var yaw = PLATE.DIM.yaw, h = farHalf(yaw), a0 = h[0], a1 = h[1], tv = h[2];
  var O = { a0: a0, a1: a1, cut: 'cut', seg: 48 };
  function o(extra) { var r = {}; for (var k in O) r[k] = O[k]; for (k in extra) r[k] = extra[k]; return r; }
  function lens(y0, y1, rOut, rB) {
    var hh = y1 - y0, mid = (y0 + y1) / 2, c0 = rB + (rOut - rB) * 0.30, c1 = rOut - (rOut - rB) * 0.14, w0 = y0 + hh * 0.16, w1 = y1 - hh * 0.16, g = 0.028;
    m.revolve([[rB, y0], [rOut, y0], [rOut, y1], [rB, y1], [rB, mid + g], [c0, w1], [c1, w1], [c1, w0], [c0, w0], [rB, mid - g]], 'turned', o({}));
    m.revolve([[c0 + 0.008, w0 + 0.008], [c1 - 0.008, w0 + 0.008], [c1 - 0.008, w1 - 0.008], [c0 + 0.008, w1 - 0.008]], 'dark', o({ cut: 'cutDense' }));
  }
  function tube(y0, y1, r0, r1) { m.revolve([[r0, y0], [r1, y0], [r1, y1], [r0, y1]], 'turned', o({})); }
  function plate(y, r, hole) { m.revolve([[hole, y - 0.004], [r, y - 0.004], [r, y + 0.004], [hole, y + 0.004]], 'turnedDark', o({ cut: 'cutDense' })); }
  var u = [Math.cos(a0), Math.sin(a0)];
  var parts = {}, beam = [];
  // gun and its insulator
  parts.gun = m.part('gun', { ex: [0, 0.34, 0], seq: 5 });
  m.revolve([[0.085, 1.10], [0.20, 1.10], [0.20, 1.36], [0.10, 1.47], [0.085, 1.47]], 'turned', o({}));
  [0, 1, 2].forEach(function (q) { var iy = 1.47 + q * 0.082, ir = 0.100 - q * 0.017; m.revolve([[0.03, iy], [ir, iy], [ir, iy + 0.07, 2], [0.03, iy + 0.07]], 'turnedDark', o({ cut: 'cutDense' })); });
  tube(1.72, 1.85, 0.02, 0.04);
  m.revolve([[0, 1.244], [0.003, 1.244], [0.026, 1.292], [0, 1.292]], 'acc', o({ cut: 'cutAcc' }));
  plate(1.205, 0.075, 0.010); plate(1.12, 0.085, 0.012);
  var ipA = tv + Math.PI;
  m.cyl([0.30 * Math.cos(ipA), 1.245, 0.30 * Math.sin(ipA)], 0.072, 0.20, 'turned', { seg: 24, rot: [0, -ipA, Math.PI / 2] });
  m.box({ c: [0.48 * Math.cos(ipA), 1.245, 0.48 * Math.sin(ipA)], s: [0.14, 0.17, 0.17], rot: [0, -ipA, 0] }, 'mid');
  // the first condenser and its tube
  parts.c1 = m.part('cond1', { ex: [0, 0.22, 0], seq: 4 });
  tube(0.72, 1.10, 0.088, 0.098); lens(0.48, 0.72, 0.34, 0.098);
  // the aperture and the second condenser
  parts.c2 = m.part('cond2', { ex: [0, 0.11, 0], seq: 3 });
  tube(0.36, 0.48, 0.086, 0.096); plate(0.435, 0.10, 0.008); lens(0.12, 0.36, 0.32, 0.094);
  // stigmator and scan coils
  parts.sc = m.part('scan', { ex: [0, 0, 0], seq: 2 });
  tube(-0.06, 0.12, 0.084, 0.094);
  m.revolve([[0.10, -0.03], [0.142, -0.03], [0.142, 0.07], [0.10, 0.07]], 'turnedDark', o({}));
  m.revolve([[0.094, -0.26], [0.20, -0.26], [0.20, -0.10], [0.094, -0.10]], 'turned', o({}));
  m.revolve([[0.118, -0.238], [0.184, -0.238], [0.184, -0.122], [0.118, -0.122]], 'dark', o({ cut: 'cutDense' }));
  // the objective lens and its conical pole piece
  parts.ob = m.part('objective', { ex: [0, -0.12, 0], seq: 1 });
  lens(-0.56, -0.30, 0.44, 0.115);
  m.revolve([[0.105, -0.815], [0.145, -0.815], [0.145, -0.76], [0.44, -0.56], [0.105, -0.56]], 'turned', o({}));
  // the ring detector
  parts.det = m.part('detector', { ex: [0, -0.2, 0], seq: 1 });
  m.tag('detector');
  m.revolve([[0.052, -0.859], [0.175, -0.859], [0.175, -0.851], [0.052, -0.851]], 'turnedDark', o({ cut: 'cutDense' }));
  m.tag(null);
  // wafer and stage
  parts.st = m.part('stage', { ex: [0, -0.32, 0], seq: 0, pri: -1, mode: 'stack' });
  var yW = -0.98, wr = 0.40, wt = wr * 0.775 / 150, dies = [];  // the wafer 300 mm across and 775 micrometres thick (SEMI M1)
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) { var cx = gx * 0.092, cz = gz * 0.076; if (cx * cx + cz * cz > (wr - 0.055) * (wr - 0.055)) continue; dies.push(D.rect(cx - 0.044, cz - 0.036, cx + 0.044, cz + 0.036, wt / 2, { lw: 0.35, alpha: 0.6 })); }
  dies.push({ dots: [[0, wt / 2, 0]], r: 2.4, col: 'acc', alpha: 1 });
  m.box({ c: [0, yW - 0.21, 0], s: [1.42, 0.09, 1.10] }, 'steel');
  [-1, 1].forEach(function (i) { m.box({ c: [0, yW - 0.147, i * 0.33], s: [1.30, 0.034, 0.056] }, 'dark'); });
  m.box({ c: [0, yW - 0.088, 0], s: [0.98, 0.07, 0.86] }, 'light');
  m.cyl([0, yW - 0.027, 0], 0.428, 0.05, 'turned', { seg: 48 });
  m.tag('wafer');
  m.cyl([0, yW - 0.003 + wt / 2, 0], wr, wt, 'acc2Light', { seg: 56, top: dies });
  m.tag(null);
  m.box({ c: [-wr - 0.048, yW - 0.02, 0], s: [0.02, 0.055, 0.80] }, 'dark');
  m.box({ c: [0, yW - 0.02, -wr - 0.048], s: [0.80, 0.055, 0.02] }, 'dark');
  var du = [Math.cos(yaw), Math.sin(yaw)]; // the direction that runs straight across the page at the resting turn
  // review: the size goes on the wafer's label in the caption's words ('a 300 mm wafer'). The dimension line had no room:
  // the gap between the column's tip and the wafer's far rim is about 15 px, so line and figure sat on both
  // the beam: emitter to wafer, and its envelope on the cut plane, each point riding with the part it passes through
  var ENV = [[1.268, 0.008], [1.20, 0.028], [1.11, 0.038], [0.72, 0.060], [0.60, 0.070], [0.50, 0.032], [0.436, 0.004], [0.36, 0.024], [0.24, 0.060], [0.12, 0.034], [0.02, 0.028], [-0.18, 0.038], [-0.43, 0.096], [-0.60, 0.072], [-0.815, 0.036], [yW, 0.002]];
  var who = function (y) { return y > 1.1 ? parts.gun.idx : y > 0.48 ? parts.c1.idx : y > 0.12 ? parts.c2.idx : y > -0.3 ? parts.sc.idx : y > -0.84 ? parts.ob.idx : parts.st.idx; };
  [-1, 1].forEach(function (s) { m.guide(ENV.map(function (q) { return [s * q[1] * u[0], q[0], s * q[1] * u[1], who(q[0])]; }), { style: 'beam', col: 'acc', lw: 0.8, alpha: 0.75 }); });
  m.guide([[0, 1.268, 0, parts.gun.idx], [0, 1.10, 0, parts.gun.idx], [0, 1.10, 0, parts.c1.idx], [0, 0.48, 0, parts.c1.idx], [0, 0.48, 0, parts.c2.idx], [0, 0.12, 0, parts.c2.idx], [0, 0.12, 0, parts.sc.idx], [0, -0.30, 0, parts.sc.idx], [0, -0.30, 0, parts.ob.idx], [0, -0.815, 0, parts.ob.idx], [0, -0.815, 0, parts.det.idx], [0, -0.86, 0, parts.det.idx], [0, -0.86, 0, parts.st.idx], [0, yW, 0, parts.st.idx]], { style: 'beam', col: 'acc', lw: 1.3 });
  var w2 = [Math.cos(a1), Math.sin(a1)];
  m.callout([0, 1.27, 0, parts.gun.idx], 'Emitter', { side: 'r' });
  m.callout([[0.27 * u[0], 0.60, 0.27 * u[1], parts.c1.idx], [0.3 * u[0], -0.43, 0.3 * u[1], parts.ob.idx]], 'Lenses', { side: 'l', row: 't' });
  // (on a phone the lenses and the beam are named from the top row, so their leaders rise beside the narrow column)
  m.callout([0, 0.03, 0, parts.sc.idx], 'Electron beam', { side: 'r', row: 't' });
  m.callout([-0.3 * du[0], yW + 0.004, -0.3 * du[1], parts.st.idx], 'Wafer', { side: 'l', tag: 'wafer' });
  m.callout([0.15 * u[0], -0.855, 0.15 * u[1], parts.det.idx], 'Detector', { side: 'l', tag: 'detector' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [0, 1, 0], accent: [107, 127, 209], accentDark: [167, 180, 245], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});
