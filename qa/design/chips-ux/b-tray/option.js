/* Option B, "Steps and tray". Proof code: it rebuilds the live page in place. The real change is listed in README.md
   (template.html: two step heads and the tray markup; Landscape.buildUI listeners, renderCount rewritten, render marks
   the picker at four). */
(function () {
  var L = CP.Landscape, $ = CP.$, $$ = CP.$$, esc = CP.esc, Stage = CP.Stage;
  var sec = $('section[data-view="landscape"]'), pk = $('#picker'), bar = $('.cx-bar', sec);
  var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };

  /* ---- markup (template.html) ---- */
  pk.insertAdjacentHTML('beforebegin',
    '<div class="cxb-step" id="cxb-step1"><span class="cxb-n" aria-hidden="true">1</span>' +
    '<h2 class="cxb-t" id="cxb-t1" tabindex="-1">Pick two to four chips</h2>' +
    '<p class="cxb-s">Each chip ticked adds a column to the comparison under the list.</p></div>');
  pk.removeAttribute('aria-label'); pk.setAttribute('aria-labelledby', 'cxb-t1');
  // the count bar becomes the tray: same place in the page, now sticky, with slots and a Compare button
  bar.classList.add('cxb-tray');
  bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Chips picked');
  bar.innerHTML = '<p class="cxb-say count" id="cx-count" aria-live="polite"></p>' +
    '<button type="button" class="btn ghost cx-clear" id="cx-clear">Clear</button>' +
    '<button type="button" class="btn cxb-go" aria-disabled="true" aria-describedby="cx-count">Compare</button>' +
    '<ol class="cxb-slots" aria-label="Chips picked, in table order"></ol>';
  $('.cx-h', sec).insertAdjacentHTML('beforebegin',
    '<div class="cxb-step" id="cxb-step2"><span class="cxb-n" aria-hidden="true">2</span>' +
    '<h2 class="cxb-t" id="cxb-t2" tabindex="-1">Compare them</h2>' +
    '<button type="button" class="cxb-back">Change the chips</button>' +
    '<p class="cxb-s" id="cxb-s2"></p></div>');

  /* ---- behaviour ---- */
  var s1 = $('#cxb-step1'), s2 = $('#cxb-step2');
  // Landscape.renderCount, rewritten: the tray says where the reader is in words, and draws the four slots
  L.renderCount = function () {
    var self = this, n = this.picked.length, el = $('#cx-count');
    var first = n ? short(this.byId(this.picked[0])) : '';
    el.innerHTML = this.hint ? esc(this.hint)
      : n === 0 ? 'None picked yet. Pick at least two.'
      : n === 1 ? '<b>' + esc(first) + '</b> picked. Pick one more to compare.'
      : n < this.max ? '<b>' + n + ' picked.</b> Add ' + (n === 2 ? 'up to two more' : 'one more') + ', or compare.'
      : '<b>4 picked</b>, the most. Remove one to add another.';
    el.setAttribute('data-warn', this.hint ? '1' : '0');
    var h = '';
    for (var i = 0; i < this.max; i++) {
      var id = this.picked[i], c = id && this.byId(id);
      h += c ? '<li class="cxb-tok"><b title="' + esc(c.name) + '">' + esc(short(c)) + '</b><button type="button" data-rm="' + esc(id) + '" aria-label="Remove ' + esc(c.name) + '">×</button></li>'
        : '<li class="cxb-tok is-empty' + (i === n && n < 2 ? ' is-next' : '') + '">Chip ' + (i + 1) + (i >= 2 ? ', optional' : '') + '</li>';
    }
    $('.cxb-slots', bar).innerHTML = h;
    var go = $('.cxb-go', bar);
    go.setAttribute('aria-disabled', n >= 2 ? 'false' : 'true');
    go.innerHTML = n >= 2 ? 'Compare ' + n + ' chips <span aria-hidden="true">&darr;</span>' : 'Compare';
    $('#cx-clear').hidden = !n;
    s1.setAttribute('data-now', n < 2 ? '1' : '0');
    s2.setAttribute('data-now', n >= 2 ? '1' : '0');
    s2.setAttribute('data-wait', n < 2 ? '1' : '0');
    $('#cxb-s2').textContent = n === 0 ? 'The comparison appears here once two chips are picked.' : n === 1 ? 'One chip so far. Its specs are below. Pick one more to compare.' : '';
    $('#cxb-s2').hidden = n >= 2;
    sec.setAttribute('data-empty', n ? '0' : '1');
    sec.setAttribute('data-full', n >= this.max ? '1' : '0');
    // at four, the chips not picked say so to a screen reader too; they stay in the tab order
    $$('#picker button').forEach(function (b) { if (n >= self.max && b.getAttribute('aria-pressed') !== 'true') b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
  };
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-rm')) { L.toggle(b.getAttribute('data-rm')); var next = $('.cxb-slots button', bar) || $('.cxb-go', bar); if (next) next.focus(); return; }
    if (b.classList.contains('cx-clear')) { L.clear(); $('#cxb-t1').focus(); return; }
    if (b.classList.contains('cxb-go')) {
      if (b.getAttribute('aria-disabled') === 'true') { L.say(L.picked.length ? 'Pick one more chip first.' : 'Pick two chips first.'); return; }
      CP.scrollToEl(s2, true); $('#cxb-t2').focus({ preventScroll: true });
    }
  });
  $('.cxb-back', s2).addEventListener('click', function () { CP.scrollToEl(s1, true); $('#cxb-t1').focus({ preventScroll: true }); });

  // the stage draws the generic package on open, as Clear does
  if (!L.picked.length) Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>');
  L.render();

  /* ---- states for the shots: ticks go through the checklist, the way a reader makes them ---- */
  var tick = function (id) { $('#picker button[data-id="' + id + '"]').click(); };
  var atList = function () { if (CP.narrow()) CP.scrollToEl(s1); else window.scrollTo(0, 0); };
  window.CXP = { states: {
    empty: function () { window.scrollTo(0, 0); },
    'empty-list': function () { atList(); },
    one: function () { tick('nvidia-b200'); atList(); },
    three: function () { ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x'].forEach(tick); atList(); },
    'three-mid': function () { ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x'].forEach(tick); CP.scrollToEl($('.group[data-cc="CN"]')); },
    four: function () { ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x', 'google-tpu-v7-ironwood', 'aws-trainium3'].forEach(tick); window.scrollTo(0, CP.narrow() ? 900 : 0); },
    compare: function () { ['nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x'].forEach(tick); $('.cxb-go').click(); return new Promise(function (r) { setTimeout(r, 1200); }); }
  } };
})();
