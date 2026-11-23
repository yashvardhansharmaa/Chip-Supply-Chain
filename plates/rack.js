/* =====================================================================================================
   14 Data centers: a liquid-cooled rack of 72 GPUs, the GB200 NVL72, to scale in metres, as Supermicro's February 2025
   datasheet gives it: 2,236 mm tall, 600 mm wide and 1,068 mm deep, eighteen 1U compute trays (ten above the nine NVLink
   switch trays, eight below), eight 1U power shelves of 33 kW, and a 4U coolant unit. Three trays slide out of the front the
   way they are serviced: a compute tray, a switch tray and one of the power shelves. The copper busbar they plug into is
   drawn pulled back out of the rear.
   22 Nov 2026 review: six power shelves became the datasheet's eight; the height reads 2,236 mm (it read 2.24 m, a rounding);
   the busbar is plain, since its clips stood beside the height like a ruler's graduations, and its two centre lines,
   which cut the height dimension, are gone. Colours (the set's legend): the
   busbar in copper, the power shelves in the set's one steel colour, a grey with no hue (22 Nov 2026 plates refine: it was
   a blue grey, which read as silicon's slate). */
R('rack', function (m) {
  var W = 0.60, Dp = 1.068, Ht = 2.236, U = 0.0445, post = 0.042, front = Dp / 2, back = -Dp / 2;
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0 });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { m.box({ c: [q[0] * (W / 2 - post / 2), Ht / 2, q[1] * (Dp / 2 - post / 2)], s: [post, Ht, post] }, 'mid'); });
  m.box({ c: [0, 0.045, 0], s: [W, 0.09, Dp] }, 'mid');
  m.box({ c: [0, Ht - 0.031, 0], s: [W, 0.062, Dp] }, 'steel');
  [-1, 1].forEach(function (s) { m.box({ c: [s * (W / 2 - 0.004), 0.09 + (Ht - 0.22) / 2, 0], s: [0.008, Ht - 0.22, Dp - 0.10] }, 'ghost'); });
  // the trays, floor up: [kind, count, gap above]
  var y = 0.114, slots = [];
  [['cdu', 4, 0.040], ['power', 4, 0.030], ['compute', 8, 0.020], ['switch', 9, 0.020], ['compute', 10, 0.030], ['power', 4, 0.026], ['mgmt', 1, 0]].forEach(function (s) { for (var i = 0; i < s[1]; i++) { slots.push({ k: s[0], y: y + U / 2 }); y += U; } y += s[2]; });
  var stackTop = y, tW = 0.522, tH = U * 0.9, fz = front - 0.012, tz0 = back + 0.10, tD = fz - tz0, tzc = (fz + tz0) / 2;
  var pullIdx = { 6: 1, 20: 2, 30: 3 }; // a power shelf, a switch tray, a compute tray
  function tray(sl, part) {
    var k = sl.k, d = [], f = tD / 2 + 0.0005;
    if (k === 'compute') { [-1, 1].forEach(function (s) { d.push(D.rectXY(s * 0.132 - 0.1025, -tH * 0.34, s * 0.132 + 0.1025, tH * 0.34, f, { lw: 0.45 })); }); }
    else if (k === 'switch') { d.push(D.rectXY(-tW * 0.4, -tH * 0.26, tW * 0.4, tH * 0.26, f, { lw: 0.45, fill: 'dark' })); }
    else if (k === 'power') { for (var q = 0; q < 6; q++) { var qx = (q - 2.5) * ((tW - 0.02) / 6); d.push(D.rectXY(qx - (tW - 0.05) / 12, -tH * 0.37, qx + (tW - 0.05) / 12, tH * 0.37, f, { lw: 0.45, col: 'acc2' })); } }
    // (round two: the power shelves in the steel grey at the accent's middle weight; at acc2Dark they were the plate's heaviest mark)
    var mat = k === 'power' ? 'acc2' : k === 'switch' ? 'mid' : k === 'cdu' ? 'steel' : 'light';
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
  // (round two: a deeper copper fill, d 0.5, so the thin bar keeps its colour under its outline: src/plate.js draws a part under
  // about 16 px across with its outline tinted, never the ink shade line, which swallowed it)
  m.box({ c: [0, syc, zS + 0.02], s: [0.052, sh + 0.10, 0.03] }, { d: 0.5, c: 'acc' });
  // its trace lines back to its place at the rear, top and foot, so the bar reads as pulled from the rack (designer pass)
  [syc + (sh + 0.10) / 2, syc - (sh + 0.10) / 2].forEach(function (yy) { m.guide([[0, yy, zS + 0.035, cab.idx], [0, yy, zS + 0.035, bb.idx]], { alpha: 0.7 }); });
  // (designer pass, 22 Nov 2026: the figure stands low on its line, under the busbar's foot; at 0.62 it ran into the bar; plates
  // refine: at 0.3 the busbar's lower trace line ran through it, so it stands lower still)
  m.dim([W / 2, 0, back], [W / 2, Ht, back], [0.1, 0, 0], '2,236 mm', { part: cab.idx, t: 0.13 });
  // designer pass (21 Nov 2026): the width taken further out in front, so its figure clears the rack's foot
  m.dim([-W / 2, 0, front], [W / 2, 0, front], [0, 0, 0.2], '600 mm', { part: cab.idx });
  var pp = {}; pulled.forEach(function (q) { pp[q[0]] = q[1]; });
  m.callout([-tW * 0.3, slots[6].y, fz, pp[6].idx], 'Power shelf', { side: 'l' });
  m.callout([-tW * 0.3, slots[20].y, fz, pp[20].idx], 'NVLink switch tray', { side: 'l' });
  // (on a phone, where the labels stand in rows, the compute tray is named from the top row, clear of the trays under it)
  m.callout([-tW * 0.3, slots[30].y, fz, pp[30].idx], 'Compute tray', { side: 'l', row: 't' });
  m.callout([0.026, syc + 0.35, zS + 0.02, bb.idx], 'Copper busbar', { side: 'r' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [176, 102, 44], accentDark: [224, 154, 92], accent2: [122, 122, 122], accent2Dark: [200, 200, 200] };
});
