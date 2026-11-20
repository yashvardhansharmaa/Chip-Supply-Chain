#!/usr/bin/env node
/* The two live explainers of 29 Oct 2026 (qa/excellence/BUILD-BRIEF-2.md, "explain"), on the local preview, ported from the
   mockups' check.js and grown to the brief's list, and the two explorables of 21 Nov 2026 (qa/builds-nov/BRIEF.md):
   - 04.3 (04.2 until 21 Nov 2026), several passes: where it sits, the chapter's figure numbers and the rail's list, the link from Deep ultraviolet and
     the "(see figure 04.3)" links from chapters 08 and 16, which keep their multipatterning look-up; the latest version (no mask drawn in the EUV lane, which carries "Light reflected off a mirror
     mask"; the cut on a teal line, so the four wine lines stay four; no step-total line), read from the drawing's pixels; the
     tiles; steps that play from where they start; reduced motion opening paused on the last step; dark mode's colors.
   - 07.1, driven by its model: the readouts under "The model's output" at the chapter's inputs (49.2, 11.3 and 20.1), the
     sliders driven by input events, a step returning the sliders to the chapter's inputs, no video left.
   - Both: labels at 11.5 px or more (the Paused mark is the site's own, var(--fs-cap-s), the same on every explainer, and is left out), no sideways scroll at 390, no Cite, Table, CSV or PNG (an explainer has none, as 04.1
     has none), and print: the live parts hidden, the still loaded and shown, the steps listed, the number kept. No page errors.
   - 04.2, pick the light, and 10.3, reticle fields (the explorables, build/explore.js): where each sits, its number and the
     rail's, the kicker and title; every step's numbers, sentence and sources as content/04 and content/10 give them; 10.3's
     squares at every step (only the squares a step adds are wine, counted from the step before it) and its H100 die; 04.2's
     wave and lines on one nm scale; the controls by keyboard (arrow keys on the slider and the tabs, Home and End) with a
     visible focus ring, previous and next, the ticks; ?step= and ?light=; motion (the squares grow, the wave eases) and reduced
     motion (at once); 44 px targets, labels at 11.5 px or more and no sideways scroll at 390; dark; Cite and Table, no CSV or
     PNG; print: the live parts hidden and the still of the step "print" names, with its sentence. No page errors.
   usage: node qa/redesign/check-explain.js [base]   (base http://127.0.0.1:8789). Exits 1 on any failure. */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8789').replace(/\/$/, '');
