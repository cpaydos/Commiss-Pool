# Commiss Pool — Week 7 Build

## Source of truth
- Built directly from `Commiss-Pool-Week6-FROZEN-HISTORY(1).zip`.
- The original Week 6 ZIP is preserved separately as the locked backup.
- `DATA.history[1]` through `DATA.history[6]` and the Week 6 frozen scores, rows, payout record, picks, and entry identities were preserved.
- Active entries are reset for Week 7 only: the 136 entry IDs/names remain, and Week 7 picks/bonus picks are blank until supplied.

## Week 7 lines
- 66 total games: 14 NFL + 52 NCAA.
- NFL: 14 games; NCAA: 52 games.
- Bonus Max: 3.
- Bye teams: Bills, Chargers, Commanders, Jaguars.
- Saints are explicitly assigned as the home team against the Steelers, despite capitalization in the PDF.
- Favorites remain the left-hand team from the line sheet; home/away assignments follow the line sheet's capitalization convention, with the Saints exception applied as instructed.

## Week 6 verification
- 69 games and 69 score records; all 69 statuses are final (0 remaining).
- 136 entries and 136 historical rows.
- No missing or extra Week 6 score keys; no Week 6 pick/bonus game references point to missing games.
- Exactly two 4–0 entries: HONK SHOE (ID 59) and YETI (ID 136).
- Week 6 bounty remains $2,500 total, $1,250 each, as recorded in the frozen payout history.
- Week 6 remains in historical data and is included among locked weeks.

## Preserved architecture
- Existing ESPN live-feed implementation and app features retained.
- Favorites remain presentation-only; no Favorites changes were made to standings, payouts, or bonus eligibility logic.
- No speculative changes to the scoring or live-feed matching rules.
