#!/usr/bin/env python3
"""Site search's supplier result with an older country filter applied: python3 supq.py <label> <base url>"""
import json, sys, time
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from cdp import Page
label, base = sys.argv[1], sys.argv[2]
out = {}
for vp, (w, h, m) in (('1440', (1440, 900, False)), ('390', (390, 844, True))):
    p = Page(10353, w, h, m)
    p.goto(base + '#/suppliers', 7)
    p.ev("CP.Suppliers.setCountry('JP'); 0"); time.sleep(0.4)
    pre = p.ev("({country: document.getElementById('sup-country').value, count: document.getElementById('sup-count').textContent})")
    p.ev("document.querySelector('.search-btn').focus(); 0"); p.key('Enter'); time.sleep(0.3)
    p.type('TSMC'); time.sleep(0.7)
    pick = p.ev("(function(){var a=[].slice.call(document.querySelectorAll('#cp-search ol a')).filter(function(x){return x.querySelector('.k').textContent==='Supplier';})[0]; if(!a) return null; a.focus(); return a.querySelector('b').textContent;})()")
    p.key('Enter'); time.sleep(1.6)
    post = p.ev("(function(){var rows=[].slice.call(document.querySelectorAll('#sup-ladder .sup-firm, #sup-ladder li, #sup-table tbody tr')).filter(function(r){return r.offsetParent && /TSMC/.test(r.textContent);}); return {country: document.getElementById('sup-country').value, search: document.getElementById('sup-search').value, count: document.getElementById('sup-count').textContent, tsmcShown: rows.length > 0, active: document.activeElement.tagName + ' ' + document.activeElement.textContent.trim().slice(0, 30)};})()")
    out[vp] = {'before pick': pre, 'picked': pick, 'after pick': post}
    p.close()
json.dump(out, open(label + '-supplier-pick.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
