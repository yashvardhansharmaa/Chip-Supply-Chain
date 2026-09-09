# Specimen review — accelerator packages

9 September 2026. Every chip in `data/landscape.json` now has its own package layout in
`data/landscape-layouts.json`, and `specimens/package.js` draws all of them. Before this,
only chips with an inline `layout` got a render and the rest fell back to the two-die,
eight-HBM Blackwell default, so most of the AI Chips page showed the same picture.

## What changed in `specimens/package.js`

The specimen still takes the layout shape the brief defines. Four optional fields were added,
and the drawing was rebuilt around a clearer visual hierarchy.

New layout fields, all optional and all ignored by older layouts:

- `interposers: [{x, y, w, h}]` — several 2.5D sub-assemblies on one substrate instead of a
  single centred interposer. Trainium3 and the Ascend 910C are built this way, and drawing
  them as one big interposer would have been wrong.
- `base: [{x, y, w, h}]` — base or I/O dies. Any die in `dies` whose centre falls inside a
  base rectangle is drawn stepped up on top of it, which is what makes the MI355X, the
  MI455X and Jalapeño read as 3D-stacked parts rather than flat chiplet arrays.
- `interposer: null` — a flip-chip part with no interposer at all. The die sits straight on
  the build-up substrate. Only the Groq LPU uses it.
- `squareMm` on the wafer-scale variant — the square actually cut from the wafer, drawn in
  amber around the die grid.

Layout objects may also carry `estimated`, `sources` and `note`; the renderer ignores them.

Drawing changes:

- Vertical dimensions are exaggerated 4x against the plan. A real package is about 100 mm
  across and 5 mm tall; drawn honestly it is a grey rectangle. The caption says so.
- The substrate top is drawn only where it is exposed — the interposer rectangles are punched
  out of it — so the interior stopped reading as noise. The side walls and the ball grid
  underneath were thinned and lightened.
- A proper lid-less stiffener ring: outer and inner walls, a top face, and crisp edges, sitting
  at die height on the substrate perimeter with the dies and stacks left open above it. Its
  inner edge is clamped so it can never cut across the interposer.
- The interposer now has a visible silicon surface, a through-via dot field and an outlined
  edge, so it reads as a plate rather than a hole.
- Logic dies became the busiest ink in the picture: a solid top at higher point density, a core
  outline, memory-PHY strips down both long edges with bump rows, and a grid of block outlines
  sized from the die's own dimensions.
- Base dies are drawn lower and lighter than the chiplets, with a hybrid-bond pad field on the
  exposed shoulder, so the step between the two tiers is visible in the front view.
- HBM stacks keep the amber tops and gained eight layer lines each, drawn as closed outlines at
  the height of each die in the stack.
- Point budget is scaled by package area against a 6,500 mm² reference, so small parts such as
  the Groq LPU do not come out thin and the MI455X does not blow the budget. Every chip lands
  between 42,764 and 133,472 points.
- The wafer-scale branch draws the wafer, the cut square in amber, the full die grid with scribe
  lines and a light core grid inside each die, and reports the live die count in its caption.

## How the numbers were arrived at

Vendors publish die counts, memory configurations and process nodes. Almost none of them publish
package dimensions, and the one teardown house that measures them is not a source this project
may cite. So the method was:

1. Take the published part counts — number of compute dies, base dies, HBM stacks.
2. Use the physical constants: the lithography reticle field is 26 x 33 mm, so a
   "reticle-limited" die is drawn at or just under that; a JEDEC HBM3/3E stack is about
   11 x 11 mm and an HBM4 stack about 11 x 12 mm.
3. Lay the parts out in the arrangement shown in published package photographs — normally
   compute in the middle, stacks in columns down the two long edges.
4. Take the interposer as the geometric envelope of that arrangement plus a small margin, and
   the substrate as the interposer plus roughly 8 to 10 mm of shoulder.

Everything except the Cerebras entry is therefore marked `"estimated": true`, with a one-line
`note` saying which parts are published and which are inferred.

One honest caveat worth repeating: for the largest parts the envelope comes out bigger than the
reticle multiples usually quoted for their packaging technology. Two 26 x 32.5 mm dies with four
11 x 11 mm stacks down each side cannot fit in less than about 3,600 mm², while CoWoS-L for
Blackwell is generally described as 3.3 to 3.5 reticle fields, or 2,830 to 3,000 mm². The parts
have to go somewhere, so the drawing follows the geometry and the note flags the tension. Nothing
here should be read as a measurement.

