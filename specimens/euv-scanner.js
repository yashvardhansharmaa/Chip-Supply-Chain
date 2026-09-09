/* Specimen: an EUV lithography scanner, cut open on its optical plane.
 * The whole point of the drawing is the light path: tin plasma -> collector ->
 * illuminator -> reticle (overhead, accent) -> six projection mirrors -> wafer.
 * Units are metres. The machine is ~5.5 m wide and ~4.3 m tall, which is close
 * to the real NXE body; the reticle and wafer are drawn oversize so the ends of
 * the light path read at this scale.
 */
PC.register('euv-scanner', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function unit(v) { var L = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; return [v[0] / L, v[1] / L]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }

  // ---------- helpers ----------
  // A concave dish facing +Y with its vertex at the origin (optionally holed).
  function dish(r, sag, rIn, n, tn) {
    var Rc = (r * r + sag * sag) / (2 * sag);
    var tmax = Math.asin(Math.min(0.999, r / Rc));
    var c = PC.sphere({ r: Rc, thetaMax: tmax, n: n, tone: tn });
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

  // A mirror (dish + rim + mount cone) at 2-D point q with in-plane normal nv.
  function mirror(q, nv, r, o) {
    o = o || {};
    var sag = o.sag == null ? r * 0.13 : o.sag;
    var th = Math.atan2(-nv[0], nv[1]);
    var nf = o.n || Math.round(2600 * r * r + 380);
    var g = [dish(r, sag, o.rIn || 0, nf, o.tone == null ? 0.55 : o.tone)];
    g.push(PC.T(PC.circle({ r: r, perUnit: 620, tone: 1 }), { pos: [0, sag, 0] }));
    if (o.rIn) g.push(PC.T(PC.circle({ r: o.rIn, perUnit: 600, tone: 1 }), { pos: [0, 0.004, 0] }));
    if (o.mount !== false) {
      g.push(PC.cone({ r1: r * 0.46, r2: r * 0.94, h: r * 0.36, n: Math.round(1500 * r), tone: 0.3 }));
      g.push(PC.T(PC.circle({ r: r * 0.46, perUnit: 380, tone: 0.7 }), { pos: [0, -r * 0.18, 0] }));
    }
    var c = PC.merge.apply(null, g);
    if (o.mount !== false) c = PC.T(c, { pos: [0, -r * 0.18, 0] });
    return PC.T(c, { rot: [0, 0, th], pos: [q[0], q[1], 0] });
  }

  // Rectangle standing in the XY plane, centred on (cx, cy, cz).
  function panel(w, h, cx, cy, cz, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: [Math.PI / 2, 0, 0], pos: [cx, cy, cz] });
  }
  // Wire outline of that rectangle.
  function frame2(w, h, cx, cy, cz, per, tn) {
    return PC.T(PC.polyline({
      pts: [[-w / 2, 0, -h / 2], [w / 2, 0, -h / 2], [w / 2, 0, h / 2], [-w / 2, 0, h / 2]],
      closed: true, perUnit: per, tone: tn
    }), { rot: [Math.PI / 2, 0, 0], pos: [cx, cy, cz] });
  }
  // Cut a shell so only its far half survives (the machine is sectioned at z = 0).
  function section(c, zCut) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) { if (c[i + 2] > (zCut == null ? 0 : zCut)) continue; keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]); }
    return new Float32Array(keep);
  }

  // ---------- the light path ----------
  var PLASMA = [-2.35, -0.72];
  var COLL = [-3.02, -0.72];      // collector vertex
  var CR = 0.62, CSAG = 0.30, CHOLE = 0.085;

  var NODE = [
    { p: [-1.66, -0.72], kind: 'ap', h: 0.05 },      // intermediate focus
    { p: [-1.22, -1.02], kind: 'm', r: 0.24 },       // illuminator 1
    { p: [-1.35, 0.60], kind: 'm', r: 0.28 },        // illuminator 2
    { p: [-0.90, -0.15], kind: 'm', r: 0.26 },       // illuminator 3
    { p: [-0.25, 1.55], kind: 'ret', h: 0.15 },      // reticle, face down
    { p: [0.10, 0.635], kind: 'm', r: 0.30 },        // M1
    { p: [1.15, 0.95], kind: 'm', r: 0.32 },         // M2
    { p: [0.30, -0.25], kind: 'm', r: 0.28 },        // M3
    { p: [1.30, 0.05], kind: 'm', r: 0.28 },         // M4
    { p: [0.38, -1.05], kind: 'm', r: 0.24 },        // M5
    { p: [1.20, -0.70], kind: 'm', r: 0.34 },        // M6
    { p: [1.10, -1.60], kind: 'waf', h: 0.06 }       // wafer
  ];

  // normals and in-plane tangents at every node
  var i, n, t;
  for (i = 0; i < NODE.length; i++) {
    var q = NODE[i];
    if (q.kind === 'ret') { q.nv = [0, -1]; }
    else if (q.kind === 'waf') { q.nv = [0, 1]; }
    else if (i === 0) { q.nv = unit(sub(NODE[1].p, q.p)); }
    else {
      var a = unit(sub(NODE[i - 1].p, q.p)), b = unit(sub(NODE[i + 1].p, q.p));
      q.nv = unit([a[0] + b[0], a[1] + b[1]]);
    }
    q.tv = [-q.nv[1], q.nv[0]];
    q.hw = q.r ? q.r * 0.60 : q.h;
  }
  for (i = 1; i < NODE.length; i++) {
    if (NODE[i].tv[0] * NODE[i - 1].tv[0] + NODE[i].tv[1] * NODE[i - 1].tv[1] < 0) NODE[i].tv = [-NODE[i].tv[0], -NODE[i].tv[1]];
  }

  // ---------- source vessel ----------
  var vesR = 0.85, vesX0 = -3.32, vesX1 = -1.72, vesC = (vesX0 + vesX1) / 2;
  var ves = PC.T(PC.cylinder({ r: vesR, h: vesX1 - vesX0, caps: false, n: 8000, tone: 0.28 }), { rot: [0, 0, -Math.PI / 2], pos: [vesC, PLASMA[1], 0] });
  add(section(ves));
  // vessel end rings and the cone down to the intermediate focus
  add(PC.T(PC.circle({ r: vesR, perUnit: 240, tone: 0.85 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0, PLASMA[1], 0] }));
  add(PC.T(PC.circle({ r: vesR, perUnit: 240, tone: 0.85 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1, PLASMA[1], 0] }));
  add(section(PC.T(PC.cone({ r1: vesR, r2: 0.13, h: 0.34, n: 1800, tone: 0.32 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1 + 0.17, PLASMA[1], 0] })));
  add(PC.T(PC.circle({ r: 0.13, perUnit: 700, tone: 1 }), { rot: [0, 0, -Math.PI / 2], pos: [NODE[0].p[0], PLASMA[1], 0] }));
  add(PC.T(PC.disc({ r: vesR, rIn: 0.13, n: 1100, tone: 0.24 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 - 0.001, PLASMA[1], 0] }));
  // ribs on the vessel
  for (i = 1; i <= 3; i++) {
    add(section(PC.T(PC.circle({ r: vesR * 1.02, perUnit: 200, tone: 0.5 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 + i * (vesX1 - vesX0) / 4, PLASMA[1], 0] })));
  }

  // collector mirror + tin plasma + drive laser + droplets
  add(mirror(COLL, [1, 0], CR, { sag: CSAG, rIn: CHOLE, n: 3400, tone: 0.42, mount: false }));
  add(PC.T(PC.circle({ r: CR * 0.66, perUnit: 240, tone: 0.4 }), { rot: [0, 0, Math.PI / 2], pos: [COLL[0] + 0.075, COLL[1], 0] }));
  add(PC.accent(PC.T(PC.sphere({ r: 0.045, n: 700 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 1));
  add(PC.accent(PC.T(PC.sphere({ r: 0.10, n: 500 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 0.35));
  // CO2 drive laser coming in through the hole in the collector
  add(PC.accent(PC.line({ a: [-3.70, PLASMA[1], 0], b: [PLASMA[0] - 0.05, PLASMA[1], 0], perUnit: 200 }), 0.5));
  add(section(PC.T(PC.cylinder({ r: 0.11, h: 0.30, n: 900, tone: 0.4 }), { rot: [0, 0, -Math.PI / 2], pos: [-3.62, PLASMA[1], 0] })));
  add(PC.boxEdges({ w: 0.34, h: 0.40, d: 0.40, perUnit: 220, tone: 0.8 }));
  parts[parts.length - 1] = PC.T(parts[parts.length - 1], { pos: [-3.90, PLASMA[1], 0] });
  // tin droplets falling through the focus
  var drop = [];
  for (i = 0; i < 9; i++) drop.push(PC.T(PC.sphere({ r: 0.018, n: 60 }), { pos: [PLASMA[0], PLASMA[1] + 0.62 - i * 0.075, 0] }));
  add(PC.accent(PC.merge.apply(null, drop), 0.75));
  add(section(PC.T(PC.cylinder({ r: 0.055, h: 0.34, n: 700, tone: 0.45 }), { pos: [PLASMA[0], PLASMA[1] + 0.86, 0] })));
  add(PC.T(PC.cone({ r1: 0.13, r2: 0.05, h: 0.20, n: 700, tone: 0.4 }), { pos: [PLASMA[0], PLASMA[1] - 0.60, 0] }));

  // ---------- vacuum frames ----------
  // illuminator vessel
  add(PC.T(PC.boxEdges({ w: 1.30, h: 2.575, d: 1.10, perUnit: 190, tone: 0.85 }), { pos: [-1.10, 0.0125, 0] }));
  add(panel(1.30, 2.575, -1.10, 0.0125, -0.55, 3200, 0.14));
  // projection optics box
  add(PC.T(PC.boxEdges({ w: 2.20, h: 2.875, d: 1.30, perUnit: 190, tone: 0.9 }), { pos: [0.65, -0.1375, 0] }));
  add(panel(2.20, 2.875, 0.65, -0.1375, -0.65, 4400, 0.14));
  add(frame2(2.20, 0.02, 0.65, 0.70, -0.65, 170, 0.45));
  add(frame2(2.20, 0.02, 0.65, -0.90, -0.65, 170, 0.45));
  // reticle stage chamber, carried on top of both vessels
  add(PC.T(PC.boxEdges({ w: 1.60, h: 0.80, d: 0.95, perUnit: 210, tone: 0.9 }), { pos: [-0.25, 1.70, 0] }));
  add(panel(1.60, 0.80, -0.25, 1.70, -0.475, 1500, 0.14));
  // turbo pumps slung under the vessels
  var pumpAt = [[-2.30, -1.72], [-1.10, -1.42], [0.70, -1.72]];
  for (i = 0; i < pumpAt.length; i++) {
    add(PC.T(PC.cylinder({ r: 0.17, h: 0.30, n: 1100, tone: 0.32 }), { pos: [pumpAt[i][0], pumpAt[i][1], 0] }));
    add(PC.T(PC.circle({ r: 0.20, perUnit: 260, tone: 0.85 }), { pos: [pumpAt[i][0], pumpAt[i][1] + 0.15, 0] }));
    add(PC.T(PC.circle({ r: 0.17, perUnit: 220, tone: 0.7 }), { pos: [pumpAt[i][0], pumpAt[i][1] - 0.15, 0] }));
  }
  // machine base
  add(PC.T(PC.box({ w: 5.15, h: 0.22, d: 1.50, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 5200, tone: 0.26 }), { pos: [-0.85, -2.06, 0] }));
  add(PC.T(PC.boxEdges({ w: 5.15, h: 0.22, d: 1.50, perUnit: 190, tone: 0.9 }), { pos: [-0.85, -2.06, 0] }));
  for (i = 0; i < 4; i++) {
    var lx = -3.20 + i * 1.60;
    add(PC.T(PC.cylinder({ r: 0.09, h: 0.28, n: 450, tone: 0.4 }), { pos: [lx, -2.31, 0.55] }));
    add(PC.T(PC.cylinder({ r: 0.09, h: 0.28, n: 450, tone: 0.4 }), { pos: [lx, -2.31, -0.55] }));
  }

  // ---------- mirrors ----------
  for (i = 0; i < NODE.length; i++) if (NODE[i].kind === 'm') add(mirror(NODE[i].p, NODE[i].nv, NODE[i].r));

  // ---------- reticle and its stage ----------
  // The reticle is held pattern-down; a narrow clamp grips it so the copper
  // plate stays visible from above.
  var R = NODE[4].p, rw = 0.64, rd = 0.50;
  add(PC.T(PC.accent(PC.box({ w: rw, h: 0.04, d: rd, n: 3000, tone: 1 }), 0.65), { pos: [R[0], R[1] + 0.02, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: rw, h: 0.04, d: rd, perUnit: 620 }), 1), { pos: [R[0], R[1] + 0.02, 0] }));
  add(PC.T(PC.accent(PC.polyline({
    pts: [[-rw * 0.34, 0, -rd * 0.36], [rw * 0.34, 0, -rd * 0.36], [rw * 0.34, 0, rd * 0.36], [-rw * 0.34, 0, rd * 0.36]],
    closed: true, perUnit: 620
  }), 1), { pos: [R[0], R[1] + 0.042, 0] }));
  add(PC.T(PC.box({ w: rw * 0.52, h: 0.15, d: rd * 0.46, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1600, tone: 0.4 }), { pos: [R[0], R[1] + 0.115, 0] }));
  add(PC.T(PC.boxEdges({ w: rw * 0.52, h: 0.15, d: rd * 0.46, perUnit: 260, tone: 0.95 }), { pos: [R[0], R[1] + 0.115, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.40, h: 0.05, d: 0.06, n: 700, tone: 0.6 }), { pos: [R[0], R[1] + 0.22, i * 0.33] }));
    add(PC.T(PC.line({ a: [-0.70, 0, 0], b: [0.70, 0, 0], perUnit: 220, tone: 0.9 }), { pos: [R[0], R[1] + 0.246, i * 0.33] }));
  }

  // ---------- wafer stage ----------
  var W = NODE[11].p, wafR = 0.33;
  add(PC.T(PC.disc({ r: wafR, n: 700, tone: 0.3 }), { pos: [W[0], W[1], 0] }));
  add(PC.T(PC.circle({ r: wafR, perUnit: 380, tone: 1 }), { pos: [W[0], W[1] + 0.002, 0] }));
  add(PC.T(PC.circle({ r: wafR * 0.62, perUnit: 200, tone: 0.5 }), { pos: [W[0], W[1] + 0.003, 0] }));
  add(PC.T(PC.accent(PC.plane({ w: 0.10, d: 0.085, n: 700 }), 0.95), { pos: [W[0], W[1] + 0.008, 0] }));
  add(PC.T(PC.cylinder({ r: wafR * 0.9, h: 0.06, n: 900, tone: 0.24 }), { pos: [W[0], W[1] - 0.05, 0] }));
  add(PC.T(PC.box({ w: 1.02, h: 0.13, d: 0.80, faces: ['py', 'px', 'pz'], n: 1600, tone: 0.24 }), { pos: [W[0], W[1] - 0.145, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.02, h: 0.13, d: 0.80, perUnit: 150, tone: 0.9 }), { pos: [W[0], W[1] - 0.145, 0] }));
  // stage rails on the base
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.60, h: 0.045, d: 0.07, n: 420, tone: 0.45 }), { pos: [W[0] - 0.12, W[1] - 0.235, i * 0.30] }));
    add(PC.T(PC.line({ a: [-0.80, 0, 0], b: [0.80, 0, 0], perUnit: 180, tone: 0.85 }), { pos: [W[0] - 0.12, W[1] - 0.212, i * 0.30] }));
  }

  // ---------- the beam ----------
  // Rectangular light bundle: four corner rays, a stippled chief ray and a
  // faint copper haze filling the bundle so the path reads at a glance.
  var beam = [], glow = [];
  for (i = 0; i < NODE.length - 1; i++) {
    var A = NODE[i], B = NODE[i + 1];
    for (var s = -1; s <= 1; s += 2) for (var zs = -1; zs <= 1; zs += 2) {
      beam.push(PC.line({
        a: [A.p[0] + A.tv[0] * A.hw * s, A.p[1] + A.tv[1] * A.hw * s, zs * A.hw * 0.6],
        b: [B.p[0] + B.tv[0] * B.hw * s, B.p[1] + B.tv[1] * B.hw * s, zs * B.hw * 0.6],
        perUnit: 150, tone: 0.34
      }));
    }
    beam.push(PC.line({ a: [A.p[0], A.p[1], 0], b: [B.p[0], B.p[1], 0], perUnit: 130, tone: 0.5 }));
    var LL = Math.sqrt((B.p[0] - A.p[0]) * (B.p[0] - A.p[0]) + (B.p[1] - A.p[1]) * (B.p[1] - A.p[1]));
    var nf = Math.max(60, Math.round(LL * 620)), fill = new Float32Array(nf * 4);
    for (var q = 0; q < nf; q++) {
      var tt = PC.rnd(), ss = PC.rnd() * 2 - 1, zz = PC.rnd() * 2 - 1;
      var hx = A.tv[0] * A.hw * (1 - tt) + B.tv[0] * B.hw * tt, hy = A.tv[1] * A.hw * (1 - tt) + B.tv[1] * B.hw * tt;
      fill[q * 4] = A.p[0] + (B.p[0] - A.p[0]) * tt + hx * ss;
      fill[q * 4 + 1] = A.p[1] + (B.p[1] - A.p[1]) * tt + hy * ss;
      fill[q * 4 + 2] = (A.hw * (1 - tt) + B.hw * tt) * 0.6 * zz;
      fill[q * 4 + 3] = 2.16;
    }
    glow.push(fill);
  }
  add(PC.merge.apply(null, glow));
  // collector: a fan from the plasma out to the dish and back to the focus
  for (i = 0; i < 10; i++) {
    var ph = i * Math.PI * 2 / 10 + 0.2;
    for (var kk = 0; kk < 2; kk++) {
      var rr = kk ? 0.54 : 0.30;
      var sagr = CSAG * (rr / CR) * (rr / CR);
      var pt = [COLL[0] + sagr, COLL[1] + rr * Math.cos(ph), rr * Math.sin(ph)];
      beam.push(PC.line({ a: [PLASMA[0], PLASMA[1], 0], b: pt, perUnit: 130, tone: 0.3 }));
      beam.push(PC.line({ a: pt, b: [NODE[0].p[0], NODE[0].p[1], 0], perUnit: 130, tone: 0.3 }));
    }
  }
  add(PC.merge.apply(null, beam));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.15, -0.35, 0],
    caption: 'An EUV scanner cut open on its optical plane: a tin droplet is vaporised by a laser (copper) at the focus of the collector dish, the beam folds through the illuminator, reflects off the reticle held face-down at the top (copper), zigzags through six projection mirrors and lands on the wafer at bottom right.'
  };
});
