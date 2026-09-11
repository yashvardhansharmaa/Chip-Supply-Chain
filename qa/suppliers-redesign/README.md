# Suppliers page: three mockups

Static mockups of the Suppliers page (`#/suppliers`) reworked as one composition. Nothing in `dist/` or `src/` is changed. Each mock is a copy of `dist/index.html` with the suppliers section rebuilt from the pieces the site already renders (route map, stop strip, country roles, country panels, Sankey, filters, ladder) and a block of mock-only CSS appended. The builder is `mock/make.py`; the copies are served from `mock/` on port 8843 for capture. Every capture shows the state after the reader has chosen Taiwan: its four stops lift out of the map with amber rings and town labels, its cards in the strip carry the amber bar, and its panel is open.

## The problem

At 1440 wide the page runs to 4,866 px and is four things in a stack: the route map with its strip of fifteen stops, the country leverage list with its panel, the country-to-stage Sankey, and the ladder of stages ranked thinnest first. The map and the leverage list arrived from the home page today. The author wants one composition, "the globe atlas thing on the suppliers page".

## Heights, full page at 1440 wide

| | Height | Change |
|---|---|---|
| Before (`before-1440-light.png`) | 4,866 px | |
| Mock A, Atlas, "By stage" tab open (the ladder) | 3,249 px | -33% |
| Mock A, Atlas, "By country" tab open (the Sankey) | 1,744 px | -64% |
| Mock B, Map plus table | 3,914 px | -20% |
| Mock C, Stages first | 4,752 px | -2% |

The phone captures are the first two screens of a 390-wide phone at 2x (390 x 1,688 css px, 780 x 3,376 image px).

## Mock A: Atlas

Captures: `mock-a-1440-top.png`, `mock-a-1440-full.png`, `mock-a-1440-tab-country.png`, `mock-a-390-top.png`, `mock-a-1440-top-dark.png`.

What it changes. The four sections become one bordered plate under the title. Across the top of the plate runs a row of twelve country chips, with the chosen country's one-line role as a caption beneath ("Taiwan, leads four stages, three of them extreme. Makes nearly every leading-edge chip and packages most of them"). Below that the map fills the plate to the left, 974 px wide, and the country panel stands at its right, 360 px wide, sharing the plate's ground and hairlines rather than sitting in its own box. Choosing a country lights its stops and labels its towns on the map, dims the other stops and the route arcs, and swaps the panel. The stop strip becomes the plate's footer, two rows of eight under the map so the cards keep their width. Beneath the plate two tabs, "By stage" and "By country", hold the ladder and the Sankey; the ladder opens by default, and on the country tab the chosen country filters the Sankey's ribbons (`mock-a-1440-tab-country.png`). Nothing is removed. The cost is a narrower map, 974 px instead of 1,328, and a panel that scrolls inside the plate for the countries with long panels (the United States and Japan); Taiwan's fits.

Phone. The plate stacks: the chip row wraps to three lines, the caption stacks its two parts, the map bleeds to the edges with the site's existing nine-pixel dots (Taiwan's four in amber rings, town labels off), the strip runs five across, and the panel follows at full width. Then the tabs, the filters and the ladder. The first two screens hold the plate and most of the panel.

