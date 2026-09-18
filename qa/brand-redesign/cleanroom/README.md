# Cleanroom

Direction key `cleanroom`, port 8862, DevTools port 9362. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `cleanroom.css`, the script that rebuilds `site/index.html` from the copy (`inject.py`, re-runnable), a private copy of the capture script (`shoot.py`, with SwiftShader WebGL on so the specimens render) and the captures: `01` home, `02` the Lithography opening, `02b` the same chapter scrolled to its chokepoint card, `03` Suppliers, `04` the phone, `05` dark. No site source was touched.

## The direction

The world inside a fab, set with the calm of a Japanese technical catalog. A cleanroom is the quietest industrial space there is: green-white glass, filtered light, tool panels in anodized aluminum with a faint mint tint, and every label a small capital sans with wide tracking. Chipmaking is usually shown as neon renders and dashboards; the people who make chips see this instead, and a reference on the subject can borrow their room. The ground is the green-white of cleanroom glass, the ink a deep charcoal, and the one color is the verdigris of the tool panels, used for outlines rather than fills. Corners are square, rules are thin and green, and everything sits on an 8 px grid: the masthead is 64, gutters 16 and 24, the chapter number 144, the card padding 24. There is no red and no amber anywhere, not even for Extreme; the site's severity color is the same verdigris, dark enough for text where it has to carry a word.

The one thing to remember is the figure. Chapter numbers are drawn as large outlined numerals, stroke and no fill, in the accent: 144 px at the top of every chapter and 64 px in the margin of the home page, where the numeral you are reading takes a pale fill and the ones you have passed fade to a grey outline. The same grammar runs the fifteen-stage strip: fifteen thin outlined cells with the stage number inside, concentration as a tint from the floor of the cell, and the current stage filled solid, the way a tool status panel lights one bay. On Suppliers the map is two greys, land and sea, and only the chosen country's stops and cards turn verdigris.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#f2f5f3` | `#161b1a` | ground, cleanroom glass |
| `--bg-3` | `#dfe6e2` | `#252c2a` | land on the map |
| `--ink` | `#1d2325` | `#e6ecea` | text, 14.5:1 on the ground |
| `--ink-2` | `#414b4e` | `#bcc6c2` | secondary text, 8.2:1 |
| `--muted` | `#566362` | `#8f9c98` | labels, captions, 5.5:1 (4.8:1 on `--bg-3`) |
| `--line` / `--line-2` | `#d3dbd6` / `#b9c5be` | `#2b3331` / `#3b4542` | hairlines |
| `--accent` | `#4fa48e` | `#6fbfa9` | verdigris: outlines, the filled cell, the chosen country; not used alone for small text |
| `--accent-ink` | `#26695a` | `#8fd3be` | the darker green for words: Extreme, labels, links, 5.9:1 light and 10:1 dark |

Tints of the accent at 14, 28 and 50 percent (`--accent-soft`, `--accent-2`, `--accent-3`) carry the four concentration bands inside the cells. Country colors, with the red and the amber gone: JP blue `#3a6fc4`, NL sienna `#8b5a2b`, TW leaf `#4d7d1c`, DE cyan `#14788f`, KR violet `#7b3fa0`, CN mulberry `#a0387a`, Other grey `#8e9a95`, US stays ink; the dark set is lifted. The specimen reads `--stage-ink: 29, 35, 37` and `--stage-accent: 63, 150, 128` (dark: `230, 236, 234` and `111, 191, 169`).

Font stacks:

- display: `"Zen Kaku Gothic New", "Noto Sans", "Hiragino Sans", "Helvetica Neue", Arial, sans-serif` at weights 300 to 500, never bold
- body: `"Noto Sans", "Zen Kaku Gothic New", "Hiragino Sans", "Helvetica Neue", Arial, sans-serif` at 17.5 px / 1.68, with the ledes and "In short" at weight 300
- data and labels (the `--font-mono` slot): `"IBM Plex Mono", "Roboto Mono", ui-monospace, "SF Mono", Menlo, monospace` at 400, with 0.14 to 0.2 em tracking on every small capital

Measure: `--measure: 36em` at 17.5 px, about 78 characters of Noto Sans. The text column stays at `--col: 58%`.

## What changed beyond tokens

- Masthead: 64 px, solid ground, no blur, a verdigris hairline under it; the wordmark in spaced capitals of Zen Kaku Gothic New with the tagline in mono; the tabs lose their filled pill and take a 2 px green underline for the current page; the two icon buttons are square and outlined in the accent.
- Home: the title in Zen Kaku Gothic New at weight 300 and 66 px, sentence case; "What the site covers" stops being a box of five chips and becomes five numbered catalog rows under one green rule (the numbers are CSS counters, so the markup is untouched). Each chapter's number is drawn as a 64 px outline in the margin, the node on the spine is gone, and the spine fills green as you read.
- Chapters: the chapter tile loses its border and becomes the 144 px outlined figure with "Chapter" and "stage 4 of 15" beneath it, top aligned with the title; the compact chain becomes the outlined-cell strip with the current stage filled; "In plain terms" trades its tinted box for a green rule above; "In short" keeps a 1 px green rule at its left.
- Chokepoint card: no fill, no shadow, no corners; a 1 px verdigris outline with hairline dividers inside, the KPI values in Zen Kaku Gothic New at 30 px, Extreme and Very hard in the dark green, and the two tags as outlined cells with the Extreme one tinted.
- Data pages: page titles at weight 300; the atlas, spec sheets, how-to block, figures, tables, previous/next, chips, pickers, filters and every button lose their radius and tinted fills; pressed states fill with the accent and keep charcoal text. On Suppliers the country buttons are outlined cells (the chosen one filled), the map is two greys with grey stops, and the chosen country's stops, town labels, strip cards and share bars go verdigris.
- Dark theme: full token set, the same layout, accent lifted so it clears 8:1 on the dark ground.

Checked beyond the six captures: The Chain page top (how-to block and contents), AI Chips (the picker, whose checkboxes are now square and green; the US and CN makers keep a blue and a mulberry border from the country colors), Export Controls (the timeline with its outlined year figures, the category chips, the board). Nothing broke.

## What would need real work to ship

- The outlined numerals rely on `-webkit-text-stroke`, which every current browser supports but which is not a standard property; a shipped version should draw the two figures as an inline SVG per chapter, or self-host a face with a real outline style.
- The compact strip's numbers sit inside 28 px cells at 9 px mono; that is at the floor of legibility, and a real build would give the strip 32 px cells and drop the number in the fixed rail (as the override already does) rather than shrink it.
- On phones the chapter number falls to 88 px above the title and the strip is hidden (as in the base); the home keeps a 32 px outlined figure in a 40 px margin. That works but a shipped phone layout should decide whether the figure or the strip is the chapter's mark on small screens.
- Between 900 and 1100 px the 160 px figure column plus the title is tight; the override steps the figure to 112 px there, and a real build would move the figure above the title at that width.
- The print stylesheet and the share cards under `cards/` still carry the old tokens; the specimen captions still say "the amber strip" and "the amber thread", which is copy, not CSS.
- The China exposure matrix and the AI Chips picker were only touched through tokens and the rule sheet; they read correctly but have not been tuned line by line.
