/* Specimen: an ABF build-up substrate, exploded.
 * Nine square layers: a thick laminate core with plated through-holes in the
 * middle, three build-up layers above and below carrying different routing
 * patterns, and a solder mask top and bottom with the ball grid beneath.
 * Layer thicknesses are exaggerated ~100x so the stack reads.
 */
PC.register('substrate-layers', function (p) {
  var W = 1.0, D = 1.0;          // ~50 mm square substrate
  var T = 0.05, TC = 0.135;      // build-up layer / core thickness (exaggerated)
  var pitch = 0.155;             // exploded pitch: gap is ~2x a layer's thickness
  var parts = [];

  // ---------- a single square layer: light top face, side band, crisp edges ----------
  function plate(y, t, toneTop, nTop, edgeTone, accent) {
    parts.push(PC.T(PC.plane({ w: W, d: D, n: nTop, tone: toneTop }), { pos: [0, y + t / 2, 0] }));
    parts.push(PC.T(PC.box({ w: W, h: t, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: Math.round(nTop * 0.6), tone: toneTop + 0.12 }), { pos: [0, y, 0] }));
    var e = PC.boxEdges({ w: W, h: t, d: D, perUnit: 320, tone: edgeTone });
    parts.push(PC.T(accent ? PC.accent(e, 1) : e, { pos: [0, y, 0] }));
  }

  // ---------- routing patterns, drawn as polylines on a layer's top face ----------
  function routing(kind) {
    var out = [], i, a = 0.46, t;
    if (kind === 'fan') {                                   // escape routing out of the die shadow
      for (i = 0; i < 26; i++) {
        var th = i * Math.PI * 2 / 26 + 0.04;
        var c = Math.cos(th), s = Math.sin(th);
        out.push([[0.14 * c, 0, 0.14 * s], [0.27 * c, 0, 0.27 * s], [0.30 * c + 0.025 * s, 0, 0.30 * s - 0.025 * c], [0.45 * c + 0.025 * s, 0, 0.45 * s - 0.025 * c]]);
      }
      out.push([[-0.14, 0, -0.14], [0.14, 0, -0.14], [0.14, 0, 0.14], [-0.14, 0, 0.14], [-0.14, 0, -0.14]]);
    } else if (kind === 'bus') {                            // long x traces with a jog
      for (i = 0; i < 9; i++) {
        var z = (i - 4) * 0.105, j = (i % 2 ? 0.035 : -0.035);
        out.push([[-a, 0, z], [-0.16, 0, z], [-0.09, 0, z + j], [0.09, 0, z + j], [0.16, 0, z], [a, 0, z]]);
      }
    } else if (kind === 'comb') {                           // a spine with fingers along z
      out.push([[-a, 0, 0], [a, 0, 0]]);
      for (i = 0; i < 13; i++) {
        var x = (i - 6) * 0.072, up = (i % 2 === 0);
        out.push([[x, 0, up ? 0 : -a], [x, 0, up ? a : 0]]);
      }
    } else if (kind === 'mesh') {                           // a power/ground mesh
      for (i = 0; i < 7; i++) {
        t = -a + i * (2 * a / 6);
        out.push([[t, 0, -a], [t, 0, a]]);
        out.push([[-a, 0, t], [a, 0, t]]);
      }
    } else if (kind === 'ring') {                           // nested ground rings with ties
      for (i = 0; i < 4; i++) {
        var r = 0.46 - i * 0.105;
        out.push([[-r, 0, -r], [r, 0, -r], [r, 0, r], [-r, 0, r], [-r, 0, -r]]);
      }
      for (i = 0; i < 8; i++) {
        var ang = i * Math.PI / 4 + Math.PI / 8, cc = Math.cos(ang), ss = Math.sin(ang);
        out.push([[0.12 * cc, 0, 0.12 * ss], [0.46 * cc, 0, 0.46 * ss]]);
      }
    } else {                                                // 'diag' — 45-degree traces
      for (i = 0; i < 12; i++) {
        var u = -0.8 + i * 0.14;
        var x1 = Math.max(-a, u), z1 = -a + (x1 - u);
        var z2 = Math.min(a, -a + (a - u)), x2 = u + (z2 + a);
        if (z1 > a || x2 < -a) continue;
        out.push([[x1, 0, z1], [Math.min(a, x2), 0, z2]]);
      }
    }
    return out;
  }

  function drawRouting(kind, y, tn, accent) {
    var lines = routing(kind), sub = [];
    for (var i = 0; i < lines.length; i++) sub.push(PC.polyline({ pts: lines[i], perUnit: accent ? 210 : 105, tone: 1 }));
    var c = PC.merge.apply(null, sub);
    c = accent ? PC.accent(c, 1) : PC.tone(c, tn);
    parts.push(PC.T(c, { pos: [0, y, 0] }));
  }

  // ---------- the stack ----------
  var kinds = ['mesh', 'diag', 'bus', null, 'fan', 'comb', 'ring'];  // index 3 is the core
  var accentLayer = 5;                                               // one routing layer in copper
  var levels = [];
  for (var k = 0; k < 7; k++) levels.push((k - 3) * pitch);

  // core: thicker, darker, drilled edge to edge
  var yc = levels[3];
  plate(yc, TC, 0.5, 6500, 1);
  // plated through-holes: rings on both faces plus a barrel line through the core
  var ph = [];
  for (var gx = -3; gx <= 3; gx++) for (var gz = -3; gz <= 3; gz++) {
    var hx = gx * 0.135, hz = gz * 0.135;
    if (Math.abs(gx) < 2 && Math.abs(gz) < 2 && (gx + gz) % 2 === 0) continue;
    ph.push(PC.T(PC.circle({ r: 0.032, perUnit: 520, tone: 1 }), { pos: [hx, yc + TC / 2 + 0.003, hz] }));
    ph.push(PC.T(PC.circle({ r: 0.032, perUnit: 220, tone: 0.45 }), { pos: [hx, yc - TC / 2 - 0.003, hz] }));
    ph.push(PC.line({ a: [hx, yc - TC / 2, hz], b: [hx, yc + TC / 2, hz], perUnit: 190, tone: 0.4 }));
  }
  parts.push(PC.merge.apply(null, ph));

  // build-up layers above and below the core
  for (k = 0; k < 7; k++) {
    if (k === 3) continue;
    var y = levels[k], isAcc = (k === accentLayer);
    // layers below the core are drawn lighter so the stack does not silt up in the middle
    var deep = k < 3;
    plate(y, T, deep ? 0.2 : 0.26, deep ? 1800 : 2400, deep ? 0.75 : 0.95, isAcc);
    drawRouting(kinds[k], y + T / 2 + 0.004, deep ? 0.55 : 0.85, isAcc);
    // microvia dots on the layer, and a few stacked-via stubs down to the layer below
    var vias = PC.dots({ nx: 7, nz: 7, sx: 0.128, sz: 0.128, per: 2, tone: deep ? 0.5 : 0.85 });
    parts.push(PC.T(isAcc ? PC.accent(vias, 0.9) : vias, { pos: [0, y + T / 2 + 0.006, 0] }));
    var stubs = [];
    for (var vx = -1; vx <= 1; vx++) for (var vz = -1; vz <= 1; vz++) {
      var sx = vx * 0.33, sz = vz * 0.33;
      stubs.push(PC.line({ a: [sx, y - pitch + T / 2, sz], b: [sx, y - T / 2, sz], perUnit: 260, tone: 0.3 }));
    }
    parts.push(PC.merge.apply(null, stubs));
  }

  // solder mask top (pad openings) and bottom (ball land field)
  var yTop = levels[6] + pitch;
  plate(yTop, 0.032, 0.3, 2600, 0.95);
  var pads = [];
  for (var px = -5; px <= 5; px++) for (var pz = -5; pz <= 5; pz++) {
    pads.push(PC.T(PC.circle({ r: 0.024, perUnit: 300, tone: 1 }), { pos: [px * 0.09, yTop + 0.019, pz * 0.09] }));
  }
  // the die shadow: the square of the package that will sit on this face
  pads.push(PC.T(PC.polyline({ pts: [[-0.34, 0, -0.34], [0.34, 0, -0.34], [0.34, 0, 0.34], [-0.34, 0, 0.34]], closed: true, perUnit: 420, tone: 1 }), { pos: [0, yTop + 0.02, 0] }));
  parts.push(PC.merge.apply(null, pads));

  var yBot = levels[0] - pitch;
  plate(yBot, 0.032, 0.3, 2600, 0.95);
  parts.push(PC.T(PC.dots({ nx: 13, nz: 13, sx: 0.078, sz: 0.078, per: 5, tone: 0.8 }), { pos: [0, yBot - 0.055, 0] }));

  // corner guide lines: they span only the gaps between layers, so the eye reads the
  // nine plates as one assembly without any line escaping past the top or bottom.
  var g = [], all = [yBot].concat(levels.slice(0, 3)).concat([yc]).concat(levels.slice(4)).concat([yTop]);
  var th = [0.032, T, T, T, TC, T, T, T, 0.032];
  for (var q = 0; q < 4; q++) {
    var cx = (q === 0 || q === 3) ? -W / 2 : W / 2, cz = (q < 2) ? -D / 2 : D / 2;
    for (var m = 0; m < all.length - 1; m++) {
      g.push(PC.line({ a: [cx, all[m] + th[m] / 2, cz], b: [cx, all[m + 1] - th[m + 1] / 2, cz], perUnit: 190, tone: 0.32 }));
    }
  }
  parts.push(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.6, -0.7, 0],
    caption: 'An ABF build-up substrate pulled apart: solder mask, three build-up layers of routing, a laminate core drilled with plated through-holes, three more build-up layers and the ball grid below. One routing layer is picked out in copper. Layer thicknesses are exaggerated about a hundredfold.'
  };
});
