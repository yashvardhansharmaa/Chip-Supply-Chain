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
    s.cloud = PC.normalize(s.cloud, 1);
    if (s.spin == null) s.spin = 0.12;
    if (!s.tilt) s.tilt = [0.35, -0.6, 0];
    return s;
  };

  return PC;
});
