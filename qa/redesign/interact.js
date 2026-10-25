#!/usr/bin/env node
/* The home page's new controls, driven as a reader would: a mark in the evidence figure picks the specimen, the arrow keys
   move along the marks, the search field hands its words to the site's search, and the two ways in go where they say.
   usage: node qa/redesign/interact.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8766';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`); if (!ok) bad++; };
  try {
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/#/', { width, wait: 2500 });
      const tag = () => t.ev("(document.getElementById('stage-tag-text')||{}).textContent||''");
      check(`${width}: the stage opens on Lithography`, /04 · Lithography/.test(await tag()), await tag());
      await t.ev("document.querySelectorAll('.wk-stop')[0].click(), 1"); await sleep(400);
      check(`${width}: mark 01 puts Chip Design on the stage`, /01 · Chip Design/.test(await tag()), await tag());
      check(`${width}: the legend names it`, /Shown: 01 Chip Design/.test(await t.ev("document.querySelector('.wk-shown').textContent")));
      check(`${width}: its caption follows`, /GPU die/.test(await t.ev("document.getElementById('stage-caption').textContent")));
      await t.ev("document.querySelectorAll('.wk-stop')[0].focus(), 1");
      await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
      await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 }); await sleep(400);
      check(`${width}: ArrowRight moves to 02 and focuses it`, /02 · Silicon/.test(await tag()) && await t.ev("document.activeElement === document.querySelectorAll('.wk-stop')[1]"), await tag());
      check(`${width}: one mark in the Tab order`, (await t.ev("[...document.querySelectorAll('.wk-stop')].filter(b => b.tabIndex === 0).length")) === 1);
      await t.ev("(document.getElementById('wk-q').focus(), 1)");
      await t.s('Input.insertText', { text: 'ASML' }); await sleep(500);
      check(`${width}: typing opens the search with the words`, await t.ev("!document.getElementById('cp-search').hidden && document.querySelector('#cp-search input').value === 'ASML' && document.querySelectorAll('#cp-search .cp-search-results a').length > 0"),
        await t.ev("(document.querySelector('#cp-search input')||{}).value + ' / ' + document.querySelectorAll('#cp-search .cp-search-results a').length + ' results'"));
      await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await sleep(300);
      check(`${width}: Escape closes it`, await t.ev("document.getElementById('cp-search').hidden"));
      await t.ev("(document.querySelector('.wk-way').click(), 1)"); await sleep(1500);
      check(`${width}: Introduction lands on the first step`, await t.ev("location.hash === '#/walk/design-and-eda' && Math.abs(document.getElementById('/walk/design-and-eda').getBoundingClientRect().top) < 300"),
        await t.ev("location.hash + ' top ' + Math.round(document.getElementById('/walk/design-and-eda').getBoundingClientRect().top)"));
      await t.ev("(window.scrollTo(0,0), location.hash = '#/', 1)"); await sleep(800);
      await t.ev("(document.querySelectorAll('.wk-way')[1].click(), 1)"); await sleep(1500);
      check(`${width}: Each stage, in detail opens The Chain`, await t.ev("location.hash === '#/chain' && !document.querySelector('.view[data-view=\"stack\"]').hidden"), await t.ev('location.hash'));
      t.errors.forEach((e) => check(`${width}: page error`, false, e));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n')); console.log(bad ? `\n${bad} failed` : '\nall passed'); process.exit(bad ? 1 : 0);
})();
