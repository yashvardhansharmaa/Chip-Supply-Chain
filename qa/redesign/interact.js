#!/usr/bin/env node
/* The home page's hero, driven as a reader would (27 Oct 2026: the hero set back to the home's structure before the
   redesign, qa/redesign/stage-home.md). The chain at a glance lists the stages, one row each: the name links to its
   chapter, and the band's meter and word (one button) pick the stage's specimen for the stage beside it. Checked here, with
   DevTools mouse and key events rather than script clicks:
     - the counts and the sentence are the data's own (paragraphs = the walk's steps, the stage count, the Extreme count);
     - every row's link goes to its chapter (static href and data-route) and is named as that chapter is;
     - every row's button puts that chapter's specimen on the stage with its number and title, and marks that row alone;
     - hovering a meter picks it after a moment; crossing a name does not;
     - the keyboard: one button in the Tab order, Tab runs name, button, next name; the arrow keys, Home and End move and pick;
     - a click on a name opens the chapter, and Back returns to the home;
     - a pick while the walk's first step has crossed the probe still shows on the stage (Sections.hold);
     - the removed parts are gone (the bar chart, the hero's search field, the two link blocks) and the masthead search opens.
   usage: node qa/redesign/interact.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8766').replace(/\/$/, '');
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`); if (!ok) bad++; };
  try {
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/#/', { width, wait: 2500 });
      const tag = () => t.ev("(document.getElementById('stage-tag-text')||{}).textContent||''");
      const key = async (k, code, vk, mods) => {
        await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods || 0 });
        await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods || 0 }); await sleep(250);
      };
      // the centre of an element, brought into view first if it is not on screen clear of the masthead and the phone's strip
      const at = async (sel, i) => t.ev(`(function(){var e=document.querySelectorAll(${JSON.stringify(sel)})[${i || 0}],r=e.getBoundingClientRect(),top=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||64;if(r.top<top+8||r.bottom>innerHeight-170){e.scrollIntoView({block:'center'});r=e.getBoundingClientRect();}return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()`);
      const move = async (p) => { await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y }); };
      const click = async (p) => {
        await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y });
        await t.s('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
        await t.s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
      };
      const shownRows = () => t.ev("[...document.querySelectorAll('.wk-gl-list li.is-shown')].map(li => li.querySelector('.wk-gl-n').textContent).join(',')");

      // the hero as built
      const facts = await t.ev(`(function(){
        var rows = [...document.querySelectorAll('.wk-gl-list li')];
        return { rows: rows.length, x: rows.filter(r => r.dataset.level === '4').length, steps: document.querySelectorAll('.wk-step').length,
          meta: document.querySelector('.wk-meta').textContent, sentence: document.querySelector('.wk-gl-p').textContent,
          kicker: document.querySelector('.wk-gl-h').textContent, title: document.querySelector('.wk-title').textContent,
          gone: ['.wk-ev', '.wk-stops', '.wk-stop', '#wk-q', '.wk-find', '.wk-way', '.wk-legend'].filter(s => document.querySelector(s)) };
      })()`);
      check(`${width}: the title, then the counts of the read`, facts.title === 'How AI chips are made' && new RegExp('^' + facts.steps + ' paragraphs[\\d,]+ wordsabout \\d+ min$').test(facts.meta), facts.meta);
      check(`${width}: the kicker and the sentence, computed`, facts.kicker === 'The chain at a glance' && facts.sentence.startsWith(`${facts.x} of the ${facts.rows} stages are rated Extreme, meaning `), facts.sentence);
      check(`${width}: fourteen rows, seven Extreme`, facts.rows === 14 && facts.x === 7, facts.rows + ' rows, ' + facts.x + ' Extreme');
      check(`${width}: the bar chart, the hero's search field and the two link blocks are gone`, !facts.gone.length, facts.gone.join(' '));

      // the stage opens on chip design, its row the one marked
      check(`${width}: the stage opens on 01 Chip Design`, /01 · Chip Design/.test(await tag()), await tag());
      check(`${width}: row 01 alone is marked`, (await shownRows()) === '01', await shownRows());
      check(`${width}: Tab reaches the list before the specimen`, await t.ev("!!(document.querySelector('.wk-gl-list').compareDocumentPosition(document.getElementById('stage-canvas')) & Node.DOCUMENT_POSITION_FOLLOWING)"));
      if (width > 900) {
        const gap = await t.ev("(function(){var c=document.getElementById('stage-canvas').getBoundingClientRect(),e=CP.Stage.reach(CP.Stage.cur),g=document.querySelector('.stage .stage-tag').getBoundingClientRect();return Math.round(g.top-(c.top+e.bottom));})()");
        check(`${width}: the caption sits right under the drawing`, gap >= 0 && gap <= 40, gap + ' px between the drawing\'s lowest point and the caption');
      }

      // every link goes to its chapter, named as the chapter is
      const links = await t.ev(`[...document.querySelectorAll('.wk-gl-list li')].map(function (li) {
        var a = li.querySelector('a.wk-gl-a'), id = (a.getAttribute('data-route') || '').replace(/^#/, ''), art = document.getElementById(id);
        var h = art && art.querySelector('.ch-title'), name = h ? h.textContent.replace(/^Chapter \\d+: /, '') : '';
        return { id: id, href: a.getAttribute('href'), t: li.querySelector('.wk-gl-t').textContent, name: name, spec: art ? art.getAttribute('data-specimen') : '' };
      })`);
      const badLinks = links.filter((l) => !l.id || l.href !== l.id + '/' || l.t !== l.name);
      check(`${width}: every name links to its chapter (href and data-route) and is named as it`, !badLinks.length, badLinks.map((l) => l.t + ' -> ' + l.href + ' / #' + l.id + ' (' + l.name + ')').join('; '));

      // every button picks its stage's specimen, by a real click, and marks its row alone
      const wrong = [];
      for (let i = 0; i < links.length; i++) {
        await click(await at('.wk-gl-c', i)); await sleep(350);
        const n = String(i + 1).padStart(2, '0'), tg = await tag(), cur = await t.ev("(CP.Stage.cur||{}).name||''"), rows = await shownRows();
        if (!tg.includes(n + ' · ' + links[i].t) || cur !== links[i].spec || rows !== n) wrong.push(`${n}: tag "${tg}", specimen ${cur} (want ${links[i].spec}), marked ${rows}`);
      }
      check(`${width}: every row's meter puts its own specimen on the stage and marks that row alone`, !wrong.length, wrong.join('; '));

      // hover (a laptop): resting on a meter picks it; crossing a name does not
      if (width > 900) {
        await t.ev('(window.scrollTo(0,0), 1)'); await sleep(300);
        await move(await at('.wk-gl-t', 5)); await sleep(400);
        check(`${width}: resting on a name does not pick`, /14 · Data Centers/.test(await tag()), await tag());
        await move(await at('.wk-gl-c', 4)); await sleep(60); await move(await at('.wk-gl-c', 5)); await sleep(400);
        check(`${width}: resting on a meter picks it; passing over one does not`, /06 · Deposition/.test(await tag()) && (await shownRows()) === '06', await tag());
      }

      // the keyboard
      await t.ev("(window.scrollTo(0,0), document.querySelectorAll('.wk-gl-a')[1].focus(), 1)");
      await key('Tab', 'Tab', 9);
      const after2 = await t.ev("document.activeElement.className + ' ' + (document.activeElement.textContent||'').trim().slice(0,30)");
      check(`${width}: Tab from a name goes to the next name when its row is not picked`, /wk-gl-a/.test(after2) && /03/.test(after2), after2);
      check(`${width}: one meter in the Tab order, the picked one`, await t.ev("[...document.querySelectorAll('.wk-gl-c')].filter(b => b.tabIndex === 0).length === 1 && document.querySelector('.wk-gl-c[tabindex=\"0\"]').getAttribute('aria-pressed') === 'true'"));
      const picked = await t.ev("[...document.querySelectorAll('.wk-gl-c')].findIndex(b => b.tabIndex === 0)");
      await t.ev(`(document.querySelectorAll('.wk-gl-a')[${picked}].focus(), 1)`);
      await key('Tab', 'Tab', 9);
      check(`${width}: Tab from the picked row's name reaches its meter`, await t.ev(`document.activeElement === document.querySelectorAll('.wk-gl-c')[${picked}]`));
      await key('Home', 'Home', 36);
      check(`${width}: Home picks 01 and focuses it`, /01 · Chip Design/.test(await tag()) && await t.ev("document.activeElement === document.querySelectorAll('.wk-gl-c')[0]"), await tag());
      await key('ArrowDown', 'ArrowDown', 40);
      check(`${width}: ArrowDown moves to 02, picks it and focuses it`, /02 · Silicon/.test(await tag()) && await t.ev("document.activeElement === document.querySelectorAll('.wk-gl-c')[1]") && (await shownRows()) === '02', await tag());
      await key('End', 'End', 35);
      check(`${width}: End picks 14`, /14 · Data Centers/.test(await tag()) && (await shownRows()) === '14', await tag());
      await key('ArrowUp', 'ArrowUp', 38);
      check(`${width}: ArrowUp moves back to 13`, /13 · Systems/.test(await tag()), await tag());
      await key('Tab', 'Tab', 9);
      check(`${width}: Tab from the meter goes on to the next name`, await t.ev("document.activeElement === document.querySelectorAll('.wk-gl-a')[13]"), await t.ev("document.activeElement.className"));
      await key('Enter', 'Enter', 13); await sleep(1500);
      check(`${width}: Enter on a name opens its chapter`, await t.ev("location.hash === '#data-centers-and-power' && !document.querySelector('.view[data-view=\"stack\"]').hidden"), await t.ev('location.hash'));
      await t.ev('(history.back(), 1)'); await sleep(1500);
      check(`${width}: Back returns to the home`, await t.ev("!document.querySelector('.view[data-view=\"walk\"]').hidden"), await t.ev('location.hash'));

      // a mouse click on a name opens the chapter
      await t.ev('(window.scrollTo(0,0), 1)'); await sleep(300);
      await click(await at('.wk-gl-t', 3)); await sleep(1500);
      check(`${width}: a click on a name opens its chapter`, await t.ev("location.hash === '#lithography' && !document.querySelector('.view[data-view=\"stack\"]').hidden"), await t.ev('location.hash'));
      await t.ev("(location.hash = '#/', 1)"); await sleep(1200);

      // a pick once the walk's first step has crossed the probe still shows (Sections.hold); scrolling past the hero gives the stage back
      const yStep = await t.ev("(function(){var vh=innerHeight,probe=CP.narrow()?vh*0.55:vh*0.42,s=document.querySelector('.wk-step').getBoundingClientRect().top+scrollY;return Math.round(s-probe+30);})()");
      await t.ev(`(document.documentElement.style.scrollBehavior='auto', window.scrollTo(0, ${yStep}), 1)`); await sleep(600);
      const tagWalk = await tag();
      const lastShown = await t.ev("(function(){var r=document.querySelectorAll('.wk-gl-c')[12].getBoundingClientRect();return r.top > parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead')) && r.bottom < innerHeight;})()");
      if (lastShown) {
        const p = await t.ev("(function(){var r=document.querySelectorAll('.wk-gl-c')[12].getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()");
        await click(p); await sleep(400);
        check(`${width}: with the walk begun under it, a pick still shows`, /13 · Systems/.test(await tag()) && (await shownRows()) === '13', `before: ${tagWalk}; after: ${await tag()}`);
        await t.ev("(window.scrollTo(0, document.querySelector('.wk-step:nth-child(3)').getBoundingClientRect().top + scrollY - 200), 1)"); await sleep(600);
        check(`${width}: past the hero the walk has the stage again`, !/13 · Systems/.test(await tag()), await tag());
      } else check(`${width}: with the walk begun under it, a pick still shows`, true, 'no row on screen there at this width (skipped)');

      // search from the masthead
      await t.ev('(window.scrollTo(0,0), 1)'); await sleep(300);
      await click(await t.ev("(function(){var r=document.querySelector('.search-btn').getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};})()")); await sleep(500);
      check(`${width}: the masthead search opens`, await t.ev("!document.getElementById('cp-search').hidden"));
      await key('Escape', 'Escape', 27);

      t.errors.forEach((e) => check(`${width}: page error`, false, e));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n')); console.log(bad ? `\n${bad} failed` : '\nall passed'); process.exit(bad ? 1 : 0);
})();
