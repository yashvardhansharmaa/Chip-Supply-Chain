/* =====================================================================================================
   16 Who controls the chain: the world, with nineteen chokepoint towns pinned in garnet (the taller the pin, the tighter
   the chokepoint at that town's stage) and five towns building alternatives pinned in ink. The pins drop into their
   towns and stand there: a globe has no assembly to pull apart, so this plate rests closed. It is the one plate that keeps
   turning (spin), slowly, about the Earth's axis: still, it would hide the four American towns. Its two labels stay where
   they are and point at whichever of their towns face the reader on their side (track). The coast, the towns and their
   pins' heights are read from specimens/globe.js by build/plates.js (window.PLATE_GLOBE). */
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
  var SITES = G.SITES || [['Veldhoven', 51.42, 5.40, 5], ['Oberkochen', 48.78, 10.10, 5], ['Hsinchu', 24.80, 120.97, 5], ['Tainan', 22.99, 120.21, 5], ['Kaohsiung', 22.63, 120.30, 5], ['Icheon', 37.28, 127.44, 5], ['Pyeongtaek', 36.99, 127.11, 5], ['Kumamoto', 32.80, 130.71, 5], ['Yokkaichi', 34.97, 136.62, 5], ['Tokyo', 35.68, 139.69, 4], ['Shanghai', 31.23, 121.47, 5], ['Penang', 5.41, 100.34, 4], ['Singapore', 1.35, 103.82, 4], ['Bengaluru', 12.97, 77.59, 4], ['Abu Dhabi', 24.45, 54.38, 4], ['Hillsboro', 45.52, -122.99, 5], ['Phoenix', 33.45, -112.07, 5], ['Austin', 30.27, -97.74, 4], ['Boise', 43.62, -116.20, 5]];
  var SUBS = G.SUBS || [['Beijing', 39.90, 116.40], ['Wuhan', 30.59, 114.31], ['Shenzhen', 22.54, 114.06], ['Hefei', 31.82, 117.23], ['Dresden', 51.05, 13.74]];
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
  SITES.forEach(function (s, i) { pin(s[1], s[2], 0.032 * s[3], 'acc', i); });
  SUBS.forEach(function (s, i) { pin(s[1], s[2], 0.064, 'ink', 20 + i); });
  // the Earth's axis as a centre line, and labels in the caption's words, each with leaders to three of its pins
  m.use(g);
  // review: with the north pole now in view, the axis's north end runs from the pole out past the rim, drawn over the
  // globe, and its south end shows below the rim (at +-1.16 the whole axis fell inside the disc at this tilt)
  m.guide([[0, 1, 0, g.idx], [0, 1.3, 0, g.idx]], { style: 'axis', alpha: 0.9, front: true });
  m.guide([[0, -1.3, 0, g.idx], [0, -1, 0, g.idx]], { style: 'axis', alpha: 0.9 });
  var head = function (lat, lon, hgt, i) { var q = ll(lat, lon, 1 + hgt); return [q[0], q[1], q[2], m.parts.filter(function (p) { return p.name === 'pin' + i; })[0].idx]; };
  // review: 'Chokepoint towns' points at two of the tallest pins (Hsinchu, Yokkaichi) and the alternatives' label at
  // Shenzhen's ink pin, just below them; before, the two labels pointed at Abu Dhabi and Bengaluru, two of the
  // shortest pins, and at a Dresden pin lost among the garnet pins on the rim
  // the globe turns, so each label carries the towns it may point at (track): a leader fades in as its town comes round to the
  // label's side and out as it nears the rim. The two it points at in the drawn view set the label's height
  var site = function (name) { for (var i = 0; i < SITES.length; i++) if (SITES[i][0] === name) return head(SITES[i][1], SITES[i][2], 0.032 * SITES[i][3], i); return null; };
  var sub = function (name) { for (var i = 0; i < SUBS.length; i++) if (SUBS[i][0] === name) return head(SUBS[i][1], SUBS[i][2], 0.064, 20 + i); return null; };
  var keep = function (a) { return a.filter(function (q) { return !!q; }); };
  m.callout(keep([site('Hsinchu'), site('Yokkaichi')]), 'Chokepoint towns', { side: 'r', col: 'acc' });
  m.callouts[m.callouts.length - 1].track = keep(['Hsinchu', 'Yokkaichi', 'Icheon', 'Veldhoven', 'Oberkochen', 'Phoenix', 'Boise'].map(site));
  m.callout(keep([sub('Shenzhen')]), 'Towns building alternatives', { side: 'r' });
  m.callouts[m.callouts.length - 1].track = keep(['Shenzhen', 'Beijing', 'Dresden'].map(sub));
  // review: the view looks down on 36N 72E. From over 23N 106E the East Asian pins pointed almost at the reader and
  // stood at a quarter of their height, while Veldhoven's and Oberkochen's lay along the rim at full height, so the
  // drawing showed Europe's chokepoints as the tallest. From here every five-point pin stands taller than every
  // four-point pin, as the caption says ('the taller the garnet pin, the tighter the chokepoint')
  return { elev: 36 * RAD, yaw: -72 * RAD, spin: 0.06, start: 1, rest: 0, maxH: 430, accent: [122, 31, 43], accentDark: [201, 83, 106] };
});
