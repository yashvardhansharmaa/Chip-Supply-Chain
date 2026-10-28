/* The readable pages' masthead: the app's own bar (src/template.html .masthead), written into every static page (the readable
   chapters, Start here's page and the reference pages, through social.js) and /summary/ (summary-brief.js). Design round
   nine, revision 6 (28 Oct 2026): one masthead on every page. Home first, The Chain on the main page and the four reference
   pages by their real paths, so a crawler follows them; the section the page belongs to carries aria-current, which
   build/assets/masthead.css draws as the wine rule. Search is a link into the app's search (src/app.js opens the dialog on
   ?search=1), and the theme button flips the page's theme and keeps the choice for the whole site (localStorage
   "cp-theme", which the app and every static page read before the first paint). */
'use strict';
const fs = require('fs');
const path = require('path');

const TILE = '<svg class="wm-tile" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect width="16" height="16" rx="3.2"/><path transform="translate(3.3324 11.8693) scale(0.009179 -0.009179)" d="M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 L653 720 Q653 786 623 823 Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 Q609 229 697 229 Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 563 -26 Q417 -26 301 33 Q185 91 118 198 Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 Q1011 765 1011 683 Z"/></svg>';
// [path from the page's folder, label, the app view it names (the phone hides Home, as the app does)]
const NAV = [['../', 'Home', 'walk'], ['../#/chain', 'The Chain', 'stack'], ['../chips/', 'AI Chips', 'landscape'], ['../suppliers/', 'Suppliers', 'suppliers'],
  ['../export-controls/', 'Export Controls', 'controls'], ['../glossary/', 'Glossary', 'glossary']];
const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const MOON = '<svg class="ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
const SUN = '<svg class="ic-sun" viewBox="0 0 24 24" aria-hidden="true" hidden><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
// the theme button, as src/app.js Theme does it: the label names the other theme, the icon shows it
const THEME_TOGGLE_JS = `<script>(function(){var d=document.documentElement,b=document.querySelector('.masthead .theme-toggle');if(!b)return;
function sync(){var k=d.getAttribute('data-theme')==='dark';b.setAttribute('aria-label',k?'Switch to light mode':'Switch to dark mode');b.querySelector('.ic-moon').toggleAttribute('hidden',k);b.querySelector('.ic-sun').toggleAttribute('hidden',!k);}
b.addEventListener('click',function(){var t=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',t);try{localStorage.setItem('cp-theme',t);}catch(e){}sync();});sync();})();</script>`;

// the bar for a page; current is the NAV path of the section it belongs to ('' for none)
function masthead(current) {
  const tabs = NAV.map(([href, text, view]) => `<a href="${href}" data-view="${view}"${href === current ? ' aria-current="page"' : ''}>${text}</a>`).join('');
  return `<header class="masthead"><a class="wordmark" href="../" aria-label="Chip Supply Chain">${TILE}<span class="wm-name">Chip Supply Chain</span></a>`
    + `<nav class="tabs" aria-label="Sections">${tabs}<a class="search-btn" href="../?search=1" aria-label="Search" title="Search the site">${SEARCH_ICON}</a>`
    + `<button class="theme-toggle" type="button" aria-label="Switch to dark mode">${MOON}${SUN}</button></nav></header>${THEME_TOGGLE_JS}`;
}
// its sheet (build/assets/masthead.css), for the caller to inline
function mastheadCSS(root) {
  try { return fs.readFileSync(path.join(root, 'build', 'assets', 'masthead.css'), 'utf8'); } catch (e) { return ''; }
}

module.exports = { masthead, mastheadCSS, NAV, TILE };
