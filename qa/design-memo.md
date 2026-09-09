# CHOKEPOINTS — design memo

Design research pass, September 2026. Screenshots referenced below are in `qa/design-refs/`.

## 1. Where the design is now

The identity works. Wafer-grey ground, graphite ink and the amber litho-bay accent read as a specific place rather than a palette, and the fixed point-cloud specimen is the thing nobody else has (`00-current-hero-desktop.png`). The problems are hierarchy and the phone, not taste.

**The type does too few jobs with one face.** Archivo sets the nameplate, the chapter number, the chapter title, every section heading, the figure titles, the KPI numbers and the picker buttons. Because it is the same voice at every level, headings read as small posters rather than as steps in a hierarchy. `.prose h4` is 19px, exactly body size, so the fourth level has no visible step at all (`08-current-figure-and-prose-desktop.png`).

**The chapter number is decoration, not wayfinding.** At `--bg-3` it is barely visible in light mode and effectively invisible in dark (`01-current-chapter-head-lithography-desktop.png`, `09-current-chapter-head-dark.png`). It overlaps the title without a defined relationship, so it reads as an artefact.

**Figures are cramped and the citations are loose.** Figures inherit the 66ch prose measure, which leaves a three-bar chart sitting in a 620px box with a grey track rectangle behind each bar — a box inside a box. Citation superscripts float away from the word and land before the full stop: "for 2026 ¹ ." (`08-current-figure-and-prose-desktop.png`).

**Pages without a specimen have a dead right quarter.** Briefing, Suppliers and Glossary hide the stage but keep `min(100%, 1180px)`, so at 1440px roughly 260px of ground sits empty next to a cramped three-column card grid (`02-current-briefing-desktop.png`, `07-current-glossary-desktop.png`).

**The phone is the weak build.** The h1 overflows the viewport — "CHOKEPOINTS" is clipped mid-S at 390px — the specimen canvas and its caption both run off the right edge, and the tab strip scrolls horizontally with no affordance, so Suppliers, Geopolitics, Glossary, Sources, search and the theme toggle are unreachable (`04-current-hero-mobile-390.png`, `05-current-chapter-mobile-390.png`).

## 2. References

**Epoch AI** (`ref-03-epoch-ai-home.png`) is the closest peer and the most useful. Its hero is a plain two-line sans headline followed immediately by three stat cards: a large number with a unit, one sentence of explanation, and a footer carrying a category dot and a 90% confidence interval. The hero does not claim, it shows, and the CI in the card footer is the credibility move. Borrow the structure. Avoid the mint-green CTA and the logo wall.

**Distill** (`ref-07-distill-article.png`) is the model for the chapter head: the explanatory diagram sits full-width above the byline, then a strict four-column metadata band (AUTHORS / AFFILIATIONS / PUBLISHED / DOI) in small mono-ish labels, then the reading column with a persistent contents rail to its left, separated by a hairline. Borrow the metadata band and the visible, always-legible contents rail. Avoid the pale blue links.

**CSET** (`ref-05-cset-report-page.png`) puts authors, publication date and topics in a left sidebar beside a generous ~66ch column. Borrow the sidebar-as-provenance idea for chapter sources. Avoid the coloured slab in the header, which does no work, and the download-the-PDF-first framing.

