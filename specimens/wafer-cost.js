/* Specimen: the bill of materials for one B200, built as a column of ink.
 *
 * A stacked bar standing on a graduated plinth. Segment heights are the
 * dollars in Epoch AI's teardown of what it costs Nvidia to build a B200
 * (epoch.ai/data-insights/b200-cost-breakdown):
 *
 *   high-bandwidth memory      $2,900   46%   copper
 *   advanced packaging (CoWoS) $1,100   17%
 *   packaging yield loss       $1,000   16%   drawn hollow: it ships nothing
 *   logic die fabrication        $900   14%
 *   auxiliary (VRM, PCB, test)   $480    8%
 *                              ------
 *                              $6,380
 *
 * Each segment carries the texture of the thing it pays for: twelve
 * layer lines on the memory, a via field on the packaging, floorplan
 * hatching on the logic die. A rule graduated every $500 stands at one
 * corner and the gridlines cross the column at every thousand, so the
 * eye can read the bar as a chart rather than as a chip.
 */
PC.register('wafer-cost', function (p) {
  var parts = [];
  var S = 1.90 / 6380;                    // dollars -> units
  var CW = 0.60;                          // the column is square in plan
  var H = CW / 2;

  var BOM = [
    { name: 'hbm', usd: 2900, amber: true },
    { name: 'packaging', usd: 1100 },
    { name: 'loss', usd: 1000, hollow: true },
    { name: 'logic', usd: 900 },
    { name: 'aux', usd: 480 }
  ];

  function ring(w, y, per, tn) {
    return PC.T(PC.polyline({
      pts: [[-w / 2, 0, -w / 2], [w / 2, 0, -w / 2], [w / 2, 0, w / 2], [-w / 2, 0, w / 2]],
      closed: true, perUnit: per, tone: tn
    }), { pos: [0, y, 0] });
  }
  // the four vertical corner edges of a square prism
  function posts(w, y0, y1, per, tn) {
    var g = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      g.push(PC.line({ a: [q[0] * w / 2, y0, q[1] * w / 2], b: [q[0] * w / 2, y1, q[1] * w / 2], perUnit: per, tone: tn }));
    });
    return PC.merge.apply(null, g);
  }

  // ---------- the plinth ----------
  var PW = 0.84, PH = 0.038;
  parts.push(PC.T(PC.plane({ w: PW, d: PW, n: 6200, tone: 0.15 }), { pos: [0, PH / 2, 0] }));
  parts.push(PC.box({ w: PW, h: PH, d: PW, faces: ['px', 'nx', 'pz', 'nz'], n: 2000, tone: 0.36 }));
  parts.push(PC.boxEdges({ w: PW, h: PH, d: PW, perUnit: 300, tone: 1 }));
  var GE = PW / 2 - 0.03;
  for (var gi = 1; gi < 10; gi++) {
    var gp = -GE + gi * 2 * GE / 10;
    parts.push(PC.line({ a: [gp, PH / 2 + 0.001, -GE], b: [gp, PH / 2 + 0.001, GE], perUnit: 95, tone: 0.24 }));
    parts.push(PC.line({ a: [-GE, PH / 2 + 0.001, gp], b: [GE, PH / 2 + 0.001, gp], perUnit: 95, tone: 0.24 }));
  }
  parts.push(ring(2 * GE, PH / 2 + 0.002, 220, 0.5));
  parts.push(ring(CW + 0.10, PH / 2 + 0.002, 320, 0.85));

  // ---------- the stack ----------
  var y = PH, boundaries = [PH];
  BOM.forEach(function (seg) {
    var h = seg.usd * S, y0 = y, y1 = y + h, yc = (y0 + y1) / 2;
    var faceN = Math.round(4 * CW * h * 6200);

    if (seg.hollow) {
      // the money that buys nothing: an empty cage, crossed out on all four sides
      parts.push(posts(CW, y0, y1, 460, 1));
      for (var s = 0; s < 4; s++) {
        var a = s * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
        var p0 = [ca * CW / 2 - sa * CW / 2, y0, sa * CW / 2 + ca * CW / 2];
        var p1 = [ca * CW / 2 + sa * CW / 2, y0, sa * CW / 2 - ca * CW / 2];
        var q0 = [p0[0], y1, p0[2]], q1 = [p1[0], y1, p1[2]];
        parts.push(PC.line({ a: p0, b: q1, perUnit: 260, tone: 0.8 }));
        parts.push(PC.line({ a: p1, b: q0, perUnit: 260, tone: 0.8 }));
      }
    } else if (seg.amber) {
      // memory: twelve DRAM layers over a thicker base die
      parts.push(PC.T(PC.accent(PC.box({ w: CW, h: h, d: CW, faces: ['px', 'nx', 'pz', 'nz'], n: faceN }), 0.34), { pos: [0, yc, 0] }));
      parts.push(PC.accent(posts(CW, y0, y1, 420), 1));
      for (var k = 1; k <= 12; k++) {
        parts.push(PC.accent(ring(CW, y0 + h * 0.18 + (k / 12) * h * 0.80, 240), 0.95));
      }
      parts.push(PC.accent(ring(CW, y0 + h * 0.18, 400), 1));
      // the through-silicon vias that make a stack out of the layers
      for (var t = 0; t < 4; t++) {
        var tx = (t - 1.5) * CW * 0.22;
        parts.push(PC.accent(PC.line({ a: [tx, y0 + h * 0.18, CW / 2 + 0.001], b: [tx, y1, CW / 2 + 0.001], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [CW / 2 + 0.001, y0 + h * 0.18, tx], b: [CW / 2 + 0.001, y1, tx], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [tx, y0 + h * 0.18, -CW / 2 - 0.001], b: [tx, y1, -CW / 2 - 0.001], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [-CW / 2 - 0.001, y0 + h * 0.18, tx], b: [-CW / 2 - 0.001, y1, tx], perUnit: 130 }), 0.85));
      }
    } else {
      parts.push(PC.T(PC.box({ w: CW, h: h, d: CW, faces: ['px', 'nx', 'pz', 'nz'], n: faceN, tone: 0.22 }), { pos: [0, yc, 0] }));
      parts.push(posts(CW, y0, y1, 420, 1));
      if (seg.name === 'packaging') {
        // an interposer: a few build-up lines and a field of vias
        for (k = 1; k <= 4; k++) parts.push(ring(CW, y0 + k * h / 5, 230, 0.7));
        for (var f = 0; f < 4; f++) {
          var ang = f * Math.PI / 2;
          parts.push(PC.T(PC.dots({ nx: 15, nz: 4, sx: CW * 0.062, sz: h * 0.17, per: 2, tone: 0.8 }),
            { rot: [Math.PI / 2, ang, 0], pos: [Math.sin(ang) * (CW / 2 + 0.001), yc, Math.cos(ang) * (CW / 2 + 0.001)] }));
        }
      } else if (seg.name === 'logic') {
        // two reticle-sized chiplets: floorplan hatching, banded
        parts.push(ring(CW, y0 + h * 0.5, 300, 0.75));
        for (f = 0; f < 4; f++) {
          ang = f * Math.PI / 2;
          for (var v = 0; v < 11; v++) {
            var vu = (v - 5) * CW * 0.084;
            var px = Math.cos(ang) * vu + Math.sin(ang) * (CW / 2 + 0.001);
            var pz = -Math.sin(ang) * vu + Math.cos(ang) * (CW / 2 + 0.001);
            parts.push(PC.line({ a: [px, y0 + h * 0.10, pz], b: [px, y1 - h * 0.10, pz], perUnit: 240, tone: 0.72 }));
          }
        }
      } else {
        // auxiliary: regulators and a connector, drawn as small blocks
        for (f = 0; f < 4; f++) {
          ang = f * Math.PI / 2;
          parts.push(PC.T(PC.dots({ nx: 9, nz: 2, sx: CW * 0.10, sz: h * 0.34, per: 3, tone: 0.8 }),
            { rot: [Math.PI / 2, ang, 0], pos: [Math.sin(ang) * (CW / 2 + 0.001), yc, Math.cos(ang) * (CW / 2 + 0.001)] }));
        }
      }
    }
    parts.push(ring(CW, y0, 520, 1));
    y = y1;
    boundaries.push(y1);
  });
  var TOP = y;
  // the lid: the finished module the whole bill adds up to
  parts.push(PC.T(PC.plane({ w: CW, d: CW, n: 1100, tone: 0.14 }), { pos: [0, TOP, 0] }));
  parts.push(ring(CW, TOP + 0.002, 560, 1));

  // ---------- the scale: gridlines every $1,000, a rule graduated every $500 ----------
  var grid = [];
  for (var d = 1000; d < 6380; d += 1000) {
    var gy = PH + d * S;
    grid.push(ring(CW + 0.11, gy, 150, 0.38));
    var cx = -(CW + 0.11) / 2, cz = -(CW + 0.11) / 2;
    grid.push(PC.line({ a: [cx, gy, cz], b: [-(CW / 2 + 0.155), gy, -(CW / 2 + 0.155)], perUnit: 460, tone: 1 }));
  }
  parts.push(PC.merge.apply(null, grid));

  var rx = -(CW / 2 + 0.155), rz = -(CW / 2 + 0.155);
  parts.push(PC.line({ a: [rx, PH, rz], b: [rx, TOP, rz], perUnit: 620, tone: 1 }));
  for (d = 500; d <= 6380; d += 500) {
    var ty = PH + d * S, major = (d % 1000 === 0), L = major ? 0.085 : 0.048;
    parts.push(PC.line({ a: [rx, ty, rz], b: [rx - L * 0.707, ty, rz - L * 0.707], perUnit: 560, tone: major ? 1 : 0.75 }));
  }
  // a leader from every segment boundary out to the rule
  boundaries.forEach(function (by) {
    parts.push(PC.line({ a: [-CW / 2, by, -CW / 2], b: [rx, by, rz], perUnit: 220, tone: 0.55 }));
  });
  parts.push(PC.line({ a: [-CW / 2, TOP, -CW / 2], b: [rx, TOP, rz], perUnit: 220, tone: 0.55 }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.09,
    tilt: [0.12, -0.62, 0],
    caption: 'What it costs to build one B200, stacked to scale: $2,900 of high-bandwidth memory in copper at the foot, $1,100 of CoWoS packaging, $1,000 of packaging yield loss drawn hollow because it ships nothing, $900 of logic die and $480 of board, power and test. About $6,400 in all, for a part that sells for thirty to forty thousand. The rule is graduated every $500.'
  };
});
