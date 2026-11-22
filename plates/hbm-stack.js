/* =====================================================================================================
   09 Memory: a twelve-high HBM stack, pulled apart and cut open, in millimetres: an 11 x 11 mm footprint (this site's own
   estimate, data/landscape-layouts.json; the caption says so), the heights drawn far taller than they are.
   22 Nov 2026 review: the base die is silicon, so it is drawn in ink and copper means copper: the through-silicon vias and
   the microbumps, where the quarter cut passes through them. The loupe (LOUPE, below) carries only figures with an allowed
   source: microbumps about 20 micrometres apart (SK hynix, chapter 9) in a 7 micrometre gap between dies (Samsung's 12-high
   HBM3E release, 27 Feb 2024). The hair and the 30 micrometre die figure had none and are gone. Set LOUPE to false to drop
   it. Colours (the set's legend): copper only. */
var LOUPE = true;
R('hbm-stack', function (m) {
  var hw = 5.3, bw = 5.5, t = 0.45, bt = 0.9, gap0 = 0.105, pitch = t + gap0, EX = 0.62;
  var TX = 0.7, TZ = 0.8;
  function L(w) { return [[-w, -w], [w, -w], [w, 0], [0, 0], [0, w], [-w, w]]; }
  function tsvLines(y0, y1, w, tag) {
    var onZ = [], onX = [];
    for (var x = 0; x <= w - 0.2; x += TX) onZ.push(D.line([x + 0.0001, y0, 0], [x + 0.0001, y1, 0], { col: 'acc', lw: 1.0, tag: tag }));
    for (var z = 0; z <= w - 0.2; z += TZ) onX.push(D.line([0, y0, z + 0.0001], [0, y1, z + 0.0001], { col: 'acc', lw: 1.0, tag: tag }));
    return [onZ, onX];
  }
  function bumps(y, w) { var p = []; for (var x = 0; x <= w - 0.2; x += TX) p.push([x, y, 0]); for (var z = TZ; z <= w - 0.2; z += TZ) p.push([0, y, z]); return p; }
  // base die, silicon, in ink
  var base = m.part('base', { ex: [0, 0, 0], seq: 0 });
  var tb = tsvLines(-bt, 0, bw);
  var bl = [D.rect(-bw * 0.86, -bw * 0.43, bw * 0.86, -bw * 0.23, 0, { lw: 0.5 }), D.rect(-bw * 0.86, bw * 0.23, 0, bw * 0.43, 0, { lw: 0.5 })];
  m.prism(L(bw), -bt, 0, 'steel', { sideMat: { 2: 'cutDense', 3: 'cutDense' }, sideDecals: { 2: tb[0], 3: tb[1] }, top: bl });
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
    var tl = tsvLines(yb, yb + t, hw, 'tsv');
    var o = { sideMat: { 2: 'cutDense', 3: 'cutDense' }, sideDecals: { 2: tl[0], 3: tl[1] } };
    if (i === 11) {
      var bank = [];
      for (a = 0; a < 2; a++) for (b = 0; b < 4; b++) { var bx = (a - 0.5) * 10.6 * 0.44, bz = (b - 1.5) * 10.6 * 0.225; if (bx > 0 && bz > 0) continue; bank.push(D.rect(bx - 1.8, bz - 1.0, bx + 1.8, bz + 1.0, yb + t, { lw: 0.5, alpha: 0.75 })); }
      o.top = bank;
    }
    m.tag('dies');
    m.prism(L(hw), yb, yb + t, 'light', o);
    m.tag('bumps');
    // the bumps are left out of the small stills (lod 1): at 52 px their twelve rows ran together into a copper band
    m.dots(bumps(yb - gap0 / 2 - 0.08, hw), { col: 'acc', r: 1.6, alpha: 1, lod: 1 });
    m.tag(null);
    if (i === 10) m.anchor(1, 'Memory dies', [-hw, yb + t / 2, hw * 0.6]);
    // the vias' and the bumps' points sit low in the stack, so their leaders run short to labels under the loupe
    if (i === 2) m.anchor(3, 'TSVs', [TX * 2, yb + t / 2, 0]);
    if (i === 0) m.anchor(4, 'Microbumps', [TX * 4, yb - gap0 / 2 - 0.08, 0]);
    prev = p;
  }
  // memory dies anchor: two dies
  var md = m.anchors.filter(function (q) { return q.n === 1; })[0];
  var d8 = m.parts.filter(function (q) { return q.name === 'die8'; })[0];
  md.multi = [[d8.idx, [-hw, gap0 + pitch * 7 + t / 2, hw * 0.6]]];
  m.guide([[0, -bt - 1.2, 0, base.idx], [0, gap0 + pitch * 11 + t + 1.5, 0, prev.idx]], { style: 'axis', alpha: 0.8 });
  [[-hw, -hw], [hw, -hw], [-hw, hw]].forEach(function (c) { m.guide([[c[0], 0, c[1], base.idx], [c[0], gap0 + pitch * 11, c[1], prev.idx]], { alpha: 0.6 }); });
  // what each numbered part lights, as its light table in data/specimen-parts.json does: every memory die in ink, every via and
  // every microbump in copper
  var loupe = LOUPE ? { model: 'hbm-loupe', at: [TX * 2.5, gap0 + pitch * 9 + t / 2, hw * 0.55], part: 'die10', side: 'r', r: 0.155, rMax: 100, scale: 0.6, dx: -0.1, dy: 0.04, caption: ['Microbumps about 20\u00a0\u00b5m apart', 'in a 7\u00a0\u00b5m gap'] } : null;
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, calloutOpts: { 1: { tag: 'dies', only: 'ink' }, 3: { tag: 'tsv', only: 'accent' }, 4: { tag: 'bumps', only: 'accent' } }, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});

/* The loupe's own small plate, in micrometres, seen almost face on so its cut face reads as a section: three dies with the
   microbumps between them, 20 um apart (SK hynix's typical microbump spacing, chapter 9), in a 7 um gap (Samsung's 12-high
   HBM3E release), and a via through each die. The dies' thickness and the vias' width are drawn, not sourced, so they carry no
   figure. */
R('hbm-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  function bx(x0, y0, z0, x1, y1, z1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], s: [x1 - x0, y1 - y0, z1 - z0], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  // (designer pass, 22 Nov 2026: the section is narrower and stands left of the disc's middle, so the gap's figure sits in
  // clear ground beside it and the die's name over the stack, neither on the cut faces nor past the disc's edge)
  var t = 30, g = 7, Z = 40, x0 = -50, x1 = 50, n = 3, P = 20;
  for (var i = 0; i < n; i++) {
    var y0 = i * (t + g);
    bx(x0, y0, -Z, x1, y0 + t, Z, 'light', { pz: 'cut' });
    if (i < n - 1) for (var bp = x0 + 10; bp < x1 - 5; bp += P) bx(bp - 4.5, y0 + t, -2, bp + 4.5, y0 + t + g, Z, 'acc', { pz: 'cutAcc' });
    [x0 + 10, x0 + 70].forEach(function (vx) { bx(vx - 2.2, y0, -2, vx + 2.2, y0 + t, Z + 0.02, 'acc', { pz: 'cutAcc' }); });
  }
  bar(m, [x0 + 30, -8, Z], [x0 + 50, -8, Z], '20 \u00b5m', { side: -1 });
  bar(m, [x1 + 22, t, Z + 1], [x1 + 22, t + g, Z + 1], '7 \u00b5m', { side: 1 });
  tag(m, [-6, n * t + (n - 1) * g + 17, -Z], 'Memory die', {});
  return { elev: 0.16, yaw: -0.14, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});
