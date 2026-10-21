#!/usr/bin/env python3
"""Self time on the renderer main thread by group and by phase. usage: phases.py trace.json measure.json"""
import json, sys, importlib.util
from collections import defaultdict
spec = importlib.util.spec_from_file_location('ts', __file__.replace('phases.py', 'tracesum_lib.py'))
import os
os.environ['TRACE'] = sys.argv[1]
spec = importlib.util.spec_from_file_location('ts', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tracesum_lib.py'))
ts = importlib.util.module_from_spec(spec); spec.loader.exec_module(ts)
m = json.load(open(sys.argv[2]))['runs'][0]['summary']
# trace t0 is the navigationStart of our page; performance.now() 0 is the same instant (within a few ms)
cuts = [('download (to responseEnd)', 0, m['respEnd']), ('end of parse + boot (to load end)', m['respEnd'], m['load']), ('after load (idle work)', m['load'], 1e9)]
recs = ts.records()
groups = ['Parse HTML', 'Style', 'Layout', 'Script', 'Paint & composite', 'GC', 'Other']
print('%-36s' % 'phase' + ''.join('%11s' % g[:10] for g in groups) + '%9s' % 'total')
for name, a, b in cuts:
    d = defaultdict(float)
    for r in recs:
        if a <= r['start'] < b: d[r['g']] += r['self']
    print('%-36s' % f'{name} {a:.0f}-{min(b, 99999):.0f}' + ''.join('%11.0f' % d.get(g, 0) for g in groups) + '%9.0f' % sum(d.values()))
d = defaultdict(float)
for r in recs: d[r['g']] += r['self']
print('%-36s' % 'all' + ''.join('%11.0f' % d.get(g, 0) for g in groups) + '%9.0f' % sum(d.values()))
big = sorted([r for r in recs if r['g'] in ('Style', 'Layout')], key=lambda r: -r['self'])[:8]
print('largest style/layout self:', [(r['name'][:30], round(r['start']), round(r['self'], 1)) for r in big])
