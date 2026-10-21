# Design review (21 October 2026): professional, and visually stunning

The owner: "have senior designer agents, who're exceptional at visual design, review [every corner of] the website and each of the pdfs and improve them. keep it professional but visually stunning."

Stage one is review only. Each designer studies their surfaces, then proves each proposal on real screenshots, and writes it up. Nobody edits the repo in stage one; the main session merges the proposals into one plan, so that four designers do not pull one design system four ways, and implementation follows.

## The site and its identity
Chip Supply Chain (chipsupplychain.org) is a free, sourced introduction to the AI chip supply chain, read worldwide by students, policy staff, journalists, engineers and investors. It is a reference work, read and studied: credibility first, then beauty in service of reading and understanding.

The design system is "the ledger" (header comment of `src/styles.css`): paper ground, blue-black ink, garnet used like a bookkeeper's red ink; Fraunces for display, Source Serif 4 for reading, Instrument Sans for labels; hairlines in place of boxes, square corners, no shadows except under popovers; the ruled ledger column at the left edge. The wordmark (the favicon's garnet tile beside "Chip Supply Chain") was chosen by the owner on 20 October. Keep the identity and raise its execution: proportion, rhythm, hierarchy, type detail, color discipline, charts, motion only where it carries information, and the small things a great studio would not let through. A proposal may change something large if it clearly earns it.

## What the owner has already decided (do not re-propose)
No methods page; no reading paths; no scores or HHI on cards (plain bands only: Extreme / High, plain substitutability words); no rotate or zoom for the 3D specimens; no changelog; no discussion questions; no US-national-security framing (the site is country-neutral and global); the data pages lead with a visual, one line per item, motion only where it carries information; animations teach a mechanism, not statistics; design options shown to the owner must differ in structure, not in spacing. Content and wording are out of scope (sources and figures are verified); you may propose label or microcopy changes only where the design needs them, in the site's writing style (`.claude/skills/writing-well/SKILL.md`).

## How to work
- Repo: `/Users/yashvardhansharma/Library/Application Support/Claude/scratch-workspaces/0a31970a-fa59-4805-8c4d-4478d5acd73a/47d04afc-9f92-4fb3-9c9e-e634493ca6a4/scratch-2026-09-09-7267aa/chokepoints`. Read `src/styles.css` (its header and tokens), the module CSS for your surfaces (`src/modules/*.css`), `src/template.html`, and `HANDOFF.md` sections on your surfaces. Do not edit any repo file.
- Look before you judge: the local server `http://127.0.0.1:8765/` serves the site (`dist/`). Screenshot with `python3 build/shoot.py "<url>" <out.png> [--mobile] [--width 1440 --height 900] [--full] [--wait 4] [--eval "<js>"] --port <yours>` and read the PNGs with the Read tool. Check desktop (1440 and 1024 wide), phone (`--mobile`, 390), light and dark (`?theme=dark` before the `#`).
- Prove each proposal: inject your CSS (and if needed small DOM changes) with `--eval` (for example `document.head.insertAdjacentHTML('beforeend','<style>…</style>')`), shoot before and after at the same viewport, and save both under `qa/design/shots/<your slug>/`. A proposal with no before/after pair is a wish, not a proposal.
- Respect: WCAG AA contrast in both themes, visible focus, 24 px tap targets, `prefers-reduced-motion`, no horizontal scroll at 320 px, no new libraries or web fonts beyond those loaded, no layout shift, print and static pages unbroken, page weight (no heavy images).
- Do not start or stop servers or use the in-app browser pane. If the server stops answering, say so and stop.

## Report
Write `qa/design/<your slug>-review.md`: first a one-paragraph verdict on your surfaces as a senior designer sees them; then proposals ranked P1 (broken, ugly or confusing: must fix), P2 (clear upgrade), P3 (refinement). For each: where (route, viewport), what is wrong, the change (exact CSS and markup, file and selector), the before/after shot paths, the risk, and which other surfaces it touches. End with your top five. Your final message: under 400 words, the verdict and the top five with their shot paths.
