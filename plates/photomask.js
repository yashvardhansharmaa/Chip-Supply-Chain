/* =====================================================================================================
   05 Photomasks: an EUV reticle and its pellicle, in millimetres: the glass 152.4 mm square and 6.35 mm thick (the SEMI 6025
   size, as Hoya's US patent 9,494,851 gives it), its pattern area 132 x 104 mm, four times the scanner's 26 x 33 mm field
   (ASML: the pattern is drawn four times larger than it prints), with the mirror coating as a band round its top edge,
   drawn far thicker than it is, and the pellicle frame, its four pads and its membrane lifted off it in turn.
   The loupe (mask-loupe, below) shows the coating's edge at true thickness, from the imec and PTB paper chapter 5 cites
   (arxiv.org/abs/1912.09075): about 40 molybdenum and silicon layer pairs of 7 nm each, a 3 nm ruthenium cap, and the
   absorber, 58 nm of TaBN under 2 nm of TaBO. Colours (the set's legend, 22 Nov 2026): the coating in silicon slate with dark
   lines, as the loupe shows it, silicon layers between molybdenum ones.
   22 Nov 2026 expert review: the glass is drawn 6.35 mm thick with the coating band on top of it, so the 6.35 mm dimension
   spans the glass alone (the glass was drawn 5.30 mm under the band, inside the 6.35); the loupe's ring sits in the pattern
   area, on one of the dark absorber bars, where the loupe's absorber lines are (it sat on the outer edge, outside the
   pattern).
   22 Nov 2026 plates refine: the mask is drawn at the first plates' size again, its loupe a quarter smaller (72 px, from 96;
   at 67 its four names no longer fitted inside the disc at 11.5 px) and tucked
   into the empty corner over the pellicle's right corner, still aimed into the pattern area; the mirror coating and the glass
   plate are named side by side in the left column, their dots on the band and on the glass just under it, by the plate's left
   corner, where their leaders come in over the 152.4 mm dimension rather than across its figure. */
