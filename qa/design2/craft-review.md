# Craft review: motion, interaction and finish (design round two, 23 October 2026)

Slug `craft`. Shots in `qa/design2/shots/craft/` (paths below are relative to it). Every proof was injected at run time with
the scripts saved beside the shots (`proof-*.js`) or rendered from the mocks in `mock/`. No repo file was edited.

## 1. Verdict

The ledger is the right system for this subject and these readers, and nothing in my lens argues for replacing it. A
reference work read by policy staff and students needs motion that stays quiet and controls that read as one family, and
the static surfaces already behave that way: the masthead, the chapter PDF's first page, the cover and the wordmark at
16 px. The weak layer is everything that moves or floats. The explainer animations teach well, but the reader cannot see
how to stop them. The only state they show is a "Paused" badge that lands on the drawing's own labels. With reduced
motion, the still shows the end of the film while the words describe its start. The 3D specimens turn a full circle, so for
part of every turn they stand edge-on or face away. In those frames the caption ("plasma at bottom left") is wrong. Popovers
center on their mark and cover the ledger column. Search uses the browser's blue clear button. Outside the page, the
174-page book has no bookmarks, every PDF names a browser user-agent as its creator, tabs say "Chip Supply Chain · The
Chain" for all 17 chapters, a mistyped address falls to GitHub's generic 404, and chapter share cards lose their titles in
square crops. A great studio would treat the moving and floating parts as part of the ledger: one visible control per
moving thing, one visible timeline, popovers anchored to the column, and a page outline wherever the site travels. The
system is right. The motion layer needs to follow its own rules.

## 2. Proposals

### P1: broken, ugly or confusing

#### P1-1. Reduced motion shows the last frame under the first step's words
- **Type:** Fix.
- **Where:** every explainer animation (15), any viewport, both themes, with `prefers-reduced-motion: reduce`.
- **What is wrong:** reduced motion loads the `-end.jpg` still (the whole wafer printed, "97 of 97 patches printed"), but the
  step row keeps `aria-current` on 01 COAT and the caption reads "The wafer is coated with a thin film…". The picture and
  the words disagree, so the reader who asked for less motion gets the most confusing figure on the page.
- **Change:** `src/app.js`, `Anim.init`, after `if (reduced) { … fig.classList.add('is-paused'); }` add `show(btns.length - 1);`.
  `show()` already moves `aria-current` and sets the caption. A click on any step still seeks the video and shows that
  step's frame, so the steps work as a slideshow for these readers.
