# Reader re-test: the curious outsider, second visit

Same tester as `reader-test-learner.md`: an engineer or journalist from outside the chip industry,
arriving from a search for "how are GPUs made", twenty minutes, wanting to be able to explain to a
friend how a GPU gets made and why the chain is fragile.

Tested against the local build at `http://localhost:8765/`, desktop at 1440x900 first, then the
mobile preset at 375x812, then reset. The browser pane was hidden for the whole session, so
`requestAnimationFrame` and `IntersectionObserver` never fired and CSS transitions never advanced.
Two things that first looked like bugs were artifacts of that and are **not** reported as faults:
the Intro specimen appeared frozen on stage 01 during programmatic scrolling (dispatching a `scroll`
event by hand swaps it correctly, 01 to 04 to 08 to 12), and the mobile "Expand" control appeared
not to grow the strip (the CSS rule `.stage[data-collapsed="0"] { height: min(58vh, 480px) }` is
correct; only the 0.25s transition was stalled).

---

## 1. Verdict

The site now answers my question in seven minutes, and last time it could not answer it at all. The
Intro is the change that matters. "START HERE / HOW A GPU IS MADE / One plain paragraph from each
of the seventeen chapters, in the order a chip is made ... 17 PARAGRAPHS / 1,713 WORDS / ABOUT 7
MIN" is exactly the page I wanted on the first visit, and it reads as one explanation rather than
seventeen cards, because the bridges carry the weight. "Nothing in a file computes; the drawing has
to be printed onto something, and that something is a disc of pure silicon." "Coated and still
blank, the wafer goes to the machine that decides how small the circuit can be." "Logic and memory
are still two separate objects, made in different countries, and the next stage exists to close the
distance between them." Fifteen of the seventeen bridges do that work. Three other repairs land as
hard: "IN PLAIN TERMS" now sits above "IN SHORT" and above the chokepoint card, so the sentence
written for me is the first prose I meet in every chapter; 225 glossary buttons now carry dotted
underlines and a hover definition, and the HBM tip ("A stack of eight to sixteen memory chips,
drilled through with copper columns and mounted a few millimetres from the processor") answered my
fourth task in one gesture instead of three clicks and a filter; and search now puts the definition
first for CoWoS, HBM, EUV and photoresist, where last time "CoWoS" returned its own definition last
and "HBM" did not return it at all. The layout faults are gone too: no sideways scroll at 375 or at
1440, a doctype, a nav strip that scrolls on a phone, a specimen strip that takes 16 percent of the
screen instead of 38.

What is left is a single pattern, repeated. The site has written the right sentence and then not
put a route to it. The Intro is the best page and the search index does not contain it: my own
arrival query, "how are GPUs made", returns a 2020 Huawei export-control event first and never the
page headed HOW A GPU IS MADE; "how a gpu is made", the Intro's H1 word for word, returns fourteen
results and none is the Intro. The chokepoint score is now defined, once, in a box with the id
`#howto` that nothing on the site links to, so every reader who arrives at a chapter through search,
through a country panel, or through the Intro sees "5 / 5" in the largest type on the card and still
has no way to learn what it means. The glossary tooltip ends with "Open the glossary →" and the 74
`.gl-entry` elements have no `id`, so the link drops you at the top of an alphabetical list. The
$6,400 build cost lives in chapter 16, while the AI Chips page, the page anyone would open to ask
what a B200 costs, says "PRICE ESTIMATE / not published" and links nowhere. And on a phone, tapping
a country on the new home page changes nothing you can see: the panel renders at y=853 in an 812px
viewport and the page does not scroll. The writing is finished. The wiring between the pieces is
the work that remains.

---

## 2. Task record

| # | Task | What I did | Steps | Result | Friction |
|---|---|---|---|---|---|
| 1 | What is this site, where do I go | Read hero and map head, clicked Netherlands then Japan | 2 clicks, ~20s | Success | "How AI chips are made / Every stage of the supply chain, and who controls it." plus "PICK A COUNTRY" answers both questions fast. Both country clicks were instant and the panels are good: "The Netherlands holds 100% of EUV lithography tools ... named on six of the 17 chokepoint cards." But the two route cards, "Intro / Seven minutes" and "The Chain / Every stage in full", sit at y=1015 on a 900px screen and y=1651 on a phone. Neither is above the fold. The panel repeats "Lithography 5/5" with no legend, and its stat rows use EUV, DUV and ATP unexpanded. |
| 2 | The whole story, fast | Intro tab, read end to end | 1 click, ~7 min | **Success, and the biggest change on the site** | 10,133px, 11.3 screens, 1,713 words. It reads as one connected explanation. Two bridges jar (below). "CHOKEPOINT 5 / 5" appears seventeen times on a page that never defines the scale. "CHAPTER 01" and "STAGE 1 OF 15" always carry the same number and are shown side by side. |
| 3 | What a chokepoint score means, why litho is 5 | Top of The Chain, then `#lithography` | 1 route change | Success from the top of The Chain, failure from anywhere else | The new "HOW TO READ A CHAPTER" box says it plainly: "Chokepoint score. 1 means many substitutes. 5 means a single point of failure, where losing one supplier stops leading-edge production worldwide." Lithography then earns its number: "Lithography scores a 5 because the failure mode is total: if ASML stops shipping, nothing at the leading edge gets printed." But the box has zero inbound links, `.plate-score` is a bare `<span>` with no title and no link, and only 2 of the 16 chokepoint sections open by explaining the score. |
| 4 | What HBM is, from first contact | Met "HBM 82.5%" on the Korea panel, then chapter 10, then hovered the term | 1 hover | Success | The expansion now arrives at character 397 of the chapter, after four uses of the acronym; last time it was character 2,244 after eleven. The hover tip is excellent and works on desktop hover, desktop click and mobile tap. Two gaps: the first *hoverable* HBM in its own chapter is 2,904 characters in, and "Open the glossary →" lands at the top of 74 entries because no entry has an `id`. |
| 5 | B200 build cost and sale price | Search "B200" | 1 search, 2 clicks | Success on the second result | Search returns six results, well ranked. Pressing Enter takes the first, "CHIP Nvidia B200", to the AI Chips page, which says "PRICE ESTIMATE / not published" and offers no route to the cost. The second result gets there: "~$6,400 of manufacturing cost inside a B200 that sells for $30,000 to $40,000. memory alone is $2,900 of it". Note the lowercase "memory" after the full stop. |
| 6 | Who makes photoresist, what happened when it was restricted | Search "photoresist", chapter 3 | 1 search, 1 click | Success | "Japan produced about 90 percent of the world's semiconductor photoresist as of 2021". Then: "In July 2019 Japan put photoresist, hydrogen fluoride and fluorinated polyimide under individual export licences for South Korea ... hydrogen fluoride exports fell 87.9 percent." The two halves are 1,227px apart, down from three screens. But three numbers for one fact: the home map says "Photoresist 75% 2024", the chapter says 90 percent (2021), the Intro says "nine tenths". |
| 7 | Six specimens | Intro 01/04/10, Chain 04/10/11 | 6 loads | Mixed, unchanged from last visit | Captions are complete and honest on desktop, clamped to two or three lines on mobile, all seventeen still open with "Right:", none is labelled, none can be rotated, and none has a fallback. Detail below. |
| 8 | Search "CoWoS", "how a gpu is made", "export controls" | Nine queries plus controls | 9 queries | Much improved, one hole | Detail below. |
| 9 | Mobile repeat of 1, 2 and 4 | 375x812 | ~8 min | 2 and 4 pass, 1 breaks | Detail below. |

### Task 2 in detail: do the bridges connect

Fifteen of seventeen do. The three that carried me furthest:

- 02: "Nothing in a file computes; the drawing has to be printed onto something, and that something is a disc of pure silicon."
- 07: "Every one of those films can land wrong, and wrong is invisible until something goes looking for it."
- 09: "The designers of the chip own none of these machines; they rent time in someone else's building, and that building is a business of its own."

Two jarred:

- 05: "Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate." Every other bridge is a causal step forward in the process. This one turns into a tour guide addressing me, and it also steps backwards: the stencil was already used in stage 4. Rewrite as a consequence, not an instruction: "The machine in stage four is only as good as the plate it copies, and that plate is a separate industry."
- 10: "A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that." First use of "die" anywhere in the Intro, and the Intro has no glossary buttons. Bridge 06 has the same problem with "the fab", which the Intro does not define until stage 09.

### Task 7 in detail: the specimens

| Specimen | Verdict | Does the caption tell me what I am looking at |
|---|---|---|
| Die floorplan (01) | Decorates. A rectangle of tiles. It does not tell me anything the paragraph has not. | No. "Right: the floorplan of a GPU die, one whole reticle field of 26 by 33 mm ... 144 compute tiles fill the centre in eight clusters, the L2 cache splits them in a band across the middle, the high-bandwidth memory interfaces run along the two long edges, and the amber strip on the short edge is the link to the chiplet next door." Eighty words naming eight things, four of which are new words to me, in a picture with no labels. |
| Boule and wafer (02) | **Helps.** The one caption that lands its own image: "a quarter of a tonne of one crystal, hung from a neck the width of a finger." I understood the fragility before I read the paragraph. | Yes. |
| EUV scanner (04) | Helps after work, as last time. The copper light path bouncing between mirrors is the best single picture of why the machine is hard. | Partly. "Tin plasma source at the bottom left, collector and three illuminator mirrors, the mask, or reticle, held pattern-down at the top, six projection mirrors, the wafer stage at the bottom right." That is a set of directions to parts I cannot identify. Four labels on the object would finish it. |
| HBM stack (10) | Still gets in the way. Reads as corrugated sheets on a slant. It does not convey "a cube of memory chips a few millimetres from the processor", which is the sentence the chapter needs me to see. | No. It names through-silicon vias, microbumps and moulding compound, and I could locate none of them. The honest scale note that was in this caption last time ("thicknesses and gaps are exaggerated about fifteen times") is gone; put it back. |
| CoWoS exploded (11) | Distracts. | No, and this is the worst caption on the site for a newcomer: "Right: a CoWoS package pulled apart. A stiffener frame at the top, then two reticle-sized logic dies and eight HBM stacks, microbumps, the silicon interposer with its vertical vias and the wiring that stitches the dies together and fans out to the memory, then the larger solder bumps beneath it and the resin build-up substrate at the bottom." Six terms I do not know, and not one is a glossary button, because the wrapping pass covers body prose only and captions are plain text in a `data-caption` attribute. |
| Globe (17) | Helps. Named towns on a world map is a useful closing image. | Yes. |

Common to all seventeen, unchanged from the first visit: `figure.stage` is `pointer-events: none`
on desktop, so I cannot rotate, zoom or click a part; no specimen script draws a leader-line label;
and if WebGL fails, `data-hidden="1"` sets `display: none` while the chapter still prints
"SPECIMEN: EUV SCANNER" beside nothing. Every caption still begins "Right:", which is now flatly
wrong on a phone, where the object is a strip along the bottom.

### Task 8 in detail: search

The ranking rewrite worked. Definitions come first where a definition is what you want:

- **"CoWoS"** now returns "Glossary CoWoS ..." first. Last visit it was fourteenth.
- **"HBM"** returns the HBM glossary entry first. Last visit it did not return it at all.
- **"euv"** returns "Glossary EUV" then "Glossary High-NA EUV". Last visit it returned Silicon and Wafers.
- **"photoresist"** returns the glossary entry, then the chapter, then the suppliers.
- **"export controls"** and **"export-control"** both return fourteen and both surface "Geopolitics / The US export-control campaign, 2018 to today". The hyphen bug is fixed.
- **"who makes photoresist"** ranks the chapter first and its "Who makes it" section second. Natural language degrades gracefully now.
- Results carry a type label (CHIP, GLOSSARY, EXPORT RULE, EVENT, SUPPLIER), and a miss returns "Nothing matches. The nearest glossary entries:" with three suggestions.

Two problems remain. **The Intro is not in the index.** "how a gpu is made" returns fourteen results
and the Intro is not among them, though that string is the Intro's H1. "how are GPUs made", my real
arrival query, returns a 2020 Huawei FDPR event first. "intro", "start here", "seven minutes" and
"one plain paragraph" all miss it. **Every query still caps at exactly fourteen** with no count and
no "show more", so I cannot tell a two-hit query from a two-hundred-hit one. And "chokepoint score"
returns fourteen chapter sections, no glossary entry for the term, and nothing pointing at the
`#howto` box that defines it.

### Task 9 in detail: mobile

Tasks 2 and 4 pass. The Intro is 14,174px, no sideways scroll, the strip does not cover the text
(`body { padding-bottom: 140px }`), and the HBM tooltip is the best-behaved component on the phone:
355px wide inside a 375px screen, positioned above the bottom strip rather than under it, dismissed
by tapping away or pressing Escape.

The **Contents sheet** is very good. Full screen, focus lands on the close button, all eight
destinations including Methods (which is missing from the desktop masthead), then all seventeen
chapters. Tapping "10 Memory and HBM" closed the sheet, switched route from Intro to The Chain and
landed the chapter title at y=87, just under the 75px masthead. It also lists seventeen scores,
"4 / 5", "5 / 5", "3 / 5", with no legend anywhere on the sheet.

The **bottom specimen strip** is a real improvement in size and a regression in captions. It is
fixed at `bottom: 0`, 128px tall, 16 percent of the screen, against 309px and 38 percent last time.
But the caption is `font-size: 10.5px` with `-webkit-line-clamp: 2` collapsed and `3` expanded,
against captions that run to eight or thirteen lines. Collapsed, the die-floorplan caption shows
28px of 184px and cuts mid-word at "144 compute tiles fill th". Expanded, it shows 43px of 113px.
There is no way to read the rest. The specimen tag also truncates for most chapters: 277px of text
in a 231px cell gives "SPECIMEN 08 · TRANSISTORS AND THE FR…".

Task 1 breaks on mobile. Markers are 18 to 22px across, 30px between the closest pair of centres
(Japan and Taiwan), with China, Korea, Japan, Taiwan, Malaysia and Singapore packed into roughly
70 by 90px against the right bezel; Japan's centre is 13px from the screen edge. Worse, tapping one
does nothing visible. The map ends at y=604, the country chips run to y=839, and the country panel
starts at y=853 in an 812px viewport, so the answer to the tap is entirely off screen and the page
does not scroll. The saving grace is the "PINNED ON THE MAP" chip list, sixteen real buttons at 29px
tall that select the same countries, but it is headed as a legend, not as a control.

The mobile nav is now a horizontally scrollable strip, which is right, but it has no fade, no
shadow and no scrollbar: `scrollWidth` 439 against `clientWidth` 347, so "Glossary" and "Sources"
sit past the right edge with nothing to suggest they exist.

---

## 3. The ten problems that remain, ranked by how much fixing them helps a first-time reader

**1. The Intro, the site's answer to its own headline question, cannot be found by search.** (half a day)

`how a gpu is made` is the H1 of `#/intro`. Searching that phrase returns fourteen results and none
is the Intro. `how are GPUs made` returns a 2020 export-control event first. `start here`, `intro`,
`seven minutes` all miss. A reader who arrives from Google and uses the site's own search is routed
away from the one page written for them.

*Revision:* index the Intro as first-class documents: one for the page (title "How a GPU is made",
dek, the "17 paragraphs / 1,713 words / about 7 min" line) and one per bridge-plus-paragraph, so
`silicon`, `photoresist` and `packaging` can also land in the plain-language version. Score the page
document highest for any query containing "how", "made", "start", "explain" or "overview". While
there, print the result count and raise the cap of fourteen with a "show more".

**2. The chokepoint score is defined once, in a box nothing links to.** (half a day)

`#howto` has an id and zero inbound anchors. `.plate-score` is `<span class="plate-score">` with no
`title`, no `href`, no `aria-describedby`. The Intro shows "CHOKEPOINT n / 5" seventeen times and
never states the scale; the mobile Contents sheet lists seventeen scores with no legend; the country
panels on the home page show "Lithography 5/5" with no legend. Every entry point except scrolling to
the top of a 139,578px page leaves the site's headline number undefined.

*Revision:* the machinery already exists. Make the score badge a `button.gl-term` with
`data-term="chokepoint-score"`, add that glossary entry, and the same tooltip that already explains
HBM will explain the number everywhere it appears, on the Intro, in the sheet and on the map panels.
Link "chokepoint score" in the `#howto` box to the Methods page anchor as well.

**3. Fourteen of sixteen chokepoint sections never say why the score is what it is.** (a day)

Only Lithography ("Lithography scores a 5 because the failure mode is total") and Photomasks ("This
stage scores a 5 for the reason lithography does, on a fraction of the money") do the job. Advanced
Packaging, a 5, opens its chokepoint section with a data table of China's back-end tool share.
Memory and HBM, a 5, opens with GB300 bandwidth figures. Foundries and Fabs, a 5, opens with SEMI
wafer-start forecasts. Transistors and the Front End, a 5, opens "No single machine makes the front
end a chokepoint", which reads to me as a contradiction of its own badge.

*Revision:* fourteen opening sentences of the form "X scores an N because ...", each followed by the
existing material unchanged. Move any chart out of the first position in that section.

**4. On a phone, tapping a country does nothing you can see.** (2 to 3 hours)

The panel renders at y=853 in an 812px viewport and the page does not scroll on select. Markers are
18 to 22px with 30px between Japan and Taiwan, and Japan sits 13px from the right edge.

*Revision:* on narrow screens, move `.sa-panels` directly under `.sa-map` in DOM order so the answer
appears where the eye already is, and call `scrollIntoView({block:'nearest'})` on select as a
backstop. Give each marker a transparent 44px hit circle and nudge the East Asian cluster apart on
the same offshore-leader-line principle the map already uses for crowded coasts. Retitle the chip
list from "PINNED ON THE MAP" to something that reads as a control, for example "Or pick from the
list".

**5. The mobile caption is clamped to two or three lines against captions of eight to thirteen.** (an hour)

Collapsed, the die-floorplan caption shows 28px of 184px and cuts mid-word. Expanded, 43px of 113px.
There is no control that reveals the rest, so most of the writing under every specimen is
unreachable on a phone.

*Revision:* in the `[data-collapsed="0"]` state, drop `-webkit-line-clamp` entirely and let the
caption row scroll inside the strip (`overflow-y: auto`), which the 58vh height affords. Keep the
two-line clamp collapsed. While in that block, drop the word "SPECIMEN" from the mobile tag so the
stage name fits the 231px cell.

**6. Every caption still opens "Right:", and captions carry the densest jargon on the site with no glossary links.** (an hour, plus half a day)

Seventeen of seventeen. On a phone the object is along the bottom. And the CoWoS caption puts
"reticle-sized logic dies", "microbumps", "silicon interposer", "vertical vias" and "resin build-up
substrate" in one sentence, none of them a `gl-term`, because captions are plain text in a
`data-caption` attribute and the wrapping pass runs over body prose only.

*Revision:* strip the prefix and start with the noun, "A CoWoS package pulled apart." Then move
captions to HTML and run the same glossary pass over them. The caption is where an outsider meets
the hardest vocabulary on the site; it is the last place that should be exempt.

**7. The specimens still have no labels, no interaction and no fallback.** (a week)

`figure.stage` is `pointer-events: none` on desktop; no specimen script draws a label; when WebGL
fails, `display: none` leaves the chapter promising "SPECIMEN: EUV SCANNER" beside empty space. The
EUV and HBM captions name parts I cannot find in the picture.

*Revision:* three to five leader-line labels per specimen, positioned in model space so they follow
the rotation, naming exactly the parts the caption names. Drag-to-rotate on the canvas. A static PNG
fallback with `alt` derived from the caption, and hide the "SPECIMEN:" line when the figure is
hidden. Restore the scale-exaggeration sentence to the HBM caption.

**8. The page a reader opens to ask what a B200 costs says "not published" and links nowhere.** (an hour)

AI Chips shows "PRICE ESTIMATE / not published", and pressing Enter on a "B200" search lands exactly
there. The answer, "~$6,400 of manufacturing cost inside a B200 that sells for $30,000 to $40,000",
is in chapter 16.

*Revision:* add a "BUILD COST, ESTIMATED" row to the comparison table linking to
`#component-costs`, and put a line under "PRICE ESTIMATE" reading "No list price. See the bill of
materials in Component Costs." Fix the sentence-case slip in the chokepoint card: "$30,000 to
$40,000. memory alone is $2,900 of it".

**9. No glossary entry has an anchor, so every tooltip's "Open the glossary →" lands at the top of 74 entries.** (an hour)

`.gl-entry` elements carry `data-term` but no `id`.

*Revision:* set `id="gl-<term>"` on each entry, point the tooltip link at it, and give the target a
brief highlight. Failing that, pass the term through the hash and pre-fill the "Filter terms…" box.

**10. Length is advertised on one route and not the other, and two nav tabs are invisible on a phone.** (an hour)

"Intro / Seven minutes: one plain paragraph per stage" against "The Chain / Every stage in full: 17
chapters, every number linked to its source." The Chain is 22,629 words and 98 minutes by the site's
own per-chapter counts, and never says so. Both cards sit below the fold at 1440x900 (y=1015) and on
a phone (y=1651). On mobile the nav strip scrolls with no fade and no scrollbar, hiding "Glossary"
and "Sources"; "Methods" is absent from the desktop nav entirely and appears only in the mobile
Contents sheet.

*Revision:* add "17 chapters, about 100 minutes" to The Chain card. Lift both cards above the map,
or put one line under the dek: "New here? The Intro is the whole chain in seven minutes." Add a
right-edge mask to the mobile nav strip and scroll the current tab into view on load. Add Methods to
the desktop nav.

### Smaller things worth a sweep

- Photoresist is 75 percent (2024) on the home map, "about 90 percent" (2021) in the chapter, and
  "nine tenths" in the Intro. Pick one headline figure and let the others be the sourced detail.
- Bridge 05, "Look next at the stencil itself", breaks the voice of the other sixteen.
- The Intro uses "die" (bridge 10) and "the fab" (bridge 06) before either is introduced, on the one
  page that has no glossary buttons.
- "CHAPTER 01" and "STAGE 1 OF 15" always carry the same number and are printed side by side. Drop
  one.
- The glossary tooltip does not close or reposition on scroll; it stays at the same viewport
  position over unrelated text.
- The Contents sheet does not lock body scroll.
- `button.gl-term` has no `aria-describedby` or `aria-expanded`, so the tooltip is invisible to a
  screen reader.
- All seventeen Intro links read "Read the chapter", and there is no way back to the Intro from a
  chapter.

---

## 4. What improved, and must not regress

**1. The Intro exists, and it is the site.** Seventeen plain paragraphs in process order with bridge
sentences between them, a stated length before you start, and a "Read the chapter" link out of every
step that lands correctly on The Chain. This is the page that turns a reference work into something
a curious outsider can finish. Protect its length and its plainness above everything else on the
site.

**2. "IN PLAIN TERMS" comes first.** The order in every chapter is now title, dek, word count, then
the plain paragraph, then "IN SHORT", then the chokepoint card. On lithography that means
"Lithography prints the pattern of a circuit onto the wafer: the machine holds a stencil of one
layer up to a lamp and projects it, four times smaller, onto the silicon" is the first prose I read
rather than the fourth block. In Memory and HBM the acronym is expanded at character 397 after four
uses; it was character 2,244 after eleven.

**3. The glossary hover.** 225 term buttons across 55 distinct terms, dotted underline in body
colour with `cursor: help`, working on hover, on click and on tap, positioned inside the viewport at
375px and clear of the bottom strip, dismissed by Escape or by tapping away. "HBM: A stack of eight
to sixteen memory chips, drilled through with copper columns and mounted a few millimetres from the
processor so data reaches the arithmetic units far faster than it could across a motherboard." That
one tooltip replaced three clicks and a filter from the last visit.

**4. Search ranking.** Definitions first for CoWoS, HBM, EUV and photoresist; hyphen and
natural-language normalisation; typed result labels; and a graceful miss that offers the nearest
glossary entries instead of "Nothing matches."

**5. "HOW TO READ A CHAPTER".** Concentration, chokepoint score and substitution time, each in one
sentence, with "It is the most opinionated number on the card" said out loud about the estimate.
Keep the box. Give it inbound links.

**6. The layout faults are gone.** `document.body.scrollWidth` is 375 at 375 and 1440 at 1440.
`document.compatMode` is `CSS1Compat`. The mobile masthead fits with the search and theme controls
reachable. The specimen strip is 16 percent of the phone screen, not 38, and `body` carries 140px of
bottom padding so nothing hides under it. Dark mode works on both routes.

**7. The mobile Contents sheet.** Full screen, focus on the close control, all eight destinations
plus all seventeen chapters, closes and routes correctly across views.

**8. Honest blanks.** The AI Chips comparison now says "area not published" and "not published"
where it used to print an em dash. That is the right instinct and it should stay.
