# Chokepoints

*A deep dive on the AI chip supply chain.* Every stage from polysilicon to a liquid-cooled rack, with a procedural 3D specimen of each stage drawn beside the text as you scroll. Built in the tradition of [Humanity's Last Machine](https://www.humanityslastmachine.com/) and CSET's semiconductor supply-chain work.

The whole site compiles to **one self-contained HTML file** (`dist/index.html`). No framework, no build-time dependencies beyond Node, no runtime dependencies at all: the point-cloud renderer is ~200 lines of WebGL, and the specimens are generated from primitives at load time rather than downloaded.

## What is on the site

- **The Stack**: 17 component chapters, each opening with a chokepoint nameplate, an "In short" summary and an "In plain terms" paragraph for readers with no technical background, with a procedural 3D specimen of the stage beside the text.
- **Summary** (`#/briefing`): every chapter's plain-language explanation, conclusions and chokepoint score on one page.
- **AI Chips** (`#/landscape`): 19 AI accelerators with full spec sheets and a package render drawn from each chip's die and HBM layout.
- **Suppliers**: 220 firms, filterable by category, country and chokepoint status, exportable as CSV.
- **Geopolitics**: the essay, a country-by-segment share matrix, and a 45-event export-control timeline.
- **Controls**: a machine-readable threshold map (every quantitative line in the US, Dutch, Japanese, EU and Chinese regimes, with status and source) and a China-exposure series computed from company filings.
- **Glossary**: 74 terms defined for policy readers.
- **Sources**: every citation, tagged by source tier (see `brief/SOURCE_POLICY.md`).
- Research tools: site search (Ctrl+K or `/`), permalinks on every section, copy-as-CSV/JSON on every dataset, and a citation block with BibTeX.

## Layout

```
brief/        editorial, editing, source-policy, data-schema and specimen briefs (the contracts the workers followed)
content/      one markdown file per chapter, JSON front matter + body, inline ([source](url)) citations
data/         landscape.json (+ landscape-layouts.json, package layouts merged by chip id), suppliers.json, export-controls-timeline.json, chokepoint-matrix.json, control-thresholds.json, exposure.json, glossary.json, source-tiers.json
specimens/    one JS file per 3D specimen, built from src/kit.js primitives
src/          kit.js (point-cloud primitives), app.js (runtime), styles.css (design system), template.html
build/        build.js (markdown -> HTML, figures -> SVG, assembles dist/index.html), preview.js (renders a specimen to PNG), audit-data-sources.js
dist/         index.html (the site) and build-report.txt
qa/           specimen preview PNGs (qa/before/ holds the pre-redesign renders), fact-check and source-audit logs, design memo
```

## Build

```bash
node build/build.js          # writes dist/index.html and dist/build-report.txt
node build/preview.js wafer  # renders specimens/wafer.js to qa/wafer.png (needs python3 + numpy + Pillow)
python3 -m http.server 8765 --directory dist   # then open http://localhost:8765
```

## Deploy

`dist/index.html` is a static file. Any of these works:

- **GitHub Pages**: the workflow in `.github/workflows/pages.yml` builds and deploys on every push to `main`. Enable it once under *Settings → Pages → Source: GitHub Actions*. (Pages from a private repository needs a paid plan; make the repo public or use Vercel.)
- **Vercel / Netlify / Cloudflare Pages**: point the project at the repo, build command `node build/build.js`, output directory `dist`.
- **Anywhere else**: copy `dist/index.html` to a web root.

## Editing

- Chapters live in `content/NN-slug.md`. The front matter (`---json … ---`) carries the chokepoint card, key facts and figure data; the body is markdown. Citations are `([source](https://…))` right after the sentence they support. `{{figure:id}}` places a figure from the front matter.
- Add a specimen by registering it in `specimens/<name>.js` with `PC.register('<name>', fn)` and pointing a chapter's `specimen` field at it. Preview it with `node build/preview.js <name>`.
- Data files follow `brief/DATA_SCHEMAS.md`.

## Writing and sourcing standards

- `brief/SOURCE_POLICY.md` is strict: only Tier A sources (company filings and investor materials, governments and regulators, standards bodies, universities and labs, and institutional research such as CSET, CSIS, SIA, SEMI, WSTS and Epoch AI) plus four named exceptions (SemiAnalysis, Reuters, the Financial Times, Nikkei Asia). Market-research firms and the rest of the press are not cited. The build report counts any disallowed chapter citation and `node build/audit-data-sources.js` does the same for the data files; both stand at zero.
- `.claude/skills/writing-well/SKILL.md` is the prose standard, distilled from William Zinsser's *On Writing Well*; every chapter went through it.

## Credits

Made by Yashvardhan Sharma with Claude in September 2026 (Fable 5.1 as orchestrator and designer, Opus agents writing chapters, compiling datasets and modelling specimens). Inspired by [Humanity's Last Machine](https://www.humanityslastmachine.com/) and [CSET's semiconductor supply-chain work](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/). Every figure links to a public source. Not investment advice.
