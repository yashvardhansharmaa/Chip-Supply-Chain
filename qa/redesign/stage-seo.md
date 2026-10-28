# Chapter pages for search, and Hide contents (27 Oct 2026)

Branch `redesign-seo`. Two changes to the chapters: what search engines read on each chapter's static page (`dist/<chapter>/`), and a way to hide the contents rail on a wide screen, in The Chain and on the static pages.

## a) Search

### What changed

All in `build/modules/social.js` (the static chapter page's head), plus the home page's JSON-LD in `src/template.html`.

- **One JSON-LD graph per chapter page.**
  - An `Article`:
    - `headline` is the page's h1 (the chapter title), and `alternativeHeadline` the search title.
    - `description` is the meta description.
    - `url`, `@id` and `mainEntityOfPage` (a `WebPage` linked to the breadcrumb) are the canonical.
    - `image` is the share card (1200 × 630).
    - `datePublished` and `dateModified` come from `build/page-dates.json`, so `dateModified` is the day the page shows as "Updated".
    - `author` is Yashvardhan Sharma, with his LinkedIn URL.
    - `publisher` is the site as an `Organization`, with its 180 px icon as the logo.
    - Also `isPartOf` (the `WebSite`), `articleSection` ("The Chain"), `about` (the chapter's subject), `wordCount`, `timeRequired` and `isAccessibleForFree`.
    - `mentions` lists the firms the chapter's card names as leaders, for the 14 stage chapters.
  - A `BreadcrumbList`: Home › The Chain › chapter. The middle item points to `/chain/`, the address The Chain's share card already uses.
  - I chose `Article` over `ScholarlyArticle` because Google documents `Article` for rich results and does not list `ScholarlyArticle`. The `citation_*` meta tags that Google Scholar reads were already on the page.
- **The home page** keeps its `WebSite` and now names the same publisher, with `@id`s that the chapter pages point to. There is no `SearchAction`. The site's search is a dialog with no address of its own, and Google retired the sitelinks search box in November 2024.
- **Head and links:**
  - `<link rel="prev">` and `<link rel="next">` follow the reading order (01 to 16). Google has ignored them since 2019. Bing may still use them, and they cost two lines.
  - Added the `article:published_time`, `article:modified_time`, `article:author` and `article:section` tags.
  - Added `og:locale` (en_US) and `twitter:image:alt`. The Open Graph and Twitter sets are now complete. The reference pages get the last two as well, since they share the tag builder.
  - Added `<meta name="robots" content="max-image-preview:large">`, so Google may show the card large.
  - Each page still has one canonical, its own address. No `hreflang`.
- **The specimen still:**
  - Its alt text was "EUV scanner, the chapter's specimen". It is now the first sentence of the caption, for example "A silicon ingot, one crystal pulled whole from a melt, with two wafers sawn from it."
  - It now has `fetchpriority="high"`, and it already had a width and height.
  - Lithography's annotated still is drawn inside an SVG, which the browser's preload scanner does not read, so the head now preloads its picture.

The new alt text counts as page text in `build/page-dates.json`, so 15 chapters' content hashes moved. Their "Updated" day stays 27 October 2026, which it already was. No other change in this branch moves a date: the Hide contents buttons are added by script, so their words stay out of the hashed text.

### What the audit found already right

- **Headings:** each page has one h1 (the chapter title), sections as h2, sub-sections as h3, and the end matter (Review questions, Sources) as h2. No level is skipped. `check-seo.js` now enforces this.
- **Internal links:**
  - Every static page links every other chapter through the rail, plus the next and previous chapters (the door) and two or three related chapters.
  - In the app, the rail, the door and the parts list carry the static `href` (`lithography/`) with the app route in `data-route`.
  - The home page's HTML, before any script runs, links every chapter page by `href` about 20 times each.
  - The Chain's contents list and the phone's chapter sheet still use hash links (`#lithography`). I left them because `stage-chapters.js` clicks the contents by those hrefs, and the home page already links every page.
- **Sitemap and robots.txt:**
  - The sitemap lists the home page, the 16 chapter pages, `/summary/` and the four reference pages, each with its real `lastmod` from `build/page-dates.json`.
  - It leaves out the forwarding pages (`/transistors-and-front-end/`, `/home/`, `/intro/`, `/chain/`) and every PDF.
  - `robots.txt` allows everything except the three old PDF names, and names the sitemap.
  - The merged chapter's old page has a canonical to Foundries and Fabs and a zero-second refresh, which Google treats as a redirect.
- **Speed:**
  - The head preconnects to Google Fonts, and the font URL has `display=swap`.
  - There are no blocking scripts: the theme script is inline and about 300 bytes, the counter is `async`, and the page's own scripts sit at the end of the body.
  - Every image on the page has a width and height except the print-only animation still, which is hidden on screen.

### Weight of the static Lithography page

Measured on a cold load at 1440 px:

| Part | Size |
|---|---|
| HTML | 218 KB (42 KB gzipped, 32 KB with Brotli). Of that, 74 KB is inline CSS, 12 KB inline scripts (2 KB of JSON-LD) and 4 KB the annotated still's SVG. |
| Images | 218 KB: the annotated still (88 KB) and the explainer video's poster (130 KB). |
| Fonts | 173 KB: three WOFF2 files. |
| Icons and the font stylesheet | 5 KB |
| **Total** | **about 614 KB, or about 440 KB over the wire with gzip** |

The video poster loads at once although the explainer is below the fold. The `poster` attribute has no lazy option. The figures belong to another builder, so I left it.

### Proposed title and description edits (not made)

Lengths below include " · Chip Supply Chain". Google cuts a title at about 600 px, roughly 55 to 60 characters, and often shows the site name separately. `check-seo.js` prints these as notes.

| Page | Now | Proposed |
|---|---|---|
| `/silicon-and-wafers/` | How silicon wafers are made (47) | How silicon wafers are made from quartz (59). Matches the description's "How quartz becomes…" |
| `/chemicals-gases-and-photoresist/` | Photoresist and the chemicals used to make chips (68) | Photoresist and chemicals for chipmaking (60) |
| `/advanced-packaging/` | How advanced packaging like TSMC's CoWoS works (66) | How advanced packaging like CoWoS works (59). CoWoS is the search term, and the description names TSMC. |
| `/foundries-and-fabs/` | How chip foundries like TSMC make transistors (65) | Awaiting the owner. If a shorter title is wanted: How foundries like TSMC make transistors (60) |
| `/memory-and-hbm/` | What HBM is and who makes it (48) | Optional, since 48 is close: What HBM is and who makes it for AI chips (61) |

Every chapter description is 125 to 156 characters and reads clearly. One edit would make a description more specific:

- `/photomasks-and-pellicles/`: "…Only three firms make the blank plates for EUV masks." → "…Only three firms make the blank plates for EUV masks, two of them Japan's AGC and Hoya." (159 characters). The chapter's one-liner names the same two firms.

## b) Hide contents

- **Where:**
  - "Hide contents" ends the rail's first line, beside "On this page". It is quiet text in the interface face with the usual sidebar icon. Its target is 26 px tall, but the line does not grow, so "On this page" stays level with the kicker.
  - The whole rail grows by 8 px, the room the button's focus ring needs inside the rail's scroll box. It still fits a 900 px window: 790 px in 790 px, against a limit of 808.
- **Hidden:**
  - The rail's three parts go. The text column moves to the middle of the page at its 666 px measure, and the figures move with it.
  - The column's width does not change, so the reader's place in the text stays put.
  - At 1440 px the column moves only 11 px (398 to 387), because the rail's column was nearly centered already. At 1920 px it moves 109 px to the middle.
- **Bringing it back:** "Show contents", a small pill at the top of the left margin, level with the kicker. It is sticky, so it stays in view down the whole chapter. A second control at the left edge was clearer than one button that changes its words, and it keeps the button off the text.
- **Remembered:** the choice is stored in `localStorage` as "cp-rail". It is the same for every chapter, in the app and on the static pages, since they share an origin. The head of each page sets `html.rail-off` before the first paint, so a hidden rail never flashes in. Every storage call is wrapped in try/catch.
- **Keyboard and screen readers:**
  - Both buttons have `aria-controls` (the rail's parts) and `aria-expanded` (true on Hide contents, false on Show contents).
  - Pressing one moves focus to the other, since the pressed one disappears.
  - Tab reaches Hide contents straight after the chapter's head, before the rail's links.
- **Below 1200 px:** neither button shows, and a stored "hidden" has no effect. The rail there is already one line of links over the specimen.
- **Print:** prints as before. Neither button prints, and the hidden layout is screen-only.
- **No scripts:** the buttons are added by the shared script (`RAIL_TOGGLE_JS` in `build/build.js`, used by the app and the static pages, as `CITE_JS` is). A page read without scripts has no dead button.

Files:
- `build/build.js`: `railHTML` wraps the rail's parts in `<div class="rail-body" id="<chapter>--rail">`, and holds `RAIL_TOGGLE_JS`.
- `src/modules/chapter.css`: one block in section 4, the rail.
- `src/template.html`: the early class and the script tag.
- `build/modules/social.js`: the same for the static pages.

## Checks

| Check | Result |
|---|---|
| `node build/build.js` | no warnings |
| `check-speak.js` | no matches |
| `check-integrity.js` | no problems |
| `check-sources.js` | 2,815 citations, all tier A or B |
| `check-size.js` | none over 5 MB |
| `check-seo.js` (new) | 16 chapter pages, 22 sitemap entries, no problems; 5 notes, the title lengths above (`qa/redesign/check-seo.txt`) |
| `smoke.js --port 9431` | 36 page loads, no failures |
| `stage-chapters.js --base http://127.0.0.1:8771` | 9 of 9 pass (`stage-chapters-seo.txt`) |
| `interact-chapter.js http://127.0.0.1:8771` | 80 ok, all passed (`interact-chapter-seo.txt`) |
| `sweep-full.js` at 390, 1024, 1280 and 1440 | 32 loads, 0 with findings (`sweep-seo.txt`) |

- **check-seo.js** checks each chapter page for:
  - one h1 and no skipped heading level;
  - one title, one description and one canonical;
  - the full Open Graph and Twitter sets, and prev and next;
  - JSON-LD that parses and agrees with the page: headline, url, description, image, both dates, author, publisher, and the breadcrumb's names and ends;
  - the still's alt text and size;
  - its sitemap entry and `lastmod`, and the shown "Updated" day.

  For the site, it checks the sitemap and `robots.txt`, the home page's JSON-LD and its link to every chapter, and the merged chapter's canonical. `--strict` turns the length notes into failures. I tested it by breaking a page's headline, its "Updated" day and its rel=next: each was caught.
- **interact-chapter.js:**
  - The existing "rail starts beside the kicker" check now measures the rail's first line, since the rail starts 8 px higher.
  - "No button from the app" now allows the two rail buttons.
  - New checks, in The Chain and on the static page: the default state, Tab, Enter to hide, the column centered at 666 px with the figures, the stored choice, Show contents in view down the page, a reload, Enter to show with focus back on Hide contents, print, and 1024 px.
- **sweep-full.js** now takes an optional third field of script per page. The sweep covered The Chain's Lithography and its static page, with the rail shown and hidden, in light and dark.

## Shots

In `qa/redesign/shots/seo/` (git-ignored), all from 127.0.0.1:8771:

- `app-1440-shown.png`, `app-1440-hidden.png`: The Chain, the top of Lithography
- `app-1440-shown-mid.png`, `app-1440-hidden-mid.png`: at "Who makes it", with Show contents still in view
- `static-1440-shown.png`, `static-1440-hidden.png`, `static-1440-hidden-mid.png`: the static page
- `app-1440-hidden-dark.png`, `static-1440-shown-dark.png`: dark
- `static-1920-hidden.png`: the column in the middle of a wide screen
- `static-1024-stored-hidden.png`: at 1024 px a stored "hidden" leaves the line of links alone
- `app-1440-hide-focus.png`: Hide contents with keyboard focus

## Notes for the lead

- **Why pages may sit unindexed.** The home page's HTML (4.5 MB) carries the full text of all 16 chapters, so each chapter page repeats part of a page Google already has. Each canonical is right (self). Still, Google may judge a chapter page to add little, which is one plausible cause of "Crawled, currently not indexed". Fixing it would mean the app loading chapter text later, which is outside this branch.
- **After deploy:** resubmit the sitemap in Search Console and request indexing for a few chapter pages. "Discovered, currently not indexed" on a young site often clears with time and links from other sites.
- **The breadcrumb's middle item**, `/chain/`, is a forwarding page whose canonical is the home page. It is a valid URL, and it is the only real address The Chain has. A static contents page at `/chain/`, listing the 16 chapters with their one-liners, would give the breadcrumb a real target and the site a crawlable hub.
- **Merges:** my CSS is one block in `chapter.css` section 4, the rail. The other builders' figure and label rules are untouched. Every `dist/` file will need a rebuild after merging, as usual.
