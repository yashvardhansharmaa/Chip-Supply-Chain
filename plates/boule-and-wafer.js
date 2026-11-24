/* =====================================================================================================
   02 Silicon: the ingot and two wafers, in metres. The wafers slide out sideways from where they were sawn from the body.
   True sizes: the body and the wafers 300 mm across (the chapter's 300 mm wafers), each wafer 775 micrometres thick (SEMI M1,
   the standard for polished 300 mm wafers; 22 Nov 2026 review: they were drawn 4 mm thick under "Drawn to scale").
   The length, the crown, the tail, the seed and the neck have no allowed source for their sizes, so they are drawn for
   illustration and carry no figures (the caption says so; the 2.1 m dimension is gone). Colours (the set's legend,
   22 Nov 2026): the wafers in silicon slate, as on every plate.
   22 Nov 2026 expert review: silicon is slate across the set, so the ingot is drawn in the wafers' slate, and with it the
   neck and the seed, which are the same silicon crystal (they were gray, as if another material). The notch is drawn for
   illustration too, and the caption says so.
   22 Nov 2026 plates refine: the ingot is bulk silicon seen whole, so it is drawn near white with a cool tint and an ink
   silhouette, with the heavy ring of the ground band back at the crown's join; the wafers, cut faces of the crystal, are solid
   slate with ink rims, at their true thickness. The saw cuts are at about the middle of the body, so the wafers balance it
   (they were near its foot). No length figure (none is sourced), and no 775 um dimension (chapter 2's text does not give it).
   Round two (expert FIX-2): the ingot, the neck and the seed are one crystal with the wafers, so they are drawn in the wafers'
   slate again; under the refined renderer (a colour keeps itself on top faces, ink outlines) the slate body reads crisp, where
   it read washed out under the old one. params.ingot 'white' draws the near-white body instead (an image only, to compare).
   The Wafers label stands 40 px higher (dy), so its leaders run clear of the second wafer. */
