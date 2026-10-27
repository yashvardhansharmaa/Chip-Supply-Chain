#!/bin/sh
# The look gate's shots for AI Chips, design round five's tick list: the page as it opens, two chips, four chips and a chip's
# card open on the chart, at 1440 light and dark and at 390, then highest first, the phone's list sheet, the four chips'
# labels on the crowded bandwidth chart and /chips/. One spec per call of qa/redesign/shots.js. A comparison shot lands as
# Show the comparison lands it: clear of the masthead and, on a phone, of the tray. The PNGs stay local (qa/**/*.png is ignored).
# usage: sh qa/redesign/shots-stage-chips2.sh [outdir] [base]   (defaults qa/redesign/shots/stage-chips2, http://127.0.0.1:8772)
O=${1:-qa/redesign/shots/stage-chips2}
B=${2:-http://127.0.0.1:8772}
TWO="pick=nvidia-b300,amd-mi355x"
FOUR="pick=nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x"
CMP="CP.Landscape.renderTray(true);CP.Landscape.toCompare();"
CARD="CP.Landscape.openCard('nvidia-h100',{show:true});"
shot() { node qa/redesign/shots.js "$O" "$1"; }
for t in light dark; do
  shot "arrival-1440-$t|$B/#/landscape|1440|$t"
  shot "arrival-work-1440-$t|$B/#/landscape|1440|$t|.aic-ws"
  shot "two-1440-$t|$B/#/landscape?$TWO|1440|$t|||$CMP"
  shot "two-full-1440-$t|$B/#/landscape?$TWO|1440|$t||full"
  shot "four-1440-$t|$B/#/landscape?$FOUR|1440|$t|||$CMP"
  shot "four-full-1440-$t|$B/#/landscape?$FOUR|1440|$t||full"
  shot "card-1440-$t|$B/#/landscape?$TWO|1440|$t|||$CARD"
done
shot "arrival-390|$B/#/landscape|390"
shot "arrival-chart-390|$B/#/landscape|390||.aic-atlas"
shot "two-390|$B/#/landscape?$TWO|390||||$CMP"
shot "four-390|$B/#/landscape?$FOUR|390||||$CMP"
shot "four-parts-390|$B/#/landscape?$FOUR|390||||CP.Landscape.renderTray(true);window.scrollTo(0,document.getElementById('cx-h-parts').getBoundingClientRect().top+scrollY-150);"
shot "card-390|$B/#/landscape?$TWO|390||||$CARD"
shot "list-390|$B/#/landscape?$TWO|390||||CP.Landscape.listOpen(true);"
shot "crowd-390|$B/#/landscape?measure=mem|390||||var d=document.querySelector('#cx-chart .pt[data-id=nvidia-b300]');d.scrollIntoView({block:'center'});CP.Landscape.openCrowd(CP.Landscape.crowd(+d.querySelector('.dot').getAttribute('cx'),+d.querySelector('.dot').getAttribute('cy'),11));"
shot "rank-1440|$B/#/landscape?$TWO&measure=bw&view=rank|1440||.aic-atlas"
shot "rank-390|$B/#/landscape?$TWO&measure=bw&view=rank|390||.aic-atlas"
shot "four-390-dark|$B/#/landscape?$FOUR|390|dark|||$CMP"
shot "four-bw-1440|$B/#/landscape?$FOUR&measure=bw|1440||#cx-chart"
shot "four-bw-390|$B/#/landscape?$FOUR&measure=bw|390||#cx-chart"
shot "ref-chips-1440|$B/chips/|1440||.ctl"
shot "ref-chips-table-1440|$B/chips/|1440||#specs"
