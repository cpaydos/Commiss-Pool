# Week 8 Close / Score Export Build

Starting point: user-uploaded `Commiss-Pool-Week8-PICKS-LOADED(1).zip`.

## Added
- A `Close Week / Export` button in the header.
- On click, the app refreshes ESPN scores and checks that every configured Week 8 game is marked final.
- If any game is not final or score retrieval fails, no export is created.
- If all 66 games are final, the browser downloads `Commiss-Pool-Week8-SCORE-EXPORT.json`.
- Export includes all source pool data, all 136 entries and their picks, per-entry Week 8 results, bonus status, all 66 final scores, 4-0 candidate list, bonus survivors/eliminations, and the unchanged historical data for Weeks 1–7.
- Service worker cache key bumped to v22.

## Important
This is a score snapshot/export build, not a historical lock. Do not treat Week 8 as locked until the exported JSON is uploaded and checked against the app's payout rules and historical records. The export does not independently award or calculate cash payouts; it records the score results and 4-0 candidates for reconciliation before freezing.

## Validation performed
- `app.js` passes `node --check`.
- Source data contains 136 entries, 66 games, 544 regular picks, 6 bonus picks, and historical week keys 1–7.
- Existing `data.js` and historical data were preserved unchanged.
