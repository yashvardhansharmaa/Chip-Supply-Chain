# Reader test: the curious outsider

Tester persona: an engineer or journalist from outside the chip industry. Knows what a GPU and a
transistor are. Has never heard of EUV, CoWoS, HBM or a photomask. Arrived from a search for
"how are GPUs made". Budget: twenty minutes. Goal: be able to explain to a friend how a GPU gets
made and why the supply chain is fragile.

Tested against the local build at `http://localhost:8765/`, desktop at 1440x900 first, then the
mobile preset at 375x812. The build was rebuilt at 12:40 during the session and the hero headline
changed from "Fifteen stages. Seven chokepoints." to "How AI chips are made". Every finding below
was re-checked against the 12:40 build.

The browser pane was hidden for most of the session, so scrolling and hovering could not be driven
directly. Navigation, layout, search and measurement were tested through the DOM and through the
site's own `?only=<chapter-id>` debug flag, which renders a single chapter at the top of the page.

---

## 1. Verdict

I got what I came for, and it took longer than it should have. Twenty minutes in, I can tell my
friend that sand becomes a crystal that becomes a 300 mm disc, that one Dutch machine prints the
circuit with light so short it has to travel in a vacuum and bounce off mirrors, that a Korean firm
stacks twelve memory chips into a cube and drills copper straight down through them, that only TSMC
can glue the logic and the memory onto one slab of silicon, and that the whole thing costs about
$6,400 to build and sells for $30,000 to $40,000. That is a good haul. The writing is the reason.
"Lithography is photographic printing, shrunk." "Photoresist is photographic film for chips."
"A cook can chop faster than anyone can fetch the ingredients, so the answer is a wider door."
Those sentences are the best teaching on the internet for this subject, and they are all sitting
in a box labelled IN PLAIN TERMS that the page shows me fourth, after a dek, a paragraph of
acronyms and a data card the size of a tax form.

What would have made me leave is the vocabulary and the geometry of the page. In the first screen
I meet "reticle-sized logic dies", "silicon interposer", "build-up substrate" and "HBM" in a single
caption, and not one of them is a link. The site has a genuinely excellent glossary, 74 entries in
plain language, and nothing in the body text ever points at it. I counted: 177 in-page links, zero
of them to a definition, and zero `<abbr>` tags. So the only way to look up CoWoS is to notice the
word "Glossary" among nine nav tabs, leave a 124,000-pixel page, find the term, and scroll back to
where I was. On my phone it is worse: the page is 912 pixels wide on a 375 pixel screen, so
Glossary, Sources and the search button are all off the right edge, and the 3D object is pinned
across the top 38% of the screen with its caption cut off mid-sentence. I would have bounced. The
second thing that nearly lost me is that the site keeps telling me a number, "5 / 5", in the
largest type on every chapter card, and only chapter 1 ever says what the number means.

---

## 2. Task record

