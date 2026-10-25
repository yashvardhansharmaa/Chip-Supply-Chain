#!/usr/bin/env node
/* Stage 3: the fixes from the stage 2 review (MAIN qa/redesign/review-stage-2.md) and the readable pages' rail, driven as a
   reader would. usage: node qa/redesign/interact-review2.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8766';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`); if (!ok) bad++; };
  try {
    // 1. a readable page reaches every chapter at every width
    for (const width of [390, 1024, 1440]) {
      const t = await open(chrome, BASE + '/lithography/', { width, wait: 2000 });
      const n = await t.ev(`(function(){var s={};[].forEach.call(document.querySelectorAll('a[href]'),function(a){var r=a.getBoundingClientRect(),h=a.getAttribute('href');if(r.width&&r.height&&getComputedStyle(a).visibility!=='hidden'&&/^\\.\\.\\/[a-z-]+\\/$/.test(h)){s[h]=1;}});return Object.keys(s).filter(function(h){return !/(suppliers|export-controls|chips|glossary|summary)/.test(h);}).length;})()`);
      check(`/lithography/ at ${width}: visible links reach the other 16 chapters`, n >= 16, n + ' chapters linked');
      await t.close();
    }
    // the readable page's rail marks the section in view
    {
      const t = await open(chrome, BASE + '/lithography/', { width: 1440, wait: 2000 });
      await t.ev(`(function(){var h=document.getElementById('lithography--who-makes-it');window.scrollTo(0,h.getBoundingClientRect().top+scrollY-120);return 1;})()`); await sleep(600);
      check('/lithography/: the rail marks the section in view', (await t.ev(`(document.querySelector('.rail-toc a[aria-current]')||{}).textContent`)) === 'Who makes it', await t.ev(`(document.querySelector('.rail-toc a[aria-current]')||{}).textContent`));
      // 6. the still's names at 14 px on screen
      await t.ev('window.scrollTo(0,0),1'); await sleep(300);
      const px = await t.ev(`(function(){var e=document.querySelector('svg.ch-still--wide text.nm');var m=e.closest('svg').getScreenCTM();return Math.round(parseFloat(getComputedStyle(e).fontSize)*m.a*10)/10;})()`);
      check('/lithography/: the balloons\' names are 14 px on screen', Math.abs(px - 14) < 0.6, px + ' px');
      // 7. kickers carry the section's name
      // (computed style gives the declaration, not the text, so this reads both halves: the kicker's rule and the heading's name)
      check('/lithography/: a section kicker reads "05 · The chokepoint"', /counter\(sec, decimal-leading-zero\) " · " attr\(data-k\)|" · The chokepoint"/.test(await t.ev(`getComputedStyle(document.getElementById('lithography--the-chokepoint'),'::before').content`)) && (await t.ev(`document.getElementById('lithography--the-chokepoint').getAttribute('data-k')`)) === 'The chokepoint',
        await t.ev(`getComputedStyle(document.getElementById('lithography--the-chokepoint'),'::before').content`));
      // 8. every readable page opens on a drawing
      await t.close();
    }
    for (const id of ['geopolitics', 'memory-and-hbm', 'silicon-and-wafers']) {
      const t = await open(chrome, BASE + '/' + id + '/', { width: 1440, wait: 2000 });
      check(`/${id}/ opens on its specimen's still`, await t.ev(`(function(){var i=document.querySelector('.ch-spec .ch-still-img');return !!i&&i.complete&&i.naturalWidth>100&&getComputedStyle(document.querySelector('.ch-spec-cap')).borderLeftWidth==='0px';})()`));
      await t.close();
    }
    // 2. the phone's expanded strip numbers the drawing
    {
      const t = await open(chrome, BASE + '/#lithography', { width: 390, wait: 3000 });
      await t.ev(`(function(){var h=document.getElementById('lithography--how-it-works');window.scrollTo(0,h.getBoundingClientRect().top+scrollY-100);return 1;})()`); await sleep(1200);
      await t.ev(`(document.querySelector('.stage-toggle').click(),1)`); await sleep(1500);
      const nums = await t.ev(`(function(){var s=document.querySelector('.stage .ch-balloons.is-strip');if(!s||s.style.display==='none')return '';return [].map.call(s.querySelectorAll('text.num'),function(x){return x.textContent;}).join(',');})()`);
      check('phone: the expanded strip numbers the parts', nums === '1,2,3,4', nums || 'none');
      check('...the numbers alone', await t.ev(`getComputedStyle(document.querySelector('.stage .ch-balloons.is-strip text.nm')).display === 'none'`));
      await t.ev(`(document.querySelector('.stage-toggle').click(),1)`); await sleep(800);
      check('...and collapsed, none', await t.ev(`!document.querySelector('.stage .ch-balloons.is-strip')`));
      // 3. the card's text keeps its padding inside the tint
      await t.ev(`(function(){var p=document.querySelector('#lithography .plate');window.scrollTo(0,p.getBoundingClientRect().top+scrollY-100);return 1;})()`); await sleep(800);
      const pad = await t.ev(`(function(){var p=document.querySelector('#lithography .plate'),k=p.querySelector('.plate-head'),a=p.getBoundingClientRect(),b=k.getBoundingClientRect();return Math.round(b.left-a.left)+','+Math.round(a.right-b.right)+','+Math.round(a.left)+','+Math.round(innerWidth-a.right);})()`);
      const [l, r, ol, or] = pad.split(',').map(Number);
      check('phone: the card\'s text sits inside its tint, which stays on screen', l >= 12 && r >= 12 && ol >= 0 && or >= 0, `text ${l}/${r} px from the tint, tint ${ol}/${or} px from the screen`);
      await t.close();
    }
    // 4 and 5. the figure strip: actions on the first line at 1440, and an opened citation below them at full width
    {
      const t = await open(chrome, BASE + '/#lithography', { width: 1440, wait: 3000 });
      await t.ev(`(function(){var f=document.getElementById('fig-lithography-asml-region');window.scrollTo(0,f.getBoundingClientRect().top+scrollY-80);return 1;})()`); await sleep(1000);
      const line = await t.ev(`(function(){var s=document.querySelector('#fig-lithography-asml-region .fig-strip'),a=s.querySelector('.fs-acts').getBoundingClientRect(),c=s.firstElementChild.getBoundingClientRect();return Math.round(a.top-c.top);})()`);
      check('figure 04.5: the actions sit on the strip\'s first line', Math.abs(line) <= 4, line + ' px apart');
      const before = await t.ev(`JSON.stringify(document.querySelector('#fig-lithography-asml-region .fs-acts').getBoundingClientRect())`);
      await t.ev(`(document.querySelector('#fig-lithography-asml-region .ch-cite-btn').click(),1)`); await sleep(500);
      const after = await t.ev(`JSON.stringify(document.querySelector('#fig-lithography-asml-region .fs-acts').getBoundingClientRect())`);
      const b0 = JSON.parse(before), a0 = JSON.parse(after);
      check('...opening Cite leaves them in place', Math.abs(b0.left - a0.left) < 2 && Math.abs(b0.top - a0.top) < 2, `left ${Math.round(b0.left)} -> ${Math.round(a0.left)}`);
      const w = await t.ev(`(function(){var s=document.querySelector('#fig-lithography-asml-region .fig-strip'),b=s.querySelector('.ch-cite-box');return Math.round(b.getBoundingClientRect().width)+'/'+Math.round(s.clientWidth-parseFloat(getComputedStyle(s).paddingLeft)-parseFloat(getComputedStyle(s).paddingRight));})()`);
      const [bw, sw] = w.split('/').map(Number);
      check('...and the citation runs the full width under them', Math.abs(bw - sw) < 2, w);
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(`\n${out.length} checks, ${bad} failed`);
  process.exit(bad ? 1 : 0);
})();
