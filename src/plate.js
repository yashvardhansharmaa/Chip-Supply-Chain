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
      else if (it.pts && (it.kind === 'wire' || it.kind === 'dots')) { var st = Math.max(1, Math.floor(it.pts.length / 40)); for (var i = 0; i < it.pts.length; i += st) m.EX.push([it.pts[i][0], it.pts[i][1], it.pts[i][2], it.part]); }
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
  PL.mode = function (md) { md = md || {}; this.o.numbersOnly = !!md.numbersOnly; this.o.noDims = !!md.noDims; this.o.noLabels = !!md.noLabels; return (md.numbersOnly ? 'n' : '') + (md.noDims ? 'd' : '') + (md.noLabels ? 'l' : ''); };
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
