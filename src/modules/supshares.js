/* The Suppliers ribbons, by share (build/modules/supplier-shares.js writes the section and its data; the owner's approved
   mockup 6 of 29 Oct 2026, third round). Which countries hold each of the matrix's twenty segments, from
   data/chokepoint-matrix.json.

   600 px and wider: a ribbon drawing. Countries on the left, the segments on the right in chain order. Each segment is one
   whole, drawn at one height, and where a ribbon meets a segment its width is that country's share. At the country end every
   ribbon narrows to a point, so no country is drawn with a size and no sum of shares is ever drawn. The countries are evenly
   spaced and ordered to cross as little as possible (ORDER). Each segment's slices are stacked largest first, with the two
   catch-all columns last (row.order), and the firms under its name follow the same order, so names and slices match.
   Narrower than 600 px: one row per segment, the name, a full-width strip of its shares and its firms.

   Gray throughout until the reader follows a country: its ribbons or slices turn wine, its share is printed at every segment
   it reaches, its firms go to ink and the Table sets its shares in bold. Hovering or focusing a segment prints each
   country's share at the left. Segments with no country split show only their name and firms. Every share is printed as the
   matrix writes it (row.sharesT). Year and measure appear only where a row is not 2025 revenue. The route's chosen country
   (src/modules/summary-a.js, through Suppliers.light) follows its column, where it has one. */
