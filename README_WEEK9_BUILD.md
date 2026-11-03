# COMMISS POOL — WEEK 9 LINES-LOADED BUILD

Baseline: user-uploaded `Commiss-Pool-Week8-CLOSE-EXPORT-BUILD(1).zip` plus verified `Commiss-Pool-Week8-SCORE-EXPORT(1).json`.
Active week: 9
Games: 72 total (15 NFL, 57 NCAA)
Entries: 136
Week 9 picks: not loaded yet (0 regular picks; 0 bonus picks)
Bonus: paused for Week 9; returns Week 10.

## Week 8 freeze
- 66 / 66 games final; all 544 regular pick results independently recalculated and matched.
- 17 entries went 4–0 and split the $2,500 weekly bounty.
- Week 8 bonus field: 6 entered, 5 eliminated, 1 survivor (SLIME PIGS).
- First-half survivor payout recorded to SLIME PIGS: $3,000.
- Weeks 1–7 historical data retained; Week 8 archived as final history.

## Week 9 line handling
- Favorite is always the team in the left column.
- Capitalized team name determines the home team, except explicit commissioner overrides: Falcons are home vs. Bengals; New Mexico St is home vs. Liberty.
- NFL: 15 games; NCAA: 57 games; total: 72 games.
- Bye teams: Titans, Steelers.
- No Week 9 bonus picks; next bonus competition starts Week 10.

## Technical checks
- `app.js` passes `node --check`.
- `data.js` contains 72 unique Week 9 game IDs, 136 unique entry IDs, and Week 8 history with 66 final score records.
- Service worker cache bumped to `commiss-shell-v23-week9-lines-loaded`.
- Week 9 picks are intentionally blank pending the commissioner pick sheet.
