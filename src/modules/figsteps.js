/* Figures that step (figure() and build/figsteps.js draw them; the owner's approved mockups 2 and 7 of 29 Oct 2026): 16.2,
   China's memory in Ascend packages, and 13.2, one GPU's scale-up and scale-out links. Each step brings in its bars on the
   figure's one scale, and the chapter's own sentence for it under the chart. The figure plays its steps once, the first
   time most of it is on screen; a step button stops that and goes to its step. At rest, under reduced motion and on paper
   the figure shows its last step, as the page arrives.

   A figure that names a drawing ("draw", build/figsteps.js) gets it from DRAW below, drawn at the column's own width so its
   text stays 11.5 px or more on a phone, and redrawn when that width changes. */
(function () {
  'use strict';
  var D = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var figs = [];

  /* 13.2: the racks follow the NVL72 layout the chapter gives (18 compute trays of GPUs, nine switch trays between them, 72
     GPUs) as explainer 13.1 draws them. One GPU's two links are drawn to scale: its scale-up link nine units wide and its
     scale-out link one unit wide, the chapter's 7,200 and 800 Gb/s. Dots run along both at one speed, nine times as close
     together on the scale-up link. Step 4 sets a block of the model's layers over each rack. The count of racks in a
     cluster is not given, so two or three are drawn, with no count. */
  var KIND = []; for (var q = 0; q < 27; q++) KIND.push(q < 10 || q > 18 ? 'c' : 's');
  var DRAW = {
    'scale-up-out': function (host, uid) {
      var W = Math.round(host.clientWidth); if (!W) return false;
      var wide = W >= 520, p = wide ? 8 : 7, rw = wide ? 96 : 74, nr = wide ? 3 : 2, u = wide ? 2 : 1.6;
      var L = 30, R = 34, gap = (W - L - R - nr * rw) / (nr - 1);
      var yNet = 70, yR = 108, rh = 27 * p + 8, H = yR + rh + 30;
      var X = function (k) { return L + k * (rw + gap); };
      var tY = function (i) { return yR + 4 + i * p; };
      var th = p - 1.6, gw = (rw - 8 - 15) / 4;
      var hiT = 2, gpuY = tY(hiT) + th / 2;
      var swTop = tY(10), swBot = tY(18) + th, swMid = (swTop + swBot) / 2;
      var ar = 'sy-ar-' + uid, o = [], k;
      o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="presentation" focusable="false">');
      o.push('<defs><marker id="' + ar + '" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="sy-hold"></path></marker></defs>');
      // the model's blocks of layers (step 4), one over each rack: four layers drawn as rules, the block's name over them
      var names = nr === 3 ? ['First layers', 'Next layers', 'Last layers'] : ['First layers', 'Next layers'];
      o.push('<g class="sy-fade" data-from="4">');
      for (k = 0; k < nr; k++) {
        var bx = X(k) - 4, bw = rw + 8;
        o.push('<text class="sy-blk-t" x="' + (bx + bw / 2) + '" y="12">' + names[k] + '</text>');
        for (var ly = 0; ly < 4; ly++) o.push('<rect class="sy-layer" x="' + (bx + 6) + '" y="' + (19 + ly * 5) + '" width="' + (bw - 12) + '" height="2.6"></rect>');
        o.push('<path class="sy-drop" d="M' + (X(k) + rw / 2) + ' 40 V' + (yR - 4) + '" marker-end="url(#' + ar + ')"></path>');
      }
      o.push('<text class="sy-lab m" x="' + (X(nr - 1) + rw + 10) + '" y="30">…</text>');
      o.push('</g>');
      // the scale-out network along the top, and each rack's GPU link to it (step 3)
      o.push('<g class="sy-fade" data-from="3">');
      o.push('<path class="sy-net" stroke-width="' + u + '" d="M' + (X(0) - 12) + ' ' + yNet + ' H' + (W - 14) + '"></path>');
      o.push('<text class="sy-lab k" x="' + (X(0) + rw / 2 + 8) + '" y="' + (yNet - 9) + '">Scale-out, between racks</text>');
      for (k = 0; k < nr; k++) o.push('<path class="sy-out' + (k ? ' ctx' : '') + '" stroke-width="' + u + '" d="M' + X(k) + ' ' + gpuY + ' H' + (X(k) - 12) + ' V' + yNet + '"></path>');
      o.push('<text class="sy-lab m" x="' + (W - 12) + '" y="' + (yNet + 4) + '">…</text>');
      // dots one unit apart in time on the scale-out path: from the lit GPU up, across and down into the next rack
      var outPath = 'M' + X(0) + ' ' + gpuY + ' H' + (X(0) - 12) + ' V' + yNet + ' H' + (X(1) - 12) + ' V' + gpuY + ' H' + X(1);
      o.push('<path class="sy-flow out" stroke-width="4.6" stroke-dasharray="0.01 108" d="' + outPath + '"></path>');
      o.push('</g>');
      // the racks: the first from step 1, the others from step 3
      for (k = 0; k < nr; k++) {
        var x = X(k);
        o.push('<g class="sy-fade" data-from="' + (k ? 3 : 1) + '">');
        o.push('<rect class="sy-frame" x="' + x + '" y="' + yR + '" width="' + rw + '" height="' + rh + '"></rect>');
        for (var i = 0; i < KIND.length; i++) {
          var y = tY(i);
          if (KIND[i] === 'c') {
            o.push('<rect class="sy-ctray" x="' + (x + 4) + '" y="' + y + '" width="' + (rw - 8) + '" height="' + th + '"></rect>');
            for (var j = 0; j < 4; j++) {
              var lit = k === 0 && i === hiT && j === 3;
              o.push('<rect class="sy-gpu' + (lit ? ' lit' : '') + '" x="' + (x + 7 + j * (gw + 3)).toFixed(1) + '" y="' + (y + 1.2) + '" width="' + gw.toFixed(1) + '" height="' + (th - 2.4) + '"></rect>');
            }
          } else {
            o.push('<rect class="sy-stray" x="' + (x + 4) + '" y="' + y + '" width="' + (rw - 8) + '" height="' + th + '"></rect>');
            for (var px = x + 9; px < x + rw - 9; px += 6) o.push('<rect class="sy-port" x="' + px + '" y="' + (y + 1.6) + '" width="2.6" height="' + (th - 3.2) + '"></rect>');
          }
        }
        o.push('<text class="sy-lab' + (k ? ' m' : ' k') + '" x="' + (x + rw / 2) + '" y="' + (yR + rh + 18) + '" text-anchor="middle">' + (k ? 'Rack' : 'One rack, 72 GPUs') + '</text>');
        o.push('</g>');
      }
      // the tray names beside the first rack (step 1 only)
      var lx = X(0) + rw + 12;
      o.push('<g class="sy-fade" data-only="1">');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + tY(0) + ' h6 V' + (tY(9) + th) + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(4) + 4) + '">Compute</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(4) + 19) + '">trays</text>');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + swTop + ' h6 V' + swBot + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (swMid - 3) + '">Switch</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (swMid + 12) + '">trays</text>');
      o.push('<path class="sy-drop" d="M' + (X(0) + rw + 2) + ' ' + tY(19) + ' h6 V' + (tY(26) + th) + ' h-6"></path>');
      o.push('<text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(22) + 4) + '">Compute</text><text class="sy-lab" x="' + (lx + 2) + '" y="' + (tY(22) + 19) + '">trays</text>');
      o.push('</g>');
      // each rack's GPU link to its switch trays, nine units wide (step 2 for the first rack, step 3 for the rest)
      var ox = 9 * u / 2 + 6;
      for (k = 0; k < nr; k++) {
        var xr = X(k) + rw, upD = 'M' + (xr - 4) + ' ' + gpuY + ' H' + (xr + ox) + ' V' + swMid + ' H' + (xr - 4);
        o.push('<g class="sy-fade" data-from="' + (k ? 3 : 2) + '">');
        o.push('<path class="sy-up' + (k ? ' ctx' : '') + '" stroke-width="' + (9 * u) + '" d="' + upD + '"></path>');
        if (!k) o.push('<path class="sy-flow up" stroke-width="3.2" stroke-dasharray="0.01 12" d="' + upD + '"></path>');
        o.push('</g>');
      }
      // the scale-up label in the gap after the first rack
      var sx = X(0) + rw + ox + 9 * u / 2 + 8;
      o.push('<g class="sy-fade" data-from="2">');
      o.push('<text class="sy-lab w" x="' + sx + '" y="' + (swMid - 4) + '">Scale-up</text>');
      o.push('<text class="sy-lab" x="' + sx + '" y="' + (swMid + 11) + '">inside the</text><text class="sy-lab" x="' + sx + '" y="' + (swMid + 26) + '">rack</text>');
      o.push('</g>');
      o.push('</svg>');
      host.innerHTML = o.join('');
      return true;
    }
  };
  // what each step shows of a drawing: a part from its step on (data-from), or at that step only (data-only); the lit GPU
  // while its links are named (steps 2 and 3), the racks held at step 4, and the dots moving unless motion is reduced
  function paint(host, step, last) {
    [].forEach.call(host.querySelectorAll('.sy-fade'), function (g) {
      var from = +g.getAttribute('data-from') || 0, only = +g.getAttribute('data-only') || 0;
      g.classList.toggle('off', only ? step !== only : step < from);
    });
    [].forEach.call(host.querySelectorAll('.sy-gpu.lit'), function (r) { r.classList.toggle('on', step >= 2 && step < last); });
    [].forEach.call(host.querySelectorAll('.sy-frame'), function (r) { r.classList.toggle('held', step === last); });
    [].forEach.call(host.querySelectorAll('.sy-flow'), function (f) { f.classList.toggle('go', !reduce && !host.hasAttribute('data-still')); });
  }

  function setup(fig, n) {
    if (fig._sf) return; fig._sf = true;
    var btns = [].slice.call(fig.querySelectorAll('.sf-steps button'));
    var last = btns.length; if (!last) return;
    var rows = [].slice.call(fig.querySelectorAll('.hbars .hb[data-step]'));
    var cap = fig.querySelector('.sf-cap'), host = fig.querySelector('.sf-draw');
    var draw = host ? DRAW[host.getAttribute('data-draw')] : null, uid = (fig.id || 'f') + '-' + n;
    var step = last, timer = null, played = false, lastW = 0;
    var caps = btns.map(function (b) { return b.getAttribute('data-cap') || ''; });
    function render() { if (!draw) return; var w = Math.round(host.clientWidth); if (w && draw(host, uid)) { lastW = w; paint(host, step, last); } }
    function go(s) {
      step = s; fig.setAttribute('data-step', s);
      btns.forEach(function (b) { if (+b.getAttribute('data-step') === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      rows.forEach(function (r) { var k = +r.getAttribute('data-step'); r.classList.toggle('is-off', k > s); r.classList.toggle('is-new', k === s && s < last); });
      if (cap) cap.textContent = caps[s - 1];
      if (draw && host.firstChild) paint(host, s, last);
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function play() {
      var s = 1; go(1);
      (function next() { timer = setTimeout(function () { s += 1; if (s <= last) { go(s); next(); } else timer = null; }, draw ? 3600 : 3200); })();
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { stop(); played = true; go(+b.getAttribute('data-step')); }); });
    render(); go(last);
    // redrawn when the column's width changes on screen; on paper the screen's drawing is scaled to the page, as it stands
    var paper = window.matchMedia ? matchMedia('print') : { matches: false };
    if (draw && 'ResizeObserver' in window) new ResizeObserver(function () { if (Math.round(host.clientWidth) !== lastW && !paper.matches && !D.documentElement.classList.contains('cp-print')) render(); }).observe(host);
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.45 && !played && !D.documentElement.classList.contains('cp-print')) { played = true; play(); io.disconnect(); } });
      }, { threshold: [0, 0.45, 1] });
      io.observe(fig);
    }
    figs.push({ rest: function () { stop(); played = true; if (host) host.setAttribute('data-still', ''); go(last); } });
  }
  // at rest for paper: the browser's own print, and build/pdf.py, whose CP_PRINT.prepare() marks the page cp-print before
  // Paged.js copies it
  function rest() { figs.forEach(function (f) { f.rest(); }); }
  window.addEventListener('beforeprint', rest);
  if (window.matchMedia) { var mq = matchMedia('print'); if (mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) rest(); }); }
  if ('MutationObserver' in window) new MutationObserver(function () { if (D.documentElement.classList.contains('cp-print')) rest(); }).observe(D.documentElement, { attributes: true, attributeFilter: ['class'] });

  function all() { [].forEach.call(D.querySelectorAll('.figure--steps'), setup); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', all); else all();
})();
