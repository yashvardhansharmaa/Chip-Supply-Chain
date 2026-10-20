#!/usr/bin/env python3
"""Applies the experts' shared-file proposals listed in qa/round2/shared-patches.json to data/flashcards.json,
data/glossary.json and data/suppliers.json, keeping each file's exact serialization (flashcards: indent 2, ASCII
escapes; the others: indent 2, UTF-8; all with a trailing newline).

Each patch: {"file": "flashcards" | "glossary" | "suppliers", "where": {...}, "field": "a", "before": "...", "after": "...",
             "by": "expert-<id>", "note": "why"}
  flashcards: where = {"deck": "<chapter id>", "list": "cards" | "takeaways", "index": N}  (index counts from 0)
  glossary:   where = {"term": "<term>"}
  suppliers:  where = {"name": "<name>"}
"before" must occur exactly once in the current value (a substring is fine), or the patch is refused and reported.
For a takeaway (a plain string), leave "field" out. Dry run by default; --write saves.
usage: python3 qa/round2/apply-shared.py [--write]"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FILES = {'flashcards': ('data/flashcards.json', True), 'glossary': ('data/glossary.json', False), 'suppliers': ('data/suppliers.json', False)}
patches = json.load(open(os.path.join(ROOT, 'qa', 'round2', 'shared-patches.json')))
data = {k: json.load(open(os.path.join(ROOT, p))) for k, (p, _) in FILES.items()}
ok, bad = 0, 0
for i, p in enumerate(patches):
    d, w, f = data[p['file']], p['where'], p.get('field')
    try:
        if p['file'] == 'flashcards':
            lst = d[w['deck']][w.get('list', 'cards')]
            holder, key = (lst[w['index']], f) if f else (lst, w['index'])
        elif p['file'] == 'glossary':
            hits = [e for e in d if e.get('term') == w['term']]
            assert len(hits) == 1, f'{len(hits)} glossary entries named {w["term"]!r}'
            holder, key = hits[0], f
        else:
            hits = [e for e in d if e.get('name') == w['name']]
            assert len(hits) == 1, f'{len(hits)} suppliers named {w["name"]!r}'
            holder, key = hits[0], f
        cur = holder[key]
        n = cur.count(p['before'])
        assert n == 1, f'"before" found {n} times in the current value: {cur[:160]!r}'
        holder[key] = cur.replace(p['before'], p['after'])
        ok += 1
        print(f'ok   {i:>3} {p["file"]} {w} {f or ""} ({p.get("by", "")})')
    except Exception as e:
        bad += 1
        print(f'FAIL {i:>3} {p["file"]} {w} {f or ""} ({p.get("by", "")}): {e}')
print(f'{ok} applied, {bad} refused')
if '--write' in sys.argv and not bad:
    for k, (path, asc) in FILES.items():
        s = json.dumps(data[k], indent=2, ensure_ascii=asc) + '\n'
        full = os.path.join(ROOT, path)
        if s != open(full).read():
            open(full, 'w').write(s); print('wrote', path)
elif '--write' in sys.argv:
    print('nothing written: fix the refused patches first')
