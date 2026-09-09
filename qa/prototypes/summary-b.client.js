/* Summary B — chain-first. The flow of fifteen stages is an ARIA tablist; every panel is rendered
   at build time and only shown or hidden here, so the page still reads with JavaScript off.
   Selection is click, tap, arrow keys, Home and End, and it survives in the URL as
   #/summary-b/<stage-id> so a single stage can be linked. */
(function () {
  var CP = window.CP;
  if (!CP) return;
  var $ = CP.$, $$ = CP.$$;
  var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var root = null, scroller = null, tabs = [], panels = {}, sel = null, built = false;

  function idOf(btn) { return btn.getAttribute('data-id'); }

  /* keep the selected node visible in the scrolling strip on phones, without moving the page */
  function reveal(btn) {
    if (!scroller) return;
    var max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 1) return;
    var r = btn.getBoundingClientRect(), s = scroller.getBoundingClientRect();
    var target = scroller.scrollLeft + (r.left - s.left) - (s.width - r.width) / 2;
    target = Math.max(0, Math.min(max, target));
    if (Math.abs(target - scroller.scrollLeft) < 2) return;
    if (reduced || !scroller.scrollTo) scroller.scrollLeft = target;
    else scroller.scrollTo({ left: target, behavior: 'smooth' });
  }

  function setHash(id) {
    if (!CP.Router || CP.Router.current !== 'summary-b') return;
    var want = '#/summary-b/' + id;
    if (location.hash === want) return;
    try { if (window.history && history.replaceState) history.replaceState(null, '', want); } catch (e) { /* older browsers keep the plain view hash */ }
  }

  function select(id, opts) {
    opts = opts || {};
    if (!panels[id]) return;
    sel = id;
    for (var i = 0; i < tabs.length; i++) {
      var b = tabs[i], on = idOf(b) === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      if (on) {
        if (opts.focus) b.focus();
        if (opts.reveal !== false) reveal(b);
      }
    }
    for (var k in panels) if (Object.prototype.hasOwnProperty.call(panels, k)) panels[k].hidden = k !== id;
    if (opts.hash !== false) setHash(id);
  }

  function move(delta) {
    var i = 0;
    for (var j = 0; j < tabs.length; j++) if (idOf(tabs[j]) === sel) { i = j; break; }
    var n = tabs.length;
    select(idOf(tabs[((i + delta) % n + n) % n]), { focus: true, force: true });
  }

  function build() {
    if (built) return;
    root = $('.sb');
    if (!root) return;
    built = true;
    scroller = $('.sb-flow-scroll', root);
    tabs = $$('.sb-node-btn', root);
    $$('.sb-panel', root).forEach(function (p) { panels[p.id.replace(/^sb-panel-/, '')] = p; });
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { select(idOf(b), { force: true }); });
    });
    var list = $('.sb-flow', root);
    if (list) list.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var k = e.key;
      if (k === 'ArrowRight') { e.preventDefault(); move(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); move(-1); }
      else if (k === 'Home') { e.preventDefault(); select(idOf(tabs[0]), { focus: true, force: true }); }
      else if (k === 'End') { e.preventDefault(); select(idOf(tabs[tabs.length - 1]), { focus: true, force: true }); }
    });
    // the strip only scrolls on narrow screens; re-centre the selected node when the layout changes
    window.addEventListener('resize', function () {
      if (!sel) return;
      for (var i = 0; i < tabs.length; i++) if (idOf(tabs[i]) === sel) { reveal(tabs[i]); return; }
    });
  }

  CP.register('summary-b', {
    stage: false,
    activate: function () {
      build();
      if (!root) return;
      var m = (location.hash || '').match(/^#\/summary-b\/([a-z0-9-]+)/);
      var want = m && panels[m[1]] ? m[1] : sel || root.getAttribute('data-default');
      // no hash rewrite for the default: only an explicit pick makes the URL point at one stage
      select(want, { hash: !!(m && panels[m[1]]), force: true });
    }
  });
})();
