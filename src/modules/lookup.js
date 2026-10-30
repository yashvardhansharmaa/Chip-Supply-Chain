/* The Glossary (/glossary/, its own page since 30 Oct 2026; #/glossary on the home page until then), search first, with what it holds under the field: "Kinds and letters", the owner's choice of
   30 Oct 2026 (the mockup and its notes are qa/excellence/glossary-alt/sf-kinds/ and searchfirst/ in the main checkout; the
   entry and its passages are the code Index and entry had, unchanged).
   Three states share one field (#gl-view[data-state]). At rest: the name, the field, Random entry, then the kinds with their
   counts and the letters, which build/build.js writes from the data, each opening Browse A to Z. Typing drops suggestions
   inside the field's edge: the names that match first, then "In the text", as many as the window holds and then "Show all N
   matches"; with no match, "Did you mean" and every place the site uses the words. An entry: the field moves into a slim bar
   under the masthead and the entry reads in one centered column, its kind, name and other names, what it is, the reason, the
   chapters it is read in, a firm's, chip's or country's facts, every place the site uses it, and Previous and Next. Browse A
   to Z: every name under its letter, with the kinds and a strip of letters.
   The address names what is shown: #gl-<slug> for a term (what the chapters' pop-ups and the site search link to),
   #lk-firm-, #lk-chip- and #lk-country- for the rest, and #lk-term-<slug> also opens a term; #a-z the index, #a-z/terms
   (firms, ai-chips, countries) the index of one kind and #a-z/b the index at a letter; the page with no hash (or #/glossary) the first screen. A move
   within the Glossary makes a history entry, so Back returns to the index at its place, or to the first screen. The rows are
   in the page's HTML (build/build.js): each row's li carries the entry's lk- id and its search data, a term's link its gl- id,
   and, hidden under the link, the entry's own words (its kind, other names and definition, a term's reason and chapter),
   which the entry reads them from, so every entry's text is in the page as delivered. A firm's, chip's and country's facts
   are read from DATA; the passages from the chapters' paragraphs (glossary.js, fetched when the Glossary first opens), the
   Export Controls entries, the board, AI Chips and the supplier list. The page holds no other view, so a link out to one
   (the supplier list, a chip's card) goes to the home page with what it should do there (CP.go). */
