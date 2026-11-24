/* =====================================================================================================
   12 Test: a vertical probe card over a wafer, in the units of specimens/probe-card.js (the wafer 1 unit in radius,
   150 mm). The card, its space transformer and its probe head of needles come apart over the wafer. Heights and the gap
   are exaggerated, as the caption says.
   22 Nov 2026 review: the dies are 26 x 33 mm, the largest field a scanner prints (ASML, chapters 1 and 10); they were
   30 x 36.75 mm. The needles stand in ordered rows of equal length, a few rows standing for thousands (the caption says
   so); they were a random bowed tangle. The card's rim ticks, which read as a dial, are gone. The card's size (305 mm in
   the old file) has no allowed source and carries no figure. Colours (the set's legend): the wafer in silicon slate, the
   four dies under the needles in a deeper slate.
   24 Nov 2026 expert accuracy review (D4): a vertical probe card on an AI processor lands on an area array of bumps across the
   die's face (FormFactor), so the needles stand in a sparse grid across each die, four columns by five rows, where they stood
   in a row along each long edge, which reads as a perimeter-pad chip. */
R('probe-card', function (m) {
  var Rw = 1.0, Rc = 1.02, Rch = 1.08, tW = 0.028, wT = tW / 2, dw = 26 / 150, dh = 33 / 150;
  var yLo = wT + 0.082, tG = 0.02, yLoT = yLo + tG, yUp = yLoT + 0.082, yUpT = yUp + tG, stH = 0.10, yST = yUpT + 0.052, stW = 0.5, tP = 0.052, pB = yST + stH + 0.03, pT = pB + tP;
  var ch = m.part('chuck', { ex: [0, -0.10, 0], seq: 0 });
  m.cyl([0, -wT - 0.065, 0], Rch, 0.13, 'turned', { seg: 64, top: [0.42, 0.68, 0.94, 1.06].map(function (r) { return D.circle(0, 0, r, 0.065, 64, { lw: 0.4, alpha: 0.6 }); }) });
  var wf = m.part('wafer', { ex: [0, 0, 0], seq: 1 });
  var shape = []; for (var k = 0; k < 96; k++) { var a = k * TAU / 96; if (k === 24) { shape.push([0.05, 0.998]); shape.push([0, 0.96]); shape.push([-0.05, 0.998]); continue; } shape.push([Rw * Math.cos(a), Rw * Math.sin(a)]); }
  var dies = [], probed = [];
  for (var gx = -6; gx <= 5; gx++) for (var gz = -5; gz <= 4; gz++) {
    var cx = (gx + 0.5) * dw, cz = (gz + 0.5) * dh, cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < 0.96; })) continue;
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) { probed.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { fill: 'accDark', lw: 0.6, col: 'acc', keep: true, tag: 'dies' })); continue; }
    dies.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { lw: 0.4, alpha: 0.7 }));
  }
  m.prism(shape, -wT, wT, 'accLight', { smooth: true, top: dies.concat(probed) });
  // the probe head: two guide plates and the needles bowed between them
  var hd = m.part('head', { ex: [0, 0.34, 0], seq: 2 });
  [yLo, yUp].forEach(function (y) { m.box({ c: [0, y + tG / 2, 0], s: [0.4, tG, 0.4] }, 'mid'); });
  // the needles: on each die, a sparse grid across its face, where an AI chip's bumps are, a few standing for thousands; each
  // needle the same length, bowed the same way between the guide plates, as a vertical probe's needle is
  m.tag('needles');
  for (gx = -1; gx <= 0; gx++) for (gz = -1; gz <= 0; gz++) {
    var ox = (gx + 0.5) * dw, oz = (gz + 0.5) * dh;
    [-0.36, -0.12, 0.12, 0.36].forEach(function (fx) {
      [-0.36, -0.18, 0, 0.18, 0.36].forEach(function (fz) {
        var qx = ox + dw * fx, qz = oz + dh * fz, bo = 0.012;
        m.wire([[qx, wT + 0.004, qz], [qx, yLo + tG * 0.4, qz], [qx + bo, (yLoT + yUp) / 2, qz], [qx, yUp + tG * 0.6, qz], [qx, yUpT + 0.004, qz]], { lw: 0.6, alpha: 0.85 });
      });
    });
  }
  m.tag(null);
  // the space transformer: multi-layer ceramic
  var st = m.part('transformer', { ex: [0, 0.66, 0], seq: 3 });
  var lines = []; for (k = 1; k < 7; k++) lines.push(-stH / 2 + stH * k / 7);
  var side = function (face) { return lines.map(function (y) { var p = face === 'pz' ? [[-stW / 2, y, stW / 2], [stW / 2, y, stW / 2]] : face === 'px' ? [[stW / 2, y, -stW / 2], [stW / 2, y, stW / 2]] : face === 'nx' ? [[-stW / 2, y, -stW / 2], [-stW / 2, y, stW / 2]] : [[-stW / 2, y, -stW / 2], [stW / 2, y, -stW / 2]]; return { pts: p, lw: 0.4, alpha: 0.8 }; }); };
  m.box({ c: [0, yST + stH / 2, 0], s: [stW, stH, stW], decals: { pz: side('pz'), px: side('px'), nx: side('nx'), nz: side('nz'), py: [{ dots: H.gridPts(13, 13, stW * 0.07, stW * 0.07, stH / 2, 0, 0), r: 0.9, alpha: 0.75 }] } }, 'light');
  // the printed circuit board and the stiffener over it
  var pc = m.part('card', { ex: [0, 1.12, 0], seq: 4, mode: 'stack' });
  var pads = [];
  [[0.56, 72], [0.66, 84], [0.76, 96]].forEach(function (r) { var d = []; for (var i = 0; i < r[1]; i++) { var aa = i * TAU / r[1]; d.push([r[0] * Math.cos(aa), tP / 2, r[0] * Math.sin(aa)]); } pads.push({ dots: d, r: 1.1, ring: true, alpha: 0.85 }); });
  m.cyl([0, pB + tP / 2, 0], Rc, tP, 'turned', { seg: 72, top: pads });
  [0, Math.PI / 2].forEach(function (ang) { m.box({ c: [0, pT + 0.025, 0], s: [1.72, 0.05, 0.105], rot: [0, ang, 0] }, 'mid'); });
  m.cyl([0, pT + 0.0375, 0], 0.2, 0.075, 'turnedDark', { seg: 32 });
  for (var i = 0; i < 3; i++) { var la = i * TAU / 3 + 0.4; m.cyl([0.30 * Math.cos(la), pT + 0.0525, 0.30 * Math.sin(la)], 0.036, 0.105, 'turned', { seg: 14 }); }
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * 0.2, wT, c[1] * 0.2, wf.idx], [c[0] * 0.2, yLo, c[1] * 0.2, hd.idx]], { alpha: 0.8 });
    m.guide([[c[0] * 0.2, yUpT, c[1] * 0.2, hd.idx], [c[0] * stW / 2, yST, c[1] * stW / 2, st.idx]], { alpha: 0.8 });
    m.guide([[c[0] * stW / 2, yST + stH, c[1] * stW / 2, st.idx], [c[0] * stW / 2, pB, c[1] * stW / 2, pc.idx]], { alpha: 0.8 });
  });
  m.guide([[0, -0.3, 0, ch.idx], [0, pT + 0.2, 0, pc.idx]], { style: 'axis', alpha: 0.8 });
  m.callout([0.62, pT, -0.3, pc.idx], 'Probe card', { side: 'r' });
  m.callout([-dw * 0.38 + 0.012, (yLoT + yUp) / 2, 0.5 * dh, hd.idx], 'Needles', { side: 'l', tag: 'needles' });
  m.callout([-0.62, wT, 0.72, wf.idx], 'Wafer', { side: 'l' });
  m.callout([dw * 0.5, wT, dh * 0.5 + 0.04, wf.idx], 'Dies under test', { side: 'r', tag: 'dies' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [111, 139, 166], accentDark: [195, 211, 226] };
});
