/* =====================================================================================================
   01 Design: a GPU die after Nvidia's published H100 block diagram, at one reticle field, 26 x 33 mm, in millimetres.
   The floorplan is engraved on the die's face in three tones (compute tiles, the cache band, the memory edges). The
   caption's copper strip on one short edge, which stands for the die-to-die link, is a part of its own: a copper bar
   slid out from its seat along the die's near edge, ruled with its contacts, with trace lines down to the seat it leaves.
   (The mock pulled away a sliver of the neighbouring die, which the specimen file draws, cut short by a break line; the
   review panel read it as broken silicon, so the drawing keeps to the caption's one copper strip.) */
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
  // the die-to-die link's seat: the strip's footprint on the near short edge, dashed, as an exploded drawing marks where a part sits
  var LX = 11.9, Lz0 = -16.15, Lz1 = -14.35, LT = 0.6;
  var seat = [D.rect(-LX, Lz0, LX, Lz1, yT, { dash: [1.4, 1], lw: 0.5, alpha: 0.85 })];
  m.box({ c: [0, 0, 0], s: [W, T, Dd], decals: { py: top.concat(seat) } }, 'light');
  m.dim([-W / 2, -yT, Dd / 2], [W / 2, -yT, Dd / 2], [0, 0, 4.2], '26 mm');
  m.dim([W / 2, -yT, Dd / 2], [W / 2, -yT, -Dd / 2], [4.2, 0, 0], '33 mm');
  // the link: a copper bar of its own, slid straight out from its seat over the near edge, its contacts ruled across its top
  // and its ends square
  var ln = m.part('link', { ex: [0, 0.9, -5.2], seq: 1 });
  var cu = [];
  for (var k2 = 0; k2 < 34; k2++) { var cx = -11.6 + k2 * (23.2 / 33); cu.push(D.line([cx, LT / 2, -0.75], [cx, LT / 2, 0.75], { col: 'acc', lw: 0.34, alpha: 0.95 })); }
  cu.push(D.rect(-LX + 0.25, -0.82, LX - 0.25, 0.82, LT / 2, { col: 'acc', lw: 0.4, alpha: 0.7 }));
  m.box({ c: [0, yT + LT / 2, (Lz0 + Lz1) / 2], s: [2 * LX, LT, Lz1 - Lz0], decals: { py: cu } }, 'acc');
  m.callout([-LX * 0.2, yT + LT, Lz0 + 0.3], 'Die-to-die link', { side: 'l' });
  // trace lines from the bar's corners down to its seat
  [[-LX, Lz1], [LX, Lz1]].forEach(function (q) { m.guide([[q[0], yT, q[1], die.idx], [q[0], yT, q[1], ln.idx]], { alpha: 0.9 }); });
  void Lz0;
  return { elev: PLATE.ISO.elev, yaw: 3 * Math.PI / 4, sortAxis: [0, 1, 0], start: 2.2, thumbX: 0.5, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});
