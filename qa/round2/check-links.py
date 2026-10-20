#!/usr/bin/env python3
"""Check every cited URL once: chapters' inline citations, figure and keyFact sources, card source fields, and the
data files' source fields. Writes qa/round2/links.json ({url: {status, final, kind, where: [...]}}) and prints a summary.

kind: ok (2xx/3xx to a 2xx), broken (404, 410, DNS or connection failure), blocked (401, 403, 429, a bot challenge:
the page may be fine, but a script cannot tell), error (5xx, timeout). Uses a generic User-Agent and no personal data.
usage: python3 qa/round2/check-links.py [--workers 8]
"""
import json, os, re, sys, glob, time, threading, urllib.request, urllib.error, ssl, socket
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 (link check; chipsupplychain.org)'
workers = int(sys.argv[sys.argv.index('--workers') + 1]) if '--workers' in sys.argv else 8

where = {}
def add(url, place):
    url = url.split('#')[0].replace('&amp;', '&')
    if url.startswith('http'): where.setdefault(url, set()).add(place)
for f in sorted(glob.glob(os.path.join(ROOT, 'content', '*.md'))):
    s = open(f).read(); stem = os.path.basename(f)[:-3]
    for u in re.findall(r'\]\((https?:[^)\s]+)\)', s): add(u, stem)
    for u in re.findall(r'"(https?://[^"\s]+)"', s): add(u, stem)
for f in sorted(glob.glob(os.path.join(ROOT, 'data', '*.json'))):
    if f.endswith(('bibliography.json', 'source-tiers.json')): continue
    s = open(f).read(); name = 'data/' + os.path.basename(f)
    for u in re.findall(r'"(https?://[^"\s]+)"', s): add(u, name)
print(len(where), 'distinct URLs', file=sys.stderr)

ctx = ssl.create_default_context()
host_lock = {}
def fetch(url):
    h = urlsplit(url).hostname or ''
    lock = host_lock.setdefault(h, threading.Lock())
    with lock:  # one request at a time per host, with a pause, to be polite
        for method in ('HEAD', 'GET'):
            req = urllib.request.Request(url, method=method, headers={'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'en'})
            try:
                with urllib.request.urlopen(req, timeout=25, context=ctx) as r:
                    code, final = r.status, r.geturl()
                    body = r.read(4096) if method == 'GET' else b''
                    if re.search(rb'cf-chl|challenge-platform|Just a moment|captcha|Attention Required', body, re.I):
                        res = {'status': code, 'final': final, 'kind': 'blocked'}
                    else:
                        res = {'status': code, 'final': final, 'kind': 'ok'}
                    if method == 'HEAD' and code >= 400: continue
                    break
            except urllib.error.HTTPError as e:
                code = e.code
                if method == 'HEAD' and code in (403, 405, 400, 404, 429, 501, 500): res = {'status': code, 'kind': 'retry'}; continue
                kind = 'broken' if code in (404, 410) else 'blocked' if code in (401, 403, 429, 451) else 'error'
                res = {'status': code, 'kind': kind}; break
            except (urllib.error.URLError, socket.timeout, ConnectionError, ssl.SSLError) as e:
                reason = str(getattr(e, 'reason', e))
                kind = 'broken' if re.search(r'Name or service not known|nodename nor servname|No address|getaddrinfo', reason) else 'error'
                res = {'status': None, 'kind': kind, 'reason': reason[:160]}
                if method == 'HEAD': continue
                break
            except Exception as e:
                res = {'status': None, 'kind': 'error', 'reason': str(e)[:160]}
                if method == 'HEAD': continue
                break
        time.sleep(0.4)
    res['where'] = sorted(where[url])
    return url, res

out = {}
with ThreadPoolExecutor(max_workers=workers) as ex:
    for i, (u, r) in enumerate(ex.map(fetch, sorted(where))):
        out[u] = r
        if (i + 1) % 50 == 0: print(i + 1, 'checked', file=sys.stderr)
json.dump(out, open(os.path.join(ROOT, 'qa', 'round2', 'links.json'), 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(Counter(r['kind'] for r in out.values()))
for u, r in sorted(out.items()):
    if r['kind'] in ('broken', 'error'): print(r['kind'], r.get('status'), u[:130], r['where'][:3])
