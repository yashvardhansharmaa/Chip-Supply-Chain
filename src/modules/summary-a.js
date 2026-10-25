/* summary-a: the atlas on the Suppliers page (and the map-first summary at #/summary-a).
 * The plate is rendered whole by build/modules/summary-a.js; this file only
 * switches which country is chosen: its buttons, its stops and strip cards,
 * and its panel beside the map (which carries the country's role line). Everything is a real button, so keyboard and screen
 * readers get the same page. */
(function () {
  var CP = window.CP;
  if (!CP) return;
  var $ = CP.$, $$ = CP.$$;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverable = !window.matchMedia || matchMedia('(hover: hover)').matches;
  var root = null, map = null, bound = false;

  // a panel taller than the plate scrolls inside it; the fade at its foot stays until the reader reaches the end
  function more(panel) {
    if (!panel || !panel.parentNode) return;
    panel.parentNode.setAttribute('data-more', panel.scrollHeight - panel.clientHeight - panel.scrollTop > 6 ? '1' : '0');
  }

  // no country chosen: every chip, marker and stop is off, and the neutral panel says how to pick one
  function clearCountry() {
    if (map) map.removeAttribute('data-cc');
    var at = $('.atlas', root); if (at) at.removeAttribute('data-cc'); // the strip under the map reads the choice from the plate
    $$('.sa-marker, .sa-chip, .sa-role', root).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    $$('.sa-town, .sa-stop, .sa-stopcard', root).forEach(function (el) { el.classList.remove('is-on'); });
    $$('.sa-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-cc') !== 'none'; });
    more($('.sa-panel[data-cc="none"]', root));
    if (CP.Suppliers && CP.Suppliers.light) CP.Suppliers.light('');
  }
  // a chip or marker that was already chosen when it was pressed clears the choice; any other selects its country
  var wasOn = null;
  function toggleCountry(b, fromMap) {
    var on = wasOn === null ? b.getAttribute('aria-pressed') === 'true' : wasOn;
    wasOn = null;
    if (on) clearCountry(); else selectCountry(b.getAttribute('data-cc'), fromMap);
  }

  function selectCountry(cc, fromMap) {
    if (!cc || !$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    if (map) map.setAttribute('data-cc', cc);
    var at = $('.atlas', root); if (at) at.setAttribute('data-cc', cc);
    $$('.sa-marker, .sa-chip, .sa-role', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cc') === cc ? 'true' : 'false');
    });
    $$('.sa-town', root).forEach(function (t) {
      t.classList.toggle('is-on', t.getAttribute('data-cc') === cc);
    });
    // the route answers: the chosen country's stops stay dark and carry their towns, the others turn gray, and so do the strip's cards
    $$('.sa-stop, .sa-stopcard', root).forEach(function (el) {
      el.classList.toggle('is-on', el.getAttribute('data-cc') === cc);
    });
    $$('.sa-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-cc') !== cc; });
    var panel = $('.sa-panel[data-cc="' + cc + '"]', root);
    if (panel) { panel.scrollTop = 0; more(panel); }
    // the ribbons under the map follow the same country
    if (CP.Suppliers && CP.Suppliers.light) CP.Suppliers.light(cc);
    if (window.innerWidth < 900) {
      var chip = $('.sa-role[data-cc="' + cc + '"]', root); // the chip row scrolls sideways on a phone: keep the chosen chip in view
      if (chip && chip.scrollIntoView) chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      // on phones the panel is under the map, so bring it into view after a tap
      if (fromMap && panel) {
        var top = panel.getBoundingClientRect().top;
        if (top > window.innerHeight - 120) panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
  }

  function selectStage(id) {
    if (!id || !$('.sa-stage-detail[data-id="' + id + '"]', root)) return;
    $$('.sa-tile', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false');
    });
    $$('.sa-stage-detail', root).forEach(function (d) { d.hidden = d.getAttribute('data-id') !== id; });
  }

  function bind() {
    if (bound) return;
    root = $('.view:not([hidden]) .sa') || $('.sa');
    if (!root) return;
    map = $('.sa-map', root);
    bound = true;

    // read a chip's or marker's state as the press begins, before the focus handler below can select it
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest ? e.target.closest('.sa-marker, .sa-chip, .sa-role') : null;
      wasOn = b ? b.getAttribute('aria-pressed') === 'true' : null;
    });
    root.addEventListener('click', function (e) {
      var marker = e.target.closest ? e.target.closest('.sa-marker, .sa-town') : null;
      if (marker) {
        if (marker.getAttribute('data-dead')) return;
        if (marker.classList.contains('sa-marker')) toggleCountry(marker, true); else selectCountry(marker.getAttribute('data-cc'), true);
        return;
      }
      var chip = e.target.closest ? e.target.closest('.sa-chip, .sa-role') : null;
      if (chip) { toggleCountry(chip, false); return; }
      // a stop on the map or in the strip opens its country's panel here; the panel's rows lead to the chapters
      var stop = e.target.closest ? e.target.closest('.sa-stop, .sa-stopcard') : null;
      if (stop && stop.getAttribute('data-cc')) { e.preventDefault(); selectCountry(stop.getAttribute('data-cc'), true); return; }
      var tile = e.target.closest ? e.target.closest('.sa-tile') : null;
      if (tile) selectStage(tile.getAttribute('data-id'));
    });

    // stage tiles read on hover and on keyboard focus as well as on tap
    $$('.sa-tile', root).forEach(function (b) {
      b.addEventListener('focus', function () { selectStage(b.getAttribute('data-id')); });
      if (hoverable) b.addEventListener('mouseenter', function () { selectStage(b.getAttribute('data-id')); });
    });
    if (hoverable) {
      $$('.sa-marker', root).forEach(function (b) {
        b.addEventListener('focus', function () { selectCountry(b.getAttribute('data-cc'), false); });
      });
    }

    // the panel's inner scroll: the fade at its foot goes once the end is in view
    root.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('sa-panel')) more(e.target); }, true);
    window.addEventListener('resize', function () { more($('.sa-panel:not([hidden])', root)); });

    // the route's stops: a card on hover or focus with the stage, its town, who leads it and its concentration band
    // it stays while the pointer crosses onto it, and Escape closes it (WCAG 1.4.13; accessibility #10)
    var tip = null, tipT = null;
    var showStop = function (a) {
      clearTimeout(tipT);
      if (!tip) {
        tip = document.createElement('div'); tip.className = 'sa-stop-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.appendChild(tip);
        tip.addEventListener('mouseenter', function () { clearTimeout(tipT); });
        tip.addEventListener('mouseleave', function () { hideStop(); });
      }
      var d = a.dataset;
      tip.innerHTML = '<b>' + a.querySelector('span').textContent + ' · ' + d.title + '</b><span>' + d.town + (d.lead ? ' · ' + d.lead : '') + '</span>' + (d.band ? '<span class="sa-stop-tip-s">' + d.band + ' concentration</span>' : '');
      tip.hidden = false;
      var r = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)), top = r.top - h - 10;
      if (top < 8) top = r.bottom + 10;
      tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top + window.scrollY) + 'px';
      $$('.sa-stopcard', root).forEach(function (c) { c.classList.toggle('is-hot', c.getAttribute('href') === a.getAttribute('href')); });
    };
    var hideStop = function () { clearTimeout(tipT); if (tip) tip.hidden = true; $$('.sa-stopcard.is-hot', root).forEach(function (c) { c.classList.remove('is-hot'); }); };
    root.addEventListener('mouseover', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); });
    root.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('.sa-stop')) { clearTimeout(tipT); tipT = setTimeout(hideStop, 260); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tip && !tip.hidden) hideStop(); });
    root.addEventListener('focusin', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); else hideStop(); });
    window.addEventListener('scroll', function () { hideStop(); }, { passive: true });

    // the panel opens on the country the build marked, if any; make the chips, the stops, the strip and the ribbons agree
    var open = $('.sa-panel:not([hidden])', root), cc0 = open && open.getAttribute('data-cc');
    if (cc0 && cc0 !== 'none') selectCountry(cc0, false); else clearCountry();
  }

  // #/suppliers?country=JP opens the Suppliers page with that country chosen on the plate (the Index's country cards link here)
  function fromHash() {
    var m = (location.hash || '').match(/[?&]country=([A-Za-z]{2})\b/);
    if (!m) return;
    bind(); if (!root) return;
    var cc = m[1].toUpperCase();
    if (!$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    selectCountry(cc, false);
    // the router resets the scroll after activation; after that, bring the plate in if it is off screen, or the panel on a phone, where it sits under the map
    setTimeout(function () {
      var narrow = window.innerWidth < 900, target = narrow ? $('.sa-panel[data-cc="' + cc + '"]', root) : $('.atlas', root);
      if (!target) return;
      var top = target.getBoundingClientRect().top;
      if (narrow || top < 0 || top > window.innerHeight * 0.6) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }, 80);
  }

  CP.SummaryA = { selectCountry: selectCountry, clearCountry: clearCountry, fromHash: fromHash };
  CP.register('summary-a', { stage: false, activate: bind });
  CP.register('suppliers', { stage: false, activate: function () { bind(); fromHash(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
