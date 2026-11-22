/* =====================================================================================================
   06 Deposition and etch: a plasma etch chamber cut in half, in metres: 500 mm bore, 42 mm wall, one 300 mm wafer on
   its chuck. The plasma gap is drawn about twice its height, as the caption says; the plasma is the one stippled thing.
   The gas and power feed on the lid lifts off, and the gate valve and turbopump drop away below. */
R('process-chamber', function (m) {
  var yaw = PLATE.DIM.yaw, h = farHalf(yaw), a0 = h[0], a1 = h[1], tv = h[2];
  var rI = 0.25, rO = 0.292, yTop = 0.16, yBot = -0.212, yLid = 0.19, yFlo = -0.242;
  var O = { a0: a0, a1: a1, cut: 'cut', seg: 56 };
  function o(extra) { var r = {}; for (var k in O) r[k] = O[k]; for (k in extra) r[k] = extra[k]; return r; }
  var ves = m.part('vessel', { pri: 0 });
  var vs = m.revolve([[0.058, yTop], [rI, yTop], [rI, yBot], [0.105, yBot], [0.105, yFlo], [rO, yFlo], [rO, yLid], [0.058, yLid]], 'turned', o({}));
  // the slit valve the wafer travels through, in the far wall, and a viewport
  var svA = tv + Math.PI, sv = [];
  for (var k = 0; k <= 16; k++) { var aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 + 0.03, rI * 0.995 * Math.sin(aa)]); }
  for (k = 16; k >= 0; k--) { aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 - 0.03, rI * 0.995 * Math.sin(aa)]); }
  m.decal(vs, [-Math.cos(svA), 0, -Math.sin(svA)], [{ pts: sv, closed: true, fill: 'mid', lw: 0.8 }]);
  m.dim([rI * Math.cos(a0), yLid, rI * Math.sin(a0)], [rI * Math.cos(a1), yLid, rI * Math.sin(a1)], [0, 0.13, 0], '500 mm', { t: 0.2 });
  // chuck: aluminium base, ceramic puck, focus ring and stem
  var chk = m.part('chuck', { pri: 1, mode: 'fixed' });
  var yPed = -0.025, pedH = 0.088;
  m.revolve([[0.058, yFlo], [0.072, yFlo], [0.072, yPed - pedH], [0.058, yPed - pedH]], 'turned', o({}));
  m.revolve([[0, yPed - pedH], [0.17, yPed - pedH], [0.17, yPed - 0.014], [0, yPed - 0.014]], 'turned', o({}));
  m.revolve([[0, yPed - 0.014], [0.17, yPed - 0.014], [0.17, yPed], [0, yPed]], 'turnedDark', o({ cut: 'cutDense' }));
  m.revolve([[0.154, yPed], [0.185, yPed], [0.185, yPed + 0.010], [0.154, yPed + 0.010]], 'turnedDark', o({ cut: 'cutDense' }));
  // the wafer
  var wfp = m.part('wafer', { pri: 2 });
  m.revolve([[0, yPed], [0.15, yPed], [0.15, yPed + 0.004], [0, yPed + 0.004]], 'turned', o({ cut: 'cutDense' }));
  // the plasma: a violet glow over the wafer, brightest in the sheath just above it (stippled: lines cannot draw a glow)
  var plp = m.part('plasma', { pri: 3 });
  var glow = [], seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  var gTop = 0.058, gBot = yPed + 0.006, gR = 0.178;
  while (glow.length < 900) {
    var r = Math.sqrt(rnd()) * gR, an = a0 + rnd() * (a1 - a0), f = rnd(), y = gBot + (f < 0.38 ? rnd() * 0.012 : rnd() * (gTop - gBot));
    glow.push([r * Math.cos(an), y, r * Math.sin(an)]);
  }
  m.dots(glow, { col: 'acc', r: 0.8, alpha: 0.55, c: [0, 0.02, 0] });
  // showerhead: face plate, plenum wall, backing plate, with its gas holes cut through the face plate
  m.part('shower', { pri: 4 });
  var holes = [];
  for (var rr = 0.012; rr < 0.2; rr += 0.0132) holes.push({ pts: [[rr, 0.0625], [rr, 0.0915]].map(function (q) { return [q[0], q[1], 0]; }), col: 'bg', lw: 1.1 });
  var hcut = function (arr) { return arr.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1]]; }), col: it.col, lw: it.lw }; }); };
  m.revolve([[0, 0.062], [0.205, 0.062], [0.205, 0.142], [0, 0.142], [0, 0.128], [0.193, 0.128], [0.193, 0.092], [0, 0.092]], 'turned', o({ cut0: hcut(holes), cut1: hcut(holes) }));
  // the lid feed: gas in, RF on, lifted off
  var lid = m.part('lid', { pri: 5, ex: [0, 0.10, 0], seq: 1 });
  m.revolve([[0.03, yLid], [0.058, yLid], [0.058, yLid + 0.078], [0.03, yLid + 0.078]], 'turned', o({}));
  m.revolve([[0.03, yLid + 0.078], [0.086, yLid + 0.078], [0.086, yLid + 0.10], [0.03, yLid + 0.10]], 'turnedDark', o({}));
  m.revolve([[0, yLid + 0.10], [0.026, yLid + 0.10], [0.026, yLid + 0.152], [0, yLid + 0.152]], 'turned', o({}));
  m.guide([[0, yLid, 0, ves.idx], [0, yLid + 0.17, 0, lid.idx]], { style: 'axis', alpha: 0.85 });
  // gate valve and turbopump, dropped away below
  var gate = m.part('gate', { pri: -1, ex: [0, -0.07, 0], seq: 2 });
  m.box({ c: [0.026, yFlo - 0.048, 0], s: [0.296, 0.05, 0.232] }, 'mid');
  var pump = m.part('pump', { pri: -2, ex: [0, -0.14, 0], seq: 3 });
  var bl = [];
  for (k = 0; k < 30; k++) { var ba = k * TAU / 30; bl.push(D.line([0.046 * Math.cos(ba), 0.074, 0.046 * Math.sin(ba)], [0.128 * Math.cos(ba + 0.3), 0.074, 0.128 * Math.sin(ba + 0.3)], { lw: 0.4, alpha: 0.75 })); }
  m.revolve([[0, -0.074], [0.146, -0.074], [0.146, 0.074], [0.13, 0.074], [0.13, 0.068], [0, 0.068]], 'turned', { seg: 40, pos: [0, yFlo - 0.2, 0], top: bl.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1] - 0.006, q[2]]; }), lw: 0.4, alpha: 0.7 }; }) });
  m.cyl([0.228, yFlo - 0.23, 0], 0.03, 0.165, 'turned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.guide([[0, yFlo, 0, ves.idx], [0, yFlo - 0.36, 0, pump.idx]], { style: 'axis', alpha: 0.85 });
  void gate;
  var cu = [Math.cos(a0), Math.sin(a0)], cw = [Math.cos(a1), Math.sin(a1)];
  m.callout([(rI + rO) / 2 * cw[0], 0.10, (rI + rO) / 2 * cw[1], ves.idx], 'Vessel', { side: 'r' });
  m.callout([0.06 * cu[0], 0.035, 0.06 * cu[1], plp.idx], 'Plasma', { side: 'l' });
  m.callout([0.135 * cw[0], yPed + 0.004, 0.135 * cw[1], wfp.idx], 'Wafer', { side: 'r' });
  m.callout([0.11 * cu[0], yPed - 0.05, 0.11 * cu[1], chk.idx], 'Chuck', { side: 'l' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [109, 92, 201], accentDark: [176, 164, 240] };
});
