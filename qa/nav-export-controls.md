# Nav test: Export Controls

Laptop at 1440 and phone at 375. Screenshots: `qa/nav/ec-*.png`.

The board is the best thing on the site: nine rows, a state, a plain label, a date, a scrubber, and a
history behind each row ending in a Federal Register or SEC link. Everything below is the last mile.

## Four readers

**Congressional staffer.** Reads the nine rows in a minute and has the brief. Clicks 2022, six rows
flip to OPEN, and that is the "how it changed" slide. Then stalls. No legend, so LICENCE against CASE
BY CASE is a guess. "21,000 TPP" is undefined: the glossary holds TPP, Entity List and ECCN, but this
page carries no glossary term and no citation marker. Nothing dates the data except the NOW button.
Cannot answer: did the rules work.

**Compliance officer.** Best served. "Chipmaking tools" opens into five moves in date order, with the
state pill beside the moves that changed it. But the source hides a click further in, behind MORE,
and reads `www.sec.gov`: no document title, no FR citation, no effective date. And a move that
changed nothing leaves an empty gutter, which reads as an oversight.

**Journalist.** Asks whether the H20 or H200 can be sold today. The answer splits across two rows
that never mention each other: "Advanced AI chips" says CASE BY CASE, and "Foreign chips inside
China", five rows down, says SHUT. Searching "H20" returns the right dated events, but all 43 link to
`#/controls` and land at the page top, with no scroll and no highlight; the CSS for a jump target
(`.timeline .tl-e.is-target`) exists and nothing sets it. In the AI chips history the 9 Apr 2025
entry shows a SHUT pill above the headline "put under indefinite licence requirement". The data holds
a label that resolves this, "Even the China-legal H20 stopped", and `histHTML` drops it.

**Student.** Reads the page as a table and does not know it is a control. Nothing says what an export
control is, and no link reaches chapter 17, which does. "Case by case" reads fine. "Policy" does not:
"Money, stakes and tariffs" is not a thing that flows, its route is "at home", and it is POLICY on
every date, so the fifth pill teaches nothing. No row is OPEN today, so the baseline stays hidden
until they scrub back and meet "OPEN, from the start".

All four fare better than expected on the phone: rows stack, the pill takes its own line, the history
reads.

## Mechanics

- **Years do not look clickable.** No border, no fill, no cue in a still. They read as a table
  header, and the count under each (2, 1, 3, 0, 3, 5, 4, 17, 8) carries no word.
- **The as-of date reads as a date.** But each row shows a second date under its pill, unlabelled.
- **The playhead lands on a boundary.** 2022 sets 31 Dec 2022, so the tick sits between 2022 and 2023.
- **Export is usually invisible and copies the wrong thing.** The bar sits inside `.cf-chron`, which
  is `display: none` in By subject, so the default view has no export. In By date it copies the 43
  chronology rows, never the nine flows and their states.
- **The By date board is not too small.** 505 px wide, 15 px names, clean.
- **The scroll spy lags a screenful.** Its probe sits 40 px under the masthead, so the board read
  17 Oct 2023 while the visible entries were 2024 and 2025.
- **Clicking a compact row loses your place.** It flips to By subject, opens the row, resets the date
  to Now and overwrites the remembered mode.
- **The mode is remembered forever.** One click on By date and every later visit opens on the
  chronology, phones included, where By date hides the board and scrubber outright.
- **Nothing links out**, and `control-flows.json` has no chapter field.
- **The revenue tab does not connect:** no shared date, no link, no sentence tying Nvidia's fall to
  9 Apr 2025.
- **Phone.** Year targets are 37.7 x 42.6 px, edge to edge, and a mistap silently moves the board.
  NOW is 27 px tall, the mode buttons 30.8. Row width is right; sub-tabs wrap to two lines and read.
  The year line under 2025 and Now runs to four lines of 10.5 px mono, 190 characters unbroken, and
  names the row "Entity List" where the board says "US goods and technology".

## What other trackers do that this does not

A cloud status page opens with a legend, a plain sentence of status and a timestamp. The Federal
Register separates publication from effective date and gives each rule a citation and a permalink.
CSET and CSIS ship the rule set as a download and print a "last updated" line. PIIE's trade-war
timeline marks announced, in force and suspended as different things, which this page cannot: it
prints "SHUT, affiliates rule suspended for a year".

## Ranked changes

**Wording, all S.**
1. Legend under the scrubber: `OPEN nothing needed · LICENCE a licence is required · CASE BY CASE granted one at a time · SHUT refused in practice · POLICY money and tariffs, not a licence`.
2. Put `MOVES` at the left of the count row; `As of` becomes `Board as of`.
3. Show the state label in the history, so 9 Apr 2025 reads "SHUT, even the China-legal H20 stopped".
4. Print `no change` in the empty gutter.
5. Replace "from the start" with `open since 2018`.
6. Footer: `Moves through 7 September 2026.`
7. Cut the phone year line to counts: `End of 2025: 1 shut, 3 licence, 2 case by case`.

**Interaction.**
8. Give years a visible rest state and 44 px targets; raise NOW and the mode buttons to 44. **S**
9. Move the export bar above the mode switch and export the board: flow, state, date, the move that set it. **S**
10. Keep the date when a compact row is clicked; stop overwriting the remembered mode. **S**
11. Put the as-of date and the open event in the URL, and set `is-target` on arrival. **M**
12. Lift the source out of MORE onto the entry line, with the document name. **M**

**Structural.**
13. Glossary terms in place on TPP, FDPR, Entity List and VEU. **M**
14. Add a `chapter` field per flow and a "Read the chapter" link in each row. **M**
15. Cross-reference the two AI-chip rows, and bridge the two sub-tabs in one sentence. **S**
16. Make "suspended" a mark, not prose. **M**

**Do these three first:** the legend (1), the export fix (9), the state label in the history (3). An
hour between them, and they clear the three things that stopped every reader.
