#!/usr/bin/env python3
"""Apply the page agents' mappings (qa/round2/pages/<stem>.json) to the chapters: each citation into a long PDF
gains #page=N. Card source fields that point at the same PDF follow when every body citation of that PDF in the
chapter agrees on one page; otherwise they are listed for a decision.

usage: python3 qa/round2/apply-pages.py [--write]     (without --write it only reports)
"""
import json, os, re, sys, glob, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WRITE = '--write' in sys.argv
ONLY = [a for a in sys.argv[1:] if not a.startswith('--')]  # chapter number prefixes, e.g. 01 02; none means all
CITE = re.compile(r'\(\[source\]\((https?:[^)\s]+)\)\)')

def split_front(src):
    m = re.match(r'^---json\s*\n([\s\S]*?)\n---\s*\n?', src)
    return (src[:m.end()], src[m.end():]) if m else ('', src)

report = collections.defaultdict(list)
for mp in sorted(glob.glob(os.path.join(ROOT, 'qa', 'round2', 'pages', '*.json'))):
    stem = os.path.basename(mp)[:-5]
    if ONLY and stem[:2] not in ONLY: continue
    path = os.path.join(ROOT, 'content', stem + '.md')
    if not os.path.exists(path): report['missing chapter'].append(stem); continue
    entries = json.load(open(mp))
    src = open(path).read()
    front, body = split_front(src)
    front0 = front
    new_body = body
    pages_by_url = collections.defaultdict(set)
    applied = 0
    for e in entries:
        url, page, sent = e.get('url'), e.get('page'), (e.get('sentence') or '').strip()
        if not url or not page:
            report['no page'].append(f"{stem}: {sent[:60]}… {e.get('problem', '')}"); continue
        if not isinstance(page, int) or page < 1:
            report['bad page'].append(f'{stem}: {page} {url}'); continue
        pages_by_url[url].add(page)
        # the sentence begins with the excerpt; its citation is the first ([source](url)) after that point. A sentence
        # that appears more than once in the chapter gets the page at every occurrence.
        starts, i = [], new_body.find(sent[:80])
        while i >= 0: starts.append(i); i = new_body.find(sent[:80], i + 1)
        if not starts:
            report['sentence not found'].append(f'{stem}: {sent[:70]}'); continue
        if len(starts) > 1: report['sentence appears more than once (page applied to each)'].append(f'{stem}: {sent[:60]} ×{len(starts)}')
        target = url.split('#')[0] + f'#page={page}'
        # the same sentence in the front matter's prose fields (plain repeats the first How it works paragraph, and the
        # two must stay identical)
        j = front.find(sent[:80])
        while j >= 0:
            for c in CITE.finditer(front, j):
                if c.group(1).split('#')[0] == url.split('#')[0]:
                    if c.group(1) != target and ('#' not in c.group(1) or c.group(1).split('#', 1)[1].startswith('page=')):
                        front = front[:c.start(1)] + target + front[c.end(1):]; report['front matter prose updated'].append(f'{stem}: {sent[:50]}')
                    break
                if c.start() - j > 2000: break
            j = front.find(sent[:80], j + 1)
        for i in reversed(starts):
            m = None
            for c in CITE.finditer(new_body, i):
                if c.group(1).split('#')[0] == url.split('#')[0]: m = c; break
                if c.start() - i > 2000: break
            if not m:
                report['citation not found after sentence'].append(f'{stem}: {sent[:60]} → {url}'); continue
            old = m.group(1)
            if old == target: continue
            if '#' in old and not old.split('#', 1)[1].startswith('page='):
                report['url has another fragment'].append(f'{stem}: {old}'); continue
            new_body = new_body[:m.start(1)] + target + new_body[m.end(1):]
            applied += 1
    # card source fields: follow the body when the chapter cites that PDF at one page only. Only the card object is
    # touched (its text carries no URLs, so a URL inside it is a source field); keyFacts and figure sources stay as they are.
    new_front = front
    k = front.find('"card":')
    if k >= 0:
        j = front.index('{', k); depth = 0
        for n in range(j, len(front)):
            depth += {'{': 1, '}': -1}.get(front[n], 0)
            if depth == 0: break
        card_old = front[j:n + 1]; card = card_old
        for url, pages in pages_by_url.items():
            base = url.split('#')[0]
            if f'"{base}"' not in card: continue
            if len(pages) == 1:
                card = card.replace(f'"{base}"', f'"{base}#page={next(iter(pages))}"')
            else:
                report['card URL with several body pages (decide)'].append(f'{stem}: {base} pages {sorted(pages)}')
        new_front = front[:j] + card + front[n + 1:]
    report['applied'].append(f'{stem}: {applied} citations')
    if WRITE and (new_body != body or new_front != front0):
        open(path, 'w').write(new_front + new_body)

for k, v in report.items():
    print(f'## {k} ({len(v)})')
    for x in v: print('  ' + x)
print('written' if WRITE else 'dry run: nothing written')