R('photomask', function (m) {
  var B = 152.4, T = 6.35, ml = 1.05, PW = 132, PD = 104, yTop = T / 2 + ml; // yTop: the coating's top face, over the glass
  var blank = m.part('blank', { ex: [0, 0, 0], seq: 0 });
  var pat = [];
  var top = ml / 2;
  pat.push(D.rect(-71, -71, 71, 71, top, { lw: 0.45, alpha: 0.6 }));
  pat.push(D.rect(-PW / 2 - 5, -PD / 2 - 5, PW / 2 + 5, PD / 2 + 5, top, { lw: 0.7 }));
  pat.push(D.rect(-PW / 2, -PD / 2, PW / 2, PD / 2, top, { lw: 0.7 }));
  // the black border, a filled frame
  pat.push(D.poly([[-PW / 2 - 5, top, -PD / 2 - 5], [PW / 2 + 5, top, -PD / 2 - 5], [PW / 2 + 5, top, PD / 2 + 5], [-PW / 2 - 5, top, PD / 2 + 5]], { fill: 'black', lw: 0, alpha: 0.85 }));
  pat.push(D.poly([[-PW / 2, top, -PD / 2], [PW / 2, top, -PD / 2], [PW / 2, top, PD / 2], [-PW / 2, top, PD / 2]], { fill: 'paper', lw: 0.6 }));
  var COLS = 7, ROWS = 5, cw = PW / COLS, cd = PD / ROWS, MAP = ['AABBCCD', 'AABBCCD', 'EEFFGGD', 'HHIIGGJ', 'HHKKLLJ'], seen = {}, keys = [];
  for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) { var ch = MAP[r][c]; if (!seen[ch]) { seen[ch] = { c0: c, c1: c, r0: r, r1: r }; keys.push(ch); } else { seen[ch].c1 = Math.max(seen[ch].c1, c); seen[ch].r1 = Math.max(seen[ch].r1, r); } }
  keys.forEach(function (key, bi) {
    var bk = seen[key], w = (bk.c1 - bk.c0 + 1) * cw - 4, d = (bk.r1 - bk.r0 + 1) * cd - 4;
    var x0 = ((bk.c0 + bk.c1) / 2 - (COLS - 1) / 2) * cw, z0 = ((bk.r0 + bk.r1) / 2 - (ROWS - 1) / 2) * cd, st = bi % 4;
    pat.push(D.rect(x0 - w / 2, z0 - d / 2, x0 + w / 2, z0 + d / 2, top, { lw: 0.6 }));
    if (st === 0) { var horiz = bi % 8 < 4, nl = Math.max(6, Math.round((horiz ? d : w) / 2.7)); for (var k = 0; k < nl; k++) { var tt = (k / (nl - 1) - 0.5) * 0.88; pat.push(horiz ? D.line([x0 - w * 0.44, top, z0 + tt * d], [x0 + w * 0.44, top, z0 + tt * d], { lw: 0.35, alpha: 0.8 }) : D.line([x0 + tt * w, top, z0 - d * 0.44], [x0 + tt * w, top, z0 + d * 0.44], { lw: 0.35, alpha: 0.8 })); } }
    else if (st === 1) { pat.push(D.rect(x0 - w * 0.47, z0 - d * 0.47, x0 + w * 0.47, z0 + d * 0.47, top, { fill: 'mid', lw: 0.3 })); pat.push(D.rect(x0 - w * 0.27, z0 - d * 0.27, x0 + w * 0.27, z0 + d * 0.27, top, { lw: 0.4 })); }
    else if (st === 2) { for (var qq = 1; qq <= 3; qq++) pat.push(D.rect(x0 - w * qq / 7.2, z0 - d * qq / 7.2, x0 + w * qq / 7.2, z0 + d * qq / 7.2, top, { lw: 0.4 })); }
    else { var nb = Math.max(3, Math.round(d / 9)); for (var b = 0; b < nb; b++) { var zz = z0 + (b / (nb - 1) - 0.5) * d * 0.76; pat.push(D.rect(x0 - w * 0.44, zz - d * 0.025, x0 + w * 0.44, zz + d * 0.025, top, { fill: 'dark', lw: 0.25 })); } }
  });
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { var fx = sx * (PW / 2 + 9), fz = sz * (PD / 2 + 9); pat.push(D.rect(fx - 4.5, fz - 4.5, fx + 4.5, fz + 4.5, top, { lw: 0.5 })); pat.push(D.rect(fx - 2, fz - 2, fx + 2, fz + 2, top, { lw: 0.5 })); }); });
  m.box({ c: [0, 0, 0], s: [B, T, B] }, 'light');
  var band = [];
  for (var q = 1; q < 8; q++) { var yy = -ml / 2 + ml * q / 8; band.push(D.line([-B / 2, yy, B / 2], [B / 2, yy, B / 2], { lw: 0.3, alpha: 0.55 })); }
  var bandX = band.map(function (it) { return { pts: [[B / 2, it.pts[0][1], B / 2], [B / 2, it.pts[0][1], -B / 2]], lw: 0.3, alpha: 0.55 }; });
  m.box({ c: [0, yTop - ml / 2, 0], s: [B, ml, B], decals: { py: pat, pz: band, px: bandX } }, 'acc');
  m.dim([-B / 2, -T / 2, B / 2], [B / 2, -T / 2, B / 2], [0, 0, 12], '152.4 mm');
  // pads, frame, membrane
  var FW = 145, FD = 117, bar = 4.5, fh = 2.6, stand = 2.5;
  var pads = m.part('pads', { ex: [0, 15, 0], seq: 1 });
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { m.box({ c: [sx * (FW / 2 - bar / 2), yTop + stand / 2, sz * (FD / 2 - bar / 2)], s: [5.5, stand, 5.5] }, 'dark'); }); });
  var fr = m.part('frame', { ex: [0, 30, 0], seq: 2 });
  H.frame(m, [0, 0, 0], FW, FD, FW - 2 * bar, FD - 2 * bar, yTop + stand, yTop + stand + fh, 'steel');
  m.box({ c: [FW * 0.22, yTop + stand + fh / 2, -(FD / 2 + 1.6)], s: [9, fh * 0.8, 4] }, 'mid');
  var mem = m.part('membrane', { ex: [0, 48, 0], seq: 3 });
  var yM = yTop + stand + fh;
  m.sheet([[-FW / 2 + bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, FD / 2 - bar], [-FW / 2 + bar, yM, FD / 2 - bar]], 'glass');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), blank.idx], [c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), pads.idx]], { alpha: 0.85 });
    m.guide([[c[0] * FW / 2, yTop + stand, c[1] * FD / 2, pads.idx], [c[0] * FW / 2, yTop + stand, c[1] * FD / 2, fr.idx]], { alpha: 0.85 });
    m.guide([[c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), fr.idx], [c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), mem.idx]], { alpha: 0.85 });
  });
  m.guide([[0, -T / 2 - 6, 0, blank.idx], [0, yM + 4, 0, mem.idx]], { style: 'axis', alpha: 0.8 });
  // (round two: the glass's dot further along the face, so the two dots read apart)
  m.callout([-B / 2 + 45, 1.2, B / 2, blank.idx], 'Glass plate', { side: 'l' });
  m.dim([B / 2, -T / 2, B / 2], [B / 2, T / 2, B / 2], [10, 0, 0], '6.35 mm', { t: 0.5, part: blank.idx });
  // (on a phone, in rows, the coating is named on the right face, by the corner, where its upright leader crosses nothing: on
  // the left face it ran through the 152.4 mm figure)
  m.callout([-B / 2 + 11, yTop - ml / 2, B / 2, blank.idx], 'Mirror coating', { side: 'l', rowAt: [B / 2, yTop - ml / 2, -B * 0.34, blank.idx] });
  m.callout([-FW * 0.28, yM, FD * 0.22, mem.idx], 'Pellicle', { side: 'l' });
  // the ring on the coating's top face, in the pattern area: on one of the dark bars of the block in the pattern's right-hand
  // column (block D of MAP, its last bar, so the cone's lower edge passes clear of the glass plate's leader), the absorber
  // lines the loupe cuts across
  var ringAt = [3 * cw, yTop, -PD / 2 + 3 * cd / 2 + (5 / 5 - 0.5) * (3 * cd - 4) * 0.76];
  // (tuck: the disc in the drawing's empty top right corner, over the pellicle's right corner, its caption beside its upper
  // half, over the pellicle; under 560 px it stands in the foot's corner as before)
  var loupe = { model: 'mask-loupe', at: ringAt, part: 'blank', side: 'r', r: 0.11, rMax: 72, scale: 0.615, dx: -0.256, dy: 0.03, inset: 26, tuck: 'tr', tdx: -58, tdy: 14, capSide: 'l', capDy: -46, caption: ['A cut through the pattern,', 'at true thickness'] };
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

