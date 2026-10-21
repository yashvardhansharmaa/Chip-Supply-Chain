/* installed before the page's own scripts: paint, LCP, layout shifts, long tasks, long animation frames, the first WebGL
   draw and every PC.build (specimen geometry), all as performance.now() times */
(function () {
  var P = window.__perf = { paint: [], lcp: [], ls: [], lt: [], loaf: [], draw: null, drawN: 0, builds: [], marks: {} };
  function describe(n) {
    try {
      if (!n) return null;
      if (n.nodeType === 3) n = n.parentElement;
      var s = n.tagName ? n.tagName.toLowerCase() : '#';
      if (n.id) s += '#' + n.id;
      if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.');
      var p = n.parentElement;
      if (p) { var ps = p.tagName.toLowerCase() + (p.id ? '#' + p.id : '') + (p.className && typeof p.className === 'string' ? '.' + p.className.trim().split(/\s+/)[0] : ''); s = ps + ' > ' + s; }
      return s;
    } catch (e) { return '?'; }
  }
  function po(type, fn) { try { new PerformanceObserver(function (l) { l.getEntries().forEach(fn); }).observe({ type: type, buffered: true }); } catch (e) { P.marks['no-' + type] = 1; } }
  po('paint', function (e) { P.paint.push([e.name, e.startTime]); });
  po('largest-contentful-paint', function (e) { P.lcp.push({ t: e.startTime, size: e.size, el: describe(e.element), url: e.url || '' }); });
  po('layout-shift', function (e) {
    P.ls.push({ t: e.startTime, v: e.value, input: e.hadRecentInput, src: (e.sources || []).map(function (s) { return { n: describe(s.node), p: [Math.round(s.previousRect.y), Math.round(s.previousRect.height)], c: [Math.round(s.currentRect.y), Math.round(s.currentRect.height)] }; }) });
  });
  po('longtask', function (e) { P.lt.push([e.startTime, e.duration]); });
  po('long-animation-frame', function (e) {
    P.loaf.push({ t: e.startTime, d: e.duration, block: e.blockingDuration, render: e.renderStart ? e.startTime + e.duration - e.renderStart : 0, style: e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0,
      scripts: (e.scripts || []).map(function (s) { return { inv: s.invoker, fn: s.sourceFunctionName, pos: s.sourceCharPosition, d: Math.round(s.duration), comp: Math.round(s.forcedStyleAndLayoutDuration || 0) }; }) });
  });
  function wrap(proto) {
    if (!proto || !proto.drawArrays) return;
    var orig = proto.drawArrays;
    proto.drawArrays = function (m, f, c) { if (c > 0) { P.drawN++; if (P.draw === null) P.draw = performance.now(); } return orig.apply(this, arguments); };
  }
  wrap(window.WebGLRenderingContext && WebGLRenderingContext.prototype);
  wrap(window.WebGL2RenderingContext && WebGL2RenderingContext.prototype);
  var pc;
  Object.defineProperty(window, 'PC', { configurable: true, get: function () { return pc; }, set: function (v) {
    pc = v;
    if (v && v.build && !v.__w) { var ob = v.build; v.build = function (n) { var t0 = performance.now(); var r = ob.apply(this, arguments); P.builds.push([n, Math.round(t0), Math.round(performance.now() - t0), r && r.cloud ? r.cloud.length / 4 : 0]); return r; }; v.__w = 1; }
  } });
  document.addEventListener('DOMContentLoaded', function () { P.marks.dcl = performance.now(); });
  window.addEventListener('load', function () { P.marks.load = performance.now(); });
})();
