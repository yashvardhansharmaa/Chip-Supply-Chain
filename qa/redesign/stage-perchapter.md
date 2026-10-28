# Each chapter at its own address (28 October 2026)

Branch `redesign-perchapter`, cut from `redesign` at 5428ddb. The brief is `qa/redesign-perchapter/BRIEF.md` in the main checkout.

## Approach (written before the first edit)

One template, three kinds of page, and shared files beside them.

1. **The build writes three kinds of page from `src/template.html`.**
   - `dist/index.html`, the home page: home, The Chain's contents (`#/chain`), AI Chips, Suppliers, Export Controls and the Glossary, as today. The stack view keeps its head and contents and no chapter.
   - `dist/<id>/index.html`, one per chapter (16): the same template with only the stack view, holding that chapter's article. Its head is the chapter's own: the title, description, canonical, share tags, citation and article tags, JSON-LD, and prev and next links that the readable page carries now (moved out of `social.js` into one head builder).
   - `dist/book/index.html`, print only: the stack view with the cover, contents and every chapter, as `index.html` holds them today, so `build/pdf.py` lays the book out from the same markup. It is `noindex`, linked from nowhere and disallowed in `robots.txt`.
2. **Shared code and data move into `dist/assets/`**, each loaded with `?v=<hash of its bytes>` so a change is fetched at once and an unchanged file stays cached:
   - `site.css`: the site's styles (`src/styles.css` and the module sheets);
   - `kit.js`: the specimen kit and every specimen. Each specimen keeps its own `try`, and the build parses each one first and leaves out one that does not parse, so one broken file cannot stop the rest, as the separate `<script>` tags ensured;
   - `app.js`: the app and its modules, with the cite, figure and rail-toggle scripts;
   - `data.js`: `CP_DATA` (AI Chips, Suppliers, Export Controls), loaded by the home page only;
   - `search.js`: the search index (every chapter, section, flashcard, term, supplier, chip, event and China revenue row, built at build time from the same rules the app used on the DOM), with the glossary definitions the pop-ups read and the names the empty search suggests. Every page loads it;
   - `glossary.js`: the Glossary's two data lists (`#lk-items`, `#glossary`), which it puts into the Glossary view; home page only;
   - `passages.js`: the chapters' paragraphs, for the Glossary's "Where it appears"; fetched when the Glossary opens.
   The small inline parts stay inline: the theme and rail scripts before first paint, `src/preroute.js`, the pre-boot CSS and the cite-line style.
3. **Links.** One build pass (`relink`) settles every link on each page by where its target lives:
   - a fragment whose target is on the page stays a fragment;
   - a chapter's anchor elsewhere becomes `<id>/` or `<id>/#<anchor>` (with `../` from a chapter page);
   - a view route (`#/landscape`, `#/glossary`, `#gl-…`) stays as it is on the home page and becomes `../#/…` from a chapter page (`#/` becomes `../`);
   - a relative path (`media/`, `pdf/`, `favicon.ico`, `<id>/`) gains `../` on the pages a folder down;
   - `data-route` goes from the home page and the chapter pages, so a chapter link is a real link. The book keeps them, so it still turns chapters in place.
   At run time `CP.addr()` applies the same rules to links the app writes (search results, Export Controls' "Read the chapter", the glossary's chapter links), and a click on a fragment whose target is not on the page goes to its address.
4. **The app knows its page.** `src/preroute.js` carries the page's kind, its chapter and its path to the root (written by the build). On the home page it sends any chapter hash the router accepts today (`#lithography`, `#lithography--who-makes-it`, `#fig-…`, `#cite-…`, `#/geopolitics`, `?only=<chapter>`, and a merged chapter's addresses) to `<id>/#<anchor>` with `location.replace`, before anything paints, so Back is not broken. `Router.route` does the same for a hash set later. On a chapter page the router always shows the stack view and that chapter, lands on any anchor in it, and sends any other hash to its page.
5. **Moves between pages.** A search result or a glossary passage that used to act after the route (open a chip's card, filter the suppliers, open a flashcard at a card, flash a paragraph) stores that action in `sessionStorage` before the page changes, and the page it lands on carries it out after boot.
6. **Print.** `print.js` turns the shared stylesheet back into a `<style>` before Paged.js reads it (so its counter fix still applies), and takes Lithography's annotated still from a `<template>` in the chapter (built from the readable page's code) instead of fetching the readable page. `pdf.py`'s default and `chapter_pdfs.py` point at `/book/` and `/<id>/`.
7. **Removed:** the readable chapter pages (`readableHTML` and the helpers only it used). `build/assets/chapter-page.css` stays, since the reference pages and `/intro/` use it. The sitemap lists each `/<id>/` once with its date; the share cards stay.

Order of work, one commit per working step: shared files; chapter pages and the router; the home page without chapters; search, glossary and passages; the book and print; sitemap and clean-up; checks; merge `redesign`, rebuild, recheck.
