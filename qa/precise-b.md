# Precise pass B, chapters 10 to 17

**101 changes** across the body prose of chapters 10 to 17: 10 Memory and HBM 11, 11 Advanced Packaging 11, 12 Substrates and PCBs 15, 13 Test and Assembly 8, 14 Systems and Networking 12, 15 Data Centers and Power 8, 16 Component Costs 12, 17 Geopolitics 24.

Checks: `node build/build.js` runs with no warnings; `node qa/scripts/check-speak.js` reports no matches (its one match during this pass, "permits rather than denies" in `data/control-thresholds.json`, was in a data file outside these chapters and was fixed by that file's owner before the final run); `node qa/scripts/check-integrity.js` is clean apart from the known "has no supplier entry" lines.

Body prose only; front matter untouched; every `plain` paragraph byte-identical to its front-matter field; every number, citation, glossary term form and heading id kept (no link targets any renamed h3, and ids derive from the heading text). Rules applied: scope made explicit where a noun could be read two ways; idioms and figures of speech replaced by the plain word, a physical verb kept only where it is literal; a simpler word where one serves; a sentence carrying two ideas split. Citations shown as `([source])` with the URL elided.

## 10 Memory and HBM

| Where | Before | After | Why |
|---|---|---|---|
| lede | An AI accelerator is a machine for dragging numbers past arithmetic units, and arithmetic got cheap faster than the dragging did. | An AI accelerator is a machine for moving numbers past arithmetic units, and arithmetic got cheap faster than the moving did. | figurative verb |
| How it works, para 4 | Answering a prompt is where the width earns its cost. | Answering a prompt is what the width is for. | idiom |
| HBM3E | Micron ships the workhorse parts, | Micron ships the high-volume parts, | figurative |
| HBM4, para 2 | That hands TSMC a position inside a product it does not make. | That gives TSMC a role inside a product it does not make. | plainer verb and noun |
| How a stack is built, bullet 2 | ...molds a filler around them in one pass, holding heat and warping in check | ...molds a filler around them in one pass, which limits heat and warping | idiom |
| How a stack is built, bullet 3 | **Stay under the ceiling.** HBM4 raised the cap on a finished cube from 720 micrometers to 775 ... would foul the cooling plate | **Stay under the height limit.** HBM4 raised the height limit on a finished cube from 720 micrometers to 775 ... would hit the cooling plate | "ceiling" and "cap" figurative; "foul" replaced by the plain verb |
| Who makes it, para 2 | It broke ground on a $4 billion packaging plant | It started building a $4 billion packaging plant | idiom |
| Who makes it, last para | HBM is sold forward, so that revenue is contracted long before the wafers exist, and every wafer turned over to HBM is a wafer not making ordinary DRAM, which is how AI demand raises the price of a laptop. | HBM is sold under contracts signed long before the wafers exist. Every wafer turned over to HBM is a wafer not making ordinary DRAM, which is how AI demand raises the price of a laptop. | trade jargon; two ideas split |
| The chokepoint, para 2 | That split is what keeps the Chinese sites of Korean and American firms, and the allied packaging houses on the mainland, inside the trade | That split is what lets the Chinese sites of Korean and American firms, and the allied packaging houses on the mainland, go on receiving HBM | figurative; says what the trade is |
| The chokepoint, para 3 | China's answer is CXMT, and it is behind. The gap is closing from a base that did not exist five years ago, and the barrier for a new entrant is the stacking line and Nvidia's approval. | China's HBM maker is CXMT, and it is behind the three. That gap is closing from a base that did not exist five years ago. The barrier for a new entrant is the stacking line and Nvidia's approval. | "answer" figurative; "the gap" given its scope; two ideas split |
| Key evaluation criteria, Qualification | passing Nvidia's data-rate bar | passing Nvidia's data-rate test | figurative |

## 11 Advanced Packaging

| Where | Before | After | Why |
|---|---|---|---|
| lede | Packaging is how the industry got around that reticle limit, and it is the stage that decides how large an accelerator can be. | Packaging is the stage that lets an accelerator be larger than that rectangle, and it decides how much larger. | "the industry" and "got around" replaced; scope tied to the rectangle just named |
| How it works, para 4 | The individual steps are ordinary. | Each of those packaging steps is ordinary on its own. | "steps" given its scope |
| Variants table header | Ceiling | Size limit | figurative |
| 2.5D, para 1 | ...a credible second source when CoWoS is tight. | ...a credible second source when CoWoS capacity is short. | trade jargon |
| h3 | ### The escape routes | ### Two ways off the silicon interposer | figurative heading; id changes with it, nothing links to it |
| Capacity, last para | ...and CoWoS is easing, partly because | ...and CoWoS supply is easing, partly because | scope: what is easing |
| Who makes it, last para | Amkor broke ground in Peoria in October 2025 on a $7 billion campus | Amkor started building a $7 billion campus in Peoria in October 2025 | idiom |
| The chokepoint, para 1 | Huawei's most credible route around the restrictions is to build big chips | Huawei's most credible response to the restrictions is to build big chips | figurative |
| The chokepoint, para 2 | Each generation on TSMC's roadmap asks more of the interposer. | Each generation on TSMC's roadmap needs a larger interposer. | figurative; says what is asked |
| Key evaluation criteria, Interposer area | is the ceiling on how much logic and memory fit | is the limit on how much logic and memory fit | figurative |
| Key evaluation criteria, Substrate size | limits the rest. | limits everything above it. | "the rest" given its scope |

## 12 Substrates and PCBs

| Where | Before | After | Why |
|---|---|---|---|
| lede | Past its edge the chain turns to epoxy and glass: | Past its edge the wiring turns to epoxy and glass: | "the chain" figurative here; the wiring is what changes material |
| How it works, para 3 | The fix is a core that barely moves, | The fix is a core that barely expands, | "moves" stood for thermal expansion |
| BT substrates | It still wins on unit volume | It still leads on unit volume | figurative |
| Glass core substrates | ...which is why everyone is trying. | ...which is why chipmakers and substrate makers are both trying it. | "everyone" given its scope |
| Glass core substrates, last para | Both programs point past 2027, so glass answers a problem still years away. | Both programs point past 2027, so glass does not help before then. | plainer; the earlier version could be read as the problem being years away |
| The materials underneath, para 1 | Ajinomoto's film is a rounding error in a food company's accounts and a chokepoint in everyone else's. | Ajinomoto's film is a small line in a food company's accounts and a chokepoint for every chipmaker. | figure of speech; "everyone else" given its scope |
| The materials underneath, para 3 | China is attacking this layer, and Nitto Boseki says so itself ... The prize is a chip materials market | Chinese firms are entering this layer, and Nitto Boseki says so itself ... At stake is a chip materials market | "attacking" and "prize" figurative; actor named |
| Who makes it, after bullets | Shinko changed hands: | Shinko has a new owner: | idiom |
| The boards under the GPU, para 1 | how much signal the laminate soaks up | how much signal the laminate absorbs | figurative |
| The boards under the GPU, para 2 | The hedge is Southeast Asia, | The alternative is Southeast Asia, | finance jargon |
| The chokepoint, para 1 | both running flat out and adding capacity on building schedules | both running at full capacity and adding more on building schedules | idiom |
| The chokepoint, para 2 | Flatness breaks first as packages grow. | Flatness is the first thing lost as packages grow. | figurative |
| Key evaluation criteria, CTE | which is what T-glass buys | which is what T-glass provides | figurative |
| Key evaluation criteria, Dielectric | how much signal the core laminate soaks up | how much signal the core laminate absorbs | figurative |
| Takeaways | add capacity on a slower clock than GPUs do. | add capacity more slowly than GPU output grows. | "clock" figurative |

## 13 Test and Assembly

| Where | Before | After | Why |
|---|---|---|---|
| Who makes it, para 2 | Below the two tester makers, the floor breaks into niches with their own suppliers. | Below the two tester makers, the rest of the test and assembly equipment splits into niches, each with its own suppliers. | "the floor" figurative; scope named |
| Who makes it, Handlers bullet | the machines that feed parts into a tester and cook them. | the machines that feed parts into a tester and heat them. | figurative verb |
| Who makes it, last para | are the tightest niche. | are the most concentrated niche. | "tightest" stood for concentration |
| The back end's geography, para 2 | Powertech is chasing the first panel-level packaging line | Powertech aims to run the first panel-level packaging line | figurative |
| The chokepoint, para 1 | Unlike lithography, no tool here has a single supplier. | Unlike lithography, no test or assembly tool has a single supplier. | "here" given its scope |
| The chokepoint, para 2 | Assembly and test is also the part of the chain China is closest to owning, because assembly, dicing, bonding and test tools sit outside the export control lines drawn around lithography and deposition. | Assembly and test is also the part of the chain where China is strongest, because assembly, dicing, bonding and test tools are not covered by the export controls on lithography and deposition. | "owning" and "lines drawn" figurative |
| Takeaways | it now insures everything upstream: | it now protects everything made before it: | figurative; "upstream" made plain |
| Takeaways | The assembly floor beneath it stays fragmented ... which is why export policy has little grip here. | The assembly business beneath it stays fragmented ... which is why export controls have little effect on assembly and test. | "floor" and "grip" figurative; "here" given its scope |

## 14 Systems and Networking

| Where | Before | After | Why |
|---|---|---|---|
| How it works, para 2 | ...and the switch chips, the traffic directors that pass data between any two modules at full speed. | ...and the switch chips, which pass data between any two modules at full speed. | figure of speech; the clause after it already says what they do |
| How it works, para 3 | Rack-scale systems do away with the baseboard. | Rack-scale systems drop the baseboard. | idiom |
| Scale-up, Google bullet | uses optical switches to stitch cubes into superpods | uses optical switches to join cubes into superpods | figurative verb |
| Scale-out, para 1 | InfiniBand, the specialized network supercomputers grew up on, owned this layer when AI clusters were small and alike. Ethernet took it back on raw capacity first: | InfiniBand, the specialized network built for supercomputers, carried nearly all scale-out traffic when AI clusters were small and alike. Ethernet overtook it on raw capacity first: | "grew up on", "owned", "took it back" figurative; "this layer" given its scope |
| Scale-out, para 2 | Nvidia sells both sides of the argument, telling investors | Nvidia sells both networks, telling investors | figurative; says what is sold |
| Who makes it, para 1 | The rules now follow the firm, wherever its plants sit: | The American rules now follow the firm, wherever its plants sit: | "the rules" given its scope |
| Who makes it, para 2 | The lasers inside those modules come from far fewer hands. | The lasers inside those modules come from far fewer firms. | figurative |
| Who makes it, para 3 | the Ethernet switch chips other firms build boxes around, | the Ethernet switch chips other firms build their switches around, | jargon |
| Who makes it, para 4 | Physical assembly belongs to Taiwan. | Physical assembly is done by Taiwanese firms. | figurative; actor named |
| The chokepoint, para 2 | The parts that cannot be replaced that fast sit underneath the assembly. | The parts that cannot be replaced that fast are the components that go into the rack. | figurative; scope named |
| The chokepoint, Indium bullet | and the indium under it is 70 percent Chinese | and the indium those lasers need is 70 percent Chinese | "under it" figurative; referent named |
| Key evaluation criteria, Supply concentration | sits under the assembly: many firms assemble the modules; | is in the components: many firms assemble the modules; | figurative |

## 15 Data Centers and Power

| Where | Before | After | Why |
|---|---|---|---|
| How it works, para 4 | a building loop that dumps it outdoors, | a building loop that releases it outdoors, | colloquial verb |
| How it works, para 5 | and the 200 kg busbars feeding a single rack can go | and the 200 kg busbars feeding a single rack are no longer needed | idiom |
| Cooling, Air bullet | work at moderate densities but stop paying off well below AI rack loads. | work at moderate densities but cannot carry away the heat of an AI rack. | idiom; says the physical limit |
| Cooling, Direct-to-chip bullet | every serious AI hall is now plumbed. | every new AI hall is now plumbed for it. | "serious" vague; object of "plumbed" named |
| Where the electrons come from, Nuclear bullet | Constellation sold the 835 MW Crane Clean Energy Center forward to Microsoft before a spade went in | Constellation agreed to sell the output of the 835 MW Crane Clean Energy Center to Microsoft before restart work began | "sold forward" is trade jargon and "a spade went in" an idiom; the plant is a restart, so "restart work" is the literal event |
| Who makes it, para 1 | The largest data center operators pay for it. | The largest data center operators pay for the buildout. | "it" given its referent |
| The chokepoint, Gas turbines bullet | against a book of 116 GW | against a backlog of 116 GW | jargon; the source's own word |
| Takeaways | on every serious operator | on every large operator | "serious" vague; the size is what is meant |

## 16 Component Costs

| Where | Before | After | Why |
|---|---|---|---|
| lede | ...or because one firm can charge. | ...or because one firm sets the price. | elliptical; says what is charged |
| h3 | ### Memory is the bill | ### Memory is the largest line | figurative heading; id changes with it, nothing links to it |
| Packaging, substrate and test | for why that capacity binds first. | for why packaging capacity runs out first. | economics jargon; "that capacity" given its scope |
| From package to rack, para 2 | burns 1.59 TWh a year, | uses 1.59 TWh a year, | figurative verb |
| h2 | ## Where the money sits | ## Where the money goes | figurative heading; id changes with it, nothing links to it |
| Where the money goes, para 1 | everything wrapped around it gets dearer. | everything wrapped around it gets more expensive. | plainer, American |
| Compressibility table, EUV | price set by a twenty-year optics curve. | price set by twenty years of optics development. | "curve" jargon |
| Compressibility table, Design and EDA | Engineering cost amortises across volume. | Engineering cost is spread across volume. | jargon and British spelling |
| Compressibility table, OSAT | clears on price. | sold on price. | market jargon |
| Compressibility table, Wafers and gases | thin spreads. | thin margins. | trading jargon |
| Compressibility table, ODM | Low-teens margins on specified content. | Low-teens margins on parts the customer specifies. | jargon |
| Takeaways | a custom chip can attack it by buying the same wafers and the same memory. The lines underneath are harder to attack: | a custom chip can undercut it by buying the same wafers and the same memory. The lines underneath are harder to cut: | "attack" figurative, twice |

## 17 Geopolitics

| Where | Before | After | Why |
|---|---|---|---|
| The shape of the contest, para 2 | country-wide prohibition asks only where the box is going. | country-wide prohibition asks only where the item is going. | "the box" figurative |
| Chokepoints and who holds them, Taiwan bullet | rolled forward from the 2022 industry baseline | carried forward from the 2022 industry baseline | jargon |
| Chokepoints and who holds them, China bullet | on a broader definition that sweeps in discrete, analog and power chips | on a broader definition that includes discrete, analog and power chips | figurative verb |
| Chokepoints and who holds them, closing para | No country is self-sufficient, so controls bite in both directions. | No country is self-sufficient, so each side's controls can hurt the other. | "bite" figurative; says whose controls and whom they hurt |
| Campaign, bullet 2 lead | **7 October 2022, the break.** | **7 October 2022, the first country-wide rules.** | figurative; the timeline figure's own description |
| Campaign, bullet 3 | to slip under the 2022 line while keeping the compute | to fall under the 2022 threshold while keeping the compute | "slip under" and "line" figurative |
| Campaign, bullet 4 lead | **2 December 2024, the widest package.** | **2 December 2024, the widest rule.** | "package" figurative in a chapter about chip packages |
| Cloud and remote access, para 2 | The rules reach that trade through the people holding the chips. | The American rules reach that trade through the firms holding the chips. | "the rules" given its scope; the consignee is a firm |
| Cloud and remote access, para 3 | The diffusion rule went at the other end, the output. | The diffusion rule addressed the other end, the output. | idiom |
| Cloud and remote access, para 4 | So the controls reach the chip, the weights above the line, and the promises a licensed consignee signs. | So the controls reach the chip, frontier model weights, and the promises a licensed consignee signs. | "above the line" figurative; glossary alias used |
| China's response, para 1 | (SAMR) is the antitrust lever, | (SAMR) is the antitrust authority, | "lever" figurative |
| China's response, para 2 | The retaliation itself goes at the inputs. | The retaliation itself targets the inputs. | idiom |
| China's response, after mineral bullets | The blunter lever is demand. | The blunter instrument is demand. | "lever" figurative; "instrument" is the word the chapter already uses for policy tools |
| China's response, last para | The leading edge is where it stalls. SMIC prints 7 nm-class logic ... because it cannot buy the finer light, | Substitution stalls at the leading edge. SMIC prints 7 nm-class logic ... because it cannot buy an extreme-ultraviolet scanner, | "it" given its referent; "the finer light" named |
| China's response, last para | most bought before the December 2024 rules bit, | most bought before the December 2024 rules took effect, | "bit" figurative |
| Taiwan, para 2 | The counter is that staying irreplaceable | The counterargument is that staying irreplaceable | clipped word |
| Where the chips go, para 1 | The Gulf bought its way inside the fence. | The Gulf has been let inside the controls. | idiom; the paragraph does not establish a purchase, so the plain statement is what the evidence supports |
| Where the chips go, para 1 | so the favor attaches to the named list | so the favorable treatment is tied to the named buyers | figurative; scope named |
| Where the chips go, para 2 | Southeast Asia is where the controls leak. | Southeast Asia is where chips get past the controls. | figurative |
| Who gains and who pays, Netherlands and Japan | Their tool makers are the fence, so they gain a say | Their tool makers build the controlled machines, so they gain a say | figurative |
| Who gains and who pays, closing para | The Gulf comes out ahead without making anything: | The Gulf gains without making anything: | idiom |
| What to watch, MATCH Act | **The MATCH Act's 150-day clock.** | **The MATCH Act's 150-day deadline.** | "clock" figurative |
| What to watch, SMIC | multiply exposed for want of an extreme-ultraviolet machine | multiply exposed because SMIC has no extreme-ultraviolet machine | archaic phrase; actor named; "multiply exposed" kept as the glossary alias |
| Takeaways | export controls try to turn that into leverage. They have held China below the leading edge, where extreme-ultraviolet machines, their resist and high-bandwidth memory stay out of reach. | export controls are built on that. They have held China below the leading edge, where it still cannot get extreme-ultraviolet machines, their resist or high-bandwidth memory. | "leverage" and "out of reach" figurative |

Kept on purpose: "raises a red flag" (Cloud and remote access, para 3) is BIS's own term for the compliance signal in its guidance, so it stays as the regulator's word; "small yard with a high fence" and "small yard" are the named doctrine and a glossary term; "silicon shield" likewise; "national champion" is the standard policy term.