| # | Task | Where I started | What I did | Steps | Result | Friction |
|---|---|---|---|---|---|---|
| 1 | What is this site, is it for me | Landing page | Read hero, masthead, chain chart, contents | 0 clicks, ~10s | Success | "How AI chips are made / Every stage of the supply chain, and who controls it." answers it. But 6 of the 15 chart labels are jargon to me: LITHO, MASKS, DEP / ETCH, METROLOGY, SUBSTRATE, FRONT END. "Bar height is the chokepoint score, 1 to 5" names a score it never defines. No reading time, no start-here, no link to the Summary. |
| 2 | The whole story, fast | Landing page | Clicked "Summary" in the nav | 1 click, ~4 min to skim | Partial | The Summary exists and is good, but it is a summary of *who owns what*, not of *how a GPU is made*. Card 05 tells me ASML shipped 48 EUV scanners; it never says lithography prints the circuit. The actual process narrative is one paragraph, "The chain in one paragraph", buried inside chapter 1. The full stack is 124,353 px, about 138 desktop screens and 88 minutes of chapter word counts. Nothing on the site says that. |
| 3 | What a chokepoint score means, why litho is 5 | Chapter 5 nameplate | Read badge, hunted, found chapter 1 "How to read this site", returned, scrolled to "The chokepoint" | 2 route changes + ~6,000 px of scrolling | Success, slowly | The badge "5 / 5" and its label "Chokepoint score 5 of 5" are not a link and have no tooltip. The definition lives only in chapter 1: "A 1 means many substitutes. A 5 means a single point of failure." The glossary defines "chokepoint" but has no entry for "chokepoint score". The answer, "Lithography scores a 5 because the failure mode is total and substitution takes decades", sits 9,814 characters into the chapter. Only 2 of the 17 "The chokepoint" sections state why the number is what it is. |
| 4 | What HBM is and why it matters | Hero caption, first screen | Read caption, no link, opened Glossary from nav, filtered, read entry, then opened chapter 11 | 3 clicks + a filter | Success via the glossary | First contact is "eight HBM stacks on a silicon interposer, on a build-up substrate", four unknown terms, no link. In chapter 11 the words "High bandwidth memory" first appear 2,244 characters in, after the title, dek, IN SHORT and the whole nameplate have used the acronym eleven times. The glossary entry is excellent and I found it only because I went looking. |
| 5 | B200 build cost and sale price | Search (Ctrl+K) | Typed "B200", took the third result | 1 search, 1 click | Success | "Building a Blackwell B200 costs about $6,400. Nvidia sells it for $30,000 to $40,000." Plus a full bill of materials table. Best page on the site for me. But it is chapter 17 of 18, and the "AI Chips" page, where a reader would look first, has no cost at all and shows "DIE AREA —" and "PACKAGE SIZE —" for the flagship part. |
| 6 | Who makes photoresist, what happened when it was restricted | Search "photoresist" | Second result, chapter 4, then read "Who makes it" and "The chokepoint" | 1 search, 1 click, ~2 screens | Success | "Japan produced about 90 percent of the world's semiconductor photoresist as of 2021." Then: "In July 2019 Japan put photoresist, hydrogen fluoride and fluorinated polyimide under individual export licences for South Korea... hydrogen fluoride exports fell 87.9 percent." Clear, sourced, well told. The two halves of the answer are three screens apart with company financials in between. |
| 7 | Three 3D specimens | Chapters 1, 5, 11 | Rendered each with `?only=` | 3 loads | Mixed, see below | |
| 8 | Search "CoWoS" and "export controls" | Ctrl+K | Two queries, plus seven control queries | 9 queries | Partial | See below. |
| 9 | Mobile repeat of 2 and 4 | 375x812 | Reloaded, measured layout, repeated both | ~10 min | Task 2 works, task 4 breaks | See below. |

### Task 7 in detail: the specimens

| Specimen | Verdict | Did the caption tell me what I was looking at |
|---|---|---|
| Wafer (ch. 1) | **Helped.** A stippled disc ruled into rectangles with one cell in amber. It made "one disc, many chips, one printed field" obvious before I read a word. | Yes. "a polished 300 mm wafer, its 57 whole exposure fields ruled by scribe streets, the orientation notch drawn six times life size and one field in amber." I did not know "scribe streets" or "exposure fields", but the amber cell plus "one field in amber" carried it. |
| EUV scanner (ch. 5) | **Helped after work.** The copper light path zig-zagging between mirror discs is the single best picture of why this machine is hard. But nothing is labelled and the renderer draws no occlusion, so everything shows through everything; I could not tell the three illuminator mirrors from the six projection mirrors. | Partly. "Tin plasma source at the bottom left, collector and three illuminator mirrors, the reticle held pattern-down at the top, six projection mirrors, the wafer stage at the bottom right." That is a set of directions to parts I cannot identify. Four labels on the object would have finished the job. |
| HBM stack (ch. 11) | **Got in the way.** It reads as a stack of corrugated sheets on a slant. The "exploded" separation is not legible, and the one thing I could pick out was the amber base. It does not convey "a cube of memory chips a few millimetres from the processor", which is exactly what the chapter needs me to see. | No. The caption names "through-silicon vias running the full height of the cube, microbumps between every layer, and the molding compound as a faint box", and I could locate none of them. |

Common to all three: the object is a fixed panel with `pointer-events: none`, so I cannot rotate it,
zoom it, or click a part. It rotates with the scroll and that is all. The captions are 11.5 px muted
monospace, up to 55 words, centred under a 605 px canvas. And 17 of the 19 captions begin with the
word "Right:", which is wrong on any screen under 900 px, where the object sits above the text.

