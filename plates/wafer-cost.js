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
  // review: the total is a dimension up the whole column at its front-left corner. It was a label on the top face, which
  // read as a sixth layer worth $6,400, beside an unfigured rule ticked every $500
  m.dim([-CW / 2, PH, CW / 2], [-CW / 2, TOP, CW / 2], [-0.12, 0, 0.12], 'about $6,400', { part: 0 });
  return { elev: PLATE.DIM.elev, yaw: PLATE.DIM.yaw, start: 1, rest: 0, sortAxis: [0, 1, 0], accent: [122, 31, 43], accentDark: [201, 83, 106] };
});
