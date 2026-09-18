# Instrument

**Direction.** The site as the manual for a precision instrument: white ground, black ink, one signal color, and a visible grid of hairlines that hold the text, the chokepoint card and the specimen to the same edges. It draws on the world the chapters describe, the data plate riveted to a scanner, the label on a cleanroom gown, the printed procedure beside the tool, where nothing is decorated and every field is named. That is the right register for a reference on chipmaking: readers are policy staff and researchers who want to trust the numbers, and a data plate is the most trusted document in a fab. The one memorable choice is the chokepoint card, redrawn as that plate: a black title band carrying the two ratings, two fixing marks at the top corners, fields ruled in black and gray, values set in mono. Everything around it is quiet. The wordmark is set the way a model number is, mono, spaced, in a thin frame.

**Signal color.** Cobalt, the blue of a cleanroom gown, `#1e3fd6`. It reads at 7.7:1 on white, so it can carry small text (the Extreme rating, source numbers, the active tab underline) without a darker partner; `#12308f` is there for hover states. On the point cloud it is the accent triplet. Nothing else on the page is colored except the eight country fills on the Suppliers page, which stay distinguishable from each other and from cobalt.

## Tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` ground | `#ffffff` | `#0c0e11` |
| `--bg-2` panel | `#f6f7f8` | `#14171b` |
| `--ink` | `#0a0a0a` | `#f2f3f4` |
| `--ink-2` secondary | `#3d434b` (10.0:1) | `#c8ccd2` |
| `--muted` labels | `#5c6370` (6.1:1) | `#9aa1a9` (7.4:1) |
| `--line` hairline | `#dcdfe3` | `#262b31` |
| `--line-2` rule | `#9ea4ab` | `#4a525b` |
| `--accent` signal | `#1e3fd6` (7.7:1) | `#8fa4ff` (8.2:1) |
| `--accent-ink` | `#12308f` | `#b1c0ff` |

Country fills: `--c1 #0e9bc4` JP, `--c2 #ef6a1f` NL, `--c3 #2aa84a` TW, `--c4 #e0b000` DE, `--c5 #8b3fd0` KR, `--c6 #d9302c` CN, `--c8 #9aa0a6` other, US stays ink.

Fonts (Google Fonts, variable):

- display: `"Schibsted Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif` at 700, sentence case, tracked to -0.025em
- body: the same family at 400, 17.5px, line-height 1.58
- mono: `"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace` for labels, data, the plate values and the wordmark

Measure: `34em` of Schibsted Grotesk, about 68 characters. Text and stage split unchanged at `--col: 58%`.

## Beyond tokens

- Masthead: white, one black rule under it; the wordmark is a framed mono model number; the active tab is a cobalt underline instead of a filled block.
- Grid: black rules open every chapter and every landscape head; the specimen has a hairline on its left edge and its caption sits bottom-left over a hairline instead of centered; the wafer grain on the ground is gone.
- Home: the title in sentence case; the "What the site covers" box is no longer a box but a ruled strip between two black lines, five columns split by hairlines, each name a mono field with a cobalt arrow.
- Chapter head: the number tile is an outlined box, the title sentence case, "In plain terms" a cobalt hairline in the margin instead of an amber panel.
- The plate, as above. Ratings: Extreme and Very hard in cobalt mono; the head tags are white on black, cobalt filled at band 4.
- Every corner squared: tabs, buttons, chips, filters, tooltips, panels, the search dialog.
- Dark theme kept: black ground, near-white ink, a lighter cobalt that still passes for small text.

## What would need real work to ship

- The plate's black band and fixing marks are pure CSS on the existing markup; the values inside are still the site's own text, so long cost strings wrap in mono at 13px and would want a short form in the data.
- The Suppliers pipeline and atlas draw their own SVG with sizes in code; they take the tokens but their label sizes and the accent squares were not retuned for the new mono.
- The 220 supplier names use the display face at 500; at the new grotesk they run a little longer per line, worth a pass on the ladder's column widths.
- The dark theme is a token swap, not a designed pass; the black title band becomes a gray band there, and the share cards and print stylesheet were not retouched.
- The mono wordmark frame is sized for one line; on phones it drops to 11px and would want a shorter mark or a two-line lockup.

## Files

- `site/` is `dist/` with the font link swapped and `<style id="instrument">` appended to `<head>`; the same CSS is kept apart in `instrument.css`. Serve with `python3 -m http.server 8852 --directory qa/brand-redesign/instrument/site`.
- `01-home.png` home top, 1440 by 900. `02-lithography.png` the Lithography head with the card entering the frame, 1440 by 1100. `02b-lithography-plate.png` the whole data plate, an extra. `03-suppliers.png` Suppliers top. `04-home-phone.png` home at 390 by 844. `05-home-dark.png` the dark theme.
- `shoot-instrument.py` is `build/shoot.py` with Chrome's debug port moved from 9333 to 9852. With four designers capturing at once, the shared port made one shoot attach to another designer's Chrome and save their page under my name; every capture here was retaken on the private port and checked by eye.
- The specimen column is blank in every capture, as it is in `current-home.png`: headless Chrome here has no WebGL, so the point cloud does not draw. Its colors come from `--stage-ink` and `--stage-accent` and were not seen rendered.
