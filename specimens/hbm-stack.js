/* Specimen: a 12-high HBM stack, exploded.
 * Twelve DRAM dies of 11 x 12 mm lifted off a thicker logic base die (copper),
 * each carrying its field of micro-bumps, with the through-silicon vias drawn
 * as vertical lines running the height of the stack and corner guide lines
 * across the gaps. Die thickness and the gaps are exaggerated about tenfold:
 * the real stack is 0.7 mm tall, thinner than two sheets of paper.
 * Scale: 1 mm = 0.09 units.
 */
PC.register('hbm-stack', function (p) {
  var mm = 0.09;
  var W = 11 * mm, D = 12 * mm, t = 0.05, pitch = 0.16;   // die footprint, drawn thickness, exploded pitch
  var baseW = 12 * mm, baseD = 13 * mm, baseT = 0.09;
  var dies = 12;
  var parts = [];
  function add(c) { parts.push(c); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- logic base die (accent) ----------
  var yBase = 0;
  add(PC.T(PC.plane({ w: baseW, d: baseD, n: 1700, tone: 0.3 }), { pos: [0, yBase + baseT / 2, 0] }));
  add(PC.T(PC.accent(PC.box({ w: baseW, h: baseT, d: baseD, faces: ['px', 'nx', 'pz', 'nz'], n: 2600 }), 0.6), { pos: [0, yBase, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: baseW, h: baseT, d: baseD, perUnit: 320 }), 1), { pos: [0, yBase, 0] }));
  // the micro-bumps that carry the stack down onto the interposer
  add(PC.T(PC.dots({ nx: 15, nz: 16, sx: baseW / 16, sz: baseD / 17, per: 3, tone: 0.55 }), { pos: [0, yBase - baseT / 2 - 0.02, 0] }));

  // ---------- the two through-silicon-via farms, drawn on every die ----------
  var zones = [[-W * 0.22, W * 0.3, D * 0.62], [W * 0.22, W * 0.3, D * 0.62]];
  var tsv = [];
  for (var q = 0; q < zones.length; q++) {
    for (var a = 0; a < 4; a++) for (var b = 0; b < 6; b++) {
      tsv.push([zones[q][0] + (a - 1.5) * zones[q][1] / 4, (b - 2.5) * zones[q][2] / 6]);
    }
  }

  // ---------- twelve DRAM dies ----------
  var yTopDie = 0;
  for (var i = 0; i < dies; i++) {
    var y = baseT / 2 + pitch * (i + 1);
    yTopDie = y;
    add(PC.T(PC.plane({ w: W, d: D, n: 1500, tone: 0.28 }), { pos: [0, y + t / 2, 0] }));
    add(PC.T(PC.box({ w: W, h: t, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 1300, tone: 0.5 }), { pos: [0, y, 0] }));
    add(PC.T(PC.boxEdges({ w: W, h: t, d: D, perUnit: 300, tone: 0.95 }), { pos: [0, y, 0] }));
    // micro-bumps on the top face, and the outline of each TSV farm
    add(PC.T(PC.dots({ nx: 13, nz: 14, sx: W / 14, sz: D / 15, per: 3, tone: 0.62 }), { pos: [0, y + t / 2 + 0.004, 0] }));
    for (q = 0; q < zones.length; q++) {
      add(PC.T(rect(zones[q][1], zones[q][2], y + t / 2 + 0.005, 200, 0.5), { pos: [zones[q][0], 0, 0] }));
    }
  }

  // ---------- TSVs: vertical lines the whole height of the stack ----------
  var yLow = yBase - baseT / 2, yHigh = yTopDie + t / 2;
  var tl = [];
  for (i = 0; i < tsv.length; i++) tl.push(PC.line({ a: [tsv[i][0], yLow, tsv[i][1]], b: [tsv[i][0], yHigh, tsv[i][1]], perUnit: 110, tone: 0.26 }));
  add(PC.merge.apply(null, tl));

  // ---------- corner guide lines, spanning the gaps only ----------
  var g = [];
  for (var c = 0; c < 4; c++) {
    var cx = (c === 0 || c === 3) ? -W / 2 : W / 2, cz = (c < 2) ? -D / 2 : D / 2;
    for (i = 0; i <= dies; i++) {
      var yA = (i === 0) ? yBase + baseT / 2 : baseT / 2 + pitch * i + t / 2;
      var yB = baseT / 2 + pitch * (i + 1) - t / 2;
      if (i === dies) continue;
      g.push(PC.line({ a: [cx, yA, cz], b: [cx, yB, cz], perUnit: 150, tone: 0.3 }));
    }
  }
  add(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.3, -0.7, 0],
    caption: 'A twelve-high HBM stack pulled apart: twelve DRAM dies of 11 by 12 mm, each with its field of micro-bumps, lifted off the copper-coloured logic base die, with the through-silicon vias that carry every signal drawn as lines through the whole stack. Thickness and gaps are exaggerated about tenfold; the real stack is 0.7 mm tall.'
  };
});
