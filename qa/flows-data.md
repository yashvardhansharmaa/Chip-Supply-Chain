# The board: nine flows from 43 events

Every event carries `id` and `flows`: 48 memberships, 41 states.

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

A state gives the tightest gate then standing, not the delta, so no row loosens on an event that tightened it.

## Changes from the sketch

- **Super Micro (2026-03-19)** to `ai-chips`, not `entity`: the summary names no listed firm, only GPU servers diverted to China.
- **Applied Materials (2026-02-12)** to `entity` and `us-tools`: the goods were ion implanters.
- **Dichlorosilane (2026-09-07)** and **foundry due diligence (2025-01-16)** are members with no state. Duties are not a gate; the diligence rule binds foundries, not the China gate.
- **Section 232 (2026-01-14)** stayed in `industrial` alone, though its tariff falls on H200s bound for China.

## Unclear statuses

- **2026-08-26**: Beijing's instrument is unpublished. `shut` reads off the effect Nvidia filed, licensed stock unsold. Kept in `china-market` alone.
- **2023-10-17, 2025-04-09**: licence requirements in the text, recorded `shut` because each closed the last part still moving.
- **2025-07-14**: the summary also has Beijing discouraging buyers, `china-market` material inside a US action. Left in `ai-chips`.
