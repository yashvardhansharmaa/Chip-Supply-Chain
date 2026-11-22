/* CHIP SUPPLY CHAIN plate kit (PLATE): the exploded technical plates the chapters' specimens are drawn as (built 21 Nov 2026
 * from the spec-exploded2 mock, the direction the owner chose, "exploded plates, refined"; its notes are in
 * qa/ideas-nov3/spec-exploded2/notes.md in the main checkout). Dependency-free: it runs in the browser (window.PLATE) and in
 * Node (module.exports), where build/plates.js draws the stills from it.
 *  - One drawing system for all sixteen. Every plate rests in a standard axonometric view, true isometric (35.26 degrees,
 *    45 degrees) or engineering dimetric (axes at 7 and 42 degrees), and holds still once it has settled, so its labels and
 *    dimensions are laid out once and a settled plate costs nothing to keep on screen. The globe (16) is the one that keeps
 *    turning, slowly: a still globe hides the four American towns.
 *  - The reader can turn it: paint() takes a turn off the drawn view (st.dyaw, st.delev); the page (src/app.js Stage) fades
 *    the labels, leaders and dimensions out while it turns (st.labA) and eases it back to the drawn view on release.
 *  - A hierarchy of line weights: shade lines (silhouette edges on the side away from the light, upper left) heaviest,
 *    then outlines, creases, surface detail, hidden lines, centre lines, then dimension and leader lines.
 *  - Restrained tone: three flat values per material by face (top, lit side, shade side); turned surfaces carry fine
 *    shading lines that gather on the shade side, as a patent draughtsman shades a cylinder.
 *  - Leader-line labels in two columns that never cross each other, numbered where the chapter has a parts list, and
 *    dimension lines that break for their figure. Only sizes stated in the caption or the specimen file's header.
 *  - The entrance: the parts come in along their assembly axis and close up into the finished object, hold for a beat,
 *    then open out and settle exploded. Then the centre line, the trace lines, the dimensions and the labels draw on.
 * Canvas for the page, SVG for print stills and the small stills, from the same draw calls. The models are plates/<name>.js,
 * drawn to the dimensions in the header of the old specimen file of the same name (specimens/<name>.js).
 */
