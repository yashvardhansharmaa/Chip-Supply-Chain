/* The walk (#/walk): a thin progress rail over the numbered spine.
   Progressive enhancement only — the spine, the counts and the previous/next links all work without this. */
(function () {
  var CP = window.CP;
  if (!CP) return;

  var rail, fill, num, label, list, steps = [], total = 0, deck = null, deckHash = '';
  var setUp = false, queued = false, at = -1, first = true;
  /* Back from a chapter returns the reader to the same place: while the walk is read, the address follows the step on
     screen (#/walk/<chapter>, replaced, never pushed), or past the last step the flashcards (#/walk/flashcards), and the
     scroll position is kept, so coming back to that address puts the page where it was left, and a reload in the deck
     opens on the deck. */
  var lastY = 0, lastHash = null, base = '#/', pending = null, hold = 0;
  var HOMEISH = /^(#|#\/|#\/(walk|home|intro|briefing))?$/, STEP = /^#\/walk\/[^?#\/]+$/;

  function head() { // the masthead is measured at runtime, so read it rather than assume 56
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'));
    return (v || 56) + 62;
  }

  /* the reading line sits just below where a step lands when it is jumped to, so the step on screen is the one the rail names */
  function line() { return Math.max(head(), (CP.landAt && steps[0] ? CP.landAt(steps[0]) : 0) + 8); }

  function jumpTo(y) { // html scrolls smoothly; a return to the reader's place must not animate
    var root = document.documentElement, prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto'; window.scrollTo(0, y); root.style.scrollBehavior = prev;
  }

  function remember(i) { // i: the step on screen; -1 above the first step, -2 in the flashcards after the last
    lastY = window.pageYOffset;
    var h = location.hash || '';
    if (HOMEISH.test(h) || STEP.test(h)) { // an address this view does not own (a query, an anchor) is left alone
      var want = i === -2 ? deckHash : i >= 0 ? '#' + steps[i].id : base;
      if (want !== h) { try { history.replaceState(history.state, '', want || location.pathname + location.search); } catch (e) { } }
    }
    lastHash = location.hash || '';
  }

  function setup() {
    if (setUp) return !!rail;
    setUp = true;
    rail = document.getElementById('wk-rail');
    list = CP.$('.wk-list');
    steps = CP.$$('.wk-step');
    total = steps.length;
    deck = document.getElementById('/walk/flashcards'); // the flashcards after the last step, an address of this view like a step's
    deckHash = deck ? '#/walk/flashcards' : '';
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
    var ln = line();
    var box = list.getBoundingClientRect();
    var inDeck = !!deck && deck.getBoundingClientRect().top <= ln; // the flashcards have reached the reading line: the rail, which names a step, goes

    rail.setAttribute('data-show', !inDeck && box.top < ln && box.bottom > ln - 60 ? '1' : '0');
    var p = Math.max(0, Math.min(1, (ln - box.top) / Math.max(1, box.height)));
    fill.style.width = (p * 100).toFixed(1) + '%';

    var cur = 0;
    for (var i = 0; i < total; i++) if (steps[i].getBoundingClientRect().top <= ln) cur = i;
    // the spine fills to the reading line: past steps in full, the current step to the fraction read
    var r = steps[cur].getBoundingClientRect(), f = Math.max(0, Math.min(1, (ln - r.top) / Math.max(1, r.height)));
    steps[cur].style.setProperty('--wk-fill', (f * 100).toFixed(1) + '%');
    // above the first step the address is the page's own; just after a landing the page may still reflow under it, so wait
    if (!pending && Date.now() > hold) remember(inDeck ? -2 : steps[0].getBoundingClientRect().top <= ln ? cur : -1);
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
     id is that same string, so the browser scrolls to it on its own. A cold load or an arrival from
     another view cannot rely on that, and the browser ignores the masthead, so land it here. */
  function stepFor(h) {
    if (!STEP.test(h || '')) return null;
    var id = h.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { } // "#/walk/%" is not valid escaping; take it as typed rather than throw
    return document.getElementById(id);
  }

  function jump(glide) { // the step lands below the masthead and the rail, at the reading line
    var el = stepFor(location.hash);
    if (el) CP.scrollToEl(el, glide);
    return el;
  }

  /* web fonts and late images can still reflow the page after a landing; the router puts the step back for a second or
     so, and the address keeps the step until then, unless the reader starts to scroll first */
  function settle(el) {
    hold = Date.now() + 1400;
    var go = function () { hold = 0; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, go, { passive: true, once: true }); });
    if (el && CP.Router.settle) CP.Router.settle(el);
  }

  /* The hero (27 Oct 2026: the home's structure before the redesign). Each row of the chain at a glance ends in a button, its
     band's meter and word, that picks the stage's specimen: the button copies its stage's specimen, number, title and caption
     onto the hero (#wk-hero, a [data-specimen] item that Sections in src/app.js tracks like a step), and a scroll event asks
     Sections to draw it; Sections.hold keeps the hero on the stage while any of it is on screen, so the row in wine is always
     the specimen shown. Hovering a button picks it once the pointer rests on it a moment, so a pointer crossing the list on
     its way to the specimen does not flick through the stages, and a scroll under a still pointer picks nothing; a click or
     focus picks it at once. The picked row is marked
     (.is-shown, the one row in wine). One button is in the Tab order, the picked one; the arrow keys, Home and End move along
     them and pick as they go, as they do on the Suppliers pipeline. The stage's name is a plain link to its chapter. */
  (function hero() {
    var box = document.getElementById('wk-hero');
    var picks = box ? CP.$$('.wk-gl-c', box) : [];
    var wait = 0;
    function pick(i, focus) {
      var b = picks[i]; if (!b) return;
      window.clearTimeout(wait);
      if (b.getAttribute('aria-pressed') !== 'true') {
        picks.forEach(function (m, k) {
          m.setAttribute('aria-pressed', k === i ? 'true' : 'false'); m.tabIndex = k === i ? 0 : -1;
          var row = m.closest('li'); if (row) row.classList.toggle('is-shown', k === i);
        });
        box.setAttribute('data-specimen', b.getAttribute('data-spec') || '');
        box.setAttribute('data-number', b.getAttribute('data-n') || '');
        box.setAttribute('data-title', b.getAttribute('data-t') || '');
        box.setAttribute('data-caption', b.getAttribute('data-cap') || '');
      }
      if (CP.Sections) CP.Sections.hold = box; // the hero keeps the stage while it is on screen, though the walk has begun under it
      window.dispatchEvent(new Event('scroll'));
      if (focus) b.focus(); // after the pick, so the focus handler finds it made
    }
    picks.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(i, false); });
      b.addEventListener('focus', function () { pick(i, false); });
      // the pointer's own movement arms the pick (a scroll under a still pointer moves no mouse, though it changes what is under it)
      b.addEventListener('mousemove', function (e) {
        if (!e.movementX && !e.movementY) return;
        window.clearTimeout(wait); wait = window.setTimeout(function () { pick(i, false); }, 110);
      });
      b.addEventListener('mouseleave', function () { window.clearTimeout(wait); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, n = picks.length, to = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') to = Math.min(n - 1, i + 1);
        else if (k === 'ArrowUp' || k === 'ArrowLeft') to = Math.max(0, i - 1);
        else if (k === 'Home') to = 0; else if (k === 'End') to = n - 1;
        if (to < 0) return;
        e.preventDefault(); pick(to, true);
      });
    });
  })();

  CP.register('walk', {
    /* the router leaves the page where this view puts it: a step to land on, or the place the reader left */
    owns: function () { return !!pending; },
    activate: function () {
      if (!setup()) return;
      var cold = first, h = location.hash || '';
      first = false;
      base = HOMEISH.test(h) ? h : '#/';
      // coming back (Back from a chapter, or any return) to the address the walk had when the reader left it
      var back = !cold && CP.Router.from !== 'walk' && lastHash !== null && h === lastHash, y = lastY;
      var glide = !cold && CP.Router.from === 'walk'; // a step link inside the walk glides; arriving from elsewhere jumps
      // a reader who scrolled while the page was still arriving (the walk shows before boot) is not jumped back to the step
      var kept = cold && !!(window.CP_PRE && window.CP_PRE.touched);
      pending = back ? 'restore' : (stepFor(h) && !kept ? 'jump' : null);
      var place = function () { if (pending === 'restore') jumpTo(y); else if (pending === 'jump') return jump(glide); return null; };
      place();
      // once more on the next task (a cold load can still be settling), not the next frame — a background tab gets no frames
      window.setTimeout(function () { var el = glide ? null : place(); if (el) settle(el); pending = null; at = -1; soon(update); }, 0);
      at = -1;
      soon(update);
    }
  });
})();
