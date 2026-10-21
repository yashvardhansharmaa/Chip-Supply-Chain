# AI Chips: Slots, as built (21 Oct 2026)

The owner chose Option A, Slots, from `README.md`, and the coordinator then raised its execution: a custom picker in place of the browser menus, chosen slots that look like the chip, the full empty table, ghost optional slots, set guidance copy, ruled pair buttons, and garnet only for the waiting slot and the focus ring. This file records what was built. Where it differs from the Option A spec in `README.md`, this file wins.

Not committed or pushed. `node build/build.js` ran twice on the shared `dist/`. Every other build ran on a private copy in the scratchpad, loaded over `file://`.

## What the reader gets

- **On open:** nothing is picked. The guidance line reads "Choose two chips to compare. Add up to four." Two slots follow, each a "+ Choose a chip" button. Slot 1 is the one in garnet, as the slot waiting for the pick. Under them sit five ruled pair buttons ("B200 and Ascend 910C" and four more) and "Browse all 38 chips by maker". Below, the comparison shows its frame: two dashed package outlines and the spec table with every real row label (Vendor, Availability, Built for, Foundry and process node, Logic dies, Transistors, Package, Memory type, Memory, Bandwidth, Speed at FP16, FP8 and FP4, Power, Chip-to-chip links, Scale-up, Price estimate, Cost to make, Export-control status) over hatched empty columns. The stage draws the AI Chips package.
- **The picker:** an empty slot, or a chip's Change, opens a popover under the slot. It has a title ("Choose chip 2"), a field ("Type a name or maker") and the 38 chips grouped by maker. Each row shows the name, then maker · country · year. A chip already in another slot is dimmed, marked "In chip 1" and cannot be picked. On a phone the popover becomes a full-width sheet from the bottom, over a scrim. Its foot follows the visual viewport, so the field stays above the keyboard. Escape, the ×, an outside click or a tap on the scrim closes it.
- **After one pick:** "Choose one more chip to compare." Slot 1 shows the chip: a thumbnail of its package plan, the name in Fraunces, maker · country · year in the label face, and Change and Remove. Slot 2 turns garnet, with "Try with" and three authored partners under it. The pair row hides. The table fills chip 1's column and keeps chip 2's hatched.
- **After two:** "Comparing 2 chips. Add up to two more." A third slot appears as a dashed ghost, "+ Add a third chip (optional)". After three it reads "Comparing 3 chips. Add one more." and a fourth ghost appears.
- **At four:** "Comparing 4 chips." The row is full and the ghost goes. In the folded checklist the other 34 chips dim and carry `aria-disabled`. A fifth tick there shows "Compare up to four. Remove one to add another." in the guidance line and reads it out.
- **Clear** sits at the right of the guidance line, shown once a chip is in. It empties every slot and the stage returns to the package.
- **The checklist** under "Browse all 38 chips by maker" is the restyled list from earlier today, unchanged. Ticks and slots share `Landscape.picked`, so each follows the other both ways.

## Files touched

