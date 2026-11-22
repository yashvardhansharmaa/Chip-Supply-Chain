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
  P.phone = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 899px)').matches;
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
     curve: a turned surface (banded tone and shading lines), hatch: a cut face, ghost: outline only, phantom: dashed */
  var MATS = {
    paper: { d: 0.03 }, light: { d: 0.065 }, steel: { d: 0.11 }, mid: { d: 0.18 }, dark: { d: 0.32 }, black: { d: 0.62 },
    turned: { d: 0.10, curve: true }, turnedDark: { d: 0.22, curve: true },
    acc: { d: 0.34, c: 'acc' }, accLight: { d: 0.17, c: 'acc' }, accDark: { d: 0.6, c: 'acc' }, accTurned: { d: 0.32, c: 'acc', curve: true },
    acc2: { d: 0.34, c: 'acc2' }, acc2Light: { d: 0.17, c: 'acc2' }, acc2Dark: { d: 0.6, c: 'acc2' },
    cut: { d: 0.02, hatch: 1 }, cutDense: { d: 0.04, hatch: 2 }, cutCross: { d: 0.03, hatch: 3 }, cutAcc: { d: 0.14, c: 'acc', hatch: 1 }, cutAcc2: { d: 0.14, c: 'acc2', hatch: 1 },
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
    var mer = o.mer || 0, heavy = o.heavy || [];
    for (i = 0; i < n; i++) {
      var i2 = (i + 1) % n, P0 = profile[i], P1 = profile[i2], dr = P1[0] - P0[0], dy = P1[1] - P0[1], L = Math.hypot(dr, dy) || 1;
      if (P0[0] < 1e-9 && P1[0] < 1e-9) continue; // along the axis
      var nr = sg * dy / L, ny = -sg * dr / L, flat = Math.abs(dy) < 1e-9;
      for (j = 0; j < steps; j++) {
        var thm = a0 + (a1 - a0) * (j + 0.5) / steps, nrm = t.n([nr * Math.cos(thm), ny, nr * Math.sin(thm)]);
        var q = [grid[i][j], grid[i][j + 1], grid[i2][j + 1], grid[i2][j]];
        var vq = q.filter(function (v, k) { return q.indexOf(v) === k; });
        if (vq.length < 3) continue;
        this.face(vq, nrm, { curve: !flat, mj: vq.length === 4 && !flat ? j : -1 });
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
      if (o.cut0) this.decal(s, n0, mapItems(o.cut0, function (p) { return t.p([p[0] * Math.cos(a0), p[1], p[0] * Math.sin(a0)]); }));
      if (o.cut1) this.decal(s, n1, mapItems(o.cut1, function (p) { return t.p([p[0] * Math.cos(a1), p[1], p[0] * Math.sin(a1)]); }));
    }
    if (o.top) this.decal(s, t.n([0, 1, 0]), mapItems(o.top, t.p));
    s.sortFaces = o.sortFaces !== false;
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
  M.callout = function (at, text, o) {
    o = o || {};
    var pts = at[0] && at[0].length ? at : [at];
    this.callouts.push({ pts: pts.map(function (q) { return [q[0], q[1], q[2], q[3] == null ? null : q[3]]; }), text: text, n: o.n || 0, part: o.part == null ? this.cur.idx : o.part, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, strong: !!o.strong, col: o.col || null, only: o.only || null, track: o.track || null });
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
      m.callouts.push({ pts: pts, text: an.name, n: an.n, part: an.part, side: o.side || null, tag: o.tag || null, dy: o.dy || 0, focus: o.focus || null, only: o.only || null });
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
    m.V = new Float32Array(m.V); m.VP = new Int16Array(m.VP);
    return m;
  };

  /* ---------------- the loupe ----------------
     A plate may carry one loupe (spec.loupe: { model, at, part, side, caption }): a second, small plate drawn face on in a disc
     in the top corner of a label column, joined by a faint cone to a ring on the spot it magnifies, with scale bars in the
     site's figures (P.loupeBar) and names (P.loupeTag), and its caption under the disc. It shows where the plate shows its
     dimensions (a chapter's slot and print), and fades with the labels. Memory and HBM's is behind a flag in its model file. */
  P.loupeBar = function (m, a, b, text, o) { o = o || {}; (m.bars || (m.bars = [])).push({ a: a, b: b, text: text, side: o.side, tx: o.tx, ty: o.ty }); };
  P.loupeTag = function (m, at, text, o) { o = o || {}; (m.tags || (m.tags = [])).push({ at: at, text: text, dx: o.dx, dy: o.dy, align: o.align, col: o.col }); };

  /* ---------------- drawing back-ends ---------------- */
  var FONT = '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
  function CanvasG(ctx, dpr) { this.x = ctx; this.k = dpr; this.ga = 1; } // ga: an alpha over everything drawn (the loupe fades with the labels)
  CanvasG.prototype = {
    poly: function (pts, fill, alpha) {
      var x = this.x; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath();
      x.globalAlpha = (alpha == null ? 1 : alpha) * this.ga; x.fillStyle = fill; x.fill(); x.globalAlpha = 1;
    },
    hatch: function (pts, col, gap, lw, kind, alpha) {
      var x = this.x, minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
      x.save(); x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]);
      x.closePath(); x.clip();
      pts.forEach(function (p) { if (p[0] < minx) minx = p[0]; if (p[0] > maxx) maxx = p[0]; if (p[1] < miny) miny = p[1]; if (p[1] > maxy) maxy = p[1]; });
      // ruled from a fixed page origin, so neighbouring cut faces of one part share their hatching
      x.beginPath();
      var hgt = maxy - miny, c0 = Math.floor((minx + miny) / gap) * gap - gap;
      for (var c = c0; c <= maxx + maxy + gap; c += gap) { x.moveTo(c - miny, miny); x.lineTo(c - maxy, maxy); }
      if (kind === 3) { var g2 = gap * 1.5, d0 = Math.floor((minx - maxy) / g2) * g2 - g2; for (c = d0; c <= maxx - miny + g2; c += g2) { x.moveTo(c + miny, miny); x.lineTo(c + maxy, maxy); } }
      void hgt;
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
    hatch: function (pts, col, gap, lw, kind, alpha) {
      var id = this.pre + 'c' + (this.cid++), minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
      pts.forEach(function (p) { if (p[0] < minx) minx = p[0]; if (p[0] > maxx) maxx = p[0]; if (p[1] < miny) miny = p[1]; if (p[1] > maxy) maxy = p[1]; });
      var d = '', c0 = Math.floor((minx + miny) / gap) * gap - gap;
      for (var c = c0; c <= maxx + maxy + gap; c += gap) d += 'M' + f1(c - miny) + ' ' + f1(miny) + 'L' + f1(c - maxy) + ' ' + f1(maxy);
      if (kind === 3) { var g2 = gap * 1.5, e0 = Math.floor((minx - maxy) / g2) * g2 - g2; for (c = e0; c <= maxx - miny + g2; c += g2) d += 'M' + f1(c + miny) + ' ' + f1(miny) + 'L' + f1(c + maxy) + ' ' + f1(maxy); }
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
    var on = tagged || hostTag || byPart;
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
  PL.rooms = function (w, g) {
    var m = this.m, self = this;
    if (this.lod !== 'full' || this.o.noLabels || !m.callouts.length) return { l: 0, r: 0 };
    var ls = this.labelStyle(w), e = this.ext || (this.ext = this.extent()), R = viewM(m.yaw0, m.elev), off = this.offsets(1).o, mid = (e.minx + e.maxx) / 2;
    var room = { l: 0, r: 0 };
    m.callouts.forEach(function (c) {
      var mx = 0; c.pts.forEach(function (q) { var o = off[q[3] == null ? c.part : q[3]] || [0, 0, 0]; mx += R[0] * (q[0] + o[0]) + R[1] * (q[1] + o[1]) + R[2] * (q[2] + o[2]); }); mx /= c.pts.length;
      var side = c.side || (mx < mid ? 'l' : 'r'); c._side = side;
      var lines = ls.numbersOnly && c.n ? [] : self.wrap(c.text, ls, g), tw = 0;
      lines.forEach(function (s) { tw = Math.max(tw, g ? g.measure(s, { size: ls.fs, weight: 500 }) : s.length * ls.fs * 0.53); });
      c._lines = lines;
      var need = tw + (c.n ? ls.num * 2 + 6 : 0) + 30;
      if (need > room[side]) room[side] = need;
    });
    // the loupe takes the top of its label column, which is then at least as wide as the disc
    var LG = this.loupeOn() ? this.loupeGeom(w) : null;
    if (LG) room[LG.side] = Math.max(room[LG.side], 2 * LG.r + LG.mg + 14);
    return room;
  };
  PL.fit = function (w, h, g) {
    var e = this.ext || (this.ext = this.extent(this.lod === 'thumb')), rooms = this.rooms(w, g);
    var padX = this.lod === 'thumb' ? w * 0.04 : Math.max(10, w * (this.o.pad == null ? 0.025 : this.o.pad)), padY = this.lod === 'thumb' ? h * 0.04 : Math.max(10, h * 0.03);
    var ew = e.maxx - e.minx, eh = e.maxy - e.miny, aw = w - rooms.l - rooms.r - 2 * padX, ah = h - 2 * padY;
    var sc = Math.min(aw / ew, ah / eh);
    if (this.o.maxScale) sc = Math.min(sc, this.o.maxScale);
    // the drawing and its label columns are centred together
    var used = rooms.l + rooms.r + sc * ew, x0 = (w - used) / 2 + rooms.l;
    return { s: sc, cx: x0 - sc * e.minx, cy: padY + (ah - sc * eh) / 2 + sc * e.maxy, e: e, rooms: rooms };
  };
  // is the loupe drawn: a plate with one, in a mode that shows dimensions, unless the page turns loupes off (P.loupes)
  PL.loupeOn = function () { return !!(this.m.loupe && this.lod === 'full' && !this.o.noDims && !this.o.noLabels && P.loupes !== false); };
  // its disc: the top corner of its label column, a radius that grows with the width, and the caption's lines under it
  PL.loupeGeom = function (w) {
    var L = this.m.loupe, r = Math.round(Math.max(56, Math.min(L.rMax || 104, (L.r || 0.155) * w))), mg = 10, side = L.side || 'r';
    var cap = L.caption || [], capH = cap.length ? 15 + cap.length * 16 : 0;
    return { side: side, r: r, mg: mg, x: side === 'r' ? w - mg - r : mg + r, y: mg + r, cap: cap, bottom: mg + 2 * r + capH + 14 };
  };
  PL.loupePlate = function () { var L = this.m.loupe; if (!this._lp && L && L.model) this._lp = new Plate(L.model, {}); return this._lp; };
  PL.heightFor = function (w, lo, hi) {
    var e = this.ext || (this.ext = this.extent()), rooms = this.rooms(w), padX = Math.max(10, w * 0.025);
    var sc = (w - rooms.l - rooms.r - 2 * padX) / (e.maxx - e.minx), h = sc * (e.maxy - e.miny) / 0.94;
    if (this.m.spec.maxH) hi = Math.min(hi, this.m.spec.maxH);
    if (this.loupeOn()) {
      var LG = this.loupeGeom(w), ls = this.labelStyle(w), n = 0, self = this;
      this.m.callouts.forEach(function (c) { if ((c._side || c.side) === LG.side) n++; });
      lo = Math.max(lo, LG.bottom + n * ls.fs * 2.4 + 8); void self;
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

    // the hierarchy of line weights, css px
    var lite = !!st.lite;
    var k = thumb ? 1 : Math.max(0.8, Math.min(1.2, Math.min(w, h * 1.4) / 620));
    var LW = thumb ? { shade: 1.3, out: 0.95, crease: 0.45, fine: 0, shadeLn: 0, hatch: 0, decal: 0.4 }
                   : { shade: 2.05 * k, out: 1.2 * k, crease: 0.62 * k, fine: 0.4 * k, shadeLn: 0.38 * k, hatch: 0.36 * k, decal: 0.5 * k };
    if (pal.dark && !thumb) { LW.shade *= 0.84; LW.out *= 0.92; }
    var inkC = css(pal.ink), hlC = css(pal.hl), bgC = css(pal.bg);
    var colOf = function (c) { return c === 'acc' ? pal.acc : c === 'acc2' ? pal.acc2 : c === 'muted' ? pal.muted : c === 'bg' ? pal.bg : c === 'hl' ? pal.hl : pal.ink; };
    var lineCol = function (c) { return c === 'acc' || c === 'acc2' ? css(mix(colOf(c), pal.ink, pal.dark ? 0.0 : 0.4)) : c === 'bg' ? bgC : c === 'hl' ? hlC : inkC; };
    var Lt = [-0.42, 0.72, 0.55], Ln = Math.hypot(Lt[0], Lt[1], Lt[2]); Lt = [Lt[0] / Ln, Lt[1] / Ln, Lt[2] / Ln];
    var lamOf = function (nvw) { return Math.max(0, nvw[0] * Lt[0] + nvw[1] * Lt[1] + nvw[2] * Lt[2]); };
    // turned surfaces are shaded by a lower light from the left, so a cylinder runs from lit to shade across its width
    var Ls = [-0.78, 0.22, 0.58], Lsn = Math.hypot(Ls[0], Ls[1], Ls[2]); Ls = [Ls[0] / Lsn, Ls[1] / Lsn, Ls[2] / Lsn];
    var lamC = function (nvw) { return Math.max(0, nvw[0] * Ls[0] + nvw[1] * Ls[1] + nvw[2] * Ls[2]); };
    // three values on flat faces (top, lit side, shade side), banded values on turned ones
    var toneF = function (lam, curve) {
      if (pal.dark) { if (curve) return 0.5 + 0.8 * Math.round(lam * 5) / 5; return lam > 0.72 ? 1.25 : lam > 0.15 ? 0.88 : 0.55; }
      if (curve) return 0.38 + 0.95 * Math.round((1 - lam) * 5) / 5;
      return lam > 0.72 ? 0.36 : lam > 0.15 ? 0.74 : 1.3;
    };
    var fillOf = function (mat, nvw, curve, tint) {
      var d = Math.min(0.92, mat.d * toneF(curve ? lamC(nvw) : lamOf(nvw), curve) * (pal.dark ? 0.8 : 1));
      var c = mix(pal.bg, colOf(mat.c), d);
      if (tint) c = mix(c, pal.hl, pal.dark ? 0.22 : 0.12);
      return css(c);
    };
    // the reader's pointer on a label or a part lights that part; the rest steps back (P.lit says what a focus lights)
    var foc = this.focus, inF = function (it) { return P.lit(foc, it); };
    var dimF = function (it) { return foc ? (inF(it) ? 1 : 0.2) : 1; };
    var pick = st.pick ? (this._pick = []) : null;

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
          g.lines([pts], hl ? hlC : lineCol(it.col), (thumb ? Math.max(0.5, it.lw * 0.6) : it.lw * k), it.dash ? it.dash.map(function (v) { return v * k; }) : null, it.alpha * fa);
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
      faces.forEach(function (fi) {
        var f = F[fi], fm = f.mat || mat, pts = f.v.map(P2), nvw = rotN(f.n);
        if (f.two && nvw[2] < 0) nvw = [-nvw[0], -nvw[1], -nvw[2]];
        count.faces++;
        if (fm.hatch) {
          g.poly(pts, css(mix(pal.bg, colOf(fm.c), fm.d)), alpha);
          if (!thumb && !lite) g.hatch(pts, fm.c ? lineCol(fm.c) : inkC, (fm.hatch === 2 ? 2.4 : 3.4) * k, LW.hatch, fm.hatch, 0.8 * alpha);
        } else g.poly(pts, fillOf(fm, nvw, f.curve, hl), (fm.alpha == null ? 1 : fm.alpha) * alpha);
        stamp[fi] = frame;
        if (pick) pick.push({ pts: pts, it: s });
        var out = [], shade = [], crease = [], fine = [], shl = [];
        var gx = 0, gy = 0; for (var q = 0; q < pts.length; q++) { gx += pts[q][0]; gy += pts[q][1]; } gx /= pts.length; gy /= pts.length;
        for (q = 0; q < f.v.length; q++) {
          var e = f.e[q], nb = e[0], cls = e[1], A0 = pts[q], B0 = pts[(q + 1) % pts.length], seg = [A0, B0];
          if (nb < 0 || !front[nb]) {
            // an outline: heavier where it faces away from the light (down and to the right on the page)
            var dx = B0[0] - A0[0], dy = B0[1] - A0[1], L = Math.hypot(dx, dy) || 1, nx = dy / L, ny = -dx / L;
            if (nx * (gx - A0[0]) + ny * (gy - A0[1]) > 0) { nx = -nx; ny = -ny; }
            if (!thumb || true) ((nx * 0.6 + ny * 0.8) > 0.3 ? shade : out).push(seg);
            continue;
          }
          if (stamp[nb] !== frame) continue;
          if (cls === 1) { ((F[nb].mat || mat).hatch || fm.hatch) ? out.push(seg) : crease.push(seg); }
          else if (cls === 2 && LW.fine) fine.push(seg);
        }
        // shading lines on a turned surface: along its axis, gathering toward the shade side
        if (!thumb && !lite && f.curve && f.mj >= 0 && pts.length === 4 && !fm.hatch) {
          var lam = lamC(nvw), sh = 1 - lam, j = f.mj, ring = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), mer = Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]);
          if (ring > 0.9 && mer > 3 && ((sh > 0.86) || (sh > 0.68 && j % 2 === 0) || (sh > 0.5 && j % 4 === 0))) shl.push([pts[3], pts[0]]);
        }
        var lc = hl ? hlC : lineCol(fm.c || mat.c);
        if (shl.length) g.lines(shl, lc, LW.shadeLn, null, 0.75 * alpha, 'butt');
        if (fine.length) g.lines(fine, lc, LW.fine, null, 0.8 * alpha);
        if (crease.length) g.lines(crease, lc, LW.crease, null, alpha);
        if (out.length) g.lines(out, lc, (hl ? LW.out * 1.25 : LW.out) * (thumb ? szK : Math.max(0.8, szK)), null, alpha);
        if (shade.length) g.lines(shade, lc, (hl ? LW.shade * 1.1 : LW.shade) * szK, null, alpha);
        count.edges += out.length + shade.length + crease.length + fine.length;
      });
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
      var col = css(colOf(L.col || 'acc')), aa = (L.alpha == null ? 1 : L.alpha) * Math.min(1, K * 1.6) * (foc ? 0.35 : 1);
      if (!thumb) g.lines([pts], col, (L.lw || 1.4) * 3.2 * k, null, 0.14 * aa);
      g.lines([pts], col, (L.lw || 1.4) * (thumb ? 0.8 : k), null, aa);
    });
    if (!thumb && !st.noDims && dimT > 0 && LA > 0.01) m.dims.forEach(function (d) { dimension(d); });
    if (!thumb && LA > 0.01) m.labels.forEach(function (L) {
      var p = proj(L.at, L.part), c = L.col === 'muted' ? css(pal.muted) : css(colOf(L.col));
      g.text(L.text, p[0] + L.dx * k, p[1] + L.dy * k, { size: Math.round(L.size * Math.max(0.85, Math.min(1.1, k))), weight: L.weight, fill: c, align: L.align, halo: bgC, haloW: 4, alpha: labT * LA });
    });
    if (!thumb && this.loupeOn() && labT > 0 && LA > 0.01) drawLoupe(this.loupeGeom(w), labT * LA);
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
      var size = 11.5, txt = css(pal.ink);
      (lp.m.bars || []).forEach(function (b) {
        var a = pj(b.a), c = pj(b.b), bx = c[0] - a[0], by = c[1] - a[1], Ln = Math.hypot(bx, by) || 1, nx = -by / Ln, ny = bx / Ln, tk = 4.5;
        g.lines([[a, c]], bgC, 4.2, null, 1, 'butt'); g.lines([[a, c]], txt, 1.3, null, 1, 'butt');
        g.lines([[[a[0] + nx * tk, a[1] + ny * tk], [a[0] - nx * tk, a[1] - ny * tk]], [[c[0] + nx * tk, c[1] + ny * tk], [c[0] - nx * tk, c[1] - ny * tk]]], txt, 1.1, null, 1, 'butt');
        var sd = b.side || 1, tw = g.measure(b.text, { size: size, weight: 600 }), tx = (a[0] + c[0]) / 2 + (b.tx || 0), ty = (a[1] + c[1]) / 2 + (b.ty || 0);
        if (Math.abs(bx) >= Math.abs(by)) ty += sd * -12; else tx += sd * (tw / 2 + 8);
        // the figure stays inside the disc
        var Rl = G.r - 7, dyc = Math.max(-Rl + 8, Math.min(Rl - 8, ty - G.y)), ey = Math.min(Rl, Math.abs(dyc) + 6), half = Math.sqrt(Math.max(0, Rl * Rl - ey * ey));
        ty = G.y + dyc; tx = Math.max(G.x - half + tw / 2, Math.min(G.x + half - tw / 2, tx));
        g.text(b.text, tx, ty, { size: size, weight: 600, fill: txt, align: 'center', halo: bgC, haloW: 4 });
      });
      (lp.m.tags || []).forEach(function (t2) { var q = pj(t2.at); g.text(t2.text, q[0] + (t2.dx || 0), q[1] + (t2.dy || 0), { size: size, weight: 600, fill: txt, align: t2.align || 'center', halo: bgC, haloW: 3.5 }); });
      g.unclip();
      g.circle(G.x, G.y, G.r, null, css(mix(pal.bg, pal.ink, 0.86)), 1.25 * k);
      g.circle(G.x, G.y, G.r + 3.5, null, css(mix(pal.bg, pal.ink, pal.dark ? 0.3 : 0.22)), 0.6 * k);
      // the caption under the disc, in the label's muted ink
      G.cap.forEach(function (ln, i) { g.text(ln, G.x, G.y + G.r + 16 + i * 16, { size: 12, weight: 500, fill: css(pal.muted), align: 'center', halo: bgC, haloW: 3 }); });
      g.ga = ga0;
    }

    function dimension(d) {
      var a3 = d.a, b3 = d.b, o = d.off, bp = d.bpart == null ? d.part : d.bpart;
      var A0 = proj(a3, d.part), B0 = proj(b3, bp), A1 = proj([a3[0] + o[0], a3[1] + o[1], a3[2] + o[2]], d.part), B1 = proj([b3[0] + o[0], b3[1] + o[1], b3[2] + o[2]], bp);
      var col = css(mix(pal.bg, pal.ink, pal.dark ? 0.62 : 0.68)), txt = css(mix(pal.bg, pal.ink, 0.78)), al = LA * (foc ? 0.35 : 1);
      var ex = [A1[0] - A0[0], A1[1] - A0[1]], el = Math.hypot(ex[0], ex[1]) || 1; ex = [ex[0] / el, ex[1] / el];
      var gap = 2.5 * k, over = 3.5 * k;
      g.lines([[[A0[0] + ex[0] * gap, A0[1] + ex[1] * gap], [A1[0] + ex[0] * over, A1[1] + ex[1] * over]], [[B0[0] + ex[0] * gap, B0[1] + ex[1] * gap], [B1[0] + ex[0] * over, B1[1] + ex[1] * over]]], col, 0.5 * k, null, al * dimT, 'butt');
      var mx0 = (A1[0] + B1[0]) / 2, my0 = (A1[1] + B1[1]) / 2, gr = easeOut(dimT);
      var a1 = [mx0 + (A1[0] - mx0) * gr, my0 + (A1[1] - my0) * gr], b1 = [mx0 + (B1[0] - mx0) * gr, my0 + (B1[1] - my0) * gr];
      var dx = b1[0] - a1[0], dy = b1[1] - a1[1], L = Math.hypot(dx, dy) || 1, u = [dx / L, dy / L], aL = Math.min(6.5 * k, L / 4), aW = 1.7 * k;
      var size = Math.max(11.5, Math.round(11.5 * Math.min(1.08, k) * 10) / 10), tw = g.measure(d.text, { size: size, weight: 500 }), th = size * 1.05;
      var half = (Math.abs(u[0]) * tw + Math.abs(u[1]) * th) / 2 + 4 * k, t = d.t == null ? 0.5 : d.t;
      var tx = a1[0] + dx * t, ty = a1[1] + dy * t, inside = L > 2 * half + 2 * aL + 8 && t > 0.05 && t < 0.95;
      if (Math.abs(u[1]) > 0.85) {
        // a standing dimension: the figure sits beside the line, on its outer side, and the line runs unbroken
        g.lines([[a1, b1]], col, 0.55 * k, null, al, 'butt');
        var sx = ex[0] >= 0 ? 1 : -1; tx = tx + sx * (tw / 2 + 5 * k); inside = true;
      } else if (inside) {
        g.lines([[a1, [tx - u[0] * half, ty - u[1] * half]], [[tx + u[0] * half, ty + u[1] * half], b1]], col, 0.55 * k, null, al, 'butt');
      } else {
        g.lines([[a1, b1]], col, 0.55 * k, null, al, 'butt');
        var tside = t >= 0.5 ? 1 : -1, base = tside > 0 ? b1 : a1;
        tx = base[0] + u[0] * tside * (half + 3 * k); ty = base[1] + u[1] * tside * (half + 3 * k);
      }
      g.arrow(a1, [-u[0], -u[1]], aL, col, aW, al); g.arrow(b1, u, aL, col, aW, al);
      tx = Math.max(tw / 2 + 2, Math.min(w - tw / 2 - 2, tx)); ty = Math.max(size, Math.min(h - size, ty));
      g.text(d.text, tx, ty, { size: size, weight: 500, fill: txt, align: 'center', halo: bgC, haloW: 3.5, alpha: al * clamp01(dimT * 1.6 - 0.4) });
    }

    function callouts() {
      var ls = self.labelStyle(w), e = fit.e, dl = cx + sc * e.minx, dr = cx + sc * e.maxx, midx = (dl + dr) / 2;
      if (!m.callouts[0]._lines) self.rooms(w, g);
      // a point as the drawn view puts it: a tracking label (the globe's) keeps the height it has there as the globe turns
      var proj0 = function (q, part) { var o = O[part], x = q[0] + o[0], y = q[1] + o[1], z = q[2] + o[2]; return [cx + sc * (R0[0] * x + R0[1] * y + R0[2] * z), cy - sc * (R0[3] * x + R0[4] * y + R0[5] * z)]; };
      var sides = { l: [], r: [] }, LGc = self.loupeOn() ? self.loupeGeom(w) : null;
      m.callouts.forEach(function (c) {
        var pts, wts = null, my = 0, mx = 0, base = c.pts.map(function (q) { return proj(q, q[3] == null ? c.part : q[3]); });
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
        var lines = c._lines || [c.text], hh = Math.max(lines.length, 1) * ls.fs * 1.18;
        sides[side].push({ c: c, pts: pts, wts: wts, y: my + (c.dy || 0) * k, hh: hh, lines: lines });
      });
      var lineC = css(mix(pal.bg, pal.ink, pal.dark ? 0.7 : 0.78));
      ['l', 'r'].forEach(function (sd) {
        var list = sides[sd]; if (!list.length) return;
        list.sort(function (a, b) { return a.y - b.y; });
        var minGap = ls.fs * 0.85, top = LGc && LGc.side === sd ? LGc.bottom : ls.fs, bot = h - ls.fs;
        for (var i = 0; i < list.length; i++) { var lo = i ? list[i - 1].y + (list[i - 1].hh + list[i].hh) / 2 + minGap : top + list[i].hh / 2; if (list[i].y < lo) list[i].y = lo; }
        var over = list[list.length - 1].y + list[list.length - 1].hh / 2 - bot;
        if (over > 0) { list[list.length - 1].y -= over; for (i = list.length - 2; i >= 0; i--) { var hi = list[i + 1].y - (list[i + 1].hh + list[i].hh) / 2 - minGap; if (list[i].y > hi) list[i].y = hi; } }
        var sg = sd === 'l' ? -1 : 1, xs = sd === 'l' ? dl - 8 * k : dr + 8 * k;
        list.forEach(function (L) {
          var c = L.c, fo = foc && foc.n === c.n && foc.text === c.text, col = fo ? hlC : inkC, lc = fo ? hlC : lineC;
          var E = [xs, L.y], Sx = xs + sg * 12 * k, S2 = [Sx, L.y];
          var la = clamp01(labT * 1.5) * LA, ta = clamp01((labT - 0.3) / 0.7) * (foc && !fo ? 0.45 : 1) * LA;
          // a tracking label whose towns are all round the back is set back with them
          if (L.wts) ta *= 0.4 + 0.6 * L.wts.reduce(function (a, b) { return Math.max(a, b); }, 0);
          L.pts.forEach(function (q, qi) {
            var wq = L.wts ? L.wts[qi] : 1, path = partial([[q[0], q[1]], E, S2], la);
            if (path.length > 1) { g.lines([path], bgC, 3.2 * k, null, 0.85 * ta * wq, 'round'); g.lines([path], lc, (fo ? 1 : ls.numbersOnly ? 0.85 : 0.7) * k, null, Math.max(ta, la * 0.9) * wq, 'round'); }
            g.circle(q[0], q[1], 2.3 * k, col, bgC, 1.1 * k, la * wq);
          });
          var tx = Sx + sg * 5 * k, x0, x1;
          if (c.n) {
            var r = ls.numbersOnly ? ls.num : ls.num * Math.max(0.9, Math.min(1.1, k)), ccx = Sx + sg * (r + 1);
            g.circle(ccx, L.y, r, bgC, col, (fo ? 1.5 : ls.numbersOnly ? 1.3 : 1.1) * k, ta);
            g.text(String(c.n), ccx, L.y + 0.5, { size: Math.round(r * (ls.numbersOnly ? 1.2 : 1.32)), weight: 600, fill: col, align: 'center', alpha: ta });
            tx = ccx + sg * (r + 5 * k);
          }
          var tw = 0;
          L.lines.forEach(function (s, li) {
            var yy = L.y + (li - (L.lines.length - 1) / 2) * ls.fs * 1.18;
            g.text(s, tx, yy, { size: ls.fs, weight: fo || c.strong ? 600 : 500, fill: c.col && !fo ? css(colOf(c.col)) : col, align: sd === 'l' ? 'right' : 'left', alpha: ta, halo: bgC, haloW: 3 });
            tw = Math.max(tw, g.measure(s, { size: ls.fs, weight: 500 }));
          });
          x0 = sd === 'l' ? tx - tw - 4 : Math.min(E[0], tx) - 4; x1 = sd === 'l' ? E[0] + 4 : tx + tw + 4;
          if (LA > 0.5) self._hit.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: L.y - L.hh / 2 - 4, y1: L.y + L.hh / 2 + 4, c: c });
        });
      });
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
    var parts = [c.part]; c.pts.forEach(function (q) { if (q[3] != null && parts.indexOf(q[3]) < 0) parts.push(q[3]); });
    return { n: c.n, text: c.text, tags: c.tag ? [].concat(c.tag) : null, parts: c.focus || parts, strict: !!c.tag, only: c.only || null };
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
  // the mode a canvas shows the plate in: { numbersOnly, noDims, noLabels }
  PL.mode = function (md) { md = md || {}; this.o.numbersOnly = !!md.numbersOnly; this.o.noDims = !!md.noDims; this.o.noLabels = !!md.noLabels; this.o.pad = md.pad == null ? null : md.pad; return (md.numbersOnly ? 'n' : '') + (md.noDims ? 'd' : '') + (md.noLabels ? 'l' : '') + (md.pad == null ? '' : 'p' + md.pad); };
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
    this.paint({ k: K, w: w, h: h, g: g, pal: pal, fit: this._fit, scale: K < 1 ? 0.975 + 0.025 * easeOut(K * 1.6) : 1, noDims: this.o.noDims, noLabels: this.o.noLabels,
      lite: !!st.lite, dyaw: st.dyaw || 0, delev: st.delev || 0, labA: st.labA == null ? 1 : st.labA, pick: !!st.pick });
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
   22 Nov 2026): the wafers in silicon slate, as on every plate. */
