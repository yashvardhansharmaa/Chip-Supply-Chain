#!/usr/bin/env python3
"""Before/after shots of AI Chips, no injection: whatever the build serves.
usage: python3 qa/design/chips-ux/build/shoot.py <tag> <state> <1440|1024|390|320> <light|dark> [--full]
env:   BASE (default http://127.0.0.1:8765/; a file:///.../dist/index.html shoots a private build), OUT (folder, default here)
states: empty, empty-slots (scrolled to the slots), one, two, three, four, five (four, then a fifth tick in the checklist), from-chain (The Chain first, then AI Chips),
        picker (one pick, then slot 2's picker open), picker-typed (the same, "asc" typed), browse (one pick, a tick in the checklist),
        table (three picks, scrolled to the table)
Picks go through the page's own controls: the slot buttons and the picker when the page has them (#cxa-row), else the checklist.
"""
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
shoot = os.path.join(here, '..', '..', 'shots', 'design-chapter', 'proof', 'dc_shoot.py')
args = [a for a in sys.argv[1:] if a != '--full']; full = '--full' in sys.argv
tag, state, width, theme = args[:4]
out = os.path.join(os.environ.get('OUT', here), f'{tag}-{state}-{width}-{theme}.png')
B, A, M, T = 'nvidia-b200', 'huawei-ascend-910c', 'amd-mi355x', 'google-tpu-v7-ironwood'
IDS = {'one': [B], 'two': [B, A], 'three': [B, A, M], 'four': [B, A, M, T], 'five': [B, A, M, T, 'aws-trainium3'],
       'picker': [B], 'picker-typed': [B], 'browse': [B], 'table': [B, A, M],
       # the owner's four (21 Oct): two long names, scrolled to the plans, to the table, or with the plans' Change open
       'owner': ['nvidia-b200', 'huawei-ascend-950dt', 'nvidia-h20', 'nvidia-h200-china'], 'owner-table': ['nvidia-b200', 'huawei-ascend-950dt', 'nvidia-h20', 'nvidia-h200-china'],
       'owner-change': ['nvidia-b200', 'huawei-ascend-950dt', 'nvidia-h20', 'nvidia-h200-china'], 'owner-top': ['nvidia-b200', 'huawei-ascend-950dt', 'nvidia-h20', 'nvidia-h200-china']}
js = """
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const state = %s, ids = %s, $ = (s) => document.querySelector(s);
  if (state === 'from-chain') { location.hash = '#/stack'; await sleep(1500); window.scrollTo(0, 2600); await sleep(1200); location.hash = '#/landscape'; await sleep(1500); }
  const slots = !!$('#cxa-row');
  const tick = (id) => { const d = $('#cxa-browse'); if (d) d.open = true; $('#picker button[data-id="' + id + '"]').click(); };
  const pick = async (id, i) => { // open the slot, type the name, press Enter: the way a keyboard reader picks
    if (!slots) { tick(id); return; }
    $('#cxa-row .cxa-slot[data-i="' + i + '"] [data-act="choose"]').click(); await sleep(60);
    const inp = $('#cxp-in'), c = CP.Landscape.byId(id);
    inp.value = c.name; inp.dispatchEvent(new Event('input', { bubbles: true }));
    if (!CP.Landscape.popActive || CP.Landscape.popActive.getAttribute('data-id') !== id) CP.Landscape.setActive(document.getElementById('cxp-o-' + id));
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await sleep(60);
  };
  for (let i = 0; i < ids.length; i++) { if (slots && i >= 4) tick(ids[i]); else await pick(ids[i], i); }
  if (state === 'browse') tick(%s);
  const narrow = innerWidth < 900, at = slots ? $('#cx-slots') : $('#picker');
  if (state === 'empty' || state === 'from-chain') window.scrollTo(0, 0);
  else if (state === 'empty-slots') CP.scrollToEl(at);
  else if (state === 'table' || state === 'owner' || state === 'owner-change') CP.scrollToEl($('#cx-plans').parentNode.querySelector('.cx-h'));
  else if (state === 'owner-table') CP.scrollToEl($('#cx-table-wrap'));
  else if (state === 'owner-top') window.scrollTo(0, 0);
  else if (narrow || state === 'browse') CP.scrollToEl(at); else window.scrollTo(0, 0);
  if (state === 'owner-change') { await sleep(400); const c = $('#cx-plans [data-act="change"][data-slot="2"]'); if (c) { c.click(); await sleep(150); } }
  if (state === 'picker' || state === 'picker-typed') {
    await sleep(300);
    $('#cxa-row .cxa-slot[data-i="1"] [data-act="choose"]').click(); await sleep(120);
    if (state === 'picker-typed') { const inp = $('#cxp-in'); inp.value = 'asc'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
    else document.getElementById('cxp-in').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  }
  await sleep(2200);
  const live = [...document.querySelectorAll('section[data-view=landscape] [aria-live]')].map(e => e.textContent.trim());
  return { y: scrollY, h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, picked: CP.Landscape.picked.slice(), live,
           tag: ($('#stage-tag-text') || {}).textContent, active: document.activeElement && (document.activeElement.id || document.activeElement.textContent.trim().slice(0, 40)) };
})()
""" % (json.dumps(state), json.dumps(IDS.get(state, [])), json.dumps(A))
base = os.environ.get('BASE', 'http://127.0.0.1:8765/')
url = base + ('?theme=dark' if theme == 'dark' else '') + '#/landscape'
cmd = ['python3', shoot, url, out, '--wait', '7', '--port', '9970', '--eval', js]
if width in ('390', '320'): cmd += ['--mobile', '--width', width]
else: cmd += ['--width', width, '--height', {'1920': '1080', '2560': '1440'}.get(width, '900')]
if full: cmd.append('--full')
subprocess.run(cmd, check=True)
