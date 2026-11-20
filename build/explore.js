/* Explorable figures (the owner's "Build it" of 20 Nov 2026 on the ideas-nov mockups, lens "explorables"): a figure the
   reader steps through, each step a sourced value with its own sentence and source. Two so far: 10.3, "How big a package
   gets, counted in reticle fields" (src/modules/live-reticle.js), and 04.2, "The light each kind of scanner uses, and the
   finest line it prints" (src/modules/live-light.js). figure() in build/build.js gives one the figure's grammar (its number,
   title, source line with Cite and Table, note, rail entry and address); this file writes what sits inside it:
   - the stage, .xp-stage[data-live], that the module draws into: on screen the live drawing and its controls (.lv-screen),
     and for paper and the PDF a still of the step "print" names (.xp-still), so a page always prints the same step whatever
     the reader last chose;
   - every step as page text, in order (.xp-list, read by screen readers, as the explainers' transcripts are): its name, its
     sentence and its source, with the step's numbers in data-x for the module;
   - the Table: one row per step, its cells filled from the figure's "table" pattern.

   A figure's fields, besides "id", "type": "explore", "title", "note", "source" and "sources" (figure() reads those):
   - "live": the module's name, src/modules/live-<live>.js;
   - "steps": [{ "k": the step's short name, "cap": its sentence, "sources": [{ "label", "url" }, ...], and the numbers its
     module draws (for 10.3 "v", the area in reticle fields; for 04.2 "wl" and "ft", the wavelength and the finest feature) };
   - "print": the step (1-based) a page prints, the one that tells the most; the last when it is left out;
   - "table": [["Column head", "pattern"], ...], each pattern a step's fields in braces ("{wl} nm"); the first column heads
     the rows. */
'use strict';

module.exports = function (esc, safeUrl) {
  const srcs = (s) => (Array.isArray(s && s.sources) ? s.sources : s && s.source ? [s.source] : []).filter((x) => x && x.url);
  const steps = (f) => (Array.isArray(f && f.steps) ? f.steps.filter((s) => s && s.k && s.cap && srcs(s).length) : []);
  const at = (f) => { const n = steps(f).length, p = Math.round(+f.print); return p >= 1 && p <= n ? p : n; };
  const fill = (tpl, s) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (s[k] == null ? '' : String(s[k]))).replace(/\s+/g, ' ').trim();
  const cols = (f) => (Array.isArray(f.table) ? f.table.filter((c) => Array.isArray(c) && c.length === 2) : []);
  // a step's numbers for the module: everything but its sentence and sources, which the module reads from the page text (so
  // they carry the page's typographer's quotes)
  const nums = (s) => { const o = {}; Object.keys(s).forEach((k) => { if (k !== 'cap' && k !== 'sources' && k !== 'source') o[k] = s[k]; }); return o; };
  // (out of the tab order: the list is for screen readers, and the stage shows the same links where a keyboard can see them)
  const links = (s) => srcs(s).map((a) => `<a href="${safeUrl(a.url)}" target="_blank" rel="noopener" tabindex="-1">${esc(a.label || a.url)}</a>`).reduce((t, l, i, all) => t + (i ? (i === all.length - 1 ? ' and ' : ', ') : '') + l, '');
  function table(f) {
    const c = cols(f), s = steps(f);
    if (!c.length) return '';
    return `<table class="sr-only fig-table"><caption>${esc(String(f.title || '').split(/(?<=[a-z0-9)%])\.\s+(?=[A-Z])/)[0])}</caption>`
      + `<thead><tr>${c.map((x) => `<th scope="col">${esc(x[0])}</th>`).join('')}</tr></thead><tbody>`
      + s.map((st) => `<tr>${c.map((x, i) => (i ? `<td>${esc(fill(x[1], st))}</td>` : `<th scope="row">${esc(fill(x[1], st))}</th>`)).join('')}</tr>`).join('')
      + `</tbody></table>`;
  }
  return {
    steps, srcs, at, fill,
    body(f) {
      const s = steps(f);
      return `<div class="xp-stage" data-live="${esc(f.live)}" data-print="${at(f)}"></div>`
        + `<ol class="xp-list">${s.map((st) => `<li data-x="${esc(JSON.stringify(nums(st)))}"><b>${esc(st.label || st.k)}.</b> <span class="xp-li-cap">${esc(st.cap)}</span> <span class="xp-li-src">${srcs(st).length > 1 ? 'Sources' : 'Source'}: ${links(st)}</span></li>`).join('')}</ol>`
        + table(f);
    },
    // the checks the build makes (build/validate.js makes the same before it)
    problems(f) {
      const out = [], all = Array.isArray(f.steps) ? f.steps : [];
      if (!f.live) out.push('it has no "live" module');
      if (!all.length) out.push('it has no "steps"');
      all.forEach((st, i) => {
        if (!st || !st.k || !st.cap) out.push(`step ${i + 1} needs "k" and "cap"`);
        else if (!srcs(st).length) out.push(`step ${i + 1} (${st.k}) has no source`);
      });
      // every step's source is on the figure's source line too, so the chapter's notes list it
      const listed = new Set([f.source].concat(Array.isArray(f.sources) ? f.sources : []).filter((x) => x && x.url).map((x) => x.url));
      all.forEach((st, i) => srcs(st || {}).forEach((x) => { if (!listed.has(x.url)) out.push(`step ${i + 1}'s source ${x.url} is not among the figure's "source" and "sources"`); }));
      if (f.print != null && !(Math.round(+f.print) >= 1 && Math.round(+f.print) <= all.length)) out.push(`"print" ${f.print} names no step`);
      if (!cols(f).length) out.push('it has no "table" pattern');
      cols(f).forEach((c) => (String(c[1]).match(/\{(\w+)\}/g) || []).forEach((m) => { const k = m.slice(1, -1); all.forEach((st, i) => { if (st && st[k] == null) out.push(`step ${i + 1} has no "${k}" for the table's "${c[0]}"`); }); }));
      return out;
    },
  };
};