R('boule-and-wafer', function (m) {
  var Rb = 0.15, wT = 0.000775 / 2, yTip = -0.71, yB0 = -0.45, yB1 = 1.05, Rc = Rb * 1.03;
  var ing = m.part('ingot', { ex: [0, 0, 0], seq: 0 });
  var prof = [[0, yTip], [0.038, yTip], [0.078, yTip + 0.045, 0], [0.110, yTip + 0.095, 0], [0.133, yTip + 0.16, 0], [0.146, yTip + 0.215, 0], [Rb, yB0]];
  // growth striations on the ground body, as fine rings, and the two saw cuts the wafers came from
  var cuts = [-0.30, -0.24];
  prof.push([Rb, yB1]); prof.push([Rc, yB1]); prof.push([Rc, yB1 + 0.018]);
  [[0.992, 1.105], [0.972, 1.145], [0.936, 1.185], [0.880, 1.225], [0.800, 1.265], [0.690, 1.303], [0.545, 1.338], [0.370, 1.368], [0.185, 1.390]].forEach(function (q) { prof.push([Rc * q[0], q[1], 0]); });
  prof.push([0, 1.40]);
  // the ingot, the neck and the seed are solids of their own, so each lights alone when its part is pointed at
  m.tag('ingot');
  m.revolve(prof, 'turned', { seg: 48 });
  m.tag('neck');
  m.cyl([0, 1.465, 0], 0.0052, 0.13, 'turned', { seg: 12 });
  // the saw cuts: the slab the wafers came from, dashed round the body
  m.tag('ingot');
  cuts.forEach(function (cy) { m.wire(H.ring(0, cy, 0, Rb * 1.004, 48), { lw: 0.6, dash: [3, 2], alpha: 0.85, c: [0, cy, 0.2] }); });
  m.tag('seed');
  m.box({ c: [0, 1.565, 0], s: [0.015, 0.07, 0.015] }, 'mid');
  m.tag(null);
  m.cyl([0, 1.6225, 0], 0.026, 0.045, 'turnedDark', { seg: 20 });
  m.anchor(1, 'Seed', [0, 1.565, 0]); m.anchor(2, 'Neck', [0, 1.465, 0]); m.anchor(3, 'Ingot', [-0.05, 0.3, Rb * 0.8]);
  // the two wafers, as thick as they are, each with its notch
  function waferShape() { var s = []; for (var k = 0; k < 64; k++) { var a = k * TAU / 64; if (k === 16) { s.push([0.009, Rb * 0.998]); s.push([0, Rb - 0.01]); s.push([-0.009, Rb * 0.998]); continue; } s.push([Rb * Math.cos(a), Rb * Math.sin(a)]); } return s; }
  var ws = waferShape();
  var w1 = m.part('wafer1', { ex: [0.40, 0, 0], seq: 1 });
  m.prism(ws, cuts[0] - wT, cuts[0] + wT, 'accLight', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[0] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  var w2 = m.part('wafer2', { ex: [0.80, 0, 0], seq: 2 });
  m.prism(ws, cuts[1] - wT, cuts[1] + wT, 'accLight', { smooth: true, top: [D.circle(0, 0, Rb * 0.965, cuts[1] + wT, 48, { lw: 0.4, col: 'acc', alpha: 0.7 })] });
  m.anchor(4, 'Wafers', [[0.40, cuts[0], 0.0], [0.80, cuts[1], 0.0]], null);
  m.anchors[3].part = w1.idx; m.anchors[3].at = [[0, cuts[0] + wT, Rb * 0.5]]; m.anchors[3].multi = [[w2.idx, [0, cuts[1] + wT, Rb * 0.5]]];
  m.guide([[0, cuts[0], 0, ing.idx], [0, cuts[0], 0, w1.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[1], 0, ing.idx], [0, cuts[1], 0, w2.idx]], { style: 'axis', alpha: 0.8 });
  m.guide([[0, cuts[0], Rb, ing.idx], [0, cuts[0], Rb, w1.idx]], { alpha: 0.8 });
  m.guide([[0, cuts[1], -Rb, ing.idx], [0, cuts[1], -Rb, w2.idx]], { alpha: 0.8 });
  // review: the diameter is taken rim to rim across the wafer's centre (it was taken off the corners of the square round
  // the wafer, so its extension lines started in the air beside the disc)
  m.dim([-Rb, cuts[1] - wT, 0], [Rb, cuts[1] - wT, 0], [0, -0.1, 0], '300 mm', { part: w2.idx });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [1, 0, 0], calloutOpts: { 1: { tag: 'seed' }, 2: { tag: 'neck' }, 3: { tag: 'ingot' } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
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
   Colours (the set's legend): silicon slate (the bridges), copper (wiring and pads). */
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
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(cu - 0.9, sg * (ipD / 2 + 3.2) - 1.1, cu + 0.9, sg * (ipD / 2 + 3.2) + 1.1, subH / 2, { fill: 'dark', lw: 0.4 })); });
  }
  for (q = 0; q < 18; q++) {
    var cv = (q - 8.5) * (subD * 0.92 / 18);
    if (Math.abs(cv) > ipD / 2 + 2) continue;
    [-1, 1].forEach(function (sg) { capItems.push(D.rect(sg * (ipW / 2 + 3.2) - 1.1, cv - 0.9, sg * (ipW / 2 + 3.2) + 1.1, cv + 0.9, subH / 2, { fill: 'dark', lw: 0.4 })); });
  }
  capItems.push(D.rect(-ipW / 2, -ipD / 2, ipW / 2, ipD / 2, subH / 2, { dash: [3, 2], lw: 0.6, alpha: 0.8 }));
  capItems.push({ dots: gridPts(26, 16, 2.8, 2.8, subH / 2, 0, 0), r: 0.55, col: 'acc2', alpha: 0.8, tag: 'c4' });
  capItems.push(D.rect(-subW / 2 + 2.5, -subD / 2 + 2.5, subW / 2 - 2.5, subD / 2 - 2.5, subH / 2, { lw: 0.45, alpha: 0.5 }));
  m.box({ c: [0, subH / 2, 0], s: [subW, subH, subD], decals: { py: capItems } }, 'steel');
  var balls = [];
  for (var bx = -subW / 2 + 2; bx <= subW / 2 - 1.9; bx += 2.5) balls.push([bx, -0.75, subD / 2 - 1.5]);
  for (var bz = -subD / 2 + 2; bz <= subD / 2 - 3.9; bz += 2.5) balls.push([subW / 2 - 1.5, -0.75, bz]);
  m.dots(balls, { r: 1.0, ring: true, alpha: 0.75, front: true, c: [subW / 2, -0.75, subD / 2] });
  m.anchor(4, 'Substrate', [-subW / 2 + 16, subH * 0.15, subD / 2]);
  // 2 the interposer: redistribution wiring in ink, its copper lines, the microbump pads under each chip and, set into it, the
  // silicon bridges
  var pI = m.part('interposer', { ex: [0, 20, 0], seq: 1 });
  var y0 = subH, yT = ipH / 2, wiring = [];
  for (q = 0; q < 14; q++) { var rz = (q - 6.5) * (dieD * 0.8 / 14); wiring.push(D.line([-3.4, yT, rz], [3.4, yT, rz], { col: 'acc2', lw: 0.7 })); }
  hbm.forEach(function (h) {
    var sg = h[0] < 0 ? -1 : 1;
    for (var i = 0; i < 4; i++) {
      var z0 = h[1] + (i - 1.5) * 1.4;
      wiring.push(D.line([sg * (hbmX - hbmW * 0.32), yT, z0], [sg * (dieX + dieW / 2 - 1.4), yT, z0 * 0.92], { col: 'acc2', lw: 0.6 }));
    }
  });
  // the chips' seats, each with its pad grid
  dies.forEach(function (d) { wiring.push(D.rect(d[0] - dieW / 2, d[1] - dieD / 2, d[0] + dieW / 2, d[1] + dieD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(10, 12, 2.4, 2.5, yT, d[0], d[1]), r: 0.5, col: 'acc2', alpha: 0.85, tag: 'ubump' }); });
  hbm.forEach(function (h) { wiring.push(D.rect(h[0] - hbmW / 2, h[1] - hbmD / 2, h[0] + hbmW / 2, h[1] + hbmD / 2, yT, { lw: 0.5, alpha: 0.7, dash: [2, 1.6] })); wiring.push({ dots: gridPts(4, 4, 2.2, 2.2, yT, h[0], h[1]), r: 0.5, col: 'acc2', alpha: 0.85, tag: 'ubump' }); });
  // the bridges: one under the seam between the dies, one under each memory joint, each lifted out of its pocket in the
  // interposer's face (the pockets dashed)
  var BR = [[0, 0, 9, dieD * 0.82]];
  hbm.forEach(function (h) { var sg = h[0] < 0 ? -1 : 1; BR.push([sg * (dieX + dieW / 2 + 1.6), h[1] * 0.8, 6, 5]); });
  BR.forEach(function (b) { wiring.push(D.rect(b[0] - b[2] / 2, b[1] - b[3] / 2, b[0] + b[2] / 2, b[1] + b[3] / 2, yT, { lw: 0.5, dash: [1.6, 1.2], alpha: 0.85, col: 'acc' })); });
  m.tag('ip');
  m.box({ c: [0, y0 + ipH / 2, 0], s: [ipW, ipH, ipD], decals: { py: wiring } }, 'light');
  m.tag(null);
  m.anchor(3, 'Interposer', [ipW / 2, y0 + ipH, ipD / 4]);
  var pB = m.part('bridges', { ex: [0, 30, 0], seq: 2 });
  m.tag('bridge');
  BR.forEach(function (b) { m.box({ c: [b[0], y0 + ipH - 0.6, b[1]], s: [b[2], 1.2, b[3]] }, 'acc'); });
  m.tag(null);
  m.anchor(5, 'Silicon bridges', [BR[5][0] - BR[5][2] / 2, y0 + ipH - 0.6, BR[5][1]], pB.idx);
  // 3 the chips: two logic dies with a hint of their floorplan, eight HBM stacks with their twelve layers
  var pK = m.part('chips', { ex: [0, 42, 0], seq: 3 });
  var yK = y0 + ipH;
  m.tag('logic');
  dies.forEach(function (d) {
    var fp = [], sg = d[0] < 0 ? -1 : 1;
    for (var a = 0; a < 4; a++) for (var b = 0; b < 7; b++) fp.push(D.rect((a - 1.5) * dieW * 0.205 - dieW * 0.09 - sg * dieW * 0.05, (b - 3) * dieD * 0.13 - dieD * 0.055, (a - 1.5) * dieW * 0.205 + dieW * 0.09 - sg * dieW * 0.05, (b - 3) * dieD * 0.13 + dieD * 0.055, dieH / 2, { lw: 0.45, alpha: 0.75 }));
    fp.push(D.rect(sg * dieW * 0.38, -dieD * 0.45, sg * dieW * 0.47, dieD * 0.45, dieH / 2, { lw: 0.55, fill: 'mid' }));
    m.box({ c: [d[0], yK + dieH / 2, d[1]], s: [dieW, dieH, dieD], decals: { py: fp } }, 'steel');
  });
  m.tag('hbm');
  hbm.forEach(function (h) {
    var side = [];
    for (var k = 1; k < 12; k++) {
      var yy = -hbmH / 2 + hbmH * (k + 0.6) / 12.6;
      side.push(D.line([-hbmW / 2, yy, hbmD / 2], [hbmW / 2, yy, hbmD / 2], { lw: 0.35, alpha: 0.75 }));
    }
    var sideX = side.map(function (it) { return { pts: [[hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNX = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [-hbmW / 2, it.pts[0][1], hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    var sideNZ = side.map(function (it) { return { pts: [[-hbmW / 2, it.pts[0][1], -hbmD / 2], [hbmW / 2, it.pts[0][1], -hbmD / 2]], lw: 0.35, alpha: 0.75 }; });
    m.box({ c: [h[0], yK + hbmH / 2, h[1]], s: [hbmW, hbmH, hbmD], decals: { pz: side, px: sideX, nx: sideNX, nz: sideNZ, py: [D.rect(-hbmW / 2 + 1.2, -hbmD / 2 + 1.2, hbmW / 2 - 1.2, hbmD / 2 - 1.2, hbmH / 2, { lw: 0.4, alpha: 0.6 })] } }, 'steel');
  });
  m.tag(null);
  m.anchor(1, 'Logic dies', [dieX - dieW * 0.38, yK + dieH, -dieD * 0.36]);
  m.anchor(2, 'HBM stacks', [hbmX, yK + hbmH, hbmZ[2]]);
  // guides between the layers: the chips' corners down to their seats, the interposer's down to its seat
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (dieX + dieW / 2), y0 + ipH, c[1] * dieD / 2, pI.idx], [c[0] * (dieX + dieW / 2), yK, c[1] * dieD / 2, pK.idx]], { alpha: 0.9 });
    m.guide([[c[0] * ipW / 2, subH, c[1] * ipD / 2, pS.idx], [c[0] * ipW / 2, y0, c[1] * ipD / 2, pI.idx]], { alpha: 0.9 });
  });
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
   01 Design: a GPU die after Nvidia's published block diagram of the full GH100 die inside its H100 (Nvidia developer blog,
   22 March 2022: 8 GPCs of 18 SMs, 144 SMs in all, 60 MB of L2 cache, 12 memory controllers; 80 billion transistors on
   814 mm²). Drawn at one reticle field, 26 x 33 mm (ASML), a little larger than GH100, in millimetres.
   The floorplan lies on the die's face in three tones: the compute units in eight clusters, the L2 cache band across the
   middle, the memory controllers and their interfaces down the long edges. Each group carries a tag, so its label lights it
   and nothing else.
   The die-to-die link of two-die chips such as Blackwell (H100 has none; the caption says so) is a block of the die itself,
   flush on its near short edge (22 Nov 2026 review: it was a copper bar slid off the die, ruled with contacts like a scale,
   which read as a separate part and as copper). Colours (the set's legend, 22 Nov 2026): none here; the die is drawn in ink. */
R('die-floorplan', function (m) {
  var W = 26, Dd = 33, T = 0.9, yT = T / 2, bh = 0.06, yB = yT + bh / 2, bt = bh / 2;
  m.part('die', { ex: [0, 0, 0], seq: 0, mode: 'stack' });
  // a block of the floorplan: a thin solid lying on the die's face, so a pointer on it names its own group
  function blk(x0, z0, x1, z1, mat, tag, dec) { m.tag(tag || null); var s = m.box({ c: [(x0 + x1) / 2, yB, (z0 + z1) / 2], s: [x1 - x0, bh, z1 - z0], decals: dec ? { py: dec } : null }, mat); m.tag(null); return s; }
  // the host interface and NVLink ports across the far short edge, drawn on the die's face
  var face = [D.rect(-11.6, 14.2, 11.6, 16.1, yT, { fill: 'steel', lw: 0.45 })];
  for (var n = 0; n < 9; n++) { var nx = -10.8 + n * 2.62; face.push(D.rect(nx, 14.55, nx + 1.9, 15.75, yT, { lw: 0.3, fill: 'light' })); }
  m.box({ c: [0, 0, 0], s: [W, T, Dd], decals: { py: face } }, 'light');
  // memory interfaces down the long edges, the controllers inside them
  [-1, 1].forEach(function (s) {
    for (var k = 0; k < 6; k++) {
      var z0 = -13.6 + k * 4.55, z1 = z0 + 4.1, xa = Math.min(s * 10.5, s * 12.3), xb = Math.max(s * 10.5, s * 12.3), rule = [];
      for (var q = 1; q <= 5; q++) { var zz = (z1 - z0) * (q / 6 - 0.5); rule.push(D.line([-(xb - xa) / 2 + 0.2, bt, zz], [(xb - xa) / 2 - 0.2, bt, zz], { lw: 0.3, alpha: 0.7 })); }
      blk(xa, z0, xb, z1, 'mid', 'mem', rule);
      blk(Math.min(s * 8.75, s * 10.2), z0 + 0.25, Math.max(s * 8.75, s * 10.2), z1 - 0.25, 'steel', 'mem');
    }
  });
  // eight clusters of eighteen compute units, four above and four below the cache band
  var gcW = 17.2 / 4;
  [[3.4, 13.7], [-13.7, -3.4]].forEach(function (bz) {
    for (var gI = 0; gI < 4; gI++) {
      var x0 = -8.6 + gI * gcW + 0.18, x1 = x0 + gcW - 0.36, cxm = (x0 + x1) / 2, czm = (bz[0] + bz[1]) / 2, tiles = [];
      var tw = (x1 - x0 - 0.3) / 3, td = (bz[1] - bz[0] - 0.4) / 6;
      for (var a = 0; a < 3; a++) for (var c = 0; c < 6; c++) {
        var tx0 = x0 + 0.15 + a * tw + 0.09 - cxm, tz0 = bz[0] + 0.2 + c * td + 0.09 - czm;
        tiles.push(D.rect(tx0, tz0, tx0 + tw - 0.18, tz0 + td - 0.18, bt, { fill: 'paper', lw: 0.3, alpha: 0.9 }));
      }
      blk(x0, bz[0], x1, bz[1], 'light', 'sm', tiles);
    }
  });
  // the L2 cache in two partitions across the middle, ruled as memory arrays are, with the crossbar between them
  [[-8.6, -0.5], [0.5, 8.6]].forEach(function (b) {
    var rule = [], hw = (b[1] - b[0]) / 2;
    for (var q = 1; q < 12; q++) { var zz = -2.8 + 5.6 * q / 12; rule.push(D.line([-hw + 0.2, bt, zz], [hw - 0.2, bt, zz], { lw: 0.28, alpha: 0.75 })); }
    blk(b[0], -2.8, b[1], 2.8, 'steel', 'l2', rule);
  });
  blk(-0.4, -2.8, 0.4, 2.8, 'dark', 'l2');
  // the die-to-die link: one plain block of the die, flush along the near short edge
  var LX = 11.6, Lz0 = -16.1, Lz1 = -14.3;
  blk(-LX, Lz0, LX, Lz1, 'dark', 'd2d');
  m.dim([-W / 2, -yT, Dd / 2], [W / 2, -yT, Dd / 2], [0, 0, 4.2], '26 mm');
  m.dim([W / 2, -yT, Dd / 2], [W / 2, -yT, -Dd / 2], [4.2, 0, 0], '33 mm');
  // labels, each lighting its own group (tag)
  m.callout([-6.5, yT + bh, -8.5], 'Compute units', { side: 'l', tag: 'sm' });
  m.callout([-4.5, yT + bh, 0], 'Cache', { side: 'l', tag: 'l2' });
  m.callout([-11.4, yT + bh, -6.6], 'Memory controllers', { side: 'l', tag: 'mem' });
  m.callout([-LX * 0.35, yT + bh, (Lz0 + Lz1) / 2], 'Die-to-die link', { side: 'l', tag: 'd2d' });
  return { elev: PLATE.ISO.elev, yaw: 3 * Math.PI / 4, sortAxis: [0, 1, 0], start: 2.2, thumbX: 0.5, accent: [111, 139, 166], accentDark: [195, 211, 226] };
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
   - the light meets the mask and leaves it at the same angle, 5.4 degrees from the mask's normal, the chief-ray angle in the
     imec and PTB paper chapter 5 cites (arxiv.org/abs/1912.09075); it was 17 degrees in and 36 out;
   - the mask and the wafer are both drawn at twice their size, as the caption says: the mask 152.4 mm square and 6.35 mm thick
     (Hoya's US patent 9,494,851), the wafer 300 mm across and 775 micrometres thick (SEMI M1); they were 4x and 1.6x;
   - the last mirror sits straight over the wafer, so the wafer stage drops along its beam.
   Colours (the set's legend): the light in the beam hue, the wafer in silicon slate (acc2), as on every plate. */
R('euv-scanner', function (m) {
  function unit(v) { var L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
  var X2 = 2, MASK = 0.1524 * X2, MASKT = 0.00635 * X2, WR = 0.15 * X2, WT = 0.000775 * X2;
  // how far each module stands from its assembled place at rest
  var EXS = { src: [-0.5, 0], ill: [0, 0], ret: [0, 0.30], pob: [0, 0], waf: [0, -0.36] };
  var PLASMA = [-1.14, -1.34], COLL = [-1.80, -1.34];
  // the mask stands over the seam between the illuminator and the projection optics; the illuminator's last mirror and the
  // optics' first stand level with each other, either side of it, so the light comes in and goes out at the same angle
  var XM = 0.19, YM = 1.68, YS = 0.18, CRA = 5.4 * Math.PI / 180, DX = (YM + EXS.ret[1] - YS) * Math.tan(CRA);
  var NODE = [
    { p: [-0.56, -1.34], k: 'ap', o: 'ill' }, { p: [-0.24, -0.82], k: 'm', r: 0.20, o: 'ill' }, { p: [-0.98, -0.10], k: 'm', r: 0.30, o: 'ill' }, { p: [XM - DX, YS], k: 'm', r: 0.11, o: 'ill' },
    { p: [XM, YM], k: 'ret', o: 'ret' },
    { p: [XM + DX, YS], k: 'm', r: 0.11, o: 'pob' }, { p: [1.30, 0.05], k: 'm', r: 0.24, o: 'pob' }, { p: [0.66, -0.30], k: 'm', r: 0.20, o: 'pob' },
    { p: [1.32, -0.62], k: 'm', r: 0.23, o: 'pob' }, { p: [0.66, -0.92], k: 'm', r: 0.18, o: 'pob' }, { p: [1.12, -1.18], k: 'm', r: 0.26, o: 'pob' },
    { p: [1.12, -1.74], k: 'waf', o: 'waf' }];
  var REST = function (q) { var e = EXS[q.o]; return [q.p[0] + e[0], q.p[1] + e[1]]; };
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
    var sv = m.revolve(prof, mat || 'turnedDark', { seg: 28, rot: [0, 0, th], pos: [q[0], q[1], 0], sortFaces: true });
    m.tag(null);
    return sv;
  }
  // a module's housing cut open on the optical plane (z = 0): back wall, floor, roof and side walls, cut edges hatched
  function housing(cx, cy, w, h, d, t) {
    var cutF = { pz: 'cut' };
    m.box({ c: [cx, cy, -d + t / 2], s: [w, h, t] }, 'paper');
    m.box({ c: [cx, cy - h / 2 + t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx, cy + h / 2 - t / 2, -d / 2], s: [w, t, d], fmat: cutF }, 'light');
    m.box({ c: [cx - w / 2 + t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
    m.box({ c: [cx + w / 2 - t / 2, cy, -d / 2], s: [t, h - 2 * t, d], fmat: cutF }, 'light');
  }
  var src = m.part('source', { ex: [EXS.src[0], EXS.src[1], 0], seq: 0 });
  var vesR = 0.66, vx0 = -1.94, vx1 = -0.72, vc = (vx0 + vx1) / 2;
  // the vessel, cut on the optical plane (z = 0) with the far half kept, as the other modules are
  m.revolve([[0.62, -0.61], [vesR, -0.61], [vesR, 0.61], [0.62, 0.61]], 'turned', { seg: 40, a0: Math.PI, a1: Math.PI * 2, rot: [0, 0, -Math.PI / 2], pos: [vc, PLASMA[1], 0], cut: 'cut', sortFaces: true });
  mirror(COLL, [1, 0], 0.56, 'turned', { rIn: 0.075, notag: true });
  // the tin plasma, in the light's own hue: it is where the light is made
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 4.2, col: 'acc', alpha: 0.35 });
  m.dots([[PLASMA[0], PLASMA[1], 0]], { r: 2.2, col: 'acc', alpha: 1 });
  m.cyl([PLASMA[0], PLASMA[1] + 0.72, 0], 0.05, 0.30, 'turnedDark', { seg: 20 });
  var drops = []; for (var i = 0; i < 7; i++) drops.push([PLASMA[0], PLASMA[1] + 0.52 - i * 0.07, 0]);
  m.dots(drops, { r: 1.3, alpha: 0.9 });
  m.wire([[-2.14, PLASMA[1], 0], [PLASMA[0] - 0.05, PLASMA[1], 0]], { lw: 0.8, dash: [5, 3], alpha: 0.8 });
  m.box({ c: [-2.02, PLASMA[1], 0], s: [0.26, 0.30, 0.30] }, 'mid');
  m.anchor(1, 'Light source', [PLASMA[0], PLASMA[1], 0]);
  // illuminator: its housing, cut open, and three mirrors; its roof stops short of the mask, so the light crosses open air
  var ill = m.part('illuminator', { ex: [0, 0, 0], seq: 1 });
  housing(-0.57, -0.24, 1.52, 2.08, 0.575, 0.05);
  [1, 2, 3].forEach(function (k) { mirror(NODE[k].p, NODE[k].nv, NODE[k].r); });
  // the reticle stage on top, the mask hanging pattern-down beneath it
  var ret = m.part('reticle', { ex: [EXS.ret[0], EXS.ret[1], 0], seq: 3 });
  var Rp = NODE[4].p;
  m.box({ c: [Rp[0], Rp[1] + MASKT / 2, 0], s: [MASK, MASKT, MASK], decals: { ny: [D.rect(-MASK * 0.34, -MASK * 0.27, MASK * 0.34, MASK * 0.27, -MASKT / 2, { lw: 0.5 })] } }, 'light');
  m.box({ c: [Rp[0], Rp[1] + MASKT + 0.035, 0], s: [MASK + 0.08, 0.07, MASK + 0.06] }, 'mid');
  [-1, 1].forEach(function (s) { m.box({ c: [Rp[0], Rp[1] + MASKT + 0.095, s * (MASK / 2 + 0.06)], s: [1.30, 0.045, 0.055] }, 'dark'); });
  m.anchor(3, 'Mask', [Rp[0] - MASK * 0.3, Rp[1], 0]);
  // the projection optics: six mirrors in their box
  var pob = m.part('optics', { ex: [EXS.pob[0], EXS.pob[1], 0], seq: 2 });
  housing(0.92, -0.415, 1.46, 2.43, 0.61, 0.05);
  for (var k = 5; k <= 10; k++) mirror(NODE[k].p, NODE[k].nv, NODE[k].r);
  m.anchor(2, 'Mirrors', [[NODE[6].p[0], NODE[6].p[1], NODE[6].r * 0.8], [NODE[8].p[0], NODE[8].p[1], NODE[8].r * 0.8]]);  // on the near rims of the two right-hand mirrors
  // the wafer stage and the base frame: two wafer tables side by side, the light landing on the right-hand one
  // review: 'stack' paints the stage block before the chucks and wafers on it
  var waf = m.part('wafer', { ex: [EXS.waf[0], EXS.waf[1], 0], seq: 4, mode: 'stack' });
  var Wp = NODE[11].p;
  [0, -0.78].forEach(function (dx, j) {
    m.cyl([Wp[0] + dx, Wp[1] - 0.042 - WT / 2, 0], WR * 1.08, 0.075, 'turnedDark', { seg: 32 });
    if (!j) m.tag('wafer');
    m.cyl([Wp[0] + dx, Wp[1] - WT / 2, 0], WR, WT, 'acc2Light', { seg: 32, top: j ? [] : [D.rect(-0.026, -0.033, 0.026, 0.033, WT / 2, { fill: 'acc', lw: 0.6, col: 'acc' })] });
    m.tag(null);
  });
  m.box({ c: [Wp[0] - 0.39, Wp[1] - 0.135, 0], s: [1.66, 0.10, 0.66] }, 'mid');
  m.anchor(4, 'Wafer', [Wp[0] - WR * 0.5, Wp[1], 0]);
  var base = m.part('base', { ex: [0, -0.62, 0], seq: 5, pri: -1 });
  m.box({ c: [-0.16, -2.16, 0], s: [3.66, 0.20, 1.36] }, 'steel');
  for (i = 0; i < 4; i++) { var lx = -0.16 - 1.83 + 0.36 + i * (3.66 - 0.72) / 3; [0.5, -0.5].forEach(function (z) { m.cyl([lx, -2.38, z], 0.085, 0.24, 'turnedDark', { seg: 16 }); }); }
  void base;
  // the light: through each module, attached to the part it is in at each end
  var idx = { ill: ill.idx, ret: ret.idx, pob: pob.idx, waf: waf.idx };
  var pts = [[PLASMA[0], PLASMA[1], 0, src.idx]].concat(NODE.map(function (q) { return [q.p[0], q.p[1], 0, idx[q.o]]; }));
  m.guide(pts, { style: 'beam', col: 'acc', lw: 1.5 });
  // the collector's cone of light, from its rim to the plasma and on to the focus
  [0.27, -0.27, 0.5, -0.5].forEach(function (rr) { m.guide([[COLL[0] + 0.28 * (rr / 0.56) * (rr / 0.56), PLASMA[1] + rr, 0, src.idx], [NODE[0].p[0], NODE[0].p[1], 0, src.idx]], { style: 'beam', col: 'acc', lw: 0.7, alpha: 0.55 }); });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, calloutOpts: { 2: { tag: 'mirror' }, 4: { tag: 'wafer' } }, accent: [107, 127, 209], accentDark: [167, 180, 245], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
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
   silicon slate; the gate metal is ink (it is not gold). */
R('gaa-transistor', function (m) {
  var sT = 6, sW = 30, y0 = [0, 16, 32], gX = 7.5, spX = 12.5, gY0 = -11, gY1 = 45, gZ = 19, PULL = 62;
  var GATE = { d: 0.25 }, GATECUT = { d: 0.06, hatch: 1 };
  function bx(x0, ya, z0, x1, yb, z1, mat, fm, dec) { return m.box({ c: [(x0 + x1) / 2, (ya + yb) / 2, (z0 + z1) / 2], s: [x1 - x0, yb - ya, z1 - z0], fmat: fm, decals: dec }, mat); }
  var epiShape = [[12.5, -13], [16.3, -17], [20.2, -17], [24, -13], [24, 13], [20.2, 17], [16.3, 17], [12.5, 13]];
  // source half, cut at x = 0
  var L = m.part('source', { mode: 'fixed', ex: [0, 0, 0], seq: 0 });
  bx(-30, -23, -25, 0, -16, 25, 'mid', { px: 'cut' });
  bx(-27, -16, -22, 0, -11, 22, 'steel', { px: 'cut' });
  m.tag('src');
  m.prism(epiShape.map(function (q) { return [-q[0], q[1]]; }), -2, 40, 'light', {});
  m.tag('spacer');
  [[sT, 16], [22, 32]].forEach(function (b) { bx(-spX, b[0], -sW / 2, -gX, b[1], sW / 2, 'dark'); });
  m.tag('sheet');
  y0.forEach(function (yb) { bx(-spX, yb, -sW / 2, -gX, yb + sT, sW / 2, 'acc'); });
  m.tag('gate');
  bx(-gX, gY0, -gZ, 0, gY1, gZ, GATE, { px: GATECUT });
  m.tag('sheet');
  y0.forEach(function (yb) { m.sheet([[0.05, yb, -sW / 2], [0.05, yb, sW / 2], [0.05, yb + sT, sW / 2], [0.05, yb + sT, -sW / 2]], 'cutAcc'); });
  m.tag(null);
  bx(-5, gY1, -8, 0, 51, 8, 'dark', { px: 'cut' });
  var cL = m.part('contactS', { ex: [0, 10, 0], seq: 2 });
  bx(-23, 40, -10, -14.5, 48, 10, 'dark');
  // drain half, pulled away along the channel
  var Rr = m.part('drain', { mode: 'fixed', ex: [PULL, 0, 0], seq: 1 });
  bx(0, -23, -25, 30, -16, 25, 'mid');
  bx(0, -16, -22, 27, -11, 22, 'steel');
  m.tag('gate');
  bx(0, gY0, -gZ, gX, gY1, gZ, GATE);
  m.tag('spacer');
  [[sT, 16], [22, 32]].forEach(function (b) { bx(gX, b[0], -sW / 2, spX, b[1], sW / 2, 'dark'); });
  m.tag('sheet');
  y0.forEach(function (yb) { bx(gX, yb, -sW / 2, spX, yb + sT, sW / 2, 'acc'); });
  m.tag('drn');
  m.prism(epiShape, -2, 40, 'light', {});
  m.tag(null);
  bx(0, gY1, -8, 5, 51, 8, 'dark');
  var cR = m.part('contactD', { ex: [PULL, 10, 0], seq: 3 });
  bx(14.5, 40, -10, 23, 48, 10, 'dark');
  m.guide([[-34, 19, 0, L.idx], [0, 19, 0, L.idx], [0, 19, 0, Rr.idx], [34, 19, 0, Rr.idx]], { style: 'axis', alpha: 0.8 });
  [[-gZ, gY1], [gZ, gY1], [gZ, gY0], [-gZ, gY0]].forEach(function (c) { m.guide([[0, c[1], c[0], L.idx], [0, c[1], c[0], Rr.idx]], { alpha: 0.8 }); });
  m.guide([[-18.75, 40, 0, L.idx], [-18.75, 40, 0, cL.idx]], { alpha: 0.8 });
  m.guide([[18.75, 40, 0, Rr.idx], [18.75, 40, 0, cR.idx]], { alpha: 0.8 });
  // the five numbered parts, as chapter 8 names them (names from data/specimen-parts.json)
  m.anchor(1, 'Source', [-18.2, 30, 17], L.idx);
  m.anchor(2, 'Drain', [24, 30, 0], Rr.idx);
  m.anchor(3, 'Silicon sheets', [-10, 19, sW / 2], L.idx);
  m.anchor(4, 'Gate metal', [0.05, -6.5, 9], L.idx);
  m.anchor(5, 'Inner spacers', [-10, 27, sW / 2], L.idx);
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, calloutOpts: { 1: { tag: 'src', side: 'l' }, 2: { tag: 'drn', side: 'r' }, 3: { tag: 'sheet', side: 'l' }, 4: { tag: 'gate', side: 'l' }, 5: { tag: 'spacer', side: 'l' } }, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

})(window.PLATE);}catch(e){console.warn('plate gaa-transistor.js failed to load', e);}
/* plates/gas-cabinet.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   03 Chemicals: a three-cylinder gas cabinet with its door off, in metres, and a bulk liquid cylinder behind it. One gas
   cylinder slides out of the cabinet the way it is changed; the exhaust collar lifts off.
   22 Nov 2026 review: its sizes (0.97 x 0.48 x 1.93 m) came from a supplier's catalogue, not an allowed source, so the
   plate carries no dimensions and the caption makes no claim of scale. Each label lights its own group (tags: panel,
   cylinders, bulk). Colours (the set's legend): the gas panel in the steel accent, the one steel colour of the set. */
R('gas-cabinet', function (m) {
  var CBX = -0.30, CW = 0.97, CD = 0.48, CPL = 0.12, CTOP = 1.93, t = 0.022;
  // painted in layers: the back shell, then the cylinders inside, then the front of the cabinet. The plate rocks
  // (its open front always toward the reader), so this order holds at every frame.
  var shell = m.part('shell', { ex: [0, 0, 0], seq: 0, pri: -1, mode: 'depth' });
  var CH = CTOP - CPL, CY = (CPL + CTOP) / 2;
  m.box({ c: [CBX, CPL / 2, 0], s: [CW, CPL, CD] }, 'mid');                                  // plinth
  m.box({ c: [CBX, CY, -CD / 2 + t / 2], s: [CW, CH, t] }, 'light');                       // back wall
  m.box({ c: [CBX - CW / 2 + t / 2, CY, 0], s: [t, CH, CD] }, 'steel');                   // far side
  var grille = [D.rectZY(-0.15, -0.17, 0.15, 0.17, t / 2 + 0.001, { lw: 0.6 })];
  for (var i = 0; i < 5; i++) grille.push(D.line([t / 2 + 0.001, -0.12 + i * 0.055, -0.13], [t / 2 + 0.001, -0.12 + i * 0.055, 0.13], { lw: 0.45 }));
  grille = grille.map(function (it) { return { pts: it.pts.map(function (p) { return [p[0], p[1] + CPL + 0.34 - CY, p[2]]; }), closed: it.closed, lw: it.lw }; });
  var front = m.part('front', { ex: [0, 0, 0], seq: 0, pri: 1, mode: 'depth' });
  m.box({ c: [CBX + CW / 2 - t / 2, CY, 0], s: [t, CH, CD], decals: { px: grille } }, 'steel');   // near side
  m.box({ c: [CBX, CTOP - t / 2, 0], s: [CW, t, CD] }, 'light');                          // roof
  // the open front's frame return, and three hinges
  m.box({ c: [CBX, CY, CD / 2 - 0.01], s: [CW, CH, 0.02], skip: [] }, 'phantom');
  for (i = 0; i < 3; i++) m.box({ c: [CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045], s: [0.045, 0.09, 0.045] }, 'mid');
  // restraint bars, in front of the cylinders
  [0.58, 1.04].forEach(function (by) { m.box({ c: [CBX, by, 0.045], s: [CW - 0.13, 0.038, 0.038] }, 'dark'); });
  m.use(shell);
  // the gas panel, steel-gray, on the back wall: plate, headers, valve blocks, gauges, regulator
  var PZ = -CD / 2 + 0.035, PY0 = 1.44, cylX = [-0.29, 0, 0.29];
  m.tag('panel');
  m.box({ c: [CBX - 0.02, PY0 + 0.25, PZ - 0.008], s: [0.84, 0.46, 0.012] }, 'acc');
  m.wire([[CBX - 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 + 0.06, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX + 0.40, PY0 + 0.44, PZ + 0.03]], { col: 'acc', lw: 1.6 });
  cylX.forEach(function (cx) {
    var px = CBX + cx;
    m.box({ c: [px, PY0 + 0.06, PZ + 0.03], s: [0.058, 0.062, 0.058] }, 'accDark');
    m.box({ c: [px, PY0 + 0.44, PZ + 0.03], s: [0.052, 0.056, 0.052] }, 'accDark');
    m.wire([[px, PY0 + 0.10, PZ + 0.03], [px, PY0 + 0.41, PZ + 0.03]], { col: 'acc', lw: 1.4 });
    m.cyl([px, PY0 + 0.265, PZ + 0.04], 0.05, 0.02, 'accLight', { seg: 24, rot: [Math.PI / 2, 0, 0], top: [] });
    m.wire(H.ring(px, PY0 + 0.265, PZ + 0.051, 0.02, 20, 'z'), { col: 'acc', lw: 0.6 });
  });
  m.cyl([CBX + 0.40, PY0 + 0.06, PZ + 0.03], 0.048, 0.052, 'accTurned', { seg: 24 });
  m.wire([[CBX + 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 - 0.16, PZ + 0.03], [CBX + CW / 2 + 0.19, PY0 - 0.16, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.cyl([CBX + CW / 2 + 0.115, PY0 - 0.16, PZ + 0.03], 0.03, 0.115, 'accTurned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.wire([[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX - 0.40, CTOP - 0.03, PZ + 0.03]], { col: 'acc', lw: 1.4 });
  m.tag(null);
  // three cylinders; the middle one slides out
  function bottle(x, hgt, cz) {
    m.tag('cyl');
    var b0 = CPL, b1 = CPL + hgt, sh = b1 + 0.11, CR = 0.114;
    m.revolve([[0, b0], [CR, b0], [CR, b0 + 0.02, 2], [CR, b1 - 0.135, 2], [CR, b1 - 0.085, 2], [CR, b1, 0], [0.034, sh], [0.034, sh + 0.02], [0, sh + 0.02]], 'turned', { seg: 32, pos: [x, 0, cz] });
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
  m.tag('panel');
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
  m.box({ c: [CBX, CTOP + 0.085, -0.02], s: [0.66, 0.17, 0.40] }, 'steel');
  m.cyl([CBX, CTOP + 0.37, -0.02], 0.102, 0.40, 'turned', { seg: 28, rIn: 0.09 });
  m.guide([[CBX, CTOP, -0.02, cab.idx], [CBX, CTOP + 0.62, -0.02, ex.idx]], { style: 'axis', alpha: 0.85 });
  // the bulk liquid cylinder behind
  var bulk = m.part('bulk', { ex: [0, 0, 0], seq: 0, pri: -2 });
  var TX = 0.86, TZ = -0.40, TR = 0.205, TB = 0.15, TT = 1.06;
  m.tag('bulk');
  var bp = [[0, 0], [TR * 0.86, 0], [TR * 0.86, TB], [TR, TB], [TR, 0.30, 2], [TR, 0.48, 2], [TR, 0.66, 2], [TR, 0.84, 2], [TR, 0.94, 2], [TR, 1.00, 2], [TR, TT]];
  for (i = 1; i <= 6; i++) { var a = i / 6 * Math.PI / 2; bp.push([TR * Math.cos(a), TT + TR * 0.52 * Math.sin(a), 0]); }
  bp.push([0, TT + TR * 0.52]);
  m.revolve(bp, 'turned', { seg: 36, pos: [TX, 0, TZ] });
  m.cyl([TX, TT + 0.20, TZ], TR * 0.98, 0.03, 'turnedDark', { seg: 36, rIn: TR * 0.9 });
  m.box({ c: [TX, TT + 0.10, TZ + 0.02], s: [0.16, 0.075, 0.10] }, 'mid');
  for (i = 0; i < 4; i++) { var pa = i * TAU / 4 + 0.5; m.wire([[TX + TR * 0.94 * Math.cos(pa), TT + 0.03, TZ + TR * 0.94 * Math.sin(pa)], [TX + TR * 0.96 * Math.cos(pa), TT + 0.19, TZ + TR * 0.96 * Math.sin(pa)]], { lw: 1.1 }); }
  var coil2 = []; for (i = 0; i <= 5 * 24; i++) { var tt = i / 24 * TAU; coil2.push([TX - TR - 0.046 + 0.042 * Math.cos(tt), 0.49 + i / 24 * 0.046, TZ + 0.02 + 0.042 * Math.sin(tt)]); }
  m.wire(coil2, { lw: 0.7 });
  m.tag(null);
  // labels: each lights its own group. The cylinders' one leader goes to the cylinder that slid out, clear of the
  // cabinet's restraint bars, and its label lights all three
  m.callout([CBX + cylX[0] - 0.09, 0.82, -0.055 + 0.07, out.idx], 'Gas cylinders', { side: 'l', tag: 'cyl' });
  m.callout([CBX - 0.25, PY0 + 0.25, PZ, shell.idx], 'Valves, regulator and gauges', { side: 'l', dy: -14, tag: 'panel' });
  m.callout([TX + TR * 0.5, 0.75, TZ + TR * 0.86, bulk.idx], 'Bulk liquid cylinder', { side: 'r', tag: 'bulk' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [117, 132, 144], accentDark: [198, 206, 213] };
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
   own copy is unchanged). The globe rests closed and keeps turning, slowly, about the Earth's axis. */
R('globe', function (m) {
  var RAD = Math.PI / 180, G = window.PLATE_GLOBE;
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
  function pin(lat, lon, hgt, col, i) {
    var n = ll(lat, lon, 1), p = m.part('pin' + i, { ex: [n[0] * 0.35, n[1] * 0.35, n[2] * 0.35], seq: 1 + (i % 6), pri: 1 });
    var a = ll(lat, lon, 1), b = ll(lat, lon, 1 + hgt), foot = [], u = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    var e1 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]], L1 = Math.hypot(e1[0], e1[1], e1[2]); e1 = [e1[0] / L1, e1[1] / L1, e1[2] / L1];
    var e2 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
    for (var k = 0; k <= 16; k++) { var t = k * TAU / 16; foot.push([a[0] + 0.02 * (e1[0] * Math.cos(t) + e2[0] * Math.sin(t)), a[1] + 0.02 * (e1[1] * Math.cos(t) + e2[1] * Math.sin(t)), a[2] + 0.02 * (e1[2] * Math.cos(t) + e2[2] * Math.sin(t))]); }
    m.wire(foot, { col: col, lw: 0.8, vis: a, c: a });
    m.wire([a, b], { col: col, lw: 2.5, vis: a, c: b });
    m.dots([b], { col: col, r: 3.5, front: false, c: b });
    m.cur.items[m.cur.items.length - 1].vis = a;
  }
  Object.keys(PINS).forEach(function (cn) { PINS[cn].forEach(function (q) { pin(q.lat, q.lon, q.h, 'acc', q.i); }); });
  // the Earth's axis as a centre line, and one label for each country, with leaders to its pins
  m.use(g);
  m.guide([[0, 1, 0, g.idx], [0, 1.3, 0, g.idx]], { style: 'axis', alpha: 0.9, front: true });
  m.guide([[0, -1.3, 0, g.idx], [0, -1, 0, g.idx]], { style: 'axis', alpha: 0.9 });
  var partOf = function (i) { return m.parts.filter(function (p) { return p.name === 'pin' + i; })[0].idx; };
  var head = function (q) { var v = ll(q.lat, q.lon, 1 + q.h); return [v[0], v[1], v[2], partOf(q.i)]; };
  // the globe turns, so each label carries its country's pins (track): a leader fades in as a pin comes round to the label's
  // side and out as it nears the rim. The first pin sets the label's height in the drawn view
  [['Netherlands', 'l'], ['United States', 'l'], ['China', 'r'], ['South Korea', 'r'], ['Japan', 'r'], ['Taiwan', 'r']].forEach(function (c) {
    var ps = PINS[c[0]];
    m.callout([head(ps[0])], c[0], { side: c[1] });
    var co = m.callouts[m.callouts.length - 1];
    co.track = ps.map(head);
    co.focus = ps.map(function (q) { return partOf(q.i); });
  });
  return { elev: 36 * RAD, yaw: -72 * RAD, spin: 0.06, start: 1, rest: 0, maxH: 430, accent: [122, 31, 43], accentDark: [201, 83, 106] };
});

})(window.PLATE);}catch(e){console.warn('plate globe.js failed to load', e);}
/* plates/gpu-baseboard.js */
try{(function(PLATE){'use strict';var R = PLATE.register, D = PLATE.D, H = PLATE.H, TAU = H.TAU, frame = H.frame, gridPts = H.gridPts, ring = H.ring, farHalf = H.farHalf, rng = H.rng;
/* =====================================================================================================
   13 Systems: an eight-GPU baseboard in the units of specimens/gpu-baseboard.js, simplified and not to scale (the caption
   says so): its sizes, 510 x 400 mm and 30 mm frames in the old file, have no allowed source, so the plate carries no
   dimension. The eight accelerator modules lift out of their frames, showing the land grids they press onto.
   22 Nov 2026 review: each module now carries its package, drawn at this site's estimate for the B200 (95 x 68 mm, with its
   78 x 50 interposer and two logic dies, data/landscape-layouts.json) in the board's units, so no module is smaller than the
   package it carries (they were 75 x 83 mm against a 100 x 72 package). The two NVLink switch chips are silicon slate, so
   they show (they were a pale gray that almost disappeared). Colours (the set's legend): silicon slate only. */
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
  mods.forEach(function (md) { dec.push({ dots: H.gridPts(11, 16, 0.017, 0.0175, top, md[0], md[1]), r: 0.5, alpha: 0.55 }); });
  m.box({ c: [0, 0, 0], s: [BW, BH, BD], decals: { py: dec } }, 'steel');
  m.tag('frames');
  mods.forEach(function (md) { H.frame(m, [md[0], 0, md[1]], MW, MD, MW - 2 * kerb, MD - 2 * kerb, top, top + MH, 'light'); });
  m.tag(null);
  // the two NVLink switch chips, silicon
  m.tag('switch');
  [-0.175, 0.175].forEach(function (x) {
    var SW = 0.24, SD = 0.2, SH = 0.05, d = [D.rect(-SW / 2 + 0.025, -SD / 2 + 0.025, SW / 2 - 0.025, SD / 2 - 0.025, SH / 2, { lw: 0.6 }), D.rect(-SW * 0.21, -SD * 0.22, SW * 0.21, SD * 0.22, SH / 2, { lw: 0.6 })];
    m.box({ c: [x, top + SH / 2, 0], s: [SW, SH, SD], decals: { py: d } }, 'acc');
  });
  m.tag(null);
  // voltage regulators down the long edges, bulk capacitors, power blades and connectors
  for (var i2 = 0; i2 < 13; i2++) { var vx = (i2 - 6) * 0.085; [-1, 1].forEach(function (s) { m.box({ c: [vx, top + 0.013, s * (BD / 2 - 0.05)], s: [0.044, 0.026, 0.044] }, 'mid'); }); }
  [-1, 1].forEach(function (s) { m.box({ c: [-BW / 2 + 0.062, top + 0.029, s * 0.17], s: [0.084, 0.058, 0.20] }, 'dark'); });
  for (i2 = 0; i2 < 4; i2++) { var pins = []; for (var k2 = 0; k2 < 14; k2++) pins.push(D.line([0.026, -0.017, (k2 - 6.5) * 0.0118], [0.026, 0.015, (k2 - 6.5) * 0.0118], { lw: 0.35, alpha: 0.8 })); m.box({ c: [BW / 2 - 0.042, top + 0.025, (i2 - 1.5) * 0.245], s: [0.052, 0.05, 0.185], decals: { px: pins } }, 'mid'); }
  // the modules, lifted out of their frames: each a small board carrying its package (the substrate, its interposer and two
  // logic dies, at this site's B200 estimate)
  // the back row lifts out; the front row stays seated, so the switch chips between the rows stay in view
  var mp = m.part('modules', { ex: [0, 0.26, 0], seq: 1, mode: 'stack' }), mpS = null;
  m.tag('modules');
  mods.forEach(function (md) {
    if (md[1] > 0 && !mpS) { mpS = m.part('seated', { ex: [0, 0, 0], seq: 1, mode: 'stack' }); m.tag('modules'); }
    if (md[1] < 0) m.use(mp); else m.use(mpS);
    var yL = top + MH - 0.016, pk = [];
    pk.push(D.rect(-PKW / 2, -PKD / 2, PKW / 2, PKD / 2, 0.011, { lw: 0.55, fill: 'paper' }));
    pk.push(D.rect(-25 * U, -39 * U, 25 * U, 39 * U, 0.011, { lw: 0.45 }));
    [-1, 1].forEach(function (s) { pk.push(D.rect(-16.25 * U, (s * 13.5 - 13) * U, 16.25 * U, (s * 13.5 + 13) * U, 0.011, { lw: 0.4, fill: 'mid' })); });
    m.box({ c: [md[0], yL - 0.0165, md[1]], s: [LW + 0.024, 0.011, LD + 0.02] }, 'mid');
    m.box({ c: [md[0], yL, md[1]], s: [LW, 0.022, LD], decals: { py: pk } }, 'light');
  });
  m.tag(null);
  m.use(mp);
  [mods[0], mods[6]].forEach(function (md) { [[-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(function (c) { m.guide([[md[0] + c[0] * (LW / 2 + 0.012), top, md[1] + c[1] * (LD / 2 + 0.01), board.idx], [md[0] + c[0] * (LW / 2 + 0.012), top + MH - 0.033, md[1] + c[1] * (LD / 2 + 0.01), mp.idx]], { alpha: 0.75 }); }); });
  m.callout([[mods[4][0] + 0.03, top + MH - 0.005, mods[4][1] + 0.06, mp.idx], [mods[7][0] + 0.03, top + MH - 0.005, mods[7][1] - 0.06, mpS.idx]], 'Accelerator modules', { side: 'r', tag: 'modules' });
  m.callout([mods[6][0] + MW / 2, top + MH * 0.6, mods[6][1] - MD * 0.1, board.idx], 'Module frames', { side: 'r', tag: 'frames' });
  // one leader to each chip, on the part the lifted modules leave in view
  m.callout([0.175 + 0.09, top + 0.05, 0.06, board.idx], 'NVLink switch chips', { side: 'r', tag: 'switch' });
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
  var loupe = LOUPE ? { model: 'hbm-loupe', at: [TX * 2.5, gap0 + pitch * 9 + t / 2, hw * 0.55], part: 'die10', side: 'r', r: 0.155, rMax: 100, scale: 0.86, caption: ['Microbumps about 20\u00a0\u00b5m apart', 'in a 7\u00a0\u00b5m gap'] } : null;
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
  var t = 30, g = 7, Z = 40, x0 = -70, x1 = 70, n = 3, P = 20;
  for (var i = 0; i < n; i++) {
    var y0 = i * (t + g);
    bx(x0, y0, -Z, x1, y0 + t, Z, 'light', { pz: 'cut' });
    if (i < n - 1) for (var bp = x0 + 10; bp < x1 - 5; bp += P) bx(bp - 4.5, y0 + t, -2, bp + 4.5, y0 + t + g, Z, 'acc', { pz: 'cutAcc' });
    [x0 + 30, x0 + 110].forEach(function (vx) { bx(vx - 2.2, y0, -2, vx + 2.2, y0 + t, Z + 0.02, 'acc', { pz: 'cutAcc' }); });
  }
  bar(m, [x0 + 10, -7, Z], [x0 + 30, -7, Z], '20 \u00b5m', { side: -1 });
  bar(m, [x1 + 6, t, Z + 1], [x1 + 6, t + g, Z + 1], '7 \u00b5m', { side: 1 });
  tag(m, [x0 + 52, t + g + t / 2, Z + 10], 'Memory die', {});
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
   lines, as the loupe shows it, silicon layers between molybdenum ones. */
R('photomask', function (m) {
  var B = 152.4, T = 6.35, ml = 1.05, PW = 132, PD = 104, yTop = T / 2;
  var blank = m.part('blank', { ex: [0, 0, 0], seq: 0 });
  var pat = [];
  var top = ml / 2;
  pat.push(D.rect(-71, -71, 71, 71, top, { lw: 0.45, alpha: 0.6 }));
  pat.push(D.rect(-PW / 2 - 5, -PD / 2 - 5, PW / 2 + 5, PD / 2 + 5, top, { lw: 0.7 }));
  pat.push(D.rect(-PW / 2, -PD / 2, PW / 2, PD / 2, top, { lw: 0.7 }));
  // the black border, a filled frame
  pat.push(D.poly([[-PW / 2 - 5, top, -PD / 2 - 5], [PW / 2 + 5, top, -PD / 2 - 5], [PW / 2 + 5, top, PD / 2 + 5], [-PW / 2 - 5, top, PD / 2 + 5]], { fill: 'black', lw: 0, alpha: 0.85 }));
  pat.push(D.poly([[-PW / 2, top, -PD / 2], [PW / 2, top, -PD / 2], [PW / 2, top, PD / 2], [-PW / 2, top, PD / 2]], { fill: 'paper', lw: 0.6 }));
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
  m.box({ c: [0, (T - ml) / 2 - T / 2, 0], s: [B, T - ml, B] }, 'light');
  var band = [];
  for (var q = 1; q < 8; q++) { var yy = -ml / 2 + ml * q / 8; band.push(D.line([-B / 2, yy, B / 2], [B / 2, yy, B / 2], { lw: 0.3, alpha: 0.55 })); }
  var bandX = band.map(function (it) { return { pts: [[B / 2, it.pts[0][1], B / 2], [B / 2, it.pts[0][1], -B / 2]], lw: 0.3, alpha: 0.55 }; });
  m.box({ c: [0, yTop - ml / 2, 0], s: [B, ml, B], decals: { py: pat, pz: band, px: bandX } }, 'acc');
  m.dim([-B / 2, -T / 2, B / 2], [B / 2, -T / 2, B / 2], [0, 0, 12], '152.4 mm');
  // pads, frame, membrane
  var FW = 145, FD = 117, bar = 4.5, fh = 2.6, stand = 2.5;
  var pads = m.part('pads', { ex: [0, 15, 0], seq: 1 });
  [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { m.box({ c: [sx * (FW / 2 - bar / 2), yTop + stand / 2, sz * (FD / 2 - bar / 2)], s: [5.5, stand, 5.5] }, 'dark'); }); });
  var fr = m.part('frame', { ex: [0, 30, 0], seq: 2 });
  H.frame(m, [0, 0, 0], FW, FD, FW - 2 * bar, FD - 2 * bar, yTop + stand, yTop + stand + fh, 'steel');
  m.box({ c: [FW * 0.22, yTop + stand + fh / 2, -(FD / 2 + 1.6)], s: [9, fh * 0.8, 4] }, 'mid');
  var mem = m.part('membrane', { ex: [0, 48, 0], seq: 3 });
  var yM = yTop + stand + fh;
  m.sheet([[-FW / 2 + bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, -FD / 2 + bar], [FW / 2 - bar, yM, FD / 2 - bar], [-FW / 2 + bar, yM, FD / 2 - bar]], 'glass');
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
    m.guide([[c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), blank.idx], [c[0] * (FW / 2 - bar / 2), yTop, c[1] * (FD / 2 - bar / 2), pads.idx]], { alpha: 0.85 });
    m.guide([[c[0] * FW / 2, yTop + stand, c[1] * FD / 2, pads.idx], [c[0] * FW / 2, yTop + stand, c[1] * FD / 2, fr.idx]], { alpha: 0.85 });
    m.guide([[c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), fr.idx], [c[0] * (FW / 2 - bar), yM, c[1] * (FD / 2 - bar), mem.idx]], { alpha: 0.85 });
  });
  m.guide([[0, -T / 2 - 6, 0, blank.idx], [0, yM + 4, 0, mem.idx]], { style: 'axis', alpha: 0.8 });
  m.callout([B / 2, -T / 2 + 1.6, -B * 0.22, blank.idx], 'Glass plate', { side: 'r' });
  m.dim([B / 2, -T / 2, B / 2], [B / 2, T / 2, B / 2], [10, 0, 0], '6.35 mm', { t: 0.5, part: blank.idx });
  m.callout([-B * 0.18, yTop - ml / 2, B / 2, blank.idx], 'Mirror coating', { side: 'l' });
  m.callout([-FW * 0.28, yM, FD * 0.22, mem.idx], 'Pellicle', { side: 'l' });
  var loupe = { model: 'mask-loupe', at: [B / 2, yTop - ml / 2, B * 0.18], part: 'blank', side: 'r', r: 0.15, rMax: 96, scale: 0.8, caption: ['The coating\u2019s edge,', 'at true thickness'] };
  return { elev: PLATE.ISO.elev, yaw: PLATE.ISO.yaw, sortAxis: [0, 1, 0], loupe: loupe, accent: [111, 139, 166], accentDark: [195, 211, 226] };
});

/* The loupe's plate, in nanometres, seen almost face on so its cut face reads as a section: the glass, about forty pairs of
   layers (each pair 7 nm, drawn as a silicon layer and a molybdenum layer of half a pair each; the paper gives the pair, not
   the split), the 3 nm ruthenium cap, and two lines of absorber 60 nm tall (58 nm TaBN and 2 nm TaBO), all from the imec and
   PTB paper chapter 5 cites. Only the absorber's height and the pair count carry figures. */
R('mask-loupe', function (m) {
  var bar = PLATE.loupeBar, tag = PLATE.loupeTag;
  function bx(x0, y0, x1, y1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, 0], s: [x1 - x0, y1 - y0, 60], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  var X0 = -120, X1 = 120, NP = 40, PR = 7, g0 = -40;
  bx(X0, g0 - 45, X1, g0, 'light', { pz: 'cut' });
  for (var i = 0; i < NP; i++) { var y = g0 + i * PR; bx(X0, y, X1, y + PR / 2, 'acc'); bx(X0, y + PR / 2, X1, y + PR, 'dark'); }
  var yc = g0 + NP * PR;
  bx(X0, yc, X1, yc + 3, 'mid');
  [[-100, -30], [15, 85]].forEach(function (a) { bx(a[0], yc + 3, a[1], yc + 3 + 60, 'dark', { pz: 'cutDense' }); });
  bar(m, [96, yc + 3, 30], [96, yc + 63, 30], '58 nm', { side: 1 });
  tag(m, [-65, yc + 78, 30], 'Absorber', {});
  tag(m, [0, g0 + NP * PR / 2, 30], 'About 40 layer pairs', {});
  tag(m, [0, g0 - 24, 30], 'Glass', {});
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
   four dies under the needles in a deeper slate. */
R('probe-card', function (m) {
  var Rw = 1.0, Rc = 1.02, Rch = 1.08, tW = 0.028, wT = tW / 2, dw = 26 / 150, dh = 33 / 150;
  var yLo = wT + 0.082, tG = 0.02, yLoT = yLo + tG, yUp = yLoT + 0.082, yUpT = yUp + tG, stH = 0.10, yST = yUpT + 0.052, stW = 0.5, tP = 0.052, pB = yST + stH + 0.03, pT = pB + tP;
  var ch = m.part('chuck', { ex: [0, -0.10, 0], seq: 0 });
  m.cyl([0, -wT - 0.065, 0], Rch, 0.13, 'turned', { seg: 64, top: [0.42, 0.68, 0.94, 1.06].map(function (r) { return D.circle(0, 0, r, 0.065, 64, { lw: 0.4, alpha: 0.6 }); }) });
  var wf = m.part('wafer', { ex: [0, 0, 0], seq: 1 });
  var shape = []; for (var k = 0; k < 96; k++) { var a = k * TAU / 96; if (k === 24) { shape.push([0.05, 0.998]); shape.push([0, 0.96]); shape.push([-0.05, 0.998]); continue; } shape.push([Rw * Math.cos(a), Rw * Math.sin(a)]); }
  var dies = [], probed = [];
  for (var gx = -6; gx <= 5; gx++) for (var gz = -5; gz <= 4; gz++) {
    var cx = (gx + 0.5) * dw, cz = (gz + 0.5) * dh, cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < 0.96; })) continue;
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) { probed.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { fill: 'acc', lw: 0.6, col: 'acc', keep: true, tag: 'dies' })); continue; }
    dies.push(D.rect(cx - dw / 2, cz - dh / 2, cx + dw / 2, cz + dh / 2, wT, { lw: 0.4, alpha: 0.7 }));
  }
  m.prism(shape, -wT, wT, 'accLight', { smooth: true, top: dies.concat(probed) });
  // the probe head: two guide plates and the needles bowed between them
  var hd = m.part('head', { ex: [0, 0.34, 0], seq: 2 });
  [yLo, yUp].forEach(function (y) { m.box({ c: [0, y + tG / 2, 0], s: [0.4, tG, 0.4] }, 'mid'); });
  // the needles: on each die, a row along each long edge, where the pads are, a few standing for thousands; each needle the same length, bowed the same
  // way between the guide plates, as a vertical probe's needle is
  m.tag('needles');
  for (gx = -1; gx <= 0; gx++) for (gz = -1; gz <= 0; gz++) {
    var ox = (gx + 0.5) * dw, oz = (gz + 0.5) * dh;
    [-1, 1].forEach(function (sx) { [0.38].forEach(function (fx) {
      for (var b1 = 0; b1 < 9; b1++) {
        var qx = ox + sx * dw * fx, qz = oz + (b1 - 4) * (dh * 0.8 / 8), bo = 0.012;
        m.wire([[qx, wT + 0.004, qz], [qx, yLo + tG * 0.4, qz], [qx + bo, (yLoT + yUp) / 2, qz], [qx, yUp + tG * 0.6, qz], [qx, yUpT + 0.004, qz]], { lw: 0.6, alpha: 0.85 });
      }
    }); });
  }
  m.tag(null);
  // the space transformer: multi-layer ceramic
  var st = m.part('transformer', { ex: [0, 0.66, 0], seq: 3 });
  var lines = []; for (k = 1; k < 7; k++) lines.push(-stH / 2 + stH * k / 7);
  var side = function (face) { return lines.map(function (y) { var p = face === 'pz' ? [[-stW / 2, y, stW / 2], [stW / 2, y, stW / 2]] : face === 'px' ? [[stW / 2, y, -stW / 2], [stW / 2, y, stW / 2]] : face === 'nx' ? [[-stW / 2, y, -stW / 2], [-stW / 2, y, stW / 2]] : [[-stW / 2, y, -stW / 2], [stW / 2, y, -stW / 2]]; return { pts: p, lw: 0.4, alpha: 0.8 }; }); };
  m.box({ c: [0, yST + stH / 2, 0], s: [stW, stH, stW], decals: { pz: side('pz'), px: side('px'), nx: side('nx'), nz: side('nz'), py: [{ dots: H.gridPts(13, 13, stW * 0.07, stW * 0.07, stH / 2, 0, 0), r: 0.9, alpha: 0.75 }] } }, 'light');
  // the printed circuit board and the stiffener over it
  var pc = m.part('card', { ex: [0, 1.12, 0], seq: 4, mode: 'stack' });
  var pads = [];
  [[0.56, 72], [0.66, 84], [0.76, 96]].forEach(function (r) { var d = []; for (var i = 0; i < r[1]; i++) { var aa = i * TAU / r[1]; d.push([r[0] * Math.cos(aa), tP / 2, r[0] * Math.sin(aa)]); } pads.push({ dots: d, r: 1.1, ring: true, alpha: 0.85 }); });
  m.cyl([0, pB + tP / 2, 0], Rc, tP, 'turned', { seg: 72, top: pads });
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
  m.callout([-dw * 0.4 + 0.012, (yLoT + yUp) / 2, 0.5 * dh, hd.idx], 'Needles', { side: 'l', tag: 'needles' });
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
  var vs = m.revolve([[0.058, yTop], [rI, yTop], [rI, yBot], [0.105, yBot], [0.105, yFlo], [rO, yFlo], [rO, yLid], [0.058, yLid]], 'turned', o({}));
  // the slit valve the wafer travels through, in the far wall, and a viewport
  var svA = tv + Math.PI, sv = [];
  for (var k = 0; k <= 16; k++) { var aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 + 0.03, rI * 0.995 * Math.sin(aa)]); }
  for (k = 16; k >= 0; k--) { aa = svA - 0.42 + 0.84 * k / 16; sv.push([rI * 0.995 * Math.cos(aa), -0.02 - 0.03, rI * 0.995 * Math.sin(aa)]); }
  m.decal(vs, [-Math.cos(svA), 0, -Math.sin(svA)], [{ pts: sv, closed: true, fill: 'mid', lw: 0.8 }]);
  // chuck: aluminium base, ceramic puck, focus ring and stem
  var chk = m.part('chuck', { pri: 1, mode: 'fixed' });
  var yPed = -0.025, pedH = 0.088;
  m.revolve([[0.058, yFlo], [0.072, yFlo], [0.072, yPed - pedH], [0.058, yPed - pedH]], 'turned', o({}));
  m.revolve([[0, yPed - pedH], [0.17, yPed - pedH], [0.17, yPed - 0.014], [0, yPed - 0.014]], 'turned', o({}));
  m.revolve([[0, yPed - 0.014], [0.17, yPed - 0.014], [0.17, yPed], [0, yPed]], 'turnedDark', o({ cut: 'cutDense' }));
  m.revolve([[0.154, yPed], [0.185, yPed], [0.185, yPed + 0.010], [0.154, yPed + 0.010]], 'turnedDark', o({ cut: 'cutDense' }));
  // the wafer, at its true thickness
  var wfp = m.part('wafer', { pri: 2 });
  var WT = 0.000775;
  m.revolve([[0, yPed], [0.15, yPed], [0.15, yPed + WT], [0, yPed + WT]], 'acc2Light', o({ cut: 'cutAcc2' }));
  // the plasma: a lens of clear violet between the wafer and the showerhead, and two fine lines just over the wafer, the sheath
  var plp = m.part('plasma', { pri: 3 });
  var gTop = 0.058, gBot = yPed + 0.006, gR = 0.168, PL = { d: 0.16, c: 'acc', alpha: 0.6 };
  m.revolve([[0, gBot], [gR * 0.9, gBot], [gR, gBot + 0.008, 0], [gR * 1.02, (gBot + gTop) / 2, 0], [gR, gTop - 0.008, 0], [gR * 0.9, gTop], [0, gTop]], PL, o({ cut: { d: 0.22, c: 'acc' }, seg: 56 }));
  [0.0035, 0.0065].forEach(function (dy) { var sh = []; for (var k2 = 0; k2 <= 24; k2++) { var an = a0 + (a1 - a0) * k2 / 24; sh.push([0.15 * Math.cos(an), yPed + WT + dy, 0.15 * Math.sin(an)]); } m.wire(sh, { col: 'acc', lw: 0.6, alpha: 0.85, c: [0, yPed + 0.01, 0] }); });
  // showerhead: face plate, plenum wall, backing plate, with its gas holes cut through the face plate
  m.part('shower', { pri: 4 });
  var holes = [];
  for (var rr = 0.012; rr < 0.2; rr += 0.0132) holes.push({ pts: [[rr, 0.0625], [rr, 0.0915]].map(function (q) { return [q[0], q[1], 0]; }), col: 'bg', lw: 1.1 });
  var hcut = function (arr) { return arr.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1]]; }), col: it.col, lw: it.lw }; }); };
  m.revolve([[0, 0.062], [0.205, 0.062], [0.205, 0.142], [0, 0.142], [0, 0.128], [0.193, 0.128], [0.193, 0.092], [0, 0.092]], 'turned', o({ cut0: hcut(holes), cut1: hcut(holes) }));
  // the lid feed: gas in, RF on, lifted off
  var lid = m.part('lid', { pri: 5, ex: [0, 0.10, 0], seq: 1 });
  m.revolve([[0.03, yLid], [0.058, yLid], [0.058, yLid + 0.078], [0.03, yLid + 0.078]], 'turned', o({}));
  m.revolve([[0.03, yLid + 0.078], [0.086, yLid + 0.078], [0.086, yLid + 0.10], [0.03, yLid + 0.10]], 'turnedDark', o({}));
  m.revolve([[0, yLid + 0.10], [0.026, yLid + 0.10], [0.026, yLid + 0.152], [0, yLid + 0.152]], 'turned', o({}));
  m.guide([[0, yLid, 0, ves.idx], [0, yLid + 0.17, 0, lid.idx]], { style: 'axis', alpha: 0.85 });
  // the turbopump, dropped away below
  var pump = m.part('pump', { pri: -2, ex: [0, -0.14, 0], seq: 3 });
  var bl = [];
  for (k = 0; k < 30; k++) { var ba = k * TAU / 30; bl.push(D.line([0.046 * Math.cos(ba), 0.074, 0.046 * Math.sin(ba)], [0.128 * Math.cos(ba + 0.3), 0.074, 0.128 * Math.sin(ba + 0.3)], { lw: 0.4, alpha: 0.75 })); }
  m.revolve([[0, -0.074], [0.146, -0.074], [0.146, 0.074], [0.13, 0.074], [0.13, 0.068], [0, 0.068]], 'turned', { seg: 40, pos: [0, yFlo - 0.2, 0], top: bl.map(function (it) { return { pts: it.pts.map(function (q) { return [q[0], q[1] - 0.006, q[2]]; }), lw: 0.4, alpha: 0.7 }; }) });
  m.cyl([0.228, yFlo - 0.23, 0], 0.03, 0.165, 'turned', { seg: 18, rot: [0, 0, Math.PI / 2] });
  m.guide([[0, yFlo, 0, ves.idx], [0, yFlo - 0.36, 0, pump.idx]], { style: 'axis', alpha: 0.85 });
  var cu = [Math.cos(a0), Math.sin(a0)], cw = [Math.cos(a1), Math.sin(a1)];
  m.callout([0.03 * cw[0], yLid + 0.13, 0.03 * cw[1], lid.idx], 'Gas in', { side: 'r' });
  m.callout([0.15 * cu[0], 0.035, 0.15 * cu[1], plp.idx], 'Plasma', { side: 'l' });
  m.callout([0.148 * cw[0], yPed + WT, 0.148 * cw[1], wfp.idx], 'Wafer', { side: 'r' });
  m.callout([0.168 * cu[0], yPed - 0.05, 0.168 * cu[1], chk.idx], 'Chuck', { side: 'l' });
  m.callout([0.146 * cw[0], yFlo - 0.2, 0.146 * cw[1], pump.idx], 'Pump', { side: 'r' });
  var loupe = { model: 'etch-loupe', at: [0.06 * cw[0], yPed + WT, 0.06 * cw[1]], part: 'wafer', side: 'l', r: 0.15, rMax: 92, scale: 0.78, caption: ['A hole ten times', 'deeper than it is wide'] };
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, loupe: loupe, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
});

