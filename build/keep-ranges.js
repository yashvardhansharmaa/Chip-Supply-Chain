/* A figure range ("$350-400M", "2023-2025") is one unit on the page: wrap it in .nw (src/styles.css) so no line breaks at its
   hyphen (font check, 27 Oct 2026). Text only: tags, scripts, styles, the title, SVG drawings and select options stay as they are. */
const SKIP = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<title\b[\s\S]*?<\/title>|<svg\b[\s\S]*?<\/svg>|<option\b[\s\S]*?<\/option>|<textarea\b[\s\S]*?<\/textarea>|<[^>]+>)/i;
const RANGE = /(?<![\w$.,-])\$?\d+(?:[.,]\d+)*-\$?\d+(?:[.,]\d+)*[A-Za-z%]{0,2}(?![\w-])/g; // not part of a date or code such as 2025-12-31 or GAO-26-107882
module.exports = (html) => String(html).split(SKIP).map((part, i) => (i % 2 ? part : part.replace(RANGE, (r) => `<span class="nw">${r}</span>`))).join('');
