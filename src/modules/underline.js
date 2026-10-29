/* Chips built just under the line, first on Export Controls (build/modules/under-line.js writes the section and its data;
   the owner's approved mockup 5 of 29 Oct 2026). Each AI chip whose record states its TPP is plotted against the US
   control lines in force on a date the reader sets, with the date ruler or the five rule buttons. The vertical scale is
   the second quantity the rule in force measured: chip-to-chip bandwidth under the October 2022 rule (and after its
   deletion, until the memory rule of December 2024), memory bandwidth from December 2024. A chip appears in the month its
   record dates it. Hover, focus or tap a dot for its record beside the chart; Table, CSV, PNG and Cite act as on any
   figure. Every number printed is the chip record's own. */
(function () {
  'use strict';
  var D = document, sec = D.getElementById('controls-under-the-line'), src = D.getElementById('controls-ul-data');
  if (!sec || !src) return;
  var DATA; try { DATA = JSON.parse(src.textContent); } catch (e) { return; }
  var ERAS = DATA.eras, LAST = DATA.last;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var idx = function (s) { var p = String(s).split('-'); return (+p[0] - 2022) * 12 + ((+p[1] || 1) - 10); };
  var monthName = function (i) { var t = i + 9; return MONTHS[((t % 12) + 12) % 12] + ' ' + (2022 + Math.floor(t / 12)); };
  var eraOf = function (m) { var e = 0; ERAS.forEach(function (x, i) { if (x.at <= m) e = i; }); return e; };
  var NAMED = { 'nvidia-a800': 1, 'nvidia-h800': 1, 'nvidia-h20': 1 };
  var LABELED = { 'nvidia-a100': 1, 'nvidia-h100': 1, 'nvidia-h200-china': 1, 'amd-mi325x': 1, 'amd-mi300x': 1 };
  var byId = {}; DATA.chips.forEach(function (c) { byId[c.id] = c; });
  var chips = DATA.chips.slice().sort(function (a, b) { return (NAMED[a.id] ? 1 : 0) - (NAMED[b.id] ? 1 : 0); }); // the named on top
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var state = { m: ERAS[0].end, sel: 'nvidia-a800', hover: null, W: 0 };
  var fig = sec.querySelector('.figure'), plot = sec.querySelector('.ul-plot'), when = sec.querySelector('.ul-when'), cap = sec.querySelector('.ul-cap');
  var input = sec.querySelector('.ul-scrub input'), side = sec.querySelector('.ul-side');
  var btns = [].slice.call(sec.querySelectorAll('.ul-steps button')), ticks = [].slice.call(sec.querySelectorAll('.ul-ticks .ul-stop'));
  var uid = 'controls-ul-hatch';

  function geom() {
    var W = Math.round(plot.clientWidth), wide = W >= 520, PH = wide ? 300 : 240, top = 50, y1 = top + PH, x0 = 6, x1 = W - 6;
    return { W: W, wide: wide, PH: PH, top: top, y1: y1, x0: x0, x1: x1, H: y1 + 66,
      X: function (t) { return x0 + t / 24000 * (x1 - x0); },
      Yc: function (v) { return y1 - v / 1300 * PH; }, Ym: function (v) { return y1 - v / 7000 * PH; }, gy: y1 + 18 };
  }
  function draw() {
    var g = geom(); if (!g.W) return; state.W = g.W;
    var o = [], X = g.X;
    o.push('<svg viewBox="0 0 ' + g.W + ' ' + g.H + '" width="' + g.W + '" height="' + g.H + '" role="img" aria-label="AI chips plotted by TPP and bandwidth against the US control lines">');
    o.push('<defs><pattern id="' + uid + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="ct-hatch-line" x1="0" y1="0" x2="0" y2="6"></line></pattern></defs>');
    // regions: controlled (its height set per rule), the 3A090.b band, the case-by-case box
    o.push('<rect class="ct-reg ct-ctrl" x="' + X(4800) + '" width="' + (g.x1 - X(4800)) + '" y="' + g.top + '" height="' + g.PH + '"></rect>');
    o.push('<rect class="ct-reg ct-band ct-fade" data-e="1-4" fill="url(#' + uid + ')" x="' + X(2400) + '" width="' + (X(4800) - X(2400)) + '" y="' + g.top + '" height="' + g.PH + '"></rect>');
    o.push('<rect class="ct-reg ct-case ct-fade" data-e="4" x="' + X(4800) + '" width="' + (X(21000) - X(4800)) + '" y="' + g.Ym(6500) + '" height="' + (g.y1 - g.Ym(6500)) + '"></rect>');
    // the lines and their values, as data/control-thresholds.json gives them
    o.push('<line class="ct-line soft ct-fade" data-e="1-4" x1="' + X(1600) + '" x2="' + X(1600) + '" y1="' + g.top + '" y2="' + g.y1 + '"></line>');
    o.push('<line class="ct-line ct-fade" data-e="1-4" x1="' + X(2400) + '" x2="' + X(2400) + '" y1="' + g.top + '" y2="' + (g.y1 + 30) + '"></line>');
    o.push('<line class="ct-line" x1="' + X(4800) + '" x2="' + X(4800) + '" y1="' + g.top + '" y2="' + (g.y1 + 30) + '"></line>');
    o.push('<line class="ct-line ct-fade" data-e="0" x1="' + X(4800) + '" x2="' + g.x1 + '" y1="' + g.Yc(600) + '" y2="' + g.Yc(600) + '"></line>');
    o.push('<line class="ct-line gone ct-fade" data-e="1" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + g.Yc(600) + '" y2="' + g.Yc(600) + '"></line>');
    o.push('<text class="ct-t m ct-fade" data-e="1-4" x="' + X(1600) + '" y="' + (g.top - 22) + '" text-anchor="middle">1,600</text>');
    o.push('<text class="ct-t ct-fade" data-e="1-4" x="' + X(2400) + '" y="' + (g.top - 8) + '" text-anchor="middle">2,400</text>');
    o.push('<text class="ct-t k" x="' + X(4800) + '" y="' + (g.top - 8) + '" text-anchor="middle">4,800</text>');
    o.push('<text class="ct-t k ct-fade" data-e="4" x="' + X(21000) + '" y="' + (g.top - 8) + '" text-anchor="middle">21,000</text>');
    o.push('<line class="ct-line dot ct-fade" data-e="4" x1="' + X(21000) + '" x2="' + X(21000) + '" y1="' + g.top + '" y2="' + g.Ym(6500) + '"></line>');
    o.push('<text class="ct-t k ct-fade" data-e="0" x="' + (g.x1 - 4) + '" y="' + (g.Yc(600) + 15) + '" text-anchor="end">600 GB/s</text>');
    o.push('<text class="ct-t m ct-fade" data-e="1" x="' + (g.x1 - 4) + '" y="' + (g.Yc(600) - 6) + '" text-anchor="end">600 GB/s test, deleted</text>');
    o.push('<text class="ct-t k ct-fade" data-e="4" x="' + (X(4800) + 6) + '" y="' + (g.Ym(6500) - 6) + '">6,500 GB/s</text>');
    o.push('<text class="ct-t k ct-fade" data-e="4" x="' + (X(4800) + 6) + '" y="' + (g.Ym(6500) + 16) + '">Case by case</text>');
    o.push('<text class="ct-t k" x="' + (g.x1 - 6) + '" y="' + (g.top + 16) + '" text-anchor="end">Controlled</text>');
    var bx = (X(2400) + X(4800)) / 2;
    if (g.wide) o.push('<text class="ct-t m ct-fade" data-e="1-4" transform="translate(' + (bx + 4) + ' ' + (g.top + 8) + ') rotate(90)">3A090.b band, density window</text>');
    // the axes
    o.push('<line class="ct-axis" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + g.y1 + '" y2="' + g.y1 + '"></line>');
    o.push('<line class="ct-axis" x1="' + g.x0 + '" x2="' + g.x0 + '" y1="' + g.top + '" y2="' + g.y1 + '"></line>');
    o.push('<text class="ct-t k ct-fade" data-e="0-1" x="' + g.x0 + '" y="12">↑ Chip-to-chip bandwidth</text>');
    o.push('<text class="ct-t k ct-fade" data-e="2-4" x="' + g.x0 + '" y="12">↑ Memory bandwidth</text>');
    o.push('<text class="ct-t m" x="' + (g.x0 + 2) + '" y="' + (g.y1 + 44) + '">0</text>');
    o.push('<text class="ct-t k" x="' + g.x1 + '" y="' + (g.y1 + 44) + '" text-anchor="end">Total processing performance (TPP) →</text>');
    o.push('<line class="ct-gut ct-fade" data-e="0-1" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + (g.y1 + 30) + '" y2="' + (g.y1 + 30) + '"></line>');
    o.push('<text class="ct-t m ct-fade" data-e="0-1" x="' + g.x0 + '" y="' + (g.y1 + 60) + '">Under the axis, chips with no single chip-to-chip figure stated</text>');
    // the chips
    chips.forEach(function (c) {
      var cls = 'ct-chip' + (NAMED[c.id] ? ' named' : '') + (LABELED[c.id] ? ' lab' : '') + (c.merchant ? '' : ' own');
      o.push('<g class="' + cls + '" data-id="' + c.id + '" tabindex="0" role="button" aria-label="' + esc(c.vendor + ' ' + c.name + ', TPP ' + c.tppT) + '">' +
        '<line class="ct-rng" x1="0" x2="0" y1="0" y2="0"></line><circle class="ct-sel" r="10"></circle><circle class="ct-ring" r="11"></circle>' +
        '<circle class="ct-dot" r="' + (NAMED[c.id] ? 6 : 4.6) + '"></circle><text x="9" y="4">' + esc(c.name) + '</text></g>');
    });
    o.push('</svg>');
    plot.innerHTML = o.join('');
    [].forEach.call(plot.querySelectorAll('.ct-chip'), function (el) {
      var id = el.getAttribute('data-id');
      el.addEventListener('mouseenter', function () { state.hover = id; panel(); });
      el.addEventListener('mouseleave', function () { state.hover = null; panel(); });
      el.addEventListener('focus', function () { state.hover = id; panel(); });
      el.addEventListener('blur', function () { state.hover = null; panel(); });
      el.addEventListener('click', function () { state.sel = id; state.hover = null; update(); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.sel = id; update(); } });
    });
    update();
  }
  function inEra(spec, e) { var p = String(spec).split('-'); return e >= +p[0] && e <= +(p[1] || p[0]); }
  function update() {
    var g = geom(), e = eraOf(state.m), era = ERAS[e], mode = era.mode;
    input.value = state.m;
    when.innerHTML = '<b>' + monthName(state.m) + '</b> · in force: ' + esc(era.rule);
    cap.textContent = era.cap;
    btns.forEach(function (b, i) { if (i === e) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    ticks.forEach(function (t, i) { t.classList.toggle('on', i === e); });
    var ctrl = plot.querySelector('.ct-ctrl');
    if (ctrl) { var hh = e === 0 ? g.Yc(600) - g.top : g.PH; ctrl.setAttribute('height', hh); ctrl.style.height = hh + 'px'; } // the style, so the change moves
    [].forEach.call(plot.querySelectorAll('.ct-fade'), function (el) { el.classList.toggle('off', !inEra(el.getAttribute('data-e'), e)); });
    // place the chips, then their labels, the named first; a label keeps off the horizontal lines in force: the 600 GB/s
    // line (2022, and its dashed trace in 2023) and the 6,500 GB/s ceiling (2026)
    var placed = [], vis = [];
    if (mode === 'c2c') placed.push([e === 0 ? g.X(4800) : g.x0, g.Yc(600) - 2, g.x1, g.Yc(600) + 2]);
    if (e === 4) placed.push([g.X(4800), g.Ym(6500) - 2, g.X(21000), g.Ym(6500) + 2]);
    [].forEach.call(plot.querySelectorAll('.ct-chip'), function (el) {
      var c = byId[el.getAttribute('data-id')], on = idx(c.announced) <= state.m, cx = g.X(c.tpp), cy, rng = null;
      if (mode === 'c2c') {
        if (c.c2c == null) cy = g.gy;
        else if (typeof c.c2c === 'number') cy = g.Yc(c.c2c);
        else { cy = g.Yc((c.c2c[0] + c.c2c[1]) / 2); rng = [g.Yc(c.c2c[0]) - cy, g.Yc(c.c2c[1]) - cy]; }
      } else cy = g.Ym(c.bw);
      el.classList.toggle('off', !on);
      el.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')');
      el.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      var ln = el.querySelector('.ct-rng');
      if (rng) { ln.setAttribute('y1', rng[0]); ln.setAttribute('y2', rng[1]); }
      el.classList.toggle('ranged', !!rng);
      el.classList.toggle('ringed', c.id === 'nvidia-h20' && e >= 3);
      el.classList.toggle('sel', c.id === state.sel);
      if (on) vis.push({ el: el, c: c, x: cx, y: cy });
    });
    // chips at one point share one label (the A100 and A800 have the same TPP and memory bandwidth)
    var rank = function (c) { return NAMED[c.id] ? 2 : LABELED[c.id] ? 1 : 0; };
    var order = vis.slice().sort(function (a, b) { return rank(b.c) - rank(a.c); });
    var used = {};
    order.forEach(function (v) {
      var t = v.el.querySelector('text');
      if (used[v.c.id]) { t.classList.add('hide'); t.textContent = ''; return; }
      var mates = vis.filter(function (w) { return w !== v && !used[w.c.id] && Math.abs(w.x - v.x) < 3 && Math.abs(w.y - v.y) < 3; });
      mates.forEach(function (w) { used[w.c.id] = 1; });
      used[v.c.id] = 1;
      var names = [v.c].concat(mates.map(function (w) { return w.c; }));
      t.innerHTML = names.map(function (c, i) { return (i ? '<tspan class="ct-sep"> · </tspan>' : '') + '<tspan class="' + (NAMED[c.id] ? 'ct-nm' : 'ct-ot') + '">' + esc(c.name) + '</tspan>'; }).join('');
      var big = NAMED[v.c.id], wpx = names.reduce(function (s, c) { return s + c.name.length; }, 0) * (big ? 7.6 : 6.6) + (names.length - 1) * 14, hpx = big ? 14 : 12;
      var tries = [[9, 4, 'start'], [-9, 4, 'end'], [0, -10, 'middle'], [0, 17, 'middle']], ok = null;
      for (var k = 0; k < tries.length && !ok; k++) {
        var tr = tries[k], lx = tr[2] === 'start' ? v.x + tr[0] : tr[2] === 'end' ? v.x + tr[0] - wpx : v.x - wpx / 2, ly = v.y + tr[1] - hpx + 3;
        if (lx < g.x0 + 2 || lx + wpx > g.x1) continue;
        var box = [lx, ly, lx + wpx, ly + hpx];
        var hit = placed.some(function (b) { return !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]); }) ||
          vis.some(function (w) { return w !== v && mates.indexOf(w) < 0 && w.x > box[0] - 4 && w.x < box[2] + 4 && w.y > box[1] - 4 && w.y < box[3] + 4; });
        if (!hit) { ok = tr; placed.push(box); }
      }
      if (!ok && big) ok = tries[0];
      if (ok) { t.setAttribute('x', ok[0]); t.setAttribute('y', ok[1]); t.setAttribute('text-anchor', ok[2]); t.classList.remove('hide'); }
      else { t.setAttribute('x', 9); t.setAttribute('y', 4); t.setAttribute('text-anchor', 'start'); t.classList.add('hide'); }
      // the dots of a shared point: the top one carries the label
      mates.forEach(function (w) { var tt = w.el.querySelector('text'); tt.classList.add('hide'); tt.textContent = ''; });
    });
    panel();
  }
  // the chosen chip beside the chart (under it below 1,100 px): its record's numbers and its note for the rule in force
  function panel() {
    var c = byId[state.hover || state.sel]; if (!c) return;
    var e = eraOf(state.m), note = c.eraNotes ? (c.eraNotes[e] || c.note) : c.note;
    var a = String(c.announced).split('-'), ann = a[1] ? MONTHS[+a[1] - 1] + ' ' + a[0] : a[0];
    side.innerHTML = '<p class="k">' + (state.hover ? 'Chip under the pointer' : 'Chosen chip') + '</p><h3>' + esc(c.vendor + ' ' + c.full) + '</h3>' +
      '<dl><dt>TPP</dt><dd>' + esc(c.tppT) + '</dd><dt>Chip-to-chip</dt><dd>' + esc(c.c2cT) + '</dd><dt>Memory bandwidth</dt><dd>' + esc(c.bwT) + '</dd><dt>Announced</dt><dd>' + esc(ann) + '</dd></dl>' +
      '<p>' + esc(note) + '</p><a href="#/landscape?pick=' + encodeURIComponent(c.id) + '">Its record on AI Chips <span aria-hidden="true">→</span></a>' +
      '<div class="ul-key" aria-hidden="true"><span><i class="n"></i>A800, H800, H20</span><span><i class="m"></i>Sold as chips</span><span><i class="o"></i>Used in-house, or made in China</span><span><i class="c"></i>Controlled for China</span></div>';
  }

  /* Table and PNG, as figure() figures have them (build.js FIG_JS): Table shows the chips' rows in place of the chart, and
     PNG draws the chart as it stands, always on the light ground, 1,600 px wide, with its title, date line and source */
  function txt(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function wrap(g, s, w) { var out = [], line = ''; String(s).split(/\s+/).forEach(function (word) { var t = line ? line + ' ' + word : word; if (g.measureText(t).width > w && line) { out.push(line); line = word; } else line = t; }); if (line) out.push(line); return out; }
  // the light tokens, read from the site's own :root rule, so a reader in dark mode still saves the light picture
  function lightTokens() {
    var out = {};
    [].forEach.call(D.styleSheets, function (sh) { var rules; try { rules = sh.cssRules; } catch (e) { return; } [].forEach.call(rules || [], function (r) { if (r.selectorText === ':root' && r.style) for (var i = 0; i < r.style.length; i++) { var p = r.style[i]; if (p.indexOf('--') === 0 && !(p in out)) out[p] = r.style.getPropertyValue(p).trim(); } }); });
    return out;
  }
  function png() {
    var svg = plot.querySelector('svg'); if (!svg) return;
    var host = D.createElement('div'), tok = lightTokens();
    host.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + plot.clientWidth + 'px';
    Object.keys(tok).forEach(function (k) { host.style.setProperty(k, tok[k]); });
    var clone = svg.cloneNode(true); host.appendChild(clone); D.body.appendChild(host);
    // every element's painted style written on it, as it reads in the light theme, so the picture needs no sheet
    var PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight', 'paint-order', 'visibility', 'display'];
    var a = [clone].concat([].slice.call(clone.querySelectorAll('*'))), b = [svg].concat([].slice.call(svg.querySelectorAll('*')));
    a.forEach(function (el, i) { var cs = getComputedStyle(el), s = ''; PROPS.forEach(function (p) { var v = cs.getPropertyValue(p); if (v) s += p + ':' + v.replace(/url\("?[^#")]*#([^")]+)"?\)/, 'url(#$1)') + ';'; }); if (b[i] && b[i].style && b[i].style.transform) s += 'transform:' + b[i].style.transform + ';'; el.setAttribute('style', s); });
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    var data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    host.remove();
    var img = new Image();
    img.onload = function () {
      var W = 800, P = 40, S = 2, cv = D.createElement('canvas'), g = cv.getContext('2d');
      var FD = '"Fraunces",Georgia,serif', FB = '"Source Serif 4",Georgia,serif', FU = '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif', FM = '"Fragment Mono",Menlo,monospace';
      var t1 = txt(fig.querySelector('.fig-title')), t2 = txt(fig.querySelector('.fig-sub')), t3 = txt(when);
      g.font = '500 24px ' + FD; var L1 = wrap(g, t1, W - 2 * P); g.font = '400 16px ' + FB; var L2 = wrap(g, t2, W - 2 * P);
      var iw = W - 2 * P, ih = iw * img.height / img.width, srcT = 'Source: US export rules, October 2022 to January 2026, and each chip\'s record on AI Chips';
      var H = P + 18 + L1.length * 31 + 6 + L2.length * 21 + 24 + 22 + ih + 20 + 56;
      cv.width = W * S; cv.height = H * S; g.scale(S, S); g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      var y = P; g.textBaseline = 'alphabetic'; g.fillStyle = '#56554f'; g.font = '400 13px ' + FM; g.fillText('Export Controls', P, y + 12); y += 22;
      g.fillStyle = '#171716'; g.font = '500 24px ' + FD; L1.forEach(function (s) { y += 28; g.fillText(s, P, y); y += 3; });
      y += 6; g.fillStyle = '#45443f'; g.font = '400 16px ' + FB; L2.forEach(function (s) { y += 19; g.fillText(s, P, y); y += 2; });
      y += 24; g.fillStyle = '#171716'; g.font = '400 13.5px ' + FU; g.fillText(t3, P, y + 14); y += 22;
      g.drawImage(img, P, y, iw, ih); y += ih + 20;
      g.fillStyle = '#e1e0db'; g.fillRect(P, y, W - 2 * P, 1); y += 22;
      g.fillStyle = '#45443f'; g.font = '400 12.5px ' + FU; g.fillText(srcT, P, y);
      g.fillStyle = '#56554f'; g.font = '400 12px ' + FM; g.fillText('chipsupplychain.org/#/controls', P, y + 20);
      cv.toBlob(function (bl) { if (!bl) return; var l = D.createElement('a'); l.href = URL.createObjectURL(bl); l.download = 'chip-supply-chain-chips-under-the-line.png'; D.body.appendChild(l); l.click(); setTimeout(function () { URL.revokeObjectURL(l.href); l.remove(); }, 2000); }, 'image/png');
    };
    img.src = data;
  }
  function actions() {
    var acts = fig.querySelector('.fs-acts'); if (!acts || acts.getAttribute('data-ul')) return; acts.setAttribute('data-ul', '1'); // its own mark: FIG_JS marks every strip data-ready, and passes this kind by
    var table = fig.querySelector('table.fig-table'), cite = acts.querySelector('.ch-cite-btn');
    var tb = D.createElement('button'); tb.type = 'button'; tb.className = 'fs-tab'; tb.textContent = 'Table'; tb.setAttribute('aria-pressed', 'false');
    tb.addEventListener('click', function () { var on = !fig.classList.contains('is-table'); fig.classList.toggle('is-table', on); if (table) table.classList.toggle('sr-only', !on); tb.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    var pb = D.createElement('button'); pb.type = 'button'; pb.className = 'fs-png'; pb.textContent = 'PNG'; pb.setAttribute('aria-label', 'Save the figure as a PNG picture');
    pb.addEventListener('click', function () { if (D.fonts && D.fonts.ready) D.fonts.ready.then(png); else png(); });
    acts.insertBefore(tb, cite ? cite.nextSibling : acts.firstChild); acts.appendChild(pb);
  }

  function mount() {
    btns.forEach(function (b) { b.addEventListener('click', function () { state.m = ERAS[+b.getAttribute('data-era')].end; update(); }); });
    input.addEventListener('input', function () { state.m = +input.value; update(); });
    actions();
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(function () { var w = Math.round(plot.clientWidth); if (w && w !== state.W) draw(); }).observe(plot);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mount); else mount();
})();
