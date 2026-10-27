// RETIRED CHAPTERS: a chapter merged into another keeps its addresses working, for links already shared and cited.
// On 27 Oct 2026 chapter 8, Transistors and the Front End, merged into Foundries and Fabs (the owner's decision; the draft and
// its notes are MAIN/qa/merge-8-9/). For each retired id:
//   - its readable page, /<id>/, becomes a small static page that forwards to the merged chapter's (build/modules/social.js
//     retiredHTML: a canonical link, a meta refresh and a plain link; a script carries a section's anchor along). The sitemap
//     leaves it out;
//   - its PDF, /pdf/<id>.pdf, is a copy of the merged chapter's PDF, which robots.txt asks search engines to skip (build.js,
//     as for the two book PDFs' first names);
//   - in the app, #<id> and its deeper anchors land in the merged chapter: src/preroute.js reads ANCHORS (the build writes it
//     in) and swaps the address before the page paints, and the router does the same for a link followed later.
// ANCHORS maps each old anchor to the nearest one in the merged chapter: a section to the section that took in its text (see
// the notes' "What moved where"), a figure to the same figure, or, for the one figure the merge dropped, to the section it
// stood in. The old Foundries and Fabs sections the merged outline no longer has are mapped too. Any other id under a
// retired chapter's name (a citation, a figure's cite box) lands on the merged chapter's top. The build warns when a target
// is not on the page.
const OLD = 'transistors-and-front-end', NEW = 'foundries-and-fabs';
const s = (a, b) => [`${OLD}--${a}`, `${NEW}--${b}`];
const f = (a, b) => [`${NEW}--${a}`, `${NEW}--${b}`];
module.exports = {
  chapters: { [OLD]: { to: NEW, title: 'Transistors and the Front End' } },
  ANCHORS: Object.fromEntries([
    [OLD, NEW],
    s('plain', 'plain'), s('card', 'card'), s('how-it-works', 'how-it-works'),
    s('variants-and-trade-offs', 'the-newest-designs'),
    s('planar-and-finfet', 'how-it-works'), // the planar and fin comparison went into How it works ("More gate")
    s('gate-all-around-nanosheets', 'gate-all-around-nanosheets'), s('backside-power-delivery', 'backside-power-delivery'),
    s('cfet-and-what-comes-after', 'cfet-and-what-comes-after'), s('the-back-end-of-line', 'the-back-end-of-line'),
    s('who-makes-it', 'who-makes-it'), s('the-chokepoint', 'the-chokepoint'), s('flashcards', 'flashcards'), s('sources', 'sources'),
    [`fig-${OLD}-switch-shapes`, `fig-${NEW}-switch-shapes`], [`fig-${OLD}-node-roadmap`, `fig-${NEW}-node-roadmap`],
    [`fig-${OLD}-density-by-node`, `${NEW}--gate-all-around-nanosheets`], // the dropped density bars stood in this section
    // the old chapter 9's sections, folded into the merged outline
    f('variants-and-trade-offs', 'the-foundry-and-the-fab'), f('pure-play-foundries', 'the-foundry-and-the-fab'),
    f('integrated-device-makers-turned-foundry', 'the-foundry-and-the-fab'), f('national-champions', 'who-makes-it'),
    f('mature-node-capacity', 'the-chokepoint'),
  ]),
};
