/* Specimen: a 12-high HBM3E stack, cut open.
 *
 * Real object: an 11 x 11 mm cube, 0.72 mm tall (Micron's HBM3E product brief:
 * "11mm x 11mm x 0.72mm"), holding a logic base die and
 * twelve DRAM dies each ground to about 30 um, joined by micro-bumps and pierced
 * by through-silicon vias down the middle of every die. Wikipedia's HBM article
 * gives the 30 um die thickness; Samsung's 36 GB HBM3E 12H release gives the
 * 7 um die-to-die gap and the rule that a 12-high must fit the same height as an
 * 8-high.
 *
 * Drawing decisions (redrawn 29 Oct 2026; the owner found the old drawing "slightly hard to comprehend"):
 *  - Footprint is to scale (1 mm = 0.09 units). Heights are exaggerated about
 *    fifteen times: each die is drawn 15 times its 30 um, and the whole stack
 *    stands 15 times the cube's 0.72 mm. The gaps take what is left, about one
 *    die thick, so every die stands clear of the next.
 *  - The old drawing stippled all four sides of every die inside a molding shell.
 *    The point renderer draws through solids and in perspective, so the near and
 *    far sides of twelve thin dies fell in different places and the stack read as
 *    a gray box. Each version here draws the stack's inside on one plane, where
 *    nothing lies behind it out of step: a cut face, as an engineer's section does
 *    (figure 09.1 is that section, flat).
 *  - The base die is wider, twice as thick and copper, so it cannot be mistaken
 *    for a thirteenth memory die. The vias and the micro-bumps are copper too.
 *  - The stack turns on its own axis (turntable), so the reader always sees it from
 *    the same height; turned about the screen's upright, it leaned and showed its
 *    underside.
 *
 * Two versions, for the owner to choose between (29 Oct 2026), with the same parts
 * and the same numbered points (data/specimen-parts.json):
 *  - a: the cutaway. The whole stack seen from above at three quarters, with the
 *    quarter nearest the reader cut away to show the dies, the gaps and the vias
 *    in section on the two cut faces.
 *  - b: the slice. A thin slice through the middle of the stack, seen almost face
 *    on, as figure 09.1 draws it, inside a faint outline of the whole cube.
 * The page picks one with ?hbm=a or ?hbm=b; without it the default below. */
