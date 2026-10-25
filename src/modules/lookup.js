/* The Glossary (#/glossary), as the owner chose it on 25 Oct 2026: option B, "The dictionary" (qa/design4/glossary/ in the
   main checkout). Every entry stands in columns, A to Z, under its letter, so every definition can be read without a click:
   a term with its other names, its definition, the reason it matters and the chapters that use it; a firm, a chip or a
   country with its kind and its one line. A sticky bar holds the search, the kinds and the letters. Search filters the
   columns in place, and the entries whose names match stand first. An entry opens in a sheet: beside the columns on a wide
   screen, over them on a narrower one, the whole screen on a phone. The sheet shows a term as the page lays it out, and a
   firm, a chip or a country as its card, then every passage that mentions it, with arrows to the next entry.
   The entries are data in the page, written by build/build.js: #lk-items (each entry's kind, key, other names and search
   text) and #glossary (each term's own block, which the look-up popovers and the site search read too, src/app.js Tip and
   Search). Their ids stay each entry's address (#gl-euv, #lk-country-nl). The cards are drawn from DATA when an entry
   opens. The passages are found by scanning the chapters, the board, the AI chips and the supplier list for the entry's
   name, and each entry's count of them is worked out a few at a time while the browser is idle. */
(function () {
  var CP = window.CP; if (!CP) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, DATA = CP.DATA || {}, cname = CP.cname, reduced = CP.reduced;
  var LETTERS = ['0-9'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  var KINDS = [['all', 'All'], ['term', 'Terms'], ['firm', 'Firms'], ['chip', 'AI chips'], ['country', 'Countries']];
  var KIND = { term: 'Term', firm: 'Firm', chip: 'AI chip', country: 'Country' };
  var letterOf = function (name) { var c = String(name).charAt(0).toUpperCase(); return /[A-Z]/.test(c) ? c : '0-9'; };
  var showL = function (L) { return L === '0-9' ? '0–9' : L; };
  var idL = function (L) { return L === '0-9' ? '0-9' : L.toLowerCase(); };
  var full = function () { return window.innerWidth <= 760; };   // the sheet takes the whole screen
  var beside = function () { return window.innerWidth >= 1000; }; // the columns make room for the sheet beside them
  var idle = window.requestIdleCallback ? function (fn) { window.requestIdleCallback(fn, { timeout: 500 }); }
    : function (fn) { setTimeout(function () { fn({ timeRemaining: function () { return 10; } }); }, 40); };
  var jump = function (y, smooth) { // html scrolls smoothly by default; a jump must not glide
    var root = document.documentElement, prev = root.style.scrollBehavior, glide = !!smooth && !reduced;
    if (!glide) root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: glide ? 'smooth' : 'auto' });
    if (!glide) root.style.scrollBehavior = prev;
  };

  var Lookup = {
    built: false, items: [], byId: {}, groups: {}, secs: {}, kind: 'all', q: '', shown: [], top: [], open: null, cursor: -1, paras: null, held: null,

    init: function () {
      var self = this, inp = $('#gl-search'), dict = $('#gl-dict'); if (!inp || !dict || this.built) return;
      this.built = true;
      // each term's own block, each firm's row, each chip and each country, keyed as the list keys them
      var blocks = {}, sup = {}, chip = {}, co = {};
      $$('#glossary .gl-entry').forEach(function (e) { blocks[e.id] = e; });
      (DATA.suppliers || []).forEach(function (r) { sup[r.name] = r; });
      (DATA.landscape || []).forEach(function (c) { chip[c.id] = c; });
      (DATA.countries || []).forEach(function (c) { co[c.code] = c; });
      this.items = $$('#lk-items li[data-kind]').map(function (li, i) {
        var it = { id: li.id, kind: li.getAttribute('data-kind'), key: li.getAttribute('data-key') || '', order: i, on: true,
          name: ((li.querySelector('.lk-name') || {}).textContent || '').trim(), label: ((li.querySelector('.lk-lab') || {}).textContent || '').trim(),
          text: li.getAttribute('data-text') || '', alias: li.getAttribute('data-alias') || '' };
        it.lname = it.name.toLowerCase(); it.al = it.alias.toLowerCase().split('|');
        it.data = it.kind === 'term' ? blocks[it.key] : it.kind === 'firm' ? sup[it.key] : it.kind === 'chip' ? chip[it.key] : co[it.key];
        self.byId[it.id] = it; return it;
      });
      this.counts = { all: this.items.length, term: 0, firm: 0, chip: 0, country: 0 };
      this.items.forEach(function (it) { self.counts[it.kind]++; });
      this.build();
      this.wire();
      this.suggest();
      this.filter('', false);
      this.measure();
      this.countAll();
    },

    /* ---------- the dictionary ---------- */
    build: function () {
      var self = this, groups = this.groups = {};
      this.items.forEach(function (it) { var L = letterOf(it.name); (groups[L] = groups[L] || []).push(it); });
      var html = '<section class="gl-sec gl-best" id="gl-best" aria-labelledby="gl-best-h" hidden><div class="gl-sec-h"><h2 class="gl-L" id="gl-best-h">Names that match</h2><p class="gl-gw"></p></div><div class="gl-cols"></div></section>';
      html += LETTERS.filter(function (L) { return groups[L]; }).map(function (L) {
        return '<section class="gl-sec" id="gl-sec-' + idL(L) + '" aria-labelledby="gl-h-' + idL(L) + '"><div class="gl-sec-h"><h2 class="gl-L" id="gl-h-' + idL(L) + '">' + showL(L) + '</h2><p class="gl-gw"></p></div><div class="gl-cols">' +
          groups[L].map(function (it) { return self.entryHTML(it); }).join('') + '</div></section>';
      }).join('');
      $('#gl-dict').innerHTML = html;
      this.best = $('#gl-best');
      LETTERS.forEach(function (L) { if (groups[L]) self.secs[L] = document.getElementById('gl-sec-' + idL(L)); });
      $$('#gl-dict .gl-de').forEach(function (el) { var it = self.byId[el.getAttribute('data-id')]; if (it) it.el = el; });
    },

    /* a term's parts, read from its own block (build/build.js glossaryHTML) */
    term: function (it) {
      if (it.t) return it.t;
      var b = it.data; if (!b) return (it.t = { term: it.name, aka: '', plain: '', why: '', link: null });
      var dt = b.querySelector('dt'), aka = dt && dt.querySelector('.aka'), plain = b.querySelector('dd > p:not(.why)'), why = b.querySelector('dd > p.why');
      return (it.t = { term: dt && dt.firstChild ? dt.firstChild.textContent : it.name, aka: aka ? aka.textContent : '', plain: plain ? plain.textContent : '', why: why ? why.textContent : '', link: b.querySelector('a.gl-link') });
    },
    /* the chapters a term is read in, as the static page lists them (build/modules/reference-pages.js writes DATA.glossaryRefs):
       its own chapter first, then the others that use it */
    refsHTML: function (it) {
      var R = (DATA.glossaryRefs || {})[it.key], t = this.term(it), ch = this.chapterMap(), home = null, also = [];
      if (R) { home = R[0] ? ch[R[0]] : null; also = (R[1] || []).map(function (id) { return ch[id]; }).filter(Boolean); }
      else if (t.link) home = { id: String(t.link.getAttribute('href') || '').replace(/^#/, ''), title: t.link.textContent.replace(/^Read it in /, '').replace(/\s*→$/, '') };
      if (!home && !also.length) return '';
      var a = function (c) { return '<a href="#' + esc(c.id) + '">' + esc(c.title) + '</a>'; };
      return '<p class="gl-refs">' + (home ? '<span class="gl-refs-k">Read it in</span> ' + a(home) : '') +
        (also.length ? (home ? ' <span class="gl-refs-k gl-refs-k2">Also in</span> ' : '<span class="gl-refs-k">In</span> ') + also.map(a).join(', ') : '') + '</p>';
    },
    chapterMap: function () {
      if (!this.chs) { var m = this.chs = {}; (DATA.chapters || []).forEach(function (c) { m[c.id] = c; }); }
      return this.chs;
    },

    /* one entry as a dictionary sets it: the headword and its kind, then what it is. The headword opens the sheet; the line at
       the foot says what the sheet adds (its count of passages arrives once countAll reaches the entry) */
    entryHTML: function (it) {
      var d = it.data || {}, pos = '', body = '';
      if (it.kind === 'term') {
        var t = this.term(it);
        pos = it.label.toLowerCase();
        body = (t.aka ? '<p class="gl-aka">' + esc(t.aka) + '</p>' : '') + '<p class="gl-df">' + esc(t.plain) + '</p>' + (t.why ? '<p class="gl-wy">' + esc(t.why) + '</p>' : '') + this.refsHTML(it);
      } else if (it.kind === 'firm') {
        pos = 'firm' + (d.country ? ', ' + cname(d.country) : '');
        var seg = [d.chokepoint, it.label, d.subcategory].filter(Boolean).join(' · ');
        body = (seg ? '<p class="gl-meta">' + (d.chokepoint ? '<i class="gl-mk gl-mk--' + esc(String(d.chokepoint).toLowerCase()) + '" aria-hidden="true"></i>' : '') + '<span>' + esc(seg) + '</span></p>' : '') +
          (d.role ? '<p class="gl-df">' + esc(d.role) + '</p>' : '');
      } else if (it.kind === 'chip') {
        var p = d.process || {}, m = d.memory || {};
        pos = 'AI chip' + (d.vendorCountry ? ', ' + cname(d.vendorCountry) : '');
        var line = [d.announced ? 'Announced ' + d.announced : '', [p.foundry, p.node].filter(Boolean).join(' '), [m.type, m.capacityGB ? m.capacityGB + ' GB' : ''].filter(Boolean).join(' '), d.tdpW ? d.tdpW + ' W' : ''].filter(Boolean).join(' · ');
        body = (line ? '<p class="gl-meta"><span>' + esc(line) + '</span></p>' : '') + (d.status ? '<p class="gl-df">' + esc(d.status) + '</p>' : '');
      } else {
        pos = it.label.toLowerCase();
        var meta = d.code ? this.countryMeta(d) : '';
        body = (meta ? '<p class="gl-meta"><span>' + esc(meta) + '</span></p>' : '') + (d.role ? '<p class="gl-df">' + esc(d.role) + '.</p>' : '');
      }
      return '<article class="gl-de" data-id="' + esc(it.id) + '" data-kind="' + esc(it.kind) + '">' +
        '<h3 class="gl-hw"><button type="button" data-open aria-controls="gl-sheet">' + esc(it.kind === 'term' ? this.term(it).term : it.name) + '</button><span class="gl-pos">' + esc(pos) + '</span></h3>' +
        body + '<p class="gl-foot"><button type="button" class="gl-more" data-open tabindex="-1">' + this.moreText(it) + '</button></p></article>';
    },
    moreText: function (it) {
      var n = it.places, places = n == null ? '' : n + (n === 1 ? ' place' : ' places');
      return (it.kind === 'term' ? 'Where it appears' + (places ? ', ' + places : '') : 'Card' + (n ? ' and ' + places : '')) + ' <span aria-hidden="true">→</span>';
    },

    /* ---------- search, kinds and letters ---------- */
    /* every word must be in the entry's text; an entry whose name contains the query, or one of whose other names starts with it,
       is a name match ("dutch", "prc", "foxconn"), and one that goes by exactly the query ("us", "tsmc") tops them */
    filter: function (q, typed) {
      var self = this, lq = String(q || '').trim().toLowerCase(), words = lq.split(/\s+/).filter(Boolean), kind = this.kind, res = [];
      this.q = lq;
      this.items.forEach(function (it) {
        var ok = (kind === 'all' || it.kind === kind) && (!lq || words.every(function (w) { return it.text.indexOf(w) >= 0; }));
        it.on = ok; it.isName = ok && !!lq && (it.lname.indexOf(lq) >= 0 || it.al.some(function (a) { return a && a.indexOf(lq) === 0; }));
        it.isExact = ok && !!lq && (it.lname === lq || it.al.indexOf(lq) >= 0);
        if (ok) res.push(it);
      });
      // the names that match stand first, six at most, above the rest of the matches in their letters
      var top = lq ? res.filter(function (it) { return it.isName; }).sort(function (a, b) { return (b.isExact - a.isExact) || (a.order - b.order); }).slice(0, 6) : [];
      // the entries that stood first go back to their letters, in order, and this search's names take their place
      if (this.top.length) Object.keys(this.secs).forEach(function (L) { var cols = self.secs[L].querySelector('.gl-cols'); self.groups[L].forEach(function (it) { it.moved = false; cols.appendChild(it.el); }); });
      this.top = top;
      var bc = this.best.querySelector('.gl-cols');
      top.forEach(function (it) { bc.appendChild(it.el); it.moved = true; });
      this.items.forEach(function (it) { it.el.hidden = !it.on; });
      this.best.hidden = !top.length;
      this.best.querySelector('.gl-gw').textContent = top.length ? top.length + (top.length === 1 ? ' entry' : ' entries') + (res.length > top.length ? ', then ' + (res.length - top.length) + ' more below that mention it' : '') : '';
      // the order the reader sees, which the sheet's arrows follow
      this.shown = top.concat(LETTERS.reduce(function (acc, L) { return self.groups[L] ? acc.concat(self.groups[L].filter(function (it) { return it.on && top.indexOf(it) < 0; })) : acc; }, []));
      this.cursor = -1;
      var tot = this.counts[kind] || 0, c = $('#lk-count');
      if (c) c.textContent = lq ? (res.length ? res.length + ' of ' + tot + ' entries' : 'No entry matches.') : tot + ' entries';
      $('#gl-clear').hidden = !lq;
      this.guide();
      var none = $('#gl-none'), dict = $('#gl-dict');
      if (lq && !res.length) { this.showRaw(String(q).trim()); none.hidden = false; dict.hidden = true; }
      else { none.hidden = true; none.innerHTML = ''; dict.hidden = false; }
      // the results start under the bar, so each word typed shows its first matches
      if (typed) { var at = this.barTop(); if (at != null && Math.abs(window.pageYOffset - at) > 1) jump(at); }
      this.spy();
    },

    /* each letter's guide words, as a printed dictionary heads its page: the first and last entry shown, and how many */
    guide: function () {
      var self = this;
      Object.keys(this.secs).forEach(function (L) {
        var sec = self.secs[L], vis = self.groups[L].filter(function (it) { return it.on && !it.moved; });
        sec.hidden = !vis.length;
        var name = function (it) { return it.kind === 'term' ? self.term(it).term : it.name; };
        sec.querySelector('.gl-gw').innerHTML = vis.length ? '<b>' + esc(name(vis[0])) + '</b>' + (vis.length > 1 ? '<span>to</span><b>' + esc(name(vis[vis.length - 1])) + '</b>' : '') + '<span>' + vis.length + (vis.length === 1 ? ' entry' : ' entries') + '</span>' : '';
      });
      var ul = $('#gl-letters'); if (!ul) return;
      ul.innerHTML = LETTERS.map(function (L) {
        var on = self.secs[L] && !self.secs[L].hidden;
        return '<li>' + (on ? '<button type="button" data-l="' + L + '" aria-label="' + (L === '0-9' ? 'Numbers' : L) + '">' + showL(L) + '</button>' : '<span aria-hidden="true">' + showL(L) + '</span>') + '</li>';
      }).join('');
    },

    /* the page's place under the bar: where the bar sticks, measured from the marker in front of it */
    barTop: function () {
      var at = $('#gl-bar-at'), bar = $('#gl-bar'); if (!at || !bar || !at.offsetParent) return null;
      return at.getBoundingClientRect().top + window.pageYOffset + (parseFloat(getComputedStyle(bar).marginTop) || 0) - CP.headerH();
    },
    barH: function () { var b = $('#gl-bar'); return b ? b.offsetHeight : 0; },
    measure: function () { document.documentElement.style.setProperty('--gl-bar-h', this.barH() + 'px'); },
    under: function () { return CP.headerH() + this.barH(); }, // what covers the top of the window

    /* the thumb index marks the letter the reader is in, and on a phone keeps it in view in its strip */
    spy: function () {
      var self = this; if (this.spyQ) return; this.spyQ = true;
      requestAnimationFrame(function () {
        self.spyQ = false;
        if (!CP.Router || CP.Router.current !== 'glossary') return;
        var line = self.under() + 40, cur = null;
        Object.keys(self.secs).forEach(function (L) { var s = self.secs[L]; if (!s.hidden && s.getBoundingClientRect().top <= line) cur = L; });
        if (cur === self.curL) return; self.curL = cur;
        $$('#gl-letters button').forEach(function (b) { var on = b.getAttribute('data-l') === cur; if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
        var strip = $('#gl-letters'), b = cur && strip && strip.querySelector('button[data-l="' + cur + '"]');
        if (b && strip.scrollWidth > strip.clientWidth) { var sr = strip.getBoundingClientRect(), br = b.getBoundingClientRect(); if (br.left < sr.left + 8) strip.scrollLeft -= sr.left + 8 - br.left; else if (br.right > sr.right - 8) strip.scrollLeft += br.right - sr.right + 8; }
      });
    },
    toLetter: function (L) {
      var sec = this.secs[L]; if (!sec) return;
      var h = sec.querySelector('.gl-sec-h');
      jump(h.getBoundingClientRect().top + window.pageYOffset - this.under() - 20, true);
    },

    /* ---------- events ---------- */
    wire: function () {
      var self = this, inp = $('#gl-search'), view = $('.view[data-view="glossary"]');
      $('#gl-kinds').innerHTML = KINDS.map(function (k) { return '<button type="button" class="gl-pill" data-k="' + k[0] + '" aria-pressed="' + (k[0] === 'all') + '">' + k[1] + '<span class="gl-n">' + self.counts[k[0]] + '</span></button>'; }).join('');
      var typing = null;
      inp.addEventListener('input', function () { clearTimeout(typing); typing = setTimeout(function () { self.filter(inp.value, true); }, 100); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault(); if (!self.shown.length) return;
          // on a phone the sheet would cover the field, so the arrow goes to the first entry; elsewhere the arrows preview an
          // entry in the sheet while focus stays in the field
          if (full()) { if (e.key === 'ArrowDown') { var b = self.shown[0].el.querySelector('.gl-hw button'); if (b) b.focus(); } return; }
          self.cursor = e.key === 'ArrowDown' ? Math.min(self.shown.length - 1, self.cursor + 1) : Math.max(0, self.cursor - 1);
          self.show(self.shown[self.cursor].id, { push: true, reveal: true });
        } else if (e.key === 'Enter') { // Enter chooses: the entry opens and its title takes focus, so the next Tab is in the card
          e.preventDefault(); clearTimeout(typing); if (inp.value.trim().toLowerCase() !== self.q) self.filter(inp.value, true);
          var it = self.shown[Math.max(0, self.cursor)]; if (it) self.show(it.id, { push: true, focus: true, reveal: true });
        } else if (e.key === 'Escape') {
          if (inp.value) { e.preventDefault(); inp.value = ''; self.filter('', true); }
          else if (self.open) { e.preventDefault(); self.close(true); }
        }
      });
      $('#gl-clear').addEventListener('click', function () { inp.value = ''; self.filter('', true); inp.focus(); });
      $('#gl-kinds').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-k]'); if (!b) return;
        self.kind = b.getAttribute('data-k');
        $$('#gl-kinds button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        self.filter(inp.value, true);
      });
      $('#gl-letters').addEventListener('click', function (e) { var b = e.target.closest('button[data-l]'); if (b) self.toLetter(b.getAttribute('data-l')); });
      $('#gl-dict').addEventListener('click', function (e) {
        var b = e.target.closest('[data-open]'); if (!b) return;
        var de = b.closest('.gl-de'); if (de) self.show(de.getAttribute('data-id'), { push: true, focus: true, reveal: true });
      });
      $('#gl-try').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) self.show(b.getAttribute('data-go'), { push: true, focus: true, reveal: true }); });
      $('#gl-close').addEventListener('click', function () { self.close(true); });
      $('#gl-prev').addEventListener('click', function () { self.step(-1); });
      $('#gl-next').addEventListener('click', function () { self.step(1); });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || e.defaultPrevented || !self.open || $('#gl-sheet').hidden) return;
        if (!CP.Router || CP.Router.current !== 'glossary' || document.activeElement === inp) return;
        var box = $('#cp-search'); if (box && !box.hidden) return; // the site search closes first
        var tip = $('#gl-tip'); if (tip && !tip.hidden) return;
        self.close(true);
      });
      // under 1,000 px the sheet lies over the page, so a click beside it closes it
      document.addEventListener('click', function (e) {
        if (!self.open || beside() || full() || !CP.Router || CP.Router.current !== 'glossary') return;
        var s = $('#gl-sheet'); if (s.hidden || s.contains(e.target) || (e.target.closest && e.target.closest('[data-open], [data-go], #gl-try, .masthead, #cp-search'))) return;
        self.close(false);
      });
      window.addEventListener('scroll', function () { if (self.built) self.spy(); }, { passive: true });
      var rs = null;
      window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { self.measure(); if (self.open) self.layout(); self.spy(); }, 120); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.measure(); });
      // a link in the sheet that leaves the Glossary leaves nothing held: the rest of the page is no longer inert
      window.addEventListener('hashchange', function () { if (!CP.Router || CP.Router.current !== 'glossary') self.hold(false); });
      if (view) view.setAttribute('data-gl', 'ready');
    },

    /* six things to try, drawn afresh on every load: two terms, two firms that matter, one chip, one country */
    suggest: function () {
      var self = this, box = $('#gl-try'); if (!box) return;
      var pick = function (arr, n) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, n); };
      var terms = this.items.filter(function (it) { return it.kind === 'term' && it.name.length <= 22; });
      var big = {}; (DATA.suppliers || []).forEach(function (r) { if (r.chokepoint === 'Critical' || r.chokepoint === 'Important') big[r.name] = 1; });
      var firms = this.items.filter(function (it) { return it.kind === 'firm' && big[it.key]; });
      var chips = this.items.filter(function (it) { return it.kind === 'chip'; }), countries = this.items.filter(function (it) { return it.kind === 'country'; });
      var chosen = pick(terms, 2).concat(pick(firms, 2), pick(chips, 1), pick(countries, 1)); chosen = pick(chosen, chosen.length);
      // a chip's list name is its maker and its name ("Huawei (HiSilicon) Ascend 950PR", build/build.js), so a suggestion takes the
      // chip's own name from the data; a trailing aside, "(Ironwood)", is dropped as for every kind
      box.innerHTML = '<span class="gl-try-k">Try</span> ' + chosen.map(function (it) {
        var own = it.kind === 'chip' && it.data ? it.data.name : '';
        return '<button type="button" class="gl-pill" data-go="' + esc(it.id) + '">' + esc(String(own || it.name).replace(/\s*\(.*\)$/, '')) + '</button>';
      }).join(' ');
    },

    /* ---------- the sheet ---------- */
    activate: function () {
      this.init(); if (!this.built) return;
      this.measure(); this.curL = null; this.spy();
      var h = (location.hash || '').replace(/^#/, ''), id = h;
      try { id = decodeURIComponent(h); } catch (e) { }
      var el = id && document.getElementById(id);
      if (el && (el.closest('#lk-items') || (el.classList && el.classList.contains('gl-entry')))) {
        // an address that names an entry (a popover's Look it up, a search result, a card's link, Back): the entry opens, and the
        // columns bring it into view. After a move within the site (not a first load) its title takes focus too
        var R = CP.Router || {};
        this.show(id, { reveal: true, land: true, focus: !!(R.routed && R.from) });
      } else if (this.open) this.close(false);
    },

    show: function (id, o) {
      o = o || {};
      if (/^gl-/.test(id)) id = 'lk-term-' + id.slice(3); // a term's own address (popovers, search, old links) names its entry
      var self = this, it = this.byId[id]; if (!it || !it.el) return;
      if (!it.on) { var inp = $('#gl-search'); inp.value = ''; this.kind = 'all'; $$('#gl-kinds button').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-k') === 'all' ? 'true' : 'false'); }); this.filter('', false); }
      if (this.open && this.open !== it && this.open.el) this.open.el.classList.remove('is-on');
      this.open = it; it.el.classList.add('is-on');
      var i = this.shown.indexOf(it); if (i >= 0) this.cursor = i;
      var body = $('#gl-sheet-body'), hits = this.hitsFor(it);
      body.innerHTML = this.cardHTML(it) + this.passagesHTML(hits, it.kind, 12, 'gl-sheet');
      body.scrollTop = 0;
      this.wirePassages(body, hits, it.kind);
      this.wireCard(body);
      var title = body.querySelector('.lk-t'); if (title) title.id = 'gl-sheet-t'; // the sheet takes the entry's name
      $('#gl-sheet-k').textContent = KIND[it.kind] + ' · ' + (i + 1) + ' of ' + this.shown.length;
      $('#gl-prev').disabled = i <= 0; $('#gl-next').disabled = i < 0 || i >= this.shown.length - 1;
      var sheet = $('#gl-sheet'), wasOpen = !sheet.hidden;
      sheet.hidden = false;
      this.layout();
      if (o.push) { var anchor = it.kind === 'term' ? it.key : it.id; if (location.hash !== '#' + anchor) history.replaceState(null, '', '#' + anchor); }
      if (o.reveal) this.reveal(it, !o.land && wasOpen);
      if (o.focus) { var t = body.querySelector('.lk-t'); if (t) { t.setAttribute('tabindex', '-1'); try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); } } }
    },
    /* the sheet's place: beside the columns from 1,000 px, over them below that (the rest of the page inert), the whole screen on a phone */
    layout: function () {
      var view = $('.view[data-view="glossary"]'), open = !!this.open && !$('#gl-sheet').hidden;
      view.classList.toggle('gl-open', open);
      view.classList.toggle('gl-split', open && beside());
      this.hold(open && !beside());
      var sheet = $('#gl-sheet');
      if (open && !beside()) { sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); }
      else { sheet.removeAttribute('role'); sheet.removeAttribute('aria-modal'); }
    },
    /* while the sheet lies over the page, everything but the sheet is inert, so Tab and a screen reader stay in it */
    hold: function (on) {
      if (on) {
        if (this.held) return;
        var sheet = $('#gl-sheet'), view = $('.view[data-view="glossary"]'), held = [];
        [$('.masthead'), $('.stage'), $('.to-top')].concat($$(':scope > *', view)).forEach(function (el) { if (el && el !== sheet && !el.inert) { el.inert = true; held.push(el); } });
        this.held = held;
        document.documentElement.classList.add('gl-held');
      } else if (this.held) {
        this.held.forEach(function (el) { el.inert = false; }); this.held = null;
        document.documentElement.classList.remove('gl-held');
      }
    },
    /* bring the open entry into view beside the sheet: on a wide screen under the bar, once the bar has stuck */
    reveal: function (it, smooth) {
      if (!it || !it.el || it.el.hidden) return;
      // on a phone the sheet covers the page, so the entry waits where the reader will find it on closing
      if (full()) { jump(it.el.getBoundingClientRect().top + window.pageYOffset - this.under() - 16); return; }
      var stick = this.barTop(); if (stick != null && window.pageYOffset < stick) jump(stick); // the bar sticks, and the sheet hangs under it
      var r = it.el.getBoundingClientRect(), under = this.under();
      if (r.top < under + 8 || r.bottom > window.innerHeight - 8) jump(r.top + window.pageYOffset - under - 16, smooth);
    },
    close: function (focus) {
      var it = this.open, sheet = $('#gl-sheet');
      sheet.hidden = true; this.open = null; this.layout();
      if (it && it.el) {
        it.el.classList.remove('is-on');
        if (focus) { var b = it.el.querySelector('.gl-hw button'); if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } this.reveal(it, false); } }
      }
      if (CP.Router && CP.Router.current === 'glossary' && /^#(gl-|lk-)/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#/glossary');
    },
    step: function (d) {
      var i = this.shown.indexOf(this.open), n = this.shown[i + d]; if (!n) return;
      this.show(n.id, { push: true, reveal: true });
      var b = $(d < 0 ? '#gl-prev' : '#gl-next'); if (b && b.disabled) { var t = $('#gl-sheet-body .lk-t'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } }
    },

    /* the whole entry: a term as the page lays it out; a firm, a chip or a country as the site's card */
    cardHTML: function (it) {
      if (it.kind === 'term') {
        var t = this.term(it);
        return '<article class="lk-card lk-card--term"><p class="lk-kind">' + esc(it.label) + '</p><h2 class="lk-t">' + esc(t.term) + '</h2>' +
          (t.aka ? '<p class="lk-aka">' + esc(t.aka) + '</p>' : '') + '<p class="lk-lede">' + esc(t.plain) + '</p>' + (t.why ? '<p class="lk-p lk-why">' + esc(t.why) + '</p>' : '') + this.refsHTML(it) + '</article>';
      }
      var d = it.data; if (!d) return '';
      return it.kind === 'firm' ? this.firmCard(d) : it.kind === 'chip' ? this.chipCard(d) : this.countryCard(d);
    },

    /* no entry, but the site may still mention it: a tool model, a place, a person */
    showRaw: function (q) {
      var self = this, near = this.nearest(q), box = $('#gl-none'), hits = this.mentions([q], 'raw', q);
      box.innerHTML = '<div class="lk-noentry"><p class="lk-kind">No entry</p><p class="lk-t">' + esc(q) + '</p>' +
        (near.length ? '<p class="lk-near"><span>Did you mean</span> ' + near.map(function (it) { return '<button type="button" class="gl-pill" data-go="' + esc(it.id) + '">' + esc(it.name) + '</button>'; }).join(' ') + '</p>' : '') + '</div>' +
        this.passagesHTML(hits, 'raw', 12, 'gl-none');
      this.wirePassages(box, hits, 'raw');
      $$('[data-go]', box).forEach(function (b) { b.addEventListener('click', function () { var inp = $('#gl-search'); inp.value = ''; self.filter('', false); self.show(b.getAttribute('data-go'), { push: true, focus: true, reveal: true }); }); });
    },

    nearest: function (q) { // names a typo away: an edit distance of one or two against each word of each name
      q = q.toLowerCase(); if (q.length < 4) return [];
      var dist = function (a, b) { var m = a.length, n = b.length, prev = [], cur = [], i, j; for (j = 0; j <= n; j++) prev[j] = j; for (i = 1; i <= m; i++) { cur = [i]; for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
      var scored = [];
      this.items.forEach(function (it) {
        var best = dist(q, it.lname);
        it.lname.split(/[\s()\-]+/).forEach(function (w) { if (w.length >= 3) best = Math.min(best, dist(q, w)); });
        if (best <= (q.length >= 8 ? 3 : 2)) scored.push({ it: it, d: best });
      });
      return scored.sort(function (a, b) { return a.d - b.d; }).slice(0, 5).map(function (x) { return x.it; });
    },

    /* ---------- cards ---------- */
    firmCard: function (r) {
      var meta = [r.category, r.subcategory].filter(Boolean).join(' · ');
      var where = [r.city, cname(r.country)].filter(Boolean).join(', ');
      var facts = [];
      if (where) facts.push(['Based in', where]);
      if (r.founded) facts.push(['Founded', String(r.founded)]);
      if (r.ownership || r.ticker) facts.push(['Ownership', [r.ownership, r.ticker ? 'ticker ' + r.ticker : ''].filter(Boolean).join(', ')]);
      if (r.customers && r.customers.length) facts.push(['Named customers', r.customers.join(', ')]);
      // revenue as filed, linked to the filing, with about how much in dollars (the Suppliers row prints it the same way, src/app.js);
      // it comes last and takes the card's full width, so the filing's note follows it. A firm with no filed revenue yet keeps its earlier dollar figure.
      var rs = r.revenueShown, revHTML = rs && CP.Suppliers && CP.Suppliers.revenueHTML ? CP.Suppliers.revenueHTML(rs) : '';
      if (revHTML) facts.push(['Revenue', revHTML, true]);
      else if (r.revenueUSDb != null) facts.push(['Revenue', '$' + (Math.round(r.revenueUSDb * 10) / 10).toLocaleString('en-US') + 'bn' + (r.revenueYear ? ', ' + r.revenueYear : '')]);
      // under the revenue, the share of it that came from China (the China revenue panel's latest year), linked to the firm's chart,
      // with the firm's small China chart under it, as in the Suppliers panel (Suppliers.exMini in src/app.js).
      // safeUrl escapes what it returns, so it is not escaped again
      if (r.china && r.china.href) facts.push(['From China', '<a href="' + CP.safeUrl(r.china.href) + '">' + esc(String(r.china.label).replace(/^China /, '')) + ' <span aria-hidden="true">→</span></a>' +
        (CP.Suppliers && CP.Suppliers.exMini ? CP.Suppliers.exMini(r.china.href) : ''), true]);
      return '<article class="lk-card lk-card--firm">' +
        '<p class="lk-kind">Firm' + (r.chokepoint ? ' · <span class="lk-chk lk-chk--' + esc(String(r.chokepoint).toLowerCase()) + '">' + esc(r.chokepoint) + '</span>' : '') + '</p>' +
        '<h2 class="lk-t">' + esc(r.name) + (r.nativeName ? ' <span class="lk-native">' + esc(r.nativeName) + '</span>' : '') + '</h2>' +
        (meta ? '<p class="lk-meta">' + esc(meta) + '</p>' : '') +
        (r.role ? '<p class="lk-lede">' + esc(r.role) + '</p>' : '') +
        (r.shareNote ? '<p class="lk-p">' + esc(r.shareNote) + '</p>' : '') +
        (r.aiRelevance ? '<p class="lk-p lk-why">' + esc(r.aiRelevance) + '</p>' : '') +
        (facts.length ? '<dl class="lk-facts">' + facts.map(function (f) { return (f[2] ? '<div class="lk-fact-wide">' : '<div>') + '<dt>' + esc(f[0]) + '</dt><dd>' + (f[2] ? f[1] : esc(f[1])) + '</dd></div>'; }).join('') + '</dl>' : '') +
        // the filing's note (build/build.js leaves out the lines meant for the editors): a figure from an unaudited release, a year older, or one the auditor would not sign
        (revHTML && rs.note ? '<p class="lk-revnote"><b>About the revenue figure.</b> ' + esc(rs.note) + '</p>' : '') +
        '<p class="lk-links"><a href="#/suppliers" data-sup="' + esc(r.name) + '">In the supplier list →</a>' + (r.source && CP.safeUrl(r.source) !== '#' ? ' <a href="' + CP.safeUrl(r.source) + '" target="_blank" rel="noopener">Company page ↗</a>' : '') + '</p>' +
        '</article>';
    },

    chipCard: function (c) {
      var p = c.process || {}, m = c.memory || {}, comp = c.compute || {};
      var facts = [];
      if (c.announced || c.shipping) facts.push(['Announced / shipping', [c.announced, c.shipping].filter(Boolean).join(' / ')]);
      if (p.node || p.foundry) facts.push(['Made by', [p.foundry, p.node, p.country ? cname(p.country) : ''].filter(Boolean).join(', ')]);
      if (m.type) facts.push(['Memory', [m.type, m.stacks ? m.stacks + ' stacks' : '', m.capacityGB ? m.capacityGB + ' GB' : '', m.bandwidthTBs ? m.bandwidthTBs + ' TB/s' : ''].filter(Boolean).join(', ')]);
      var fp = []; if (comp.fp16TFLOPS) fp.push('FP16 ' + comp.fp16TFLOPS.toLocaleString('en-US')); if (comp.fp8TFLOPS) fp.push('FP8 ' + comp.fp8TFLOPS.toLocaleString('en-US')); if (comp.fp4TFLOPS) fp.push('FP4 ' + comp.fp4TFLOPS.toLocaleString('en-US'));
      if (fp.length) facts.push(['Dense TFLOPS', fp.join(' · ')]);
      if (c.tdpW) facts.push(['Power', c.tdpW + ' W']);
      if (c.target) facts.push(['Built for', c.target]);
      return '<article class="lk-card lk-card--chip">' +
        '<p class="lk-kind">AI chip · ' + esc(c.vendor) + (c.vendorCountry ? ', ' + esc(cname(c.vendorCountry)) : '') + '</p>' +
        '<h2 class="lk-t">' + esc(c.vendor + ' ' + c.name) + '</h2>' +
        (c.status ? '<p class="lk-meta">' + esc(c.status) + '</p>' : '') +
        (c.notes ? '<p class="lk-lede">' + esc(c.notes) + '</p>' : '') +
        (c.exportStatus ? '<p class="lk-p lk-why"><b>Export status.</b> ' + esc(c.exportStatus) + '</p>' : '') +
        (facts.length ? '<dl class="lk-facts">' + facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' : '') +
        '<p class="lk-links"><a href="#/landscape" data-chip="' + esc(c.id) + '">On AI Chips →</a></p>' +
        '</article>';
    },

    /* the firms whose country differs between the shares and the supplier list, as data/chokepoint-matrix-notes.md gives them
       (the specialty gases and core IP rows' notes say the same), and the country cards they touch */
    SPLITS: {
      siemens: 'Siemens EDA is run from Oregon but owned by Siemens AG, so the EDA software share counts it under Germany and the supplier list under the US.',
      linde: 'Linde plc is incorporated in Ireland, with head offices in the UK and the US. The specialty gases share counts it under Germany for its roots in Linde AG, as Georgetown University\'s Emerging Technology Observatory does. The supplier list counts it under the UK.',
      arm: 'The core IP share counts Arm under the UK, where it has its headquarters, although SoftBank of Japan owns most of it.'
    },
    SPLIT_BY: { DE: ['siemens', 'linde'], US: ['siemens'], GB: ['arm', 'linde'] },
    /* a country's facts: the stages it leads, the chokepoint cards that name it, its firms in the supplier list. Every figure is
       computed from DATA; the card's meta line and the dictionary's line under the name are both this */
    countryFacts: function (cc) {
      var chapters = DATA.chapters || [];
      var stages = chapters.filter(function (ch) { return ch.number >= 1 && ch.number <= 15; });
      var cardCount = chapters.filter(function (ch) { return ch.concentration; }).length; // only the stage chapters carry a chokepoint card
      var named = chapters.filter(function (ch) { return (ch.countries || []).some(function (x) { return x.code === cc; }); })
        .sort(function (a, b) { return (b.bandRank || 0) - (a.bandRank || 0) || a.number - b.number; });
      var led = stages.filter(function (ch) { var f = (ch.countries || [])[0]; return f && f.code === cc; });
      var extreme = led.filter(function (ch) { return ch.band === 'Extreme'; }).length;
      var firms = (DATA.suppliers || []).filter(function (r) { return r.country === cc; });
      var critical = firms.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
      var meta = [];
      if (led.length === 1) meta.push('leads 1 stage' + (extreme ? ', of extreme concentration' : ''));
      else if (led.length) meta.push('leads ' + led.length + ' stages' + (extreme ? ', ' + (extreme === led.length ? 'all' : extreme) + ' of them extreme' : ''));
      meta.push('named on ' + named.length + ' of ' + cardCount + ' chokepoint cards');
      if (firms.length) meta.push(firms.length + (firms.length === 1 ? ' firm' : ' firms') + ' in the supplier list' + (critical ? ', ' + critical + ' Critical' : ''));
      return { named: named, firms: firms, meta: meta.join(' · ') };
    },
    countryMeta: function (co) { return this.countryFacts(co.code).meta; },
    /* a country: the Suppliers page's one line on what it makes, the stages it leads or holds a share of, the chokepoint
       cards that name it, and its firms by category with the Critical ones named */
    countryCard: function (co) {
      var cc = co.code, self = this, F = this.countryFacts(cc), named = F.named, firms = F.firms;
      var num = function (v) { return Math.round(v) === v ? String(v) : String(Math.round(v * 10) / 10); };
      var chHref = function (ch) { return ch.id === 'geopolitics' ? '#/geopolitics' : '#' + ch.id; };
      // shares: every matrix row that carries the country, largest first; rows under one percent are folded into one line
      var segs = (DATA.matrix || []).filter(function (r) { return r.shares && r.shares[cc] != null; }).map(function (r) {
        var rank = Object.keys(r.shares).sort(function (a, b) { return r.shares[b] - r.shares[a]; }).indexOf(cc) + 1;
        var basis = r.basis === 'relayed' ? 'reported by ' + (r.relayedVia || 'a third party') : r.basis === 'derived' ? 'computed' : (r.basis || '');
        return { seg: r.segment, v: r.shares[cc], rank: rank, basis: basis, year: String(r.asOf || r.year || ''), method: r.method || '', capacity: /^capacity/i.test(r.metric || '') };
      }).sort(function (a, b) { return b.v - a.v; });
      var big = segs.filter(function (s) { return s.rank === 1 || s.v >= 1; }), small = segs.filter(function (s) { return s.rank !== 1 && s.v < 1; });
      // firms by category, the Critical ones named; each name opens that firm's entry
      var firmId = {}; this.items.forEach(function (it) { if (it.kind === 'firm') firmId[it.key] = it.id; });
      var cats = {};
      firms.forEach(function (r) { (cats[r.category || 'Other'] = cats[r.category || 'Other'] || []).push(r); });
      var catNames = Object.keys(cats).sort(function (a, b) { return cats[b].length - cats[a].length || a.localeCompare(b); });
      var h = '<article class="lk-card lk-card--country">' +
        '<p class="lk-kind">Country · ' + esc(cc) + '</p>' +
        '<h2 class="lk-t">' + esc(co.name) + '</h2>' +
        '<p class="lk-meta">' + esc(F.meta) + '</p>' +
        (co.role ? '<p class="lk-lede">' + esc(co.role) + '.</p>' : '');
      if (segs.length) {
        h += '<h3 class="lk-h lk-h--in">Share of each segment</h3><ul class="lk-shares">' + big.map(function (s) {
          var m = [s.rank === 1 ? 'largest share' : 'rank ' + s.rank, s.basis, s.year].filter(Boolean).join(' · ');
          return '<li class="lk-share' + (s.rank === 1 ? ' is-lead' : '') + '"' + (s.method ? ' title="' + esc(s.method) + '"' : '') + '><span class="lk-share-bar" style="--w:' + Math.min(100, s.v) + '%"></span><span class="lk-share-k">' + esc(s.seg) + '</span><span class="lk-share-v">' + num(s.v) + '%</span><span class="lk-share-m">' + esc(m) + '</span></li>';
        }).join('') + '</ul>' + (small.length ? '<p class="lk-small">Under 1%: ' + esc(small.map(function (s) { return s.seg; }).join(', ')) + '.</p>' : '');
      }
      if (named.length) {
        h += '<h3 class="lk-h lk-h--in">On the chokepoint cards</h3><ul class="lk-cards">' + named.map(function (ch) {
          var note = ((ch.countries || []).filter(function (x) { return x.code === cc; })[0] || {}).note || '';
          return '<li><a href="' + esc(chHref(ch)) + '"><span class="lk-card-t">' + esc(ch.title) + '</span>' + (ch.band ? '<b class="lk-band lk-band--' + esc(String(ch.band).toLowerCase()) + '">' + esc(ch.band) + '</b>' : '') + (note ? '<span class="lk-card-n">' + esc(note) + '</span>' : '') + '</a></li>';
        }).join('') + '</ul>';
      }
      if (firms.length) {
        h += '<h3 class="lk-h lk-h--in">In the supplier list <span class="lk-n">' + firms.length + ' across ' + catNames.length + (catNames.length === 1 ? ' category' : ' categories') + '</span></h3><ul class="lk-stages">' + catNames.map(function (cat) {
          var rows = cats[cat], crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; });
          return '<li><span class="lk-stage-k">' + esc(cat) + '</span><span class="lk-stage-c">' + rows.length + '</span>' + (crit.length ? '<span class="lk-stage-f">' + crit.map(function (r) { return firmId[r.name] ? '<button type="button" class="lk-go" data-go="' + esc(firmId[r.name]) + '">' + esc(r.name) + '</button>' : esc(r.name); }).join(' ') + '</span>' : '') + '</li>';
        }).join('') + '</ul>';
        // a member of the EU-27: the bloc's firms counted together, as the Suppliers ribbons can draw them (the member list is app.js's)
        var EU27 = (CP.Suppliers && CP.Suppliers.EU27) || [];
        if (EU27.indexOf(cc) >= 0) {
          var eu = (DATA.suppliers || []).filter(function (r) { return EU27.indexOf(r.country) >= 0; }), euCrit = eu.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
          h += '<p class="lk-eu">Across the EU-27, the supplier list has ' + eu.length + ' firms' + (euCrit ? ', ' + euCrit + ' of them Critical' : '') + '. <a href="#/suppliers?group=eu">See them together on the Suppliers page →</a></p>';
        }
      }
      // how the card's numbers give a firm its country: shares of a market's revenue go by parent company, capacity by plant, the
      // supplier list by each firm's own headquarters (data/chokepoint-matrix-notes.md, "Converting firm shares to country shares"),
      // with the firms that part the shares from the list named on the cards whose numbers they touch
      if (segs.length) {
        var rev = segs.some(function (s) { return !s.capacity; }), cap = segs.some(function (s) { return s.capacity; }), note = [];
        if (rev) note.push('Country shares of a market\'s revenue count most firms under their parent company\'s home country' + (firms.length ? ', and the supplier list counts each firm under the country of its own headquarters.' : '.'));
        if (cap) note.push('Shares of manufacturing capacity count each plant under the country where it stands.');
        if (!rev && firms.length) note.push('The supplier list counts each firm under the country of its own headquarters.');
        (this.SPLIT_BY[cc] || []).forEach(function (k) { note.push(self.SPLITS[k]); });
        h += '<p class="lk-note">' + esc(note.join(' ')) + '</p>';
      }
      h += '<p class="lk-links">' + (co.panel ? '<a href="#/suppliers?country=' + esc(cc) + '">See what it makes on the Suppliers page →</a>' : '') + (firms.length ? '<a href="#/suppliers" data-supcc="' + esc(cc) + '">Its firms in the supplier list →</a>' : '') + '</p></article>';
      return h;
    },

    wireCard: function (root) {
      var self = this;
      // the supplier list takes the whole filter from the link (a firm's name, or a country), so an older search or stage cannot narrow it (correctness P1-2)
      $$('a[data-sup]', root).forEach(function (a) { a.addEventListener('click', function () { var q = a.getAttribute('data-sup'); setTimeout(function () { var S = CP.Suppliers; if (S && S.show) S.show({ q: q }); }, 60); }); });
      $$('a[data-supcc]', root).forEach(function (a) { a.addEventListener('click', function () { var cc = a.getAttribute('data-supcc'); setTimeout(function () { var S = CP.Suppliers; if (S && S.show) S.show({ country: cc }); }, 60); }); });
      $$('button[data-go]', root).forEach(function (b) { b.addEventListener('click', function () { self.show(b.getAttribute('data-go'), { push: true, focus: true, reveal: true }); }); });
      $$('a[data-chip]', root).forEach(function (a) { a.addEventListener('click', function () { var id = a.getAttribute('data-chip'); setTimeout(function () { if (window.CP.Landscape && CP.Landscape.select) CP.Landscape.select(id); }, 60); }); });
    },

    /* ---------- where the site uses it ---------- */
    textOf: function (node) { // like textContent, but an element boundary counts as a space
      var s = ''; for (var i = 0; i < node.childNodes.length; i++) { var n = node.childNodes[i]; if (n.nodeType === 3) s += n.nodeValue; else if (n.nodeType === 1) s += ' ' + this.textOf(n) + ' '; } return s;
    },

    corpus: function () {
      if (this.paras) return this.paras; var out = [], self = this;
      $$('.view[data-view="stack"] article.chapter').forEach(function (ch) {
        var id = ch.id, title = ch.getAttribute('data-title') || id, num = ch.getAttribute('data-number') || '';
        $$('p, li', ch).forEach(function (el) {
          // the chapter head's facts line (.ch-meta: words, minutes, specimen, Updated) and its citation line and text (.ch-cite) are not passages (correctness P1-4)
          if (el.closest('.chapter-sources, .plate-head, .ch-meta, .ch-cite, .chain, figure, .chapter-nav, nav')) return;
          // a card's marks (and the comma between two of them) are not the passage's words
          var clone = el.cloneNode(true); $$('sup.cite, sup.cite-sep, .gl-tip, .chip', clone).forEach(function (s) { s.parentNode.removeChild(s); });
          var text = self.textOf(clone).replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
          if (text.length > 40) out.push({ chapter: id, title: title, num: num, el: el, text: text });
        });
      });
      this.paras = out; return out;
    },

    regex: function (patterns, loose) { // loose: a typed query matches as a prefix, so "NXT:1980" finds "NXT:1980i"
      var parts = patterns.map(function (p) { p = String(p).trim(); if (!p) return null; var e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); var bounded = /^[A-Za-z0-9]/.test(p) && /[A-Za-z0-9)]$/.test(p);
        // a short alias like "Arm" or "ASE" must keep its capitals, or it matches "arm" and "ease"; longer names may be written either way
        if (p.length <= 4 && /[A-Z]/.test(p) && !loose) e = e.split('').map(function (ch) { return /[a-z]/i.test(ch) ? (/[A-Z]/.test(ch) ? ch : '[' + ch + ch.toUpperCase() + ']') : ch; }).join('');
        return bounded ? '\\b' + e + (loose ? '' : '(?![A-Za-z0-9])') : e; }).filter(Boolean);
      if (!parts.length) return null;
      var short = patterns.some(function (p) { return String(p).trim().length <= 4 && /[A-Z]/.test(p); });
      return new RegExp(parts.join('|'), short && !loose ? 'g' : 'gi');
    },

    sentence: function (text, re) {
      re.lastIndex = 0; var m = re.exec(text); if (!m) return null;
      var start = text.lastIndexOf('. ', m.index); start = start < 0 ? 0 : start + 2;
      var end = text.indexOf('. ', m.index + m[0].length); end = end < 0 ? text.length : end + 1;
      var s = text.slice(start, end).trim();
      if (s.length > 320) { var a = Math.max(0, m.index - start - 140); s = (a ? '… ' : '') + s.slice(a, a + 300).trim() + ' …'; }
      return s;
    },

    patterns: function (it) {
      var p = it.kind === 'chip' ? [] : [it.name];
      it.alias.split('|').forEach(function (a) { if (a) p.push(a); });
      if (it.kind === 'chip' && !p.length) p = [it.name];
      return p;
    },
    hitsFor: function (it) { return this.mentions(this.patterns(it), it.kind, it.key); },

    /* every place the site uses it, in the site's order: the chapters, the Export Controls entries, the board, AI Chips, Suppliers.
       count: only how many, for the line under each entry (the sheet's own count is the same) */
    mentions: function (patterns, kind, key, count) {
      var self = this, re = this.regex(patterns, kind === 'raw'); if (!re) return count ? 0 : [];
      var hits = [], n = 0, test = function (t) { re.lastIndex = 0; return re.test(t); };
      var mark = function (s) { return esc(s).replace(re, function (x) { return '<mark>' + x + '</mark>'; }); };
      var add = function (h) { n++; if (!count) hits.push(h()); };
      this.corpus().forEach(function (p, i) { if (count ? test(p.text) : self.sentence(p.text, re)) add(function () { return { src: 'Chapter ' + p.num, sub: p.title, html: mark(self.sentence(p.text, re)), href: '#' + p.chapter, para: i }; }); });
      (Array.isArray(DATA.timeline) ? DATA.timeline : ((DATA.timeline || {}).events || [])).forEach(function (e) { var t = [e.gist || '', e.title || '', e.summary || ''].join(' '); if (!test(t)) return; add(function () { var s = self.sentence(e.gist && test(e.gist) ? e.gist : (e.summary || e.title), re) || e.title; return { src: 'Export Controls', sub: e.date, html: mark(s), href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }; }); }); // the entry's own address opens it (correctness P1-6)
      (Array.isArray(DATA.flows) ? DATA.flows : ((DATA.flows || {}).flows || [])).forEach(function (f) { (f.states || []).forEach(function (st) { if (st.label && test(st.label)) add(function () { return { src: 'Export Controls', sub: f.name, html: mark(st.label), href: st.event ? '#/controls/' + encodeURIComponent(st.event) : '#/controls' }; }); }); }); // a board state links to the entry that set it
      (DATA.landscape || []).forEach(function (c) { if (kind === 'chip' && c.id === key) return; var t = [c.notes || '', c.exportStatus || ''].join(' '); if (count ? test(t) : self.sentence(t, re)) add(function () { return { src: 'AI Chips', sub: c.vendor + ' ' + c.name, html: mark(self.sentence(t, re)), href: '#/landscape', chip: c.id }; }); });
      (DATA.suppliers || []).forEach(function (r) { if (kind === 'firm' && r.name === key) return; var t = [r.role || '', r.shareNote || '', r.aiRelevance || ''].join(' '); if (count ? test(t) : self.sentence(t, re)) add(function () { return { src: 'Suppliers', sub: r.name, html: mark(self.sentence(t, re)), href: '#/suppliers', sup: r.name }; }); });
      return count ? n : hits;
    },

    passagesHTML: function (hits, kind, limit, idp) {
      var all = hits.length, hid = (idp || 'gl') + '-pass-h';
      if (!all) return '<section class="lk-pass" aria-labelledby="' + hid + '"><h3 class="lk-pass-h" id="' + hid + '">Where it appears</h3><p class="lk-none">' + (kind === 'firm' ? 'Only in the supplier list.' : kind === 'chip' ? 'Only on the AI Chips page.' : kind === 'term' ? 'Only in this entry.' : 'Nowhere else.') + '</p></section>';
      return '<section class="lk-pass" aria-labelledby="' + hid + '"><h3 class="lk-pass-h" id="' + hid + '"><span>Where it appears</span><span class="lk-n">' + all + (all === 1 ? ' place' : ' places') + '</span></h3><ul class="lk-men">' + hits.slice(0, limit).map(this.row).join('') + '</ul>' +
        (all > limit ? '<p class="lk-more"><button type="button" class="gl-pill">Show all ' + all + '</button></p>' : '') + '</section>';
    },
    row: function (h) { var attrs = h.para != null ? ' data-para="' + h.para + '"' : h.chip ? ' data-chip="' + esc(h.chip) + '"' : h.sup ? ' data-sup="' + esc(h.sup) + '"' : ''; return '<li><a href="' + esc(h.href) + '"' + attrs + '><span class="lk-src"><b>' + esc(h.src) + '</b> ' + esc(h.sub) + '</span><span class="lk-txt">' + h.html + '</span></a></li>'; },
    wirePassages: function (box, hits, kind) {
      var self = this, more = $('.lk-more button', box);
      if (more) more.addEventListener('click', function () { var ul = $('.lk-men', box), n = ul.children.length; ul.innerHTML = hits.map(self.row).join(''); more.parentNode.parentNode.removeChild(more.parentNode); self.wireLinks(box); var next = ul.children[n] && ul.children[n].querySelector('a'); if (next) next.focus({ preventScroll: false }); });
      this.wireLinks(box);
    },
    wireLinks: function (box) {
      var self = this;
      $$('.lk-men a', box).forEach(function (a) {
        if (a.getAttribute('data-wired')) return; a.setAttribute('data-wired', '1');
        if (a.hasAttribute('data-sup')) a.addEventListener('click', function () { var q = a.getAttribute('data-sup'); setTimeout(function () { var S = CP.Suppliers; if (S && S.show) S.show({ q: q }); }, 60); });
        if (a.hasAttribute('data-chip')) a.addEventListener('click', function () { var id = a.getAttribute('data-chip'); setTimeout(function () { if (window.CP.Landscape && CP.Landscape.select) CP.Landscape.select(id); }, 60); });
        if (a.hasAttribute('data-para')) a.addEventListener('click', function (e) {
          e.preventDefault(); var p = self.paras[+a.getAttribute('data-para')]; if (!p) return;
          location.hash = '#' + p.chapter;
          // the router lands on the chapter and settles it there; the passage's own settle then takes over, so late fonts and
          // images cannot pull the page back to the chapter's top (correctness P1-1)
          setTimeout(function () {
            CP.scrollToEl(p.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(p.el);
            p.el.classList.add('lk-flash'); setTimeout(function () { p.el.classList.remove('lk-flash'); }, 2600);
          }, 140);
        });
      });
    },

    /* each entry's count of passages, a few entries at a time while the browser is idle, so the page answers at once */
    countAll: function () {
      var self = this, i = 0;
      var run = function (dl) {
        var t0 = Date.now();
        while (i < self.items.length && (dl.timeRemaining() > 2 || Date.now() - t0 < 6)) {
          var it = self.items[i++];
          it.places = self.mentions(self.patterns(it), it.kind, it.key, true);
          var foot = it.el && it.el.querySelector('.gl-foot');
          if (foot) foot.innerHTML = it.kind === 'term' && !it.places ? '<span class="gl-nil">Only in this entry.</span>' : '<button type="button" class="gl-more" data-open tabindex="-1">' + self.moreText(it) + '</button>';
          if (Date.now() - t0 > 12) break;
        }
        if (i < self.items.length) idle(run);
        else $('.view[data-view="glossary"]').setAttribute('data-gl', 'counted');
      };
      idle(run);
    }
  };

  CP.Lookup = Lookup;
  CP.register('glossary', { activate: function () { Lookup.activate(); }, stage: false });
})();
