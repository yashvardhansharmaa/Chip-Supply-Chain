# Design round two (23 October 2026): make a good site excellent

The owner: "assume the role of the world's best UI and UX designer. have several agents critique the website, suggest improvements. be thorough, from user experience, typography, color scheme, and other design elements of the website. the last design round was quite productive, let's make this website even better."

Stage one is critique only. Seven critics each take one discipline across the whole site, then prove each proposal on real screenshots and write it up. Nobody edits the repo in stage one. The main session merges the seven reports into one plan, the owner picks, and building follows.

## The site and its identity
Chip Supply Chain (chipsupplychain.org) is a free, sourced introduction to how AI chips are made and who controls each step. Readers are worldwide: students, policy staff, journalists, engineers and investors. It is a reference work, read and studied. Credibility comes first, then beauty in service of reading and understanding.

Routes (hash app at `/`, plus static pages): Home (`#/home`, a walk through the chain with 3D specimens), The Chain (`#/chain`, 17 chapters: 15 stages, then Component Costs and Who Controls the Chain), the Summary (`#/summary`), Export Controls (`#/controls`), Suppliers (`#/suppliers`), AI Chips (`#/chips`), Glossary (`#/glossary`). Static pages for search engines and sharing: `/lithography/`, `/suppliers/` and the like (`dist/<slug>/index.html`). PDFs: one per chapter in `dist/pdf/`, the book `dist/chip-supply-chain-the-chain.pdf`, the four-page summary `dist/chip-supply-chain-summary.pdf`. Social cards in `dist/cards/`.

The design system is "the ledger" (header comment and tokens at the top of `src/styles.css`): paper ground, blue-black ink, garnet used like a bookkeeper's red ink. Fraunces for display, Source Serif 4 for reading, Instrument Sans for labels (Jost and IBM Plex Mono are also loaded). Hairlines in place of boxes, square corners, no shadows except under popovers, the ruled ledger column at the left edge. The wordmark (the favicon's garnet tile beside "Chip Supply Chain") was chosen by the owner on 20 October.

## The system itself is open (owner, 23 Oct)
The owner: "i didn't just mean to review the current standard of typography and colors but also critique and explore if those can be changed." And: "would be open to changing the background, color, and current typography." So every lens judges the system as well as its execution. The paper ground, the ink, garnet and the three typefaces are all open to change. Asked about the two rules kept so far (light as the default theme, and the accent marking only the largest value in a chart), the owner said: "open to changing these too." So the default theme (light, dark, or following the device) and the chart color rule are open as well. Say whether the ledger identity is the right one for this subject and these readers, and what the best alternative would be.

The typography and color critics each explore three alternative directions as full systems, beside one "refine the current system" direction:
- **Differ in structure.** Each direction must differ from the others at a glance. Type examples: a different serif pairing, an all-sans editorial system, a technical drawing system. Color examples: a different ground, ink and accent, or a cooler or warmer world. Two tints of one palette are one direction.
- **Same screens.** Show every direction on the same screens: the home first screen at 1440, the Lithography chapter opener and a body page with a chart at 1440, Suppliers at 1440, the home and a chapter on a 390 phone, and one dark screen.
- **Reusable CSS.** Save each direction as one CSS override file, `qa/design2/shots/<slug>/directions/<name>.css`, so it can be applied later.
- **Say what it costs.** Name what each direction changes elsewhere: the wordmark and favicon, the chart colors and their rule, the PDFs and the social cards.
- **Recommend.** Give a recommendation and the reason.

The other lenses may also propose structural alternatives where the current structure is the problem, as Decisions with the same before and after proof.

## What already happened (read before you judge)
- Round one (21 Oct): `qa/design/PLAN.md` lists what the owner approved and built, and what was rejected. The four round-one reviews are beside it (`qa/design/design-*-review.md`). Do not re-propose what was done or rejected there. Build on it where the result still falls short, and say what is still short.
- AI Chips was rebuilt on 21 Oct as "slots" (pick up to four chips into slots, a searchable picker, Change and Remove at each column). The owner said "this is great." Refine it if needed. Do not replace it.
- In flight now, owned by two builders editing the same tree (so `dist/` is rebuilt from time to time; if a page fails or looks half-built, wait a minute and retry):
  - speed: first view on phones, `content-visibility` on chapters, 3D specimens built only where shown, the print cover art loading;
  - accessibility: `scroll-padding` under the fixed bars, the skip link, search as a real modal, the phone Contents sheet's focus, contrast (animation step numbers, atlas stop numbers, dark table peaks, the search placeholder, control edges at 3:1), Back to top hidden properly, two `outline: none` rules, the Home tab on the home page.

  Do not report those items. The full list is `qa/code-review/PLAN.md` items 1 to 14. Reader bugs already fixed are in `qa/code-review/fixes/readers-notes.md`.

