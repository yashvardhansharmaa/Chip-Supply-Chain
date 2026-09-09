/* Specimen: a Czochralski silicon ingot and the wafers cut from it.
 *
 * Units are metres. A 300 mm production boule is about 2 m of crystal and
 * weighs a little over a quarter of a tonne: here the cylindrical body is
 * 1.5 m of 300 mm, the crown that opens out to full diameter is 0.33 m, and
 * the cropped tail is 0.30 m, which is 2.13 m of silicon in all. All of it
 * hangs from the seed by a neck about 10 mm across - the one proportion in
 * this drawing that people refuse to believe.
 *
 * The body is shaded rather than stippled flat: a ground and lapped ingot is a
 * mirror cylinder, so the ink thins toward the lit side and thickens into the
 * shadow, with the growth striations ringing it faintly. The crown is left
 * as-grown, with the four facet ridges that run down a <100> crystal.
 *
 * Beside the foot of the ingot: five wafers stacked at cassette pitch and one
 * standing on its rim in copper. The standing wafer is exactly as wide as the
 * ingot, which is the whole point of growing the crystal to 300 mm.
 */
PC.register('boule-and-wafer', function (p) {
  var R = 0.15, bx = -0.24;
  var yTip = -0.75, yB0 = -0.45, yB1 = 1.05;        // tail 0.30 m, body 1.50 m
  var yCr = 1.38, yNk = 1.53, ySd = 1.61, yCh = 1.665, yRod = 1.75;
  var parts = [], i, y, a;

  // ---------- shading: treat every surface of revolution as a lit cylinder ----------
  var LX = -0.60, LZ = 0.80;                        // light from the front left
  function lit(c, cx, cz, amp) {
    var o = new Float32Array(c);
    for (var j = 0; j < o.length; j += 4) {
      var dx = o[j] - cx, dz = o[j + 2] - cz, m = Math.sqrt(dx * dx + dz * dz) || 1;
      var lam = (dx / m) * LX + (dz / m) * LZ;      // -1 shadow .. +1 lit
      var f = 1 - amp * lam;
      if (lam > 0.72) f *= 1 - 0.55 * (lam - 0.72) / 0.28;   // the specular streak
      o[j + 3] = Math.max(0.04, Math.min(1, o[j + 3] * f));
    }
    return o;
  }
  function atB(c) { return PC.T(c, { pos: [bx, 0, 0] }); }

  // ---------- tail: a concave taper cropped to a small flat ----------
  var tail = [[0.021, yTip], [0.058, yTip + 0.055], [0.092, yTip + 0.115],
              [0.119, yTip + 0.175], [0.138, yTip + 0.240], [R, yB0]];
  parts.push(atB(lit(PC.lathe({ profile: tail, tone: 0.30 }), 0, 0, 0.45)));
  parts.push(atB(PC.T(PC.disc({ r: 0.021, tone: 0.5 }), { pos: [0, yTip, 0] })));
  for (i = 1; i <= 4; i++) {
    parts.push(atB(PC.T(PC.circle({ r: tail[i][0] * 1.004, perUnit: 190, tone: 0.5 }), { pos: [0, tail[i][1], 0] })));
  }

  // ---------- body: 1.5 m of ground 300 mm cylinder ----------
  parts.push(atB(PC.T(lit(PC.cylinder({ r: R, h: yB1 - yB0, caps: false, n: 17000, tone: 0.34 }), 0, 0, 0.5),
    { pos: [0, (yB0 + yB1) / 2, 0] })));
  // growth striations, faint and evenly spaced
  for (i = 0; i <= 22; i++) {
    y = yB0 + 0.03 + (yB1 - yB0 - 0.06) * i / 22;
    parts.push(atB(PC.T(lit(PC.circle({ r: R * 1.003, perUnit: 150, tone: 0.30 }), 0, 0, 0.5), { pos: [0, y, 0] })));
  }
  // the two ends of the cylinder, drawn hard
  parts.push(atB(PC.T(PC.circle({ r: R * 1.004, perUnit: 620, tone: 0.95 }), { pos: [0, yB1, 0] })));
  parts.push(atB(PC.T(PC.circle({ r: R * 1.004, perUnit: 380, tone: 0.7 }), { pos: [0, yB0, 0] })));

  // ---------- crown: as-grown, with the four <100> facet ridges ----------
  var crown = [[R, yB1], [0.1495, 1.09], [0.1468, 1.13], [0.1400, 1.17], [0.1285, 1.21],
               [0.1125, 1.25], [0.0925, 1.285], [0.0685, 1.315], [0.0425, 1.345],
               [0.0205, 1.368], [0.0075, yCr]];
  parts.push(atB(lit(PC.lathe({ profile: crown, tone: 0.32 }), 0, 0, 0.45)));
  for (i = 0; i < 4; i++) {
    a = Math.PI / 4 + i * Math.PI / 2;
    parts.push(atB(PC.polyline({
      pts: crown.map(function (q) { return [q[0] * 1.006 * Math.cos(a), q[1], q[0] * 1.006 * Math.sin(a)]; }),
      perUnit: 260, tone: 0.55
    })));
  }
  [2, 5, 8].forEach(function (k) {
    parts.push(atB(PC.T(PC.circle({ r: crown[k][0] * 1.006, perUnit: 220, tone: 0.6 }), { pos: [0, crown[k][1], 0] })));
  });

  // ---------- neck, seed and the puller above it ----------
  parts.push(PC.T(PC.cylinder({ r: 0.0052, h: yNk - yCr, caps: false, n: 900, tone: 0.8 }),
    { pos: [bx, (yCr + yNk) / 2, 0] }));
  parts.push(PC.T(PC.box({ w: 0.014, h: ySd - yNk, d: 0.014, n: 500, tone: 0.45 }), { pos: [bx, (yNk + ySd) / 2, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: 0.014, h: ySd - yNk, d: 0.014, perUnit: 700, tone: 1 }), { pos: [bx, (yNk + ySd) / 2, 0] }));
  parts.push(PC.T(lit(PC.cylinder({ r: 0.024, h: yCh - ySd, n: 900, tone: 0.4 }), 0, 0, 0.45), { pos: [bx, (ySd + yCh) / 2, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.0245, perUnit: 420, tone: 1 }), { pos: [bx, yCh, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.0245, perUnit: 420, tone: 1 }), { pos: [bx, ySd, 0] }));
  parts.push(PC.T(lit(PC.cylinder({ r: 0.011, h: yRod - yCh, caps: false, n: 500, tone: 0.45 }), 0, 0, 0.45), { pos: [bx, (yCh + yRod) / 2, 0] }));

  // ---------- five wafers stacked at cassette pitch ----------
  var sx = 0.40, sz = 0.10, pitch = 0.012, y0 = yTip + 0.004;
  for (i = 0; i < 5; i++) {
    y = y0 + i * pitch;
    parts.push(PC.T(PC.disc({ r: R, n: 2200, tone: 0.13 }), { pos: [sx, y + 0.0016, sz] }));
    parts.push(PC.T(lit(PC.cylinder({ r: R, h: 0.0032, caps: false, n: 500, tone: 0.42 }), 0, 0, 0.5), { pos: [sx, y, sz] }));
    parts.push(PC.T(PC.circle({ r: R, perUnit: 260, tone: 0.8 }), { pos: [sx, y + 0.0016, sz] }));
  }

  // ---------- one wafer standing on its rim, in copper ----------
  var lean = 0.16, wr = R;
  var wafer = PC.merge(
    PC.T(PC.accent(PC.disc({ r: wr, n: 5200, tone: 1 }), 0.24), { pos: [0, 0.0016, 0] }),
    PC.accent(PC.cylinder({ r: wr, h: 0.0032, caps: false, n: 700, tone: 1 }), 0.7),
    PC.T(PC.accent(PC.circle({ r: wr, perUnit: 620 }), 1), { pos: [0, 0.0016, 0] }),
    PC.T(PC.accent(PC.circle({ r: wr * 0.98, perUnit: 200 }), 0.5), { pos: [0, 0.0018, 0] })
  );
  var keep = [];                                             // the orientation notch
  for (i = 0; i < wafer.length; i += 4) {
    var dx = wafer[i], dz = wafer[i + 2];
    if (dz > wr - 0.010 + Math.abs(dx)) continue;
    keep.push(wafer[i], wafer[i + 1], wafer[i + 2], wafer[i + 3]);
  }
  parts.push(PC.T(new Float32Array(keep), {
    rot: [0, 0.55, -(Math.PI / 2 - lean)],
    pos: [0.30, yTip + wr * Math.cos(lean) + 0.002, 0.30]
  }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.075,
    tilt: [0.16, -0.62, 0],
    caption: 'A Czochralski silicon ingot: 2.1 m of one unbroken crystal, about 265 kg of it, ' +
      'hanging from a seed on a neck 10 mm across. Below the seed is the neck, then the crown ' +
      'where the crystal opens out to 300 mm, then 1.5 m of ground body ringed with growth ' +
      'striations, then the cropped tail. At its foot are wafers sawn from that body, one ' +
      'standing on its rim in copper - exactly as wide as the ingot it came from.'
  };
});
