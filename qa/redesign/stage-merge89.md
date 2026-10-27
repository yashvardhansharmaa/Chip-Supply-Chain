# Merging chapters 8 and 9: stage report

Branch `redesign-merge89`, from the redesign at a572d29. Chapter 8, Transistors and the Front End, and chapter 9, Foundries and Fabs, are now one chapter, Foundries and Fabs, built from the owner-approved draft in `MAIN/qa/merge-8-9/`. The site has 16 chapters and 14 stages. 7 of the 14 stages are rated Extreme, counted from the cards: Chip Design, Lithography, Photomasks, Foundries and Fabs, Memory, Advanced Packaging and Substrates.

No PDF was regenerated or committed. The lead regenerates them.

## What changed

### Content
- `content/08-foundries-and-fabs.md` is the draft, word for word. Old chapter 8 is deleted. Chapters 10 to 17 are now 09 to 16, with their file names and `number` fields changed to match.
- Three references in other chapters changed. Component Costs now links "Foundries and fabs" (`#foundries-and-fabs`). Advanced Packaging's figure note now says "chapter 9", for Memory. Test and Assembly's figure note now says "chapter 10", for Packaging.
- The source comments in `animations/transistor.html`, `fab-loop.html` and `dep-etch.html` name the merged chapter.

### Data
- `data/flashcards.json`: the merged deck of five cards replaces both decks, in old chapter 8's place.
- `data/glossary.json`: 14 entries now point to `foundries-and-fabs`, so 25 point there in all. The "high-volume manufacturing" entry no longer cites risk production, which the merge cut. It now reads: "Foundries announce the date a process reaches it, and before then the process makes only prototypes, as Rapidus's 2 nm line did in 2025." That fact is in the merged chapter.
- `data/control-thresholds.json`: the 16/14 nm advanced-node threshold now points to the merged chapter.
- `build/related-chapters.js`: Foundries and Fabs links to Lithography, Advanced Packaging and Geopolitics, as the notes proposed. Chip Design and Deposition and Etch point to the merged chapter.
- `build/page-titles.json`: the old page's entry is gone. The merged chapter's description is the one the notes proposed. Its title is new and needs the lead's approval: "How chip foundries like TSMC make transistors". The home and summary descriptions say `{chapters}` and `{stages}`, and `build/page-titles.js` fills those from `content/` as "sixteen" and "fourteen".
- `build/modules/summary-a.js`: the route has one stop for the merged stage, at Hsinchu, TSMC's headquarters, where the front-end stop stood. Tainan is off the route. The short label "Front end" is gone.
- Specimen: `build/assets/specimens/foundries-and-fabs.webp` is now the transistor still (847 × 908), and `stills.json` lists it under that key. `build/assets/cards-art/foundries-and-fabs.png` is the transistor too. The FOUP art and still were removed. They remain in git history.
- `build/assets/cards/versions.json`: the old card's entry is gone, and every card's version went up when the cards were redrawn.

