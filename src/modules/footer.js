/* The thin footer's toggle (23 Nov 2026; built into the site from the approved mock, dist/mock/home2/frontispiece/_src/footer/
   on the plates-polish worktree; src/modules/footer.css). src/app.js writes the two citations into each footer's panel (.ft-cite)
   as it boots, names the toggle ("How to cite", or "How to cite this chapter" on a chapter's page) and shows it; a citation
   written the earlier way, as a <details class="cite">, is taken into the panel here. The toggle is a real button with
   aria-expanded and aria-controls; a second click or Escape closes the panel. This also keeps the row as wide as the masthead
   (--ft-sbw, the scrollbar's width); on a wide screen it sets ft-near while the footer would run under the fixed specimen
   stage (the Introduction's walk), which then steps aside; and while the footer is on screen it lifts the fixed "Back to top"
   pill above the row (--ft-lift), so the pill never covers the day and the toggle at the row's right end. */
(function () {
  'use strict';
  var html = document.documentElement, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var sbw = function () { html.style.setProperty('--ft-sbw', Math.max(0, window.innerWidth - html.clientWidth) + 'px'); };
  var n = 0;
  function wire(foot) {
    if (foot._ft) return;
    var det = foot.querySelector('details.cite'), btn = foot.querySelector('.ft-cite-btn'), panel = foot.querySelector('.ft-cite');
    if (!btn || !panel) return;
    if (det) { // (the earlier shape: its two <pre> join the panel, and its name the toggle's)
      var sum = det.querySelector('summary');
      if (sum && sum.textContent.trim()) btn.textContent = sum.textContent.trim();
      $$('pre', det).forEach(function (p) { panel.appendChild(p); });
      det.parentNode.removeChild(det);
    }
    if (!panel.querySelector('pre')) return; // the citation is not written yet: the footer is wired once it is
    foot._ft = true;
    if (!btn.textContent.trim()) btn.textContent = 'How to cite';
    if (!panel.id) panel.id = 'ft-cite-' + (++n);
    btn.setAttribute('aria-controls', panel.id);
    btn.hidden = false;
    var set = function (open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); panel.hidden = !open; foot.classList.toggle('is-cite-open', open); near(); };
    btn.addEventListener('click', function () { set(panel.hidden); });
    foot.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); set(false); btn.focus(); } });
    foot._ftSet = set;
  }
  function scan() { $$('.site-footer.ft-row').forEach(wire); }
  // Escape with the focus elsewhere on the page (the pointer opened it) closes it too, unless a dialog is up
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || document.querySelector('#sheet:not([hidden]), dialog[open], [aria-modal="true"]:not([hidden])')) return;
    $$('.site-footer.is-cite-open').forEach(function (f) { if (f._ftSet) f._ftSet(false); });
  });
  var nearT = 0, lift = 0;
  function near() {
    nearT = 0;
    var feet = $$('.site-footer.ft-row').map(function (f) { return f.getBoundingClientRect(); }).filter(function (r) { return r.height > 0; });
    // the stage beside the walk is fixed at the right: it steps aside while the footer's row would run under its words
    var st = document.querySelector('.stage'), on = false;
    if (st && window.innerWidth > 900 && st.getAttribute('data-hidden') !== '1' && getComputedStyle(st).position === 'fixed') {
      var bottom = 0;
      $$('canvas, .stage-tag, figcaption', st).forEach(function (el) { var r = el.getBoundingClientRect(); if (r.height) bottom = Math.max(bottom, r.bottom); });
      feet.forEach(function (r) { if (r.top < Math.max(bottom, 0) + 16 && r.bottom > 0) on = true; });
    }
    html.classList.toggle('ft-near', on);
    // Back to top, where it rests at the foot of the window, stands 12 px over the footer's rule while the rule is in view
    var top = document.querySelector('.to-top'), want = 0;
    if (top && getComputedStyle(top).position === 'fixed') {
      var tr = top.getBoundingClientRect(), rest = tr.bottom + lift, vh = window.innerHeight;
      if (tr.height && rest > vh / 2) feet.forEach(function (r) { if (r.top < vh && r.bottom > 0) want = Math.max(want, Math.round(rest + 12 - r.top)); });
    }
    if (want !== lift) { lift = Math.max(0, want); if (lift) html.style.setProperty('--ft-lift', lift + 'px'); else html.style.removeProperty('--ft-lift'); }
  }
  // (on the next frame, or within 120 ms where a background tab holds frames back)
  var poke = function () { if (nearT) return; nearT = requestAnimationFrame(near); setTimeout(function () { if (nearT) { cancelAnimationFrame(nearT); near(); } }, 120); };
  window.addEventListener('scroll', poke, { passive: true });
  window.addEventListener('resize', function () { sbw(); poke(); });
  var boot = function () {
    sbw(); scan(); near();
    // the citation comes in as src/app.js boots, and a view may show its footer later: each footer is watched for it
    if (window.MutationObserver) $$('.site-footer.ft-row').forEach(function (f) { new MutationObserver(scan).observe(f, { childList: true, subtree: true }); });
    // the page above can still change height after a jump (plates, images): the footer's place is checked again as it moves
    if (window.IntersectionObserver) { var io = new IntersectionObserver(poke, { threshold: [0, 0.25, 0.5, 0.75, 1] }); $$('.site-footer.ft-row').forEach(function (f) { io.observe(f); }); }
    if (window.ResizeObserver) new ResizeObserver(poke).observe(document.body);
    setTimeout(function () { sbw(); scan(); near(); }, 1500);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