Credit where it is due: the captions state their own exaggerations. "Footprint is to scale;
thicknesses and gaps are exaggerated about fifteen times, because the real cube is only 0.72 mm
tall." That is honest and rare.

### Task 8 in detail: search

Search opens on Ctrl+K, `/` and the toolbar button, and it indexes chapters, glossary, suppliers,
chips, events and control thresholds. That breadth is a real asset. The ranking is not.

- **"CoWoS"** returned 14 results. The glossary definition, the only result that answers "what is
  this", was **last**. The first was a passing mention in "Introduction and Goals". The panel says
  "Enter opens the first result", so pressing Enter takes a confused reader to the wrong place.
- **"export controls"** returned 12 results across chapters, glossary, suppliers, two `EVENT`
  records and three `CONTROL` records. Genuinely useful. But it never surfaced chapter 18's section
  "The US export-control campaign, 2018 to today", because that heading is hyphenated and the
  matcher is a literal substring test. Searching **"export-control"** returns 2 results; searching
  **"export control"** returns 14. Same intent, different worlds.
- **"HBM"** returned 14 results and the HBM glossary entry was not among them. The "Memory and HBM"
  chapter appeared eleventh.
- **"euv"** returned "Silicon and Wafers, Key evaluation criteria" first. Neither the Lithography
  chapter nor the EUV glossary entry made the top three.
- **"how is a gpu made"**, the query that brought me to the site, returns **"Nothing matches."**

The cause is one line: results are filtered with `terms.every(t => hay.indexOf(t) >= 0)` and then
`.slice(0, 14)` in index order. No scoring, no title weighting, no result count, no "N more".

### Task 9 in detail: mobile

Task 2 survives. The Summary page is 11,292 px on a phone, about 14 screens, the 3D stage hides
itself on that route, and the page does not overflow. It is the best mobile experience on the site.

Task 4 breaks, and so does the whole stack page.

- **The page is 912 px wide on a 375 px screen.** `document.body.scrollWidth` is 912 on The Stack
  and 559 on Geopolitics. The cause is the `.sr-only` data tables under every chart:
  `.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0) }`
  is the correct recipe for a `div`, but a `<table>` ignores `width: 1px` and sizes to its content,
  so each hidden table lays out at up to 875 px and extends the scroll area. I verified the fix
  live: adding `left: -10000px; top: auto` to `.sr-only` collapses the page from 912 to 375. The
  same bug costs 75 px of sideways scroll on a 1440 px desktop (1515 vs 1440).
- **Consequence:** the fixed masthead is 912 px wide, so on a phone "Exposure", "Glossary",
  "Sources", the search button and the theme toggle all sit off the right edge. A reader who meets
  "HBM" on a phone cannot reach either the glossary or search without discovering that the page
  scrolls sideways.
- **The specimen eats the screen and the caption is cut in half.** At 375x812 the stage is sticky,
  309 px tall, 38% of the viewport, undismissable. The caption is `font-size: 10px` with
  `-webkit-line-clamp: 2`; measured `scrollHeight` 52 against `clientHeight` 26. Exactly half of
  every caption is unreadable, with no expand control. The hero caption truncates before
  "Highlighted: the HBM", which is the sentence that explains the orange part.
- The sticky progress rail is `display: none` under 900 px, so the only place-keeping left is the
  per-chapter "YOU ARE HERE: MEMORY AND HBM, STAGE 10 OF 15" strip.
- If the `.sr-only` overflow is fixed, a second bug is exposed: the nav then wraps to two rows and
  the masthead grows to 109 px, while `--masthead` stays 52 px, so the sticky stage and the content
  padding both slide under the header. The mobile nav needs a real solution, not just the overflow
  fix.

---

## 3. The ten problems, ranked by how much fixing them helps a first-time reader

**1. No word in the body text links to the glossary.** (a day)

The glossary is the best asset on the site and it is invisible from where a reader needs it. Zero
of 177 in-page anchors point at a definition; there are no `<abbr>` tags and no tooltips. Meanwhile
a reader meets "reticle-sized logic dies", "silicon interposer" and "HBM" in the first caption.

*Revision:* build a term-to-anchor map from the 74 glossary entries and, at build time, wrap the
**first** occurrence of each term in each chapter in a dotted-underline `<button>` that opens a
small popover with the entry's one-line definition and a "full entry" link. First occurrence only,
so the prose does not turn blue. Ship the map as data so the glossary stays the single source.

