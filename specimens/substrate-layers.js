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
      for (i = 0; i < 40; i++) {
        var th = i * Math.PI * 2 / 40 + 0.04;
        var c = Math.cos(th), s = Math.sin(th);
        out.push([[0.13 * c, 0, 0.13 * s], [0.27 * c, 0, 0.27 * s], [0.30 * c + 0.02 * s, 0, 0.30 * s - 0.02 * c], [0.45 * c + 0.02 * s, 0, 0.45 * s - 0.02 * c]]);
      }
      out.push([[-0.13, 0, -0.13], [0.13, 0, -0.13], [0.13, 0, 0.13], [-0.13, 0, 0.13], [-0.13, 0, -0.13]]);
    } else if (kind === 'bus') {                            // long x traces with a jog
      for (i = 0; i < 13; i++) {
        var z = (i - 6) * 0.068, j = (i % 2 ? 0.03 : -0.03);
        out.push([[-a, 0, z], [-0.14, 0, z], [-0.08, 0, z + j], [0.08, 0, z + j], [0.14, 0, z], [a, 0, z]]);
      }
    } else if (kind === 'comb') {                           // a spine with fingers along z
      out.push([[-a, 0, 0], [a, 0, 0]]);
      for (i = 0; i < 19; i++) {
        var x = (i - 9) * 0.048, up = (i % 2 === 0);
        out.push([[x, 0, up ? 0 : -a], [x, 0, up ? a : 0]]);
      }
    } else if (kind === 'mesh') {                           // a power/ground mesh
      for (i = 0; i < 10; i++) {
        t = -a + i * (2 * a / 9);
        out.push([[t, 0, -a], [t, 0, a]]);
        out.push([[-a, 0, t], [a, 0, t]]);
      }
    } else if (kind === 'ring') {                           // nested ground rings with ties
      for (i = 0; i < 5; i++) {
        var r = 0.46 - i * 0.085;
        out.push([[-r, 0, -r], [r, 0, -r], [r, 0, r], [-r, 0, r], [-r, 0, -r]]);
      }
      for (i = 0; i < 8; i++) {
        var ang = i * Math.PI / 4 + Math.PI / 8, cc = Math.cos(ang), ss = Math.sin(ang);
        out.push([[0.10 * cc, 0, 0.10 * ss], [0.46 * cc, 0, 0.46 * ss]]);
      }
    } else {                                                // 'diag' — 45-degree traces
      for (i = 0; i < 22; i++) {
        var u = -0.92 + i * 0.084;
        var x1 = Math.max(-a, u), z1 = -a + (x1 - u);
        var x2 = Math.min(a, u + 2 * a), z2 = -a + (x2 - u);
        if (z1 > a || z2 < -a) continue;
        z2 = Math.min(z2, a); x2 = u + (z2 + a);
        out.push([[x1, 0, z1], [Math.min(a, x2), 0, z2]]);
      }
    }
    return out;
  }

  function drawRouting(kind, y, tn, accent) {
    var lines = routing(kind), sub = [];
    for (var i = 0; i < lines.length; i++) sub.push(PC.polyline({ pts: lines[i], perUnit: 190, tone: 1 }));
    var c = PC.merge.apply(null, sub);
    c = accent ? PC.accent(c, 0.95) : PC.tone(c, tn);
    parts.push(PC.T(c, { pos: [0, y, 0] }));
  }

  // ---------- the stack ----------
  var kinds = ['mesh', 'bus', 'fan', null, 'fan', 'comb', 'ring'];  // index 3 is the core
  var accentLayer = 5;                                              // one routing layer in copper
  var levels = [];
  for (var k = 0; k < 7; k++) levels.push((k - 3) * pitch);

  // core
  var yc = levels[3];
  plate(yc, TC, 0.46, 4200, 1);
  // plated through-holes: rings on both faces plus a barrel line through the core
  var ph = [];
  for (var gx = -3; gx <= 3; gx++) for (var gz = -3; gz <= 3; gz++) {
    var hx = gx * 0.135, hz = gz * 0.135;
    if (Math.abs(gx) < 2 && Math.abs(gz) < 2 && (gx + gz) % 2 === 0) continue;
    ph.push(PC.T(PC.circle({ r: 0.028, perUnit: 460, tone: 0.95 }), { pos: [hx, yc + TC / 2 + 0.003, hz] }));
    ph.push(PC.T(PC.circle({ r: 0.028, perUnit: 300, tone: 0.6 }), { pos: [hx, yc - TC / 2 - 0.003, hz] }));
    ph.push(PC.line({ a: [hx, yc - TC / 2, hz], b: [hx, yc + TC / 2, hz], perUnit: 320, tone: 0.5 }));
  }
  parts.push(PC.merge.apply(null, ph));

  // build-up layers above and below the core
  for (k = 0; k < 7; k++) {
    if (k === 3) continue;
    var y = levels[k];
    plate(y, T, 0.30, 3000, 0.95);
    drawRouting(kinds[k], y + T / 2 + 0.004, 0.9, k === accentLayer);
    // microvia dots on the layer, and stacked-via stubs reaching down to the layer below
    var vt = k === accentLayer ? null : 0.8;
    var vias = PC.dots({ nx: 9, nz: 9, sx: 0.098, sz: 0.098, per: 2, tone: 0.85 });
    parts.push(PC.T(k === accentLayer ? PC.accent(vias, 0.9) : PC.tone(vias, vt), { pos: [0, y + T / 2 + 0.006, 0] }));
    var stubs = [];
    for (var vx = -2; vx <= 2; vx++) for (var vz = -2; vz <= 2; vz++) {
      var sx = vx * 0.19, sz = vz * 0.19;
      var below = k < 3 ? y - pitch + T / 2 : y - pitch + T / 2;
      stubs.push(PC.line({ a: [sx, below, sz], b: [sx, y - T / 2, sz], perUnit: 330, tone: 0.4 }));
    }
    parts.push(PC.merge.apply(null, stubs));
  }

  // solder mask top (pad openings) and bottom (ball land field)
  var yTop = levels[6] + pitch;
  plate(yTop, 0.035, 0.34, 3000, 0.95);
  var pads = [];
  for (var px = -6; px <= 6; px++) for (var pz = -6; pz <= 6; pz++) {
    if (Math.abs(px) > 5 || Math.abs(pz) > 5) continue;
    pads.push(PC.T(PC.circle({ r: 0.021, perUnit: 320, tone: 0.95 }), { pos: [px * 0.078, yTop + 0.020, pz * 0.078] }));
  }
  parts.push(PC.merge.apply(null, pads));

  var yBot = levels[0] - pitch;
  plate(yBot, 0.035, 0.34, 3000, 0.95);
  parts.push(PC.T(PC.dots({ nx: 13, nz: 13, sx: 0.078, sz: 0.078, per: 5, tone: 0.75 }), { pos: [0, yBot - 0.05, 0] }));

  // corner guide lines so the eye reads the nine layers as one assembly
  var g = [];
  for (var q = 0; q < 4; q++) {
    var cx = (q === 0 || q === 3) ? -W / 2 : W / 2, cz = (q < 2) ? -D / 2 : D / 2;
    g.push(PC.line({ a: [cx, yBot - 0.06, cz], b: [cx, yTop + 0.06, cz], perUnit: 130, tone: 0.28 }));
  }
  parts.push(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.6, -0.7, 0],
    caption: 'An ABF build-up substrate pulled apart: solder mask, three build-up layers of routing, a laminate core drilled with plated through-holes, three more build-up layers and the ball grid below. One routing layer is picked out in copper. Layer thicknesses are exaggerated about a hundredfold.'
  };
});
