/* =====================================================================================================
   09 Memory, option 1 · The deck, spread (four plates, round 4, 24 Nov 2026, late; the round 3 concept 09-C, kept by the owner).
   A twelve-high HBM stack's dies spread out like a deck of cards over their base die, each a step higher and a step further
   back than the one under it, so a band of each die's face shows. The idea: each layer is a whole memory die, and every die
   connects to the next through a stripe of copper down its middle.
   - Footprint 11 x 11 mm (Micron's twelve-high HBM3E, the caption): the base die 11 mm, the memory dies 10.6 mm (drawn).
     Twelve memory dies on one base die. Thicknesses and gaps far exaggerated, the dies spread apart.
   - The dies are drawn face up so their faces show. In a real stack each faces down (the caption says so; expert to confirm).
   - Each memory die's face in the expert's die-photo palette (round 3 rulings): the face #3d3b57 with one soft static band;
     sixteen memory arrays, eight either side of the central stripe, as a fine even grid in teal #3f6873 shading toward blue
     #3e5a86; the central stripe, coarse grey-bronze #8a8170 framed by copper-tone lines #b07a52, carrying the bump pads.
     Sixteen is a drawn count (expert to confirm it as a symbol).
   - The stripe holds the through-silicon vias. A notch is cut into each die's front edge where the stripe meets it, and its wall
     shows the vias as copper columns through the die. The top die has none (the expert confirmed in round 1), so it has no notch.
   - Between the dies, in the stripe, the microbumps: copper pillars with tin-silver caps, one row under each die's front edge,
     so vias and bumps run as one copper staircase from the base die to the top.
   - The base die: wider, its face the logic of the die-photo palette (a fine mottle about #5e5678) with a coarse PHY strip along
     its front edge and its own stripe and vias.
   - Die edges: the polished dark sawn edge #2f323a with a light edge line (01's), so each die reads as a thin card.
   - The finest textures (the arrays' grid, the logic mottle) are marked fine, so the kit leaves them out while the plate turns,
     and they are drawn only where a face shows.
   The labels keep the parts list's numbers and names: 1 Memory dies, 2 Base die, 3 TSVs, 4 Microbumps. The loupe keeps the
   microbumps in a gap as small as 7 um (Samsung's twelve-high HBM3E release).
   Its materials (hb4*, hbCu, hbSnAg, hbMould) and 01's die-photo materials (dp*) are in the kit's palette (src/plate.js REAL). */

