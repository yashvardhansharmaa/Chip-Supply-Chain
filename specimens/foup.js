/* Specimen: a FOUP (front-opening unified pod), the sealed box wafers travel in.
 * Shell about 38 x 34 x 39 cm with the door removed, 25 wafers of 300 mm lying
 * flat on the slot teeth at the standard 10 mm pitch, the robotic handle on top
 * and the carry rails on the sides. One wafer is picked out in copper.
 * Scale: 1 cm = 0.05 units.
 */
PC.register('foup', function (p) {
  var cm = 0.05;
  var W = 38 * cm, H = 34 * cm, D = 39 * cm;      // shell, door on +Z
  var slots = 25, pitch = 1 * cm, rW = 15 * cm;   // 25 slots, 10 mm apart, 300 mm wafers
  var y0 = -(slots - 1) * pitch / 2;
  var accentSlot = 17;
  var parts = [];
  function add(c) { parts.push(c); }
  function rect(w, h, z, per, tn) {
    return PC.polyline({ pts: [[-w / 2, -h / 2, z], [w / 2, -h / 2, z], [w / 2, h / 2, z], [-w / 2, h / 2, z]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- the shell: five translucent walls, the front face left open ----------
  add(PC.box({ w: W, h: H, d: D, faces: ['nz'], n: 5200, tone: 0.18 }));
  add(PC.box({ w: W, h: H, d: D, faces: ['px', 'nx'], n: 9000, tone: 0.16 }));
  add(PC.box({ w: W, h: H, d: D, faces: ['py'], n: 4000, tone: 0.24 }));
  add(PC.box({ w: W, h: H, d: D, faces: ['ny'], n: 4000, tone: 0.3 }));
  add(PC.boxEdges({ w: W, h: H, d: D, perUnit: 360, tone: 0.95 }));

  // door opening: the flange around the mouth, and the recessed seal behind it
  var fw = 3 * cm, fd = 1.8 * cm, zf = D / 2 - fd / 2;
  [[W, fw, 0, H / 2 - fw / 2], [W, fw, 0, -H / 2 + fw / 2],
   [fw, H - 2 * fw, -W / 2 + fw / 2, 0], [fw, H - 2 * fw, W / 2 - fw / 2, 0]].forEach(function (b) {
    add(PC.T(PC.box({ w: b[0], h: b[1], d: fd, n: 1100, tone: 0.45 }), { pos: [b[2], b[3], zf] }));
    add(PC.T(PC.boxEdges({ w: b[0], h: b[1], d: fd, perUnit: 300, tone: 1 }), { pos: [b[2], b[3], zf] }));
  });
  add(rect(W - 7.5 * cm, H - 7.5 * cm, D / 2 - 3 * cm, 220, 0.4));

  // ---------- 25 wafers on their slot teeth ----------
  for (var i = 0; i < slots; i++) {
    var y = y0 + i * pitch, acc = (i === accentSlot);
    var disc = PC.disc({ r: rW, n: 300, tone: 0.22 });
    var rim = PC.circle({ r: rW, perUnit: 150, tone: 0.8 });
    add(PC.T(acc ? PC.accent(disc, 0.45) : disc, { pos: [0, y, 0] }));
    add(PC.T(acc ? PC.accent(rim, 1) : rim, { pos: [0, y, 0] }));
    // the teeth the wafer rests on, running front to back down both side walls
    [1, -1].forEach(function (s) {
      add(PC.line({ a: [s * (W / 2 - 3 * cm), y - 0.2 * cm, -D / 2 + 6 * cm], b: [s * (W / 2 - 3 * cm), y - 0.2 * cm, D / 2 - 3 * cm], perUnit: 150, tone: 0.3 }));
    });
  }

  // ---------- robotic handle on top ----------
  var pl = 1.6 * cm, ph = H / 2 + pl / 2;
  add(PC.T(PC.box({ w: 24 * cm, h: pl, d: 16 * cm, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 3000, tone: 0.4 }), { pos: [0, ph, 0] }));
  add(PC.T(PC.boxEdges({ w: 24 * cm, h: pl, d: 16 * cm, perUnit: 340, tone: 1 }), { pos: [0, ph, 0] }));
  var bh = 5 * cm, by = H / 2 + pl + bh / 2;
  add(PC.T(PC.box({ w: 18 * cm, h: bh, d: 6 * cm, n: 3000, tone: 0.35 }), { pos: [0, by, 0] }));
  add(PC.T(PC.boxEdges({ w: 18 * cm, h: bh, d: 6 * cm, perUnit: 340, tone: 1 }), { pos: [0, by, 0] }));

  // ---------- carry rails on both side walls ----------
  [1, -1].forEach(function (s) {
    var rl = 22 * cm, rh = 3 * cm, rd = 2.2 * cm;
    add(PC.T(PC.box({ w: rd, h: rh, d: rl, n: 1100, tone: 0.3 }), { pos: [s * (W / 2 + rd / 2), H / 2 - 6 * cm, -2 * cm] }));
    add(PC.T(PC.boxEdges({ w: rd, h: rh, d: rl, perUnit: 240, tone: 0.8 }), { pos: [s * (W / 2 + rd / 2), H / 2 - 6 * cm, -2 * cm] }));
  });

  // ---------- kinematic coupling grooves on the underside ----------
  for (i = 0; i < 3; i++) {
    var a = i * Math.PI * 2 / 3 + Math.PI / 2, R = 11 * cm;
    add(PC.line({
      a: [Math.cos(a) * (R - 3 * cm), -H / 2 - 0.2 * cm, Math.sin(a) * (R - 3 * cm)],
      b: [Math.cos(a) * (R + 3 * cm), -H / 2 - 0.2 * cm, Math.sin(a) * (R + 3 * cm)], perUnit: 260, tone: 0.8
    }));
  }

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.18, -0.5, 0],
    caption: 'A FOUP with its door off: twenty-five 300 mm wafers lying 10 mm apart on the slot teeth inside a sealed box the size of a carry-on bag, with the robot handle on top. One wafer is picked out in copper.'
  };
});
