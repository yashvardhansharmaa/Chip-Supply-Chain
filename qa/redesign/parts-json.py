#!/usr/bin/env python3
"""Writes data/specimen-parts.json in its compact form (one part per line, as Lithography's entry was first written).
usage: python3 -I qa/redesign/parts-json.py   (reads the file, writes it back in the compact form)"""
import json, os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'data', 'specimen-parts.json')
d = json.load(open(P, encoding='utf-8'))
j = lambda v: json.dumps(v, ensure_ascii=False, separators=(', ', ': '))
pts = j
out = ['{', '  "_about": %s,' % j(d['_about'])]
keys = [k for k in d if k != '_about']
for i, k in enumerate(keys):
    e = d[k]
    out.append('  %s: {' % j(k))
    lines = []
    if 'specimen' in e: lines.append('    "specimen": %s' % j(e['specimen']))
    parts = ['      { ' + ', '.join('%s: %s' % (j(a), pts(b) if a == 'at' else j(b)) for a, b in p.items()) + ' }' for p in e['parts']]
    lines.append('    "parts": [\n' + ',\n'.join(parts) + '\n    ]')
    if 'still' in e:
        s = e['still']
        lines.append('    "still": {\n      "file": %s,\n      "size": %s,\n      "points": %s\n    }' % (j(s['file']), j(s['size']), pts(s['points'])))
    out.append(',\n'.join(lines))
    out.append('  }' + (',' if i < len(keys) - 1 else ''))
out.append('}')
open(P, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
json.load(open(P, encoding='utf-8'))
print('wrote', os.path.relpath(P))