const SAQP = '#fig-lithography-several-passes', YD = '#fig-metrology-and-inspection-defect-yield', PL = '#fig-lithography-pick-the-light', XR = '#fig-advanced-packaging-cowos-reticles';
let n = 0, bad = 0;
const check = (name, pass, info) => { n++; if (!pass) bad++; console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${info !== undefined && (!pass || process.env.VERBOSE) ? '  ' + (typeof info === 'string' ? info : JSON.stringify(info)) : ''}`); };

// the smallest text in a figure (the transcript is for screen readers and paper), and sideways scroll
const SIZES = (sel) => `(function(){var f=document.querySelector('${sel}'),min=99,at='';
  f.querySelectorAll('*').forEach(function(e){if(e.closest('.anim-transcript')||e.closest('.anim-state'))return;var own=[].some.call(e.childNodes,function(x){return x.nodeType===3&&x.nodeValue.trim();});if(!own)return;var cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||!e.getClientRects().length)return;var s=parseFloat(cs.fontSize);if(s<min){min=s;at=(e.className||e.tagName)+': '+e.textContent.trim().slice(0,30);}});
  return {min:min,at:at,wide:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`;
// the colour at a point of a lane's canvas, in units of the drawing (x from -10 to 10, y down from the lane's top)
const PIX = (lane, x, y) => `(function(){var c=document.querySelector('${SAQP} .sq-draw[data-lane="${lane}"] canvas'),g=c.getContext('2d'),w=c.width,K=w/20;var d=g.getImageData(Math.round((${x}+10)*K),Math.round(${y}*K),1,1).data;return [d[0],d[1],d[2],d[3]];})()`;
// a figure's front matter, as content/*.md gives it
const figOf = (file, id) => { const src = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'content', file), 'utf8'), a = src.indexOf('---json\n') + 8; return JSON.parse(src.slice(a, src.indexOf('\n---', a))).figures.find((f) => f.id === id); };
const near = (a, hex, tol = 10) => { const n = parseInt(hex.slice(1), 16), b = [n >> 16, (n >> 8) & 255, n & 255]; return a[3] > 200 && b.every((v, i) => Math.abs(v - a[i]) <= tol); };

(async () => {
  const chrome = launch();
  try {
    /* ---------- 04.3 (04.2 until 21 Nov 2026) ---------- */
    for (const width of [1440, 390]) {
      const W = `04.3 ${width}`;
      const t = await open(chrome, `${BASE}/lithography/`, { width, wait: 2500 });   // reduced motion (cdp.js's default)
      const P = await t.ev(`(function(){var f=document.querySelector('${SAQP}');if(!f)return null;var prev=f.previousElementSibling,next=f.nextElementSibling;
        return {prev:prev&&prev.textContent.slice(0,60),next:next&&next.tagName+' '+(next.getAttribute('data-k')||'')+' | '+next.textContent.slice(0,30),k:f.querySelector('.fig-k').textContent,title:f.querySelector('.fig-title').textContent,
          nums:[].map.call(document.querySelectorAll('#lithography .prose .fig-k'),function(e){return (/[0-9][0-9][.][0-9]+/.exec(e.textContent)||[''])[0]+'='+e.closest('.figure').id.replace('fig-lithography-','')}).join(' '),
          rail:[].map.call(document.querySelectorAll('#lithography .rail-figs a'),function(a){return a.querySelector('.n').textContent+'='+a.getAttribute('href').replace('#fig-lithography-','')}).join(' '),
          railT:(document.querySelector('#lithography .rail-figs a[href="${SAQP}"] .t')||{}).textContent,
          link:(function(){var a=document.querySelector('#lithography .prose p a[href="${SAQP}"]');return a?a.textContent+' | '+a.parentNode.textContent.slice(a.parentNode.textContent.indexOf(a.textContent),a.parentNode.textContent.indexOf(a.textContent)+a.textContent.length+14):null;})(),
          acts:!!f.querySelector('.fs-acts, .fs-csv, .fs-tab, .fs-png, .ch-cite-btn'),paused:f.classList.contains('is-paused'),cur:(f.querySelector('.anim-steps [aria-current]')||{}).textContent,
          cap:f.querySelector('.anim-cap').textContent.slice(0,30),tiles:[f.querySelectorAll('.sq-tiles')[0].querySelectorAll('.sq-tile:not(.off)').length,f.querySelectorAll('.sq-tiles')[1].querySelectorAll('.sq-tile:not(.off)').length],
          text:f.querySelector('.lv-screen').textContent,reflect:(f.querySelector('[data-l="reflect"]')||{}).textContent,euvLabs:[].map.call(f.querySelectorAll('.sq-draw-euv .lv-lab'),function(e){return e.textContent}).join('|')};})()`);
      check(`${W}: the figure is on the page`, !!P);
      if (!P) { await t.close(); continue; }
      check(`${W}: it follows the multipatterning paragraph and comes before the Variants and trade-offs section (found by its short heading, data-k, since its shown words changed on 29 Oct 2026)`, /^When one exposure cannot draw a pattern finely enough/.test(P.prev) && /^H[23] Variants and trade-offs \|/.test(P.next), `${P.prev} ... ${P.next}`);
      check(`${W}: numbered "Figure 04.3 · Explainer, 26 seconds", titled as the mockup`, P.k === 'Figure 04.3 · Explainer, 26 seconds' && P.title === 'How several passes turn one line into four', `${P.k} / ${P.title}`);
      const want = '04.1=litho-print 04.2=pick-the-light 04.3=several-passes 04.4=tool-price 04.5=euv-shipments 04.6=litho-mix 04.7=asml-region';
      check(`${W}: the chapter's figures run 04.1 to 04.7, the new 04.2 (21 Nov 2026) before several passes, now 04.3`, P.nums === want, P.nums);
      check(`${W}: the rail lists the same seven, 04.3 by its title`, P.rail === want && P.railT === 'How several passes turn one line into four', `${P.rail} / ${P.railT}`);
      check(`${W}: "several passes per layer" in Deep ultraviolet links to it, "(figure 04.3)"`, P.link === 'several passes per layer | several passes per layer (figure 04.3)', P.link);
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
      check(`${W}: in print, the still (${pr.src}) in place of the drawing, the six steps listed, "Figure 04.3" kept`, pr.screen === 'none' && pr.img === 'block' && pr.w > 1000 && pr.steps === 6 && /^Figure 04\.3/.test(pr.k), pr);
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
      check('04.3 motion: it plays while on screen', b > a && b > 0.5, `${a.toFixed(2)} -> ${b.toFixed(2)} s`);
      await t.ev(`(document.querySelector('${SAQP} .anim-stage').click(),1)`); await sleep(300);
      const c = await t.ev(`CP_LIVE.saqp['fig-lithography-several-passes'].time()`); await sleep(600);
      const d = await t.ev(`({t:CP_LIVE.saqp['fig-lithography-several-passes'].time(),p:document.querySelector('${SAQP}').classList.contains('is-paused'),lab:document.querySelector('${SAQP} .anim-stage').getAttribute('aria-label')})`);
      check('04.3 motion: a click on the drawing pauses it, and the Paused mark shows', Math.abs(d.t - c) < 1e-6 && d.p && d.lab === 'Play the animation', JSON.stringify(d));
      await t.ev(`(document.querySelectorAll('${SAQP} .anim-steps button')[4].click(),1)`); await sleep(700);
      const e = await t.ev(`({t:CP_LIVE.saqp['fig-lithography-several-passes'].time(),cur:document.querySelector('${SAQP} .anim-steps [aria-current]').textContent,cap:document.querySelector('${SAQP} .anim-cap').textContent.slice(0,30),p:document.querySelector('${SAQP}').classList.contains('is-paused')})`);
      check('04.3 motion: step 05 plays from Four lines, marked and captioned', e.t > 12.8 && e.t < 14.5 && /Four lines$/.test(e.cur) && /^The spacers now serve as cores/.test(e.cap) && !e.p, JSON.stringify(e));
      check('04.3 motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // dark: the drawing takes the dark palette and the labels stay legible
    {
      const t = await open(chrome, `${BASE}/lithography/`, { width: 390, theme: 'dark', wait: 2500 });
      const slab = await t.ev(PIX('duv', 0, 6.3)), line = await t.ev(PIX('duv', -1, 4.5));
      check('04.3 dark 390: the wafer and the wine lines take the dark palette (#343b45, #a8414b)', near(slab, '#343b45') && near(line, '#a8414b', 14), JSON.stringify({ slab, line }));
      const s = await t.ev(SIZES(SAQP));
      check('04.3 dark 390: labels 11.5 px or more, no sideways scroll', s.min >= 11.5 && s.wide <= 0, JSON.stringify(s));
      check('04.3 dark 390: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // the links from chapters 08 and 16
    for (const ch of ['foundries-and-fabs', 'geopolitics']) {
      const t = await open(chrome, `${BASE}/${ch}/`, { width: 1440, wait: 1500 });
      const a = await t.ev(`(function(){var a=document.querySelector('#${ch} .prose a[href="../lithography/${SAQP}"]'),g=document.querySelectorAll('#${ch} .gl-term[data-term="multipatterning"]').length;if(!g)return 'no multipatterning look-up';if(!a)return null;var p=a.closest('p').textContent,i=p.indexOf('several');return a.textContent+' | '+p.slice(i,p.indexOf(')',i)+1);})()`);
      check(`${ch}: "(see figure 04.3)" links its several passes to the figure on Lithography's page`, !!a && /^figure 04\.3 \| several (passes on deep-ultraviolet tools|patterning steps) \(see figure 04\.3\)$/.test(a), a);
      await t.close();
    }
    /* ---------- the explorables of 21 Nov 2026: 04.2, pick the light, and 10.3, reticle fields ---------- */
    const PLS = figOf('04-lithography.md', 'pick-the-light'), XRS = figOf('10-advanced-packaging.md', 'cowos-reticles');
    const q = (s) => String(s || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
    const srcOf = (st) => (st.sources || []).map((x) => q(x.label) + ' ' + x.url).join(' | ');
    const key = async (t, k) => { const code = { ArrowRight: 39, ArrowLeft: 37, ArrowDown: 40, ArrowUp: 38, Home: 36, End: 35, Tab: 9 }[k]; await t.s('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code: k, windowsVirtualKeyCode: code }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: code }); await sleep(120); };
    const ring = `(function(){var e=document.activeElement,c=getComputedStyle(e);return {tag:e.tagName+'.'+e.className,style:c.outlineStyle,w:parseFloat(c.outlineWidth)};})()`;
    const ACTS = (sel) => `[].map.call(document.querySelectorAll('${sel} .fs-acts > *'),function(a){return a.textContent}).join(' ')`;
    // 04.2: the light shown, read off the page
    const PLREAD = `(function(){var f=document.querySelector('${PL}'),p=f.querySelector('.pl-panel.lv-screen'),T=function(s){var e=p.querySelector(s);return e?e.textContent.replace(/\\s+/g,' ').trim():''};
      var on=f.querySelector('.pl-pick.lv-screen [aria-checked="true"]'),vb=p.querySelector('.pl-lines').getAttribute('viewBox').split(' ').map(Number),r=p.querySelectorAll('.pl-g rect');
      return {on:on?on.querySelector('b').textContent:null,focus:document.activeElement===on,wl:T('.pl-f-wl'),ft:T('.pl-f-ft'),mech:T('.pl-mech'),cap:T('.pl-cap'),
        src:[].map.call(p.querySelectorAll('.pl-src a'),function(a){return a.textContent.replace(/\\s+/g,' ').trim()+' '+a.getAttribute('href')}).join(' | '),
        span:vb[2],lines:r.length,lw:r.length?+r[0].getAttribute('width'):0,gap:r.length>1?+r[1].getAttribute('x')-+r[0].getAttribute('x'):0,
        col:parseFloat(p.querySelector('.pl-span').style.width),brW:parseFloat(p.querySelector('.pl-br-wave').style.width),brL:parseFloat(p.querySelector('.pl-br-line').style.width),ruler:parseFloat(p.querySelector('.pl-ruler i').style.width),
        labs:[].map.call(p.querySelectorAll('.pl-br em'),function(e){return e.textContent}).join(' | '),
        over:[].some.call(p.querySelectorAll('.pl-br em'),function(e){return e.getBoundingClientRect().right>p.getBoundingClientRect().right-1})||p.querySelector('.pl-br-wave em').getBoundingClientRect().bottom>p.querySelector('.pl-row-lines .pl-lab').getBoundingClientRect().top-2,shown:CP_LIVE.light.figs['fig-lithography-pick-the-light'].shown()};})()`;
    for (const width of [1440, 390]) {
      const W = `04.2 ${width}`;
      const t = await open(chrome, `${BASE}/lithography/`, { width, wait: 2500 });
      const P = await t.ev(`(function(){var f=document.querySelector('${PL}');if(!f)return null;var prev=f.previousElementSibling,next=f.nextElementSibling;
        return {prev:prev&&prev.textContent.slice(0,40),next:next&&next.textContent.slice(0,40),k:f.querySelector('.fig-k').textContent,title:f.querySelector('.fig-title').textContent,sub:(f.querySelector('.fig-sub')||{}).textContent,
          railT:(document.querySelector('#lithography .rail-figs a[href="${PL}"]')||{}).textContent,tabs:[].map.call(f.querySelectorAll('.pl-pick.lv-screen .pl-opt'),function(b){return b.textContent}).join(' | '),
          live:f.classList.contains('figure--live')&&f.classList.contains('lv-light'),acts:${ACTS(PL)},tab44:[].every.call(f.querySelectorAll('.pl-pick.lv-screen .pl-opt'),function(b){var r=b.getBoundingClientRect();return r.height>=44&&r.width>=44})};})()`);
      check(`${W}: the figure is on the page, drawn by its module`, !!P && P.live);
      if (!P) { await t.close(); continue; }
      check(`${W}: it follows the paragraph on finer lines and shorter light, before multipatterning`, /^Finer lines need shorter light/.test(P.prev) && /^When one exposure cannot draw/.test(P.next), `${P.prev} ... ${P.next}`);
      check(`${W}: "Figure 04.2 · Interactive explainer", titled as the mockup, the rail by its title`, P.k === 'Figure 04.2 · Interactive explainer' && P.title === 'The light each kind of scanner uses, and the finest line it prints' && P.sub === 'Six lights, drawn to one scale in nanometers.' && /^04\.2The light each kind of scanner uses, and the finest line it prints$/.test(P.railT), `${P.k} / ${P.title} / ${P.sub} / ${P.railT}`);
      check(`${W}: a tab for each of the six lights, with its wavelength`, P.tabs === PLS.steps.map((s) => `${s.k}${s.wl} nm`).join(' | '), P.tabs);
      check(`${W}: Cite and Table, no CSV or PNG`, P.acts === 'Cite Table', P.acts);
      if (width === 390) check(`${W}: every tab a 44 px target`, P.tab44);
      const r0 = await t.ev(PLREAD);
      check(`${W}: it opens on ArF immersion, the light paper prints (193 nm light, 38 nm lines)`, r0.on === 'ArF immersion' && r0.wl === '193nm' && r0.ft === '38nm or less', JSON.stringify(r0));
      // every light: its numbers, sentence and sources as content/04 gives them, drawn to one scale
      for (let i = 0; i < PLS.steps.length; i++) {
        const st = PLS.steps[i];
        await t.ev(`(document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt')[${i}].click(),1)`); await sleep(80);
        const r = await t.ev(PLREAD), span = width === 390 ? 560 : 800, pc = (v) => Math.min(v, span) / span * 100;
        const okNums = r.on === st.k && r.wl === `${st.wl}nm` && r.ft === `${st.ft}${st.ftU}` && r.mech === st.mech && q(r.cap) === q(st.cap) && q(r.src) === srcOf(st);
        const okDraw = r.span === span && Math.abs(r.lw - st.ft) < 0.01 && (r.lines < 2 || Math.abs(r.gap - 2 * st.ft) < 0.01) && r.lines === Math.ceil(span / (2 * st.ft)) && Math.abs(r.col - pc(st.wl)) < 0.01 && Math.abs(r.brW - pc(st.wl)) < 0.01 && Math.abs(r.brL - pc(st.ft)) < 0.01 && Math.abs(r.ruler - pc(100)) < 0.01 && Math.abs(r.shown.wl - st.wl) < 1e-9;
        check(`${W}: ${st.k}: ${st.wl} nm light and ${st.ft} ${st.ftU} lines, its sentence and sources as content/04 gives them`, okNums, JSON.stringify(r));
        check(`${W}: ${st.k}: drawn to one scale (${span} nm across): lines ${st.ft} nm wide with ${st.ft} nm gaps, the wavelength column, brackets and the 100 nm ruler`, okDraw, JSON.stringify(r));
        check(`${W}: ${st.k}: the bracket labels name the light's values, stay inside the panel and clear the row under them`, r.labs === `One wavelength, ${st.wl} nm | One line, ${st.ft} nm` && !r.over, `${r.labs} over ${r.over}`);
      }
      const s1 = await t.ev(SIZES(PL));
      check(`${W}: every label 11.5 px or more, no sideways scroll (at High-NA EUV and, below, i-line)`, s1.min >= 11.5 && s1.wide <= 0, JSON.stringify(s1));
      await t.ev(`(document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt')[0].click(),1)`); await sleep(80);
      const s2 = await t.ev(SIZES(PL));
      check(`${W}: at i-line, labels 11.5 px or more and no sideways scroll`, s2.min >= 11.5 && s2.wide <= 0, JSON.stringify(s2));
      // the keyboard: arrow keys move the choice and the focus, Home and End go to the ends; the focus ring shows
      await t.ev(`(function(){var b=document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt')[3];b.click();document.documentElement.style.scrollBehavior='auto';b.scrollIntoView({block:'center'});b.blur();return 1})()`);
      await t.ev(`(document.querySelector('${PL} .fig-k').focus(),1)`); await key(t, 'Tab');   // from the figure's number, Tab enters the group
      const kf = await t.ev(`(function(){var e=document.activeElement;return {on:e.getAttribute('aria-checked'),k:(e.querySelector('b')||{}).textContent,tabs:[].map.call(document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt'),function(b){return b.tabIndex}).join(',')}})()`);
      check(`${W}: Tab lands on the chosen light alone (one tab stop for the group)`, kf.on === 'true' && kf.k === 'ArF immersion' && kf.tabs === '-1,-1,-1,0,-1,-1', JSON.stringify(kf));
      const fr = await t.ev(ring);
      check(`${W}: the focus ring shows`, fr.style !== 'none' && fr.w >= 2, JSON.stringify(fr));
      await key(t, 'ArrowRight'); const k1 = await t.ev(PLREAD);
      await key(t, 'ArrowLeft'); await key(t, 'ArrowLeft'); const k2 = await t.ev(PLREAD);
      await key(t, 'End'); const k3 = await t.ev(PLREAD);
      await key(t, 'Home'); const k4 = await t.ev(PLREAD);
      check(`${W}: arrow keys, Home and End pick the next, the previous, the last and the first light, and the focus follows`, k1.on === 'EUV' && k1.focus && k2.on === 'ArF dry' && k2.focus && k3.on === 'High-NA EUV' && k3.focus && k4.on === 'i-line' && k4.focus, [k1, k2, k3, k4].map((x) => x.on + (x.focus ? '*' : '')).join(' '));
      // Table swaps the drawing for the rows, and back
      await t.ev(`(document.querySelector('${PL} .fs-tab').click(),1)`); await sleep(200);
      const tb = await t.ev(`(function(){var f=document.querySelector('${PL}'),tb=f.querySelector('table.fig-table');return {stage:getComputedStyle(f.querySelector('.xp-stage')).display,rows:[].map.call(tb.querySelectorAll('tbody tr'),function(r){return [].map.call(r.children,function(c){return c.textContent}).join(' / ')}),head:[].map.call(tb.querySelectorAll('thead th'),function(c){return c.textContent}).join(' / '),h:tb.getBoundingClientRect().height}})()`);
      check(`${W}: Table shows the six lights' rows in place of the drawing`, tb.stage === 'none' && tb.h > 100 && tb.head === 'Light / Wavelength / Finest line' && tb.rows.join(' | ') === PLS.steps.map((s) => `${s.k} / ${s.wl} nm / ${s.ft} ${s.ftU}`).join(' | '), JSON.stringify(tb));
      await t.ev(`(document.querySelector('${PL} .fs-tab').click(),1)`); await sleep(200);
      check(`${W}: and back to the drawing`, await t.ev(`getComputedStyle(document.querySelector('${PL} .xp-stage')).display!=='none'`));
      // print: the still of ArF immersion, whatever the reader chose (i-line now)
      await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
      const pr = await t.ev(`(function(){var f=document.querySelector('${PL}'),st=f.querySelector('.pl-panel.xp-still'),T=function(s){return st.querySelector(s).textContent.replace(/\\s+/g,' ').trim()};
        return {live:[].map.call(f.querySelectorAll('.lv-screen'),function(e){return getComputedStyle(e).display}).join(','),still:getComputedStyle(st).display,pick:getComputedStyle(f.querySelector('.pl-pick.xp-still')).display,on:(f.querySelector('.pl-pick.xp-still .on')||{}).textContent,
          wl:T('.pl-f-wl'),ft:T('.pl-f-ft'),cap:T('.pl-cap'),lines:st.querySelectorAll('.pl-g rect').length,list:getComputedStyle(f.querySelector('.xp-list')).display,k:f.querySelector('.fig-k').textContent,h:Math.round(st.getBoundingClientRect().height)}})()`);
      const ps = PLS.steps[PLS.print - 1];
      check(`${W}: in print, the still of ${ps.k} with its sentence in place of the live parts, "Figure 04.2" kept`, pr.live === 'none,none' && pr.still === 'block' && pr.pick === 'grid' && pr.on === `${ps.k}${ps.wl} nm` && pr.wl === `${ps.wl}nm` && pr.ft === `${ps.ft}${ps.ftU}` && q(pr.cap) === q(ps.cap) && pr.lines === Math.ceil(800 / (2 * ps.ft)) && pr.list === 'none' && /^Figure 04\.2/.test(pr.k) && pr.h > 150, JSON.stringify(pr));
      await t.s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      check(`${W}: reduced motion changes the light at once`, await t.ev(`(function(){document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt')[4].click();var s=CP_LIVE.light.figs['fig-lithography-pick-the-light'].shown();return s.wl===13.5&&s.ft===13;})()`));
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // motion: the wave and the lines ease to the new light; ?light= opens on a light and brings the figure into view
    {
      const t = await open(chrome, `${BASE}/lithography/?light=2`, { width: 1440, motion: true, wait: 2500 });
      const d = await t.ev(`(function(){var r=document.querySelector('${PL}').getBoundingClientRect(),s=CP_LIVE.light.figs['fig-lithography-pick-the-light'].shown();return {on:document.querySelector('${PL} .pl-pick.lv-screen [aria-checked="true"] b').textContent,wl:s.wl,ft:s.ft,top:Math.round(r.top),vh:innerHeight}})()`);
      check('04.2 ?light=2 opens on KrF (248 nm, 80 nm) with the figure in view', d.on === 'KrF' && d.wl === 248 && d.ft === 80 && d.top >= 0 && d.top < d.vh / 2, JSON.stringify(d));
      await t.ev(`(document.querySelectorAll('${PL} .pl-pick.lv-screen .pl-opt')[4].click(),1)`); await sleep(300);
      const m = await t.ev(`CP_LIVE.light.figs['fig-lithography-pick-the-light'].shown()`); await sleep(800);
      const e = await t.ev(`CP_LIVE.light.figs['fig-lithography-pick-the-light'].shown()`);
      check('04.2 motion: KrF to EUV eases the wave and the lines through the sizes between, and settles on 13.5 nm and 13 nm', m.wl < 248 && m.wl > 13.5 && m.ft < 80 && m.ft > 13 && e.wl === 13.5 && e.ft === 13, JSON.stringify({ m, e }));
      check('04.2 motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    {
      const t = await open(chrome, `${BASE}/lithography/`, { width: 390, theme: 'dark', wait: 2500 });
      const c = await t.ev(`(function(){var f=document.querySelector('${PL} .pl-panel.lv-screen');return {wave:getComputedStyle(f.querySelector('.pl-wave-p')).stroke,film:getComputedStyle(f.querySelector('.pl-g rect')).fill,theme:document.documentElement.getAttribute('data-theme')}})()`);
      check('04.2 dark 390: the wave and the printed lines take the dark palette (#a99cff, #d9a145)', c.theme === 'dark' && c.wave === 'rgb(169, 156, 255)' && c.film === 'rgb(217, 161, 69)', JSON.stringify(c));
      const s = await t.ev(SIZES(PL));
      check('04.2 dark 390: labels 11.5 px or more, no sideways scroll', s.min >= 11.5 && s.wide <= 0, JSON.stringify(s));
      check('04.2 dark 390: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // 10.3: the step shown, read off the page
    const XRREAD = (sel) => `(function(){var f=document.querySelector('${XR}'),p=f.querySelector('${sel}'),T=function(s){var e=p.querySelector(s);return e?e.textContent.replace(/\\s+/g,' ').trim():''};
      var rs=[].slice.call(p.querySelectorAll('.xr-tiles rect')),nw=rs.filter(function(r){return r.classList.contains('new')});
      var area=rs.filter(function(r){return !r.classList.contains('field')}).reduce(function(a,r){return a+r.width.baseVal.value*r.height.baseVal.value},0);
      var cs=nw[0]?getComputedStyle(nw[0]).fill:'',old=rs.filter(function(r){return !r.classList.contains('new')&&!r.classList.contains('field')})[0];
      var c=p.querySelector('.xr-ctl'),rg=c&&c.querySelector('input[type=range]');
      return {num:T('.xr-num'),unit:T('.xr-unit'),what:T('.xr-what'),cap:T('.xr-cap'),src:[].map.call(p.querySelectorAll('.xr-src a'),function(a){return a.textContent.replace(/\\s+/g,' ').trim()+' '+a.getAttribute('href')}).join(' | '),
        rects:rs.length,nw:nw.length,die:p.querySelectorAll('.xr-tiles rect.die').length,field:p.querySelectorAll('.xr-tiles rect.field').length,part:p.querySelectorAll('.xr-tiles rect.part').length,area:Math.round(area*10)/10,
        newFill:cs,oldFill:old?getComputedStyle(old).fill:'',grow:p.querySelectorAll('.xr-tiles rect.grow').length,anim:nw[0]?getComputedStyle(nw[0]).animationName:'',key:T('.xr-key-new'),
        of:c?T('.xr-of'):'',val:rg?+rg.value:null,vt:rg?rg.getAttribute('aria-valuetext'):'',prev:c?c.querySelector('.xr-prev').disabled:null,next:c?c.querySelector('.xr-next').disabled:null,
        on:c?[].map.call(c.querySelectorAll('.xr-tick'),function(b){return b.classList.contains('on')?1:0}).join(''):'',focus:rg?document.activeElement===rg:false};})()`;
    const want = (k) => { const S = XRS.steps, s = S[k], full = Math.floor(s.v + 1e-9), frac = Math.round((s.v - full) * 100) / 100, n = full + (frac > 0 ? 1 : 0), before = k ? Math.floor(S[k - 1].v + 1e-9) : 0; return s.die ? { rects: 2, nw: 1, die: 1, part: 0, area: s.die } : { rects: n, nw: n - before, die: 0, part: frac > 0 ? 1 : 0, area: s.v * 858 }; };
    for (const width of [1440, 390]) {
      const W = `10.3 ${width}`;
      const t = await open(chrome, `${BASE}/advanced-packaging/`, { width, wait: 2500 });
      const P = await t.ev(`(function(){var f=document.querySelector('${XR}');if(!f)return null;var prev=f.previousElementSibling,next=f.nextElementSibling;
        return {prev:prev&&prev.tagName+' '+(prev.getAttribute('data-k')||prev.textContent),next:next&&next.textContent.slice(0,40),k:f.querySelector('.fig-k').textContent,title:f.querySelector('.fig-title').textContent,sub:(f.querySelector('.fig-sub')||{}).textContent,
          rail:[].map.call(document.querySelectorAll('#advanced-packaging .rail-figs a'),function(a){return a.querySelector('.n').textContent+'='+a.getAttribute('href').replace('#fig-advanced-packaging-','')}).join(' '),
          railT:(document.querySelector('#advanced-packaging .rail-figs a[href="${XR}"]')||{}).textContent,live:f.classList.contains('figure--live')&&f.classList.contains('lv-reticle'),acts:${ACTS(XR)},
          ticks:[].map.call(f.querySelectorAll('.xr-tick'),function(b){return b.textContent}).join(' | '),grid:[].map.call(f.querySelectorAll('.lv-screen .xr-grid line'),function(l){return +l.getAttribute('x1')===+l.getAttribute('x2')?'x'+l.getAttribute('x1'):'y'+l.getAttribute('y1')}).slice(0,3).join(' '),r:+f.querySelector('.lv-screen .xr-wafer').getAttribute('r'),
          t44:${width}<700?[].every.call(f.querySelectorAll('.xr-step button, .xr-tick, .xr-track input'),function(b){var r=b.getBoundingClientRect();return r.height>=44&&(b.tagName==='INPUT'||r.width>=44)}):true}})()`);
      check(`${W}: the figure is on the page, drawn by its module`, !!P && P.live);
      if (!P) { await t.close(); continue; }
      check(`${W}: it opens Who makes it, where 10.3 stood, before the paragraph on the three kinds of firm`, /^H2 Who makes it$/.test(P.prev) && /^Three kinds of firm package chips/.test(P.next), `${P.prev} ... ${P.next}`);
      check(`${W}: "Figure 10.3 · Interactive explainer", the explainer title the owner approved, the rail by its title`, P.k === 'Figure 10.3 · Interactive explainer' && P.title === 'How big a package gets, counted in reticle fields' && P.sub === 'From one exposure to TSMC’s 2029 plans, drawn to scale on a 300 mm wafer.' && P.railT === '10.3How big a package gets, counted in reticle fields', `${P.k} / ${P.title} / ${P.sub} / ${P.railT}`);
      check(`${W}: the chapter's figures keep their numbers, 10.1 to 10.4`, P.rail === '10.1=package-build 10.2=cowos-buyers 10.3=cowos-reticles 10.4=china-backend-tools', P.rail);
      check(`${W}: a 300 mm wafer (radius 150) under a grid of 26 by 33 mm fields; eight ticks`, P.r === 150 && /^x-169 x-143 x-117$/.test(P.grid) && P.ticks === XRS.steps.map((s) => s.k + (width < 700 ? '' : '') + s.sub).join(' | '), `${P.r} ${P.grid} ${P.ticks}`);
      check(`${W}: Cite and Table, no CSV or PNG`, P.acts === 'Cite Table', P.acts);
      if (width < 700) check(`${W}: previous, next, the ticks and the slider are 44 px targets`, P.t44);
      // every step, by Next: its numbers, sentence and sources; the squares drawn to scale; only the squares it adds in wine
      for (let k = 0; k < XRS.steps.length; k++) {
        if (k) { await t.ev(`(document.querySelector('${XR} .xr-next').click(),1)`); await sleep(260); }
        const r = await t.ev(XRREAD('.xr-panel.lv-screen')), st = XRS.steps[k], w = want(k);
        check(`${W}: step ${k + 1} (${st.k}): ${st.num} ${st.unit}, "${st.what}", its sentence and sources as content/10 gives them`, r.num === st.num && r.unit === st.unit && q(r.what) === q(st.what) && q(r.cap) === q(st.cap) && q(r.src) === srcOf(st) && r.of === `${k + 1} of 8` && r.val === k && q(r.vt) === q(`${st.num} ${st.unit}, ${st.what}`) && r.on === '00000000'.split('').map((x, i) => (i === k ? 1 : 0)).join(''), JSON.stringify(r));
        check(`${W}: step ${k + 1} (${st.k}): ${w.rects} squares covering ${w.area} mm², ${w.nw} of them wine (the ones it adds), ${w.part ? 'a part field dashed' : 'no part field'}`, r.rects === w.rects && r.nw === w.nw && r.die === w.die && r.part === w.part && Math.abs(r.area - w.area) <= w.area * 0.002 && r.newFill === 'rgba(122, 31, 43, 0.46)' && (!r.oldFill || r.oldFill === 'rgba(23, 23, 22, 0.09)') && !r.grow, JSON.stringify(r));
      }
      const last = await t.ev(XRREAD('.xr-panel.lv-screen'));
      check(`${W}: Next is off at the last step, Previous on`, last.next === true && last.prev === false);
      const s1 = await t.ev(SIZES(XR));
      check(`${W}: every label 11.5 px or more, no sideways scroll`, s1.min >= 11.5 && s1.wide <= 0, JSON.stringify(s1));
      // the keyboard on the slider, the ticks, Previous
      await t.ev(`(function(){var r=document.querySelector('${XR} .xr-track input');document.documentElement.style.scrollBehavior='auto';r.scrollIntoView({block:'center'});document.querySelector('${XR} .xr-tick').click();return 1})()`); await sleep(200);
      const tk = await t.ev(XRREAD('.xr-panel.lv-screen'));
      check(`${W}: a tick goes to its step and hands the focus to the slider`, tk.of === '1 of 8' && tk.focus && tk.prev === true, JSON.stringify(tk));
      // a keyboard focus (Tab from Next) on the slider shows the ring
      await t.ev(`(document.querySelector('${XR} .xr-next').focus(),1)`); await key(t, 'Tab');
      const fr = await t.ev(ring);
      check(`${W}: Tab reaches the slider after Next, with the focus ring showing; the ticks stay out of the tab order`, /^INPUT/.test(fr.tag) && fr.style !== 'none' && fr.w >= 2 && (await t.ev(`[].every.call(document.querySelectorAll('${XR} .xr-tick'),function(b){return b.tabIndex===-1})`)), JSON.stringify(fr));
      await key(t, 'ArrowRight'); const a1 = await t.ev(XRREAD('.xr-panel.lv-screen'));
      await key(t, 'ArrowRight'); await key(t, 'ArrowLeft'); const a2 = await t.ev(XRREAD('.xr-panel.lv-screen'));
      await key(t, 'End'); const a3 = await t.ev(XRREAD('.xr-panel.lv-screen'));
      await key(t, 'Home'); const a4 = await t.ev(XRREAD('.xr-panel.lv-screen'));
      check(`${W}: arrow keys on the slider step through, Home and End go to the ends`, a1.of === '2 of 8' && a1.num === '814' && a2.of === '2 of 8' && a3.of === '8 of 8' && a3.num === '40' && a4.of === '1 of 8' && a4.focus, [a1, a2, a3, a4].map((x) => x.of).join(' / '));
      await t.ev(`(document.querySelector('${XR} .xr-next').click(),document.querySelector('${XR} .xr-next').click(),document.querySelector('${XR} .xr-prev').click(),1)`); await sleep(400);
      check(`${W}: Next, Next, Previous lands on step 2`, (await t.ev(XRREAD('.xr-panel.lv-screen'))).of === '2 of 8');
      // Table
      await t.ev(`(document.querySelector('${XR} .fs-tab').click(),1)`); await sleep(200);
      const tb = await t.ev(`(function(){var f=document.querySelector('${XR}'),tb=f.querySelector('table.fig-table');return {stage:getComputedStyle(f.querySelector('.xp-stage')).display,rows:[].map.call(tb.querySelectorAll('tbody tr'),function(r){return [].map.call(r.children,function(c){return c.textContent}).join(' / ')}),head:[].map.call(tb.querySelectorAll('thead th'),function(c){return c.textContent}).join(' / '),h:tb.getBoundingClientRect().height}})()`);
      check(`${W}: Table shows the eight steps' rows in place of the drawing`, tb.stage === 'none' && tb.h > 100 && tb.head === 'Step / Size' && q(tb.rows.join(' | ')) === q(XRS.steps.map((s) => `${s.label} / ${s.num} ${s.unit}`).join(' | ')), JSON.stringify(tb));
      await t.ev(`(document.querySelector('${XR} .fs-tab').click(),1)`); await sleep(200);
      // print: the still of the step "print" names, whatever the reader chose (step 2 now)
      await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
      const pr = await t.ev(XRREAD('.xr-panel.xp-still')), pv = await t.ev(`(function(){var f=document.querySelector('${XR}');return {live:getComputedStyle(f.querySelector('.lv-screen')).display,still:getComputedStyle(f.querySelector('.xp-still')).display,list:getComputedStyle(f.querySelector('.xp-list')).display,k:f.querySelector('.fig-k').textContent,h:Math.round(f.querySelector('.xp-still').getBoundingClientRect().height)}})()`);
      const P8 = XRS.print - 1, ps = XRS.steps[P8], w8 = want(P8);
      check(`${W}: in print, the still of step ${XRS.print} (${ps.num} ${ps.unit}) with its sentence, ${w8.nw} wine squares beyond the ${w8.rects - w8.nw} before it, in place of the live parts`, pv.live === 'none' && pv.still === 'grid' && pv.list === 'none' && pv.h > 150 && /^Figure 10\.3/.test(pv.k) && pr.num === ps.num && q(pr.cap) === q(ps.cap) && q(pr.src) === srcOf(ps) && pr.rects === w8.rects && pr.nw === w8.nw && pr.key === `Added beyond ${XRS.steps[P8 - 1].num} ${XRS.steps[P8 - 1].unit}`, JSON.stringify({ pv, pr }));
      await t.s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    // motion: the squares a step adds grow in; ?step= opens on a step with the figure in view
    {
      const t = await open(chrome, `${BASE}/advanced-packaging/?step=5`, { width: 1440, motion: true, wait: 2500 });
      const d = await t.ev(XRREAD('.xr-panel.lv-screen')), top = await t.ev(`Math.round(document.querySelector('${XR}').getBoundingClientRect().top)`), w5 = want(4);
      check('10.3 ?step=5 opens on step 5 (5.5 reticle fields) with the figure in view, drawn as a click-through draws it', d.of === '5 of 8' && d.num === '5.5' && d.rects === w5.rects && d.nw === w5.nw && top >= 0 && top < 450, JSON.stringify({ d, top }));
      await t.ev(`(document.querySelector('${XR} .xr-next').click(),1)`); await sleep(60);
      const g = await t.ev(XRREAD('.xr-panel.lv-screen'));
      check('10.3 motion: the squares the step adds grow in (xr-in), and only those', g.grow === g.nw && g.nw === want(5).nw && g.anim === 'xr-in', JSON.stringify(g));
      check('10.3 motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
    {
      const t = await open(chrome, `${BASE}/advanced-packaging/?step=3`, { width: 390, theme: 'dark', wait: 2500 });
      const r = await t.ev(XRREAD('.xr-panel.lv-screen'));
      check('10.3 dark 390: the squares take the dark palette', r.newFill === 'rgba(217, 138, 149, 0.46)' && r.oldFill === 'rgba(232, 231, 227, 0.1)', JSON.stringify(r));
      const s = await t.ev(SIZES(XR));
      check('10.3 dark 390: labels 11.5 px or more, no sideways scroll', s.min >= 11.5 && s.wide <= 0, JSON.stringify(s));
      check('10.3 dark 390: no page errors', !t.errors.length, t.errors.join(' | '));
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
