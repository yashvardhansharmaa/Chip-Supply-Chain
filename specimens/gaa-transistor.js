/* Specimen: a gate-all-around (nanosheet) transistor.
 * Three stacked silicon channels threaded through a gate that wraps them on
 * every face, epitaxial source/drain diamonds at both ends, shallow trench
 * isolation in the substrate below, and metal contacts rising to the wiring.
 * Scale: 1 nm = 0.014 units — sheets 36 nm wide and 5 nm thick on an 18 nm
 * pitch, an 18 nm gate: a device about 120 nm across.
 */
PC.register('gaa-transistor', function (p) {
  var nm = 0.014;
  var sheetLen = 80 * nm, sheetW = 36 * nm, sheetT = 5 * nm, pitch = 18 * nm;
  var gateLen = 20 * nm, gateD = sheetW + 26 * nm;
  var yTop = 2 * pitch;                                  // centre of the top sheet
  var gateBot = -8 * nm, gateTop = yTop + 14 * nm;
  var parts = [];
  function add(c) { parts.push(c); }
  function rect(w, d, y, per, tn) {
    return PC.polyline({ pts: [[-w / 2, y, -d / 2], [w / 2, y, -d / 2], [w / 2, y, d / 2], [-w / 2, y, d / 2]], closed: true, perUnit: per, tone: tn });
  }

  // ---------- substrate, shallow trench isolation, bottom isolation ----------
  var subW = 100 * nm, subD = 74 * nm, subH = 18 * nm, subY = -26 * nm;
  var subTop = subY + subH / 2;
  add(PC.T(PC.box({ w: subW, h: subH, d: subD, faces: ['px', 'nx', 'pz', 'nz'], n: 5000, tone: 0.34 }), { pos: [0, subY, 0] }));
  add(PC.T(PC.plane({ w: subW, d: subD, n: 3600, tone: 0.24 }), { pos: [0, subTop, 0] }));
  add(PC.T(PC.boxEdges({ w: subW, h: subH, d: subD, perUnit: 260, tone: 0.8 }), { pos: [0, subY, 0] }));

  // silicon mesa: the fin the sheets were cut from
  var mesaH = 9 * nm, mesaY = subTop + mesaH / 2;
  add(PC.T(PC.box({ w: sheetLen * 1.04, h: mesaH, d: sheetW, faces: ['px', 'nx', 'pz', 'nz'], n: 2000, tone: 0.45 }), { pos: [0, mesaY, 0] }));
  add(PC.T(PC.boxEdges({ w: sheetLen * 1.04, h: mesaH, d: sheetW, perUnit: 260, tone: 0.65 }), { pos: [0, mesaY, 0] }));

  // shallow trench isolation: oxide on both sides, its top just under the channels
  var stiH = 9 * nm, stiY = subTop + stiH / 2, stiD = (subD - sheetW) / 2 - 2 * nm;
  [1, -1].forEach(function (s) {
    var zc = s * (sheetW / 2 + stiD / 2 + 1.5 * nm);
    add(PC.T(PC.box({ w: subW, h: stiH, d: stiD, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 1800, tone: 0.18 }), { pos: [0, stiY, zc] }));
  });

  // bottom dielectric isolation under the sheet stack
  var biY = mesaY + mesaH / 2 + 2 * nm;
  add(PC.T(PC.plane({ w: sheetLen * 1.02, d: sheetW + 4 * nm, n: 900, tone: 0.45 }), { pos: [0, biY, 0] }));
  add(rect(sheetLen * 1.02, sheetW + 4 * nm, biY, 240, 0.5));

  // ---------- the three nanosheets ----------
  // Outside the gate they are solid with crisp edges; the length swallowed by the
  // gate is drawn faintly, as an x-ray, so the gate block stays legible.
  var gx = gateLen / 2, segLen = sheetLen / 2 - gx;
  for (var i = 0; i < 3; i++) {
    var y = i * pitch;
    add(PC.T(PC.box({ w: gateLen, h: sheetT, d: sheetW, faces: ['py', 'pz', 'nz'], n: 500, tone: 0.3 }), { pos: [0, y, 0] }));
    add(PC.T(PC.boxEdges({ w: gateLen, h: sheetT, d: sheetW, perUnit: 150, tone: 0.4 }), { pos: [0, y, 0] }));
    [1, -1].forEach(function (s) {
      var xc = s * (gx + segLen / 2);
      add(PC.T(PC.box({ w: segLen, h: sheetT, d: sheetW, faces: ['py', 'px', 'nx', 'pz', 'nz'], n: 3000, tone: 0.62 }), { pos: [xc, y, 0] }));
      add(PC.T(PC.boxEdges({ w: segLen, h: sheetT, d: sheetW, perUnit: 340, tone: 1 }), { pos: [xc, y, 0] }));
    });
  }

  // ---------- the gate: a block wrapping the whole stack, drawn hollow ----------
  var gateH = gateTop - gateBot, gateY = (gateTop + gateBot) / 2;
  add(PC.T(PC.box({ w: gateLen, h: gateH, d: gateD, faces: ['py', 'pz', 'nz'], n: 10000, tone: 0.45 }), { pos: [0, gateY, 0] }));
  add(PC.T(PC.boxEdges({ w: gateLen, h: gateH, d: gateD, perUnit: 420, tone: 1 }), { pos: [0, gateY, 0] }));
  // the wrap: outline the gate metal filling the space under, between and over the sheets
  for (i = 0; i < 4; i++) add(rect(gateLen, gateD, (i - 0.5) * pitch, 340, 0.9));
  // inner spacers: the dielectric plugs that seal the gate off from the epitaxy,
  // one in every gap on both sides of the gate
  var isW = 4 * nm, gapH = pitch - sheetT;
  for (i = 0; i < 4; i++) {
    var yg = (i - 0.5) * pitch;
    [1, -1].forEach(function (s) {
      var xc = s * (gateLen / 2 + isW / 2);
      add(PC.T(PC.box({ w: isW, h: gapH, d: sheetW, faces: ['px', 'nx', 'py', 'ny'], n: 300, tone: 0.55 }), { pos: [xc, yg, 0] }));
      add(PC.T(PC.boxEdges({ w: isW, h: gapH, d: sheetW, perUnit: 160, tone: 0.8 }), { pos: [xc, yg, 0] }));
    });
  }

  // ---------- epitaxial source and drain: diamond prisms over the sheet ends ----------
  var epiHH = 21 * nm, epiWW = 24 * nm, epiLen = 24 * nm, epiY = pitch, epiX = 33 * nm;
  [1, -1].forEach(function (s) {
    var d = PC.thin(PC.extrude({ shape: [[-epiHH, 0], [0, -epiWW], [epiHH, 0], [0, epiWW]], h: epiLen, tone: 0.36 }), 0.62);
    add(PC.T(d, { rot: [0, 0, Math.PI / 2], pos: [s * epiX, epiY, 0] }));
    [[epiLen / 2, 320, 1], [-epiLen / 2, 200, 0.45]].forEach(function (q) {
      var dx = s * q[0];
      add(PC.polyline({
        pts: [[s * epiX + dx, epiY + epiHH, 0], [s * epiX + dx, epiY, epiWW], [s * epiX + dx, epiY - epiHH, 0], [s * epiX + dx, epiY, -epiWW]],
        closed: true, perUnit: q[1], tone: q[2]
      }));
    });
    [[epiHH, 0], [-epiHH, 0], [0, epiWW], [0, -epiWW]].forEach(function (v) {
      add(PC.line({ a: [s * epiX - epiLen / 2, epiY + v[0], v[1]], b: [s * epiX + epiLen / 2, epiY + v[0], v[1]], perUnit: 240, tone: 0.6 }));
    });
  });

  // ---------- metal contacts (accent) ----------
  var cTop = 52 * nm;
  function contact(x, w, d, yBot) {
    var h = cTop - yBot;
    add(PC.T(PC.accent(PC.box({ w: w, h: h, d: d, faces: ['px', 'nx', 'py', 'pz', 'nz'], n: 3000 }), 0.5), { pos: [x, yBot + h / 2, 0] }));
    add(PC.T(PC.accent(PC.boxEdges({ w: w, h: h, d: d, perUnit: 300 }), 1), { pos: [x, yBot + h / 2, 0] }));
  }
  contact(epiX, epiLen * 0.7, epiWW * 1.05, epiY + epiHH * 0.3);
  contact(-epiX, epiLen * 0.7, epiWW * 1.05, epiY + epiHH * 0.3);
  contact(0, gateLen * 0.75, gateD * 0.4, gateTop - 2 * nm);

  return {
    cloud: PC.merge.apply(null, parts),
    spin: 0.12,
    tilt: [0.3, -0.38, 0],
    caption: 'A gate-all-around nanosheet transistor roughly 120 nm across: three silicon channels stacked one above another, a gate wrapping every face of all three, epitaxial source and drain diamonds at the ends, inner spacers sealing the gate off from them, and copper contacts rising to the wiring above.'
  };
});
