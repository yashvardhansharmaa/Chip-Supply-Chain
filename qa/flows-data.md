# The board: nine flows from 43 events

43 events now carry `id` and `flows`. 48 memberships, 41 states.

## State sequences

- `ai-chips`: open → licence (2022-08-31) → licence (2022-10-07) → shut (2023-10-17) → shut (2025-04-09) → case (2025-07-14) → case (2025-08-11) → case (2025-12-08) → case (2026-01-15)
- `us-tools`: open → licence (2022-10-07) → licence (2023-10-17) → licence (2024-12-02) → licence (2025-08-29)
- `allies`: open → licence (2023-07-23) → licence (2023-09-01) → licence (2024-09-06)
- `hbm`: open → licence (2024-12-02)
- `entity`: open → shut (2018-04-15) → shut (2018-10-30) → shut (2019-05-16) → shut (2020-05-15) → shut (2020-08-17) → shut (2020-12-18) → shut (2025-09-29) → shut (2025-11-10)
- `minerals`: open → licence (2023-07-03) → shut (2024-12-03) → shut (2025-04-04) → shut (2025-10-09) → licence (2025-11-10)
- `china-market`: open → shut (2023-05-21) → shut (2026-08-26)
- `diffusion`: open → licence (2025-01-13) → case (2025-05-13) → case (2025-05-15) → case (2026-07-10)
- `industrial`: open → policy (2022-08-09) → policy (2024-05-24) → policy (2025-03-03) → policy (2025-08-22) → policy (2026-01-14) → policy (2026-01-15)

A state is the tightest gate standing on the flow's goods at that date, not the delta. Otherwise a row loosens on an event that tightened it.

## Placed differently from the sketch

- **Super Micro (2026-03-19)** to `ai-chips`, not `entity`. The summary names no listed firm: it is $2.5 billion of GPU servers diverted to China, so it is chip-control enforcement.
- **Applied Materials (2026-02-12)** to `entity` and `us-tools`. The goods were ion implanters, which is the tools flow; the gate broken was SMIC's listing.
- **Dichlorosilane duties (2026-09-07)** are in `china-market` with no state. Anti-dumping deposits are not a gate, and none of the five statuses fits.
- **Foundry due diligence (2025-01-16)** is in `ai-chips` with no state. It puts a duty on foundries; it does not move the China gate.
- **Section 232 (2026-01-14)** stayed in `industrial` alone, though the same 25 percent tariff falls on H200s bound for China; **PRC H200 restrictions (2026-08-26)** stayed in `china-market` alone, though they decide what the ai-chips gate is worth.

## Statuses the summary left unclear

- **2026-08-26**: the summary says Beijing's instruments are not published. `shut` is read off the effect Nvidia filed: licensed stock unsold, $0.4 billion written down.
- **2023-10-17 and 2025-04-09**: both are licence requirements in the text. Recorded `shut` because each closed the last part that still moved. `licence` would draw them as a loosening.
- **2025-07-14**: the same summary carries Beijing discouraging buyers, which is `china-market` material inside a US action. Left in `ai-chips`.
