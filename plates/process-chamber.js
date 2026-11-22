/* =====================================================================================================
   06 Deposition and etch: a plasma etch chamber cut in half, in metres, around one wafer on its chuck. Only the wafer is a true
   size, 300 mm across and 775 micrometres thick (SEMI M1); the chamber's own sizes (a 500 mm bore, a 30 to 40 mm plasma gap)
   came from the old specimen file with no allowed source, so the plate carries no dimension and the caption says the
   chamber is drawn for illustration (22 Nov 2026 review).
   The plasma is a crisp violet lens, a revolved solid in a clear violet, with two fine lines over the wafer for the sheath
   (it was 900 random dots, some outside the gap). The gas feed on the lid lifts off and the pump drops away below, each
   labelled in the chapter's words ("a pump empties the chamber", "a measured flow of gas comes in"); the gate valve is left
   out. The loupe (etch-loupe) shows one hole cut ten times deeper than it is wide, the ratio from which US rules have
   controlled the tools that etch holes through silicon since December 2024 (chapter 6). Colours (the set's legend): the
   plasma in violet, the wafer in silicon slate (acc2), as on every plate. */
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
  // chuck: aluminium base, ceramic puck, focus ring and stem
  var chk = m.part('chuck', { pri: 1, mode: 'fixed' });
  var yPed = -0.025, pedH = 0.088;
  m.revolve([[0.058, yFlo], [0.072, yFlo], [0.072, yPed - pedH], [0.058, yPed - pedH]], 'turned', o({}));
  m.revolve([[0, yPed - pedH], [0.17, yPed - pedH], [0.17, yPed - 0.014], [0, yPed - 0.014]], 'turned', o({}));
  m.revolve([[0, yPed - 0.014], [0.17, yPed - 0.014], [0.17, yPed], [0, yPed]], 'turnedDark', o({ cut: 'cutDense' }));
  m.revolve([[0.154, yPed], [0.185, yPed], [0.185, yPed + 0.010], [0.154, yPed + 0.010]], 'turnedDark', o({ cut: 'cutDense' }));
  // the wafer, at its true thickness
  var wfp = m.part('wafer', { pri: 2 });
  var WT = 0.000775;
  m.revolve([[0, yPed], [0.15, yPed], [0.15, yPed + WT], [0, yPed + WT]], 'acc2Light', o({ cut: 'cutAcc2' }));
  // the plasma: a lens of clear violet between the wafer and the showerhead, and two fine lines just over the wafer, the sheath
  var plp = m.part('plasma', { pri: 3 });
  var gTop = 0.058, gBot = yPed + 0.006, gR = 0.168, PL = { d: 0.16, c: 'acc', alpha: 0.6 };
  m.revolve([[0, gBot], [gR * 0.9, gBot], [gR, gBot + 0.008, 0], [gR * 1.02, (gBot + gTop) / 2, 0], [gR, gTop - 0.008, 0], [gR * 0.9, gTop], [0, gTop]], PL, o({ cut: { d: 0.22, c: 'acc' }, seg: 56 }));
  [0.0035, 0.0065].forEach(function (dy) { var sh = []; for (var k2 = 0; k2 <= 24; k2++) { var an = a0 + (a1 - a0) * k2 / 24; sh.push([0.15 * Math.cos(an), yPed + WT + dy, 0.15 * Math.sin(an)]); } m.wire(sh, { col: 'acc', lw: 0.6, alpha: 0.85, c: [0, yPed + 0.01, 0] }); });
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
  // the turbopump, dropped away below
  var pump = m.part('pump', { pri: -2, ex: [0, -0.14, 0], seq: 3 });
  var bl = [];
  for (k = 0; k < 30; k++) { var ba = k * TAU / 30; bl.push(D.line([0.046 * Math.cos(ba), 0.074, 0.046 * Math.sin(ba)], [0.128 * Math.cos(ba + 0.3), 0.074, 0.128 * Math.sin(ba + 0.3)], { lw: 0.4, alpha: 0.75 })); }
  m.revolve([[0, -0.074], [0.146, -0.074], [0.146, 0.074], [0.13, 0.074], [0.13, 0.068], [0, 0.068]], 'turned', { seg: 40, pos: [0, yFlo - 0.2, 0], top: bl.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1] - 0.006, q[2]]; }), lw: 0.4, alpha: 0.7 }; }) });
  m.cyl([0.228, yFlo - 0.23, 0], 0.03, 0.165, 'turned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.guide([[0, yFlo, 0, ves.idx], [0, yFlo - 0.36, 0, pump.idx]], { style: 'axis', alpha: 0.85 });
  var cu = [Math.cos(a0), Math.sin(a0)], cw = [Math.cos(a1), Math.sin(a1)];
  m.callout([0.03 * cw[0], yLid + 0.13, 0.03 * cw[1], lid.idx], 'Gas in', { side: 'r' });
  // (designer pass, 22 Nov 2026: the plasma is named from the right, on the lens's own cut face, and the loupe takes the wafer's
  // left side, so neither the plasma's leader nor the loupe's cone runs across the whole chamber)
  m.callout([0.1 * cw[0], 0.03, 0.1 * cw[1], plp.idx], 'Plasma', { side: 'r' });
  m.callout([0.148 * cw[0], yPed + WT, 0.148 * cw[1], wfp.idx], 'Wafer', { side: 'r' });
  m.callout([0.168 * cu[0], yPed - 0.05, 0.168 * cu[1], chk.idx], 'Chuck', { side: 'l' });
  m.callout([0.146 * cw[0], yFlo - 0.2, 0.146 * cw[1], pump.idx], 'Pump', { side: 'r' });
  var lt = a0 + 0.55, loupe = { model: 'etch-loupe', at: [0.1 * Math.cos(lt), yPed + WT, 0.1 * Math.sin(lt)], part: 'wafer', side: 'l', r: 0.15, rMax: 92, scale: 0.8, dx: -0.12, caption: ['A hole ten times', 'deeper than it is wide'] };
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, loupe: loupe, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

/* The loupe's plate: a cut through the wafer's surface with one hole etched into it, ten times deeper than it is wide, the
   ratio in the US rule of December 2024 that chapter 6 cites. The hole's real size depends on the chip, so it carries no
   figure; the ratio is the point. A mask of photoresist lies on top, opened over the hole.
   22 Nov 2026 designer pass: one block of silicon, cut down the hole's axis and seen a little from above, so the hole reads as
   a round hole, its far half a curved wall and its mouth a half circle in the top face (it was three separate boxes, which read
   as two pillars with a slot between them). The names stand beside the block, each with a short leader. */
R('etch-loupe', function (m) {
  var tag = PLATE.loupeTag;
  m.part('st', { mode: 'stack' });
  var W = 1, Dp = 10, X0 = -3.1, X1 = 3.1, Y0 = -Dp - 1.5, RT = 0.7, Dz = 2.6, N = 14;
  /* a block x X0..X1, y ya..yb, z -Dz..0 (its cut face toward the reader at z = 0), with the far half of a round hole of
     radius r down its axis from its top to y = yh (a blind hole has a floor there; yh = ya runs it through) */
  // the hole's wall a shade deeper than the block's faces, so it reads as a hollow
  var wallMat = { d: 0.42, c: 'acc2', even: true };
  function holeBlock(ya, yb, yh, r, mat, cutMat, blind) {
    var s = m.begin(mat, { sortFaces: true }), v = function (x, y, z) { return m.v([x, y, z]); };
    var th = []; for (var j = 0; j <= N; j++) th.push(Math.PI + Math.PI * j / N);
    var At = th.map(function (t) { return v(r * Math.cos(t), yb, r * Math.sin(t)); }), Ab = th.map(function (t) { return v(r * Math.cos(t), yh, r * Math.sin(t)); });
    var T0 = v(X0, yb, 0), T1 = v(X1, yb, 0), T2 = v(X1, yb, -Dz), T3 = v(X0, yb, -Dz), B0 = v(X0, ya, 0), B1 = v(X1, ya, 0), B2 = v(X1, ya, -Dz), B3 = v(X0, ya, -Dz);
    var cut = { mat: cutMat };
    if (blind) m.face([B0, B1, T1, At[N], Ab[N], Ab[0], At[0], T0], [0, 0, 1], cut);
    else { m.face([B0, Ab[0], At[0], T0], [0, 0, 1], cut); m.face([Ab[N], B1, T1, At[N]], [0, 0, 1], cut); }
    m.face([T0, At[0]].concat(At.slice(1, N), [At[N], T1, T2, T3]), [0, 1, 0]);
    m.face([B1, B2, T2, T1], [1, 0, 0]); m.face([B0, T0, T3, B3], [-1, 0, 0]); m.face([B3, T3, T2, B2], [0, 0, -1]);
    if (blind) m.face([B0, B3, B2, B1], [0, -1, 0]); else m.face([B0, B3, B2, B1, Ab[N]].concat(Ab.slice(1, N).reverse(), [Ab[0]]), [0, -1, 0]);
    for (j = 0; j < N; j++) {
      var tm = (th[j] + th[j + 1]) / 2;
      m.face([Ab[j], Ab[j + 1], At[j + 1], At[j]], [-Math.cos(tm), 0, -Math.sin(tm)], { curve: true, mj: j, mat: wallMat });
      if (j > 0) m.ecls(Ab[j], At[j], 0);
    }
    if (blind) m.face(Ab.slice(), [0, 1, 0]);
    return m.end();
  }
  holeBlock(Y0, 0, -Dp, W / 2, 'acc2Light', 'cutAcc2', true);
  holeBlock(0, RT, 0, W / 2, 'mid', { d: 0.08, hatch: 1, ang: 45, gap: 2.2 }, false);
  tag(m, [X1 + 1.5, RT + 1.1, 0], 'Resist', { align: 'left', lead: [X1 - 0.6, RT, -0.9] });
  tag(m, [X1 + 1.5, -6.2, 0], 'Silicon', { align: 'left', lead: [X1, -5.2, -1.1] });
  return { elev: 0.3, yaw: -0.32, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});
