/* Specimen: an electron-beam inspection column, sectioned down its axis.
 * Roughly a metre of column: a Schottky gun at the top, two condenser lenses,
 * a deflector and scan coils, a big objective lens at the bottom, and a wafer
 * on an X-Y stage. The electron beam is drawn in copper, pinching at each
 * crossover and focusing to a point on the wafer.
 */
PC.register('sem-column', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  // section window: drop the near quarter of every housing
  var A0 = 0.12, A1 = 1.80;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]); if (a < 0) a += Math.PI * 2;
      if (a > A0 && a < A1) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // surface of revolution from a bottom-to-top profile, with a point budget
  function shell(prof, n, tn) {
    var segs = [], tot = 0, i, s;
    for (i = 0; i < prof.length - 1; i++) {
      var r1 = prof[i][0], y1 = prof[i][1], r2 = prof[i + 1][0], y2 = prof[i + 1][1];
      var slant = Math.sqrt((r2 - r1) * (r2 - r1) + (y2 - y1) * (y2 - y1));
      s = { r1: r1, y1: y1, r2: r2, y2: y2, a: Math.PI * (r1 + r2) * slant };
      segs.push(s); tot += s.a;
    }
    var g = [];
    for (i = 0; i < segs.length; i++) {
      s = segs[i];
      var nn = Math.max(8, Math.round(n * s.a / tot));
      if (Math.abs(s.y2 - s.y1) < 1e-5) g.push(PC.T(PC.disc({ r: Math.max(s.r1, s.r2), rIn: Math.min(s.r1, s.r2), n: nn, tone: tn }), { pos: [0, s.y1, 0] }));
      else g.push(PC.T(PC.cone({ r1: s.r1, r2: s.r2, h: s.y2 - s.y1, n: nn, tone: tn }), { pos: [0, (s.y1 + s.y2) / 2, 0] }));
    }
    return PC.merge.apply(null, g);
  }
  function ring(r, y, per, tn) { return PC.T(PC.circle({ r: r, perUnit: per == null ? 240 : per, tone: tn == null ? 0.95 : tn }), { pos: [0, y, 0] }); }
  function tube(r, y0, y1, n, tn) { return PC.T(PC.cylinder({ r: r, h: y1 - y0, caps: false, n: n, tone: tn }), { pos: [0, (y0 + y1) / 2, 0] }); }
  // a magnetic lens: housing, bore, coil windings and pole pieces
  function lens(y0, y1, rOut, rBore, nHouse, nCoil) {
    var g = [
      shell([[rBore, y0], [rOut, y0], [rOut, y1], [rBore, y1]], nHouse, 0.28),
      tube(rBore, y0, y1, Math.round(nHouse * 0.22), 0.32),
      PC.T(PC.helix({ r: (rOut + rBore) / 2 + 0.02, pitch: (y1 - y0) / 6.5, turns: 5.5, perUnit: 190, tone: 0.55 }), { pos: [0, (y0 + y1) / 2, 0] }),
      PC.T(PC.helix({ r: (rOut + rBore) / 2 - 0.05, pitch: (y1 - y0) / 6.5, turns: 5.5, perUnit: 190, tone: 0.45 }), { pos: [0, (y0 + y1) / 2, 0] }),
      // pole pieces pinching the bore in the middle
      shell([[rBore, (y0 + y1) / 2 - 0.035], [rBore + 0.06, (y0 + y1) / 2 - 0.035]], 240, 0.7),
      shell([[rBore, (y0 + y1) / 2 + 0.035], [rBore + 0.06, (y0 + y1) / 2 + 0.035]], 240, 0.7)
    ];
    return cut(PC.merge.apply(null, g));
  }
  // a thin aperture plate with a small hole on the axis
  function aperture(y, r, hole, tn) {
    return PC.merge(
      PC.T(PC.disc({ r: r, rIn: hole, n: 520, tone: tn == null ? 0.55 : tn }), { pos: [0, y, 0] }),
      ring(r, y + 0.002, 260, 0.95), ring(hole, y + 0.002, 900, 1)
    );
  }

  // ---------- gun ----------
  add(cut(shell([[0.085, 1.10], [0.20, 1.10], [0.20, 1.36], [0.155, 1.44], [0.075, 1.478], [0, 1.485]], 3400, 0.27)));
  add(cut(ring(0.20, 1.10)), cut(ring(0.20, 1.36)), cut(ring(0.155, 1.44, 220, 0.8)));
  // Schottky emitter: a tiny tip on the axis, with suppressor and extractor
  add(PC.accent(PC.T(PC.cone({ r1: 0.004, r2: 0.030, h: 0.055, n: 240, tone: 1 }), { pos: [0, 1.288, 0] }), 1));
  add(PC.accent(PC.T(PC.sphere({ r: 0.012, n: 90 }), { pos: [0, 1.258, 0] }), 1));
  add(shell([[0.030, 1.316], [0.062, 1.336], [0.062, 1.352]], 500, 0.6));
  add(aperture(1.205, 0.075, 0.011, 0.5));
  add(aperture(1.120, 0.085, 0.013, 0.5));
  // ion pump hanging off the gun
  var ipy = 1.255, ipx = 0.30;
  add(PC.T(PC.cylinder({ r: 0.075, h: 0.20, caps: false, n: 900, tone: 0.3 }), { rot: [0, 0, Math.PI / 2], pos: [ipx, ipy, 0] }));
  add(PC.T(PC.circle({ r: 0.075, perUnit: 240, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [ipx + 0.10, ipy, 0] }));
  add(PC.T(PC.disc({ r: 0.075, n: 380, tone: 0.35 }), { rot: [0, 0, Math.PI / 2], pos: [ipx + 0.10, ipy, 0] }));
  add(PC.T(PC.box({ w: 0.13, h: 0.16, d: 0.16, n: 700, tone: 0.3 }), { pos: [ipx + 0.17, ipy, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.13, h: 0.16, d: 0.16, perUnit: 260, tone: 0.9 }), { pos: [ipx + 0.17, ipy, 0] }));

  // ---------- column ----------
  add(cut(tube(0.098, 0.72, 1.10, 1200, 0.26)));
  add(cut(ring(0.098, 0.72, 300, 0.9)));
  add(lens(0.48, 0.72, 0.34, 0.098, 3000, 0));       // condenser 1
  add(cut(tube(0.096, 0.36, 0.48, 560, 0.26)));
  add(aperture(0.435, 0.10, 0.009, 0.6));            // beam-limiting aperture
  add(lens(0.12, 0.36, 0.32, 0.094, 2800, 0));       // condenser 2
  add(cut(tube(0.094, -0.06, 0.12, 800, 0.26)));
  // stigmator: eight small saddle blocks round the tube
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4 + 0.15;
    if (a > A0 && a < A1) continue;
    add(PC.T(PC.box({ w: 0.05, h: 0.09, d: 0.035, n: 220, tone: 0.5 }), { rot: [0, -a, 0], pos: [0.115 * Math.cos(a), 0.02, 0.115 * Math.sin(a)] }));
  }
  add(cut(ring(0.145, 0.065, 220, 0.7)), cut(ring(0.145, -0.025, 220, 0.7)));
  // scan / deflection coils
  add(cut(tube(0.20, -0.26, -0.10, 900, 0.26)));
  add(cut(ring(0.20, -0.10)), cut(ring(0.20, -0.26)));
  for (i = 0; i < 4; i++) {
    a = i * Math.PI / 2 + 0.4;
    if (a > A0 && a < A1) continue;
    add(PC.T(PC.helix({ r: 0.055, pitch: 0.028, turns: 4, perUnit: 200, tone: 0.6 }), { rot: [Math.PI / 2, Math.PI / 2 - a, 0], pos: [0.185 * Math.cos(a), -0.18, 0.185 * Math.sin(a)] }));
  }
  // objective lens
  add(lens(-0.56, -0.30, 0.44, 0.115, 3600, 0));
  add(cut(shell([[0.135, -0.79], [0.135, -0.745], [0.26, -0.685], [0.44, -0.585], [0.44, -0.56]], 2600, 0.28)));
  add(cut(tube(0.105, -0.79, -0.56, 800, 0.32)));
  add(cut(ring(0.44, -0.56)), cut(ring(0.44, -0.30)), cut(ring(0.115, -0.79, 400, 1)));
  // detector under the pole piece, and its side arm
  add(PC.T(PC.disc({ r: 0.17, rIn: 0.055, n: 900, tone: 0.4 }), { pos: [0, -0.83, 0] }));
  add(ring(0.17, -0.828, 300, 0.9), ring(0.055, -0.828, 500, 0.95));
  add(PC.T(PC.cylinder({ r: 0.045, h: 0.26, caps: false, n: 700, tone: 0.3 }), { rot: [0, 0, -0.9], pos: [0.29, -0.72, 0] }));
  add(PC.T(PC.circle({ r: 0.045, perUnit: 260, tone: 0.9 }), { rot: [0, 0, -0.9], pos: [0.40, -0.64, 0] }));

  // ---------- wafer and stage ----------
  var yW = -0.98, wafR = 0.38;
  add(PC.T(PC.disc({ r: wafR, n: 2200, tone: 0.3 }), { pos: [0, yW, 0] }));
  add(ring(wafR, yW + 0.002, 460, 1));
  var dg = [];
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) {
    var cx = gx * 0.088, cz = gz * 0.072;
    if (cx * cx + cz * cz > (wafR - 0.06) * (wafR - 0.06)) continue;
    dg.push(PC.polyline({ pts: [[cx - 0.042, 0, cz - 0.034], [cx + 0.042, 0, cz - 0.034], [cx + 0.042, 0, cz + 0.034], [cx - 0.042, 0, cz + 0.034]], closed: true, perUnit: 120, tone: 0.55 }));
  }
  add(PC.T(PC.merge.apply(null, dg), { pos: [0, yW + 0.003, 0] }));
  add(PC.T(PC.cylinder({ r: wafR + 0.03, h: 0.055, n: 1300, tone: 0.26 }), { pos: [0, yW - 0.03, 0] }));
  add(PC.T(PC.box({ w: 1.16, h: 0.085, d: 0.94, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 2400, tone: 0.24 }), { pos: [0, yW - 0.10, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.16, h: 0.085, d: 0.94, perUnit: 200, tone: 0.9 }), { pos: [0, yW - 0.10, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.44, h: 0.05, d: 0.08, n: 500, tone: 0.45 }), { pos: [0, yW - 0.175, i * 0.34] }));
    add(PC.T(PC.line({ a: [-0.72, 0, 0], b: [0.72, 0, 0], perUnit: 200, tone: 0.9 }), { pos: [0, yW - 0.15, i * 0.34] }));
  }
  add(PC.T(PC.box({ w: 1.56, h: 0.085, d: 1.24, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 3000, tone: 0.22 }), { pos: [0, yW - 0.25, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.56, h: 0.085, d: 1.24, perUnit: 190, tone: 0.9 }), { pos: [0, yW - 0.25, 0] }));

  // ---------- the beam ----------
  var ENV = [[1.262, 0.010], [1.20, 0.030], [1.11, 0.040], [0.72, 0.062], [0.60, 0.072], [0.50, 0.034],
  [0.436, 0.005], [0.36, 0.026], [0.24, 0.062], [0.12, 0.036], [0.02, 0.030], [-0.18, 0.040],
  [-0.43, 0.098], [-0.60, 0.074], [-0.79, 0.040], [yW, 0.002]];
  var env = [];
  for (var s = -1; s <= 1; s += 2) for (var ax = 0; ax < 2; ax++) {
    var pts = [];
    for (i = 0; i < ENV.length; i++) pts.push(ax ? [s * ENV[i][1], ENV[i][0], 0] : [0, ENV[i][0], s * ENV[i][1]]);
    env.push(PC.polyline({ pts: pts, perUnit: 210, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, env), 0.55));
  add(PC.accent(PC.line({ a: [0, 1.262, 0], b: [0, yW, 0], perUnit: 260, tone: 1 }), 0.6));
  // where the beam lands, and the secondaries it kicks back up to the detector
  add(PC.accent(PC.T(PC.disc({ r: 0.018, n: 160 }), { pos: [0, yW + 0.006, 0] }), 1));
  add(PC.accent(PC.T(PC.circle({ r: 0.055, perUnit: 700 }), { pos: [0, yW + 0.005, 0] }), 0.85));
  var se = [];
  for (i = 0; i < 16; i++) {
    a = i * Math.PI * 2 / 16 + 0.2;
    se.push(PC.line({ a: [0, yW + 0.01, 0], b: [0.115 * Math.cos(a), -0.845, 0.115 * Math.sin(a)], perUnit: 120, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, se), 0.3));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.15, -0.6, 0],
    caption: 'An electron-beam inspection column, cut open down one side: the beam (copper) leaves the emitter at the top, is squeezed by two condenser lenses and an aperture, steered by the deflection coils and focused by the objective lens onto a wafer on the stage below, where the scattered electrons come back up to the ring detector.'
  };
});
