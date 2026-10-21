#!/usr/bin/env python3
"""Build qa/design/review.html: the owner's review of the four design reviews (21 Oct 2026).

One self-contained page: the decisions (numbered, each with a before and after), then the fixes
the main session will make unless the owner objects. Shots are embedded as JPEG data URLs so the
page opens anywhere. Run from the repo root: python3 qa/design/make-review.py
"""
import base64, html, io, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SH = os.path.join(HERE, 'shots')
OUT = os.path.join(HERE, 'review.html')
total = 0
last_w = 0


def img(path, width=1100, crop=None):
    """A shot as a data URL, scaled to at most `width` px wide. crop = (top, bottom) in source px."""
    global total
    im = Image.open(os.path.join(SH, path)).convert('RGB')
    if crop:
        im = im.crop((0, crop[0], im.width, min(im.height, crop[1])))
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=74, optimize=True, progressive=True)
    total += buf.tell()
    global last_w
    last_w = im.width
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def pair(before, after, cap_b='Now', cap_a='Proposed', width=1100, crop=None, narrow=False):
    cls = 'pair narrow' if narrow else 'pair'
    return (f'<div class="{cls}"><figure><figcaption>{cap_b}</figcaption><img loading="lazy" src="{img(before, width, crop)}" alt="{html.escape(cap_b)}"></figure>'
            f'<figure><figcaption>{cap_a}</figcaption><img loading="lazy" src="{img(after, width, crop)}" alt="{html.escape(cap_a)}"></figure></div>')


def single(path, cap, width=1100, crop=None):
    src = img(path, width, crop)
    return f'<div class="one"><figure style="max-width:{round(last_w * 0.75)}px"><figcaption>{cap}</figcaption><img loading="lazy" src="{src}" alt="{html.escape(cap)}"></figure></div>'


F, D, C, P = 'design-front/', 'design-data/', 'design-chapter/', 'design-print/'

