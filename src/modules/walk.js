/* The walk (#/walk): a thin progress rail over the numbered spine.
   Progressive enhancement only — the spine, the counts and the previous/next links all work without this. */
(function () {
  var CP = window.CP;
  if (!CP) return;

  var rail, fill, num, label, list, steps = [], total = 0;
  var setUp = false, queued = false, at = -1, first = true;

  function head() { // the masthead is measured at runtime, so read it rather than assume 56
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'));
    return (v || 56) + 62;
  }

  function setup() {
    if (setUp) return !!rail;
    setUp = true;
    rail = document.getElementById('wk-rail');
    list = CP.$('.wk-list');
    steps = CP.$$('.wk-step');
    total = steps.length;
    if (!rail || !list || !total) { rail = null; return false; }
    fill = rail.querySelector('.wk-rail-bar i');
    num = rail.querySelector('.wk-rail-n');
    label = rail.querySelector('.wk-rail-t');
    rail.hidden = false;
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    return true;
  }

  function soon(fn) { // requestAnimationFrame must be called on window, never detached
    if (window.requestAnimationFrame) window.requestAnimationFrame(fn); else window.setTimeout(fn, 16);
  }

  function tick() {
    if (queued) return;
    queued = true;
    soon(update);
  }

  function update() {
    queued = false;
    if (!rail || CP.Router.current !== 'walk') return;
    var line = head();
    var box = list.getBoundingClientRect();

    rail.setAttribute('data-show', box.top < line && box.bottom > line - 60 ? '1' : '0');
    var p = Math.max(0, Math.min(1, (line - box.top) / Math.max(1, box.height)));
    fill.style.width = (p * 100).toFixed(1) + '%';

    var cur = 0;
    for (var i = 0; i < total; i++) if (steps[i].getBoundingClientRect().top <= line) cur = i;
    if (cur === at) return;
    at = cur;
    for (var j = 0; j < total; j++) {
      steps[j].classList.toggle('is-past', j < cur);
      steps[j].classList.toggle('is-here', j === cur);
    }
    num.textContent = (cur + 1) + ' / ' + total;
    label.textContent = steps[cur].getAttribute('data-title') || '';
  }

  /* #/walk/<chapter> is a step anchor: the router reads the hash as the walk view, and the step's own
     id is that same string, so the browser scrolls to it on its own. The one case it cannot handle is
     a cold load, where the router scrolls back to the top after this view opens — so redo it here. */
  function jump(cold) {
    var h = location.hash || '';
    if (h.indexOf('#/walk/') !== 0) return;
    var el = document.getElementById(decodeURIComponent(h.slice(1)));
    if (!el) return;
    var root = document.documentElement, prev = root.style.scrollBehavior;
    if (cold) root.style.scrollBehavior = 'auto'; // land on the step, do not animate the whole page
    el.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = prev;
  }

  CP.register('walk', {
    activate: function () {
      if (!setup()) return;
      var cold = first;
      first = false;
      // the router scrolls to the top right after this returns, so land the jump on the next task,
      // not the next frame — a background tab gets no frames
      window.setTimeout(function () { jump(cold); }, 0);
      at = -1;
      soon(update);
    }
  });
})();
