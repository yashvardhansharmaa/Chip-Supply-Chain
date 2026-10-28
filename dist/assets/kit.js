/* CHOKEPOINTS point-cloud kit (PC)
 * Dependency-free. Runs in Node (module.exports) and in the browser (window.PC).
 * A "cloud" is a Float32Array with stride 4: x, y, z, w.
 *   w in [0,1]  -> ink point with alpha w
 *   w in [2,3]  -> accent-colour point with alpha (w - 2); w = 3 is a full accent point
 *   w in (3,4]  -> second-accent point with alpha (w - 3), see PC.accent2
 * A specimen may declare the colour its accent points take, as sRGB 0..255:
 *   accent: [r, g, b]        the highlighted element's own colour on the light ground
 *   accent2: [r, g, b]       the colour of the (3,4] channel; defaults to accent
 *   accentDark, accent2Dark  optional overrides for the dark theme; without them the
 *                            renderer lifts the light colour with PC.lift (see there)
 * A specimen that declares none takes the site's accent from CSS.
 * Coordinate frame: Y up. Specimens should fit roughly inside a 2-unit box; the
 * renderer normalises the bounding box, so absolute scale does not matter, but
 * relative proportions do.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.PC = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PC = {};
  PC.k = 14000;           // points per unit^2 of surface at density 1
  PC.density = 1;         // global multiplier (renderer lowers this on phones)
  PC.specimens = {};

  // ---------- deterministic random ----------
  var seed = 1;
  function rnd() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  PC.seed = function (s) { seed = s | 0 || 1; };
  PC.rnd = rnd;

  // ---------- helpers ----------
  function area(a) { return Math.max(4, Math.round(a * PC.k * PC.density)); }
  PC.area = area;
  function tone(o) { return (o && o.tone != null) ? o.tone : 1; }
  function alloc(n) { return new Float32Array(n * 4); }
  function put(c, i, x, y, z, w) { var j = i * 4; c[j] = x; c[j + 1] = y; c[j + 2] = z; c[j + 3] = w; }
  PC.count = function (c) { return c.length / 4; };

  // ---------- primitives ----------
  // Disc (or annulus) in the XZ plane at y = 0, facing +Y.
  PC.disc = function (o) {
    var r = o.r, ri = o.rIn || 0, n = o.n || area(Math.PI * (r * r - ri * ri)), w = tone(o);
    var c = alloc(n);
    for (var i = 0; i < n; i++) {
      var rr = Math.sqrt(ri * ri + rnd() * (r * r - ri * ri)), th = rnd() * Math.PI * 2;
      put(c, i, rr * Math.cos(th), 0, rr * Math.sin(th), w);
    }
    return c;
  };

  // Cylinder shell along Y, centred at origin. rIn>0 makes it hollow (adds inner wall).
  PC.cylinder = function (o) {
    var r = o.r, h = o.h, ri = o.rIn || 0, caps = o.caps !== false, w = tone(o);
    var parts = [];
    // when n is given, split it across side, inner wall and caps by surface area
    var aSide = 2 * Math.PI * r * h, aIn = ri > 0 ? 2 * Math.PI * ri * h : 0, aCap = caps ? 2 * Math.PI * (r * r - ri * ri) : 0, aTot = aSide + aIn + aCap;
    var nSide = o.n ? Math.max(4, Math.round(o.n * aSide / aTot)) : area(aSide);
    var side = alloc(nSide);
    for (var i = 0; i < nSide; i++) { var th = rnd() * Math.PI * 2; put(side, i, r * Math.cos(th), (rnd() - 0.5) * h, r * Math.sin(th), w); }
    parts.push(side);
    if (ri > 0) {
      var nIn = o.n ? Math.max(4, Math.round(o.n * aIn / aTot)) : area(aIn);
      var inner = alloc(nIn);
      for (i = 0; i < nIn; i++) { th = rnd() * Math.PI * 2; put(inner, i, ri * Math.cos(th), (rnd() - 0.5) * h, ri * Math.sin(th), w); }
      parts.push(inner);
    }
    if (caps) {
      var capN = o.n ? Math.max(4, Math.round(o.n * aCap / aTot / 2)) : undefined;
      var top = PC.disc({ r: r, rIn: ri, n: capN, tone: w });
      parts.push(PC.T(top, { pos: [0, h / 2, 0] }));
      parts.push(PC.T(PC.disc({ r: r, rIn: ri, n: capN, tone: w }), { pos: [0, -h / 2, 0] }));
    }
    return PC.merge.apply(null, parts);
  };

  // Frustum (cone) along Y from radius r1 at bottom (-h/2) to r2 at top (+h/2).
  PC.cone = function (o) {
    var r1 = o.r1, r2 = o.r2 == null ? 0 : o.r2, h = o.h, w = tone(o), caps = !!o.caps;
    var slant = Math.sqrt((r1 - r2) * (r1 - r2) + h * h);
    var n = o.n || area(Math.PI * (r1 + r2) * slant);
    var c = alloc(n), rmax = Math.max(r1, r2), i = 0;
    while (i < n) {
      var t = rnd(), r = r1 + (r2 - r1) * t;
      if (rnd() * rmax > r) continue; // density proportional to circumference
      var th = rnd() * Math.PI * 2;
      put(c, i++, r * Math.cos(th), (t - 0.5) * h, r * Math.sin(th), w);
    }
    var parts = [c];
    if (caps) {
      if (r1 > 0) parts.push(PC.T(PC.disc({ r: r1, tone: w }), { pos: [0, -h / 2, 0] }));
      if (r2 > 0) parts.push(PC.T(PC.disc({ r: r2, tone: w }), { pos: [0, h / 2, 0] }));
    }
    return PC.merge.apply(null, parts);
  };

  // Axis-aligned box centred at origin. faces: array subset of ['px','nx','py','ny','pz','nz'] or omitted for all.
  PC.box = function (o) {
    var W = o.w, H = o.h, D = o.d, w = tone(o);
    var faces = o.faces || ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    var areas = { px: H * D, nx: H * D, py: W * D, ny: W * D, pz: W * H, nz: W * H };
    var total = 0; faces.forEach(function (f) { total += areas[f]; });
    var n = o.n || area(total);
    var c = alloc(n);
    for (var i = 0; i < n; i++) {
      var pick = rnd() * total, f = faces[0], acc = 0;
      for (var k = 0; k < faces.length; k++) { acc += areas[faces[k]]; if (pick <= acc) { f = faces[k]; break; } }
      var u = rnd() - 0.5, v = rnd() - 0.5, x, y, z;
      switch (f) {
        case 'px': x = W / 2; y = u * H; z = v * D; break;
        case 'nx': x = -W / 2; y = u * H; z = v * D; break;
        case 'py': x = u * W; y = H / 2; z = v * D; break;
        case 'ny': x = u * W; y = -H / 2; z = v * D; break;
        case 'pz': x = u * W; y = v * H; z = D / 2; break;
        default: x = u * W; y = v * H; z = -D / 2;
      }
      put(c, i, x, y, z, w);
    }
    return c;
  };

  // Sphere (or spherical cap). thetaMax in radians measured from +Y (Math.PI = full sphere).
  PC.sphere = function (o) {
    var r = o.r, w = tone(o), tm = o.thetaMax == null ? Math.PI : o.thetaMax;
    var cosMin = Math.cos(tm);
    var n = o.n || area(2 * Math.PI * r * r * (1 - cosMin));
    var c = alloc(n);
    for (var i = 0; i < n; i++) {
      var cy = cosMin + rnd() * (1 - cosMin), s = Math.sqrt(1 - cy * cy), ph = rnd() * Math.PI * 2;
      put(c, i, r * s * Math.cos(ph), r * cy, r * s * Math.sin(ph), w);
    }
    return c;
  };

  // Torus in the XZ plane (axis Y). R = ring radius, r = tube radius.
  PC.torus = function (o) {
    var R = o.R, r = o.r, w = tone(o);
    var n = o.n || area(4 * Math.PI * Math.PI * R * r);
    var c = alloc(n), i = 0;
    while (i < n) {
      var th = rnd() * Math.PI * 2, ph = rnd() * Math.PI * 2;
      if (rnd() * (R + r) > R + r * Math.cos(ph)) continue;
      var rr = R + r * Math.cos(ph);
      put(c, i++, rr * Math.cos(th), r * Math.sin(ph), rr * Math.sin(th), w);
    }
    return c;
  };

  // Rectangle in the XZ plane at y = 0 (w along X, d along Z).
  PC.plane = function (o) {
    var W = o.w, D = o.d, w = tone(o), n = o.n || area(W * D);
    var c = alloc(n);
    for (var i = 0; i < n; i++) put(c, i, (rnd() - 0.5) * W, 0, (rnd() - 0.5) * D, w);
    return c;
  };

  // Points along a segment. perUnit = points per unit length (default 400).
  PC.line = function (o) {
    var a = o.a, b = o.b, w = tone(o);
    var L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) + (b[2] - a[2]) * (b[2] - a[2]));
    var n = o.n || Math.max(2, Math.round(L * (o.perUnit || 400) * PC.density));
    var c = alloc(n);
    for (var i = 0; i < n; i++) { var t = rnd(); put(c, i, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, w); }
    return c;
  };

  // Polyline through pts (array of [x,y,z]); closed=true joins last to first.
  PC.polyline = function (o) {
    var pts = o.pts, parts = [], m = pts.length - (o.closed ? 0 : 1);
    for (var i = 0; i < m; i++) parts.push(PC.line({ a: pts[i], b: pts[(i + 1) % pts.length], perUnit: o.perUnit, tone: o.tone }));
    return PC.merge.apply(null, parts);
  };

  // Circle outline in the XZ plane.
  PC.circle = function (o) {
    var r = o.r, w = tone(o), n = o.n || Math.round(2 * Math.PI * r * (o.perUnit || 400) * PC.density);
    var c = alloc(n);
    for (var i = 0; i < n; i++) { var th = rnd() * Math.PI * 2; put(c, i, r * Math.cos(th), 0, r * Math.sin(th), w); }
    return c;
  };

  // Twelve edges of a box, as lines (a schematic wireframe).
  PC.boxEdges = function (o) {
    var W = o.w / 2, H = o.h / 2, D = o.d / 2, p = o.perUnit, w = o.tone;
    var v = [[-W, -H, -D], [W, -H, -D], [W, -H, D], [-W, -H, D], [-W, H, -D], [W, H, -D], [W, H, D], [-W, H, D]];
    var e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    return PC.merge.apply(null, e.map(function (q) { return PC.line({ a: v[q[0]], b: v[q[1]], perUnit: p, tone: w }); }));
  };

  // Surface of revolution around Y. profile = [[r, y], ...] from bottom to top.
  PC.lathe = function (o) {
    var prof = o.profile, w = tone(o), parts = [];
    for (var i = 0; i < prof.length - 1; i++) {
      var r1 = prof[i][0], y1 = prof[i][1], r2 = prof[i + 1][0], y2 = prof[i + 1][1];
      var h = y2 - y1;
      if (Math.abs(h) < 1e-6 && Math.abs(r1 - r2) < 1e-6) continue;
      if (Math.abs(h) < 1e-6) { // flat annulus
        parts.push(PC.T(PC.disc({ r: Math.max(r1, r2), rIn: Math.min(r1, r2), tone: w }), { pos: [0, y1, 0] }));
      } else {
        parts.push(PC.T(PC.cone({ r1: r1, r2: r2, h: h, tone: w }), { pos: [0, (y1 + y2) / 2, 0] }));
      }
    }
    return PC.merge.apply(null, parts);
  };

  // Prism: polygon shape = [[x, z], ...] extruded along Y by h, centred at y = 0.
  PC.extrude = function (o) {
    var shape = o.shape, h = o.h, w = tone(o), parts = [], m = shape.length;
    var minx = Infinity, maxx = -Infinity, minz = Infinity, maxz = -Infinity, polyArea = 0;
    for (var i = 0; i < m; i++) {
      var a = shape[i], b = shape[(i + 1) % m];
      minx = Math.min(minx, a[0]); maxx = Math.max(maxx, a[0]); minz = Math.min(minz, a[1]); maxz = Math.max(maxz, a[1]);
      polyArea += a[0] * b[1] - b[0] * a[1];
      var L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
      var n = area(L * h), c = alloc(n);
      for (var k = 0; k < n; k++) { var t = rnd(); put(c, k, a[0] + (b[0] - a[0]) * t, (rnd() - 0.5) * h, a[1] + (b[1] - a[1]) * t, w); }
      parts.push(c);
    }
    polyArea = Math.abs(polyArea) / 2;
    if (o.caps !== false) {
      var nc = area(polyArea), cap = alloc(nc * 2), j = 0;
      while (j < nc * 2) {
        var x = minx + rnd() * (maxx - minx), z = minz + rnd() * (maxz - minz), inside = false;
        for (var p = 0, q = m - 1; p < m; q = p++) {
          if ((shape[p][1] > z) !== (shape[q][1] > z) && x < (shape[q][0] - shape[p][0]) * (z - shape[p][1]) / (shape[q][1] - shape[p][1]) + shape[p][0]) inside = !inside;
        }
        if (!inside) continue;
        put(cap, j++, x, h / 2, z, w);
        put(cap, j++, x, -h / 2, z, w);
      }
      parts.push(cap);
    }
    return PC.merge.apply(null, parts);
  };

  // Uniform random points inside a box volume (for gas, plasma, fluid).
  PC.scatter = function (o) {
    var n = o.n || 2000, w = tone(o), c = alloc(n);
    for (var i = 0; i < n; i++) put(c, i, (rnd() - 0.5) * o.w, (rnd() - 0.5) * o.h, (rnd() - 0.5) * o.d, w);
    return c;
  };

  // Helix around Y: r radius, pitch per turn, turns count.
  PC.helix = function (o) {
    var r = o.r, pitch = o.pitch, turns = o.turns, w = tone(o);
    var L = turns * Math.sqrt((2 * Math.PI * r) * (2 * Math.PI * r) + pitch * pitch);
    var n = o.n || Math.round(L * (o.perUnit || 400) * PC.density), c = alloc(n);
    for (var i = 0; i < n; i++) { var t = rnd() * turns; put(c, i, r * Math.cos(t * Math.PI * 2), (t - turns / 2) * pitch, r * Math.sin(t * Math.PI * 2), w); }
    return c;
  };

  // Regular grid of points on the XZ plane (for die grids, pin arrays, bump fields).
  PC.dots = function (o) {
    var nx = o.nx, nz = o.nz, sx = o.sx, sz = o.sz == null ? o.sx : o.sz, w = tone(o), per = o.per || 1;
    var c = alloc(nx * nz * per), i = 0;
    for (var a = 0; a < nx; a++) for (var b = 0; b < nz; b++) for (var p = 0; p < per; p++) {
      put(c, i++, (a - (nx - 1) / 2) * sx + (per > 1 ? (rnd() - 0.5) * sx * 0.3 : 0), 0, (b - (nz - 1) / 2) * sz + (per > 1 ? (rnd() - 0.5) * sz * 0.3 : 0), w);
    }
    return c;
  };

  // ---------- transforms ----------
  // T(cloud, {pos:[x,y,z], rot:[rx,ry,rz] (radians, applied X then Y then Z), scale: number | [sx,sy,sz]})
  PC.T = function (c, o) {
    o = o || {};
    var s = o.scale == null ? [1, 1, 1] : (typeof o.scale === 'number' ? [o.scale, o.scale, o.scale] : o.scale);
    var r = o.rot || [0, 0, 0], p = o.pos || [0, 0, 0];
    var cx = Math.cos(r[0]), sx = Math.sin(r[0]), cy = Math.cos(r[1]), sy = Math.sin(r[1]), cz = Math.cos(r[2]), sz = Math.sin(r[2]);
    // M = Rz * Ry * Rx
    var m00 = cz * cy, m01 = cz * sy * sx - sz * cx, m02 = cz * sy * cx + sz * sx;
    var m10 = sz * cy, m11 = sz * sy * sx + cz * cx, m12 = sz * sy * cx - cz * sx;
    var m20 = -sy, m21 = cy * sx, m22 = cy * cx;
    var out = new Float32Array(c.length);
    for (var i = 0; i < c.length; i += 4) {
      var x = c[i] * s[0], y = c[i + 1] * s[1], z = c[i + 2] * s[2];
      out[i] = m00 * x + m01 * y + m02 * z + p[0];
      out[i + 1] = m10 * x + m11 * y + m12 * z + p[1];
      out[i + 2] = m20 * x + m21 * y + m22 * z + p[2];
      out[i + 3] = c[i + 3];
    }
    return out;
  };

  PC.merge = function () {
    var total = 0, i;
    for (i = 0; i < arguments.length; i++) if (arguments[i]) total += arguments[i].length;
    var out = new Float32Array(total), off = 0;
    for (i = 0; i < arguments.length; i++) { if (!arguments[i]) continue; out.set(arguments[i], off); off += arguments[i].length; }
    return out;
  };

  PC.jitter = function (c, amt) {
    var out = new Float32Array(c);
    for (var i = 0; i < out.length; i += 4) { out[i] += (rnd() - 0.5) * amt; out[i + 1] += (rnd() - 0.5) * amt; out[i + 2] += (rnd() - 0.5) * amt; }
    return out;
  };

  // Keep a fraction of points (0..1).
  PC.thin = function (c, frac) {
    var n = c.length / 4, keep = Math.round(n * frac), out = alloc(keep), j = 0;
    for (var i = 0; i < n && j < keep; i++) if (rnd() < frac) { out.set(c.subarray(i * 4, i * 4 + 4), j * 4); j++; }
    return out.subarray(0, j * 4);
  };

  PC.tone = function (c, w) { var out = new Float32Array(c); for (var i = 3; i < out.length; i += 4) out[i] = w; return out; };
  PC.accent = function (c, a) { return PC.tone(c, 2 + (a == null ? 1 : a)); };
  // Second accent channel: w in (3,4]. Alpha is floored at 0.02 so a point never lands on
  // w = 3 exactly, which is a full point of the first accent.
  PC.accent2 = function (c, a) { return PC.tone(c, 3 + Math.min(1, Math.max(0.02, a == null ? 1 : a))); };

  // ---------- colour helpers (shared by the site, the cards and the cover) ----------
  // Dark-theme rule: keep the hue and saturation of the light-ground colour and raise its HSL
  // lightness to at least minL (0.62), so a colour chosen to read against warm white also
  // reads against the dark ground. A specimen that wants something else declares accentDark.
  PC.lift = function (rgb, minL) {
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, L = minL == null ? 0.62 : minL;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, sat = 0, d = mx - mn;
    if (d > 0) {
      sat = d / (1 - Math.abs(2 * l - 1));
      if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    if (l >= L) return rgb.slice();
    l = L;
    var c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, o;
    if (h < 60) o = [c, x, 0]; else if (h < 120) o = [x, c, 0]; else if (h < 180) o = [0, c, x];
    else if (h < 240) o = [0, x, c]; else if (h < 300) o = [x, 0, c]; else o = [c, 0, x];
    return [Math.round((o[0] + m) * 255), Math.round((o[1] + m) * 255), Math.round((o[2] + m) * 255)];
  };
  // The two accent colours a built specimen draws with on the given ground, as 0..255 arrays,
  // or null when the specimen declares none (the site then uses its CSS accent).
  PC.resolveColors = function (s, dark) {
    if (!s || !s.accent) return null;
    var a = dark ? (s.accentDark || PC.lift(s.accent)) : s.accent;
    var a2 = s.accent2 ? (dark ? (s.accent2Dark || PC.lift(s.accent2)) : s.accent2) : a;
    return { accent: a, accent2: a2 };
  };

  // Linear array: n copies stepped by offset [dx,dy,dz].
  PC.repeat = function (c, n, off) {
    var parts = [];
    for (var i = 0; i < n; i++) parts.push(PC.T(c, { pos: [off[0] * i, off[1] * i, off[2] * i] }));
    return PC.merge.apply(null, parts);
  };

  // Radial array around Y: n copies at radius R, each rotated to face outward.
  PC.radial = function (c, n, R, startAngle) {
    var parts = [], a0 = startAngle || 0;
    for (var i = 0; i < n; i++) { var a = a0 + i * Math.PI * 2 / n; parts.push(PC.T(c, { rot: [0, -a, 0], pos: [R * Math.cos(a), 0, R * Math.sin(a)] })); }
    return PC.merge.apply(null, parts);
  };

  PC.mirrorX = function (c) { var out = new Float32Array(c); for (var i = 0; i < out.length; i += 4) out[i] = -out[i]; return PC.merge(c, out); };

  PC.bounds = function (c) {
    var b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
    for (var i = 0; i < c.length; i += 4) for (var k = 0; k < 3; k++) { if (c[i + k] < b.min[k]) b.min[k] = c[i + k]; if (c[i + k] > b.max[k]) b.max[k] = c[i + k]; }
    b.size = [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]];
    b.center = [(b.max[0] + b.min[0]) / 2, (b.max[1] + b.min[1]) / 2, (b.max[2] + b.min[2]) / 2];
    b.radius = Math.sqrt(b.size[0] * b.size[0] + b.size[1] * b.size[1] + b.size[2] * b.size[2]) / 2;
    return b;
  };

  // Centre the cloud and scale so its bounding-sphere radius is `radius` (default 1).
  PC.normalize = function (c, radius) {
    var b = PC.bounds(c), s = (radius || 1) / (b.radius || 1);
    return PC.T(c, { pos: [-b.center[0] * s, -b.center[1] * s, -b.center[2] * s], scale: s });
  };

  // ---------- specimen registry ----------
  // PC.register('wafer', function (params) { return { cloud, spin, tilt, caption } })
  PC.register = function (name, fn) { PC.specimens[name] = fn; };
  PC.build = function (name, params) {
    if (!PC.specimens[name]) throw new Error('unknown specimen ' + name);
    PC.seed(7);
    var s = PC.specimens[name](params || {});
    if (!s || !s.cloud) throw new Error('specimen ' + name + ' returned no cloud');
    s.name = name;
    // the transform normalize applies, kept so a point named in the specimen's own units (a part's balloon, data/specimen-parts.json) lands where the drawing puts it
    var b = PC.bounds(s.cloud); s.norm = { c: b.center, k: 1 / (b.radius || 1) };
    s.cloud = PC.normalize(s.cloud, 1);
    if (s.spin == null) s.spin = 0.12;
    if (!s.tilt) s.tilt = [0.35, -0.6, 0];
    return s;
  };

  return PC;
});

/* boule-and-wafer.js */
try{(function(PC){
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
 * Beside the tail are two wafers sawn from that body, one on its rim in copper. A
 * wafer is exactly as wide as the ingot: that is the whole reason for growing
 * the crystal to 300 mm in the first place.
 */
PC.register('boule-and-wafer', function (p) {
  var R = 0.15, bx = -0.20;
  var yTip = -0.71, yB0 = -0.45, yB1 = 1.05;         // tail 0.26 m, body 1.50 m
  var yCr = 1.40, yNk = 1.53, ySd = 1.60, yCh = 1.645;
  var MER = 30;                                       // meridians around each solid
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
        perUnit: heavy ? 330 : 235, tone: heavy ? heavyTone : tone
      })));
    }
  }

  // ---------- tail: a long gentle taper cropped to a small flat ----------
  var tail = [[0.038, yTip], [0.078, yTip + 0.045], [0.110, yTip + 0.095],
              [0.133, yTip + 0.160], [0.146, yTip + 0.215], [R, yB0]];
  parts.push(at(PC.lathe({ profile: tail, tone: 0.19 })));
  hatch(tail, 0.34);
  parts.push(at(PC.T(PC.disc({ r: 0.038, tone: 0.4 }), { pos: [0, yTip, 0] })));
  parts.push(at(PC.T(PC.circle({ r: 0.038, perUnit: 700, tone: 1 }), { pos: [0, yTip, 0] })));

  // ---------- body: 1.5 m of ground 300 mm cylinder ----------
  var body = [[R, yB0], [R, yB1]];
  parts.push(at(PC.T(PC.cylinder({ r: R, h: yB1 - yB0, caps: false, n: 13000, tone: 0.18 }),
    { pos: [0, (yB0 + yB1) / 2, 0] })));
  hatch(body, 0.30);
  for (i = 0; i <= 9; i++) {                          // growth striations
    y = yB0 + 0.07 + (yB1 - yB0 - 0.14) * i / 9;
    parts.push(at(PC.T(PC.circle({ r: R * 1.006, perUnit: 175, tone: 0.28 }), { pos: [0, y, 0] })));
  }
  parts.push(at(PC.T(PC.circle({ r: R * 1.006, perUnit: 420, tone: 0.85 }), { pos: [0, yB0, 0] })));

  // ---------- crown: as-grown, one step proud of the ground body ----------
  var Rc = R * 1.03;
  var crown = [[Rc, yB1], [Rc, yB1 + 0.018], [Rc * 0.992, 1.105], [Rc * 0.972, 1.145],
               [Rc * 0.936, 1.185], [Rc * 0.880, 1.225], [Rc * 0.800, 1.265],
               [Rc * 0.690, 1.303], [Rc * 0.545, 1.338], [Rc * 0.370, 1.368],
               [Rc * 0.185, 1.390], [0.004, yCr]];
  parts.push(at(PC.lathe({ profile: crown, tone: 0.19 })));
  hatch(crown, 0.34, 6, 0.88);                         // 4 heavy meridians = the facet ridges
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

  // ---------- two wafers off the wire saw: one on its rim, one lying flat ----------
  function wafer(accent) {
    var face = PC.disc({ r: R, n: accent ? 3400 : 2600, tone: accent ? 0.24 : 0.20 });
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
  parts.push(PC.T(wafer(true), {                       // standing on its rim, in copper
    rot: [0, 0.34, -(Math.PI / 2 - lean)],
    pos: [0.28, yTip + R * Math.cos(lean) + 0.002, -0.06]
  }));
  parts.push(PC.T(wafer(false), { rot: [0, 0.9, 0], pos: [0.34, yTip + 0.002, 0.26] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.075,
    tilt: [0.16, -0.62, 0],
    // colour: a polished wafer is a mirror; it shows the cool white of cleanroom light with the faint blue of its native oxide, so a silver leaning blue
    accent: [111, 139, 166], accentDark: [195, 211, 226],
    caption: 'A Czochralski silicon ingot: 2.1 m of one unbroken crystal, roughly 265 kg of it, ' +
      'hanging from a seed on a neck about 10 mm across. Below the seed comes the neck, then the ' +
      'crown where the crystal opens out to 300 mm - the four heavy lines down it are the facet ' +
      'ridges of a <100> crystal - then 1.5 m of ground body ringed with growth striations, then ' +
      'the cropped tail. At its foot are two wafers sawn from that body, the one on its rim in ' +
      'silver, each exactly as wide as the ingot it came from.'
  };
});

})(window.PC);}catch(e){console.warn('specimen boule-and-wafer.js failed to load', e);}
/* cowos-exploded.js */
try{(function(PC){
/* Specimen: a CoWoS package pulled apart.
 *
 * Real object: a Blackwell-class accelerator. Two reticle-sized logic dies side
 * by side with a die-to-die seam down the middle, four HBM stacks to the left and
 * four to the right, all sitting on one slab of silicon, which sits on an organic
 * build-up substrate, which lands on the board through a ball grid. TechInsights'
 * B200 teardown gives the two-die, eight-stack arrangement; TSMC's CoWoS roadmap
 * coverage gives the size limits (3.3x reticle of chip area today, 80 x 80 mm of
 * substrate, nine reticles promised by 2027).
 *
 * Drawing decisions:
 *  - Footprints are to scale (1 mm = 1/60 unit). The interposer hugs the chips
 *    with a 1.5 mm margin, as a real one does; the old drawing floated the chips
 *    in the middle of a square interposer twice the size it should be.
 *  - Layer thicknesses and the gaps between them are exaggerated. The gaps are
 *    now about the thickness of the substrate rather than half the package width,
 *    so the layers read as one assembly instead of five separate plates.
 *  - The interposer is the chokepoint, so it is the only copper part. Its wiring
 *    is drawn: the dense bundle across the die-to-die seam and the bundles that
 *    fan out to each HBM site are the whole reason this slab of silicon exists.
 */
PC.register('cowos-exploded', function (p) {
  var S = 1 / 60;
  var dieW = 26 * S, dieD = 32 * S, dieX = 13.3 * S;
  var hbmW = 11 * S, hbmD = 12 * S, hbmX = 34 * S;
  var hbmZ = [-19 * S, -6.4 * S, 6.4 * S, 19 * S];
  var ipW = 82 * S, ipD = 53 * S;
  var subW = 100 * S, subD = 72 * S;
  var subH = 0.10, ipH = 0.058, dieH = 0.068, hbmH = 0.082, frH = 0.055;
  var gap = 0.075;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function rect(w, d, per, tn) {
    return PC.polyline({ pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]], closed: true, perUnit: per, tone: tn });
  }
  var dies = [{ x: -dieX, z: 0 }, { x: dieX, z: 0 }];
  var hbm = [];
  for (var q = 0; q < 4; q++) { hbm.push({ x: -hbmX, z: hbmZ[q] }); hbm.push({ x: hbmX, z: hbmZ[q] }); }

  // ---------- levels, bottom to top ----------
  var ySub = 0, subTop = subH / 2;
  var yC4 = subTop + gap;
  var ipBot = yC4 + gap, ipTop = ipBot + ipH;
  var yUb = ipTop + gap * 0.75;
  var yChip = yUb + gap * 0.85;
  var yFr = yChip + hbmH + gap * 1.3;

  // ---------- 1. the build-up substrate, with its ball grid underneath ----------
  add(PC.T(PC.plane({ w: subW, d: subD, n: 6500, tone: 0.26 }), { pos: [0, subTop, 0] }));
  add(PC.T(PC.box({ w: subW, h: subH, d: subD, faces: ['px', 'nx', 'pz', 'nz'], n: 3200, tone: 0.48 }), { pos: [0, ySub, 0] }));
  add(PC.T(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 280, tone: 0.9 }), { pos: [0, ySub, 0] }));
  var bp = 2.0 * S;
  add(PC.T(PC.dots({ nx: Math.floor(subW / bp) - 1, nz: Math.floor(subD / bp) - 1, sx: bp, sz: bp, per: 2, tone: 0.45 }),
    { pos: [0, ySub - subH / 2 - 0.028, 0] }));
  // where the interposer will land, and the ring of capacitors around it
  add(PC.T(rect(ipW, ipD, 240, 0.7), { pos: [0, subTop + 0.003, 0] }));
  var caps = [];
  for (q = 0; q < 34; q++) {
    var cu = (q - 16.5) * (subW * 0.97 / 34);
    if (Math.abs(cu) > ipW / 2 + 1.5 * S) continue;
    [-1, 1].forEach(function (sg) {
      caps.push(PC.line({ a: [cu, subTop + 0.004, sg * (ipD / 2 + 2.6 * S)], b: [cu, subTop + 0.004, sg * (ipD / 2 + 4.6 * S)], perUnit: 520, tone: 0.85 }));
    });
  }
  for (q = 0; q < 22; q++) {
    var cv = (q - 10.5) * (subD * 0.95 / 22);
    if (Math.abs(cv) > ipD / 2 + 1.5 * S) continue;
    [-1, 1].forEach(function (sg) {
      caps.push(PC.line({ a: [sg * (ipW / 2 + 2.6 * S), subTop + 0.004, cv], b: [sg * (ipW / 2 + 4.6 * S), subTop + 0.004, cv], perUnit: 520, tone: 0.85 }));
    });
  }
  add(PC.merge.apply(null, caps));

  // ---------- 2. the C4 bumps that carry the interposer down to the substrate ----------
  var c4 = 2.8 * S;
  add(PC.T(PC.dots({ nx: Math.floor(ipW / c4) - 1, nz: Math.floor(ipD / c4) - 1, sx: c4, sz: c4, per: 3, tone: 0.6 }), { pos: [0, yC4, 0] }));
  add(PC.T(rect(ipW, ipD, 150, 0.3), { pos: [0, yC4, 0] }));

  // ---------- 3. the silicon interposer: the chokepoint, in copper ----------
  var ipY = ipBot + ipH / 2;
  add(PC.T(PC.accent(PC.plane({ w: ipW, d: ipD, n: 5200 }), 0.3), { pos: [0, ipTop, 0] }));
  add(PC.T(PC.accent(PC.box({ w: ipW, h: ipH, d: ipD, faces: ['px', 'nx', 'pz', 'nz'], n: 3000 }), 0.62), { pos: [0, ipY, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: ipW, h: ipH, d: ipD, perUnit: 320 }), 1), { pos: [0, ipY, 0] }));
  // the through-silicon vias, a field of them across the whole slab
  var tv = 3.4 * S;
  add(PC.T(PC.accent2(PC.dots({ nx: Math.floor(ipW / tv), nz: Math.floor(ipD / tv), sx: tv, sz: tv }), 0.26), { pos: [0, ipTop + 0.003, 0] }));
  // the wiring: a dense bundle across the die-to-die seam, and a bundle out to
  // every HBM site. This is what the interposer is for.
  var rdl = [], yR = ipTop + 0.004;
  for (q = 0; q < 24; q++) {
    var rz = (q - 11.5) * (dieD * 0.92 / 24);
    rdl.push(PC.line({ a: [-dieX + dieW / 2 - 3 * S, yR, rz], b: [dieX - dieW / 2 + 3 * S, yR, rz], perUnit: 130, tone: 1 }));
  }
  hbm.forEach(function (h) {
    var sg = h.x < 0 ? -1 : 1;
    for (var i = 0; i < 10; i++) {
      var z0 = h.z + (i - 4.5) * hbmD * 0.078;
      var z1 = h.z * 0.55 + (i - 4.5) * hbmD * 0.062;
      rdl.push(PC.polyline({ pts: [[sg * (hbmX - hbmW * 0.36), yR, z0], [sg * (dieX + dieW / 2 + 2.4 * S), yR, z0], [sg * (dieX + dieW / 2 - 2.5 * S), yR, z1]], perUnit: 170, tone: 1 }));
    }
  });
  add(PC.accent2(PC.merge.apply(null, rdl), 0.75));

  // ---------- 4. the micro-bumps, one field under every chip ----------
  function chips(fn) {
    dies.forEach(function (d) { fn(d.x, d.z, dieW, dieD, true); });
    hbm.forEach(function (h) { fn(h.x, h.z, hbmW, hbmD, false); });
  }
  chips(function (x, z, w, d, isDie) {
    var s = isDie ? 1.4 * S : 1.2 * S;
    add(PC.T(PC.dots({ nx: Math.round(w / s), nz: Math.round(d / s), sx: s, sz: s, per: 2, tone: 0.55 }), { pos: [x, yUb, z] }));
    add(PC.T(rect(w, d, 170, isDie ? 0.5 : 0.42), { pos: [x, yUb, z] }));
  });

  // ---------- 5. the chips: two logic dies and eight HBM stacks ----------
  dies.forEach(function (d) {
    var yc = yChip + dieH / 2;
    add(PC.T(PC.plane({ w: dieW, d: dieD, n: 1800, tone: 0.24 }), { pos: [d.x, yChip + dieH, d.z] }));
    add(PC.T(PC.box({ w: dieW, h: dieH, d: dieD, faces: ['px', 'nx', 'pz', 'nz'], n: 1100, tone: 0.42 }), { pos: [d.x, yc, d.z] }));
    add(PC.T(PC.boxEdges({ w: dieW, h: dieH, d: dieD, perUnit: 220, tone: 0.98 }), { pos: [d.x, yc, d.z] }));
    // a hint of the floorplan: a block grid with the memory interface facing outward
    var fp = [], sg = d.x < 0 ? -1 : 1;
    for (var a = 0; a < 4; a++) for (var b = 0; b < 7; b++) {
      fp.push(PC.T(rect(dieW * 0.19, dieD * 0.115, 70, 0.6), { pos: [d.x + (a - 1.5) * dieW * 0.215, yChip + dieH + 0.003, d.z + (b - 3) * dieD * 0.132] }));
    }
    fp.push(PC.T(rect(dieW * 0.1, dieD * 0.9, 110, 0.8), { pos: [d.x + sg * dieW * 0.43, yChip + dieH + 0.003, d.z] }));
    add(PC.merge.apply(null, fp));
  });
  hbm.forEach(function (h) {
    var yc = yChip + hbmH / 2;
    add(PC.T(PC.box({ w: hbmW, h: hbmH, d: hbmD, faces: ['px', 'nx', 'pz', 'nz'], n: 340, tone: 0.26 }), { pos: [h.x, yc, h.z] }));
    for (var k = 1; k <= 12; k++) add(PC.T(rect(hbmW, hbmD, 46, 0.52), { pos: [h.x, yChip + hbmH * k / 12.6, h.z] }));
    add(PC.T(PC.plane({ w: hbmW, d: hbmD, n: 260, tone: 0.18 }), { pos: [h.x, yChip + hbmH, h.z] }));
    add(PC.T(rect(hbmW, hbmD, 150, 0.85), { pos: [h.x, yChip + hbmH, h.z] }));
  });

  // ---------- 6. the stiffener frame, lifted clear of the chips ----------
  var frIn = [ipW + 6 * S, ipD + 6 * S], frOut = [subW, subD];
  var barX = (frOut[0] - frIn[0]) / 2, barZ = (frOut[1] - frIn[1]) / 2;
  [[frOut[0], barZ, 0, (frIn[1] + barZ) / 2], [frOut[0], barZ, 0, -(frIn[1] + barZ) / 2],
   [barX, frIn[1], (frIn[0] + barX) / 2, 0], [barX, frIn[1], -(frIn[0] + barX) / 2, 0]].forEach(function (b) {
    add(PC.T(PC.box({ w: b[0], h: frH, d: b[1], n: 2000, tone: 0.4 }), { pos: [b[2], yFr, b[3]] }));
    add(PC.T(PC.boxEdges({ w: b[0], h: frH, d: b[1], perUnit: 260, tone: 0.95 }), { pos: [b[2], yFr, b[3]] }));
  });

  // ---------- guide lines, so the layers read as one assembly ----------
  var g = [];
  for (q = 0; q < 4; q++) {
    var sx = (q === 0 || q === 3) ? -1 : 1, sz = (q < 2) ? -1 : 1;
    g.push(PC.line({ a: [sx * subW / 2, subTop, sz * subD / 2], b: [sx * subW / 2, yFr - frH / 2, sz * subD / 2], perUnit: 110, tone: 0.2 }));
    g.push(PC.line({ a: [sx * ipW / 2, subTop, sz * ipD / 2], b: [sx * ipW / 2, ipBot, sz * ipD / 2], perUnit: 150, tone: 0.3 }));
    g.push(PC.line({ a: [sx * ipW / 2, ipTop, sz * ipD / 2], b: [sx * ipW / 2, yChip, sz * ipD / 2], perUnit: 130, tone: 0.24 }));
  }
  add(PC.merge.apply(null, g));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.66, -0.62, 0],
    // colour: the interposer is bare polished silicon, a mirror that reads as cool silver
    accent: [111, 139, 166], accentDark: [195, 211, 226],
    // colour: the redistribution wiring and micro-bumps on it are electroplated copper
    accent2: [176, 102, 44], accent2Dark: [224, 154, 92],
    caption: 'A CoWoS package pulled apart: a ball grid and a build-up substrate ringed with capacitors at the bottom, then the C4 bumps, then the silicon interposer in silver, with its copper wiring, its through-silicon vias and the wiring that stitches the two logic dies together and fans out to the memory, then the micro-bumps, then two reticle-sized dies and eight HBM stacks, with the stiffener frame lifted clear above. Footprints are to scale: the chips cover about 2,700 mm2, a little over three reticles. Thicknesses and gaps are exaggerated.'
  };
});

})(window.PC);}catch(e){console.warn('specimen cowos-exploded.js failed to load', e);}
/* die-floorplan.js */
try{(function(PC){
/* Specimen: the floorplan of a GPU die, seen from above.
 *
 * Units are millimetres. The die is 26 x 33 mm, which is one full reticle
 * field - the largest area a scanner can print in a single exposure, and the
 * reason the biggest accelerators are built from two dies rather than one.
 *
 * The arrangement follows Nvidia's published GH100 block diagram:
 *   - 144 streaming multiprocessors in 8 graphics processing clusters, four
 *     above the cache band and four below, 18 tiles each;
 *   - the L2 cache split into two partitions in a band across the middle,
 *     with the crossbar between them;
 *   - twelve memory controllers and their HBM PHYs down the two long edges,
 *     two controllers per HBM stack, three stacks a side;
 *   - the PCI Express host interface and the scheduler across one short edge,
 *     with a row of NVLink ports inside it;
 *   - on a two-die part the other short edge carries the die-to-die interface
 *     instead, so a sliver of the neighbouring die is drawn beyond it.
 *
 * H100 itself is a single die. The copper strip on the other short edge, and
 * the sliver past it, stand for the die-to-die link that two-die designs such
 * as Blackwell add: thousands of contacts at a few microns' pitch, carrying
 * about 10 TB/s, doing the job the reticle limit stopped a single piece of
 * silicon from doing.
 */
PC.register('die-floorplan', function (p) {
  var W = 26, D = 33, T = 0.75;                 // one reticle field
  var yTop = T / 2 + 0.02, parts = [];
  function add(c) { parts.push(c); }
  function fill(x0, z0, x1, z1, n, tn) {
    return PC.T(PC.plane({ w: x1 - x0, d: z1 - z0, n: n, tone: tn }),
      { pos: [(x0 + x1) / 2, yTop, (z0 + z1) / 2] });
  }
  function rect(x0, z0, x1, z1, per, tn) {
    return PC.polyline({
      pts: [[x0, yTop, z0], [x1, yTop, z0], [x1, yTop, z1], [x0, yTop, z1]],
      closed: true, perUnit: per, tone: tn
    });
  }
  function hline(x0, x1, z, per, tn) { return PC.line({ a: [x0, yTop, z], b: [x1, yTop, z], perUnit: per, tone: tn }); }
  function vline(x, z0, z1, per, tn) { return PC.line({ a: [x, yTop, z0], b: [x, yTop, z1], perUnit: per, tone: tn }); }

  // ---------- the slab ----------
  add(PC.T(PC.box({ w: W, h: T, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 2600, tone: 0.22 }), { pos: [0, 0, 0] }));
  add(fill(-W / 2, -D / 2, W / 2, D / 2, 13000, 0.10));            // the field between blocks
  add(rect(-W / 2, -D / 2, W / 2, D / 2, 46, 1));                  // die edge
  add(rect(-W / 2 + 0.30, -D / 2 + 0.30, W / 2 - 0.30, D / 2 - 0.30, 22, 0.55));   // seal ring

  // ---------- memory: 6 controllers and their HBM PHY down each long edge ----------
  var phyW = 2.5, mcW = 1.5;
  [-1, 1].forEach(function (s) {
    var xa = s * (W / 2 - phyW), xb = s * (W / 2 - 0.78);          // PHY, hard against the edge
    for (var m = 0; m < 6; m++) {
      var z0 = -13.6 + m * 4.55, z1 = z0 + 4.1;
      add(fill(Math.min(xa, xb), z0, Math.max(xa, xb), z1, 620, 0.34));
      add(rect(Math.min(xa, xb), z0, Math.max(xa, xb), z1, 30, 0.95));
      for (var k = 1; k <= 7; k++) {                               // the PHY's repeated lanes
        add(hline(Math.min(xa, xb) + 0.12, Math.max(xa, xb) - 0.12, z0 + (z1 - z0) * k / 8, 22, 0.42));
      }
      // the memory controller, inboard of the PHY
      var xc = s * (W / 2 - phyW - 0.25), xd = s * (W / 2 - phyW - 0.25 - mcW);
      add(fill(Math.min(xc, xd), z0 + 0.2, Math.max(xc, xd), z1 - 0.2, 240, 0.22));
      add(rect(Math.min(xc, xd), z0 + 0.2, Math.max(xc, xd), z1 - 0.2, 22, 0.7));
    }
  });

  // ---------- 8 GPCs of 18 SM tiles, four above the cache band and four below ----------
  var cx0 = -9.5, cx1 = 9.5;                     // compute region in x
  var gcW = (cx1 - cx0) / 4, gcD = 10.4;
  var bands = [[3.5, 13.9], [-13.9, -3.5]];
  bands.forEach(function (bz) {
    for (var g = 0; g < 4; g++) {
      var gx0 = cx0 + g * gcW + 0.22, gx1 = cx0 + (g + 1) * gcW - 0.22;
      add(rect(gx0, bz[0], gx1, bz[1], 34, 1));                    // GPC outline
      var tw = (gx1 - gx0 - 0.5) / 3, td = (gcD - 0.7) / 6;
      for (var a = 0; a < 3; a++) for (var b = 0; b < 6; b++) {
        var sx0 = gx0 + 0.25 + a * tw + 0.10, sx1 = gx0 + 0.25 + (a + 1) * tw - 0.10;
        var sz0 = bz[0] + 0.35 + b * td + 0.10, sz1 = bz[0] + 0.35 + (b + 1) * td - 0.10;
        add(fill(sx0, sz0, sx1, sz1, 46, 0.26));                   // SM tile
        add(rect(sx0, sz0, sx1, sz1, 24, 0.88));
        for (var q = 1; q <= 3; q++) {                             // the SM's own rows
          add(hline(sx0 + 0.08, sx1 - 0.08, sz0 + (sz1 - sz0) * q / 4, 17, 0.40));
        }
      }
    }
  });

  // ---------- L2 cache: two partitions and the crossbar between them ----------
  [[-9.5, -0.55], [0.55, 9.5]].forEach(function (lx) {
    add(fill(lx[0], -2.7, lx[1], 2.7, 900, 0.30));
    add(rect(lx[0], -2.7, lx[1], 2.7, 34, 1));
    for (var k = 1; k <= 11; k++) add(hline(lx[0] + 0.15, lx[1] - 0.15, -2.7 + 5.4 * k / 12, 24, 0.44));
  });
  add(fill(-0.45, -2.7, 0.45, 2.7, 200, 0.5));                     // crossbar
  add(rect(-0.45, -2.7, 0.45, 2.7, 26, 0.8));
  [-1, 1].forEach(function (s) {                                   // cache to memory
    for (var k = -2; k <= 2; k++) add(hline(s * 9.5, s * (W / 2 - phyW - 1.9), k * 1.05, 26, 0.5));
  });

  // ---------- host edge: PCI Express, the scheduler, and a row of NVLink ports ----------
  add(fill(-11.4, 14.35, 11.4, 16.05, 900, 0.32));
  add(rect(-11.4, 14.35, 11.4, 16.05, 32, 1));
  for (var k = -5; k <= 5; k++) add(vline(k * 2.0, 14.45, 15.95, 22, 0.42));
  add(fill(-11.4, 14.0, 11.4, 14.2, 260, 0.5));                    // scheduler strip
  add(rect(-11.4, 14.0, 11.4, 14.2, 26, 0.85));
  for (var n = 0; n < 9; n++) {                                    // NVLink ports
    var nx = -10.4 + n * 2.6;
    add(fill(nx, 12.15, nx + 2.0, 13.5, 150, 0.3));
    add(rect(nx, 12.15, nx + 2.0, 13.5, 26, 0.85));
  }

  // ---------- the die-to-die interface, and a sliver of the die it faces ----------
  var d0 = -16.15, d1 = -14.25;
  add(PC.accent(fill(-11.9, d0, 11.9, d1, 3400, 1), 0.30));        // the micro-bump field
  add(PC.accent(rect(-11.9, d0, 11.9, d1, 40, 1), 1));
  for (var k2 = 0; k2 < 24; k2++) {
    add(PC.accent(vline(-11.6 + k2 * 1.0, d0 + 0.18, d1 - 0.18, 26, 1), 0.75));
  }
  add(PC.accent(hline(-11.9, 11.9, -13.85, 30, 1), 0.55));         // the bus behind it
  // the neighbouring die, cut off: its edge, its own interface and one row of tiles
  var nz1 = -D / 2 - 0.35, nz0 = nz1 - 2.3;
  add(fill(-W / 2, nz0, W / 2, nz1, 800, 0.08));
  add(rect(-W / 2, nz0, W / 2, nz1, 34, 0.55));
  add(PC.accent(fill(-11.9, nz1 - 1.85, 11.9, nz1, 1400, 1), 0.22));
  add(PC.accent(rect(-11.9, nz1 - 1.85, 11.9, nz1, 26, 1), 0.6));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [1.02, -0.32, 0],
    // colour: the die-to-die interface is a field of copper micro-bumps and the copper bus behind them
    accent: [176, 102, 44], accentDark: [224, 154, 92],
    caption: 'A GPU die laid out after Nvidia\'s published H100 block diagram, drawn at one whole reticle field, 26 by 33 mm. ' +
      '144 compute tiles sit in eight clusters, four above the L2 cache band and four below; ' +
      'twelve memory controllers and their HBM PHYs run down the two long edges; the PCI Express ' +
      'interface and the NVLink ports fill one short edge. H100 is a single die; the copper strip on the ' +
      'other short edge, and the sliver past it, stand for the die-to-die link that two-die designs such as Blackwell add.'
  };
});

})(window.PC);}catch(e){console.warn('specimen die-floorplan.js failed to load', e);}
/* euv-scanner.js */
try{(function(PC){
/* Specimen: an EUV lithography scanner, cut open on its optical plane.
 *
 * The drawing exists to show the light path, so the machine is sectioned at
 * z = 0 and everything behind the cut is kept. Reading order, bottom-left to
 * bottom-right: tin droplet -> plasma -> collector dish -> intermediate focus
 * -> three illuminator mirrors (two of them faceted) -> reticle held face-down
 * at the top -> six projection mirrors -> wafer on the stage.
 *
 * Units are metres. Real anchors: the collector is a ~660 mm ellipsoidal Mo/Si
 * mirror with a hole for the CO2 drive laser; the illuminator uses field-facet
 * and pupil-facet mirrors; the projection optics are six mirrors at NA 0.33;
 * the reticle is 152 mm square and prints a 26 x 33 mm field 4x reduced.
 * The reticle and the wafer are drawn about 2x oversize so the two ends of the
 * light path still read at this scale; everything else is near true ratio.
 *
 * Copper is reserved for one thing: the 13.5 nm light itself. The infrared
 * drive laser, the tin droplets and the optics are all ink.
 */
PC.register('euv-scanner', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function unit(v) { var L = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; return [v[0] / L, v[1] / L]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }

  /* ---------- helpers ---------- */

  // Concave dish facing +Y, vertex at the origin, rim at y = sag.
  function dish(r, sag, rIn, n, tn) {
    var Rc = (r * r + sag * sag) / (2 * sag);
    var c = PC.sphere({ r: Rc, thetaMax: Math.asin(Math.min(0.999, r / Rc)), n: n, tone: tn });
    c = PC.T(c, { scale: [1, -1, 1], pos: [0, Rc, 0] });
    if (rIn > 0) {
      var keep = [];
      for (var i = 0; i < c.length; i += 4) {
        if (c[i] * c[i] + c[i + 2] * c[i + 2] < rIn * rIn) continue;
        keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
      }
      c = new Float32Array(keep);
    }
    return c;
  }

  // Square facets tiled across a dish, clipped to its rim: the signature of the
  // field-facet and pupil-facet mirrors in the illuminator.
  function facets(r, sag, k) {
    var g = [], s = (r * 1.9) / k, pad = s * 0.16;
    for (var a = 0; a < k; a++) for (var b = 0; b < k; b++) {
      var cx = (a - (k - 1) / 2) * s, cz = (b - (k - 1) / 2) * s;
      var rr = Math.sqrt(cx * cx + cz * cz);
      if (rr > r * 0.86) continue;
      var y = sag * (rr / r) * (rr / r), q = s / 2 - pad;
      g.push(PC.T(PC.polyline({
        pts: [[cx - q, y, cz - q], [cx + q, y, cz - q], [cx + q, y, cz + q], [cx - q, y, cz + q]],
        closed: true, perUnit: 210, tone: 0.95
      }), {}));
    }
    return g.length ? PC.merge.apply(null, g) : null;
  }

  // A mirror blank at 2-D point q, its concave face pointing along the in-plane
  // normal nv. In section a mirror is nearly edge-on, so it is drawn as a solid
  // disc of Zerodur with a hollowed front face: a crescent, the way an optical
  // layout draws one.
  function mirror(q, nv, r, o) {
    o = o || {};
    var sag = o.sag == null ? r * 0.15 : o.sag;
    var th = Math.atan2(-nv[0], nv[1]), t = o.thick == null ? r * 0.22 : o.thick;
    var g = [dish(r, sag, o.rIn || 0, o.n || Math.round(2400 * r * r + 240), o.tone == null ? 0.6 : o.tone)];
    g.push(PC.T(PC.cylinder({ r: r, h: t, caps: false, n: Math.round(1400 * r * t + 60), tone: 0.2 }), { pos: [0, -t / 2, 0] }));
    g.push(PC.T(PC.disc({ r: r, rIn: o.rIn || 0, n: Math.round(1100 * r * r + 60), tone: 0.16 }), { pos: [0, -t, 0] }));
    g.push(PC.T(PC.circle({ r: r, perUnit: 175, tone: 1 }), { pos: [0, sag, 0] }));       // front rim
    g.push(PC.T(PC.circle({ r: r, perUnit: 110, tone: 0.5 }), { pos: [0, -t, 0] }));      // back rim
    if (o.rIn) g.push(PC.T(PC.circle({ r: o.rIn, perUnit: 260, tone: 1 }), { pos: [0, 0.004, 0] }));
    if (o.facets) { var f = facets(r, sag, o.facets); if (f) g.push(f); }
    return PC.T(PC.merge.apply(null, g), { rot: [0, 0, th], pos: [q[0], q[1], 0] });
  }

  // Rectangle standing in the XY plane (a vessel wall seen edge-on in section).
  function panel(w, h, cx, cy, cz, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: [Math.PI / 2, 0, 0], pos: [cx, cy, cz] });
  }
  // Keep only what is behind the cutting plane.
  function section(c, zCut) {
    var keep = [], z0 = zCut == null ? 0 : zCut;
    for (var i = 0; i < c.length; i += 4) { if (c[i + 2] > z0) continue; keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]); }
    return new Float32Array(keep);
  }
  // A vacuum vessel: wire frame, far wall, floor and ceiling.
  function vessel(w, h, d, cx, cy, wallN) {
    var g = [];
    g.push(PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: 200, tone: 0.9 }), { pos: [cx, cy, 0] }));
    g.push(panel(w, h, cx, cy, -d / 2, wallN, 0.13));
    g.push(PC.T(PC.plane({ w: w, d: d / 2, n: Math.round(wallN * 0.32), tone: 0.1 }), { pos: [cx, cy + h / 2, -d / 4] }));
    g.push(PC.T(PC.plane({ w: w, d: d / 2, n: Math.round(wallN * 0.32), tone: 0.1 }), { pos: [cx, cy - h / 2, -d / 4] }));
    return PC.merge.apply(null, g);
  }

  /* ---------- the optical train ---------- */

  var PLASMA = [-1.14, -1.34];
  var COLL = [-1.80, -1.34];              // collector vertex
  var CR = 0.56, CSAG = 0.28, CHOLE = 0.075;

  var NODE = [
    { p: [-0.56, -1.34], kind: 'ap', h: 0.045 },        // intermediate focus
    { p: [-0.24, -0.82], kind: 'm', r: 0.20 },          // illuminator: grazing fold
    { p: [-0.98, -0.10], kind: 'm', r: 0.30, fc: 7 },   // field facet mirror
    { p: [-0.26, 0.66], kind: 'm', r: 0.27, fc: 6 },    // pupil facet mirror
    { p: [0.06, 1.68], kind: 'ret', h: 0.13 },          // reticle, pattern down
    { p: [0.54, 1.02], kind: 'm', r: 0.29 },            // M1
    { p: [1.22, 0.60], kind: 'm', r: 0.23 },            // M2
    { p: [0.47, 0.20], kind: 'm', r: 0.21 },            // M3
    { p: [1.19, -0.18], kind: 'm', r: 0.25 },           // M4
    { p: [0.41, -0.58], kind: 'm', r: 0.19 },           // M5
    { p: [1.06, -0.98], kind: 'm', r: 0.38 },           // M6
    { p: [0.44, -1.74], kind: 'waf', h: 0.055 }         // wafer
  ];

  var i;
  for (i = 0; i < NODE.length; i++) {
    var q = NODE[i];
    if (q.kind === 'ret') q.nv = [0, -1];
    else if (q.kind === 'waf') q.nv = [0, 1];
    else if (i === 0) q.nv = unit(sub(NODE[1].p, q.p));
    else {
      var a = unit(sub(NODE[i - 1].p, q.p)), b = unit(sub(NODE[i + 1].p, q.p));
      q.nv = unit([a[0] + b[0], a[1] + b[1]]);
    }
    q.tv = [-q.nv[1], q.nv[0]];
    q.hw = q.r ? q.r * 0.56 : q.h;
  }
  for (i = 1; i < NODE.length; i++) {
    if (NODE[i].tv[0] * NODE[i - 1].tv[0] + NODE[i].tv[1] * NODE[i - 1].tv[1] < 0) NODE[i].tv = [-NODE[i].tv[0], -NODE[i].tv[1]];
  }

  /* ---------- vacuum vessels ---------- */

  add(vessel(1.52, 2.76, 1.15, -0.57, 0.10, 3000));                 // illuminator
  add(vessel(1.46, 3.14, 1.22, 0.92, -0.06, 3600));                 // projection optics box
  add(vessel(1.74, 0.48, 0.98, 0.10, 1.90, 1250));                  // reticle stage chamber
  // frame ribs across the POB so it reads as a stiff optical bench, not a crate
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.polyline({ pts: [[-0.73, 0, 0], [0.73, 0, 0]], perUnit: 210, tone: 0.55 }), { rot: [Math.PI / 2, 0, 0], pos: [0.92, i * 0.94, -0.61] }));
  }

  /* ---------- source vessel, collector, tin ---------- */

  var vesR = 0.66, vesX0 = -1.94, vesX1 = -0.72, vesC = (vesX0 + vesX1) / 2;
  add(section(PC.T(PC.cylinder({ r: vesR, h: vesX1 - vesX0, caps: false, n: 6200, tone: 0.26 }), { rot: [0, 0, -Math.PI / 2], pos: [vesC, PLASMA[1], 0] })));
  add(PC.T(PC.circle({ r: vesR, perUnit: 260, tone: 0.9 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0, PLASMA[1], 0] }));
  add(PC.T(PC.circle({ r: vesR, perUnit: 260, tone: 0.9 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1, PLASMA[1], 0] }));
  add(PC.T(PC.disc({ r: vesR, rIn: 0.14, n: 900, tone: 0.22 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 - 0.002, PLASMA[1], 0] }));
  for (i = 1; i <= 3; i++) {
    add(section(PC.T(PC.circle({ r: vesR * 1.025, perUnit: 210, tone: 0.5 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX0 + i * (vesX1 - vesX0) / 4, PLASMA[1], 0] })));
  }
  // cone down to the intermediate focus, where the source hands the light over
  add(section(PC.T(PC.cone({ r1: vesR, r2: 0.10, h: 0.30, n: 1500, tone: 0.3 }), { rot: [0, 0, -Math.PI / 2], pos: [vesX1 + 0.15, PLASMA[1], 0] })));
  add(PC.T(PC.circle({ r: 0.10, perUnit: 800, tone: 1 }), { rot: [0, 0, -Math.PI / 2], pos: [NODE[0].p[0], PLASMA[1], 0] }));

  add(mirror(COLL, [1, 0], CR, { sag: CSAG, rIn: CHOLE, n: 3200, tone: 0.4, mount: false }));
  // the plasma: one bright violet-white node at the collector's focus
  add(PC.accent2(PC.T(PC.sphere({ r: 0.036, n: 620 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 1));
  add(PC.accent2(PC.T(PC.sphere({ r: 0.085, n: 420 }), { pos: [PLASMA[0], PLASMA[1], 0] }), 0.3));
  // infrared drive laser, in ink: it is not the EUV
  add(PC.line({ a: [-2.14, PLASMA[1], 0], b: [PLASMA[0] - 0.04, PLASMA[1], 0], perUnit: 130, tone: 0.42 }));
  add(section(PC.T(PC.cylinder({ r: 0.09, h: 0.24, n: 700, tone: 0.4 }), { rot: [0, 0, -Math.PI / 2], pos: [-2.03, PLASMA[1], 0] })));
  add(PC.T(PC.boxEdges({ w: 0.26, h: 0.30, d: 0.30, perUnit: 240, tone: 0.85 }), { pos: [-2.02, PLASMA[1], 0] }));
  add(PC.T(PC.box({ w: 0.26, h: 0.30, d: 0.30, faces: ['nz', 'ny', 'nx'], n: 800, tone: 0.2 }), { pos: [-2.02, PLASMA[1], 0] }));
  // droplet generator above, tin catcher below: a stream of 30 um droplets
  add(section(PC.T(PC.cylinder({ r: 0.05, h: 0.30, n: 620, tone: 0.42 }), { pos: [PLASMA[0], PLASMA[1] + 0.72, 0] })));
  var drop = [];
  for (i = 0; i < 8; i++) drop.push(PC.T(PC.sphere({ r: 0.014, n: 46 }), { pos: [PLASMA[0], PLASMA[1] + 0.52 - i * 0.062, 0] }));
  add(PC.tone(PC.merge.apply(null, drop), 0.9));
  add(PC.T(PC.cone({ r1: 0.12, r2: 0.045, h: 0.18, n: 620, tone: 0.36 }), { pos: [PLASMA[0], PLASMA[1] - 0.52, 0] }));

  /* ---------- mirrors ---------- */

  for (i = 0; i < NODE.length; i++) {
    if (NODE[i].kind !== 'm') continue;
    add(mirror(NODE[i].p, NODE[i].nv, NODE[i].r, { facets: NODE[i].fc }));
  }

  /* ---------- reticle and reticle stage ---------- */

  var R = NODE[4].p, rw = 0.62, rd = 0.50;
  add(PC.T(PC.box({ w: rw, h: 0.05, d: rd, n: 1900, tone: 0.34 }), { pos: [R[0], R[1] + 0.023, 0] }));
  add(PC.T(PC.boxEdges({ w: rw, h: 0.05, d: rd, perUnit: 420, tone: 1 }), { pos: [R[0], R[1] + 0.023, 0] }));
  // the patterned field on the underside, 4x the printed 26 x 33 mm
  add(PC.T(PC.polyline({
    pts: [[-rw * 0.33, 0, -rd * 0.42], [rw * 0.33, 0, -rd * 0.42], [rw * 0.33, 0, rd * 0.42], [-rw * 0.33, 0, rd * 0.42]],
    closed: true, perUnit: 420, tone: 1
  }), { pos: [R[0], R[1] - 0.001, 0] }));
  // electrostatic chuck and the short-stroke stage above it
  add(PC.T(PC.box({ w: rw * 1.08, h: 0.085, d: rd * 1.08, faces: ['py', 'px', 'nx', 'nz'], n: 1100, tone: 0.24 }), { pos: [R[0], R[1] + 0.088, 0] }));
  add(PC.T(PC.boxEdges({ w: rw * 1.08, h: 0.085, d: rd * 1.08, perUnit: 260, tone: 0.95 }), { pos: [R[0], R[1] + 0.088, 0] }));
  // scan rails: the reticle runs four times faster than the wafer
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.62, h: 0.045, d: 0.055, n: 640, tone: 0.5 }), { pos: [R[0], R[1] + 0.155, i * 0.32] }));
    add(PC.T(PC.line({ a: [-0.81, 0, 0], b: [0.81, 0, 0], perUnit: 230, tone: 0.9 }), { pos: [R[0], R[1] + 0.179, i * 0.32] }));
  }

  /* ---------- wafer stage (TWINSCAN: expose here, measure alongside) ---------- */

  var W = NODE[11].p, wafR = 0.235, wafDx = 0.78;
  function chuck(cx, exposed) {
    var g = [];
    g.push(PC.T(PC.disc({ r: wafR, n: 700, tone: 0.2 }), { pos: [cx, W[1], 0] }));
    g.push(PC.T(PC.circle({ r: wafR, perUnit: 260, tone: 1 }), { pos: [cx, W[1] + 0.002, 0] }));
    g.push(PC.T(PC.circle({ r: wafR * 0.66, perUnit: 190, tone: 0.45 }), { pos: [cx, W[1] + 0.003, 0] }));
    g.push(PC.T(PC.cylinder({ r: wafR * 1.08, h: 0.075, n: 700, tone: 0.16 }), { pos: [cx, W[1] - 0.042, 0] }));
    g.push(PC.T(PC.circle({ r: wafR * 1.08, perUnit: 150, tone: 0.7 }), { pos: [cx, W[1] - 0.079, 0] }));
    if (exposed) g.push(PC.T(PC.accent(PC.plane({ w: 0.082, d: 0.066, n: 900 }), 1), { pos: [cx, W[1] + 0.006, 0] }));
    return PC.merge.apply(null, g);
  }
  add(chuck(W[0], true));
  add(chuck(W[0] + wafDx, false));
  // stage bridge, rails and granite base
  add(PC.T(PC.box({ w: 1.66, h: 0.10, d: 0.66, faces: ['py', 'px', 'nx', 'nz'], n: 1500, tone: 0.22 }), { pos: [W[0] + wafDx / 2, W[1] - 0.135, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.66, h: 0.10, d: 0.66, perUnit: 170, tone: 0.9 }), { pos: [W[0] + wafDx / 2, W[1] - 0.135, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.86, h: 0.04, d: 0.06, n: 420, tone: 0.42 }), { pos: [W[0] + wafDx / 2, W[1] - 0.208, i * 0.24] }));
    add(PC.T(PC.line({ a: [-0.93, 0, 0], b: [0.93, 0, 0], perUnit: 190, tone: 0.85 }), { pos: [W[0] + wafDx / 2, W[1] - 0.188, i * 0.24] }));
  }

  /* ---------- base frame ---------- */

  var bw = 3.66, bx = -0.16, by = -2.16;
  add(PC.T(PC.box({ w: bw, h: 0.20, d: 1.36, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 4200, tone: 0.24 }), { pos: [bx, by, 0] }));
  add(PC.T(PC.boxEdges({ w: bw, h: 0.20, d: 1.36, perUnit: 190, tone: 0.9 }), { pos: [bx, by, 0] }));
  for (i = 0; i < 4; i++) {
    var lx = bx - bw / 2 + 0.36 + i * (bw - 0.72) / 3;
    add(PC.T(PC.cylinder({ r: 0.085, h: 0.24, n: 400, tone: 0.4 }), { pos: [lx, by - 0.22, 0.50] }));
    add(PC.T(PC.cylinder({ r: 0.085, h: 0.24, n: 400, tone: 0.4 }), { pos: [lx, by - 0.22, -0.50] }));
  }
  // turbopumps slung under the two big vessels
  var pumpAt = [[-0.57, -1.52], [0.92, -1.80]];
  for (i = 0; i < pumpAt.length; i++) {
    add(PC.T(PC.cylinder({ r: 0.145, h: 0.26, n: 900, tone: 0.3 }), { pos: [pumpAt[i][0], pumpAt[i][1], -0.44] }));
    add(PC.T(PC.circle({ r: 0.175, perUnit: 260, tone: 0.85 }), { pos: [pumpAt[i][0], pumpAt[i][1] + 0.13, -0.44] }));
    add(PC.T(PC.circle({ r: 0.145, perUnit: 220, tone: 0.65 }), { pos: [pumpAt[i][0], pumpAt[i][1] - 0.13, -0.44] }));
  }

  /* ---------- the 13.5 nm light ---------- */

  var beam = [], glow = [];
  for (i = 0; i < NODE.length - 1; i++) {
    var A = NODE[i], B = NODE[i + 1];
    for (var s = -1; s <= 1; s += 2) for (var zs = -1; zs <= 1; zs += 2) {
      beam.push(PC.accent(PC.line({
        a: [A.p[0] + A.tv[0] * A.hw * s, A.p[1] + A.tv[1] * A.hw * s, zs * A.hw * 0.55],
        b: [B.p[0] + B.tv[0] * B.hw * s, B.p[1] + B.tv[1] * B.hw * s, zs * B.hw * 0.55],
        perUnit: 170
      }), 0.55));
    }
    beam.push(PC.accent(PC.line({ a: [A.p[0], A.p[1], 0], b: [B.p[0], B.p[1], 0], perUnit: 150 }), 0.8));
    var LL = Math.sqrt((B.p[0] - A.p[0]) * (B.p[0] - A.p[0]) + (B.p[1] - A.p[1]) * (B.p[1] - A.p[1]));
    var nf = Math.max(60, Math.round(LL * 900)), fill = new Float32Array(nf * 4);
    for (var t = 0; t < nf; t++) {
      var tt = PC.rnd(), ss = PC.rnd() * 2 - 1, zz = PC.rnd() * 2 - 1;
      var hx = A.tv[0] * A.hw * (1 - tt) + B.tv[0] * B.hw * tt, hy = A.tv[1] * A.hw * (1 - tt) + B.tv[1] * B.hw * tt;
      fill[t * 4] = A.p[0] + (B.p[0] - A.p[0]) * tt + hx * ss;
      fill[t * 4 + 1] = A.p[1] + (B.p[1] - A.p[1]) * tt + hy * ss;
      fill[t * 4 + 2] = (A.hw * (1 - tt) + B.hw * tt) * 0.55 * zz;
      fill[t * 4 + 3] = 2.2;
    }
    glow.push(fill);
  }
  // the collector's job: catch light over a huge solid angle and squeeze it
  // through the intermediate focus
  for (i = 0; i < 12; i++) {
    var ph = i * Math.PI * 2 / 12 + 0.2;
    for (var kk = 0; kk < 2; kk++) {
      var rr = kk ? 0.50 : 0.27;
      var pt = [COLL[0] + CSAG * (rr / CR) * (rr / CR), COLL[1] + rr * Math.cos(ph), rr * Math.sin(ph)];
      beam.push(PC.accent(PC.line({ a: [PLASMA[0], PLASMA[1], 0], b: pt, perUnit: 150 }), 0.42));
      beam.push(PC.accent(PC.line({ a: pt, b: [NODE[0].p[0], NODE[0].p[1], 0], perUnit: 150 }), 0.42));
    }
  }
  add(PC.merge.apply(null, glow));
  add(PC.merge.apply(null, beam));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.16, -0.38, 0],
    // colour: 13.5 nm light is invisible; the drawing convention for an EUV beam is a pale blue-violet, the short-wave end of what the eye can see
    accent: [107, 127, 209], accentDark: [167, 180, 245],
    // colour: the tin plasma at the source glows violet-white to the eye, from its visible tin lines
    accent2: [154, 126, 224], accent2Dark: [220, 208, 255],
    caption: 'An EUV scanner cut open on its optical plane. A tin droplet is flashed into plasma at the focus of the collector dish (bottom left); the 13.5 nm light, in blue-violet, squeezes through the intermediate focus, folds off three illuminator mirrors, strikes the reticle held pattern-down at the top, and zigzags through six projection mirrors onto the wafer. Reticle and wafer are drawn about twice oversize.'
  };
});

})(window.PC);}catch(e){console.warn('specimen euv-scanner.js failed to load', e);}
/* foup.js */
try{(function(PC){
/* Specimen: a FOUP, the front-opening unified pod that wafers travel in.
 *
 * Units are millimetres, at the dimensions of a real 300 mm pod (Entegris A300
 * class, to SEMI E47.1): 388 wide, 342 deep, 332 tall without the handles, and
 * 420 wide with them. Twenty-five slots at 10 mm pitch, the first wafer 44 mm
 * above the base datum, so the stack of wafers is 240 mm of the 332.
 *
 * The proportion that matters and that drawings usually get wrong: a 300 mm
 * wafer is 300 of the 342 mm of depth. The box is barely bigger than what it
 * carries. Everything else about it - the moulded shell, the robotic flange on
 * the roof, the two hand grips, the three kinematic pads underneath, the door
 * with its two latch keys - exists to move that stack between tools without
 * letting fab air touch it. A FOUP is not a box with wafers in it. It is the
 * cleanroom, and the fab around it is only the corridor.
 *
 * The shell is drawn translucent, as the real polycarbonate is, so the stack
 * reads through it. One wafer is picked out in copper.
 */
PC.register('foup', function (p) {
  var W = 388, D = 342, H = 332;                 // shell, door on +Z
  var rW = 150, slots = 25, pitch = 10, y1 = 44; // 300 mm wafers, 25 at 10 mm
  var accentSlot = 13;
  var parts = [];
  function add(c) { parts.push(c); }

  // ---------- helpers ----------
  function roundRect(w, d, r, seg) {
    var pts = [], i, k, cx, cz, a0;
    var corners = [[w / 2 - r, d / 2 - r, 0], [-(w / 2 - r), d / 2 - r, Math.PI / 2],
                   [-(w / 2 - r), -(d / 2 - r), Math.PI], [w / 2 - r, -(d / 2 - r), 3 * Math.PI / 2]];
    for (i = 0; i < 4; i++) {
      cx = corners[i][0]; cz = corners[i][1]; a0 = corners[i][2];
      for (k = 0; k <= seg; k++) {
        var a = a0 + k * (Math.PI / 2) / seg;
        pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
      }
    }
    return pts;
  }
  function ring(shape, y, per, tn) {
    return PC.polyline({ pts: shape.map(function (q) { return [q[0], y, q[1]]; }), closed: true, perUnit: per, tone: tn });
  }
  function cut(c, drop) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) if (!drop(c[i], c[i + 1], c[i + 2])) keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    return new Float32Array(keep);
  }
  function boxAt(w, h, d, pos, n, tn, faces) {
    return PC.T(PC.box({ w: w, h: h, d: d, n: n, tone: tn, faces: faces }), { pos: pos });
  }
  function edgesAt(w, h, d, pos, per, tn) {
    return PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: per, tone: tn }), { pos: pos });
  }
  // a rectangle in the XY plane at constant z
  function faceZ(w, h, pos, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: [Math.PI / 2, 0, 0], pos: pos });
  }
  function rectZ(w, h, pos, per, tn) {          // pts are already in the XY plane, so no rotation
    return PC.T(PC.polyline({
      pts: [[-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0], [-w / 2, h / 2, 0]],
      closed: true, perUnit: per, tone: tn
    }), { pos: pos });
  }

  // ---------- the moulded shell, front face left open for the door ----------
  var shape = roundRect(0.388, 0.342, 0.045, 4);
  var walls = PC.T(PC.accent2(PC.extrude({ shape: shape, h: 0.332, caps: false }), 0.14),
    { scale: 1000, pos: [0, H / 2, 0] });
  add(cut(walls, function (x, y, z) { return z > 145 && Math.abs(x) < 152; }));
  var shape2 = shape.map(function (q) { return [q[0] * 1000, q[1] * 1000]; });
  add(ring(shape2, 0.5, 2.6, 0.95));
  add(ring(shape2, H - 0.5, 2.6, 0.95));
  shape2.forEach(function (q, i) {                                  // the four corner posts
    if (i % 5 !== 2) return;
    add(PC.line({ a: [q[0], 1, q[1]], b: [q[0], H - 1, q[1]], perUnit: 2.6, tone: 0.9 }));
  });
  add(PC.T(PC.accent2(PC.plane({ w: W - 26, d: D - 26, n: 2400 }), 0.2), { pos: [0, H, 0] }));  // roof
  // ribs across the roof, as the moulding has
  for (var r = -3; r <= 3; r++) add(PC.line({ a: [-W / 2 + 22, H + 1, r * 44], b: [W / 2 - 22, H + 1, r * 44], perUnit: 2.2, tone: 0.42 }));

  // ---------- base plate and the three kinematic pads it sits on ----------
  add(boxAt(W + 14, 20, D + 14, [0, -10, 0], 4200, 0.14));
  add(edgesAt(W + 14, 20, D + 14, [0, -10, 0], 2.4, 0.9));
  for (var k = 0; k < 3; k++) {
    var a = k * Math.PI * 2 / 3 + Math.PI / 2, Rk = 110;
    add(PC.line({
      a: [Math.cos(a) * (Rk - 34), -21, Math.sin(a) * (Rk - 34)],
      b: [Math.cos(a) * (Rk + 34), -21, Math.sin(a) * (Rk + 34)], perUnit: 3.5, tone: 0.95
    }));
  }

  // ---------- 25 wafers on their slot teeth ----------
  for (var i = 0; i < slots; i++) {
    var y = y1 + i * pitch, isAcc = (i === accentSlot);
    var disc = PC.disc({ r: rW, n: isAcc ? 3400 : 380, tone: isAcc ? 0.5 : 0.14 });
    var rim = PC.circle({ r: rW, perUnit: isAcc ? 2.2 : 0.9, tone: isAcc ? 1 : 0.82 });
    add(PC.T(isAcc ? PC.accent(disc, 0.5) : disc, { pos: [0, y, 0] }));
    add(PC.T(isAcc ? PC.accent(rim, 1) : rim, { pos: [0, y, 0] }));
    // the comb of teeth the wafer rests on, moulded into both side walls
    [1, -1].forEach(function (s) {
      add(PC.line({ a: [s * 178, y - 3.4, -158], b: [s * 178, y - 3.4, 156], perUnit: 0.8, tone: 0.34 }));
      add(PC.line({ a: [s * 178, y - 3.4, 120], b: [s * 152, y - 3.4, 150], perUnit: 1.4, tone: 0.5 }));
    });
  }

  // ---------- the door: the part that makes it a cleanroom ----------
  var dz = D / 2 + 7, dW = 344, dH = 300, dy = H / 2 - 4;
  add(PC.accent2(faceZ(dW, dH, [0, dy, dz], 5600, 0.26), 0.3));
  add(rectZ(dW, dH, [0, dy, dz + 0.5], 2.8, 1));
  add(rectZ(dW - 40, dH - 40, [0, dy, dz + 0.5], 2.0, 0.5));
  [-1, 1].forEach(function (s) {                                     // the moulded ribs on the panel
    add(PC.line({ a: [-dW / 2 + 26, dy + s * 62, dz + 0.6], b: [dW / 2 - 26, dy + s * 62, dz + 0.6], perUnit: 2.0, tone: 0.42 }));
  });
  add(PC.T(PC.box({ w: dW, h: dH, d: 14, faces: ['py', 'ny', 'px', 'nx'], n: 1500, tone: 0.3 }),
    { pos: [0, dy, dz - 7] }));
  [-1, 1].forEach(function (s) {                                     // the two latch key ports
    add(rectZ(16, 40, [s * 132, dy, dz + 1], 5, 1));
    add(faceZ(16, 40, [s * 132, dy, dz + 0.6], 220, 0.55));
  });
  [-1, 1].forEach(function (s) {                                     // registration bosses
    add(PC.T(PC.circle({ r: 17, perUnit: 4 }), { rot: [Math.PI / 2, 0, 0], pos: [0, dy + s * 118, dz + 1] }));
    add(PC.T(PC.circle({ r: 8, perUnit: 4, tone: 0.6 }), { rot: [Math.PI / 2, 0, 0], pos: [0, dy + s * 118, dz + 1] }));
  });

  // ---------- robotic flange on the roof ----------
  add(boxAt(150, 30, 150, [0, H + 15, 0], 2200, 0.18, ['px', 'nx', 'pz', 'nz']));
  add(edgesAt(150, 30, 150, [0, H + 15, 0], 2.6, 0.8));
  add(boxAt(178, 14, 178, [0, H + 37, 0], 2600, 0.24));
  add(edgesAt(178, 14, 178, [0, H + 37, 0], 3.2, 1));
  add(PC.T(PC.circle({ r: 34, perUnit: 4.5, tone: 1 }), { pos: [0, H + 44.5, 0] }));
  add(PC.T(PC.circle({ r: 22, perUnit: 3.5, tone: 0.7 }), { pos: [0, H + 44.5, 0] }));
  add(PC.T(PC.disc({ r: 34, n: 700, tone: 0.2 }), { pos: [0, H + 44.2, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {        // the four bolt pads
    add(PC.T(PC.circle({ r: 8, perUnit: 4, tone: 0.75 }), { pos: [q[0] * 70, H + 44.5, q[1] * 70] }));
  });

  // ---------- the two hand grips, which take the pod out to 420 mm wide ----------
  [1, -1].forEach(function (s) {
    [246, 96].forEach(function (ay) {                                // arms
      add(boxAt(28, 30, 52, [s * (W / 2 + 14), ay, -10], 700, 0.2));
      add(edgesAt(28, 30, 52, [s * (W / 2 + 14), ay, -10], 2.6, 0.85));
    });
    add(boxAt(20, 180, 44, [s * (W / 2 + 22), 171, -10], 1500, 0.2)); // grip
    add(edgesAt(20, 180, 44, [s * (W / 2 + 22), 171, -10], 2.6, 0.9));
    for (var g = 0; g < 7; g++) {                                     // finger ribs
      add(PC.line({
        a: [s * (W / 2 + 32), 100 + g * 24, -30], b: [s * (W / 2 + 32), 100 + g * 24, 10],
        perUnit: 2.4, tone: 0.55
      }));
    }
  });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.24, -0.72, 0],
    // colour: the picked-out wafer is polished silicon, a mirror that reads as cool silver
    accent: [111, 139, 166], accentDark: [195, 211, 226],
    // colour: the shell, roof and door are translucent polycarbonate, a grey-blue haze in life
    accent2: [142, 162, 184], accent2Dark: [169, 188, 207],
    caption: 'A FOUP: 388 by 342 by 332 mm, carrying twenty-five 300 mm wafers on moulded teeth ' +
      '10 mm apart. The shell is drawn translucent, as the real polycarbonate is. On the roof is ' +
      'the flange an overhead robot grips; on the front, the door with its two latch-key ports, ' +
      'which is the only way in. The box is barely wider than the wafer it carries, and the ' +
      'clean air is for the wafers inside it. One wafer is picked out in silver.'
  };
});

})(window.PC);}catch(e){console.warn('specimen foup.js failed to load', e);}
/* gaa-transistor.js */
try{(function(PC){
/* Specimen: a gate-all-around nanosheet transistor.
 *
 * Units are nanometres, and the dimensions are the ones the 2 nm-class nodes
 * actually use (imec, TSMC N2, Samsung SF2):
 *   sheet thickness 6 nm, sheet width 30 nm, sheet length 28 nm;
 *   three sheets, 10 nm of gate metal in each gap;
 *   gate length 15 nm, inner spacers 5 nm at each end of every gap,
 *   and a 48 nm contacted gate pitch, so the device repeats every 48 nm.
 * The sheet is five times wider than it is thick, which is the ratio that
 * matters: a nanosheet is a ribbon, not a wire.
 *
 * The gate is the copper part, and it is drawn as a cage rather than a solid
 * so you can see what "all around" means: the metal fills the gap under each
 * sheet, over each sheet and around both edges, so the channel is gripped on
 * four sides instead of three. That wrap is what stops a 15 nm channel leaking
 * when the gate says off, and building it takes about a thousand ordered
 * process steps that three companies in the world can run.
 *
 * Ink: the three silicon sheets, the source and drain epitaxy at the ends, the
 * inner spacers that keep the gate from touching that epitaxy, the isolation
 * below, and the contacts landing on top.
 */
PC.register('gaa-transistor', function (p) {
  var sT = 6, sW = 30, sL = 28;                 // sheet thickness, width, length
  var gapY = 10, Lg = 15, sp = 5;               // sheet gap, gate length, spacer
  var y0 = [0, sT + gapY, 2 * (sT + gapY)];     // sheet bottoms: 0, 16, 32
  var yStackTop = y0[2] + sT;                   // 38
  var gX = Lg / 2, spX = gX + sp;               // gate +/-7.5, spacer out to +/-12.5
  var gY0 = -11, gY1 = 45, gZ = sW / 2 + 4;     // gate box, 4 nm proud of the sheet edges
  var epiX0 = spX, epiX1 = 24, epiZ = 17;   // gate centre to epi edge is 24 nm: a 48 nm contacted gate pitch
  var parts = [];
  function add(c) { parts.push(c); }
  function acc(c, a) { return PC.accent(c, a); }

  // a rectangle lying in the XY plane at constant z
  function faceZ(x0, yA, x1, yB, z, n, tn) {
    return PC.T(PC.plane({ w: x1 - x0, d: yB - yA, n: n, tone: tn }),
      { rot: [Math.PI / 2, 0, 0], pos: [(x0 + x1) / 2, (yA + yB) / 2, z] });
  }
  function boxAt(x0, yA, z0, x1, yB, z1, o) {
    return PC.T(PC.box({ w: x1 - x0, h: yB - yA, d: z1 - z0, n: o.n, tone: o.tone, faces: o.faces }),
      { pos: [(x0 + x1) / 2, (yA + yB) / 2, (z0 + z1) / 2] });
  }
  function edgesAt(x0, yA, z0, x1, yB, z1, per, tn) {
    return PC.T(PC.boxEdges({ w: x1 - x0, h: yB - yA, d: z1 - z0, perUnit: per, tone: tn }),
      { pos: [(x0 + x1) / 2, (yA + yB) / 2, (z0 + z1) / 2] });
  }

  // ---------- substrate and the isolation the stack sits on ----------
  add(boxAt(-30, -23, -25, 30, -16, 25, { n: 1600, tone: 0.09 }));
  add(edgesAt(-30, -23, -25, 30, -16, 25, 5, 0.45));
  add(boxAt(-27, -16, -22, 27, -11, 22, { n: 800, tone: 0.16 }));       // bottom dielectric isolation
  add(edgesAt(-27, -16, -22, 27, -11, 22, 6, 0.6));

  // ---------- the three silicon nanosheets ----------
  y0.forEach(function (yb) {
    add(boxAt(-sL / 2, yb, -sW / 2, sL / 2, yb + sT, sW / 2,
      { n: 4400, tone: 0.30, faces: ['py', 'pz', 'nz', 'px', 'nx'] }));
    add(edgesAt(-sL / 2, yb, -sW / 2, sL / 2, yb + sT, sW / 2, 15, 0.95));
    for (var q = -1; q <= 1; q++) {
      add(PC.line({ a: [-sL / 2, yb + sT, q * 8], b: [sL / 2, yb + sT, q * 8], perUnit: 7, tone: 0.45 }));
    }
  });

  // ---------- the gate: a cage of metal wrapping every sheet on four sides ----------
  // the metal that fills each gap, drawn on the two faces you can see it through
  var bands = [[gY0, y0[0]], [y0[0] + sT, y0[1]], [y0[1] + sT, y0[2]], [yStackTop, gY1]];
  bands.forEach(function (b) {
    [-1, 1].forEach(function (s) { add(acc(faceZ(-gX, b[0], gX, b[1], s * gZ, 520, 1), 0.40)); });
    [-1, 1].forEach(function (s) {                                     // and the same gap, seen end on
      add(acc(PC.T(PC.plane({ w: b[1] - b[0], d: 2 * gZ, n: 260, tone: 1 }),
        { rot: [0, 0, Math.PI / 2], pos: [s * gX, (b[0] + b[1]) / 2, 0] }), 0.22));
    });
    add(acc(edgesAt(-gX, b[0], -gZ, gX, b[1], gZ, 6, 1), 0.7));
  });
  add(acc(boxAt(-gX, gY0, -gZ, gX, gY1, gZ, { n: 420, tone: 1, faces: ['py'] }), 0.24));
  add(acc(edgesAt(-gX, gY0, -gZ, gX, gY1, gZ, 15, 1), 1));
  // the metal that runs around the sheet edges: two thin walls just outside them
  [-1, 1].forEach(function (s) {
    add(acc(faceZ(-gX, y0[0], gX, yStackTop, s * (sW / 2 + 1.2), 340, 1), 0.34));
  });

  // ---------- inner spacers: they stop the gate touching the source and drain ----------
  [-1, 1].forEach(function (s) {
    [[y0[0] + sT, y0[1]], [y0[1] + sT, y0[2]]].forEach(function (b) {
      var a = s > 0 ? gX : -spX, c = s > 0 ? spX : -gX;
      add(boxAt(a, b[0], -sW / 2, c, b[1], sW / 2, { n: 420, tone: 0.34 }));
      add(edgesAt(a, b[0], -sW / 2, c, b[1], sW / 2, 8, 0.9));
    });
  });

  // ---------- source and drain epitaxy: faceted blocks grown off the sheet ends ----------
  var shape = [[0.125, -0.130], [0.163, -0.170], [0.202, -0.170], [0.240, -0.130],
               [0.240, 0.130], [0.202, 0.170], [0.163, 0.170], [0.125, 0.130]];
  [-1, 1].forEach(function (s) {
    var epi = PC.thin(PC.extrude({ shape: shape, h: 0.42, tone: 0.20 }), 0.46);
    add(PC.T(epi, { scale: [s * 100, 100, 100], pos: [0, 19, 0] }));
    var ring = shape.map(function (q) { return [s * q[0] * 100, 0, q[1] * 100]; });
    [-2, 40].forEach(function (yy) {
      add(PC.T(PC.polyline({ pts: ring, closed: true, perUnit: 8, tone: 0.75 }), { pos: [0, yy, 0] }));
    });
    ring.forEach(function (q, qi) { add(PC.line({ a: [q[0], -2, q[2]], b: [q[0], 40, q[2]], perUnit: 7, tone: (qi % 2) ? 0.22 : 0.55 })); });
  });

  // ---------- contacts landing on the source, the drain and the gate ----------
  [-1, 1].forEach(function (s) {
    var a = s > 0 ? 14.5 : -23, c = s > 0 ? 23 : -14.5;
    add(boxAt(a, 40, -10, c, 48, 10, { n: 520, tone: 0.18, faces: ['py', 'px', 'nx', 'pz', 'nz'] }));
    add(edgesAt(a, 40, -10, c, 48, 10, 8, 0.8));
  });
  add(boxAt(-5, gY1, -8, 5, 51, 8, { n: 520, tone: 0.18, faces: ['py', 'px', 'nx', 'pz', 'nz'] }));
  add(edgesAt(-5, gY1, -8, 5, 51, 8, 8, 0.8));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.52, -0.76, 0],
    // colour: the gate that wraps each sheet is titanium nitride work-function metal, which in bulk is gold-bronze, around a tungsten fill
    accent: [165, 130, 42], accentDark: [216, 181, 86],
    caption: 'A gate-all-around nanosheet transistor, drawn at the dimensions a 2 nm-class node ' +
      'uses: three silicon sheets 6 nm thick and 30 nm wide, stacked 10 nm apart, running from the ' +
      'source epitaxy on one side to the drain epitaxy on the other. The gold cage is the gate. ' +
      'It fills the gap under each sheet, over each sheet and around both edges, so the channel is ' +
      'gripped on four sides; the small blocks at the ends of each gap are the inner spacers that ' +
      'keep that metal off the epitaxy. Contacts land on top.'
  };
});

})(window.PC);}catch(e){console.warn('specimen gaa-transistor.js failed to load', e);}
/* gas-cabinet.js */
try{(function(PC){
/* Specimen: specialty gas supply. Units are metres.
 *
 * Left, the hero: a three-cylinder gas cabinet with its door off. Real
 * dimensions, from a supplier's catalogue: 38 in wide, 19 in deep, 76 in tall
 * (0.97 x 0.48 x 1.93 m), with a 6-8 in exhaust collar on top, holding
 * cylinders about 9 in across. Inside: restraint bars, coiled pigtails, and
 * the gas panel on the back wall - regulator, double block and bleed, purge
 * and vent legs, gauges - with the process line leaving through the side wall
 * by way of a point-of-use filter. That panel is the copper.
 *
 * Right, set back: a vertical bulk liquid cylinder. The brief called for a
 * horizontal dewar on legs, but a horizontal drum is a wide blank mass that
 * doubles the width of a portrait drawing and dwarfs the cabinet; the upright
 * liquid cylinder is what actually stands in a fab gas bay, and it keeps the
 * composition tall.
 */
PC.register('gas-cabinet', function (p) {
  var parts = [], i, x;
  function add() { for (var k = 0; k < arguments.length; k++) if (arguments[k]) parts.push(arguments[k]); }
  function at(c, px, py, pz, rot) { return PC.T(c, { pos: [px, py, pz], rot: rot }); }
  function dial(r, per, t, px, py, pz) {          // a gauge face looking out at +Z
    return PC.T(PC.circle({ r: r, perUnit: per, tone: t }), { rot: [Math.PI / 2, 0, 0], pos: [px, py, pz] });
  }

  var CBX = -0.30;                                 // cabinet centre on X
  var CW = 0.97, CD = 0.48, CPL = 0.12, CTOP = 1.93;
  var CH = CTOP - CPL, CY = (CPL + CTOP) / 2;

  /* ================= the cabinet ================= */

  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nz'], n: 7000, tone: 0.16 }), CBX, CY, 0));   // inside the back
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['nx'], n: 3000, tone: 0.15 }), CBX, CY, 0));   // inside the far side
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['px'], n: 5200, tone: 0.26 }), CBX, CY, 0));   // outside the near side
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['py'], n: 2000, tone: 0.44 }), CBX, CY, 0));
  add(at(PC.box({ w: CW, h: CH, d: CD, faces: ['ny'], n: 2600, tone: 0.40 }), CBX, CY, 0));
  add(at(PC.boxEdges({ w: CW, h: CH, d: CD, perUnit: 240, tone: 0.95 }), CBX, CY, 0));
  // louvred inlet grille low on the near side wall
  add(at(PC.polyline({ pts: [[0, -0.17, -0.15], [0, -0.17, 0.15], [0, 0.17, 0.15], [0, 0.17, -0.15]], closed: true, perUnit: 260, tone: 1 }),
        CBX + CW / 2 + 0.003, CPL + 0.34, 0));
  for (i = 0; i < 5; i++) {
    add(PC.line({ a: [CBX + CW / 2 + 0.003, CPL + 0.22 + i * 0.055, -0.13], b: [CBX + CW / 2 + 0.003, CPL + 0.22 + i * 0.055, 0.13], perUnit: 260, tone: 0.8 }));
  }
  // door frame return around the open front, hinges and latch
  add(at(PC.polyline({
    pts: [[-CW / 2 + 0.055, -CH / 2 + 0.04, 0], [CW / 2 - 0.055, -CH / 2 + 0.04, 0],
          [CW / 2 - 0.055, CH / 2 - 0.04, 0], [-CW / 2 + 0.055, CH / 2 - 0.04, 0]],
    closed: true, perUnit: 240, tone: 0.9
  }), CBX, CY, CD / 2 - 0.010));
  for (i = 0; i < 3; i++) {
    add(at(PC.box({ w: 0.045, h: 0.09, d: 0.045, n: 190, tone: 0.6 }), CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045));
    add(at(PC.boxEdges({ w: 0.045, h: 0.09, d: 0.045, perUnit: 300, tone: 1 }), CBX + CW / 2 + 0.018, CPL + 0.28 + i * 0.63, CD / 2 - 0.045));
  }
  // plinth
  add(at(PC.box({ w: CW, h: CPL, d: CD, faces: ['px', 'nx', 'pz', 'nz'], n: 1600, tone: 0.42 }), CBX, CPL / 2, 0));
  add(at(PC.boxEdges({ w: CW, h: CPL, d: CD, perUnit: 260, tone: 0.95 }), CBX, CPL / 2, 0));
  // exhaust plenum and the 8 in collar that takes the cabinet to the scrubber
  add(at(PC.box({ w: 0.66, h: 0.17, d: 0.40, n: 2400, tone: 0.42 }), CBX, CTOP + 0.085, -0.02));
  add(at(PC.boxEdges({ w: 0.66, h: 0.17, d: 0.40, perUnit: 280, tone: 1 }), CBX, CTOP + 0.085, -0.02));
  add(at(PC.cylinder({ r: 0.102, h: 0.40, caps: false, n: 2000, tone: 0.44 }), CBX, CTOP + 0.37, -0.02));
  add(at(PC.circle({ r: 0.102, perUnit: 320, tone: 1 }), CBX, CTOP + 0.57, -0.02));
  add(at(PC.torus({ R: 0.122, r: 0.016, n: 620, tone: 0.7 }), CBX, CTOP + 0.20, -0.02));
  // sprinkler head under the cabinet roof
  add(at(PC.cylinder({ r: 0.016, h: 0.055, caps: false, n: 160, tone: 0.6 }), CBX + 0.20, CTOP - 0.055, -0.05));
  add(at(PC.circle({ r: 0.030, perUnit: 340, tone: 0.85 }), CBX + 0.20, CTOP - 0.082, -0.05));
  // two restraint bars across the bottles
  [0.58, 1.04].forEach(function (by) {
    add(at(PC.box({ w: CW - 0.13, h: 0.038, d: 0.038, n: 340, tone: 0.55 }), CBX, by, 0.045));
    add(at(PC.boxEdges({ w: CW - 0.13, h: 0.038, d: 0.038, perUnit: 280, tone: 1 }), CBX, by, 0.045));
  });

  /* ================= three cylinders ================= */

  var cylX = [-0.29, 0.0, 0.29], cylH = [1.16, 1.16, 0.98], CR = 0.114, cz = -0.055;
  var valveTop = [];
  for (i = 0; i < 3; i++) {
    x = CBX + cylX[i];
    var b0 = CPL, b1 = CPL + cylH[i], sh = b1 + 0.11;
    add(at(PC.cylinder({ r: CR, h: cylH[i], caps: false, n: 5200, tone: 0.5 }), x, (b0 + b1) / 2, cz));
    add(at(PC.cone({ r1: CR, r2: 0.034, h: 0.11, n: 900, tone: 0.46 }), x, b1 + 0.055, cz));
    add(at(PC.circle({ r: CR * 1.004, perUnit: 300, tone: 1 }), x, b1, cz));                  // shoulder
    add(at(PC.circle({ r: CR * 1.004, perUnit: 220, tone: 0.75 }), x, b1 - 0.085, cz));       // painted band
    add(at(PC.circle({ r: CR * 1.004, perUnit: 220, tone: 0.75 }), x, b1 - 0.135, cz));
    add(at(PC.polyline({ pts: [[-0.045, -0.055, 0], [0.045, -0.055, 0], [0.045, 0.055, 0], [-0.045, 0.055, 0]], closed: true, perUnit: 260, tone: 0.85 }),
          x, b0 + 0.66, cz + CR * 1.01));                                                     // label
    add(at(PC.circle({ r: CR * 1.004, perUnit: 200, tone: 0.5 }), x, b0 + 0.02, cz));         // foot ring
    // neck ring, valve body, handwheel
    add(at(PC.torus({ R: 0.045, r: 0.011, n: 300, tone: 0.6 }), x, sh + 0.005, cz));
    add(at(PC.box({ w: 0.058, h: 0.078, d: 0.058, n: 260, tone: 0.5 }), x, sh + 0.058, cz));
    add(at(PC.boxEdges({ w: 0.058, h: 0.078, d: 0.058, perUnit: 300, tone: 1 }), x, sh + 0.058, cz));
    valveTop.push([x, sh + 0.100, cz]);
  }

  /* ================= the gas panel (copper) ================= */

  var PZ = -CD / 2 + 0.035, PY0 = 1.44, man = [];
  // panel plate on the back wall
  man.push(PC.T(PC.plane({ w: 0.84, d: 0.46, n: 2400, tone: 0.26 }), { rot: [Math.PI / 2, 0, 0], pos: [CBX - 0.02, PY0 + 0.25, PZ] }));
  man.push(PC.T(PC.polyline({
    pts: [[-0.42, 0, -0.23], [0.42, 0, -0.23], [0.42, 0, 0.23], [-0.42, 0, 0.23]], closed: true, perUnit: 300, tone: 1
  }), { rot: [Math.PI / 2, 0, 0], pos: [CBX - 0.02, PY0 + 0.25, PZ + 0.004] }));
  // process header running across the panel, and the vent header above it
  man.push(PC.line({ a: [CBX - 0.40, PY0 + 0.06, PZ + 0.03], b: [CBX + 0.40, PY0 + 0.06, PZ + 0.03], perUnit: 300, tone: 1 }));
  man.push(PC.line({ a: [CBX - 0.40, PY0 + 0.44, PZ + 0.03], b: [CBX + 0.40, PY0 + 0.44, PZ + 0.03], perUnit: 300, tone: 1 }));
  for (i = 0; i < 3; i++) {
    var v = valveTop[i], px = CBX + cylX[i];
    // coiled pigtail from the cylinder valve up to the panel
    man.push(PC.T(PC.helix({ r: 0.048, pitch: 0.038, turns: 2.6, perUnit: 260, tone: 1 }), { pos: [v[0] + 0.048, v[1] + 0.08, v[2]] }));
    man.push(PC.line({ a: [v[0], v[1], v[2]], b: [v[0] + 0.096, v[1] + 0.03, v[2]], perUnit: 260, tone: 1 }));
    man.push(PC.polyline({ pts: [[v[0] + 0.096, v[1] + 0.13, v[2]], [v[0] + 0.096, PY0 - 0.02, v[2]], [px, PY0 - 0.02, PZ + 0.03], [px, PY0 + 0.06, PZ + 0.03]], perUnit: 260, tone: 1 }));
    // two valve blocks in series on each leg: block, bleed
    man.push(PC.T(PC.box({ w: 0.058, h: 0.062, d: 0.058, n: 260, tone: 1 }), { pos: [px, PY0 + 0.06, PZ + 0.03] }));
    man.push(PC.T(PC.boxEdges({ w: 0.058, h: 0.062, d: 0.058, perUnit: 300, tone: 1 }), { pos: [px, PY0 + 0.06, PZ + 0.03] }));
    man.push(PC.T(PC.box({ w: 0.052, h: 0.056, d: 0.052, n: 230, tone: 1 }), { pos: [px, PY0 + 0.44, PZ + 0.03] }));
    man.push(PC.T(PC.boxEdges({ w: 0.052, h: 0.056, d: 0.052, perUnit: 300, tone: 1 }), { pos: [px, PY0 + 0.44, PZ + 0.03] }));
    man.push(PC.line({ a: [px, PY0 + 0.10, PZ + 0.03], b: [px, PY0 + 0.41, PZ + 0.03], perUnit: 260, tone: 1 }));
    // gauge over each leg
    man.push(dial(0.050, 320, 1, px, PY0 + 0.265, PZ + 0.055));
    man.push(dial(0.020, 320, 1, px, PY0 + 0.265, PZ + 0.055));
  }
  // regulator body and the process line leaving through the side wall,
  // by way of the point-of-use filter
  man.push(PC.T(PC.cylinder({ r: 0.048, h: 0.052, n: 380, tone: 1 }), { pos: [CBX + 0.40, PY0 + 0.06, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.048, perUnit: 320, tone: 1 }), { pos: [CBX + 0.40, PY0 + 0.086, PZ + 0.03] }));
  man.push(PC.polyline({ pts: [[CBX + 0.40, PY0 + 0.06, PZ + 0.03], [CBX + 0.40, PY0 - 0.16, PZ + 0.03], [CBX + CW / 2 + 0.19, PY0 - 0.16, PZ + 0.03]], perUnit: 260, tone: 1 }));
  man.push(PC.T(PC.cylinder({ r: 0.030, h: 0.115, n: 340, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.115, PY0 - 0.16, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.038, perUnit: 320, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.058, PY0 - 0.16, PZ + 0.03] }));
  man.push(PC.T(PC.circle({ r: 0.038, perUnit: 320, tone: 1 }), { rot: [0, 0, Math.PI / 2], pos: [CBX + CW / 2 + 0.172, PY0 - 0.16, PZ + 0.03] }));
  // vent leg up into the exhaust plenum
  man.push(PC.polyline({ pts: [[CBX - 0.40, PY0 + 0.44, PZ + 0.03], [CBX - 0.40, CTOP - 0.03, PZ + 0.03]], perUnit: 260, tone: 1 }));
  add(PC.accent(PC.merge.apply(null, man), 0.95));

  /* ================= the bulk liquid cylinder ================= */

  var TX = 0.86, TZ = -0.40, TR = 0.205, TB = 0.15, TT = 1.06;
  add(PC.T(PC.cylinder({ r: TR, h: TT - TB, caps: false, n: 7000, tone: 0.25 }), { pos: [TX, (TB + TT) / 2, TZ] }));
  add(PC.T(PC.sphere({ r: TR, thetaMax: Math.PI / 2, n: 2000, tone: 0.28 }), { scale: [1, 0.52, 1], pos: [TX, TT, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.004, perUnit: 300, tone: 1 }), { pos: [TX, TT, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.004, perUnit: 300, tone: 1 }), { pos: [TX, TB, TZ] }));
  [0.30, 0.48, 0.66, 0.84].forEach(function (ry) { add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 200, tone: 0.5 }), { pos: [TX, ry, TZ] })); });
  add(PC.line({ a: [TX - TR * 0.71, TB, TZ + TR * 0.71], b: [TX - TR * 0.71, TT, TZ + TR * 0.71], perUnit: 220, tone: 0.42 }));
  // skirt base with three feet
  add(PC.T(PC.cylinder({ r: TR * 0.86, h: TB, caps: false, n: 1600, tone: 0.36 }), { pos: [TX, TB / 2, TZ] }));
  add(PC.T(PC.circle({ r: TR * 0.86, perUnit: 280, tone: 0.9 }), { pos: [TX, 0.012, TZ] }));
  for (i = 0; i < 3; i++) {
    var fa = i * Math.PI * 2 / 3 + 0.4;
    add(PC.T(PC.cylinder({ r: 0.030, h: 0.030, n: 160, tone: 0.5 }), { pos: [TX + TR * 0.78 * Math.cos(fa), 0.015, TZ + TR * 0.78 * Math.sin(fa)] }));
  }
  for (i = 0; i < 3; i++) {
    var ca2 = i * Math.PI * 2 / 3 + 0.9;
    add(PC.T(PC.torus({ R: 0.030, r: 0.010, n: 260, tone: 0.6 }), { rot: [Math.PI / 2, 0, 0], pos: [TX + TR * 0.74 * Math.cos(ca2), 0.030, TZ + TR * 0.74 * Math.sin(ca2)] }));
  }
  add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 300, tone: 0.85 }), { pos: [TX, 1.00, TZ] }));
  add(PC.T(PC.circle({ r: TR * 1.006, perUnit: 300, tone: 0.85 }), { pos: [TX, 0.94, TZ] }));

  // top collar and the valve cluster it protects
  add(PC.T(PC.torus({ R: TR * 0.96, r: 0.018, n: 900, tone: 0.62 }), { pos: [TX, TT + 0.20, TZ] }));
  for (i = 0; i < 4; i++) {
    var pa = i * Math.PI * 2 / 4 + 0.5;
    add(PC.line({ a: [TX + TR * 0.94 * Math.cos(pa), TT + 0.03, TZ + TR * 0.94 * Math.sin(pa)],
                  b: [TX + TR * 0.96 * Math.cos(pa), TT + 0.20, TZ + TR * 0.96 * Math.sin(pa)], perUnit: 300, tone: 0.7 }));
  }
  add(PC.T(PC.box({ w: 0.16, h: 0.075, d: 0.10, n: 700, tone: 0.42 }), { pos: [TX, TT + 0.10, TZ + 0.02] }));
  add(PC.T(PC.boxEdges({ w: 0.16, h: 0.075, d: 0.10, perUnit: 300, tone: 0.95 }), { pos: [TX, TT + 0.10, TZ + 0.02] }));
  for (i = 0; i < 3; i++) {
    add(PC.T(PC.torus({ R: 0.030, r: 0.007, n: 200, tone: 0.72 }), { pos: [TX - 0.058 + i * 0.058, TT + 0.155, TZ + 0.02] }));
    add(PC.T(PC.cylinder({ r: 0.008, h: 0.030, caps: false, n: 90, tone: 0.6 }), { pos: [TX - 0.058 + i * 0.058, TT + 0.152, TZ + 0.02] }));
  }
  add(dial(0.042, 320, 0.9, TX + 0.055, TT + 0.10, TZ + 0.075));
  add(dial(0.016, 320, 0.9, TX + 0.055, TT + 0.10, TZ + 0.075));
  // relief valve and the vertical vaporiser coil on the jacket
  add(PC.T(PC.cylinder({ r: 0.026, h: 0.085, caps: false, n: 200, tone: 0.55 }), { pos: [TX - 0.10, TT + 0.145, TZ - 0.06] }));
  add(PC.T(PC.circle({ r: 0.034, perUnit: 320, tone: 0.9 }), { pos: [TX - 0.10, TT + 0.188, TZ - 0.06] }));
  add(PC.T(PC.helix({ r: 0.042, pitch: 0.046, turns: 5, perUnit: 300, tone: 0.7 }), { pos: [TX - TR - 0.046, 0.60, TZ + 0.02] }));
  add(PC.polyline({ pts: [[TX - TR - 0.046, 0.72, TZ + 0.02], [TX - TR - 0.046, TT + 0.06, TZ + 0.02], [TX - 0.08, TT + 0.06, TZ + 0.02]], perUnit: 260, tone: 0.7 }));
  add(PC.polyline({ pts: [[TX - TR - 0.046, 0.49, TZ + 0.02], [TX - TR - 0.046, 0.32, TZ + 0.02], [TX - TR + 0.02, 0.32, TZ + 0.02]], perUnit: 260, tone: 0.7 }));
  // liquid-level gauge and nameplate on the shell
  add(PC.T(PC.polyline({ pts: [[-0.10, 0, -0.07], [0.10, 0, -0.07], [0.10, 0, 0.07], [-0.10, 0, 0.07]], closed: true, perUnit: 280, tone: 0.9 }),
        { rot: [Math.PI / 2, 0, 0], pos: [TX, 0.88, TZ + TR * 1.01] }));
  add(PC.T(PC.polyline({ pts: [[-0.055, 0, -0.045], [0.055, 0, -0.045], [0.055, 0, 0.045], [-0.055, 0, 0.045]], closed: true, perUnit: 280, tone: 0.8 }),
        { rot: [Math.PI / 2, 0, 0], pos: [TX, 0.42, TZ + TR * 1.01] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.24, -0.50, 0],
    // colour: the gas panel is electropolished 316L stainless steel: VCR fittings, valve blocks, regulator and gauge bodies, all silver-grey
    accent: [117, 132, 144], accentDark: [198, 206, 213],
    caption: 'A specialty gas cabinet with its door off: three cylinders strapped behind restraint bars, coiled pigtails climbing to the gas panel on the back wall, and the exhaust collar that takes any leak to the scrubber. The panel is in steel - regulator, block and bleed valves, gauges, purge and vent legs - with the process line leaving through the side wall through a point-of-use filter. Behind it stands a bulk liquid cylinder.'
  };
});

})(window.PC);}catch(e){console.warn('specimen gas-cabinet.js failed to load', e);}
/* globe.js */
try{(function(PC){
/* Specimen: the world, with the chain's chokepoint sites pinned.
 *
 * The land is filled, not outlined: continents are point-in-polygon fields
 * of ink over a paler ocean, with the coastline drawn on top, so the
 * shapes read as mass at the size the site draws this. A graticule of
 * meridians every 30 degrees and parallels every 20 sits under both.
 *
 * Nineteen sites carry copper pins. Pin height is proportional to the
 * chokepoint score of the chapter that site belongs to (0.055 per point),
 * so the tallest pins stand over lithography, foundry, memory and
 * packaging towns and the shorter ones over design, assembly and power.
 *
 * lat/lon -> xyz with Y up:  x = cos(lat) sin(lon), y = sin(lat), z = cos(lat) cos(lon)
 * so longitude 0 faces +Z and longitude 90E faces +X. The tilt below puts
 * the first view over the Malacca Strait at about 3N 100E, which is the
 * only place on Earth from which Taiwan, Korea, Japan, the Chinese coast,
 * Penang, Singapore, Bengaluru and Abu Dhabi are visible at once.
 */
PC.register('globe', function (p) {
  var parts = [], RAD = Math.PI / 180;

  function ll(lat, lon, r) {
    var a = lat * RAD, b = lon * RAD, c = Math.cos(a) * r;
    return [c * Math.sin(b), Math.sin(a) * r, c * Math.cos(b)];
  }

  // Unwrap a lat/lon ring across the antimeridian so its longitudes run
  // continuously; both the coastline and the fill test use the same copy.
  function unwrap(list) {
    var pts = [[list[0][0], list[0][1]]], prev = list[0][1], i;
    for (i = 1; i < list.length; i++) {
      var lon = list[i][1];
      while (lon - prev > 180) lon -= 360;
      while (lon - prev < -180) lon += 360;
      pts.push([list[i][0], lon]);
      prev = lon;
    }
    return pts;
  }

  function densify(pts, r, step) {
    var out = [], i, k;
    for (i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var dLat = b[0] - a[0], dLon = (b[1] - a[1]) * Math.cos((a[0] + b[0]) / 2 * RAD);
      var n = Math.max(1, Math.ceil(Math.sqrt(dLat * dLat + dLon * dLon) / step));
      for (k = 0; k < n; k++) out.push(ll(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n, r));
    }
    out.push(ll(pts[pts.length - 1][0], pts[pts.length - 1][1], r));
    return out;
  }

  var LAND = [
    // Eurasia: Iberia -> Baltic -> Scandinavia -> Siberian Arctic -> Kamchatka ->
    // Korea -> China -> Indochina -> Malaya -> India -> Arabia -> Levant -> Greece -> Iberia
    [[36.0, -5.6], [37.0, -9.0], [41.0, -8.9], [43.4, -8.3], [43.4, -1.8], [46.5, -1.2], [48.5, -4.6],
     [49.5, 0.2], [51.0, 1.6], [52.0, 4.2], [53.4, 5.0], [53.6, 8.1], [55.4, 8.3], [57.6, 8.6], [57.0, 10.6],
     [54.4, 11.0], [54.0, 13.8], [54.4, 18.6], [55.7, 21.0], [57.8, 22.5], [59.4, 24.5], [60.0, 28.0],
     [60.5, 25.0], [63.0, 21.5], [65.7, 24.0], [63.5, 21.0], [60.5, 18.0], [58.7, 17.0], [56.2, 15.8],
     [55.4, 13.0], [56.2, 12.6], [58.0, 11.5], [59.0, 10.7], [58.1, 7.0], [61.0, 5.0], [63.0, 7.8],
     [65.0, 12.0], [68.0, 15.5], [70.2, 20.0], [71.1, 25.5], [69.8, 30.5], [66.5, 34.0],
     [65.0, 36.5], [66.5, 40.0], [68.5, 44.0], [68.0, 53.5], [68.5, 66.0], [73.0, 70.0], [70.5, 73.0],
     [71.5, 80.0], [76.0, 95.0], [74.0, 100.0], [72.5, 106.0], [73.5, 113.0], [73.0, 125.0], [71.0, 136.0],
     [72.5, 142.0], [70.0, 150.0], [69.5, 161.0], [66.0, 171.0], [64.5, 178.0], [66.1, -170.0],
     [64.7, -172.8], [64.8, -178.0], [62.5, 179.0], [61.0, 173.0], [60.0, 166.0], [57.0, 162.5],
     [51.5, 157.0], [54.5, 155.5], [59.5, 152.0], [59.0, 143.0], [53.5, 141.0], [51.5, 140.5],
     [46.0, 138.0], [43.0, 131.8], [39.0, 127.5], [35.5, 129.5], [34.8, 126.5], [37.5, 126.4],
     [39.5, 124.5], [40.0, 121.5], [38.5, 118.0], [37.5, 122.5], [36.0, 120.3], [34.5, 119.5],
     [31.5, 121.8], [30.0, 122.2], [27.0, 120.5], [24.5, 118.2], [23.0, 116.5], [22.0, 113.5],
     [21.5, 110.5], [20.5, 109.8], [21.5, 108.0], [18.5, 106.5], [16.0, 108.2], [12.5, 109.3],
     [10.0, 106.5], [9.0, 105.0], [10.5, 103.2], [11.5, 103.0], [13.5, 100.5], [12.5, 100.0],
     [10.0, 99.5], [7.5, 99.8], [5.5, 100.3], [2.5, 102.0], [1.3, 103.8], [3.5, 101.5], [6.5, 99.8],
     [9.5, 98.5], [12.0, 98.5], [16.0, 97.5], [16.5, 94.7], [20.0, 92.8], [21.5, 90.0], [22.5, 89.0],
     [21.5, 87.0], [19.5, 85.5], [16.0, 81.2], [13.0, 80.3], [10.0, 79.9], [8.1, 77.5], [10.0, 76.0],
     [13.0, 74.7], [15.5, 73.8], [19.0, 72.8], [21.0, 72.6], [22.5, 69.0], [23.0, 68.0], [24.5, 67.0],
     [25.0, 63.0], [25.4, 60.0], [25.5, 57.5], [26.5, 56.4], [27.5, 56.5], [28.5, 51.0], [30.0, 48.5],
     [29.5, 48.4], [27.5, 50.0], [25.5, 51.5], [24.6, 53.0], [24.4, 54.4], [25.5, 55.5], [26.2, 56.4],
     [24.5, 57.5], [22.0, 59.8], [19.0, 57.8], [17.0, 55.0], [14.5, 50.0], [12.7, 45.0], [13.5, 43.5],
     [16.0, 42.5], [19.0, 41.0], [21.5, 39.2], [24.5, 37.2], [27.5, 34.5], [29.5, 34.9], [31.2, 32.3],
     [31.5, 34.5], [34.7, 36.0], [36.5, 36.0], [36.8, 34.0], [36.0, 30.5], [36.8, 28.2], [38.5, 26.5],
     [40.3, 26.2], [40.5, 23.0], [38.0, 23.7], [36.8, 23.0], [37.9, 21.1], [39.5, 20.0], [41.9, 19.3],
     [44.0, 15.2], [45.6, 13.6], [45.0, 12.5], [42.5, 14.0], [40.5, 18.0], [39.8, 18.4], [40.0, 17.0],
     [38.0, 15.6], [38.2, 15.5], [40.5, 14.2], [41.8, 12.4], [43.5, 10.3], [44.4, 8.8], [43.5, 7.6],
     [43.4, 4.8], [42.5, 3.2], [41.2, 2.2], [39.5, 0.2], [37.6, -0.8], [36.7, -4.4], [36.0, -5.6]],
    // Black Sea and Caspian
    [[41.2, 29.1], [42.0, 35.0], [41.6, 41.6], [43.4, 40.0], [44.6, 37.9], [45.3, 36.6], [46.5, 37.5],
     [47.1, 38.3], [46.0, 35.0], [46.6, 31.5], [45.3, 29.7], [44.0, 28.7], [42.5, 27.9], [41.2, 29.1]],
    [[47.0, 52.0], [45.0, 53.5], [41.5, 52.5], [38.0, 53.5], [36.8, 54.0], [37.0, 50.0], [39.0, 49.0],
     [41.0, 49.5], [43.0, 47.5], [45.0, 47.5], [46.7, 49.0], [47.0, 52.0]],
    // Africa
    [[37.3, 9.8], [36.8, 11.1], [33.5, 11.5], [32.5, 15.0], [31.0, 20.0], [31.5, 25.0], [31.4, 30.2],
     [31.2, 32.3], [29.0, 32.6], [27.0, 33.8], [24.0, 35.5], [20.5, 37.0], [18.0, 38.5], [15.5, 40.0],
     [12.7, 43.3], [11.0, 44.5], [11.5, 51.3], [8.0, 49.5], [5.0, 48.5], [2.0, 45.5], [-1.0, 42.5],
     [-4.5, 39.5], [-7.5, 39.5], [-10.5, 40.5], [-14.5, 40.7], [-18.0, 36.5], [-20.5, 35.0],
     [-24.0, 35.5], [-26.0, 33.0], [-29.5, 31.5], [-32.0, 29.0], [-34.0, 25.5], [-34.8, 20.0],
     [-33.9, 18.4], [-31.0, 17.5], [-28.0, 16.5], [-24.0, 14.5], [-20.0, 13.0], [-17.0, 11.8],
     [-12.5, 13.4], [-9.0, 13.0], [-6.0, 12.2], [-4.8, 11.8], [-1.0, 9.3], [2.0, 9.5], [3.8, 8.5],
     [4.5, 6.0], [6.4, 3.4], [5.8, 0.5], [4.8, -2.0], [4.5, -5.5], [5.0, -7.5], [4.7, -10.0],
     [6.5, -11.5], [8.5, -13.3], [10.7, -15.0], [13.5, -16.8], [15.5, -16.5], [19.0, -16.3],
     [21.5, -17.0], [25.0, -14.8], [27.5, -13.0], [30.0, -9.8], [32.0, -9.3], [35.0, -6.0],
     [35.8, -5.3], [35.0, -2.0], [36.5, 3.0], [37.0, 7.0], [37.3, 9.8]],
    // North America
    [[66.0, -166.0], [65.5, -168.0], [63.0, -165.5], [60.5, -165.0], [59.0, -162.0], [58.5, -158.0],
     [55.5, -160.5], [54.5, -163.0], [57.0, -156.0], [59.0, -152.0], [60.0, -148.0], [59.5, -140.0],
     [56.5, -134.0], [52.0, -128.0], [49.5, -125.0], [46.2, -124.0], [42.0, -124.4], [38.0, -123.0],
     [34.5, -120.6], [32.7, -117.2], [30.5, -116.0], [28.0, -114.0], [23.0, -110.0], [24.0, -110.5],
     [27.0, -112.5], [31.5, -114.6], [29.0, -111.0], [25.5, -109.0], [23.0, -106.0], [19.0, -104.5],
     [16.5, -98.5], [15.0, -94.5], [13.5, -91.0], [12.0, -87.0], [9.5, -84.5], [8.0, -79.0],
     [9.5, -79.5], [10.5, -83.5], [15.0, -83.5], [17.5, -88.3], [21.5, -87.0], [21.5, -90.0],
     [19.0, -95.5], [22.5, -97.8], [26.0, -97.2], [29.7, -95.0], [29.2, -89.5], [30.4, -87.0],
     [27.8, -82.7], [25.2, -81.0], [27.0, -80.2], [30.5, -81.4], [33.7, -78.9], [35.2, -75.5],
     [38.8, -74.9], [41.3, -71.9], [42.0, -70.0], [44.0, -68.9], [45.3, -66.0], [45.0, -61.5],
     [47.0, -60.0], [48.5, -58.5], [49.5, -55.5], [51.5, -56.0], [53.0, -56.0], [55.5, -60.5],
     [58.5, -63.0], [60.0, -64.5], [62.5, -73.5], [60.5, -77.5], [57.0, -77.0], [55.0, -82.5],
     [53.5, -82.0], [55.5, -85.5], [58.5, -92.5], [60.0, -94.5], [61.5, -93.0], [63.5, -90.5],
     [64.0, -87.0], [66.5, -86.5], [68.0, -90.0], [68.5, -97.0], [69.5, -105.0], [68.0, -113.0],
     [69.5, -122.0], [70.0, -128.0], [69.5, -135.0], [70.5, -145.0], [71.3, -156.5], [68.5, -166.0],
     [66.0, -166.0]],
    // South America
    [[8.0, -77.0], [6.0, -77.5], [2.0, -79.0], [-1.0, -80.8], [-5.0, -81.2], [-8.0, -79.0],
     [-12.0, -77.0], [-16.0, -73.5], [-18.5, -70.5], [-23.5, -70.5], [-27.0, -71.0], [-33.0, -71.7],
     [-37.0, -73.5], [-41.5, -74.0], [-45.5, -75.0], [-49.5, -75.5], [-53.0, -73.5], [-55.9, -67.3],
     [-52.5, -69.0], [-50.0, -68.5], [-46.5, -67.0], [-42.5, -64.0], [-40.0, -62.3], [-38.0, -57.5],
     [-35.0, -56.0], [-33.0, -53.5], [-30.0, -50.5], [-26.0, -48.5], [-23.0, -43.2], [-20.5, -40.3],
     [-17.5, -39.0], [-13.0, -38.5], [-9.0, -35.2], [-5.0, -35.5], [-2.5, -40.0], [-2.5, -44.0],
     [-1.0, -47.0], [0.5, -50.0], [4.0, -51.7], [6.0, -57.5], [8.5, -60.0], [10.5, -62.0],
     [10.7, -66.0], [12.2, -70.0], [11.5, -72.5], [9.4, -76.0], [8.0, -77.0]],
    // Australia, Tasmania, New Zealand
    [[-11.0, 131.0], [-12.5, 132.5], [-11.2, 136.7], [-13.5, 136.0], [-16.5, 139.5], [-17.5, 140.8],
     [-14.0, 141.6], [-10.7, 142.5], [-14.5, 144.5], [-19.0, 146.8], [-22.0, 150.0], [-25.5, 153.0],
     [-30.0, 153.4], [-34.5, 151.3], [-37.8, 149.9], [-38.8, 146.0], [-38.0, 144.5], [-35.5, 138.5],
     [-32.5, 137.8], [-34.0, 135.5], [-31.5, 131.0], [-33.5, 124.0], [-35.0, 118.0], [-33.5, 115.0],
     [-31.9, 115.8], [-28.0, 114.0], [-24.0, 113.4], [-21.5, 115.0], [-20.0, 118.5], [-17.5, 122.0],
     [-16.0, 123.5], [-14.5, 126.5], [-13.5, 129.5], [-11.0, 131.0]],
    [[-40.7, 144.7], [-41.0, 148.3], [-43.5, 147.0], [-43.0, 145.5], [-40.7, 144.7]],
    [[-34.5, 172.8], [-36.5, 174.8], [-37.5, 178.5], [-39.3, 177.0], [-41.3, 175.0], [-39.5, 174.0],
     [-38.0, 174.8], [-36.5, 174.4], [-34.5, 172.8]],
    [[-40.5, 172.7], [-41.5, 174.3], [-44.0, 173.0], [-46.6, 169.7], [-45.9, 166.5], [-44.0, 168.4],
     [-42.0, 171.0], [-40.5, 172.7]],
    // Japan: Honshu, Hokkaido, Kyushu, Shikoku
    [[34.6, 135.0], [34.7, 138.0], [35.6, 140.1], [36.9, 141.0], [38.3, 141.5], [39.5, 142.0],
     [41.4, 141.4], [41.2, 140.3], [40.0, 139.9], [38.5, 139.5], [37.2, 136.9], [35.7, 135.5],
     [35.5, 132.9], [34.4, 131.0], [34.0, 131.0], [34.3, 132.5], [34.7, 134.5], [34.6, 135.0]],
    [[41.5, 140.2], [42.9, 141.5], [45.5, 141.9], [44.3, 145.3], [43.3, 145.6], [42.0, 143.2],
     [41.8, 140.7], [41.5, 140.2]],
    [[33.9, 130.9], [33.3, 131.8], [31.6, 131.5], [31.0, 130.3], [32.6, 129.7], [33.5, 129.9], [33.9, 130.9]],
    [[34.3, 134.7], [33.5, 134.3], [33.0, 132.5], [33.9, 132.6], [34.3, 134.7]],
    // Taiwan and Hainan
    [[25.3, 121.6], [24.5, 121.9], [22.7, 121.1], [22.0, 120.7], [23.1, 120.1], [24.5, 120.5], [25.3, 121.6]],
    [[20.1, 110.0], [18.2, 109.7], [18.5, 108.7], [20.0, 108.8], [20.1, 110.0]],
    // Britain, Ireland, Iceland, Greenland
    [[50.1, -5.7], [51.6, -4.2], [52.9, -4.7], [54.1, -3.1], [55.0, -5.0], [56.5, -6.0], [58.6, -5.0],
     [58.6, -3.0], [57.5, -1.8], [56.0, -2.6], [54.6, -1.1], [52.9, 0.4], [51.4, 1.4], [50.7, -1.9], [50.1, -5.7]],
    [[51.5, -9.5], [53.3, -9.9], [54.3, -8.5], [55.3, -7.3], [54.7, -5.6], [53.4, -6.1], [52.2, -6.4], [51.5, -9.5]],
    [[63.4, -19.0], [63.8, -22.7], [65.0, -22.7], [66.3, -23.2], [66.5, -18.0], [65.6, -14.5], [64.3, -14.5], [63.4, -19.0]],
    [[59.8, -43.9], [62.5, -49.5], [65.5, -52.5], [68.5, -53.5], [71.5, -55.5], [74.0, -57.0],
     [76.5, -70.0], [78.5, -73.0], [81.5, -62.0], [83.0, -33.0], [81.0, -20.0], [77.0, -19.0],
     [73.0, -21.5], [70.0, -22.0], [66.0, -35.0], [62.0, -42.0], [59.8, -43.9]],
    // Madagascar, Sri Lanka, Cuba
    [[-12.0, 49.3], [-15.5, 50.5], [-19.0, 49.5], [-23.5, 47.8], [-25.5, 45.2], [-22.0, 43.3],
     [-18.0, 44.3], [-15.0, 46.3], [-12.0, 49.3]],
    [[9.8, 80.2], [7.0, 79.8], [6.0, 80.2], [6.5, 81.8], [9.0, 81.2], [9.8, 80.2]],
    [[23.2, -81.5], [22.0, -84.9], [21.9, -77.5], [20.3, -74.2], [21.5, -76.5], [23.2, -81.5]],
    // The archipelago: Sumatra, Java, Borneo, Sulawesi, New Guinea, Luzon, Mindanao
    [[5.6, 95.3], [2.0, 96.5], [-1.5, 100.3], [-5.0, 103.0], [-5.9, 105.9], [-3.5, 104.5],
     [-1.0, 103.5], [1.5, 102.5], [4.0, 98.3], [5.6, 95.3]],
    [[-6.0, 105.6], [-6.9, 109.0], [-6.9, 112.7], [-8.4, 114.4], [-8.6, 111.0], [-7.7, 107.5], [-6.0, 105.6]],
    [[7.0, 117.0], [4.2, 118.6], [1.0, 117.6], [-2.0, 116.3], [-4.0, 114.5], [-3.5, 111.5],
     [-1.0, 109.5], [1.5, 109.0], [4.0, 113.0], [5.0, 115.2], [7.0, 117.0]],
    [[1.5, 125.2], [0.5, 120.5], [-2.0, 120.3], [-5.5, 119.4], [-5.7, 122.5], [-3.5, 123.0],
     [-1.5, 123.0], [0.0, 121.5], [1.5, 125.2]],
    [[-0.8, 131.0], [-2.0, 134.2], [-3.5, 136.0], [-5.5, 138.0], [-8.5, 140.0], [-9.5, 147.0],
     [-10.5, 150.8], [-8.0, 148.0], [-5.5, 145.5], [-3.5, 142.0], [-2.5, 138.5], [-1.5, 133.5], [-0.8, 131.0]],
    [[18.6, 120.8], [16.0, 119.8], [14.3, 120.2], [13.8, 123.0], [15.5, 121.5], [17.5, 122.3], [18.6, 120.8]],
    [[9.8, 124.0], [7.0, 124.0], [5.9, 125.4], [7.3, 126.5], [9.8, 126.0], [9.8, 124.0]]
  ];

  // Two of the rings are water inside Eurasia, not land: the Black Sea and
  // the Caspian. Anything inside them is subtracted from the fill.
  var HOLES = [1, 2];
  // Taiwan and the Japanese islands are small enough at this scale that
  // they need a denser fill and a heavier coast to survive.
  var DENSE = { 10: 1.3, 11: 1.3, 12: 1.4, 13: 1.4, 14: 2.6 };

  // ---------- prepare the rings ----------
  var rings = [];
  for (var c = 0; c < LAND.length; c++) {
    var pts = unwrap(LAND[c]);
    var b = { latMin: 90, latMax: -90, lonMin: 1e9, lonMax: -1e9 };
    for (var i = 0; i < pts.length; i++) {
      if (pts[i][0] < b.latMin) b.latMin = pts[i][0];
      if (pts[i][0] > b.latMax) b.latMax = pts[i][0];
      if (pts[i][1] < b.lonMin) b.lonMin = pts[i][1];
      if (pts[i][1] > b.lonMax) b.lonMax = pts[i][1];
    }
    rings.push({ pts: pts, b: b, hole: HOLES.indexOf(c) >= 0, dense: DENSE[c] || 1 });
  }

  function inside(ring, lat, lon) {
    var b = ring.b;
    while (lon < b.lonMin) lon += 360;
    while (lon > b.lonMax) lon -= 360;
    if (lon < b.lonMin || lat < b.latMin || lat > b.latMax) return false;
    var pts = ring.pts, m = pts.length, hit = false;
    for (var q = 0, w = m - 1; q < m; w = q++) {
      if ((pts[q][0] > lat) !== (pts[w][0] > lat) &&
          lon < (pts[w][1] - pts[q][1]) * (lat - pts[q][0]) / (pts[w][0] - pts[q][0]) + pts[q][1]) hit = !hit;
    }
    return hit;
  }

  // ---------- the ocean ----------
  var RS = 1.0, RF = 1.006, RC = 1.013;
  parts.push(PC.sphere({ r: RS, n: 17000, tone: 0.11 }));

  // ---------- the graticule ----------
  var grat = [], g;
  for (g = -60; g <= 60; g += 20) {
    var cl = Math.cos(g * RAD);
    grat.push(PC.T(PC.circle({ r: cl * RS, perUnit: 150, tone: g === 0 ? 0.30 : 0.15 }), { pos: [0, Math.sin(g * RAD) * RS, 0] }));
  }
  for (g = 0; g < 360; g += 30) {
    grat.push(PC.polyline({ pts: densify([[-78, g], [78, g]], RS, 1.6), perUnit: 150, tone: g === 0 ? 0.24 : 0.15 }));
  }
  parts.push(PC.merge.apply(null, grat));

  // ---------- land fill ----------
  // Rejection-sampled inside each ring's bounding box, equal-area in
  // sin(latitude), at a fixed number of points per steradian.
  var DENSITY = 6100, fill = [], n = 0;
  var alloc = new Float32Array(46000 * 4);
  for (c = 0; c < rings.length; c++) {
    var R = rings[c];
    if (R.hole) continue;
    var s0 = Math.sin(R.b.latMin * RAD), s1 = Math.sin(R.b.latMax * RAD);
    var boxArea = (s1 - s0) * (R.b.lonMax - R.b.lonMin) * RAD;
    var trials = Math.round(boxArea * DENSITY * R.dense);
    for (var t = 0; t < trials && n < 46000; t++) {
      var s = s0 + PC.rnd() * (s1 - s0);
      var lat = Math.asin(s) / RAD, lon = R.b.lonMin + PC.rnd() * (R.b.lonMax - R.b.lonMin);
      if (!inside(R, lat, lon)) continue;
      if (c === 0 && (inside(rings[1], lat, lon) || inside(rings[2], lat, lon))) continue;
      var v = ll(lat, lon, RF);
      alloc[n * 4] = v[0]; alloc[n * 4 + 1] = v[1]; alloc[n * 4 + 2] = v[2];
      alloc[n * 4 + 3] = 0.34;
      n++;
    }
  }
  parts.push(alloc.subarray(0, n * 4));

  // ---------- Antarctica ----------
  // A ring round the pole cannot be tested by the even-odd rule above, so
  // the ice sheet is drawn as "everything south of this coast", with the
  // coast given as one latitude per meridian: the Ross and Weddell
  // embayments at -78, the peninsula reaching -63.
  var ANT = [
    [-180, -78.5], [-160, -78.0], [-150, -75.0], [-135, -74.2], [-120, -73.8], [-100, -73.2],
    [-80, -73.0], [-70, -68.0], [-63, -65.0], [-57, -63.4], [-50, -66.5], [-42, -75.0],
    [-33, -77.6], [-25, -76.0], [-14, -71.5], [-5, -70.2], [4, -69.8], [14, -70.2],
    [26, -69.8], [36, -68.8], [46, -67.2], [56, -66.8], [66, -68.4], [76, -67.0],
    [88, -66.4], [100, -66.5], [112, -66.4], [124, -66.6], [136, -66.0], [146, -68.5],
    [156, -71.5], [166, -76.5], [174, -78.4], [180, -78.5]
  ];
  function antLat(lon) {
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;
    for (var i = 0; i < ANT.length - 1; i++) {
      if (lon >= ANT[i][0] && lon <= ANT[i + 1][0]) {
        var t = (lon - ANT[i][0]) / (ANT[i + 1][0] - ANT[i][0]);
        return ANT[i][1] + (ANT[i + 1][1] - ANT[i][1]) * t;
      }
    }
    return -70;
  }
  var ice = new Float32Array(4200 * 4), ni = 0;
  var sIce0 = Math.sin(-90 * RAD), sIce1 = Math.sin(-62 * RAD);
  for (var it = 0; it < 5200 && ni < 4200; it++) {
    var sI = sIce0 + PC.rnd() * (sIce1 - sIce0);
    var latI = Math.asin(sI) / RAD, lonI = -180 + PC.rnd() * 360;
    if (latI > antLat(lonI)) continue;
    var vI = ll(latI, lonI, RF);
    ice[ni * 4] = vI[0]; ice[ni * 4 + 1] = vI[1]; ice[ni * 4 + 2] = vI[2]; ice[ni * 4 + 3] = 0.28;
    ni++;
  }
  parts.push(ice.subarray(0, ni * 4));
  var antPts = [];
  for (var ai = 0; ai <= 180; ai++) {
    var alon = -180 + ai * 2;
    antPts.push(ll(antLat(alon), alon, RC));
  }
  parts.push(PC.polyline({ pts: antPts, perUnit: 800, tone: 0.9 }));

  // ---------- coastlines ----------
  var coast = [];
  for (c = 0; c < rings.length; c++) {
    coast.push(PC.polyline({
      pts: densify(rings[c].pts, RC, 1.2),
      perUnit: 900 * rings[c].dense,
      tone: rings[c].hole ? 0.7 : 1
    }));
  }
  parts.push(PC.merge.apply(null, coast));

  // ---------- the chokepoint pins ----------
  // name, lat, lon, the chapter it belongs to, that chapter's chokepoint score
  var SITES = [
    ['Veldhoven', 51.42, 5.40, 5],       // 04 lithography
    ['Oberkochen', 48.78, 10.10, 5],     // 04 lithography optics
    ['Hsinchu', 24.80, 120.97, 5],       // 09 foundries
    ['Tainan', 22.99, 120.21, 5],        // 09 foundries
    ['Kaohsiung', 22.63, 120.30, 5],     // 11 advanced packaging
    ['Icheon', 37.28, 127.44, 5],        // 10 memory
    ['Pyeongtaek', 36.99, 127.11, 5],    // 10 memory
    ['Kumamoto', 32.80, 130.71, 5],      // 09 foundries
    ['Yokkaichi', 34.97, 136.62, 5],     // 10 memory
    ['Tokyo', 35.68, 139.69, 4],         // 06 deposition and etch
    ['Shanghai', 31.23, 121.47, 5],      // 09 foundries
    ['Penang', 5.41, 100.34, 4],         // 13 test and assembly
    ['Singapore', 1.35, 103.82, 4],      // 13 test and assembly
    ['Bengaluru', 12.97, 77.59, 4],      // 01 design and EDA
    ['Abu Dhabi', 24.45, 54.38, 4],      // 15 data centers and power
    ['Hillsboro', 45.52, -122.99, 5],    // 08 transistors and the front end
    ['Phoenix', 33.45, -112.07, 5],      // 09 foundries
    ['Austin', 30.27, -97.74, 4],        // 01 design and EDA
    ['Boise', 43.62, -116.20, 5]         // 10 memory
  ];
  // The towns where substitutes are being built, drawn in ink rather than copper: China's
  // foundry, memory and tool clusters (chapter 18) and Europe's fab cluster at Dresden.
  var SUBS = [
    ['Beijing', 39.90, 116.40],   // Naura, SMIC Beijing
    ['Wuhan', 30.59, 114.31],     // YMTC
    ['Shenzhen', 22.54, 114.06],  // Huawei, SMIC Shenzhen
    ['Hefei', 31.82, 117.23],     // CXMT
    ['Dresden', 51.05, 13.74]     // ESMC, GlobalFoundries, Infineon
  ];

  function pin(lat, lon, h, out) {
    var a = ll(lat, lon, RS), b = ll(lat, lon, RS + h);
    out.push(PC.line({ a: a, b: b, perUnit: 1700 }));
    out.push(PC.T(PC.sphere({ r: 0.012, n: 90 }), { pos: b }));
    // a ring on the ground, laid flat on the sphere at that point
    out.push(PC.T(PC.T(PC.circle({ r: 0.022, perUnit: 1300 }), { pos: [0, RS + 0.004, 0] }), { rot: [Math.PI / 2 - lat * RAD, lon * RAD, 0] }));
  }
  var pins = [], inkPins = [];
  SITES.forEach(function (s) { pin(s[1], s[2], 0.032 * s[3], pins); });
  SUBS.forEach(function (s) { pin(s[1], s[2], 0.032 * 2, inkPins); });
  parts.push(PC.accent(PC.merge.apply(null, pins), 1));
  parts.push(PC.tone(PC.merge.apply(null, inkPins), 0.95));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.06,
    tilt: [-0.30, -1.75, 0],
    // colour: the pins are a diagram, not an object, so they take the site's own garnet
    accent: [122, 31, 43], accentDark: [201, 83, 106],
    caption: 'The world with nineteen chokepoint towns pinned in garnet, the pins standing in proportion to how narrow each town’s link in the chain is, and five towns building substitutes pinned in ink: Beijing, Wuhan, Shenzhen, Hefei and Dresden. The first view looks down on the Malacca Strait: Hsinchu, Tainan and Kaohsiung on Taiwan, Icheon and Pyeongtaek in Korea, Kumamoto, Yokkaichi and Tokyo in Japan, Shanghai, Penang, Singapore, Bengaluru and Abu Dhabi. Veldhoven, Oberkochen and the four American sites come round as it turns.'
  };
});

})(window.PC);}catch(e){console.warn('specimen globe.js failed to load', e);}
/* gpu-baseboard.js */
try{(function(PC){
/* Specimen: an eight-GPU baseboard, drawn from the HGX B200 layout.
 *
 * Reference: Nvidia's HGX B200 universal baseboard as photographed by
 * ServeTheHome at Computex 2024. Eight SXM modules in two rows of four,
 * the two rows flipped so their land grids face inward, and TWO NVLink
 * switch chips (not four, as on H100) sitting in the middle of the board
 * to shorten the traces. Each module is a bolted retention frame with a
 * bare metal lid inside it, a land-grid array beside it and printed
 * corner fiducials; voltage-regulator banks line the long edges and the
 * high-density connectors run along the front.
 *
 * The two switch chips are in copper: they are the part of this board
 * that has exactly one supplier.
 */
PC.register('gpu-baseboard', function (p) {
  var parts = [];
  // ~510 x 400 mm board. Vertical relief is true to scale: the module
  // frames stand about 30 mm proud of a 6 mm board.
  var BW = 1.52, BD = 1.18, BH = 0.046;
  var top = BH / 2;

  function rect(w, d) {
    return [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
  }
  function outline(w, d, y, x, z, per, tn) {
    return PC.T(PC.polyline({ pts: rect(w, d), closed: true, perUnit: per, tone: tn }), { pos: [x, y, z] });
  }

  // ---------- the board ----------
  parts.push(PC.T(PC.plane({ w: BW, d: BD, n: 15000, tone: 0.2 }), { pos: [0, top, 0] }));
  parts.push(PC.box({ w: BW, h: BH, d: BD, faces: ['px', 'nx', 'pz', 'nz'], n: 3200, tone: 0.44 }));
  parts.push(PC.boxEdges({ w: BW, h: BH, d: BD, perUnit: 300, tone: 1 }));

  // ---------- one SXM module ----------
  var MW = 0.31, MD = 0.30, MH = 0.066;        // retention frame
  var LW = 0.175, LD = 0.205;                  // the bare lid inside it
  function module(mx, mz, sideSign) {
    var g = [], y0 = top, yc = y0 + MH / 2, yT = y0 + MH;
    // the frame: a low kerbed box, open in the middle
    g.push(PC.T(PC.box({ w: MW, h: MH, d: MD, faces: ['px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.5 }), { pos: [0, yc, 0] }));
    g.push(PC.T(PC.boxEdges({ w: MW, h: MH, d: MD, perUnit: 300, tone: 1 }), { pos: [0, yc, 0] }));
    // the top face of the frame, with its inner opening left dark
    var kerb = 0.032;
    [[0, (MD - kerb) / 2, MW, kerb], [0, -(MD - kerb) / 2, MW, kerb],
     [(MW - kerb) / 2, 0, kerb, MD - 2 * kerb], [-(MW - kerb) / 2, 0, kerb, MD - 2 * kerb]].forEach(function (b) {
      g.push(PC.T(PC.plane({ w: b[2], d: b[3], tone: 0.42 }), { pos: [b[0], yT, b[1]] }));
    });
    g.push(outline(MW - 2 * kerb, MD - 2 * kerb, yT + 0.001, 0, 0, 340, 1));
    // the package inside the frame: substrate, then the machined metal lid
    var yL = yT - 0.016;
    g.push(PC.T(PC.plane({ w: LW + 0.048, d: LD + 0.042, n: 420, tone: 0.5 }), { pos: [0, yL - 0.011, 0] }));
    g.push(outline(LW + 0.048, LD + 0.042, yL - 0.010, 0, 0, 330, 0.95));
    g.push(PC.T(PC.box({ w: LW, h: 0.022, d: LD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 480, tone: 0.2 }), { pos: [0, yL, 0] }));
    g.push(PC.T(PC.boxEdges({ w: LW, h: 0.022, d: LD, perUnit: 420, tone: 1 }), { pos: [0, yL, 0] }));
    // brushed finish, so the lid reads as metal rather than as bare board
    for (var bl = 0; bl < 13; bl++) {
      var bz = (bl - 6) * LD * 0.068;
      g.push(PC.line({ a: [-LW * 0.44, yL + 0.012, bz], b: [LW * 0.44, yL + 0.012, bz], perUnit: 330, tone: 0.42 }));
    }
    g.push(outline(LW * 0.56, LD * 0.44, yL + 0.013, 0, 0, 340, 0.8));
    // eight retention screws around the frame
    var sc = [];
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        sc.push([sx * (MW / 2 - 0.017), sz * (MD / 2 - 0.017)]);
        sc.push([sx * (MW / 2 - 0.017), sz * (MD * 0.15)]);
      });
    });
    sc.forEach(function (s) {
      g.push(PC.T(PC.circle({ r: 0.011, perUnit: 620, tone: 1 }), { pos: [s[0], yT + 0.002, s[1]] }));
      g.push(PC.T(PC.disc({ r: 0.006, n: 26, tone: 0.8 }), { pos: [s[0], yT + 0.002, s[1]] }));
    });
    // printed corner fiducials on the board, just outside the frame
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        var fx = sx * (MW / 2 + 0.013), fz = sz * (MD / 2 + 0.013);
        g.push(PC.line({ a: [fx, y0 + 0.001, fz], b: [fx - sx * 0.030, y0 + 0.001, fz], perUnit: 620, tone: 0.95 }));
        g.push(PC.line({ a: [fx, y0 + 0.001, fz], b: [fx, y0 + 0.001, fz - sz * 0.030], perUnit: 620, tone: 0.95 }));
      });
    });
    // the land-grid array, on the inboard side: the two rows of four are
    // flipped so every module's connector faces the switches
    var gz = sideSign * (MD / 2 + 0.055);
    g.push(PC.T(PC.plane({ w: 0.20, d: 0.052, n: 300, tone: 0.34 }), { pos: [0, y0 + 0.001, gz] }));
    g.push(outline(0.20, 0.052, y0 + 0.002, 0, gz, 380, 0.9));
    g.push(PC.T(PC.dots({ nx: 22, nz: 6, sx: 0.0082, sz: 0.0073, per: 2, tone: 0.85 }), { pos: [0, y0 + 0.003, gz] }));
    return PC.T(PC.merge.apply(null, g), { pos: [mx, 0, mz] });
  }

  var colX = [-0.525, -0.175, 0.175, 0.525], rowZ = 0.318;
  for (var c = 0; c < 4; c++) {
    parts.push(module(colX[c], -rowZ, 1));
    parts.push(module(colX[c], rowZ, -1));
  }

  // ---------- two NVLink switch chips in the middle, in copper ----------
  var SW = 0.30, SD = 0.235, SH = 0.05, swX = [-0.175, 0.175];
  swX.forEach(function (x) {
    var yc = top + SH / 2, yT = top + SH;
    parts.push(PC.T(PC.box({ w: SW, h: SH, d: SD, faces: ['px', 'nx', 'pz', 'nz'], n: 1100, tone: 0.5 }), { pos: [x, yc, 0] }));
    parts.push(PC.T(PC.boxEdges({ w: SW, h: SH, d: SD, perUnit: 320, tone: 1 }), { pos: [x, yc, 0] }));
    // copper lid: the switch package's heat spreader
    parts.push(PC.T(PC.accent(PC.plane({ w: SW - 0.05, d: SD - 0.05, n: 1650 }), 0.72), { pos: [x, yT, 0] }));
    parts.push(PC.accent(outline(SW - 0.05, SD - 0.05, yT + 0.002, x, 0, 460, 1), 1));
    parts.push(PC.accent(outline(SW - 0.10, SD - 0.10, yT + 0.003, x, 0, 340, 1), 0.85));
    // the die footprint drawn in ink over the copper, with its port rows
    parts.push(outline(SW * 0.42, SD * 0.44, yT + 0.004, x, 0, 460, 1));
    for (var q = 0; q < 5; q++) {
      var qz = (q - 2) * SD * 0.082;
      parts.push(PC.line({ a: [x - SW * 0.19, yT + 0.004, qz], b: [x + SW * 0.19, yT + 0.004, qz], perUnit: 420, tone: 0.85 }));
    }
    // retention screws
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        parts.push(PC.T(PC.circle({ r: 0.011, perUnit: 600, tone: 1 }), { pos: [x + sx * (SW / 2 - 0.017), yT + 0.002, sz * (SD / 2 - 0.017)] }));
      });
    });
  });
  // fan-out traces from each switch to the land grids of both rows
  var traces = [];
  swX.forEach(function (x) {
    for (var i = 0; i < 7; i++) {
      var o = (i - 3) * 0.020;
      [1, -1].forEach(function (s) {
        traces.push(PC.polyline({
          pts: [[x + o, top + 0.002, s * SD / 2], [x + o, top + 0.002, s * 0.132], [x + o * 1.9 + (x > 0 ? 0.09 : -0.09), top + 0.002, s * 0.163]],
          perUnit: 260, tone: 0.4
        }));
      });
    }
  });
  parts.push(PC.merge.apply(null, traces));

  // ---------- voltage-regulator banks down the long edges ----------
  // Kept low and open: they should read as a rhythm at the rim, not as a fence.
  function stage(x, z, w, h, d) {
    parts.push(PC.T(PC.box({ w: w, h: h, d: d, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 110, tone: 0.46 }), { pos: [x, top + h / 2, z] }));
    parts.push(PC.T(PC.boxEdges({ w: w, h: h, d: d, perUnit: 260, tone: 0.85 }), { pos: [x, top + h / 2, z] }));
  }
  var vz = BD / 2 - 0.050;
  for (var i2 = 0; i2 < 13; i2++) {
    var vx = (i2 - 6) * 0.085;
    stage(vx, -vz, 0.044, 0.026, 0.044);
    stage(vx, vz, 0.044, 0.026, 0.044);
  }
  // bulk capacitors: two rows of cans between the regulators and the modules
  for (i2 = 0; i2 < 20; i2++) {
    var cx = (i2 % 10 - 4.5) * 0.088, cz = (i2 < 10 ? -1 : 1) * (BD / 2 - 0.112);
    parts.push(PC.T(PC.cylinder({ r: 0.014, h: 0.030, caps: false, n: 120, tone: 0.46 }), { pos: [cx, top + 0.015, cz] }));
    parts.push(PC.T(PC.circle({ r: 0.014, perUnit: 460, tone: 0.95 }), { pos: [cx, top + 0.030, cz] }));
  }

  // ---------- power blades at one end, the high-density connectors at the other ----------
  [-1, 1].forEach(function (s) {
    var px = -BW / 2 + 0.062, pz = s * 0.17;
    parts.push(PC.T(PC.box({ w: 0.084, h: 0.058, d: 0.20, n: 620, tone: 0.5 }), { pos: [px, top + 0.029, pz] }));
    parts.push(PC.T(PC.boxEdges({ w: 0.084, h: 0.058, d: 0.20, perUnit: 340, tone: 1 }), { pos: [px, top + 0.029, pz] }));
    for (var k = 0; k < 7; k++) {
      var kz = pz + (k - 3) * 0.026;
      parts.push(PC.line({ a: [px - 0.036, top + 0.059, kz], b: [px + 0.036, top + 0.059, kz], perUnit: 460, tone: 0.9 }));
    }
  });
  var cw = 0.052, ch = 0.050, cd = 0.185, cx2 = BW / 2 - 0.042;
  for (i2 = 0; i2 < 4; i2++) {
    var z2 = (i2 - 1.5) * 0.245;
    parts.push(PC.T(PC.box({ w: cw, h: ch, d: cd, n: 420, tone: 0.5 }), { pos: [cx2, top + ch / 2, z2] }));
    parts.push(PC.T(PC.boxEdges({ w: cw, h: ch, d: cd, perUnit: 340, tone: 1 }), { pos: [cx2, top + ch / 2, z2] }));
    for (var k2 = 0; k2 < 20; k2++) {
      var pz2 = z2 + (k2 - 9.5) * (cd * 0.88 / 19);
      parts.push(PC.line({ a: [cx2 + cw / 2, top + 0.008, pz2], b: [cx2 + cw / 2, top + ch - 0.010, pz2], perUnit: 280, tone: 0.72 }));
    }
    // the differential pairs that leave the board through it
    for (k2 = 0; k2 < 5; k2++) {
      var oz = z2 + (k2 - 2) * 0.030;
      parts.push(PC.polyline({ pts: [[cx2 - cw / 2, top + 0.002, oz], [0.72, top + 0.002, oz], [0.70, top + 0.002, oz * 0.86]], perUnit: 240, tone: 0.4 }));
    }
  }

  // ---------- mounting holes and a silkscreen border ----------
  var holes = [];
  [-1, 1].forEach(function (sx) {
    [-1, 1].forEach(function (sz) {
      holes.push(PC.T(PC.circle({ r: 0.028, perUnit: 520, tone: 1 }), { pos: [sx * (BW / 2 - 0.042), top + 0.002, sz * (BD / 2 - 0.030)] }));
      holes.push(PC.T(PC.circle({ r: 0.028, perUnit: 520, tone: 1 }), { pos: [sx * 0.352, top + 0.002, sz * (BD / 2 - 0.030)] }));
    });
  });
  parts.push(PC.merge.apply(null, holes));
  parts.push(outline(BW - 0.016, BD - 0.016, top + 0.001, 0, 0, 240, 0.5));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.55, -0.6, 0],
    // colour: the switch package lid is a nickel-plated copper heat spreader, so it shows nickel's cool silver, not copper
    accent: [127, 138, 147], accentDark: [201, 209, 215],
    caption: 'An eight-GPU baseboard, about 510 by 400 mm: eight accelerator modules bolted into retention frames in two rows of four, flipped so their land grids face the middle, where the two NVLink switch chips sit in nickel. Voltage-regulator banks line the long edges; the high-density connectors run along the front.'
  };
});

})(window.PC);}catch(e){console.warn('specimen gpu-baseboard.js failed to load', e);}
/* hbm-stack.js */
try{(function(PC){
/* Specimen: a 12-high HBM3E stack, exploded inside its molding compound.
 *
 * Real object: an 11 x 11 mm cube, 0.72 mm tall (Micron's HBM3E product brief:
 * "11mm x 11mm x 0.72mm"), holding a logic base die and
 * twelve DRAM dies each ground to about 30 um, joined by micro-bumps and pierced
 * by through-silicon vias down the middle of every die. Wikipedia's HBM article
 * gives the 30 um die thickness; Samsung's 36 GB HBM3E 12H release gives the
 * 7 um die-to-die gap and the rule that a 12-high must fit the same height as an
 * 8-high.
 *
 * Drawing decisions:
 *  - Footprint is to scale (1 mm = 0.09 units). Thicknesses and gaps are
 *    exaggerated about fifteen times, chosen so the exploded assembly is roughly
 *    as tall as it is wide: at true scale this object is a tile, not a cube, and
 *    at the old 40x explosion it read as a tall slab.
 *  - The molding compound is drawn as a faint shell around the whole stack. It
 *    is what makes the finished part a cube, and it is what the reader is being
 *    shown the inside of.
 *  - The base die is wider, twice as thick, copper, and carries its own logic
 *    floorplan, so it cannot be mistaken for a thirteenth DRAM die.
 */
PC.register('hbm-stack', function (p) {
  var mm = 0.09;
  var W = 10.6 * mm, D = 10.6 * mm;         // DRAM die footprint, drawn a shade inside the cube
  var bW = 11 * mm, bD = 11 * mm;           // base die and molding: the cube's 11 x 11 mm footprint
  var t = 0.040, bt = 0.080;                // drawn thicknesses (~15x life)
  var pitch = 0.062;                        // gap is 55% of a die's own thickness
  var baseGap = 0.046;                      // a wider step off the base die
  var dies = 12;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function rect(w, d, per, tn) {
    return PC.polyline({ pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- levels ----------
  var yBase = 0, baseTop = bt / 2;
  var lvl = [];                                   // bottom face of each DRAM die
  for (var i = 0; i < dies; i++) lvl.push(baseTop + baseGap + pitch * i);
  var yTop = lvl[dies - 1] + t;                   // top face of the twelfth die

  // ---------- molding compound: the faint shell that makes this a cube ----------
  var mH = yTop + 0.014 - baseTop, mY = baseTop + mH / 2;
  add(PC.T(PC.accent2(PC.box({ w: bW, h: mH, d: bD, faces: ['px', 'nx', 'pz', 'nz'], n: 4600 }), 0.16), { pos: [0, mY, 0] }));
  add(PC.T(PC.accent2(PC.plane({ w: bW, d: bD, n: 1600 }), 0.15), { pos: [0, baseTop + mH, 0] }));
  add(PC.T(PC.accent2(PC.boxEdges({ w: bW, h: mH, d: bD, perUnit: 190 }), 0.4), { pos: [0, mY, 0] }));

  // ---------- the logic base die (copper) ----------
  add(PC.T(PC.plane({ w: bW, d: bD, n: 1900, tone: 0.3 }), { pos: [0, baseTop, 0] }));
  add(PC.T(PC.accent(PC.box({ w: bW, h: bt, d: bD, faces: ['px', 'nx', 'pz', 'nz'], n: 2400 }), 0.58), { pos: [0, yBase, 0] }));
  add(PC.T(PC.accent(PC.boxEdges({ w: bW, h: bt, d: bD, perUnit: 320 }), 1), { pos: [0, yBase, 0] }));
  // its floorplan: two wide PHY strips facing the dies, a controller block between them
  var bl = [];
  bl.push(PC.T(rect(bW * 0.86, bD * 0.2, 150, 1), { pos: [0, baseTop + 0.003, -bD * 0.33] }));
  bl.push(PC.T(rect(bW * 0.86, bD * 0.2, 150, 1), { pos: [0, baseTop + 0.003, bD * 0.33] }));
  bl.push(PC.T(rect(bW * 0.5, bD * 0.3, 150, 1), { pos: [0, baseTop + 0.003, 0] }));
  for (i = 0; i < 7; i++) {
    var bx = (i - 3) * bW * 0.12;
    bl.push(PC.line({ a: [bx, baseTop + 0.003, -bD * 0.42], b: [bx, baseTop + 0.003, -bD * 0.24], perUnit: 130, tone: 1 }));
    bl.push(PC.line({ a: [bx, baseTop + 0.003, bD * 0.24], b: [bx, baseTop + 0.003, bD * 0.42], perUnit: 130, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, bl), 0.75));
  // the micro-bumps that carry the cube down onto the interposer
  add(PC.T(PC.accent(PC.dots({ nx: 16, nz: 17, sx: bW / 17, sz: bD / 18, per: 3 }), 0.5), { pos: [0, yBase - bt / 2 - 0.018, 0] }));

  // ---------- the through-silicon-via farm, down the middle of every die ----------
  var tsv = [], fx = W * 0.30, fz = D * 0.66;
  for (var a = 0; a < 4; a++) for (var b = 0; b < 9; b++) {
    tsv.push([(a - 1.5) * fx / 3.4, (b - 4) * fz / 8.6]);
  }

  // ---------- the twelve DRAM dies ----------
  for (i = 0; i < dies; i++) {
    var y = lvl[i], yc = y + t / 2;
    add(PC.T(PC.plane({ w: W, d: D, n: 800, tone: 0.26 }), { pos: [0, y + t, 0] }));
    add(PC.T(PC.box({ w: W, h: t, d: D, faces: ['px', 'nx', 'pz', 'nz'], n: 950, tone: 0.4 }), { pos: [0, yc, 0] }));
    // one crisp outline on the top edge and a softer one below: the layer line an
    // engraver would draw, and half the ink of a full wireframe box
    add(PC.T(rect(W, D, 240, 0.95), { pos: [0, y + t, 0] }));
    add(PC.T(rect(W, D, 105, 0.45), { pos: [0, y, 0] }));
    // the micro-bumps sitting in the gap under this die
    add(PC.T(PC.dots({ nx: 11, nz: 12, sx: W / 12, sz: D / 13, per: 3, tone: 0.62 }), { pos: [0, y - (i === 0 ? baseGap : pitch - t) / 2, 0] }));
    // the TSV farm outline, so the reader sees where the vias pierce the silicon
    add(PC.T(rect(fx, fz, 130, 0.4), { pos: [0, y + t + 0.002, 0] }));
  }

  // ---------- the bank floorplan, drawn only on the fully visible top die ----------
  var bank = [];
  for (a = 0; a < 2; a++) for (b = 0; b < 4; b++) {
    var cx = (a - 0.5) * W * 0.44, cz = (b - 1.5) * D * 0.225;
    bank.push(PC.T(rect(W * 0.34, D * 0.19, 190, 0.85), { pos: [cx, yTop + 0.003, cz] }));
  }
  add(PC.merge.apply(null, bank));

  // ---------- TSVs: faint the whole height, bright inside each die ----------
  var tl = [], yLow = yBase - bt / 2;
  for (i = 0; i < tsv.length; i++) {
    tl.push(PC.line({ a: [tsv[i][0], yLow, tsv[i][1]], b: [tsv[i][0], yTop, tsv[i][1]], perUnit: 80, tone: 0.15 }));
    tl.push(PC.accent(PC.line({ a: [tsv[i][0], yLow, tsv[i][1]], b: [tsv[i][0], baseTop, tsv[i][1]], perUnit: 260 }), 0.6));
    for (var k = 0; k < dies; k++) {
      tl.push(PC.accent(PC.line({ a: [tsv[i][0], lvl[k], tsv[i][1]], b: [tsv[i][0], lvl[k] + t, tsv[i][1]], perUnit: 240 }), 0.6));
    }
  }
  add(PC.merge.apply(null, tl));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.40, -0.68, 0],
    // colour: the base die's wiring, the micro-bumps and the through-silicon vias are electroplated copper
    accent: [176, 102, 44], accentDark: [224, 154, 92],
    // colour: the shell round the stack is epoxy molding compound, which is black
    accent2: [43, 39, 36], accent2Dark: [107, 101, 95],
    caption: 'A twelve-high HBM stack opened up: twelve DRAM dies, each ground to about thirty micrometers, lifted off the copper-colored logic base die, with micro-bumps in every gap and through-silicon vias running the full height. The faint box around them is the molding compound that makes the finished part a cube. Footprint is to scale; thicknesses and gaps are exaggerated about fifteen times, because the real cube is only 0.72 mm tall.'
  };
});

})(window.PC);}catch(e){console.warn('specimen hbm-stack.js failed to load', e);}
/* package.js */
try{(function(PC){
/* Specimen: an AI accelerator package. Parameterised by p.layout (mm).
 *
 *   { interposer: [w, h],              // one interposer centred on the package
 *     interposers: [{x,y,w,h}, ...],   // or several 2.5D sub-assemblies on one substrate
 *     base:  [{x,y,w,h}, ...],         // optional base / IO dies (MI300-style 3.5D)
 *     dies:  [{x,y,w,h}, ...],         // logic dies and chiplets; those that sit
 *                                      //   inside a base rectangle are drawn raised on it
 *     hbm:   [{x,y,w,h}, ...],         // memory stacks
 *     substrate: [w, h] }
 *
 *   or { waferScale: true, diameterMm: 300, dieGrid: [cols, rows], squareMm: 215 }
 *
 * Centres are relative to the package centre; x runs across, y along the depth axis.
 * `interposer: null` (with no `interposers`) means a flip-chip part with no interposer
 * at all: the die sits straight on the build-up substrate.
 * Layout objects may also carry "estimated", "sources" and "note" fields; the renderer
 * ignores them.
 *
 * Vertical dimensions are exaggerated about 4x against the plan, or the whole thing
 * reads as a flat grey rectangle. The caption says so.
 * Default (no params): the two-die, eight-HBM Blackwell-style layout.
 */
PC.register('package', function (p) {
  // colour: the highlighted parts are bare silicon (the wafer-scale square, the exposed top die of each HBM stack), a mirror that reads as cool silver
  var SILICON = [111, 139, 166], SILICON_DARK = [195, 211, 226];
  var plan = !!(p && p.plan); // the AI Chips page asks for a near top-down view so layouts compare across chips
  var L = (p && p.layout) || {
    interposer: [78, 50],
    dies: [{ x: -13.5, y: 0, w: 26, h: 32.5 }, { x: 13.5, y: 0, w: 26, h: 32.5 }],
    hbm: [{ x: -33.5, y: 17.7, w: 11, h: 11 }, { x: -33.5, y: 5.9, w: 11, h: 11 }, { x: -33.5, y: -5.9, w: 11, h: 11 }, { x: -33.5, y: -17.7, w: 11, h: 11 },
          { x: 33.5, y: 17.7, w: 11, h: 11 }, { x: 33.5, y: 5.9, w: 11, h: 11 }, { x: 33.5, y: -5.9, w: 11, h: 11 }, { x: 33.5, y: -17.7, w: 11, h: 11 }],
    substrate: [95, 68]
  };

  var S = 1 / 60;    // mm -> scene units, in plan
  var VX = 4;        // vertical exaggeration
  function Y(mm) { return mm * S * VX; }
  var parts = [];
  function add(c) { if (c && c.length) parts.push(c); }

  // rectangle outline in the XZ plane, centred at the origin
  function outline(w, d, tone, perUnit) {
    return PC.polyline({
      pts: [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]],
      closed: true, perUnit: perUnit || 300, tone: tone
    });
  }
  // a rectangle of points with one or more rectangles punched out of it
  function frame(ow, od, holes, tone, dens) {
    var hole = 0;
    holes.forEach(function (h) { hole += h.w * h.d; });
    var a = Math.max(ow * od * 0.02, ow * od - hole);
    var n = PC.area(a * (dens == null ? 1 : dens));
    var c = new Float32Array(n * 4), i = 0, guard = 0;
    while (i < n && guard++ < n * 40) {
      var x = (PC.rnd() - 0.5) * ow, z = (PC.rnd() - 0.5) * od, in_ = false;
      for (var k = 0; k < holes.length; k++) {
        var h = holes[k];
        if (Math.abs(x - h.x) < h.w / 2 && Math.abs(z - h.z) < h.d / 2) { in_ = true; break; }
      }
      if (in_) continue;
      c[i * 4] = x; c[i * 4 + 1] = 0; c[i * 4 + 2] = z; c[i * 4 + 3] = tone; i++;
    }
    return c.subarray(0, i * 4);
  }

  // ---------- wafer-scale variant ----------
  if (L.waferScale) {
    var R = (L.diameterMm || 300) / 2 * S, th = Y(0.9);
    var body = PC.cylinder({ r: R, h: th, n: 40000, tone: 0.33 });
    var keep = [];
    for (var i = 0; i < body.length; i += 4) { // notch at the top of the wafer
      var bx = body[i], bz = body[i + 2];
      if (Math.sqrt(bx * bx + (bz - R) * (bz - R)) < R * 0.045) continue;
      keep.push(body[i], body[i + 1], body[i + 2], body[i + 3]);
    }
    add(new Float32Array(keep));
    var side = L.squareMm ? L.squareMm * S : 2 * R * 0.7;
    var cols = (L.dieGrid && L.dieGrid[0]) || 12, rows = (L.dieGrid && L.dieGrid[1]) || 7;
    var dw = side / cols, dh = side / rows, yTopW = th / 2 + 0.004, live = 0;
    for (var gx = 0; gx < cols; gx++) for (var gz = 0; gz < rows; gz++) {
      var cx = (gx - (cols - 1) / 2) * dw, cz = (gz - (rows - 1) / 2) * dh;
      if (cx * cx + cz * cz > R * R) continue;
      live++;
      // the scribe lines between dies stay in place on a wafer-scale part: draw them light
      add(PC.T(outline(dw * 0.985, dh * 0.985, 0.9, 150), { pos: [cx, yTopW, cz] }));
      add(PC.T(PC.dots({ nx: 4, nz: 6, sx: dw / 5.5, sz: dh / 7.5, tone: 0.4 }), { pos: [cx, yTopW, cz] }));
    }
    // the square that is actually cut out of the wafer
    add(PC.T(PC.accent(outline(side, side, 1, 520), 0.95), { pos: [0, yTopW + 0.003, 0] }));
    add(PC.T(PC.accent(PC.circle({ r: R * 0.997, perUnit: 260 }), 0.5), { pos: [0, yTopW, 0] }));
    return {
      cloud: PC.merge.apply(null, parts), spin: plan ? 0.07 : 0.1, tilt: plan ? [1.32, 0, 0] : [0.95, -0.5, 0], turntable: plan,
      accent: SILICON, accentDark: SILICON_DARK,
      caption: 'A wafer-scale processor: a ' + Math.round(side / S) + ' mm square (silver) cut from a '
        + (L.diameterMm || 300) + ' mm wafer, its ' + live + '-die grid left in place and wired together across the scribe lines. No interposer, no HBM.'
    };
  }

  // ---------- conventional package ----------
  var dies = L.dies || [], base = L.base || [], hbm = L.hbm || [];
  var ips = L.interposers ? L.interposers.slice()
    : (L.interposer ? [{ x: 0, y: 0, w: L.interposer[0], h: L.interposer[1] }] : []);

  function envelope(list) {
    var e = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    list.forEach(function (r) {
      e.x0 = Math.min(e.x0, r.x - r.w / 2); e.x1 = Math.max(e.x1, r.x + r.w / 2);
      e.y0 = Math.min(e.y0, r.y - r.h / 2); e.y1 = Math.max(e.y1, r.y + r.h / 2);
    });
    if (!list.length) { e = { x0: -1, x1: 1, y0: -1, y1: 1 }; }
    e.w = e.x1 - e.x0; e.h = e.y1 - e.y0;
    return e;
  }
  var stack = envelope(ips.length ? ips : dies.concat(base, hbm));   // what the ring encloses
  var sub = L.substrate || [stack.w + 24, stack.h + 24];
  // small packages would come out thin at the shared density, big ones too heavy:
  // scale the point budget by area against a 6,500 mm2 reference package
  var d0 = PC.density;
  PC.density = d0 * Math.max(0.8, Math.min(2.2, Math.sqrt(6500 / (sub[0] * sub[1]))));

  var hSub = 2.2, hIp = 0.9, hBase = 0.8, hDie = 0.85, hHbm = 2.0;
  var subW = sub[0] * S, subD = sub[1] * S, subH = Y(hSub);
  var ipH = ips.length ? Y(hIp) : 0;
  var y0 = subH / 2;              // top of the substrate
  var yIpTop = y0 + ipH;          // the plane the dies and stacks sit on

  // --- substrate: walls, edges, ball grid, and only the top that is actually exposed ---
  add(PC.box({ w: subW, h: subH, d: subD, faces: ['px', 'nx', 'pz', 'nz'], n: 5200, tone: 0.24 }));
  add(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 180, tone: 0.6 }));
  var ipHoles = ips.map(function (r) { return { x: r.x * S, z: -r.y * S, w: r.w * S, d: r.h * S }; });
  add(PC.T(frame(subW, subD, ipHoles, 0.2, 0.45), { pos: [0, y0, 0] }));
  var pitch = 2.8 * S;
  add(PC.T(PC.dots({
    nx: Math.max(6, Math.floor(subW / pitch) - 1), nz: Math.max(6, Math.floor(subD / pitch) - 1),
    sx: pitch, sz: pitch, per: 2, tone: 0.26
  }), { pos: [0, -subH / 2 - Y(0.5), 0] }));

  // --- stiffener ring: a metal frame on the substrate edge, no lid over the dies ---
  var ringOut = [subW - 2 * 1.2 * S, subD - 2 * 1.2 * S];
  var gapMm = 3.2;
  var ringIn = [Math.min(ringOut[0] - 8 * S, (stack.w + 2 * gapMm) * S), Math.min(ringOut[1] - 8 * S, (stack.h + 2 * gapMm) * S)];
  var rh = Y(hIp + hDie * 0.65), yr = y0 + rh / 2;
  add(PC.T(PC.box({ w: ringOut[0], h: rh, d: ringOut[1], faces: ['px', 'nx', 'pz', 'nz'], n: 2200, tone: 0.3 }), { pos: [0, yr, 0] }));
  add(PC.T(PC.box({ w: ringIn[0], h: rh, d: ringIn[1], faces: ['px', 'nx', 'pz', 'nz'], n: 1300, tone: 0.2 }), { pos: [0, yr, 0] }));
  add(PC.T(frame(ringOut[0], ringOut[1], [{ x: 0, z: 0, w: ringIn[0], d: ringIn[1] }], 0.26, 0.45), { pos: [0, y0 + rh, 0] }));
  add(PC.T(outline(ringOut[0], ringOut[1], 0.75, 240), { pos: [0, y0 + rh + 0.002, 0] }));
  add(PC.T(outline(ringIn[0], ringIn[1], 0.8, 240), { pos: [0, y0 + rh + 0.002, 0] }));
  add(PC.T(outline(ringIn[0], ringIn[1], 0.45, 200), { pos: [0, y0 + 0.002, 0] }));

  // --- interposers ---
  ips.forEach(function (r) {
    var w = r.w * S, d = r.h * S, x = r.x * S, z = -r.y * S;
    add(PC.T(PC.box({ w: w, h: ipH, d: d, faces: ['px', 'nx', 'pz', 'nz'], n: 2600, tone: 0.4 }), { pos: [x, y0 + ipH / 2, z] }));
    add(PC.T(PC.boxEdges({ w: w, h: ipH, d: d, perUnit: 260, tone: 0.9 }), { pos: [x, y0 + ipH / 2, z] }));
    // the silicon surface, and the through-silicon vias standing on it
    add(PC.T(PC.plane({ w: w, d: d, n: PC.area(w * d * 0.55), tone: 0.24 }), { pos: [x, yIpTop + 0.001, z] }));
    var vp = 1.6 * S;
    add(PC.T(PC.dots({ nx: Math.floor(w / vp), nz: Math.floor(d / vp), sx: vp, per: 2, tone: 0.4 }), { pos: [x, yIpTop + 0.002, z] }));
    add(PC.T(outline(w, d, 0.9, 300), { pos: [x, yIpTop + 0.003, z] }));
  });

  // --- base / IO dies, with the compute chiplets stepped up on top of them ---
  var baseH = base.length ? Y(hBase) : 0;
  base.forEach(function (b) {
    var w = b.w * S, d = b.h * S, x = b.x * S, z = -b.y * S;
    add(PC.T(PC.box({ w: w, h: baseH, d: d, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: PC.area(w * d * 1.2 + 2 * (w + d) * baseH), tone: 0.42 }), { pos: [x, yIpTop + baseH / 2, z] }));
    add(PC.T(PC.boxEdges({ w: w, h: baseH, d: d, perUnit: 300, tone: 0.9 }), { pos: [x, yIpTop + baseH / 2, z] }));
    // hybrid-bond pad field on the exposed shoulder of the base die
    add(PC.T(PC.dots({ nx: Math.max(4, Math.round(w / (1.4 * S))), nz: Math.max(4, Math.round(d / (1.4 * S))), sx: 1.4 * S, tone: 0.34 }), { pos: [x, yIpTop + baseH + 0.002, z] }));
  });

  // --- logic dies and chiplets: the busiest ink in the picture ---
  var dieH = Y(hDie);
  dies.forEach(function (dd) {
    var onBase = base.some(function (b) {
      return Math.abs(dd.x - b.x) <= b.w / 2 && Math.abs(dd.y - b.y) <= b.h / 2;
    });
    var w = dd.w * S, d = dd.h * S, x = dd.x * S, z = -dd.y * S;
    var yb = yIpTop + (onBase ? baseH : 0), yc = yb + dieH / 2, yt = yb + dieH;
    add(PC.T(PC.box({ w: w, h: dieH, d: d, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: PC.area(w * d * 2.4 + 2 * (w + d) * dieH), tone: 0.5 }), { pos: [x, yc, z] }));
    add(PC.T(PC.boxEdges({ w: w, h: dieH, d: d, perUnit: 380, tone: 1 }), { pos: [x, yc, z] }));
    // floorplan on the die top: memory PHY strips down the long edges and a core block grid
    var fp = [], phy = Math.min(w, d) * 0.13, mx = w / 2 - phy, mz = d / 2;
    fp.push(outline(w - 2 * phy, d * 0.94, 0.85, 240));
    fp.push(PC.line({ a: [-mx, 0, -mz * 0.94], b: [-mx, 0, mz * 0.94], perUnit: 200, tone: 0.55 }));
    fp.push(PC.line({ a: [mx, 0, -mz * 0.94], b: [mx, 0, mz * 0.94], perUnit: 200, tone: 0.55 }));
    var nx = Math.max(2, Math.round(dd.w / 6)), nz = Math.max(2, Math.round(dd.h / 5));
    var bw = (w - 2 * phy) * 0.92 / nx, bd = d * 0.88 / nz;
    for (var a = 0; a < nx; a++) for (var b2 = 0; b2 < nz; b2++) {
      fp.push(PC.T(outline(bw * 0.84, bd * 0.84, 0.7, 190), { pos: [(a - (nx - 1) / 2) * bw, 0, (b2 - (nz - 1) / 2) * bd] }));
    }
    // PHY bumps along both long edges
    fp.push(PC.T(PC.dots({ nx: 2, nz: nz * 3, sx: phy * 0.5, sz: d * 0.9 / (nz * 3), tone: 0.5 }), { pos: [-w / 2 + phy / 2, 0, 0] }));
    fp.push(PC.T(PC.dots({ nx: 2, nz: nz * 3, sx: phy * 0.5, sz: d * 0.9 / (nz * 3), tone: 0.5 }), { pos: [w / 2 - phy / 2, 0, 0] }));
    add(PC.T(PC.merge.apply(null, fp), { pos: [x, yt + 0.003, z] }));
  });

  // --- HBM stacks: layered boxes with silver tops ---
  var hbmH = Y(hHbm), layers = 8;
  hbm.forEach(function (h) {
    var w = h.w * S, d = h.h * S, x = h.x * S, z = -h.y * S;
    add(PC.T(PC.box({ w: w, h: hbmH, d: d, faces: ['px', 'nx', 'pz', 'nz'], tone: 0.4 }), { pos: [x, yIpTop + hbmH / 2, z] }));
    for (var k = 1; k <= layers; k++) {
      add(PC.T(outline(w, d, 0.8, 190), { pos: [x, yIpTop + hbmH * k / (layers + 1), z] }));
    }
    add(PC.T(PC.accent(PC.plane({ w: w * 0.94, d: d * 0.94 }), 0.55), { pos: [x, yIpTop + hbmH, z] }));
    add(PC.T(PC.accent(outline(w, d, 1, 320)), { pos: [x, yIpTop + hbmH + 0.002, z] }));
  });

  var nd = dies.length, nh = hbm.length, nb = base.length, ni = ips.length;
  var cap = 'An accelerator package, seen with its vertical dimensions exaggerated about '
    + VX + 'x: ' + nd + ' logic die' + (nd === 1 ? '' : 's')
    + (nb ? ' stepped up on ' + nb + ' base die' + (nb === 1 ? '' : 's') : '')
    + (nh ? ' and ' + nh + ' HBM stack' + (nh === 1 ? '' : 's') + ' (silver tops)' : ' and no HBM')
    + (ni === 0 ? ', flip-chipped straight onto the build-up substrate'
      : ni === 1 ? ' on a silicon interposer' : ' across ' + ni + ' separate interposers')
    + ', inside a lid-less stiffener ring, with the ball grid below.';

  PC.density = d0;
  return { cloud: PC.merge.apply(null, parts), spin: plan ? 0.07 : 0.1, tilt: plan ? [1.32, 0, 0] : [0.55, -0.7, 0], turntable: plan, caption: cap, accent: SILICON, accentDark: SILICON_DARK };
});

})(window.PC);}catch(e){console.warn('specimen package.js failed to load', e);}
/* photomask.js */
try{(function(PC){
/* Specimen: an EUV photomask (reticle) with its pellicle.
 *
 * Dimensions are the SEMI ones, in millimetres, scaled 1:100: a 152.4 mm
 * square blank 6.35 mm thick, carrying a 132 x 104 mm patterned field (4x the
 * 33 x 26 mm field it prints on the wafer), inside a black border, with
 * bar-in-bar fiducials at the corners. The pellicle frame stands 2.5 mm clear
 * of the mask surface on four glued pads, which is the real standoff and is
 * therefore a very shallow gap.
 *
 * The one liberty: the Mo/Si multilayer. Forty bilayers come to about 280 nm,
 * or four ten-thousandths of the blank's thickness, so it would be invisible.
 * It is drawn here as a copper band of fine lines round the top edge of the
 * blank - the mirror that makes an EUV mask a mirror rather than a window, and
 * the thing two Japanese firms make almost all of. That band is the only
 * copper in the drawing.
 */
PC.register('photomask', function (p) {
  var S = 1 / 100;                 // mm -> units
  var B = 152.4 * S, T = 6.35 * S; // blank size and thickness
  var PW = 132 * S, PD = 104 * S;  // patterned field
  var yTop = T / 2, yBot = -T / 2, yPat = yTop + 0.0025;
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }
  // a band of points wrapped round the four side faces, between two heights
  function band(w, d, y0, y1, tn, dens) {
    var per = 2 * (w + d), n = Math.max(120, Math.round(per * (y1 - y0) * (dens || 1) * PC.k));
    var c = new Float32Array(n * 4);
    for (var i = 0; i < n; i++) {
      var t = PC.rnd() * per, y = y0 + PC.rnd() * (y1 - y0), x, z;
      if (t < w) { x = t - w / 2; z = -d / 2; }
      else if (t < w + d) { x = w / 2; z = t - w - d / 2; }
      else if (t < 2 * w + d) { x = w / 2 - (t - w - d); z = d / 2; }
      else { x = -w / 2; z = d / 2 - (t - 2 * w - d); }
      c[i * 4] = x; c[i * 4 + 1] = y; c[i * 4 + 2] = z; c[i * 4 + 3] = tn;
    }
    return c;
  }

  /* ---------- the low-thermal-expansion blank ---------- */

  add(PC.T(PC.plane({ w: B, d: B, n: 9000, tone: 0.24 }), { pos: [0, yTop, 0] }));
  add(PC.box({ w: B, h: T, d: B, faces: ['px', 'nx', 'pz', 'nz'], n: 5200, tone: 0.30 }));
  add(PC.T(PC.plane({ w: B, d: B, n: 3400, tone: 0.20 }), { pos: [0, yBot, 0] }));
  add(PC.boxEdges({ w: B, h: T, d: B, perUnit: 340, tone: 0.95 }));
  // the chrome backside coating that the electrostatic chuck grips
  add(rect(146 * S, 146 * S, yBot - 0.0006, 260, 0.7));
  for (var q = 0; q < 3; q++) add(rect((146 - q * 5) * S, (146 - q * 5) * S, yBot - 0.0006, 130, 0.30));

  /* ---------- the Mo/Si multilayer, in copper ---------- */

  var mlTop = yTop - 0.0004, mlBot = yTop - 0.0105, ml = [];
  ml.push(band(B, B, mlBot, mlTop, 0.42, 1.3));
  for (var m = 0; m <= 7; m++) {
    ml.push(rect(B, B, mlBot + (mlTop - mlBot) * m / 7, 210, 0.95));
  }
  add(PC.accent(PC.merge.apply(null, ml), 0.9));

  /* ---------- absorber pattern ---------- */

  add(rect(142 * S, 142 * S, yPat, 240, 0.6));                 // quality area
  add(rect(PW + 10 * S, PD + 10 * S, yPat, 320, 1));           // black border, outer
  add(rect(PW, PD, yPat, 320, 1));                             // black border, inner
  var pat = [];
  var COLS = 7, ROWS = 5, cw = PW / COLS, cd = PD / ROWS;
  var MAP = ['AABBCCD', 'AABBCCD', 'EEFFGGD', 'HHIIGGJ', 'HHKKLLJ'];
  var seen = {}, keys = [];
  for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
    var ch = MAP[r].charAt(c);
    if (!seen[ch]) { seen[ch] = { c0: c, c1: c, r0: r, r1: r }; keys.push(ch); }
    else { seen[ch].c1 = Math.max(seen[ch].c1, c); seen[ch].r1 = Math.max(seen[ch].r1, r); }
  }
  for (var bi = 0; bi < keys.length; bi++) {
    var bk = seen[keys[bi]];
    var w = (bk.c1 - bk.c0 + 1) * cw - 4 * S, d = (bk.r1 - bk.r0 + 1) * cd - 4 * S;
    var x0 = ((bk.c0 + bk.c1) / 2 - (COLS - 1) / 2) * cw, z0 = ((bk.r0 + bk.r1) / 2 - (ROWS - 1) / 2) * cd;
    var style = bi % 4;
    pat.push(PC.T(rect(w, d, 0, 340, 0.95), { pos: [x0, yPat, z0] }));
    if (style === 0) {           // fine line array: logic standard cells
      var horiz = bi % 8 < 4, span = horiz ? d : w, nl = Math.max(6, Math.round(span / (2.7 * S)));
      for (var k = 0; k < nl; k++) {
        var t = (k / (nl - 1) - 0.5) * 0.88;
        pat.push(PC.T(horiz
          ? PC.line({ a: [-w * 0.44, 0, t * d], b: [w * 0.44, 0, t * d], perUnit: 250, tone: 1 })
          : PC.line({ a: [t * w, 0, -d * 0.44], b: [t * w, 0, d * 0.44], perUnit: 250, tone: 1 }),
          { pos: [x0, yPat, z0] }));
      }
    } else if (style === 1) {    // dense array: memory
      pat.push(PC.T(PC.plane({ w: w * 0.94, d: d * 0.94, n: Math.round(w * d * 2400), tone: 0.26 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: Math.round(w / (2.2 * S)), nz: Math.round(d / (2.2 * S)), sx: 2.2 * S, tone: 1 }), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(rect(w * 0.55, d * 0.55, 0, 220, 1), { pos: [x0, yPat, z0] }));
    } else if (style === 2) {    // nested rings: pad or analogue macro
      for (var qq = 1; qq <= 3; qq++) pat.push(PC.T(rect(w * qq / 3.6, d * qq / 3.6, 0, 240, 1), { pos: [x0, yPat, z0] }));
      pat.push(PC.T(PC.dots({ nx: 5, nz: 5, sx: w / 6, sz: d / 6, per: 2, tone: 0.9 }), { pos: [x0, yPat, z0] }));
    } else {                     // wide bars: power and bus
      var nb = Math.max(3, Math.round(d / (9 * S)));
      for (var b = 0; b < nb; b++) {
        var zz = (b / (nb - 1) - 0.5) * d * 0.76;
        pat.push(PC.T(PC.plane({ w: w * 0.88, d: d * 0.050, n: Math.round(w * 1300), tone: 1 }), { pos: [x0, yPat, z0 + zz] }));
      }
    }
  }
  for (var bl = 0; bl < 4; bl++) {
    var zb = (bl / 3 - 0.5) * PD * 0.92;
    pat.push(PC.line({ a: [-PW / 2, yPat, zb], b: [PW / 2, yPat, zb], perUnit: 200, tone: 0.8 }));
  }
  var sx, sz;
  for (sx = -1; sx <= 1; sx += 2) for (sz = -1; sz <= 1; sz += 2) {     // bar-in-bar fiducials
    var fx = sx * (PW / 2 + 9 * S), fz = sz * (PD / 2 + 9 * S);
    pat.push(PC.T(rect(9 * S, 9 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
    pat.push(PC.T(rect(4 * S, 4 * S, 0, 380, 1), { pos: [fx, yPat, fz] }));
  }
  add(PC.merge.apply(null, pat));

  /* ---------- pellicle: frame, pads, membrane ---------- */

  var FW = 145 * S, FD = 117 * S, bar = 4.5 * S, fh = 2.6 * S, stand = 2.5 * S;
  var yF = yTop + stand, yM = yF + fh;
  var fr = [
    PC.T(PC.box({ w: FW, h: fh, d: bar, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 1800, tone: 0.6 }), { pos: [0, yF + fh / 2, (FD - bar) / 2] }),
    PC.T(PC.box({ w: FW, h: fh, d: bar, faces: ['py', 'pz', 'nz', 'px', 'nx'], n: 1800, tone: 0.6 }), { pos: [0, yF + fh / 2, -(FD - bar) / 2] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, faces: ['py', 'px', 'nx'], n: 1500, tone: 0.6 }), { pos: [(FW - bar) / 2, yF + fh / 2, 0] }),
    PC.T(PC.box({ w: bar, h: fh, d: FD - 2 * bar, faces: ['py', 'px', 'nx'], n: 1500, tone: 0.6 }), { pos: [-(FW - bar) / 2, yF + fh / 2, 0] }),
    rect(FW, FD, yM, 420, 1),
    rect(FW - 2 * bar, FD - 2 * bar, yM, 380, 1),
    rect(FW, FD, yF, 380, 1),
    rect(FW - 2 * bar, FD - 2 * bar, yF, 260, 0.7)
  ];
  add(PC.merge.apply(null, fr));
  // the four glued pads that hold the frame off the mask, and the gap they make
  for (sx = -1; sx <= 1; sx += 2) for (sz = -1; sz <= 1; sz += 2) {
    var px = sx * (FW / 2 - bar / 2), pz = sz * (FD / 2 - bar / 2);
    add(PC.T(PC.box({ w: 5.5 * S, h: stand, d: 5.5 * S, faces: ['px', 'nx', 'pz', 'nz'], n: 520, tone: 0.7 }), { pos: [px, yTop + stand / 2, pz] }));
    add(PC.T(PC.boxEdges({ w: 5.5 * S, h: stand, d: 5.5 * S, perUnit: 420, tone: 1 }), { pos: [px, yTop + stand / 2, pz] }));
  }
  // the outline of the frame's footprint on the mask, and short ticks up the
  // 2.5 mm gap at the mid-edges, so a standoff this shallow still reads
  add(rect(FW, FD, yTop + 0.0008, 220, 0.45));
  for (var g = 0; g < 8; g++) {
    var gt = (g % 4) / 3 - 0.5, gx, gz;
    if (g < 4) { gx = gt * FW * 0.62; gz = (g < 2 ? -1 : 1) * FD / 2; }
    else { gx = (g < 6 ? -1 : 1) * FW / 2; gz = gt * FD * 0.62; }
    if (g < 4) gz = (g < 2 ? -1 : 1) * FD / 2, gx = ((g % 2) * 2 - 1) * FW * 0.26;
    else gz = ((g % 2) * 2 - 1) * FD * 0.26, gx = (g < 6 ? -1 : 1) * FW / 2;
    add(PC.line({ a: [gx, yTop + 0.0008, gz], b: [gx, yF, gz], perUnit: 900, tone: 0.85 }));
  }
  // vent filter on one frame bar
  add(PC.T(PC.box({ w: 9 * S, h: fh * 0.8, d: 4 * S, n: 380, tone: 0.55 }), { pos: [FW * 0.22, yF + fh / 2, -(FD / 2 + 1.6 * S)] }));
  add(PC.T(PC.boxEdges({ w: 9 * S, h: fh * 0.8, d: 4 * S, perUnit: 420, tone: 1 }), { pos: [FW * 0.22, yF + fh / 2, -(FD / 2 + 1.6 * S)] }));
  // the membrane: 50 nm of silicon, drawn as the faintest plane in the specimen
  add(PC.T(PC.plane({ w: FW - 2 * bar, d: FD - 2 * bar, n: 6000, tone: 0.13 }), { pos: [0, yM, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [1.0, -0.5, 0],
    // colour: the Mo/Si multilayer mirror reflects only at 13.5 nm; to the eye it is near-black with a faint blue sheen, so a dark steel blue
    accent: [62, 84, 104], accentDark: [142, 167, 192],
    caption: 'A six-inch EUV reticle: a 152 mm square of low-thermal-expansion glass, 6.35 mm thick, carrying a 132 x 104 mm patterned field inside its black border, with a pellicle frame held 2.5 mm off the surface on four glued pads and a membrane stretched across it. The dark blue band round the top edge is the molybdenum-silicon multilayer that makes the mask a mirror; forty bilayers are 280 nm thick in life, so they are drawn far thicker than they are.'
  };
});

})(window.PC);}catch(e){console.warn('specimen photomask.js failed to load', e);}
/* probe-card.js */
try{(function(PC){
/* Specimen: a vertical probe card over a wafer.
 *
 * Real object: a circular multilayer PCB about twelve inches across - wider than
 * the 300 mm wafer it works on - with a stiffener bolted over it that sets the
 * reference plane, a multi-layer ceramic space transformer hung underneath to fan
 * the tester's coarse pitch down to the die's, and a probe head of vertical
 * probes held between an upper and a lower guide plate. A probe card for a large
 * logic device carries four to five thousand probes at 80 to 150 um pitch, and
 * every tip must sit within about 25 um of the same plane.
 *
 * Sources: Tektronix's probe card tutorial (PCB layer counts, planarity, tip
 * geometry, overdrive), Glew Engineering on the twelve-inch card and the 4,000-pin
 * GPU array, and FormFactor/Technoprobe patents for the stiffener, MLC space
 * transformer and two-guide-plate probe head.
 *
 * Drawing decisions:
 *  - The card was previously drawn smaller than the wafer and with a hole through
 *    the middle. A vertical card is a solid disc slightly larger than the wafer.
 *  - The probes are drawn bowed between the two guide plates, which is what a
 *    buckling-beam probe does under overdrive, and is the only way a few hundred
 *    lines read as separate wires rather than a black bar.
 *  - Heights are exaggerated: a real card rides a millimetre or two off the wafer.
 */
PC.register('probe-card', function (p) {
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function seg(a, b, per, tn) { return PC.line({ a: a, b: b, perUnit: per, tone: tn }); }
  function ring(r, y, per, tn) { return PC.T(PC.circle({ r: r, perUnit: per, tone: tn }), { pos: [0, y, 0] }); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  var Rw = 1.00, Rc = 1.02, Rch = 1.08;        // wafer 300 mm, card 305 mm, chuck
  var tWaf = 0.028, wafTop = tWaf / 2;
  var dw = 0.20, dh = 0.245;                    // reticle-sized dies on the wafer

  // heights, measured from the wafer surface
  var yTip = wafTop, yLo = wafTop + 0.082, tG = 0.020;
  var yLoTop = yLo + tG, yUp = yLoTop + 0.082, yUpTop = yUp + tG;
  var stH = 0.100, yST = yUpTop + 0.052, stW = 0.50;
  var tPcb = 0.052, pcbBot = yST + stH + 0.030, pcbTop = pcbBot + tPcb;
  var gW = 0.40, hW = 0.46;                     // guide plates, probe-head frame

  /* ---------------- the printed circuit board ---------------- */
  add(PC.T(PC.disc({ r: Rc, n: 12000, tone: 0.3 }), { pos: [0, pcbTop, 0] }));
  add(PC.T(PC.disc({ r: Rc, n: 6000, tone: 0.26 }), { pos: [0, pcbBot, 0] }));
  add(PC.T(PC.cylinder({ r: Rc, h: tPcb, caps: false, n: 3000, tone: 0.5 }), { pos: [0, pcbBot + tPcb / 2, 0] }));
  add(ring(Rc, pcbTop, 400, 1)); add(ring(Rc, pcbBot, 400, 0.8));
  // the pogo pads the tester head lands on: three concentric rings of contacts
  var pads = [], i, a;
  [[0.56, 72], [0.66, 84], [0.76, 96]].forEach(function (r) {
    for (i = 0; i < r[1]; i++) {
      a = i * Math.PI * 2 / r[1] + (r[0] * 10 % 2) * Math.PI / r[1];
      pads.push(PC.T(PC.circle({ r: 0.0125, perUnit: 420, tone: 0.95 }), { pos: [r[0] * Math.cos(a), pcbTop + 0.003, r[0] * Math.sin(a)] }));
    }
  });
  // edge fingers and the six bolts that hold the stiffener down
  for (i = 0; i < 72; i++) {
    a = i * Math.PI * 2 / 72;
    pads.push(seg([0.87 * Math.cos(a), pcbTop + 0.003, 0.87 * Math.sin(a)], [0.97 * Math.cos(a), pcbTop + 0.003, 0.97 * Math.sin(a)], 420, 0.85));
  }
  for (i = 0; i < 6; i++) {
    a = i * Math.PI / 3 + Math.PI / 6;
    pads.push(PC.T(PC.circle({ r: 0.032, perUnit: 460, tone: 1 }), { pos: [0.44 * Math.cos(a), pcbTop + 0.004, 0.44 * Math.sin(a)] }));
  }
  // a flat on the rim: the card only goes into the prober one way round
  pads.push(seg([-0.19, pcbTop, -0.998], [0.19, pcbTop, -0.998], 500, 1));
  pads.push(seg([-0.19, pcbBot, -0.998], [0.19, pcbBot, -0.998], 400, 0.7));
  add(PC.merge.apply(null, pads));

  /* ---------------- the stiffener that sets the reference plane ---------------- */
  var armL = 0.86, armW = 0.105, armH = 0.05, yArm = pcbTop + armH / 2;
  for (i = 0; i < 2; i++) {
    var ang = i * Math.PI / 2;
    add(PC.T(PC.box({ w: armL * 2, h: armH, d: armW, n: 1900, tone: 0.28 }), { rot: [0, -ang, 0], pos: [0, yArm, 0] }));
    add(PC.T(PC.boxEdges({ w: armL * 2, h: armH, d: armW, perUnit: 240, tone: 0.85 }), { rot: [0, -ang, 0], pos: [0, yArm, 0] }));
  }
  add(PC.T(PC.cylinder({ r: 0.20, h: armH * 1.5, n: 1600, tone: 0.32 }), { pos: [0, pcbTop + armH * 0.75, 0] }));
  add(ring(0.20, pcbTop + armH * 1.5, 420, 1));
  // three levelling screws, the ones that bring every tip into the same plane
  for (i = 0; i < 3; i++) {
    a = i * Math.PI * 2 / 3 + 0.4;
    add(PC.T(PC.cylinder({ r: 0.036, h: armH * 2.1, n: 700, tone: 0.6 }), { pos: [0.30 * Math.cos(a), pcbTop + armH * 1.05, 0.30 * Math.sin(a)] }));
    add(ring(0.036, pcbTop + armH * 2.1, 420, 1));
  }

  /* ---------------- the space transformer: multi-layer ceramic ---------------- */
  var ySTc = yST + stH / 2;
  add(PC.T(PC.box({ w: stW, h: stH, d: stW, faces: ['px', 'nx', 'pz', 'nz'], n: 1800, tone: 0.26 }), { pos: [0, ySTc, 0] }));
  add(PC.T(PC.boxEdges({ w: stW, h: stH, d: stW, perUnit: 175, tone: 0.88 }), { pos: [0, ySTc, 0] }));
  for (i = 1; i < 7; i++) add(rect(stW, stW, yST + stH * i / 7, 52, 0.3));
  // the fan-out: the tester's coarse pitch on top, the die's fine pitch below
  add(PC.T(PC.dots({ nx: 15, nz: 15, sx: stW * 0.062, sz: stW * 0.062, per: 2, tone: 0.35 }), { pos: [0, yST + stH + 0.002, 0] }));

  /* ---------------- the probe head: two guide plates and the probes ---------------- */
  [[yLo, tG], [yUp, tG]].forEach(function (g) {
    add(PC.T(PC.box({ w: gW, h: g[1], d: gW, n: 700, tone: 0.22 }), { pos: [0, g[0] + g[1] / 2, 0] }));
    add(PC.T(PC.boxEdges({ w: gW, h: g[1], d: gW, perUnit: 190, tone: 0.92 }), { pos: [0, g[0] + g[1] / 2, 0] }));
  });
  for (i = 0; i < 4; i++) {
    var px = (i < 2 ? -1 : 1) * hW * 0.48, pz = (i % 2 ? -1 : 1) * hW * 0.48;
    add(seg([px, yLo, pz], [px, yUpTop, pz], 300, 0.5));
    add(seg([px, yUpTop, pz], [px, yST, pz], 300, 0.4));
  }

  // the probes themselves: an area array over a two-by-two block of dies,
  // bowed between the guide plates
  var needles = [], nx = 7, nz = 6;
  for (var gx = -1; gx <= 0; gx++) for (var gz = -1; gz <= 0; gz++) {
    var ox = (gx + 0.5) * dw, oz = (gz + 0.5) * dh;
    for (var a1 = 0; a1 < nx; a1++) for (var b1 = 0; b1 < nz; b1++) {
      var qx = ox + (a1 - (nx - 1) / 2) * (dw * 0.82 / (nx - 1));
      var qz = oz + (b1 - (nz - 1) / 2) * (dh * 0.82 / (nz - 1));
      var th = PC.rnd() * Math.PI * 2, bo = 0.012 + PC.rnd() * 0.007;
      // the shank, faint, so a few hundred wires stay grey rather than black
      needles.push(PC.polyline({
        pts: [[qx, yTip + 0.022, qz], [qx, yLo + tG * 0.4, qz],
              [qx + bo * Math.cos(th), (yLoTop + yUp) / 2, qz + bo * Math.sin(th)],
              [qx, yUp + tG * 0.6, qz], [qx, yUpTop + 0.004, qz]],
        perUnit: 110, tone: 0.38
      }));
      // the tip, where it touches the pad
      needles.push(seg([qx, yTip, qz], [qx, yTip + 0.024, qz], 340, 0.75));
    }
  }
  add(PC.merge.apply(null, needles));

  /* ---------------- the wafer on the chuck ---------------- */
  var body = PC.cylinder({ r: Rw, h: tWaf, n: 22000, tone: 0.36 }), keep = [];
  for (i = 0; i < body.length; i += 4) {
    var bx = body[i], bz = body[i + 2];
    if (Math.sqrt(bx * bx + (bz - Rw) * (bz - Rw)) < 0.052) continue;   // notch
    keep.push(bx, body[i + 1], bz, body[i + 3]);
  }
  add(new Float32Array(keep));
  add(ring(Rw, wafTop, 440, 1));

  var grid = [], probed = [], cx, cz;
  for (gx = -5; gx <= 5; gx++) for (gz = -5; gz <= 4; gz++) {
    cx = (gx + 0.5) * dw; cz = (gz + 0.5) * dh;
    var cor = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    if (!cor.every(function (c) { return c[0] * c[0] + c[1] * c[1] < (Rw - 0.02) * (Rw - 0.02); })) continue;
    if (gx >= -1 && gx <= 0 && gz >= -1 && gz <= 0) { probed.push([cx, cz]); continue; }
    grid.push(PC.T(rect(dw, dh, 0, 200, 0.9), { pos: [cx, wafTop + 0.002, cz] }));
  }
  add(PC.merge.apply(null, grid));

  // the four dies under the needles, in copper
  var site = [];
  probed.forEach(function (c) {
    site.push(PC.T(PC.plane({ w: dw * 0.97, d: dh * 0.97, n: 900 }), { pos: [c[0], wafTop + 0.0022, c[1]] }));
    site.push(PC.T(rect(dw, dh, 0, 300, 1), { pos: [c[0], wafTop + 0.003, c[1]] }));
  });
  site.push(PC.T(rect(2 * dw, 2 * dh, 0, 520, 1), { pos: [0, wafTop + 0.004, 0] }));
  add(PC.accent(PC.merge.apply(null, site), 0.9));

  // chuck: wider than the wafer, with the vacuum grooves that hold it flat
  var tCh = 0.13, yCh = -tWaf / 2 - tCh / 2;
  add(PC.T(PC.cylinder({ r: Rch, h: tCh, n: 13000, tone: 0.28 }), { pos: [0, yCh, 0] }));
  add(ring(Rch, yCh + tCh / 2, 340, 0.9)); add(ring(Rch, yCh - tCh / 2, 340, 0.7));
  [0.42, 0.68, 0.94, 1.06].forEach(function (r) { add(ring(r, yCh + tCh / 2 + 0.001, 200, 0.45)); });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.11,
    tilt: [0.46, -0.62, 0],
    // colour: a patterned die under white light shows thin-film interference in its passivation, a blue-violet iridescence, unlike a bare polished wafer
    accent: [91, 111, 174], accentDark: [170, 182, 234],
    caption: 'A vertical probe card over a wafer: a twelve-inch circular board, wider than the wafer it tests, with the tester\'s contact rings on top and a stiffener bolted across it whose three screws bring every needle into the same plane. Under it hangs a ceramic space transformer that fans the tester\'s coarse pitch down to the pitch of the pads, and a probe head whose needles bow between two guide plates before landing on four dies at once, picked out in blue-violet. The height between the card and the wafer is exaggerated; in the prober it is a millimetre or two.'
  };
});

})(window.PC);}catch(e){console.warn('specimen probe-card.js failed to load', e);}
/* process-chamber.js */
try{(function(PC){
/* Specimen: a plasma etch chamber, half-sectioned.
 *
 * Point clouds do not occlude, so a quarter-cut vessel still reads as a
 * transparent drum. This is drawn instead as a true half-section: everything in
 * front of one diametral plane is removed, and the plane itself is drawn as
 * solid cut material with bright edges. What is left is the textbook chamber
 * drawing: gas plenum and perforated showerhead above, a 300 mm wafer clamped
 * to an electrostatic chuck inside its focus ring below, the plasma between
 * them, the slit valve in the wall, and the gate valve and turbopump under the
 * floor.
 *
 * Proportions: 500 mm bore, ~370 mm inner height, 42 mm wall, 300 mm wafer.
 * The electrode gap is drawn about twice its true 30-40 mm so the plasma has
 * somewhere to live. Copper is the plasma and nothing else.
 */
PC.register('process-chamber', function (p) {
  var rI = 0.250, rO = 0.292;                  // 500 mm bore, 42 mm wall
  var yTop = 0.160, yBot = -0.212;             // inner ceiling / floor
  var wall = 0.030;
  var wafR = 0.150, yWaf = -0.020;             // 300 mm wafer
  var shR = 0.205, shT = 0.030, ySh = 0.062;   // showerhead face plate
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  /* The section plane. At tilt [0.3, -0.6, 0] the azimuth nearest the reader is
     about 0.97 rad; the whole half in front of that plane goes. */
  var AC = 0.97, A0 = AC - Math.PI / 2, A1 = AC + Math.PI / 2;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]);
      var d = a - AC; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      if (Math.abs(d) < Math.PI / 2) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // Solid cut material on the section plane, from radius ra to rb, both sides.
  function face(ra, rb, y0, y1, tn, dens) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      var n = Math.max(50, Math.round((rb - ra) * (y1 - y0) * (dens == null ? 3.6 : dens) * PC.k));
      var c = new Float32Array(n * 4);
      for (var i = 0; i < n; i++) {
        var u = ra + PC.rnd() * (rb - ra), v = y0 + PC.rnd() * (y1 - y0);
        c[i * 4] = u * ca; c[i * 4 + 1] = v; c[i * 4 + 2] = u * sa; c[i * 4 + 3] = tn;
      }
      g.push(c);
      g.push(PC.polyline({
        pts: [[ra * ca, y0, ra * sa], [rb * ca, y0, rb * sa], [rb * ca, y1, rb * sa], [ra * ca, y1, ra * sa]],
        closed: true, perUnit: 460, tone: 1
      }));
    }
    return PC.merge.apply(null, g);
  }
  // A bright line across the section plane at height y.
  function cutLine(r, y, tn) {
    return PC.line({ a: [r * Math.cos(A0), y, r * Math.sin(A0)], b: [r * Math.cos(A1), y, r * Math.sin(A1)], perUnit: 520, tone: tn });
  }
  function bolts(r, y, n, rad, tn) {
    var g = [];
    for (var i = 0; i < n; i++) {
      var a = i * Math.PI * 2 / n + 0.05;
      g.push(PC.T(PC.circle({ r: rad, perUnit: 340, tone: tn }), { pos: [r * Math.cos(a), y, r * Math.sin(a)] }));
    }
    return cut(PC.merge.apply(null, g));
  }

  /* ---------- vessel ---------- */

  var yMid = (yTop + yBot) / 2, yLid = yTop + wall, yFlo = yBot - wall;
  add(PC.T(cut(PC.cylinder({ r: rO, h: yLid - yFlo, caps: false, n: 9000, tone: 0.36 })), { pos: [0, (yLid + yFlo) / 2, 0] }));
  add(PC.T(cut(PC.cylinder({ r: rI, h: yTop - yBot, caps: false, n: 4200, tone: 0.115 })), { pos: [0, yMid, 0] }));
  add(face(rI, rO, yFlo, yLid, 0.6));                                    // the wall, sectioned
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 3600, tone: 0.3 }), { pos: [0, yFlo, 0] })));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.105, n: 2000, tone: 0.16 }), { pos: [0, yBot, 0] })));
  add(face(0.105, rO, yFlo, yBot, 0.6));
  add(cut(PC.T(PC.disc({ r: rO, rIn: 0.058, n: 3600, tone: 0.3 }), { pos: [0, yLid, 0] })));
  add(face(0.058, rO, yTop, yLid, 0.6));
  var rims = [[rO, yLid], [rO, yFlo], [rI, yTop], [rI, yBot]];
  for (var i = 0; i < rims.length; i++) add(cut(PC.T(PC.circle({ r: rims[i][0], perUnit: 420, tone: 0.95 }), { pos: [0, rims[i][1], 0] })));
  add(bolts(rO - 0.018, yLid + 0.001, 20, 0.0095, 0.85));
  add(bolts(rO - 0.018, yFlo - 0.001, 20, 0.0095, 0.7));

  /* ---------- showerhead and its gas plenum ---------- */

  var yPlen = ySh + shT, yBack = yPlen + 0.036;
  add(cut(PC.T(PC.cylinder({ r: shR, h: shT, caps: false, n: 1300, tone: 0.32 }), { pos: [0, ySh + shT / 2, 0] })));
  add(cut(PC.T(PC.disc({ r: shR, n: 2400, tone: 0.22 }), { pos: [0, ySh, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 460, tone: 1 }), { pos: [0, ySh, 0] })));
  add(face(0, shR, ySh, yPlen, 0.64));                                   // face plate, sectioned
  add(cut(PC.T(PC.cylinder({ r: shR * 0.94, h: 0.036, caps: false, n: 900, tone: 0.22 }), { pos: [0, yPlen + 0.018, 0] })));
  add(face(shR * 0.94, shR, yPlen, yBack, 0.6));                         // plenum wall
  add(cut(PC.T(PC.disc({ r: shR, n: 1600, tone: 0.26 }), { pos: [0, yBack, 0] })));
  add(cut(PC.T(PC.circle({ r: shR, perUnit: 380, tone: 0.9 }), { pos: [0, yBack, 0] })));
  add(face(0, shR, yBack, yBack + 0.014, 0.6));                          // backing plate
  add(cutLine(shR, ySh, 1));
  // a few thousand gas holes: a hex array over the wafer
  var holes = [], sp = 0.0132;
  for (var hx = -20; hx <= 20; hx++) for (var hz = -20; hz <= 20; hz++) {
    var x = hx * sp + (hz & 1 ? sp / 2 : 0), z = hz * sp * 0.866;
    if (x * x + z * z > (shR - 0.010) * (shR - 0.010)) continue;
    holes.push(x, ySh - 0.0016, z, 0.9);
  }
  add(cut(new Float32Array(holes)));

  /* ---------- lid stack: gas in, RF on ---------- */

  add(PC.T(PC.cylinder({ r: 0.058, h: 0.078, caps: false, n: 1200, tone: 0.34 }), { pos: [0, yLid + 0.039, 0] }));
  add(PC.T(PC.circle({ r: 0.058, perUnit: 460, tone: 0.9 }), { pos: [0, yLid, 0] }));
  add(PC.T(PC.cylinder({ r: 0.086, h: 0.022, n: 1200, tone: 0.3 }), { pos: [0, yLid + 0.089, 0] }));
  add(PC.T(PC.circle({ r: 0.086, perUnit: 460, tone: 0.95 }), { pos: [0, yLid + 0.100, 0] }));
  add(PC.T(PC.cylinder({ r: 0.026, h: 0.052, caps: false, n: 520, tone: 0.42 }), { pos: [0, yLid + 0.126, 0] }));
  add(PC.T(PC.circle({ r: 0.038, perUnit: 520, tone: 0.95 }), { pos: [0, yLid + 0.152, 0] }));
  add(PC.T(PC.box({ w: 0.112, h: 0.054, d: 0.088, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1500, tone: 0.28 }), { pos: [-0.150, yLid + 0.062, 0.062] }));
  add(PC.T(PC.boxEdges({ w: 0.112, h: 0.054, d: 0.088, perUnit: 420, tone: 0.95 }), { pos: [-0.150, yLid + 0.062, 0.062] }));
  add(PC.T(PC.cylinder({ r: 0.0105, h: 0.118, caps: false, n: 320, tone: 0.6 }), { rot: [0, 0, Math.PI / 2], pos: [-0.037, yLid + 0.062, 0.062] }));
  for (i = 0; i < 2; i++) add(PC.T(PC.cylinder({ r: 0.0085, h: 0.070, caps: false, n: 230, tone: 0.55 }), { pos: [-0.178 + i * 0.056, yLid + 0.124, 0.062] }));

  /* ---------- electrostatic chuck, focus ring, wafer ---------- */

  var pedR = 0.170, yPed = yWaf - 0.005, pedH = 0.088;
  add(cut(PC.T(PC.cylinder({ r: pedR, h: pedH, caps: false, n: 1700, tone: 0.32 }), { pos: [0, yPed - pedH / 2, 0] })));
  add(face(0, pedR, yPed - pedH, yPed - 0.014, 0.5));                    // aluminium base plate
  add(face(0, pedR, yPed - 0.014, yPed, 0.8));                           // the ceramic puck
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 440, tone: 0.95 }), { pos: [0, yPed, 0] })));
  add(cut(PC.T(PC.circle({ r: pedR, perUnit: 300, tone: 0.6 }), { pos: [0, yPed - pedH, 0] })));
  add(cutLine(pedR, yPed, 1));
  for (i = 0; i < 5; i++) {                                              // helium cooling channels
    var hxr = 0.032 + i * 0.030;
    add(PC.T(PC.circle({ r: 0.0075, perUnit: 420, tone: 0.9 }), { rot: [Math.PI / 2, Math.PI / 2 - A0, 0], pos: [hxr * Math.cos(A0), yPed - 0.032, hxr * Math.sin(A0)] }));
    add(PC.T(PC.circle({ r: 0.0075, perUnit: 420, tone: 0.9 }), { rot: [Math.PI / 2, Math.PI / 2 - A1, 0], pos: [hxr * Math.cos(A1), yPed - 0.032, hxr * Math.sin(A1)] }));
  }
  add(cut(PC.T(PC.disc({ r: 0.185, rIn: wafR + 0.004, n: 1300, tone: 0.45 }), { pos: [0, yPed + 0.005, 0] })));
  add(cut(PC.T(PC.circle({ r: 0.185, perUnit: 480, tone: 1 }), { pos: [0, yPed + 0.005, 0] })));
  add(cut(PC.T(PC.circle({ r: wafR + 0.004, perUnit: 260, tone: 0.7 }), { pos: [0, yPed + 0.005, 0] })));
  add(face(wafR + 0.004, 0.185, yPed, yPed + 0.010, 0.7));
  add(cut(PC.T(PC.disc({ r: wafR, n: 2400, tone: 0.34 }), { pos: [0, yWaf, 0] })));
  add(cut(PC.T(PC.circle({ r: wafR, perUnit: 420, tone: 1 }), { pos: [0, yWaf + 0.001, 0] })));
  add(cutLine(wafR, yWaf + 0.001, 1));
  add(cut(PC.T(PC.cylinder({ r: 0.072, h: 0.150, caps: false, n: 1200, tone: 0.28 }), { pos: [0, yPed - pedH - 0.075, 0] })));
  add(face(0.058, 0.072, yFlo, yPed - pedH, 0.55));
  for (i = 0; i < 5; i++) add(cut(PC.T(PC.circle({ r: 0.081, perUnit: 300, tone: 0.55 }), { pos: [0, yPed - pedH - 0.020 - i * 0.026, 0] })));
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.095, caps: false, n: 480, tone: 0.36 }), { pos: [0, yFlo - 0.048, 0] }));
  add(PC.T(PC.box({ w: 0.150, h: 0.082, d: 0.120, faces: ['py', 'px', 'pz', 'nz', 'ny'], n: 1500, tone: 0.26 }), { pos: [0.150, yFlo - 0.112, 0.095] }));
  add(PC.T(PC.boxEdges({ w: 0.150, h: 0.082, d: 0.120, perUnit: 420, tone: 0.9 }), { pos: [0.150, yFlo - 0.112, 0.095] }));
  add(PC.T(PC.cylinder({ r: 0.010, h: 0.145, caps: false, n: 230, tone: 0.55 }), { rot: [0, 0, Math.PI / 2], pos: [0.070, yFlo - 0.112, 0.095] }));

  /* ---------- the plasma ---------- */

  var gTop = ySh - 0.004, gBot = yWaf + 0.003, gR = wafR + 0.028;
  var glowN = 11000, glow = new Float32Array(glowN * 4), j = 0;
  while (j < glowN) {
    var gx = (PC.rnd() - 0.5) * 2 * gR, gz = (PC.rnd() - 0.5) * 2 * gR;
    if (gx * gx + gz * gz > gR * gR) continue;
    var ga = Math.atan2(gz, gx), gd = ga - AC;
    while (gd > Math.PI) gd -= Math.PI * 2; while (gd < -Math.PI) gd += Math.PI * 2;
    if (Math.abs(gd) < Math.PI / 2) continue;
    var gy = gBot + PC.rnd() * (gTop - gBot), f = (gy - gBot) / (gTop - gBot);
    glow[j * 4] = gx; glow[j * 4 + 1] = gy; glow[j * 4 + 2] = gz;
    glow[j * 4 + 3] = 2 + (f < 0.14 ? 0.42 : 0.11 + 0.10 * (1 - f));
    j++;
  }
  add(glow);

  /* ---------- slit valve, in the wall that is left standing ---------- */

  var svA = AC + Math.PI, svHalf = 0.42, svH = 0.030, sv = [], k, t, aa;
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf + svH, rI * Math.sin(aa)]); }
  for (k = 30; k >= 0; k--) { t = k / 30; aa = svA - svHalf + t * 2 * svHalf; sv.push([rI * Math.cos(aa), yWaf - svH, rI * Math.sin(aa)]); }
  add(PC.polyline({ pts: sv, closed: true, perUnit: 560, tone: 1 }));
  var dv = [];
  for (k = 0; k <= 30; k++) { t = k / 30; aa = svA - svHalf * 1.28 + t * 2 * svHalf * 1.28; dv.push([(rO + 0.026) * Math.cos(aa), 0, (rO + 0.026) * Math.sin(aa)]); }
  add(PC.T(PC.polyline({ pts: dv, perUnit: 420, tone: 0.6 }), { pos: [0, yWaf + svH * 1.7, 0] }));
  add(PC.T(PC.polyline({ pts: dv, perUnit: 420, tone: 0.6 }), { pos: [0, yWaf - svH * 1.7, 0] }));
  for (k = 0; k < dv.length; k += 6) add(PC.line({ a: [dv[k][0], yWaf - svH * 1.7, dv[k][2]], b: [dv[k][0], yWaf + svH * 1.7, dv[k][2]], perUnit: 300, tone: 0.45 }));

  // viewport and gauge port in the standing wall
  var vpA = AC + Math.PI * 1.32, vpRy = Math.PI / 2 - vpA;
  add(PC.T(PC.circle({ r: 0.042, perUnit: 520, tone: 0.9 }), { rot: [Math.PI / 2, vpRy, 0], pos: [rO * Math.cos(vpA), 0.075, rO * Math.sin(vpA)] }));
  add(PC.T(PC.circle({ r: 0.029, perUnit: 400, tone: 0.6 }), { rot: [Math.PI / 2, vpRy, 0], pos: [rO * Math.cos(vpA), 0.075, rO * Math.sin(vpA)] }));
  var gpA = AC + Math.PI * 0.72, gpRy = Math.PI / 2 - gpA;
  add(PC.T(PC.cylinder({ r: 0.020, h: 0.070, caps: false, n: 300, tone: 0.4 }), { rot: [Math.PI / 2, gpRy, 0], pos: [(rO + 0.035) * Math.cos(gpA), 0.100, (rO + 0.035) * Math.sin(gpA)] }));
  add(PC.T(PC.circle({ r: 0.030, perUnit: 460, tone: 0.9 }), { rot: [Math.PI / 2, gpRy, 0], pos: [(rO + 0.070) * Math.cos(gpA), 0.100, (rO + 0.070) * Math.sin(gpA)] }));

  /* ---------- gate valve and turbopump ---------- */

  var yGate = yFlo - 0.048, yPump = yFlo - 0.200;
  add(PC.T(PC.cylinder({ r: 0.105, h: 0.048, caps: false, n: 800, tone: 0.32 }), { pos: [0, yFlo - 0.024, 0] }));
  add(PC.T(PC.box({ w: 0.296, h: 0.050, d: 0.232, n: 3400, tone: 0.28 }), { pos: [0.026, yGate, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.296, h: 0.050, d: 0.232, perUnit: 420, tone: 0.95 }), { pos: [0.026, yGate, 0] }));
  add(PC.T(PC.circle({ r: 0.098, perUnit: 440, tone: 0.85 }), { pos: [0, yGate + 0.026, 0] }));
  add(PC.T(PC.cylinder({ r: 0.146, h: 0.148, caps: false, n: 2600, tone: 0.3 }), { pos: [0, yPump, 0] }));
  add(PC.T(PC.circle({ r: 0.146, perUnit: 440, tone: 0.95 }), { pos: [0, yPump + 0.074, 0] }));
  add(PC.T(PC.circle({ r: 0.146, perUnit: 440, tone: 0.95 }), { pos: [0, yPump - 0.074, 0] }));
  add(PC.T(PC.disc({ r: 0.130, n: 1100, tone: 0.16 }), { pos: [0, yPump + 0.068, 0] }));
  for (i = 0; i < 30; i++) {                              // rotor blades, seen down the throat
    var ba = i * Math.PI * 2 / 30;
    add(PC.line({
      a: [0.046 * Math.cos(ba), yPump + 0.060, 0.046 * Math.sin(ba)],
      b: [0.128 * Math.cos(ba + 0.30), yPump + 0.073, 0.128 * Math.sin(ba + 0.30)],
      perUnit: 460, tone: 0.65
    }));
  }
  add(PC.T(PC.cylinder({ r: 0.034, h: 0.030, n: 420, tone: 0.5 }), { pos: [0, yPump + 0.060, 0] }));
  add(PC.T(PC.cylinder({ r: 0.030, h: 0.165, caps: false, n: 700, tone: 0.36 }), { rot: [0, 0, Math.PI / 2], pos: [0.228, yPump - 0.030, 0] }));
  add(PC.T(PC.circle({ r: 0.040, perUnit: 460, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [0.308, yPump - 0.030, 0] }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.3, -0.6, 0],
    // colour: an argon or fluorocarbon etch plasma glows violet to blue, from argon's and fluorine's visible lines
    accent: [109, 92, 201], accentDark: [176, 164, 240],
    caption: 'A plasma etch chamber cut in half. Gas fills the plenum in the lid and drops through a few thousand holes in the showerhead onto a 300 mm wafer clamped to an electrostatic chuck inside its focus ring; the violet haze between them is the plasma, brightest in the sheath just above the wafer. Below the floor, the gate valve and the turbopump; in the wall, the slit valve the wafer travels through.'
  };
});

})(window.PC);}catch(e){console.warn('specimen process-chamber.js failed to load', e);}
/* rack.js */
try{(function(PC){
/* Specimen: a liquid-cooled 72-GPU rack, drawn from the GB200 NVL72.
 *
 * 600 mm wide, 1,068 mm deep, 2,236 mm tall, about 1.36 t, about 120 kW.
 * Front, bottom to top: a coolant distribution unit, three power shelves,
 * eight compute trays, the nine NVLink switch trays, ten more compute
 * trays, three more power shelves and a management switch. Rear: the
 * NVLink cable cartridge, a slab of copper cable either side of the
 * vertical busbar, with the coolant manifold running up the side and a
 * quick-disconnect pair at every tray.
 *
 * Copper marks the power path — the shelves, the busbar and its clips.
 * In this chapter the chips are not the long pole; the electricity is.
 */
PC.register('rack', function (p) {
  var parts = [];
  var W = 0.60, D = 1.068, H = 2.236;           // metres
  var U = 0.0445;                               // one rack unit
  var post = 0.042;
  var front = D / 2, back = -D / 2;
  var V = [Math.PI / 2, 0, 0];                  // stands a plane up facing +Z
  var SPX = [Math.PI / 2, Math.PI / 2, 0];      // stands a plane up facing +X

  function rect(w, h) {
    return [[-w / 2, 0, -h / 2], [w / 2, 0, -h / 2], [w / 2, 0, h / 2], [-w / 2, 0, h / 2]];
  }
  // a rectangle outline standing in the front plane, centred at (x, y)
  function fOut(w, h, x, y, z, per, tn) {
    return PC.T(PC.polyline({ pts: rect(w, h), closed: true, perUnit: per, tone: tn }), { rot: V, pos: [x, y, z] });
  }
  function fPlane(w, h, x, y, z, n, tn) {
    return PC.T(PC.plane({ w: w, d: h, n: n, tone: tn }), { rot: V, pos: [x, y, z] });
  }

  // ---------- the cabinet ----------
  parts.push(PC.T(PC.boxEdges({ w: W, h: H, d: D, perUnit: 180, tone: 0.95 }), { pos: [0, H / 2, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    var x = q[0] * (W / 2 - post / 2), z = q[1] * (D / 2 - post / 2);
    parts.push(PC.T(PC.box({ w: post, h: H, d: post, faces: ['px', 'nx', 'pz', 'nz'], n: 1700, tone: 0.48 }), { pos: [x, H / 2, z] }));
    parts.push(PC.T(PC.boxEdges({ w: post, h: H, d: post, perUnit: 110, tone: 0.85 }), { pos: [x, H / 2, z] }));
  });
  // plinth and top cap: solid, so the rack has a foot and a lid
  parts.push(PC.T(PC.box({ w: W, h: 0.09, d: D, faces: ['pz', 'px', 'nx', 'ny'], n: 2600, tone: 0.4 }), { pos: [0, 0.045, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.09, d: D, perUnit: 200, tone: 1 }), { pos: [0, 0.045, 0] }));
  parts.push(PC.T(PC.box({ w: W, h: 0.062, d: D, faces: ['py', 'pz', 'px', 'nx'], n: 2400, tone: 0.36 }), { pos: [0, H - 0.031, 0] }));
  parts.push(PC.T(PC.boxEdges({ w: W, h: 0.062, d: D, perUnit: 200, tone: 1 }), { pos: [0, H - 0.031, 0] }));
  // casters
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
    parts.push(PC.T(PC.cylinder({ r: 0.035, h: 0.02, caps: false, n: 140, tone: 0.7 }), { rot: [0, 0, Math.PI / 2], pos: [q[0] * (W / 2 - 0.07), 0.035, q[1] * (D / 2 - 0.12)] }));
  });

  // side panels: a border frame plus a field of perforations, so the side
  // reads as a closed door without becoming a grey wall over the trays
  [-1, 1].forEach(function (s) {
    var sx = s * (W / 2 - 0.004), pw = D - 0.10, ph = H - 0.22, py = 0.09 + ph / 2;
    parts.push(PC.T(PC.polyline({ pts: rect(pw, ph), closed: true, perUnit: 200, tone: 0.85 }), { rot: SPX, pos: [sx, py, 0] }));
    parts.push(PC.T(PC.polyline({ pts: rect(pw - 0.05, ph - 0.05), closed: true, perUnit: 150, tone: 0.5 }), { rot: SPX, pos: [sx, py, 0] }));
    parts.push(PC.T(PC.dots({ nx: 26, nz: 11, sx: (ph - 0.12) / 25, sz: (pw - 0.12) / 10, tone: 0.22 }), { rot: [0, 0, Math.PI / 2], pos: [sx, py, 0] }));
    for (var rl = 1; rl < 4; rl++) {
      parts.push(PC.line({ a: [sx, 0.09 + rl * ph / 4, -pw / 2], b: [sx, 0.09 + rl * ph / 4, pw / 2], perUnit: 150, tone: 0.4 }));
    }
  });

  // ---------- the stack ----------
  // section list from the floor up: [kind, count, gap above]
  var y = 0.09 + 0.024;
  var slots = [];                                // {kind, y}
  function section(kind, n, gap) {
    for (var i = 0; i < n; i++) { slots.push({ kind: kind, y: y + U / 2 }); y += U; }
    y += gap;
  }
  section('cdu', 4, 0.045);
  section('power', 3, 0.042);
  section('compute', 8, 0.026);
  section('switch', 9, 0.026);
  section('compute', 10, 0.042);
  section('power', 3, 0.038);
  section('mgmt', 1, 0);
  var stackTop = y, stackBot = 0.114;

  var tW = 0.522, tD = 0.98, tH = U * 0.90, fz = front - 0.012;
  var computeY = [], switchY = [], powerY = [];

  // A 1U front panel is only about ten pixels tall at the size the site
  // draws this, so each tray gets one idea and nothing more: two module
  // bays for compute, one long port band for a switch, six modules for a
  // power shelf. Anything denser sums to a black band.
  slots.forEach(function (sl) {
    var ty = sl.y, k = sl.kind;
    // the tray body: side rails running back and a sparse lid, so the depth
    // reads without filling the cabinet with haze
    parts.push(PC.line({ a: [-tW / 2, ty, fz - 0.02], b: [-tW / 2, ty, back + 0.10], perUnit: 60, tone: 0.32 }));
    parts.push(PC.line({ a: [tW / 2, ty, fz - 0.02], b: [tW / 2, ty, back + 0.10], perUnit: 60, tone: 0.32 }));
    parts.push(PC.T(PC.plane({ w: tW, d: tD, n: 55, tone: 0.11 }), { pos: [0, ty + tH / 2, (fz - 0.02 + back + 0.10) / 2] }));

    if (k === 'compute') {
      computeY.push(ty);
      parts.push(fPlane(tW, tH, 0, ty, fz, 200, 0.23));
      parts.push(fOut(tW, tH, 0, ty, fz + 0.002, 150, 0.85));
      [-1, 1].forEach(function (s) {
        var bx = s * 0.132, bw = 0.205, bh = tH * 0.68;
        parts.push(fOut(bw, bh, bx, ty, fz + 0.004, 150, 0.85));
        parts.push(PC.line({
          a: [bx - s * (bw / 2 - 0.014), ty - bh / 2, fz + 0.005],
          b: [bx - s * (bw / 2 - 0.014), ty + bh / 2, fz + 0.005], perUnit: 320, tone: 0.9
        }));
      });
      parts.push(PC.T(PC.dots({ nx: 3, nz: 1, sx: 0.011, tone: 0.9 }), { pos: [-tW / 2 + 0.026, ty, fz + 0.006] }));
    } else if (k === 'switch') {
      switchY.push(ty);
      parts.push(fPlane(tW, tH, 0, ty, fz, 330, 0.46));
      parts.push(fOut(tW, tH, 0, ty, fz + 0.002, 190, 1));
      parts.push(fOut(tW * 0.80, tH * 0.52, 0, ty, fz + 0.004, 170, 1));
      for (var g = 0; g < 11; g++) {
        var gx = (g - 5) * (tW * 0.066);
        parts.push(PC.line({ a: [gx, ty - tH * 0.24, fz + 0.005], b: [gx, ty + tH * 0.24, fz + 0.005], perUnit: 260, tone: 0.8 }));
      }
    } else if (k === 'power') {
      powerY.push(ty);
      // six power-supply modules, in grey steel: this rack's chokepoint is the
      // electricity, not the silicon
      parts.push(PC.accent2(fPlane(tW, tH, 0, ty, fz, 220), 0.6));
      parts.push(PC.accent2(fOut(tW, tH, 0, ty, fz + 0.002, 150), 1));
      for (var q = 0; q < 6; q++) {
        var qx = (q - 2.5) * ((tW - 0.02) / 6);
        parts.push(PC.accent2(fOut((tW - 0.05) / 6, tH * 0.74, qx, ty, fz + 0.004, 150), 1));
        parts.push(PC.line({ a: [qx + 0.022, ty - tH * 0.30, fz + 0.005], b: [qx + 0.022, ty + tH * 0.30, fz + 0.005], perUnit: 300, tone: 0.85 }));
      }
    } else if (k === 'mgmt') {
      parts.push(fPlane(tW, tH, 0, ty, fz, 150, 0.24));
      parts.push(fOut(tW, tH, 0, ty, fz + 0.002, 150, 0.9));
      for (var r = 0; r < 2; r++) {
        var ry = ty + (r - 0.5) * tH * 0.40;
        for (var m = 0; m < 20; m++) {
          parts.push(PC.line({ a: [(m - 9.5) * 0.024, ry - tH * 0.13, fz + 0.004], b: [(m - 9.5) * 0.024, ry + tH * 0.13, fz + 0.004], perUnit: 280, tone: 0.85 }));
        }
      }
    } else {
      parts.push(fPlane(tW, tH, 0, ty, fz, 120, 0.20));
    }
  });

  // the CDU is four units tall: draw it as one unit with big hose ports
  var cduY = (slots[0].y + slots[3].y) / 2, cduH = 4 * U * 0.94;
  parts.push(fOut(tW, cduH, 0, cduY, fz + 0.004, 380, 1));
  parts.push(fOut(tW - 0.05, cduH - 0.03, 0, cduY, fz + 0.005, 280, 0.7));
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.circle({ r: 0.046, perUnit: 420, tone: 1 }), { rot: V, pos: [s * 0.155, cduY, fz + 0.006] }));
    parts.push(PC.T(PC.circle({ r: 0.030, perUnit: 380, tone: 0.8 }), { rot: V, pos: [s * 0.155, cduY, fz + 0.007] }));
  });
  parts.push(PC.T(PC.dots({ nx: 8, nz: 3, sx: 0.020, sz: 0.020, per: 2, tone: 0.85 }), { rot: V, pos: [0, cduY - 0.03, fz + 0.006] }));

  // the front bezel: a picture frame round the tray aperture
  var apY = (stackBot + stackTop) / 2, apH = stackTop - stackBot + 0.02;
  parts.push(fOut(tW + 0.036, apH, 0, apY, front - 0.002, 260, 1));
  [-1, 1].forEach(function (s) {
    parts.push(fPlane(0.032, apH, s * (tW / 2 + 0.034), apY, front - 0.002, 900, 0.32));
    parts.push(fPlane(W - 0.02, (s > 0 ? H - 0.062 - (apY + apH / 2) : apY - apH / 2 - 0.09) - 0.004,
      0, s > 0 ? (apY + apH / 2 + H - 0.062) / 2 : (0.09 + apY - apH / 2) / 2, front - 0.002, 1500, 0.3));
  });

  // ---------- rear: the NVLink cartridge, the busbar and the manifold ----------
  var zSpine = back + 0.085, sy0 = stackBot + 0.05, sy1 = stackTop - 0.02, sh = sy1 - sy0, syc = (sy0 + sy1) / 2;
  // two slabs of copper cable either side of the busbar
  [-1, 1].forEach(function (s) {
    var cx = s * 0.172;
    for (var i = 0; i < 22; i++) {
      var lx = cx + (i - 10.5) * 0.0092, wob = (PC.rnd() - 0.5) * 0.004;
      parts.push(PC.line({ a: [lx, sy0, zSpine + wob], b: [lx, sy1, zSpine + wob], perUnit: 150, tone: 0.5 }));
    }
    for (i = 0; i < 14; i++) {
      var by = sy0 + (i + 0.5) * sh / 14;
      parts.push(PC.line({ a: [cx - 0.10, by, zSpine - 0.004], b: [cx + 0.10, by, zSpine - 0.004], perUnit: 300, tone: 0.8 }));
    }
    parts.push(PC.T(PC.polyline({ pts: rect(0.212, sh), closed: true, perUnit: 220, tone: 1 }), { rot: V, pos: [cx, syc, zSpine - 0.008] }));
  });
  // the busbar, in copper, with a clip at every tray
  parts.push(PC.T(PC.accent(PC.box({ w: 0.052, h: sh + 0.10, d: 0.030, faces: ['pz', 'px', 'nx'], n: 3000 }), 0.55), { pos: [0, syc, zSpine + 0.02] }));
  parts.push(PC.T(PC.accent(PC.boxEdges({ w: 0.052, h: sh + 0.10, d: 0.030, perUnit: 260 }), 1), { pos: [0, syc, zSpine + 0.02] }));
  slots.forEach(function (sl) {
    if (sl.kind === 'cdu' || sl.kind === 'mgmt') return;
    parts.push(PC.T(PC.accent(PC.polyline({ pts: rect(0.086, U * 0.5), closed: true, perUnit: 380 }), 0.9), { rot: V, pos: [0, sl.y, zSpine + 0.036] }));
  });
  // the manifold: two vertical pipes up the near side with quick disconnects
  var pipeX = W / 2 - 0.058, pipeZ = [back + 0.30, back + 0.40], pr = 0.030;
  pipeZ.forEach(function (pz, pi) {
    parts.push(PC.T(PC.cylinder({ r: pr, h: sh + 0.30, caps: false, n: 4200, tone: 0.46 }), { pos: [pipeX, syc + 0.02, pz] }));
    for (var m = 0; m < 11; m++) {
      parts.push(PC.T(PC.circle({ r: pr * 1.16, perUnit: 380, tone: 0.95 }), { pos: [pipeX, sy0 - 0.10 + m * (sh + 0.24) / 10, pz] }));
    }
    slots.forEach(function (sl, si) {
      if (si % 2 !== pi) return;
      parts.push(PC.polyline({
        pts: [[pipeX - pr, sl.y, pz], [pipeX - 0.055, sl.y, pz], [pipeX - 0.075, sl.y, pz + 0.06]],
        perUnit: 420, tone: 0.7
      }));
    });
  });
  // the two hoses that leave the cabinet at the foot
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.torus({ R: 0.075, r: 0.028, n: 1600, tone: 0.5 }), { rot: [0, 0, Math.PI / 2], pos: [s * 0.13, 0.115, back + 0.06] }));
    parts.push(PC.T(PC.cylinder({ r: 0.028, h: 0.13, caps: false, n: 700, tone: 0.5 }), { rot: [Math.PI / 2, 0, 0], pos: [s * 0.205, 0.115, back - 0.01] }));
  });

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.07,
    tilt: [0.12, -0.65, 0],
    // colour: the busbar and its clips are bare copper bar
    accent: [176, 102, 44], accentDark: [224, 154, 92],
    // colour: the power shelves are grey painted steel sleds
    accent2: [110, 115, 120], accent2Dark: [185, 190, 195],
    caption: 'A liquid-cooled rack of 72 accelerators, 2.24 m tall and drawing about 120 kW: eighteen compute trays split eight below and ten above the nine NVLink switch trays, the coolant distribution unit at the foot, and the NVLink cable cartridge filling the back. The power path is picked out: six power shelves in grey steel and the vertical copper busbar they feed, with a clip at every tray.'
  };
});

})(window.PC);}catch(e){console.warn('specimen rack.js failed to load', e);}
/* sem-column.js */
try{(function(PC){
/* Specimen: an electron-beam inspection column, half-sectioned.
 *
 * About a metre of column standing over a 300 mm wafer: a Schottky field
 * emitter under its high-voltage insulator stack at the top, an ion pump on
 * the gun, two condenser lenses, a beam-limiting aperture, a stigmator, the
 * scan coils, and the objective lens with its conical pole piece just above
 * the wafer. Below that a ring detector and an X-Y stage with its
 * interferometer mirrors.
 *
 * The half in front of the section plane is removed and the plane is drawn as
 * solid material, so each magnetic lens shows what it really is: an iron yoke
 * wrapped round a copper coil, pinched to a narrow gap at the bore. Copper is
 * the electron beam and nothing else - the emitter, the beam envelope, the
 * spot where it lands and the secondaries it kicks back to the detector.
 */
PC.register('sem-column', function (p) {
  var parts = [];
  function add() { for (var i = 0; i < arguments.length; i++) if (arguments[i]) parts.push(arguments[i]); }

  /* section plane: at tilt [0.15, -0.6, 0] the nearest azimuth is ~0.97 rad */
  var AC = 0.97, A0 = AC - Math.PI / 2, A1 = AC + Math.PI / 2;
  function cut(c) {
    var keep = [];
    for (var i = 0; i < c.length; i += 4) {
      var a = Math.atan2(c[i + 2], c[i]);
      var d = a - AC; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      if (Math.abs(d) < Math.PI / 2) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  // solid cut material on the section plane, both sides of the axis
  function face(ra, rb, y0, y1, tn, dens) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      var n = Math.max(40, Math.round((rb - ra) * (y1 - y0) * (dens == null ? 3.2 : dens) * PC.k));
      var c = new Float32Array(n * 4);
      for (var i = 0; i < n; i++) {
        var u = ra + PC.rnd() * (rb - ra), v = y0 + PC.rnd() * (y1 - y0);
        c[i * 4] = u * ca; c[i * 4 + 1] = v; c[i * 4 + 2] = u * sa; c[i * 4 + 3] = tn;
      }
      g.push(c);
    }
    return PC.merge.apply(null, g);
  }
  function faceEdge(ra, rb, y0, y1, tn, per) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      g.push(PC.polyline({
        pts: [[ra * ca, y0, ra * sa], [rb * ca, y0, rb * sa], [rb * ca, y1, rb * sa], [ra * ca, y1, ra * sa]],
        closed: true, perUnit: per == null ? 320 : per, tone: tn
      }));
    }
    return PC.merge.apply(null, g);
  }
  function faceLine(ra, rb, y, tn) {
    var g = [];
    for (var s = 0; s < 2; s++) {
      var a = s ? A1 : A0, ca = Math.cos(a), sa = Math.sin(a);
      g.push(PC.line({ a: [ra * ca, y, ra * sa], b: [rb * ca, y, rb * sa], perUnit: 340, tone: tn }));
    }
    return PC.merge.apply(null, g);
  }
  function ring(r, y, per, tn) { return cut(PC.T(PC.circle({ r: r, perUnit: per == null ? 300 : per, tone: tn == null ? 0.95 : tn }), { pos: [0, y, 0] })); }
  function ringFull(r, y, per, tn) { return PC.T(PC.circle({ r: r, perUnit: per == null ? 300 : per, tone: tn == null ? 0.95 : tn }), { pos: [0, y, 0] }); }
  function tube(r, y0, y1, n, tn) { return cut(PC.T(PC.cylinder({ r: r, h: y1 - y0, caps: false, n: n, tone: tn }), { pos: [0, (y0 + y1) / 2, 0] })); }

  /* A magnetic lens, drawn the way a textbook draws one: an iron yoke in
     section, a coil window inside it, and pole pieces pinching the bore. */
  function lens(y0, y1, rOut, rBore, nHouse) {
    var g = [], mid = (y0 + y1) / 2, h = y1 - y0;
    g.push(cut(PC.T(PC.cylinder({ r: rOut, h: h, caps: false, n: nHouse, tone: 0.26 }), { pos: [0, mid, 0] })));
    g.push(cut(PC.T(PC.disc({ r: rOut, rIn: rBore, n: Math.round(nHouse * 0.42), tone: 0.24 }), { pos: [0, y1, 0] })));
    g.push(cut(PC.T(PC.disc({ r: rOut, rIn: rBore, n: Math.round(nHouse * 0.42), tone: 0.24 }), { pos: [0, y0, 0] })));
    g.push(PC.T(PC.cylinder({ r: rBore, h: h, caps: false, n: Math.round(nHouse * 0.2), tone: 0.3 }), { pos: [0, mid, 0] }));
    g.push(ring(rOut, y0), ring(rOut, y1));
    // yoke in section
    g.push(face(rBore, rOut, y0, y1, 0.30, 2.1));
    g.push(faceEdge(rBore, rOut, y0, y1, 1));
    // the coil window
    var c0 = rBore + (rOut - rBore) * 0.30, c1 = rOut - (rOut - rBore) * 0.14;
    var w0 = y0 + h * 0.16, w1 = y1 - h * 0.16;
    g.push(face(c0, c1, w0, w1, 0.40, 1.8));
    g.push(faceEdge(c0, c1, w0, w1, 1, 380));
    for (var k = 1; k < 4; k++) g.push(faceLine(c0, c1, w0 + (w1 - w0) * k / 4, 0.75));
    // pole pieces: the narrow gap that does the focusing
    g.push(faceLine(rBore, rBore + (rOut - rBore) * 0.34, mid - 0.028, 1));
    g.push(faceLine(rBore, rBore + (rOut - rBore) * 0.34, mid + 0.028, 1));
    g.push(ring(rBore + (rOut - rBore) * 0.34, mid - 0.028, 240, 0.7));
    g.push(ring(rBore + (rOut - rBore) * 0.34, mid + 0.028, 240, 0.7));
    return PC.merge.apply(null, g);
  }
  function aperture(y, r, hole, tn) {
    return PC.merge(
      cut(PC.T(PC.disc({ r: r, rIn: hole, n: 620, tone: tn == null ? 0.55 : tn }), { pos: [0, y, 0] })),
      face(hole, r, y - 0.004, y + 0.004, 0.7, 3),
      ring(r, y + 0.002, 320, 0.95), ringFull(hole, y + 0.002, 1100, 1)
    );
  }

  /* ---------- gun and its high-voltage insulator ---------- */

  add(cut(PC.T(PC.cylinder({ r: 0.20, h: 0.26, caps: false, n: 2200, tone: 0.26 }), { pos: [0, 1.23, 0] })));
  add(cut(PC.T(PC.cone({ r1: 0.20, r2: 0.10, h: 0.11, n: 1100, tone: 0.26 }), { pos: [0, 1.415, 0] })));
  add(face(0.085, 0.20, 1.10, 1.36, 0.30, 2.1), faceEdge(0.085, 0.20, 1.10, 1.36, 1));
  add(ring(0.20, 1.10), ring(0.20, 1.36), ring(0.10, 1.47, 300, 0.9));
  // stepped ceramic insulator stack and the HV cable
  for (var q = 0; q < 3; q++) {
    var iy = 1.47 + q * 0.082, irr = 0.100 - q * 0.017;
    add(PC.T(PC.cylinder({ r: irr, h: 0.070, n: 900, tone: 0.3 }), { pos: [0, iy + 0.035, 0] }));
    add(ringFull(irr, iy + 0.070, 340, 0.9));
    add(ringFull(irr, iy, 300, 0.75));
  }
  add(PC.T(PC.cylinder({ r: 0.040, h: 0.13, caps: false, n: 420, tone: 0.34 }), { pos: [0, 1.785, 0] }));
  add(ringFull(0.040, 1.85, 380, 0.95));
  // Schottky emitter on the axis, with suppressor and extractor
  add(PC.accent(PC.T(PC.cone({ r1: 0.003, r2: 0.026, h: 0.048, n: 260, tone: 1 }), { pos: [0, 1.292, 0] }), 1));
  add(PC.accent(PC.T(PC.sphere({ r: 0.010, n: 90 }), { pos: [0, 1.266, 0] }), 1));
  add(face(0.026, 0.062, 1.316, 1.336, 0.6, 3), faceEdge(0.026, 0.062, 1.316, 1.336, 1, 380));
  add(aperture(1.205, 0.075, 0.010, 0.5));
  add(aperture(1.120, 0.085, 0.012, 0.5));
  // ion pump hanging off the gun
  var ipy = 1.245, ipx = 0.30;
  add(PC.T(PC.cylinder({ r: 0.072, h: 0.20, caps: false, n: 1100, tone: 0.3 }), { rot: [0, 0, Math.PI / 2], pos: [ipx, ipy, 0] }));
  add(PC.T(PC.circle({ r: 0.072, perUnit: 320, tone: 0.9 }), { rot: [0, 0, Math.PI / 2], pos: [ipx + 0.10, ipy, 0] }));
  add(PC.T(PC.box({ w: 0.14, h: 0.17, d: 0.17, n: 1300, tone: 0.28 }), { pos: [ipx + 0.18, ipy, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.14, h: 0.17, d: 0.17, perUnit: 340, tone: 0.9 }), { pos: [ipx + 0.18, ipy, 0] }));

  /* ---------- column ---------- */

  add(tube(0.098, 0.72, 1.10, 1600, 0.24), face(0.088, 0.098, 0.72, 1.10, 0.36, 2.4), ring(0.098, 0.72, 340, 0.9));
  add(lens(0.48, 0.72, 0.34, 0.098, 3200));                       // condenser 1
  add(tube(0.096, 0.36, 0.48, 700, 0.24), face(0.086, 0.096, 0.36, 0.48, 0.36, 2.4));
  add(ring(0.096, 0.48, 340, 0.9), ring(0.096, 0.36, 340, 0.9));
  add(aperture(0.435, 0.10, 0.008, 0.6));                          // beam-limiting aperture
  add(lens(0.12, 0.36, 0.32, 0.094, 3000));                        // condenser 2
  add(tube(0.094, -0.06, 0.12, 900, 0.24), face(0.084, 0.094, -0.06, 0.12, 0.36, 2.4));
  // stigmator: eight saddle blocks around the tube
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4 + 0.15, d = a - AC;
    while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    if (Math.abs(d) < Math.PI / 2) continue;
    add(PC.T(PC.box({ w: 0.062, h: 0.098, d: 0.042, n: 460, tone: 0.5 }), { rot: [0, -a, 0], pos: [0.113 * Math.cos(a), 0.02, 0.113 * Math.sin(a)] }));
  }
  add(ring(0.142, 0.066, 260, 0.7), ring(0.142, -0.026, 260, 0.7));
  add(ring(0.094, 0.12, 340, 0.9), ring(0.094, -0.06, 340, 0.9));
  // scan and deflection coils
  add(tube(0.20, -0.26, -0.10, 1200, 0.24));
  add(ring(0.20, -0.10), ring(0.20, -0.26));
  add(face(0.094, 0.20, -0.26, -0.10, 0.30, 2.1), faceEdge(0.094, 0.20, -0.26, -0.10, 1));
  add(face(0.118, 0.184, -0.238, -0.122, 0.40, 1.8), faceEdge(0.118, 0.184, -0.238, -0.122, 1, 380));
  for (i = 1; i < 3; i++) add(faceLine(0.118, 0.184, -0.238 + 0.116 * i / 3, 0.75));
  // objective lens and its conical pole piece
  add(lens(-0.56, -0.30, 0.44, 0.115, 4000));
  add(cut(PC.T(PC.cone({ r1: 0.145, r2: 0.44, h: 0.19, n: 2600, tone: 0.26 }), { pos: [0, -0.665, 0] })));
  add(cut(PC.T(PC.cylinder({ r: 0.145, h: 0.055, caps: false, n: 500, tone: 0.26 }), { pos: [0, -0.788, 0] })));
  add(face(0.105, 0.145, -0.815, -0.76, 0.32, 2.1));
  add(PC.polyline({
    pts: [[0.105 * Math.cos(A0), -0.815, 0.105 * Math.sin(A0)], [0.145 * Math.cos(A0), -0.815, 0.145 * Math.sin(A0)],
          [0.44 * Math.cos(A0), -0.56, 0.44 * Math.sin(A0)], [0.105 * Math.cos(A0), -0.56, 0.105 * Math.sin(A0)]],
    closed: true, perUnit: 300, tone: 0.95
  }));
  add(PC.polyline({
    pts: [[0.105 * Math.cos(A1), -0.815, 0.105 * Math.sin(A1)], [0.145 * Math.cos(A1), -0.815, 0.145 * Math.sin(A1)],
          [0.44 * Math.cos(A1), -0.56, 0.44 * Math.sin(A1)], [0.105 * Math.cos(A1), -0.56, 0.105 * Math.sin(A1)]],
    closed: true, perUnit: 300, tone: 0.95
  }));
  add(ring(0.44, -0.56), ringFull(0.115, -0.815, 460, 1));
  // ring detector under the pole piece, and its signal arm
  add(PC.T(PC.disc({ r: 0.175, rIn: 0.052, n: 1000, tone: 0.3 }), { pos: [0, -0.855, 0] }));
  add(ringFull(0.175, -0.853, 380, 0.95), ringFull(0.052, -0.853, 560, 0.95));
  for (i = 0; i < 24; i++) {
    var da = i * Math.PI * 2 / 24;
    add(PC.line({ a: [0.060 * Math.cos(da), -0.851, 0.060 * Math.sin(da)], b: [0.168 * Math.cos(da), -0.851, 0.168 * Math.sin(da)], perUnit: 300, tone: 0.55 }));
  }
  add(PC.T(PC.cylinder({ r: 0.042, h: 0.26, caps: false, n: 900, tone: 0.3 }), { rot: [0, 0, -0.95], pos: [0.30, -0.755, 0] }));
  add(PC.T(PC.circle({ r: 0.042, perUnit: 320, tone: 0.9 }), { rot: [0, 0, -0.95], pos: [0.40, -0.685, 0] }));

  /* ---------- wafer and X-Y stage ---------- */

  var yW = -0.98, wafR = 0.40;
  add(PC.T(PC.disc({ r: wafR, n: 2400, tone: 0.2 }), { pos: [0, yW, 0] }));
  var wr = ringFull(wafR, yW + 0.002, 560, 1), wk = [];
  for (i = 0; i < wr.length; i += 4) {                                  // bite a notch out of the rim
    var nx = wr[i] - wafR * Math.cos(-1.05), nz = wr[i + 2] - wafR * Math.sin(-1.05);
    if (nx * nx + nz * nz < 0.030 * 0.030) continue;
    wk.push(wr[i], wr[i + 1], wr[i + 2], wr[i + 3]);
  }
  add(new Float32Array(wk));
  add(PC.polyline({ pts: [[wafR * Math.cos(-1.05) - 0.026, yW + 0.002, wafR * Math.sin(-1.05) + 0.014],
                          [wafR * Math.cos(-1.05) - 0.004, yW + 0.002, wafR * Math.sin(-1.05)],
                          [wafR * Math.cos(-1.05) - 0.026, yW + 0.002, wafR * Math.sin(-1.05) - 0.014]], perUnit: 700, tone: 1 }));
  var dg = [];
  for (var gx = -4; gx <= 4; gx++) for (var gz = -4; gz <= 4; gz++) {
    var cx = gx * 0.092, cz = gz * 0.076;
    if (cx * cx + cz * cz > (wafR - 0.055) * (wafR - 0.055)) continue;
    dg.push(PC.polyline({ pts: [[cx - 0.044, 0, cz - 0.036], [cx + 0.044, 0, cz - 0.036], [cx + 0.044, 0, cz + 0.036], [cx - 0.044, 0, cz + 0.036]], closed: true, perUnit: 110, tone: 0.45 }));
  }
  add(PC.T(PC.merge.apply(null, dg), { pos: [0, yW + 0.003, 0] }));
  // chuck, Y slide, X slide, granite base: a stage that reads as a stage
  add(PC.T(PC.cylinder({ r: wafR + 0.028, h: 0.050, n: 1500, tone: 0.18 }), { pos: [0, yW - 0.027, 0] }));
  add(ringFull(wafR + 0.028, yW - 0.052, 340, 0.9));
  add(PC.T(PC.box({ w: 0.98, h: 0.070, d: 0.86, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1900, tone: 0.17 }), { pos: [0, yW - 0.088, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.98, h: 0.070, d: 0.86, perUnit: 300, tone: 0.92 }), { pos: [0, yW - 0.088, 0] }));
  for (i = -1; i <= 1; i += 2) {
    add(PC.T(PC.box({ w: 1.30, h: 0.034, d: 0.056, n: 520, tone: 0.45 }), { pos: [0, yW - 0.147, i * 0.33] }));
    add(PC.T(PC.line({ a: [-0.65, 0, 0], b: [0.65, 0, 0], perUnit: 300, tone: 0.9 }), { pos: [0, yW - 0.130, i * 0.33] }));
    add(PC.T(PC.box({ w: 0.050, h: 0.032, d: 0.70, n: 420, tone: 0.45 }), { pos: [i * 0.41, yW - 0.128, 0] }));
  }
  add(PC.T(PC.box({ w: 1.42, h: 0.090, d: 1.10, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 2800, tone: 0.14 }), { pos: [0, yW - 0.210, 0] }));
  add(PC.T(PC.boxEdges({ w: 1.42, h: 0.090, d: 1.10, perUnit: 280, tone: 0.9 }), { pos: [0, yW - 0.210, 0] }));
  // interferometer mirror bars on two sides of the chuck: this is a metrology tool
  add(PC.T(PC.box({ w: 0.020, h: 0.055, d: 0.80, n: 480, tone: 0.62 }), { pos: [-wafR - 0.048, yW - 0.020, 0] }));
  add(PC.T(PC.boxEdges({ w: 0.020, h: 0.055, d: 0.80, perUnit: 340, tone: 1 }), { pos: [-wafR - 0.048, yW - 0.020, 0] }));
  add(PC.T(PC.box({ w: 0.80, h: 0.055, d: 0.020, n: 480, tone: 0.62 }), { pos: [0, yW - 0.020, -wafR - 0.048] }));
  add(PC.T(PC.boxEdges({ w: 0.80, h: 0.055, d: 0.020, perUnit: 340, tone: 1 }), { pos: [0, yW - 0.020, -wafR - 0.048] }));

  /* ---------- the beam ---------- */

  var ENV = [[1.268, 0.008], [1.20, 0.028], [1.11, 0.038], [0.72, 0.060], [0.60, 0.070], [0.50, 0.032],
             [0.436, 0.004], [0.36, 0.024], [0.24, 0.060], [0.12, 0.034], [0.02, 0.028], [-0.18, 0.038],
             [-0.43, 0.096], [-0.60, 0.072], [-0.815, 0.036], [yW, 0.002]];
  var env = [];
  for (var s = -1; s <= 1; s += 2) for (var ax = 0; ax < 2; ax++) {
    var pts = [];
    for (i = 0; i < ENV.length; i++) pts.push(ax ? [s * ENV[i][1], ENV[i][0], 0] : [0, ENV[i][0], s * ENV[i][1]]);
    env.push(PC.polyline({ pts: pts, perUnit: 260, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, env), 0.72));
  add(PC.accent(PC.line({ a: [0, 1.268, 0], b: [0, yW, 0], perUnit: 320, tone: 1 }), 0.85));
  add(PC.accent(PC.T(PC.disc({ r: 0.016, n: 200 }), { pos: [0, yW + 0.006, 0] }), 1));
  add(PC.accent(PC.T(PC.circle({ r: 0.050, perUnit: 800 }), { pos: [0, yW + 0.005, 0] }), 0.85));
  var se = [];
  for (i = 0; i < 18; i++) {
    a = i * Math.PI * 2 / 18 + 0.2;
    se.push(PC.line({ a: [0, yW + 0.01, 0], b: [0.112 * Math.cos(a), -0.868, 0.112 * Math.sin(a)], perUnit: 150, tone: 1 }));
  }
  add(PC.accent(PC.merge.apply(null, se), 0.3));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.08,
    tilt: [0.15, -0.6, 0],
    // colour: an electron beam has no colour; the convention is the green of the phosphor screen it lit on every older microscope
    accent: [58, 154, 95], accentDark: [134, 227, 168],
    caption: 'An electron-beam inspection column cut in half down its axis. The beam, in green, leaves the emitter under the high-voltage insulator at the top, is squeezed by two condenser lenses and an aperture, steered by the scan coils, and focused by the objective lens onto a 300 mm wafer on the stage, where the electrons it knocks loose come back up to the ring detector. Each lens is an iron yoke wrapped round a coil, pinched to a narrow gap at the bore.'
  };
});

})(window.PC);}catch(e){console.warn('specimen sem-column.js failed to load', e);}
/* substrate-layers.js */
try{(function(PC){
/* Specimen: an ABF build-up substrate, cut away.
 *
 * Real object: the flip-chip BGA substrate under an AI accelerator, about
 * 100 x 72 mm and a millimetre and a half thick. A glass-cloth-and-resin core
 * around 0.8 mm thick, drilled edge to edge with plated through-holes, carries
 * build-up layers of Ajinomoto film laminated on both faces, each layer about
 * 40 um thick with its own copper wiring and its own laser-drilled microvias.
 * The one drawn here is an eight-two-eight: eighteen layers of copper. The
 * biggest AI substrates now run past twenty.
 *
 * Drawing decisions:
 *  - Cut away rather than exploded. Chapters 11 and 12 are both exploded stacks;
 *    a third would read as the same object again. A quarter removed shows the
 *    layer sandwich, which is the only thing about this part worth seeing, and
 *    keeps the outside recognisable as a board.
 *  - Footprint is to scale; the thickness is exaggerated about twenty times.
 *  - The build-up film is the chokepoint, so the dielectric bands are the copper
 *    ones and the metal is drawn in ink.
 */
PC.register('substrate-layers', function (p) {
  var W = 1.00, D = 0.72;                 // 100 x 72 mm
  var tc = 0.075, tb = 0.0125, nb = 8, tr = 0.010;
  var H = tc + 2 * nb * tb + 2 * tr;      // 0.295
  var top = H / 2, cTop = tc / 2;
  var parts = [];
  function add(c) { if (c) parts.push(c); }
  function seg(a, b, per, tn) { return PC.line({ a: a, b: b, perUnit: per, tone: tn }); }

  // conductor planes above the core: the core's own face, then one per build-up layer
  var lay = [];
  for (var k = 0; k <= nb; k++) lay.push(cTop + k * tb);

  /* ---------------- the section, drawn in a local XY frame ---------------- */
  /* u runs 0..L along the cut face, y is the substrate's own thickness. */
  function section(L) {
    var s = [], i, k, u;
    // resin bulk behind everything
    s.push(PC.T(PC.scatter({ n: Math.round(L * H * 21000), w: L, h: H, d: 0, tone: 0.18 }), { pos: [L / 2, 0, 0] }));
    // the build-up film: the chokepoint, in the olive of the real film
    for (k = 1; k <= nb; k++) {
      var band = PC.scatter({ n: Math.round(L * tb * 34000), w: L, h: tb * 0.86, d: 0 });
      s.push(PC.T(PC.accent(band, 0.42), { pos: [L / 2, lay[k] - tb / 2, 0] }));
      s.push(PC.T(PC.accent(PC.scatter({ n: Math.round(L * tb * 34000), w: L, h: tb * 0.86, d: 0 }), 0.42), { pos: [L / 2, -lay[k] + tb / 2, 0] }));
    }
    // the core: darker, with a hint of the woven glass cloth inside it
    s.push(PC.T(PC.scatter({ n: Math.round(L * tc * 24000), w: L, h: tc, d: 0, tone: 0.42 }), { pos: [L / 2, 0, 0] }));
    for (i = 0; i < Math.round(L * 46); i++) {
      u = (i + 0.5) * L / Math.round(L * 46);
      [-tc * 0.22, tc * 0.22].forEach(function (yy) {
        s.push(seg([u - L * 0.008, yy, 0], [u + L * 0.008, yy, 0], 420, 0.55));
      });
    }
    // the eighteen conductor layers, drawn as traces in section rather than
    // continuous lines: a faint plane line, then dashes of copper on it
    function conductors(sgn) {
      for (k = 0; k <= nb; k++) {
        var y = sgn * lay[k];
        s.push(seg([0, y, 0], [L, y, 0], k === 0 ? 260 : 120, k === 0 ? 0.55 : 0.28));
        u = 0.004;
        while (u < L - 0.004) {
          var w = 0.004 + PC.rnd() * (k === 0 ? 0.05 : 0.028);
          if (u + w > L - 0.004) break;
          s.push(PC.accent2(seg([u, y, 0], [u + w, y, 0], 560, 1), 0.95));
          u += w + 0.004 + PC.rnd() * 0.02;
        }
      }
    }
    conductors(1); conductors(-1);
    // solder resist, top and bottom
    [1, -1].forEach(function (sg) {
      s.push(PC.T(PC.scatter({ n: Math.round(L * tr * 22000), w: L, h: tr, d: 0, tone: 0.42 }), { pos: [L / 2, sg * (lay[nb] + tr / 2), 0] }));
      s.push(seg([0, sg * top, 0], [L, sg * top, 0], 460, 0.95));
    });
    // plated through-holes: copper barrels straight through the core, with the
    // pads that cap them at both ends
    var np = Math.max(3, Math.round(L * 9));
    for (i = 0; i < np; i++) {
      u = (i + 0.5) * L / np + (PC.rnd() - 0.5) * 0.01;
      var hw = 0.0062;
      s.push(PC.accent2(seg([u - hw, -cTop, 0], [u - hw, cTop, 0], 560, 1), 0.82));
      s.push(PC.accent2(seg([u + hw, -cTop, 0], [u + hw, cTop, 0], 560, 1), 0.82));
      s.push(PC.accent2(seg([u - hw * 2.6, cTop, 0], [u + hw * 2.6, cTop, 0], 560, 1), 0.9));
      s.push(PC.accent2(seg([u - hw * 2.6, -cTop, 0], [u + hw * 2.6, -cTop, 0], 560, 1), 0.9));
    }
    // microvias: laser-drilled, tapered, one per build-up layer, some stacked in
    // a column and some staggered as they climb
    var nv = Math.max(4, Math.round(L * 8));
    for (i = 0; i < nv; i++) {
      var u0 = (i + 0.5) * L / nv, stacked = (i % 3 !== 0);
      [1, -1].forEach(function (sg) {
        var uu = u0, climb = 2 + Math.floor(PC.rnd() * (nb - 1));
        for (k = 1; k <= climb; k++) {
          if (!stacked) uu += (k % 2 ? 1 : -1) * 0.011;
          var yl = sg * lay[k - 1], yh = sg * lay[k];
          s.push(seg([uu - 0.0058, yh, 0], [uu - 0.0030, yl, 0], 560, 0.7));
          s.push(seg([uu + 0.0058, yh, 0], [uu + 0.0030, yl, 0], 560, 0.7));
        }
      });
    }
    // the solder balls, shown in section along the bottom edge
    var nbz = Math.max(4, Math.round(L * 22));
    for (i = 0; i < nbz; i++) {
      u = (i + 0.5) * L / nbz;
      var r = 0.011, arc = [];
      for (var a = 0; a <= 16; a++) { var th = Math.PI * a / 16; arc.push([u - r * Math.cos(th), -top - r * Math.sin(th) * 0.85, 0]); }
      s.push(PC.polyline({ pts: arc, perUnit: 620, tone: 0.9 }));
      s.push(PC.T(PC.scatter({ n: 60, w: r * 1.5, h: r * 1.1, d: 0, tone: 0.3 }), { pos: [u, -top - r * 0.42, 0] }));
    }
    return PC.merge.apply(null, s);
  }

  // the two exposed faces of the removed quarter
  add(PC.T(section(D / 2), { rot: [0, -Math.PI / 2, 0] }));          // faces +x, at x = 0
  add(section(W / 2));                                                // faces +z, at z = 0

  /* ---------------- the outside of the board ---------------- */
  function sheet(n, w, h, d, pos, tn) { return PC.T(PC.scatter({ n: n, w: w, h: h, d: d, tone: tn }), { pos: pos }); }
  // top and bottom, as the L left after the quarter is taken out
  [1, -1].forEach(function (sg) {
    var tn = sg > 0 ? 0.24 : 0.3;
    add(sheet(Math.round(W / 2 * D * 8000), W / 2, 0, D, [-W / 4, sg * top, 0], tn));
    add(sheet(Math.round(W / 2 * D / 2 * 8000), W / 2, 0, D / 2, [W / 4, sg * top, -D / 4], tn));
  });
  // the four sawn edges, the two facing the cut only half as long
  add(sheet(Math.round(D * H * 6000), 0, H, D, [-W / 2, 0, 0], 0.4));
  add(sheet(Math.round(W * H * 6000), W, H, 0, [0, 0, -D / 2], 0.4));
  add(sheet(Math.round(D / 2 * H * 6000), 0, H, D / 2, [W / 2, 0, -D / 4], 0.4));
  add(sheet(Math.round(W / 2 * H * 6000), W / 2, H, 0, [-W / 4, 0, D / 2], 0.4));
  // the L-shaped outline, top and bottom, and the vertical corners
  var Lp = [[-W / 2, 0, -D / 2], [W / 2, 0, -D / 2], [W / 2, 0, 0], [0, 0, 0], [0, 0, D / 2], [-W / 2, 0, D / 2]];
  [1, -1].forEach(function (sg) {
    add(PC.T(PC.polyline({ pts: Lp, closed: true, perUnit: 330, tone: sg > 0 ? 1 : 0.8 }), { pos: [0, sg * top, 0] }));
  });
  Lp.forEach(function (v) { add(seg([v[0], -top, v[2]], [v[0], top, v[2]], 300, 0.85)); });

  /* ---------------- what the two faces carry ---------------- */
  // top: the die shadow with its micro-bump pad field, and the capacitor pads
  // that ring it, both clipped by the cut
  function cut(c) {
    var keep = [], i;
    for (i = 0; i < c.length; i += 4) {
      if (c[i] > 1e-4 && c[i + 2] > 1e-4) continue;
      keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    }
    return new Float32Array(keep);
  }
  var sw = 0.82, sd = 0.53, yT = top + 0.003;
  add(cut(PC.T(PC.polyline({ pts: [[-sw / 2, 0, -sd / 2], [sw / 2, 0, -sd / 2], [sw / 2, 0, sd / 2], [-sw / 2, 0, sd / 2]], closed: true, perUnit: 360, tone: 1 }), { pos: [0, yT, 0] })));
  add(cut(PC.T(PC.dots({ nx: 46, nz: 30, sx: sw / 47, sz: sd / 31, per: 3, tone: 0.58 }), { pos: [0, yT, 0] })));
  var caps = [];
  for (var q = 0; q < 30; q++) {
    var cu = (q - 14.5) * (W * 0.94 / 30);
    if (Math.abs(cu) > sw / 2 + 0.02) continue;
    [-1, 1].forEach(function (sg) { caps.push(seg([cu, yT, sg * (sd / 2 + 0.028)], [cu, yT, sg * (sd / 2 + 0.056)], 520, 0.9)); });
  }
  for (q = 0; q < 20; q++) {
    var cv = (q - 9.5) * (D * 0.92 / 20);
    if (Math.abs(cv) > sd / 2 + 0.02) continue;
    [-1, 1].forEach(function (sg) { caps.push(seg([sg * (sw / 2 + 0.028), yT, cv], [sg * (sw / 2 + 0.056), yT, cv], 520, 0.9)); });
  }
  add(cut(PC.merge.apply(null, caps)));
  // bottom: the ball grid, drawn as balls so the underside is scalloped in
  // silhouette rather than flat
  var ball = PC.T(PC.sphere({ r: 0.0092, thetaMax: Math.PI / 2, n: 7, tone: 0.6 }), { scale: [1, -1, 1] });
  var bx = 40, bz = 28, bsx = W * 0.955 / bx, bsz = D * 0.94 / bz, balls = [];
  for (var gx = 0; gx < bx; gx++) for (var gz = 0; gz < bz; gz++) {
    balls.push(PC.T(ball, { pos: [(gx - (bx - 1) / 2) * bsx, -top - 0.001, (gz - (bz - 1) / 2) * bsz] }));
  }
  add(cut(PC.merge.apply(null, balls)));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.5, -0.64, 0],
    // colour: Ajinomoto build-up film is an olive-green to brown epoxy sheet
    accent: [111, 122, 47], accentDark: [178, 189, 96],
    // colour: the traces, plated through-holes and their pads are electroplated copper
    accent2: [176, 102, 44], accent2Dark: [224, 154, 92],
    caption: 'A flip-chip substrate with a quarter cut away. In the cut face: a glass-cloth core drilled edge to edge with plated through-holes, eight layers of build-up film laminated onto each side of it, copper traces in section on every layer, and the tapered laser-drilled microvias that climb from one layer to the next. On top, the pad field the package lands on, ringed by capacitors; underneath, the ball grid. The build-up film is the olive-green part: it comes from one supplier. Footprint is to scale; the thickness is exaggerated about twenty times.'
  };
});

})(window.PC);}catch(e){console.warn('specimen substrate-layers.js failed to load', e);}
/* wafer-cost.js */
try{(function(PC){
/* Specimen: the bill of materials for one B200, built as a column of ink.
 *
 * A stacked bar standing on a graduated plinth. Segment heights are the
 * dollars in Epoch AI's teardown of what it costs Nvidia to build a B200
 * (epoch.ai/data-insights/b200-cost-breakdown):
 *
 *   high-bandwidth memory      $2,900   46%   copper
 *   advanced packaging (CoWoS) $1,100   17%
 *   packaging yield loss       $1,000   16%   drawn hollow: it ships nothing
 *   logic die fabrication        $900   14%
 *   auxiliary (VRM, PCB, test)   $480    8%
 *                              ------
 *                              $6,380
 *
 * Each segment carries the texture of the thing it pays for: twelve
 * layer lines on the memory, a via field on the packaging, floorplan
 * hatching on the logic die. A rule graduated every $500 stands at one
 * corner and the gridlines cross the column at every thousand, so the
 * eye can read the bar as a chart rather than as a chip.
 */
PC.register('wafer-cost', function (p) {
  var parts = [];
  var S = 1.90 / 6380;                    // dollars -> units
  var CW = 0.60;                          // the column is square in plan
  var H = CW / 2;

  var BOM = [
    { name: 'hbm', usd: 2900, amber: true },
    { name: 'packaging', usd: 1100, tone: 0.30 },
    { name: 'loss', usd: 1000, hollow: true },
    { name: 'logic', usd: 900, tone: 0.24 },
    { name: 'aux', usd: 480, tone: 0.36 }
  ];

  function ring(w, y, per, tn) {
    return PC.T(PC.polyline({
      pts: [[-w / 2, 0, -w / 2], [w / 2, 0, -w / 2], [w / 2, 0, w / 2], [-w / 2, 0, w / 2]],
      closed: true, perUnit: per, tone: tn
    }), { pos: [0, y, 0] });
  }
  // the four vertical corner edges of a square prism
  function posts(w, y0, y1, per, tn) {
    var g = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      g.push(PC.line({ a: [q[0] * w / 2, y0, q[1] * w / 2], b: [q[0] * w / 2, y1, q[1] * w / 2], perUnit: per, tone: tn }));
    });
    return PC.merge.apply(null, g);
  }

  // ---------- the plinth ----------
  var PW = 0.84, PH = 0.038;
  parts.push(PC.T(PC.plane({ w: PW, d: PW, n: 6200, tone: 0.15 }), { pos: [0, PH / 2, 0] }));
  parts.push(PC.box({ w: PW, h: PH, d: PW, faces: ['px', 'nx', 'pz', 'nz'], n: 2000, tone: 0.36 }));
  parts.push(PC.boxEdges({ w: PW, h: PH, d: PW, perUnit: 300, tone: 1 }));
  var GE = PW / 2 - 0.03;
  for (var gi = 1; gi < 10; gi++) {
    var gp = -GE + gi * 2 * GE / 10;
    parts.push(PC.line({ a: [gp, PH / 2 + 0.001, -GE], b: [gp, PH / 2 + 0.001, GE], perUnit: 95, tone: 0.24 }));
    parts.push(PC.line({ a: [-GE, PH / 2 + 0.001, gp], b: [GE, PH / 2 + 0.001, gp], perUnit: 95, tone: 0.24 }));
  }
  parts.push(ring(2 * GE, PH / 2 + 0.002, 220, 0.5));
  parts.push(ring(CW + 0.10, PH / 2 + 0.002, 320, 0.85));

  // ---------- the stack ----------
  var y = PH, boundaries = [PH];
  BOM.forEach(function (seg) {
    var h = seg.usd * S, y0 = y, y1 = y + h, yc = (y0 + y1) / 2;
    var faceN = Math.round(4 * CW * h * 6200);

    if (seg.hollow) {
      // the money that buys nothing: an empty cage, crossed out on all four sides
      parts.push(posts(CW, y0, y1, 460, 1));
      for (var s = 0; s < 4; s++) {
        var a = s * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
        var p0 = [ca * CW / 2 - sa * CW / 2, y0, sa * CW / 2 + ca * CW / 2];
        var p1 = [ca * CW / 2 + sa * CW / 2, y0, sa * CW / 2 - ca * CW / 2];
        var q0 = [p0[0], y1, p0[2]], q1 = [p1[0], y1, p1[2]];
        parts.push(PC.line({ a: p0, b: q1, perUnit: 175, tone: 0.62 }));
        parts.push(PC.line({ a: p1, b: q0, perUnit: 175, tone: 0.62 }));
      }
    } else if (seg.amber) {
      // memory: twelve DRAM layers over a thicker base die
      parts.push(PC.T(PC.accent(PC.box({ w: CW, h: h, d: CW, faces: ['px', 'nx', 'pz', 'nz'], n: faceN }), 0.34), { pos: [0, yc, 0] }));
      parts.push(PC.accent(posts(CW, y0, y1, 420), 1));
      for (var k = 1; k <= 12; k++) {
        parts.push(PC.accent(ring(CW, y0 + h * 0.18 + (k / 12) * h * 0.80, 240), 0.95));
      }
      parts.push(PC.accent(ring(CW, y0 + h * 0.18, 400), 1));
      // the through-silicon vias that make a stack out of the layers
      for (var t = 0; t < 4; t++) {
        var tx = (t - 1.5) * CW * 0.22;
        parts.push(PC.accent(PC.line({ a: [tx, y0 + h * 0.18, CW / 2 + 0.001], b: [tx, y1, CW / 2 + 0.001], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [CW / 2 + 0.001, y0 + h * 0.18, tx], b: [CW / 2 + 0.001, y1, tx], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [tx, y0 + h * 0.18, -CW / 2 - 0.001], b: [tx, y1, -CW / 2 - 0.001], perUnit: 130 }), 0.85));
        parts.push(PC.accent(PC.line({ a: [-CW / 2 - 0.001, y0 + h * 0.18, tx], b: [-CW / 2 - 0.001, y1, tx], perUnit: 130 }), 0.85));
      }
    } else {
      parts.push(PC.T(PC.box({ w: CW, h: h, d: CW, faces: ['px', 'nx', 'pz', 'nz'], n: faceN, tone: seg.tone }), { pos: [0, yc, 0] }));
      parts.push(posts(CW, y0, y1, 420, 1));
      if (seg.name === 'packaging') {
        // an interposer: a few build-up lines and a field of vias
        for (k = 1; k <= 4; k++) parts.push(ring(CW, y0 + k * h / 5, 230, 0.7));
        for (var f = 0; f < 4; f++) {
          var ang = f * Math.PI / 2;
          parts.push(PC.T(PC.dots({ nx: 15, nz: 4, sx: CW * 0.062, sz: h * 0.17, per: 2, tone: 0.8 }),
            { rot: [Math.PI / 2, ang, 0], pos: [Math.sin(ang) * (CW / 2 + 0.001), yc, Math.cos(ang) * (CW / 2 + 0.001)] }));
        }
      } else if (seg.name === 'logic') {
        // two reticle-sized chiplets: floorplan hatching, banded
        parts.push(ring(CW, y0 + h * 0.5, 300, 0.75));
        for (f = 0; f < 4; f++) {
          ang = f * Math.PI / 2;
          for (var v = 0; v < 11; v++) {
            var vu = (v - 5) * CW * 0.084;
            var px = Math.cos(ang) * vu + Math.sin(ang) * (CW / 2 + 0.001);
            var pz = -Math.sin(ang) * vu + Math.cos(ang) * (CW / 2 + 0.001);
            parts.push(PC.line({ a: [px, y0 + h * 0.10, pz], b: [px, y1 - h * 0.10, pz], perUnit: 240, tone: 0.72 }));
          }
        }
      } else {
        // auxiliary: regulators and a connector, drawn as small blocks
        for (f = 0; f < 4; f++) {
          ang = f * Math.PI / 2;
          parts.push(PC.T(PC.dots({ nx: 9, nz: 2, sx: CW * 0.10, sz: h * 0.34, per: 3, tone: 0.8 }),
            { rot: [Math.PI / 2, ang, 0], pos: [Math.sin(ang) * (CW / 2 + 0.001), yc, Math.cos(ang) * (CW / 2 + 0.001)] }));
        }
      }
    }
    parts.push(ring(CW, y0, 520, 1));
    y = y1;
    boundaries.push(y1);
  });
  var TOP = y;
  // the lid: the finished module the whole bill adds up to
  parts.push(PC.T(PC.plane({ w: CW, d: CW, n: 1100, tone: 0.14 }), { pos: [0, TOP, 0] }));
  parts.push(ring(CW, TOP + 0.002, 560, 1));

  // ---------- the scale: gridlines every $1,000, a rule graduated every $500 ----------
  var grid = [];
  for (var d = 1000; d < 6380; d += 1000) {
    var gy = PH + d * S;
    grid.push(ring(CW + 0.11, gy, 150, 0.38));
    var cx = -(CW + 0.11) / 2, cz = -(CW + 0.11) / 2;
    grid.push(PC.line({ a: [cx, gy, cz], b: [-(CW / 2 + 0.155), gy, -(CW / 2 + 0.155)], perUnit: 460, tone: 1 }));
  }
  parts.push(PC.merge.apply(null, grid));

  var rx = -(CW / 2 + 0.155), rz = -(CW / 2 + 0.155);
  parts.push(PC.line({ a: [rx, PH, rz], b: [rx, TOP, rz], perUnit: 620, tone: 1 }));
  for (d = 500; d <= 6380; d += 500) {
    var ty = PH + d * S, major = (d % 1000 === 0), L = major ? 0.085 : 0.048;
    parts.push(PC.line({ a: [rx, ty, rz], b: [rx - L * 0.707, ty, rz - L * 0.707], perUnit: 560, tone: major ? 1 : 0.75 }));
  }
  // a leader from every segment boundary out to the rule
  boundaries.forEach(function (by) {
    parts.push(PC.line({ a: [-CW / 2, by, -CW / 2], b: [rx, by, rz], perUnit: 220, tone: 0.55 }));
  });
  parts.push(PC.line({ a: [-CW / 2, TOP, -CW / 2], b: [rx, TOP, rz], perUnit: 220, tone: 0.55 }));

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.09,
    tilt: [0.12, -0.62, 0],
    // colour: a chart, not an object, so it takes the site's own garnet
    accent: [122, 31, 43], accentDark: [201, 83, 106],
    caption: 'What it costs to build one B200, stacked to scale: $2,900 of high-bandwidth memory in garnet at the foot, $1,100 of CoWoS packaging, $1,000 of packaging yield loss drawn hollow because it ships nothing, $900 of logic die and $480 of board, power and test. About $6,400 in all, for a part that sells for thirty to forty thousand. The rule is graduated every $500.'
  };
});

})(window.PC);}catch(e){console.warn('specimen wafer-cost.js failed to load', e);}
/* wafer.js */
try{(function(PC){
/* Specimen: a polished 300 mm wafer with its printed field grid.
 *
 * Reference example for the kit, and the first object a visitor meets, so it is
 * shaded rather than stippled flat: the front face carries a broad specular
 * band the way a mirror-polished wafer does under a cleanroom light, and the
 * rectilinear scribe grid is laid on top of it.
 *
 * Real proportions (SEMI M1): 300 mm across, 775 um thick, a single orientation
 * notch (no flat above 200 mm), about 3 mm of edge exclusion where no usable
 * die is printed, and a rounded bevel at the apex of the edge. One unit here is
 * 150 mm, so R = 1. Two things are drawn larger than life or they would be
 * invisible at 570 px: the thickness (x2.3) and the notch (x6).
 *
 * The exposure field is one full reticle, 26 x 33 mm, which is 0.173 x 0.220
 * units, and 57 whole fields fall inside the exclusion circle. One of them is
 * picked out in copper: that single field is the largest area a scanner can
 * print in one shot, and every chapter after this one is about getting a
 * pattern into it.
 */
PC.register('wafer', function (p) {
  var R = 1.0;                 // 150 mm
  var t = 0.012;               // drawn thickness (775 um is 0.005; x2.3 so the rim reads)
  var rEx = 0.980;             // edge exclusion: 3 mm in from the rim
  var rBead = 0.9875;          // edge-bead removal ring
  var nD = 0.040;              // notch depth, 1 mm x 6
  var fw = 26 / 150, fh = 33 / 150;   // one reticle field
  var parts = [];

  // ---------- helpers ----------
  function shade(c, fn) {
    var o = new Float32Array(c);
    for (var i = 0; i < o.length; i += 4) o[i + 3] = fn(o[i], o[i + 1], o[i + 2], o[i + 3]);
    return o;
  }
  function cut(c, drop) {                     // remove the notch wedge
    var keep = [], i;
    for (i = 0; i < c.length; i += 4) if (!drop(c[i], c[i + 2])) keep.push(c[i], c[i + 1], c[i + 2], c[i + 3]);
    return new Float32Array(keep);
  }
  function inNotch(x, z) { return z > (R - nD) + Math.abs(x) - 1e-6; }   // 90 degree V on +Z

  // The polish: one broad highlight band running across the face, plus a slight
  // darkening at the rim. Kept in a narrow tonal range so the grid still reads.
  function polish(x, z) {
    var u = x * 0.50 + z * 0.87;                       // distance along the light axis
    var band = Math.exp(-((u + 0.12) * (u + 0.12)) / 0.30);
    var r2 = x * x + z * z;
    return (0.115 + 0.365 * band) * (1 - 0.26 * r2 * r2 * r2 * r2);
  }

  // ---------- the wafer body ----------
  // front face, shaded
  parts.push(cut(shade(PC.disc({ r: R }), function (x, y, z) { return polish(x, z); }),
    inNotch));
  // back face: sparse, so the disc has a body without doubling the ink
  parts.push(PC.T(cut(PC.thin(PC.disc({ r: R, tone: 0.11 }), 0.30), inNotch), { pos: [0, -t, 0] }));
  // the bevelled apex of the edge, and the rim outline itself
  parts.push(cut(PC.lathe({
    profile: [[R - 0.009, -t], [R, -t * 0.35], [R, t * 0.35], [R - 0.009, 0]], tone: 0.5
  }), inNotch));
  parts.push(cut(PC.circle({ r: R, perUnit: 900, tone: 0.92 }), inNotch));
  parts.push(PC.T(cut(PC.circle({ r: R, perUnit: 420, tone: 0.4 }), inNotch), { pos: [0, -t, 0] }));

  // ---------- the notch ----------
  // a 90 degree V, outlined top and bottom, with its two walls
  [[0, 1], [-t, 0.55]].forEach(function (lv) {
    parts.push(PC.polyline({
      pts: [[-nD, lv[0], R], [0, lv[0], R - nD], [nD, lv[0], R]],
      perUnit: 1600, tone: lv[1]
    }));
  });
  [-1, 1].forEach(function (s) {
    parts.push(PC.T(PC.plane({ w: 0.0016, d: nD * 1.42, tone: 0.55 }),
      { rot: [Math.PI / 2, s * Math.PI / 4, 0], pos: [s * nD / 2, -t / 2, R - nD / 2] }));
  });

  // ---------- edge exclusion ----------
  parts.push(cut(PC.circle({ r: rEx, perUnit: 760, tone: 0.92 }), inNotch));
  parts.push(cut(PC.circle({ r: rBead, perUnit: 380, tone: 0.55 }), inNotch));

  // ---------- the scribe grid: continuous streets clipped to the exclusion circle ----------
  var yTop = 0.0016, gx, gz, half;
  for (gx = -8; gx <= 8; gx++) {
    var x = (gx + 0.5) * fw;
    if (Math.abs(x) >= rEx) continue;
    half = Math.sqrt(rEx * rEx - x * x);
    parts.push(PC.line({ a: [x, yTop, -half], b: [x, yTop, half], perUnit: 760, tone: 1 }));
  }
  for (gz = -5; gz <= 5; gz++) {
    var z = (gz + 0.5) * fh;
    if (Math.abs(z) >= rEx) continue;
    half = Math.sqrt(rEx * rEx - z * z);
    parts.push(PC.line({ a: [-half, yTop, z], b: [half, yTop, z], perUnit: 760, tone: 1 }));
  }

  // ---------- seal rings inside every whole field (the second line weight) ----------
  var whole = 0, accentCell = null, ins = 0.10;
  for (gx = -8; gx <= 8; gx++) for (gz = -5; gz <= 5; gz++) {
    var cx = gx * fw, cz = gz * fh, ok = true;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      var px = cx + q[0] * fw / 2, pz = cz + q[1] * fh / 2;
      if (px * px + pz * pz > rEx * rEx) ok = false;
    });
    if (!ok) continue;
    whole++;
    if (gx === 1 && gz === 0) { accentCell = [cx, cz]; continue; }
    parts.push(PC.polyline({
      pts: [[cx - fw * (0.5 - ins), yTop, cz - fh * (0.5 - ins)],
            [cx + fw * (0.5 - ins), yTop, cz - fh * (0.5 - ins)],
            [cx + fw * (0.5 - ins), yTop, cz + fh * (0.5 - ins)],
            [cx - fw * (0.5 - ins), yTop, cz + fh * (0.5 - ins)]],
      closed: true, perUnit: 340, tone: 0.62
    }));
  }

  // ---------- one field in copper: the largest pattern a scanner prints at once ----------
  if (accentCell) {
    var ax = accentCell[0], az = accentCell[1];
    parts.push(PC.T(PC.accent(PC.plane({ w: fw * 0.82, d: fh * 0.86, n: 1900 }), 0.42),
      { pos: [ax, yTop + 0.0007, az] }));
    // a hint of the floorplan inside the one field the reader is meant to look into
    for (var q = -3; q <= 3; q++) {
      parts.push(PC.T(PC.accent(PC.line({
        a: [-fw * 0.41, 0, q * fh * 0.115], b: [fw * 0.41, 0, q * fh * 0.115], perUnit: 420
      }), 0.85), { pos: [ax, yTop + 0.0009, az] }));
    }
    parts.push(PC.T(PC.accent(PC.line({
      a: [0, 0, -fh * 0.42], b: [0, 0, fh * 0.42], perUnit: 420
    }), 0.85), { pos: [ax, yTop + 0.0009, az] }));
    parts.push(PC.T(PC.accent(PC.polyline({
      pts: [[-fw / 2, 0, -fh / 2], [fw / 2, 0, -fh / 2], [fw / 2, 0, fh / 2], [-fw / 2, 0, fh / 2]],
      closed: true, perUnit: 620
    }), 1), { pos: [ax, yTop + 0.0012, az] }));
  }

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.1,
    tilt: [0.92, -0.5, 0],
    // colour: a polished wafer is mirror silver; the picked-out field carries the faint blue of the anti-reflective coating under its resist
    accent: [90, 134, 180], accentDark: [169, 198, 228],
    caption: 'A polished 300 mm wafer, ruled by the scribe streets between exposure fields. ' +
      whole + ' whole 26 by 33 mm fields fall inside the edge-exclusion ring; ' +
      'the blue one is a single reticle field, the largest pattern a scanner can print in one shot. ' +
      'The V at the rim is the orientation notch, drawn six times its real size.'
  };
});

})(window.PC);}catch(e){console.warn('specimen wafer.js failed to load', e);}
