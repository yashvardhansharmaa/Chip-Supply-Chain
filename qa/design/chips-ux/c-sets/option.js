/* Option C, "Starting sets". Proof code: it rebuilds the live page in place. The real change is listed in README.md
   (template.html: the sets block and the status line; data/landscape-sets.json or a "sets" key; Landscape.buildUI
   listeners, new loadSet, renderCount rewritten). */
(function () {
  var L = CP.Landscape, $ = CP.$, $$ = CP.$$, esc = CP.esc, Stage = CP.Stage;
  var sec = $('section[data-view="landscape"]'), pk = $('#picker');
  var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };
  var names = function (ids) { var n = ids.map(function (id) { return short(L.byId(id)); }); return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; };

  /* ---- data the option adds: the sets, authored like the glossary (titles are editorial, every figure stays in the table) ---- */
  var SETS = [
    { t: 'Nvidia across four generations', ids: ['nvidia-a100', 'nvidia-h100', 'nvidia-b200', 'nvidia-vr200'] },
    { t: 'Flagships of 2025 from four makers', ids: ['nvidia-b300', 'amd-mi355x', 'google-tpu-v7-ironwood', 'aws-trainium3'] },
    { t: 'The H100 and its China versions', ids: ['nvidia-h100', 'nvidia-h800', 'nvidia-h20'] },
    { t: 'Huawei and Nvidia', ids: ['huawei-ascend-910c', 'huawei-ascend-950pr', 'nvidia-h100', 'nvidia-b200'] },
    { t: 'In-house chips at Google, Amazon, Microsoft and Meta', ids: ['google-tpu-v7-ironwood', 'aws-trainium3', 'microsoft-maia-200', 'meta-mtia-400'] },
    { t: 'A whole-wafer chip beside the B200', ids: ['cerebras-wse3-turbo', 'nvidia-b200'] }
  ];

  /* ---- markup (template.html: after .view-head; the status line and #picker share a wrapper so the line un-sticks where the list ends) ---- */
  var box = document.createElement('section');
  box.className = 'cxc'; box.setAttribute('aria-labelledby', 'cxc-h');
  box.innerHTML = '<h2 class="cxc-h" id="cxc-h">Start with a comparison</h2><ul class="cxc-list">' + SETS.map(function (s, k) {
    return '<li><button type="button" class="cxc-set" data-set="' + k + '" aria-pressed="false" aria-describedby="cxc-d' + k + '">' +
      '<span class="cxc-t">' + esc(s.t) + '</span><span class="cxc-c" id="cxc-d' + k + '">' + s.ids.map(function (id) { return esc(short(L.byId(id))); }).join(' · ') + '</span>' +
      '<span class="cxc-go" aria-hidden="true">Compare &rarr;</span></button></li>';
  }).join('') + '</ul>';
  $('.view-head', sec).insertAdjacentElement('afterend', box);
  var wrap = document.createElement('div'); wrap.className = 'cxc-pick';
  wrap.innerHTML = '<div class="cxc-own"><h2 class="cxc-h2" id="cxc-own-h">Or choose from all 38</h2>' +
    '<p class="cxc-say" id="cxc-say" aria-live="polite"></p>' +
    '<button type="button" class="cxc-see" hidden>See the comparison <span aria-hidden="true">&darr;</span></button>' +
    '<button type="button" class="cxc-clear" hidden>Clear</button></div>';
  pk.insertAdjacentElement('beforebegin', wrap); wrap.appendChild(pk);
  pk.removeAttribute('aria-label'); pk.setAttribute('aria-labelledby', 'cxc-own-h');
  var firstH = $('.cx-h', sec); firstH.id = 'cx-compare-h'; firstH.setAttribute('tabindex', '-1');

  /* ---- behaviour ---- */
  var same = function (a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); };
  L.loadSet = function (k) {
    var s = SETS[k]; this.picked = s.ids.slice(0, this.max); this.sel = this.picked[0]; this.hint = '';
    this.render(); this.showStage(this.byId(this.sel));
    CP.scrollToEl(firstH, true); firstH.focus({ preventScroll: true });
  };
  // Landscape.renderCount, rewritten for the status line
  L.renderCount = function () {
    var n = this.picked.length, el = $('#cxc-say'), self = this;
    el.innerHTML = this.hint ? esc(this.hint)
      : n === 0 ? 'Two to four chips. Tick one to start.'
      : n === 1 ? '<b>' + esc(short(this.byId(this.picked[0]))) + '</b> picked. Pick one more to compare.'
      : n < this.max ? '<b>' + esc(names(this.picked)) + '</b>. ' + (n === 2 ? 'Add up to two more.' : 'Add one more.')
      : '<b>' + esc(names(this.picked)) + '</b>. Four is the most.';
    el.setAttribute('data-warn', this.hint ? '1' : '0');
    $('.cxc-see', wrap).hidden = n < 2;
    $('.cxc-clear', wrap).hidden = !n;
    $$('.cxc-set', box).forEach(function (b) { b.setAttribute('aria-pressed', n && same(self.picked, SETS[+b.getAttribute('data-set')].ids) ? 'true' : 'false'); });
    sec.setAttribute('data-empty', n ? '0' : '1');
  };
  box.addEventListener('click', function (e) { var b = e.target.closest('.cxc-set'); if (b) L.loadSet(+b.getAttribute('data-set')); });
  wrap.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('cxc-see')) { CP.scrollToEl(firstH, true); firstH.focus({ preventScroll: true }); }
    if (b.classList.contains('cxc-clear')) { L.clear(); pk.querySelector('button').focus(); }
  });

  // the stage draws the generic package on open, as Clear does
  if (!L.picked.length) Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>');
  L.render();

  /* ---- states for the shots ---- */
  var tick = function (id) { $('#picker button[data-id="' + id + '"]').click(); };
  window.CXP = { states: {
    empty: function () { window.scrollTo(0, 0); },
    // a reader who skips the sets: the list scrolled to its top, one chip ticked
    one: function () { tick('nvidia-b200'); CP.scrollToEl(wrap); window.scrollBy(0, CP.narrow() ? 0 : 60); },
    three: function () { ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x'].forEach(tick); CP.scrollToEl(wrap); window.scrollBy(0, CP.narrow() ? 700 : 260); },
    // a reader who taps a set: the page glides to the comparison
    set: function () { $('.cxc-set[data-set="0"]').click(); return new Promise(function (r) { setTimeout(r, 1400); }); },
    'set-top': function () { $('.cxc-set[data-set="0"]').click(); return new Promise(function (r) { setTimeout(function () { window.scrollTo(0, 0); r(); }, 1400); }); }
  } };
})();