R('hbm-stack', function (m) {
  var hw = 5.3, W = 5.5, t = 0.4, g = 0.46, d = 0.95, bt = 0.5, n = 12;
  var B = 1.15, N = 0.42, TX = [-0.95, -0.57, -0.19, 0.19, 0.57, 0.95], TW = 0.09, RP = 0.14, CAP = 0.36;
  var yOf = function (i) { return g + i * (t + g); }, zOf = function (i) { return -(i + 1) * d - 0.85; };
  var EDGE = { d: 0.1, real: 'hb4Edge' }, CUTS = { d: 0.04, hatch: 2, real: 'hb4Si' };
  // a die's plan (die-local x, z), its front edge notched where the stripe meets it (notch false: a plain square)
  function plan(w, notch) { return notch ? [[-w, -w], [w, -w], [w, w], [B, w], [B, w - N], [-B, w - N], [-B, w], [-w, w]] : [[-w, -w], [w, -w], [w, w], [-w, w]]; }
  var rect = function (it, x0, z0, x1, z1, y, real, o) { o = o || {}; it.push({ pts: [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], closed: true, lw: 0, fill: { d: 0.5, real: real }, tag: o.tag || null, col: o.col || null, fine: !!o.fine }); };
  var line = function (it, x0, z0, x1, z1, y, real, lw, al, o) { o = o || {}; it.push({ pts: [[x0, y, z0], [x1, y, z1]], lw: lw, real: real, alpha: al == null ? 1 : al, fine: !!o.fine, tag: o.tag || null }); };
  // a memory die's face at height y (die-local x, z): sixteen arrays and the central stripe with its pads; the fine grid only
  // where z is over zSeen (the band that shows)
  function dramFace(y, zSeen, top) {
    var it = [], xs = [[-hw + 0.28, -B - 1.95], [-B - 1.85, -B - 0.22], [B + 0.22, B + 1.85], [B + 1.95, hw - 0.28]];
    xs.forEach(function (cx, ci) {
      for (var r = 0; r < 4; r++) {
        var z0 = -hw + 0.28 + r * (2 * hw - 0.56) / 4 + 0.06, z1 = z0 + (2 * hw - 0.56) / 4 - 0.12;
        rect(it, cx[0], z0, cx[1], z1, y, (ci + r) % 2 ? 'dpSramB' : 'dpSram');
        if (z1 < zSeen) continue;
        // the fine even grid of the array (drawn, a symbol of its sub-arrays)
        for (var gx = cx[0] + 0.27; gx < cx[1] - 0.05; gx += 0.27) line(it, gx, Math.max(z0, zSeen - 0.3), gx, z1, y, 'dpSramLn', 0.35, 0.7, { fine: true });
        for (var gz = z0 + 0.31; gz < z1 - 0.05; gz += 0.31) if (gz > zSeen - 0.3) line(it, cx[0], gz, cx[1], gz, y, 'dpSramLn', 0.35, 0.7, { fine: true });
      }
    });
    // the central stripe: coarse grey-bronze, framed by copper-tone lines, its bump pads in six rows
    rect(it, -B, -hw + 0.28, B, top ? hw - 0.28 : hw - N - 0.04, y, 'dpPhy');
    line(it, -B + 0.08, -hw + 0.32, -B + 0.08, top ? hw - 0.32 : hw - N - 0.06, y, 'dpCu', 0.7, 0.95);
    line(it, B - 0.08, -hw + 0.32, B - 0.08, top ? hw - 0.32 : hw - N - 0.06, y, 'dpCu', 0.7, 0.95);
    var pd = []; TX.forEach(function (x) { for (var z = -hw + 0.55; z <= (top ? hw - 0.45 : hw - N - 0.2); z += 0.5) if (top || z > zSeen - 0.6) pd.push([x, y, z]); });
    it.push({ dots: pd, r: 1.25, alpha: 1, real: 'hb4Rim', tag: 'bumps', col: 'acc', thinLit: true, thinRing: false });
    it.push({ dots: pd, r: 1.05, alpha: 1, real: 'hbSnAg', tag: 'bumps', col: 'acc', thinLit: true });
    return it;
  }
  // the base die's face: logic (a fine mottle), a coarse PHY strip along its front, its stripe and pads
  function baseFace(y, zSeen) {
    var it = [], rnd = H.rng(29);
    rect(it, -W + 0.25, -W + 0.25, -B - 0.15, W - 1.25, y, 'dpLogic');
    rect(it, B + 0.15, -W + 0.25, W - 0.25, W - 1.25, y, 'dpLogic');
    for (var cx = -W + 0.3; cx < W - 0.4; cx += 0.42) for (var cz = zSeen - 0.4; cz < W - 1.3; cz += 0.42) {
      if (Math.abs(cx + 0.21) < B + 0.2) continue;
      var v = rnd(), rl = v < 0.1 ? 'dpBronze' : v < 0.42 ? 'dpLogicHi' : v < 0.74 ? 'dpLogicLo' : null;
      if (rl) rect(it, cx + 0.02, cz + 0.02, cx + 0.4, cz + 0.4, y, rl, { fine: true });
    }
    [[-W + 0.25, -B - 0.15], [B + 0.15, W - 0.25]].forEach(function (s) {
      rect(it, s[0], W - 1.1, s[1], W - 0.25, y, 'dpPhy');
      for (var q = 0; q < 7; q++) { var x = s[0] + 0.2 + q * (s[1] - s[0] - 0.4) / 6; line(it, x, W - 1.0, x, W - 0.35, y, 'dpCu', 0.7, 0.95); }
    });
    rect(it, -B, -W + 0.25, B, W - N - 0.04, y, 'dpPhy');
    var pd = []; TX.forEach(function (x) { for (var z = zSeen - 0.4; z <= W - N - 0.2; z += 0.5) pd.push([x, y, z]); });
    it.push({ dots: pd, r: 1.25, alpha: 1, real: 'hb4Rim', tag: 'bumps', col: 'acc', thinLit: true, thinRing: false });
    it.push({ dots: pd, r: 1.05, alpha: 1, real: 'hbSnAg', tag: 'bumps', col: 'acc', thinLit: true });
    return it;
  }
  // the vias on a notch's wall (die-local), as decals: copper threads through the die's whole thickness, a fine darker rim, a
  // 0.75 px wine outline when pointed at
  function vias(y0, y1, z) { return TX.map(function (x) { return { pts: [[x - TW / 2, y0, z], [x + TW / 2, y0, z], [x + TW / 2, y1, z], [x - TW / 2, y1, z]], closed: true, fill: { d: 0.1, real: 'hb4CuSec' }, real: 'hb4CuSec', lw: 0.7, col: 'acc', tag: 'tsv' }; }); }
  // the notch's back wall (die-local, at z), the vias drawn on it: its own thin section, so the pointer anywhere on it finds
  // the TSVs
  function wall(y0, y1, z, zc) {
    m.tag('tsvWall'); m.real('hb4SiWall');
    m.sheet([[-B, y0, z + zc], [B, y0, z + zc], [B, y1, z + zc], [-B, y1, z + zc]], { d: 0.04 }, { decals: vias(y0, y1, z + zc) });
    m.tag(null);
  }
  /* The gap under a die, in the plane of its notch's wall, so the cut passes through the vias and the microbumps alike: the black
     mould that fills the gap (MR-MUF, as the loupe draws it), and on it, under each via, a microbump in section: a wide copper
     pillar, about three and a half times the via's width (the expert: HBM vias are a few micrometres across, the pillars several
     times wider), on the die below (the dies are drawn face up, so the pillar stands on the face), and on it a short tin-silver
     cap, slightly domed after reflow, bulging only a little past the pillar, which meets the die above. So down the staircase the
     vias read as thin copper threads in pale silicon and the bumps as wide copper posts with silver caps in the black gaps: apart
     by width, by setting and by the cap. The bumps are decals on the band: pointed at anywhere on the band, the microbumps light,
     each keeping its own colour a step lighter under a fine wine outline. */
  function studs(yBot, yTop, z) {
    var h = yTop - yBot, yc = yTop - h * CAP, dec = [];
    TX.forEach(function (x) {
      dec.push({ pts: [[x - RP, yBot, z], [x + RP, yBot, z], [x + RP, yc + 0.006, z], [x - RP, yc + 0.006, z]], closed: true, fill: { d: 0.1, real: 'hb4CuSec' }, real: 'hb4CuSec', lw: 0.6, col: 'acc', tag: 'bumps' });
      // the cap: from the pillar's top, its sides bulging a little past the pillar, its top slightly domed to meet the die above
      var cp = [], RC = RP * 1.1, hc = yTop - yc;
      cp.push([x - RP, yc, z], [x + RP, yc, z]);
      for (var k = 0; k <= 4; k++) { var u = k / 4; cp.push([x + RP + (RC - RP) * Math.sin(u * Math.PI / 2), yc + hc * 0.55 * u, z]); }
      for (k = 0; k <= 6; k++) { var a = k / 6; cp.push([x + RC * Math.cos(a * Math.PI), yc + hc * (0.55 + 0.45 * Math.sin(a * Math.PI)), z]); }
      for (k = 4; k >= 0; k--) { var v = k / 4; cp.push([x - RP - (RC - RP) * Math.sin(v * Math.PI / 2), yc + hc * 0.55 * v, z]); }
      dec.push({ pts: cp, closed: true, fill: { d: 0.1, real: 'hb4Bead' }, real: 'hb4Bead', lw: 0.6, col: 'acc', tag: 'bumps' });
    });
    m.tag('bumpGap'); m.real('hbMould');
    m.sheet([[-B, yBot, z], [B, yBot, z], [B, yTop, z], [-B, yTop, z]], { d: 0.3 }, { decals: dec });
    m.tag(null);
  }

  // ---- the base die
  var base = m.part('base', { seq: 0, mode: 'fixed' });
  var zSeen0 = zOf(0) + hw;                              // the base die's face shows in front of die 1's front edge
  m.tag('base'); m.real('dpFace');
  m.prism(plan(W, true), -bt, 0, 'steel', { sideMat: { 0: EDGE, 1: EDGE, 2: EDGE, 3: CUTS, 4: CUTS, 5: CUTS, 6: EDGE, 7: EDGE }, top: baseFace(0.001, zSeen0) });
  m.tag(null);
  wall(-bt, 0, W - N + 0.003, 0);
  m.dim([-W, -bt, W], [W, -bt, W], [0, 0, 1.5], '11 mm');
  // ---- the twelve memory dies, each with the microbumps under its front edge
  var parts = [];
  for (var i = 0; i < n; i++) {
    var y0 = yOf(i), zc = zOf(i), top = i === n - 1, p = m.part('die' + (i + 1), { seq: i + 1, mode: 'fixed' });
    var yBelow = i ? yOf(i - 1) + t : 0;
    // (the bumps stand under the vias, in the plane of the notch's wall, so the cut passes through vias and bumps alike)
    studs(yBelow, y0, zc + hw - N + 0.003);
    var zSeen = top ? -hw : (zOf(i + 1) + hw) - zc;      // this die's face shows in front of the next die's front edge (die-local)
    m.tag('dies'); m.real('dpFace');
    m.prism(plan(hw, !top), y0, y0 + t, 'light', {
      pos: [0, 0, zc],
      sideMat: top ? { 0: EDGE, 1: EDGE, 2: EDGE, 3: EDGE } : { 0: EDGE, 1: EDGE, 2: EDGE, 3: CUTS, 4: CUTS, 5: CUTS, 6: EDGE, 7: EDGE },
      top: dramFace(y0 + t + 0.001, zSeen, top)
    });
    m.tag(null);
    if (!top) wall(y0, y0 + t, hw - N + 0.003, zc);
    parts.push(p);
  }
  /* The four numbered labels, in the parts list's order. On a phone they stand in rows, each pointing at another spot on its part
     (rowAt) where an upright leader runs clear of the deck: the memory dies from the top die up to the row over the drawing; the
     TSVs, the microbumps and the base die from the deck's foot down to the row under it. */
  var pi = function (i) { return parts[i].idx; }, bumpZ = function (i) { return zOf(i) + hw - N + 0.003; }, wallZ = function (i) { return zOf(i) + hw - N + 0.003; };
  m.callout([[-hw * 0.62, yOf(6) + t, zOf(6) + hw - 0.3, pi(6)], [-hw * 0.62, yOf(2) + t, zOf(2) + hw - 0.3, pi(2)]], 'Memory dies', { n: 1, tag: 'dies', only: 'ink', side: 'l', row: 't', rowAt: [[-hw * 0.55, yOf(11) + t, zOf(11) - hw * 0.55, pi(11)]] });
  m.callout([[-W * 0.72, -bt / 2, W, base.idx]], 'Base die', { n: 2, tag: 'base', only: 'ink', side: 'l', row: 'b', rowAt: [[W, -bt / 2, W * 0.35, base.idx]] });
  m.callout([[TX[4], yOf(2) + t / 2, wallZ(2), pi(2)]], 'TSVs', { n: 3, tag: ['tsv', 'tsvWall'], only: 'accent', side: 'r', level: true, row: 'b', rowAt: [[TX[1], yOf(0) + t / 2, wallZ(0), pi(0)]] });
  m.callout([[TX[5], yOf(1) - g * 0.6, bumpZ(1), pi(1)]], 'Microbumps', { n: 4, tag: ['bumps', 'bumpGap'], only: 'accent', side: 'r', level: true, row: 'b', rowAt: [[TX[4], yOf(0) - g * 0.6, bumpZ(0), pi(0)]] });
  // (the disc in the empty corner beside the top die, so the deck takes the slot's width; its caption under it)
  var loupe = { model: 'hbm-loupe', at: [TX[2], yOf(6) - g * 0.5, zOf(6) + hw - N + 0.003], part: 'die7', side: 'r', r: 0.14, rMax: 88, scale: 0.63, dx: 0.075, dy: 0.01, tuck: 'tr', tdx: 70, tdy: 70, caption: ['Microbumps in a gap', 'as small as 7 µm.', 'Dies not to scale'] };
  return {
    elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, thinHover: true,
    order: { r: [3, 4] }, accent: [176, 102, 44], accentDark: [224, 154, 92]
  };
});

