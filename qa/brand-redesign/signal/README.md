# Signal

Direction key `signal`, port 8864, DevTools port 9364. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `signal.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`, the monograph pattern on port 9364), and the captures: `01-home-1440.png`, `02-lithography-1440.png` (the chapter head), `02b-lithography-card-1440.png` (the chokepoint card, which sits below the 1100 px fold at this type scale), `03-suppliers-1440.png`, `04-home-phone-390.png`, `05-home-dark-1440.png`. No site source was touched.

## The direction

One saturated color owns the site. The world it draws on is the public-information poster and the industrial safety sign: a single ink on a pale ground, type set wide and heavy, hard edges, nothing decorative. That is a fair register for a reference on chipmaking, an industry that communicates in signal colors on gray machines, cleanroom yellow, the ultramarine of a Zeiss lens coating. The color is an ultramarine near International Klein Blue. It is the ground of the masthead, the fill of every chapter tile, the chosen state of every control, the accent in the specimen, and the Extreme band on the chain. Everything else is black on a pale neutral gray, and the body text and the data pages stay calm so the color remains a signal and never becomes noise. Rules are 2 px and black; tiles are solid; there are no shadows, no corner radii, no hairline preciousness.

The memorable choice is on the home page: the wordmark set huge across the top in the color, three lines of wide Archivo at 112 px, with the reading title in black beneath it, and then the seventeen chapter numbers as solid ultramarine tiles with white numerals running down the left edge of the page (a tile turns black once the chapter is read). On chapter pages the same tile opens the chapter (Chapter / 04 / Stage 4 of 15) beside a title at 72 px, the fifteen-stage strip becomes a row of solid bars in ultramarine and black, and the chokepoint card is a 2 px black box with a black head and solid tags. The overview box on the home page is a solid block of the color with white text.

