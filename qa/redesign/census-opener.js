#!/usr/bin/env node
/* The text census for the column (the chapter opener of design round five, 27 Oct 2026): every chapter's visible text, before
   and after, in The Chain (each chapter at its own address) and on its readable page dist/<chapter>/. Both sides are previews:
   A before (127.0.0.1:8766, the redesign as it stands, or a dist folder read as files, `git archive <commit> dist | tar -x -C
   <dir>`), B after (127.0.0.1:8771, the worktree). For each page it reports:
     1. the lines only before and only after, the citation marks as printed (a renumbered mark changes its line);
     2. the same with the marks taken out, which leaves only the words the change added (the kicker's verdict, On this page's
        "Chokepoint card");
     3. the order: the text with the marks taken out and the card's own lines set aside, line by line, which must be the same
        on both sides (the card moved and nothing else did); and where the card stands, the line before it and after it.
   The door and the drawing's balloons are set aside, as census-chapters.js sets them aside. Math.random is seeded as
   qa/redesign/census.js seeds it, and both sides are laid out at 1440 with content-visibility off.
   usage: node qa/redesign/census-opener.js [--a http://127.0.0.1:8766] [--b http://127.0.0.1:8771] [--out qa/redesign/census-opener.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const A = opt('a', 'http://127.0.0.1:8766').replace(/\/$/, ''), B = opt('b', 'http://127.0.0.1:8771').replace(/\/$/, '');
// a side is a preview's address or a dist folder (as census-chapters.js reads one)
const at = (base, u) => /^https?:/.test(base) ? base + u : 'file://' + path.resolve(base) + u.replace(/^\/(#.*)?$/, '/index.html$1').replace(/^\/([^#]+)\/$/, '/$1/index.html');
const OUT = opt('out', path.join(__dirname, 'census-opener.txt'));
const SEED = `(function(){var s=20261025;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();`;
const norm = (t) => String(t).split('\n').map((l) => l.replace(/[\s ]+/g, ' ').trim()).filter(Boolean);
const bag = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
const minus = (a, b) => { const out = []; const mb = new Map(b); for (const [k, v] of a) { const n = v - (mb.get(k) || 0); for (let i = 0; i < n; i++) out.push(k); } return out; };
const diff = (la, lb) => { const ba = bag(la), bb = bag(lb); return { onlyA: minus(ba, bb), onlyB: minus(bb, ba) }; };

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
// the element's text with the door and the balloons set aside and the sources list open: as printed, then with the citation marks
// and the sources list out (a renumbered chapter lists its sources in the new order, so the list is compared as a set), the
// card's own text with the marks out, and the sources list
const READ = (sel) => `(function () {
  var el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null;
  var hold = function (list) { var h = list.map(function (d) { return [d, d.parentNode, d.nextSibling]; }); list.forEach(function (d) { d.remove(); }); return h; };
  var back = function (h) { h.reverse().forEach(function (x) { x[1].insertBefore(x[0], x[2]); }); };
  var shut = [].filter.call(el.querySelectorAll('details.chapter-sources'), function (d) { return !d.open; }); shut.forEach(function (d) { d.open = true; });
  var aside = hold([].slice.call(el.querySelectorAll('.prevnext, .ch-balloons')));
  var text = el.innerText;
  var marks = hold([].slice.call(el.querySelectorAll('sup.cite, sup.cite-sep')));
  var src = [].map.call(el.querySelectorAll('.chapter-sources ol, section.sources ol'), function (o) { return o.innerText; }).join('\\n');
  var lists = hold([].slice.call(el.querySelectorAll('.chapter-sources, section.sources')));
  var bare = el.innerText, card = el.querySelector('.plate'), cardText = card ? card.innerText : '';
  back(lists); back(marks); back(aside); shut.forEach(function (d) { d.open = false; });
  return { text: text, bare: bare, card: cardText, sources: src };
})()`;

(async () => {
  const chrome = launch();
  const out = [];
  let rawA = 0, rawB = 0, bareA = 0, bareB = 0, orderBad = 0;
  const report = (name, ra, rb) => {
    if (!ra || !rb) { out.push(`== ${name}: NOT FOUND (${!ra ? 'before' : ''} ${!rb ? 'after' : ''})`); orderBad++; return; }
    const la = norm(ra.text), lb = norm(rb.text), ba = norm(ra.bare), bb = norm(rb.bare), ca = norm(ra.card), cb = norm(rb.card);
    const raw = diff(la, lb), bare = diff(ba, bb);
    rawA += raw.onlyA.length; rawB += raw.onlyB.length; bareA += bare.onlyA.length; bareB += bare.onlyB.length;
    // the order with the card's lines set aside: drop the card's run from each side, then compare line by line
    const drop = (lines, card) => { if (!card.length) return { rest: lines, at: -1 }; for (let i = 0; i + card.length <= lines.length; i++) { if (card.every((c, k) => lines[i + k] === c)) return { rest: lines.slice(0, i).concat(lines.slice(i + card.length)), at: i }; } return { rest: lines, at: -2 }; };
    const da = drop(ba, ca), db = drop(bb, cb);
    // the verdict and On this page's new entry are the change's own words: they are checked by name, then set aside for the order
    const own = (l) => /^(Extreme|High|Moderate|Low) concentration$|^(Very hard|Hard|Moderately hard|Easy) to substitute$|^·$|^Chokepoint card$/.test(l);
    const ra2 = da.rest.filter((l) => !own(l) && !/^(Extreme|High|Moderate|Low)$/.test(l)), rb2 = db.rest.filter((l) => !own(l) && !/^(Extreme|High|Moderate|Low)$/.test(l));
    let firstOff = -1;
    for (let i = 0; i < Math.max(ra2.length, rb2.length); i++) if (ra2[i] !== rb2[i]) { firstOff = i; break; }
    const cardSame = ca.join('\n') === cb.join('\n');
    const sa = norm(ra.sources), sb = norm(rb.sources), sd = diff(sa, sb), srcSame = !sd.onlyA.length && !sd.onlyB.length, srcOrder = sa.join('\n') === sb.join('\n');
    if (!srcSame) orderBad++;
    if (firstOff >= 0 || !cardSame || da.at === -2 || db.at === -2) orderBad++;
    out.push(`== ${name}: ${la.length} lines before, ${lb.length} after; as printed only before ${raw.onlyA.length}, only after ${raw.onlyB.length}; marks out only before ${bare.onlyA.length}, only after ${bare.onlyB.length}; card ${ca.length} lines, ${cardSame ? 'the same words' : 'DIFFERENT WORDS'}; order with the card set aside ${firstOff < 0 ? 'the same' : 'DIFFERS at line ' + firstOff + ': "' + ra2[firstOff] + '" / "' + rb2[firstOff] + '"'}`);
    out.push(`   sources: ${sa.length} lines before, ${sb.length} after, ${srcSame ? 'the same set' : 'DIFFERENT'}${srcSame ? (srcOrder ? ', in the same order' : ', in the new reading order') : ''}`);
    sd.onlyA.forEach((x) => out.push('   source only before: ' + x)); sd.onlyB.forEach((x) => out.push('   source only after:  ' + x));
    if (ca.length) out.push(`   the card before: after "${(ba[da.at - 1] || '').slice(0, 70)}", before "${(ba[da.at + ca.length] || '').slice(0, 70)}"`);
    if (cb.length) out.push(`   the card after:  after "${(bb[db.at - 1] || '').slice(0, 70)}", before "${(bb[db.at + cb.length] || '').slice(0, 70)}"`);
    bare.onlyA.forEach((x) => out.push('   words only before: ' + x)); bare.onlyB.forEach((x) => out.push('   words only after:  ' + x));
    raw.onlyA.forEach((x) => out.push('   - ' + x)); raw.onlyB.forEach((x) => out.push('   + ' + x));
    console.log(`${name}: as printed -${raw.onlyA.length} +${raw.onlyB.length}; marks out -${bare.onlyA.length} +${bare.onlyB.length}; order ${firstOff < 0 && cardSame ? 'same' : 'DIFFERS'}`);
  };
  try {
    const a = await page(chrome, at(A, '/#/chain')), b = await page(chrome, at(B, '/#/chain'));
    const ids = await b.ev(`[].map.call(document.querySelectorAll('.view[data-view="stack"] > article.chapter'), function (x) { return x.id; })`);
    for (const id of ids) {
      for (const t of [a, b]) { await t.ev(`location.hash = '#${id}', 1`); }
      await sleep(1200);
      report('#' + id, await a.ev(READ('#' + id)), await b.ev(READ('#' + id)));
    }
    await a.close(); await b.close();
    for (const id of ids) {
      const pa = await page(chrome, at(A, `/${id}/`)), ta = await pa.ev(READ('main')); await pa.close();
      const pb = await page(chrome, at(B, `/${id}/`)), tb = await pb.ev(READ('main')); await pb.close();
      report(`/${id}/`, ta, tb);
    }
  } finally { await chrome.close(); }
  const head = [`Text census of the column: ${A} (before) against ${B} (after), each chapter in The Chain at its address and each readable page, the door and the balloons set aside.`,
    `As printed: lines only before ${rawA}, only after ${rawB} (a renumbered citation mark changes its line).`,
    `With the citation marks out: lines only before ${bareA}, only after ${bareB} (the kicker's verdict and On this page's "Chokepoint card" only).`,
    `Pages whose order differs once the card is set aside, or whose card's words differ: ${orderBad}.`, ''];
  fs.writeFileSync(OUT, head.concat(out).join('\n') + '\n');
  console.log(`\nas printed -${rawA} +${rawB}; marks out -${bareA} +${bareB}; order problems ${orderBad}; wrote ${OUT}`);
  process.exit(orderBad ? 1 : 0);
})();
