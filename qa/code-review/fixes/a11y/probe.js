/* Injected by checks.py: contrast against the painted ground, and where the focused element sits against the fixed bars. */
window.__a = (function () {
  function rgb(s) {
    var c = /color\(srgb ([^)]+)\)/.exec(s || ''); // color-mix() computes to color(srgb r g b / a), channels 0 to 1
    if (c) { var q = c[1].split(/[\s\/]+/).filter(Boolean).map(Number); return [q[0] * 255, q[1] * 255, q[2] * 255, q.length > 3 ? q[3] : 1]; }
    var m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100; }
  function bgOf(el) { // the ground actually painted under el: translucent grounds and opacity are composited over what lies below
    var chain = [];
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) { var c = rgb(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { chain.push([c, parseFloat(getComputedStyle(e).opacity)]); if (c[3] >= 1 && parseFloat(getComputedStyle(e).opacity) >= 1) break; } }
    var base = rgb(getComputedStyle(document.body).backgroundColor), out = base;
    if (chain.length && chain[chain.length - 1][0][3] >= 1 && chain[chain.length - 1][1] >= 1) { out = chain.pop()[0]; }
    for (var i = chain.length - 1; i >= 0; i--) { var col = chain[i][0], a = col[3] * chain[i][1]; out = [0, 1, 2].map(function (k) { return col[k] * a + out[k] * (1 - a); }).concat([1]); }
    return out;
  }
  function opac(el) { var o = 1; for (var e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; }
  function blend(fg, a, bg) { return [0, 1, 2].map(function (i) { return fg[i] * a + bg[i] * (1 - a); }); }
  function text(el, pseudo) { var cs = getComputedStyle(el, pseudo || null), fg = rgb(cs.color), bg = bgOf(el); var a = fg[3] * opac(el) * (pseudo ? 1 : 1); return { fg: cs.color, op: Math.round(opac(el) * 100) / 100, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', ratio: ratio(blend(fg, a, bg), bg) }; }
  function edge(el, pseudo) { var cs = getComputedStyle(el, pseudo || null), c = rgb(cs.borderTopColor), bg = bgOf(el.parentElement || el); var w = cs.borderTopWidth; return { edge: cs.borderTopColor, width: w, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', ratio: ratio(blend(c, c[3] * opac(el), bg), bg) }; }
  function bars() {
    var m = document.querySelector('.masthead'), top = m ? m.getBoundingClientRect().bottom : 0;
    var rail = document.querySelector('.wk-rail[data-show="1"]'); if (rail && getComputedStyle(rail).display !== 'none' && !rail.hidden) top = Math.max(top, rail.getBoundingClientRect().bottom);
    var cx = document.getElementById('cx-sticky'); if (cx && !cx.hidden && getComputedStyle(cx).display !== 'none') top = Math.max(top, cx.getBoundingClientRect().bottom); // AI Chips' Comparing bar
    var st = document.querySelector('.stage'), bottom = innerHeight;
    if (st && getComputedStyle(st).display !== 'none' && getComputedStyle(st).position === 'fixed' && st.getBoundingClientRect().top > innerHeight / 3) bottom = st.getBoundingClientRect().top;
    return { top: top, bottom: bottom };
  }
  function desc(el) {
    if (!el || el === document.body) return 'BODY';
    var t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    return el.tagName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + t + '"';
  }
  function where() { // the focused element against the fixed bars: hidden (fully covered), part (partly covered), clear
    var el = document.activeElement; if (!el || el === document.body) return { el: 'BODY', state: 'body' };
    if (el.closest('.masthead, .stage, .wk-rail, #cx-sticky, #cp-search, #sheet, .skip')) return { el: desc(el), state: 'bar' }; // part of a bar, or above them all
    var r = el.getBoundingClientRect(), b = bars(), state = 'clear';
    if (!r.width && !r.height) state = 'nosize';
    else if (r.bottom <= b.top || r.top >= b.bottom || r.bottom <= 0 || r.top >= innerHeight) state = 'hidden';
    else if (r.top < b.top || r.bottom > b.bottom) state = 'part';
    var op = opac(el), vis = getComputedStyle(el).visibility;
    if (op < 0.05 || vis === 'hidden') state = 'invisible';
    var cx = document.getElementById('cx-sticky');
    return { el: desc(el), state: state, top: Math.round(r.top), bottom: Math.round(r.bottom), barTop: Math.round(b.top), barBottom: Math.round(b.bottom), cxBar: !!cx && !cx.hidden };
  }
  return { rgb: rgb, ratio: ratio, text: text, edge: edge, bars: bars, where: where, desc: desc, opac: opac };
})(); 0;
