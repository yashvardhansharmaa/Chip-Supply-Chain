/* =====================================================================================================
   02 Silicon: the ingot and two wafers, to scale, in metres. The wafers slide out sideways from where they were sawn
   from the body. Body 300 mm across; tail tip to crown tip about 2.1 m; neck about 10 mm across. */
R('boule-and-wafer', function (m) {
  var Rb = 0.15, yTip = -0.71, yB0 = -0.45, yB1 = 1.05, Rc = Rb * 1.03;
  var ing = m.part('ingot', { ex: [0, 0, 0], seq: 0 });
  var prof = [[0, yTip], [0.038, yTip], [0.078, yTip + 0.045, 0], [0.110, yTip + 0.095, 0], [0.133, yTip + 0.16, 0], [0.146, yTip + 0.215, 0], [Rb, yB0]];
  // growth striations on the ground body, as fine rings, and the two saw cuts the wafers came from
  var cuts = [-0.30, -0.24];
  prof.push([Rb, yB1]); prof.push([Rc, yB1]); prof.push([Rc, yB1 + 0.018]);
  [[0.992, 1.105], [0.972, 1.145], [0.936, 1.185], [0.880, 1.225], [0.800, 1.265], [0.690, 1.303], [0.545, 1.338], [0.370, 1.368], [0.185, 1.390]].forEach(function (q) { prof.push([Rc * q[0], q[1], 0]); });
  prof.push([0.0052, 1.40]); prof.push([0.0052, 1.53]); prof.push([0, 1.53]);
  m.revolve(prof, 'turned', { seg: 48 });
  // the saw cuts: the slab the wafers came from, dashed round the body
  cuts.forEach(function (cy) { m.wire(H.ring(0, cy, 0, Rb * 1.004, 48), { lw: 0.6, dash: [3, 2], alpha: 0.85, c: [0, cy, 0.2] }); });
  m.box({ c: [0, 1.565, 0], s: [0.015, 0.07, 0.015] }, 'mid');
  m.cyl([0, 1.6225, 0], 0.026, 0.045, 'turnedDark', { seg: 20 });
  m.dim([-Rb, yTip, 0], [-Rb, 1.40, 0], [-0.16, 0, 0], '2.1 m');
  m.anchor(1, 'Seed', [0, 1.565, 0]); m.anchor(2, 'Neck', [0, 1.465, 0]); m.anchor(3, 'Ingot', [-0.05, 0.3, Rb * 0.8]);
  // the two wafers, as thick as they are, each with its notch
  function waferShape() { var s = []; for (var k = 0; k < 64; k++) { var a = k * TAU / 64; if (k === 16) { s.push([0.009, Rb * 0.998]); s.push([0, Rb - 0.01]); s.push([-0.009, Rb * 0.998]); continue; } s.push([Rb * Math.cos(a), Rb * Math.sin(a)]); } return s; }
  var ws = waferShape();
  var w1 = m.part('wafer1', { ex: [0.40, 0, 0], seq: 1 });
  m.prism(ws, cuts[0] - 0.002, cuts[0] + 0.002, 'acc', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[0] + 0.002, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  var w2 = m.part('wafer2', { ex: [0.80, 0, 0], seq: 2 });
  m.prism(ws, cuts[1] - 0.002, cuts[1] + 0.002, 'accLight', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[1] + 0.002, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  m.anchor(4, 'Wafers', [[0.40, cuts[0], 0.0], [0.80, cuts[1], 0.0]], null);
  m.anchors[3].part = w1.idx; m.anchors[3].at = [[0, cuts[0] + 0.002, Rb * 0.5]]; m.anchors[3].multi = [[w2.idx, [0, cuts[1] + 0.002, Rb * 0.5]]];
  m.guide([[0, cuts[0], 0, ing.idx], [0, cuts[0], 0, w1.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[1], 0, ing.idx], [0, cuts[1], 0, w2.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[0], Rb, ing.idx], [0, cuts[0], Rb, w1.idx]], { alpha: 0.8 });
  m.guide([[0, cuts[1], -Rb, ing.idx], [0, cuts[1], -Rb, w2.idx]], { alpha: 0.8 });
  // review: the diameter is taken rim to rim across the wafer's centre (it was taken off the corners of the square round
  // the wafer, so its extension lines started in the air beside the disc)
  m.dim([-Rb, cuts[1] - 0.002, 0], [Rb, cuts[1] - 0.002, 0], [0, -0.1, 0], '300 mm', { part: w2.idx });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [1, 0, 0], accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
