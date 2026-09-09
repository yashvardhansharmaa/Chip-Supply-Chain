/* Specimen: a 300 mm wafer with a reticle-die grid and a notch. Reference example for the kit. */
PC.register('wafer', function (p) {
  var R = 1.0, thick = 0.035;
  // The wafer body: a thin cylinder. Lighter tone so the die grid reads on top.
  var body = PC.cylinder({ r: R, h: thick, tone: 0.55 });
  // Notch at the wafer edge (a small bite): approximate by removing points near [0,*,R]
  var parts = [];
  for (var i = 0; i < body.length; i += 4) {
    var x = body[i], z = body[i + 2];
    if (Math.sqrt(x * x + (z - R) * (z - R)) < 0.06) continue;
    parts.push(body[i], body[i + 1], body[i + 2], body[i + 3]);
  }
  body = new Float32Array(parts);
  // Die grid: reticle-limited dies ~ 26 x 33 mm on a 300 mm wafer -> about 11 x 9 columns/rows.
  var dw = 0.176, dh = 0.22, grid = [];
  for (var gx = -6; gx <= 6; gx++) for (var gz = -5; gz <= 5; gz++) {
    var cx = gx * dw, cz = gz * dh;
    // keep dies fully inside the wafer
    var corners = [[cx - dw / 2, cz - dh / 2], [cx + dw / 2, cz - dh / 2], [cx - dw / 2, cz + dh / 2], [cx + dw / 2, cz + dh / 2]];
    var inside = corners.every(function (c) { return c[0] * c[0] + c[1] * c[1] < (R - 0.02) * (R - 0.02); });
    if (!inside) continue;
    var outline = PC.polyline({ pts: [[cx - dw / 2, 0, cz - dh / 2], [cx + dw / 2, 0, cz - dh / 2], [cx + dw / 2, 0, cz + dh / 2], [cx - dw / 2, 0, cz + dh / 2]], closed: true, perUnit: 260, tone: 1 });
    grid.push(PC.T(outline, { pos: [0, thick / 2 + 0.002, 0] }));
  }
  // A few highlighted (accent) dies near the centre
  var hl = PC.plane({ w: dw * 0.9, d: dh * 0.9, tone: 1 });
  var highlights = PC.merge(
    PC.T(PC.accent(hl, 0.9), { pos: [0, thick / 2 + 0.003, 0] }),
    PC.T(PC.accent(hl, 0.9), { pos: [dw, thick / 2 + 0.003, dh] })
  );
  var cloud = PC.merge(body, PC.merge.apply(null, grid), highlights);
  return {
    cloud: cloud,
    spin: 0.1,
    tilt: [0.9, -0.5, 0],
    caption: 'A 300 mm wafer carrying about 70 reticle-sized dies. Two dies are highlighted.'
  };
});
