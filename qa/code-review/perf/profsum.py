#!/usr/bin/env python3
"""Summarise a V8 CPU profile: self and total time per function (ms), optionally within a time window (ms from profile start)."""
import json, sys
from collections import defaultdict
prof = json.load(open(sys.argv[1])); top = int(sys.argv[2]) if len(sys.argv) > 2 else 40
nodes = {n['id']: n for n in prof['nodes']}
parent = {}
for n in prof['nodes']:
    for c in n.get('children', []): parent[c] = n['id']
samples, deltas = prof['samples'], prof['timeDeltas']
selfms = defaultdict(float); totms = defaultdict(float)
def key(n):
    cf = n['callFrame']; u = cf['url'].split('/')[-1] or cf['url']
    return f"{cf['functionName'] or '(anon)'} @{u}:{cf['lineNumber']+1}:{cf['columnNumber']+1}"
for i, sid in enumerate(samples):
    dt = (deltas[i + 1] if i + 1 < len(deltas) else 0) / 1000.0
    n = nodes[sid]; selfms[key(n)] += dt
    seen = set(); cur = sid
    while cur is not None:
        k = key(nodes[cur])
        if k not in seen: totms[k] += dt; seen.add(k)
        cur = parent.get(cur)
print('== self'); [print(f'{v:9.1f}  {k}') for k, v in sorted(selfms.items(), key=lambda kv: -kv[1])[:top]]
print('== total'); [print(f'{v:9.1f}  {k}') for k, v in sorted(totms.items(), key=lambda kv: -kv[1])[:top]]
