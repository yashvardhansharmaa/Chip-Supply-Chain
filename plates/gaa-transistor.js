/* =====================================================================================================
   08 Foundries: a gate-all-around transistor at true proportions, in nanometres: three silicon sheets 6 nm thick and
   30 nm wide, 10 nm apart, wrapped on all four sides by the gold gate. Cut across the middle of the gate and drawn
   with the drain half pulled away, so the cut face shows the metal round each sheet. */
R('gaa-transistor', function (m) {
  var sT = 6, sW = 30, y0 = [0, 16, 32], gX = 7.5, spX = 12.5, gY0 = -11, gY1 = 45, gZ = 19, PULL = 54;
  function bx(x0, ya, z0, x1, yb, z1, mat, fm, dec) { return m.box({ c: [(x0 + x1) / 2, (ya + yb) / 2, (z0 + z1) / 2], s: [x1 - x0, yb - ya, z1 - z0], fmat: fm, decals: dec }, mat); }
  var epiShape = [[12.5, -13], [16.3, -17], [20.2, -17], [24, -13], [24, 13], [20.2, 17], [16.3, 17], [12.5, 13]];
  // source half, cut at x = 0
  var L = m.part('source', { mode: 'fixed', ex: [0, 0, 0], seq: 0 });
  bx(-30, -23, -25, 0, -16, 25, 'mid', { px: 'cut' });
  bx(-27, -16, -22, 0, -11, 22, 'steel', { px: 'cut' });
  m.prism(epiShape.map(function (q) { return [-q[0], q[1]]; }), -2, 40, 'light', {});
  [[sT, 16], [22, 32]].forEach(function (b) { bx(-spX, b[0], -sW / 2, -gX, b[1], sW / 2, 'dark'); });
  y0.forEach(function (yb) { bx(-spX, yb, -sW / 2, -gX, yb + sT, sW / 2, 'mid'); });
  bx(-gX, gY0, -gZ, 0, gY1, gZ, 'acc', { px: 'cutAcc' });
  y0.forEach(function (yb) { m.sheet([[0.05, yb, -sW / 2], [0.05, yb, sW / 2], [0.05, yb + sT, sW / 2], [0.05, yb + sT, -sW / 2]], 'cutDense'); });
  bx(-5, gY1, -8, 0, 51, 8, 'dark', { px: 'cut' });
  var cL = m.part('contactS', { ex: [0, 10, 0], seq: 2 });
  bx(-23, 40, -10, -14.5, 48, 10, 'dark');
  // drain half, pulled away along the channel
  var Rr = m.part('drain', { mode: 'fixed', ex: [PULL * 0.62, 0, -PULL * 0.62], seq: 1 });
  bx(0, -23, -25, 30, -16, 25, 'mid');
  bx(0, -16, -22, 27, -11, 22, 'steel');
  bx(0, gY0, -gZ, gX, gY1, gZ, 'acc');
  [[sT, 16], [22, 32]].forEach(function (b) { bx(gX, b[0], -sW / 2, spX, b[1], sW / 2, 'dark'); });
  y0.forEach(function (yb) { bx(gX, yb, -sW / 2, spX, yb + sT, sW / 2, 'mid'); });
  m.prism(epiShape, -2, 40, 'light', {});
  bx(0, gY1, -8, 5, 51, 8, 'dark');
  var cR = m.part('contactD', { ex: [PULL * 0.62, 10, -PULL * 0.62], seq: 3 });
  bx(14.5, 40, -10, 23, 48, 10, 'dark');
  m.guide([[-34, 19, 0, L.idx], [0, 19, 0, L.idx], [0, 19, 0, Rr.idx], [34, 19, 0, Rr.idx]], { style: 'axis', alpha: 0.8 });
  [[-gZ, gY1], [gZ, gY1], [gZ, gY0], [-gZ, gY0]].forEach(function (c) { m.guide([[0, c[1], c[0], L.idx], [0, c[1], c[0], Rr.idx]], { alpha: 0.8 }); });
  m.guide([[-18.75, 40, 0, L.idx], [-18.75, 40, 0, cL.idx]], { alpha: 0.8 });
  m.guide([[18.75, 40, 0, Rr.idx], [18.75, 40, 0, cR.idx]], { alpha: 0.8 });
  // review: the gate's dot moves below the lowest sheet; at y 11 its leader ran through the middle sheet's opening,
  // past the dot of the sheets' own label
  m.callout([0.05, -6.5, 9, L.idx], 'Gate metal', { side: 'l' });
  m.callout([0.05, 19, 6, L.idx], 'Silicon sheets, each 6\u00a0nm thick and 30\u00a0nm wide', { side: 'l' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, accent: [165, 130, 42], accentDark: [216, 181, 86] };
});