### Counts: computed, not typed
- New file `build/stages.js` defines which chapters are stages: every chapter except the economics chapter and the geopolitics essay. Everything that counted stages now reads it: build.js, validate.js, social.js and its manifest, summary-a.js, page-titles.js, `qa/scripts/check-integrity.js` and cards.py (through the manifest's new `stage` field). The app reads a new `stage` flag on `CP_DATA.chapters`, in lookup.js and summary-a.js.
- The night ground and the "The economics" and "The contest" tiles are now keyed by chapter id instead of by numbers 16 and 17.
- The template's three typed counts are now placeholders that the build fills: `{{N_STAGES}}`, `{{STAGES_WORD}}` and `{{CHAPTERS_WORD}}`. They cover the home card's alt text, the printed title page and the lede of How to read. The share-card alt texts are computed too.
- Comments that said "fifteen", "seventeen" or "chapters 16 and 17" were reworded in src, build, README and smoke. The README now says sixteen chapters and fourteen stages.

### The old address
- New file `build/retired-chapters.js` maps the old id to `foundries-and-fabs`. It also maps each old anchor to the nearest new one:
  - each section to the section that took in its text;
  - each figure to the same figure;
  - the dropped density-by-node figure to the section where it stood;
  - old chapter 9's sections that no longer exist (Pure-play foundries, Integrated device makers, National champions, Mature-node capacity, Variants).

  The build warns if a target is missing from the page, or if an old anchor is still a live one. Neither warning fires.
- `/transistors-and-front-end/` is a small static page: a canonical link to `/foundries-and-fabs/`, a meta refresh and a plain link. A short script goes first and carries a section's anchor across. For example, `#transistors-and-front-end--sources` lands on `/foundries-and-fabs/#sources`. The page is not in the sitemap, which now lists 22 pages instead of 23.
- In the app, `src/preroute.js` `moved()` swaps the address before the page paints: `#transistors-and-front-end`, its sections, its figures, its citation ids and `#/walk/transistors-and-front-end`. The router does the same for a link followed after the page has loaded.
- `/pdf/transistors-and-front-end.pdf` is in `OLD_PDFS`. Every build copies `dist/pdf/foundries-and-fabs.pdf` to that address, and robots.txt disallows it.

### Views
Each of these is computed from the data and was checked on the final build:
- the home evidence strip ("7 of the 14");
- the Suppliers route map: 14 numbered stops, and each segment mapped to its stage;
- the contents page;
- the rail's chain list;
- Next and Previous ("stage 08 / 14");
- the walk;
- the summary page and its PDF builder;
- Export Controls links;
- search;
- the glossary's "Read it in" links;
- print;
- the sitemap.

AI Chips has no links to stages: stage-chapters.js check 6 counts 0, as before the merge.

### Share cards
All 23 cards were drawn again for 14 stages: 22 by `build/cards.py --port 9393`, and the home card by `build/home_card.py --port 9394`.

The home card's row of drawings (`build/assets/home-card/card.html`) was redrawn with MAIN's own generator functions (`qa/design3/cards/chain/build.py`, read only). Run on the 15 old stages, those functions reproduce the old card's images exactly, 15 of 15. Then they drew the 14 new stages, with the transistor in the merged chapter's place. The run script is in the scratch folder only.

`cards.py` now takes the stages from the manifest, so the next merge needs no change there.

### QA scripts
Only counts and chapter numbers changed:
- stage-chapters.js: 16 chapters, chapter labels renumbered, and Memory is chapter 09.
- interact-chapter.js: "Stage 4 of 14".
- interact-suppliers.js: Taiwan has 3 stops on the route, down from 4.
- sweep.js and smoke.js: 14 stages and 16 chapters.

Two new scripts:
- `qa/redesign/check-merge89.js` checks the old addresses and the specimen.
- `qa/redesign/census-merge89.js` is the census for this change.

## Checks on the final build

| Check | Result |
|---|---|
| `node build/build.js` | 0 warnings. A rebuild changes only the timestamp in build-report.txt and the PDF copy. |
| `check-speak.js` | no matches |
| `check-integrity.js` | no problems. One existing warning about a card year in deposition-and-etch, not a chapter this change touches. |
| `check-sources.js` | 2,815 citations, all tier A or B |
| `check-size.js` | no file over 5 MB |
| `qa/redesign/check-cites.js` | 3,296 marks, 0 problems |
| `smoke.js --port 9391` | 36 page loads, no failures. The summary has 14 ladder rows. |
| `stage-chapters.js --base 8774` | 9 of 9 pass: 16 chapters each open alone, doors run 01 to 16, print shows all 16 (`stage-chapters-merge89.txt`) |
| `interact-chapter.js 8774` | all passed |
| `interact-glossary.js 8774` | 90 of 90 |
| `interact-suppliers.js 8774` | 63 of 65. The 2 failures are "the ladder's heading says segments", at 1440 and 390. They were already failing before the merge: the check expects "Segments by number of firms, fewest first", but the app has said "Segments from chip design to power" since 24b10b8, which is in the base. Route stops: none overlap at any width. |
| `interact-chips.js --base 8774` | 58 of 58 |
| `check-merge89.js 8774` | 19 of 19. The old addresses work on a fresh load, after the page has loaded, with Back, on the walk, on the readable page with an anchor, without scripts, and at the PDF address. The transistor draws in the chapter's slot: 12,616 ink pixels counted from a screenshot. The readable page shows the transistor still, and chapter 07's door leads to "stage 08 / 14" with that still. |
| `chapter_pdfs.py foundries-and-fabs --base 8774 --port 9392` | Sound PDF in scratch: 18 pages (the two old chapter PDFs were 11 and 12), 0.78 MB. Source Serif 4, Hanken Grotesk and Fragment Mono are all embedded. Title "How chip foundries like TSMC make transistors". The title block says "Stage 8 of 14". The final layout pass has no short or stranded pages, and one split: the chokepoint card runs across pages 2 and 3. `dist/pdf/foundries-and-fabs.pdf` was copied away first and put back; its checksum is unchanged. |
| `summary_pdf.py` (to scratch, port 9395) | 5 pages that say "fourteen" throughout. The base build also prints 5 pages. The committed 4-page summary.pdf predates the change of typeface. |
| dist grep | No "15 stages", "seventeen", "17 chapters" or "of 15" about the chain. The "fifteen" matches are about other things (exaggerated about fifteen times, the fifteen-percent export rule, an ASMPT title), and so are the "of 15" matches (15,540, 15,832). The old id appears only in the forwarding page, robots.txt and the app's address map in index.html, which needs the old ids in order to forward them. |

### Layout sweeps (390 and 1440, light and dark)
- `sweep-full.js`: whole pages of the merged chapter (in the app and on its readable page), home, contents, Suppliers and summary. 24 loads, 0 findings (`sweep-merge89-full.txt`).
- `sweep.js`: the first three screens plus focus, for walk, chain, Suppliers and the summary page. 16 loads, 0 findings (`sweep-merge89.txt`).
- `sweep.js --set chapters` for the merged chapter in the app and on its page: 8 loads, 0 findings (`sweep-merge89-chapter.txt`).

## Census differences (`census-merge89.txt`)

The census compares every view, every other chapter at its address, every other readable page, the summary, the four reference pages, the forwarding pages and the main page's head. It compares both the text and the link targets. The before side is a572d29's dist. Every difference falls into one of these groups:

1. **Numbers.** Chapter and specimen numbers, figure numbers (11.1 → 10.1 and so on), "Stage N of 15" → "Stage N of 14", "Next, stage 12 / 15" → "11 / 14", "Previous, stage 10" → "09", and "Continue to chapter 12" → "11". Each screen-reader title "Chapter 10:" became "Chapter 9:". The Advanced Packaging and Test notes now say "chapter 9" and "chapter 10".
2. **Counts.**
   - Chapter and stage counts: "8 of the 15" → "7 of the 14", "Extreme, 8" → "Extreme, 7", "fifteen" → "fourteen" (contents, How to read, summary, last door), "seventeen" → "sixteen" (walk, last door), "17 chapters" → "16" (/chain/), "1 / 17" → "1 / 16", and "all 15 stages" → "14" in the share alt texts.
   - Minutes: the walk is now about 11 minutes, down from 12, on the walk and /intro/.
   - Glossary: country lines now say "named on N of 14 chokepoint cards". Some "Where it appears" counts fell, because the merged chapter is shorter.
   - Suppliers by country: Taiwan "leads three stages, two of them extreme", down from four and three. China is "named on eight chokepoint cards", down from nine.
3. **Links to the merged chapter.** Every rail lost the "Transistors and the Front End" row. Every "Read it in" and "Also in" that named the old chapter now names Foundries and Fabs. Component Costs links "Foundries and fabs". The Suppliers route lost the "Transistors & the Front End" stop and "Tainan · TW". The link targets lost `#transistors-and-front-end` and nothing else.
4. **The merged chapter's own text where other views quote it.** The walk step, the contents' one-liner, chapter 07's door, the summary card and the high-volume-manufacturing glossary line. One fewer walk step and one fewer summary card also drop their repeated labels ("Who leads", "Read the chapter", "TSMC TW" and so on).
5. **Dates.** "Updated 25 October 2026" → "27 October 2026" on Component Costs, Geopolitics and Suppliers, whose words changed as above. A page whose words did not change keeps its date.

The glossary also shows where the merge cut text: one Chip Design term no longer lists Foundries and Fabs under "Also in". Nothing outside these groups differs.

## Known issues and notes for the lead
- **PDFs.** The cite line's "Chapter PDF" links `dist/pdf/foundries-and-fabs.pdf`, which is still old chapter 9's PDF until you regenerate. Every build copies that file to `pdf/transistors-and-front-end.pdf`. I restored the committed copy (old chapter 8) so that no PDF is committed. After you regenerate, run the build again and commit the copy with the others. Then regenerate the book and the summary.
- **Merged chapter's page title.** "How chip foundries like TSMC make transistors" is my wording. The notes proposed only a description.
- **Glossary terms the merged text never uses.** CMOS and fabless point to Foundries and Fabs but are not in its text, and they were not in the old chapters either. IDM matched only old chapter 9's heading "Integrated device makers turned foundry", which the merge removed. Each term's "Read it in" link still goes to the chapter.
- **Uncited sources.** The seven URLs the notes list are no longer cited. Six of them are cited by no other chapter, so their bibliography entries are unused. No check flags this.
- **README screenshot.** `docs/readme/chapter.jpg` still shows 15 stages, and its alt text now says fourteen. Retake it with the next README pass.
- **Chapter PDF layout.** The chokepoint card splits across pages 2 and 3.
- **Fonts and servers during checks.** The card renderer and the QA browser fetched Google Fonts, as the project's tools always do. To print the base summary for comparison, I ran a static server on port 9396, inside my range, and stopped it straight after.

## Shots (`qa/redesign/shots/merge89/`, kept local by .gitignore)
- `home-1440.png`: the hero reads "7 of the 14 stages are rated Extreme", with 14 marks.
- `contents-1440.png`: How to read says "fourteen stages".
- `chapter-opener-1440.png`: the merged chapter's opener, "Chapter 08 · Stage 8 of 14", with the transistor in its slot.
- `chapter-card-1440.png`: the merged card, "Foundries and Fabs, stage 8 of 14", with the rail's 14 stages.
- `suppliers-route-1440.png`: the route of 14 stops, 08 Foundries & Fabs at Hsinchu.
- `chapter-390.png`: the merged chapter on a phone.
