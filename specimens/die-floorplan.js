/* Specimen: a GPU die floorplan, drawn the way a die shot is annotated.
 * A reticle-sized die (26 x 32 mm) seen from above: two banks of 8 x 8
 * streaming-multiprocessor blocks either side of a central L2 cache band,
 * HBM PHY strips down both long edges (accent), NVLink and I/O along the
 * short edges, and the memory ring bus running inside the PHY.
 */
PC.register('die-floorplan', function (p) {
  var W = 1.30, D = 1.60, H = 0.052;          // 26 : 32 aspect, thin
  var y0 = H / 2;                              // die top surface
  var y1 = y0 + 0.003, y2 = y0 + 0.006, y3 = y0 + 0.009;
  var parts = [];

  function fill(cx, cz, w, d, y, t, n) {
    return PC.T(PC.plane({ w: w, d: d, tone: t, n: n }), { pos: [cx, y, cz] });
  }
  function rect(cx, cz, w, d, y, t, per) {
    return PC.T(PC.polyline({
      pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]],
      closed: true, perUnit: per || 320, tone: t
    }), { pos: [cx, y, cz] });
  }
  function seg(x1, z1, x2, z2, y, t, per) {
    return PC.line({ a: [x1, y, z1], b: [x2, y, z2], perUnit: per || 300, tone: t });
  }

  // ---------- the die itself ----------
  parts.push(fill(0, 0, W, D, y0, 0.24, 13000));                                   // silicon ground
  parts.push(PC.box({ w: W, h: H, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 2400, tone: 0.45 }));
  parts.push(PC.boxEdges({ w: W, h: H, d: D, perUnit: 280, tone: 1 }));
  parts.push(rect(0, 0, W - 0.030, D - 0.030, y1, 0.95, 400));                     // seal ring
  parts.push(rect(0, 0, W - 0.062, D - 0.062, y1, 0.5, 220));
  // scribe-line alignment crosses just inside each corner
  for (var q = 0; q < 4; q++) {
    var qx = (q < 2 ? -1 : 1) * (W / 2 - 0.026), qz = (q % 2 ? -1 : 1) * (D / 2 - 0.026);
    parts.push(seg(qx - 0.014, qz, qx + 0.014, qz, y3, 1, 480));
    parts.push(seg(qx, qz - 0.014, qx, qz + 0.014, y3, 1, 480));
  }

  // ---------- HBM PHY strips down both long edges (accent) ----------
  var phyX = 0.573, phyW = 0.118, phyZ = 1.34, nPhy = 6, s, i, k, cx, cz, hh;
  for (s = -1; s <= 1; s += 2) {
    cx = s * phyX;
    parts.push(PC.accent(fill(cx, 0, phyW, phyZ, y1, 1, 2100), 0.5));
    hh = phyZ / nPhy;
    for (i = 0; i < nPhy; i++) {
      cz = -phyZ / 2 + hh * (i + 0.5);
      parts.push(PC.accent(rect(cx, cz, phyW - 0.016, hh - 0.020, y2, 1, 400), 1));
      for (k = 0; k < 4; k++) {                                                     // PHY macro rows
        var zz = cz - hh * 0.27 + k * hh * 0.18;
        parts.push(PC.accent(seg(cx - phyW / 2 + 0.024, zz, cx + phyW / 2 - 0.024, zz, y3, 1, 240), 0.62));
      }
    }
  }
  // memory ring bus: a pair of long lines just inboard of each PHY strip
  for (s = -1; s <= 1; s += 2) {
    parts.push(seg(s * 0.516, -0.72, s * 0.516, 0.72, y2, 0.6, 300));
    parts.push(seg(s * 0.506, -0.72, s * 0.506, 0.72, y2, 0.38, 300));
  }

  // ---------- NVLink / PCIe I/O blocks along the short edges ----------
  var ioZ = 0.731, ioD = 0.098, nIo = 4, ioW = 0.236;
  for (s = -1; s <= 1; s += 2) {
    cz = s * ioZ;
    for (i = 0; i < nIo; i++) {
      cx = (i - (nIo - 1) / 2) * (ioW + 0.024);
      parts.push(fill(cx, cz, ioW - 0.02, ioD - 0.02, y1, 0.34, 150));
      parts.push(rect(cx, cz, ioW, ioD, y2, 1, 380));
      for (k = 0; k < 5; k++) {                                                     // SerDes lanes
        var xx = cx - ioW * 0.28 + k * ioW * 0.14;
        parts.push(seg(xx, cz - ioD / 2 + 0.016, xx, cz + ioD / 2 - 0.016, y3, 0.8, 260));
      }
    }
  }

  // ---------- corner blocks: PLLs and test structures ----------
  for (s = -1; s <= 1; s += 2) for (var t2 = -1; t2 <= 1; t2 += 2) {
    parts.push(fill(s * 0.573, t2 * 0.731, 0.118, 0.098, y1, 0.5, 150));
    parts.push(rect(s * 0.573, t2 * 0.731, 0.118, 0.098, y2, 1, 380));
    parts.push(rect(s * 0.573, t2 * 0.731, 0.062, 0.050, y3, 0.85, 320));
  }

  // ---------- central L2 cache band ----------
  var l2X = 1.00, l2Slices = 16;
  [-1, 1].forEach(function (sg) {
    var zc = sg * 0.0565;                       // two strips either side of the crossbar gap
    parts.push(fill(0, zc, l2X, 0.097, y1, 0.4, 1100));
    parts.push(rect(0, zc, l2X, 0.097, y2, 1, 400));
    for (var j = 1; j < l2Slices; j++) {
      var x = -l2X / 2 + j * l2X / l2Slices;
      parts.push(seg(x, zc - 0.0485, x, zc + 0.0485, y3, 1, 340));
    }
  });
  // crossbar: fine lines running the width of the die between the two L2 strips
  for (i = 0; i < 5; i++) {
    var zc2 = -0.0075 + i * 0.00375;
    parts.push(seg(-l2X / 2, zc2, l2X / 2, zc2, y2, 0.45, 220));
  }

  // ---------- the SM array: 8 columns x 16 rows in two banks, grouped into GPCs ----------
  var cols = 8, rowsPer = 8, colW = l2X / cols;
  var bankZ0 = 0.132, bankZ1 = 0.666, rowH = (bankZ1 - bankZ0) / rowsPer;
  var smW = colW * 0.72, smD = rowH * 0.62;
  for (var bank = -1; bank <= 1; bank += 2) {
    // GPC boundary: four two-column groups per bank
    parts.push(rect(0, bank * (bankZ0 + bankZ1) / 2, l2X, bankZ1 - bankZ0, y2, 1, 420));
    for (var g = 1; g < 4; g++) {
      var gx = -l2X / 2 + g * l2X / 4;
      parts.push(seg(gx, bank * bankZ0, gx, bank * bankZ1, y2, 1, 420));
      parts.push(seg(gx + 0.004, bank * bankZ0, gx + 0.004, bank * bankZ1, y2, 0.5, 300));
    }
    for (var c = 0; c < cols; c++) {
      cx = (c - (cols - 1) / 2) * colW;
      for (var r = 0; r < rowsPer; r++) {
        cz = bank * (bankZ0 + rowH * (r + 0.5));
        parts.push(rect(cx, cz, smW, smD, y2, 0.9, 340));
        parts.push(fill(cx, cz - smD * 0.24, smW * 0.66, smD * 0.26, y1, 0.7, 24));   // tensor core
      }
      // shared L1 / column bus running from the L2 band out to the end of the bank
      if (c % 2 === 1) parts.push(seg(cx + colW * 0.5, bank * 0.114, cx + colW * 0.5, bank * bankZ1, y3, 0.55, 240));
    }
  }

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [1.0, -0.35, 0],
    caption: 'The floorplan of a reticle-sized GPU die, about 26 by 32 mm: 128 streaming-multiprocessor blocks in two banks, a central L2 cache band and crossbar, HBM PHY strips in copper down both long edges, and NVLink and PCIe I/O along the short edges.'
  };
});
