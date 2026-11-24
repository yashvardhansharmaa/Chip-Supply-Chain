/* =====================================================================================================
   13 Systems: an eight-GPU baseboard in the units of specimens/gpu-baseboard.js, simplified and not to scale (the caption
   says so): its sizes, 510 x 400 mm and 30 mm frames in the old file, have no allowed source, so the plate carries no
   dimension. Four of the eight accelerator modules lift off the board, showing the land grids they press onto.
   22 Nov 2026 review: each module now carries its package, drawn at this site's estimate for the B200 (95 x 68 mm, with its
   78 x 50 interposer and two logic dies, data/landscape-layouts.json) in the board's units, so no module is smaller than the
   package it carries (they were 75 x 83 mm against a 100 x 72 package). The two NVLink switch chips are silicon slate, so
   they show (they were a pale gray that almost disappeared). Colours (the set's legend): silicon slate only.
   22 Nov 2026 expert review: no source names a frame round each module (chapter 13 says the modules bolt onto a baseboard),
   so the "Module frames" label is gone and the caption says the modules are lifted off the board. The rims round each seat
   stay drawn, unlabelled. */
R('gpu-baseboard', function (m) {
  var U = 1.52 / 510; // board units per millimetre, if the board were drawn 510 mm wide
  var BW = 1.52, BD = 1.18, BH = 0.046, top = BH / 2, PKW = 68 * U, PKD = 95 * U, MH = 0.066, LW = PKW + 0.035, LD = PKD + 0.025, kerb = 0.022;
  var MW = LW + 0.024 + 2 * kerb + 0.006, MD = LD + 0.02 + 2 * kerb + 0.006; // each frame just clears its module
  var colX = [-0.525, -0.175, 0.175, 0.525], rowZ = 0.315;
  var board = m.part('board', { ex: [0, 0, 0], seq: 0, mode: 'stack' });
  var dec = [D.rect(-BW / 2 + 0.008, -BD / 2 + 0.008, BW / 2 - 0.008, BD / 2 - 0.008, top, { lw: 0.4, alpha: 0.5 })];
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { dec.push(D.circle(sx * (BW / 2 - 0.042), sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); dec.push(D.circle(sx * 0.352, sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); }); });
  var mods = [];
  colX.forEach(function (x) { [[-rowZ, 1], [rowZ, -1]].forEach(function (r) { mods.push([x, r[0], r[1]]); }); });
  // each module's seat inside its frame: the land-grid socket it presses onto
  mods.forEach(function (md) { dec.push({ dots: H.gridPts(11, 16, 0.017, 0.0175, top, md[0], md[1]), r: 0.6, alpha: 0.85, real: 'au' }); });
  // the board's traces, bundles from each switch chip out to the modules, seen through the solder mask
  [-0.175, 0.175].forEach(function (sx) { for (var tq = 0; tq < 7; tq++) { var oz = (tq - 3) * 0.012; [-1, 1].forEach(function (sz) { colX.forEach(function (cxq) { dec.push(D.poly([[sx + oz, top, sz * 0.11], [sx + oz, top, sz * 0.15], [cxq + oz, top, sz * 0.19]], { lw: 0.3, alpha: 0.55, real: 'trace' })); }); }); } });
  m.real('pcb');
  m.box({ c: [0, 0, 0], s: [BW, BH, BD], decals: { py: dec } }, 'steel');
  m.tag('frames'); m.real('steelDk');
  mods.forEach(function (md) { H.frame(m, [md[0], 0, md[1]], MW, MD, MW - 2 * kerb, MD - 2 * kerb, top, top + MH, 'light'); });
  m.tag(null);
  // the two NVLink switch chips, silicon
  m.tag('switch'); m.real('subMask');
  [-0.175, 0.175].forEach(function (x) {
    var SW = 0.24, SD = 0.2, SH = 0.05, d = [D.rect(-SW / 2 + 0.025, -SD / 2 + 0.025, SW / 2 - 0.025, SD / 2 - 0.025, SH / 2, { lw: 0.6 }), D.rect(-SW * 0.21, -SD * 0.22, SW * 0.21, SD * 0.22, SH / 2, { lw: 0.6, fill: { d: 0.4, real: 'siBack' } })];
    m.box({ c: [x, top + SH / 2, 0], s: [SW, SH, SD], decals: { py: d } }, 'acc');
  });
  m.tag(null);
  // voltage regulators down the long edges, bulk capacitors, power blades and connectors
  m.real('plastic');
  for (var i2 = 0; i2 < 13; i2++) { var vx = (i2 - 6) * 0.085; [-1, 1].forEach(function (s) { m.box({ c: [vx, top + 0.013, s * (BD / 2 - 0.05)], s: [0.044, 0.026, 0.044] }, 'mid'); }); }
  [-1, 1].forEach(function (s) { m.box({ c: [-BW / 2 + 0.062, top + 0.029, s * 0.17], s: [0.084, 0.058, 0.20] }, 'dark'); });
  for (i2 = 0; i2 < 4; i2++) { var pins = []; for (var k2 = 0; k2 < 14; k2++) pins.push(D.line([0.026, -0.017, (k2 - 6.5) * 0.0118], [0.026, 0.015, (k2 - 6.5) * 0.0118], { lw: 0.35, alpha: 0.8, real: 'au' })); m.box({ c: [BW / 2 - 0.042, top + 0.025, (i2 - 1.5) * 0.245], s: [0.052, 0.05, 0.185], decals: { px: pins } }, 'mid'); }
  // the modules, lifted off the board: each a small board carrying its package (the substrate, its interposer and two
  // logic dies, at this site's B200 estimate)
  // the back row lifts out; the front row stays seated, so the switch chips between the rows stay in view
  var mp = m.part('modules', { ex: [0, 0.26, 0], seq: 1, mode: 'stack' }), mpS = null;
  m.tag('modules');
  mods.forEach(function (md) {
    if (md[1] > 0 && !mpS) { mpS = m.part('seated', { ex: [0, 0, 0], seq: 1, mode: 'stack' }); m.tag('modules'); }
    if (md[1] < 0) m.use(mp); else m.use(mpS);
    var yL = top + MH - 0.016, pk = [];
    pk.push(D.rect(-PKW / 2, -PKD / 2, PKW / 2, PKD / 2, 0.011, { lw: 0.55, fill: 'paper', real: 'subMask' }));
    pk.push(D.rect(-25 * U, -39 * U, 25 * U, 39 * U, 0.011, { lw: 0.45, fill: 'mid', real: 'mould' }));
    [-1, 1].forEach(function (s) { pk.push(D.rect(-16.25 * U, (s * 13.5 - 13) * U, 16.25 * U, (s * 13.5 + 13) * U, 0.011, { lw: 0.4, fill: 'mid', real: 'siBack' })); });
    m.real('steelDk');
    m.box({ c: [md[0], yL - 0.0165, md[1]], s: [LW + 0.024, 0.011, LD + 0.02] }, 'mid');
    m.real('pcbDk');
    m.box({ c: [md[0], yL, md[1]], s: [LW, 0.022, LD], decals: { py: pk } }, 'light');
  });
  m.tag(null);
  m.use(mp);
  [mods[0], mods[6]].forEach(function (md) { [[-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(function (c) { m.guide([[md[0] + c[0] * (LW / 2 + 0.012), top, md[1] + c[1] * (LD / 2 + 0.01), board.idx], [md[0] + c[0] * (LW / 2 + 0.012), top + MH - 0.033, md[1] + c[1] * (LD / 2 + 0.01), mp.idx]], { alpha: 0.75 }); }); });
  // (designer pass, 22 Nov 2026: one leader, to the lifted module nearest the labels, which crosses nothing; the second ran
  // 93 px across the board to a seated one. Pointing at the label still lights all eight, by their tag)
  m.callout([mods[6][0] + 0.075, top + MH + 0.017, mods[6][1] - 0.045, mp.idx], 'Accelerator modules', { side: 'r', tag: 'modules' });
  // the nearer chip's top, its leader running down the aisle between the two rows of modules, by the board's right end, to its
  // label (22 Nov 2026 plates refine: it dropped steeply across the seated modules)
  m.callout([0.175 + 0.095, top + 0.05, 0.0, board.idx], 'NVLink switch chips', { side: 'r', tag: 'switch', via: [BW / 2 - 0.05, top + 0.05, 0.0, board.idx] });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