(function (root) {
  'use strict';
  var P = { specs: {} };
  P.register = function (name, fn) { P.specs[name] = fn; };
  // phones build turned solids with fewer steps round their axis (round two's level of detail); the stills, built in Node, take all
  P.phone = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 639px)').matches;
  P.segScale = P.phone ? 0.6 : 1;
  // the two standard views: true isometric, and the engineering dimetric (x axis 7 degrees, z axis 42 degrees off level)
  P.ISO = { elev: Math.asin(Math.tan(Math.PI / 6)), yaw: -Math.PI / 4 };
  P.DIM = { elev: 0.33896, yaw: -0.35378 };

  /* ---------------- small math ---------------- */
  function euler(r) {
    r = r || [0, 0, 0];
    var cx = Math.cos(r[0]), sx = Math.sin(r[0]), cy = Math.cos(r[1]), sy = Math.sin(r[1]), cz = Math.cos(r[2]), sz = Math.sin(r[2]);
    return [cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx,
            sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx,
            -sy, cy * sx, cy * cx];
  }
  function mv(m, v) { return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]; }
  function xf(o) {
    var m = euler(o.rot), p = o.pos || [0, 0, 0], s = o.scale == null ? [1, 1, 1] : (typeof o.scale === 'number' ? [o.scale, o.scale, o.scale] : o.scale);
    return {
      p: function (v) { var q = mv(m, [v[0] * s[0], v[1] * s[1], v[2] * s[2]]); return [q[0] + p[0], q[1] + p[1], q[2] + p[2]]; },
      n: function (v) { var q = mv(m, [v[0] / s[0], v[1] / s[1], v[2] / s[2]]), L = Math.hypot(q[0], q[1], q[2]) || 1; return [q[0] / L, q[1] / L, q[2] / L]; }
    };
  }
  function clamp01(t) { return Math.max(0, Math.min(1, t)); }
  function easeOut(t) { t = clamp01(t); return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  // a soft settle: rises past 1 by about 3 percent and comes back, the way a part eases onto its rest
  function settle(t) { t = clamp01(t); var c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  /* ---------------- materials ----------------
     d: how much ink the fill takes on a face square to the light's shade side (top faces take much less), c: colour,
     curve: a turned surface (banded tone and shading lines), hatch: a cut face, ghost: outline only, phantom: dashed.
     A cut face is ruled at its material's own angle (ang, degrees up from level) and pitch (gap, css px at pen 1), as a section
     drawing rules each material its own way (22 Nov 2026, plates critique craft 4): metal at 45 degrees and open, silicon at 135
     and close, copper crossed. Where two cut faces of one kind touch, P.build turns one of them to another angle, so neighbours in
     a section always read apart. */
  var MATS = {
    paper: { d: 0.03 }, light: { d: 0.065 }, steel: { d: 0.11 }, mid: { d: 0.18 }, dark: { d: 0.32 }, black: { d: 0.62 },
    turned: { d: 0.10, curve: true }, turnedDark: { d: 0.22, curve: true },
    acc: { d: 0.34, c: 'acc' }, accLight: { d: 0.17, c: 'acc' }, accDark: { d: 0.6, c: 'acc' }, accTurned: { d: 0.32, c: 'acc', curve: true },
    acc2: { d: 0.34, c: 'acc2' }, acc2Light: { d: 0.17, c: 'acc2' }, acc2Dark: { d: 0.6, c: 'acc2' },
    cut: { d: 0.02, hatch: 1, ang: 45, gap: 3.4 }, cutDense: { d: 0.04, hatch: 2, ang: 135, gap: 2.3 }, cutCross: { d: 0.03, hatch: 3, ang: 45, gap: 3.2 },
    cutAcc: { d: 0.14, c: 'acc', hatch: 1, ang: 45, gap: 3.4 }, cutAcc2: { d: 0.14, c: 'acc2', hatch: 1, ang: 135, gap: 2.8 },
    // the section's materials by name, for the models: metal, silicon, copper, resin or glass, ceramic
    cutMetal: { d: 0.02, hatch: 1, ang: 45, gap: 3.6 }, cutSi: { d: 0.04, hatch: 2, ang: 135, gap: 2.2 }, cutCu: { d: 0.05, hatch: 3, ang: 45, gap: 3.0, c: 'acc2' },
    cutResin: { d: 0.03, hatch: 1, ang: 135, gap: 4.4 }, cutCeramic: { d: 0.03, hatch: 1, ang: 60, gap: 3.0 },
    glass: { d: 0.03, alpha: 0.5 }, ghost: { ghost: true }, phantom: { phantom: true }, phantomAcc: { phantom: true, c: 'acc' }
  };
  /* ---------------- the builder ---------------- */
  function Model() {
    this.V = []; this.VP = [];          // vertices and their part
    this.F = [];                        // faces
    this.S = [];                        // solids and other sortable items
    this.parts = []; this.cur = null;
    this.lines = [];                    // guides, axes, beams
    this.dims = []; this.anchors = []; this.labels = []; this.callouts = []; this._tag = null;
    this.part('main');
  }
  var M = Model.prototype;
  M.part = function (name, o) {
    o = o || {};
    var p = { name: name, ex: o.ex || [0, 0, 0], pri: o.pri || 0, seq: o.seq == null ? this.parts.length : o.seq, mode: o.mode || 'depth', idx: this.parts.length, items: [] };
    this.parts.push(p); this.cur = p; return p;
  };
  M.use = function (p) { this.cur = p; return p; };
  M.mat = function (m) { return typeof m === 'string' ? (MATS[m] || MATS.steel) : (m || MATS.steel); };
  // a solid: faces added between begin and end; its edges are paired at end
  M.begin = function (mat, o) {
    o = o || {};
    var s = { kind: 'solid', part: this.cur.idx, mat: this.mat(mat), f0: this.F.length, f1: 0, decals: [], sortFaces: !!o.sortFaces, two: !!o.two, keep: o.keep !== false, lod: o.lod || 0, alpha: o.alpha };
    this._s = s; this._ec = {}; return s;
  };
  M.v = function (p) { this.V.push(p[0], p[1], p[2]); this.VP.push(this.cur.idx); return this.V.length / 3 - 1; };
  // cls of edge a-b: 0 smooth (drawn only as a silhouette), 1 a feature, 2 a fine line
  M.ecls = function (a, b, c) { this._ec[a < b ? a + '_' + b : b + '_' + a] = c; };
  M.face = function (vi, n, o) {
    o = o || {};
    var f = { v: vi, n: n, s: this.S.length, mat: o.mat ? this.mat(o.mat) : null, curve: !!o.curve, e: null, two: !!o.two, mj: o.mj == null ? -1 : o.mj, flat: !!o.flat };
    this.F.push(f); return f;
  };
  M.end = function (o) {
    var s = this._s, map = {}, F = this.F, ec = this._ec;
    s.f1 = F.length;
    for (var i = s.f0; i < s.f1; i++) {
      var f = F[i], n = f.v.length; f.e = new Array(n);
      for (var k = 0; k < n; k++) {
        var a = f.v[k], b = f.v[(k + 1) % n], key = a < b ? a + '_' + b : b + '_' + a;
        var c = ec[key]; if (c == null) c = 1;
        f.e[k] = [-1, c];
        if (map[key] != null) { var g = map[key]; F[g[0]].e[g[1]][0] = i; f.e[k][0] = g[0]; }
        else map[key] = [i, k];
      }
    }
    // centre of the solid, for sorting
    var cx = 0, cy = 0, cz = 0, m = 0, seen = {};
    for (i = s.f0; i < s.f1; i++) F[i].v.forEach(function (vi) { if (seen[vi]) return; seen[vi] = 1; cx += this.V[vi * 3]; cy += this.V[vi * 3 + 1]; cz += this.V[vi * 3 + 2]; m++; }, this);
    s.c = [cx / m, cy / m, cz / m]; s.ymin = Infinity; s.tag = this._tag;
    for (var vk in seen) s.ymin = Math.min(s.ymin, this.V[vk * 3 + 1]);
    if (o && o.c) s.c = o.c;
    this.S.push(s); this.cur.items.push(s); this._s = null;
    return s;
  };
  // a decal on a solid: lines, outlines or dots lying on one of its faces, drawn when that face looks at the reader
  M.decal = function (s, n, items) { s.decals.push({ n: n, items: items }); return s; };

  /* ---------- primitives ---------- */
  // box: o = { c: centre, s: [w, h, d], rot, decals: { py: [...], px: [...] ... } } ; decal points are in the box's own frame
  M.box = function (o, mat) {
    var t = xf({ pos: o.c, rot: o.rot }), w = o.s[0] / 2, h = o.s[1] / 2, d = o.s[2] / 2, self = this;
    var s = this.begin(mat || o.mat, o);
    var P = [[-w, -h, -d], [w, -h, -d], [w, -h, d], [-w, -h, d], [-w, h, -d], [w, h, -d], [w, h, d], [-w, h, d]].map(function (p) { return self.v(t.p(p)); });
    var faces = { ny: [[0, 1, 2, 3], [0, -1, 0]], py: [[4, 7, 6, 5], [0, 1, 0]], nz: [[0, 4, 5, 1], [0, 0, -1]], pz: [[3, 2, 6, 7], [0, 0, 1]], nx: [[0, 3, 7, 4], [-1, 0, 0]], px: [[1, 5, 6, 2], [1, 0, 0]] };
    var skip = o.skip || [];
    for (var k in faces) { if (skip.indexOf(k) >= 0) continue; this.face(faces[k][0].map(function (i) { return P[i]; }), t.n(faces[k][1]), { mat: o.fmat && o.fmat[k] }); }
    if (o.decals) for (k in o.decals) this.decal(s, t.n(faces[k][1]), mapItems(o.decals[k], t.p));
    return this.end();
  };
  // prism: a polygon in XZ ([[x, z]...], counter-clockwise seen from above or not), from y0 to y1
  M.prism = function (shape, y0, y1, mat, o) {
    o = o || {};
    var t = xf(o), self = this, n = shape.length, s = this.begin(mat, o);
    var area = 0; for (var i = 0; i < n; i++) { var a = shape[i], b = shape[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
    var sg = area > 0 ? 1 : -1; // >0: counter-clockwise in (x, z)
    var lo = shape.map(function (q) { return self.v(t.p([q[0], y0, q[1]])); }), hi = shape.map(function (q) { return self.v(t.p([q[0], y1, q[1]])); });
    for (i = 0; i < n; i++) {
      var j = (i + 1) % n, ax = shape[i], bx = shape[j], dx = bx[0] - ax[0], dz = bx[1] - ax[1], L = Math.hypot(dx, dz) || 1;
      // outward normal of edge in (x, z): for a ccw polygon (x right, z down the page is irrelevant here) it is (dz, -dx)
      var nn = [sg * dz / L, 0, -sg * dx / L];
      this.face([lo[i], lo[j], hi[j], hi[i]], t.n(nn), { curve: !!o.smooth, mat: o.sideMat && o.sideMat[i] });
      if (o.sideDecals && o.sideDecals[i]) this.decal(s, t.n(nn), mapItems(o.sideDecals[i], t.p));
      if (o.smooth) this.ecls(lo[i], hi[i], (o.sharp && o.sharp.indexOf(i) >= 0) ? 1 : 0);
    }
    if (!o.noTop) this.face(hi.slice().reverse(), t.n([0, 1, 0]));
    if (!o.noBottom) this.face(lo.slice(), t.n([0, -1, 0]));
    if (o.top) this.decal(s, t.n([0, 1, 0]), mapItems(o.top, t.p));
    if (o.bottom) this.decal(s, t.n([0, -1, 0]), mapItems(o.bottom, t.p));
    return this.end();
  };
  // a solid of revolution about Y: profile = closed polygon [[r, y, cls?]...], cls 0 smooth ring, 1 feature (default), 2 fine.
  // o.seg steps round a full turn; o.a0..o.a1 sweeps part of a turn and closes the cut with two faces of material o.cut.
  M.revolve = function (profile, mat, o) {
    o = o || {};
    var t = xf(o), self = this, N = Math.max(12, Math.round((o.seg || 40) * (o.fixedSeg ? 1 : P.segScale))), a0 = o.a0 == null ? 0 : o.a0, a1 = o.a1 == null ? Math.PI * 2 : o.a1;
    var full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6, steps = full ? N : Math.max(2, Math.round(N * (a1 - a0) / (Math.PI * 2)));
    var s = this.begin(mat, o), n = profile.length;
    var area = 0; for (var i = 0; i < n; i++) { var A = profile[i], B = profile[(i + 1) % n]; area += A[0] * B[1] - B[0] * A[1]; }
    var sg = area > 0 ? 1 : -1;
    var grid = [];
    for (i = 0; i < n; i++) {
      var r = profile[i][0], y = profile[i][1], row = [];
      if (r < 1e-9) { var c = self.v(t.p([0, y, 0])); for (var j = 0; j <= steps; j++) row.push(c); }
      else for (j = 0; j <= steps; j++) {
        if (full && j === steps) { row.push(row[0]); break; }
        var th = a0 + (a1 - a0) * j / steps; row.push(self.v(t.p([r * Math.cos(th), y, r * Math.sin(th)])));
      }
      grid.push(row);
    }
    var mer = o.mer || 0, heavy = o.heavy || [], curved = [];
    for (i = 0; i < n; i++) {
      var i2 = (i + 1) % n, P0 = profile[i], P1 = profile[i2], dr = P1[0] - P0[0], dy = P1[1] - P0[1], L = Math.hypot(dr, dy) || 1;
      if (P0[0] < 1e-9 && P1[0] < 1e-9) continue; // along the axis
      var nr = sg * dy / L, ny = -sg * dr / L, flat = Math.abs(dy) < 1e-9, cap = !flat && Math.abs(ny) > 0.8;
      if (cap) curved.push(i);
      for (j = 0; j < steps; j++) {
        var thm = a0 + (a1 - a0) * (j + 0.5) / steps, nrm = t.n([nr * Math.cos(thm), ny, nr * Math.sin(thm)]);
        var q = [grid[i][j], grid[i][j + 1], grid[i2][j + 1], grid[i2][j]];
        var vq = q.filter(function (v, k) { return q.indexOf(v) === k; });
        if (vq.length < 3) continue;
        var fc = this.face(vq, nrm, { curve: !flat, mj: vq.length === 4 && !flat ? j : -1 });
        fc.ri = i; fc.cap = cap;
        // meridian edge at j: smooth, unless marked
        var mc = 0; if (mer && j % mer === 0) mc = 2; if (heavy.indexOf(j) >= 0) mc = 1;
        if (!full && j === 0) mc = 1;
        if (grid[i][j] !== grid[i2][j]) this.ecls(grid[i][j], grid[i2][j], mc);
      }
      if (!full && grid[i][steps] !== grid[i2][steps]) this.ecls(grid[i][steps], grid[i2][steps], 1);
    }
    // ring edges at each profile vertex
    for (i = 0; i < n; i++) {
      var cls = profile[i][2] == null ? 1 : profile[i][2];
      for (j = 0; j < steps; j++) if (grid[i][j] !== grid[i][j + 1]) this.ecls(grid[i][j], grid[i][j + 1], cls);
    }
    if (!full) {
      var cm = o.cut ? this.mat(o.cut) : null;
      var n0 = t.n([Math.sin(a0), 0, -Math.cos(a0)]), n1 = t.n([-Math.sin(a1), 0, Math.cos(a1)]);
      var c0 = grid.map(function (row) { return row[0]; }), c1 = grid.map(function (row) { return row[steps]; });
      c0 = c0.filter(function (v, k) { return k === 0 || v !== c0[k - 1]; }); c1 = c1.filter(function (v, k) { return k === 0 || v !== c1[k - 1]; });
      this.face(c0, n0, { mat: cm }); this.face(c1, n1, { mat: cm });
      // a half section: its two cut faces lie in one plane, so no line runs up the axis between them
      if (Math.abs(a1 - a0 - Math.PI) < 1e-6) for (i = 0; i < n; i++) { i2 = (i + 1) % n; if (profile[i][0] < 1e-9 && profile[i2][0] < 1e-9) this.ecls(grid[i][0], grid[i2][0], 0); }
      if (o.cut0) this.decal(s, n0, mapItems(o.cut0, function (p) { return t.p([p[0] * Math.cos(a0), p[1], p[0] * Math.sin(a0)]); }));
      if (o.cut1) this.decal(s, n1, mapItems(o.cut1, function (p) { return t.p([p[0] * Math.cos(a1), p[1], p[0] * Math.sin(a1)]); }));
    }
    if (o.top) this.decal(s, t.n([0, 1, 0]), mapItems(o.top, t.p));
    s.sortFaces = o.sortFaces !== false;
    // its axis, and the two profile rows where a dished end (a mirror's face, a dome) takes its concentric rings (paint)
    s.axisN = t.n([0, 1, 0]);
    s.rings = curved.length >= 3 ? [curved[Math.floor(curved.length / 3)], curved[Math.floor(2 * curved.length / 3)]] : curved.length ? [curved[Math.floor(curved.length / 2)]] : [];
    return this.end();
  };
  M.cyl = function (c, r, h, mat, o) {
    o = o || {};
    var prof = o.rIn ? [[o.rIn, -h / 2], [r, -h / 2], [r, h / 2], [o.rIn, h / 2]] : [[0, -h / 2], [r, -h / 2], [r, h / 2], [0, h / 2]];
    var oo = {}; for (var k in o) oo[k] = o[k]; oo.pos = c; if (o.top) oo.top = o.top;
    return this.revolve(prof, mat, oo);
  };
  // a flat polygon seen from both sides (a membrane, a panel with no thickness)
  M.sheet = function (pts, mat, o) {
    o = o || {};
    var s = this.begin(mat, o), self = this;
    var a = pts[0], b = pts[1], c = pts[2], u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    var n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], L = Math.hypot(n[0], n[1], n[2]) || 1;
    var f = this.face(pts.map(function (p) { return self.v(p); }), [n[0] / L, n[1] / L, n[2] / L], { two: true });
    if (o.decals) this.decal(s, f.n, o.decals);
    s.two = true;
    return this.end();
  };
  // a line drawn in its place among the solids (a pipe, a wire, a probe needle)
  M.wire = function (pts, o) {
    o = o || {};
    var it = { kind: 'wire', part: this.cur.idx, pts: pts, c: o.c || centroid(pts), col: o.col || 'ink', lw: o.lw || 1, dash: o.dash || null, alpha: o.alpha == null ? 1 : o.alpha, lod: o.lod || 0, closed: !!o.closed, vis: o.vis || null };
    it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it;
  };
  // a field of dots in its place among the solids (a bump array, a ball grid, a plasma)
  M.dots = function (pts, o) {
    o = o || {};
    var it = { kind: 'dots', part: this.cur.idx, pts: pts, c: o.c || centroid(pts), col: o.col || 'ink', r: o.r || 1, alpha: o.alpha == null ? 1 : o.alpha, lod: o.lod || 0, ring: !!o.ring, front: !!o.front, keepThumb: !!o.keepThumb };
    it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it;
  };
  // lines that are not parts: guides between parts (each point may name its part), the assembly axis, the light path
  M.guide = function (pts, o) { o = o || {}; this.lines.push({ pts: pts, style: o.style || 'guide', col: o.col || 'ink', lw: o.lw, alpha: o.alpha, lod: o.lod || 0, front: !!o.front }); };
  // a sphere seen as a disc (the globe), lines on its surface (drawn on the near side only) and filled land
  M.globe = function (r, o) { o = o || {}; var it = { kind: 'globe', part: this.cur.idx, r: r, c: [0, 0, 0], fill: o.fill || 'paper' }; it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it; };
  M.swire = function (pts, o) { o = o || {}; var it = { kind: 'swire', part: this.cur.idx, pts: pts, c: [0, 0, 0], col: o.col || 'ink', lw: o.lw || 0.6, alpha: o.alpha == null ? 1 : o.alpha, back: o.back || 0, lod: o.lod || 0 }; it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it; };
  M.land = function (rings, o) { o = o || {}; var it = { kind: 'land', part: this.cur.idx, rings: rings, holes: o.holes || [], c: [0, 0, 0], r: o.r || 1, mat: this.mat(o.mat || 'mid') }; it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it; };
  M.dim = function (a, b, off, text, o) { o = o || {}; this.dims.push({ a: a, b: b, off: off, text: text, part: o.part == null ? this.cur.idx : o.part, bpart: o.bpart, side: o.side || 0, t: o.t == null ? 0.5 : o.t }); };
  M.anchor = function (n, name, at, part) { this.anchors.push({ n: n, name: name, at: at, part: part == null ? this.cur.idx : part }); };
  M.label = function (at, text, o) { o = o || {}; this.labels.push({ at: at, text: text, part: o.part == null ? this.cur.idx : o.part, align: o.align || 'left', dx: o.dx || 0, dy: o.dy || 0, col: o.col || 'muted', size: o.size || 12, weight: o.weight || 500, lead: o.lead }); };

  // a tag names a group of items inside a part, so a label can light just those (the logic dies, not the whole tier)
  M.tag = function (t) { this._tag = t || null; };
  // a leader-line label: at = a point on the drawing (or a list of points), text in the site's words, o.n = the part's
  // number where the chapter has a parts list, o.side 'l' or 'r', o.tag the items it lights on hover
  // A label's part is the part its first leader lands on (22 Nov 2026: it was the part built last, so eight plates lit the wrong
  // part, the etch chamber's pump for every one of its labels)
  M.callout = function (at, text, o) {
    o = o || {};
    var pts = at[0] && at[0].length ? at : [at], own = null;
    pts.forEach(function (q) { if (own == null && q[3] != null) own = q[3]; });
    this.callouts.push({ pts: pts.map(function (q) { return [q[0], q[1], q[2], q[3] == null ? null : q[3]]; }), text: text, n: o.n || 0, part: o.part != null ? o.part : own != null ? own : this.cur.idx, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, strong: !!o.strong, col: o.col || null, only: o.only || null, track: o.track || null, row: o.row || null, rowAt: o.rowAt ? (o.rowAt[0] && o.rowAt[0].length ? o.rowAt : [o.rowAt]) : null });
  };
  function centroid(pts) { var c = [0, 0, 0]; pts.forEach(function (p) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }); return [c[0] / pts.length, c[1] / pts.length, c[2] / pts.length]; }
  function mapItems(items, fn) {
    return items.map(function (it) {
      var o = {}; for (var k in it) o[k] = it[k];
      if (it.pts) o.pts = it.pts.map(fn);
      if (it.dots) o.dots = it.dots.map(fn);
      return o;
    });
  }

  /* ---------- decal helpers (points in the frame they are given) ---------- */
  var D = P.D = {
    rect: function (x0, z0, x1, z1, y, o) { o = o || {}; return assign({ pts: [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], closed: true }, o); },
    rectXY: function (x0, y0, x1, y1, z, o) { o = o || {}; return assign({ pts: [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], closed: true }, o); },
    rectZY: function (z0, y0, z1, y1, x, o) { o = o || {}; return assign({ pts: [[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]], closed: true }, o); },
    line: function (a, b, o) { return assign({ pts: [a, b] }, o || {}); },
    poly: function (pts, o) { return assign({ pts: pts }, o || {}); },
    grid: function (nx, nz, sx, sz, y, o) { // dots on a grid in XZ, centred
      var d = []; for (var a = 0; a < nx; a++) for (var b = 0; b < nz; b++) d.push([(a - (nx - 1) / 2) * sx, y, (b - (nz - 1) / 2) * sz]);
      return assign({ dots: d }, o || {});
    },
    circle: function (cx, cz, r, y, n, o) { var p = []; n = n || 24; for (var i = 0; i < n; i++) { var a = i * Math.PI * 2 / n; p.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); } return assign({ pts: p, closed: true }, o || {}); }
  };
  function assign(a, b) { for (var k in b) a[k] = b[k]; return a; }

  /* ---------- helpers the models share (plates/<name>.js, each wrapped by build/build.js with these as locals) ---------- */
  var TAU = Math.PI * 2;
  // a rectangular frame (a ring of four bars as one solid): outer w x d, inner iw x id, from y0 to y1
  function frame(m, c, w, d, iw, id, y0, y1, mat) {
    m.begin(mat);
    var o = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]], i = [[-iw / 2, -id / 2], [iw / 2, -id / 2], [iw / 2, id / 2], [-iw / 2, id / 2]];
    var V = function (q, y) { return m.v([c[0] + q[0], y, c[2] + q[1]]); };
    var ot = o.map(function (q) { return V(q, y1); }), it = i.map(function (q) { return V(q, y1); }), ob = o.map(function (q) { return V(q, y0); }), ib = i.map(function (q) { return V(q, y0); });
    var outN = [[0, 0, -1], [1, 0, 0], [0, 0, 1], [-1, 0, 0]];
    for (var k = 0; k < 4; k++) {
      var j = (k + 1) % 4;
      m.face([ot[k], ot[j], it[j], it[k]], [0, 1, 0]); m.face([ob[k], ib[k], ib[j], ob[j]], [0, -1, 0]);
      m.face([ob[k], ob[j], ot[j], ot[k]], outN[k]);
      m.face([ib[k], it[k], it[j], ib[j]], [-outN[k][0], 0, -outN[k][2]]);
      m.ecls(ot[k], it[k], 0); m.ecls(ob[k], ib[k], 0);
    }
    return m.end();
  }
  // points on a grid in XZ at height y, centred on (cx, cz); keep(x, z) may leave some out
  function gridPts(nx, nz, sx, sz, y, cx, cz, keep) {
    var p = [];
    for (var a = 0; a < nx; a++) for (var b = 0; b < nz; b++) {
      var x = (cx || 0) + (a - (nx - 1) / 2) * sx, z = (cz || 0) + (b - (nz - 1) / 2) * sz;
      if (!keep || keep(x, z)) p.push([x, y, z]);
    }
    return p;
  }
  // a circle of points; axis 'y' (flat) by default
  function ring(cx, cy, cz, r, n, axis) {
    var p = []; n = n || 32;
    for (var i = 0; i <= n; i++) { var a = i * TAU / n, u = r * Math.cos(a), v = r * Math.sin(a); p.push(axis === 'z' ? [cx + u, cy + v, cz] : axis === 'x' ? [cx, cy + v, cz + u] : [cx + u, cy, cz + v]); }
    return p;
  }
  // the half of a turned part that faces away from the reader at the drawn view: a section shows its cut to the reader
  function farHalf(yaw) { var tv = Math.atan2(Math.cos(yaw), -Math.sin(yaw)); return [tv + Math.PI / 2, tv + Math.PI * 1.5, tv]; }
  // a small seeded random, so a plate is the same drawing every time
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  P.H = { frame: frame, gridPts: gridPts, ring: ring, farHalf: farHalf, rng: rng, TAU: TAU };

  /* ---------------- what the model knows about itself once built (22 Nov 2026) ----------------
     Worked out once in P.build, at the parts' rest: where solids sit on one another (their joints take crease weight, not the
     shade line), which cut faces touch (they take different hatching), and what each label lights. */
  function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  // the closest distance from p to the triangle abc (Ericson, Real-Time Collision Detection 5.1.5)
  function distTri(p, a, b, c) {
    var ab = sub3(b, a), ac = sub3(c, a), ap = sub3(p, a), d1 = dot3(ab, ap), d2 = dot3(ac, ap), q;
    if (d1 <= 0 && d2 <= 0) q = a;
    else {
      var bp = sub3(p, b), d3 = dot3(ab, bp), d4 = dot3(ac, bp);
      if (d3 >= 0 && d4 <= d3) q = b;
      else {
        var vc = d1 * d4 - d3 * d2;
        if (vc <= 0 && d1 >= 0 && d3 <= 0) { var v = d1 / (d1 - d3); q = [a[0] + ab[0] * v, a[1] + ab[1] * v, a[2] + ab[2] * v]; }
        else {
          var cp = sub3(p, c), d5 = dot3(ab, cp), d6 = dot3(ac, cp);
          if (d6 >= 0 && d5 <= d6) q = c;
          else {
            var vb = d5 * d2 - d1 * d6;
            if (vb <= 0 && d2 >= 0 && d6 <= 0) { var ww = d2 / (d2 - d6); q = [a[0] + ac[0] * ww, a[1] + ac[1] * ww, a[2] + ac[2] * ww]; }
            else {
              var va = d3 * d6 - d5 * d4;
              if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) { var w2 = (d4 - d3) / ((d4 - d3) + (d5 - d6)); q = [b[0] + (c[0] - b[0]) * w2, b[1] + (c[1] - b[1]) * w2, b[2] + (c[2] - b[2]) * w2]; }
              else { var den = 1 / (va + vb + vc), v2 = vb * den, w3 = vc * den; q = [a[0] + ab[0] * v2 + ac[0] * w3, a[1] + ab[1] * v2 + ac[1] * w3, a[2] + ab[2] * v2 + ac[2] * w3]; }
            }
          }
        }
      }
    }
    return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  }
  function distSeg(p, a, b) { var ab = sub3(b, a), L = dot3(ab, ab), t = L ? Math.max(0, Math.min(1, dot3(sub3(p, a), ab) / L)) : 0; return Math.hypot(p[0] - a[0] - ab[0] * t, p[1] - a[1] - ab[1] * t, p[2] - a[2] - ab[2] * t); }
  function distPoly3(p, pts, closed, fill) {
    var d = Infinity, i;
    if (fill && pts.length >= 3) for (i = 1; i < pts.length - 1; i++) d = Math.min(d, distTri(p, pts[0], pts[i], pts[i + 1]));
    for (i = 0; i < pts.length - 1; i++) d = Math.min(d, distSeg(p, pts[i], pts[i + 1]));
    if (closed && pts.length > 2) d = Math.min(d, distSeg(p, pts[pts.length - 1], pts[0]));
    if (pts.length === 1) d = Math.min(d, Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1], p[2] - pts[0][2]));
    return d;
  }
  function inPoly2(x, y, pts) { var c = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) c = !c; } return c; }
  function dist2Seg(x, y, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0; return Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t); }
  // a point of a face, in the plane of the face, as 2D (the axis the normal leans on most dropped)
  function flat2(n) { var ax = Math.abs(n[0]), ay = Math.abs(n[1]), az = Math.abs(n[2]); return ax >= ay && ax >= az ? function (p) { return [p[1], p[2]]; } : ay >= az ? function (p) { return [p[0], p[2]]; } : function (p) { return [p[0], p[1]]; }; }
  function isAccC(c) { return c === 'acc' || c === 'acc2'; }
  function accItem(it) { return it.kind === 'solid' ? isAccC(it.mat.c) : isAccC(it.col); }
  function matKey(it) { return it.kind === 'solid' ? it.mat : it.kind + ':' + it.col; }

  // a vertex where the parts rest
  function restPos(m, O) { return function (vi) { var o = O[m.VP[vi]]; return [m.V[vi * 3] + o[0], m.V[vi * 3 + 1] + o[1], m.V[vi * 3 + 2] + o[2]]; }; }

  /* Joints and touching cuts. Flat faces are filed by their plane; a face that lies on a face of another solid, turned the other
     way, is a joint: its edges are drawn at crease weight wherever they lie on that face (s.joint). Cut faces of two solids in one
     plane that touch, ruled alike, have one of them turned to another angle (f.hv). */
  function joints(m, O, size) {
    var F = m.F, at = restPos(m, O), eps = size * 4e-4, near = size * 2.5e-3, files = {}, hfiles = {};
    var keyOf = function (n, d) { return Math.round(n[0] * 40) + ',' + Math.round(n[1] * 40) + ',' + Math.round(n[2] * 40) + '|'; };
    var rec = [];
    m.S.forEach(function (s, si) {
      if (s.kind !== 'solid' || s.mat.ghost || s.mat.phantom || s.two) return;
      for (var fi = s.f0; fi < s.f1; fi++) {
        var f = F[fi]; if (f.curve || f.two || f.v.length < 3) continue;
        var P3 = f.v.map(at), d = dot3(f.n, P3[0]), r = { fi: fi, s: s, si: si, P3: P3, d: d, n: f.n, mat: f.mat || s.mat };
        rec.push(r);
        var k = keyOf(f.n) + Math.round(d / eps);
        (files[k] || (files[k] = [])).push(r);
        if (r.mat.hatch) (hfiles[k] || (hfiles[k] = [])).push(r);
      }
    });
    var look = function (tab, n, d) { var out = [], b = keyOf(n), c = Math.round(d / eps); for (var q = -1; q <= 1; q++) { var l = tab[b + (c + q)]; if (l) out = out.concat(l); } return out; };
    // does the point p (3D, in the face's plane) fall on the face g, or within `near` of its edge
    var onFace = function (p, g) {
      var f2 = flat2(g.n), pp = f2(p), poly = g.P3.map(f2);
      if (inPoly2(pp[0], pp[1], poly)) return true;
      for (var i = 0; i < poly.length; i++) if (dist2Seg(pp[0], pp[1], poly[i], poly[(i + 1) % poly.length]) < near) return true;
      return false;
    };
    rec.forEach(function (r) {
      var opp = look(files, [-r.n[0], -r.n[1], -r.n[2]], -r.d).filter(function (g) { return g.s !== r.s && Math.abs(g.d + r.d) < eps * 1.5; });
      if (!opp.length) return;
      var f = F[r.fi];
      for (var q = 0; q < f.v.length; q++) {
        var a = r.P3[q], b = r.P3[(q + 1) % f.v.length], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        if (opp.some(function (g) { return onFace(mid, g) && onFace(a, g) && onFace(b, g); })) {
          var va = f.v[q], vb = f.v[(q + 1) % f.v.length];
          (r.s.joint || (r.s.joint = {}))[va < vb ? va + '_' + vb : vb + '_' + va] = 1;
        }
      }
    });
    // touching cut faces ruled alike: the later solid takes the next angle that none of its neighbours uses
    var sig = function (r) { var f = F[r.fi], a = f.hv != null ? f.hv : (r.mat.ang == null ? 45 : r.mat.ang); return (r.mat.hatch === 3 ? 'x' : a) + '/' + (r.mat.gap || 0); };
    var turns = [0, 90, 30, 60];
    Object.keys(hfiles).forEach(function (k) {
      var list = hfiles[k];
      for (var i = 0; i < list.length; i++) {
        var r = list[i], fr = F[r.fi];
        if (r.mat.hatch === 3) continue;
        var nb = list.slice(0, i).filter(function (g) { return g.s !== r.s && Math.abs(g.d - r.d) < eps * 1.5 && (g.P3.some(function (p) { return onFace(p, r); }) || r.P3.some(function (p) { return onFace(p, g); })); });
        if (!nb.length) continue;
        var base = r.mat.ang == null ? 45 : r.mat.ang, used = nb.map(sig);
        for (var t = 0; t < turns.length; t++) { fr.hv = (base + turns[t]) % 180; if (used.indexOf(sig(r)) < 0) break; }
        // every face of the same solid in this plane follows, so one part keeps one ruling
        list.forEach(function (g) { if (g.s === r.s) F[g.fi].hv = fr.hv; });
      }
    });
  }

  /* What a label lights (22 Nov 2026, plates critique system 1): its tag if it has one; else the items its leaders land on and
     their kin in the same part (a numbered label, its whole part). Each leader's target is the item nearest its point. Where the
     part holds the target of another label too, the label keeps to the items made of the target's material (the photomask's
     glass, apart from its coating); where the target is in the accent and the rest of its part is not, to the accents (the gas
     cabinet's valves, apart from its walls). A point that lands on no item but on a light path (the electron beam) lights that
     path. */
  function labelTargets(m, O, size) {
    var at = function (q, part) { var o = O[part] || [0, 0, 0]; return [q[0] + o[0], q[1] + o[1], q[2] + o[2]]; };
    var V3 = function (vi) { var o = O[m.VP[vi]]; return [m.V[vi * 3] + o[0], m.V[vi * 3 + 1] + o[1], m.V[vi * 3 + 2] + o[2]]; };
    var distItem = function (it, p, decalTags) {
      var d = Infinity, o = O[it.part];
      if (it.kind === 'solid') {
        if (!decalTags) for (var fi = it.f0; fi < it.f1; fi++) { var f = m.F[fi], P3 = f.v.map(V3); for (var k = 1; k < P3.length - 1; k++) d = Math.min(d, distTri(p, P3[0], P3[k], P3[k + 1])); }
        it.decals.forEach(function (dc) { dc.items.forEach(function (di) { if (decalTags && !(di.tag && decalTags.indexOf(di.tag) >= 0)) return; var pts = (di.pts || di.dots || []).map(function (q) { return [q[0] + o[0], q[1] + o[1], q[2] + o[2]]; }); if (pts.length) d = Math.min(d, di.dots ? Math.min.apply(null, pts.map(function (q) { return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); })) : distPoly3(p, pts, di.closed, !!di.fill)); }); });
      } else if ((it.kind === 'wire' || it.kind === 'dots') && it.pts) {
        var pts = it.pts.map(function (q) { return [q[0] + o[0], q[1] + o[1], q[2] + o[2]]; });
        d = it.kind === 'dots' ? Math.min.apply(null, pts.map(function (q) { return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); })) : distPoly3(p, pts, it.closed, false);
      }
      return d;
    };
    var beams = m.lines.filter(function (L) { return L.style === 'beam'; });
    m.callouts.forEach(function (c) {
      var tags = c.tag ? [].concat(c.tag) : null, T = [];
      c.pts.forEach(function (q) {
        var qp = q[3] == null ? c.part : q[3], p = at(q, qp), best = null, bd = Infinity, beam = null;
        // on a light path (used only where the point lands on no item)
        beams.forEach(function (L) { var pts = L.pts.map(function (r) { return at(r, r[3] == null ? null : r[3]); }); var d = distPoly3(p, pts, false, false); if (d < size * 0.004) beam = { beam: L }; });
        {
          var list = c.focus ? [] : tags ? m.S : (m.parts[qp] ? m.parts[qp].items : []);
          if (c.focus) c.focus.forEach(function (pi) { if (m.parts[pi]) list = list.concat(m.parts[pi].items); });
          list.forEach(function (it) {
            if (it.kind === 'globe' || it.kind === 'land' || it.kind === 'swire' || it.kind === 'rim') return;
            var d, dec = false;
            if (tags) {
              if (it.tag && tags.indexOf(it.tag) >= 0) d = distItem(it, p, null);
              else if (it.kind === 'solid' && it.decals.some(function (dc) { return dc.items.some(function (di) { return di.tag && tags.indexOf(di.tag) >= 0; }); })) { d = distItem(it, p, tags); dec = true; }
              else return;
            } else d = distItem(it, p, null);
            if (d < bd) { bd = d; best = { it: it, decal: dec }; }
          });
        }
        if (beam && (!best || bd > size * 0.006)) best = beam;
        if (best) { best.part = qp; T.push(best); }
      });
      c._targets = T;
    });
    // the items each untagged label lights
    var partsOf = function (c) { var ps = []; c.pts.forEach(function (q) { var p = q[3] == null ? c.part : q[3]; if (ps.indexOf(p) < 0) ps.push(p); }); return ps; };
    m.callouts.forEach(function (c) {
      c._beam = c._targets.some(function (t) { return t.beam; });
      if (c.tag || c.focus || c.track) return;
      var items = [];
      partsOf(c).forEach(function (pi) {
        var T = c._targets.filter(function (t) { return t.it && t.part === pi; }).map(function (t) { return t.it; });
        if (!T.length || !m.parts[pi]) return;
        var all = m.parts[pi].items.filter(function (it) { return it.kind === 'solid' || it.kind === 'wire' || it.kind === 'dots'; });
        var shared = m.callouts.some(function (o) { return o !== c && partsOf(o).indexOf(pi) >= 0; });
        var keep;
        // a numbered part is the model's part, as the chapter's parts list names it
        if (c.n) keep = all;
        else if (shared) { var keys = T.map(matKey); keep = all.filter(function (it) { return keys.indexOf(matKey(it)) >= 0; }); }
        else if (T.every(accItem) && all.some(function (it) { return !accItem(it); })) keep = all.filter(accItem);
        else keep = all;
        T.forEach(function (it) { if (keep.indexOf(it) < 0) keep.push(it); });
        items = items.concat(keep);
      });
      c._items = items; c._ids = {}; items.forEach(function (it) { c._ids[it._id] = 1; });
    });
  }

  P.build = function (name, params) {
    if (!P.specs[name]) throw new Error('unknown plate ' + name);
    var m = new Model();
    var spec = P.specs[name].call(null, m, params || {}, MATS, D) || {};
    m.spec = spec;
    m.elev = spec.elev == null ? P.ISO.elev : spec.elev;
    m.yaw0 = spec.yaw == null ? P.ISO.yaw : spec.yaw;
    m.sortAxis = spec.sortAxis || null;
    // numbered balloons (round two's anchors) become numbered leader labels
    m.anchors.forEach(function (an) {
      var pts = (an.at[0] && an.at[0].length ? an.at : [an.at]).map(function (q) { return [q[0], q[1], q[2], an.part]; });
      if (an.multi) an.multi.forEach(function (mq) { pts.push([mq[1][0], mq[1][1], mq[1][2], mq[0]]); });
      var o = (spec.calloutOpts && spec.calloutOpts[an.n]) || {};
      m.callouts.push({ pts: pts, text: an.name, n: an.n, part: an.part, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, only: o.only || null, row: o.row || null });
    });
    m.callouts.sort(function (a, b) { return (a.n || 99) - (b.n || 99); });
    m.loupe = spec.loupe || null;
    m.EX = [];
    m.S.forEach(function (it) {
      if (it.kind === 'globe') [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach(function (d) { m.EX.push([d[0] * it.r, d[1] * it.r, d[2] * it.r, it.part]); });
      else if (it.pts && (it.kind === 'wire' || it.kind === 'dots')) {
        var st = Math.max(1, Math.floor(it.pts.length / 40)), lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
        for (var i = 0; i < it.pts.length; i++) { for (var j = 0; j < 3; j++) { lo[j] = Math.min(lo[j], it.pts[i][j]); hi[j] = Math.max(hi[j], it.pts[i][j]); } if (i % st === 0) m.EX.push([it.pts[i][0], it.pts[i][1], it.pts[i][2], it.part]); }
        // and, for a field of dots, the corners of its box, so it is fitted by its far corners too
        if (it.kind === 'dots' && it.pts.length > 1) for (var q = 0; q < 8; q++) m.EX.push([q & 1 ? hi[0] : lo[0], q & 2 ? hi[1] : lo[1], q & 4 ? hi[2] : lo[2], it.part]);
      }
    });
    // every item gets an id (what a label lights is a set of ids); then, at the parts' rest, the joints, the touching cuts and
    // what each label lights
    m.S.forEach(function (it, i) { it._id = i; });
    var rest = spec.rest == null ? 1 : spec.rest, O = m.parts.map(function (p) { return [p.ex[0] * rest, p.ex[1] * rest, p.ex[2] * rest]; });
    var lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (var vi = 0; vi < m.V.length; vi += 3) for (var a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], m.V[vi + a]); hi[a] = Math.max(hi[a], m.V[vi + a]); }
    var size = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
    m.size = size;
    try { joints(m, O, size); } catch (e) { void e; }
    try { labelTargets(m, O, size); } catch (e) { if (typeof console !== 'undefined') console.warn('plate labels', name, e && e.message); }
    m.V = new Float32Array(m.V); m.VP = new Int16Array(m.VP);
    return m;
  };

  /* ---------------- the loupe ----------------
     A plate may carry one loupe (spec.loupe: { model, at, part, side, caption }): a second, small plate drawn face on in a disc
     in the top corner of a label column, joined by a faint cone to a ring on the spot it magnifies, with scale bars in the
     site's figures (P.loupeBar) and names (P.loupeTag), and its caption under the disc. It shows where the plate shows its
     dimensions (a chapter's slot and print), and fades with the labels. Memory and HBM's is behind a flag in its model file. */
  // a name or a figure may run to two lines ('\n'); a name may carry a short leader to the point it names (o.lead, in the loupe
  // model's units), so it can stand in the disc's clear ground beside the drawing (22 Nov 2026 designer pass: names laid over
  // the layers they named collided with them)
  P.loupeBar = function (m, a, b, text, o) { o = o || {}; (m.bars || (m.bars = [])).push({ a: a, b: b, text: text, side: o.side, tx: o.tx, ty: o.ty, align: o.align }); };
  P.loupeTag = function (m, at, text, o) { o = o || {}; (m.tags || (m.tags = [])).push({ at: at, text: text, dx: o.dx, dy: o.dy, align: o.align, col: o.col, lead: o.lead || null }); };

  /* ---------------- drawing back-ends ---------------- */
  var FONT = '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
  // the lines of a ruling over a polygon's box: lines at ang degrees up from level (page y runs down), gap apart, each one at a
  // whole number of gaps from the page's origin
  function hatchLines(pts, gap, ang, fn) {
    var t = ang * Math.PI / 180, nx = Math.sin(t), ny = Math.cos(t), dx = Math.cos(t), dy = -Math.sin(t), c0 = Infinity, c1 = -Infinity, t0 = Infinity, t1 = -Infinity;
    pts.forEach(function (p) { var c = p[0] * nx + p[1] * ny, u = p[0] * dx + p[1] * dy; if (c < c0) c0 = c; if (c > c1) c1 = c; if (u < t0) t0 = u; if (u > t1) t1 = u; });
    for (var c = Math.floor(c0 / gap) * gap; c <= c1 + 1e-6; c += gap) fn([nx * c + dx * (t0 - 1), ny * c + dy * (t0 - 1)], [nx * c + dx * (t1 + 1), ny * c + dy * (t1 + 1)]);
  }
  function CanvasG(ctx, dpr) { this.x = ctx; this.k = dpr; this.ga = 1; } // ga: an alpha over everything drawn (the loupe fades with the labels)
  CanvasG.prototype = {
    poly: function (pts, fill, alpha) {
      var x = this.x; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath();
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.fillStyle = fill; x.fill(); x.globalAlpha = 1;
    },
    // ruled at ang degrees up from level, from a fixed page origin, so neighbouring cut faces of one ruling share their lines
    hatch: function (pts, col, gap, lw, kind, alpha, ang) {
      var x = this.x;
      x.save(); x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]);
      x.closePath(); x.clip();
      x.beginPath();
      hatchLines(pts, gap, ang == null ? 45 : ang, function (a, b) { x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); });
      if (kind === 3) hatchLines(pts, gap * 1.5, (ang == null ? 45 : ang) + 90, function (a, b) { x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); });
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.strokeStyle = col; x.lineWidth = lw; x.setLineDash([]); x.lineCap = 'butt'; x.stroke(); x.restore();
    },
    lines: function (segs, col, lw, dash, alpha, cap) {
      if (!segs.length) return;
      var x = this.x; x.beginPath();
      for (var i = 0; i < segs.length; i++) { var s = segs[i]; x.moveTo(s[0][0], s[0][1]); for (var k = 1; k < s.length; k++) x.lineTo(s[k][0], s[k][1]); }
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.strokeStyle = col; x.lineWidth = lw; x.lineCap = cap || 'round'; x.lineJoin = 'round';
      x.setLineDash(dash || []); x.stroke(); x.setLineDash([]); x.globalAlpha = 1;
    },
    dots: function (pts, r, col, alpha, ring) {
      var x = this.x; x.beginPath();
      if (!ring && r * (this.k || 1) < 2.4) { var d = r * 1.75; for (var j = 0; j < pts.length; j++) x.rect(pts[j][0] - d / 2, pts[j][1] - d / 2, d, d); x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.fillStyle = col; x.fill(); x.globalAlpha = 1; return; }
      for (var i = 0; i < pts.length; i++) { x.moveTo(pts[i][0] + r, pts[i][1]); x.arc(pts[i][0], pts[i][1], r, 0, Math.PI * 2); }
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga;
      if (ring) { x.strokeStyle = col; x.lineWidth = Math.max(0.55, r * 0.42); x.stroke(); } else { x.fillStyle = col; x.fill(); }
      x.globalAlpha = 1;
    },
    circle: function (cx, cy, r, fill, stroke, lw, alpha) { var x = this.x; x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.setLineDash([]); x.stroke(); } x.globalAlpha = 1; },
    text: function (s, px, py, o) {
      var x = this.x; x.font = (o.weight || 500) + ' ' + o.size + 'px ' + (o.family || FONT);
      x.textAlign = o.align || 'left'; x.textBaseline = o.base || 'middle';
      x.globalAlpha = (o.alpha == null ? 1 : o.alpha) * this.ga;
      if (o.halo) { x.lineWidth = o.haloW || 4; x.strokeStyle = o.halo; x.lineJoin = 'round'; x.strokeText(s, px, py); }
      x.fillStyle = o.fill; x.fillText(s, px, py); x.globalAlpha = 1;
    },
    // a circular clip, for the loupe's disc
    clip: function (cx, cy, r) { var x = this.x; x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip(); },
    unclip: function () { this.x.restore(); },
    measure: function (s, o) { var x = this.x; x.font = (o.weight || 500) + ' ' + o.size + 'px ' + (o.family || FONT); return x.measureText(s).width; },
    arrow: function (tip, dir, len, col, wid, alpha) { var x = this.x, n = [-dir[1], dir[0]], w = wid || len * 0.28; x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.beginPath(); x.moveTo(tip[0], tip[1]); x.lineTo(tip[0] - dir[0] * len + n[0] * w, tip[1] - dir[1] * len + n[1] * w); x.lineTo(tip[0] - dir[0] * len - n[0] * w, tip[1] - dir[1] * len - n[1] * w); x.closePath(); x.fillStyle = col; x.fill(); x.globalAlpha = 1; }
  };
  // ids carry a prefix of their own, so several stills inline in one page (the book, printed) never share a clip
  function SvgG(w, h, pre) { this.out = []; this.defs = {}; this.w = w; this.h = h; this.cid = 0; this.pre = pre || ''; this.mfn = null; this.ga = 1; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function ptsStr(pts) { return pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  SvgG.prototype = {
    poly: function (pts, fill, alpha) { this.out.push('<polygon points="' + ptsStr(pts) + '" fill="' + fill + '"' + (alpha != null && alpha < 1 ? ' fill-opacity="' + f1(alpha * 100) / 100 + '"' : '') + '/>'); },
    hatch: function (pts, col, gap, lw, kind, alpha, ang) {
      var id = this.pre + 'c' + (this.cid++), d = '', seg = function (a, b) { d += 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]); };
      hatchLines(pts, gap, ang == null ? 45 : ang, seg);
      if (kind === 3) hatchLines(pts, gap * 1.5, (ang == null ? 45 : ang) + 90, seg);
      this.out.push('<clipPath id="' + id + '"><polygon points="' + ptsStr(pts) + '"/></clipPath><path clip-path="url(#' + id + ')" d="' + d + '" stroke="' + col + '" stroke-width="' + f1(lw * 100) / 100 + '"' + (alpha != null && alpha < 1 ? ' stroke-opacity="' + f1(alpha * 100) / 100 + '"' : '') + ' fill="none"/>');
    },
    lines: function (segs, col, lw, dash, alpha, cap) {
      if (!segs.length) return;
      var d = segs.map(function (s) { return 'M' + s.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L'); }).join('');
      this.out.push('<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + f1(lw * 100) / 100 + '" stroke-linecap="' + (cap || 'round') + '" stroke-linejoin="round"' + (dash ? ' stroke-dasharray="' + dash.map(f1).join(' ') + '"' : '') + (alpha != null && alpha < 1 ? ' stroke-opacity="' + f1(alpha * 100) / 100 + '"' : '') + '/>');
    },
    dots: function (pts, r, col, alpha, ring) {
      var d = pts.map(function (p) { return 'M' + f1(p[0] - r) + ' ' + f1(p[1]) + 'a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(2 * r) + ' 0a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(-2 * r) + ' 0'; }).join('');
      this.out.push('<path d="' + d + '" ' + (ring ? 'fill="none" stroke="' + col + '" stroke-width="' + f1(Math.max(0.55, r * 0.42)) + '"' : 'fill="' + col + '"') + (alpha != null && alpha < 1 ? ' opacity="' + f1(alpha * 100) / 100 + '"' : '') + '/>');
    },
    circle: function (cx, cy, r, fill, stroke, lw) { this.out.push('<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + lw + '"' : '') + '/>'); },
    text: function (s, px, py, o) {
      var anchor = o.align === 'center' ? 'middle' : o.align === 'right' ? 'end' : 'start';
      var esc = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      this.out.push('<text x="' + f1(px) + '" y="' + f1(py) + '" text-anchor="' + anchor + '" dominant-baseline="central" font-family="Hanken Grotesk, Helvetica Neue, Arial, sans-serif" font-size="' + o.size + '" font-weight="' + (o.weight || 500) + '" fill="' + o.fill + '"' + (o.halo ? ' stroke="' + o.halo + '" stroke-width="' + (o.haloW || 4) + '" paint-order="stroke" stroke-linejoin="round"' : '') + '>' + esc + '</text>');
    },
    clip: function (cx, cy, r) { var id = this.pre + 'k' + (this.cid++); this.out.push('<clipPath id="' + id + '"><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '"/></clipPath><g clip-path="url(#' + id + ')">'); },
    unclip: function () { this.out.push('</g>'); },
    measure: function (s, o) { return this.mfn ? this.mfn(s, o) : String(s).length * o.size * (o.weight >= 600 ? 0.56 : 0.53); },
    arrow: function (tip, dir, len, col, wid) { var n = [-dir[1], dir[0]], w = wid || len * 0.28; this.poly([tip, [tip[0] - dir[0] * len + n[0] * w, tip[1] - dir[1] * len + n[1] * w], [tip[0] - dir[0] * len - n[0] * w, tip[1] - dir[1] * len - n[1] * w]], col); },
    svg: function (bg) {
      var defs = Object.keys(this.defs).map(function (k) { return this.defs[k]; }, this).join('');
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + Math.round(this.w) + ' ' + Math.round(this.h) + '" width="' + Math.round(this.w) + '" height="' + Math.round(this.h) + '">' + (defs ? '<defs>' + defs + '</defs>' : '') + (bg ? '<rect width="100%" height="100%" fill="' + bg + '"/>' : '') + this.out.join('') + '</svg>';
    }
  };

  /* ---------------- colours ---------------- */
  function hex(c) { c = (c || '').trim(); if (c[0] === '#') { if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; } var m = c.match(/\d+(\.\d+)?/g); return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function css(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
  function lift(rgb) {
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d > 0) { s = d / (1 - Math.abs(2 * l - 1)); if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    if (l >= 0.62) return rgb.slice(); l = 0.62;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, o;
    if (h < 60) o = [c, x, 0]; else if (h < 120) o = [x, c, 0]; else if (h < 180) o = [0, c, x]; else if (h < 240) o = [0, x, c]; else if (h < 300) o = [x, 0, c]; else o = [c, 0, x];
    return [(o[0] + m) * 255, (o[1] + m) * 255, (o[2] + m) * 255];
  }
  P.palette = function (el, spec, dark, print) {
    var cs = typeof getComputedStyle !== 'undefined' && el ? getComputedStyle(el) : { getPropertyValue: function () { return ''; } };
    var bg = hex(cs.getPropertyValue('--bg') || (dark ? '#141413' : '#fcfcfa')), ink = hex(cs.getPropertyValue('--ink') || (dark ? '#ecebe6' : '#171716')), muted = hex(cs.getPropertyValue('--muted') || '#6b6a64');
    if (!cs.getPropertyValue('--bg')) { bg = dark ? [20, 20, 19] : [252, 252, 250]; ink = dark ? [236, 235, 230] : [23, 23, 22]; muted = dark ? [160, 158, 150] : [107, 106, 100]; }
    if (print) { bg = [255, 255, 255]; ink = [0, 0, 0]; muted = [70, 70, 70]; dark = false; }
    var acc = spec.accent || [122, 31, 43], acc2 = spec.accent2 || acc, hl = [122, 31, 43];
    if (dark) { acc = spec.accentDark || lift(acc); acc2 = spec.accent2Dark || (spec.accent2 ? lift(spec.accent2) : acc); hl = [214, 104, 124]; }
    return { bg: bg, ink: ink, muted: muted, acc: acc, acc2: acc2, hl: hl, dark: !!dark };
  };

  /* ---------------- what a focus lights ----------------
     A focus names the parts its label points at, or the tags of the items it means (strict: only those), and may keep to the
     ink or to the accents (only), as the light tables of data/specimen-parts.json do: the HBM stack's TSVs light every via in
     every die and nothing else. A decal (host: the solid it lies on) is lit by its own tag, by its solid's tag, or with its
     solid's part. */
  function isAcc(c) { return c === 'acc' || c === 'acc2'; }
  P.lit = function (foc, it, host) {
    if (!foc) return false;
    var tagged = !!(foc.tags && it.tag && foc.tags.indexOf(it.tag) >= 0);
    var hostTag = !!(host && foc.tags && host.tag && foc.tags.indexOf(host.tag) >= 0);
    var byPart = !!(foc.parts && foc.parts.indexOf(host ? host.part : it.part) >= 0 && !(foc.tags && foc.strict));
    // a label that keeps to the items its leaders land on and their kin (labelTargets): a decal goes with the solid it lies on
    var byItem = !!(foc.ids && foc.ids[(host || it)._id]);
    var on = tagged || hostTag || byPart || byItem;
    if (!on || !foc.only) return on;
    var acc = host ? (isAcc(it.col) || isAcc(it.fillCol) || (it.fill && typeof it.fill === 'string' && /^acc/.test(it.fill))) : it.kind === 'solid' ? isAcc(it.mat.c) : isAcc(it.col);
    return foc.only === 'accent' ? acc : !acc;
  };

  /* ---------------- the view ---------------- */
  function viewM(yaw, elev) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), ce = Math.cos(elev), se = Math.sin(elev);
    return [cy, 0, sy, sy * se, ce, -cy * se, -sy * ce, se, cy * ce];
  }

  /* ---------------- a plate: one model, drawn into whatever canvas or still asks for it ---------------- */
  function Plate(name, o) {
    o = o || {};
    this.name = name; this.o = o;
    this.m = P.build(name, o.params);
    this.lod = o.lod || 'full'; this.focus = null;
    this.spins = !!this.m.spec.spin; // the globe keeps turning
  }
  P.Plate = Plate;
  var PL = Plate.prototype;

  // the entrance, k from 0 to 1: in from further out along the assembly axis, closed up (k 0.40 to 0.50), then open
  // out to rest with a soft settle (to k 0.82). A part with no offset (the base) only fades in.
  var A1 = 0.40, B0 = 0.50, B1 = 0.82;
  PL.offsets = function (k, thumb) {
    var m = this.m, sp = m.spec, n = m.parts.length, out = new Array(n), alpha = new Array(n), seqMax = 0;
    m.parts.forEach(function (p) { if (p.seq > seqMax) seqMax = p.seq; });
    var S = sp.start == null ? 1.8 : sp.start, rest = sp.rest == null ? 1 : sp.rest;
    for (var i = 0; i < n; i++) {
      var p = m.parts[i], ex = p.ex, moving = ex[0] || ex[1] || ex[2], f, a;
      if (thumb) { f = rest * (sp.thumbX == null ? 0.6 : sp.thumbX); a = 1; }
      else if (k >= 1) { f = rest; a = 1; }
      else {
        var lag = seqMax ? p.seq / seqMax : 0, a0 = lag * 0.14, a1 = a0 + 0.26, ta = clamp01((k - a0) / (a1 - a0));
        if (k < a1) f = S * (1 - easeInOut(ta));
        else { var b0 = B0 + (1 - lag) * 0.06, tb = clamp01((k - b0) / (B1 - B0 - 0.06)); f = rest * (tb > 0 ? settle(tb) : 0); }
        a = moving ? clamp01(ta * 2.2) : clamp01(k / 0.16);
      }
      out[i] = [ex[0] * f, ex[1] * f, ex[2] * f]; alpha[i] = a;
    }
    return { o: out, a: alpha };
  };
  // the drawing's extent at rest, in model units seen from the view: used to fit it to its canvas
  PL.extent = function (thumb) {
    var m = this.m, V = m.V, VP = m.VP, off = this.offsets(1, thumb).o, R = viewM(m.yaw0, m.elev);
    var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
    var add = function (x, y, z) { var sx = R[0] * x + R[1] * y + R[2] * z, sy = R[3] * x + R[4] * y + R[5] * z; if (sx < minx) minx = sx; if (sx > maxx) maxx = sx; if (sy < miny) miny = sy; if (sy > maxy) maxy = sy; };
    for (var i = 0; i < V.length / 3; i++) { var o = off[VP[i]]; add(V[i * 3] + o[0], V[i * 3 + 1] + o[1], V[i * 3 + 2] + o[2]); }
    m.EX.forEach(function (q) { var o = off[q[3]]; add(q[0] + o[0], q[1] + o[1], q[2] + o[2]); });
    m.S.forEach(function (it) { if (it.kind === 'globe') { minx = Math.min(minx, -it.r); maxx = Math.max(maxx, it.r); miny = Math.min(miny, -it.r); maxy = Math.max(maxy, it.r); } });
    if (!thumb) m.dims.forEach(function (d) { var oa = off[d.part] || [0, 0, 0], ob = off[d.bpart == null ? d.part : d.bpart] || [0, 0, 0]; add(d.a[0] + d.off[0] + oa[0], d.a[1] + d.off[1] + oa[1], d.a[2] + d.off[2] + oa[2]); add(d.b[0] + d.off[0] + ob[0], d.b[1] + d.off[1] + ob[1], d.b[2] + d.off[2] + ob[2]); });
    if (!thumb) m.lines.forEach(function (L) { if (L.style !== 'axis') return; L.pts.forEach(function (q) { var o = q[3] == null ? [0, 0, 0] : off[q[3]]; add(q[0] + o[0], q[1] + o[1], q[2] + o[2]); }); });
    return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
  };
  // label columns: how wide each side needs to be at canvas width w
  // review: no figure on a plate under 11.5 px (narrow balloons were r 7.2 with 10 px digits at phone widths)
  PL.labelStyle = function (w) { var narrow = w < 560, no = !!this.o.numbersOnly; return { fs: narrow ? 11.5 : 13, num: no ? 11 : narrow ? 10 : 9, numbersOnly: no, wrapW: narrow ? Math.max(70, w * 0.22) : 140 }; };
  PL.wrap = function (text, ls, g) {
    var meas = function (s) { return g ? g.measure(s, { size: ls.fs, weight: 500 }) : s.length * ls.fs * 0.53; };
    if (meas(text) <= ls.wrapW || text.indexOf(' ') < 0) return [text];
    var words = text.split(' '), best = null;
    for (var i = 1; i < words.length; i++) { var a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), m2 = Math.max(meas(a), meas(b)); if (!best || m2 < best[0]) best = [m2, a, b]; }
    return [best[1], best[2]];
  };
  /* Below about 560 px a plate with word labels sets them in a row above the drawing and a row under it, on upright leaders, so
     the drawing keeps the full width (22 Nov 2026, craft 10); numbered balloons stay in their narrow columns. The globe, whose
     labels follow its towns round, keeps its columns. */
  PL.rowsOn = function (w) {
    var m = this.m, ls = this.labelStyle(w);
    return w < 560 && this.lod === 'full' && !this.o.noLabels && m.callouts.length > 0 && !m.callouts.some(function (c) { return c.track; }) && m.callouts.some(function (c) { return !(ls.numbersOnly && c.n); });
  };
  PL.rooms = function (w, g) {
    var m = this.m, self = this;
    if (this.lod !== 'full' || this.o.noLabels || !m.callouts.length) return { l: 0, r: 0, t: 0, b: 0 };
    var ls = this.labelStyle(w), e = this.ext || (this.ext = this.extent()), R = viewM(m.yaw0, m.elev), off = this.offsets(1).o, mid = (e.minx + e.maxx) / 2, midY = (e.miny + e.maxy) / 2;
    var room = { l: 0, r: 0, t: 0, b: 0 }, rows = this.rowsOn(w);
    m.callouts.forEach(function (c) {
      // (in rows a label may point at another spot on its part, c.rowAt, where an upright leader runs clear)
      var mx = 0, my = 0, src = rows && c.rowAt ? c.rowAt : c.pts; src.forEach(function (q) { var o = off[q[3] == null ? c.part : q[3]] || [0, 0, 0], x = q[0] + o[0], y = q[1] + o[1], z = q[2] + o[2]; mx += R[0] * x + R[1] * y + R[2] * z; my += R[3] * x + R[4] * y + R[5] * z; }); mx /= src.length; my /= src.length;
      var lines = ls.numbersOnly && c.n ? [] : self.wrap(c.text, ls, g), tw = 0;
      lines.forEach(function (s) { tw = Math.max(tw, g ? g.measure(s, { size: ls.fs, weight: 500 }) : s.length * ls.fs * 0.53); });
      c._lines = lines;
      if (rows) {
        // (a label may keep to one row, c.row, where the other would set it over a loupe's cone)
        var row = c.row || (my > midY ? 't' : 'b'); c._side = row;
        var hh = Math.max(1, lines.length) * ls.fs * 1.18 + 18;
        if (hh > room[row]) room[row] = hh;
        return;
      }
      var side = c._flip || c.side || (mx < mid ? 'l' : 'r'); c._side = side;
      var need = tw + (c.n ? ls.num * 2 + 6 : 0) + 30;
      if (need > room[side]) room[side] = need;
    });
    // the loupe takes the top of its label column, which is then at least as wide as the disc; on a narrow plate it sits under
    // the drawing
    var LG = this.loupeOn() ? this.loupeGeom(w, 0, g) : null;
    // under 560 px the disc stands under the row of labels, so the foot takes both
    if (LG && LG.side === 'b') room.b = (room.b || 0) + LG.need;
    else if (LG) room[LG.side] = Math.max(room[LG.side], 2 * LG.r + LG.mg + 14 - LG.inset);
    return room;
  };
  // the canvas's top and foot pads: the drawing's ink stands this far inside them, so the page sets the space round the plate
  // (src/modules/chapter.css .ch-spec: 40 px over the drawing, 24 px under it)
  var PAD_Y = 8;
  PL.fit = function (w, h, g) {
    var e = this.ext || (this.ext = this.extent(this.lod === 'thumb')), rooms = this.rooms(w, g);
    var padX = this.lod === 'thumb' ? w * 0.04 : Math.max(10, w * (this.o.pad == null ? 0.025 : this.o.pad)), padY = this.lod === 'thumb' ? h * 0.04 : this.o.pad != null ? Math.max(10, h * 0.03) : PAD_Y;
    var ew = e.maxx - e.minx, eh = e.maxy - e.miny, aw = w - rooms.l - rooms.r - 2 * padX, ah = h - 2 * padY - (rooms.t || 0) - (rooms.b || 0);
    var sc = Math.min(aw / ew, ah / eh);
    if (this.o.maxScale) sc = Math.min(sc, this.o.maxScale);
    // the drawing and its label columns are centred together
    var used = rooms.l + rooms.r + sc * ew, x0 = (w - used) / 2 + rooms.l;
    return { s: sc, cx: x0 - sc * e.minx, cy: padY + (rooms.t || 0) + (ah - sc * eh) / 2 + sc * e.maxy, e: e, rooms: rooms };
  };
  // is the loupe drawn: a plate with one, in a mode that shows dimensions (or the phone's one), unless the page turns loupes off
  PL.loupeOn = function () { return !!(this.m.loupe && this.lod === 'full' && (!this.o.noDims || this.o.oneDim) && !this.o.noLabels && P.loupes !== false); };
  // its disc: the top corner of its label column, a radius that grows with the width, and the caption's lines under it; under
  // 560 px, the foot's right corner, under the drawing (h, the canvas's height, places it there)
  /* Under 560 px (22 Nov 2026 designer pass) the disc keeps a radius its drawing and names can be read at, about a quarter of
     the width, in the foot's right corner under the label row, and its caption stands to its left, wrapped to the room there
     (it was a 58 px disc whose names ran into one another, its caption cut off at the screen's edge, over the row of labels).
     On a wide plate a loupe may set its disc into the drawing's empty top corner by L.inset px, so its column takes less of
     the width from the drawing. */
  PL.loupeGeom = function (w, h, g) {
    var L = this.m.loupe, r = Math.round(Math.max(56, Math.min(L.rMax || 104, (L.r || 0.155) * w))), mg = 10, side = L.side || 'r';
    var cap = L.caption || [], capH = cap.length ? 15 + cap.length * 16 : 0;
    if (w < 560) {
      // (in the foot's corner on the loupe's own side, so its cone keeps to that side of the drawing; the caption beside it)
      var hh = h || 0, rp = Math.round(Math.max(64, Math.min(L.rMax || 104, 0.23 * w))), lf = side === 'l', xp = lf ? mg + rp + 4 : w - mg - rp - 4, room = (lf ? w - xp : xp) - rp - 14 - mg;
      // the caption's words, wrapped to the room left of the disc
      var meas = function (s) { return g ? g.measure(s, { size: 12, weight: 500 }) : s.length * 12 * 0.53; }, words = cap.join(' ').split(' '), out = [], ln = '';
      words.forEach(function (wd) { var t = ln ? ln + ' ' + wd : wd; if (ln && meas(t) > room) { out.push(ln); ln = wd; } else ln = t; });
      if (ln) out.push(ln);
      return { side: 'b', capSide: lf ? 'r' : 'l', r: rp, mg: mg, x: xp, y: hh - mg - rp - 4, cap: out, bottom: hh, need: 2 * rp + 2 * mg + 8 };
    }
    return { side: side, r: r, mg: mg, x: side === 'r' ? w - mg - r : mg + r, y: mg + r, cap: cap, bottom: mg + 2 * r + capH + 14, inset: L.inset || 0 };
  };
  PL.loupePlate = function () { var L = this.m.loupe; if (!this._lp && L && L.model) this._lp = new Plate(L.model, {}); return this._lp; };
  // the canvas's height for a width: the drawing at the scale its width allows, its pads, and the rows or loupe it carries, kept
  // tall enough for its label columns
  PL.heightFor = function (w, lo, hi) {
    var e = this.ext || (this.ext = this.extent()), rooms = this.rooms(w), padX = Math.max(10, w * 0.025), ls = this.labelStyle(w), self = this;
    var sc = (w - rooms.l - rooms.r - 2 * padX) / (e.maxx - e.minx), h = sc * (e.maxy - e.miny) + 2 * PAD_Y + (rooms.t || 0) + (rooms.b || 0);
    if (this.m.spec.maxH) hi = Math.min(hi, this.m.spec.maxH);
    // a label column needs room for its labels, one under another
    if (!this.rowsOn(w) && !this.o.noLabels) ['l', 'r'].forEach(function (sd) {
      var need = 0; self.m.callouts.forEach(function (c) { if ((c._side || c.side) === sd) need += Math.max(1, (c._lines || [c.text]).length) * ls.fs * 1.18 + ls.fs * 0.85; });
      lo = Math.max(lo, need + 2 * ls.fs);
    });
    if (this.loupeOn() && w >= 560) {
      // the labels under the disc, one under another, as the layout sets them (22 Nov 2026: it kept 2.4 lines a label, which
      // left an empty band under the photomask)
      var LG = this.loupeGeom(w), n = 0, need = 0;
      this.m.callouts.forEach(function (c) { if ((c._side || c.side) === LG.side) { need += Math.max(1, (c._lines || [c.text]).length) * ls.fs * 1.18; n++; } });
      if (n) need += (n - 1) * ls.fs * 0.85 + ls.fs + 1;
      lo = Math.max(lo, LG.bottom + need);
    }
    var out = Math.round(Math.max(lo, Math.min(hi, h)));
    // the labels were wrapped with a guess at the faces' widths: the next frame lays them out again with the real ones
    this.m.callouts.forEach(function (c) { c._lines = null; }); this._fitKey = null;
    return out;
  };

  function partial(pts, t) { // the first t of a polyline, by length
    if (t >= 1) return pts; if (t <= 0) return [];
    var L = 0, i; for (i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    var want = L * t, out = [pts[0]], acc = 0;
    for (i = 1; i < pts.length; i++) {
      var s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (acc + s >= want) { var f = s ? (want - acc) / s : 0; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]); return out; }
      acc += s; out.push(pts[i]);
    }
    return out;
  }

  // the drawing's box at a turned view (R), in the view's units, with the parts at rest: a turned plate keeps inside its canvas
  PL.turnBox = function (R, O) {
    var m = this.m, V = m.V, VP = m.VP, minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
    var add = function (x, y, z) { var sx = R[0] * x + R[1] * y + R[2] * z, sy = R[3] * x + R[4] * y + R[5] * z; if (sx < minx) minx = sx; if (sx > maxx) maxx = sx; if (sy < miny) miny = sy; if (sy > maxy) maxy = sy; };
    for (var i = 0; i < V.length / 3; i++) { var o = O[VP[i]]; add(V[i * 3] + o[0], V[i * 3 + 1] + o[1], V[i * 3 + 2] + o[2]); }
    m.EX.forEach(function (q) { var o = O[q[3]]; add(q[0] + o[0], q[1] + o[1], q[2] + o[2]); });
    m.S.forEach(function (it) { if (it.kind === 'globe') { minx = Math.min(minx, -it.r); maxx = Math.max(maxx, it.r); miny = Math.min(miny, -it.r); maxy = Math.max(maxy, it.r); } });
    return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
  };

  /* draw one frame. st = { k: entrance 0..1, w, h (css px), g: back-end, pal, lod, dyaw and delev: the reader's turn off the
     drawn view (radians), labA: how much of the labels, leaders and dimensions shows (they fade while the plate turns),
     pick: record the faces drawn, for the pointer (PL.hitAt) } */
  PL.paint = function (st) {
    var m = this.m, g = st.g, pal = st.pal, w = st.w, h = st.h, lod = st.lod || this.lod, thumb = lod === 'thumb';
    var dyaw = st.dyaw || 0, delev = st.delev || 0, turned = !!(dyaw || delev);
    var fit = st.fit || this.fit(w, h, g), sc = fit.s * (st.scale || 1), R = viewM(m.yaw0 + dyaw, m.elev + delev), K = st.k == null ? 1 : st.k;
    var R0 = turned ? viewM(m.yaw0, m.elev) : R, LA = st.labA == null ? 1 : st.labA;
    var offs = this.offsets(K, thumb), O = offs.o, A = offs.a;
    var V = m.V, VP = m.VP, nv = V.length / 3, X = this._X || (this._X = new Float32Array(nv * 3));
    var cx = fit.cx, cy = fit.cy;
    if (st.scale && st.scale !== 1) { cx = w / 2 + (fit.cx - w / 2) * st.scale; cy = h / 2 + (fit.cy - h / 2) * st.scale; }
    if (turned && !thumb) {
      // turned, the drawing keeps its centre and size, but stays inside the canvas: its labels have faded, so it may use their
      // columns, and it shrinks only where a turn would carry it past an edge
      var e0 = fit.e, mx0 = cx + sc * (e0.minx + e0.maxx) / 2, my0 = cy - sc * (e0.miny + e0.maxy) / 2, tb = this.turnBox(R, O), pad = 6;
      var tf = Math.min(1, (w - 2 * pad) / (sc * (tb.maxx - tb.minx) || 1), (h - 2 * pad) / (sc * (tb.maxy - tb.miny) || 1));
      sc *= tf; cx = mx0 + (cx - mx0) * tf; cy = my0 + (cy - my0) * tf;
      var bl = cx + sc * tb.minx, br = cx + sc * tb.maxx, bt = cy - sc * tb.maxy, bb = cy - sc * tb.miny;
      if (bl < pad) cx += pad - bl; else if (br > w - pad) cx -= br - (w - pad);
      if (bt < pad) cy += pad - bt; else if (bb > h - pad) cy -= bb - (h - pad);
    }
    for (var i = 0; i < nv; i++) {
      var o = O[VP[i]], x = V[i * 3] + o[0], y = V[i * 3 + 1] + o[1], z = V[i * 3 + 2] + o[2];
      X[i * 3] = cx + sc * (R[0] * x + R[1] * y + R[2] * z);
      X[i * 3 + 1] = cy - sc * (R[3] * x + R[4] * y + R[5] * z);
      X[i * 3 + 2] = R[6] * x + R[7] * y + R[8] * z;
    }
    var proj = function (p, part) { var o = part == null ? [0, 0, 0] : O[part], x = p[0] + o[0], y = p[1] + o[1], z = p[2] + o[2]; return [cx + sc * (R[0] * x + R[1] * y + R[2] * z), cy - sc * (R[3] * x + R[4] * y + R[5] * z), R[6] * x + R[7] * y + R[8] * z]; };
    var depthOf = function (c, part) { var o = O[part]; return R[6] * (c[0] + o[0]) + R[7] * (c[1] + o[1]) + R[8] * (c[2] + o[2]); };
    var rotN = function (n) { return [R[0] * n[0] + R[1] * n[1] + R[2] * n[2], R[3] * n[0] + R[4] * n[1] + R[5] * n[2], R[6] * n[0] + R[7] * n[1] + R[8] * n[2]]; };

    // the hierarchy of line weights, css px. One pen for the set: it follows the slot's width alone (22 Nov 2026; it followed the
    // height too, so plates in one 666 px slot drew 31 percent apart)
    var lite = !!st.lite;
    var k = thumb ? 1 : Math.max(0.8, Math.min(1.2, (st.penW || w) / 620));
    // a small still's ink (st.inkK, build/plate-stills.js): its lines and fills together, so every small still carries 10 to
    // 25 percent ink (22 Nov 2026: the HBM stack's was a black block at 41, the die's a ghost at 6)
    var ik = thumb ? (st.inkK || 1) : 1;
    var LW = thumb ? { shade: 1.3 * ik, out: 0.95 * ik, crease: 0.45 * ik, fine: 0, shadeLn: 0, hatch: 0, decal: 0.4 * ik }
                   : { shade: 2.05 * k, out: 1.2 * k, crease: 0.62 * k, fine: 0.4 * k, shadeLn: 0.38 * k, hatch: 0.36 * k, decal: 0.5 * k };
    if (pal.dark && !thumb) { LW.shade *= 0.84; LW.out *= 0.92; }
    var inkC = css(pal.ink), hlC = css(pal.hl), bgC = css(pal.bg);
    var colOf = function (c) { return c === 'acc' ? pal.acc : c === 'acc2' ? pal.acc2 : c === 'muted' ? pal.muted : c === 'bg' ? pal.bg : c === 'hl' ? pal.hl : pal.ink; };
    var lineCol = function (c) { return c === 'acc' || c === 'acc2' ? css(mix(colOf(c), pal.ink, pal.dark ? 0.0 : 0.4)) : c === 'bg' ? bgC : c === 'hl' ? hlC : inkC; };
    var lineRGB = function (c) { return c === 'acc' || c === 'acc2' ? mix(colOf(c), pal.ink, pal.dark ? 0.0 : 0.4) : c === 'bg' ? pal.bg : c === 'hl' ? pal.hl : pal.ink; };
    // On the dark ground, everything that means shade stays darker than the lit side (22 Nov 2026, craft 3): shade lines in ink
    // at about 60 percent, outlines and creases a little under full, and a turned surface's shading lines in the ground's own
    // colour over its lifted tone. On paper each stroke keeps its colour
    var strokeCache = {};
    var strokeOf = function (c, role) {
      if (!pal.dark) return lineCol(c);
      var key = c + '|' + role; if (strokeCache[key]) return strokeCache[key];
      var v = role === 'shl' ? css(pal.bg) : css(mix(pal.bg, lineRGB(c), role === 'shade' ? 0.6 : role === 'out' ? 0.88 : role === 'crease' ? 0.72 : 0.62));
      return (strokeCache[key] = v);
    };
    var Lt = [-0.42, 0.72, 0.55], Ln = Math.hypot(Lt[0], Lt[1], Lt[2]); Lt = [Lt[0] / Ln, Lt[1] / Ln, Lt[2] / Ln];
    var lamOf = function (nvw) { return Math.max(0, nvw[0] * Lt[0] + nvw[1] * Lt[1] + nvw[2] * Lt[2]); };
    // turned surfaces are shaded by a lower light from the left, so a cylinder runs from lit to shade across its width
    var Ls = [-0.78, 0.22, 0.58], Lsn = Math.hypot(Ls[0], Ls[1], Ls[2]); Ls = [Ls[0] / Lsn, Ls[1] / Lsn, Ls[2] / Lsn];
    var lamC = function (nvw) { return Math.max(0, nvw[0] * Ls[0] + nvw[1] * Ls[1] + nvw[2] * Ls[2]); };
    // three values on flat faces (top, lit side, shade side), banded values on turned ones
    var toneF = function (lam, curve) {
      // the dark ramp is about twice the old one: a top face about 16 percent of the way to ink, the lit side 11, the shade side 5
      if (pal.dark) { if (curve) return 1.0 + 0.9 * Math.round(lam * 5) / 5; return lam > 0.72 ? 1.8 : lam > 0.15 ? 1.25 : 0.55; }
      if (curve) return 0.38 + 0.95 * Math.round((1 - lam) * 5) / 5;
      return lam > 0.72 ? 0.36 : lam > 0.15 ? 0.74 : 1.3;
    };
    // (a material may keep one tone whatever way its faces turn, mat.even: the inside of a hole, which no light reaches)
    var fillOf = function (mat, nvw, curve, tint) {
      var d = Math.min(pal.dark ? 0.66 : 0.92, mat.d * (mat.even ? 1 : toneF(curve ? lamC(nvw) : lamOf(nvw), curve)) * (pal.dark ? 0.8 : 1) * (thumb ? Math.min(1.6, ik) : 1));
      var c = mix(pal.bg, colOf(mat.c), d);
      if (tint) c = mix(c, pal.hl, pal.dark ? 0.22 : 0.12);
      return css(c);
    };
    // the reader's pointer on a label or a part lights that part; the rest steps back (P.lit says what a focus lights)
    var foc = this.focus, inF = function (it) { return P.lit(foc, it); };
    var dimF = function (it) { return foc ? (inF(it) ? 1 : 0.2) : 1; };
    var pick = st.pick ? (this._pick = []) : null;
    // the labels are laid out once the plate is at rest (callouts): the faces drawn then, in order, are the map the leaders are
    // routed over, so a frame that lays them out keeps a list of them
    var labelsOn = !thumb && !st.noLabels && !this.o.noLabels && m.callouts.length > 0 && LA > 0.01 && K > 0.86;
    var layKey = [Math.round(w), Math.round(h), Math.round(fit.s * 1e4), Math.round(fit.cx), Math.round(fit.cy), this.o.numbersOnly ? 1 : 0, st.noDims ? 1 : 0, st.oneDim ? 1 : 0, this.loupeOn() ? 1 : 0].join(',');
    var settled = !turned && K >= 0.999 || (!turned && K > 0.86 && (st.scale || 1) === 1);
    var occ = labelsOn && settled && this._layKey !== layKey ? [] : null, dimObs = [], rowsMode = !thumb && this.rowsOn(w);

    var parts = m.parts.slice(), axis = m.sortAxis, toward = axis ? (R[6] * axis[0] + R[7] * axis[1] + R[8] * axis[2]) : 0;
    var pc = parts.map(function (p) { var c = [0, 0, 0], n = 0; p.items.forEach(function (it) { c[0] += it.c[0]; c[1] += it.c[1]; c[2] += it.c[2]; n++; }); return n ? [c[0] / n, c[1] / n, c[2] / n] : [0, 0, 0]; });
    var pkey = parts.map(function (p, i) {
      if (axis) { var cc = pc[i], o = O[i]; return (toward >= 0 ? 1 : -1) * ((cc[0] + o[0]) * axis[0] + (cc[1] + o[1]) * axis[1] + (cc[2] + o[2]) * axis[2]); }
      return depthOf(pc[i], i);
    });
    parts.sort(function (a, b) { return (a.pri - b.pri) || (pkey[a.idx] - pkey[b.idx]); });

    var F = m.F, stamp = this._stamp || (this._stamp = new Int32Array(F.length)), frame = (this._frame = (this._frame || 0) + 1);
    var front = this._front || (this._front = new Int8Array(F.length));
    for (i = 0; i < F.length; i++) { var nn = F[i].n; front[i] = (F[i].two || (R[6] * nn[0] + R[7] * nn[1] + R[8] * nn[2]) > 1e-4) ? 1 : 0; }
    var self = this, count = { faces: 0, edges: 0, dots: 0 };
    var P2 = function (vi) { return [X[vi * 3], X[vi * 3 + 1]]; };
    var axisT = thumb ? 1 : clamp01((K - 0.72) / 0.2), dimT = thumb ? 0 : clamp01((K - 0.84) / 0.16), labT = thumb ? 0 : clamp01((K - 0.86) / 0.14);
    var guideC = css(mix(pal.bg, pal.ink, pal.dark ? 0.5 : 0.56));

    // ---- under the parts: the centre line of the assembly and the trace lines between parts
    var under = function (front) {
      m.lines.forEach(function (L) {
        if (L.style === 'beam' || !!L.front !== front) return;
        if (thumb && (L.style !== 'axis' || L.lod >= 0)) return;
        var pts = partial(L.pts.map(function (p) { return proj(p, p[3] == null ? null : p[3]).slice(0, 2); }), axisT);
        if (pts.length < 2) return;
        var dash = L.style === 'axis' ? [17 * k, 3 * k, 2.4 * k, 3 * k] : L.style === 'guide' ? [0.1, 2.9 * k] : L.style === 'dash' ? [4 * k, 3 * k] : null;
        var col = L.col === 'ink' ? guideC : css(colOf(L.col));
        var la = 1; L.pts.forEach(function (p) { if (p[3] != null) la = Math.min(la, A[p[3]]); });
        var lw = L.style === 'guide' ? 1.0 * k : L.style === 'axis' ? 0.55 * k : (L.lw || 0.6) * k;
        g.lines([pts], col, lw, dash, (L.alpha == null ? 1 : Math.min(1, L.alpha + 0.1)) * la * (foc ? 0.4 : 1), L.style === 'guide' ? 'round' : 'butt');
      });
    };
    under(false);

    // ---- the parts, back to front
    parts.forEach(function (p) {
      var a = A[p.idx]; if (a <= 0.01) return;
      var items = p.items.filter(function (it) { return !(thumb && it.lod > 0); });
      var gh = [], ph = [];
      items = items.filter(function (it) {
        if (it.kind === 'solid' && it.mat.ghost) { gh.push(it); return false; }
        if (it.kind === 'solid' && it.mat.phantom) { ph.push(it); return false; }
        return true;
      });
      gh.forEach(function (s) { ghostEdges(s, false, a * dimF(s)); });
      // under 560 px, where leaders find their way out of the drawing to a row of labels, an outline-only part still counts as
      // drawing (the cost column's yield loss), so no leader runs down its face
      if (occ && rowsMode) gh.forEach(function (s) { for (var fi = s.f0; fi < s.f1; fi++) if (front[fi]) occ.push({ pts: F[fi].v.map(P2), it: s }); });
      var dep = items.map(function (it) { if (p.mode === 'stack' && it.kind === 'solid') return it.ymin * 1000 + depthOf(it.c, p.idx); return depthOf(it.c, p.idx); });
      var ord = items.map(function (it, i) { return i; }).sort(function (x, y) { return dep[x] - dep[y]; });
      if (p.mode === 'fixed') ord = items.map(function (it, i) { return i; });
      ord.forEach(function (ii) {
        var it = items[ii], fa = a * dimF(it), hl = foc && inF(it);
        // a pin on the globe fades as its foot goes round the rim, rather than blinking out
        if (it.vis) { var vz = proj(it.vis, it.part)[2]; if (vz < -0.04) return; fa *= clamp01((vz + 0.04) / 0.14); }
        if (it.kind === 'solid') solid(it, fa, hl, a);
        else if (it.kind === 'wire') {
          if (thumb && it.lw < 0.9) return;
          var pts = it.pts.map(function (q) { return proj(q, it.part).slice(0, 2); });
          if (it.closed) pts.push(pts[0]);
          g.lines([pts], hl ? hlC : lineCol(it.col), (thumb ? Math.max(0.5, it.lw * 0.6) * ik : it.lw * k), it.dash ? it.dash.map(function (v) { return v * k; }) : null, it.alpha * fa);
        } else if (it.kind === 'globe') {
          var gc = proj([0, 0, 0], it.part);
          g.circle(gc[0], gc[1], it.r * sc, fillOf(MATS[it.fill] || MATS.paper, [0, 0, 1], false), null, 0);
          self._globe = { x: gc[0], y: gc[1], r: it.r * sc };
        } else if (it.kind === 'rim') {
          var G2 = self._globe; if (G2) {
            g.circle(G2.x, G2.y, G2.r, null, inkC, LW.out);
            var arc = []; for (var q = 0; q <= 40; q++) { var an = -Math.PI * 0.25 + Math.PI * q / 40; arc.push([G2.x + G2.r * Math.cos(an), G2.y + G2.r * Math.sin(an)]); }
            g.lines([arc], inkC, LW.shade, null, 1, 'round');
          }
        } else if (it.kind === 'land') {
          var G = self._globe || { x: cx, y: cy, r: sc };
          it.rings.forEach(function (rg, ri) {
            var pts = rg.map(function (q) { var pp = proj(q, it.part); if (pp[2] < 0) { var dx = pp[0] - G.x, dy = pp[1] - G.y, L = Math.hypot(dx, dy) || 1; return [G.x + dx / L * G.r, G.y + dy / L * G.r]; } return [pp[0], pp[1]]; });
            var hole = it.holes.indexOf(ri) >= 0;
            g.poly(pts, hole ? fillOf(MATS.paper, [0, 0, 1], false) : fillOf(it.mat, [0, 0, 1], false), fa);
          });
        } else if (it.kind === 'swire') {
          if (thumb && it.lod > 0) return;
          var pp = it.pts.map(function (q) { return proj(q, it.part); }), runs = [], run = [];
          pp.forEach(function (q) { if (q[2] >= 0) run.push([q[0], q[1]]); else { if (run.length > 1) runs.push(run); run = []; } });
          if (run.length > 1) runs.push(run);
          g.lines(runs, it.col === 'ink' ? inkC : lineCol(it.col), (thumb ? Math.max(0.45, it.lw * 0.7) : it.lw * k), null, it.alpha * fa);
        } else if (it.kind === 'dots') {
          if (thumb && it.r < 1.2 && !it.keepThumb) return;
          var dp = it.pts.map(function (q) { return proj(q, it.part); });
          if (it.front) dp = dp.filter(function (q) { return q[2] >= 0; });
          count.dots += dp.length;
          var dr = Math.max(0.5, it.r * (thumb ? 0.6 : k));
          g.dots(dp, dr, hl ? hlC : it.col === 'ink' ? inkC : css(colOf(it.col)), it.alpha * fa, it.ring);
          if (pick && it.alpha > 0.05) pick.push({ dots: dp, r: Math.max(3, dr + 1.5), it: it });
          if (occ && it.alpha > 0.05) occ.push({ dots: dp, r: Math.max(1.5, dr), it: it });
        }
      });
      ph.forEach(function (s) { phantomEdges(s, a * dimF(s)); });
      gh.forEach(function (s) { ghostEdges(s, true, a * dimF(s)); });
    });
    under(true);

    function solid(s, a, hl, pa) {
      var mat = s.mat, faces = [];
      for (var fi = s.f0; fi < s.f1; fi++) if (front[fi]) faces.push(fi);
      if (s.sortFaces) {
        var fd = {}; faces.forEach(function (fi) { var f = F[fi], z = 0; for (var q = 0; q < f.v.length; q++) z += X[f.v[q] * 3 + 2]; fd[fi] = z / f.v.length; });
        faces.sort(function (x, y) { return fd[x] - fd[y]; });
      }
      var alpha = (s.alpha == null ? 1 : s.alpha) * a;
      // small parts take lighter outlines: the weight follows the size of the part on the page
      var bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
      faces.forEach(function (fi) { var vv = F[fi].v; for (var q = 0; q < vv.length; q++) { var xx = X[vv[q] * 3], yy = X[vv[q] * 3 + 1]; if (xx < bx0) bx0 = xx; if (xx > bx1) bx1 = xx; if (yy < by0) by0 = yy; if (yy > by1) by1 = yy; } });
      var diag = Math.hypot(bx1 - bx0, by1 - by0), szK = thumb ? Math.max(0.4, Math.min(1, diag / 22)) : Math.max(0.62, Math.min(1, diag / 70));
      if (thumb && diag < 2.5) return;
      // a part under about 60 px on the page draws its whole outline at outline weight: the shade line is for the object's form
      var small = !thumb && diag < 60;
      // a dished end of a turned part turned toward the reader (a mirror's face) takes two concentric rings, never shading lines,
      // which there read as the blades of a fan
      var rings = [], dish = !!(s.axisN && Math.abs(rotN(s.axisN)[2]) > 0.4);
      // an outline inside the part's own outline (the lip where a wider crown sits on the body) is not its silhouette: it keeps
      // outline weight, and the shade line is kept for the part's outer edge
      var inner = s.axisN && !thumb && !lite ? faces.map(function (fi) { return F[fi].v.map(P2); }) : null;
      faces.forEach(function (fi) {
        var f = F[fi], fm = f.mat || mat, pts = f.v.map(P2), nvw = rotN(f.n);
        if (f.two && nvw[2] < 0) nvw = [-nvw[0], -nvw[1], -nvw[2]];
        count.faces++;
        if (fm.hatch) {
          g.poly(pts, css(mix(pal.bg, colOf(fm.c), fm.d)), alpha);
          if (!thumb && !lite) g.hatch(pts, fm.c ? lineCol(fm.c) : inkC, (fm.gap || (fm.hatch === 2 ? 2.4 : 3.4)) * k, LW.hatch, fm.hatch, (pal.dark ? 0.7 : 0.8) * alpha, f.hv != null ? f.hv : fm.ang);
        } else g.poly(pts, fillOf(fm, nvw, f.curve, hl), (fm.alpha == null ? 1 : fm.alpha) * alpha);
        stamp[fi] = frame;
        if (pick) pick.push({ pts: pts, it: s });
        if (occ) occ.push({ pts: pts, it: s });
        var out = [], shade = [], crease = [], fine = [], shl = [];
        var gx = 0, gy = 0; for (var q = 0; q < pts.length; q++) { gx += pts[q][0]; gy += pts[q][1]; } gx /= pts.length; gy /= pts.length;
        for (q = 0; q < f.v.length; q++) {
          var e = f.e[q], nb = e[0], cls = e[1], A0 = pts[q], B0 = pts[(q + 1) % pts.length], seg = [A0, B0];
          // a joint, where this solid sits on another (P.build joints), is a crease, never a shade line
          if (s.joint) { var va = f.v[q], vb = f.v[(q + 1) % f.v.length]; if (s.joint[va < vb ? va + '_' + vb : vb + '_' + va]) { if (nb < 0 || !front[nb] || (stamp[nb] === frame && cls === 1)) crease.push(seg); continue; } }
          if (nb < 0 || !front[nb]) {
            // an outline: heavier where it faces away from the light (down and to the right on the page)
            var dx = B0[0] - A0[0], dy = B0[1] - A0[1], L = Math.hypot(dx, dy) || 1, nx = dy / L, ny = -dx / L;
            if (nx * (gx - A0[0]) + ny * (gy - A0[1]) > 0) { nx = -nx; ny = -ny; }
            var isShade = (nx * 0.6 + ny * 0.8) > 0.3;
            if (isShade && inner && nb >= 0 && !F[nb].curve) {
              var mx2 = (A0[0] + B0[0]) / 2 + nx * 2.5, my2 = (A0[1] + B0[1]) / 2 + ny * 2.5;
              for (var ii = 0; ii < inner.length; ii++) if (faces[ii] !== fi && inPoly2(mx2, my2, inner[ii])) { isShade = false; break; }
            }
            (isShade ? shade : out).push(seg);
            continue;
          }
          if (stamp[nb] !== frame) continue;
          if (cls === 1) { ((F[nb].mat || mat).hatch || fm.hatch) ? out.push(seg) : crease.push(seg); }
          else if (cls === 2 && LW.fine) fine.push(seg);
        }
        // shading lines on a turned surface: along its axis, gathering toward the shade side
        if (!thumb && !lite && f.curve && f.mj >= 0 && pts.length === 4 && !fm.hatch) {
          if (f.cap && dish) { if (s.rings.indexOf(f.ri) >= 0) rings.push([pts[0], pts[1]]); }
          else {
            var lam = lamC(nvw), sh = 1 - lam, j = f.mj, ring = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), mer = Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]);
            if (ring > 0.9 && mer > 3 && ((sh > 0.86) || (sh > 0.68 && j % 2 === 0) || (sh > 0.5 && j % 4 === 0))) shl.push([pts[3], pts[0]]);
          }
        }
        if (small && shade.length) { out = out.concat(shade); shade = []; }
        var lcK = fm.c || mat.c;
        if (shl.length) g.lines(shl, hl ? hlC : strokeOf(lcK, 'shl'), LW.shadeLn * (pal.dark ? 1.2 : 1), null, (pal.dark ? 0.55 : 0.75) * alpha, 'butt');
        if (fine.length) g.lines(fine, hl ? hlC : strokeOf(lcK, 'fine'), LW.fine, null, 0.8 * alpha);
        if (crease.length) g.lines(crease, hl ? hlC : strokeOf(lcK, 'crease'), LW.crease, null, alpha);
        if (out.length) g.lines(out, hl ? hlC : strokeOf(lcK, 'out'), (hl ? LW.out * 1.25 : LW.out) * (thumb ? szK : Math.max(0.8, szK)), null, alpha);
        if (shade.length) g.lines(shade, hl ? hlC : strokeOf(lcK, 'shade'), (hl ? LW.shade * 1.1 : LW.shade) * szK, null, alpha);
        count.edges += out.length + shade.length + crease.length + fine.length;
      });
      if (rings.length) g.lines(rings, hl ? hlC : strokeOf(mat.c, 'shl'), LW.shadeLn * (pal.dark ? 1.3 : 1.15), null, 0.7 * alpha, 'butt');
      var alpha0 = alpha;
      if (s.decals.length) s.decals.forEach(function (d) {
        var nz = R[6] * d.n[0] + R[7] * d.n[1] + R[8] * d.n[2];
        if (nz <= 1e-4 && !s.two) return;
        d.items.forEach(function (it) {
          if (thumb && !it.keep) return;
          // a decal lights on its own (the HBM stack's vias), so its alpha and colour are its own while a part is pointed at
          var dl = foc ? P.lit(foc, it, s) : false, alpha = foc ? (dl ? 1 : 0.2) * (pa == null ? 1 : pa) : alpha0;
          var col = dl ? hlC : it.col ? (it.col === 'ink' ? inkC : lineCol(it.col)) : inkC;
          if (it.dots) {
            var dp = it.dots.map(function (q) { return proj(q, s.part); });
            count.dots += dp.length;
            g.dots(dp, Math.max(0.45, (it.r || 0.9) * k), it.fillCol && !dl ? css(colOf(it.fillCol)) : col, (it.alpha == null ? 0.9 : it.alpha) * alpha, it.ring);
            return;
          }
          var pts = it.pts.map(function (q) { return proj(q, s.part).slice(0, 2); });
          if (it.fill) {
            var fm = typeof it.fill === 'string' ? MATS[it.fill] : it.fill;
            if (fm.hatch) { g.poly(pts, css(mix(pal.bg, colOf(fm.c), fm.d)), alpha); if (!thumb) g.hatch(pts, fm.c ? lineCol(fm.c) : inkC, 3 * k, LW.hatch, fm.hatch, 0.75 * alpha); }
            else g.poly(pts, fillOf(fm, rotN(d.n), false, dl), (fm.alpha == null ? 1 : fm.alpha) * alpha);
          }
          if (it.lw !== 0) {
            if (it.closed) pts = pts.concat([pts[0]]);
            g.lines([pts], col, (it.lw || LW.decal / k) * k * 0.9, it.dash ? it.dash.map(function (v) { return v * k; }) : null, (it.alpha == null ? 1 : it.alpha) * alpha);
          }
        });
      });
    }
    function edgesOf(s, test) {
      var segs = [];
      for (var fi = s.f0; fi < s.f1; fi++) {
        var f = F[fi];
        for (var q = 0; q < f.v.length; q++) {
          var e = f.e[q], nb = e[0];
          if (nb >= 0 && nb < fi) continue;
          var fa = front[fi], fb = nb >= 0 ? front[nb] : fa, cls = e[1], sil = nb >= 0 && fa !== fb;
          if (cls === 0 && !sil) continue;
          if (cls === 2) continue;
          if (!test(fa, fb, sil)) continue;
          segs.push([P2(f.v[q]), P2(f.v[(q + 1) % f.v.length])]);
        }
      }
      return segs;
    }
    function ghostEdges(s, frontPass, a) {
      if (thumb && !frontPass) return;
      var col = lineCol(s.mat.c);
      if (frontPass) g.lines(edgesOf(s, function (fa, fb) { return fa || fb; }), col, LW.crease * 1.1, null, 0.9 * a);
      else g.lines(edgesOf(s, function (fa, fb) { return !fa && !fb; }), col, LW.fine || 0.4, [3 * k, 2.5 * k], 0.55 * a);
    }
    function phantomEdges(s, a) {
      var col = lineCol(s.mat.c);
      g.lines(edgesOf(s, function () { return true; }), col, Math.max(0.5, LW.fine * 1.15), [4.5 * k, 2.5 * k], 0.85 * a, 'butt');
    }

    // ---- over the parts: the light paths, then dimensions, then the labels
    m.lines.forEach(function (L) {
      if (L.style !== 'beam') return;
      var pts = L.pts.map(function (p) { return proj(p, p[3] == null ? null : p[3]).slice(0, 2); });
      // a label on the light path (P.focusOf beam) lights the path
      var col = css(colOf(L.col || 'acc')), lb = !!(foc && foc.beam), aa = (L.alpha == null ? 1 : L.alpha) * Math.min(1, K * 1.6) * (foc && !lb ? 0.35 : 1);
      if (!thumb) g.lines([pts], col, (L.lw || 1.4) * 3.2 * k, null, (lb ? 0.24 : 0.14) * aa);
      g.lines([pts], col, (L.lw || 1.4) * (thumb ? 0.8 : k) * (lb ? 1.5 : 1), null, aa);
    });
    // the dimensions: all of them in a chapter's slot, the plate's first (the size its caption leads with) in the phone's view
    if (!thumb && !st.noDims && LA > 0.01) (st.oneDim ? m.dims.slice(0, 1) : m.dims).forEach(function (d) { dimension(d); });
    if (!thumb && LA > 0.01) m.labels.forEach(function (L) {
      var p = proj(L.at, L.part), c = L.col === 'muted' ? css(pal.muted) : css(colOf(L.col));
      g.text(L.text, p[0] + L.dx * k, p[1] + L.dy * k, { size: Math.round(L.size * Math.max(0.85, Math.min(1.1, k))), weight: L.weight, fill: c, align: L.align, halo: bgC, haloW: 4, alpha: labT * LA });
    });
    if (!thumb && this.loupeOn() && labT > 0 && LA > 0.01) drawLoupe(this.loupeGeom(w, h, g), labT * LA);
    this._hit = [];
    if (!thumb && !st.noLabels && !this.o.noLabels && labT > 0 && LA > 0.01 && m.callouts.length) callouts();

    function drawLoupe(G, A) {
      var L = m.loupe, lp = self.loupePlate(); if (!lp) return;
      var pi = null; m.parts.forEach(function (p) { if (p.name === L.part) pi = p.idx; });
      var T = L.at ? proj(L.at, pi) : null, rt = 6, ga0 = g.ga || 1;
      g.ga = ga0 * A;
      var line = css(mix(pal.bg, pal.ink, pal.dark ? 0.5 : 0.42));
      if (T) {
        // the cone: a faint wash of ink with two hairline edges, from the ring on the spot to the disc
        var dx = G.x - T[0], dy = G.y - T[1], d = Math.hypot(dx, dy);
        if (d > G.r + rt + 4) {
          var th = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (rt - G.r) / d)));
          var p1a = [T[0] + rt * Math.cos(th + al), T[1] + rt * Math.sin(th + al)], p2a = [G.x + G.r * Math.cos(th + al), G.y + G.r * Math.sin(th + al)];
          var p1b = [T[0] + rt * Math.cos(th - al), T[1] + rt * Math.sin(th - al)], p2b = [G.x + G.r * Math.cos(th - al), G.y + G.r * Math.sin(th - al)];
          g.poly([p1a, p2a, [G.x, G.y], p2b, p1b, [T[0], T[1]]], inkC, pal.dark ? 0.05 : 0.032);
          g.lines([[p1a, p2a], [p1b, p2b]], line, 0.7 * k, null, 0.85, 'butt');
        }
        g.circle(T[0], T[1], rt, null, bgC, 3.2);
        g.circle(T[0], T[1], rt, null, css(mix(pal.bg, pal.ink, 0.8)), 1.1);
      }
      g.circle(G.x, G.y, G.r, bgC, null, 0);
      // the small plate, fitted to the disc, then its scale bars and names
      var S2 = G.r * 2, x0 = G.x - G.r, y0 = G.y - G.r, f0 = lp.fit(S2, S2), sk = L.scale || 1;
      var f2 = { s: f0.s * sk, cx: x0 + G.r + (f0.cx - G.r) * sk + (L.dx || 0) * S2, cy: y0 + G.r + (f0.cy - G.r) * sk + (L.dy || 0) * S2, e: f0.e };
      g.clip(G.x, G.y, G.r - 0.5);
      lp.paint({ k: 1, w: S2, h: S2, g: g, pal: pal, fit: f2, noDims: true, noLabels: true });
      var R1 = viewM(lp.m.yaw0, lp.m.elev), pj = function (q) { return [f2.cx + f2.s * (R1[0] * q[0] + R1[1] * q[1] + R1[2] * q[2]), f2.cy - f2.s * (R1[3] * q[0] + R1[4] * q[1] + R1[5] * q[2])]; };
      var size = 11.5, txt = css(pal.ink), lh = Math.round(size * 1.2);
      // a block of one or two lines, centred on (x, y), its lines set to the side the block's align names
      var block = function (text, x, y, al, wt, haloW) {
        var lines = String(text).split('\n'), n = lines.length;
        lines.forEach(function (ln, i) { g.text(ln, x, y + (i - (n - 1) / 2) * lh, { size: size, weight: wt, fill: txt, align: al, halo: bgC, haloW: haloW }); });
      };
      var widthOf = function (text, wt) { return Math.max.apply(null, String(text).split('\n').map(function (ln) { return g.measure(ln, { size: size, weight: wt }); })); };
      (lp.m.bars || []).forEach(function (b) {
        var a = pj(b.a), c = pj(b.b), bx = c[0] - a[0], by = c[1] - a[1], Ln = Math.hypot(bx, by) || 1, nx = -by / Ln, ny = bx / Ln, tk = 4;
        g.lines([[a, c]], bgC, 4.2, null, 1, 'butt'); g.lines([[a, c]], txt, 1.2, null, 1, 'butt');
        g.lines([[[a[0] + nx * tk, a[1] + ny * tk], [a[0] - nx * tk, a[1] - ny * tk]], [[c[0] + nx * tk, c[1] + ny * tk], [c[0] - nx * tk, c[1] - ny * tk]]], txt, 1.1, null, 1, 'butt');
        var sd = b.side || 1, tw = widthOf(b.text, 600), nl = String(b.text).split('\n').length, th = nl * lh, tx = (a[0] + c[0]) / 2 + (b.tx || 0), ty = (a[1] + c[1]) / 2 + (b.ty || 0), al = 'center';
        if (Math.abs(bx) >= Math.abs(by)) ty += sd * -(6 + th / 2);
        // a standing bar's figure starts beside it, set to the bar's side (a long figure no longer reaches back over the bar)
        else { tx += sd * 8; al = sd > 0 ? 'left' : 'right'; }
        // the figure stays inside the disc
        var Rl = G.r - 7, dyc = Math.max(-Rl + th / 2 + 2, Math.min(Rl - th / 2 - 2, ty - G.y)), ey = Math.min(Rl, Math.abs(dyc) + th / 2), half = Math.sqrt(Math.max(0, Rl * Rl - ey * ey));
        ty = G.y + dyc;
        var lft = al === 'left' ? tx : al === 'right' ? tx - tw : tx - tw / 2, sh = Math.max(G.x - half - lft, Math.min(0, G.x + half - (lft + tw)));
        block(b.text, tx + sh, ty, al, 600, 4);
      });
      (lp.m.tags || []).forEach(function (t2) {
        var q = pj(t2.at), x = q[0] + (t2.dx || 0), y = q[1] + (t2.dy || 0), al = t2.align || 'center';
        if (t2.lead) {
          // the leader runs from the name's near edge to the point it names, and ends on a small dot there
          var e = pj(t2.lead), sx = al === 'left' ? x - 4 : al === 'right' ? x + 4 : x, sy = al === 'center' ? y + (e[1] > y ? 1 : -1) * (String(t2.text).split('\n').length * lh / 2 + 2) : y;
          g.lines([[[sx, sy], e]], bgC, 3, null, 0.9, 'round'); g.lines([[[sx, sy], e]], txt, 0.75, null, 1, 'round');
          g.circle(e[0], e[1], 1.9, txt, bgC, 0.9);
        }
        block(t2.text, x, y, al, 600, 3.5);
      });
      g.unclip();
      g.circle(G.x, G.y, G.r, null, css(mix(pal.bg, pal.ink, 0.86)), 1.25 * k);
      g.circle(G.x, G.y, G.r + 3.5, null, css(mix(pal.bg, pal.ink, pal.dark ? 0.3 : 0.22)), 0.6 * k);
      // the caption under the disc (or, on a phone, beside it), in the label's muted ink
      if (G.capSide) G.cap.forEach(function (ln, i) { var lf = G.capSide === 'l'; g.text(ln, G.x + (lf ? -1 : 1) * (G.r + 14), G.y + (i - (G.cap.length - 1) / 2) * 16, { size: 12, weight: 500, fill: css(pal.muted), align: lf ? 'right' : 'left', halo: bgC, haloW: 3 }); });
      else G.cap.forEach(function (ln, i) { g.text(ln, G.x, G.y + G.r + 16 + i * 16, { size: 12, weight: 500, fill: css(pal.muted), align: 'center', halo: bgC, haloW: 3 }); });
      g.ga = ga0;
    }

    function dimension(d) {
      var a3 = d.a, b3 = d.b, o = d.off, bp = d.bpart == null ? d.part : d.bpart;
      var A0 = proj(a3, d.part), B0 = proj(b3, bp), A1 = proj([a3[0] + o[0], a3[1] + o[1], a3[2] + o[2]], d.part), B1 = proj([b3[0] + o[0], b3[1] + o[1], b3[2] + o[2]], bp);
      var col = css(mix(pal.bg, pal.ink, pal.dark ? 0.62 : 0.68)), txt = css(mix(pal.bg, pal.ink, 0.78)), al = LA * (foc ? 0.35 : 1);
      var ex = [A1[0] - A0[0], A1[1] - A0[1]], el = Math.hypot(ex[0], ex[1]) || 1; ex = [ex[0] / el, ex[1] / el];
      var gap = 2.5 * k, over = 3.5 * k;
      var e1 = [[A0[0] + ex[0] * gap, A0[1] + ex[1] * gap], [A1[0] + ex[0] * over, A1[1] + ex[1] * over]], e2 = [[B0[0] + ex[0] * gap, B0[1] + ex[1] * gap], [B1[0] + ex[0] * over, B1[1] + ex[1] * over]];
      var size = Math.max(11.5, Math.round(11.5 * Math.min(1.08, k) * 10) / 10), tw = g.measure(d.text, { size: size, weight: 500 }), th = size * 1.05;
      // the line, its arrows and its figure, grown to gr of their length (they grow from the middle as they draw on). A dimension
      // too short to hold both arrowheads sets them outside its extension lines, pointing in (22 Nov 2026, craft 1)
      var geom = function (gr) {
        var mx0 = (A1[0] + B1[0]) / 2, my0 = (A1[1] + B1[1]) / 2;
        var a1 = [mx0 + (A1[0] - mx0) * gr, my0 + (A1[1] - my0) * gr], b1 = [mx0 + (B1[0] - mx0) * gr, my0 + (B1[1] - my0) * gr];
        var LF = Math.hypot(B1[0] - A1[0], B1[1] - A1[1]), dx = b1[0] - a1[0], dy = b1[1] - a1[1], L = Math.hypot(dx, dy) || 1, u = [dx / L, dy / L];
        var outside = LF < 2 * 6.5 * k + 8, aL = outside ? 5.5 * k : Math.min(6.5 * k, L / 4), tail = outside ? aL + 6 * k : 0;
        var half = (Math.abs(u[0]) * tw + Math.abs(u[1]) * th) / 2 + 4 * k, t = d.t == null ? 0.5 : d.t;
        var tx = a1[0] + dx * t, ty = a1[1] + dy * t, standing = Math.abs(u[1]) > 0.85, inside = !outside && L > 2 * half + 2 * aL + 8 && t > 0.05 && t < 0.95;
        var segs;
        if (standing) { var sx = ex[0] >= 0 ? 1 : -1; tx = tx + sx * (tw / 2 + 5 * k); segs = [[[a1[0] - u[0] * tail, a1[1] - u[1] * tail], [b1[0] + u[0] * tail, b1[1] + u[1] * tail]]]; inside = true; }
        else if (inside) segs = [[a1, [tx - u[0] * half, ty - u[1] * half]], [[tx + u[0] * half, ty + u[1] * half], b1]];
        else {
          segs = [[[a1[0] - u[0] * tail, a1[1] - u[1] * tail], [b1[0] + u[0] * tail, b1[1] + u[1] * tail]]];
          var tside = t >= 0.5 ? 1 : -1, base = tside > 0 ? b1 : a1;
          tx = base[0] + u[0] * tside * (half + 3 * k + tail); ty = base[1] + u[1] * tside * (half + 3 * k + tail);
        }
        tx = Math.max(tw / 2 + 2, Math.min(w - tw / 2 - 2, tx)); ty = Math.max(size, Math.min(h - size, ty));
        return { a1: a1, b1: b1, u: u, aL: aL, outside: outside, segs: segs, tx: tx, ty: ty };
      };
      // what the leaders must keep clear of: the finished line, its extension lines and its figure
      var G1 = geom(1);
      dimObs.push({ seg: e1 }, { seg: e2 }); G1.segs.forEach(function (sg) { dimObs.push({ seg: sg }); }); dimObs.push({ seg: [G1.a1, G1.b1] }); // the gap left for its figure too
      dimObs.push({ box: [G1.tx - tw / 2 - 3, G1.ty - th / 2 - 2, G1.tx + tw / 2 + 3, G1.ty + th / 2 + 2] });
      if (dimT <= 0) return;
      var G = geom(easeOut(dimT));
      g.lines([e1, e2], col, 0.5 * k, null, al * dimT, 'butt');
      g.lines(G.segs, col, 0.55 * k, null, al, 'butt');
      var aW = 1.7 * k;
      if (G.outside) { g.arrow(G.a1, G.u, G.aL, col, aW, al); g.arrow(G.b1, [-G.u[0], -G.u[1]], G.aL, col, aW, al); }
      else { g.arrow(G.a1, [-G.u[0], -G.u[1]], G.aL, col, aW, al); g.arrow(G.b1, G.u, G.aL, col, aW, al); }
      g.text(d.text, G.tx, G.ty, { size: size, weight: 500, fill: txt, align: 'center', halo: bgC, haloW: 3.5, alpha: al * clamp01(dimT * 1.6 - 0.4) });
    }

    /* The labels (22 Nov 2026, craft 1). Each stands in a column beside the drawing, or under 560 px in a row over or under it.
       Once the plate is at rest they are laid out (layCols): every dot is moved, if it must be, onto the part it names; then each
       label tries a few heights and each leader three shapes, level where its dot's height allows, else one steep run at an
       angle kept clear of the view's own edges, and the layout that crosses least wins: no leader over another leader, over a
       dimension or over a part it does not name. The layout is kept until the size or the mode changes; while the plate turns
       back in, the labels keep their places and their leaders follow the dots. */
    function segX(a, b, c, d) {
      var cr = function (p, q, r) { return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); };
      var d1 = cr(c, d, a), d2 = cr(c, d, b), d3 = cr(a, b, c), d4 = cr(a, b, d), t = 1e-6;
      return Math.abs(d1) > t && Math.abs(d2) > t && Math.abs(d3) > t && Math.abs(d4) > t && (d1 > 0) !== (d2 > 0) && (d3 > 0) !== (d4 > 0);
    }
    function segBox(a, b, bx) {
      var inB = function (p) { return p[0] >= bx[0] && p[0] <= bx[2] && p[1] >= bx[1] && p[1] <= bx[3]; };
      if (inB(a) || inB(b)) return true;
      var c = [[bx[0], bx[1]], [bx[2], bx[1]], [bx[2], bx[3]], [bx[0], bx[3]]];
      for (var i = 0; i < 4; i++) if (segX(a, b, c[i], c[(i + 1) % 4])) return true;
      return false;
    }
    function callouts() {
      var ls = self.labelStyle(w), e = fit.e, dl = cx + sc * e.minx, dr = cx + sc * e.maxx, midx = (dl + dr) / 2, dt = cy - sc * e.maxy, db = cy - sc * e.miny;
      if (!m.callouts[0]._lines) self.rooms(w, g);
      var rows = self.rowsOn(w);
      // a point as the drawn view puts it: a tracking label (the globe's) keeps the height it has there as the globe turns
      var proj0 = function (q, part) { var o = O[part], x = q[0] + o[0], y = q[1] + o[1], z = q[2] + o[2]; return [cx + sc * (R0[0] * x + R0[1] * y + R0[2] * z), cy - sc * (R0[3] * x + R0[4] * y + R0[5] * z)]; };
      var LGc = self.loupeOn() ? self.loupeGeom(w, h, g) : null;
      var ents = m.callouts.map(function (c, ci) {
        var pts, wts = null, my = 0, mx = 0, base = (rows && c.rowAt ? c.rowAt : c.pts).map(function (q) { return proj(q, q[3] == null ? c.part : q[3]); });
        if (c.track) {
          // the globe's labels point at whichever of their towns face the reader: a leader fades in as its town comes round
          // and out as it nears the rim, and the label stays where it is
          pts = []; wts = [];
          c.track.forEach(function (q) {
            var o = O[q[3]], x = q[0] + o[0], y = q[1] + o[1], z = q[2] + o[2], L = Math.hypot(x, y, z) || 1;
            var f = (R[6] * x + R[7] * y + R[8] * z) / L, wt = clamp01((f - 0.3) / 0.25), pq = proj(q, q[3]), G0 = self._globe;
            // and not from the far side of the disc, so a leader never runs across the whole globe
            if (G0 && c.side) { var u = (pq[0] - G0.x) / G0.r * (c.side === 'l' ? -1 : 1); wt *= clamp01((u + 0.5) / 0.35); }
            if (wt > 0.01) { pts.push(pq); wts.push(wt * wt * (3 - 2 * wt)); }
          });
          c.pts.forEach(function (q) { var p0 = proj0(q, q[3] == null ? c.part : q[3]); my += p0[1]; mx += p0[0]; }); my /= c.pts.length; mx /= c.pts.length;
        } else {
          pts = base;
          pts.forEach(function (q) { my += q[1]; mx += q[0]; }); my /= pts.length; mx /= pts.length;
        }
        var side = c._side || c.side || (mx < midx ? 'l' : 'r');
        if (rows && side !== 't' && side !== 'b') side = my < (dt + db) / 2 ? 't' : 'b';
        if (!rows && (side === 't' || side === 'b')) side = c.side || (mx < midx ? 'l' : 'r');
        var lines = c._lines || [c.text], hh = Math.max(lines.length, 1) * ls.fs * 1.18, tw = 0;
        lines.forEach(function (s2) { tw = Math.max(tw, g.measure(s2, { size: ls.fs, weight: 500 })); });
        var r = c.n ? (ls.numbersOnly ? ls.num : ls.num * Math.max(0.9, Math.min(1.1, k))) : 0;
        return { c: c, ci: ci, pts: pts, wts: wts, x: mx, y0: my + (c.dy || 0) * k, hh: Math.max(hh, r * 2), lines: lines, tw: tw, r: r, side: side };
      });
      if (occ) { self._lay = rows ? layRows(ents) : layCols(ents); self._layKey = layKey; self._layStats = self._lay.stats || null; }
      var lay = self._layKey === layKey ? self._lay : null;
      if (rows) drawRows(ents, lay && lay.rows ? lay : null); else drawCols(ents, lay && !lay.rows ? lay : null);

      function colX(sd) { return sd === 'l' ? dl - 8 * k : dr + 8 * k; }
      function colTop(sd) { return LGc && LGc.side === sd ? LGc.bottom : ls.fs; }
      function colBot(sd) { var b = h - ls.fs; if (LGc && LGc.side === 'b' && sd === (LGc.capSide === 'r' ? 'l' : 'r')) b = Math.min(b, LGc.y - LGc.r - 8); return b; }
      // the column's labels at the heights they want, pushed apart and kept in the canvas; returns their heights in list order
      function resolve(list, want, top, bot) {
        var minGap = ls.fs * 0.85, idx = list.map(function (L, i) { return i; }).sort(function (a, b) { return (want[a] - want[b]) || (a - b); }), ys = new Array(list.length);
        idx.forEach(function (i, n) { var p = n ? idx[n - 1] : -1, lo = p >= 0 ? ys[p] + (list[p].hh + list[i].hh) / 2 + minGap : top + list[i].hh / 2; ys[i] = Math.max(want[i], lo); });
        var last = idx[idx.length - 1], over = ys[last] + list[last].hh / 2 - bot;
        if (over > 0) { ys[last] -= over; for (var n = idx.length - 2; n >= 0; n--) { var i = idx[n], nx = idx[n + 1], hi = ys[nx] - (list[nx].hh + list[i].hh) / 2 - minGap; if (ys[i] > hi) ys[i] = hi; } }
        return ys;
      }
      // a leader from the dot A to a label at height y: 'C' level from the dot, then steep into the column; 'A' steep from the dot,
      // then level; 'D' straight to the column's edge. All end on a short level shoulder
      function shapePath(A, y, sd, shape, th) {
        var sg = sd === 'l' ? -1 : 1, xs = colX(sd), Sx = xs + sg * 12 * k, dy = y - A[1], kx = Math.abs(dy) / Math.tan(th || 1.1);
        if (Math.abs(dy) < 1.2) return [[A[0], A[1]], [Sx, y]];
        if (shape === 'C') { var Kx = xs - sg * kx; if (sg * (Kx - A[0]) < 0) return null; return [[A[0], A[1]], [Kx, A[1]], [xs, y], [Sx, y]]; }
        if (shape === 'A') { var K2 = A[0] + sg * kx; if (sg * (xs - K2) < 0) return null; return [[A[0], A[1]], [K2, y], [Sx, y]]; }
        return [[A[0], A[1]], [xs, y], [Sx, y]];
      }
      // the drawing as a map of which item is on top at each 2 px cell (the loupe's disc as -2), from the faces drawn at rest
      function buildMap() {
        var cs = 2, gw = Math.ceil(w / cs) + 1, gh = Math.ceil(h / cs) + 1, map = new Int32Array(gw * gh); map.fill(-1);
        occ.forEach(function (o) {
          var id = o.it._id;
          if (o.pts) {
            var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
            o.pts.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
            var i0 = Math.max(0, Math.floor(x0 / cs)), i1 = Math.min(gw - 1, Math.floor(x1 / cs)), j0 = Math.max(0, Math.floor(y0 / cs)), j1 = Math.min(gh - 1, Math.floor(y1 / cs));
            for (var j = j0; j <= j1; j++) { var yy = (j + 0.5) * cs; for (var i = i0; i <= i1; i++) if (inPoly2((i + 0.5) * cs, yy, o.pts)) map[j * gw + i] = id; }
          } else o.dots.forEach(function (d) {
            var i0 = Math.max(0, Math.floor((d[0] - o.r) / cs)), i1 = Math.min(gw - 1, Math.floor((d[0] + o.r) / cs)), j0 = Math.max(0, Math.floor((d[1] - o.r) / cs)), j1 = Math.min(gh - 1, Math.floor((d[1] + o.r) / cs));
            for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) map[j * gw + i] = id;
          });
        });
        if (LGc) for (var j = 0; j < gh; j++) for (var i = 0; i < gw; i++) if (Math.hypot((i + 0.5) * cs - LGc.x, (j + 0.5) * cs - LGc.y) < LGc.r + 6) map[j * gw + i] = -2;
        var at = function (x, y) { var i = Math.floor(x / cs), j = Math.floor(y / cs); return i < 0 || j < 0 || i >= gw || j >= gh ? -1 : map[j * gw + i]; };
        return at;
      }
      // what each label lights: its leaders may cross those items freely
      function litOf(c) { var f = P.focusOf(c), lit = {}; m.S.forEach(function (it) { if (P.lit(f, it) || (it.kind === 'solid' && it.decals.some(function (d) { return d.items.some(function (q) { return P.lit(f, q, it); }); }))) lit[it._id] = 1; }); return lit; }
      /* Under 560 px the labels stand in rows, their leaders running up or down to them. A leader whose upright run would cross
         parts it does not name may leave its part sideways instead, to just clear of the drawing at that height, then run up or
         down outside it (22 Nov 2026 designer pass: the column's lenses and the rack's trays were named through every part
         between them and the row) */
      function layRows(ents) {
        var at = buildMap(), out = { rows: true, route: {} }, segs = dimObs.filter(function (o) { return o.seg; }).map(function (o) { return o.seg; }), boxes = dimObs.filter(function (o) { return o.box; }).map(function (o) { return o.box; });
        ents.forEach(function (L) {
          if (L.c.track || L.side !== 't' && L.side !== 'b') return;
          var lit = litOf(L.c), edge = L.side === 't' ? dt - 9 * k : db + 9 * k;
          out.route[L.ci] = L.pts.map(function (q) {
            var cost = function (Pp) {
              var bad = 0, len = 0;
              for (var s2 = 0; s2 < Pp.length - 1; s2++) {
                var a = Pp[s2], b = Pp[s2 + 1], Ls = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(Ls / 1.5));
                len += Ls;
                for (var u = 0; u <= n; u++) { var x = a[0] + (b[0] - a[0]) * u / n, y = a[1] + (b[1] - a[1]) * u / n; if (Math.hypot(x - q[0], y - q[1]) < 5) continue; var id = at(x, y); if (id === -2 || (id >= 0 && !lit[id])) bad++; }
                for (var z = 0; z < segs.length; z++) if (segX(a, b, segs[z][0], segs[z][1])) bad += 40;
                for (z = 0; z < boxes.length; z++) if (segBox(a, b, boxes[z])) bad += 40;
              }
              return bad * 1.5 + len * 0.01;
            };
            var best = { P: [[q[0], q[1]], [q[0], edge]] }; best.v = cost(best.P);
            [-1, 1].forEach(function (sg) {
              var last = q[0];
              for (var xx = q[0]; xx >= 0 && xx <= w; xx += sg * 2) { var id = at(xx, q[1]); if (id >= 0 || id === -2) last = xx; }
              var xe = last + sg * 9;
              if (xe < 6 || xe > w - 6) return;
              var Pp = [[q[0], q[1]], [xe, q[1]], [xe, edge]], v = cost(Pp) + 5;
              if (v < best.v - 2) best = { P: Pp, v: v, xe: xe, sg: sg };
            });
            return best.xe == null ? null : { x: best.xe, sg: best.sg, y: q[1] };
          });
        });
        // more than two labels leaving one side for one row would have to run along the row's edge past one another's leaders:
        // those keep their upright runs
        ['t', 'b'].forEach(function (rw) { [-1, 1].forEach(function (sg) {
          var ls2 = ents.filter(function (L) { var r = out.route[L.ci]; return L.side === rw && r && r.some(function (o) { return o && o.sg === sg; }); });
          if (ls2.length > 2) ls2.forEach(function (L) { out.route[L.ci] = out.route[L.ci].map(function (o) { return o && o.sg === sg ? null : o; }); });
        }); });
        // upright runs that would lie along one another step outward, the dot nearest the row first, so no run crosses another
        var runs = [];
        ents.forEach(function (L) { var r = out.route[L.ci]; if (!r) return; L.pts.forEach(function (q, qi) { runs.push({ L: L, qi: qi, q: q, r: r[qi], edge: L.side === 't' ? dt - 9 * k : db + 9 * k }); }); });
        runs.sort(function (a, b) { return Math.abs(a.q[1] - a.edge) - Math.abs(b.q[1] - b.edge); });
        var used = [];
        runs.forEach(function (u) {
          var x = u.r ? u.r.x : u.q[0], y0 = Math.min(u.q[1], u.edge), y1 = Math.max(u.q[1], u.edge), sg = u.r ? u.r.sg : 0;
          for (var t2 = 0; t2 < 6 && used.some(function (o) { return Math.abs(o.x - x) < 6 && o.y0 < y1 && o.y1 > y0; }); t2++) { if (!sg) break; x += sg * 7; }
          if (u.r) u.r.x = x;
          used.push({ x: x, y0: y0, y1: y1 });
        });
        ents.forEach(function (L) { var r = out.route[L.ci]; if (r) out.route[L.ci] = r.map(function (o) { return o ? o.x : null; }); });
        return out;
      }
      function layCols(ents) {
        var out = { y: {}, shape: {}, snap: {}, stats: { cross: 0, dims: 0, foreign: 0, labels: [] } };
        var at = buildMap(), cs = 2;
        // the steep angle: the one in 45 to 80 degrees that keeps furthest from the directions the view's own edges take
        var ad = function (a, b) { var d = Math.abs(a - b) % 180; return Math.min(d, 180 - d); };
        var edges = [[R0[0], R0[3]], [R0[1], R0[4]], [R0[2], R0[5]]].filter(function (v) { return Math.hypot(v[0], v[1]) > 0.2; }).map(function (v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; });
        var thD = 60, bv = -1;
        for (var t = 45; t <= 80; t++) { var v = Math.min.apply(null, edges.map(function (e2) { return Math.min(ad(t, e2), ad(180 - t, e2)); })); if (v > bv) { bv = v; thD = t; } }
        var th = out.th = thD * Math.PI / 180;
        var nearEdge = function (a, b) { var an = Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI; return edges.some(function (e2) { return ad(an, e2) < 10; }) ? 20 : 0; };
        var segs = dimObs.filter(function (o) { return o.seg; }).map(function (o) { return o.seg; }), boxes = dimObs.filter(function (o) { return o.box; }).map(function (o) { return o.box; });
        var cost = function (Pp, lit, A, shape) {
          var bad = 0, hits = 0, near = 0, len = 0;
          for (var s2 = 0; s2 < Pp.length - 1; s2++) {
            var a = Pp[s2], b = Pp[s2 + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 1.5));
            len += L;
            for (var q = 0; q <= n; q++) {
              var x = a[0] + (b[0] - a[0]) * q / n, y = a[1] + (b[1] - a[1]) * q / n;
              if (Math.hypot(x - A[0], y - A[1]) < 5) continue;
              var id = at(x, y); if (id === -2 || (id >= 0 && !lit[id])) bad++;
              for (var z = 0; z < segs.length; z++) if (dist2Seg(x, y, segs[z][0], segs[z][1]) < 2.2) { near++; break; }
            }
            for (var z2 = 0; z2 < segs.length; z2++) if (segX(a, b, segs[z2][0], segs[z2][1])) hits++;
            for (var z3 = 0; z3 < boxes.length; z3++) if (segBox(a, b, boxes[z3])) hits++;
          }
          var pen = shape === 'D' && Pp.length > 2 ? 6 + nearEdge(Pp[0], Pp[1]) : shape === 'A' ? 0.5 : 0;
          return { v: bad * 1.5 + hits * 90 + near * 2 + len * 0.01 + pen, bad: bad * 1.5, hits: hits };
        };
        var boxCost = function (L, y, sd) {
          var sg = sd === 'l' ? -1 : 1, x0 = colX(sd) + sg * 12 * k, x1 = x0 + sg * (L.tw + (L.r ? 2 * L.r + 8 : 0) + 8), bx = [Math.min(x0, x1), y - L.hh / 2, Math.max(x0, x1), y + L.hh / 2];
          var v = 0;
          boxes.forEach(function (b) { if (b[0] < bx[2] && b[2] > bx[0] && b[1] < bx[3] && b[3] > bx[1]) v += 100; });
          segs.forEach(function (sg2) { if (segBox(sg2[0], sg2[1], bx)) v += 100; });
          return v;
        };
        // leaders of two labels that cross, or run along one another within 2 px (which reads as one line), count as a crossing
        var crossings = function (paths, fixed) {
          var n = 0, all = paths.concat(fixed);
          for (var i = 0; i < paths.length; i++) for (var j = i + 1; j < all.length; j++) {
            paths[i].forEach(function (pa) { all[j].forEach(function (pb) {
              for (var u = 0; u < pa.length - 1; u++) for (var v2 = 0; v2 < pb.length - 1; v2++) if (segX(pa[u], pa[u + 1], pb[v2], pb[v2 + 1])) n++;
              var along = 0;
              for (u = 1; u < pa.length - 1; u++) for (var t3 = 0.25; t3 < 1; t3 += 0.25) { var x = pa[u][0] + (pa[u + 1][0] - pa[u][0]) * t3, y = pa[u][1] + (pa[u + 1][1] - pa[u][1]) * t3; for (v2 = 0; v2 < pb.length - 1; v2++) if (dist2Seg(x, y, pb[v2], pb[v2 + 1]) < 2) { along++; break; } }
              if (along >= 2) n++;
            }); });
          }
          return n;
        };
        // each dot on the part it names: a dot that lands on another part moves to the nearest cell of its own, within 14 px
        var lits = {};
        ents.forEach(function (L) {
          var lit = lits[L.ci] = L.c.track ? {} : litOf(L.c);
          out.snap[L.ci] = L.pts.map(function (A) {
            if (L.c.track || L.c._beam || !Object.keys(lit).length) return [0, 0];
            var id = at(A[0], A[1]); if (id >= 0 && lit[id]) return [0, 0];
            var bi = null, bd = Infinity, i0 = Math.floor(A[0] / cs), j0 = Math.floor(A[1] / cs);
            for (var dj = -7; dj <= 7; dj++) for (var di = -7; di <= 7; di++) { var x = (i0 + di + 0.5) * cs, y = (j0 + dj + 0.5) * cs, id2 = at(x, y), dd = Math.hypot(x - A[0], y - A[1]); if (id2 >= 0 && lit[id2] && dd < bd) { bd = dd; bi = [x - A[0], y - A[1]]; } }
            return bi || [0, 0];
          });
        });
        var anchors = function (L) { var sn = out.snap[L.ci]; return L.pts.map(function (A, qi) { return [A[0] + sn[qi][0], A[1] + sn[qi][1]]; }); };
        // a label wants the height of its dots where they now stand
        var wantY = function () { ents.forEach(function (L) { if (L.c.track || !L.pts.length) return; var y = 0; anchors(L).forEach(function (A) { y += A[1]; }); L.y0 = y / L.pts.length + (L.c.dy || 0) * k; }); };
        wantY();
        // the labels on their sides: heights and leader shapes for each column in turn, the second kept clear of the first
        var runSides = function (sideOf) {
          var placed = [], res = { v: 0, y: {}, shape: {}, side: {}, paths: {}, stats: { cross: 0, dims: 0, foreign: 0, labels: [] } };
          ['l', 'r'].forEach(function (sd) {
            var list = ents.filter(function (L) { return sideOf[L.ci] === sd; }); if (!list.length) return;
            var top = colTop(sd), bot = colBot(sd);
            var evalWant = function (want) {
              var ys = resolve(list, want, top, bot), total = 0, shapes = [], paths = [], fans = [], info = [];
              list.forEach(function (L, i) {
                var sh = [], ps = [], bad = 0, hits = 0;
                anchors(L).forEach(function (A) {
                  var best = null;
                  (L.c.track ? ['D'] : ['C', 'A', 'D']).forEach(function (shape) {
                    var Pp = shapePath(A, ys[i], sd, shape, th); if (!Pp) return;
                    var cc = cost(Pp, lits[L.ci], A, shape);
                    if (!best || cc.v < best.c.v) best = { shape: shape, P: Pp, c: cc };
                  });
                  sh.push(best.shape); ps.push(best.P); total += best.c.v; bad = Math.max(bad, best.c.bad); hits += best.c.hits;
                });
                shapes.push(sh); paths.push(L.c.track ? [] : ps); fans.push(ps); info.push({ text: L.c.text, foreign: bad, dims: hits });
                total += Math.abs(ys[i] - L.y0) * 0.04 + boxCost(L, ys[i], sd);
              });
              var cr = crossings(paths, placed);
              return { v: total + 90 * cr, ys: ys, shapes: shapes, paths: paths, cross: cr, info: info, fans: fans };
            };
            var want = list.map(function (L) { return L.y0; }), best = evalWant(want), step = ls.fs * 1.3;
            // two labels that follow their towns round (the globe's) take the order whose fans of leaders cross least as drawn
            if (list.length === 2 && list.every(function (L) { return L.c.track; })) {
              var sw = evalWant([want[1], want[0]]);
              if (crossings(sw.fans, []) < crossings(best.fans, [])) best = sw;
            }
            if (!list.some(function (L) { return L.c.track; })) for (var pass = 0; pass < 2; pass++) {
              for (var i = 0; i < list.length; i++) [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5].forEach(function (d) {
                var w2 = want.slice(); w2[i] = list[i].y0 + d * step; var r = evalWant(w2);
                if (r.v < best.v - 0.5) { best = r; want = w2; }
              });
              // two labels trade places, each a step past the other's height
              for (var a = 0; a < list.length; a++) for (var b = a + 1; b < list.length; b++) [0, 1, 2].forEach(function (d) {
                var w2 = want.slice(), up = list[a].y0 < list[b].y0 ? b : a, dn = up === a ? b : a;
                w2[up] = Math.min(list[a].y0, list[b].y0) - d * step; w2[dn] = Math.max(list[a].y0, list[b].y0) + d * step;
                var r = evalWant(w2); if (r.v < best.v - 0.5) { best = r; want = w2; }
              });
            }
            list.forEach(function (L, i) { res.y[L.ci] = best.ys[i]; res.shape[L.ci] = best.shapes[i]; res.side[L.ci] = sd; res.paths[L.ci] = best.paths[i]; });
            best.paths.forEach(function (ps) { placed.push(ps); });
            res.v += best.v; res.stats.cross += best.cross;
            best.info.forEach(function (x) { res.stats.dims += x.dims; res.stats.foreign = Math.max(res.stats.foreign, x.foreign); res.stats.labels.push(x); });
          });
          return res;
        };
        var sideOf = {}; ents.forEach(function (L) { sideOf[L.ci] = L.side; });
        var best = runSides(sideOf);
        // a label whose leader still crosses a dimension or runs over another part tries the other column, where that column
        // has the width for it
        var needOf = function (L) { return L.tw + (L.c.n ? ls.num * 2 + 6 : 0) + 30; };
        ents.forEach(function (L) {
          if (L.c.track || L.c._flip) return;
          var mine = best.stats.labels.filter(function (x) { return x.text === L.c.text; })[0];
          if (!mine || (mine.dims === 0 && mine.foreign < 12)) return;
          var other = best.side[L.ci] === 'l' ? 'r' : 'l';
          if ((fit.rooms[other] || 0) < needOf(L)) return;
          var trial = {}; for (var q in best.side) trial[q] = best.side[q]; trial[L.ci] = other;
          var r = runSides(trial);
          if (r.v < best.v - 30) best = r;
        });
        // a leader that still crosses a dimension or another part tries other dots on its own part, nearby, and keeps the one
        // whose leader runs cleanest (a dot moved further costs a little more)
        var dotSearch = function () { ents.forEach(function (L) {
          if (L.c.track || L.c._beam) return;
          var mine = best.stats.labels.filter(function (x) { return x.text === L.c.text; })[0];
          var lit = lits[L.ci], sd = best.side[L.ci], y = best.y[L.ci], others = [];
          for (var q in best.paths) if (+q !== L.ci && best.paths[q] && best.paths[q].length) others.push(best.paths[q]);
          if (!mine || (mine.dims === 0 && mine.foreign < 12 && !crossings([best.paths[L.ci] || []], others))) return;
          var sn = out.snap[L.ci], improved = false;
          L.pts.forEach(function (A0, qi) {
            var cur = [A0[0] + sn[qi][0], A0[1] + sn[qi][1]], score = function (D) {
              var b = null;
              ['C', 'A', 'D'].forEach(function (shape) {
                var Pp = shapePath(D, y, sd, shape, th); if (!Pp) return;
                var cc = cost(Pp, lit, D, shape), v = cc.v + 90 * crossings([[Pp]], others) + (L.c._flip ? 0.05 : 0.25) * Math.hypot(D[0] - A0[0], D[1] - A0[1]);
                if (!b || v < b.v) b = { v: v, shape: shape, P: Pp, c: cc };
              });
              return b;
            };
            var now = score(cur); if (!now) return;
            // a label moved to the other column looks for its dot over the whole of its part
            var R1 = L.c._flip ? Math.max(w, h) : 70, R2 = L.c._flip ? Math.max(w, h) : 90, st2 = L.c._flip ? 6 : 4;
            for (var dy = -R1; dy <= R1; dy += st2) for (var dx = -R2; dx <= R2; dx += st2) {
              var D = [A0[0] + dx, A0[1] + dy], id = at(D[0], D[1]);
              if (!(id >= 0 && lit[id])) continue;
              // a dot needs its own part round it, not an edge
              if (!lit[at(D[0] - 3, D[1])] || !lit[at(D[0] + 3, D[1])] || !lit[at(D[0], D[1] - 3)] || !lit[at(D[0], D[1] + 3)]) continue;
              var sc2 = score(D);
              if (sc2 && sc2.v < now.v - 15) { now = sc2; sn[qi] = [dx, dy]; best.shape[L.ci][qi] = sc2.shape; best.paths[L.ci][qi] = sc2.P; improved = true; mine.foreign = sc2.c.bad; mine.dims = sc2.c.hits; }
            }
          });
          if (improved) { best.stats.dims = 0; best.stats.foreign = 0; best.stats.labels.forEach(function (x) { best.stats.dims += x.dims; best.stats.foreign = Math.max(best.stats.foreign, x.foreign); }); }
        }); };
        var crossAll = function (b) { var allP = []; for (var q2 in b.paths) if (b.paths[q2] && b.paths[q2].length) allP.push(b.paths[q2]); return crossings(allP, []); };
        // the dots moved: the labels are set again at their new heights, and the dots searched once more
        for (var round = 0; round < 2; round++) {
          dotSearch();
          var c0 = crossAll(best), d0 = best.stats.dims;
          if (!c0 && !d0) break;
          wantY();
          var again = runSides(best.side);
          if (crossAll(again) + again.stats.dims < c0 + d0 || (crossAll(again) + again.stats.dims === c0 + d0 && again.v < best.v)) best = again;
        }
        // the final count of leaders crossing, over every label's final leaders
        best.stats.cross = crossAll(best);
        // a label that still crosses a dimension or another leader moves to the other column even where that column has no
        // width yet: the plate is fitted again with it there (rooms reads c._flip) and laid out again, its dot free to move
        // anywhere on its part
        if (!ents.some(function (L) { return L.c._flip; })) ents.some(function (L) {
          if (L.c.track || L.c._beam) return false;
          var mine = best.stats.labels.filter(function (x) { return x.text === L.c.text; })[0], others = [];
          for (var q3 in best.paths) if (+q3 !== L.ci && best.paths[q3] && best.paths[q3].length) others.push(best.paths[q3]);
          if (!mine || (!mine.dims && !crossings([best.paths[L.ci] || []], others))) return false;
          var other = best.side[L.ci] === 'l' ? 'r' : 'l';
          if ((fit.rooms[other] || 0) >= needOf(L)) return false;
          L.c._flip = other; self._refit = true; return true;
        });
        out.y = best.y; out.shape = best.shape; out.side = best.side; out.stats = best.stats;
        return out;
      }
      function drawCols(ents, lay) {
        var lineC = css(mix(pal.bg, pal.ink, pal.dark ? 0.7 : 0.78)), th = null;
        if (lay) th = lay.th;
        ['l', 'r'].forEach(function (sd) {
          var list = ents.filter(function (L) { return (lay && lay.side && lay.side[L.ci]) ? lay.side[L.ci] === sd : L.side === sd; }); if (!list.length) return;
          var ys = lay && list.every(function (L) { return lay.y[L.ci] != null; }) ? list.map(function (L) { return lay.y[L.ci]; }) : resolve(list, list.map(function (L) { return L.y0; }), colTop(sd), colBot(sd));
          var sg = sd === 'l' ? -1 : 1, xs = colX(sd), Sx = xs + sg * 12 * k;
          list.forEach(function (L, li) {
            var c = L.c, y = ys[li], fo = foc && foc.n === c.n && foc.text === c.text, col = fo ? hlC : inkC, lc = fo ? hlC : lineC;
            var la = clamp01(labT * 1.5) * LA, ta = clamp01((labT - 0.3) / 0.7) * (foc && !fo ? 0.45 : 1) * LA;
            // a tracking label whose towns are all round the back is set back with them
            if (L.wts) ta *= 0.4 + 0.6 * L.wts.reduce(function (a, b) { return Math.max(a, b); }, 0);
            var sn = lay && !c.track && lay.snap[L.ci], shp = lay && !c.track && lay.shape[L.ci];
            L.pts.forEach(function (q, qi) {
              var wq = L.wts ? L.wts[qi] : 1, A = sn && sn[qi] ? [q[0] + sn[qi][0], q[1] + sn[qi][1]] : [q[0], q[1]];
              var Pp = shapePath(A, y, sd, shp ? shp[qi] : 'D', th) || shapePath(A, y, sd, 'D', th);
              // a leader to a globe's pin ends at the pin's head, which marks the spot itself: no dot of its own over it
              if (c.track && Pp.length > 1) { var hx = Pp[1][0] - Pp[0][0], hy = Pp[1][1] - Pp[0][1], hL = Math.hypot(hx, hy) || 1, hs = Math.min(4.5 * k, hL * 0.5); Pp = [[Pp[0][0] + hx / hL * hs, Pp[0][1] + hy / hL * hs]].concat(Pp.slice(1)); }
              var path = partial(Pp, la);
              if (path.length > 1) { g.lines([path], bgC, 3.2 * k, null, 0.85 * ta * wq, 'round'); g.lines([path], lc, (fo ? 1 : ls.numbersOnly ? 0.85 : 0.7) * k, null, Math.max(ta, la * 0.9) * wq, 'round'); }
              if (!c.track) g.circle(A[0], A[1], 2.3 * k, col, bgC, 1.1 * k, la * wq);
            });
            var tx = Sx + sg * 5 * k, x0, x1;
            if (c.n) {
              var r = L.r, ccx = Sx + sg * (r + 1);
              g.circle(ccx, y, r, bgC, col, (fo ? 1.5 : ls.numbersOnly ? 1.3 : 1.1) * k, ta);
              g.text(String(c.n), ccx, y + 0.5, { size: Math.round(r * (ls.numbersOnly ? 1.2 : 1.32)), weight: 600, fill: col, align: 'center', alpha: ta });
              tx = ccx + sg * (r + 5 * k);
            }
            L.lines.forEach(function (s2, li2) {
              var yy = y + (li2 - (L.lines.length - 1) / 2) * ls.fs * 1.18;
              g.text(s2, tx, yy, { size: ls.fs, weight: fo || c.strong ? 600 : 500, fill: c.col && !fo ? css(colOf(c.col)) : col, align: sd === 'l' ? 'right' : 'left', alpha: ta, halo: bgC, haloW: 3 });
            });
            x0 = sd === 'l' ? tx - L.tw - 4 : Math.min(xs, tx) - 4; x1 = sd === 'l' ? xs + 4 : tx + L.tw + 4;
            if (LA > 0.5) self._hit.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: y - L.hh / 2 - 4, y1: y + L.hh / 2 + 4, c: c });
          });
        });
      }
      // a row of labels over the drawing and a row under it: each label centred over its dots where it can be, its leaders
      // running straight up or down to the row, then along its edge to the label
      function drawRows(ents, lay) {
        var lineC = css(mix(pal.bg, pal.ink, pal.dark ? 0.7 : 0.78)), rt = lay && lay.route || {};
        // a label whose leaders leave sideways stands over (or under) the place they turn
        ents.forEach(function (L) { var r = rt[L.ci]; if (!r || !r.some(function (x) { return x != null; })) return; var sx = 0; L.pts.forEach(function (q, qi) { sx += r[qi] != null ? r[qi] : q[0]; }); L.x = sx / L.pts.length; });
        ['t', 'b'].forEach(function (rw) {
          var list = ents.filter(function (L) { return L.side === rw; }).sort(function (a, b) { return a.x - b.x; }); if (!list.length) return;
          var edge = rw === 't' ? dt - 9 * k : db + 9 * k, bw = list.map(function (L) { return (L.c.n && ls.numbersOnly ? 0 : L.tw) + (L.r ? 2 * L.r + (L.c.n && ls.numbersOnly ? 0 : 6) : 0); });
          var xs = list.map(function (L, i) { return Math.max(bw[i] / 2 + 4, Math.min(w - bw[i] / 2 - 4, L.x)); });
          for (var i = 1; i < list.length; i++) { var lo = xs[i - 1] + (bw[i - 1] + bw[i]) / 2 + 12; if (xs[i] < lo) xs[i] = lo; }
          var over = xs[list.length - 1] + bw[list.length - 1] / 2 - (w - 4);
          if (over > 0) { xs[list.length - 1] -= over; for (i = list.length - 2; i >= 0; i--) { var hi = xs[i + 1] - (bw[i + 1] + bw[i]) / 2 - 12; if (xs[i] > hi) xs[i] = hi; } }
          list.forEach(function (L, li) {
            var c = L.c, lx = xs[li], fo = foc && foc.n === c.n && foc.text === c.text, col = fo ? hlC : inkC, lc = fo ? hlC : lineC;
            var la = clamp01(labT * 1.5) * LA, ta = clamp01((labT - 0.3) / 0.7) * (foc && !fo ? 0.45 : 1) * LA;
            var yc = rw === 't' ? edge - 4 - L.hh / 2 : edge + 4 + L.hh / 2, x0 = lx - bw[li] / 2, x1 = lx + bw[li] / 2;
            L.pts.forEach(function (q, qi) {
              var xe = rt[L.ci] ? rt[L.ci][qi] : null, ux = xe != null ? xe : q[0], head = xe != null ? [[q[0], q[1]], [xe, q[1]]] : [[q[0], q[1]]];
              var cxl = Math.max(x0 + 3, Math.min(x1 - 3, ux)), Pp = head.concat(cxl === ux ? [[ux, edge]] : [[ux, edge], [cxl, edge]]), path = partial(Pp, la);
              if (path.length > 1) { g.lines([path], bgC, 3.2 * k, null, 0.85 * ta, 'round'); g.lines([path], lc, (fo ? 1 : 0.7) * k, null, Math.max(ta, la * 0.9), 'round'); }
              g.circle(q[0], q[1], 2.3 * k, col, bgC, 1.1 * k, la);
            });
            var tx = x0;
            if (c.n) { var r = L.r; g.circle(x0 + r, yc, r, bgC, col, 1.2 * k, ta); g.text(String(c.n), x0 + r, yc + 0.5, { size: Math.round(r * 1.25), weight: 600, fill: col, align: 'center', alpha: ta }); tx = x0 + 2 * r + 6; }
            if (!(c.n && ls.numbersOnly)) L.lines.forEach(function (s2, li2) {
              var yy = yc + (li2 - (L.lines.length - 1) / 2) * ls.fs * 1.18;
              g.text(s2, c.n ? tx : lx, yy, { size: ls.fs, weight: fo || c.strong ? 600 : 500, fill: c.col && !fo ? css(colOf(c.col)) : col, align: c.n ? 'left' : 'center', alpha: ta, halo: bgC, haloW: 3 });
            });
            if (LA > 0.5) self._hit.push({ x0: x0 - 4, x1: x1 + 4, y0: yc - L.hh / 2 - 4, y1: yc + L.hh / 2 + 4, c: c });
          });
        });
      }
    }
    this.items = count;
    return count;
  };

  /* ---------------- running it in a canvas ----------------
     The page owns the canvas and the clock (src/app.js Stage): it calls render() only while something moves (the entrance, a
     turn, a part lighting, the globe), so a settled plate costs nothing. render() fits the drawing once per size and mode. */
  var hasWin = typeof window !== 'undefined' && typeof document !== 'undefined';
  // the focus a label carries: its tag (the logic dies, not the whole tier), or the parts its leaders point at, and the ink
  // or the accents alone where its part's light table says so (only)
  P.focusOf = function (c) {
    if (!c) return null;
    // a label with no tag lights the items its leaders land on and their kin (P.build labelTargets), and a light path it points at
    if (c._ids && !c.tag && !c.focus) return { n: c.n, text: c.text, tags: null, parts: null, ids: c._ids, beam: !!c._beam, strict: false, only: c.only || null };
    var parts = [c.part]; c.pts.forEach(function (q) { if (q[3] != null && parts.indexOf(q[3]) < 0) parts.push(q[3]); });
    return { n: c.n, text: c.text, tags: c.tag ? [].concat(c.tag) : null, parts: c.focus || parts, strict: !!c.tag, only: c.only || null, beam: !!c._beam };
  };
  PL.setFocus = function (f) { this.focus = f; };
  PL.calloutN = function (n) { return this.m.callouts.filter(function (x) { return x.n === n; })[0] || null; };
  PL.focusN = function (n) { this.setFocus(n ? P.focusOf(this.calloutN(n)) : null); };
  // the numbered labels take the names the chapter's parts list gives (data/specimen-parts.json: label, else name), and a
  // part's light table may keep it to the ink or the accents
  PL.names = function (parts) {
    var self = this;
    (parts || []).forEach(function (p) {
      var c = self.calloutN(+p.n); if (!c) return;
      if (p.name && p.name !== c.text) { c.text = p.name; c._lines = null; self._fitKey = null; }
      var only = (p.light || []).map(function (h) { return h.only || ''; });
      if (only.length && only.every(function (o) { return o && o === only[0]; }) && !c.only) c.only = only[0];
    });
  };
  // the mode a canvas shows the plate in: { numbersOnly, noDims, oneDim (the plate's first dimension alone), noLabels, pad }
  PL.mode = function (md) { md = md || {}; this.o.numbersOnly = !!md.numbersOnly; this.o.noDims = !!md.noDims; this.o.oneDim = !!md.oneDim; this.o.noLabels = !!md.noLabels; this.o.pad = md.pad == null ? null : md.pad; return (md.numbersOnly ? 'n' : '') + (md.noDims ? 'd' : '') + (md.oneDim ? '1' : '') + (md.noLabels ? 'l' : '') + (md.pad == null ? '' : 'p' + md.pad); };
  // where the drawing's foot is on its canvas, in css px (the page sets the caption under it)
  PL.foot = function () { var f = this._fit; return f ? f.cy - f.s * f.e.miny : null; };
  /* one frame into a 2D context. st = { k (entrance, 1 at rest), dyaw, delev, labA, mode, dark, pick, lite, el (where the
     colours are read) } */
  PL.render = function (ctx, w, h, dpr, st) {
    var key = this.mode(st.mode) + '|' + Math.round(w) + 'x' + Math.round(h);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var g = new CanvasG(ctx, dpr);
    if (this._fitKey !== key || !this._fit) { this.m.callouts.forEach(function (c) { c._lines = null; }); this.ext = null; this._fit = this.fit(w, h, g); this._fitKey = key; }
    var pk = (st.dark ? 'd' : 'l'), pal = this._pal && this._palKey === pk ? this._pal : (this._pal = P.palette(st.el || null, this.m.spec, !!st.dark, false));
    this._palKey = pk;
    var K = st.k == null ? 1 : st.k;
    this.paint({ k: K, w: w, h: h, g: g, pal: pal, fit: this._fit, scale: K < 1 ? 0.975 + 0.025 * easeOut(K * 1.6) : 1, noDims: this.o.noDims, oneDim: this.o.oneDim, noLabels: this.o.noLabels,
      lite: !!st.lite, dyaw: st.dyaw || 0, delev: st.delev || 0, labA: st.labA == null ? 1 : st.labA, pick: !!st.pick, inkK: st.inkK });
    // a label moved to its other column: fitted again on the next frame (the page asks for one, src/app.js Stage.frame)
    if (this._refit) { this._refit = false; this._fitKey = null; this.ext = null; this.wantsFrame = true; }
    this.w = w; this.h = h;
  };
  // the colours change with the theme: the next frame reads them again
  PL.recolor = function () { this._pal = null; };
  // the fit is measured with the page's faces: once they are in, it is laid out again
  PL.refit = function () { this._fit = null; this._fitKey = null; this.m.callouts.forEach(function (c) { c._lines = null; }); };
  // what the pointer is on, in canvas px: a label (its hit box), else the topmost face or dot drawn there, as the label that
  // names it. Faces are recorded by a frame drawn with st.pick
  function inPoly(x, y, pts) { var c = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) c = !c; } return c; }
  PL.hitAt = function (x, y) {
    var hit = null, self = this;
    (this._hit || []).forEach(function (b) { if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) hit = b.c; });
    if (hit) return hit;
    var pk = this._pick || [], it = null;
    for (var i = pk.length - 1; i >= 0 && !it; i--) {
      var e = pk[i];
      if (e.pts) { if (inPoly(x, y, e.pts)) it = e.it; }
      else for (var j = 0; j < e.dots.length; j++) { var d = e.dots[j]; if (Math.abs(d[0] - x) < e.r && Math.abs(d[1] - y) < e.r) { it = e.it; break; } }
    }
    if (!it) return null;
    // the label that names this item: a numbered one first, then the others, in their order
    var list = this.m.callouts.slice().sort(function (a, b) { return (a.n ? 0 : 1) - (b.n ? 0 : 1); });
    for (i = 0; i < list.length; i++) { var f = P.focusOf(list[i]); if (P.lit(f, it) || (it.kind === 'solid' && it.decals.some(function (d) { return d.items.some(function (q) { return P.lit(f, q, it); }); }))) return list[i]; }
    void self;
    return null;
  };
  // the still: the same drawing as SVG, for print and for the small stills (o: dark, print, lod, noDims, noLabels, numbersOnly,
  // measure, the width of a string in the page's faces)
  var svgN = 0;
  PL.svg = function (w, h, o) {
    o = o || {};
    var g = new SvgG(w, h, 'p' + (svgN++).toString(36) + '-'), pal = P.palette(o.el || null, this.m.spec, !!o.dark, !!o.print);
    if (o.measure) g.mfn = o.measure;
    var lod0 = this.lod, ext0 = this.ext, f0 = this.focus, md0 = [this.o.numbersOnly, this.o.noDims, this.o.noLabels];
    this.lod = o.lod || 'full'; this.ext = null; this.focus = null;
    this.mode({ numbersOnly: o.numbersOnly, noDims: o.noDims, noLabels: o.noLabels });
    this.m.callouts.forEach(function (c) { c._lines = null; });
    this.paint({ k: 1, w: w, h: h, g: g, pal: pal, fit: this.fit(w, h, g), lod: this.lod, noDims: o.noDims, noLabels: o.noLabels, dyaw: o.dyaw || 0 });
    // a label moved to its other column: drawn again, fitted with it there
    if (this._refit) { this._refit = false; this.ext = null; this.m.callouts.forEach(function (c) { c._lines = null; }); g = new SvgG(w, h, 'p' + (svgN++).toString(36) + '-'); if (o.measure) g.mfn = o.measure; this.paint({ k: 1, w: w, h: h, g: g, pal: pal, fit: this.fit(w, h, g), lod: this.lod, noDims: o.noDims, noLabels: o.noLabels, dyaw: o.dyaw || 0 }); }
    this.lod = lod0; this.ext = ext0; this.focus = f0; this.o.numbersOnly = md0[0]; this.o.noDims = md0[1]; this.o.noLabels = md0[2];
    this.m.callouts.forEach(function (c) { c._lines = null; }); this._fitKey = null;
    return g.svg(o.bg ? css(pal.bg) : null);
  };
  P.CanvasG = CanvasG; P.SvgG = SvgG; P.viewM = viewM; P.MATS = MATS; P.easeOut = easeOut;
  void hasWin;

  root.PLATE = P;
  if (typeof module !== 'undefined' && module.exports) module.exports = P;
})(typeof self !== 'undefined' ? self : this);
