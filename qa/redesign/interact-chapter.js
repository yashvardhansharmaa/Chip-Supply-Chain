#!/usr/bin/env node
/* The chapter page's controls (redesign stage 2), driven as a reader would, in The Chain and on the readable pages:
   - the live drawing moves into the slot of the chapter in view, Lithography's four balloons ride on it, and the caption
     stands on the drawing's foot (--slack);
   - the contents rail marks the section the reader is in, and its links land;
   - a figure's Cite opens its citation, Table swaps the bars for the rows and back, CSV is a download, PNG saves a picture;
   - chapters 16 and 17 draw on the night ground;
   - on a phone the drawing stays in the strip, the masthead goes up on the way down and back on the way up, and the slim
     bar names the chapter and the section;
   - the readable page has the same opener, rail, card and figure strip, with Lithography's still and no app buttons.
   usage: node qa/redesign/interact-chapter.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8766';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail != null && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
  const key = async (t, k, code, vk) => { await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
  const scrollTo = async (t, sel, off) => { await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+scrollY-${off || 120});return 1;})()`); await sleep(900); };
  try {
    /* ---------- The Chain, 1440 ---------- */
    {
      const t = await open(chrome, BASE + '/#lithography', { width: 1440, wait: 3000 });
      check('1440: the drawing sits in Lithography\'s slot', await t.ev("!!document.querySelector('#lithography .ch-spec-draw canvas#stage-canvas')"));
      check('1440: the stage beside the page stands down', await t.ev("getComputedStyle(document.querySelector('.stage')).display === 'none'"));
      check('1440: the specimen shown is the EUV scanner', await t.ev("CP.Stage.cur && CP.Stage.cur.name") === 'euv-scanner', await t.ev("CP.Stage.cur && CP.Stage.cur.name"));
      const bal = await t.ev(`(function(){var s=document.querySelector('#lithography .ch-balloons');if(!s)return null;var c=s.closest('.ch-spec-draw').getBoundingClientRect();return [].map.call(s.querySelectorAll('g'),function(g){var b=g.querySelector('.bal'),n=g.querySelector('.nm');var nb=n.getBoundingClientRect();return {n:g.querySelector('.num').textContent,name:n.textContent,x:+b.getAttribute('cx'),y:+b.getAttribute('cy'),inside:nb.left>=c.left-1&&nb.right<=c.right+1&&nb.top>=c.top-1&&nb.bottom<=c.bottom+40,fs:parseFloat(getComputedStyle(n).fontSize)};});})()`);
      check('1440: four balloons on the drawing', bal && bal.length === 4, bal && bal.map((b) => `${b.n} ${b.name} (${Math.round(b.x)},${Math.round(b.y)})`).join(', '));
      check('1440: every balloon name inside the drawing\'s box, at 11 px or more', bal && bal.every((b) => b.inside && b.fs >= 11));
      const slack = await t.ev("getComputedStyle(document.querySelector('#lithography .ch-spec')).getPropertyValue('--slack')");
      check('1440: the caption stands on the drawing\'s foot (--slack set)', /^\s*\d+px/.test(slack), slack);
      check('1440: the parts list names the four parts', await t.ev("[].map.call(document.querySelectorAll('#lithography .ch-spec .ch-parts li > span'),function(l){return l.textContent}).join(' | ')") === 'Light source: ASML San Diego (US), laser by Trumpf (DE) | Mirrors: Zeiss SMT (DE) | Mask: see stage 05, Photomasks and Pellicles | Wafer: see stage 02, Silicon and Wafers');
      await scrollTo(t, '#lithography--how-it-works', 200);
      check('1440: the rail marks How it works', await t.ev("(document.querySelector('#lithography .rail-toc a[aria-current]')||{}).textContent") === 'How it works', await t.ev("(document.querySelector('#lithography .rail-toc a[aria-current]')||{}).textContent"));
      check('1440: the rail stays in view (sticky)', await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail').getBoundingClientRect();return r.top>=0&&r.top<200;})()"));
      check('1440: the rail fits the window', await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail');return r.scrollHeight<=r.clientHeight+1;})()"), await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail');return r.scrollHeight+' in '+r.clientHeight;})()"));
      // a figure: Cite, Table, CSV, PNG
      const F = '#fig-lithography-asml-region';
      await scrollTo(t, F, 140);
      check('1440: the figure is numbered 04.5', await t.ev(`document.querySelector('${F} .fig-k').textContent`) === 'Figure 04.5');
      check('1440: rule B, the largest bar ink, the rest the tint', await t.ev(`(function(){var b=[].map.call(document.querySelectorAll('${F} .hb-r i'),function(i){return getComputedStyle(i).backgroundColor});return b[0]==='rgb(23, 23, 22)'&&b.slice(1).every(function(c){return c==='rgb(210, 209, 204)'});})()`),
        await t.ev(`[].map.call(document.querySelectorAll('${F} .hb-r i'),function(i){return getComputedStyle(i).backgroundColor}).join(' ')`));
      check('1440: no wine on any bar in any chapter', await t.ev("[].every.call(document.querySelectorAll('.chapter .hb-r i'),function(i){var c=getComputedStyle(i).backgroundColor;return c!=='rgb(122, 31, 43)'&&c!=='rgb(168, 65, 75)';})"));
      check('1440: the strip has Cite, Table, CSV and PNG', await t.ev(`[].map.call(document.querySelectorAll('${F} .fs-acts > *'),function(a){return a.textContent}).join(' ')`) === 'Cite Table CSV PNG', await t.ev(`[].map.call(document.querySelectorAll('${F} .fs-acts > *'),function(a){return a.textContent}).join(' ')`));
      await t.ev(`document.querySelector('${F} .fs-acts .ch-cite-btn').click(),1`); await sleep(200);
      check('1440: Cite opens the figure\'s citation', await t.ev(`(function(){var b=document.getElementById('cite-fig-lithography-asml-region');return !b.hidden && /Figure 04.5: ASML net system sales/.test(b.textContent) && /Updated \\d+ [A-Z][a-z]+ 2026/.test(b.textContent);})()`), await t.ev("document.getElementById('cite-fig-lithography-asml-region').textContent.slice(0,140)"));
      await t.ev(`document.querySelector('${F} .fs-tab').click(),1`); await sleep(200);
      check('1440: Table shows the rows in place of the bars', await t.ev(`(function(){var f=document.querySelector('${F}');var t=f.querySelector('table.fig-table');return getComputedStyle(f.querySelector('.hbars')).display==='none'&&t.getBoundingClientRect().height>100&&t.querySelectorAll('tr').length===7;})()`));
      await t.ev(`document.querySelector('${F} .fs-tab').click(),1`); await sleep(200);
      check('1440: and back to the bars', await t.ev(`getComputedStyle(document.querySelector('${F} .hbars')).display!=='none'&&document.querySelector('${F} table.fig-table').classList.contains('sr-only')`));
      check('1440: CSV is a download of the rows', await t.ev(`(function(){var a=document.querySelector('${F} .fs-csv');return !!a.getAttribute('download')&&decodeURIComponent(a.href).indexOf('China,33')>0;})()`));
      const png = await t.ev(`new Promise(function(res){var orig=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(cb,type){HTMLCanvasElement.prototype.toBlob=orig;res({w:this.width,h:this.height,type:type});};document.querySelector('${F} .fs-png').click();setTimeout(function(){res(null)},3000);})`);
      check('1440: PNG draws the figure at 1,600 px wide', png && png.w === 1600 && png.type === 'image/png', JSON.stringify(png));
      // chapters 16 and 17: the night ground
      await scrollTo(t, '#component-costs', 80); await sleep(800);
      check('1440: the drawing moves to chapter 16\'s slot', await t.ev("!!document.querySelector('#component-costs .ch-spec-draw canvas')"));
      check('1440: chapter 16 draws on the night ground', await t.ev("getComputedStyle(document.querySelector('#component-costs .ch-spec')).backgroundColor") === 'rgb(18, 18, 17)' && await t.ev('CP.Stage.dark') === true);
      await scrollTo(t, '#lithography', 80); await sleep(800);
      check('1440: back on Lithography, the light ground again', await t.ev('CP.Stage.dark') === false && await t.ev("!!document.querySelector('#lithography .ch-spec-draw canvas')"));
      // the rail's chain link goes to the chapter
      await t.ev("document.querySelector('#lithography .rail-chain a[href=\"photomasks-and-pellicles/\"]').click(),1"); await sleep(1500);
      check('1440: a stage in the rail opens its chapter', await t.ev("location.hash==='#photomasks-and-pellicles' && Math.abs(document.getElementById('photomasks-and-pellicles').getBoundingClientRect().top) < 140"), await t.ev("location.hash"));
      // leaving The Chain gives the drawing back to the stage
      await t.ev("location.hash='#/',1"); await sleep(1200);
      check('1440: on the home the drawing is back on the stage', await t.ev("!!document.querySelector('.stage > canvas#stage-canvas') && getComputedStyle(document.querySelector('.stage')).display!=='none'"));
      check('1440: the home shows no balloons', await t.ev("!document.querySelector('.stage .ch-balloons')"));
      t.errors.forEach((e) => check('1440: page error', false, e));
      await t.close();
    }
    /* ---------- The Chain on a phone ---------- */
    {
      const t = await open(chrome, BASE + '/#lithography', { width: 390, wait: 3000 });
      check('390: the drawing stays in the strip', await t.ev("!!document.querySelector('.stage > canvas#stage-canvas') && getComputedStyle(document.querySelector('.stage')).display!=='none'"));
      check('390: the masthead is down after the landing', await t.ev("!document.documentElement.classList.contains('mast-up')"));
      await t.ev("(document.documentElement.style.scrollBehavior='auto', window.scrollBy(0, 900), 1)"); await sleep(250);
      await t.ev("(window.scrollBy(0, 200), 1)"); await sleep(500);
      check('390: scrolling down raises the masthead', await t.ev("document.documentElement.classList.contains('mast-up') && document.querySelector('.masthead').getBoundingClientRect().bottom <= 1"));
      check('390: the slim bar names the chapter and the section', await t.ev("document.documentElement.classList.contains('slim-on') && /04\\s*Lithography/.test(document.querySelector('.ch-slim').textContent)"), await t.ev("(document.querySelector('.ch-slim')||{}).textContent"));
      await t.ev("(window.scrollBy(0, -60), 1)"); await sleep(500);
      check('390: scrolling up brings the masthead back, the slim bar under it', await t.ev("!document.documentElement.classList.contains('mast-up') && Math.abs(document.querySelector('.ch-slim').getBoundingClientRect().top - document.querySelector('.masthead').getBoundingClientRect().bottom) < 2"));
      await t.ev("document.querySelector('.stage-toggle').click(),1"); await sleep(600);
      check('390: the expanded strip lists the parts', await t.ev("(function(){var p=document.querySelector('.stage figcaption .stage-parts');return !!p&&getComputedStyle(p).display!=='none'&&/Light source/.test(p.textContent);})()"));
      await t.ev("document.querySelector('.stage-toggle').click(),1"); await sleep(300);
      t.errors.forEach((e) => check('390: page error', false, e));
      await t.close();
    }
    /* ---------- the readable page ---------- */
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/lithography/', { width, wait: 2500 });
      check(`page ${width}: no button from the app`, await t.ev("!document.querySelector('main button:not(.fs-tab):not(.fs-png):not(.ch-cite-copy)')"));
      check(`page ${width}: the opener's kicker`, /Chapter 04\s*Stage 4 of 15\s*Extreme/.test(await t.ev("document.querySelector('.ch-kick').textContent")), await t.ev("document.querySelector('.ch-kick').textContent"));
      check(`page ${width}: Lithography's still, with its balloons`, await t.ev("(function(){var s=[].filter.call(document.querySelectorAll('.ch-still'),function(x){return getComputedStyle(x).display!=='none'})[0];return !!s&&s.getBoundingClientRect().width>250&&s.querySelectorAll('.bal').length===4;})()"));
      const small = await t.ev("[].map.call(document.querySelectorAll('.ch-still'),function(s){if(getComputedStyle(s).display==='none')return 99;var k=s.getBoundingClientRect().width/s.viewBox.baseVal.width;return Math.min.apply(null,[].map.call(s.querySelectorAll('text'),function(x){return parseFloat(x.style.fontSize)*k}))}).reduce(function(a,b){return Math.min(a,b)},99)");
      check(`page ${width}: the still's numbers and names at 11 px or more`, small >= 11, small.toFixed(1) + ' px');
      check(`page ${width}: the figure strip has Cite, Table, CSV and PNG`, await t.ev("[].map.call(document.querySelectorAll('#fig-lithography-asml-region .fs-acts > *'),function(a){return a.textContent}).join(' ')") === 'Cite Table CSV PNG');
      await t.ev("document.querySelector('#fig-lithography-asml-region .ch-cite-btn').click(),1"); await sleep(200);
      check(`page ${width}: Cite opens the figure's citation, with the page's day`, await t.ev("(function(){var b=document.getElementById('cite-fig-lithography-asml-region');return getComputedStyle(b).display!=='none'&&/Updated \\d+ [A-Z][a-z]+ 2026/.test(b.textContent)&&!/CITE_DAY/.test(document.body.innerHTML);})()"));
      if (width === 1440) check('page 1440: the rail beside the text', await t.ev("(function(){var r=document.querySelector('.ch-rail').getBoundingClientRect();return r.left<200&&r.width>180;})()"));
      check(`page ${width}: a stage in the rail links to its page`, await t.ev("!!document.querySelector('.ch-rail a[href=\"../photomasks-and-pellicles/\"]')"));
      t.errors.forEach((e) => check(`page ${width}: page error`, false, e));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n')); console.log(bad ? `\n${bad} failed` : '\nall passed'); process.exit(bad ? 1 : 0);
})();