/* The loupe, in micrometres, face on: two memory dies in section, a via through each, and between them a microbump, its copper
   pillar and its tin-silver cap, in a 7 um gap (Samsung's twelve-high HBM3E release) filled with black mould (MR-MUF, as the
   expert ruled for a finished stack). Widths and the dies' thickness are drawn, not sourced; the caption says not to scale. */
R('hbm-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  var CUTF = function (real) { return { pz: { d: 0.1, hatch: 2, real: real }, px: { d: 0.1, real: real }, py: { d: 0.1, real: real } }; };
  function bx(x0, y0, z0, x1, y1, z1, real, mat) { m.real(real); return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], s: [x1 - x0, y1 - y0, z1 - z0], fmat: CUTF(real) }, mat || 'light'); }
  m.part('st', { mode: 'fixed' });
  /* In its true orientation: each die faces down, its copper pillar hanging from the die above, the tin-silver cap on the pad of
     the die below. The pillar about three and a half times the via's width (the expert: vias a few micrometres across, pillars
     several times wider), the cap a short layer about as wide, bulging only a little past the pillar, slightly domed into the pad.
     Widths and the dies' thickness are drawn, not sourced; the caption says not to scale. */
  var t = 26, g = 7, Z = 20, x0 = -15, x1 = 15, cols = [0], VW = 2.0, PW = 7.0, CH = g * 0.4;
  bx(x0, 0, -Z, x1, t, Z, 'hb4SiWall');
  cols.forEach(function (vx) { bx(vx - VW, 0, -2, vx + VW, t, Z + 0.05, 'hbCu', 'acc'); });
  bx(x0, t, -Z, x1, t + g - 0.05, Z - 0.5, 'hbMould', 'mid');
  cols.forEach(function (vx) {
    bx(vx - PW * 1.02, t, -8, vx + PW * 1.02, t + 0.6, Z + 0.1, 'hbSnAg', 'acc');         // the cap's foot, curving into the pad
    bx(vx - PW * 1.09, t + 0.6, -8, vx + PW * 1.09, t + CH, Z + 0.1, 'hbSnAg', 'acc');      // the cap, bulging a little past the pillar
    bx(vx - PW, t + CH, -8, vx + PW, t + g, Z + 0.1, 'hbCu', 'acc');                        // the pillar
  });
  bx(x0, t + g, -Z, x1, 2 * t + g, Z, 'hb4SiWall');
  cols.forEach(function (vx) { bx(vx - VW, t + g, -2, vx + VW, 2 * t + g, Z + 0.05, 'hbCu', 'acc'); });
  bar(m, [x1 + 7, t, Z + 1], [x1 + 7, t + g, Z + 1], '7 \u00b5m', { side: 1 });
  tag(m, [0, 2 * t + g + 12, -Z], 'Memory die', {});
  // the two parts named inside the disc, each with a short leader: the via in the die, the bump in the gap
  tag(m, [x0 - 5, t * 0.42, Z], 'TSV', { align: 'right', lead: [cols[0] - VW, t * 0.42, Z + 0.1] });
  tag(m, [x0 - 5, t + g * 0.55, Z], 'Microbump', { align: 'right', lead: [cols[0] - PW, t + g * 0.55, Z + 0.1] });
  return { elev: 0.15, yaw: -0.13, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});