decisions = [
    ('The home page on a laptop leads with the chain at a glance',
     'On a phone, the title is followed by "The chain at a glance": the fifteen stages, each with its rating. That block is the site\'s argument in one look. On a laptop it is hidden, and the first screen shows a table of five other pages that repeats the tabs at the top. The proposal shows the glance on laptops too and moves the table of other pages to the end of the walk, in place of the three boxed links there. The phone does not change.',
     'Yes. The cost: chapter 1 of the walk starts just below the first screen on a laptop.',
     pair(F + 'p2-front-door-1440-before.png', F + 'p2-front-door-A-1440-after.png')),
    ('On phones, drop the Home tab so all five sections fit',
     'At 390 px the tab strip is wider than the screen, so Glossary hides under a fade. The wordmark already goes home, so the proposal hides the Home tab on phones only. All five sections then fit on a normal phone.',
     'Yes.',
     single(F + 'p2-phone-tabs-390-zoom.png', 'Top: now. Bottom: proposed (390 px phone).', 780)),
    ('Retire the fixed stage strip above the chapters on laptops',
     'Once a reader scrolls into The Chain, a fixed strip of fifteen bars appears under the masthead. The left column beside every chapter already shows the same fifteen stages, so the chain is drawn twice. The proposal removes the strip on laptops and gives the left column a small key to its bars (Extreme, High). Phones are unchanged.',
     'Yes. The reading area gains 60 px.',
     pair(C + 'p2-rail-litho-before.png', C + 'p2-rail-litho-after.png')),
    ('Red marks one thing in each chart',
     'Today every bar in a bar chart is red, and the stacked bars use eight bright colors, some repeated inside one chart (in chapter 4, Rest of Asia and the United States are the same blue). The proposal follows the rule the summary PDF already uses: red for the largest bar or share, ink for the rest, and a hatch for "All others". The question is the three stacks split by country (wafers, photoresist, ASML sales by region): <b>A</b> keep each country\'s own color there, with the duplicates fixed, or <b>B</b> ink tones there too.',
     'Yes, with A for the three country charts, so a country looks the same on every page.',
     pair(C + 'p2-bars-costs-before.png', C + 'p2-bars-costs-after.png', 'Bar chart now', 'Proposed') +
     pair(C + 'p1-stack-pcshare-before.png', C + 'p1-stack-pcshare-after.png', 'Stacked bar now', 'Proposed')),
    ('Supplier ribbons: red only for the firms rated Critical',
     'A ribbon turns wholly red today if any one firm in it is Critical. That paints 67 firms\' worth of ribbon red for 28 Critical firms. The widest red band, US to accelerator vendors, holds one Critical firm out of fifteen. The proposal splits each ribbon so only the Critical firms are red, each as wide as its count. The rest are drawn in pale ink, and a country takes its color when it is picked or hovered. The chart also fits a phone screen.',
     'Yes. It is the most honest picture of the chokepoints on the site.',
     pair(D + '03-ribbons-unlit-1440.png', D + 'P01-ribbons-after-A-1440.png')),
    ('The export controls board becomes a chart',
     'Each of the eleven rows is in one of five states, from No license to Prohibited, but the state is drawn as a border style on a label at the far right, with its key 1,400 px below. The proposal gives every row a five-step scale with a dot at its state, red from Presumption of denial onward, labelled once at the top. A closed row is one line, and its description opens with the row. When you move the year, the dots slide to their state on that date. The year buttons show how many moves each year saw.',
     'Yes. It answers "what can still be sold" for every row at a glance.',
     pair(D + '13-board-subject-1440.png', D + 'P03-board-after-1440.png')),
    ('The PDFs: a proper chapter opening',
     'Each chapter now starts at the top margin, with the running head printed just above the title, and a hole of about a sixth of the page above the notes, because the chokepoint card cannot fit and moves to page 2. The proposal drops the title 20 mm and prints no running head on the opening page. The fifteen stages are listed in the margin with the current one marked, and the card opens page 2 so the opening text fills page 1. Running heads on later pages name the section ("How it works", "Who makes it").',
     'Yes. Across the book: 175 to 173 pages, no short pages.',
     pair(P + 'book-p33-opener-ch04-before.png', P + 'book-p33-opener-ch04-after.png', 'Now', 'Proposed', 720, narrow=True)),
    ('The specimen caption, set left like a museum label',
     'The caption under each 3D specimen is centered today, which you chose on 18 September. Eight centered lines are hard to read back along. The proposal sets the label and caption flush left at the same width, and the label names the object ("Specimen 04 · EUV scanner") instead of repeating the chapter title.',
     'Yes, but it reverses your earlier choice, so it is yours to make.',
     pair(C + 'p3-caption-before.png', C + 'p3-caption-after.png')),
    ('Open in dark mode for readers whose device is set to dark',
     'Today the site always opens on paper unless the reader picks dark with the button. A reader whose phone is in dark mode at night gets a bright white page. The proposal follows the device\'s setting on a first visit, and a choice made with the button still wins.',
     'Yes. Paper stays the default for everyone else.',
     single(F + 'p3-os-dark-phone-pair.png', 'A phone set to dark. Left: now. Right: proposed.', 800)),
    ('The PDFs: print the flashcard questions',
     'On paper the flashcards disappear and only "Four things to remember" prints, which gives the answers. The proposal prints the chapter\'s existing four flashcard questions first, each pointing to the section that answers it, so a student can test themselves before reading the answers. These are the flashcards already on the site, not new questions. You dropped discussion questions earlier, which is why this is asked.',
     'Yes, for students studying from the PDF.',
     pair(P + 'chapter-lithography-p9-review-before.png', P + 'chapter-lithography-p9-review-after.png', 'Now', 'Proposed', 720, narrow=True)),
    ('Number style in charts and tables',
     'Chart values carry no units ("60 / 200 / 350") while the unit sits in a small tag after the title. Table figures sit flush left, so magnitudes do not line up. The proposal puts short units on the values ("$60M", "48 tools"), right-aligns figure columns on even digits, and joins number ranges in tables with an en dash ("$2,800–3,100") so they do not break across lines. Two chart titles that spell "($M)" would lose it.',
     'Yes to all three. The en dash is a short range dash, not the em dash the writing rules ban.',
     pair(C + 'p3-units-price-before.png', C + 'p3-units-price-after.png', 'Units now', 'Proposed') +
     pair(C + 'p2-table-costs-before.png', C + 'p2-table-costs-after.png', 'Table now', 'Proposed')),
    ('The Chain\'s contents: one line per chapter',
     'Under every chapter in the contents of The Chain sit the same four links (How it works, Variants, Who makes it, The chokepoint): 60 lines that do not tell one chapter from another. The proposal shows each chapter\'s one-line summary instead. The section links stay in search and in each chapter.',
     'Yes.',
     pair(C + 'p3-contents-before.png', C + 'p3-contents-after.png')),
    ('China\'s share on the chapter cards',
     'You asked for China\'s share to leave the Suppliers list and appear when a company is opened. The chapter cards do the same thing the list did: under "Who leads", ASML carries "China 29.1% of revenue, FY2025" (crop below). Should the cards drop that line, so the share appears only in the company\'s drawer, the Glossary card and the Export Controls chart?',
     'Drop it from the cards, to match your call on the Suppliers list.',
     single(C + 'all-litho-card-before.png', 'The ASML line on the Lithography card today', 1100, (430, 610))),
]

