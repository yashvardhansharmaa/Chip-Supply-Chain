/* The Glossary (#/glossary) as an index and one entry: "Index and entry", the owner's choice of 29 Oct 2026 (the mockup and its
   notes are qa/excellence/glossary-alt/twopane/ in the main checkout).
   The index: the title and count, a labeled search, the kinds, and every entry A to Z, names only, under sticky letter heads,
   with a column of letters to jump by. The entry: one at a time, whole: its kind, its name and other names, what it is, the
   reason, the chapters it is read in, a firm's, chip's or country's facts, then every place the site uses it, and the entries
   on either side. On a wide screen (880 px and up) the index keeps its place under the masthead and scrolls on its own while
   the entry scrolls with the page. Under 880 px the index is the page, and an entry opens over it as a dialog with
   "‹ Glossary", previous and next; Back, that button or Escape return to the same row.
   The address names the entry shown: #gl-<slug> for a term (what the chapters' pop-ups and the site search link to),
   #lk-firm-, #lk-chip- and #lk-country- for the rest, and #lk-term-<slug> also opens a term; #/glossary opens chip on a wide
   screen and the list on a phone. The rows come with glossary.js (build/build.js) when the Glossary first opens (load): each
   row's li carries the entry's lk- id and its search data, and a term's link its gl- id, so every link the site writes lands
   whatever the search or kind. The firms, chips and countries are read from DATA; the passages from the chapters' paragraphs
   (glossary.js), the Export Controls entries, the board, AI Chips and the supplier list. */
