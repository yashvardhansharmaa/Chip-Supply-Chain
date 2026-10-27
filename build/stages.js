// THE STAGES OF THE CHAIN, in one place (27 Oct 2026, when Transistors and the Front End merged into Foundries and Fabs and
// the chain went from 15 stages to 14). Every numbered chapter is a stage except the two that look across the whole chain,
// the economics chapter and the geopolitics essay, which the site groups as "Across the chain". So the number of stages,
// the number of chapters, the stage a chapter is ("Stage 8 of 14") and the night ground of the two chapters that are not
// stages all follow from content/, and nothing else types them. Pure: build/build.js, build/validate.js, build/page-titles.js,
// build/modules/*.js and qa/scripts/check-integrity.js require it; build/cards.py reads the stage numbers through
// build/modules/social.js manifest(), and the app reads each chapter's flag from CP_DATA.chapters (stage).
const fs = require('fs');
const path = require('path');

// the chapters that are not stages, by id
const ACROSS = ['component-costs', 'geopolitics'];
// c: anything with the chapter's id and number (front matter, a built chapter, a manifest entry)
const isStage = (c) => !!c && Number.isInteger(c.number) && c.number >= 1 && !ACROSS.includes(c.id);

// the chapters as content/ holds them, in order: { id, number, stage }, for the modules that read no build context
function fromContent(root) {
  const dir = path.join(root || path.resolve(__dirname, '..'), 'content');
  const out = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => /^\d\d-.*\.md$/.test(x)).sort() : []) {
    const m = fs.readFileSync(path.join(dir, f), 'utf8').match(/^---json\s*\n([\s\S]*?)\n---/);
    let meta = {};
    try { meta = m ? JSON.parse(m[1]) : {}; } catch (e) { continue; }
    const id = meta.id || f.replace(/^\d\d-/, '').replace(/\.md$/, '');
    out.push({ id, number: meta.number });
  }
  out.sort((a, b) => a.number - b.number).forEach((c) => { c.stage = isStage(c); });
  return out;
}

module.exports = { ACROSS, isStage, fromContent };