fixes = [
    ('Every page', [
        'The theme button shows a sun in dark mode (it shows the moon in both today).',
        'The search backdrop darkens the page in dark mode instead of washing it grey.',
        'Dark mode: the grey High bars no longer outshine the red Extreme bars, and the red badge text passes contrast.',
        'Search results stop printing footnote numbers in their snippets ("per pin 9.").',
        'Footnote marks sit tight to their word, so a mark never starts a line on its own ("¹⁵ ." today).',
        'Masthead: the current tab is marked on the masthead line, and the search and theme buttons lose their boxes.',
        'Search on phones shows twice as many results, and the first result is marked as the one Enter opens. An empty search suggests a few terms.',
        'Glossary terms get a dotted underline, so they read differently from links.',
        'The footer lines up with the text column, signed with the tile.',
        'One type and spacing scale across the site (16 label sizes become five), and one main heading per page for screen readers.',
    ], [pair(F + 'p1-dark-bars-chapter-1440-before.png', F + 'p1-dark-bars-chapter-1440-after.png', 'Dark mode now', 'Fixed'),
        single(F + 'p2-masthead-1440-zoom.png', 'Masthead. Top: now. Bottom: proposed.', 1100)]),
    ('Chapters', [
        'Bar charts are drawn with whole labels ("Static timing (Synopsys Pr" today), readable on phones.',
        'The chokepoint card says each rating once, lines up with the text\'s right edge, and lays out better on tablets.',
        'The chapter head: facts on one line (length, updated), actions on the next (link, cite, PDF).',
        'Sources come before Previous and Next at the end of a chapter.',
        'The Chain opens like the other tabs, and the phone chapter head is shorter, so the title sits higher.',
        'Flashcards no longer scroll the page sideways on a 320 px phone, and the unusable Previous link is hidden on card 1.',
        'Timeline marks in chapters 8 and 17 sit on their rule again.',
    ], [pair(C + 'p1-barlabels-before.png', C + 'p1-barlabels-after.png', 'Bar labels now', 'Fixed'),
        pair(C + 'p2-card-1440-before.png', C + 'p2-card-1440-after.png', 'Card now', 'Proposed')]),
    ('Data pages', [
        'Export Controls: the US category is ink, not red. In dark mode it is the same color as China\'s today (1.09:1).',
        'Suppliers: the EU-27 column is orange, not a second green next to Taiwan\'s.',
        'China revenue panels: the highest year stays visible in grayscale and to color-blind readers, the gridlines go, and the panels pack together (the grid drops from 2,708 to 1,244 px tall). The table under them passes contrast.',
        'The ladder\'s large numbers become each stage\'s number of firms (today they are a rank that reads like a chapter number), with a key to the name colors.',
        'The export buttons become one quiet line ("Copy the board · Table · JSON") under what they copy. On a phone the first timeline entry rises about 200 px.',
        'AI Chips: the picker becomes a three-column checklist (1,258 to 669 px tall), so a comparison starts higher.',
        'Glossary: list labels on one line, and country cards draw their shares as real bars.',
        'Coming up: red only for dates within 30 days.',
        'Suppliers: the filter controls match the site, and a firm\'s drawer shows its small China revenue chart.',
    ], [pair(D + '20-exposure-1440-top.png', D + 'P04-exposure-after-1440.png', 'China revenue panels now', 'Proposed'),
        pair(D + '04-ladder-1440.png', D + 'P02-ladder-after-1440.png', 'Ladder now', 'Proposed')]),
    ('PDFs and share cards', [
        'Share cards: "Moderately hard to substitute" runs into the specimen on 8 cards. Sentence-case tags fit, and the card names the object ("Specimen 13 · Probe card over a wafer").',
        'The contents page: one title column, page numbers on their lines, and print wording that no longer promises 3D models.',
        'The cover carries the wordmark, and its title prints at the regular weight the cards use (it prints in bold today). Chapter PDFs open with the wordmark too.',
        'On paper the card drops the two tags that repeat its cells, and country codes lose their boxes.',
        'The source list reads like a bibliography, and no page holds only the last two sources.',
        'Animation stills print on white instead of a grey panel.',
        'The citation at the end is set as type, not grey code boxes.',
        'The summary PDF: the wordmark, "Moderately hard to substitute" as on the site, and slightly wider margins (still 4 pages).',
    ], [pair(P + 'card-test-and-assembly-before.png', P + 'card-test-and-assembly-after.png', 'Card now', 'Fixed', 900),
        pair(P + 'book-p02-contents-before.png', P + 'book-p02-contents-after.png', 'Contents now', 'Proposed', 720, narrow=True)]),
]

