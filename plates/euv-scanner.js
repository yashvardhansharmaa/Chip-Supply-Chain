/* =====================================================================================================
   04 Lithography: an EUV scanner cut open on its optical plane, in metres, its layout simplified (the caption says so). The
   source pulls left along its own beam, the reticle stage lifts and the wafer stage drops along theirs; the illuminator and
   the projection optics stand side by side. The 13.5 nm light runs on through every gap.
   22 Nov 2026 review, made true at rest (the plate rests exploded, so every node is placed and every mirror aimed in the rest
   positions, REST below):
   - the light meets the mask and leaves it at the same angle, 6 degrees from the mask's normal, the chief-ray angle of a
     0.33-NA, 4x scanner (Lawrence Berkeley National Laboratory, "Upgrade to the SHARP EUV mask microscope", SPIE 10957,
     26 Mar 2019, escholarship.org/uc/item/9vh7g4rm: the SHARP zoneplates match the scanners' chief-ray angle, 6 degrees). It
     was 17 degrees in and 36 out, then 5.4 degrees, the angle the imec and PTB paper (arxiv.org/abs/1912.09075) uses for a
     0.55-NA, High-NA scanner (22 Nov 2026 expert review);
   - the mask and the wafer are both drawn at twice their size (the caption says they are drawn large, since the machine
     they are measured against is itself simplified): the mask 152.4 mm square and 6.35 mm thick
     (Hoya's US patent 9,494,851), the wafer 300 mm across and 775 micrometres thick (SEMI M1); they were 4x and 1.6x;
   - the last mirror sits straight over the wafer, so the wafer stage drops along its beam.
   Colours (the set's legend): the light in the beam hue, the wafer in silicon slate (acc2), as on every plate.
   22 Nov 2026 plates refine: the illuminator and the projection optics stand apart again, so they read as two modules (they
   stood wall to wall). Round two: the two mirrors either side of the mask (0.08 m) stand lower in their boxes, so the light
   still meets the mask and leaves it at 6 degrees; NODE gives the rest positions. Round two fix (expert review): EUV light
   crosses no solid (chapter 4, air and glass absorb it), so the boxes' inner walls stand 0.12 m apart between their outer
   faces, each inner face clear of the 6 degree leg, which leaves its box through the roof at x = 0.19 -/+ 0.124 m, as before
   (at 0.24 m apart both legs ran 0.43 m inside the walls). The light takes the deeper beam hue plate 07 takes. */
