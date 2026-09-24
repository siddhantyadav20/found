# Shagun — full play, 2026-09-24

> **Not the human playtest.** Claude played this in the in-app browser, driving
> the page rather than a thumb, at ROADMAP S12. It catches what's wrong on the
> screen and in the words. It can't catch what a person feels, misses or
> misreads. That playtest, on a real phone, is still S12's to do.

Played from a cleared browser at 375 × 812, from the desk, unseeded, through
every episode to The Complete Record: Raju answered with the truth, Mummy
answered as Sameer, Sameer asked where he is and given the Kunal theory,
Raju trusted, the money traced, Nitin protected, Sameer confronted, Meera
written to, airplane mode on, the record sent. **11 of 11.** Earlier walks
(S6–S10) covered the other branches; the solver runs in `tests/ship.test.ts`
cover every ending and every closed route.

**Sev:** B blocker · M major · m minor · p polish.
**Status:** ⬜ open · ✅ fixed · ➖ won't fix (reason given).

| # | Where | Issue | Sev | Status |
|---|---|---|---|---|
| 1 | Desk | The hint leaves **"M." alone on its last line** (and did on the case's share card) | p | ✅ `text-wrap: balance`; the card's hint is narrower |
| 2 | Raju's call | His answer (Hinglish and English, ~110 characters) shows for **3.4 s** before the call ends: too short to read both | m | ✅ Scales with length, 3.4–9 s |
| 3 | Q3 | His version's reply said *"On the record, as his voice notes tell it"*: a quiet signal that it's his. Every other version says *"On the record."* | m | ✅ |
| 4 | Home | The case file widget said **"Open question"** over a Revisit, which the case file calls "Revisit" | m | ✅ |
| 5 | Q10 | The reply told the player the service room was **forty metres** from the gate, a fact from the site plan, which they may never have opened | m | ✅ Removed |
| 6 | Episode 1, offline | In airplane mode, **Raju's call still rang** and Find My, Mummy and Sameer still arrived | m | ✅ Silenced; the phone still dies on time |
| 7 | Your phone | Its composer said **"It isn't your phone."** (found in S9) | m | ✅ |
| 8 | Charger | On a Mac on mains power the gate passes by itself, which is right, but it means the gate is only seen unplugged | p | ➖ Real behaviour; `?battery=unplugged` in dev |
| 9 | Notification Centre | "Low Battery · 2%" is still listed once the phone is charging | p | ➖ iOS keeps it too |
| 10 | Instagram | The profile opens from the story ring, not a profile tab | p | ➖ S4's design; it reads |

**What held:**
- Every question answered by one of its routes, with no dead ends.
- Every arrival timed on the story's clock.
- Dates right across all three nights.
- The Revisit struck and refiled.
- The board by chips, with its three rows lit.
- The line after a long "typing…".
- Meera's whole arc.
- The record in one row style, and the aftermath read back correctly.
- The end card with "You traced 11 of 11 links."
- Storage refused shows its warning.
- Reduced motion is honoured site-wide (`globals.css`).

No app errors in the console. Only the dev server's hot-reload socket, left
over from earlier servers in that tab.

**Still for a person, on a phone** (S12):
- whether the first question lands in 15 seconds
- whether the Revisit feels like being wrong for the right reasons
- whether anyone finds Archived, the bin, Revert or Hidden without the third hint
- whether the confrontation lands
- whether 60 minutes is 60 minutes
- performance on a mid-range Android
