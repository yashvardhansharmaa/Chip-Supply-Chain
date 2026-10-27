#!/bin/sh
# The look gate's shots for the column, the chapter opener of design round five: Lithography, Memory and HBM and chapter 17 at
# 1440 and 390 (their tops, then their plates), Lithography in dark at 1440, the card at 1440 and 390, Lithography at 1024,
# the readable pages' plates (/lithography/ at 1440 and 390, /geopolitics/ at 1440) and chapter 17's longest glossary term on a
# phone. One spec per call of qa/redesign/shots.js, which emulates reduced motion, so the drawing stands still and its pause
# does not show (lithography-1440-plate-motion.png, with the pause at the caption's label, was taken with motion on).
# usage: sh qa/redesign/shots-stage-opener.sh [outdir] [base]   (default qa/redesign/shots/stage-opener, http://127.0.0.1:8771)
O=${1:-qa/redesign/shots/stage-opener}
B=${2:-http://127.0.0.1:8771}
for w in 1440 390; do
  for spec in "lithography-$w|$B/#lithography|$w" "memory-and-hbm-$w|$B/#memory-and-hbm|$w" "geopolitics-$w|$B/#geopolitics|$w" \
    "card-$w|$B/#lithography|$w||#lithography--card"; do
    node qa/redesign/shots.js "$O" "$spec" || exit 1
  done
done
for spec in "lithography-1440-plate|$B/#lithography|1440||#lithography .ch-spec" "memory-and-hbm-1440-plate|$B/#memory-and-hbm|1440||#memory-and-hbm .ch-spec" \
  "geopolitics-1440-plate|$B/#geopolitics|1440||#geopolitics .ch-spec" "lithography-1440-dark|$B/#lithography|1440|dark" \
  "geopolitics-1440-dark-plate|$B/#geopolitics|1440|dark|#geopolitics .ch-spec" "lithography-1024|$B/#lithography|1024" \
  "page-lithography-1440|$B/lithography/|1440" "page-lithography-1440-plate|$B/lithography/|1440||.ch-spec" \
  "page-lithography-390-plate|$B/lithography/|390||.ch-spec" "page-geopolitics-1440-plate|$B/geopolitics/|1440||.ch-spec"; do
  node qa/redesign/shots.js "$O" "$spec" || exit 1
done
# chapter 17's longest glossary term on a phone, which once ran past the screen's edge
node qa/redesign/shots.js "$O" "geopolitics-390-long-term|$B/#geopolitics|390||||var e=[].filter.call(document.querySelectorAll('#geopolitics .nw'),function(x){return /National Integrated/.test(x.textContent);})[0];document.documentElement.style.scrollBehavior='auto';e.scrollIntoView({block:'center'});" || exit 1
