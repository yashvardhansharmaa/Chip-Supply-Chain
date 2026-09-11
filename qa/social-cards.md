# Per-chapter URLs and social cards (11 September 2026)

## What was built

The site is one HTML file with hash routes, so a pasted link used to unfurl as the home page whatever it pointed at. Now every chapter and every view has a real URL of its own that unfurls with its own title, text and card on Slack, LinkedIn, X and Substack, and then sends the reader on to the page.

| Piece | Where | What it does |
|---|---|---|
| Unfurl pages | `build/modules/social.js` (auto-loaded by `build/build.js`) writes `dist/c/<slug>/index.html` | One small static page per chapter (slug = chapter id, `c/lithography/`) and per view (`c/home/`, `c/intro/`, `c/chain/`, `c/chips/`, `c/suppliers/`, `c/export-controls/`, `c/index/`): 24 pages. Each carries `<title>`, `<meta name="description">` (the chapter's first plain sentence, or the view's dek, at most 160 characters), `<link rel="canonical">` to the hash URL on the live site, `og:site_name`, `og:type` (article for chapters, website for views), `og:title`, `og:description`, `og:url`, `og:image` (absolute, with width, height and alt), `twitter:card summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`; then, after the tags, a `<meta http-equiv="refresh" content="0;url=…">` and a `location.replace` to the hash route. The body shows the eyebrow, the title, the plain paragraph and a "Read the chapter" link, so the page is not empty for a crawler. |
| Card images | `build/cards.py` renders `build/assets/cards/<slug>.png`; `social.js` copies the folder to `dist/cards/` | 1200 x 630 PNG per page, rendered by headless Chrome from a template inside the script: paper ground (`--bg #edeff0`), ink text, the amber rule (`--accent #c98a12`), IBM Plex Sans Condensed for the title, Newsreader for the line, IBM Plex Mono for the eyebrow and the footer URL, all from Google Fonts. Eyebrow "COMPUTE CHOKEPOINTS · CHAPTER 04 · STAGE 4 OF 15" (chapters 16 and 17 say "THE COSTS" and "THE CONTEST"); the title large; one line, which is the concentration band for the fifteen stages ("Extreme concentration · Very hard to substitute", from `card.concentration` and `card.substitutability.band`) and the first plain sentence for chapters 16 and 17; views show their name and dek. The home card reads "Compute Chokepoints" over "How AI chips are made, and who controls each stage." Sizes run 35 to 60 KB, all under the 150 KB limit. |
| Main page head | `src/template.html` lines 8 to 21 | Canonical, `og:site_name`, `og:type website`, `og:title`, `og:description` (the existing meta description), `og:url`, `og:image` (`cards/home.png`), `twitter:card summary_large_image` and the Twitter title, description and image. |
| Page list | `manifest()` exported from `build/modules/social.js` | The single list of slugs, eyebrows, titles, lines, descriptions and routes. It reads `content/*.md` and `data/suppliers.json` itself, so `cards.py` calls it through `node -e` and the card and the page never disagree. |

Design notes. The card is the site's own type and palette, no image and no logo. A title that would run past two lines is shrunk in steps of 2 px (down to 56 px) until it fits; the one-liner is clamped to two lines. The title block sits centred between the eyebrow and the footer, so one-line and two-line titles both read as balanced. `og:url` is the static page's own address, not the hash URL: Facebook's and LinkedIn's crawlers re-fetch `og:url` as the canonical, and pointing it at the main page would replace the chapter's tags with the home page's. The `<link rel="canonical">` still points at the hash URL, as asked, for search engines.

Descriptions. Whole sentences are packed while they fit in 160 characters. Two chapters (Lithography, Deposition and Etch) open with a sentence longer than that; the description keeps the clause before the colon and closes it with a full stop ("Lithography prints the pattern of a circuit onto the wafer.").

## How to regenerate the cards

Cards are not rendered on every build (the build only copies them, and warns if one is missing). After a chapter title, band, plain paragraph or view dek changes:

```
python3 build/cards.py            # all 24 cards, about 30 seconds
python3 build/cards.py --only lithography,home   # a subset
python3 build/cards.py --keep     # keeps the temporary HTML for inspection, prints the folder
node build/build.js               # copies build/assets/cards/ to dist/cards/ and rewrites dist/c/
```

`cards.py` needs Chrome at `/Applications/Google Chrome.app`, the `websocket-client` package (already used by `build/shoot.py`), a network connection for Google Fonts, and Pillow (present) for the quantise step that runs only if a PNG exceeds 150 KB. It prints one line per card with the size, the final title size and line count, and flags OVERFLOW or a size over the limit. If the fonts do not load it prints a warning and the cards fall back to system fonts; re-run with the network up.

## Check

Run in the repo root with the local server up (`python3 -m http.server 8841 --directory dist`):

```
python3 build/cards.py
node build/build.js
for s in lithography chemicals-gases-and-photoresist export-controls; do
  curl -s "http://localhost:8841/c/$s/index.html" | grep -E "<title>|canonical|og:|twitter:|refresh"
done
curl -sI http://localhost:8841/cards/lithography.png | head -1
```

Expected: every page prints a title ending "· Compute Chokepoints" (the home page is "Compute Chokepoints"), a canonical of the form `https://yashvardhansharmaa.github.io/chokepoints/#<id>` or `#/<view>`, `og:type article` for chapters and `website` for views, `og:url` under `/c/<slug>/`, `og:image` and `twitter:image` under `/cards/<slug>.png`, `twitter:card summary_large_image`, and the refresh line last. The PNG answers 200.

Results on 11 September: all 24 pages and 24 cards built; the three pages above carry every tag in that order; `dist/index.html` head carries 14 canonical, Open Graph and Twitter tags; no em dash in any generated page; every card between 35 and 60 KB; Google Fonts loaded (Plex Sans Condensed, Newsreader and Plex Mono visible in the renders).

Cards viewed: `chemicals-gases-and-photoresist.png` (the longest title, wraps to two lines at 104 px with no clipping, the rule and band line sit under it), `lithography.png` (one line, band "Extreme concentration · Very hard to substitute"), `geopolitics.png` (chapter 17, eyebrow "THE CONTEST", first plain sentence as the line) and `home.png`. Nothing clipped or overflowed; the script reports no OVERFLOW.

## Live checks after deploy

Once `dist/` is pushed, paste `https://yashvardhansharmaa.github.io/chokepoints/c/lithography/` into a Slack message, LinkedIn's Post Inspector (linkedin.com/post-inspector), X's card validator or a Substack draft. Each should show the Lithography card and the first plain sentence. LinkedIn and Facebook cache a URL for about a week; re-scrape from the inspector after changing a card. A reader opening the URL lands on `#lithography` inside The Chain.

## Open

- A `sitemap.xml` listing the 24 URLs, and structured data (`Article` per chapter), are the natural next step for search engines; not built here.
- The description for a chapter whose plain paragraph opens with a very short sentence (chapter 3: "Photoresist is photographic film for chips.") is that sentence alone when the next one does not fit in 160 characters. Acceptable, but an editor may prefer a hand-written description field in the front matter.
- Cards are rendered at 1x (1200 x 630). A 2x render would be crisper on retina previews but four times the size; not needed for unfurls.
