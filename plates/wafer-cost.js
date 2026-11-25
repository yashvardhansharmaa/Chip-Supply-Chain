/* =====================================================================================================
   15 Costs, option 1 · The specimen drawer (four plates, round 5, 24 Nov 2026, late; the round 5 concept N1, kept by the owner:
   "the specimen drawer is great, let's do that!").
   Epoch AI's December 2025 estimate of what it cost to build one B200 (memory $2,900, packaging $1,100, packaging yield loss
   $1,000, logic dies $900, power delivery, board and test $480; $6,380 in all, "about $6,400"), set out as a museum drawer. Each
   part lies at one scale, at plate 10's sizes, in its own compartment, and each compartment's floor is exactly as large as that
   line's cost: KA model mm² a dollar, the same for all five. The idea: the eight small memory stacks sit alone in the largest
   compartment, the large board in the smallest, and the compartment for packages that fail testing holds nothing.
   - Every floor lies on one level plane (y = 0, the linings' foot), so any parallel view scales them all by one factor and the
     proportion holds at every turn. Frame and dividers belong to no compartment. The areas are checked when the model builds and
     logged in PLATE.LOG15 (and NOTES.md, "Round 5, 15").
   - Layout: memory full depth on the left; on the right a back row (logic dies, then power delivery, board and test) and a front
     row (packaging, then packaging yield loss). KA is the least that lets the board (92 x 120 mm, drawn) lie in its compartment
     with 3 mm to spare each way (the concept's scale; the expert: the scale is a choice, so the teach line claims no fit).
   - Contents, at one scale (plate 10's sizes, this site's estimate):
     memory: eight HBM3E stacks, 11 x 11 mm, black mould sides and shiny silicon tops, in two rows of four, on garnet velvet, the
       one wine on the plate;
     logic dies: two dies, 26 x 32.5 mm, face up, in the die-photo palette (the expert's round 3 rulings), on linen felt;
     packaging: the substrate (95 x 68 mm, green solder mask over its amber laminate edge) and the interposer (78 x 50 mm, amber
       polyimide over black mould, copper marking its chip sites) lying side by side as two separate parts (the expert's ruling);
     power delivery, board and test: the module board (92 x 120 mm, drawn) with its power parts (black inductors and power stages,
       tan capacitors, drawn, no figures) and the empty site where the package sits, on linen felt;
     packaging yield loss: nothing. No lining, its floor an outline only (the expert: outline, no material colour).
   - The drawer in pale oak with a quiet grain, a brass label holder with a blank card on its front.
   - Labels: the five lines in the caption's words, the figure first, large (15.5 px at the slot), memory's in wine; in a row over
     and under the drawer at every width; "about $6,400 in all" on a bracket under the row, across the drawer.
   - No loupe. A loupe on the stacks ("192 GB of HBM3E in eight stacks") was tried: its disc covered part of the memory
     compartment, whose area is the figure, and the plate's point is that the stacks are small. So it is left out.
   Layout hooks (wrappers round the kit's methods, installed once, each switched on by a spec flag that no other plate sets; kit
   changes to port as flags if the owner keeps this option): rows (labels in rows at every width), foot (the total's bracket),
   labelFs (the labels' size at the slot).
   Its materials (d5*) are in the kit's palette (src/plate.js REAL), with 01's die-photo materials (dp*) and siBack, mould,
   subMask, core, pi, cu, pcb, laminate, plastic, mlcc and sac. */
