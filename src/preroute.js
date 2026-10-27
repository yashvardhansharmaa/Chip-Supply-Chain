/* The route before boot. build/build.js inlines this file into <head> (the PREROUTE placeholder in src/template.html), where it runs
   before any of the body has arrived. It reads the address by the router's own rules (src/app.js Router.route) and sets
   <html data-route="walk|stack|landscape|suppliers|controls|glossary"> (and data-sub="exposure" for the China revenue
   panel, data-sub="country" for the Suppliers By country tab). The template's CSS then shows only that view while the rest of the file streams in, so the view a reader asked
   for paints as soon as its own markup has arrived. boot() takes over with the router's hidden attributes and html.booted.
   On The Chain it also sets <html data-chain>: "contents" for #/chain, or the chapter that holds the anchor, read from the
   anchor's id (every id in a chapter starts with the chapter's id, or with fig-, cite- or cite-fig- and the chapter's id),
   so one chapter paints and no other; an id it cannot place waits as "pending" until its element has arrived.
   The build runs route() over every id on the page and warns when one would open a view, or a chapter, other than the one it sits in.
   An address of a chapter merged away (build/retired-chapters.js: the old chapter's id, its sections and figures, and its step
   of the walk) is swapped for the merged chapter's nearest one before anything else reads it (moved()),
   and the router swaps a link followed later the same way (src/app.js Router.route, through CP_PRE.moved). */
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
  var CHAPTERS = []; // the chapters of The Chain, in order: build/build.js writes their ids here
  var MOVED = {}; // the addresses of a chapter merged away: build/build.js writes { chapters: { old: new }, anchors: { old: new } } here
  // the chapter an id in The Chain belongs to, by its prefix (the longest chapter id that fits wins), or '' if none fits
  function chapterOf(id, list) {
    var best = '';
    for (var i = 0; i < list.length; i++) {
      var c = list[i], rest = null;
      if (id === c) return c;
      [c + '--', 'fig-' + c + '-', 'cite-' + c, 'cite-fig-' + c + '-'].forEach(function (p) { if (rest === null && id.indexOf(p) === 0 && (p.slice(-1) === '-' || id.length === p.length)) rest = p; });
      if (rest !== null && c.length > best.length) best = c;
    }
    return best;
  }
  // the address that replaces a merged chapter's (a step of the walk, a mapped anchor, or else the merged chapter itself), or ''
  function moved(hash, map) {
    map = map || MOVED;
    var chs = map.chapters || {}, an = map.anchors || {}, h = String(hash || ''), m = /^#\/walk\/([^?#\/]+)$/.exec(h), id, old;
    if (m) return chs[m[1]] ? '#/walk/' + chs[m[1]] : '';
    if (h.charAt(0) !== '#' || h.charAt(1) === '/') return '';
    id = h.slice(1); try { id = decodeURIComponent(id); } catch (e) { }
    if (Object.prototype.hasOwnProperty.call(an, id)) return '#' + an[id];
    for (old in chs) if (Object.prototype.hasOwnProperty.call(chs, old) && chapterOf(id, [old]) === old) return '#' + chs[old];
    return '';
  }
  function route(hash, search, list) {
    list = list || CHAPTERS;
    var h = hash || '#/', m = h.match(/^#\/([a-z-]+)/), bare = h.replace(/^#/, ''), view, sub = '';
    if (bare === '' || bare === '/' || bare.indexOf('/?') === 0) { // home; the QA aid ?only=<chapter> with no route opens that chapter
      var only = /[?&]only=([^&#]*)/.exec(search || '');
      view = only && (bare === '' || bare === '/') && own(only[1]) === 'stack' ? 'stack' : 'walk';
      if (view === 'stack') return { view: view, sub: sub, anchor: only[1], chapter: chapterOf(only[1], list) };
    } else if (m) {
      view = NAMED[m[1]] || 'walk';
      if (m[1] === 'exposure') sub = 'exposure';
      else if (view === 'suppliers' && /[?&]tab=country\b/.test(h)) sub = 'country'; // the By country tab (Suppliers.activate)
      if (view === 'suppliers' && /[?&]country=[A-Za-z]{2}\b/.test(h)) return { view: view, sub: sub, pick: true }; // a country on the atlas (summary-a.js)
      if (view === 'walk' && /^#\/walk\/[^?#\/]+$/.test(h)) return { view: view, sub: sub, anchor: h.slice(1) }; // a step of the walk
      if (m[1] === 'geopolitics' && view === 'stack') return { view: view, sub: sub, anchor: 'geopolitics', chapter: chapterOf('geopolitics', list) }; // the essay's own route
      if (view === 'stack') return { view: view, sub: sub, chapter: 'contents' }; // #/chain: the contents
    } else {
      var id = bare; try { id = decodeURIComponent(id); } catch (e) { } // "#%" is not valid escaping; take it as typed, as the router does
      view = own(id);
      if (view === 'stack') return { view: view, sub: sub, anchor: id, chapter: chapterOf(id, list) };
    }
    return { view: view, sub: sub };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { route: route, chapterOf: chapterOf, moved: moved }; return; }

  var html = document.documentElement, pre = root.CP_PRE = { view: null, touched: false, moved: moved }, r = null;
  try {
    var mv = moved(location.hash); // a merged chapter's address: the merged chapter's own, in place, before it is read
    if (mv && root.history && history.replaceState) history.replaceState(history.state, '', location.pathname + location.search + mv);
    r = route(location.hash, location.search);
    pre.view = r.view; html.setAttribute('data-route', r.view);
    if (r.sub) html.setAttribute('data-sub', r.sub);
    if (r.view === 'stack') html.setAttribute('data-chain', r.chapter || 'pending');
    if (r.pick) html.setAttribute('data-pick', '1');
  } catch (e) { html.setAttribute('data-route', 'pending'); } // unsure: every view waits for boot, as before
  // a reader who scrolls or taps before boot keeps their place: boot() then leaves the scroll alone (Router.route)
  var mark = function () { pre.touched = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { root.addEventListener(t, mark, { passive: true, capture: true, once: true }); });
  // An anchor in The Chain (#lithography, #lithography--high-na-euv) or a step of the walk (#/walk/lithography): the browser
  // does not scroll to it while the page is still arriving, so this does, in the first frame after the element has been
  // parsed, and puts it back if the page moves it before boot (each element's scroll-margin-top keeps it clear of the
  // masthead). An anchor whose chapter its id did not tell shows that chapter now. Back to top shows as Sections.update
  // would show it, so the phone strip does not change at boot. boot() lands the anchor again (Router.route, the walk's activate).
  if (r && r.anchor && root.requestAnimationFrame) {
    var el = null, frames = 0;
    var look = function () {
      if (pre.touched || html.classList.contains('booted') || ++frames > 3600) return;
      if (!el) {
        el = document.getElementById(r.anchor);
        if (el && !el.closest('.view[data-view="stack"], .view[data-view="walk"]')) return;
        if (el && r.view === 'stack' && !r.chapter) { var ch = el.closest('article.chapter'); html.setAttribute('data-chain', ch ? ch.id : 'contents'); }
      }
      if (el) {
        var off = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
        if (Math.abs(off) > 2) { // not yet where it lands, or moved since
          var sb = html.style.scrollBehavior; html.style.scrollBehavior = 'auto'; // html scrolls smoothly; this is a jump
          root.scrollTo(0, Math.max(0, Math.round(root.pageYOffset + off))); html.style.scrollBehavior = sb;
        }
        var top = document.querySelector('.to-top'), box = r.view === 'stack' && html.getAttribute('data-chain') === 'contents' ? document.getElementById('contents') : null;
        if (top) top.setAttribute('data-show', (box ? box.getBoundingClientRect().bottom < 0 : root.pageYOffset > root.innerHeight * 0.8) ? '1' : '0');
      }
      root.requestAnimationFrame(look);
    };
    root.requestAnimationFrame(look);
  }
})(this);
