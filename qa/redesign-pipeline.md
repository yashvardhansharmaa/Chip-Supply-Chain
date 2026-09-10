# Suppliers: the pipeline and the ladder

The dot matrix is gone. Two drawings of the same 220 firms replace it.

**The pipeline** (`#sup-pipe`) is an SVG streamgraph of the twenty stages in chain order, drawn from the
container width and redrawn on resize: 1180 × 251 px on a desktop, 820 × 199 px minimum on a phone inside a
scrolling box. Thickness is the firm count, so the pipe pinches at IP and architecture (5) and flares at the
accelerator vendors (28). Eight bands stack in the fixed order US, JP, CN, TW, KR, NL, DE, Other, smoothed with
cubic curves on a centred baseline. Above each stage sits one amber square per Critical firm, in rows of three,
on a dashed drop line to the stream; below it the stage name and its count in mono. Hover or focus tints the
column and opens a card naming the stage, the count by country and the Critical firms. Clicking a stage scrolls
to its rung and lights it; clicking a band filters that country and dims the rest. Twenty invisible hit
rectangles carry one tab stop and arrow keys. The stream wipes in from the left once, in 620 ms, and stands
still under `prefers-reduced-motion`.

**The ladder** (`#sup-ladder`) ranks the same stages by firm count ascending, then Critical count, then chain
order. Each rung: the rank in 46 px ghosted display type, the stage, "n firms · k critical", then every firm on
one flowing line, Critical in amber bold, Diversified muted. A name opens its panel under the line in 220 ms,
one panel a rung. Filters hide names and rewrite the count to "3 of 11 firms"; a rung with no match collapses to
a muted header. The rungs never move. Table, CSV and the count line survive unchanged; the category chips and
the phone category select are gone.

**Height at 1440 px: 11,879 before, 2,837 after.** Phone about 5,150, `scrollWidth` 375. Build clean, console
clean, search palette still lands on a firm.

## Unfinished

- A band click sets the country by mouse only; keyboard and screen readers use the country select.
- The card covers the legend while it is open.
- At 820 px every label line is letter-spaced down to fit its column.
- A lit rung stays lit until another stage is clicked.

## Wording still to settle

- Two headings are mine to propose: "The chain, stage by stage" and "Stages, thinnest first".
- The legend ends with an instruction, "click a stage for its list, a colour to filter". Cut it if the legend
  should only explain.
- "Every other country" hides 27 firms in eleven countries. A line naming them would help.
