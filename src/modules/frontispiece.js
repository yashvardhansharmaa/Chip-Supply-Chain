/* The home page: the frontispiece, the owner's "V" (home round two, 22 and 23 Nov 2026; built into the site on 23 Nov 2026
   from the approved mock, dist/mock/home2/frontispiece/ on the plates-polish worktree, which patched the built home).
   The home's walk view is the drawing alone (owner, 22 Nov 2026). build/modules/walk.js writes what it is made from into the
   hero (#wk-hero.fx-hero): the title, the subtitle, the link to the Introduction, the chain at a glance (one row per stage:
   its number, name, specimen, chapter link, firms, chokepoint mark and the one sentence the lit row shows), the two chapters
   across the chain and the key. Without scripts that markup is the page. With them, this draws the sheet over it.
   The drawing is built the first time the home's walk view shows (an address such as /#/suppliers opens another view of the
   home page, and builds nothing until the reader comes to the walk), and laid out again whenever its width changes.
   The hero is one engineering drawing of the whole chain. The fourteen stages' objects, drawn with the plate kit, stand on
   one shared ground at one true isometric angle, joined by one process line on that ground. The line carries only links the
   chapters state (the list in the header of mock/home2/network/_src/network.js):
     design -> fab       ch 1 "Engineers hand the finished layout to the foundry, a step called tape-out."
     wafers, chemicals, scanners, masks, deposition and etch, inspection -> fab   chs 2 to 7
     fab -> wafer sort   ch 12 "Wafer sort. Thousands of needles land on each die while it is still on the wafer"
     dies, memory, substrate -> package   the parts list of ch 10 (logic dies, HBM stacks, substrate)
     package -> final test   ch 12 "Final test. The tester checks the packaged part again"
     test -> systems     ch 13 "A tested package is still a single chip."
     systems -> data centers   ch 14 "Racks like that need a building designed around the power they draw"
   (Stated but left out to keep the line in one order: design -> masks, ch 1 and 5.)
   The inputs meet the trunk in their numbers' order and the line thickens as each flow joins, with an arrowhead at every
   join. Stage 12 stands twice: its probe card between the fab and the package (wafer sort), and a small station on the line
   after the package (final test). Both link to its one chapter. Final test has no balloon of its own: its label reads
   "12 · Final test" in the lighter label style and its leader leaves from the label's edge nearest the station (the reader
   test, 24 Nov 2026).
   The two chapters that run across the chain, 15 (The Economics of AI Chips) and 16 (Who Controls the Chain), are drawn too
   (home option A, "Coda", chosen by the owner on 24 Nov 2026 from dist/mock/home3/a/): their chapters' own plates (the cost
   column, plates/wafer-cost.js, and the globe, plates/globe.js), smaller than the stages, in the top-right corner past the
   rack, under the "Across the chain" label and its thin rule, each with a numbered balloon. On a phone they stand after the
   rack, side by side under the rule. No process line reaches them: they span all fourteen stages, and lit, either lights the
   whole line. Each behaves as a stage does (lit row, click, drag to turn); the lit row gives its title and its chapter's
   one-line summary. The globe keeps its own view (from over the western Pacific, every pin in sight); the cost column stands
   at the drawing's one isometric angle.
   Each object carries a numbered balloon and a short name; the chokepoints (the stages the chapters rate Extreme, as many as the data has)
   have a solid balloon, the others a plain one, and the key under the drawing says what solid means. Pointing at an object or its balloon, or tabbing to it, lifts it off its
   pad (its footprint stays, dashed), opens its spread as far as its neighbours allow and gives it back its colours, with
   one slow turn the first time; the lines into and out of it light in ink and the row of facts shows its meter, rating,
   firms and chapter one-liner. A click opens the chapter. Drag sideways, or Left and Right, to turn it; Up and Down walk
   the stages. On a phone the drawing is one trunk down the page with the objects alternating sides, and the object at the
   reading line opens as it passes (on a tap only, under reduced motion).

   The owner's three open choices, settled on 23 Nov 2026 as built: the phone's lit sentence at 14.5 px, the wide lit sentence
   at the lit row's full width (no 530 px cap), the phone's tabs 4 px a side (src/styles.css). The mock's switches for them went.
   QA aids in the address: ?shot=1 skips the entrance, ?pick=N lights stage N, ?debug=1 draws the boxes, ?slow=N stretches the
   motion, ?labels=full|num and ?nudge=dx,dy,dx,dy try the other label densities and lit-row places tried in the mock. */
