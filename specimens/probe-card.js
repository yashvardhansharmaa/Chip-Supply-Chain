/* Specimen: a probe card over a wafer.
 * A 300 mm circular PCB with a central opening, a stiffener cross on top, a
 * rectangular probe head slung underneath, and a bed of fine needles landing on
 * a six-die site (copper) on the wafer below. Chuck under the wafer.
 */
PC.register('probe-card', function (p) {
  var parts = [];
  var Rc = 0.72, hole = 0.30, tPcb = 0.05;     // card radius, central opening, thickness
  var yPcb = 0.62;                              // card mid-plane, well clear of the wafer
  var pcbTop = yPcb + tPcb / 2, pcbBot = yPcb - tPcb / 2;
  var headW = 0.62, headH = 0.10, yHead = 0.42; // space transformer block
  var gW = 0.44, gH = 0.09, yG = 0.315;         // narrower guide-plate block under it
  var headBot = yG - gH / 2;
  var tWaf = 0.03, yWaf = 0.0, Rw = 1.0;        // wafer top sits at yWaf + tWaf/2
  var wafTop = yWaf + tWaf / 2;
  var dw = 0.20, dh = 0.245;                    // die pitch on the wafer

  // ---------- the circular PCB ----------
  parts.push(PC.T(PC.disc({ r: Rc, rIn: hole, n: 8000, tone: 0.4 }), { pos: [0, pcbTop, 0] }));
  parts.push(PC.T(PC.cylinder({ r: Rc, h: tPcb, caps: false, n: 2600, tone: 0.55 }), { pos: [0, yPcb, 0] }));
  parts.push(PC.T(PC.cylinder({ r: hole, h: tPcb, caps: false, n: 1100, tone: 0.55 }), { pos: [0, yPcb, 0] }));
  [pcbTop, pcbBot].forEach(function (y) {
    parts.push(PC.T(PC.circle({ r: Rc, perUnit: 380, tone: 1 }), { pos: [0, y, 0] }));
    parts.push(PC.T(PC.circle({ r: hole, perUnit: 380, tone: 1 }), { pos: [0, y, 0] }));
  });

  // two rings of test pads, a ring of edge fingers, and six mounting holes
  var pads = [], i, a, cx, cz;
  [0.44, 0.53].forEach(function (rr) {
    for (i = 0; i < 48; i++) {
      a = i * Math.PI * 2 / 48 + (rr > 0.5 ? Math.PI / 48 : 0);
      pads.push(PC.T(PC.circle({ r: 0.017, perUnit: 380, tone: 0.95 }), { pos: [rr * Math.cos(a), pcbTop + 0.003, rr * Math.sin(a)] }));
    }
  });
  for (i = 0; i < 52; i++) {
    a = i * Math.PI * 2 / 52;
    cx = Math.cos(a); cz = Math.sin(a);
    pads.push(PC.line({ a: [0.60 * cx, pcbTop + 0.003, 0.60 * cz], b: [0.69 * cx, pcbTop + 0.003, 0.69 * cz], perUnit: 420, tone: 0.9 }));
  }
  for (i = 0; i < 6; i++) {
    a = i * Math.PI / 3 + Math.PI / 6;
    pads.push(PC.T(PC.circle({ r: 0.038, perUnit: 420, tone: 1 }), { pos: [0.645 * Math.cos(a), pcbTop + 0.003, 0.645 * Math.sin(a)] }));
  }
  parts.push(PC.merge.apply(null, pads));

  // stiffener cross bolted over the card
  var armL = 0.34, armW = 0.085, armH = 0.05, yArm = pcbTop + armH / 2;
  for (i = 0; i < 4; i++) {
    var ang = i * Math.PI / 2, r0 = 0.34 + armL / 2;
    var bx = r0 * Math.cos(ang), bz = r0 * Math.sin(ang);
    var box = PC.box({ w: armL, h: armH, d: armW, n: 900, tone: 0.42 });
    var ed = PC.boxEdges({ w: armL, h: armH, d: armW, perUnit: 280, tone: 0.95 });
    parts.push(PC.T(box, { rot: [0, -ang, 0], pos: [bx, yArm, bz] }));
    parts.push(PC.T(ed, { rot: [0, -ang, 0], pos: [bx, yArm, bz] }));
  }

  // ---------- probe head slung under the card ----------
  parts.push(PC.T(PC.box({ w: headW, h: headH, d: headW, n: 2800, tone: 0.45 }), { pos: [0, yHead, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: headW, h: headH, d: headW, perUnit: 380, tone: 1 }), { pos: [0, yHead, 0] }));
  parts.push(PC.T(PC.box({ w: gW, h: gH, d: gW, n: 1900, tone: 0.5 }), { pos: [0, yG, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: gW, h: gH, d: gW, perUnit: 380, tone: 1 }), { pos: [0, yG, 0] }));
  // the drilled guide plate at the very bottom, through which the needles pass
  parts.push(PC.T(PC.boxEdges({ w: gW * 0.9, h: 0.02, d: gW * 0.9, perUnit: 320, tone: 0.9 }), { pos: [0, headBot + 0.01, 0] }));
  // four short standoffs from the card down to the head
  for (i = 0; i < 4; i++) {
    var sx = (i < 2 ? -1 : 1) * headW * 0.46, sz = (i % 2 ? -1 : 1) * headW * 0.46;
    parts.push(PC.line({ a: [sx, pcbBot, sz], b: [sx, yHead + headH / 2, sz], perUnit: 600, tone: 0.85 }));
  }

  // ---------- the needle bed: six die-sized blocks of fine vertical probes ----------
  var needles = [], nx = 5, nz = 6;
  for (var gx = -1; gx <= 1; gx++) for (var gz = -1; gz <= 0; gz++) {
    var ox = gx * dw, oz = (gz + 0.5) * dh;
    for (var a1 = 0; a1 < nx; a1++) for (var b1 = 0; b1 < nz; b1++) {
      var px = ox + (a1 - (nx - 1) / 2) * (dw * 0.74 / (nx - 1));
      var pz = oz + (b1 - (nz - 1) / 2) * (dh * 0.74 / (nz - 1));
      var jx = (PC.rnd() - 0.5) * 0.007, jz = (PC.rnd() - 0.5) * 0.007;
      // needles splay very slightly outward at the top so they read as separate wires
      needles.push(PC.line({ a: [px * 1.14, headBot + 0.015, pz * 1.14], b: [px + jx, wafTop + 0.004, pz + jz], perUnit: 210, tone: 0.8 }));
    }
  }
  parts.push(PC.merge.apply(null, needles));

  // ---------- wafer on the chuck ----------
  var body = PC.cylinder({ r: Rw, h: tWaf, n: 23000, tone: 0.4 });
  var keep = [];
  for (i = 0; i < body.length; i += 4) {
    var bx2 = body[i], bz2 = body[i + 2];
    if (Math.sqrt(bx2 * bx2 + (bz2 - Rw) * (bz2 - Rw)) < 0.055) continue;   // notch
    keep.push(body[i], body[i + 1] + yWaf, body[i + 2], body[i + 3]);
  }
  parts.push(new Float32Array(keep));
  parts.push(PC.T(PC.circle({ r: Rw, perUnit: 420, tone: 1 }), { pos: [0, wafTop, 0] }));

  // die grid
  var grid = [];
  for (gx = -5; gx <= 5; gx++) for (gz = -5; gz <= 4; gz++) {
    cx = gx * dw; cz = (gz + 0.5) * dh;
    var cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < (Rw - 0.02) * (Rw - 0.02); })) continue;
    var probed = (Math.abs(gx) <= 1 && (gz === -1 || gz === 0));
    if (probed) continue;
    grid.push(PC.T(PC.polyline({ pts: [[-dw / 2, 0, -dh / 2], [dw / 2, 0, -dh / 2], [dw / 2, 0, dh / 2], [-dw / 2, 0, dh / 2]], closed: true, perUnit: 280, tone: 1 }), { pos: [cx, wafTop + 0.002, cz] }));
  }
  parts.push(PC.merge.apply(null, grid));

  // the six-die site the needles are landing on, in copper
  var site = [];
  for (gx = -1; gx <= 1; gx++) for (gz = -1; gz <= 0; gz++) {
    cx = gx * dw; cz = (gz + 0.5) * dh;
    site.push(PC.T(PC.polyline({ pts: [[-dw / 2, 0, -dh / 2], [dw / 2, 0, -dh / 2], [dw / 2, 0, dh / 2], [-dw / 2, 0, dh / 2]], closed: true, perUnit: 340 }), { pos: [cx, wafTop + 0.003, cz] }));
  }
  site.push(PC.T(PC.plane({ w: 3 * dw, d: 2 * dh, n: 2600 }), { pos: [0, wafTop + 0.0025, 0] }));
  site.push(PC.T(PC.polyline({ pts: [[-1.5 * dw, 0, -dh], [1.5 * dw, 0, -dh], [1.5 * dw, 0, dh], [-1.5 * dw, 0, dh]], closed: true, perUnit: 520 }), { pos: [0, wafTop + 0.004, 0] }));
  parts.push(PC.accent(PC.merge.apply(null, site), 0.9));

  // chuck
  var yCh = yWaf - tWaf / 2 - 0.065;
  parts.push(PC.T(PC.cylinder({ r: 1.12, h: 0.13, n: 13000, tone: 0.33 }), { pos: [0, yCh, 0] }));
  parts.push(PC.T(PC.circle({ r: 1.12, perUnit: 320, tone: 0.9 }), { pos: [0, yCh + 0.065, 0] }));
  parts.push(PC.T(PC.circle({ r: 1.12, perUnit: 320, tone: 0.9 }), { pos: [0, yCh - 0.065, 0] }));
  parts.push(PC.T(PC.circle({ r: 1.05, perUnit: 220, tone: 0.5 }), { pos: [0, yCh + 0.066, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.35, -0.6, 0],
    caption: 'A probe card: a 300 mm circular PCB with a stiffener cross, a probe head slung beneath it, and hundreds of fine needles coming down onto six dies at once. The site being tested is picked out in copper on the wafer below.'
  };
});
