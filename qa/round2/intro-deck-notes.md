# intro-deck: a flashcard deck at the end of Start here (notes, 20 Oct 2026)

Slug `intro-deck`, screenshot port 9813. Shots in `qa/round2/shots/intro-deck/`.

## The cards (data/flashcards.json "intro")

Ten cards in the order of the chain. Each covers one of the stages the site rates Extreme (design, lithography, masks,
the front end inside the foundry card, foundries, memory, packaging, substrates), plus how a fab builds a chip, the power
behind a data center, and who holds the tools. Every question can be answered from Start here alone. The "why" lines and the
takeaways copy Start here's sentences or a chapter's, with the same figure and year. No card repeats a chapter card's
question, answer or reason. "Start here" below means the walk as built (step paragraph or its fact box). "Chapter" means the
chapter's Markdown; the step paragraph is also the chapter's In plain terms box.

1. **What must a chip design pass before a foundry will accept it?**
   A: Checks in design software from three companies: Synopsys, Cadence and Siemens EDA.
   Why: In 2025 the three held over 85 percent of the market for chip design software and licensed circuit blocks, counting Ansys as part of Synopsys.
   Link: 01 Chip Design, EDA and IP (`#design-and-eda`).
   Stated in: Start here step 01 ("Software from three companies, Synopsys, Cadence and Siemens, lays out the blueprint, checks it and signs it off. A chip factory, called a foundry, accepts only designs that have passed that software's checks.") and its fact box ("about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%, counting Ansys as part of Synopsys", SemiAnalysis EDA primer). Chapter 01, Who makes it: "Synopsys, Cadence and Siemens EDA took more than 85 percent of it, counting Ansys as part of Synopsys."

2. **How does a chip factory build a chip on a wafer?**
   A: One layer at a time. A film goes down, lithography prints a pattern on it, and etch eats away everything the pattern does not protect.
   Why: Then the next film goes on top, and the loop repeats. A wafer moves between hundreds of machines over several months, and between steps another machine checks it for faults.
   Link: 06 Deposition and Etch (`#deposition-and-etch`).
   Stated in: Start here step 06 ("Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top."), step 07 ("Between the steps that build a chip, another machine looks the wafer over."), step 09 ("each wafer ... moves between hundreds of machines over several months"). Chapter 09, How it works: "the same loop of steps repeats for each one".

3. **Who makes the machines that print the finest layers of a chip?**
   A: Only ASML, a Dutch company.
   Why: The machines print with extreme ultraviolet (EUV) light, which air soaks up, so they work in a vacuum. ASML sold 48 of them in 2025.
   Link: 04 Lithography (`#lithography`).
   Stated in: Start here step 04 ("Air soaks up extreme ultraviolet light, the shortest in use, so machines that print with it work in a vacuum. Only ASML, a Dutch company, makes them.") and its fact box ("ASML sold 48 EUV systems in 2025, versus 44 in 2024", ASML 2025 annual report). Chapter 04: lede ("the only maker of extreme ultraviolet scanners, the machines that print the finest layers of a chip. It sold 48 of them in 2025."), opening ("48 of them extreme ultraviolet (EUV)"), Variants ("So an EUV scanner works in a vacuum").

4. **Why is the mask for an EUV layer a mirror?**
   A: No glass lets EUV light through.
   Why: The mirror is built up from about forty pairs of thin layers. Only three firms make the blank plates for these masks, and two of them are Japan's AGC and Hoya.
   Link: 05 Photomasks and Pellicles (`#photomasks-and-pellicles`).
   Stated in: Start here step 05 ("No glass lets EUV light through, so the mask for those layers is a mirror. The mirror is built up from about forty pairs of thin layers ..." and "Japan's AGC and Hoya are two of the three firms that make those mirrors."). Chapter 05 opening: "Only three companies worldwide supply those plates, and two of them are Japan's AGC and Hoya" (AGC).

5. **Why would a political crisis over Taiwan affect the whole chip supply?**
   A: TSMC, the biggest foundry, has all six of its largest plants in Taiwan.
   Why: No chip company sells enough of one product to fill a fab on its own, so chip companies share a handful of foundries. Only TSMC, Intel and Samsung make the newest transistors in volume.
   Link: 09 Foundries and Fabs (`#foundries-and-fabs`).
   Stated in: Start here step 09 ("No chip company sells enough of one product to fill such a factory on its own, so chip companies share a handful of them. TSMC runs the biggest, and all six of its largest plants are in Taiwan, so a political crisis over Taiwan would affect the whole chip supply.") and step 08 ("The newest kind of transistor, called gate-all-around ... Only three companies, TSMC, Intel and Samsung, make these switches in volume."). Chapters 09 and 08, How it works (the same paragraphs).

