# learning (flashcards, discussion questions, The Chain lede): notes

## Facts checked (20 Oct 2026)
- Animations (front matter figures with "type": "animation", all placed in the body): chapters 1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15 = 13 of the 15 stages. None in 3 (chemicals), 9 (foundries), 16, 17.
- 3D model (front matter `specimen`, every one registered in specimens/*.js): all 17 chapters.
- Flashcards (data/flashcards.json): all 17 chapters, 68 cards: 3 to 5 per chapter (design 5, test 3, component-costs 3, geopolitics 5, the rest 4). Not "four per chapter".
- Discussion (data/discussion.json): not written yet at start; SCHEMA §4 says two or three per chapter, all seventeen.

## Plan
1. Lede: one added sentence in src/template.html `.howto-lede`.
2. app.js FC: localStorage `cp-fc:<chapter id>` = {known: ["1","0",...], k, n, at}; try/catch everywhere; "Last time: k of n known" line + restore marks on load; reset clears.
3. app.js search: kind "Flashcard", title = question, text = answer, href = '#<id>--flashcards' style anchor, opened at that card.
4. build.js discussionHTML(ch) beside reviewHTML; call sites in chapterHTML and geoBody. social.js static block. styles.css + print.css.

## Progress
- DONE lede (template.html): "To help readers learn, every chapter has a 3D model and ends with flashcards and questions for discussion, and thirteen of the fifteen stage chapters have an animation." (depends on discussion.json covering all 17; recheck when it lands)
- DONE build.js: deck id `<id>--flashcards`; discussionOf + discussionHTML beside reviewHTML; placed after reviewHTML in chapterHTML and geoBody; discussionOf passed in ctx.
- DONE social.js: DISCUSS_CSS, static `<section class="discuss">` after the review questions.
- DONE styles.css: `.rv-sub.fc-last`, `.discuss*` rules after the fc print rule.
- DONE app.js FC: key/read/save/forget/lastLine/restore; save on mark and finish; reset forgets; restore at init without moving focus; Tools.openCard; search entries kind Flashcard (title = question, line = "<chapter> · card k of n", answer matched via `more`), click opens deck at card.
- Verified in headless Chrome (scratchpad fcdrive.py): session stored, reload restores ("Last time: 3 of 4 known."), keyboard arrows, Start over clears, storage blocked = no errors.
- DONE print.css `.discuss` block (label head like the takeaways, 10pt list, break-inside avoid). Verified in a one-chapter Paged.js PDF from a scratch test build (pdf.py --chapter lithography --port 9802) and static-page print emulation.
- DONE storage fingerprint (`sig`, hash of the deck's questions): marks kept for changed cards are ignored; malformed JSON ignored.
- Test build with SAMPLE questions lives in the session scratchpad (learning/testbuild), viewed over file://; shots named *-sample-*.
- OPEN check-speak flags every discussion "?" as a rhetorical question (7 matches with 7 sample questions). Fix belongs in qa/scripts/check-speak.js (not mine), next to the fc-q line:
  `.replace(/<ol class="discuss-list"[\s\S]*?<\/ol>/g, (m) => m.replace(/\?/g, '.')) // so are the questions for discussion`
  (tested on a scratch copy: 7 matches -> "check-speak: no matches"; every other rule still reads the questions)
- RESOLVED data/discussion.json landed: 17 of 17 chapters, 3 questions each, plain text, so the lede holds. Real-data build: 17 blocks on the main page and on all 17 static pages; check-speak 51 matches, all "[rhetorical question]" under "Questions for discussion" (the exemption above clears all 51, tested on a scratch copy against the real dist). Shots redone with real questions (08, 09, 11).
- NOTE for the discussion author: silicon-and-wafers question 2 writes "December 4, 2026"; the site writes "4 December 2026".
- NOTE takeaways (.rv-keep li) have no print size and print at the screen 17px (about 12.75pt), larger than In short (11.5pt).
