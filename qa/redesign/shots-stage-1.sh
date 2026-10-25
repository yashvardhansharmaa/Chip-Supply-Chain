#!/bin/sh
# The look gate's shots for stage 1: every page the stage changed, at 1440 and 390, a few in dark too.
# usage: sh qa/redesign/shots-stage-1.sh [outdir]   (default qa/redesign/shots/stage-1)
O=${1:-qa/redesign/shots/stage-1}
B=http://127.0.0.1:8766
set --
for w in 1440 390; do
  set -- "$@" "home-$w|$B/#/|$w" "home-glance-$w|$B/#/|$w||.wk-gl" "home-walk-$w|$B/#/|$w||[id='/walk/lithography']" "home-deck-$w|$B/#/walk/flashcards|$w" \
    "chain-$w|$B/#lithography|$w" "ai-chips-$w|$B/#/landscape|$w" "suppliers-$w|$B/#/suppliers|$w" "export-controls-$w|$B/#/controls|$w" \
    "china-revenue-$w|$B/#/exposure|$w" "glossary-$w|$B/#/glossary|$w" "page-lithography-$w|$B/lithography/|$w" "page-summary-$w|$B/summary/|$w" \
    "page-chips-$w|$B/chips/|$w" "page-suppliers-$w|$B/suppliers/|$w" "page-export-controls-$w|$B/export-controls/|$w" "page-glossary-$w|$B/glossary/|$w"
done
set -- "$@" "home-1440-dark|$B/#/|1440|dark" "home-390-dark|$B/#/|390|dark" "chain-1440-dark|$B/#lithography|1440|dark" "page-lithography-1440-dark|$B/lithography/|1440|dark" "home-1024|$B/#/|1024" "home-768|$B/#/|768" "home-320|$B/#/|320"
node qa/redesign/shots.js "$O" "$@"
