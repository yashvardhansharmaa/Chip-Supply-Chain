#!/usr/bin/env python3
"""Merges the collectors' qa/round3/revenue-<group>.json files into data/suppliers.json as a `revenue` object per
supplier (placed right after `revenueYear`), keeping the file's serialization (indent 2, UTF-8, trailing newline).
The verbatim `quote` stays in the round-three files; the data file carries amount, unit, currency, scope, basis,
fiscalYear, fyStart, fyEnd, source and note. A supplier missing from every revenue file keeps whatever it has.
usage: python3 qa/round3/merge-revenue.py [--write]"""
import glob, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, 'data', 'suppliers.json')
KEEP = ('amount', 'unit', 'currency', 'scope', 'basis', 'fiscalYear', 'fyStart', 'fyEnd', 'source')
# The collectors' notes are provenance for editors (they stay in qa/round3/revenue-*.json). Readers see a note only
# where the figure needs explaining.
READER_NOTES = {
  'Nidec': "Nidec's auditor gave no opinion on these accounts, a disclaimer of opinion in the report filed on 30 September 2026.",
  'Shinko Electric Industries': 'Shinko has been private since June 2025. This is its last published consolidated figure, from an unaudited results release.',
  'ASMPT': 'Continuing operations only. ASMPT has classified its NEXX business as held for sale.',
  'CXMT': 'CXMT listed in July 2026, so the figure comes from the audited accounts in its listing prospectus.',
  'Cerebras Systems': 'Cerebras listed in May 2026, so the figure comes from its listing prospectus.',
  'Ansys': 'Ansys has filed no accounts since Synopsys bought it in July 2025, so this is its last annual figure.',
  'Alphawave Semi': 'Alphawave is now part of Qualcomm. The figure comes from its 2025 accounts filed at Companies House.',
}
DROP = ('revenueUSDb', 'revenueYear')  # computed by the build from `revenue` (build/fx.js); never stored
sup = json.load(open(P))
by = {r['name']: r for r in sup}
found, unknown = {}, []
for f in sorted(glob.glob(os.path.join(ROOT, 'qa', 'round3', 'revenue-*.json'))):
    for name, rec in json.load(open(f)).items():
        if name not in by: unknown.append((os.path.basename(f), name)); continue
        found[name] = {k: rec.get(k) for k in KEEP if rec.get(k) not in (None, '') or k == 'amount'}
        if name in READER_NOTES: found[name]['note'] = READER_NOTES[name]
out = []
for r in sup:
    if r['name'] in found:
        items, placed = [], False
        for k, v in r.items():
            if k == 'revenue': continue
            if k in DROP:
                if not placed: items.append(('revenue', found[r['name']])); placed = True
                continue
            items.append((k, v))
        if not placed: items.append(('revenue', found[r['name']]))
        r = dict(items)
    out.append(r)
print(f'{len(found)} suppliers get a filed revenue; unknown names: {unknown or "none"}')
if '--write' in sys.argv:
    open(P, 'w').write(json.dumps(out, indent=2, ensure_ascii=False) + '\n')
    print('wrote data/suppliers.json')