(function () {
  var CP = window.CP; if (!CP) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, DATA = CP.DATA || {}, cname = CP.cname;
  var root = document.documentElement;
  var MQ = window.matchMedia ? matchMedia('(min-width: 880px)') : null;
  var wide = function () { return MQ ? MQ.matches : window.innerWidth >= 880; };
  var here = function () { return !!CP.Router && CP.Router.current === 'glossary'; };
  var KIND = { term: 'Term', firm: 'Firm', chip: 'AI chip', country: 'Country' };
  // each kind's button, its plural and its singular for the count line
  var KINDS = { all: ['entries', 'entry'], term: ['terms', 'term'], firm: ['firms', 'firm'], chip: ['AI chips', 'AI chip'], country: ['countries', 'country'] };
  var LETTERS = ['0-9'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  var showL = function (L) { return L === '0-9' ? '0–9' : L; };
  var DEFAULT = 'lk-term-chip'; // the opening entry: the word every chapter uses, defined from nothing (the mockup's notes)
  // an AI chip's facts in words, as AI Chips sets them: "2024-04" reads April 2024, "2024-Q4" Q4 2024; the node alone where it
  // already names the foundry ("TSMC 5 nm", not "TSMC TSMC 5 nm")
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var when = function (s) { s = String(s || ''); var m = /^(\d{4})-(\d{2})$/.exec(s); if (m) return MONTHS[+m[2] - 1] + ' ' + m[1]; m = /^(\d{4})-Q(\d)$/.exec(s); return m ? 'Q' + m[2] + ' ' + m[1] : s; };
  var nf = function (v) { var p = String(v).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p.length > 1 ? '.' + p[1] : ''); };
  var madeBy = function (p) { return p.foundry && p.node && p.node.indexOf(p.foundry + ' ') === 0 ? [p.node] : [p.foundry, p.node]; };
  var chHref = function (id) { return CP.addr(id === 'geopolitics' ? '#/geopolitics' : '#' + id); }; // each chapter's own page
  var focusEl = function (el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } };
  var jump = function (y) { var prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.max(0, Math.round(y))); root.style.scrollBehavior = prev; }; // html glides; these are jumps
  var ARROW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>', ARROW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  var L = { built: false, items: [], byId: {}, byKey: {}, kind: 'all', q: '', shown: [], cur: null, searching: false, paras: null, pushed: false, held: [] };
  var TERMS = {}, sup = {}, chip = {}, co = {}, chs = {}, azRow = {}, resRow = {}, groupEl = {}, counts = {}, XL = null;
  var listEl, jumpEl, paneEl, inp, countEl;

  /* ---------- the entries ---------- */
  function init() {
    if (L.built) return;
    var az = $('#lk-items'); if (!az) return;
    var G = window.CP_GLOSSARY || {};
    if (!az.children.length) az.innerHTML = G.items || '';
    if (!az.children.length) return;
    L.built = true;
    TERMS = G.terms || {};
    (DATA.suppliers || []).forEach(function (r) { sup[r.name] = r; });
    (DATA.landscape || []).forEach(function (c) { chip[c.id] = c; });
    (DATA.countries || []).forEach(function (c) { co[c.code] = c; });
    (DATA.chapters || []).forEach(function (c) { chs[c.id] = c; });
    listEl = $('#gl-list'); jumpEl = $('#gl-jump'); paneEl = $('#gl-pane'); inp = $('#gl-search'); countEl = $('#gl-count');
    L.items = $$('#lk-items .gl-r').map(function (li, i) {
      var a = li.firstElementChild;
      var it = { id: li.id, kind: li.getAttribute('data-kind'), key: li.getAttribute('data-key') || '', name: a.textContent, label: li.getAttribute('data-label') || '',
        alias: li.getAttribute('data-alias') || '', text: li.getAttribute('data-text') || '', order: i, row: a, L: li.parentNode.parentNode.getAttribute('data-l') };
      a.setAttribute('data-id', it.id);
      it.lname = it.name.toLowerCase(); it.al = it.alias.toLowerCase().split('|').filter(Boolean);
      if (it.kind === 'term') { var t = TERMS[it.key] || [it.name, '', '', '', '', '']; it.t = { term: t[0], aka: t[1], plain: t[2], why: t[3], ch: t[4], chTitle: t[5] }; it.title = t[0]; }
      else it.title = it.name;
      it.data = it.kind === 'firm' ? sup[it.key] : it.kind === 'chip' ? chip[it.key] : it.kind === 'country' ? co[it.key] : null;
      azRow[it.id] = a; L.byId[it.id] = it; L.byKey[it.key] = it;
      return it;
    });
    counts = { all: L.items.length, term: 0, firm: 0, chip: 0, country: 0 };
    L.items.forEach(function (it) { counts[it.kind]++; });
    $$('#lk-items > .gl-g').forEach(function (g) { groupEl[g.getAttribute('data-l')] = g; });
    wire();
    renderList();
    measure();
    $('.view[data-view="glossary"]').setAttribute('data-gl', 'ready');
  }
  var fromHash = function () {
    var h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
    if (/^gl-/.test(h)) return L.byKey[h] || null;
    if (/^lk-/.test(h)) return L.byId[h] || null;
    return null;
  };
  var anchorOf = function (it) { return it.kind === 'term' ? it.key : it.id; };

  /* ---------- the index ---------- */
  var say = function (s) { var e = $('#gl-say'); if (!e) return; e.textContent = ''; setTimeout(function () { e.textContent = s; }, 30); };
  var barH = function () { var b = $('#gl-bar'); return b ? b.offsetHeight : 0; };
  var measure = function () { root.style.setProperty('--gl-bar-h', (wide() ? 0 : barH()) + 'px'); };

  function jumpLetters() {
    jumpEl.innerHTML = LETTERS.map(function (l) {
      var g = groupEl[l], on = g && !g.hidden;
      return on ? '<button type="button" data-l="' + l + '" aria-label="' + (l === '0-9' ? 'Numbers' : l) + '">' + showL(l) + '</button>' : '<span aria-hidden="true">' + showL(l) + '</span>';
    }).join('');
    spy(true);
  }

  /* the list the reader sees: A to Z by kind, or a search's matches with the names first. Every word typed must be in the
     entry's words; a name that contains the query, or another name that starts with it, is a name match ("dutch", "prc",
     "foxconn"), and one that is exactly the query ("us", "tsmc") tops them */
  function renderList() {
    var lq = L.q.trim().toLowerCase(), words = lq.split(/\s+/).filter(Boolean), kind = L.kind, k = KINDS[kind];
    L.searching = !!lq;
    var res = L.items.filter(function (it) { return (kind === 'all' || it.kind === kind) && (!lq || words.every(function (w) { return it.text.indexOf(w) >= 0 || it.lname.indexOf(w) >= 0; })); });
    var resEl = $('#gl-res'), azEl = $('#lk-items');
    if (!lq) {
      L.items.forEach(function (it) { it.row.parentNode.hidden = !(kind === 'all' || it.kind === kind); });
      LETTERS.forEach(function (l) { var g = groupEl[l]; if (g) g.hidden = !res.some(function (it) { return it.L === l; }); });
      azEl.hidden = false; resEl.hidden = true; resEl.innerHTML = ''; resRow = {};
      L.shown = res; jumpEl.hidden = false; jumpLetters();
      countEl.textContent = counts[kind] + ' ' + k[0];
      inp.placeholder = 'Search ' + counts[kind] + ' ' + k[0];
    } else {
      res.forEach(function (it) {
        it.isName = it.lname.indexOf(lq) >= 0 || it.al.some(function (a) { return a.indexOf(lq) === 0; });
        it.isExact = it.lname === lq || it.al.indexOf(lq) >= 0;
        it.starts = it.lname.indexOf(lq) === 0;
      });
      var names = res.filter(function (it) { return it.isName; }).sort(function (a, b) { return (b.isExact - a.isExact) || (b.starts - a.starts) || (a.order - b.order); });
      var rest = res.filter(function (it) { return !it.isName; });
      var row = function (it) { return '<li class="gl-r"><a href="#' + esc(anchorOf(it)) + '" data-id="' + esc(it.id) + '">' + esc(it.title) + '</a></li>'; };
      var h = '';
      if (names.length) h += '<div class="gl-g"><h2 class="gl-lh gl-lk">Name matches</h2><ul class="gl-rows">' + names.map(row).join('') + '</ul></div>';
      if (rest.length) h += '<div class="gl-g"><h2 class="gl-lh gl-lk">Text matches</h2><ul class="gl-rows">' + rest.map(row).join('') + '</ul></div>';
      if (!res.length) {
        var near = nearest(lq);
        h = '<p class="gl-none">No entry matches <b>' + esc(L.q.trim()) + '</b>' + (kind !== 'all' ? ' among the ' + esc(k[0]) : '') + '.</p>' +
          (near.length ? '<p class="gl-near">Did you mean ' + near.map(function (it) { return '<a href="#' + esc(anchorOf(it)) + '" data-id="' + esc(it.id) + '">' + esc(it.title) + '</a>'; }).join(' ') + '</p>' : '') +
          (wide() ? '' : passagesHTML(mentions([L.q.trim()], 'raw', L.q.trim()), 'raw'));
      }
      resEl.innerHTML = h; azEl.hidden = true; resEl.hidden = false;
      resRow = {}; $$('.gl-r a[data-id]', resEl).forEach(function (a) { resRow[a.getAttribute('data-id')] = a; });
      L.shown = names.concat(rest); jumpEl.hidden = true;
      countEl.textContent = res.length ? res.length + (res.length === 1 ? ' match' : ' matches') : 'No match';
      listEl.scrollTop = 0;
      // on a phone the matches start under the bar, so each letter typed shows its first ones
      if (!wide()) { var top = listEl.getBoundingClientRect().top + window.pageYOffset - CP.headerH() - barH(); if (window.pageYOffset > top) jump(top); }
    }
    $('#gl-clear').hidden = !L.q;
    markRow();
  }

  var rowOf = function (it) { return it ? (L.searching ? resRow[it.id] : azRow[it.id]) : null; };
  function markRow() {
    $$('.gl-r a[aria-current]', listEl).forEach(function (a) { a.removeAttribute('aria-current'); });
    var a = rowOf(L.cur); if (a) a.setAttribute('aria-current', 'true');
  }
  // the open entry's row in view: on a wide screen inside the index's own scroll, under its letter; on a phone in the page
  function reveal(it, centre) {
    var a = rowOf(it); if (!a || a.offsetParent === null) return;
    if (wide()) {
      var r = a.getBoundingClientRect(), c = listEl.getBoundingClientRect(), head = 42;
      if (centre) listEl.scrollTop += r.top - c.top - Math.round(c.height * 0.3);
      else if (r.top < c.top + head) listEl.scrollTop -= c.top + head - r.top + 6;
      else if (r.bottom > c.bottom - 8) listEl.scrollTop += r.bottom - c.bottom + 14;
    } else {
      var under = CP.headerH() + barH() + 46, ar = a.getBoundingClientRect();
      if (centre || ar.top < under || ar.bottom > window.innerHeight - 20) jump(ar.top + window.pageYOffset - under - (centre ? 80 : 0));
    }
  }

  // the column of letters marks the letter at the top of the index, and on a phone keeps its place under the bar
  var spyQ = false;
  function spy(now) {
    if (!L.built || (spyQ && !now)) return; spyQ = true;
    requestAnimationFrame(function () {
      spyQ = false;
      if (!here()) return;
      jumpEl.style.top = wide() ? '' : Math.round($('#gl-bar').getBoundingClientRect().bottom + 6) + 'px';
      if (L.searching) return;
      var line = wide() ? listEl.getBoundingClientRect().top + 30 : CP.headerH() + barH() + 30, curL = null;
      LETTERS.forEach(function (l) { var g = groupEl[l]; if (g && !g.hidden && g.getBoundingClientRect().top <= line) curL = l; });
      if (!curL) curL = LETTERS.filter(function (l) { return groupEl[l] && !groupEl[l].hidden; })[0];
      $$('button', jumpEl).forEach(function (b) { if (b.getAttribute('data-l') === curL) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    });
  }
  function toLetter(l) {
    var g = groupEl[l]; if (!g || g.hidden) return;
    if (wide()) listEl.scrollTop = g.offsetTop;
    else jump(g.getBoundingClientRect().top + window.pageYOffset - CP.headerH() - barH() + 1);
    spy(true);
  }

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
      (r.role ? '<p class="gl-def">' + xl(r.role, used) + '</p>' : '') +
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
      (c.notes ? '<p class="gl-def">' + xl(c.notes, used) + '</p>' : '') +
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
      '<p class="gl-meta">' + esc(F.meta) + '</p>' + (c.role ? '<p class="gl-def">' + xl(c.role, used) + '.</p>' : '');
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
      if (L.kind !== 'all' && it.kind !== L.kind) return;
      var best = dist(q, it.lname);
      it.lname.split(/[\s()\-]+/).forEach(function (w) { if (w.length >= 3) best = Math.min(best, dist(q, w)); });
      if (best <= (q.length >= 8 ? 3 : 2)) scored.push({ it: it, d: best });
    });
    return scored.sort(function (a, b) { return a.d - b.d; }).slice(0, 5).map(function (x) { return x.it; });
  }

  /* ---------- showing an entry ---------- */
  var neighbours = function (it) { var list = L.shown.indexOf(it) >= 0 ? L.shown : L.items, i = list.indexOf(it); return { prev: list[i - 1] || null, next: list[i + 1] || null }; };
  function entryHTML(it) {
    var used = {}; used[it.id] = 1;
    var body = it.kind === 'term' ? termHTML(it, used) : it.kind === 'firm' ? firmHTML(it, used) : it.kind === 'chip' ? chipHTML(it, used) : countryHTML(it, used);
    var nb = neighbours(it);
    var pn = '<nav class="gl-pn" aria-label="Neighboring entries">' +
      (nb.prev ? '<a class="gl-prev" href="#' + esc(anchorOf(nb.prev)) + '" data-id="' + esc(nb.prev.id) + '" rel="prev"><span class="label">Previous</span><span class="gl-pn-n">' + esc(nb.prev.title) + '</span></a>' : '') +
      (nb.next ? '<a class="gl-next" href="#' + esc(anchorOf(nb.next)) + '" data-id="' + esc(nb.next.id) + '" rel="next"><span class="label">Next</span><span class="gl-pn-n">' + esc(nb.next.title) + '</span></a>' : '') + '</nav>';
    var bar = '<div class="gl-ebar"><button type="button" class="gl-back" data-back>' + ARROW_L + 'Glossary</button><span class="gl-steps">' +
      '<button type="button" data-step="-1" aria-label="Previous entry"' + (nb.prev ? '' : ' disabled') + '>' + ARROW_L + '</button><button type="button" data-step="1" aria-label="Next entry"' + (nb.next ? '' : ' disabled') + '>' + ARROW_R + '</button></span></div>';
    return bar + '<div class="gl-e">' + body + passagesHTML(mentions(patternsOf(it), it.kind, it.key), it.kind) + pn + '</div>';
  }
  /* no entry, but the site may still use the words: names a typo away, and every place they appear */
  function rawHTML(q) {
    var near = nearest(q);
    return '<div class="gl-ebar"><button type="button" class="gl-back" data-back>' + ARROW_L + 'Glossary</button></div><div class="gl-e"><p class="label gl-kind">No entry</p><h2 class="gl-hw" id="gl-hw" tabindex="-1">' + esc(q) + '</h2>' +
      (near.length ? '<p class="gl-meta">Did you mean ' + near.map(function (it) { return '<a class="gl-x" href="#' + esc(anchorOf(it)) + '" data-id="' + esc(it.id) + '">' + esc(it.title) + '</a>'; }).join(', ') + '</p>' : '') +
      passagesHTML(mentions([q], 'raw', q), 'raw') + '</div>';
  }

  function show(it, o) {
    o = o || {};
    if (!it) return;
    // an entry outside the search or the kind shown brings the whole list back
    if (L.searching && L.shown.indexOf(it) < 0) { inp.value = ''; L.q = ''; renderList(); }
    if (!L.searching && L.kind !== 'all' && it.kind !== L.kind) setKind('all');
    L.cur = it;
    paneEl.innerHTML = entryHTML(it);
    markRow();
    if (o.hash) {
      var h = '#' + anchorOf(it);
      if (location.hash !== h) { if (o.hash === 'push') { history.pushState({ gl: 1 }, '', h); L.pushed = true; } else history.replaceState(history.state, '', h); }
    }
    if (wide()) {
      if (o.top !== false && window.pageYOffset > 0) jump(0);
      reveal(it, !!o.centre);
    } else {
      reveal(it, !!o.centre);
      open();
      paneEl.scrollTop = 0;
    }
    if (o.focus || (!wide() && o.focus !== false)) focusEl($('#gl-hw'));
  }
  function showRaw(q) {
    L.cur = null; markRow();
    paneEl.innerHTML = rawHTML(q);
    if (wide() && window.pageYOffset > 0) jump(0);
  }

  /* on a phone the entry lies over the index as a dialog: the rest is inert, so Tab and a screen reader stay in it */
  function open() {
    if (wide() || root.classList.contains('gl-open')) return;
    root.classList.add('gl-open');
    paneEl.setAttribute('role', 'dialog'); paneEl.setAttribute('aria-modal', 'true');
    [$('.masthead'), $('#gl-index'), $('.view[data-view="glossary"] > .site-footer'), $('.skip'), $('.to-top'), $('.stage')].forEach(function (el) { if (el && !el.inert) { el.inert = true; L.held.push(el); } });
  }
  function shut(focusRow) {
    root.classList.remove('gl-open');
    if (paneEl) { paneEl.removeAttribute('role'); paneEl.removeAttribute('aria-modal'); }
    L.held.forEach(function (el) { el.inert = false; }); L.held = [];
    if (focusRow) { var a = rowOf(L.cur); if (a) { focusEl(a); reveal(L.cur, false); } }
  }
  function back() {
    if (L.pushed && history.state && history.state.gl) { history.back(); return; } // the router hears the address and shuts it (activate)
    history.replaceState(null, '', location.pathname + location.search + '#/glossary');
    shut(true);
  }

  /* ---------- the reader's moves ---------- */
  function setKind(k) {
    L.kind = k;
    $$('#gl-kinds button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === k ? 'true' : 'false'); });
    renderList();
  }
  function step(d, o) {
    if (!L.shown.length) return;
    var i = L.shown.indexOf(L.cur), n = i < 0 ? (d > 0 ? L.shown[0] : L.shown[L.shown.length - 1]) : L.shown[Math.max(0, Math.min(L.shown.length - 1, i + d))];
    if (!n || n === L.cur) return;
    show(n, { hash: 'replace', focus: false });
    if (o && o.row) focusEl(rowOf(n));
    else say(n.title + ', ' + KIND[n.kind].toLowerCase());
  }
  var clearSearch = function () { inp.value = ''; L.q = ''; renderList(); if (L.cur) reveal(L.cur, true); };

  function wire() {
    var view = $('.view[data-view="glossary"]'), typing = null;
    var sync = function () { clearTimeout(typing); typing = null; if (inp.value !== L.q) { L.q = inp.value; renderList(); } };
    inp.addEventListener('input', function () {
      clearTimeout(typing);
      typing = setTimeout(function () {
        typing = null; L.q = inp.value; renderList();
        // on a wide screen the first match shows as the reader types, as a desktop dictionary does
        if (wide() && L.q.trim()) { if (L.shown.length) show(L.shown[0], { hash: 'replace' }); else showRaw(L.q.trim()); }
        else if (wide() && L.cur) reveal(L.cur, true);
      }, 110);
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sync(); step(e.key === 'ArrowDown' ? 1 : -1); }
      else if (e.key === 'Enter') {
        e.preventDefault(); sync();
        var it = L.shown.indexOf(L.cur) >= 0 ? L.cur : L.shown[0];
        if (it) show(it, { hash: 'push', focus: true });
        else if (L.q.trim()) { showRaw(L.q.trim()); if (!wide()) open(); focusEl($('#gl-hw')); }
      } else if (e.key === 'Escape' && inp.value) { e.preventDefault(); e.stopPropagation(); clearSearch(); }
    });
    $('#gl-clear').addEventListener('click', function () { clearSearch(); inp.focus(); });
    $('#gl-kinds').addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (!b) return; setKind(b.getAttribute('data-k')); if (!L.searching && L.cur && wide()) reveal(L.cur, true); });
    jumpEl.addEventListener('click', function (e) { var b = e.target.closest('button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); });
    // on a phone a finger can run down the letters
    jumpEl.addEventListener('pointerdown', function (e) {
      if (wide() || e.pointerType === 'mouse') return;
      var go = function (ev) { var el = document.elementFromPoint(ev.clientX, ev.clientY), b = el && el.closest && el.closest('.gl-jump button[data-l]'); if (b) toLetter(b.getAttribute('data-l')); };
      go(e);
      var move = function (ev) { ev.preventDefault(); go(ev); }, up = function () { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
      document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up);
    });

    // a row, a link between entries, a neighbor or a suggestion opens its entry, and the address keeps it; the passages and
    // the links out carry what the page they open should do (the supplier list's filter, a chip's card, a passage to flash)
    view.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[data-id]');
      if (a && L.byId[a.getAttribute('data-id')]) {
        e.preventDefault();
        var it = L.byId[a.getAttribute('data-id')], inRow = !!a.closest('.gl-r'), inNear = !!a.closest('.gl-near, .gl-meta');
        if (inNear) { inp.value = ''; L.q = ''; renderList(); }
        // a click keeps the focus on its row, so the arrows go on from there; Enter on a row moves it into the entry
        show(it, { hash: 'push', focus: !wide() || !inRow || e.detail === 0, centre: !inRow });
        return;
      }
      var p = e.target.closest('a[data-para]');
      if (p) {
        e.preventDefault(); var para = corpus()[+p.getAttribute('data-para')]; if (!para) return;
        // on another page (the chapter's own): the passage goes with the reader, and that page lands on it (flash)
        if (!para.el) { CP.go('#' + para.chapter, { para: { chapter: para.chapter, k: para.k, text: para.text } }); return; }
        location.hash = '#' + para.chapter;
        setTimeout(function () { CP.scrollToEl(para.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(para.el); para.el.classList.add('lk-flash'); setTimeout(function () { para.el.classList.remove('lk-flash'); }, 2600); }, 140);
        return;
      }
      // the supplier list takes the whole filter from the link (a firm's name, or a country), so an older search cannot narrow it
      var s = e.target.closest('a[data-sup]'); if (s) { var q = s.getAttribute('data-sup'); setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ q: q }); }, 60); return; }
      var sc = e.target.closest('a[data-supcc]'); if (sc) { var cc = sc.getAttribute('data-supcc'); setTimeout(function () { if (CP.Suppliers && CP.Suppliers.show) CP.Suppliers.show({ country: cc }); }, 60); return; }
      // a chip opens its card on the chart, adding nothing
      var ch = e.target.closest('a[data-chip]'); if (ch) { var id = ch.getAttribute('data-chip'); setTimeout(function () { if (CP.Landscape && CP.Landscape.openCard) CP.Landscape.openCard(id, { show: true }); }, 60); return; }
      if (e.target.closest('[data-back]')) { back(); return; }
      var st = e.target.closest('[data-step]'); if (st) { step(+st.getAttribute('data-step')); return; }
      var more = e.target.closest('[data-rest]');
      if (more) { var rest = more.parentNode.querySelector('.gl-rest'); rest.hidden = false; more.parentNode.removeChild(more); focusEl(rest.querySelector('a')); return; }
      var all = e.target.closest('[data-all]');
      if (all) { var ul = all.closest('.gl-part').querySelector('.gl-men'), n = ul.children.length; ul.innerHTML = lastHits.map(rowHTML).join(''); all.parentNode.parentNode.removeChild(all.parentNode); var nx = ul.children[n] && ul.children[n].querySelector('a'); if (nx) focusEl(nx); }
    });
    listEl.addEventListener('keydown', function (e) {
      var a = e.target.closest && e.target.closest('.gl-r a'); if (!a) return;
      var it = L.byId[a.getAttribute('data-id')], i = L.shown.indexOf(it), go = null;
      if (e.key === 'ArrowDown') go = L.shown[i + 1]; else if (e.key === 'ArrowUp') go = L.shown[i - 1];
      else if (e.key === 'PageDown') go = L.shown[Math.min(L.shown.length - 1, i + 10)]; else if (e.key === 'PageUp') go = L.shown[Math.max(0, i - 10)];
      else if (e.key === 'Home') go = L.shown[0]; else if (e.key === 'End') go = L.shown[L.shown.length - 1];
      else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && /\S/.test(e.key) && e.key !== '/') { inp.focus(); return; } // typing goes to the search
      else return;
      e.preventDefault(); if (!go) return;
      if (wide()) show(go, { hash: 'replace', focus: false });
      var r = rowOf(go); if (r) { focusEl(r); reveal(go, false); }
    });
    // "/" goes to this search while the Glossary shows (the site search keeps Ctrl+K); it is heard before the site's own "/"
    window.addEventListener('keydown', function (e) {
      if (e.key !== '/' || !here() || e.ctrlKey || e.metaKey || e.altKey || root.classList.contains('gl-open')) return;
      var a = document.activeElement || document.body, box = $('#cp-search');
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName || '') || a.isContentEditable || (box && !box.hidden)) return;
      e.preventDefault(); e.stopPropagation(); inp.focus(); inp.select();
    }, true);
    // Escape closes an entry open over the list (the site search and a pop-up close first)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || e.defaultPrevented || !here() || !root.classList.contains('gl-open')) return;
      var box = $('#cp-search'), tip = $('#gl-tip'); if ((box && !box.hidden) || (tip && !tip.hidden)) return;
      e.preventDefault(); back();
    });
    listEl.addEventListener('scroll', function () { spy(); }, { passive: true });
    window.addEventListener('scroll', function () { if (!wide()) spy(); }, { passive: true });
    // a link in the entry that leaves the Glossary leaves nothing held
    window.addEventListener('hashchange', function () { if (!here()) shut(false); });
    var wasWide = wide(), rs = null;
    window.addEventListener('resize', function () {
      clearTimeout(rs); rs = setTimeout(function () {
        measure();
        var w = wide(); if (w === wasWide) return; wasWide = w;
        if (!here()) return;
        if (w) { shut(false); if (!L.cur) show(L.byId[DEFAULT], { hash: false, centre: true, focus: false }); else reveal(L.cur, true); }
        else if (fromHash()) open();
        spy(true);
      }, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); if (L.cur && wide() && here()) reveal(L.cur, true); spy(true); });
    // the browser keeps an address's row in view a moment past load, so the entry's top is set again until the reader moves
    var moved = false;
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { passive: true, once: true }); });
    var settle = function () { if (moved || !here() || !L.cur || !fromHash()) return; if (wide()) { if (window.pageYOffset) jump(0); } else if (!root.classList.contains('gl-open')) return; reveal(L.cur, true); spy(true); };
    [60, 250, 700].forEach(function (ms) { setTimeout(settle, ms); });
    window.addEventListener('load', function () { settle(); setTimeout(settle, 250); });
  }

  /* each route to the Glossary: the address decides the entry. From another view or page (a pop-up's Look it up, a search
     result) the entry's name takes focus; on a phone an entry is a dialog, so its name always does */
  function activate() {
    init(); if (!L.built) return;
    measure();
    // first: the page's first route (the router has no view before it); came: that first route is a move from another page of the site
    var it = fromHash(), R = CP.Router || {}, first = !R.from;
    var came = first && !L.arrived && /^https?:/.test(document.referrer) && document.referrer.indexOf(location.origin + '/') === 0 && document.referrer !== location.href;
    L.arrived = true;
    if (it) {
      L.pushed = !!(history.state && history.state.gl);
      show(it, { hash: false, centre: true, focus: wide() ? (came || !first) : true });
    } else if (wide()) {
      if (L.searching) { inp.value = ''; L.q = ''; renderList(); }
      show(L.byId[DEFAULT], { hash: false, centre: true, focus: false });
    } else {
      var wasOpen = root.classList.contains('gl-open');
      shut(wasOpen);
    }
    spy(true);
  }

  CP.Lookup = L;
  L.show = function (id) { var it = L.byId[id] || L.byKey[id]; if (it) show(it, { hash: 'replace', centre: true }); };
  L.search = function (s) { inp.value = s; L.q = s; renderList(); if (wide() && L.shown.length) show(L.shown[0], { hash: 'replace' }); else if (wide() && s.trim()) showRaw(s.trim()); };
  L.flash = flash; L.domCorpus = domCorpus; L.corpus = corpus;
  /* The rows and the passages come with glossary.js (build/build.js), fetched when the Glossary first opens (CP.need); the index
     head paints at once, and the parts the list fills wait hidden until it is in (lookup.css, .gl-wait) */
  L.load = function (fn) {
    var az = $('#lk-items');
    if (!az || az.children.length || !CP.need) { fn(); return; }
    CP.need('glossary.js', function () { fn(); var v = $('.view[data-view="glossary"]'); if (v && !v.hasAttribute('data-gl')) v.setAttribute('data-gl', 'empty'); });
  };
  CP.register('glossary', { activate: function () { L.load(activate); }, stage: false });
})();
