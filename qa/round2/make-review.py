#!/usr/bin/env python3
"""Builds qa/round2/review.html for the owner: the round-two working tree against the published site (git HEAD).
The page opens with two hand-written fragments: qa/round2/review-decisions.html (what the owner must decide) and
qa/round2/review-new.html (what is new, with stills). Images referenced there as src="shots/..." are inlined as data
URIs so the page is one self-contained file. Then, for each chapter, the three most visible pieces (one-line summary,
In short, In plain terms) side by side, and every other changed paragraph and field in a collapsed list. Data files are
matched entry by entry on a key (term, firm and year, date and title, question), so added entries show as new.
usage: python3 qa/round2/make-review.py"""
import base64, difflib, html, json, mimetypes, os, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / 'qa' / 'round2'
OUT = HERE / 'review.html'
BASE = os.environ.get('BASE', 'HEAD')

def head(path):
    r = subprocess.run(['git', 'show', f'{BASE}:{path}'], cwd=ROOT, capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ''

def work(path):
    p = ROOT / path
    return p.read_text() if p.exists() else ''

CITE = re.compile(r'\s*\(\[source\]\(([^)\s]+)\)\)')
LINK = re.compile(r'\[([^\]]+)\]\([^)]+\)')
def clean(s):
    s = CITE.sub('  [s]', str(s))
    s = LINK.sub(r'\1', s)
    return re.sub(r'[*_`]', '', s).strip()

def diff_pair(a, b):
    ta, tb = clean(a).split(), clean(b).split()
    sm = difflib.SequenceMatcher(None, ta, tb, autojunk=False)
    A, B = [], []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        x, y = html.escape(' '.join(ta[i1:i2])), html.escape(' '.join(tb[j1:j2]))
        if op == 'equal':
            A.append(x); B.append(y)
        else:
            if x: A.append(f'<del>{x}</del>')
            if y: B.append(f'<ins>{y}</ins>')
    return ' '.join(A), ' '.join(B)

def words(s):
    return len(clean(s).split())

def pair_html(label, a, b, cls=''):
    da, db = diff_pair(a, b)
    wa, wb = words(a), words(b)
    return (f'<div class="pair {cls}"><div class="lab"><span>{html.escape(label)}</span><span class="wc">{wa} → {wb} words</span></div>'
            f'<div class="cols"><div class="col before"><span class="tag">Live now</span><p>{da or "<em>(none)</em>"}</p></div>'
            f'<div class="col after"><span class="tag">Proposed</span><p>{db or "<em>(removed)</em>"}</p></div></div></div>')

def split_front(s):
    a = s.find('---json\n'); b = s.find('\n---', a + 8) if a >= 0 else -1
    if a < 0 or b < 0: return {}, s
    return json.loads(s[a + 8:b]), s[b + 4:]

SKIP = ('id', 'url', 'href', 'source', 'sources', 'data', 'kind', 'type', 'figure', 'unit', 'color', 'layout', 'src')
def flatten(v, path='', out=None):
    out = {} if out is None else out
    if isinstance(v, dict):
        for k, x in v.items():
            if k in SKIP or k.endswith('Sources'): continue
            flatten(x, f'{path}.{k}' if path else k, out)
    elif isinstance(v, list):
        for i, x in enumerate(v): flatten(x, f'{path}[{i}]', out)
    elif isinstance(v, str) and ' ' in v.strip() and not v.startswith('http'):
        out[path] = v
    return out

def takeaways(body):
    m = re.search(r'^## Takeaways\s*\n(.*?)(?=^#{1,6} |\Z)', body, re.S | re.M)
    return m.group(1).strip() if m else ''

def blocks(body):
    out, heading = [], '(top)'
    for blk in re.split(r'\n\s*\n', body):
        t = blk.strip()
        if not t: continue
        if re.match(r'^#{1,6}\s', t): heading = re.sub(r'^#+\s*', '', t.split('\n')[0]); continue
        if t.startswith('{{figure:') or t.startswith('|') or t.startswith('<!--'): continue
        out.append((heading, t))
    return out

def aligned(olds, news, label_of_old, label_of_new):
    """Pairs two lists of (label, text) with difflib; unequal runs are paired item by item where counts match."""
    out = []
    sm = difflib.SequenceMatcher(None, [t for _, t in olds], [t for _, t in news], autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal': continue
        o, n = olds[i1:i2], news[j1:j2]
        if len(o) == len(n):
            for (h, a), (_, b) in zip(o, n): out.append(pair_html(h, a, b))
        else:
            h = (n or o)[0][0]
            out.append(pair_html(h, '\n\n'.join(t for _, t in o), '\n\n'.join(t for _, t in n)))
    return out

def chapter_section(path, notes):
    fa, ba = split_front(head(path)); fb, bb = split_front(work(path))
    title = fb.get('title') or path
    num = path.split('/')[-1][:2]
    cid = fb.get('id', '')
    top = [pair_html('One-line summary (hero line, share card and search description)', fa.get('oneLiner', ''), fb.get('oneLiner', ''), 'key'),
           pair_html('In short (the Takeaways paragraph)', takeaways(ba), takeaways(bb), 'key'),
           pair_html('In plain terms', fa.get('plain', ''), fb.get('plain', ''), 'key')]
    rest = []
    A, B = flatten(fa), flatten(fb)
    for k in sorted(set(A) | set(B), key=lambda k: (list(B).index(k) if k in B else 9999)):
        if k in ('oneLiner', 'plain', 'title'): continue
        if A.get(k, '') != B.get(k, ''):
            rest.append(pair_html('Card and facts: ' + k, A.get(k, ''), B.get(k, '')))
    xa = [b for b in blocks(ba) if b[0] != 'Takeaways']; xb = [b for b in blocks(bb) if b[0] != 'Takeaways']
    rest += aligned(xa, xb, None, None)
    wa = sum(words(t) for _, t in blocks(ba)); wb = sum(words(t) for _, t in blocks(bb))
    note = notes.get(cid, '')
    return (f'<section class="ch" id="c{num}"><h2><span class="n">{num}</span>{html.escape(title)}<span class="wc">body {wa:,} → {wb:,} words · {len(rest)} other changes</span></h2>'
            + (f'<div class="expert">{note}</div>' if note else '')
            + ''.join(top)
            + (f'<details><summary>All {len(rest)} other changed paragraphs and card fields</summary>{"".join(rest)}</details>' if rest else '<p class="none">No other changes.</p>')
            + '</section>')

def keyed(path, text):
    """Returns an ordered dict key -> (label, entry) for a data file."""
    if not text: return {}
    j = json.loads(text)
    out = {}
    if path.endswith('flashcards.json'):
        for ch, deck in j.items():
            for i, c in enumerate(deck.get('cards', [])): out[f'{ch}|card|{c.get("q")}'] = (f'{ch} · card', c)
            for i, t in enumerate(deck.get('takeaways', []) if isinstance(deck.get('takeaways'), list) else []):
                out[f'{ch}|take|{i}'] = (f'{ch} · takeaway {i + 1}', {'text': t} if isinstance(t, str) else t)
        return out
    if isinstance(j, dict):
        j = j.get('flows') or j.get('rows') or j.get('events') or j.get('suppliers') or j.get('items') or [dict(v, _k=k) for k, v in j.items() if isinstance(v, dict)]
    for i, r in enumerate(j):
        if not isinstance(r, dict): continue
        if path.endswith('exposure.json'): k = f'{r.get("firm")}|{r.get("fiscalYear")}'; lab = f'{r.get("firm")} {r.get("fiscalYear")}'
        elif path.endswith('export-controls-timeline.json'): k = r.get('id') or f'{r.get("date")}|{r.get("title")}'; lab = f'{r.get("date")} · {r.get("title")}'
        else:
            lab = str(r.get('term') or r.get('name') or r.get('firm') or r.get('segment') or r.get('title') or r.get('q') or r.get('id') or r.get('_k') or i)
            k = str(r.get('id') or lab)
        while k in out: k += '+'
        out[k] = (lab, r)
    return out

DATA = [('data/flashcards.json', 'Flashcards', ('q', 'a', 'why', 'text', 'section')),
        ('data/glossary.json', 'Glossary', ('plain', 'why', 'aka')),
        ('data/export-controls-timeline.json', 'Export Controls timeline', ('title', 'summary', 'gist', 'category', 'actor', 'date')),
        ('data/control-flows.json', 'What still moves to China (board)', ('name', 'short', 'what', 'states', 'route')),
        ('data/control-thresholds.json', 'Control thresholds', ('label', 'note', 'summary', 'what')),
        ('data/exposure.json', 'China share of revenue', ('basis', 'note', 'chinaShare', 'chinaRevenue', 'totalRevenue', 'fyEnd', 'currency')),
        ('data/suppliers.json', 'Suppliers', ('role', 'aiRelevance', 'shareNote', 'ownership', 'customers', 'countryNote', 'chinaStatus')),
        ('data/landscape.json', 'AI Chips', ('notes', 'exportStatus', 'compute', 'priceEstimate', 'bomEstimate', 'target', 'status')),
        ('data/chokepoint-matrix.json', 'Concentration notes (matrix)', ('method', 'note', 'trend'))]

def as_text(v):
    if isinstance(v, (int, float)): return str(v)
    return v

def data_section(path, name, fields):
    A, B = keyed(path, head(path)), keyed(path, work(path))
    items, added, removed = [], 0, 0
    for k in list(B) + [k for k in A if k not in B]:
        la, ra = A.get(k, (None, None)); lb, rb = B.get(k, (None, None))
        lab = lb or la
        if ra is None: added += 1
        if rb is None: removed += 1
        fa = flatten({f: as_text(ra.get(f)) for f in fields} if ra else {})
        fb = flatten({f: as_text(rb.get(f)) for f in fields} if rb else {})
        for f in fields:
            va, vb = as_text((ra or {}).get(f)), as_text((rb or {}).get(f))
            if isinstance(va, str) and isinstance(vb, str) and ' ' not in (va + vb):  # short values: numbers, dates
                if va != vb: items.append(pair_html(f'{lab} · {f}', va, vb))
        for x in sorted(fa.keys() | fb.keys()):
            if fa.get(x, '') != fb.get(x, ''):
                items.append(pair_html(f'{lab} · {x}' + (' (new)' if ra is None else ' (removed)' if rb is None else ''), fa.get(x, ''), fb.get(x, '')))
    if not items: return ''
    meta = ', '.join(s for s in [f'{added} new' if added else '', f'{removed} removed' if removed else '', f'{len(items)} changed fields'] if s)
    return f'<section class="data"><h2>{html.escape(name)}<span class="wc">{meta}</span></h2><details><summary>Show all</summary>{"".join(items)}</details></section>'

def md_section(path, name):
    a, b = blocks(head(path)), blocks(work(path))
    items = aligned(a, b, None, None)
    if not items: return ''
    return f'<section class="data"><h2>{html.escape(name)}<span class="wc">{len(items)} changed paragraphs</span></h2><details><summary>Show all</summary>{"".join(items)}</details></section>'

def code_section():
    items = []
    for path in ['build/build.js', 'src/template.html', 'build/modules/walk.js', 'build/modules/summary-a.js', 'build/modules/social.js', 'src/app.js']:
        d = subprocess.run(['git', 'diff', '-U0', BASE, '--', path], cwd=ROOT, capture_output=True, text=True).stdout
        for hunk in re.split(r'\n(?=@@)', d):
            minus = [l[1:] for l in hunk.split('\n') if l.startswith('-') and not l.startswith('---')]
            plus = [l[1:] for l in hunk.split('\n') if l.startswith('+') and not l.startswith('+++')]
            strip = lambda s: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>|\$\{[^}]*\}', ' ', s)).strip()
            o, n = strip(' '.join(minus)), strip(' '.join(plus))
            # only hunks that change reader-facing words: quoted prose of three or more words
            prose = lambda s: ' '.join(re.findall(r"[\"'`]([A-Z][^\"'`]{12,})[\"'`]", s))
            po, pn = prose(o), prose(n)
            if (po or pn) and po != pn: items.append(pair_html(path, po, pn))
    if not items: return ''
    return f'<section class="data"><h2>Page copy in code<span class="wc">{len(items)} changed passages</span></h2><details><summary>Show all</summary>{"".join(items)}</details></section>'

def inline_images(fragment):
    def rep(m):
        p = (HERE / m.group(1)).resolve()
        if not p.exists(): return m.group(0)
        mime = mimetypes.guess_type(str(p))[0] or 'image/png'
        return f'src="data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}"'
    return re.sub(r'src="((?:shots|stills)/[^"]+)"', rep, fragment)

def fragment(name):
    p = HERE / name
    return inline_images(p.read_text()) if p.exists() else ''

notes = json.loads((HERE / 'review-expert-notes.json').read_text()) if (HERE / 'review-expert-notes.json').exists() else {}
chapters = sorted(p.as_posix().replace(ROOT.as_posix() + '/', '') for p in (ROOT / 'content').glob('[0-9][0-9]-*.md'))
nav = '<a href="#decide">Decide</a><a href="#new">New</a>' + ''.join(f'<a href="#c{p.split("/")[-1][:2]}">{p.split("/")[-1][:2]}</a>' for p in chapters) + '<a href="#data">Data pages</a>'
body = f'<section id="decide">{fragment("review-decisions.html")}</section><section id="new">{fragment("review-new.html")}</section>'
body += ''.join(chapter_section(p, notes) for p in chapters)
data = ''.join(data_section(*d) for d in DATA)
data += md_section('data/exposure-notes.md', 'China share notes') + md_section('data/control-thresholds-notes.md', 'Threshold notes') + code_section()
body += data.replace('<section class="data">', '<section class="data" id="data">', 1)

CSS = '''
:root{--bg:#fbfaf8;--ink:#1d1a1a;--mute:#6b6363;--line:#e4dfdc;--card:#ffffff;--garnet:#7a1f2b;--ins:#dcefdc;--insink:#174d1f;--del:#f6dede;--delink:#7a1f2b;--hi:#fff6e0}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#171414;--ink:#ece6e4;--mute:#a59b98;--line:#332c2c;--card:#1f1b1b;--garnet:#d9707f;--ins:#1e3a22;--insink:#bfe8c3;--del:#3d1f24;--delink:#f0b7bf;--hi:#2b2418}}
:root[data-theme="dark"]{--bg:#171414;--ink:#ece6e4;--mute:#a59b98;--line:#332c2c;--card:#1f1b1b;--garnet:#d9707f;--ins:#1e3a22;--insink:#bfe8c3;--del:#3d1f24;--delink:#f0b7bf;--hi:#2b2418}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 "Source Serif 4",Georgia,serif}
header{padding:28px 16px 8px;max-width:1240px;margin:auto}h1{font:600 26px/1.2 "Inter Tight",system-ui,sans-serif;margin:0 0 6px;text-wrap:balance}
.lede{color:var(--mute);max-width:70ch;margin:0 0 14px}
nav{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:8px 16px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;font:13px system-ui,sans-serif}
nav a{color:var(--garnet);text-decoration:none;padding:2px 6px;border:1px solid var(--line);border-radius:4px}
nav a:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid var(--garnet);outline-offset:2px}
main{max-width:1240px;margin:auto;padding:8px 16px 60px}
h2{font:600 19px/1.3 "Inter Tight",system-ui,sans-serif;margin:38px 0 10px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;text-wrap:balance}
h3{font:600 16px/1.35 "Inter Tight",system-ui,sans-serif;margin:22px 0 6px}
h2 .n{color:var(--garnet);font-variant-numeric:tabular-nums}.wc{font:12px system-ui,sans-serif;color:var(--mute);font-weight:400;margin-left:auto}
.pair{background:var(--card);border:1px solid var(--line);border-radius:6px;margin:10px 0;padding:10px 12px}
.pair.key{border-color:var(--garnet)}.lab{font:600 12px/1.4 system-ui,sans-serif;color:var(--mute);letter-spacing:.02em;display:flex;gap:10px;margin-bottom:6px}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:760px){.cols{grid-template-columns:1fr}}
.col p{margin:4px 0 0;white-space:pre-line;overflow-wrap:anywhere}.tag{font:600 11px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.after .tag{color:var(--garnet)}del{background:var(--del);color:var(--delink);text-decoration:line-through}ins{background:var(--ins);color:var(--insink);text-decoration:none}
details{margin:8px 0}summary{cursor:pointer;font:600 14px system-ui,sans-serif;color:var(--garnet);padding:6px 0}.none{color:var(--mute);font-size:14px}
.expert{background:var(--hi);border:1px solid var(--line);border-radius:6px;padding:10px 14px;margin:6px 0 12px;font-size:15px}
.expert p{margin:4px 0}.expert ul{margin:4px 0;padding-left:20px}
.decision{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--garnet);border-radius:6px;padding:12px 14px;margin:12px 0}
.decision h3{margin:0 0 4px}.decision p{margin:6px 0}.rec{font:600 13px/1.5 system-ui,sans-serif;color:var(--garnet)}
.opts{margin:6px 0;padding-left:20px}.opts li{margin:3px 0}
figure{margin:12px 0}figure img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:6px;display:block}
figcaption{font:13px/1.45 system-ui,sans-serif;color:var(--mute);margin-top:4px}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;align-items:start}
table{border-collapse:collapse;font:14px/1.45 system-ui,sans-serif;width:100%}th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{color:var(--mute);font-weight:600}td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.tablewrap{overflow-x:auto}
'''
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Round Two Review</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"><style>{CSS}</style></head><body>
<header><h1>Round two: everything that changes before it goes live</h1>
<p class="lede">Nothing here is on the live site yet. Decisions come first, then what is new, then every chapter and data page, with the live text beside the proposed text (struck words are removed, marked words are added; [s] marks a citation). Citation-only changes, such as added page numbers, are not shown.</p></header>
<nav>{nav}</nav><main>{body}</main></body></html>'''
OUT.write_text(page)
print(f'wrote {OUT} ({OUT.stat().st_size // 1024} KB)')
