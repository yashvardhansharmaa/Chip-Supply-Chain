# anim-fix notes (20 October 2026)

Status: all three animations fixed, rendered in both themes, built, checked and screenshotted.
Slug `anim-fix`. `build/animate.py` accepts `--port`; every render and preview here used port 9824.
Files edited: `animations/defects.html`, `animations/substrate.html`, `animations/dep-etch.html` (dep-etch added by the
coordinator mid-task). Files written by `animate.py`: `media/{defects,substrate,dep-etch}-{light,dark}.mp4`,
`-{light,dark}-start.jpg`, `-{light,dark}-end.jpg` and `media/{defects,substrate,dep-etch}.json`.
No chapter, data or bibliography file was edited. No new sources.

## Sources opened (copies under `qa/round2/scratch/anim-fix/`)
- Parhami, *Dependable Computing*, ch. 5 PDF (the URL cited in ch 7), PDF p. 8 (book p. 135), Example 5.2: "Assume that the
  dies in Fig. 5.5 are 1 x 1 and 2 x 2 cm2 in size ... Assuming a defect density of 0.8/cm2"; solution: "a yield of
  0.492w and 0.113w for the 1 x 1 and 2 x 2 dies, respectively, assuming a = 3"; "the 2 x 2 die costs (120/26) x
  (0.492/0.113) = 20.1 times as much as the 1 x 1 die". Fig. 5.5 on the same page: "120 dies, 109 good" and
  "26 dies, 15 good" (the example says to ignore that defect pattern; only the die counts are used).
- Ajinomoto, Growth Strategy for the Electronic Materials Business, June 2026, p. 11: labels "3 layers" twice (PC use,
  1999), "9 layers" twice (HPC, about 2023, approx. 70 mm square), "11 layers" twice (AI 2.5D, 2026, approx. 100 mm
  square), one label on each side of the core.
- SIA, David Isaacs, Senate Finance testimony, 14 May 2025, p. 2: "ultimately between 1,000 and 1,500 steps to turn the
  silicon into the final packaged semiconductor, depending on the complexity of the chip".

## 1. defects.html (ch 7, "Why big chips lose more to defects")

| | Before (no source) | After (Parhami p. 8; ch 7 How it works) |
|---|---|---|
| Wafer | 300 mm, 621 dies of 1 x 1 cm, 67 of 25 x 32 mm | the textbook's wafer: 120 dies of 1 x 1 cm or 26 of 2 x 2 cm, laid out as in Fig. 5.5 (a 70 mm radius holds exactly those counts) |
| Defect density | 0.10 per cm2 | 0.8 per cm2 |
| Specks | 68 | 0.8 x the drawn wafer's area (123); never shown as a number |
| Row 1 | 91 percent work, SMALL CHIPS, 1 SQUARE CM | 49.2 percent flawless, SMALL CHIPS, 1 CM SQUARE |
| Row 2 | 49 percent work, AI-SIZE CHIPS, 8 SQUARE CM | 11.3 percent flawless, BIG CHIPS, 2 CM SQUARE |
| Row 3 | 49 counting to 69 percent work, AI-SIZE CHIPS, HALF THE SPECKS | 20.1 times the cost, BIG CHIP AGAINST SMALL |
| Step 1 | Specks land: "Specks of dust and tiny flaws land at random on every wafer." | Specks land: "Specks of dust and tiny flaws land at random on every wafer. A textbook example puts them at 0.8 per square centimeter." |
| Step 2 | Small chips: "Cut into small chips, almost every chip misses every speck." | Small chips: "Of chips 1 centimeter square, 49.2 percent miss every speck and come out flawless." |
| Step 3 | AI-size chips: "An AI chip covers eight times the area, so about half of them catch a speck and fail." | Big chips: "Chips 2 centimeters square are bigger targets for the same specks. Only 11.3 percent come out flawless." |
| Step 4 | Half the specks: "Halve the specks and about seven in ten AI chips work. Finding defects pays most on the biggest chips." | The cost: "The big chip yields less and fits fewer times on a wafer, so it costs 20.1 times as much as the small one." |

- No source gives a yield for halved defects, so the fourth step now carries the example's own conclusion (its question
  is the cost), which ch 7 already states and cites ("it costs 20.1 times as much as the small one", How it works).
  On the wafer the three flawless big dies are outlined; nothing else in the design changed (same canvas, wafer size,
  colors, rows, four steps at the same times, 16.4 s).
- "percent work" became "percent flawless": ch 7 says the formula gives the share with no killer defect, and that
  spares let more dies be sold, so "work" overstated it.