(function (P) {
  var PP = P && P.Plate && P.Plate.prototype;
  if (!PP) return;
  if (!PP._rowsFlag) {
    var baseRows = PP.rowsOn;
    PP.rowsOn = function (w) { return baseRows.call(this, this.m && this.m.spec && this.m.spec.rows ? Math.min(w, 559) : w); };
    PP._rowsFlag = true;
  }
  if (!PP._lfsFlag) {
    var baseLS = PP.labelStyle;
    PP.labelStyle = function (w) { var o = baseLS.call(this, w), F = this.m && this.m.spec && this.m.spec.labelFs; if (F && w >= 560) { o.fs = F; o.wrapW = this.m.spec.wrapW || 200; } return o; };
    PP._lfsFlag = true;
  }
  if (!PP._footFlag) {
    PP._footFlag = true;
    var baseRooms = PP.rooms, basePaint = PP.paint;
    PP.rooms = function (w, g) {
      var r = baseRooms.apply(this, arguments), F = this.m && this.m.spec && this.m.spec.foot;
      if (F && this.rowsOn(w) && (r.b || 0) > 0) r.b += F.room || 30;
      return r;
    };
    PP.paint = function (st) {
      var out = basePaint.apply(this, arguments), m = this.m, F = m.spec && m.spec.foot;
      if (!F || (st.lod || this.lod) === 'thumb' || st.noLabels || this.o.noLabels || !this.rowsOn(st.w)) return out;
      var K = st.k == null ? 1 : st.k, a = (st.labA == null ? 1 : st.labA) * Math.max(0, Math.min(1, (K - 0.86) / 0.14));
      if (a <= 0.01) return out;
      var g = st.g, pal = st.pal, w = st.w, fit = st.fit || this._lfit; if (!fit) return out;
      var k = Math.max(0.8, Math.min(1.2, (st.penW || w) / 620)), ls = this.labelStyle(w), R = P.viewM(m.yaw0, m.elev);
      var sx = function (q) { return fit.cx + fit.s * (R[0] * q[0] + R[1] * q[1] + R[2] * q[2]); };
      var lines = 1; m.callouts.forEach(function (c) { if (c._lines && c._side === 'b') lines = Math.max(lines, c._lines.length); });
      var db = fit.cy - fit.s * fit.e.miny, y = db + 9 * k + 4 + lines * ls.fs * 1.18 + 14;
      var x0 = sx(F.from), x1 = sx(F.to), xm = (x0 + x1) / 2, size = Math.min(ls.fs, 14), tw = g.measure(F.text, { size: size, weight: 500 });
      var css = function (c) { return 'rgb(' + c.map(Math.round).join(',') + ')'; }, mix = function (p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]; };
      var lc = pal.dark ? css(mix(pal.bg, pal.ink, 0.38)) : '#b9b7b0', al = a * (this.focus ? 0.45 : 1);
      g.lines([[[x0, y - 6 * k], [x0, y], [xm - tw / 2 - 8, y]], [[xm + tw / 2 + 8, y], [x1, y], [x1, y - 6 * k]]], lc, 1, null, al, 'butt');
      g.text(F.text, xm, y, { size: size, weight: 500, fill: css(pal.muted), align: 'center', alpha: al });
      return out;
    };
  }
})(PLATE);

