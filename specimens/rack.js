/* Specimen: a liquid-cooled 72-GPU rack.
 * 2.2 m tall, 0.6 m wide, 1.2 m deep. Eighteen compute trays in two banks with
 * nine switch trays (copper) between them, a cable spine down the back, power
 * shelves at the foot and a coolant manifold of two vertical pipes down one side.
 */
PC.register('rack', function (p) {
  var parts = [];
  var W = 0.62, H = 2.20, D = 1.16;            // metres
  var post = 0.05;

  // ---------- frame ----------
  parts.push(PC.T(PC.boxEdges({ w: W, h: H, d: D, perUnit: 210, tone: 1 }), { pos: [0, H / 2, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    var x = q[0] * (W / 2 - post / 2), z = q[1] * (D / 2 - post / 2);
    parts.push(PC.T(PC.box({ w: post, h: H, d: post, n: 1300, tone: 0.45 }), { pos: [x, H / 2, z] }));
    parts.push(PC.T(PC.boxEdges({ w: post, h: H, d: post, perUnit: 120, tone: 0.9 }), { pos: [x, H / 2, z] }));
  });

  // ---------- trays: 10 compute, 9 switch, 8 compute ----------
  var tW = 0.545, tH = 0.036, tD = 1.02, pitch = 0.052, y0 = 0.635;
  var front = tD / 2, V = [Math.PI / 2, 0, 0];   // rotation that stands a plane up facing +Z
  for (var i = 0; i < 27; i++) {
    var y = y0 + i * pitch;
    var isSwitch = (i >= 10 && i < 19);
    // body: a light top face and the two ends, no long edge lines (they only scribble)
    parts.push(PC.T(PC.plane({ w: tW, d: tD, n: 230, tone: 0.2 }), { pos: [0, y + tH / 2, 0] }));
    parts.push(PC.T(PC.box({ w: tW, h: tH, d: tD, faces: ['px', 'nx'], n: 200, tone: 0.3 }), { pos: [0, y, 0] }));
    // front panel and its lip
    parts.push(PC.T(PC.plane({ w: tW, d: tH, n: 620, tone: isSwitch ? 0.3 : 0.46 }), { rot: V, pos: [0, y, front] }));
    parts.push(PC.T(PC.polyline({ pts: [[-tW / 2, 0, -tH / 2], [tW / 2, 0, -tH / 2], [tW / 2, 0, tH / 2], [-tW / 2, 0, tH / 2]], closed: true, perUnit: 330, tone: 1 }), { rot: V, pos: [0, y, front + 0.002] }));
    if (isSwitch) {
      // switch tray: copper front panel with a row of cage ports
      parts.push(PC.T(PC.accent(PC.plane({ w: tW * 0.95, d: tH * 0.78, n: 620 }), 0.75), { rot: V, pos: [0, y, front + 0.003] }));
      parts.push(PC.T(PC.accent(PC.polyline({ pts: [[-tW * 0.475, 0, -tH * 0.39], [tW * 0.475, 0, -tH * 0.39], [tW * 0.475, 0, tH * 0.39], [-tW * 0.475, 0, tH * 0.39]], closed: true, perUnit: 360 }), 1), { rot: V, pos: [0, y, front + 0.005] }));
      for (var k = 0; k < 16; k++) {
        var px = (k - 7.5) * (tW * 0.058);
        parts.push(PC.T(PC.polyline({ pts: [[px - 0.008, 0, -0.008], [px + 0.008, 0, -0.008], [px + 0.008, 0, 0.008], [px - 0.008, 0, 0.008]], closed: true, perUnit: 380, tone: 1 }), { rot: V, pos: [0, y, front + 0.006] }));
      }
    } else {
      // compute tray: two module bays, a handle bar and a row of status lamps
      [-1, 1].forEach(function (s) {
        parts.push(PC.T(PC.polyline({ pts: [[s * 0.05, 0, -tH * 0.3], [s * 0.25, 0, -tH * 0.3], [s * 0.25, 0, tH * 0.3], [s * 0.05, 0, tH * 0.3]], closed: true, perUnit: 330, tone: 1 }), { rot: V, pos: [0, y, front + 0.003] }));
        parts.push(PC.T(PC.plane({ w: 0.2, d: tH * 0.6, n: 210, tone: 0.6 }), { rot: V, pos: [s * 0.15, y, front + 0.003] }));
      });
      parts.push(PC.T(PC.dots({ nx: 5, nz: 1, sx: 0.011, per: 2, tone: 0.95 }), { pos: [0, y, front + 0.005] }));
    }
  }

  // ---------- cable spine down the back ----------
  var spine = [], zB = -D / 2 + 0.10;
  for (i = 0; i < 44; i++) {
    var sx = (i - 21.5) * 0.0122, wob = (PC.rnd() - 0.5) * 0.010;
    spine.push(PC.line({ a: [sx, y0 - 0.04, zB + wob], b: [sx, y0 + 26 * pitch + 0.06, zB + wob], perUnit: 150, tone: 0.45 }));
  }
  for (i = 0; i < 5; i++) {
    spine.push(PC.line({ a: [-0.27, y0 + i * 0.34, zB], b: [0.27, y0 + i * 0.34, zB], perUnit: 240, tone: 0.65 }));
  }
  parts.push(PC.merge.apply(null, spine));

  // ---------- power shelves at the foot ----------
  for (i = 0; i < 3; i++) {
    var ys = 0.15 + i * 0.15, sh = 0.115;
    parts.push(PC.T(PC.plane({ w: tW, d: tD, n: 320, tone: 0.24 }), { pos: [0, ys + sh / 2, 0] }));
    parts.push(PC.T(PC.box({ w: tW, h: sh, d: tD, faces: ['px', 'nx'], n: 420, tone: 0.32 }), { pos: [0, ys, 0] }));
    parts.push(PC.T(PC.plane({ w: tW, d: sh, n: 1500, tone: 0.42 }), { rot: V, pos: [0, ys, front] }));
    parts.push(PC.T(PC.polyline({ pts: [[-tW / 2, 0, -sh / 2], [tW / 2, 0, -sh / 2], [tW / 2, 0, sh / 2], [-tW / 2, 0, sh / 2]], closed: true, perUnit: 330, tone: 1 }), { rot: V, pos: [0, ys, front + 0.002] }));
    for (k = 0; k < 6; k++) {
      parts.push(PC.T(PC.circle({ r: 0.036, perUnit: 340, tone: 1 }), { rot: V, pos: [(k - 2.5) * 0.088, ys, front + 0.004] }));
    }
  }
  // plinth
  parts.push(PC.T(PC.box({ w: W, h: 0.08, d: D, faces: ['pz', 'px', 'nx', 'ny'], n: 2600, tone: 0.4 }), { pos: [0, 0.04, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.08, d: D, perUnit: 190, tone: 1 }), { pos: [0, 0.04, 0] }));

  // ---------- perforated side panel, so the rack does not read as an open crate ----------
  // It covers the front two-thirds only; the rear stays open so the cable spine shows.
  var SP = [Math.PI / 2, Math.PI / 2, 0];        // stands a plane up facing +X
  var spW = 0.68, spH = H - 0.16, spZ = 0.18;
  parts.push(PC.T(PC.plane({ w: spW, d: spH, n: 4200, tone: 0.2 }), { rot: SP, pos: [W / 2 - 0.004, H / 2, spZ] }));
  parts.push(PC.T(PC.dots({ nx: 15, nz: 40, sx: (spW - 0.06) / 14, sz: (spH - 0.1) / 39, tone: 0.42 }), { rot: SP, pos: [W / 2 - 0.002, H / 2, spZ] }));
  parts.push(PC.T(PC.polyline({ pts: [[-spW / 2, 0, -spH / 2], [spW / 2, 0, -spH / 2], [spW / 2, 0, spH / 2], [-spW / 2, 0, spH / 2]], closed: true, perUnit: 220, tone: 0.9 }), { rot: SP, pos: [W / 2 - 0.001, H / 2, spZ] }));

  // ---------- coolant manifold: two vertical pipes down one side ----------
  var pipeX = W / 2 + 0.10, pipeZ = [0.42, 0.24], pr = 0.036, pTop = 2.10, pBot = 0.12;
  pipeZ.forEach(function (pz) {
    parts.push(PC.T(PC.cylinder({ r: pr, h: pTop - pBot, caps: false, n: 4600, tone: 0.5 }), { pos: [pipeX, (pTop + pBot) / 2, pz] }));
    for (var m = 0; m < 9; m++) {
      parts.push(PC.T(PC.circle({ r: pr * 1.14, perUnit: 420, tone: 0.95 }), { pos: [pipeX, pBot + 0.02 + m * (pTop - pBot - 0.04) / 8, pz] }));
    }
  });
  // header across the top and quick-disconnect hoses to every third tray
  parts.push(PC.T(PC.cylinder({ r: pr, h: 0.24, caps: false, n: 900, tone: 0.5 }), { rot: [Math.PI / 2, 0, 0], pos: [pipeX, pTop, (pipeZ[0] + pipeZ[1]) / 2] }));
  parts.push(PC.line({ a: [pipeX, pTop, pipeZ[0]], b: [0.1, pTop + 0.06, pipeZ[0]], perUnit: 320, tone: 0.6 }));
  for (i = 0; i < 27; i += 2) {
    var yh = y0 + i * pitch;
    parts.push(PC.polyline({ pts: [[pipeX - pr, yh + 0.006, pipeZ[0]], [W / 2 - 0.01, yh + 0.006, pipeZ[0]]], perUnit: 420, tone: 0.7 }));
    parts.push(PC.polyline({ pts: [[pipeX - pr, yh - 0.006, pipeZ[1]], [W / 2 - 0.01, yh - 0.006, pipeZ[1]]], perUnit: 420, tone: 0.7 }));
  }

  // top cap
  parts.push(PC.T(PC.box({ w: W, h: 0.055, d: D, faces: ['py', 'pz', 'px', 'nx'], n: 2000, tone: 0.38 }), { pos: [0, H - 0.028, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.055, d: D, perUnit: 190, tone: 1 }), { pos: [0, H - 0.028, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.07,
    tilt: [0.12, -0.65, 0],
    caption: 'A liquid-cooled rack of 72 accelerators: eighteen compute trays in two banks with nine switch trays between them, their front panels in copper, a cable spine down the back, power shelves at the foot and two coolant pipes running the full height on one side.'
  };
});
