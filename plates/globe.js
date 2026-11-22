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
