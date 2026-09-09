/* Specimen: an AI accelerator package. Parameterised by p.layout (mm):
 *   { interposer:[w,h], dies:[{x,y,w,h}], hbm:[{x,y,w,h}], substrate:[w,h] }
 *   or { waferScale:true, diameterMm:300, dieGrid:[cols, rows] }
 * Default: two reticle-sized logic dies and eight HBM stacks (Blackwell-style).
 */
PC.register('package', function (p) {
  var L = (p && p.layout) || {
    interposer: [85, 85],
    dies: [{ x: -13, y: 0, w: 26, h: 32 }, { x: 13, y: 0, w: 26, h: 32 }],
    hbm: [{ x: -34, y: 24, w: 11, h: 12 }, { x: -34, y: 8, w: 11, h: 12 }, { x: -34, y: -8, w: 11, h: 12 }, { x: -34, y: -24, w: 11, h: 12 },
          { x: 34, y: 24, w: 11, h: 12 }, { x: 34, y: 8, w: 11, h: 12 }, { x: 34, y: -8, w: 11, h: 12 }, { x: 34, y: -24, w: 11, h: 12 }],
    substrate: [110, 110]
  };
  var S = 1 / 60; // mm -> units
  var parts = [];

  // ---------- wafer-scale variant ----------
  if (L.waferScale) {
    var R = (L.diameterMm || 300) / 2 * S, th = 1.6 * S;
    var body = PC.cylinder({ r: R, h: th, n: 52000, tone: 0.5 });
    var keep = [];
    for (var i = 0; i < body.length; i += 4) { var x = body[i], z = body[i + 2]; if (Math.sqrt(x * x + (z - R) * (z - R)) < R * 0.045) continue; keep.push(body[i], body[i + 1], body[i + 2], body[i + 3]); }
    parts.push(new Float32Array(keep));
    var cols = (L.dieGrid && L.dieGrid[0]) || 12, rows = (L.dieGrid && L.dieGrid[1]) || 7;
    var dw = 2 * R * 0.94 / cols, dh = 2 * R * 0.94 / rows;
    for (var gx = 0; gx < cols; gx++) for (var gz = 0; gz < rows; gz++) {
      var cx = (gx - (cols - 1) / 2) * dw, cz = (gz - (rows - 1) / 2) * dh;
      var corners = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
      if (!corners.every(function (c) { return c[0] * c[0] + c[1] * c[1] < (R * 0.985) * (R * 0.985); })) continue;
      var y = th / 2 + 0.004;
      parts.push(PC.polyline({ pts: [[cx - dw / 2, y, cz - dh / 2], [cx + dw / 2, y, cz - dh / 2], [cx + dw / 2, y, cz + dh / 2], [cx - dw / 2, y, cz + dh / 2]], closed: true, perUnit: 140, tone: 1 }));
      // a faint core grid inside each die
      parts.push(PC.T(PC.dots({ nx: 3, nz: 3, sx: dw / 4, sz: dh / 4, tone: 0.45 }), { pos: [cx, y, cz] }));
    }
    parts.push(PC.T(PC.accent(PC.circle({ r: R * 0.995, perUnit: 500 }), 0.9), { pos: [0, th / 2 + 0.004, 0] }));
    return { cloud: PC.merge.apply(null, parts), spin: 0.1, tilt: [0.9, -0.5, 0], caption: 'A wafer-scale processor: the whole 300 mm wafer is one chip, with the die grid left in place and wired together across the scribe lines.' };
  }

  // ---------- conventional package ----------
  var sub = L.substrate || [L.interposer[0] * 1.3, L.interposer[1] * 1.3];
  var subW = sub[0] * S, subD = sub[1] * S, subH = 1.8 * S;
  var ipW = L.interposer[0] * S, ipD = L.interposer[1] * S, ipH = 0.9 * S;
  var dieH = 0.9 * S, hbmH = 1.35 * S; // die and HBM heights, slightly exaggerated so the stacks read

  // substrate slab (no bottom face; the ball grid covers it)
  parts.push(PC.box({ w: subW, h: subH, d: subD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 26000, tone: 0.42 }));
  parts.push(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 300, tone: 0.9 }));
  // BGA ball grid under the substrate
  var pitch = 3.6 * S, nb = Math.max(4, Math.floor(subW / pitch) - 1);
  var balls = PC.dots({ nx: nb, nz: Math.max(4, Math.floor(subD / pitch) - 1), sx: pitch, sz: pitch, per: 3, tone: 0.75 });
  parts.push(PC.T(balls, { pos: [0, -subH / 2 - 0.35 * S, 0] }));
  // stiffener ring on the substrate around the interposer
  var ringW = 5 * S, ringH = 1.4 * S, gap = 3 * S, y0 = subH / 2;
  var rx = ipW / 2 + gap, rz = ipD / 2 + gap;
  var ringParts = [
    PC.T(PC.box({ w: 2 * rx + 2 * ringW, h: ringH, d: ringW, tone: 0.45 }), { pos: [0, y0 + ringH / 2, rz + ringW / 2] }),
    PC.T(PC.box({ w: 2 * rx + 2 * ringW, h: ringH, d: ringW, tone: 0.45 }), { pos: [0, y0 + ringH / 2, -rz - ringW / 2] }),
    PC.T(PC.box({ w: ringW, h: ringH, d: 2 * rz, tone: 0.45 }), { pos: [rx + ringW / 2, y0 + ringH / 2, 0] }),
    PC.T(PC.box({ w: ringW, h: ringH, d: 2 * rz, tone: 0.45 }), { pos: [-rx - ringW / 2, y0 + ringH / 2, 0] })
  ];
  parts.push(PC.merge.apply(null, ringParts));
  // interposer
  var yIp = y0 + ipH / 2;
  parts.push(PC.T(PC.box({ w: ipW, h: ipH, d: ipD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 16000, tone: 0.5 }), { pos: [0, yIp, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: ipW, h: ipH, d: ipD, perUnit: 320, tone: 1 }), { pos: [0, yIp, 0] }));
  // a sparse TSV / RDL dot field on the exposed interposer top
  parts.push(PC.T(PC.dots({ nx: Math.floor(ipW / (2.2 * S)), nz: Math.floor(ipD / (2.2 * S)), sx: 2.2 * S, tone: 0.28 }), { pos: [0, y0 + ipH + 0.003, 0] }));
  var yTop = y0 + ipH;
  // logic dies
  (L.dies || []).forEach(function (d) {
    var w = d.w * S, dd = d.h * S;
    parts.push(PC.T(PC.box({ w: w, h: dieH, d: dd, faces: ['py', 'px', 'nx', 'pz', 'nz'], tone: 0.72 }), { pos: [d.x * S, yTop + dieH / 2, -d.y * S] }));
    parts.push(PC.T(PC.boxEdges({ w: w, h: dieH, d: dd, perUnit: 360, tone: 1 }), { pos: [d.x * S, yTop + dieH / 2, -d.y * S] }));
    // floorplan hint: an inner rectangle and a light block grid on the die top
    var inner = PC.polyline({ pts: [[-w * 0.42, 0, -dd * 0.42], [w * 0.42, 0, -dd * 0.42], [w * 0.42, 0, dd * 0.42], [-w * 0.42, 0, dd * 0.42]], closed: true, perUnit: 220, tone: 0.9 });
    parts.push(PC.T(inner, { pos: [d.x * S, yTop + dieH + 0.003, -d.y * S] }));
    parts.push(PC.T(PC.dots({ nx: 6, nz: 8, sx: w * 0.13, sz: dd * 0.1, tone: 0.5 }), { pos: [d.x * S, yTop + dieH + 0.003, -d.y * S] }));
  });
  // HBM stacks: boxes with 12 layer lines and accent tops
  (L.hbm || []).forEach(function (h) {
    var w = h.w * S, dd = h.h * S, x = h.x * S, z = -h.y * S, yc = yTop + hbmH / 2;
    parts.push(PC.T(PC.box({ w: w, h: hbmH, d: dd, faces: ['px', 'nx', 'pz', 'nz'], tone: 0.55 }), { pos: [x, yc, z] }));
    for (var k = 1; k <= 12; k++) {
      var yy = yTop + hbmH * k / 13;
      parts.push(PC.T(PC.polyline({ pts: [[-w / 2, 0, -dd / 2], [w / 2, 0, -dd / 2], [w / 2, 0, dd / 2], [-w / 2, 0, dd / 2]], closed: true, perUnit: 260, tone: 0.95 }), { pos: [x, yy, z] }));
    }
    parts.push(PC.T(PC.accent(PC.plane({ w: w, d: dd }), 0.85), { pos: [x, yTop + hbmH, z] }));
    parts.push(PC.T(PC.accent(PC.polyline({ pts: [[-w / 2, 0, -dd / 2], [w / 2, 0, -dd / 2], [w / 2, 0, dd / 2], [-w / 2, 0, dd / 2]], closed: true, perUnit: 320 }), 1), { pos: [x, yTop + hbmH + 0.002, z] }));
  });
  var nd = (L.dies || []).length, nh = (L.hbm || []).length;
  var cloud = PC.merge.apply(null, parts);
  return {
    cloud: cloud,
    spin: 0.1,
    tilt: [0.55, -0.7, 0],
    caption: 'An accelerator package: ' + nd + ' logic die' + (nd === 1 ? '' : 's') + (nh ? ' and ' + nh + ' HBM stacks (amber tops)' : '') + ' on a silicon interposer, inside a stiffener ring on a build-up substrate with its ball grid below.'
  };
});
