#!/usr/bin/env node
/* The text census for one chapter per address: every chapter's visible text, before and after, apart from the door.
   Side A is a build from before the change (a dist folder, read as files: `git archive <commit> dist | tar -x -C <dir>`),
   where The Chain is one page and every chapter shows; side B is the preview (127.0.0.1:8766), where each chapter shows
   alone at its address. For each chapter it reads the article's innerText with its Previous and Next (A) or its door (B)
   taken out, and the numbered balloons the live specimen draws over its slot while it stands there (aria-hidden, the parts
   list in the caption says the same; side A's Lithography is off screen at #/chain, so it has none), and lists any line that differs; it does the same for The Chain's head and contents (#/chain) and for each
   readable page dist/<chapter>/. Then it prints the old Previous and Next lines and the new doors, which are the change.
   Math.random is seeded as qa/redesign/census.js seeds it, and both sides are laid out at 1440 with content-visibility off.
   usage: node qa/redesign/census-chapters.js --a <old dist folder> [--b http://127.0.0.1:8766] [--out qa/redesign/census-chapters.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const A = opt('a', ''), B = opt('b', 'http://127.0.0.1:8766').replace(/\/$/, '');
const OUT = opt('out', path.join(__dirname, 'census-chapters.txt'));
if (!A) { console.error('usage: census-chapters.js --a <old dist folder> [--b <url>]'); process.exit(1); }
const at = (base, u) => /^https?:/.test(base) ? base + u : 'file://' + path.resolve(base) + u.replace(/^\/(#.*)?$/, '/index.html$1').replace(/^\/([^#]+)\/$/, '/$1/index.html');

const SEED = `(function(){var s=20261025;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();`;
const norm = (t) => String(t).split('\n').map((l) => l.replace(/[\s ]+/g, ' ').trim()).filter(Boolean);
const bag = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
const minus = (a, b) => { const out = []; const mb = new Map(b); for (const [k, v] of a) { const n = v - (mb.get(k) || 0); for (let i = 0; i < n; i++) out.push(k); } return out; };
const diff = (ta, tb) => { const ba = bag(norm(ta)), bb = bag(norm(tb)); return { onlyA: minus(ba, bb), onlyB: minus(bb, ba), lines: norm(ta).length }; };

async function page(chrome, url) {
  const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => chrome.send(m, p, sessionId);
  let loaded = false;
  const on = (m) => { if (m.sessionId === sessionId && m.method === 'Page.loadEventFired') loaded = true; };
  chrome.on(on);
  await s('Page.enable'); await s('Runtime.enable');
  await s('Page.addScriptToEvaluateOnNewDocument', { source: SEED });
  await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await s('Page.navigate', { url });
  for (let t = 0; !loaded && t < 300; t++) await sleep(100);
  await sleep(2500);
  const ev = async (expr) => { const r = await s('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return r.result.value; };
  await ev(`(function(){ var st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st); return 1; })()`);
  const close = async () => { chrome.off(on); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); };
  return { ev, close };
}
// an element's visible text with the door (or the old Previous and Next) set aside, and that door's own text
const READ = (sel) => `(function () {
  var el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null;
  var doors = [].slice.call(el.querySelectorAll('.prevnext')), aside = doors.concat([].slice.call(el.querySelectorAll('.ch-balloons')));
  var held = aside.map(function (d) { return [d, d.parentNode, d.nextSibling]; });
  var doorText = doors.map(function (d) { return d.innerText; }).join('\\n');
  aside.forEach(function (d) { d.remove(); });
  var text = el.innerText;
  held.forEach(function (h) { h[1].insertBefore(h[0], h[2]); });
  return { text: text, door: doorText };
})()`;

(async () => {
  const chrome = launch();
  const out = [], doors = [];
  let lost = 0, added = 0;
  const log = (name, d) => {
    out.push(`== ${name}: ${d.lines} lines; only before ${d.onlyA.length}; only after ${d.onlyB.length}`);
    d.onlyA.forEach((x) => out.push('   - ' + x)); d.onlyB.forEach((x) => out.push('   + ' + x));
    lost += d.onlyA.length; added += d.onlyB.length;
    console.log(`${name}: ${d.lines} lines, ${d.onlyA.length} only before, ${d.onlyB.length} only after`);
  };
  try {
    // The Chain: side A once (every chapter shows), side B one chapter at a time at its address
    const a = await page(chrome, at(A, '/#/chain'));
    const ids = await a.ev(`[].map.call(document.querySelectorAll('.view[data-view="stack"] > article.chapter'), function (x) { return x.id; })`);
    const before = {};
    for (const id of ids) before[id] = await a.ev(READ('#' + id));
    const headA = await a.ev(`document.getElementById('howto').innerText + '\\n' + document.getElementById('contents').innerText`);
    await a.close();
    const b = await page(chrome, B + '/#/chain');
    const headB = await b.ev(`document.getElementById('howto').innerText + '\\n' + document.getElementById('contents').innerText`);
    log('#/chain, the head and the contents', diff(headA, headB));
    for (const id of ids) {
      await b.ev(`location.hash = '#${id}', 1`); await sleep(600);
      const shown = await b.ev(`(function(){ var e = document.getElementById('${id}'); return !!(e && e.getClientRects().length); })()`);
      const r = await b.ev(READ('#' + id));
      log(`#${id}${shown ? '' : ' (NOT SHOWN)'}`, diff(before[id].text, r.text));
      doors.push(`#${id}\n   before: ${norm(before[id].door).join(' | ')}\n   after:  ${norm(r.door).join(' | ')}`);
    }
    await b.close();
    // the readable pages
    for (const id of ids) {
      const pa = await page(chrome, at(A, `/${id}/`)), ta = await pa.ev(READ('body')); await pa.close();
      const pb = await page(chrome, `${B}/${id}/`), tb = await pb.ev(READ('body')); await pb.close();
      log(`/${id}/`, diff(ta.text, tb.text));
      doors.push(`/${id}/\n   before: ${norm(ta.door).join(' | ')}\n   after:  ${norm(tb.door).join(' | ')}`);
    }
  } finally { await chrome.close(); }
  const head = [`Text census, one chapter per address: ${A} (before) against ${B} (after), each chapter and readable page with its door set aside.`,
    `Lines only before: ${lost}. Lines only after: ${added}.`, ''];
  fs.writeFileSync(OUT, head.concat(out, ['', '== the doors, before and after'], doors).join('\n') + '\n');
  console.log(`\nlines only before ${lost}, only after ${added}; wrote ${OUT}`);
  process.exit(lost || added ? 1 : 0);
})();
