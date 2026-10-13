# Commiss Pool — Week 6 Build

## Week 6 active slate
- 69 games total: 14 NFL and 55 NCAA.
- Dates: October 15–19, 2026.
- Bonus Max: 4.
- Texans are away and Jaguars are home for the October 18 game.
- Week 6 picks are blank, ready for the new lines/picks workflow.
- All 136 entry IDs/names are retained. ESPN scoring/feed logic, Favorites behavior, and Snake Bear Easter egg are retained from the supplied working build.

## Week 5 carry-forward status
- Week 5 game lines and all 136 saved entries/picks are archived in `history[5]`.
- Confirmed weekly bounty winners: Angry Beavers, B&M, Slime Pigs, Sloppy Steaks, The Future Champ, and Tommy Po. The $2,500 bounty is split six ways at $416.67 each (rounded to cents).
- The uploaded Week 5 baseline did not include a final score map or finalized historical result rows. Those scores, each entry’s final 4-pick record, and the bonus survivor/elimination outcome are not fabricated. Week 5 is therefore marked pending in the history controls until the score snapshot can be reconstructed and validated.
- The score merge now includes `history[5].scores` so the app will consume the Week 5 score snapshot once populated.

## Validation performed
- Parsed the embedded data JSON successfully.
- Verified 69 active games (14 NFL / 55 NCAA), Bonus Max 4, all 136 entries, and Jaguars home vs. Texans.
- Preserved Weeks 1–4 history from the Week 6 build ZIP.
