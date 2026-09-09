/* Specimen: a plasma etch chamber, sectioned.
 *
 * A third of the vessel is cut away toward the reader; the cut faces are drawn
 * as solid material with bright edges, which is what makes a cutaway read as a
 * cutaway rather than as a transparent drum. Inside: a perforated showerhead
 * fed from a plenum in the lid, a 300 mm wafer clamped to an electrostatic
 * chuck inside its focus ring, and the plasma between them. Below the floor,
 * the gate valve and turbopump; on the wall, the slit valve the wafer enters
 * through.
 *
 * Proportions: 500 mm bore, ~370 mm inner height, 300 mm wafer, ~40 mm wall.
 * The electrode gap is drawn about twice its true 30-40 mm so the plasma has
 * somewhere to live. Copper is the plasma and nothing else.
 */
PC.register('process-chamber', function (p) {
  var rI = 0.250, rO = 0.292;              // 500 mm bore, 42 mm wall
  var yTop = 0.160, yBot = -0.212;         // inner ceiling / floor
  var wafR = 0.150, yWaf = -0.020;         // 300 mm wafer
  var shR = 0.205, shT = 0.030, ySh = 0.062;   // showerhead face plate
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  /* The wedge removed toward the reader. At tilt [0.3, -0.6, 0] the nearest
     azimuth is about 0.97 rad, so the opening is centred there. */
  var AC = 0.97, AH = 1.05;
  var A0 = AC - AH, A1 = AC + AH;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]);
      var d = a - AC; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      if (Math.abs(d) < AH) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // A radial cut face: the material the section knife went through.
  function face(ra, rb, y0, y1, a, tn, dens) {
    var ca = Math.cos(a), sa = Math.sin(a);
    var n = Math.max(60, Math.round((rb - ra) * (y1 - y0) * (dens || 1) * PC.k));
    var c = new Float32Array(n * 4);
    for (var i = 0; i < n; i++) {
      var u = ra + PC.rnd() * (rb - ra), v = y0 + PC.rnd() * (y1 - y0);
      c[i * 4] = u * ca; c[i * 4 + 1] = v; c[i * 4 + 2] = u * sa; c[i * 4 + 3] = tn;
    }
    return c;
  }
  function faceEdge(ra, rb, y0, y1, a, tn) {
    var ca = Math.cos(a), sa = Math.sin(a);
    return PC.polyline({
      pts: [[ra * ca, y0, ra * sa], [rb * ca, y0, rb * sa], [rb * ca, y1, rb * sa], [ra * ca, y1, ra * sa]],
      closed: true, perUnit: 340, tone: tn
    });
  }
  // Both cut faces of an annular part.
  function faces(ra, rb, y0, y1, tn, dens) {
    return PC.merge(face(ra, rb, y0, y1, A0, tn, dens), face(ra, rb, y0, y1, A1, tn, dens),
                    faceEdge(ra, rb, y0, y1, A0, 1), faceEdge(ra, rb, y0, y1, A1, 1));
  }
  function bolts(r, y, n, rad, tn) {
    var g = [];
    for (var i = 0; i < n; i++) {
      var a = i * Math.PI * 2 / n + 0.05;
      g.push(PC.T(PC.circle({ r: rad, perUnit: 260, tone: tn }), { pos: [r * Math.cos(a), y, r * Math.sin(a)] }));
    }
    return PC.merge.apply(null, g);
  }

  /* ---------- vessel ---------- */

  var yMid = (yTop + yBot) / 2;
  add(PC.T(cut(PC.cylinder({ r: rO, h: yTop - yBot + 0.06, caps: false, n: 5200, tone: 0.3 })), { pos: [0, yMid, 0] }));
  add(PC.T(cut(PC.cylinder({ r: rI, h: yTop - yBot, caps: false, n: 3400, tone: 0.13 })), { pos: [0, yMid, 0] }));
  add(faces(rI, rO, yBot - 0.030, yTop + 0.030, 0.5, 1.1));           // the wall, in section
  // floor and ceiling, cut the same way
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 2400, tone: 0.28 }), { pos: [0, yBot - 0.030, 0] })));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 1500, tone: 0.16 }), { pos: [0, yBot, 0] })));
  add(faces(0.105, rO, yBot - 0.030, yBot, 0.5, 1.1));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.058, n: 2400, tone: 0.28 }), { pos: [0, yTop + 0.030, 0] })));
  add(faces(0.058, rO, yTop, yTop + 0.030, 0.5, 1.1));
  // rims and a bolt circle on the lid flange
  var rims = [[rO, yTop + 0.030], [rO, yBot - 0.030], [rI, yTop], [rI, yBot]];
  for (var i = 0; i < rims.length; i++) add(cut(PC.T(PC.circle({ r: rims[i][0], perUnit: 300, tone: 0.95 }), { pos: [0, rims[i][1], 0] })));
  add(cut(bolts(rO - 0.018, yTop + 0.031, 20, 0.0095, 0.85)));
  add(cut(bolts(rO - 0.018, yBot - 0.031, 20, 0.0095, 0.7)));

  /* ---------- showerhead and gas plenum ---------- */

  add(cut(PC.T(PC.cylinder({ r: shR, h: shT, caps: false, n: 900, tone: 0.3 }), { pos: [0, ySh + shT / 2, 0] })));
  add(cut(PC.T(PC.disc({ r: shR, n: 1600, tone: 0.2 }), { pos: [0, ySh, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 320, tone: 1 }), { pos: [0, ySh, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 240, tone: 0.85 }), { pos: [0, ySh + shT, 0] })));
  add(faces(0, shR, ySh, ySh + shT, 0.55, 1.1));
  // the plenum above it, and the backing plate that closes it
  add(cut(PC.T(PC.cylinder({ r: shR * 0.94, h: 0.036, caps: false, n: 700, tone: 0.22 }), { pos: [0, ySh + shT + 0.018, 0] })));
  add(cut(PC.T(PC.disc({ r: shR, n: 1100, tone: 0.24 }), { pos: [0, ySh + shT + 0.036, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 260, tone: 0.9 }), { pos: [0, ySh + shT + 0.036, 0] })));
  add(faces(shR * 0.94, shR, ySh + shT, ySh + shT + 0.036, 0.5, 1.1));
  add(faces(0, shR, ySh + shT + 0.036, ySh + shT + 0.048, 0.5, 1.1));
  // gas holes on the underside: a hex array over the wafer
  var holes = [], sp = 0.0155;
  for (var hx = -16; hx <= 16; hx++) for (var hz = -16; hz <= 16; hz++) {
    var x = hx * sp + (hz & 1 ? sp / 2 : 0), z = hz * sp * 0.866;
    var rr2 = x * x + z * z;
    if (rr2 > (shR - 0.012) * (shR - 0.012)) continue;
    holes.push(x, ySh - 0.0016, z, 0.85);
  }
  add(cut(new Float32Array(holes)));

  /* ---------- lid stack: gas feed and the upper RF electrode ---------- */

  add(PC.T(PC.cylinder({ r: 0.058, h: 0.075, caps: false, n: 700, tone: 0.32 }), { pos: [0, yTop + 0.068, 0] }));
  add(PC.T(PC.circle({ r: 0.058, perUnit: 320, tone: 0.9 }), { pos: [0, yTop + 0.030, 0] }));
  add(PC.T(PC.cylinder({ r: 0.085, h: 0.020, n: 700, tone: 0.3 }), { pos: [0, yTop + 0.115, 0] }));
  add(PC.T(PC.circle({ r: 0.085, perUnit: 320, tone: 0.95 }), { pos: [0, yTop + 0.125, 0] }));
  add(PC.T(PC.cylinder({ r: 0.026, h: 0.055, caps: false, n: 340, tone: 0.4 }), { pos: [0, yTop + 0.152, 0] }));
  add(PC.T(PC.circle({ r: 0.038, perUnit: 380, tone: 0.95 }), { pos: [0, yTop + 0.180, 0] }));
  // three process-gas lines running into the manifold
  for (i = 0; i < 3; i++) {
    var ga = -0.5 + i * 0.5;
    add(PC.T(PC.cylinder({ r: 0.011, h: 0.10, caps: false, n: 150, tone: 0.55 }), { rot: [0, 0, Math.PI / 2], pos: [Math.cos(ga) * 0.135, yTop + 0.115, Math.sin(ga) * 0.135] }));
  }
  // RF strap down to the showerhead backing plate
  add(PC.T(PC.box({ w: 0.014, h: 0.19, d: 0.030, n: 380, tone: 0.5 }), { pos: [0.150, yTop - 0.06, -0.135] }));

  /* ---------- electrostatic chuck, focus ring, wafer ---------- */

  var pedR = 0.168, yPedTop = yWaf - 0.004;
  add(cut(PC.T(PC.cylinder({ r: pedR, h: 0.062, caps: false, n: 1100, tone: 0.3 }), { pos: [0, yPedTop - 0.031, 0] })));
  add(faces(0, pedR, yPedTop - 0.062, yPedTop, 0.5, 1.1));
  // the ceramic puck reads as a thin bright band on the cut face
  add(faces(0, pedR, yPedTop - 0.013, yPedTop, 0.75, 1.1));
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 300, tone: 0.95 }), { pos: [0, yPedTop, 0] })));
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 200, tone: 0.6 }), { pos: [0, yPedTop - 0.062, 0] })));
  // focus ring around the wafer
  add(PC.T(PC.disc({ r: 0.182, rIn: wafR + 0.004, n: 900, tone: 0.42 }), { pos: [0, yPedTop + 0.004, 0] }));
  add(PC.T(PC.circle({ r: 0.182, perUnit: 340, tone: 1 }), { pos: [0, yPedTop + 0.004, 0] }));
  add(PC.T(PC.circle({ r: wafR + 0.004, perUnit: 300, tone: 0.9 }), { pos: [0, yPedTop + 0.004, 0] }));
  // the wafer itself, left whole so it reads as a disc
  add(PC.T(PC.disc({ r: wafR, n: 1500, tone: 0.3 }), { pos: [0, yWaf, 0] }));
  add(PC.T(PC.circle({ r: wafR, perUnit: 460, tone: 1 }), { pos: [0, yWaf + 0.001, 0] }));
  add(PC.T(PC.circle({ r: wafR * 0.60, perUnit: 150, tone: 0.35 }), { pos: [0, yWaf + 0.001, 0] }));
  // stem, bellows and the lower RF / helium feed
  add(cut(PC.T(PC.cylinder({ r: 0.072, h: 0.156, caps: false, n: 800, tone: 0.26 }), { pos: [0, yPedTop - 0.140, 0] })));
  add(faces(0.060, 0.072, yBot - 0.030, yPedTop - 0.062, 0.5, 1.1));
  for (i = 0; i < 5; i++) add(cut(PC.T(PC.circle({ r: 0.080, perUnit: 200, tone: 0.55 }), { pos: [0, yPedTop - 0.082 - i * 0.026, 0] })));
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.10, caps: false, n: 320, tone: 0.34 }), { pos: [0, yBot - 0.082, 0] }));
  add(PC.T(PC.box({ w: 0.155, h: 0.085, d: 0.125, faces: ['py', 'px', 'pz', 'nz'], n: 900, tone: 0.26 }), { pos: [0.145, yBot - 0.150, 0.10] }));
  add(PC.T(PC.boxEdges({ w: 0.155, h: 0.085, d: 0.125, perUnit: 300, tone: 0.9 }), { pos: [0.145, yBot - 0.150, 0.10] }));
  add(PC.T(PC.cylinder({ r: 0.010, h: 0.145, caps: false, n: 150, tone: 0.55 }), { rot: [0, 0, Math.PI / 2], pos: [0.072, yBot - 0.150, 0.10] }));

  /* ---------- the plasma ---------- */

  var gTop = ySh - 0.004, gBot = yWaf + 0.003, gR = wafR + 0.026;
  var glowN = 5200, glow = new Float32Array(glowN * 4), j = 0;
  while (j < glowN) {
    var gx = (PC.rnd() - 0.5) * 2 * gR, gz = (PC.rnd() - 0.5) * 2 * gR;
    if (gx * gx + gz * gz > gR * gR) continue;
    var gy = gBot + PC.rnd() * (gTop - gBot), f = (gy - gBot) / (gTop - gBot);
    glow[j * 4] = gx; glow[j * 4 + 1] = gy; glow[j * 4 + 2] = gz;
    // a bright sheath hugging the wafer, a thinner bulk glow above it
    glow[j * 4 + 3] = 2 + (f < 0.13 ? 0.40 : 0.10 + 0.10 * (1 - f));
    j++;
  }
  add(glow);

  /* ---------- slit valve on the wall ---------- */

  var svA = AC + Math.PI * 0.72, svHalf = 0.40, svH = 0.030;
  var sv = [], k, t, aa;
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf + svH, rI * Math.sin(aa)]); }
  for (k = 30; k >= 0; k--) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf - svH, rI * Math.sin(aa)]); }
  add(PC.polyline({ pts: sv, closed: true, perUnit: 420, tone: 1 }));
  var dv = [];
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf * 1.3 + t * 2 * svHalf * 1.3; dv.push([(rO + 0.026) * Math.cos(aa), 0, (rO + 0.026) * Math.sin(aa)]); }
  add(PC.T(PC.polyline({ pts: dv, perUnit: 300, tone: 0.6 }), { pos: [0, yWaf + svH * 1.7, 0] }));
  add(PC.T(PC.polyline({ pts: dv, perUnit: 300, tone: 0.6 }), { pos: [0, yWaf - svH * 1.7, 0] }));
  for (k = 0; k < dv.length; k += 6) add(PC.line({ a: [dv[k][0], yWaf - svH * 1.7, dv[k][2]], b: [dv[k][0], yWaf + svH * 1.7, dv[k][2]], perUnit: 200, tone: 0.45 }));

  /* ---------- gate valve and turbopump under the floor ---------- */

  var yGate = yBot - 0.078, yPump = yBot - 0.230;
  add(PC.T(PC.cylinder({ r: 0.105, h: 0.048, caps: false, n: 500, tone: 0.3 }), { pos: [0, yBot - 0.054, 0] }));
  add(PC.T(PC.box({ w: 0.30, h: 0.050, d: 0.235, faces: ['py', 'ny', 'px', 'nx', 'pz', 'nz'], n: 1900, tone: 0.26 }), { pos: [0.028, yGate, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.30, h: 0.050, d: 0.235, perUnit: 300, tone: 0.95 }), { pos: [0.028, yGate, 0] }));
  add(PC.T(PC.circle({ r: 0.098, perUnit: 300, tone: 0.85 }), { pos: [0, yGate + 0.026, 0] }));
  add(PC.T(PC.cylinder({ r: 0.145, h: 0.150, caps: false, n: 1700, tone: 0.28 }), { pos: [0, yPump, 0] }));
  add(PC.T(PC.circle({ r: 0.145, perUnit: 300, tone: 0.95 }), { pos: [0, yPump + 0.075, 0] }));
  add(PC.T(PC.circle({ r: 0.145, perUnit: 300, tone: 0.95 }), { pos: [0, yPump - 0.075, 0] }));
  add(PC.T(PC.circle({ r: 0.128, perUnit: 200, tone: 0.6 }), { pos: [0, yPump + 0.070, 0] }));
  // the top of the rotor: a ring of angled blades, seen down the throat
  for (i = 0; i < 26; i++) {
    var ba = i * Math.PI * 2 / 26;
    add(PC.line({
      a: [0.048 * Math.cos(ba), yPump + 0.062, 0.048 * Math.sin(ba)],
      b: [0.126 * Math.cos(ba + 0.30), yPump + 0.074, 0.126 * Math.sin(ba + 0.30)],
      perUnit: 320, tone: 0.6
    }));
  }
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.03, n: 260, tone: 0.5 }), { pos: [0, yPump + 0.062, 0] }));
  // foreline out to the dry pump
  add(PC.T(PC.cylinder({ r: 0.030, h: 0.170, caps: false, n: 420, tone: 0.34 }), { rot: [0, 0, Math.PI / 2], pos: [0.230, yPump - 0.030, 0] }));
  add(PC.T(PC.circle({ r: 0.040, perUnit: 320, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [0.312, yPump - 0.030, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.3, -0.6, 0],
    caption: 'A plasma etch chamber cut open. Process gas drops through a few thousand holes in the showerhead onto a 300 mm wafer clamped to an electrostatic chuck inside its focus ring; the copper haze between them is the plasma, brightest in the sheath just above the wafer. Below, the gate valve and turbopump; on the wall, the slit valve the wafer travels through.'
  };
});
