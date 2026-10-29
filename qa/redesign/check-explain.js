#!/usr/bin/env node
/* The two live explainers of 29 Oct 2026 (qa/excellence/BUILD-BRIEF-2.md, "explain"), on the local preview, ported from the
   mockups' check.js and grown to the brief's list:
   - 04.2, several passes: where it sits, the chapter's figure numbers and the rail's list, the link from Deep ultraviolet and
     from chapters 08 and 16; the latest version (no mask drawn in the EUV lane, which carries "Light reflected off a mirror
     mask"; the cut on a teal line, so the four wine lines stay four; no step-total line), read from the drawing's pixels; the
     tiles; steps that play from where they start; reduced motion opening paused on the last step; dark mode's colors.
   - 07.1, driven by its model: the readouts under "The model's output" at the chapter's inputs (49.2, 11.3 and 20.1), the
     sliders driven by input events, a step returning the sliders to the chapter's inputs, no video left.
   - Both: labels at 11.5 px or more (the Paused mark is the site's own, var(--fs-cap-s), the same on every explainer, and is left out), no sideways scroll at 390, no Cite, Table, CSV or PNG (an explainer has none, as 04.1
     has none), and print: the live parts hidden, the still loaded and shown, the steps listed, the number kept. No page errors.
   usage: node qa/redesign/check-explain.js [base]   (base http://127.0.0.1:8789). Exits 1 on any failure. */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8789').replace(/\/$/, '');
