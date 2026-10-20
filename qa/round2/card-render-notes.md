# card-render notes (20 October 2026)

Scope: card footnote marks (SCHEMA 1), "Key figure" label, leader China line, #page=N page numbers, accessed dates, check-integrity section.

## Progress log
- Read RULES, SCHEMA, build.js (nameplate, cite, sourceLine, bibOf, bibDate), social.js, exposure.js, print.js, app.js Cite tooltip, check-integrity.js.
- No chapter has card source fields yet (content agents just started); need a fixture.

## Decisions

## Check outputs
- Plan: build.js gets pageOf/bibWhen/unfragment lookup, cite() data-pg + accessed date, sourceLine meta "publisher · date · p. N";
  nameplate(card, title, gl, ctx) with cardSentences (SCHEMA rule), marks before the closing stop (the body's convention);
  card URLs pre-registered in the chapter loop before markdown() so they take numbers 1..k (one-line hook, reported).
  China line: EXPOSURE index read beside nameplate (build.js reads exposure.json only after the chapters render).
  Static page: fixLinks already turns #/exposure/<slug> into SITE.url#/exposure/<slug>; card CSS for static page goes in social.js EXTRA_CSS.
  Print: China line hidden (cross-reference to an interactive panel; no localhost links on paper). Card marks accent-ink like prose.
- Fixture: qa/round2/scratch/card-render/root (copy of build/src/content/data/specimens, media symlinked); lithography gets source fields there only.
- DONE (code): build.js bibOf (fragment-less fallback), pageOf, bibWhen, sourceLine, cite (data-pg, accessed), cardSentences/cardFields/cardCites/cardMarks/cardText, nameplate(card,title,gl,ctx), EXPOSURE; chapter loop hook (one line); call sites pass cardCtx.
  app.js Cite.show meta adds p. N; print.js noteFor adds p. N; styles.css + social.js EXTRA_CSS card rules; print.css (marks accent-ink, China line hidden); check-integrity section 4.
- Verified on fixture (qa/round2/scratch/card-render/root, tools/fixture.js): numbering card-first, p. N in tooltip/lists, Accessed in tooltip/lists, Key figure label, display-figure mark, all six check rules (fixture.js --bad).
- Real build + 4 checks exit 0 (20 Oct, before content agents wrote any source fields).

## Check outputs (final, 20 Oct)
- node --check: build.js, social.js, app.js, print.js, check-integrity.js all pass.
- Chain (build, speak, integrity, sources) exit 0. Build: 15 "card has no source fields" warnings (content agents not done). Integrity: known exposure rows,
  15 "no source fields yet", 15 year warnings. Sources: 2290 citations, all A or B.
- Print test (real, --only 2): 24 pages, 76 notes, 0 stray, 0 overflow, "Accessed" in notes, no China line, no localhost URIs.
  Fixture print (--only 4): card notes 1-8 on the card's page with "p. 12"; note 9 rolled to the next page (card + notes fill the page).
- Shots: qa/round2/shots/card-render/ (fixture-* from the scratch fixture; real-* from the live build).

## Left for others
- src/template.html "how to read the card" still names only "Price or market size" (not my file).
- src/modules/lookup.js corpus reads the China line as part of the leader's li text; it could skip .lead-cn.
