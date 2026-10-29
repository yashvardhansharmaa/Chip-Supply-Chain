/* Figure 07.1, "Why big chips lose more to defects", driven live by its own model (owner approved the mockup on 29 Oct 2026).
   build/build.js draws the figure's shell from content/07 (today's four steps and their captions, the print still and the
   note); this module draws the wafer and the model's output into its stage, .anim-stage[data-live="yield"], and puts two
   sliders under it.
   The model is the one animations/defects.html rendered for today's video, run in the page: die yield = (1 + D0 x A / a)^-a
   with a = 3 (Parhami, Dependable Computing, ch. 5, Example 5.2, the source chapter 7 cites), on the textbook's wafer: 70 mm in
   radius, holding 120 dies of 1 x 1 cm or 26 of 2 x 2 cm. The four steps are today's four, with today's captions, and they set
   the sliders. The sliders then drive the model: chip size from 1 cm up to the 26 by 33 mm patch one exposure prints
   (chapter 4), and defects from 0.1 to 1.0 per square cm.
   What it prints is only what the model computes for the setting, under "The model's output" (the owner approved these as
   the one place a number is computed on screen): the share of flawless 1 cm chips, of the chosen chips, and the cost of a
   good chosen chip against a good 1 cm chip, (dies of 1 cm x their share) / (chosen dies x their share), with the shares as
   shown, to a tenth of a percent. At 0.8 and 2 cm that gives back the chapter's 49.2, 11.3 and 20.1.
   The wafer: the specks are today's (the same random draw, seed 131, the first 123 of them at 0.8), cleared off the lines
   between chips; where the draw would leave more or fewer flawless chips than the formula's share allows, the fewest specks
   move to a neighboring chip until the count matches. Other sizes fill the wafer with whole chips on a grid laid from the
   1 cm grid's lines, the layout that fits the most (which gives the textbook's 120 and 26). qa/redesign/sweep-yield.js checks
   every setting. Paper takes media/yield-print-end.jpg, the site's inputs. */
