# shared-apply notes (20 October 2026)

Data editor applying the experts' proposals for data/flashcards.json and data/glossary.json (through qa/round2/apply-shared.py) and bibliography date corrections (Edit tool).

## Batch 1: chapters 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15
- Read all 13 reports. Current values checked against every "before"; chapter text checked for every fact the new wording relies on.
- Patches: qa/round2/shared-patches.json (current batch). After writing, applied patches are archived in qa/round2/shared-patches-applied.json so the next batch starts from an empty list (the tool re-applies everything in the list).
- New bibliography entries are left to qa/round2/merge-bib.py, which reads the reports' own blocks. This file deliberately holds none.

### Skipped (owner decision or not a fix)
- ch 1: glossary TPU (optional, no exact text; owner may update the example).
- ch 3: none skipped.
- ch 4: glossary scanner (expert calls it a judgment call; current wording is not wrong), CSIS why ($43 billion, owner decision); Q3 2026 6-K entry (only if the guidance swap is adopted).
- ch 6: glossary coater/developer (only if the TEL/CSET replacement is adopted).
- ch 7: flashcard card 3 why (only if Gartner is ruled out).
- ch 12: glossary BGA addition (optional addition, fixes nothing); Ibiden bibliography entry (only if the owner adds the sentence).
- ch 15: intro deck card P3 (only if the owner changes `plain`); new ERCOT/EIA/Micron entries (only if adopted).

### Result
- 102 patches written (0 refused). Bibliography (Edit tool): ASML Q2 2026 07-14 to 07-15; Intel PowerVia 2025-01-31 to 2023-06-05; KLA Q4 FY26 letter 07-27 to 07-28; KLA investor day 03-13 to 03-12; TOK 08-05 to 08-06; JSR 2024-06-19 to 2024-06-24; Dinglong 03-26 to 03-27; Shinko Mobara notice accessed 2026-09-09 (before its 30 Sep publication) to 2026-10-20.
- One wording deviation: nitrogen trifluoride why says "has made nitrogen trifluoride" where the proposal said "has made it" ("it" would have followed "a fab").

## Batch 2: chapters 9, 14, 16, 17
- 58 patches written, plus 1 readability fix of my own: mm2 plain "14 times that size" pointed back to the 800 mm2 die, so it now says "14 times the size of one scanner shot" (TSMC: 14-reticle CoWoS).
- Skipped: ch 16 new GAAP entry (definition and "not strictly comparable" sentence are stated nowhere in the chapter; the tool cannot add entries); ch 17 consignee G42 sunset sentence (6 April 2027 is not in the chapter; owner question 5 lists it as optional). ch 9 and ch 14: none (no 3Q26 updates were proposed for shared files).
- Glossary alias notes for the main session: baseboard aka remove "accelerator module" (ch 16 "covers the accelerator module only" opens baseboard); "lot" matches "a lot" in ch 3 and ch 10 because the term itself is a match variant, so no aka change fixes it. Data-only fix: rename term "lot" to "wafer lot" with aka "lots, wafer lots, per lot" (check for any #/glossary/lot links first), or make the matcher skip "a lot" in build.js.
- Facts in new glossary text that no chapter states (sourced by the experts): ASML €16,054.1m / €8,420.2m (logic chip), SIA/BCG $63bn in 73 fabs (mature node), TSMC A16 production-ready 2H26 (backside power delivery), PDK "about two years" (source says 24 months).
- Checks after batch 2: build exit 0, no warnings; check-speak no matches; check-integrity only the Veeco warning; check-sources 2516 citations, all tier A or B.

### For the main session (files I do not edit)
- Animations, batch 2: racks step 3 (ch 14).
- Animations/media: chip-design step 5; silicon (Refine, Polish, labels, readout); mask ("One speck" is a factual error, highest priority; "A mirror"; "The scanner"; HEADS; comments; fab-loop comment); dep-etch "Deposit"; defects step 1; transistor steps; hbm-stack caption and specimens/hbm-stack.js; package step 2 (and optional step 5); wafer-test captions; power step 3 and HEADS[3]; chemicals step 1 (and optional Coat to Print).
- suppliers.json: Shinko "a new core plant for advanced chip packages" (align with ch 12 change 7).
- ch 17: TEL "share of new equipment sales" wording (ch 6 change 11).