6. **What is the hard part of making high-bandwidth memory (HBM)?**
   A: Stacking. Each chip is ground thinner than a human hair, and the finished cube has to stay within a set height.
   Why: One chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron make HBM in volume.
   Link: 10 Memory and HBM (`#memory-and-hbm`).
   Stated in: Start here step 10 ("Stacking is the hard part because each chip is ground thinner than a human hair and the finished cube has to stay within a set height. One chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron make HBM in volume"). Chapter 10, How it works (same paragraph).

7. **What does packaging join together in an AI accelerator?**
   A: The chips that do the calculating and their stacks of memory, set side by side on a layer of fine wiring.
   Why: Silicon expands less than the resin beneath it when heated, so the package can warp and its joints crack. Nvidia, Google, AMD and Amazon all use TSMC's version, called CoWoS, made in Taiwan.
   Link: 11 Advanced Packaging (`#advanced-packaging`).
   Stated in: Start here step 11 ("several chips, called dies, set side by side on an interposer, a layer of much finer wiring that links them ... Stacks of memory chips sit on the same interposer", the warping sentence, "Nvidia, Google, AMD and Amazon all use TSMC's version, called CoWoS, made in Taiwan.") and step 16 ("the pieces of silicon that do the calculating", "the packaging that wires the dies and memory together"). Chapter 11, How it works.

8. **Which company dominates the insulating film used to build package substrates?**
   A: Ajinomoto, a Japanese food company.
   Why: A package substrate is the adapter between a chip and the circuit board under it. In June 2026 Ajinomoto told investors that the film has held a share of over 95 percent since its launch.
   Link: 12 Substrates and PCBs (`#substrates-and-pcbs`).
   Stated in: Start here step 12 ("A package substrate is the adapter between a chip and the circuit board under it." "Japan's Ajinomoto dominates the film"). Chapter 12: lede ("Ajinomoto, a Japanese food company, told investors in June 2026 that it holds over 95 percent of the market for the insulating film inside high-end chip packages."), Variants, ABF build-up substrates ("the insulating film between the layers of package substrates"; "In June 2026 Ajinomoto told investors that the film has held a share of over 95 percent since its launch", Ajinomoto's 30 June 2026 presentation, p. 3).

9. **For the newest AI data centers, what is harder than putting up the building?**
   A: Getting enough electricity to the site.
   Why: Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive.
   Link: 15 Data Centers and Power (`#data-centers-and-power`).
   Stated in: Start here step 15 ("The newest sites are planned in gigawatts ... Getting that much electricity to the site is harder than putting up the building. Transformers and heavy switches connect a site to the grid, and turbines make the power. All of them come from a few suppliers and take years to arrive."). Chapter 15, How it works (same paragraph).

10. **Which four countries are home to the firms that make the machines, software and chemicals for advanced chips?**
    A: The United States, the Netherlands, Japan and South Korea.
    Why: China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, or the chemicals that machine needs.
    Link: 17 Who Controls the Chain (`#/geopolitics`).
    Stated in: Start here step 17 ("The machines, software and chemicals used to make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, or the chemicals that machine needs."). Chapter 17, The shape of the contest (same paragraph).

Takeaways ("Ten things to remember", the end screen and the printed page), one per card in the same order, restating
the answers above: the foundry's check by Synopsys, Cadence and Siemens EDA; one layer at a time; only ASML makes EUV
machines; the EUV mask is a mirror and AGC and Hoya are two of three blank makers; TSMC's six largest plants in Taiwan;
SK hynix, Samsung and Micron and the stacking; TSMC's packaging used by Nvidia, Google, AMD and Amazon; Ajinomoto's film;
electricity harder than the building; the four countries.

Facts I left out on purpose: the 63.2 percent HBM share (IDC via SK hynix's prospectus, a market-research figure), KLA's
"about five times" its rival and the chemicals chapter's approval sentence (both flagged in INTEGRATION.md as computed or
unsourced), and "below 10 nm" (Start here never says what the nanometer names mean).

## Where the cards are stored and why
`data/flashcards.json`, new key `intro`, same shape as a chapter's entry (`cards`, `takeaways`) with `chapter` (a chapter id)
in place of `section`. The build reads chapter decks only as `flashcards[ch.id]` (build.js reviewHTML, social.js
readableHTML) and no chapter has the id `intro`, so the key cannot reach a chapter's deck; the walk and /intro/ read it by
name. check-speak and style-report skip `chapter` values as ids; check-speak reads the cards on the built page.

## What changed, by file
- `data/flashcards.json`: the `intro` key only.
- `build/build.js`: reviewHTML's markup moved into `deckHTML(fc, o)`, shared by the chapter decks (output byte-identical,
  checked against a saved copy of all 17) and the walk; NUM_WORD runs to Ten; `deckHTML` passed in ctx.