(function () {
  'use strict';
  var html = document.documentElement, P = window.PLATE;
  if (!P) return;
  var hero = document.getElementById('wk-hero');
  if (!hero || !hero.classList.contains('fx-hero')) return; // (the home's hero alone: the Introduction's walk keeps its own)

  /* the helpers it shares with the mock's (dist/mock/home-plates/_src/common.js, trimmed to what it uses) */
  var MK = {};
  MK.reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var wideMQ = window.matchMedia ? matchMedia('(min-width: 900px)') : null;
  MK.narrow = function () { return wideMQ ? !wideMQ.matches : window.innerWidth < 900; };
  MK.dark = function () { return html.getAttribute('data-theme') === 'dark'; };
  MK.$ = function (s, c) { return (c || document).querySelector(s); };
  MK.$$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  MK.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var themeFns = [];
  MK.onTheme = function (fn) { themeFns.push(fn); };
  if (window.MutationObserver) new MutationObserver(function () { themeFns.forEach(function (f) { f(MK.dark()); }); }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  MK.sbw = function () { var f = function () { html.style.setProperty('--mk-sbw', Math.max(0, window.innerWidth - document.documentElement.clientWidth) + 'px'); }; f(); window.addEventListener('resize', f); };
  MK.settle = function (t) { t = Math.max(0, Math.min(1, t)); var c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  MK.easeOut = function (t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); };
  MK.easeInOut = function (t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  // the drawing is built once the home's walk view shows: at once on the home's own address (src/preroute.js names the route
  // before the body arrives), or when the router first shows the view
  var wantNow = function () { return (html.getAttribute('data-view') || html.getAttribute('data-route')) === 'walk'; };
  if (wantNow()) start();
  else if (window.MutationObserver) { var mo = new MutationObserver(function () { if (wantNow()) { mo.disconnect(); start(); } }); mo.observe(html, { attributes: true, attributeFilter: ['data-view', 'data-route'] }); }
  function start() {
    html.classList.add('fx');
    MK.sbw();
    var DEBUG = /[?&]debug=1/.test(location.search), SHOT = /[?&]shot=1/.test(location.search);
    var PRE = (location.search.match(/[?&]pick=(\d+)/) || [])[1];
    var SLOW = +((location.search.match(/[?&]slow=(\d+)/) || [])[1] || 1); // (stretches the motion, for the shots' frame strips)
    /* the calm pass (owner, 22 Nov 2026: "minimize the text"): at rest each balloon carries a short name, faithful to its
       chapter's name, and the full name, rating, firms and one sentence come with the lit row. ?labels=full or ?labels=num shows
       the other densities tried (the full names, or the numbers alone with the name on point) */
    var LAB = (location.search.match(/[?&]labels=(full|short|num)/) || [])[1] || 'short';
    var SHORT = { '01': 'Design', '02': 'Wafers', '03': 'Chemicals', '04': 'Lithography', '05': 'Masks', '06': 'Deposition and etch', '07': 'Inspection',
      '08': 'Fabs', '09': 'Memory', '10': 'Packaging', '11': 'Substrates', '12': 'Test', '13': 'Systems', '14': 'Data centers',
      // (the two across the chain, faithful to their chapters' titles, "The Economics of AI Chips" and "Who Controls the Chain")
      '15': 'Economics of AI chips', '16': 'Who controls the chain' };
    // the chapters' one-liners keep straight apostrophes in their source: set them as the page's typography does
    var smart = function (s) { return String(s || '').replace(/(\w)'(\w)/g, '$1’$2').replace(/'/g, '’'); };

    /* ---------------- the stages, as the hero's rows have them (build/modules/walk.js GLANCE_HOME) ----------------
       A chokepoint's row carries data-cpk (the stages the chapters rate Extreme, as many as the data has); level 4 marks it here,
       as the mock's rows carried the band's level */
    var rows = MK.$$('.wk-gl-list > li', hero).map(function (li, i) {
      var a = MK.$('.wk-gl-a', li), href = a ? a.getAttribute('href') || '' : '', id = href.replace(/^(\.\.\/)+/, '').replace(/^\/+|\/+$/g, '').split('/').pop();
      return { i: i, id: id, n: li.getAttribute('data-n'), t: li.getAttribute('data-t'), spec: li.getAttribute('data-spec'), href: href,
        level: li.getAttribute('data-cpk') === '1' ? 4 : 0, firms: MK.$$('.wk-gl-lead .f', li).map(function (f) { return f.textContent; }),
        line: smart(li.getAttribute('data-line') || '') };
    });
    if (rows.length !== 14 || rows.some(function (r) { return !r.n || !r.spec; })) return;
    /* the two chapters across the chain follow the fourteen stages, from the hero's own links to them (build/modules/walk.js
       ACROSS_HOME: number, title, specimen and one-line summary): no rating, no firms, their whole one-line summary */
    MK.$$('.fx-across .fx-ac[data-n]', hero).forEach(function (a) {
      var href = a.getAttribute('href') || '', id = href.replace(/^(\.\.\/)+/, '').replace(/^\/+|\/+$/g, '').split('/').pop();
      rows.push({ i: rows.length, id: id, n: a.getAttribute('data-n'), t: a.getAttribute('data-t'), spec: a.getAttribute('data-spec'), href: href,
        level: 0, firms: [], line: smart(a.getAttribute('data-line') || ''), across: true });
    });
    if (rows.length !== 16 || rows[14].n !== '15' || rows[15].n !== '16' || rows.some(function (r) { return !r.spec; })) return;
    var isX = function (r) { return !!(r && r.across); };
    var byN = {}; rows.forEach(function (r) { byN[r.n] = r; });
    // the callouts in the chapters' order, final test standing after wafer sort as stage 12's second place on the line
    var cos = rows.map(function (r) { return { key: r.n, ri: r.i, ft: false }; });
    cos.splice(12, 0, { key: '12f', ri: 11, ft: true });

    /* ---------------- the sheet ---------------- */
    var title = MK.$('.wk-title', hero), dek = MK.$('.wk-dek', hero), meta = MK.$('.wk-meta', hero), glp = MK.$('.wk-gl-p', hero);
    var sheet = document.createElement('section');
    sheet.className = 'fx-sheet'; sheet.setAttribute('aria-label', 'The chain, drawn');
    sheet.innerHTML = '<div class="fx-in">'
      + '<div class="fx-head"></div>'
      + '<svg class="fx-ground" aria-hidden="true" focusable="false"></svg>'
      + '<div class="fx-objs" aria-hidden="true"></div>'
      + '<svg class="fx-leads" aria-hidden="true" focusable="false"></svg>'
      + '<ol class="fx-cos" aria-label="The fourteen stages and the two chapters across the chain"></ol>'
      + '<div class="fx-facts"><div class="fx-f fx-f0"></div><div class="fx-f fx-f1" hidden></div></div>'
      + '<p class="fx-note"></p>'
      + '</div>';
    hero.parentNode.insertBefore(sheet, hero);
    var IN = MK.$('.fx-in', sheet), HEAD = MK.$('.fx-head', sheet), GROUND = MK.$('.fx-ground', sheet), OBJS = MK.$('.fx-objs', sheet),
      LEADS = MK.$('.fx-leads', sheet), COS = MK.$('.fx-cos', sheet), FACTS = MK.$('.fx-facts', sheet), F0 = MK.$('.fx-f0', sheet), F1 = MK.$('.fx-f1', sheet),
      NOTE = MK.$('.fx-note', sheet), ACROSS = MK.$('.fx-across', hero), KEY = MK.$('.fx-key', hero);
    // the two chapters across the chain and the key are the hero's own (build/modules/walk.js): they join the sheet
    if (!ACROSS) { ACROSS = document.createElement('nav'); ACROSS.className = 'fx-across'; }
    if (!KEY) { KEY = document.createElement('p'); KEY.className = 'fx-key'; }
    KEY.hidden = false; IN.appendChild(KEY); IN.appendChild(ACROSS);
    // the corner's two links give way to the drawn chapters, whose balloons link to them; the label stays, with its thin rule
    ACROSS.innerHTML = '<span class="label fx-across-k">Across the chain</span>'; ACROSS.setAttribute('aria-hidden', 'true'); ACROSS.removeAttribute('aria-label');
    ACROSS.className = 'fx-across fx-across-lab';
    // the title and its one-line intro; the word count (the length of the walk) stays with the walk on the Introduction's page.
    // The home is the drawing alone; the walk is on the Introduction's page, one quiet link under the intro line
    var intro = MK.$('.fx-intro', hero);
    HEAD.appendChild(title); HEAD.appendChild(dek); if (intro) HEAD.appendChild(intro); void meta;
    sheet.classList.add('is-' + LAB);
    // the chain at a glance: its sentence and the key to the balloons are the row of facts at rest, with the note on scale
    var glyph = function (x) { return '<i class="fx-kb' + (x ? ' is-x' : '') + '" aria-hidden="true"></i>'; };
    /* the owner's rating (22 Nov 2026): "keep everything as unlabeled and the seven as choke points". The seven Extreme stages
       are chokepoints and carry the one mark, a solid balloon; the others carry a plain numbered balloon and no rating word. The
       key gives the count and the glossary's definition of Extreme in the site's own short form (build/build.js chainKey) */
    // one sentence does the headline and the key: the solid balloon, the count, and what a chokepoint is, in the chapter cards'
    // own words, as the glance's sentence has them (build/modules/walk.js KEY_HOME counts the data's chokepoints)
    F0.innerHTML = ''; void glp;
    html.classList.add('fx-on');

    /* ---------------- the layouts ----------------
       Design units: px of a sheet W wide, scaled to the sheet's real width. Anchors are where each object's base stands on the
       ground. P runs down to the right, Q up to the right (the ground's two axes, seen in true isometric); the line runs only
       along them, so it lies on the ground. A layout gives the main line (chain: objects, junctions 'jNN', the final test 'ft'
       and plain bends, in the order the work flows) and the feeders (each from its object to its junction). */
    var C30 = Math.cos(Math.PI / 6), PD = [C30, 0.5], QD = [C30, -0.5];
    function mv(pt, ax, d) { var a = ax === 'P' ? PD : QD; return [pt[0] + a[0] * d, pt[1] + a[1] * d]; }
    function elbow(a, b, first) {
      var dx = b[0] - a[0], dy = b[1] - a[1], p = (dx / C30 + dy / 0.5) / 2, q = (dx / C30 - dy / 0.5) / 2;
      return first === 'P' ? mv(a, 'P', p) : mv(a, 'Q', q);
    }

    /* v5 (owner, 23 Nov 2026: "a very tiny, slight lower right"): the lit row of facts keeps its place under the back end and is
       nudged a little lower and to the right, so it no longer reads as touching the drawing. Its right edge stays on the
       composition's edge (the edge "Across the chain" and the masthead keep), so the shift right takes that much off its width.
       Design units, scaled with the sheet (S): wide 24 right and 24 down (1440: 24 px; 1920: 30 px; 1280: 21 px); the middle
       widths 16 right and 8 down (1024: 13 and 7 px), where the key's line runs under the row's left end and holds it up. h is
       the tallest row (a three-line sentence) the page's words keep clear of */
    var FX_NUDGE = { wide: [24, 24], mid: [16, 8] }, nq = (location.search.match(/[?&]nudge=([\d,]+)/) || [])[1];
    if (nq) { nq = nq.split(',').map(Number); FX_NUDGE = { wide: [nq[0] || 0, nq[1] || 0], mid: [nq[2] || 0, nq[3] || 0] }; } // (?nudge=0 is v4's place; ?nudge=dx,dy,dx,dy tries others)
    // (the callouts and the lit objects keep clear of the row's old place too, so the drawing and its callouts stand as in v4)
    function nudge(f, d) { return { x: f.x + d[0], y: f.y + d[1], w: f.w - d[0], h: f.h, x0: f.x, y0: f.y }; }

    // the wide sheet: a V. The inputs' trunk runs down P from the design to the fab at the foot of the V, the inputs meeting it in
    // their numbers' order from either side; the back end climbs Q from the fab to the rack
    function wideLayout() {
      var A = {}, J = {}, feeds = [];
      var T0 = [90, 336], tr = function (t) { return mv(T0, 'P', t); };
      var feed = function (n, t, side, d) { J[n] = tr(t); A[n] = mv(J[n], 'Q', side * d); feeds.push({ n: n, pts: [A[n], J[n]] }); };
      // (24 Nov 2026: plate 01 became a wafer with its die lifted over it, and its wafer touched the ingot; the design moves 11
      // units up the trunk and the ingot's junction 11 down, so the two stand about 10 px apart at 1440, as the old die did)
      A['01'] = tr(-11);
      feed('02', 176, -1, 140); feed('03', 292, -1, 165); feed('04', 348, 1, 290); feed('05', 412, -1, 168); feed('06', 486, 1, 146); feed('07', 562, -1, 150);
      A['08'] = tr(652);
      var B = function (u) { return mv(A['08'], 'Q', u); };
      A['12'] = B(186);
      J['09'] = B(286); A['09'] = mv(J['09'], 'P', -136); feeds.push({ n: '09', pts: [A['09'], J['09']] });
      J['11'] = B(312); A['11'] = mv(J['11'], 'P', 160); feeds.push({ n: '11', pts: [A['11'], J['11']] });
      A['10'] = B(372); A['12f'] = B(470); A['13'] = B(566); A['14'] = mv(B(658), 'P', 12);
      var chain = [['01', A['01']], ['j02', J['02']], ['j03', J['03']], ['j04', J['04']], ['j05', J['05']], ['j06', J['06']], ['j07', J['07']], ['08', A['08']],
        ['12', A['12']], ['j09', J['09']], ['j11', J['11']], ['10', A['10']], ['ft', A['12f']], ['13', A['13']], ['b1', elbow(A['13'], A['14'], 'Q')], ['14', A['14']]];
      return { W: 1312, H: 790, k: 0.92, A: A, chain: chain, feeds: feeds,
        size: { '01': { w: 114 }, '02': { h: 126 }, '03': { h: 124 }, '04': { w: 180 }, '05': { w: 104 }, '06': { h: 112 }, '07': { h: 150 },
          '08': { h: 150 }, '09': { h: 88 }, '10': { w: 134 }, '11': { w: 108 }, '12': { w: 100 }, '13': { w: 144 }, '14': { h: 222 } },
        co: { '01': ['ne', 'e'], '02': ['e', 'se', 'ne'], '03': ['w', 'sw', 'nw'], '04': ['nw', 'w', 'n'], '05': ['sw', 's', 'w'], '06': ['e', 'ne', 'se'], '07': ['sw', 'w', 's'],
          '08': ['s', 'sw', 'se'], '09': ['nw', 'n', 'w'], '10': ['ne', 'n', 'e'], '11': ['se', 'e', 's'], '12': ['se', 's', 'e'], '12f': ['e', 'ne', 'se'], '13': ['n', 'nw', 'ne'], '14': ['w', 'nw', 'sw'] },
        head: { x: 0, y: 0, w: 470 }, facts: nudge({ x: 852, y: 606, w: 460, h: 160 }, FX_NUDGE.wide), across: { x: 1312, y: 10 }, key: { x: 0, y: 790 } };
    }

    // the middle widths (900 to 1199 px): the same V drawn deeper and narrower, so the callouts keep their size against the drawing
    function midLayout() {
      var A = {}, J = {}, feeds = [];
      var T0 = [70, 318], tr = function (t) { return mv(T0, 'P', t); };
      var feed = function (n, t, side, d) { J[n] = tr(t); A[n] = mv(J[n], 'Q', side * d); feeds.push({ n: n, pts: [A[n], J[n]] }); };
      // (24 Nov 2026: the same nudge for the new plate 01, half as far: about 11 px clear at 1024)
      A['01'] = tr(-6);
      feed('02', 156, -1, 120); feed('03', 262, -1, 140); feed('04', 318, 1, 250); feed('05', 372, -1, 140); feed('06', 430, 1, 132); feed('07', 500, -1, 128);
      A['08'] = tr(580);
      var B = function (u) { return mv(A['08'], 'Q', u); };
      A['12'] = B(160);
      J['09'] = B(244); A['09'] = mv(J['09'], 'P', -128); feeds.push({ n: '09', pts: [A['09'], J['09']] });
      J['11'] = B(266); A['11'] = mv(J['11'], 'P', 138); feeds.push({ n: '11', pts: [A['11'], J['11']] });
      A['10'] = B(322); A['12f'] = B(394); A['13'] = B(474); A['14'] = mv(B(560), 'P', 10);
      var chain = [['01', A['01']], ['j02', J['02']], ['j03', J['03']], ['j04', J['04']], ['j05', J['05']], ['j06', J['06']], ['j07', J['07']], ['08', A['08']],
        ['12', A['12']], ['j09', J['09']], ['j11', J['11']], ['10', A['10']], ['ft', A['12f']], ['13', A['13']], ['b1', elbow(A['13'], A['14'], 'Q')], ['14', A['14']]];
      return { W: 1060, H: 800, k: 0.95, A: A, chain: chain, feeds: feeds, mid: true,
        size: { '01': { w: 96 }, '02': { h: 106 }, '03': { h: 104 }, '04': { w: 152 }, '05': { w: 88 }, '06': { h: 94 }, '07': { h: 126 },
          '08': { h: 128 }, '09': { h: 74 }, '10': { w: 112 }, '11': { w: 92 }, '12': { w: 86 }, '13': { w: 120 }, '14': { h: 188 } },
        co: { '01': ['ne', 'e'], '02': ['e', 'se', 'ne'], '03': ['w', 'sw', 'nw'], '04': ['nw', 'w', 'n'], '05': ['sw', 's', 'w'], '06': ['e', 'ne', 'se'], '07': ['sw', 'w', 's'],
          '08': ['s', 'sw', 'se'], '09': ['nw', 'n', 'w'], '10': ['ne', 'n', 'e'], '11': ['se', 'e', 's'], '12': ['e', 'se', 'ne'], '12f': ['se', 's', 'e'], '13': ['n', 'nw', 'ne'], '14': ['w', 'nw', 'sw'] },
        head: { x: 0, y: 0, w: 420 }, facts: nudge({ x: 650, y: 600, w: 410, h: 158 }, FX_NUDGE.mid), across: { x: 1060, y: 8 }, key: { x: 0, y: 800 } };
    }

    // a phone: one trunk down the page in a zigzag along the ground's two axes, a bend for every stage in its order; the inputs
    // stand on short feeders outside the bends, alternating sides, and the objects of the main line stand on it
    function narrowLayout(top) {
      var A = {}, J = {}, feeds = [], chain = [];
      var xl = 116, xr = 242, step = (xr - xl) / C30, y0 = top + 78, b = [xl, y0], left = true;
      // (two plain bends before the rack give its height room under the final test)
      var seq = ['01', 'j02', 'j03', 'j04', 'j05', 'j06', 'j07', '08', '12', 'j09', 'j11', '10', 'ft', '13', 'b1', 'b2', '14'];
      var spur = { '02': 58, '04': 60 };
      seq.forEach(function (id, k) {
        if (k) { b = left ? mv(b, 'P', step) : mv(b, 'Q', -step); left = !left; }
        chain.push([id, b]);
        if (id[0] === 'j') { var n = id.slice(1), d = spur[n] || 66; J[n] = b; A[n] = left ? mv(b, 'P', -d) : mv(b, 'Q', d); feeds.push({ n: n, pts: [A[n], b] }); }
        else if (id === 'ft') A['12f'] = b;
        else if (id[0] !== 'b') A[id] = b;
      });
      var co = {};
      seq.forEach(function (id, k) {
        if (id[0] === 'b') return;
        var l = k % 2 === 0, n = id[0] === 'j' ? id.slice(1) : id === 'ft' ? '12f' : id, isFeed = id[0] === 'j';
        co[n] = isFeed ? (l ? ['s', 'n', 'e'] : ['s', 'n', 'w']) : (l ? ['e', 'ne', 'se'] : ['w', 'nw', 'sw']);
      });
      return { W: 358, H: b[1] + 58, A: A, chain: chain, feeds: feeds, narrow: true,
        size: { '01': { w: 104 }, '02': { h: 100 }, '03': { h: 98 }, '04': { w: 116 }, '05': { w: 92 }, '06': { h: 92 }, '07': { h: 112 },
          '08': { h: 118 }, '09': { h: 84 }, '10': { w: 116 }, '11': { w: 100 }, '12': { w: 98 }, '13': { w: 122 }, '14': { h: 160 } },
        co: co, head: { x: 0, y: 0, w: 358 } };
    }

    /* the two chapters across the chain, set after the stages are placed (and squeezed), so every stage keeps its place: their
       anchors (the column's footprint, the globe's lowest point), their sizes, their callouts' sides and gaps (L.coFix) and the
       small label with its thin rule (L.across: x, y, which edge it keeps, and the rule's width). Design units are the layouts'
       own; the numbers were read off the home's boxes at 1440, 1280, 1024 and 390 px (the mock, dist/mock/home3/_src/fx3.js) */
    function across(L) {
      var A = L.A, fx = L.coFix = {}, H0 = L.H;
      var put = function (n, at, sz) { A[n] = at; L.size[n] = sz; L.co[n] = []; };
      // a callout set here: its side, its gap and whether its name takes two lines
      var fixCo = function (n, d, g, nw) { fx[n] = { d: d, g: g, nw: nw }; };
      if (L.narrow) {
        // a phone: past the rack (the trunk's foot, H0), a thin rule across the page, the label over it, then the two side by side
        var y = H0 + 4;
        L.across = { x: 179, y: y, align: 'c', rule: 358 };
        L.base = y + 124; put('15', [112, y + 124], { h: 82 }); put('16', [246, y + 124], { w: 84 });
        fixCo('15', 's', 10, 1); fixCo('16', 's', 10, 1);
        L.H = y + 190;
      } else if (L.mid) {
        // 900 to 1199 px: the rack's box is (992, 191) to (1088, 369); the head ends at 239
        L.across = { x: 1060, y: 0, align: 'r', rule: 250 }; L.base = 112;
        put('15', [852, 112], { h: 64 }); put('16', [1010, 112], { w: 62 });
        fixCo('15', 's', 10, 1); fixCo('16', 's', 10, 1);
      } else {
        // the wide sheet: past the rack (its box (1134, 182) to (1244, 386)), in the corner, smaller than the stages
        // (24 Nov 2026: plate 15 became a wide, shallow drawer that ran under 16's label; its cell is smaller, h 88 to 72, and
        // 38 units further left, so it stands 12 to 15 px clear of the label at 1280 and 1440)
        L.across = { x: 1312, y: 0, align: 'r', rule: 380 }; L.base = 132;
        put('15', [1030, 132], { h: 72 }); put('16', [1262, 132], { w: 82 });
        fixCo('15', 'w', 12, 1); fixCo('16', 'w', 12, 1);
      }
    }

    // a layout drawn smaller about the middle of its drawing, its words staying where they are: the drawing gets more air
    function squeeze(L, k) {
      var seen = [], pts = [];
      var add = function (p) { if (seen.indexOf(p) < 0) { seen.push(p); pts.push(p); } };
      Object.keys(L.A).forEach(function (n) { add(L.A[n]); });
      L.chain.forEach(function (c) { add(c[1]); }); L.feeds.forEach(function (f) { f.pts.forEach(add); });
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      pts.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
      var cx = (x0 + x1) / 2 + 30, cy = (y0 + y1) / 2;
      pts.forEach(function (p) { p[0] = cx + (p[0] - cx) * k; p[1] = cy + (p[1] - cy) * k; });
      Object.keys(L.size).forEach(function (n) { var z = L.size[n]; if (z.w) z.w *= k; if (z.h) z.h *= k; });
    }

    /* the line from a layout: its segments (with how many stages flow along each), the routes that light, the arrowheads */
    var isObj = function (id) { return /^\d\d$/.test(id); };
    function lineOf(L) {
      var segs = [], routes = [], c = 1, ch = L.chain;
      for (var k = 0; k < ch.length - 1; k++) {
        var a = ch[k], bb = ch[k + 1];
        // (the line thickens only where a flow joins it)
        if (k > 0 && a[0][0] === 'j') c += 1;
        segs.push({ a: a[0], b: bb[0], pts: [a[1], bb[1]], c: c, chain: k });
      }
      L.feeds.forEach(function (f) { segs.push({ a: f.n, b: 'j' + f.n, pts: f.pts, c: 1, feed: true }); });
      // the routes: from each object (or the final test) along the line to the next object or final test
      var stop = function (id) { return isObj(id) || id === 'ft'; };
      var walk = function (k0, pts0, from) {
        var pts = pts0.slice();
        for (var k = k0 + 1; k < ch.length; k++) { pts.push(ch[k][1]); if (stop(ch[k][0])) { routes.push({ a: from, b: ch[k][0], pts: pts }); return; } }
      };
      ch.forEach(function (n, k) { if (stop(n[0]) && k < ch.length - 1) walk(k, [n[1]], n[0]); });
      L.feeds.forEach(function (f) { var k = 0; for (; k < ch.length; k++) if (ch[k][0] === 'j' + f.n) break; walk(k, f.pts.slice(), f.n); });
      L.segs = segs; L.routes = routes;
    }

    /* ---------------- the objects ---------------- */
    // how far each object opens (a share of its chapter plate's spread); the room round it may cap it further (capGrowth)
    var CAP = { 'gas-cabinet': 0.42, 'rack': 0.36, 'boule-and-wafer': 0.8, 'gaa-transistor': 0.85, 'euv-scanner': 0.8, 'sem-column': 0.9, 'probe-card': 0.8 };
    var EXS = [1, 0.8, 0.6, 0.45, 0.3];
    var objs = rows.map(function (r) {
      var pl;
      try { pl = new P.Plate(r.spec, {}); } catch (e) { console.warn('plate failed', r.spec, e && e.message); return null; }
      pl.mode({ noLabels: true, noDims: true });
      var m = pl.m;
      // (the globe keeps its chapter's view, every pin in sight; every other object stands at the drawing's one isometric angle)
      if (r.spec !== 'globe') { m.elev = P.ISO.elev; m.yaw0 = P.ISO.yaw; }
      var rest = m.spec.rest == null ? 1 : m.spec.rest, minY = 0, cap = CAP[r.spec] == null ? 1 : CAP[r.spec];
      m.parts.forEach(function (p) { minY = Math.min(minY, p.ex[1] * rest); });
      // the spread at pl._ex (0 closed, 1 open); parts that open downward on the chapter's plate open from the ground up here
      pl.offsets = function () {
        var n = m.parts.length, o = new Array(n), a = new Array(n), e = this._ex * cap;
        for (var i = 0; i < n; i++) { var ex = m.parts[i].ex; o[i] = [ex[0] * rest * e, (ex[1] * rest - minY) * e, ex[2] * rest * e]; a[i] = 1; }
        return { o: o, a: a };
      };
      var V = m.V, lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (var i = 0; i < V.length; i += 3) for (var k = 0; k < 3; k++) { if (V[i + k] < lo[k]) lo[k] = V[i + k]; if (V[i + k] > hi[k]) hi[k] = V[i + k]; }
      var ext = {};
      pl._ex = 0; pl.ext = null; var e0 = pl.extent();
      EXS.forEach(function (x) { pl._ex = x; pl.ext = null; ext[x] = pl.extent(); });
      pl._ex = 0; pl.ext = null;
      var R0 = P.viewM(m.yaw0, m.elev), base = [(lo[0] + hi[0]) / 2, lo[1], (lo[2] + hi[2]) / 2];
      var bs = [R0[0] * base[0] + R0[1] * base[1] + R0[2] * base[2], R0[3] * base[0] + R0[4] * base[1] + R0[5] * base[2]];
      // (a globe has no footprint: it stands on the lowest point of its disc)
      if (r.spec === 'globe') bs = [(e0.minx + e0.maxx) / 2, e0.miny];
      return { r: r, pl: pl, e0: e0, ext: ext, bs: bs, lo: lo, hi: hi, cv: null, ctx: null, exCap: 1, Gi: 1,
        ex: 0, exFrom: 0, exTo: 0, t0: 0, lift: 0, tint: 0, yaw: 0, rawYaw: 0, cueYaw: 0, back: null, cue: null, cued: false, pick: null, box: null };
    });
    if (objs.some(function (o) { return !o; })) return;
    var objOf = function (n) { return objs[byN[n].i]; };

    /* ---------------- colours ---------------- */
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    // at rest an object keeps to ink and grey: its accents come back as it opens (tint 0 to 1)
    function palOf(o) {
      var pal = P.palette(html, o.pl.m.spec, MK.dark(), false), g = mix(pal.bg, pal.ink, MK.dark() ? 0.62 : 0.5), t = o.tint;
      var p = {}; for (var k in pal) p[k] = pal[k];
      p.acc = mix(g, pal.acc, t); p.acc2 = mix(g, pal.acc2, t);
      return p;
    }

    /* ---------------- geometry ---------------- */
    var L = null, S = 1, narrow = MK.narrow(), dpr = Math.min(window.devicePixelRatio || 1, 2), hard = [], OX = 0, XR = 0;
    function layout() {
      if (!sheet.clientWidth) return; // (the home's walk view is hidden: another view of the home page shows; laid out once it shows)
      narrow = MK.narrow();
      var avail = sheet.clientWidth, mid = !narrow && window.innerWidth < 1200;
      sheet.classList.toggle('is-narrow', narrow); sheet.classList.toggle('is-mid', mid);
      // on a phone the row of facts rides at the foot of the screen while the drawing is on it; the note and the two chapters
      // across the chain follow the drawing
      if (narrow) { sheet.appendChild(FACTS); IN.appendChild(ACROSS); IN.appendChild(NOTE); HEAD.appendChild(KEY); }
      else { IN.appendChild(FACTS); IN.appendChild(ACROSS); IN.appendChild(NOTE); IN.appendChild(KEY); }
      if (narrow) { HEAD.style.width = avail + 'px'; L = narrowLayout(HEAD.offsetHeight * 358 / avail); }
      else L = mid ? midLayout() : wideLayout();
      if (L.k) squeeze(L, L.k);
      across(L);
      lineOf(L);
      // (src/template.html's pre-boot style repeats this scale as --fx-u, and the head's place and sizes, so the title, its line
      // and the Introduction link show before the drawing in the place the head gives them: a change here goes there too)
      S = avail / L.W;
      if (!narrow) {
        // the whole drawing holds the first screen: it shrinks to the window's height below the masthead (design review, 23 Nov
        // 2026: with the same 28 px of air under the key as over the title, the sheet's top margin; it had 18 at 1440 x 900)
        var mh = parseFloat(getComputedStyle(html).getPropertyValue('--masthead')) || 64, vh = window.innerHeight - mh - 56;
        S = Math.min(S, Math.max(mid ? 0.8 : 0.62, vh / L.H));
      }
      /* (design review) a sheet held to the window's height is narrower than the masthead (171 px at 1920 x 1080, 146 at
         1536 x 864, 53 at 1024 x 768): the drawing stands in the middle of the spare width, the title and the key keep the
         masthead's left edge, and Across the chain and the lit row's right end keep its right edge, as at 1440 x 900 */
      var Wd = Math.round(L.W * S), spare = narrow ? 0 : Math.max(0, avail - Wd);
      OX = Math.round(spare / 2); XR = spare - OX;
      IN.style.width = Wd + 'px'; IN.style.height = Math.round(L.H * S) + 'px'; IN.style.marginLeft = OX ? OX + 'px' : '';
      sheet.style.setProperty('--fx-s', S.toFixed(4));
      place();
      // the two across the chain stand on one baseline (L.base): each drawing's foot is brought to it, and the sheet placed again
      if (L.base) {
        var moved = false;
        objs.forEach(function (o) { if (!isX(o.r)) return; var dy = o.box.y1 / S - L.base; if (Math.abs(dy) > 0.5) { L.A[o.r.n][1] -= dy; moved = true; } });
        if (moved) place();
      }
    }
    function px(v) { return v * S; }
    var LIFT = function () { return 12 * Math.max(0.7, S); };

    function place() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var lift = 16;
      objs.forEach(function (o) {
        var n = o.r.n, sz = L.size[n] || { w: 120 }, e0 = o.e0, e1 = o.ext[1];
        var s = Math.min(sz.w ? sz.w / (e0.maxx - e0.minx) : Infinity, sz.h ? sz.h / (e0.maxy - e0.miny) : Infinity) * S;
        var U = { minx: Math.min(e0.minx, e1.minx), maxx: Math.max(e0.maxx, e1.maxx), miny: Math.min(e0.miny, e1.miny), maxy: Math.max(e0.maxy, e1.maxy) };
        // the lit object comes forward as it opens, by at most GMAX; its canvas holds the open spread at that size, round its base
        var G = narrow ? 1.18 : 1.24, sG = s * G, B = o.bs, turnPad = 0.16 * sG * (U.maxx - U.minx);
        var w = Math.ceil(sG * (U.maxx - U.minx) + 2 * turnPad), h = Math.ceil(sG * (U.maxy - U.miny) + lift + 1.5 * turnPad);
        var bx = turnPad + sG * (B[0] - U.minx), by = lift + 0.5 * turnPad + sG * (U.maxy - B[1]);
        var a = L.A[n], ax = px(a[0]), ay = px(a[1]);
        o.s = s; o.Gmax = G; o.Gi = G; o.exCap = 1; o.w = w; o.h = h; o.bx = bx; o.by = by; o.left = ax - bx; o.top = ay - by; o.ax = ax; o.ay = ay;
        o.fit = { s: s, cx: bx - s * B[0], cy: by + s * B[1], e: U, rooms: { l: 0, r: 0, t: 0, b: 0 } };
        if (!o.cv) { o.cv = document.createElement('canvas'); o.cv.className = 'fx-o'; o.cv.setAttribute('data-n', n); OBJS.appendChild(o.cv); o.ctx = o.cv.getContext('2d'); }
        o.cv.width = Math.max(1, Math.round(w * dpr)); o.cv.height = Math.max(1, Math.round(h * dpr));
        o.cv.style.width = w + 'px'; o.cv.style.height = h + 'px'; o.cv.style.left = o.left.toFixed(1) + 'px'; o.cv.style.top = o.top.toFixed(1) + 'px';
        var k = 0.8165 * s;
        o.pad = { hp: (o.hi[0] - o.lo[0]) / 2 * k, hq: (o.hi[2] - o.lo[2]) / 2 * k };
        o.box = boxAt(o, e0, 1, 0);
        o.obox = boxAt(o, U, G, LIFT());
      });
      objs.slice().sort(function (a, b) { return a.ay - b.ay; }).forEach(function (o, i) { o.z = i + 1; o.cv.style.zIndex = o.z; });
      placeText();
      drawGround();
      objs.forEach(function (o) { paint(o, true); });
      drawCallouts();
      capGrowth();
      // an object already lit is drawn again within its caps
      objs.forEach(function (o) { if (o.ex || o.lift) paint(o, !o.moving); });
      marks();
    }
    // a drawing's box on the sheet for a view extent E at growth G, raised by `lift`
    function boxAt(o, E, G, lift) {
      var s = o.s * G, B = o.bs;
      return { x0: o.ax + s * (E.minx - B[0]), x1: o.ax + s * (E.maxx - B[0]), y0: o.ay - s * (E.maxy - B[1]) - lift, y1: o.ay - s * (E.miny - B[1]) - lift * 0 };
    }

    /* ---------------- painting ---------------- */
    function paint(o, pick) {
      var ctx = o.ctx, w = o.w, h = o.h, pl = o.pl;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      pl._ex = o.ex * o.exCap;
      var g = new P.CanvasG(ctx, dpr), sc = o.s * (1 + (o.Gi - 1) * o.lift);
      o.fit.s = sc; o.fit.cx = o.bx - sc * o.bs[0]; o.fit.cy = o.by + sc * o.bs[1];
      pl.paint({ k: 1, w: w, h: h, g: g, pal: palOf(o), fit: o.fit, noLabels: true, noDims: true, dyaw: o.yaw + o.cueYaw, delev: 0, labA: 1, pick: !!pick, penW: 470 * Math.max(0.85, Math.min(1.25, S)) });
      // (the globe's disc is pointed at as one face, so a pointer between its pins still finds it)
      if (pick) { o.pick = pl._pick ? pl._pick.slice() : null; if (o.pick && pl._globe) o.pick.push({ pts: disc(pl._globe) }); }
      o.cv.style.transform = o.lift ? 'translateY(' + (-o.lift * LIFT()).toFixed(2) + 'px)' : '';
    }

    /* ---------------- the ground: the pads, the process line, its arrowheads, the final test ---------------- */
    function f1(v) { return Math.round(v * 10) / 10; }
    function padPoly(c, hp, hq) {
      var p = function (a, b) { return [c[0] + PD[0] * a + QD[0] * b, c[1] + PD[1] * a + QD[1] * b]; };
      return [p(-hp, -hq), p(hp, -hq), p(hp, hq), p(-hp, hq)];
    }
    var FTR = function () { return 7 * Math.max(0.85, Math.min(1.15, S)); };
    // where the line meets an object (the edge of its pad along the line's own axis) or the final test (its marker's edge)
    function endAt(id, pt, toward, gap) {
      if (!isObj(id) && id !== 'ft') return pt;
      var dx = toward[0] - pt[0], dy = toward[1] - pt[1], L0 = Math.hypot(dx, dy) || 1, ux = dx / L0, uy = dy / L0, d;
      if (id === 'ft') d = FTR() * 1.15 + 1;
      else { var o = objOf(id), alongP = Math.abs(ux * PD[0] + uy * PD[1]) > Math.abs(ux * QD[0] + uy * QD[1]); d = (alongP ? o.pad.hp : o.pad.hq) + gap; }
      d = Math.min(d, L0 * 0.45);
      return [pt[0] + ux * d, pt[1] + uy * d];
    }
    function pathD(pts) { return 'M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L'); }
    function arrowAt(a, b, sz) {
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, s = sz, w = s * 0.6;
      return 'M' + f1(b[0] - ux * s + uy * w) + ' ' + f1(b[1] - uy * s - ux * w) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + 'L' + f1(b[0] - ux * s - uy * w) + ' ' + f1(b[1] - uy * s + ux * w);
    }
    var kW = function () { return narrow ? 1 : Math.max(0.8, Math.min(1.15, S)); };
    var widthOf = function (c) { return (0.75 + 0.36 * Math.sqrt(c - 1)) * kW(); };
    function trimmed(id0, id1, pts) {
      var p = pts.map(function (q) { return [px(q[0]), px(q[1])]; }), g = 5 * Math.max(0.7, S), n = p.length;
      p[0] = endAt(id0, p[0], p[1], g); p[n - 1] = endAt(id1, p[n - 1], p[n - 2], g + 2);
      return p;
    }
    function drawGround() {
      var W = Math.round(L.W * S), H = Math.round(L.H * S), out = [], ar = [];
      GROUND.setAttribute('viewBox', '0 0 ' + W + ' ' + H); GROUND.setAttribute('width', W); GROUND.setAttribute('height', H);
      // (the two across the chain stand on no pad: they are not on the line)
      objs.forEach(function (o) { if (!isX(o.r)) out.push('<path class="fx-pad" data-n="' + o.r.n + '" d="' + pathD(padPoly([o.ax, o.ay], o.pad.hp, o.pad.hq)) + 'Z"/>'); });
      // the line at rest: every segment once, as thick as the flows that run along it
      L.segs.forEach(function (sg, i) {
        var p = trimmed(sg.a, sg.b, sg.pts); sg._p = p; sg._len = 0;
        for (var k = 1; k < p.length; k++) sg._len += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
        out.push('<path class="fx-sg" data-i="' + i + '" style="stroke-width:' + widthOf(sg.c).toFixed(2) + 'px" d="' + pathD(p) + '"/>');
        // an arrowhead where a feeder joins the trunk, and where the line meets an object or the final test
        var endsAt = sg.feed || isObj(sg.b) || sg.b === 'ft';
        if (endsAt) ar.push('<path class="fx-ar" data-i="' + i + '" d="' + arrowAt(p[p.length - 2], p[p.length - 1], (4.6 + 0.5 * widthOf(sg.c)) * Math.max(0.8, Math.min(1.1, S))) + '"/>');
      });
      out = out.concat(ar);
      // the final test: a small station on the line after the package
      var ft = [px(L.A['12f'][0]), px(L.A['12f'][1])], r = FTR();
      out.push('<path class="fx-ft" d="' + pathD(padPoly(ft, r, r)) + 'Z"/>');
      // the routes that light: into and out of the pointed stage
      L.routes.forEach(function (rt) {
        var p = trimmed(rt.a, rt.b, rt.pts);
        out.push('<g class="fx-hl" data-a="' + rt.a + '" data-b="' + rt.b + '"><path d="' + pathD(p) + '"/><path class="fx-hl-ar" d="' + arrowAt(p[p.length - 2], p[p.length - 1], 6 * Math.max(0.8, Math.min(1.1, S))) + '"/></g>');
      });
      if (DEBUG) objs.forEach(function (o) { out.push('<rect x="' + f1(o.box.x0) + '" y="' + f1(o.box.y0) + '" width="' + f1(o.box.x1 - o.box.x0) + '" height="' + f1(o.box.y1 - o.box.y0) + '" fill="none" stroke="red" stroke-width=".5"/>'); });
      GROUND.innerHTML = out.join('');
    }

    /* ---------------- the callouts: a numbered balloon and the stage's name ---------------- */
    function drawCallouts() {
      var W = Math.round(L.W * S), H = Math.round(L.H * S), leads = [];
      LEADS.setAttribute('viewBox', '0 0 ' + W + ' ' + H); LEADS.setAttribute('width', W); LEADS.setAttribute('height', H);
      if (!cos[0].li) {
        cos.forEach(function (c) {
          var r = rows[c.ri], li = document.createElement('li');
          li.className = 'fx-co' + (c.ft ? ' is-ft' : '') + (isX(r) ? ' is-x' : ''); li.setAttribute('data-n', c.key); li.setAttribute('data-level', r.level);
          // final test carries stage 12's number in its label, with no balloon of its own (the reader test, 24 Nov 2026)
          var nm = c.ft ? (+r.n) + ' · Final test' : LAB === 'full' ? r.t : SHORT[r.n];
          var aria = c.ft ? 'Final test, the second test in stage 12, ' + r.t : isX(r) ? r.t + '. Chapter ' + (+r.n) + ', across the chain' : r.t + (r.level === 4 ? ', a chokepoint' : '') + '. Stage ' + (+r.n) + ' of 14';
          li.innerHTML = '<a class="fx-co-a" href="' + MK.esc(r.href) + '" aria-label="' + MK.esc(aria) + '">' + (c.ft ? '' : '<span class="fx-co-b" aria-hidden="true">' + (+r.n) + '</span>')
            + '<span class="fx-co-t" aria-hidden="true"><span class="fx-co-nm">' + MK.esc(nm) + '</span></span></a>';
          COS.appendChild(li); c.li = li;
        });
        bindCallouts();
      }
      var rect = function (el) { var r = el.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; };
      var base = IN.getBoundingClientRect(), toSheet = function (q) { return [q[0] - base.left, q[1] - base.top, q[2] - base.left, q[3] - base.top]; };
      // the words of the page never sit under a callout or a lit object: the head, the note, the chapters across, the facts
      hard = [];
      [HEAD, NOTE, ACROSS, KEY].forEach(function (el) { if (el.offsetParent === IN && el.offsetWidth) { var q = toSheet(rect(el)); hard.push([q[0] - 6, q[1] - 6, q[2] + 6, q[3] + 6]); } });
      if (L.facts) hard.push([px(Math.min(L.facts.x, L.facts.x0)) - 8, px(Math.min(L.facts.y, L.facts.y0)) - 10, px(L.facts.x + L.facts.w), px(L.facts.y + L.facts.h)]);
      var ftp = [px(L.A['12f'][0]), px(L.A['12f'][1])], ftb = { x0: ftp[0] - 12, x1: ftp[0] + 12, y0: ftp[1] - 9, y1: ftp[1] + 9 };
      var boxOf = function (c) { return c.ft ? ftb : objs[c.ri].box; };
      // no callout on a drawing: the middle of every drawing's box is out of bounds, its rim costs
      var core = function (b) { var mx = (b.x1 - b.x0) * 0.1, my = (b.y1 - b.y0) * 0.1; return [b.x0 + mx, b.y0 + my, b.x1 - mx, b.y1 - my]; };
      var full = objs.map(function (o) { var b = o.box; return [b.x0 + 3, b.y0 + 3, b.x1 - 3, b.y1 - 3]; });
      var cores = objs.map(function (o) { return core(o.box); }).concat([[ftb.x0 + 4, ftb.y0 + 3, ftb.x1 - 4, ftb.y1 - 3]]);
      var hulls = objs.map(function (o) { return hullAt(o, 0, 1, 0); });
      // and, softly, clear of where the other objects open, so each has room to open
      var opens = objs.map(function (o) { return hullAt(o, 1, o.Gmax, LIFT()); });
      var own = objs.map(function (o) { var b = o.obox; return [b.x0 + 4, b.y0 + 4, b.x1 - 4, b.y1 - 4]; });
      var lineDots = [];
      L.segs.forEach(function (sg) { var p = sg._p || []; for (var k = 1; k < p.length; k++) { var a = p[k - 1], e = p[k], n = Math.ceil(Math.hypot(e[0] - a[0], e[1] - a[1]) / 6); for (var j = 0; j <= n; j++) lineDots.push([a[0] + (e[0] - a[0]) * j / n, a[1] + (e[1] - a[1]) * j / n]); } });
      var boxD = function (b, q) { var dx = Math.max(b.x0 - q[2], q[0] - b.x1, 0), dy = Math.max(b.y0 - q[3], q[1] - b.y1, 0); return Math.hypot(dx, dy); };
      var ov = function (q, r) { var w = Math.min(q[2], r[2]) - Math.max(q[0], r[0]), h = Math.min(q[3], r[3]) - Math.max(q[1], r[1]); return w > 0 && h > 0 ? w * h : 0; };
      var Wpx = L.W * S, Hpx = L.H * S, placed = [];
      // (the two across the chain first: their callouts' places are set (L.coFix), and the stages' keep clear of them)
      var order = cos.filter(function (c) { return isX(rows[c.ri]); }).concat(cos.filter(function (c) { return !isX(rows[c.ri]); }));
      order.forEach(function (c) {
        var li = c.li, b = boxOf(c), bw = b.x1 - b.x0, bh = b.y1 - b.y0, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, best = null;
        var fix = (L.coFix || {})[c.key];
        var pref = fix ? [fix.d] : (L.co[c.key] || []).concat(['ne', 'e', 'se', 's', 'sw', 'w', 'nw', 'n']);
        li.style.left = '0px'; li.style.top = '0px';
        var bEl = MK.$('.fx-co-b', li), bS = bEl ? bEl.getBoundingClientRect().width || 19 : 0;
        ['r', 'l'].forEach(function (sd) { li.setAttribute('data-side', sd); [0, 1].forEach(function (nw) { li.classList.toggle('is-narrow', !!nw); var q = rect(MK.$('a', li)); li['_' + sd + nw] = [q[2] - q[0], q[3] - q[1]]; }); });
        if (DEBUG) li._c = [];
        pref.forEach(function (d, pi) {
          (fix ? [fix.g] : [10, 22, 38, 58]).forEach(function (g0, gi) { (fix ? [fix.nw ? 1 : 0] : [0, 1]).forEach(function (nw) {
            var g = g0 * Math.max(0.8, S);
            var sd = /w/.test(d) ? 'l' : 'r', sz = li['_' + sd + nw], lw = sz[0], lh = sz[1], x0, y0;
            if (d === 'n') { x0 = Math.max(0, Math.min(Wpx - lw, cx - lw / 2)); y0 = b.y0 - g - lh; }
            else if (d === 's') { x0 = Math.max(0, Math.min(Wpx - lw, cx - lw / 2)); y0 = b.y1 + g; }
            else if (d === 'e') { x0 = b.x1 + g; y0 = cy - lh / 2; }
            else if (d === 'w') { x0 = b.x0 - g - lw; y0 = cy - lh / 2; }
            else if (d === 'ne') { x0 = cx + 0.22 * bw; y0 = b.y0 + 0.1 * bh - g - lh; }
            else if (d === 'se') { x0 = cx + 0.22 * bw; y0 = b.y1 - 0.1 * bh + g; }
            else if (d === 'sw') { x0 = cx - 0.22 * bw - lw; y0 = b.y1 - 0.1 * bh + g; }
            else { x0 = cx - 0.22 * bw - lw; y0 = b.y0 + 0.1 * bh - g - lh; }
            var q = [x0, y0, x0 + lw, y0 + lh], sc = pi * 4 + gi * 7 + nw * 10, A0 = lw * lh;
            if (q[0] < 0 || q[1] < 0 || q[2] > Wpx || q[3] > Hpx) sc += 20000;
            if (hulls.some(function (z) { return clash(rectPoly(q), z); }) || ov(q, cores[cores.length - 1]) > 4) sc += 20000;
            hard.forEach(function (z) { if (ov(q, z)) sc += 20000; });
            placed.forEach(function (z) { if (ov(q, z)) sc += 20000; else if (ov([q[0] - 10, q[1] - 10, q[2] + 10, q[3] + 10], z)) sc += 900; });
            full.forEach(function (z) { var a = ov(q, z); if (a) sc += 600 * a / A0 + 40; });
            if (!c.ft) { var ao = ov(q, own[c.ri]); if (ao) sc += 1400 * ao / A0 + 60; }
            opens.forEach(function (z, k) { if (k !== c.ri || c.ft) { if (clash(rectPoly(q), z)) sc += 700; } });
            lineDots.forEach(function (pt) { if (pt[0] > q[0] - 3 && pt[0] < q[2] + 3 && pt[1] > q[1] - 3 && pt[1] < q[3] + 3) sc += 30; });
            // a callout stands nearer its own drawing than any other
            var dOwn = boxD(b, q);
            objs.forEach(function (o2, k) { if ((c.ft || k !== c.ri) && boxD(o2.box, q) < dOwn - 4) sc += 900; });
            if (DEBUG) li._c.push([d, Math.round(g), nw, Math.round(sc)]);
            if (!best || sc < best.sc) best = { sc: sc, q: q, sd: sd, nw: nw };
          }); });
        });
        placed.push(best.q); li._q = best.q;
        var bx = best.sd === 'r' ? best.q[0] + bS / 2 : best.q[2] - bS / 2, by = best.q[1] + bS / 2;
        li.classList.toggle('is-narrow', !!best.nw);
        li.setAttribute('data-side', best.sd); li.style.left = bx.toFixed(1) + 'px'; li.style.top = by.toFixed(1) + 'px';
        // the leader lands on the drawing itself (the middle of its nearest broad face), or on the final test's station
        var tx = cx, ty = cy, bestD = Infinity;
        if (!c.ft) {
          var o = objs[c.ri];
          (o.pick || []).forEach(function (e) {
            if (!e.pts || e.pts.length < 3) return;
            var ar = 0, mx = 0, my = 0; for (var k = 0, m = e.pts.length; k < m; k++) { var p0 = e.pts[k], p1 = e.pts[(k + 1) % m]; ar += p0[0] * p1[1] - p1[0] * p0[1]; mx += p0[0]; my += p0[1]; }
            if (Math.abs(ar) / 2 < 60) return;
            mx = mx / e.pts.length + o.left; my = my / e.pts.length + o.top;
            var dd = Math.hypot(mx - bx, my - by); if (dd < bestD) { bestD = dd; tx = mx; ty = my; }
          });
        } else { tx = ftp[0]; ty = ftp[1]; }
        var dx = tx - bx, dy = ty - by, l = Math.hypot(dx, dy) || 1, rB = bS / 2, stopAt = c.ft ? FTR() + 2 : 0;
        if (!bEl) {
          // (no balloon, final test: the leader leaves from the point of the label's box nearest the station, just off the words)
          var qq = best.q;
          bx = Math.max(qq[0] - 3, Math.min(qq[2] + 3, tx)); by = Math.max(qq[1] - 2, Math.min(qq[3] + 2, ty));
          dx = tx - bx; dy = ty - by; l = Math.hypot(dx, dy) || 1; rB = 0;
        }
        if (l > rB + 4 + stopAt) leads.push('<g class="fx-ld" data-n="' + c.key + '"><path d="M' + f1(bx + dx / l * rB) + ' ' + f1(by + dy / l * rB) + 'L' + f1(tx - dx / l * stopAt) + ' ' + f1(ty - dy / l * stopAt) + '"/>' + (c.ft ? '' : '<circle cx="' + f1(tx) + '" cy="' + f1(ty) + '" r="1.6"/>') + '</g>');
      });
      LEADS.innerHTML = leads.join('');
      // (design review, phones: each callout's target reaches 14 px above and below its line, as far as halfway to a callout
      // standing over or under it, so no two targets meet; fx.css .fx-co-a::before)
      cos.forEach(function (c) {
        var q = c.li._q, up = 14, dn = 14;
        if (narrow && q) cos.forEach(function (d) {
          var r = d.li._q; if (d === c || !r || r[2] + 8 <= q[0] - 8 || r[0] - 8 >= q[2] + 8) return;
          if (r[3] <= q[1]) up = Math.min(up, (q[1] - r[3]) / 2); else if (r[1] >= q[3]) dn = Math.min(dn, (r[1] - q[3]) / 2); else up = dn = 0;
        });
        c.li.style.setProperty('--hit-t', up.toFixed(1) + 'px'); c.li.style.setProperty('--hit-b', dn.toFixed(1) + 'px');
      });
    }
    function placeText() {
      var h = L.head || { x: 0, y: 0, w: 600 };
      // (OX and XR: the spare width left and right of the drawing, where the window's height holds it; see layout)
      HEAD.style.left = (px(h.x) - OX) + 'px'; HEAD.style.top = px(h.y) + 'px'; HEAD.style.width = px(h.w) + 'px';
      /* the label "Across the chain" over its thin rule, as wide as the two: on a wide screen its right edge on the composition's
         edge (where the masthead's ends), on a phone centred across the page */
      var ac = L.across;
      ACROSS.style.left = ACROSS.style.right = '';
      ACROSS.setAttribute('data-align', ac.align); ACROSS.style.width = px(ac.rule) + 'px'; ACROSS.style.top = px(ac.y) + 'px';
      if (ac.align === 'r') ACROSS.style.right = (Math.round(L.W * S) - px(ac.x) - XR) + 'px';
      else ACROSS.style.left = px(ac.x) + 'px';
      if (narrow) { FACTS.style.left = FACTS.style.top = FACTS.style.width = ''; KEY.style.left = KEY.style.top = KEY.style.maxWidth = ''; KEY.classList.remove('is-wrap'); return; }
      KEY.style.left = (px(L.key.x) - OX) + 'px'; KEY.style.top = px(L.key.y) + 'px';
      /* the key's note goes under its sentence where the one line would run under the lit row, whose sentence can reach the
         key's line (the cards' own chokepoint wording is longer than the mock's, 23 Nov 2026: at 1280 to about 1500 px wide).
         The sentence keeps its line and the note takes the air under it (fx.css .fx-key.is-wrap), so the drawing and its
         callouts stand as they do with the one line */
      KEY.style.maxWidth = ''; KEY.classList.remove('is-wrap');
      if (!L.mid) { var keyRoom = px(Math.min(L.facts.x, L.facts.x0)) - (px(L.key.x) - OX) - 16; if (KEY.scrollWidth > keyRoom) { KEY.style.maxWidth = Math.max(0, Math.floor(keyRoom)) + 'px'; KEY.classList.add('is-wrap'); } }
      NOTE.style.left = NOTE.style.top = '';
      FACTS.style.left = px(L.facts.x) + 'px'; FACTS.style.top = px(L.facts.y) + 'px'; FACTS.style.width = (px(L.facts.w) + XR) + 'px';
    }

    /* every drawing's silhouette: the convex hull of the faces the kit draws, in view units round the object's base, at rest and
       at each spread (measured once, by drawing each into an unseen canvas at scale 1) */
    function hull(pts) {
      pts.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var cr = function (o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }, lo = [], up = [], i;
      for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
      for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
      up.pop(); lo.pop(); return lo.concat(up);
    }
    var scratch = document.createElement('canvas'); scratch.width = scratch.height = 2;
    // a globe's disc as a polygon
    function disc(G) { var out = []; for (var k = 0; k < 32; k++) { var a = k * Math.PI / 16; out.push([G.x + G.r * Math.cos(a), G.y + G.r * Math.sin(a)]); } return out; }
    function unitHull(o, x) {
      var pl = o.pl, ctx = scratch.getContext('2d'); pl._ex = x;
      pl.paint({ k: 1, w: 2, h: 2, g: new P.CanvasG(ctx, 1), pal: P.palette(html, pl.m.spec, false, false), fit: { s: 1, cx: -o.bs[0], cy: o.bs[1], e: o.e0, rooms: { l: 0, r: 0, t: 0, b: 0 } },
        noLabels: true, noDims: true, dyaw: 0, delev: 0, labA: 1, pick: true, penW: 470 });
      var pts = [];
      // (the globe: its disc, with room for the pins that stand up off it)
      if (pl._globe) { var G0 = pl._globe; disc({ x: G0.x, y: G0.y - 0.1 * G0.r, r: G0.r * 1.22 }).forEach(function (q) { pts.push(q); }); }
      else (pl._pick || []).forEach(function (e) { if (e.pts) e.pts.forEach(function (q) { pts.push([q[0], q[1]]); }); else if (e.dots) e.dots.forEach(function (q) { pts.push([q[0], q[1]]); }); });
      pl._ex = 0; pl._pick = null;
      return pts.length > 2 ? hull(pts) : [];
    }
    objs.forEach(function (o) { o.uh = { 0: unitHull(o, 0) }; EXS.forEach(function (x) { o.uh[x] = unitHull(o, x); }); });
    // a hull on the sheet at growth G, raised by lift
    function hullAt(o, x, G, lift) { var s = o.s * G; return o.uh[x].map(function (q) { return [o.ax + s * q[0], o.ay + s * q[1] - lift]; }); }
    // do two convex polygons overlap by more than a hair (separating axes)
    function clash(A, B) {
      var sep = function (P1, P2) {
        for (var i = 0; i < P1.length; i++) {
          var a = P1[i], b = P1[(i + 1) % P1.length], nx = b[1] - a[1], ny = a[0] - b[0], l = Math.hypot(nx, ny) || 1, mn1 = Infinity, mx1 = -Infinity, mn2 = Infinity, mx2 = -Infinity, k, d;
          nx /= l; ny /= l;
          for (k = 0; k < P1.length; k++) { d = P1[k][0] * nx + P1[k][1] * ny; if (d < mn1) mn1 = d; if (d > mx1) mx1 = d; }
          for (k = 0; k < P2.length; k++) { d = P2[k][0] * nx + P2[k][1] * ny; if (d < mn2) mn2 = d; if (d > mx2) mx2 = d; }
          if (mx1 < mn2 + 1.5 || mx2 < mn1 + 1.5) return true;
        }
        return false;
      };
      return A.length > 2 && B.length > 2 && !sep(A, B) && !sep(B, A);
    }
    var rectPoly = function (q) { return [[q[0], q[1]], [q[2], q[1]], [q[2], q[3]], [q[0], q[3]]]; };
    var bboxOf = function (P1) { var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }; P1.forEach(function (q) { if (q[0] < b.x0) b.x0 = q[0]; if (q[0] > b.x1) b.x1 = q[0]; if (q[1] < b.y0) b.y0 = q[1]; if (q[1] > b.y1) b.y1 = q[1]; }); return b; };

    /* a lit object never grows over a neighbour's drawing, a callout, the page's words or past the sheet's edge: for each object
       the furthest spread and the most growth that keep its silhouette clear (an object hemmed in opens less and keeps its size) */
    function capGrowth() {
      var Wpx = L.W * S, Hpx = L.H * S, lift = LIFT(), top = narrow ? 0 : -px(14);
      objs.forEach(function (o) { o.h0 = hullAt(o, 0, 1, 0); });
      objs.forEach(function (o, i) {
        var obs = hard.map(rectPoly), tag = hard.map(function (z, k) { return 'word' + k; });
        objs.forEach(function (o2, k) { if (k !== i) { obs.push(o2.h0); tag.push('obj' + o2.r.n); } });
        // (the small final test label may go under a lit neighbour: it steps back while that neighbour is lit)
        cos.forEach(function (c) { if (c.li._q && !c.ft && c.ri !== i) { var q = c.li._q; obs.push(rectPoly([q[0] - 2, q[1] - 2, q[2] + 2, q[3] + 2])); tag.push('co' + c.key); } });
        var best = null;
        EXS.some(function (x) {
          for (var G = o.Gmax; G >= 0.999; G -= 0.02) {
            var H = hullAt(o, x, G, lift), bb = bboxOf(H);
            if (bb.x0 < 0 || bb.x1 > Wpx || bb.y0 < top || bb.y1 > Hpx) continue;
            if (obs.some(function (z) { return clash(H, z); })) continue;
            best = { x: x, G: G, b: bb }; return true;
          }
          return false;
        });
        if (DEBUG) { var H1 = hullAt(o, 1, 1, lift); o._why = obs.map(function (z, k) { return clash(H1, z) ? tag[k] : null; }).filter(Boolean); }
        if (!best) best = { x: 0.3, G: 1, b: bboxOf(hullAt(o, 0.3, 1, lift)) };
        o.exCap = best.x; o.Gi = best.G; o.obox = best.b;
      });
    }

    /* ---------------- the row of facts ---------------- */
    var meterOf = function (lv) { return '<span class="meter" data-level="' + lv + '" aria-hidden="true">' + [1, 2, 3, 4].map(function (k) { return '<b' + (k <= lv ? ' class="on"' : '') + '></b>'; }).join('') + '</span>'; };
    function facts(i) {
      if (i == null || i < 0) { F1.hidden = true; F0.hidden = false; FACTS.removeAttribute('data-n'); return; }
      var r = rows[i];
      F1.innerHTML = '<p class="fx-f1-h"><a class="fx-f1-t" href="' + MK.esc(r.href) + '">' + MK.esc(r.t) + '</a></p>'
        // (one of the two across the chain says so where a stage shows its rating and firms)
        + (isX(r) ? '<p class="fx-f1-m fx-f1-x">Across the chain</p>' : '<p class="fx-f1-m">' + (r.level === 4 ? glyph(1) + '<span class="fx-f1-w">Chokepoint</span>' : '') + '<span class="fx-f1-firms">' + r.firms.map(MK.esc).join(', ') + '</span></p>')
        + '<p class="fx-f1-one">' + MK.esc(r.line) + '</p>';
      F1.hidden = false; F0.hidden = true; FACTS.setAttribute('data-n', r.n);
    }

    /* ---------------- the lit object ---------------- */
    var active = -1, raf = 0, OPEN_MS = MK.reduced ? 1 : 720 * SLOW, CLOSE_MS = MK.reduced ? 1 : 420 * SLOW, CUE_MS = 900 * SLOW, CUE = 12 * Math.PI / 180;
    function setActive(i) {
      if (i === active) return;
      var prev = active; active = i;
      if (prev >= 0) go(objs[prev], 0);
      if (i >= 0) go(objs[i], 1);
      marks();
      facts(i);
    }
    function marks() {
      var i = active, n = i >= 0 ? rows[i].n : null;
      sheet.classList.toggle('is-active', i >= 0);
      // (lit, one of the two across the chain lights the whole line, which it spans; the stages keep their ink)
      var xl = i >= 0 && isX(rows[i]);
      GROUND.classList.toggle('is-lit', i >= 0 && !xl); GROUND.classList.toggle('is-all', xl);
      var nk = function (id) { return id === 'ft' ? '12' : id; };
      MK.$$('.fx-hl', GROUND).forEach(function (g) { g.classList.toggle('is-on', !!n && (nk(g.getAttribute('data-a')) === n || nk(g.getAttribute('data-b')) === n)); });
      MK.$$('.fx-pad', GROUND).forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-n') === n); });
      var ft = MK.$('.fx-ft', GROUND); if (ft) ft.classList.toggle('is-on', n === '12');
      cos.forEach(function (c) { c.li.classList.toggle('is-on', c.ri === i); });
      MK.$$('.fx-ld', LEADS).forEach(function (g) { var k = g.getAttribute('data-n'); g.classList.toggle('is-on', !!n && (k === n || (k === '12f' && n === '12'))); });
      objs.forEach(function (o, k) { o.cv.style.zIndex = k === i ? 60 : o.z; o.cv.classList.toggle('is-back', i >= 0 && k !== i && (!xl || isX(o.r))); });
      var ob = i >= 0 ? objs[i].obox : null;
      cos.forEach(function (c) { var q = c.li._q, under = !!(ob && q && c.ri !== i && q[0] < ob.x1 - 4 && q[2] > ob.x0 + 4 && q[1] < ob.y1 - 4 && q[3] > ob.y0 + 4); c.li.classList.toggle('is-under', under); });
    }
    function go(o, to) { o.exFrom = o.ex; o.liftFrom = o.lift; o.tintFrom = o.tint; o.exTo = to; o.t0 = performance.now(); o.dur = to ? OPEN_MS : CLOSE_MS; o.moving = true; wake(); }
    function wake() { if (!raf) raf = requestAnimationFrame(frame); }
    function frame(now) {
      raf = 0; var more = false;
      objs.forEach(function (o) {
        var changed = false;
        if (o.moving) {
          var u = Math.min(1, (now - o.t0) / o.dur), k;
          if (o.exTo) { k = MK.settle(u); o.ex = o.exFrom + (1 - o.exFrom) * k; o.lift = o.liftFrom + (1 - o.liftFrom) * MK.easeOut(u * 1.4); o.tint = o.tintFrom + (1 - o.tintFrom) * MK.easeOut(u * 1.2); }
          else { k = MK.easeInOut(u); o.ex = o.exFrom * (1 - k); o.lift = o.liftFrom * (1 - k); o.tint = o.tintFrom * (1 - k); }
          if (u >= 1) {
            o.moving = false; o.ex = o.exTo; o.lift = o.exTo; o.tint = o.exTo;
            // the chapters' turn cue, after the lift: one slow turn and back, the first time an object opens
            if (o.exTo && !o.cued && !MK.reduced) { o.cued = true; o.cue = { t0: now }; }
          }
          changed = true;
        }
        if (o.cue) {
          var cu = (now - o.cue.t0) / CUE_MS;
          if (cu >= 1) { o.cue = null; o.cueYaw = 0; } else o.cueYaw = CUE * (1 - Math.cos(2 * Math.PI * cu)) / 2;
          changed = true;
        }
        if (o.back) {
          var b = o.back, v = Math.min(1, (now - b.t0) / 520), e = 1 - Math.pow(1 - v, 3);
          o.yaw = b.yaw * (1 - e); if (v >= 1) { o.back = null; o.yaw = 0; o.rawYaw = 0; }
          changed = true;
        }
        if (o.turning) { changed = true; o.turning = false; }
        if (changed) { paint(o, !o.moving && !o.back && !o.yaw && !o.cue); if (o.moving || o.back || o.cue) more = true; }
      });
      if (more) wake();
    }
    function turnBy(o, d) { o.back = null; o.rawYaw += d; o.yaw = 0.7 * Math.tanh(o.rawYaw / 0.7); o.turning = true; wake(); }
    function release(o) { o.back = { t0: performance.now(), yaw: o.yaw }; wake(); }

    /* ---------------- the pointer ---------------- */
    function inPoly(x, y, pts) { var c = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) c = !c; } return c; }
    function hitObj(o, x, y) {
      var lx = x - o.left, ly = y - o.top + (o.lift ? o.lift * LIFT() : 0);
      if (lx < 0 || ly < 0 || lx > o.w || ly > o.h || !o.pick) return false;
      for (var i = o.pick.length - 1; i >= 0; i--) {
        var e = o.pick[i];
        if (e.pts) { if (inPoly(lx, ly, e.pts)) return true; }
        else if (e.dots) for (var j = 0; j < e.dots.length; j++) { var d = e.dots[j]; if (Math.abs(d[0] - lx) < e.r + 2 && Math.abs(d[1] - ly) < e.r + 2) return true; }
      }
      return false;
    }
    function objAt(x, y) {
      var order = objs.slice().sort(function (a, b) { return (b === objs[active] ? 99 : b.z) - (a === objs[active] ? 99 : a.z); });
      for (var i = 0; i < order.length; i++) if (hitObj(order[i], x, y)) return order[i].r.i;
      return -1;
    }
    var leaveT = 0, drag = null, lastPointer = 'mouse', pinY = null;
    document.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; }, true);
    function local(e) { var r = IN.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    IN.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      if (drag && drag.id === e.pointerId) {
        var o = objs[drag.i], dx = e.clientX - drag.x; drag.x = e.clientX;
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 4) drag.moved = true;
        if (drag.moved) { turnBy(o, dx * 0.008); IN.classList.add('is-turning'); }
        return;
      }
      if (e.target.closest && e.target.closest('.fx-co, .fx-facts, .fx-across')) return; // a callout or the facts keep what they lit
      var p = local(e), i = objAt(p[0], p[1]);
      if (i < 0 && active >= 0) {
        var ob = objs[active].obox, pad = 10;
        if (p[0] > ob.x0 - pad && p[0] < ob.x1 + pad && p[1] > ob.y0 - pad && p[1] < ob.y1 + pad) i = active; // it stays lit while the pointer is over its spread
      }
      IN.style.cursor = i >= 0 ? 'pointer' : '';
      clearTimeout(leaveT);
      if (i >= 0) setActive(i);
      else leaveT = setTimeout(function () { setActive(-1); }, 260);
    });
    sheet.addEventListener('pointerleave', function () { clearTimeout(leaveT); leaveT = setTimeout(function () { var a = document.activeElement; if (!(a && sheet.contains(a) && a.closest('.fx-co'))) setActive(-1); }, 200); });
    IN.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('a')) return;
      var p = local(e), i = e.pointerType === 'touch' ? objAt(p[0], p[1]) : (active >= 0 && hitObj(objs[active], p[0], p[1]) ? active : objAt(p[0], p[1]));
      if (i < 0) return;
      drag = { id: e.pointerId, i: i, x: e.clientX, x0: e.clientX, y0: e.clientY, moved: false, touch: e.pointerType === 'touch', was: active };
      if (e.pointerType !== 'touch') { try { IN.setPointerCapture(e.pointerId); } catch (x) { } }
    });
    IN.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerType !== 'touch' || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.4 && drag.i === active) drag.moved = true;
      if (drag.moved) turnBy(objs[drag.i], (e.clientX - drag.x) * 0.008);
      drag.x = e.clientX;
    });
    function up(e) {
      if (!drag || drag.id !== e.pointerId) return;
      var d = drag; drag = null; IN.classList.remove('is-turning');
      if (d.moved) { release(objs[d.i]); return; }
      if (e.type !== 'pointerup') return;
      // a click opens the chapter; on a touch screen the first tap opens the object, a second its chapter
      if (d.touch && d.was !== d.i) { setActive(d.i); pinY = window.scrollY; return; }
      location.href = rows[d.i].href;
    }
    IN.addEventListener('pointerup', up); IN.addEventListener('pointercancel', up);

    /* the callouts and the keyboard: a callout lights its stage; Up and Down walk the stages, Left and Right turn the lit object.
       On a touch screen a tapped callout does what a tapped object does: the first tap opens it, a second follows the link */
    function bindCallouts() {
      cos.forEach(function (c, ci) {
        var a = MK.$('a', c.li), o = objs[c.ri], keyT = 0;
        c.li.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { clearTimeout(leaveT); setActive(c.ri); } });
        a.addEventListener('focus', function () { setActive(c.ri); });
        a.addEventListener('blur', function () { setTimeout(function () { if (!sheet.contains(document.activeElement)) setActive(-1); }, 0); });
        // (the stage lit before the tap counts: a tapped link takes the focus before its click, and the focus lights it)
        var before = -1;
        c.li.addEventListener('pointerdown', function () { before = active; }, true);
        a.addEventListener('click', function (e) { if (lastPointer === 'touch' && before !== c.ri) { e.preventDefault(); setActive(c.ri); pinY = window.scrollY; } before = active; });
        a.addEventListener('keydown', function (e) {
          var k = e.key, j = -1;
          if (k === 'ArrowDown') j = Math.min(cos.length - 1, ci + 1); else if (k === 'ArrowUp') j = Math.max(0, ci - 1);
          else if (k === 'Home') j = 0; else if (k === 'End') j = cos.length - 1;
          else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); clearTimeout(keyT); setActive(c.ri); turnBy(o, k === 'ArrowLeft' ? -0.12 : 0.12); return; }
          else if (k === 'Escape') { if (o.yaw) release(o); return; }
          else return;
          e.preventDefault(); MK.$('a', cos[j].li).focus();
        });
        a.addEventListener('keyup', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { clearTimeout(keyT); keyT = setTimeout(function () { release(o); }, 900); } });
      });
    }

    /* ---------------- the entrance ----------------
       The line draws from the inputs toward the fab and on to the rack; each input is set down on its pad just before its feeder
       draws, each object on the main line as the line reaches it; it ends with the turn cue on the fab */
    function entrance() {
      if (MK.reduced || SHOT || !L) { sheet.classList.add('is-in'); return; }
      sheet.classList.add('is-entering');
      var T = {}, STEP = 175, FEED = 260, cur = 340;
      T['01'] = 120;
      var segByChain = {}, feedSeg = {};
      L.segs.forEach(function (sg, i) { if (sg.feed) feedSeg[sg.a] = i; else segByChain[sg.chain] = i; });
      var timing = {};
      for (var k = 0; k < L.chain.length - 1; k++) {
        timing[segByChain[k]] = [cur, STEP]; cur += STEP;
        var id = L.chain[k + 1][0];
        if (id[0] === 'j') { var n = id.slice(1); timing[feedSeg[n]] = [cur - FEED, FEED]; T[n] = cur - FEED - 200; }
        else if (id === 'ft') T['12f'] = cur;
        else if (isObj(id)) T[id] = cur - 60;
      }
      var end = cur;
      // the two across the chain, their label and its rule come once the line has reached the rack
      T['15'] = end + 80; T['16'] = end + 220; end += 420; sheet.style.setProperty('--fx-xd', (T['15'] - 120) + 'ms');
      objs.forEach(function (o) { o.cv.style.setProperty('--d', T[o.r.n] + 'ms'); });
      MK.$$('.fx-pad', GROUND).forEach(function (g) { g.style.setProperty('--d', (T[g.getAttribute('data-n')] - 80) + 'ms'); });
      cos.forEach(function (c) { c.li.style.setProperty('--d', ((T[c.key] || 0) + 260) + 'ms'); });
      MK.$$('.fx-ld', LEADS).forEach(function (g) { g.style.setProperty('--d', ((T[g.getAttribute('data-n')] || 0) + 260) + 'ms'); });
      var ft = MK.$('.fx-ft', GROUND); if (ft) ft.style.setProperty('--d', (T['12f'] - 40) + 'ms');
      MK.$$('.fx-sg', GROUND).forEach(function (p) {
        var sg = L.segs[+p.getAttribute('data-i')], tm = timing[+p.getAttribute('data-i')] || [0, STEP];
        p.style.strokeDasharray = sg._len + ' ' + sg._len; p.style.setProperty('--len', sg._len.toFixed(1)); p.style.setProperty('--d', tm[0] + 'ms'); p.style.setProperty('--dur', tm[1] + 'ms');
      });
      MK.$$('.fx-ar', GROUND).forEach(function (p) { var tm = timing[+p.getAttribute('data-i')] || [0, STEP]; p.style.setProperty('--d', (tm[0] + tm[1] - 30) + 'ms'); });
      requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('is-in'); }); });
      setTimeout(function () { var fab = objs[7]; if (active < 0) { fab.cue = { t0: performance.now() }; wake(); } }, end + 350);
      setTimeout(function () { sheet.classList.remove('is-entering'); MK.$$('.fx-sg', GROUND).forEach(function (p) { p.style.strokeDasharray = ''; }); }, end + 1400);
    }

    /* ---------------- a phone: the object at the reading line opens as it passes (on a tap only, under reduced motion) ---------------- */
    var rlT = 0;
    function readLine() {
      rlT = 0;
      if (!narrow || drag || MK.reduced) return;
      if (pinY != null) { if (Math.abs(window.scrollY - pinY) < 90) return; pinY = null; }
      var r = IN.getBoundingClientRect(), vh = window.innerHeight, y = vh * 0.4 - r.top;
      if (window.scrollY < 24 || r.bottom < vh * 0.25 || r.top > vh * 0.6) { setActive(-1); return; }
      var best = -1, bd = Infinity;
      objs.forEach(function (o, i) { var cy = o.box.y0 * 0.35 + o.box.y1 * 0.65, d = Math.abs(cy - y); if (d < bd) { bd = d; best = i; } });
      setActive(bd < 90 ? best : -1);
    }
    window.addEventListener('scroll', function () { if (narrow && !rlT) rlT = requestAnimationFrame(readLine); }, { passive: true });

    /* ---------------- boot ---------------- */
    if (!MK.reduced && !SHOT) sheet.classList.add('is-pre');
    layout();
    var booted = false, go2 = function () { if (booted) return; booted = true; layout(); sheet.classList.remove('is-pre'); entrance(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go2);
    setTimeout(go2, 1400);
    if (PRE != null) setTimeout(function () { setActive(+PRE - 1); }, MK.reduced ? 0 : 60);
    var rT = 0, lastW = window.innerWidth;
    window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { if (narrow && window.innerWidth === lastW && L) return; lastW = window.innerWidth; layout(); }, 120); });
    // the sheet's own width: 0 while another view of the home page shows, its width once the walk view shows again
    var sw = sheet.clientWidth;
    if (window.ResizeObserver) new ResizeObserver(function () { var w = sheet.clientWidth; if (w && w !== sw) { sw = w; layout(); } else sw = w; }).observe(sheet);
    MK.onTheme(function () { objs.forEach(function (o) { paint(o, true); }); });
    function replay() { sheet.classList.remove('is-in', 'is-entering'); sheet.classList.add('is-pre'); void sheet.offsetWidth; setTimeout(function () { sheet.classList.remove('is-pre'); entrance(); }, 60); }
    window.FX = { objs: objs, rows: rows, cos: cos, setActive: setActive, layout: layout, replay: replay, get L() { return L; } };
  }
})();
