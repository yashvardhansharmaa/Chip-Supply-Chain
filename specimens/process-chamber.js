/* Specimen: a plasma etch chamber, half-sectioned.
 *
 * Point clouds do not occlude, so a quarter-cut vessel still reads as a
 * transparent drum. This is drawn instead as a true half-section: everything in
 * front of one diametral plane is removed, and the plane itself is drawn as
 * solid cut material with bright edges. What is left is the textbook chamber
 * drawing: gas plenum and perforated showerhead above, a 300 mm wafer clamped
 * to an electrostatic chuck inside its focus ring below, the plasma between
 * them, the slit valve in the wall, and the gate valve and turbopump under the
 * floor.
 *
 * Proportions: 500 mm bore, ~370 mm inner height, 42 mm wall, 300 mm wafer.
 * The electrode gap is drawn about twice its true 30-40 mm so the plasma has
 * somewhere to live. Copper is the plasma and nothing else.
 */
PC.register('process-chamber', function (p) {
  var rI = 0.250, rO = 0.292;                  // 500 mm bore, 42 mm wall
  var yTop = 0.160, yBot = -0.212;             // inner ceiling / floor
  var wall = 0.030;
  var wafR = 0.150, yWaf = -0.020;             // 300 mm wafer
  var shR = 0.205, shT = 0.030, ySh = 0.062;   // showerhead face plate
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  /* The section plane. At tilt [0.3, -0.6, 0] the azimuth nearest the reader is
     about 0.97 rad; the whole half in front of that plane goes. */
  var AC = 0.97, A0 = AC - Math.PI / 2, A1 = AC + Math.PI / 2;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]);
      var d = a - AC; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      if (Math.abs(d) < Math.PI / 2) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // Solid cut material on the section plane, from radius ra to rb, both sides.
  function face(ra, rb, y0, y1, tn, dens) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      var n = Math.max(50, Math.round((rb - ra) * (y1 - y0) * (dens == null ? 3.6 : dens) * PC.k));
      var c = new Float32Array(n * 4);
      for (var i = 0; i < n; i++) {
        var u = ra + PC.rnd() * (rb - ra), v = y0 + PC.rnd() * (y1 - y0);
        c[i * 4] = u * ca; c[i * 4 + 1] = v; c[i * 4 + 2] = u * sa; c[i * 4 + 3] = tn;
      }
      g.push(c);
      g.push(PC.polyline({
        pts: [[ra * ca, y0, ra * sa], [rb * ca, y0, rb * sa], [rb * ca, y1, rb * sa], [ra * ca, y1, ra * sa]],
        closed: true, perUnit: 460, tone: 1
      }));
    }
    return PC.merge.apply(null, g);
  }
  // A bright line across the section plane at height y.
  function cutLine(r, y, tn) {
    return PC.line({ a: [r * Math.cos(A0), y, r * Math.sin(A0)], b: [r * Math.cos(A1), y, r * Math.sin(A1)], perUnit: 520, tone: tn });
  }
  function bolts(r, y, n, rad, tn) {
    var g = [];
    for (var i = 0; i < n; i++) {
      var a = i * Math.PI * 2 / n + 0.05;
      g.push(PC.T(PC.circle({ r: rad, perUnit: 340, tone: tn }), { pos: [r * Math.cos(a), y, r * Math.sin(a)] }));
    }
    return cut(PC.merge.apply(null, g));
  }

  /* ---------- vessel ---------- */

  var yMid = (yTop + yBot) / 2, yLid = yTop + wall, yFlo = yBot - wall;
  add(PC.T(cut(PC.cylinder({ r: rO, h: yLid - yFlo, caps: false, n: 9000, tone: 0.36 })), { pos: [0, (yLid + yFlo) / 2, 0] }));
  add(PC.T(cut(PC.cylinder({ r: rI, h: yTop - yBot, caps: false, n: 4200, tone: 0.115 })), { pos: [0, yMid, 0] }));
  add(face(rI, rO, yFlo, yLid, 0.6));                                    // the wall, sectioned
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 3600, tone: 0.3 }), { pos: [0, yFlo, 0] })));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 2000, tone: 0.16 }), { pos: [0, yBot, 0] })));
  add(face(0.105, rO, yFlo, yBot, 0.6));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.058, n: 3600, tone: 0.3 }), { pos: [0, yLid, 0] })));
  add(face(0.058, rO, yTop, yLid, 0.6));
  var rims = [[rO, yLid], [rO, yFlo], [rI, yTop], [rI, yBot]];
  for (var i = 0; i < rims.length; i++) add(cut(PC.T(PC.circle({ r: rims[i][0], perUnit: 420, tone: 0.95 }), { pos: [0, rims[i][1], 0] })));
  add(bolts(rO - 0.018, yLid + 0.001, 20, 0.0095, 0.85));
  add(bolts(rO - 0.018, yFlo - 0.001, 20, 0.0095, 0.7));

  /* ---------- showerhead and its gas plenum ---------- */

  var yPlen = ySh + shT, yBack = yPlen + 0.036;
  add(cut(PC.T(PC.cylinder({ r: shR, h: shT, caps: false, n: 1300, tone: 0.32 }), { pos: [0, ySh + shT / 2, 0] })));
  add(cut(PC.T(PC.disc({ r: shR, n: 2400, tone: 0.22 }), { pos: [0, ySh, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 460, tone: 1 }), { pos: [0, ySh, 0] })));
  add(face(0, shR, ySh, yPlen, 0.64));                                   // face plate, sectioned
  add(cut(PC.T(PC.cylinder({ r: shR * 0.94, h: 0.036, caps: false, n: 900, tone: 0.22 }), { pos: [0, yPlen + 0.018, 0] })));
  add(face(shR * 0.94, shR, yPlen, yBack, 0.6));                         // plenum wall
  add(cut(PC.T(PC.disc({ r: shR, n: 1600, tone: 0.26 }), { pos: [0, yBack, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 380, tone: 0.9 }), { pos: [0, yBack, 0] })));
  add(face(0, shR, yBack, yBack + 0.014, 0.6));                          // backing plate
  add(cutLine(shR, ySh, 1));
  // a few thousand gas holes: a hex array over the wafer
  var holes = [], sp = 0.0132;
  for (var hx = -20; hx <= 20; hx++) for (var hz = -20; hz <= 20; hz++) {
    var x = hx * sp + (hz & 1 ? sp / 2 : 0), z = hz * sp * 0.866;
    if (x * x + z * z > (shR - 0.010) * (shR - 0.010)) continue;
    holes.push(x, ySh - 0.0016, z, 0.9);
  }
  add(cut(new Float32Array(holes)));

  /* ---------- lid stack: gas in, RF on ---------- */

  add(PC.T(PC.cylinder({ r: 0.058, h: 0.078, caps: false, n: 1200, tone: 0.34 }), { pos: [0, yLid + 0.039, 0] }));
  add(PC.T(PC.circle({ r: 0.058, perUnit: 460, tone: 0.9 }), { pos: [0, yLid, 0] }));
  add(PC.T(PC.cylinder({ r: 0.086, h: 0.022, n: 1200, tone: 0.3 }), { pos: [0, yLid + 0.089, 0] }));
  add(PC.T(PC.circle({ r: 0.086, perUnit: 460, tone: 0.95 }), { pos: [0, yLid + 0.100, 0] }));
  add(PC.T(PC.cylinder({ r: 0.026, h: 0.052, caps: false, n: 520, tone: 0.42 }), { pos: [0, yLid + 0.126, 0] }));
  add(PC.T(PC.circle({ r: 0.038, perUnit: 520, tone: 0.95 }), { pos: [0, yLid + 0.152, 0] }));
  add(PC.T(PC.box({ w: 0.112, h: 0.054, d: 0.088, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.28 }), { pos: [-0.150, yLid + 0.062, 0.062] }));
  add(PC.T(PC.boxEdges({ w: 0.112, h: 0.054, d: 0.088, perUnit: 420, tone: 0.95 }), { pos: [-0.150, yLid + 0.062, 0.062] }));
  add(PC.T(PC.cylinder({ r: 0.0105, h: 0.118, caps: false, n: 320, tone: 0.6 }), { rot: [0, 0, Math.PI / 2], pos: [-0.037, yLid + 0.062, 0.062] }));
  for (i = 0; i < 2; i++) add(PC.T(PC.cylinder({ r: 0.0085, h: 0.070, caps: false, n: 230, tone: 0.55 }), { pos: [-0.178 + i * 0.056, yLid + 0.124, 0.062] }));

  /* ---------- electrostatic chuck, focus ring, wafer ---------- */

  var pedR = 0.170, yPed = yWaf - 0.005, pedH = 0.088;
  add(cut(PC.T(PC.cylinder({ r: pedR, h: pedH, caps: false, n: 1700, tone: 0.32 }), { pos: [0, yPed - pedH / 2, 0] })));
  add(face(0, pedR, yPed - pedH, yPed - 0.014, 0.5));                    // aluminium base plate
  add(face(0, pedR, yPed - 0.014, yPed, 0.8));                           // the ceramic puck
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 440, tone: 0.95 }), { pos: [0, yPed, 0] })));
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 300, tone: 0.6 }), { pos: [0, yPed - pedH, 0] })));
  add(cutLine(pedR, yPed, 1));
  for (i = 0; i < 5; i++) {                                              // helium cooling channels
    var hxr = 0.032 + i * 0.030;
    add(PC.T(PC.circle({ r: 0.0075, perUnit: 420, tone: 0.9 }), { rot: [Math.PI / 2, Math.PI / 2 - A0, 0], pos: [hxr * Math.cos(A0), yPed - 0.032, hxr * Math.sin(A0)] }));
    add(PC.T(PC.circle({ r: 0.0075, perUnit: 420, tone: 0.9 }), { rot: [Math.PI / 2, Math.PI / 2 - A1, 0], pos: [hxr * Math.cos(A1), yPed - 0.032, hxr * Math.sin(A1)] }));
  }
  add(cut(PC.T(PC.disc({ r: 0.185, rIn: wafR + 0.004, n: 1300, tone: 0.45 }), { pos: [0, yPed + 0.005, 0] })));
  add(cut(PC.T(PC.circle({ r: 0.185, perUnit: 480, tone: 1 }), { pos: [0, yPed + 0.005, 0] })));
  add(cut(PC.T(PC.circle({ r: wafR + 0.004, perUnit: 260, tone: 0.7 }), { pos: [0, yPed + 0.005, 0] })));
  add(face(wafR + 0.004, 0.185, yPed, yPed + 0.010, 0.7));
  add(cut(PC.T(PC.disc({ r: wafR, n: 2400, tone: 0.34 }), { pos: [0, yWaf, 0] })));
  add(cut(PC.T(PC.circle({ r: wafR, perUnit: 420, tone: 1 }), { pos: [0, yWaf + 0.001, 0] })));
  add(cutLine(wafR, yWaf + 0.001, 1));
  add(cut(PC.T(PC.cylinder({ r: 0.072, h: 0.150, caps: false, n: 1200, tone: 0.28 }), { pos: [0, yPed - pedH - 0.075, 0] })));
  add(face(0.058, 0.072, yFlo, yPed - pedH, 0.55));
  for (i = 0; i < 5; i++) add(cut(PC.T(PC.circle({ r: 0.081, perUnit: 300, tone: 0.55 }), { pos: [0, yPed - pedH - 0.020 - i * 0.026, 0] })));
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.095, caps: false, n: 480, tone: 0.36 }), { pos: [0, yFlo - 0.048, 0] }));
  add(PC.T(PC.box({ w: 0.150, h: 0.082, d: 0.120, faces: ['py', 'px', 'pz', 'nz', 'ny'], n: 1500, tone: 0.26 }), { pos: [0.150, yFlo - 0.112, 0.095] }));
  add(PC.T(PC.boxEdges({ w: 0.150, h: 0.082, d: 0.120, perUnit: 420, tone: 0.9 }), { pos: [0.150, yFlo - 0.112, 0.095] }));
  add(PC.T(PC.cylinder({ r: 0.010, h: 0.145, caps: false, n: 230, tone: 0.55 }), { rot: [0, 0, Math.PI / 2], pos: [0.070, yFlo - 0.112, 0.095] }));

  /* ---------- the plasma ---------- */

  var gTop = ySh - 0.004, gBot = yWaf + 0.003, gR = wafR + 0.028;
  var glowN = 11000, glow = new Float32Array(glowN * 4), j = 0;
  while (j < glowN) {
    var gx = (PC.rnd() - 0.5) * 2 * gR, gz = (PC.rnd() - 0.5) * 2 * gR;
    if (gx * gx + gz * gz > gR * gR) continue;
    var ga = Math.atan2(gz, gx), gd = ga - AC;
    while (gd > Math.PI) gd -= Math.PI * 2; while (gd < -Math.PI) gd += Math.PI * 2;
    if (Math.abs(gd) < Math.PI / 2) continue;
    var gy = gBot + PC.rnd() * (gTop - gBot), f = (gy - gBot) / (gTop - gBot);
    glow[j * 4] = gx; glow[j * 4 + 1] = gy; glow[j * 4 + 2] = gz;
    glow[j * 4 + 3] = 2 + (f < 0.14 ? 0.42 : 0.11 + 0.10 * (1 - f));
    j++;
  }
  add(glow);

  /* ---------- slit valve, in the wall that is left standing ---------- */

  var svA = AC + Math.PI, svHalf = 0.42, svH = 0.030, sv = [], k, t, aa;
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf + svH, rI * Math.sin(aa)]); }
  for (k = 30; k >= 0; k--) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf - svH, rI * Math.sin(aa)]); }
  add(PC.polyline({ pts: sv, closed: true, perUnit: 560, tone: 1 }));
  var dv = [];
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf * 1.28 + t * 2 * svHalf * 1.28; dv.push([(rO + 0.026) * Math.cos(aa), 0, (rO + 0.026) * Math.sin(aa)]); }
  add(PC.T(PC.polyline({ pts: dv, perUnit: 420, tone: 0.6 }), { pos: [0, yWaf + svH * 1.7, 0] }));
  add(PC.T(PC.polyline({ pts: dv, perUnit: 420, tone: 0.6 }), { pos: [0, yWaf - svH * 1.7, 0] }));
  for (k = 0; k < dv.length; k += 6) add(PC.line({ a: [dv[k][0], yWaf - svH * 1.7, dv[k][2]], b: [dv[k][0], yWaf + svH * 1.7, dv[k][2]], perUnit: 300, tone: 0.45 }));

  // viewport and gauge port in the standing wall
  var vpA = AC + Math.PI * 1.32, vpRy = Math.PI / 2 - vpA;
  add(PC.T(PC.circle({ r: 0.042, perUnit: 520, tone: 0.9 }), { rot: [Math.PI / 2, vpRy, 0], pos: [rO * Math.cos(vpA), 0.075, rO * Math.sin(vpA)] }));
  add(PC.T(PC.circle({ r: 0.029, perUnit: 400, tone: 0.6 }), { rot: [Math.PI / 2, vpRy, 0], pos: [rO * Math.cos(vpA), 0.075, rO * Math.sin(vpA)] }));
  var gpA = AC + Math.PI * 0.72, gpRy = Math.PI / 2 - gpA;
  add(PC.T(PC.cylinder({ r: 0.020, h: 0.070, caps: false, n: 300, tone: 0.4 }), { rot: [Math.PI / 2, gpRy, 0], pos: [(rO + 0.035) * Math.cos(gpA), 0.100, (rO + 0.035) * Math.sin(gpA)] }));
  add(PC.T(PC.circle({ r: 0.030, perUnit: 460, tone: 0.9 }), { rot: [Math.PI / 2, gpRy, 0], pos: [(rO + 0.070) * Math.cos(gpA), 0.100, (rO + 0.070) * Math.sin(gpA)] }));

  /* ---------- gate valve and turbopump ---------- */

  var yGate = yFlo - 0.048, yPump = yFlo - 0.200;
  add(PC.T(PC.cylinder({ r: 0.105, h: 0.048, caps: false, n: 800, tone: 0.32 }), { pos: [0, yFlo - 0.024, 0] }));
  add(PC.T(PC.box({ w: 0.296, h: 0.050, d: 0.232, n: 3400, tone: 0.28 }), { pos: [0.026, yGate, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.296, h: 0.050, d: 0.232, perUnit: 420, tone: 0.95 }), { pos: [0.026, yGate, 0] }));
  add(PC.T(PC.circle({ r: 0.098, perUnit: 440, tone: 0.85 }), { pos: [0, yGate + 0.026, 0] }));
  add(PC.T(PC.cylinder({ r: 0.146, h: 0.148, caps: false, n: 2600, tone: 0.3 }), { pos: [0, yPump, 0] }));
  add(PC.T(PC.circle({ r: 0.146, perUnit: 440, tone: 0.95 }), { pos: [0, yPump + 0.074, 0] }));
  add(PC.T(PC.circle({ r: 0.146, perUnit: 440, tone: 0.95 }), { pos: [0, yPump - 0.074, 0] }));
  add(PC.T(PC.disc({ r: 0.130, n: 1100, tone: 0.16 }), { pos: [0, yPump + 0.068, 0] }));
  for (i = 0; i < 30; i++) {                              // rotor blades, seen down the throat
    var ba = i * Math.PI * 2 / 30;
    add(PC.line({
      a: [0.046 * Math.cos(ba), yPump + 0.060, 0.046 * Math.sin(ba)],
      b: [0.128 * Math.cos(ba + 0.30), yPump + 0.073, 0.128 * Math.sin(ba + 0.30)],
      perUnit: 460, tone: 0.65
    }));
  }
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.030, n: 420, tone: 0.5 }), { pos: [0, yPump + 0.060, 0] }));
  add(PC.T(PC.cylinder({ r: 0.030, h: 0.165, caps: false, n: 700, tone: 0.36 }), { rot: [0, 0, Math.PI / 2], pos: [0.228, yPump - 0.030, 0] }));
  add(PC.T(PC.circle({ r: 0.040, perUnit: 460, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [0.308, yPump - 0.030, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.3, -0.6, 0],
    caption: 'A plasma etch chamber cut in half. Gas fills the plenum in the lid and drops through a few thousand holes in the showerhead onto a 300 mm wafer clamped to an electrostatic chuck inside its focus ring; the copper haze between them is the plasma, brightest in the sheath just above the wafer. Below the floor, the gate valve and the turbopump; in the wall, the slit valve the wafer travels through.'
  };
});
