/* =====================================================================================================
   08 Foundries: a gate-all-around transistor in nanometres: three silicon sheets wrapped on all four sides by the gate metal,
   inner spacers between the gate and the source and drain. Cut across the middle of the gate, with the drain half pulled
   away along the channel (+x), so the cut face shows the metal round each sheet and the two halves read as one switch.
   22 Nov 2026 review: the sheet sizes (6 nm by 30 nm) had no allowed source, so the caption says the proportions are
   simplified and the label carries no figure. The five parts chapter 8's "How a transistor is built" names are numbered,
   from data/specimen-parts.json (source, drain, silicon sheets, gate metal, inner spacers). The drain was pulled along a
   diagonal (0.62, 0, -0.62), which ran its trace lines level across the page. Colours (the set's legend): the sheets in
   silicon slate; the gate metal is ink (it is not gold). */
R('gaa-transistor', function (m) {
  var sT = 6, sW = 30, y0 = [0, 16, 32], gX = 7.5, spX = 12.5, gY0 = -11, gY1 = 45, gZ = 19, PULL = 62;
  var GATE = { d: 0.25 }, GATECUT = { d: 0.06, hatch: 1 };
  function bx(x0, ya, z0, x1, yb, z1, mat, fm, dec) { return m.box({ c: [(x0 + x1) / 2, (ya + yb) / 2, (z0 + z1) / 2], s: [x1 - x0, yb - ya, z1 - z0], fmat: fm, decals: dec }, mat); }
  var epiShape = [[12.5, -13], [16.3, -17], [20.2, -17], [24, -13], [24, 13], [20.2, 17], [16.3, 17], [12.5, 13]];
  // source half, cut at x = 0
  var L = m.part('source', { mode: 'fixed', ex: [0, 0, 0], seq: 0 });
  bx(-30, -23, -25, 0, -16, 25, 'mid', { px: 'cut' });
  bx(-27, -16, -22, 0, -11, 22, 'steel', { px: 'cut' });
  m.tag('src');
  m.prism(epiShape.map(function (q) { return [-q[0], q[1]]; }), -2, 40, 'light', {});
  m.tag('spacer');
  // (the spacers a pale grey, so they read apart from the gate metal, in ink, round them: designer pass, 22 Nov 2026)
  [[sT, 16], [22, 32]].forEach(function (b) { bx(-spX, b[0], -sW / 2, -gX, b[1], sW / 2, 'steel'); });
  m.tag('sheet');
  y0.forEach(function (yb) { bx(-spX, yb, -sW / 2, -gX, yb + sT, sW / 2, 'acc'); });
  m.tag('gate');
  bx(-gX, gY0, -gZ, 0, gY1, gZ, GATE, { px: GATECUT });
  m.tag('sheet');
  y0.forEach(function (yb) { m.sheet([[0.05, yb, -sW / 2], [0.05, yb, sW / 2], [0.05, yb + sT, sW / 2], [0.05, yb + sT, -sW / 2]], 'cutAcc'); });
  m.tag(null);
  bx(-5, gY1, -8, 0, 51, 8, 'dark', { px: 'cut' });
  var cL = m.part('contactS', { ex: [0, 10, 0], seq: 2 });
  bx(-23, 40, -10, -14.5, 48, 10, 'dark');
  // drain half, pulled away along the channel
  var Rr = m.part('drain', { mode: 'fixed', ex: [PULL, 0, 0], seq: 1 });
  bx(0, -23, -25, 30, -16, 25, 'mid');
  bx(0, -16, -22, 27, -11, 22, 'steel');
  m.tag('gate');
  bx(0, gY0, -gZ, gX, gY1, gZ, GATE);
  m.tag('spacer');
  [[sT, 16], [22, 32]].forEach(function (b) { bx(gX, b[0], -sW / 2, spX, b[1], sW / 2, 'steel'); });
  m.tag('sheet');
  y0.forEach(function (yb) { bx(gX, yb, -sW / 2, spX, yb + sT, sW / 2, 'acc'); });
  m.tag(null);
  bx(0, gY1, -8, 5, 51, 8, 'dark');
  // the drain itself pulled a little further along the channel (designer pass, 22 Nov 2026), so the sheets' ends and the inner
  // spacers between them face the reader in the gap it leaves; at the half's own pull they showed only as slivers
  var DG = 26, Re = m.part('drainEpi', { mode: 'fixed', ex: [PULL + DG, 0, 0], seq: 2 });
  m.tag('drn');
  m.prism(epiShape, -2, 40, 'light', {});
  m.tag(null);
  var cR = m.part('contactD', { ex: [PULL + DG, 10, 0], seq: 4 });
  bx(14.5, 40, -10, 23, 48, 10, 'dark');
  [[38, -13], [38, 13], [-2, 13]].forEach(function (q) { m.guide([[spX, q[0], q[1], Rr.idx], [spX, q[0], q[1], Re.idx]], { alpha: 0.8 }); });
  m.guide([[-34, 19, 0, L.idx], [0, 19, 0, L.idx], [0, 19, 0, Rr.idx], [34, 19, 0, Re.idx]], { style: 'axis', alpha: 0.8 });
  [[-gZ, gY1], [gZ, gY1], [gZ, gY0], [-gZ, gY0]].forEach(function (c) { m.guide([[0, c[1], c[0], L.idx], [0, c[1], c[0], Rr.idx]], { alpha: 0.8 }); });
  m.guide([[-18.75, 40, 0, L.idx], [-18.75, 40, 0, cL.idx]], { alpha: 0.8 });
  m.guide([[18.75, 40, 0, Re.idx], [18.75, 40, 0, cR.idx]], { alpha: 0.8 });
  // the five numbered parts, as chapter 8 names them (names from data/specimen-parts.json)
  m.anchor(1, 'Source', [-18.2, 30, 17], L.idx);
  m.anchor(2, 'Drain', [24, 30, 0], Re.idx);
  // the sheets and the spacers named where their ends face the reader, in the drain's gap
  m.anchor(3, 'Silicon sheets', [spX, 16 + sT / 2, 7], Rr.idx);
  m.anchor(4, 'Gate metal', [0.05, -6.5, 9], L.idx);
  m.anchor(5, 'Inner spacers', [spX, 27, -5], Rr.idx);
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, calloutOpts: { 1: { tag: 'src', side: 'l' }, 2: { tag: 'drn', side: 'r' }, 3: { tag: 'sheet', side: 'r', dy: 16 }, 4: { tag: 'gate', side: 'l' }, 5: { tag: 'spacer', side: 'r' } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
