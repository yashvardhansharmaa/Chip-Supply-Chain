/* Look up (#/glossary): one list of every term, firm, chip and country on the left; the entry on the right,
   then the places the site uses it. Terms are the glossary entries already in the page (the popovers read
   them too); firm, chip and country cards are drawn from DATA at the moment of selection (a country's card
   from the chapter cards, the country-share matrix, the supplier list and the home page's role line); the
   passages are found by scanning the chapters, the board, the AI chips and the supplier list for the entry's name. */
(function () {
  var CP = window.CP; if (!CP) return;
  var $ = CP.$, $$ = CP.$$, esc = CP.esc, DATA = CP.DATA || {}, cname = CP.cname, narrow = CP.narrow, reduced = CP.reduced;

  var Lookup = {
    built: false, selected: null, timer: null, cursor: -1, paras: null,

    init: function () {
      var self = this, inp = $('#gl-search'), list = $('#lk-items'); if (!inp || !list || this.built) return;
      this.built = true;
      $$('#glossary .gl-entry').forEach(function (e) { e.hidden = true; }); // nothing is chosen yet; the prompt stands alone
      inp.addEventListener('input', function () { clearTimeout(self.timer); self.timer = setTimeout(function () { self.filter(inp.value); }, 80); });
      inp.addEventListener('focus', function () { $('#lk-list').classList.add('is-open'); });
      inp.addEventListener('keydown', function (e) {
        var vis = self.visible();
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault(); if (!vis.length) return;
          self.cursor = e.key === 'ArrowDown' ? Math.min(vis.length - 1, self.cursor + 1) : Math.max(0, self.cursor - 1);
          self.select(vis[self.cursor].id, true); // the arrows preview an entry; focus stays in the box
        } else if (e.key === 'Enter') { // Enter chooses: the entry's heading takes focus, so the next Tab is in the card (accessibility #1)
          e.preventDefault();
          if (vis.length) { $('#lk-list').classList.remove('is-open'); self.select(vis[Math.max(0, self.cursor)].id, true, true); }
        }
        else if (e.key === 'Escape') { inp.value = ''; self.filter(''); }
      });
      list.addEventListener('click', function (e) {
        var li = e.target.closest ? e.target.closest('li[id]') : null; if (!li) return;
        $('#lk-list').classList.remove('is-open'); self.select(li.id, true, true);
      });
      // the list is one Tab stop (the chosen entry, or the first shown); the arrow keys, Home and End walk it, so Tab goes from the
      // list straight to the card instead of through 487 entries (accessibility #1)
      list.addEventListener('keydown', function (e) {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
        var b = e.target.closest ? e.target.closest('#lk-items button') : null; if (!b) return;
        var btns = self.visible().map(function (li) { return li.querySelector('button'); }), i = btns.indexOf(b);
        var j = e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : Math.max(0, Math.min(btns.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
        e.preventDefault(); if (!btns[j]) return;
        btns.forEach(function (x) { x.tabIndex = -1; }); btns[j].tabIndex = 0; btns[j].focus();
      });
      document.addEventListener('click', function (e) { if (narrow() && !e.target.closest('#lk-list')) $('#lk-list').classList.remove('is-open'); });
      var br = $('#lk-browse'); if (br) br.addEventListener('click', function () { var open = !$('#lk-list').classList.contains('is-open'); $('#lk-list').classList.toggle('is-open', open); br.setAttribute('aria-expanded', open ? 'true' : 'false'); });
      this.suggest();
      this.filter('');
      var cnt = $('#lk-count'); if (cnt) cnt.setAttribute('role', 'status'); // from now on a new count is read out (accessibility #5)
    },

    /* six things to try, drawn afresh on every load: two terms, two firms that matter, one chip, one country */
    suggest: function () {
      var self = this, box = $('#lk-rest .lk-try'); if (!box) return;
      var pick = function (arr, n) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, n); };
      var items = this.items();
      var terms = items.filter(function (li) { return li.getAttribute('data-kind') === 'term' && li.querySelector('.lk-name').textContent.length <= 22; });
      var big = {}; (DATA.suppliers || []).forEach(function (r) { if (r.chokepoint === 'Critical' || r.chokepoint === 'Important') big[r.name] = 1; });
      var firms = items.filter(function (li) { return li.getAttribute('data-kind') === 'firm' && big[li.getAttribute('data-key')]; });
      var chips = items.filter(function (li) { return li.getAttribute('data-kind') === 'chip'; });
      var countries = items.filter(function (li) { return li.getAttribute('data-kind') === 'country'; });
      var chosen = pick(terms, 2).concat(pick(firms, 2), pick(chips, 1), pick(countries, 1)); chosen = pick(chosen, chosen.length);
      var label = box.querySelector('.lk-try-k') ? box.querySelector('.lk-try-k').outerHTML : 'Try';
      // a chip's list name is its maker and its name ("Huawei (HiSilicon) Ascend 950PR", build/build.js), so a suggestion takes the
      // chip's own name from the data (its data-key is the chip id); a trailing aside, "(Ironwood)", is dropped as for every kind
      var chipName = {}; (DATA.landscape || []).forEach(function (c) { chipName[c.id] = c.name; });
      box.innerHTML = label + ' ' + chosen.map(function (li) { var own = li.getAttribute('data-kind') === 'chip' ? chipName[li.getAttribute('data-key')] : ''; var name = String(own || li.querySelector('.lk-name').textContent).replace(/\s*\(.*\)$/, ''); return '<button type="button" data-go="' + esc(li.id) + '">' + esc(name) + '</button>'; }).join(' ');
      $$('[data-go]', box).forEach(function (b) { b.addEventListener('click', function () { self.select(b.getAttribute('data-go'), true, true); }); });
    },

    activate: function () {
      this.init();
      var h = (location.hash || '').replace(/^#/, ''), el = h && document.getElementById(h);
      if (el && (el.closest('#lk-items') || (el.classList && el.classList.contains('gl-entry')))) { this.select(h, false); this.land(); }
    },
    /* an address that names an entry (a popover's Look it up, a search result, a card's link): the router leaves the page where
       the last view had it, so the Glossary starts at its top, where the entry stands beside the list, or on a phone at the entry
       itself. After a move within the site (not a first load) the entry's heading takes focus too (correctness P1-5) */
    land: function () {
      var R = CP.Router || {}, within = R.from === 'glossary', root = document.documentElement, sb = root.style.scrollBehavior;
      if (narrow()) { var top = $('#lk-entry'); if (top) CP.scrollToEl(top, within); }
      else { root.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); root.style.scrollBehavior = sb; }
      var li = this.selected && document.getElementById(this.selected); if (li) this.inList(li); // the list, measured with the page in place
      if (R.routed && R.from) this.focusCard(false);
    },
    /* the chosen entry's heading takes focus, so the next Tab reaches the card's links (accessibility #1). scroll: on a phone, or
       when the heading is out of sight, the page brings the entry up first */
    focusCard: function (scroll) {
      var head = $('#glossary .gl-entry:not([hidden]) dt') || $('#lk-card:not([hidden]) h3') || $('#lk-card:not([hidden]) .lk-noentry b'), entry = $('#lk-entry');
      if (!head) return;
      if (scroll && entry) { var r = head.getBoundingClientRect(); if (narrow() || r.top < CP.headerH() || r.bottom > window.innerHeight) CP.scrollToEl(entry, true); }
      if (!head.hasAttribute('tabindex')) head.setAttribute('tabindex', '-1');
      try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); }
    },
    /* the list's one Tab stop: the chosen entry while it is shown, else the first shown */
    rove: function () {
      var on = this.selected && document.getElementById(this.selected), vis = this.visible(), pick = on && !on.hidden ? on : vis[0];
      this.items().forEach(function (li) { var b = li.firstElementChild; if (b) b.tabIndex = li === pick ? 0 : -1; });
    },
    /* the list scrolls to show the chosen entry, centered in the part of the list on screen; the page itself does not move
       (scrollIntoView would move both) */
    inList: function (li) {
      var box = $('#lk-items'); if (!box || !box.clientHeight || li.hidden) return;
      var r = li.getBoundingClientRect(), br = box.getBoundingClientRect(), top = Math.max(br.top, CP.headerH()), bottom = Math.min(br.bottom, window.innerHeight);
      if (bottom - top < r.height) return;
      if (r.top < top || r.bottom > bottom) box.scrollTop += r.top + r.height / 2 - (top + bottom) / 2;
    },

    items: function () { return $$('#lk-items li'); },
    visible: function () { return this.items().filter(function (li) { return !li.hidden; }); },

    filter: function (q) {
      q = String(q || '').trim().toLowerCase(); var self = this;
      var words = q.split(/\s+/).filter(Boolean), n = 0, all = this.items();
      all.forEach(function (li) {
        var t = li.getAttribute('data-text') || '', name = li.querySelector('.lk-name').textContent.toLowerCase();
        var ok = !q || words.every(function (w) { return t.indexOf(w) >= 0; });
        li.hidden = !ok; if (ok) n++;
        // a name that contains the query, or an alias that starts with it ("dutch", "prc", "foxconn"), counts as a name hit
        var al = (li.getAttribute('data-alias') || '').toLowerCase().split('|');
        li.classList.toggle('is-name', !!q && (name.indexOf(q) >= 0 || al.some(function (a) { return a && a.indexOf(q) === 0; })));
        li.classList.toggle('is-exact', !!q && (name === q || al.indexOf(q) >= 0)); // "us", "uk", "tsmc": the entry that goes by exactly that
      });
      // names that contain the query rise to the top, so "H100" is not buried under every firm that sells to Nvidia; an exact name or alias tops them
      if (q) { var list = $('#lk-items'); this.visible().filter(function (li) { return li.classList.contains('is-name'); }).reverse().forEach(function (li) { list.insertBefore(li, list.firstChild); }); this.visible().filter(function (li) { return li.classList.contains('is-exact'); }).reverse().forEach(function (li) { list.insertBefore(li, list.firstChild); }); }
      else { var list2 = $('#lk-items'); all.slice().sort(function (a, b) { return a.querySelector('.lk-name').textContent.localeCompare(b.querySelector('.lk-name').textContent, 'en', { sensitivity: 'base' }); }).forEach(function (li) { list2.appendChild(li); }); }
      this.cursor = -1;
      this.rove();
      var c = $('#lk-count'), terms = $$('#lk-items li[data-kind="term"]').length, firms = $$('#lk-items li[data-kind="firm"]').length, chips = $$('#lk-items li[data-kind="chip"]').length, countries = $$('#lk-items li[data-kind="country"]').length;
      if (c) c.textContent = q ? (n ? n + ' of ' + all.length + ' entries' : 'No entry matches.') : all.length + ' entries · ' + terms + ' terms · ' + firms + ' firms · ' + chips + ' chips' + (countries ? ' · ' + countries + ' countries' : '');
      $('#lk-list').classList.toggle('is-open', !!q || document.activeElement === $('#gl-search'));
      if (q && !n) this.showRaw(q); // no entry, but the site may still mention it: a tool model, a place, a person
      else if (q && n && (!this.selected || document.getElementById(this.selected).hidden)) this.select(this.visible()[0].id, true);
    },

    /* ---------- selection ---------- */
    select: function (id, push, focus) { // focus: the reader chose it (a click, Enter, a suggestion), so the entry takes focus
      if (/^gl-/.test(id)) id = 'lk-term-' + id.slice(3); // a glossary entry's own id (popovers, search, old links) names the same row
      var li = document.getElementById(id); if (!li || !li.closest('#lk-items')) return;
      var kind = li.getAttribute('data-kind'), key = li.getAttribute('data-key');
      if (!kind) return;
      this.selected = id;
      // aria-current on the button the reader reaches, not on its li (accessibility #17)
      this.items().forEach(function (x) { var on = x.id === id, b = x.firstElementChild; x.classList.toggle('is-on', on); x.removeAttribute('aria-current'); if (b) { if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); } });
      this.rove();
      this.inList(li);
      $('#lk-rest').hidden = true;
      var entry = null, name = li.querySelector('.lk-name').textContent, patterns = kind === 'chip' ? [] : [name];
      (li.getAttribute('data-alias') || '').split('|').forEach(function (a) { if (a) patterns.push(a); });
      $$('#glossary .gl-entry').forEach(function (e) { e.hidden = true; });
      var card = $('#lk-card'); card.hidden = true; card.innerHTML = '';
      if (kind === 'term') {
        entry = document.getElementById(key); if (entry) entry.hidden = false;
      } else if (kind === 'firm') {
        var r = (DATA.suppliers || []).filter(function (x) { return x.name === key; })[0];
        if (r) { card.innerHTML = this.firmCard(r); card.hidden = false; }
      } else if (kind === 'chip') {
        var c = (DATA.landscape || []).filter(function (x) { return x.id === key; })[0];
        if (c) { card.innerHTML = this.chipCard(c); card.hidden = false; }
        if (!patterns.length) patterns = [name];
      } else if (kind === 'country') {
        var co = (DATA.countries || []).filter(function (x) { return x.code === key; })[0];
        if (co) { card.innerHTML = this.countryCard(co); card.hidden = false; }
      }
      this.wire(card);
      this.mentions(patterns, kind, key);
      var anchor = kind === 'term' ? key : id;
      if (push && location.hash !== '#' + anchor) history.replaceState(null, '', '#' + anchor);
      // a choice brings the entry up and gives it focus; a preview (the arrows, the first match while typing) leaves the page and the focus alone
      if (focus) this.focusCard(true);
    },

    showRaw: function (q) {
      var self = this;
      this.selected = null;
      this.items().forEach(function (x) { x.classList.remove('is-on'); });
      $$('#glossary .gl-entry').forEach(function (e) { e.hidden = true; });
      var near = this.nearest(q);
      var card = $('#lk-card'); card.hidden = false;
      card.innerHTML = '<div class="lk-noentry"><b>' + esc(q) + '</b><p>No entry.</p>' + (near.length ? '<p class="lk-near">Did you mean ' + near.map(function (li) { return '<button type="button" data-go="' + esc(li.id) + '">' + esc(li.querySelector('.lk-name').textContent) + '</button>'; }).join(' ') + '</p>' : '') + '</div>';
      $$('[data-go]', card).forEach(function (b) { b.addEventListener('click', function () { var inp = $('#gl-search'); inp.value = ''; self.filter(''); self.select(b.getAttribute('data-go'), true, true); }); });
      $('#lk-rest').hidden = true;
      this.mentions([q], 'raw', q);
    },

    nearest: function (q) { // names a typo away: an edit distance of one or two against each word of each name
      q = q.toLowerCase(); if (q.length < 4) return [];
      var dist = function (a, b) { var m = a.length, n = b.length, prev = [], cur = [], i, j; for (j = 0; j <= n; j++) prev[j] = j; for (i = 1; i <= m; i++) { cur = [i]; for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
      var scored = [];
      this.items().forEach(function (li) {
        var name = li.querySelector('.lk-name').textContent.toLowerCase(), best = dist(q, name);
        name.split(/[\s()\-]+/).forEach(function (w) { if (w.length >= 3) best = Math.min(best, dist(q, w)); });
        if (best <= (q.length >= 8 ? 3 : 2)) scored.push({ li: li, d: best });
      });
      return scored.sort(function (a, b) { return a.d - b.d; }).slice(0, 5).map(function (x) { return x.li; });
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
      // under the revenue, the share of it that came from China (the China revenue panel's latest year), linked to the firm's chart
      // ...with the firm's small China chart under it, as in the Suppliers panel (Suppliers.exMini in src/app.js)
      // safeUrl escapes what it returns, so it is not escaped again (the double escape broke the Company page links, below)
      if (r.china && r.china.href) facts.push(['From China', '<a href="' + CP.safeUrl(r.china.href) + '">' + esc(String(r.china.label).replace(/^China /, '')) + ' <span aria-hidden="true">→</span></a>' +
        (CP.Suppliers && CP.Suppliers.exMini ? CP.Suppliers.exMini(r.china.href) : ''), true]);
      return '<article class="lk-card lk-card--firm">' +
        '<p class="lk-kind">Firm' + (r.chokepoint ? ' · <span class="lk-chk lk-chk--' + esc(String(r.chokepoint).toLowerCase()) + '">' + esc(r.chokepoint) + '</span>' : '') + '</p>' +
        '<h3>' + esc(r.name) + (r.nativeName ? ' <span class="lk-native">' + esc(r.nativeName) + '</span>' : '') + '</h3>' +
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
        '<h3>' + esc(c.vendor + ' ' + c.name) + '</h3>' +
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
    /* a country: the Suppliers page's one line on what it makes, the stages it leads or holds a share of, the chokepoint
       cards that name it, and its firms by category with the Critical ones named. Every figure is computed from DATA. */
    countryCard: function (co) {
      var cc = co.code, self = this, chapters = DATA.chapters || [];
      var num = function (v) { return Math.round(v) === v ? String(v) : String(Math.round(v * 10) / 10); };
      var chHref = function (ch) { return ch.id === 'geopolitics' ? '#/geopolitics' : '#' + ch.id; };
      var stages = chapters.filter(function (ch) { return ch.number >= 1 && ch.number <= 15; });
      var cardCount = chapters.filter(function (ch) { return ch.concentration; }).length; // only the stage chapters carry a chokepoint card
      var named = chapters.filter(function (ch) { return (ch.countries || []).some(function (x) { return x.code === cc; }); })
        .sort(function (a, b) { return (b.bandRank || 0) - (a.bandRank || 0) || a.number - b.number; });
      var led = stages.filter(function (ch) { var f = (ch.countries || [])[0]; return f && f.code === cc; });
      var extreme = led.filter(function (ch) { return ch.band === 'Extreme'; }).length;
      // shares: every matrix row that carries the country, largest first; rows under one percent are folded into one line
      var segs = (DATA.matrix || []).filter(function (r) { return r.shares && r.shares[cc] != null; }).map(function (r) {
        var rank = Object.keys(r.shares).sort(function (a, b) { return r.shares[b] - r.shares[a]; }).indexOf(cc) + 1;
        var basis = r.basis === 'relayed' ? 'reported by ' + (r.relayedVia || 'a third party') : r.basis === 'derived' ? 'computed' : (r.basis || '');
        return { seg: r.segment, v: r.shares[cc], rank: rank, basis: basis, year: String(r.asOf || r.year || ''), method: r.method || '', capacity: /^capacity/i.test(r.metric || '') };
      }).sort(function (a, b) { return b.v - a.v; });
      var big = segs.filter(function (s) { return s.rank === 1 || s.v >= 1; }), small = segs.filter(function (s) { return s.rank !== 1 && s.v < 1; });
      // firms by category, the Critical ones named; each name opens that firm's entry
      var firmId = {}; this.items().forEach(function (li) { if (li.getAttribute('data-kind') === 'firm') firmId[li.getAttribute('data-key')] = li.id; });
      var firms = (DATA.suppliers || []).filter(function (r) { return r.country === cc; }), cats = {};
      firms.forEach(function (r) { (cats[r.category || 'Other'] = cats[r.category || 'Other'] || []).push(r); });
      var catNames = Object.keys(cats).sort(function (a, b) { return cats[b].length - cats[a].length || a.localeCompare(b); });
      var critical = firms.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
      var meta = [];
      if (led.length === 1) meta.push('leads 1 stage' + (extreme ? ', of extreme concentration' : ''));
      else if (led.length) meta.push('leads ' + led.length + ' stages' + (extreme ? ', ' + (extreme === led.length ? 'all' : extreme) + ' of them extreme' : ''));
      meta.push('named on ' + named.length + ' of ' + cardCount + ' chokepoint cards');
      if (firms.length) meta.push(firms.length + (firms.length === 1 ? ' firm' : ' firms') + ' in the supplier list' + (critical ? ', ' + critical + ' Critical' : ''));
      var h = '<article class="lk-card lk-card--country">' +
        '<p class="lk-kind">Country · ' + esc(cc) + '</p>' +
        '<h3>' + esc(co.name) + '</h3>' +
        '<p class="lk-meta">' + esc(meta.join(' · ')) + '</p>' +
        (co.role ? '<p class="lk-lede">' + esc(co.role) + '.</p>' : '');
      if (segs.length) {
        h += '<h4 class="lk-h lk-h--in">Share of each segment</h4><ul class="lk-shares">' + big.map(function (s) {
          var m = [s.rank === 1 ? 'largest share' : 'rank ' + s.rank, s.basis, s.year].filter(Boolean).join(' · ');
          return '<li class="lk-share' + (s.rank === 1 ? ' is-lead' : '') + '"' + (s.method ? ' title="' + esc(s.method) + '"' : '') + '><span class="lk-share-bar" style="--w:' + Math.min(100, s.v) + '%"></span><span class="lk-share-k">' + esc(s.seg) + '</span><span class="lk-share-v">' + num(s.v) + '%</span><span class="lk-share-m">' + esc(m) + '</span></li>';
        }).join('') + '</ul>' + (small.length ? '<p class="lk-small">Under 1%: ' + esc(small.map(function (s) { return s.seg; }).join(', ')) + '.</p>' : '');
      }
      if (named.length) {
        h += '<h4 class="lk-h lk-h--in">On the chokepoint cards</h4><ul class="lk-cards">' + named.map(function (ch) {
          var note = ((ch.countries || []).filter(function (x) { return x.code === cc; })[0] || {}).note || '';
          return '<li><a href="' + esc(chHref(ch)) + '"><span class="lk-card-t">' + esc(ch.title) + '</span>' + (ch.band ? '<b class="lk-band lk-band--' + esc(String(ch.band).toLowerCase()) + '">' + esc(ch.band) + '</b>' : '') + (note ? '<span class="lk-card-n">' + esc(note) + '</span>' : '') + '</a></li>';
        }).join('') + '</ul>';
      }
      if (firms.length) {
        h += '<h4 class="lk-h lk-h--in">In the supplier list <span class="lk-n">' + firms.length + ' across ' + catNames.length + (catNames.length === 1 ? ' category' : ' categories') + '</span></h4><ul class="lk-stages">' + catNames.map(function (cat) {
          var rows = cats[cat], crit = rows.filter(function (r) { return r.chokepoint === 'Critical'; });
          return '<li><span class="lk-stage-k">' + esc(cat) + '</span><span class="lk-stage-c">' + rows.length + '</span>' + (crit.length ? '<span class="lk-stage-f">' + crit.map(function (r) { return firmId[r.name] ? '<button type="button" class="lk-go" data-go="' + esc(firmId[r.name]) + '">' + esc(r.name) + '</button>' : esc(r.name); }).join(' ') + '</span>' : '') + '</li>';
        }).join('') + '</ul>';
        // a member of the EU-27: the bloc's firms counted together, as the Suppliers ribbons can draw them (the member list is app.js's)
        var EU27 = (CP.Suppliers && CP.Suppliers.EU27) || [];
        if (EU27.indexOf(cc) >= 0) {
          var eu = (DATA.suppliers || []).filter(function (r) { return EU27.indexOf(r.country) >= 0; }), euCrit = eu.filter(function (r) { return r.chokepoint === 'Critical'; }).length;
          h += '<p class="lk-eu">Across the EU-27, the supplier list has ' + eu.length + ' firms' + (euCrit ? ', ' + euCrit + ' of them Critical' : '') + '. <a href="#/suppliers?tab=country&amp;group=eu">See them together on the Suppliers page →</a></p>';
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

    wire: function (root) {
      var self = this;
      // the supplier list takes the whole filter from the link (a firm's name, or a country), so an older search or stage cannot narrow it (correctness P1-2)
      $$('a[data-sup]', root).forEach(function (a) { a.addEventListener('click', function () { var q = a.getAttribute('data-sup'); setTimeout(function () { var S = CP.Suppliers; if (S && S.show) S.show({ q: q }); }, 60); }); });
      $$('a[data-supcc]', root).forEach(function (a) { a.addEventListener('click', function () { var cc = a.getAttribute('data-supcc'); setTimeout(function () { var S = CP.Suppliers; if (S && S.show) S.show({ country: cc }); }, 60); }); });
      $$('button[data-go]', root).forEach(function (b) { b.addEventListener('click', function () { var inp = $('#gl-search'); if (inp && inp.value) { inp.value = ''; self.filter(''); } self.select(b.getAttribute('data-go'), true, true); }); });
      $$('a[data-chip]', root).forEach(function (a) { a.addEventListener('click', function () { var id = a.getAttribute('data-chip'); setTimeout(function () { if (window.CP.Landscape && CP.Landscape.select) CP.Landscape.select(id); else if (typeof Landscape !== 'undefined') Landscape.select(id); }, 60); }); });
      $$('a[data-para]', root).forEach(function (a) { a.addEventListener('click', function (e) {
        e.preventDefault(); var i = +a.getAttribute('data-para'), p = self.paras[i]; if (!p) return;
        location.hash = '#' + p.chapter;
        // the router lands on the chapter and settles it there; the passage's own settle then takes over, so late fonts and
        // images cannot pull the page back to the chapter's top (correctness P1-1)
        setTimeout(function () {
          CP.scrollToEl(p.el, false); if (CP.Router && CP.Router.settle) CP.Router.settle(p.el);
          p.el.classList.add('lk-flash'); setTimeout(function () { p.el.classList.remove('lk-flash'); }, 2600);
        }, 140);
      }); });
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

    mentions: function (patterns, kind, key) {
      var self = this, re = this.regex(patterns, kind === 'raw'), box = $('#lk-mentions'); if (!box) return;
      if (!re) { box.hidden = true; return; }
      var hits = [], mark = function (s) { return esc(s).replace(re, function (x) { return '<mark>' + x + '</mark>'; }); };
      this.corpus().forEach(function (p, i) { var s = self.sentence(p.text, re); if (s) hits.push({ src: 'Chapter ' + p.num, sub: p.title, html: mark(s), href: '#' + p.chapter, para: i }); });
      (Array.isArray(DATA.timeline) ? DATA.timeline : ((DATA.timeline || {}).events || [])).forEach(function (e) { var t = [e.gist || '', e.title || '', e.summary || ''].join(' '); re.lastIndex = 0; if (!re.test(t)) return; var s = self.sentence(e.gist && (re.lastIndex = 0, re.test(e.gist)) ? e.gist : (e.summary || e.title), re) || e.title; hits.push({ src: 'Export Controls', sub: e.date, html: mark(s), href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }); }); // the entry's own address opens it (correctness P1-6)
      (Array.isArray(DATA.flows) ? DATA.flows : ((DATA.flows || {}).flows || [])).forEach(function (f) { (f.states || []).forEach(function (st) { re.lastIndex = 0; if (st.label && re.test(st.label)) hits.push({ src: 'Export Controls', sub: f.name, html: mark(st.label), href: st.event ? '#/controls/' + encodeURIComponent(st.event) : '#/controls' }); }); }); // a board state links to the entry that set it
      (DATA.landscape || []).forEach(function (c) { if (kind === 'chip' && c.id === key) return; var t = [c.notes || '', c.exportStatus || ''].join(' '); var s = self.sentence(t, re); if (s) hits.push({ src: 'AI Chips', sub: c.vendor + ' ' + c.name, html: mark(s), href: '#/landscape', chip: c.id }); });
      (DATA.suppliers || []).forEach(function (r) { if (kind === 'firm' && r.name === key) return; var t = [r.role || '', r.shareNote || '', r.aiRelevance || ''].join(' '); var s = self.sentence(t, re); if (s) hits.push({ src: 'Suppliers', sub: r.name, html: mark(s), href: '#/suppliers', sup: r.name }); });
      if (!hits.length) { box.hidden = false; box.innerHTML = '<h3 class="lk-h">Where it appears</h3><p class="lk-none">' + (kind === 'firm' ? 'Only in the supplier list.' : kind === 'chip' ? 'Only on the AI Chips page.' : kind === 'term' ? 'Only in this entry.' : 'Nowhere else.') + '</p>'; return; }
      var LIMIT = 12, all = hits.length;
      var row = function (h) { var attrs = h.para != null ? ' data-para="' + h.para + '"' : h.chip ? ' data-chip="' + esc(h.chip) + '"' : h.sup ? ' data-sup="' + esc(h.sup) + '"' : ''; return '<li><a href="' + esc(h.href) + '"' + attrs + '><span class="lk-src"><b>' + esc(h.src) + '</b>' + esc(h.sub) + '</span><span class="lk-txt">' + h.html + '</span></a></li>'; };
      box.hidden = false;
      box.innerHTML = '<h3 class="lk-h">Where it appears <span class="lk-n">' + all + (all === 1 ? ' place' : ' places') + '</span></h3><ul class="lk-men">' + hits.slice(0, LIMIT).map(row).join('') + '</ul>' + (all > LIMIT ? '<p class="lk-more"><button type="button">Show all ' + all + '</button></p>' : '');
      var more = $('.lk-more button', box); if (more) more.addEventListener('click', function () { $('.lk-men', box).innerHTML = hits.map(row).join(''); more.parentNode.removeChild(more); self.wire(box); });
      this.wire(box);
    }
  };

  CP.Lookup = Lookup;
  CP.register('glossary', { activate: function () { Lookup.activate(); }, stage: false });
})();
