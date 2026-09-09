/* Specimen: a gate-all-around nanosheet transistor.
 *
 * Units are nanometres, and the dimensions are the ones the 2 nm-class nodes
 * actually use (imec, TSMC N2, Samsung SF2):
 *   sheet thickness 6 nm, sheet width 30 nm, sheet length 28 nm;
 *   three sheets, 10 nm of gate metal in each gap;
 *   gate length 15 nm, inner spacers 5 nm at each end of every gap.
 * The sheet is five times wider than it is thick, which is the ratio that
 * matters: a nanosheet is a ribbon, not a wire.
 *
 * The gate is the copper part, and it is drawn as a cage rather than a solid
 * so you can see what "all around" means: the metal fills the gap under each
 * sheet, over each sheet and around both edges, so the channel is gripped on
 * four sides instead of three. That wrap is what stops a 15 nm channel leaking
 * when the gate says off, and building it takes about a thousand ordered
 * process steps that three companies in the world can run.
 *
 * Ink: the three silicon sheets, the source and drain epitaxy at the ends, the
 * inner spacers that keep the gate from touching that epitaxy, the isolation
 * below, and the contacts landing on top.
 */
PC.register('gaa-transistor', function (p) {
  var sT = 6, sW = 30, sL = 28;                 // sheet thickness, width, length
  var gapY = 10, Lg = 15, sp = 5;               // sheet gap, gate length, spacer
  var y0 = [0, sT + gapY, 2 * (sT + gapY)];     // sheet bottoms: 0, 16, 32
  var yStackTop = y0[2] + sT;                   // 38
  var gX = Lg / 2, spX = gX + sp;               // gate +/-7.5, spacer out to +/-12.5
  var gY0 = -11, gY1 = 45, gZ = sW / 2 + 4;     // gate box, 4 nm proud of the sheet edges
  var epiX0 = spX, epiX1 = 32, epiZ = 17;
  var parts = [];
  function add(c) { parts.push(c); }
  function acc(c, a) { return PC.accent(c, a); }

  // a rectangle lying in the XY plane at constant z
  function faceZ(x0, yA, x1, yB, z, n, tn) {
    return PC.T(PC.plane({ w: x1 - x0, d: yB - yA, n: n, tone: tn }),
      { rot: [Math.PI / 2, 0, 0], pos: [(x0 + x1) / 2, (yA + yB) / 2, z] });
  }
  function boxAt(x0, yA, z0, x1, yB, z1, o) {
    return PC.T(PC.box({ w: x1 - x0, h: yB - yA, d: z1 - z0, n: o.n, tone: o.tone, faces: o.faces }),
      { pos: [(x0 + x1) / 2, (yA + yB) / 2, (z0 + z1) / 2] });
  }
  function edgesAt(x0, yA, z0, x1, yB, z1, per, tn) {
    return PC.T(PC.boxEdges({ w: x1 - x0, h: yB - yA, d: z1 - z0, perUnit: per, tone: tn }),
      { pos: [(x0 + x1) / 2, (yA + yB) / 2, (z0 + z1) / 2] });
  }

  // ---------- substrate and the isolation the stack sits on ----------
  add(boxAt(-36, -23, -25, 36, -16, 25, { n: 2400, tone: 0.11 }));
  add(edgesAt(-36, -23, -25, 36, -16, 25, 6, 0.65));
  add(boxAt(-33, -16, -22, 33, -11, 22, { n: 1100, tone: 0.20 }));      // bottom dielectric isolation
  add(edgesAt(-33, -16, -22, 33, -11, 22, 6, 0.75));

  // ---------- the three silicon nanosheets ----------
  y0.forEach(function (yb) {
    add(boxAt(-sL / 2, yb, -sW / 2, sL / 2, yb + sT, sW / 2,
      { n: 4400, tone: 0.30, faces: ['py', 'pz', 'nz', 'px', 'nx'] }));
    add(edgesAt(-sL / 2, yb, -sW / 2, sL / 2, yb + sT, sW / 2, 9, 0.9));
    for (var q = -1; q <= 1; q++) {
      add(PC.line({ a: [-sL / 2, yb + sT, q * 8], b: [sL / 2, yb + sT, q * 8], perUnit: 7, tone: 0.45 }));
    }
  });

  // ---------- the gate: a cage of metal wrapping every sheet on four sides ----------
  // the metal that fills each gap, drawn on the two faces you can see it through
  var bands = [[gY0, y0[0]], [y0[0] + sT, y0[1]], [y0[1] + sT, y0[2]], [yStackTop, gY1]];
  bands.forEach(function (b) {
    [-1, 1].forEach(function (s) { add(acc(faceZ(-gX, b[0], gX, b[1], s * gZ, 520, 1), 0.40)); });
    [-1, 1].forEach(function (s) {                                     // and the same gap, seen end on
      add(acc(PC.T(PC.plane({ w: b[1] - b[0], d: 2 * gZ, n: 260, tone: 1 }),
        { rot: [0, 0, Math.PI / 2], pos: [s * gX, (b[0] + b[1]) / 2, 0] }), 0.22));
    });
    add(acc(edgesAt(-gX, b[0], -gZ, gX, b[1], gZ, 6, 1), 0.7));
  });
  add(acc(boxAt(-gX, gY0, -gZ, gX, gY1, gZ, { n: 420, tone: 1, faces: ['py'] }), 0.24));
  add(acc(edgesAt(-gX, gY0, -gZ, gX, gY1, gZ, 15, 1), 1));
  // the metal that runs around the sheet edges: two thin walls just outside them
  [-1, 1].forEach(function (s) {
    add(acc(faceZ(-gX, y0[0], gX, yStackTop, s * (sW / 2 + 1.2), 340, 1), 0.34));
  });

  // ---------- inner spacers: they stop the gate touching the source and drain ----------
  [-1, 1].forEach(function (s) {
    [[y0[0] + sT, y0[1]], [y0[1] + sT, y0[2]]].forEach(function (b) {
      var a = s > 0 ? gX : -spX, c = s > 0 ? spX : -gX;
      add(boxAt(a, b[0], -sW / 2, c, b[1], sW / 2, { n: 420, tone: 0.34 }));
      add(edgesAt(a, b[0], -sW / 2, c, b[1], sW / 2, 8, 0.9));
    });
  });

  // ---------- source and drain epitaxy: faceted blocks grown off the sheet ends ----------
  var shape = [[0.125, -0.130], [0.165, -0.170], [0.280, -0.170], [0.320, -0.130],
               [0.320, 0.130], [0.280, 0.170], [0.165, 0.170], [0.125, 0.130]];
  [-1, 1].forEach(function (s) {
    var epi = PC.thin(PC.extrude({ shape: shape, h: 0.42, tone: 0.20 }), 0.46);
    add(PC.T(epi, { scale: [s * 100, 100, 100], pos: [0, 19, 0] }));
    var ring = shape.map(function (q) { return [s * q[0] * 100, 0, q[1] * 100]; });
    [-2, 40].forEach(function (yy) {
      add(PC.T(PC.polyline({ pts: ring, closed: true, perUnit: 8, tone: 0.9 }), { pos: [0, yy, 0] }));
    });
    ring.forEach(function (q, qi) { add(PC.line({ a: [q[0], -2, q[2]], b: [q[0], 40, q[2]], perUnit: 7, tone: (qi % 2) ? 0.3 : 0.75 })); });
  });

  // ---------- contacts landing on the source, the drain and the gate ----------
  [-1, 1].forEach(function (s) {
    var a = s > 0 ? 17 : -29, c = s > 0 ? 29 : -17;
    add(boxAt(a, 40, -11, c, 48, 11, { n: 620, tone: 0.18, faces: ['py', 'px', 'nx', 'pz', 'nz'] }));
    add(edgesAt(a, 40, -11, c, 48, 11, 9, 0.9));
  });
  add(boxAt(-5, gY1, -8, 5, 51, 8, { n: 520, tone: 0.18, faces: ['py', 'px', 'nx', 'pz', 'nz'] }));
  add(edgesAt(-5, gY1, -8, 5, 51, 8, 9, 0.9));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.52, -0.76, 0],
    caption: 'A gate-all-around nanosheet transistor, drawn at the dimensions a 2 nm-class node ' +
      'uses: three silicon sheets 6 nm thick and 30 nm wide, stacked 10 nm apart, running from the ' +
      'source epitaxy on one side to the drain epitaxy on the other. The copper cage is the gate. ' +
      'It fills the gap under each sheet, over each sheet and around both edges, so the channel is ' +
      'gripped on four sides; the small blocks at the ends of each gap are the inner spacers that ' +
      'keep that metal off the epitaxy. Contacts land on top.'
  };
});
