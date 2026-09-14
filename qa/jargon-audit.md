# Jargon audit: glossary coverage

Status: in progress (chapters 1 to 4 read). Counts and tables follow once all 17 chapters and the interface strings are read.

## How the matcher works (read from build/build.js and src/app.js)

- `glossaryWrap` builds one regex from every `term` and every comma-separated `aka` form. It is case-insensitive, and a boundary is "not a letter or digit", so a hyphen or slash counts as a boundary but a trailing "s" does not: `wafer` does not match `wafers`, and `chiplet` does not match `chiplets`. Plurals only match when listed in `aka`.
- Spaces inside a form match any run of whitespace, but not a hyphen: `high bandwidth memory` does not match `high-bandwidth memory`.
- An `aka` field containing a semicolon is dropped whole, and any form starting "part of", "singular of", "when ", "for example" or "also " is dropped.
- Only the first occurrence of each term in a chapter is wrapped. If the first occurrence is a form the matcher does not know (a plural, a hyphenation), the term goes unwrapped until a later known form appears, or never.
- Text inside `<a>`, `<code>`, `<sup>`, headings, `<dt>`, `<dd>`, figures and buttons is skipped. Link text is never wrapped.
- The runtime `GLOSS` list in `src/app.js` covers only five forms (TPP, Entity List, FDPR, foreign direct product rule, license exception) inside Export Controls state labels. Nothing else on the Suppliers, AI Chips or Export Controls pages gets a popover.
