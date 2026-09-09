/* WALK  — the view at #/walk: "How a GPU is made", the site's 18 plain-language paragraphs in order.
   START_HERE — the three-way chooser on the landing page, directly under the hero.

   Nothing here is written from memory. Every paragraph, name, country code, score and count is read
   from ctx.all and ctx.data; the only prose typed in this file is connective (the dek, the labels and
   the closing line), and every number inside it is computed. */

module.exports = function (ctx) {
  const { all, stages, data, esc, pad, word, cap, wordCount } = ctx;

  const steps = all.filter((c) => c.id !== 'introduction-and-goals').slice().sort((a, b) => (a.number || 0) - (b.number || 0)); // the walk starts with chip design; the site's own introduction stays in The Chain
  const card = Object.create(null);
  (data.chapters || []).forEach((c) => { card[c.id] = c; });

  // the geopolitics chapter is a view of its own; every other chapter is an anchor in the stack
  const chapterHref = (id) => (id === 'geopolitics' ? '#/geopolitics' : '#' + id);
  // a step's own id is "/walk/<chapter>", so the hash "#/walk/<chapter>" keeps the router on this
  // view (it matches /^#\/([a-z-]+)/ as "walk") and still scrolls to the block
  const stepId = (id) => '/walk/' + id;
  const stageIndex = (id) => stages.findIndex((s) => s.id === id);

  /* the score, shown the way the scored chain strip shows it: five pips, amber at 5, ink at 4, grey below */
  const rank = (n) => (n >= 5 ? '5' : n >= 4 ? '4' : '3');
  function scoreHTML(n) {
    if (!n) return '<span class="wk-score"><button type="button" class="gl-term label wk-score-term" data-term="chokepoint score">Chokepoint</button><span class="wk-sc">not scored</span></span>';
    let pips = '';
    for (let i = 1; i <= 5; i++) pips += `<i${i <= n ? ' class="on"' : ''}></i>`;
    return `<span class="wk-score" data-rank="${rank(n)}"><span class="label">Chokepoint</span><span class="wk-pips" aria-hidden="true">${pips}</span><span class="wk-sc"><b>${n}</b> / 5</span></span>`;
  }

  /* who leads: at most three, name then country code, in the site's chip */
  function leadersHTML(c) {
    const ls = (c.leaders || []).slice(0, 3);
    if (!ls.length) return '';
    const line = ls
      .map((l) => `<span class="wk-lead">${esc(l.name)}${l.country ? ` <span class="chip">${esc(l.country)}</span>` : ''}</span>`)
      .join('<i class="wk-sep" aria-hidden="true">·</i>');
    return `<p class="wk-leaders"><span class="label">Who leads</span>${line}</p>`;
  }

  const plainOf = (id) => String((card[id] || {}).plain || '');
  const bib = ctx.readJSON(ctx.path.join(ctx.root, 'data', 'bibliography.json'), {}) || {};
  const okUrl = (u) => /^(https?:|#|\/)/i.test(String(u || '').trim());
  // two of the chapter's sourced key facts, so a hurried reader can lift a cited line without opening the chapter
  const factsHTML = (ch) => {
    const facts = ((ch.meta && ch.meta.keyFacts) || []).filter((k) => k && k.fact && okUrl(k.source)).slice(0, 2);
    if (!facts.length) return '';
    return `<ul class="wk-facts" aria-label="Two sourced facts">${facts.map((k) => { const e = bib[k.source] || {}; const t = e.title ? `${e.title}${e.publisher ? ', ' + e.publisher : ''}${e.date ? ', ' + e.date : ''}` : k.source; return `<li>${esc(k.fact)} <a class="wk-src" href="${esc(k.source)}" target="_blank" rel="noopener" title="${esc(t)}">source</a></li>`; }).join('')}</ul>`;
  };
  const walkWords = steps.reduce((a, c) => a + wordCount(plainOf(c.id)), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));
  const siteWords = all.reduce((a, c) => a + (c.words || 0), 0);
  const siteCites = all.reduce((a, c) => a + ((c.cites || []).length), 0);
  const thresholds = (data.controls || []).length;

  steps.forEach((c) => { if (!plainOf(c.id)) ctx.warn(`walk: chapter ${c.id} has no plain paragraph`); });

  /* ---------------- the walk ---------------- */
  const list = steps.map((ch, i) => {
    const c = card[ch.id] || {};
    const si = stageIndex(ch.id);
    const prev = steps[i - 1];
    const next = steps[i + 1];
    const stage = si >= 0 ? `Stage ${si + 1} of ${stages.length}` : '';
    return `<li class="wk-step" id="${esc(stepId(ch.id))}" data-title="${esc(ch.title)}" data-number="${pad(ch.number)}" data-specimen="${esc((ch.meta && ch.meta.specimen) || '')}" data-caption="${esc((ch.meta && ch.meta.specimenCaption) || '')}">
<div class="wk-mark" aria-hidden="true"><span class="wk-n">${pad(ch.number)}</span></div>
<div class="wk-block">
<p class="wk-where"><span class="label">Chapter ${pad(ch.number)}</span>${stage ? `<span class="label wk-stage">${esc(stage)}</span>` : ''}</p>
<h3 class="wk-t">${esc(ch.title)}</h3>
<p class="wk-p">${esc(plainOf(ch.id))}</p>
${factsHTML(ch)}
${leadersHTML(c)}
<div class="wk-foot">${scoreHTML(+c.score || 0)}<a class="wk-read" href="${esc(chapterHref(ch.id))}">Read the chapter</a></div>
<nav class="wk-pn" aria-label="Step ${i + 1} of ${steps.length}">${
      prev ? `<a class="wk-prev" href="#${esc(stepId(prev.id))}"><span class="label">Previous</span><span class="wk-pn-t">${esc(prev.title)}</span></a>` : '<span></span>'
    }${
      next ? `<a class="wk-next" href="#${esc(stepId(next.id))}"><span class="label">Next</span><span class="wk-pn-t">${esc(next.title)}</span></a>` : '<span></span>'
    }</nav>
</div>
</li>`;
  }).join('\n');

  const WALK = `<div class="wk">
<div class="wk-rail" id="wk-rail" data-show="0" aria-hidden="true" hidden><div class="wk-rail-bar"><i></i></div><p class="wk-rail-line"><span class="wk-rail-n"></span><span class="wk-rail-t"></span></p></div>
<header class="wk-head">
<p class="label wk-eyebrow">Start here</p>
<h2 class="wk-title">How a GPU is made</h2>
<p class="wk-dek">One plain paragraph from each of the ${word(steps.length)} chapters, in the order a chip is made, then what it costs and who controls it. No jargon, no background, one sitting.</p>
<p class="wk-meta"><span class="label">${steps.length} paragraphs</span><span class="label">${walkWords.toLocaleString('en-US')} words</span><span class="label">about ${mins} min</span></p>
</header>
<ol class="wk-list">
${list}
</ol>
<div class="wk-end">
<p class="wk-end-t">That is the chain, end to end.</p>
<p class="wk-end-links"><a href="#/chain">All ${word(steps.length)} chapters in full</a><a href="#/">Where it is made: the map</a><a href="#/sources">Sources and method</a></p>
</div>
</div>`;

  /* ---------------- start here (landing page) ---------------- */
  const START_HERE = `<section class="wk-sh" aria-labelledby="wk-sh-h">
<h2 class="label wk-sh-h" id="wk-sh-h">Start here</h2>
<ul class="wk-sh-list">
<li><a class="wk-sh-item" href="#/walk"><b class="wk-sh-t">${cap(word(mins))} minutes: how a GPU is made</b><span class="wk-sh-d">Every chapter's plainest paragraph, in order.</span></a></li>
<li><a class="wk-sh-item" href="#contents"><b class="wk-sh-t">The whole chain, ${steps.length} chapters</b><span class="wk-sh-d">The full text, ${siteWords.toLocaleString('en-US')} words.</span></a></li>
<li><a class="wk-sh-item" href="#/sources"><b class="wk-sh-t">Data and sources for researchers</b><span class="wk-sh-d">${siteCites.toLocaleString('en-US')} sources${thresholds ? `, ${thresholds} licence thresholds` : ''}.</span></a><a class="wk-sh-more" href="#/controls">Export controls</a></li>
</ul>
</section>`;

  return { WALK, START_HERE };
};
