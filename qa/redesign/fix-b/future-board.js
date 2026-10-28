#!/usr/bin/env node
/* final QA B3: open Export Controls with the reader's clock moved to a later day (a Date override before the page's scripts),
   and print the board's as-of line, every row's pills and tags, and Coming up. The board must never show a stay as ended, or
   a rule as changed, on its date alone: past the data's check day it says "extension not confirmed".
   usage: node qa/redesign/fix-b/future-board.js <base> <YYYY-MM-DD> [shot.png] */
'use strict';
const path = require('path');
const { launch, sleep } = require(path.join(__dirname, '..', 'cdp.js'));
(async () => {
  const [base, iso, out] = process.argv.slice(2);
  const chrome = launch();
  let bad = 0;
  try {
    const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
    const s = (m, p) => chrome.send(m, p, sessionId);
    await s('Page.enable'); await s('Runtime.enable');
    await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    const shift = `(function(){var T=new Date('${iso}T10:00:00').getTime()-Date.now();var D=Date;function F(){if(!(this instanceof F))return new D(D.now()+T).toString();var a=[].slice.call(arguments);return a.length?new (Function.prototype.bind.apply(D,[null].concat(a)))():new D(D.now()+T);}F.prototype=D.prototype;F.now=function(){return D.now()+T;};F.UTC=D.UTC;F.parse=D.parse;Date=F;})();`;
    await s('Page.addScriptToEvaluateOnNewDocument', { source: shift });
    await s('Page.navigate', { url: base.replace(/\/$/, '') + '/#/controls' });
    await sleep(5000);
    const ev = async (e) => (await s('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;
    await ev("(document.querySelector('.cf-mode[data-mode=subject]').click(),1)"); await sleep(1200);
    console.log('clock', iso, '|', await ev("document.querySelector('.cf-asof').innerText.replace(/\\s+/g,' ')"));
    const rows = await ev("[...document.querySelectorAll('.cf-row')].map(r=>r.getAttribute('data-f')+': '+[...r.querySelectorAll('.cf-state .cf-pills > *')].map(x=>x.innerText).join(' | '))");
    rows.forEach((r) => console.log('  ' + r));
    const up = await ev("document.querySelector('.cf-up') ? document.querySelector('.cf-up').innerText.replace(/\\n+/g,' / ') : 'no coming up'");
    console.log('  coming up:', up);
    // the stays the data has not confirmed ended must still show, and none may read as ended
    const stays = rows.filter((r) => /^(entity|minerals|minerals-world):/.test(r));
    if (iso > '2026-11-09' && !/Affiliates rule due to end 9 Nov 2026, extension not confirmed/.test(stays.join('\n'))) { bad++; console.log('FAIL entity stay'); }
    if (iso > '2026-11-10' && !/October 2025 rules due to end 10 Nov 2026, extension not confirmed/.test(stays.join('\n'))) { bad++; console.log('FAIL minerals-world stay'); }
    if (iso > '2026-11-27' && !/Ban due to end 27 Nov 2026, extension not confirmed/.test(stays.join('\n'))) { bad++; console.log('FAIL minerals stay'); }
    if (iso > '2026-11-27' && /minerals: Prohibited/.test(stays.join('\n'))) { bad++; console.log('FAIL minerals pill changed on its date alone'); }
    if (out) { await ev("(window.scrollTo(0, document.querySelector('.cf-row[data-f=entity]').getBoundingClientRect().top + scrollY - 160),1)"); await sleep(800); const r = await s('Page.captureScreenshot', { format: 'png' }); require('fs').writeFileSync(out, Buffer.from(r.data, 'base64')); }
  } finally { await chrome.close(); }
  console.log(bad ? `future-board: ${bad} failure(s)` : 'future-board: ok');
  process.exit(bad ? 1 : 0);
})();
