/* =====================================================================================================
   13 Systems: an eight-GPU baseboard, about 510 x 400 mm and to scale, in the units of specimens/gpu-baseboard.js.
   The eight accelerator modules lift out of their frames, showing the land grids they press onto; the two
   NVLink switch chips in the middle are nickel-gray. */
R('gpu-baseboard', function (m) {
  var BW = 1.52, BD = 1.18, BH = 0.046, top = BH / 2, MW = 0.31, MD = 0.30, MH = 0.066, LW = 0.175, LD = 0.205, kerb = 0.032;
  var colX = [-0.525, -0.175, 0.175, 0.525], rowZ = 0.318;
  var board = m.part('board', { ex: [0, 0, 0], seq: 0, mode: 'stack' });
  var dec = [D.rect(-BW / 2 + 0.008, -BD / 2 + 0.008, BW / 2 - 0.008, BD / 2 - 0.008, top, { lw: 0.4, alpha: 0.5 })];
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { dec.push(D.circle(sx * (BW / 2 - 0.042), sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); dec.push(D.circle(sx * 0.352, sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); }); });
  var mods = [];
  colX.forEach(function (x) { [[-rowZ, 1], [rowZ, -1]].forEach(function (r) { mods.push([x, r[0], r[1]]); }); });
  mods.forEach(function (md) {
    var gz = md[1] + md[2] * (MD / 2 + 0.055);
    dec.push(D.rect(md[0] - 0.10, gz - 0.026, md[0] + 0.10, gz + 0.026, top, { lw: 0.5, fill: 'light' }));
    dec.push({ dots: H.gridPts(16, 4, 0.0115, 0.011, top, md[0], gz), r: 0.6, alpha: 0.8 });
    // the module's own seat inside its frame: the land-grid socket it presses onto
    dec.push({ dots: H.gridPts(12, 14, 0.016, 0.0155, top, md[0], md[1]), r: 0.5, alpha: 0.55 });
  });
  // traces from each switch out to both rows of land grids
  [-0.175, 0.175].forEach(function (x) { for (var i = 0; i < 7; i++) { var o = (i - 3) * 0.02; [1, -1].forEach(function (s) { dec.push({ pts: [[x + o, top, s * 0.1175], [x + o, top, s * 0.132], [x + o * 1.9 + (x > 0 ? 0.09 : -0.09), top, s * 0.163]], lw: 0.35, alpha: 0.6 }); }); } });
  m.box({ c: [0, 0, 0], s: [BW, BH, BD], decals: { py: dec } }, 'steel');
  mods.forEach(function (md) { H.frame(m, [md[0], 0, md[1]], MW, MD, MW - 2 * kerb, MD - 2 * kerb, top, top + MH, 'light'); });
  // the two NVLink switch chips
  m.tag('switch');
  [-0.175, 0.175].forEach(function (x) {
    var SW = 0.30, SD = 0.235, SH = 0.05, d = [D.rect(-SW / 2 + 0.025, -SD / 2 + 0.025, SW / 2 - 0.025, SD / 2 - 0.025, SH / 2, { lw: 0.6, col: 'acc' }), D.rect(-SW * 0.21, -SD * 0.22, SW * 0.21, SD * 0.22, SH / 2, { lw: 0.6 })];
    for (var q = 0; q < 5; q++) d.push(D.line([-SW * 0.19, SH / 2, (q - 2) * SD * 0.082], [SW * 0.19, SH / 2, (q - 2) * SD * 0.082], { lw: 0.4, alpha: 0.8 }));
    // review: 'accDark': the caption's nickel-gray squares; at 'acc' their top faces were as pale as the board
    m.box({ c: [x, top + SH / 2, 0], s: [SW, SH, SD], decals: { py: d } }, 'accDark');
  });
  m.tag(null);
  // voltage regulators down the long edges, bulk capacitors, power blades and connectors
  for (var i2 = 0; i2 < 13; i2++) { var vx = (i2 - 6) * 0.085; [-1, 1].forEach(function (s) { m.box({ c: [vx, top + 0.013, s * (BD / 2 - 0.05)], s: [0.044, 0.026, 0.044] }, 'mid'); }); }
  for (i2 = 0; i2 < 20; i2++) m.cyl([(i2 % 10 - 4.5) * 0.088, top + 0.015, (i2 < 10 ? -1 : 1) * (BD / 2 - 0.112)], 0.014, 0.03, 'turnedDark', { seg: 10 });
  [-1, 1].forEach(function (s) { m.box({ c: [-BW / 2 + 0.062, top + 0.029, s * 0.17], s: [0.084, 0.058, 0.20] }, 'dark'); });
  for (i2 = 0; i2 < 4; i2++) { var pins = []; for (var k2 = 0; k2 < 14; k2++) pins.push(D.line([0.026, -0.017, (k2 - 6.5) * 0.0118], [0.026, 0.015, (k2 - 6.5) * 0.0118], { lw: 0.35, alpha: 0.8 })); m.box({ c: [BW / 2 - 0.042, top + 0.025, (i2 - 1.5) * 0.245], s: [0.052, 0.05, 0.185], decals: { px: pins } }, 'mid'); }
  m.dim([-BW / 2, -top, BD / 2], [BW / 2, -top, BD / 2], [0, 0, 0.12], '510 mm');
  m.dim([BW / 2, -top, BD / 2], [BW / 2, -top, -BD / 2], [0.12, 0, 0], '400 mm');
  // the modules, lifted out of their frames
  var mp = m.part('modules', { ex: [0, 0.26, 0], seq: 1, mode: 'stack' });
  mods.forEach(function (md) {
    var yL = top + MH - 0.016, brush = [];
    for (var bl = 0; bl < 13; bl++) brush.push(D.line([-LW * 0.44, 0.011, (bl - 6) * LD * 0.068], [LW * 0.44, 0.011, (bl - 6) * LD * 0.068], { lw: 0.3, alpha: 0.6 }));
    brush.push(D.rect(-LW * 0.28, -LD * 0.22, LW * 0.28, LD * 0.22, 0.011, { lw: 0.5 }));
    m.box({ c: [md[0], yL - 0.0165, md[1]], s: [LW + 0.048, 0.011, LD + 0.042] }, 'mid');
    m.box({ c: [md[0], yL, md[1]], s: [LW, 0.022, LD], decals: { py: brush } }, 'light');
  });
  [mods[1], mods[6]].forEach(function (md) { [[-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(function (c) { m.guide([[md[0] + c[0] * (LW / 2 + 0.024), top, md[1] + c[1] * (LD / 2 + 0.021), board.idx], [md[0] + c[0] * (LW / 2 + 0.024), top + MH - 0.033, md[1] + c[1] * (LD / 2 + 0.021), mp.idx]], { alpha: 0.75 }); }); });
  m.callout([mods[4][0] + 0.03, top + MH - 0.005, mods[4][1] + 0.06, mp.idx], 'Accelerator modules', { side: 'r' });
  m.callout([mods[6][0] + MW / 2, top + MH * 0.6, mods[6][1] + MD * 0.1, board.idx], 'Module frames', { side: 'r' });
  // review: one leader to each chip, on the far part the lifted modules leave in view (the dot sat on a module)
  m.callout([[-0.175 - 0.07, top + 0.05, -0.085, board.idx], [0.175 - 0.07, top + 0.05, -0.085, board.idx]], 'NVLink switch chips', { side: 'r', tag: 'switch' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [127, 138, 147], accentDark: [201, 209, 215] };
});
