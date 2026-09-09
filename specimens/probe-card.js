/* Specimen: a vertical probe card over a wafer.
 *
 * Real object: a circular multilayer PCB about twelve inches across - wider than
 * the 300 mm wafer it works on - with a stiffener bolted over it that sets the
 * reference plane, a multi-layer ceramic space transformer hung underneath to fan
 * the tester's coarse pitch down to the die's, and a probe head of vertical
 * probes held between an upper and a lower guide plate. A probe card for a large
 * logic device carries four to five thousand probes at 80 to 150 um pitch, and
 * every tip must sit within about 25 um of the same plane.
 *
 * Sources: Tektronix's probe card tutorial (PCB layer counts, planarity, tip
 * geometry, overdrive), Glew Engineering on the twelve-inch card and the 4,000-pin
 * GPU array, and FormFactor/Technoprobe patents for the stiffener, MLC space
 * transformer and two-guide-plate probe head.
 *
 * Drawing decisions:
 *  - The card was previously drawn smaller than the wafer and with a hole through
 *    the middle. A vertical card is a solid disc slightly larger than the wafer.
 *  - The probes are drawn bowed between the two guide plates, which is what a
 *    buckling-beam probe does under overdrive, and is the only way a few hundred
 *    lines read as separate wires rather than a black bar.
 *  - Heights are exaggerated: a real card rides a millimetre or two off the wafer.
 */
