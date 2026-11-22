/* =====================================================================================================
   01 Design: a GPU die after Nvidia's published block diagram of the full GH100 die inside its H100 (Nvidia developer blog,
   22 March 2022: 8 GPCs of 18 SMs, 144 SMs in all, 60 MB of L2 cache, 12 memory controllers; 80 billion transistors on
   814 mm²). Drawn at one reticle field, 26 x 33 mm (ASML), a little larger than GH100, in millimetres.
   The floorplan lies on the die's face in three tones: the compute units in eight clusters, the L2 cache band across the
   middle, the memory controllers and their interfaces down the long edges. Each group carries a tag, so its label lights it
   and nothing else.
   The die-to-die link of two-die chips such as Blackwell (H100 has none; the caption says so) is a block of the die itself,
   flush on its near short edge (22 Nov 2026 review: it was a copper bar slid off the die, ruled with contacts like a scale,
   which read as a separate part and as copper). Colours (the set's legend, 22 Nov 2026): none here; the die is drawn in ink. */
R('die-floorplan', function (m) {
  var W = 26, Dd = 33, T = 0.9, yT = T / 2, bh = 0.06, yB = yT + bh / 2, bt = bh / 2;
  m.part('die', { ex: [0, 0, 0], seq: 0, mode: 'stack' });
  // a block of the floorplan: a thin solid lying on the die's face, so a pointer on it names its own group
  function blk(x0, z0, x1, z1, mat, tag, dec) { m.tag(tag || null); var s = m.box({ c: [(x0 + x1) / 2, yB, (z0 + z1) / 2], s: [x1 - x0, bh, z1 - z0], decals: dec ? { py: dec } : null }, mat); m.tag(null); return s; }
  // the host interface and NVLink ports across the far short edge, drawn on the die's face
  var face = [D.rect(-11.6, 14.2, 11.6, 16.1, yT, { fill: 'steel', lw: 0.45 })];
  for (var n = 0; n < 9; n++) { var nx = -10.8 + n * 2.62; face.push(D.rect(nx, 14.55, nx + 1.9, 15.75, yT, { lw: 0.3, fill: 'light' })); }
  m.box({ c: [0, 0, 0], s: [W, T, Dd], decals: { py: face } }, 'light');
  // memory interfaces down the long edges, the controllers inside them
  [-1, 1].forEach(function (s) {
    for (var k = 0; k < 6; k++) {
      var z0 = -13.6 + k * 4.55, z1 = z0 + 4.1, xa = Math.min(s * 10.5, s * 12.3), xb = Math.max(s * 10.5, s * 12.3), rule = [];
      for (var q = 1; q <= 5; q++) { var zz = (z1 - z0) * (q / 6 - 0.5); rule.push(D.line([-(xb - xa) / 2 + 0.2, bt, zz], [(xb - xa) / 2 - 0.2, bt, zz], { lw: 0.3, alpha: 0.7 })); }
      blk(xa, z0, xb, z1, 'mid', 'mem', rule);
      blk(Math.min(s * 8.75, s * 10.2), z0 + 0.25, Math.max(s * 8.75, s * 10.2), z1 - 0.25, 'steel', 'mem');
    }
  });
  // eight clusters of eighteen compute units, four above and four below the cache band
  var gcW = 17.2 / 4;
  [[3.4, 13.7], [-13.7, -3.4]].forEach(function (bz) {
    for (var gI = 0; gI < 4; gI++) {
      var x0 = -8.6 + gI * gcW + 0.18, x1 = x0 + gcW - 0.36, cxm = (x0 + x1) / 2, czm = (bz[0] + bz[1]) / 2, tiles = [];
      var tw = (x1 - x0 - 0.3) / 3, td = (bz[1] - bz[0] - 0.4) / 6;
      for (var a = 0; a < 3; a++) for (var c = 0; c < 6; c++) {
        var tx0 = x0 + 0.15 + a * tw + 0.09 - cxm, tz0 = bz[0] + 0.2 + c * td + 0.09 - czm;
        tiles.push(D.rect(tx0, tz0, tx0 + tw - 0.18, tz0 + td - 0.18, bt, { fill: 'paper', lw: 0.3, alpha: 0.9 }));
      }
      blk(x0, bz[0], x1, bz[1], 'light', 'sm', tiles);
    }
  });
  // the L2 cache in two partitions across the middle, ruled as memory arrays are, with the crossbar between them
  [[-8.6, -0.5], [0.5, 8.6]].forEach(function (b) {
    var rule = [], hw = (b[1] - b[0]) / 2;
    for (var q = 1; q < 12; q++) { var zz = -2.8 + 5.6 * q / 12; rule.push(D.line([-hw + 0.2, bt, zz], [hw - 0.2, bt, zz], { lw: 0.28, alpha: 0.75 })); }
    blk(b[0], -2.8, b[1], 2.8, 'steel', 'l2', rule);
  });
  blk(-0.4, -2.8, 0.4, 2.8, 'dark', 'l2');
  // the die-to-die link: one plain block of the die, flush along the near short edge
  var LX = 11.6, Lz0 = -16.1, Lz1 = -14.3;
  blk(-LX, Lz0, LX, Lz1, 'dark', 'd2d');
  m.dim([-W / 2, -yT, Dd / 2], [W / 2, -yT, Dd / 2], [0, 0, 4.2], '26 mm');
  m.dim([W / 2, -yT, Dd / 2], [W / 2, -yT, -Dd / 2], [4.2, 0, 0], '33 mm');
  // labels, each lighting its own group (tag)
  m.callout([-6.5, yT + bh, -8.5], 'Compute units', { side: 'l', tag: 'sm' });
  m.callout([-4.5, yT + bh, 0], 'Cache', { side: 'l', tag: 'l2' });
  m.callout([-11.4, yT + bh, -6.6], 'Memory controllers', { side: 'l', tag: 'mem' });
  m.callout([-LX * 0.35, yT + bh, (Lz0 + Lz1) / 2], 'Die-to-die link', { side: 'l', tag: 'd2d' });
  return { elev: PLATE.ISO.elev, yaw: 3 * Math.PI / 4, sortAxis: [0, 1, 0], start: 2.2, thumbX: 0.5, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
