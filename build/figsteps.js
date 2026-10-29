/* Figures that step (the owner's approved mockups 2 and 7 of 29 Oct 2026, MAIN/qa/excellence/mocks/figures/): a bars figure
   whose rows arrive one step at a time, each step with a sentence of the chapter's under the chart, and, where the figure
   names one, a drawing above the bars (src/modules/figsteps.js draws it). figure() in build/build.js draws the figure as it
   draws any bars figure, through its own Table, CSV, PNG, Cite, numbering and rail entry; this file adds only the parts a
   stepped figure has on top of that. At rest, and on paper, a stepped figure shows its last step: every row, the drawing
   whole and the last step's sentence.

   A figure's fields, besides a bars figure's own:
   - "steps": [{ "k": the step's name, "cap": its sentence, "row": the label of the row it brings in (optional) }, ...];
     a row that no step names is there from the first step;
   - "draw": the name of a drawing src/modules/figsteps.js knows ("scale-up-out", figure 13.2);
   - "shown": { "<row label>": "1.6 million" }, a row's value as the source words it, printed in place of the number
     (the number stays the bar's length, the CSV's value and the PNG's bar);
   - "sources": [{ "label", "url" }, ...], sources after the main one on the source line, each with its footnote number
     (the main "source" stays the one the citation's Data line and the CSV name). */
'use strict';

module.exports = function (esc) {
  const steps = (f) => (Array.isArray(f && f.steps) ? f.steps.filter((s) => s && s.k && s.cap) : []);
  // the step a row arrives in (1-based): the step that names it, else the first
  const rowStep = (f, label) => { const i = steps(f).findIndex((s) => s.row != null && String(s.row) === String(label)); return i < 0 ? 1 : i + 1; };
  const shown = (f, label) => (f && f.shown && f.shown[label] != null ? esc(String(f.shown[label])) : '');
  return {
    steps, rowStep, shown,
    // the class the figure takes, and its step at rest (the last)
    figClass: (f) => (steps(f).length ? ' figure--steps' : ''),
    figAttrs: (f) => (steps(f).length ? ` data-step="${steps(f).length}"` : ''),
    // the step names above the chart, the last one current (the figure at rest), in the explainers' step row
    head(f) {
      const s = steps(f); if (!s.length) return '';
      const draw = f.draw ? `<div class="sf-draw" data-draw="${esc(f.draw)}" aria-hidden="true"></div>` : '';
      return `<ol class="anim-steps sf-steps" aria-label="Steps">${s.map((st, i) => `<li><button type="button" data-step="${i + 1}" data-cap="${esc(st.cap)}"${i === s.length - 1 ? ' aria-current="step"' : ''}><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(st.k)}</button></li>`).join('')}</ol>${draw}`;
    },
    // each bar row marked with the step it arrives in, in the data's order (figMarks keeps it); and the Table's cell for a row
    // the source words ("shown"), in those words, with the figure's unit after them as the Table writes a long unit
    rows(f, body, marks, unitTail) {
      Object.keys((f && f.shown) || {}).forEach((label) => {
        const th = `<th scope="row">${esc(label)}</th><td>`, at = body.indexOf(th);
        if (at < 0) return;
        const end = body.indexOf('</td>', at + th.length);
        body = body.slice(0, at + th.length) + shown(f, label) + (unitTail || '') + body.slice(end);
      });
      if (!steps(f).length) return body;
      let i = 0;
      return body.replace(/<div class="hb([ "])/g, (m, c) => { const mk = marks[i++]; return `<div data-step="${mk ? rowStep(f, mk.label) : 1}" class="hb${c}`; });
    },
    // the last step's sentence under the chart, which the steps replace as they play
    tail(f) { const s = steps(f); return s.length ? `<p class="sf-cap" aria-live="polite">${esc(s[s.length - 1].cap)}</p>` : ''; },
    // the sources after the main one: ", B [n] and C [m]"
    more(f, cite, safeUrl) {
      const xs = Array.isArray(f.sources) ? f.sources.filter((s) => s && s.url) : [];
      if (!xs.length) return '';
      const one = (s) => `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener">${esc(s.label || s.url)}</a> ${cite(s.url)}`;
      return xs.map((s, i) => (i === xs.length - 1 ? ' and ' : ', ') + one(s)).join('');
    },
    // the checks the build makes: every step that names a row names one the figure has, and a drawing has a name
    problems(f) {
      const out = [], labels = new Set((f.data || []).map((d) => String(d[0])));
      steps(f).forEach((s, i) => { if (s.row != null && !labels.has(String(s.row))) out.push(`step ${i + 1} names the row "${s.row}", which the figure does not have`); });
      Object.keys(f.shown || {}).forEach((k) => { if (!labels.has(k)) out.push(`"shown" names the row "${k}", which the figure does not have`); });
      if (f.steps && !steps(f).length) out.push('"steps" has no step with a name ("k") and a sentence ("cap")');
      return out;
    },
  };
};
