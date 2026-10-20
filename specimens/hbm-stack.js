/* Specimen: a 12-high HBM3E stack, exploded inside its molding compound.
 *
 * Real object: an 11 x 11 mm cube, 0.72 mm tall (Micron's HBM3E product brief:
 * "11mm x 11mm x 0.72mm"), holding a logic base die and
 * twelve DRAM dies each ground to about 30 um, joined by micro-bumps and pierced
 * by through-silicon vias down the middle of every die. Wikipedia's HBM article
 * gives the 30 um die thickness; Samsung's 36 GB HBM3E 12H release gives the
 * 7 um die-to-die gap and the rule that a 12-high must fit the same height as an
 * 8-high.
 *
 * Drawing decisions:
 *  - Footprint is to scale (1 mm = 0.09 units). Thicknesses and gaps are
 *    exaggerated about fifteen times, chosen so the exploded assembly is roughly
 *    as tall as it is wide: at true scale this object is a tile, not a cube, and
 *    at the old 40x explosion it read as a tall slab.
 *  - The molding compound is drawn as a faint shell around the whole stack. It
 *    is what makes the finished part a cube, and it is what the reader is being
 *    shown the inside of.
 *  - The base die is wider, twice as thick, copper, and carries its own logic
 *    floorplan, so it cannot be mistaken for a thirteenth DRAM die.
 */
