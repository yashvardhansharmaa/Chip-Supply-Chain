#!/usr/bin/env python3
"""Merge the "New bibliography entries" JSON blocks from qa/round2/*-notes.md and expert-*.md into data/bibliography.json
(sorted by URL, indent 2, UTF-8, as the file is kept). Entries already present are left alone."""
import json, re, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = os.path.join(ROOT, 'data', 'bibliography.json')
bib = json.loads(open(p).read())
found = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'qa', 'round2', '*-notes.md')) + glob.glob(os.path.join(ROOT, 'qa', 'round2', 'expert-*.md')) + glob.glob(os.path.join(ROOT, 'qa', 'round3', '*-notes.md'))):
    s = open(f).read(); i = s.lower().find('new bibliography entries')
    if i < 0: continue
    for block in re.findall(r'```json\s*\n([\s\S]*?)\n```', s[i:]):
        try: d = json.loads(block)
        except Exception as e: print('skipped a block in', os.path.basename(f), e); continue
        if isinstance(d, list): d = {x.pop('url'): x for x in d if isinstance(x, dict) and 'url' in x}
        found.update({u: v for u, v in d.items() if isinstance(v, dict) and v.get('title')})
added = []
for u, v in found.items():
    if u in bib: continue
    e = {'title': v['title'], 'publisher': v['publisher']}
    if v.get('date'): e['date'] = v['date']
    e['type'] = v.get('type', 'page'); e['accessed'] = v.get('accessed', '2026-10-20')
    bib[u] = e; added.append(u)
open(p, 'w').write(json.dumps(dict(sorted(bib.items())), indent=2, ensure_ascii=False) + '\n')
print('added', len(added)); [print(' ', u[:120]) for u in added]
