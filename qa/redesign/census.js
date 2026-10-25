#!/usr/bin/env node
/* QA gate 4, the text census: no visible text may be lost in the redesign.
   For every view of the main page and every static page, it reads the visible text of MAIN's build (127.0.0.1:8765, the
   live design) and of the redesign (127.0.0.1:8766), and lists what differs:
     - lines only in MAIN (lost or reworded), lines only in the redesign (added or reworded);
     - lines that differ only in letter case (the labels are sentence case now, where CSS once set them in capitals);
     - the words each side has that the other lacks, so a reworded line shows exactly which words went.
   Visible text is innerText with every chapter laid out (content-visibility forced visible), so text hidden by a closed
   tab or a folded <details> is out on both sides alike. Math.random is seeded, so the Glossary's "Try" row and the search
   suggestions draw the same names on both sides. The three forwarding pages (/home/, /intro/, /chain/) send a reader on
   with a script, so their text is read from the HTML itself.
   Either side may be a built dist/ folder instead of a server (--a or --b with a path): stage 2 compares the live design built
   from the same chapter text (git archive 907850e, built in a scratch folder), because MAIN's own build now carries a writing
   pass that is not in the redesign branch, and that would show as lost text that no design change caused.
   usage: node qa/redesign/census.js [--a <url|dist path>] [--b <url|dist path>] [--out qa/redesign/census.txt] [--only walk,lithography] [--nocites] */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const OUT = opt('out', path.join(__dirname, 'census.txt'));
