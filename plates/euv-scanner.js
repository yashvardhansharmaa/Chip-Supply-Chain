/* =====================================================================================================
   04 Lithography: an EUV scanner cut open on its optical plane, in metres. The source, the reticle stage, the
   projection optics and the wafer stage are drawn pulled a little apart along the light path; the 13.5 nm light,
   blue-violet, runs on through every gap. Reticle and wafer drawn about twice their size, as the caption says. */
R('euv-scanner', function (m) {
  function unit(v) { var L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
  var PLASMA = [-1.14, -1.34], COLL = [-1.80, -1.34];
  var NODE = [
    { p: [-0.56, -1.34], k: 'ap' }, { p: [-0.24, -0.82], k: 'm', r: 0.20 }, { p: [-0.98, -0.10], k: 'm', r: 0.30, fc: 1 }, { p: [-0.26, 0.66], k: 'm', r: 0.27, fc: 1 },
    { p: [0.06, 1.68], k: 'ret' }, { p: [0.54, 1.02], k: 'm', r: 0.29 }, { p: [1.22, 0.60], k: 'm', r: 0.23 }, { p: [0.47, 0.20], k: 'm', r: 0.21 },
    { p: [1.19, -0.18], k: 'm', r: 0.25 }, { p: [0.41, -0.58], k: 'm', r: 0.19 }, { p: [1.06, -0.98], k: 'm', r: 0.38 }, { p: [0.44, -1.74], k: 'waf' }];
  NODE.forEach(function (q, i) {
    if (q.k === 'ret') q.nv = [0, -1]; else if (q.k === 'waf') q.nv = [0, 1]; else if (i === 0) q.nv = unit([NODE[1].p[0] - q.p[0], NODE[1].p[1] - q.p[1]]);
    else { var a = unit([NODE[i - 1].p[0] - q.p[0], NODE[i - 1].p[1] - q.p[1]]), b = unit([NODE[i + 1].p[0] - q.p[0], NODE[i + 1].p[1] - q.p[1]]); q.nv = unit([a[0] + b[0], a[1] + b[1]]); }
  });
  // a mirror: a thick disc with a dished face, its axis along nv, in the plane z = 0
  function mirror(q, nv, r, mat, o) {
    o = o || {};
    var sag = r * 0.14, t = r * 0.24, prof = [[o.rIn || 0, -t], [r, -t], [r, sag, 1]];
    for (var k = 5; k >= 0; k--) { var rr = (o.rIn || 0) + (r - (o.rIn || 0)) * k / 6; prof.push([rr, sag * (rr / r) * (rr / r), 0]); }
    var th = Math.atan2(-nv[0], nv[1]);
    return m.revolve(prof, mat || 'turnedDark', { seg: 28, rot: [0, 0, th], pos: [q[0], q[1], 0], sortFaces: true });
  }
  // a module's housing cut open on the optical plane (z = 0): back wall, floor, roof and side walls, cut edges hatched
  function housing(cx, cy, w, h, d, t) {
    var cutF = { pz: 'cut' };
    m.box({ c: [cx, cy, -d + t / 2], s: [w, h, t] }, 'paper');
    m.box({ c: [cx, cy - h / 2 + t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx, cy + h / 2 - t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx - w / 2 + t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
    m.box({ c: [cx + w / 2 - t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
  }
  var src = m.part('source', { ex: [-0.5, 0, 0], seq: 0 });
  var vesR = 0.66, vx0 = -1.94, vx1 = -0.72, vc = (vx0 + vx1) / 2;
  // the vessel, cut on the optical plane (z = 0) with the far half kept, as the other modules are (its cone to the focus
  // is left out: drawn as a half shell it read as a loose blade under the illuminator)
  m.revolve([[0.62, -0.61], [vesR, -0.61], [vesR, 0.61], [0.62, 0.61]], 'turned', { seg: 40, a0: Math.PI, a1: Math.PI * 2, rot: [0, 0, -Math.PI / 2], pos: [vc, PLASMA[1], 0], cut: 'cut', sortFaces: true });
  mirror(COLL, [1, 0], 0.56, 'turned', { rIn: 0.075 });
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 4.2, col: 'acc2', alpha: 0.35 });
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 2.2, col: 'acc2', alpha: 1 });
  m.cyl([PLASMA[0], PLASMA[1] + 0.72, 0], 0.05, 0.30, 'turnedDark', { seg: 20 });
  var drops = []; for (var i = 0; i < 7; i++) drops.push([PLASMA[0], PLASMA[1] + 0.52 - i * 0.07, 0]);
  m.dots(drops, { r: 1.3, alpha: 0.9 });
  m.wire([[-2.14, PLASMA[1], 0], [PLASMA[0] - 0.05, PLASMA[1], 0]], { lw: 0.8, dash: [5, 3], alpha: 0.8 });
  m.box({ c: [-2.02, PLASMA[1], 0], s: [0.26, 0.30, 0.30] }, 'mid');
  m.anchor(1, 'Light source', [PLASMA[0], PLASMA[1], 0]);
  // illuminator: vessel and three mirrors (two faceted)
  var ill = m.part('illuminator', { ex: [0, 0, 0], seq: 1 });
  housing(-0.57, 0.10, 1.52, 2.76, 0.575, 0.05);
  [1, 2, 3].forEach(function (k) { var s = mirror(NODE[k].p, NODE[k].nv, NODE[k].r); if (NODE[k].fc) { /* facets drawn as fine rings */ } });
  // the reticle stage on top
  var ret = m.part('reticle', { ex: [0, 0.42, 0], seq: 3 });
  var Rp = NODE[4].p;
  m.box({ c: [Rp[0], Rp[1] + 0.023, 0], s: [0.62, 0.05, 0.50], decals: { ny: [D.rect(-0.62 * 0.33, -0.21, 0.62 * 0.33, 0.21, -0.025, { lw: 0.5 })] } }, 'acc2Light');
  m.box({ c: [Rp[0], Rp[1] + 0.088, 0], s: [0.67, 0.085, 0.54] }, 'mid');
  [-1, 1].forEach(function (s) { m.box({ c: [Rp[0], Rp[1] + 0.155, s * 0.32], s: [1.62, 0.045, 0.055] }, 'dark'); });
  m.anchor(3, 'Mask', [Rp[0], Rp[1], 0]);
  // the projection optics: six mirrors in their box
  var pob = m.part('optics', { ex: [0.46, 0, 0], seq: 2 });
  housing(0.92, -0.06, 1.46, 3.14, 0.61, 0.05);
  for (var k = 5; k <= 10; k++) mirror(NODE[k].p, NODE[k].nv, NODE[k].r);
  m.anchor(2, 'Mirrors', [[1.22, 0.6, 0], [1.06, -0.98, 0]]);
  // the wafer stage and the base frame
  // review: 'stack' paints the stage block before the chucks and wafers on it; sorted by depth, the block was painted
  // last and hid the wafer the light lands on, so the beam and the Wafer label ended on bare metal
  var waf = m.part('wafer', { ex: [0, -0.36, 0], seq: 4, mode: 'stack' });
  var Wp = NODE[11].p;
  [0, 0.78].forEach(function (dx, j) {
    m.cyl([Wp[0] + dx, Wp[1] - 0.042, 0], 0.235 * 1.08, 0.075, 'turnedDark', { seg: 32 });
    m.cyl([Wp[0] + dx, Wp[1] + 0.003, 0], 0.235, 0.012, j ? 'turned' : 'acc2Light', { seg: 32, top: j ? [] : [D.rect(-0.041, -0.033, 0.041, 0.033, 0.006, { fill: 'acc', lw: 0.6, col: 'acc' })] });
  });
  m.box({ c: [Wp[0] + 0.39, Wp[1] - 0.135, 0], s: [1.66, 0.10, 0.66] }, 'mid');
  m.anchor(4, 'Wafer', [Wp[0], Wp[1] + 0.01, 0]);
  var base = m.part('base', { ex: [0, -0.62, 0], seq: 5, pri: -1 });
  m.box({ c: [-0.16, -2.16, 0], s: [3.66, 0.20, 1.36] }, 'steel');
  for (i = 0; i < 4; i++) { var lx = -0.16 - 1.83 + 0.36 + i * (3.66 - 0.72) / 3; [0.5, -0.5].forEach(function (z) { m.cyl([lx, -2.38, z], 0.085, 0.24, 'turnedDark', { seg: 16 }); }); }
  // the light: through each module, attached to the part it is in at each end
  var partOf = [src.idx, ill.idx, ill.idx, ill.idx, ret.idx, pob.idx, pob.idx, pob.idx, pob.idx, pob.idx, pob.idx, waf.idx];
  var pts = [[PLASMA[0], PLASMA[1], 0, src.idx]].concat(NODE.map(function (q, i) { return [q.p[0], q.p[1], 0, partOf[i]]; }));
  m.guide(pts, { style: 'beam', col: 'acc', lw: 1.5 });
  // the collector's cone of light, from its rim to the plasma and on to the focus
  [0.27, -0.27, 0.5, -0.5].forEach(function (rr) { m.guide([[COLL[0] + 0.28 * (rr / 0.56) * (rr / 0.56), PLASMA[1] + rr, 0, src.idx], [NODE[0].p[0], NODE[0].p[1], 0, src.idx]], { style: 'beam', col: 'acc', lw: 0.7, alpha: 0.55 }); });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [107, 127, 209], accentDark: [167, 180, 245], accent2: [154, 126, 224], accent2Dark: [220, 208, 255] };
});
