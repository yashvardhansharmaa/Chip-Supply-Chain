/* =====================================================================================================
   03 Chemicals: a three-cylinder gas cabinet with its door off, in metres, and a bulk liquid cylinder behind it. One gas
   cylinder slides out of the cabinet the way it is changed; the exhaust collar lifts off.
   22 Nov 2026 review: its sizes (0.97 x 0.48 x 1.93 m) came from a supplier's catalogue, not an allowed source, so the
   plate carries no dimensions and the caption makes no claim of scale. Each label lights its own group (tags: panel,
   cylinders, bulk). Colours (the set's legend): the gas panel in the set's one steel colour, a grey with no hue (22 Nov 2026
   plates refine: it was a blue grey, which read as silicon's slate). */
R('gas-cabinet', function (m) {
  var CBX = -0.30, CW = 0.97, CD = 0.48, CPL = 0.12, CTOP = 1.93, t = 0.022;
  // painted in layers: the back shell, then the cylinders inside, then the front of the cabinet. The plate rocks
  // (its open front always toward the reader), so this order holds at every frame.
  var shell = m.part('shell', { ex: [0, 0, 0], seq: 0, pri: -1, mode: 'depth' });
  var CH = CTOP - CPL, CY = (CPL + CTOP) / 2;
  m.real('steelDk');
  m.box({ c: [CBX, CPL / 2, 0], s: [CW, CPL, CD] }, 'mid');                                  // plinth
  m.real('paint');
  m.box({ c: [CBX, CY, -CD / 2 + t / 2], s: [CW, CH, t], real: 'paintIn', inner: true }, 'light');                       // back wall
  m.box({ c: [CBX - CW / 2 + t / 2, CY, 0], s: [t, CH, CD], real: 'paintIn', inner: true }, 'steel');                   // far side
  var grille = [D.rectZY(-0.15, -0.17, 0.15, 0.17, t / 2 + 0.001, { lw: 0.6 })];
  for (var i = 0; i < 5; i++) grille.push(D.line([t / 2 + 0.001, -0.12 + i * 0.055, -0.13], [t / 2 + 0.001, -0.12 + i * 0.055, 0.13], { lw: 0.45 }));
  grille = grille.map(function (it) { return { pts: it.pts.map(function (p) { return [p[0], p[1] + CPL + 0.34 - CY, p[2]]; }), closed: it.closed, lw: it.lw }; });
  var front = m.part('front', { ex: [0, 0, 0], seq: 0, pri: 1, mode: 'depth' });
  m.real('paint');
  m.box({ c: [CBX + CW / 2 - t / 2, CY, 0], s: [t, CH, CD], decals: { px: grille } }, 'steel');   // near side
  m.box({ c: [CBX, CTOP - t / 2, 0], s: [CW, t, CD] }, 'light');                          // roof
  // the open front's frame return, and three hinges
  m.box({ c: [CBX, CY, CD / 2 - 0.01], s: [CW, CH, 0.02], skip: [] }, 'phantom');
  m.real('steel');
  for (i = 0; i < 3; i++) m.box({ c: [CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045], s: [0.045, 0.09, 0.045] }, 'mid');
  // (round 3: the cabinet's emergency-off button and its controller's screen, small, on the near side's front edge)
  m.real('screen'); m.box({ c: [CBX + CW / 2 + 0.006, CTOP - 0.17, CD / 2 - 0.12], s: [0.012, 0.075, 0.1] }, 'dark'); m.real('emo'); m.cyl([CBX + CW / 2 + 0.014, CTOP - 0.29, CD / 2 - 0.12], 0.022, 0.028, 'turned', { seg: 20, rot: [0, 0, Math.PI / 2] }); m.real('steel');
  // restraint bars, in front of the cylinders
  m.real('steel');
  [0.58, 1.04].forEach(function (by) { m.box({ c: [CBX, by, 0.045], s: [CW - 0.13, 0.038, 0.038] }, 'dark'); });
  m.use(shell);
  // the gas panel, steel-gray, on the back wall: plate, headers, valve blocks, gauges, regulator
  var PZ = -CD / 2 + 0.035, PY0 = 1.44, cylX = [-0.29, 0, 0.29];
  m.tag('panel'); m.real('vac');
  // (round two: the panel a step deeper, d 0.45, so it holds its place as the cabinet's one coloured part)
  m.box({ c: [CBX - 0.02, PY0 + 0.25, PZ - 0.008], s: [0.84, 0.46, 0.012] }, { d: 0.45, c: 'acc', real: 'panel' });
  m.wire([[CBX - 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 + 0.06, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX + 0.40, PY0 + 0.44, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  cylX.forEach(function (cx) {
    var px = CBX + cx;
    m.box({ c: [px, PY0 + 0.06, PZ + 0.03], s: [0.058, 0.062, 0.058] }, 'accDark');
    m.box({ c: [px, PY0 + 0.44, PZ + 0.03], s: [0.052, 0.056, 0.052] }, 'accDark');
    m.wire([[px, PY0 + 0.10, PZ + 0.03], [px, PY0 + 0.41, PZ + 0.03]], { col: 'acc', lw: 1.4 });
    m.real('gauge'); m.cyl([px, PY0 + 0.265, PZ + 0.04], 0.05, 0.02, 'accLight', { seg: 24, rot: [Math.PI / 2, 0, 0], top: [] }); m.real('steel');
    m.wire(H.ring(px, PY0 + 0.265, PZ + 0.051, 0.02, 20, 'z'), { col: 'acc', lw: 0.6 });
  });
  m.cyl([CBX + 0.40, PY0 + 0.06, PZ + 0.03], 0.048, 0.052, 'accTurned', { seg: 24 });
  m.wire([[CBX + 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 - 0.16, PZ + 0.03], [CBX + CW / 2 + 0.19, PY0 - 0.16, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.cyl([CBX + CW / 2 + 0.115, PY0 - 0.16, PZ + 0.03], 0.03, 0.115, 'accTurned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX - 0.40, CTOP - 0.03, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.tag(null);
  // three cylinders; the middle one slides out
  var CAPS = ['capY', 'capY', 'n2'], nB = 0;
  function bottle(x, hgt, cz) {
    m.tag('cyl');
    var b0 = CPL, b1 = CPL + hgt, sh = b1 + 0.11, CR = 0.114;
    m.real('cylGrey'); m.revolve([[0, b0], [CR, b0], [CR, b0 + 0.02, 2], [CR, b1 - 0.2, 2], [0, b1 - 0.2]], 'turned', { seg: 48, pos: [x, 0, cz] });
    m.real(CAPS[nB++ % 3]); m.revolve([[0, b1 - 0.2], [CR, b1 - 0.2], [CR, b1 - 0.085, 2], [CR, b1, 0], [0.034, sh], [0.034, sh + 0.02], [0, sh + 0.02]], 'turned', { seg: 48, pos: [x, 0, cz] });
    m.real('steel');
    // (a hazard diamond on the shoulder label, facing the cabinet's open front)
    var hzG = CAPS[nB - 1] === 'n2', dz = cz + CR * 1.02, dyc = b1 - 0.14, dd = 0.034, dx0 = x - 0.045;
    m.sheet([[dx0, dyc - dd, dz], [dx0 + dd, dyc, dz], [dx0, dyc + dd, dz], [dx0 - dd, dyc, dz]], { d: 0.05, real: 'label' }, { decals: [{ pts: [[dx0, dyc - dd * 0.82, dz + 0.0005], [dx0 + dd * 0.82, dyc, dz + 0.0005], [dx0, dyc + dd * 0.82, dz + 0.0005], [dx0 - dd * 0.82, dyc, dz + 0.0005]], closed: true, lw: 1.1, real: hzG ? 'ghsGreen' : 'ghsRed' }] });
    m.box({ c: [x, sh + 0.058, cz], s: [0.058, 0.078, 0.058] }, 'mid');
    m.tag(null);
    return [x, sh + 0.1, cz];
  }
  // review: the left cylinder slides out, not the middle one: out of the middle it stood on the 1 m dimension's left end
  var vt = [];
  var out = m.part('cylinder', { ex: [0, 0, 1.75], seq: 1, pri: 2 });
  vt.push(bottle(CBX + cylX[0], 1.16, -0.055));
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0, pri: 0, mode: 'depth' });
  vt.push(bottle(CBX + cylX[1], 1.16, -0.055));
  vt.push(bottle(CBX + cylX[2], 0.98, -0.055));
  // pigtails from the valves to the panel (the one that slides out is disconnected)
  m.tag('panel'); m.real('vac');
  [1, 2].forEach(function (k) {
    var v = vt[k], px = CBX + cylX[k], coil = [];
    for (var a = 0; a <= 2.6 * 24; a++) { var th = a / 24 * TAU; coil.push([v[0] + 0.048 + 0.048 * Math.cos(th), v[1] + 0.03 + a / 24 * 0.038, v[2] + 0.048 * Math.sin(th)]); }
    m.wire(coil, { col: 'acc', lw: 0.8 });
    m.wire([[v[0] + 0.096, v[1] + 0.13, v[2]], [v[0] + 0.096, PY0 - 0.02, v[2]], [px, PY0 - 0.02, PZ + 0.03], [px, PY0 + 0.06, PZ + 0.03]], { col: 'acc', lw: 1.2 });
  });
  m.tag(null);
  m.guide([[CBX + cylX[0], CPL, -0.055, cab.idx], [CBX + cylX[0], CPL, -0.055, out.idx]], { style: 'axis', alpha: 0.85 });
  m.guide([[CBX + cylX[0] - 0.114, CPL, -0.055, cab.idx], [CBX + cylX[0] - 0.114, CPL, -0.055, out.idx]], { alpha: 0.85 });
  m.guide([[CBX + cylX[0] + 0.114, CPL, -0.055, cab.idx], [CBX + cylX[0] + 0.114, CPL, -0.055, out.idx]], { alpha: 0.85 });
  // the exhaust plenum and collar, lifted off the roof
  var ex = m.part('exhaust', { ex: [0, 0.14, 0], seq: 2, pri: 3 });
  m.real('steel');
  m.box({ c: [CBX, CTOP + 0.085, -0.02], s: [0.66, 0.17, 0.40] }, 'steel');
  m.cyl([CBX, CTOP + 0.37, -0.02], 0.102, 0.40, 'turned', { seg: 28, rIn: 0.09 });
  m.guide([[CBX, CTOP, -0.02, cab.idx], [CBX, CTOP + 0.62, -0.02, ex.idx]], { style: 'axis', alpha: 0.85 });
  // the bulk liquid cylinder behind
  var bulk = m.part('bulk', { ex: [0, 0, 0], seq: 0, pri: -2 });
  var TX = 0.86, TZ = -0.40, TR = 0.205, TB = 0.15, TT = 1.06;
  m.tag('bulk'); m.real('vac');
  var bp = [[0, 0], [TR * 0.86, 0], [TR * 0.86, TB], [TR, TB], [TR, 0.30, 2], [TR, 0.48, 2], [TR, 0.66, 2], [TR, 0.84, 2], [TR, 0.94, 2], [TR, 1.00, 2], [TR, TT]];
  for (i = 1; i <= 6; i++) { var a = i / 6 * Math.PI / 2; bp.push([TR * Math.cos(a), TT + TR * 0.52 * Math.sin(a), 0]); }
  bp.push([0, TT + TR * 0.52]);
  m.revolve(bp, 'turned', { seg: 36, pos: [TX, 0, TZ] });
  m.cyl([TX, TT + 0.20, TZ], TR * 0.98, 0.03, 'turnedDark', { seg: 36, rIn: TR * 0.9 });
  m.box({ c: [TX, TT + 0.10, TZ + 0.02], s: [0.16, 0.075, 0.10] }, 'mid');
  for (i = 0; i < 4; i++) { var pa = i * TAU / 4 + 0.5; m.wire([[TX + TR * 0.94 * Math.cos(pa), TT + 0.03, TZ + TR * 0.94 * Math.sin(pa)], [TX + TR * 0.96 * Math.cos(pa), TT + 0.19, TZ + TR * 0.96 * Math.sin(pa)]], { lw: 1.1 }); }
  var coil2 = []; for (i = 0; i <= 5 * 24; i++) { var tt = i / 24 * TAU; coil2.push([TX - TR - 0.046 + 0.042 * Math.cos(tt), 0.49 + i / 24 * 0.046, TZ + 0.02 + 0.042 * Math.sin(tt)]); }
  m.wire(coil2, { lw: 0.7, real: 'vac' });
  m.tag(null);
  // labels: each lights its own group. The cylinders' one leader goes to the cylinder that slid out, clear of the
  // cabinet's restraint bars, and its label lights all three
  m.callout([CBX + cylX[0] - 0.09, 0.82, -0.055 + 0.07, out.idx], 'Gas cylinders', { side: 'l', tag: 'cyl' });
  m.callout([CBX - 0.25, PY0 + 0.25, PZ, shell.idx], 'Valves, regulator and gauges', { side: 'l', dy: -14, tag: 'panel' });
  m.callout([TX + TR * 0.5, 0.75, TZ + TR * 0.86, bulk.idx], 'Bulk liquid cylinder', { side: 'r', tag: 'bulk' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [122, 122, 122], accentDark: [200, 200, 200] };
});