css = """
:root{--bg:#f7f6f2;--card:#fff;--ink:#14181f;--ink2:#3b424c;--mute:#5c636d;--line:#e2dfd8;--garnet:#7a1f2b;--tint:#f3ecea}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#12151a;--card:#191d23;--ink:#ecebe6;--ink2:#c3c7cd;--mute:#9aa1aa;--line:#2b3038;--garnet:#e07a84;--tint:#241a1c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12151a;--card:#191d23;--ink:#ecebe6;--ink2:#c3c7cd;--mute:#9aa1aa;--line:#2b3038;--garnet:#e07a84;--tint:#241a1c;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 "Source Serif 4",Georgia,serif}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 80px}
header{padding:40px 0 10px;border-bottom:1px solid var(--ink)}
.kicker{font:600 12px/1 "Instrument Sans",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--garnet);margin:0 0 12px}
h1{font:500 clamp(30px,4vw,44px)/1.08 "Fraunces",Georgia,serif;margin:0 0 12px;letter-spacing:-.01em;text-wrap:balance}
.lede{max-width:44em;color:var(--ink2);margin:0 0 14px}
.how{max-width:44em;background:var(--tint);border-left:3px solid var(--garnet);padding:12px 16px;margin:18px 0 8px}
.how p{margin:0}
h2{font:500 28px/1.15 "Fraunces",Georgia,serif;margin:46px 0 4px;padding-top:14px;border-top:1px solid var(--line)}
h2 + p{color:var(--mute);margin:0 0 10px;max-width:46em}
.dec{display:grid;grid-template-columns:52px minmax(0,1fr);column-gap:14px;padding:26px 0 8px;border-bottom:1px solid var(--line)}
.dec .n{font:400 40px/1 "Fraunces",Georgia,serif;color:var(--garnet);text-align:right;font-variant-numeric:lining-nums}
.dec h3{font:600 20px/1.25 "Source Serif 4",Georgia,serif;margin:2px 0 8px;text-wrap:balance}
.dec p{margin:0 0 10px;max-width:46em}
.rec{font:500 14.5px/1.45 "Instrument Sans",system-ui,sans-serif;color:var(--ink)}
.rec b{color:var(--garnet);font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:12px;margin-right:6px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:10px 0 16px}
.pair.narrow{max-width:760px}
.one{margin:10px 0 16px}
figure{margin:0;min-width:0}
figcaption{font:600 11.5px/1 "Instrument Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:0 0 6px}
figure img{display:block;width:100%;height:auto;border:1px solid var(--line);background:#fff}
.one figure img{max-width:1100px}
.fx{padding:10px 0 6px;border-bottom:1px solid var(--line)}
.fx h3{font:600 13px/1 "Instrument Sans",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:16px 0 8px;color:var(--ink2)}
.fx ul{margin:0 0 12px;padding-left:20px;max-width:50em}
.fx li{margin:0 0 5px}
.next{max-width:46em}
.next li{margin:0 0 6px}
@media (max-width:700px){.pair{grid-template-columns:1fr}.dec{grid-template-columns:34px minmax(0,1fr);column-gap:10px}.dec .n{font-size:30px}}
"""

