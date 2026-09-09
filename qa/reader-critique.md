# Reader critique and revision plan (9 September 2026)

Four read-only reviews of the live build: a curious generalist who searched "how are GPUs made" (`reader-test-learner.md`), a think-tank researcher (`reader-test-researcher.md`), a non-technical policy staffer (`reader-test-policymaker.md`) and an information architect (`ia-critique.md`). Nothing was changed. This file merges them into one plan.

## What every reviewer said

1. **There is no front door.** The first screen never says who the site is for or what to read first. The plain-language layer already exists (every chapter's `plain` paragraph) but sits fourth in each chapter, below the nameplate, and is absent from the Summary, which carries no citations at all.
2. **The chokepoint score is the site's headline number and the only one without a source.** No rubric, no method note, no owner; "5 / 5" is the largest element on every card and is never defined where it appears.
3. **The vocabulary has no escape hatch.** 74 glossary entries, zero links to them from prose; the first caption a reader meets uses reticle, interposer, build-up substrate and HBM.
4. **The site's own cross-references are not links.** Thirteen "see X" phrases, none clickable; the `chapter` field on all 40 control thresholds is never rendered; no previous/next.
5. **Search filters instead of ranking.** "how is a gpu made" returns nothing; glossary entries rank last; "export-control" and "export control" differ.
6. **Reference apparatus is thin.** 359 bare URLs without titles or dates; method notes buried at the foot of Sources; no as-of dates, changelog, about, contact, licence or coverage statement; nameplate figures uncited; the four Tier B exceptions are never named on the site; `data/*.json` links 404 on the served site; the CSV writer drops fields absent from the first row.
7. **Defects.** No `<!doctype html>` (quirks mode); `.sr-only` tables overflow the mobile layout to 912 px; muted text at about 4.1:1 contrast; labels at 8.5 px; no skip link or `lang`; the stage count reads 15, 17 and 18 in different places; print collapses sources and prints charts empty; on a phone the masthead and specimen band take half the screen.

## Plan

**Tier 0, defects, about an hour together.** Doctype and `<html lang>`; fix `.sr-only`; reconcile the stage count; serve `data/*.json` from `dist/`; CSV header from the union of keys; darken `--muted`; minimum 10 px labels; skip link.

**Tier 1, a day each, in this order.**
1. Start here: an audience chooser on the landing page and a "How a GPU is made in ten minutes" walk assembled from the 18 existing `plain` paragraphs (also the target for howgpusaremade.com).
2. Chapter head reorder: "In plain terms" first, then "In short", then the nameplate; plain paragraph and citations on the Summary cards.
3. Glossary popovers on the first use of each term per chapter.
4. Methods tab: the scoring rubric with a named owner, the sourcing rule with the four exceptions named, as-of dates, a changelog, about, contact, licence, coverage statement.
5. Links: "see X" phrases, previous and next, related chapters, control thresholds linked to their chapters.
6. Search ranking (title and glossary matches first, phrase handling, stemming of hyphens).
7. Bibliography with titles, publishers and dates; print stylesheet with an expanded source list and printed charts.
8. Mobile: a collapsible specimen band and a masthead that fits.

**Tier 2, a week each.** One real URL per chapter with titles, descriptions, Open Graph cards and a sitemap; Controls tab led by "what the rules did" with the threshold map as a sub-tab; coverage additions (the software stack, fab economics, China's chain as its own subject, water and energy, workforce, an industry timeline, a reading list); bulk data download; promotion of the B200 bill of materials.

## Do not change

The plain-terms analogies; the glossary entries; the per-number citations to primary documents; the exposure tooltips with numerator and denominator; the nameplate plus "you are here" strip; the B200 bill of materials.
