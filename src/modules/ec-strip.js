/* The history strip at the head of Export Controls (build/ec-strip.js writes it, src/modules/ec-strip.css sets it), on the
   interactive board and on /export-controls/, which inlines this file. From 760 px the list is drawn as a line from 1 January
   2018 to the reader's today: each rule a dot on its true date, its label on the lowest tier where it covers no other label and
   no leader, wrapped narrower when that saves a tier, and the latest rule's dot ending the line with its name after it. Under
   760 px the list stays upright and nothing here runs. The strip is laid out again whenever its width changes, which includes
   the moment its view is first shown. */
(function () {
  'use strict';
  var NARROW = 760, GAP = 14, BASE = 16, TG = 10, AXIS = 30, R = 5, LM = 3, BUDGET = 60000; // LM: a leader's clearance from a label, so rules weeks apart can each have one
  var q = function (s, r) { return (r || document).querySelector(s); }, qa = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var day = function (iso) { var p = String(iso || '').split('-').map(Number); return p.length === 3 && p[0] ? new Date(p[0], p[1] - 1, p[2]) : null; };
  var today = function () { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };

  function layout(fig) {
    var ol = q('.ec-strip', fig), axis = q('.ec-axis', fig);
    if (!ol || !axis) return;
    var lis = qa('.ec-m', ol);
    var clear = function () {
      ol.style.height = ''; axis.innerHTML = ''; fig.classList.remove('is-drawn');
      lis.forEach(function (li) { qa('.ec-dot, .ec-lead, .ec-lab', li).forEach(function (el) { el.removeAttribute('style'); }); });
    };
    clear();
    if (!ol.offsetParent || !lis.length || (document.documentElement.clientWidth || window.innerWidth) < NARROW) return;
    fig.classList.add('is-drawn');
    var W = ol.clientWidth, t0 = day('2018-01-01'), lastLi = lis[lis.length - 1], last = day(lastLi.getAttribute('data-date'));
    var latLab = q('.ec-lab', lastLi), latR = latLab.getBoundingClientRect(), latW = Math.ceil(latR.width) + 1, latH = Math.ceil(latR.height);
    var t1 = Math.max(today(), last), span = t1 - t0, END = W - latW - 14;
    var X = function (d) { return R + (d - t0) / span * (END - R); };
    // each label may wrap narrower, at the cost of a line
    var items = lis.filter(function (li) { return li !== lastLi; }).map(function (li) {
      var lab = q('.ec-lab', li), r = lab.getBoundingClientRect(), w0 = Math.ceil(r.width) + 1, opts = [{ w: w0, h: Math.ceil(r.height) }];
      [0.66, 0.5].forEach(function (f) {
        var w = Math.max(92, Math.round(w0 * f)); if (w >= opts[opts.length - 1].w - 8) return;
        lab.style.width = w + 'px'; var h = Math.ceil(lab.getBoundingClientRect().height); lab.style.width = '';
        if (h > opts[opts.length - 1].h) opts.push({ w: w, h: h });
      });
      return { li: li, lab: lab, x: X(day(li.getAttribute('data-date'))), opts: opts };
    });
    var placed = [], best = null, bestCost = Infinity, steps = 0;
    var ok = function (it, t, a, b) {
      if (a < 0 || b > W) return false;
      for (var i = 0; i < placed.length; i++) {
        var p = placed[i];
        if (p.t === t && a < p.b + GAP && b > p.a - GAP) return false;        // two labels on one tier
        if (p.t < t && it.x >= p.a - LM && it.x <= p.b + LM) return false;    // this leader through a lower label
        if (p.t > t && p.it.x >= a - LM && p.it.x <= b + LM) return false;    // this label over a higher leader
      }
      return true;
    };
    // fewest tiers first; then labels low (short leaders), on as few lines as fit, reading rightward from their mark
    var search = function (k, c, maxT) {
      if (c >= bestCost || ++steps > BUDGET) return;
      if (k === items.length) { best = placed.slice(); bestCost = c; return; }
      var it = items[k];
      for (var t = 0; t < maxT; t++) for (var o = 0; o < it.opts.length; o++) for (var j = 0; j < 2; j++) {
        var w = it.opts[o].w, a = j === 0 ? it.x - 1 : it.x - w + 1, b = a + w;
        if (!ok(it, t, a, b)) continue;
        placed.push({ it: it, t: t, a: a, b: b, w: w, h: it.opts[o].h, r: j === 1 });
        search(k + 1, c + t * 10 + o * 4 + j * 2, maxT);
        placed.pop();
      }
    };
    for (var maxT = 1; maxT <= 6 && !best; maxT++) { placed = []; bestCost = Infinity; steps = 0; search(0, 0, maxT); }
    if (!best) { clear(); return; } // no clean layout at this width: the list stays upright
    var nT = 0, tierH = [];
    best.forEach(function (p) { nT = Math.max(nT, p.t + 1); tierH[p.t] = Math.max(tierH[p.t] || 0, p.h); });
    var bottom = [], acc = BASE;
    for (var t = 0; t < nT; t++) { bottom[t] = acc; acc += tierH[t] + TG; }
    var axisY = Math.max(acc - TG + 2, latH);
    ol.style.height = (axisY + AXIS) + 'px';
    best.forEach(function (p) {
      var it = p.it, labTop = axisY - bottom[p.t] - p.h;
      it.lab.style.cssText = 'left:' + p.a + 'px;top:' + labTop + 'px;width:' + p.w + 'px;text-align:' + (p.r ? 'right' : 'left');
      q('.ec-lead', it.li).style.cssText = 'left:' + (it.x - 0.5) + 'px;top:' + (labTop + p.h + 3) + 'px;height:' + Math.max(0, axisY - (labTop + p.h + 3) - R) + 'px';
      q('.ec-dot', it.li).style.cssText = 'left:' + it.x + 'px;top:' + axisY + 'px';
    });
    var lx = X(last);
    latLab.style.cssText = 'left:' + (lx + 12) + 'px;top:' + (axisY - latH / 2 - 1) + 'px;width:' + latW + 'px';
    q('.ec-lead', lastLi).style.cssText = 'display:none';
    q('.ec-dot', lastLi).style.cssText = 'left:' + lx + 'px;top:' + axisY + 'px';
    // the line to the latest rule, and its years at 1 January
    var h = '<i class="ec-ax-line" style="top:' + axisY + 'px;width:' + lx + 'px"></i>';
    for (var y = 2018; y <= new Date(t1).getFullYear(); y++) {
      var x = X(new Date(y, 0, 1));
      h += '<i class="ec-ax-tick" style="left:' + x + 'px;top:' + axisY + 'px"></i><span class="ec-ax-y" style="left:' + x + 'px;top:' + (axisY + 8) + 'px">' + y + '</span>';
    }
    axis.innerHTML = h;
  }

  function wire(fig) {
    if (fig._ecw) return; fig._ecw = true;
    var w0 = -1, run = function () { var w = fig.clientWidth; if (w === w0) return; w0 = w; layout(fig); };
    if (window.ResizeObserver) new ResizeObserver(function () { window.requestAnimationFrame(run); }).observe(fig);
    else window.addEventListener('resize', function () { clearTimeout(fig._ect); fig._ect = setTimeout(run, 120); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { w0 = -1; run(); });
    run();
  }
  var start = function () { qa('figure.ec-a').forEach(wire); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