PC.register('hbm-stack', function (p) {
  var DEFAULT = 'a';
  var q = typeof location !== 'undefined' && /[?&]hbm=([ab])\b/.exec(location.search || '');
  var v = (p && p.variant) || (q && q[1]) || DEFAULT;
  var rnd = PC.rnd;
  var mm = 0.09;
  var W = 10.6 * mm, D = 10.6 * mm;         // DRAM die footprint, a shade inside the cube
  var bW = 11 * mm, bD = 11 * mm;           // base die: the cube's 11 x 11 mm footprint
  var t = 0.040, bt = 0.080;                // drawn thicknesses: a die 15 x 30 um, the base die twice that
  var g = 0.034, baseGap = 0.034;           // the gaps: the stack's drawn height, 15 x 0.72 mm, less its dies
  var pitch = t + g;
  var dies = 12;
  var yBase = 0, baseTop = bt / 2, yLow = yBase - bt / 2;
  var lvl = [];                             // bottom face of each DRAM die
  for (var i = 0; i < dies; i++) lvl.push(baseTop + baseGap + pitch * i);
  var yTop = lvl[dies - 1] + t;             // top face of the twelfth die
  // the via farm down the middle of every die: five columns across, nine deep, so a row lies on each cut plane. The
  // micro-bumps keep the same pitch out to the die's edges, so a bump sits on every via
  var TX = 0.063, TZ = 0.072, tsv = [];
  for (var a = 0; a < 5; a++) for (var b = 0; b < 9; b++) tsv.push([(a - 2) * TX, (b - 4) * TZ]);
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function alloc(n) { return new Float32Array(Math.max(1, n) * 4); }
  // n points on the vertical rectangle from (x0, z0) to (x1, z1), between heights y0 and y1
  function wall(x0, z0, x1, z1, y0, y1, dens, tone) {
    var L = Math.sqrt((x1 - x0) * (x1 - x0) + (z1 - z0) * (z1 - z0)), n = Math.round(L * (y1 - y0) * dens * PC.density), c = alloc(n);
    for (var k = 0; k < n; k++) { var u = rnd(), y = y0 + (y1 - y0) * rnd(); c[k * 4] = x0 + (x1 - x0) * u; c[k * 4 + 1] = y; c[k * 4 + 2] = z0 + (z1 - z0) * u; c[k * 4 + 3] = tone; }
    return c;
  }
  // n points on the flat rectangle x0..x1, z0..z1 at height y
  function flat(x0, x1, z0, z1, y, dens, tone) {
    var n = Math.round((x1 - x0) * (z1 - z0) * dens * PC.density), c = alloc(n);
    for (var k = 0; k < n; k++) { c[k * 4] = x0 + (x1 - x0) * rnd(); c[k * 4 + 1] = y; c[k * 4 + 2] = z0 + (z1 - z0) * rnd(); c[k * 4 + 3] = tone; }
    return c;
  }
  function seg(a, b, per, tone) { return PC.line({ a: a, b: b, perUnit: per, tone: tone }); }
  function rect(x0, x1, z0, z1, y, per, tone) {
    return PC.polyline({ pts: [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], closed: true, perUnit: per, tone: tone });
  }
  // micro-bumps in a gap at height y, one at each [x, z], as the section shows them: each a small cluster of points
  function bumps(at, y, tone) {
    var m = 7, c = alloc(at.length * m);
    at.forEach(function (q, k) {
      for (var j = 0; j < m; j++) { var o = k * m + j; c[o * 4] = q[0] + (rnd() - 0.5) * 0.01; c[o * 4 + 1] = y + (rnd() - 0.5) * 0.012; c[o * 4 + 2] = q[1] + (rnd() - 0.5) * 0.01; c[o * 4 + 3] = tone; }
    });
    return c;
  }
  // the bumps along the plane z = 0 from x0 to x1, and along x = 0 from z0 to z1, on the vias' pitch
  function row(x0, x1, z0, z1) {
    var at = [], k;
    for (k = Math.ceil(x0 / TX); k * TX <= x1; k++) at.push([k * TX, 0]);
    for (k = Math.max(1, Math.ceil(z0 / TZ)); k * TZ <= z1; k++) at.push([0, k * TZ]);
    return at;
  }

  var cap = 'A twelve-high HBM stack, pulled apart and cut open: twelve memory dies on a copper-colored logic base die, with microbumps in every gap and through-silicon vias running through them all. The footprint is to scale, but the heights are exaggerated about fifteen times.';
  var out = { spin: 0.12, turntable: true,
    // colour: the base die's wiring, the micro-bumps and the through-silicon vias are electroplated copper
    accent: [176, 102, 44], accentDark: [224, 154, 92], caption: cap };

  if (v === 'a') {
    /* ---------- a: the cutaway. The quarter x > 0, z > 0 is cut away; its two cut faces are the planes z = 0 (x from 0
       to the edge) and x = 0 (z from 0 to the edge). The stack is turned on its axis so that quarter faces the reader. */
    var hw = W / 2, hd = D / 2, bw = bW / 2, bd = bD / 2;
    // the outside of one slab (a die or the base die): its six outer walls round the L the cut leaves
    var outside = function (w2, d2, y0, y1, dens, tone) {
      return PC.merge(wall(-w2, -d2, w2, -d2, y0, y1, dens, tone), wall(-w2, -d2, -w2, d2, y0, y1, dens, tone),
        wall(w2, -d2, w2, 0, y0, y1, dens, tone), wall(-w2, d2, 0, d2, y0, y1, dens, tone));
    };
    var cut = function (w2, d2, y0, y1, dens, tone) { return PC.merge(wall(0, 0, w2, 0, y0, y1, dens, tone), wall(0, 0, 0, d2, y0, y1, dens, tone)); };
    // the L's outline at height y
    var ell = function (w2, d2, y, per, tone) {
      return PC.polyline({ pts: [[-w2, y, -d2], [w2, y, -d2], [w2, y, 0], [0, y, 0], [0, y, d2], [-w2, y, d2]], closed: true, perUnit: per, tone: tone });
    };
    // the base die, copper: dense on its cut faces, lighter outside, its top a floorplan
    add(PC.accent(cut(bw, bd, yLow, baseTop, 52000, 1), 0.95));
    add(PC.accent(outside(bw, bd, yLow, baseTop, 9000, 1), 0.5));
    add(PC.accent(ell(bw, bd, baseTop, 320, 1), 1));
    add(PC.accent(ell(bw, bd, yLow, 200, 1), 0.7));
    var bl = [];
    bl.push(rect(-bw * 0.86, bw * 0.86, -bd * 0.43, -bd * 0.23, baseTop + 0.002, 150, 1));
    bl.push(rect(-bw * 0.86, 0, bd * 0.23, bd * 0.43, baseTop + 0.002, 150, 1));
    add(PC.accent(PC.merge.apply(null, bl), 0.6));
    // the bumps that carry the stack down onto the interposer, under the L
    var under = [];
    for (a = 0; a < 16; a++) for (b = 0; b < 17; b++) { var ux = (a - 7.5) * bW / 17, uz = (b - 8) * bD / 18; if (!(ux > 0 && uz > 0)) under.push([ux, uz]); }
    add(PC.accent(bumps(under, yLow - 0.016, 1), 0.45));
    // the twelve memory dies: dense ink on the cut faces, the outside lighter, an outline round each top
    for (i = 0; i < dies; i++) {
      var y = lvl[i];
      add(cut(hw, hd, y, y + t, 46000, 0.9));
      add(outside(hw, hd, y, y + t, 9000, 0.5));
      add(ell(hw, hd, y + t, 220, 0.6));
      // the micro-bumps in the gap under it, in section along both cut faces
      var yb = y - (i === 0 ? baseGap : g) / 2;
      add(PC.accent(bumps(row(0, hw - 0.02, 0, hd - 0.02), yb, 1), 0.85));
    }
    // the top die's face, with its banks, on the L
    add(flat(-hw, hw, -hd, 0, yTop, 900, 0.16)); add(flat(-hw, 0, 0, hd, yTop, 900, 0.16));
    var bank = [];
    for (a = 0; a < 2; a++) for (b = 0; b < 4; b++) {
      var bx = (a - 0.5) * W * 0.44, bz = (b - 1.5) * D * 0.225;
      if (bx > 0 && bz > 0) continue;
      bank.push(rect(bx - W * 0.17, bx + W * 0.17, bz - D * 0.095, bz + D * 0.095, yTop + 0.002, 190, 0.7));
    }
    add(PC.merge.apply(null, bank));
    // the vias: bright copper where they lie on a cut face, faint inside the stack, from the base die's foot to the top die
    var tl = [];
    tsv.forEach(function (c) {
      if (c[0] > 0.001 && c[1] > 0.001) return;                    // in the quarter cut away
      var onCut = (Math.abs(c[1]) < 0.001 && c[0] >= -0.001) || (Math.abs(c[0]) < 0.001 && c[1] >= -0.001);
      tl.push(PC.accent(seg([c[0], yLow, c[1]], [c[0], yTop, c[1]], onCut ? 1400 : 160, 1), onCut ? 1 : 0.35));
    });
    add(PC.merge.apply(null, tl));
    out.tilt = [0.36, -Math.PI / 4, 0];          // from above, the cut quarter toward the reader
  } else {
    /* ---------- b: the slice. A slice of the stack 1 mm thick through its middle (z from -s to s), with the row of vias it
       cuts through, inside a faint outline of the cube it was cut from. */
    var s = 0.045, hw2 = W / 2, bw2 = bW / 2;
    // the slice's two faces and its ends, for one slab
    var slab = function (w2, y0, y1, dens, tone) {
      return PC.merge(wall(-w2, s, w2, s, y0, y1, dens, tone), wall(-w2, -s, w2, -s, y0, y1, dens, tone),
        wall(-w2, -s, -w2, s, y0, y1, dens * 0.6, tone), wall(w2, -s, w2, s, y0, y1, dens * 0.6, tone));
    };
    add(PC.accent(slab(bw2, yLow, baseTop, 40000, 1), 0.95));
    add(PC.accent(rect(-bw2, bw2, -s, s, baseTop, 320, 1), 1));
    add(PC.accent(rect(-bw2, bw2, -s, s, yLow, 260, 1), 0.8));
    add(PC.accent(bumps(row(-bw2 + 0.02, bw2 - 0.02, 0, 0), yLow - 0.016, 1), 0.6));
    for (i = 0; i < dies; i++) {
      var y2 = lvl[i];
      add(slab(hw2, y2, y2 + t, 34000, 0.9));
      add(rect(-hw2, hw2, -s, s, y2 + t, 300, 0.9));
      add(rect(-hw2, hw2, -s, s, y2, 200, 0.5));
      var yb2 = y2 - (i === 0 ? baseGap : g) / 2;
      add(PC.accent(bumps(row(-hw2 + 0.02, hw2 - 0.02, 0, 0), yb2, 1), 0.85));
    }
    var tl2 = [];
    tsv.forEach(function (c) { if (Math.abs(c[1]) < s) tl2.push(PC.accent(seg([c[0], yLow, c[1]], [c[0], yTop, c[1]], 1400, 1), 1)); });
    add(PC.merge.apply(null, tl2));
    // the cube the slice comes from: its top die's outline and its base die's, and the four corners between them, faint
    var ghost = [rect(-hw2, hw2, -D / 2, D / 2, yTop, 150, 0.55), rect(-bw2, bw2, -bD / 2, bD / 2, baseTop, 150, 0.55), rect(-bw2, bw2, -bD / 2, bD / 2, yLow, 110, 0.4)];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { ghost.push(seg([c[0] * hw2, baseTop, c[1] * D / 2], [c[0] * hw2, yTop, c[1] * D / 2], 150, 0.5)); });
    add(PC.merge.apply(null, ghost));
    out.tilt = [0.16, -0.32, 0];                 // nearly face on, a little from above
  }
  out.cloud = PC.merge.apply(null, parts);
  return out;
});
