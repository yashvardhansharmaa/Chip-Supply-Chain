# Round two: data formats every agent shares

## 1. Card source fields (chapter front matter, `card` object)
Every figure and claim on a card gets a footnote mark that points at the body citation for the same fact. The card's text stays citation-free; the URLs live in new fields beside the text they support.

| Field | Type | Meaning |
|---|---|---|
| `leaders[i].source` | string | The URL that supports that leader's `share` text. One fact per `share`, so one source. Key order: `name`, `country`, `share`, `source`. |
| `costSources` | array of strings | One URL per sentence of `costSignal`, in order. Put it right after `costSignal`. |
| `costLabel` | string, optional | `"Key figure"` when the slot holds something other than a price or a market size and no allowed source gives one. Absent means the label stays "Price or market size". Put it right after `costSources`. |
| `chinaSources` | array of strings | One URL per sentence of `chinaStatus`, in order, right after `chinaStatus`. |
| `usSources` | array of strings | One URL per sentence of `usStatus`, in order, right after `usStatus`. |
| `substitutability.testSources` | array of strings | One URL per sentence of `test`, right after `test`. |
| `substitutability.whySources` | array of strings | One URL per sentence of `why`, right after `why`. |

Rules:
- A sentence ends with `.`, `!` or `?` followed by a space and a capital letter, digit, currency sign or opening quote, or at the end of the text. Write card text so that this split is right (no "Inc. The"; the site writes "US", never "U.S."). The build warns when the number of URLs and sentences differ.
- **Every URL in these fields must also be cited in the same chapter's body, for the same fact.** Copy the URL exactly as the body cites it (including any `#page=N`). If the body does not state the fact yet, add one sentence that states and cites it in the right section, following the writing rules.
- **No semicolons** in card text. Where a field joins two facts with a semicolon, make them two sentences (each with its source) or keep only the one that matters.
- **A year on every figure** in a leader's `share`, in `costSignal`, and in `chinaStatus`/`usStatus`: a share, a revenue, a count or a price carries the year (or fiscal year, quarter, or month and year) it describes, taken from the source. A claim with no figure (for example "Says its share of mask blanks is exceptionally high") carries the year the firm said it ("said in its 2025 report"). Never guess a year: if the source gives none, use the year of the source's own date and say "as of" that year.
- The renderer turns each URL into the chapter's usual numbered footnote mark, sharing numbers with the body (a URL cited in both places has one number).

Example (ch 4):
```json
 "leaders": [
 {"name": "ASML", "country": "NL", "share": "100% of EUV (extreme ultraviolet) systems sold in 2025", "source": "https://…"},
```

## 2. Page numbers for long PDFs
A citation into a PDF of 10 or more pages carries the page as a URL fragment: `([source](https://example.org/report.pdf#page=47))`. The number is the PDF's own page index (1 = the first page of the file, which is what `#page=` opens in every browser and PDF reader), not the folio printed on the page. The build reads `#page=N`, shows "p. N" in the footnote, the source list and the printed notes, and looks the source up in `data/bibliography.json` without the fragment.

The page agents do not edit chapters; they write `qa/round2/pages/<chapter-file-stem>.json`:
```json
[{"url": "https://…/report.pdf", "sentence": "the first 80 characters of the sentence exactly as in the file", "page": 47, "pages": 212, "evidence": "a quote of up to 25 words from that page showing the figure"}]
```
One entry per citation (a sentence with its one URL). Leave out PDFs under 10 pages. If the figure is not in the PDF at all, add `"page": null, "problem": "…"`.

## 3. Exposure links
`build/exposure.js` (already written) joins `data/exposure.json` to card and supplier names: `exposureIndex(rows)` gives `latest(name)`, `label(name)` ("China 29.1% of revenue, FY2025") and `href(name)` (`#/exposure/<slug>`, where slug is the firm name lowercased with runs of other characters turned into `-`: `asml`, `applied-materials`, `sk-hynix`, `samsung-electronics`). New firms in exposure.json use the names `TSMC`, `Lasertec`, `Disco`, `Hoya`, `AGC`.

## 4. Discussion questions
`data/discussion.json`, keyed by chapter id (the `id` in each chapter's front matter), indent 2, trailing newline:
```json
{
  "lithography": {
    "questions": [
      "What would a second maker of EUV scanners need to build, and which of those parts are held by one supplier today?",
      "…"
    ]
  }
}
```
Two or three questions per chapter, all seventeen chapters.
