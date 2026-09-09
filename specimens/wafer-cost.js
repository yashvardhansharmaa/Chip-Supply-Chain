/* Specimen: a 300 mm wafer with its dies binned by outcome.
 * The wafer of `wafer.js`, but each die is drawn as good (a clean outline with a
 * little circuitry inside), failed (crossed out) or never printed at all (a faint
 * outline in the edge-exclusion ring). Failures cluster toward the rim, the way
 * defect density really behaves. One reticle-sized die in the centre is in copper.
 */
PC.register('wafer-cost', function (p) {
  var R = 1.0, thick = 0.035, top = thick / 2;
  var parts = [];

  // ---------- wafer body with its notch ----------
  function notch(c) {                            // bite a notch out of any cloud at +Z
    var out = [];
    for (var j = 0; j < c.length; j += 4) {
      var xx = c[j], zz = c[j + 2];
      if (Math.sqrt(xx * xx + (zz - R) * (zz - R)) < 0.075) continue;
      out.push(c[j], c[j + 1], c[j + 2], c[j + 3]);
    }
    return new Float32Array(out);
  }
  parts.push(notch(PC.cylinder({ r: R, h: thick, n: 36000, tone: 0.36 })));
  parts.push(PC.T(notch(PC.circle({ r: R, perUnit: 460, tone: 1 })), { pos: [0, top, 0] }));
  parts.push(PC.T(notch(PC.circle({ r: R, perUnit: 300, tone: 0.6 })), { pos: [0, -top, 0] }));
  // the notch's own two flanks, so the bite reads as a cut and not as a gap
  parts.push(PC.polyline({ pts: [[-0.062, top, 0.958], [0, top, 0.918], [0.062, top, 0.958]], perUnit: 460, tone: 1 }));
  parts.push(PC.polyline({ pts: [[-0.062, -top, 0.958], [0, -top, 0.918], [0.062, -top, 0.958]], perUnit: 300, tone: 0.6 }));

  // ---------- die grid: quarter-reticle dies, about 13 x 16.5 mm ----------
  var dw = 0.088, dh = 0.11;
  var rPrint = 0.955, rEdge = 0.985;             // printed inside rPrint; blanks out to rEdge
  var good = [], bad = [], blank = [], fill = [];
  var nGood = 0, nBad = 0, nBlank = 0;

  function rect(w, d) {
    return [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
  }

  var gx, gz;
  for (gx = -12; gx <= 12; gx++) for (gz = -10; gz <= 10; gz++) {
    var cx = gx * dw, cz = gz * dh;
    // the centre 2 x 2 block is the one big reticle-limited die, drawn separately
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) continue;
    var cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    var rMax = 0;
    for (var q = 0; q < 4; q++) rMax = Math.max(rMax, Math.sqrt(cor[q][0] * cor[q][0] + cor[q][1] * cor[q][1]));
    var rc = Math.sqrt(cx * cx + cz * cz);
    if (rMax > rPrint) {
      // in the edge-exclusion ring: the die was never printed
      if (rc > rEdge || rMax > rEdge + 0.06) continue;
      blank.push(PC.T(PC.polyline({ pts: rect(dw, dh), closed: true, perUnit: 165, tone: 0.42 }), { pos: [cx, top + 0.002, cz] }));
      nBlank++;
      continue;
    }
    good.push(PC.T(PC.polyline({ pts: rect(dw, dh), closed: true, perUnit: 300, tone: 0.9 }), { pos: [cx, top + 0.002, cz] }));
    // defect density rises toward the rim, so roughly a fifth of the wafer is lost
    var pFail = 0.05 + 0.38 * Math.pow(rc / R, 3);
    if (PC.rnd() < pFail) {
      var a = dw / 2 * 0.86, b = dh / 2 * 0.86;
      bad.push(PC.line({ a: [cx - a, top + 0.004, cz - b], b: [cx + a, top + 0.004, cz + b], perUnit: 360, tone: 1 }));
      bad.push(PC.line({ a: [cx - a, top + 0.004, cz + b], b: [cx + a, top + 0.004, cz - b], perUnit: 360, tone: 1 }));
      nBad++;
    } else {
      // a good die: a seal ring and a little circuitry inside, so "printed" reads
      // differently from the empty outlines out in the edge-exclusion ring
      fill.push(PC.T(PC.polyline({ pts: rect(dw * 0.66, dh * 0.7), closed: true, perUnit: 230, tone: 0.66 }), { pos: [cx, top + 0.003, cz] }));
      fill.push(PC.T(PC.dots({ nx: 3, nz: 4, sx: dw * 0.16, sz: dh * 0.15, per: 2, tone: 0.55 }), { pos: [cx, top + 0.003, cz] }));
      nGood++;
    }
  }
  parts.push(PC.merge.apply(null, good));
  parts.push(PC.merge.apply(null, fill));
  parts.push(PC.merge.apply(null, bad));
  parts.push(PC.merge.apply(null, blank));

  // ---------- the reticle-limited die in the centre: four small dies' worth of silicon ----------
  var bw = 2 * dw, bd = 2 * dh, bx = -dw / 2, bz = -dh / 2;
  var big = [], m;
  big.push(PC.T(PC.polyline({ pts: rect(bw, bd), closed: true, perUnit: 1100 }), { pos: [bx, top + 0.006, bz] }));
  big.push(PC.T(PC.polyline({ pts: rect(bw * 1.09, bd * 1.07), closed: true, perUnit: 420 }), { pos: [bx, top + 0.006, bz] }));
  // a floorplan of banded blocks, so the big die reads as denser than its neighbours
  for (m = 0; m < 9; m++) {
    var zz = bz + (m - 4) * bd * 0.096;
    big.push(PC.line({ a: [bx - bw * 0.42, top + 0.006, zz], b: [bx + bw * 0.42, top + 0.006, zz], perUnit: 460 }));
  }
  big.push(PC.T(PC.polyline({ pts: rect(bw * 0.86, bd * 0.9), closed: true, perUnit: 520 }), { pos: [bx, top + 0.006, bz] }));
  big.push(PC.line({ a: [bx, top + 0.006, bz - bd * 0.45], b: [bx, top + 0.006, bz + bd * 0.45], perUnit: 460 }));
  // corner registration ticks
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (s) {
    big.push(PC.line({ a: [bx + s[0] * bw * 0.62, top + 0.006, bz + s[1] * bd * 0.56], b: [bx + s[0] * bw * 0.52, top + 0.006, bz + s[1] * bd * 0.56], perUnit: 520 }));
    big.push(PC.line({ a: [bx + s[0] * bw * 0.56, top + 0.006, bz + s[1] * bd * 0.62], b: [bx + s[0] * bw * 0.56, top + 0.006, bz + s[1] * bd * 0.52], perUnit: 520 }));
  });
  parts.push(PC.accent(PC.merge.apply(null, big), 1));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.95, -0.4, 0],
    caption: 'The same 300 mm wafer, priced: ' + nGood + ' dies come out good, ' + nBad + ' are crossed out as failures clustering toward the rim, and ' + nBlank + ' places at the edge never got printed at all. The copper outline in the centre is a single reticle-limited die, four times the area and four times as likely to catch a defect.'
  };
});
