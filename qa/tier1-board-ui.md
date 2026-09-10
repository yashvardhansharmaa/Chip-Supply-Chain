# The board, rebuilt to licence outcomes

`Geo` in `src/app.js`, the controls block of `src/template.html`, `src/modules/controls.css`.
Shots in `qa/tier1/`.

## What changed

The pill words are the outcome now: `open` No licence, `case` Case by case, `denial` Presumption of
denial, `prohibited` Prohibited, `policy` Policy, ramped outlined muted, dashed ink, amber, solid ink.
`suspendedUntil` draws the pill muted and tags it "Suspended until 10 Nov 2026"; when the stay lapses the
outcome underneath returns. Every state prints "from 15 Jan 2026 · announced 13 Jan 2026" and a citation
line, "91 FR 1685 · 15 CFR 742.6(b)(10)(iii)", linked to the source. A link may not sit inside a button,
so the row header is now the grid with the button laid over it, labelled by the state it shows. Every
history entry carries its announced and in-force dates, an instrument tag and its FR and CFR line, and an
open row ends with "Read the chapter". By date gained the same three. The export adds `announced`,
`suspendedUntil`, `fr`, `cfr` and `url`, and the phone year line counts by outcome and names stays apart.
Ordering runs on the effective date; `announced` sorts nothing.

## Fallbacks, all tested

`licence` reads as denial, `shut` as prohibited, anything unknown as open. No `cite`, nothing printed; a
`cite` holding only a URL links the document's host. No `announced`, the effective date stands alone. No
`chapter`, no link. A lapsed `suspendedUntil`, no tag and no count. `flows` may be a bare array or
`{ flows: [] }`, `initial` a string or an object. Ten flows read "Ten things move across the chokepoint".

## What the data could still supply

Nothing uses `pending` or `licence-exception`, so no rule in comment is marked. Events carry
`effectiveDate` but no `announced`, so one dated by its effective day shows a single date and no in-force
line. `licence-policy` and `licence-exception` read Licence policy and Exception.

## The legend, word for word

- **No licence** None needed.
- **Case by case** A licence is required, and each application is judged on its own.
- **Presumption of denial** A licence is required and will normally be refused. An Entity List listing
  sits here.
- **Prohibited** No licence to be had, or a flat ban.
- **Policy** Money and tariffs, not a gate.
- **Suspended** The instrument is stayed until a date. The outcome beside it returns when the stay ends.

Build clean, no console errors, no sideways scroll at 375.
