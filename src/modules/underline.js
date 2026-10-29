/* Chips built just under the line, first on Export Controls (build/modules/under-line.js writes the section and its data;
   rebuilt on 29 Oct 2026 as a ladder). Each row is one US move, drawn on one shared TPP scale: its lanes are the license
   status (needs a license, case by case, no license), its lines the TPP lines that move drew, row 1's arrows Nvidia's
   chip-to-chip cut and row 2's inset the H20 against the 2,400 line. Nothing needs a click. Pointing at, focusing or tapping
   a chip lights it in every row and opens its record beside it; ?chip=<id> opens on one. Table, CSV, PNG and Cite act as on
   any figure. Every number printed is the chip record's or the rule's own. */
(function () {
  'use strict';
  var D = document, sec = D.getElementById('controls-under-the-line'), src = D.getElementById('controls-ul-data');
  if (!sec || !src) return;
  var DATA; try { DATA = JSON.parse(src.textContent); } catch (e) { return; }
  var RULES = DATA.rules, LANE = DATA.lane, MAXT = 24000;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var byId = {}; DATA.chips.forEach(function (c) { byId[c.id] = c; });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fig = sec.querySelector('.figure'), body = fig.querySelector('.fig-body'), rec = sec.querySelector('.ul-rec');
  var tracks = [].slice.call(sec.querySelectorAll('.ul-track'));
  var state = { hot: null, pin: null, W: 0 }, ctx2d = null;
  function textW(s, font) { if (!ctx2d) ctx2d = D.createElement('canvas').getContext('2d'); ctx2d.font = font; return ctx2d.measureText(s).width; }

  function geom(W) {
    var wide = W >= 520, G = wide ? 104 : 60, LH = 44;
    var x0 = G + 6, x1 = W - 8;
    return { W: W, wide: wide, G: G, LH: LH, x0: x0, x1: x1, X: function (t) { return x0 + t / MAXT * (x1 - x0); } };
  }
  // one row's drawing: lanes, lines and their values, arrows, the chips and their labels, and the H20 inset
  function drawRow(track, r) {
    var W = Math.round(track.clientWidth); if (!W) return;
    var g = geom(W); if (!g.wide && (r.arrows || []).length) g.LH = 54; // room for a cut label on two lines between the lanes
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var n = r.lanes.length, top = 2, base = top + n * g.LH, H = base + 22 + (r.inset ? 58 : 0), o = [];
    var laneY = function (k) { return top + k * g.LH; }, laneOf = function (id) { return r.lanes.indexOf(r.at[id]); };
    var dotY = function (k) { return laneY(k) + g.LH / 2 + 2; };
    o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(r.date + ': ' + r.lanes.map(function (l) {
      var ids = Object.keys(r.at).filter(function (id) { return r.at[id] === l; }); return LANE[l] + ', ' + (ids.length ? ids.map(function (id) { return byId[id].name; }).join(', ') : 'none');
    }).join('. ')) + '">');
    o.push('<defs><pattern id="ul-hatch-' + r.id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="ul-hatch" x1="0" y1="0" x2="0" y2="6"></line></pattern></defs>');
    // the lanes and their names in the gutter
    r.lanes.forEach(function (l, k) {
      var y = laneY(k);
      if (l === 'lic') o.push('<rect class="ul-lane lic" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect>');
      if (l === 'case') o.push('<rect class="ul-lane lic" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect><rect class="ul-lane case" fill="url(#ul-hatch-' + r.id + ')" x="' + g.x0 + '" y="' + y + '" width="' + (g.x1 - g.x0) + '" height="' + g.LH + '"></rect>');
      if (k) o.push('<line class="ul-sep" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + y + '" y2="' + y + '"></line>');
      var words = LANE[l], lines = g.wide ? [words] : (words.indexOf(' ') > 0 ? [words.slice(0, words.lastIndexOf(' ')), words.slice(words.lastIndexOf(' ') + 1)] : [words]);
      o.push('<text class="ul-ln ' + l + '" x="' + (g.G - 4) + '" y="' + (y + g.LH / 2 + 4 - (lines.length - 1) * 6.5) + '" text-anchor="end">' + lines.map(function (s, i) { return '<tspan x="' + (g.G - 4) + '"' + (i ? ' dy="13"' : '') + '>' + esc(s) + '</tspan>'; }).join('') + '</text>');
    });
    o.push('<line class="ul-base" x1="' + g.x0 + '" x2="' + g.x1 + '" y1="' + base + '" y2="' + base + '"></line>');
    // the TPP lines, ending at the baseline, their values under it
    var tf = '600 12px ' + ui;
    r.lines.forEach(function (ln, i) {
      var x = g.X(ln[0]), w = textW(ln[1], tf), nb = r.lines[i + 1], pb = r.lines[i - 1], anchor = 'middle', tx = x;
      if (nb && g.X(nb[0]) - x < (w + textW(nb[1], tf)) / 2 + 6) { anchor = 'end'; tx = x + 3; }
      else if (pb && x - g.X(pb[0]) < (w + textW(pb[1], tf)) / 2 + 6) { anchor = 'start'; tx = x - 3; }
      o.push('<line class="ul-tl ' + ln[2] + '" x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + top + '" y2="' + (base + 4) + '"></line>');
      o.push('<text class="ul-tv ' + ln[2] + '" x="' + tx.toFixed(1) + '" y="' + (base + 17) + '" text-anchor="' + anchor + '">' + esc(ln[1]) + '</text>');
    });
    // the chips: one dot each in its lane; dots at one point share one label, the named first
    var ids = Object.keys(r.at), spots = [];
    ids.forEach(function (id) {
      var k = laneOf(id), x = g.X(byId[id].tpp), y = dotY(k), s = spots.filter(function (p) { return p.k === k && Math.abs(p.x - x) < 3; })[0];
      if (s) s.ids.push(id); else spots.push({ k: k, x: x, y: y, ids: [id] });
    });
    spots.forEach(function (s) { s.ids.sort(function (a, b) { return (byId[b].named ? 1 : 0) - (byId[a].named ? 1 : 0); }); });
    // arrows first, so the dots sit on them: from the parent's dot to its China version's, with the cut beside
    var placed = [];
    (r.arrows || []).forEach(function (a) {
      var p = byId[a[0]], c = byId[a[1]], x = g.X(p.tpp), y0 = dotY(laneOf(a[0])) + 8, y1 = dotY(laneOf(a[1])) - 9;
      o.push('<g class="ul-arrow" data-ids="' + a[0] + ' ' + a[1] + '"><line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + y0 + '" y2="' + y1 + '"></line>' +
        '<path d="M' + (x - 4).toFixed(1) + ',' + (y1 - 5) + ' L' + x.toFixed(1) + ',' + (y1 + 1) + ' L' + (x + 4).toFixed(1) + ',' + (y1 - 5) + '"></path></g>');
      var f = '500 11.5px ' + ui, w = textW(a[2], f), ty = (y0 + y1) / 2 + 4, clear = function (b) { return !placed.some(function (q) { return !(b[2] < q[0] || b[0] > q[2] || b[3] < q[1] || b[1] > q[3]); }); };
      if (x + 8 + w <= g.W + 6 && clear([x + 8, ty - 10, x + 8 + w, ty + 3])) { o.push('<text class="ul-cut" x="' + (x + 8).toFixed(1) + '" y="' + ty.toFixed(1) + '">' + esc(a[2]) + '</text>'); placed.push([x + 8, ty - 10, x + 8 + w, ty + 3]); }
      else if (x - 8 - w >= g.x0 && clear([x - 8 - w, ty - 10, x - 8, ty + 3])) { o.push('<text class="ul-cut" x="' + (x - 8 - w).toFixed(1) + '" y="' + ty.toFixed(1) + '">' + esc(a[2]) + '</text>'); placed.push([x - 8 - w, ty - 10, x - 8, ty + 3]); }
      else {
        var cut = a[2].indexOf(' or ') > 0 ? [a[2].slice(0, a[2].indexOf(' or ')), a[2].slice(a[2].indexOf(' or ') + 1)] : [a[2]], w2 = Math.max.apply(null, cut.map(function (s) { return textW(s, f); }));
        o.push('<text class="ul-cut" x="' + (x + 8).toFixed(1) + '" y="' + (ty - 6).toFixed(1) + '">' + cut.map(function (s, i) { return '<tspan x="' + (x + 8).toFixed(1) + '"' + (i ? ' dy="13"' : '') + '>' + esc(s) + '</tspan>'; }).join('') + '</text>');
        placed.push([x + 8, ty - 16, x + 8 + w2, ty + 10]);
      }
    });
    // labels: beside right, beside left, then above; each clear of the other dots and labels; a near line's chip gets its TPP
    var nearLine = function (id) { return r.lines.some(function (ln) { return ln[0] > byId[id].tpp && ln[0] - byId[id].tpp < 1000 && ln[0] >= 4800; }); };
    var dots = spots.map(function (s) { return [s.x - 6, s.y - 6, s.x + 6, s.y + 6]; }).concat(r.lines.map(function (ln) { var x = g.X(ln[0]); return [x - 1, top, x + 1, base]; }));
    var hit = function (b) { return placed.concat(dots).some(function (q) { return !(b[2] < q[0] || b[0] > q[2] || b[3] < q[1] || b[1] > q[3]); }); };
    var out = [];
    spots.slice().sort(function (a, b) { return b.x - a.x; }).forEach(function (s) {
      var names = s.ids.map(function (id) { return byId[id]; }), withTPP = names.length === 1 && nearLine(names[0].id) ? ' ' + names[0].tppT : '';
      var variants = withTPP ? [withTPP, ''] : [''];
      var done = null;
      variants.some(function (extra) {
        var parts = names.map(function (c, i) { return { t: (i ? ' · ' : '') + c.name, named: c.named }; });
        if (extra) parts.push({ t: extra, num: true });
        var w = parts.reduce(function (sum, p) { return sum + textW(p.t, (p.named ? '700 13px ' : '400 12px ') + ui); }, 0);
        var ay = s.y + 4, by = s.y - 13;
        var tries = [[s.x + 10, ay], [s.x - 10 - w, ay], [s.x - w - 3, by], [s.x - w / 2, by], [s.x + 3, by]];
        for (var k = 0; k < tries.length; k++) {
          var tx = tries[k][0], ty = tries[k][1], b = [tx - 1, ty - 11, tx + w + 1, ty + 3];
          if (tx < g.x0 - 2 || tx + w > g.W + 6 || hit(b)) continue;
          placed.push(b); done = { x: tx, y: ty, parts: parts }; return true;
        }
        return false;
      });
      if (!done) { var parts0 = names.map(function (c, i) { return { t: (i ? ' · ' : '') + c.name, named: c.named }; }); done = { x: s.x + 10, y: s.y + 4, parts: parts0 }; }
      out.push('<text class="ul-lab" x="' + done.x.toFixed(1) + '" y="' + done.y.toFixed(1) + '" data-ids="' + s.ids.join(' ') + '">' + done.parts.map(function (p) {
        return '<tspan class="' + (p.num ? 'num' : p.named ? 'nm' : 'ot') + '">' + esc(p.t) + '</tspan>'; }).join('') + '</text>');
    });
    spots.forEach(function (s) {
      s.ids.slice().reverse().forEach(function (id) {
        var c = byId[id];
        o.push('<g class="ul-dot' + (c.named ? ' named' : '') + '" data-id="' + id + '" transform="translate(' + s.x.toFixed(1) + ' ' + s.y.toFixed(1) + ')"><circle class="hit" r="12"></circle><circle class="ring" r="9.5"></circle><circle class="d" r="' + (c.named ? 5.5 : 4.5) + '"></circle></g>');
      });
    });
    o.push(out.join(''));
    // the inset: the H20 against the 2,400 line, on a scale from 2,300 to 2,500
    if (r.inset) {
      // set under the H20, so its leader runs straight down from the dot, broken where the line values sit
      var c = byId[r.inset], iw = Math.min(220, g.x1 - g.x0 - 10), hx = g.X(c.tpp), iy = base + 44;
      var ix0 = Math.max(4, Math.min(g.W - iw - 4, hx - (c.tpp - 2300) / 200 * iw)), ix = function (t) { return ix0 + (t - 2300) / 200 * iw; };
      o.push('<g class="ul-inset"><path class="lead" d="M' + ix(c.tpp).toFixed(1) + ',' + (base + 22) + ' L' + ix(c.tpp).toFixed(1) + ',' + (iy - 8) + '"></path>' +
        '<line class="axis" x1="' + ix0 + '" x2="' + (ix0 + iw) + '" y1="' + iy + '" y2="' + iy + '"></line>' +
        '<line class="ul-tl m" x1="' + ix(2400).toFixed(1) + '" x2="' + ix(2400).toFixed(1) + '" y1="' + (iy - 14) + '" y2="' + (iy + 4) + '"></line>' +
        '<text class="ul-tv" x="' + ix0 + '" y="' + (iy + 15) + '">2,300</text><text class="ul-tv" x="' + (ix0 + iw) + '" y="' + (iy + 15) + '" text-anchor="end">2,500</text>' +
        '<text class="ul-tv m" x="' + ix(2400).toFixed(1) + '" y="' + (iy + 15) + '" text-anchor="middle">2,400</text>' +
        '<g class="ul-dot named" data-id="' + c.id + '" transform="translate(' + ix(c.tpp).toFixed(1) + ' ' + iy + ')"><circle class="hit" r="12"></circle><circle class="ring" r="9.5"></circle><circle class="d" r="5.5"></circle></g>' +
        '<text class="ul-lab" data-ids="' + c.id + '" x="' + (ix(c.tpp) - 10).toFixed(1) + '" y="' + (iy - 9) + '" text-anchor="end"><tspan class="nm">' + esc(c.name) + '</tspan><tspan class="num"> ' + esc(c.tppT) + '</tspan></text></g>');
    }
    o.push('</svg>');
    track.innerHTML = o.join('');
  }
  function draw() {
    tracks.forEach(function (t, i) { drawRow(t, RULES[i]); });
    state.W = tracks[0] ? Math.round(tracks[0].clientWidth) : 0;
    // keyboard: one stop per chip, on the last row's dots, where every chip appears
    var last = tracks[tracks.length - 1];
    [].forEach.call(sec.querySelectorAll('.ul-dot'), function (el) {
      var mine = last && last.contains(el) && !el.closest('.ul-inset');
      el.setAttribute('tabindex', mine ? '0' : '-1');
      if (mine) { var c = byId[el.getAttribute('data-id')]; el.setAttribute('role', 'button'); el.setAttribute('aria-label', c.vendor + ' ' + c.full + ', TPP ' + c.tppT + '. Show its record'); }
      el.addEventListener('mouseenter', function () { if (!state.pin) show(el.getAttribute('data-id'), el); });
      el.addEventListener('mouseleave', function () { if (!state.pin) show(null); });
      el.addEventListener('focus', function () { show(el.getAttribute('data-id'), el); });
      el.addEventListener('blur', function () { if (!state.pin) show(null); });
      el.addEventListener('click', function (e) { e.stopPropagation(); var id = el.getAttribute('data-id'); state.pin = state.pin === id ? null : id; show(state.pin, el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); var id = el.getAttribute('data-id'); state.pin = state.pin === id ? null : id; show(state.pin || id, el); } });
    });
    if (state.pin) { var el0 = sec.querySelector('.ul-dot[data-id="' + state.pin + '"]'); if (el0) show(state.pin, el0); }
  }
  // a chip lit in every row, and its record beside the dot
  function show(id, el) {
    state.hot = id;
    sec.classList.toggle('is-hot', !!id);
    [].forEach.call(sec.querySelectorAll('.ul-dot, .ul-lab, .ul-arrow'), function (n) {
      var on = id && ((n.getAttribute('data-id') === id) || (' ' + (n.getAttribute('data-ids') || '') + ' ').indexOf(' ' + id + ' ') >= 0);
      n.classList.toggle('on', !!on);
    });
    if (!id) { rec.hidden = true; rec.innerHTML = ''; return; }
    var c = byId[id], a = String(c.announced).split('-'), ann = a[1] ? MONTHS[+a[1] - 1] + ' ' + a[0] : a[0];
    rec.innerHTML = '<p class="h">' + esc(c.vendor + ' ' + c.full) + '</p><dl><dt>TPP</dt><dd>' + esc(c.tppT) + '</dd><dt>Chip-to-chip</dt><dd>' + esc(c.c2cT) + '</dd><dt>Memory bandwidth</dt><dd>' + esc(c.bwT) + '</dd><dt>Announced</dt><dd>' + esc(ann) + '</dd></dl>' +
      '<a href="#/landscape?pick=' + encodeURIComponent(c.id) + '">Its record on AI Chips <span aria-hidden="true">→</span></a>';
    rec.hidden = false;
    // beside the dot, inside the figure; under it where the side has no room
    var m = body.getBoundingClientRect(), b = (el || sec.querySelector('.ul-dot[data-id="' + id + '"]')).getBoundingClientRect();
    var w = rec.offsetWidth, h = rec.offsetHeight, x = b.right - m.left + 10, y = b.top - m.top - 8;
    if (x + w > m.width) x = b.left - m.left - 10 - w;
    if (x < 0) { x = Math.max(0, Math.min(m.width - w, b.left - m.left - w / 2)); y = b.bottom - m.top + 8; }
    rec.style.left = Math.round(x) + 'px'; rec.style.top = Math.round(Math.max(0, y)) + 'px';
  }

  /* Table and PNG, as figure() figures have them (build.js FIG_JS): Table shows the chips' rows in place of the ladder, and
     PNG draws the ladder as it stands, always on the light ground, 800 px wide at 2x: title, subtitle, key, each row's date,
     rule, drawing and sentence, the axis, the sources and the address */
  function txt(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function wrap(g, s, w) { var out = [], line = ''; String(s).split(/\s+/).forEach(function (word) { var t = line ? line + ' ' + word : word; if (g.measureText(t).width > w && line) { out.push(line); line = word; } else line = t; }); if (line) out.push(line); return out; }
  function lightTokens() {
    var out = {};
    [].forEach.call(D.styleSheets, function (sh) { var rules; try { rules = sh.cssRules; } catch (e) { return; } [].forEach.call(rules || [], function (r) { if (r.selectorText === ':root' && r.style) for (var i = 0; i < r.style.length; i++) { var p = r.style[i]; if (p.indexOf('--') === 0 && !(p in out)) out[p] = r.style.getPropertyValue(p).trim(); } }); });
    return out;
  }
  function svgImage(svg, tok) {
    return new Promise(function (done) {
      var host = D.createElement('div'); host.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + svg.getAttribute('width') + 'px';
      Object.keys(tok).forEach(function (k) { host.style.setProperty(k, tok[k]); });
      host.className = 'ul'; var clone = svg.cloneNode(true); host.appendChild(clone); sec.appendChild(host);
      var PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight', 'paint-order', 'visibility', 'display'];
      [clone].concat([].slice.call(clone.querySelectorAll('*'))).forEach(function (el) { var cs = getComputedStyle(el), s = ''; PROPS.forEach(function (p) { var v = cs.getPropertyValue(p); if (v) s += p + ':' + v.replace(/url\("?[^#")]*#([^")]+)"?\)/, 'url(#$1)') + ';'; }); el.setAttribute('style', s); });
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      var data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
      host.remove();
      var img = new Image(); img.onload = function () { done(img); }; img.onerror = function () { done(null); }; img.src = data;
    });
  }
  function png() {
    var was = state.pin; state.pin = null; show(null);
    var tok = lightTokens(), svgs = tracks.map(function (t) { return t.querySelector('svg'); });
    Promise.all(svgs.map(function (s) { return s ? svgImage(s, tok) : Promise.resolve(null); })).then(function (imgs) {
      var W = 800, P = 40, S = 2, cv = D.createElement('canvas'), g = cv.getContext('2d'), iw = W - 2 * P;
      var FD = '"Fraunces",Georgia,serif', FB = '"Source Serif 4",Georgia,serif', FU = '"Hanken Grotesk","Helvetica Neue",Arial,sans-serif', FM = '"Fragment Mono",Menlo,monospace';
      var t1 = txt(fig.querySelector('.fig-title')), t2 = txt(fig.querySelector('.fig-sub'));
      var srcT = 'Source: ' + [].map.call(fig.querySelectorAll('.fs-src a'), function (a) { return txt(a); }).filter(function (s) { return s !== 'AI Chips'; }).join(', ') + ', and each chip\'s record on AI Chips';
      var keyT = 'Wine: A800, H800, H20. Tinted lane: needs a US license to ship to China. Hatched: license reviewed case by case.';
      g.font = '500 24px ' + FD; var L1 = wrap(g, t1, iw); g.font = '400 16px ' + FB; var L2 = wrap(g, t2, iw);
      g.font = '400 13px ' + FU; var LK = wrap(g, keyT, iw), LS = wrap(g, srcT, iw);
      var rowsT = RULES.map(function (r, i) {
        g.font = '600 14px ' + FU; var hd = wrap(g, r.date + ' (' + r.kind + '). ' + r.head, iw); g.font = '400 14px ' + FB; var nt = wrap(g, r.note, iw);
        var im = imgs[i], ih = im ? iw * im.height / im.width : 0; return { hd: hd, nt: nt, im: im, ih: ih };
      });
      var H = P + 22 + L1.length * 31 + 6 + L2.length * 21 + 14 + LK.length * 18 + 10;
      rowsT.forEach(function (r) { H += 14 + r.hd.length * 19 + 6 + r.ih + 6 + r.nt.length * 20 + 6; });
      H += 24 + 18 + LS.length * 17 + 30 + P / 2;
      cv.width = W * S; cv.height = H * S; g.scale(S, S); g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      var y = P; g.textBaseline = 'alphabetic'; g.fillStyle = '#56554f'; g.font = '400 13px ' + FM; g.fillText('Export Controls', P, y + 12); y += 22;
      g.fillStyle = '#171716'; g.font = '500 24px ' + FD; L1.forEach(function (s) { y += 28; g.fillText(s, P, y); y += 3; });
      y += 6; g.fillStyle = '#45443f'; g.font = '400 16px ' + FB; L2.forEach(function (s) { y += 19; g.fillText(s, P, y); y += 2; });
      y += 14; g.font = '400 13px ' + FU; LK.forEach(function (s) { y += 15; g.fillText(s, P, y); y += 3; }); y += 10;
      rowsT.forEach(function (r) {
        y += 14; g.fillStyle = '#171716'; g.font = '600 14px ' + FU; r.hd.forEach(function (s) { y += 16; g.fillText(s, P, y); y += 3; });
        y += 6; if (r.im) g.drawImage(r.im, P, y, iw, r.ih); y += r.ih + 6;
        g.fillStyle = '#171716'; g.font = '400 14px ' + FB; r.nt.forEach(function (s) { y += 17; g.fillText(s, P, y); y += 3; }); y += 6;
      });
      y += 6; g.fillStyle = '#45443f'; g.font = '400 12.5px ' + FU; g.textAlign = 'right'; g.fillText('Total processing performance (TPP) →', W - P, y + 12); g.textAlign = 'left'; y += 24;
      g.fillStyle = '#e1e0db'; g.fillRect(P, y, iw, 1); y += 18;
      g.fillStyle = '#45443f'; g.font = '400 12.5px ' + FU; LS.forEach(function (s) { y += 14; g.fillText(s, P, y); y += 3; });
      g.fillStyle = '#56554f'; g.font = '400 12px ' + FM; g.fillText('chipsupplychain.org/#/controls', P, y + 20);
      cv.toBlob(function (bl) { if (!bl) return; var l = D.createElement('a'); l.href = URL.createObjectURL(bl); l.download = 'chip-supply-chain-chips-under-the-line.png'; D.body.appendChild(l); l.click(); setTimeout(function () { URL.revokeObjectURL(l.href); l.remove(); }, 2000); }, 'image/png');
      if (was) { state.pin = was; show(was); }
    });
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
  // ?chip=<id>, in the query or after the hash's route
  function askedChip() {
    var m = /[?&]chip=([a-z0-9-]+)/.exec(location.search + '&' + (location.hash.split('?')[1] || ''));
    return m && byId[m[1]] ? m[1] : null;
  }

  function mount() {
    actions();
    state.pin = askedChip();
    draw();
    D.addEventListener('click', function (e) { if (state.pin && !rec.contains(e.target)) { state.pin = null; show(null); } });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.hot) { state.pin = null; show(null); } });
    // redrawn when the column's width changes on screen; on paper the screen's drawing is scaled to the page, as it stands
    var paper = window.matchMedia ? matchMedia('print') : { matches: false };
    if ('ResizeObserver' in window && tracks[0]) new ResizeObserver(function () { var w = Math.round(tracks[0].clientWidth); if (w && w !== state.W && !paper.matches) draw(); }).observe(tracks[0]);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', mount); else mount();
})();
