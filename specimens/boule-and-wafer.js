/* Specimen: a Czochralski silicon ingot and the wafers cut from it.
 * Units are metres. Top to bottom: the pull rod and clamp, a square seed
 * crystal, a thin neck, the flared crown, 1.5 m of 300 mm body carrying faint
 * growth striations and the four facet lines that run down a <100> ingot, and
 * the cropped tail cone. Beside it: one wafer standing on edge (accent) and a
 * short stack of wafers lying flat.
 */
PC.register('boule-and-wafer', function (p) {
  var R = 0.15;                                       // 300 mm diameter
  var yTip = -1.05, yBody0 = -0.85, yBody1 = 0.65;    // 0.2 m tail cone, 1.5 m body
  var yCrown1 = 0.803, yNeck1 = 1.000, ySeed1 = 1.090, yClamp1 = 1.126;
  var bx = -0.30;                                     // boule centre on X
  var parts = [], i, y, a;

  // ---------- tail cone ----------
  parts.push(PC.T(PC.cone({ r1: 0, r2: R, h: yBody0 - yTip, n: 3000, tone: 0.34 }),
    { pos: [bx, (yTip + yBody0) / 2, 0] }));
  for (i = 1; i <= 3; i++) {
    parts.push(PC.T(PC.circle({ r: R * i / 3.6, perUnit: 150, tone: 0.5 }), { pos: [bx, yTip + 0.055 * i, 0] }));
  }

  // ---------- body ----------
  parts.push(PC.T(PC.cylinder({ r: R, h: yBody1 - yBody0, caps: false, n: 22000, tone: 0.30 }),
    { pos: [bx, (yBody0 + yBody1) / 2, 0] }));
  // growth striations: faint rings, spaced well clear of each other
  for (i = 0; i <= 14; i++) {
    y = yBody0 + 0.02 + (yBody1 - yBody0 - 0.04) * i / 14;
    parts.push(PC.T(PC.circle({ r: R * 1.002, perUnit: 170, tone: 0.45 }), { pos: [bx, y, 0] }));
  }
  // the four flat facets that run the length of a <100> ingot
  for (i = 0; i < 4; i++) {
    a = Math.PI / 4 + i * Math.PI / 2;
    parts.push(PC.line({
      a: [bx + R * 1.004 * Math.cos(a), yBody0, R * 1.004 * Math.sin(a)],
      b: [bx + R * 1.004 * Math.cos(a), yBody1, R * 1.004 * Math.sin(a)],
      perUnit: 220, tone: 0.7
    }));
  }
  // where the body is cropped and sliced: four kerf rings above the tail
  for (i = 0; i < 4; i++) {
    parts.push(PC.T(PC.circle({ r: R * 1.008, perUnit: 240, tone: 0.9 }), { pos: [bx, yBody0 + 0.035 + i * 0.042, 0] }));
  }

  // ---------- crown, neck, seed ----------
  parts.push(PC.T(PC.lathe({
    profile: [[R, yBody1], [0.146, 0.686], [0.135, 0.716], [0.117, 0.742], [0.093, 0.764],
              [0.064, 0.782], [0.034, 0.795], [0.018, yCrown1]],
    tone: 0.42
  }), { pos: [bx, 0, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.135, perUnit: 200, tone: 0.6 }), { pos: [bx, 0.716, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.064, perUnit: 260, tone: 0.75 }), { pos: [bx, 0.782, 0] }));
  parts.push(PC.T(PC.cylinder({ r: 0.016, h: yNeck1 - yCrown1, caps: false, n: 1100, tone: 0.85 }),
    { pos: [bx, (yCrown1 + yNeck1) / 2, 0] }));
  // seed crystal: a small square-section rod held in a clamp
  parts.push(PC.T(PC.box({ w: 0.050, h: ySeed1 - yNeck1, d: 0.050, n: 1300, tone: 0.6 }),
    { pos: [bx, (yNeck1 + ySeed1) / 2, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: 0.050, h: ySeed1 - yNeck1, d: 0.050, perUnit: 460, tone: 1 }),
    { pos: [bx, (yNeck1 + ySeed1) / 2, 0] }));
  parts.push(PC.T(PC.box({ w: 0.125, h: yClamp1 - ySeed1, d: 0.058, n: 1100, tone: 0.5 }),
    { pos: [bx, (ySeed1 + yClamp1) / 2, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: 0.125, h: yClamp1 - ySeed1, d: 0.058, perUnit: 420, tone: 1 }),
    { pos: [bx, (ySeed1 + yClamp1) / 2, 0] }));
  parts.push(PC.T(PC.cylinder({ r: 0.011, h: 0.07, caps: false, n: 420, tone: 0.7 }), { pos: [bx, yClamp1 + 0.035, 0] }));

  // ---------- one wafer standing on edge, leaning back (accent) ----------
  var lean = 0.13;
  var wafer = PC.merge(
    PC.T(PC.accent(PC.disc({ r: R, n: 2400, tone: 1 }), 0.30), { pos: [0, 0.005, 0] }),
    PC.accent(PC.cylinder({ r: R, h: 0.010, caps: false, n: 800, tone: 1 }), 0.75),
    PC.T(PC.accent(PC.circle({ r: R, perUnit: 420 }), 1), { pos: [0, 0.005, 0] }),
    PC.T(PC.accent(PC.circle({ r: R, perUnit: 300 }), 0.8), { pos: [0, -0.005, 0] }),
    PC.T(PC.accent(PC.circle({ r: R * 0.80, perUnit: 200 }), 0.55), { pos: [0, 0.005, 0] })
  );
  var keep = [];                                       // notch at the wafer edge
  for (i = 0; i < wafer.length; i += 4) {
    var dx = wafer[i], dz = wafer[i + 2];
    if (Math.sqrt(dx * dx + (dz - R) * (dz - R)) < 0.020) continue;
    keep.push(wafer[i], wafer[i + 1], wafer[i + 2], wafer[i + 3]);
  }
  parts.push(PC.T(new Float32Array(keep), {
    rot: [0, 0.9, -(Math.PI / 2 - lean)],
    pos: [0.44, yTip + R * Math.cos(lean) + 0.008, -0.13]
  }));

  // ---------- a short stack of wafers lying flat ----------
  var sx = 0.40, sz = 0.24, pitch = 0.023;
  for (i = 0; i < 5; i++) {
    y = yTip + 0.008 + i * pitch;
    parts.push(PC.T(PC.cylinder({ r: R, h: 0.009, caps: false, n: 210, tone: 0.4 }), { pos: [sx, y, sz] }));
    parts.push(PC.T(PC.circle({ r: R, perUnit: 170, tone: 1 }), { pos: [sx, y + 0.0045, sz] }));
    parts.push(PC.T(PC.circle({ r: R, perUnit: 120, tone: 0.6 }), { pos: [sx, y - 0.0045, sz] }));
  }
  parts.push(PC.T(PC.disc({ r: R, n: 1500, tone: 0.34 }), { pos: [sx, yTip + 0.008 + 4 * pitch + 0.0045, sz] }));
  parts.push(PC.T(PC.circle({ r: R * 0.80, perUnit: 150, tone: 0.5 }), { pos: [sx, yTip + 0.008 + 4 * pitch + 0.006, sz] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.2, -0.6, 0],
    caption: 'A Czochralski silicon ingot, about 2 m of single crystal pulled from a seed the size of a pencil: the thin neck below the seed, the flared crown, 1.5 m of 300 mm body ringed with growth striations, and the cropped tail. Beside it are wafers sawn from the body, one standing on edge in copper.'
  };
});