const ONLY = (opt('only', '') || '').split(',').filter(Boolean);
const A = opt('a', 'http://127.0.0.1:8765'), B = opt('b', 'http://127.0.0.1:8766');
// a dist folder is read as files: a view is index.html with its hash, a page its own index.html
const at = (base, url) => /^https?:/.test(base) ? base + url : 'file://' + base.replace(/\/$/, '') + url.replace(/^\/(#.*)?$/, '/index.html$1').replace(/^\/([^#]+)\/$/, '/$1/index.html');
const DIST = path.resolve(__dirname, '..', '..', 'dist');

const VIEWS = [['walk', '/#/'], ['chain', '/#/chain'], ['ai-chips', '/#/landscape'], ['suppliers', '/#/suppliers'], ['suppliers-by-country', '/#/suppliers?tab=country'],
  ['export-controls', '/#/controls'], ['china-revenue', '/#/exposure'], ['glossary', '/#/glossary']];
const FORWARD = ['home', 'intro', 'chain'];
const statics = fs.readdirSync(DIST).filter((d) => fs.existsSync(path.join(DIST, d, 'index.html')) && !FORWARD.includes(d)).sort();
const PAGES = VIEWS.map(([n, u]) => ({ name: n, url: u })).concat(statics.map((d) => ({ name: '/' + d + '/', url: '/' + d + '/' })));

const SEED = `(function(){var s=20261025;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();`;
// --nocites (stage 3): the citation marks are read out of both sides, since stage 3 renumbers them in reading order and every
// paragraph with a mark would otherwise differ; qa/redesign/check-cites.js checks the marks themselves
const NOCITES = args.includes('--nocites');
const READ = `(async () => {
  const st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st);
  ${NOCITES ? "document.querySelectorAll('sup.cite, sup.cite-sep').forEach((e) => e.remove());" : ''}
  await new Promise((r) => setTimeout(r, 400));
  return document.body.innerText;
})()`;

const norm = (t) => String(t).split('\n').map((l) => l.replace(/[\s ]+/g, ' ').trim()).filter(Boolean);
const words = (lines) => lines.join(' ').toLowerCase().replace(/[“”"‘’'(),.;:!?·•→↗↓⌘\[\]]/g, ' ').split(/\s+/).filter(Boolean);
const bag = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
const minus = (a, b) => { const out = []; const mb = new Map(b); for (const [k, v] of a) { const n = v - (mb.get(k) || 0); for (let i = 0; i < n; i++) out.push(k); } return out; };

function get(url) {
  if (!/^https?:/.test(url)) return Promise.resolve(fs.readFileSync(url.replace(/^file:\/\//, ''), 'utf8'));
  return new Promise((res, rej) => http.get(url, (r) => { let d = ''; r.setEncoding('utf8'); r.on('data', (c) => (d += c)); r.on('end', () => res(d)); }).on('error', rej));
}
const htmlText = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '\n').replace(/<\/(p|h\d|li|div|main|header|title)>/gi, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

async function readPage(chrome, base, url) {
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => chrome.send(m, p, sessionId);
  let loaded = false;
  const on = (m) => { if (m.sessionId === sessionId && m.method === 'Page.loadEventFired') loaded = true; };
  chrome.on(on);
  try {
    await s('Page.enable'); await s('Runtime.enable');
    await s('Page.addScriptToEvaluateOnNewDocument', { source: SEED });
    await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await s('Page.navigate', { url: at(base, url) });
    for (let t = 0; !loaded && t < 300; t++) await sleep(100);
    await sleep(2500);
    const r = await s('Runtime.evaluate', { expression: READ, returnByValue: true, awaitPromise: true });
    return r.result.value || '';
  } finally { chrome.off(on); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); }
}

function compare(name, ta, tb) {
  const la = norm(ta), lb = norm(tb);
  const ba = bag(la), bb = bag(lb);
  let onlyA = minus(ba, bb), onlyB = minus(bb, ba);
  // a line that differs only in letter case is a case change, not a loss
  const lowB = bag(onlyB.map((x) => x.toLowerCase())), caseOnly = [];
  onlyA = onlyA.filter((x) => { const k = x.toLowerCase(); if (lowB.get(k)) { lowB.set(k, lowB.get(k) - 1); caseOnly.push(x); return false; } return true; });
  const lowA = bag(caseOnly.map((x) => x.toLowerCase()));
  onlyB = onlyB.filter((x) => { const k = x.toLowerCase(); if (lowA.get(k)) { lowA.set(k, lowA.get(k) - 1); return false; } return true; });
  const wa = bag(words(la)), wb = bag(words(lb));
  return { name, linesA: la.length, linesB: lb.length, caseOnly, onlyA, onlyB, wordsLost: minus(wa, wb), wordsAdded: minus(wb, wa) };
}

(async () => {
  const chrome = launch();
  const results = [];
  try {
    for (const p of PAGES.filter((x) => !ONLY.length || ONLY.includes(x.name))) {
      const ta = await readPage(chrome, A, p.url), tb = await readPage(chrome, B, p.url);
      const r = compare(p.name, ta, tb); results.push(r);
      console.log(`${p.name}: ${r.linesA} -> ${r.linesB} lines; case only ${r.caseOnly.length}; only in main ${r.onlyA.length}; only in redesign ${r.onlyB.length}; words lost ${r.wordsLost.length}, added ${r.wordsAdded.length}`);
    }
    for (const f of FORWARD.filter((x) => !ONLY.length || ONLY.includes('/' + x + '/'))) {
      const r = compare('/' + f + '/', htmlText(await get(at(A, `/${f}/`))), htmlText(await get(at(B, `/${f}/`)))); results.push(r);
      console.log(`/${f}/: only in main ${r.onlyA.length}; only in redesign ${r.onlyB.length}; words lost ${r.wordsLost.length}`);
    }
  } finally { await chrome.close(); }
  const out = [];
  for (const r of results) {
    out.push(`== ${r.name}  (${r.linesA} lines in main, ${r.linesB} in the redesign)`);
    out.push(`   case only: ${r.caseOnly.length}${r.caseOnly.length ? ' e.g. ' + r.caseOnly.slice(0, 6).map((x) => JSON.stringify(x)).join(', ') : ''}`);
    r.onlyA.forEach((x) => out.push('   - ' + x));
    r.onlyB.forEach((x) => out.push('   + ' + x));
    if (r.wordsLost.length) out.push('   words lost: ' + r.wordsLost.join(' '));
    if (r.wordsAdded.length) out.push('   words added: ' + r.wordsAdded.join(' '));
  }
  fs.writeFileSync(OUT, out.join('\n') + '\n');
  console.log('wrote', OUT);
  process.exit(0);
})();
