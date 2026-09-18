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