## What the owner has decided (do not re-propose)
- No methods page, reading paths, scores or HHI on cards (plain bands only: Extreme and High, plain substitutability words), rotate or zoom for the 3D specimens, changelog, discussion questions, US-national-security framing, or per-term or per-company pages.
- The specimen caption stays centered. (The default theme and the chart color rule were decided on 21 Oct and reopened on 23 Oct: see "The system itself is open".)
- The data pages lead with a visual, one line per item, motion only where it carries information. Animations teach a mechanism, not statistics.
- The footer's words never change: "Made by Yashvardhan Sharma with Claude. Corrections and questions: contact@chipsupplychain.org."
- Content, figures and sources are out of scope. They are verified. You may propose labels or microcopy only where the design needs them, written to `.claude/skills/writing-well/SKILL.md`: no em dashes, no semicolons, no "X, not Y", no "rather than", no rhetorical questions, no "we", "you" or "this site", American spelling.
- When you offer alternatives, each option must differ in structure at a glance. Two spacings of one layout are one option.

## How to work
- Repo: `/Users/yashvardhansharma/Library/Application Support/Claude/scratch-workspaces/0a31970a-fa59-4805-8c4d-4478d5acd73a/47d04afc-9f92-4fb3-9c9e-e634493ca6a4/scratch-2026-09-09-7267aa/chokepoints`. Read `src/styles.css` (its header and tokens), the module CSS for your surfaces (`src/modules/*.css`, `build/assets/chapter-page.css`), `src/template.html`, and the `HANDOFF.md` sections on your surfaces. Edit no repo file except your own report and your own shots folder.
- Look before you judge. `http://127.0.0.1:8765/` serves `dist/`. Screenshot with `python3 qa/design/shots/design-chapter/proof/dc_shoot.py "<url>" <out.png> [--mobile] [--width W --height H] [--full] [--wait 7] [--eval "<js>"] --port <yours>`. It renders WebGL, so the 3D specimens show (build/shoot.py does not). `--mobile` is a 390 x 844 phone at 2x with touch. Theme: add `?theme=dark` before the `#` (light is the default). Read the PNGs with the Read tool. Check 1440 and 1024 wide, phones at 390 and 320 (`--mobile --width 320`), light and dark, and 1920 where layout is your lens. PDFs: render pages to PNG with `pdftoppm` (or `python3 -c` with PyMuPDF if installed) into your shots folder.
- Prove each proposal. Inject your CSS (and if needed small DOM changes) with `--eval`, for example `document.head.insertAdjacentHTML('beforeend','<style>…</style>')`. Shoot before and after at the same viewport, and save both under `qa/design2/shots/<your slug>/`. A proposal with no before and after pair is a wish, not a proposal. Interaction proposals may prove with a sequence of shots or a DOM measurement.
- Respect: WCAG AA contrast in both themes, visible focus, 24 px tap targets, `prefers-reduced-motion`, no horizontal scroll at 320 px, no new libraries, no layout shift. Fonts: any Google Fonts family may be tried, loaded in a proof by injecting a `fonts.googleapis.com/css2` link (the host the site already uses). State each direction's families, weights and download cost. Fewer families is better, print and the static pages unbroken, page weight.
- Do not start or stop servers, and do not use the in-app browser pane. If the server stops answering for more than five minutes, say so and stop.
- Do not fetch web pages. Benchmark from what you know of the best reference and data sites. Never put an email address or other personal data in any request, header, URL or file.
- No subagents. No commits.
- Budget: about an hour of work. Survey broadly first, then spend the proofs on what matters most.

## Report
Write `qa/design2/<your slug>-review.md`:
1. A one-paragraph verdict on the site through your lens, as the best in your field would see it.
2. Proposals ranked P1 (broken, ugly or confusing: must fix), P2 (clear upgrade), P3 (refinement). For each:
   - **Type:** Fix (an error any good designer would correct) or Decision (a visible change of taste or structure the owner should choose).
   - where (route, viewport, theme), what is wrong, the change (exact CSS and markup, file and selector), the before and after shot paths, the risk, the other surfaces it touches, and a size (S under 1 h, M under half a day, L more).
3. Your top five.

Final message: under 400 words, the verdict and the top five with their shot paths.