(function () {
  'use strict';
  // ---------------- the model ----------------
  var rng = function (seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var RAD = 70, CL = 3, SEED = 131, EDGE = 1.25, KEEP = 2.2;
  var AREA_CM2 = Math.PI * Math.pow(RAD / 10, 2), MAXSPECK = Math.round(1.0 * AREA_CM2);
  function clustered(r, N) {
    var sp = [];
    while (sp.length < N) {
      var cx, cy; do { cx = (r() * 2 - 1) * RAD; cy = (r() * 2 - 1) * RAD; } while (Math.hypot(cx, cy) > RAD);
      var k = 1 + Math.floor(r() * 8);
      for (var j = 0; j < k && sp.length < N; j++) {
        var ang = r() * 6.283, rad = 9 * Math.sqrt(-2 * Math.log(1 - r() * 0.999));
        var x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
        if (Math.hypot(x, y) < RAD) sp.push({ x: x, y: y, t: r() });
      }
    }
    return sp;
  }
  var POOL = null;
  var pool = function () { return POOL || (POOL = clustered(rng(SEED), MAXSPECK)); };
  var sizeOf = function (v) { return v <= 26 ? [v, v] : [26, v]; };
  function gridAt(w, h, ox, oy) {
    var out = [], n = Math.ceil(RAD / Math.min(w, h)) + 2;
    for (var j = -n; j <= n; j++) for (var i = -n; i <= n; i++) {
      var x = ox + i * w, y = oy + j * h;
      if (Math.max(Math.hypot(x, y), Math.hypot(x + w, y), Math.hypot(x, y + h), Math.hypot(x + w, y + h)) <= RAD) out.push({ x: x, y: y, w: w, h: h });
    }
    return out;
  }
  var offs = function (w) { var s = []; for (var k = 0; k < 40; k++) { var v = (k * 10) % w; if (s.indexOf(v) < 0) s.push(v); } return s.map(function (v) { return -v; }); };
  var GRIDS = {};
  function layout(v) {
    if (GRIDS[v]) return GRIDS[v];
    var wh = sizeOf(v), w = wh[0], h = wh[1], best = null;
    offs(h).forEach(function (oy) { offs(w).forEach(function (ox) { var g = gridAt(w, h, ox, oy); if (!best || g.length > best.dies.length) best = { w: w, h: h, ox: ox, oy: oy, dies: g }; }); });
    return (GRIDS[v] = best);
  }
  var yieldOf = function (areaCm2, d0) { return Math.pow(1 + d0 * areaCm2 / CL, -CL); };
  var r3 = function (y) { return Math.round(y * 1000) / 1000; };
  function readouts(v, d0) {
    var L = layout(v), ref = layout(10);
    var y1 = r3(yieldOf(1, d0)), y = r3(yieldOf(L.w * L.h / 100, d0));
    return { y1: y1, y: y, cost: (ref.dies.length * y1) / (L.dies.length * y), n: L.dies.length, good: Math.round(y * L.dies.length) };
  }
  var inDie = function (s, d) { return s.x >= d.x && s.x < d.x + d.w && s.y >= d.y && s.y < d.y + d.h; };
  var dieOf = function (s, dies) { for (var i = 0; i < dies.length; i++) if (inDie(s, dies[i])) return i; return -1; };
  var clampIn = function (s, d, m) { return { x: Math.min(Math.max(s.x, d.x + m), d.x + d.w - m), y: Math.min(Math.max(s.y, d.y + m), d.y + d.h - m) }; };
  var distTo = function (s, d) { return Math.hypot(Math.max(d.x - s.x, 0, s.x - (d.x + d.w)), Math.max(d.y - s.y, 0, s.y - (d.y + d.h))); };
  var cdist = function (a, b) { return Math.hypot(a.x + a.w / 2 - b.x - b.w / 2, a.y + a.h / 2 - b.y - b.h / 2); };
  var CACHE = {};
  function wafer(v, d0) {
    var key = v + '|' + d0; if (CACHE[key]) return CACHE[key];
    var L = layout(v), dies = L.dies, n = Math.round(d0 * AREA_CM2);
    var sp = pool().slice(0, n).map(function (s) { return { x: s.x, y: s.y, t: s.t }; });
    var off = function (val, o, step) { var g = o + Math.round((val - o) / step) * step, e = val - g; return Math.abs(e) >= EDGE ? val : g + (e < 0 ? -EDGE : EDGE); };
    sp.forEach(function (s) { var x = off(s.x, L.ox, L.w), y = off(s.y, L.oy, L.h); if (Math.hypot(x, y) < RAD - 0.5) { s.x = x; s.y = y; } });
    var target = dies.length - readouts(v, d0).good;
    for (var it = 0; it < 400; it++) {
      var where = sp.map(function (s) { return dieOf(s, dies); }), count = dies.map(function () { return 0; });
      where.forEach(function (i) { if (i >= 0) count[i]++; });
      var dead = count.filter(function (c) { return c > 0; }).length;
      if (dead === target) break;
      if (dead > target) {   // a chip too many is hit: its specks join the nearest hit chip
        var pick = -1, pd = 1e9;
        dies.forEach(function (d, i) { if (!count[i]) return; var near = 1e9; dies.forEach(function (e, j) { if (j !== i && count[j]) near = Math.min(near, cdist(d, e)); }); var sc = count[i] * 1000 + near; if (sc < pd) { pd = sc; pick = i; } });
        var to = -1, td = 1e9; dies.forEach(function (e, j) { if (j !== pick && count[j]) { var c = cdist(dies[pick], e); if (c < td) { td = c; to = j; } } });
        if (to < 0) break;
        sp.forEach(function (s, k) { if (where[k] === pick) { var q = clampIn(s, dies[to], EDGE); s.x = q.x; s.y = q.y; } });
      } else {                // a chip too few is hit: the nearest spare speck moves onto the nearest clean chip
        var best = null;
        sp.forEach(function (s, k) { var i = where[k]; if (i >= 0 && count[i] < 2) return; dies.forEach(function (d, j) { if (count[j]) return; var dd = distTo(s, d); if (!best || dd < best.dd) best = { k: k, j: j, dd: dd }; }); });
        if (!best) break;
        var q2 = clampIn(sp[best.k], dies[best.j], EDGE); sp[best.k].x = q2.x; sp[best.k].y = q2.y;
      }
    }
    var wh = sp.map(function (s) { return dieOf(s, dies); }), hit = dies.map(function () { return false; });
    wh.forEach(function (i) { if (i >= 0) hit[i] = true; });
    sp.forEach(function (s, k) {
      var i = wh[k];
      if (i >= 0) { var q = clampIn(s, dies[i], EDGE); s.x = q.x; s.y = q.y; return; }
      dies.forEach(function (d, j) {   // a stray speck keeps clear of a clean chip, so none seems to sit on one
        if (hit[j] || distTo(s, d) >= KEEP) return;
        var ox = s.x < d.x ? d.x - s.x : s.x - (d.x + d.w), oy = s.y < d.y ? d.y - s.y : s.y - (d.y + d.h);
        var x = ox >= oy ? (s.x < d.x ? d.x - KEEP : d.x + d.w + KEEP) : s.x, y = ox >= oy ? s.y : (s.y < d.y ? d.y - KEEP : d.y + d.h + KEEP);
        if (Math.hypot(x, y) < RAD - 0.8 && dieOf({ x: x, y: y }, dies) < 0) { s.x = x; s.y = y; }
      });
    });
    return (CACHE[key] = { L: L, sp: sp, hit: dies.map(function (d) { return sp.some(function (s) { return inDie(s, d); }); }) });
  }

  // ---------------- the figure ----------------
  var SIZE = [10, 10, 20, 20];   // the chip size each of today's four steps sets, in mm (the density is the textbook's 0.8)
  var FREE = 'The formula’s output for the chip size and density of specks set below, on the textbook example’s wafer.';
  var clamp = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var easeOut = function (p) { return 1 - Math.pow(1 - clamp(p), 3); };
  var mix = function (a, b, p) { return a + (b - a) * p; };
  var dark = function () { return document.documentElement.getAttribute('data-theme') === 'dark'; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var dims = function (v) { var wh = sizeOf(v); return wh[0] + ' × ' + wh[1] + ' mm'; };
  var pct = function (y) { return (y * 100).toFixed(1); };
  var times = function (c) { return c < 100 ? c.toFixed(1) : String(Math.round(c)); };
  var dstr = function (d) { var s = String(Math.round(d * 100) / 100); return s === '1' ? '1.0' : s; };

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-yield');
    var btns = Array.prototype.slice.call(fig.querySelectorAll('.anim-steps button'));
    var caps = Array.prototype.map.call(fig.querySelectorAll('.anim-transcript li'), function (li) { return li.textContent.replace(/^[^.]*\.\s*/, ''); });
    var nSteps = Math.min(btns.length, SIZE.length), capEl = fig.querySelector('.anim-cap'), uid = fig.id || 'yd';
    var cv, ctx, rows, outs = {}, inputs = {}, cssW = 0;
    var state = { v: 20, d0: 0.8, step: nSteps - 1 };
    // what the drawing shows: a view, tweened between steps
    var view = { speck: 1, draw: 1, fill: 1, keep: 1, prev: null, prevA: 0, move: 1, rows: [1, 1, 1], on: 1 };
    var anim = null, chain = [], touched = false;

    var row = function (unit) { return '<div class="yd-row"><span class="yd-num"></span><span class="yd-unit">' + unit + '</span><span class="yd-name"></span></div>'; };
    var tick = function (p, html, cls) { return '<span class="yd-tick' + (cls ? ' ' + cls : '') + '" style="left:' + (p * 100).toFixed(2) + '%">' + html + '</span>'; };
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="yd-wafer lv-screen"><canvas role="img" aria-label="A simulated wafer of chips, with the specks that land on it and the chips they spoil"></canvas></div>' +
      '<div class="yd-read lv-screen" aria-live="polite"><p class="yd-k">The model’s output</p>' + row('percent flawless') + row('percent flawless') + row('times the cost') + '</div>';
    while (wrap.firstChild) stage.insertBefore(wrap.firstChild, stage.querySelector('.anim-print'));
    var ctls = document.createElement('div');
    ctls.className = 'yd-ctls lv-screen';
    ctls.innerHTML =
      '<div class="yd-ctl"><label class="yd-ctl-h" for="' + uid + '-v"><span class="yd-ctl-k">Chip size</span><output id="' + uid + '-vo" for="' + uid + '-v"></output></label>' +
        '<div class="yd-track"><input id="' + uid + '-v" type="range" min="10" max="33" step="1" value="20"></div>' +
        '<div class="yd-ticks" aria-hidden="true">' + tick(0, '1 cm', 'start') + tick(10 / 23, '2 cm') + tick(1, '26 × 33 mm<small>the most one exposure prints</small>', 'end') + '</div></div>' +
      '<div class="yd-ctl"><label class="yd-ctl-h" for="' + uid + '-d"><span class="yd-ctl-k">Defects per square centimeter</span><output id="' + uid + '-do" for="' + uid + '-d"></output></label>' +
        '<div class="yd-track"><input id="' + uid + '-d" type="range" min="0.1" max="1" step="0.05" value="0.8"></div>' +
        '<div class="yd-ticks" aria-hidden="true">' + tick(0, '0.1', 'start') + tick(0.7 / 0.9, '0.8<small>textbook example</small>') + tick(1, '1.0', 'end') + '</div></div>';
    stage.parentNode.insertBefore(ctls, stage.nextSibling);
    cv = stage.querySelector('.yd-wafer canvas'); ctx = cv.getContext('2d');
    rows = Array.prototype.slice.call(stage.querySelectorAll('.yd-row'));
    inputs.v = ctls.querySelector('input[min="10"]'); inputs.d = ctls.querySelector('input[min="0.1"]'); outs.v = ctls.querySelectorAll('output')[0]; outs.d = ctls.querySelectorAll('output')[1];

    function readout() {
      var R = readouts(state.v, state.d0);
      var vals = [[pct(R.y1), 'Small chips, 1 × 1 cm'], [pct(R.y), 'Chips, ' + dims(state.v)], [times(R.cost), 'Per good chip, against 1 × 1 cm']];
      rows.forEach(function (r, i) {
        r.querySelector('.yd-num').textContent = vals[i][0];
        r.querySelector('.yd-name').textContent = vals[i][1];
        r.classList.toggle('off', view.rows[i] < 0.5);
        r.classList.toggle('on', view.on === i);
      });
      outs.v.textContent = dims(state.v); outs.d.textContent = dstr(state.d0);
      inputs.v.value = state.v; inputs.d.value = state.d0;
      inputs.v.setAttribute('aria-valuetext', sizeOf(state.v).join(' by ') + ' millimeters');
      inputs.d.setAttribute('aria-valuetext', dstr(state.d0) + ' defects per square centimeter');
    }
    function marks(i) {
      btns.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (capEl) capEl.textContent = i >= 0 ? (caps[i] || '') : FREE;
    }

    // ---- drawing, ported from animations/defects.html
    function draw() {
      if (!ctx || !cssW) return;
      var dk = dark(), dpr = cv.width / cssW;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var C = cssW / 2, K = (cssW / 2 - 2) / RAD, px = function (x) { return C + x * K; };
      var g = ctx.createLinearGradient(px(-RAD), px(-RAD), px(RAD), px(RAD));
      var st = dk ? ['#8d959f', '#737c87', '#a2a9b2', '#666f7a'] : ['#d9dde2', '#c2c8cf', '#e4e7eb', '#b3bac2'];
      g.addColorStop(0, st[0]); g.addColorStop(0.45, st[1]); g.addColorStop(0.55, st[2]); g.addColorStop(1, st[3]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C, C, RAD * K, 0, 7); ctx.fill();
      ctx.strokeStyle = dk ? 'rgba(236,233,226,0.35)' : 'rgba(20,24,31,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      var cur = wafer(state.v, state.d0);
      function dies(W, drawP, fillP, alpha, keep) {
        if (alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = alpha;
        W.L.dies.forEach(function (d, i) {
          var order = (d.y + RAD) / (2 * RAD), a = clamp((drawP - order * 0.7) / 0.3); if (a <= 0) return;
          var f = clamp((fillP - order * 0.6) / 0.4), dead = W.hit[i];
          if (f > 0) { ctx.fillStyle = dead ? 'rgba(122,31,43,' + ((dk ? 0.8 : 0.62) * f * a) + ')' : 'rgba(255,255,255,' + ((dk ? 0.2 : 0.32) * f * a) + ')'; ctx.fillRect(px(d.x), px(d.y), d.w * K, d.h * K); }
          ctx.strokeStyle = dk ? 'rgba(20,23,28,' + (0.55 * a) + ')' : 'rgba(20,24,31,' + (0.4 * a) + ')'; ctx.lineWidth = 0.8;
          ctx.strokeRect(px(d.x) + 0.4, px(d.y) + 0.4, d.w * K - 0.8, d.h * K - 0.8);
        });
        // the chips that came out flawless are the ones that pay for the wafer
        if (keep > 0) {
          var n = 0;
          W.L.dies.forEach(function (d, i) {
            if (W.hit[i]) return;
            var a = ease((keep * 2 - n++ * 0.12) / 0.35); if (a <= 0) return;
            ctx.save(); ctx.globalAlpha = alpha * Math.min(1, a);
            ctx.fillStyle = dk ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.6)'; ctx.fillRect(px(d.x), px(d.y), d.w * K, d.h * K);
            ctx.strokeStyle = dk ? '#ece9e2' : '#14181f'; ctx.lineWidth = 2; ctx.strokeRect(px(d.x) + 1, px(d.y) + 1, d.w * K - 2, d.h * K - 2);
            ctx.restore();
          });
        }
        ctx.restore();
      }
      if (view.prev) dies(view.prev, 1, 1, view.prevA, 0);
      dies(cur, view.draw, view.fill, 1, view.keep);
      var from = view.prev ? view.prev.sp : null;
      cur.sp.forEach(function (s, i) {
        var a = clamp((view.speck - s.t * 0.8) / 0.2); if (a <= 0) return;
        var x = s.x, y = s.y;
        if (from && from[i] && view.move < 1) { x = mix(from[i].x, s.x, ease(view.move)); y = mix(from[i].y, s.y, ease(view.move)); }
        var r = mix(2.9, 1.0, easeOut(a)) * K;
        ctx.fillStyle = dk ? 'rgba(20,23,28,' + a + ')' : 'rgba(20,24,31,' + (0.92 * a) + ')';
        ctx.beginPath(); ctx.arc(px(x), px(y), r, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(247,246,242,' + (0.9 * a) + ')'; ctx.lineWidth = 1; ctx.stroke();
      });
    }

    // ---- steps: each sets the sliders to the chapter's inputs and plays its own change
    function tween(dur, fn, done) {
      if (anim) cancelAnimationFrame(anim.raf);
      if (reduced()) { anim = null; fn(1); draw(); readout(); if (done) done(); return; }
      var t0 = performance.now();
      anim = { raf: 0 };
      var step = function (now) { var p = clamp((now - t0) / (dur * 1000)); fn(p); draw(); readout(); if (p < 1) anim.raf = requestAnimationFrame(step); else { anim = null; if (done) done(); } };
      anim.raf = requestAnimationFrame(step);
    }
    function settle(i) {   // the state a step ends in, with no motion
      state.v = SIZE[i]; state.d0 = 0.8; state.step = i;
      view = { speck: 1, draw: i >= 1 ? 1 : 0, fill: i >= 1 ? 1 : 0, keep: i >= 3 ? 1 : 0, prev: null, prevA: 0, move: 1, rows: [i >= 1 ? 1 : 0, i >= 2 ? 1 : 0, i >= 3 ? 1 : 0], on: i - 1 };
    }
    function go(i, done) {
      if (i > 0) settle(i - 1);
      state.v = SIZE[i]; state.d0 = 0.8; state.step = i; marks(i);
      if (i === 0) { view = { speck: 0, draw: 0, fill: 0, keep: 0, prev: null, prevA: 0, move: 1, rows: [0, 0, 0], on: -1 }; tween(2.6, function (p) { view.speck = p * 1.05; }, done); }
      else if (i === 1) tween(2.0, function (p) { view.draw = ease(p * 1.6); view.fill = ease((p - 0.35) / 0.55); view.rows[0] = p > 0.75 ? 1 : 0; view.on = 0; }, done);
      else if (i === 2) {
        view.prev = wafer(10, 0.8); view.draw = 0; view.fill = 0; view.move = 0;
        tween(2.4, function (p) { view.prevA = 1 - ease(p / 0.3); view.move = clamp(p / 0.3); view.draw = ease((p - 0.15) * 1.6); view.fill = ease((p - 0.45) / 0.45); view.rows[1] = p > 0.8 ? 1 : 0; view.on = 1; if (p >= 1) view.prev = null; }, done);
      } else tween(1.8, function (p) { view.keep = p; view.rows[2] = p > 0.25 ? 1 : 0; view.on = 2; }, done);
    }
    var stop = function () { chain.forEach(clearTimeout); chain = []; touched = true; };
    function free() {   // a slider moved: the model's output for the reader's setting, drawn at once
      if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
      stop();
      state.step = -1; marks(-1);
      view = { speck: 1.05, draw: 1, fill: 1, keep: 1, prev: null, prevA: 0, move: 1, rows: [1, 1, 1], on: 1 };
      draw(); readout();
    }
    function autoplay() {   // the first time it comes on screen it plays the four steps once, then waits for the reader
      if (touched || reduced()) return;
      touched = true;
      var at = 0;[0, 1, 2, 3].forEach(function (i) { chain.push(setTimeout(function () { go(i); }, at)); at += [3200, 3600, 3800][i] || 0; });
    }

    inputs.v.addEventListener('input', function () { state.v = +inputs.v.value; free(); });
    inputs.d.addEventListener('input', function () { state.d0 = Math.round(+inputs.d.value * 100) / 100; free(); });
    btns.forEach(function (b, i) { b.addEventListener('click', function () { if (i >= nSteps) return; stop(); go(i); }); });
    var size = function () {
      var w = cv.parentNode.clientWidth; if (!w) return; cssW = w;
      var dpr = Math.min(window.devicePixelRatio || 1, 3); cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr); draw();
    };
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv.parentNode); else window.addEventListener('resize', size);
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // before it plays, and under reduced motion, it shows the last step: the whole picture, at the chapter's inputs
    settle(nSteps - 1); marks(nSteps - 1); readout(); size();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) autoplay(); }); }, { threshold: 0.45 }).observe(stage);
    // for the checks (qa/redesign/check-explain.js, sweep-yield.js) and the print still (qa/redesign/live-stills.js)
    ALL[fig.id] = {
      set: function (v, d0) { stop(); state.v = v; state.d0 = d0; free(); return readouts(v, d0); },
      step: function (i) { stop(); settle(i); marks(i); draw(); readout(); },
    };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.anim-stage[data-live="yield"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.yield = { figs: ALL, readouts: readouts, wafer: wafer, layout: layout };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
