# Week 9 Picks Loaded

Built from the approved Week 9 Lines Loaded ZIP and the commissioner-uploaded `Week 9 Picks.xlsx`.

## Verification
- 136 of 136 entries matched by entry name (trimmed whitespace; no unmatched entries).
- 544 regular selections loaded: 477 spread picks and 67 game-total picks.
- Exactly 4 picks per entry; no duplicate selections within an entry.
- 0 bonus picks submitted; Week 9 bonus contest remains paused and returns Week 10.
- All 72 Week 9 games retained (15 NFL, 57 NCAA).
- Home/away and favorite mappings from the approved Week 9 lines build retained, including Falcons home vs. Bengals and New Mexico St home vs. Liberty.
- Historical data and Week 8 close/payout records retained from the approved base ZIP.

## Pick encoding
Spread selections are stored as `kind: spread` with the selected team and game ID.
Selections ending in OVER or UNDER are stored as `kind: total` with the game ID and direction.