parts = []
for i, (title, body, rec, shots) in enumerate(decisions, 1):
    parts.append(f'<section class="dec" id="d{i}"><div class="n">{i}</div><div><h3>{html.escape(title)}</h3><p>{body}</p>'
                 f'<p class="rec"><b>Recommend</b>{html.escape(rec)}</p>{shots}</div></section>')
fixparts = []
for head, items, shots in fixes:
    fixparts.append(f'<div class="fx"><h3>{html.escape(head)}</h3><ul>' + ''.join(f'<li>{html.escape(x)}</li>' for x in items) + '</ul>' + ''.join(shots) + '</div>')

page = f"""<title>Design Round Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Instrument+Sans:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>{css}</style><div class="wrap">
<header><p class="kicker">Chip Supply Chain · design review · 21 October 2026</p>
<h1>What four designers would change</h1>
<p class="lede">Four senior designers each took one part of the site: the home page and the frame around every page, the chapters, the data pages, and the PDFs with the share cards. Each proved every proposal on real screenshots, now and proposed. Nothing has been built yet. Their full reports are in <code>qa/design/</code>.</p>
<div class="how"><p><b>How to answer.</b> Part one has {len(decisions)} numbered decisions, each with my recommendation. Reply with something like "all yes except 8 and 9", and pick A or B on 4. Part two lists the fixes and smaller upgrades I will make unless you object to one.</p></div>
</header>
<h2>Part one: decisions for you</h2>
<p>These change how a page is built or reverse something you chose earlier.</p>
{''.join(parts)}
<h2>Part two: fixes and upgrades I will make</h2>
<p>Bugs, contrast failures and clear improvements that keep every layout you chose. Two pictures per group as examples. Every item has its own pair in the reports.</p>
{''.join(fixparts)}
<h2>How it gets built</h2>
<ol class="next">
<li>Four builders, one per part of the site, each owning separate files so nobody overwrites anyone.</li>
<li>A checker at phone, tablet and laptop widths, in light and dark, plus every PDF and share card rendered again and checked page by page.</li>
<li>A review page of the finished result, and the push only when you say so.</li>
</ol>
</div>"""

open(OUT, 'w').write(page)
print(f'wrote {OUT}: {len(page)/1e6:.2f} MB, images {total/1e6:.2f} MB, {len(decisions)} decisions')
