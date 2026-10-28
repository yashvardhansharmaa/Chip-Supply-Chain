#!/bin/bash
# The phone strip (page revision 2, 28 Oct 2026): a chapter while reading, home, Suppliers, Export Controls and Glossary at 390,
# and the chapter's strip opened. usage: bash qa/redesign/shots-stage-pages-phone.sh <before|after> [base] [outdir] [theme]
K=${1:-after}
if [ "$K" = before ]; then B=${2:-http://127.0.0.1:8766}; else B=${2:-http://127.0.0.1:8778}; fi
O=${3:-qa/redesign/shots/stage-pages}; T=${4:-}
S=""; [ -n "$T" ] && S="-$T"
for spec in "strip-chapter-390$S-$K|$B/#lithography|390|$T|#lithography--how-it-works" \
  "strip-home-390$S-$K|$B/#/|390|$T|2400" \
  "strip-suppliers-390$S-$K|$B/#/suppliers|390|$T|1400" \
  "strip-controls-390$S-$K|$B/#/controls|390|$T|1400" \
  "strip-glossary-390$S-$K|$B/#/glossary|390|$T|1400" \
  "strip-open-390$S-$K|$B/#lithography|390|$T|#lithography--how-it-works||var b=document.querySelector('.stage-toggle');if(b&&getComputedStyle(b).display!=='none')b.click();else{var s=document.querySelector('figure.stage');if(s)s.click();}"; do
  node qa/redesign/shots.js "$O" "$spec" || exit 1
done