PC.register('hbm-stack', function (p) {
  var mm = 0.09;
  var W = 10.6 * mm, D = 10.6 * mm;         // DRAM die footprint, drawn a shade inside the cube
  var bW = 11 * mm, bD = 11 * mm;           // base die and molding: the cube's 11 x 11 mm footprint
  var t = 0.040, bt = 0.080;                // drawn thicknesses (~15x life)
  var pitch = 0.062;                        // gap is 55% of a die's own thickness
  var baseGap = 0.046;                      // a wider step off the base die
  var dies = 12;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function rect(w, d, per, tn) {
    return PC.polyline({ pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- levels ----------
  var yBase = 0, baseTop = bt / 2;
  var lvl = [];                                   // bottom face of each DRAM die
  for (var i = 0; i < dies; i++) lvl.push(baseTop + baseGap + pitch * i);
  var yTop = lvl[dies - 1] + t;                   // top face of the twelfth die

  // ---------- molding compound: the faint shell that makes this a cube ----------
  var mH = yTop + 0.014 - baseTop, mY = baseTop + mH / 2;
  add(PC.T(PC.accent2(PC.box({ w: bW, h: mH, d: bD, faces: ['px', 'nx', 'pz', 'nz'], n: 4600 }), 0.16), { pos: [0, mY, 0] }));
  add(PC.T(PC.accent2(PC.plane({ w: bW, d: bD, n: 1600 }), 0.15), { pos: [0, baseTop + mH, 0] }));
  add(PC.T(PC.accent2(PC.boxEdges({ w: bW, h: mH, d: bD, perUnit: 190 }), 0.4), { pos: [0, mY, 0] }));

  // ---------- the logic base die (copper) ----------
  add(PC.T(PC.plane({ w: bW, d: bD, n: 1900, tone: 0.3 }), { pos: [0, baseTop, 0] }));
  add(PC.T(PC.accent(PC.box({ w: bW, h: bt, d: bD, faces: ['px', 'nx', 'pz', 'nz'], n: 2400 }), 0.58), { pos: [0, yBase, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: bW, h: bt, d: bD, perUnit: 320 }), 1), { pos: [0, yBase, 0] }));
  // its floorplan: two wide PHY strips facing the dies, a controller block between them
  var bl = [];
  bl.push(PC.T(rect(bW * 0.86, bD * 0.2, 150, 1), { pos: [0, baseTop + 0.003, -bD * 0.33] }));
  bl.push(PC.T(rect(bW * 0.86, bD * 0.2, 150, 1), { pos: [0, baseTop + 0.003, bD * 0.33] }));
  bl.push(PC.T(rect(bW * 0.5, bD * 0.3, 150, 1), { pos: [0, baseTop + 0.003, 0] }));
  for (i = 0; i < 7; i++) {
    var bx = (i - 3) * bW * 0.12;
    bl.push(PC.line({ a: [bx, baseTop + 0.003, -bD * 0.42], b: [bx, baseTop + 0.003, -bD * 0.24], perUnit: 130, tone: 1 }));
    bl.push(PC.line({ a: [bx, baseTop + 0.003, bD * 0.24], b: [bx, baseTop + 0.003, bD * 0.42], perUnit: 130, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, bl), 0.75));
  // the micro-bumps that carry the cube down onto the interposer
  add(PC.T(PC.accent(PC.dots({ nx: 16, nz: 17, sx: bW / 17, sz: bD / 18, per: 3 }), 0.5), { pos: [0, yBase - bt / 2 - 0.018, 0] }));

  // ---------- the through-silicon-via farm, down the middle of every die ----------
  var tsv = [], fx = W * 0.30, fz = D * 0.66;
  for (var a = 0; a < 4; a++) for (var b = 0; b < 9; b++) {
    tsv.push([(a - 1.5) * fx / 3.4, (b - 4) * fz / 8.6]);
  }

  // ---------- the twelve DRAM dies ----------
  for (i = 0; i < dies; i++) {
    var y = lvl[i], yc = y + t / 2;
    add(PC.T(PC.plane({ w: W, d: D, n: 800, tone: 0.26 }), { pos: [0, y + t, 0] }));
    add(PC.T(PC.box({ w: W, h: t, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 950, tone: 0.4 }), { pos: [0, yc, 0] }));
    // one crisp outline on the top edge and a softer one below: the layer line an
    // engraver would draw, and half the ink of a full wireframe box
    add(PC.T(rect(W, D, 240, 0.95), { pos: [0, y + t, 0] }));
    add(PC.T(rect(W, D, 105, 0.45), { pos: [0, y, 0] }));
    // the micro-bumps sitting in the gap under this die
    add(PC.T(PC.dots({ nx: 11, nz: 12, sx: W / 12, sz: D / 13, per: 3, tone: 0.62 }), { pos: [0, y - (i === 0 ? baseGap : pitch - t) / 2, 0] }));
    // the TSV farm outline, so the reader sees where the vias pierce the silicon
    add(PC.T(rect(fx, fz, 130, 0.4), { pos: [0, y + t + 0.002, 0] }));
  }

  // ---------- the bank floorplan, drawn only on the fully visible top die ----------
  var bank = [];
  for (a = 0; a < 2; a++) for (b = 0; b < 4; b++) {
    var cx = (a - 0.5) * W * 0.44, cz = (b - 1.5) * D * 0.225;
    bank.push(PC.T(rect(W * 0.34, D * 0.19, 190, 0.85), { pos: [cx, yTop + 0.003, cz] }));
  }
  add(PC.merge.apply(null, bank));

  // ---------- TSVs: faint the whole height, bright inside each die ----------
  var tl = [], yLow = yBase - bt / 2;
  for (i = 0; i < tsv.length; i++) {
    tl.push(PC.line({ a: [tsv[i][0], yLow, tsv[i][1]], b: [tsv[i][0], yTop, tsv[i][1]], perUnit: 80, tone: 0.15 }));
    tl.push(PC.accent(PC.line({ a: [tsv[i][0], yLow, tsv[i][1]], b: [tsv[i][0], baseTop, tsv[i][1]], perUnit: 260 }), 0.6));
    for (var k = 0; k < dies; k++) {
      tl.push(PC.accent(PC.line({ a: [tsv[i][0], lvl[k], tsv[i][1]], b: [tsv[i][0], lvl[k] + t, tsv[i][1]], perUnit: 240 }), 0.6));
    }
  }
  add(PC.merge.apply(null, tl));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.40, -0.68, 0],
    // colour: the base die's wiring, the micro-bumps and the through-silicon vias are electroplated copper
    accent: [176, 102, 44], accentDark: [224, 154, 92],
    // colour: the shell round the stack is epoxy molding compound, which is black
    accent2: [43, 39, 36], accent2Dark: [107, 101, 95],
    caption: 'A twelve-high HBM stack opened up: twelve DRAM dies, each ground to about thirty micrometers, lifted off the copper-colored logic base die, with micro-bumps in every gap and through-silicon vias running the full height. The faint box around them is the molding compound that makes the finished part a cube. Footprint is to scale; thicknesses and gaps are exaggerated about fifteen times, because the real cube is only 0.72 mm tall.'
  };
});
