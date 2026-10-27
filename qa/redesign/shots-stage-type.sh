#!/bin/sh
# The look gate's shots for the type switch (Source Serif 4 for display and text, design round five): the home page,
# Lithography's opener and its text, Suppliers, Export Controls and the Glossary at 1440, Lithography's text on a phone at 390
# (landed on How it works, as a reader's link lands), and Lithography's opener in dark. One spec per call of
# qa/redesign/shots.js. Run it on this branch and on the redesign as it stood to compare them.
# usage: sh qa/redesign/shots-stage-type.sh [outdir] [base]   (default qa/redesign/shots/stage-type, http://127.0.0.1:8773)
O=${1:-qa/redesign/shots/stage-type}
B=${2:-http://127.0.0.1:8773}
for spec in "home-1440|$B/#/|1440" "lithography-opener-1440|$B/#lithography|1440" \
  "lithography-body-1440|$B/#lithography--how-it-works|1440||#lithography--how-it-works" \
  "lithography-card-1440|$B/#lithography--card|1440||#lithography--card" \
  "suppliers-1440|$B/#/suppliers|1440" "export-controls-1440|$B/#/controls|1440" "glossary-1440|$B/#/glossary|1440" \
  "lithography-390|$B/#lithography|390" "lithography-body-390|$B/#lithography--how-it-works|390||#lithography--how-it-works" \
  "lithography-opener-1440-dark|$B/#lithography|1440|dark" "page-lithography-1440|$B/lithography/|1440" \
  "contents-1440|$B/#/chain|1440" "home-390|$B/#/|390" \
  "lithography-plain-1440|$B/#lithography--plain|1440||#lithography--plain" \
  "lithography-flashcards-1440|$B/#lithography--flashcards|1440||#lithography--flashcards" \
  "lithography-door-1440|$B/#lithography--sources|1440||#lithography .prevnext" "lithography-door-390|$B/#lithography--sources|390||#lithography .prevnext" \
  "lithography-card-390|$B/#lithography--card|390||#lithography--card" "home-320|$B/#/|320" \
  "chemicals-body-320|$B/#chemicals-gases-and-photoresist--how-it-works|320||#chemicals-gases-and-photoresist--how-it-works" \
  "chemicals-card-320|$B/#chemicals-gases-and-photoresist--card|320||#chemicals-gases-and-photoresist--card"; do
  node qa/redesign/shots.js "$O" "$spec" || exit 1
done
