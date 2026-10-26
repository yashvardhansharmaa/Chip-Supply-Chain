#!/bin/sh
# The look gate's shots for one chapter per address: The Chain's contents, a chapter's top, the door at a chapter's end (a
# stage, the last stage into Across the chain, the last chapter back to the contents, the readable page's), at 1440 and 390,
# the door in dark, and a deep link. One spec per call of qa/redesign/shots.js.
# usage: sh qa/redesign/shots-stage-chapters.sh [outdir]   (default qa/redesign/shots/stage-chapters)
O=${1:-qa/redesign/shots/stage-chapters}
B=http://127.0.0.1:8766
for w in 1440 390; do
  for spec in "contents-top-$w|$B/#/chain|$w" "contents-list-$w|$B/#/chain|$w||#contents" \
    "chapter-top-$w|$B/#lithography|$w" "door-$w|$B/#lithography|$w||#lithography .chapter-sources" \
    "door-$w-dark|$B/#lithography|$w|dark|#lithography .chapter-sources" \
    "door-15-to-16-$w|$B/#data-centers-and-power|$w||#data-centers-and-power .chapter-sources" \
    "door-17-to-contents-$w|$B/#geopolitics|$w||#geopolitics .chapter-sources" \
    "page-door-$w|$B/lithography/|$w||.endnav" "deep-section-$w|$B/#memory-and-hbm--how-a-stack-is-built|$w"; do
    node qa/redesign/shots.js "$O" "$spec" || exit 1
  done
done