R('boule-and-wafer', function (m, params) {
  var Rb = 0.15, wT = 0.000775 / 2, yTip = -0.71, yB0 = -0.45, yB1 = 1.05, Rc = Rb * 1.03;
  var ing = m.part('ingot', { ex: [0, 0, 0], seq: 0 });
  m.real('siIngot');
  // the crystal's slate: the wafers' tone, on a turned surface
  var white = params && params.ingot === 'white', SI = white ? { d: 0.08, c: 'acc', curve: true } : 'accTurned', SI_FLAT = white ? 'accLight' : 'acc';
  var prof = [[0, yTip], [0.038, yTip], [0.078, yTip + 0.045, 0], [0.110, yTip + 0.095, 0], [0.133, yTip + 0.16, 0], [0.146, yTip + 0.215, 0], [Rb, yB0]];
  // growth striations on the ground body, as fine rings, and the two saw cuts the wafers came from
  var cuts = [0.22, 0.28];
  prof.push([Rb, yB1]); prof.push([Rc, yB1]); prof.push([Rc, yB1 + 0.018]);
  [[0.992, 1.105], [0.972, 1.145], [0.936, 1.185], [0.880, 1.225], [0.800, 1.265], [0.690, 1.303], [0.545, 1.338], [0.370, 1.368], [0.185, 1.390]].forEach(function (q) { prof.push([Rc * q[0], q[1], 0]); });
  prof.push([0, 1.40]);
  // the ingot, the neck and the seed are solids of their own, so each lights alone when its part is pointed at
  m.tag('ingot');
  // (lip: the ring where the crown's ground band stands proud of the body keeps its shade weight)
  // (round 2: crown and tail resampled along a smooth curve, so their tone runs smoothly)
  prof = (function (p) {
    var out = [p[0]], cr = function (a, b, c, d, t) { var t2 = t * t, t3 = t2 * t; return [0, 1].map(function (i) { return 0.5 * (2 * b[i] + (-a[i] + c[i]) * t + (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * t2 + (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * t3); }); };
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], smooth = b[2] === 0 && a[2] !== 1 && i > 1;
      if (smooth) { var pa = p[i - 2], pb = p[i + 1] || b; for (var s = 1; s < 4; s++) { var q = cr(pa, a, b, pb, s / 4); out.push([q[0], q[1], 0]); } }
      out.push(b);
    }
    return out;
  })(prof);
  m.revolve(prof, SI, { seg: 96, lip: true });
  // (four faint growth ridges along the body)
  [0.3, 1.87, 3.44, 5.01].forEach(function (an) { m.wire([[Rb * 1.002 * Math.cos(an), yB0 + 0.03, Rb * 1.002 * Math.sin(an)], [Rb * 1.002 * Math.cos(an), yB1 - 0.03, Rb * 1.002 * Math.sin(an)]], { lw: 0.6, alpha: 0.4, real: 'siIngot' }); });
  m.tag('neck');
  m.cyl([0, 1.465, 0], 0.0052, 0.13, SI, { seg: 12 });
  // the saw cuts: the slab the wafers came from, dashed round the body
  m.tag('ingot');
  cuts.forEach(function (cy) { m.wire(H.ring(0, cy, 0, Rb * 1.004, 48), { lw: 0.6, dash: [3, 2], alpha: 0.85, c: [0, cy, 0.2] }); });
  m.tag('seed');
  m.box({ c: [0, 1.565, 0], s: [0.015, 0.07, 0.015] }, SI_FLAT);
  m.tag(null);
  m.real('steelDk');
  m.cyl([0, 1.6225, 0], 0.026, 0.045, 'turnedDark', { seg: 20 });
  m.anchor(1, 'Seed', [0, 1.565, 0]); m.anchor(2, 'Neck', [0, 1.465, 0]); m.anchor(3, 'Ingot', [-0.05, 0.62, Rb * 0.8]);
  // the two wafers, as thick as they are, each with its notch
  function waferShape() { var s = []; for (var k = 0; k < 64; k++) { var a = k * TAU / 64; if (k === 16) { s.push([0.009, Rb * 0.998]); s.push([0, Rb - 0.01]); s.push([-0.009, Rb * 0.998]); continue; } s.push([Rb * Math.cos(a), Rb * Math.sin(a)]); } return s; }
  var ws = waferShape();
  var w1 = m.part('wafer1', { ex: [0.40, 0, 0], seq: 1 });
  m.real('siWafer');
  m.prism(ws, cuts[0] - wT, cuts[0] + wT, 'acc', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[0] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  var w2 = m.part('wafer2', { ex: [0.80, 0, 0], seq: 2 });
  m.prism(ws, cuts[1] - wT, cuts[1] + wT, 'acc', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[1] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  m.anchor(4, 'Wafers', [[0.40, cuts[0], 0.0], [0.80, cuts[1], 0.0]], null);
  m.anchors[3].part = w1.idx; m.anchors[3].at = [[0, cuts[0] + wT, Rb * 0.5]]; m.anchors[3].multi = [[w2.idx, [0, cuts[1] + wT, Rb * 0.5]]];
  m.guide([[0, cuts[0], 0, ing.idx], [0, cuts[0], 0, w1.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[1], 0, ing.idx], [0, cuts[1], 0, w2.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[0], Rb, ing.idx], [0, cuts[0], Rb, w1.idx]], { alpha: 0.8 });
  m.guide([[0, cuts[1], -Rb, ing.idx], [0, cuts[1], -Rb, w2.idx]], { alpha: 0.8 });
  // review: the diameter is taken rim to rim across the wafer's centre (it was taken off the corners of the square round
  // the wafer, so its extension lines started in the air beside the disc)
  m.dim([-Rb, cuts[1] - wT, 0], [Rb, cuts[1] - wT, 0], [0, -0.1, 0], '300 mm', { part: w2.idx });
  return { noGround: true, elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [1, 0, 0], calloutOpts: { 1: { tag: 'seed' }, 2: { tag: 'neck' }, 3: { tag: 'ingot' }, 4: { dy: -40 } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