Faces. Display is Archivo, a variable grotesk with a width axis, set at 118 to 125 percent width and weight 800; the wordmark at 125, titles at 118, KPI figures and tile numerals at 112. Labels are the same face at 110 percent width, weight 600, 10 to 11 px, tracked at 0.1 em, replacing the monospace everywhere (tabs, tags, table heads, chain numbers, captions' eyebrows). Body is Source Sans 3 at 19.5 px, a plain, readable sans that gives the wide display its contrast without adding a third voice. Not Inter, not Space Grotesk.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--signal` | `#1b2cc4` | `#1b2cc4` | the ultramarine; fixed in both themes because it carries white (9.5:1) |
| `--accent` | `#1b2cc4` | `#8a99ff` | the color as text: 8.6:1 on the light ground, 7.3:1 on the dark |
| `--signal-deep` | `#14219a` | | pressed and hover states on the color |
| `--bg` | `#f3f3f1` | `#0f1013` | the pale neutral ground |
| `--bg-3` | `#e2e2de` | `#22242a` | land on the map, pressed surfaces |
| `--ink` | `#0e0f12` | `#ececea` | text and every 2 px rule, 17.2:1 on the ground |
| `--ink-2` | `#3a3d44` | `#c4c6cb` | secondary text, 9.8:1 |
| `--muted` | `#5d6169` | `#9a9ea6` | labels and captions, 5.6:1 (4.9:1 on `--bg-3`) |
| `--line` | `#d3d3ce` | `#2b2d33` | the only tint rule, inside tables and rows |

Country colors `--c1` to `--c8` keep their hue order (blue, orange, green, yellow, violet, red, dark green, gray) and are retuned so none reads as the signal: JP moves from cobalt to a teal blue `#1f8bad`, KR stays violet `#7a3fb5`, CN red `#d6332e`; the dark set is lifted. The specimen reads `--stage-ink: 14, 15, 18` and `--stage-accent: 27, 44, 196` (dark: `236, 236, 234` and `138, 153, 255`). The chain bars: Extreme in the signal, High in black, Moderate and Low in `#b9b9b3`.

Font stacks:

- display: `"Archivo", "Archivo Black", "Helvetica Neue", Arial, sans-serif` at `font-stretch` 112 to 125 percent, weight 800
- body: `"Source Sans 3", "Public Sans", "Helvetica Neue", Arial, sans-serif` at 19.5 px, line height 1.55
- labels (the `--font-mono` slot): `"Archivo", "Helvetica Neue", Arial, sans-serif` at 110 percent width, weight 600, 0.1 em tracking

Measure: `--measure: 33em`, about 80 characters of Source Sans 3. The text column stays at `--col: 58%`; the masthead is 60 px.

## What changed beyond tokens

- Masthead: a solid band of the color with white type and no rule under it; the wordmark in wide Archivo caps, the tagline in the body face; the current tab is a white block with the color as its text; the search and theme buttons are square with a 2 px white border.
- Home: the wordmark drawn at 112 px in three lines above the title (a `::before` on the head, see the note below); the title drops to 42 px in sentence case; the overview box becomes a solid block of the color, its five sections as ruled rows (name in display at 19 px, one line beside it); the spine's numbers become 64 px solid tiles with the 2 px spine running through their centers, and the node is gone because the tile is the mark.
- Chapters: the tile is solid ultramarine with white numerals and labels; the title is 72 px wide Archivo; the compact chain is 18 px solid bars with the current stage underlined in the color; "In plain terms" sits between two 2 px ultramarine rules instead of a tinted box; "In short" loses its rail; citation numbers are in the color.
- Chokepoint card: a 2 px black box with a black head bar (white label, the two tags as solid blocks, Extreme in the color); KPI values in Archivo 800 at 30 px; 2 px dividers between the three KPIs and the two status columns; pips and country chips square.
- Data pages: titles in wide Archivo at 72 px sentence case; every button, chip, picker, tag, spec sheet, table wrap, figure and popover loses its radius, tint and shadow for 2 px black rules; pressed states fill with the color (country buttons on Suppliers, the chosen chip on AI Chips, the mode switch, Critical tags, the Shipping status); the atlas takes a 2 px rule above and below, the route in the color, the chosen stop card with a 3 px rule; the Suppliers panel's country code is a small solid tile.
- Dark theme: full token set; the masthead, tiles and overview block keep the deep ultramarine (white text stays at 9.5:1), while text in the color lifts to a periwinkle `#8a99ff` and the huge wordmark takes that lift so it does not sink into the ground. Captured through the site's own theme path (`cp-theme` in localStorage, then reload) so the specimen re-themes.

Checked beyond the captures: The Chain page top (how-to box, contents), AI Chips (picker), Export Controls (tabs, timeline, board), and the home page scrolled to chapters 01 and 02.

## What would need real work to ship

- The huge wordmark is a CSS pseudo-element with the text in `content`, so it is not in the document for screen readers or search (the masthead wordmark still is). A shipped build puts it in the markup as a decorative element before the h1, and can then fit it to the column width with a proper clamp per breakpoint instead of the three fixed sizes here.
- On chapter pages the sticky progress rail and the in-chapter strip both show when the head is at the top of the viewport; the rail is thinned to 10 px bars here, but a real build should suppress it until the reader scrolls past the strip.
- The chokepoint card sits about 1000 px below the chapter's top at this type scale, so the 1440 by 1100 head capture does not include it; `02b` is a second capture. If the author wants the card within the first screen, the compact strip's number row could go, which saves about 40 px, or the title could drop to 64 px.
- Export Controls keeps a few rounded pills from its own module (the Now button, the year cells, the category chips), which the override did not reach one by one; they want the same 2 px square treatment.
- `font-stretch` on Google Fonts' variable Archivo works in current Chrome, Safari and Firefox; the fallback faces are not wide, so a shipped version should self-host Archivo (and Archivo Black as a static fallback) so the wordmark never renders in Arial.
- In dark mode the deep ultramarine tiles sit on a near-black ground with low edge contrast; the white numerals carry them, but a dark build might lift the tile ground one step.
- The print stylesheet and the share cards under `cards/` still carry the old tokens.