**The Pudding** (`ref-01-the-pudding-home.png`) indexes stories with a mono badge (#224), a month, a full-bleed thumbnail that is the *actual chart* rather than an illustration, then a heavy display title and one dek line. Borrow "the thumbnail is the real graphic" for the Briefing cards. Avoid the hand-drawn wordmark and the emoji-ish nav.

**Stripe Press** (`ref-02-stripe-press-home.png`) is one object, centred, on a near-black ground, with the entire nav collapsed to a hairline of tick marks at the left edge. Borrow the confidence to give the hero a single object and almost no chrome. Avoid the near-total absence of information — CHOKEPOINTS readers need numbers on the first screen.

**Our World in Data** and **Works in Progress** (`ref-06-our-world-in-data-grapher.png`, `ref-04-works-in-progress-home.png`) contribute one idea each: a chart that carries its own title, source and download controls as part of the figure frame, and a coloured caption slab that overlaps the image so the words and the picture are one unit. **SemiAnalysis** (`ref-08-semianalysis-home.png`) is the domain peer and the counter-example: AI-generated illustrations as decoration and identical amber "Read More" pills give a page with almost no information density. Bloomberg Graphics was behind a bot check, so it was not captured; Distill and Our World in Data stand in.

**Dribbble.** The `landing-page-hero` crop is overwhelmingly SaaS and mostly not usable. Four shots carry a transferable idea. `dribbble-05-editorial-awwwards-sotd.png` puts heavy condensed uppercase over black and then, directly beneath it, a real colour-coded timeline chart — the hero's second element is data, not ornament. `dribbble-08-editorial-website-concept.png` uses large lining figures (01 / 02 / 03) as section markers at the left edge of an asymmetric grid with a small metadata block beside each; that is exactly the fix for our chapter number. `dribbble-02-vintage-product-hero.png` sets three numbered three-line micro-columns under the headline separated by thin rules — a compact way to put facts under a hero. `dribbble-10-catalyst-venture-editorial.png` and `dribbble-11-petri-dish-editorial.png` show scroll-driven type transitions worth stealing at low amplitude. Avoid the rest: `dribbble-01`, `-03`, `-04`, `-06`, `-07`, `-09`, `-12` are glass cards, product mockups, gradient skies and stock-photo collage, all of which would make a research site look like it is selling something.

## 3. Three typographic pairings

All faces are on Google Fonts.

### A. "Nameplate" — Archivo + Newsreader + IBM Plex Mono

Keeps the condensed nameplate and takes section headings *off* Archivo so the condensed voice is reserved for names and numbers.

| Role | Face | Size / weight |
|---|---|---|
| h1 nameplate | Archivo, wdth 62 | 104px / 0.90, wght 900, uppercase, +0.01em |
| chapter number | Archivo, wdth 62 | 128px / 0.85, wght 900, tabular |
| chapter title | Archivo, wdth 80 | 52px / 1.02, wght 800 |
| section heading | Newsreader | 28px / 1.2, wght 600 |
| body | Newsreader, opsz auto | 19px / 1.62, wght 400 |
| labels | IBM Plex Mono | 11.5px, wght 450, +0.08em, uppercase |

Character: an equipment nameplate bolted to the door of a reading room.
Fails: Archivo at wdth 62 loses letter differentiation below about 28px, so it can never be used small; Newsreader's italic is calligraphic enough to look ornamental beside the mono; Plex Mono's slashed zero reads busy in a 220-row table.

### B. "Clean Room" — Inter Tight + IBM Plex Sans + IBM Plex Mono

The deliberate departure from serif body.

| Role | Face | Size / weight |
|---|---|---|
| h1 nameplate | Inter Tight | 100px / 0.92, wght 900, uppercase, -0.02em |
| chapter number | Inter Tight | 120px / 0.85, wght 800, tabular |
| chapter title | Inter Tight | 48px / 1.05, wght 700 |
| section heading | IBM Plex Sans | 26px / 1.25, wght 600 |
| body | IBM Plex Sans | 18.5px / 1.65, wght 400 |
| labels | IBM Plex Mono | 11.5px, wght 500, +0.08em, uppercase |

Character: a well-set technical standard rather than a magazine.
Fails: long-form readability suffers most here — 1,300-word chapters lose the "settle in" signal a serif gives; without a width axis the nameplate cannot be condensed, so CHOKEPOINTS becomes a generic heavy grotesque; and mono-against-sans is a much smaller jump than mono-against-serif, so the label layer stops separating from the text.

### C. "Bench Notes" — Fraunces + Literata + JetBrains Mono

A serif nameplate, which trades the industrial register for a monograph one.

| Role | Face | Size / weight |
|---|---|---|
| h1 nameplate | Fraunces, opsz 144, WONK 0 | 96px / 0.95, wght 900 |
| chapter number | Fraunces, opsz 144 | 124px / 0.88, wght 700, tabular |
| chapter title | Fraunces, opsz 72 | 50px / 1.05, wght 700 |
| section heading | Literata | 27px / 1.25, wght 600 |
| body | Literata, opsz auto | 19px / 1.6, wght 400 |
| labels | JetBrains Mono | 11.5px, wght 500, +0.08em, uppercase |

Character: a research monograph that happens to be on the web.
Fails: Fraunces at display size needs its optical-size and SOFT axes tuned or it goes blobby; a serif nameplate loses the stamped-on-a-machine quality that justifies the amber accent; and Literata's default proportional figures mean every table, KPI and spec row needs an explicit `font-variant-numeric: tabular-nums`.

**Recommendation: A.** The condensed nameplate is the one piece of the identity already doing real work — it is why the site does not look like the SaaS heroes in the Dribbble crop — and spending it buys nothing. The actual typographic fault is that Archivo also sets every section heading, which flattens the ramp; reassigning h3/h4 to the reading face fixes it without touching the identity. If only one change is affordable, change the heading assignment and the size ramp, not the body face: Source Serif 4 is competent, and Newsreader is an improvement rather than a rescue.

## 4. Hero compositions

The specimen holds the right 42%. All three keep it there.

### H1 — "Nameplate over the fold" (lowest risk)

```
── A DEEP DIVE ON THE AI CHIP SUPPLY CHAIN   │  SPECIMEN 00 · THE WHOLE CHIP
                                             │
C H O K E P O I N T S                        │        ◤ package ◢
                                             │       (point cloud)
Every AI chip is a supply chain...           │
                                             │
┌───────┬─────────┬─────────┬────────┐       │
│ 1     │ 3       │ 92%     │ 10+ yr │       │
│ firm  │ firms   │ of <7nm │ to     │       │
│ EUV   │ HBM     │ Taiwan  │ replace│       │
└───────┴─────────┴─────────┴────────┘       │      caption
↓ SCROLL   ·  18 chapters · 379 sources      │
```

First sentence: "Every AI chip is a supply chain, and at four points in it there is exactly one supplier."
What moves: the four figures count up once on load, staggered 60ms, over 400ms; the amber rule under the eyebrow draws left to right; the specimen holds still until first scroll. Nothing loops.

### H2 — "Cold open" (highest impact)

```
CHOKEPOINTS · the AI chip supply chain       │
                                             │
1                                            │   EUV scanner
─────────────────────────────────            │   (cross-section)
company on Earth builds the machine          │
that prints every leading-edge AI chip.      │
There are sixteen more stages like it.       │
                                             │
[ START AT STAGE 01 ]  [ READ THE BRIEFING ] │   caption
```

First sentence: "One company on Earth builds the machine that prints every leading-edge AI chip."
What moves: the numeral is set at ~240px; on scroll it shrinks and docks into the progress rail as the chapter counter, so the hero becomes the navigation. The specimen is the EUV scanner, not the package, which makes the claim and the picture the same object.

### H3 — "The chain as a strip"

```
── CHOKEPOINTS                               │  SPECIMEN 00
Every AI chip is a supply chain.             │
                                             │   (package)
01▌02▌03▌04▐05▐06▌07▌08▌09▌10▐11▐12▐13▌…     │
design wafer gas litho mask etch …           │
   hover a block: name, score, one line;     │
   the specimen swaps to that stage          │   caption
18 chapters · 25,420 words · 379 sources     │
```

First sentence: "Every AI chip is a supply chain; here are its seventeen stages, and five of them have one supplier."
What moves: the seventeen blocks draw in left to right over 700ms with heights set by chokepoint score; hover swaps the specimen and reveals the one-line summary; click jumps to the chapter. The hero becomes the table of contents and the first data graphic at once.

### Phone

```
CHOKEPOINTS                    ☰
── A DEEP DIVE ON THE AI CHIP…
CHOKE
POINTS
Every AI chip is a supply chain.
┌───────────────────────────┐
│  specimen (44vh, inline)  │
└───────────────────────────┘
SPECIMEN 00 · THE WHOLE CHIP
┌──────────┬────────────────┐
│ 1 firm   │ 3 firms  HBM   │
│ 92% <7nm │ 10+ yr replace │
└──────────┴────────────────┘
[ START AT STAGE 01 ]
```

The wordmark breaks across two lines at ~12.5vw instead of clipping, the specimen sits *after* the headline rather than above it, and the nav collapses into a sheet.

## 5. Ten improvements, ranked by impact

1. Fix the phone: let the h1 break across two lines instead of overflowing the viewport, and stop the specimen canvas and its caption clipping at the right edge (`04-current-hero-mobile-390.png`, `05-current-chapter-mobile-390.png`).
2. Replace the horizontally scrolling tab strip on phones with a sheet menu, so Suppliers, Geopolitics, Glossary, Sources, search and the theme toggle are reachable at all (`04-current-hero-mobile-390.png`).
3. Rebuild the chapter head around Distill's metadata band: number and title on one baseline with a hairline between them, then WORDS / READ / SPECIMEN / SCORE as four labelled columns, and raise the number's tone so it survives dark mode (`01-current-chapter-head-lithography-desktop.png`, `09-current-chapter-head-dark.png`).
4. Fix the heading ramp — h3 28px, h4 21px semibold, h5 mono 12px — so the fourth level is not the same size as body text (`08-current-figure-and-prose-desktop.png`).
5. Let figures break out of the 66ch prose measure to the full column width and drop the grey track rectangle behind each bar, so charts stop reading as a box inside a box (`08-current-figure-and-prose-desktop.png`).
6. Close the gap on citation superscripts so they sit against the word and after the punctuation, not floating before the full stop (`08-current-figure-and-prose-desktop.png`).
7. Widen Briefing, Suppliers and Glossary to the full width when the stage is hidden, and shorten the Briefing card's "In plain terms" block, which currently sets serif at 34 characters per line (`02-current-briefing-desktop.png`, `07-current-glossary-desktop.png`).
8. Set the Suppliers table's sticky header to `top: var(--masthead)` so it stops sliding under the fixed masthead, and give the row-description column a cap so it stops dominating the table (`06-current-suppliers-desktop.png`).
9. Turn the Landscape picker from a ragged wall of nineteen buttons into a fixed four-column grid with the country as a row label, and lift the spec sheet's four KPIs above the fold (`03-current-landscape-desktop.png`).
10. Make the progress rail legible without hover — show every seventeenth label at 10px with the current one in ink — and give the Glossary letter dividers with an A–Z jump bar so 74 terms are navigable without typing (`07-current-glossary-desktop.png`).
