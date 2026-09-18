/* PLATE: plate numbers in Roman numerals. Appended to the copy's <body>. It rewrites text only (the specimen tag,
   the chapter tile, the walk's margin numbers, the chain strip's cells); it does not touch the point-cloud code. */
(function () {
  var R = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  function rom(s) { var n = parseInt(s, 10); return isNaN(n) || !R[n] ? s : R[n]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tag() {
    var t = document.getElementById('stage-tag-text');
    if (!t || /^(Plate|Frontispiece)/.test(t.textContent.trim())) return;
    var b = t.querySelector('b');
    if (!b) return;
    var num = b.textContent.trim();
    var title = t.textContent.split('·').slice(1).join('·').trim();
    t.innerHTML = (num === '00' ? '<b>Frontispiece</b>' : 'Plate <b>' + esc(rom(num)) + '</b>') + (title ? '<span class="pl-t">' + esc(title) + '</span>' : '');
  }
  function statics() {
    document.querySelectorAll('.ch-tile .v, .wk-n, .chapter .chain--compact .stage-cell .n').forEach(function (el) {
      if (el.getAttribute('data-plate') === '1') return;
      el.setAttribute('data-plate', '1'); el.textContent = rom(el.textContent.trim());
    });
    document.querySelectorAll('.wk-where .label:first-child').forEach(function (el) {
      if (el.getAttribute('data-plate') === '1') return;
      el.setAttribute('data-plate', '1'); el.textContent = el.textContent.replace(/(\d{1,2})\s*$/, function (m, d) { return rom(d); });
    });
  }
  function start() {
    statics(); tag();
    var t = document.getElementById('stage-tag-text');
    if (t && window.MutationObserver) {
      new MutationObserver(function () { tag(); }).observe(t, { childList: true, characterData: true, subtree: true });
    }
    window.addEventListener('hashchange', function () { setTimeout(statics, 50); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
