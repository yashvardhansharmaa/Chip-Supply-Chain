# Darkroom

## The direction

A lithography bay is lit the way a darkroom is: low, warm and even, so the only bright things in the room are the ones being worked on. Darkroom lights the site that way. The ground is a blue-black graphite, the text a warm off-white, and every specimen renders pale on the dark ground with its amber thread glowing the color of the bay's sodium safelight. The site keeps its accent, but the accent now earns its place: amber is the light the machine works by, and on this ground it reads as light rather than as a swatch. The one choice a reader remembers is that the specimen column is the stage in every sense. It sits on its own side of a hairline with a pool of light under the render and a specimen label at its head, while the text column is a quiet reading panel beside it. The home page opens on the render: the reading panel narrows to half the window so the die floorplan has the room. Display type is Barlow Condensed, a narrow face with the authority of an instrument nameplate; body is Source Serif 4, which holds its weight in light on dark at 19 px; labels are JetBrains Mono. A light theme stays behind the toggle, a warmed wafer grey with the same amber taken down to a darker ink for small text.

## Tokens

Dark (default) and light, as set in `:root[data-theme]`.

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| `--bg` | `#0f141a` | `#f1efea` | ground: graphite blue-black; warmed wafer grey |
| `--bg-2` | `#151b22` | `#e8e6e0` | panels, cards, the map |
| `--ink` | `#ece6da` | `#15191d` | text, 14.9:1 on the ground (15.4:1 light) |
| `--muted` | `#918b80` | `#5f656c` | labels and captions, 5.5:1 (5.1:1 light) |
| `--line` | `#242c35` | `#d3d0c8` | hairlines |
| `--accent` | `#f2a93b` | `#b8760a` | sodium amber: bars, rules, Extreme; 9.3:1 dark, 3.2:1 light (large and fills only) |
| `--accent-ink` | `#f6c06a` | `#7a4f05` | amber for small text: 11.2:1 dark, 6.2:1 light |
| `--stage-ink` / `--stage-accent` | `236,230,218` / `242,169,59` | `21,25,29` / `184,118,10` | the point cloud |

Country colors, dark: `#5b9df0 #f0855c #34cfb0 #f2c14e #a495f2 #f26a6a #79c45a #8c959e` (c1 to c8); light keeps the site's set with the yellow and greens deepened for the paper.

Font stacks:

- Display: `"Barlow Condensed", "Archivo Narrow", "Arial Narrow", "Helvetica Neue", Arial, sans-serif` (500, 600, 700)
- Body: `"Source Serif 4", "Iowan Old Style", Georgia, "Times New Roman", serif` (variable; weight 430 in dark, 400 in light)
- Mono: `"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` (400, 500, 600)

Measure: `34em` of Source Serif 4 at 19 px. Column split unchanged at 58%, except on the home page where the reading panel drops to 50% so the stage is wider.

## What changed beyond tokens

- `<html>` carries `data-theme="dark"` so the site opens dark; the existing toggle and the `?theme=light` boot script switch to the light set unchanged.
- The stage: a hairline on its left edge, a radial pool of amber light under the render (`.stage::before`), the specimen tag with a short amber rule under it, and the caption moved to the lower left in a 44-character column instead of centered.
- Masthead: uppercase condensed tabs with an amber underline for the current page, no filled pill; the toggle and search buttons squared.
- Home: title in Barlow Condensed 700 at up to 82 px; the "What the site covers" box loses its fill and border and becomes a ruled band, the five names as tracked condensed capitals with no chips.
- Chapter head: the numbered tile loses its box and becomes a plate number in amber over a hairline; the title is uppercase condensed; the "In plain terms" panel keeps a single amber edge.
- Chokepoint card: squared, a 2 px amber rule at the head only, the head label in amber, KPIs in condensed 600.
- Radii removed from cards, buttons, tips, tables and pickers; the fixed chain rail and the compact chain use the amber for the current stage marker.
- Data pages: uppercase condensed page titles, unfilled picker buttons, amber sub-tab marker, a faint amber halo on town pins in dark only.
- Phones: the specimen strip at the foot gets a top hairline and a short amber wash from the left; the plate number and titles are sized down.

## Captures

1. `01-home-1440.png` home at 1440 by 900, dark (the default)
2. `02-lithography-1440.png` the Lithography head at 1440 by 1100; `02b-lithography-card-1440.png` the chokepoint card, which sits below the fold of the head at this height
3. `03-suppliers-1440.png` Suppliers at 1440 by 900
4. `04-home-phone.png` home at 390 by 844
5. `05-home-light-1440.png` home in the light theme, via `?theme=light`

Captures were taken with a scratch copy of `build/shoot.py` that swaps `--disable-gpu` for `--use-angle=swiftshader` and runs on its own debugging port. With the stock flags headless Chrome has no WebGL, the site hides the stage, and the specimen that this direction is built around does not appear. `build/shoot.py` itself is untouched.

## What would need real work to ship

- The narrower reading panel on the home page is done with `body:has()`, which the site's own layout should set from the router instead.
- `--body-weight` is a new token the override uses on `body`; the site's stylesheet would need to adopt it (or set Source Serif 4's weight per theme in `styles.css`) rather than carry a second rule.
- The "What the site covers" band is five columns in a half-width panel at 1440, so the descriptions run narrow; a shipped version should reflow it to a two-plus-three or a stacked list under 1280 px.
- The chain rail and the compact chain bars use light grey for High concentration; on dark they are quieter than before but the four-band scale should be re-tuned on the real tokens, with the specimen renderer's depth fade checked on the dark ground.
- The point renderer's near-black points on the light theme are a plain swap of `--stage-ink`; the glow under the stage is invisible in light and could be dropped there.
- Every SVG chart in the chapters, the Export Controls board and the China exposure charts inherit tokens and were not individually checked in dark.
