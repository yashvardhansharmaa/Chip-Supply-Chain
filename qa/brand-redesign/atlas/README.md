# Atlas

## The direction

The site is set like a mid-century scientific atlas, the kind a university press printed for geology or oceanography: cool stone paper, ink-blue rather than black, ruled margins, a running head with a double rule, and every drawing numbered and captioned. The home page is the frontispiece, each chapter is a numbered plate with its chokepoint card set as a numbered table, and the Suppliers map is Plate B inside a neatline (a double border) with a legend across its head and its caption beneath the map, the way an atlas sets them. One color from cartography, a dull vermilion, is reserved for the thing the eye must find: the chosen country on the map, the Extreme rating, the Critical firm. Everything else is ink, stone and a pale sea-blue tint. It suits the subject because the site is a reference work about a physical process spread across a map; an atlas is the format readers already trust for exactly that, and it looks nothing like a generated landing page.

## Token sheet

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#e8ecec` | ground, cool pale stone |
| `--ink` | `#1b2536` | text, rules, the plate frame (ink-blue) |
| `--ink-2` | `#33405a` | secondary text |
| `--muted` | `#56627a` | labels and captions (5.15:1 on the ground) |
| `--line` / `--line-2` | `#bfc9ce` / `#9fadb5` | hairlines |
| `--accent` | `#b8432a` | vermilion, for marks and rings; 4.55:1 on the ground |
| `--accent-ink` | `#8c2f1c` | vermilion for small text (6.95:1 on the ground) |
| `--tint` | `#cbd8de` | the atlas ocean and other fills |
| `--land` | `#ddd9cb` | the atlas land, map only |

Country colors, a cartographic set of eight (light theme): `--c1` Prussian blue `#2e5d9f` (Japan), `--c2` teal `#237f82` (Netherlands), `--c3` viridian `#3d8a4e` (Taiwan), `--c4` ochre `#b8901f` (Germany), `--c5` mulberry `#6b4b9a` (South Korea), `--c6` wine `#7e2b45` (China), `--c7` sienna `#8a5a2b` (Malaysia, Singapore), `--c8` slate `#7a8590` (other). Each is lightened in the dark theme. The wine is kept well away from the vermilion so the accent stays unique.

Fonts, all from Google Fonts:

- Display: `"Bitter", "Zilla Slab", "Roboto Slab", Rockwell, Georgia, serif`. Bitter is a Clarendon-flavored slab with bracketed serifs and real weight; it was drawn for screens, holds at 60 px without looking like a poster, and it is the closest thing on Google Fonts to the slab that atlas plates were titled in. Roboto Slab is too even, Zilla Slab too soft, Libre Caslon too delicate beside a map.
- Body: `"Source Serif 4", "Source Serif Pro", Charter, Georgia, "Times New Roman", serif`. A transitional text face with the same sturdy serif construction as Bitter, so the two read as one family without being one. It was already a fallback in the site.
- Labels and figures: `"Alegreya Sans SC", "Source Sans 3", "Gill Sans", "Trebuchet MS", sans-serif`. A true small-caps humanist sans for running heads, plate and figure numbers, table heads and the map legend; it replaces the monospace stack everywhere, and the uppercase transform is removed so the labels are set as small caps, not spaced capitals.

Measure: `--measure: 34em` of Source Serif 4 at 18.5 px (about 88 characters); the text and stage split (`--col`) is unchanged.

## What changed beyond tokens

- Running head: the masthead is solid ground with an ink rule and a second hairline 3 px below it, the double rule of a running head. The wordmark is Bitter in title case with the tagline in italic; the tabs are small caps with an ink underline for the current page instead of a filled pill.
- Ruled margins: a fixed hairline 20 px left of the text column, and a hairline between the text and the specimen. Both are removed on phones.
- Plates and figures, set with CSS counters and generated text: the home page carries a "Frontispiece" running head above the title, and each step of the walk is "Fig. 01" on the spine. Each chapter's tile reads "Plate 04" inside a double-ruled box, and the chokepoint card is "Table 4. Chokepoint card" with a double rule above, a single rule below, no fill and no shadow. The data pages are lettered: "Plate A" (AI Chips), "Plate B" (Suppliers), "Plate C" (Export Controls) and "Index" (Glossary).
- The Suppliers atlas: the section is a plate inside a neatline (border plus offset outline), "Plate B. The route of one chip" heads it, the country buttons are a map legend (a colored key square before each name, the chosen country underlined in ink), the ocean is the tint and the land a buff, the graticule is ink at low opacity, and the caption is moved below the map with flex order. The stops keep their country rings; the chosen stops ring in vermilion.
- Every corner is squared and every shadow removed. Boxes that used a filled ground (the overview table on the home page, the how-to box, the figure frames, previous and next, the In plain terms note) become ruled blocks: double rule above, single rule below, no fill.
- The severity tags in the country panel and the plate tags are outlined words in vermilion rather than filled blocks. The chain strip keeps its bars; Extreme stays vermilion because that is the site's severity rule.
- Dark theme: a night atlas, ink ground `#151b25`, stone-colored text `#e6e4dc`, the vermilion lifted to `#e2694e` with `#ee8b73` for small text, and the eight country colors lightened.

## What would need real work to ship

- The "Table 4" number comes from a CSS counter over `.chapter` elements in document order; chapters 16 and 17 carry no card, so this holds, but the build should write the number into the markup rather than rely on order.
- The plate letters and the Frontispiece head are generated text (`::before` content). They should be real markup so screen readers and search see them, and so the print stylesheet can use them.
- The Suppliers caption is moved beneath the map with flex `order`; on the phone stack the source order is still bar, caption, body. The build should emit the caption after the body.
- The legend of twelve countries fits one line at 1440 but wraps to two below about 1300 px wide; a shorter label set or a two-row grid would be the shipped answer.
- The home page overview keeps its five columns; "Export Controls" wraps to two lines while its neighbors take one. A balanced grid or a slightly narrower column gap would settle it.
- The masthead's second rule is a box-shadow; it should be a border on a pseudo-element.
- The label stack replaces monospace everywhere. Alegreya Sans SC has tabular lining figures, so the KPI and table numbers align, but code-like values (`.prose code`) fall to Source Sans 3, which is not loaded in this pass; the shipped version would load it or keep a mono face for code only.
- The 3D specimen does not render in the headless captures (no WebGL), so the plate captions and the specimen's recolored points (`--stage-ink` and `--stage-accent` are set) are untested here.

## Captures

`01-home-1440.png` (home, light), `02-lithography-1440.png` (the chapter head; the card sits below the fold at 1100 px, so `02b-lithography-card-1440.png` captures it), `03-suppliers-1440.png`, `04-home-phone-390.png`, `05-home-dark-1440.png`. The override lives in `atlas.css`; `inject.py` swaps the fonts link and places it at the end of `<head>` in `site/index.html`. Serve with `python3 -m http.server 8854 --directory qa/brand-redesign/atlas/site`.

Note for other designers: `build/shoot.py` uses a fixed DevTools port (9333), so two shooters running at once capture each other's Chrome. This pass used a private copy on port 9454.
