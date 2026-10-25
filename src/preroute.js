/* The route before boot. build/build.js inlines this file into <head> (the PREROUTE placeholder in src/template.html), where it runs
   before any of the body has arrived. It reads the address by the router's own rules (src/app.js Router.route) and sets
   <html data-route="walk|stack|landscape|suppliers|controls|glossary"> (and data-sub="exposure" for the China revenue
   panel, data-sub="country" for the Suppliers By country tab). The template's CSS then shows only that view while the rest of the file streams in, so the view a reader asked
   for paints as soon as its own markup has arrived. boot() takes over with the router's hidden attributes and html.booted.
   The build runs route() over every id on the page and warns when one would open a view other than the one it sits in. */
(function (root) {
  'use strict';
  // the #/<name> routes, as Router.route maps them (VIEWS and ALIAS in src/app.js); an unknown name goes home
  var NAMED = { home: 'walk', intro: 'walk', briefing: 'walk', walk: 'walk', chain: 'stack', stack: 'stack', geopolitics: 'stack', sources: 'stack',
    landscape: 'landscape', 'ai-chips': 'landscape', suppliers: 'suppliers', controls: 'controls', 'export-controls': 'controls', thresholds: 'controls',
    exposure: 'controls', glossary: 'glossary' };
  // a bare anchor (#lithography, #gl-euv) opens the view that holds the element; these are the ids of the views other than
  // The Chain, and anything else opens The Chain, as the router does for a chapter, a section or an id it cannot find
  var OWN = [[/^(gl|lk)-|^glossary$/, 'glossary'], [/^(sup-|atlas|the-route)/, 'suppliers'], [/^(cx|picker)/, 'landscape'],
    [/^(cf|tl-|ex-|exposure|controls|timeline)/, 'controls'], [/^(wk-|intro-)/, 'walk']];
  function own(id) { for (var i = 0; i < OWN.length; i++) if (OWN[i][0].test(id)) return OWN[i][1]; return 'stack'; }
  function route(hash, search) {
    var h = hash || '#/', m = h.match(/^#\/([a-z-]+)/), bare = h.replace(/^#/, ''), view, sub = '';
    if (bare === '' || bare === '/' || bare.indexOf('/?') === 0) { // home; the QA aid ?only=<chapter> with no route opens that chapter
      var only = /[?&]only=([^&#]*)/.exec(search || '');
      view = only && (bare === '' || bare === '/') && own(only[1]) === 'stack' ? 'stack' : 'walk';
    } else if (m) {
      view = NAMED[m[1]] || 'walk';
      if (m[1] === 'exposure') sub = 'exposure';
      else if (view === 'suppliers' && /[?&]tab=country\b/.test(h)) sub = 'country'; // the By country tab (Suppliers.activate)
      if (view === 'suppliers' && /[?&]country=[A-Za-z]{2}\b/.test(h)) return { view: view, sub: sub, pick: true }; // a country on the atlas (summary-a.js)
      if (view === 'walk' && /^#\/walk\/[^?#\/]+$/.test(h)) return { view: view, sub: sub, anchor: h.slice(1) }; // a step of the walk
    } else {
      var id = bare; try { id = decodeURIComponent(id); } catch (e) { } // "#%" is not valid escaping; take it as typed, as the router does
      view = own(id);
      if (view === 'stack') return { view: view, sub: sub, anchor: id };
    }
    return { view: view, sub: sub };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { route: route }; return; }

  var html = document.documentElement, pre = root.CP_PRE = { view: null, touched: false }, r = null;
  try {
    r = route(location.hash, location.search);
    pre.view = r.view; html.setAttribute('data-route', r.view);
    if (r.sub) html.setAttribute('data-sub', r.sub);
    if (r.pick) html.setAttribute('data-pick', '1');
  } catch (e) { html.setAttribute('data-route', 'pending'); } // unsure: every view waits for boot, as before
  // a reader who scrolls or taps before boot keeps their place: boot() then leaves the scroll alone (Router.route)
  var mark = function () { pre.touched = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { root.addEventListener(t, mark, { passive: true, capture: true, once: true }); });
  // An anchor in The Chain (#lithography, #lithography--high-na-euv) or a step of the walk (#/walk/lithography): the browser
  // does not scroll to it while the page is still arriving, so this does, in the first frame after the element has been
  // parsed, and puts it back if the page moves it before boot (each element's scroll-margin-top keeps it clear of the
  // masthead). Back to top shows as Sections.update would show it, so the phone strip does not change at boot. boot() lands
  // the anchor again (Router.route, the walk's activate).
  if (r && r.anchor && root.requestAnimationFrame) {
    var el = null, frames = 0;
    var look = function () {
      if (pre.touched || html.classList.contains('booted') || ++frames > 3600) return;
      if (!el) {
        el = document.getElementById(r.anchor);
        if (el && !el.closest('.view[data-view="stack"], .view[data-view="walk"]')) return;
        // every chapter above the anchor takes its real height now (styles.css .cv-open; app.js Sizes lets them go after boot):
        // left at its estimate, one would take it later, as it came near the window, and move everything the reader sees
        var ch = el && el.closest('article.chapter'), up = ch && ch.previousElementSibling;
        for (; up; up = up.previousElementSibling) if (up.matches && up.matches('article.chapter')) up.classList.add('cv-open');
      }
      if (el) {
        var off = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
        if (Math.abs(off) > 2) { // not yet where it lands, or moved since
          var sb = html.style.scrollBehavior; html.style.scrollBehavior = 'auto'; // html scrolls smoothly; this is a jump
          root.scrollTo(0, Math.max(0, Math.round(root.pageYOffset + off))); html.style.scrollBehavior = sb;
        }
        var top = document.querySelector('.to-top'), box = r.view === 'stack' ? document.getElementById('contents') : null;
        if (top) top.setAttribute('data-show', (box ? box.getBoundingClientRect().bottom < 0 : root.pageYOffset > root.innerHeight * 0.8) ? '1' : '0');
      }
      root.requestAnimationFrame(look);
    };
    root.requestAnimationFrame(look);
  }
})(this);
