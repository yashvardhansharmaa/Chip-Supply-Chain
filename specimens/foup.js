/* Specimen: a FOUP, the front-opening unified pod that wafers travel in.
 *
 * Units are millimetres, at the dimensions of a real 300 mm pod (Entegris A300
 * class, to SEMI E47.1): 388 wide, 342 deep, 332 tall without the handles, and
 * 420 wide with them. Twenty-five slots at 10 mm pitch, the first wafer 44 mm
 * above the base datum, so the stack of wafers is 240 mm of the 332.
 *
 * The proportion that matters and that drawings usually get wrong: a 300 mm
 * wafer is 300 of the 342 mm of depth. The box is barely bigger than what it
 * carries. Everything else about it - the moulded shell, the robotic flange on
 * the roof, the two hand grips, the three kinematic pads underneath, the door
 * with its two latch keys - exists to move that stack between tools without
 * letting fab air touch it. A FOUP is not a box with wafers in it. It is the
 * cleanroom, and the fab around it is only the corridor.
 *
 * The shell is drawn translucent, as the real polycarbonate is, so the stack
 * reads through it. One wafer is picked out in copper.
 */
PC.register('foup', function (p) {
  var W = 388, D = 342, H = 332;                 // shell, door on +Z
  var rW = 150, slots = 25, pitch = 10, y1 = 44; // 300 mm wafers, 25 at 10 mm
  var accentSlot = 13;
  var parts = [];
  function add(c) { parts.push(c); }

  // ---------- helpers ----------
  function roundRect(w, d, r, seg) {
    var pts = [], i, k, cx, cz, a0;
    var corners = [[w / 2 - r, d / 2 - r, 0], [-(w / 2 - r), d / 2 - r, Math.PI / 2],
                   [-(w / 2 - r), -(d / 2 - r), Math.PI], [w / 2 - r, -(d / 2 - r), 3 * Math.PI / 2]];
    for (i = 0; i < 4; i++) {
      cx = corners[i][0]; cz = corners[i][1]; a0 = corners[i][2];
      for (k = 0; k <= seg; k++) {
        var a = a0 + k * (Math.PI / 2) / seg;
        pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
      }
    }
    return pts;
  }
  function ring(shape, y, per, tn) {
    return PC.polyline({ pts: shape.map(function (q) { return [q[0], y, q[1]]; }), closed: true, perUnit: per, tone: tn });
  }
  function cut(c, drop) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) if (!drop(c[i], c[i + 1], c[i + 2])) keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    return new Float32Array(keep);
  }
  function boxAt(w, h, d, pos, n, tn, faces) {
    return PC.T(PC.box({ w: w, h: h, d: d, n: n, tone: tn, faces: faces }), { pos: pos });
  }
  function edgesAt(w, h, d, pos, per, tn) {
    return PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: per, tone: tn }), { pos: pos });
  }
  // a rectangle in the XY plane at constant z
  function faceZ(w, h, pos, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: [Math.PI / 2, 0, 0], pos: pos });
  }
  function rectZ(w, h, pos, per, tn) {          // pts are already in the XY plane, so no rotation
    return PC.T(PC.polyline({
      pts: [[-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0], [-w / 2, h / 2, 0]],
      closed: true, perUnit: per, tone: tn
    }), { pos: pos });
  }

  // ---------- the moulded shell, front face left open for the door ----------
  var shape = roundRect(0.388, 0.342, 0.045, 4);
  var walls = PC.T(PC.accent2(PC.extrude({ shape: shape, h: 0.332, caps: false }), 0.14),
    { scale: 1000, pos: [0, H / 2, 0] });
  add(cut(walls, function (x, y, z) { return z > 145 && Math.abs(x) < 152; }));
  var shape2 = shape.map(function (q) { return [q[0] * 1000, q[1] * 1000]; });
  add(ring(shape2, 0.5, 2.6, 0.95));
  add(ring(shape2, H - 0.5, 2.6, 0.95));
  shape2.forEach(function (q, i) {                                  // the four corner posts
    if (i % 5 !== 2) return;
    add(PC.line({ a: [q[0], 1, q[1]], b: [q[0], H - 1, q[1]], perUnit: 2.6, tone: 0.9 }));
  });
  add(PC.T(PC.accent2(PC.plane({ w: W - 26, d: D - 26, n: 2400 }), 0.2), { pos: [0, H, 0] }));  // roof
  // ribs across the roof, as the moulding has
  for (var r = -3; r <= 3; r++) add(PC.line({ a: [-W / 2 + 22, H + 1, r * 44], b: [W / 2 - 22, H + 1, r * 44], perUnit: 2.2, tone: 0.42 }));

  // ---------- base plate and the three kinematic pads it sits on ----------
  add(boxAt(W + 14, 20, D + 14, [0, -10, 0], 4200, 0.14));
  add(edgesAt(W + 14, 20, D + 14, [0, -10, 0], 2.4, 0.9));
  for (var k = 0; k < 3; k++) {
    var a = k * Math.PI * 2 / 3 + Math.PI / 2, Rk = 110;
    add(PC.line({
      a: [Math.cos(a) * (Rk - 34), -21, Math.sin(a) * (Rk - 34)],
      b: [Math.cos(a) * (Rk + 34), -21, Math.sin(a) * (Rk + 34)], perUnit: 3.5, tone: 0.95
    }));
  }

  // ---------- 25 wafers on their slot teeth ----------
  for (var i = 0; i < slots; i++) {
    var y = y1 + i * pitch, isAcc = (i === accentSlot);
    var disc = PC.disc({ r: rW, n: isAcc ? 3400 : 380, tone: isAcc ? 0.5 : 0.14 });
    var rim = PC.circle({ r: rW, perUnit: isAcc ? 2.2 : 0.9, tone: isAcc ? 1 : 0.82 });
    add(PC.T(isAcc ? PC.accent(disc, 0.5) : disc, { pos: [0, y, 0] }));
    add(PC.T(isAcc ? PC.accent(rim, 1) : rim, { pos: [0, y, 0] }));
    // the comb of teeth the wafer rests on, moulded into both side walls
    [1, -1].forEach(function (s) {
      add(PC.line({ a: [s * 178, y - 3.4, -158], b: [s * 178, y - 3.4, 156], perUnit: 0.8, tone: 0.34 }));
      add(PC.line({ a: [s * 178, y - 3.4, 120], b: [s * 152, y - 3.4, 150], perUnit: 1.4, tone: 0.5 }));
    });
  }

  // ---------- the door: the part that makes it a cleanroom ----------
  var dz = D / 2 + 7, dW = 344, dH = 300, dy = H / 2 - 4;
  add(PC.accent2(faceZ(dW, dH, [0, dy, dz], 5600, 0.26), 0.3));
  add(rectZ(dW, dH, [0, dy, dz + 0.5], 2.8, 1));
  add(rectZ(dW - 40, dH - 40, [0, dy, dz + 0.5], 2.0, 0.5));
  [-1, 1].forEach(function (s) {                                     // the moulded ribs on the panel
    add(PC.line({ a: [-dW / 2 + 26, dy + s * 62, dz + 0.6], b: [dW / 2 - 26, dy + s * 62, dz + 0.6], perUnit: 2.0, tone: 0.42 }));
  });
  add(PC.T(PC.box({ w: dW, h: dH, d: 14, faces: ['py', 'ny', 'px', 'nx'], n: 1500, tone: 0.3 }),
    { pos: [0, dy, dz - 7] }));
  [-1, 1].forEach(function (s) {                                     // the two latch key ports
    add(rectZ(16, 40, [s * 132, dy, dz + 1], 5, 1));
    add(faceZ(16, 40, [s * 132, dy, dz + 0.6], 220, 0.55));
  });
  [-1, 1].forEach(function (s) {                                     // registration bosses
    add(PC.T(PC.circle({ r: 17, perUnit: 4 }), { rot: [Math.PI / 2, 0, 0], pos: [0, dy + s * 118, dz + 1] }));
    add(PC.T(PC.circle({ r: 8, perUnit: 4, tone: 0.6 }), { rot: [Math.PI / 2, 0, 0], pos: [0, dy + s * 118, dz + 1] }));
  });

  // ---------- robotic flange on the roof ----------
  add(boxAt(150, 30, 150, [0, H + 15, 0], 2200, 0.18, ['px', 'nx', 'pz', 'nz']));
  add(edgesAt(150, 30, 150, [0, H + 15, 0], 2.6, 0.8));
  add(boxAt(178, 14, 178, [0, H + 37, 0], 2600, 0.24));
  add(edgesAt(178, 14, 178, [0, H + 37, 0], 3.2, 1));
  add(PC.T(PC.circle({ r: 34, perUnit: 4.5, tone: 1 }), { pos: [0, H + 44.5, 0] }));
  add(PC.T(PC.circle({ r: 22, perUnit: 3.5, tone: 0.7 }), { pos: [0, H + 44.5, 0] }));
  add(PC.T(PC.disc({ r: 34, n: 700, tone: 0.2 }), { pos: [0, H + 44.2, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {        // the four bolt pads
    add(PC.T(PC.circle({ r: 8, perUnit: 4, tone: 0.75 }), { pos: [q[0] * 70, H + 44.5, q[1] * 70] }));
  });

  // ---------- the two hand grips, which take the pod out to 420 mm wide ----------
  [1, -1].forEach(function (s) {
    [246, 96].forEach(function (ay) {                                // arms
      add(boxAt(28, 30, 52, [s * (W / 2 + 14), ay, -10], 700, 0.2));
      add(edgesAt(28, 30, 52, [s * (W / 2 + 14), ay, -10], 2.6, 0.85));
    });
    add(boxAt(20, 180, 44, [s * (W / 2 + 22), 171, -10], 1500, 0.2)); // grip
    add(edgesAt(20, 180, 44, [s * (W / 2 + 22), 171, -10], 2.6, 0.9));
    for (var g = 0; g < 7; g++) {                                     // finger ribs
      add(PC.line({
        a: [s * (W / 2 + 32), 100 + g * 24, -30], b: [s * (W / 2 + 32), 100 + g * 24, 10],
        perUnit: 2.4, tone: 0.55
      }));
    }
  });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.24, -0.72, 0],
    // colour: the picked-out wafer is polished silicon, a mirror that reads as cool silver
    accent: [111, 139, 166], accentDark: [195, 211, 226],
    // colour: the shell, roof and door are translucent polycarbonate, a grey-blue haze in life
    accent2: [142, 162, 184], accent2Dark: [169, 188, 207],
    caption: 'A FOUP: 388 by 342 by 332 mm, carrying twenty-five 300 mm wafers on moulded teeth ' +
      '10 mm apart. The shell is drawn translucent, as the real polycarbonate is. On the roof is ' +
      'the flange an overhead robot grips; on the front, the door with its two latch-key ports, ' +
      'which is the only way in. The box is barely wider than the wafer it carries, and it is the ' +
      'wafers, not the fab, that the clean air is for. One wafer is picked out in silver.'
  };
});
