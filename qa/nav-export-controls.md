# Nav test: Export Controls

Laptop at 1440 and phone at 375. Screenshots: `qa/nav/ec-*.png`. Another session rebuilt the page
midway through: the five-state legend and a TPP gloss landed, both rechecked below, both working.
The screenshots predate them.

The board is the best thing on the site: nine rows, a state, a plain label, a date, a scrubber, and a
history behind each row ending in a Federal Register or SEC link. The rest is the last mile.

## Four readers

**Congressional staffer.** Reads the nine rows in a minute and has the brief. Clicks 2022, six rows
flip to OPEN, and that is the "how it changed" slide. The new legend settles LICENCE against CASE BY
CASE. Still stopping him: FDPR, Entity List and VEU carry no gloss, nothing dates the data except the
NOW button, and the one export button hides in the other mode. Cannot answer: did the rules work.

**Compliance officer.** Best served. "Chipmaking tools" opens into five moves in date order, the state
pill beside each move that changed it. But the source hides behind MORE and reads `www.sec.gov`: no
document title, no FR citation, no effective date. And a move that changed nothing leaves an empty
gutter, which reads as an oversight.

**Journalist.** Asks whether the H20 or H200 can be sold today. The answer splits across two rows
that never mention each other: "Advanced AI chips" says CASE BY CASE, and "Foreign chips inside
China", five rows down, says SHUT. Searching "H20" returns the right dated events, but all 43 link to
`#/controls` and land at the page top, unscrolled and unmarked (the jump-target CSS,
`.timeline .tl-e.is-target`, exists and nothing sets it). Worse, in the AI chips history the
9 Apr 2025 entry still shows a SHUT pill over the headline "put under indefinite licence
requirement". The data holds the label that resolves it, "Even the China-legal H20 stopped", and
`histHTML` drops it.

**Student.** Reads the page as a table and does not know it is a control. Nothing says what an export
control is, and no link reaches chapter 17, which does. The legend now explains POLICY, but the row
is still not a flow: "Money, stakes and tariffs" runs "at home" and is POLICY on every date. No row
is OPEN today, so the baseline stays hidden until they scrub back to "OPEN, from the start".

All four fare better than expected on the phone: rows stack, the pill takes its own line, the history
reads.

## Mechanics

- **Years do not look clickable.** No border, no fill, no cue in a still; they read as a table header,
  and the count under each (2, 1, 3, 0, 3, 5, 4, 17, 8) carries no word.
- **The as-of date reads as a date**, but each row shows a second, unlabelled date under its pill,
  and picking 2022 sets 31 Dec 2022, so the playhead falls between two years.
- **Export is usually invisible and copies the wrong thing.** The bar sits inside `.cf-chron`, which
  is `display: none` in By subject, so the default view has no export. In By date it copies the 43
  chronology rows, never the nine flows and their states.
- **The By date board is not too small:** 505 px wide, 15 px names, clean. But the legend is hidden
  in that mode, where a returning reader may land.
- **The scroll spy lags a screenful.** Its probe sits 40 px under the masthead, so the board read
  17 Oct 2023 while the visible entries were 2024 and 2025.
- **Clicking a compact row loses your place.** It flips to By subject, opens the row, resets the date
  to Now and overwrites the remembered mode.
- **The mode is remembered forever.** One click on By date and every later visit opens on the
  chronology, phones included, where By date hides the board and scrubber outright.
- **Nothing links out**, and `control-flows.json` has no chapter field.
- **The revenue tab does not connect:** no shared date, no link, nothing tying Nvidia's fall to
  9 Apr 2025.
- **Phone.** Year targets are 37.7 x 42.6 px, edge to edge, and a mistap silently moves the board.
  NOW is 27 px tall, the mode buttons 30.8. Rows are the right width; sub-tabs wrap to two lines and
  read. The year line under 2025 and Now runs to four lines of 10.5 px mono, 190 unbroken characters,
  and names the row "Entity List" where the board says "US goods and technology".

## What other trackers do that this does not

A cloud status page states current status in a sentence and stamps the time. The Federal Register
separates publication from effective date and gives each rule a citation and a permalink. CSET and
CSIS ship the rule set as a download and print a "last updated" line. PIIE's timeline marks
announced, in force and suspended as different things, which this page cannot: it prints "SHUT,
affiliates rule suspended for a year".

## Ranked changes

**Wording, all S.**
1. Show the state label in the history, so 9 Apr 2025 reads "SHUT, even the China-legal H20 stopped".
2. Print `no change` in an unchanged move's empty gutter.
3. `MOVES` at the left of the count row; `As of` becomes `Board as of`.
4. "From the start" becomes `open since 2018`.
5. Footer: `Moves through 7 September 2026.`
6. Phone year line as counts: `End of 2025: 1 shut, 3 licence, 2 case by case`.

**Interaction.**
7. Move the export bar above the mode switch; export the board, not the chronology. **S**
8. Give years a visible rest state and 44 px targets; raise NOW and the mode buttons to 44. **S**
9. Show the legend in By date too. **XS**
10. Keep the date when a compact row is clicked; stop overwriting the remembered mode. **S**
11. Put the as-of date and open event in the URL; set `is-target` on arrival. **M**
12. Lift the source out of MORE onto the entry line, with the document name. **M**

**Structural.**
13. Gloss FDPR, Entity List and VEU in place, as TPP now is. **S**
14. A `chapter` field per flow, and a "Read the chapter" link in each row. **M**
15. Cross-reference the two AI-chip rows; bridge the sub-tabs in a sentence. **S**
16. Make "suspended" a mark, not prose. **M**

**Do these three first:** the state label (1), the export fix (7), the year affordance and tap
targets (8). An hour between them, and with the legend in they clear every repeat stumble.
