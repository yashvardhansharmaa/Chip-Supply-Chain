/* Option A, "Slots". Proof code: it rebuilds the live page in place. The real change is listed in README.md
   (template.html markup, Landscape.buildUI / render / new renderSlots, renderPlans and renderTable ghosts). */
(function () {
  var L = CP.Landscape, $ = CP.$, $$ = CP.$$, esc = CP.esc, cname = CP.cname, Stage = CP.Stage;
  var sec = $('section[data-view="landscape"]');
  sec.classList.add('cxa-on');

  /* ---- data the option adds: example pairs for the empty state, and two or three chips worth comparing with each chip.
     In the build these are an authored "compareWith" list per chip in data/landscape.json; the fallback below picks the
     same maker's previous chip and the nearest chip from another maker. ---- */
  var PAIRS = [
    { ids: ['nvidia-b200', 'huawei-ascend-910c'], label: 'B200 and Ascend 910C' },
    { ids: ['nvidia-h100', 'nvidia-h20'], label: 'H100 and H20' },
    { ids: ['nvidia-a100', 'nvidia-vr200'], label: 'A100 and Rubin' },
    { ids: ['google-tpu-v7-ironwood', 'aws-trainium3'], label: 'TPU v7 and Trainium3' },
    { ids: ['nvidia-b200', 'cerebras-wse3-turbo'], label: 'B200 and WSE-3 Turbo' }
  ];
  var WITH = {
    'nvidia-b200': ['nvidia-h100', 'amd-mi355x', 'huawei-ascend-910c'],
    'nvidia-h100': ['nvidia-b200', 'nvidia-h20', 'huawei-ascend-910c'],
    'huawei-ascend-910c': ['nvidia-h100', 'nvidia-h20', 'huawei-ascend-950pr'],
    'google-tpu-v7-ironwood': ['google-tpu-v6e', 'nvidia-b200', 'aws-trainium3']
  };
  var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };
  var yr = function (c) { return parseFloat(String(c.announced || '0').replace('-', '.')) || 0; };
  L.compareWith = function (id) {
    var c = this.byId(id), self = this; if (!c) return [];
    if (WITH[id]) return WITH[id];
    var same = this.chips.filter(function (x) { return x.vendor === c.vendor && x.id !== id && yr(x) < yr(c); }).sort(function (a, b) { return yr(b) - yr(a); });
    var near = this.chips.filter(function (x) { return x.vendor !== c.vendor; }).sort(function (a, b) { return Math.abs(yr(a) - yr(c)) - Math.abs(yr(b) - yr(c)); });
    return [same[0], near[0], near.filter(function (x) { return x.vendorCountry !== c.vendorCountry; })[0]].filter(Boolean).map(function (x) { return x.id; })
      .filter(function (v, i, a) { return a.indexOf(v) === i && self.byId(v); });
  };

  /* ---- markup (template.html: this block replaces #picker and .cx-bar, straight after .view-head) ---- */
  var opts = (function () { // one menu per slot: makers in the checklist's order, each an optgroup naming its country
    var ccs = [], by = {};
    L.chips.forEach(function (c) { var cc = c.vendorCountry || '??'; if (!by[cc]) { by[cc] = { vs: [], v: {} }; ccs.push(cc); } if (!by[cc].v[c.vendor]) { by[cc].v[c.vendor] = []; by[cc].vs.push(c.vendor); } by[cc].v[c.vendor].push(c); });
    ccs.sort(function (a, b) { return (a === 'CN') - (b === 'CN'); });
    var h = '';
    ccs.forEach(function (cc) { by[cc].vs.forEach(function (v) {
      h += '<optgroup label="' + esc(v) + ' · ' + esc(cname(cc)) + '">' + by[cc].v[v].map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('') + '</optgroup>';
    }); });
    return h;
  })();
  var slot = function (i) {
    return '<div class="cxa-slot" data-i="' + i + '">' +
      '<div class="cxa-top"><label class="cxa-k" for="cxa-s' + i + '">Chip ' + (i + 1) + '</label><button type="button" class="cxa-x" hidden>Remove</button></div>' +
      '<select class="cxa-sel" id="cxa-s' + i + '"><option value="">Choose a chip</option>' + opts + '</select>' +
      '<span class="cxa-meta"></span>' +
      '<p class="cxa-try" hidden></p></div>';
  };
  var host = document.createElement('div');
  host.className = 'cxa'; host.id = 'cx-slots';
  host.innerHTML = '<div class="cxa-head"><p class="cxa-ask" id="cxa-ask">Choose two chips to compare. Add up to four.</p>' +
    '<button type="button" class="cxa-clear" hidden>Clear</button></div>' +
    '<div class="cxa-row" role="group" aria-labelledby="cxa-ask">' + [0, 1, 2, 3].map(slot).join('') + '</div>' +
    '<div class="cxa-foot"><p class="cxa-pairs"><span class="cxa-pk">Or start from a pair:</span>' +
    PAIRS.map(function (p, k) { return '<button type="button" data-pair="' + k + '">' + esc(p.label) + '</button>'; }).join('') + '</p></div>' +
    '<details class="cxa-browse"><summary>Browse all ' + L.chips.length + ' chips by maker</summary></details>' +
    '<p class="sr-only" id="cxa-live" aria-live="polite"></p>';
  $('.view-head', sec).insertAdjacentElement('afterend', host);
  // the checklist stays, folded: a tick fills the next free slot, since slots and ticks share Landscape.picked
  var pkr = $('#picker'); $('.cxa-browse', host).appendChild(pkr);

  /* ---- behaviour (Landscape: setSlot, setPair, renderSlots; render calls renderSlots and ghosts) ---- */
  var generic = function () { Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>'); };
  var live = function (msg) { var el = $('#cxa-live'); if (el) { el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 60); } };
  var names = function (ids) { var n = ids.map(function (id) { return short(L.byId(id)); }); return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; };
  L.say2 = function () {
    var n = this.picked.length;
    if (!n) return 'No chips chosen.';
    if (n === 1) return short(this.byId(this.picked[0])) + ' added. Choose a second chip to compare.';
    return 'Comparing ' + names(this.picked) + '.' + (n === 4 ? ' Four is the most.' : '');
  };
  L.setSlot = function (i, id) {
    var p = this.picked.slice();
    if (!id) { if (i < p.length) p.splice(i, 1); }
    else if (i < p.length) p[i] = id;
    else p.push(id);
    this.picked = p; this.sel = id || p[p.length - 1] || null; this.hint = '';
    this.render();
    if (this.sel) this.showStage(this.byId(this.sel)); else generic();
  };
  L.setPair = function (ids) {
    this.picked = ids.slice(0, this.max); this.sel = this.picked[0]; this.hint = '';
    this.render(); this.showStage(this.byId(this.sel));
  };
  L.renderSlots = function () {
    var self = this, n = this.picked.length, shown = n < 2 ? 2 : Math.min(this.max, n + 1);
    host.style.setProperty('--slots', String(shown));
    $$('.cxa-slot', host).forEach(function (el, i) {
      var id = self.picked[i] || '', c = id ? self.byId(id) : null, sel = $('select', el), x = $('.cxa-x', el), meta = $('.cxa-meta', el), tryEl = $('.cxa-try', el);
      el.hidden = i >= shown;
      var state = c ? 'filled' : (n === 1 && i === 1) ? 'next' : (i >= 2 ? 'more' : 'empty');
      el.setAttribute('data-state', state);
      $('.cxa-k', el).textContent = 'Chip ' + (i + 1) + (state === 'next' ? ' · pick one more' : state === 'more' ? ', optional' : '');
      sel.options[0].textContent = c ? 'None' : 'Choose a chip'; // the label above says which slot it is
      if (sel.value !== id) sel.value = id;
      $$('option', sel).forEach(function (o) { if (o.value) o.disabled = o.value !== id && self.picked.indexOf(o.value) >= 0; });
      x.hidden = !c; if (c) x.setAttribute('aria-label', 'Remove ' + c.name);
      meta.textContent = c ? c.vendor + ' · ' + cname(c.vendorCountry) : '';
      var sug = state === 'next' ? self.compareWith(self.picked[0]).filter(function (s) { return self.picked.indexOf(s) < 0; }).slice(0, 3) : [];
      tryEl.hidden = !sug.length;
      tryEl.innerHTML = sug.length ? '<span class="cxa-pk">Try with</span>' + sug.map(function (s) { return '<button type="button" data-try="' + esc(s) + '">' + esc(short(self.byId(s))) + '</button>'; }).join('') : '';
    });
    $('.cxa-ask', host).removeAttribute('data-warn');
    sec.setAttribute('data-full', n >= this.max ? '1' : '0');
    $$('#picker button').forEach(function (b) { if (n >= self.max && b.getAttribute('aria-pressed') !== 'true') b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
    $('.cxa-clear', host).hidden = !n;
    $('.cxa-foot', host).hidden = n > 0; // the example pairs are for the empty page; after a pick the next slot offers its own
    $('.cxa-ask', host).textContent = n === 2 ? 'Add up to two more, or read the comparison below.' : n === 3 ? 'Add a fourth, or read the comparison below.' : n === 4 ? 'Four chips, the most the table holds.' : 'Choose two chips to compare. Add up to four.';
  };
  // until two chips are in, the plans and the table keep an empty column for each missing chip, so the reader sees where it goes
  L.ghosts = function () {
    var n = this.picked.length, g = Math.max(0, 2 - n); if (!g) return;
    var plans = $('#cx-plans'), tb = $('#cx-table');
    for (var k = 0; k < g; k++) {
      var i = n + k + 1;
      plans.insertAdjacentHTML('beforeend', '<div class="cx-plan cx-plan--ghost" aria-hidden="true"><span class="cx-plan-name"><b>Chip ' + i + '</b><em>' + (i === n + 1 && n ? 'pick one more' : 'not chosen') + '</em></span><span class="cx-plan-art"><i></i></span><span class="cx-plan-size">&nbsp;</span></div>');
      $$('tr', tb).forEach(function (tr, r) {
        tr.insertAdjacentHTML('beforeend', r === 0 ? '<th scope="col" class="cx-col cx-col--ghost"><span class="cx-ghost-h">Chip ' + i + '</span><span class="cx-ghost-s">' + (n ? 'Choose it above' : 'Not chosen') + '</span></th>' : '<td class="cx-ghost">–</td>');
      });
    }
    tb.setAttribute('data-n', String(n + g));
  };
  L.say = function (msg) { live(msg); var a = $('.cxa-ask', host); a.textContent = msg; a.setAttribute('data-warn', '1'); };
  var baseRender = L.render;
  var said = '';
  L.render = function () { // one announcement per change of the picks, whichever control made it (slot, Try, pair, checklist, search)
    baseRender.call(this); this.renderSlots(); this.ghosts();
    var key = this.picked.join(','); if (key !== said) { if (said || key) live(this.say2()); said = key; }
  };

  host.addEventListener('change', function (e) { var s = e.target.closest('select'); if (s) L.setSlot(+s.closest('.cxa-slot').getAttribute('data-i'), s.value); });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('cxa-x')) { var i = +b.closest('.cxa-slot').getAttribute('data-i'); L.setSlot(i, ''); var s0 = $('#cxa-s' + Math.max(0, Math.min(i, L.picked.length))); if (s0) s0.focus(); return; }
    if (b.hasAttribute('data-try')) { L.setSlot(L.picked.length, b.getAttribute('data-try')); return; }
    if (b.hasAttribute('data-pair')) { L.setPair(PAIRS[+b.getAttribute('data-pair')].ids); return; }
    if (b.classList.contains('cxa-clear')) { L.clear(); $('#cxa-s0').focus(); }
  });

  // the stage draws the generic package on open, as Clear does (today it opens blank, or keeps the last page's specimen)
  if (!L.picked.length) generic();
  L.render();

  /* ---- states for the shots: picks go through the slots, the way a reader makes them ---- */
  var pick = function (i, id) { var s = $('#cxa-s' + i); s.value = id; s.dispatchEvent(new Event('change', { bubbles: true })); };
  var top = function () { window.scrollTo(0, 0); };
  var atSlots = function () { if (CP.narrow()) CP.scrollToEl($('#cx-slots')); else top(); }; // on a phone the reader is at the slots when picking
  window.CXP = { states: {
    empty: function () { top(); },
    'empty-slots': function () { atSlots(); },
    one: function () { pick(0, 'nvidia-b200'); atSlots(); },
    two: function () { pick(0, 'nvidia-b200'); pick(1, 'huawei-ascend-910c'); atSlots(); },
    three: function () { pick(0, 'nvidia-b200'); pick(1, 'huawei-ascend-910c'); pick(2, 'amd-mi355x'); atSlots(); },
    'three-table': function () { pick(0, 'nvidia-b200'); pick(1, 'huawei-ascend-910c'); pick(2, 'amd-mi355x'); CP.scrollToEl($('#cx-plans').previousElementSibling.previousElementSibling.previousElementSibling); },
    four: function () { top(); ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x', 'google-tpu-v7-ironwood'].forEach(function (id, i) { pick(i, id); }); top(); },
    'one-scrolled': function () { top(); pick(0, 'nvidia-b200'); window.scrollTo(0, 300); },
    browse: function () { pick(0, 'nvidia-b200'); $('.cxa-browse', host).open = true; $('#picker button[data-id="huawei-ascend-910c"]').click(); CP.scrollToEl($('#cx-slots')); },
    'one-dark': function () { document.documentElement.setAttribute('data-theme', 'dark'); pick(0, 'nvidia-b200'); atSlots(); }
  } };
})();