A geometry check was run over all 18 conventional layouts: every die, base die and stack sits
inside an interposer, no two top-tier parts overlap, the substrate keeps at least 4 mm of margin
on every side, and the stiffener ring clears the interposer. All 18 pass.

## Per-chip layouts

### Nvidia B200  `nvidia-b200`

- Layout: 2 dies; 8 x HBM 11 x 11; interposer 78 x 50; substrate 95 x 68
- Estimated: yes · 91,088 points
- Note: Nvidia states two reticle-limited 4NP dies joined by NV-HBI and 192 GB of HBM3E in eight stacks; the die and stack footprints are the reticle limit (26 x 33 mm) and the JEDEC HBM package (about 11 x 11 mm), and the interposer and substrate rectangles are the geometric envelope of that arrangement, not published dimensions.
- Sources: <https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/>, <https://www.nvidia.com/en-us/data-center/dgx-b200/>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### Nvidia B300 (GB300 NVL72)  `nvidia-b300`

- Layout: 2 dies; 8 x HBM 11 x 11; interposer 78 x 50; substrate 95 x 68
- Estimated: yes · 91,088 points
- Note: Blackwell Ultra keeps the two reticle-sized dies and eight stacks of B200 and swaps 8-high HBM3E for 12-high, so the plan view is the same and only the stacks get taller; the same envelope caveat applies.
- Sources: <https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/>, <https://www.nvidia.com/en-us/data-center/gb300-nvl72/>, <https://www.micron.com/about/blog/applications/ai/micron-continues-memory-industry-leadership-with-hbm3e-12-high-36gb>

### Nvidia Rubin (VR200)  `nvidia-vr200`

- Layout: 2 dies; 8 x HBM 11 x 12; interposer 80 x 54; substrate 98 x 74
- Estimated: yes · 91,181 points
- Note: Nvidia says Rubin is built from two reticle-limited compute dies on one package with up to 288 GB of HBM4 in 12-high stacks; stack footprint, interposer and substrate are estimated, and the small I/O dies described in press reports are left out because Nvidia has not shown them.
- Sources: <https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/>, <https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### Nvidia H200 (China-licensed configuration)  `nvidia-h200-china`

- Layout: 1 die; 6 x HBM 11 x 11; interposer 54 x 38; substrate 72 x 56
- Estimated: yes · 74,308 points
- Note: One monolithic Hopper die with six HBM3E stacks, three per long edge, on a CoWoS-S interposer; Nvidia publishes the memory configuration but no dimensions, so the die, interposer and substrate rectangles are estimated (the envelope works out near 2.4 reticle fields, in line with CoWoS-S of that generation).
- Sources: <https://www.nvidia.com/en-us/data-center/h200/>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### AMD Instinct MI355X  `amd-mi355x`

- Layout: 8 dies; 2 base dies 18.5 x 34; 8 x HBM 11 x 11; interposer 62 x 50; substrate 76.8 x 72
- Estimated: yes · 101,534 points
- Note: Eight N3P accelerator dies hybrid-bonded onto two N6 I/O dies, with eight 12-high HBM3E stacks four to a side; the OAM package outline is carried over from the published 76.8 x 72 mm MI300X package and the chiplet and interposer rectangles are estimated.
- Sources: <https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html>, <https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf>, <https://inferencex.semianalysis.com/chips/mi355x>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### AMD Instinct MI455X  `amd-mi455x`

- Layout: 10 dies; 2 base dies 24 x 50; 12 x HBM 11 x 11.5; interposer 74 x 74; substrate 96 x 94
- Estimated: yes · 133,472 points
- Note: Eight N2 accelerator dies on two N3 I/O dies, two separate fabric-and-cache dies and twelve HBM4 stacks, six to a side; AMD calls it the largest chip ever built on CoWoS-L but publishes no dimensions, so every rectangle here is estimated from the part counts.
- Sources: <https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html>, <https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### Google TPU v7 (Ironwood)  `google-tpu-v7-ironwood`