- **Shots:** `anim-litho-390-reduced.png` (before) → `anim-litho-390-reduced-after.png` (after, with P2-1's row).
- **Risk:** none. Print is untouched (it uses `.anim-print` and the transcript).
- **Touches:** nothing else.
- **Size:** S.

#### P1-2. The "Paused" badge sits on the drawing's labels
- **Type:** Fix.
- **Where:** every animation, all viewports, light and dark. It also shows from load under reduced motion, where the reader
  paused nothing.
- **What is wrong:** `.anim-state` is pinned `top: 8px; right: 8px` inside the frame, where the animations put their own
  top-right labels: "THE WHOLE WAFER, 300 MM ACROSS" is cut to "ACR|OSS" at 1440, and "EACH PATCH AT MO|ST 26 BY 33 MM" on
  a phone.
- **Change:** remove the badge (`.anim-state` in `src/styles.css`, its `<span>` from the figure markup in `build/build.js`)
  and carry the state on the play/pause button of P2-1. If P2-1 is declined, deleting the badge is still the right minimum.
  The still frame shows the state, and the stage's `aria-label` ("Play the animation") tells screen readers. Every place
  inside the frame collides with some animation's labels.
- **Shots:** `anim-litho-1440-paused.png`, `anim-litho-1440-dark-paused.png`, `anim-litho-390-reduced.png` (before) →
  `anim-litho-1440-after-paused.png` (after).
- **Risk:** none.
- **Touches:** the static chapter pages use native video controls and are unaffected.
- **Size:** S.

#### P1-3. No 404 page
- **Type:** Fix.
- **Where:** any mistyped or retired address (`/lithgraphy/`, an old share link), every viewport.
- **What is wrong:** `dist/` has no `404.html`, so GitHub Pages serves its own generic page with no wordmark, no way back and
  no mention of the site. The local server shows its bare "Error response". For a reference that people link to from
  papers and briefs, a dead end like this looks careless.
- **Change:** `build/build.js` writes `dist/404.html` from the static chapter page template (`build/assets/chapter-page.css`,
  the same masthead). GitHub Pages serves it at any depth, so every link is root-relative. Content: eyebrow "Not found ·
  Error 404", title "No page at this address", lede "The address may be mistyped, or the page may have moved. Every chapter
  is listed below.", the 17 chapters as a numbered ledger list in two columns (one on phones), then Home, The Chain, Glossary,
  Suppliers and The book as a PDF. `<title>Page not found · Chip Supply Chain</title>`,
  `<meta name="robots" content="noindex">`, no GoatCounter path of its own (or count it as `/404`, which shows the owner
  which old links still circulate).
- **Shots:** `404-1440-before.png` (the local server's page, a stand-in for GitHub's) → `404-1440-after.png`,
  `404-390-after.png`. Markup and CSS: `proof-404.js`.
- **Risk:** none. It is not in the sitemap.
- **Touches:** none.
- **Size:** S.

#### P1-4. The 174-page book has no bookmarks, and every PDF calls itself a browser
- **Type:** Fix.
- **Where:** `dist/chip-supply-chain-the-chain.pdf`, the 17 chapter PDFs, the summary PDF, in any PDF viewer.
- **What is wrong:** the book's outline is empty (0 entries), so Preview's or Acrobat's sidebar offers nothing and a reader
  looking for chapter 11 pages through 100 pages. The metadata says `Author: ''` and
  `Creator: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) … HeadlessChrome/155`, which is what Document Properties and
  reference managers (Zotero reads these) show. The book's title order ("Chip Supply Chain · The Chain") differs from the
  chapter PDFs ("Lithography · Chip Supply Chain").
- **Change:** in `build/pdf.py` (and `chapter_pdfs.py`, `summary_pdf.py`), after `Page.printToPDF`, a PyMuPDF pass (installed
  on this Mac): `doc.set_toc([...])` with Cover, Contents, "The fifteen stages" and its 15 chapters, "Across the chain" and
  its two. The page numbers are already on the contents page. Then `doc.set_metadata({title: 'The Chain · Chip Supply Chain',
  author: 'Yashvardhan Sharma', subject: <the dek and edition>, keywords: …, creator: 'Chip Supply Chain
  (chipsupplychain.org)'})`. The chapter PDFs get their section heads (In plain terms, How it works, …) as an outline the
  same way. Chrome's `generateDocumentOutline: true` printToPDF option is a lighter alternative, but it takes every h1 to h6
  as it finds them, so the PyMuPDF list is the controlled one.
- **Proof:** `pdf/book-outline-before-after.txt` (metadata and outline before: 0 entries; after: 21 entries with the right
  pages, 33 for Lithography and 160 for Who Controls the Chain. Size: 9,373 KB before, 9,166 KB after).
- **Risk:** low. Run it once on the existing PDFs, then again only when a PDF is rebuilt (the owner's rule).
- **Touches:** the PDF build scripts only.
- **Size:** S.

### P2: clear upgrades

#### P2-1. The animation gets one visible control and a timeline (structural)
- **Type:** Decision.
- **Where:** every explainer animation, all viewports, both themes.
- **What is wrong:** the only control is the video itself (`role="button"`, a pointer cursor). Nothing shows that the film can
  be paused, how long a step lasts, or how far it has run. The specimen beside it has a square pause button, so the page
  has two moving things with two different control languages. On a phone the five step names wrap to two lines.
- **Change:** the step row becomes the film's timeline. A 24 px square play/pause button (the specimen's own `.stage-pause`
  glyphs, with an edge at `--control-edge`) heads the row. Each step is a segment whose width is its share of the film
  (`flex: <seconds> 1 0`). The current segment's 2 px rule fills in garnet as it plays, earlier ones are inked
  (`--ink-2`), later ones are `--line-2`. Under 700 px only the current step keeps its name and the others show their
  number, so the row stays on one line. The video stays clickable. The button carries "Play the animation" / "Pause the
  animation", and the badge of P1-2 goes. CSS and DOM in `proof-anim-timeline.js`. In the build, `build/build.js` emits
  the `.anim-bar` and the button, and `Anim.tick` sets `--p` on the current `li` and `.done` on earlier ones (one style
  write per frame, only while playing and on screen).
- **Shots:** before `anim-litho-1440-t1.png`, `anim-litho-1440-t8.png`, `anim-litho-1440-paused.png`; after
  `anim-litho-1440-after-playing-a.png`, `anim-litho-1440-after-playing-b.png`, `anim-litho-1440-after-paused.png`; keyboard
  focus on the button `anim-litho-1440-after-focus.png`; phone `anim-litho-390-playing-before-vs-after.png` (the row on one
  line, the play state visible).
- **The other choice:** keep the current row and fix only P1-1 and P1-2. The timeline is the bigger gain, because it makes
  the steps read as one process with a known length, which is what these films teach.
- **Risk:** low. Garnet stays on the one current thing, as now. Reduced motion shows the button as Play with the last
  segment full.
- **Touches:** print and the static pages are unchanged (print hides the steps, and static pages use native controls).
- **Size:** M.

#### P2-2. Specimens sway around their opening view instead of turning a full circle
- **Type:** Decision.
- **Where:** the 3D stage, every chapter and the home walk, 1024 and wider, and the phone thumbnail.
- **What is wrong:** the idle turn (`Stage.loop`, 0.08 rad/s, about 78 s a circle) passes through edge-on views (18 s and 54 s
  in the sequence), where the EUV scanner's light path collapses into a vertical line. From about 24 to 42 s the reader sees
  the machine from behind, with the plasma source at the right, while the caption says "from the violet-white tin plasma at
  bottom left to the wafer". For roughly half of every turn, the specimen contradicts its own label.
- **Change:** non-turntable specimens sway ±0.45 rad (about ±26°) around the angle they open at, on a 20 s sine. Turntable
  specimens (a plan view turning in its plane, such as the wafer) keep the steady turn, because they read at any angle. In
  `Stage.loop`: keep `this.spin` advancing as now, and in `draw` use
  `var idle = slot.turntable ? this.spin + slot.spinBase : (slot.sway || 0.45) * Math.sin((this.spin + slot.spinBase) * 2 * Math.PI / (20 * (slot.spin || 0.1)));`.
  A specimen can declare its own `sway` amplitude. The pause button, drag, arrow keys and reduced motion keep working
  unchanged.
- **Shots:** `spec-litho-idle-before-0-54s.png` (a frame every 6 s) → `spec-litho-idle-after-sway-0-27s.png` (a frame every
  3 s, injected by driving `CP.Stage.spin` on a sine). Every after frame keeps the light path readable and the source at
  bottom left.
- **Risk:** the motion is gentler. A reader who wants the back view can still drag (the owner decided against adding rotate
  or zoom controls, and this adds none).
- **Touches:** the phone thumbnail and the walk use the same loop. The share cards already use the opening angle.
- **Size:** S.

#### P2-3. Tab titles name the page first and follow the chapter in view
- **Type:** Fix.
- **Where:** every browser tab, bookmark and history entry for the app.
- **What is wrong:** `Router` sets `document.title` to "Chip Supply Chain · The Chain" for all 17 chapters and to "Chip
  Supply Chain" on Home, which also replaces the better boot title "How AI chips are made · Chip Supply Chain". A tab
  truncates from the right, so five open tabs all read "Chip Supply Chain · The…". The static pages and the chapter PDFs
  already put the page first.
- **Change:** `src/app.js:436`:
  `document.title = v === 'walk' ? 'How AI chips are made · Chip Supply Chain' : (label ? label + ' · Chip Supply Chain' : 'Chip Supply Chain');`.
  For the chain, `Sections.update` sets `document.title = <current chapter title> + ' · Chip Supply Chain'` when the
  current chapter changes (it already tracks it for the ledger column). GoatCounter counts paths, so nothing changes there.
- **Shots:** `tabs-titles-before-after.png` (a tab strip rendered from `mock/tabs.html` at real tab width with the real
  favicon).
- **Risk:** none.
- **Touches:** P1-4 aligns the book's PDF title to the same order.
- **Size:** S.

#### P2-4. Source cards and term cards open over the reading column, not the ledger
- **Type:** Fix.
- **Where:** chapters and the walk, 1024 and wider, both themes.
- **What is wrong:** `Cite.place` and `Tip.place` center the card on its mark and clamp only to the window. For a mark near
  the start of a line, the card's left half covers the ledger column: the chapter numeral "04", the stage index and the
  Extreme/High key. The ledger column is the one fixed landmark of the system, and it disappears every time a reader checks
  a source.
- **Change:** in both `place` functions, replace the centered `left` with:
  `var col = (a.closest('p, li, dd, td, figcaption') || document.body).getBoundingClientRect(); var lo = Math.max(8, col.left), hi = Math.min(innerWidth - 8, Math.max(col.right, lo + w)); var left = r.left - 24; if (left - lo < 48) left = lo; left = Math.max(lo, Math.min(left, hi - w));`.
  The card starts at its mark, snaps to the paragraph's edge when close, and stays inside the paragraph's box. The vertical
  rule (above, else below) is unchanged. Phones keep the bottom sheet. Proof script: `proof-popover-anchor.js`.
- **Shots:** `pop-cite-hover-1440.png` → `pop-cite-hover-1440-after.png`; `pop-gl-click-1440.png` →
  `pop-gl-click-1440-after.png`; stacked: `pop-cite-hover-1440-before-over-after.png`,
  `pop-gl-click-1440-before-over-after.png`; a mark mid-line: `pop-cite2-hover-1440-before.png` →
  `pop-cite2-hover-1440-after.png`.
- **Risk:** low. In narrow columns such as table cells the card falls back to the window clamp, because `hi` widens to fit it.
- **Touches:** the Suppliers and Export Controls tips (`.ex-tip`) have their own placement and could take the same rule later.
- **Size:** S.

#### P2-5. Search: the site's own clear glyph, the query marked in results, a fade where the list is cut
- **Type:** Fix.
- **Where:** the search modal, every view, light and dark.
- **What is wrong:** the clear button is Chrome's native blue × in light mode and a heavy white × in dark. It is the only
  off-palette glyph on the site. Results never show where the query matched, so for "euv" the reader scans eleven rows to
  see why each one is there. The list's scroll box cuts the last row mid-line ("working on, and it is built to hand them
  over fast. A memory…" sliced through its x-height).
- **Change:** `src/styles.css`, after `.cp-search-panel input`:
  `.cp-search-panel input::-webkit-search-cancel-button { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: url(<12 px × in --muted, 1.4 stroke>) center / 12px no-repeat; cursor: pointer; }`
  (the dark variant takes `#939aa3`, as the magnifier already does). Search.render wraps matches of each query word in
  `<mark>` within the title and snippet, styled `.cp-search-results mark { background: var(--accent-soft); color: var(--ink); padding: 0 1px; }`.
  The list fades its last 28 px when it holds five or more rows:
  `.cp-search-results { mask-image: linear-gradient(#000 calc(100% - 28px), transparent); }`. Proof script:
  `proof-search.js`.
- **Shots:** `search-euv-before-after-light-dark.png` (left before, right after; light above, dark below); singles
  `search-1440-euv-before.png` → `search-1440-euv-after.png`, `search-1440-euv-dark-before.png` →
  `search-1440-euv-dark-after.png`.
- **Risk:** the mask must leave the last row reachable. It fades only the bottom edge of the scroll box, and the last row
  scrolls clear of the fade.
- **Touches:** none.
- **Size:** S.

#### P2-6. Chapter share cards on the center line, like the home card (structural)
- **Type:** Decision.
- **Where:** the 17 chapter cards and 6 view cards in `dist/cards/`, wherever a link unfurls small: chat apps, comment
  threads, square thumbnails.
- **What is wrong:** the cards are laid out for a full 1.91:1 preview, with the title and lede on the left and the specimen
  on the right. At the sizes most people see them, the lede is unreadable, and a square or 1.5:1 center crop cuts the title
  ("graphy", "ory and"). The home card was rebuilt on the center line on 1 Oct for exactly this reason. The chapter cards
  were not. Suppliers and Export Controls also share one globe and read as the same card at thumbnail size
  (`cards-300w.png`).
- **Change:** one card structure for all: the wordmark, eyebrow, title (two lines at most, set to fit the central 630 px),
  the two rating tags and the domain, all centered, over the chapter's specimen drawn faint (about 0.4 opacity) behind them.
  The lede leaves the card, since it is already the og:description. `build/cards.py` takes the layout of
  `build/assets/home-card/card.html` with each chapter's art. A distinct specimen goes on one of the two globe cards.
  Mocks: `mock/card-litho-centerline.html`, `mock/card-hbm-centerline.html`.
- **Shots:** `cards-square-120.png` (all eight sampled cards cropped square today) and `cards-centerline-before-after.png`
  (before and after, each as a 360 px link preview and a 160 px square crop).
- **The other choice:** keep the plate layout and accept the crops. It is the better full-size card, and it fails at every
  smaller size.
- **Risk:** the specimen becomes a ground, no longer a figure. This is a real loss at full size, and the owner should weigh
  it. All 23 cards need a re-render, a `?v=` bump in `build/assets/cards/versions.json`, and a LinkedIn post-inspector
  refresh.
- **Touches:** `build/cards.py`, `build/cards-art.js`, og/twitter tags (version only).
- **Size:** M.

### P3: refinements

#### P3-1. A pressed state, and no rounded gray tap flash
- **Type:** Fix.
- **Where:** every button and tab, phones first.
- **What is wrong:** the eight stylesheets hold 105 `:hover` rules and one `:active` rule (in `walk.css`). A phone has no hover,
  so a tap gives no feedback until the next view paints. iOS meanwhile draws its default translucent gray tap highlight with
  rounded corners, against the ledger's square corners (`-webkit-tap-highlight-color` is never set).
- **Change:** `src/styles.css`, base section:
  `html { -webkit-tap-highlight-color: transparent; } :is(button, [role="button"], summary, .btn, .tabs a):active { background-color: var(--bg-3); }`
  with selectors raised where module rules set `background: none` (for example `.stage .stage-actions button:active`), and
  `:is(.anim-steps button, .gl-term):active { background: none; color: var(--accent); }` for text-only controls.
- **Shots:** `pressed-390-contents-before-vs-after.png` (Contents held down, before and after).
- **Risk:** none.
- **Touches:** module CSS where a control sets its own background.
- **Size:** S.

#### Noted, not proved (no before and after)
- No `<meta name="theme-color">` in `src/template.html` (DOM check). `content="#f7f6f2"`, switched to `#14171c` by the
  theme toggle, would make the phone browser's bar match the paper. Headless Chrome draws no browser bar, so this cannot be
  shown here.
- Search for nonsense ("qzxv") answers "Nothing matches. Nearest terms:" with qualification, IP and ABF, and Enter opens the
  first (`search-1440-none.png`). A distance cutoff, below which only "Nothing matches" and the Try row show, would avoid
  offering arbitrary entries.
- "tsmc" returns five near-identical "China revenue · TSMC FY2021 to FY2025" rows under the firm (`search-1440-tsmc-tab2.png`).
  Grouping them as one row ("China revenue share, FY2021 to FY2025") would leave room for the chapters.
- Dark animations: the video ground decodes a little bluer than the page. The hairline frame hides it, as HANDOFF says.
  Left alone.

#### Checked and left alone
The favicon tile reads at 16 px in a tab strip (`tabs-titles-before-after.png`), and the 180 px touch icon is in place. The
book cover, contents and opener (`pdf/book-1-6.png`) and the chapter PDF's first page (`pdf/litho-p1-90-01.png`) are well
finished: running heads, folios and the stage index all hold. The summary's four pages (`pdf/summary-1-4.png`) are sound,
with a half-empty last page that a colophon set lower would settle. The home walk's progress rail, the term popover's
content and the specimen caption were left alone (the caption by the owner's rule).

## 3. Top five

1. **P2-1 with P1-2, the animation's control row:** a play/pause button in the specimen's own language, steps as a
   proportional timeline, and no badge over the drawing. `anim-litho-1440-paused.png` → `anim-litho-1440-after-paused.png`;
   `anim-litho-390-playing-before-vs-after.png`.
2. **P1-1, reduced motion shows the words that match its still** (one line in `Anim.init`). `anim-litho-390-reduced.png` →
   `anim-litho-390-reduced-after.png`.
3. **P1-4, bookmarks and metadata in the PDFs:** 21 outline entries for the 174-page book, an author, and a creator that is
   not a user-agent string. `pdf/book-outline-before-after.txt`.
4. **P2-2, specimens sway, so the caption stays true:** `spec-litho-idle-before-0-54s.png` →
   `spec-litho-idle-after-sway-0-27s.png`.
5. **P1-3, a 404 in the ledger:** `404-1440-before.png` → `404-1440-after.png`, `404-390-after.png`.

The next two, each a small fix: P2-3 tab titles (`tabs-titles-before-after.png`) and P2-4 popovers that leave the ledger
column clear (`pop-cite-hover-1440-before-over-after.png`).