**2. Every chapter shows its plain-English paragraph fourth.** (a day)

The order today is chapter title, dek, "IN SHORT" (the most acronym-dense paragraph on the page),
the chokepoint nameplate (a data card with six fields, five firms and five countries), and only
then "IN PLAIN TERMS". On lithography that puts "Lithography is photographic printing, shrunk"
about 2,000 characters and a full screen below the fold. A newcomer has to survive the two hardest
blocks to reach the one written for them.

*Revision:* move "IN PLAIN TERMS" directly under the dek, above "IN SHORT" and the nameplate.
Nothing else changes. Give it the visual weight "IN SHORT" has now. This is the single cheapest
change with the largest effect on comprehension.

**3. Nothing on the landing page offers a path, a length, or a fast route.** (an hour)

The landing page is the hero, the scored chain, a contents list, and then 124,000 pixels of
chapters. There is no in-page link to the Summary anywhere outside the nav tab. The site knows its
own reading times, 4 to 6 minutes per chapter, 88 minutes in total, and never states the sum.

*Revision:* under the dek, add three routes with times attached. "The whole chain in 8 minutes"
linking to the Summary. "Start at the beginning, about 90 minutes" linking to chapter 1. "Jump to a
stage" linking to the contents. Then put a plain-language legend under the chain chart: "Score 5
means one supplier. Lose them and leading-edge production stops."

**4. Search ranks by document order and caps at 14.** (a day)

A definition query returns the definition last. "HBM" does not return the HBM glossary entry at
all. "euv" returns Silicon and Wafers first. "export-control" and "export control" return 2 and 14
results. "how is a gpu made" returns "Nothing matches."

*Revision:* score each hit instead of filtering: exact glossary term match highest, then chapter
title, then heading, then body, and break ties on term frequency. Normalise hyphens and plurals in
both the query and the index. Group results under "Definitions", "Chapters", "Firms", "Events",
"Rules". Show the total count and raise the cap to 40 with a "show more". Add a small stop-word
list so natural-language queries degrade to their content words rather than to nothing.

**5. The page scrolls sideways, on every screen size.** (an hour)

`body.scrollWidth` is 912 at 375 px and 1515 at 1440 px, caused by the `.sr-only` tables under
every chart. On a phone this pushes the Glossary tab and the search button off the right edge.

*Revision:* change `.sr-only` to `position: absolute; left: -10000px; top: auto; width: 1px;
height: 1px; overflow: hidden;` (verified live: 912 becomes 375), or wrap each accessible table in
an `.sr-only` `div` and leave the table alone. While in the same file: the served HTML has no
`<!DOCTYPE html>`, so both the local build and the GitHub Pages copy render in quirks mode
(`document.compatMode` is `BackCompat`). Add the doctype.

**6. The mobile specimen takes 38% of the screen and shows half its caption.** (an hour)

309 px of undismissable, uninteractive 3D above the text, with the caption clamped to two lines at
10 px, cut mid-sentence. And 17 of 19 captions begin "Right:", which is wrong wherever the object
is on top.

*Revision:* drop the leading "Right: " from all captions and start with the noun, "A 12-high HBM
stack, exploded." Cut the mobile stage to about 24 vh, raise the caption to 12 px, replace the
two-line clamp with a three-line clamp plus a "more" toggle, and add a small collapse control that
remembers its state so a reader can hide the object and read.

**7. The chokepoint score is the site's headline number and is undefined where it appears.** (a day)

"5 / 5" is the largest thing on every chapter card. The definition exists only inside chapter 1's
"How to read this site". The glossary has "chokepoint" but no "chokepoint score". Only two of the
seventeen "The chokepoint" sections say why the number is what it is. Chapter 11, also a 5, opens
that section with GB300 bandwidth specs and never returns to the score.

*Revision:* make the badge a link to a short popover with the one-line scale, and add a "chokepoint
score" glossary entry. Then hold every chapter to the pattern lithography already uses: open "The
chokepoint" with one sentence of the form "X scores a N because ...". Fifteen sentences to write.

**8. The Summary answers "who owns it", not "how it is made".** (a day)

