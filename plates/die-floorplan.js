/* =====================================================================================================
   01 Design, option 2 (four plates, round 3, 24 Nov 2026, night): one design, many dies. A 300 mm wafer with the die grid at the
   true 26 x 33 mm field (plain geometry: no count is given or drawn as a figure), under one lamp: one broad static band of four
   hues in spectral order (violet, blue, green, yellow) at up to 39 percent, on the die grid only, the edge ring and notch plain
   silicon (the expert's round 3 rulings, section 2). Each die on the wafer carries its floorplan small. One die is lifted out of
   its seat and drawn larger, in option 1's die-photo look, dashed lines from its seat's corners. From the round 3 concept board
   (01-B), kept by the owner. */
(function () {
  // the band's colours, made once: for each of NB steps across the wafer, the grid's tints mixed toward the spectral hue
  var REAL = PLATE.REAL, mix = function (a, b, t) { var h = function (s) { return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]; }, c = PLATE.mixL(h(a), h(b), t); return '#' + c.map(function (v) { var q = Math.round(Math.max(0, Math.min(255, v))).toString(16); return q.length < 2 ? '0' + q : q; }).join(''); };
  var SPEC = [[0, '#6f5aa8'], [0.34, '#4f74b8'], [0.67, '#4e9a7a'], [1, '#c9b04e']];
  var at = function (t) { t = Math.max(0, Math.min(1, t)); for (var i = 1; i < SPEC.length; i++) if (t <= SPEC[i][0]) return mix(SPEC[i - 1][1], SPEC[i][1], (t - SPEC[i - 1][0]) / (SPEC[i][0] - SPEC[i - 1][0])); return SPEC[SPEC.length - 1][1]; };
  var base = { f: '#64617e', l: '#7a7396', s: '#4d7884', p: '#988f7c' }, NB = 18;
  for (var i = 0; i < NB; i++) {
    var u = i / (NB - 1), w = 0.34 * Math.exp(-Math.pow((u - 0.5) / 0.3, 2)) + 0.05, hue = at((u - 0.18) / 0.64);
    for (var k in base) { var c = mix(base[k], hue, w); REAL['wfT' + i + k] = { L: c, D: mix(c, '#000000', 0.12), g: 0.6, stopsC: [[0, 1], [1, 1]] }; }
  }
  PLATE.WF_NB = NB;
})();
R('die-floorplan', function (m) {
  var W = 26, Dd = 33, T = 0.9;
  /* The face of plate 01's die (Nvidia's GH100 block diagram, as plate 01 draws it) as die photographs show such chips (the
     expert's round 3 rulings): items for a face centred at 0, 0 at height y, s times plate 01's millimetres. detail 2 draws every
     texture, 1 a little, 0 the blocks alone. flip turns the face half a turn (the die-to-die link to the other edge). Each kind of
     circuit has its texture: logic a fine mottle with a few bronze flecks, SRAM a fine even grid, I/O and PHY coarse stripes
     with copper-tone lines. The finest textures are marked fine: the kit leaves them out while the plate turns. */
  function diePhoto(s, y, detail, seed, flip) {
    var it = [], rnd = H.rng(seed || 11), dt = detail == null ? 2 : detail, f = flip ? -1 : 1, FN = false;
    var P3 = function (x, z) { return [f * x * s, y, f * z * s]; };
    var rect = function (x0, z0, x1, z1, real, tag) { it.push({ pts: [P3(x0, z0), P3(x1, z0), P3(x1, z1), P3(x0, z1)], closed: true, lw: 0, fill: { d: 0.5, real: real }, tag: tag || null, fine: FN, keep: !FN }); };
    var line = function (x0, z0, x1, z1, real, lw, al, tag) { it.push({ pts: [P3(x0, z0), P3(x1, z1)], lw: lw, real: real, alpha: al == null ? 1 : al, tag: tag || null, fine: FN }); };
    // memory interfaces: coarse PHY bars, copper-tone lines across them; the controllers beside them, coarse logic
    [-1, 1].forEach(function (sd) {
      for (var k = 0; k < 6; k++) {
        var z0 = -13.6 + k * 4.55, z1 = z0 + 4.1, xa = Math.min(sd * 10.5, sd * 12.3), xb = Math.max(sd * 10.5, sd * 12.3);
        rect(xa, z0, xb, z1, 'dpPhy', 'mem');
        if (dt) {
          rect(xa + 0.12, z0 + 0.15, xb - 0.12, z0 + 0.55, 'dpLogicLo', 'mem'); rect(xa + 0.12, z1 - 0.55, xb - 0.12, z1 - 0.15, 'dpLogicLo', 'mem');
          FN = true; for (var q = 1; q <= 8; q++) { var zq = z0 + 0.55 + (z1 - z0 - 1.1) * q / 9; line(xa + 0.18, zq, xb - 0.18, zq, 'dpCu', dt > 1 ? 0.75 : 0.5, 0.95, 'mem'); } FN = false;
        }
        var ca = Math.min(sd * 8.75, sd * 10.2), cb = Math.max(sd * 8.75, sd * 10.2);
        rect(ca, z0 + 0.25, cb, z1 - 0.25, 'dpLogic', 'mem');
        FN = true; if (dt > 1) for (var a = 0; a < 2; a++) for (var b = 0; b < 5; b++) { var w = (cb - ca - 0.24) / 2, d = (z1 - z0 - 0.74) / 5, cx0 = ca + 0.12 + a * w, cz0 = z0 + 0.37 + b * d, v = rnd(); rect(cx0 + 0.05, cz0 + 0.05, cx0 + w - 0.05, cz0 + d - 0.05, v < 0.14 ? 'dpBronze' : v < 0.55 ? 'dpLogicLo' : 'dpLogicHi', 'mem'); } FN = false;
      }
    });
    // compute: eight clusters of 18 units; each unit a fine mottle of logic, its L1 across one end and its four register files
    var gcW = 17.2 / 4;
    [[3.4, 13.7], [-13.7, -3.4]].forEach(function (bz) {
      for (var g = 0; g < 4; g++) {
        var x0 = -8.6 + g * gcW + 0.18, x1 = x0 + gcW - 0.36, tw = (x1 - x0 - 0.3) / 3, td = (bz[1] - bz[0] - 0.4) / 6;
        for (var a2 = 0; a2 < 3; a2++) for (var c = 0; c < 6; c++) {
          var tx0 = x0 + 0.15 + a2 * tw + 0.06, tz0 = bz[0] + 0.2 + c * td + 0.06, tx1 = tx0 + tw - 0.12, tz1 = tz0 + td - 0.12;
          rect(tx0, tz0, tx1, tz1, 'dpLogic', 'sm');
          if (dt > 1) {
            // the mottle: cells within the logic's plus or minus 8 percent, a bronze fleck in about one cell in ten
            FN = true; var nx = 3, nz = 4, cw = (tx1 - tx0) / nx, cd = (tz1 - tz0 - 0.3) / nz;
            for (var i = 0; i < nx; i++) for (var j = 0; j < nz; j++) {
              var v2 = rnd(), rl = v2 < 0.1 ? 'dpBronze' : v2 < 0.42 ? 'dpLogicHi' : v2 < 0.74 ? 'dpLogicLo' : null;
              if (!rl) continue;
              var e = v2 < 0.1 ? 0.07 : 0.015;
              rect(tx0 + i * cw + e, tz0 + 0.3 + j * cd + e, tx0 + (i + 1) * cw - e, tz0 + 0.3 + (j + 1) * cd - e, rl, 'sm');
            }
            FN = false; rect(tx0 + 0.05, tz0 + 0.04, tx1 - 0.05, tz0 + 0.24, 'dpSram', 'sm'); FN = true;
            [0.25, 0.75].forEach(function (fx) { [0.45, 0.8].forEach(function (fz) { var cx = tx0 + (tx1 - tx0) * fx, cz = tz0 + (tz1 - tz0) * fz; rect(cx - 0.1, cz - 0.08, cx + 0.1, cz + 0.08, 'dpSramB', 'sm'); }); }); FN = false;
          } else if (dt === 1) rect(tx0 + 0.05, tz0 + 0.04, tx1 - 0.05, tz0 + 0.3, 'dpSram', 'sm');
        }
      }
    });
    // the L2 cache: two partitions of sub-arrays, teal shading toward blue, each a fine even grid
    [[-8.6, -0.5], [0.5, 8.6]].forEach(function (b) {
      rect(b[0], -2.8, b[1], 2.8, 'dpSram', 'l2');
      if (dt) {
        var nA = 6, nB = 3, aw = (b[1] - b[0]) / nA, ad = 5.6 / nB;
        for (var i = 0; i < nA; i++) for (var j = 0; j < nB; j++) if ((i + j) % 2) rect(b[0] + i * aw + 0.08, -2.8 + j * ad + 0.08, b[0] + (i + 1) * aw - 0.08, -2.8 + (j + 1) * ad - 0.08, 'dpSramB', 'l2');
        if (dt > 1) {
          FN = true;
          for (var xg = b[0] + 0.27; xg < b[1] - 0.05; xg += 0.27) line(xg, -2.74, xg, 2.74, 'dpSramLn', 0.32, 0.5, 'l2');
          for (var zg = -2.8 + 0.31; zg < 2.78; zg += 0.31) line(b[0] + 0.05, zg, b[1] - 0.05, zg, 'dpSramLn', 0.32, 0.38, 'l2');
          FN = false;
        }
        for (var i2 = 1; i2 < nA; i2++) line(b[0] + i2 * aw, -2.8, b[0] + i2 * aw, 2.8, 'dpStreet', dt > 1 ? 0.9 : 0.6, 1, 'l2');
        for (var j2 = 1; j2 < nB; j2++) line(b[0], -2.8 + j2 * ad, b[1], -2.8 + j2 * ad, 'dpStreet', dt > 1 ? 0.7 : 0.5, 1, 'l2');
      }
    });
    rect(-0.4, -2.8, 0.4, 2.8, 'dpLogicLo', 'l2');
    // the host interface: coarse PHY with its ports; the die-to-die link: PHY with copper pads
    rect(-11.6, 14.2, 11.6, 16.1, 'dpPhy', null);
    if (dt) for (var n = 0; n < 9; n++) { var nx0 = -10.8 + n * 2.62; rect(nx0, 14.55, nx0 + 1.9, 15.75, 'dpBronze', null); FN = true; if (dt > 1) for (var q2 = 1; q2 < 5; q2++) line(nx0 + 0.1, 14.55 + q2 * 0.24, nx0 + 1.8, 14.55 + q2 * 0.24, 'dpCu', 0.55, 0.9); FN = false; }
    rect(-11.6, -16.1, 11.6, -14.3, 'dpPhy', 'd2d');
    if (dt) for (var p = 0; p < 26; p++) { var px = -11.6 + 0.75 + p * (23.2 - 1.5) / 25; rect(px - 0.26, -15.46, px + 0.26, -14.94, 'dpPad', 'd2d'); if (dt > 1) { FN = true; line(px, -16.0, px, -15.46, 'dpCu', 0.4, 0.8, 'd2d'); FN = false; } }
    // a thin seal ring inside the die's edge
    if (dt) { var sr = function (x0, z0, x1, z1) { line(x0, z0, x1, z1, 'dpCu', dt > 1 ? 0.6 : 0.4, 0.9); }; sr(-12.75, -16.25, 12.75, -16.25); sr(12.75, -16.25, 12.75, 16.25); sr(12.75, 16.25, -12.75, 16.25); sr(-12.75, 16.25, -12.75, -16.25); }
    return it;
  }
  var SIDES = { px: { d: 0.065, real: 'dpEdge' }, nx: { d: 0.065, real: 'dpEdge' }, pz: { d: 0.065, real: 'dpEdge' }, nz: { d: 0.065, real: 'dpEdge' } };

  var Rw = 150, wT = 2.2, NB = PLATE.WF_NB, EX = 5.2;
  var wf = m.part('wafer', { ex: [0, 0, 0], seq: 0 });
  // the wafer's outline with its notch, at the near edge
  var shape = []; for (var k = 0; k < 120; k++) { var a = k * TAU / 120; if (k === 30) { shape.push([2.5, Rw - 0.3]); shape.push([0, Rw - 3.2]); shape.push([-2.5, Rw - 0.3]); continue; } shape.push([Rw * Math.cos(a), Rw * Math.sin(a)]); }
  var tiles = [], seat = null, LX = 0.62, LZ = -0.78, SX = -1, SZ = -1;
  for (var gx = -6; gx <= 5; gx++) for (var gz = -5; gz <= 4; gz++) {
    var cx = (gx + 0.5) * W, cz = (gz + 0.5) * Dd;
    var ok = [[-1, -1], [1, -1], [-1, 1], [1, 1]].every(function (q) { var x = cx + q[0] * W / 2, z = cz + q[1] * Dd / 2; return x * x + z * z < (Rw - 3) * (Rw - 3); });
    if (!ok) continue;
    var u = 0.5 + (cx * LX + cz * LZ) / (2 * Rw), b = 'wfT' + Math.max(0, Math.min(NB - 1, Math.round(u * (NB - 1))));
    var x0 = cx - W / 2 + 0.35, z0 = cz - Dd / 2 + 0.35, x1 = cx + W / 2 - 0.35, z1 = cz + Dd / 2 - 0.35;
    var R4 = function (a0, c0, a1, c1, rl, fine) { tiles.push({ pts: [[a0, wT / 2, c0], [a1, wT / 2, c0], [a1, wT / 2, c1], [a0, wT / 2, c1]], closed: true, lw: 0, fill: { d: 0.5, real: rl }, tag: 'wafer', fine: !!fine, keep: !fine }); };
    if (gx === SX && gz === SZ) { seat = [x0, z0, x1, z1]; R4(x0, z0, x1, z1, 'dpFace'); continue; }
    R4(x0, z0, x1, z1, b + 'f');
    // each die's floorplan, small: the compute halves, the cache across the middle, memory down both sides
    R4(cx - 8.6, cz + 3.4, cx + 8.6, cz + 13.7, b + 'l', 1); R4(cx - 8.6, cz - 13.7, cx + 8.6, cz - 3.4, b + 'l', 1);
    R4(cx - 8.6, cz - 2.8, cx + 8.6, cz + 2.8, b + 's');
    R4(cx - 12.3, cz - 13.6, cx - 8.75, cz + 13.6, b + 'p', 1); R4(cx + 8.75, cz - 13.6, cx + 12.3, cz + 13.6, b + 'p', 1);
  }
  m.tag('wafer'); m.real('wfSi');
  m.prism(shape, -wT / 2, wT / 2, 'light', { smooth: true, top: tiles });
  m.tag(null);
  // the lifted die, EX times larger, high over its seat
  var sc = [(seat[0] + seat[2]) / 2, (seat[1] + seat[3]) / 2], dc = [sc[0], 168, sc[1]], DW = W * EX, DD = Dd * EX, DT = T * EX;
  var die = m.part('die', { ex: [0, 0, 0], seq: 1 });
  m.real('dpFace');
  m.box({ c: dc, s: [DW, DT, DD], decals: { py: diePhoto(EX, DT / 2, 2, 5, true) }, fmat: SIDES }, 'light');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    var sx = q[0] < 0 ? seat[0] : seat[2], sz = q[1] < 0 ? seat[1] : seat[3];
    m.guide([[sx, wT / 2, sz, wf.idx], [dc[0] + q[0] * DW / 2, dc[1] - DT / 2, dc[2] + q[1] * DD / 2, die.idx]], { style: 'dash', alpha: 0.8 });
  });
  // labels: on the lifted die (its face turned half round, so a point at x, z of plate 01 lies at -x, -z), and the wafer
  var on = function (x, z) { return [dc[0] - x * EX, dc[1] + DT / 2, dc[2] - z * EX, die.idx]; };
  m.callout(on(10.9, 12.5), 'Memory controllers', { side: 'l', tag: 'mem', rowAt: on(-11.4, 9) });
  m.callout(on(6.4, 5.5), 'Compute units', { side: 'l', tag: 'sm' });
  m.callout(on(4.6, -1.2), 'Cache', { side: 'l', tag: 'l2' });
  m.callout(on(4, -15.2), 'Die-to-die link', { side: 'l', tag: 'd2d' });
  m.callout([-Rw * 0.66, wT / 2, Rw * 0.7, wf.idx], 'Wafer, 300 mm', { side: 'l', tag: 'wafer' });
  return { elev: PLATE.ISO.elev, yaw: -Math.PI / 4, sortAxis: [0, 1, 0], start: 1.4, thumbX: 0.5, softLine: '#2b2a3d',
    accent: [111, 139, 166], accentDark: [195, 211, 226], accent2: [176, 102, 44], accent2Dark: [224, 154, 92] };
});
