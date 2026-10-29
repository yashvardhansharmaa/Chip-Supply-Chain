// The <title> and meta description of the main page and of every static page (the chapters, /summary/ and the four
// reference pages), approved by the owner on 21 Oct 2026. The words are a plain-language editor's, kept verbatim in
// build/page-titles.json (copied from qa/code-review/titles.json): edit them there. The build adds " · Chip Supply Chain"
// to every title except the main page's and any marked "site": false (29 Oct 2026: the main page and the contents page
// name the semiconductor supply chain, and the site's name shows above the result), and uses the same words for the Open Graph and Twitter
// tags. The share cards (build/cards.py) keep their own titles. Pure: build modules require this file.
// A count of the chain is never typed (27 Oct 2026, the merge of chapters 8 and 9): "{chapters}" and "{stages}" in the
// words stand for the number of chapters and of stages in content/ (build/stages.js), spelled out as the site spells them.
const fs = require('fs');
const path = require('path');
const STAGES = require('./stages.js');
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const word = (n) => WORDS[n] || String(n);
let list = [];
try { list = JSON.parse(fs.readFileSync(path.join(__dirname, 'page-titles.json'), 'utf8')); } catch (e) { list = []; }
const chs = STAGES.fromContent(path.resolve(__dirname, '..'));
const COUNTS = { chapters: word(chs.length), stages: word(chs.filter((c) => c.stage).length) };
const fillCounts = (s) => String(s).replace(/\{(chapters|stages)\}/g, (m, k) => COUNTS[k]);
const byPath = new Map((Array.isArray(list) ? list : []).filter((e) => e && e.path && e.title)
  .map((e) => [e.path, Object.assign({}, e, { title: fillCounts(e.title) }, e.description ? { description: fillCounts(e.description) } : {})]));
// '/lithography/' -> { path, title, description }, or null for a page the list does not name
module.exports = (p) => byPath.get(p) || null;
module.exports.paths = () => [...byPath.keys()];
