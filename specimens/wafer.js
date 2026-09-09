/* Specimen: a polished 300 mm wafer with its printed field grid.
 *
 * Reference example for the kit, and the first object a visitor meets, so it is
 * shaded rather than stippled flat: the front face carries a broad specular
 * band the way a mirror-polished wafer does under a cleanroom light, and the
 * rectilinear scribe grid is laid on top of it.
 *
 * Real proportions (SEMI M1): 300 mm across, 775 um thick, a single orientation
 * notch (no flat above 200 mm), about 3 mm of edge exclusion where no usable
 * die is printed, and a rounded bevel at the apex of the edge. One unit here is
 * 150 mm, so R = 1. Two things are drawn larger than life or they would be
 * invisible at 570 px: the thickness (x2.3) and the notch (x6).
 *
 * The exposure field is one full reticle, 26 x 33 mm, which is 0.173 x 0.220
 * units, and 57 whole fields fall inside the exclusion circle. One of them is
 * picked out in copper: that single field is the largest area a scanner can
 * print in one shot, and every chapter after this one is about getting a
 * pattern into it.
 */
PC.register('wafer', function (p) {
  var R = 1.0;                 // 150 mm
  var t = 0.012;               // drawn thickness (775 um is 0.005; x2.3 so the rim reads)
  var rEx = 0.980;             // edge exclusion: 3 mm in from the rim
  var rBead = 0.9875;          // edge-bead removal ring
  var nD = 0.040;              // notch depth, 1 mm x 6
  var fw = 26 / 150, fh = 33 / 150;   // one reticle field
  var parts = [];

  // ---------- helpers ----------
  function shade(c, fn) {
    var o = new Float32Array(c);
    for (var i = 0; i < o.length; i += 4) o[i + 3] = fn(o[i], o[i + 1], o[i + 2], o[i + 3]);
    return o;
  }
  function cut(c, drop) {                     // remove the notch wedge
    var keep = [], i;
    for (i = 0; i < c.length; i += 4) if (!drop(c[i], c[i + 2])) keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    return new Float32Array(keep);
  }
  function inNotch(x, z) { return z > (R - nD) + Math.abs(x) - 1e-6; }   // 90 degree V on +Z

  // The polish: one broad highlight band running across the face, plus a slight
  // darkening at the rim. Kept in a narrow tonal range so the grid still reads.
  function polish(x, z) {
    var u = x * 0.50 + z * 0.87;                       // distance along the light axis
    var band = Math.exp(-((u + 0.12) * (u + 0.12)) / 0.30);
    var r2 = x * x + z * z;
    return (0.115 + 0.365 * band) * (1 - 0.26 * r2 * r2 * r2 * r2);
  }

  // ---------- the wafer body ----------
  // front face, shaded
  parts.push(cut(shade(PC.disc({ r: R }), function (x, y, z) { return polish(x, z); }),
    inNotch));
  // back face: sparse, so the disc has a body without doubling the ink
  parts.push(PC.T(cut(PC.thin(PC.disc({ r: R, tone: 0.11 }), 0.30), inNotch), { pos: [0, -t, 0] }));
  // the bevelled apex of the edge, and the rim outline itself
  parts.push(cut(PC.lathe({
    profile: [[R - 0.009, -t], [R, -t * 0.35], [R, t * 0.35], [R - 0.009, 0]], tone: 0.5
  }), inNotch));
  parts.push(cut(PC.circle({ r: R, perUnit: 900, tone: 0.92 }), inNotch));
  parts.push(PC.T(cut(PC.circle({ r: R, perUnit: 420, tone: 0.4 }), inNotch), { pos: [0, -t, 0] }));

  // ---------- the notch ----------
  // a 90 degree V, outlined top and bottom, with its two walls
  [[0, 1], [-t, 0.55]].forEach(function (lv) {
    parts.push(PC.polyline({
      pts: [[-nD, lv[0], R], [0, lv[0], R - nD], [nD, lv[0], R]],
      perUnit: 1600, tone: lv[1]
    }));
  });
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.plane({ w: 0.0016, d: nD * 1.42, tone: 0.55 }),
      { rot: [Math.PI / 2, s * Math.PI / 4, 0], pos: [s * nD / 2, -t / 2, R - nD / 2] }));
  });

  // ---------- edge exclusion ----------
  parts.push(cut(PC.circle({ r: rEx, perUnit: 760, tone: 0.92 }), inNotch));
  parts.push(cut(PC.circle({ r: rBead, perUnit: 380, tone: 0.55 }), inNotch));

  // ---------- the scribe grid: continuous streets clipped to the exclusion circle ----------
  var yTop = 0.0016, gx, gz, half;
  for (gx = -8; gx <= 8; gx++) {
    var x = (gx + 0.5) * fw;
    if (Math.abs(x) >= rEx) continue;
    half = Math.sqrt(rEx * rEx - x * x);
    parts.push(PC.line({ a: [x, yTop, -half], b: [x, yTop, half], perUnit: 760, tone: 1 }));
  }
  for (gz = -5; gz <= 5; gz++) {
    var z = (gz + 0.5) * fh;
    if (Math.abs(z) >= rEx) continue;
    half = Math.sqrt(rEx * rEx - z * z);
    parts.push(PC.line({ a: [-half, yTop, z], b: [half, yTop, z], perUnit: 760, tone: 1 }));
  }

  // ---------- seal rings inside every whole field (the second line weight) ----------
  var whole = 0, accentCell = null, ins = 0.10;
  for (gx = -8; gx <= 8; gx++) for (gz = -5; gz <= 5; gz++) {
    var cx = gx * fw, cz = gz * fh, ok = true;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      var px = cx + q[0] * fw / 2, pz = cz + q[1] * fh / 2;
      if (px * px + pz * pz > rEx * rEx) ok = false;
    });
    if (!ok) continue;
    whole++;
    if (gx === 1 && gz === 0) { accentCell = [cx, cz]; continue; }
    parts.push(PC.polyline({
      pts: [[cx - fw * (0.5 - ins), yTop, cz - fh * (0.5 - ins)],
            [cx + fw * (0.5 - ins), yTop, cz - fh * (0.5 - ins)],
            [cx + fw * (0.5 - ins), yTop, cz + fh * (0.5 - ins)],
            [cx - fw * (0.5 - ins), yTop, cz + fh * (0.5 - ins)]],
      closed: true, perUnit: 340, tone: 0.62
    }));
  }

  // ---------- one field in copper: the largest pattern a scanner prints at once ----------
  if (accentCell) {
    var ax = accentCell[0], az = accentCell[1];
    parts.push(PC.T(PC.accent(PC.plane({ w: fw * 0.82, d: fh * 0.86, n: 1900 }), 0.42),
      { pos: [ax, yTop + 0.0007, az] }));
    // a hint of the floorplan inside the one field the reader is meant to look into
    for (var q = -3; q <= 3; q++) {
      parts.push(PC.T(PC.accent(PC.line({
        a: [-fw * 0.41, 0, q * fh * 0.115], b: [fw * 0.41, 0, q * fh * 0.115], perUnit: 420
      }), 0.85), { pos: [ax, yTop + 0.0009, az] }));
    }
    parts.push(PC.T(PC.accent(PC.line({
      a: [0, 0, -fh * 0.42], b: [0, 0, fh * 0.42], perUnit: 420
    }), 0.85), { pos: [ax, yTop + 0.0009, az] }));
    parts.push(PC.T(PC.accent(PC.polyline({
      pts: [[-fw / 2, 0, -fh / 2], [fw / 2, 0, -fh / 2], [fw / 2, 0, fh / 2], [-fw / 2, 0, fh / 2]],
      closed: true, perUnit: 620
    }), 1), { pos: [ax, yTop + 0.0012, az] }));
  }

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.92, -0.5, 0],
    caption: 'A polished 300 mm wafer, ruled by the scribe streets between exposure fields. ' +
      whole + ' whole 26 by 33 mm fields fall inside the edge-exclusion ring; ' +
      'the copper one is a single reticle field, the largest pattern a scanner can print in one shot. ' +
      'The V at the rim is the orientation notch, drawn six times its real size.'
  };
});
