/* Figure 10.3, "How big a package gets, counted in reticle fields" (the owner's "Build it" of 20 Nov 2026 on the explorables
   mockup reticle-fields, as the designer refined it). build/build.js and build/explore.js write the figure's shell from
   content/10: every step as page text (.xp-list: its numbers in data-x, its sentence and its sources) and the Table. This
   module draws into the stage, .xp-stage[data-live="reticle"]:
   - on screen (.lv-screen), a 300 mm wafer drawn to scale with the faint grid of 26 x 33 mm exposure fields, the step's number,
     sentence and source beside it, and a stepped slider with previous and next under it. Squares fill outward from the center
     in a fixed order, so each step keeps the squares of the step before it; only the squares a step adds are wine, counted from
     the step before it in the list, so ?step=N draws what clicking through to N draws. A part field fills from the side that
     faces the center. The H100 step draws the die at its area, in the proportions of a field, inside one field's outline;
   - for paper and the PDF (.xp-still), the step the figure's "print" names, whatever the reader last chose (live.css swaps them).
   Under reduced motion the squares and the words change at once. ?step=1 to 8 opens on that step. */
(function () {
  'use strict';
  var W = 26, H = 33, R = 150, NS = 'http://www.w3.org/2000/svg';
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var el = function (n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; };
  var h = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // the fields that sit wholly on the wafer, in the order they fill: rings outward from the center field; a ring that adds
  // columns fills the left column then the right, one that adds rows fills the row above then the row below, each from its
  // middle out, so every step stays a compact block
  var CELLS = (function () {
    var cells = [];
    for (var j = -5; j <= 5; j++) for (var i = -6; i <= 6; i++) {
      var cx = i * W, cy = j * H, ok = true;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { if (Math.hypot(cx + c[0] * W / 2, cy + c[1] * H / 2) > R - 3) ok = false; });
      if (ok) cells.push({ i: i, j: j, m: Math.max(Math.abs(i) * W, Math.abs(j) * H), col: Math.abs(i) * W >= Math.abs(j) * H && i !== 0 });
    }
    cells.sort(function (p, q) {
      if (p.m !== q.m) return p.m - q.m;
      if (p.col !== q.col) return p.col ? -1 : 1;
      if (p.col) return (p.i - q.i) || (Math.abs(p.j) - Math.abs(q.j)) || (p.j - q.j);
      return (p.j - q.j) || (Math.abs(p.i) - Math.abs(q.i)) || (p.i - q.i);
    });
    return cells;
  })();
  function rectFor(c, frac) {
    var x = c.i * W - W / 2, y = c.j * H - H / 2, w = W, hh = H;
    if (frac < 1) {   // a part field fills from the side that faces the center
      if (Math.abs(c.j) * H >= Math.abs(c.i) * W && c.j !== 0) { hh = H * frac; if (c.j < 0) y = y + H - hh; }
      else { w = W * frac; if (c.i < 0) x = x + W - w; }
    }
    return { x: +x.toFixed(3), y: +y.toFixed(3), width: +w.toFixed(3), height: +hh.toFixed(3) };
  }
  // the squares a step draws: { full, frac, n, before } (before: the whole fields the step before it had, which stay neutral)
  function count(S, k) {
    var s = S[k], full = Math.floor(s.v + 1e-9), frac = Math.round((s.v - full) * 100) / 100;
    return { full: full, frac: frac, n: full + (frac > 0 ? 1 : 0), before: k > 0 ? Math.floor(S[k - 1].v + 1e-9) : 0 };
  }

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    var S = Array.prototype.map.call(fig.querySelectorAll('.xp-list > li'), function (li) {
      var o = {}; try { o = JSON.parse(li.getAttribute('data-x') || '{}'); } catch (e) { }
      var cap = li.querySelector('.xp-li-cap');
      o.cap = cap ? cap.textContent : '';
      o.src = Array.prototype.map.call(li.querySelectorAll('.xp-li-src a'), function (a) { return { label: a.textContent, url: a.getAttribute('href') }; });
      return o;
    }).filter(function (o) { return o.v > 0; });
    if (!S.length) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-reticle');
    var uid = fig.id || 'xr', P = Math.max(1, Math.min(S.length, +stage.getAttribute('data-print') || S.length)) - 1;

    function panel(live) {
      var id = uid + (live ? '-l' : '-p');
      var p = h('div', 'xr-panel ' + (live ? 'lv-screen' : 'xp-still'));
      if (!live) p.setAttribute('aria-hidden', 'true');
      p.innerHTML =
        '<div class="xr-draw"><svg class="xr-svg" viewBox="-156 -156 312 312"' + (live ? ' role="img" aria-label="Reticle fields drawn to scale on a 300 mm wafer"' : ' aria-hidden="true"') + '>' +
          '<defs><clipPath id="' + id + '-clip"><circle r="150"/></clipPath><radialGradient id="' + id + '-silver" cx="38%" cy="32%" r="80%"><stop offset="0" class="xr-s0"/><stop offset="1" class="xr-s1"/></radialGradient></defs>' +
          '<circle class="xr-wafer" r="150" fill="url(#' + id + '-silver)"/><g class="xr-grid" clip-path="url(#' + id + '-clip)"></g><g class="xr-tiles"></g></svg>' +
          '<div class="xr-dim" aria-hidden="true"><span>300 mm wafer</span></div>' +
          '<div class="xr-key" aria-hidden="true"><span><i class="xr-sw"></i>One reticle field, 26 × 33 mm</span><span><i class="xr-sw xr-sw-new"></i><b class="xr-key-new">Added at this step</b></span></div></div>' +
        '<div class="xr-top"><p class="xr-k">Area</p><p class="xr-big"><span class="xr-num"></span><span class="xr-unit"></span></p><p class="xr-what"></p></div>' +
        '<div class="xr-more"><p class="xr-cap"></p><p class="xr-src"><span class="fs-k"></span> <span class="xr-src-a"></span></p></div>';
      var grid = p.querySelector('.xr-grid');
      for (var x = -W / 2 - W * 6; x <= R; x += W) grid.appendChild(el('line', { x1: x, y1: -R, x2: x, y2: R }));
      for (var y = -H / 2 - H * 5; y <= R; y += H) grid.appendChild(el('line', { x1: -R, y1: y, x2: R, y2: y }));
      return p;
    }
    function draw(p, k, grow) {
      var g = p.querySelector('.xr-tiles'), s = S[k];
      while (g.firstChild) g.removeChild(g.firstChild);
      if (s.die) {
        var sc = Math.sqrt(s.die / (W * H)), f = rectFor(CELLS[0], 1);
        g.appendChild(el('rect', f)).setAttribute('class', 'field');
        g.appendChild(el('rect', { x: +(-W * sc / 2).toFixed(3), y: +(-H * sc / 2).toFixed(3), width: +(W * sc).toFixed(3), height: +(H * sc).toFixed(3), 'class': 'die new' + (grow ? ' grow' : '') }));
        return;
      }
      var c = count(S, k), added = Math.max(1, c.n - c.before), stagger = Math.min(70, 900 / added);
      for (var t = 0; t < c.n; t++) {
        var r = el('rect', rectFor(CELLS[t], t < c.full ? 1 : c.frac)), cls = t >= c.full ? 'part' : '';
        if (t >= c.before) { cls += ' new'; if (grow) { cls += ' grow'; r.style.animationDelay = Math.round((t - c.before) * stagger) + 'ms'; } }
        r.setAttribute('class', cls.trim());
        g.appendChild(r);
      }
    }
    function say(p, k) {
      var s = S[k], q = function (sel) { return p.querySelector(sel); };
      q('.xr-num').textContent = s.num; q('.xr-unit').textContent = s.unit; q('.xr-what').textContent = s.what; q('.xr-cap').textContent = s.cap;
      q('.xr-src .fs-k').textContent = s.src.length > 1 ? 'Sources:' : 'Source:';
      var a = q('.xr-src-a'); a.innerHTML = '';
      s.src.forEach(function (x, i, all) { if (i) a.appendChild(document.createTextNode(i === all.length - 1 ? ' and ' : ', ')); var l = document.createElement('a'); l.href = x.url; l.target = '_blank'; l.rel = 'noopener'; l.textContent = x.label; a.appendChild(l); });
    }

    // the live panel and its controls
    var live = panel(true), still = panel(false);
    var ctl = h('div', 'xr-ctl');
    ctl.innerHTML =
      '<div class="xr-ctl-h"><span class="xr-ctl-k">Step through</span><span class="xr-step"><button type="button" class="xr-prev" aria-label="Previous step">‹</button><output class="xr-of" aria-hidden="true"></output><button type="button" class="xr-next" aria-label="Next step">›</button></span></div>' +
      '<div class="xr-track"><input type="range" min="0" max="' + (S.length - 1) + '" step="1" value="0" aria-label="Package size, step through"></div>' +
      '<div class="xr-ticks" aria-hidden="true"></div><p class="sr-only xr-say" aria-live="polite"></p>';
    live.appendChild(ctl);
    stage.appendChild(live); stage.appendChild(still);
    var range = ctl.querySelector('input'), ticks = ctl.querySelector('.xr-ticks'), prev = ctl.querySelector('.xr-prev'), next = ctl.querySelector('.xr-next'), sayEl = ctl.querySelector('.xr-say');
    S.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.tabIndex = -1; b.className = 'xr-tick' + (i === 0 ? ' start' : '') + (i === S.length - 1 ? ' end' : '');
      b.style.left = (i / (S.length - 1) * 100) + '%';
      b.innerHTML = '<b></b><small></small>'; b.firstChild.textContent = s.k; b.lastChild.textContent = s.sub || '';
      b.addEventListener('click', function () { set(i); range.focus({ preventScroll: true }); });
      ticks.appendChild(b);
    });
    // the still: the step "print" names, its new squares counted from the step before it, as on screen
    draw(still, P, false); say(still, P);
    if (P > 0 && !S[P].die) still.querySelector('.xr-key-new').textContent = 'Added beyond ' + S[P - 1].num + ' ' + S[P - 1].unit;

    var cur = -1, swapT = 0;
    function marks(k) {
      var s = S[k];
      live.querySelector('.xr-of').textContent = (k + 1) + ' of ' + S.length;
      range.value = k;
      range.setAttribute('aria-valuetext', s.num + ' ' + s.unit + ', ' + s.what);
      prev.disabled = k === 0; next.disabled = k === S.length - 1;
      Array.prototype.forEach.call(ticks.children, function (b, i) { b.classList.toggle('on', i === k); });
    }
    function set(k, quiet) {
      k = Math.max(0, Math.min(S.length - 1, k));
      if (k === cur) return;
      var down = k < cur; cur = k; marks(k);
      draw(live, k, !down && !quiet && !reduced());   // stepping back redraws without the fill-in
      if (!quiet) sayEl.textContent = S[k].num + ' ' + S[k].unit + ', ' + S[k].what + '. ' + S[k].cap;
      clearTimeout(swapT);
      if (quiet || reduced()) { live.classList.remove('swap'); say(live, k); return; }
      live.classList.add('swap'); swapT = setTimeout(function () { say(live, k); live.classList.remove('swap'); }, 160);
    }
    range.addEventListener('input', function () { set(+range.value); });
    prev.addEventListener('click', function () { set(cur - 1); });
    next.addEventListener('click', function () { set(cur + 1); });
    // ?step=N opens on step N (1 to 8); with no figure address in the link, it brings the figure into view
    var q = /[?&]step=(\d+)/.exec(location.search), want = q ? +q[1] : 0;
    set(want >= 1 && want <= S.length ? want - 1 : 0, true);
    if (want >= 1 && want <= S.length && !location.hash) setTimeout(function () { fig.scrollIntoView({ block: 'start' }); }, 60);
    // for the checks (qa/redesign/check-explain.js, check-figs.js)
    ALL[fig.id] = { steps: S, print: P, cells: CELLS, count: function (k) { return count(S, k); }, set: function (k) { set(k, true); return cur; }, at: function () { return cur; } };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.xp-stage[data-live="reticle"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.reticle = { figs: ALL };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
