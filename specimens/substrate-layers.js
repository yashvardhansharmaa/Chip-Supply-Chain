/* Specimen: an ABF build-up substrate, cut away.
 *
 * Real object: the flip-chip BGA substrate under an AI accelerator, about
 * 100 x 72 mm and a millimetre and a half thick. A glass-cloth-and-resin core
 * around 0.8 mm thick, drilled edge to edge with plated through-holes, carries
 * build-up layers of Ajinomoto film laminated on both faces, each layer about
 * 40 um thick with its own copper wiring and its own laser-drilled microvias.
 * The one drawn here is an eight-two-eight: eighteen layers of copper. The
 * biggest AI substrates now run past twenty.
 *
 * Drawing decisions:
 *  - Cut away rather than exploded. Chapters 11 and 12 are both exploded stacks;
 *    a third would read as the same object again. A quarter removed shows the
 *    layer sandwich, which is the only thing about this part worth seeing, and
 *    keeps the outside recognisable as a board.
 *  - Footprint is to scale; the thickness is exaggerated about twenty times.
 *  - The build-up film is the chokepoint, so the dielectric bands are the copper
 *    ones and the metal is drawn in ink.
 */
PC.register('substrate-layers', function (p) {
  var W = 1.00, D = 0.72;                 // 100 x 72 mm
  var tc = 0.075, tb = 0.0125, nb = 8, tr = 0.010;
  var H = tc + 2 * nb * tb + 2 * tr;      // 0.295
  var top = H / 2, cTop = tc / 2;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function seg(a, b, per, tn) { return PC.line({ a: a, b: b, perUnit: per, tone: tn }); }

  // conductor planes above the core: the core's own face, then one per build-up layer
  var lay = [];
  for (var k = 0; k <= nb; k++) lay.push(cTop + k * tb);

  /* ---------------- the section, drawn in a local XY frame ---------------- */
  /* u runs 0..L along the cut face, y is the substrate's own thickness. */
  function section(L) {
    var s = [], i, k, u;
    // resin bulk behind everything
    s.push(PC.T(PC.scatter({ n: Math.round(L * H * 21000), w: L, h: H, d: 0, tone: 0.18 }), { pos: [L / 2, 0, 0] }));
    // the build-up film: the chokepoint, so the dielectric is the copper colour
    for (k = 1; k <= nb; k++) {
      var band = PC.scatter({ n: Math.round(L * tb * 34000), w: L, h: tb * 0.86, d: 0 });
      s.push(PC.T(PC.accent(band, 0.42), { pos: [L / 2, lay[k] - tb / 2, 0] }));
      s.push(PC.T(PC.accent(PC.scatter({ n: Math.round(L * tb * 34000), w: L, h: tb * 0.86, d: 0 }), 0.42), { pos: [L / 2, -lay[k] + tb / 2, 0] }));
    }
    // the core: darker, with a hint of the woven glass cloth inside it
    s.push(PC.T(PC.scatter({ n: Math.round(L * tc * 24000), w: L, h: tc, d: 0, tone: 0.42 }), { pos: [L / 2, 0, 0] }));
    for (i = 0; i < Math.round(L * 46); i++) {
      u = (i + 0.5) * L / Math.round(L * 46);
      [-tc * 0.22, tc * 0.22].forEach(function (yy) {
        s.push(seg([u - L * 0.008, yy, 0], [u + L * 0.008, yy, 0], 420, 0.55));
      });
    }
    // the eighteen conductor layers, drawn as traces in section rather than
    // continuous lines: a faint plane line, then dashes of copper on it
    function conductors(sgn) {
      for (k = 0; k <= nb; k++) {
        var y = sgn * lay[k];
        s.push(seg([0, y, 0], [L, y, 0], k === 0 ? 260 : 120, k === 0 ? 0.55 : 0.28));
        u = 0.004;
        while (u < L - 0.004) {
          var w = 0.004 + PC.rnd() * (k === 0 ? 0.05 : 0.028);
          if (u + w > L - 0.004) break;
          s.push(seg([u, y, 0], [u + w, y, 0], 560, 1));
          u += w + 0.004 + PC.rnd() * 0.02;
        }
      }
    }
    conductors(1); conductors(-1);
    // solder resist, top and bottom
    [1, -1].forEach(function (sg) {
      s.push(PC.T(PC.scatter({ n: Math.round(L * tr * 22000), w: L, h: tr, d: 0, tone: 0.42 }), { pos: [L / 2, sg * (lay[nb] + tr / 2), 0] }));
      s.push(seg([0, sg * top, 0], [L, sg * top, 0], 460, 0.95));
    });
    // plated through-holes: copper barrels straight through the core, with the
    // pads that cap them at both ends
    var np = Math.max(3, Math.round(L * 9));
    for (i = 0; i < np; i++) {
      u = (i + 0.5) * L / np + (PC.rnd() - 0.5) * 0.01;
      var hw = 0.0062;
      s.push(seg([u - hw, -cTop, 0], [u - hw, cTop, 0], 560, 0.82));
      s.push(seg([u + hw, -cTop, 0], [u + hw, cTop, 0], 560, 0.82));
      s.push(seg([u - hw * 2.6, cTop, 0], [u + hw * 2.6, cTop, 0], 560, 0.9));
      s.push(seg([u - hw * 2.6, -cTop, 0], [u + hw * 2.6, -cTop, 0], 560, 0.9));
    }
    // microvias: laser-drilled, tapered, one per build-up layer, some stacked in
    // a column and some staggered as they climb
    var nv = Math.max(4, Math.round(L * 8));
    for (i = 0; i < nv; i++) {
      var u0 = (i + 0.5) * L / nv, stacked = (i % 3 !== 0);
      [1, -1].forEach(function (sg) {
        var uu = u0, climb = 2 + Math.floor(PC.rnd() * (nb - 1));
        for (k = 1; k <= climb; k++) {
          if (!stacked) uu += (k % 2 ? 1 : -1) * 0.011;
          var yl = sg * lay[k - 1], yh = sg * lay[k];
          s.push(seg([uu - 0.0058, yh, 0], [uu - 0.0030, yl, 0], 560, 0.7));
          s.push(seg([uu + 0.0058, yh, 0], [uu + 0.0030, yl, 0], 560, 0.7));
        }
      });
    }
    // the solder balls, shown in section along the bottom edge
    var nbz = Math.max(4, Math.round(L * 22));
    for (i = 0; i < nbz; i++) {
      u = (i + 0.5) * L / nbz;
      var r = 0.011, arc = [];
      for (var a = 0; a <= 16; a++) { var th = Math.PI * a / 16; arc.push([u - r * Math.cos(th), -top - r * Math.sin(th) * 0.85, 0]); }
      s.push(PC.polyline({ pts: arc, perUnit: 620, tone: 0.9 }));
      s.push(PC.T(PC.scatter({ n: 60, w: r * 1.5, h: r * 1.1, d: 0, tone: 0.3 }), { pos: [u, -top - r * 0.42, 0] }));
    }
    return PC.merge.apply(null, s);
  }

  // the two exposed faces of the removed quarter
  add(PC.T(section(D / 2), { rot: [0, -Math.PI / 2, 0] }));          // faces +x, at x = 0
  add(section(W / 2));                                                // faces +z, at z = 0

  /* ---------------- the outside of the board ---------------- */
  function sheet(n, w, h, d, pos, tn) { return PC.T(PC.scatter({ n: n, w: w, h: h, d: d, tone: tn }), { pos: pos }); }
  // top and bottom, as the L left after the quarter is taken out
  [1, -1].forEach(function (sg) {
    var tn = sg > 0 ? 0.24 : 0.3;
    add(sheet(Math.round(W / 2 * D * 8000), W / 2, 0, D, [-W / 4, sg * top, 0], tn));
    add(sheet(Math.round(W / 2 * D / 2 * 8000), W / 2, 0, D / 2, [W / 4, sg * top, -D / 4], tn));
  });
  // the four sawn edges, the two facing the cut only half as long
  add(sheet(Math.round(D * H * 6000), 0, H, D, [-W / 2, 0, 0], 0.4));
  add(sheet(Math.round(W * H * 6000), W, H, 0, [0, 0, -D / 2], 0.4));
  add(sheet(Math.round(D / 2 * H * 6000), 0, H, D / 2, [W / 2, 0, -D / 4], 0.4));
  add(sheet(Math.round(W / 2 * H * 6000), W / 2, H, 0, [-W / 4, 0, D / 2], 0.4));
  // the L-shaped outline, top and bottom, and the vertical corners
  var Lp = [[-W / 2, 0, -D / 2], [W / 2, 0, -D / 2], [W / 2, 0, 0], [0, 0, 0], [0, 0, D / 2], [-W / 2, 0, D / 2]];
  [1, -1].forEach(function (sg) {
    add(PC.T(PC.polyline({ pts: Lp, closed: true, perUnit: 330, tone: sg > 0 ? 1 : 0.8 }), { pos: [0, sg * top, 0] }));
  });
  Lp.forEach(function (v) { add(seg([v[0], -top, v[2]], [v[0], top, v[2]], 300, 0.85)); });

  /* ---------------- what the two faces carry ---------------- */
  // top: the die shadow with its micro-bump pad field, and the capacitor pads
  // that ring it, both clipped by the cut
  function cut(c) {
    var keep = [], i;
    for (i = 0; i < c.length; i += 4) {
      if (c[i] > 1e-4 && c[i + 2] > 1e-4) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  var sw = 0.82, sd = 0.53, yT = top + 0.003;
  add(cut(PC.T(PC.polyline({ pts: [[-sw / 2, 0, -sd / 2], [sw / 2, 0, -sd / 2], [sw / 2, 0, sd / 2], [-sw / 2, 0, sd / 2]], closed: true, perUnit: 360, tone: 1 }), { pos: [0, yT, 0] })));
  add(cut(PC.T(PC.dots({ nx: 46, nz: 30, sx: sw / 47, sz: sd / 31, per: 2, tone: 0.58 }), { pos: [0, yT, 0] })));
  var caps = [];
  for (var q = 0; q < 30; q++) {
    var cu = (q - 14.5) * (W * 0.94 / 30);
    if (Math.abs(cu) > sw / 2 + 0.02) continue;
    [-1, 1].forEach(function (sg) { caps.push(seg([cu, yT, sg * (sd / 2 + 0.028)], [cu, yT, sg * (sd / 2 + 0.056)], 520, 0.9)); });
  }
  for (q = 0; q < 20; q++) {
    var cv = (q - 9.5) * (D * 0.92 / 20);
    if (Math.abs(cv) > sd / 2 + 0.02) continue;
    [-1, 1].forEach(function (sg) { caps.push(seg([sg * (sw / 2 + 0.028), yT, cv], [sg * (sw / 2 + 0.056), yT, cv], 520, 0.9)); });
  }
  add(cut(PC.merge.apply(null, caps)));
  // bottom: the ball grid
  add(cut(PC.T(PC.dots({ nx: 44, nz: 31, sx: W * 0.955 / 44, sz: D * 0.94 / 31, per: 6, tone: 0.55 }), { pos: [0, -top - 0.014, 0] })));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.5, -0.64, 0],
    caption: 'A flip-chip substrate with a quarter cut away. In the cut face: a glass-cloth core drilled edge to edge with plated through-holes, eight layers of build-up film laminated onto each side of it, copper traces in section on every layer, and the tapered laser-drilled microvias that climb from one layer to the next. On top, the pad field the package lands on, ringed by capacitors; underneath, the ball grid. The build-up film is the copper-coloured part: it comes from one supplier. Footprint is to scale; the thickness is exaggerated about twenty times.'
  };
});
