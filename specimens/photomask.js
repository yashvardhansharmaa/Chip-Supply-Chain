/* Specimen: an EUV photomask (reticle) with its pellicle.
 *
 * Dimensions are the SEMI ones, in millimetres, scaled 1:100: a 152.4 mm
 * square blank 6.35 mm thick, carrying a 132 x 104 mm patterned field (4x the
 * 33 x 26 mm field it prints on the wafer), inside a black border, with
 * bar-in-bar fiducials at the corners. The pellicle frame stands 2.5 mm clear
 * of the mask surface on four glued pads, which is the real standoff and is
 * therefore a very shallow gap.
 *
 * The one liberty: the Mo/Si multilayer. Forty bilayers come to about 280 nm,
 * or four ten-thousandths of the blank's thickness, so it would be invisible.
 * It is drawn here as a copper band of fine lines round the top edge of the
 * blank - the mirror that makes an EUV mask a mirror rather than a window, and
 * the thing two Japanese firms make almost all of. That band is the only
 * copper in the drawing.
 */
PC.register('photomask', function (p) {
  var S = 1 / 100;                 // mm -> units
  var B = 152.4 * S, T = 6.35 * S; // blank size and thickness
  var PW = 132 * S, PD = 104 * S;  // patterned field
  var yTop = T / 2, yBot = -T / 2, yPat = yTop + 0.0025;
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }
  // a band of points wrapped round the four side faces, between two heights
  function band(w, d, y0, y1, tn, dens) {
    var per = 2 * (w + d), n = Math.max(120, Math.round(per * (y1 - y0) * (dens || 1) * PC.k));
    var c = new Float32Array(n * 4);
    for (var i = 0; i < n; i++) {
      var t = PC.rnd() * per, y = y0 + PC.rnd() * (y1 - y0), x, z;
      if (t < w) { x = t - w / 2; z = -d / 2; }
      else if (t < w + d) { x = w / 2; z = t - w - d / 2; }
      else if (t < 2 * w + d) { x = w / 2 - (t - w - d); z = d / 2; }
      else { x = -w / 2; z = d / 2 - (t - 2 * w - d); }
      c[i * 4] = x; c[i * 4 + 1] = y; c[i * 4 + 2] = z; c[i * 4 + 3] = tn;
    }
    return c;
  }

  /* ---------- the low-thermal-expansion blank ---------- */

  add(PC.T(PC.plane({ w: B, d: B, n: 9000, tone: 0.24 }), { pos: [0, yTop, 0] }));
  add(PC.box({ w: B, h: T, d: B, faces: ['px', 'nx', 'pz', 'nz'], n: 5200, tone: 0.30 }));
  add(PC.T(PC.plane({ w: B, d: B, n: 3400, tone: 0.20 }), { pos: [0, yBot, 0] }));
  add(PC.boxEdges({ w: B, h: T, d: B, perUnit: 340, tone: 0.95 }));
  // the chrome backside coating that the electrostatic chuck grips
  add(rect(146 * S, 146 * S, yBot - 0.0006, 260, 0.7));
  for (var q = 0; q < 3; q++) add(rect((146 - q * 5) * S, (146 - q * 5) * S, yBot - 0.0006, 130, 0.30));

  /* ---------- the Mo/Si multilayer, in copper ---------- */

  var mlTop = yTop - 0.0004, mlBot = yTop - 0.0105, ml = [];
  ml.push(band(B, B, mlBot, mlTop, 0.42, 1.3));
  for (var m = 0; m <= 7; m++) {
    ml.push(rect(B, B, mlBot + (mlTop - mlBot) * m / 7, 210, 0.95));
  }
  add(PC.accent(PC.merge.apply(null, ml), 0.9));

  /* ---------- absorber pattern ---------- */

  add(rect(142 * S, 142 * S, yPat, 240, 0.6));                 // quality area
  add(rect(PW + 10 * S, PD + 10 * S, yPat, 320, 1));           // black border, outer
  add(rect(PW, PD, yPat, 320, 1));                             // black border, inner
  var pat = [];
  var COLS = 7, ROWS = 5, cw = PW / COLS, cd = PD / ROWS;
  var MAP = ['AABBCCD', 'AABBCCD', 'EEFFGGD', 'HHIIGGJ', 'HHKKLLJ'];
  var seen = {}, keys = [];
  for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
    var ch = MAP[r].charAt(c);
    if (!seen[ch]) { seen[ch] = { c0: c, c1: c, r0: r, r1: r }; keys.push(ch); }
    else { seen[ch].c1 = Math.max(seen[ch].c1, c); seen[ch].r1 = Math.max(seen[ch].r1, r); }
  }
  for (var bi = 0; bi < keys.length; bi++) {
    var bk = seen[keys[bi]];
    var w = (bk.c1 - bk.c0 + 1) * cw - 4 * S, d = (bk.r1 - bk.r0 + 1) * cd - 4 * S;
    var x0 = ((bk.c0 + bk.c1) / 2 - (COLS - 1) / 2) * cw, z0 = ((bk.r0 + bk.r1) / 2 - (ROWS - 1) / 2) * cd;
    var style = bi % 4;
    pat.push(PC.T(rect(w, d, 0, 340, 0.95), { pos: [x0, yPat, z0] }));
    if (style === 0) {           // fine line array: logic standard cells
      var horiz = bi % 8 < 4, span = horiz ? d : w, nl = Math.max(6, Math.round(span / (2.7 * S)));
      for (var k = 0; k < nl; k++) {
        var t = (k / (nl - 1) - 0.5) * 0.88;
        pat.push(PC.T(horiz
          ? PC.line({ a: [-w * 0.44, 0, t * d], b: [w * 0.44, 0, t * d], perUnit: 250, tone: 1 })
          : PC.line({ a: [t * w, 0, -d * 0.44], b: [t * w, 0, d * 0.44], perUnit: 250, tone: 1 }),
          { pos: [x0, yPat, z0] }));
      }
    } else if (style === 1) {    // dense array: memory
      pat.push(PC.T(PC.plane({ w: w * 0.94, d: d * 0.94, n: Math.round(w * d * 2400), tone: 0.26 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: Math.round(w / (2.2 * S)), nz: Math.round(d / (2.2 * S)), sx: 2.2 * S, tone: 1 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(rect(w * 0.55, d * 0.55, 0, 220, 1), { pos: [x0, yPat, z0] }));
    } else if (style === 2) {    // nested rings: pad or analogue macro
      for (var qq = 1; qq <= 3; qq++) pat.push(PC.T(rect(w * qq / 3.6, d * qq / 3.6, 0, 240, 1), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: 5, nz: 5, sx: w / 6, sz: d / 6, per: 2, tone: 0.9 }), { pos: [x0, yPat, z0] }));
    } else {                     // wide bars: power and bus
      var nb = Math.max(3, Math.round(d / (9 * S)));
      for (var b = 0; b < nb; b++) {
        var zz = (b / (nb - 1) - 0.5) * d * 0.76;
        pat.push(PC.T(PC.plane({ w: w * 0.88, d: d * 0.050, n: Math.round(w * 1300), tone: 1 }), { pos: [x0, yPat, z0 + zz] }));
      }
    }
  }
  for (var bl = 0; bl < 4; bl++) {
    var zb = (bl / 3 - 0.5) * PD * 0.92;
    pat.push(PC.line({ a: [-PW / 2, yPat, zb], b: [PW / 2, yPat, zb], perUnit: 200, tone: 0.8 }));
  }
  var sx, sz;
  for (sx = -1; sx <= 1; sx += 2) for (sz = -1; sz <= 1; sz += 2) {     // bar-in-bar fiducials
    var fx = sx * (PW / 2 + 9 * S), fz = sz * (PD / 2 + 9 * S);
    pat.push(PC.T(rect(9 * S, 9 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
    pat.push(PC.T(rect(4 * S, 4 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
  }
  add(PC.merge.apply(null, pat));

  /* ---------- pellicle: frame, pads, membrane ---------- */

  var FW = 145 * S, FD = 117 * S, bar = 4.5 * S, fh = 2.6 * S, stand = 2.5 * S;
  var yF = yTop + stand, yM = yF + fh;
  var fr = [
    PC.T(PC.box({ w: FW, h: fh, d: bar, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 1800, tone: 0.6 }), { pos: [0, yF + fh / 2, (FD - bar) / 2] }),
    PC.T(PC.box({ w: FW, h: fh, d: bar, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 1800, tone: 0.6 }), { pos: [0, yF + fh / 2, -(FD - bar) / 2] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, faces: ['py', 'px', 'nx'], n: 1500, tone: 0.6 }), { pos: [(FW - bar) / 2, yF + fh / 2, 0] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, faces: ['py', 'px', 'nx'], n: 1500, tone: 0.6 }), { pos: [-(FW - bar) / 2, yF + fh / 2, 0] }),
    rect(FW, FD, yM, 420, 1),
    rect(FW - 2 * bar, FD - 2 * bar, yM, 380, 1),
    rect(FW, FD, yF, 380, 1),
    rect(FW - 2 * bar, FD - 2 * bar, yF, 260, 0.7)
  ];
  add(PC.merge.apply(null, fr));
  // the four glued pads that hold the frame off the mask, and the gap they make
  for (sx = -1; sx <= 1; sx += 2) for (sz = -1; sz <= 1; sz += 2) {
    var px = sx * (FW / 2 - bar / 2), pz = sz * (FD / 2 - bar / 2);
    add(PC.T(PC.box({ w: 5.5 * S, h: stand, d: 5.5 * S, faces: ['px', 'nx', 'pz', 'nz'], n: 520, tone: 0.7 }), { pos: [px, yTop + stand / 2, pz] }));
    add(PC.T(PC.boxEdges({ w: 5.5 * S, h: stand, d: 5.5 * S, perUnit: 420, tone: 1 }), { pos: [px, yTop + stand / 2, pz] }));
  }
  // the outline of the frame's footprint on the mask, and short ticks up the
  // 2.5 mm gap at the mid-edges, so a standoff this shallow still reads
  add(rect(FW, FD, yTop + 0.0008, 220, 0.45));
  for (var g = 0; g < 8; g++) {
    var gt = (g % 4) / 3 - 0.5, gx, gz;
    if (g < 4) { gx = gt * FW * 0.62; gz = (g < 2 ? -1 : 1) * FD / 2; }
    else { gx = (g < 6 ? -1 : 1) * FW / 2; gz = gt * FD * 0.62; }
    if (g < 4) gz = (g < 2 ? -1 : 1) * FD / 2, gx = ((g % 2) * 2 - 1) * FW * 0.26;
    else gz = ((g % 2) * 2 - 1) * FD * 0.26, gx = (g < 6 ? -1 : 1) * FW / 2;
    add(PC.line({ a: [gx, yTop + 0.0008, gz], b: [gx, yF, gz], perUnit: 900, tone: 0.85 }));
  }
  // vent filter on one frame bar
  add(PC.T(PC.box({ w: 9 * S, h: fh * 0.8, d: 4 * S, n: 380, tone: 0.55 }), { pos: [FW * 0.22, yF + fh / 2, -(FD / 2 + 1.6 * S)] }));
  add(PC.T(PC.boxEdges({ w: 9 * S, h: fh * 0.8, d: 4 * S, perUnit: 420, tone: 1 }), { pos: [FW * 0.22, yF + fh / 2, -(FD / 2 + 1.6 * S)] }));
  // the membrane: 50 nm of silicon, drawn as the faintest plane in the specimen
  add(PC.T(PC.plane({ w: FW - 2 * bar, d: FD - 2 * bar, n: 6000, tone: 0.13 }), { pos: [0, yM, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [1.0, -0.5, 0],
    // colour: the Mo/Si multilayer mirror reflects only at 13.5 nm; to the eye it is near-black with a faint blue sheen, so a dark steel blue
    accent: [62, 84, 104], accentDark: [142, 167, 192],
    caption: 'A six-inch EUV reticle: a 152 mm square of low-thermal-expansion glass, 6.35 mm thick, carrying a 132 x 104 mm patterned field inside its black border, with a pellicle frame held 2.5 mm off the surface on four glued pads and a membrane stretched across it. The dark blue band round the top edge is the molybdenum-silicon multilayer that makes the mask a mirror; forty bilayers are 280 nm thick in life, so they are drawn far thicker than they are.'
  };
});
