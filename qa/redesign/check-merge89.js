// The merge of chapters 8 and 9 (27 Oct 2026): the old chapter's addresses land in the merged one (a fresh load of #<old id>, a
// section, a figure, a link followed after boot and Back, the walk's step, the readable page with its anchor, the page without
// scripts, the PDF address), and the merged chapter's specimen, the gate-all-around transistor, draws live and as a still.
// usage, from the repository root: node qa/redesign/check-merge89.js [base, default http://127.0.0.1:8774] <folder for the shot>
const { launch, open, sleep } = require(process.cwd() + '/qa/redesign/cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8774';
(async () => {
  const chrome = launch(); let bad = 0; const out = [];
  const check = (n, ok, d) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${n}${d != null ? ': ' + (typeof d === 'string' ? d : JSON.stringify(d)) : ''}`); if (!ok) bad++; };
  const ST = `(function(){var sh=[].filter.call(document.querySelectorAll('.view[data-view="stack"] > article.chapter'),function(a){return a.getClientRects().length;}).map(function(a){return a.id;});
    var v=(document.querySelector('.view:not([hidden])')||{}).getAttribute; return {hash:location.hash,view:document.documentElement.getAttribute('data-view'),shown:sh,y:Math.round(scrollY)};})()`;
  const off = (id) => `(function(){var e=document.getElementById(${JSON.stringify(id)});return e?(Math.round(e.getBoundingClientRect().top-(parseFloat(getComputedStyle(e).scrollMarginTop)||0))||0):null;})()`;
  try {
    for (const [from, to] of [['transistors-and-front-end', 'foundries-and-fabs'], ['transistors-and-front-end--who-makes-it', 'foundries-and-fabs--who-makes-it'],
      ['transistors-and-front-end--variants-and-trade-offs', 'foundries-and-fabs--the-newest-designs'], ['fig-transistors-and-front-end-node-roadmap', 'fig-foundries-and-fabs-node-roadmap'],
      ['fig-transistors-and-front-end-density-by-node', 'foundries-and-fabs--gate-all-around-nanosheets'], ['foundries-and-fabs--pure-play-foundries', 'foundries-and-fabs--the-foundry-and-the-fab'],
      ['transistors-and-front-end--card', 'foundries-and-fabs--card']]) {
      const t = await open(chrome, BASE + '/#' + from, { width: 1440, wait: 2500 });
      const st = await t.ev(ST), o = await t.ev(off(to));
      check(`fresh load #${from}`, st.hash === '#' + to && st.view === 'stack' && st.shown.join() === 'foundries-and-fabs' && o !== null && (from === 'transistors-and-front-end' ? st.y === 0 : Math.abs(o) <= 4) && !t.errors.length, { ...st, offset: o, errors: t.errors });
      await t.close();
    }
    { // a link followed after boot (hashchange), and Back
      const t = await open(chrome, BASE + '/#lithography', { width: 1440, wait: 2500 });
      await t.ev(`(location.hash = '#transistors-and-front-end--the-chokepoint', 1)`); await sleep(1800);
      const st = await t.ev(ST), o = await t.ev(off('foundries-and-fabs--the-chokepoint'));
      check('after boot, #transistors-and-front-end--the-chokepoint', st.hash === '#foundries-and-fabs--the-chokepoint' && st.shown.join() === 'foundries-and-fabs' && Math.abs(o) <= 4, { ...st, offset: o });
      await t.ev('(history.back(), 1)'); await sleep(1800);
      const b = await t.ev(ST);
      check('...and Back returns to Lithography', b.shown.join() === 'lithography', b);
      await t.close();
    }
    { // the walk step
      const t = await open(chrome, BASE + '/#/walk/transistors-and-front-end', { width: 1440, wait: 2500 });
      const st = await t.ev(ST), o = await t.ev(off('/walk/foundries-and-fabs'));
      check('#/walk/transistors-and-front-end lands on the walk step', st.hash === '#/walk/foundries-and-fabs' && st.view === 'walk' && Math.abs(o) <= 4, { ...st, offset: o });
      await t.close();
    }
    { // the readable page forwards, with its section
      for (const [u, want] of [['/transistors-and-front-end/', '/foundries-and-fabs/'], ['/transistors-and-front-end/#transistors-and-front-end--who-makes-it', '/foundries-and-fabs/#foundries-and-fabs--who-makes-it'],
        ['/transistors-and-front-end/#transistors-and-front-end--sources', '/foundries-and-fabs/#sources']]) {
        const t = await open(chrome, BASE + u, { width: 1440, wait: 1500 });
        const loc = await t.ev('location.pathname + location.hash'), h1 = await t.ev("(document.querySelector('h1')||{}).textContent");
        check(`readable ${u} forwards`, loc === want && /Foundries and Fabs/.test(h1), { loc, h1 });
        await t.close();
      }
    }
    { // without scripts: the meta refresh and the plain link
      const html = await (await fetch(BASE + '/transistors-and-front-end/')).text();
      check('the forward page has a canonical, a meta refresh and a plain link', /<link rel="canonical" href="https:\/\/chipsupplychain.org\/foundries-and-fabs\/">/.test(html) && /http-equiv="refresh" content="0;url=..\/foundries-and-fabs\/"/.test(html) && /<a href="..\/foundries-and-fabs\/">Read Foundries and Fabs<\/a>/.test(html));
      const pdf = await fetch(BASE + '/pdf/transistors-and-front-end.pdf');
      check('the old PDF address answers', pdf.status === 200 && /pdf/.test(pdf.headers.get('content-type') || ''), pdf.status + ' ' + pdf.headers.get('content-type'));
    }
    { // the specimen, live in the app and as the still on the readable page
      const t = await open(chrome, BASE + '/#foundries-and-fabs', { width: 1440, wait: 3500 });
      const sp = await t.ev(`(function(){var c=document.querySelector('#foundries-and-fabs .ch-spec-draw canvas#stage-canvas'),r=c&&c.getBoundingClientRect();
        return {name:window.CP&&CP.Stage&&CP.Stage.cur&&CP.Stage.cur.name,inSlot:!!c,rect:r?[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]:null,kick:(document.querySelector('#foundries-and-fabs .ch-kick')||{}).textContent};})()`);
      await t.shot(process.argv[3] + '/live-spec-1440.png');
      // the drawing's ink in the slot, counted from the screenshot (a WebGL canvas cannot be read back)
      const ink = require('child_process').execFileSync('python3', ['-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("L").crop(tuple(int(v) for v in sys.argv[2:6]))\nprint(sum(1 for v in im.getdata() if v<160))', process.argv[3] + '/live-spec-1440.png', ...sp.rect.map(String)]).toString().trim();
      sp.inked = +ink;
      check('live: the gate-all-around transistor draws in the merged chapter\'s slot', sp.name === 'gaa-transistor' && sp.inSlot && sp.inked > 500, sp);
      check('the kicker reads Chapter 08, Stage 8 of 14', /Chapter 08\s*Stage 8 of 14\s*Extreme concentration/.test(sp.kick), sp.kick);
      await t.close();
      const r = await open(chrome, BASE + '/foundries-and-fabs/', { width: 1440, wait: 2500 });
      const st = await r.ev(`(function(){var i=document.querySelector('.ch-spec img.ch-still-img');return i?{src:i.getAttribute('src'),w:i.naturalWidth,h:i.naturalHeight,done:i.complete,alt:i.alt}:null;})()`);
      check('still: the readable page shows the transistor still', st && /spec-foundries-and-fabs\.webp/.test(st.src) && st.w === 847 && st.h === 908 && /gate-all-around|transistor/i.test(st.alt), st);
      const door = await open(chrome, BASE + '/#metrology-and-inspection', { width: 1440, wait: 2000 });
      const d = await door.ev(`(function(){var a=document.querySelector('#metrology-and-inspection .prevnext .next');var i=a&&a.querySelector('img');return {label:a&&a.querySelector('.label').textContent,t:a&&a.querySelector('.t').textContent,img:i&&i.getAttribute('src'),go:a&&a.querySelector('.go').textContent};})()`);
      check('the door from chapter 07 leads to stage 08 / 14 with the transistor still', d.label === 'Next, stage 08 / 14' && d.t === 'Foundries and Fabs' && /spec-foundries-and-fabs/.test(d.img) && /chapter 08/.test(d.go), d);
      await r.close(); await door.close();
    }
  } catch (e) { out.push('ERROR ' + e.message); bad++; }
  await chrome.close();
  console.log(out.join('\n')); console.log(bad ? `${bad} failed` : 'all passed'); process.exit(bad ? 1 : 0);
})();