- `build/modules/walk.js`: the deck after the last step (`<div class="wk-deck" id="/walk/flashcards">`, deck id
  `intro--flashcards`, `data-deck="intro"`, `data-name="Start here"`, `data-reread="its chapter"`); each card's reason ends
  "Read: <chapter title>" linking to the chapter; the last step's Next (phones) leads to the deck.
- `src/app.js`, flashcards: `FC.id` takes `data-deck` before the chapter id. The old fallback named any deck outside a
  chapter "geopolitics", so this deck would have shared `cp-fc-geopolitics` with chapter 17's; it now keeps `cp-fc-intro`,
  and its analytics event says `flashcards/intro/<k>`. The end line reads "ends with a link to its chapter" for this deck.
  Search indexes decks in the walk too, named by `data-name` ("Start here · card 4 of 10").
- `src/modules/walk.js`: past the last step the address follows into the deck (`#/walk/flashcards`, replaced, as the steps
  are), so Back from a card's chapter link returns to the exact place and a reload opens on the deck.
- `src/modules/walk.css`: the deck in the walk's text column, its title in the chapter heading type, and the step links
  wrap under the ten dots on a phone.
- `build/modules/social.js`: `reviewSection` shared by the chapter pages (review sections byte-identical) and the new
  `introHTML`.

## /intro/ (please decide)
/intro/ was a forwarding page: meta refresh plus `location.replace`. A meta refresh also sends a reader without scripts
away, to a main page that shows no view without scripts, so a static deck there would never be seen. introHTML keeps the
tags, canonical and the scripted forward (readers with scripts land on Start here as before), drops the meta refresh, and
shows the deck as review questions in the chapter pages' style, each answer linking to the chapter's readable page. The 17
paragraphs are not on it. Adding them would make /intro/ a full static Start here; that is the owner's call.

## Behavior checked in headless Chrome (CDP driver in the session scratchpad)
- Flip, mark, end screen (7/10, missed ideas end with "Read: <chapter>"), Start over, and a reload: "Last time: 7 of 10
  known." with the dots as left. Storage: `cp-fc-intro` = {sig, marks, last}; `cp-fc-geopolitics` untouched.
- Search "mirror": first result "Flashcard · Why is the mask for an EUV layer a mirror? · Start here · card 4 of 10"; it
  opens `#intro--flashcards` at card 4, question side up, focus on Show answer.
- In the deck the address becomes `#/walk/flashcards` and the progress rail hides; following "Read: Deposition and Etch"
  and pressing Back returns to the same pixel with the card still turned; a reload opens on the deck (desktop and phone).
- /intro/ with scripts off: 10 questions open in place, links go to `../<chapter>/`.
- Print media: the deck prints as "Ten things to remember", as a chapter's deck prints its takeaways.

## Checks (final run, 20 Oct)
node --check on the five edited .js files: ok. data/flashcards.json: valid, formatting unchanged. Build: ok, no warnings.
check-speak: no matches. check-integrity: only the known Veeco warning. check-sources: 2442 citations, all tier A or B
(it failed for a while on four unclassified CSIS links another agent added to chapter 01; they classified them).
Chapter decks on the main page and the review sections of every chapter page are byte-identical to a copy saved before
the change. facts.js: all 36 copied passages found. No intro card field, takeaway or sentence of eight or more words
repeats a chapter deck.

## Screenshots (qa/round2/shots/intro-deck/)
01-front, 02-back, 03-end (the whole end screen), 04-return, each -desktop-light/-desktop-dark/-mobile-light/-mobile-dark;
05-search-mirror and 06-search-opened (-desktop-light, -mobile-dark); 07-static and 08-static-open (/intro/ with scripts
off, all four); 09-print-desktop-light; 00-before-* (before the change).

## Suggestions, not done (outside this brief)
- Start here's head could say the deck exists ("10 flashcards", a link to #/walk/flashcards) in its meta line; that is
  first-screen's area.
- /intro/ could carry the 17 paragraphs too (see above).

## Progress log
- 20 Oct: all done; fact check rerun after other agents' content edits: still 36 of 36.
