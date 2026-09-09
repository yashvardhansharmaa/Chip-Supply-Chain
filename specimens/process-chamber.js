/* Specimen: a plasma etch / deposition chamber, quarter-sectioned.
 * A 300 mm wafer sits on a chuck under a perforated showerhead; the gap
 * between them is filled with a copper haze standing in for the plasma.
 * The near quarter of the vessel is cut away so the inside is visible.
 */
PC.register('process-chamber', function (p) {
  var rO = 0.56, rI = 0.50, H = 0.78;      // vessel: ~500 mm bore, ~390 mm tall
  var yTop = H / 2, yBot = -H / 2;
  var wafR = 0.30, yWaf = -0.15, ySh = 0.20, shR = 0.40, shT = 0.05;
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  // Remove the quarter that faces the reader in the site view.
  var A0 = 0.13, A1 = 1.77;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]); if (a < 0) a += Math.PI * 2;
      if (a > A0 && a < A1) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // A ring of small bolt heads.
  function bolts(r, y, n, tn) {
    var g = [];
    for (var i = 0; i < n; i++) {
      var a = i * Math.PI * 2 / n + 0.05;
      g.push(PC.T(PC.disc({ r: 0.012, n: 14, tone: tn }), { pos: [r * Math.cos(a), y, r * Math.sin(a)] }));
    }
    return PC.merge.apply(null, g);
  }

  // ---------- vessel ----------
  add(cut(PC.cylinder({ r: rO, h: H, rIn: rI, caps: false, n: 11000, tone: 0.28 })));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.07, n: 3600, tone: 0.3 }), { pos: [0, yTop, 0] })));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.06, n: 3000, tone: 0.3 }), { pos: [0, yBot, 0] })));
  // liner just inside the wall
  add(cut(PC.T(PC.cylinder({ r: rI - 0.015, h: H * 0.86, caps: false, n: 3200, tone: 0.2 }), { pos: [0, 0, 0] })));
  // flange rims + bolt circles
  var rims = [[rO, yTop], [rI, yTop], [rO, yBot], [rI, yBot]];
  for (var i = 0; i < rims.length; i++) add(cut(PC.T(PC.circle({ r: rims[i][0], perUnit: 200, tone: 0.95 }), { pos: [0, rims[i][1], 0] })));
  add(cut(bolts(rO * 0.93, yTop + 0.003, 34, 0.8)));
  add(cut(bolts(rO * 0.93, yBot - 0.003, 34, 0.8)));
  // cut faces: draw the section edges so the cut reads as a cut
  for (var s = 0; s < 2; s++) {
    var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
    add(PC.polyline({
      pts: [[rI * ca, yBot, rI * sa], [rO * ca, yBot, rO * sa], [rO * ca, yTop, rO * sa], [rI * ca, yTop, rI * sa]],
      closed: true, perUnit: 420, tone: 1
    }));
  }

  // ---------- showerhead ----------
  add(cut(PC.T(PC.cylinder({ r: shR, h: shT, n: 2600, tone: 0.26 }), { pos: [0, ySh, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 420, tone: 1 }), { pos: [0, ySh - shT / 2, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 300, tone: 0.8 }), { pos: [0, ySh + shT / 2, 0] })));
  // gas holes: a ring of small mouths on the face plate, drilled through
  var holes = [];
  for (var hx = -9; hx <= 9; hx++) for (var hz = -9; hz <= 9; hz++) {
    var x = hx * 0.048 + (hz % 2 ? 0.024 : 0), z = hz * 0.044;
    if (x * x + z * z > (shR - 0.03) * (shR - 0.03)) continue;
    holes.push(PC.T(PC.disc({ r: 0.010, n: 9, tone: 0.8 }), { pos: [x, ySh - shT / 2 - 0.002, z] }));
  }
  add(cut(PC.merge.apply(null, holes)));
  // gas inlet stack on the lid
  add(PC.T(PC.cylinder({ r: 0.065, h: 0.26, caps: false, n: 1500, tone: 0.34 }), { pos: [0, yTop + 0.13, 0] }));
  add(PC.T(PC.circle({ r: 0.10, perUnit: 340, tone: 0.9 }), { pos: [0, yTop + 0.26, 0] }));
  add(PC.T(PC.circle({ r: 0.10, perUnit: 340, tone: 0.9 }), { pos: [0, yTop + 0.235, 0] }));
  add(PC.T(PC.circle({ r: 0.09, perUnit: 300, tone: 0.9 }), { pos: [0, yTop + 0.01, 0] }));
  add(PC.T(PC.cylinder({ r: 0.14, h: 0.06, n: 900, tone: 0.3 }), { pos: [0, yTop + 0.03, 0] }));

  // ---------- chuck, wafer, focus ring ----------
  add(PC.T(PC.cylinder({ r: 0.34, h: 0.10, n: 3000, tone: 0.3 }), { pos: [0, yWaf - 0.06, 0] }));
  add(PC.T(PC.circle({ r: 0.34, perUnit: 380, tone: 0.9 }), { pos: [0, yWaf - 0.011, 0] }));
  add(PC.T(PC.disc({ r: 0.36, rIn: wafR + 0.008, n: 900, tone: 0.38 }), { pos: [0, yWaf - 0.004, 0] }));
  add(PC.T(PC.circle({ r: 0.36, perUnit: 380, tone: 0.95 }), { pos: [0, yWaf - 0.003, 0] }));
  add(PC.T(PC.disc({ r: wafR, n: 1600, tone: 0.34 }), { pos: [0, yWaf, 0] }));
  add(PC.T(PC.circle({ r: wafR, perUnit: 520, tone: 1 }), { pos: [0, yWaf + 0.002, 0] }));
  add(PC.T(PC.circle({ r: wafR * 0.62, perUnit: 200, tone: 0.4 }), { pos: [0, yWaf + 0.002, 0] }));
  add(PC.T(PC.circle({ r: wafR * 0.30, perUnit: 200, tone: 0.4 }), { pos: [0, yWaf + 0.002, 0] }));
  // chuck stem, bellows and the RF feed below the floor
  add(PC.T(PC.cylinder({ r: 0.11, h: 0.22, caps: false, n: 1200, tone: 0.3 }), { pos: [0, yWaf - 0.21, 0] }));
  for (i = 0; i < 5; i++) add(PC.T(PC.circle({ r: 0.125, perUnit: 220, tone: 0.6 }), { pos: [0, yWaf - 0.14 - i * 0.035, 0] }));
  add(PC.T(PC.cylinder({ r: 0.055, h: 0.20, n: 800, tone: 0.32 }), { pos: [0, yBot - 0.10, 0] }));
  add(PC.T(PC.box({ w: 0.26, h: 0.14, d: 0.20, n: 1400, tone: 0.3 }), { pos: [0, yBot - 0.27, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.26, h: 0.14, d: 0.20, perUnit: 300, tone: 0.9 }), { pos: [0, yBot - 0.27, 0] }));

  // ---------- plasma ----------
  var glowN = 5600, glow = new Float32Array(glowN * 4), j = 0, gTop = ySh - shT / 2 - 0.01, gBot = yWaf + 0.008;
  while (j < glowN) {
    var gx = (PC.rnd() - 0.5) * 2 * shR, gz = (PC.rnd() - 0.5) * 2 * shR, gy = gBot + PC.rnd() * (gTop - gBot);
    var rr = Math.sqrt(gx * gx + gz * gz);
    if (rr > wafR + 0.03) continue;
    // brighter in the sheath just above the wafer
    var f = (gy - gBot) / (gTop - gBot);
    glow[j * 4] = gx; glow[j * 4 + 1] = gy; glow[j * 4 + 2] = gz;
    glow[j * 4 + 3] = 2 + (f < 0.10 ? 0.52 : 0.22 + 0.12 * (1 - f));
    j++;
  }
  add(glow);

  // ---------- pumping port and slit valve ----------
  var pa = 4.90, pry = Math.PI / 2 - pa;  // back-left, axis lying along the radius
  var pc = Math.cos(pa), ps = Math.sin(pa), pY = yBot + 0.17;
  add(PC.T(PC.cylinder({ r: 0.14, h: 0.36, caps: false, n: 1900, tone: 0.3 }), { rot: [Math.PI / 2, pry, 0], pos: [(rO + 0.16) * pc, pY, (rO + 0.16) * ps] }));
  add(PC.T(PC.circle({ r: 0.14, perUnit: 300, tone: 0.85 }), { rot: [Math.PI / 2, pry, 0], pos: [(rO + 0.02) * pc, pY, (rO + 0.02) * ps] }));
  add(PC.T(PC.circle({ r: 0.20, perUnit: 340, tone: 0.95 }), { rot: [Math.PI / 2, pry, 0], pos: [(rO + 0.33) * pc, pY, (rO + 0.33) * ps] }));
  add(PC.T(PC.circle({ r: 0.20, perUnit: 340, tone: 0.95 }), { rot: [Math.PI / 2, pry, 0], pos: [(rO + 0.30) * pc, pY, (rO + 0.30) * ps] }));
  // butterfly throttle valve inside the port
  add(PC.T(PC.disc({ r: 0.135, n: 800, tone: 0.5 }), { rot: [Math.PI / 2 - 0.6, pry, 0], pos: [(rO + 0.18) * pc, pY, (rO + 0.18) * ps] }));
  add(PC.T(PC.circle({ r: 0.135, perUnit: 340, tone: 0.95 }), { rot: [Math.PI / 2 - 0.6, pry, 0], pos: [(rO + 0.18) * pc, pY, (rO + 0.18) * ps] }));
  // slit valve: a slot in the wall at wafer height, with its door outside
  var sv = [], svA = 3.35, svHalf = 0.36;
  for (var k = 0; k <= 40; k++) {
    var t = k / 40, aa = svA - svHalf + t * 2 * svHalf;
    sv.push([rO * Math.cos(aa), yWaf + 0.055, rO * Math.sin(aa)]);
  }
  for (k = 40; k >= 0; k--) {
    t = k / 40; aa = svA - svHalf + t * 2 * svHalf;
    sv.push([rO * Math.cos(aa), yWaf - 0.055, rO * Math.sin(aa)]);
  }
  add(PC.polyline({ pts: sv, closed: true, perUnit: 460, tone: 1 }));
  var dv = [];
  for (k = 0; k <= 40; k++) {
    t = k / 40; aa = svA - svHalf * 1.25 + t * 2 * svHalf * 1.25;
    dv.push([(rO + 0.05) * Math.cos(aa), 0, (rO + 0.05) * Math.sin(aa)]);
  }
  add(PC.T(PC.polyline({ pts: dv, perUnit: 300, tone: 0.55 }), { pos: [0, yWaf + 0.085, 0] }));
  add(PC.T(PC.polyline({ pts: dv, perUnit: 300, tone: 0.55 }), { pos: [0, yWaf - 0.085, 0] }));
  for (k = 0; k < dv.length; k += 8) add(PC.line({ a: [dv[k][0], yWaf - 0.085, dv[k][2]], b: [dv[k][0], yWaf + 0.085, dv[k][2]], perUnit: 200, tone: 0.5 }));
  // viewport at the back
  var va = 4.6, vry = Math.PI / 2 - va;
  add(PC.T(PC.circle({ r: 0.075, perUnit: 420, tone: 0.9 }), { rot: [Math.PI / 2, vry, 0], pos: [rO * Math.cos(va), 0.12, rO * Math.sin(va)] }));
  add(PC.T(PC.circle({ r: 0.055, perUnit: 300, tone: 0.7 }), { rot: [Math.PI / 2, vry, 0], pos: [rO * Math.cos(va), 0.12, rO * Math.sin(va)] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.3, -0.6, 0],
    caption: 'An etch chamber with its front quarter cut away: process gas enters through the perforated showerhead at the top, a 300 mm wafer sits on the chuck below inside its focus ring, and the copper haze between them is the plasma. The slot on the left is the slit valve the wafer travels through.'
  };
});
