/* =====================================================================================================
   09 Memory: a twelve-high HBM stack, pulled apart and cut open, in millimetres: an 11 x 11 mm footprint to scale,
   heights about fifteen times (a 30 micrometre die drawn 0.45 mm). The base die is copper; through-silicon vias and
   micro-bumps show in copper where the quarter cut passes through them. */
R('hbm-stack', function (m) {
  var hw = 5.3, bw = 5.5, t = 0.45, bt = 0.9, gap0 = 0.105, pitch = t + gap0, EX = 0.62;
  var TX = 0.7, TZ = 0.8;
  function L(w) { return [[-w, -w], [w, -w], [w, 0], [0, 0], [0, w], [-w, w]]; }
  function tsvLines(y0, y1, w) {
    var onZ = [], onX = [];
    for (var x = 0; x <= w - 0.2; x += TX) onZ.push(D.line([x + 0.0001, y0, 0], [x + 0.0001, y1, 0], { col: 'acc', lw: 1.0 }));
    for (var z = 0; z <= w - 0.2; z += TZ) onX.push(D.line([0, y0, z + 0.0001], [0, y1, z + 0.0001], { col: 'acc', lw: 1.0 }));
    return [onZ, onX];
  }
  function bumps(y, w) { var p = []; for (var x = 0; x <= w - 0.2; x += TX) p.push([x, y, 0]); for (var z = TZ; z <= w - 0.2; z += TZ) p.push([0, y, z]); return p; }
  // base die, copper
  var base = m.part('base', { ex: [0, 0, 0], seq: 0 });
  var tb = tsvLines(-bt, 0, bw);
  var bl = [D.rect(-bw * 0.86, -bw * 0.43, bw * 0.86, -bw * 0.23, 0, { lw: 0.5, col: 'acc' }), D.rect(-bw * 0.86, bw * 0.23, 0, bw * 0.43, 0, { lw: 0.5, col: 'acc' })];
  m.prism(L(bw), -bt, 0, 'acc', { sideMat: { 2: 'cutAcc', 3: 'cutAcc' }, sideDecals: { 2: tb[0], 3: tb[1] }, top: bl });
  var under = [];
  for (var a = 0; a < 16; a++) for (var b = 0; b < 17; b++) { var ux = (a - 7.5) * 11 / 17, uz = (b - 8) * 11 / 18; if (!(ux > 0 && uz > 0)) under.push([ux, -bt - 0.12, uz]); }
  m.dots(under, { col: 'acc', r: 0.9, alpha: 0.5 });
  m.anchor(2, 'Base die', [bw, -bt / 2, -bw * 0.4]);
  // review: the quarter cut away is drawn as a phantom corner, so the 11 mm dimension ends on a drawn corner (it ended
  // in empty space where the cut had removed the corner)
  var ph = { lw: 0.55, dash: [4, 2.5], alpha: 0.7 };
  m.wire([[0, -bt, bw], [bw, -bt, bw], [bw, -bt, 0]], Object.assign({ c: [bw, -bt, bw] }, ph));
  m.wire([[0, 0, bw], [bw, 0, bw], [bw, 0, 0]], Object.assign({ c: [bw, 0, bw] }, ph));
  m.wire([[bw, -bt, bw], [bw, 0, bw]], Object.assign({ c: [bw, -bt / 2, bw] }, ph));
  m.dim([-bw, -bt, bw], [bw, -bt, bw], [0, 0, 1.6], '11 mm');
  var prev = base;
  for (var i = 0; i < 12; i++) {
    var yb = gap0 + pitch * i, p = m.part('die' + (i + 1), { ex: [0, EX * (i + 1), 0], seq: i + 1 });
    var tl = tsvLines(yb, yb + t, hw);
    var o = { sideMat: { 2: 'cutDense', 3: 'cutDense' }, sideDecals: { 2: tl[0], 3: tl[1] } };
    if (i === 11) {
      var bank = [];
      for (a = 0; a < 2; a++) for (b = 0; b < 4; b++) { var bx = (a - 0.5) * 10.6 * 0.44, bz = (b - 1.5) * 10.6 * 0.225; if (bx > 0 && bz > 0) continue; bank.push(D.rect(bx - 1.8, bz - 1.0, bx + 1.8, bz + 1.0, yb + t, { lw: 0.5, alpha: 0.75 })); }
      o.top = bank;
    }
    m.prism(L(hw), yb, yb + t, 'light', o);
    m.dots(bumps(yb - gap0 / 2 - 0.08, hw), { col: 'acc', r: 1.6, alpha: 1 });
    if (i === 10) m.anchor(1, 'Memory dies', [-hw, yb + t / 2, hw * 0.6]);
    if (i === 6) m.anchor(3, 'TSVs', [TX * 2, yb + t / 2, 0]);
    if (i === 2) m.anchor(4, 'Microbumps', [TX * 4, yb - gap0 / 2 - 0.08, 0]);
    prev = p;
  }
  // memory dies anchor: two dies
  var md = m.anchors.filter(function (q) { return q.n === 1; })[0];
  var d8 = m.parts.filter(function (q) { return q.name === 'die8'; })[0];
  md.multi = [[d8.idx, [-hw, gap0 + pitch * 7 + t / 2, hw * 0.6]]];
  m.guide([[0, -bt - 1.2, 0, base.idx], [0, gap0 + pitch * 11 + t + 1.5, 0, prev.idx]], { style: 'axis', alpha: 0.8 });
  [[-hw, -hw], [hw, -hw], [-hw, hw]].forEach(function (c) { m.guide([[c[0], 0, c[1], base.idx], [c[0], gap0 + pitch * 11, c[1], prev.idx]], { alpha: 0.6 }); });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [176, 102, 44], accentDark: [224, 154, 92] };
});
