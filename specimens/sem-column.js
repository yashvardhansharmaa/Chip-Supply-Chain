/* Specimen: an electron-beam inspection column, half-sectioned.
 *
 * About a metre of column standing over a 300 mm wafer: a Schottky field
 * emitter under its high-voltage insulator stack at the top, an ion pump on
 * the gun, two condenser lenses, a beam-limiting aperture, a stigmator, the
 * scan coils, and the objective lens with its conical pole piece just above
 * the wafer. Below that a ring detector and an X-Y stage with its
 * interferometer mirrors.
 *
 * The half in front of the section plane is removed and the plane is drawn as
 * solid material, so each magnetic lens shows what it really is: an iron yoke
 * wrapped round a copper coil, pinched to a narrow gap at the bore. Copper is
 * the electron beam and nothing else - the emitter, the beam envelope, the
 * spot where it lands and the secondaries it kicks back to the detector.
 */
PC.register('sem-column', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  /* section plane: at tilt [0.15, -0.6, 0] the nearest azimuth is ~0.97 rad */
  var AC = 0.97, A0 = AC - Math.PI / 2, A1 = AC + Math.PI / 2;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]);
      var d = a - AC; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      if (Math.abs(d) < Math.PI / 2) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // solid cut material on the section plane, both sides of the axis
  function face(ra, rb, y0, y1, tn, dens) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      var n = Math.max(40, Math.round((rb - ra) * (y1 - y0) * (dens == null ? 3.2 : dens) * PC.k));
      var c = new Float32Array(n * 4);
      for (var i = 0; i < n; i++) {
        var u = ra + PC.rnd() * (rb - ra), v = y0 + PC.rnd() * (y1 - y0);
        c[i * 4] = u * ca; c[i * 4 + 1] = v; c[i * 4 + 2] = u * sa; c[i * 4 + 3] = tn;
      }
      g.push(c);
    }
    return PC.merge.apply(null, g);
  }
  function faceEdge(ra, rb, y0, y1, tn, per) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      g.push(PC.polyline({
        pts: [[ra * ca, y0, ra * sa], [rb * ca, y0, rb * sa], [rb * ca, y1, rb * sa], [ra * ca, y1, ra * sa]],
        closed: true, perUnit: per == null ? 320 : per, tone: tn
      }));
    }
    return PC.merge.apply(null, g);
  }
  function faceLine(ra, rb, y, tn) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      g.push(PC.line({ a: [ra * ca, y, ra * sa], b: [rb * ca, y, rb * sa], perUnit: 340, tone: tn }));
    }
    return PC.merge.apply(null, g);
  }
  function ring(r, y, per, tn) { return cut(PC.T(PC.circle({ r: r, perUnit: per == null ? 300 : per, tone: tn == null ? 0.95 : tn }), { pos: [0, y, 0] })); }
  function ringFull(r, y, per, tn) { return PC.T(PC.circle({ r: r, perUnit: per == null ? 300 : per, tone: tn == null ? 0.95 : tn }), { pos: [0, y, 0] }); }
  function tube(r, y0, y1, n, tn) { return cut(PC.T(PC.cylinder({ r: r, h: y1 - y0, caps: false, n: n, tone: tn }), { pos: [0, (y0 + y1) / 2, 0] })); }

  /* A magnetic lens, drawn the way a textbook draws one: an iron yoke in
     section, a coil window inside it, and pole pieces pinching the bore. */
  function lens(y0, y1, rOut, rBore, nHouse) {
    var g = [], mid = (y0 + y1) / 2, h = y1 - y0;
    g.push(cut(PC.T(PC.cylinder({ r: rOut, h: h, caps: false, n: nHouse, tone: 0.26 }), { pos: [0, mid, 0] })));
    g.push(cut(PC.T(PC.disc({ r: rOut, rIn: rBore, n: Math.round(nHouse * 0.42), tone: 0.24 }), { pos: [0, y1, 0] })));
    g.push(cut(PC.T(PC.disc({ r: rOut, rIn: rBore, n: Math.round(nHouse * 0.42), tone: 0.24 }), { pos: [0, y0, 0] })));
    g.push(PC.T(PC.cylinder({ r: rBore, h: h, caps: false, n: Math.round(nHouse * 0.2), tone: 0.3 }), { pos: [0, mid, 0] }));
    g.push(ring(rOut, y0), ring(rOut, y1));
    // yoke in section
    g.push(face(rBore, rOut, y0, y1, 0.42));
    g.push(faceEdge(rBore, rOut, y0, y1, 1));
    // the coil window
    var c0 = rBore + (rOut - rBore) * 0.30, c1 = rOut - (rOut - rBore) * 0.14;
    var w0 = y0 + h * 0.16, w1 = y1 - h * 0.16;
    g.push(face(c0, c1, w0, w1, 0.72, 4.4));
    g.push(faceEdge(c0, c1, w0, w1, 1, 380));
    for (var k = 1; k < 4; k++) g.push(faceLine(c0, c1, w0 + (w1 - w0) * k / 4, 0.85));
    // pole pieces: the narrow gap that does the focusing
    g.push(faceLine(rBore, rBore + (rOut - rBore) * 0.34, mid - 0.028, 1));
    g.push(faceLine(rBore, rBore + (rOut - rBore) * 0.34, mid + 0.028, 1));
    g.push(ring(rBore + (rOut - rBore) * 0.34, mid - 0.028, 240, 0.7));
    g.push(ring(rBore + (rOut - rBore) * 0.34, mid + 0.028, 240, 0.7));
    return PC.merge.apply(null, g);
  }
  function aperture(y, r, hole, tn) {
    return PC.merge(
      cut(PC.T(PC.disc({ r: r, rIn: hole, n: 620, tone: tn == null ? 0.55 : tn }), { pos: [0, y, 0] })),
      face(hole, r, y - 0.004, y + 0.004, 0.85, 5),
      ring(r, y + 0.002, 320, 0.95), ringFull(hole, y + 0.002, 1100, 1)
    );
  }

  /* ---------- gun and its high-voltage insulator ---------- */

  add(cut(PC.T(PC.cylinder({ r: 0.20, h: 0.26, caps: false, n: 2200, tone: 0.26 }), { pos: [0, 1.23, 0] })));
  add(cut(PC.T(PC.cone({ r1: 0.20, r2: 0.10, h: 0.11, n: 1100, tone: 0.26 }), { pos: [0, 1.415, 0] })));
  add(face(0.085, 0.20, 1.10, 1.36, 0.4), faceEdge(0.085, 0.20, 1.10, 1.36, 1));
  add(ring(0.20, 1.10), ring(0.20, 1.36), ring(0.10, 1.47, 300, 0.9));
  // stepped ceramic insulator stack and the HV cable
  for (var q = 0; q < 4; q++) {
    var iy = 1.47 + q * 0.062, irr = 0.098 - q * 0.011;
    add(PC.T(PC.cylinder({ r: irr, h: 0.050, n: 700, tone: 0.3 }), { pos: [0, iy + 0.025, 0] }));
    add(ringFull(irr, iy + 0.050, 340, 0.9));
    add(ringFull(irr, iy, 300, 0.75));
  }
  add(PC.T(PC.cylinder({ r: 0.040, h: 0.14, caps: false, n: 420, tone: 0.34 }), { pos: [0, 1.79, 0] }));
  add(ringFull(0.040, 1.86, 380, 0.95));
  // Schottky emitter on the axis, with suppressor and extractor
  add(PC.accent(PC.T(PC.cone({ r1: 0.003, r2: 0.026, h: 0.048, n: 260, tone: 1 }), { pos: [0, 1.292, 0] }), 1));
  add(PC.accent(PC.T(PC.sphere({ r: 0.010, n: 90 }), { pos: [0, 1.266, 0] }), 1));
  add(face(0.026, 0.062, 1.316, 1.336, 0.7, 5), faceEdge(0.026, 0.062, 1.316, 1.336, 1, 380));
  add(aperture(1.205, 0.075, 0.010, 0.5));
  add(aperture(1.120, 0.085, 0.012, 0.5));
  // ion pump hanging off the gun
  var ipy = 1.245, ipx = 0.30;
  add(PC.T(PC.cylinder({ r: 0.072, h: 0.20, caps: false, n: 1100, tone: 0.3 }), { rot: [0, 0, Math.PI / 2], pos: [ipx, ipy, 0] }));
  add(PC.T(PC.circle({ r: 0.072, perUnit: 320, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [ipx + 0.10, ipy, 0] }));
  add(PC.T(PC.box({ w: 0.14, h: 0.17, d: 0.17, n: 1300, tone: 0.28 }), { pos: [ipx + 0.18, ipy, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.14, h: 0.17, d: 0.17, perUnit: 340, tone: 0.9 }), { pos: [ipx + 0.18, ipy, 0] }));

  /* ---------- column ---------- */

  add(tube(0.098, 0.72, 1.10, 1600, 0.24), face(0.088, 0.098, 0.72, 1.10, 0.45), ring(0.098, 0.72, 340, 0.9));
  add(lens(0.48, 0.72, 0.34, 0.098, 3200));                       // condenser 1
  add(tube(0.096, 0.36, 0.48, 700, 0.24), face(0.086, 0.096, 0.36, 0.48, 0.45));
  add(ring(0.096, 0.48, 340, 0.9), ring(0.096, 0.36, 340, 0.9));
  add(aperture(0.435, 0.10, 0.008, 0.6));                          // beam-limiting aperture
  add(lens(0.12, 0.36, 0.32, 0.094, 3000));                        // condenser 2
  add(tube(0.094, -0.06, 0.12, 900, 0.24), face(0.084, 0.094, -0.06, 0.12, 0.45));
  // stigmator: eight saddle blocks around the tube
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4 + 0.15, d = a - AC;
    while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    if (Math.abs(d) < Math.PI / 2) continue;
    add(PC.T(PC.box({ w: 0.062, h: 0.098, d: 0.042, n: 460, tone: 0.5 }), { rot: [0, -a, 0], pos: [0.113 * Math.cos(a), 0.02, 0.113 * Math.sin(a)] }));
  }
  add(ring(0.142, 0.066, 260, 0.7), ring(0.142, -0.026, 260, 0.7));
  add(ring(0.094, 0.12, 340, 0.9), ring(0.094, -0.06, 340, 0.9));
  // scan and deflection coils
  add(tube(0.20, -0.26, -0.10, 1200, 0.24));
  add(ring(0.20, -0.10), ring(0.20, -0.26));
  add(face(0.094, 0.20, -0.26, -0.10, 0.4), faceEdge(0.094, 0.20, -0.26, -0.10, 1));
  add(face(0.118, 0.184, -0.238, -0.122, 0.72, 4.4), faceEdge(0.118, 0.184, -0.238, -0.122, 1, 380));
  for (i = 1; i < 3; i++) add(faceLine(0.118, 0.184, -0.238 + 0.116 * i / 3, 0.85));
  // objective lens and its conical pole piece
  add(lens(-0.56, -0.30, 0.44, 0.115, 4000));
  add(cut(PC.T(PC.cone({ r1: 0.145, r2: 0.44, h: 0.19, n: 2600, tone: 0.26 }), { pos: [0, -0.665, 0] })));
  add(cut(PC.T(PC.cylinder({ r: 0.145, h: 0.055, caps: false, n: 500, tone: 0.26 }), { pos: [0, -0.788, 0] })));
  add(face(0.105, 0.145, -0.815, -0.76, 0.42));
  add(PC.polyline({
    pts: [[0.105 * Math.cos(A0), -0.815, 0.105 * Math.sin(A0)], [0.145 * Math.cos(A0), -0.815, 0.145 * Math.sin(A0)],
          [0.44 * Math.cos(A0), -0.56, 0.44 * Math.sin(A0)], [0.105 * Math.cos(A0), -0.56, 0.105 * Math.sin(A0)]],
    closed: true, perUnit: 300, tone: 0.95
  }));
  add(PC.polyline({
    pts: [[0.105 * Math.cos(A1), -0.815, 0.105 * Math.sin(A1)], [0.145 * Math.cos(A1), -0.815, 0.145 * Math.sin(A1)],
          [0.44 * Math.cos(A1), -0.56, 0.44 * Math.sin(A1)], [0.105 * Math.cos(A1), -0.56, 0.105 * Math.sin(A1)]],
    closed: true, perUnit: 300, tone: 0.95
  }));
  add(ring(0.44, -0.56), ringFull(0.115, -0.815, 460, 1));
  // ring detector under the pole piece, and its signal arm
  add(PC.T(PC.disc({ r: 0.175, rIn: 0.052, n: 1300, tone: 0.4 }), { pos: [0, -0.855, 0] }));
  add(ringFull(0.175, -0.853, 380, 0.95), ringFull(0.052, -0.853, 560, 0.95));
  for (i = 0; i < 24; i++) {
    var da = i * Math.PI * 2 / 24;
    add(PC.line({ a: [0.060 * Math.cos(da), -0.851, 0.060 * Math.sin(da)], b: [0.168 * Math.cos(da), -0.851, 0.168 * Math.sin(da)], perUnit: 300, tone: 0.55 }));
  }
  add(PC.T(PC.cylinder({ r: 0.042, h: 0.26, caps: false, n: 900, tone: 0.3 }), { rot: [0, 0, -0.95], pos: [0.30, -0.755, 0] }));
  add(PC.T(PC.circle({ r: 0.042, perUnit: 320, tone: 0.9 }), { rot: [0, 0, -0.95], pos: [0.40, -0.685, 0] }));

  /* ---------- wafer and X-Y stage ---------- */

  var yW = -0.98, wafR = 0.40;
  add(PC.T(PC.disc({ r: wafR, n: 2800, tone: 0.28 }), { pos: [0, yW, 0] }));
  add(ringFull(wafR, yW + 0.002, 520, 1));
  var dg = [];
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) {
    var cx = gx * 0.092, cz = gz * 0.076;
    if (cx * cx + cz * cz > (wafR - 0.055) * (wafR - 0.055)) continue;
    dg.push(PC.polyline({ pts: [[cx - 0.044, 0, cz - 0.036], [cx + 0.044, 0, cz - 0.036], [cx + 0.044, 0, cz + 0.036], [cx - 0.044, 0, cz + 0.036]], closed: true, perUnit: 150, tone: 0.6 }));
  }
  add(PC.T(PC.merge.apply(null, dg), { pos: [0, yW + 0.003, 0] }));
  // chuck, Y slide, X slide, granite base: a stage that reads as a stage
  add(PC.T(PC.cylinder({ r: wafR + 0.028, h: 0.050, n: 1800, tone: 0.24 }), { pos: [0, yW - 0.027, 0] }));
  add(ringFull(wafR + 0.028, yW - 0.052, 340, 0.9));
  add(PC.T(PC.box({ w: 0.98, h: 0.070, d: 0.86, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 2200, tone: 0.22 }), { pos: [0, yW - 0.088, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.98, h: 0.070, d: 0.86, perUnit: 300, tone: 0.92 }), { pos: [0, yW - 0.088, 0] }));
  add(PC.T(PC.box({ w: 1.26, h: 0.070, d: 0.62, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 2200, tone: 0.20 }), { pos: [0, yW - 0.165, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.26, h: 0.070, d: 0.62, perUnit: 300, tone: 0.92 }), { pos: [0, yW - 0.165, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.34, h: 0.036, d: 0.060, n: 520, tone: 0.45 }), { pos: [0, yW - 0.222, i * 0.34] }));
    add(PC.T(PC.line({ a: [-0.67, 0, 0], b: [0.67, 0, 0], perUnit: 300, tone: 0.9 }), { pos: [0, yW - 0.204, i * 0.34] }));
    add(PC.T(PC.box({ w: 0.055, h: 0.034, d: 0.72, n: 420, tone: 0.45 }), { pos: [i * 0.42, yW - 0.128, 0] }));
  }
  add(PC.T(PC.box({ w: 1.44, h: 0.085, d: 1.14, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 3000, tone: 0.18 }), { pos: [0, yW - 0.282, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.44, h: 0.085, d: 1.14, perUnit: 280, tone: 0.9 }), { pos: [0, yW - 0.282, 0] }));
  // interferometer mirror bars on two sides of the chuck: this is a metrology tool
  add(PC.T(PC.box({ w: 0.020, h: 0.055, d: 0.80, n: 480, tone: 0.62 }), { pos: [-wafR - 0.048, yW - 0.020, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.020, h: 0.055, d: 0.80, perUnit: 340, tone: 1 }), { pos: [-wafR - 0.048, yW - 0.020, 0] }));
  add(PC.T(PC.box({ w: 0.80, h: 0.055, d: 0.020, n: 480, tone: 0.62 }), { pos: [0, yW - 0.020, -wafR - 0.048] }));
  add(PC.T(PC.boxEdges({ w: 0.80, h: 0.055, d: 0.020, perUnit: 340, tone: 1 }), { pos: [0, yW - 0.020, -wafR - 0.048] }));

  /* ---------- the beam ---------- */

  var ENV = [[1.268, 0.008], [1.20, 0.028], [1.11, 0.038], [0.72, 0.060], [0.60, 0.070], [0.50, 0.032],
             [0.436, 0.004], [0.36, 0.024], [0.24, 0.060], [0.12, 0.034], [0.02, 0.028], [-0.18, 0.038],
             [-0.43, 0.096], [-0.60, 0.072], [-0.815, 0.036], [yW, 0.002]];
  var env = [];
  for (var s = -1; s <= 1; s += 2) for (var ax = 0; ax < 2; ax++) {
    var pts = [];
    for (i = 0; i < ENV.length; i++) pts.push(ax ? [s * ENV[i][1], ENV[i][0], 0] : [0, ENV[i][0], s * ENV[i][1]]);
    env.push(PC.polyline({ pts: pts, perUnit: 260, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, env), 0.6));
  add(PC.accent(PC.line({ a: [0, 1.268, 0], b: [0, yW, 0], perUnit: 320, tone: 1 }), 0.7));
  add(PC.accent(PC.T(PC.disc({ r: 0.016, n: 200 }), { pos: [0, yW + 0.006, 0] }), 1));
  add(PC.accent(PC.T(PC.circle({ r: 0.050, perUnit: 800 }), { pos: [0, yW + 0.005, 0] }), 0.85));
  var se = [];
  for (i = 0; i < 18; i++) {
    a = i * Math.PI * 2 / 18 + 0.2;
    se.push(PC.line({ a: [0, yW + 0.01, 0], b: [0.112 * Math.cos(a), -0.868, 0.112 * Math.sin(a)], perUnit: 150, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, se), 0.3));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.15, -0.6, 0],
    caption: 'An electron-beam inspection column cut in half down its axis. The beam, in copper, leaves the emitter under the high-voltage insulator at the top, is squeezed by two condenser lenses and an aperture, steered by the scan coils, and focused by the objective lens onto a 300 mm wafer on the stage, where the electrons it knocks loose come back up to the ring detector. Each lens is an iron yoke wrapped round a coil, pinched to a narrow gap at the bore.'
  };
});
