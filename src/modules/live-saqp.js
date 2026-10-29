/* Figure 04.2, "How several passes turn one line into four" (owner approved the mockup on 29 Oct 2026, its latest version).
   A live explainer in the grammar of animations/litho.html (film, light, mask and wafer colors; stepped scenes; one drawing
   that changes in place), with every label in HTML text. build/build.js draws the figure's shell from content/04 (the step
   names and captions, the print still and the note); this module draws into its stage, .anim-stage[data-live="saqp"].
   - The goal first: the line pattern the chip needs is a dashed ghost from the first frame, in both lanes.
   - The limit: a bracket over two printed lines ("the closest spacing one deep ultraviolet exposure prints") and, at Four
     lines, one over two final lines ("a quarter of that spacing"). No pitch is printed, as the chapter gives none.
   - Every change morphs in place: the mask comes down and light falls through it, the film develops into cores, a film coats
     everything, etches back to the side walls, the cores fade, and the spacers serve as the next cores.
   - One color per generation: printed cores amber, first spacers slate (still slate as cores), final lines teal, and wine only
     on the four final lines that came from the middle printed line.
   - A slim EUV lane under it: one exposure prints the same final pattern at once, in step with the main lane. Its mask is a
     mirror (chapter 4), so no mask is drawn there, and the light arrives patterned, labeled as reflected off a mirror mask.
   - Step tiles pile up under the DUV lane, one tile under the EUV lane, and no total line, as no source gives one.
   - The cut: its own mask comes down over the lines, and the line it removes (a teal one, so the middle four stay four) lights
     up, then goes.
   Facts, all from chapter 4 and the glossary's "multipatterning". Geometry: final lines and gaps are 1 unit wide, so the
   printed core is 3 wide on an 8-unit spacing, as SAQP needs.
   Motion: it plays while on screen and loops; a click on the drawing pauses it, a step plays from there. Under reduced motion
   it opens paused on the whole picture (the last step), as the videos do. Paper takes media/saqp-print-end.jpg. */
