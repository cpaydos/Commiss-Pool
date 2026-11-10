# Week 10 Build — Second Half Launch

## Baseline and frozen history
- Built from the supplied approved `Week 9 Start.zip` baseline.
- Week 9 score export verified: 72/72 games final, 136 entries, 544 regular picks, and all submitted picks match the baseline roster exactly.
- Week 9 is frozen in `POOL_DATA.history[9]`, including all 72 final scores, all 136 entries and their four picks, per-entry results, and the nine 4–0 bounty winners.
- Week 9 bounty: $2,500 split equally among nine winners ($277.777777… official points per winner; display rounded to cents).
- Week 9 had no bonus contest. The first-half survivor award remains recorded in Week 8 for SLIME PIGS ($3,000).
- Weeks 1–8 history and payout records are retained unchanged.

## Week 10 current state
- Second half starts at Week 10. Current week is 10; Weeks 1–9 are locked.
- Roster retained: 136 entries.
- Week 10 lines loaded: 75 games (14 NFL, 61 NCAA).
- Bonus max: 9 points. All 136 active entries are eligible at the start of the second-half bonus contest.
- Week 10 entry picks and bonus picks are intentionally blank; no Week 10 picks file was supplied in this build.
- Bye teams: Bears, Broncos, Eagles, Buccaneers.
- Lions are explicitly treated as the home team, despite not being capitalized on the lines sheet.
- First-half standings were cross-checked against `First Half Scores.xlsx`: all 136 entry totals and all ranking positions match the workbook.
- Week 10 Overall Leaderboard defaults to Second Half. Ranking is by wins, then losses, then alphabetical team name for ties.
- Back-to-back 0–4 tracking starts fresh in Week 10; no Week 9 / first-half streak is carried into the second half.

## Commissioner workflow
- Close Week / Export is tucked under the collapsed Commissioner Admin section.
- No PIN prompt was added, per commissioner direction. This is a convenience placement, not access control.

## Files
- `index.html`, `app.js`, `data.js`, `styles.css`, `sw.js` — Week 10 app build.
- Historical README files and static assets from the approved baseline are retained.

## Validation
- `data.js` and `app.js` pass Node syntax checks.
- Data counts: 136 entries, 75 Week 10 games, 72 frozen Week 9 games/scores, 544 frozen Week 9 picks.
- Week 9 4–0 winner count matches the score export (9).
- First-half standings match the supplied workbook across all 136 entries.