What would have to be built. The map, the overlay of stops, the strip, the panels, the Sankey, the filters, the toolbar and the ladder survive unchanged. The country buttons keep their markup and are restyled as chips (the meta and role lines are hidden by CSS). New: the caption line (one function reading the chosen role's text), the tab switch (show one of two containers, about fifteen lines, and a call to `fitPipe` when the Sankey tab opens so it draws at the visible width), and the map state CSS. The map already receives `data-cc` from `selectCountry`, so the stop and town highlighting and the strip highlighting are CSS alone; in the mock the chips are live and clicking one already swaps the panel and lights the stops. Each stop needs a `data-place` attribute with the town alone (the build has the town, it currently emits "Hsinchu, Taiwan" in `data-town`), and four of Taiwan's stops carry a label-side class because its towns sit within thirty pixels of each other; a general rule for label sides would be a small addition to the build.

## Mock B: Map plus table

Captures: `mock-b-1440-top.png`, `mock-b-1440-full.png`, `mock-b-390-top.png`, `mock-b-1440-top-dark.png`.

What it changes. The map is cropped to the band the chain occupies. Every stop and every route arc lies between latitude 60 north and 10 south (y 44 to 233 of the 412.6-unit drawing), so the viewBox becomes `0 24 1000 244` and the map runs 1,328 by 324 px, 59% of its former height, with the strip of fifteen stops under it exactly as now. The leverage list and the panel become one framed component: the list is the panel's own navigation column on the left, each row carrying the country's name, its measure right-aligned on the same line and its one-line role beneath, the chosen row filled to match the panel and joined to it by the amber bar; the panel sits at the right of the frame with no box of its own. The Sankey is dropped. The ladder follows under a heading "The firms, by stage" with its filters and toolbar unchanged. Three things remain in a stack, but the map is a band rather than a plate and the middle section is one object rather than two.

Phone. The band is 95 px tall at phone width, which shows the East Asian cluster as a clump of dots with Taiwan's four ringed; the strip beneath, five across, is the tappable list as it is today. The frame stacks, list then panel, with the measure moving under the name. Then the ladder. The first two screens hold the map, the strip and most of the list. If 95 px is too little map, the alternative is a band twice the phone's width that scrolls sideways, at 190 px tall; the mock does not do this.

What would have to be built. The map module emits the viewBox and the stops' percentage positions, so the crop is a change of two numbers there and the tops follow; the mock recomputes them from the existing percentages. The frame is CSS on the existing list and panel markup. Dropping the Sankey needs one guard in the suppliers script (`build` attaches a scroll listener to `#sup-pipe-scroll` without checking it exists; `drawPipe` and `fitPipe` already check). The strip, the panels, the filters, the toolbar and the ladder are unchanged; the stop highlighting is the same CSS as mock A.

## Mock C: Stages first

Captures: `mock-c-1440-top.png`, `mock-c-1440-full.png`, `mock-c-390-top.png`, `mock-c-1440-top-dark.png`.

What it changes. The ladder leads: under the title comes a head, "Stages, thinnest first", with a line of explanation, then the filters and toolbar, then the twenty rungs. Each rung carries, between its name and its firm names, a row of country tiles for its firms ("JP 6, AT 1, US 1" on Photomasks), sorted by count; the chosen country's tiles are filled ink, so Taiwan's presence at each stage reads down the page. The tiles are the site's two-letter country marks rather than flag emoji: the page reserves colour for severity, and twenty rungs of flag emoji would put more than a hundred spots of colour on it. The map, the strip, the country list and the panel follow as a "Where it happens" section, laid out as they are today; the Sankey is dropped. The page is only 114 px shorter than before, because the tile rows add about 500 px to the ladder and the where section is the current map and leverage stack.

Phone. The head, then the search field and the two selects stacked, the count and the toolbar, then the rungs, each with its tiles in a row under the head and the names beneath. The first two screens hold six rungs; the where section is a long way down.

What would have to be built. `buildLadder` gains the tile row (a count of firms by country per stage, about eight lines; the stage object already carries firms and a partial count by country). `selectCountry` gains one line to put the chosen code on the ladder so the tiles follow it. The where section is the existing markup under a new heading. Dropping the Sankey needs the same guard as mock B. The map, the strip, the roles, the panels, the filters and the toolbar are unchanged.

## Which to ship

Mock A. It is the only one of the three that turns the four pieces into one object: the reader chooses a country once, and the map, the caption, the panel and, through the tab, the Sankey all answer, which is what "the globe atlas thing" asks for. It cuts the page by a third without dropping anything, and it costs the least new code of the three that keep the Sankey, since the map state and the strip state are CSS on attributes the runtime already sets. Its two weaknesses are a map a quarter narrower than today's and inner scroll on the longest panels; if the author would rather not scroll inside the plate, the plate can grow to the panel's height and the strip can spread into three rows, at about 200 px of page. Mock B's band map is the best single visual of the three and would carry into A if the author wants the map taller: cropping A's map to the band gives 974 by 238 px, which is small, so the choice is a whole map at 974 wide or a band at 1,328 wide with the panel beneath. Mock C is the page a researcher wants once they know the list is there, but it does not answer the brief: it leads with controls, and its where section is the stack the author asked to lose.

## Files

- `README.md`: this file.
- `before-1440-light.png`, `before-1440-dark.png`, `before-390-light.png`, `before-390-dark.png`: the page as it is.
- `ref-chapter.png`, `ref-controls.png`, `ref-index.png`: the site's other pages, for the design language.
- `mock-a-1440-top.png`, `mock-a-1440-full.png`, `mock-a-1440-tab-country.png`, `mock-a-390-top.png`, `mock-a-1440-top-dark.png`: mock A.
- `mock-b-1440-top.png`, `mock-b-1440-full.png`, `mock-b-390-top.png`, `mock-b-1440-top-dark.png`: mock B.
- `mock-c-1440-top.png`, `mock-c-1440-full.png`, `mock-c-390-top.png`, `mock-c-1440-top-dark.png`: mock C.
- `mock/make.py`: builds the three mock pages from `dist/index.html`.
- `mock/grab.py`: evaluates a script on a page in headless Chrome; used to pull the ladder the site renders at runtime into mock C, and to measure page heights.
- `mock/ladder-rendered.html`: the ladder as the site rendered it, the input for mock C's tile rows.
- `mock/mock-a.html`, `mock/mock-b.html`, `mock/mock-c.html`: the mock pages. Open at `http://localhost:8843/mock-a.html#/suppliers` with `python3 -m http.server 8843 --directory qa/suppliers-redesign/mock`.
- `mock/data/`, `mock/print-title.png`: copied from `dist/` so the mock pages load as the site does.

Captures were made with `build/shoot.py`, light theme forced with `--eval "document.documentElement.setAttribute('data-theme','light')"`, six to seven seconds of wait for the fonts and the runtime.
