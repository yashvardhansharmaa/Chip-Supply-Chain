/* Print runtime. Nothing in this file runs on screen: it defines window.CP_PRINT and stops.
   build/pdf.py calls CP_PRINT.prepare() before it injects Paged.js, and CP_PRINT.finish() once
   the pages are laid out. Every note is written here, at print time, from the data-t / data-p /
   data-d / data-tier fields already carried by each citation, so the built page never changes. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.document) return;

  /* screen furniture, and the machinery that would fight the paginator for the CPU */
  var GONE = ['.masthead', '.rail', '.to-top', '.stage', '.sheet', '#cp-search', '.ex-tip', '.ct-tip',
    '.gl-tip', '.export-bar', '.permalink', '.howto-dl', '.prevnext', '.ch-meta', '.chain--compact',
    '.chain-foot', '.skip', '.stage-actions', '.stage-tag', 'canvas', 'iframe'];

  function each(sel, root, fn) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* the address a reader can type, not the tracking-length one */
  function readable(url) {
    var s = url;
    try {
      var u = new URL(url, location.href);
      s = u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '') + (u.hash || '');
    } catch (e) { /* a relative or malformed href prints as it stands */ }
    return s.length > 92 ? s.slice(0, 90) + '…' : s;
  }

  function part(cls, text) {
    var el = document.createElement('span');
    el.className = cls; el.textContent = text;
    return el;
  }

  /* one footnote, built from the citation beside it */
  function noteFor(a, key) {
    var fn = document.createElement('span');
    fn.className = 'fn';
    fn.setAttribute('data-k', key);
    var meta = [a.getAttribute('data-p') || '', a.getAttribute('data-d') || ''].filter(Boolean).join(' · ');
    fn.appendChild(part('fn-n', a.textContent.trim()));
    fn.appendChild(document.createTextNode(' '));
    var t = a.getAttribute('data-t');
    if (t) { fn.appendChild(part('fn-t', t)); fn.appendChild(document.createTextNode(meta ? '. ' : ' ')); }
    if (meta) { fn.appendChild(part('fn-m', meta)); fn.appendChild(document.createTextNode(' ')); }
    var tier = a.getAttribute('data-tier');
    if (tier) { fn.appendChild(part('fn-tier', tier)); fn.appendChild(document.createTextNode(' ')); }
    var href = a.getAttribute('href');
    if (href) {
      var link = document.createElement('a');
      link.className = 'fn-u'; link.href = href; link.textContent = readable(href);
      fn.appendChild(link);
    }
    return fn;
  }

  /* Called once, on the loaded page, before Paged.js is injected.
     opts.mode      'footnotes' (default) or 'endnotes' for the fallback
     opts.only      keep only the first N chapters (used while iterating on the design) */
  function prepare(opts) {
    opts = opts || {};
    var out = { mode: opts.mode || 'footnotes', cites: 0, notes: 0, chapters: 0, dropped: 0 };

    /* paper is white whatever the reader was using */
    document.documentElement.setAttribute('data-theme', 'light');

    /* explainer animations print as their last frame and the list of steps: drop the videos, load the stills now */
    Array.prototype.forEach.call(document.querySelectorAll('.figure--anim video'), function (v) { v.pause(); v.removeAttribute('src'); v.remove(); });
    Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = 'eager'; });

    /* Kill the specimen's animation loops: they re-arm through requestAnimationFrame, so a
       quarter second of dead frames ends them. Paged.js drives its own render queue through
       requestAnimationFrame, so the stand-in passes calls on once that window has closed —
       whoever holds a reference to it keeps working. */
    var raf = window.requestAnimationFrame;
    var deaf = Date.now() + 250;
    window.requestAnimationFrame = function (cb) { return Date.now() < deaf ? 0 : raf.call(window, cb); };
    window.setTimeout(function () { window.requestAnimationFrame = raf; }, 400);

    /* The scripts have run. Paged.js clones the body into its pages, and a cloned script tag
       runs again as it is inserted: the whole site would boot once a page. */
    each('script', document, function (s) { s.remove(); });

    GONE.forEach(function (sel) { each(sel, document, function (el) { el.remove(); }); });
    each('.view', document, function (v) { if (v.hasAttribute('hidden')) { v.remove(); out.dropped++; } });
    each('details', document, function (d) { d.open = true; });

    var chapters = document.querySelectorAll('article.chapter');
    out.chapters = chapters.length;
    if (opts.only) {
      Array.prototype.slice.call(chapters, opts.only).forEach(function (c) { c.remove(); });
      out.chapters = opts.only;
    }

    if (out.mode === 'endnotes') {
      /* the fallback: each chapter keeps its own numbered list, under the heading Notes */
      each('.chapter-sources > summary', document, function (s) { s.textContent = 'Notes'; });
      out.cites = document.querySelectorAll('sup.cite > a[data-t]').length;
      return out;
    }

    /* the lists at the end of each chapter would now say everything twice; the class is what
       tells print.css the notes have moved to the foot of the page */
    document.documentElement.classList.add('cp-print');
    each('.chapter-sources', document, function (d) { d.remove(); });

    /* the colophon's sentence about hovering and end-of-chapter lists is a screen sentence */
    each('.site-footer .sources-key', document, function (p) {
      p.innerHTML = p.innerHTML.replace(
        /Hover any footnote for the document; each chapter ends with its own source list\./,
        'Every source is a note at the foot of the page it is cited on.');
    });

    each('sup.cite > a', document, function (a) {
      var sup = a.parentNode;
      if (!sup || !sup.parentNode) return;
      out.cites++;
      var chapter = sup.closest ? sup.closest('article.chapter') : null;
      var key = (chapter && chapter.id ? chapter.id : 'x') + '/' + a.textContent.trim();
      sup.parentNode.insertBefore(noteFor(a, key), sup.nextSibling);
      out.notes++;
    });

    /* Paged.js must not start on its own: pdf.py drives it */
    window.PagedConfig = window.PagedConfig || {};
    window.PagedConfig.auto = false;
    return out;
  }

  /* Called once Paged.js has laid the pages out. Paged.js drops a repeated note only when the
     same element overflows; two citations of one source on one page are two elements, so the
     second copy is taken out here, and the note area keeps its place at the foot of the page. */
  function finish() {
    var out = { pages: 0, notes: 0, repeats: 0, stray: 0, overflow: 0 };
    each('.pagedjs_page', document, function (page) {
      out.pages++;
      var seen = {};
      each('.pagedjs_footnote_inner_content .fn', page, function (fn) {
        var k = fn.getAttribute('data-k') || '';
        if (seen[k]) { fn.remove(); out.repeats++; return; }
        seen[k] = 1; out.notes++;
      });
      var inner = page.querySelector('.pagedjs_footnote_inner_content');
      var content = page.querySelector('.pagedjs_footnote_content');
      if (inner && content && inner.scrollHeight - content.clientHeight > 2) out.overflow++;
      /* Paged.js copies the note's classes onto the call it inserts; a .fn left in the text
         that is not a call is a note it could not move, and print.css hides it */
      out.stray += page.querySelectorAll('.pagedjs_page_content .fn:not([data-footnote-call])').length;
    });
    return out;
  }

  window.CP_PRINT = { prepare: prepare, finish: finish };
})();
