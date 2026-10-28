#!/usr/bin/env node
/* The chapter page's controls (redesign stage 2), driven as a reader would, in The Chain and on the readable pages:
   - the opener is the column (design round five, 27 Oct 2026): the rail beside the kicker from the top, the card's verdict in
     the kicker, the specimen a plate at the measure fitted to its drawing (--draw-h, --lift), the card in the text after the
     lead and before section 01, at the measure, and On this page lands on it;
   - the live drawing moves into the slot of the chapter in view, Lithography's four balloons ride on it, and the caption
     stands on the drawing's foot (--slack);
   - the contents rail marks the section the reader is in, and its links land;
   - a figure's Cite opens its citation, Table swaps the bars for the rows and back, CSV is a download, PNG saves a picture;
   - chapters 15 and 16 (the two that are not stages) draw on the night ground, which fills the drawing's slot, the caption on the page under it (each
     chapter shows alone at its address, so the check goes there by its address);
   - on a phone the drawing stays in the strip, the masthead goes up on the way down and back on the way up, and the slim
     bar names the chapter and the section;
   - the readable page has the same opener, rail, card and figure strip, with Lithography's still and no app buttons;
   - Hide contents (27 Oct 2026), in the app and on the readable page: Tab reaches it after the chapter's head, Enter hides the
     rail and moves focus to Show contents, the text column then sits in the middle of the page at 666 px with the figures, Show
     contents stays in view down the page, a reload keeps the rail hidden, Enter on Show contents brings it back with focus on
     Hide contents; under 1200 px neither button shows and the rail's line of links stays; print shows neither.
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
      // the column: the rail from the top, the verdict, the plate and the card at the measure, the card after the lead
      const col = await t.ev(`(function(){var a=document.getElementById('lithography'),q=function(s){return a.querySelector(s);},r=function(s){return q(s).getBoundingClientRect();};
        var card=q('.prose > .plate'),prev=card&&card.previousElementSibling,next=card&&card.nextElementSibling,sp=getComputedStyle(q('.ch-spec'));
        return {railTop:Math.round(r('.ch-rail .rail-on > .rail-k').top),kickTop:Math.round(r('.ch-kick').top),kick:q('.ch-kick').textContent,textX:Math.round(r('.ch-lede').left),specX:Math.round(r('.ch-spec').left),specW:Math.round(r('.ch-spec').width),
          cardW:card?Math.round(card.getBoundingClientRect().width):0,revW:q('.prose > .review')?Math.round(q('.prose > .review').getBoundingClientRect().width):-1,cardId:card&&card.id,prev:prev&&prev.tagName,next:next&&next.id,inHead:!!q('.chapter-head .plate'),
          drawH:sp.getPropertyValue('--draw-h').trim(),lift:sp.getPropertyValue('--lift').trim(),toc:[].map.call(a.querySelectorAll('.rail-toc a'),function(x){return x.textContent;}).slice(0,3).join(' | ')};})()`);
      check('1440: the rail starts beside the kicker (its first line, On this page)', Math.abs(col.railTop - col.kickTop) <= 4, `rail ${col.railTop}, kicker ${col.kickTop}`);
      check('1440: the kicker carries the card\'s verdict', /Extreme concentration\s*·\s*Very hard to substitute/.test(col.kick), col.kick);
      check('1440: the specimen is a plate at the measure, in the text column', col.specW === 666 && col.specX === col.textX, `${col.specW} px at x ${col.specX}, text at ${col.textX}`);
      check('1440: the plate is fitted to its drawing (--draw-h, --lift)', /^\d+px$/.test(col.drawH) && /^\d+px$/.test(col.lift), `--draw-h ${col.drawH}, --lift ${col.lift}`);
      check('1440: the card is in the text after the lead, before section 01, as wide as the flashcards (owner, 27 Oct) and wider than the text', !col.inHead && col.prev === 'P' && col.next === 'lithography--how-it-works' && col.cardW === col.revW && col.cardW > 666 && col.cardId === 'lithography--card', JSON.stringify({ prev: col.prev, next: col.next, w: col.cardW, flashcards: col.revW }));
      check('1440: On this page lists the card after In plain terms', col.toc === 'In plain terms | Chokepoint card | How it works', col.toc);
      // the band's meter (28 Oct 2026, in place of the single mark): Extreme lights its four bars in wine in the kicker, the card
      // and the rail; High lights three in the mid gray, the fourth in the hairline; each meter is hidden from assistive technology
      const marks = await t.ev(`(function(){var a=document.getElementById('lithography'),m=function(sel){var e=a.querySelector(sel);if(!e)return null;return [].map.call(e.querySelectorAll('b'),function(b){return getComputedStyle(b).backgroundColor;}).join(' ')+(e.getAttribute('aria-hidden')==='true'?'':' NOT HIDDEN');};
        return {kick:m('.ch-band[data-band="4"] .meter'),card:m('.plate-kpis .meter[data-level="4"]'),rail:m('.ch-rail .stage-cell[data-band="4"] .meter'),
          high:m('.ch-rail .stage-cell[data-band="3"] .meter'),meta:getComputedStyle(a.querySelector('.ch-meta .label')).fontFamily,kickT:getComputedStyle(a.querySelector('.ch-kick')).textTransform};})()`);
      const W4 = 'rgb(122, 31, 43) rgb(122, 31, 43) rgb(122, 31, 43) rgb(122, 31, 43)', H3 = 'rgb(140, 138, 132) rgb(140, 138, 132) rgb(140, 138, 132) rgb(225, 224, 219)';
      check('1440: Extreme lights all four bars of the meter in wine in the kicker, the card and the rail; High lights three in gray', marks.kick === W4 && marks.card === W4 && marks.rail === W4 && marks.high === H3, JSON.stringify(marks));
      check('1440: the kicker and the facts line are Hanken Grotesk capitals, not Fragment Mono', /^"?Hanken Grotesk/.test(marks.meta) && marks.kickT === 'uppercase', JSON.stringify(marks));
      await t.ev("document.querySelector('#lithography .rail-toc a[href=\"#lithography--card\"]').click(),1"); await sleep(1200);
      const land = await t.ev("(function(){var c=document.getElementById('lithography--card').getBoundingClientRect();return {top:Math.round(c.top),hash:location.hash,cur:(document.querySelector('#lithography .rail-toc a[aria-current]')||{}).textContent};})()");
      check('1440: Chokepoint card in the rail lands on the card, clear of the masthead', land.top >= 64 && land.top <= 100 && land.cur === 'Chokepoint card', JSON.stringify(land));
      // the card's look-up cards: a term in its text, and a rating (its band's sentence and this stage's test)
      for (const [sel, what] of [['#lithography--card .gl-term:not([data-note])', 'a term'], ['#lithography--card .v-btn[data-term="substitutability"]', 'the substitutability rating']]) {
        const lab = await t.ev(`(function(){var b=document.querySelector(${JSON.stringify(sel)});if(!b)return null;document.documentElement.style.scrollBehavior='auto';b.scrollIntoView({block:'center'});b.focus();return b.textContent;})()`); await sleep(500);
        const tip = await t.ev("(function(){var e=document.getElementById('gl-tip');return e&&!e.hidden?e.querySelector('b').textContent:null;})()");
        check(`1440: ${what} in the card opens its look-up card`, !!lab && !!tip, `${lab} -> ${tip}`);
        await t.ev("(document.activeElement && document.activeElement.blur(), 1)");
      }
      await t.ev("(document.documentElement.style.scrollBehavior='auto', window.scrollTo(0,0), 1)"); await sleep(600);
      check('1440: the parts list names the four parts', await t.ev("[].map.call(document.querySelectorAll('#lithography .ch-spec .ch-parts li > span'),function(l){return l.textContent}).join(' | ')") === 'Light source: ASML San Diego (US), laser by Trumpf (DE) | Mirrors: Zeiss SMT (DE) | Mask: see stage 05, Photomasks and Pellicles | Wafer: see stage 02, Silicon and Wafers');
      await scrollTo(t, '#lithography--how-it-works', 200);
      check('1440: the rail marks How it works', await t.ev("(document.querySelector('#lithography .rail-toc a[aria-current]')||{}).textContent") === 'How it works', await t.ev("(document.querySelector('#lithography .rail-toc a[aria-current]')||{}).textContent"));
      check('1440: the rail stays in view (sticky)', await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail').getBoundingClientRect();return r.top>=0&&r.top<200;})()"));
      check('1440: the rail fits the window', await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail');return r.scrollHeight<=r.clientHeight+1;})()"), await t.ev("(function(){var r=document.querySelector('#lithography .ch-rail');return r.scrollHeight+' in '+r.clientHeight;})()"));
      // a figure: Cite, Table, CSV, PNG
      const F = '#fig-lithography-asml-region';
      await scrollTo(t, F, 140);
      check('1440: the figure is numbered 04.5', await t.ev(`document.querySelector('${F} .fig-k').textContent`) === 'Figure 04.5');
      check('1440: the chart rule, the largest bar wine, the rest the tint', await t.ev(`(function(){var b=[].map.call(document.querySelectorAll('${F} .hb-r i'),function(i){return getComputedStyle(i).backgroundColor});return b[0]==='rgb(122, 31, 43)'&&b.slice(1).every(function(c){return c==='rgb(210, 209, 204)'});})()`),
        await t.ev(`[].map.call(document.querySelectorAll('${F} .hb-r i'),function(i){return getComputedStyle(i).backgroundColor}).join(' ')`));
      // the chart rule as amended on 28 Oct 2026 (page revisions 4 and 5): wine on the marked value only (the value the title
      // names, else the largest), in the bar's fill or, for a range, its solid part and hatch; columns and change rows likewise
      check('1440: in every chapter, wine on the marked bar, column or change only', await t.ev("(function(){var W='rgb(122, 31, 43)',wine=function(e){var c=getComputedStyle(e);return c.backgroundColor===W||c.backgroundImage.indexOf(W)>=0;};return [].every.call(document.querySelectorAll('.chapter .hb'),function(r){var i=r.querySelector('.hb-r i'),c=getComputedStyle(i).backgroundColor;return r.classList.contains('top')?wine(i):!wine(i)&&c!=='rgb(168, 65, 75)';})&&[].every.call(document.querySelectorAll('.chapter .cols-plot .col'),function(r){return r.classList.contains('top')===wine(r.querySelector('i'));})&&[].every.call(document.querySelectorAll('.chapter .cg-row:not(.cg-axis)'),function(r){return r.classList.contains('top')===(getComputedStyle(r.querySelector('.cg-arrow')).backgroundColor===W);});})()"));
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
      // chapters 15 and 16: the night ground, in the drawing's slot; the caption stands under it on the page's ground
      for (const id of ['component-costs', 'geopolitics']) {
        await t.ev(`location.hash='#${id}',1`); await sleep(1800);
        check(`1440: the drawing moves to ${id}'s slot`, await t.ev(`!!document.querySelector('#${id} .ch-spec-draw canvas')`));
        const night = await t.ev(`(function(){var d=document.querySelector('#${id} .ch-spec-draw'),c=document.querySelector('#${id} .ch-spec-cap');return {slot:getComputedStyle(d).backgroundColor,cap:getComputedStyle(c).backgroundColor,capInk:getComputedStyle(c.querySelector('p')).color,dark:CP.Stage.dark,inside:c.getBoundingClientRect().top>=d.getBoundingClientRect().bottom};})()`);
        check(`1440: ${id} draws on the night ground, its caption under it on the page`, night.slot === 'rgb(18, 18, 17)' && night.dark === true && night.cap === 'rgba(0, 0, 0, 0)' && night.capInk === 'rgb(69, 68, 63)' && night.inside, JSON.stringify(night));
      }
      await t.ev("location.hash='#lithography',1"); await sleep(1800);
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
    /* ---------- the card's own address, on a fresh load, at 1440 and 390 ---------- */
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/#lithography--card', { width, wait: 3500 });
      const r = await t.ev("(function(){var c=document.getElementById('lithography--card').getBoundingClientRect(),m=document.querySelector('.masthead').getBoundingClientRect();return {top:Math.round(c.top),mast:Math.round(m.bottom),shown:[].filter.call(document.querySelectorAll('article.chapter'),function(a){return a.getClientRects().length;}).map(function(a){return a.id;}).join(',')};})()");
      check(`${width}: #lithography--card opens Lithography at its card, clear of the masthead`, r.shown === 'lithography' && r.top >= 0 && r.top <= 140, JSON.stringify(r));
      await t.close();
    }
    /* ---------- a Glossary passage on a card lands on it, in the text after the lead ---------- */
    {
      const t = await open(chrome, BASE + '/#/glossary', { width: 1440, wait: 3000 });
      await t.ev(`(function () { var b = [].filter.call(document.querySelectorAll('#gl-dict .gl-de[data-kind="term"] button[data-open]'), function (b) { return /^EUV|^Extreme ultraviolet/i.test(b.textContent); })[0]; b.click(); return 1; })()`); await sleep(1500);
      const para = await t.ev(`(function () { var as = document.querySelectorAll('#gl-sheet .lk-men a[data-para]'); for (var i = 0; i < as.length; i++) { var p = CP.Lookup.paras[+as[i].getAttribute('data-para')]; if (p && p.el.closest('.prose > .plate')) { as[i].id = 'qa-card-pass'; return +as[i].getAttribute('data-para'); } } return null; })()`);
      if (para != null) { await t.ev("(document.getElementById('qa-card-pass').click(), 1)"); await sleep(2200); }
      const p = para == null ? null : await t.ev(`(function () { var p = CP.Lookup.paras[${para}], r = p.el.getBoundingClientRect(); return { chapter: p.chapter, text: p.text.slice(0, 50), top: Math.round(r.top), hash: location.hash, shown: !!document.getElementById(p.chapter).getClientRects().length, flash: p.el.classList.contains('lk-flash') }; })()`);
      check('1440: a Glossary passage on a card (EUV\'s) lands on the card', !!p && p.shown && p.top > 60 && p.top < 900 && p.flash, JSON.stringify(p));
      t.errors.forEach((e) => check('1440 glossary: page error', false, e));
      await t.close();
    }
    /* ---------- The Chain on a phone ---------- */
    {
      const t = await open(chrome, BASE + '/#lithography', { width: 390, wait: 3000 });
      check('390: the drawing stays in the strip', await t.ev("!!document.querySelector('.stage > canvas#stage-canvas') && getComputedStyle(document.querySelector('.stage')).display!=='none'"));
      // the strip (page revision 2, 28 Oct 2026): 64 px at the foot, a 52 px thumbnail, the specimen's name over what a tap
      // opens, Contents at the right; the caption, Top and Expand are gone from it, and a tap anywhere else opens it
      const strip = await t.ev(`(function(){var s=document.querySelector('.stage'),r=s.getBoundingClientRect(),c=s.querySelector('canvas').getBoundingClientRect(),tag=s.querySelector('.stage-tag'),m=s.querySelector('.stage-menu').getBoundingClientRect(),hit=document.elementFromPoint(m.left+m.width/2,m.top+m.height/2),vis=function(sel){var e=s.querySelector(sel);return !!e&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0;};
        return {h:Math.round(r.height),bottom:Math.round(r.bottom),vh:innerHeight,thumb:Math.round(c.width)+'x'+Math.round(c.height),text:tag.innerText.replace(/\\s+/g,' ').trim(),font:getComputedStyle(tag).fontFamily.split(',')[0]+' '+getComputedStyle(tag).fontSize,cap:vis('figcaption'),top:vis('.stage-top'),hit:hit&&hit.className};})()`);
      check('390: the strip is 64 px at the foot of the screen', strip.h === 64 && strip.bottom === strip.vh, JSON.stringify(strip));
      check('390: a 52 px live thumbnail', strip.thumb === '52x52', strip.thumb);
      check('390: the strip reads "Specimen 04 · EUV scanner" over "Tap for the drawing and its parts", in Hanken Grotesk 13 px', strip.text === 'Specimen 04 · EUV scanner Tap for the drawing and its parts' && /Hanken/.test(strip.font) && /13px/.test(strip.font), strip.text + ' / ' + strip.font);
      check('390: the caption and Top are not in the strip', !strip.cap && !strip.top);
      check('390: the strip\'s Contents takes a tap', /stage-menu/.test(strip.hit || ''), strip.hit);
      check('390: the masthead is down after the landing', await t.ev("!document.documentElement.classList.contains('mast-up')"));
      await t.ev("(document.documentElement.style.scrollBehavior='auto', window.scrollBy(0, 900), 1)"); await sleep(250);
      await t.ev("(window.scrollBy(0, 200), 1)"); await sleep(500);
      check('390: scrolling down raises the masthead', await t.ev("document.documentElement.classList.contains('mast-up') && document.querySelector('.masthead').getBoundingClientRect().bottom <= 1"));
      check('390: the slim bar names the chapter and the section', await t.ev("document.documentElement.classList.contains('slim-on') && /04\\s*Lithography/.test(document.querySelector('.ch-slim').textContent)"), await t.ev("(document.querySelector('.ch-slim')||{}).textContent"));
      await t.ev("(window.scrollBy(0, -60), 1)"); await sleep(500);
      check('390: scrolling up brings the masthead back, the slim bar under it', await t.ev("!document.documentElement.classList.contains('mast-up') && Math.abs(document.querySelector('.ch-slim').getBoundingClientRect().top - document.querySelector('.masthead').getBoundingClientRect().bottom) < 2"));
      // a tap on the strip's words opens it (the clear Expand button over the strip takes it)
      const tap = await t.ev("(function(){var r=document.querySelector('.stage .stage-tag').getBoundingClientRect(),e=document.elementFromPoint(r.left+20,r.top+r.height/2);if(e)e.click();return e&&e.className;})()"); await sleep(600);
      check('390: a tap on the strip opens it', await t.ev("document.querySelector('.stage').getAttribute('data-collapsed')==='0'"), tap);
      check('390: the expanded strip lists the parts', await t.ev("(function(){var p=document.querySelector('.stage figcaption .stage-parts');return !!p&&getComputedStyle(p).display!=='none'&&/Light source/.test(p.textContent);})()"));
      await t.ev("document.querySelector('.stage-toggle').click(),1"); await sleep(300);
      check('390: Collapse closes it again', await t.ev("document.querySelector('.stage').getAttribute('data-collapsed')==='1'"));
      // the wine rule on the strip's top edge fills as the chapter is read
      const r0 = await t.ev("+getComputedStyle(document.querySelector('.stage')).getPropertyValue('--read')");
      await t.ev("(window.scrollBy(0, 3000), 1)"); await sleep(600);
      const r1 = await t.ev("+getComputedStyle(document.querySelector('.stage')).getPropertyValue('--read')");
      check('390: the strip\'s wine rule fills with the share of the chapter read', r1 > r0 && r1 > 0 && r1 < 1, `${r0} -> ${r1}`);
      t.errors.forEach((e) => check('390: page error', false, e));
      await t.close();
    }
    /* ---------- the readable page ---------- */
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/lithography/', { width, wait: 2500 });
      check(`page ${width}: no button from the app`, await t.ev("!document.querySelector('main button:not(.fs-tab):not(.fs-png):not(.ch-cite-copy):not(.rail-tog)')"));
      check(`page ${width}: the opener's kicker`, /Chapter 04\s*Stage 4 of 14\s*Extreme/.test(await t.ev("document.querySelector('.ch-kick').textContent")), await t.ev("document.querySelector('.ch-kick').textContent"));
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
    /* ---------- Hide contents, in The Chain and on the readable page ---------- */
    const enter = async (t) => { await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(500); };
    const tab = async (t) => { await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await sleep(250); };
    // the state of the rail of the chapter on screen: which button shows, where the text and a figure sit, what has focus
    const RS = `(function(){var a=[].filter.call(document.querySelectorAll('article.chapter'),function(x){return x.getClientRects().length;})[0];if(!a)return null;
      var n=a.querySelector('.ch-rail'),b=n.querySelector('.rail-body'),h=n.querySelector('.rail-hide'),s=n.querySelector('.rail-show'),vis=function(e){return !!e&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';};
      var p=a.querySelector('.prose > p'),f=a.querySelector('.prose .figure'),o=a.querySelector('.ch-lede'),act=document.activeElement;
      var st=null;try{st=localStorage.getItem('cp-rail');}catch(e){}
      return {off:document.documentElement.classList.contains('rail-off'),body:vis(b),hide:vis(h),show:vis(s),hideExp:h&&h.getAttribute('aria-expanded'),showExp:s&&s.getAttribute('aria-expanded'),
        ctl:h&&h.getAttribute('aria-controls')===b.id&&s.getAttribute('aria-controls')===b.id,focus:act===h?'hide':act===s?'show':(act&&act.tagName),stored:st,
        textX:Math.round(o.getBoundingClientRect().left),textW:Math.round(p.getBoundingClientRect().width),figX:f?Math.round(f.getBoundingClientRect().left):null,figW:f?Math.round(f.getBoundingClientRect().width):null,mid:Math.round((innerWidth-666)/2),
        showTop:s?Math.round(s.getBoundingClientRect().top):null};})()`;
    for (const [where, url] of [['chain', '/#lithography'], ['page', '/lithography/']]) {
      const t = await open(chrome, BASE + url, { width: 1440, wait: 2500 });
      await t.ev("(function(){try{localStorage.removeItem('cp-rail');}catch(e){}document.documentElement.classList.remove('rail-off');return 1;})()");
      let r = await t.ev(RS);
      check(`${where} 1440: the rail shows by default, with Hide contents and no Show contents`, r.body && r.hide && !r.show && r.hideExp === 'true' && r.showExp === 'false' && r.ctl, JSON.stringify(r));
      const prevX = r.textX;
      // Tab from the last control of the chapter's head lands on Hide contents
      await t.ev("(function(){var a=[].filter.call(document.querySelectorAll('article.chapter'),function(x){return x.getClientRects().length;})[0];var f=[].filter.call(a.querySelectorAll('.chapter-head a[href], .chapter-head button, .chapter-head [tabindex=\"0\"], .chapter-head canvas[tabindex]'),function(e){return e.getClientRects().length&&!e.closest('[hidden]');});var last=f[f.length-1];document.documentElement.style.scrollBehavior='auto';last.focus();return last.tagName+'.'+last.className;})()");
      await tab(t);
      r = await t.ev(RS);
      check(`${where} 1440: Tab after the chapter's head reaches Hide contents`, r.focus === 'hide', r.focus);
      await enter(t);
      r = await t.ev(RS);
      check(`${where} 1440: Enter hides the rail, and focus moves to Show contents`, r.off && !r.body && !r.hide && r.show && r.focus === 'show' && r.showExp === 'false', JSON.stringify(r));
      check(`${where} 1440: the text column moves to the middle at 666 px, the figures with it`, Math.abs(r.textX - r.mid) <= 2 && r.textW === 666 && r.figW === 666 && r.figX === r.textX, `text at ${r.textX} (middle ${r.mid}, was ${prevX}), ${r.textW} px; figure at ${r.figX}, ${r.figW} px`);
      check(`${where} 1440: the choice is kept on this device`, r.stored === 'off', r.stored);
      await scrollTo(t, '#lithography--who-makes-it', 200);
      r = await t.ev(RS);
      check(`${where} 1440: Show contents stays in view down the page`, r.show && r.showTop >= 0 && r.showTop < 160, `top ${r.showTop}`);
      await t.ev('(location.reload(), 1)'); await sleep(3500);
      r = await t.ev(RS);
      check(`${where} 1440: after a reload the rail is still hidden`, r && r.off && !r.body && r.show && Math.abs(r.textX - r.mid) <= 2, JSON.stringify(r));
      await t.ev("(function(){var a=[].filter.call(document.querySelectorAll('article.chapter'),function(x){return x.getClientRects().length;})[0];a.querySelector('.rail-show').focus();return 1;})()");
      await enter(t);
      r = await t.ev(RS);
      check(`${where} 1440: Enter on Show contents brings the rail back, focus on Hide contents, the column where it was`, !r.off && r.body && r.hide && !r.show && r.focus === 'hide' && r.stored === null && r.textX === prevX, JSON.stringify(r));
      // a click hides it again, for the narrower and printed checks
      await t.ev("(function(){var a=[].filter.call(document.querySelectorAll('article.chapter'),function(x){return x.getClientRects().length;})[0];a.querySelector('.rail-hide').click();return 1;})()"); await sleep(300);
      await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
      // in print The Chain lays out every chapter, so the check reads Lithography's own article
      const pr = await t.ev("(function(){var a=document.getElementById('lithography')||document.querySelector('article.chapter');return [].map.call(a.querySelectorAll('.rail-tog'),function(b){return getComputedStyle(b).display;}).join(',')+' | '+getComputedStyle(a).gridTemplateColumns;})()");
      check(`${where} print: neither button prints, and the hidden rail does not change the layout (no 666 px middle column)`, /^none,none \|/.test(pr) && !/666px/.test(pr), pr);
      await t.s('Emulation.setEmulatedMedia', { media: 'screen' });
      await t.s('Emulation.setDeviceMetricsOverride', { width: 1024, height: 900, deviceScaleFactor: 1, mobile: false }); await sleep(800);
      r = await t.ev(RS);
      const line = await t.ev("(function(){var a=[].filter.call(document.querySelectorAll('article.chapter'),function(x){return x.getClientRects().length;})[0];return a.querySelectorAll('.rail-toc a').length+' links, '+(a.querySelector('.rail-toc').getClientRects().length?'shown':'hidden');})()");
      check(`${where} 1024: neither button shows, and the rail's line of links stays though it was hidden at 1440`, !r.hide && !r.show && r.body && /shown$/.test(line), `${line}; ${JSON.stringify({ hide: r.hide, show: r.show, body: r.body })}`);
      await t.ev("(function(){try{localStorage.removeItem('cp-rail');}catch(e){}return 1;})()");
      t.errors.forEach((e) => check(`${where} toggle: page error`, false, e));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n')); console.log(bad ? `\n${bad} failed` : '\nall passed'); process.exit(bad ? 1 : 0);
})();
