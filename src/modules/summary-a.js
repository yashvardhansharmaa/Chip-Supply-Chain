/* summary-a: the map-first summary at #/summary-a.
 * The page is rendered whole by build/modules/summary-a.js; this file only
 * switches which country panel and which stage detail is on show. Everything
 * is a real button, so keyboard and screen readers get the same page. */
(function () {
  var CP = window.CP;
  if (!CP) return;
  var $ = CP.$, $$ = CP.$$;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverable = !window.matchMedia || matchMedia('(hover: hover)').matches;
  var root = null, map = null, bound = false;

  function selectCountry(cc, fromMap) {
    if (!cc || !$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    if (map) map.setAttribute('data-cc', cc);
    $$('.sa-marker, .sa-chip, .sa-role', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cc') === cc ? 'true' : 'false');
    });
    $$('.sa-town', root).forEach(function (t) {
      t.classList.toggle('is-on', t.getAttribute('data-cc') === cc);
    });
    $$('.sa-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-cc') !== cc; });
    var panel = $('.sa-panel[data-cc="' + cc + '"]', root);
    if (panel) panel.scrollTop = 0;
    // on phones the panel is under the map, so bring it into view after a tap
    if (fromMap && panel && window.innerWidth < 900) {
      var top = panel.getBoundingClientRect().top;
      if (top > window.innerHeight - 120) panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
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

    root.addEventListener('click', function (e) {
      var marker = e.target.closest ? e.target.closest('.sa-marker, .sa-town') : null;
      if (marker) { if (marker.getAttribute('data-dead')) return; selectCountry(marker.getAttribute('data-cc'), true); return; }
      var chip = e.target.closest ? e.target.closest('.sa-chip, .sa-role') : null;
      if (chip) { selectCountry(chip.getAttribute('data-cc'), false); return; }
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


    // the route's stops: a card on hover or focus with the stage, its town, who leads it and the score
    var tip = null;
    var showStop = function (a) {
      if (!tip) { tip = document.createElement('div'); tip.className = 'sa-stop-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.appendChild(tip); }
      var d = a.dataset;
      tip.innerHTML = '<b>' + a.querySelector('span').textContent + ' · ' + d.title + '</b><span>' + d.town + (d.lead ? ' · ' + d.lead : '') + '</span>' + (d.band ? '<span class="sa-stop-tip-s">' + d.band + ' concentration</span>' : '');
      tip.hidden = false;
      var r = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)), top = r.top - h - 10;
      if (top < 8) top = r.bottom + 10;
      tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top + window.scrollY) + 'px';
      $$('.sa-stopcard', root).forEach(function (c) { c.classList.toggle('is-hot', c.getAttribute('href') === a.getAttribute('href')); });
    };
    var hideStop = function () { if (tip) tip.hidden = true; $$('.sa-stopcard.is-hot', root).forEach(function (c) { c.classList.remove('is-hot'); }); };
    root.addEventListener('mouseover', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); });
    root.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest('.sa-stop')) hideStop(); });
    root.addEventListener('focusin', function (e) { var a = e.target.closest ? e.target.closest('.sa-stop') : null; if (a) showStop(a); else hideStop(); });
    window.addEventListener('scroll', function () { hideStop(); }, { passive: true });

    // the panel opens on the country the build marked; make the pins agree
    var open = $('.sa-panel:not([hidden])', root);
    if (open) selectCountry(open.getAttribute('data-cc'), false);
  }

  // #/home?country=JP opens the home page on that country's leverage panel (the Index's country cards link here)
  function fromHash() {
    var m = (location.hash || '').match(/[?&]country=([A-Za-z]{2})\b/);
    if (!m) return;
    bind(); if (!root) return;
    var cc = m[1].toUpperCase();
    if (!$('.sa-panel[data-cc="' + cc + '"]', root)) return;
    selectCountry(cc, false);
    var lev = $('.sa-leverage', root); // the router resets the scroll after activation; the panel comes into view after it
    if (lev) setTimeout(function () { lev.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 80);
  }

  CP.SummaryA = { selectCountry: selectCountry };
  CP.register('summary-a', { stage: false, activate: bind });
  CP.register('home', { stage: false, activate: fromHash });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