- Layout: 5 dies; 8 x HBM 11 x 11; interposer 70 x 60; substrate 88 x 78
- Estimated: yes · 91,983 points
- Note: Google states eight HBM3E stacks and 192 GiB per chip; the two compute chiplets in the middle and the three small interconnect dies along the top edge are read off published package photographs, and all dimensions are estimated.
- Sources: <https://cloud.google.com/blog/products/compute/inside-the-ironwood-tpu-codesigned-ai-stack>, <https://docs.cloud.google.com/tpu/docs/tpu7x>, <https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/>

### Google TPU 8i (Zebrafish)  `google-tpu-8i`

- Layout: 2 dies; 6 x HBM 11 x 11; interposer 54 x 50; substrate 72 x 68
- Estimated: yes · 76,514 points
- Note: The inference half of the eighth-generation TPU is described as one compute die, one I/O die and six HBM stacks feeding 288 GB at 8.6 TB/s; nothing physical has been published, so the whole layout is estimated from that part count.
- Sources: <https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive>

### Amazon (Annapurna Labs) Trainium3  `aws-trainium3`

- Layout: 2 dies; 4 x HBM 11 x 11; 2 interposers, each 40 x 30; substrate 96 x 46
- Estimated: yes · 79,164 points
- Note: Trainium3 is two CoWoS-R sub-assemblies on one substrate rather than a single interposer: each carries one compute die and two 12-high HBM3E stacks, and the two dies talk through the substrate; the rectangles are estimated.
- Sources: <https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential>, <https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium3.html>

### Microsoft Maia 200  `microsoft-maia-200`

- Layout: 1 die; 6 x HBM 11 x 11; interposer 56 x 40; substrate 74 x 60
- Estimated: yes · 73,588 points
- Note: Microsoft gives 140 billion transistors on N3P, 216 GB of HBM3E and 272 MB of SRAM but says nothing about the package; six stacks divide the capacity evenly at 36 GB each, so this is drawn as one large die with three stacks per edge and every dimension is estimated.
- Sources: <https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/>, <https://techcommunity.microsoft.com/blog/azureinfrastructureblog/deep-dive-into-the-maia-200-architecture/4489312>

### Meta MTIA 400  `meta-mtia-400`

- Layout: 5 dies; 8 x HBM 11 x 11; interposer 70 x 50; substrate 88 x 68
- Estimated: yes · 92,934 points
- Note: MTIA 400 is a multi-chip package with two compute chiplets, two network/IO chiplets and a host SoC die around eight HBM3E stacks; Meta has published the part count and the 9.4 TB/s figure but no dimensions, so the layout is estimated.
- Sources: <https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/>, <https://engineering.fb.com/2026/08/24/networking-traffic/mtia-300-meta-training-chip-built-in-nics/>

### OpenAI with Broadcom Jalapeño  `openai-jalapeno`

- Layout: 2 dies; 2 base dies 26 x 33; 6 x HBM 11 x 12; interposer 78 x 44; substrate 96 x 62
- Estimated: yes · 96,865 points
- Note: Broadcom builds Jalapeno on its 3.5D face-to-face platform, so the compute dies are stacked on base dies inside a 2.5D package; 216 GB at 15.4 TB/s divides cleanly into six 12-high HBM4 stacks, and the die count, sizes and interposer are estimated.
- Sources: <https://openai.com/index/jalapeno-first-results/>, <https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/>, <https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia>

### Intel Gaudi 3  `intel-gaudi3`

- Layout: 2 dies; 8 x HBM 11 x 10.5; interposer 74 x 46; substrate 90 x 66
- Estimated: yes · 86,739 points
- Note: Intel’s white paper describes two identical compute dies joined across a high-speed interposer with eight HBM2E devices making up 128 GB; the die, stack and substrate rectangles are estimated from that description.
- Sources: <https://www.intel.com/content/www/us/en/content-details/817486/intel-gaudi-3-ai-accelerator-white-paper.html>, <https://docs.habana.ai/en/latest/Gaudi_Overview/Gaudi_Architecture.html>, <https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm>

### Cerebras WSE-3 Turbo (CS-4)  `cerebras-wse3-turbo`

- Layout: wafer-scale: 300 mm wafer, 215 mm square, 12 x 7 die grid
- Estimated: no · 73,657 points
- Note: Cerebras publishes the two numbers that fix this drawing: 46,225 mm² of silicon, which is a 215 mm square, cut from a single 300 mm wafer; the 12 x 7 grid follows from the 84 reticle fields that fill that square, and there is no interposer, no substrate and no HBM.
- Sources: <https://www.cerebras.ai/product-chip>, <https://www.cerebras.ai/blog/introducing-cerebras-cs-4>, <https://www.cerebras.ai/blog/ultrafast-frontier-inference-cerebras-deep-dive-at-hot-chips-2026>