(function () {
  'use strict';
  var T0 = [0.4, 5.0, 7.6, 10.2, 12.8, 20.4];   // when each step starts, in seconds
  var END = 26.0, LOOP = 28.6;
  // the step tiles: kind (x exposure, d deposition, e etch), the film a deposition lays down, and when it lands
  var DUV = [['x', 0, 2.0], ['d', 1, 5.3], ['e', 0, 7.9], ['e', 0, 10.5], ['d', 2, 14.0], ['e', 0, 15.7], ['e', 0, 17.3], ['x', 0, 22.0], ['e', 0, 23.6]];
  var EUV = [['x', 0, 2.0]];

  var clamp = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var mix = function (a, b, p) { return a + (b - a) * p; };
  var seg = function (t, a, b) { return ease((t - a) / (b - a)); };
  var hex = function (h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  var mixc = function (a, b, p) { var x = hex(a), y = hex(b); return 'rgb(' + x.map(function (v, i) { return Math.round(mix(v, y[i], clamp(p))); }).join(',') + ')'; };
  var dark = function () { return document.documentElement.getAttribute('data-theme') === 'dark'; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  // ---- geometry, in units (a final line is 1 wide); x runs from -10 to 10 in both lanes
  var X0 = -10, X1 = 10;
  var LANE = {
    duv: { top: 3.2, base: 5.8, slab: 6.8, h: 6.8, m0: 0.85, m1: 1.25 },   // headroom for the mask, light and brackets
    euv: { top: 1.9, base: 4.5, slab: 5.1, h: 5.1, m0: 0.35, m1: 0.65 },   // slim: the same lines, less headroom, and no mask drawn
  };
  var CORES = [-8, 0, 8];
  var coreR = CORES.map(function (c) { return [c - 1.5, c + 1.5]; });
  var sp1R = []; CORES.forEach(function (c) { sp1R.push([c - 2.5, c - 1.5], [c + 1.5, c + 2.5]); });
  var sp2R = []; sp1R.forEach(function (m) { sp2R.push([m[0] - 1, m[0]], [m[1], m[1] + 1]); });
  var CUT = 9;                 // the line the later exposure breaks: a teal one, [6.5, 7.5], so the middle four stay four
  var MINE = [4, 5, 6, 7];     // the middle core's four lines: the only wine
  var TARGET = sp2R.filter(function (r, i) { return i !== CUT; });   // the pattern the chip needs, gap included
  var GAPS = [[X0 - 1, -9.5], [-6.5, -1.5], [1.5, 6.5], [9.5, X1 + 1]];
  var CUTOPEN = [6.15, 7.85];
  // the open parts of a mask whose dark parts are the given intervals
  function opens(dark) { var o = [], x = X0 - 1; dark.slice().sort(function (a, b) { return a[0] - b[0]; }).forEach(function (r) { if (r[0] > x) o.push([x, r[0]]); x = Math.max(x, r[1]); }); if (x < X1 + 1) o.push([x, X1 + 1]); return o; }
  var EUVOPEN = opens(TARGET);

  // a film laid evenly over standing lines d thick, then etched straight down by e: columns of [x0, x1, top, bottom]
  function film(mandrels, d, e, L) {
    var xs = [X0 - 1, X1 + 1];
    mandrels.forEach(function (m) { xs.push(m[0], m[1], m[0] - d, m[1] + d); });
    xs.sort(function (a, b) { return a - b; });
    var cols = [];
    for (var i = 0; i + 1 < xs.length; i++) {
      var a = xs[i], b = xs[i + 1]; if (b - a < 1e-6) continue;
      var m = (a + b) / 2;
      var inM = mandrels.some(function (r) { return m > r[0] && m < r[1]; }), inD = mandrels.some(function (r) { return m > r[0] - d && m < r[1] + d; });
      var bot = inM ? L.top : L.base, top = (inD ? L.top - d : L.base - d) + e;
      if (top < bot - 1e-4) cols.push([a, b, top, bot]);
    }
    return cols;
  }
  // the film, light and wafer colors of animations/litho.html, per theme
  function palette() {
    return dark()
      ? { si: '#343b45', film: '#c98f2e', lit: '#efdcae', sp1: '#7d8ea3', sp2: '#5fa3a4', wine: '#a8414b', mask: '#59626e', violet: '150,132,255', violetInk: '#a99cff', ghost: 'rgba(232,231,227,0.55)', dim: 'rgba(232,231,227,0.75)' }
      : { si: '#2c323b', film: '#c98f2e', lit: '#efdcae', sp1: '#8a9bb0', sp2: '#4f8a8b', wine: '#7a1f2b', mask: '#2b323c', violet: '112,92,220', violetInk: '#5a4bb0', ghost: 'rgba(23,23,22,0.5)', dim: 'rgba(69,68,63,0.9)' };
  }
  // step 1 in either lane: the film rises, the mask comes down, light falls through it, the wash clears what it lit
  function printPhase(t) {
    var coat = seg(t, 0.5, 1.1), drop = seg(t, 1.0, 1.8), lift = seg(t, 3.6, 4.2);
    var on = seg(t, 1.9, 2.1) * (1 - seg(t, 2.8, 3.0)), lit = seg(t, 2.1, 2.7), wash = seg(t, 3.0, 3.7);
    return { coat: coat, on: on, lit: lit, wash: wash, drop: drop * (1 - lift), maskA: clamp(drop * 1.4) * (1 - lift) };
  }

  var GLYPH = {
    x: '<path d="M6 3.5v6.5M10 3.5v6.5M14 3.5v6.5M4.5 13.5h11"/><path d="M4.5 16h11"/>',
    d: '<path d="M3.5 16h13M5 16v-4h3V7.5h4V12h3v4"/>',
    e: '<path d="M3.5 16h13M10 13V4.5M7 7.5l3-3 3 3"/>',
  };
  var KIND = { x: 'var(--sq-violet)', e: 'var(--sq-etch)', d1: 'var(--sq-dep)', d2: 'var(--sq-gen2)' };
  function tileHtml(d, row, i) {
    var k = d[0] === 'd' ? KIND['d' + d[1]] : KIND[d[0]];
    return '<li class="sq-tile off" data-row="' + row + '" data-i="' + i + '" style="--k:' + k + '"><svg viewBox="0 0 20 20" aria-hidden="true">' + GLYPH[d[0]] + '</svg></li>';
  }
  function legendTile(kind, k) { return '<span class="sq-tile sq-tile-s" style="--k:' + k + '"><svg viewBox="0 0 20 20" aria-hidden="true">' + GLYPH[kind] + '</svg></span>'; }

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-saqp');
    var btns = Array.prototype.slice.call(fig.querySelectorAll('.anim-steps button'));
    var caps = Array.prototype.map.call(fig.querySelectorAll('.anim-transcript li'), function (li) { return li.textContent.replace(/^[^.]*\.\s*/, ''); });
    var n = Math.min(btns.length, T0.length), capEl = fig.querySelector('.anim-cap');
    var C = palette(), lanes = {}, labs = {}, tiles = [], t = 0, playing = false, user = false, cur = -1, last = 0, inView = false, timer = 0;

    var ghostKey = '<span class="sq-ghostkey"><svg viewBox="0 0 12 16" aria-hidden="true"><rect x="1" y="1" width="10" height="14"/></svg>The lines the chip needs</span>';
    var screen = document.createElement('div');
    screen.className = 'lv-screen';
    screen.innerHTML =
      '<p class="sq-lane-k"><span>Deep ultraviolet immersion scanner, 193 nm light</span>' + ghostKey + '</p>' +
      '<div class="lv-draw sq-draw" data-lane="duv"><canvas aria-hidden="true"></canvas>' +
        '<span class="lv-lab" data-l="mask">Mask</span><span class="lv-lab sq-onfilm" data-l="core">Core</span>' +
        '<span class="lv-lab lead" data-l="spacer">Spacer</span><span class="lv-lab sq-onwafer" data-l="wafer">Wafer</span><span class="lv-lab lead" data-l="cut">Cut</span>' +
        '<span class="lv-lab sq-dim" data-l="b1">The closest spacing one deep ultraviolet exposure prints</span><span class="lv-lab sq-dim" data-l="b2">A quarter of that spacing</span></div>' +
      '<ol class="sq-tiles" aria-hidden="true">' + DUV.map(function (d, i) { return tileHtml(d, 0, i); }).join('') + '</ol>' +
      '<p class="sq-lane-k sq-lane-euv"><span>Extreme ultraviolet scanner, 13.5 nm light</span></p>' +
      '<div class="lv-draw sq-draw sq-draw-euv" data-lane="euv"><canvas aria-hidden="true"></canvas><span class="lv-lab sq-dim sq-reflect" data-l="reflect">Light reflected off a mirror mask</span></div>' +
      '<ol class="sq-tiles" aria-hidden="true">' + EUV.map(function (d, i) { return tileHtml(d, 1, i); }).join('') + '</ol>' +
      '<p class="sq-legend" aria-hidden="true"><span>' + legendTile('x', KIND.x) + 'Exposure</span><span>' + legendTile('d', KIND.d1) + 'Deposition</span><span>' + legendTile('e', KIND.e) + 'Etch</span></p>';
    stage.insertBefore(screen, stage.firstChild);
    screen.querySelectorAll('.sq-draw').forEach(function (d) { var cv = d.querySelector('canvas'); lanes[d.getAttribute('data-lane')] = { cv: cv, ctx: cv.getContext('2d'), w: 0, K: 1 }; });
    screen.querySelectorAll('.lv-lab').forEach(function (el) { labs[el.getAttribute('data-l')] = el; });
    tiles = Array.prototype.map.call(screen.querySelectorAll('.sq-tiles .sq-tile'), function (el) { var row = +el.getAttribute('data-row'), i = +el.getAttribute('data-i'); return { el: el, at: (row ? EUV : DUV)[i][2] }; });

    function painter(lane) {
      var o = lanes[lane], L = LANE[lane], ctx = o.ctx, K = o.K;
      var px = function (x) { return (x - X0) * K; }, py = function (y) { return y * K; };
      return {
        L: L, ctx: ctx, K: K, px: px, py: py,
        rect: function (x0, x1, y0, y1, col, a) {
          if (y1 - y0 <= 0 || x1 - x0 <= 0 || a === 0) return;
          ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(px(x0), py(y0), (x1 - x0) * K, (y1 - y0) * K); ctx.globalAlpha = 1;
        },
        beam: function (x0, x1, y0, y1, a) {
          if (a <= 0 || y1 <= y0) return;
          var g = ctx.createLinearGradient(0, py(y0), 0, py(y1));
          g.addColorStop(0, 'rgba(' + C.violet + ',' + (0.22 * a) + ')'); g.addColorStop(1, 'rgba(' + C.violet + ',' + (0.45 * a) + ')');
          ctx.fillStyle = g; ctx.fillRect(px(x0), py(y0), (x1 - x0) * K, (y1 - y0) * K);
        },
        // a mask: a dark bar with the given openings, lowered into place by drop (0 = up and out of sight, 1 = in place)
        mask: function (open, drop, a) {
          if (a <= 0) return;
          var y0 = mix(-L.m1 - 0.2, L.m0, drop), y1 = y0 + (L.m1 - L.m0);
          ctx.globalAlpha = a; ctx.fillStyle = C.mask;
          var x = X0 - 1; open.forEach(function (r) { if (r[0] > x) ctx.fillRect(px(x), py(y0), (r[0] - x) * K, (y1 - y0) * K); x = r[1]; });
          if (x < X1 + 1) ctx.fillRect(px(x), py(y0), (X1 + 1 - x) * K, (y1 - y0) * K);
          ctx.globalAlpha = 1;
        },
        ghost: function (list) {
          ctx.save(); ctx.strokeStyle = C.ghost; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
          list.forEach(function (r) { ctx.strokeRect(Math.round(px(r[0])) + 0.5, Math.round(py(L.top)) + 0.5, Math.round((r[1] - r[0]) * K) - 1, Math.round((L.base - L.top) * K) - 1); });
          ctx.restore();
        },
        bracket: function (xa, xb, a) {
          if (a <= 0) return;
          var y = py(L.top - 0.42), yt = py(L.top - 0.08);
          ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.dim; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(px(xa), yt); ctx.lineTo(px(xa), y); ctx.lineTo(px(xb), y); ctx.lineTo(px(xb), yt); ctx.stroke(); ctx.restore();
        },
      };
    }
    function clear(lane) { var o = lanes[lane]; o.ctx.setTransform(1, 0, 0, 1, 0, 0); o.ctx.clearRect(0, 0, o.cv.width, o.cv.height); var dpr = o.cv.width / o.w; o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

    function render(t) {
      if (!lanes.duv.w) return;
      // ======== the deep ultraviolet lane ========
      clear('duv'); var P = painter('duv'), L = P.L;
      P.rect(X0 - 1, X1 + 1, L.base, L.slab, C.si);
      var p1 = printPhase(t), top1 = mix(L.base, L.top, p1.coat), coreGone = seg(t, 10.5, 11.7);
      if (p1.coat > 0) {
        if (p1.wash <= 0) P.rect(X0 - 1, X1 + 1, top1, L.base, C.film);
        coreR.forEach(function (r) { P.rect(r[0], r[1], top1, L.base, C.film, 1 - coreGone); });
        if (p1.lit > 0 && p1.wash < 1) GAPS.forEach(function (g) { P.rect(g[0], g[1], mix(top1, L.base, p1.wash), L.base, mixc(C.film, C.lit, p1.lit)); });
      }
      // 2 and 3: a film over everything, then etched straight down to the side walls
      var d1 = seg(t, 5.3, 6.9), e1 = seg(t, 7.9, 9.4), s1Gone = seg(t, 17.3, 18.4);
      if (d1 > 0 && e1 < 1) film(coreR, d1, e1 * d1, L).forEach(function (c) { P.rect(c[0], c[1], c[2], c[3], C.sp1); });
      else if (e1 >= 1) sp1R.forEach(function (r) { P.rect(r[0], r[1], L.top, L.base, C.sp1, 1 - s1Gone); });
      // 6, under the lines: the cut's film
      var rcoat = seg(t, 20.6, 21.3), rlit = seg(t, 22.2, 22.8), rwash = seg(t, 23.0, 23.4), strip = seg(t, 24.6, 25.2), RT = mix(L.base, L.top - 0.5, rcoat);
      if (rcoat > 0 && strip < 1) {
        P.rect(X0 - 1, CUTOPEN[0], RT, L.base, C.film, 1 - strip); P.rect(CUTOPEN[1], X1 + 1, RT, L.base, C.film, 1 - strip);
        P.rect(CUTOPEN[0], CUTOPEN[1], mix(RT, L.base, rwash), L.base, mixc(C.film, C.lit, rlit), 1 - strip);
      }
      // 5: the same again on the spacers, now the cores; the final lines, and wine on the middle four
      var d2 = seg(t, 14.0, 15.4), e2 = seg(t, 15.7, 17.0), wine = seg(t, 18.5, 19.2), cutGone = seg(t, 23.6, 24.4), hl = seg(t, 22.3, 22.8) * (1 - cutGone);
      if (d2 > 0 && e2 < 1) film(sp1R, d2, e2 * d2, L).forEach(function (c) { P.rect(c[0], c[1], c[2], c[3], C.sp2); });
      else if (e2 >= 1) sp2R.forEach(function (r, i) { P.rect(r[0], r[1], L.top, L.base, MINE.indexOf(i) >= 0 ? mixc(C.sp2, C.wine, wine) : C.sp2, i === CUT ? 1 - cutGone : 1); });
      // the line the cut removes, lit up before it goes
      if (hl > 0) { var r = sp2R[CUT]; P.rect(r[0], r[1], L.top, L.base, 'rgb(' + C.violet + ')', 0.35 * hl); P.ctx.save(); P.ctx.globalAlpha = hl; P.ctx.strokeStyle = C.violetInk; P.ctx.lineWidth = 2; P.ctx.strokeRect(P.px(r[0]) - 1, P.py(L.top) - 1, (r[1] - r[0]) * P.K + 2, (L.base - L.top) * P.K + 1); P.ctx.restore(); }
      // masks and light: step 1, then the cut's own mask
      var cdrop = seg(t, 21.2, 21.9) * (1 - seg(t, 23.2, 23.8)), con = seg(t, 22.0, 22.2) * (1 - seg(t, 22.8, 23.0));
      P.mask(GAPS, p1.drop, p1.maskA);
      if (p1.on > 0) { P.beam(X0 - 1, X1 + 1, 0, L.m0, p1.on * 0.6); GAPS.forEach(function (g) { P.beam(g[0], g[1], L.m1, top1, p1.on); }); }
      P.mask([CUTOPEN], cdrop, clamp(cdrop * 1.4));
      if (con > 0) { P.beam(X0 - 1, X1 + 1, 0, L.m0, con * 0.6); P.beam(CUTOPEN[0], CUTOPEN[1], L.m1, RT, con); }
      // the goal, from the first frame; the two brackets
      P.ghost(TARGET);
      var b1 = seg(t, 4.2, 4.6) * (1 - seg(t, 5.4, 5.8)), b2 = seg(t, 19.2, 19.6) * (1 - seg(t, 20.4, 20.8));
      P.bracket(0, 8, b1); P.bracket(-3, -1, b2);

      // ======== the extreme ultraviolet lane: one exposure prints the final pattern ========
      clear('euv'); var E = painter('euv'), LE = E.L, q = printPhase(t), topE = mix(LE.base, LE.top, q.coat);
      E.rect(X0 - 1, X1 + 1, LE.base, LE.slab, C.si);
      if (q.coat > 0) {
        if (q.wash <= 0) E.rect(X0 - 1, X1 + 1, topE, LE.base, C.film);
        TARGET.forEach(function (r) { E.rect(r[0], r[1], topE, LE.base, C.film); });
        if (q.lit > 0 && q.wash < 1) EUVOPEN.forEach(function (g) { E.rect(g[0], g[1], mix(topE, LE.base, q.wash), LE.base, mixc(C.film, C.lit, q.lit)); });
      }
      // an EUV mask is a mirror: the light arrives already patterned, from above, with no mask in its path
      if (q.on > 0) EUVOPEN.forEach(function (g) { E.beam(g[0], g[1], 0, topE, q.on); });
      E.ghost(TARGET);

      // ======== labels, tiles, step marker ========
      var vis = {
        mask: Math.max(p1.maskA, clamp(cdrop * 1.4)) > 0.6 ? 1 : 0,
        core: clamp((t - 3.8) / 0.4) * (1 - clamp((t - 10.5) / 0.4)),
        spacer: clamp((t - 9.2) / 0.4) * (1 - clamp((t - 14.0) / 0.4)),
        wafer: 1, cut: clamp((t - 25.0) / 0.4), b1: b1, b2: b2, reflect: clamp((t - 1.7) / 0.3) * (1 - clamp((t - 3.2) / 0.3)),
      };
      Object.keys(vis).forEach(function (k) { labs[k].style.opacity = vis[k].toFixed(2); });
      var sp = t >= 12.9 ? 'Spacer, now a core' : 'Spacer';
      if (labs.spacer.textContent !== sp) labs.spacer.textContent = sp;
      tiles.forEach(function (tk) { tk.el.classList.toggle('off', t < tk.at); });
      var i = 0; for (var j = 0; j < n; j++) if (t >= T0[j] - 0.05) i = j;
      show(i);
    }
    function place(el, lane, x, y, how) {
      var L = LANE[lane];
      el.style.left = ((x - X0) / (X1 - X0) * 100) + '%'; el.style.top = (y / L.h * 100) + '%';
      el.style.transform = how === 'l' ? 'translate(0, -50%)' : how === 'r' ? 'translate(-100%, -50%)' : how === 'rb' ? 'translate(-100%, -100%)' : how === 'b' ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
    }
    function show(i) {
      if (i === cur) return; cur = i;
      btns.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (capEl && caps[i]) capEl.textContent = caps[i];
    }
    function size() {
      var w = lanes.duv.cv.parentNode.clientWidth; if (!w) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      ['duv', 'euv'].forEach(function (k) {
        var o = lanes[k], L = LANE[k]; o.w = w; o.K = w / (X1 - X0);
        o.cv.width = Math.round(w * dpr); o.cv.height = Math.round(w * L.h / (X1 - X0) * dpr); o.cv.style.height = (w * L.h / (X1 - X0)) + 'px';
      });
      var K = lanes.duv.K, L = LANE.duv;
      labs.spacer.style.setProperty('--lead', Math.max(5, 0.45 * K) + 'px');
      labs.cut.style.setProperty('--lead', Math.max(8, (L.base - 0.4 - (L.top - 0.5)) * K) + 'px');
      render(Math.min(t, END));
    }
    function frame(now) {
      if (!playing) return;
      t += Math.min(0.1, (now - last) / 1000); last = now;
      if (t >= LOOP) t = 0;
      render(Math.min(t, END));
      timer = requestAnimationFrame(frame);
    }
    function play() { if (playing) return; playing = true; fig.classList.remove('is-paused'); last = performance.now(); timer = requestAnimationFrame(frame); stage.setAttribute('aria-label', 'Pause the animation'); }
    function pause() { playing = false; cancelAnimationFrame(timer); fig.classList.add('is-paused'); stage.setAttribute('aria-label', 'Play the animation'); }

    var L = LANE.duv;
    place(labs.mask, 'duv', 9.8, L.m0 - 0.08, 'rb'); place(labs.core, 'duv', 0, (L.top + L.base) / 2, 'c');
    place(labs.spacer, 'duv', -2, L.top - 0.55, 'b'); place(labs.wafer, 'duv', 9.75, (L.base + L.slab) / 2, 'r'); place(labs.cut, 'duv', 7, L.top - 0.5, 'b'); place(labs.reflect, 'euv', -9.8, 0.5, 'l');
    place(labs.b1, 'duv', 4, L.top - 0.55, 'b'); place(labs.b2, 'duv', -2, L.top - 0.55, 'b');
    var toggle = function () { user = playing; if (playing) pause(); else play(); };
    stage.addEventListener('click', toggle);
    stage.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    // a step is a request to watch from there: it plays at once, even after a pause (as the videos' steps do)
    btns.forEach(function (b, i) { b.addEventListener('click', function () { if (i >= n) return; t = T0[i] + 0.05; user = false; render(t); play(); }); });
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(lanes.duv.cv.parentNode); else window.addEventListener('resize', size);
    new MutationObserver(function () { C = palette(); render(Math.min(t, END)); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // under reduced motion it opens on the whole picture, paused, and plays only when asked; otherwise it plays while on screen
    if (reduced()) { t = END; render(t); pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (x) { inView = x.isIntersecting; if (inView && !user) play(); else if (!inView && playing) { pause(); fig.classList.remove('is-paused'); } }); }, { threshold: 0.3 }).observe(stage);
    } else play();
    // for the checks (qa/redesign/check-explain.js) and the print still (qa/redesign/live-stills.js)
    ALL[fig.id] = { seek: function (s) { t = s; pause(); render(Math.min(t, END)); }, play: play, pause: pause, end: END, t0: T0.slice(0, n), time: function () { return t; } };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.anim-stage[data-live="saqp"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.saqp = ALL;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
