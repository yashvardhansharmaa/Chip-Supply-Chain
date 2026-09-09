/* Specimen: a Czochralski silicon ingot and the wafers cut from it.
 *
 * Units are metres. A 300 mm production boule is about 2 m of crystal weighing
 * a little over a quarter of a tonne. Here: 1.5 m of 300 mm body, a 0.40 m
 * crown where the crystal opens out to full diameter, and a 0.33 m cropped
 * tail, so 2.23 m of silicon, all of it hanging from the seed on a neck about
 * 10 mm across - the proportion in this drawing nobody believes.
 *
 * Drawn as an engraving rather than a shaded render: the round surfaces are
 * hatched with meridians, which crowd toward the silhouette and open out in
 * the middle, so a cylinder reads as a cylinder from any angle as it turns.
 * Four of the crown's meridians are drawn heavier - those are the facet ridges
 * that run down a <100> crystal, clearly visible on an as-grown crown. The
 * body is ground to diameter, so it carries only faint growth striations.
 *
 * Below the tail stand three wafers sawn from that body, one in copper. A
 * wafer is exactly as wide as the ingot: that is the whole reason for growing
 * the crystal to 300 mm in the first place.
 */
PC.register('boule-and-wafer', function (p) {
  var R = 0.15, bx = -0.20;
  var yTip = -0.71, yB0 = -0.45, yB1 = 1.05;         // tail 0.26 m, body 1.50 m
  var yCr = 1.47, yNk = 1.60, ySd = 1.67, yCh = 1.715;
  var MER = 24;                                       // meridians around each solid
  var parts = [], i, y, a;
  function at(c) { return PC.T(c, { pos: [bx, 0, 0] }); }

  // hatch a surface of revolution: MER meridians following a [r, y] profile
  function hatch(profile, tone, heavyEvery, heavyTone) {
    for (var k = 0; k < MER; k++) {
      var th = k * Math.PI * 2 / MER + Math.PI / MER;
      var heavy = heavyEvery && (k % heavyEvery === Math.floor(heavyEvery / 2));
      parts.push(at(PC.polyline({
        pts: profile.map(function (q) {
          return [q[0] * 1.004 * Math.cos(th), q[1], q[0] * 1.004 * Math.sin(th)];
        }),
        perUnit: heavy ? 240 : 175, tone: heavy ? heavyTone : tone
      })));
    }
  }

  // ---------- tail: a long gentle taper cropped to a small flat ----------
  var tail = [[0.038, yTip], [0.078, yTip + 0.045], [0.110, yTip + 0.095],
              [0.133, yTip + 0.160], [0.146, yTip + 0.215], [R, yB0]];
  parts.push(at(PC.lathe({ profile: tail, tone: 0.17 })));
  hatch(tail, 0.34);
  parts.push(at(PC.T(PC.disc({ r: 0.038, tone: 0.4 }), { pos: [0, yTip, 0] })));
  parts.push(at(PC.T(PC.circle({ r: 0.038, perUnit: 700, tone: 1 }), { pos: [0, yTip, 0] })));

  // ---------- body: 1.5 m of ground 300 mm cylinder ----------
  var body = [[R, yB0], [R, yB1]];
  parts.push(at(PC.T(PC.cylinder({ r: R, h: yB1 - yB0, caps: false, n: 9000, tone: 0.16 }),
    { pos: [0, (yB0 + yB1) / 2, 0] })));
  hatch(body, 0.36);
  for (i = 0; i <= 9; i++) {                          // growth striations
    y = yB0 + 0.07 + (yB1 - yB0 - 0.14) * i / 9;
    parts.push(at(PC.T(PC.circle({ r: R * 1.006, perUnit: 130, tone: 0.28 }), { pos: [0, y, 0] })));
  }
  parts.push(at(PC.T(PC.circle({ r: R * 1.006, perUnit: 420, tone: 0.85 }), { pos: [0, yB0, 0] })));

  // ---------- crown: as-grown, one step proud of the ground body ----------
  var Rc = R * 1.03;
  var crown = [[Rc, yB1], [Rc, yB1 + 0.022], [Rc * 0.992, 1.115], [Rc * 0.972, 1.165],
               [Rc * 0.936, 1.215], [Rc * 0.880, 1.265], [Rc * 0.800, 1.315],
               [Rc * 0.690, 1.362], [Rc * 0.545, 1.404], [Rc * 0.370, 1.437],
               [Rc * 0.185, 1.461], [0.004, yCr]];
  parts.push(at(PC.lathe({ profile: crown, tone: 0.17 })));
  hatch(crown, 0.30, 6, 0.72);                         // 4 heavy meridians = the facet ridges
  parts.push(at(PC.T(PC.circle({ r: Rc * 1.006, perUnit: 640, tone: 1 }), { pos: [0, yB1, 0] })));
  parts.push(at(PC.T(PC.circle({ r: R * 1.006, perUnit: 400, tone: 0.8 }), { pos: [0, yB1, 0] })));
  [4, 7].forEach(function (k) {
    parts.push(at(PC.T(PC.circle({ r: crown[k][0] * 1.008, perUnit: 200, tone: 0.5 }), { pos: [0, crown[k][1], 0] })));
  });

  // ---------- neck, seed, seed holder and the pull rod ----------
  parts.push(PC.T(PC.cylinder({ r: 0.0052, h: yNk - yCr, caps: false, n: 900, tone: 0.85 }),
    { pos: [bx, (yCr + yNk) / 2, 0] }));
  parts.push(PC.T(PC.box({ w: 0.015, h: ySd - yNk, d: 0.015, n: 420, tone: 0.4 }), { pos: [bx, (yNk + ySd) / 2, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: 0.015, h: ySd - yNk, d: 0.015, perUnit: 620, tone: 0.95 }), { pos: [bx, (yNk + ySd) / 2, 0] }));
  parts.push(PC.T(PC.cylinder({ r: 0.026, h: yCh - ySd, caps: false, n: 500, tone: 0.3 }), { pos: [bx, (ySd + yCh) / 2, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.026, perUnit: 380, tone: 0.9 }), { pos: [bx, yCh, 0] }));
  parts.push(PC.T(PC.circle({ r: 0.026, perUnit: 380, tone: 0.9 }), { pos: [bx, ySd, 0] }));

  // ---------- three wafers standing on their rims, as they come out of the saw ----------
  function wafer(accent) {
    var face = PC.disc({ r: R, n: accent ? 5400 : 3000, tone: accent ? 0.24 : 0.15 });
    var rim = PC.circle({ r: R, perUnit: accent ? 620 : 380, tone: accent ? 1 : 0.85 });
    var edge = PC.cylinder({ r: R, h: 0.0034, caps: false, n: accent ? 700 : 420, tone: accent ? 0.75 : 0.45 });
    var ring = PC.circle({ r: R * 0.965, perUnit: accent ? 220 : 130, tone: accent ? 0.45 : 0.25 });
    var c = PC.merge(
      PC.T(face, { pos: [0, 0.0017, 0] }), edge,
      PC.T(rim, { pos: [0, 0.0017, 0] }), PC.T(ring, { pos: [0, 0.0019, 0] })
    );
    if (accent) { for (var j = 3; j < c.length; j += 4) c[j] = 2 + Math.min(1, c[j] * 1.15); }
    var keep = [];                                    // the orientation notch
    for (var k = 0; k < c.length; k += 4) {
      if (c[k + 2] > R - 0.011 + Math.abs(c[k])) continue;
      keep.push(c[k], c[k + 1], c[k + 2], c[k + 3]);
    }
    return new Float32Array(keep);
  }
  var lean = 0.17;
  for (i = 0; i < 5; i++) {
    parts.push(PC.T(wafer(i === 2), {
      rot: [0, 0.30, -(Math.PI / 2 - lean)],
      pos: [0.34 + (i - 2) * 0.014, yTip + R * Math.cos(lean) + 0.002, (i - 2) * 0.062]
    }));
  }

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.075,
    tilt: [0.16, -0.62, 0],
    caption: 'A Czochralski silicon ingot: 2.2 m of one unbroken crystal, roughly 265 kg of it, ' +
      'hanging from a seed on a neck about 10 mm across. Below the seed comes the neck, then the ' +
      'crown where the crystal opens out to 300 mm - the four heavy lines down it are the facet ' +
      'ridges of a <100> crystal - then 1.5 m of ground body ringed with growth striations, then ' +
      'the cropped tail. Standing at its foot are wafers sawn from that body, one in copper, each ' +
      'exactly as wide as the ingot it came from.'
  };
});
