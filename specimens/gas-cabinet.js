/* Specimen: specialty gas supply. Units are metres.
 *
 * Left, the hero: a three-cylinder gas cabinet with its door off. Real
 * dimensions, from a supplier's catalogue: 38 in wide, 19 in deep, 76 in tall
 * (0.97 x 0.48 x 1.93 m), with a 6-8 in exhaust collar on top, holding
 * cylinders about 9 in across. Inside: restraint bars, coiled pigtails, and
 * the gas panel on the back wall - regulator, double block and bleed, purge
 * and vent legs, gauges - with the process line leaving through the side wall
 * by way of a point-of-use filter. That panel is the copper.
 *
 * Right, set back: a vertical bulk liquid cylinder. The brief called for a
 * horizontal dewar on legs, but a horizontal drum is a wide blank mass that
 * doubles the width of a portrait drawing and dwarfs the cabinet; the upright
 * liquid cylinder is what actually stands in a fab gas bay, and it keeps the
 * composition tall.
 */
PC.register('gas-cabinet', function (p) {
  var parts = [], i, x;
  function add() { for (var k = 0; k < arguments.length; k++) if (arguments[k]) parts.push(arguments[k]); }
  function at(c, px, py, pz, rot) { return PC.T(c, { pos: [px, py, pz], rot: rot }); }
  function dial(r, per, t, px, py, pz) {          // a gauge face looking out at +Z
    return PC.T(PC.circle({ r: r, perUnit: per, tone: t }), { rot: [Math.PI / 2, 0, 0], pos: [px, py, pz] });
  }

  var CBX = -0.30;                                 // cabinet centre on X
  var CW = 0.97, CD = 0.48, CPL = 0.12, CTOP = 1.93;
  var CH = CTOP - CPL, CY = (CPL + CTOP) / 2;

  /* ================= the cabinet ================= */

  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nz'], n: 7000, tone: 0.16 }), CBX, CY, 0));   // inside the back
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nx'], n: 3000, tone: 0.15 }), CBX, CY, 0));   // inside the far side
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['px'], n: 5200, tone: 0.26 }), CBX, CY, 0));   // outside the near side
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['py'], n: 2000, tone: 0.44 }), CBX, CY, 0));
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['ny'], n: 2600, tone: 0.40 }), CBX, CY, 0));
  add(at(PC.boxEdges({ w: CW, h: CH, d: CD, perUnit: 240, tone: 0.95 }), CBX, CY, 0));
  // louvred inlet grille low on the near side wall
  add(at(PC.polyline({ pts: [[0, -0.17, -0.15], [0, -0.17, 0.15], [0, 0.17, 0.15], [0, 0.17, -0.15]], closed: true, perUnit: 260, tone: 1 }),
        CBX + CW / 2 + 0.003, CPL + 0.34, 0));
  for (i = 0; i < 5; i++) {
    add(PC.line({ a: [CBX + CW / 2 + 0.003, CPL + 0.22 + i * 0.055, -0.13], b: [CBX + CW / 2 + 0.003, CPL + 0.22 + i * 0.055, 0.13], perUnit: 260, tone: 0.8 }));
  }
  // door frame return around the open front, hinges and latch
  add(at(PC.polyline({
    pts: [[-CW / 2 + 0.055, -CH / 2 + 0.04, 0], [CW / 2 - 0.055, -CH / 2 + 0.04, 0],
          [CW / 2 - 0.055, CH / 2 - 0.04, 0], [-CW / 2 + 0.055, CH / 2 - 0.04, 0]],
    closed: true, perUnit: 240, tone: 0.9
  }), CBX, CY, CD / 2 - 0.010));
  for (i = 0; i < 3; i++) {
    add(at(PC.box({ w: 0.045, h: 0.09, d: 0.045, n: 190, tone: 0.6 }), CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045));
    add(at(PC.boxEdges({ w: 0.045, h: 0.09, d: 0.045, perUnit: 300, tone: 1 }), CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045));
  }
  // plinth
  add(at(PC.box({ w: CW, h: CPL, d: CD, faces: ['px', 'nx', 'pz', 'nz'], n: 1600, tone: 0.42 }), CBX, CPL / 2, 0));
  add(at(PC.boxEdges({ w: CW, h: CPL, d: CD, perUnit: 260, tone: 0.95 }), CBX, CPL / 2, 0));
  // exhaust plenum and the 8 in collar that takes the cabinet to the scrubber
  add(at(PC.box({ w: 0.66, h: 0.17, d: 0.40, n: 2400, tone: 0.42 }), CBX, CTOP + 0.085, -0.02));
  add(at(PC.boxEdges({ w: 0.66, h: 0.17, d: 0.40, perUnit: 280, tone: 1 }), CBX, CTOP + 0.085, -0.02));
  add(at(PC.cylinder({ r: 0.102, h: 0.40, caps: false, n: 2000, tone: 0.44 }), CBX, CTOP + 0.37, -0.02));
  add(at(PC.circle({ r: 0.102, perUnit: 320, tone: 1 }), CBX, CTOP + 0.57, -0.02));
  add(at(PC.torus({ R: 0.122, r: 0.016, n: 620, tone: 0.7 }), CBX, CTOP + 0.20, -0.02));
  // sprinkler head under the cabinet roof
  add(at(PC.cylinder({ r: 0.016, h: 0.055, caps: false, n: 160, tone: 0.6 }), CBX + 0.20, CTOP - 0.055, -0.05));
  add(at(PC.circle({ r: 0.030, perUnit: 340, tone: 0.85 }), CBX + 0.20, CTOP - 0.082, -0.05));
  // two restraint bars across the bottles
  [0.58, 1.04].forEach(function (by) {
    add(at(PC.box({ w: CW - 0.13, h: 0.038, d: 0.038, n: 340, tone: 0.55 }), CBX, by, 0.045));
    add(at(PC.boxEdges({ w: CW - 0.13, h: 0.038, d: 0.038, perUnit: 280, tone: 1 }), CBX, by, 0.045));
  });

  /* ================= three cylinders ================= */

  var cylX = [-0.29, 0.0, 0.29], cylH = [1.16, 1.16, 0.98], CR = 0.114, cz = -0.055;
  var valveTop = [];
  for (i = 0; i < 3; i++) {
    x = CBX + cylX[i];
    var b0 = CPL, b1 = CPL + cylH[i], sh = b1 + 0.11;
    add(at(PC.cylinder({ r: CR, h: cylH[i], caps: false, n: 5200, tone: 0.5 }), x, (b0 + b1) / 2, cz));
    add(at(PC.cone({ r1: CR, r2: 0.034, h: 0.11, n: 900, tone: 0.46 }), x, b1 + 0.055, cz));
    add(at(PC.circle({ r: CR * 1.004, perUnit: 300, tone: 1 }), x, b1, cz));                  // shoulder
    add(at(PC.circle({ r: CR * 1.004, perUnit: 220, tone: 0.75 }), x, b1 - 0.085, cz));       // painted band
    add(at(PC.circle({ r: CR * 1.004, perUnit: 220, tone: 0.75 }), x, b1 - 0.135, cz));
    add(at(PC.polyline({ pts: [[-0.045, -0.055, 0], [0.045, -0.055, 0], [0.045, 0.055, 0], [-0.045, 0.055, 0]], closed: true, perUnit: 260, tone: 0.85 }),
          x, b0 + 0.66, cz + CR * 1.01));                                                     // label
    add(at(PC.circle({ r: CR * 1.004, perUnit: 200, tone: 0.5 }), x, b0 + 0.02, cz));         // foot ring
    // neck ring, valve body, handwheel
    add(at(PC.torus({ R: 0.045, r: 0.011, n: 300, tone: 0.6 }), x, sh + 0.005, cz));
    add(at(PC.box({ w: 0.058, h: 0.078, d: 0.058, n: 260, tone: 0.5 }), x, sh + 0.058, cz));
    add(at(PC.boxEdges({ w: 0.058, h: 0.078, d: 0.058, perUnit: 300, tone: 1 }), x, sh + 0.058, cz));
    valveTop.push([x, sh + 0.100, cz]);
  }

  /* ================= the gas panel (copper) ================= */

  var PZ = -CD / 2 + 0.035, PY0 = 1.44, man = [];
  // panel plate on the back wall
  man.push(PC.T(PC.plane({ w: 0.84, d: 0.46, n: 2400, tone: 0.26 }), { rot: [Math.PI / 2, 0, 0], pos: [CBX - 0.02, PY0 + 0.25, PZ] }));
  man.push(PC.T(PC.polyline({
    pts: [[-0.42, 0, -0.23], [0.42, 0, -0.23], [0.42, 0, 0.23], [-0.42, 0, 0.23]], closed: true, perUnit: 300, tone: 1
  }), { rot: [Math.PI / 2, 0, 0], pos: [CBX - 0.02, PY0 + 0.25, PZ + 0.004] }));
  // process header running across the panel, and the vent header above it
  man.push(PC.line({ a: [CBX - 0.40, PY0 + 0.06, PZ + 0.03], b: [CBX + 0.40, PY0 + 0.06, PZ + 0.03], perUnit: 300, tone: 1 }));
  man.push(PC.line({ a: [CBX - 0.40, PY0 + 0.44, PZ + 0.03], b: [CBX + 0.40, PY0 + 0.44, PZ + 0.03], perUnit: 300, tone: 1 }));
  for (i = 0; i < 3; i++) {
    var v = valveTop[i], px = CBX + cylX[i];
    // coiled pigtail from the cylinder valve up to the panel
    man.push(PC.T(PC.helix({ r: 0.048, pitch: 0.038, turns: 2.6, perUnit: 260, tone: 1 }), { pos: [v[0] + 0.048, v[1] + 0.08, v[2]] }));
    man.push(PC.line({ a: [v[0], v[1], v[2]], b: [v[0] + 0.096, v[1] + 0.03, v[2]], perUnit: 260, tone: 1 }));
    man.push(PC.polyline({ pts: [[v[0] + 0.096, v[1] + 0.13, v[2]], [v[0] + 0.096, PY0 - 0.02, v[2]], [px, PY0 - 0.02, PZ + 0.03], [px, PY0 + 0.06, PZ + 0.03]], perUnit: 260, tone: 1 }));
    // two valve blocks in series on each leg: block, bleed
    man.push(PC.T(PC.box({ w: 0.058, h: 0.062, d: 0.058, n: 260, tone: 1 }), { pos: [px, PY0 + 0.06, PZ + 0.03] }));
    man.push(PC.T(PC.boxEdges({ w: 0.058, h: 0.062, d: 0.058, perUnit: 300, tone: 1 }), { pos: [px, PY0 + 0.06, PZ + 0.03] }));
    man.push(PC.T(PC.box({ w: 0.052, h: 0.056, d: 0.052, n: 230, tone: 1 }), { pos: [px, PY0 + 0.44, PZ + 0.03] }));
    man.push(PC.T(PC.boxEdges({ w: 0.052, h: 0.056, d: 0.052, perUnit: 300, tone: 1 }), { pos: [px, PY0 + 0.44, PZ + 0.03] }));
    man.push(PC.line({ a: [px, PY0 + 0.10, PZ + 0.03], b: [px, PY0 + 0.41, PZ + 0.03], perUnit: 260, tone: 1 }));
    // gauge over each leg
    man.push(dial(0.050, 320, 1, px, PY0 + 0.265, PZ + 0.055));
    man.push(dial(0.020, 320, 1, px, PY0 + 0.265, PZ + 0.055));
  }
  // regulator body and the process line leaving through the side wall,
  // by way of the point-of-use filter
  man.push(PC.T(PC.cylinder({ r: 0.048, h: 0.052, n: 380, tone: 1 }), { pos: [CBX + 0.40, PY0 + 0.06, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.048, perUnit: 320, tone: 1 }), { pos: [CBX + 0.40, PY0 + 0.086, PZ + 0.03] }));
  man.push(PC.polyline({ pts: [[CBX + 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 - 0.16, PZ + 0.03], [CBX + CW / 2 + 0.19, PY0 - 0.16, PZ + 0.03]], perUnit: 260, tone: 1 }));
  man.push(PC.T(PC.cylinder({ r: 0.030, h: 0.115, n: 340, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.115, PY0 - 0.16, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.038, perUnit: 320, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.058, PY0 - 0.16, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.038, perUnit: 320, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.172, PY0 - 0.16, PZ + 0.03] }));
  // vent leg up into the exhaust plenum
  man.push(PC.polyline({ pts: [[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX - 0.40, CTOP - 0.03, PZ + 0.03]], perUnit: 260, tone: 1 }));
  add(PC.accent(PC.merge.apply(null, man), 0.95));

  /* ================= the bulk liquid cylinder ================= */

  var TX = 0.86, TZ = -0.40, TR = 0.205, TB = 0.15, TT = 1.06;
  add(PC.T(PC.cylinder({ r: TR, h: TT - TB, caps: false, n: 7000, tone: 0.25 }), { pos: [TX, (TB + TT) / 2, TZ] }));
  add(PC.T(PC.sphere({ r: TR, thetaMax: Math.PI / 2, n: 2000, tone: 0.28 }), { scale: [1, 0.52, 1], pos: [TX, TT, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.004, perUnit: 300, tone: 1 }), { pos: [TX, TT, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.004, perUnit: 300, tone: 1 }), { pos: [TX, TB, TZ] }));
  [0.30, 0.48, 0.66, 0.84].forEach(function (ry) { add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 200, tone: 0.5 }), { pos: [TX, ry, TZ] })); });
  add(PC.line({ a: [TX - TR * 0.71, TB, TZ + TR * 0.71], b: [TX - TR * 0.71, TT, TZ + TR * 0.71], perUnit: 220, tone: 0.42 }));
  // skirt base with three feet
  add(PC.T(PC.cylinder({ r: TR * 0.86, h: TB, caps: false, n: 1600, tone: 0.36 }), { pos: [TX, TB / 2, TZ] }));
  add(PC.T(PC.circle({ r: TR * 0.86, perUnit: 280, tone: 0.9 }), { pos: [TX, 0.012, TZ] }));
  for (i = 0; i < 3; i++) {
    var fa = i * Math.PI * 2 / 3 + 0.4;
    add(PC.T(PC.cylinder({ r: 0.030, h: 0.030, n: 160, tone: 0.5 }), { pos: [TX + TR * 0.78 * Math.cos(fa), 0.015, TZ + TR * 0.78 * Math.sin(fa)] }));
  }
  for (i = 0; i < 3; i++) {
    var ca2 = i * Math.PI * 2 / 3 + 0.9;
    add(PC.T(PC.torus({ R: 0.030, r: 0.010, n: 260, tone: 0.6 }), { rot: [Math.PI / 2, 0, 0], pos: [TX + TR * 0.74 * Math.cos(ca2), 0.030, TZ + TR * 0.74 * Math.sin(ca2)] }));
  }
  add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 300, tone: 0.85 }), { pos: [TX, 1.00, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 300, tone: 0.85 }), { pos: [TX, 0.94, TZ] }));

  // top collar and the valve cluster it protects
  add(PC.T(PC.torus({ R: TR * 0.96, r: 0.018, n: 900, tone: 0.62 }), { pos: [TX, TT + 0.20, TZ] }));
  for (i = 0; i < 4; i++) {
    var pa = i * Math.PI * 2 / 4 + 0.5;
    add(PC.line({ a: [TX + TR * 0.94 * Math.cos(pa), TT + 0.03, TZ + TR * 0.94 * Math.sin(pa)],
                  b: [TX + TR * 0.96 * Math.cos(pa), TT + 0.20, TZ + TR * 0.96 * Math.sin(pa)], perUnit: 300, tone: 0.7 }));
  }
  add(PC.T(PC.box({ w: 0.16, h: 0.075, d: 0.10, n: 700, tone: 0.42 }), { pos: [TX, TT + 0.10, TZ + 0.02] }));
  add(PC.T(PC.boxEdges({ w: 0.16, h: 0.075, d: 0.10, perUnit: 300, tone: 0.95 }), { pos: [TX, TT + 0.10, TZ + 0.02] }));
  for (i = 0; i < 3; i++) {
    add(PC.T(PC.torus({ R: 0.030, r: 0.007, n: 200, tone: 0.72 }), { pos: [TX - 0.058 + i * 0.058, TT + 0.155, TZ + 0.02] }));
    add(PC.T(PC.cylinder({ r: 0.008, h: 0.030, caps: false, n: 90, tone: 0.6 }), { pos: [TX - 0.058 + i * 0.058, TT + 0.152, TZ + 0.02] }));
  }
  add(dial(0.042, 320, 0.9, TX + 0.055, TT + 0.10, TZ + 0.075));
  add(dial(0.016, 320, 0.9, TX + 0.055, TT + 0.10, TZ + 0.075));
  // relief valve and the vertical vaporiser coil on the jacket
  add(PC.T(PC.cylinder({ r: 0.026, h: 0.085, caps: false, n: 200, tone: 0.55 }), { pos: [TX - 0.10, TT + 0.145, TZ - 0.06] }));
  add(PC.T(PC.circle({ r: 0.034, perUnit: 320, tone: 0.9 }), { pos: [TX - 0.10, TT + 0.188, TZ - 0.06] }));
  add(PC.T(PC.helix({ r: 0.042, pitch: 0.046, turns: 5, perUnit: 300, tone: 0.7 }), { pos: [TX - TR - 0.046, 0.60, TZ + 0.02] }));
  add(PC.polyline({ pts: [[TX - TR - 0.046, 0.72, TZ + 0.02], [TX - TR - 0.046, TT + 0.06, TZ + 0.02], [TX - 0.08, TT + 0.06, TZ + 0.02]], perUnit: 260, tone: 0.7 }));
  add(PC.polyline({ pts: [[TX - TR - 0.046, 0.49, TZ + 0.02], [TX - TR - 0.046, 0.32, TZ + 0.02], [TX - TR + 0.02, 0.32, TZ + 0.02]], perUnit: 260, tone: 0.7 }));
  // liquid-level gauge and nameplate on the shell
  add(PC.T(PC.polyline({ pts: [[-0.10, 0, -0.07], [0.10, 0, -0.07], [0.10, 0, 0.07], [-0.10, 0, 0.07]], closed: true, perUnit: 280, tone: 0.9 }),
        { rot: [Math.PI / 2, 0, 0], pos: [TX, 0.88, TZ + TR * 1.01] }));
  add(PC.T(PC.polyline({ pts: [[-0.055, 0, -0.045], [0.055, 0, -0.045], [0.055, 0, 0.045], [-0.055, 0, 0.045]], closed: true, perUnit: 280, tone: 0.8 }),
        { rot: [Math.PI / 2, 0, 0], pos: [TX, 0.42, TZ + TR * 1.01] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.24, -0.50, 0],
    caption: 'A specialty gas cabinet with its door off: three cylinders strapped behind restraint bars, coiled pigtails climbing to the gas panel on the back wall, and the exhaust collar that takes any leak to the scrubber. The panel is in copper - regulator, block and bleed valves, gauges, purge and vent legs - with the process line leaving through the side wall through a point-of-use filter. Behind it stands a bulk liquid cylinder.'
  };
});