R('euv-scanner', function (m) {
  function unit(v) { var L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
  var X2 = 2, MASK = 0.1524 * X2, MASKT = 0.00635 * X2, WR = 0.15 * X2, WT = 0.000775 * X2;
  // how far each module stands from its assembled place at rest
  var EXS = { src: [-0.5, 0], ill: [0, 0], ret: [0, 0.30], pob: [0, 0], waf: [0, -0.36] };
  var PLASMA = [-1.14, -1.34], COLL = [-1.80, -1.34];
  // the mask stands over the seam between the illuminator and the projection optics; the illuminator's last mirror and the
  // optics' first stand level with each other, either side of it, so the light comes in and goes out at the same angle
  // (round two: the two mirrors either side of the mask stand lower, at YS -0.49, so at 6 degrees they sit 0.26 m either side of
  // the seam, inside their boxes; the boxes' inner walls stand GAP apart, their inner faces 0.014 m clear of the legs where the
  // legs leave through the roofs; the optics' second mirror moves up to (0.70, -0.10) so the first leg passes it)
  var XM = 0.19, YM = 1.68, YS = -0.49, CRA = 6 * Math.PI / 180, DX = (YM + EXS.ret[1] - YS) * Math.tan(CRA), GAP = 0.12;
  var NODE = [
    { p: [-0.56, -1.34], k: 'ap', o: 'ill' }, { p: [-0.24, -0.82], k: 'm', r: 0.20, o: 'ill' }, { p: [-0.98, -0.10], k: 'm', r: 0.30, o: 'ill' }, { p: [XM - DX, YS], k: 'm', r: 0.08, o: 'ill' },
    { p: [XM, YM], k: 'ret', o: 'ret' },
    { p: [XM + DX, YS], k: 'm', r: 0.08, o: 'pob' }, { p: [1.30, 0.05], k: 'm', r: 0.24, o: 'pob' }, { p: [0.70, -0.10], k: 'm', r: 0.20, o: 'pob' },
    { p: [1.32, -0.62], k: 'm', r: 0.23, o: 'pob' }, { p: [0.66, -0.92], k: 'm', r: 0.18, o: 'pob' }, { p: [1.12, -1.18], k: 'm', r: 0.26, o: 'pob' },
    { p: [1.12, -1.74], k: 'waf', o: 'waf' }];
  // (the illuminator's and the optics' nodes are given where they stand at rest; the mask's and the wafer's where they stand
  // assembled; AT is where a node is built in its own part)
  var ATREST = { ill: 1, pob: 1 };
  var REST = function (q) { var e = EXS[q.o]; return ATREST[q.o] ? q.p : [q.p[0] + e[0], q.p[1] + e[1]]; };
  var AT = function (q) { var e = EXS[q.o]; return ATREST[q.o] ? [q.p[0] - e[0], q.p[1] - e[1]] : q.p; };
  NODE.forEach(function (q, i) {
    if (q.k === 'ret') q.nv = [0, -1]; else if (q.k === 'waf') q.nv = [0, 1]; else if (i === 0) q.nv = unit([REST(NODE[1])[0] - REST(q)[0], REST(NODE[1])[1] - REST(q)[1]]);
    else { var r0 = REST(q), a = unit([REST(NODE[i - 1])[0] - r0[0], REST(NODE[i - 1])[1] - r0[1]]), b = unit([REST(NODE[i + 1])[0] - r0[0], REST(NODE[i + 1])[1] - r0[1]]); q.nv = unit([a[0] + b[0], a[1] + b[1]]); }
  });
  // a mirror: a thick disc with a dished face, its axis along nv, in the plane z = 0
  function mirror(q, nv, r, mat, o) {
    o = o || {};
    var sag = r * 0.14, t = r * 0.24, prof = [[o.rIn || 0, -t], [r, -t], [r, sag, 1]];
    for (var k = 5; k >= 0; k--) { var rr = (o.rIn || 0) + (r - (o.rIn || 0)) * k / 6; prof.push([rr, sag * (rr / r) * (rr / r), 0]); }
    var th = Math.atan2(-nv[0], nv[1]);
    // the illuminator's and the projection optics' mirrors carry one tag, so Mirrors lights all of them (the collector is the source's)
    if (!o.notag) m.tag('mirror');
    var sv = m.revolve(prof, mat || 'turnedDark', { seg: 28, rot: [0, 0, th], pos: [q[0], q[1], 0], sortFaces: true, real: 'glassBody', capMat: { d: 0.32, real: 'mlm' } });
    m.tag(null);
    return sv;
  }
  // a module's housing cut open on the optical plane (z = 0): back wall, floor, roof and side walls, cut edges hatched
  function housing(cx, cy, w, h, d, t) {
    var cutF = { pz: 'cut' };
    m.real('vac');
    m.box({ c: [cx, cy, -d + t / 2], s: [w, h, t], real: 'vacIn', inner: true }, 'paper');
    m.box({ c: [cx, cy - h / 2 + t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx, cy + h / 2 - t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx - w / 2 + t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
    m.box({ c: [cx + w / 2 - t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
  }
  var src = m.part('source', { ex: [EXS.src[0], EXS.src[1], 0], seq: 0 });
  var vesR = 0.66, vx0 = -1.94, vx1 = -0.72, vc = (vx0 + vx1) / 2;
  m.real('vac');
  // the vessel, cut on the optical plane (z = 0) with the far half kept, as the other modules are
  m.revolve([[0.62, -0.61], [vesR, -0.61], [vesR, 0.61], [0.62, 0.61]], 'turned', { seg: 40, a0: Math.PI, a1: Math.PI * 2, rot: [0, 0, -Math.PI / 2], pos: [vc, PLASMA[1], 0], cut: 'cut', sortFaces: true });
  mirror(COLL, [1, 0], 0.56, 'turned', { rIn: 0.075, notag: true });
  // the tin plasma, in the light's own hue: it is where the light is made
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 4.2, col: 'acc', alpha: 0.35 });
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 2.2, col: 'acc', alpha: 1 });
  m.real('steelDk');
  m.cyl([PLASMA[0], PLASMA[1] + 0.72, 0], 0.05, 0.30, 'turnedDark', { seg: 20 });
  var drops = []; for (var i = 0; i < 7; i++) drops.push([PLASMA[0], PLASMA[1] + 0.52 - i * 0.07, 0]);
  m.dots(drops, { r: 1.3, alpha: 0.9, real: 'sac' });
  m.wire([[-2.14, PLASMA[1], 0], [PLASMA[0] - 0.05, PLASMA[1], 0]], { lw: 0.8, dash: [5, 3], alpha: 0.8 });
  m.real('steelDk');
  m.box({ c: [-2.02, PLASMA[1], 0], s: [0.26, 0.30, 0.30] }, 'mid');
  m.anchor(1, 'Light source', [PLASMA[0], PLASMA[1], 0]);
  // illuminator: its housing, cut open, and three mirrors; its roof stops short of the mask, so the light crosses open air
  var ill = m.part('illuminator', { ex: [0, 0, 0], seq: 1 });
  // (its inner wall stands GAP / 2 off the seam under the mask)
  housing((-1.33 + XM - GAP / 2) / 2, -0.24, XM - GAP / 2 + 1.33, 2.08, 0.575, 0.05);
  [1, 2, 3].forEach(function (k) { mirror(AT(NODE[k]), NODE[k].nv, NODE[k].r); });
  // the reticle stage on top, the mask hanging pattern-down beneath it
  var ret = m.part('reticle', { ex: [EXS.ret[0], EXS.ret[1], 0], seq: 3 });
  var Rp = NODE[4].p;
  m.real('glass');
  m.box({ c: [Rp[0], Rp[1] + MASKT / 2, 0], s: [MASK, MASKT, MASK], decals: { ny: [D.rect(-MASK * 0.34, -MASK * 0.27, MASK * 0.34, MASK * 0.27, -MASKT / 2, { lw: 0.5 })] } }, 'light');
  m.real('granite');
  m.box({ c: [Rp[0], Rp[1] + MASKT + 0.035, 0], s: [MASK + 0.08, 0.07, MASK + 0.06] }, 'mid');
  m.real('steelDk');
  [-1, 1].forEach(function (s) { m.box({ c: [Rp[0], Rp[1] + MASKT + 0.095, s * (MASK / 2 + 0.06)], s: [1.30, 0.045, 0.055] }, 'dark'); });
  m.anchor(3, 'Mask', [Rp[0] - MASK * 0.3, Rp[1], 0]);
  // the projection optics: six mirrors in their box
  var pob = m.part('optics', { ex: [EXS.pob[0], EXS.pob[1], 0], seq: 2 });
  housing((XM + GAP / 2 + 1.65) / 2, -0.415, 1.65 - XM - GAP / 2, 2.43, 0.61, 0.05);
  for (var k = 5; k <= 10; k++) mirror(AT(NODE[k]), NODE[k].nv, NODE[k].r);
  m.anchor(2, 'Mirrors', [[AT(NODE[6])[0], AT(NODE[6])[1], NODE[6].r * 0.8], [AT(NODE[8])[0], AT(NODE[8])[1], NODE[8].r * 0.8]]);  // on the near rims of the two right-hand mirrors
  // the wafer stage and the base frame: two wafer tables side by side, the light landing on the right-hand one
  // review: 'stack' paints the stage block before the chucks and wafers on it
  var waf = m.part('wafer', { ex: [EXS.waf[0], EXS.waf[1], 0], seq: 4, mode: 'stack' });
  var Wp = NODE[11].p;
  [0, -0.78].forEach(function (dx, j) {
    m.real('granite');
    m.cyl([Wp[0] + dx, Wp[1] - 0.042 - WT / 2, 0], WR * 1.08, 0.075, 'turnedDark', { seg: 32 });
    m.real('siProc');
    if (!j) m.tag('wafer');
    m.cyl([Wp[0] + dx, Wp[1] - WT / 2, 0], WR, WT, 'acc2Light', { seg: 32, top: (function () { var gd = []; for (var gx = -5; gx <= 5; gx++) for (var gz = -5; gz <= 5; gz++) { var ux = gx * 0.052, uz = gz * 0.066; if (Math.abs(ux) + 0.026 > WR * 0.92 || ux * ux + uz * uz > WR * WR * 0.78) continue; gd.push(D.rect(ux - 0.025, uz - 0.032, ux + 0.025, uz + 0.032, WT / 2, { lw: 0.3, alpha: 0.45, fill: 'steel', sheen: 0.1 })); } return gd; })().concat(j ? [] : [D.rect(-0.026, -0.033, 0.026, 0.033, WT / 2, { fill: 'acc', lw: 0.6, col: 'acc', diagram: true })]) });
    m.tag(null);
  });
  m.real('steelDk');
  m.box({ c: [Wp[0] - 0.39, Wp[1] - 0.135, 0], s: [1.66, 0.10, 0.66] }, 'mid');
  m.anchor(4, 'Wafer', [Wp[0] - WR * 0.5, Wp[1], 0]);
  var base = m.part('base', { ex: [0, -0.62, 0], seq: 5, pri: -1 });
  m.real('paint');
  m.box({ c: [-0.16, -2.16, 0], s: [3.66, 0.20, 1.36] }, 'steel');
  for (i = 0; i < 4; i++) { var lx = -0.16 - 1.83 + 0.36 + i * (3.66 - 0.72) / 3; [0.5, -0.5].forEach(function (z) { m.cyl([lx, -2.38, z], 0.085, 0.24, 'turnedDark', { seg: 16, real: 'steelDk' }); }); }
  void base;
  // the light: through each module, attached to the part it is in at each end
  var idx = { ill: ill.idx, ret: ret.idx, pob: pob.idx, waf: waf.idx };
  var pts = [[PLASMA[0], PLASMA[1], 0, src.idx]].concat(NODE.map(function (q) { var a = AT(q); return [a[0], a[1], 0, idx[q.o]]; }));
  m.guide(pts, { style: 'beam', col: 'acc', lw: 1.4, knockDark: true });
  // the collector's cone of light, from its rim to the plasma and on to the focus
  [0.27, -0.27, 0.5, -0.5].forEach(function (rr) { m.guide([[COLL[0] + 0.28 * (rr / 0.56) * (rr / 0.56), PLASMA[1] + rr, 0, src.idx], [NODE[0].p[0], NODE[0].p[1], 0, src.idx]], { style: 'beam', col: 'acc', lw: 0.7, alpha: 0.55 }); });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, calloutOpts: { 2: { tag: 'mirror' }, 4: { tag: 'wafer' } }, accent: [78, 96, 186], accentDark: [154, 166, 255], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});
