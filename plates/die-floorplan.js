/* =====================================================================================================
   01 Design: a GPU die after Nvidia's published H100 block diagram, at one reticle field, 26 x 33 mm, in millimetres.
   The floorplan is engraved on the die's face in three tones (compute tiles, the cache band, the memory edges). The
   copper strip on the short edge is the die-to-die link; the neighbouring die, which the specimen file draws as a
   sliver beyond it, is pulled away along that axis and ends in a break line, as a draughtsman shows a part cut short. */
R('die-floorplan', function (m) {
  var W = 26, Dd = 33, T = 0.9, yT = T / 2;
  var die = m.part('die', { ex: [0, 0, 0], seq: 0 });
  var top = [];
  function blk(x0, z0, x1, z1, o) { top.push(D.rect(x0, z0, x1, z1, yT, Object.assign({ lw: 0.45 }, o || {}))); }
  // memory PHYs down the long edges, controllers inside them
  [-1, 1].forEach(function (s) {
    for (var k = 0; k < 6; k++) {
      var z0 = -13.6 + k * 4.55, z1 = z0 + 4.1, xa = s * 10.5, xb = s * 12.3;
      blk(Math.min(xa, xb), z0, Math.max(xa, xb), z1, { fill: 'mid' });
      for (var q = 1; q <= 5; q++) { var zz = z0 + (z1 - z0) * q / 6; top.push(D.line([Math.min(xa, xb) + 0.2, yT, zz], [Math.max(xa, xb) - 0.2, yT, zz], { lw: 0.3, alpha: 0.7 })); }
      blk(Math.min(s * 8.75, s * 10.2), z0 + 0.25, Math.max(s * 8.75, s * 10.2), z1 - 0.25, { fill: 'steel' });
    }
  });
  // eight clusters of eighteen compute tiles, four above and four below the cache band
  var gcW = 17.2 / 4;
  [[3.4, 13.7], [-13.7, -3.4]].forEach(function (bz) {
    for (var gI = 0; gI < 4; gI++) {
      var x0 = -8.6 + gI * gcW + 0.18, x1 = x0 + gcW - 0.36;
      blk(x0, bz[0], x1, bz[1], { lw: 0.55 });
      var tw = (x1 - x0 - 0.3) / 3, td = (bz[1] - bz[0] - 0.4) / 6;
      for (var a = 0; a < 3; a++) for (var c = 0; c < 6; c++) {
        var tx0 = x0 + 0.15 + a * tw + 0.09, tz0 = bz[0] + 0.2 + c * td + 0.09;
        top.push(D.rect(tx0, tz0, tx0 + tw - 0.18, tz0 + td - 0.18, yT, { fill: 'light', lw: 0.3, alpha: 0.9 }));
      }
    }
  });
  // the L2 cache in two partitions across the middle, ruled as memory arrays are, with the crossbar between them
  [[-8.6, -0.5], [0.5, 8.6]].forEach(function (b) {
    blk(b[0], -2.8, b[1], 2.8, { fill: 'steel', lw: 0.55 });
    for (var q = 1; q < 12; q++) { var zz = -2.8 + 5.6 * q / 12; top.push(D.line([b[0] + 0.2, yT, zz], [b[1] - 0.2, yT, zz], { lw: 0.28, alpha: 0.75 })); }
  });
  blk(-0.4, -2.8, 0.4, 2.8, { fill: 'dark' });
  // the host interface and NVLink ports across the far short edge
  blk(-11.6, 14.2, 11.6, 16.1, { fill: 'steel' });
  for (var n = 0; n < 9; n++) { var nx = -10.8 + n * 2.62; top.push(D.rect(nx, 14.55, nx + 1.9, 15.75, yT, { lw: 0.3, fill: 'light' })); }
  // the die-to-die link: a copper strip on the near short edge, ruled with its contacts
  var cuTop = [D.rect(-11.9, -16.15, 11.9, -14.35, yT, { fill: 'accLight', col: 'acc', lw: 0.5 })];
  for (var k2 = 0; k2 < 34; k2++) { var cx = -11.6 + k2 * (23.2 / 33); cuTop.push(D.line([cx, yT, -16.0], [cx, yT, -14.5], { col: 'acc', lw: 0.32, alpha: 0.9 })); }
  m.box({ c: [0, 0, 0], s: [W, T, Dd], decals: { py: top.concat(cuTop) } }, 'light');
  m.dim([-W / 2, -yT, Dd / 2], [W / 2, -yT, Dd / 2], [0, 0, 4.2], '26 mm');
  m.dim([W / 2, -yT, Dd / 2], [W / 2, -yT, -Dd / 2], [4.2, 0, 0], '33 mm');
  m.callout([0, yT, -15.25], 'Die-to-die link', { side: 'l' });
  // the neighbouring die: a sliver of it, with its own copper strip facing ours, cut short by a break line
  // review: pulled 5 mm clear, was 7.5: the gap cost the die itself about a tenth of its size on the page
  var nb = m.part('neighbour', { ex: [0, 0, -5], seq: 1 });
  var L = 5.2, zN1 = -Dd / 2 - 0.4, zN0 = zN1 - L, brk = [];
  // the break: a long, shallow zigzag across the die, as drawn on a part shown cut short
  var nz = 7;
  for (var b = 0; b <= nz; b++) { var bx = W / 2 - b * W / nz; brk.push([bx, zN0 + (b % 2 ? 0.55 : -0.55)]); }
  var shape = [[-W / 2, zN1], [W / 2, zN1]].concat(brk);
  var ntop = [D.rect(-11.9, zN1 - 1.8, 11.9, zN1, yT, { fill: 'accLight', col: 'acc', lw: 0.5 })];
  for (k2 = 0; k2 < 34; k2++) { cx = -11.6 + k2 * (23.2 / 33); ntop.push(D.line([cx, yT, zN1 - 1.65], [cx, yT, zN1 - 0.15], { col: 'acc', lw: 0.32, alpha: 0.9 })); }
  var gq = gcW; for (var g2 = 0; g2 < 4; g2++) { var gx0 = -8.6 + g2 * gq + 0.18; ntop.push({ pts: [[gx0, yT, zN1 - 2.6], [gx0, yT, zN0 + 0.8], [gx0 + gq - 0.36, yT, zN0 + 0.8], [gx0 + gq - 0.36, yT, zN1 - 2.6]], closed: true, lw: 0.45, alpha: 0.8 }); }
  m.prism(shape.map(function (q) { return [q[0], q[1]]; }), -yT, yT, 'paper', { top: ntop });
  // the link's axis through both dies, and trace lines from strip to strip
  m.guide([[0, yT, 6, die.idx], [0, yT, zN0 - 3, nb.idx]], { style: 'axis', alpha: 0.9 });
  [-W / 2, W / 2].forEach(function (x) { m.guide([[x, yT, -Dd / 2, die.idx], [x, yT, zN1, nb.idx]], { alpha: 0.9 }); });
  return { elev: PLATE.ISO.elev, yaw: 3 * Math.PI / 4, sortAxis: [0, 0, 1], start: 2.2, thumbX: 0.5, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});
