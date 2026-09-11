#!/bin/sh
# Trial crops of the plan view for the cover band. Run from the project root.
set -e
R="python3 qa/cover/render.py"
D=qa/cover/tmp
mkdir -p $D
PLAN="--rx 1.5708 --ry 0 --rz 1.5708 --persp 0"
COM="--size 1000 --rmin 1.0 --rmax 1.8 --aspect 210:153 --fill 1"
$R $D/band-fit.png    $PLAN $COM --zoom 1.00
$R $D/band-z112.png   $PLAN $COM --zoom 1.12 --ox 0.045
$R $D/band-z128.png   $PLAN $COM --zoom 1.28 --ox 0.085
$R $D/band-right.png  --rx 1.5708 --ry 0 --rz -1.5708 --persp 0 $COM --zoom 1.18 --ox -0.06
# candidate B plate: whole die, landscape plan, no crop
$R $D/plate.png       $PLAN --size 1000 --rmin 1.0 --rmax 1.8
echo done