### Groq LPU  `groq-lpu`

- Layout: 1 die; no HBM; no interposer; substrate 52 x 52
- Estimated: yes · 42,764 points
- Note: The LPU keeps every weight in on-die SRAM, so there is no HBM and no interposer at all: one large 14 nm die flip-chipped straight onto a build-up substrate; the roughly 725 mm² die is drawn square and the substrate is estimated.
- Sources: <https://groq.com/lpu>, <https://newsletter.semianalysis.com/p/groq-inference-tokenomics-speed-but>

### Huawei (HiSilicon) Ascend 910C  `huawei-ascend-910c`

- Layout: 2 dies; 8 x HBM 11 x 10.5; 2 interposers, each 50 x 34; substrate 116 x 50
- Estimated: yes · 91,607 points
- Note: The 910C is two complete 910B-class sub-assemblies on one organic substrate: each is a single compute die with four HBM2E stacks on its own silicon interposer, eight stacks in all; the dimensions are estimated from package photographs.
- Sources: <https://arxiv.org/abs/2506.12708>, <https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72>

### Huawei (HiSilicon) Ascend 950PR  `huawei-ascend-950pr`

- Layout: 1 die; 4 x HBM 11 x 11; interposer 54 x 36; substrate 72 x 54
- Estimated: yes · 66,009 points
- Note: Huawei says the 950PR is the first Ascend with its own HiBL 1.0 stacked memory and reports a monolithic compute die rather than the stitched pair of the 910C; four stacks fit the stated capacity and bandwidth, and everything here is estimated.
- Sources: <https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech>, <https://www.huawei.com/en/news/2025/9/hc-superpod-innovation>

### Cambricon Siyuan 590 (MLU590)  `cambricon-siyuan-590`

- Layout: 1 die; 4 x HBM 11 x 11; interposer 52 x 34; substrate 70 x 52
- Estimated: yes · 64,840 points
- Note: Cambricon publishes neither the die count nor the memory configuration for the MLU590; this is the smallest arrangement consistent with a single SMIC 7 nm-class die and the reported HBM capacity, and every number is estimated.
- Sources: <https://www.cambricon.com/>

### Moore Threads MTT S5000  `moore-threads-mtt-s5000`

- Layout: 1 die; 4 x HBM 11 x 11; interposer 50 x 34; substrate 68 x 52
- Estimated: yes · 63,524 points
- Note: Moore Threads gives 80 GB at 1.6 TB/s, which is about four HBM2E-class stacks, and nothing else; the single die and all dimensions are estimated.
- Sources: <https://en.mthreads.com/product/S5000>

## Previews

`node build/preview.js package '<json>'` was run for all nineteen chips and for the no-parameter
default. Each contact sheet is kept at `qa/packages/<chip-id>.png`; `qa/package.png` holds the
default. Four were looked at closely while the specimen was being tuned, as the task asked:

- **B200** — two dark near-reticle dies filling the middle with a visible seam between them, four
  amber-topped stacks down each side, the ring and the ball grid framing it. The reference render.
- **MI355X** — the step reads: eight small chiplets in a 4 x 2 grid sitting proud of two larger
  base dies, whose shoulders show as a thin frame around each group of four. Clearly a different
  animal from the B200 at a glance.
- **TPU v7 Ironwood** — two compute chiplets in the middle, four stacks a side, and the three small
  interconnect dies along the top edge that give the Ironwood package its distinctive top-heavy look.
- **WSE-3 Turbo** — the 300 mm wafer with the 215 mm cut square in amber and all 84 dies of the
  12 x 7 grid drawn with their scribe lines. No substrate, no stacks, no ring; the front view is a
  single line, which is the point.

Two problems were caught and fixed during the pass: the MTIA 400's network dies were wide enough to
collide with the left and right HBM columns, and the Gaudi 3 stacks overhung the interposer by half a
millimetre. Both were found by the geometry check, not by eye.

## Build

`node build/build.js` from the project root runs clean. The report lists the `package` specimen and
19 chips, and `dist/index.html` carries the merged layouts — spot-checked on the MI355X substrate
(76.8 x 72), the Cerebras `squareMm` (215) and the Cerebras note.
