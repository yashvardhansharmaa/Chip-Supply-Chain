/* =====================================================================================================
   11 Substrates: a build-up substrate with a quarter cut away, in millimetres: 95 x 68 mm, this site's own estimate for the
   substrate of Nvidia's B200 (data/landscape-layouts.json, marked estimated; the caption says so), with the interposer's
   seat, 78 x 50, on top. The cut faces carry the section, drawn far thicker than it is: the glass-cloth core, eleven bands of
   build-up film on each side with copper between them (Ajinomoto counts 11 layers of its film on each side of the core in
   a 2026 AI package substrate, June 2026, chapter 11; the caption says the count is Ajinomoto's), plated through-holes and
   microvias. A cutaway: a quarter drawn pulled out of its corner sat over the board and read as a second object.
   22 Nov 2026 review: it was 100 x 72 with eight bands a side and a 1.5 mm thickness with no allowed source (the dimension,
   whose offset ran on two axes, is gone). Colours (the set's legend): the film in its own olive, copper in copper. */
R('substrate-layers', function (m) {
  var W = 95, Dd = 68, tc = 7.5, tb = 1.0, nb = 11, tr = 1.0, top = tc / 2 + nb * tb + tr, cTop = tc / 2;
  var lay = []; for (var k = 0; k <= nb; k++) lay.push(cTop + k * tb);
  var rnd = rng(11), FILM_A = { d: 0.24, c: 'acc' }, FILM_B = { d: 0.40, c: 'acc' };
  // the section on a cut face, as decal items in (u, y), u running 0..L along the face
  function section(L, toP) {
    var it = [], i, u;
    var poly = function (u0, ya, u1, yb, o) { return Object.assign({ pts: [toP(u0, ya), toP(u1, ya), toP(u1, yb), toP(u0, yb)], closed: true }, o); };
    it.push(poly(0, -cTop, L, cTop, { fill: { d: 0.07, hatch: 3 }, lw: 0.5, tag: 'core' }));
    for (k = 1; k <= nb; k++) {
      // review: a deeper olive (d 0.24 and 0.40, was 0.17 and 0.34), so the bands read as the caption's olive green
      it.push(poly(0, lay[k - 1], L, lay[k], { fill: k % 2 ? FILM_A : FILM_B, lw: 0, keep: true, tag: 'film' }));
      it.push(poly(0, -lay[k], L, -lay[k - 1], { fill: k % 2 ? FILM_A : FILM_B, lw: 0, keep: true, tag: 'film' }));
    }
    [1, -1].forEach(function (sg) { it.push(poly(0, sg > 0 ? lay[nb] : -top, L, sg > 0 ? top : -lay[nb], { fill: 'dark', lw: 0 })); });
    // copper on every conductor plane, as traces in section: longer runs with short breaks, and every third plane nearly whole
    // (a power or ground plane), so the bands read as layers (designer pass, 22 Nov 2026: short random dashes on every plane
    // read as a brick wall)
    [1, -1].forEach(function (sg) {
      for (k = 0; k <= nb; k++) {
        var y = sg * lay[k], plane = k % 3 === 0; u = 0.4 + rnd() * 1.2;
        while (u < L - 0.4) { var w = plane ? 6 + rnd() * 9 : 2.2 + rnd() * 3.8; if (u + w > L - 0.4) w = L - 0.4 - u; if (w < 0.8) break; it.push({ pts: [toP(u, y), toP(u + w, y)], col: 'acc2', lw: plane ? 1.2 : 1.05, tag: 'cu' }); u += w + (plane ? 0.5 + rnd() * 0.5 : 0.7 + rnd() * 1.1); }
      }
    });
    // plated through-holes and their pads
    var np = Math.max(3, Math.round(L / 11));
    for (i = 0; i < np; i++) {
      u = (i + 0.5) * L / np; var hw = 0.62;
      it.push({ pts: [toP(u - hw, -cTop), toP(u - hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu' }, { pts: [toP(u + hw, -cTop), toP(u + hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu' });
      it.push({ pts: [toP(u - hw * 2.6, cTop), toP(u + hw * 2.6, cTop)], col: 'acc2', lw: 1.6, tag: 'cu' }, { pts: [toP(u - hw * 2.6, -cTop), toP(u + hw * 2.6, -cTop)], col: 'acc2', lw: 1.6, tag: 'cu' });
    }
    // microvias, stacked in some columns and staggered in others
    var nv = Math.max(4, Math.round(L / 12));
    for (i = 0; i < nv; i++) {
      var u0 = (i + 0.5) * L / nv + 2.2, stacked = i % 3 !== 0;
      [1, -1].forEach(function (sg) {
        var uu = u0, climb = 3 + Math.floor(rnd() * (nb - 3));
        for (var q = 1; q <= climb; q++) {
          if (!stacked) uu += (q % 2 ? 1 : -1) * 1.1;
          var yl = sg * lay[q - 1], yh = sg * lay[q];
          it.push({ pts: [toP(uu - 0.58, yh), toP(uu - 0.3, yl), toP(uu + 0.3, yl), toP(uu + 0.58, yh)], col: 'acc2', lw: 0.8, tag: 'cu' });
        }
      });
    }
    // solder balls in section along the foot
    var nbz = Math.max(4, Math.round(L / 4.5));
    for (i = 0; i < nbz; i++) { u = (i + 0.5) * L / nbz; var arc = []; for (var a = 0; a <= 12; a++) { var th = Math.PI * a / 12; arc.push(toP(u - 1.1 * Math.cos(th), -top - 1.1 * Math.sin(th) * 0.85)); } it.push({ pts: arc, lw: 0.7, fill: 'mid' }); }
    return it;
  }
  var body = m.part('body', { ex: [0, 0, 0], seq: 0 });
  var Lsh = [[-W / 2, -Dd / 2], [W / 2, -Dd / 2], [W / 2, 0], [0, 0], [0, Dd / 2], [-W / 2, Dd / 2]];
  var secZ = section(W / 2, function (u, y) { return [u, y, 0.001]; }), secX = section(Dd / 2, function (u, y) { return [0.001, y, u]; });
  // the top: the die's shadow with its bump pads, and the capacitor pads round it, both stopped by the cut
  var sw = 78, sd = 50, tp = [];
  tp.push({ pts: [[0, top, -sd / 2], [-sw / 2, top, -sd / 2], [-sw / 2, top, sd / 2], [0, top, sd / 2]], lw: 0.7, dash: [2.4, 1.6] });
  tp.push({ pts: [[0, top, -sd / 2], [sw / 2, top, -sd / 2], [sw / 2, top, 0]], lw: 0.7, dash: [2.4, 1.6] });
  tp.push({ dots: H.gridPts(30, 20, sw / 31, sd / 21, top, 0, 0, function (x, z) { return !(x > 0.5 && z > 0.5); }), r: 0.55, alpha: 0.6 });
  for (var q = 0; q < 30; q++) { var cu = (q - 14.5) * (W * 0.94 / 30); if (Math.abs(cu) > sw / 2 + 2) continue; [-1, 1].forEach(function (sg) { if (cu > 0 && sg > 0) return; tp.push(D.rect(cu - 0.9, sg * (sd / 2 + 4.2) - 1.4, cu + 0.9, sg * (sd / 2 + 4.2) + 1.4, top, { fill: 'dark', lw: 0.3 })); }); }
  m.prism(Lsh, -top, top, 'light', { sideMat: { 2: 'paper', 3: 'paper' }, sideDecals: { 2: secZ, 3: secX }, top: tp });
  m.dim([-W / 2, top, -Dd / 2], [W / 2, top, -Dd / 2], [0, 0, -9], '95 mm');
  m.dim([-W / 2, top, Dd / 2], [-W / 2, top, -Dd / 2], [-9, 0, 0], '68 mm');
  m.callout([W * 0.3, (lay[2] + lay[3]) / 2, 0.001, body.idx], 'Build-up film', { side: 'r', tag: 'film' });
  // review: on a plated hole's copper pad at the near end of the right-hand cut (the leader ran right across the top)
  m.callout([3.5 * (W / 2) / 4, cTop, 0.001, body.idx], 'Copper layers', { side: 'r', tag: 'cu' });
  m.callout([W * 0.22, 0.4, 0.001, body.idx], 'Core of glass cloth and resin', { side: 'r', tag: 'core' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, accent: [111, 122, 47], accentDark: [178, 189, 96], accent2: [176, 102, 44], accent2Dark: [224, 154, 92] };
});