R('wafer-cost', function (m) {
  var BOM = { mem: 2900, pack: 1100, yld: 1000, logic: 900, board: 480 }, TOTAL = 6380;
  var t = 4, frame = 12, wallH = 18, divH = 13, felt = 1.5, mg = 3;
  var Qw = (92 + 2 * mg) * (BOM.logic + BOM.board) / BOM.board;   // the two cells of a row together, wide enough for the board's cell
  var KA = (120 + 2 * mg) * Qw / (BOM.logic + BOM.board);          // and deep enough for it: model mm² a dollar
  var dB = (BOM.logic + BOM.board) * KA / Qw, dF = (BOM.pack + BOM.yld) * KA / Qw, Dz = dB + t + dF;
  var wLog = BOM.logic * KA / dB, wBrd = BOM.board * KA / dB, wPk = BOM.pack * KA / dF, wYl = BOM.yld * KA / dF;
  var Wm = BOM.mem * KA / Dz, W = Wm + t + Qw + t;
  var X0 = -W / 2, Z0 = -Dz / 2, xR = X0 + Wm + t, zF = Z0 + dB + t;
  var cells = {
    mem: [X0, Z0, X0 + Wm, Z0 + Dz], logic: [xR, Z0, xR + wLog, Z0 + dB], board: [xR + wLog + t, Z0, xR + wLog + t + wBrd, Z0 + dB],
    pack: [xR, zF, xR + wPk, zF + dF], yld: [xR + wPk + t, zF, xR + wPk + t + wYl, zF + dF]
  };
  // the proportion check: every floor over its figure gives KA (to 1e-9), and all five lie on y = 0
  var log = { KA: KA, area: {}, perDollar: {}, ok: true };
  for (var c in cells) { var q = cells[c], a = (q[2] - q[0]) * (q[3] - q[1]); log.area[c] = Math.round(a * 1000) / 1000; log.perDollar[c] = a / BOM[c]; if (Math.abs(a / BOM[c] - KA) > 1e-9) log.ok = false; }
  log.sum = Object.keys(log.area).reduce(function (s, k) { return s + log.area[k]; }, 0); log.sumPerDollar = log.sum / TOTAL;
  PLATE.LOG15 = log;
  var SIDE = function (real) { return { px: { d: 0.2, real: real }, nx: { d: 0.2, real: real }, pz: { d: 0.2, real: real }, nz: { d: 0.2, real: real } }; };
  function bx(x0, y0, z0, x1, y1, z1, real, mat, o) {
    o = o || {}; m.tag(o.tag || null); m.real(real || null);
    var s = m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], s: [x1 - x0, y1 - y0, z1 - z0], fmat: o.fmat || null, decals: o.decals || null, skip: o.skip || [], noCast: !!o.noCast }, mat || 'light');
    m.tag(null); return s;
  }
  // decals in a box's own frame (centred): helpers
  var rect = function (x0, z0, x1, z1, y, real, o) { o = o || {}; return { pts: [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], closed: true, lw: o.lw == null ? 0 : o.lw, fill: o.noFill ? null : { d: 0.1, real: real }, real: real, alpha: o.alpha, fine: !!o.fine }; };

  // ---- the drawer: frame and dividers in pale oak, a quiet grain along the frame's top faces
  var pD = m.part('drawer', { seq: 0, mode: 'stack' });
  var Xo = X0 - frame, Xe = -X0 + frame, Zo = Z0 - frame, Ze = -Z0 + frame;
  var END = { px: { d: 0.18, real: 'd5OakEnd' }, nx: { d: 0.18, real: 'd5OakEnd' } };
  function grain(len, wid, along) { var it = [], rnd = H.rng(Math.round(len * 7 + wid)); for (var k = 0; k < 3; k++) { var o = (rnd() - 0.5) * wid * 0.7; it.push(along === 'x' ? { pts: [[-len / 2 + 4, wallH / 2, o], [len / 2 - 4, wallH / 2, o + (rnd() - 0.5) * 2]], lw: 0.45, real: 'd5OakLn', alpha: 0.55, fine: true } : { pts: [[o, wallH / 2, -len / 2 + 4], [o + (rnd() - 0.5) * 2, wallH / 2, len / 2 - 4]], lw: 0.45, real: 'd5OakLn', alpha: 0.55, fine: true }); } return it; }
  bx(Xo, 0, Zo, Xe, wallH, Z0, 'd5Oak', 'light', { tag: 'drawer', fmat: END, decals: { py: grain(Xe - Xo, frame, 'x') } });
  bx(Xo, 0, -Z0, Xe, wallH, Ze, 'd5Oak', 'light', { tag: 'drawer', fmat: END, decals: { py: grain(Xe - Xo, frame, 'x') } });
  bx(Xo, 0, Z0, X0, wallH, -Z0, 'd5Oak', 'light', { tag: 'drawer', decals: { py: grain(Dz, frame, 'z') } });
  bx(-X0, 0, Z0, Xe, wallH, -Z0, 'd5Oak', 'light', { tag: 'drawer', decals: { py: grain(Dz, frame, 'z') } });
  bx(X0 + Wm, 0, Z0, xR, divH, -Z0, 'd5Oak', 'light', { tag: 'drawer' });
  bx(xR, 0, Z0 + dB, -X0, divH, zF, 'd5Oak', 'light', { tag: 'drawer' });
  bx(xR + wLog, 0, Z0, xR + wLog + t, divH, Z0 + dB, 'd5Oak', 'light', { tag: 'drawer' });
  bx(xR + wPk, 0, zF, xR + wPk + t, divH, -Z0, 'd5Oak', 'light', { tag: 'drawer' });
  // the drawer's bottom board, under the linings, oak, seen only where nothing lies on it (it is no compartment's floor)
  bx(Xo, -3, Zo, Xe, 0, Ze, 'd5OakEnd', 'light', { tag: 'drawer', skip: ['py'] });
  // a brass label holder on the drawer's front, its card blank
  bx(-30, 4, Ze, 30, 14, Ze + 0.8, 'd5Brass', 'steel', { tag: 'drawer' });
  bx(-27, 5.2, Ze + 0.8, 27, 12.8, Ze + 1.0, 'd5Card', 'paper', { tag: 'drawer' });

  // ---- memory: garnet velvet, the eight stacks in two rows of four
  var parts = {};
  parts.mem = m.part('mem', { seq: 1, mode: 'stack' });
  bx(cells.mem[0], 0, cells.mem[1], cells.mem[2], felt, cells.mem[3], 'd5Velvet', 'acc', { tag: 'mem' });
  var cmx = (cells.mem[0] + cells.mem[2]) / 2, cmz = (cells.mem[1] + cells.mem[3]) / 2;
  [-6.25, 6.25].forEach(function (dx) { [-17.7, -5.9, 5.9, 17.7].forEach(function (dz) { bx(cmx + dx - 5.5, felt, cmz + dz - 5.5, cmx + dx + 5.5, felt + 0.72, cmz + dz + 5.5, 'siBack', 'steel', { tag: 'mem', fmat: SIDE('mould') }); }); });

  // ---- logic dies: two dies face up, in the die-photo palette
  parts.logic = m.part('logic', { seq: 2, mode: 'stack' });
  bx(cells.logic[0], 0, cells.logic[1], cells.logic[2], felt, cells.logic[3], 'd5Felt', 'light', { tag: 'logic' });
  var clx = (cells.logic[0] + cells.logic[2]) / 2, clz = (cells.logic[1] + cells.logic[3]) / 2;
  function dieFace(w, d, y) {
    var it = [];
    // compute (logic) in two halves either side of the cache band, a coarse PHY strip down each long edge, the cache band in teal
    it.push(rect(-w / 2 + 3.2, -d / 2 + 1.2, w / 2 - 3.2, -2.6, y, 'dpLogic'), rect(-w / 2 + 3.2, 2.6, w / 2 - 3.2, d / 2 - 1.2, y, 'dpLogic'));
    it.push(rect(-w / 2 + 3.2, -2.2, -0.3, 2.2, y, 'dpSram'), rect(0.3, -2.2, w / 2 - 3.2, 2.2, y, 'dpSramB'));
    it.push(rect(-w / 2 + 0.9, -d / 2 + 1.2, -w / 2 + 2.8, d / 2 - 1.2, y, 'dpPhy'), rect(w / 2 - 2.8, -d / 2 + 1.2, w / 2 - 0.9, d / 2 - 1.2, y, 'dpPhy'));
    // the compute halves as clusters (four by two each), the finest marks left out while the plate turns
    for (var gx = 0; gx < 4; gx++) for (var gz = 0; gz < 2; gz++) [-1, 1].forEach(function (sd) {
      var x0 = -w / 2 + 3.6 + gx * (w - 7.2) / 4, z0 = sd < 0 ? -d / 2 + 1.6 + gz * 6.8 : 3 + gz * 6.8;
      var o = rect(x0 + 0.3, z0, x0 + (w - 7.2) / 4 - 0.3, z0 + 6.2, y, gx % 2 === gz % 2 ? 'dpLogicHi' : 'dpLogicLo'); o.fine = true; it.push(o);
    });
    for (var q = 0; q < 7; q++) { var zz = -d / 2 + 2 + q * (d - 4) / 6; it.push({ pts: [[-w / 2 + 1.0, y, zz], [-w / 2 + 2.7, y, zz]], lw: 0.5, real: 'dpCu', fine: true }, { pts: [[w / 2 - 2.7, y, zz], [w / 2 - 1.0, y, zz]], lw: 0.5, real: 'dpCu', fine: true }); }
    return it;
  }
  [-16, 16].forEach(function (dx) { bx(clx + dx - 13, felt, clz - 16.25, clx + dx + 13, felt + 0.8, clz + 16.25, 'dpFace', 'steel', { tag: 'logic', fmat: SIDE('dpEdge'), decals: { py: dieFace(26, 32.5, 0.401) } }); });

  // ---- power delivery, board and test: the module board (drawn) with its power parts and the package's empty site
  parts.board = m.part('board', { seq: 3, mode: 'stack' });
  bx(cells.board[0], 0, cells.board[1], cells.board[2], felt, cells.board[3], 'd5Felt', 'light', { tag: 'board' });
  var cbx = (cells.board[0] + cells.board[2]) / 2, cbz = (cells.board[1] + cells.board[3]) / 2, bh = 2.0;
  bx(cbx - 46, felt, cbz - 60, cbx + 46, felt + bh, cbz + 60, 'pcb', 'light', { tag: 'board', fmat: SIDE('laminate'), decals: { py: [rect(-34, -47.5, 34, 47.5, bh / 2, 'sac', { lw: 0.6, noFill: true, alpha: 0.9 })] } });
  var top = felt + bh;
  for (var k = 0; k < 7; k++) bx(cbx + 40 - 3.5, top, cbz - 48 + k * 16 - 4, cbx + 40 + 3.5, top + 3.2, cbz - 48 + k * 16 + 4, 'plastic', 'mid', { tag: 'board' });
  for (k = 0; k < 5; k++) { bx(cbx - 18 + k * 10 - 1.6, top, cbz - 56, cbx - 18 + k * 10 + 1.6, top + 1.2, cbz - 54, 'mlcc', 'light', { tag: 'board' }); bx(cbx - 18 + k * 10 - 1.6, top, cbz + 54, cbx - 18 + k * 10 + 1.6, top + 1.2, cbz + 56, 'mlcc', 'light', { tag: 'board' }); }

  // ---- packaging: the substrate and the interposer, side by side, two separate parts (substrate behind, interposer in front)
  parts.pack = m.part('pack', { seq: 4, mode: 'stack' });
  bx(cells.pack[0], 0, cells.pack[1], cells.pack[2], felt, cells.pack[3], 'd5Felt', 'light', { tag: 'pack' });
  var cpx = (cells.pack[0] + cells.pack[2]) / 2, cpz = (cells.pack[1] + cells.pack[3]) / 2, sH = 2.4, iH = 1.0, gap = 14;
  var zS = cpz - (68 + gap + 50) / 2 + 34, zI = zS + 34 + gap + 25;
  bx(cpx - 47.5, felt, zS - 34, cpx + 47.5, felt + sH, zS + 34, 'subMask', 'steel', { tag: 'pack', fmat: SIDE('core') });
  var sites = [], tp = iH / 2;
  [-13.5, 13.5].forEach(function (x) { sites.push(rect(x - 13, -16.25, x + 13, 16.25, tp, 'cu', { lw: 0.55, noFill: true, alpha: 0.9 })); });
  [-33.5, 33.5].forEach(function (x) { [-17.7, -5.9, 5.9, 17.7].forEach(function (z) { sites.push(rect(x - 5.5, z - 5.5, x + 5.5, z + 5.5, tp, 'cu', { lw: 0.55, noFill: true, alpha: 0.9 })); }); });
  bx(cpx - 39, felt, zI - 25, cpx + 39, felt + iH, zI + 25, 'pi', 'light', { tag: 'pack', fmat: SIDE('mould'), decals: { py: sites } });

  // ---- packaging yield loss: nothing, no lining; its floor an outline only (a clear sheet, so the pointer finds it)
  parts.yld = m.part('yield', { seq: 5, mode: 'stack' });
  m.tag('yield'); m.real('d5Empty');
  var e = 1.2;
  m.sheet([[cells.yld[0] + e, 0.05, cells.yld[1] + e], [cells.yld[2] - e, 0.05, cells.yld[1] + e], [cells.yld[2] - e, 0.05, cells.yld[3] - e], [cells.yld[0] + e, 0.05, cells.yld[3] - e]], { d: 0.02 }, { noCast: true });
  m.tag(null);

  // ---- the labels: the back compartments named from over the drawer, the front ones from under it
  m.callout([[cmx - 6.25, felt + 0.72, cmz - 17.7, parts.mem.idx]], '$2,900 of memory', { row: 't', col: 'acc', strong: true, tag: 'mem' });
  m.callout([[clx + 16, felt + 0.8, clz - 8, parts.logic.idx]], '$900 of logic dies', { row: 't', tag: 'logic' });
  m.callout([[cbx - 6, top, cbz - 20, parts.board.idx]], '$480 of power delivery, board and test', { row: 't', tag: 'board' });
  m.callout([[cpx - 20, felt + iH, zI + 10, parts.pack.idx]], '$1,100 of packaging', { row: 'b', tag: 'pack' });
  m.callout([[(cells.yld[0] + cells.yld[2]) / 2, 0.05, cells.yld[3] - 40, parts.yld.idx]], '$1,000 of packaging yield loss', { row: 'b', tag: 'yield' });
  return {
    rows: true, labelFs: 15.5, wrapW: 210, foot: { text: 'about $6,400 in all', from: [Xo, 0, Ze], to: [Xe, 0, Ze], room: 30 },
    elev: 0.9, yaw: -0.16, sortAxis: [0, 1, 0], start: 1, rest: 0, noPolish: false,
    accent: [122, 31, 43], accentDark: [201, 83, 106], accent2: [154, 152, 143], accent2Dark: [138, 136, 128]
  };
});