PC.register('probe-card', function (p) {
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function seg(a, b, per, tn) { return PC.line({ a: a, b: b, perUnit: per, tone: tn }); }
  function ring(r, y, per, tn) { return PC.T(PC.circle({ r: r, perUnit: per, tone: tn }), { pos: [0, y, 0] }); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  var Rw = 1.00, Rc = 1.02, Rch = 1.08;        // wafer 300 mm, card 305 mm, chuck
  var tWaf = 0.028, wafTop = tWaf / 2;
  var dw = 0.20, dh = 0.245;                    // reticle-sized dies on the wafer

  // heights, measured from the wafer surface
  var yTip = wafTop, yLo = wafTop + 0.082, tG = 0.020;
  var yLoTop = yLo + tG, yUp = yLoTop + 0.082, yUpTop = yUp + tG;
  var stH = 0.100, yST = yUpTop + 0.052, stW = 0.50;
  var tPcb = 0.052, pcbBot = yST + stH + 0.030, pcbTop = pcbBot + tPcb;
  var gW = 0.40, hW = 0.46;                     // guide plates, probe-head frame

  /* ---------------- the printed circuit board ---------------- */
  add(PC.T(PC.disc({ r: Rc, n: 12000, tone: 0.3 }), { pos: [0, pcbTop, 0] }));
  add(PC.T(PC.disc({ r: Rc, n: 6000, tone: 0.26 }), { pos: [0, pcbBot, 0] }));
  add(PC.T(PC.cylinder({ r: Rc, h: tPcb, caps: false, n: 3000, tone: 0.5 }), { pos: [0, pcbBot + tPcb / 2, 0] }));
  add(ring(Rc, pcbTop, 400, 1)); add(ring(Rc, pcbBot, 400, 0.8));
  // the pogo pads the tester head lands on: three concentric rings of contacts
  var pads = [], i, a;
  [[0.56, 72], [0.66, 84], [0.76, 96]].forEach(function (r) {
    for (i = 0; i < r[1]; i++) {
      a = i * Math.PI * 2 / r[1] + (r[0] * 10 % 2) * Math.PI / r[1];
      pads.push(PC.T(PC.circle({ r: 0.0125, perUnit: 420, tone: 0.95 }), { pos: [r[0] * Math.cos(a), pcbTop + 0.003, r[0] * Math.sin(a)] }));
    }
  });
  // edge fingers and the six bolts that hold the stiffener down
  for (i = 0; i < 72; i++) {
    a = i * Math.PI * 2 / 72;
    pads.push(seg([0.87 * Math.cos(a), pcbTop + 0.003, 0.87 * Math.sin(a)], [0.97 * Math.cos(a), pcbTop + 0.003, 0.97 * Math.sin(a)], 420, 0.85));
  }
  for (i = 0; i < 6; i++) {
    a = i * Math.PI / 3 + Math.PI / 6;
    pads.push(PC.T(PC.circle({ r: 0.032, perUnit: 460, tone: 1 }), { pos: [0.44 * Math.cos(a), pcbTop + 0.004, 0.44 * Math.sin(a)] }));
  }
  // a flat on the rim: the card only goes into the prober one way round
  pads.push(seg([-0.19, pcbTop, -0.998], [0.19, pcbTop, -0.998], 500, 1));
  pads.push(seg([-0.19, pcbBot, -0.998], [0.19, pcbBot, -0.998], 400, 0.7));
  add(PC.merge.apply(null, pads));

  /* ---------------- the stiffener that sets the reference plane ---------------- */
  var armL = 0.86, armW = 0.105, armH = 0.05, yArm = pcbTop + armH / 2;
  for (i = 0; i < 2; i++) {
    var ang = i * Math.PI / 2;
    add(PC.T(PC.box({ w: armL * 2, h: armH, d: armW, n: 1900, tone: 0.28 }), { rot: [0, -ang, 0], pos: [0, yArm, 0] }));
    add(PC.T(PC.boxEdges({ w: armL * 2, h: armH, d: armW, perUnit: 240, tone: 0.85 }), { rot: [0, -ang, 0], pos: [0, yArm, 0] }));
  }
  add(PC.T(PC.cylinder({ r: 0.20, h: armH * 1.5, n: 1600, tone: 0.32 }), { pos: [0, pcbTop + armH * 0.75, 0] }));
  add(ring(0.20, pcbTop + armH * 1.5, 420, 1));
  // three levelling screws, the ones that bring every tip into the same plane
  for (i = 0; i < 3; i++) {
    a = i * Math.PI * 2 / 3 + 0.4;
    add(PC.T(PC.cylinder({ r: 0.036, h: armH * 2.1, n: 700, tone: 0.6 }), { pos: [0.30 * Math.cos(a), pcbTop + armH * 1.05, 0.30 * Math.sin(a)] }));
    add(ring(0.036, pcbTop + armH * 2.1, 420, 1));
  }

  /* ---------------- the space transformer: multi-layer ceramic ---------------- */
  var ySTc = yST + stH / 2;
  add(PC.T(PC.box({ w: stW, h: stH, d: stW, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.22 }), { pos: [0, ySTc, 0] }));
  add(PC.T(PC.boxEdges({ w: stW, h: stH, d: stW, perUnit: 150, tone: 0.8 }), { pos: [0, ySTc, 0] }));
  for (i = 1; i < 7; i++) add(rect(stW, stW, yST + stH * i / 7, 52, 0.3));
  // the fan-out: the tester's coarse pitch on top, the die's fine pitch below
  add(PC.T(PC.dots({ nx: 15, nz: 15, sx: stW * 0.062, sz: stW * 0.062, per: 2, tone: 0.35 }), { pos: [0, yST + stH + 0.002, 0] }));

  /* ---------------- the probe head: two guide plates and the probes ---------------- */
  [[yLo, tG], [yUp, tG]].forEach(function (g) {
    add(PC.T(PC.box({ w: gW, h: g[1], d: gW, n: 700, tone: 0.22 }), { pos: [0, g[0] + g[1] / 2, 0] }));
    add(PC.T(PC.boxEdges({ w: gW, h: g[1], d: gW, perUnit: 165, tone: 0.85 }), { pos: [0, g[0] + g[1] / 2, 0] }));
  });
  for (i = 0; i < 4; i++) {
    var px = (i < 2 ? -1 : 1) * hW * 0.48, pz = (i % 2 ? -1 : 1) * hW * 0.48;
    add(seg([px, yLo, pz], [px, yUpTop, pz], 300, 0.5));
    add(seg([px, yUpTop, pz], [px, yST, pz], 300, 0.4));
  }

  // the probes themselves: an area array over a two-by-two block of dies,
  // bowed between the guide plates
  var needles = [], nx = 8, nz = 10;
  for (var gx = -1; gx <= 0; gx++) for (var gz = -1; gz <= 0; gz++) {
    var ox = (gx + 0.5) * dw, oz = (gz + 0.5) * dh;
    for (var a1 = 0; a1 < nx; a1++) for (var b1 = 0; b1 < nz; b1++) {
      var qx = ox + (a1 - (nx - 1) / 2) * (dw * 0.80 / (nx - 1));
      var qz = oz + (b1 - (nz - 1) / 2) * (dh * 0.80 / (nz - 1));
      var th = PC.rnd() * Math.PI * 2, bo = 0.011 + PC.rnd() * 0.006;
      needles.push(PC.polyline({
        pts: [[qx, yTip, qz], [qx, yLo + tG * 0.4, qz],
              [qx + bo * Math.cos(th), (yLoTop + yUp) / 2, qz + bo * Math.sin(th)],
              [qx, yUp + tG * 0.6, qz], [qx, yUpTop + 0.004, qz]],
        perUnit: 150, tone: 0.5
      }));
    }
  }
  add(PC.merge.apply(null, needles));

  /* ---------------- the wafer on the chuck ---------------- */
  var body = PC.cylinder({ r: Rw, h: tWaf, n: 22000, tone: 0.36 }), keep = [];
  for (i = 0; i < body.length; i += 4) {
    var bx = body[i], bz = body[i + 2];
    if (Math.sqrt(bx * bx + (bz - Rw) * (bz - Rw)) < 0.052) continue;   // notch
    keep.push(bx, body[i + 1], bz, body[i + 3]);
  }
  add(new Float32Array(keep));
  add(ring(Rw, wafTop, 440, 1));

  var grid = [], probed = [], cx, cz;
  for (gx = -5; gx <= 5; gx++) for (gz = -5; gz <= 4; gz++) {
    cx = (gx + 0.5) * dw; cz = (gz + 0.5) * dh;
    var cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < (Rw - 0.02) * (Rw - 0.02); })) continue;
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) { probed.push([cx, cz]); continue; }
    grid.push(PC.T(rect(dw, dh, 0, 200, 0.9), { pos: [cx, wafTop + 0.002, cz] }));
  }
  add(PC.merge.apply(null, grid));

  // the four dies under the needles, in copper
  var site = [];
  probed.forEach(function (c) {
    site.push(PC.T(PC.plane({ w: dw * 0.97, d: dh * 0.97, n: 900 }), { pos: [c[0], wafTop + 0.0022, c[1]] }));
    site.push(PC.T(rect(dw, dh, 0, 300, 1), { pos: [c[0], wafTop + 0.003, c[1]] }));
  });
  site.push(PC.T(rect(2 * dw, 2 * dh, 0, 520, 1), { pos: [0, wafTop + 0.004, 0] }));
  add(PC.accent(PC.merge.apply(null, site), 0.9));

  // chuck: wider than the wafer, with the vacuum grooves that hold it flat
  var tCh = 0.13, yCh = -tWaf / 2 - tCh / 2;
  add(PC.T(PC.cylinder({ r: Rch, h: tCh, n: 13000, tone: 0.28 }), { pos: [0, yCh, 0] }));
  add(ring(Rch, yCh + tCh / 2, 340, 0.9)); add(ring(Rch, yCh - tCh / 2, 340, 0.7));
  [0.42, 0.68, 0.94, 1.06].forEach(function (r) { add(ring(r, yCh + tCh / 2 + 0.001, 200, 0.45)); });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.46, -0.62, 0],
    caption: 'A vertical probe card over a wafer: a twelve-inch circular board, wider than the wafer it tests, with the tester\'s contact rings on top and a stiffener bolted across it whose three screws bring every needle into the same plane. Under it hangs a ceramic space transformer that fans the tester\'s coarse pitch down to the pitch of the pads, and a probe head whose needles bow between two guide plates before landing on four dies at once, picked out in copper. The height between the card and the wafer is exaggerated; in the prober it is a millimetre or two.'
  };
});