- **`src/template.html`** (AI Chips section only): `#picker` and the `.cx-bar` count line are replaced by the `#cx-slots` block. It holds the guidance line `#cxa-ask` with Clear (`#cx-clear`, the same id, so its listener carries over), the slot row `#cxa-row`, the pairs `#cxa-pairs`, the `<details id="cxa-browse">` that now holds `#picker`, and the polite live region `#cxa-live`.
- **`src/app.js`, `Landscape`:**
  - New: `compare`, `said`, `pop`, `showGeneric`, `ORD`, `short`, `year`, `metaLine`, `names`, `guide`, `setSlot`, `setPair`, `focusSlot`, `announce`, `announceChange`, `thumbSVG`, `renderSlots`, `slotHTML`, `ghostPlans`, and the picker: `ordered`, `buildPicker`, `openPicker`, `placePicker`, `fitSheet`, `replacePicker`, `closePicker`, `navOpts`, `setActive`, `filterPicker`, `choose`.
  - Changed:
    - `activate` draws the package when nothing is picked.
    - `buildUI` adds the slot, pair, summary and Clear listeners, and the resize handler re-places an open picker.
    - `say` writes the guidance line and announces.
    - `clear` uses `showGeneric`.
    - `render` ends with `renderSlots` and `announceChange`.
    - `renderCount` now only sets `data-empty` and `data-full`, since the count line is gone.
    - `renderPlans` appends the dashed outlines.
    - `renderTable` adds hatched columns up to two and sets `aria-hidden` on the table while it holds no chip.
  - `toggle`, `focus` and `select` (the search box and the glossary card's "On AI Chips" link) are unchanged and fill the slots through `render`.
- **`src/app.js`, `Router.route`** (one line, allowed by the coordinator): `if (changed) Sections.currentId = null;`. See the stage bug below.
- **`src/modules/chips.css`:**
  - The `.cx-bar`, `.cx-count` and `.cx-clear` rules go.
  - New blocks: the slots (`.cxa-*`), the picker (`.cxp-*`), and the empty frame (`.cx-plan--ghost`, `.cx-col--ghost`, `td.cx-ghost`).
  - Two container queries:
    - Below 700 px of column, three or four slots wrap two to a row.
    - Below 230 px of slot, the card stacks: plan, name, maker line, actions.
  - The empty-state rule no longer hides `.cx-plans`, `.cx-tablewrap` or `.cx-h`.
  - The print rule hides the picker.
- **`src/styles.css`:** the dead AI Chips rules removed (see below).
- **`data/landscape-compare.json`** (new): `pairs` (five) and `with`, which gives two or three partners for each of the 38 chips, written by hand.
- **`build/build.js`** (lines after the layouts merge, and the `data` object): reads the file into `DATA.landscapeCompare`. It warns on any id that names no chip, and on any chip without partners. The build gave no warning.

### The partners

Each chip's `with` list compares like with like, using three kinds of partner.
- Its predecessor or successor, as with A100 and H100, or Trainium2 and Trainium3.
- A rival maker's chip of the same generation, as with B200 and Instinct MI355X, or TPU v7 and Trainium3.
- Its export variant, as with H100 and H800 or H20, or A100 and A800.

China-market chips get their licensed siblings (the H200 China configuration with H20 and MI325X) and the domestic alternatives (Ascend 910B and 910C). Inference chips meet inference chips (TPU 8i, Maia 200, MTIA 400, Jalapeño). Each list mixes makers and countries where a fair rival exists. The pairs and partners carry no figures, so they need no source.

## Design decisions to know

- **Garnet budget:** garnet is used only on the waiting slot (label, plus sign, border) and on focus (the focus ring, and the active row in the picker list, which is the list's focus). In the slot thumbnails the memory stacks are grey. The key under "Packages at one scale" still shows them garnet, as before.
- **Thumbnails** reuse `planSVG`. Each plan fits its own box, so the thumbnails are not to scale with one another. The plans below remain the to-scale comparison. TPU 8t and Ascend 950DT have no published layout, so they show a small hatched outline.
- **Same height:** an empty slot and a chosen one share a card height of 116 px, or 152 px for a narrow stacked slot. At 1440 the row stacks when the fourth chip arrives, since each slot drops below 230 px. Every card changes together at that point.
- **No browser-menu fallback.** The checklist and slots are built by script, as the old picker was, so a no-JS menu would have nothing to fill it.
- **Picker placement:** the popover mounts on `<body>`, because the page sits in a `z-index: 1` stacking context and the phone sheet must cover the specimen strip. On desktop it sits under the slot's card (340 px wide or the card's width), inside the column, under the masthead (`z-index: 39`). The list fits the room below it, between 220 and 360 px. The page moves only if 220 px will not fit, and then it jumps without a glide.

## Accessibility

- **Slots:** an empty slot is a button whose visible text "Choose a chip" is its name. The slot's label ("Chip 2") is its description. A chosen slot's actions are named "Change chip 1, B200" and "Remove B200 from chip 1". Both start with their visible word. Both openers carry `aria-haspopup="dialog"` and `aria-expanded`.
- **Picker:** a `role="dialog"` named by its title. The field is a `role="combobox"` with `aria-autocomplete="list"`, `aria-expanded`, and `aria-controls` pointing at a `role="listbox"`. Inside, one `role="group"` per maker, named by its heading, holds `role="option"` rows. `aria-activedescendant` moves with the active row, with `aria-selected` on it.
  - Down and Up move and wrap, skipping disabled chips.
  - Enter picks.
  - Escape closes and returns focus to the slot.
  - Typing filters by name, maker, country, family or year, and makes the first match active.
  - Tab or a click outside closes the picker without moving focus.
- **Focus:**
  - After a pick, focus goes to the next waiting slot while the comparison needs one, else to the slot just filled. It moves after the key event, so Enter cannot also press the slot it lands on.
  - After Remove, focus goes to the slot that now holds the next chip, or to the empty slot.
  - After Try with, it goes to slot 2's Change. After a pair, it goes to slot 2's Change.
  - After Clear, it goes to slot 1.
- **Announcements:** `#cxa-live` (polite) reads one message per change, whichever control made it: a slot, Try with, a pair, a tick, search or Clear. Examples:
  - "Ascend 910C added. Choose one more chip to compare."
  - "H100 removed. Choose one more chip to compare."
  - "Trainium3 in place of TPU v7. Comparing 4 chips."
  - "All chips cleared. Choose two chips to compare. Add up to four."
  - The refusal at four.
- **Targets:** every new control is 24 px tall or more, as measured:
  - Remove, Change, Try with and Clear: 24 px.
  - Pair buttons: 32 px. The summary: 40 px.
  - Picker rows: about 46 px. The ×: 32 px, or 44 px on a phone.
  - Slot buttons: 116 or 152 px.
- **Phone field** at 16 px, so iOS does not zoom.
- **Reduced motion:** the new parts have no transitions or animation. Scrolls go through `scrollToEl`, which jumps under reduced motion, and the picker's own nudge always jumps. The behaviour test runs with `prefers-reduced-motion: reduce` emulated.

## The stage bug (from the code review)

- **Report:** with nothing picked, AI Chips kept the last chapter's specimen ("Specimen 04 · Lithography"). After a pick and Back to `#lithography`, The Chain kept the B200 package.
- **Cause:** `Sections.currentId` survived the route change, so `Sections.update` skipped `Stage.show` for the same chapter. `Landscape.activate` also drew nothing when no chip was picked.
- **Fix:**
  - `Router.route` resets `Sections.currentId` when the view changes, so each view draws its own specimen on arrival.
  - `Landscape.activate` draws the AI Chips package when nothing is picked.
- **Proof:** in `behave.py` (last four steps), the reviewer's repro ran from a fresh load of `#lithography`: AI Chips, pick the first chip, `history.back()`, then read `#stage-tag-text`.
  - It failed on the live build before the fix: "AI chips · B200".
  - It passes after: "Specimen 04 · Lithography".
  - Shot: `build/after-from-chain-1440-light.png` (before: `00-today/from-chain-1440.png`).

## Dead code removed

- **`src/styles.css`:** the `.spec`, `.spec-head` (with `.vendor` and `.status`), `.spec-kpis`, `.spec-groups`, `.spec-notes`, `.spec-sources`, `.compare-wrap` and `.compare` rules, and their phone overrides. That is 35 rules, 3,882 bytes, plus `.spec-head h3` from the shared Fraunces selector list. No markup, script or build module uses these classes. The only remaining matches are comments.
- **`Landscape.syncExport`:** the block that looked for an `.export-bar .count` before `#cx-table-wrap`. The AI Chips export line is the quiet kind, placed after the table, with no count, so the block never ran. `exportRows` is still filled in place.

## Checks

- `node --check src/app.js` and `build/build.js`: clean. `node build/build.js`: exit 0, no warnings.
- `node qa/scripts/check-speak.js`: no matches.
- `node qa/scripts/check-integrity.js`: exit 0. It still prints the known Veeco Instruments line.
- `node qa/scripts/check-sources.js`: 2,721 citations, all tier A or B.
- `qa/design/chips-ux/build/behave.py` drives the page with real key and mouse events over the DevTools protocol. Against `http://127.0.0.1:8765/` it passed 30 of 30 steps at 1440 and 31 of 31 on the 390 phone, with no console errors or uncaught exceptions. Results: `build/behave-1440.txt`, `build/behave-390.txt`.
- **No horizontal scroll** (`scrollWidth` equal to the width) in every shot at 1440, 1024, 390 and 320, light and dark, with the picker open at 320.

## Shots

In `qa/design/chips-ux/build/`, named `<before|after>-<state>-<width>-<theme>.png`, through `build/shoot.py`, which picks through the page's own controls:

- **Before** (the shipped page, shot before any edit): `empty`, `one`, `two`, `four` at 1440 and 390, light and dark (16).
- **After**, the same 16, plus:
  - 1024: `empty` and `two` light, `four` dark.
  - 320: `empty` and `two` light, `four` dark, `picker` light.
  - 1440: `from-chain`, `five` (the refusal at four), `browse` (a tick filling slot 2) and `table` (three chips in the table).
- **For the owner**, in `build/review/`:
  - `1440-1-empty.png`
  - `1440-2-picker-open.png`
  - `1440-3-one-pick.png`
  - `1440-4-two-picks-ghost-third.png`
  - `1440-5-four.png`
  - `390-1-empty-first-screen.png`
  - `390-1b-empty-at-slots.png`
  - `390-2-picker-sheet.png`
  - `390-3-two-picks.png`
  - `1440-dark-one-pick.png`

## Not tested

- **The phone sheet on a real iPhone or Android.** The keyboard positioning follows `visualViewport`, but headless Chrome raises no on-screen keyboard.
- **Screen readers:** the roles, names and announcements were checked in the DOM only. VoiceOver and NVDA were not run.
