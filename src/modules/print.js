/* Print runtime. Nothing in this file runs on screen: it defines window.CP_PRINT and stops.
   build/pdf.py calls CP_PRINT.prepare() before it injects Paged.js, and CP_PRINT.finish() once
   the pages are laid out. Every note is written here, at print time, from the data-t / data-p /
   data-d / data-tier fields already carried by each citation, so the built page never changes.
   prepare({chapter: id}) lays one chapter out alone, under a compact title block (build/chapter_pdfs.py), and
   prepare({edition: '20 October 2026'}) dates the PDF: on its title block, in the foot of every page, in its citation. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.document) return;

  /* screen furniture, and the machinery that would fight the paginator for the CPU */
  var GONE = ['.masthead', '.rail', '.to-top', '.stage', '.sheet', '#cp-search', '.ex-tip', '.ct-tip',
    '.gl-tip', '.export-bar', '.permalink', '.howto-dl', '.prevnext', '.ch-meta', '.chain--compact',
    '.chain-foot', '.skip', '.stage-actions', '.stage-tag', 'canvas', 'iframe'];

  function each(sel, root, fn) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* the full address without its scheme, as a reader would type it: query and fragment kept, never shortened
     (a long one wraps onto the next line of the note, print.css) */
  function readable(url) {
    return String(url || '').replace(/^https?:\/\//i, '');
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
    /* publisher · date (or "Accessed <day>" for a source that shows no date) · "p. N" for a citation into a long PDF:
       the same document at two pages is two numbers, so two notes; one page cited twice is one */
    var pg = a.getAttribute('data-pg') || '';
    var meta = [a.getAttribute('data-p') || '', a.getAttribute('data-d') || '', pg ? 'p. ' + pg : ''].filter(Boolean).join(' · ');
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

  /* ---------- editions and the chapter printed alone ---------- */
  var WORK = 'Chip Supply Chain: How AI Chips Are Made'; // the work the site cites itself as (CITE_WORK in build/build.js)
  var BOOK_PDF = 'chip-supply-chain-the-chain.pdf';

  function node(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  /* The citation for this edition: the cite line's form (citeBlock in build/build.js) with the edition in place of the
     day the page was updated, and no access date, since a PDF does not change after it is made. */
  function citation(title, url, edition, italic) {
    var f = document.createDocumentFragment();
    f.appendChild(document.createTextNode('Sharma, Yashvardhan. ' + (title ? '“' + title + '.” ' : '')));
    f.appendChild(italic ? node('i', '', WORK) : document.createTextNode(WORK));
    f.appendChild(document.createTextNode('. ' + edition + '. ' + url));
    return f;
  }
  function bibtex(key, title, url, edition) {
    var d = /(\d{1,2}) ([A-Z][a-z]+) (\d{4})/.exec(edition) || [];
    var rows = [['title', title || WORK], ['author', 'Sharma, Yashvardhan']];
    if (title) rows.push(['howpublished', WORK]);
    if (d[3]) rows.push(['year', d[3]], ['month', d[2]]);
    rows.push(['note', edition], ['url', url]);
    return '@misc{' + key + ',\n' + rows.map(function (r) { return '  ' + (r[0] + '            ').slice(0, 12) + ' = {' + r[1] + '}'; }).join(',\n') + '\n}';
  }

  /* the colophon's "How to cite" names this edition: the screen's block carries the reader's own access date */
  function citeBox(title, url, edition, key) {
    var box = node('details', 'cite cite--edition');
    box.open = true;
    box.appendChild(node('summary', '', title ? 'How to cite this chapter' : 'How to cite this edition'));
    var plain = node('pre');
    plain.appendChild(citation(title, url, edition, false));
    box.appendChild(plain);
    box.appendChild(node('pre', '', bibtex(key, title, url, edition)));
    return box;
  }

  /* A chapter printed alone opens on a compact title block in place of the book's cover and contents: the site, the
     chapter's number and title, the edition, the chapter's own page and how to cite it. */
  function titleBlock(ch, url, edition) {
    var head = node('header', 'pt-chapter');
    var top = node('p', 'ptc-k');
    top.appendChild(node('span', '', 'Chip Supply Chain'));
    if (edition) top.appendChild(node('span', 'ptc-ed', edition));
    head.appendChild(top);
    var n = parseInt(ch.getAttribute('data-number'), 10), title = ch.getAttribute('data-title') || '';
    head.appendChild(node('p', 'ptc-h', (n ? 'Chapter ' + n + ': ' : '') + title));
    var where = node('p', 'ptc-url'), link = node('a', '', readable(url));
    link.href = url; where.appendChild(link); head.appendChild(where);
    if (edition) {
      var cite = node('p', 'ptc-cite');
      cite.appendChild(node('span', 'ptc-ck', 'Cite as'));
      cite.appendChild(document.createTextNode(' '));
      cite.appendChild(citation(title, url, edition, true));
      head.appendChild(cite);
    }
    return head;
  }

  /* The edition goes in the foot of every page, after the site's address. Paged.js reads this rule with print.css; a
     chapter printed alone also keeps the foot and the folio on its first page, which holds the start of the text. */
  function editionStyle(host, edition, alone) {
    var foot = JSON.stringify(host + ' · ' + edition);
    var css = '@page { @bottom-left { content: ' + foot + '; } }';
    if (alone) css += '\n@page :first { @bottom-left { content: ' + foot + '; } @bottom-right { content: counter(page) " / " counter(pages); } }';
    var s = node('style', '', css);
    s.id = 'cp-print-edition';
    document.head.appendChild(s);
  }

  /* Called once, on the loaded page, before Paged.js is injected.
     opts.mode      'footnotes' (default) or 'endnotes' for the fallback
     opts.only      keep only the first N chapters (used while iterating on the design)
     opts.chapter   keep only this chapter (its id), under a compact title block in place of the cover and contents
     opts.edition   the day the PDF is made, "20 October 2026": printed as "Edition of 20 October 2026" on the title
                    block, in the foot of every page and in the citation
     opts.site      the site's address, "https://chipsupplychain.org/" (default: the page's canonical link) */
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

    var site = String(opts.site || (document.querySelector('link[rel="canonical"]') || {}).href || location.origin + '/');
    if (site.slice(-1) !== '/') site += '/';
    var host = readable(site).replace(/\/$/, '');
    var edition = opts.edition ? 'Edition of ' + opts.edition : '';

    /* one chapter alone: the cover, the how-to box and the contents give way to the chapter's own title block, and the
       chapter starts beneath it on the first page (print.css, .pt-chapter) */
    var alone = null;
    if (opts.chapter) {
      alone = document.getElementById(opts.chapter);
      if (!alone || !alone.matches('article.chapter')) throw new Error('no chapter "' + opts.chapter + '" on this page');
      Array.prototype.forEach.call(chapters, function (c) { if (c !== alone) c.remove(); });
      each('.print-title, .howto, .contents', document, function (el) { el.remove(); });
      alone.parentNode.insertBefore(titleBlock(alone, site + alone.id + '/', edition), alone);
      document.title = (alone.getAttribute('data-title') || alone.id) + ' · Chip Supply Chain'; // the PDF's own title
      out.chapters = 1; out.chapter = alone.id;
    }

    /* the edition: on the cover's last line, in the foot of every page, and in the citation at the end */
    if (edition) {
      out.edition = edition;
      each('.print-title .pt-meta', document, function (p) { p.textContent = edition + ' · ' + host; });
      editionStyle(host, edition, !!alone);
      var cTitle = alone ? alone.getAttribute('data-title') || '' : '';
      var cURL = alone ? site + alone.id + '/' : site + BOOK_PDF;
      var cKey = 'chipsupplychain' + ((/\d{4}/.exec(edition) || [''])[0]) + (alone ? alone.id.replace(/-/g, '') : '');
      each('.site-footer .cite:not(sup)', document, function (c) { c.remove(); });
      each('.site-footer', document, function (f) { f.appendChild(citeBox(cTitle, cURL, edition, cKey)); });
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
