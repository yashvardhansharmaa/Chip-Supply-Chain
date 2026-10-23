import sys, os, json, time, base64
sys.path.insert(0, sys.argv[1])
from cdp import Browser, Session
port = int(sys.argv[2]); url = sys.argv[3]; out = sys.argv[4]
b = Browser(port)
try:
    s = Session(b.page_ws())
    reqs = []
    s.on('Network.requestWillBeSent', lambda p: reqs.append(p['request']['url']))
    s.send('Page.enable'); s.send('Network.enable')
    s.send('Network.setCacheDisabled', {'cacheDisabled': True})
    s.send('Page.navigate', {'url': url}); time.sleep(4)
    before = [u for u in reqs if u.endswith('.jpg')]
    pdf = s.send('Page.printToPDF', {'printBackground': True}, timeout=120)
    data = base64.b64decode(pdf['data']); open(out, 'wb').write(data)
    after = [u for u in reqs if u.endswith('.jpg')]
    print(json.dumps({'jpg_on_screen': [u.rsplit('/',1)[-1] for u in before], 'jpg_after_print': [u.rsplit('/',1)[-1] for u in after], 'pdf_bytes': len(data), 'images_in_pdf': data.count(b'/Subtype /Image') + data.count(b'/Subtype/Image')}))
finally:
    b.close()
