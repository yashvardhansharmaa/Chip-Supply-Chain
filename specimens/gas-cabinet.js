/* Specimen: specialty gas supply. Units are metres.
 * Left: a three-bottle gas cabinet with the door off — a ventilated steel
 * enclosure with an exhaust plenum and duct on top, three cylinders of
 * different heights strapped to restraint bars, each with a valve and
 * handwheel, coiled pigtails running up to a header, and a purge panel.
 * The whole valve manifold is drawn in copper.
 * Right: a horizontal bulk dewar on saddle legs with a vent stack.
 */
PC.register('gas-cabinet', function (p) {
  var parts = [], i, k, x, y;
  var CBX = -0.85;                                   // cabinet centre on X
  var CW = 1.15, CD = 0.62, CFL = 0.10, CTOP = 2.05; // width, depth, floor, top
  var CH = CTOP - CFL, CY = (CFL + CTOP) / 2;

  function at(c, px, py, pz, rot) { return PC.T(c, { pos: [px, py, pz], rot: rot }); }
  // a ring standing in the YZ plane (for a tank rib) or lying flat (default)
  function ringYZ(r, per, t, px, py, pz) {
    return PC.T(PC.circle({ r: r, perUnit: per, tone: t }), { rot: [0, 0, Math.PI / 2], pos: [px, py, pz] });
  }
  function gauge(r, per, t, px, py, pz) {              // a dial facing +Z
    return PC.T(PC.circle({ r: r, perUnit: per, tone: t }), { rot: [Math.PI / 2, 0, 0], pos: [px, py, pz] });
  }

  // ================= the cabinet =================
  // shell: back, two sides, top and floor. The front (+z) is open.
  parts.push(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nz'], n: 11000, tone: 0.20 }), CBX, CY, 0));  // inside of the back
  parts.push(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nx'], n: 3600, tone: 0.20 }), CBX, CY, 0));   // inside of the far wall
  parts.push(at(PC.box({ w: CW, h: CH, d: CD, faces: ['px'], n: 8000, tone: 0.44 }), CBX, CY, 0));   // outside of the near wall
  parts.push(at(PC.box({ w: CW, h: CH, d: CD, faces: ['py'], n: 2400, tone: 0.44 }), CBX, CY, 0));
  parts.push(at(PC.box({ w: CW, h: CH, d: CD, faces: ['ny'], n: 3600, tone: 0.42 }), CBX, CY, 0));
  // louvre slots in the near wall
  for (i = 0; i < 5; i++) {
    parts.push(at(PC.polyline({
      pts: [[0, -0.02, -0.20], [0, -0.02, 0.20], [0, 0.02, 0.20], [0, 0.02, -0.20]], closed: true, perUnit: 190, tone: 0.85
    }), CBX + CW / 2 + 0.002, CFL + 1.52 + i * 0.075, 0));
  }
  parts.push(at(PC.boxEdges({ w: CW, h: CH, d: CD, perUnit: 200, tone: 0.95 }), CBX, CY, 0));
  // door frame return around the open front, and three hinge blocks
  parts.push(at(PC.polyline({
    pts: [[-CW / 2 + 0.07, -CH / 2 + 0.05, 0], [CW / 2 - 0.07, -CH / 2 + 0.05, 0],
          [CW / 2 - 0.07, CH / 2 - 0.05, 0], [-CW / 2 + 0.07, CH / 2 - 0.05, 0]],
    closed: true, perUnit: 190, tone: 0.9
  }), CBX, CY, CD / 2 - 0.012));
  for (i = 0; i < 3; i++) {
    parts.push(at(PC.box({ w: 0.05, h: 0.10, d: 0.05, n: 130, tone: 0.6 }), CBX + CW / 2 + 0.02, CFL + 0.32 + i * 0.66, CD / 2 - 0.05));
    parts.push(at(PC.boxEdges({ w: 0.05, h: 0.10, d: 0.05, perUnit: 200, tone: 1 }), CBX + CW / 2 + 0.02, CFL + 0.32 + i * 0.66, CD / 2 - 0.05));
  }
  // plinth
  parts.push(at(PC.box({ w: CW, h: CFL, d: CD, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.42 }), CBX, CFL / 2, 0));
  parts.push(at(PC.boxEdges({ w: CW, h: CFL, d: CD, perUnit: 200, tone: 0.95 }), CBX, CFL / 2, 0));
  // exhaust plenum and duct
  parts.push(at(PC.box({ w: 0.72, h: 0.20, d: 0.48, n: 2200, tone: 0.42 }), CBX, CTOP + 0.10, -0.02));
  parts.push(at(PC.boxEdges({ w: 0.72, h: 0.20, d: 0.48, perUnit: 220, tone: 1 }), CBX, CTOP + 0.10, -0.02));
  parts.push(at(PC.cylinder({ r: 0.095, h: 0.28, caps: false, n: 1300, tone: 0.42 }), CBX, CTOP + 0.34, -0.02));
  parts.push(at(PC.circle({ r: 0.095, perUnit: 240, tone: 1 }), CBX, CTOP + 0.48, -0.02));
  parts.push(at(PC.torus({ R: 0.115, r: 0.016, n: 500, tone: 0.7 }), CBX, CTOP + 0.22, -0.02));
  // two cylinder restraint bars across the front of the bottles
  [0.62, 1.20].forEach(function (by) {
    parts.push(at(PC.box({ w: 1.00, h: 0.045, d: 0.045, n: 260, tone: 0.55 }), CBX, by, 0.05));
    parts.push(at(PC.boxEdges({ w: 1.00, h: 0.045, d: 0.045, perUnit: 210, tone: 1 }), CBX, by, 0.05));
  });

  // ================= three gas cylinders =================
  var cylX = [-0.34, 0.0, 0.34], cylH = [1.14, 0.96, 0.80], CR = 0.115, cz = -0.09;
  var valveTop = [];
  for (i = 0; i < 3; i++) {
    x = CBX + cylX[i];
    var b0 = CFL, b1 = CFL + cylH[i], sh = b1 + 0.12;
    parts.push(at(PC.cylinder({ r: CR, h: cylH[i], caps: false, n: 3000, tone: 0.38 }), x, (b0 + b1) / 2, cz));
    parts.push(at(PC.cone({ r1: CR, r2: 0.036, h: 0.12, n: 620, tone: 0.46 }), x, b1 + 0.06, cz));
    parts.push(at(PC.circle({ r: CR * 1.004, perUnit: 220, tone: 1 }), x, b1, cz));          // shoulder line
    // a painted band and a label plate on the body
    parts.push(at(PC.circle({ r: CR * 1.004, perUnit: 200, tone: 0.8 }), x, b1 - 0.10, cz));
    parts.push(at(PC.circle({ r: CR * 1.004, perUnit: 200, tone: 0.8 }), x, b1 - 0.16, cz));
    parts.push(at(PC.polyline({
      pts: [[-0.05, -0.06, 0], [0.05, -0.06, 0], [0.05, 0.06, 0], [-0.05, 0.06, 0]], closed: true, perUnit: 200, tone: 0.85
    }), x, b0 + 0.62, cz + CR * 1.01));
    // neck ring, valve body, handwheel and outlet
    parts.push(at(PC.torus({ R: 0.048, r: 0.012, n: 220, tone: 0.6 }), x, sh + 0.01, cz));
    parts.push(at(PC.box({ w: 0.062, h: 0.085, d: 0.062, n: 150, tone: 0.55 }), x, sh + 0.065, cz));
    parts.push(at(PC.boxEdges({ w: 0.062, h: 0.085, d: 0.062, perUnit: 200, tone: 1 }), x, sh + 0.065, cz));
    parts.push(at(PC.accent(PC.torus({ R: 0.046, r: 0.009, n: 170, tone: 1 }), 0.9), x, sh + 0.115, cz));
    valveTop.push([x, sh + 0.115, cz]);
  }

  // ================= the valve manifold (accent) =================
  var hy = 1.72, hz = -0.20, man = [];
  man.push(PC.T(PC.cylinder({ r: 0.017, h: 0.98, caps: false, n: 700, tone: 1 }),
    { rot: [0, 0, Math.PI / 2], pos: [CBX, hy, hz] }));                                       // header
  for (i = 0; i < 3; i++) {
    var v = valveTop[i], cy0 = v[1] + 0.03;
    man.push(PC.T(PC.helix({ r: 0.052, pitch: 0.042, turns: 2.5, perUnit: 210, tone: 1 }),
      { pos: [v[0] + 0.052, cy0 + 0.053, v[2]] }));                                           // coiled pigtail
    man.push(PC.line({ a: [v[0], v[1], v[2]], b: [v[0] + 0.104, cy0, v[2]], perUnit: 210, tone: 1 }));
    man.push(PC.polyline({
      pts: [[v[0] + 0.104, cy0 + 0.106, v[2]], [v[0] + 0.104, hy - 0.10, v[2]],
            [v[0] + 0.104, hy, hz], [CBX + cylX[i] + 0.104, hy, hz]],
      perUnit: 210, tone: 1
    }));
    man.push(PC.T(PC.box({ w: 0.05, h: 0.055, d: 0.05, n: 110, tone: 1 }), { pos: [v[0] + 0.104, hy, hz] }));
    man.push(PC.T(PC.boxEdges({ w: 0.05, h: 0.055, d: 0.05, perUnit: 190, tone: 1 }), { pos: [v[0] + 0.104, hy, hz] }));
  }
  // purge panel on the back wall with three dials, and the vent line to the plenum
  man.push(PC.T(PC.box({ w: 0.46, h: 0.24, d: 0.05, faces: ['pz', 'py', 'ny', 'px', 'nx'], n: 460, tone: 0.55 }), { pos: [CBX - 0.05, 1.94, -0.255] }));
  man.push(PC.T(PC.boxEdges({ w: 0.46, h: 0.24, d: 0.05, perUnit: 200, tone: 1 }), { pos: [CBX - 0.05, 1.94, -0.255] }));
  for (i = 0; i < 3; i++) {
    man.push(gauge(0.045, 200, 1, CBX - 0.05 + (i - 1) * 0.14, 1.94, -0.228));
    man.push(gauge(0.018, 200, 1, CBX - 0.05 + (i - 1) * 0.14, 1.94, -0.228));
  }
  man.push(PC.polyline({ pts: [[CBX + 0.44, hy, hz], [CBX + 0.44, 1.94, hz], [CBX + 0.18, 1.94, hz]], perUnit: 210, tone: 1 }));
  parts.push(PC.accent(PC.merge.apply(null, man), 0.95));

  // ================= the bulk dewar =================
  var TX = 1.18, TY = 0.95, TZ = -0.18, TR = 0.42, TL = 1.30;
  parts.push(PC.T(PC.cylinder({ r: TR, h: TL, caps: false, n: 11000, tone: 0.30 }),
    { rot: [0, 0, Math.PI / 2], pos: [TX, TY, TZ] }));
  [-1, 1].forEach(function (sg) {                                                             // dished ends
    parts.push(PC.T(PC.sphere({ r: TR, thetaMax: Math.PI / 2, n: 2400, tone: 0.34 }),
      { scale: [1, 0.52, 1], rot: [0, 0, -sg * Math.PI / 2], pos: [TX + sg * TL / 2, TY, TZ] }));
    parts.push(ringYZ(TR * 1.004, 260, 1, TX + sg * TL / 2, TY, TZ));
  });
  [-0.46, -0.16, 0.16, 0.46].forEach(function (dx) {                                          // stiffening ribs
    parts.push(ringYZ(TR * 1.006, 190, 0.6, TX + dx, TY, TZ));
  });
  parts.push(PC.line({ a: [TX - TL / 2, TY + TR * 1.004, TZ], b: [TX + TL / 2, TY + TR * 1.004, TZ], perUnit: 200, tone: 0.55 }));
  // saddle legs and floor rails
  [-1, 1].forEach(function (sg) {
    var lx = TX + sg * 0.44;
    parts.push(PC.T(PC.box({ w: 0.085, h: 0.55, d: 0.62, faces: ['px', 'nx', 'pz', 'nz'], n: 1300, tone: 0.4 }), { pos: [lx, 0.275, TZ] }));
    parts.push(PC.T(PC.boxEdges({ w: 0.085, h: 0.55, d: 0.62, perUnit: 200, tone: 1 }), { pos: [lx, 0.275, TZ] }));
    parts.push(PC.T(PC.box({ w: 0.14, h: 0.05, d: 0.74, n: 260, tone: 0.5 }), { pos: [lx, 0.025, TZ] }));
  });
  // vent stack, relief valve and the outlet manifold slung under the tank
  parts.push(PC.T(PC.cylinder({ r: 0.052, h: 0.40, caps: false, n: 700, tone: 0.45 }), { pos: [TX - 0.28, TY + TR + 0.18, TZ] }));
  parts.push(PC.T(PC.circle({ r: 0.052, perUnit: 230, tone: 1 }), { pos: [TX - 0.28, TY + TR + 0.38, TZ] }));
  parts.push(PC.T(PC.torus({ R: 0.07, r: 0.014, n: 240, tone: 0.65 }), { pos: [TX - 0.28, TY + TR + 0.02, TZ] }));
  parts.push(PC.T(PC.box({ w: 0.30, h: 0.26, d: 0.24, n: 900, tone: 0.42 }), { pos: [TX + 0.02, 0.34, TZ + 0.34] }));
  parts.push(PC.T(PC.boxEdges({ w: 0.30, h: 0.26, d: 0.24, perUnit: 210, tone: 1 }), { pos: [TX + 0.02, 0.34, TZ + 0.34] }));
  parts.push(PC.polyline({
    pts: [[TX + 0.02, 0.47, TZ + 0.34], [TX + 0.02, 0.62, TZ + 0.34], [TX + 0.02, 0.66, TZ + 0.10]],
    perUnit: 210, tone: 0.8
  }));
  parts.push(gauge(0.042, 200, 0.9, TX + 0.02, 0.40, TZ + 0.46));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.25, -0.7, 0],
    caption: 'Specialty gas supply: a ventilated gas cabinet with its door off, holding three cylinders of different heights strapped to restraint bars, each feeding a coiled pigtail up to the header. The valve manifold and purge panel are in copper. Beside it stands a bulk dewar on saddle legs with its vent stack.'
  };
});
