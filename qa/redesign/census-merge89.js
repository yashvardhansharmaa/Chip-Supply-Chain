#!/usr/bin/env node
/* The text census for the merge of chapters 8 and 9 (27 Oct 2026): every view, every other chapter and every other static page,
   before and after, so the only differences are the numbers, the counts and the links to the merged chapter.
   Side A is the redesign before the merge, a dist folder read as files (git archive a572d29 dist | tar -x -C <dir>); side B is
   this build (a dist folder, or a server such as 127.0.0.1:8774). For each page it reads the visible text (innerText with
   content-visibility forced visible, Math.random seeded as census.js seeds it, at 1440) and every link's target (href and
   data-route), and lists the lines and the targets only one side has. The Chain's chapters are read one at a time at their
   addresses, doors included. The two merged chapters (transistors-and-front-end, foundries-and-fabs) are left out: the old one
   is gone and the merged one is new text. The forwarding pages (/home/, /intro/, /chain/) are read from their HTML.
   usage: node qa/redesign/census-merge89.js --a <dist before> [--b <dist after or url>] [--out qa/redesign/census-merge89.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const A = opt('a', ''), B = opt('b', path.resolve(__dirname, '..', '..', 'dist')).replace(/\/$/, '');
const OUT = opt('out', path.join(__dirname, 'census-merge89.txt'));
if (!A) { console.error('usage: census-merge89.js --a <dist before> [--b <dist or url>]'); process.exit(1); }
const at = (base, u) => /^https?:/.test(base) ? base + u : 'file://' + path.resolve(base) + u.replace(/^\/(#.*)?$/, '/index.html$1').replace(/^\/([^#?]+)\/(#.*)?$/, '/$1/index.html$2');
const SEED = `(function(){var s=20261025;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();`;
const MERGED = ['transistors-and-front-end', 'foundries-and-fabs'];
const norm = (t) => String(t).split('\n').map((l) => l.replace(/[\s ]+/g, ' ').trim()).filter(Boolean);
const bag = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return m; };
const minus = (a, b) => { const out = []; const mb = new Map(b); for (const [k, v] of a) { const n = v - (mb.get(k) || 0); for (let i = 0; i < n; i++) out.push(k); } return out; };
const READ = (sel) => `(async () => {
  const st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st);
  await new Promise((r) => setTimeout(r, 400));
  const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null;
  const links = [].map.call(el.querySelectorAll('a[href], [data-route]'), (a) => (a.getAttribute('data-route') || a.getAttribute('href') || '')).filter((h) => /^#|^\\.\\.\\/|^[a-z-]+\\/$|^[a-z-]+\\/#/.test(h));
  return { text: el.innerText, links };
})()`;
async function read(chrome, url, sel) {
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
    await s('Page.navigate', { url });
    for (let t = 0; !loaded && t < 300; t++) await sleep(100);
    await sleep(2500);
    const r = await s('Runtime.evaluate', { expression: READ(sel), returnByValue: true, awaitPromise: true });
    return (r.result && r.result.value) || { text: '', links: [] };
  } finally { chrome.off(on); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); }
}
const htmlText = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '\n').replace(/<\/(p|h\d|li|div|main|header|title)>/gi, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const metaOf = (h) => [...h.matchAll(/<(title|meta[^>]*(?:description|og:image:alt|og:title)[^>]*)>([^<]*)/gi)].map((m) => m[0].replace(/\s+/g, ' ')).join('\n');
const getFile = async (base, u) => /^https?:/.test(base) ? (await fetch(base + u)).text() : fs.readFileSync(at(base, u).replace(/^file:\/\//, ''), 'utf8');

(async () => {
  const chrome = launch(); const out = []; let nA = 0, nB = 0;
  const log = (name, a, b) => {
    const ta = norm(a.text), tb = norm(b.text), la = a.links || [], lb = b.links || [];
    const oa = minus(bag(ta), bag(tb)), ob = minus(bag(tb), bag(ta)), ka = minus(bag(la), bag(lb)), kb = minus(bag(lb), bag(la));
    nA += oa.length + ka.length; nB += ob.length + kb.length;
    out.push(`== ${name}: ${ta.length} lines; text only before ${oa.length}, only after ${ob.length}; links only before ${ka.length}, only after ${kb.length}`);
    oa.forEach((x) => out.push('   - ' + x)); ob.forEach((x) => out.push('   + ' + x));
    if (ka.length || kb.length) out.push('   links: ' + [...new Set(ka)].map((x) => `-${x} (${ka.filter((y) => y === x).length})`).join(' ') + ' ' + [...new Set(kb)].map((x) => `+${x} (${kb.filter((y) => y === x).length})`).join(' '));
    console.log(`${name}: text -${oa.length} +${ob.length}, links -${ka.length} +${kb.length}`);
  };
  try {
    const VIEWS = [['walk', '/#/'], ['chain contents', '/#/chain'], ['ai-chips', '/#/landscape'], ['suppliers', '/#/suppliers'], ['suppliers-by-country', '/#/suppliers?tab=country'],
      ['export-controls', '/#/controls'], ['china-revenue', '/#/exposure'], ['glossary', '/#/glossary']];
    for (const [n, u] of VIEWS) log('view ' + n, await read(chrome, at(A, u), 'body'), await read(chrome, at(B, u), 'body'));
    const ids = fs.readdirSync(path.join(A, 'pdf')).filter((f) => /\.pdf$/.test(f)).map((f) => f.replace(/\.pdf$/, '')).filter((id) => fs.existsSync(path.join(A, id, 'index.html')) && !MERGED.includes(id) && !['summary', 'how-ai-chips-are-made'].includes(id)); // the chapters' own PDFs name them
    for (const id of ids) log(`chapter #${id}`, await read(chrome, at(A, '/#' + id), '#' + id), await read(chrome, at(B, '/#' + id), '#' + id));
    for (const id of ids.concat(['summary', 'chips', 'suppliers', 'export-controls', 'glossary'])) log(`page /${id}/`, await read(chrome, at(A, `/${id}/`), 'body'), await read(chrome, at(B, `/${id}/`), 'body'));
    for (const f of ['home', 'intro', 'chain']) { const ha = await getFile(A, `/${f}/`), hb = await getFile(B, `/${f}/`); log(`forwarding page /${f}/ (its text and tags)`, { text: htmlText(ha) + '\n' + metaOf(ha) }, { text: htmlText(hb) + '\n' + metaOf(hb) }); }
    { const ha = await getFile(A, '/'), hb = await getFile(B, '/'); log('the main page\'s head (title, description, share tags)', { text: metaOf(ha.slice(0, ha.indexOf('</head>'))) }, { text: metaOf(hb.slice(0, hb.indexOf('</head>'))) }); }
  } finally { await chrome.close(); }
  fs.writeFileSync(OUT, [`Text census for the merge of chapters 8 and 9: ${A} (before) against ${B} (after). Lines and link targets only before: ${nA}; only after: ${nB}.`, ''].concat(out).join('\n') + '\n');
  console.log(`\nonly before ${nA}, only after ${nB}; wrote ${OUT}`);
  process.exit(0);
})();
