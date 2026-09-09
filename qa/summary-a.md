# Summary A — map first

`#/summary-a`. Files: `build/modules/summary-a.js`, `src/modules/summary-a.js`, `src/modules/summary-a.css`.

## What the page does

One scrolling page, in four moves.

**1. Lead and map.** One sentence: fifteen stages, seventeen countries, seven stages at 5 of 5. Then a
world map drawn as inline SVG. The land is filled and the coast drawn on top, the same treatment the
globe specimen uses. All 24 towns are pinned: nineteen chokepoint towns in copper, sized by the
chokepoint score of the stage they belong to, and the five towns building substitutes as dark rings.

Nine countries carry a marker: United States, Netherlands, Germany, Japan, Taiwan, South Korea,
China, Malaysia, Singapore. Marker area is proportional to the number of chapter cards that name the
country; a heavier ring means at least one stage scored 5 of 5 names it. East Asia and north-west
Europe are too crowded for markers at world scale, so those markers are fanned out over open water
and joined to the country by a leader line. Clicking a marker, a town pin or a country chip opens
that country's panel: beside the map on desktop, under the map on phones, where it also scrolls into
view. Seven more countries the data supports (United Kingdom, Israel, India, France, Austria,
Switzerland, Thailand) get a chip but no marker, under "Also in the chain".

The panel is one headline sentence, up to three country shares with a bar, up to three chapter cards
with the card's own note, and a footer line with the firm count and the towns. China gets an extra
block: the first sentence of `chinaStatus` from Geopolitics, Lithography and the first 5-of-5 stage
that names China. Every line links to its chapter or page. On desktop the panel is capped to the
screen and scrolls inside itself.

**2. The chain in one strip.** The fifteen stages, chapter 02 to 16, as buttons with the chokepoint
score as bar height in `--bar-5/4/3`. Hover, tap or keyboard focus fills the block below with that
chapter's `plain` paragraph, its leaders with country codes, and a link to the chapter.

**3. Four numbers**, all computed, never typed: stages at 5 of 5 (seven), firms building EUV scanners
(one, ASML of Veldhoven, against the Netherlands' 100% of that segment), the share of chokepoint
towns on Taiwan or in Korea (26%, five of nineteen), and the latest China revenue share for the
largest equipment vendor in the supplier list (ASML, 29.1% in FY2025).

**4. Call to action** to `#chain`, with AI Chips, Export Controls and Sources.

## Where the data comes from

Everything on the page is computed at build time from `ctx.data` and the chapter front matter.

- `ctx.data.chapters` — score, `plain`, `leaders`, `countries` with their notes, `chinaStatus`.
- `ctx.data.matrix` — country shares by segment, with the year and the rank inside each segment. A
  table in the build module maps each of the 20 segments to the chapter it belongs to; an unmapped
  segment warns at build time.
- `ctx.data.suppliers` — firm counts by country and by category, `revenueUSDb` for "largest
  equipment vendor", and the EUV scanner count (category Lithography, subcategory naming both EUV
  and scanners).
- `ctx.data.exposure` — the latest filed China revenue share for that vendor.
- `specimens/globe.js` — parsed at build time for the coastline rings, the SITES list with the
  chapter number in each trailing comment, and the SUBS list. The map and the 3D globe therefore
  cannot drift apart; if the arrays stop parsing, the module warns and renders nothing rather than
  shipping a stale copy.

Two things are editorial rather than sourced, and are marked as such in the module: which country
each pinned town stands in (the site's own globe caption already groups the Taiwan, Korea and Japan
towns this way), and where each marker sits when it is nudged off its country.

The projection is a plain equirectangular one cropped to 130W-156E, 72N-46S, the window that holds
every town in the chain. Checked with `isPointInFill`: 21 of the 24 towns land inside a land polygon.
The three that do not, Kaohsiung, Singapore and Abu Dhabi, are coastal towns that the 670-point
outline cuts inside, the same limit the globe specimen has.

## Checks

Built with `node build/build.js`; no warnings from this module, no console errors.

- 375 px: no horizontal overflow (`scrollWidth` 375), map runs full bleed at 375x157, markers 18-22 px
  and none overlapping, country codes hidden and the chip row carries the names.
- 1280 px: map 784x324 with the panel 372 px beside it; panels 556-629 px tall, inside the screen cap;
  China scrolls inside its panel.
- All 23 distinct links resolve to a chapter id or a known view.
- Every interactive element has an accessible name; markers carry an explicit `aria-label`; town pins
  are click targets but not tab stops, since markers and chips reach every country from the keyboard.
- Clicks, focus and hover all switch the panel and the stage detail; the 3D stage canvas stays hidden
  (`CP.register('summary-a', { stage: false })`).
- Light and dark both resolve from tokens; no colour is hard-coded. Transitions are dropped under
  `prefers-reduced-motion`.

## With more time

- Town labels. The map pins the towns but cannot name them at world scale; the panel lists them
  instead. A callout layout for the selected country's towns would be the single biggest gain.
- Country outlines. The globe specimen carries continent rings, not borders, so a country is a
  marker rather than a shape you can click on the land itself. Real borders would let a reader click
  Japan rather than Japan's marker.
- A second encoding on the map: colour each marker by the hardest stage it holds, or draw the pins as
  proportional bars rather than dots, so the map carries the chokepoint score as well as presence.
- Deep links (`#/summary-a/tw`) so a country panel can be shared, and a back-button history entry.
- The seven chip-only countries deserve a small dot on the map; they need coordinates the site does
  not yet hold, so they are chips for now.
- A compare-two-countries mode, which the panel data already supports.
