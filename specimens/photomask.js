/* Specimen: an EUV photomask (reticle) with its pellicle.
 * A 6-inch square blank, 152.4 x 152.4 x 6.35 mm, carrying a 132 x 104 mm
 * patterned field (4x the 33 x 26 mm field it prints on the wafer), with a
 * pellicle frame standing off the surface on four posts.
 */
PC.register('photomask', function (p) {
  var S = 1 / 100;                 // mm -> units
  var B = 152.4 * S, T = 6.35 * S; // blank size and thickness
  var PW = 132 * S, PD = 104 * S;  // patterned field
  var yTop = T / 2, yPat = yTop + 0.003;
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- the blank ----------
  add(PC.T(PC.plane({ w: B, d: B, n: 10000, tone: 0.26 }), { pos: [0, yTop, 0] }));
  add(PC.box({ w: B, h: T, d: B, faces: ['px', 'nx', 'pz', 'nz', 'ny'], n: 7000, tone: 0.26 }));
  add(PC.boxEdges({ w: B, h: T, d: B, perUnit: 300, tone: 0.95 }));
  // the Mo/Si multilayer: three fine lines just under the top edge of every side
  for (var m = 1; m <= 3; m++) {
    var yy = yTop - m * 0.006;
    add(rect(B, B, yy, 190, 0.75));
  }
  // quality-area border and the absorber "black border" around the field
  add(rect(142 * S, 142 * S, yPat, 260, 0.7));
  add(rect(PW + 10 * S, PD + 10 * S, yPat, 300, 1));
  add(rect(PW, PD, yPat, 300, 1));

  // ---------- the pattern ----------
  // A floorplan rather than a uniform grid: twelve blocks of four kinds laid
  // out on a 7 x 5 cell raster.
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
    if (style === 0) {           // fine line array (logic standard cells)
      var horiz = bi % 8 < 4, span = horiz ? d : w, nl = Math.max(6, Math.round(span / (2.7 * S)));
      for (var k = 0; k < nl; k++) {
        var t = (k / (nl - 1) - 0.5) * 0.88;
        pat.push(PC.T(horiz
          ? PC.line({ a: [-w * 0.44, 0, t * d], b: [w * 0.44, 0, t * d], perUnit: 250, tone: 1 })
          : PC.line({ a: [t * w, 0, -d * 0.44], b: [t * w, 0, d * 0.44], perUnit: 250, tone: 1 }),
          { pos: [x0, yPat, z0] }));
      }
    } else if (style === 1) {    // dense array block (memory)
      pat.push(PC.T(PC.plane({ w: w * 0.94, d: d * 0.94, n: Math.round(w * d * 3000), tone: 0.3 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: Math.round(w / (2.2 * S)), nz: Math.round(d / (2.2 * S)), sx: 2.2 * S, tone: 1 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(rect(w * 0.55, d * 0.55, 0, 220, 1), { pos: [x0, yPat, z0] }));
    } else if (style === 2) {    // nested rings (pad / analogue macro)
      for (var q = 1; q <= 3; q++) pat.push(PC.T(rect(w * q / 3.6, d * q / 3.6, 0, 240, 1), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: 5, nz: 5, sx: w / 6, sz: d / 6, per: 2, tone: 0.9 }), { pos: [x0, yPat, z0] }));
    } else {                     // wide bars (power / bus block)
      var nb = Math.max(3, Math.round(d / (9 * S)));
      for (var b = 0; b < nb; b++) {
        var zz = (b / (nb - 1) - 0.5) * d * 0.76;
        pat.push(PC.T(PC.plane({ w: w * 0.88, d: d * 0.055, n: Math.round(w * 1500), tone: 1 }), { pos: [x0, yPat, z0 + zz] }));
      }
    }
  }
  // bus lines crossing the whole field
  for (var bl = 0; bl < 4; bl++) {
    var zb = (bl / 3 - 0.5) * PD * 0.92;
    pat.push(PC.line({ a: [-PW / 2, yPat, zb], b: [PW / 2, yPat, zb], perUnit: 200, tone: 0.85 }));
  }
  // fiducials: bar-in-bar marks in the four corners of the border
  for (var sx = -1; sx <= 1; sx += 2) for (var sz = -1; sz <= 1; sz += 2) {
    var fx = sx * (PW / 2 + 9 * S), fz = sz * (PD / 2 + 9 * S);
    pat.push(PC.T(rect(9 * S, 9 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
    pat.push(PC.T(rect(4 * S, 4 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
  }
  add(PC.merge.apply(null, pat));

  // ---------- pellicle ----------
  var FW = 145 * S, FD = 117 * S, bar = 4.5 * S, fh = 3.5 * S, stand = 11 * S;
  var yF = yTop + stand;
  var fr = [
    PC.T(PC.box({ w: FW, h: fh, d: bar, n: 1500, tone: 1 }), { pos: [0, yF + fh / 2, (FD - bar) / 2] }),
    PC.T(PC.box({ w: FW, h: fh, d: bar, n: 1500, tone: 1 }), { pos: [0, yF + fh / 2, -(FD - bar) / 2] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, n: 1200, tone: 1 }), { pos: [(FW - bar) / 2, yF + fh / 2, 0] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, n: 1200, tone: 1 }), { pos: [-(FW - bar) / 2, yF + fh / 2, 0] }),
    rect(FW, FD, yF + fh, 340, 1),
    rect(FW - 2 * bar, FD - 2 * bar, yF + fh, 340, 1),
    rect(FW, FD, yF, 300, 1)
  ];
  add(PC.accent(PC.merge.apply(null, fr), 0.85));
  // four standoff posts, with a hairline down to the blank so the gap reads
  for (sx = -1; sx <= 1; sx += 2) for (sz = -1; sz <= 1; sz += 2) {
    var px = sx * (FW / 2 - bar / 2), pz = sz * (FD / 2 - bar / 2);
    add(PC.accent(PC.T(PC.cylinder({ r: 3.0 * S, h: stand, n: 520, tone: 1 }), { pos: [px, yTop + stand / 2, pz] }), 0.75));
    add(PC.line({ a: [px + sx * 3.0 * S, yTop, pz], b: [px + sx * 3.0 * S, yF, pz], perUnit: 260, tone: 0.8 }));
  }
  // filter/vent port on one frame bar
  add(PC.accent(PC.T(PC.box({ w: 9 * S, h: fh * 0.8, d: 5 * S, n: 500, tone: 1 }), { pos: [FW * 0.22, yF + fh / 2, -(FD / 2 + 2 * S)] }), 0.9));
  // the membrane itself: a whisper of a plane inside the frame
  add(PC.T(PC.plane({ w: FW - 2 * bar, d: FD - 2 * bar, n: 7000, tone: 0.16 }), { pos: [0, yF + fh, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.9, -0.5, 0],
    caption: 'A 6-inch EUV mask: a quartz blank with a molybdenum-silicon multilayer (the fine lines round its edge) carrying a 132 x 104 mm patterned field, under a pellicle frame (copper) held a few millimetres clear of the surface on four posts.'
  };
});
