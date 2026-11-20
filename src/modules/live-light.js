/* Figure 04.2, "The light each kind of scanner uses, and the finest line it prints" (the owner's "Build it" of 20 Nov 2026 on
   the explorables mockup pick-the-light, as the designer refined it, less its "Sold by ASML, 2025" facts, which the designer
   judged off the figure's point). build/build.js and build/explore.js write the figure's shell from content/04: every light as
   page text (.xp-list: its numbers in data-x, its sentence and its sources) and the Table. This module draws into the stage,
   .xp-stage[data-live="light"]:
   - on screen (.lv-screen), a tab for each light; under them one wave of the light and a row of printed lines standing on a
     wafer strip, both on one scale in nanometers (800 nm across, 560 on a narrow screen) with a 100 nm ruler, and a faint
     column one wavelength wide on both rows, so the lines that fit inside one wave can be counted. Lines are drawn at the
     finest feature ASML gives for the light, with gaps of the same width. Changing the light eases the wave and the lines to
     the new size (at once under reduced motion). Under the drawing: the wavelength, the finest line, a small drawing of the
     source, optics and medium, the light's sentence and its source. ?light=1 to 6 opens on that light;
   - for paper and the PDF (.xp-still), the light the figure's "print" names, whatever the reader last chose. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', HW = 46, HL = 40;
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var h = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var nm = function (v) { return String(v); };
  var ease = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var logMix = function (a, b, e) { return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * e); };

  // the source, the optics and the medium; the cone that lands on the wafer widens with the numerical aperture
  function glyph(kind) {
    var wafer = '<rect class="g-wafer" x="28" y="55" width="76" height="6"/><rect class="g-film" x="28" y="53" width="76" height="2"/>', s = '';
    if (kind === 'euv' || kind === 'hna') {
      var c = kind === 'hna' ? 14 : 7;   // half the landing cone: NA 0.55 against 0.33
      s += '<circle class="g-src" cx="14" cy="44" r="3.2"/>';
      s += '<path class="g-ray" d="M14 44 L46 12 L100 22 L' + (66 - c) + ' 53"/>';
      s += '<path class="g-ray" d="M14 44 L54 12 L100 30 L' + (66 + c) + ' 53" opacity="0.7"/>';
      s += '<path class="g-mirror" d="M38 13 Q50 7 62 13"/><path class="g-mirror" d="M100 14 Q108 26 100 38"/>';
      return s + wafer;
    }
    if (kind === 'lamp') s += '<circle class="g-src" cx="66" cy="9" r="5"/>';
    else s += '<rect class="g-src" x="56" y="4" width="20" height="8" rx="1"/>';
    s += '<path class="g-ray" d="M58 12 L58 33 L66 53 M74 12 L74 33 L66 53"/>';
    if (kind === 'water') s += '<rect class="g-water" x="46" y="41" width="40" height="12" opacity="0.85"/>';
    s += '<ellipse class="g-lens" cx="66" cy="34" rx="22" ry="4.5"/>';
    return s + wafer;
  }

  var ALL = {};
  function mount(stage) {
    var fig = stage.closest('.figure'); if (!fig || stage._live) return;
    var L = Array.prototype.map.call(fig.querySelectorAll('.xp-list > li'), function (li) {
      var o = {}; try { o = JSON.parse(li.getAttribute('data-x') || '{}'); } catch (e) { }
      var cap = li.querySelector('.xp-li-cap');
      o.cap = cap ? cap.textContent : '';
      o.src = Array.prototype.map.call(li.querySelectorAll('.xp-li-src a'), function (a) { return { label: a.textContent, url: a.getAttribute('href') }; });
      return o;
    }).filter(function (o) { return o.wl > 0 && o.ft > 0; });
    if (!L.length) return;
    stage._live = true;
    fig.classList.add('figure--live', 'lv-light');
    var P = Math.max(1, Math.min(L.length, +stage.getAttribute('data-print') || L.length)) - 1;

    function panel(live) {
      var p = h('div', 'pl-panel ' + (live ? 'lv-screen' : 'xp-still'));
      if (!live) p.setAttribute('aria-hidden', 'true');
      var plot = function (row, svg, br) { return '<div class="pl-row ' + row + '"><span class="pl-lab">' + (row === 'pl-row-light' ? 'Light' : 'Finest line printed') + '</span><div class="pl-plot"><span class="pl-span" aria-hidden="true"></span>' + svg + '<span class="pl-br ' + br + '" aria-hidden="true"><i></i><em></em></span></div></div>'; };
      p.innerHTML =
        '<div class="pl-draw"' + (live ? ' role="img" aria-label="One wave of the light and the finest lines it prints, drawn to one scale in nanometers"' : '') + '>' +
          plot('pl-row-light', '<svg class="pl-svg pl-wave" preserveAspectRatio="none" aria-hidden="true"><path class="pl-wave-p"/></svg>', 'pl-br-wave') +
          plot('pl-row-lines', '<svg class="pl-svg pl-lines" preserveAspectRatio="none" aria-hidden="true"><rect class="pl-wafer" x="0" y="31" height="9"/><g class="pl-g"></g></svg>', 'pl-br-line') +
          '<div class="pl-ruler" aria-hidden="true"><i></i><span>100 nm</span></div></div>' +
        '<div class="pl-facts"><div class="pl-fact"><span class="pl-k">Wavelength</span><span class="pl-num pl-f-wl"></span></div><div class="pl-fact"><span class="pl-k">Finest line</span><span class="pl-num pl-f-ft"></span></div></div>' +
        '<div class="pl-how"><svg class="pl-glyph" viewBox="0 0 132 64" aria-hidden="true"></svg><p class="pl-mech"></p><div class="pl-txt"><p class="pl-cap"></p><p class="pl-src"><span class="fs-k"></span> <span class="pl-src-a"></span></p></div></div>';
      return p;
    }
    function pick(live, on) {
      var g = h('div', 'pl-pick' + (live ? ' lv-screen' : ' xp-still'));
      if (live) { g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-label', 'Pick the light'); } else g.setAttribute('aria-hidden', 'true');
      L.forEach(function (o, i) {
        var b = h(live ? 'button' : 'span', 'pl-opt' + (!live && i === on ? ' on' : ''));
        if (live) { b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.tabIndex = -1; }
        b.innerHTML = '<b></b><span></span>'; b.firstChild.textContent = o.k; b.lastChild.textContent = nm(o.wl) + ' nm';
        g.appendChild(b);
      });
      return g;
    }
    // the drawing at a wavelength and a feature size (mid-change, between two lights), on a span of nm across; the labels name
    // the light's own values (lw, lf), never a value mid-change
    function paint(p, span, wl, ft, lw, lf) {
      var wave = p.querySelector('.pl-wave'), lines = p.querySelector('.pl-lines'), d = [], A = 15;
      var pc = function (v) { return (Math.min(v, span) / span * 100).toFixed(3) + '%'; };
      wave.setAttribute('viewBox', '0 0 ' + span + ' ' + HW);
      var step = Math.max(span / 3000, wl / 16);
      for (var x = 0; x <= span + 1e-6; x += step) d.push((x ? 'L' : 'M') + x.toFixed(2) + ' ' + (HW / 2 - A * Math.sin(2 * Math.PI * x / wl)).toFixed(2));
      p.querySelector('.pl-wave-p').setAttribute('d', d.join(''));
      lines.setAttribute('viewBox', '0 0 ' + span + ' ' + HL);
      p.querySelector('.pl-wafer').setAttribute('width', span);
      var g = p.querySelector('.pl-g'), html = '';
      for (var x0 = 0; x0 < span; x0 += 2 * ft) html += '<rect x="' + x0.toFixed(3) + '" y="4" width="' + Math.min(ft, span - x0).toFixed(3) + '" height="27"/>';
      g.innerHTML = html;
      Array.prototype.forEach.call(p.querySelectorAll('.pl-span'), function (s) { s.style.width = pc(wl); });
      var bw = p.querySelector('.pl-br-wave'), bl = p.querySelector('.pl-br-line');
      bw.style.width = pc(wl); bl.style.width = pc(ft);
      bw.querySelector('em').textContent = 'One wavelength, ' + nm(lw) + ' nm';
      bl.querySelector('em').textContent = 'One line, ' + nm(lf) + ' nm';
      p.querySelector('.pl-ruler i').style.width = pc(100);
      place(bw); place(bl);
    }
    // a bracket's label sits to its right, or under it from its left end where the right has no room
    function place(br) {
      var em = br.querySelector('em'), box = br.parentNode.clientWidth;
      if (!box) { em.style.left = 'calc(100% + 8px)'; return; }
      em.style.left = (br.offsetWidth + 8 + em.offsetWidth <= box) ? 'calc(100% + 8px)' : '0';
      em.classList.toggle('under', em.style.left === '0px' || em.style.left === '0');
    }
    function say(p, o) {
      var q = function (sel) { return p.querySelector(sel); };
      q('.pl-f-wl').innerHTML = ''; q('.pl-f-wl').appendChild(document.createTextNode(nm(o.wl))); q('.pl-f-wl').appendChild(h('small', '', 'nm'));
      q('.pl-f-ft').innerHTML = ''; q('.pl-f-ft').appendChild(document.createTextNode(nm(o.ft))); var u = h('small'); u.textContent = o.ftU || 'nm'; q('.pl-f-ft').appendChild(u);
      q('.pl-mech').textContent = o.mech || ''; q('.pl-cap').textContent = o.cap;
      q('.pl-src .fs-k').textContent = o.src.length > 1 ? 'Sources:' : 'Source:';
      var a = q('.pl-src-a'); a.innerHTML = '';
      o.src.forEach(function (x, i, all) { if (i) a.appendChild(document.createTextNode(i === all.length - 1 ? ' and ' : ', ')); var l = document.createElement('a'); l.href = x.url; l.target = '_blank'; l.rel = 'noopener'; l.textContent = x.label; a.appendChild(l); });
      q('.pl-glyph').innerHTML = glyph(o.g);
    }

    var tabs = pick(true), live = panel(true), stillPick = pick(false, P), still = panel(false), sayEl = h('p', 'sr-only pl-say');
    sayEl.setAttribute('aria-live', 'polite');
    live.appendChild(sayEl);
    stage.appendChild(tabs); stage.appendChild(live); stage.appendChild(stillPick); stage.appendChild(still);
    var spanOf = function () { var w = live.querySelector('.pl-plot').clientWidth; return w && w < 480 ? 560 : 800; };
    // the still: the light "print" names, on the wide scale
    say(still, L[P]); paint(still, 800, L[P].wl, L[P].ft, L[P].wl, L[P].ft);

    var cur = -1, raf = 0, swapT = 0, shown = { wl: L[0].wl, ft: L[0].ft };
    var btns = Array.prototype.slice.call(tabs.children);
    function set(i, quiet) {
      i = Math.max(0, Math.min(L.length - 1, i));
      if (i === cur) return;
      var o = L[i], from = { wl: shown.wl, ft: shown.ft }; cur = i;
      btns.forEach(function (b, k) { b.setAttribute('aria-checked', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      cancelAnimationFrame(raf); clearTimeout(swapT);
      if (!quiet) sayEl.textContent = o.k + ': light at ' + nm(o.wl) + ' nm, finest line ' + nm(o.ft) + ' ' + (o.ftU || 'nm') + '. ' + o.cap;
      if (quiet || reduced()) { shown = { wl: o.wl, ft: o.ft }; live.classList.remove('swap'); paint(live, spanOf(), o.wl, o.ft, o.wl, o.ft); say(live, o); return; }
      live.classList.add('swap'); swapT = setTimeout(function () { say(live, o); live.classList.remove('swap'); }, 170);
      var t0 = performance.now(), D = 700;
      (function tick(t) {
        var p = Math.min(1, Math.max(0, (t - t0) / D)), e = ease(p);
        shown = { wl: logMix(from.wl, o.wl, e), ft: logMix(from.ft, o.ft, e) };
        paint(live, spanOf(), shown.wl, shown.ft, o.wl, o.ft);
        if (p < 1) raf = requestAnimationFrame(tick); else shown = { wl: o.wl, ft: o.ft };
      })(t0);
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { set(i); });
      b.addEventListener('keydown', function (e) {
        var to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? cur + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? cur - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? L.length - 1 : null;
        if (to == null) return;
        e.preventDefault(); set(to); btns[cur].focus();
      });
    });
    var redraw = function () { if (cur >= 0) paint(live, spanOf(), shown.wl, shown.ft, L[cur].wl, L[cur].ft); paint(still, 800, L[P].wl, L[P].ft, L[P].wl, L[P].ft); };
    if (window.ResizeObserver) new ResizeObserver(redraw).observe(live); else window.addEventListener('resize', redraw);
    // ?light=N opens on light N (1 to 6), else on the light that tells the most (the one paper prints); with no figure address
    // in the link, it brings the figure into view
    var q = /[?&]light=(\d+)/.exec(location.search), want = q ? +q[1] : 0;
    set(want >= 1 && want <= L.length ? want - 1 : P, true);
    if (want >= 1 && want <= L.length && !location.hash) setTimeout(function () { fig.scrollIntoView({ block: 'start' }); }, 60);
    // for the checks (qa/redesign/check-explain.js, check-figs.js)
    ALL[fig.id] = { steps: L, print: P, set: function (i) { set(i, true); return cur; }, go: function (i) { set(i); return cur; }, at: function () { return cur; }, shown: function () { return { wl: shown.wl, ft: shown.ft, span: spanOf() }; } };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.xp-stage[data-live="light"]'), mount); }
  window.CP_LIVE = window.CP_LIVE || {};
  window.CP_LIVE.light = { figs: ALL };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
