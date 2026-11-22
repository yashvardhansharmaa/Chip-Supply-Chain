/* =====================================================================================================
   14 Data centers: a liquid-cooled rack of 72 GPUs, the GB200 NVL72, to scale in metres (2.24 m tall, 600 mm wide).
   Three trays slide out of the front the way they are serviced: a compute tray, a switch tray and one of the gray
   steel power shelves. The copper busbar they plug into is drawn pulled back out of the rear. */
R('rack', function (m) {
  var W = 0.60, Dp = 1.068, Ht = 2.236, U = 0.0445, post = 0.042, front = Dp / 2, back = -Dp / 2;
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0 });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { m.box({ c: [q[0] * (W / 2 - post / 2), Ht / 2, q[1] * (Dp / 2 - post / 2)], s: [post, Ht, post] }, 'mid'); });
  m.box({ c: [0, 0.045, 0], s: [W, 0.09, Dp] }, 'mid');
  m.box({ c: [0, Ht - 0.031, 0], s: [W, 0.062, Dp] }, 'steel');
  [-1, 1].forEach(function (s) { m.box({ c: [s * (W / 2 - 0.004), 0.09 + (Ht - 0.22) / 2, 0], s: [0.008, Ht - 0.22, Dp - 0.10] }, 'ghost'); });
  // the trays, floor up: [kind, count, gap above]
  var y = 0.114, slots = [];
  [['cdu', 4, 0.045], ['power', 3, 0.042], ['compute', 8, 0.026], ['switch', 9, 0.026], ['compute', 10, 0.042], ['power', 3, 0.038], ['mgmt', 1, 0]].forEach(function (s) { for (var i = 0; i < s[1]; i++) { slots.push({ k: s[0], y: y + U / 2 }); y += U; } y += s[2]; });
  var stackTop = y, tW = 0.522, tH = U * 0.9, fz = front - 0.012, tz0 = back + 0.10, tD = fz - tz0, tzc = (fz + tz0) / 2;
  var pullIdx = { 5: 1, 18: 2, 28: 3 }; // a power shelf, a switch tray, a compute tray
  function tray(sl, part) {
    var k = sl.k, d = [], f = tD / 2 + 0.0005;
    if (k === 'compute') { [-1, 1].forEach(function (s) { d.push(D.rectXY(s * 0.132 - 0.1025, -tH * 0.34, s * 0.132 + 0.1025, tH * 0.34, f, { lw: 0.45 })); }); }
    else if (k === 'switch') { d.push(D.rectXY(-tW * 0.4, -tH * 0.26, tW * 0.4, tH * 0.26, f, { lw: 0.45, fill: 'dark' })); }
    else if (k === 'power') { for (var q = 0; q < 6; q++) { var qx = (q - 2.5) * ((tW - 0.02) / 6); d.push(D.rectXY(qx - (tW - 0.05) / 12, -tH * 0.37, qx + (tW - 0.05) / 12, tH * 0.37, f, { lw: 0.45, col: 'acc2' })); } }
    var mat = k === 'power' ? 'acc2Dark' : k === 'switch' ? 'mid' : k === 'cdu' ? 'steel' : 'light';
    m.box({ c: [0, sl.y, tzc], s: [tW, tH, tD], decals: { pz: d } }, mat);
  }
  slots.forEach(function (sl, i) { if (pullIdx[i] || sl.k === 'cdu') return; tray(sl); });
  var cduY = (slots[0].y + slots[3].y) / 2;
  m.box({ c: [0, cduY, tzc], s: [tW, 4 * U * 0.94, tD], decals: { pz: [-1, 1].map(function (s) { return D.circle(0, 0, 0.046, 0, 24, { lw: 0.6 }); }).map(function (it, j) { return { pts: it.pts.map(function (p) { return [p[0] + (j ? 0.155 : -0.155), p[2], tD / 2 + 0.0005]; }), closed: true, lw: 0.6 }; }) } }, 'steel');
  // the rear: the NVLink cable cartridge either side of the busbar's place, and the coolant manifold
  var sy0 = 0.164, sy1 = stackTop - 0.02, sh = sy1 - sy0, syc = (sy0 + sy1) / 2, zS = back + 0.085;
  [-1, 1].forEach(function (s) {
    var ln = []; for (var i = 0; i < 18; i++) { var lx = (i - 8.5) * 0.0112; ln.push(D.line([lx, -sh / 2, -0.011], [lx, sh / 2, -0.011], { lw: 0.35, alpha: 0.7 })); }
    m.box({ c: [s * 0.172, syc, zS], s: [0.212, sh, 0.02], decals: { nz: ln } }, 'mid');
  });
  [back + 0.30, back + 0.40].forEach(function (pz) { var prof = [[0, sy0 - 0.13], [0.03, sy0 - 0.13]]; for (var q = 0; q <= 10; q++) prof.push([0.03, sy0 - 0.10 + q * (sh + 0.24) / 10, 2]); prof.push([0.03, sy1 + 0.17]); prof.push([0, sy1 + 0.17]); m.revolve(prof, 'turned', { seg: 12, pos: [W / 2 - 0.058, 0, pz] }); });
  // pulled trays
  var pulled = [];
  Object.keys(pullIdx).forEach(function (i) {
    var p = m.part('pull' + i, { ex: [0, 0, 0.78], seq: pullIdx[i] }); tray(slots[i], p); pulled.push([+i, p]);
    [-1, 1].forEach(function (s) { m.guide([[s * tW / 2, slots[i].y - tH / 2, tz0, cab.idx], [s * tW / 2, slots[i].y - tH / 2, tz0, p.idx]], { alpha: 0.7 }); });
  });
  // the busbar, copper, with a clip at every tray, pulled back out of the rear
  var bb = m.part('busbar', { ex: [0, 0, -2.25], seq: 4 });
  var clips = slots.filter(function (s) { return s.k !== 'cdu' && s.k !== 'mgmt'; }).map(function (s) { return D.rectXY(-0.043, s.y - syc - U * 0.25, 0.043, s.y - syc + U * 0.25, -0.0155, { lw: 0.45, col: 'acc' }); });
  var clipsF = clips.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0] * 0.5, q[1], 0.0155]; }), closed: true, lw: it.lw, col: it.col }; });
  var clipsX = clips.map(function (it) { return { pts: it.pts.map(function (q) { return [0.0265, q[1], q[0] * 0.3]; }), closed: true, lw: it.lw, col: it.col }; });
  m.box({ c: [0, syc, zS + 0.02], s: [0.052, sh + 0.10, 0.03], decals: { nz: clips, pz: clipsF, px: clipsX } }, 'acc');
  [sy0 + 0.1, sy1 - 0.1].forEach(function (gy) { m.guide([[0, gy, zS + 0.02, cab.idx], [0, gy, zS + 0.02, bb.idx]], { style: 'axis', alpha: 0.8 }); });
  m.dim([W / 2, 0, back], [W / 2, Ht, back], [0.1, 0, 0], '2.24 m', { part: cab.idx, t: 0.62 });
  // designer pass (21 Nov 2026): the width taken further out in front, so its figure clears the rack's foot
  m.dim([-W / 2, 0, front], [W / 2, 0, front], [0, 0, 0.2], '600 mm', { part: cab.idx });
  var pp = {}; pulled.forEach(function (q) { pp[q[0]] = q[1]; });
  m.callout([-tW * 0.3, slots[5].y, fz, pp[5].idx], 'Power shelf', { side: 'l' });
  m.callout([-tW * 0.3, slots[18].y, fz, pp[18].idx], 'NVLink switch tray', { side: 'l' });
  m.callout([-tW * 0.3, slots[28].y, fz, pp[28].idx], 'Compute tray', { side: 'l' });
  m.callout([0.026, syc + 0.35, zS + 0.02, bb.idx], 'Copper busbar', { side: 'r' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [176, 102, 44], accentDark: [224, 154, 92], accent2: [110, 115, 120], accent2Dark: [185, 190, 195] };
});
