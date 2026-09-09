/* Specimen: a liquid-cooled 72-GPU rack, drawn from the GB200 NVL72.
 *
 * 600 mm wide, 1,068 mm deep, 2,236 mm tall, about 1.36 t, about 120 kW.
 * Front, bottom to top: a coolant distribution unit, three power shelves,
 * eight compute trays, the nine NVLink switch trays, ten more compute
 * trays, three more power shelves and a management switch. Rear: the
 * NVLink cable cartridge, a slab of copper cable either side of the
 * vertical busbar, with the coolant manifold running up the side and a
 * quick-disconnect pair at every tray.
 *
 * Copper marks the power path — the shelves, the busbar and its clips.
 * In this chapter the chips are not the long pole; the electricity is.
 */
PC.register('rack', function (p) {
  var parts = [];
  var W = 0.60, D = 1.068, H = 2.236;           // metres
  var U = 0.0445;                               // one rack unit
  var post = 0.042;
  var front = D / 2, back = -D / 2;
  var V = [Math.PI / 2, 0, 0];                  // stands a plane up facing +Z
  var SPX = [Math.PI / 2, Math.PI / 2, 0];      // stands a plane up facing +X

  function rect(w, h) {
    return [[-w / 2, 0, -h / 2], [w / 2, 0, -h / 2], [w / 2, 0, h / 2], [-w / 2, 0, h / 2]];
  }
  // a rectangle outline standing in the front plane, centred at (x, y)
  function fOut(w, h, x, y, z, per, tn) {
    return PC.T(PC.polyline({ pts: rect(w, h), closed: true, perUnit: per, tone: tn }), { rot: V, pos: [x, y, z] });
  }
  function fPlane(w, h, x, y, z, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: V, pos: [x, y, z] });
  }

  // ---------- the cabinet ----------
  parts.push(PC.T(PC.boxEdges({ w: W, h: H, d: D, perUnit: 180, tone: 0.95 }), { pos: [0, H / 2, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    var x = q[0] * (W / 2 - post / 2), z = q[1] * (D / 2 - post / 2);
    parts.push(PC.T(PC.box({ w: post, h: H, d: post, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.42 }), { pos: [x, H / 2, z] }));
    parts.push(PC.T(PC.boxEdges({ w: post, h: H, d: post, perUnit: 110, tone: 0.85 }), { pos: [x, H / 2, z] }));
  });
  // plinth and top cap: solid, so the rack has a foot and a lid
  parts.push(PC.T(PC.box({ w: W, h: 0.09, d: D, faces: ['pz', 'px', 'nx', 'ny'], n: 2600, tone: 0.4 }), { pos: [0, 0.045, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.09, d: D, perUnit: 200, tone: 1 }), { pos: [0, 0.045, 0] }));
  parts.push(PC.T(PC.box({ w: W, h: 0.062, d: D, faces: ['py', 'pz', 'px', 'nx'], n: 2400, tone: 0.36 }), { pos: [0, H - 0.031, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.062, d: D, perUnit: 200, tone: 1 }), { pos: [0, H - 0.031, 0] }));
  // casters
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    parts.push(PC.T(PC.cylinder({ r: 0.035, h: 0.02, caps: false, n: 140, tone: 0.7 }), { rot: [0, 0, Math.PI / 2], pos: [q[0] * (W / 2 - 0.07), 0.035, q[1] * (D / 2 - 0.12)] }));
  });

  // side panels: a border frame plus a field of perforations, so the side
  // reads as a closed door without becoming a grey wall over the trays
  [-1, 1].forEach(function (s) {
    var sx = s * (W / 2 - 0.004), pw = D - 0.10, ph = H - 0.22, py = 0.09 + ph / 2;
    parts.push(PC.T(PC.polyline({ pts: rect(pw, ph), closed: true, perUnit: 200, tone: 0.85 }), { rot: SPX, pos: [sx, py, 0] }));
    parts.push(PC.T(PC.polyline({ pts: rect(pw - 0.05, ph - 0.05), closed: true, perUnit: 150, tone: 0.5 }), { rot: SPX, pos: [sx, py, 0] }));
    parts.push(PC.T(PC.dots({ nx: 40, nz: 17, sx: (ph - 0.10) / 39, sz: (pw - 0.10) / 16, tone: 0.3 }), { rot: [0, 0, Math.PI / 2], pos: [sx, py, 0] }));
  });

  // ---------- the stack ----------
  // section list from the floor up: [kind, count, gap above]
  var y = 0.09 + 0.024;
  var slots = [];                                // {kind, y}
  function section(kind, n, gap) {
    for (var i = 0; i < n; i++) { slots.push({ kind: kind, y: y + U / 2 }); y += U; }
    y += gap;
  }
  section('cdu', 4, 0.045);
  section('power', 3, 0.042);
  section('compute', 8, 0.026);
  section('switch', 9, 0.026);
  section('compute', 10, 0.042);
  section('power', 3, 0.038);
  section('mgmt', 1, 0);
  var stackTop = y, stackBot = 0.114;

  var tW = 0.522, tD = 0.98, tH = U * 0.90, fz = front - 0.012;
  var computeY = [], switchY = [], powerY = [];

  slots.forEach(function (sl) {
    var ty = sl.y, k = sl.kind;
    // the tray body: side rails running back and a sparse lid, so the depth
    // reads without filling the cabinet with haze
    parts.push(PC.line({ a: [-tW / 2, ty, fz - 0.02], b: [-tW / 2, ty, back + 0.10], perUnit: 70, tone: 0.35 }));
    parts.push(PC.line({ a: [tW / 2, ty, fz - 0.02], b: [tW / 2, ty, back + 0.10], perUnit: 70, tone: 0.35 }));
    parts.push(PC.T(PC.plane({ w: tW, d: tD, n: 110, tone: 0.13 }), { pos: [0, ty + tH / 2, (fz - 0.02 + back + 0.10) / 2] }));
    // the front panel
    var isPower = (k === 'power');
    parts.push(fPlane(tW, tH, 0, ty, fz, isPower ? 300 : 620, isPower ? 0.22 : 0.36));
    parts.push(fOut(tW, tH, 0, ty, fz + 0.002, 340, 1));

    if (k === 'compute') {
      computeY.push(ty);
      // two module bays, each with a pull handle, plus four network cages
      [-1, 1].forEach(function (s) {
        var bx = s * 0.135, bw = 0.20, bh = tH * 0.70;
        parts.push(fPlane(bw, bh, bx, ty, fz + 0.003, 300, 0.5));
        parts.push(fOut(bw, bh, bx, ty, fz + 0.004, 380, 1));
        parts.push(fOut(0.026, bh * 0.62, bx - s * (bw / 2 - 0.022), ty, fz + 0.005, 420, 1));
      });
      for (var c = 0; c < 4; c++) {
        var cx = (c - 1.5) * 0.028;
        parts.push(fOut(0.020, tH * 0.34, cx, ty, fz + 0.005, 460, 0.95));
      }
      parts.push(PC.T(PC.dots({ nx: 4, nz: 1, sx: 0.010, tone: 0.9 }), { pos: [-tW / 2 + 0.028, ty, fz + 0.006] }));
    } else if (k === 'switch') {
      switchY.push(ty);
      // switch tray: a long band of cage ports between two handles
      parts.push(fPlane(tW * 0.78, tH * 0.60, 0, ty, fz + 0.003, 420, 0.5));
      parts.push(fOut(tW * 0.78, tH * 0.60, 0, ty, fz + 0.004, 400, 1));
      for (var g = 0; g < 18; g++) {
        var gx = (g - 8.5) * (tW * 0.0415);
        parts.push(fOut(0.015, tH * 0.40, gx, ty, fz + 0.005, 420, 0.95));
      }
      [-1, 1].forEach(function (s) {
        parts.push(fOut(0.030, tH * 0.72, s * (tW / 2 - 0.028), ty, fz + 0.004, 420, 1));
      });
    } else if (k === 'power') {
      powerY.push(ty);
      // six power-supply modules, in copper: this rack's chokepoint is the
      // electricity, not the silicon
      parts.push(PC.accent(fPlane(tW - 0.02, tH * 0.86, 0, ty, fz + 0.003, 900), 0.62));
      for (var q = 0; q < 6; q++) {
        var qx = (q - 2.5) * ((tW - 0.03) / 6);
        parts.push(PC.accent(fOut((tW - 0.05) / 6, tH * 0.80, qx, ty, fz + 0.005, 460), 1));
        parts.push(PC.accent(fOut(0.016, tH * 0.36, qx + 0.028, ty, fz + 0.006, 460), 1));
        parts.push(PC.T(PC.accent(PC.dots({ nx: 2, nz: 1, sx: 0.009 }), 1), { pos: [qx - 0.026, ty, fz + 0.006] }));
      }
      parts.push(PC.accent(fOut(tW - 0.02, tH * 0.86, 0, ty, fz + 0.004, 420), 1));
    } else if (k === 'mgmt') {
      // management switch: two rows of small ports
      for (var r = 0; r < 2; r++) for (var m = 0; m < 24; m++) {
        parts.push(fOut(0.013, tH * 0.28, (m - 11.5) * 0.0195, ty + (r - 0.5) * tH * 0.36, fz + 0.004, 420, 0.9));
      }
    } else {
      // coolant distribution unit: two hose ports and a control panel
      parts.push(fPlane(tW * 0.9, tH * 0.7, 0, ty, fz + 0.003, 260, 0.3));
    }
  });

  // the CDU is four units tall: draw it as one unit with big hose ports
  var cduY = (slots[0].y + slots[3].y) / 2, cduH = 4 * U * 0.94;
  parts.push(fOut(tW, cduH, 0, cduY, fz + 0.004, 380, 1));
  parts.push(fOut(tW - 0.05, cduH - 0.03, 0, cduY, fz + 0.005, 280, 0.7));
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.circle({ r: 0.046, perUnit: 420, tone: 1 }), { rot: V, pos: [s * 0.155, cduY, fz + 0.006] }));
    parts.push(PC.T(PC.circle({ r: 0.030, perUnit: 380, tone: 0.8 }), { rot: V, pos: [s * 0.155, cduY, fz + 0.007] }));
  });
  parts.push(PC.T(PC.dots({ nx: 8, nz: 3, sx: 0.020, sz: 0.020, per: 2, tone: 0.85 }), { rot: V, pos: [0, cduY - 0.03, fz + 0.006] }));

  // the front bezel: a picture frame round the tray aperture
  var apY = (stackBot + stackTop) / 2, apH = stackTop - stackBot + 0.02;
  parts.push(fOut(tW + 0.036, apH, 0, apY, front - 0.002, 260, 1));
  [-1, 1].forEach(function (s) {
    parts.push(fPlane(0.032, apH, s * (tW / 2 + 0.034), apY, front - 0.002, 900, 0.32));
  });

  // ---------- rear: the NVLink cartridge, the busbar and the manifold ----------
  var zSpine = back + 0.085, sy0 = stackBot + 0.05, sy1 = stackTop - 0.02, sh = sy1 - sy0, syc = (sy0 + sy1) / 2;
  // two slabs of copper cable either side of the busbar
  [-1, 1].forEach(function (s) {
    var cx = s * 0.172;
    for (var i = 0; i < 22; i++) {
      var lx = cx + (i - 10.5) * 0.0092, wob = (PC.rnd() - 0.5) * 0.004;
      parts.push(PC.line({ a: [lx, sy0, zSpine + wob], b: [lx, sy1, zSpine + wob], perUnit: 150, tone: 0.5 }));
    }
    for (i = 0; i < 14; i++) {
      var by = sy0 + (i + 0.5) * sh / 14;
      parts.push(PC.line({ a: [cx - 0.10, by, zSpine - 0.004], b: [cx + 0.10, by, zSpine - 0.004], perUnit: 300, tone: 0.8 }));
    }
    parts.push(PC.T(PC.polyline({ pts: rect(0.212, sh), closed: true, perUnit: 220, tone: 1 }), { rot: V, pos: [cx, syc, zSpine - 0.008] }));
  });
  // the busbar, in copper, with a clip at every tray
  parts.push(PC.T(PC.accent(PC.box({ w: 0.052, h: sh + 0.10, d: 0.030, faces: ['pz', 'px', 'nx'], n: 3000 }), 0.55), { pos: [0, syc, zSpine + 0.02] }));
  parts.push(PC.T(PC.accent(PC.boxEdges({ w: 0.052, h: sh + 0.10, d: 0.030, perUnit: 260 }), 1), { pos: [0, syc, zSpine + 0.02] }));
  slots.forEach(function (sl) {
    if (sl.kind === 'cdu' || sl.kind === 'mgmt') return;
    parts.push(PC.T(PC.accent(PC.polyline({ pts: rect(0.086, U * 0.5), closed: true, perUnit: 380 }), 0.9), { rot: V, pos: [0, sl.y, zSpine + 0.036] }));
  });
  // the manifold: two vertical pipes up the near side with quick disconnects
  var pipeX = W / 2 - 0.058, pipeZ = [back + 0.30, back + 0.40], pr = 0.030;
  pipeZ.forEach(function (pz, pi) {
    parts.push(PC.T(PC.cylinder({ r: pr, h: sh + 0.30, caps: false, n: 4200, tone: 0.46 }), { pos: [pipeX, syc + 0.02, pz] }));
    for (var m = 0; m < 11; m++) {
      parts.push(PC.T(PC.circle({ r: pr * 1.16, perUnit: 380, tone: 0.95 }), { pos: [pipeX, sy0 - 0.10 + m * (sh + 0.24) / 10, pz] }));
    }
    slots.forEach(function (sl, si) {
      if (si % 2 !== pi) return;
      parts.push(PC.polyline({
        pts: [[pipeX - pr, sl.y, pz], [pipeX - 0.055, sl.y, pz], [pipeX - 0.075, sl.y, pz + 0.06]],
        perUnit: 420, tone: 0.7
      }));
    });
  });
  // the two hoses that leave the cabinet at the foot
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.torus({ R: 0.075, r: 0.028, n: 1600, tone: 0.5 }), { rot: [0, 0, Math.PI / 2], pos: [s * 0.13, 0.115, back + 0.06] }));
    parts.push(PC.T(PC.cylinder({ r: 0.028, h: 0.13, caps: false, n: 700, tone: 0.5 }), { rot: [Math.PI / 2, 0, 0], pos: [s * 0.205, 0.115, back - 0.01] }));
  });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.07,
    tilt: [0.12, -0.65, 0],
    caption: 'A liquid-cooled rack of 72 accelerators, 2.24 m tall and drawing about 120 kW: eighteen compute trays split eight below and ten above the nine NVLink switch trays, the coolant distribution unit at the foot, and the NVLink cable cartridge filling the back. The power path is in copper — six power shelves and the vertical busbar they feed, with a clip at every tray.'
  };
});
