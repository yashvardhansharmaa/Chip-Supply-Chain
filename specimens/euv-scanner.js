/* Specimen: an EUV lithography scanner, cut open on its optical plane.
 *
 * The drawing exists to show the light path, so the machine is sectioned at
 * z = 0 and everything behind the cut is kept. Reading order, bottom-left to
 * bottom-right: tin droplet -> plasma -> collector dish -> intermediate focus
 * -> three illuminator mirrors (two of them faceted) -> reticle held face-down
 * at the top -> six projection mirrors -> wafer on the stage.
 *
 * Units are metres. Real anchors: the collector is a ~660 mm ellipsoidal Mo/Si
 * mirror with a hole for the CO2 drive laser; the illuminator uses field-facet
 * and pupil-facet mirrors; the projection optics are six mirrors at NA 0.33;
 * the reticle is 152 mm square and prints a 26 x 33 mm field 4x reduced.
 * The reticle and the wafer are drawn about 2x oversize so the two ends of the
 * light path still read at this scale; everything else is near true ratio.
 *
 * Copper is reserved for one thing: the 13.5 nm light itself. The infrared
 * drive laser, the tin droplets and the optics are all ink.
 */
PC.register('euv-scanner', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function unit(v) { var L = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; return [v[0] / L, v[1] / L]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }

  /* ---------- helpers ---------- */

  // Concave dish facing +Y, vertex at the origin, rim at y = sag.
  function dish(r, sag, rIn, n, tn) {
    var Rc = (r * r + sag * sag) / (2 * sag);
    var c = PC.sphere({ r: Rc, thetaMax: Math.asin(Math.min(0.999, r / Rc)), n: n, tone: tn });
    c = PC.T(c, { scale: [1, -1, 1], pos: [0, Rc, 0] });
    if (rIn > 0) {
      var keep = [];
      for (var i = 0; i < c.length; i += 4) {
        if (c[i] * c[i] + c[i + 2] * c[i + 2] < rIn * rIn) continue;
        keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
      }
      c = new Float32Array(keep);
    }
    return c;
  }

  // Square facets tiled across a dish, clipped to its rim: the signature of the
  // field-facet and pupil-facet mirrors in the illuminator.
  function facets(r, sag, k) {
    var g = [], s = (r * 1.9) / k, pad = s * 0.16;
    for (var a = 0; a < k; a++) for (var b = 0; b < k; b++) {
      var cx = (a - (k - 1) / 2) * s, cz = (b - (k - 1) / 2) * s;
      var rr = Math.sqrt(cx * cx + cz * cz);
      if (rr > r * 0.86) continue;
      var y = sag * (rr / r) * (rr / r), q = s / 2 - pad;
      g.push(PC.T(PC.polyline({
        pts: [[cx - q, y, cz - q], [cx + q, y, cz - q], [cx + q, y, cz + q], [cx - q, y, cz + q]],
        closed: true, perUnit: 210, tone: 0.95
      }), {}));
    }
    return g.length ? PC.merge.apply(null, g) : null;
  }

  // A mirror blank at 2-D point q, its concave face pointing along the in-plane
  // normal nv. In section a mirror is nearly edge-on, so it is drawn as a solid
  // disc of Zerodur with a hollowed front face: a crescent, the way an optical
  // layout draws one.
  function mirror(q, nv, r, o) {
    o = o || {};
    var sag = o.sag == null ? r * 0.15 : o.sag;
    var th = Math.atan2(-nv[0], nv[1]), t = o.thick == null ? r * 0.22 : o.thick;
    var g = [dish(r, sag, o.rIn || 0, o.n || Math.round(2400 * r * r + 240), o.tone == null ? 0.6 : o.tone)];
    g.push(PC.T(PC.cylinder({ r: r, h: t, caps: false, n: Math.round(1400 * r * t + 60), tone: 0.2 }), { pos: [0, -t / 2, 0] }));
    g.push(PC.T(PC.disc({ r: r, rIn: o.rIn || 0, n: Math.round(1100 * r * r + 60), tone: 0.16 }), { pos: [0, -t, 0] }));
    g.push(PC.T(PC.circle({ r: r, perUnit: 175, tone: 1 }), { pos: [0, sag, 0] }));       // front rim
    g.push(PC.T(PC.circle({ r: r, perUnit: 110, tone: 0.5 }), { pos: [0, -t, 0] }));      // back rim
    if (o.rIn) g.push(PC.T(PC.circle({ r: o.rIn, perUnit: 260, tone: 1 }), { pos: [0, 0.004, 0] }));
    if (o.facets) { var f = facets(r, sag, o.facets); if (f) g.push(f); }
    return PC.T(PC.merge.apply(null, g), { rot: [0, 0, th], pos: [q[0], q[1], 0] });
  }

  // Rectangle standing in the XY plane (a vessel wall seen edge-on in section).
  function panel(w, h, cx, cy, cz, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: [Math.PI / 2, 0, 0], pos: [cx, cy, cz] });
  }
  // Keep only what is behind the cutting plane.
  function section(c, zCut) {
    var keep = [], z0 = zCut == null ? 0 : zCut;
    for (var i = 0; i < c.length; i += 4) { if (c[i + 2] > z0) continue; keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]); }
    return new Float32Array(keep);
  }
  // A vacuum vessel: wire frame, far wall, floor and ceiling.
  function vessel(w, h, d, cx, cy, wallN) {
    var g = [];
    g.push(PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: 200, tone: 0.9 }), { pos: [cx, cy, 0] }));
    g.push(panel(w, h, cx, cy, -d / 2, wallN, 0.13));
    g.push(PC.T(PC.plane({ w: w, d: d / 2, n: Math.round(wallN * 0.32), tone: 0.1 }), { pos: [cx, cy + h / 2, -d / 4] }));
    g.push(PC.T(PC.plane({ w: w, d: d / 2, n: Math.round(wallN * 0.32), tone: 0.1 }), { pos: [cx, cy - h / 2, -d / 4] }));
    return PC.merge.apply(null, g);
  }

  /* ---------- the optical train ---------- */

  var PLASMA = [-1.14, -1.34];
  var COLL = [-1.80, -1.34];              // collector vertex
  var CR = 0.56, CSAG = 0.28, CHOLE = 0.075;

  var NODE = [
    { p: [-0.56, -1.34], kind: 'ap', h: 0.045 },        // intermediate focus
    { p: [-0.24, -0.82], kind: 'm', r: 0.20 },          // illuminator: grazing fold
    { p: [-0.98, -0.10], kind: 'm', r: 0.30, fc: 7 },   // field facet mirror
    { p: [-0.26, 0.66], kind: 'm', r: 0.27, fc: 6 },    // pupil facet mirror
    { p: [0.06, 1.68], kind: 'ret', h: 0.13 },          // reticle, pattern down
    { p: [0.54, 1.02], kind: 'm', r: 0.29 },            // M1
    { p: [1.22, 0.60], kind: 'm', r: 0.23 },            // M2
    { p: [0.47, 0.20], kind: 'm', r: 0.21 },            // M3
    { p: [1.19, -0.18], kind: 'm', r: 0.25 },           // M4
    { p: [0.41, -0.58], kind: 'm', r: 0.19 },           // M5
    { p: [1.06, -0.98], kind: 'm', r: 0.38 },           // M6
    { p: [0.44, -1.74], kind: 'waf', h: 0.055 }         // wafer
  ];

  var i;
  for (i = 0; i < NODE.length; i++) {
    var q = NODE[i];
    if (q.kind === 'ret') q.nv = [0, -1];
    else if (q.kind === 'waf') q.nv = [0, 1];
    else if (i === 0) q.nv = unit(sub(NODE[1].p, q.p));
    else {
      var a = unit(sub(NODE[i - 1].p, q.p)), b = unit(sub(NODE[i + 1].p, q.p));
      q.nv = unit([a[0] + b[0], a[1] + b[1]]);
    }
    q.tv = [-q.nv[1], q.nv[0]];
    q.hw = q.r ? q.r * 0.56 : q.h;
  }
  for (i = 1; i < NODE.length; i++) {
    if (NODE[i].tv[0] * NODE[i - 1].tv[0] + NODE[i].tv[1] * NODE[i - 1].tv[1] < 0) NODE[i].tv = [-NODE[i].tv[0], -NODE[i].tv[1]];
  }

  /* ---------- vacuum vessels ---------- */

  add(vessel(1.52, 2.76, 1.15, -0.57, 0.10, 3000));                 // illuminator
  add(vessel(1.46, 3.14, 1.22, 0.92, -0.06, 3600));                 // projection optics box
  add(vessel(1.74, 0.48, 0.98, 0.10, 1.90, 1250));                  // reticle stage chamber
  // frame ribs across the POB so it reads as a stiff optical bench, not a crate
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.polyline({ pts: [[-0.73, 0, 0], [0.73, 0, 0]], perUnit: 210, tone: 0.55 }), { rot: [Math.PI / 2, 0, 0], pos: [0.92, i * 0.94, -0.61] }));
  }

  /* ---------- source vessel, collector, tin ---------- */

  var vesR = 0.66, vesX0 = -1.94, vesX1 = -0.72, vesC = (vesX0 + vesX1) / 2;
  add(section(PC.T(PC.cylinder({ r: vesR, h: vesX1 - vesX0, caps: false, n: 6200, tone: 0.26 }), { rot: [0, 0, -Math.PI / 2], pos: [vesC, PLASMA[1], 0] })));
  add(PC.T(PC.circle({ r: vesR, perUnit: 260, tone: 0.9 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0, PLASMA[1], 0] }));
  add(PC.T(PC.circle({ r: vesR, perUnit: 260, tone: 0.9 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1, PLASMA[1], 0] }));
  add(PC.T(PC.disc({ r: vesR, rIn: 0.14, n: 900, tone: 0.22 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 - 0.002, PLASMA[1], 0] }));
  for (i = 1; i <= 3; i++) {
    add(section(PC.T(PC.circle({ r: vesR * 1.025, perUnit: 210, tone: 0.5 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 + i * (vesX1 - vesX0) / 4, PLASMA[1], 0] })));
  }
  // cone down to the intermediate focus, where the source hands the light over
  add(section(PC.T(PC.cone({ r1: vesR, r2: 0.10, h: 0.30, n: 1500, tone: 0.3 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1 + 0.15, PLASMA[1], 0] })));
  add(PC.T(PC.circle({ r: 0.10, perUnit: 800, tone: 1 }), { rot: [0, 0, -Math.PI / 2], pos: [NODE[0].p[0], PLASMA[1], 0] }));

  add(mirror(COLL, [1, 0], CR, { sag: CSAG, rIn: CHOLE, n: 3200, tone: 0.4, mount: false }));
  // the plasma: one bright copper node at the collector's focus
  add(PC.accent(PC.T(PC.sphere({ r: 0.036, n: 620 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 1));
  add(PC.accent(PC.T(PC.sphere({ r: 0.085, n: 420 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 0.3));
  // infrared drive laser, in ink: it is not the EUV
  add(PC.line({ a: [-2.14, PLASMA[1], 0], b: [PLASMA[0] - 0.04, PLASMA[1], 0], perUnit: 130, tone: 0.42 }));
  add(section(PC.T(PC.cylinder({ r: 0.09, h: 0.24, n: 700, tone: 0.4 }), { rot: [0, 0, -Math.PI / 2], pos: [-2.03, PLASMA[1], 0] })));
  add(PC.T(PC.boxEdges({ w: 0.26, h: 0.30, d: 0.30, perUnit: 240, tone: 0.85 }), { pos: [-2.02, PLASMA[1], 0] }));
  add(PC.T(PC.box({ w: 0.26, h: 0.30, d: 0.30, faces: ['nz', 'ny', 'nx'], n: 800, tone: 0.2 }), { pos: [-2.02, PLASMA[1], 0] }));
  // droplet generator above, tin catcher below: a stream of 30 um droplets
  add(section(PC.T(PC.cylinder({ r: 0.05, h: 0.30, n: 620, tone: 0.42 }), { pos: [PLASMA[0], PLASMA[1] + 0.72, 0] })));
  var drop = [];
  for (i = 0; i < 8; i++) drop.push(PC.T(PC.sphere({ r: 0.014, n: 46 }), { pos: [PLASMA[0], PLASMA[1] + 0.52 - i * 0.062, 0] }));
  add(PC.tone(PC.merge.apply(null, drop), 0.9));
  add(PC.T(PC.cone({ r1: 0.12, r2: 0.045, h: 0.18, n: 620, tone: 0.36 }), { pos: [PLASMA[0], PLASMA[1] - 0.52, 0] }));

  /* ---------- mirrors ---------- */

  for (i = 0; i < NODE.length; i++) {
    if (NODE[i].kind !== 'm') continue;
    add(mirror(NODE[i].p, NODE[i].nv, NODE[i].r, { facets: NODE[i].fc }));
  }

  /* ---------- reticle and reticle stage ---------- */

  var R = NODE[4].p, rw = 0.62, rd = 0.50;
  add(PC.T(PC.box({ w: rw, h: 0.05, d: rd, n: 1900, tone: 0.34 }), { pos: [R[0], R[1] + 0.023, 0] }));
  add(PC.T(PC.boxEdges({ w: rw, h: 0.05, d: rd, perUnit: 420, tone: 1 }), { pos: [R[0], R[1] + 0.023, 0] }));
  // the patterned field on the underside, 4x the printed 26 x 33 mm
  add(PC.T(PC.polyline({
    pts: [[-rw * 0.33, 0, -rd * 0.42], [rw * 0.33, 0, -rd * 0.42], [rw * 0.33, 0, rd * 0.42], [-rw * 0.33, 0, rd * 0.42]],
    closed: true, perUnit: 420, tone: 1
  }), { pos: [R[0], R[1] - 0.001, 0] }));
  // electrostatic chuck and the short-stroke stage above it
  add(PC.T(PC.box({ w: rw * 1.08, h: 0.085, d: rd * 1.08, faces: ['py', 'px', 'nx', 'nz'], n: 1100, tone: 0.24 }), { pos: [R[0], R[1] + 0.088, 0] }));
  add(PC.T(PC.boxEdges({ w: rw * 1.08, h: 0.085, d: rd * 1.08, perUnit: 260, tone: 0.95 }), { pos: [R[0], R[1] + 0.088, 0] }));
  // scan rails: the reticle runs four times faster than the wafer
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.62, h: 0.045, d: 0.055, n: 640, tone: 0.5 }), { pos: [R[0], R[1] + 0.155, i * 0.32] }));
    add(PC.T(PC.line({ a: [-0.81, 0, 0], b: [0.81, 0, 0], perUnit: 230, tone: 0.9 }), { pos: [R[0], R[1] + 0.179, i * 0.32] }));
  }

  /* ---------- wafer stage (TWINSCAN: expose here, measure alongside) ---------- */

  var W = NODE[11].p, wafR = 0.235, wafDx = 0.78;
  function chuck(cx, exposed) {
    var g = [];
    g.push(PC.T(PC.disc({ r: wafR, n: 700, tone: 0.2 }), { pos: [cx, W[1], 0] }));
    g.push(PC.T(PC.circle({ r: wafR, perUnit: 260, tone: 1 }), { pos: [cx, W[1] + 0.002, 0] }));
    g.push(PC.T(PC.circle({ r: wafR * 0.66, perUnit: 190, tone: 0.45 }), { pos: [cx, W[1] + 0.003, 0] }));
    g.push(PC.T(PC.cylinder({ r: wafR * 1.08, h: 0.075, n: 700, tone: 0.16 }), { pos: [cx, W[1] - 0.042, 0] }));
    g.push(PC.T(PC.circle({ r: wafR * 1.08, perUnit: 150, tone: 0.7 }), { pos: [cx, W[1] - 0.079, 0] }));
    if (exposed) g.push(PC.T(PC.accent(PC.plane({ w: 0.082, d: 0.066, n: 900 }), 1), { pos: [cx, W[1] + 0.006, 0] }));
    return PC.merge.apply(null, g);
  }
  add(chuck(W[0], true));
  add(chuck(W[0] + wafDx, false));
  // stage bridge, rails and granite base
  add(PC.T(PC.box({ w: 1.66, h: 0.10, d: 0.66, faces: ['py', 'px', 'nx', 'nz'], n: 1500, tone: 0.22 }), { pos: [W[0] + wafDx / 2, W[1] - 0.135, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.66, h: 0.10, d: 0.66, perUnit: 170, tone: 0.9 }), { pos: [W[0] + wafDx / 2, W[1] - 0.135, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.86, h: 0.04, d: 0.06, n: 420, tone: 0.42 }), { pos: [W[0] + wafDx / 2, W[1] - 0.208, i * 0.24] }));
    add(PC.T(PC.line({ a: [-0.93, 0, 0], b: [0.93, 0, 0], perUnit: 190, tone: 0.85 }), { pos: [W[0] + wafDx / 2, W[1] - 0.188, i * 0.24] }));
  }

  /* ---------- base frame ---------- */

  var bw = 3.66, bx = -0.16, by = -2.16;
  add(PC.T(PC.box({ w: bw, h: 0.20, d: 1.36, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 4200, tone: 0.24 }), { pos: [bx, by, 0] }));
  add(PC.T(PC.boxEdges({ w: bw, h: 0.20, d: 1.36, perUnit: 190, tone: 0.9 }), { pos: [bx, by, 0] }));
  for (i = 0; i < 4; i++) {
    var lx = bx - bw / 2 + 0.36 + i * (bw - 0.72) / 3;
    add(PC.T(PC.cylinder({ r: 0.085, h: 0.24, n: 400, tone: 0.4 }), { pos: [lx, by - 0.22, 0.50] }));
    add(PC.T(PC.cylinder({ r: 0.085, h: 0.24, n: 400, tone: 0.4 }), { pos: [lx, by - 0.22, -0.50] }));
  }
  // turbopumps slung under the two big vessels
  var pumpAt = [[-0.57, -1.52], [0.92, -1.80]];
  for (i = 0; i < pumpAt.length; i++) {
    add(PC.T(PC.cylinder({ r: 0.145, h: 0.26, n: 900, tone: 0.3 }), { pos: [pumpAt[i][0], pumpAt[i][1], -0.44] }));
    add(PC.T(PC.circle({ r: 0.175, perUnit: 260, tone: 0.85 }), { pos: [pumpAt[i][0], pumpAt[i][1] + 0.13, -0.44] }));
    add(PC.T(PC.circle({ r: 0.145, perUnit: 220, tone: 0.65 }), { pos: [pumpAt[i][0], pumpAt[i][1] - 0.13, -0.44] }));
  }

  /* ---------- the 13.5 nm light ---------- */

  var beam = [], glow = [];
  for (i = 0; i < NODE.length - 1; i++) {
    var A = NODE[i], B = NODE[i + 1];
    for (var s = -1; s <= 1; s += 2) for (var zs = -1; zs <= 1; zs += 2) {
      beam.push(PC.accent(PC.line({
        a: [A.p[0] + A.tv[0] * A.hw * s, A.p[1] + A.tv[1] * A.hw * s, zs * A.hw * 0.55],
        b: [B.p[0] + B.tv[0] * B.hw * s, B.p[1] + B.tv[1] * B.hw * s, zs * B.hw * 0.55],
        perUnit: 170
      }), 0.55));
    }
    beam.push(PC.accent(PC.line({ a: [A.p[0], A.p[1], 0], b: [B.p[0], B.p[1], 0], perUnit: 150 }), 0.8));
    var LL = Math.sqrt((B.p[0] - A.p[0]) * (B.p[0] - A.p[0]) + (B.p[1] - A.p[1]) * (B.p[1] - A.p[1]));
    var nf = Math.max(60, Math.round(LL * 900)), fill = new Float32Array(nf * 4);
    for (var t = 0; t < nf; t++) {
      var tt = PC.rnd(), ss = PC.rnd() * 2 - 1, zz = PC.rnd() * 2 - 1;
      var hx = A.tv[0] * A.hw * (1 - tt) + B.tv[0] * B.hw * tt, hy = A.tv[1] * A.hw * (1 - tt) + B.tv[1] * B.hw * tt;
      fill[t * 4] = A.p[0] + (B.p[0] - A.p[0]) * tt + hx * ss;
      fill[t * 4 + 1] = A.p[1] + (B.p[1] - A.p[1]) * tt + hy * ss;
      fill[t * 4 + 2] = (A.hw * (1 - tt) + B.hw * tt) * 0.55 * zz;
      fill[t * 4 + 3] = 2.2;
    }
    glow.push(fill);
  }
  // the collector's job: catch light over a huge solid angle and squeeze it
  // through the intermediate focus
  for (i = 0; i < 12; i++) {
    var ph = i * Math.PI * 2 / 12 + 0.2;
    for (var kk = 0; kk < 2; kk++) {
      var rr = kk ? 0.50 : 0.27;
      var pt = [COLL[0] + CSAG * (rr / CR) * (rr / CR), COLL[1] + rr * Math.cos(ph), rr * Math.sin(ph)];
      beam.push(PC.accent(PC.line({ a: [PLASMA[0], PLASMA[1], 0], b: pt, perUnit: 150 }), 0.42));
      beam.push(PC.accent(PC.line({ a: pt, b: [NODE[0].p[0], NODE[0].p[1], 0], perUnit: 150 }), 0.42));
    }
  }
  add(PC.merge.apply(null, glow));
  add(PC.merge.apply(null, beam));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.16, -0.38, 0],
    caption: 'An EUV scanner cut open on its optical plane. A tin droplet is flashed into plasma at the focus of the collector dish (bottom left); the 13.5 nm light, in copper, squeezes through the intermediate focus, folds off three illuminator mirrors, strikes the reticle held pattern-down at the top, and zigzags through six projection mirrors onto the wafer. Reticle and wafer are drawn about twice oversize.'
  };
});