const SAQP = '#fig-lithography-several-passes', YD = '#fig-metrology-and-inspection-defect-yield';
let n = 0, bad = 0;
const check = (name, pass, info) => { n++; if (!pass) bad++; console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${info !== undefined && (!pass || process.env.VERBOSE) ? '  ' + (typeof info === 'string' ? info : JSON.stringify(info)) : ''}`); };

// the smallest text in a figure (the transcript is for screen readers and paper), and sideways scroll
const SIZES = (sel) => `(function(){var f=document.querySelector('${sel}'),min=99,at='';
  f.querySelectorAll('*').forEach(function(e){if(e.closest('.anim-transcript')||e.closest('.anim-state'))return;var own=[].some.call(e.childNodes,function(x){return x.nodeType===3&&x.nodeValue.trim();});if(!own)return;var cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||!e.getClientRects().length)return;var s=parseFloat(cs.fontSize);if(s<min){min=s;at=(e.className||e.tagName)+': '+e.textContent.trim().slice(0,30);}});
  return {min:min,at:at,wide:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`;
// the colour at a point of a lane's canvas, in units of the drawing (x from -10 to 10, y down from the lane's top)
const PIX = (lane, x, y) => `(function(){var c=document.querySelector('${SAQP} .sq-draw[data-lane="${lane}"] canvas'),g=c.getContext('2d'),w=c.width,K=w/20;var d=g.getImageData(Math.round((${x}+10)*K),Math.round(${y}*K),1,1).data;return [d[0],d[1],d[2],d[3]];})()`;
const near = (a, hex, tol = 10) => { const n = parseInt(hex.slice(1), 16), b = [n >> 16, (n >> 8) & 255, n & 255]; return a[3] > 200 && b.every((v, i) => Math.abs(v - a[i]) <= tol); };

(async () => {
  const chrome = launch();
  try {
    /* ---------- 04.2 ---------- */
    for (const width of [1440, 390]) {
      const W = `04.2 ${width}`;
      const t = await open(chrome, `${BASE}/lithography/`, { width, wait: 2500 });   // reduced motion (cdp.js's default)
      const P = await t.ev(`(function(){var f=document.querySelector('${SAQP}');if(!f)return null;var prev=f.previousElementSibling,next=f.nextElementSibling;
        return {prev:prev&&prev.textContent.slice(0,60),next:next&&next.tagName+' '+next.textContent.slice(0,30),k:f.querySelector('.fig-k').textContent,title:f.querySelector('.fig-title').textContent,
          nums:[].map.call(document.querySelectorAll('#lithography .prose .fig-k'),function(e){return (/[0-9][0-9][.][0-9]+/.exec(e.textContent)||[''])[0]+'='+e.closest('.figure').id.replace('fig-lithography-','')}).join(' '),
          rail:[].map.call(document.querySelectorAll('#lithography .rail-figs a'),function(a){return a.querySelector('.n').textContent+'='+a.getAttribute('href').replace('#fig-lithography-','')}).join(' '),
          railT:(document.querySelector('#lithography .rail-figs a[href="${SAQP}"] .t')||{}).textContent,
          link:(function(){var a=document.querySelector('#lithography .prose p a[href="${SAQP}"]');return a?a.textContent+' | '+a.parentNode.textContent.slice(a.parentNode.textContent.indexOf(a.textContent),a.parentNode.textContent.indexOf(a.textContent)+a.textContent.length+14):null;})(),
          acts:!!f.querySelector('.fs-acts, .fs-csv, .fs-tab, .fs-png, .ch-cite-btn'),paused:f.classList.contains('is-paused'),cur:(f.querySelector('.anim-steps [aria-current]')||{}).textContent,
          cap:f.querySelector('.anim-cap').textContent.slice(0,30),tiles:[f.querySelectorAll('.sq-tiles')[0].querySelectorAll('.sq-tile:not(.off)').length,f.querySelectorAll('.sq-tiles')[1].querySelectorAll('.sq-tile:not(.off)').length],
          text:f.querySelector('.lv-screen').textContent,reflect:(f.querySelector('[data-l="reflect"]')||{}).textContent,euvLabs:[].map.call(f.querySelectorAll('.sq-draw-euv .lv-lab'),function(e){return e.textContent}).join('|')};})()`);
      check(`${W}: the figure is on the page`, !!P);
      if (!P) { await t.close(); continue; }
      check(`${W}: it follows the multipatterning paragraph and comes before Variants and trade-offs`, /^When one exposure cannot draw a pattern finely enough/.test(P.prev) && /^H3 Variants and trade-offs/.test(P.next), `${P.prev} ... ${P.next}`);
      check(`${W}: numbered "Figure 04.2 · Explainer, 26 seconds", titled as the mockup`, P.k === 'Figure 04.2 · Explainer, 26 seconds' && P.title === 'How several passes turn one line into four', `${P.k} / ${P.title}`);
      const want = '04.1=litho-print 04.2=several-passes 04.3=tool-price 04.4=euv-shipments 04.5=litho-mix 04.6=asml-region';
      check(`${W}: the chapter's figures run 04.1 to 04.6, the old 04.2 to 04.5 now 04.3 to 04.6`, P.nums === want, P.nums);
      check(`${W}: the rail lists the same six, 04.2 by its title`, P.rail === want && P.railT === 'How several passes turn one line into four', `${P.rail} / ${P.railT}`);
      check(`${W}: "several passes per layer" in Deep ultraviolet links to it, "(figure 04.2)"`, P.link === 'several passes per layer | several passes per layer (figure 04.2)', P.link);
      check(`${W}: no Cite, Table, CSV or PNG (an explainer, as 04.1)`, !P.acts);
      check(`${W}: reduced motion opens paused on the last step, its caption and every tile`, P.paused && /Cut$/.test(P.cur) && /^A later exposure prints blocks/.test(P.cap) && P.tiles[0] === 9 && P.tiles[1] === 1, JSON.stringify({ paused: P.paused, cur: P.cur, cap: P.cap, tiles: P.tiles }));
      check(`${W}: no step-total line (no count or total in the drawing's words)`, !/total|\bsteps?\b|\b\d+\s*(steps|passes)/i.test(P.text), P.text);
      check(`${W}: the EUV lane's one label is "Light reflected off a mirror mask", and it names no mask of its own`, P.euvLabs === 'Light reflected off a mirror mask', P.euvLabs);
      // the drawing, by its pixels, light theme: at 2.4 s the DUV mask is down and the EUV lane has none; at the end the cut took a teal line
      await t.ev(`(CP_LIVE.saqp['fig-lithography-several-passes'].seek(2.4),1)`); await sleep(200);
      const duvMask = await t.ev(PIX('duv', 0, 1.05)), euvBand = [];
      for (let x = -9.9; x < 10; x += 0.3) euvBand.push(await t.ev(PIX('euv', x, 0.5)));
      check(`${W}: at 2.4 s the DUV mask is drawn (#2b323c)`, near(duvMask, '#2b323c'), duvMask);
      check(`${W}: at 2.4 s the EUV lane has no mask, only light (no #2b323c across the band where a mask would sit)`, euvBand.every((p) => !near(p, '#2b323c', 30)) && euvBand.some((p) => p[3] > 0), `${euvBand.filter((p) => near(p, '#2b323c', 30)).length} mask pixels of ${euvBand.length}`);
      await t.ev(`(CP_LIVE.saqp['fig-lithography-several-passes'].seek(26),1)`); await sleep(200);
      // the final lines' centres (the module's geometry: lines 1 wide, cores 8 apart at -8, 0 and 8); the 10th is the cut's
      const L = [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9];
      const got = [];
      for (const x of L) { const p = await t.ev(PIX('duv', x, 4.5)); got.push(near(p, '#7a1f2b', 14) ? 'wine' : near(p, '#4f8a8b', 14) ? 'teal' : 'none'); }
      check(`${W}: at the end, three teal, four wine, two teal, the cut's gap, one teal`, got.join(',') === 'teal,teal,teal,wine,wine,wine,wine,teal,none,teal', got.join(','));
      const s1 = await t.ev(SIZES(SAQP));
      check(`${W}: every label 11.5 px or more`, s1.min >= 11.5, `${s1.min} px at ${s1.at}`);
      check(`${W}: no sideways scroll`, s1.wide <= 0, `${s1.wide} px`);
      // print: the live parts give way to the still, with the steps listed and the number kept
      await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
      const pr = await t.ev(`new Promise(function(res){var f=document.querySelector('${SAQP}'),img=f.querySelector('.anim-print');img.loading='eager';var go=function(){res({screen:getComputedStyle(f.querySelector('.lv-screen')).display,img:getComputedStyle(img).display,w:img.naturalWidth,src:img.getAttribute('src'),steps:[].filter.call(f.querySelectorAll('.anim-transcript li'),function(l){return l.getClientRects().length}).length,k:getComputedStyle(f.querySelector('.fig-k')).display!=='none'&&f.querySelector('.fig-k').textContent});};if(img.complete&&img.naturalWidth)go();else{img.addEventListener('load',go);img.addEventListener('error',go);setTimeout(go,4000);}})`);
      check(`${W}: in print, the still (${pr.src}) in place of the drawing, the six steps listed, "Figure 04.2" kept`, pr.screen === 'none' && pr.img === 'block' && pr.w > 1000 && pr.steps === 6 && /^Figure 04\.2/.test(pr.k), pr);
      await t.s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // with motion: it plays on screen, a click pauses, a step plays from there
    {
      const t = await open(chrome, `${BASE}/lithography/`, { width: 1440, motion: true, wait: 2500 });
      await t.ev(`(function(){document.documentElement.style.scrollBehavior='auto';document.querySelector('${SAQP}').scrollIntoView({block:'center'});return 1})()`); await sleep(1500);
      const a = await t.ev(`CP_LIVE.saqp['fig-lithography-several-passes'].time()`); await sleep(800);
      const b = await t.ev(`CP_LIVE.saqp['fig-lithography-several-passes'].time()`);
      check('04.2 motion: it plays while on screen', b > a && b > 0.5, `${a.toFixed(2)} -> ${b.toFixed(2)} s`);
      await t.ev(`(document.querySelector('${SAQP} .anim-stage').click(),1)`); await sleep(300);
      const c = await t.ev(`CP_LIVE.saqp['fig-lithography-several-passes'].time()`); await sleep(600);
      const d = await t.ev(`({t:CP_LIVE.saqp['fig-lithography-several-passes'].time(),p:document.querySelector('${SAQP}').classList.contains('is-paused'),lab:document.querySelector('${SAQP} .anim-stage').getAttribute('aria-label')})`);
      check('04.2 motion: a click on the drawing pauses it, and the Paused mark shows', Math.abs(d.t - c) < 1e-6 && d.p && d.lab === 'Play the animation', JSON.stringify(d));
      await t.ev(`(document.querySelectorAll('${SAQP} .anim-steps button')[4].click(),1)`); await sleep(700);
      const e = await t.ev(`({t:CP_LIVE.saqp['fig-lithography-several-passes'].time(),cur:document.querySelector('${SAQP} .anim-steps [aria-current]').textContent,cap:document.querySelector('${SAQP} .anim-cap').textContent.slice(0,30),p:document.querySelector('${SAQP}').classList.contains('is-paused')})`);
      check('04.2 motion: step 05 plays from Four lines, marked and captioned', e.t > 12.8 && e.t < 14.5 && /Four lines$/.test(e.cur) && /^The spacers now serve as cores/.test(e.cap) && !e.p, JSON.stringify(e));
      check('04.2 motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // dark: the drawing takes the dark palette and the labels stay legible
    {
      const t = await open(chrome, `${BASE}/lithography/`, { width: 390, theme: 'dark', wait: 2500 });
      const slab = await t.ev(PIX('duv', 0, 6.3)), line = await t.ev(PIX('duv', -1, 4.5));
      check('04.2 dark 390: the wafer and the wine lines take the dark palette (#343b45, #a8414b)', near(slab, '#343b45') && near(line, '#a8414b', 14), JSON.stringify({ slab, line }));
      const s = await t.ev(SIZES(SAQP));
      check('04.2 dark 390: labels 11.5 px or more, no sideways scroll', s.min >= 11.5 && s.wide <= 0, JSON.stringify(s));
      check('04.2 dark 390: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // the links from chapters 08 and 16
    for (const ch of ['foundries-and-fabs', 'geopolitics']) {
      const t = await open(chrome, `${BASE}/${ch}/`, { width: 1440, wait: 1500 });
      const a = await t.ev(`(function(){var a=document.querySelector('#${ch} .prose a[href="../lithography/${SAQP}"]');return a?a.textContent+' '+a.nextSibling.textContent.trim().slice(0,40):null;})()`);
      check(`${ch}: links its several passes to figure 04.2 on Lithography's page`, !!a && /\(figure 04\.2\)/.test(a), a);
      await t.close();
    }
    /* ---------- 07.1 ---------- */
    for (const width of [1440, 390]) {
      const W = `07.1 ${width}`;
      const t = await open(chrome, `${BASE}/metrology-and-inspection/`, { width, wait: 2500 });
      const nums = `[].map.call(document.querySelectorAll('${YD} .yd-num'),function(e){return e.textContent}).join(' / ')`;
      const R = await t.ev(`(function(){var f=document.querySelector('${YD}');return {k:f.querySelector('.fig-k').textContent,title:f.querySelector('.fig-title').textContent,video:!!f.querySelector('video'),head:f.querySelector('.yd-k').textContent,
        inRead:[].every.call(f.querySelectorAll('.yd-row'),function(r){return r.closest('.yd-read')&&r.closest('.yd-read').querySelector('.yd-k').textContent==='The model’s output';}),
        nums:${nums},names:[].map.call(f.querySelectorAll('.yd-name'),function(e){return e.textContent}).join(' / '),cur:(f.querySelector('.anim-steps [aria-current]')||{}).textContent,cap:f.querySelector('.anim-cap').textContent.slice(0,40),
        outs:[].map.call(f.querySelectorAll('.yd-ctl output'),function(e){return e.textContent}).join(' / '),acts:!!f.querySelector('.fs-acts, .fs-csv, .fs-tab, .fs-png, .ch-cite-btn'),
        rail:[].map.call(document.querySelectorAll('#metrology-and-inspection .rail-figs a'),function(a){return a.querySelector('.n').textContent}).join(' ')};})()`);
      check(`${W}: "Figure 07.1 · Interactive explainer", the same title, no video`, R.k === 'Figure 07.1 · Interactive explainer' && R.title === 'Why big chips lose more to defects' && !R.video, `${R.k} / ${R.title} / video ${R.video}`);
      check(`${W}: the readouts sit under "The model’s output"`, R.head === 'The model’s output' && R.inRead);
      check(`${W}: at the chapter's inputs they read 49.2, 11.3 and 20.1`, R.nums === '49.2 / 11.3 / 20.1' && R.outs === '20 × 20 mm / 0.8' && /The cost$/.test(R.cur) && /^The big chip yields less/.test(R.cap), JSON.stringify(R));
      check(`${W}: the rail still lists 07.1 to 07.4; no Cite, Table, CSV or PNG`, R.rail === '07.1 07.2 07.3 07.4' && !R.acts, R.rail);
      const S = await t.ev(`(function(){var f=document.querySelector('${YD}'),v=f.querySelector('.yd-ctl input[min="10"]'),d=f.querySelector('.yd-ctl input[min="0.1"]'),o={};var go=function(el,x){el.value=x;el.dispatchEvent(new Event('input',{bubbles:true}));};
        go(v,15);o.at15=${nums}+' | '+f.querySelector('.yd-ctl output').textContent+' | '+f.querySelector('.anim-cap').textContent.slice(0,24)+' | step '+!!f.querySelector('.anim-steps [aria-current]');
        go(v,10);o.at10=${nums};go(v,20);o.back20=${nums};go(v,33);go(d,1);o.max=${nums}+' | '+[].map.call(f.querySelectorAll('.yd-ctl output'),function(e){return e.textContent}).join(' / ');
        go(d,0.1);go(v,10);o.min=${nums};
        f.querySelectorAll('.anim-steps button')[2].click();return o;})()`);
      check(`${W}: the chip-size slider moves the readouts (15 mm)`, /^49\.2 \/ \d+\.\d \/ \d+\.\d \| 15 × 15 mm \| The formula’s output for \| step false$/.test(S.at15) && S.at15 !== '49.2 / 11.3 / 20.1', S.at15);
      check(`${W}: at 1 cm the chosen chips are the 1 cm chips (49.2, 49.2, 1.0)`, S.at10 === '49.2 / 49.2 / 1.0', S.at10);
      check(`${W}: back at 2 cm and 0.8 it reads the chapter's 49.2, 11.3 and 20.1`, S.back20 === '49.2 / 11.3 / 20.1', S.back20);
      check(`${W}: at 26 × 33 mm and 1.0 the readouts stay numbers`, /^\d+\.\d \/ \d+\.\d \/ \d+(\.\d)? \| 26 × 33 mm \/ 1\.0$/.test(S.max), S.max);
      check(`${W}: at 1 cm and 0.1 (the low ends)`, /^\d+\.\d \/ \d+\.\d \/ 1\.0$/.test(S.min), S.min);
      await sleep(3200);   // step 03 plays (at once under reduced motion)
      const st = await t.ev(`({nums:${nums},outs:[].map.call(document.querySelectorAll('${YD} .yd-ctl output'),function(e){return e.textContent}).join(' / '),cur:document.querySelector('${YD} .anim-steps [aria-current]').textContent})`);
      check(`${W}: step 03 returns the sliders to 2 cm and 0.8`, st.outs === '20 × 20 mm / 0.8' && /Big chips$/.test(st.cur) && /^49\.2 \/ 11\.3 \//.test(st.nums), JSON.stringify(st));
      const s = await t.ev(SIZES(YD));
      check(`${W}: every label 11.5 px or more`, s.min >= 11.5, `${s.min} px at ${s.at}`);
      check(`${W}: no sideways scroll`, s.wide <= 0, `${s.wide} px`);
      if (width === 390) {
        const fit = await t.ev(`(function(){var f=document.querySelector('${YD}'),a=f.querySelector('.anim-stage').getBoundingClientRect(),b=f.querySelector('.yd-ctls').getBoundingClientRect();return {h:Math.round(b.bottom-a.top),vh:innerHeight};})()`);
        check(`${W}: wafer, readouts and both sliders fit on one screen`, fit.h <= fit.vh - 64, `${fit.h} px of ${fit.vh} (less the 64 px strip)`);
      }
      await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
      const pr = await t.ev(`new Promise(function(res){var f=document.querySelector('${YD}'),img=f.querySelector('.anim-print');img.loading='eager';var go=function(){res({screen:[].map.call(f.querySelectorAll('.lv-screen'),function(e){return getComputedStyle(e).display}).join(','),img:getComputedStyle(img).display,w:img.naturalWidth,src:img.getAttribute('src'),steps:[].filter.call(f.querySelectorAll('.anim-transcript li'),function(l){return l.getClientRects().length}).length,k:f.querySelector('.fig-k').textContent});};if(img.complete&&img.naturalWidth)go();else{img.addEventListener('load',go);img.addEventListener('error',go);setTimeout(go,4000);}})`);
      check(`${W}: in print, the still (${pr.src}) in place of the wafer, readouts and sliders, the four steps listed, "Figure 07.1" kept`, pr.screen === 'none,none,none' && pr.img === 'block' && pr.w > 1000 && pr.steps === 4 && /^Figure 07\.1/.test(pr.k), pr);
      await t.s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // dark, with motion: it plays its four steps once on screen and ends at the chapter's inputs
    {
      const t = await open(chrome, `${BASE}/metrology-and-inspection/?theme=dark`, { width: 1440, motion: true, wait: 2000 });
      await t.ev(`(function(){document.documentElement.style.scrollBehavior='auto';document.querySelector('${YD}').scrollIntoView({block:'center'});return 1})()`); await sleep(1200);
      const a = await t.ev(`(document.querySelector('${YD} .anim-steps [aria-current]')||{}).textContent`);
      await sleep(13500);
      const b = await t.ev(`({cur:document.querySelector('${YD} .anim-steps [aria-current]').textContent,nums:[].map.call(document.querySelectorAll('${YD} .yd-num'),function(e){return e.textContent}).join(' / '),theme:document.documentElement.getAttribute('data-theme')})`);
      check('07.1 dark motion: on screen it plays the four steps once and ends on The cost at 49.2, 11.3 and 20.1', /Specks land$/.test(a) && /The cost$/.test(b.cur) && b.nums === '49.2 / 11.3 / 20.1' && b.theme === 'dark', JSON.stringify({ a, b }));
      check('07.1 dark motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(`\n${n - bad} of ${n} checks pass${bad ? `; ${bad} failed` : ''}`);
  process.exit(bad ? 1 : 0);
})();