(function () {
  var CP = window.CP; if (!CP) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, DATA = CP.DATA || {}, cname = CP.cname;
  var root = document.documentElement;
  var MQ = window.matchMedia ? matchMedia('(max-width: 879px)') : null;
  var narrow = function () { return MQ ? MQ.matches : window.innerWidth < 880; };
  var reduce = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var here = function () { return !!CP.Router && CP.Router.current === 'glossary'; };
  var KIND = { term: 'Term', firm: 'Firm', chip: 'AI chip', country: 'Country' };
  // each kind: its key, its button in the index, its plural and its singular for the count line
  var KINDS = [['all', 'All', 'entries', 'entry'], ['term', 'Terms', 'terms', 'term'], ['firm', 'Firms', 'firms', 'firm'], ['chip', 'AI chips', 'AI chips', 'AI chip'], ['country', 'Countries', 'countries', 'country']];
  var LETTERS = ['0-9'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  var showL = function (l) { return l === '0-9' ? '0–9' : l; };
  var DEFAULT = 'lk-term-chip'; // "chip": the word every chapter uses, defined from nothing, and never linked from another entry
  // an AI chip's facts in words, as AI Chips sets them: "2024-04" reads April 2024, "2024-Q4" Q4 2024; the node alone where it
  // already names the foundry ("TSMC 5 nm", not "TSMC TSMC 5 nm")
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var when = function (s) { s = String(s || ''); var m = /^(\d{4})-(\d{2})$/.exec(s); if (m) return MONTHS[+m[2] - 1] + ' ' + m[1]; m = /^(\d{4})-Q(\d)$/.exec(s); return m ? 'Q' + m[2] + ' ' + m[1] : s; };
  var nf = function (v) { var p = String(v).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
  var madeBy = function (p) { return p.foundry && p.node && p.node.indexOf(p.foundry + ' ') === 0 ? [p.node] : [p.foundry, p.node]; };
  var chHref = function (id) { return CP.addr(id === 'geopolitics' ? '#/geopolitics' : '#' + id); }; // each chapter's own page
  var focusEl = function (el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } };
  var jump = function (y) { var prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.max(0, Math.round(y))); root.style.scrollBehavior = prev; }; // html glides; these are jumps

  var L = { built: false, items: [], byId: {}, byKey: {}, cur: null, paras: null, state: 'home', kind: 'all' };
  var sup = {}, chip = {}, co = {}, chs = {}, azRow = {}, groupEl = {}, counts = {}, XL = null, az = [];
  var view, main, head, field, box, inp, sugg, paneEl, browseEl, lettersEl, countEl;

  /* ---------- the entries ---------- */
  function init() {
    if (L.built) return;
    var list = $('#lk-items'); if (!list || !list.children.length) return;
    L.built = true;
    (DATA.suppliers || []).forEach(function (r) { sup[r.name] = r; });
    (DATA.landscape || []).forEach(function (c) { chip[c.id] = c; });
    (DATA.countries || []).forEach(function (c) { co[c.code] = c; });
    (DATA.chapters || []).forEach(function (c) { chs[c.id] = c; });
    view = $('.view[data-view="glossary"]'); main = $('#gl-view'); head = $('#gl-head'); field = $('#gl-field'); box = $('#gl-box'); inp = $('#gl-search'); sugg = $('#gl-sugg');
    paneEl = $('#gl-pane'); browseEl = $('#gl-browse'); lettersEl = $('#gl-jump'); countEl = $('#gl-count');
    L.state = main.getAttribute('data-state') || 'home';
    L.items = $$('#lk-items .gl-r').map(function (li, i) {
      var a = li.firstElementChild, rd = $('.gl-rd', li);
      // the entry's own words, under its link (build/build.js lkWords): its other names, its definition, a term's reason and the chapter it is read in
      var w = function (c) { var e = rd ? $('.' + c, rd) : null; return e ? e.textContent : ''; }, rc = rd ? $('.gl-rc a', rd) : null;
      var it = { id: li.id, kind: li.getAttribute('data-kind'), key: li.getAttribute('data-key') || '', name: a.textContent, label: li.getAttribute('data-label') || '',
        alias: li.getAttribute('data-alias') || '', text: li.getAttribute('data-text') || '', order: i, row: a, L: li.parentNode.parentNode.getAttribute('data-l') };
      a.setAttribute('data-id', it.id);
      it.lname = it.name.toLowerCase(); it.al = it.alias.toLowerCase().split('|').filter(Boolean);
      if (it.kind === 'term') {
        it.t = { term: it.name, aka: w('gl-ra'), plain: w('gl-rp'), why: w('gl-rw'), ch: rc ? rc.getAttribute('data-ch') : '', chTitle: rc ? rc.textContent : '' }; it.title = it.name;
        if (!it.text) it.text = [it.t.term, it.t.aka, it.t.plain].join(' ').toLowerCase().replace(/\s+/g, ' '); // a term's search words: its name, other names and definition
      } else {
        it.title = it.name; it.def = w('gl-rp');
        if (it.def && (it.kind === 'firm' || it.kind === 'country')) it.text += ' ' + it.def.toLowerCase().replace(/\s+/g, ' '); // a firm's and a country's role is among its search words
      }
      it.data = it.kind === 'firm' ? sup[it.key] : it.kind === 'chip' ? chip[it.key] : it.kind === 'country' ? co[it.key] : null;
      azRow[it.id] = a; L.byId[it.id] = it; L.byKey[it.key] = it;
      return it;
    });
    az = L.items; // the rows come A to Z, 0–9 first (build/build.js)
    counts = { all: L.items.length, term: 0, firm: 0, chip: 0, country: 0 };
    L.items.forEach(function (it) { counts[it.kind]++; });
    $$('#lk-items > .gl-g').forEach(function (g) { groupEl[g.getAttribute('data-l')] = g; });
    wire();
    setKind('all');
    view.setAttribute('data-gl', 'ready');
  }
  var fromHash = function () {
    var h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
    if (/^gl-/.test(h)) return L.byKey[h] || null;
    if (/^lk-/.test(h)) return L.byId[h] || null;
    return null;
  };
  var anchorOf = function (it) { return it.kind === 'term' ? it.key : it.id; };
  var say = function (s) { var e = $('#gl-say'); if (!e) return; e.textContent = ''; setTimeout(function () { e.textContent = s; }, 30); };

  /* ---------- an entry ---------- */
  /* the other entries named in an entry's own text link to them, the first time each is named and three to a paragraph at
     most: terms by their names and other names, firms by theirs, countries by name. "chip" is left alone, since nearly every
     entry uses the word. The words are unchanged */
  function xlinks() {
    if (XL) return XL;
    var map = {}, rank = { term: 0, firm: 1, country: 2 };
    var add = function (p, it) { p = String(p || '').trim(); if (p.length < 2) return; var k = p.toLowerCase(), o = map[k]; if (o && rank[o.it.kind] <= rank[it.kind]) return; map[k] = { it: it, p: p }; };
    L.items.forEach(function (it) {
      if (it.kind === 'chip' || it.id === DEFAULT) return;
      add(it.title, it);
      if (it.kind !== 'country') it.alias.split('|').forEach(function (a) { if (a && !/^for example/i.test(a)) add(a, it); });
    });
    var frag = Object.keys(map).map(function (k) { return map[k].p; }).sort(function (a, b) { return b.length - a.length; }).map(function (p) {
      var e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (p.length > 4 && /^[A-Za-z]/.test(p)) e = '[' + p.charAt(0).toLowerCase() + p.charAt(0).toUpperCase() + ']' + e.slice(1);
      return e;
    });
    // a name stands alone: no letter or digit on either side (the one before is matched and kept, since not every browser looks behind)
    return (XL = { map: map, re: new RegExp('(^|[^A-Za-z0-9])(' + frag.join('|') + ')(?![A-Za-z0-9])', 'g') });
  }
  function xl(text, used) {
    var X = xlinks(), s = String(text || ''), out = '', last = 0, m, n = 0; X.re.lastIndex = 0;
    while (n < 3 && (m = X.re.exec(s))) {
      var at = m.index + m[1].length, word = m[2], hit = X.map[word.toLowerCase()];
      if (!hit || used[hit.it.id]) { X.re.lastIndex = at + word.length; continue; }
      used[hit.it.id] = 1; n++;
      out += esc(s.slice(last, at)) + '<a class="gl-x" href="#' + esc(anchorOf(hit.it)) + '" data-id="' + esc(hit.it.id) + '">' + esc(word) + '</a>';
      last = at + word.length;
    }
    return out + esc(s.slice(last));
  }

  /* the chapters a term is read in, as the static page lists them (build/modules/reference-pages.js writes DATA.glossaryRefs):
     its own chapter first, then the others that use it; a term most chapters use names four of them, and the rest wait */
  function readsHTML(it) {
    var R = (DATA.glossaryRefs || {})[it.key], home = null, also = [];
    if (R) { home = R[0] ? chs[R[0]] || null : null; also = (R[1] || []).map(function (id) { return chs[id]; }).filter(Boolean); }
    if (!home && it.t.ch) home = chs[it.t.ch] || { id: it.t.ch, title: it.t.chTitle };
    if (!home && !also.length) return '';
    var a = function (c) { return '<a href="' + esc(chHref(c.id)) + '">' + esc(c.title) + '</a>'; };
    return '<p class="gl-reads">' + (home ? '<span class="gl-rr"><span class="k">Read it in</span>' + a(home) + '</span>' : '') +
      (also.length ? '<span class="gl-rr gl-also"><span class="k">' + (home ? 'Also in' : 'In') + '</span>' + also.slice(0, also.length > 5 ? 4 : 5).map(a).join(', ') +
        (also.length > 5 ? '<span class="gl-rest" hidden>, ' + also.slice(4).map(a).join(', ') + '</span> <button type="button" class="gl-tbtn" data-rest>and ' + (also.length - 4) + ' more</button>' : '') + '</span>' : '') + '</p>';
  }

  function termHTML(it, used) {
    var t = it.t;
    return '<p class="label gl-kind">' + esc(it.label) + '</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(t.term) + '</h2>' +
      (t.aka ? '<p class="gl-names">' + esc(t.aka) + '</p>' : '') + '<p class="gl-def">' + xl(t.plain, used) + '</p>' +
      (t.why ? '<p class="gl-p">' + xl(t.why, used) + '</p>' : '') + readsHTML(it);
  }

  var facts = function (rows) { return rows.length ? '<dl class="gl-facts">' + rows.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + (f[2] ? f[1] : esc(f[1])) + '</dd>'; }).join('') + '</dl>' : ''; };

  /* a firm: the Suppliers row's facts, its revenue as filed and linked to the filing, and the share of it from China with the
     firm's small China chart, as the Suppliers panel draws it (Suppliers.revenueHTML and exMini in src/app.js) */
  function firmHTML(it, used) {
    var r = it.data || {}, rows = [], S = CP.Suppliers || {};
    var where = [r.city, cname(r.country)].filter(Boolean).join(', ');
    if (r.chokepoint) rows.push(['Chokepoint level', '<span class="gl-chk gl-chk--' + esc(String(r.chokepoint).toLowerCase()) + '">' + esc(r.chokepoint) + '</span>', true]);
    if (where) rows.push(['Based in', where]);
    if (r.founded) rows.push(['Founded', String(r.founded)]);
    if (r.ownership || r.ticker) rows.push(['Ownership', [r.ownership, r.ticker ? 'ticker ' + r.ticker : ''].filter(Boolean).join(', ')]);
    if (r.customers && r.customers.length) rows.push(['Named customers', r.customers.join(', ')]);
    var rs = r.revenueShown, rev = rs && S.revenueHTML ? S.revenueHTML(rs) : '';
    if (rev) rows.push(['Revenue', rev, true]);
    else if (r.revenueUSDb != null) rows.push(['Revenue', '$' + (Math.round(r.revenueUSDb * 10) / 10).toLocaleString('en-US') + 'bn' + (r.revenueYear ? ', ' + r.revenueYear : '')]);
    // safeUrl escapes what it returns, so it is not escaped again
    if (r.china && r.china.href) rows.push(['From China', '<a href="' + CP.safeUrl(r.china.href) + '">' + esc(String(r.china.label).replace(/^China /, '')) + ' <span aria-hidden="true">→</span></a>' + (S.exMini ? S.exMini(r.china.href) : ''), true]);
    var meta = [r.category, r.subcategory].filter(Boolean).join(' · ');
    return '<p class="label gl-kind">Firm' + (r.country ? ' · ' + esc(cname(r.country)) : '') + '</p>' +
      '<h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(r.name || it.name) + (r.nativeName ? '<span class="gl-native">' + esc(r.nativeName) + '</span>' : '') + '</h2>' +
      (meta ? '<p class="gl-meta">' + esc(meta) + '</p>' : '') +
      (it.def ? '<p class="gl-def">' + xl(it.def, used) + '</p>' : '') +
      (r.shareNote ? '<p class="gl-p">' + xl(r.shareNote, used) + '</p>' : '') +
      (r.aiRelevance ? '<p class="gl-p">' + xl(r.aiRelevance, used) + '</p>' : '') +
      facts(rows) +
      // the filing's note (build/build.js leaves out the lines meant for the editors)
      (rev && rs.note ? '<p class="gl-note"><b>About the revenue figure.</b> ' + esc(rs.note) + '</p>' : '') +
      '<p class="gl-links"><a href="#/suppliers" data-sup="' + esc(r.name || it.name) + '">In the supplier list →</a>' + (r.source && CP.safeUrl(r.source) !== '#' ? '<a href="' + CP.safeUrl(r.source) + '" target="_blank" rel="noopener">Company page ↗</a>' : '') + '</p>';
  }

  function chipHTML(it, used) {
    var c = it.data || {}, p = c.process || {}, m = c.memory || {}, comp = c.compute || {}, rows = [];
    if (c.announced || c.shipping) rows.push(['Announced / shipping', [c.announced, c.shipping].filter(Boolean).map(when).join(' / ')]);
    if (p.node || p.foundry) rows.push(['Made by', madeBy(p).concat(p.country ? cname(p.country) : '').filter(Boolean).join(', ')]);
    if (m.type) rows.push(['Memory', [m.type, m.stacks ? m.stacks + ' stacks' : '', m.capacityGB ? m.capacityGB + ' GB' : '', m.bandwidthTBs ? m.bandwidthTBs + ' TB/s' : ''].filter(Boolean).join(', ')]);
    var fp = []; if (comp.fp16TFLOPS) fp.push('FP16 ' + comp.fp16TFLOPS.toLocaleString('en-US')); if (comp.fp8TFLOPS) fp.push('FP8 ' + comp.fp8TFLOPS.toLocaleString('en-US')); if (comp.fp4TFLOPS) fp.push('FP4 ' + comp.fp4TFLOPS.toLocaleString('en-US'));
    if (fp.length) rows.push(['Dense TFLOPS', fp.join(' · ')]);
    if (c.tdpW) rows.push(['Power', nf(c.tdpW) + ' W']);
    if (c.target) rows.push(['Built for', c.target]);
    return '<p class="label gl-kind">AI chip · ' + esc(c.vendor) + (c.vendorCountry ? ', ' + esc(cname(c.vendorCountry)) : '') + '</p>' +
      '<h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc((c.vendor || '') + ' ' + (c.name || it.name)) + '</h2>' +
      (c.status ? '<p class="gl-meta">' + esc(c.status) + '</p>' : '') +
      (it.def ? '<p class="gl-def">' + xl(it.def, used) + '</p>' : '') +
      (c.exportStatus ? '<p class="gl-p"><b>Export status.</b> ' + xl(c.exportStatus, used) + '</p>' : '') +
      facts(rows) + '<p class="gl-links"><a href="#/landscape?pick=' + esc(encodeURIComponent(c.id)) + '" data-chip="' + esc(c.id) + '">On AI Chips →</a></p>';
  }

  /* a country: the stages it leads, the chokepoint cards that name it, its shares, its firms. The firms whose country differs
     between the shares and the supplier list, as data/chokepoint-matrix-notes.md gives them, are named on the cards they touch */
  var SPLITS = {
    siemens: 'Siemens EDA is run from Oregon but owned by Siemens AG, so the EDA software share counts it under Germany and the supplier list under the US.',
    linde: 'Linde plc is incorporated in Ireland, with head offices in the UK and the US. The specialty gases share counts it under Germany for its roots in Linde AG, as Georgetown University\'s Emerging Technology Observatory does. The supplier list counts it under the UK.',
    arm: 'The core IP share counts Arm under the UK, where it has its headquarters, although SoftBank of Japan owns most of it.'
  };
  var SPLIT_BY = { DE: ['siemens', 'linde'], US: ['siemens'], GB: ['arm', 'linde'] };
  function countryFacts(cc) {
    var chapters = DATA.chapters || [];
    var stages = chapters.filter(function (ch) { return ch.stage; });
    var cardCount = chapters.filter(function (ch) { return ch.concentration; }).length; // only the stage chapters carry a chokepoint card
    var named = chapters.filter(function (ch) { return (ch.countries || []).some(function (x) { return x.code === cc; }); }).sort(function (a, b) { return (b.bandRank || 0) - (a.bandRank || 0) || a.number - b.number; });
    var led = stages.filter(function (ch) { var f = (ch.countries || [])[0]; return f && f.code === cc; });
    var extreme = led.filter(function (ch) { return ch.band === 'Extreme'; }).length;
    var firms = (DATA.suppliers || []).filter(function (r) { return r.country === cc; });
    var critical = firms.filter(function (r) { return r.chokepoint === 'Critical'; }).length, meta = [];
    if (led.length === 1) meta.push('leads 1 stage' + (extreme ? ', of extreme concentration' : ''));
    else if (led.length) meta.push('leads ' + led.length + ' stages' + (extreme ? ', ' + (extreme === led.length ? 'all' : extreme) + ' of them extreme' : ''));
    meta.push('named on ' + named.length + ' of ' + cardCount + ' chokepoint cards');
    if (firms.length) meta.push(firms.length + (firms.length === 1 ? ' firm' : ' firms') + ' in the supplier list' + (critical ? ', ' + critical + ' Critical' : ''));
    return { named: named, firms: firms, meta: meta.join(' · ') };
  }
  function countryHTML(it, used) {
    var c = it.data || {}, cc = c.code, F = countryFacts(cc), named = F.named, firms = F.firms;
    var num = function (v) { return Math.round(v) === v ? String(v) : String(Math.round(v * 10) / 10); };
    var segs = (DATA.matrix || []).filter(function (r) { return r.shares && r.shares[cc] != null; }).map(function (r) {
      var rank = Object.keys(r.shares).sort(function (a, b) { return r.shares[b] - r.shares[a]; }).indexOf(cc) + 1;
      var basis = r.basis === 'relayed' ? 'reported by ' + (r.relayedVia || 'a third party') : r.basis === 'derived' ? 'computed' : (r.basis || '');
      return { seg: r.segment, v: r.shares[cc], rank: rank, basis: basis, year: String(r.asOf || r.year || ''), method: r.method || '', capacity: /^capacity/i.test(r.metric || '') };
    }).sort(function (a, b) { return b.v - a.v; });
    var big = segs.filter(function (s) { return s.rank === 1 || s.v >= 1; }), small = segs.filter(function (s) { return s.rank !== 1 && s.v < 1; });
    var firmItem = {}; L.items.forEach(function (x) { if (x.kind === 'firm') firmItem[x.key] = x; });
    var cats = {}; firms.forEach(function (r) { (cats[r.category || 'Other'] = cats[r.category || 'Other'] || []).push(r); });
    var catNames = Object.keys(cats).sort(function (a, b) { return cats[b].length - cats[a].length || a.localeCompare(b); });
    var h = '<p class="label gl-kind">Country · ' + esc(cc) + '</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(c.name) + '</h2>' +
      '<p class="gl-meta">' + esc(F.meta) + '</p>' + (it.def ? '<p class="gl-def">' + xl(it.def, used) + '.</p>' : '');
    if (segs.length) {
      var topV = Math.max.apply(null, big.map(function (s) { return s.v; }));
      h += '<section class="gl-part" aria-labelledby="gl-sh"><h3 class="gl-h" id="gl-sh">Share of each segment</h3><ul class="gl-shares">' + big.map(function (s) {
        var m = [s.rank === 1 ? 'largest share' : 'rank ' + s.rank, s.basis, s.year].filter(Boolean).join(' · ');
        return '<li class="gl-share' + (s.v === topV ? ' is-top' : '') + '"' + (s.method ? ' title="' + esc(s.method) + '"' : '') + '><span class="gl-share-k">' + esc(s.seg) + '</span><span class="gl-share-bar" style="--w:' + Math.min(100, s.v) + '%" aria-hidden="true"></span><span class="gl-share-v">' + num(s.v) + '%</span><span class="gl-share-m">' + esc(m) + '</span></li>';
      }).join('') + '</ul>' + (small.length ? '<p class="gl-small">Under 1%: ' + esc(small.map(function (s) { return s.seg; }).join(', ')) + '.</p>' : '') + '</section>';
    }
    if (named.length) {
      h += '<section class="gl-part" aria-labelledby="gl-cd"><h3 class="gl-h" id="gl-cd">On the chokepoint cards</h3><ul class="gl-cards">' + named.map(function (ch) {
        var note = ((ch.countries || []).filter(function (x) { return x.code === cc; })[0] || {}).note || '';
        return '<li><a href="' + esc(chHref(ch.id)) + '"><span class="gl-card-t">' + esc(ch.title) + '</span>' + (ch.band ? '<span class="gl-card-b gl-card-b--' + esc(String(ch.band).toLowerCase()) + '">' + esc(ch.band) + '</span>' : '') + (note ? '<span class="gl-card-n">' + esc(note) + '</span>' : '') + '</a></li>';
      }).join('') + '</ul></section>';
    }
    if (firms.length) {
      h += '<section class="gl-part" aria-labelledby="gl-fl"><h3 class="gl-h" id="gl-fl"><span>In the supplier list</span><span class="gl-n">' + firms.length + ' across ' + catNames.length + (catNames.length === 1 ? ' category' : ' categories') + '</span></h3><ul class="gl-cats">' + catNames.map(function (cat) {
        var rows = cats[cat], crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; });
        return '<li><span>' + esc(cat) + '</span><span class="gl-cat-c">' + rows.length + '</span>' + (crit.length ? '<span class="gl-cat-f">' + crit.map(function (r) { var x = firmItem[r.name]; return x ? '<a href="#' + esc(x.id) + '" data-id="' + esc(x.id) + '">' + esc(r.name) + '</a>' : esc(r.name); }).join(' ') + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
      // a member of the EU-27: the bloc's firms counted together, as the Suppliers firm list can filter them (the member list is app.js's)
      var EU27 = (CP.Suppliers && CP.Suppliers.EU27) || [];
      if (EU27.indexOf(cc) >= 0) {
        var eu = (DATA.suppliers || []).filter(function (r) { return EU27.indexOf(r.country) >= 0; }), euCrit = eu.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
        h += '<p class="gl-small">Across the EU-27, the supplier list has ' + eu.length + ' firms' + (euCrit ? ', ' + euCrit + ' of them Critical' : '') + '. <a href="#/suppliers?group=eu">See them together on the Suppliers page →</a></p>';
      }
      h += '</section>';
    }
    // how the numbers give a firm its country: shares of a market's revenue go by parent company, capacity by plant, the
    // supplier list by each firm's own headquarters (data/chokepoint-matrix-notes.md, "Converting firm shares to country shares")
    if (segs.length) {
      var rev = segs.some(function (s) { return !s.capacity; }), cap = segs.some(function (s) { return s.capacity; }), note = [];
      if (rev) note.push('Country shares of a market\'s revenue count most firms under their parent company\'s home country' + (firms.length ? ', and the supplier list counts each firm under the country of its own headquarters.' : '.'));
      if (cap) note.push('Shares of manufacturing capacity count each plant under the country where it stands.');
      if (!rev && firms.length) note.push('The supplier list counts each firm under the country of its own headquarters.');
      (SPLIT_BY[cc] || []).forEach(function (k) { note.push(SPLITS[k]); });
      h += '<p class="gl-note">' + esc(note.join(' ')) + '</p>';
    }
    h += '<p class="gl-links">' + (c.panel ? '<a href="#/suppliers?country=' + esc(cc) + '">See what it makes on the Suppliers page →</a>' : '') + (firms.length ? '<a href="#/suppliers" data-supcc="' + esc(cc) + '">Its firms in the supplier list →</a>' : '') + '</p>';
    return h;
  }

  /* ---------- where the site uses it ---------- */
  /* every chapter's paragraphs and list items, as glossary.js carries them (build/build.js reads them from the chapters by
     the rules of domCorpus): each chapter has its own page since 28 Oct 2026, so the home page holds none of them. k is a
     passage's place among its chapter's, for the chapter's page to find it (flash) */
  function corpus() {
    if (L.paras) return L.paras;
    var G = window.CP_GLOSSARY && window.CP_GLOSSARY.passages; if (!G) return (L.paras = domCorpus());
    var out = [], at = {};
    G.paras.forEach(function (p) { var c = G.chapters[p[0]] || [p[0], '']; at[p[0]] = at[p[0]] || 0; out.push({ chapter: p[0], title: c[0], num: c[1], text: p[1], k: at[p[0]]++ }); });
    return (L.paras = out);
  }
  var textOf = function (node) { // like textContent, but an element boundary counts as a space
    var s = ''; for (var i = 0; i < node.childNodes.length; i++) { var n = node.childNodes[i]; if (n.nodeType === 3) s += n.nodeValue; else if (n.nodeType === 1) s += ' ' + textOf(n) + ' '; } return s;
  };
  // the passages of the chapters on this page, read from the page itself
  function domCorpus() {
    var out = [];
    $$('.view[data-view="stack"] article.chapter').forEach(function (ch) {
      var id = ch.id, title = ch.getAttribute('data-title') || id, num = ch.getAttribute('data-number') || '', k = 0;
      $$('p, li', ch).forEach(function (el) {
        // the chapter head's facts line (.ch-meta) and its citation line (.ch-cite) are not passages (correctness P1-4)
        if (el.closest('.chapter-sources, .plate-head, .ch-meta, .ch-cite, .chain, figure, .chapter-nav, nav')) return;
        // a card's marks (and the comma between two of them) are not the passage's words
        var clone = el.cloneNode(true); $$('sup.cite, sup.cite-sep, .gl-tip, .chip', clone).forEach(function (s) { s.parentNode.removeChild(s); });
        var text = textOf(clone).replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
        if (text.length > 40) out.push({ chapter: id, title: title, num: num, el: el, text: text, k: k++ });
      });
    });
    return out;
  }
  /* a passage followed from the Glossary to its chapter's page (src/app.js go, Router.after): found by its words, or else by its
     place, it lands under the masthead and flashes */
  function flash(para) {
    var mine = domCorpus().filter(function (p) { return p.chapter === para.chapter; });
    var p = mine.filter(function (x) { return x.text === para.text; })[0] || mine[para.k]; if (!p) return;
    CP.scrollToEl(p.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(p.el);
    p.el.classList.add('lk-flash'); setTimeout(function () { p.el.classList.remove('lk-flash'); }, 2600);
  }
  function regex(patterns, loose) { // loose: a typed query matches as a prefix, so "NXT:1980" finds "NXT:1980i"
    var parts = patterns.map(function (p) {
      p = String(p).trim(); if (!p) return null;
      var e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), bounded = /^[A-Za-z0-9]/.test(p) && /[A-Za-z0-9)]$/.test(p);
      // a short name like "Arm" or "ASE" keeps its capitals, or it matches "arm" and "ease"; longer names may be written either way
      if (p.length <= 4 && /[A-Z]/.test(p) && !loose) e = e.split('').map(function (ch) { return /[a-z]/i.test(ch) ? (/[A-Z]/.test(ch) ? ch : '[' + ch + ch.toUpperCase() + ']') : ch; }).join('');
      return bounded ? '\\b' + e + (loose ? '' : '(?![A-Za-z0-9])') : e;
    }).filter(Boolean);
    if (!parts.length) return null;
    var short = patterns.some(function (p) { return String(p).trim().length <= 4 && /[A-Z]/.test(p); });
    return new RegExp(parts.join('|'), short && !loose ? 'g' : 'gi');
  }
  function sentence(text, re) {
    re.lastIndex = 0; var m = re.exec(text); if (!m) return null;
    var start = text.lastIndexOf('. ', m.index); start = start < 0 ? 0 : start + 2;
    var end = text.indexOf('. ', m.index + m[0].length); end = end < 0 ? text.length : end + 1;
    var s = text.slice(start, end).trim();
    if (s.length > 320) { var a = Math.max(0, m.index - start - 140); s = (a ? '… ' : '') + s.slice(a, a + 300).trim() + ' …'; }
    return s;
  }
  var patternsOf = function (it) { var p = it.kind === 'chip' ? [] : [it.name]; it.alias.split('|').forEach(function (a) { if (a) p.push(a); }); if (it.kind === 'chip' && !p.length) p = [it.name]; return p; };
  /* every place the site uses it, in the site's order: the chapters, the Export Controls entries, the board, AI Chips, Suppliers */
  function mentions(patterns, kind, key) {
    var re = regex(patterns, kind === 'raw'); if (!re) return [];
    var hits = [], test = function (t) { re.lastIndex = 0; return re.test(t); };
    var mark = function (s) { return esc(s).replace(re, function (x) { return '<mark>' + x + '</mark>'; }); };
    corpus().forEach(function (p, i) { var s = sentence(p.text, re); if (s) hits.push({ src: 'Chapter ' + p.num, sub: p.title, html: mark(s), href: CP.addr('#' + p.chapter), para: i }); });
    (Array.isArray(DATA.timeline) ? DATA.timeline : ((DATA.timeline || {}).events || [])).forEach(function (e) { var t = [e.gist || '', e.title || '', e.summary || ''].join(' '); if (!test(t)) return; var s = sentence(e.gist && test(e.gist) ? e.gist : (e.summary || e.title), re) || e.title; hits.push({ src: 'Export Controls', sub: e.date, html: mark(s), href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }); }); // the entry's own address opens it
    (Array.isArray(DATA.flows) ? DATA.flows : ((DATA.flows || {}).flows || [])).forEach(function (f) { (f.states || []).forEach(function (st) { if (st.label && test(st.label)) hits.push({ src: 'Export Controls', sub: f.name, html: mark(st.label), href: st.event ? '#/controls/' + encodeURIComponent(st.event) : '#/controls' }); }); }); // a board state links to the entry that set it
    (DATA.landscape || []).forEach(function (c) { if (kind === 'chip' && c.id === key) return; var s = sentence([c.notes || '', c.exportStatus || ''].join(' '), re); if (s) hits.push({ src: 'AI Chips', sub: c.vendor + ' ' + c.name, html: mark(s), href: '#/landscape?pick=' + encodeURIComponent(c.id), chip: c.id }); });
    (DATA.suppliers || []).forEach(function (r) { if (kind === 'firm' && r.name === key) return; var s = sentence([r.role || '', r.shareNote || '', r.aiRelevance || ''].join(' '), re); if (s) hits.push({ src: 'Suppliers', sub: r.name, html: mark(s), href: '#/suppliers', sup: r.name }); });
    return hits;
  }
  var LIMIT = 6, lastHits = [];
  var rowHTML = function (h) {
    var attrs = h.para != null ? ' data-para="' + h.para + '"' : h.chip ? ' data-chip="' + esc(h.chip) + '"' : h.sup ? ' data-sup="' + esc(h.sup) + '"' : '';
    return '<li><a href="' + esc(h.href) + '"' + attrs + '><span class="gl-src"><b>' + esc(h.src) + '</b> ' + esc(h.sub) + '</span><span class="gl-txt">' + h.html + '</span></a></li>';
  };
  function passagesHTML(hits, kind) {
    lastHits = hits;
    var n = hits.length;
    var head = '<h3 class="gl-h" id="gl-wh"><span>Where it appears</span>' + (n ? '<span class="gl-n">' + n + (n === 1 ? ' place' : ' places') + '</span>' : '') + '</h3>';
    if (!n) return '<section class="gl-part" aria-labelledby="gl-wh">' + head + '<p class="gl-nil">' + (kind === 'firm' ? 'Only in the supplier list.' : kind === 'chip' ? 'Only on the AI Chips page.' : kind === 'term' ? 'Only in this entry.' : 'Nowhere else.') + '</p></section>';
    return '<section class="gl-part" aria-labelledby="gl-wh">' + head + '<ul class="gl-men">' + hits.slice(0, LIMIT).map(rowHTML).join('') + '</ul>' +
      (n > LIMIT ? '<p class="gl-more"><button type="button" data-all>Show all ' + n + '</button></p>' : '') + '</section>';
  }
  function nearest(q) { // names a typo away: an edit distance of one or two against each word of each name
    q = q.toLowerCase(); if (q.length < 4) return [];
    var dist = function (a, b) { var m = a.length, n = b.length, prev = [], cur = [], i, j; for (j = 0; j <= n; j++) prev[j] = j; for (i = 1; i <= m; i++) { cur = [i]; for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
    var scored = [];
    L.items.forEach(function (it) {
      var best = dist(q, it.lname);
      it.lname.split(/[\s()\-]+/).forEach(function (w) { if (w.length >= 3) best = Math.min(best, dist(q, w)); });
      if (best <= (q.length >= 8 ? 3 : 2)) scored.push({ it: it, d: best });
    });
    return scored.sort(function (a, b) { return a.d - b.d; }).slice(0, 5).map(function (x) { return x.it; });
  }

  /* ---------- the first sentence of each definition, for the suggestions ---------- */
  var defOf = function (it) { if (it.kind === 'term') return it.t.plain; return it.kind === 'country' && it.def ? it.def + '.' : it.def; }; // the words under each row
  var ABBR = /(?:\b(?:e\.g|i\.e|Inc|Co|Corp|Ltd|No|Nos|St|vs|approx|Mr|Dr|Jr|Sr|cf|ca)|\b[A-Z])$/;
  function firstSentence(s) {
    s = String(s || '').trim(); var re = /[.!?](?=["”’)]?(?:\s+[A-Z0-9“"(]|\s*$))/g, m;
    while ((m = re.exec(s))) { if (ABBR.test(s.slice(0, m.index))) continue; return s.slice(0, m.index + 1); }
    return s;
  }
  var firstOf = function (it) { if (it.first == null) it.first = firstSentence(defOf(it)); return it.first; };

  /* ---------- the three states; the field slides from the middle to the bar ---------- */
  var mh = function () { return CP.headerH(); };
  function measure() {
    if (!L.built) return;
    root.style.setProperty('--gl-bar-h', (L.state === 'home' ? 0 : Math.round(head.getBoundingClientRect().height)) + 'px');
    root.style.setProperty('--gl-strip-h', (L.state === 'browse' && !narrow() ? Math.round(lettersEl.getBoundingClientRect().height) : 0) + 'px');
  }
  var browseY = 0;
  function setState(s, animate) {
    if (s === L.state) { measure(); return; }
    var title = $('#gl-title');
    var from = animate && L.state === 'home' && !reduce() ? [title.getBoundingClientRect(), box.getBoundingClientRect()] : null;
    L.state = s; main.setAttribute('data-state', s);
    $('.gl-az-link', head)[s === 'browse' ? 'setAttribute' : 'removeAttribute']('aria-current', 'page');
    $('#gl-btns').inert = s !== 'home'; $('#gl-hold').inert = s !== 'home';
    measure();
    if (from) { // the name and the field glide from the middle of the first screen to their places in the bar
      jump(0);
      var to = [title.getBoundingClientRect(), box.getBoundingClientRect()], k = from[0].height / (to[0].height || 1);
      title.style.transition = 'none'; box.style.transition = 'none';
      if (!narrow()) title.style.transform = 'translate(' + (from[0].left - to[0].left) + 'px,' + (from[0].top - to[0].top) + 'px) scale(' + k + ')';
      box.style.transform = 'translate(' + (from[1].left - to[1].left) + 'px,' + (from[1].top - to[1].top) + 'px)';
      box.getBoundingClientRect();
      requestAnimationFrame(function () {
        title.style.transition = 'transform 0.28s cubic-bezier(.2,.7,.2,1)'; box.style.transition = 'transform 0.28s cubic-bezier(.2,.7,.2,1), border-color 0.15s';
        title.style.transform = ''; box.style.transform = '';
        setTimeout(function () { title.style.transition = ''; box.style.transition = ''; }, 320);
      });
    }
  }
  // a move within the Glossary makes a history entry (or replaces this one), so Back walks back through them
  var setHash = function (h, how, st) { if (how === 'push') history.pushState(st || { gl: 1 }, '', h); else if (how === 'replace') history.replaceState(st || history.state, '', h); };
  var homeHash = function () { return location.pathname + location.search; }; // the first screen is the page's own address, with no hash

  function openEntry(it, o) {
    o = o || {}; if (!it) return;
    L.cur = it; closeSugg();
    paneEl.innerHTML = entryHTML(it);
    if (o.hash) { var h = '#' + anchorOf(it); if (location.hash !== h) setHash(h, o.hash); }
    setState('entry', o.animate);
    jump(0);
    markRow();
    if (o.focus) focusEl($('#gl-hw'));
  }
  // no entry, but the site may still use the words: its own address, with the words kept in the history entry
  function openRaw(q, o) {
    o = o || {}; L.cur = null; closeSugg();
    paneEl.innerHTML = rawHTML(q);
    if (o.hash) setHash('#gl-find', location.hash === '#gl-find' ? 'replace' : o.hash, { gl: 1, q: q });
    setState('entry', o.animate);
    jump(0); markRow();
    if (o.focus) focusEl($('#gl-hw'));
  }
  /* the index's addresses: #a-z, #a-z/terms (one kind), #a-z/b (all kinds, at a letter) */
  var KSLUG = { term: 'terms', firm: 'firms', chip: 'ai-chips', country: 'countries' }, SLUGK = {};
  Object.keys(KSLUG).forEach(function (k) { SLUGK[KSLUG[k]] = k; });
  var azHash = function (k, l) { return '#a-z' + (l ? '/' + l.toLowerCase() : k && k !== 'all' ? '/' + KSLUG[k] : ''); };
  function parseAz(h) {
    var m = /^a-z(?:\/(.*))?$/i.exec(h); if (!m) return null;
    var s = String(m[1] || '').toLowerCase(), l = s === '0-9' ? s : s.toUpperCase();
    if (SLUGK[s]) return { kind: SLUGK[s] };
    return { kind: 'all', letter: s && LETTERS.indexOf(l) >= 0 ? l : null };
  }
  function openBrowse(o) {
    o = o || {}; closeSugg();
    if (o.kind && o.kind !== L.kind) setKind(o.kind);
    var h = azHash(L.kind, o.letter);
    if (o.hash && location.hash !== h) setHash(h, o.hash);
    setState('browse', o.animate);
    markRow(); thumbs();
    if (o.letter && groupEl[o.letter] && !groupEl[o.letter].hidden) toLetter(o.letter); else jump(o.restore ? browseY : 0);
    var f = o.letter && groupEl[o.letter] && !groupEl[o.letter].hidden ? $('#gl-lh-' + o.letter) : $('#gl-bh');
    if (o.focus) focusEl(f);
    spy(true);
  }
  function goHome(o) {
    o = o || {}; L.cur = null;
    inp.value = ''; lastQ = null; closeSugg(); $('#gl-clear').hidden = true;
    if (o.hash) setHash(homeHash(), o.hash, null);
    setState('home');
    jump(0);
    if (o.focus) focusEl(inp);
  }

  /* ---------- an entry, with its neighbors A to Z (within the kind shown, when it came from the index of one kind) ---------- */
  function entryHTML(it) {
    var used = {}; used[it.id] = 1;
    var body = it.kind === 'term' ? termHTML(it, used) : it.kind === 'firm' ? firmHTML(it, used) : it.kind === 'chip' ? chipHTML(it, used) : countryHTML(it, used);
    var list = L.state === 'browse' && L.kind !== 'all' ? az.filter(function (x) { return x.kind === L.kind; }) : az, i = list.indexOf(it);
    if (i < 0) { list = az; i = az.indexOf(it); }
    var prev = list[i - 1], next = list[i + 1];
    var pn = '<nav class="gl-pn" aria-label="Neighboring entries">' +
      (prev ? '<a class="gl-prev" href="#' + esc(anchorOf(prev)) + '" data-id="' + esc(prev.id) + '" rel="prev"><span class="label">Previous</span><span class="gl-pn-n">' + esc(prev.title) + '</span></a>' : '') +
      (next ? '<a class="gl-next" href="#' + esc(anchorOf(next)) + '" data-id="' + esc(next.id) + '" rel="next"><span class="label">Next</span><span class="gl-pn-n">' + esc(next.title) + '</span></a>' : '') + '</nav>';
    return '<div class="gl-e">' + body + passagesHTML(mentions(patternsOf(it), it.kind, it.key), it.kind) + pn + '</div>';
  }
  function rawHTML(q) {
    var near = nearest(q);
    return '<div class="gl-e"><p class="label gl-kind">No entry</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(q) + '</h2>' +
      (near.length ? '<p class="gl-meta">Did you mean ' + near.map(function (it) { return '<a class="gl-x" href="#' + esc(anchorOf(it)) + '" data-id="' + esc(it.id) + '">' + esc(it.title) + '</a>'; }).join(', ') + '</p>' : '') +
      passagesHTML(mentions([q], 'raw', q), 'raw') + '</div>';
  }

  /* ---------- the suggestions: names first, then the entries whose words hold every word typed. A name that contains the
     query, or another name that starts with it, is a name match ("dutch", "prc", "foxconn"), and one that is exactly the query
     ("us", "tsmc") tops them ---------- */
  var opts = [], act = -1, expanded = false, lastQ = null;
  // as many suggestions as the window holds under the field, four to eight (six on a phone, whose keyboard takes the rest)
  var rows = function () { var top = L.state === 'home' && narrow() ? mh() + 72 : box.getBoundingClientRect().top + 54; return Math.max(4, Math.min(narrow() ? 6 : 8, Math.floor((window.innerHeight - top - 100) / 61))); };
  function matches(q) {
    var lq = q.trim().toLowerCase(), words = lq.split(/\s+/).filter(Boolean);
    var res = L.items.filter(function (it) { return words.every(function (w) { return it.text.indexOf(w) >= 0 || it.lname.indexOf(w) >= 0; }); });
    res.forEach(function (it) {
      it.isName = it.lname.indexOf(lq) >= 0 || it.al.some(function (a) { return a.indexOf(lq) === 0; });
      it.isExact = it.lname === lq || it.al.indexOf(lq) >= 0;
      it.starts = it.lname.indexOf(lq) === 0;
      // a name match through another name shows that name, so "pellicle" under "euv" says why it is there
      it.via = it.isName && it.lname.indexOf(lq) < 0 ? (it.alias.split('|').filter(function (a) { return a.toLowerCase().indexOf(lq) === 0; })[0] || '') : '';
    });
    var names = res.filter(function (it) { return it.isName; }).sort(function (a, b) { return (b.isExact - a.isExact) || (b.starts - a.starts) || (a.order - b.order); });
    return { names: names, rest: res.filter(function (it) { return !it.isName; }) };
  }
  var optHTML = function (it, i) {
    return '<li class="gl-opt" role="option" id="gl-o' + i + '" data-opt="' + i + '" aria-selected="false"><span class="gl-opt-h"><span class="gl-opt-n">' + esc(it.title) + '</span><span class="gl-opt-k">' + KIND[it.kind] + (it.via ? ' · ' + esc(it.via) : '') + '</span></span>' +
      (firstOf(it) ? '<span class="gl-opt-d">' + esc(firstOf(it)) + '</span>' : '') + '</li>';
  };
  function renderSugg() {
    var q = inp.value.trim();
    $('#gl-clear').hidden = !inp.value;
    if (!q) { closeSugg(); return; }
    if (q !== lastQ) { expanded = false; act = -1; }
    lastQ = q;
    var m = matches(q), all = m.names.concat(m.rest), cap = expanded ? all.length : rows();
    var n = m.names.slice(0, cap), r = m.rest.slice(0, Math.max(0, cap - n.length)), h = '';
    opts = n.concat(r);
    if (all.length) {
      if (n.length) h += '<ul role="group" aria-label="Name matches">' + n.map(function (it, i) { return optHTML(it, i); }).join('') + '</ul>';
      if (r.length) h += '<ul role="group" aria-labelledby="gl-g2"><li class="gl-grp" id="gl-g2" role="presentation">In the text</li>' + r.map(function (it, i) { return optHTML(it, n.length + i); }).join('') + '</ul>';
      h = '<div role="listbox" id="gl-opts" aria-label="Suggestions">' + h + '</div>';
      if (all.length > cap) h += '<button type="button" class="gl-all" data-more>Show all ' + all.length + ' matches</button>';
      say(all.length + (all.length === 1 ? ' match' : ' matches'));
    } else {
      var near = nearest(q);
      opts = near.concat([{ raw: q }]);
      h = '<p class="gl-none">No entry matches <b>' + esc(q) + '</b>.' + (near.length ? ' Did you mean' : '') + '</p><div role="listbox" id="gl-opts" aria-label="Suggestions"><ul role="group">' +
        near.map(function (it, i) { return optHTML(it, i); }).join('') +
        '<li class="gl-opt gl-opt-raw" role="option" id="gl-o' + near.length + '" data-opt="' + near.length + '" aria-selected="false"><span class="gl-opt-h"><span class="gl-opt-n">Every place the site uses “' + esc(q) + '”</span></span></li></ul></div>';
      say('No entry matches. ' + (near.length ? near.length + ' near names.' : ''));
    }
    sugg.innerHTML = h; sugg.hidden = false; field.classList.add('is-open'); inp.setAttribute('aria-expanded', 'true');
    markOpt();
  }
  function closeSugg() { if (!sugg) return; sugg.hidden = true; sugg.innerHTML = ''; field.classList.remove('is-open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); opts = []; act = -1; }
  function markOpt() {
    $$('.gl-opt', sugg).forEach(function (li) { li.setAttribute('aria-selected', +li.getAttribute('data-opt') === act ? 'true' : 'false'); });
    if (act >= 0) { inp.setAttribute('aria-activedescendant', 'gl-o' + act); var li = $('#gl-o' + act); if (li) li.scrollIntoView({ block: 'nearest' }); }
    else inp.removeAttribute('aria-activedescendant');
  }
  function choose(o) {
    if (!o) return;
    var animate = L.state === 'home';
    if (o.raw) openRaw(o.raw, { hash: 'push', focus: true, animate: animate });
    else openEntry(o, { hash: 'push', focus: true, animate: animate });
  }
  // Enter opens the suggestion marked by the arrows, or else the top one
  function lookUp() {
    var q = inp.value.trim();
    if (!q) return;
    if (!opts.length || lastQ !== q) renderSugg();
    choose(act >= 0 ? opts[act] : opts[0]);
  }
  // on a phone the field rises to the top of the window as the reader types, so the suggestions clear the keyboard
  function lift() { if (L.state !== 'home' || !narrow()) return; var y = field.getBoundingClientRect().top + window.pageYOffset - mh() - 10; if (window.pageYOffset < y) jump(y); }

  /* ---------- Browse A to Z: every name under its letter, one kind at a time ---------- */
  function setKind(k) {
    L.kind = k;
    $$('#gl-kinds button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === k ? 'true' : 'false'); });
    L.items.forEach(function (it) { it.row.parentNode.hidden = !(k === 'all' || it.kind === k); });
    LETTERS.forEach(function (l) { var g = groupEl[l]; if (g) g.hidden = !$$('.gl-r:not([hidden])', g).length; });
    var kk = KINDS.filter(function (x) { return x[0] === k; })[0];
    countEl.textContent = counts[k] + ' ' + (counts[k] === 1 ? kk[3] : kk[2]);
    thumbs();
  }
  function thumbs() {
    lettersEl.innerHTML = LETTERS.map(function (l) {
      var g = groupEl[l], on = g && !g.hidden;
      return on ? '<button type="button" data-l="' + l + '" aria-label="' + (l === '0-9' ? 'Numbers' : l) + '">' + showL(l) + '</button>' : '<span aria-hidden="true">' + showL(l) + '</span>';
    }).join('');
    spy(true);
  }
  function markRow() {
    $$('.gl-r a[aria-current]', browseEl).forEach(function (a) { a.removeAttribute('aria-current'); });
    var a = L.cur && azRow[L.cur.id]; if (a) a.setAttribute('aria-current', 'true');
  }
  // the strip of letters marks the letter at the top of the index
  var spyQ = false;
  function spy(now) {
    if (!L.built || L.state !== 'browse' || !here() || (spyQ && !now)) return; spyQ = true;
    requestAnimationFrame(function () {
      spyQ = false;
      var line = mh() + head.getBoundingClientRect().height + (narrow() ? 0 : lettersEl.getBoundingClientRect().height) + 40, curL = null;
      LETTERS.forEach(function (l) { var g = groupEl[l]; if (g && !g.hidden && g.getBoundingClientRect().top <= line) curL = l; });
      if (!curL) curL = LETTERS.filter(function (l) { return groupEl[l] && !groupEl[l].hidden; })[0];
      $$('button', lettersEl).forEach(function (b) { if (b.getAttribute('data-l') === curL) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    });
  }
  function toLetter(l) {
    var g = groupEl[l]; if (!g || g.hidden) return;
    var off = mh() + head.getBoundingClientRect().height + (narrow() ? 0 : lettersEl.getBoundingClientRect().height);
    jump(g.getBoundingClientRect().top + window.pageYOffset - off + 1);
    spy(true);
  }

  /* ---------- the reader's moves ---------- */
  function wire() {
    inp.addEventListener('input', function () { renderSugg(); if (inp.value.trim()) lift(); });
    inp.addEventListener('focus', function () { if (inp.value.trim()) renderSugg(); });
    inp.addEventListener('blur', function () { setTimeout(function () { if (!field.contains(document.activeElement)) closeSugg(); }, 120); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (sugg.hidden) { renderSugg(); if (sugg.hidden) return; }
        if (e.key === 'ArrowDown') act = act + 1 >= opts.length ? opts.length - 1 : act + 1; else act = act - 1 < -1 ? -1 : act - 1;
        markOpt();
      } else if (e.key === 'Enter') { e.preventDefault(); lookUp(); }
      else if (e.key === 'Escape') {
        if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; lastQ = null; closeSugg(); $('#gl-clear').hidden = true; say('Search cleared'); }
        else if (!sugg.hidden) { e.preventDefault(); closeSugg(); }
      }
    });
    $('#gl-clear').addEventListener('click', function () { inp.value = ''; lastQ = null; closeSugg(); this.hidden = true; inp.focus(); });
    sugg.addEventListener('mousedown', function (e) { if (e.target.closest('.gl-opt, [data-more]')) e.preventDefault(); }); // the field keeps the focus
    sugg.addEventListener('click', function (e) {
      var li = e.target.closest('.gl-opt'); if (li) { choose(opts[+li.getAttribute('data-opt')]); return; }
      if (e.target.closest('[data-more]')) { expanded = true; renderSugg(); inp.focus(); }
    });
    sugg.addEventListener('mousemove', function (e) { var li = e.target.closest('.gl-opt'); if (li && +li.getAttribute('data-opt') !== act) { act = +li.getAttribute('data-opt'); markOpt(); } });
    $('#gl-rand').addEventListener('click', function () { var it; do { it = L.items[Math.floor(Math.random() * L.items.length)]; } while (it === L.cur && L.items.length > 1); openEntry(it, { hash: 'push', focus: true, animate: true }); });
    $('#gl-kinds').addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (!b) return; setKind(b.getAttribute('data-k')); if (L.state === 'browse') { setHash(azHash(L.kind), 'replace'); jump(0); } });
    lettersEl.addEventListener('click', function (e) { var b = e.target.closest('button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); });
    lettersEl.addEventListener('pointerdown', function (e) { // on a phone a finger can run down the letters
      if (!narrow() || e.pointerType === 'mouse') return;
      var go = function (ev) { var el = document.elementFromPoint(ev.clientX, ev.clientY), b = el && el.closest && el.closest('.gl-jump button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); };
      go(e);
      var move = function (ev) { ev.preventDefault(); go(ev); }, up = function () { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
      document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up);
    });

    /* a name opens its entry, the name of the Glossary goes back to the first screen, a kind, a letter or A to Z opens the index;
       the passages and the links out carry what the page they open should do (the supplier list's filter, a chip's card, a
       passage to flash) */
    view.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[data-id]');
      if (a && L.byId[a.getAttribute('data-id')]) { e.preventDefault(); openEntry(L.byId[a.getAttribute('data-id')], { hash: 'push', focus: true }); return; }
      if (e.target.closest('[data-home]')) { e.preventDefault(); if (L.state !== 'home') goHome({ hash: 'push', focus: e.detail === 0 }); else inp.focus(); return; }
      var ak = e.target.closest('[data-azk]'), al = e.target.closest('[data-azl]');
      if (ak || al) { e.preventDefault(); openBrowse({ hash: 'push', focus: true, animate: L.state === 'home', kind: ak ? ak.getAttribute('data-azk') : 'all', letter: al ? al.getAttribute('data-azl') : null }); return; }
      if (e.target.closest('[data-az]')) { e.preventDefault(); openBrowse({ hash: 'push', focus: true, animate: L.state === 'home' }); return; }
      var p = e.target.closest('a[data-para]');
      if (p) {
        e.preventDefault(); var para = corpus()[+p.getAttribute('data-para')]; if (!para) return;
        // on another page (the chapter's own): the passage goes with the reader, and that page lands on it (flash)
        if (!para.el) { CP.go('#' + para.chapter, { para: { chapter: para.chapter, k: para.k, text: para.text } }); return; }
        location.hash = '#' + para.chapter;
        setTimeout(function () { CP.scrollToEl(para.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(para.el); para.el.classList.add('lk-flash'); setTimeout(function () { para.el.classList.remove('lk-flash'); }, 2600); }, 140);
        return;
      }
      // the supplier list takes the whole filter from the link (a firm's name, or a country), so an older search cannot narrow it.
      // The supplier list and AI Chips are the home page's: the link goes there with what it should do (CP.go, src/app.js Router.after)
      var out = function (a, act) { if (CP.go && CP.go(a.getAttribute('href'), act)) { e.preventDefault(); return true; } return false; };
      var s = e.target.closest('a[data-sup]'); if (s) { var q = s.getAttribute('data-sup'); if (!out(s, { q: q })) setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ q: q }); }, 60); return; }
      var sc = e.target.closest('a[data-supcc]'); if (sc) { var cc = sc.getAttribute('data-supcc'); if (!out(sc, { country: cc })) setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ country: cc }); }, 60); return; }
      // a chip opens its card on the chart, adding nothing
      var ch = e.target.closest('a[data-chip]'); if (ch) { var id = ch.getAttribute('data-chip'); if (!out(ch, { chip: id })) setTimeout(function () { if (CP.Landscape && CP.Landscape.openCard) CP.Landscape.openCard(id, { show: true }); }, 60); return; }
      var more = e.target.closest('[data-rest]');
      if (more) { var rest = more.parentNode.querySelector('.gl-rest'); rest.hidden = false; more.parentNode.removeChild(more); focusEl(rest.querySelector('a')); return; }
      var all = e.target.closest('[data-all]');
      if (all) { var ul = all.closest('.gl-part').querySelector('.gl-men'), n = ul.children.length; ul.innerHTML = lastHits.map(rowHTML).join(''); all.parentNode.parentNode.removeChild(all.parentNode); var nx = ul.children[n] && ul.children[n].querySelector('a'); if (nx) focusEl(nx); }
    });
    // the masthead's Glossary tab, on the Glossary's own page, returns to the first screen in place, as the Glossary's name does
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.tabs a[data-view="glossary"]') : null;
      if (!a || !here() || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); if (L.state !== 'home') goHome({ hash: 'push' });
    });
    // "/" goes to this search while the Glossary shows (the site search keeps Ctrl+K); it is heard before the site's own "/"
    window.addEventListener('keydown', function (e) {
      if (e.key !== '/' || !here() || e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement || document.body, cps = $('#cp-search');
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName || '') || a.isContentEditable || (cps && !cps.hidden)) return;
      e.preventDefault(); e.stopPropagation(); inp.focus(); inp.select();
    }, true);
    // the index keeps the reader's place, so Back from an entry returns to it
    window.addEventListener('scroll', function () { if (L.state === 'browse' && here()) { browseY = window.pageYOffset; spy(); } }, { passive: true });
    var rs = null;
    window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { measure(); spy(true); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); if (pendL && L.state === 'browse' && here()) toLetter(pendL); pendL = null; spy(true); });
  }

  /* ---------- the address leads: Back and Forward, and a link from a chapter, a pop-up or the site search ---------- */
  var pendL = null; // a letter in the address on arrival, gone to again once the faces have set the rows' heights
  /* the static copy's anchors (until 30 Oct 2026; shared links and search results may still carry them): a term (#euv), a
     letter (#letter-s) and a list (#list-firms) take the Glossary's own address, in place */
  var OLD = { 'list-firms': 'a-z/firms', 'list-chips': 'a-z/ai-chips', 'list-countries': 'a-z/countries' };
  function oldAnchor(h) {
    if (!h || /^(gl|lk)-|^a-z(\/|$)|^\//.test(h)) return '';
    var m = /^letter-(0-9|[a-z])$/.exec(h);
    var to = OLD[h] || (m ? 'a-z/' + m[1] : L.byKey['gl-' + h] ? 'gl-' + h : '');
    if (to) history.replaceState(history.state, '', location.pathname + location.search + '#' + to);
    return to;
  }
  function route(o) {
    var h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
    h = oldAnchor(h) || h;
    var it = fromHash();
    if (it) { openEntry(it, { hash: false, focus: o.focus }); return; }
    var A = parseAz(h); // a letter is gone to on arrival; Back to the index keeps the place left
    if (A) { var back = !o.first && !o.away && L.state !== 'home'; if (o.first) pendL = A.letter; openBrowse({ hash: false, kind: A.kind, letter: back ? null : A.letter, restore: back, focus: o.focus }); return; }
    if (h === 'gl-find' && history.state && history.state.q) { openRaw(history.state.q, { hash: false, focus: o.focus }); return; }
    goHome({ hash: false });
  }
  /* each route to the Glossary: the address decides what shows. From another view or page (a pop-up's Look it up, a search
     result) the entry's name or the index's head takes focus */
  function activate() {
    init(); if (!L.built) return;
    var R = CP.Router || {}, first = !L.arrived;
    // came: the page's first route is a move from another page of the site; away: a move from another view of this page
    var came = first && /^https?:/.test(document.referrer) && document.referrer.indexOf(location.origin + '/') === 0 && document.referrer !== location.href;
    var away = !!R.from && R.from !== 'glossary';
    L.arrived = true;
    route({ first: first, away: away, focus: came || !!away || (!first && !!fromHash()) });
    measure(); spy(true);
  }
  // a load lands an entry at its top: the browser may keep an earlier place a moment past load, so the top is set again
  window.addEventListener('load', function () { if (here() && L.state === 'entry' && window.pageYOffset) jump(0); });

  CP.Lookup = L;
  L.show = function (id) { var it = L.byId[id] || L.byKey[id]; if (it) openEntry(it, { hash: 'replace' }); };
  L.search = function (s) { inp.focus(); inp.value = s; renderSugg(); lift(); };
  L.browse = function (k, l) { openBrowse({ hash: 'replace', kind: k || 'all', letter: l || null }); };
  L.first = firstOf;
  L.flash = flash; L.domCorpus = domCorpus; L.corpus = corpus;
  /* The passages come with glossary.js (build/build.js), fetched when the Glossary first opens (CP.need); the head paints at
     once, and the parts that wait for them stay hidden until the Glossary is ready (lookup.css, .gl-wait) */
  L.load = function (fn) {
    if (window.CP_GLOSSARY || !CP.need) { fn(); return; }
    CP.need('glossary.js', function () { fn(); var v = $('.view[data-view="glossary"]'); if (v && !v.hasAttribute('data-gl')) v.setAttribute('data-gl', 'empty'); });
  };
  CP.register('glossary', { activate: function () { L.load(activate); }, stage: false });
})();
