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
  M.real = function (r) { this._real = r || null; };
  M.mat = function (m) { return typeof m === 'string' ? (MATS[m] || MATS.steel) : (m || MATS.steel); };
  // a solid: faces added between begin and end; its edges are paired at end
  M.begin = function (mat, o) {
    o = o || {};
    var mm0 = this.mat(mat), s = { kind: 'solid', real: o.real || mm0.real || this._real || null, soft: !!o.soft, noCast: !!o.noCast || !!o.soft, inner: !!o.inner, part: this.cur.idx, mat: mm0, f0: this.F.length, f1: 0, decals: [], sortFaces: !!o.sortFaces, two: !!o.two, keep: o.keep !== false, lod: o.lod || 0, alpha: o.alpha };
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
    s.c = [cx / m, cy / m, cz / m]; s.ymin = Infinity; s.ymax = -Infinity; s.tag = this._tag;
    for (var vk in seen) { s.ymin = Math.min(s.ymin, this.V[vk * 3 + 1]); s.ymax = Math.max(s.ymax, this.V[vk * 3 + 1]); }
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
        var fc = this.face(vq, nrm, { curve: !flat, mj: vq.length === 4 && !flat ? j : -1, mat: cap && o.capMat ? this.mat(o.capMat) : nr < -0.3 && o.innerMat ? this.mat(o.innerMat) : null });
        if (nr < -0.3) fc.inner = true;
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
    s.axisN = t.n([0, 1, 0]); s.lip = !!o.lip;
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
    var it = { kind: 'wire', real: o.real || this._real || null, edge: !!o.edge, part: this.cur.idx, pts: pts, c: o.c || centroid(pts), col: o.col || 'ink', lw: o.lw || 1, dash: o.dash || null, alpha: o.alpha == null ? 1 : o.alpha, lod: o.lod || 0, closed: !!o.closed, vis: o.vis || null };
    it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it;
  };
  // a field of dots in its place among the solids (a bump array, a ball grid, a plasma)
  M.dots = function (pts, o) {
    o = o || {};
    var it = { kind: 'dots', real: o.real || this._real || null, cap: !!o.cap, part: this.cur.idx, pts: pts, c: o.c || centroid(pts), col: o.col || 'ink', r: o.r || 1, alpha: o.alpha == null ? 1 : o.alpha, lod: o.lod || 0, ring: !!o.ring, front: !!o.front, keepThumb: !!o.keepThumb };
    it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it;
  };
  /* a spike: a pin that stands straight up the page from its foot, its drawn length len (model units, at the drawing's scale)
     whatever way the model turns, sx css px to the side of the foot (the globe's pins, 22 Nov 2026 plates refine: a pin standing
     out of the surface was drawn shorter the more it faced the reader). pts, the foot and a point len out along the surface's
     normal, serve what a label lights */
  M.spike = function (foot, len, o) {
    o = o || {};
    var L = Math.hypot(foot[0], foot[1], foot[2]) || 1, head = [foot[0] * (1 + len / L), foot[1] * (1 + len / L), foot[2] * (1 + len / L)];
    var it = { kind: 'spike', part: this.cur.idx, foot: foot, len: len, sx: o.sx || 0, pts: [foot, head], c: foot, vis: foot, col: o.col || 'acc', lw: o.lw || 1.7, r: o.r || 3, alpha: 1, lod: 0 };
    it.tag = this._tag; this.cur.items.push(it); this.S.push(it); return it;
  };
  // lines that are not parts: guides between parts (each point may name its part), the assembly axis, the light path
  M.guide = function (pts, o) { o = o || {}; this.lines.push({ pts: pts, style: o.style || 'guide', col: o.col || 'ink', lw: o.lw, alpha: o.alpha, lod: o.lod || 0, front: !!o.front, knock: !!o.knock, knockDark: !!o.knockDark }); };
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
    this.callouts.push({ pts: pts.map(function (q) { return [q[0], q[1], q[2], q[3] == null ? null : q[3]]; }), text: text, n: o.n || 0, part: o.part != null ? o.part : own != null ? own : this.cur.idx, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, strong: !!o.strong, col: o.col || null, only: o.only || null, track: o.track || null, row: o.row || null, level: !!o.level, via: o.via || null, rowAt: o.rowAt ? (o.rowAt[0] && o.rowAt[0].length ? o.rowAt : [o.rowAt]) : null });
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
      } else if ((it.kind === 'wire' || it.kind === 'dots' || it.kind === 'spike') && it.pts) {
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
        var all = m.parts[pi].items.filter(function (it) { return it.kind === 'solid' || it.kind === 'wire' || it.kind === 'dots' || it.kind === 'spike'; });
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
      m.callouts.push({ pts: pts, text: an.name, n: an.n, part: an.part, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, only: o.only || null, row: o.row || null, level: !!o.level });
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
  // a bar may carry witness lines (o.wit: the two points its ends measure, in the loupe model's units), drawn from the
  // points to just past the bar's ends, so a bar set beside a row reads as measuring that row (22 Nov 2026 expert review: the
  // HBM loupe's 20 um bar sat under a die with nothing to say it measured the bumps above it)
  P.loupeBar = function (m, a, b, text, o) { o = o || {}; (m.bars || (m.bars = [])).push({ a: a, b: b, text: text, side: o.side, tx: o.tx, ty: o.ty, align: o.align, wit: o.wit || null }); };
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
    fillAny: function (pts, f, alpha) {
      if (typeof f === 'string') return this.poly(pts, f, alpha);
      var x = this.x, gr = f.r != null ? x.createRadialGradient(f.x0, f.y0, 0, f.x0, f.y0, f.r) : x.createLinearGradient(f.x0, f.y0, f.x1, f.y1); f.stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
      x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath();
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.fillStyle = gr; x.fill(); x.globalAlpha = 1;
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
  function SvgG(w, h, pre) { this.out = []; this.defs = {}; this.gk = {}; this.w = w; this.h = h; this.cid = 0; this.pre = pre || ''; this.mfn = null; this.ga = 1; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function ptsStr(pts) { return pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  SvgG.prototype = {
    // an opaque face also strokes its own edge at half a pixel, so PDF viewers show no seams between neighbouring faces
    fillAny: function (pts, f, alpha) {
      var paint = typeof f === 'string' ? f : 'url(#' + this.grad(f) + ')';
      if (alpha != null && alpha < 0.999) return this.poly(pts, paint, alpha);
      this.out.push('<polygon points="' + ptsStr(pts) + '" fill="' + paint + '" stroke="' + paint + '" stroke-width="0.5" stroke-linejoin="round"/>');
    },
    // a gradient as a def: linear (x0, y0 to x1, y1) or radial (centre x0, y0, radius r, focus fx, fy, fr); stops [offset, colour, opacity]
    grad: function (f) {
      var st = f.stops.map(function (q) { return '<stop offset="' + Math.round(q[0] * 1000) / 1000 + '" stop-color="' + q[1] + '"' + (q[2] != null && q[2] < 1 ? ' stop-opacity="' + Math.round(q[2] * 1000) / 1000 + '"' : '') + '/>'; }).join('');
      var geo = f.r != null ? 'cx="' + f1(f.x0) + '" cy="' + f1(f.y0) + '" r="' + f1(Math.max(0.1, f.r)) + '"' + (f.fx != null ? ' fx="' + f1(f.fx) + '" fy="' + f1(f.fy) + '" fr="' + f1(f.fr || 0) + '"' : '') : 'x1="' + f1(f.x0) + '" y1="' + f1(f.y0) + '" x2="' + f1(f.x1) + '" y2="' + f1(f.y1) + '"';
      var key = geo + st, id = this.gk[key];
      if (!id) { var tag = f.r != null ? 'radialGradient' : 'linearGradient'; id = this.gk[key] = this.pre + 'g' + (this.cid++); this.defs[id] = '<' + tag + ' id="' + id + '" gradientUnits="userSpaceOnUse" ' + geo + '>' + st + '</' + tag + '>'; }
      return id;
    },
    circleAny: function (cx, cy, r, f, alpha) { this.out.push('<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="' + (typeof f === 'string' ? f : 'url(#' + this.grad(f) + ')') + '"' + (alpha != null && alpha < 1 ? ' fill-opacity="' + f1(alpha * 100) / 100 + '"' : '') + '/>'); },
    // a soft shadow: its shapes filled as one in col, blurred by blur px, at alpha; clipped to the faces that receive it, or
    // (the ground's) faded over the still's last 24 px
    shadow: function (shapes, blur, alpha, col, clip, fade) {
      if (!shapes.length || alpha <= 0.003) return;
      var bid = this.pre + 'b' + Math.round(blur * 10), o = '', cl = '';
      if (!this.defs[bid]) this.defs[bid] = '<filter id="' + bid + '" filterUnits="userSpaceOnUse" x="-40" y="-40" width="' + Math.round(this.w + 80) + '" height="' + Math.round(this.h + 80) + '" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="' + f1(blur) + '"/></filter>';
      if (clip) { var cid = this.pre + 'c' + (this.cid++); this.out.push('<clipPath id="' + cid + '">' + clip.map(function (p) { return '<polygon points="' + ptsStr(p) + '"/>'; }).join('') + '</clipPath>'); cl = ' clip-path="url(#' + cid + ')"'; }
      else if (fade) {
        var mid = this.pre + 'fade';
        if (!this.defs[mid]) this.defs[mid] = '<filter id="' + mid + 'b" filterUnits="userSpaceOnUse" x="0" y="0" width="' + Math.round(this.w) + '" height="' + Math.round(this.h) + '"><feGaussianBlur stdDeviation="6"/></filter><mask id="' + mid + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + Math.round(this.w) + '" height="' + Math.round(this.h) + '"><rect x="12" y="12" width="' + Math.max(1, Math.round(this.w - 24)) + '" height="' + Math.max(1, Math.round(this.h - 24)) + '" fill="#fff" filter="url(#' + mid + 'b)"/></mask>';
        cl = ' mask="url(#' + mid + ')"';
      }
      shapes.forEach(function (p) { if (p.length > 2) o += '<polygon points="' + ptsStr(p) + '"/>'; });
      this.out.push('<g' + cl + '><g fill="' + col + '" opacity="' + Math.round(alpha * 1000) / 1000 + '" filter="url(#' + bid + ')">' + o + '</g></g>');
    },
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
  /* ---------------- the materials (specimen colour, 24 Nov 2026: treatment C, Rendered) ----------------
     A solid names its real material (m.real in the plates, or real: on a face, a decal or a wire), and the plate draws it in that
     material's colour. L is the colour on the paper ground and D on the night ground (objects keep their colour within a few
     percent there, and the pale masses are capped so the true colours lead). g is the polish: mirror 0.85 and over, satin 0.5 to
     0.85, matte under 0.5. metal: its reflection takes its own colour. studio: a stainless finish, cool on top with a warm bounce
     below. strip: how far a polished turned part's highlight goes toward white (mstrip the same for a flat mirror). clear: the
     share of light it stops. edge: a clear or glass part's edge. cut: its section colour (else derived, paler and warmer than any
     outside face; cutD on the night ground). noHatch: a cut face with no ruling. lineK: the tone of lines drawn in it.
     stopsC: the material's own reflection stops across a flat face, in place of its polish class's.
     The reasons are in qa/builds-nov/round-24nov/shots/spec-color/NOTES.md (main checkout), one line each here. */
  var REAL = P.REAL = {
    // silicon: the circuit face graphite with a violet cast and a teal cache; bare silicon a near-neutral grey with a slight blue
    siFace:   { L: '#474c66', D: '#454a63', g: 0.55 },                                // a die's circuit face: graphite with the violet-blue cast of its top metal and dielectric
    siLogic:  { L: '#57557a', D: '#545276', g: 0.5 },                                 // logic blocks on that face: the violet cast a little stronger
    siSram:   { L: '#3f6873', D: '#3d646f', g: 0.6 },                                 // SRAM arrays: the green-teal cast large regular arrays show in die photos
    siPhy:    { L: '#4b5064', D: '#494e62', g: 0.45 },                                // interface and wiring blocks: plain graphite
    siChan:   { L: '#33374a', D: '#353a4d', g: 0.5 },                                 // the die face between blocks (01): the darkest channels
    siBack:   { L: '#8d929c', D: '#868b95', g: 0.9, mstrip: 0.68, cut: '#b4bac6' },   // a die's ground back: polished silicon, a mirror with a real dark band
    siWafer:  { L: '#a8adb6', D: '#9da2ab', g: 0.95, cut: '#b4bac6' },                // a bare polished wafer: a silver-grey mirror
    siProc:   { L: '#9296aa', D: '#888ca0', g: 0.9, cut: '#b4bac6' },                 // a patterned wafer: a mirror under the die grid's violet sheen
    siIngot:  { L: '#7f8590', D: '#777d88', g: 0.9, metal: true, strip: 0.72 },       // the ingot: polished silicon's gunmetal grey
    siCut:    { L: '#8f96a3', D: '#868d9a', g: 0.3, cut: '#b4bac6' },                 // silicon in section and in thin layers: slate grey
    siSheet:  { L: '#7a8191', D: '#737a8a', g: 0.2 },                                 // 08's nanosheets: a step darker than the gate's lit face
    siEpi:    { L: '#b5bccb', D: '#a7aebd', g: 0.2 },                                 // doped silicon grown on the sheets' ends: paler and cooler, so it reads apart
    siBase:   { L: '#6a707d', D: '#646a77', g: 0.6, cut: '#b4bac6' },                 // 09's base die: a step darker than the memory dies
    siHole:   { L: '#545b6b', D: '#4f5666', g: 0.2 },                                 // the wall of an etched hole, in its own shadow
    siProbed: { L: '#7a7e93', D: '#707489', g: 0.9, lineK: 1.4 },                     // 12's dies under test: the wafer's hue a step darker
    stiOx:    { L: '#cddce3', D: '#93a4ac', g: 0.2 },                                 // isolation oxide in section: glassy pale blue-white
    // metals: near neutral, apart by warmth and value; the coloured metals at full strength
    cu:       { L: '#c8733f', D: '#c26e3b', g: 0.75, metal: true, strip: 0.5, cut: '#e09a72' }, // copper: wiring, vias, bumps, the busbar and coils
    au:       { L: '#d4a646', D: '#cc9f42', g: 0.8, metal: true, strip: 0.5 },       // gold plating on pads, lands and connector pins
    brass:    { L: '#c29b47', D: '#b8933f', g: 0.6, metal: true, strip: 0.5 },       // brass fittings (no plate uses it since the expert ruled the valves steel)
    sac:      { L: '#c4c6c3', D: '#b3b5b2', g: 0.6, metal: true },                    // tin-silver-copper solder: a bright matte silver
    ni:       { L: '#babbbd', D: '#aaabad', g: 0.7, metal: true },                    // nickel plating (the prober's chuck) and the probe needles' alloys
    w:        { L: '#84878c', D: '#7b7e83', g: 0.5, metal: true, cut: '#c3c5c8' },    // tungsten: contacts, aperture plates, the emitter
    gate:     { L: '#5d5f63', D: '#6b6d71', g: 0.2, metal: true, cut: '#74767a', cutD: '#828488' }, // 08's gate: a deep neutral metal grey (the expert's ruling)
    tin:      { L: '#c09a4e', D: '#b8934a', g: 0.2, metal: true, noHatch: true, cut: '#c9a457' }, // titanium nitride in bulk: matte gold-bronze (no plate uses it since the gate went grey)
    steel:    { L: '#9da2a7', D: '#8e9398', g: 0.65, metal: true, studio: true, cut: '#c3c5c8' }, // stainless and machine steel: a cool neutral
    vacIn:    { L: '#8a8d91', D: '#64676b', g: 0.5, metal: true, cut: '#d4d6d8' },    // a housing's back wall, in its own shade
    vac:      { L: '#c0c3c6', D: '#7b7e82', g: 0.8, metal: true, studio: true, cut: '#d4d6d8' }, // electropolished stainless: brighter than machine steel (capped in dark)
    steelDk:  { L: '#6c7177', D: '#666b71', g: 0.5, metal: true, cut: '#c3c5c8' },    // darker steel: rails, frames, feet, fittings
    aluCh:    { L: '#bdbfbf', D: '#7c7e7e', g: 0.55, metal: true, cut: '#d4d6d6' },   // 06's chamber body: the darker aluminium
    yttria:   { L: '#ece6d7', D: '#8e897d', g: 0.3 },                                 // 06's inner walls the plasma touches: yttria off-white
    alu:      { L: '#c6c7c6', D: '#808281', g: 0.55, metal: true, cut: '#d4d6d6' },   // aluminium: a warm neutral (capped in dark)
    iron:     { L: '#85878a', D: '#7d7f82', g: 0.6, metal: true, cut: '#c3c5c8' },    // soft iron: the electron lenses' yokes and pole pieces
    panel:    { L: '#6b6f75', D: '#63676d', g: 0.3 },                                 // the gas panel's mounting plate: a mid grey under bright tubing
    paint:    { L: '#eeeae0', D: '#7c7d7f', g: 0.15 },                                // off-white painted steel: the gas cabinet, the scanner's base frame (capped in dark)
    paintIn:  { L: '#9a9c97', D: '#5f615d', g: 0.15 },                                // the same paint inside the cabinet, in its own shade
    black:    { L: '#3d4046', D: '#43464c', g: 0.6, metal: true, strip: 0.28 },       // black painted steel: the rack, tray fronts, the coolant unit (satin, so it shows its form)
    plastic:  { L: '#36383d', D: '#45474c', g: 0.2 },                                 // black plastic: connectors, power stages, inductors
    cable:    { L: '#2a2c30', D: '#3a3c41', g: 0.25 },                                // black-jacketed copper cable: the rack's NVLink cartridges
    granite:  { L: '#45484d', D: '#4b4e53', g: 0.35 },                                // black ceramic and stone: chucks, guide plates, the stage base
    mould:    { L: '#2b2c30', D: '#3a3b40', g: 0.3 },                                 // epoxy moulding compound: black
    // boards and packages
    pcb:      { L: '#2c7149', D: '#2b6c46', g: 0.45 },                                // green solder mask on a circuit board
    pcbDk:    { L: '#1e3b31', D: '#22413a', g: 0.45 },                                // the accelerator modules' boards: darker and cooler
    subMask:  { L: '#2f5242', D: '#2e4f40', g: 0.45 },                                // a package substrate's solder resist: dark green
    core:     { L: '#b08f5c', D: '#a3854f', g: 0.2 },                                 // a substrate core's edge: glass cloth in resin, amber tan
    coreSec:  { L: '#957a4f', D: '#8d7349', g: 0.2 },                                 // the core in section: darker, under its weave
    laminate: { L: '#7a7452', D: '#716b4b', g: 0.2 },                                 // a routed substrate edge
    abf:      { L: '#cbc68e', D: '#bdb883', g: 0.2 },                                 // build-up film: a pale olive band
    abf2:     { L: '#b8b278', D: '#aca66f', g: 0.2 },                                 // build-up film, the second tone, so the bands count
    pi:       { L: '#7c5634', D: '#77522f', g: 0.4 },                                 // polyimide redistribution layers: a dark amber film
    mlcc:     { L: '#b8946a', D: '#ac8a61', g: 0.3 },                                 // multilayer ceramic capacitors' bodies: tan
    trace:    { L: '#5a9a72', D: '#55916b', g: 0.3, lineK: 1.0 },                     // copper traces seen through green solder mask: a lighter green
    // glass, coatings and process materials
    glass:    { L: '#dbe7ee', D: '#5e676c', g: 0.9, clear: 0.5, edge: '#6f9db3' },    // quartz and low-expansion glass: pale, with a faint blue edge
    glassBody:{ L: '#d9d6cf', D: '#66645f', g: 0.2, edge: '#b8b4ab' },                // a mirror's substrate: opaque, matte, a pale warm grey (the expert's ruling)
    film:     { L: '#d6d9dd', D: '#8d9399', g: 0.4, clear: 0.24, edge: '#f2f4f6' },   // the pellicle: a clear thin film with a light edge
    mlm:      { L: '#4c4d5b', D: '#4a4b59', g: 0.95, strip: 0.62 },                   // molybdenum-silicon multilayer mirrors: a dark mirror with a faint violet cast
    mo:       { L: '#3c3b52', D: '#3a3950', g: 0.5 },                                 // molybdenum layers in the loupe's section
    absorber: { L: '#26272d', D: '#36373e', g: 0.4 },                                 // the mask's tantalum absorber and black border: near black
    ru:       { L: '#9ea1a6', D: '#91949a', g: 0.6, metal: true },                    // the ruthenium cap
    resist:   { L: '#d49b3c', D: '#c9923a', g: 0.4 },                                 // photoresist: amber
    ceramic:  { L: '#ece6d7', D: '#8e897d', g: 0.3 },                                 // alumina: insulators, the chuck's puck, the space transformer (capped in dark)
    sin:      { L: '#cfccc4', D: '#9b988f', g: 0.2 },                                 // silicon nitride spacers: a pale ceramic film
    plasma:   { L: '#8a70d8', D: '#9a84e6', g: 0, clear: 0.32, edge: '#6c55c4' },     // a fluorocarbon etch plasma's violet glow, see-through
    underfill:{ L: '#cfc9b6', D: '#8f8a7a', g: 0.2 },                                 // film or underfill between stacked dies
    // the world: land and sea apart by value
    ocean:    { L: '#8eb0c8', D: '#6f8ea6' },                                         // the globe's sea, as a physical globe prints it
    land:     { L: '#e2dcc8', D: '#aaa594' },                                         // the globe's dry land, sand, lighter than the sea
    // markings that are part of the real object
    cylGrey:  { L: '#8d8e8b', D: '#83847f', g: 0.3 },                                 // a gas cylinder's painted body: warm, low gloss
    capY:     { L: '#e0ab22', D: '#d8a420', g: 0.35 },                                // a cylinder shoulder in yellow: toxic or corrosive (EN 1089-3)
    capR:     { L: '#cc3f33', D: '#c43c31', g: 0.35 },                                // a cylinder shoulder in red: flammable (EN 1089-3; no plate uses it since round 3)
    n2:       { L: '#2f3134', D: '#3a3c40', g: 0.35 },                                // the nitrogen purge cylinder's shoulder: black (EN 1089-3)
    emo:      { L: '#c8102e', D: '#c0122d', g: 0.4 },                                 // the cabinet's emergency-off button: signal red
    screen:   { L: '#22252a', D: '#2c2f35', g: 0.5 },                                 // the cabinet controller's screen: near black
    ghsRed:   { L: '#c8102e', D: '#c0122d', g: 0.2 },                                 // a hazard diamond's red border (GHS)
    ghsGreen: { L: '#2e8b3e', D: '#2e8b3e', g: 0.2 },                                 // a non-flammable gas diamond's green
    label:    { L: '#f6f4ee', D: '#bdbbb4', g: 0.2 },                                 // a cylinder's white shoulder label
    gauge:    { L: '#f1efe8', D: '#b9b7b0', g: 0.5 },                                 // a pressure gauge's white dial
    // 01, One design, many dies (24 Nov 2026, the owner's pick of four plates): the lifted die as die photographs show such chips
    // (the expert's round 3 rulings), one soft static band (stopsC) on every face material, and the wafer's plain silicon. The
    // die grid's band colours (wfT*) are made by plates/die-floorplan.js when the kit loads
    dpFace:   { L: '#3d3b57', D: '#3d3b57', g: 0.85, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] }, // the die's face between blocks: graphite-violet
    dpLogic:  { L: '#5e5678', D: '#5e5678', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // logic, a fine mottle about this tone
    dpLogicHi:{ L: '#665e81', D: '#665e81', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // the mottle's light cells (8 percent lighter)
    dpLogicLo:{ L: '#564f6e', D: '#564f6e', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // the mottle's dark cells (8 percent darker)
    dpBronze: { L: '#7a6650', D: '#7a6650', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // bronze flecks in the logic, under 15 percent of it
    dpSram:   { L: '#3f6873', D: '#3f6873', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // SRAM: a fine even grid in teal
    dpSramB:  { L: '#3e5a86', D: '#3e5a86', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // SRAM sub-arrays shading toward blue
    dpSramLn: { L: '#2c4b55', D: '#2c4b55', g: 0.4, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]], lineK: 1.0 }, // the SRAM grid's lines
    dpPhy:    { L: '#8a8170', D: '#8a8170', g: 0.6, stopsC: [[0, 0.86], [0.3, 0.94], [0.44, 1.3], [0.53, 1.26], [0.66, 0.95], [1, 0.86]] },  // I/O and PHY: coarse grey-bronze
    dpCu:     { L: '#b07a52', D: '#b07a52', g: 0.6, metal: true, stopsC: [[0, 1], [1, 1]], lineK: 1.0 }, // copper-tone lines and the seal ring
    dpPad:    { L: '#c8733f', D: '#c8733f', g: 0.6, metal: true, stopsC: [[0, 1], [1, 1]] }, // the die-to-die link's copper pads
    dpEdge:   { L: '#2f323a', D: '#2f323a', g: 0.9, stopsC: [[0, 1], [1, 1]], edge: '#8d93a0' }, // the polished sawn edge, with a light edge line
    dpStreet: { L: '#34324a', D: '#34324a', g: 0.4, stopsC: [[0, 1], [1, 1]], lineK: 1.0 }, // the streets between the cache's sub-arrays
    wfSi:     { L: '#a7abb3', D: '#7f838b', g: 0.9, stopsC: [[0, 0.9], [0.35, 0.97], [0.5, 1.12], [0.65, 0.97], [1, 0.9]] }, // the wafer's edge ring and notch: plain polished silicon
    // a chart's emphasis
    wine:     { L: '#dcb9be', D: '#6e3b45', g: 0 }                                    // the cost column's largest share keeps the site's wine tint
  };
  // sRGB and linear light
  function s2l(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function l2s(v) { v = Math.max(0, Math.min(1, v)); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
  // a colour under k times the light: under 1 it is shaded, over 1 lifted, and what runs past white goes toward white
  function litC(c, k) {
    var r = s2l(c[0]) * k, g = s2l(c[1]) * k, b = s2l(c[2]) * k, mx = Math.max(r, g, b);
    if (mx > 1) { var w = Math.min(1, (mx - 1) * 0.6); r += (1 - r) * w; g += (1 - g) * w; b += (1 - b) * w; }
    return [l2s(r), l2s(g), l2s(b)];
  }
  function mixL(a, b, t) { return [l2s(s2l(a[0]) + (s2l(b[0]) - s2l(a[0])) * t), l2s(s2l(a[1]) + (s2l(b[1]) - s2l(a[1])) * t), l2s(s2l(a[2]) + (s2l(b[2]) - s2l(a[2])) * t)]; }
  function lumC(c) { return 0.2126 * s2l(c[0]) + 0.7152 * s2l(c[1]) + 0.0722 * s2l(c[2]); }
  function darkOf(c) { var d = litC(c, 0.9); if (lumC(d) < 0.03) d = mixL(d, [255, 255, 255], 0.06); return d; }
  // a colour at s of its saturation (the chart's smaller shares)
  function desat(c, s) { var y = lumC(c), gy = [l2s(y), l2s(y), l2s(y)]; return mixL(gy, c, s); }
  P.litC = litC; P.mixL = mixL; P.lumC = lumC;

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
    // (a spike's head stands len up the page from its foot)
    m.S.forEach(function (it) { if (it.kind !== 'spike') return; var o = off[it.part], x = it.foot[0] + o[0], y = it.foot[1] + o[1], z = it.foot[2] + o[2], sy = R[3] * x + R[4] * y + R[5] * z; add(x, y, z); maxy = Math.max(maxy, sy + it.len); });
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
    // (the globe's labels, which follow its pins round, stand in a row under it where the model asks, spec.trackRows)
    return w < 560 && this.lod === 'full' && !this.o.noLabels && m.callouts.length > 0 && (m.spec.trackRows || !m.callouts.some(function (c) { return c.track; })) && m.callouts.some(function (c) { return !(ls.numbersOnly && c.n); });
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
    /* a row of labels keeps inside the width (22 Nov 2026 plates refine: the transistor's lower row ran off a phone's right edge,
       "Inner spacers" cut off): while a row is wider than the plate, its widest label with a space in it is set on two lines,
       and the row's height follows (drawRows closes the gaps if it is still too wide) */
    if (rows) ['t', 'b'].forEach(function (rw) {
      var list = m.callouts.filter(function (c) { return c._side === rw; }); if (!list.length) return;
      var meas = function (s) { return g ? g.measure(s, { size: ls.fs, weight: 500 }) : s.length * ls.fs * 0.53; }, r0 = ls.num * 1.1;
      var bwOf = function (c) { var tw = 0; (c._lines || []).forEach(function (s) { tw = Math.max(tw, meas(s)); }); return (ls.numbersOnly && c.n ? 0 : tw) + (c.n ? 2 * r0 + (ls.numbersOnly ? 0 : 6) : 0); };
      var total = function () { return list.reduce(function (a, c) { return a + bwOf(c); }, 0) + 12 * (list.length - 1); };
      for (var gd = 0; gd < list.length && total() > w - 8; gd++) {
        var cand = list.filter(function (c) { return c._lines && c._lines.length === 1 && c._lines[0].indexOf(' ') > 0; }).sort(function (a, b) { return bwOf(b) - bwOf(a); })[0];
        if (!cand) break;
        var words = cand._lines[0].split(' '), best = null;
        for (var i = 1; i < words.length; i++) { var a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), m2 = Math.max(meas(a), meas(b)); if (!best || m2 < best[0]) best = [m2, a, b]; }
        cand._lines = [best[1], best[2]];
      }
      list.forEach(function (c) { var hh = Math.max(1, c._lines.length) * ls.fs * 1.18 + 18; if (hh > room[rw]) room[rw] = hh; });
    });
    // a model may set a column's labels in toward the drawing, into its empty corner (spec.tuck, px: callouts, layCols), so the
    // column keeps that much less of the width
    if (m.spec.tuck && !rows) ['l', 'r'].forEach(function (sd) { if (m.spec.tuck[sd]) room[sd] = Math.max(0, room[sd] - m.spec.tuck[sd]); });
    // the loupe takes the top of its label column, which is then at least as wide as the disc; on a narrow plate it sits under
    // the drawing
    var LG = this.loupeOn() && !(m.loupe.tuck && w >= 560) ? this.loupeGeom(w, 0, g) : null;
    // under 560 px the disc stands under the row of labels, so the foot takes both; a disc tucked into the drawing's empty corner
    // (L.tuck) takes no column (fit gives it room only where it would leave the canvas)
    if (LG && LG.side === 'b') room.b = (room.b || 0) + LG.need;
    else if (LG && LG.side !== 'tuck') room[LG.side] = Math.max(room[LG.side], 2 * LG.r + LG.mg + 14 - LG.inset);
    return room;
  };
  // the canvas's top and foot pads: the drawing's ink stands this far inside them, so the page sets the space round the plate
  // (src/modules/chapter.css .ch-spec: 40 px over the drawing, 24 px under it)
  var PAD_Y = 8;
  PL.fit = function (w, h, g) {
    var e = this.ext || (this.ext = this.extent(this.lod === 'thumb')), rooms = this.rooms(w, g);
    var padX = this.lod === 'thumb' ? w * 0.04 : Math.max(10, w * (this.o.pad == null ? 0.025 : this.o.pad)), padY = this.lod === 'thumb' ? h * 0.04 : this.o.pad != null ? Math.max(10, h * 0.03) : PAD_Y;
    var ew = e.maxx - e.minx, eh = e.maxy - e.miny, out = null;
    // (a loupe tucked into the drawing's corner: where its disc and caption would leave the canvas, the plate gives them that much
    // room at the side or the top, and is fitted again)
    for (var it = 0; it < 4; it++) {
      var aw = w - rooms.l - rooms.r - 2 * padX, ah = h - 2 * padY - (rooms.t || 0) - (rooms.b || 0);
      var sc = Math.min(aw / ew, ah / eh);
      if (this.o.maxScale) sc = Math.min(sc, this.o.maxScale);
      // the drawing and its label columns are centred together
      var used = rooms.l + rooms.r + sc * ew, x0 = (w - used) / 2 + rooms.l;
      out = { s: sc, cx: x0 - sc * e.minx, cy: padY + (rooms.t || 0) + (ah - sc * eh) / 2 + sc * e.maxy, e: e, rooms: rooms };
      var TG = this.tuckGeom(w, out, g);
      if (!TG) break;
      var oR = TG.x1 + 4 - w, oT = 4 - TG.y0;
      if (oR <= 0.5 && oT <= 0.5) break;
      rooms = { l: rooms.l, r: rooms.r + Math.max(0, oR), t: (rooms.t || 0) + Math.max(0, oT), b: rooms.b || 0 };
    }
    return out;
  };
  /* a tucked loupe's disc for a fit: its centre where the drawn view puts L.tuck, moved by L.tdx and L.tdy px. L.tuck is a point
     of the model (in the part L.part, at the parts' rest), or 'tr' or 'tl', the top corner of the drawing's box on that side (so
     the disc keeps the same place in the drawing's empty corner at every width). Returns the box its disc and caption take; the
     caption stands under the disc, over it ('t'), or beside it ('l' or 'r', its middle L.capDy px from the disc's) */
  PL.tuckGeom = function (w, fit, g) {
    var L = this.m.loupe;
    if (!L || !L.tuck || w < 560 || !this.loupeOn()) return null;
    var m = this.m, x, y, r = Math.round(Math.max(48, Math.min(L.rMax || 104, (L.r || 0.155) * w))), mg = 10;
    if (typeof L.tuck === 'string') { var e = fit.e; x = fit.cx + fit.s * (L.tuck === 'tl' ? e.minx : e.maxx); y = fit.cy - fit.s * e.maxy; }
    else {
      var R = viewM(m.yaw0, m.elev), off = this.offsets(1).o, pi = 0;
      m.parts.forEach(function (p) { if (p.name === L.part) pi = p.idx; });
      var o = off[pi] || [0, 0, 0], q = [L.tuck[0] + o[0], L.tuck[1] + o[1], L.tuck[2] + o[2]];
      x = fit.cx + fit.s * (R[0] * q[0] + R[1] * q[1] + R[2] * q[2]); y = fit.cy - fit.s * (R[3] * q[0] + R[4] * q[1] + R[5] * q[2]);
    }
    x += L.tdx || 0; y += L.tdy || 0;
    var cap = L.caption || [], cw = 0, capSide = L.capSide || 'b', cdy = L.capDy || 0, n = cap.length;
    cap.forEach(function (ln) { cw = Math.max(cw, g ? g.measure(ln, { size: 12, weight: 500 }) : ln.length * 12 * 0.53); });
    var half = Math.sqrt(Math.max(0, r * r - cdy * cdy));
    var x1 = Math.max(x + r + 2, capSide === 'r' ? x + half + 12 + cw : capSide === 'b' || capSide === 't' ? x + cw / 2 + 2 : 0);
    var y0 = Math.min(y - r - 2 - (capSide === 't' ? 12 + n * 16 : 0), capSide === 'l' || capSide === 'r' ? y + cdy - n * 8 - 6 : Infinity);
    return { side: 'tuck', r: r, mg: mg, x: x, y: y, cap: cap, capSide: capSide === 'b' ? null : capSide, capDy: cdy, bottom: 0, inset: 0, x1: x1, y0: y0 };
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
    if (L.tuck && w >= 560) { var TF = this._lfit || this.fit(w, h || 400, g), TG = this.tuckGeom(w, TF, g); if (TG) return TG; }
    var cap = L.caption || [], capH = cap.length ? 15 + cap.length * 16 : 0;
    if (w < 560) {
      // (in the foot's corner on the loupe's own side, so its cone keeps to that side of the drawing; the caption beside it)
      // (a loupe may cap its disc on a phone, L.rPhone px, so it stays smaller than the object it magnifies: the etch chamber's)
      var hh = h || 0, rp = Math.round(Math.min(L.rPhone || Infinity, Math.max(64, Math.min(L.rMax || 104, 0.23 * w)))), lf = side === 'l', xp = lf ? mg + rp + 4 : w - mg - rp - 4, room = (lf ? w - xp : xp) - rp - 14 - mg;
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
    // a tucked loupe whose disc stands over the drawing's top: the canvas grows by that much
    if (this.loupeOn() && this.m.loupe.tuck && w >= 560) {
      // (measured at the scale the width allows, the drawing's top PAD_Y under the canvas's top)
      var x0f = (w - rooms.l - rooms.r - sc * (e.maxx - e.minx)) / 2 + rooms.l, F0 = { s: sc, cx: x0f - sc * e.minx, cy: PAD_Y + (rooms.t || 0) + sc * e.maxy, e: e };
      var T0 = this.tuckGeom(w, F0);
      if (T0 && T0.y0 < 4) h += 4 - T0.y0;
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
    m.S.forEach(function (it) { if (it.kind !== 'spike') return; var o = O[it.part], x = it.foot[0] + o[0], y = it.foot[1] + o[1], z = it.foot[2] + o[2], sy = R[3] * x + R[4] * y + R[5] * z; add(x, y, z); maxy = Math.max(maxy, sy + it.len); });
    return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
  };

  /* draw one frame. st = { k: entrance 0..1, w, h (css px), g: back-end, pal, lod, dyaw and delev: the reader's turn off the
     drawn view (radians), labA: how much of the labels, leaders and dimensions shows (they fade while the plate turns),
     pick: record the faces drawn, for the pointer (PL.hitAt) } */
  PL.paint = function (st) {
    var m = this.m, g = st.g, pal = st.pal, w = st.w, h = st.h, lod = st.lod || this.lod, thumb = lod === 'thumb';
    var dyaw = st.dyaw || 0, delev = st.delev || 0, turned = !!(dyaw || delev);
    var fit = st.fit || this.fit(w, h, g), sc = fit.s * (st.scale || 1), R = viewM(m.yaw0 + dyaw, m.elev + delev), K = st.k == null ? 1 : st.k;
    this._lfit = fit;
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
    // a spike's head on the page: up the page from its foot, its sx to the side (M.spike)
    var spikeXY = function (it, P) { var f = P(it.foot, it.part); return [f[0] + it.sx * (thumb ? 0.6 : k), f[1] - it.len * sc]; };
    var depthOf = function (c, part) { var o = O[part]; return R[6] * (c[0] + o[0]) + R[7] * (c[1] + o[1]) + R[8] * (c[2] + o[2]); };
    var rotN = function (n) { return [R[0] * n[0] + R[1] * n[1] + R[2] * n[2], R[3] * n[0] + R[4] * n[1] + R[5] * n[2], R[6] * n[0] + R[7] * n[1] + R[8] * n[2]]; };

    // the hierarchy of line weights, css px. One pen for the set: it follows the slot's width alone (22 Nov 2026; it followed the
    // height too, so plates in one 666 px slot drew 31 percent apart)
    var lite = !!st.lite, jointW = thumb ? null : m.spec.joints || null;
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
    // (22 Nov 2026 plates refine: on paper a solid in a colour takes ink for its outlines, shade lines, creases and shading
    // lines, as a draughtsman inks every edge with one pen; its tinted line, the colour mixed toward ink, read as a pale grey
    // and lost the part's form. The tint stays for what is drawn in the colour itself: decals, wiring and light paths)
    var strokeOf = function (c, role) {
      if (!pal.dark) return inkC;
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
    var toneF = function (lam, curve, acc) {
      // the dark ramp is about twice the old one: a top face about 16 percent of the way to ink, the lit side 11, the shade side 5
      if (pal.dark) { if (curve) return 1.0 + 0.9 * Math.round(lam * 5) / 5; return lam > 0.72 ? 1.8 : lam > 0.15 ? 1.25 : 0.55; }
      // on paper a material in a colour keeps it on its top face (22 Nov 2026 plates refine: at 0.36 a slate top read as white,
      // so silicon seen from above lost its colour); a neutral one keeps the old ramp, its top nearly the paper
      if (acc) { if (curve) return 0.7 + 0.45 * Math.round((1 - lam) * 5) / 5; return lam > 0.72 ? 0.7 : lam > 0.15 ? 0.9 : 1.15; }
      if (curve) return 0.38 + 0.95 * Math.round((1 - lam) * 5) / 5;
      return lam > 0.72 ? 0.36 : lam > 0.15 ? 0.74 : 1.3;
    };
    // (a material may keep one tone whatever way its faces turn, mat.even: the inside of a hole, which no light reaches)
    var fillOf = function (mat, nvw, curve, tint) {
      var d = Math.min(pal.dark ? 0.66 : 0.92, mat.d * (mat.even ? 1 : toneF(curve ? lamC(nvw) : lamOf(nvw), curve, isAcc(mat.c))) * (pal.dark ? 0.8 : 1) * (thumb ? Math.min(1.6, ik) : 1));
      var c = mix(pal.bg, colOf(mat.c), d);
      if (tint) c = mix(c, pal.hl, pal.dark ? 0.22 : 0.12);
      return css(c);
    };
    /* ---- the colour (specimen colour, 24 Nov 2026: the owner chose treatment C, Rendered, from three). Every part in its real
       material (REAL), lit as an object: tone and reflections on every face, no ink on the object (its silhouette in its own deep
       shade), soft shadows where parts rest on each other and one ground. Leaders, balloons, dimensions and labels are the only
       ink. A chart (plate 15) takes the illustrated tone (TB: a flat face graded along the light, no reflections) with the same
       lines and no shadows, since dressing a number in light can mislead. */
    var plateSelf = this, CHART = !!m.spec.chart, TB = CHART;
    var WHITE = [255, 255, 255], CREAM = [246, 242, 232], COOLS = [223, 230, 238], WARMB = [207, 198, 184], COOL = pal.dark ? [28, 38, 64] : [56, 74, 112], WARM = [255, 244, 224];
    // while the plate turns or makes its entrance, the cheaper path: no gradients along turned strips, a coarser shadow
    var cheap = turned || K < 0.999, NOPOL = !!m.spec.noPolish;
    var gOf = function (Rm) { return NOPOL ? Math.min(0.2, Rm.g || 0) : (Rm.g || 0); };
    var tBase = function (Rm) {
      if (!Rm) return pal.ink;
      var key = pal.dark ? '_d' : '_l', c = Rm[key] || (Rm[key] = pal.dark ? (Rm.D ? hex(Rm.D) : darkOf(hex(Rm.L))) : hex(Rm.L));
      return m.spec.chartSat && Rm !== REAL.wine ? desat(c, m.spec.chartSat) : c;
    };
    // a part pointed at keeps its own material, a little lighter (mixing toward wine turned colour to mud)
    var FADE = 0.4, curFade = 0;
    var lift = function (c, on) { return on ? litC(c, 1.18) : curFade ? mix(c, pal.bg, curFade) : c; };
    // (a part not pointed at is drawn opaque, mixed toward the ground, so nothing shows through: round 3)
    var fzC = function (cs) { return curFade && typeof cs === 'string' ? css(mix(hex(cs), pal.bg, curFade)) : cs; };
    var GL = function (segs, col, lw, dash, al, cap) { g.lines(segs, fzC(col), lw, dash, al, cap); };
    /* a turning frame (st.fast: the reader turns the plate and its labels are out): a face's colour maths is kept in a memo, keyed
       by its material and its turn to the light (quantized to about a degree), so the frame costs less. A plate at rest never
       reads the memo, so it draws exactly as before */
    var MEMO = null;
    if (st.fast) { var mk0 = pal.dark ? 'd' : 'l'; if (plateSelf._memoKey !== mk0 || !plateSelf._memo || plateSelf._memo.size > 30000) { plateSelf._memo = new Map(); plateSelf._memoKey = mk0; } MEMO = plateSelf._memo; }
    var rid = function (Rm) { return Rm._rid || (Rm._rid = (P._rid = (P._rid || 0) + 1)); };
    var qn = function (v) { return Math.round(v[0] * 40) + ',' + Math.round(v[1] * 40) + ',' + Math.round(v[2] * 40); };
    var memo = function (key, fn) { if (!MEMO) return fn(); var v = MEMO.get(key); if (v === undefined) { v = fn(); MEMO.set(key, v); } return v; };
    // a colour's lit tone as css, kept on the colour itself in a turning frame
    var cssL = function (c, k) { if (!MEMO) return css(litC(c, k)); var gm = c._g || (c._g = {}), key = 'L' + k; return gm[key] || (gm[key] = css(litC(c, k))); };
    var smooth = function (e0, e1, x) { var t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    var HK = (function () { var h = [Lt[0], Lt[1], Lt[2] + 1], n = Math.hypot(h[0], h[1], h[2]); return [h[0] / n, h[1] / n, h[2] / n]; })();
    // the page's direction from a lit edge to its far edge (the key light comes from the upper left)
    var LD = (function () { var x = -Lt[0], y = Lt[1], n = Math.hypot(x, y); return [x / n, y / n]; })();
    var axisOf = function (bb) { var cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, hf = (Math.abs(LD[0]) * (bb[2] - bb[0]) + Math.abs(LD[1]) * (bb[3] - bb[1])) / 2 || 1; return [cx - LD[0] * hf, cy - LD[1] * hf, cx + LD[0] * hf, cy + LD[1] * hf]; };
    /* reflections per plane (round 2, S2): every flat face of the model lying in one plane shares one gradient axis, taken from
       that plane's extent on the page, so one band runs across a wafer's wedges or a die's blocks together */
    var GR = null;
    var planeKey = function (n, d) { return Math.round(n[0] * 50) + ',' + Math.round(n[1] * 50) + ',' + Math.round(n[2] * 50) + '|' + Math.round(d / ((m.size || 1) * 1e-3)); };
    var groups = function () {
      if (GR) return GR; GR = {};
      m.S.forEach(function (s) {
        if (s.kind !== 'solid' || s.mat.ghost || s.mat.phantom) return;
        var o = O[s.part];
        for (var fi = s.f0; fi < s.f1; fi++) {
          var f = F[fi]; if (f.curve || !front[fi]) continue;
          var v0 = f.v[0], d = f.n[0] * (V[v0 * 3] + o[0]) + f.n[1] * (V[v0 * 3 + 1] + o[1]) + f.n[2] * (V[v0 * 3 + 2] + o[2]);
          var key = planeKey(f.n, d), b = GR[key] || (GR[key] = [Infinity, Infinity, -Infinity, -Infinity]);
          for (var q = 0; q < f.v.length; q++) { var x = X[f.v[q] * 3], y = X[f.v[q] * 3 + 1]; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; }
          f._gk = key;
        }
      });
      return GR;
    };
    // polished flat faces by class (the rendered stops; the chart's illustrated ones), and the tone on every other flat face along the light
    var MIR_C = [[0, 0.6], [0.3, 0.68], [0.4, 's'], [0.54, 's2'], [0.64, 0.78], [1, 0.56]], MIR_CW = [[0, 0.66], [0.3, 0.72], [0.4, 's'], [0.54, 's2'], [0.64, 0.86], [1, 0.74]];
    var SAT_C = [[0, 0.84], [0.3, 1.35], [0.48, 1.02], [1, 0.78]];
    var MIR_B = [[0, 0.85], [0.38, 'b'], [0.6, 1.0], [1, 0.78]], SAT_B = [[0, 0.95], [0.38, 1.18], [0.6, 1.0], [1, 0.82]], TONE = [[0, 1.22], [1, 0.74]], TONE_C = [[0, 1.06], [1, 0.84]];
    var CAPL = 0.79; // (a reflection's brightest stop, about #e4e7eb)
    /* turned parts (S3): smooth tone, each strip a gradient from its left meridian edge to its right, each edge lit by its own
       normal; a polished metal reflects a studio (anchors from the part's own colour: a rim light, a dark core, a bright strip),
       a painted one stays near its colour */
    var ENVP = [[-1, 'k', 1.1], [-0.7, 'k', 0.75], [-0.25, 'k', 0.32], [0.15, 'k', 1.0], [0.45, 's', 1], [0.6, 's', 0.55], [0.85, 'k', 1.1], [1, 'k', 0.9]];
    var PAINTED = [[-1, 0.75], [-0.3, 0.8], [0.4, 1.25], [1, 0.9]];
    var envCol = function (b, t, strip) {
      t = Math.max(-1, Math.min(1, t)); var i = 1; while (i < ENVP.length - 1 && t > ENVP[i][0]) i++;
      var a = ENVP[i - 1], c = ENVP[i], u = (t - a[0]) / (c[0] - a[0]);
      var ca = a[1] === 's' ? mixL(b, WHITE, strip * a[2]) : litC(b, a[2]), cc = c[1] === 's' ? mixL(b, WHITE, strip * c[2]) : litC(b, c[2]);
      return mixL(ca, cc, u);
    };
    var paintK = function (t) { t = Math.max(-1, Math.min(1, t)); var i = 1; while (i < PAINTED.length - 1 && t > PAINTED[i][0]) i++; var a = PAINTED[i - 1], c = PAINTED[i]; return a[1] + (c[1] - a[1]) * (t - a[0]) / (c[0] - a[0]); };
    var across = function (axV) {
      var ax = axV[0], ay = axV[1], L = Math.hypot(ax, ay);
      if (L < 0.25) return null;
      var u = [-ay / L, ax / L]; if (u[0] * Lt[0] + u[1] * Lt[1] < 0) u = [-u[0], -u[1]];
      return u;
    };
    var stripModel = function (Rm, b, n, axV, gl) {
      var lam = lamC(n), k0 = (0.34 + 0.8 * lam + (lam < 0.1 ? 0.05 : 0)) * (TB ? 1 : 0.9), col = litC(b, k0), u = axV ? across(axV) : null;
      if (u) {
        var t = n[0] * u[0] + n[1] * u[1];
        if (gl >= 0.5) col = mixL(col, envCol(b, t, Rm.strip == null ? 0.62 : Rm.strip), (gl >= 0.7 ? gl * 0.9 : 0.55) * (TB ? 0.5 : 1));
        else if (!TB) col = mixL(col, litC(b, paintK(t)), 0.5);
        if (Rm.studio) col = mixL(col, t > 0 ? COOLS : WARMB, 0.1);
      }
      if (k0 < 0.8) col = mixL(col, COOL, 0.06 * (0.8 - k0) / 0.45);
      return col;
    };
    var capModel = function (Rm, b, n, gl) {
      var lam = lamOf(n), k0 = (0.34 + 0.8 * lam) * (TB ? 1 : 0.9), col = litC(b, k0);
      if (gl >= 0.5) { var nh = Math.max(0, n[0] * HK[0] + n[1] * HK[1] + n[2] * HK[2]), sp = Math.min(0.8, Math.pow(nh, 10) * gl * (TB ? 0.5 : 1)); col = mixL(col, Rm.metal ? mixL(b, WHITE, Rm.strip || 0.6) : WHITE, sp); }
      if (Rm.studio) col = mixL(col, COOLS, 0.1);
      if (k0 < 0.8) col = mixL(col, COOL, 0.06 * (0.8 - k0) / 0.45);
      return col;
    };
    // (round 3: the strip and the cap models blended by the face's turn to the axis, so a crown or a dome has no seam)
    var shadeCurve = function (Rm, b, n, capForce, axV) {
      var gl = gOf(Rm), wc = capForce ? 1 : axV ? smooth(0.25, 0.65, Math.abs(n[0] * axV[0] + n[1] * axV[1] + n[2] * axV[2])) : 0;
      if (wc <= 0) return stripModel(Rm, b, n, axV, gl);
      if (wc >= 1) return capModel(Rm, b, n, gl);
      return mixL(stripModel(Rm, b, n, axV, gl), capModel(Rm, b, n, gl), wc);
    };
    var add3 = function (a, b) { var x = a[0] + b[0], y = a[1] + b[1], z = a[2] + b[2], n = Math.hypot(x, y, z) || 1; return [x / n, y / n, z / n]; };
    var stripInfo = function (f, pts) {
      if (cheap || !f.e || f.mj < 0 || pts.length !== 4) return null;
      var a = f.e[3][0], b = f.e[1][0];
      if (a < 0 || b < 0 || !F[a].curve || !F[b].curve) return null;
      return { nL: rotN(add3(f.n, F[a].n)), nR: rotN(add3(f.n, F[b].n)), pL: [(pts[3][0] + pts[0][0]) / 2, (pts[3][1] + pts[0][1]) / 2], pR: [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2] };
    };
    // a flat face's tone by its turn to the key light
    var flatTone = function (Rm, b, lam, top) {
      var k0 = TB ? (top ? 1.04 : 0.42 + 0.72 * lam) : top ? 0.9 : (0.36 + 0.72 * lam) * 0.95;
      var col = litC(b, k0);
      if (k0 < 0.8) col = mixL(col, COOL, 0.07 * (0.8 - k0) / 0.45); else if (top) col = mixL(col, WARM, 0.025);
      if (Rm.studio) col = mixL(col, top ? COOLS : WARMB, 0.1);
      return col;
    };
    // a cut face (S6): paler and warmer than any outside face
    var cutCol = function (Rm, b) {
      if (pal.dark && Rm.cutD) return hex(Rm.cutD);
      var c = Rm.cut ? hex(Rm.cut) : mixL(litC(pal.dark ? hex(Rm.L) : b, 1.3), CREAM, 0.25);
      return pal.dark ? litC(c, 0.62) : c;
    };
    var bbOf = function (pts) { var b = [Infinity, Infinity, -Infinity, -Infinity]; pts.forEach(function (p) { if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1]; if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1]; }); return b; };
    // a patterned wafer's static diffraction sheen: one broad run of two neighbouring hues, violet into teal, fixed to the part
    var hueAt = function (t) { return mixL([138, 124, 196], [104, 168, 176], Math.max(0, Math.min(1, t))); };
    var grad = function (ax, stops, col, on, Rm, sheen) {
      var gk2 = MEMO ? (stops._k || (stops._k = stops.join(';'))) + ':' + (on ? 1 : 0) + ':' + curFade + ':' + (sheen || 0) + ':' + ((Rm && Rm.mstrip) || 0) : null, got = gk2 && col._g ? col._g[gk2] : null;
      if (got) return { x0: ax[0], y0: ax[1], x1: ax[2], y1: ax[3], stops: got };
      var ms = Rm && Rm.mstrip, capL = CAPL, out = stops.map(function (q) {
        var v = q[1], c = v === 's' ? (ms ? mixL(col, WHITE, ms) : litC(col, 1.85)) : v === 's2' ? (ms ? mixL(col, WHITE, ms * 0.8) : litC(col, 1.7)) : v === 'b' ? (ms ? mixL(col, WHITE, ms * 0.55) : litC(col, 1.3)) : litC(col, v);
        if (lumC(c) > capL) c = mixL(c, [228, 231, 235], 0.7);
        return [q[0], c];
      });
      // (inside the die grid only, 10 to 20 percent, never over 25: the expert's ruling)
      if (sheen) out = out.map(function (q) { return [q[0], mixL(q[1], hueAt(q[0]), Math.min(0.25, sheen))]; });
      var lst = out.map(function (q) { return [q[0], lift(q[1], on)]; }), cs0 = lst.map(function (q) { return [q[0], css(q[1])]; });
      cs0.rgb = lst;
      if (gk2) (col._g || (col._g = {}))[gk2] = cs0;
      return { x0: ax[0], y0: ax[1], x1: ax[2], y1: ax[3], stops: cs0 };
    };
    // (in a turning frame a small face takes one colour, its gradient's own at the face's middle, so no gradient is set up for it)
    var flatAt = function (gr, pts) {
      var cx = 0, cy = 0; pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
      var dx = gr.x1 - gr.x0, dy = gr.y1 - gr.y0, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((cx - gr.x0) * dx + (cy - gr.y0) * dy) / L2)), st0 = gr.stops.rgb;
      if (!st0) return gr.stops[gr.stops.length >> 1][1];
      var i = 1; while (i < st0.length - 1 && t > st0[i][0]) i++;
      var a = st0[i - 1], c = st0[i], u = c[0] > a[0] ? Math.max(0, Math.min(1, (t - a[0]) / (c[0] - a[0]))) : 0;
      return css(mix(a[1], c[1], u));
    };
    var small = function (pts) { var b = bbOf(pts); return (b[2] - b[0]) + (b[3] - b[1]) < 36; };
    /* a face of material Rm: { f: its fill (a colour, a linear gradient or a radial one), rgb: its colour }. opt: gk (the plane
       a decal lies in), mul (a decal's tone against its face) */
    var tFace = function (Rm, nvw, f, fi, pts, cut, on, axV, s, opt) {
      opt = opt || {};
      var b = tBase(Rm), mul = opt.mul || 1;
      if (cut) { var cc = litC(cutCol(Rm, b), mul); return { f: css(lift(cc, on)), rgb: cc }; }
      var gl = gOf(Rm);
      if (f && f.curve) {
        var isCap = !!f.cap || !!(s && s.axisN && Math.abs(f.n[0] * s.axisN[0] + f.n[1] * s.axisN[1] + f.n[2] * s.axisN[2]) > 0.35);
        var inr = (f.inner ? (TB ? 0.8 : 0.72) : 1) * mul, cm = memo(MEMO && 'c' + rid(Rm) + ':' + qn(nvw) + ':' + (f.cap ? 1 : 0) + ':' + inr + ':' + (axV ? qn(axV) : '-'), function () { return litC(shadeCurve(Rm, b, nvw, !!f.cap, axV), inr); });
        var si = stripInfo(f, pts);
        if (!si) return { f: css(lift(cm, on)), rgb: cm };
        var cL = litC(shadeCurve(Rm, b, si.nL, !!f.cap, axV), inr), cR = litC(shadeCurve(Rm, b, si.nR, !!f.cap, axV), inr);
        return { f: { x0: si.pL[0], y0: si.pL[1], x1: si.pR[0], y1: si.pR[1], stops: [[0, css(lift(cL, on))], [1, css(lift(cR, on))]] }, rgb: cm };
      }
      var lam = lamOf(nvw), top = lam > 0.72, col = memo(MEMO && 'f' + rid(Rm) + ':' + Math.round(lam * 400) + ':' + (top ? 1 : 0) + ':' + mul, function () { return litC(flatTone(Rm, b, lam, top), mul); });
      if (!pts) return { f: css(lift(col, on)), rgb: col };
      var bb;
      // a face seen from inside a cavity darkens toward its corners (S5)
      if (s && s.inner) {
        bb = bbOf(pts); var cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, r = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2 || 1;
        return { f: { x0: cx, y0: cy, r: r, stops: [[0, css(lift(col, on))], [0.5, css(lift(col, on))], [1, css(lift(litC(col, TB ? 0.74 : 0.68), on))]] }, rgb: col };
      }
      // a matte side face takes bounce light at its foot, and a dark band only where its foot is a joint
      if (!TB && !top && gl < 0.5) {
        bb = bbOf(pts); var foot = false;
        if (s && s.joint && f) for (var q = 0; q < f.v.length; q++) { var va = f.v[q], vb = f.v[(q + 1) % f.v.length]; if (s.joint[va < vb ? va + '_' + vb : vb + '_' + va] && (pts[q][1] + pts[(q + 1) % pts.length][1]) / 2 >= bb[3] - 1.5) { foot = true; break; } }
        var mx = (bb[0] + bb[2]) / 2;
        var gf = grad([mx, bb[1], mx, bb[3]], foot ? [[0, 1], [0.86, 1.02], [1, 0.74]] : [[0, 1], [1, 1.06]], col, on, null);
        return { f: MEMO && small(pts) ? flatAt(gf, pts) : gf, rgb: col };
      }
      var gk = opt.gk || (f && (groups(), f._gk)), gb = gk && GR[gk] ? GR[gk] : bbOf(pts);
      var wide = gb[2] - gb[0] > 0.4 * w;
      var stops = !TB && Rm.stopsC ? Rm.stopsC : gl >= 0.85 ? (TB ? MIR_B : wide ? MIR_CW : MIR_C) : gl >= 0.5 ? (TB ? SAT_B : SAT_C) : TB ? TONE : TONE_C;
      var gp = grad(axisOf(gb), stops, col, on, Rm, opt.sheen);
      return { f: MEMO && small(pts) ? flatAt(gp, pts) : gp, rgb: col };
    };
    // a cut face's ruling: in the face's own shade at 0.4 (a weave: lighter, in its own colour)
    var tHatch = function (pts, rgb, fm, f, alpha, weave) {
      var gap = (fm.gap || (fm.hatch === 2 ? 2.4 : 3.4)) * k, ang = f && f.hv != null ? f.hv : fm.ang;
      if (weave) g.hatch(pts, fzC(pal.dark ? css(litC(rgb, 1.5)) : '#c9a870'), gap * 1.3, Math.max(1, LW.hatch * 1.6), fm.hatch, 0.6 * alpha, ang);
      else g.hatch(pts, fzC(css(litC(rgb, 0.6))), gap, LW.hatch * 0.8, fm.hatch, 0.4 * alpha, ang);
    };
    // an object's outline: its own deep shade (on the dark ground a darker tone of the part)
    var outC = function (b) {
      var Lb = lumC(b);
      return cssL(b, pal.dark ? (Lb < 0.03 ? 0.62 : 0.45) : Lb < 0.03 ? 0.5 : Lb > 0.45 ? 0.24 : 0.28);
    };
    // a line inside a face: darker than the face, and lighter on a dark face
    var inC = function (rgb) {
      var Ld = lumC(rgb);
      return css(Ld < 0.09 ? litC(rgb, 2.6) : litC(rgb, 0.55));
    };
    var tEdges = function (TF, Rf, s, f, shl, fine, crease, out, shade, on, alpha, szK, thinTint, nvw) {
      var rgb = TF.rgb, b = tBase(Rf), edge = Rf.edge && !pal.dark ? hex(Rf.edge) : null, hiW = 1.5 * Math.max(0.8, k);
      // no ink on the object: its silhouette in its own deep shade at one weight, the light edge alone where a polished top
      // meets a side, every other crease soft in the face's own colour (in a turning frame the soft creases and fine lines wait
      // for the plate to rest)
      var sil = out.concat(shade);
      if (s.soft && !on) { crease = crease.concat(sil); sil = []; }
      var polished = gOf(Rf) >= 0.6 && !s.soft && !s.inner && !(Rf.clear < 1);
      if (crease.length) {
        var hi = [], lo = [], meTop = !f.curve && lamOf(nvw) > 0.72;
        crease.forEach(function (sg) { var nb = sg.nb; if (!polished || nb == null) { lo.push(sg); return; } var o = F[nb], nbTop = !o.curve && lamOf(rotN(o.n)) > 0.72; (meTop !== nbTop ? hi : lo).push(sg); });
        if (lo.length && !MEMO) GL(lo, s.soft && m.spec.softLine && !pal.dark ? m.spec.softLine : cssL(rgb, pal.dark ? 0.7 : 0.55), s.soft ? 0.5 : LW.crease * 0.8, null, (s.soft ? 0.6 : 0.55) * alpha);
        if (hi.length) GL(hi, cssL(b, pal.dark ? 1.9 : 1.55), LW.crease * 1.2, null, 0.85 * alpha);
      }
      if (fine.length && !MEMO) GL(fine, cssL(rgb, 0.55), LW.fine, null, 0.4 * alpha);
      if (sil.length) GL(sil, on ? hlC : edge ? css(edge) : outC(b), on ? hiW : LW.out * 0.9, null, 0.95 * alpha);
      if (pal.dark && shade.length && !on && !s.soft) GL(shade, cssL(b, 1.9), 1, null, 0.45 * alpha);
    };
    // a clear part's far faces, seen through its near ones
    var tBack = function (s, a, on) {
      var Rm = REAL[s.real], list = [];
      for (var fi = s.f0; fi < s.f1; fi++) if (!front[fi] && !F[fi].two) list.push(fi);
      if (!list.length) return;
      var z = {}; list.forEach(function (fi) { var vv = F[fi].v, t = 0; for (var q = 0; q < vv.length; q++) t += X[vv[q] * 3 + 2]; z[fi] = t / vv.length; });
      list.sort(function (x, y) { return z[x] - z[y]; });
      var b = tBase(Rm);
      list.forEach(function (fi) { g.poly(F[fi].v.map(P2), css(lift(litC(b, 0.82), on)), Rm.clear * 0.45 * a); });
      var segs = edgesOf(s, function (fa, fb) { return !fa && !fb; });
      if (segs.length) GL(segs, css(Rm.edge && !pal.dark ? hex(Rm.edge) : litC(b, pal.dark ? 1.6 : 0.6)), Math.max(0.45, LW.fine || 0.4), null, 0.5 * a);
    };
    // decals on a solid in a real material: fills from the face they lie on (its tone and reflection, scaled), or their own material
    var REL = { paper: 1.35, light: 1.2, steel: 1.0, turned: 1.0, mid: 0.8, dark: 0.6, black: 0.36, turnedDark: 0.7, acc: 0.8, accLight: 1.1, accDark: 0.6 };
    var tDotC = function (Rm, ring) { return css(ring ? litC(tBase(Rm), 0.75) : tBase(Rm)); };
    var tDecals = function (s, d, Rs, a, pa, on) {
      var nv = rotN(d.n), alpha0 = (s.alpha == null ? 1 : s.alpha) * a, o0 = O[s.part], gk = null;
      var it0 = d.items[0], p0 = it0 ? (it0.pts || it0.dots || [])[0] : null;
      if (p0) { groups(); gk = planeKey(d.n, d.n[0] * (p0[0] + o0[0]) + d.n[1] * (p0[1] + o0[1]) + d.n[2] * (p0[2] + o0[2])); if (!GR[gk]) gk = null; }
      var host = tFace(Rs, nv, null, -1, null, false, false, null, s).rgb;
      d.items.forEach(function (it) {
        if (thumb && !it.keep) return;
        // (a texture marked fine is left out while the plate turns: 01's die photo draws about 1,600 decals at rest)
        if (cheap && it.fine) return;
        var dl = foc ? P.lit(foc, it, s) : false, al = foc ? (pa == null ? 1 : pa) : alpha0, keepF = curFade;
        curFade = foc && !dl ? FADE : 0;
        // (a diagram mark on a face, the field the light exposes, keeps the plate's own colour)
        if (it.diagram) { var pd = it.pts.map(function (q) { return proj(q, s.part).slice(0, 2); }), fd = typeof it.fill === 'string' ? MATS[it.fill] : it.fill; if (fd) g.poly(pd, fzC(fillOf(fd, nv, false, dl)), al); if (pick && fd) pick.push({ pts: pd, it: it, host: s }); if (it.lw !== 0) GL([it.closed ? pd.concat([pd[0]]) : pd], dl ? hlC : lineCol(it.col), (it.lw || LW.decal / k) * k * 0.9, null, al); curFade = keepF; return; }
        var fo = it.fill && typeof it.fill === 'object' ? it.fill : null, Rd = REAL[it.real || (fo && fo.real) || ''] || null;
        var lc = dl ? hlC : Rd ? css(litC(tBase(Rd), Rd.metal ? 1.18 : Rd.lineK || 0.6)) : it.col === 'bg' ? bgC : it.col === 'acc' || it.col === 'acc2' ? lineCol(it.col) : inC(host);
        if (it.dots) {
          var dp = it.dots.map(function (q) { return proj(q, s.part); });
          count.dots += dp.length;
          // (the pointer finds the decal it is on, so a face painted with several labelled parts answers part by part)
          if (pick) pick.push({ dots: dp, r: Math.max(3, (it.r || 0.9) * k + 1.5), it: it, host: s });
          g.dots(dp, Math.max(0.45, (it.r || 0.9) * k), fzC(dl ? hlC : Rd ? tDotC(Rd, it.ring) : it.fillCol ? css(colOf(it.fillCol)) : lc), (it.alpha == null ? 0.9 : it.alpha) * al, it.ring);
          curFade = keepF;
          return;
        }
        var pts = it.pts.map(function (q) { return proj(q, s.part).slice(0, 2); });
        if (pick && it.fill) pick.push({ pts: pts, it: it, host: s });
        if (it.fill) {
          var fm = typeof it.fill === 'string' ? MATS[it.fill] : it.fill;
          if (Rd) {
            var tf = tFace(Rd, nv, null, -1, pts, false, dl, null, s, { gk: gk, sheen: it.sheen });
            g.fillAny(pts, tf.f, (fm.alpha == null ? 1 : fm.alpha) * (Rd.clear || 1) * al);
            if (fm.hatch && !thumb) tHatch(pts, tf.rgb, fm, null, al, true);
            // a metal pad: its rim a darker tone of the metal, so it reads as a pad
            if (Rd.metal && it.lw !== 0 && !dl) lc = css(litC(tBase(Rd), 0.5));
          } else if (fm.hatch) { var hc = cutCol(Rs, host); g.poly(pts, fzC(css(hc)), al); if (!thumb) tHatch(pts, hc, fm, null, al); }
          else { var tf2 = tFace(Rs, nv, null, -1, pts, false, dl, null, s, { gk: gk, mul: typeof it.fill === 'string' ? (REL[it.fill] || 1) : 1.3 - (fm.d || 0.3), sheen: it.sheen }); g.fillAny(pts, tf2.f, (fm.alpha == null ? 1 : fm.alpha) * al); }
        }
        if (it.lw !== 0) {
          if (it.closed) pts = pts.concat([pts[0]]);
          var lw0 = (it.lw || LW.decal / k) * k * 0.9, dash = it.dash ? it.dash.map(function (v) { return v * k; }) : null;
          // (a heavy line on a face, the TSVs on a die's side, is recorded for the pointer too; fine rulings and traces are not, so the
          // face or film they cross keeps its own label)
          if (pick && !it.fill && lw0 >= 1.6) pick.push({ line: pts, r: lw0 / 2 + 0.75, it: it, host: s });
          // (a copper line with an edge: a darker rim each side, as the TSVs and the substrate's planes take it)
          if (it.edge && Rd && !dl) GL([pts], css(litC(tBase(Rd), 0.42)), lw0 + 0.9, dash, (it.alpha == null ? 1 : it.alpha) * al);
          GL([pts], lc, lw0, dash, (it.alpha == null ? 1 : it.alpha) * al);
        }
        curFade = keepF;
      });
    };
    // dots of a real material (bumps, balls): a large dot takes a darker rim
    var tDots = function (dp, dr, Rm, it, fa, on) {
      var b = tBase(Rm);
      // (a microbump: a copper pillar under a tin-silver cap, its rim dark)
      if (it.cap && !on) { g.dots(dp, dr + 0.5, fzC(css(litC(b, 0.42))), it.alpha * fa); g.dots(dp, dr, fzC(css(b)), it.alpha * fa); g.dots(dp, dr * 0.66, fzC(css(tBase(REAL.sac))), it.alpha * fa); return; }
      if (!it.ring && dr >= 1.5 && !on) { g.dots(dp, dr + 0.55, fzC(css(litC(b, 0.42))), it.alpha * fa); g.dots(dp, dr, fzC(css(b)), it.alpha * fa); return; }
      g.dots(dp, dr, on ? hlC : fzC(tDotC(Rm, it.ring)), it.alpha * fa, it.ring);
    };
    // a wire of a real material: a tube, its shade, its body and a lit line along it (a thin or dashed one a line in its colour)
    var tWire = function (pts, Rm, lw, dash, al, on, edge) {
      var b = tBase(Rm);
      if (on) { GL([pts], hlC, lw, dash, al); return; }
      if (dash || lw < 0.9) { if (edge && !dash) GL([pts], css(litC(b, 0.42)), lw + 0.9, null, al); GL([pts], css(litC(b, 1.0)), lw, dash, al); return; }
      GL([pts], css(litC(b, 0.45)), lw * 1.25, null, al, 'round');
      GL([pts], css(b), lw * 0.8, null, al, 'round');
      GL([pts], css(mixL(b, WHITE, 0.45)), lw * 0.3, null, al * 0.85, 'round');
    };
    // the globe: the sea, modelled as a sphere, the sphere's shading over the land, and its rim
    var tGlobe = function (x, y, r, fa) {
      var b = tBase(REAL.ocean);
      b = curFade ? mix(b, pal.bg, curFade) : b;
      if (!g.x) { g.circleAny(x, y, r, { x0: x, y0: y, r: r, fx: x - r * 0.35, fy: y - r * 0.4, fr: r * 0.05, stops: [[0, css(litC(b, 1.14))], [0.7, css(b)], [1, css(litC(b, 0.74))]] }, fa); return; }
      var c = g.x, gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
      gr.addColorStop(0, css(litC(b, 1.14))); gr.addColorStop(0.7, css(b)); gr.addColorStop(1, css(litC(b, 0.74)));
      c.globalAlpha = fa * g.ga; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = gr; c.fill(); c.globalAlpha = 1;
    };
    var tRim = function (G2) {
      if (g.x) {
        var c = g.x, gr = c.createRadialGradient(G2.x - G2.r * 0.35, G2.y - G2.r * 0.4, G2.r * 0.1, G2.x, G2.y, G2.r);
        gr.addColorStop(0, 'rgba(255,255,255,' + 0.12 + ')'); gr.addColorStop(0.5, 'rgba(255,255,255,0)'); gr.addColorStop(0.8, 'rgba(8,18,40,0)'); gr.addColorStop(1, 'rgba(8,18,40,' + (pal.dark ? 0.32 : 0.24) + ')');
        c.globalAlpha = g.ga; c.beginPath(); c.arc(G2.x, G2.y, G2.r, 0, Math.PI * 2); c.fillStyle = gr; c.fill(); c.globalAlpha = 1;
      } else g.circleAny(G2.x, G2.y, G2.r, { x0: G2.x, y0: G2.y, r: G2.r, fx: G2.x - G2.r * 0.35, fy: G2.y - G2.r * 0.4, fr: G2.r * 0.1, stops: [[0, 'rgb(255,255,255)', 0.12], [0.5, 'rgb(255,255,255)', 0], [0.8, 'rgb(8,18,40)', 0], [1, 'rgb(8,18,40)', pal.dark ? 0.32 : 0.24]] }, 1);
      g.circle(G2.x, G2.y, G2.r, null, css(pal.dark ? litC(tBase(REAL.ocean), 0.55) : hex('#3d5a70')), 1);
    };
    var tSwire = function (runs, it, fa) {
      var sea = tBase(REAL.ocean), land = tBase(REAL.land), grat = it.alpha < 0.6;
      var col = grat ? litC(sea, pal.dark ? 1.3 : 0.78) : litC(land, pal.dark ? 0.62 : 0.5);
      GL(runs, css(col), it.lw * k, null, (grat ? 0.6 : 0.95) * fa);
    };
    /* shadow discipline (round 2, S4). The key light, from the current turn. A part casts on the upward faces under it only
       where it rests on them (within 3 percent of the drawing's size, fading with the gap) and only within its own exploded
       group, never across an exploded gap; less on polished faces, which show reflections. One ground under the parts that
       touch it, a tight core and a soft penumbra (the core alone on the dark ground), faded before the canvas edge. On the canvas
       each shadow is a blurred offscreen mask; in the still (SvgG, the print) the same shapes are a blurred SVG group, clipped
       to the faces that receive it */
    var VEC = !g.x && !!g.shadow;
    var SHD = !CHART && !thumb && !lite && !st.noShadow && (VEC || (g.x && typeof document !== 'undefined')) ? (function () {
      var Lw = [R[0] * Lt[0] + R[3] * Lt[1] + R[6] * Lt[2], R[1] * Lt[0] + R[4] * Lt[1] + R[7] * Lt[2], R[2] * Lt[0] + R[5] * Lt[1] + R[8] * Lt[2]];
      if (Lw[1] < 0.35) { Lw[1] = 0.35; var n2 = Math.hypot(Lw[0], Lw[1], Lw[2]); Lw = [Lw[0] / n2, Lw[1] / n2, Lw[2] / n2]; }
      var dLx = sc * (R[0] * Lw[0] + R[1] * Lw[1] + R[2] * Lw[2]), dLy = -sc * (R[3] * Lw[0] + R[4] * Lw[1] + R[5] * Lw[2]);
      var LG = [Lw[0] * 0.2, Lw[1], Lw[2] * 0.2], lg = Math.hypot(LG[0], LG[1], LG[2]); LG = [LG[0] / lg, LG[1] / lg, LG[2] / lg];
      var dLgx = sc * (R[0] * LG[0] + R[1] * LG[1] + R[2] * LG[2]), dLgy = -sc * (R[3] * LG[0] + R[4] * LG[1] + R[5] * LG[2]);
      var ms = turned ? 0.25 : 0.5, MW = Math.max(1, Math.round(w * ms)), MH = Math.max(1, Math.round(h * ms));
      var cv = VEC ? null : plateSelf._shCv || (plateSelf._shCv = [document.createElement('canvas'), document.createElement('canvas')]);
      if (cv) cv.forEach(function (c) { if (c.width !== MW || c.height !== MH) { c.width = MW; c.height = MH; } });
      var size = m.size || 1, eps = size * 0.0015, reach = size * 0.03, fall = size * 0.012, SC = pal.dark ? 'rgb(0,0,0)' : 'rgb(22,28,46)', SA = pal.dark ? 0.45 : 0.3;
      var casters = null, lastKey = null;
      var Yv = function (vi) { return V[vi * 3 + 1] + O[VP[vi]][1]; };
      var sameRest = function (pa, pb) { if (pa === pb) return true; var ea = m.parts[pa].ex, eb = m.parts[pb].ex; return ea[0] === eb[0] && ea[1] === eb[1] && ea[2] === eb[2]; };
      var cast = function () {
        if (casters) return casters;
        casters = m.S.filter(function (s) { if (s.kind !== 'solid' || s.mat.ghost || s.mat.phantom || s.two || s.noCast || A[s.part] <= 0.01) return false; var Rm = s.real && REAL[s.real]; return !(Rm && Rm.clear != null && Rm.clear < 0.6); });
        casters.forEach(function (s) {
          s._y0 = s.ymin + O[s.part][1]; s._y1 = s.ymax + O[s.part][1];
          var b = [Infinity, Infinity, -Infinity, -Infinity];
          for (var fi = s.f0; fi < s.f1; fi++) { var vv = F[fi].v; for (var q = 0; q < vv.length; q++) { var x = X[vv[q] * 3], y = X[vv[q] * 3 + 1]; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; } }
          s._bb = b;
        });
        return casters;
      };
      var hull = function (p) {
        p.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
        var cr = function (o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }, lo = [], up = [], i;
        for (i = 0; i < p.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
        for (i = p.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
        up.pop(); lo.pop(); return lo.concat(up);
      };
      var shapes = function (y0, list, L3, dx, dy) {
        var out = [];
        list.forEach(function (s) {
          if (s.f1 - s.f0 > 30) {
            var P0 = [], seen = {};
            for (var fj = s.f0; fj < s.f1; fj++) { var vw = F[fj].v; for (var r = 0; r < vw.length; r++) { var vi0 = vw[r]; if (seen[vi0]) continue; seen[vi0] = 1; var t0 = (Yv(vi0) - y0) / L3[1]; P0.push([X[vi0 * 3] - t0 * dx, X[vi0 * 3 + 1] - t0 * dy]); } }
            var Hh = hull(P0); if (Hh.length > 2) out.push(Hh);
            return;
          }
          for (var fi = s.f0; fi < s.f1; fi++) {
            var f = F[fi], n = f.n; if (!f.two && n[0] * L3[0] + n[1] * L3[1] + n[2] * L3[2] < -1e-3) continue;
            var vv = f.v, pg = [];
            for (var q = 0; q < vv.length; q++) { var vi = vv[q], t = (Yv(vi) - y0) / L3[1]; pg.push([X[vi * 3] - t * dx, X[vi * 3 + 1] - t * dy]); }
            out.push(pg);
          }
        });
        return out;
      };
      var mask = function (y0, list, blur, L3, dx, dy, fade) {
        if (VEC) return { shapes: shapes(y0, list, L3, dx, dy), blur: blur, fade: fade };
        var mc = cv[0].getContext('2d'); mc.setTransform(1, 0, 0, 1, 0, 0); mc.clearRect(0, 0, MW, MH); mc.setTransform(ms, 0, 0, ms, 0, 0); mc.fillStyle = SC;
        shapes(y0, list, L3, dx, dy).forEach(function (pg) { mc.beginPath(); mc.moveTo(pg[0][0], pg[0][1]); for (var q = 1; q < pg.length; q++) mc.lineTo(pg[q][0], pg[q][1]); mc.closePath(); mc.fill(); });
        var bc = cv[1].getContext('2d'); bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(0, 0, MW, MH);
        if (!turned && 'filter' in bc) { bc.filter = 'blur(' + Math.max(0.4, blur * ms).toFixed(2) + 'px)'; bc.drawImage(cv[0], 0, 0); bc.filter = 'none'; }
        else {
          var fct = Math.max(1, Math.min(4, blur * ms / 1.2)), src = cv[0], sw = MW, sh = MH, step = 2;
          while (fct >= 1.5 && step <= 5) {
            var tcv = cv[step] || (cv[step] = document.createElement('canvas')), nw = Math.max(1, Math.round(sw / Math.min(2, fct))), nh = Math.max(1, Math.round(sh / Math.min(2, fct)));
            if (tcv.width !== nw || tcv.height !== nh) { tcv.width = nw; tcv.height = nh; }
            var tc = tcv.getContext('2d'); tc.setTransform(1, 0, 0, 1, 0, 0); tc.clearRect(0, 0, nw, nh); tc.imageSmoothingEnabled = true; tc.drawImage(src, 0, 0, sw, sh, 0, 0, nw, nh);
            src = tcv; fct /= Math.min(2, fct); sw = nw; sh = nh; step++;
          }
          bc.imageSmoothingEnabled = true; bc.drawImage(src, 0, 0, sw, sh, 0, 0, MW, MH);
        }
        // (the ground's shadow fades out over the canvas's last 24 px, so the canvas never clips it)
        if (fade) {
          var E = 24 * ms; bc.save(); bc.globalCompositeOperation = 'destination-out';
          [[0, 0, E, 0, 0, 0, E, MH], [MW, 0, MW - E, 0, MW - E, 0, E, MH], [0, 0, 0, E, 0, 0, MW, E], [0, MH, 0, MH - E, 0, MH - E, MW, E]].forEach(function (q) {
            var gq = bc.createLinearGradient(q[0], q[1], q[2], q[3]); gq.addColorStop(0, 'rgba(0,0,0,1)'); gq.addColorStop(1, 'rgba(0,0,0,0)'); bc.fillStyle = gq; bc.fillRect(q[4], q[5], q[6], q[7]);
          });
          bc.restore();
        }
        return cv[1];
      };
      var put = function (mk, al, polys) {
        if (VEC) { g.shadow(mk.shapes, mk.blur, al, SC, polys, mk.fade); return; }
        var c = g.x; c.save();
        if (polys) { c.beginPath(); polys.forEach(function (p) { c.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]); c.closePath(); }); c.clip(); }
        c.globalAlpha = al * g.ga; c.drawImage(mk, 0, 0, w, h); c.restore();
      };
      var shBox = function (c, y0) { var t0 = (c._y0 - y0) / Lw[1], t1 = (c._y1 - y0) / Lw[1], b = c._bb, mg = 12; return [Math.min(b[0] - t0 * dLx, b[0] - t1 * dLx) - mg, Math.min(b[1] - t0 * dLy, b[1] - t1 * dLy) - mg, Math.max(b[2] - t0 * dLx, b[2] - t1 * dLx) + mg, Math.max(b[3] - t0 * dLy, b[3] - t1 * dLy) + mg]; };
      return {
        ground: function () {
          var L = cast(); lastKey = null; if (!L.length || m.spec.noGround) return;
          var gy = Infinity; L.forEach(function (s) { gy = Math.min(gy, s._y0); }); gy -= eps;
          var touch = L.filter(function (s) { return s._y0 - gy < size * 0.02; });
          if (!touch.length) return;
          put(mask(gy, touch, 3, LG, dLgx, dLgy, true), pal.dark ? 0.42 : 0.4);
          if (!pal.dark) put(mask(gy, touch, 12, LG, dLgx, dLgy, true), 0.16);
          lastKey = null;
        },
        receive: function (s, faces, a) {
          var L = cast(), lv = {}, keys = [], Rr = s.real && REAL[s.real], gr0 = Rr ? gOf(Rr) : 0;
          faces.forEach(function (fi) { var f = F[fi]; if (f.n[1] < 0.9 || f.curve) return; var y0 = Yv(f.v[0]), kk = Math.round(y0 / eps); if (!lv[kk]) { lv[kk] = { y0: y0, ps: [], bb: [Infinity, Infinity, -Infinity, -Infinity] }; keys.push(kk); } var p = f.v.map(P2), b = lv[kk].bb; lv[kk].ps.push(p); p.forEach(function (q) { if (q[0] < b[0]) b[0] = q[0]; if (q[1] < b[1]) b[1] = q[1]; if (q[0] > b[2]) b[2] = q[0]; if (q[1] > b[3]) b[3] = q[1]; }); });
          keys.forEach(function (kk) {
            var o = lv[kk], y0 = o.y0, bb = o.bb;
            var list = L.filter(function (c) { if (c === s || !sameRest(c.part, s.part) || c._y0 < y0 - eps || c._y0 - y0 > reach) return false; var sb = shBox(c, y0); return sb[0] < bb[2] && sb[2] > bb[0] && sb[1] < bb[3] && sb[3] > bb[1]; });
            if (!list.length) return;
            var gap = Infinity; list.forEach(function (c) { gap = Math.min(gap, Math.max(0, c._y0 - y0)); });
            var key = kk + '|' + list.map(function (c) { return c._id; }).join(','), mk;
            if (key === lastKey && !VEC) mk = cv[1]; else { mk = mask(y0, list, Math.min(8, 1.5 + gap * sc * 0.08), Lw, dLx, dLy, false); lastKey = key; }
            put(mk, SA * a * Math.exp(-gap / fall) * (1 - 0.7 * gr0), o.ps);
          });
        }
      };
    })() : null;

    // the reader's pointer on a label or a part lights that part; the rest steps back (P.lit says what a focus lights)
    var foc = this.focus, inF = function (it) { return P.lit(foc, it); };
    var dimF = function (it) { return foc ? (inF(it) ? 1 : it.real || it.kind === 'globe' || it.kind === 'land' || it.kind === 'swire' || it.kind === 'rim' ? 1 : 0.55) : 1; };
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
    if (SHD) SHD.ground();

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
      if (m.spec.ghostFill) gh.forEach(function (s) { for (var fi = s.f0; fi < s.f1; fi++) if (front[fi]) { var gp = F[fi].v.map(P2); g.poly(gp, bgC, 0.94 * a); if (pick) pick.push({ pts: gp, it: s }); } });
      gh.forEach(function (s) { ghostEdges(s, false, a * dimF(s)); });
      // under 560 px, where leaders find their way out of the drawing to a row of labels, an outline-only part still counts as
      // drawing (the cost column's yield loss), so no leader runs down its face
      if (occ && rowsMode) gh.forEach(function (s) { for (var fi = s.f0; fi < s.f1; fi++) if (front[fi]) occ.push({ pts: F[fi].v.map(P2), it: s }); });
      var dep = items.map(function (it) { if (p.mode === 'stack' && it.kind === 'solid') return it.ymin * 1000 + depthOf(it.c, p.idx); return depthOf(it.c, p.idx); });
      var ord = items.map(function (it, i) { return i; }).sort(function (x, y) { return dep[x] - dep[y]; });
      if (p.mode === 'fixed') ord = items.map(function (it, i) { return i; });
      ord.forEach(function (ii) {
        var it = items[ii], fa = a * dimF(it), hl = foc && inF(it);
        curFade = foc && !hl ? FADE : 0;
        // a pin on the globe fades as its foot goes round the rim, rather than blinking out
        if (it.vis) { var vz = proj(it.vis, it.part)[2]; if (vz < -0.04) return; fa *= clamp01((vz + 0.04) / 0.14); }
        if (it.kind === 'solid') solid(it, fa, hl, a);
        else if (it.kind === 'wire') {
          if (thumb && it.lw < 0.9) return;
          var pts = it.pts.map(function (q) { return proj(q, it.part).slice(0, 2); });
          if (it.closed) pts.push(pts[0]);
          if (it.real && REAL[it.real]) tWire(pts, REAL[it.real], (thumb ? Math.max(0.5, it.lw * 0.6) * ik : it.lw * k), it.dash ? it.dash.map(function (v) { return v * k; }) : null, it.alpha * fa, hl, it.edge);
          else g.lines([pts], hl ? hlC : lineCol(it.col), (thumb ? Math.max(0.5, it.lw * 0.6) * ik : it.lw * k), it.dash ? it.dash.map(function (v) { return v * k; }) : null, it.alpha * fa);
          if (pick && !thumb && it.alpha > 0.05) pick.push({ line: pts, r: Math.max(3, it.lw * k / 2 + 2), it: it });
        } else if (it.kind === 'globe') {
          var gc = proj([0, 0, 0], it.part);
          tGlobe(gc[0], gc[1], it.r * sc, fa);
          self._globe = { x: gc[0], y: gc[1], r: it.r * sc };
        } else if (it.kind === 'rim') {
          var G2 = self._globe; if (G2) tRim(G2);
        } else if (it.kind === 'land') {
          var G = self._globe || { x: cx, y: cy, r: sc };
          it.rings.forEach(function (rg, ri) {
            var pts = rg.map(function (q) { var pp = proj(q, it.part); if (pp[2] < 0) { var dx = pp[0] - G.x, dy = pp[1] - G.y, L = Math.hypot(dx, dy) || 1; return [G.x + dx / L * G.r, G.y + dy / L * G.r]; } return [pp[0], pp[1]]; });
            var hole = it.holes.indexOf(ri) >= 0;
            g.poly(pts, fzC(css(hole ? tBase(REAL.ocean) : tBase(REAL.land))), fa);
          });
        } else if (it.kind === 'swire') {
          if (thumb && it.lod > 0) return;
          var pp = it.pts.map(function (q) { return proj(q, it.part); }), runs = [], run = [];
          pp.forEach(function (q) { if (q[2] >= 0) run.push([q[0], q[1]]); else { if (run.length > 1) runs.push(run); run = []; } });
          if (run.length > 1) runs.push(run);
          if (it.col === 'ink') tSwire(runs, it, fa); else g.lines(runs, it.col === 'ink' ? inkC : lineCol(it.col), (thumb ? Math.max(0.45, it.lw * 0.7) : it.lw * k), null, it.alpha * fa);
        } else if (it.kind === 'spike') {
          var sh = spikeXY(it, proj), sf = proj(it.foot, it.part), scol = hl ? hlC : lineCol(it.col), slw = thumb ? Math.max(0.6, it.lw * 0.6) * ik : it.lw * k;
          if (it.sx) g.lines([[[sf[0], sf[1]], [sh[0], sf[1]]]], scol, slw * 0.7, null, fa, 'butt');
          g.lines([[[sh[0], sf[1]], sh]], scol, slw, null, fa, 'butt');
          var srr = Math.max(0.8, it.r * (thumb ? 0.6 : k));
          g.dots([sh], srr, hl ? hlC : css(colOf(it.col)), fa);
          if (pick) pick.push({ dots: [sh], r: Math.max(4, srr + 2), it: it });
          // (the layout keeps other labels' leaders 6 px clear of a spike's head and its stem)
          if (occ) { occ.push({ dots: [sh], r: srr + 6, it: it }); occ.push({ pts: [[sh[0] - 3, sh[1]], [sh[0] + 3, sh[1]], [sh[0] + 3, sf[1]], [sh[0] - 3, sf[1]]], it: it }); }
        } else if (it.kind === 'dots') {
          if (thumb && it.r < 1.2 && !it.keepThumb) return;
          var dp = it.pts.map(function (q) { return proj(q, it.part); });
          if (it.front) dp = dp.filter(function (q) { return q[2] >= 0; });
          count.dots += dp.length;
          var dr = Math.max(0.5, it.r * (thumb ? 0.6 : k));
          if (it.real && REAL[it.real]) tDots(dp, dr, REAL[it.real], it, fa, hl); else g.dots(dp, dr, hl ? hlC : it.col === 'ink' ? inkC : css(colOf(it.col)), it.alpha * fa, it.ring);
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
      var Rs = s.real ? REAL[s.real] || null : null, clear = Rs && Rs.clear != null && Rs.clear < 1 ? Rs.clear : 1, axV = Rs && s.axisN ? rotN(s.axisN) : null;
      curFade = foc && !hl ? FADE : 0;
      if (Rs && clear < 1 && !thumb) tBack(s, a * (s.alpha == null ? 1 : s.alpha), hl);
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
      // a part under about 60 px on the page draws its whole outline at outline weight: the shade line is for the object's form.
      // So does a thin part, under about 16 px across (its projected area over its length, 22 Nov 2026 plates refine round two:
      // the rack's copper busbar, 8 px wide, was swallowed by its ink shade line); on paper a thin part in a colour takes its
      // outline in its own tinted line, so the colour still shows
      var area2 = 0; faces.forEach(function (fi) { var vv = F[fi].v, a2 = 0; for (var q = 0; q < vv.length; q++) { var q2 = (q + 1) % vv.length; a2 += X[vv[q] * 3] * X[vv[q2] * 3 + 1] - X[vv[q2] * 3] * X[vv[q] * 3 + 1]; } area2 += Math.abs(a2) / 2; });
      var thin = !thumb && diag > 0 && area2 / diag < 16;
      var small = !thumb && (diag < 60 || thin), thinTint = thin && !pal.dark && (isAcc(mat.c) || !!Rs);
      // a dished end of a turned part turned toward the reader (a mirror's face) takes two concentric rings, never shading lines,
      // which there read as the blades of a fan
      var rings = [], dish = !!(s.axisN && Math.abs(rotN(s.axisN)[2]) > 0.4);
      // an outline inside the part's own outline (the lip where a wider crown sits on the body) is not its silhouette: it keeps
      // outline weight, and the shade line is kept for the part's outer edge
      // (a model may keep the shade line on such a lip, o.lip: the ingot's ground band, which stands proud of the body all round)
      var inner = s.axisN && !s.lip && !thumb && !lite ? faces.map(function (fi) { return F[fi].v.map(P2); }) : null;
      faces.forEach(function (fi) {
        var f = F[fi], fm = f.mat || mat, pts = f.v.map(P2), nvw = rotN(f.n);
        if (f.two && nvw[2] < 0) nvw = [-nvw[0], -nvw[1], -nvw[2]];
        count.faces++;
        var Rf = (fm.real && REAL[fm.real]) || Rs, TF = null;
        if (Rf) {
          TF = tFace(Rf, nvw, f, fi, pts, !!fm.hatch, hl, axV, s);
          g.fillAny(pts, TF.f, (Rf.clear != null && Rf.clear < 1 ? Rf.clear : 1) * alpha);
          if (fm.hatch && !thumb && !lite && !Rf.noHatch) tHatch(pts, TF.rgb, fm, f, alpha);
        } else if (fm.hatch) {
          g.poly(pts, css(mix(pal.bg, colOf(fm.c), fm.d)), alpha);
          if (!thumb && !lite) g.hatch(pts, fm.c ? lineCol(fm.c) : inkC, (fm.gap || (fm.hatch === 2 ? 2.4 : 3.4)) * k, LW.hatch, fm.hatch, (pal.dark ? 0.7 : 0.8) * alpha, f.hv != null ? f.hv : fm.ang);
        } else g.poly(pts, fillOf(fm, nvw, f.curve, hl), (fm.alpha == null ? 1 : fm.alpha) * alpha);
        stamp[fi] = frame;
        var seeT = s.real && REAL[s.real] && REAL[s.real].seeThru;
        if (pick) pick.push({ pts: pts, it: s, soft: !!seeT });
        if (occ && !seeT) occ.push({ pts: pts, it: s });
        var out = [], shade = [], crease = [], fine = [], shl = [];
        var gx = 0, gy = 0; for (var q = 0; q < pts.length; q++) { gx += pts[q][0]; gy += pts[q][1]; } gx /= pts.length; gy /= pts.length;
        for (q = 0; q < f.v.length; q++) {
          var e = f.e[q], nb = e[0], cls = e[1], A0 = pts[q], B0 = pts[(q + 1) % pts.length], seg = [A0, B0];
          // a joint, where this solid sits on another (P.build joints), is a crease, never a shade line; a model may draw its joints
          // at outline or shade weight (spec.joints 'out' or 'shade': the cost column's layers, each a share of the bill, read as
          // separate blocks only where the line between them is drawn as firmly as their edges, 22 Nov 2026 plates refine)
          if (s.joint) { var va = f.v[q], vb = f.v[(q + 1) % f.v.length]; if (s.joint[va < vb ? va + '_' + vb : vb + '_' + va]) { if (nb < 0 || !front[nb] || (stamp[nb] === frame && cls === 1)) (jointW === 'shade' ? shade : jointW === 'out' ? out : crease).push(seg); continue; } }
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
          if (cls === 1) { ((F[nb].mat || mat).hatch || fm.hatch) ? out.push(seg) : (seg.nb = nb, crease.push(seg)); }
          else if (cls === 2 && LW.fine) fine.push(seg);
        }
        // shading lines on a turned surface: along its axis, gathering toward the shade side
        if (!thumb && !lite && f.curve && f.mj >= 0 && pts.length === 4 && !fm.hatch && !(TF && !(f.cap && dish))) {
          if (f.cap && dish) { if (s.rings.indexOf(f.ri) >= 0) rings.push([pts[0], pts[1]]); }
          else {
            var lam = lamC(nvw), sh = 1 - lam, j = f.mj, ring = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), mer = Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]);
            if (ring > 0.9 && mer > 3 && ((sh > 0.86) || (sh > 0.68 && j % 2 === 0) || (sh > 0.5 && j % 4 === 0))) shl.push([pts[3], pts[0]]);
          }
        }
        if (small && shade.length) { out = out.concat(shade); shade = []; }
        var lcK = fm.c || mat.c;
        if (TF) { tEdges(TF, Rf, s, f, shl, fine, crease, out, shade, hl, alpha, szK, thinTint, nvw); count.edges += out.length + shade.length + crease.length + fine.length; return; }
        if (shl.length) g.lines(shl, hl ? hlC : strokeOf(lcK, 'shl'), LW.shadeLn * (pal.dark ? 1.2 : 1), null, (pal.dark ? 0.55 : 0.75) * alpha, 'butt');
        if (fine.length) g.lines(fine, hl ? hlC : strokeOf(lcK, 'fine'), LW.fine, null, 0.8 * alpha);
        if (crease.length) g.lines(crease, hl ? hlC : strokeOf(lcK, 'crease'), LW.crease, null, alpha);
        if (out.length) g.lines(out, hl ? hlC : thinTint ? lineCol(lcK) : strokeOf(lcK, 'out'), (hl ? LW.out * 1.25 : LW.out) * (thumb ? szK : Math.max(0.8, szK)), null, alpha);
        if (shade.length) g.lines(shade, hl ? hlC : strokeOf(lcK, 'shade'), (hl ? LW.shade * 1.1 : LW.shade) * szK, null, alpha);
        count.edges += out.length + shade.length + crease.length + fine.length;
      });
      if (rings.length) g.lines(rings, hl ? hlC : strokeOf(mat.c, 'shl'), LW.shadeLn * (pal.dark ? 1.3 : 1.15), null, 0.7 * alpha, 'butt');
      var alpha0 = alpha;
      if (s.decals.length) s.decals.forEach(function (d) {
        var nz = R[6] * d.n[0] + R[7] * d.n[1] + R[8] * d.n[2];
        if (nz <= 1e-4 && !s.two) return;
        if (Rs) { tDecals(s, d, Rs, a, pa, hl); return; }
        d.items.forEach(function (it) {
          if (thumb && !it.keep) return;
          // a decal lights on its own (the HBM stack's vias), so its alpha and colour are its own while a part is pointed at
          var dl = foc ? P.lit(foc, it, s) : false, alpha = foc ? (dl ? 1 : 0.2) * (pa == null ? 1 : pa) : alpha0;
          var col = dl ? hlC : it.col ? (it.col === 'ink' ? inkC : lineCol(it.col)) : inkC;
          if (it.dots) {
            var dp = it.dots.map(function (q) { return proj(q, s.part); });
            count.dots += dp.length;
            if (pick) pick.push({ dots: dp, r: Math.max(3, (it.r || 0.9) * k + 1.5), it: it, host: s });
            g.dots(dp, Math.max(0.45, (it.r || 0.9) * k), it.fillCol && !dl ? css(colOf(it.fillCol)) : col, (it.alpha == null ? 0.9 : it.alpha) * alpha, it.ring);
            return;
          }
          var pts = it.pts.map(function (q) { return proj(q, s.part).slice(0, 2); });
          if (pick && it.fill) pick.push({ pts: pts, it: it, host: s });
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
      if (SHD && !s.two && clear >= 1) SHD.receive(s, faces, a);
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
      // (a model may draw an outline-only part's edges at outline weight, spec.ghostW 'out': the cost column's yield loss, a
      // layer of the bill like the others, drawn hollow)
      if (frontPass) g.lines(edgesOf(s, function (fa, fb) { return fa || fb; }), col, m.spec.ghostW === 'out' && !thumb ? LW.out : LW.crease * 1.1, null, 0.9 * a);
      else g.lines(edgesOf(s, function (fa, fb) { return !fa && !fb; }), col, LW.fine || 0.4, [3 * k, 2.5 * k], 0.55 * a);
    }
    function phantomEdges(s, a) {
      var col = lineCol(s.mat.c);
      g.lines(edgesOf(s, function () { return true; }), col, Math.max(0.5, LW.fine * 1.15), [4.5 * k, 2.5 * k], 0.85 * a, 'butt');
    }

    // ---- over the parts: the light paths, then dimensions, then the labels
    // (one line, no tinted halo along it: the halo read as glow, 22 Nov 2026 plates refine; a path may lie over a knock-out in the
    // paper's colour, L.knock, a drafting gap 2.4 times its width where it crosses the parts, round two: every knock-out first,
    // then every path, so no knock-out cuts another path where they meet)
    [true, false].forEach(function (knockPass) {
      m.lines.forEach(function (L) {
        if (L.style !== 'beam' || (knockPass && (!(L.knock || (pal.dark && L.knockDark)) || thumb))) return;
        var pts = L.pts.map(function (p) { return proj(p, p[3] == null ? null : p[3]).slice(0, 2); });
        // a label on the light path (P.focusOf beam) lights the path
        var col = css(colOf(L.col || 'acc')), lb = !!(foc && foc.beam), aa = (L.alpha == null ? 1 : L.alpha) * Math.min(1, K * 1.6) * (foc && !lb ? 0.35 : 1);
        if (knockPass) g.lines([pts], bgC, pal.dark ? (L.lw || 1.4) * k + 2 : (L.lw || 1.4) * k * 2.4, null, Math.min(1, K * 1.6) * (foc && !lb ? 0.35 : 1), 'butt');
        else { g.lines([pts], col, (L.lw || 1.4) * (thumb ? 0.8 : k) * (lb ? 1.5 : 1), null, aa); if (pick && !thumb) pick.push({ line: pts, r: 5, beam: L }); }
      });
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
        // the cone: two hairlines tangent to the ring on the spot and to the disc
        var dx = G.x - T[0], dy = G.y - T[1], d = Math.hypot(dx, dy);
        if (d > G.r + rt + 4) {
          var th = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (rt - G.r) / d)));
          var p1a = [T[0] + rt * Math.cos(th + al), T[1] + rt * Math.sin(th + al)], p2a = [G.x + G.r * Math.cos(th + al), G.y + G.r * Math.sin(th + al)];
          var p1b = [T[0] + rt * Math.cos(th - al), T[1] + rt * Math.sin(th - al)], p2b = [G.x + G.r * Math.cos(th - al), G.y + G.r * Math.sin(th - al)];
          // (two tangent hairlines and nothing between them, 22 Nov 2026 plates refine: the wash between them read as a beam)
          g.lines([[p1a, p2a], [p1b, p2b]], line, 0.7 * k, null, 0.5, 'butt');
        }
        g.circle(T[0], T[1], rt, null, bgC, 3.2);
        g.circle(T[0], T[1], rt, null, css(mix(pal.bg, pal.ink, 0.8)), 1.1);
      }
      g.circle(G.x, G.y, G.r, bgC, null, 0);
      // the small plate, fitted to the disc, then its scale bars and names
      var S2 = G.r * 2, x0 = G.x - G.r, y0 = G.y - G.r, f0 = lp.fit(S2, S2), sk = L.scale || 1;
      var f2 = { s: f0.s * sk, cx: x0 + G.r + (f0.cx - G.r) * sk + (L.dx || 0) * S2, cy: y0 + G.r + (f0.cy - G.r) * sk + (L.dy || 0) * S2, e: f0.e };
      g.clip(G.x, G.y, G.r - 0.5);
      lp.paint({ k: 1, w: S2, h: S2, g: g, pal: pal, fit: f2, noDims: true, noLabels: true, noShadow: true });
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
        if (b.wit) [[b.wit[0], a], [b.wit[1], c]].forEach(function (pr) {
          var w = pj(pr[0]), e = pr[1], ux = e[0] - w[0], uy = e[1] - w[1], ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
          var seg = [[w[0] + ux * 2, w[1] + uy * 2], [e[0] + ux * 3.5, e[1] + uy * 3.5]];
          g.lines([seg], bgC, 2.6, null, 0.9, 'butt'); g.lines([seg], txt, 0.75, null, 0.85, 'butt');
        });
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
      // one ring (a second, fainter ring outside it read as a lens's glint)
      g.circle(G.x, G.y, G.r, null, css(mix(pal.bg, pal.ink, 0.86)), 1.25 * k);
      // the caption under the disc (or, on a phone, beside it), in the label's muted ink
      // (a tucked disc may carry its caption over it, capSide 't': under it, the drawing's corner)
      if (G.capSide === 't') G.cap.forEach(function (ln, i) { g.text(ln, G.x, G.y - G.r - 12 - (G.cap.length - 1 - i) * 16, { size: 12, weight: 500, fill: css(pal.muted), align: 'center', halo: bgC, haloW: 3 }); });
      else if (G.capSide && G.capDy) G.cap.forEach(function (ln, i) { var lf = G.capSide === 'l', hf = Math.sqrt(Math.max(0, G.r * G.r - Math.pow(Math.abs(G.capDy) - 8, 2))); g.text(ln, G.x + (lf ? -1 : 1) * (hf + 14), G.y + G.capDy + (i - (G.cap.length - 1) / 2) * 16, { size: 12, weight: 500, fill: css(pal.muted), align: lf ? 'right' : 'left', halo: bgC, haloW: 3 }); });
      else if (G.capSide) G.cap.forEach(function (ln, i) { var lf = G.capSide === 'l'; g.text(ln, G.x + (lf ? -1 : 1) * (G.r + 14), G.y + (i - (G.cap.length - 1) / 2) * 16, { size: 12, weight: 500, fill: css(pal.muted), align: lf ? 'right' : 'left', halo: bgC, haloW: 3 }); });
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
          // and out as it nears the rim, and the label stays where it is. (22 Nov 2026 expert review: the fade runs from 81 to
          // 66 degrees off the line of sight, where it ran from 73 to 57, so a pin standing in full view on the rest view's
          // upper rim, the Netherlands', keeps its label in full ink)
          pts = []; wts = [];
          c.track.forEach(function (q, qi) {
            var o = O[q[3]], x = q[0] + o[0], y = q[1] + o[1], z = q[2] + o[2], L = Math.hypot(x, y, z) || 1;
            // (a spike's head is up the page from its foot, M.spike)
            var f = (R[6] * x + R[7] * y + R[8] * z) / L, wt = clamp01((f - 0.15) / 0.25), pq = c.spikes ? spikeXY(c.spikes[qi], proj) : proj(q, q[3]), G0 = self._globe;
            // and not from the far side of the disc, so a leader never runs across the whole globe
            if (G0 && c.side && !rows) { var u = (pq[0] - G0.x) / G0.r * (c.side === 'l' ? -1 : 1); wt *= clamp01((u + 0.5) / 0.35); }
            if (wt > 0.01) { pts.push(pq); wts.push(wt * wt * (3 - 2 * wt)); }
          });
          c.pts.forEach(function (q, qi) { var p0 = c.spikes ? proj0(c.spikes[qi].foot, c.spikes[qi].part) : proj0(q, q[3] == null ? c.part : q[3]); my += p0[1]; mx += p0[0]; }); my /= c.pts.length; mx /= c.pts.length;
          // one leader to the country's base, where its spikes stand, rather than one to every head (22 Nov 2026 plates refine: a
          // leader to Japan's heads ran through Korea's spike, which stands between them and the labels)
          if (c.spikes && pts.length) { var f0 = proj(c.spikes[0].foot, c.spikes[0].part); pts = [[f0[0], f0[1]]]; wts = [Math.max.apply(null, wts)]; }
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
        // (a leader may run by a point of the drawing first, c.via, as the baseboard's runs down the aisle between the modules)
        var via = c.via && !rows ? proj(c.via, c.via[3] == null ? c.part : c.via[3]) : null;
        // (a waypoint on a turning globe that has gone round the back is dropped)
        if (via && c.track && via[2] < 0) via = null;
        return { c: c, ci: ci, pts: pts, wts: wts, x: mx, y0: (via ? via[1] : my) + (c.dy || 0) * k, hh: Math.max(hh, r * 2), lines: lines, tw: tw, r: r, side: side, via: via ? [via[0], via[1]] : null };
      });
      // (the tucked columns' state: colX, below)
      var tuckX = { l: null, r: null }, maxW = { l: 0, r: 0 };
      ents.forEach(function (L) { var sd = L.side; if (maxW[sd] == null) return; maxW[sd] = Math.max(maxW[sd], L.tw + (L.r ? 2 * L.r + 6 * k : 0)); });
      if (occ) { self._lay = rows ? layRows(ents) : layCols(ents); self._layKey = layKey; self._layStats = self._lay.stats || null; }
      var lay = self._layKey === layKey ? self._lay : null;
      if (lay && lay.tuck) tuckX = { l: lay.tuck.l, r: lay.tuck.r };
      if (rows) drawRows(ents, lay && lay.rows ? lay : null); else drawCols(ents, lay && !lay.rows ? lay : null);

      /* A column whose labels are set in toward the drawing (spec.tuck, 22 Nov 2026 plates refine: the die's labels stood out at
         the width of its pulled-out link, their leaders running a third of the plate to the blocks they name): once the labels
         have their heights, the column moves in to just clear the first ink the drawing has at those heights, and they are laid
         out again there. Until then (and always) a column keeps its labels inside the canvas. */
      function colX(sd) {
        if (tuckX[sd] != null) return tuckX[sd];
        var x = sd === 'l' ? dl - 8 * k : dr + 8 * k;
        if (m.spec.tuck && m.spec.tuck[sd]) x = sd === 'l' ? Math.max(x, 4 + 17 * k + maxW.l) : Math.min(x, w - 4 - 17 * k - maxW.r);
        return x;
      }
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
          var lit = lits[L.ci] = litOf(L.c);
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
                    var Pp = shapePath(L.via || A, ys[i], sd, shape, th); if (!Pp) return;
                    var cc = cost(Pp, lits[L.ci], L.via || A, shape);
                    if (L.via) Pp = [A].concat(Pp);
                    if (!best || cc.v < best.c.v) best = { shape: shape, P: Pp, c: cc };
                  });
                  sh.push(best.shape); ps.push(best.P); total += best.c.v; bad = Math.max(bad, best.c.bad); hits += best.c.hits;
                });
                // (a label that follows its pins round is laid out, like the others, so its leaders cross none at the drawn view: the
                // rest the reader sees under reduced motion and in print; 22 Nov 2026 plates refine)
                shapes.push(sh); paths.push(ps); fans.push(ps); info.push({ text: L.c.text, foreign: L.c.track ? 0 : bad, dims: hits });
                // (a label that follows its pins round keeps near its first pin's height: it moves only to clear a crossing)
                total += Math.abs(ys[i] - L.y0) * (L.c.track ? 0.4 : 0.04) + boxCost(L, ys[i], sd);
              });
              var cr = crossings(paths, placed);
              // (a model may fix the order of a column's numbered labels, top to bottom, spec.order { l, r } on a wide plate and
              // spec.orderNarrow under 560 px: the transistor's spacers over its sheets over its drain, 22 Nov 2026 plates refine)
              var ord = (w < 560 ? m.spec.orderNarrow : m.spec.order) || null, oo = ord && ord[sd];
              if (oo) { var yn = {}; list.forEach(function (L, i) { if (L.c.n) yn[L.c.n] = ys[i]; }); for (var q = 1; q < oo.length; q++) if (yn[oo[q - 1]] != null && yn[oo[q]] != null && yn[oo[q - 1]] > yn[oo[q]]) total += 600; }
              return { v: total + 90 * cr, ys: ys, shapes: shapes, paths: paths, cross: cr, info: info, fans: fans };
            };
            var want = list.map(function (L) { return L.y0; }), best = evalWant(want), step = ls.fs * 1.3;
            // two labels that follow their towns round (the globe's) take the order whose fans of leaders cross least as drawn
            if (list.length === 2 && list.every(function (L) { return L.c.track; })) {
              var sw = evalWant([want[1], want[0]]);
              if (crossings(sw.fans, []) < crossings(best.fans, [])) best = sw;
            }
            for (var pass = 0; pass < 2; pass++) {
              // (a label may keep level with its dot, c.level: its leader leaves the part straight across, 22 Nov 2026 plates refine:
              // the column's emitter was named by a leader that dropped out of the gun's mouth)
              for (var i = 0; i < list.length; i++) [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5].forEach(function (d) {
                if (list[i].c.level) return;
                var w2 = want.slice(); w2[i] = list[i].y0 + d * step; var r = evalWant(w2);
                if (r.v < best.v - 0.5) { best = r; want = w2; }
              });
              // two labels trade places, each a step past the other's height
              for (var a = 0; a < list.length; a++) for (var b = a + 1; b < list.length; b++) [0, 1, 2].forEach(function (d) {
                if (list[a].c.level || list[b].c.level) return;
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
          if (L.c.track || L.c._flip || L.c.level || L.via) return;
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
          if (L.c.track || L.c._beam || L.c.level || L.via) return;
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
          if (L.c.track || L.c._beam || L.c.level || L.via) return false;
          var mine = best.stats.labels.filter(function (x) { return x.text === L.c.text; })[0], others = [];
          for (var q3 in best.paths) if (+q3 !== L.ci && best.paths[q3] && best.paths[q3].length) others.push(best.paths[q3]);
          if (!mine || (!mine.dims && !crossings([best.paths[L.ci] || []], others))) return false;
          var other = best.side[L.ci] === 'l' ? 'r' : 'l';
          if ((fit.rooms[other] || 0) >= needOf(L)) return false;
          L.c._flip = other; self._refit = true; return true;
        });
        // the tucked columns: the first ink from the canvas's edge inward over each label's band, a dimension's figure included
        var tk = m.spec.tuck;
        if (tk) ['l', 'r'].forEach(function (sd) {
          if (!tk[sd]) return;
          var list = ents.filter(function (L) { return best.side[L.ci] === sd && !L.c.track; }); if (!list.length) return;
          var edgeAt = function (y0, y1) {
            var x = sd === 'l' ? w : 0;
            for (var y = Math.max(0, y0); y <= Math.min(h, y1); y += cs) {
              if (sd === 'l') { for (var xx = 0; xx < x; xx += cs) { var id = at(xx, y); if (id >= 0 || id === -2) { x = xx; break; } } }
              else for (var xr = w; xr > x; xr -= cs) { var id2 = at(xr, y); if (id2 >= 0 || id2 === -2) { x = xr; break; } }
            }
            boxes.forEach(function (b) { if (b[1] < y1 && b[3] > y0) x = sd === 'l' ? Math.min(x, b[0]) : Math.max(x, b[2]); });
            return x;
          };
          var lim = function (b) { var x = sd === 'l' ? Infinity : -Infinity; list.forEach(function (L) { var y = b.y[L.ci], e = edgeAt(y - L.hh / 2 - 6, y + L.hh / 2 + 6); x = sd === 'l' ? Math.min(x, e - 12 * k) : Math.max(x, e + 12 * k); }); return x; };
          var cur = colX(sd), want = lim(best);
          if (sd === 'l' ? want < cur + 4 : want > cur - 4) return;
          tuckX[sd] = want;
          var again = runSides(best.side);
          again.stats.cross = crossAll(again);
          if (again.stats.cross + again.stats.dims <= best.stats.cross + best.stats.dims) best = again;
          // the labels may have moved: the column keeps clear of the ink at their new heights too
          var w2 = lim(best);
          tuckX[sd] = sd === 'l' ? Math.max(cur, Math.min(want, w2)) : Math.min(cur, Math.max(want, w2));
        });
        out.tuck = { l: tuckX.l, r: tuckX.r };
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
              var Pp = shapePath(L.via || A, y, sd, shp ? shp[qi] : 'D', th) || shapePath(L.via || A, y, sd, 'D', th);
              if (L.via) Pp = [A].concat(Pp);
              // a globe's leader that would run through another of its label's pin heads is left out, and the label points at
              // the nearer pin (22 Nov 2026 expert review: on the new rest view the Netherlands' two heads stand level, and the
              // leader to the far one ran through the near one); pointing at the label still lights both
              if (c.track && Pp && Pp.length > 1 && L.pts.some(function (o, oi) {
                if (oi === qi || (L.wts && L.wts[oi] < 0.3)) return false;
                var sx = Pp[1][0] - A[0], sy = Pp[1][1] - A[1], s2 = sx * sx + sy * sy || 1, tt = ((o[0] - A[0]) * sx + (o[1] - A[1]) * sy) / s2;
                return tt > 0.02 && tt < 1 && Math.hypot(A[0] + sx * tt - o[0], A[1] + sy * tt - o[1]) < 6 * k;
              })) return;
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
          // (the gap between labels closes, down to 4 px, where the row would not fit the width with 12)
          var sumW = bw.reduce(function (a, b) { return a + b; }, 0), gp = list.length > 1 ? Math.max(4, Math.min(12, (w - 8 - sumW) / (list.length - 1))) : 12;
          for (var i = 1; i < list.length; i++) { var lo = xs[i - 1] + (bw[i - 1] + bw[i]) / 2 + gp; if (xs[i] < lo) xs[i] = lo; }
          var over = xs[list.length - 1] + bw[list.length - 1] / 2 - (w - 4);
          if (over > 0) { xs[list.length - 1] -= over; for (i = list.length - 2; i >= 0; i--) { var hi = xs[i + 1] - (bw[i + 1] + bw[i]) / 2 - gp; if (xs[i] > hi) xs[i] = hi; } }
          // and a row that still does not fit starts at the left edge rather than leaving it
          var under = 4 - (xs[0] - bw[0] / 2);
          if (under > 0) for (i = 0; i < list.length; i++) xs[i] += under;
          list.forEach(function (L, li) {
            var c = L.c, lx = xs[li], fo = foc && foc.n === c.n && foc.text === c.text, col = fo ? hlC : inkC, lc = fo ? hlC : lineC;
            var la = clamp01(labT * 1.5) * LA, ta = clamp01((labT - 0.3) / 0.7) * (foc && !fo ? 0.45 : 1) * LA;
            var yc = rw === 't' ? edge - 4 - L.hh / 2 : edge + 4 + L.hh / 2, x0 = lx - bw[li] / 2, x1 = lx + bw[li] / 2;
            // (a label that follows its pins round, the globe's, is set back with them, and runs one straight leader from each pin's
            // head to its own top edge)
            var tta = ta;
            if (L.wts) tta *= 0.4 + 0.6 * L.wts.reduce(function (a, b) { return Math.max(a, b); }, 0);
            L.pts.forEach(function (q, qi) {
              var wq = L.wts ? L.wts[qi] : 1;
              if (c.track) {
                var tx2 = Math.max(x0 + 3, Math.min(x1 - 3, q[0])), dx2 = tx2 - q[0], dy2 = edge - q[1], dl2 = Math.hypot(dx2, dy2) || 1, hs = Math.min(4.5 * k, dl2 * 0.5);
                var tp = partial([[q[0] + dx2 / dl2 * hs, q[1] + dy2 / dl2 * hs], [tx2, edge]], la);
                if (tp.length > 1) { g.lines([tp], bgC, 3.2 * k, null, 0.85 * tta * wq, 'round'); g.lines([tp], lc, (fo ? 1 : 0.7) * k, null, Math.max(tta, la * 0.9) * wq, 'round'); }
                return;
              }
              var xe = rt[L.ci] ? rt[L.ci][qi] : null, ux = xe != null ? xe : q[0], head = xe != null ? [[q[0], q[1]], [xe, q[1]]] : [[q[0], q[1]]];
              var cxl = Math.max(x0 + 3, Math.min(x1 - 3, ux)), Pp = head.concat(cxl === ux ? [[ux, edge]] : [[ux, edge], [cxl, edge]]), path = partial(Pp, la);
              if (path.length > 1) { g.lines([path], bgC, 3.2 * k, null, 0.85 * ta, 'round'); g.lines([path], lc, (fo ? 1 : 0.7) * k, null, Math.max(ta, la * 0.9), 'round'); }
              g.circle(q[0], q[1], 2.3 * k, col, bgC, 1.1 * k, la);
            });
            ta = tta;
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
    var fast = !!st.fast && dpr > 1 && typeof document !== 'undefined', out = ctx, odpr = dpr;
    if (fast) {
      var fc = this._fastCv || (this._fastCv = document.createElement('canvas')), fw = Math.ceil(w), fh = Math.ceil(h);
      if (fc.width !== fw || fc.height !== fh) { fc.width = fw; fc.height = fh; }
      ctx = fc.getContext('2d'); dpr = 1;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var g = new CanvasG(ctx, dpr);
    if (this._fitKey !== key || !this._fit) { this.m.callouts.forEach(function (c) { c._lines = null; }); this.ext = null; this._fit = this.fit(w, h, g); this._fitKey = key; }
    var pk = (st.dark ? 'd' : 'l'), pal = this._pal && this._palKey === pk ? this._pal : (this._pal = P.palette(st.el || null, this.m.spec, !!st.dark, false));
    this._palKey = pk;
    var K = st.k == null ? 1 : st.k;
    this.paint({ k: K, w: w, h: h, g: g, pal: pal, fit: this._fit, scale: K < 1 ? 0.975 + 0.025 * easeOut(K * 1.6) : 1, noDims: this.o.noDims, oneDim: this.o.oneDim, noLabels: this.o.noLabels,
      lite: !!st.lite || fast, dyaw: st.dyaw || 0, delev: st.delev || 0, labA: st.labA == null ? 1 : st.labA, pick: !!st.pick, inkK: st.inkK, noShadow: fast, fast: fast });
    if (fast) { out.setTransform(1, 0, 0, 1, 0, 0); out.clearRect(0, 0, out.canvas.width, out.canvas.height); out.imageSmoothingEnabled = true; out.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, ctx.canvas.width * odpr, ctx.canvas.height * odpr); }
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
    var pk = this._pick || [], i, j;
    // the label that names an item: a numbered one first, then the others, in their order. A decal is named by its own label;
    // a solid by its own, or, where its decals were not recorded (lines), by a label that lights one of them
    var list = this.m.callouts.slice().sort(function (a, b) { return (a.n ? 0 : 1) - (b.n ? 0 : 1); }), foci = list.map(function (c) { return P.focusOf(c); });
    var hosts = []; pk.forEach(function (e) { if (e.host && hosts.indexOf(e.host) < 0) hosts.push(e.host); });
    var name = function (it, host) {
      // (a label with the item's own tag first: the dies under test before the wafer they lie on)
      if (it.tag) for (var n0 = 0; n0 < list.length; n0++) { var f0 = foci[n0]; if (f0.tags && f0.tags.indexOf(it.tag) >= 0 && P.lit(f0, it, host)) return list[n0]; }
      for (var n = 0; n < list.length; n++) {
        var f = foci[n];
        if (host ? P.lit(f, it, host) : (P.lit(f, it) || (it.kind === 'solid' && hosts.indexOf(it) < 0 && it.decals.some(function (d) { return d.items.some(function (q) { return P.lit(f, q, it); }); })))) return list[n];
      }
      return null;
    };
    var segD = function (px, py, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / L2)) : 0; return Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy); };
    // how far the pointer is from a recorded item: its outline, its line or its dots
    var gapD = function (q) {
      var dd = Infinity, a, b;
      if (q.pts) for (a = 0, b = q.pts.length - 1; a < q.pts.length; b = a++) dd = Math.min(dd, segD(x, y, q.pts[b], q.pts[a]));
      else if (q.line) for (a = 0; a + 1 < q.line.length; a++) dd = Math.min(dd, Math.max(0, segD(x, y, q.line[a], q.line[a + 1]) - q.r));
      else if (q.dots) q.dots.forEach(function (d) { dd = Math.min(dd, Math.max(0, Math.hypot(d[0] - x, d[1] - y) - q.r)); });
      return dd;
    };
    var smallUnder = function (top) {
      for (var u = top - 1; u >= 0; u--) {
        var q = pk[u]; if (!q.pts || q.beam || !inPoly(x, y, q.pts)) continue;
        var bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
        q.pts.forEach(function (p) { if (p[0] < bx0) bx0 = p[0]; if (p[0] > bx1) bx1 = p[0]; if (p[1] < by0) by0 = p[1]; if (p[1] > by1) by1 = p[1]; });
        if (bx1 - bx0 > 24 || by1 - by0 > 24) return null;
        var qc = name(q.it, q.host); if (qc && !P.focusOf(qc).beam) return qc;
        return null;
      }
      return null;
    };
    var soft;
    for (i = pk.length - 1; i >= 0; i--) {
      var e = pk[i], on = false;
      if (e.line) { for (j = 0; j + 1 < e.line.length && !on; j++) on = segD(x, y, e.line[j], e.line[j + 1]) < e.r; if (on && e.beam) { var sm = smallUnder(i); if (sm) return sm; for (j = 0; j < list.length; j++) if (foci[j].beam) return list[j]; } if (!on || e.beam) continue; }
      else if (e.pts) on = inPoly(x, y, e.pts);
      else for (j = 0; j < e.dots.length && !on; j++) { var d = e.dots[j]; on = Math.abs(d[0] - x) < e.r && Math.abs(d[1] - y) < e.r; }
      if (!on) continue;
      var c = name(e.it, e.host);
      // a decal no label names: the face under it answers. A clear film: what lies under it answers first
      if (e.host) { if (c) return c; continue; }
      if (e.soft) { if (soft === undefined) soft = c; continue; }
      // a face painted with labelled parts, met in a gap between them: the nearest within 10 px answers, so the light holds
      // steady as the pointer crosses the die's blocks
      if (!c && hosts.indexOf(e.it) >= 0) {
        var bd = 10;
        pk.forEach(function (q) {
          if (q.host !== e.it || q.line) return;
          var dd = Infinity, a, b;
          dd = gapD(q);
          if (dd < bd) { var qc = name(q.it, q.host); if (qc) { bd = dd; c = qc; } }
        });
      }
      return c || soft || null;
    }
    // nothing labelled under the pointer: the nearest part within 4 px answers, so a part thinner than the aim (the ingot's seed
    // and neck, a needle) lights from the drawing too
    if (!soft) { var best = 4; pk.forEach(function (q) { if (q.beam) return; var dd = gapD(q); if (dd < best) { var qc = name(q.it, q.host); if (qc) { best = dd; soft = qc; } } }); }
    void self;
    return soft || null;
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

window.PLATE_GLOBE = {"LAND":[[[36,-5.6],[37,-9],[41,-8.9],[43.4,-8.3],[43.4,-1.8],[46.5,-1.2],[48.5,-4.6],[49.5,0.2],[51,1.6],[52,4.2],[53.4,5],[53.6,8.1],[55.4,8.3],[57.6,8.6],[57,10.6],[54.4,11],[54,13.8],[54.4,18.6],[55.7,21],[57.8,22.5],[59.4,24.5],[60,28],[60.5,25],[63,21.5],[65.7,24],[63.5,21],[60.5,18],[58.7,17],[56.2,15.8],[55.4,13],[56.2,12.6],[58,11.5],[59,10.7],[58.1,7],[61,5],[63,7.8],[65,12],[68,15.5],[70.2,20],[71.1,25.5],[69.8,30.5],[66.5,34],[65,36.5],[66.5,40],[68.5,44],[68,53.5],[68.5,66],[73,70],[70.5,73],[71.5,80],[76,95],[74,100],[72.5,106],[73.5,113],[73,125],[71,136],[72.5,142],[70,150],[69.5,161],[66,171],[64.5,178],[66.1,-170],[64.7,-172.8],[64.8,-178],[62.5,179],[61,173],[60,166],[57,162.5],[51.5,157],[54.5,155.5],[59.5,152],[59,143],[53.5,141],[51.5,140.5],[46,138],[43,131.8],[39,127.5],[35.5,129.5],[34.8,126.5],[37.5,126.4],[39.5,124.5],[40,121.5],[38.5,118],[37.5,122.5],[36,120.3],[34.5,119.5],[31.5,121.8],[30,122.2],[27,120.5],[24.5,118.2],[23,116.5],[22,113.5],[21.5,110.5],[20.5,109.8],[21.5,108],[18.5,106.5],[16,108.2],[12.5,109.3],[10,106.5],[9,105],[10.5,103.2],[11.5,103],[13.5,100.5],[12.5,100],[10,99.5],[7.5,99.8],[5.5,100.3],[2.5,102],[1.3,103.8],[3.5,101.5],[6.5,99.8],[9.5,98.5],[12,98.5],[16,97.5],[16.5,94.7],[20,92.8],[21.5,90],[22.5,89],[21.5,87],[19.5,85.5],[16,81.2],[13,80.3],[10,79.9],[8.1,77.5],[10,76],[13,74.7],[15.5,73.8],[19,72.8],[21,72.6],[22.5,69],[23,68],[24.5,67],[25,63],[25.4,60],[25.5,57.5],[26.5,56.4],[27.5,56.5],[28.5,51],[30,48.5],[29.5,48.4],[27.5,50],[25.5,51.5],[24.6,53],[24.4,54.4],[25.5,55.5],[26.2,56.4],[24.5,57.5],[22,59.8],[19,57.8],[17,55],[14.5,50],[12.7,45],[13.5,43.5],[16,42.5],[19,41],[21.5,39.2],[24.5,37.2],[27.5,34.5],[29.5,34.9],[31.2,32.3],[31.5,34.5],[34.7,36],[36.5,36],[36.8,34],[36,30.5],[36.8,28.2],[38.5,26.5],[40.3,26.2],[40.5,23],[38,23.7],[36.8,23],[37.9,21.1],[39.5,20],[41.9,19.3],[44,15.2],[45.6,13.6],[45,12.5],[42.5,14],[40.5,18],[39.8,18.4],[40,17],[38,15.6],[38.2,15.5],[40.5,14.2],[41.8,12.4],[43.5,10.3],[44.4,8.8],[43.5,7.6],[43.4,4.8],[42.5,3.2],[41.2,2.2],[39.5,0.2],[37.6,-0.8],[36.7,-4.4],[36,-5.6]],[[41.2,29.1],[42,35],[41.6,41.6],[43.4,40],[44.6,37.9],[45.3,36.6],[46.5,37.5],[47.1,38.3],[46,35],[46.6,31.5],[45.3,29.7],[44,28.7],[42.5,27.9],[41.2,29.1]],[[47,52],[45,53.5],[41.5,52.5],[38,53.5],[36.8,54],[37,50],[39,49],[41,49.5],[43,47.5],[45,47.5],[46.7,49],[47,52]],[[37.3,9.8],[36.8,11.1],[33.5,11.5],[32.5,15],[31,20],[31.5,25],[31.4,30.2],[31.2,32.3],[29,32.6],[27,33.8],[24,35.5],[20.5,37],[18,38.5],[15.5,40],[12.7,43.3],[11,44.5],[11.5,51.3],[8,49.5],[5,48.5],[2,45.5],[-1,42.5],[-4.5,39.5],[-7.5,39.5],[-10.5,40.5],[-14.5,40.7],[-18,36.5],[-20.5,35],[-24,35.5],[-26,33],[-29.5,31.5],[-32,29],[-34,25.5],[-34.8,20],[-33.9,18.4],[-31,17.5],[-28,16.5],[-24,14.5],[-20,13],[-17,11.8],[-12.5,13.4],[-9,13],[-6,12.2],[-4.8,11.8],[-1,9.3],[2,9.5],[3.8,8.5],[4.5,6],[6.4,3.4],[5.8,0.5],[4.8,-2],[4.5,-5.5],[5,-7.5],[4.7,-10],[6.5,-11.5],[8.5,-13.3],[10.7,-15],[13.5,-16.8],[15.5,-16.5],[19,-16.3],[21.5,-17],[25,-14.8],[27.5,-13],[30,-9.8],[32,-9.3],[35,-6],[35.8,-5.3],[35,-2],[36.5,3],[37,7],[37.3,9.8]],[[66,-166],[65.5,-168],[63,-165.5],[60.5,-165],[59,-162],[58.5,-158],[55.5,-160.5],[54.5,-163],[57,-156],[59,-152],[60,-148],[59.5,-140],[56.5,-134],[52,-128],[49.5,-125],[46.2,-124],[42,-124.4],[38,-123],[34.5,-120.6],[32.7,-117.2],[30.5,-116],[28,-114],[23,-110],[24,-110.5],[27,-112.5],[31.5,-114.6],[29,-111],[25.5,-109],[23,-106],[19,-104.5],[16.5,-98.5],[15,-94.5],[13.5,-91],[12,-87],[9.5,-84.5],[8,-79],[9.5,-79.5],[10.5,-83.5],[15,-83.5],[17.5,-88.3],[21.5,-87],[21.5,-90],[19,-95.5],[22.5,-97.8],[26,-97.2],[29.7,-95],[29.2,-89.5],[30.4,-87],[27.8,-82.7],[25.2,-81],[27,-80.2],[30.5,-81.4],[33.7,-78.9],[35.2,-75.5],[38.8,-74.9],[41.3,-71.9],[42,-70],[44,-68.9],[45.3,-66],[45,-61.5],[47,-60],[48.5,-58.5],[49.5,-55.5],[51.5,-56],[53,-56],[55.5,-60.5],[58.5,-63],[60,-64.5],[62.5,-73.5],[60.5,-77.5],[57,-77],[55,-82.5],[53.5,-82],[55.5,-85.5],[58.5,-92.5],[60,-94.5],[61.5,-93],[63.5,-90.5],[64,-87],[66.5,-86.5],[68,-90],[68.5,-97],[69.5,-105],[68,-113],[69.5,-122],[70,-128],[69.5,-135],[70.5,-145],[71.3,-156.5],[68.5,-166],[66,-166]],[[8,-77],[6,-77.5],[2,-79],[-1,-80.8],[-5,-81.2],[-8,-79],[-12,-77],[-16,-73.5],[-18.5,-70.5],[-23.5,-70.5],[-27,-71],[-33,-71.7],[-37,-73.5],[-41.5,-74],[-45.5,-75],[-49.5,-75.5],[-53,-73.5],[-55.9,-67.3],[-52.5,-69],[-50,-68.5],[-46.5,-67],[-42.5,-64],[-40,-62.3],[-38,-57.5],[-35,-56],[-33,-53.5],[-30,-50.5],[-26,-48.5],[-23,-43.2],[-20.5,-40.3],[-17.5,-39],[-13,-38.5],[-9,-35.2],[-5,-35.5],[-2.5,-40],[-2.5,-44],[-1,-47],[0.5,-50],[4,-51.7],[6,-57.5],[8.5,-60],[10.5,-62],[10.7,-66],[12.2,-70],[11.5,-72.5],[9.4,-76],[8,-77]],[[-11,131],[-12.5,132.5],[-11.2,136.7],[-13.5,136],[-16.5,139.5],[-17.5,140.8],[-14,141.6],[-10.7,142.5],[-14.5,144.5],[-19,146.8],[-22,150],[-25.5,153],[-30,153.4],[-34.5,151.3],[-37.8,149.9],[-38.8,146],[-38,144.5],[-35.5,138.5],[-32.5,137.8],[-34,135.5],[-31.5,131],[-33.5,124],[-35,118],[-33.5,115],[-31.9,115.8],[-28,114],[-24,113.4],[-21.5,115],[-20,118.5],[-17.5,122],[-16,123.5],[-14.5,126.5],[-13.5,129.5],[-11,131]],[[-40.7,144.7],[-41,148.3],[-43.5,147],[-43,145.5],[-40.7,144.7]],[[-34.5,172.8],[-36.5,174.8],[-37.5,178.5],[-39.3,177],[-41.3,175],[-39.5,174],[-38,174.8],[-36.5,174.4],[-34.5,172.8]],[[-40.5,172.7],[-41.5,174.3],[-44,173],[-46.6,169.7],[-45.9,166.5],[-44,168.4],[-42,171],[-40.5,172.7]],[[34.6,135],[34.7,138],[35.6,140.1],[36.9,141],[38.3,141.5],[39.5,142],[41.4,141.4],[41.2,140.3],[40,139.9],[38.5,139.5],[37.2,136.9],[35.7,135.5],[35.5,132.9],[34.4,131],[34,131],[34.3,132.5],[34.7,134.5],[34.6,135]],[[41.5,140.2],[42.9,141.5],[45.5,141.9],[44.3,145.3],[43.3,145.6],[42,143.2],[41.8,140.7],[41.5,140.2]],[[33.9,130.9],[33.3,131.8],[31.6,131.5],[31,130.3],[32.6,129.7],[33.5,129.9],[33.9,130.9]],[[34.3,134.7],[33.5,134.3],[33,132.5],[33.9,132.6],[34.3,134.7]],[[25.3,121.6],[24.5,121.9],[22.7,121.1],[22,120.7],[23.1,120.1],[24.5,120.5],[25.3,121.6]],[[20.1,110],[18.2,109.7],[18.5,108.7],[20,108.8],[20.1,110]],[[50.1,-5.7],[51.6,-4.2],[52.9,-4.7],[54.1,-3.1],[55,-5],[56.5,-6],[58.6,-5],[58.6,-3],[57.5,-1.8],[56,-2.6],[54.6,-1.1],[52.9,0.4],[51.4,1.4],[50.7,-1.9],[50.1,-5.7]],[[51.5,-9.5],[53.3,-9.9],[54.3,-8.5],[55.3,-7.3],[54.7,-5.6],[53.4,-6.1],[52.2,-6.4],[51.5,-9.5]],[[63.4,-19],[63.8,-22.7],[65,-22.7],[66.3,-23.2],[66.5,-18],[65.6,-14.5],[64.3,-14.5],[63.4,-19]],[[59.8,-43.9],[62.5,-49.5],[65.5,-52.5],[68.5,-53.5],[71.5,-55.5],[74,-57],[76.5,-70],[78.5,-73],[81.5,-62],[83,-33],[81,-20],[77,-19],[73,-21.5],[70,-22],[66,-35],[62,-42],[59.8,-43.9]],[[-12,49.3],[-15.5,50.5],[-19,49.5],[-23.5,47.8],[-25.5,45.2],[-22,43.3],[-18,44.3],[-15,46.3],[-12,49.3]],[[9.8,80.2],[7,79.8],[6,80.2],[6.5,81.8],[9,81.2],[9.8,80.2]],[[23.2,-81.5],[22,-84.9],[21.9,-77.5],[20.3,-74.2],[21.5,-76.5],[23.2,-81.5]],[[5.6,95.3],[2,96.5],[-1.5,100.3],[-5,103],[-5.9,105.9],[-3.5,104.5],[-1,103.5],[1.5,102.5],[4,98.3],[5.6,95.3]],[[-6,105.6],[-6.9,109],[-6.9,112.7],[-8.4,114.4],[-8.6,111],[-7.7,107.5],[-6,105.6]],[[7,117],[4.2,118.6],[1,117.6],[-2,116.3],[-4,114.5],[-3.5,111.5],[-1,109.5],[1.5,109],[4,113],[5,115.2],[7,117]],[[1.5,125.2],[0.5,120.5],[-2,120.3],[-5.5,119.4],[-5.7,122.5],[-3.5,123],[-1.5,123],[0,121.5],[1.5,125.2]],[[-0.8,131],[-2,134.2],[-3.5,136],[-5.5,138],[-8.5,140],[-9.5,147],[-10.5,150.8],[-8,148],[-5.5,145.5],[-3.5,142],[-2.5,138.5],[-1.5,133.5],[-0.8,131]],[[18.6,120.8],[16,119.8],[14.3,120.2],[13.8,123],[15.5,121.5],[17.5,122.3],[18.6,120.8]],[[9.8,124],[7,124],[5.9,125.4],[7.3,126.5],[9.8,126],[9.8,124]]],"ANT":[[-180,-78.5],[-160,-78],[-150,-75],[-135,-74.2],[-120,-73.8],[-100,-73.2],[-80,-73],[-70,-68],[-63,-65],[-57,-63.4],[-50,-66.5],[-42,-75],[-33,-77.6],[-25,-76],[-14,-71.5],[-5,-70.2],[4,-69.8],[14,-70.2],[26,-69.8],[36,-68.8],[46,-67.2],[56,-66.8],[66,-68.4],[76,-67],[88,-66.4],[100,-66.5],[112,-66.4],[124,-66.6],[136,-66],[146,-68.5],[156,-71.5],[166,-76.5],[174,-78.4],[180,-78.5]],"HOLES":[1,2],"SITES":[["Veldhoven",51.42,5.4,5],["Oberkochen",48.78,10.1,5],["Hsinchu",24.8,120.97,5],["Tainan",22.99,120.21,5],["Kaohsiung",22.63,120.3,5],["Icheon",37.28,127.44,5],["Pyeongtaek",36.99,127.11,5],["Kumamoto",32.8,130.71,5],["Yokkaichi",34.97,136.62,5],["Tokyo",35.68,139.69,4],["Shanghai",31.23,121.47,5],["Penang",5.41,100.34,4],["Singapore",1.35,103.82,4],["Bengaluru",12.97,77.59,4],["Abu Dhabi",24.45,54.38,4],["Hillsboro",45.52,-122.99,5],["Phoenix",33.45,-112.07,5],["Austin",30.27,-97.74,4],["Boise",43.62,-116.2,5]],"SUBS":[["Beijing",39.9,116.4],["Wuhan",30.59,114.31],["Shenzhen",22.54,114.06],["Hefei",31.82,117.23],["Dresden",51.05,13.74]]};
/* plates/boule-and-wafer.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   02 Silicon: the ingot and two wafers, in metres. The wafers slide out sideways from where they were sawn from the body.
   True sizes: the body and the wafers 300 mm across (the chapter's 300 mm wafers), each wafer 775 micrometres thick (SEMI M1,
   the standard for polished 300 mm wafers; 22 Nov 2026 review: they were drawn 4 mm thick under "Drawn to scale").
   The length, the crown, the tail, the seed and the neck have no allowed source for their sizes, so they are drawn for
   illustration and carry no figures (the caption says so; the 2.1 m dimension is gone). Colours (the set's legend,
   22 Nov 2026): the wafers in silicon slate, as on every plate.
   22 Nov 2026 expert review: silicon is slate across the set, so the ingot is drawn in the wafers' slate, and with it the
   neck and the seed, which are the same silicon crystal (they were gray, as if another material). The notch is drawn for
   illustration too, and the caption says so.
   22 Nov 2026 plates refine: the ingot is bulk silicon seen whole, so it is drawn near white with a cool tint and an ink
   silhouette, with the heavy ring of the ground band back at the crown's join; the wafers, cut faces of the crystal, are solid
   slate with ink rims, at their true thickness. The saw cuts are at about the middle of the body, so the wafers balance it
   (they were near its foot). No length figure (none is sourced), and no 775 um dimension (chapter 2's text does not give it).
   Round two (expert FIX-2): the ingot, the neck and the seed are one crystal with the wafers, so they are drawn in the wafers'
   slate again; under the refined renderer (a colour keeps itself on top faces, ink outlines) the slate body reads crisp, where
   it read washed out under the old one. params.ingot 'white' draws the near-white body instead (an image only, to compare).
   The Wafers label stands 40 px higher (dy), so its leaders run clear of the second wafer. */
R('boule-and-wafer', function (m, params) {
  var Rb = 0.15, wT = 0.000775 / 2, yTip = -0.71, yB0 = -0.45, yB1 = 1.05, Rc = Rb * 1.03;
  var ing = m.part('ingot', { ex: [0, 0, 0], seq: 0 });
  m.real('siIngot');
  // the crystal's slate: the wafers' tone, on a turned surface
  var white = params && params.ingot === 'white', SI = white ? { d: 0.08, c: 'acc', curve: true } : 'accTurned', SI_FLAT = white ? 'accLight' : 'acc';
  var prof = [[0, yTip], [0.038, yTip], [0.078, yTip + 0.045, 0], [0.110, yTip + 0.095, 0], [0.133, yTip + 0.16, 0], [0.146, yTip + 0.215, 0], [Rb, yB0]];
  // growth striations on the ground body, as fine rings, and the two saw cuts the wafers came from
  var cuts = [0.22, 0.28];
  prof.push([Rb, yB1]); prof.push([Rc, yB1]); prof.push([Rc, yB1 + 0.018]);
  [[0.992, 1.105], [0.972, 1.145], [0.936, 1.185], [0.880, 1.225], [0.800, 1.265], [0.690, 1.303], [0.545, 1.338], [0.370, 1.368], [0.185, 1.390]].forEach(function (q) { prof.push([Rc * q[0], q[1], 0]); });
  prof.push([0, 1.40]);
  // the ingot, the neck and the seed are solids of their own, so each lights alone when its part is pointed at
  m.tag('ingot');
  // (lip: the ring where the crown's ground band stands proud of the body keeps its shade weight)
  // (round 2: crown and tail resampled along a smooth curve, so their tone runs smoothly)
  prof = (function (p) {
    var out = [p[0]], cr = function (a, b, c, d, t) { var t2 = t * t, t3 = t2 * t; return [0, 1].map(function (i) { return 0.5 * (2 * b[i] + (-a[i] + c[i]) * t + (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * t2 + (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * t3); }); };
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], smooth = b[2] === 0 && a[2] !== 1 && i > 1;
      if (smooth) { var pa = p[i - 2], pb = p[i + 1] || b; for (var s = 1; s < 4; s++) { var q = cr(pa, a, b, pb, s / 4); out.push([q[0], q[1], 0]); } }
      out.push(b);
    }
    return out;
  })(prof);
  m.revolve(prof, SI, { seg: 96, lip: true });
  // (four faint growth ridges along the body)
  [0.3, 1.87, 3.44, 5.01].forEach(function (an) { m.wire([[Rb * 1.002 * Math.cos(an), yB0 + 0.03, Rb * 1.002 * Math.sin(an)], [Rb * 1.002 * Math.cos(an), yB1 - 0.03, Rb * 1.002 * Math.sin(an)]], { lw: 0.6, alpha: 0.4, real: 'siIngot' }); });
  m.tag('neck');
  m.cyl([0, 1.465, 0], 0.0052, 0.13, SI, { seg: 12 });
  // the saw cuts: the slab the wafers came from, dashed round the body
  m.tag('ingot');
  cuts.forEach(function (cy) { m.wire(H.ring(0, cy, 0, Rb * 1.004, 48), { lw: 0.6, dash: [3, 2], alpha: 0.85, c: [0, cy, 0.2] }); });
  m.tag('seed');
  m.box({ c: [0, 1.565, 0], s: [0.015, 0.07, 0.015] }, SI_FLAT);
  m.tag(null);
  m.real('steelDk');
  m.cyl([0, 1.6225, 0], 0.026, 0.045, 'turnedDark', { seg: 20 });
  m.anchor(1, 'Seed', [0, 1.565, 0]); m.anchor(2, 'Neck', [0, 1.465, 0]); m.anchor(3, 'Ingot', [-0.05, 0.62, Rb * 0.8]);
  // the two wafers, as thick as they are, each with its notch
  function waferShape() { var s = []; for (var k = 0; k < 64; k++) { var a = k * TAU / 64; if (k === 16) { s.push([0.009, Rb * 0.998]); s.push([0, Rb - 0.01]); s.push([-0.009, Rb * 0.998]); continue; } s.push([Rb * Math.cos(a), Rb * Math.sin(a)]); } return s; }
  var ws = waferShape();
  var w1 = m.part('wafer1', { ex: [0.40, 0, 0], seq: 1 });
  m.real('siWafer');
  m.prism(ws, cuts[0] - wT, cuts[0] + wT, 'acc', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[0] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  var w2 = m.part('wafer2', { ex: [0.80, 0, 0], seq: 2 });
  m.prism(ws, cuts[1] - wT, cuts[1] + wT, 'acc', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[1] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  m.anchor(4, 'Wafers', [[0.40, cuts[0], 0.0], [0.80, cuts[1], 0.0]], null);
  m.anchors[3].part = w1.idx; m.anchors[3].at = [[0, cuts[0] + wT, Rb * 0.5]]; m.anchors[3].multi = [[w2.idx, [0, cuts[1] + wT, Rb * 0.5]]];
  m.guide([[0, cuts[0], 0, ing.idx], [0, cuts[0], 0, w1.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[1], 0, ing.idx], [0, cuts[1], 0, w2.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[0], Rb, ing.idx], [0, cuts[0], Rb, w1.idx]], { alpha: 0.8 });
  m.guide([[0, cuts[1], -Rb, ing.idx], [0, cuts[1], -Rb, w2.idx]], { alpha: 0.8 });
  // review: the diameter is taken rim to rim across the wafer's centre (it was taken off the corners of the square round
  // the wafer, so its extension lines started in the air beside the disc)
  m.dim([-Rb, cuts[1] - wT, 0], [Rb, cuts[1] - wT, 0], [0, -0.1, 0], '300 mm', { part: w2.idx });
  return { noGround: true, elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [1, 0, 0], calloutOpts: { 1: { tag: 'seed' }, 2: { tag: 'neck' }, 3: { tag: 'ingot' }, 4: { dy: -40 } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate boule-and-wafer.js failed to load', e);}
/* plates/cowos-exploded.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   10 Advanced Packaging: a CoWoS-L package as used for Nvidia's B200, pulled apart along its stacking axis, in millimetres.
   Footprints are this site's own estimate for the B200 (data/landscape-layouts.json, marked estimated): logic dies 26 x 32.5
   at x +-13.5, HBM stacks 11 x 11 at x +-33.5 and z +-5.9 and +-17.7, interposer 78 x 50, substrate 95 x 68. The caption
   says they are estimates. Thicknesses and gaps are exaggerated, as the caption says.
   22 Nov 2026 review:
   - the interposer of CoWoS-L is redistribution wiring with small silicon bridges set in it (chapter 10, TSMC's 2025 annual
     report), so it is drawn in ink with its copper wiring, and the bridges, the "L", are drawn in silicon slate and labelled;
   - no dots in mid-air: the microbumps are pad grids on the interposer's face under each chip, the C4 bumps a pad grid on the
     substrate's face under the interposer, and the solder balls one row of ring dots along the substrate's visible foot;
   - the footprints were 26 x 32, 11 x 12, 82 x 53 and 100 x 72 under "to scale".
   Colours (the set's legend): silicon slate (the bridges), copper (wiring and pads).
   22 Nov 2026 plates refine: the layers stand as far apart as the first plates had them (interposer 32, chips 56), so the
   package fills its slot; each bridge stands over its pocket, the pocket dashed in ink with trace lines from the bridge's
   corners down to it; the wiring is straight parallel bundles of copper traces, die to memory across each bridge and a dense
   bundle across the seam between the dies; the pad grids keep to the chips' footprints, thinner.
   Round two (expert FIX 1): the bridges carry the die-to-die and die-to-memory wiring, so the traces lie on each bridge's top
   face, a pad at each end (12 across the seam bridge at 2 mm, 4 across each memory bridge at 1 mm); the interposer's traces
   stop at each pocket's edge and run on to pads under the chips. The pockets are a plain hairline, so nothing reads as a cut
   face. The count is not a claim.
   24 Nov 2026 expert accuracy review (D2): the B200's 192 GB is eight stacks of 24 GB, Micron's eight-high HBM3E, so each
   stack is drawn eight layers high (it was twelve, the 36 GB part). */
R('cowos-exploded', function (m) {
  var dieW = 26, dieD = 32.5, dieX = 13.5, hbmW = 11, hbmD = 11, hbmX = 33.5, hbmZ = [-17.7, -5.9, 5.9, 17.7];
  var ipW = 78, ipD = 50, subW = 95, subD = 68;
  var subH = 5, ipH = 3, dieH = 2.2, hbmH = 2.8;
  var dies = [[-dieX, 0], [dieX, 0]], hbm = [];
  hbmZ.forEach(function (z) { hbm.push([-hbmX, z]); hbm.push([hbmX, z]); });

  // 1 the substrate, with the capacitors round the interposer's seat, the C4 pads on the seat, and a row of solder balls along
  // its two near edges, underneath
  var pS = m.part('substrate', { ex: [0, 0, 0], seq: 0 });
  var capItems = [];
  for (var q = 0; q < 30; q++) {
    var cu = (q - 14.5) * (subW * 0.94 / 30);
    if (Math.abs(cu) > ipW / 2 + 2) continue;
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(cu - 0.9, sg * (ipD / 2 + 3.2) - 1.1, cu + 0.9, sg * (ipD / 2 + 3.2) + 1.1, subH / 2, { fill: 'dark', lw: 0.4, real: 'mlcc' })); [-1, 1].forEach(function (e) { capItems.push(D.rect(cu - 0.9, sg * (ipD / 2 + 3.2) + e * 1.1 - (e > 0 ? 0.42 : 0), cu + 0.9, sg * (ipD / 2 + 3.2) + e * 1.1 + (e < 0 ? 0.42 : 0), subH / 2, { fill: 'light', lw: 0.25, real: 'sac' })); }); });
  }
  for (q = 0; q < 18; q++) {
    var cv = (q - 8.5) * (subD * 0.92 / 18);
    if (Math.abs(cv) > ipD / 2 + 2) continue;
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(sg * (ipW / 2 + 3.2) - 1.1, cv - 0.9, sg * (ipW / 2 + 3.2) + 1.1, cv + 0.9, subH / 2, { fill: 'dark', lw: 0.4, real: 'mlcc' })); [-1, 1].forEach(function (e) { capItems.push(D.rect(sg * (ipW / 2 + 3.2) + e * 1.1 - (e > 0 ? 0.42 : 0), cv - 0.9, sg * (ipW / 2 + 3.2) + e * 1.1 + (e < 0 ? 0.42 : 0), cv + 0.9, subH / 2, { fill: 'light', lw: 0.25, real: 'sac' })); }); });
  }
  capItems.push(D.rect(-ipW / 2, -ipD / 2, ipW / 2, ipD / 2, subH / 2, { dash: [3, 2], lw: 0.6, alpha: 0.8 }));
  capItems.push({ dots: gridPts(18, 11, 3.8, 3.8, subH / 2, 0, 0), r: 0.5, col: 'acc2', alpha: 0.75, tag: 'c4', real: 'sac' });
  capItems.push(D.rect(-subW / 2 + 2.5, -subD / 2 + 2.5, subW / 2 - 2.5, subD / 2 - 2.5, subH / 2, { lw: 0.45, alpha: 0.5 }));
  m.real('subMask');
  m.box({ c: [0, subH / 2, 0], s: [subW, subH, subD], decals: { py: capItems }, fmat: { px: { d: 0.11, real: 'core' }, nx: { d: 0.11, real: 'core' }, pz: { d: 0.11, real: 'core' }, nz: { d: 0.11, real: 'core' } } }, 'steel');
  var balls = [];
  for (var bx = -subW / 2 + 2; bx <= subW / 2 - 1.9; bx += 2.5) balls.push([bx, -0.75, subD / 2 - 1.5]);
  for (var bz = -subD / 2 + 2; bz <= subD / 2 - 3.9; bz += 2.5) balls.push([subW / 2 - 1.5, -0.75, bz]);
  m.dots(balls, { r: 1.0, ring: true, alpha: 0.75, front: true, c: [subW / 2, -0.75, subD / 2], real: 'sac' });
  m.anchor(4, 'Substrate', [-subW / 2 + 16, subH * 0.15, subD / 2]);
  // 2 the interposer: redistribution wiring in ink, its copper lines, the microbump pads under each chip and, set into it, the
  // silicon bridges
  var pI = m.part('interposer', { ex: [0, 32, 0], seq: 1 });
  var y0 = subH, yT = ipH / 2, wiring = [];
  // the bridges: one under the seam between the dies, one under each memory joint
  var BR = [[0, 0, 9, dieD * 0.82]];
  hbm.forEach(function (h) { var sg = h[0] < 0 ? -1 : 1; BR.push([sg * (dieX + dieW / 2 + 1.6), h[1] * 0.8, 6, 5]); });
  // each bridge's traces, in (x, z) across it: 12 on the seam bridge at 2 mm, 4 on each memory bridge at 1 mm
  var traces = function (b, i) { var n = i ? 4 : 12, pt = i ? 1 : 2, out = []; for (var t = 0; t < n; t++) out.push(b[1] + (t - (n - 1) / 2) * pt); return out; };
  var pad = function (x, z, y, sz) { return D.rect(x - sz / 2, z - sz / 2, x + sz / 2, z + sz / 2, y, { fill: { d: 0.62, c: 'acc2', real: 'cu' }, col: 'acc2', lw: 0.3, real: 'cu' }); };
  // the interposer's traces stop at each pocket's edge and run on to a pad under the chip: from the seam bridge out to 11 mm, from
  // each memory bridge 1 mm on either side
  BR.forEach(function (b, i) {
    traces(b, i).forEach(function (z) {
      [-1, 1].forEach(function (sd) {
        var x0 = b[0] + sd * b[2] / 2, x1 = i ? x0 + sd * 1.2 : sd * 11;
        wiring.push(D.line([x0, yT, z], [x1, yT, z], { col: 'acc2', lw: 0.6, real: 'cu' }));
        wiring.push(pad(x1, z, yT, i ? 0.7 : 0.9));
      });
    });
  });
  // (the pad grids keep inside each chip's footprint, clear of the bridges' pockets and the bundles, and thinner)
  var clear = function (x, z) { return !BR.some(function (b) { return Math.abs(x - b[0]) < b[2] / 2 + 2 && Math.abs(z - b[1]) < b[3] / 2 + 1.2; }) && !(Math.abs(x) < 12.5 && Math.abs(z) < 12.5); };
  dies.forEach(function (d) { wiring.push(D.rect(d[0] - dieW / 2, d[1] - dieD / 2, d[0] + dieW / 2, d[1] + dieD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(6, 8, 3.4, 3.6, yT, d[0], d[1], clear), r: 0.45, col: 'acc2', alpha: 0.8, tag: 'ubump', real: 'cu' }); });
  hbm.forEach(function (h) { wiring.push(D.rect(h[0] - hbmW / 2, h[1] - hbmD / 2, h[0] + hbmW / 2, h[1] + hbmD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(3, 3, 2.6, 2.6, yT, h[0] + (h[0] < 0 ? -1 : 1) * 1.2, h[1], clear), r: 0.45, col: 'acc2', alpha: 0.8, tag: 'ubump', real: 'cu' }); });
  // each bridge's pocket in the interposer's face, a plain hairline
  BR.forEach(function (b) { wiring.push(D.rect(b[0] - b[2] / 2, b[1] - b[3] / 2, b[0] + b[2] / 2, b[1] + b[3] / 2, yT, { lw: 0.5, alpha: 0.5 })); });
  m.tag('ip'); m.real('pi');
  m.box({ c: [0, y0 + ipH / 2, 0], s: [ipW, ipH, ipD], decals: { py: wiring }, fmat: { px: { d: 0.3, real: 'mould' }, nx: { d: 0.3, real: 'mould' }, pz: { d: 0.3, real: 'mould' }, nz: { d: 0.3, real: 'mould' } } }, 'light');
  m.tag(null);
  m.anchor(3, 'Interposer', [ipW / 2, y0 + ipH, ipD / 4]);
  var pB = m.part('bridges', { ex: [0, 44, 0], seq: 2 });
  m.tag('bridge'); m.real('siFace');
  // each bridge with its traces across its top face, a pad at each end
  BR.forEach(function (b, i) {
    var top = [];
    traces(b, i).forEach(function (z) { var zz = z - b[1], xe = b[2] / 2 - 0.55; top.push(D.line([-xe, 0.6, zz], [xe, 0.6, zz], { col: 'acc2', lw: 0.6, real: 'cu' })); top.push(pad(-xe, zz, 0.6, i ? 0.6 : 0.8), pad(xe, zz, 0.6, i ? 0.6 : 0.8)); });
    m.box({ c: [b[0], y0 + ipH - 0.6, b[1]], s: [b[2], 1.2, b[3]], decals: { py: top } }, 'acc');
  });
  m.tag(null);
  m.anchor(5, 'Silicon bridges', [BR[5][0] - BR[5][2] / 2, y0 + ipH - 0.6, BR[5][1]], pB.idx);
  // 3 the chips: two logic dies (their ground silicon backs, plain), eight HBM stacks with their eight layers
  var pK = m.part('chips', { ex: [0, 56, 0], seq: 3 });
  var yK = y0 + ipH;
  m.tag('logic'); m.real('siBack');
  dies.forEach(function (d) {
    m.box({ c: [d[0], yK + dieH / 2, d[1]], s: [dieW, dieH, dieD] }, 'steel');
  });
  m.tag('hbm'); m.real('siBack');
  hbm.forEach(function (h) {
    var side = [];
    for (var k = 1; k < 8; k++) {
      var yy = -hbmH / 2 + hbmH * (k + 0.6) / 8.6;
      side.push(D.line([-hbmW / 2, yy, hbmD / 2], [hbmW / 2, yy, hbmD / 2], { lw: 0.35, alpha: 0.75 }));
    }
    var sideX = side.map(function (it) { return { pts: [[hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNX = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [-hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNZ = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], -hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    m.box({ c: [h[0], yK + hbmH / 2, h[1]], s: [hbmW, hbmH, hbmD], fmat: { px: { d: 0.3, real: 'mould' }, nx: { d: 0.3, real: 'mould' }, pz: { d: 0.3, real: 'mould' }, nz: { d: 0.3, real: 'mould' } }, decals: { pz: side, px: sideX, nx: sideNX, nz: sideNZ, py: [D.rect(-hbmW / 2 + 1.2, -hbmD / 2 + 1.2, hbmW / 2 - 1.2, hbmD / 2 - 1.2, hbmH / 2, { lw: 0.4, alpha: 0.6 })] } }, 'steel');
  });
  m.tag(null);
  m.anchor(1, 'Logic dies', [dieX - dieW * 0.38, yK + dieH, -dieD * 0.36]);
  m.anchor(2, 'HBM stacks', [hbmX, yK + hbmH, hbmZ[2]]);
  // guides between the layers: the chips' corners down to their seats, the interposer's down to its seat
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (dieX + dieW / 2), y0 + ipH, c[1] * dieD / 2, pI.idx], [c[0] * (dieX + dieW / 2), yK, c[1] * dieD / 2, pK.idx]], { alpha: 0.9 });
    m.guide([[c[0] * ipW / 2, subH, c[1] * ipD / 2, pS.idx], [c[0] * ipW / 2, y0, c[1] * ipD / 2, pI.idx]], { alpha: 0.9 });
  });
  // and each bridge's two front corners down to its pocket
  BR.forEach(function (b) { [[-1, 1], [1, 1]].forEach(function (c) { var bx2 = b[0] + c[0] * b[2] / 2, bz2 = b[1] + c[1] * b[3] / 2; m.guide([[bx2, y0 + ipH, bz2, pI.idx], [bx2, y0 + ipH - 1.2, bz2, pB.idx]], { alpha: 0.9 }); }); });
  m.guide([[0, -6, 0, pS.idx], [0, yK + 12, 0, pK.idx]], { style: 'axis', alpha: 0.9 });
  return {
    elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], thumbX: 0.75,
    calloutOpts: { 1: { tag: 'logic', side: 'r' }, 2: { tag: 'hbm', side: 'r' }, 3: { tag: 'ip', side: 'r' }, 4: { side: 'l' }, 5: { tag: 'bridge', side: 'l' } },
    accent: [111, 139, 166], accentDark: [195, 211, 226], accent2: [176, 102, 44], accent2Dark: [224, 154, 92]
  };
});

})(window.PLATE);}catch(e){console.warn('plate cowos-exploded.js failed to load', e);}
/* plates/die-floorplan.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   01 Design, option 2 (four plates, round 3, 24 Nov 2026, night): one design, many dies. A 300 mm wafer with the die grid at the
   true 26 x 33 mm field (plain geometry: no count is given or drawn as a figure), under one lamp: one broad static band of four
   hues in spectral order (violet, blue, green, yellow) at up to 39 percent, on the die grid only, the edge ring and notch plain
   silicon (the expert's round 3 rulings, section 2). Each die on the wafer carries its floorplan small. One die is lifted out of
   its seat and drawn larger, in option 1's die-photo look, dashed lines from its seat's corners. From the round 3 concept board
   (01-B), kept by the owner. */
(function () {
  // the band's colours, made once: for each of NB steps across the wafer, the grid's tints mixed toward the spectral hue
  var REAL = PLATE.REAL, mix = function (a, b, t) { var h = function (s) { return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]; }, c = PLATE.mixL(h(a), h(b), t); return '#' + c.map(function (v) { var q = Math.round(Math.max(0, Math.min(255, v))).toString(16); return q.length < 2 ? '0' + q : q; }).join(''); };
  var SPEC = [[0, '#6f5aa8'], [0.34, '#4f74b8'], [0.67, '#4e9a7a'], [1, '#c9b04e']];
  var at = function (t) { t = Math.max(0, Math.min(1, t)); for (var i = 1; i < SPEC.length; i++) if (t <= SPEC[i][0]) return mix(SPEC[i - 1][1], SPEC[i][1], (t - SPEC[i - 1][0]) / (SPEC[i][0] - SPEC[i - 1][0])); return SPEC[SPEC.length - 1][1]; };
  var base = { f: '#64617e', l: '#7a7396', s: '#4d7884', p: '#988f7c' }, NB = 18;
  for (var i = 0; i < NB; i++) {
    var u = i / (NB - 1), w = 0.34 * Math.exp(-Math.pow((u - 0.5) / 0.3, 2)) + 0.05, hue = at((u - 0.18) / 0.64);
    for (var k in base) { var c = mix(base[k], hue, w); REAL['wfT' + i + k] = { L: c, D: mix(c, '#000000', 0.12), g: 0.6, stopsC: [[0, 1], [1, 1]] }; }
  }
  PLATE.WF_NB = NB;
})();
R('die-floorplan', function (m) {
  var W = 26, Dd = 33, T = 0.9;
  /* The face of plate 01's die (Nvidia's GH100 block diagram, as plate 01 draws it) as die photographs show such chips (the
     expert's round 3 rulings): items for a face centred at 0, 0 at height y, s times plate 01's millimetres. detail 2 draws every
     texture, 1 a little, 0 the blocks alone. flip turns the face half a turn (the die-to-die link to the other edge). Each kind of
     circuit has its texture: logic a fine mottle with a few bronze flecks, SRAM a fine even grid, I/O and PHY coarse stripes
     with copper-tone lines. The finest textures are marked fine: the kit leaves them out while the plate turns. */
  function diePhoto(s, y, detail, seed, flip) {
    var it = [], rnd = H.rng(seed || 11), dt = detail == null ? 2 : detail, f = flip ? -1 : 1, FN = false;
    var P3 = function (x, z) { return [f * x * s, y, f * z * s]; };
    var rect = function (x0, z0, x1, z1, real, tag) { it.push({ pts: [P3(x0, z0), P3(x1, z0), P3(x1, z1), P3(x0, z1)], closed: true, lw: 0, fill: { d: 0.5, real: real }, tag: tag || null, fine: FN }); };
    var line = function (x0, z0, x1, z1, real, lw, al, tag) { it.push({ pts: [P3(x0, z0), P3(x1, z1)], lw: lw, real: real, alpha: al == null ? 1 : al, tag: tag || null, fine: FN }); };
    // memory interfaces: coarse PHY bars, copper-tone lines across them; the controllers beside them, coarse logic
    [-1, 1].forEach(function (sd) {
      for (var k = 0; k < 6; k++) {
        var z0 = -13.6 + k * 4.55, z1 = z0 + 4.1, xa = Math.min(sd * 10.5, sd * 12.3), xb = Math.max(sd * 10.5, sd * 12.3);
        rect(xa, z0, xb, z1, 'dpPhy', 'mem');
        if (dt) {
          rect(xa + 0.12, z0 + 0.15, xb - 0.12, z0 + 0.55, 'dpLogicLo', 'mem'); rect(xa + 0.12, z1 - 0.55, xb - 0.12, z1 - 0.15, 'dpLogicLo', 'mem');
          FN = true; for (var q = 1; q <= 8; q++) { var zq = z0 + 0.55 + (z1 - z0 - 1.1) * q / 9; line(xa + 0.18, zq, xb - 0.18, zq, 'dpCu', dt > 1 ? 0.75 : 0.5, 0.95, 'mem'); } FN = false;
        }
        var ca = Math.min(sd * 8.75, sd * 10.2), cb = Math.max(sd * 8.75, sd * 10.2);
        rect(ca, z0 + 0.25, cb, z1 - 0.25, 'dpLogic', 'mem');
        FN = true; if (dt > 1) for (var a = 0; a < 2; a++) for (var b = 0; b < 5; b++) { var w = (cb - ca - 0.24) / 2, d = (z1 - z0 - 0.74) / 5, cx0 = ca + 0.12 + a * w, cz0 = z0 + 0.37 + b * d, v = rnd(); rect(cx0 + 0.05, cz0 + 0.05, cx0 + w - 0.05, cz0 + d - 0.05, v < 0.14 ? 'dpBronze' : v < 0.55 ? 'dpLogicLo' : 'dpLogicHi', 'mem'); } FN = false;
      }
    });
    // compute: eight clusters of 18 units; each unit a fine mottle of logic, its L1 across one end and its four register files
    var gcW = 17.2 / 4;
    [[3.4, 13.7], [-13.7, -3.4]].forEach(function (bz) {
      for (var g = 0; g < 4; g++) {
        var x0 = -8.6 + g * gcW + 0.18, x1 = x0 + gcW - 0.36, tw = (x1 - x0 - 0.3) / 3, td = (bz[1] - bz[0] - 0.4) / 6;
        for (var a2 = 0; a2 < 3; a2++) for (var c = 0; c < 6; c++) {
          var tx0 = x0 + 0.15 + a2 * tw + 0.06, tz0 = bz[0] + 0.2 + c * td + 0.06, tx1 = tx0 + tw - 0.12, tz1 = tz0 + td - 0.12;
          rect(tx0, tz0, tx1, tz1, 'dpLogic', 'sm');
          if (dt > 1) {
            // the mottle: cells within the logic's plus or minus 8 percent, a bronze fleck in about one cell in ten
            FN = true; var nx = 3, nz = 4, cw = (tx1 - tx0) / nx, cd = (tz1 - tz0 - 0.3) / nz;
            for (var i = 0; i < nx; i++) for (var j = 0; j < nz; j++) {
              var v2 = rnd(), rl = v2 < 0.1 ? 'dpBronze' : v2 < 0.42 ? 'dpLogicHi' : v2 < 0.74 ? 'dpLogicLo' : null;
              if (!rl) continue;
              var e = v2 < 0.1 ? 0.07 : 0.015;
              rect(tx0 + i * cw + e, tz0 + 0.3 + j * cd + e, tx0 + (i + 1) * cw - e, tz0 + 0.3 + (j + 1) * cd - e, rl, 'sm');
            }
            FN = false; rect(tx0 + 0.05, tz0 + 0.04, tx1 - 0.05, tz0 + 0.24, 'dpSram', 'sm'); FN = true;
            [0.25, 0.75].forEach(function (fx) { [0.45, 0.8].forEach(function (fz) { var cx = tx0 + (tx1 - tx0) * fx, cz = tz0 + (tz1 - tz0) * fz; rect(cx - 0.1, cz - 0.08, cx + 0.1, cz + 0.08, 'dpSramB', 'sm'); }); }); FN = false;
          } else if (dt === 1) rect(tx0 + 0.05, tz0 + 0.04, tx1 - 0.05, tz0 + 0.3, 'dpSram', 'sm');
        }
      }
    });
    // the L2 cache: two partitions of sub-arrays, teal shading toward blue, each a fine even grid
    [[-8.6, -0.5], [0.5, 8.6]].forEach(function (b) {
      rect(b[0], -2.8, b[1], 2.8, 'dpSram', 'l2');
      if (dt) {
        var nA = 6, nB = 3, aw = (b[1] - b[0]) / nA, ad = 5.6 / nB;
        for (var i = 0; i < nA; i++) for (var j = 0; j < nB; j++) if ((i + j) % 2) rect(b[0] + i * aw + 0.08, -2.8 + j * ad + 0.08, b[0] + (i + 1) * aw - 0.08, -2.8 + (j + 1) * ad - 0.08, 'dpSramB', 'l2');
        if (dt > 1) {
          FN = true;
          for (var xg = b[0] + 0.27; xg < b[1] - 0.05; xg += 0.27) line(xg, -2.74, xg, 2.74, 'dpSramLn', 0.32, 0.5, 'l2');
          for (var zg = -2.8 + 0.31; zg < 2.78; zg += 0.31) line(b[0] + 0.05, zg, b[1] - 0.05, zg, 'dpSramLn', 0.32, 0.38, 'l2');
          FN = false;
        }
        for (var i2 = 1; i2 < nA; i2++) line(b[0] + i2 * aw, -2.8, b[0] + i2 * aw, 2.8, 'dpStreet', dt > 1 ? 0.9 : 0.6, 1, 'l2');
        for (var j2 = 1; j2 < nB; j2++) line(b[0], -2.8 + j2 * ad, b[1], -2.8 + j2 * ad, 'dpStreet', dt > 1 ? 0.7 : 0.5, 1, 'l2');
      }
    });
    rect(-0.4, -2.8, 0.4, 2.8, 'dpLogicLo', 'l2');
    // the host interface: coarse PHY with its ports; the die-to-die link: PHY with copper pads
    rect(-11.6, 14.2, 11.6, 16.1, 'dpPhy', null);
    if (dt) for (var n = 0; n < 9; n++) { var nx0 = -10.8 + n * 2.62; rect(nx0, 14.55, nx0 + 1.9, 15.75, 'dpBronze', null); FN = true; if (dt > 1) for (var q2 = 1; q2 < 5; q2++) line(nx0 + 0.1, 14.55 + q2 * 0.24, nx0 + 1.8, 14.55 + q2 * 0.24, 'dpCu', 0.55, 0.9); FN = false; }
    rect(-11.6, -16.1, 11.6, -14.3, 'dpPhy', 'd2d');
    if (dt) for (var p = 0; p < 26; p++) { var px = -11.6 + 0.75 + p * (23.2 - 1.5) / 25; rect(px - 0.26, -15.46, px + 0.26, -14.94, 'dpPad', 'd2d'); if (dt > 1) { FN = true; line(px, -16.0, px, -15.46, 'dpCu', 0.4, 0.8, 'd2d'); FN = false; } }
    // a thin seal ring inside the die's edge
    if (dt) { var sr = function (x0, z0, x1, z1) { line(x0, z0, x1, z1, 'dpCu', dt > 1 ? 0.6 : 0.4, 0.9); }; sr(-12.75, -16.25, 12.75, -16.25); sr(12.75, -16.25, 12.75, 16.25); sr(12.75, 16.25, -12.75, 16.25); sr(-12.75, 16.25, -12.75, -16.25); }
    return it;
  }
  var SIDES = { px: { d: 0.065, real: 'dpEdge' }, nx: { d: 0.065, real: 'dpEdge' }, pz: { d: 0.065, real: 'dpEdge' }, nz: { d: 0.065, real: 'dpEdge' } };

  var Rw = 150, wT = 2.2, NB = PLATE.WF_NB, EX = 5.2;
  var wf = m.part('wafer', { ex: [0, 0, 0], seq: 0 });
  // the wafer's outline with its notch, at the near edge
  var shape = []; for (var k = 0; k < 120; k++) { var a = k * TAU / 120; if (k === 30) { shape.push([2.5, Rw - 0.3]); shape.push([0, Rw - 3.2]); shape.push([-2.5, Rw - 0.3]); continue; } shape.push([Rw * Math.cos(a), Rw * Math.sin(a)]); }
  var tiles = [], seat = null, LX = 0.62, LZ = -0.78, SX = -1, SZ = -1;
  for (var gx = -6; gx <= 5; gx++) for (var gz = -5; gz <= 4; gz++) {
    var cx = (gx + 0.5) * W, cz = (gz + 0.5) * Dd;
    var ok = [[-1, -1], [1, -1], [-1, 1], [1, 1]].every(function (q) { var x = cx + q[0] * W / 2, z = cz + q[1] * Dd / 2; return x * x + z * z < (Rw - 3) * (Rw - 3); });
    if (!ok) continue;
    var u = 0.5 + (cx * LX + cz * LZ) / (2 * Rw), b = 'wfT' + Math.max(0, Math.min(NB - 1, Math.round(u * (NB - 1))));
    var x0 = cx - W / 2 + 0.35, z0 = cz - Dd / 2 + 0.35, x1 = cx + W / 2 - 0.35, z1 = cz + Dd / 2 - 0.35;
    var R4 = function (a0, c0, a1, c1, rl, fine) { tiles.push({ pts: [[a0, wT / 2, c0], [a1, wT / 2, c0], [a1, wT / 2, c1], [a0, wT / 2, c1]], closed: true, lw: 0, fill: { d: 0.5, real: rl }, tag: 'wafer', fine: !!fine }); };
    if (gx === SX && gz === SZ) { seat = [x0, z0, x1, z1]; R4(x0, z0, x1, z1, 'dpFace'); continue; }
    R4(x0, z0, x1, z1, b + 'f');
    // each die's floorplan, small: the compute halves, the cache across the middle, memory down both sides
    R4(cx - 8.6, cz + 3.4, cx + 8.6, cz + 13.7, b + 'l', 1); R4(cx - 8.6, cz - 13.7, cx + 8.6, cz - 3.4, b + 'l', 1);
    R4(cx - 8.6, cz - 2.8, cx + 8.6, cz + 2.8, b + 's');
    R4(cx - 12.3, cz - 13.6, cx - 8.75, cz + 13.6, b + 'p', 1); R4(cx + 8.75, cz - 13.6, cx + 12.3, cz + 13.6, b + 'p', 1);
  }
  m.tag('wafer'); m.real('wfSi');
  m.prism(shape, -wT / 2, wT / 2, 'light', { smooth: true, top: tiles });
  m.tag(null);
  // the lifted die, EX times larger, high over its seat
  var sc = [(seat[0] + seat[2]) / 2, (seat[1] + seat[3]) / 2], dc = [sc[0], 168, sc[1]], DW = W * EX, DD = Dd * EX, DT = T * EX;
  var die = m.part('die', { ex: [0, 0, 0], seq: 1 });
  m.real('dpFace');
  m.box({ c: dc, s: [DW, DT, DD], decals: { py: diePhoto(EX, DT / 2, 2, 5, true) }, fmat: SIDES }, 'light');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    var sx = q[0] < 0 ? seat[0] : seat[2], sz = q[1] < 0 ? seat[1] : seat[3];
    m.guide([[sx, wT / 2, sz, wf.idx], [dc[0] + q[0] * DW / 2, dc[1] - DT / 2, dc[2] + q[1] * DD / 2, die.idx]], { style: 'dash', alpha: 0.8 });
  });
  // labels: on the lifted die (its face turned half round, so a point at x, z of plate 01 lies at -x, -z), and the wafer
  var on = function (x, z) { return [dc[0] - x * EX, dc[1] + DT / 2, dc[2] - z * EX, die.idx]; };
  m.callout(on(10.9, 12.5), 'Memory controllers', { side: 'l', tag: 'mem', rowAt: on(-11.4, 9) });
  m.callout(on(6.4, 5.5), 'Compute units', { side: 'l', tag: 'sm' });
  m.callout(on(4.6, -1.2), 'Cache', { side: 'l', tag: 'l2' });
  m.callout(on(4, -15.2), 'Die-to-die link', { side: 'l', tag: 'd2d' });
  m.callout([-Rw * 0.66, wT / 2, Rw * 0.7, wf.idx], 'Wafer, 300 mm', { side: 'l', tag: 'wafer' });
  return { elev: PLATE.ISO.elev, yaw: -Math.PI / 4, sortAxis: [0, 1, 0], start: 1.4, thumbX: 0.5, softLine: '#2b2a3d',
    accent: [111, 139, 166], accentDark: [195, 211, 226], accent2: [176, 102, 44], accent2Dark: [224, 154, 92] };
});

})(window.PLATE);}catch(e){console.warn('plate die-floorplan.js failed to load', e);}
/* plates/euv-scanner.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   04 Lithography: an EUV scanner cut open on its optical plane, in metres, its layout simplified (the caption says so). The
   source pulls left along its own beam, the reticle stage lifts and the wafer stage drops along theirs; the illuminator and
   the projection optics stand side by side. The 13.5 nm light runs on through every gap.
   22 Nov 2026 review, made true at rest (the plate rests exploded, so every node is placed and every mirror aimed in the rest
   positions, REST below):
   - the light meets the mask and leaves it at the same angle, 6 degrees from the mask's normal, the chief-ray angle of a
     0.33-NA, 4x scanner (Lawrence Berkeley National Laboratory, "Upgrade to the SHARP EUV mask microscope", SPIE 10957,
     26 Mar 2019, escholarship.org/uc/item/9vh7g4rm: the SHARP zoneplates match the scanners' chief-ray angle, 6 degrees). It
     was 17 degrees in and 36 out, then 5.4 degrees, the angle the imec and PTB paper (arxiv.org/abs/1912.09075) uses for a
     0.55-NA, High-NA scanner (22 Nov 2026 expert review);
   - the mask and the wafer are both drawn at twice their size (the caption says they are drawn large, since the machine
     they are measured against is itself simplified): the mask 152.4 mm square and 6.35 mm thick
     (Hoya's US patent 9,494,851), the wafer 300 mm across and 775 micrometres thick (SEMI M1); they were 4x and 1.6x;
   - the last mirror sits straight over the wafer, so the wafer stage drops along its beam.
   Colours (the set's legend): the light in the beam hue, the wafer in silicon slate (acc2), as on every plate.
   22 Nov 2026 plates refine: the illuminator and the projection optics stand apart again, so they read as two modules (they
   stood wall to wall). Round two: the two mirrors either side of the mask (0.08 m) stand lower in their boxes, so the light
   still meets the mask and leaves it at 6 degrees; NODE gives the rest positions. Round two fix (expert review): EUV light
   crosses no solid (chapter 4, air and glass absorb it), so the boxes' inner walls stand 0.12 m apart between their outer
   faces, each inner face clear of the 6 degree leg, which leaves its box through the roof at x = 0.19 -/+ 0.124 m, as before
   (at 0.24 m apart both legs ran 0.43 m inside the walls). The light takes the deeper beam hue plate 07 takes. */
R('euv-scanner', function (m) {
  function unit(v) { var L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
  var X2 = 2, MASK = 0.1524 * X2, MASKT = 0.00635 * X2, WR = 0.15 * X2, WT = 0.000775 * X2;
  // how far each module stands from its assembled place at rest
  var EXS = { src: [-0.5, 0], ill: [0, 0], ret: [0, 0.30], pob: [0, 0], waf: [0, -0.36] };
  var PLASMA = [-1.14, -1.34], COLL = [-1.80, -1.34];
  // the mask stands over the seam between the illuminator and the projection optics; the illuminator's last mirror and the
  // optics' first stand level with each other, either side of it, so the light comes in and goes out at the same angle
  // (round two: the two mirrors either side of the mask stand lower, at YS -0.49, so at 6 degrees they sit 0.26 m either side of
  // the seam, inside their boxes; the boxes' inner walls stand GAP apart, their inner faces 0.014 m clear of the legs where the
  // legs leave through the roofs; the optics' second mirror moves up to (0.70, -0.10) so the first leg passes it)
  var XM = 0.19, YM = 1.68, YS = -0.49, CRA = 6 * Math.PI / 180, DX = (YM + EXS.ret[1] - YS) * Math.tan(CRA), GAP = 0.12;
  var NODE = [
    { p: [-0.56, -1.34], k: 'ap', o: 'ill' }, { p: [-0.24, -0.82], k: 'm', r: 0.20, o: 'ill' }, { p: [-0.98, -0.10], k: 'm', r: 0.30, o: 'ill' }, { p: [XM - DX, YS], k: 'm', r: 0.08, o: 'ill' },
    { p: [XM, YM], k: 'ret', o: 'ret' },
    { p: [XM + DX, YS], k: 'm', r: 0.08, o: 'pob' }, { p: [1.30, 0.05], k: 'm', r: 0.24, o: 'pob' }, { p: [0.70, -0.10], k: 'm', r: 0.20, o: 'pob' },
    { p: [1.32, -0.62], k: 'm', r: 0.23, o: 'pob' }, { p: [0.66, -0.92], k: 'm', r: 0.18, o: 'pob' }, { p: [1.12, -1.18], k: 'm', r: 0.26, o: 'pob' },
    { p: [1.12, -1.74], k: 'waf', o: 'waf' }];
  // (the illuminator's and the optics' nodes are given where they stand at rest; the mask's and the wafer's where they stand
  // assembled; AT is where a node is built in its own part)
  var ATREST = { ill: 1, pob: 1 };
  var REST = function (q) { var e = EXS[q.o]; return ATREST[q.o] ? q.p : [q.p[0] + e[0], q.p[1] + e[1]]; };
  var AT = function (q) { var e = EXS[q.o]; return ATREST[q.o] ? [q.p[0] - e[0], q.p[1] - e[1]] : q.p; };
  NODE.forEach(function (q, i) {
    if (q.k === 'ret') q.nv = [0, -1]; else if (q.k === 'waf') q.nv = [0, 1]; else if (i === 0) q.nv = unit([REST(NODE[1])[0] - REST(q)[0], REST(NODE[1])[1] - REST(q)[1]]);
    else { var r0 = REST(q), a = unit([REST(NODE[i - 1])[0] - r0[0], REST(NODE[i - 1])[1] - r0[1]]), b = unit([REST(NODE[i + 1])[0] - r0[0], REST(NODE[i + 1])[1] - r0[1]]); q.nv = unit([a[0] + b[0], a[1] + b[1]]); }
  });
  // a mirror: a thick disc with a dished face, its axis along nv, in the plane z = 0
  function mirror(q, nv, r, mat, o) {
    o = o || {};
    var sag = r * 0.14, t = r * 0.24, prof = [[o.rIn || 0, -t], [r, -t], [r, sag, 1]];
    for (var k = 5; k >= 0; k--) { var rr = (o.rIn || 0) + (r - (o.rIn || 0)) * k / 6; prof.push([rr, sag * (rr / r) * (rr / r), 0]); }
    var th = Math.atan2(-nv[0], nv[1]);
    // the illuminator's and the projection optics' mirrors carry one tag, so Mirrors lights all of them (the collector is the source's)
    if (!o.notag) m.tag('mirror');
    var sv = m.revolve(prof, mat || 'turnedDark', { seg: 28, rot: [0, 0, th], pos: [q[0], q[1], 0], sortFaces: true, real: 'glassBody', capMat: { d: 0.32, real: 'mlm' } });
    m.tag(null);
    return sv;
  }
  // a module's housing cut open on the optical plane (z = 0): back wall, floor, roof and side walls, cut edges hatched
  function housing(cx, cy, w, h, d, t) {
    var cutF = { pz: 'cut' };
    m.real('vac');
    m.box({ c: [cx, cy, -d + t / 2], s: [w, h, t], real: 'vacIn', inner: true }, 'paper');
    m.box({ c: [cx, cy - h / 2 + t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx, cy + h / 2 - t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx - w / 2 + t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
    m.box({ c: [cx + w / 2 - t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
  }
  var src = m.part('source', { ex: [EXS.src[0], EXS.src[1], 0], seq: 0 });
  var vesR = 0.66, vx0 = -1.94, vx1 = -0.72, vc = (vx0 + vx1) / 2;
  m.real('vac');
  // the vessel, cut on the optical plane (z = 0) with the far half kept, as the other modules are
  m.revolve([[0.62, -0.61], [vesR, -0.61], [vesR, 0.61], [0.62, 0.61]], 'turned', { seg: 40, a0: Math.PI, a1: Math.PI * 2, rot: [0, 0, -Math.PI / 2], pos: [vc, PLASMA[1], 0], cut: 'cut', sortFaces: true });
  mirror(COLL, [1, 0], 0.56, 'turned', { rIn: 0.075, notag: true });
  // the tin plasma, in the light's own hue: it is where the light is made
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 4.2, col: 'acc', alpha: 0.35 });
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 2.2, col: 'acc', alpha: 1 });
  m.real('steelDk');
  m.cyl([PLASMA[0], PLASMA[1] + 0.72, 0], 0.05, 0.30, 'turnedDark', { seg: 20 });
  var drops = []; for (var i = 0; i < 7; i++) drops.push([PLASMA[0], PLASMA[1] + 0.52 - i * 0.07, 0]);
  m.dots(drops, { r: 1.3, alpha: 0.9, real: 'sac' });
  m.wire([[-2.14, PLASMA[1], 0], [PLASMA[0] - 0.05, PLASMA[1], 0]], { lw: 0.8, dash: [5, 3], alpha: 0.8 });
  m.real('steelDk');
  m.box({ c: [-2.02, PLASMA[1], 0], s: [0.26, 0.30, 0.30] }, 'mid');
  m.anchor(1, 'Light source', [PLASMA[0], PLASMA[1], 0]);
  // illuminator: its housing, cut open, and three mirrors; its roof stops short of the mask, so the light crosses open air
  var ill = m.part('illuminator', { ex: [0, 0, 0], seq: 1 });
  // (its inner wall stands GAP / 2 off the seam under the mask)
  housing((-1.33 + XM - GAP / 2) / 2, -0.24, XM - GAP / 2 + 1.33, 2.08, 0.575, 0.05);
  [1, 2, 3].forEach(function (k) { mirror(AT(NODE[k]), NODE[k].nv, NODE[k].r); });
  // the reticle stage on top, the mask hanging pattern-down beneath it
  var ret = m.part('reticle', { ex: [EXS.ret[0], EXS.ret[1], 0], seq: 3 });
  var Rp = NODE[4].p;
  m.real('glass');
  m.box({ c: [Rp[0], Rp[1] + MASKT / 2, 0], s: [MASK, MASKT, MASK], decals: { ny: [D.rect(-MASK * 0.34, -MASK * 0.27, MASK * 0.34, MASK * 0.27, -MASKT / 2, { lw: 0.5 })] } }, 'light');
  m.real('granite');
  m.box({ c: [Rp[0], Rp[1] + MASKT + 0.035, 0], s: [MASK + 0.08, 0.07, MASK + 0.06] }, 'mid');
  m.real('steelDk');
  [-1, 1].forEach(function (s) { m.box({ c: [Rp[0], Rp[1] + MASKT + 0.095, s * (MASK / 2 + 0.06)], s: [1.30, 0.045, 0.055] }, 'dark'); });
  m.anchor(3, 'Mask', [Rp[0] - MASK * 0.3, Rp[1], 0]);
  // the projection optics: six mirrors in their box
  var pob = m.part('optics', { ex: [EXS.pob[0], EXS.pob[1], 0], seq: 2 });
  housing((XM + GAP / 2 + 1.65) / 2, -0.415, 1.65 - XM - GAP / 2, 2.43, 0.61, 0.05);
  for (var k = 5; k <= 10; k++) mirror(AT(NODE[k]), NODE[k].nv, NODE[k].r);
  m.anchor(2, 'Mirrors', [[AT(NODE[6])[0], AT(NODE[6])[1], NODE[6].r * 0.8], [AT(NODE[8])[0], AT(NODE[8])[1], NODE[8].r * 0.8]]);  // on the near rims of the two right-hand mirrors
  // the wafer stage and the base frame: two wafer tables side by side, the light landing on the right-hand one
  // review: 'stack' paints the stage block before the chucks and wafers on it
  var waf = m.part('wafer', { ex: [EXS.waf[0], EXS.waf[1], 0], seq: 4, mode: 'stack' });
  var Wp = NODE[11].p;
  [0, -0.78].forEach(function (dx, j) {
    m.real('granite');
    m.cyl([Wp[0] + dx, Wp[1] - 0.042 - WT / 2, 0], WR * 1.08, 0.075, 'turnedDark', { seg: 32 });
    m.real('siProc');
    if (!j) m.tag('wafer');
    m.cyl([Wp[0] + dx, Wp[1] - WT / 2, 0], WR, WT, 'acc2Light', { seg: 32, top: (function () { var gd = []; for (var gx = -5; gx <= 5; gx++) for (var gz = -5; gz <= 5; gz++) { var ux = gx * 0.052, uz = gz * 0.066; if (Math.abs(ux) + 0.026 > WR * 0.92 || ux * ux + uz * uz > WR * WR * 0.78) continue; gd.push(D.rect(ux - 0.025, uz - 0.032, ux + 0.025, uz + 0.032, WT / 2, { lw: 0.3, alpha: 0.45, fill: 'steel', sheen: 0.1 })); } return gd; })().concat(j ? [] : [D.rect(-0.026, -0.033, 0.026, 0.033, WT / 2, { fill: 'acc', lw: 0.6, col: 'acc', diagram: true })]) });
    m.tag(null);
  });
  m.real('steelDk');
  m.box({ c: [Wp[0] - 0.39, Wp[1] - 0.135, 0], s: [1.66, 0.10, 0.66] }, 'mid');
  m.anchor(4, 'Wafer', [Wp[0] - WR * 0.5, Wp[1], 0]);
  var base = m.part('base', { ex: [0, -0.62, 0], seq: 5, pri: -1 });
  m.real('paint');
  m.box({ c: [-0.16, -2.16, 0], s: [3.66, 0.20, 1.36] }, 'steel');
  for (i = 0; i < 4; i++) { var lx = -0.16 - 1.83 + 0.36 + i * (3.66 - 0.72) / 3; [0.5, -0.5].forEach(function (z) { m.cyl([lx, -2.38, z], 0.085, 0.24, 'turnedDark', { seg: 16, real: 'steelDk' }); }); }
  void base;
  // the light: through each module, attached to the part it is in at each end
  var idx = { ill: ill.idx, ret: ret.idx, pob: pob.idx, waf: waf.idx };
  var pts = [[PLASMA[0], PLASMA[1], 0, src.idx]].concat(NODE.map(function (q) { var a = AT(q); return [a[0], a[1], 0, idx[q.o]]; }));
  m.guide(pts, { style: 'beam', col: 'acc', lw: 1.4, knockDark: true });
  // the collector's cone of light, from its rim to the plasma and on to the focus
  [0.27, -0.27, 0.5, -0.5].forEach(function (rr) { m.guide([[COLL[0] + 0.28 * (rr / 0.56) * (rr / 0.56), PLASMA[1] + rr, 0, src.idx], [NODE[0].p[0], NODE[0].p[1], 0, src.idx]], { style: 'beam', col: 'acc', lw: 0.7, alpha: 0.55 }); });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, calloutOpts: { 2: { tag: 'mirror' }, 4: { tag: 'wafer' } }, accent: [78, 96, 186], accentDark: [154, 166, 255], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate euv-scanner.js failed to load', e);}
/* plates/gaa-transistor.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   08 Foundries: a gate-all-around transistor in nanometres: three silicon sheets wrapped on all four sides by the gate metal,
   inner spacers between the gate and the source and drain. Cut across the middle of the gate, with the drain half pulled
   away along the channel (+x), so the cut face shows the metal round each sheet and the two halves read as one switch.
   22 Nov 2026 review: the sheet sizes (6 nm by 30 nm) had no allowed source, so the caption says the proportions are
   simplified and the label carries no figure. The five parts chapter 8's "How a transistor is built" names are numbered,
   from data/specimen-parts.json (source, drain, silicon sheets, gate metal, inner spacers). The drain was pulled along a
   diagonal (0.62, 0, -0.62), which ran its trace lines level across the page. Colours (the set's legend): the sheets in
   silicon slate; the gate metal is ink (it is not gold).
   22 Nov 2026 expert review: an inner spacer stands at every level the gate fills between the source and drain, so a third
   level sits under the bottom sheet, beside the gate below it, on both halves (arXiv 2201.04725; imec, "Entering the
   nanosheet transistor era"); there were two levels for three sheets. Silicon is slate across the set: the substrate in the
   sheets' slate, the source and drain, which are doped silicon, in a lighter slate tint, so the sheets read apart from them.
   22 Nov 2026 plates refine: the gate is the darkest block (d 0.42 since round two), a deep neutral metal with the metal ruling (45 degrees, open) on
   its cut face, so the slate sheets read against it (it was a pale grey, as light as the sheets). */
R('gaa-transistor', function (m) {
  var sT = 6, sW = 30, y0 = [0, 16, 32], gX = 7.5, spX = 12.5, gY0 = -11, gY1 = 45, gZ = 19, PULL = 62;
  var GATE = { d: 0.42 }, GATECUT = { d: 0.3, hatch: 1, ang: 45, gap: 3.6 }, SUB = 'acc', SUBCUT = 'cutAcc', SD = { d: 0.11, c: 'acc' };
  // the inner spacers' levels: under the bottom sheet, beside the gate below it, and between each pair of sheets
  var SPL = [[gY0, 0], [sT, 16], [22, 32]];
  function bx(x0, ya, z0, x1, yb, z1, mat, fm, dec) { return m.box({ c: [(x0 + x1) / 2, (ya + yb) / 2, (z0 + z1) / 2], s: [x1 - x0, yb - ya, z1 - z0], fmat: fm, decals: dec }, mat); }
  var epiShape = [[12.5, -13], [16.3, -17], [20.2, -17], [24, -13], [24, 13], [20.2, 17], [16.3, 17], [12.5, 13]];
  // source half, cut at x = 0
  var L = m.part('source', { mode: 'fixed', ex: [0, 0, 0], seq: 0 });
  m.real('siCut');
  bx(-30, -23, -25, 0, -16, 25, SUB, { px: SUBCUT });
  m.real('stiOx');
  bx(-27, -16, -22, 0, -11, 22, 'steel', { px: 'cut' });
  m.tag('src'); m.real('siEpi');
  m.prism(epiShape.map(function (q) { return [-q[0], q[1]]; }), -2, 40, SD, {});
  m.tag('spacer'); m.real('sin');
  // (the spacers a pale grey, so they read apart from the gate metal, in ink, round them: designer pass, 22 Nov 2026)
  SPL.forEach(function (b) { bx(-spX, b[0], -sW / 2, -gX, b[1], sW / 2, 'steel'); });
  m.tag('sheet'); m.real('siSheet');
  y0.forEach(function (yb) { bx(-spX, yb, -sW / 2, -gX, yb + sT, sW / 2, 'acc'); });
  m.tag('gate'); m.real('gate');
  bx(-gX, gY0, -gZ, 0, gY1, gZ, GATE, { px: GATECUT });
  m.tag('sheet'); m.real('siSheet');
  y0.forEach(function (yb) { m.sheet([[0.05, yb, -sW / 2], [0.05, yb, sW / 2], [0.05, yb + sT, sW / 2], [0.05, yb + sT, -sW / 2]], 'cutAcc'); });
  m.tag(null); m.real('w');
  bx(-5, gY1, -8, 0, 51, 8, 'dark', { px: 'cut' });
  var cL = m.part('contactS', { ex: [0, 10, 0], seq: 2 });
  bx(-23, 40, -10, -14.5, 48, 10, 'dark');
  // drain half, pulled away along the channel
  var Rr = m.part('drain', { mode: 'fixed', ex: [PULL, 0, 0], seq: 1 });
  m.real('siCut');
  bx(0, -23, -25, 30, -16, 25, SUB);
  m.real('stiOx');
  bx(0, -16, -22, 27, -11, 22, 'steel');
  m.tag('gate'); m.real('gate');
  bx(0, gY0, -gZ, gX, gY1, gZ, GATE);
  m.tag('spacer'); m.real('sin');
  SPL.forEach(function (b) { bx(gX, b[0], -sW / 2, spX, b[1], sW / 2, 'steel'); });
  m.tag('sheet'); m.real('siSheet');
  y0.forEach(function (yb) { bx(gX, yb, -sW / 2, spX, yb + sT, sW / 2, 'acc'); });
  m.tag(null); m.real('w');
  bx(0, gY1, -8, 5, 51, 8, 'dark');
  // the drain itself pulled a little further along the channel (designer pass, 22 Nov 2026), so the sheets' ends and the inner
  // spacers between them face the reader in the gap it leaves; at the half's own pull they showed only as slivers
  var DG = 26, Re = m.part('drainEpi', { mode: 'fixed', ex: [PULL + DG, 0, 0], seq: 2 });
  m.tag('drn'); m.real('siEpi');
  m.prism(epiShape, -2, 40, SD, {});
  m.tag(null);
  var cR = m.part('contactD', { ex: [PULL + DG, 10, 0], seq: 4 });
  m.real('w');
  bx(14.5, 40, -10, 23, 48, 10, 'dark');
  [[38, -13], [38, 13], [-2, 13]].forEach(function (q) { m.guide([[spX, q[0], q[1], Rr.idx], [spX, q[0], q[1], Re.idx]], { alpha: 0.8 }); });
  m.guide([[-34, 19, 0, L.idx], [0, 19, 0, L.idx], [0, 19, 0, Rr.idx], [34, 19, 0, Re.idx]], { style: 'axis', alpha: 0.8 });
  [[-gZ, gY1], [gZ, gY1], [gZ, gY0], [-gZ, gY0]].forEach(function (c) { m.guide([[0, c[1], c[0], L.idx], [0, c[1], c[0], Rr.idx]], { alpha: 0.8 }); });
  m.guide([[-18.75, 40, 0, L.idx], [-18.75, 40, 0, cL.idx]], { alpha: 0.8 });
  m.guide([[18.75, 40, 0, Re.idx], [18.75, 40, 0, cR.idx]], { alpha: 0.8 });
  // the five numbered parts, as chapter 8 names them (names from data/specimen-parts.json)
  m.anchor(1, 'Source', [-18.2, 30, 17], L.idx);
  m.anchor(2, 'Drain', [24, 30, 0], Re.idx);
  // the sheets and the spacers named where their ends face the reader, in the drain's gap: the sheet's dot below and to the
  // right of the spacer's, so their leaders rise side by side, the sheet's always right of the spacer's, to labels 5, 3 and 2 in
  // that order down the right (spec.order; 22 Nov 2026 plates refine: the sheet's leader rose past the spacer's dot)
  m.anchor(3, 'Silicon sheets', [spX, 16 + sT / 2, -8], Rr.idx);
  m.anchor(4, 'Gate metal', [0.05, -6.5, 9], L.idx);
  m.anchor(5, 'Inner spacers', [spX, 27, 4], Rr.idx);
  return { noPolish: true, elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, order: { r: [5, 3, 2] }, calloutOpts: { 1: { tag: 'src', side: 'l' }, 2: { tag: 'drn', side: 'r' }, 3: { tag: 'sheet', side: 'r' }, 4: { tag: 'gate', side: 'l' }, 5: { tag: 'spacer', side: 'r' } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate gaa-transistor.js failed to load', e);}
/* plates/gas-cabinet.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   03 Chemicals: a three-cylinder gas cabinet with its door off, in metres, and a bulk liquid cylinder behind it. One gas
   cylinder slides out of the cabinet the way it is changed; the exhaust collar lifts off.
   22 Nov 2026 review: its sizes (0.97 x 0.48 x 1.93 m) came from a supplier's catalogue, not an allowed source, so the
   plate carries no dimensions and the caption makes no claim of scale. Each label lights its own group (tags: panel,
   cylinders, bulk). Colours (the set's legend): the gas panel in the set's one steel colour, a grey with no hue (22 Nov 2026
   plates refine: it was a blue grey, which read as silicon's slate). */
R('gas-cabinet', function (m) {
  var CBX = -0.30, CW = 0.97, CD = 0.48, CPL = 0.12, CTOP = 1.93, t = 0.022;
  // painted in layers: the back shell, then the cylinders inside, then the front of the cabinet. The plate rocks
  // (its open front always toward the reader), so this order holds at every frame.
  var shell = m.part('shell', { ex: [0, 0, 0], seq: 0, pri: -1, mode: 'depth' });
  var CH = CTOP - CPL, CY = (CPL + CTOP) / 2;
  m.real('steelDk');
  m.box({ c: [CBX, CPL / 2, 0], s: [CW, CPL, CD] }, 'mid');                                  // plinth
  m.real('paint');
  m.box({ c: [CBX, CY, -CD / 2 + t / 2], s: [CW, CH, t], real: 'paintIn', inner: true }, 'light');                       // back wall
  m.box({ c: [CBX - CW / 2 + t / 2, CY, 0], s: [t, CH, CD], real: 'paintIn', inner: true }, 'steel');                   // far side
  var grille = [D.rectZY(-0.15, -0.17, 0.15, 0.17, t / 2 + 0.001, { lw: 0.6 })];
  for (var i = 0; i < 5; i++) grille.push(D.line([t / 2 + 0.001, -0.12 + i * 0.055, -0.13], [t / 2 + 0.001, -0.12 + i * 0.055, 0.13], { lw: 0.45 }));
  grille = grille.map(function (it) { return { pts: it.pts.map(function (p) { return [p[0], p[1] + CPL + 0.34 - CY, p[2]]; }), closed: it.closed, lw: it.lw }; });
  var front = m.part('front', { ex: [0, 0, 0], seq: 0, pri: 1, mode: 'depth' });
  m.real('paint');
  m.box({ c: [CBX + CW / 2 - t / 2, CY, 0], s: [t, CH, CD], decals: { px: grille } }, 'steel');   // near side
  m.box({ c: [CBX, CTOP - t / 2, 0], s: [CW, t, CD] }, 'light');                          // roof
  // the open front's frame return, and three hinges
  m.box({ c: [CBX, CY, CD / 2 - 0.01], s: [CW, CH, 0.02], skip: [] }, 'phantom');
  m.real('steel');
  for (i = 0; i < 3; i++) m.box({ c: [CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045], s: [0.045, 0.09, 0.045] }, 'mid');
  // (round 3: the cabinet's emergency-off button and its controller's screen, small, on the near side's front edge)
  m.real('screen'); m.box({ c: [CBX + CW / 2 + 0.006, CTOP - 0.17, CD / 2 - 0.12], s: [0.012, 0.075, 0.1] }, 'dark'); m.real('emo'); m.cyl([CBX + CW / 2 + 0.014, CTOP - 0.29, CD / 2 - 0.12], 0.022, 0.028, 'turned', { seg: 20, rot: [0, 0, Math.PI / 2] }); m.real('steel');
  // restraint bars, in front of the cylinders
  m.real('steel');
  [0.58, 1.04].forEach(function (by) { m.box({ c: [CBX, by, 0.045], s: [CW - 0.13, 0.038, 0.038] }, 'dark'); });
  m.use(shell);
  // the gas panel, steel-gray, on the back wall: plate, headers, valve blocks, gauges, regulator
  var PZ = -CD / 2 + 0.035, PY0 = 1.44, cylX = [-0.29, 0, 0.29];
  m.tag('panel'); m.real('vac');
  // (round two: the panel a step deeper, d 0.45, so it holds its place as the cabinet's one coloured part)
  m.box({ c: [CBX - 0.02, PY0 + 0.25, PZ - 0.008], s: [0.84, 0.46, 0.012] }, { d: 0.45, c: 'acc', real: 'panel' });
  m.wire([[CBX - 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 + 0.06, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX + 0.40, PY0 + 0.44, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  cylX.forEach(function (cx) {
    var px = CBX + cx;
    m.box({ c: [px, PY0 + 0.06, PZ + 0.03], s: [0.058, 0.062, 0.058] }, 'accDark');
    m.box({ c: [px, PY0 + 0.44, PZ + 0.03], s: [0.052, 0.056, 0.052] }, 'accDark');
    m.wire([[px, PY0 + 0.10, PZ + 0.03], [px, PY0 + 0.41, PZ + 0.03]], { col: 'acc', lw: 1.4 });
    m.real('gauge'); m.cyl([px, PY0 + 0.265, PZ + 0.04], 0.05, 0.02, 'accLight', { seg: 24, rot: [Math.PI / 2, 0, 0], top: [] }); m.real('steel');
    m.wire(H.ring(px, PY0 + 0.265, PZ + 0.051, 0.02, 20, 'z'), { col: 'acc', lw: 0.6 });
  });
  m.cyl([CBX + 0.40, PY0 + 0.06, PZ + 0.03], 0.048, 0.052, 'accTurned', { seg: 24 });
  m.wire([[CBX + 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 - 0.16, PZ + 0.03], [CBX + CW / 2 + 0.19, PY0 - 0.16, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.cyl([CBX + CW / 2 + 0.115, PY0 - 0.16, PZ + 0.03], 0.03, 0.115, 'accTurned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX - 0.40, CTOP - 0.03, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.tag(null);
  // three cylinders; the middle one slides out
  var CAPS = ['capY', 'capY', 'n2'], nB = 0;
  function bottle(x, hgt, cz) {
    m.tag('cyl');
    var b0 = CPL, b1 = CPL + hgt, sh = b1 + 0.11, CR = 0.114;
    m.real('cylGrey'); m.revolve([[0, b0], [CR, b0], [CR, b0 + 0.02, 2], [CR, b1 - 0.2, 2], [0, b1 - 0.2]], 'turned', { seg: 48, pos: [x, 0, cz] });
    m.real(CAPS[nB++ % 3]); m.revolve([[0, b1 - 0.2], [CR, b1 - 0.2], [CR, b1 - 0.085, 2], [CR, b1, 0], [0.034, sh], [0.034, sh + 0.02], [0, sh + 0.02]], 'turned', { seg: 48, pos: [x, 0, cz] });
    m.real('steel');
    // (a hazard diamond on the shoulder label, facing the cabinet's open front)
    var hzG = CAPS[nB - 1] === 'n2', dz = cz + CR * 1.02, dyc = b1 - 0.14, dd = 0.034, dx0 = x - 0.045;
    m.sheet([[dx0, dyc - dd, dz], [dx0 + dd, dyc, dz], [dx0, dyc + dd, dz], [dx0 - dd, dyc, dz]], { d: 0.05, real: 'label' }, { decals: [{ pts: [[dx0, dyc - dd * 0.82, dz + 0.0005], [dx0 + dd * 0.82, dyc, dz + 0.0005], [dx0, dyc + dd * 0.82, dz + 0.0005], [dx0 - dd * 0.82, dyc, dz + 0.0005]], closed: true, lw: 1.1, real: hzG ? 'ghsGreen' : 'ghsRed' }] });
    m.box({ c: [x, sh + 0.058, cz], s: [0.058, 0.078, 0.058] }, 'mid');
    m.tag(null);
    return [x, sh + 0.1, cz];
  }
  // review: the left cylinder slides out, not the middle one: out of the middle it stood on the 1 m dimension's left end
  var vt = [];
  var out = m.part('cylinder', { ex: [0, 0, 1.75], seq: 1, pri: 2 });
  vt.push(bottle(CBX + cylX[0], 1.16, -0.055));
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0, pri: 0, mode: 'depth' });
  vt.push(bottle(CBX + cylX[1], 1.16, -0.055));
  vt.push(bottle(CBX + cylX[2], 0.98, -0.055));
  // pigtails from the valves to the panel (the one that slides out is disconnected)
  m.tag('panel'); m.real('vac');
  [1, 2].forEach(function (k) {
    var v = vt[k], px = CBX + cylX[k], coil = [];
    for (var a = 0; a <= 2.6 * 24; a++) { var th = a / 24 * TAU; coil.push([v[0] + 0.048 + 0.048 * Math.cos(th), v[1] + 0.03 + a / 24 * 0.038, v[2] + 0.048 * Math.sin(th)]); }
    m.wire(coil, { col: 'acc', lw: 0.8 });
    m.wire([[v[0] + 0.096, v[1] + 0.13, v[2]], [v[0] + 0.096, PY0 - 0.02, v[2]], [px, PY0 - 0.02, PZ + 0.03], [px, PY0 + 0.06, PZ + 0.03]], { col: 'acc', lw: 1.2 });
  });
  m.tag(null);
  m.guide([[CBX + cylX[0], CPL, -0.055, cab.idx], [CBX + cylX[0], CPL, -0.055, out.idx]], { style: 'axis', alpha: 0.85 });
  m.guide([[CBX + cylX[0] - 0.114, CPL, -0.055, cab.idx], [CBX + cylX[0] - 0.114, CPL, -0.055, out.idx]], { alpha: 0.85 });
  m.guide([[CBX + cylX[0] + 0.114, CPL, -0.055, cab.idx], [CBX + cylX[0] + 0.114, CPL, -0.055, out.idx]], { alpha: 0.85 });
  // the exhaust plenum and collar, lifted off the roof
  var ex = m.part('exhaust', { ex: [0, 0.14, 0], seq: 2, pri: 3 });
  m.real('steel');
  m.box({ c: [CBX, CTOP + 0.085, -0.02], s: [0.66, 0.17, 0.40] }, 'steel');
  m.cyl([CBX, CTOP + 0.37, -0.02], 0.102, 0.40, 'turned', { seg: 28, rIn: 0.09 });
  m.guide([[CBX, CTOP, -0.02, cab.idx], [CBX, CTOP + 0.62, -0.02, ex.idx]], { style: 'axis', alpha: 0.85 });
  // the bulk liquid cylinder behind
  var bulk = m.part('bulk', { ex: [0, 0, 0], seq: 0, pri: -2 });
  var TX = 0.86, TZ = -0.40, TR = 0.205, TB = 0.15, TT = 1.06;
  m.tag('bulk'); m.real('vac');
  var bp = [[0, 0], [TR * 0.86, 0], [TR * 0.86, TB], [TR, TB], [TR, 0.30, 2], [TR, 0.48, 2], [TR, 0.66, 2], [TR, 0.84, 2], [TR, 0.94, 2], [TR, 1.00, 2], [TR, TT]];
  for (i = 1; i <= 6; i++) { var a = i / 6 * Math.PI / 2; bp.push([TR * Math.cos(a), TT + TR * 0.52 * Math.sin(a), 0]); }
  bp.push([0, TT + TR * 0.52]);
  m.revolve(bp, 'turned', { seg: 36, pos: [TX, 0, TZ] });
  m.cyl([TX, TT + 0.20, TZ], TR * 0.98, 0.03, 'turnedDark', { seg: 36, rIn: TR * 0.9 });
  m.box({ c: [TX, TT + 0.10, TZ + 0.02], s: [0.16, 0.075, 0.10] }, 'mid');
  for (i = 0; i < 4; i++) { var pa = i * TAU / 4 + 0.5; m.wire([[TX + TR * 0.94 * Math.cos(pa), TT + 0.03, TZ + TR * 0.94 * Math.sin(pa)], [TX + TR * 0.96 * Math.cos(pa), TT + 0.19, TZ + TR * 0.96 * Math.sin(pa)]], { lw: 1.1 }); }
  var coil2 = []; for (i = 0; i <= 5 * 24; i++) { var tt = i / 24 * TAU; coil2.push([TX - TR - 0.046 + 0.042 * Math.cos(tt), 0.49 + i / 24 * 0.046, TZ + 0.02 + 0.042 * Math.sin(tt)]); }
  m.wire(coil2, { lw: 0.7, real: 'vac' });
  m.tag(null);
  // labels: each lights its own group. The cylinders' one leader goes to the cylinder that slid out, clear of the
  // cabinet's restraint bars, and its label lights all three
  m.callout([CBX + cylX[0] - 0.09, 0.82, -0.055 + 0.07, out.idx], 'Gas cylinders', { side: 'l', tag: 'cyl' });
  m.callout([CBX - 0.25, PY0 + 0.25, PZ, shell.idx], 'Valves, regulator and gauges', { side: 'l', dy: -14, tag: 'panel' });
  m.callout([TX + TR * 0.5, 0.75, TZ + TR * 0.86, bulk.idx], 'Bulk liquid cylinder', { side: 'r', tag: 'bulk' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [122, 122, 122], accentDark: [200, 200, 200] };
});

})(window.PLATE);}catch(e){console.warn('plate gas-cabinet.js failed to load', e);}
/* plates/globe.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   16 Who controls the chain: the world, with one garnet pin for each row of the chapter's own table, "Chokepoints and who
   holds them" (content/16-geopolitics.md, 22 Nov 2026), standing in the country that leads that segment. A pin's height is
   that country's share as the table gives it (revenue 2025 for equipment, 2023 for materials, capacity 2022 for logic, sales
   2022 for design, market share 2025 for foundry), 0.24 of the globe's radius for all of a segment. Pins stand near the
   middle of their country, spread a little where a country leads several segments: the table names countries, so the pins
   claim no town. Each country's label lights its pins.
   22 Nov 2026 review: the nineteen towns came from specimens/globe.js with no source, were mapped to chapter numbers from
   before the merge, and pinned Yokkaichi, a NAND fab, at full height for memory; the heights were the retired chokepoint
   score; the five ink pins for towns building alternatives are not in the table and are gone. The coast is still read from
   specimens/globe.js by build/plates.js (window.PLATE_GLOBE); the towns there are no longer read here (the summary map's
   own copy is unchanged). The globe rests closed and keeps turning, slowly, about the Earth's axis.
   22 Nov 2026 expert review: at the old rest view (yaw -72, elevation 36 degrees) the four US pins stood behind the globe,
   their label over nothing, in reduced motion and the stills too, and the pins facing the reader were drawn far shorter than
   their shares. The rest view now looks down from above the North Pacific (yaw 165, elevation 60 degrees), where every pin
   and its label shows and no pin is drawn shorter than about two thirds of its length (the caption says pins that point
   toward the reader are drawn shorter). Higher views keep the lengths closer still, but from about 64 degrees the land's
   fill (src/plate.js, land) spills over the sea. A country's pins leaned apart
   across the line of sight of the rest view only, so none tipped toward the reader (until the refine below). The labels take the sides the countries
   show on: the Netherlands and the United States right, the four in Asia left (round two: the Netherlands left, below).
   22 Nov 2026 plates refine: each pin is a spike standing straight up the page from its country's base (src/plate.js spike),
   so its drawn length is its share at every turn, at rest and as the globe goes round (a pin standing out of the surface was
   drawn shorter the more it pointed at the reader, which the caption had to warn of). A country that leads several segments
   has its spikes side by side on one base, the middle of the places it was pinned before. With no foreshortening to keep down,
   the rest view is the lowest that still shows all twelve pins with every label in full ink (each foot within 64 degrees of
   the line of sight): yaw -160, elevation 62 degrees, over the western Pacific, Asia to the left, North America to the right
   and Europe over the pole. Under 560 px the labels stand in a row under the globe, which takes the full width. */
R('globe', function (m, params) {
  // (params.yaw and params.elev, in degrees, draw it from another view: the comparison with the old rest view, an image only)
  var RAD = Math.PI / 180, G = window.PLATE_GLOBE, YAW = (params && params.yaw != null ? params.yaw : -160) * RAD, ELEV = (params && params.elev != null ? params.elev : 62) * RAD;
  function ll(lat, lon, r) { var a = lat * RAD, b = lon * RAD, c = Math.cos(a) * r; return [c * Math.sin(b), Math.sin(a) * r, c * Math.cos(b)]; }
  function unwrap(list) { var pts = [[list[0][0], list[0][1]]], prev = list[0][1]; for (var i = 1; i < list.length; i++) { var lon = list[i][1]; while (lon - prev > 180) lon -= 360; while (lon - prev < -180) lon += 360; pts.push([list[i][0], lon]); prev = lon; } return pts; }
  function dens(pts, r, step) { var out = []; for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], (b[1] - a[1]) * Math.cos((a[0] + b[0]) / 2 * RAD)) / step)); for (var k = 0; k < n; k++) out.push(ll(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n, r)); } return out; }
  var g = m.part('globe', { ex: [0, 0, 0], seq: 0, mode: 'fixed', pri: 0 });
  m.globe(1, { fill: 'paper' });
  var gr; for (var lon = -180; lon < 180; lon += 30) { gr = []; for (var lat = -90; lat <= 90; lat += 3) gr.push(ll(lat, lon, 1)); m.swire(gr, { lw: 0.4, alpha: 0.5, back: 0 }); }
  for (lat = -60; lat <= 60; lat += 20) { gr = []; for (lon = -180; lon <= 180; lon += 3) gr.push(ll(lat, lon, 1)); m.swire(gr, { lw: lat === 0 ? 0.55 : 0.4, alpha: 0.5 }); }
  var rings = G.LAND.map(function (r) { return dens(unwrap(r), 1.0, 1.5); });
  var ant = G.ANT.map(function (q) { return [q[1], q[0]]; });
  var antRing = ant.map(function (q) { return ll(q[0], q[1], 1); }).concat([ll(-89.9, 180, 1), ll(-89.9, 90, 1), ll(-89.9, 0, 1), ll(-89.9, -90, 1), ll(-89.9, -180, 1)]);
  m.land(rings.concat([antRing]), { holes: G.HOLES, mat: 'steel' });
  rings.forEach(function (r, i) { m.swire(r.concat([r[0]]), { lw: G.HOLES.indexOf(i) >= 0 ? 0.45 : 0.6, alpha: 0.95 }); });
  m.swire(ant.map(function (q) { return ll(q[0], q[1], 1); }), { lw: 0.6, alpha: 0.95 });
  m.globe(1, { fill: 'paper' }).rim = true; // replaced below: the rim
  m.cur.items.pop(); m.S.pop();
  var rim = { kind: 'rim', part: g.idx, c: [0, 0, 0] }; m.cur.items.push(rim); m.S.push(rim);
  // the table's rows: [segment, leader, share in percent], and where each country's pins stand: [lat, lon] for each of its pins
  var ROWS = [['EUV lithography', 'Netherlands', 100.0], ['Immersion DUV lithography', 'Netherlands', 99.3], ['Metrology and inspection', 'United States', 71.7],
    ['Deposition', 'United States', 60.3], ['Etch and clean', 'United States', 52.6], ['Photoresist', 'Japan', 78], ['Silicon wafers', 'Japan', 53],
    ['Leading-edge logic, below 10 nm', 'Taiwan', 69], ['Foundry, all nodes', 'Taiwan', 81.9], ['HBM', 'South Korea', 82.5], ['Logic chip design', 'United States', 65],
    ['Mature logic, 28 nm and above', 'China', 33]];
  var AT = { 'Netherlands': [[52.0, 4.6], [52.5, 6.4]], 'United States': [[39.0, -104.0], [40.0, -99.0], [39.0, -94.0], [36.0, -99.0]], 'Japan': [[36.0, 137.6], [37.6, 139.8]],
    'Taiwan': [[23.4, 120.6], [24.4, 121.2]], 'South Korea': [[36.4, 127.9]], 'China': [[34.5, 104.0]] };
  var HMAX = 0.24, used = {}, PINS = {};
  ROWS.forEach(function (r, i) { var k = used[r[1]] || 0; used[r[1]] = k + 1; var at = AT[r[1]][k]; (PINS[r[1]] || (PINS[r[1]] = [])).push({ i: i, lat: at[0], lon: at[1], h: HMAX * r[2] / 100 }); });
  /* a country's pins: a foot ring on the surface at the country's base, and for each pin a spike straight up the page, as long as
     its share, side by side 8 px apart where the country leads several segments (each spike a part of its own, so a label lights
     its own country's) */
  var HEAD = {}, SPK = {};
  Object.keys(PINS).forEach(function (cn) {
    var ps = PINS[cn], lat = 0, lon = 0;
    ps.forEach(function (q) { lat += q.lat; lon += q.lon; }); lat /= ps.length; lon /= ps.length;
    var n = ll(lat, lon, 1), u = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], foot = [];
    var e1 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]], L1 = Math.hypot(e1[0], e1[1], e1[2]); e1 = [e1[0] / L1, e1[1] / L1, e1[2] / L1];
    var e2 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
    for (var q = 0; q <= 16; q++) { var t = q * TAU / 16; foot.push([n[0] + 0.016 * (e1[0] * Math.cos(t) + e2[0] * Math.sin(t)), n[1] + 0.016 * (e1[1] * Math.cos(t) + e2[1] * Math.sin(t)), n[2] + 0.016 * (e1[2] * Math.cos(t) + e2[2] * Math.sin(t))]); }
    ps.forEach(function (pq, k) {
      var p = m.part('pin' + pq.i, { ex: [n[0] * 0.35, n[1] * 0.35, n[2] * 0.35], seq: 1 + (pq.i % 6), pri: 1 });
      if (k === 0) m.wire(foot, { col: 'acc', lw: 0.8, vis: n, c: n });
      SPK[pq.i] = m.spike(n, pq.h, { col: 'acc', lw: 1.7, r: 3, sx: (k - (ps.length - 1) / 2) * 8 });
      HEAD[pq.i] = [n[0] * (1 + pq.h), n[1] * (1 + pq.h), n[2] * (1 + pq.h)];
      void p;
    });
  });
  // the Earth's axis as a centre line, and one label for each country, with leaders to its pins
  m.use(g);
  m.guide([[0, 1, 0, g.idx], [0, 1.3, 0, g.idx]], { style: 'axis', alpha: 0.9, front: true });
  m.guide([[0, -1.3, 0, g.idx], [0, -1, 0, g.idx]], { style: 'axis', alpha: 0.9 });
  var partOf = function (i) { return m.parts.filter(function (p) { return p.name === 'pin' + i; })[0].idx; };
  var head = function (q) { var v = HEAD[q.i]; return [v[0], v[1], v[2], partOf(q.i)]; };
  // the globe turns, so each label carries its country's pins (track): a leader fades in as a pin comes round to the label's
  // side and out as it nears the rim. The first pin sets the label's height in the drawn view
  /* (round two: the Netherlands named from the left, its leader shorter, and on a phone from the top row; Japan's leader runs by a
     point on the globe under Taiwan's base, so its label stands straight under Taiwan's rather than far below the others) */
  var VIA = { 'Japan': ll(15, 124, 1).concat([g.idx]) };
  [['Netherlands', 'l', 't'], ['United States', 'r'], ['China', 'l'], ['South Korea', 'l'], ['Japan', 'l'], ['Taiwan', 'l']].forEach(function (c) {
    var ps = PINS[c[0]];
    m.callout([head(ps[0])], c[0], { side: c[1], row: c[2] || 'b', via: VIA[c[0]] || null });
    var co = m.callouts[m.callouts.length - 1];
    co.track = ps.map(head);
    co.spikes = ps.map(function (q) { return SPK[q.i]; });
    co.focus = ps.map(function (q) { return partOf(q.i); });
  });
  return { noGround: true, elev: ELEV, yaw: YAW, spin: 0.06, start: 1, rest: 0, maxH: 430, trackRows: true, accent: [122, 31, 43], accentDark: [201, 83, 106] };
});

})(window.PLATE);}catch(e){console.warn('plate globe.js failed to load', e);}
/* plates/gpu-baseboard.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   13 Systems: an eight-GPU baseboard in the units of specimens/gpu-baseboard.js, simplified and not to scale (the caption
   says so): its sizes, 510 x 400 mm and 30 mm frames in the old file, have no allowed source, so the plate carries no
   dimension. Four of the eight accelerator modules lift off the board, showing the land grids they press onto.
   22 Nov 2026 review: each module now carries its package, drawn at this site's estimate for the B200 (95 x 68 mm, with its
   78 x 50 interposer and two logic dies, data/landscape-layouts.json) in the board's units, so no module is smaller than the
   package it carries (they were 75 x 83 mm against a 100 x 72 package). The two NVLink switch chips are silicon slate, so
   they show (they were a pale gray that almost disappeared). Colours (the set's legend): silicon slate only.
   22 Nov 2026 expert review: no source names a frame round each module (chapter 13 says the modules bolt onto a baseboard),
   so the "Module frames" label is gone and the caption says the modules are lifted off the board. The rims round each seat
   stay drawn, unlabelled. */
R('gpu-baseboard', function (m) {
  var U = 1.52 / 510; // board units per millimetre, if the board were drawn 510 mm wide
  var BW = 1.52, BD = 1.18, BH = 0.046, top = BH / 2, PKW = 68 * U, PKD = 95 * U, MH = 0.066, LW = PKW + 0.035, LD = PKD + 0.025, kerb = 0.022;
  var MW = LW + 0.024 + 2 * kerb + 0.006, MD = LD + 0.02 + 2 * kerb + 0.006; // each frame just clears its module
  var colX = [-0.525, -0.175, 0.175, 0.525], rowZ = 0.315;
  var board = m.part('board', { ex: [0, 0, 0], seq: 0, mode: 'stack' });
  var dec = [D.rect(-BW / 2 + 0.008, -BD / 2 + 0.008, BW / 2 - 0.008, BD / 2 - 0.008, top, { lw: 0.4, alpha: 0.5 })];
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { dec.push(D.circle(sx * (BW / 2 - 0.042), sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); dec.push(D.circle(sx * 0.352, sz * (BD / 2 - 0.03), 0.028, top, 20, { lw: 0.6 })); }); });
  var mods = [];
  colX.forEach(function (x) { [[-rowZ, 1], [rowZ, -1]].forEach(function (r) { mods.push([x, r[0], r[1]]); }); });
  // each module's seat inside its frame: the land-grid socket it presses onto
  mods.forEach(function (md) { dec.push({ dots: H.gridPts(11, 16, 0.017, 0.0175, top, md[0], md[1]), r: 0.6, alpha: 0.85, real: 'au' }); });
  // the board's traces, bundles from each switch chip out to the modules, seen through the solder mask
  [-0.175, 0.175].forEach(function (sx) { for (var tq = 0; tq < 7; tq++) { var oz = (tq - 3) * 0.012; [-1, 1].forEach(function (sz) { colX.forEach(function (cxq) { dec.push(D.poly([[sx + oz, top, sz * 0.11], [sx + oz, top, sz * 0.15], [cxq + oz, top, sz * 0.19]], { lw: 0.3, alpha: 0.55, real: 'trace' })); }); }); } });
  m.real('pcb');
  m.box({ c: [0, 0, 0], s: [BW, BH, BD], decals: { py: dec } }, 'steel');
  m.tag('frames'); m.real('steelDk');
  mods.forEach(function (md) { H.frame(m, [md[0], 0, md[1]], MW, MD, MW - 2 * kerb, MD - 2 * kerb, top, top + MH, 'light'); });
  m.tag(null);
  // the two NVLink switch chips, silicon
  m.tag('switch'); m.real('subMask');
  [-0.175, 0.175].forEach(function (x) {
    var SW = 0.24, SD = 0.2, SH = 0.05, d = [D.rect(-SW / 2 + 0.025, -SD / 2 + 0.025, SW / 2 - 0.025, SD / 2 - 0.025, SH / 2, { lw: 0.6 }), D.rect(-SW * 0.21, -SD * 0.22, SW * 0.21, SD * 0.22, SH / 2, { lw: 0.6, fill: { d: 0.4, real: 'siBack' } })];
    m.box({ c: [x, top + SH / 2, 0], s: [SW, SH, SD], decals: { py: d } }, 'acc');
  });
  m.tag(null);
  // voltage regulators down the long edges, bulk capacitors, power blades and connectors
  m.real('plastic');
  for (var i2 = 0; i2 < 13; i2++) { var vx = (i2 - 6) * 0.085; [-1, 1].forEach(function (s) { m.box({ c: [vx, top + 0.013, s * (BD / 2 - 0.05)], s: [0.044, 0.026, 0.044] }, 'mid'); }); }
  [-1, 1].forEach(function (s) { m.box({ c: [-BW / 2 + 0.062, top + 0.029, s * 0.17], s: [0.084, 0.058, 0.20] }, 'dark'); });
  for (i2 = 0; i2 < 4; i2++) { var pins = []; for (var k2 = 0; k2 < 14; k2++) pins.push(D.line([0.026, -0.017, (k2 - 6.5) * 0.0118], [0.026, 0.015, (k2 - 6.5) * 0.0118], { lw: 0.35, alpha: 0.8, real: 'au' })); m.box({ c: [BW / 2 - 0.042, top + 0.025, (i2 - 1.5) * 0.245], s: [0.052, 0.05, 0.185], decals: { px: pins } }, 'mid'); }
  // the modules, lifted off the board: each a small board carrying its package (the substrate, its interposer and two
  // logic dies, at this site's B200 estimate)
  // the back row lifts out; the front row stays seated, so the switch chips between the rows stay in view
  var mp = m.part('modules', { ex: [0, 0.26, 0], seq: 1, mode: 'stack' }), mpS = null;
  m.tag('modules');
  mods.forEach(function (md) {
    if (md[1] > 0 && !mpS) { mpS = m.part('seated', { ex: [0, 0, 0], seq: 1, mode: 'stack' }); m.tag('modules'); }
    if (md[1] < 0) m.use(mp); else m.use(mpS);
    var yL = top + MH - 0.016, pk = [];
    pk.push(D.rect(-PKW / 2, -PKD / 2, PKW / 2, PKD / 2, 0.011, { lw: 0.55, fill: 'paper', real: 'subMask' }));
    pk.push(D.rect(-25 * U, -39 * U, 25 * U, 39 * U, 0.011, { lw: 0.45, fill: 'mid', real: 'mould' }));
    [-1, 1].forEach(function (s) { pk.push(D.rect(-16.25 * U, (s * 13.5 - 13) * U, 16.25 * U, (s * 13.5 + 13) * U, 0.011, { lw: 0.4, fill: 'mid', real: 'siBack' })); });
    m.real('steelDk');
    m.box({ c: [md[0], yL - 0.0165, md[1]], s: [LW + 0.024, 0.011, LD + 0.02] }, 'mid');
    m.real('pcbDk');
    m.box({ c: [md[0], yL, md[1]], s: [LW, 0.022, LD], decals: { py: pk } }, 'light');
  });
  m.tag(null);
  m.use(mp);
  [mods[0], mods[6]].forEach(function (md) { [[-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(function (c) { m.guide([[md[0] + c[0] * (LW / 2 + 0.012), top, md[1] + c[1] * (LD / 2 + 0.01), board.idx], [md[0] + c[0] * (LW / 2 + 0.012), top + MH - 0.033, md[1] + c[1] * (LD / 2 + 0.01), mp.idx]], { alpha: 0.75 }); }); });
  // (designer pass, 22 Nov 2026: one leader, to the lifted module nearest the labels, which crosses nothing; the second ran
  // 93 px across the board to a seated one. Pointing at the label still lights all eight, by their tag)
  m.callout([mods[6][0] + 0.075, top + MH + 0.017, mods[6][1] - 0.045, mp.idx], 'Accelerator modules', { side: 'r', tag: 'modules' });
  // the nearer chip's top, its leader running down the aisle between the two rows of modules, by the board's right end, to its
  // label (22 Nov 2026 plates refine: it dropped steeply across the seated modules)
  m.callout([0.175 + 0.095, top + 0.05, 0.0, board.idx], 'NVLink switch chips', { side: 'r', tag: 'switch', via: [BW / 2 - 0.05, top + 0.05, 0.0, board.idx] });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate gpu-baseboard.js failed to load', e);}
/* plates/hbm-stack.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   09 Memory: a twelve-high HBM stack, pulled apart and cut open, in millimetres: an 11 x 11 mm footprint (this site's own
   estimate, data/landscape-layouts.json; the caption says so), the heights drawn far taller than they are.
   22 Nov 2026 review: the base die is silicon, so it is drawn in ink and copper means copper: the through-silicon vias and
   the microbumps, where the quarter cut passes through them. The loupe (LOUPE, below) carries only figures with an allowed
   source: microbumps about 20 micrometres apart (a tech note on SK hynix's newsroom, chapter 9) in a gap between dies as
   small as 7 micrometres (Samsung's 12-high HBM3E release, 27 Feb 2024, a record gap). The hair and the 30 micrometre die
   figure had none and are gone. Set LOUPE to false to drop it. Colours (the set's legend): copper only.
   22 Nov 2026 expert review: the loupe's caption says the dies are not to scale and gives the gap as "as small as 7 um" (it
   read as a typical gap); the 20 um bar has witness lines up to the bump row it measures; the gaps round the bumps are filled
   with a pale neutral, as film or underfill fills them (chapter 9), where they were empty, as if air.
   22 Nov 2026 plates refine: the base die stands further off the stack, about two and a half times the gap between memory
   dies, so it reads as a different part; the microbumps are named on the row under the lowest memory die, at its right
   end, their leader running out to the right, under the vias' (3 over 4); the base die is named from the left.
   24 Nov 2026 expert accuracy review (D10): no source gives the microbump pitch inside an HBM stack (the tech note's 20 um is
   a typical pitch in general), so the loupe names the microbumps with no pitch and its 20 um bar is gone. The bumps keep
   their drawn spacing, and the 7 um gap keeps its figure. */
var LOUPE = true;
R('hbm-stack', function (m) {
  var hw = 5.3, bw = 5.5, t = 0.45, bt = 0.9, gap0 = 0.105, pitch = t + gap0, EX = 0.62;
  var TX = 0.7, TZ = 0.8;
  function L(w) { return [[-w, -w], [w, -w], [w, 0], [0, 0], [0, w], [-w, w]]; }
  function tsvLines(y0, y1, w, tag) {
    var onZ = [], onX = [];
    for (var x = 0; x <= w - 0.2; x += TX) onZ.push(D.line([x + 0.0001, y0, 0], [x + 0.0001, y1, 0], { col: 'acc', lw: 2.0, edge: true, tag: tag, real: 'cu' }));
    for (var z = 0; z <= w - 0.2; z += TZ) onX.push(D.line([0, y0, z + 0.0001], [0, y1, z + 0.0001], { col: 'acc', lw: 2.0, edge: true, tag: tag, real: 'cu' }));
    return [onZ, onX];
  }
  function bumps(y, w) { var p = []; for (var x = 0; x <= w - 0.2; x += TX) p.push([x, y, 0]); for (var z = TZ; z <= w - 0.2; z += TZ) p.push([0, y, z]); return p; }
  // base die, silicon, in ink
  var base = m.part('base', { ex: [0, -1.15, 0], seq: 0 });
  var tb = tsvLines(-bt, 0, bw);
  var bl = [D.rect(-bw * 0.86, -bw * 0.43, bw * 0.86, -bw * 0.23, 0, { lw: 0.5 }), D.rect(-bw * 0.86, bw * 0.23, 0, bw * 0.43, 0, { lw: 0.5 })];
  m.real('siBase');
  m.prism(L(bw), -bt, 0, 'steel', { sideMat: { 2: 'cutDense', 3: 'cutDense' }, sideDecals: { 2: tb[0], 3: tb[1] }, top: bl });
  var under = [];
  for (var a = 0; a < 16; a++) for (var b = 0; b < 17; b++) { var ux = (a - 7.5) * 11 / 17, uz = (b - 8) * 11 / 18; if (!(ux > 0 && uz > 0)) under.push([ux, -bt - 0.12, uz]); }
  m.dots(under, { col: 'acc', r: 0.9, alpha: 0.5, real: 'cu' });
  // (22 Nov 2026 plates refine: named from the left, on its front face, so the microbumps' leader has the right to itself)
  m.anchor(2, 'Base die', [-bw * 0.55, -bt / 2, bw]);
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
    if (i === 11) o.top = []; // (the top die's ground back, plain)
    m.tag('dies'); m.real('siBack');
    m.prism(L(hw), yb, yb + t, 'light', o);
    m.tag('bumps');
    // the bumps are left out of the small stills (lod 1): at 52 px their twelve rows ran together into a copper band
    m.dots(bumps(yb - gap0 / 2 - 0.08, hw), { col: 'acc', r: 2.4, alpha: 1, lod: 1, real: 'cu', cap: true });
    m.tag(null);
    if (i === 10) m.anchor(1, 'Memory dies', [-hw, yb + t / 2, hw * 0.6]);
    // the vias' and the bumps' points sit low in the stack, so their leaders run short to labels under the loupe
    // (round two: the vias named in the second die's cut face, low enough that their label can stand level with its dot, under
    // the loupe's caption, over the bumps' label)
    if (i === 1) m.anchor(3, 'TSVs', [TX * 5, yb + t / 2, 0]);
    if (i === 0) m.anchor(4, 'Microbumps', [TX * 7, yb - gap0 / 2 - 0.08, 0]);
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
  var loupe = LOUPE ? { model: 'hbm-loupe', at: [TX * 2.5, gap0 + pitch * 9 + t / 2, hw * 0.55], part: 'die10', side: 'r', r: 0.155, rMax: 100, scale: 0.6, dx: -0.1, dy: 0.04, caption: ['Microbumps in a gap', 'as small as 7\u00a0\u00b5m.', 'Dies not to scale'] } : null;
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, calloutOpts: { 1: { tag: 'dies', only: 'ink' }, 2: { side: 'l' }, 3: { tag: 'tsv', only: 'accent', level: true }, 4: { tag: 'bumps', only: 'accent', side: 'r', level: true } }, order: { r: [3, 4] }, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});

/* The loupe's own small plate, in micrometres, seen almost face on so its cut face reads as a section: three dies with the
   microbumps between them, drawn 20 um apart with no figure (no source gives the pitch inside an HBM stack), in a
   7 um gap (the smallest in Samsung's 12-high HBM3E release), and a via through each die. The dies' thickness and the vias'
   width are drawn, not sourced, so they carry no figure, and the caption says the dies are not to scale. The gap round the
   bumps is filled in a pale neutral (film or underfill, chapter 9). */
R('hbm-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  function bx(x0, y0, z0, x1, y1, z1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], s: [x1 - x0, y1 - y0, z1 - z0], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  // (designer pass, 22 Nov 2026: the section is narrower and stands left of the disc's middle, so the gap's figure sits in
  // clear ground beside it and the die's name over the stack, neither on the cut faces nor past the disc's edge)
  var t = 30, g = 7, Z = 40, x0 = -50, x1 = 50, n = 3, P = 20, FILL = { d: 0.08 }, FILL_CUT = { d: 0.12 };
  for (var i = 0; i < n; i++) {
    var y0 = i * (t + g);
    m.real('siCut');
    bx(x0, y0, -Z, x1, y0 + t, Z, 'light', { pz: 'cut' });
    if (i < n - 1) {
      // the fill round the bumps, its cut face just behind theirs
      m.real('underfill');
      bx(x0, y0 + t, -Z, x1, y0 + t + g - 0.05, Z - 0.4, FILL, { pz: FILL_CUT });
      m.real('cu');
      for (var bp = x0 + 10; bp < x1 - 5; bp += P) bx(bp - 4.5, y0 + t, -2, bp + 4.5, y0 + t + g, Z, 'acc', { pz: 'cutAcc' });
    }
    m.real('cu');
    [x0 + 10, x0 + 70].forEach(function (vx) { bx(vx - 2.2, y0, -2, vx + 2.2, y0 + t, Z + 0.02, 'acc', { pz: 'cutAcc' }); });
  }
  bar(m, [x1 + 22, t, Z + 1], [x1 + 22, t + g, Z + 1], '7 \u00b5m', { side: 1 });
  tag(m, [-6, n * t + (n - 1) * g + 17, -Z], 'Memory die', {});
  return { elev: 0.16, yaw: -0.14, accent: [176, 102, 44], accentDark: [224, 154, 92] };
});

})(window.PLATE);}catch(e){console.warn('plate hbm-stack.js failed to load', e);}
/* plates/photomask.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   05 Photomasks: an EUV reticle and its pellicle, in millimetres: the glass 152.4 mm square and 6.35 mm thick (the SEMI 6025
   size, as Hoya's US patent 9,494,851 gives it), its pattern area 132 x 104 mm, four times the scanner's 26 x 33 mm field
   (ASML: the pattern is drawn four times larger than it prints), with the mirror coating as a band round its top edge,
   drawn far thicker than it is, and the pellicle frame, its four pads and its membrane lifted off it in turn.
   The loupe (mask-loupe, below) shows the coating's edge at true thickness, from the imec and PTB paper chapter 5 cites
   (arxiv.org/abs/1912.09075): about 40 molybdenum and silicon layer pairs of 7 nm each, a 3 nm ruthenium cap, and the
   absorber, 58 nm of TaBN under 2 nm of TaBO. Colours (the set's legend, 22 Nov 2026): the coating in silicon slate with dark
   lines, as the loupe shows it, silicon layers between molybdenum ones.
   22 Nov 2026 expert review: the glass is drawn 6.35 mm thick with the coating band on top of it, so the 6.35 mm dimension
   spans the glass alone (the glass was drawn 5.30 mm under the band, inside the 6.35); the loupe's ring sits in the pattern
   area, on one of the dark absorber bars, where the loupe's absorber lines are (it sat on the outer edge, outside the
   pattern).
   22 Nov 2026 plates refine: the mask is drawn at the first plates' size again, its loupe a quarter smaller (72 px, from 96;
   at 67 its four names no longer fitted inside the disc at 11.5 px) and tucked
   into the empty corner over the pellicle's right corner, still aimed into the pattern area; the mirror coating and the glass
   plate are named side by side in the left column, their dots on the band and on the glass just under it, by the plate's left
   corner, where their leaders come in over the 152.4 mm dimension rather than across its figure. */
R('photomask', function (m) {
  var B = 152.4, T = 6.35, ml = 1.05, PW = 132, PD = 104, yTop = T / 2 + ml; // yTop: the coating's top face, over the glass
  var blank = m.part('blank', { ex: [0, 0, 0], seq: 0 });
  var pat = [];
  var top = ml / 2;
  pat.push(D.rect(-71, -71, 71, 71, top, { lw: 0.45, alpha: 0.6 }));
  pat.push(D.rect(-PW / 2 - 5, -PD / 2 - 5, PW / 2 + 5, PD / 2 + 5, top, { lw: 0.7 }));
  pat.push(D.rect(-PW / 2, -PD / 2, PW / 2, PD / 2, top, { lw: 0.7 }));
  // the black border, a filled frame
  pat.push(D.poly([[-PW / 2 - 5, top, -PD / 2 - 5], [PW / 2 + 5, top, -PD / 2 - 5], [PW / 2 + 5, top, PD / 2 + 5], [-PW / 2 - 5, top, PD / 2 + 5]], { fill: 'black', lw: 0, alpha: 0.85, real: 'absorber' }));
  pat.push(D.poly([[-PW / 2, top, -PD / 2], [PW / 2, top, -PD / 2], [PW / 2, top, PD / 2], [-PW / 2, top, PD / 2]], { fill: 'paper', lw: 0.6, sheen: 0.12 }));
  var COLS = 7, ROWS = 5, cw = PW / COLS, cd = PD / ROWS, MAP = ['AABBCCD', 'AABBCCD', 'EEFFGGD', 'HHIIGGJ', 'HHKKLLJ'], seen = {}, keys = [];
  for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) { var ch = MAP[r][c]; if (!seen[ch]) { seen[ch] = { c0: c, c1: c, r0: r, r1: r }; keys.push(ch); } else { seen[ch].c1 = Math.max(seen[ch].c1, c); seen[ch].r1 = Math.max(seen[ch].r1, r); } }
  keys.forEach(function (key, bi) {
    var bk = seen[key], w = (bk.c1 - bk.c0 + 1) * cw - 4, d = (bk.r1 - bk.r0 + 1) * cd - 4;
    var x0 = ((bk.c0 + bk.c1) / 2 - (COLS - 1) / 2) * cw, z0 = ((bk.r0 + bk.r1) / 2 - (ROWS - 1) / 2) * cd, st = bi % 4;
    pat.push(D.rect(x0 - w / 2, z0 - d / 2, x0 + w / 2, z0 + d / 2, top, { lw: 0.6 }));
    if (st === 0) { var horiz = bi % 8 < 4, nl = Math.max(6, Math.round((horiz ? d : w) / 2.7)); for (var k = 0; k < nl; k++) { var tt = (k / (nl - 1) - 0.5) * 0.88; pat.push(horiz ? D.line([x0 - w * 0.44, top, z0 + tt * d], [x0 + w * 0.44, top, z0 + tt * d], { lw: 0.35, alpha: 0.8 }) : D.line([x0 + tt * w, top, z0 - d * 0.44], [x0 + tt * w, top, z0 + d * 0.44], { lw: 0.35, alpha: 0.8 })); } }
    else if (st === 1) { pat.push(D.rect(x0 - w * 0.47, z0 - d * 0.47, x0 + w * 0.47, z0 + d * 0.47, top, { fill: 'mid', lw: 0.3 })); pat.push(D.rect(x0 - w * 0.27, z0 - d * 0.27, x0 + w * 0.27, z0 + d * 0.27, top, { lw: 0.4 })); }
    else if (st === 2) { for (var qq = 1; qq <= 3; qq++) pat.push(D.rect(x0 - w * qq / 7.2, z0 - d * qq / 7.2, x0 + w * qq / 7.2, z0 + d * qq / 7.2, top, { lw: 0.4 })); }
    else { var nb = Math.max(3, Math.round(d / 9)); for (var b = 0; b < nb; b++) { var zz = z0 + (b / (nb - 1) - 0.5) * d * 0.76; pat.push(D.rect(x0 - w * 0.44, zz - d * 0.025, x0 + w * 0.44, zz + d * 0.025, top, { fill: 'dark', lw: 0.25 })); } }
  });
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { var fx = sx * (PW / 2 + 9), fz = sz * (PD / 2 + 9); pat.push(D.rect(fx - 4.5, fz - 4.5, fx + 4.5, fz + 4.5, top, { lw: 0.5 })); pat.push(D.rect(fx - 2, fz - 2, fx + 2, fz + 2, top, { lw: 0.5 })); }); });
  m.real('glass');
  m.box({ c: [0, 0, 0], s: [B, T, B] }, 'light');
  m.real('mlm');
  var band = [];
  for (var q = 1; q < 8; q++) { var yy = -ml / 2 + ml * q / 8; band.push(D.line([-B / 2, yy, B / 2], [B / 2, yy, B / 2], { lw: 0.3, alpha: 0.55 })); }
  var bandX = band.map(function (it) { return { pts: [[B / 2, it.pts[0][1], B / 2], [B / 2, it.pts[0][1], -B / 2]], lw: 0.3, alpha: 0.55 }; });
  m.box({ c: [0, yTop - ml / 2, 0], s: [B, ml, B], decals: { py: pat, pz: band, px: bandX } }, 'acc');
  m.dim([-B / 2, -T / 2, B / 2], [B / 2, -T / 2, B / 2], [0, 0, 12], '152.4 mm');
  // pads, frame, membrane
  var FW = 145, FD = 117, bar = 4.5, fh = 2.6, stand = 2.5;
  var pads = m.part('pads', { ex: [0, 15, 0], seq: 1 });
  m.real('steelDk');
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { m.box({ c: [sx * (FW / 2 - bar / 2), yTop + stand / 2, sz * (FD / 2 - bar / 2)], s: [5.5, stand, 5.5] }, 'dark'); }); });
  var fr = m.part('frame', { ex: [0, 30, 0], seq: 2 });
  m.real('alu');
  H.frame(m, [0, 0, 0], FW, FD, FW - 2 * bar, FD - 2 * bar, yTop + stand, yTop + stand + fh, 'steel');
  m.real('steelDk');
  m.box({ c: [FW * 0.22, yTop + stand + fh / 2, -(FD / 2 + 1.6)], s: [9, fh * 0.8, 4] }, 'mid');
  var mem = m.part('membrane', { ex: [0, 48, 0], seq: 3 });
  m.real('film');
  var yM = yTop + stand + fh;
  m.sheet([[-FW / 2 + bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, FD / 2 - bar], [-FW / 2 + bar, yM, FD / 2 - bar]], 'glass');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), blank.idx], [c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), pads.idx]], { alpha: 0.85 });
    m.guide([[c[0] * FW / 2, yTop + stand, c[1] * FD / 2, pads.idx], [c[0] * FW / 2, yTop + stand, c[1] * FD / 2, fr.idx]], { alpha: 0.85 });
    m.guide([[c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), fr.idx], [c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), mem.idx]], { alpha: 0.85 });
  });
  m.guide([[0, -T / 2 - 6, 0, blank.idx], [0, yM + 4, 0, mem.idx]], { style: 'axis', alpha: 0.8 });
  // (round two: the glass's dot further along the face, so the two dots read apart)
  m.callout([-B / 2 + 45, 1.2, B / 2, blank.idx], 'Glass plate', { side: 'l' });
  m.dim([B / 2, -T / 2, B / 2], [B / 2, T / 2, B / 2], [10, 0, 0], '6.35 mm', { t: 0.5, part: blank.idx });
  // (on a phone, in rows, the coating is named on the right face, by the corner, where its upright leader crosses nothing: on
  // the left face it ran through the 152.4 mm figure)
  m.callout([-B / 2 + 11, yTop - ml / 2, B / 2, blank.idx], 'Mirror coating', { side: 'l', rowAt: [B / 2, yTop - ml / 2, -B * 0.34, blank.idx] });
  m.callout([-FW * 0.28, yM, FD * 0.22, mem.idx], 'Pellicle', { side: 'l' });
  // the ring on the coating's top face, in the pattern area: on one of the dark bars of the block in the pattern's right-hand
  // column (block D of MAP, its last bar, so the cone's lower edge passes clear of the glass plate's leader), the absorber
  // lines the loupe cuts across
  var ringAt = [3 * cw, yTop, -PD / 2 + 3 * cd / 2 + (5 / 5 - 0.5) * (3 * cd - 4) * 0.76];
  // (tuck: the disc in the drawing's empty top right corner, over the pellicle's right corner, its caption beside its upper
  // half, over the pellicle; under 560 px it stands in the foot's corner as before)
  var loupe = { model: 'mask-loupe', at: ringAt, part: 'blank', side: 'r', r: 0.11, rMax: 72, scale: 0.615, dx: -0.256, dy: 0.03, inset: 26, tuck: 'tr', tdx: -58, tdy: 14, capSide: 'l', capDy: -46, caption: ['A cut through the pattern,', 'at true thickness'] };
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

/* The loupe's plate, in nanometres, seen almost face on so its cut face reads as a section: the glass, about forty pairs of
   layers, the 3 nm ruthenium cap, and two lines of absorber 60 nm tall (58 nm TaBN and 2 nm TaBO, "nominally 60nm thick"),
   all from the imec and PTB paper chapter 5 cites (arxiv.org/abs/1912.09075). Only the absorber's height and the pair count
   carry figures.
   22 Nov 2026 expert review: each pair is drawn as the paper's Table 1 gives its sublayers, top down: a silicon-like layer of
   1.435 nm, an interlayer of 1.215, molybdenum 1.807, an interlayer of 1.422 and a silicon-like layer of 1.151, so silicon
   sits directly under the ruthenium cap (molybdenum sat there, each pair drawn half and half). The absorber's bar reads
   60 nm, the absorber's whole height (it read 58 nm, the TaBN alone, over both layers).
   22 Nov 2026 designer pass: the section stands left of the disc's middle and its names stand in the clear ground to its
   right, so none is laid over the layers it names: the absorber's name over the line it names with its height beside it, the
   pairs named by a bar the height of the stack, the glass by a short leader. The heights keep their true proportion. */
R('mask-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  function bx(x0, y0, x1, y1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, 0], s: [x1 - x0, y1 - y0, 60], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  var X0 = -130, X1 = 90, NP = 40, g0 = -40, gB = g0 - 40;
  // (the glass ruled open at 45 degrees, the absorber close at 135: two materials, two rulings)
  m.real('glass');
  bx(X0, gB, X1, g0, 'light', { pz: { d: 0.03, hatch: 1, ang: 45, gap: 3.6 } });
  // a pair's sublayers bottom up (Table 1 read from the glass): silicon-like, interlayer, molybdenum, interlayer, silicon-like.
  // The stack is one block in silicon's slate, the molybdenum laid on its cut face as bands with no outline (drawn as 160 blocks,
  // their outlines turned the stack black). 22 Nov 2026 plates refine: two values, molybdenum darker and silicon lighter; the
  // interlayers, where the two mix, are drawn with the silicon (three values, molybdenum near ink, read as a black block)
  var MO = { d: 0.5, real: 'mo' };
  var SUBL = [[1.151, null], [1.422, null], [1.807, MO], [1.215, null], [1.435, null]], y = g0, bands = [];
  for (var i = 0; i < NP; i++) SUBL.forEach(function (q) { if (q[1]) bands.push([y, y + q[0], q[1]]); y += q[0]; });
  var yc = y, cyS = (g0 + yc) / 2, hx = (X1 - X0) / 2, ZF = 30;
  m.real('siCut');
  m.box({ c: [(X0 + X1) / 2, cyS, 0], s: [X1 - X0, yc - g0, 60], decals: { pz: bands.map(function (q) { return D.poly([[-hx, q[0] - cyS, ZF], [hx, q[0] - cyS, ZF], [hx, q[1] - cyS, ZF], [-hx, q[1] - cyS, ZF]], { fill: q[2], lw: 0 }); }) } }, 'acc');
  m.real('ru');
  bx(X0, yc, X1, yc + 3, 'mid');
  m.real('absorber');
  [[-104, -64], [8, 48]].forEach(function (a) { bx(a[0], yc + 3, a[1], yc + 3 + 60, 'dark', { pz: { d: 0.04, hatch: 2, ang: 135, gap: 1.9 } }); });
  /* 22 Nov 2026 plates refine: the disc is a quarter smaller, tucked into the photomask's empty corner, so the names stand
     in one column right of the section, each inside the disc: the absorber's name over its height, the pairs' bar under it,
     the glass by a short leader (the absorber's name stood over the section, on the disc's rim) */
  bar(m, [X1 + 20, yc + 3, 30], [X1 + 20, yc + 63, 30], '60 nm', { side: 1, wit: [[48, yc + 3, 30], [48, yc + 63, 30]] });
  tag(m, [X1 + 10, yc + 63, 30], 'Absorber', { align: 'left', dy: -10 });
  bar(m, [X1 + 20, g0, 30], [X1 + 20, yc, 30], 'About 40\nlayer\npairs', { side: 1 });
  tag(m, [X1 + 30, gB - 30, 30], 'Glass', { align: 'left', lead: [X1 - 30, (gB + g0) / 2, 30] });
  return { elev: 0.06, yaw: -0.05, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate photomask.js failed to load', e);}
/* plates/probe-card.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   12 Test: a vertical probe card over a wafer, in the units of specimens/probe-card.js (the wafer 1 unit in radius,
   150 mm). The card, its space transformer and its probe head of needles come apart over the wafer. Heights and the gap
   are exaggerated, as the caption says.
   22 Nov 2026 review: the dies are 26 x 33 mm, the largest field a scanner prints (ASML, chapters 1 and 10); they were
   30 x 36.75 mm. The needles stand in ordered rows of equal length, a few rows standing for thousands (the caption says
   so); they were a random bowed tangle. The card's rim ticks, which read as a dial, are gone. The card's size (305 mm in
   the old file) has no allowed source and carries no figure. Colours (the set's legend): the wafer in silicon slate, the
   four dies under the needles in a deeper slate.
   24 Nov 2026 expert accuracy review (D4): a vertical probe card on an AI processor lands on an area array of bumps across the
   die's face (FormFactor), so the needles stand in a sparse grid across each die, four columns by five rows, where they stood
   in a row along each long edge, which reads as a perimeter-pad chip. */
R('probe-card', function (m) {
  var Rw = 1.0, Rc = 1.02, Rch = 1.08, tW = 0.028, wT = tW / 2, dw = 26 / 150, dh = 33 / 150;
  var yLo = wT + 0.082, tG = 0.02, yLoT = yLo + tG, yUp = yLoT + 0.082, yUpT = yUp + tG, stH = 0.10, yST = yUpT + 0.052, stW = 0.5, tP = 0.052, pB = yST + stH + 0.03, pT = pB + tP;
  var ch = m.part('chuck', { ex: [0, -0.10, 0], seq: 0 });
  m.real('ni');
  m.cyl([0, -wT - 0.065, 0], Rch, 0.13, 'turned', { seg: 64, top: [0.42, 0.68, 0.94, 1.06].map(function (r) { return D.circle(0, 0, r, 0.065, 64, { lw: 0.4, alpha: 0.6 }); }) });
  var wf = m.part('wafer', { ex: [0, 0, 0], seq: 1 });
  var shape = []; for (var k = 0; k < 96; k++) { var a = k * TAU / 96; if (k === 24) { shape.push([0.05, 0.998]); shape.push([0, 0.96]); shape.push([-0.05, 0.998]); continue; } shape.push([Rw * Math.cos(a), Rw * Math.sin(a)]); }
  var dies = [], probed = [];
  for (var gx = -6; gx <= 5; gx++) for (var gz = -5; gz <= 4; gz++) {
    var cx = (gx + 0.5) * dw, cz = (gz + 0.5) * dh, cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < 0.96; })) continue;
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) { probed.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { fill: 'accDark', lw: 0.6, col: 'acc', keep: true, tag: 'dies', real: 'siProbed', sheen: 0.18 })); continue; }
    dies.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { lw: 0.4, alpha: 0.35, fill: 'steel', sheen: 0.18 }));
  }
  m.real('siProc');
  m.prism(shape, -wT, wT, 'accLight', { smooth: true, top: dies.concat(probed) });
  // the probe head: two guide plates and the needles bowed between them
  var hd = m.part('head', { ex: [0, 0.34, 0], seq: 2 });
  m.real('granite');
  [yLo, yUp].forEach(function (y) { m.box({ c: [0, y + tG / 2, 0], s: [0.4, tG, 0.4] }, 'mid'); });
  m.real('ni');
  // the needles: on each die, a sparse grid across its face, where an AI chip's bumps are, a few standing for thousands; each
  // needle the same length, bowed the same way between the guide plates, as a vertical probe's needle is
  m.tag('needles');
  for (gx = -1; gx <= 0; gx++) for (gz = -1; gz <= 0; gz++) {
    var ox = (gx + 0.5) * dw, oz = (gz + 0.5) * dh;
    [-0.36, -0.12, 0.12, 0.36].forEach(function (fx) {
      [-0.36, -0.18, 0, 0.18, 0.36].forEach(function (fz) {
        var qx = ox + dw * fx, qz = oz + dh * fz, bo = 0.012;
        m.wire([[qx, wT + 0.004, qz], [qx, yLo + tG * 0.4, qz], [qx + bo, (yLoT + yUp) / 2, qz], [qx, yUp + tG * 0.6, qz], [qx, yUpT + 0.004, qz]], { lw: 0.6, alpha: 0.85 });
      });
    });
  }
  m.tag(null);
  // the space transformer: multi-layer ceramic
  var st = m.part('transformer', { ex: [0, 0.66, 0], seq: 3 });
  var lines = []; for (k = 1; k < 7; k++) lines.push(-stH / 2 + stH * k / 7);
  var side = function (face) { return lines.map(function (y) { var p = face === 'pz' ? [[-stW / 2, y, stW / 2], [stW / 2, y, stW / 2]] : face === 'px' ? [[stW / 2, y, -stW / 2], [stW / 2, y, stW / 2]] : face === 'nx' ? [[-stW / 2, y, -stW / 2], [-stW / 2, y, stW / 2]] : [[-stW / 2, y, -stW / 2], [stW / 2, y, -stW / 2]]; return { pts: p, lw: 0.4, alpha: 0.8 }; }); };
  m.real('ceramic');
  m.box({ c: [0, yST + stH / 2, 0], s: [stW, stH, stW], decals: { pz: side('pz'), px: side('px'), nx: side('nx'), nz: side('nz'), py: [{ dots: H.gridPts(13, 13, stW * 0.07, stW * 0.07, stH / 2, 0, 0), r: 0.9, alpha: 0.75, real: 'au' }] } }, 'light');
  // the printed circuit board and the stiffener over it
  var pc = m.part('card', { ex: [0, 1.12, 0], seq: 4, mode: 'stack' });
  var pads = [];
  [[0.56, 72], [0.66, 84], [0.76, 96]].forEach(function (r) { var d = []; for (var i = 0; i < r[1]; i++) { var aa = i * TAU / r[1]; d.push([r[0] * Math.cos(aa), tP / 2, r[0] * Math.sin(aa)]); } pads.push({ dots: d, r: 1.1, ring: true, alpha: 0.85, real: 'au' }); });
  // the board's traces, run in from its pads toward the centre
  for (var tr = 0; tr < 72; tr++) { var ta = tr * TAU / 72 + 0.02; pads.push(D.line([0.25 * Math.cos(ta), tP / 2, 0.25 * Math.sin(ta)], [0.54 * Math.cos(ta), tP / 2, 0.54 * Math.sin(ta)], { lw: 0.3, alpha: 0.6, real: 'trace' })); }
  m.real('pcb');
  m.cyl([0, pB + tP / 2, 0], Rc, tP, 'turned', { seg: 72, top: pads });
  m.real('steel');
  [0, Math.PI / 2].forEach(function (ang) { m.box({ c: [0, pT + 0.025, 0], s: [1.72, 0.05, 0.105], rot: [0, ang, 0] }, 'mid'); });
  m.cyl([0, pT + 0.0375, 0], 0.2, 0.075, 'turnedDark', { seg: 32 });
  for (var i = 0; i < 3; i++) { var la = i * TAU / 3 + 0.4; m.cyl([0.30 * Math.cos(la), pT + 0.0525, 0.30 * Math.sin(la)], 0.036, 0.105, 'turned', { seg: 14 }); }
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * 0.2, wT, c[1] * 0.2, wf.idx], [c[0] * 0.2, yLo, c[1] * 0.2, hd.idx]], { alpha: 0.8 });
    m.guide([[c[0] * 0.2, yUpT, c[1] * 0.2, hd.idx], [c[0] * stW / 2, yST, c[1] * stW / 2, st.idx]], { alpha: 0.8 });
    m.guide([[c[0] * stW / 2, yST + stH, c[1] * stW / 2, st.idx], [c[0] * stW / 2, pB, c[1] * stW / 2, pc.idx]], { alpha: 0.8 });
  });
  m.guide([[0, -0.3, 0, ch.idx], [0, pT + 0.2, 0, pc.idx]], { style: 'axis', alpha: 0.8 });
  m.callout([0.62, pT, -0.3, pc.idx], 'Probe card', { side: 'r' });
  m.callout([-dw * 0.38 + 0.012, (yLoT + yUp) / 2, 0.5 * dh, hd.idx], 'Needles', { side: 'l', tag: 'needles' });
  m.callout([-0.62, wT, 0.72, wf.idx], 'Wafer', { side: 'l' });
  m.callout([dw * 0.5, wT, dh * 0.5 + 0.04, wf.idx], 'Dies under test', { side: 'r', tag: 'dies' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate probe-card.js failed to load', e);}
/* plates/process-chamber.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   06 Deposition and etch: a plasma etch chamber cut in half, in metres, around one wafer on its chuck. Only the wafer is a true
   size, 300 mm across and 775 micrometres thick (SEMI M1); the chamber's own sizes (a 500 mm bore, a 30 to 40 mm plasma gap)
   came from the old specimen file with no allowed source, so the plate carries no dimension and the caption says the
   chamber is drawn for illustration (22 Nov 2026 review).
   The plasma is a crisp violet lens, a revolved solid in a clear violet, with two fine lines over the wafer for the sheath
   (it was 900 random dots, some outside the gap). The gas feed on the lid lifts off and the pump drops away below, each
   labelled in the chapter's words ("a pump empties the chamber", "a measured flow of gas comes in"); the gate valve is left
   out. The loupe (etch-loupe) shows one hole cut ten times deeper than it is wide, the ratio from which US rules have
   controlled the tools that etch holes through silicon since December 2024 (chapter 6). Colours (the set's legend): the
   plasma in violet, the wafer in silicon slate (acc2), as on every plate. */
R('process-chamber', function (m) {
  var yaw = PLATE.DIM.yaw, h = farHalf(yaw), a0 = h[0], a1 = h[1], tv = h[2];
  var rI = 0.25, rO = 0.292, yTop = 0.16, yBot = -0.212, yLid = 0.19, yFlo = -0.242;
  var O = { a0: a0, a1: a1, cut: 'cut', seg: 56 };
  function o(extra) { var r = {}; for (var k in O) r[k] = O[k]; for (k in extra) r[k] = extra[k]; return r; }
  var ves = m.part('vessel', { pri: 0 });
  m.real('aluCh');
  var vs = m.revolve([[0.058, yTop], [rI, yTop], [rI, yBot], [0.105, yBot], [0.105, yFlo], [rO, yFlo], [rO, yLid], [0.058, yLid]], 'turned', o({ innerMat: { d: 0.05, real: 'yttria' } }));
  // the slit valve the wafer travels through, in the far wall, and a viewport
  var svA = tv + Math.PI, sv = [];
  for (var k = 0; k <= 16; k++) { var aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 + 0.03, rI * 0.995 * Math.sin(aa)]); }
  for (k = 16; k >= 0; k--) { aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 - 0.03, rI * 0.995 * Math.sin(aa)]); }
  m.decal(vs, [-Math.cos(svA), 0, -Math.sin(svA)], [{ pts: sv, closed: true, fill: 'mid', lw: 0.8 }]);
  // chuck: aluminium base, ceramic puck, focus ring and stem
  var chk = m.part('chuck', { pri: 1, mode: 'fixed' });
  var yPed = -0.025, pedH = 0.088;
  m.real('alu');
  m.revolve([[0.058, yFlo], [0.072, yFlo], [0.072, yPed - pedH], [0.058, yPed - pedH]], 'turned', o({}));
  m.revolve([[0, yPed - pedH], [0.17, yPed - pedH], [0.17, yPed - 0.014], [0, yPed - 0.014]], 'turned', o({}));
  m.real('ceramic');
  m.revolve([[0, yPed - 0.014], [0.17, yPed - 0.014], [0.17, yPed], [0, yPed]], 'turnedDark', o({ cut: 'cutDense' }));
  m.real('siCut');
  m.revolve([[0.154, yPed], [0.185, yPed], [0.185, yPed + 0.010], [0.154, yPed + 0.010]], 'turnedDark', o({ cut: 'cutDense' }));
  // the wafer, at its true thickness
  var wfp = m.part('wafer', { pri: 2 });
  var WT = 0.000775;
  m.real('siProc');
  // (the wafer under etch carries its die grid)
  var wTop = [];
  for (var gx = -6; gx <= 6; gx++) for (var gz = -6; gz <= 6; gz++) { var dx0 = gx * 0.024, dz0 = gz * 0.03; if (dx0 * dx0 + dz0 * dz0 > 0.128 * 0.128) continue; var an0 = Math.atan2(dz0, dx0); var dA = an0 - (a0 + a1) / 2; while (dA > Math.PI) dA -= TAU; while (dA < -Math.PI) dA += TAU; if (Math.abs(dA) > (a1 - a0) / 2 - 0.08) continue; wTop.push(D.rect(dx0 - 0.011, dz0 - 0.014, dx0 + 0.011, dz0 + 0.014, yPed + WT, { lw: 0.3, alpha: 0.55, fill: 'steel', sheen: 0.18 })); }
  m.revolve([[0, yPed], [0.15, yPed], [0.15, yPed + WT], [0, yPed + WT]], 'acc2Light', o({ cut: 'cutAcc2', top: wTop }));
  // the plasma: a lens of clear violet between the wafer and the showerhead, and two fine lines just over the wafer, the sheath
  var plp = m.part('plasma', { pri: 3 });
  var gTop = 0.058, gBot = yPed + 0.006, gR = 0.168, PL = { d: 0.16, c: 'acc', alpha: 0.6 };
  m.real('plasma');
  m.revolve([[0, gBot], [gR * 0.9, gBot], [gR, gBot + 0.008, 0], [gR * 1.02, (gBot + gTop) / 2, 0], [gR, gTop - 0.008, 0], [gR * 0.9, gTop], [0, gTop]], PL, o({ cut: { d: 0.22, c: 'acc' }, seg: 56 }));
  [0.0035, 0.0065].forEach(function (dy) { var sh = []; for (var k2 = 0; k2 <= 24; k2++) { var an = a0 + (a1 - a0) * k2 / 24; sh.push([0.15 * Math.cos(an), yPed + WT + dy, 0.15 * Math.sin(an)]); } m.wire(sh, { col: 'acc', lw: 0.6, alpha: 0.85, c: [0, yPed + 0.01, 0] }); });
  // showerhead: face plate, plenum wall, backing plate, with its gas holes cut through the face plate
  m.part('shower', { pri: 4 });
  m.real('alu');
  var holes = [];
  for (var rr = 0.012; rr < 0.2; rr += 0.0132) holes.push({ pts: [[rr, 0.0625], [rr, 0.0915]].map(function (q) { return [q[0], q[1], 0]; }), col: 'bg', lw: 1.1 });
  var hcut = function (arr) { return arr.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1]]; }), col: it.col, lw: it.lw }; }); };
  m.revolve([[0, 0.062], [0.205, 0.062], [0.205, 0.142], [0, 0.142], [0, 0.128], [0.193, 0.128], [0.193, 0.092], [0, 0.092]], 'turned', o({ cut0: hcut(holes), cut1: hcut(holes) }));
  // the lid feed: gas in, RF on, lifted off
  var lid = m.part('lid', { pri: 5, ex: [0, 0.10, 0], seq: 1 });
  m.real('steel');
  m.revolve([[0.03, yLid], [0.058, yLid], [0.058, yLid + 0.078], [0.03, yLid + 0.078]], 'turned', o({}));
  m.real('steel');
  m.revolve([[0.03, yLid + 0.078], [0.086, yLid + 0.078], [0.086, yLid + 0.10], [0.03, yLid + 0.10]], 'turnedDark', o({}));
  m.real('steel');
  m.revolve([[0, yLid + 0.10], [0.026, yLid + 0.10], [0.026, yLid + 0.152], [0, yLid + 0.152]], 'turned', o({}));
  m.guide([[0, yLid, 0, ves.idx], [0, yLid + 0.17, 0, lid.idx]], { style: 'axis', alpha: 0.85 });
  // the turbopump, dropped away below
  var pump = m.part('pump', { pri: -2, ex: [0, -0.07, 0], seq: 3 });
  m.real('alu');
  var bl = [];
  for (k = 0; k < 30; k++) { var ba = k * TAU / 30; bl.push(D.line([0.046 * Math.cos(ba), 0.074, 0.046 * Math.sin(ba)], [0.128 * Math.cos(ba + 0.3), 0.074, 0.128 * Math.sin(ba + 0.3)], { lw: 0.4, alpha: 0.75 })); }
  m.revolve([[0, -0.074], [0.146, -0.074], [0.146, 0.074], [0.13, 0.074], [0.13, 0.068], [0, 0.068]], 'turned', { seg: 40, pos: [0, yFlo - 0.2, 0], top: bl.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1] - 0.006, q[2]]; }), lw: 0.4, alpha: 0.7 }; }) });
  m.real('steel');
  m.cyl([0.228, yFlo - 0.23, 0], 0.03, 0.165, 'turned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.guide([[0, yFlo, 0, ves.idx], [0, yFlo - 0.36, 0, pump.idx]], { style: 'axis', alpha: 0.85 });
  var cu = [Math.cos(a0), Math.sin(a0)], cw = [Math.cos(a1), Math.sin(a1)];
  m.callout([0.03 * cw[0], yLid + 0.13, 0.03 * cw[1], lid.idx], 'Gas in', { side: 'r' });
  // (designer pass, 22 Nov 2026: the plasma is named from the right, on the lens's own cut face, and the loupe takes the wafer's
  // left side, so neither the plasma's leader nor the loupe's cone runs across the whole chamber)
  m.callout([0.1 * cw[0], 0.03, 0.1 * cw[1], plp.idx], 'Plasma', { side: 'r' });
  m.callout([0.148 * cw[0], yPed + WT, 0.148 * cw[1], wfp.idx], 'Wafer', { side: 'r' });
  // (22 Nov 2026 plates refine: the chuck named straight across from its cut face, from the right, under the wafer, since the
  // loupe's caption fills the left column at its height; the pump half as far below; on a phone the loupe at most 60 percent
  // of the chamber's width)
  m.callout([0.13 * cw[0], yPed - 0.084, 0.13 * cw[1], chk.idx], 'Chuck', { side: 'r', level: true });
  m.callout([0.146 * cw[0], yFlo - 0.2, 0.146 * cw[1], pump.idx], 'Pump', { side: 'r' });
  var lt = a0 + 0.55, loupe = { model: 'etch-loupe', at: [0.1 * Math.cos(lt), yPed + WT, 0.1 * Math.sin(lt)], part: 'wafer', side: 'l', r: 0.15, rMax: 92, scale: 0.8, dx: -0.12, rPhone: 52, caption: ['A hole ten times', 'deeper than it is wide'] };
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, loupe: loupe, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

/* The loupe's plate: a cut through the wafer's surface with one hole etched into it, ten times deeper than it is wide, the
   ratio in the US rule of December 2024 that chapter 6 cites. The hole's real size depends on the chip, so it carries no
   figure; the ratio is the point. A mask of photoresist lies on top, opened over the hole.
   22 Nov 2026 designer pass: one block of silicon, cut down the hole's axis and seen a little from above, so the hole reads as
   a round hole, its far half a curved wall and its mouth a half circle in the top face (it was three separate boxes, which read
   as two pillars with a slot between them). The names stand beside the block, each with a short leader. */
R('etch-loupe', function (m) {
  var tag = PLATE.loupeTag;
  m.part('st', { mode: 'stack' });
  var W = 1, Dp = 10, X0 = -3.1, X1 = 3.1, Y0 = -Dp - 1.5, RT = 0.7, Dz = 2.6, N = 14;
  /* a block x X0..X1, y ya..yb, z -Dz..0 (its cut face toward the reader at z = 0), with the far half of a round hole of
     radius r down its axis from its top to y = yh (a blind hole has a floor there; yh = ya runs it through) */
  // the hole's wall a shade deeper than the block's faces, so it reads as a hollow
  var wallMat = { d: 0.42, c: 'acc2', even: true, real: 'siHole' };
  function holeBlock(ya, yb, yh, r, mat, cutMat, blind) {
    var s = m.begin(mat, { sortFaces: true }), v = function (x, y, z) { return m.v([x, y, z]); };
    var th = []; for (var j = 0; j <= N; j++) th.push(Math.PI + Math.PI * j / N);
    var At = th.map(function (t) { return v(r * Math.cos(t), yb, r * Math.sin(t)); }), Ab = th.map(function (t) { return v(r * Math.cos(t), yh, r * Math.sin(t)); });
    var T0 = v(X0, yb, 0), T1 = v(X1, yb, 0), T2 = v(X1, yb, -Dz), T3 = v(X0, yb, -Dz), B0 = v(X0, ya, 0), B1 = v(X1, ya, 0), B2 = v(X1, ya, -Dz), B3 = v(X0, ya, -Dz);
    var cut = { mat: cutMat };
    if (blind) m.face([B0, B1, T1, At[N], Ab[N], Ab[0], At[0], T0], [0, 0, 1], cut);
    else { m.face([B0, Ab[0], At[0], T0], [0, 0, 1], cut); m.face([Ab[N], B1, T1, At[N]], [0, 0, 1], cut); }
    m.face([T0, At[0]].concat(At.slice(1, N), [At[N], T1, T2, T3]), [0, 1, 0]);
    m.face([B1, B2, T2, T1], [1, 0, 0]); m.face([B0, T0, T3, B3], [-1, 0, 0]); m.face([B3, T3, T2, B2], [0, 0, -1]);
    if (blind) m.face([B0, B3, B2, B1], [0, -1, 0]); else m.face([B0, B3, B2, B1, Ab[N]].concat(Ab.slice(1, N).reverse(), [Ab[0]]), [0, -1, 0]);
    for (j = 0; j < N; j++) {
      var tm = (th[j] + th[j + 1]) / 2;
      m.face([Ab[j], Ab[j + 1], At[j + 1], At[j]], [-Math.cos(tm), 0, -Math.sin(tm)], { curve: true, mj: j, mat: wallMat });
      if (j > 0) m.ecls(Ab[j], At[j], 0);
    }
    if (blind) m.face(Ab.slice(), [0, 1, 0]);
    return m.end();
  }
  m.real('siCut');
  holeBlock(Y0, 0, -Dp, W / 2, 'acc2Light', 'cutAcc2', true);
  m.real('resist');
  holeBlock(0, RT, 0, W / 2, 'mid', { d: 0.08, hatch: 1, ang: 45, gap: 2.2 }, false);
  tag(m, [X1 + 1.5, RT + 1.1, 0], 'Resist', { align: 'left', lead: [X1 - 0.6, RT, -0.9] });
  tag(m, [X1 + 1.5, -6.2, 0], 'Silicon', { align: 'left', lead: [X1, -5.2, -1.1] });
  return { elev: 0.3, yaw: -0.32, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate process-chamber.js failed to load', e);}
/* plates/rack.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   14 Data centers: a liquid-cooled rack of 72 GPUs, the GB200 NVL72, to scale in metres, as Supermicro's February 2025
   datasheet gives it: 2,236 mm tall, 600 mm wide and 1,068 mm deep, eighteen 1U compute trays (ten above the nine NVLink
   switch trays, eight below), eight 1U power shelves of 33 kW, and a 4U coolant unit. Three trays slide out of the front the
   way they are serviced: a compute tray, a switch tray and one of the power shelves. The copper busbar they plug into is
   drawn pulled back out of the rear.
   22 Nov 2026 review: six power shelves became the datasheet's eight; the height reads 2,236 mm (it read 2.24 m, a rounding);
   the busbar is plain, since its clips stood beside the height like a ruler's graduations, and its two centre lines,
   which cut the height dimension, are gone. Colours (the set's legend): the
   busbar in copper, the power shelves in the set's one steel colour, a grey with no hue (22 Nov 2026 plates refine: it was
   a blue grey, which read as silicon's slate). */
R('rack', function (m) {
  var W = 0.60, Dp = 1.068, Ht = 2.236, U = 0.0445, post = 0.042, front = Dp / 2, back = -Dp / 2;
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0 });
  m.real('black');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { m.box({ c: [q[0] * (W / 2 - post / 2), Ht / 2, q[1] * (Dp / 2 - post / 2)], s: [post, Ht, post] }, 'mid'); });
  m.box({ c: [0, 0.045, 0], s: [W, 0.09, Dp] }, 'mid');
  m.box({ c: [0, Ht - 0.031, 0], s: [W, 0.062, Dp] }, 'steel');
  [-1, 1].forEach(function (s) { m.box({ c: [s * (W / 2 - 0.004), 0.09 + (Ht - 0.22) / 2, 0], s: [0.008, Ht - 0.22, Dp - 0.10] }, 'ghost'); });
  m.real('black');
  // the trays, floor up: [kind, count, gap above]
  var y = 0.114, slots = [];
  [['cdu', 4, 0.040], ['power', 4, 0.030], ['compute', 8, 0.020], ['switch', 9, 0.020], ['compute', 10, 0.030], ['power', 4, 0.026], ['mgmt', 1, 0]].forEach(function (s) { for (var i = 0; i < s[1]; i++) { slots.push({ k: s[0], y: y + U / 2 }); y += U; } y += s[2]; });
  var stackTop = y, tW = 0.522, tH = U * 0.9, fz = front - 0.012, tz0 = back + 0.10, tD = fz - tz0, tzc = (fz + tz0) / 2;
  var pullIdx = { 6: 1, 20: 2, 30: 3 }; // a power shelf, a switch tray, a compute tray
  function tray(sl, part) {
    var k = sl.k, d = [], f = tD / 2 + 0.0005;
    if (k === 'compute') { [-1, 1].forEach(function (s) { d.push(D.rectXY(s * 0.132 - 0.1025, -tH * 0.34, s * 0.132 + 0.1025, tH * 0.34, f, { lw: 0.45 })); }); }
    else if (k === 'switch') { d.push(D.rectXY(-tW * 0.4, -tH * 0.26, tW * 0.4, tH * 0.26, f, { lw: 0.45, fill: 'dark' })); }
    else if (k === 'power') { for (var q = 0; q < 6; q++) { var qx = (q - 2.5) * ((tW - 0.02) / 6); d.push(D.rectXY(qx - (tW - 0.05) / 12, -tH * 0.37, qx + (tW - 0.05) / 12, tH * 0.37, f, { lw: 0.45, col: 'acc2', fill: 'mid' })); } }
    // (round two: the power shelves in the steel grey at the accent's middle weight; at acc2Dark they were the plate's heaviest mark)
    var mat = k === 'power' ? 'acc2' : k === 'switch' ? 'mid' : k === 'cdu' ? 'steel' : 'light';
    // the trays' steel bodies, their fronts black; the power shelves' fronts the bare metal of their supplies
    var fr = k === 'power' ? 'alu' : 'black';
    m.box({ c: [0, sl.y, tzc], s: [tW, tH, tD], decals: { pz: d }, real: 'steel', fmat: { pz: { d: 0.2, real: fr } } }, mat);
  }
  slots.forEach(function (sl, i) { if (pullIdx[i] || sl.k === 'cdu') return; tray(sl); });
  var cduY = (slots[0].y + slots[3].y) / 2;
  m.real('black');
  m.box({ c: [0, cduY, tzc], s: [tW, 4 * U * 0.94, tD], decals: { pz: [-1, 1].map(function (s) { return D.circle(0, 0, 0.046, 0, 24, { lw: 0.6 }); }).map(function (it, j) { return { pts: it.pts.map(function (p) { return [p[0] + (j ? 0.155 : -0.155), p[2], tD / 2 + 0.0005]; }), closed: true, lw: 0.6 }; }) } }, 'steel');
  // the rear: the NVLink cable cartridge either side of the busbar's place, and the coolant manifold
  var sy0 = 0.164, sy1 = stackTop - 0.02, sh = sy1 - sy0, syc = (sy0 + sy1) / 2, zS = back + 0.085;
  [-1, 1].forEach(function (s) {
    var ln = []; for (var i = 0; i < 18; i++) { var lx = (i - 8.5) * 0.0112; ln.push(D.line([lx, -sh / 2, -0.011], [lx, sh / 2, -0.011], { lw: 0.35, alpha: 0.7 })); }
    m.box({ c: [s * 0.172, syc, zS], s: [0.212, sh, 0.02], decals: { nz: ln }, real: 'cable' }, 'mid');
  });
  [back + 0.30, back + 0.40].forEach(function (pz) { var prof = [[0, sy0 - 0.13], [0.03, sy0 - 0.13]]; for (var q = 0; q <= 10; q++) prof.push([0.03, sy0 - 0.10 + q * (sh + 0.24) / 10, 2]); prof.push([0.03, sy1 + 0.17]); prof.push([0, sy1 + 0.17]); m.revolve(prof, 'turned', { seg: 12, pos: [W / 2 - 0.058, 0, pz], real: 'steel' }); });
  // pulled trays
  var pulled = [];
  Object.keys(pullIdx).forEach(function (i) {
    var p = m.part('pull' + i, { ex: [0, 0, 0.78], seq: pullIdx[i] }); tray(slots[i], p); pulled.push([+i, p]);
    [-1, 1].forEach(function (s) { m.guide([[s * tW / 2, slots[i].y - tH / 2, tz0, cab.idx], [s * tW / 2, slots[i].y - tH / 2, tz0, p.idx]], { alpha: 0.7 }); });
  });
  // the busbar, copper, with a clip at every tray, pulled back out of the rear
  var bb = m.part('busbar', { ex: [0, 0, -2.25], seq: 4 });
  // (round two: a deeper copper fill, d 0.5, so the thin bar keeps its colour under its outline: src/plate.js draws a part under
  // about 16 px across with its outline tinted, never the ink shade line, which swallowed it)
  m.box({ c: [0, syc, zS + 0.02], s: [0.052, sh + 0.10, 0.03] }, { d: 0.5, c: 'acc', real: 'cu' });
  // its trace lines back to its place at the rear, top and foot, so the bar reads as pulled from the rack (designer pass)
  [syc + (sh + 0.10) / 2, syc - (sh + 0.10) / 2].forEach(function (yy) { m.guide([[0, yy, zS + 0.035, cab.idx], [0, yy, zS + 0.035, bb.idx]], { alpha: 0.7 }); });
  // (designer pass, 22 Nov 2026: the figure stands low on its line, under the busbar's foot; at 0.62 it ran into the bar; plates
  // refine: at 0.3 the busbar's lower trace line ran through it, so it stands lower still)
  m.dim([W / 2, 0, back], [W / 2, Ht, back], [0.1, 0, 0], '2,236 mm', { part: cab.idx, t: 0.13 });
  // designer pass (21 Nov 2026): the width taken further out in front, so its figure clears the rack's foot
  m.dim([-W / 2, 0, front], [W / 2, 0, front], [0, 0, 0.2], '600 mm', { part: cab.idx });
  var pp = {}; pulled.forEach(function (q) { pp[q[0]] = q[1]; });
  m.callout([-tW * 0.3, slots[6].y, fz, pp[6].idx], 'Power shelf', { side: 'l' });
  m.callout([-tW * 0.3, slots[20].y, fz, pp[20].idx], 'NVLink switch tray', { side: 'l' });
  // (on a phone, where the labels stand in rows, the compute tray is named from the top row, clear of the trays under it)
  m.callout([-tW * 0.3, slots[30].y, fz, pp[30].idx], 'Compute tray', { side: 'l', row: 't' });
  m.callout([0.026, syc + 0.35, zS + 0.02, bb.idx], 'Copper busbar', { side: 'r' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [176, 102, 44], accentDark: [224, 154, 92], accent2: [122, 122, 122], accent2Dark: [200, 200, 200] };
});

})(window.PLATE);}catch(e){console.warn('plate rack.js failed to load', e);}
/* plates/sem-column.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   07 Metrology: an electron-beam inspection column cut in half down its axis, standing over a wafer, in the units of
   specimens/sem-column.js. The column comes apart along the beam: gun, condenser lenses, scan coils, objective, detector and
   stage, with the beam running on through every gap.
   22 Nov 2026 review: the column's height (about a metre) had no allowed source, so the caption no longer calls it to scale
   and says the column is simplified; the wafer is drawn 300 mm across (the stage's units) and labelled without its size.
   The detector is labelled: chapter 7 says the picture is built from the electrons the beam knocks loose. Colours (the set's
   legend): the beam in the beam hue the EUV light takes on plate 04, the wafer in silicon slate (acc2); the lens coils,
   copper before, are ink, since a plate has two accents and the wafer's colour is the one kept the same everywhere.
   22 Nov 2026 plates refine: the beam hue is a deeper blue on paper (78, 96, 186; plate 04's light takes the same), so the
   envelope reads against the lenses' shading. Round two: the beam is drawn over a knock-out in the paper's colour, 2.4 times its
   width, so it reads clear across the bore (a drafting gap, not a glow). */
R('sem-column', function (m) {
  var yaw = PLATE.DIM.yaw, h = farHalf(yaw), a0 = h[0], a1 = h[1], tv = h[2];
  var O = { a0: a0, a1: a1, cut: 'cut', seg: 48 };
  function o(extra) { var r = {}; for (var k in O) r[k] = O[k]; for (k in extra) r[k] = extra[k]; return r; }
  function lens(y0, y1, rOut, rB) {
    var hh = y1 - y0, mid = (y0 + y1) / 2, c0 = rB + (rOut - rB) * 0.30, c1 = rOut - (rOut - rB) * 0.14, w0 = y0 + hh * 0.16, w1 = y1 - hh * 0.16, g = 0.028;
    m.real('iron');
    m.revolve([[rB, y0], [rOut, y0], [rOut, y1], [rB, y1], [rB, mid + g], [c0, w1], [c1, w1], [c1, w0], [c0, w0], [rB, mid - g]], 'turned', o({}));
    m.real('cu');
    var coil = m.revolve([[c0 + 0.008, w0 + 0.008], [c1 - 0.008, w0 + 0.008], [c1 - 0.008, w1 - 0.008], [c0 + 0.008, w1 - 0.008]], 'dark', o({ cut: 'cutDense' }));
    coil.c = [coil.c[0] + 0.08 * Math.cos(tv), coil.c[1], coil.c[2] + 0.08 * Math.sin(tv)];
  }
  function tube(y0, y1, r0, r1) { m.revolve([[r0, y0], [r1, y0], [r1, y1], [r0, y1]], 'turned', o({ real: 'steel' })); }
  function plate(y, r, hole) { m.revolve([[hole, y - 0.004], [r, y - 0.004], [r, y + 0.004], [hole, y + 0.004]], 'turnedDark', o({ cut: 'cutDense', real: 'w' })); }
  var u = [Math.cos(a0), Math.sin(a0)];
  var parts = {}, beam = [];
  // gun and its insulator
  parts.gun = m.part('gun', { ex: [0, 0.34, 0], seq: 5 });
  m.real('steel');
  m.revolve([[0.085, 1.10], [0.20, 1.10], [0.20, 1.36], [0.10, 1.47], [0.085, 1.47]], 'turned', o({}));
  [0, 1, 2].forEach(function (q) { var iy = 1.47 + q * 0.082, ir = 0.100 - q * 0.017; m.revolve([[0.03, iy], [ir, iy], [ir, iy + 0.07, 2], [0.03, iy + 0.07]], 'turnedDark', o({ cut: 'cutDense', real: 'ceramic' })); });
  tube(1.72, 1.85, 0.02, 0.04);
  m.revolve([[0, 1.244], [0.003, 1.244], [0.026, 1.292], [0, 1.292]], 'acc', o({ cut: 'cutAcc', real: 'w' }));
  plate(1.205, 0.075, 0.010); plate(1.12, 0.085, 0.012);
  var ipA = tv + Math.PI;
  m.real('steel');
  m.cyl([0.30 * Math.cos(ipA), 1.245, 0.30 * Math.sin(ipA)], 0.072, 0.20, 'turned', { seg: 24, rot: [0, -ipA, Math.PI / 2] });
  m.real('steelDk');
  m.box({ c: [0.48 * Math.cos(ipA), 1.245, 0.48 * Math.sin(ipA)], s: [0.14, 0.17, 0.17], rot: [0, -ipA, 0] }, 'mid');
  // the first condenser and its tube
  parts.c1 = m.part('cond1', { ex: [0, 0.22, 0], seq: 4 });
  tube(0.72, 1.10, 0.088, 0.098); lens(0.48, 0.72, 0.34, 0.098);
  // the aperture and the second condenser
  parts.c2 = m.part('cond2', { ex: [0, 0.11, 0], seq: 3 });
  tube(0.36, 0.48, 0.086, 0.096); plate(0.435, 0.10, 0.008); lens(0.12, 0.36, 0.32, 0.094);
  // stigmator and scan coils
  parts.sc = m.part('scan', { ex: [0, 0, 0], seq: 2 });
  tube(-0.06, 0.12, 0.084, 0.094);
  m.revolve([[0.10, -0.03], [0.142, -0.03], [0.142, 0.07], [0.10, 0.07]], 'turnedDark', o({ real: 'cu' }));
  m.revolve([[0.094, -0.26], [0.20, -0.26], [0.20, -0.10], [0.094, -0.10]], 'turned', o({ real: 'iron' }));
  var scoil = m.revolve([[0.118, -0.238], [0.184, -0.238], [0.184, -0.122], [0.118, -0.122]], 'dark', o({ cut: 'cutDense', real: 'cu' }));
  scoil.c = [scoil.c[0] + 0.08 * Math.cos(tv), scoil.c[1], scoil.c[2] + 0.08 * Math.sin(tv)];
  // the objective lens and its conical pole piece
  parts.ob = m.part('objective', { ex: [0, -0.12, 0], seq: 1 });
  lens(-0.56, -0.30, 0.44, 0.115);
  m.revolve([[0.105, -0.815], [0.145, -0.815], [0.145, -0.76], [0.44, -0.56], [0.105, -0.56]], 'turned', o({ real: 'iron' }));
  // the ring detector
  parts.det = m.part('detector', { ex: [0, -0.2, 0], seq: 1 });
  m.tag('detector');
  m.revolve([[0.052, -0.859], [0.175, -0.859], [0.175, -0.851], [0.052, -0.851]], 'turnedDark', o({ cut: 'cutDense', real: 'siFace' }));
  m.tag(null);
  // wafer and stage
  parts.st = m.part('stage', { ex: [0, -0.32, 0], seq: 0, pri: -1, mode: 'stack' });
  var yW = -0.98, wr = 0.40, wt = wr * 0.775 / 150, dies = [];  // the wafer 300 mm across and 775 micrometres thick (SEMI M1)
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) { var cx = gx * 0.092, cz = gz * 0.076; if (cx * cx + cz * cz > (wr - 0.055) * (wr - 0.055)) continue; dies.push(D.rect(cx - 0.044, cz - 0.036, cx + 0.044, cz + 0.036, wt / 2, { lw: 0.35, alpha: 0.6, fill: 'steel', sheen: 0.18 })); }
  dies.push({ dots: [[0, wt / 2, 0]], r: 2.4, col: 'acc', alpha: 1 });
  m.real('granite');
  m.box({ c: [0, yW - 0.21, 0], s: [1.42, 0.09, 1.10] }, 'steel');
  m.real('steel');
  [-1, 1].forEach(function (i) { m.box({ c: [0, yW - 0.147, i * 0.33], s: [1.30, 0.034, 0.056] }, 'dark'); });
  m.real('alu');
  m.box({ c: [0, yW - 0.088, 0], s: [0.98, 0.07, 0.86] }, 'light');
  m.real('ceramic');
  m.cyl([0, yW - 0.027, 0], 0.428, 0.05, 'turned', { seg: 48 });
  m.real('siProc');
  m.tag('wafer');
  m.cyl([0, yW - 0.003 + wt / 2, 0], wr, wt, 'acc2Light', { seg: 56, top: dies });
  m.tag(null);
  m.real('steelDk');
  m.box({ c: [-wr - 0.048, yW - 0.02, 0], s: [0.02, 0.055, 0.80] }, 'dark');
  m.box({ c: [0, yW - 0.02, -wr - 0.048], s: [0.80, 0.055, 0.02] }, 'dark');
  var du = [Math.cos(yaw), Math.sin(yaw)]; // the direction that runs straight across the page at the resting turn
  // review: the size goes on the wafer's label in the caption's words ('a 300 mm wafer'). The dimension line had no room:
  // the gap between the column's tip and the wafer's far rim is about 15 px, so line and figure sat on both
  // the beam: emitter to wafer, and its envelope on the cut plane, each point riding with the part it passes through
  var ENV = [[1.268, 0.008], [1.20, 0.028], [1.11, 0.038], [0.72, 0.060], [0.60, 0.070], [0.50, 0.032], [0.436, 0.004], [0.36, 0.024], [0.24, 0.060], [0.12, 0.034], [0.02, 0.028], [-0.18, 0.038], [-0.43, 0.096], [-0.60, 0.072], [-0.815, 0.036], [yW, 0.002]];
  var who = function (y) { return y > 1.1 ? parts.gun.idx : y > 0.48 ? parts.c1.idx : y > 0.12 ? parts.c2.idx : y > -0.3 ? parts.sc.idx : y > -0.84 ? parts.ob.idx : parts.st.idx; };
  // (22 Nov 2026 plates refine: the envelope at lw 1.3, full strength, so the beam's shape reads through the lenses)
  [-1, 1].forEach(function (s) { m.guide(ENV.map(function (q) { return [s * q[1] * u[0], q[0], s * q[1] * u[1], who(q[0])]; }), { style: 'beam', col: 'acc', lw: 1.3, alpha: 0.9, knock: true }); });
  m.guide([[0, 1.268, 0, parts.gun.idx], [0, 1.10, 0, parts.gun.idx], [0, 1.10, 0, parts.c1.idx], [0, 0.48, 0, parts.c1.idx], [0, 0.48, 0, parts.c2.idx], [0, 0.12, 0, parts.c2.idx], [0, 0.12, 0, parts.sc.idx], [0, -0.30, 0, parts.sc.idx], [0, -0.30, 0, parts.ob.idx], [0, -0.815, 0, parts.ob.idx], [0, -0.815, 0, parts.det.idx], [0, -0.86, 0, parts.det.idx], [0, -0.86, 0, parts.st.idx], [0, yW, 0, parts.st.idx]], { style: 'beam', col: 'acc', lw: 1.3, knock: true });
  var w2 = [Math.cos(a1), Math.sin(a1)];
  // (the emitter named level with its tip, its leader straight out to the right; the wafer on its near rim, 22 Nov 2026 plates
  // refine)
  m.callout([0, 1.268, 0, parts.gun.idx], 'Emitter', { side: 'r', level: true });
  m.callout([[0.27 * u[0], 0.60, 0.27 * u[1], parts.c1.idx], [0.3 * u[0], -0.43, 0.3 * u[1], parts.ob.idx]], 'Lenses', { side: 'l', row: 't' });
  // (on a phone the lenses and the beam are named from the top row, so their leaders rise beside the narrow column)
  m.callout([0, 0.03, 0, parts.sc.idx], 'Electron beam', { side: 'r', row: 't' });
  var nr = Math.atan2(Math.cos(yaw), -Math.sin(yaw)) + 0.35;
  m.callout([wr * 0.95 * Math.cos(nr), yW + 0.004, wr * 0.95 * Math.sin(nr), parts.st.idx], 'Wafer', { side: 'l', tag: 'wafer' });
  m.callout([0.15 * u[0], -0.855, 0.15 * u[1], parts.det.idx], 'Detector', { side: 'l', tag: 'detector' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [0, 1, 0], accent: [78, 96, 186], accentDark: [154, 166, 255], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate sem-column.js failed to load', e);}
/* plates/substrate-layers.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
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
  var FILM_A = { d: 0.24, c: 'acc', real: 'abf' }, FILM_B = { d: 0.40, c: 'acc', real: 'abf2' };
  // the section on a cut face, as decal items in (u, y), u running 0..L along the face
  function section(L, toP) {
    var it = [], i, u;
    var poly = function (u0, ya, u1, yb, o) { return Object.assign({ pts: [toP(u0, ya), toP(u1, ya), toP(u1, yb), toP(u0, yb)], closed: true }, o); };
    it.push(poly(0, -cTop, L, cTop, { fill: { d: 0.07, hatch: 3, real: 'coreSec' }, lw: 0.5, tag: 'core', real: 'coreSec' }));
    for (k = 1; k <= nb; k++) {
      // review: a deeper olive (d 0.24 and 0.40, was 0.17 and 0.34), so the bands read as the caption's olive green
      it.push(poly(0, lay[k - 1], L, lay[k], { fill: k % 2 ? FILM_A : FILM_B, lw: 0, keep: true, tag: 'film' }));
      it.push(poly(0, -lay[k], L, -lay[k - 1], { fill: k % 2 ? FILM_A : FILM_B, lw: 0, keep: true, tag: 'film' }));
    }
    [1, -1].forEach(function (sg) { it.push(poly(0, sg > 0 ? lay[nb] : -top, L, sg > 0 ? top : -lay[nb], { fill: 'dark', lw: 0, real: 'subMask' })); });
    /* 22 Nov 2026 plates refine: the copper on every conductor plane runs the whole cut, broken only round the vias that land on
       it (each landing a pad of its own, with a clearance either side), so the eleven bands a side can be counted between the
       twelve lines of copper (random runs and breaks read as a brick wall). Every microvia column climbs every band, stacked or
       staggered; nothing is random */
    var pads = []; for (k = 0; k <= nb; k++) pads.push([]);
    // plated through-holes and their pads on the core's two faces
    var np = Math.max(3, Math.round(L / 11)), hw = 0.62;
    for (i = 0; i < np; i++) {
      u = (i + 0.5) * L / np;
      it.push({ pts: [toP(u - hw, -cTop), toP(u - hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu', real: 'cu' }, { pts: [toP(u + hw, -cTop), toP(u + hw, cTop)], col: 'acc2', lw: 1.1, tag: 'cu', real: 'cu' });
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
      vias.forEach(function (v) { var yl = sg * lay[v[0] - 1], yh = sg * lay[v[0]], x = v[1]; it.push({ pts: [toP(x - 0.58, yh), toP(x - 0.3, yl), toP(x + 0.3, yl), toP(x + 0.58, yh)], closed: true, fill: { d: 0.62, c: 'acc2', real: 'cu' }, col: 'acc2', lw: 0.4, tag: 'cu', real: 'cu' }); });
      for (k = 0; k <= nb; k++) {
        var y = sg * lay[k], lw = k % 3 === 0 ? 0.85 : 0.75;
        // the plane's pads, merged where they touch, then the copper between them, each run stopping 0.5 short of a pad
        var ps = pads[k].slice().sort(function (a, b) { return a[0] - b[0]; }), mg = [];
        ps.forEach(function (pq) { var l = mg[mg.length - 1]; if (l && pq[0] <= l[1] + 0.2) l[1] = Math.max(l[1], pq[1]); else mg.push([pq[0], pq[1]]); });
        var x0 = 0.4;
        mg.forEach(function (pq) {
          if (pq[0] - 0.5 > x0 + 0.3) it.push({ pts: [toP(x0, y), toP(pq[0] - 0.5, y)], col: 'acc2', lw: lw + 0.25, edge: true, tag: 'cu', real: 'cu' });
          it.push({ pts: [toP(Math.max(0.4, pq[0]), y), toP(Math.min(L - 0.4, pq[1]), y)], col: 'acc2', lw: (k === 0 ? 1.3 : lw + 0.3) + 0.25, edge: true, tag: 'cu', real: 'cu' });
          x0 = pq[1] + 0.5;
        });
        if (L - 0.4 > x0 + 0.3) it.push({ pts: [toP(x0, y), toP(L - 0.4, y)], col: 'acc2', lw: lw + 0.25, edge: true, tag: 'cu', real: 'cu' });
      }
    });
    // solder balls in section along the foot
    var nbz = Math.max(4, Math.round(L / 4.5));
    for (i = 0; i < nbz; i++) { u = (i + 0.5) * L / nbz; var arc = []; for (var a = 0; a <= 12; a++) { var th = Math.PI * a / 12; arc.push(toP(u - 1.1 * Math.cos(th), -top - 1.1 * Math.sin(th) * 0.85)); } it.push({ pts: arc, lw: 0.7, fill: 'mid', real: 'sac' }); }
    return it;
  }
  var body = m.part('body', { ex: [0, 0, 0], seq: 0 });
  var Lsh = [[-W / 2, -Dd / 2], [W / 2, -Dd / 2], [W / 2, 0], [0, 0], [0, Dd / 2], [-W / 2, Dd / 2]];
  var secZ = section(W / 2, function (u, y) { return [u, y, 0.001]; }), secX = section(Dd / 2, function (u, y) { return [0.001, y, u]; });
  // the top: the die's shadow with its bump pads, and the capacitor pads round it, both stopped by the cut
  var sw = 78, sd = 50, tp = [];
  tp.push({ pts: [[0, top, -sd / 2], [-sw / 2, top, -sd / 2], [-sw / 2, top, sd / 2], [0, top, sd / 2]], lw: 0.7, dash: [2.4, 1.6] });
  tp.push({ pts: [[0, top, -sd / 2], [sw / 2, top, -sd / 2], [sw / 2, top, 0]], lw: 0.7, dash: [2.4, 1.6] });
  tp.push({ dots: H.gridPts(30, 20, sw / 31, sd / 21, top, 0, 0, function (x, z) { return !(x > 0.5 && z > 0.5); }), r: 0.55, alpha: 0.6, real: 'sac' });
  for (var q = 0; q < 30; q++) { var cu = (q - 14.5) * (W * 0.94 / 30); if (Math.abs(cu) > sw / 2 + 2) continue; [-1, 1].forEach(function (sg) { if (cu > 0 && sg > 0) return; tp.push(D.rect(cu - 0.9, sg * (sd / 2 + 4.2) - 1.4, cu + 0.9, sg * (sd / 2 + 4.2) + 1.4, top, { fill: 'dark', lw: 0.3, real: 'sac' })); }); }
  m.real('subMask');
  var sMat = { 2: 'paper', 3: 'paper' }, sDec = { 2: secZ, 3: secX };
  // (the outer sides: a routed laminate edge, thin green resist bands top and bottom, the core's band and faint layer lines)
  [0, 1, 4, 5].forEach(function (i) {
    var a = Lsh[i], b = Lsh[(i + 1) % 6], band = function (y0, y1, o) { return Object.assign({ pts: [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], closed: true }, o); };
    var it = [band(top - tr, top, { fill: { d: 0.3, real: 'subMask' }, lw: 0 }), band(-top, -top + tr, { fill: { d: 0.3, real: 'subMask' }, lw: 0 }), band(-cTop, cTop, { fill: { d: 0.1, real: 'core', hatch: 3 }, lw: 0 })];
    for (var q = 1; q <= nb; q++) [1, -1].forEach(function (sg) { it.push(band(sg * lay[q], sg * lay[q], { lw: 0.3, alpha: 0.35 })); });
    sMat[i] = { d: 0.1, real: 'laminate' }; sDec[i] = it;
  });
  m.prism(Lsh, -top, top, 'light', { sideMat: sMat, sideDecals: sDec, top: tp });
  m.callout([W * 0.3, (lay[2] + lay[3]) / 2, 0.001, body.idx], 'Build-up film', { side: 'r', tag: 'film' });
  // review: on a plated hole's copper pad at the near end of the right-hand cut (the leader ran right across the top); round two:
  // on the fifth build-up plane above the core, clear of the vias, so it names the layers rather than a hole
  m.callout([13, lay[5], 0.001, body.idx], 'Copper layers', { side: 'r', tag: 'cu' });
  m.callout([W * 0.22, 0.4, 0.001, body.idx], 'Core of glass cloth and resin', { side: 'r', tag: 'core' });
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, accent: [111, 122, 47], accentDark: [178, 189, 96], accent2: [176, 102, 44], accent2Dark: [224, 154, 92] };
});

})(window.PLATE);}catch(e){console.warn('plate substrate-layers.js failed to load', e);}
/* plates/wafer-cost.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   15 Costs: Epoch AI's December 2025 estimate of what it cost to build one B200, as a column with each layer as tall
   as its share of the bill. The layers slide down into place and stack at true height: here an exploded rest would
   break the scale, so the column rests closed, with each layer labelled in the caption's own words. */
R('wafer-cost', function (m) {
  var S = 1.9 / 6380, CW = 0.60, PW = 0.84, PH = 0.038;
  var BOM = [['$2,900 of memory', 2900, 'acc'], ['$1,100 of packaging', 1100, 'light'], ['$1,000 of packaging yield loss', 1000, 'ghost'], ['$900 of logic dies', 900, 'mid'], ['$480 of power delivery, board and test', 480, 'steel']];
  // (each layer in the material its share of the bill buys: the memory's stacked silicon and copper vias, the
  // package's substrate and bumps, the logic dies' face, the board's green solder mask)
  var REALS = ['wine', 'subMask', null, 'siFace', 'pcb'];
  m.part('plinth', { ex: [0, 0, 0], seq: 0 });
  var gl = []; var GE = PW / 2 - 0.03;
  for (var gi = 1; gi < 10; gi++) { var gp = -GE + gi * 2 * GE / 10; gl.push(D.line([gp, PH / 2, -GE], [gp, PH / 2, GE], { lw: 0.3, alpha: 0.5 })); gl.push(D.line([-GE, PH / 2, gp], [GE, PH / 2, gp], { lw: 0.3, alpha: 0.5 })); }
  gl.push(D.rect(-(CW + 0.1) / 2, -(CW + 0.1) / 2, (CW + 0.1) / 2, (CW + 0.1) / 2, PH / 2, { lw: 0.6 }));
  m.real('granite');
  m.box({ c: [0, PH / 2, 0], s: [PW, PH, PW], decals: { py: gl } }, 'light');
  var y = PH, rx = -(CW / 2 + 0.155), rz = -(CW / 2 + 0.155);
  BOM.forEach(function (b, i) {
    var h = b[1] * S, y0 = y, yc = y + h / 2;
    m.part('layer' + i, { ex: [0, 0.4 + 0.22 * i, 0], seq: i + 1 });
    m.real(REALS[i]);
    var faces = function (fn) { return { pz: fn('pz'), px: fn('px'), nz: fn('nz'), nx: fn('nx') }; };
    var at = function (f, u, yy) { return f === 'pz' ? [u, yy, CW / 2] : f === 'px' ? [CW / 2, yy, -u] : f === 'nz' ? [-u, yy, -CW / 2] : [-CW / 2, yy, u]; };
    var dec = null;
    if (i === 0) dec = faces(function (f) { var a = []; for (var k = 1; k <= 12; k++) { var yy = -h / 2 + h * 0.18 + (k / 12) * h * 0.8; a.push({ pts: [at(f, -CW / 2, yy), at(f, CW / 2, yy)], lw: 0.4, col: 'acc', alpha: 0.9 }); } for (var t = 0; t < 4; t++) { var tx = (t - 1.5) * CW * 0.22; a.push({ pts: [at(f, tx, -h / 2 + h * 0.18), at(f, tx, h / 2)], lw: 0.5, col: 'acc', alpha: 0.8 }); } return a; });
    else if (i === 1) dec = faces(function (f) { var d = []; for (var a = 0; a < 15; a++) for (var c = 0; c < 4; c++) d.push(at(f, (a - 7) * CW * 0.062, (c - 1.5) * h * 0.2)); var o2 = [{ dots: d, r: 0.8, alpha: 0.8, real: 'sac' }]; o2.unshift({ pts: [at(f, -CW / 2, h / 2), at(f, CW / 2, h / 2), at(f, CW / 2, h * 0.36), at(f, -CW / 2, h * 0.36)], closed: true, fill: { d: 0.3, real: 'subMask' }, lw: 0 }); return o2; });
    else if (i === 3) dec = faces(function (f) { var a = [{ pts: [at(f, -CW / 2, 0), at(f, CW / 2, 0)], lw: 0.5 }]; for (var v = 0; v < 11; v++) a.push({ pts: [at(f, (v - 5) * CW * 0.084, -h * 0.4), at(f, (v - 5) * CW * 0.084, h * 0.4)], lw: 0.35, alpha: 0.75 }); return a; });
    else if (i === 4) dec = faces(function (f) { var d = []; for (var a = 0; a < 9; a++) for (var c = 0; c < 2; c++) d.push(at(f, (a - 4) * CW * 0.1, (c - 0.5) * h * 0.34)); return [{ dots: d, r: 1.1, alpha: 0.8, real: 'sac' }]; });
    if (b[2] === 'ghost') {
      m.box({ c: [0, yc, 0], s: [CW, h, CW] }, 'ghost');
      ['pz', 'px', 'nz', 'nx'].forEach(function (f) { m.wire([at(f, -CW / 2, -h / 2), at(f, CW / 2, h / 2)].map(function (p) { return [p[0], p[1] + yc, p[2]]; }), { lw: 0.6, alpha: 0.7, c: [0, yc, 0] }); m.wire([at(f, CW / 2, -h / 2), at(f, -CW / 2, h / 2)].map(function (p) { return [p[0], p[1] + yc, p[2]]; }), { lw: 0.6, alpha: 0.7, c: [0, yc, 0] }); });
    } else m.box({ c: [0, yc, 0], s: [CW, h, CW], decals: dec, fmat: i === 1 ? { px: { d: 0.1, real: 'core' }, nx: { d: 0.1, real: 'core' }, pz: { d: 0.1, real: 'core' }, nz: { d: 0.1, real: 'core' } } : null }, b[2]);
    // (on a phone, where the labels stand in rows, the three lower layers are named from under the column and the two upper from
    // over it, so no leader rises across a layer it does not name: designer pass, 22 Nov 2026)
    // (round two: the $1,000 and $480 labels level with their dots)
    m.callout([CW / 2, yc, CW * 0.2], b[0], { side: 'r', col: i === 0 ? 'acc' : null, strong: i === 0, row: i <= 2 ? 'b' : 't', level: i === 2 || i === 4 });
    y += h;
  });
  var TOP = y;
  // 22 Nov 2026 review: its offset runs along one model axis (x) only; it ran on two.
  // review: the total is a dimension up the whole column at its front-left corner. It was a label on the top face, which
  // read as a sixth layer worth $6,400, beside an unfigured rule ticked every $500
  m.dim([-CW / 2, PH, CW / 2], [-CW / 2, TOP, CW / 2], [-0.17, 0, 0], 'about $6,400', { part: 0 });
  // (22 Nov 2026 plates refine: the joints between layers at shade weight and the yield loss's edges at outline weight, as the
  // first plates drew them; at crease weight the layers ran together into one block)
  return { chart: true, chartSat: 0.6, noPolish: true, ghostFill: true, elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, start: 1, rest: 0, sortAxis: [0, 1, 0], joints: 'shade', ghostW: 'out', accent: [122, 31, 43], accentDark: [201, 83, 106] };
});

})(window.PLATE);}catch(e){console.warn('plate wafer-cost.js failed to load', e);}