/* The loupe's plate, in nanometres, seen almost face on so its cut face reads as a section: the glass, about forty pairs of
   layers, the 3 nm ruthenium cap, and two lines of absorber 60 nm tall (58 nm TaBN and 2 nm TaBO, "nominally 60nm thick"),
   all from the imec and PTB paper chapter 5 cites (arxiv.org/abs/1912.09075). Only the absorber's height and the pair count
   carry figures.
   22 Nov 2026 expert review: each pair is drawn as the paper's Table 1 gives its sublayers, top down: a silicon-like layer of
   1.435 nm, an interlayer of 1.215, molybdenum 1.807, an interlayer of 1.422 and a silicon-like layer of 1.151, so silicon
   sits directly under the ruthenium cap (molybdenum sat there, each pair drawn half and half). The absorber's bar reads
   60 nm, the absorber's whole height (it read 58 nm, the TaBN alone, over both layers).
   22 Nov 2026 designer pass: the section stands left of the disc's middle and its names stand in the clear ground to its
   right, so none is laid over the layers it names: the absorber's name over the line it names with its height beside it, the
   pairs named by a bar the height of the stack, the glass by a short leader. The heights keep their true proportion. */
R('mask-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  function bx(x0, y0, x1, y1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, 0], s: [x1 - x0, y1 - y0, 60], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  var X0 = -130, X1 = 90, NP = 40, g0 = -40, gB = g0 - 40;
  // (the glass ruled open at 45 degrees, the absorber close at 135: two materials, two rulings)
  bx(X0, gB, X1, g0, 'light', { pz: { d: 0.03, hatch: 1, ang: 45, gap: 3.6 } });
  // a pair's sublayers bottom up (Table 1 read from the glass): silicon-like, interlayer, molybdenum, interlayer, silicon-like.
  // The stack is one block in silicon's slate, the molybdenum laid on its cut face as bands with no outline (drawn as 160 blocks,
  // their outlines turned the stack black). 22 Nov 2026 plates refine: two values, molybdenum darker and silicon lighter; the
  // interlayers, where the two mix, are drawn with the silicon (three values, molybdenum near ink, read as a black block)
  var MO = { d: 0.5 };
  var SUBL = [[1.151, null], [1.422, null], [1.807, MO], [1.215, null], [1.435, null]], y = g0, bands = [];
  for (var i = 0; i < NP; i++) SUBL.forEach(function (q) { if (q[1]) bands.push([y, y + q[0], q[1]]); y += q[0]; });
  var yc = y, cyS = (g0 + yc) / 2, hx = (X1 - X0) / 2, ZF = 30;
  m.box({ c: [(X0 + X1) / 2, cyS, 0], s: [X1 - X0, yc - g0, 60], decals: { pz: bands.map(function (q) { return D.poly([[-hx, q[0] - cyS, ZF], [hx, q[0] - cyS, ZF], [hx, q[1] - cyS, ZF], [-hx, q[1] - cyS, ZF]], { fill: q[2], lw: 0 }); }) } }, 'acc');
  bx(X0, yc, X1, yc + 3, 'mid');
  [[-104, -64], [8, 48]].forEach(function (a) { bx(a[0], yc + 3, a[1], yc + 3 + 60, 'dark', { pz: { d: 0.04, hatch: 2, ang: 135, gap: 1.9 } }); });
  /* 22 Nov 2026 plates refine: the disc is a quarter smaller, tucked into the photomask's empty corner, so the names stand
     in one column right of the section, each inside the disc: the absorber's name over its height, the pairs' bar under it,
     the glass by a short leader (the absorber's name stood over the section, on the disc's rim) */
  bar(m, [X1 + 20, yc + 3, 30], [X1 + 20, yc + 63, 30], '60 nm', { side: 1, wit: [[48, yc + 3, 30], [48, yc + 63, 30]] });
  tag(m, [X1 + 10, yc + 63, 30], 'Absorber', { align: 'left', dy: -10 });
  bar(m, [X1 + 20, g0, 30], [X1 + 20, yc, 30], 'About 40\nlayer\npairs', { side: 1 });
  tag(m, [X1 + 30, gB - 30, 30], 'Glass', { align: 'left', lead: [X1 - 30, (gB + g0) / 2, 30] });
  return { elev: 0.06, yaw: -0.05, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
