// The <title> and meta description of the main page and of every static page (the 17 chapters, /summary/ and the four
// reference pages), approved by the owner on 21 Oct 2026. The words are a plain-language editor's, kept verbatim in
// build/page-titles.json (copied from qa/code-review/titles.json): edit them there. The build adds " · Chip Supply Chain"
// to every title except the main page's, which carries it already, and uses the same words for the Open Graph and Twitter
// tags. The share cards (build/cards.py) keep their own titles. Pure: build modules require this file.
const fs = require('fs');
const path = require('path');
let list = [];
try { list = JSON.parse(fs.readFileSync(path.join(__dirname, 'page-titles.json'), 'utf8')); } catch (e) { list = []; }
const byPath = new Map((Array.isArray(list) ? list : []).filter((e) => e && e.path && e.title).map((e) => [e.path, e]));
// '/lithography/' -> { path, title, description }, or null for a page the list does not name
module.exports = (p) => byPath.get(p) || null;
module.exports.paths = () => [...byPath.keys()];
