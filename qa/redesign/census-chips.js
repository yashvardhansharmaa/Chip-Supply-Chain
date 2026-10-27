#!/usr/bin/env node
/* The census for AI Chips: no visible text may be lost. It reads the visible text of the view and of /chips/ on the redesign as
   it stands (127.0.0.1:8766, option C "The timeline") and on this checkout (127.0.0.1:8772, design round five's tick list), in
   the states a reader meets: nothing chosen; the pair B200 and Ascend 910C; four chips (B200, Ascend 910C, Instinct MI355X,
   WSE-3 Turbo) with every fold open (each chip's notes, and on the old page the list of all chips); and /chips/. On each side the
   same call chooses the chips (CP.Landscape.setPair), so the comparison holds the same chips. Both sides carry a source mark on
   every figure, so the marks stay in. For each state it lists the lines only on one side, the lines that differ only in letter
   case, and the words each side lacks. Every line the new page adds is also run through the writing rules of
   qa/scripts/check-speak.js.
   usage: node qa/redesign/census-chips.js [--a http://127.0.0.1:8766] [--b http://127.0.0.1:8772] [--out qa/redesign/census-chips.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const A = opt('a', 'http://127.0.0.1:8766'), B = opt('b', 'http://127.0.0.1:8772');
const OUT = opt('out', path.join(__dirname, 'census-chips.txt'));
const PAIR = ['nvidia-b200', 'huawei-ascend-910c'], FOUR = PAIR.concat(['amd-mi355x', 'cerebras-wse3-turbo']);
const STATES = [
  { name: 'AI Chips, nothing picked', url: '/#/landscape', js: '' },
  { name: 'AI Chips, B200 and Ascend 910C', url: '/#/landscape', js: `CP.Landscape.setPair(${JSON.stringify(PAIR)});` },
  { name: 'AI Chips, four chips, every fold open', url: '/#/landscape', js: `CP.Landscape.setPair(${JSON.stringify(FOUR)}); document.querySelectorAll('section[data-view="landscape"] details').forEach(function (d) { d.open = true; });` },
  { name: '/chips/', url: '/chips/', js: '', page: true }
];
const SEED = `(function(){var s=20261025;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();`;
const READ = (js, nocites, page) => `(async () => {
  ${js}
  await new Promise((r) => setTimeout(r, 700));
  const root = ${page ? 'document.body' : `document.querySelector('section[data-view="landscape"]')`};
  const box = root.cloneNode(true);
  ${nocites ? "box.querySelectorAll('#cx-strips sup.cite, #cx-table sup.cite').forEach((e) => e.remove());" : ''}
  box.style.cssText = 'position:absolute;left:0;top:0;width:1440px;'; document.body.appendChild(box);
  ${page ? '' : "const strip = root.querySelector('#cx-spec-text') ? null : document.querySelector('#stage-caption'); const extra = strip ? '\\n' + (document.querySelector('#stage-tag-text') || {}).innerText + '\\n' + strip.innerText : '';"}
  const t = box.innerText; box.remove();
  return t${page ? '' : ' + extra'};
})()`;

const norm = (t) => String(t).split('\n').map((l) => l.replace(/[\s ]+/g, ' ').trim()).filter(Boolean);
const words = (lines) => lines.join(' ').toLowerCase().replace(/[“”"‘’'(),.;:!?·•→↗↓⌘\[\]×+−]/g, ' ').split(/\s+/).filter(Boolean);
const bag = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
const minus = (a, b) => { const out = []; const mb = new Map(b); for (const [k, v] of a) { const n = v - (mb.get(k) || 0); for (let i = 0; i < n; i++) out.push(k); } return out; };
// the writing rules (qa/scripts/check-speak.js PATTERNS, and its question rule)
const RULES = [[/, not (?:[a-z0-9$]|"|'|“)/i, 'X, not Y'], [/\bnot [^,.;:\n]{1,40}\bbut\b/, 'not X but Y'], [/\brather than\b/, 'rather than'], [/—/, 'em dash'], [/;/, 'semicolon'],
  [/\bthis site\b|\bthe site's\b|\bour |\bwe |\byou\b/i, 'self-reference'], [/[^.!?\n]{3,}\?(?=\s|$)/, 'question']];

async function read(chrome, base, st) {
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => chrome.send(m, p, sessionId);
  let loaded = false; const on = (m) => { if (m.sessionId === sessionId && m.method === 'Page.loadEventFired') loaded = true; }; chrome.on(on);
  try {
    await s('Page.enable'); await s('Runtime.enable');
    await s('Page.addScriptToEvaluateOnNewDocument', { source: SEED });
    await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await s('Page.navigate', { url: base + st.url });
    for (let t = 0; !loaded && t < 300; t++) await sleep(100);
    await sleep(2500);
    const r = await s('Runtime.evaluate', { expression: READ(st.js, false, st.page), returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text);
    return r.result.value || '';
  } finally { chrome.off(on); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); }
}

(async () => {
  const chrome = launch(), out = [];
  try {
    for (const st of STATES) {
      const la = norm(await read(chrome, A, st)), lb = norm(await read(chrome, B, st));
      const ba = bag(la), bb = bag(lb);
      let onlyA = minus(ba, bb), onlyB = minus(bb, ba);
      const lowB = bag(onlyB.map((x) => x.toLowerCase())), caseOnly = [];
      onlyA = onlyA.filter((x) => { const k = x.toLowerCase(); if (lowB.get(k)) { lowB.set(k, lowB.get(k) - 1); caseOnly.push(x); return false; } return true; });
      const lowA = bag(caseOnly.map((x) => x.toLowerCase()));
      onlyB = onlyB.filter((x) => { const k = x.toLowerCase(); if (lowA.get(k)) { lowA.set(k, lowA.get(k) - 1); return false; } return true; });
      const lost = minus(bag(words(la)), bag(words(lb))), added = minus(bag(words(lb)), bag(words(la)));
      const speak = onlyB.map((l) => [l, RULES.filter(([re]) => re.test(l)).map(([, n]) => n)]).filter(([, h]) => h.length);
      console.log(`${st.name}: ${la.length} -> ${lb.length} lines; case only ${caseOnly.length}; only in main ${onlyA.length}; only in the redesign ${onlyB.length}; words lost ${lost.length}; writing-rule hits ${speak.length}`);
      out.push(`== ${st.name}  (${la.length} lines in main, ${lb.length} in the redesign)`);
      out.push(`   case only: ${caseOnly.length}${caseOnly.length ? ': ' + caseOnly.map((x) => JSON.stringify(x)).join(', ') : ''}`);
      onlyA.forEach((x) => out.push('   - ' + x));
      onlyB.forEach((x) => out.push('   + ' + x));
      out.push('   words lost: ' + (lost.length ? lost.join(' ') : 'none'));
      out.push('   words added: ' + (added.length ? added.join(' ') : 'none'));
      out.push('   writing rules on the added lines: ' + (speak.length ? speak.map(([l, h]) => h.join('/') + ' in ' + JSON.stringify(l)).join('; ') : 'no hits'));
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(OUT, out.join('\n') + '\n');
  console.log('wrote', OUT);
  process.exit(0);
})();
