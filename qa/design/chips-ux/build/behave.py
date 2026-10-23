#!/usr/bin/env python3
"""Behaviour check for the AI Chips slots and picker, driven with real key and mouse events over the DevTools protocol.
usage: python3 qa/design/chips-ux/build/behave.py [url] [--mobile] [--port 9971]
Prints one line per step (PASS or FAIL with what it saw) and every console error or uncaught exception. Exit 1 on any failure.
"""
import json, os, subprocess, sys, time, urllib.request
import websocket

args = sys.argv[1:]
mobile = '--mobile' in args
port = int(args[args.index('--port') + 1]) if '--port' in args else 9971
url = next((a for a in args if a.startswith(('http', 'file'))), 'http://127.0.0.1:8765/#/landscape')
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
udd = f'/tmp/cp-behave-{os.getpid()}'
proc = subprocess.Popen([chrome, '--headless=new', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-first-run', '--no-default-browser-check',
                         f'--remote-debugging-port={port}', f'--user-data-dir={udd}', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
fails, errors = [], []
try:
    for _ in range(50):
        try: targets = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list')); break
        except Exception: time.sleep(0.2)
    page = next(t for t in targets if t['type'] == 'page')
    ws = websocket.create_connection(page['webSocketDebuggerUrl'], suppress_origin=True)
    mid = [0]
    def send(method, params=None):
        mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': method, 'params': params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get('method') == 'Runtime.exceptionThrown': errors.append('exception: ' + json.dumps(msg['params']['exceptionDetails'].get('exception', {}).get('description', msg['params']['exceptionDetails'].get('text')))[:300])
            elif msg.get('method') == 'Runtime.consoleAPICalled' and msg['params']['type'] in ('error', 'assert'): errors.append('console.error: ' + json.dumps([a.get('value', a.get('description')) for a in msg['params']['args']])[:300])
            elif msg.get('method') == 'Log.entryAdded' and msg['params']['entry']['level'] == 'error': errors.append('log: ' + msg['params']['entry'].get('text', '')[:300] + ' ' + msg['params']['entry'].get('url', '')[-60:])
            if msg.get('id') == mid[0]: return msg.get('result', {})
    def js(expr):
        r = send('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True})
        return r.get('result', {}).get('value')
    def key(k, code=None, kc=0): # keyDown carries the text for Enter, so a preventDefault on keydown suppresses the keypress, as in a browser
        down = {'type': 'keyDown', 'key': k, 'code': code or k, 'windowsVirtualKeyCode': kc}
        if k == 'Enter': down['text'] = '\r'
        send('Input.dispatchKeyEvent', down)
        send('Input.dispatchKeyEvent', {'type': 'keyUp', 'key': k, 'code': code or k, 'windowsVirtualKeyCode': kc})
        time.sleep(0.15)
    KC = {'Enter': 13, 'Escape': 27, 'ArrowDown': 40, 'ArrowUp': 38, 'Tab': 9}
    def press(k): key(k, k, KC.get(k, 0))
    def type_(s): send('Input.insertText', {'text': s}); time.sleep(0.2)
    def click(x, y):
        for t in ('mousePressed', 'mouseReleased'): send('Input.dispatchMouseEvent', {'type': t, 'x': x, 'y': y, 'button': 'left', 'clickCount': 1})
        time.sleep(0.2)
    def check(name, cond, seen):
        print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  saw: ' + json.dumps(seen)[:400]));
        if not cond: fails.append(name)
    W, H = (390, 844) if mobile else (1440, 900)
    send('Runtime.enable'); send('Log.enable'); send('Page.enable')
    send('Emulation.setDeviceMetricsOverride', {'width': W, 'height': H, 'deviceScaleFactor': 2 if mobile else 1, 'mobile': mobile})
    if mobile: send('Emulation.setTouchEmulationEnabled', {'enabled': True})
    send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
    send('Page.navigate', {'url': url}); time.sleep(6)
    S = "(() => { const L = CP.Landscape, a = document.activeElement; return { picked: L.picked.slice(), open: !!L.pop, live: (document.getElementById('cxa-live') || {}).textContent, ask: (document.getElementById('cxa-ask') || {}).textContent, " \
        "active: a ? (a.id || a.getAttribute('aria-label') || a.textContent.trim().slice(0, 40)) : null, activeSlot: a && a.closest('.cxa-slot') ? a.closest('.cxa-slot').getAttribute('data-i') : null, act: a && a.getAttribute('data-act'), " \
        "opt: L.popActive ? L.popActive.getAttribute('data-id') : null, desc: (document.getElementById('cxp-in') || {getAttribute(){return null}}).getAttribute('aria-activedescendant'), tag: document.getElementById('stage-tag-text').textContent, sw: document.documentElement.scrollWidth }; })()"
    st = lambda: js(S)
    s = st(); check('opens with nothing picked and the package on the stage', s['picked'] == [] and 'package' in s['tag'] and s['ask'].startswith('Choose two chips'), s)
    js("document.querySelector('#cxa-row .cxa-slot[data-i=\"0\"] [data-act=choose]').focus()"); press('Enter'); time.sleep(0.2)
    s = st(); check('Enter on slot 1 opens the picker with the field focused', s['open'] and s['active'] == 'cxp-in', s)
    check('the field is a combobox that controls the listbox', js("(() => { const i = document.getElementById('cxp-in'); return i.getAttribute('role') === 'combobox' && i.getAttribute('aria-controls') === 'cxp-list' && document.getElementById('cxp-list').getAttribute('role') === 'listbox'; })()"), None)
    press('ArrowDown'); s = st(); check('ArrowDown makes the first chip active (aria-activedescendant)', s['opt'] == 'nvidia-b200' and s['desc'] == 'cxp-o-nvidia-b200', s)
    type_('ascend'); s = st(); check('typing filters, first match active', s['opt'] == 'huawei-ascend-910b' and js("[...document.querySelectorAll('.cxp-o')].filter(o => !o.hidden).length") == 4, s)
    press('ArrowDown'); press('Enter'); time.sleep(0.3); s = st()
    check('Enter picks it; focus moves to the waiting slot 2', s['picked'] == ['huawei-ascend-910c'] and not s['open'] and s['activeSlot'] == '1' and s['act'] == 'choose', s)
    time.sleep(0.2); s = st(); check('live region: added + next step', s['live'] == 'Ascend 910C added. Choose one more chip to compare.' and s['ask'] == 'Choose one more chip to compare.', s)
    press('Enter'); s = st(); check('Enter on slot 2 opens its picker', s['open'], s)
    check('chip in slot 1 is marked and disabled', js("(() => { const o = document.getElementById('cxp-o-huawei-ascend-910c'); return o.getAttribute('aria-disabled') === 'true' && /In chip 1/.test(o.textContent); })()"), None)
    press('Escape'); s = st(); check('Escape closes and returns focus to slot 2', not s['open'] and s['activeSlot'] == '1' and s['act'] == 'choose', s)
    press('Enter'); r = js("(() => { const r = document.getElementById('cxa-ask').getBoundingClientRect(); return [r.left + 5, r.top + 5]; })()")
    if mobile: r = [W / 2, 30]  # on a phone the sheet covers the page: outside it is the scrim above
    click(r[0], r[1]); s = st(); check('an outside click (the scrim, on a phone) closes the picker without a pick', not s['open'] and s['picked'] == ['huawei-ascend-910c'], s)
    js("document.querySelector('.cxa-try button').focus()"); t = js("document.activeElement.getAttribute('data-id')"); press('Enter'); time.sleep(0.2); s = st()
    check('Try with fills slot 2; focus on its Change', s['picked'] == ['huawei-ascend-910c', t] and s['activeSlot'] == '1' and s['act'] == 'choose', s)
    check('a third slot waits as a ghost', js("(() => { const g = document.querySelector('#cxa-row .cxa-slot[data-i=\"2\"]'); return !!g && g.getAttribute('data-state') === 'more' && /Add a third chip \\(optional\\)/.test(g.textContent); })()"), None)
    js("document.querySelector('#cxa-row .cxa-slot[data-i=\"1\"] [data-act=remove]').focus()"); press('Enter'); time.sleep(0.2); s = st()
    check('Remove empties slot 2; focus on slot 2 button', s['picked'] == ['huawei-ascend-910c'] and s['activeSlot'] == '1' and s['act'] == 'choose', s)
    time.sleep(0.1); s = st(); check('live region: removed + next step', s['live'].endswith('removed. Choose one more chip to compare.'), s)
    js("document.getElementById('cx-clear').focus()"); press('Enter'); time.sleep(0.2); s = st()
    check('Clear empties all; focus on slot 1; stage back to the package', s['picked'] == [] and s['activeSlot'] == '0' and 'package' in s['tag'], s)
    # the checklist and the slots stay in step both ways
    js("document.getElementById('cxa-browse').open = true; document.querySelector('#picker button[data-id=\"nvidia-b200\"]').click()"); time.sleep(0.2)
    check('a tick in the checklist fills slot 1', js("CP.Landscape.picked.join() === 'nvidia-b200' && /B200/.test(document.querySelector('#cxa-row .cxa-slot[data-i=\"0\"]').textContent)"), st())
    js("document.querySelector('#cxa-row .cxa-slot[data-i=\"0\"] [data-act=remove]').click()"); time.sleep(0.2)
    check('Remove in a slot unticks the checklist', js("document.querySelector('#picker button[data-id=\"nvidia-b200\"]').getAttribute('aria-pressed') === 'false'"), st())
    for i, cid in enumerate(['nvidia-b200', 'amd-mi355x', 'google-tpu-v7-ironwood', 'aws-trainium3']):
        js(f"document.querySelector('#cxa-row .cxa-slot[data-i=\"{i}\"] [data-act=choose]').click()"); time.sleep(0.1)
        js(f"(() => {{ const i = document.getElementById('cxp-in'); i.value = {json.dumps(cid.split('-', 1)[1].replace('-', ' '))}; i.dispatchEvent(new Event('input')); CP.Landscape.setActive(document.getElementById('cxp-o-{cid}')); }})()")
        press('Enter'); time.sleep(0.15)
    s = st(); check('four picks fill the row; no fifth slot', len(s['picked']) == 4 and js("document.querySelectorAll('#cxa-row .cxa-slot').length") == 4 and s['ask'] == 'Comparing 4 chips.', s)
    check('at four the checklist marks the rest unavailable', js("document.querySelectorAll('#picker button[aria-disabled=\"true\"]').length") == 34, None)
    js("document.querySelector('#picker button[data-id=\"intel-gaudi3\"]').click()"); time.sleep(0.2); s = st()
    check('a fifth tick is refused, said in the guidance line and the live region', len(s['picked']) == 4 and 'four' in s['ask'].lower() and 'four' in s['live'].lower(), s)
    js("document.querySelector('#cxa-row .cxa-slot[data-i=\"0\"] [data-act=choose]').focus()"); press('Enter'); press('ArrowDown'); press('ArrowDown'); s = st()
    check('Change opens the picker; arrows skip chips in other slots', s['open'] and s['opt'] not in ('amd-mi355x', 'google-tpu-v7-ironwood', 'aws-trainium3'), s)
    press('Escape')
    js("CP.Landscape.select('nvidia-h100')"); time.sleep(0.3); s = st()
    check('search (Landscape.select) still adds a chip', 'nvidia-h100' in s['picked'] and len(s['picked']) == 4, s)
    js("location.hash = '#/stack'"); time.sleep(1.5); js("window.scrollTo(0, 2600)"); time.sleep(1); js("CP.Landscape.clear(); location.hash = '#/landscape'"); time.sleep(1.5); s = st()
    check('arriving from The Chain with nothing picked shows the package', 'package' in s['tag'], s)
    check('no horizontal scroll', s['sw'] <= W, s)
    check('targets in the slots and picker are 24 px or more', js("(() => { const L = CP.Landscape; L.setPair(['nvidia-b200','huawei-ascend-910c']); const els = [...document.querySelectorAll('#cx-slots button, #cx-slots summary')].filter(e => e.offsetParent && !e.closest('#picker')); return els.filter(e => { const r = e.getBoundingClientRect(); return r.height < 24; }).map(e => e.textContent.trim()); })()") == [], js("[...document.querySelectorAll('#cx-slots button')].filter(e => e.offsetParent && e.getBoundingClientRect().height < 24).map(e => e.textContent)"))
    if mobile:
        js("document.querySelector('#cxa-row .cxa-slot[data-i=\"2\"] [data-act=choose]').click()"); time.sleep(0.3)
        check('on a phone the picker is a sheet from the bottom over the strip', js("(() => { const p = document.getElementById('cxp'), r = p.getBoundingClientRect(); return p.classList.contains('is-sheet') && Math.abs(r.bottom - innerHeight) < 2 && r.width === innerWidth && getComputedStyle(p).position === 'fixed'; })()"), js("(() => { const r = document.getElementById('cxp').getBoundingClientRect(); return [r.top, r.bottom, r.width, innerHeight]; })()"))
        press('Escape')
    # fix2: Change and × where the reader is, the bar that follows, no clipped names
    OWN = ['nvidia-b200', 'huawei-ascend-950dt', 'nvidia-h20', 'nvidia-h200-china']
    js("CP.Landscape.setPair(%s); window.scrollTo(0, 0)" % json.dumps(OWN)); time.sleep(0.4)
    check('the bar is hidden while the slots are in view', js("document.getElementById('cx-sticky').hidden") is True, None)
    js("CP.scrollToEl(document.getElementById('cx-plans').parentNode.querySelector('.cx-h'))"); time.sleep(0.5)
    bar = js("(() => { const b = document.getElementById('cx-sticky'), r = b.getBoundingClientRect(); return { hidden: b.hidden, top: Math.round(r.top), mast: CP.headerH(), names: [...b.querySelectorAll('[data-bar=name]')].map(x => x.textContent), add: !!b.querySelector('[data-bar=add]'), pad: getComputedStyle(document.documentElement).scrollPaddingTop, v: getComputedStyle(document.documentElement).getPropertyValue('--cx-sticky').trim() }; })()")
    check('in the comparison the bar shows under the masthead with each chip, no + Add at four', not bar['hidden'] and abs(bar['top'] - bar['mast']) <= 1 and bar['names'] == ['B200', 'Ascend 950DT', 'H20', 'H200'] and not bar['add'], bar)
    check('scroll padding covers the masthead and the bar (--cx-sticky)', bar['v'] not in ('', '0px') and float(bar['pad'].replace('px', '')) >= bar['mast'] + float(bar['v'].replace('px', '')), bar)
    clip = js("""(() => [...document.querySelectorAll('.cx-plan-name b, .cx-colhead b, .cxa-name, .cxs-name')].filter(e => e.offsetParent).filter(e => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1 || getComputedStyle(e).webkitLineClamp !== 'none' || getComputedStyle(e).textOverflow === 'ellipsis').map(e => e.textContent))()""")
    check('no chip name is clipped in the cards, the table heads, the slots or the bar', clip == [], clip)
    on = js("(() => { const on = [...document.querySelectorAll('#cx-plans .cx-plan.is-on')]; return { n: on.length, label: on[0] && on[0].querySelector('.cx-on').textContent, id: on[0] && on[0].querySelector('[data-id]').getAttribute('data-id'), sel: CP.Landscape.sel, tag: document.getElementById('stage-tag-text').textContent }; })()")
    check('one package card says "On the stage", and it is the chip on the stage', on['n'] == 1 and on['label'] == 'On the stage' and on['id'] == on['sel'], on)
    js("document.querySelector('#cx-plans [data-act=change][data-slot=\"2\"]').focus()"); press('Enter'); time.sleep(0.2)
    s = st(); check('Change on a package card opens the picker for that chip', s['open'] and js("CP.Landscape.pop && CP.Landscape.pop.slot") == 2 and js("CP.Landscape.pop.origin") == '#cx-plans', s)
    near = js("(() => { const p = document.getElementById('cxp').getBoundingClientRect(), c = document.querySelector('#cx-plans .cx-plan:nth-child(3)').getBoundingClientRect(); return [Math.round(p.top - c.bottom), Math.round(p.left - c.left)]; })()")
    if not mobile: check('the picker opens anchored under that card', 0 <= near[0] <= 12, near)
    type_('MI355X'); press('Enter'); time.sleep(0.3); s = st()
    check('a pick from a card changes that column; focus stays on its Change in the cards', s['picked'][2] == 'amd-mi355x' and js("document.activeElement === document.querySelector('#cx-plans [data-act=change][data-slot=\"2\"]')"), s)
    js("document.querySelector('#cx-table [data-act=remove][data-slot=\"1\"]').focus()"); nm = js("document.activeElement.getAttribute('aria-label')"); press('Enter'); time.sleep(0.3); s = st()
    check('× on a table head removes that chip; focus moves to the Change of the next column in the table', nm == 'Remove Ascend 950DT from the comparison' and 'huawei-ascend-950dt' not in s['picked'] and len(s['picked']) == 3 and js("document.activeElement === document.querySelector('#cx-table [data-act=change][data-slot=\"1\"]')"), [nm, s])
    check('with three chips the bar offers + Add', js("!!document.querySelector('#cx-sticky [data-bar=add]') && !document.getElementById('cx-sticky').hidden"), None)
    js("document.querySelector('#cx-sticky [data-bar=remove][data-slot=\"0\"]').focus()"); press('Enter'); time.sleep(0.3); s = st()
    check('× in the bar removes that chip; focus stays in the bar', s['picked'][0] != 'nvidia-b200' and len(s['picked']) == 2 and js("document.activeElement && document.activeElement.closest('#cx-sticky') !== null"), s)
    js("document.querySelector('#cx-sticky [data-bar=name][data-slot=\"1\"]').focus()"); press('Enter'); time.sleep(0.4); s = st()
    check('a chip name in the bar goes back to its slot and opens Change', s['open'] and js("CP.Landscape.pop.slot") == 1 and js("document.getElementById('cxa-row').getBoundingClientRect().top >= 0"), s)
    press('Escape'); s = st(); check('Escape returns focus to that slot', not s['open'] and s['activeSlot'] == '1', s)
    js("CP.scrollToEl(document.getElementById('cx-table-wrap'))"); time.sleep(0.4)
    js("document.querySelector('#cx-sticky [data-bar=add]').focus()"); press('Enter'); time.sleep(0.4); s = st()
    check('+ Add in the bar opens the picker for the next empty slot', s['open'] and js("CP.Landscape.pop.slot") == 2, s)
    press('Escape'); js("CP.scrollToEl(document.getElementById('cx-table-wrap'))"); time.sleep(0.4)
    js("document.querySelector('#cx-sticky [data-bar=clear]').focus()"); press('Enter'); time.sleep(0.4); s = st()
    check('Clear in the bar empties all; the bar goes; focus on slot 1; --cx-sticky back to 0', s['picked'] == [] and js("document.getElementById('cx-sticky').hidden") and s['activeSlot'] == '0' and js("getComputedStyle(document.documentElement).getPropertyValue('--cx-sticky').trim()") == '0px', s)
    small = js("[...document.querySelectorAll('.cx-act, .cx-x, #cx-sticky button')].filter(e => e.offsetParent).filter(e => e.getBoundingClientRect().height < 24 || e.getBoundingClientRect().width < 24).map(e => e.textContent)")
    js("CP.Landscape.setPair(%s); CP.scrollToEl(document.getElementById('cx-table-wrap'))" % json.dumps(OWN)); time.sleep(0.4)
    small = js("[...document.querySelectorAll('.cx-act, .cx-x, #cx-sticky button')].filter(e => e.offsetParent).filter(e => e.getBoundingClientRect().height < 24 || e.getBoundingClientRect().width < 24).map(e => e.textContent)")
    check('the new controls are 24 px or more', small == [], small)
    check('no horizontal scroll with four chips and the bar', js("document.documentElement.scrollWidth") <= W, js("document.documentElement.scrollWidth"))
    js("CP.Landscape.clear(); window.scrollTo(0, 0)")
    # the review's repro: a chapter, then AI Chips, a pick, then Back; each page draws its own specimen
    tagjs = "document.getElementById('stage-tag-text').textContent + ' | ' + document.getElementById('stage-caption').textContent.slice(0, 60)"
    send('Page.navigate', {'url': 'about:blank'}); time.sleep(0.5)  # a fresh load, as in the report
    send('Page.navigate', {'url': url.split('#')[0] + '#lithography'}); time.sleep(6)
    t1 = js(tagjs); check('a chapter shows its own specimen', 'Lithography' in t1, t1)
    js("location.hash = '#/landscape'"); time.sleep(1.5)
    t2 = js(tagjs); check('AI Chips with nothing picked shows the package, never the chapter', 'package' in t2 and 'Lithography' not in t2, t2)
    js("document.querySelector('#cxa-row .cxa-slot[data-i=\"0\"] [data-act=choose]').focus()"); press('Enter'); press('ArrowDown'); press('Enter'); time.sleep(0.6)
    t3 = js(tagjs); check('a pick draws its chip', 'B200' in t3, t3)
    js("history.back()"); time.sleep(2.5)
    t4 = js(tagjs); check('Back to the chapter draws its specimen again, not the chip', 'Lithography' in t4 and 'B200' not in t4, t4)
    print('errors:', errors if errors else 'none')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except Exception: proc.kill()
    subprocess.run(['rm', '-rf', udd])
sys.exit(1 if fails or errors else 0)
