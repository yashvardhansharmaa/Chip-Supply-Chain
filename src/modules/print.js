/* Print runtime. Nothing in this file runs on screen: it defines window.CP_PRINT and stops.
   build/pdf.py calls CP_PRINT.prepare() before it injects Paged.js, and CP_PRINT.finish() once
   the pages are laid out. Every note is written here, at print time, from the data-t / data-p /
   data-d / data-tier fields already carried by each citation, so the built page never changes.
   prepare({chapter: id}) lays one chapter out alone, under a compact title block (build/chapter_pdfs.py), and
   prepare({edition: '20 October 2026'}) dates the PDF: on its title block, in the foot of every page, in its citation.
   prepare({moves, tight, split}) carries what pdf.py learned from finish() about an earlier layout of the same page
   (figures to move down the text, cards to set closer); noteFlow fits the notes to each page as Paged.js lays it out. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.document) return;

  /* screen furniture, and the machinery that would fight the paginator for the CPU */
  var GONE = ['.masthead', '.rail', '.to-top', '.stage', '.sheet', '#cp-search', '.ex-tip', '.ct-tip',
    '.gl-tip', '.export-bar', '.permalink', '.howto-dl', '.prevnext', '.ch-meta', '.chain--compact',
    '.chain-foot', '.skip', '.stage-actions', '.stage-tag', 'canvas', 'iframe'];

  function each(sel, root, fn) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* Paper gets static fonts. Chrome cannot put a variable font into a PDF as a font: it draws each instance as Type 3
     shapes, which copy and search as broken words ("ED / A"). So for print the page's variable families give way to
     fixed instances of the same families, all under the SIL Open Font License, served by Google Fonts as the site's own
     fonts are: Fraunces at one optical size per weight (the screen's settings: 48 for heads, 72 for the card's figures,
     144 for the chapter numerals), Source Serif 4 at its text size, Instrument Sans, IBM Plex Mono, and Noto Serif and
     Sans for the Chinese and Japanese titles of some sources (the system's own CJK fonts print as Type 3 too). Chrome
     embeds each as TrueType, subset to the letters used. */
  /* one request per instance: asked for a single point, Google Fonts serves a fixed instance; asked for several weights
     at once, it serves one variable file that covers them, and that prints as Type 3 again */
  var PRINT_FONTS = ['Fraunces:opsz,wght@14,600', 'Fraunces:opsz,wght@48,500', 'Fraunces:opsz,wght@72,400',
    'Fraunces:opsz,wght@96,700', 'Fraunces:opsz,wght@144,300',
    'Source+Serif+4:ital,opsz,wght@0,12,400', 'Source+Serif+4:ital,opsz,wght@0,12,500', 'Source+Serif+4:ital,opsz,wght@0,12,600',
    'Source+Serif+4:ital,opsz,wght@0,12,700', 'Source+Serif+4:ital,opsz,wght@1,12,400', 'Source+Serif+4:ital,opsz,wght@1,12,600',
    'Instrument+Sans:wght@400', 'Instrument+Sans:wght@500', 'Instrument+Sans:wght@600', 'Instrument+Sans:wght@700',
    'IBM+Plex+Mono:wght@400;500', 'Noto+Serif+SC:wght@400', 'Noto+Serif+SC:wght@600', 'Noto+Serif+JP:wght@400',
    'Noto+Serif+JP:wght@600', 'Noto+Sans+SC:wght@400', 'Noto+Sans+JP:wght@400'];
  var fontsLoaded = null;
  function printFonts() {
    each('link[rel="stylesheet"][href*="fonts.googleapis.com"]', document, function (l) { l.remove(); });
    fontsLoaded = Promise.all(PRINT_FONTS.map(function (family) {
      var link = node('link');
      link.rel = 'stylesheet'; link.href = 'https://fonts.googleapis.com/css2?family=' + family + '&display=block';
      link.setAttribute('data-pagedjs-ignore', ''); // Paged.js leaves it in place, so the faces stay loaded through the layout
      var loaded = new Promise(function (done) { link.onload = done; link.onerror = done; });
      document.head.appendChild(link);
      return loaded;
    }));
  }
  /* pdf.py waits on this after prepare(): the stylesheet, then each face the print uses, then any other pending load */
  function fontsReady() {
    var faces = ['300 24pt Fraunces', '400 13pt Fraunces', '500 14pt Fraunces', '600 11pt Fraunces', '700 68pt Fraunces',
      '400 10pt "Source Serif 4"', '500 10pt "Source Serif 4"', '600 10pt "Source Serif 4"', '700 10pt "Source Serif 4"',
      'italic 400 10pt "Source Serif 4"', '400 7pt "Instrument Sans"', '500 7pt "Instrument Sans"', '600 7pt "Instrument Sans"',
      '700 7pt "Instrument Sans"', '400 7pt "IBM Plex Mono"', '500 7pt "IBM Plex Mono"'];
    return Promise.resolve(fontsLoaded).then(function () {
      return Promise.all(faces.map(function (f) { return document.fonts.load(f).catch(function () { return []; }); }));
    }).then(function () { return document.fonts.ready; }).then(function () {
      var got = []; document.fonts.forEach(function (f) { if (f.status === 'loaded') got.push(f.family + ' ' + f.weight + (f.style !== 'normal' ? ' ' + f.style : '')); });
      return got.filter(function (v, i) { return got.indexOf(v) === i; }).length;
    });
  }

  /* the full address without its scheme, as a reader would type it: query and fragment kept, never shortened
     (a long one wraps onto the next line of the note, print.css) */
  function readable(url) {
    return String(url || '').replace(/^https?:\/\//i, '');
  }

  /* a footnote's address, short: the site it is on ("asml.com"; an archived page names the archive). With the title,
     publisher, date and page that finds the document; the note links the full address, and the chapter's source list
     prints it. A path in the note ran most notes to a second line. */
  function shortUrl(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return readable(url).split('/')[0]; }
  }
  /* the notes are a reader's short form: a long title is cut at a word near 80 characters and a publisher's long
     parenthesis is dropped; the source list at the end of the chapter carries each in full */
  function clip(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    if (s.length <= n) return s;
    var cut = s.slice(0, n), sp = cut.lastIndexOf(' ');
    return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.(–-]+$/, '') + '…';
  }
  function shortPublisher(p) {
    p = String(p || '').replace(/\s+/g, ' ').trim();
    return p.length > 48 && / \(/.test(p) ? p.slice(0, p.indexOf(' (')) : clip(p, 60);
  }

  function part(cls, text) {
    var el = document.createElement('span');
    el.className = cls; el.textContent = text;
    return el;
  }

  /* one footnote, built from the citation beside it: "12 Title. Publisher, date, p. 4. site.org". The date is the
     source's own, or "accessed <day>" for a source that shows none; "p. N" is a citation into a long PDF (the same document
     at two pages is two numbers, so two notes; one page cited twice is one). */
  function noteFor(a, key) {
    var fn = document.createElement('span');
    fn.className = 'fn';
    fn.setAttribute('data-k', key);
    var pg = a.getAttribute('data-pg') || '';
    var when = (a.getAttribute('data-d') || '').replace(/^Accessed /, 'accessed ');
    var meta = [shortPublisher(a.getAttribute('data-p')), when, pg ? 'p. ' + pg : ''].filter(Boolean).join(', ');
    fn.appendChild(part('fn-n', a.textContent.trim()));
    var t = clip(a.getAttribute('data-t'), 80);
    if (t) fn.appendChild(part('fn-t', t + (/[.?!…]$/.test(t) ? ' ' : '. ')));
    if (meta) fn.appendChild(part('fn-m', meta.charAt(0).toUpperCase() + meta.slice(1) + '. '));
    var href = a.getAttribute('href');
    if (href) {
      var link = document.createElement('a');
      link.className = 'fn-u'; link.href = href; link.textContent = shortUrl(href);
      fn.appendChild(link);
    }
    return fn;
  }

  /* The chapter's source list, for paper: every source in the order of its number, with its title, publisher and date and
     its full address (the notes carry a short one). Built from the list the chapter ends with on screen. */
  function sourceList(d) {
    var list = d.querySelector('ol');
    if (!list) return null;
    var box = node('section', 'cp-sources');
    var head = d.querySelector('summary');
    box.appendChild(node('h3', 'cp-sources-h', head ? head.textContent.trim() : 'Sources'));
    var ol = node('ol');
    each('li', list, function (li) {
      var item = li.cloneNode(true), a = item.querySelector('a[href]');
      if (a) item.appendChild(node('span', 'src-url', readable(a.getAttribute('href'))));
      ol.appendChild(item);
    });
    box.appendChild(ol);
    return box;
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
    f.appendChild(document.createTextNode('. ' + edition + '. '));
    if (italic) { var a = node('a', '', url); a.href = url; f.appendChild(a); } // set as type, the address is a link
    else f.appendChild(document.createTextNode(url));
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

  /* A chapter printed alone opens on a compact title block in place of the book's cover and contents: the site and the
     chapter's number, the edition and the chapter's own address. The chapter's title follows at once, set large, so the
     block does not repeat it. */
  function titleBlock(ch, url, edition) {
    var head = node('header', 'pt-chapter');
    var top = node('p', 'ptc-k');
    var n = parseInt(ch.getAttribute('data-number'), 10), title = ch.getAttribute('data-title') || '';
    top.appendChild(node('span', '', 'Chip Supply Chain' + (n ? ' · Chapter ' + n : '')));
    if (edition) top.appendChild(node('span', 'ptc-ed', edition));
    head.appendChild(top);
    /* the chapter opens on its title: the citation sits once, at the end, in "How to cite this chapter" */
    var where = node('p', 'ptc-url'), link = node('a', '', readable(url));
    link.href = url; where.appendChild(link); head.appendChild(where);
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

    /* paper is white whatever the reader was using, and set in static fonts (printFonts, above) */
    document.documentElement.setAttribute('data-theme', 'light');
    printFonts();

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

    /* figures moved down the text after an earlier layout (pdf.py, from floats() below): each goes after the next n
       blocks, so the text fills the page the figure could not */
    Object.keys(opts.moves || {}).forEach(function (id) {
      var el = document.getElementById(id), at = el;
      for (var i = 0; at && i < (+opts.moves[id] || 0); i++) at = at.nextElementSibling;
      if (el && at && at !== el) { at.parentNode.insertBefore(el, at.nextSibling); out.moved = (out.moved || 0) + 1; }
    });
    /* the block after a figure or a table stands a little further off (print.css .cp-after; Paged.js turns an "a + b"
       selector into a rule too weak to set it) */
    each('.prose > .figure, .prose > .table-wrap', document, function (el) {
      if (el.nextElementSibling) el.nextElementSibling.classList.add('cp-after');
    });
    each('details', document, function (d) { d.open = true; });
    /* A glossary term is a button on screen, and a button never breaks across a line: on paper it is a word in the
       text, so it becomes a span ("deep ultraviolet (DUV) lithography" then wraps like the words round it). The card's
       two rating tags stay buttons, with their box. */
    each('button.gl-term:not(.ptag)', document, function (b) {
      var s = document.createElement('span');
      s.className = b.className;
      while (b.firstChild) s.appendChild(b.firstChild);
      b.parentNode.replaceChild(s, b);
    });

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

    /* chapters whose card opened a page after a short one in an earlier layout (from pdf.py): the head and the card
       are set closer (print.css .cp-tight), so that the end of In short and the card share a page */
    Object.keys(opts.tight || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.tight[id]) ch.classList.add('cp-tight');
    });
    /* and chapters whose card, set closer, still ran into the notes: the card may break between its parts (.cp-split) */
    Object.keys(opts.split || {}).forEach(function (id) {
      var ch = document.getElementById(id);
      if (ch && opts.split[id]) ch.classList.add('cp-split');
    });

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

    /* the class tells print.css the notes have moved to the foot of the page. The notes are short, so each chapter
       still ends with its source list, set for paper with every full address (sourceList). */
    document.documentElement.classList.add('cp-print');
    each('.chapter-sources', document, function (d) {
      var box = sourceList(d);
      if (box) d.parentNode.replaceChild(box, d); else d.remove();
    });

    /* the colophon's sentence about hovering and end-of-chapter lists is a screen sentence */
    each('.site-footer .sources-key', document, function (p) {
      p.innerHTML = p.innerHTML.replace(
        /Hover any footnote for the document; each chapter ends with its own source list\./,
        'Every source is a note at the foot of the page it is cited on, and each chapter ends with its own source list.');
    });

    each('sup.cite > a', document, function (a) {
      var sup = a.parentNode;
      if (!sup || !sup.parentNode) return;
      out.cites++;
      /* the number sits on its word, as a footnote does in print (the readable pages drop the same space) */
      var prev = sup.previousSibling;
      if (prev && prev.nodeType === 3 && /\s$/.test(prev.nodeValue)) prev.nodeValue = prev.nodeValue.replace(/\s+$/, '');
      var chapter = sup.closest ? sup.closest('article.chapter') : null;
      var key = (chapter && chapter.id ? chapter.id : 'x') + '/' + a.textContent.trim();
      sup.parentNode.insertBefore(noteFor(a, key), sup.nextSibling);
      out.notes++;
    });

    /* Paged.js must not start on its own: pdf.py drives it. Once it has loaded, and before it lays anything out, the note
       handler below goes first in its list (noteFlow). */
    window.PagedConfig = window.PagedConfig || {};
    window.PagedConfig.auto = false;
    window.PagedConfig.before = function () {
      var P = window.Paged;
      if (!P || !P.Handler || !P.registeredHandlers || window.__cpNoteFlow) return;
      window.__cpNoteFlow = true;
      P.registeredHandlers.unshift(noteFlow(P.Handler));
    };
    return out;
  }

  /* The notes at the foot of each page, kept to what the page holds. Paged.js 0.4.3 has two habits that leave pages part
     empty: it moves every note in a run of text to the foot before it looks for the end of the page, and when it cuts the
     page short it drops the notes of the calls it cut but keeps their room; and it gives a source cited twice on one page
     two notes. This handler, first in Paged.js's list, mends both while the page is laid out:
     - renderNode: a note whose source already has a note on this page leaves the flow before Paged.js moves it (the call
       in the text keeps its number, and the next page gets its own note from the source, as before);
     - onOverflow: before the page is cut, the notes are made to match the calls that stay on it, the room at the foot is
       set to fit them, and the end of the page is looked for again, one call at a time, until the two agree; when the
       page then has room for more, Paged.js is told so and goes on filling it. */
  function noteFlow(Handler) {
    function noteBox(el) {
      var area = el && el.closest ? el.closest('.pagedjs_area') : null;
      if (!area) return null;
      var content = area.querySelector('.pagedjs_footnote_content');
      var inner = content && content.querySelector('.pagedjs_footnote_inner_content');
      return inner ? { area: area, content: content, inner: inner } : null;
    }
    function px(style, a, b) { return (parseFloat(style[a]) || 0) + (parseFloat(style[b]) || 0); }
    /* the room the notes take, as Paged.js counts it: the notes, and the box's margins, borders and padding */
    function fit(box, any) {
      var h = 0;
      if (any) {
        var s = window.getComputedStyle(box.content);
        h = box.inner.getBoundingClientRect().height + px(s, 'marginTop', 'marginBottom') +
          px(s, 'borderTopWidth', 'borderBottomWidth') + px(s, 'paddingTop', 'paddingBottom');
      }
      box.area.style.setProperty('--pagedjs-footnotes-height', Math.ceil(h) + 'px');
      box.content.classList.toggle('pagedjs_footnote_empty', !any);
    }

    return class CPNoteFlow extends Handler {
      renderNode(node) {
        if (!node || node.nodeType !== 1 || !node.dataset) return;
        var notes = node.dataset.note === 'footnote' ? [node] : node.querySelectorAll('[data-note="footnote"]');
        if (!notes.length) return;
        var box = noteBox(node), page = node.closest('.pagedjs_page_content');
        if (!box || !page) return;
        var right = page.getBoundingClientRect().right, seen = {};
        each('[data-note="footnote"]', box.inner, function (n) { seen[n.getAttribute('data-k')] = 1; });
        /* a repeat stops being a note (Paged.js then passes it by) and stays in the text unseen (print.css, .fn-dup) */
        Array.prototype.forEach.call(notes, function (n) {
          var k = n.getAttribute('data-k');
          if (!k || n.getBoundingClientRect().left >= right) return; // past the page: Paged.js leaves it for the next one
          if (seen[k]) { n.removeAttribute('data-note'); n.classList.add('fn-dup'); } else seen[k] = 1;
        });
      }

      onOverflow(overflow, rendered, bounds, layout) {
        if (!overflow || !rendered || !layout || typeof layout.findOverflow !== 'function') return;
        var box = noteBox(rendered);
        if (!box) return;
        var notes = Array.prototype.filter.call(box.inner.children, function (n) { return n.dataset && n.dataset.note === 'footnote'; });
        if (!notes.length) return;
        /* the calls in the text, in order, each with its note; a note carried from the page before has no call here and stays */
        var calls = [], carried = [];
        notes.forEach(function (n) {
          var c = rendered.querySelector('[data-footnote-call="' + n.dataset.ref + '"]');
          if (c) calls.push({ call: c, note: n }); else carried.push(n);
        });
        if (!calls.length) return;
        var was = { h: box.area.style.getPropertyValue('--pagedjs-footnotes-height'), clip: box.inner.style.height };
        var set = function (k) { // the carried notes and the notes of the first k calls, the room fitted to them
          notes.forEach(function (n) { if (n.parentNode) n.remove(); });
          carried.forEach(function (n) { box.inner.appendChild(n); });
          calls.slice(0, k).forEach(function (c) { box.inner.appendChild(c.note); });
          box.inner.style.height = '';
          fit(box, carried.length + k > 0);
        };
        var before = function (c, end) { return !end || end.comparePoint(c.call, 0) < 0; }; // the call stays on the page
        /* Every call before the end Paged.js found needs its note; so take those, then one more call at a time: with the
           notes of the first k calls, the page ends somewhere. If call k+1 still falls on the page, its note is needed too.
           If call k falls off, the page ends there, with the notes of the calls still on it (fewer notes, so the text
           before that end fits). Otherwise the notes and the end agree. */
        var count = function (end) { return calls.filter(function (c) { return before(c, end); }).length; };
        var k = count(overflow), end, answer = null;
        for (; k <= calls.length; k++) {
          set(k);
          end = layout.findOverflow(rendered, bounds);
          if (k < calls.length && before(calls[k], end)) continue;
          answer = { k: k === 0 || before(calls[k - 1], end) ? k : count(end), end: end };
          break;
        }
        /* an answer that would leave the page with no text falls back to Paged.js's own */
        var lead = answer && answer.end ? document.createRange() : null;
        if (lead) { lead.setStart(rendered, 0); lead.setEnd(answer.end.startContainer, answer.end.startOffset); }
        if (!answer || (lead && !lead.toString().trim() && !lead.cloneContents().querySelector('img, svg, table'))) {
          set(calls.length);
          box.area.style.setProperty('--pagedjs-footnotes-height', was.h);
          box.inner.style.height = was.clip;
          return;
        }
        set(answer.k);
        return answer.end || null; // null: with its notes right, the page has room for more, and Paged.js carries on
      }
    };
  }

  /* how full a laid-out page is, from 0 to 1: from the top of the page's area to the last line of text, image or rule
     on it, and the notes */
  function fill(page) {
    var area = page.querySelector('.pagedjs_area'), content = page.querySelector('.pagedjs_page_content');
    if (!area || !content) return 1;
    var a = area.getBoundingClientRect(), bottom = inkBottom(content, a.bottom);
    var notes = page.querySelector('.pagedjs_footnote_area'), nh = notes ? notes.getBoundingClientRect().height : 0;
    return a.height ? Math.min(1, (Math.max(bottom, a.top) - a.top + nh) / a.height) : 1;
  }
  /* the lowest line of text, image, rule or box on the page (no lower than limit); the page's own column is to the left
     of what Paged.js holds over for the next page */
  function inkBottom(content, limit) {
    var c = content.getBoundingClientRect(), bottom = -Infinity, r = document.createRange();
    var low = function (q) { if (q.height > 0 && q.left < c.right && q.bottom > bottom) bottom = Math.min(q.bottom, limit); };
    var hidden = function (n) { return n.closest('.sr-only, .fn'); }; // text kept for screen readers, and notes still in the text
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.nodeValue.trim() || hidden(walker.currentNode.parentNode)) continue;
      r.selectNodeContents(walker.currentNode);
      Array.prototype.forEach.call(r.getClientRects(), low);
    }
    each('img, svg, hr, table, .stack-bar, .plate, .figure, .plain, .inshort, .cite', content, function (el) { if (!hidden(el)) low(el.getBoundingClientRect()); });
    return bottom;
  }

  /* Figures that left a gap: a figure (kept whole, with its title and source line) that opens a page, alone or under its
     heading, when the page before falls short. The text after it can fill that page, as text runs past a figure in a
     book: the answer is how many blocks to move the figure past, the paragraphs and lists that fit the gap with their
     notes and one more that can run on across the page's end, never past a heading, a table or another figure. pdf.py
     then lays the chapter out again with the figures moved (prepare({moves})). Figures carry no footnote marks, so the
     notes keep their order. */
  var NOTE_LINE = 15; // px: one more note at the foot, as print.css sets them
  function floats(pages, fills) {
    var out = [];
    var area = pages[0] && pages[0].querySelector('.pagedjs_area'), H = area ? area.getBoundingClientRect().height : 0;
    for (var i = 1; i < pages.length; i++) {
      if (!(fills[i - 1] < 0.8)) continue;
      var content = pages[i].querySelector('.pagedjs_page_content');
      var first = content && content.querySelector('.figure, p, li, h2, h3, h4, h5, table, .plate, .plain, .inshort, .rv-keep, .cp-sources');
      if (first && /^H[2-5]$/.test(first.tagName)) first = first.nextElementSibling;
      if (!first || !first.matches('.figure[id]') || first.hasAttribute('data-split-from')) continue; // a figure's first part keeps its id
      var gap = (1 - fills[i - 1]) * H, used = 0, k = 0, seen = {};
      each('.pagedjs_footnote_inner_content .fn', pages[i - 1], function (n) { seen[n.getAttribute('data-k')] = 1; });
      for (var s = first.nextElementSibling; s; s = s.nextElementSibling) {
        if (!/^(P|UL|OL|BLOCKQUOTE)$/.test(s.tagName)) break;
        var h = 0, keys = {}, st = window.getComputedStyle(s);
        each('[data-ref="' + s.getAttribute('data-ref') + '"]', document, function (part) {
          h += part.getBoundingClientRect().height;
          each('.fn', part, function (n) { var key = n.getAttribute('data-k'); if (key && !seen[key]) keys[key] = 1; });
        });
        h += (parseFloat(st.marginTop) || 0) + (parseFloat(st.marginBottom) || 0) + Object.keys(keys).length * NOTE_LINE;
        if (used + h <= gap) { used += h; k++; Object.keys(keys).forEach(function (key) { seen[key] = 1; }); continue; }
        if (gap - used > 4 * NOTE_LINE) k++; // room for a few lines: it starts here and runs on above the figure's page
        break;
      }
      if (k) out.push({ id: first.id, k: k, page: i + 1 });
    }
    return out;
  }

  /* Called once Paged.js has laid the pages out. noteFlow has already given each source one note a page; any repeat
     left is taken out here. The report names the pages that fall short (under two-thirds full, the last page aside), a
     heading left at the foot of a page, and a figure or card split across two. */
  function finish() {
    var out = { pages: 0, notes: 0, repeats: 0, stray: 0, overflow: 0, short: [], stranded: [], split: [], overlap: [], crowded: [], lost: [] };
    var pages = document.querySelectorAll('.pagedjs_page'), fills = [], alone = !!document.querySelector('.pagedjs_page .pt-chapter');
    Array.prototype.forEach.call(pages, function (page, i) {
      out.pages++;
      var seen = {};
      each('.pagedjs_footnote_inner_content .fn', page, function (fn) {
        var k = fn.getAttribute('data-k') || '';
        if (seen[k]) { fn.remove(); out.repeats++; return; }
        seen[k] = 1; out.notes++;
      });
      var inner = page.querySelector('.pagedjs_footnote_inner_content');
      var content = page.querySelector('.pagedjs_footnote_content');
      /* a source cited again keeps its first number, so a page's notes can come out of order (4, 3, 8): they are put in
         order of their numbers, which a reader looks them up by. The same notes in another order take the same room. */
      if (inner) {
        var fns = Array.prototype.slice.call(inner.querySelectorAll(':scope > .fn'));
        var num = function (fn) { var n = fn.querySelector('.fn-n'); return n ? parseInt(n.textContent, 10) || 0 : 0; };
        if (!fns.some(function (fn) { return fn.hasAttribute('data-split-from'); })) {
          fns.sort(function (x, y) { return num(x) - num(y); }).forEach(function (fn) { inner.appendChild(fn); });
        }
      }
      if (inner && content && inner.scrollHeight - content.clientHeight > 2) out.overflow++;
      /* Paged.js copies the note's classes onto the call it inserts; a .fn left in the text
         that is not a call is a note it could not move, and print.css hides it */
      out.stray += page.querySelectorAll('.pagedjs_page_content .fn:not([data-footnote-call]):not(.fn-dup)').length;
      var f = fills[i] = fill(page);
      /* text or a figure that runs down into the notes (a block kept whole that is taller than its page's room) */
      var box = page.querySelector('.pagedjs_page_content');
      if (box && inkBottom(box, Infinity) > box.getBoundingClientRect().bottom + 2) {
        out.overlap.push(i + 1);
        var art = page.querySelector('.plate') ? page.querySelector('.plate').closest('article.chapter') : null;
        var aid = art ? art.id || art.getAttribute('data-id') : '';
        if (aid && out.crowded.indexOf(aid) < 0) out.crowded.push(aid);
      }
      /* a chapter's last page may fall short: in the book, the page after it opens the next chapter or the colophon */
      var ends = i < pages.length - 1 && !alone && pages[i + 1].querySelector('article.chapter:not([data-split-from]), .site-footer:not([data-split-from])');
      if (i < pages.length - 1 && !ends && f < 0.67 && !page.querySelector('.print-title, .contents')) out.short.push((i + 1) + ':' + Math.round(f * 100) + '%');
      each('.plate[data-split-to], .figure[data-split-to], .cp-sources li[data-split-to]', page, function (el) {
        out.split.push((i + 1) + ':' + (el.className.split(' ')[0] || el.tagName));
      });
      /* text that Paged.js left beyond the page's column would never print: a block kept whole that Chrome broke anyway */
      /* and a heading that is the last thing seen on a page that is not the last */
      if (box) {
        var right = box.getBoundingClientRect().right, rr = document.createRange(), tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), gone = 0, seenLast = null;
        while (tw.nextNode()) {
          var tn = tw.currentNode;
          if (!tn.nodeValue.trim() || tn.parentNode.closest('.sr-only, .fn')) continue;
          rr.selectNodeContents(tn);
          var qs = Array.prototype.filter.call(rr.getClientRects(), function (q) { return q.width > 0; });
          if (qs.some(function (q) { return q.left >= right - 1; })) gone++;
          if (qs.some(function (q) { return q.left < right - 1; })) seenLast = tn;
        }
        if (gone) out.lost.push((i + 1) + ':' + gone);
        var head = seenLast && seenLast.parentNode.closest('h2, h3, h4, h5, .fig-title, .cp-sources-h');
        if (head && i < pages.length - 1) out.stranded.push((i + 1) + ':' + head.textContent.trim().slice(0, 40));
      }
    });
    out.floats = floats(pages, fills);
    /* a card (kept whole) that opens a page when the page before falls short: its chapter, for a closer setting */
    out.tight = [];
    for (var i = 1; i < pages.length; i++) {
      var first = pages[i].querySelector('.pagedjs_page_content .plate, .pagedjs_page_content p, .pagedjs_page_content li, .pagedjs_page_content h3');
      var ch = first && first.matches('.plate') && !first.hasAttribute('data-split-from') && fills[i - 1] < 0.8 ? first.closest('article.chapter') : null;
      var cid = ch ? ch.id || ch.getAttribute('data-id') : ''; // Paged.js moves the id of a split element's later parts to data-id
      if (cid && out.tight.indexOf(cid) < 0) out.tight.push(cid);
    }
    /* the room left short on every page but the last, in pages: pdf.py keeps the layout with the least */
    out.gap = Math.round(fills.slice(0, -1).reduce(function (a, f) { return a + (1 - f); }, 0) * 100) / 100;
    return out;
  }

  window.CP_PRINT = { prepare: prepare, fontsReady: fontsReady, finish: finish };
})();