- "AI-size" is gone: a 2 x 2 cm die is the textbook's big die, and no source calls it AI-size.
- The numbers on screen are the source's strings. The page checks itself (`window.INFO`): the formula gives 49.2 and
  11.3 and the die counts give 20.1; the drawn wafer has 59 of 120 and 3 of 26 flawless, the whole-chip counts
  nearest 49.2 and 11.3 percent. Its clustering (groups of 1 to 8 specks, about 9 mm across) averages 58.6 and 3.0
  flawless dies over 20,000 random wafers, so the wafer drawn is typical of the formula. So that no dot looks as if
  it sits on two chips or on a flawless one, specks within 1.25 mm of a die edge move off it, and specks within
  2.2 mm of a flawless die move away from it, each staying in its own die (51 of 123 specks, at most 2.2 mm). No
  die's outcome changes; the page's `clear` check confirms both grids.

### Front matter for the main session (ch 7, `figures`, id `defect-yield`)
The note names three changed numbers (300 mm, 68 specks, 0.10). Title unchanged. Replace the note with:

`"note": "Simulated wafer with the layout of the textbook example: 120 chips 1 centimeter square, or 26 chips 2 centimeters square. Specks land at 0.8 per square centimeter, at random in loose clusters. The share of flawless chips matches the formula above, with a clustering constant of 3, as nearly as whole chips allow."`

### Outside my files, for the main session
- `data/flashcards.json` line 224 (ch 7 card 2) repeats the old unsourced figure: "halving the defects raises the share of
  flawless chips from about half to about seven in ten". Suggested `why`: "In a textbook example with the same density
  of specks, 49.2 percent of chips 1 centimeter square come out flawless, but only 11.3 percent of chips 2 centimeters
  square." and `section` "How it works" (where the chapter states it).
- `HANDOFF.md` lines 155 and 159 describe the old defects numbers and the "1,000+ rounds" readout.

## 2. substrate.html (ch 12, "How a substrate fans out")

| | Before | After (Ajinomoto June 2026, p. 11) |
|---|---|---|
| Readout | 18 layers, UNDER AN AI CHIP (the 2023 HPC substrate's 9 + 9, labeled as an AI chip) | 11 layers, ON EACH SIDE OF THE CORE, AI PACKAGE, 2026 |
| Step 4 | "... An AI chip needs about 18 layers, against six for a PC, and every layer is another chance for a flaw, which is what makes these substrates hard to build." | "... Ajinomoto counts 11 layers of its film on each side of the core in a 2026 AI package substrate, against three on each side for a PC in 1999. Every layer is another chance for a flaw, which is what makes these substrates hard to build." |
| Code comment | "Ajinomoto counts 18 layers of its film in a high-performance computing substrate" | per-side counts, with the page |

The first sentence of step 4 and steps 1 to 3 are unchanged.

### Front matter (ch 12, `figures`, id `substrate-fanout`)
Title has no number. The note "Simplified. Eight layers are drawn, and every thickness is exaggerated." counts the core's
two bands among the eight, which reads against the new per-side caption. Recommended (the drawing itself is unchanged):

`"note": "Simplified. Three layers of film are drawn on each side of the core, and every thickness is exaggerated."`

## 3. dep-etch.html (ch 6, "One round of deposition and etch")

| | Before | After (SIA 2025, p. 2; ch 6 How it works) |
|---|---|---|
| Readout | ROUNDS FOR ONE CHIP, 1,000+ | STEPS TO MAKE ONE CHIP, 1,000 to 1,500, SIA ESTIMATE, 2025 (set as in the ch 9 fab-loop readout) |
| Step 8 | "Insulator fills the gaps and the next layer goes on. A chip takes more than a thousand of these rounds." | "Insulator fills the gaps and the next layer goes on. Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Association estimated in 2025." |

The round counter (Round 1 to 6) counts the rounds drawn and is unchanged. Figure note and title have no number; no change.

## Renders, checks, shots (all done)
- `python3 build/animate.py <name> --port 9824` for all three, both themes (defects re-rendered last, after the
  margin pass): defects 394 frames, substrate 523, dep-etch 581; durations unchanged (16.4, 21.8, 24.2 s). The three
  step files list the new captions; frames from the MP4s and the stills were checked in both themes.
- Final run: `node build/build.js` exit 0, no warnings; `check-speak.js` "no matches"; `check-integrity.js` exit 0
  (known "exposure row for Veeco Instruments has no supplier entry" only); `check-sources.js` "2453 citations, all tier
  A or B". Built pages carry the new captions and none of the old ones.
- Stills: `media/{defects,substrate,dep-etch}-{light,dark}-end.jpg` (print and reduced motion) and `-start.jpg`.
- Shots (static chapter pages, figure scrolled into view): `qa/round2/shots/anim-fix/{metrology-and-inspection,
  substrates-and-pcbs,deposition-and-etch}-{desktop,mobile}-{light,dark}.png`. Light shots use `?theme=light`
  (headless Chrome here reports a dark system preference). They show the old ch 7 and ch 12 figure notes, which are
  front matter for the main session to apply.
- Not checked: the ch 12 specimen caption ("eighteen copper layers", an 8-2-8 drawing) is outside this brief.

## New bibliography entries
None.
