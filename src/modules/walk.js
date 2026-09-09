/* The walk (#/walk): a thin progress rail over the numbered spine.
   Progressive enhancement only — the spine, the counts and the previous/next links all work without this. */
(function () {
  var CP = window.CP;
  if (!CP) return;

  var rail, fill, num, label, list, steps = [], total = 0;
  var setUp = false, queued = false, at = -1, jumped = false;

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

  function tick() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || window.setTimeout)(update, 16);
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

  /* #/walk/<chapter> is a step anchor: the router reads it as the walk view, and the step's own id
     carries the same string, so the browser scrolls to it. On a cold load the router scrolls to the
     top first, so redo the jump on the next frame. */
  function jump() {
    var h = location.hash || '';
    if (h.indexOf('#/walk/') !== 0) return;
    var el = document.getElementById(decodeURIComponent(h.slice(1)));
    if (!el) return;
    var root = document.documentElement, prev = root.style.scrollBehavior;
    if (!jumped) root.style.scrollBehavior = 'auto'; // first load: jump, do not animate the whole page
    el.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = prev;
    jumped = true;
  }

  CP.register('walk', {
    activate: function () {
      if (!setup()) return;
      var go = function () { jump(); update(); };
      if (window.requestAnimationFrame) requestAnimationFrame(go); else setTimeout(go, 0);
    }
  });
})();
