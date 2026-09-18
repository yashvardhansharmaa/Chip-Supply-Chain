# Specimen colors (18 Sept 2026)

The site's accent is now garnet, but the 3D specimens are not. Each specimen declares the color its highlighted element has in life, and the renderer, the social cards and the PDF cover all draw from that declaration. Only the two figures that are diagrams rather than objects (the cost stack and the globe's pins) use the site's garnet.

Screenshots from this pass are in `qa/specimen-colors/` (home, Lithography, Deposition and etch, Memory and HBM, Substrates, Data centers and power, each in light and dark, 1440 by 900 with WebGL on). Cards: `build/assets/cards/lithography.png`, `memory-and-hbm.png`, `data-centers-and-power.png`. Cover: `build/assets/print-title.png`.

## The color table

Light-ground hex is what the page draws on the warm white; dark-ground hex is what it draws on the dark theme and what the social cards use. Where a specimen has two elements that matter, the second is on the `accent2` channel.

| Specimen | Element | Color | Light | Dark | Justification |
|---|---|---|---|---|---|
| die-floorplan (01) | die-to-die interface strip | copper | `#b0662c` | `#e09a5c` | The link is a field of copper micro-bumps and the copper bus behind them. |
| boule-and-wafer (02) | the wafer on its rim | silver, leaning blue | `#6f8ba6` | `#c3d3e2` | A polished wafer is a mirror; it shows the cool white of cleanroom light with the faint blue of its native oxide. |
| gas-cabinet (03) | the gas panel | stainless steel | `#758490` | `#c6ced5` | Electropolished 316L stainless: VCR fittings, valve blocks, regulator and gauge bodies. |
| euv-scanner (04) | the 13.5 nm beam | pale blue-violet | `#6b7fd1` | `#a7b4f5` | 13.5 nm light is invisible; the convention for drawing an EUV beam is the short-wave end of what the eye sees. |
| euv-scanner (04), accent2 | the tin plasma | violet-white | `#9a7ee0` | `#dcd0ff` | The source plasma glows violet-white to the eye from tin's visible lines. |
| photomask (05) | the Mo/Si multilayer | dark steel blue | `#3e5468` | `#8ea7c0` | The multilayer reflects only at 13.5 nm; to the eye it is near-black with a faint blue sheen. |
| process-chamber (06) | the plasma | violet | `#6d5cc9` | `#b0a4f0` | An argon or fluorocarbon etch plasma glows violet to blue from argon's and fluorine's visible lines. |
| sem-column (07) | the electron beam | phosphor green | `#3a9a5f` | `#86e3a8` | An electron beam has no color; the convention is the green of the phosphor screen it lit on older microscopes. |
| gaa-transistor (08) | the gate wrap | gold-bronze | `#a5822a` | `#d8b556` | The gate is titanium nitride work-function metal, gold-bronze in bulk, around a tungsten fill. |
| foup (09) | the picked-out wafer | silver, leaning blue | `#6f8ba6` | `#c3d3e2` | Polished silicon, as above. |
| foup (09), accent2 | shell, roof and door | grey-blue polycarbonate | `#8ea2b8` | `#a9bccf` | Translucent polycarbonate reads as a grey-blue haze; drawn at low alpha so it stays see-through. |
| hbm-stack (10) | base die wiring, micro-bumps, TSVs | copper | `#b0662c` | `#e09a5c` | Electroplated copper; the through-silicon vias are now on the accent channel too. |
| hbm-stack (10), accent2 | the molding shell | black | `#2b2724` | `#6b655f` | Epoxy molding compound is black; on the dark ground it is a mid grey so the shell still shows. |
| cowos-exploded (11) | the interposer | silver, leaning blue | `#6f8ba6` | `#c3d3e2` | Bare polished silicon. |
| cowos-exploded (11), accent2 | RDL wiring and micro-bumps | copper | `#b0662c` | `#e09a5c` | Electroplated copper. |
| substrate-layers (12) | the build-up film | olive green | `#6f7a2f` | `#b2bd60` | Ajinomoto build-up film is an olive-green to brown epoxy sheet. |
| substrate-layers (12), accent2 | traces, through-holes and pads | copper | `#b0662c` | `#e09a5c` | Electroplated copper; these were ink before and now read as the metal they are. |
| probe-card (13) | the four dies under test | blue-violet | `#5b6fae` | `#aab6ea` | A patterned die under white light shows thin-film interference in its passivation, a blue-violet iridescence, unlike a bare wafer. |
| gpu-baseboard (14) | the NVLink switch lids | nickel | `#7f8a93` | `#c9d1d7` | The switch package lid is a nickel-plated copper heat spreader; it shows nickel's cool silver. |
| rack (15) | the busbar and its clips | copper | `#b0662c` | `#e09a5c` | Bare copper bar. |
| rack (15), accent2 | the power shelves | grey steel | `#6e7378` | `#b9bec3` | Grey painted steel sleds. |
| wafer-cost (16) | the memory tier | garnet | `#7a1f2b` | `#c9536a` | A chart, not an object: the site's own color. |
| globe (17) | the chokepoint pins | garnet | `#7a1f2b` | `#c9536a` | A diagram, not an object: the site's own color. |
| package (AI Chips view) | wafer-scale square, HBM top dies | silver, leaning blue | `#6f8ba6` | `#c3d3e2` | Bare silicon: the square cut from the wafer and the exposed top die of each stack. |
| wafer (glossary view, PDF cover) | the picked-out reticle field | faint blue | `#5a86b4` | `#a9c6e4` | A polished wafer is mirror silver; the field carries the faint blue of the anti-reflective coating under its resist. |

