# Code review: the merged plan (21 October 2026)

Four reviews: `performance.md`, `correctness.md`, `accessibility.md`, `structure.md` (each has the evidence, file and line, and the fix). Already done: the owner's email removed from `qa/scripts/recheck-links.js` (a generic User-Agent now).

## Tier 1: readers hit these now
1. **First view on a phone takes about 6 s** (Slow 4G, mid-range phone). Show the routed view before the whole file arrives: set the route in `<head>`, hide views by CSS until boot, home view first. Target 1.0 to 1.5 s. (performance #1, 4 to 6 h)
2. **Stalls after load.** `content-visibility: auto` on chapters (The Chain's reveal from 278 to 432 ms down to 12 to 22 ms), build the 3D specimens only where shown, no 501 KB print cover on screen, no unused image on static pages. (performance #2, #4, 3 to 5 h)
3. **Export Controls "Now" is frozen at 7 Sept.** From 10 Nov the board would still show suspensions that have ended. `now = max(last entry date, today)`. Due before 9 Nov. (correctness P1-3, under 1 h)
4. **Glossary.** Passage links snap back to the chapter top. The popover stays open after "Look it up". 51 "passages" are word counts or citations. A keyboard reader needs about 480 Tab presses to reach the card, and Enter in search drops focus. (correctness P1-1, P1-4, P1-5; accessibility P1; about half a day)
5. **Suppliers filters.** A second click on a ribbon drops the filter, and a Glossary link can leave an old search applied (Japan shows 3 of 45). (correctness P1-2, 1 to 2 h)
6. **Broken "Company page" links** for Lam Research and Wistron (double-escaped address, `src/modules/lookup.js:176`). (minutes)
7. **Accessibility batch.**
   - Focus hidden under the fixed bars on phones (`scroll-padding`).
   - The skip link skips nothing.
   - Search is not a real modal.
   - The phone Contents sheet leaks focus.
   - Counts and the board date are not announced.
   - Contrast: animation step numbers, atlas stop numbers, the dark table peaks, the search placeholder, control edges at 1.8:1.
   - The hidden Back to top button takes focus, and two `outline: none` rules hide focus.
   - Tooltips cannot be dismissed with Escape.
   - Focus is lost after sorting the Suppliers table.

   (accessibility P2s, about 1 day)
8. **Smaller reader bugs.** Timeline mentions link to the page top. The popover link cannot be reached by keyboard. The Home tab does nothing on the home page. One stale search entry. (correctness P1 small)
9. The wrong 3D specimen around AI Chips is being fixed with the Slots build (correctness A7).

## Tier 2: protect the weekly edits
10. **The build fails on broken content**: bad JSON, missing chapter fields, a misspelt band, missing figure markers, a cut-off bibliography. Run check-integrity in CI and make it fail. Fix the live Veeco warning. (structure P1-1, correctness P2; about half a day)
11. **A browser smoke test in CI**: console errors, horizontal scroll at 320, the key elements on each route, the static pages' theme default. (structure P2; about half a day, 4 to 6 CI minutes a run)
12. **"Updated" dates by content only**, so a design or build change no longer re-dates every chapter. (correctness P2; about 2 h)
13. **Repo hygiene.** `.gitignore` for the 11 GB of untracked working files (`qa/promo/` and others), stop tracking old QA images, and a size guard. History is not rewritten. (structure; about 1 h)
14. **Agent briefs and a one-page weekly runbook**: drop the auto-commit loop instruction, plus the email and source rules in one place. (structure; 1 to 2 h)

## Tier 3: when convenient
15. Move `CP_DATA`, the Glossary markup and the print code out of the first download (−345 KB, about −1.7 s). (performance #3, about 1.5 days)
16. Self-host the fonts and trim five families to three. (performance #5, half a day)
17. Delete dead code (about 37 KB). Merge the duplicated chapter styles, where 37 shared selectors already disagree. (correctness, structure; about 1 day)
18. Pin the GoatCounter script, and consider a CSP meta tag. Document that the PDF tools run on this Mac, and fail on fallback fonts. (structure)
