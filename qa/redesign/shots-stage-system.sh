#!/bin/sh
# The look gate's shots for the hybrid type, the four-bar meters and the approved site-wide revisions (28 Oct 2026,
# MAIN/qa/design9/BUILD-SYSTEM.md): home, the Lithography opener, the text at a section head, the card with the sidebar,
# Suppliers, a static chapter page and /summary/, at 1440 and 390. One spec per call of qa/redesign/shots.js.
# usage: sh qa/redesign/shots-stage-system.sh <before|after> [base] [outdir]
#   before: http://127.0.0.1:8766 (the redesign before this round); after: http://127.0.0.1:8777 (this worktree)
# qa/redesign/pair-stage-system.py then joins each before and after side by side.
K=${1:-after}
if [ "$K" = before ]; then B=${2:-http://127.0.0.1:8766}; else B=${2:-http://127.0.0.1:8777}; fi
O=${3:-qa/redesign/shots/stage-system}
for w in 1440 390; do
  for spec in "home-$w-$K|$B/#/|$w" \
    "opener-$w-$K|$B/#lithography|$w" \
    "section-$w-$K|$B/#lithography|$w||#lithography .prose > h3" \
    "card-$w-$K|$B/#lithography|$w||#lithography .plate" \
    "suppliers-$w-$K|$B/#/suppliers|$w" \
    "static-$w-$K|$B/lithography/|$w" \
    "summary-$w-$K|$B/summary/|$w"; do
    node qa/redesign/shots.js "$O" "$spec" || exit 1
  done
done
