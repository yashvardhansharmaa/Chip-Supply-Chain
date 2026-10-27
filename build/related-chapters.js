// RELATED CHAPTERS: the "Related chapters" line near the end of each readable chapter page (build/modules/social.js), just
// before Previous and Next. Editorial: two or three hand-picked links per chapter, to the stages that work most closely with
// this one. A key is a chapter id; each value is a chapter id, or a site path such as '/export-controls/' for a reference
// page. The build warns about an id it cannot find. Edit freely; nothing else reads this list. (Owner's picks, 21 Oct 2026:
// lithography with photomasks and chemicals, memory with packaging, packaging with substrates and test, systems with data
// centers, the economics chapter with memory and packaging, the geopolitics chapter with lithography, foundries and controls.
// On 27 Oct 2026 Transistors and the Front End merged into Foundries and Fabs: its links point at the merged chapter, which
// takes the lithography link from the old chapter 8 and keeps packaging and geopolitics from the old chapter 9.)
module.exports = {
  'design-and-eda': ['foundries-and-fabs', '/chips/'],
  'silicon-and-wafers': ['chemicals-gases-and-photoresist', 'foundries-and-fabs'],
  'chemicals-gases-and-photoresist': ['lithography', 'deposition-and-etch', 'silicon-and-wafers'],
  'lithography': ['photomasks-and-pellicles', 'chemicals-gases-and-photoresist'],
  'photomasks-and-pellicles': ['lithography', 'metrology-and-inspection'],
  'deposition-and-etch': ['foundries-and-fabs', 'chemicals-gases-and-photoresist'],
  'metrology-and-inspection': ['lithography', 'foundries-and-fabs'],
  'foundries-and-fabs': ['lithography', 'advanced-packaging', 'geopolitics'],
  'memory-and-hbm': ['advanced-packaging', 'component-costs'],
  'advanced-packaging': ['substrates-and-pcbs', 'test-and-assembly', 'memory-and-hbm'],
  'substrates-and-pcbs': ['advanced-packaging', 'test-and-assembly'],
  'test-and-assembly': ['advanced-packaging', 'substrates-and-pcbs'],
  'systems-and-networking': ['data-centers-and-power', 'advanced-packaging'],
  'data-centers-and-power': ['systems-and-networking', 'component-costs'],
  'component-costs': ['memory-and-hbm', 'advanced-packaging', '/chips/'],
  'geopolitics': ['lithography', 'foundries-and-fabs', '/export-controls/'],
};