(function () {
  'use strict';
  var D = document, sec = D.getElementById('sup-pipe'), data = D.getElementById('sup-shares-data');
  if (!sec || !data || !sec.classList.contains('ss')) return;
  var ROWS; try { ROWS = JSON.parse(data.textContent); } catch (e) { return; }
  var COLS = ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE', 'GB', 'IL', 'EU-other', 'Other'];
  var NAME = { US: 'United States', JP: 'Japan', CN: 'China', TW: 'Taiwan', KR: 'South Korea', NL: 'Netherlands', DE: 'Germany', GB: 'United Kingdom', IL: 'Israel', 'EU-other': 'Other EU', Other: 'Other' };
  var OWN = { US: 'The United States’', JP: 'Japan’s', CN: 'China’s', TW: 'Taiwan’s', KR: 'South Korea’s', NL: 'The Netherlands’', DE: 'Germany’s', GB: 'The United Kingdom’s', IL: 'Israel’s', 'EU-other': 'Other EU countries’', Other: 'Other countries’' };
  // the phone strip's labels: a country's code, and UK for the United Kingdom, as readers know it (owner, 29 Oct 2026)
  var CODE = { US: 'US', JP: 'JP', CN: 'CN', TW: 'TW', KR: 'KR', NL: 'NL', DE: 'DE', GB: 'UK', IL: 'IL', 'EU-other': 'Other EU', Other: 'Other' };
  var cname = function (cc) { return window.CP && CP.cname ? CP.cname(cc) : cc; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var share = function (r, c) { return r.sharesT[c] + '%'; }; // as the matrix writes it: 6.0 stays 6.0
  var lower = function (s) { return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
  var capacity = function (r) { return /site location/.test(r.metric || ''); };
  // the mark after a segment's name, only where the row is not 2025 revenue (the key says so once)
  var mark = function (r) { return r.shares ? [capacity(r) ? 'capacity' : '', r.year !== 2025 ? String(r.year) : ''].filter(Boolean).join(', ') : ''; };
  var whenT = function (r) { return (capacity(r) ? 'Share of plant capacity, by plant location' : r.metric) + ', ' + r.year + (/estimate|derived/.test(r.basis || '') ? ', ' + r.basisT : ''); };
  var srcT = function (r) { return r.srcShort + (r.via ? ' (' + r.via + ')' : ''); };
  var sharesT = function (r) { return r.order.map(function (c) { return NAME[c] + ' ' + share(r, c); }).join(', '); };
  var state = { lit: '', W: 0, phone: false, room: 0, font: '', hotSeg: -1, rib: null, geo: null };
  var host = sec.querySelector('.ss-draw'), tip = sec.querySelector('.ss-tip'), chipsEl = sec.querySelector('.ss-chips'), tableBox = sec.querySelector('.ss-tablebox'), plot = sec.querySelector('.ss-plot'), ctx;
  var paper = window.matchMedia ? matchMedia('print') : { matches: false };

  /* ---- the countries' order down the left: the one with the least crossing, each crossing weighted by the two ribbons'
     shares. Where a ribbon meets its segment does not depend on the order, so the cost of putting a above b is fixed and an
     exact search over the 2^11 subsets is quick. */
  var ORDER = (function () {
    var at = {}; // a ribbon's middle where it meets its segment, in share points down the right-hand column
    ROWS.forEach(function (r, i) { var y = i * 113; (r.order || []).forEach(function (c) { var v = r.shares[c]; at[c + i] = y + v / 2; y += v; }); });
    var rib = {}; COLS.forEach(function (c) { rib[c] = []; });
    ROWS.forEach(function (r, i) { (r.order || []).forEach(function (c) { rib[c].push([at[c + i], r.shares[c]]); }); });
    var n = COLS.length, cost = [];
    for (var a = 0; a < n; a++) {
      cost.push([]);
      for (var b = 0; b < n; b++) { var s = 0; rib[COLS[a]].forEach(function (p) { rib[COLS[b]].forEach(function (q) { if (p[0] > q[0]) s += p[1] * q[1]; }); }); cost[a].push(s); }
    }
    var full = (1 << n) - 1, best = [], from = [];
    for (var z = 0; z <= full; z++) { best.push(Infinity); from.push(-1); }
    best[0] = 0;
    for (var m = 0; m < full; m++) {
      if (best[m] === Infinity) continue;
      for (var k = 0; k < n; k++) {
        if (m & (1 << k)) continue;
        var add = 0;
        for (var j = 0; j < n; j++) if (m & (1 << j)) add += cost[j][k]; // j above k
        var m2 = m | (1 << k); if (best[m] + add < best[m2]) { best[m2] = best[m] + add; from[m2] = k; }
      }
    }
    var out = [], mm = full; while (mm) { var k2 = from[mm]; out.unshift(COLS[k2]); mm &= ~(1 << k2); }
    return out;
  })();

  /* ---- the firms under a segment: the followed country's first, then the segment's own order, at most three, and on a
     wide screen only as many as fit the label column */
  function width(s, font) { if (!ctx) ctx = D.createElement('canvas').getContext('2d'); ctx.font = font || state.font; return ctx.measureText(s).width; }
  function lineFirms(r) {
    var lit = state.lit, list = r.firms;
    if (lit) list = list.filter(function (f) { return f.col === lit; }).concat(list.filter(function (f) { return f.col !== lit; }));
    var out = [], w = 0, sep = width(' · ');
    for (var k = 0; k < list.length && out.length < 3; k++) {
      var fw = width(list[k].s) + (out.length ? sep : 0);
      if (out.length && w + fw > state.room) break;
      out.push(list[k]); w += fw;
    }
    return out;
  }
  function namesHTML(r, tag) {
    return lineFirms(r).map(function (f, k) {
      return (k ? '<' + tag + ' class="ss-fsep"> · </' + tag + '>' : '') + '<' + tag + ' class="ss-fn' + (state.lit ? (f.col === state.lit ? ' on' : ' off') : '') + '">' + esc(f.s) + '</' + tag + '>';
    }).join('');
  }
  function aria(r) {
    var f = r.firms.slice(0, 3).map(function (x) { return x.s; }).join(', ');
    return r.name + '. ' + (r.shares ? sharesT(r) + '. ' : '') + (f ? 'Firms: ' + f + '. ' : '') + (r.shares ? whenT(r) + ', ' + srcT(r) + '.' : '');
  }

  function draw() {
    var W = Math.round(host.clientWidth); if (!W) return;
    state.W = W; state.phone = W < 600;
    clearHot();
    if (state.phone) drawRows(); else drawRibbons(W);
    paintLit();
  }

  /* ---- 600 px and wider: the ribbons ---- */
  function drawRibbons(W) {
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var n = ROWS.length, segH = 30, gR = 4, padT = 10, inner = n * segH + (n - 1) * gR, H = inner + padT * 2, u = segH / 100;
    var fsL = W < 1000 ? 12.5 : 13.5, fsR = 12.5;
    var labW = Math.max.apply(null, COLS.map(function (c) { return width(NAME[c], '500 ' + fsL + 'px ' + ui); }));
    var x0 = Math.ceil(labW) + 18, x1 = W - 300, wR = 10, xl = x1 + wR + 8;
    state.font = '400 12px ' + ui; state.room = W - xl - 4;
    // the country ends: a point each, evenly spaced
    var step = inner / ORDER.length, left = {};
    ORDER.forEach(function (c, k) { left[c] = { x: x0 + 4, mid: padT + (k + 0.5) * step }; });
    // the right ends: each segment's slices stacked in its own order, largest first
    var ends = [];
    ROWS.forEach(function (r, i) {
      var y = padT + i * (segH + gR); ends.push({});
      (r.order || []).forEach(function (c) { var v = r.shares[c] * u; ends[i][c] = [y, y + v]; y += v; });
    });
    // a ribbon: from its country's point to its slice of the segment
    var ribs = '', xa = x0 + 4, mx = (xa + x1) / 2;
    ORDER.forEach(function (c) {
      var a = left[c].mid.toFixed(2);
      ROWS.forEach(function (r, i) {
        var b = ends[i][c]; if (!b) return;
        ribs += '<path class="sup-band sup-rib" data-c="' + c + '" data-i="' + i + '" d="M' + xa + ',' + a +
          ' C' + mx.toFixed(1) + ',' + a + ' ' + mx.toFixed(1) + ',' + b[0].toFixed(2) + ' ' + x1 + ',' + b[0].toFixed(2) +
          ' L' + x1 + ',' + b[1].toFixed(2) + ' C' + mx.toFixed(1) + ',' + b[1].toFixed(2) + ' ' + mx.toFixed(1) + ',' + a + ' ' + xa + ',' + a + 'Z"></path>';
      });
    });
    var nodesL = '', labL = '';
    ORDER.forEach(function (c) {
      var L = left[c];
      nodesL += '<circle class="sup-cnode" cx="' + L.x + '" cy="' + L.mid.toFixed(1) + '" r="3.5"></circle>';
      labL += '<text class="sup-clab ss-clab" data-c="' + c + '" x="' + (x0 - 8) + '" y="' + (L.mid + 4.5).toFixed(1) + '" font-size="' + fsL + '">' + esc(NAME[c]) + '</text>';
    });
    var nodesR = '', labR = '', hits = '';
    ROWS.forEach(function (r, i) {
      var y = padT + i * (segH + gR), m = mark(r);
      if (r.shares) nodesR += '<rect class="sup-snode" x="' + x1 + '" y="' + y.toFixed(1) + '" width="' + wR + '" height="' + segH + '"></rect>';
      labR += '<g class="sup-lab" data-i="' + i + '"><text class="sup-lab-t" x="' + xl + '" y="' + (y + 12).toFixed(1) + '" font-size="' + fsR + '">' + esc(r.name) +
        (m ? '<tspan class="ss-mk"> · ' + esc(m) + '</tspan>' : '') + '</text>' +
        '<text class="ss-names" data-i="' + i + '" x="' + xl + '" y="' + (y + 26).toFixed(1) + '" font-size="12"></text></g>';
      hits += '<rect class="sup-hit ss-hit" data-i="' + i + '" x="' + (x1 - 4) + '" y="' + y.toFixed(1) + '" width="' + (W - x1 + 4) + '" height="' + segH + '" tabindex="0" role="button" aria-describedby="sup-ss-hint" aria-label="' + esc(aria(r)) + '"></rect>';
    });
    state.geo = { left: left, ends: ends, x1: x1 };
    host.innerHTML = '<svg class="sup-pipe-svg ss-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Countries to segments. Where a ribbon meets a segment, its width is that country’s share.">' +
      '<g class="sup-flow">' + ribs + nodesL + nodesR + '<g class="sup-labels">' + labR + '</g></g><g pointer-events="none">' + labL + '<g class="ss-endv"></g><g class="ss-hotv"></g></g><g class="ss-hits">' + hits + '</g></svg>';
    wire(host.querySelector('svg'));
  }
  // the followed country's share at every segment it reaches
  function paintEnds() {
    var g = host.querySelector('.ss-endv'); if (!g) return;
    var c = state.lit, G = state.geo;
    g.innerHTML = c ? ROWS.map(function (r, i) { var e = G.ends[i][c]; return e ? '<text class="ss-v ss-v-lit" x="' + (G.x1 - 6) + '" y="' + ((e[0] + e[1]) / 2 + 4).toFixed(1) + '" text-anchor="end">' + share(r, c) + '</text>' : ''; }).join('') : '';
  }
  // a segment hovered or focused: each country's share beside it at the left
  function paintHot() {
    var g = host.querySelector('.ss-hotv'); if (!g) return;
    var i = state.hotSeg, G = state.geo, r = ROWS[i];
    g.innerHTML = i >= 0 && r.shares ? r.order.map(function (c) { var L = G.left[c]; return '<text class="ss-v" x="' + (L.x + 9) + '" y="' + (L.mid + 4).toFixed(1) + '">' + share(r, c) + '</text>'; }).join('') : '';
  }

  /* ---- the drawing's tips, by pointer, touch and keyboard ---- */
  function wire(svg) {
    svg.addEventListener('mouseover', function (e) { pick(e, false); });
    svg.addEventListener('click', function (e) { if (!pick(e, true)) clearHot(); });
    svg.addEventListener('mouseleave', function () { setTimeout(function () { if (!tip.matches(':hover') && !svg.contains(D.activeElement)) clearHot(); }, 240); });
    svg.addEventListener('focusin', function (e) { var h = e.target.closest('.ss-hit'); if (h) showSeg(+h.getAttribute('data-i'), h); });
    svg.addEventListener('focusout', function (e) { if (!svg.contains(e.relatedTarget)) clearHot(); });
    svg.addEventListener('keydown', function (e) {
      var h = e.target.closest('.ss-hit'); if (!h) return;
      var i = +h.getAttribute('data-i'), r = ROWS[i], k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft') {
        if (!r.shares) return;
        e.preventDefault();
        var at = state.rib && state.rib.i === i ? r.order.indexOf(state.rib.c) : -1, len = r.order.length;
        at = k === 'ArrowRight' ? (at + 1) % len : (at <= 0 ? len - 1 : at - 1);
        showRib(r.order[at], i, null);
      } else if (k === 'ArrowDown' || k === 'ArrowUp') {
        var t = svg.querySelector('.ss-hit[data-i="' + (i + (k === 'ArrowDown' ? 1 : -1)) + '"]');
        if (t) { e.preventDefault(); t.focus(); }
      } else if (k === 'Enter' || k === ' ') { e.preventDefault(); showSeg(i, h); }
    });
  }
  function pick(e, tap) {
    var rib = e.target.closest('.sup-rib'), h = e.target.closest('.ss-hit');
    if (rib) { showRib(rib.getAttribute('data-c'), +rib.getAttribute('data-i'), e); return true; }
    if (h) { if (tap || state.hotSeg !== +h.getAttribute('data-i') || state.rib) showSeg(+h.getAttribute('data-i'), h); return true; }
    return false;
  }
  function hot(fn) {
    var svg = host.querySelector('svg'); if (!svg) return;
    svg.setAttribute('data-hot', fn ? '1' : '0');
    [].forEach.call(svg.querySelectorAll('.sup-rib'), function (p) { if (fn && fn(p)) p.setAttribute('data-hot', '1'); else p.removeAttribute('data-hot'); });
  }
  function showSeg(i, anchor) {
    var r = ROWS[i]; state.hotSeg = i; state.rib = null;
    hot(function (p) { return +p.getAttribute('data-i') === i; }); paintHot();
    var f = r.firms.map(function (x) { return esc(x.s); });
    tip.innerHTML = '<b>' + esc(r.name) + '</b>' + (r.shares ? '<span class="sup-tip-n">' + esc(whenT(r)) + '</span>' + srcHTML(r)
      : '<span class="ss-tip-firms"><span class="k">Firms on the list</span>' + f.join(', ') + '</span>');
    // in the label column, under the segment (over it near the foot), so it hides neither the segment's ribbons nor the
    // shares printed at the left
    var m = plot.getBoundingClientRect(), b = anchor.getBoundingClientRect();
    tip.style.maxWidth = Math.round(b.width) + 'px'; tip.hidden = false;
    var top = b.bottom - m.top + 6;
    if (top + tip.offsetHeight > m.height) top = b.top - m.top - tip.offsetHeight - 6;
    tip.style.left = Math.round(Math.min(b.left - m.left, m.width - tip.offsetWidth)) + 'px'; tip.style.top = Math.round(top) + 'px';
  }
  function showRib(c, i, ev) {
    var r = ROWS[i]; state.hotSeg = -1; state.rib = { c: c, i: i };
    var svg = host.querySelector('svg'), el = svg.querySelector('.sup-rib[data-c="' + c + '"][data-i="' + i + '"]');
    hot(function (p) { return p === el; }); paintHot();
    var firms = r.firms.filter(function (f) { return f.col === c; }).map(function (f) { return esc(f.s) + (c === 'Other' || c === 'EU-other' ? ' (' + esc(cname(f.cc)) + ')' : ''); });
    tip.innerHTML = '<b>' + esc(OWN[c]) + ' share of ' + esc(lower(r.name)) + '</b><span class="sup-tip-n">' + esc(whenT(r)) + '</span>' +
      '<span class="ss-tip-big">' + share(r, c) + '</span>' +
      (firms.length ? '<span class="ss-tip-firms"><span class="k">' + (capacity(r) ? 'Firms on the list based here' : 'Firms on the list') + '</span>' + firms.join(', ') + '</span>' : '') + srcHTML(r);
    if (ev) place(ev, el);
    else { var G = state.geo, e = G.ends[i][c], b = svg.getBoundingClientRect(); place({ clientX: b.left + G.x1 - 70, clientY: b.top + (e[0] + e[1]) / 2 }, el); }
  }
  function clearHot() {
    state.hotSeg = -1; state.rib = null;
    if (tip) tip.hidden = true;
    if (host) { hot(null); paintHot(); }
  }
  function place(ev, anchor) {
    var m = plot.getBoundingClientRect(), r = anchor.getBoundingClientRect();
    tip.style.maxWidth = ''; tip.hidden = false;
    var cx = ev && ev.clientX != null ? ev.clientX : (r.left + r.right) / 2, cy = ev && ev.clientY != null ? ev.clientY : r.top;
    var left = Math.max(0, Math.min(cx - m.left - tip.offsetWidth / 2, m.width - tip.offsetWidth)), top = cy - m.top - tip.offsetHeight - 14;
    if (top < 0) top = cy - m.top + 18;
    tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top) + 'px';
  }
  function srcHTML(r) {
    return '<span class="ss-tip-src">Source: <a href="' + esc(r.src) + '" target="_blank" rel="noopener">' + esc(r.srcTitle) + '</a>' + (r.via ? ', with ' + esc(r.via) + ' data' : '') + '.</span>';
  }

  /* ---- narrower than 600 px: one row per segment, its shares as a full-width strip ---- */
  function drawRows() {
    var ui = getComputedStyle(D.documentElement).getPropertyValue('--font-ui').trim() || 'sans-serif';
    var sw = Math.round(host.clientWidth), f = '600 11.5px ' + ui;
    state.font = '400 11.5px ' + ui; state.room = Infinity; state.geo = null;
    host.innerHTML = '<ol class="ss-rows">' + ROWS.map(function (r, i) {
      var m = mark(r), strip = '', rest = [];
      if (r.shares) {
        strip = '<div class="ss-strip" aria-hidden="true">' + r.order.map(function (c) {
          var v = r.shares[c], t = CODE[c] + ' ' + share(r, c), fits = width(t, f) + 10 <= sw * v / 100;
          if (!fits) rest.push(c);
          return '<span class="ss-sl" data-c="' + c + '" style="width:' + v + '%">' + (fits ? '<b>' + esc(t) + '</b>' : '') + '</span>';
        }).join('') + '</div>';
      }
      return '<li class="ss-row"><p class="ss-row-h">' + esc(r.name) + (m ? ' <span class="ss-mk">· ' + esc(m) + '</span>' : '') + '</p>' + strip +
        (r.shares ? '<p class="ss-sr sr-only">' + esc(sharesT(r)) + '</p>' : '') +
        (rest.length ? '<p class="ss-rest" aria-hidden="true">' + rest.map(function (c) { return '<span data-c="' + c + '">' + esc(NAME[c]) + ' ' + share(r, c) + '</span>'; }).join(' · ') + '</p>' : '') +
        '<p class="ss-row-f" data-i="' + i + '"></p></li>';
    }).join('') + '</ol>';
  }

  /* ---- the country followed: its ribbons or slices in wine, its shares printed, its firms in ink, its Table shares bold ---- */
  function paintLit() {
    var c = state.lit;
    sec.setAttribute('data-lit', c ? '1' : '0');
    [].forEach.call(sec.querySelectorAll('.sup-rib, .ss-sl, .ss-rest span, .ss-tc'), function (p) { if (c && p.getAttribute('data-c') === c) p.setAttribute('data-lit', '1'); else p.removeAttribute('data-lit'); });
    [].forEach.call(sec.querySelectorAll('.ss-clab'), function (t) { t.classList.toggle('on', t.getAttribute('data-c') === c); });
    [].forEach.call(sec.querySelectorAll('.ss-names'), function (t) { t.innerHTML = namesHTML(ROWS[+t.getAttribute('data-i')], 'tspan'); });
    [].forEach.call(sec.querySelectorAll('.ss-row-f'), function (t) { t.innerHTML = namesHTML(ROWS[+t.getAttribute('data-i')], 'span'); });
    [].forEach.call(chipsEl.querySelectorAll('.sup-chip'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === c ? 'true' : 'false'); });
    if (state.geo) paintEnds();
  }
  function follow(c) { state.lit = c && COLS.indexOf(c) >= 0 ? c : ''; paintLit(); }

  chipsEl.addEventListener('click', function (e) { var b = e.target.closest('.sup-chip'); if (!b) return; var c = b.getAttribute('data-c'); follow(state.lit === c ? '' : c); });
  var tb = sec.querySelector('.ss-tab');
  tb.addEventListener('click', function () { var on = tableBox.hidden; tableBox.hidden = !on; host.hidden = on; clearHot(); tb.setAttribute('aria-pressed', on ? 'true' : 'false'); if (!on) draw(); });
  tip.addEventListener('mouseleave', function () { if (!host.querySelector('svg:hover')) clearHot(); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !tip.hidden) clearHot(); });
  D.addEventListener('click', function (e) { if (!tip.hidden && !e.target.closest('.ss-plot')) clearHot(); });
  window.addEventListener('beforeprint', clearHot);
  // the route's chosen country (Suppliers.light) follows its column; a country with no column of its own follows nothing
  window.CP_SUPSHARES = { follow: follow, column: function (cc) { return COLS.indexOf(cc) >= 0 && cc !== 'EU-other' && cc !== 'Other' ? cc : ''; } };
  draw();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { draw(); }); // the names are measured in the page's own face
  // drawn when the view opens (a hidden view has no width) and again when the column's width changes, never for paper
  if ('ResizeObserver' in window) new ResizeObserver(function () { var w = Math.round(host.clientWidth); if (w && w !== state.W && !paper.matches) draw(); }).observe(host);
})();