/* The loupe's plate: a cut through the wafer's surface with one hole etched into it, ten times deeper than it is wide, the
   ratio in the US rule of December 2024 that chapter 6 cites. The hole's real size depends on the chip, so it carries no
   figure; the ratio is the point. A mask of photoresist lies on top, opened over the hole. */
R('etch-loupe', function (m) {
  var tag = PLATE.loupeTag;
  function bx(x0, y0, x1, y1, mat, fmat) { return m.box({ c: [(x0 + x1) / 2, (y0 + y1) / 2, 0], s: [x1 - x0, y1 - y0, 8], fmat: fmat }, mat); }
  m.part('st', { mode: 'stack' });
  var W = 1, Dp = 10, X0 = -5.5, X1 = 5.5, Y0 = -Dp - 1.6;
  // the silicon, cut through the hole's middle: left and right of the hole, and the floor beneath it
  bx(X0, Y0, -W / 2, 0, 'acc2Light', { pz: 'cutAcc2' });
  bx(W / 2, Y0, X1, 0, 'acc2Light', { pz: 'cutAcc2' });
  bx(-W / 2, Y0, W / 2, -Dp, 'acc2Light', { pz: 'cutAcc2' });
  // the resist mask, opened over the hole
  bx(X0, 0, -W / 2, 0.6, 'mid', { pz: 'cutDense' });
  bx(W / 2, 0, X1, 0.6, 'mid', { pz: 'cutDense' });
  tag(m, [-3.1, -5, 4.2], 'Silicon', {});
  tag(m, [3.0, 1.35, 4.2], 'Resist', {});
  return { elev: 0.05, yaw: -0.04, accent: [109, 92, 201], accentDark: [176, 164, 240], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
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
   busbar in copper, the power shelves in the set's one steel colour. */
R('rack', function (m) {
  var W = 0.60, Dp = 1.068, Ht = 2.236, U = 0.0445, post = 0.042, front = Dp / 2, back = -Dp / 2;
  var cab = m.part('cabinet', { ex: [0, 0, 0], seq: 0 });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { m.box({ c: [q[0] * (W / 2 - post / 2), Ht / 2, q[1] * (Dp / 2 - post / 2)], s: [post, Ht, post] }, 'mid'); });
  m.box({ c: [0, 0.045, 0], s: [W, 0.09, Dp] }, 'mid');
  m.box({ c: [0, Ht - 0.031, 0], s: [W, 0.062, Dp] }, 'steel');
  [-1, 1].forEach(function (s) { m.box({ c: [s * (W / 2 - 0.004), 0.09 + (Ht - 0.22) / 2, 0], s: [0.008, Ht - 0.22, Dp - 0.10] }, 'ghost'); });
  // the trays, floor up: [kind, count, gap above]
  var y = 0.114, slots = [];
  [['cdu', 4, 0.040], ['power', 4, 0.030], ['compute', 8, 0.020], ['switch', 9, 0.020], ['compute', 10, 0.030], ['power', 4, 0.026], ['mgmt', 1, 0]].forEach(function (s) { for (var i = 0; i < s[1]; i++) { slots.push({ k: s[0], y: y + U / 2 }); y += U; } y += s[2]; });
  var stackTop = y, tW = 0.522, tH = U * 0.9, fz = front - 0.012, tz0 = back + 0.10, tD = fz - tz0, tzc = (fz + tz0) / 2;
  var pullIdx = { 6: 1, 20: 2, 30: 3 }; // a power shelf, a switch tray, a compute tray
  function tray(sl, part) {
    var k = sl.k, d = [], f = tD / 2 + 0.0005;
    if (k === 'compute') { [-1, 1].forEach(function (s) { d.push(D.rectXY(s * 0.132 - 0.1025, -tH * 0.34, s * 0.132 + 0.1025, tH * 0.34, f, { lw: 0.45 })); }); }
    else if (k === 'switch') { d.push(D.rectXY(-tW * 0.4, -tH * 0.26, tW * 0.4, tH * 0.26, f, { lw: 0.45, fill: 'dark' })); }
    else if (k === 'power') { for (var q = 0; q < 6; q++) { var qx = (q - 2.5) * ((tW - 0.02) / 6); d.push(D.rectXY(qx - (tW - 0.05) / 12, -tH * 0.37, qx + (tW - 0.05) / 12, tH * 0.37, f, { lw: 0.45, col: 'acc2' })); } }
    var mat = k === 'power' ? 'acc2Dark' : k === 'switch' ? 'mid' : k === 'cdu' ? 'steel' : 'light';
    m.box({ c: [0, sl.y, tzc], s: [tW, tH, tD], decals: { pz: d } }, mat);
  }
  slots.forEach(function (sl, i) { if (pullIdx[i] || sl.k === 'cdu') return; tray(sl); });
  var cduY = (slots[0].y + slots[3].y) / 2;
  m.box({ c: [0, cduY, tzc], s: [tW, 4 * U * 0.94, tD], decals: { pz: [-1, 1].map(function (s) { return D.circle(0, 0, 0.046, 0, 24, { lw: 0.6 }); }).map(function (it, j) { return { pts: it.pts.map(function (p) { return [p[0] + (j ? 0.155 : -0.155), p[2], tD / 2 + 0.0005]; }), closed: true, lw: 0.6 }; }) } }, 'steel');
  // the rear: the NVLink cable cartridge either side of the busbar's place, and the coolant manifold
  var sy0 = 0.164, sy1 = stackTop - 0.02, sh = sy1 - sy0, syc = (sy0 + sy1) / 2, zS = back + 0.085;
  [-1, 1].forEach(function (s) {
    var ln = []; for (var i = 0; i < 18; i++) { var lx = (i - 8.5) * 0.0112; ln.push(D.line([lx, -sh / 2, -0.011], [lx, sh / 2, -0.011], { lw: 0.35, alpha: 0.7 })); }
    m.box({ c: [s * 0.172, syc, zS], s: [0.212, sh, 0.02], decals: { nz: ln } }, 'mid');
  });
  [back + 0.30, back + 0.40].forEach(function (pz) { var prof = [[0, sy0 - 0.13], [0.03, sy0 - 0.13]]; for (var q = 0; q <= 10; q++) prof.push([0.03, sy0 - 0.10 + q * (sh + 0.24) / 10, 2]); prof.push([0.03, sy1 + 0.17]); prof.push([0, sy1 + 0.17]); m.revolve(prof, 'turned', { seg: 12, pos: [W / 2 - 0.058, 0, pz] }); });
  // pulled trays
  var pulled = [];
  Object.keys(pullIdx).forEach(function (i) {
    var p = m.part('pull' + i, { ex: [0, 0, 0.78], seq: pullIdx[i] }); tray(slots[i], p); pulled.push([+i, p]);
    [-1, 1].forEach(function (s) { m.guide([[s * tW / 2, slots[i].y - tH / 2, tz0, cab.idx], [s * tW / 2, slots[i].y - tH / 2, tz0, p.idx]], { alpha: 0.7 }); });
  });
  // the busbar, copper, with a clip at every tray, pulled back out of the rear
  var bb = m.part('busbar', { ex: [0, 0, -2.25], seq: 4 });
  m.box({ c: [0, syc, zS + 0.02], s: [0.052, sh + 0.10, 0.03] }, 'acc');
  m.dim([W / 2, 0, back], [W / 2, Ht, back], [0.1, 0, 0], '2,236 mm', { part: cab.idx, t: 0.62 });
  // designer pass (21 Nov 2026): the width taken further out in front, so its figure clears the rack's foot
  m.dim([-W / 2, 0, front], [W / 2, 0, front], [0, 0, 0.2], '600 mm', { part: cab.idx });
  var pp = {}; pulled.forEach(function (q) { pp[q[0]] = q[1]; });
  m.callout([-tW * 0.3, slots[6].y, fz, pp[6].idx], 'Power shelf', { side: 'l' });
  m.callout([-tW * 0.3, slots[20].y, fz, pp[20].idx], 'NVLink switch tray', { side: 'l' });
  m.callout([-tW * 0.3, slots[30].y, fz, pp[30].idx], 'Compute tray', { side: 'l' });
  m.callout([0.026, syc + 0.35, zS + 0.02, bb.idx], 'Copper busbar', { side: 'r' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, accent: [176, 102, 44], accentDark: [224, 154, 92], accent2: [117, 132, 144], accent2Dark: [198, 206, 213] };
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
   copper before, are ink, since a plate has two accents and the wafer's colour is the one kept the same everywhere. */
R('sem-column', function (m) {
  var yaw = PLATE.DIM.yaw, h = farHalf(yaw), a0 = h[0], a1 = h[1], tv = h[2];
  var O = { a0: a0, a1: a1, cut: 'cut', seg: 48 };
  function o(extra) { var r = {}; for (var k in O) r[k] = O[k]; for (k in extra) r[k] = extra[k]; return r; }
  function lens(y0, y1, rOut, rB) {
    var hh = y1 - y0, mid = (y0 + y1) / 2, c0 = rB + (rOut - rB) * 0.30, c1 = rOut - (rOut - rB) * 0.14, w0 = y0 + hh * 0.16, w1 = y1 - hh * 0.16, g = 0.028;
    m.revolve([[rB, y0], [rOut, y0], [rOut, y1], [rB, y1], [rB, mid + g], [c0, w1], [c1, w1], [c1, w0], [c0, w0], [rB, mid - g]], 'turned', o({}));
    m.revolve([[c0 + 0.008, w0 + 0.008], [c1 - 0.008, w0 + 0.008], [c1 - 0.008, w1 - 0.008], [c0 + 0.008, w1 - 0.008]], 'dark', o({ cut: 'cutDense' }));
  }
  function tube(y0, y1, r0, r1) { m.revolve([[r0, y0], [r1, y0], [r1, y1], [r0, y1]], 'turned', o({})); }
  function plate(y, r, hole) { m.revolve([[hole, y - 0.004], [r, y - 0.004], [r, y + 0.004], [hole, y + 0.004]], 'turnedDark', o({ cut: 'cutDense' })); }
  var u = [Math.cos(a0), Math.sin(a0)];
  var parts = {}, beam = [];
  // gun and its insulator
  parts.gun = m.part('gun', { ex: [0, 0.34, 0], seq: 5 });
  m.revolve([[0.085, 1.10], [0.20, 1.10], [0.20, 1.36], [0.10, 1.47], [0.085, 1.47]], 'turned', o({}));
  [0, 1, 2].forEach(function (q) { var iy = 1.47 + q * 0.082, ir = 0.100 - q * 0.017; m.revolve([[0.03, iy], [ir, iy], [ir, iy + 0.07, 2], [0.03, iy + 0.07]], 'turnedDark', o({ cut: 'cutDense' })); });
  tube(1.72, 1.85, 0.02, 0.04);
  m.revolve([[0, 1.244], [0.003, 1.244], [0.026, 1.292], [0, 1.292]], 'acc', o({ cut: 'cutAcc' }));
  plate(1.205, 0.075, 0.010); plate(1.12, 0.085, 0.012);
  var ipA = tv + Math.PI;
  m.cyl([0.30 * Math.cos(ipA), 1.245, 0.30 * Math.sin(ipA)], 0.072, 0.20, 'turned', { seg: 24, rot: [0, -ipA, Math.PI / 2] });
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
  m.revolve([[0.10, -0.03], [0.142, -0.03], [0.142, 0.07], [0.10, 0.07]], 'turnedDark', o({}));
  m.revolve([[0.094, -0.26], [0.20, -0.26], [0.20, -0.10], [0.094, -0.10]], 'turned', o({}));
  m.revolve([[0.118, -0.238], [0.184, -0.238], [0.184, -0.122], [0.118, -0.122]], 'dark', o({ cut: 'cutDense' }));
  // the objective lens and its conical pole piece
  parts.ob = m.part('objective', { ex: [0, -0.12, 0], seq: 1 });
  lens(-0.56, -0.30, 0.44, 0.115);
  m.revolve([[0.105, -0.815], [0.145, -0.815], [0.145, -0.76], [0.44, -0.56], [0.105, -0.56]], 'turned', o({}));
  // the ring detector
  parts.det = m.part('detector', { ex: [0, -0.2, 0], seq: 1 });
  m.tag('detector');
  m.revolve([[0.052, -0.859], [0.175, -0.859], [0.175, -0.851], [0.052, -0.851]], 'turnedDark', o({ cut: 'cutDense' }));
  m.tag(null);
  // wafer and stage
  parts.st = m.part('stage', { ex: [0, -0.32, 0], seq: 0, pri: -1, mode: 'stack' });
  var yW = -0.98, wr = 0.40, wt = wr * 0.775 / 150, dies = [];  // the wafer 300 mm across and 775 micrometres thick (SEMI M1)
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) { var cx = gx * 0.092, cz = gz * 0.076; if (cx * cx + cz * cz > (wr - 0.055) * (wr - 0.055)) continue; dies.push(D.rect(cx - 0.044, cz - 0.036, cx + 0.044, cz + 0.036, wt / 2, { lw: 0.35, alpha: 0.6 })); }
  dies.push({ dots: [[0, wt / 2, 0]], r: 2.4, col: 'acc', alpha: 1 });
  m.box({ c: [0, yW - 0.21, 0], s: [1.42, 0.09, 1.10] }, 'steel');
  [-1, 1].forEach(function (i) { m.box({ c: [0, yW - 0.147, i * 0.33], s: [1.30, 0.034, 0.056] }, 'dark'); });
  m.box({ c: [0, yW - 0.088, 0], s: [0.98, 0.07, 0.86] }, 'light');
  m.cyl([0, yW - 0.027, 0], 0.428, 0.05, 'turned', { seg: 48 });
  m.tag('wafer');
  m.cyl([0, yW - 0.003 + wt / 2, 0], wr, wt, 'acc2Light', { seg: 56, top: dies });
  m.tag(null);
  m.box({ c: [-wr - 0.048, yW - 0.02, 0], s: [0.02, 0.055, 0.80] }, 'dark');
  m.box({ c: [0, yW - 0.02, -wr - 0.048], s: [0.80, 0.055, 0.02] }, 'dark');
  var du = [Math.cos(yaw), Math.sin(yaw)]; // the direction that runs straight across the page at the resting turn
  // review: the size goes on the wafer's label in the caption's words ('a 300 mm wafer'). The dimension line had no room:
  // the gap between the column's tip and the wafer's far rim is about 15 px, so line and figure sat on both
  // the beam: emitter to wafer, and its envelope on the cut plane, each point riding with the part it passes through
  var ENV = [[1.268, 0.008], [1.20, 0.028], [1.11, 0.038], [0.72, 0.060], [0.60, 0.070], [0.50, 0.032], [0.436, 0.004], [0.36, 0.024], [0.24, 0.060], [0.12, 0.034], [0.02, 0.028], [-0.18, 0.038], [-0.43, 0.096], [-0.60, 0.072], [-0.815, 0.036], [yW, 0.002]];
  var who = function (y) { return y > 1.1 ? parts.gun.idx : y > 0.48 ? parts.c1.idx : y > 0.12 ? parts.c2.idx : y > -0.3 ? parts.sc.idx : y > -0.84 ? parts.ob.idx : parts.st.idx; };
  [-1, 1].forEach(function (s) { m.guide(ENV.map(function (q) { return [s * q[1] * u[0], q[0], s * q[1] * u[1], who(q[0])]; }), { style: 'beam', col: 'acc', lw: 0.8, alpha: 0.75 }); });
  m.guide([[0, 1.268, 0, parts.gun.idx], [0, 1.10, 0, parts.gun.idx], [0, 1.10, 0, parts.c1.idx], [0, 0.48, 0, parts.c1.idx], [0, 0.48, 0, parts.c2.idx], [0, 0.12, 0, parts.c2.idx], [0, 0.12, 0, parts.sc.idx], [0, -0.30, 0, parts.sc.idx], [0, -0.30, 0, parts.ob.idx], [0, -0.815, 0, parts.ob.idx], [0, -0.815, 0, parts.det.idx], [0, -0.86, 0, parts.det.idx], [0, -0.86, 0, parts.st.idx], [0, yW, 0, parts.st.idx]], { style: 'beam', col: 'acc', lw: 1.3 });
  var w2 = [Math.cos(a1), Math.sin(a1)];
  m.callout([0, 1.27, 0, parts.gun.idx], 'Emitter', { side: 'r' });
  m.callout([[0.27 * u[0], 0.60, 0.27 * u[1], parts.c1.idx], [0.3 * u[0], -0.43, 0.3 * u[1], parts.ob.idx]], 'Lenses', { side: 'l' });
  m.callout([0, 0.03, 0, parts.sc.idx], 'Electron beam', { side: 'r' });
  m.callout([-0.3 * du[0], yW + 0.004, -0.3 * du[1], parts.st.idx], 'Wafer', { side: 'l', tag: 'wafer' });
  m.callout([0.15 * u[0], -0.855, 0.15 * u[1], parts.det.idx], 'Detector', { side: 'l', tag: 'detector' });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, sortAxis: [0, 1, 0], accent: [107, 127, 209], accentDark: [167, 180, 245], accent2: [111, 139, 166], accent2Dark: [195, 211, 226] };
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
    // copper on every conductor plane, as traces in section
    [1, -1].forEach(function (sg) {
      for (k = 0; k <= nb; k++) {
        var y = sg * lay[k]; u = 0.4;
        while (u < L - 0.4) { var w = 0.4 + rnd() * (k === 0 ? 5 : 2.8); if (u + w > L - 0.4) break; it.push({ pts: [toP(u, y), toP(u + w, y)], col: 'acc2', lw: 1.3, tag: 'cu' }); u += w + 0.4 + rnd() * 2; }
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
  m.part('plinth', { ex: [0, 0, 0], seq: 0 });
  var gl = []; var GE = PW / 2 - 0.03;
  for (var gi = 1; gi < 10; gi++) { var gp = -GE + gi * 2 * GE / 10; gl.push(D.line([gp, PH / 2, -GE], [gp, PH / 2, GE], { lw: 0.3, alpha: 0.5 })); gl.push(D.line([-GE, PH / 2, gp], [GE, PH / 2, gp], { lw: 0.3, alpha: 0.5 })); }
  gl.push(D.rect(-(CW + 0.1) / 2, -(CW + 0.1) / 2, (CW + 0.1) / 2, (CW + 0.1) / 2, PH / 2, { lw: 0.6 }));
  m.box({ c: [0, PH / 2, 0], s: [PW, PH, PW], decals: { py: gl } }, 'light');
  var y = PH, rx = -(CW / 2 + 0.155), rz = -(CW / 2 + 0.155);
  BOM.forEach(function (b, i) {
    var h = b[1] * S, y0 = y, yc = y + h / 2;
    m.part('layer' + i, { ex: [0, 0.4 + 0.22 * i, 0], seq: i + 1 });
    var faces = function (fn) { return { pz: fn('pz'), px: fn('px'), nz: fn('nz'), nx: fn('nx') }; };
    var at = function (f, u, yy) { return f === 'pz' ? [u, yy, CW / 2] : f === 'px' ? [CW / 2, yy, -u] : f === 'nz' ? [-u, yy, -CW / 2] : [-CW / 2, yy, u]; };
    var dec = null;
    if (i === 0) dec = faces(function (f) { var a = []; for (var k = 1; k <= 12; k++) { var yy = -h / 2 + h * 0.18 + (k / 12) * h * 0.8; a.push({ pts: [at(f, -CW / 2, yy), at(f, CW / 2, yy)], lw: 0.4, col: 'acc', alpha: 0.9 }); } for (var t = 0; t < 4; t++) { var tx = (t - 1.5) * CW * 0.22; a.push({ pts: [at(f, tx, -h / 2 + h * 0.18), at(f, tx, h / 2)], lw: 0.5, col: 'acc', alpha: 0.8 }); } return a; });
    else if (i === 1) dec = faces(function (f) { var d = []; for (var a = 0; a < 15; a++) for (var c = 0; c < 4; c++) d.push(at(f, (a - 7) * CW * 0.062, (c - 1.5) * h * 0.2)); return [{ dots: d, r: 0.8, alpha: 0.8 }]; });
    else if (i === 3) dec = faces(function (f) { var a = [{ pts: [at(f, -CW / 2, 0), at(f, CW / 2, 0)], lw: 0.5 }]; for (var v = 0; v < 11; v++) a.push({ pts: [at(f, (v - 5) * CW * 0.084, -h * 0.4), at(f, (v - 5) * CW * 0.084, h * 0.4)], lw: 0.35, alpha: 0.75 }); return a; });
    else if (i === 4) dec = faces(function (f) { var d = []; for (var a = 0; a < 9; a++) for (var c = 0; c < 2; c++) d.push(at(f, (a - 4) * CW * 0.1, (c - 0.5) * h * 0.34)); return [{ dots: d, r: 1.1, alpha: 0.8 }]; });
    if (b[2] === 'ghost') {
      m.box({ c: [0, yc, 0], s: [CW, h, CW] }, 'ghost');
      ['pz', 'px', 'nz', 'nx'].forEach(function (f) { m.wire([at(f, -CW / 2, -h / 2), at(f, CW / 2, h / 2)].map(function (p) { return [p[0], p[1] + yc, p[2]]; }), { lw: 0.6, alpha: 0.7, c: [0, yc, 0] }); m.wire([at(f, CW / 2, -h / 2), at(f, -CW / 2, h / 2)].map(function (p) { return [p[0], p[1] + yc, p[2]]; }), { lw: 0.6, alpha: 0.7, c: [0, yc, 0] }); });
    } else m.box({ c: [0, yc, 0], s: [CW, h, CW], decals: dec }, b[2]);
    m.callout([CW / 2, yc, CW * 0.2], b[0], { side: 'r', col: i === 0 ? 'acc' : null, strong: i === 0 });
    y += h;
  });
  var TOP = y;
  // 22 Nov 2026 review: its offset runs along one model axis (x) only; it ran on two.
  // review: the total is a dimension up the whole column at its front-left corner. It was a label on the top face, which
  // read as a sixth layer worth $6,400, beside an unfigured rule ticked every $500
  m.dim([-CW / 2, PH, CW / 2], [-CW / 2, TOP, CW / 2], [-0.17, 0, 0], 'about $6,400', { part: 0 });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, start: 1, rest: 0, sortAxis: [0, 1, 0], accent: [122, 31, 43], accentDark: [201, 83, 106] };
});

})(window.PLATE);}catch(e){console.warn('plate wafer-cost.js failed to load', e);}
