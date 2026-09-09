/* Specimen: the floorplan of a GPU die, seen from above.
 *
 * Units are millimetres. The die is 26 x 33 mm, which is one full reticle
 * field - the largest area a scanner can print in a single exposure, and the
 * reason the biggest accelerators are built from two dies rather than one.
 *
 * The arrangement follows Nvidia's published GH100 block diagram:
 *   - 144 streaming multiprocessors in 8 graphics processing clusters, four
 *     above the cache band and four below, 18 tiles each;
 *   - the L2 cache split into two partitions in a band across the middle,
 *     with the crossbar between them;
 *   - twelve memory controllers and their HBM PHYs down the two long edges,
 *     two controllers per HBM stack, three stacks a side;
 *   - the PCI Express host interface and the scheduler across one short edge,
 *     with a row of NVLink ports inside it;
 *   - on a two-die part the other short edge carries the die-to-die interface
 *     instead, so a sliver of the neighbouring die is drawn beyond it.
 *
 * The die-to-die interface is the copper strip: thousands of contacts at a few
 * microns' pitch, carrying about 10 TB/s, doing the job the reticle limit
 * stopped a single piece of silicon from doing.
 */
PC.register('die-floorplan', function (p) {
  var W = 26, D = 33, T = 0.75;                 // one reticle field
  var yTop = T / 2 + 0.02, parts = [];
  function add(c) { parts.push(c); }
  function fill(x0, z0, x1, z1, n, tn) {
    return PC.T(PC.plane({ w: x1 - x0, d: z1 - z0, n: n, tone: tn }),
      { pos: [(x0 + x1) / 2, yTop, (z0 + z1) / 2] });
  }
  function rect(x0, z0, x1, z1, per, tn) {
    return PC.polyline({
      pts: [[x0, yTop, z0], [x1, yTop, z0], [x1, yTop, z1], [x0, yTop, z1]],
      closed: true, perUnit: per, tone: tn
    });
  }
  function hline(x0, x1, z, per, tn) { return PC.line({ a: [x0, yTop, z], b: [x1, yTop, z], perUnit: per, tone: tn }); }
  function vline(x, z0, z1, per, tn) { return PC.line({ a: [x, yTop, z0], b: [x, yTop, z1], perUnit: per, tone: tn }); }

  // ---------- the slab ----------
  add(PC.T(PC.box({ w: W, h: T, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 2600, tone: 0.22 }), { pos: [0, 0, 0] }));
  add(fill(-W / 2, -D / 2, W / 2, D / 2, 13000, 0.10));            // the field between blocks
  add(rect(-W / 2, -D / 2, W / 2, D / 2, 46, 1));                  // die edge
  add(rect(-W / 2 + 0.30, -D / 2 + 0.30, W / 2 - 0.30, D / 2 - 0.30, 22, 0.55));   // seal ring

  // ---------- memory: 6 controllers and their HBM PHY down each long edge ----------
  var phyW = 2.5, mcW = 1.5;
  [-1, 1].forEach(function (s) {
    var xa = s * (W / 2 - phyW), xb = s * (W / 2 - 0.78);          // PHY, hard against the edge
    for (var m = 0; m < 6; m++) {
      var z0 = -13.6 + m * 4.55, z1 = z0 + 4.1;
      add(fill(Math.min(xa, xb), z0, Math.max(xa, xb), z1, 620, 0.34));
      add(rect(Math.min(xa, xb), z0, Math.max(xa, xb), z1, 30, 0.95));
      for (var k = 1; k <= 7; k++) {                               // the PHY's repeated lanes
        add(hline(Math.min(xa, xb) + 0.12, Math.max(xa, xb) - 0.12, z0 + (z1 - z0) * k / 8, 22, 0.42));
      }
      // the memory controller, inboard of the PHY
      var xc = s * (W / 2 - phyW - 0.25), xd = s * (W / 2 - phyW - 0.25 - mcW);
      add(fill(Math.min(xc, xd), z0 + 0.2, Math.max(xc, xd), z1 - 0.2, 240, 0.22));
      add(rect(Math.min(xc, xd), z0 + 0.2, Math.max(xc, xd), z1 - 0.2, 22, 0.7));
    }
  });

  // ---------- 8 GPCs of 18 SM tiles, four above the cache band and four below ----------
  var cx0 = -9.5, cx1 = 9.5;                     // compute region in x
  var gcW = (cx1 - cx0) / 4, gcD = 10.4;
  var bands = [[3.5, 13.9], [-13.9, -3.5]];
  bands.forEach(function (bz) {
    for (var g = 0; g < 4; g++) {
      var gx0 = cx0 + g * gcW + 0.22, gx1 = cx0 + (g + 1) * gcW - 0.22;
      add(rect(gx0, bz[0], gx1, bz[1], 34, 1));                    // GPC outline
      var tw = (gx1 - gx0 - 0.5) / 3, td = (gcD - 0.7) / 6;
      for (var a = 0; a < 3; a++) for (var b = 0; b < 6; b++) {
        var sx0 = gx0 + 0.25 + a * tw + 0.10, sx1 = gx0 + 0.25 + (a + 1) * tw - 0.10;
        var sz0 = bz[0] + 0.35 + b * td + 0.10, sz1 = bz[0] + 0.35 + (b + 1) * td - 0.10;
        add(fill(sx0, sz0, sx1, sz1, 46, 0.26));                   // SM tile
        add(rect(sx0, sz0, sx1, sz1, 24, 0.88));
        for (var q = 1; q <= 3; q++) {                             // the SM's own rows
          add(hline(sx0 + 0.08, sx1 - 0.08, sz0 + (sz1 - sz0) * q / 4, 17, 0.40));
        }
      }
    }
  });

  // ---------- L2 cache: two partitions and the crossbar between them ----------
  [[-9.5, -0.55], [0.55, 9.5]].forEach(function (lx) {
    add(fill(lx[0], -2.7, lx[1], 2.7, 900, 0.30));
    add(rect(lx[0], -2.7, lx[1], 2.7, 34, 1));
    for (var k = 1; k <= 11; k++) add(hline(lx[0] + 0.15, lx[1] - 0.15, -2.7 + 5.4 * k / 12, 24, 0.44));
  });
  add(fill(-0.45, -2.7, 0.45, 2.7, 200, 0.5));                     // crossbar
  add(rect(-0.45, -2.7, 0.45, 2.7, 26, 0.8));
  [-1, 1].forEach(function (s) {                                   // cache to memory
    for (var k = -2; k <= 2; k++) add(hline(s * 9.5, s * (W / 2 - phyW - 1.9), k * 1.05, 26, 0.5));
  });

  // ---------- host edge: PCI Express, the scheduler, and a row of NVLink ports ----------
  add(fill(-11.4, 14.35, 11.4, 16.05, 900, 0.32));
  add(rect(-11.4, 14.35, 11.4, 16.05, 32, 1));
  for (var k = -5; k <= 5; k++) add(vline(k * 2.0, 14.45, 15.95, 22, 0.42));
  add(fill(-11.4, 14.0, 11.4, 14.2, 260, 0.5));                    // scheduler strip
  add(rect(-11.4, 14.0, 11.4, 14.2, 26, 0.85));
  for (var n = 0; n < 9; n++) {                                    // NVLink ports
    var nx = -10.4 + n * 2.6;
    add(fill(nx, 12.15, nx + 2.0, 13.5, 150, 0.3));
    add(rect(nx, 12.15, nx + 2.0, 13.5, 26, 0.85));
  }

  // ---------- the die-to-die interface, and a sliver of the die it faces ----------
  var d0 = -16.15, d1 = -14.25;
  add(PC.accent(fill(-11.9, d0, 11.9, d1, 3400, 1), 0.30));        // the micro-bump field
  add(PC.accent(rect(-11.9, d0, 11.9, d1, 40, 1), 1));
  for (var k2 = 0; k2 < 24; k2++) {
    add(PC.accent(vline(-11.6 + k2 * 1.0, d0 + 0.18, d1 - 0.18, 26, 1), 0.75));
  }
  add(PC.accent(hline(-11.9, 11.9, -13.85, 30, 1), 0.55));         // the bus behind it
  // the neighbouring die, cut off: its edge, its own interface and one row of tiles
  var nz1 = -D / 2 - 0.35, nz0 = nz1 - 2.3;
  add(fill(-W / 2, nz0, W / 2, nz1, 800, 0.08));
  add(rect(-W / 2, nz0, W / 2, nz1, 34, 0.55));
  add(PC.accent(fill(-11.9, nz1 - 1.85, 11.9, nz1, 1400, 1), 0.22));
  add(PC.accent(rect(-11.9, nz1 - 1.85, 11.9, nz1, 26, 1), 0.6));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [1.02, -0.32, 0],
    caption: 'The floorplan of a GPU die: 26 by 33 mm, one whole reticle field. ' +
      '144 compute tiles sit in eight clusters, four above the L2 cache band and four below; ' +
      'twelve memory controllers and their HBM PHYs run down the two long edges; the PCI Express ' +
      'interface and the NVLink ports fill one short edge. The copper strip on the other short edge is ' +
      'the die-to-die interface, and the sliver past it is the edge of the die it talks to.'
  };
});