For a reader whose question is the process, the fast path skips the process. Card 07 says
"Deposition and etch are the volume business of a fab: over a thousand steps per wafer" without
saying what deposition is. The cards also carry unexplained CoWoS, ALD, gate-all-around, backside
power, interposer, hybrid bonding and actinic inspection.

*Revision:* give each Summary card a one-sentence process line above the conclusions, drawn from
the chapter's "IN PLAIN TERMS". Put "The chain in one paragraph" at the top of the Summary page
rather than inside chapter 1. Both are edits to existing prose, not new writing.

**9. The specimens have no labels, no scale reference and no interaction.** (a week)

They are point clouds rendered with the depth test off, in a `pointer-events: none` panel. On the
EUV scanner and the HBM stack the caption names parts that a newcomer cannot find in the picture.

*Revision:* add three to five leader-line labels per specimen, positioned in model space so they
follow the rotation, naming exactly the parts the caption names: source, reticle, wafer, mirrors;
base die, DRAM die, through-silicon via, molding compound. Add a human-scale reference where one
helps, such as a fingertip outline beside the HBM cube. If interaction is affordable, drag-to-rotate
on the canvas. And give the figure a fallback: today, if WebGL fails, `.stage[data-hidden="1"]` sets
`display: none` and the chapter still promises "SPECIMEN: EUV SCANNER" with nothing beside it. Ship
a static PNG fallback and an `alt` derived from the caption.

**10. Three numbering systems run at once.** (an hour)

A single chapter header shows "CHAPTER 11", "STAGE 10 OF 15" and a rail cell numbered 11, and the
next-chapter line says "NEXT: 12 ADVANCED PACKAGING". Chapter 1's dek says "Eighteen stages" while
every chapter badge says "of 15". I spent real attention reconciling these instead of reading.

*Revision:* pick one. Number the process stages 1 to 15 and stop showing chapter numbers in the
rail, or number chapters 1 to 18 and drop "stage n of 15". Fix "Eighteen stages" in the chapter 1
dek to match whichever survives.

---

## 4. Five things that worked, and must not change

**1. The glossary.** Seventy-four entries, each a plain-language definition, then a line on why it
matters, then a link to the chapter. "EUV: chipmaking light at a wavelength of 13.5 nanometres,
made by dropping molten tin into a vacuum and hitting it with a laser 100,000 times a second to
create a plasma hotter than the surface of the sun." That is how you write for someone who does not
already know. The filter box on the page works. The only problem with the glossary is that the rest
of the site does not point at it.

**2. The "IN PLAIN TERMS" analogies.** "A cook can chop faster than anyone can fetch the
ingredients, so the answer is a wider door." "Photoresist is photographic film for chips."
"Designing a chip is like drawing the street plan of a city of billions of buildings, where every
road has to be walkable in less than a billionth of a second." Every one of these landed. They are
the reason the site works at all for an outsider. Move them up the page; do not touch the words.

**3. The sourcing.** Every number carries a `<sup class="cite">` linking straight to the primary
document, an ASML annual report PDF, an Ajinomoto investor deck, a CSET paper, with the domain in
the title attribute. Forty-five citations in the lithography chapter alone. I checked several and
they resolve. This is better than most journalism and it is why I believed the numbers I am about
to repeat to my friend.

**4. The chokepoint nameplate as a repeated shape.** Concentration, time to substitute, cost
signal, who leads, where it is made, why substitution is slow, then China's position and America's.
Once I had read two of them I could read the rest at a glance, and I could compare stages without
re-reading. The per-chapter "YOU ARE HERE: LITHOGRAPHY, STAGE 4 OF 15 / NEXT: 06 PHOTOMASKS AND
PELLICLES" strip is the same virtue: I always knew where I was in the chain.

**5. Chapter 17, Component Costs.** "Building a Blackwell B200 costs about $6,400. Nvidia sells it
for $30,000 to $40,000." Then a bill of materials with ranges, then an honest note that the model is
a distribution and that "Nothing of that quality exists for the H100 or Rubin, so the table carries
one generation only." This chapter made the whole supply chain concrete in about four minutes, and
the car analogy above it ("The engine is the famous part, but the battery, the gearbox and the
assembly line are what the bill is made of") is the sentence I will actually repeat. Consider
promoting it: it is currently chapter 17 of 18, and it is the best on-ramp on the site.
