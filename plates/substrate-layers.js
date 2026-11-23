/* =====================================================================================================
   11 Substrates: a build-up substrate with a quarter cut away, in millimetres: 95 x 68 mm, this site's own estimate for the
   substrate of Nvidia's B200 (data/landscape-layouts.json, marked estimated; the caption says so), with the interposer's
   seat, 78 x 50, on top. The cut faces carry the section, drawn far thicker than it is: the glass-cloth core, eleven bands of
   build-up film on each side with copper between them (Ajinomoto counts 11 layers of its film on each side of the core in
   a 2026 AI package substrate, June 2026, chapter 11; the caption says the count is Ajinomoto's), plated through-holes and
   microvias. A cutaway: a quarter drawn pulled out of its corner sat over the board and read as a second object.
   22 Nov 2026 review: it was 100 x 72 with eight bands a side and a 1.5 mm thickness with no allowed source (the dimension,
   whose offset ran on two axes, is gone). Colours (the set's legend): the film in its own olive, copper in copper.
   Round two (expert FIX 2): 95 x 68 mm is the same envelope plate 10 calls not to scale (the site's estimate, not published
   dimensions), so the caption says the footprint is not drawn to scale and the 95 mm and 68 mm dimensions are gone. The copper
   is finer (0.75, planes 0.85), the microvias are filled copper cones, and Copper layers is named on a build-up plane. */
R('substrate-layers', function (m) {
  var W = 95, Dd = 68, tc = 7.5, tb = 1.0, nb = 11, tr = 1.0, top = tc / 2 + nb * tb + tr, cTop = tc / 2;
  var lay = []; for (var k = 0; k <= nb; k++) lay.push(cTop + k * tb);
  var FILM_A = { d: 0.24, c: 'acc' }, FILM_B = { d: 0.40, c: 'acc' };
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
    /* 22 Nov 2026 plates refine: the copper on every conductor plane runs the whole cut, broken only round the vias that land on
       it (each landing a pad of its own, with a clearance either side), so the eleven bands a side can be counted between the
       twelve lines of copper (random runs and breaks read as a brick wall). Every microvia column climbs every band, stacked or
       staggered; nothing is random */
    var pads = []; for (k = 0; k <= nb; k++) pads.push([]);
    // plated through-holes and their pads on the core's two faces
    var np = Math.max(3, Math.round(L / 11)), hw = 0.62;
    for (i = 0; i < np; i++) {
      u = (i + 0.5) * L / np;
      it.push({ pts: [toP(u - hw, -cTop), toP(u - hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu' }, { pts: [toP(u + hw, -cTop), toP(u + hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu' });
      pads[0].push([u - hw * 2.6, u + hw * 2.6]);
    }
    // microvias, stacked in some columns and staggered in others, each column through every band
    var nv = Math.max(4, Math.round(L / 12)), vias = [];
    for (i = 0; i < nv; i++) {
      var u0 = (i + 0.5) * L / nv + 2.2, stacked = i % 3 !== 0, uu = u0;
      for (var q = 1; q <= nb; q++) {
        if (!stacked) uu = u0 + (q % 2 ? 1.1 : 0);
        vias.push([q, uu]);
        // the via's foot lands on plane q - 1, its mouth on plane q: a pad on each
        pads[q - 1].push([uu - 0.75, uu + 0.75]); pads[q].push([uu - 0.75, uu + 0.75]);
      }
    }
    [1, -1].forEach(function (sg) {
      vias.forEach(function (v) { var yl = sg * lay[v[0] - 1], yh = sg * lay[v[0]], x = v[1]; it.push({ pts: [toP(x - 0.58, yh), toP(x - 0.3, yl), toP(x + 0.3, yl), toP(x + 0.58, yh)], closed: true, fill: { d: 0.62, c: 'acc2' }, col: 'acc2', lw: 0.4, tag: 'cu' }); });
      for (k = 0; k <= nb; k++) {
        var y = sg * lay[k], lw = k % 3 === 0 ? 0.85 : 0.75;
        // the plane's pads, merged where they touch, then the copper between them, each run stopping 0.5 short of a pad
        var ps = pads[k].slice().sort(function (a, b) { return a[0] - b[0]; }), mg = [];
        ps.forEach(function (pq) { var l = mg[mg.length - 1]; if (l && pq[0] <= l[1] + 0.2) l[1] = Math.max(l[1], pq[1]); else mg.push([pq[0], pq[1]]); });
        var x0 = 0.4;
        mg.forEach(function (pq) {
          if (pq[0] - 0.5 > x0 + 0.3) it.push({ pts: [toP(x0, y), toP(pq[0] - 0.5, y)], col: 'acc2', lw: lw, tag: 'cu' });
          it.push({ pts: [toP(Math.max(0.4, pq[0]), y), toP(Math.min(L - 0.4, pq[1]), y)], col: 'acc2', lw: k === 0 ? 1.3 : lw + 0.3, tag: 'cu' });
          x0 = pq[1] + 0.5;
        });
        if (L - 0.4 > x0 + 0.3) it.push({ pts: [toP(x0, y), toP(L - 0.4, y)], col: 'acc2', lw: lw, tag: 'cu' });
      }
    });
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
  m.callout([W * 0.3, (lay[2] + lay[3]) / 2, 0.001, body.idx], 'Build-up film', { side: 'r', tag: 'film' });
  // review: on a plated hole's copper pad at the near end of the right-hand cut (the leader ran right across the top); round two:
  // on the fifth build-up plane above the core, clear of the vias, so it names the layers rather than a hole
  m.callout([13, lay[5], 0.001, body.idx], 'Copper layers', { side: 'r', tag: 'cu' });
  m.callout([W * 0.22, 0.4, 0.001, body.idx], 'Core of glass cloth and resin', { side: 'r', tag: 'core' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, accent: [111, 122, 47], accentDark: [178, 189, 96], accent2: [176, 102, 44], accent2Dark: [224, 154, 92] };
});
