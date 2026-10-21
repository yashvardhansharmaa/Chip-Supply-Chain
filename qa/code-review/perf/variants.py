#!/usr/bin/env python3
"""What-if copies of dist/index.html, written to the scratchpad only (never to the repo), for CPU-side measurements."""
import re, os, gzip
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'dist', 'index.html')  # the repository's dist/, found from this file's place in qa/code-review/perf/
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'var')  # never inside dist/
os.makedirs(OUT, exist_ok=True)
h = open(DIST, encoding='utf-8').read()

def section_span(doc, view):
    m = re.search(r'<section class="view[^"]*" data-view="%s"[^>]*>' % view, doc)
    depth = 0
    for t in re.finditer(r'<(/?)section\b[^>]*>', doc[m.start():]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return m.start(), m.end(), m.start() + t.start(), m.start() + t.end()  # open start, open end, close start, close end

def empty_view(doc, view, keep_footer=True):
    """the section stays (the router needs it); its contents go, as if rendered on first visit"""
    a, b, c, d = section_span(doc, view)
    inner = doc[b:c]
    keep = ''
    if view == 'stack':
        # keep the article shells' attributes so Sections still finds the chapters (data-specimen), with no content
        keep = ''.join(re.sub(r'>[\s\S]*$', '></article>', m.group(0)) for m in re.finditer(r'<article class="chapter[^>]*>', inner))
        keep += '<div id="contents"></div>'
    if view == 'glossary':
        keep = '<input id="gl-search" type="search"><button id="lk-browse"></button><ul id="lk-items"></ul><p id="lk-count"></p><div id="lk-rest"></div><dl class="glossary" id="glossary"></dl><div id="lk-card" hidden></div><section id="lk-mentions" hidden></section>'
    return doc[:b] + keep + doc[c:]

def no_has(doc):
    head_end = doc.index('</head>')
    return doc[:head_end].replace(':has(', ':is(') + doc[head_end:]

def slim_cites(doc):
    return re.sub(r'(<sup class="cite"><a [^>]*?)( data-t="[^"]*" data-p="[^"]*" data-d="[^"]*")((?: data-pg="\d+")?)( data-tier="[^"]*") aria-label="[^"]*"', lambda m: m.group(1) + m.group(3) + m.group(4) + ' aria-label="Source"', doc)

V = {}
V['base'] = h
V['nohas'] = no_has(h)
home = h
for v in ['stack', 'glossary', 'controls', 'suppliers', 'landscape']:
    home = empty_view(home, v)
V['lazy-home'] = home
chain = h
for v in ['walk', 'glossary', 'controls', 'suppliers', 'landscape']:
    chain = empty_view(chain, v)
V['lazy-chain'] = chain
V['slimcite'] = slim_cites(h)
V['lazy-home-nohas'] = no_has(home)
V['lazy-chain-slim-nohas'] = no_has(slim_cites(chain))
for k, s in V.items():
    b = s.encode('utf-8')
    open(os.path.join(OUT, k + '.html'), 'wb').write(b)
    print(f'{k:24s} raw {len(b):9d} gzip {len(gzip.compress(b, 9)):8d} elements {len(re.findall(r"<[a-zA-Z]", s[s.index("<body>"):])):6d}')