The cooling manifolds on the rack (blue cold, red hot) stay in ink: the rack's two channels went to the power path, which is what its caption and chapter are about. If a third element is ever wanted there, it is a third channel, not a swap.

## The renderer change

`src/kit.js`

- The cloud format gains a third channel. `w` in `[0,1]` is ink, `[2,3]` is the accent (unchanged; `w = 3` is a full accent point), and `(3,4]` is the second accent. `PC.accent2(c, a)` writes `3 + a` with `a` floored at 0.02 so no point lands on exactly 3. Every existing cloud is valid as before.
- A specimen's returned object may carry `accent: [r, g, b]` (0 to 255), optional `accent2`, and optional `accentDark` and `accent2Dark`. A specimen that declares none takes the CSS accent for both channels, as before.
- `PC.lift(rgb, minL)` is the dark-theme rule (below). `PC.resolveColors(spec, dark)` returns `{accent, accent2}` for the given ground or `null` when the specimen declares nothing. Both run in Node, so the cards and the cover resolve the same colors the page does.

`src/app.js` (`Stage`)

- The vertex shader gains `uniform vec3 uAcc2` and a three-way branch on `w`.
- `Stage.build` keeps the specimen's four color fields on the slot. `Stage.slotColors(slot)` resolves them once per theme (cached on the slot; `refreshColors` clears the cache). `Stage.draw` passes the slot's accent as `uAcc` and its second accent as `uAcc2`, falling back to the CSS `--stage-accent` for both when the specimen declares none.
- `Stage.refreshColors` still reads `--stage-ink` and `--stage-accent` from CSS and now also records whether `data-theme="dark"`.

`build/cards-art.js` prints `colors: PC.resolveColors(s, true)` in its JSON line (dark ground, as the card is dark). `build/cards.py` draws three colors: ink, accent, accent2; the card's own accent (the rule under the title, and the fallback for a specimen that declares nothing) is now the dark-ground garnet `#c9536a`. `build/cover-export.js` writes a `<bin>.json` sidecar with the light-ground colors and `build/cover-art.py` reads it; `--accent`, `--accent2` and `--accentgain` override (the old `--amber` and `--ambergain` still work as aliases). The wafer's field on the cover is now the faint blue above, and the seal-ring cue is unchanged.

Captions: every `specimenCaption` in `content/*.md` that named a color now names the one drawn (nothing else in those files changed), and the fallback captions inside `specimens/*.js` match.

## The dark-theme rule

A specimen's color is chosen to read against the warm white, so most are mid-dark. On the dark ground the renderer uses `accentDark` (or `accent2Dark`) when the specimen gives one. When it does not, `PC.lift` keeps the color's hue and saturation and raises its HSL lightness to at least 0.62, which is enough for a mid-dark color to clear the dark ground (garnet `#7a1f2b` lifts to `#d86474`, copper `#b0662c` is already above the floor and passes through). All nineteen specimens declare explicit dark colors in this pass, tuned by hand: the silvers go to a pale steel, the metals to their lit highlight, the black mold to a mid grey. The rule is the fallback for any specimen added later without one.

Dark theme is detected by `data-theme="dark"` on the root element, the same attribute `Theme` sets; the cards are always dark and use the dark set.

## What to look at

- Lithography: the beam is blue-violet through the whole light path; the plasma at the collector's focus is a lighter violet-white node. In dark mode the two separate cleanly.
- Deposition and etch: the plasma is a violet haze between showerhead and wafer.
- Memory and HBM: the copper base and the TSV columns, inside a black (light) or grey (dark) molding shell.
- Substrates: olive bands with copper dashes and copper through-holes in the cut face.
- Data centers and power: copper busbar down the spine. The grey steel shelves are close to the ink in the dark theme; steel is grey, so that is what it is, and the busbar carries the emphasis.
- Home: the die-to-die strip is copper.

`node build/build.js` runs with no warnings. Two notes on the shooting itself. The route stubs in `dist/<slug>/index.html` redirect to the production host, so local checks use the hash routes (`http://localhost:8841/#lithography`); the first batch of shots taken through the stubs were of the live site and were retaken. And `qa/brand-redesign/monograph/shoot.py` hard-codes DevTools port 9355: when another copy is running at the same time (the parallel CSS work), a second run attaches to that Chrome and captures its page, which is how two stale amber shots appeared here. The set in `qa/specimen-colors/` was finished with a copy of the tool on port 9377; every shot was then checked by pixel for the garnet ledger strip.
