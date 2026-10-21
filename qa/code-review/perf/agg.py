#!/usr/bin/env python3
"""Median and range of each metric across runs. usage: agg.py file.json [file.json ...]"""
import json, sys, statistics as st
keys = ['fcp', 'lcp', 'tbt', 'lt_max', 'longtasks', 'cls', 'draw', 'respEnd', 'dcl', 'load', 'build_ms_total', 'dom', 'heap']
for f in sys.argv[1:]:
    d = json.load(open(f)); rs = [r['summary'] for r in d['runs']]
    out = []
    for k in keys:
        v = [r[k] for r in rs if isinstance(r.get(k), (int, float))]
        if not v: out.append(f'{k} -'); continue
        med = st.median(v)
        out.append(f'{k} {med:.0f} [{min(v):.0f}-{max(v):.0f}]' if k != 'cls' else f'cls {med:.4f} [{min(v):.4f}-{max(v):.4f}]')
    lcpel = {r['lcp_el'] for r in rs}
    fb = rs[0]['first_build']
    print(f'== {f} (n={len(rs)})\n   ' + '  '.join(out) + f'\n   lcp element {lcpel}  first build {fb}  stage {rs[0]["stage"]}')
    # requests of run 0
    reqs = d['runs'][0]['requests']
    tot = sum(q['bytes'] or 0 for q in reqs)
    print('   requests run0: ' + '; '.join(f"{q['url'].replace('http://127.0.0.1:8765','')[:60]} {q['bytes'] or q['failed']} @{q['start_ms']}" for q in sorted(reqs, key=lambda q: q['start_ms'] or 0) if 'robots' not in q['url'] and 'favicon.ico' not in q['url']))
